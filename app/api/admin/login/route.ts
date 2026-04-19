import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const ADMIN_KEY = process.env.ADMIN_KEY;

    if (key === ADMIN_KEY) {
      // Thiết lập cookie bảo mật
      (await cookies()).set("admin_auth", "true", {
        httpOnly: true, // Chống script lấy cookie
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

