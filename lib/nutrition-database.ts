// Comprehensive nutrition database
export const nutritionDatabase: Record<string, { calories: number; protein: number; carbs: number; fat: number; unit: string }> = {
  // Fruits
  apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, unit: '100g' },
  banana: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: '100g' },
  orange: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, unit: '100g' },
  strawberry: { calories: 32, protein: 0.8, carbs: 8, fat: 0.3, unit: '100g' },
  blueberry: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, unit: '100g' },
  mango: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, unit: '100g' },
  grape: { calories: 67, protein: 0.6, carbs: 17, fat: 0.4, unit: '100g' },
  watermelon: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, unit: '100g' },
  peach: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3, unit: '100g' },
  pear: { calories: 57, protein: 0.4, carbs: 15, fat: 0.1, unit: '100g' },

  // Vegetables
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: '100g' },
  lettuce: { calories: 15, protein: 1.2, carbs: 2.9, fat: 0.2, unit: '100g' },
  carrot: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, unit: '100g' },
  broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g' },
  spinach: { calories: 23, protein: 2.7, carbs: 3.6, fat: 0.4, unit: '100g' },
  cucumber: { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, unit: '100g' },
  bell_pepper: { calories: 31, protein: 1, carbs: 6, fat: 0.3, unit: '100g' },
  onion: { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, unit: '100g' },
  garlic: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, unit: '100g' },
  mushroom: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, unit: '100g' },
  celery: { calories: 16, protein: 0.7, carbs: 3, fat: 0.2, unit: '100g' },
  zucchini: { calories: 21, protein: 1.5, carbs: 3.5, fat: 0.4, unit: '100g' },
  avocado: { calories: 160, protein: 2, carbs: 9, fat: 15, unit: '100g' },
  corn: { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, unit: '100g' },
  peas: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, unit: '100g' },

  // Proteins
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  beef: { calories: 250, protein: 26, carbs: 0, fat: 15, unit: '100g' },
  pork: { calories: 242, protein: 27, carbs: 0, fat: 14, unit: '100g' },
  fish: { calories: 206, protein: 22, carbs: 0, fat: 12, unit: '100g' },
  salmon: { calories: 206, protein: 22, carbs: 0, fat: 13, unit: '100g' },
  tuna: { calories: 129, protein: 29, carbs: 0, fat: 1, unit: '100g' },
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: '1 egg' },
  tofu: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, unit: '100g' },
  shrimp: { calories: 99, protein: 24, carbs: 0, fat: 0.3, unit: '100g' },
  lamb: { calories: 294, protein: 25, carbs: 0, fat: 21, unit: '100g' },

  // Dairy
  milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1, unit: '100ml' },
  yogurt: { calories: 59, protein: 3.5, carbs: 3.3, fat: 0.4, unit: '100g' },
  cheese: { calories: 402, protein: 25, carbs: 1.3, fat: 33, unit: '100g' },
  mozzarella: { calories: 280, protein: 28, carbs: 3.1, fat: 17, unit: '100g' },
  cheddar: { calories: 403, protein: 23, carbs: 3.4, fat: 33, unit: '100g' },
  butter: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, unit: '100g' },
  cream: { calories: 340, protein: 2.2, carbs: 2.8, fat: 35, unit: '100ml' },

  // Grains & Carbs
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: '100g cooked' },
  pasta: { calories: 131, protein: 5, carbs: 25, fat: 1.1, unit: '100g cooked' },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2, unit: '100g' },
  oat: { calories: 389, protein: 17, carbs: 66, fat: 6.9, unit: '100g' },
  wheat: { calories: 364, protein: 14, carbs: 71, fat: 2.5, unit: '100g' },
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1, unit: '100g' },
  sweet_potato: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, unit: '100g' },
  quinoa: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, unit: '100g cooked' },
  barley: { calories: 354, protein: 12, carbs: 73, fat: 2.3, unit: '100g' },

  // Legumes
  beans: { calories: 127, protein: 8.7, carbs: 23, fat: 0.4, unit: '100g cooked' },
  lentil: { calories: 116, protein: 9, carbs: 20, fat: 0.4, unit: '100g cooked' },
  chickpea: { calories: 134, protein: 7.2, carbs: 23, fat: 2.1, unit: '100g cooked' },
  peanut: { calories: 567, protein: 26, carbs: 16, fat: 49, unit: '100g' },
  almond: { calories: 579, protein: 21, carbs: 22, fat: 50, unit: '100g' },

  // Oils & Fats
  olive_oil: { calories: 884, protein: 0, carbs: 0, fat: 100, unit: '100ml' },
  coconut_oil: { calories: 892, protein: 0, carbs: 0, fat: 99, unit: '100ml' },
  butter_oil: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, unit: '100g' },

  // Condiments & Sauces
  olive_oil_vinaigrette: { calories: 130, protein: 0, carbs: 2, fat: 14, unit: '1 tablespoon' },
  mayo: { calories: 680, protein: 0, carbs: 0.6, fat: 76, unit: '100g' },
  ketchup: { calories: 100, protein: 1.7, carbs: 24, fat: 0.1, unit: '100g' },
  soy_sauce: { calories: 53, protein: 8, carbs: 5, fat: 0, unit: '15ml' },
  honey: { calories: 304, protein: 0.3, carbs: 82, fat: 0, unit: '100g' },
  salt: { calories: 0, protein: 0, carbs: 0, fat: 0, unit: '1g' },

  // Dishes
  pizza: { calories: 285, protein: 12, carbs: 36, fat: 10, unit: '100g' },
  burger: { calories: 213, protein: 13, carbs: 20, fat: 10, unit: '100g' },
  pasta_carbonara: { calories: 150, protein: 8, carbs: 12, fat: 8, unit: '100g' },
  salad: { calories: 50, protein: 2, carbs: 5, fat: 2.5, unit: '100g' },
  sandwich: { calories: 150, protein: 7, carbs: 20, fat: 5, unit: '1 sandwich' },
  soup: { calories: 40, protein: 2, carbs: 5, fat: 1.5, unit: '100g' },
}

export function getNutritionByName(name: string): typeof nutritionDatabase[keyof typeof nutritionDatabase] | null {
  const normalized = name.toLowerCase().replace(/[^a-z_]/g, '_')
  
  // Exact match
  if (nutritionDatabase[normalized]) {
    return nutritionDatabase[normalized]
  }

  // Partial match
  for (const [key, value] of Object.entries(nutritionDatabase)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  return null
}

export function calculateNutrition(ingredients: Array<{ name: string; amount: string }>): {
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

  for (const ingredient of ingredients) {
    const nutrition = getNutritionByName(ingredient.name)
    if (!nutrition) continue

    // Parse amount (e.g., "100g", "1 portion", "50ml")
    const amountMatch = ingredient.amount.match(/(\d+)/)
    const amount = amountMatch ? parseInt(amountMatch[1]) : 100

    const multiplier = amount / 100
    totals.calories += Math.round(nutrition.calories * multiplier)
    totals.protein += Math.round(nutrition.protein * multiplier * 10) / 10
    totals.carbs += Math.round(nutrition.carbs * multiplier * 10) / 10
    totals.fat += Math.round(nutrition.fat * multiplier * 10) / 10
  }

  return totals
}
