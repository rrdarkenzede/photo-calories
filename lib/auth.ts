// Calculs scientifiques simples - PAS de connexion requise

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
