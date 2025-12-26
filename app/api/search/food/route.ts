import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

interface FoodSearchResponse {
  success: boolean
  foods?: Array<{
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    quantity: number
    unit: string
  }>
  totalResults?: number
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<FoodSearchResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Recherche requise' },
        { status: 400 }
      )
    }

    // Recherche dans USDA FoodData Central
    const response = await fetch(
      `${API_CONFIG.usda.baseUrl}/foods/search?query=${encodeURIComponent(query)}&api_key=${API_CONFIG.usda.apiKey}&pageSize=20`
    )

    if (!response.ok) {
      throw new Error('Erreur USDA API')
    }

    const data = await response.json() as unknown
    const d = data as Record<string, unknown>
    const foodsArray = (d.foods as Array<Record<string, unknown>> | undefined) ?? []

    const foods = foodsArray.map((food: Record<string, unknown>) => {
      const nutrients = (food.foodNutrients as Array<Record<string, unknown>> | undefined ?? []).reduce((acc: Record<string, number>, nutrient: Record<string, unknown>) => {
        const nutrientName = nutrient.nutrientName as string
        const nutrientValue = nutrient.value as number
        
        switch (nutrientName) {
          case 'Energy':
            acc.calories = nutrientValue
            break
          case 'Protein':
            acc.protein = nutrientValue
            break
          case 'Carbohydrate, by difference':
            acc.carbs = nutrientValue
            break
          case 'Total lipid (fat)':
            acc.fat = nutrientValue
            break
          case 'Fiber, total dietary':
            acc.fiber = nutrientValue
            break
        }
        return acc
      }, {})

      return {
        id: (food.fdcId as number).toString(),
        name: food.description as string,
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0,
        quantity: 100,
        unit: 'g',
      }
    })

    return NextResponse.json({
      success: true,
      foods,
      totalResults: (d.totalHits as number) || 0,
    })
  } catch (error) {
    console.error('Erreur recherche aliments:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}