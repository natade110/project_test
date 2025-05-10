// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token) {
  if (!token) return null;
  
  try {
    // Use a fallback secret for development if environment variable isn't available
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
  
  // Skip middleware for API routes, static resources, etc.
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api/') ||
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Protected routes - require authentication
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    try {
      const payload = await verifyToken(token);
      if (!payload) {
        const response = NextResponse.redirect(new URL('/signin', request.url));
        response.cookies.delete('token');
        return response;
      }
      
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
  }
  
  // Auth routes - redirect to dashboard if already logged in
  if (pathname === '/signin' || pathname === '/signup' || pathname === '/') {
    if (token) {
      try {
        const payload = await verifyToken(token);
        if (payload) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      } catch (error) {
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
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
    '/dashboard/:path*',
  ],
};