import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/apiConfig';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';

    if (!query) {
      return NextResponse.json({ error: 'Query manquante' }, { status: 400 });
    }

    const response = await fetch(
      `${API_CONFIG.OPENFOODFACTS.BASE_URL}/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=20&json=1`,
      {
        headers: {
          'User-Agent': API_CONFIG.OPENFOODFACTS.USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur de recherche' }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({ products: data.products || [] });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
