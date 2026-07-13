import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";

// POST /api/library/progress
// body: { userId, novelId, lastChapter, status? }
export async function POST(req: NextRequest) {
  try {
    const { userId, novelId, lastChapter, status } = await req.json();
    if (!userId || !novelId || !lastChapter) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const libStatus = status || "READING";

    await pool.query(
      `INSERT INTO reading_progress (id, userId, novelId, lastChapter, status, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(3))
       ON DUPLICATE KEY UPDATE
         lastChapter = GREATEST(lastChapter, ?),
         status = ?,
         updatedAt = NOW(3)`,
      [crypto.randomUUID(), userId, novelId, lastChapter, libStatus, lastChapter, libStatus]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/library/progress error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/library/progress — đổi status (READING/COMPLETED/SAVED/LIKED)
export async function PATCH(req: NextRequest) {
  try {
    const { userId, novelId, status } = await req.json();
    if (!userId || !novelId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await pool.query(
      `UPDATE reading_progress rp
       JOIN novel n ON (n.id = rp.novelId OR n.slug = rp.novelId)
       SET rp.status = ?, rp.updatedAt = NOW(3)
       WHERE rp.userId = ? AND (n.id = ? OR n.slug = ?)`,
      [status, userId, novelId, novelId]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/library/progress error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/library/progress?userId=&novelId=
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const novelId = req.nextUrl.searchParams.get("novelId");
    if (!userId || !novelId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await pool.query(
      `DELETE rp FROM reading_progress rp
       JOIN novel n ON (n.id = rp.novelId OR n.slug = rp.novelId)
       WHERE rp.userId = ? AND (n.id = ? OR n.slug = ?)`,
      [userId, novelId, novelId]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/library/progress error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
