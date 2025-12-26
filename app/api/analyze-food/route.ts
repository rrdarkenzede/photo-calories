import { NextRequest, NextResponse } from 'next/server'
import { getNutritionByName } from '@/lib/nutrition-database'

const CLARIFAI_API_KEY = process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '95cc52863ab2402baca61c72e1170fa9'
const CLARIFAI_USER_ID = 'clarifai'
const CLARIFAI_APP_ID = 'main'
const CLARIFAI_MODEL_ID = 'food-item-recognition'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Remove data:image prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    // Call Clarifai API
    const response = await fetch(
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

    const data = await response.json()

    if (!response.ok || data.status?.code !== 10000) {
      console.error('Clarifai API error:', data)
      return NextResponse.json(
        { error: 'Failed to analyze image', details: data },
        { status: 500 }
      )
    }

    // Extract food items from Clarifai response
    const concepts = data.outputs?.[0]?.data?.concepts || []
    const detectedFoods = concepts
      .filter((c: any) => c.value > 0.5) // Lower threshold for more results
      .slice(0, 10) // Top 10
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

    // Get nutrition for each detected food
    const ingredientsWithNutrition = detectedFoods
      .map(food => {
        const nutrition = getNutritionByName(food.name)
        return {
          name: food.name,
          confidence: food.confidence,
          nutrition: nutrition || { calories: 100, protein: 5, carbs: 12, fat: 3, unit: '100g' },
        }
      })
      .filter(item => item.nutrition)

    // Calculate totals
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    ingredientsWithNutrition.forEach(item => {
      // Assume 100g per ingredient for calculation
      totals.calories += Math.round(item.nutrition.calories)
      totals.protein += Math.round(item.nutrition.protein * 10) / 10
      totals.carbs += Math.round(item.nutrition.carbs * 10) / 10
      totals.fat += Math.round(item.nutrition.fat * 10) / 10
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
      },
    })
  } catch (error) {
    console.error('Error analyzing food:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
