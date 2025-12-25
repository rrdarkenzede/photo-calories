export interface Meal {
  id: string
  date: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: Food[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface Food {
  id?: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  quantity?: number
  unit?: string
}

export interface NutritionGoals {
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
}

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'fitness'
  goals: NutritionGoals
  createdAt: Date
}