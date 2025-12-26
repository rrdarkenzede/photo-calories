// USDA FoodData Central Service
// Access to 10000+ foods with complete nutrition data

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || 'D6D0KtUuGyownWVE3AtKLObhm2VL7PggbPhipqW4'
const USDA_API_BASE = 'https://fdc.nal.usda.gov/api/food/foods/search'

export interface USDAFood {
  fdcId: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  sugars?: number
  fiber?: number
  sodium?: number
}

export async function searchUSDAFood(foodName: string): Promise<USDAFood | null> {
  try {
    const response = await fetch(
      `${USDA_API_BASE}?query=${encodeURIComponent(foodName)}&pageSize=1&api_key=${USDA_API_KEY}`
    )

    if (!response.ok) {
      console.error('USDA API error:', response.status)
      return null
    }

    const data = await response.json()
    const foods = data.foods || []

    if (foods.length === 0) {
      return null
    }

    // Parse the first result
    const food = foods[0]
    return parseUSDAFood(food)
  } catch (error) {
    console.error('Error searching USDA foods:', error)
    return null
  }
}

export async function searchMultipleUSDAFoods(foodNames: string[]): Promise<USDAFood[]> {
  try {
    const results = await Promise.all(
      foodNames.map(name => searchUSDAFood(name).catch(() => null))
    )
    return results.filter((food): food is USDAFood => food !== null)
  } catch (error) {
    console.error('Error searching multiple USDA foods:', error)
    return []
  }
}

function parseUSDAFood(food: any): USDAFood | null {
  try {
    const nutrients = food.foodNutrients || []
    
    // Find nutrient values
    const getnutrient = (nutrientId: number): number => {
      const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId)
      return nutrient ? parseFloat(nutrient.value || 0) : 0
    }

    // USDA Nutrient IDs:
    // 1008 = Energy (kcal)
    // 1003 = Protein
    // 1005 = Carbohydrate
    // 1004 = Total Lipid (Fat)
    // 2000 = Sugars
    // 1079 = Fiber
    // 1093 = Sodium

    const calories = getnutrient(1008) // kcal per 100g
    const protein = getnutrient(1003)   // g per 100g
    const carbs = getnutrient(1005)     // g per 100g
    const fat = getnutrient(1004)       // g per 100g

    return {
      fdcId: food.fdcId,
      description: food.description || 'Unknown food',
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      sugars: getnutrient(2000),
      fiber: getnutrient(1079),
      sodium: getnutrient(1093),
    }
  } catch (error) {
    console.error('Error parsing USDA food:', error)
    return null
  }
}
