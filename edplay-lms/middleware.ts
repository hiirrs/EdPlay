import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token and current path
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  
  console.log(`Middleware running - Path: ${pathname}, Token exists: ${!!token}`);

  // Define which pages are auth pages (login/register)
  const isAuthPage = 
    pathname === '/login' || 
    pathname === '/masuk' || 
    pathname === '/daftar';

  // Define which pages require authentication
  const isProtectedRoute = 
    pathname === '/' ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/dashboard');

  // IMPORTANT: Check this logic carefully
  if (token && isAuthPage) {
    // If user has token but is on auth page, redirect to course
    console.log('User has token but is on auth page, redirecting to /course');
    return NextResponse.redirect(new URL('/course', request.url));
  }

  if (!token && isProtectedRoute) {
    // If user has no token but tries to access protected route
    console.log('User has no token but is on protected route, redirecting to /masuk');
    return NextResponse.redirect(new URL('/masuk', request.url));
  }

  // If neither condition is met, continue with the request
  console.log('Continuing with normal request');
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/masuk', '/login', '/daftar', '/course/:path*', '/dashboard/:path*'],
};