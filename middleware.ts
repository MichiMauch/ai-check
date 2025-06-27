import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin-Routen schützen (außer Login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Kein Token -> zu Login umleiten
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Token vorhanden -> Request durchlassen
    // Die Validierung erfolgt in den API-Endpunkten und im Frontend
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
