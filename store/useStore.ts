import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface Goals {
  caloriesPerDay: number;
  proteinPerDay: number;
  carbsPerDay: number;
  fatsPerDay: number;
}

interface StoreState {
  plan: 'free' | 'pro' | 'FITNESS';
  setPlan: (newPlan: 'free' | 'pro' | 'FITNESS') => void;

  scans: Scan[];
  scansToday: number;
  scansDate: string;
  canAddScan: () => boolean;
  addScan: (scan: Scan) => void;
  removeScan: (id: string) => void;
  deleteScan: (id: string) => void;
  getTodayScans: () => Scan[];

  // ✅ NOUVEAU: Propriétés totales pour Header
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: number) => void;

  goals: Goals | null;
  setGoals: (goals: Goals) => void;

  getTodayStats: () => {
    totalKcal: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  resetQuota: () => void;
}

const PLAN_LIMITS = {
  free: 2,
  pro: 10,
  FITNESS: 40,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      plan: 'free',
      scans: [],
      scansToday: 0,
      scansDate: new Date().toISOString().split('T')[0],
      recipes: [],
      goals: null,
      // ✅ Valeurs par défaut
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,

      setPlan: (newPlan) => {
        set({ plan: newPlan });
      },

      canAddScan: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.scansDate !== today) {
          set({
            scansToday: 0,
            scansDate: today,
          });
          return true;
        }

        return state.scansToday < PLAN_LIMITS[state.plan];
      },

      addScan: (scan) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.scansDate !== today) {
          set({
            scansToday: 0,
            scansDate: today,
            scans: [scan],
            // ✅ MET À JOUR les totaux
            totalCalories: scan.kcal,
            totalProtein: scan.protein,
            totalCarbs: scan.carbs,
            totalFat: scan.fat,
          });
          return;
        }

        if (!state.canAddScan()) {
          alert(`🚭 Limite de ${PLAN_LIMITS[state.plan]} scans atteinte!`);
          return;
        }

        // ✅ CORRECTION: Ajoute le scan, ne remplace pas
        set((state) => {
          const todayScans = state.scans.filter(
            (s) => s.timestamp.split('T')[0] === today && s.countsTowardGoal
          );
          const newTotal = {
            totalKcal: todayScans.reduce((sum, s) => sum + s.kcal, 0) + scan.kcal,
            totalProtein: todayScans.reduce((sum, s) => sum + s.protein, 0) + scan.protein,
            totalCarbs: todayScans.reduce((sum, s) => sum + s.carbs, 0) + scan.carbs,
            totalFat: todayScans.reduce((sum, s) => sum + s.fat, 0) + scan.fat,
          };

          return {
            scans: [scan, ...state.scans],
            scansToday: state.scansToday + 1,
            totalCalories: newTotal.totalKcal,
            totalProtein: newTotal.totalProtein,
            totalCarbs: newTotal.totalCarbs,
            totalFat: newTotal.totalFat,
          };
        });
      },

      removeScan: (id) => {
        set((state) => {
          const updatedScans = state.scans.filter((s) => s.id !== id);
          const today = new Date().toISOString().split('T')[0];
          const todayScans = updatedScans.filter(
            (s) => s.timestamp.split('T')[0] === today && s.countsTowardGoal
          );

          return {
            scans: updatedScans,
            totalCalories: todayScans.reduce((sum, s) => sum + s.kcal, 0),
            totalProtein: todayScans.reduce((sum, s) => sum + s.protein, 0),
            totalCarbs: todayScans.reduce((sum, s) => sum + s.carbs, 0),
            totalFat: todayScans.reduce((sum, s) => sum + s.fat, 0),
          };
        });
      },

      deleteScan: (id) => {
        set((state) => {
          const updatedScans = state.scans.filter((s) => s.id !== id);
          const today = new Date().toISOString().split('T')[0];
          const todayScans = updatedScans.filter(
            (s) => s.timestamp.split('T')[0] === today && s.countsTowardGoal
          );

          return {
            scans: updatedScans,
            totalCalories: todayScans.reduce((sum, s) => sum + s.kcal, 0),
            totalProtein: todayScans.reduce((sum, s) => sum + s.protein, 0),
            totalCarbs: todayScans.reduce((sum, s) => sum + s.carbs, 0),
            totalFat: todayScans.reduce((sum, s) => sum + s.fat, 0),
          };
        });
      },

      getTodayScans: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        return state.scans.filter((s) => s.timestamp.startsWith(today));
      },

      addRecipe: (recipe) => {
        set((state) => ({
          recipes: [...state.recipes, recipe],
        }));
      },

      removeRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }));
      },

      setGoals: (goals) => {
        set({ goals });
      },

      getTodayStats: () => {
        const state = get();
        const todayScans = state.getTodayScans().filter((s) => s.countsTowardGoal);

        return {
          totalKcal: todayScans.reduce((sum, s) => sum + s.kcal, 0),
          totalProtein: todayScans.reduce((sum, s) => sum + s.protein, 0),
          totalCarbs: todayScans.reduce((sum, s) => sum + s.carbs, 0),
          totalFat: todayScans.reduce((sum, s) => sum + s.fat, 0),
        };
      },

      resetQuota: () => {
        const today = new Date().toISOString().split('T')[0];
        set({
          scansToday: 0,
          scansDate: today,
        });
      },
    }),
    {
      name: 'photocalories-storage',
    }
  )
);
