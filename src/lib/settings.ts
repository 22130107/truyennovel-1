import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface SiteSettings {
  bank_id: string;
  bank_account: string;
  bank_name: string;
  exchange_rate: number;
  bonus_percent: number;
}

// Đọc settings từ DB, fallback về .env nếu chưa có
export async function getSettings(): Promise<SiteSettings> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT `key`, `value` FROM `setting`"
  );

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }

  return {
    bank_id:        map.bank_id       ?? process.env.BANK_ID             ?? "MB",
    bank_account:   map.bank_account  ?? process.env.BANK_ACCOUNT_NUMBER ?? "",
    bank_name:      map.bank_name     ?? process.env.BANK_ACCOUNT_NAME   ?? "",
    exchange_rate:  parseInt(map.exchange_rate  ?? "1000", 10),
    bonus_percent:  parseInt(map.bonus_percent  ?? "0",    10),
  };
}
