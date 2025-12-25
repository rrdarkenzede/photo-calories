// Scientific calculations as per spec

export const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  // Harris-Benedict formula
  if (gender === 'M') {
    return 88 + 13.4 * weight + 4.8 * height - 5.7 * age
  }
  return 655 + 9.6 * weight + 1.8 * height - 4.7 * age
}

export const calculateTDEE = (bmr: number, activityLevel: string) => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    athlete: 1.9,
  }
  return bmr * (multipliers[activityLevel] || 1.55)
}

export const calculateMacros = (tdee: number, goal: string, weight: number) => {
  let calorieAdjustment = 0
  if (goal === 'weight_loss') calorieAdjustment = -400
  if (goal === 'muscle_gain' || goal === 'bulk') calorieAdjustment = 300

  const targetCalories = Math.round(tdee + calorieAdjustment)
  const protein = Math.round(weight * 2) // 2g per kg

  const carbPercentage = goal === 'weight_loss' ? 0.45 : 0.50
  const fatPercentage = 0.25

  const carbs = Math.round((targetCalories * carbPercentage) / 4)
  const fat = Math.round((targetCalories * fatPercentage) / 9)

  return {
    calories: targetCalories,
    protein,
    carbs,
    fat,
  }
}

export type UserProfile = {
  name: string
  age: number
  weight: number
  height: number
  gender: 'M' | 'F' | 'Other'
  activityLevel: string
  goal: string
  restrictions: string[]
  preferences: string[]
  metabolism: string
  bmr: number
  tdee: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  scansRemaining: number
  createdAt: string
}

export type MealEntry = {
  id: string
  date: string
  time: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  items: string[]
}

export const saveProfile = (profile: UserProfile) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('photocal_profile', JSON.stringify(profile))
  }
}

export const getProfile = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('photocal_profile')
    return saved ? JSON.parse(saved) : null
  }
  return null
}

export const saveMeal = (meal: MealEntry) => {
  if (typeof window !== 'undefined') {
    const meals = JSON.parse(localStorage.getItem('photocal_meals') || '[]')
    meals.push(meal)
    localStorage.setItem('photocal_meals', JSON.stringify(meals))
  }
}

export const getTodayMeals = (): MealEntry[] => {
  if (typeof window !== 'undefined') {
    const meals = JSON.parse(localStorage.getItem('photocal_meals') || '[]')
    const today = new Date().toISOString().split('T')[0]
    return meals.filter((m: MealEntry) => m.date === today)
  }
  return []
}

export const getAllMeals = (): MealEntry[] => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('photocal_meals') || '[]')
  }
  return []
}

export const decrementScans = () => {
  const profile = getProfile()
  if (profile && profile.scansRemaining > 0) {
    profile.scansRemaining--
    saveProfile(profile)
  }
}
