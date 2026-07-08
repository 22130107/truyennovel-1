import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterNumber: string }> }
) {
  try {
    const { id: paramId, chapterNumber } = await params;
    const num = parseInt(chapterNumber, 10);

    // Lấy userId từ query param (client gửi lên)
    const userId = req.nextUrl.searchParams.get("userId") || null;

    // Giải quyết novelId từ UUID hoặc slug
    const [novels] = await pool.query<RowDataPacket[]>(
      `SELECT id, title FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
      [paramId, paramId]
    );
    if (novels.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy truyện" }, { status: 404 });
    }
    const novelId = novels[0].id;
    const novelTitle = novels[0].title;

    // Lấy thông tin chương
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT id, chapterNumber, title, content, isLocked, price, createdAt
       FROM chapter
       WHERE novelId = ? AND chapterNumber = ?
       LIMIT 1`,
      [novelId, num]
    );

    if (chapters.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy chương" }, { status: 404 });
    }

    const chapter = chapters[0];

    // Lấy chương trước / sau
    const [prev] = await pool.query<RowDataPacket[]>(
      `SELECT chapterNumber FROM chapter WHERE novelId = ? AND chapterNumber < ? ORDER BY chapterNumber DESC LIMIT 1`,
      [novelId, num]
    );
    const [next] = await pool.query<RowDataPacket[]>(
      `SELECT chapterNumber FROM chapter WHERE novelId = ? AND chapterNumber > ? ORDER BY chapterNumber ASC LIMIT 1`,
      [novelId, num]
    );



    // Kiểm tra đã mua chưa
    let isPurchased = false;
    if (userId && chapter.isLocked) {
      const [purchases] = await pool.query<RowDataPacket[]>(
        `SELECT id FROM purchase WHERE userId = ? AND chapterId = ? LIMIT 1`,
        [userId, chapter.id]
      );
      isPurchased = purchases.length > 0;
    }

    // Nếu bị khóa và chưa mua → trả về thông tin nhưng không có content
    if (chapter.isLocked && !isPurchased) {
      return NextResponse.json({
        id: chapter.id,
        novelId,
        novelTitle,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        isLocked: true,
        isPurchased: false,
        price: chapter.price,
        content: null,
        prevChapter: prev[0]?.chapterNumber ?? null,
        nextChapter: next[0]?.chapterNumber ?? null,
      });
    }

    // Tăng view cho novel
    await pool.query(`UPDATE novel SET views = views + 1 WHERE id = ?`, [novelId]);

    return NextResponse.json({
      id: chapter.id,
      novelId,
      novelTitle,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      isLocked: Boolean(chapter.isLocked),
      isPurchased,
      price: chapter.price,
      content: chapter.content,
      prevChapter: prev[0]?.chapterNumber ?? null,
      nextChapter: next[0]?.chapterNumber ?? null,
    });
  } catch (error) {
    console.error("GET chapter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
