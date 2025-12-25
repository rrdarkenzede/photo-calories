import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  email: string
  name: string
  age: number
  weight: number
  height: number
  gender: 'M' | 'F' | 'Other'
  activity_level: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete'
  goal: 'weight_loss' | 'muscle_gain' | 'maintain' | 'bulk' | 'sports'
  dietary_restrictions: string[]
  plan: 'free' | 'pro' | 'fitness'
  bmr: number
  tdee: number
  target_calories: number
  target_protein: number
  target_carbs: number
  target_fat: number
  scans_remaining: number
  scans_limit: number
}

export const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  if (gender === 'M') {
    return 88 + 13.4 * weight + 4.8 * height - 5.7 * age
  }
  return 655 + 9.6 * weight + 1.8 * height - 4.7 * age
}

export const calculateTDEE = (bmr: number, activity_level: string) => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    athlete: 1.9,
  }
  return bmr * (multipliers[activity_level] || 1.55)
}

export const calculateMacros = (tdee: number, goal: string, weight: number) => {
  const proteinPerKg = 2
  const protein = weight * proteinPerKg
  
  let calorieAdjustment = 0
  if (goal === 'weight_loss') calorieAdjustment = -400
  if (goal === 'muscle_gain' || goal === 'bulk') calorieAdjustment = 400
  
  const targetCalories = tdee + calorieAdjustment
  
  const carbPercentage = goal === 'weight_loss' ? 0.45 : 0.50
  const fatPercentage = 0.25
  
  const carbs = (targetCalories * carbPercentage) / 4
  const fat = (targetCalories * fatPercentage) / 9
  
  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  }
}
