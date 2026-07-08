import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Trích xuất tên file từ url
    const resolvedParams = await params;
    const fileName = resolvedParams.path.join("/");
    
    if (!fileName) {
      return new NextResponse("File không hợp lệ", { status: 400 });
    }

    // Đường dẫn tuyệt đối tới file trong thư mục .upload
    const filePath = path.join(process.cwd(), ".upload", fileName);

    // Tránh Directory Traversal (chỉ cho phép đọc trong thư mục .upload)
    if (!filePath.startsWith(path.join(process.cwd(), ".upload"))) {
      return new NextResponse("Truy cập bị từ chối", { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Không tìm thấy file", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    // Xác định mime type đơn giản dựa trên đuôi file
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".png") mimeType = "image/png";
    else if (ext === ".gif") mimeType = "image/gif";
    else if (ext === ".webp") mimeType = "image/webp";
    else if (ext === ".svg") mimeType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Lỗi khi đọc file media:", error);
    return new NextResponse("Lỗi server", { status: 500 });
  }
}
