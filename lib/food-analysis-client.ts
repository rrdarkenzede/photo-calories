/**
 * Food Analysis Client
 * Helper functions to interact with the API endpoints
 * All output is translated to French
 */

import axios from 'axios';
import { translateFood, translateNutrition } from './translations';

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
 * @returns Analysis avec nutrition data (translated to French)
 */
export async function analyzeFoodImage(imageBase64: string): Promise<AnalyzeResponse> {
  try {
    const response = await axios.post<AnalyzeResponse>('/api/analyze', {
      imageData: imageBase64,
    });

    // Translate results to French
    if (response.data.success && response.data.analysis) {
      response.data.analysis.mainFood = translateFood(response.data.analysis.mainFood);
      response.data.analysis.foods = response.data.analysis.foods.map(f => ({
        ...f,
        name: translateFood(f.name),
      }));
    }
    if (response.data.nutrition) {
      response.data.nutrition.description = translateFood(response.data.nutrition.description);
    }

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
      error: 'Échec de l\'analyse d\'image',
    };
  }
}

/**
 * Recherche un aliment
 * @param query - Nom de l'aliment à rechercher
 * @param source - Source de données ('all', 'usda', 'openfoodfacts')
 * @returns Nutrition data from multiple sources (translated to French)
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

    // Translate results to French
    if (response.data.success && response.data.results) {
      response.data.results = response.data.results.map(item => ({
        ...item,
        name: translateFood(item.name),
      }));
    }

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
      error: 'Échec de la recherche d\'aliments',
    };
  }
}

/**
 * Recherche multiple aliments
 * @param foods - Array d'aliments à rechercher
 * @param source - Source de données
 * @returns Results from all foods (translated to French)
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

    // Translate results to French
    if (response.data.success && response.data.results) {
      response.data.results = response.data.results.map(item => ({
        ...item,
        name: translateFood(item.name),
      }));
    }

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
      error: 'Échec de la recherche d\'aliments',
    };
  }
}

/**
 * Scan un code-barres
 * @param barcode - EAN/UPC barcode
 * @returns Product nutrition data from OpenFoodFacts (translated to French)
 */
export async function scanBarcode(barcode: string): Promise<SearchResponse> {
  try {
    const response = await axios.post<SearchResponse>('/api/barcode', {
      barcode,
    });

    // Translate results to French
    if (response.data.success && response.data.results) {
      response.data.results = response.data.results.map(item => ({
        ...item,
        name: translateFood(item.name),
      }));
    }

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
      error: 'Échec du scan de code-barres',
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

  const nutrition = {
    calories: response.nutrition.calories,
    protein: response.nutrition.protein,
    carbs: response.nutrition.carbs,
    fat: response.nutrition.fat,
    fiber: response.nutrition.fiber || 0,
    sugar: response.nutrition.sugars || 0,
    sodium: response.nutrition.sodium || 0,
  };

  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    name: response.analysis?.mainFood || translateFood(response.nutrition.description),
    ingredients: [
      {
        id: '1',
        name: translateFood(response.nutrition.description),
        quantity: 100,
        unit: 'g',
      },
    ],
    nutrition,
  };
}

/**
 * Convertir SearchResult en Meal format
 */
export function searchResultToMeal(result: SearchResult, quantity: number = 100) {
  const multiplier = quantity / 100;

  const nutrition = {
    calories: Math.round(result.calories * multiplier),
    protein: Math.round(result.protein * multiplier * 10) / 10,
    carbs: Math.round(result.carbs * multiplier * 10) / 10,
    fat: Math.round(result.fat * multiplier * 10) / 10,
    fiber: result.fiber ? Math.round(result.fiber * multiplier * 10) / 10 : 0,
    sugar: result.sugar ? Math.round(result.sugar * multiplier * 10) / 10 : 0,
    sodium: result.sodium ? Math.round(result.sodium * multiplier) : 0,
  };

  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    name: translateFood(result.name),
    ingredients: [
      {
        id: result.id,
        name: translateFood(result.name),
        quantity,
        unit: 'g',
      },
    ],
    nutrition,
  };
}
