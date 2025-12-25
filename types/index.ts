// Vision API Types
export interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  confidence?: number;
}

// Barcode API Types
export interface ProductData {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
  barcode?: string;
}

// Nutrition Calculation Types
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface NutritionResult {
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

// User Scan History
export interface Scan {
  id: string;
  productName: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  type: 'barcode' | 'photo' | 'manual';
}

// Daily Summary
export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  scans: Scan[];
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
