import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Thêm dòng này để đảm bảo Route luôn được xử lý mới nhất, 
// tránh việc Vercel cache kết quả login sai lệch
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const ADMIN_KEY = process.env.ADMIN_KEY;

    if (!ADMIN_KEY) {
        console.error("ADMIN_KEY chưa được thiết lập trong Environment Variables");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    if (key === ADMIN_KEY) {
      // Thiết lập cookie bảo mật
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 ngày
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid Key" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

