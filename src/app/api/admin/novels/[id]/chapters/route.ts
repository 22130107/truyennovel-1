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
    const { title, content, chapterNumber, isLocked, price } = body;

    if (!content || chapterNumber === undefined) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc (Nội dung, Số chương)' }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const finalTitle = title?.trim() || null;

    const connection = await pool.getConnection();
    try {
      await connection.query(
        `INSERT INTO chapter (id, novelId, title, content, chapterNumber, isLocked, price, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [id, novelId, finalTitle, content, chapterNumber, isLocked ? 1 : 0, price || 0]
      );

      connection.release();
      return NextResponse.json({ message: 'Thêm chương thành công.' }, { status: 201 });
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
