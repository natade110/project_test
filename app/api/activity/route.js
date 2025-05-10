// app/api/activity/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Activity API route called - using proxy to avoid CORS');
    
    // Instead of direct frontend calls, proxy through our backend to avoid CORS
    const response = await fetch('https://bored-api.appbrewery.com/random', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Bored API responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch activity: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Activity data fetched successfully through proxy:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Activity API proxy error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}