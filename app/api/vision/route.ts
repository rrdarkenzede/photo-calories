import { NextRequest, NextResponse } from 'next/server';

interface VisionRequest {
  base64Image: string;
}

interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  confidence: number;
}

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = (await req.json()) as VisionRequest;

    if (!base64Image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Google Vision API or similar
    // For now, return mock data
    const mockData: NutritionData = {
      foodName: 'Mixed Salad',
      calories: 250,
      protein: 12,
      carbs: 30,
      fat: 8,
      serving: '250g',
      confidence: 0.85,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
