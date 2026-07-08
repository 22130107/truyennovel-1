import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, coins, role, createdAt FROM user ORDER BY createdAt DESC'
    );

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống.' }, { status: 500 });
  }
}
