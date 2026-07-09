import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET /api/library?userId=xxx&tab=all|reading|completed|saved|liked|bookmarked|purchased
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const tab = req.nextUrl.searchParams.get("tab") || "all";

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let rows: RowDataPacket[] = [];

    if (tab === "saved") {
      // Đã lưu (Theo dõi) — từ bảng bookmark
      [rows] = await pool.query<RowDataPacket[]>(
        `SELECT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                COUNT(DISTINCT c.id) AS chapterCount,
                NULL AS lastChapter,
                'SAVED' AS libStatus,
                b.createdAt AS updatedAt
         FROM bookmark b
         JOIN novel n ON n.id = b.novelId
         LEFT JOIN rating r ON r.novelId = n.id
         LEFT JOIN chapter c ON c.novelId = n.id
         WHERE b.userId = ?
         GROUP BY n.id, b.createdAt
         ORDER BY b.createdAt DESC`,
        [userId]
      );
    } else if (tab === "purchased") {
      // Đã mua — distinct novels từ bảng purchase
      [rows] = await pool.query<RowDataPacket[]>(
        `SELECT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                COUNT(DISTINCT c.id) AS chapterCount,
                NULL AS lastChapter,
                'PURCHASED' AS libStatus,
                MAX(p.purchasedAt) AS updatedAt
         FROM purchase p
         JOIN chapter ch ON ch.id = p.chapterId
         JOIN novel n ON n.id = ch.novelId
         LEFT JOIN rating r ON r.novelId = n.id
         LEFT JOIN chapter c ON c.novelId = n.id
         WHERE p.userId = ?
         GROUP BY n.id
         ORDER BY MAX(p.purchasedAt) DESC`,
        [userId]
      );
    } else if (tab === "liked") {
      // Yêu thích — từ bảng liked_novel
      [rows] = await pool.query<RowDataPacket[]>(
        `SELECT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                COUNT(DISTINCT c.id) AS chapterCount,
                NULL AS lastChapter,
                'LIKED' AS libStatus,
                l.createdAt AS updatedAt
         FROM liked_novel l
         JOIN novel n ON n.id = l.novelId
         LEFT JOIN rating r ON r.novelId = n.id
         LEFT JOIN chapter c ON c.novelId = n.id
         WHERE l.userId = ?
         GROUP BY n.id, l.createdAt
         ORDER BY l.createdAt DESC`,
        [userId]
      );
    } else {
      // reading_progress based tabs
      // reading_progress based tabs
      let statusFilter = "";
      if (tab === "reading") statusFilter = "AND rp.status = 'READING'";
      else if (tab === "completed") statusFilter = "AND rp.status = 'COMPLETED'";
      
      // "all" — no filter, show reading_progress + bookmarked + purchased + liked


      if (tab === "all") {
        // Union: reading_progress + bookmarks + purchased novels
        [rows] = await pool.query<RowDataPacket[]>(
          `SELECT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                  ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                  COUNT(DISTINCT c.id) AS chapterCount,
                  rp.lastChapter,
                  rp.status AS libStatus,
                  rp.updatedAt
           FROM reading_progress rp
           JOIN novel n ON n.id = rp.novelId
           LEFT JOIN rating r ON r.novelId = n.id
           LEFT JOIN chapter c ON c.novelId = n.id
           WHERE rp.userId = ?
           GROUP BY n.id, rp.lastChapter, rp.status, rp.updatedAt
           ORDER BY rp.updatedAt DESC`,
          [userId]
        );
      } else {
        [rows] = await pool.query<RowDataPacket[]>(
          `SELECT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                  ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                  COUNT(DISTINCT c.id) AS chapterCount,
                  rp.lastChapter,
                  rp.status AS libStatus,
                  rp.updatedAt
           FROM reading_progress rp
           JOIN novel n ON n.id = rp.novelId
           LEFT JOIN rating r ON r.novelId = n.id
           LEFT JOIN chapter c ON c.novelId = n.id
           WHERE rp.userId = ? ${statusFilter}
           GROUP BY n.id, rp.lastChapter, rp.status, rp.updatedAt
           ORDER BY rp.updatedAt DESC`,
          [userId]
        );
      }
    }

    return NextResponse.json(rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      author: row.author,
      coverUrl: row.coverUrl || "",
      status: row.status,
      rating: parseFloat(row.rating) || 0,
      chapterCount: row.chapterCount || 0,
      lastChapter: row.lastChapter || null,
      libStatus: row.libStatus,
      updatedAt: row.updatedAt,
    })));
  } catch (err) {
    console.error("GET /api/library error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
