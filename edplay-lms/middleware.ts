import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/masuk');

  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/dashboard');

  // Redirect ke /masuk jika belum login dan akses protected page
  if (!token && isProtectedRoute && !isAuthPage) {
    return NextResponse.redirect(new URL('/masuk', request.url));
  }

  // Jika sudah login dan akses '/', redirect ke /course
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/course', request.url));
  }

  // Lanjutkan response
  const response = NextResponse.next();

  // CORS: header tambahan untuk development mode
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['your-production-domain.com']
      : ['http://localhost:3000'];

  const origin = request.headers.get('origin') || '';
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
    );
  }

  return response;
}

// Middleware hanya berlaku untuk route berikut
export const config = {
  matcher: ['/', '/course/:path*', '/dashboard/:path*'],
};
