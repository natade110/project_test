// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token) {
  if (!token) return null;
  
  try {
    // Use a fallback secret for development if environment variable isn't available
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key-here'
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
  
  // Debugging
  console.log(`Middleware running for ${pathname}. Token exists: ${!!token}`);
  
  // Protected routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token found, redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    // Verify token validity
    const payload = await verifyToken(token);
    if (!payload) {
      console.log('Invalid token, redirecting to signin');
      // Clear invalid token and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
    
    // Token is valid, proceed to dashboard
    return NextResponse.next();
  }
  
  // Auth routes - redirect to dashboard if already logged in
  if (pathname === '/signin' || pathname === '/signup' || pathname === '/') {
    if (token) {
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