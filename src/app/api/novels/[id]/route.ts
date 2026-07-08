import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params;

    // Novel + thống kê
    const [novels] = await pool.query<RowDataPacket[]>(
      `SELECT
         n.id, n.title, n.slug, n.description, n.coverUrl, n.posterUrl,
         n.author, n.editor, n.status, n.views, n.createdAt, n.updatedAt,
         ROUND(COALESCE(AVG(r.score), 0), 1)  AS avgRating,
         COUNT(DISTINCT r.id)                  AS totalRatings,
         COUNT(DISTINCT b.id)                  AS bookmarkCount,
         COUNT(DISTINCT c.id)                  AS chapterCount
       FROM novel n
       LEFT JOIN rating   r ON r.novelId = n.id
       LEFT JOIN bookmark b ON b.novelId = n.id
       LEFT JOIN chapter  c ON c.novelId = n.id
       WHERE n.id = ? OR n.slug = ?
       GROUP BY n.id`,
      [idOrSlug, idOrSlug]
    );

    if (novels.length === 0) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const novel = novels[0];
    const realId = novel.id; // use realId for all subsequent queries

    // Genres
    const [genres] = await pool.query<RowDataPacket[]>(
      `SELECT g.name FROM genre g
       JOIN novelgenre ng ON g.id = ng.genreId
       WHERE ng.novelId = ?`,
      [realId]
    );

    // Chapters
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT id, chapterNumber, title, isLocked, price, createdAt
       FROM chapter
       WHERE novelId = ?
       ORDER BY chapterNumber ASC`,
      [realId]
    );

    // Lấy userId từ query param để check đã mua chưa
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    let purchasedChapterIds = new Set<string>();
    if (userId) {
      const chapterIds = chapters.map((c) => c.id);
      if (chapterIds.length > 0) {
        const [purchases] = await pool.query<RowDataPacket[]>(
          `SELECT chapterId FROM purchase WHERE userId = ? AND chapterId IN (?)`,
          [userId, chapterIds]
        );
        purchasedChapterIds = new Set(purchases.map((p) => p.chapterId));
      }
    }

    // Rating distribution
    const [dist] = await pool.query<RowDataPacket[]>(
      `SELECT score, COUNT(*) as cnt
       FROM rating WHERE novelId = ?
       GROUP BY score`,
      [realId]
    );

    const scoreMap: Record<number, number> = {};
    for (const d of dist) scoreMap[d.score] = d.cnt;
    const total = novel.totalRatings || 1;
    const distribution = [
      { label: "Xuất sắc", score: 5, percentage: Math.round(((scoreMap[5] || 0) / total) * 100) },
      { label: "Rất tốt",  score: 4, percentage: Math.round(((scoreMap[4] || 0) / total) * 100) },
      { label: "Trung bình", score: 3, percentage: Math.round(((scoreMap[3] || 0) / total) * 100) },
      { label: "Tệ",       score: 2, percentage: Math.round(((scoreMap[2] || 0) / total) * 100) },
      { label: "Rất tệ",   score: 1, percentage: Math.round(((scoreMap[1] || 0) / total) * 100) },
    ];

    // Related novels (cùng thể loại, khác id, lấy 6)
    const genreIds = genres.map((g: RowDataPacket) => g.name);
    let related: RowDataPacket[] = [];
    if (genreIds.length > 0) {
      const [relRows] = await pool.query<RowDataPacket[]>(
        `SELECT DISTINCT n.id, n.title, n.slug, n.author, n.coverUrl, n.status,
                ROUND(COALESCE(AVG(r.score),0),1) AS rating,
                COUNT(DISTINCT c.id) AS chapterCount,
                MAX(g.name) AS category
         FROM novel n
         JOIN novelgenre ng ON ng.novelId = n.id
         JOIN genre g ON g.id = ng.genreId
         LEFT JOIN rating r ON r.novelId = n.id
         LEFT JOIN chapter c ON c.novelId = n.id
         WHERE g.name IN (?) AND n.id != ?
         GROUP BY n.id
         ORDER BY n.views DESC
         LIMIT 6`,
        [genreIds, realId]
      );
      related = relRows;
    }

    return NextResponse.json({
      id: novel.id,
      title: novel.title,
      slug: novel.slug,
      description: novel.description || "",
      coverUrl: novel.coverUrl || "",
      posterUrl: novel.posterUrl || "",
      author: novel.author,
      editor: novel.editor || null,
      status: novel.status,
      views: novel.views,
      updatedAt: novel.updatedAt,
      avgRating: parseFloat(novel.avgRating) || 0,
      totalRatings: novel.totalRatings || 0,
      bookmarkCount: novel.bookmarkCount || 0,
      chapterCount: novel.chapterCount || 0,
      genres: genres.map((g: RowDataPacket) => g.name),
      chapters: chapters.map((c: RowDataPacket) => ({
        id: c.id,
        number: c.chapterNumber,
        title: c.title,
        isLocked: Boolean(c.isLocked),
        isPurchased: purchasedChapterIds.has(c.id),
        price: c.price,
        date: new Date(c.createdAt).toLocaleDateString("vi-VN"),
      })),
      distribution,
      related: related.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        author: r.author,
        coverUrl: r.coverUrl || "",
        status: r.status === "COMPLETED" ? "Hoàn thành" : r.status === "PAUSED" ? "Tạm dừng" : "Đang ra",
        rating: parseFloat(r.rating) || 0,
        chapterCount: r.chapterCount || 0,
        category: r.category || "",
      })),
    });
  } catch (error) {
    console.error("GET /api/novels/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
