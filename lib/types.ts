// Plan types
export type PlanType = 'free' | 'pro' | 'fitness';

export interface UserPlan {
  type: PlanType;
  scansPerDay: number;
  historicDays: number;
  features: {
    macros: boolean;
    micros: boolean;
    tableauEditable: boolean;
    recipeBuilder: boolean;
    coachAI: boolean;
    analytics: boolean;
    fitnessSync: boolean;
  };
}

// Meal & Food types
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  nutriScore?: string;
}

export interface Meal {
  id: string;
  date: Date;
  name: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  totalSugar?: number;
  totalSodium?: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isRecipe?: boolean;
  recipeId?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions?: string;
  servings: number;
  createdAt: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface DailyStats {
  date: Date;
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  burned: number;
  net: number;
  meals: Meal[];
}

// Coach AI
export interface CoachProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'weightLoss' | 'maintenance' | 'muscleGain';
}

export interface CoachRecommendation {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  message: string;
}

// Barcode product
export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  nutriScore?: string;
  imageUrl?: string;
}