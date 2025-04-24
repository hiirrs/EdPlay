import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Define allowed origins based on environment
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['your-production-domain.com'] 
    : ['localhost:3000'];
  
  const origin = request.headers.get('origin') || '';
  
  if (allowedOrigins.includes(origin)) {
    // Set CORS headers for allowed origins
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  }
  
  return response;
}