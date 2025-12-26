import { NextRequest, NextResponse } from 'next/server'
import { searchByBarcode, searchByName } from '@/lib/open-food-facts'

export async function POST(req: NextRequest) {
  try {
    const { barcode, name } = await req.json()

    if (!barcode && !name) {
      return NextResponse.json(
        { error: 'Barcode or product name required' },
        { status: 400 }
      )
    }

    let product = null

    if (barcode) {
      product = await searchByBarcode(barcode)
    }

    if (!product && name) {
      product = await searchByName(name)
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found in Open Food Facts database' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error processing barcode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
