import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

/**
 * SePay Webhook - nhận thông báo giao dịch từ SePay
 *
 * SePay gửi POST request với body JSON khi có giao dịch mới.
 * Docs: https://my.sepay.vn/userapi/transactions/list
 *
 * Cấu hình webhook trên SePay:
 *   URL: https://yourdomain.com/api/payment/webhook
 *   Loại giao dịch: Tiền vào
 *   Định dạng: JSON
 */
export async function POST(req: NextRequest) {
  try {
    // Xác thực webhook bằng API token của SePay
    // SePay gửi header: Authorization: Apikey <token>
    const authHeader = req.headers.get("Authorization");
    const expectedToken = process.env.SEPAY_API_TOKEN;

    if (expectedToken && authHeader !== `Apikey ${expectedToken}`) {
      console.warn("Webhook: Unauthorized request. Got:", authHeader);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("SePay Webhook received:", JSON.stringify(body));

    /*
     * Cấu trúc body SePay gửi về (JSON):
     * {
     *   id: number,
     *   gateway: string,           // tên ngân hàng
     *   transactionDate: string,   // ngày giao dịch
     *   accountNumber: string,     // số tài khoản nhận
     *   code: string | null,       // mã giao dịch ngân hàng
     *   content: string,           // nội dung chuyển khoản ← dùng để match
     *   transferType: "in" | "out",
     *   transferAmount: number,    // số tiền (VND)
     *   accumulated: number,
     *   subAccount: string | null,
     *   referenceCode: string,
     *   description: string,
     * }
     */

    const {
      transferType,
      transferAmount,
      content,
      referenceCode,
    } = body;

    // Chỉ xử lý giao dịch tiền vào
    if (transferType !== "in") {
      return NextResponse.json({ success: true, message: "Ignored: not incoming" });
    }

    if (!content || !transferAmount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Tìm paymentRef trong nội dung chuyển khoản
    // Nội dung có thể là "NAP abc123 ..." hoặc chứa mã ở bất kỳ vị trí nào
    const contentUpper = content.toUpperCase();

    // Tìm transaction PENDING khớp với nội dung
    const [transactions] = await pool.query<RowDataPacket[]>(
      `SELECT id, userId, amountXu, amountMoney, paymentRef, status
       FROM \`transaction\`
       WHERE status = 'PENDING'
         AND paymentMethod = 'VIETQR'
         AND ? LIKE CONCAT('%', paymentRef, '%')
       ORDER BY createdAt DESC
       LIMIT 1`,
      [contentUpper]
    );

    if (transactions.length === 0) {
      console.warn("Webhook: No matching PENDING transaction for content:", content);
      // Trả 200 để SePay không retry, nhưng ghi log để kiểm tra
      return NextResponse.json({ success: true, message: "No matching transaction" });
    }

    const transaction = transactions[0];

    // Kiểm tra số tiền khớp
    if (transferAmount < transaction.amountMoney) {
      console.warn(
        `Webhook: Amount mismatch. Expected ${transaction.amountMoney}, got ${transferAmount}`
      );
      // Cập nhật FAILED nếu số tiền sai
      await pool.query(
        `UPDATE \`transaction\` SET status = 'FAILED', updatedAt = ? WHERE id = ?`,
        [new Date(), transaction.id]
      );
      return NextResponse.json({ success: true, message: "Amount mismatch, marked FAILED" });
    }

    // Cập nhật transaction thành COMPLETED
    const now = new Date();
    await pool.query(
      `UPDATE \`transaction\`
       SET status = 'COMPLETED', paymentRef = ?, updatedAt = ?
       WHERE id = ? AND status = 'PENDING'`,
      [referenceCode || transaction.paymentRef, now, transaction.id]
    );

    // Cộng xu vào tài khoản user
    await pool.query(
      `UPDATE \`user\` SET coins = coins + ?, updatedAt = ? WHERE id = ?`,
      [transaction.amountXu, now, transaction.userId]
    );

    console.log(
      `Webhook: Credited ${transaction.amountXu} coins to user ${transaction.userId} (tx: ${transaction.id})`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Trả 500 để SePay retry
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
