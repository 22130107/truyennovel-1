import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET /api/affiliate-links — lấy danh sách link affiliate đang active
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, url, title, description, imageUrl
       FROM affiliate_link WHERE isActive = 1
       ORDER BY createdAt ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET active affiliate links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
