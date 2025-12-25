import { NextRequest, NextResponse } from 'next/server';
import { searchIngredientsUSDA } from '@/lib/usdaFoodData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query manquante' }, { status: 400 });
    }

    const results = await searchIngredientsUSDA(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
