export type UserPlan = 'free' | 'pro' | 'fitness'

export interface User {
  id: string
  email: string
  name?: string
  plan: UserPlan
  scansToday: number
  createdAt: Date
}

export interface ScanLimits {
  free: number
  pro: number
  fitness: number
}

export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  quantity: number
  unit: string
  imageUrl?: string
}

export interface Meal {
  id: string
  userId: string
  date: Date
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  scanType: 'photo' | 'barcode' | 'manual'
}

export interface Recipe {
  id: string
  userId: string
  name: string
  description?: string
  ingredients: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  servings: number
  imageUrl?: string
  createdAt: Date
}

export interface DailyStats {
  date: Date
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: number
  caloriesGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

export interface ClarifaiPrediction {
  name: string
  value: number
}

export interface USDAFood {
  fdcId: number
  description: string
  dataType: string
  foodNutrients: Array<{
    nutrientId: number
    nutrientName: string
    value: number
    unitName: string
  }>
}

export interface OpenFoodFactsProduct {
  code: string
  product_name: string
  brands?: string
  image_url?: string
  nutriments: {
    'energy-kcal'?: number
    energy_100g?: number
    proteins?: number
    proteins_100g?: number
    carbohydrates?: number
    carbohydrates_100g?: number
    fat?: number
    fat_100g?: number
    fiber?: number
    fiber_100g?: number
    sugars?: number
    sugars_100g?: number
  }
}