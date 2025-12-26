/**
 * LocalStorage Utility
 * Gestion de la persistance des données locales
 */

export interface Meal {
  id: number;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: string;
  image?: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
}

export interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose' | 'maintain' | 'gain';
  dailyCalories?: number;
}

const STORAGE_KEYS = {
  MEALS: 'photocalories_meals',
  RECIPES: 'photocalories_recipes',
  PROFILE: 'photocalories_profile',
  PLAN: 'photocalories_plan',
};

// Helper to check if window is available (for SSR)
const isClient = typeof window !== 'undefined';

/**
 * Save meals to localStorage
 */
export function saveMeals(meals: Meal[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals:', error);
  }
}

/**
 * Load meals from localStorage
 */
export function loadMeals(): Meal[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading meals:', error);
    return [];
  }
}

/**
 * Add a meal to storage
 */
export function addMeal(meal: Meal): void {
  const meals = loadMeals();
  meals.push(meal);
  saveMeals(meals);
}

/**
 * Delete a meal from storage
 */
export function deleteMeal(id: number): void {
  const meals = loadMeals();
  const filtered = meals.filter((m) => m.id !== id);
  saveMeals(filtered);
}

/**
 * Clear all meals
 */
export function clearMeals(): void {
  if (!isClient) return;
  localStorage.removeItem(STORAGE_KEYS.MEALS);
}

/**
 * Save recipes to localStorage
 */
export function saveRecipes(recipes: Recipe[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
}

/**
 * Load recipes from localStorage
 */
export function loadRecipes(): Recipe[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}

/**
 * Add a recipe to storage
 */
export function addRecipe(recipe: Recipe): void {
  const recipes = loadRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
}

/**
 * Delete a recipe from storage
 */
export function deleteRecipe(id: number): void {
  const recipes = loadRecipes();
  const filtered = recipes.filter((r) => r.id !== id);
  saveRecipes(filtered);
}

/**
 * Save user profile
 */
export function saveProfile(profile: UserProfile): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

/**
 * Load user profile
 */
export function loadProfile(): UserProfile | null {
  if (!isClient) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

/**
 * Save selected plan
 */
export function savePlan(plan: string): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PLAN, plan);
  } catch (error) {
    console.error('Error saving plan:', error);
  }
}

/**
 * Load selected plan
 */
export function loadPlan(): string {
  if (!isClient) return 'free';
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAN) || 'free';
  } catch (error) {
    console.error('Error loading plan:', error);
    return 'free';
  }
}

/**
 * Get meals for today
 */
export function getTodayMeals(): Meal[] {
  const meals = loadMeals();
  const today = new Date().toLocaleDateString('fr-FR');
  return meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp).toLocaleDateString('fr-FR');
    return mealDate === today;
  });
}

/**
 * Get meals for a specific date range
 */
export function getMealsByDateRange(startDate: Date, endDate: Date): Meal[] {
  const meals = loadMeals();
  return meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    return mealDate >= startDate && mealDate <= endDate;
  });
}

/**
 * Calculate daily totals
 */
export function calculateDailyTotals(meals: Meal[]) {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(profile: UserProfile): number {
  if (!profile.age || !profile.weight || !profile.height || !profile.gender) {
    return 2000; // Default
  }

  // Mifflin-St Jeor Formula
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[profile.activityLevel || 'moderate'];
  let tdee = bmr * multiplier;

  // Adjust for goal
  if (profile.goal === 'lose') {
    tdee -= 500; // 500 cal deficit for weight loss
  } else if (profile.goal === 'gain') {
    tdee += 500; // 500 cal surplus for weight gain
  }

  return Math.round(tdee);
}

/**
 * Clear all app data
 */
export function clearAllData(): void {
  if (!isClient) return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
