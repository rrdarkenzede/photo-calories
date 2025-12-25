import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const { barcode } = await request.json()

    if (!barcode) {
      return NextResponse.json(
        { error: 'Code-barres requis' },
        { status: 400 }
      )
    }

    // Appel à l'API OpenFoodFacts
    const response = await fetch(
      `${API_CONFIG.openFoodFacts.baseUrl}/api/v0/product/${barcode}.json`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    const data = await response.json()

    if (!data.product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    const product = data.product
    const nutriments = product.nutriments || {}

    return NextResponse.json({
      success: true,
      product: {
        code: product.code,
        name: product.product_name || 'Produit inconnu',
        brands: product.brands || '',
        image: product.image_url,
        calories: nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184 || 0,
        protein: nutriments.proteins_100g || 0,
        carbs: nutriments.carbohydrates_100g || 0,
        fat: nutriments.fat_100g || 0,
        fiber: nutriments.fiber_100g || 0,
        sugar: nutriments.sugars_100g || 0,
        quantity: 100,
        unit: 'g',
      },
    })
  } catch (error) {
    console.error('Erreur scan code-barres:', error)
    return NextResponse.json(
      { error: 'Erreur lors du scan' },
      { status: 500 }
    )
  }
}