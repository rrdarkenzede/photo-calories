import { NextRequest, NextResponse } from 'next/server'

// Placeholder - To be implemented
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Coach AI coming soon',
    tips: [
      'Maintenez une alimentation équilibrée',
      'Hydratez-vous régulièrement',
      'Variez vos sources de protéines',
    ],
  })
}