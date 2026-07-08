import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";
import { getSettings } from "@/lib/settings";

// Gói nạp tiền hợp lệ (VNĐ)
const TOPUP_PACKAGES: Record<number, { price: number }> = {
  1: { price: 20000  },
  2: { price: 50000  },
  3: { price: 100000 },
  4: { price: 200000 },
};

export async function POST(req: NextRequest) {
  try {
    const { packageId, userId } = await req.json();

    if (!packageId || !userId) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const pkg = TOPUP_PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json({ error: "Gói nạp không hợp lệ" }, { status: 400 });
    }

    // Đọc settings từ DB
    const settings = await getSettings();

    // Tính số xu dựa theo tỷ giá + bonus
    const baseCoins = Math.floor(pkg.price / settings.exchange_rate);
    const bonusCoins = Math.floor(baseCoins * settings.bonus_percent / 100);
    const totalCoins = baseCoins + bonusCoins;

    // Kiểm tra user tồn tại
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM user WHERE id = ? LIMIT 1",
      [userId]
    );
    if (users.length === 0) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    // Tạo mã giao dịch duy nhất (dùng làm nội dung chuyển khoản)
    // SePay sẽ match nội dung này để xác định giao dịch
    const transactionId = randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const paymentRef = `NAP${transactionId}`; // VD: NAPabc123def456

    // Lưu transaction vào DB với trạng thái PENDING
    const dbId = randomUUID();
    const now = new Date();
    await pool.query(
      `INSERT INTO \`transaction\` (id, userId, amountXu, amountMoney, paymentMethod, paymentRef, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'VIETQR', ?, 'PENDING', ?, ?)`,
      [dbId, userId, totalCoins, pkg.price, paymentRef, now, now]
    );

    // Tạo URL QR VietQR từ settings DB
    const accountName = encodeURIComponent(settings.bank_name);
    const description = encodeURIComponent(paymentRef);
    const qrUrl = `https://img.vietqr.io/image/${settings.bank_id}-${settings.bank_account}-compact2.png?amount=${pkg.price}&addInfo=${description}&accountName=${accountName}`;

    return NextResponse.json({
      transactionId: dbId,
      paymentRef,
      amount: pkg.price,
      coins: totalCoins,
      bonusCoins,
      qrUrl,
      bankId:        settings.bank_id,
      accountNumber: settings.bank_account,
      accountName:   settings.bank_name,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
