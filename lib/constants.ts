import { ScanLimits } from '@/types'

export const SCAN_LIMITS: ScanLimits = {
  free: 2,
  pro: 10,
  fitness: 40,
}

export const PLAN_FEATURES = {
  free: {
    name: 'Gratuit',
    price: 0,
    scans: 2,
    history: 7,
    recipes: false,
    stats: false,
    coach: false,
  },
  pro: {
    name: 'Pro',
    price: 4.99,
    scans: 10,
    history: -1, // illimité
    recipes: true,
    stats: true,
    coach: false,
  },
  fitness: {
    name: 'Fitness',
    price: 9.99,
    scans: 40,
    history: -1,
    recipes: true,
    stats: true,
    coach: true,
  },
}

export const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
}

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Petit-déjeuner', emoji: '🍳' },
  { value: 'lunch', label: 'Déjeuner', emoji: '🍲' },
  { value: 'dinner', label: 'Dîner', emoji: '🍝' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
] as const