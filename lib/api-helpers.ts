// API Helper functions

const CLARIFAI_API_KEY = process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '';
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v3';

/**
 * Recognize food items from an image using Clarifai
 */
export async function recognizeFoodFromImage(imageData: string): Promise<string[]> {
  try {
    // This would call Clarifai API
    // For now, returning mock data
    console.log('Recognizing food from image...');
    
    // TODO: Implement actual Clarifai integration
    return ['Pâtes', 'Sauce tomate', 'Fromage', 'Huile d\'olive'];
  } catch (error) {
    console.error('Error recognizing food:', error);
    return [];
  }
}

/**
 * Get nutritional data from USDA Food Data Central
 */
export async function getNutritionFromUSDA(foodName: string): Promise<any> {
  try {
    const response = await fetch(
      `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(
        foodName
      )}&pageSize=5&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) throw new Error('USDA API error');
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Error fetching USDA data:', error);
    return [];
  }
}

/**
 * Search food by barcode using OpenFoodFacts
 */
export async function searchByBarcode(barcode: string): Promise<any> {
  try {
    const response = await fetch(`${OPENFOODFACTS_API}/product/${barcode}.json`);

    if (!response.ok) throw new Error('Product not found');
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error searching barcode:', error);
    return null;
  }
}

/**
 * Search for food by name in OpenFoodFacts
 */
export async function searchFoodByName(foodName: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${OPENFOODFACTS_API}/search?q=${encodeURIComponent(foodName)}&fields=code,product_name,nutrition_grades,nutriments`
    );

    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching food:', error);
    return [];
  }
}

/**
 * Get autocomplete suggestions for ingredients from USDA
 */
export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  try {
    if (query.length < 2) return [];

    const response = await fetch(
      `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(
        query
      )}&pageSize=8&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) throw new Error('USDA API error');
    const data = await response.json();
    
    return data.foods
      ?.slice(0, 8)
      .map((food: any) => food.description)
      .filter((desc: string) => desc) || [];
  } catch (error) {
    console.error('Error getting autocomplete:', error);
    return [];
  }
}

/**
 * Extract nutrition from USDA food data
 */
export function extractNutrition(foodData: any): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
} {
  const nutrients = foodData.foodNutrients || [];

  const getNutrient = (name: string) => {
    const nutrient = nutrients.find(
      (n: any) => n.nutrientName?.toLowerCase().includes(name.toLowerCase())
    );
    return nutrient?.value || 0;
  };

  return {
    calories: getNutrient('energy') || getNutrient('kcal'),
    protein: getNutrient('protein'),
    carbs: getNutrient('carbohydrate'),
    fat: getNutrient('fat'),
    fiber: getNutrient('fiber'),
    sugar: getNutrient('sugars'),
    sodium: getNutrient('sodium'),
  };
}

/**
 * Translate food names from English to French
 */
export async function translateFoodName(englishName: string): Promise<string> {
  // For now, return the English name
  // TODO: Implement actual translation via API or i18n
  const translations: Record<string, string> = {
    'milk': 'Lait',
    'semi-skimmed milk': 'Lait semi-écrémé',
    'whole milk': 'Lait entier',
    'lettuce': 'Laitue',
    'bread': 'Pain',
    'pasta': 'Pâtes',
    'tomato sauce': 'Sauce tomate',
    'cheese': 'Fromage',
    'olive oil': 'Huile d\'olive',
    'egg': 'Œuf',
    'chicken': 'Poulet',
    'rice': 'Riz',
    'potato': 'Pomme de terre',
    'carrot': 'Carotte',
    'apple': 'Pomme',
    'banana': 'Banane',
    'yogurt': 'Yaourt',
  };

  return translations[englishName.toLowerCase()] || englishName;
}
