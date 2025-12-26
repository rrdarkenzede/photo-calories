/**
 * GET /api/search?q=pizza
 * Recherche un aliment dans USDA + OpenFoodFacts
 * Retourne les résultats des deux sources pour comparaison
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchUSDAFood, searchMultipleUSDAFoods } from '@/lib/usda-service';
import { searchByName as offSearchByName, searchMultipleByName } from '@/lib/open-food-facts';

interface SearchResult {
  source: 'USDA' | 'OpenFoodFacts';
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  brand?: string;
  image?: string;
}

interface SearchResponse {
  success: boolean;
  query: string;
  results?: SearchResult[];
  usda?: SearchResult[];
  openFoodFacts?: SearchResult[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const source = searchParams.get('source') || 'all'; // 'all', 'usda', 'openfoodfacts'

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          query: '',
          error: 'Search query required' 
        },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();
    console.log(`🔍 Searching for: "${cleanQuery}"`);

    // USDA Search
    let usdaResult: SearchResult | null = null;
    if (source === 'all' || source === 'usda') {
      try {
        console.log('🥗 Searching USDA...');
        const usda = await searchUSDAFood(cleanQuery);
        if (usda) {
          usdaResult = {
            source: 'USDA',
            id: usda.fdcId,
            name: usda.description,
            calories: usda.calories,
            protein: usda.protein,
            carbs: usda.carbs,
            fat: usda.fat,
            fiber: usda.fiber,
            sugar: usda.sugars,
            sodium: usda.sodium,
          };
          console.log(`✅ USDA found: ${usda.description}`);
        }
      } catch (error) {
        console.warn('⚠️ USDA error:', error);
      }
    }

    // OpenFoodFacts Search
    let offResult: SearchResult | null = null;
    if (source === 'all' || source === 'openfoodfacts') {
      try {
        console.log('📦 Searching OpenFoodFacts...');
        const off = await offSearchByName(cleanQuery);
        if (off) {
          offResult = {
            source: 'OpenFoodFacts',
            id: off.code,
            name: off.name,
            calories: off.calories,
            protein: off.protein || 0,
            carbs: off.carbs || 0,
            fat: off.fat || 0,
            fiber: off.fiber,
            sugar: off.sugars,
            sodium: off.sodium,
            brand: off.brand,
            image: off.image,
          };
          console.log(`✅ OpenFoodFacts found: ${off.name}`);
        }
      } catch (error) {
        console.warn('⚠️ OpenFoodFacts error:', error);
      }
    }

    // Compiler les résultats
    const results: SearchResult[] = [];
    if (usdaResult) results.push(usdaResult);
    if (offResult) results.push(offResult);

    if (results.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          query: cleanQuery,
          error: 'No results found for: ' + cleanQuery,
          results: [],
        },
        { status: 404 }
      );
    }

    const response: SearchResponse = {
      success: true,
      query: cleanQuery,
      results,
      usda: usdaResult ? [usdaResult] : undefined,
      openFoodFacts: offResult ? [offResult] : undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Search error:', error);
    return NextResponse.json(
      { 
        success: false,
        query: '',
        error: error instanceof Error ? error.message : 'Search failed' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/search - Multiple foods search
 */
export async function POST(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  try {
    const { foods, source = 'all' } = await request.json();

    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          query: '',
          error: 'Foods array required' 
        },
        { status: 400 }
      );
    }

    console.log(`🔍 Batch search for ${foods.length} foods`);

    const results: SearchResult[] = [];

    // USDA Batch
    if (source === 'all' || source === 'usda') {
      try {
        const usdaResults = await searchMultipleUSDAFoods(foods);
        usdaResults.forEach(usda => {
          results.push({
            source: 'USDA',
            id: usda.fdcId,
            name: usda.description,
            calories: usda.calories,
            protein: usda.protein,
            carbs: usda.carbs,
            fat: usda.fat,
            fiber: usda.fiber,
            sugar: usda.sugars,
            sodium: usda.sodium,
          });
        });
        console.log(`✅ USDA found ${usdaResults.length} results`);
      } catch (error) {
        console.warn('⚠️ USDA batch error:', error);
      }
    }

    // OpenFoodFacts Batch
    if (source === 'all' || source === 'openfoodfacts') {
      try {
        const offResults = await searchMultipleByName(foods);
        offResults.forEach(off => {
          results.push({
            source: 'OpenFoodFacts',
            id: off.code,
            name: off.name,
            calories: off.calories,
            protein: off.protein || 0,
            carbs: off.carbs || 0,
            fat: off.fat || 0,
            fiber: off.fiber,
            sugar: off.sugars,
            sodium: off.sodium,
            brand: off.brand,
            image: off.image,
          });
        });
        console.log(`✅ OpenFoodFacts found ${offResults.length} results`);
      } catch (error) {
        console.warn('⚠️ OpenFoodFacts batch error:', error);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          query: foods.join(', '),
          error: 'No results found',
          results: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      query: foods.join(', '),
      results,
    });
  } catch (error) {
    console.error('❌ Batch search error:', error);
    return NextResponse.json(
      { 
        success: false,
        query: '',
        error: error instanceof Error ? error.message : 'Search failed' 
      },
      { status: 500 }
    );
  }
}
