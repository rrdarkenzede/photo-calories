import { NextResponse } from 'next/server';

const MOCK_FOODS = [
  { name: 'Pizza', quantity: 200, unit: 'g', confidence: 0.92, kcal: 532, protein: 22, carbs: 66, fat: 20 },
  { name: 'Salade', quantity: 100, unit: 'g', confidence: 0.85, kcal: 15, protein: 1.2, carbs: 3, fat: 0.2 },
  { name: 'Poulet grillé', quantity: 150, unit: 'g', confidence: 0.88, kcal: 248, protein: 46, carbs: 0, fat: 5 },
  { name: 'Riz blanc', quantity: 200, unit: 'g', confidence: 0.90, kcal: 260, protein: 5.4, carbs: 56, fat: 0.6 },
];

export async function POST(request: Request) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Simule une détection aléatoire pour demo
    const randomFoods = MOCK_FOODS.sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 2 : 1);

    return NextResponse.json({
      success: true,
      results: randomFoods,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
