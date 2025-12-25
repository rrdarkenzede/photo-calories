import { NextRequest, NextResponse } from 'next/server';

interface ScanRequest {
  type: 'photo' | 'barcode' | 'recipe';
  data: {
    image?: string; // base64 for photo
    barcode?: string; // barcode number
    recipeId?: number; // recipe id for pre-made recipes
    name?: string;
    ingredients?: Array<{ name: string; quantity: number; unit: string }>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = (await req.json()) as ScanRequest;

    // TODO: Authenticate user from JWT token
    // TODO: Check scan limits for user's plan (2 free, 10 pro, 40 fitness)
    // TODO: Increment scans_today counter

    let scanData: any = {};

    if (type === 'photo' && data.image) {
      // Call Google Vision API to detect food
      // Parse response to extract:
      // - Food name
      // - Ingredients list with quantities
      // - Estimated calories & macros
      scanData = {
        type: 'photo',
        name: 'Detected Food',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: [],
      };
    } else if (type === 'barcode' && data.barcode) {
      // Call OpenFoodFacts API with barcode
      // Get product info from database
      scanData = {
        type: 'barcode',
        name: 'Product Name',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    } else if (type === 'recipe' && data.recipeId) {
      // Fetch recipe from database
      // Use saved macros
      scanData = {
        type: 'recipe',
        name: 'Recipe Name',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    } else if (type === 'recipe' && data.ingredients) {
      // Manual recipe creation
      // Calculate macros from ingredients
      scanData = {
        type: 'recipe',
        name: data.name || 'My Recipe',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: data.ingredients,
      };
    }

    // TODO: Save scan to database
    // TODO: Update daily_summaries table
    // TODO: Generate AI coach message if applicable

    return NextResponse.json({
      success: true,
      scan: scanData,
      message: 'Scan recorded successfully',
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to process scan' },
      { status: 500 }
    );
  }
}
