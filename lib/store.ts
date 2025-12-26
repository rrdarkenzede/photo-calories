import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Meal {
  id: string;
  date: string;
  name: string;
  image?: string;
  ingredients: Ingredient[];
  nutrition: Nutrition;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  nutriscore?: string;
}

interface Goal {
  dailyCalories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface CoachProfile {
  age?: number;
  weight?: number;
  height?: number;
  activity?: string;
  goal?: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Plan
  plan: 'free' | 'pro' | 'fitness';
  setPlan: (plan: 'free' | 'pro' | 'fitness') => void;

  // Meals
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;
  getMealsForDate: (date: string) => Meal[];

  // Goals
  goal: Goal | null;
  setGoal: (goal: Goal) => void;

  // Coach Profile (Fitness)
  coachProfile: CoachProfile | null;
  setCoachProfile: (profile: CoachProfile) => void;

  // Recipes (Fitness)
  recipes: any[];
  addRecipe: (recipe: any) => void;
  removeRecipe: (id: string) => void;

  // Daily totals
  getDailyTotals: (date: string) => Nutrition;
  getRemainingCalories: (date: string) => number | null;
}

export const useAppStore = create<AppState>()(  
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      plan: 'free',
      setPlan: (plan) => set({ plan }),

      meals: [],
      addMeal: (meal) =>
        set((state) => ({
          meals: [meal, ...state.meals],
        })),
      removeMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        })),
      getMealsForDate: (date: string) => {
        return get().meals.filter((m) => m.date === date);
      },

      goal: null,
      setGoal: (goal) => set({ goal }),

      coachProfile: null,
      setCoachProfile: (coachProfile) => set({ coachProfile }),

      recipes: [],
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes],
        })),
      removeRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      getDailyTotals: (date: string) => {
        const meals = get().getMealsForDate(date);
        const totals: Nutrition = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        };

        meals.forEach((meal) => {
          totals.calories += meal.nutrition.calories;
          totals.protein += meal.nutrition.protein;
          totals.carbs += meal.nutrition.carbs;
          totals.fat += meal.nutrition.fat;
          totals.fiber = (totals.fiber || 0) + (meal.nutrition.fiber || 0);
          totals.sugar = (totals.sugar || 0) + (meal.nutrition.sugar || 0);
          totals.sodium = (totals.sodium || 0) + (meal.nutrition.sodium || 0);
        });

        return totals;
      },

      getRemainingCalories: (date: string) => {
        const state = get();
        if (state.plan === 'free' || !state.goal) return null;

        const totals = state.getDailyTotals(date);
        return state.goal.dailyCalories - totals.calories;
      },
    }),
    {
      name: 'photocalories-store',
      version: 1,
    }
  )
);
