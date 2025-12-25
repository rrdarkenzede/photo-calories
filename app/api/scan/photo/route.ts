import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

interface ScanResponse {
  success: boolean
  foods?: Array<{
    name: string
    confidence: number
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }>
  totalCalories?: number
  error?: string
}

interface ClariflaiConcept {
  name: string
  value: number
}

interface ClariflaiResponse {
  outputs?: Array<{
    data?: {
      concepts?: ClariflaiConcept[]
    }
  }>
}

export async function POST(request: NextRequest): Promise<NextResponse<ScanResponse>> {
  try {
    const { image } = await request.json() as { image?: string }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image requise' },
        { status: 400 }
      )
    }

    // Appel à l'API Clarifai pour la reconnaissance d'images
    const clarifaiResponse = await fetch(
      'https://api.clarifai.com/v2/models/food-item-recognition/outputs',
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${API_CONFIG.clarifai.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: image.replace(/^data:image\/\w+;base64,/, ''),
                },
              },
            },
          ],
        }),
      }
    )

    if (!clarifaiResponse.ok) {
      throw new Error('Erreur Clarifai API')
    }

    const clarifaiData = await clarifaiResponse.json() as ClariflaiResponse
    const predictions = clarifaiData.outputs?.[0]?.data?.concepts ?? []

    // Récupérer les informations nutritionnelles depuis USDA
    const foodItems = await Promise.all(
      predictions.slice(0, 5).map(async (prediction: ClariflaiConcept) => {
        const name = prediction.name
        const value = prediction.value
        
        try {
          const usdaResponse = await fetch(
            `${API_CONFIG.usda.baseUrl}/foods/search?query=${encodeURIComponent(name)}&api_key=${API_CONFIG.usda.apiKey}&pageSize=1`
          )

          if (!usdaResponse.ok) {
            return null
          }

          const usdaData = await usdaResponse.json() as unknown
          const ud = usdaData as Record<string, unknown>
          const foods = ud.foods as Array<Record<string, unknown>> | undefined
          const food = foods?.[0]

          if (!food) return null

          const nutrients = (food.foodNutrients as Array<Record<string, unknown>>).reduce((acc: Record<string, number>, nutrient: Record<string, unknown>) => {
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
            name,
            confidence: value,
            description: food.description as string,
            calories: nutrients.calories || 0,
            protein: nutrients.protein || 0,
            carbs: nutrients.carbs || 0,
            fat: nutrients.fat || 0,
            fiber: nutrients.fiber || 0,
          }
        } catch (error) {
          console.error('USDA fetch error:', error)
          return null
        }
      })
    )

    const validFoods = foodItems.filter((item) => item !== null)

    return NextResponse.json({
      success: true,
      foods: validFoods,
      totalCalories: validFoods.reduce((sum, food) => sum + (food?.calories || 0), 0),
    })
  } catch (error) {
    console.error('Erreur scan photo:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du scan' },
      { status: 500 }
    )
  }
}