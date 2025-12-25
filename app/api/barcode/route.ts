import { NextRequest, NextResponse } from 'next/server';

interface BarcodeRequest {
  barcode: string;
}

interface ProductData {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { barcode } = (await req.json()) as BarcodeRequest;

    if (!barcode) {
      return NextResponse.json(
        { error: 'No barcode provided' },
        { status: 400 }
      );
    }

    // TODO: Integrate with OpenFoodFacts or similar
    const mockProduct: ProductData = {
      name: 'Organic Yogurt',
      brand: 'YogurtCo',
      calories: 120,
      protein: 8,
      carbs: 15,
      fat: 2,
      servingSize: '100g',
    };

    return NextResponse.json(mockProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to lookup product' },
      { status: 500 }
    );
  }
}
