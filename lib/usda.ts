/**
 * USDA FoodData Central API
 * Database nutritionnelle officielle USA
 */

const USDA_API_KEY = 'D6D0KtUuGyownWVE3AtKLObhm2VL7PggbPhipqW4';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  servingUnit?: string;
}

/**
 * Search USDA FoodData Central by food name
 */
export async function searchUSDAByName(query: string): Promise<USDAFood[]> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) {
      console.error(`USDA API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const foods = data.foods || [];

    return foods.slice(0, 5).map((food: any) => {
      const nutrients = food.foodNutrients || [];

      // Extract nutrients
      const getnutrient = (id: number, unit: string = 'G') => {
        const nutrient = nutrients.find(
          (n: any) => n.nutrientId === id && n.unitName === unit
        );
        return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
      };

      return {
        name: food.description || 'Unknown',
        calories: getnutrient(1008, 'KCAL'), // Energy (kcal)
        protein: getnutrient(1003), // Protein (g)
        carbs: getnutrient(1005), // Carbohydrate (g)
        fat: getnutrient(1004), // Total lipid (g)
        fiber: getnutrient(1079), // Fiber (g)
        sugar: getnutrient(2000), // Sugars (g)
        sodium: getnutrient(1093), // Sodium (mg)
        servingSize: food.servingSize || 100,
        servingUnit: food.servingSizeUnit || 'g',
      };
    });
  } catch (error) {
    console.error('USDA search error:', error);
    return [];
  }
}

/**
 * Get USDA food by FDC ID
 */
export async function getUSDAFoodById(fdcId: string): Promise<USDAFood | null> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
    );

    if (!response.ok) return null;

    const food = await response.json();
    const nutrients = food.foodNutrients || [];

    const getNutrient = (id: number, unit: string = 'G') => {
      const nutrient = nutrients.find(
        (n: any) => n.nutrientId === id && n.unitName === unit
      );
      return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
    };

    return {
      name: food.description || 'Unknown',
      calories: getNutrient(1008, 'KCAL'),
      protein: getNutrient(1003),
      carbs: getNutrient(1005),
      fat: getNutrient(1004),
      fiber: getNutrient(1079),
      sugar: getNutrient(2000),
      sodium: getNutrient(1093),
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || 'g',
    };
  } catch (error) {
    console.error('USDA get food error:', error);
    return null;
  }
}

/**
 * Get best USDA result from search
 */
export function getBestUSDAFood(foods: USDAFood[]): USDAFood | null {
  if (foods.length === 0) return null;
  // Prefer results with complete nutritional data
  const withAllData = foods.filter((f) => f.calories && f.protein && f.carbs && f.fat);
  return withAllData.length > 0 ? withAllData[0] : foods[0];
}
