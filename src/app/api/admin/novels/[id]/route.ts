import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import crypto from 'crypto';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const novelId = resolvedParams.id;
    
    if (!novelId) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const [novels] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM novel WHERE id = ?', [novelId]
    );

    if (novels.length === 0) {
      return NextResponse.json({ message: 'Novel not found' }, { status: 404 });
    }

    // Fetch genres
    const [genres] = await pool.query<RowDataPacket[]>(
      `SELECT g.name FROM genre g
       JOIN novelgenre ng ON g.id = ng.genreId
       WHERE ng.novelId = ?`, [novelId]
    );

    const novel = novels[0];
    novel.categories = genres.map(g => g.name);

    return NextResponse.json(novel, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Novel Error:', error);
    return NextResponse.json({ message: 'Lỗi khi tải truyện: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const novelId = resolvedParams.id;
    
    if (!novelId) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const body = await req.json();
    const { title, author, editor, description, status, coverUrl, posterUrl, categories, comboPrice } = body;

    if (!title || !author) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query<ResultSetHeader>(
        `UPDATE novel SET title = ?, description = ?, coverUrl = ?, posterUrl = ?, author = ?, editor = ?, status = ?, comboPrice = ?, updatedAt = NOW() WHERE id = ?`,
        [title, description || '', coverUrl || null, posterUrl || null, author, editor?.trim() || null, status || 'ONGOING', comboPrice ?? null, novelId]
      );

      // Re-link categories
      await connection.query('DELETE FROM novelgenre WHERE novelId = ?', [novelId]);
      
      if (categories && Array.isArray(categories) && categories.length > 0) {
        for (const cat of categories) {
          const catSlug = cat.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
          // Since we can't easily generate UUIDs in mysql query simply here, we reuse crypto or insert ignore
          // Wait, we need crypto. Let's just use simple random or import crypto
          const [genreRows] = await connection.query<RowDataPacket[]>('SELECT id FROM genre WHERE name = ?', [cat]);
          let genreId;
          if (genreRows.length > 0) {
            genreId = genreRows[0].id;
          } else {
            genreId = crypto.randomUUID();
            await connection.query('INSERT IGNORE INTO genre (id, name, slug) VALUES (?, ?, ?)', [genreId, cat, catSlug]);
          }
          await connection.query('INSERT IGNORE INTO novelgenre (novelId, genreId) VALUES (?, ?)', [novelId, genreId]);
        }
      }

      await connection.commit();
      connection.release();
      return NextResponse.json({ message: 'Cập nhật truyện thành công.' }, { status: 200 });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error: any) {
    console.error('Update Novel Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const novelId = resolvedParams.id;
    
    if (!novelId) {
      return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query('DELETE FROM bookmark WHERE novelId = ?', [novelId]);
      await connection.query('DELETE FROM rating WHERE novelId = ?', [novelId]);
      await connection.query('DELETE FROM novelgenre WHERE novelId = ?', [novelId]);
      
      const [chapters] = await connection.query<any[]>('SELECT id FROM chapter WHERE novelId = ?', [novelId]);
      if (chapters.length > 0) {
        const chapterIds = chapters.map(c => c.id);
        await connection.query('DELETE FROM purchase WHERE chapterId IN (?)', [chapterIds]);
        await connection.query('DELETE FROM chapter WHERE novelId = ?', [novelId]);
      }

      const [result] = await connection.query<ResultSetHeader>('DELETE FROM novel WHERE id = ?', [novelId]);

      if (result.affectedRows === 0) {
        throw new Error("Novel not found or already deleted");
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ message: 'Xóa truyện thành công.' }, { status: 200 });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error: any) {
    console.error('Delete Novel Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống khi xóa truyện: ' + error.message }, { status: 500 });
  }
}
