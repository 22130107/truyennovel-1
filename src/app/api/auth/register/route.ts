import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM user WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate unique ID
    const id = crypto.randomUUID();

    // Insert new user
    await pool.query(
      'INSERT INTO user (id, username, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [id, username, email, passwordHash]
    );

    return NextResponse.json({ message: 'Đăng ký thành công.', userId: id }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống.' }, { status: 500 });
  }
}
