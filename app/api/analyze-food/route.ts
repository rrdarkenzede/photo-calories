import { NextRequest, NextResponse } from 'next/server'
import { searchMultipleUSDAFoods } from '@/lib/usda-service'
import { getNutritionByName } from '@/lib/nutrition-database'

const CLARIFAI_API_KEY = process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '95cc52863ab2402baca61c72e1170fa9'
const CLARIFAI_USER_ID = 'clarifai'
const CLARIFAI_APP_ID = 'main'
const CLARIFAI_MODEL_ID = 'food-item-recognition'

interface DetectedFood {
  name: string
  confidence: number
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    // Call Clarifai API for food detection
    const clarifaiResponse = await fetch(
      `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: CLARIFAI_USER_ID,
            app_id: CLARIFAI_APP_ID,
          },
          inputs: [
            {
              data: {
                image: {
                  base64: base64Image,
                },
              },
            },
          ],
        }),
      }
    )

    const clarifaiData = await clarifaiResponse.json()

    if (!clarifaiResponse.ok || clarifaiData.status?.code !== 10000) {
      console.error('Clarifai API error:', clarifaiData)
      return NextResponse.json(
        { error: 'Failed to analyze image' },
        { status: 500 }
      )
    }

    // Extract detected foods from Clarifai
    const concepts = clarifaiData.outputs?.[0]?.data?.concepts || []
    const detectedFoods: DetectedFood[] = concepts
      .filter((c: any) => c.value > 0.5)
      .slice(0, 10)
      .map((c: any) => ({
        name: c.name,
        confidence: Math.round(c.value * 100),
      }))

    if (detectedFoods.length === 0) {
      return NextResponse.json(
        { error: 'No food detected in image' },
        { status: 400 }
      )
    }

    // Get nutrition data from USDA for each detected food
    const foodNames = detectedFoods.map((food: DetectedFood) => food.name)
    console.log('Fetching nutrition data for:', foodNames)
    const usDAFoods = await searchMultipleUSDAFoods(foodNames)

    // Combine Clarifai detection with USDA nutrition data
    const ingredientsWithNutrition = detectedFoods.map((food: DetectedFood) => {
      // Try to find matching USDA food
      const usdaFood = usDAFoods.find(u => 
        u.description.toLowerCase().includes(food.name.toLowerCase()) ||
        food.name.toLowerCase().includes(u.description.toLowerCase().split(',')[0])
      )

      // Use USDA data if found, otherwise fallback to local database
      const nutrition = usdaFood || getNutritionByName(food.name)

      return {
        name: food.name,
        confidence: food.confidence,
        nutrition: nutrition || { calories: 100, protein: 5, carbs: 12, fat: 3, unit: '100g' },
        source: usdaFood ? 'USDA' : 'Local DB',
      }
    })

    // Calculate totals (per 100g of each ingredient)
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, sugars: 0, fiber: 0, sodium: 0 }
    ingredientsWithNutrition.forEach(item => {
      const mult = 1 // Per 100g
      totals.calories += Math.round(item.nutrition.calories * mult)
      totals.protein += Math.round(item.nutrition.protein * mult * 10) / 10
      totals.carbs += Math.round(item.nutrition.carbs * mult * 10) / 10
      totals.fat += Math.round(item.nutrition.fat * mult * 10) / 10
      totals.sugars += (item.nutrition as any).sugars || 0
      totals.fiber += (item.nutrition as any).fiber || 0
      totals.sodium += (item.nutrition as any).sodium || 0
    })

    return NextResponse.json({
      foods: detectedFoods,
      ingredients: ingredientsWithNutrition,
      primary: detectedFoods[0],
      nutrition: {
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        sugars: Math.round(totals.sugars * 10) / 10,
        fiber: Math.round(totals.fiber * 10) / 10,
        sodium: Math.round(totals.sodium),
      },
    })
  } catch (error) {
    console.error('Error analyzing food:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
