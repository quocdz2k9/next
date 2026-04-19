import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Ép buộc dynamic để tránh lỗi khi build trên môi trường serverless
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Không có file nào được gửi lên" }, { status: 400 });
    }

    // Đường dẫn tuyệt đối
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Tự động tạo thư mục
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filenames: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Tạo tên file an toàn
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_"); // Chỉ giữ lại ký tự an toàn
      const filename = `${uniqueSuffix}-${cleanFileName}`;

      const filePath = path.join(uploadsDir, filename);
      
      // Ghi file
      fs.writeFileSync(filePath, buffer);
      filenames.push(filename);
    }

    return NextResponse.json({ filenames });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Lỗi Server: " + error.message },
      { status: 500 }
    );
  }
}

