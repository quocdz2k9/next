import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.setting.findUnique({ where: { id: 1 } });
    
    // Nếu chưa có settings trong DB, trả về cấu trúc rỗng để tránh lỗi giao diện
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
    return NextResponse.json({ error: "Lỗi lưu cấu hình" }, { status: 500 });
  }
}

