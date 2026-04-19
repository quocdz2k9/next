import { NextResponse } from "next/server";
// 1. Dùng instance dùng chung
import prisma from "@/lib/prisma"; 

// 2. Ép buộc dynamic để tránh lỗi build trên Vercel
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.setting.findUnique({ where: { id: 1 } });

    // Nếu chưa có settings trong DB, trả về cấu trúc rỗng
    if (!settings) {
      return NextResponse.json({
        logoUrl: "",
        footerLines: []
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const settings = await prisma.setting.upsert({
      where: { id: 1 },
      update: {
        logoUrl: body.logoUrl,
        footerLines: body.footerLines
      },
      create: {
        id: 1,
        logoUrl: body.logoUrl,
        footerLines: body.footerLines
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Lỗi Settings:", error);
    return NextResponse.json({ error: "Lỗi lưu cấu hình" }, { status: 500 });
  }
}

