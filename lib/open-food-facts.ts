// Open Food Facts API Service
// Free database of food products with nutrition data

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v0'

export interface OpenFoodFactsProduct {
  code: string
  name: string
  brand?: string
  image?: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  sugars?: number
  fiber?: number
  sodium?: number
  servingSize?: string
}

export async function searchByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await fetch(
      `${OFF_API_BASE}/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'PhotoCalories-Mobile/1.0',
        },
      }
    )

    if (!response.ok) {
      console.error('OFF API error:', response.status)
      return null
    }

    const data = await response.json()

    if (data.status === 0 || !data.product) {
      return null
    }

    return parseOFFProduct(data.product)
  } catch (error) {
    console.error('Error searching barcode:', error)
    return null
  }
}

export async function searchByName(productName: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await fetch(
      `${OFF_API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&pageSize=1`,
      {
        headers: {
          'User-Agent': 'PhotoCalories-Mobile/1.0',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.products || data.products.length === 0) {
      return null
    }

    return parseOFFProduct(data.products[0])
  } catch (error) {
    console.error('Error searching product name:', error)
    return null
  }
}

function parseOFFProduct(product: any): OpenFoodFactsProduct | null {
  try {
    const nutrients = product.nutriments || {}

    // Get per 100g values
    const calories = nutrients['energy-kcal_100g'] || nutrients['energy_100g'] ? Math.round((nutrients['energy_100g'] || 0) / 4.184) : 0
    const protein = nutrients['proteins_100g'] || 0
    const carbs = nutrients['carbohydrates_100g'] || 0
    const fat = nutrients['fat_100g'] || 0
    const sugars = nutrients['sugars_100g'] || 0
    const fiber = nutrients['fiber_100g'] || 0
    const sodium = nutrients['sodium_100g'] ? nutrients['sodium_100g'] * 1000 : 0 // convert g to mg

    return {
      code: product.code || product.barcode || '',
      name: product.product_name || product.name || 'Unknown Product',
      brand: product.brands || undefined,
      image: product.image_front_small_url || product.image_url || undefined,
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      sugars: Math.round(sugars * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      sodium: Math.round(sodium),
      servingSize: product.serving_size || '100g',
    }
  } catch (error) {
    console.error('Error parsing OFF product:', error)
    return null
  }
}
