import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Image requise' },
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

    const clarifaiData = await clarifaiResponse.json()
    const predictions = clarifaiData.outputs[0]?.data?.concepts || []

    // Récupérer les informations nutritionnelles depuis USDA
    const foodItems = await Promise.all(
      predictions.slice(0, 5).map(async (prediction: any) => {
        const usdaResponse = await fetch(
          `${API_CONFIG.usda.baseUrl}/foods/search?query=${encodeURIComponent(prediction.name)}&api_key=${API_CONFIG.usda.apiKey}&pageSize=1`
        )

        if (!usdaResponse.ok) {
          return null
        }

        const usdaData = await usdaResponse.json()
        const food = usdaData.foods[0]

        if (!food) return null

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
          name: prediction.name,
          confidence: prediction.value,
          description: food.description,
          calories: nutrients.calories || 0,
          protein: nutrients.protein || 0,
          carbs: nutrients.carbs || 0,
          fat: nutrients.fat || 0,
          fiber: nutrients.fiber || 0,
        }
      })
    )

    const validFoods = foodItems.filter(item => item !== null)

    return NextResponse.json({
      success: true,
      foods: validFoods,
      totalCalories: validFoods.reduce((sum, food) => sum + (food?.calories || 0), 0),
    })
  } catch (error) {
    console.error('Erreur scan photo:', error)
    return NextResponse.json(
      { error: 'Erreur lors du scan' },
      { status: 500 }
    )
  }
}