/**
 * Food Analysis Client
 * Helper functions to interact with the API endpoints
 */

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface AnalyzeResponse {
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
    sugars?: number;
    sodium?: number;
  };
  error?: string;
}

export interface SearchResult {
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

export interface SearchResponse {
  success: boolean;
  query: string;
  results?: SearchResult[];
  usda?: SearchResult[];
  openFoodFacts?: SearchResult[];
  error?: string;
}

/**
 * Analyse une image alimentaire
 * @param imageBase64 - Image en base64 (avec ou sans data: prefix)
 * @returns Analysis avec nutrition data
 */
export async function analyzeFoodImage(imageBase64: string): Promise<AnalyzeResponse> {
  try {
    const response = await axios.post<AnalyzeResponse>('/api/analyze', {
      imageData: imageBase64,
    });

    return response.data;
  } catch (error) {
    console.error('Food analysis error:', error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to analyze image',
    };
  }
}

/**
 * Recherche un aliment
 * @param query - Nom de l'aliment à rechercher
 * @param source - Source de données ('all', 'usda', 'openfoodfacts')
 * @returns Nutrition data from multiple sources
 */
export async function searchFood(
  query: string,
  source: 'all' | 'usda' | 'openfoodfacts' = 'all'
): Promise<SearchResponse> {
  try {
    const response = await axios.get<SearchResponse>('/api/search', {
      params: {
        q: query,
        source,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Food search error:', error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        query,
        error: error.response?.data?.error || error.message,
      };
    }
    return {
      success: false,
      query,
      error: 'Failed to search food',
    };
  }
}

/**
 * Recherche multiple aliments
 * @param foods - Array d'aliments à rechercher
 * @param source - Source de données
 * @returns Results from all foods
 */
export async function searchMultipleFoods(
  foods: string[],
  source: 'all' | 'usda' | 'openfoodfacts' = 'all'
): Promise<SearchResponse> {
  try {
    const response = await axios.post<SearchResponse>('/api/search', {
      foods,
      source,
    });

    return response.data;
  } catch (error) {
    console.error('Multiple foods search error:', error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        query: foods.join(', '),
        error: error.response?.data?.error || error.message,
      };
    }
    return {
      success: false,
      query: foods.join(', '),
      error: 'Failed to search foods',
    };
  }
}

/**
 * Scan un code-barres
 * @param barcode - EAN/UPC barcode
 * @returns Product nutrition data from OpenFoodFacts
 */
export async function scanBarcode(barcode: string): Promise<SearchResponse> {
  try {
    const response = await axios.post<SearchResponse>('/api/barcode', {
      barcode,
    });

    return response.data;
  } catch (error) {
    console.error('Barcode scan error:', error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        query: barcode,
        error: error.response?.data?.error || error.message,
      };
    }
    return {
      success: false,
      query: barcode,
      error: 'Failed to scan barcode',
    };
  }
}

/**
 * Convertir AnalyzeResponse en Meal format
 */
export function analyzeResponseToMeal(response: AnalyzeResponse) {
  if (!response.success || !response.nutrition) {
    return null;
  }

  return {
    id: Date.now().toString(),
    date: new Date(),
    name: response.analysis?.mainFood || response.nutrition.description,
    ingredients: [
      {
        id: '1',
        name: response.nutrition.description,
        quantity: 100,
        unit: 'g',
        calories: response.nutrition.calories,
        protein: response.nutrition.protein,
        carbs: response.nutrition.carbs,
        fat: response.nutrition.fat,
        fiber: response.nutrition.fiber || 0,
        sugar: response.nutrition.sugars || 0,
        sodium: response.nutrition.sodium || 0,
      },
    ],
    totalCalories: response.nutrition.calories,
    totalProtein: response.nutrition.protein,
    totalCarbs: response.nutrition.carbs,
    totalFat: response.nutrition.fat,
    totalFiber: response.nutrition.fiber,
    totalSugar: response.nutrition.sugars,
    totalSodium: response.nutrition.sodium,
    mealType: 'snack' as const,
  };
}

/**
 * Convertir SearchResult en Meal format
 */
export function searchResultToMeal(result: SearchResult, quantity: number = 100) {
  const multiplier = quantity / 100;

  return {
    id: Date.now().toString(),
    date: new Date(),
    name: result.name,
    ingredients: [
      {
        id: result.id,
        name: result.name,
        quantity,
        unit: 'g',
        calories: Math.round(result.calories * multiplier),
        protein: Math.round(result.protein * multiplier * 10) / 10,
        carbs: Math.round(result.carbs * multiplier * 10) / 10,
        fat: Math.round(result.fat * multiplier * 10) / 10,
        fiber: result.fiber ? Math.round(result.fiber * multiplier * 10) / 10 : 0,
        sugar: result.sugar ? Math.round(result.sugar * multiplier * 10) / 10 : 0,
        sodium: result.sodium ? Math.round(result.sodium * multiplier) : 0,
      },
    ],
    totalCalories: Math.round(result.calories * multiplier),
    totalProtein: Math.round(result.protein * multiplier * 10) / 10,
    totalCarbs: Math.round(result.carbs * multiplier * 10) / 10,
    totalFat: Math.round(result.fat * multiplier * 10) / 10,
    totalFiber: result.fiber ? Math.round(result.fiber * multiplier * 10) / 10 : 0,
    totalSugar: result.sugar ? Math.round(result.sugar * multiplier * 10) / 10 : 0,
    totalSodium: result.sodium ? Math.round(result.sodium * multiplier) : 0,
    mealType: 'snack' as const,
  };
}
