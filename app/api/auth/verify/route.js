// app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyJWT(token) {
  if (!token) return null;
  
  try {
    // Get the secret key
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key-here'
    );
    
    // Verify the token
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

export async function GET(request) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    
    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    
    // Verify the token
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    
    // Return user info from token payload
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: 'Authentication error' },
      { status: 500 }
    );
  }
}