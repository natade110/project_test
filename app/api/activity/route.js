// app/api/activity/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Activity API route called');
    
    // Direct fetch to the Bored API with better error handling
    const response = await fetch('https://bored-api.appbrewery.com/random', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Prevent caching
      cache: 'no-store',
      // Add a longer timeout
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`Bored API responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch activity: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Activity data fetched successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Activity API error details:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}