import { NextRequest, NextResponse } from 'next/server';

interface CoachMessage {
  id: number;
  message: string;
  type: 'encouragement' | 'tip' | 'warning';
  basedOn: string;
  createdAt: string;
}

export async function GET(req: NextRequest) {
  try {
    // TODO: Authenticate user
    // TODO: Check if user is on FITNESS plan (if not, return 403)

    // TODO: Fetch last 7 days of daily_summaries
    // TODO: Fetch user profile (goals, preferences)
    // TODO: Analyze data to generate insights:
    //   - Is protein too low?
    //   - Are carbs too high in evening?
    //   - Is user consistent?
    //   - What's the trend?

    const messages: CoachMessage[] = [
      // Example:
      // {
      //   id: 1,
      //   message: 'Great job this week! Your protein intake is excellent.',
      //   type: 'encouragement',
      //   basedOn: 'consistency',
      //   createdAt: '2025-12-25T17:30:00Z'
      // },
      // {
      //   id: 2,
      //   message: 'Your carbs are slightly high in the evening. Try shifting them to breakfast.',
      //   type: 'tip',
      //   basedOn: 'carbs_timing',
      //   createdAt: '2025-12-25T17:30:00Z'
      // }
    ];

    return NextResponse.json({
      success: true,
      messages,
      recommendations: {
        focus: 'protein', // What to focus on
        insight: 'Your protein intake is below goal. Add more chicken, fish, or eggs.',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coach messages' },
      { status: 500 }
    );
  }
}

// POST - Mark message as read
export async function POST(req: NextRequest) {
  try {
    // TODO: Get message ID from body
    // TODO: Mark as read in database

    return NextResponse.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
