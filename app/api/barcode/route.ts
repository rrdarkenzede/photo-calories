import { NextResponse } from 'next/server';

const MOCK_PRODUCTS = {
  '3017760000011': { code: '3017760000011', name: 'Coca-Cola 330ml', kcal: 139, protein: 0, carbs: 39, fat: 0 },
  '5900951000731': { code: '5900951000731', name: 'Nestlé KitKat', kcal: 210, protein: 3, carbs: 27, fat: 10 },
  '3045320001234': { code: '3045320001234', name: 'Yaourt Nature', kcal: 59, protein: 3.5, carbs: 4.7, fat: 0.4 },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'No barcode provided' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe dans notre mock DB
    const product = MOCK_PRODUCTS[code as keyof typeof MOCK_PRODUCTS];

    if (product) {
      return NextResponse.json({
        success: true,
        product,
      });
    }

    // Si non trouvé, retourner un produit générique
    return NextResponse.json({
      success: false,
      product: null,
      message: 'Product not found in database',
    });
  } catch (error) {
    console.error('Barcode error:', error);
    return NextResponse.json(
      { error: 'Failed to search product' },
      { status: 500 }
    );
  }
}
