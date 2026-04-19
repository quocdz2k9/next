import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// TẠO HOẶC CẬP NHẬT TÀI KHOẢN
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (id) {
      // Nếu có ID thì thực hiện UPDATE
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
      // Nếu không có ID thì tạo MỚI
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

