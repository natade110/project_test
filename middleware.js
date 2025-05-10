import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token) {
  try {
    // Use the same secret key as in your backend
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
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
    
    // Optional: Verify token validity
    // Uncomment if you want to verify the token on each request
    // const payload = await verifyToken(token);
    // if (!payload) {
    //   // Clear invalid token and redirect to signin
    //   const response = NextResponse.redirect(new URL('/signin', request.url));
    //   response.cookies.delete('token');
    //   return response;
    // }
  }
  
  // Auth routes - redirect to dashboard if already logged in
  if ((pathname.startsWith('/signin') || pathname.startsWith('/signup') || pathname === '/') && token) {
    // Optionally verify token before redirecting
    // const payload = await verifyToken(token);
    // if (payload) {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
    
    // For simplicity, just check if token exists
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     * But do match /api/auth/** routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/auth/:path*'
  ],
};