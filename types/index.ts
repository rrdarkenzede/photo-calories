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

export interface RecipeIngredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  weight: number;
  kcal100g: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
}

export interface Recipe {
  id: number;
  name: string;
  image?: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWeight: number;
  prepTime?: number;
  difficulty?: string;
  instructions?: string[];
}

export interface Scan {
  id: string;
  productName: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  salt?: number;
  fiber?: number;
  timestamp: string;
  countsTowardGoal: boolean;
  type: 'barcode' | 'photo';
  mealId?: string;
}

export interface CoachProfile {
  height: number;
  weight: number;
  age: number;
  gender: 'M' | 'F';
  exerciseFreq: 'sedentary' | 'light' | 'moderate' | 'intense' | 'veryIntense';
  goal: 'loss' | 'maintain' | 'gain';
}

export interface Goals {
  caloriesPerDay: number;
  proteinPerDay: number;
  carbsPerDay: number;
  fatsPerDay: number;
  sugarsPerDay?: number;
  saltPerDay?: number;
}

export type PlanId = 'free' | 'pro' | 'FITNESS';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  scansPerDay: number;
  features: string[];
}
