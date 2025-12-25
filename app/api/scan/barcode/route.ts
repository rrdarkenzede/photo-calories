import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

interface BarcodeResponse {
  success: boolean
  product?: {
    code: string
    name: string
    brands: string
    image: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    quantity: number
    unit: string
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<BarcodeResponse>> {
  try {
    const { barcode } = await request.json() as { barcode?: string }

    if (!barcode) {
      return NextResponse.json(
        { success: false, error: 'Code-barres requis' },
        { status: 400 }
      )
    }

    // Appel à l'API OpenFoodFacts
    const response = await fetch(
      `${API_CONFIG.openFoodFacts.baseUrl}/api/v0/product/${barcode}.json`
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    const data = await response.json() as unknown
    const d = data as Record<string, unknown>
    const product = d.product as Record<string, unknown> | undefined

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    const nutriments = (product.nutriments ?? {}) as Record<string, number>

    return NextResponse.json({
      success: true,
      product: {
        code: product.code as string,
        name: (product.product_name as string) || 'Produit inconnu',
        brands: (product.brands as string) || '',
        image: (product.image_url as string) || '',
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
      { success: false, error: 'Erreur lors du scan' },
      { status: 500 }
    )
  }
}