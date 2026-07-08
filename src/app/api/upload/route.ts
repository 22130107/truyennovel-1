import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const extension = path.extname(originalName) || "";
    
    // Tạo tên file ngẫu nhiên để tránh trùng lặp và lỗi bảo mật
    const randomName = crypto.randomUUID() + extension;

    // Đường dẫn thư mục .upload ở thư mục gốc của project
    const uploadDir = path.join(process.cwd(), ".upload");

    // Đảm bảo thư mục tồn tại
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, randomName);
    
    // Lưu file vào đĩa
    await writeFile(filePath, buffer);

    // Trả về đường dẫn để client có thể truy cập qua API media
    const secure_url = `/api/media/${randomName}`;

    return NextResponse.json({ secure_url });
  } catch (error: any) {
    console.error("Lỗi khi upload file:", error);
    return NextResponse.json({ error: "Lỗi server khi upload file: " + error.message }, { status: 500 });
  }
}
