import { NextResponse } from "next/server";
// 1. Dùng instance prisma dùng chung (tạo file lib/prisma.ts như hướng dẫn dưới)
// Nếu chưa tạo lib/prisma.ts, tạm thời dùng import từ một nơi quản lý tập trung
import prisma from "@/lib/prisma"; 

// 2. Ép Next.js không render tĩnh API này lúc build để tránh lỗi kết nối DB
export const dynamic = 'force-dynamic';

// TẠO HOẶC CẬP NHẬT TÀI KHOẢN
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (id) {
      const updated = await prisma.account.update({
        where: { id: Number(id) },
        data: {
          name: data.name,
          priceNum: Number(data.priceNum) || 0,
          priceText: data.priceText,
          gameId: Number(data.gameId),
          images: data.images,
          status: data.status,
          description: data.description,
        },
      });
      return NextResponse.json(updated);
    } else {
      const newAccount = await prisma.account.create({
        data: {
          name: data.name,
          priceNum: Number(data.priceNum) || 0,
          priceText: data.priceText,
          gameId: Number(data.gameId),
          images: data.images,
          status: data.status || "conhang",
          description: data.description || "",
        },
      });
      return NextResponse.json(newAccount);
    }
  } catch (error: any) {
    console.error("Lỗi API Account:", error);
    return NextResponse.json({ error: "Lỗi xử lý Database" }, { status: 500 });
  }
}

// XÓA TÀI KHOẢN
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });

    await prisma.account.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa" }, { status: 500 });
  }
}

// LẤY DANH SÁCH
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: { game: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu" }, { status: 500 });
  }
}

