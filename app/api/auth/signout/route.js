// app/api/auth/signout/route.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request) {
  try {
    // Get the Authorization header (for API testing with Postman)
    const authHeader = request.headers.get('Authorization');
    
    // For API-based authentication (when calling from Postman)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token
      const token = authHeader.substring(7);
      
      try {
        // Verify the token
        const secretKey = new TextEncoder().encode(
          process.env.JWT_SECRET || 'your-secret-key-here'
        );
        
        // Verify token (optional for signout, but good for validation)
        await jwtVerify(token, secretKey);
        
        // In a real system with a token blacklist, you would blacklist the token here
        console.log('User signed out via API with token');
      } catch (error) {
        console.log('Invalid token provided to signout API:', error.message);
        // Continue anyway, as we want to allow signing out even with invalid tokens
      }
    }
    
    // Get token from cookie (for browser-based authentication)
    const cookieToken = request.cookies.get('token');
    if (cookieToken) {
      console.log('User signed out via browser with cookie');
    }
    
    // Create response that clears the token cookie
    const response = NextResponse.json({ 
      message: 'Signed out successfully',
      timestamp: new Date().toISOString()
    });
    
    // Clear token cookie with multiple variations to ensure it's removed
    // This is important for browser-based authentication
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true, 
      sameSite: 'strict',
    });
    
    // Also try without httpOnly to catch all types of cookies
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: false,
    });
    
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}