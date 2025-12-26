/**
 * POST /api/analyze
 * Analyse une image alimentaire avec:
 * 1. Clarifai (reconnaissance IA)
 * 2. USDA (nutrition data)
 * 3. OpenFoodFacts (fallback)
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImage, normalizeClairifaiName } from '@/lib/clarifai-service';
import { searchUSDAFood } from '@/lib/usda-service';
import { searchByName as offSearchByName } from '@/lib/open-food-facts';

interface AnalyzeResponse {
  success: boolean;
  analysis?: {
    foods: Array<{ name: string; confidence: number }>;
    mainFood: string;
    confidence: number;
  };
  nutrition?: {
    source: 'USDA' | 'OpenFoodFacts' | 'local';
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Image data required' 
        },
        { status: 400 }
      );
    }

    console.log('📸 Analysing food image with Clarifai...');

    // STEP 1: Clarifai - Reconnaissance d'image
    let foodAnalysis;
    try {
      foodAnalysis = await analyzeFoodImage(imageData);
    } catch (error) {
      console.error('❌ Clarifai error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to analyze image. Please try again.' 
        },
        { status: 500 }
      );
    }

    if (!foodAnalysis.mainFood || foodAnalysis.confidence < 20) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Could not identify food in image. Please ensure image contains clear food.' 
        },
        { status: 400 }
      );
    }

    console.log(`✅ Clarifai identified: ${foodAnalysis.mainFood} (${foodAnalysis.confidence}%)`);

    // STEP 2: Normaliser le nom pour USDA
    const normalizedFoodName = normalizeClairifaiName(foodAnalysis.mainFood);
    console.log(`🔄 Normalized food name: ${normalizedFoodName}`);

    // STEP 3: USDA - Données nutritionnelles (primaire)
    let nutrition = null;
    let nutritionSource: 'USDA' | 'OpenFoodFacts' | 'local' = 'local';

    console.log(`🥗 Searching USDA for: ${normalizedFoodName}`);
    try {
      nutrition = await searchUSDAFood(normalizedFoodName);
      if (nutrition) {
        nutritionSource = 'USDA';
        console.log(`✅ USDA found nutrition data`);
      }
    } catch (error) {
      console.warn('⚠️ USDA search failed:', error);
    }

    // STEP 4: OpenFoodFacts - Fallback si USDA fail
    if (!nutrition) {
      console.log(`📦 OpenFoodFacts fallback for: ${foodAnalysis.mainFood}`);
      try {
        const offProduct = await offSearchByName(foodAnalysis.mainFood);
        if (offProduct) {
          nutrition = {
            fdcId: offProduct.code,
            description: offProduct.name,
            calories: offProduct.calories,
            protein: offProduct.protein || 0,
            carbs: offProduct.carbs || 0,
            fat: offProduct.fat || 0,
            fiber: offProduct.fiber,
            sugar: offProduct.sugars,
            sodium: offProduct.sodium,
          };
          nutritionSource = 'OpenFoodFacts';
          console.log(`✅ OpenFoodFacts found nutrition data`);
        }
      } catch (error) {
        console.warn('⚠️ OpenFoodFacts search failed:', error);
      }
    }

    // STEP 5: Si rien trouvé, utiliser données par défaut
    if (!nutrition) {
      console.warn('⚠️ No nutrition data found, using default values');
      nutrition = {
        description: foodAnalysis.mainFood,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
      nutritionSource = 'local';
    }

    // STEP 6: Retourner résultat combiné
    const response: AnalyzeResponse = {
      success: true,
      analysis: {
        foods: foodAnalysis.foods,
        mainFood: foodAnalysis.mainFood,
        confidence: foodAnalysis.confidence,
      },
      nutrition: {
        source: nutritionSource,
        description: nutrition.description || foodAnalysis.mainFood,
        calories: nutrition.calories || 0,
        protein: nutrition.protein || 0,
        carbs: nutrition.carbs || 0,
        fat: nutrition.fat || 0,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar,
        sodium: nutrition.sodium,
      },
    };

    console.log(`✅ Analysis complete: ${foodAnalysis.mainFood} from ${nutritionSource}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Analyse error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze - Test endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Food Analysis API',
    endpoint: 'POST /api/analyze',
    requires: {
      imageData: 'base64 encoded image',
    },
    pipeline: [
      '1. Clarifai - Image recognition',
      '2. USDA - Nutrition lookup',
      '3. OpenFoodFacts - Fallback',
    ],
  });
}
