import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {email, password } = body;
    
    // Validate mandatory fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'All fields are mandatory' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password format
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character' },
        { status: 400 }
      );
    }
    
    // Make request to backend API
    const backendResponse = await fetch('http://localhost:3001/api/auth/signup', {
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
        { error: data.error || 'Failed to sign up' },
        { status: backendResponse.status }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}