import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT g.name, g.slug, COUNT(ng.novelId) AS novelCount
       FROM genre g
       LEFT JOIN novelgenre ng ON ng.genreId = g.id
       GROUP BY g.id
       ORDER BY novelCount DESC, g.name ASC`
    );

    return NextResponse.json(rows.map((r) => ({ name: r.name, slug: r.slug })));
  } catch (error) {
    console.error("GET genres error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
