import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, description, posterUrl, coverUrl, author, views, status,
              (SELECT COUNT(*) FROM chapter WHERE novelId = novel.id) AS chapterCount
       FROM novel
       ORDER BY views DESC
       LIMIT 5`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("top-viewed error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
