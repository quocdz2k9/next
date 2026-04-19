import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(banners);
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

