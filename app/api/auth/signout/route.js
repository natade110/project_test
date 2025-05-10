// app/api/auth/signout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the token cookie
    const response = NextResponse.json({ 
      message: 'Signed out successfully' 
    });
    
    // More thorough cookie clearing
    // Use multiple variations to ensure the cookie is cleared
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
    });
    
    // Also try without httpOnly to catch cookies that might have been set without it
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: false,
      sameSite: 'strict',
    });
    
    // Try with different sameSite values
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
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