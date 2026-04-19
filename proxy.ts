// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Đổi tên hàm thành 'proxy' và export nó
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('admin_auth');
  const isAuthenticated = auth?.value === 'true';

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isAuthenticated && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Giữ nguyên config
export const config = {
  matcher: '/admin/:path*',
};

