import { NextRequest, NextResponse } from 'next/server'

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
      .filter((c: any) => c.value > 0.7) // Only high confidence
      .slice(0, 5) // Top 5
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

    // Get nutrition data for detected foods
    const nutritionData = await getNutritionData(detectedFoods[0].name)

    return NextResponse.json({
      foods: detectedFoods,
      primary: detectedFoods[0],
      nutrition: nutritionData,
    })
  } catch (error) {
    console.error('Error analyzing food:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Mock nutrition data - will be replaced with real USDA API
async function getNutritionData(foodName: string) {
  // This is a simplified mock - you should integrate USDA FoodData Central API
  const nutritionDatabase: Record<string, any> = {
    pizza: { calories: 720, protein: 32, carbs: 85, fat: 28 },
    burger: { calories: 540, protein: 28, carbs: 45, fat: 26 },
    salad: { calories: 150, protein: 8, carbs: 15, fat: 8 },
    pasta: { calories: 450, protein: 15, carbs: 70, fat: 12 },
    rice: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
    chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    fish: { calories: 206, protein: 22, carbs: 0, fat: 12 },
    bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  }

  // Find closest match
  const normalizedName = foodName.toLowerCase()
  for (const [key, value] of Object.entries(nutritionDatabase)) {
    if (normalizedName.includes(key)) {
      return value
    }
  }

  // Default fallback
  return { calories: 300, protein: 12, carbs: 40, fat: 10 }
}
