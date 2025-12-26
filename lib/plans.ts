import { PlanType, UserPlan, DailyGoals } from './types';

export const PLANS: Record<PlanType, UserPlan> = {
  free: {
    type: 'free',
    scansPerDay: 2,
    historicDays: 7,
    features: {
      macros: false,
      micros: false,
      tableauEditable: false,
      recipeBuilder: false,
      coachAI: false,
      analytics: false,
      fitnessSync: false,
    },
  },
  pro: {
    type: 'pro',
    scansPerDay: 10,
    historicDays: 90,
    features: {
      macros: true,
      micros: false,
      tableauEditable: false, // READ-ONLY
      recipeBuilder: false,
      coachAI: false,
      analytics: true,
      fitnessSync: false,
    },
  },
  fitness: {
    type: 'fitness',
    scansPerDay: 40,
    historicDays: 999999, // Illimité
    features: {
      macros: true,
      micros: true,
      tableauEditable: true,
      recipeBuilder: true,
      coachAI: true,
      analytics: true,
      fitnessSync: false, // Will implement later
    },
  },
};

// Default goals (Free plan - auto-calculated)
export const DEFAULT_DAILY_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 25,
  sugar: 50,
  sodium: 2300,
};

// Plan features descriptions
export const PLAN_DESCRIPTIONS = {
  free: {
    price: '0€',
    scans: '2 scans/jour',
    history: '7 derniers jours',
    highlights: [
      '✅ Comptage calories',
      '❌ Pas de macros',
      '❌ Pas de tableau d\'ingrédients',
      '⚠️ Avec publicités',
    ],
  },
  pro: {
    price: '4,99€/mois',
    scans: '10 scans/jour',
    history: '90 derniers jours',
    highlights: [
      '✅ Calories + Macros',
      '✅ Tableau (lecture seule)',
      '✅ Analytics avancées',
      '❌ Pas de modification tableau',
      '❌ Pas de Coach IA',
    ],
  },
  fitness: {
    price: '9,99€/mois',
    scans: '40 scans/jour',
    history: 'Illimité',
    highlights: [
      '✅ Calories + Macros + Micros',
      '✅ Tableau éditable',
      '✅ Coach IA 24/7',
      '✅ Recipe Builder',
      '✅ Analytics complètes',
      '✅ Sync Fitness (prochainement)',
    ],
  },
};
