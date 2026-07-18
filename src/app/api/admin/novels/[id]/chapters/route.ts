import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const novelId = resolvedParams.id;

    // 1. Fetch novel info
    const [novelRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title FROM novel WHERE id = ?`,
      [novelId]
    );

    if (novelRows.length === 0) {
      return NextResponse.json({ message: 'Không tìm thấy truyện.' }, { status: 404 });
    }

    const novel = novelRows[0];

    // 2. Fetch chapters
    const [chapterRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, chapterNumber, title, isLocked, price, createdAt
       FROM chapter
       WHERE novelId = ?
       ORDER BY chapterNumber ASC`,
      [novelId]
    );

    // Format chapters for UI
    const formattedChapters = chapterRows.map(ch => ({
      id: ch.id,
      number: ch.chapterNumber,
      title: ch.title,
      isPaid: Boolean(ch.isLocked),
      price: ch.price,
      views: 0, // Not in schema, defaulting to 0
      status: 'Published', // Not in schema, defaulting
      date: new Date(ch.createdAt).toLocaleDateString('vi-VN')
    }));

    return NextResponse.json({ novel, chapters: formattedChapters }, { status: 200 });
  } catch (error) {
    console.error('Fetch Novel Chapters Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống.' }, { status: 500 });
  }
}

import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const novelId = resolvedParams.id;
    
    if (!novelId) return NextResponse.json({ message: 'Missing Novel ID' }, { status: 400 });

    const body = await req.json();

    // Batch create chapters
    if (body.chapters && Array.isArray(body.chapters)) {
      return await batchCreateChapters(novelId, body.chapters);
    }

    // Single chapter create
    const { title, content, chapterNumber, isLocked, price } = body;

    if (!content || chapterNumber === undefined) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc (Nội dung, Số chương)' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const finalTitle = title?.trim() || "";

    const connection = await pool.getConnection();
    try {
      await connection.query(
        `INSERT INTO chapter (id, novelId, title, content, chapterNumber, isLocked, price, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [id, novelId, finalTitle, content, chapterNumber, isLocked ? 1 : 0, price || 0]
      );

      connection.release();
      return NextResponse.json({ message: 'Thêm chương thành công.', id }, { status: 201 });
    } catch (err: any) {
      connection.release();
      if (err.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Số chương đã tồn tại cho truyện này.' }, { status: 400 });
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Create Chapter Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống: ' + error.message }, { status: 500 });
  }
}

async function batchCreateChapters(novelId: string, chapters: any[]) {
  if (chapters.length === 0) {
    return NextResponse.json({ message: 'Danh sách chương rỗng.' }, { status: 400 });
  }

  for (const ch of chapters) {
    if (!ch.content || ch.chapterNumber === undefined) {
      return NextResponse.json({ message: `Chương ${ch.chapterNumber ?? '?'} thiếu nội dung hoặc số chương.` }, { status: 400 });
    }
  }

  const connection = await pool.getConnection();
  try {
    const inserted: { chapterNumber: number; title: string }[] = [];
    for (const ch of chapters) {
      const id = crypto.randomUUID();
      const finalTitle = ch.title?.trim() || "";
      await connection.query(
        `INSERT INTO chapter (id, novelId, title, content, chapterNumber, isLocked, price, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [id, novelId, finalTitle, ch.content, ch.chapterNumber, ch.isLocked ? 1 : 0, ch.price || 0]
      );
      inserted.push({ chapterNumber: ch.chapterNumber, title: finalTitle });
    }

    connection.release();
    return NextResponse.json({
      message: `Đã thêm thành công ${inserted.length} chương.`,
      count: inserted.length,
      chapters: inserted
    }, { status: 201 });
  } catch (err: any) {
    connection.release();
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Một trong các số chương đã tồn tại cho truyện này.' }, { status: 400 });
    }
    console.error('Batch Create Chapters Error:', err);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống: ' + err.message }, { status: 500 });
  }
}
