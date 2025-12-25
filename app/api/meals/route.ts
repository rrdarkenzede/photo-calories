import { NextRequest, NextResponse } from 'next/server'

// TODO: Implémenter avec Supabase/PostgreSQL
// Pour l'instant, retourne des données de démo

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Données de démo
    const meals = [
      {
        id: '1',
        date: date,
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
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const meal = await request.json()

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
      { error: 'Erreur lors de l\'ajout' },
      { status: 500 }
    )
  }
}