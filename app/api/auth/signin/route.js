// app/api/auth/signin/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate mandatory fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Make request to backend API
    const backendResponse = await fetch('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    // Get response data
    const data = await backendResponse.json();
    
    // Handle unsuccessful response
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to sign in' },
        { status: backendResponse.status }
      );
    }
    
    // Create successful response with user data and token
    const response = NextResponse.json({
      token: data.token,
      email: data.email,
      message: 'Login successful'
    });
    
    // Set the token in a HTTP-only cookie for better security
    response.cookies.set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}