import { NextRequest, NextResponse } from 'next/server'

// Placeholder - To be implemented
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    stats: {
      totalScans: 0,
      totalCalories: 0,
      avgCaloriesPerDay: 0,
    },
    message: 'Stats feature coming soon',
  })
}