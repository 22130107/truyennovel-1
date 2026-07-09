import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const fields: string[] = [];
    const values: any[] = [];

    if (body.url !== undefined) { fields.push("url = ?"); values.push(body.url); }
    if (body.title !== undefined) { fields.push("title = ?"); values.push(body.title); }
    if (body.description !== undefined) { fields.push("description = ?"); values.push(body.description); }
    if (body.imageUrl !== undefined) { fields.push("imageUrl = ?"); values.push(body.imageUrl); }
    if (body.isActive !== undefined) { fields.push("isActive = ?"); values.push(body.isActive ? 1 : 0); }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Không có trường nào để cập nhật" }, { status: 400 });
    }

    fields.push("updatedAt = NOW()");
    values.push(id);

    await pool.query(
      `UPDATE affiliate_link SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT affiliate link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query(`DELETE FROM affiliate_link WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE affiliate link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
