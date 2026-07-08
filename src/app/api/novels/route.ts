import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET /api/novels?type=bookmarked|top-viewed|newest&limit=5
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "newest";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);

    let orderBy = "n.createdAt DESC";
    if (type === "top-viewed") orderBy = "n.views DESC";
    if (type === "bookmarked") orderBy = "bookmarkCount DESC";

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         n.id, n.title, n.slug, n.author, n.coverUrl, n.posterUrl, n.status, n.views,
         ROUND(COALESCE(AVG(r.score), 0), 1) AS rating,
         COUNT(DISTINCT c.id) AS chapterCount,
         COUNT(DISTINCT b.id) AS bookmarkCount,
         GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ',') AS genres
       FROM novel n
       LEFT JOIN chapter c ON c.novelId = n.id
       LEFT JOIN rating r ON r.novelId = n.id
       LEFT JOIN bookmark b ON b.novelId = n.id
       LEFT JOIN novelgenre ng ON ng.novelId = n.id
       LEFT JOIN genre g ON g.id = ng.genreId
       GROUP BY n.id
       ORDER BY ${orderBy}
       LIMIT ?`,
      [limit]
    );

    const novels = rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      author: row.author,
      coverUrl: row.coverUrl || "",
      posterUrl: row.posterUrl || "",
      status: row.status === "COMPLETED" ? "Hoàn thành" : row.status === "PAUSED" ? "Tạm dừng" : "Đang ra",
      rating: parseFloat(row.rating) || 0,
      chapterCount: row.chapterCount || 0,
      bookmarkCount: row.bookmarkCount || 0,
      category: row.genres ? row.genres.split(",")[0] : "Chưa phân loại",
    }));

    return NextResponse.json(novels);
  } catch (error) {
    console.error("GET /api/novels error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
