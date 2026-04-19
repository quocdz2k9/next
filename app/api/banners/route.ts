import { NextResponse } from "next/server";
// Sử dụng instance dùng chung từ lib/prisma
import prisma from "@/lib/prisma"; 

// QUAN TRỌNG: Thêm dòng này để Vercel không render tĩnh file này lúc build
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải Banner" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBanner = await prisma.banner.create({
      data: {
        imageUrl: body.imageUrl,
        title: body.title || "",
      },
    });
    return NextResponse.json(newBanner);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lưu Banner" }, { status: 500 });
  }
}

