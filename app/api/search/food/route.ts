import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Recherche requise' },
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

    const data = await response.json()

    const foods = data.foods.map((food: any) => {
      const nutrients = food.foodNutrients.reduce((acc: any, nutrient: any) => {
        switch (nutrient.nutrientName) {
          case 'Energy':
            acc.calories = nutrient.value
            break
          case 'Protein':
            acc.protein = nutrient.value
            break
          case 'Carbohydrate, by difference':
            acc.carbs = nutrient.value
            break
          case 'Total lipid (fat)':
            acc.fat = nutrient.value
            break
          case 'Fiber, total dietary':
            acc.fiber = nutrient.value
            break
        }
        return acc
      }, {})

      return {
        id: food.fdcId.toString(),
        name: food.description,
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
      totalResults: data.totalHits,
    })
  } catch (error) {
    console.error('Erreur recherche aliments:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}