import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const method = searchParams.get("method") || "all";
    const status = searchParams.get("status") || "all";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build WHERE clauses
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push("(t.id LIKE ? OR u.username LIKE ? OR u.email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (method !== "all") {
      conditions.push("t.paymentMethod = ?");
      params.push(method);
    }
    if (status !== "all") {
      conditions.push("t.status = ?");
      params.push(status.toUpperCase());
    }
    if (startDate) {
      conditions.push("t.createdAt >= ?");
      params.push(`${startDate} 00:00:00`);
    }
    if (endDate) {
      conditions.push("t.createdAt <= ?");
      params.push(`${endDate} 23:59:59`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Fetch paginated transactions
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.amountXu, t.amountMoney, t.paymentMethod, t.paymentRef, t.status, t.createdAt,
              u.username, u.email
       FROM \`transaction\` t
       LEFT JOIN \`user\` u ON t.userId = u.id
       ${where}
       ORDER BY t.createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Total count
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM \`transaction\` t
       LEFT JOIN \`user\` u ON t.userId = u.id
       ${where}`,
      params
    );
    const total = countRows[0]?.total ?? 0;

    // Chart Data (Completed transactions by day)
    const [chartRows] = await pool.query<RowDataPacket[]>(
      `SELECT DATE(t.createdAt) as date, SUM(t.amountMoney) as revenue
       FROM \`transaction\` t
       LEFT JOIN \`user\` u ON t.userId = u.id
       ${where} ${where ? 'AND' : 'WHERE'} t.status = 'COMPLETED'
       GROUP BY DATE(t.createdAt)
       ORDER BY date ASC`,
      params
    );
    
    // Format chart data: YYYY-MM-DD -> revenue
    const chartData = chartRows.map((r: any) => ({
      date: new Date(r.date).toLocaleDateString("vi-VN"), // e.g. "DD/MM/YYYY"
      rawDate: r.date,
      revenue: Number(r.revenue) || 0
    }));

    // Summary stats: today's revenue, successful transactions today, coins this month
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

    const [[todayStats]] = await pool.query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN amountMoney ELSE 0 END), 0) AS todayRevenue,
         COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS todaySuccess
       FROM \`transaction\`
       WHERE DATE(createdAt) = ?`,
      [todayStr]
    );

    const [[monthStats]] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN amountXu ELSE 0 END), 0) AS monthCoins
       FROM \`transaction\`
       WHERE createdAt >= ?`,
      [firstOfMonth]
    );

    return NextResponse.json({
      transactions: rows,
      total,
      page,
      limit,
      chartData,
      summary: {
        todayRevenue: todayStats?.todayRevenue ?? 0,
        todaySuccess: todayStats?.todaySuccess ?? 0,
        monthCoins: monthStats?.monthCoins ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
