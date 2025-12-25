import { NextRequest, NextResponse } from 'next/server'

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: Array<{
    name: string
    quantity: number
    unit: string
  }>
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

interface RecipesResponse {
  success: boolean
  recipes?: Recipe[]
  error?: string
}

export async function GET(): Promise<NextResponse<RecipesResponse>> {
  try {
    const recipes: Recipe[] = [
      {
        id: '1',
        name: 'Salade Méditerranéenne',
        description: 'Salade fraîche avec légumes et féta',
        ingredients: [
          { name: 'Laitue', quantity: 200, unit: 'g' },
          { name: 'Tomates', quantity: 150, unit: 'g' },
          { name: 'Féta', quantity: 100, unit: 'g' },
          { name: 'Olives', quantity: 50, unit: 'g' },
        ],
        nutrition: {
          calories: 350,
          protein: 12,
          carbs: 15,
          fat: 26,
        },
      },
      {
        id: '2',
        name: 'Poulet Grillé aux Légumes',
        description: 'Filet de poulet avec légumes rôtis',
        ingredients: [
          { name: 'Poulet', quantity: 200, unit: 'g' },
          { name: 'Brocoli', quantity: 150, unit: 'g' },
          { name: 'Carottes', quantity: 100, unit: 'g' },
          { name: 'Huile d\'olive', quantity: 15, unit: 'ml' },
        ],
        nutrition: {
          calories: 450,
          protein: 45,
          carbs: 20,
          fat: 18,
        },
      },
    ]

    return NextResponse.json({
      success: true,
      recipes,
    })
  } catch (error) {
    console.error('Erreur recettes:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur récupération recettes' },
      { status: 500 }
    )
  }
}