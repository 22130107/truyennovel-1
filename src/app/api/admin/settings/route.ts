import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

const ALLOWED_KEYS = ["bank_id", "bank_account", "bank_name", "exchange_rate", "bonus_percent"];

// GET /api/admin/settings — lấy tất cả settings
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, `value` FROM `setting` WHERE `key` IN (?)",
      [ALLOWED_KEYS]
    );

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/settings — lưu settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    for (const key of ALLOWED_KEYS) {
      if (body[key] !== undefined) {
        const value = String(body[key]).trim();
        await pool.query(
          "INSERT INTO `setting` (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?, `updatedAt` = NOW(3)",
          [key, value, value]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
