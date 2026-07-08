import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterNumber: string }> }
) {
  try {
    const { id: paramId, chapterNumber } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const [novels] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
      [paramId, paramId]
    );
    if (novels.length === 0) return NextResponse.json({ error: "Không tìm thấy truyện" }, { status: 404 });
    const novelId = novels[0].id;

    // Lấy thông tin chương
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT id, isLocked, price FROM chapter WHERE novelId = ? AND chapterNumber = ? LIMIT 1`,
      [novelId, parseInt(chapterNumber, 10)]
    );

    if (chapters.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy chương" }, { status: 404 });
    }

    const chapter = chapters[0];

    if (!chapter.isLocked) {
      return NextResponse.json({ error: "Chương này miễn phí" }, { status: 400 });
    }

    // Kiểm tra đã mua chưa
    const [existing] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM purchase WHERE userId = ? AND chapterId = ? LIMIT 1`,
      [userId, chapter.id]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Đã mua rồi" });
    }

    // Kiểm tra số xu
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT coins FROM user WHERE id = ? LIMIT 1`,
      [userId]
    );
    if (users.length === 0) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    const userCoins = users[0].coins;
    if (userCoins < chapter.price) {
      return NextResponse.json({
        error: "Không đủ xu",
        required: chapter.price,
        current: userCoins,
      }, { status: 402 });
    }

    // Trừ xu + tạo purchase trong transaction
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE user SET coins = coins - ?, updatedAt = NOW() WHERE id = ?`,
        [chapter.price, userId]
      );

      await conn.query(
        `INSERT INTO purchase (id, userId, chapterId, pricePaid, purchasedAt) VALUES (?, ?, ?, ?, NOW())`,
        [randomUUID(), userId, chapter.id, chapter.price]
      );

      await conn.commit();
      conn.release();
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }

    // Lấy coins mới
    const [updated] = await pool.query<RowDataPacket[]>(
      `SELECT coins FROM user WHERE id = ? LIMIT 1`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: "Mua chương thành công",
      coinsRemaining: updated[0]?.coins ?? 0,
    });
  } catch (error) {
    console.error("Purchase chapter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
