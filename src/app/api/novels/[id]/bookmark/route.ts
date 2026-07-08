import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";

// GET — kiểm tra user đã bookmark chưa
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ bookmarked: false });

  const [novels] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
    [paramId, paramId]
  );
  if (novels.length === 0) return NextResponse.json({ bookmarked: false });
  const novelId = novels[0].id;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM bookmark WHERE userId = ? AND novelId = ? LIMIT 1`,
    [userId, novelId]
  );
  return NextResponse.json({ bookmarked: rows.length > 0 });
}

// POST — toggle bookmark
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
    `SELECT id FROM bookmark WHERE userId = ? AND novelId = ? LIMIT 1`,
    [userId, novelId]
  );

  if (rows.length > 0) {
    await pool.query(`DELETE FROM bookmark WHERE userId = ? AND novelId = ?`, [userId, novelId]);
    return NextResponse.json({ bookmarked: false });
  } else {
    await pool.query(
      `INSERT INTO bookmark (id, userId, novelId, createdAt) VALUES (?, ?, ?, NOW(3))`,
      [crypto.randomUUID(), userId, novelId]
    );
    return NextResponse.json({ bookmarked: true });
  }
}
