// app/api/fallback-activity/route.js
import { NextResponse } from 'next/server';

// Array of fallback activities to use when the Bored API is unavailable
const fallbackActivities = [
  {
    activity: "Create a personal website",
    type: "creative",
    participants: 1,
    price: 0.1,
    accessibility: 0.8
  },
  {
    activity: "Learn a new programming language",
    type: "education",
    participants: 1,
    price: 0,
    accessibility: 0.3
  },
  {
    activity: "Go for a walk in the park",
    type: "relaxation",
    participants: 1,
    price: 0,
    accessibility: 0.1
  },
  {
    activity: "Read a book",
    type: "recreational",
    participants: 1,
    price: 0.05,
    accessibility: 0.2
  },
  {
    activity: "Cook a new recipe",
    type: "cooking",
    participants: 1,
    price: 0.3,
    accessibility: 0.3
  },
  {
    activity: "Organize your workspace",
    type: "busywork",
    participants: 1,
    price: 0,
    accessibility: 0.1
  },
  {
    activity: "Meditate for 10 minutes",
    type: "relaxation",
    participants: 1,
    price: 0,
    accessibility: 0.05
  },
  {
    activity: "Call an old friend",
    type: "social",
    participants: 2,
    price: 0,
    accessibility: 0.1
  }
];

export async function GET() {
  try {
    // Return a random activity from the fallback list
    const randomIndex = Math.floor(Math.random() * fallbackActivities.length);
    const randomActivity = fallbackActivities[randomIndex];
    
    return NextResponse.json(randomActivity);
  } catch (error) {
    console.error('Fallback activity error:', error);
    
    // In the worst case, return a hardcoded activity
    return NextResponse.json({
      activity: "Plan your next programming project",
      type: "creative",
      participants: 1,
      price: 0,
      accessibility: 0.1
    });
  }
}