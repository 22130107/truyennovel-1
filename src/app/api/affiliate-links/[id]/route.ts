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
    const { userId, novelId } = await req.json();

    if (!userId || !novelId) {
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

    // Kiểm tra novel có tồn tại
    const [novels] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM novel WHERE id = ? LIMIT 1`,
      [novelId]
    );
    if (novels.length === 0) {
      return NextResponse.json({ error: "Truyện không tồn tại" }, { status: 404 });
    }

    // Ghi nhận mở khóa toàn bộ truyện trong 24h
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa các bản ghi cũ của user cho truyện này (tránh rác)
      await conn.query(
        `DELETE FROM novel_unlock_affiliate WHERE userId = ? AND novelId = ?`,
        [userId, novelId]
      );

      // Thêm bản ghi mới
      await conn.query(
        `INSERT INTO novel_unlock_affiliate (id, userId, novelId, unlockedAt) VALUES (?, ?, ?, NOW())`,
        [randomUUID(), userId, novelId]
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
