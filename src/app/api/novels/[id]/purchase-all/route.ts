import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";

// GET — lấy thông tin mua toàn bộ
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const [novelsResolve] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
    [paramId, paramId]
  );
  if (novelsResolve.length === 0) return NextResponse.json({ error: "Không tìm thấy truyện" }, { status: 404 });
  const novelId = novelsResolve[0].id;

  // Lấy comboPrice của novel
  const [novels] = await pool.query<RowDataPacket[]>(
    `SELECT comboPrice FROM novel WHERE id = ? LIMIT 1`,
    [novelId]
  );
  const comboPrice: number | null = novels[0]?.comboPrice ?? null;

  // Lấy tất cả chương trả phí
  const [lockedChapters] = await pool.query<RowDataPacket[]>(
    `SELECT id, price FROM chapter WHERE novelId = ? AND isLocked = 1`,
    [novelId]
  );

  if (lockedChapters.length === 0) {
    return NextResponse.json({ totalPrice: 0, unpurchasedCount: 0, discount: 0, hasComboPrice: false });
  }

  let unpurchasedChapters = lockedChapters;

  if (userId) {
    const chapterIds = lockedChapters.map((c) => c.id);
    const [purchased] = await pool.query<RowDataPacket[]>(
      `SELECT chapterId FROM purchase WHERE userId = ? AND chapterId IN (?)`,
      [userId, chapterIds]
    );
    const purchasedIds = new Set(purchased.map((p) => p.chapterId));
    unpurchasedChapters = lockedChapters.filter((c) => !purchasedIds.has(c.id));
  }

  const totalRetail = unpurchasedChapters.reduce((sum, c) => sum + c.price, 0);
  // Tổng giá lẻ toàn bộ chương (dùng để tính % giảm chính xác)
  const fullRetail = lockedChapters.reduce((sum, c) => sum + c.price, 0);

  let totalPrice: number;
  let discount: number;
  let hasComboPrice = false;

  if (comboPrice !== null && comboPrice > 0) {
    // Dùng giá combo cố định
    totalPrice = comboPrice;
    // Tính discount so với fullRetail để tránh chia số nhỏ hoặc ra số âm
    discount = fullRetail > 0
      ? Math.min(99, Math.max(0, Math.round((1 - comboPrice / fullRetail) * 100)))
      : 0;
    hasComboPrice = true;
  } else {
    // Giảm 30% mặc định
    discount = 30;
    totalPrice = Math.ceil(totalRetail * (1 - discount / 100));
  }

  return NextResponse.json({
    totalRetail,
    totalPrice,
    unpurchasedCount: unpurchasedChapters.length,
    discount,
    hasComboPrice,
  });
}

// POST — mua toàn bộ chương chưa mua
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  const { userId } = await req.json();

  if (!userId) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const [novelsResolve] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM novel WHERE id = ? OR slug = ? LIMIT 1`,
    [paramId, paramId]
  );
  if (novelsResolve.length === 0) return NextResponse.json({ error: "Không tìm thấy truyện" }, { status: 404 });
  const novelId = novelsResolve[0].id;

  // Lấy comboPrice
  const [novels] = await pool.query<RowDataPacket[]>(
    `SELECT comboPrice FROM novel WHERE id = ? LIMIT 1`,
    [novelId]
  );
  const comboPrice: number | null = novels[0]?.comboPrice ?? null;

  // Lấy tất cả chương trả phí chưa mua
  const [lockedChapters] = await pool.query<RowDataPacket[]>(
    `SELECT id, price FROM chapter WHERE novelId = ? AND isLocked = 1`,
    [novelId]
  );

  if (lockedChapters.length === 0) {
    return NextResponse.json({ error: "Không có chương trả phí" }, { status: 400 });
  }

  const chapterIds = lockedChapters.map((c) => c.id);
  const [purchased] = await pool.query<RowDataPacket[]>(
    `SELECT chapterId FROM purchase WHERE userId = ? AND chapterId IN (?)`,
    [userId, chapterIds]
  );
  const purchasedIds = new Set(purchased.map((p) => p.chapterId));
  const unpurchased = lockedChapters.filter((c) => !purchasedIds.has(c.id));

  if (unpurchased.length === 0) {
    return NextResponse.json({ error: "Bạn đã mua tất cả chương rồi" }, { status: 400 });
  }

  const totalRetail = unpurchased.reduce((sum, c) => sum + c.price, 0);
  const totalPrice = (comboPrice !== null && comboPrice > 0)
    ? comboPrice
    : Math.ceil(totalRetail * 0.7);

  // Kiểm tra xu
  const [users] = await pool.query<RowDataPacket[]>(
    `SELECT coins FROM user WHERE id = ? LIMIT 1`,
    [userId]
  );
  if (!users[0] || users[0].coins < totalPrice) {
    return NextResponse.json({
      error: "Không đủ xu",
      required: totalPrice,
      current: users[0]?.coins ?? 0,
    }, { status: 402 });
  }

  // Transaction
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE user SET coins = coins - ?, updatedAt = NOW() WHERE id = ?`,
      [totalPrice, userId]
    );

    // pricePaid mỗi chương theo tỷ lệ
    for (const chapter of unpurchased) {
      const pricePaid = totalRetail > 0
        ? Math.ceil((chapter.price / totalRetail) * totalPrice)
        : 0;
      await conn.query(
        `INSERT INTO purchase (id, userId, chapterId, pricePaid, purchasedAt) VALUES (?, ?, ?, ?, NOW())`,
        [randomUUID(), userId, chapter.id, pricePaid]
      );
    }

    await conn.commit();
    conn.release();
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }

  const [updated] = await pool.query<RowDataPacket[]>(
    `SELECT coins FROM user WHERE id = ? LIMIT 1`,
    [userId]
  );

  return NextResponse.json({
    success: true,
    purchasedCount: unpurchased.length,
    coinsSpent: totalPrice,
    coinsRemaining: updated[0]?.coins ?? 0,
  });
}
