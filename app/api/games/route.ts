import { NextResponse } from "next/server";
// 1. Sử dụng instance dùng chung từ lib/prisma (BẮT BUỘC để fix lỗi outdated client)
import prisma from "@/lib/prisma"; 

// 2. Ép buộc chế độ dynamic để bỏ qua việc "thăm dò" DB lúc build trên Vercel
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: { _count: { select: { accounts: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải danh mục Game" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newGame = await prisma.game.create({
      data: {
        name: body.name,
        images: body.images, 
      },
    });
    return NextResponse.json(newGame);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo danh mục Game" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID game" }, { status: 400 });

    await prisma.game.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    // Trả về lỗi chi tiết hơn nếu có ràng buộc khóa ngoại (Foreign Key)
    return NextResponse.json(
      { error: "Không thể xóa game vì có tài khoản đang liên kết" }, 
      { status: 500 }
    );
  }
}

