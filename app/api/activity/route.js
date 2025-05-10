// app/api/activity/route.js - Updated with more robust error handling
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Activity API route called');
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch('https://www.boredapi.com/api/activity', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      // Prevent caching
      cache: 'no-store'
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Bored API responded with status: ${response.status}`);
      throw new Error(`Failed to fetch activity: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Activity data fetched successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Activity API error details:', error);
    
    // More specific error message based on error type
    let errorMessage = 'Failed to fetch activity';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout: Failed to fetch activity in time';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}