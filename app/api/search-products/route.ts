import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { products: [] },
        { status: 200 }
      )
    }

    const results: any[] = []
    
    try {
      console.log(`Searching for: ${name}`)
      
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1&pageSize=10`
      console.log(`Search URL: ${searchUrl}`)
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'PhotoCalories-Mobile/1.0 (+https://photocalories.app)',
          'Accept': 'application/json',
        },
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        console.error(`Search failed with status ${response.status}`)
        return NextResponse.json({ products: [] })
      }

      const data = await response.json()
      console.log(`Found ${data.products?.length || 0} products`)
      
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        data.products.forEach((product: any) => {
          try {
            if (!product.product_name && !product.name) return
            
            const nutrients = product.nutriments || {}
            
            // Calculate calories from energy kJ
            let calories = 0
            if (nutrients['energy-kcal_100g']) {
              calories = Math.round(nutrients['energy-kcal_100g'])
            } else if (nutrients['energy_100g']) {
              // Convert kJ to kcal (1 kcal = 4.184 kJ)
              calories = Math.round(nutrients['energy_100g'] / 4.184)
            }
            
            const protein = parseFloat(nutrients['proteins_100g']) || 0
            const carbs = parseFloat(nutrients['carbohydrates_100g']) || 0
            const fat = parseFloat(nutrients['fat_100g']) || 0
            const sugars = parseFloat(nutrients['sugars_100g']) || 0
            const fiber = parseFloat(nutrients['fiber_100g']) || 0
            const sodium = parseFloat(nutrients['sodium_100g']) || 0

            results.push({
              code: product.code || product.barcode || '',
              name: (product.product_name || product.name || 'Unknown').substring(0, 100),
              brand: (product.brands || '').substring(0, 50),
              image: product.image_front_small_url || product.image_small_url || product.image_url || undefined,
              calories: Math.max(0, calories),
              protein: Math.round(protein * 10) / 10,
              carbs: Math.round(carbs * 10) / 10,
              fat: Math.round(fat * 10) / 10,
              sugars: Math.round(sugars * 10) / 10,
              fiber: Math.round(fiber * 10) / 10,
              sodium: Math.round(sodium * 1000),
              servingSize: product.serving_size || '100g',
            })
          } catch (err) {
            console.error(`Error parsing product:`, err)
          }
        })
      }
      
      console.log(`Returning ${results.length} results`)
    } catch (fetchError) {
      console.error('Open Food Facts API error:', fetchError)
      // Return empty results instead of error
      return NextResponse.json({ products: [] })
    }

    return NextResponse.json({ products: results })
  } catch (error) {
    console.error('Search products error:', error)
    return NextResponse.json(
      { products: [] },
      { status: 200 }
    )
  }
}
