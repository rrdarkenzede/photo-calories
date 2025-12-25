// ✅ TYPES COMPLÈTES CORRIGÉES

export type Plan = 'FREE' | 'PRO' | 'FITNESS';

export interface Scan {
  id: string;
  productName: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
  timestamp: string;
  countsTowardGoal: boolean;
  type: 'photo' | 'barcode' | 'recipe';
  imageUrl?: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  kcal100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
  quantity: number;
  unit: 'g' | 'ml' | 'piece' | 'cuillere';
  weight: number;
  kcal: number;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWeight: number;
}

export interface CoachProfile {
  height: number;
  weight: number;
  age: number;
  gender: 'M' | 'F';
  exerciseFreq: 'sedentary' | 'light' | 'moderate' | 'intense' | 'veryIntense';
  goal: 'loss' | 'maintain' | 'gain';
  goals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  kcal100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyProgress {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
