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
    
    const data = await backendResponse.json();
    
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to sign in' },
        { status: backendResponse.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}