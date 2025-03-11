import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Only set frame-ancestors in CSP header
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self'; upgrade-insecure-requests");

  return response;
} 