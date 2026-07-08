import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q      = searchParams.get("q") || "";
    const sort   = searchParams.get("sort") || "default";
    const status = searchParams.get("status") || "all";
    const genre  = searchParams.get("genre") || "";
    const page   = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit  = 18;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const queryParams: (string | number)[] = [];

    if (q) {
      conditions.push("(n.title LIKE ? OR n.author LIKE ?)");
      queryParams.push(`%${q}%`, `%${q}%`);
    }
    if (status !== "all") {
      conditions.push("n.status = ?");
      queryParams.push(status);
    }
    if (genre) {
      conditions.push("EXISTS (SELECT 1 FROM novelgenre ng2 JOIN genre g2 ON g2.id = ng2.genreId WHERE ng2.novelId = n.id AND g2.name = ?)");
      queryParams.push(genre);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "n.createdAt DESC";
    if (sort === "views")    orderBy = "n.views DESC";
    if (sort === "newest")   orderBy = "n.createdAt DESC";
    if (sort === "chapters") orderBy = "chapterCount DESC";

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         n.id, n.title, n.slug, n.author, n.coverUrl, n.status, n.views, n.updatedAt,
         COUNT(DISTINCT c.id) AS chapterCount,
         ROUND(COALESCE(AVG(r.score), 0), 1) AS rating,
         GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ',') AS genres
       FROM novel n
       LEFT JOIN chapter c ON c.novelId = n.id
       LEFT JOIN rating r ON r.novelId = n.id
       LEFT JOIN novelgenre ng ON ng.novelId = n.id
       LEFT JOIN genre g ON g.id = ng.genreId
       ${where}
       GROUP BY n.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const [[{ total }]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT n.id) AS total FROM novel n ${where}`,
      queryParams
    ) as [RowDataPacket[], unknown];

    const novels = rows.map((row) => ({
      id:           row.id,
      title:        row.title,
      slug:         row.slug,
      author:       row.author,
      coverUrl:     row.coverUrl || "",
      status:       row.status,
      views:        row.views || 0,
      chapterCount: row.chapterCount || 0,
      rating:       parseFloat(row.rating) || 0,
      category:     row.genres ? row.genres.split(",")[0] : "",
      updatedAt:    row.updatedAt,
    }));

    return NextResponse.json({ novels, total, page, limit });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ novels: [], total: 0 }, { status: 500 });
  }
}
