import { NextRequest, NextResponse } from 'next/server'

interface MealsResponse {
  success: boolean
  meals: Array<{
    id: string
    date: string
    type: string
    foods: Array<{
      name: string
      calories: number
      protein: number
      carbs: number
      fat: number
    }>
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
  }>
  totalCalories: number
}

export async function GET(request: NextRequest): Promise<NextResponse<MealsResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Données de démo
    const meals = [
      {
        id: '1',
        date,
        type: 'breakfast',
        foods: [
          {
            name: 'Œufs brouillés',
            calories: 180,
            protein: 13,
            carbs: 2,
            fat: 14,
          },
          {
            name: 'Toast complet',
            calories: 80,
            protein: 4,
            carbs: 15,
            fat: 1,
          },
        ],
        totalCalories: 260,
        totalProtein: 17,
        totalCarbs: 17,
        totalFat: 15,
      },
    ]

    return NextResponse.json({
      success: true,
      meals,
      totalCalories: meals.reduce((sum, meal) => sum + meal.totalCalories, 0),
    })
  } catch (error) {
    console.error('Erreur récupération repas:', error)
    return NextResponse.json(
      { success: false, meals: [], totalCalories: 0 },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean; meal?: Record<string, unknown>; error?: string }>> {
  try {
    const meal = await request.json() as unknown

    // TODO: Sauvegarder dans la base de données
    console.log('Nouveau repas:', meal)

    return NextResponse.json({
      success: true,
      meal: {
        id: Date.now().toString(),
        ...meal,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Erreur ajout repas:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout' },
      { status: 500 }
    )
  }
}