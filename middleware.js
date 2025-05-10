// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token) {
  try {
    if (!token) return null;
    
    // Use the same secret key as in your backend
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET
    );
    
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Protected routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    // Verify token validity
    const payload = await verifyToken(token);
    if (!payload) {
      // Clear invalid token and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
    
    // Token is valid, proceed to dashboard
    return NextResponse.next();
  }
  
  // Auth routes - redirect to dashboard if already logged in
  if ((pathname === '/signin' || pathname === '/signup' || pathname === '/') && token) {
    // Verify token before redirecting
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Token is invalid, clear it
    const response = NextResponse.next();
    response.cookies.delete('token');
    return response;
  }
  
  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/dashboard',
    '/dashboard/:path*'
  ],
};