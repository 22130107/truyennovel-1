import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";

// GET — kiểm tra user đã like chưa
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ liked: false });

  const [novels] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
    [paramId, paramId]
  );
  if (novels.length === 0) return NextResponse.json({ liked: false });
  const novelId = novels[0].id;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM liked_novel WHERE userId = ? AND novelId = ? LIMIT 1`,
    [userId, novelId]
  );
  return NextResponse.json({ liked: rows.length > 0 });
}

// POST — toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [novels] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
    [paramId, paramId]
  );
  if (novels.length === 0) return NextResponse.json({ error: "Không tìm thấy truyện" }, { status: 404 });
  const novelId = novels[0].id;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM liked_novel WHERE userId = ? AND novelId = ? LIMIT 1`,
    [userId, novelId]
  );

  if (rows.length > 0) {
    await pool.query(`DELETE FROM liked_novel WHERE userId = ? AND novelId = ?`, [userId, novelId]);
    return NextResponse.json({ liked: false });
  } else {
    await pool.query(
      `INSERT INTO liked_novel (id, userId, novelId, createdAt) VALUES (?, ?, ?, NOW(3))`,
      [crypto.randomUUID(), userId, novelId]
    );
    return NextResponse.json({ liked: true });
  }
}
