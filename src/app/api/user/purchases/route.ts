import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         p.id,
         p.pricePaid,
         p.purchasedAt,
         c.chapterNumber,
         c.title AS chapterTitle,
         n.id    AS novelId,
         n.slug  AS novelSlug,
         n.title AS novelTitle
       FROM purchase p
       JOIN chapter c ON c.id = p.chapterId
       JOIN novel   n ON n.id = c.novelId
       WHERE p.userId = ?
       ORDER BY p.purchasedAt DESC
       LIMIT 100`,
      [userId]
    );

    // Nhóm các purchase trong cùng 1 giây thành combo
    const groups: Record<string, typeof rows> = {};
    for (const row of rows) {
      const ts = new Date(row.purchasedAt).toISOString().slice(0, 19);
      const key = `${row.novelId}_${ts}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }

    const result = [];
    for (const key of Object.keys(groups)) {
      const items = groups[key];
      if (items.length === 1) {
        const p = items[0];
        result.push({
          id: p.id,
          novelId: p.novelId,
          novelSlug: p.novelSlug,
          novelTitle: p.novelTitle,
          chapterNumber: p.chapterNumber,
          chapterTitle: p.chapterTitle,
          pricePaid: p.pricePaid,
          purchasedAt: p.purchasedAt,
          isCombo: false,
          comboCount: 1,
        });
      } else {
        const first = items[0];
        const totalPaid = items.reduce((s: number, i: RowDataPacket) => s + i.pricePaid, 0);
        result.push({
          id: first.id,
          novelId: first.novelId,
          novelSlug: first.novelSlug,
          novelTitle: first.novelTitle,
          chapterNumber: null,
          chapterTitle: null,
          pricePaid: totalPaid,
          purchasedAt: first.purchasedAt,
          isCombo: true,
          comboCount: items.length,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/user/purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
