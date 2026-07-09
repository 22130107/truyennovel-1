import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, url, title, description, imageUrl, isActive, createdAt, updatedAt
       FROM affiliate_link ORDER BY createdAt DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET affiliate links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, title, description, imageUrl } = await req.json();
    if (!url || !title) {
      return NextResponse.json({ error: "Thiếu URL hoặc tiêu đề" }, { status: 400 });
    }
    const id = randomUUID();
    await pool.query(
      `INSERT INTO affiliate_link (id, url, title, description, imageUrl, isActive, updatedAt)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [id, url, title, description || null, imageUrl || null]
    );
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("POST affiliate link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
