export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
  nutriments: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    sugars_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
  };
  nutrition_grade_fr?: 'a' | 'b' | 'c' | 'd' | 'e';
}

export interface ProductData {
  name: string;
  brand?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  imageUrl?: string;
}

export async function searchProductByBarcode(barcode: string): Promise<ProductData | null> {
  try {
    // ✅ APPEL API RÉEL VIA NOTRE ROUTE
    const response = await fetch(`/api/search-barcode?barcode=${barcode}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const product: OpenFoodFactsProduct = data.product;

    return {
      name: product.product_name || 'Produit inconnu',
      brand: product.brands,
      kcal: product.nutriments['energy-kcal_100g'] || 0,
      protein: product.nutriments.proteins_100g || 0,
      carbs: product.nutriments.carbohydrates_100g || 0,
      fat: product.nutriments.fat_100g || 0,
      fiber: product.nutriments.fiber_100g,
      sugar: product.nutriments.sugars_100g,
      salt: product.nutriments.salt_100g,
      nutriScore: product.nutrition_grade_fr?.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
      imageUrl: product.image_url,
    };
  } catch (error) {
    console.error('Erreur OpenFoodFacts:', error);
    return null;
  }
}

export async function searchProductByName(query: string, page = 1): Promise<ProductData[]> {
  try {
    // ✅ APPEL API RÉEL VIA NOTRE ROUTE
    const response = await fetch(`/api/search-product?query=${encodeURIComponent(query)}&page=${page}`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const products = data.products || [];

    return products
      .filter((p: OpenFoodFactsProduct) => p.product_name && p.nutriments['energy-kcal_100g'])
      .map((product: OpenFoodFactsProduct) => ({
        name: product.product_name || 'Produit inconnu',
        brand: product.brands,
        kcal: product.nutriments['energy-kcal_100g'] || 0,
        protein: product.nutriments.proteins_100g || 0,
        carbs: product.nutriments.carbohydrates_100g || 0,
        fat: product.nutriments.fat_100g || 0,
        fiber: product.nutriments.fiber_100g,
        sugar: product.nutriments.sugars_100g,
        salt: product.nutriments.salt_100g,
        nutriScore: product.nutrition_grade_fr?.toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E',
        imageUrl: product.image_url,
      }));
  } catch (error) {
    console.error('Erreur recherche OpenFoodFacts:', error);
    return [];
  }
}
