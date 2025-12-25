import { NextRequest, NextResponse } from 'next/server';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface NutritionCalculation {
  ingredients: Ingredient[];
}

interface NutritionResult {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  servings: number;
  perServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = (await req.json()) as NutritionCalculation;

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Invalid ingredients data' },
        { status: 400 }
      );
    }

    // TODO: Calculate nutrition based on actual ingredient database
    const result: NutritionResult = {
      totalCalories: 500,
      totalProtein: 25,
      totalCarbs: 60,
      totalFat: 15,
      servings: 2,
      perServing: {
        calories: 250,
        protein: 12.5,
        carbs: 30,
        fat: 7.5,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate nutrition' },
      { status: 500 }
    );
  }
}
