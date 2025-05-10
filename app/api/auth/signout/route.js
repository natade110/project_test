// app/api/auth/signout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the token cookie
    const response = NextResponse.json({ 
      message: 'Signed out successfully' 
    });
    
    // Delete the auth token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
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