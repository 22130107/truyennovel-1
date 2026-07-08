import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, status, amountXu, amountMoney, paymentRef, createdAt, updatedAt
       FROM \`transaction\`
       WHERE id = ?
       LIMIT 1`,
      [transactionId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const tx = rows[0];

    // Tự động hủy giao dịch PENDING quá 15 phút
    if (tx.status === "PENDING") {
      const createdAt = new Date(tx.createdAt).getTime();
      const now = Date.now();
      if (now - createdAt > 15 * 60 * 1000) {
        await pool.query(
          `UPDATE \`transaction\` SET status = 'CANCELLED', updatedAt = ? WHERE id = ?`,
          [new Date(), transactionId]
        );
        tx.status = "CANCELLED";
      }
    }

    return NextResponse.json({
      id: tx.id,
      status: tx.status,
      amountXu: tx.amountXu,
      amountMoney: tx.amountMoney,
      paymentRef: tx.paymentRef,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
