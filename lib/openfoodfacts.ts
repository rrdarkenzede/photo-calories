/**
 * OpenFoodFacts API Integration
 * API gratuite pour obtenir les données nutritionnelles
 */

export interface FoodProduct {
  name: string;
  barcode?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  image?: string;
  nutriscore?: string;
  ingredients?: string[];
  brands?: string;
}

const BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Search products by name
 */
export async function searchFoodByName(query: string): Promise<FoodProduct[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=20&fields=product_name,nutriments,image_front_url,nutriscore_grade,ingredients_text,brands,code`
    );

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return [];
    }

    return data.products
      .filter((p: any) => p.product_name && p.nutriments)
      .map((p: any) => ({
        name: p.product_name,
        barcode: p.code,
        calories: p.nutriments['energy-kcal'] || p.nutriments['energy-kcal_100g'] || 0,
        protein: p.nutriments.proteins || p.nutriments.proteins_100g || 0,
        carbs: p.nutriments.carbohydrates || p.nutriments.carbohydrates_100g || 0,
        fat: p.nutriments.fat || p.nutriments.fat_100g || 0,
        fiber: p.nutriments.fiber || p.nutriments.fiber_100g || 0,
        sugar: p.nutriments.sugars || p.nutriments.sugars_100g || 0,
        sodium: p.nutriments.sodium || p.nutriments.sodium_100g || 0,
        image: p.image_front_url || '',
        nutriscore: p.nutriscore_grade?.toUpperCase() || 'N/A',
        ingredients: p.ingredients_text ? [p.ingredients_text] : [],
        brands: p.brands || '',
      }));
  } catch (error) {
    console.error('OpenFoodFacts API error:', error);
    return [];
  }
}

/**
 * Get product by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<FoodProduct | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const p = data.product;
    return {
      name: p.product_name || 'Produit inconnu',
      barcode: barcode,
      calories: p.nutriments['energy-kcal'] || p.nutriments['energy-kcal_100g'] || 0,
      protein: p.nutriments.proteins || p.nutriments.proteins_100g || 0,
      carbs: p.nutriments.carbohydrates || p.nutriments.carbohydrates_100g || 0,
      fat: p.nutriments.fat || p.nutriments.fat_100g || 0,
      fiber: p.nutriments.fiber || p.nutriments.fiber_100g || 0,
      sugar: p.nutriments.sugars || p.nutriments.sugars_100g || 0,
      sodium: p.nutriments.sodium || p.nutriments.sodium_100g || 0,
      image: p.image_front_url || '',
      nutriscore: p.nutriscore_grade?.toUpperCase() || 'N/A',
      ingredients: p.ingredients_text ? [p.ingredients_text] : [],
      brands: p.brands || '',
    };
  } catch (error) {
    console.error('OpenFoodFacts barcode lookup error:', error);
    return null;
  }
}

/**
 * Get multiple products by name with fallback
 */
export async function searchWithFallback(query: string): Promise<FoodProduct[]> {
  // Try exact search first
  let results = await searchFoodByName(query);

  // If no results, try with simplified query
  if (results.length === 0) {
    const simplified = query.split(' ')[0]; // Take first word
    results = await searchFoodByName(simplified);
  }

  return results;
}

/**
 * Estimate nutrition for generic foods (fallback)
 */
export function getGenericFoodEstimate(foodName: string): FoodProduct {
  const lowerName = foodName.toLowerCase();

  // Database of common foods (per 100g)
  const genericDatabase: Record<string, Partial<FoodProduct>> = {
    // Breads
    pain: { calories: 265, protein: 9, carbs: 49, fat: 3.3 },
    'pain blanc': { calories: 265, protein: 9, carbs: 49, fat: 3.3 },
    'pain complet': { calories: 247, protein: 13, carbs: 41, fat: 3.4 },
    // Proteins
    poulet: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    boeuf: { calories: 250, protein: 26, carbs: 0, fat: 17 },
    poisson: { calories: 206, protein: 22, carbs: 0, fat: 12 },
    oeuf: { calories: 155, protein: 13, carbs: 1, fat: 11 },
    // Dairy
    fromage: { calories: 403, protein: 25, carbs: 3, fat: 33 },
    lait: { calories: 49, protein: 3.3, carbs: 4.8, fat: 1.6 },
    yaourt: { calories: 59, protein: 3.5, carbs: 4.7, fat: 0.4 },
    // Vegetables
    tomate: { calories: 18, protein: 1, carbs: 4, fat: 0 },
    salade: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0 },
    carotte: { calories: 41, protein: 1, carbs: 10, fat: 0 },
    // Carbs
    riz: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    'pâtes': { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
    'pomme de terre': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
    // Fruits
    pomme: { calories: 52, protein: 0.3, carbs: 14, fat: 0 },
    banane: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    orange: { calories: 47, protein: 0.9, carbs: 12, fat: 0 },
  };

  const match = genericDatabase[lowerName];
  if (match) {
    return {
      name: foodName,
      calories: match.calories || 100,
      protein: match.protein || 5,
      carbs: match.carbs || 10,
      fat: match.fat || 3,
      nutriscore: 'C',
    };
  }

  // Default fallback
  return {
    name: foodName,
    calories: 100,
    protein: 5,
    carbs: 15,
    fat: 3,
    nutriscore: 'N/A',
  };
}
