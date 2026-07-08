import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(req: Request) {
  try {
    const [novels] = await pool.query<RowDataPacket[]>(`
      SELECT n.id, n.title, n.author, n.coverUrl, n.status, n.views, n.createdAt,
             COUNT(c.id) as chapterCount,
             MAX(c.price) as maxPrice
      FROM novel n
      LEFT JOIN chapter c ON n.id = c.novelId
      GROUP BY n.id
      ORDER BY n.createdAt DESC
    `);

    return NextResponse.json(novels, { status: 200 });
  } catch (error) {
    console.error('Fetch Novels Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, author, editor, description, status, coverUrl, posterUrl, categories } = body;

    if (!title || !author) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc (Tên truyện, Tác giả)' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const rawSlug = slugify(title) || id.substring(0, 8);
    const slug = `${rawSlug}-${id.substring(0, 4)}`;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Insert novel
      await connection.query<ResultSetHeader>(
        `INSERT INTO novel (id, title, slug, description, coverUrl, posterUrl, author, editor, status, views, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
        [id, title, slug, description || '', coverUrl || null, posterUrl || null, author, editor?.trim() || null, status || 'ONGOING']
      );

      // 2. Handle categories (Genres)
      if (categories && Array.isArray(categories) && categories.length > 0) {
        for (const cat of categories) {
          const catSlug = slugify(cat);
          const catId = crypto.randomUUID();

          // Try to insert genre if not exists
          await connection.query(
            `INSERT IGNORE INTO genre (id, name, slug) VALUES (?, ?, ?)`,
            [catId, cat, catSlug]
          );

          // Find the genre ID (whether it was just inserted or already existed)
          const [genreRows] = await connection.query<RowDataPacket[]>(
            `SELECT id FROM genre WHERE slug = ?`,
            [catSlug]
          );

          if (genreRows.length > 0) {
            const actualGenreId = genreRows[0].id;
            // Link novel and genre
            await connection.query(
              `INSERT IGNORE INTO novelgenre (novelId, genreId) VALUES (?, ?)`,
              [id, actualGenreId]
            );
          }
        }
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ message: 'Thêm truyện thành công!', id }, { status: 201 });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Create Novel Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống khi lưu truyện.' }, { status: 500 });
  }
}
