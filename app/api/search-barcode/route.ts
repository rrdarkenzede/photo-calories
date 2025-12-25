import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/apiConfig';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('barcode');

    if (!barcode) {
      return NextResponse.json({ error: 'Code-barres manquant' }, { status: 400 });
    }

    const response = await fetch(
      `${API_CONFIG.OPENFOODFACTS.BASE_URL}/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': API_CONFIG.OPENFOODFACTS.USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ product: data.product });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
