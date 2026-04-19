import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Không có file nào được gửi lên" }, { status: 400 });
    }

    // Đường dẫn tuyệt đối đến thư mục public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // TỰ ĐỘNG TẠO THƯ MỤC NẾU CHƯA CÓ
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filenames: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Tạo tên file duy nhất để tránh trùng lặp
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanFileName = file.name.replace(/\s+/g, "_"); // Xóa khoảng trắng
      const filename = `${uniqueSuffix}-${cleanFileName}`;
      
      const filePath = path.join(uploadsDir, filename);
      
      // Ghi file vào ổ cứng
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

