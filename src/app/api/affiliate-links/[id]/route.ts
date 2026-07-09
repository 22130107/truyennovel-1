import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";

// POST /api/affiliate-links/:id — user click link affiliate để mở khóa chương
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, chapterId } = await req.json();

    if (!userId || !chapterId) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    // Kiểm tra link affiliate có tồn tại và active
    const [links] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM affiliate_link WHERE id = ? AND isActive = 1 LIMIT 1`,
      [id]
    );
    if (links.length === 0) {
      return NextResponse.json({ error: "Link affiliate không tồn tại" }, { status: 404 });
    }

    // Kiểm tra chapter có tồn tại
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM chapter WHERE id = ? LIMIT 1`,
      [chapterId]
    );
    if (chapters.length === 0) {
      return NextResponse.json({ error: "Chương không tồn tại" }, { status: 404 });
    }

    // Kiểm tra đã mở khóa chưa (qua purchase)
    const [existing] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM purchase WHERE userId = ? AND chapterId = ? LIMIT 1`,
      [userId, chapterId]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Đã mở khóa trước đó" });
    }

    // Ghi nhận click affiliate và mở khóa chapter
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Ghi nhận click
      await conn.query(
        `INSERT INTO purchase (id, userId, chapterId, pricePaid, purchasedAt) VALUES (?, ?, ?, 0, NOW())`,
        [randomUUID(), userId, chapterId]
      );

      await conn.commit();
      conn.release();
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }

    return NextResponse.json({ success: true, message: "Mở khóa thành công!" });
  } catch (error) {
    console.error("Affiliate click error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
