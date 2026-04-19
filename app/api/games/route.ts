import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const games = await prisma.game.findMany({ 
    include: { _count: { select: { accounts: true } } },
    orderBy: { createdAt: 'desc' } 
  });
  return NextResponse.json(games);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newGame = await prisma.game.create({
      data: {
        name: body.name,
        images: body.images, // Mảng các đường dẫn ảnh
      },
    });
    return NextResponse.json(newGame);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo danh mục Game" }, { status: 500 });
  }
}

// ... (giữ nguyên phần GET và POST cũ)

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID game" }, { status: 400 });

    // Xóa game (Prisma sẽ tự động xử lý nếu bạn có thiết lập OnDelete Cascade, 
    // hoặc bạn phải xóa Accounts liên quan trước nếu không thiết lập)
    await prisma.game.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Không thể xóa game vì có tài khoản đang liên kết" }, { status: 500 });
  }
}

