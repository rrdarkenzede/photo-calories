'use client';

import { create } from 'zustand';
import { PlanType, DailyStats, Meal, Recipe, CoachProfile } from './types';
import { PLANS, DEFAULT_DAILY_GOALS } from './plans';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AppState {
  // User management
  currentUser: User | null;
  setUser: (user: User) => void;
  logout: () => void;

  // Plan management
  currentPlan: PlanType;
  setPlan: (plan: PlanType) => void;

  // Daily data
  todayStats: DailyStats | null;
  setTodayStats: (stats: DailyStats) => void;
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  updateMeal: (mealId: string, meal: Partial<Meal>) => void;

  // Historical data
  meals: Meal[];
  addHistoricalMeal: (meal: Meal) => void;
  getMealsInRange: (days: number) => Meal[];

  // Recipes (Fitness only)
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;

  // Coach AI (Fitness only)
  coachProfile: CoachProfile | null;
  setCoachProfile: (profile: CoachProfile) => void;

  // Daily goals
  dailyGoals: typeof DEFAULT_DAILY_GOALS;
  setDailyGoals: (goals: Partial<typeof DEFAULT_DAILY_GOALS>) => void;

  // Scans counter
  scansUsedToday: number;
  incrementScans: () => void;
  resetScans: () => void;
  totalScans: number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User management
  currentUser: null,
  setUser: (user: User) => set({ currentUser: user }),
  logout: () => set({ 
    currentUser: null, 
    todayStats: null,
    meals: [],
    recipes: [],
    coachProfile: null,
    dailyGoals: DEFAULT_DAILY_GOALS,
    scansUsedToday: 0,
  }),

  currentPlan: 'free',
  setPlan: (plan: PlanType) => set({ currentPlan: plan }),

  todayStats: null,
  setTodayStats: (stats: DailyStats) => set({ todayStats: stats }),

  addMeal: (meal: Meal) => {
    set((state) => {
      const updatedStats = state.todayStats || {
        date: new Date(),
        consumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        burned: 0,
        net: 0,
        meals: [],
      };

      updatedStats.meals.push(meal);
      updatedStats.consumed.calories += meal.totalCalories;
      updatedStats.consumed.protein += meal.totalProtein;
      updatedStats.consumed.carbs += meal.totalCarbs;
      updatedStats.consumed.fat += meal.totalFat;

      if (state.currentPlan !== 'free') {
        updatedStats.consumed.fiber = (updatedStats.consumed.fiber || 0) + (meal.totalFiber || 0);
        updatedStats.consumed.sugar = (updatedStats.consumed.sugar || 0) + (meal.totalSugar || 0);
        updatedStats.consumed.sodium = (updatedStats.consumed.sodium || 0) + (meal.totalSodium || 0);
      }

      updatedStats.net = updatedStats.consumed.calories - updatedStats.burned;

      return { todayStats: updatedStats };
    });
  },

  removeMeal: (mealId: string) =>
    set((state) => {
      if (!state.todayStats) return {};
      const meal = state.todayStats.meals.find((m) => m.id === mealId);
      if (!meal) return {};

      const updatedStats = { ...state.todayStats };
      updatedStats.meals = updatedStats.meals.filter((m) => m.id !== mealId);
      updatedStats.consumed.calories -= meal.totalCalories;
      updatedStats.consumed.protein -= meal.totalProtein;
      updatedStats.consumed.carbs -= meal.totalCarbs;
      updatedStats.consumed.fat -= meal.totalFat;

      if (state.currentPlan !== 'free') {
        updatedStats.consumed.fiber = (updatedStats.consumed.fiber || 0) - (meal.totalFiber || 0);
        updatedStats.consumed.sugar = (updatedStats.consumed.sugar || 0) - (meal.totalSugar || 0);
        updatedStats.consumed.sodium = (updatedStats.consumed.sodium || 0) - (meal.totalSodium || 0);
      }

      updatedStats.net = updatedStats.consumed.calories - updatedStats.burned;

      return { todayStats: updatedStats };
    }),

  updateMeal: (mealId: string, mealUpdate: Partial<Meal>) =>
    set((state) => {
      if (!state.todayStats) return {};
      const mealIndex = state.todayStats.meals.findIndex((m) => m.id === mealId);
      if (mealIndex === -1) return {};

      const updatedMeals = [...state.todayStats.meals];
      const oldMeal = updatedMeals[mealIndex];
      const newMeal = { ...oldMeal, ...mealUpdate };

      updatedMeals[mealIndex] = newMeal;

      const updatedStats = { ...state.todayStats, meals: updatedMeals };
      updatedStats.consumed.calories = updatedStats.consumed.calories - oldMeal.totalCalories + newMeal.totalCalories;
      updatedStats.consumed.protein = updatedStats.consumed.protein - oldMeal.totalProtein + newMeal.totalProtein;
      updatedStats.consumed.carbs = updatedStats.consumed.carbs - oldMeal.totalCarbs + newMeal.totalCarbs;
      updatedStats.consumed.fat = updatedStats.consumed.fat - oldMeal.totalFat + newMeal.totalFat;

      if (state.currentPlan !== 'free') {
        updatedStats.consumed.fiber =
          (updatedStats.consumed.fiber || 0) - (oldMeal.totalFiber || 0) + (newMeal.totalFiber || 0);
        updatedStats.consumed.sugar =
          (updatedStats.consumed.sugar || 0) - (oldMeal.totalSugar || 0) + (newMeal.totalSugar || 0);
        updatedStats.consumed.sodium =
          (updatedStats.consumed.sodium || 0) - (oldMeal.totalSodium || 0) + (newMeal.totalSodium || 0);
      }

      updatedStats.net = updatedStats.consumed.calories - updatedStats.burned;

      return { todayStats: updatedStats };
    }),

  meals: [],
  addHistoricalMeal: (meal: Meal) => {
    set((state) => {
      const maxDays = PLANS[state.currentPlan].historicDays;
      const updatedMeals = [...state.meals, meal];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - maxDays);

      // Auto-delete meals older than allowed days (except Fitness)
      return {
        meals: updatedMeals.filter((m) => new Date(m.date) > thirtyDaysAgo || state.currentPlan === 'fitness'),
      };
    });
  },

  getMealsInRange: (days: number) => {
    const state = get();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return state.meals.filter((m) => new Date(m.date) > cutoffDate);
  },

  recipes: [],
  addRecipe: (recipe: Recipe) =>
    set((state) => {
      if (state.currentPlan !== 'fitness') return {};
      return { recipes: [...state.recipes, recipe] };
    }),

  removeRecipe: (recipeId: string) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== recipeId),
    })),

  coachProfile: null,
  setCoachProfile: (profile: CoachProfile) =>
    set((state) => {
      if (state.currentPlan !== 'fitness') return {};
      return { coachProfile: profile };
    }),

  dailyGoals: DEFAULT_DAILY_GOALS,
  setDailyGoals: (goals) =>
    set((state) => ({
      dailyGoals: { ...state.dailyGoals, ...goals },
    })),

  scansUsedToday: 0,
  incrementScans: () => set((state) => ({ scansUsedToday: state.scansUsedToday + 1 })),
  resetScans: () => set({ scansUsedToday: 0 }),
  totalScans: 0,
}));
