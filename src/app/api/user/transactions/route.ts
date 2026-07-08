import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Thiếu UserId' }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, amountXu, amountMoney, paymentMethod, paymentRef, status, createdAt 
       FROM transaction 
       WHERE userId = ? 
       ORDER BY createdAt DESC`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Fetch Transactions Error:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống: ' + error.message }, { status: 500 });
  }
}
