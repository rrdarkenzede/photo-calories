import { NextRequest, NextResponse } from 'next/server'
import { searchByName } from '@/lib/open-food-facts'

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Product name too short' },
        { status: 400 }
      )
    }

    // Search using Open Food Facts
    const results: any[] = []
    
    // Get multiple results from Open Food Facts search
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1&pageSize=10`,
        {
          headers: {
            'User-Agent': 'PhotoCalories-Mobile/1.0',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.products && data.products.length > 0) {
          data.products.forEach((product: any) => {
            const nutrients = product.nutriments || {}
            const calories = nutrients['energy-kcal_100g'] || nutrients['energy_100g'] ? Math.round((nutrients['energy_100g'] || 0) / 4.184) : 0
            const protein = nutrients['proteins_100g'] || 0
            const carbs = nutrients['carbohydrates_100g'] || 0
            const fat = nutrients['fat_100g'] || 0
            const sugars = nutrients['sugars_100g'] || 0
            const fiber = nutrients['fiber_100g'] || 0
            const sodium = nutrients['sodium_100g'] ? nutrients['sodium_100g'] * 1000 : 0

            results.push({
              code: product.code || product.barcode || '',
              name: product.product_name || product.name || 'Unknown',
              brand: product.brands || '',
              image: product.image_front_small_url || product.image_url || undefined,
              calories: Math.round(calories),
              protein: Math.round(protein * 10) / 10,
              carbs: Math.round(carbs * 10) / 10,
              fat: Math.round(fat * 10) / 10,
              sugars: Math.round(sugars * 10) / 10,
              fiber: Math.round(fiber * 10) / 10,
              sodium: Math.round(sodium),
              servingSize: product.serving_size || '100g',
            })
          })
        }
      }
    } catch (error) {
      console.error('Open Food Facts search error:', error)
    }

    return NextResponse.json({ products: results })
  } catch (error) {
    console.error('Search products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
