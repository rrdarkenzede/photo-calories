import { NextRequest, NextResponse } from 'next/server'

interface StatsResponse {
  success: boolean
  stats?: {
    todayCalories: number
    todayCaloriesGoal: number
    thisWeekCalories: number
    thisMonthCalories: number
    averageDailyCalories: number
    mealsLogged: number
    scansRemaining: number
  }
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<StatsResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'day'

    // Données démo
    const stats = {
      todayCalories: 1850,
      todayCaloriesGoal: 2500,
      thisWeekCalories: 12500,
      thisMonthCalories: 52000,
      averageDailyCalories: 1857,
      mealsLogged: 7,
      scansRemaining: 5,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur récupération stats' },
      { status: 500 }
    )
  }
}