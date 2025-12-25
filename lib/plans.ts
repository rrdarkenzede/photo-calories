export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    scansPerDay: 2,
    features: {
      showCalories: true,
      showMacros: false, // ❌ Pas de macros
      showDetails: false,
      canSetGoal: false,
      canUseCoach: false,
      canSaveRecipes: false,
      canEditIngredients: false,
      canViewRecipes: true, // ✅ Peut VOIR les recettes
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 5,
    scansPerDay: 15,
    features: {
      showCalories: true,
      showMacros: true, // ✅ Protéines, Glucides, Lipides
      showDetails: false, // ❌ Pas de détails (fibres, sucres, etc.)
      canSetGoal: true, // ✅ Objectif calorique personnalisé
      canUseCoach: false,
      canSaveRecipes: false,
      canEditIngredients: false,
      canViewRecipes: true, // ✅ Peut VOIR les recettes
    },
  },
  FITNESS: {
    id: 'fitness',
    name: 'Fitness',
    price: 15, // ✅ 15€
    scansPerDay: 40,
    features: {
      showCalories: true,
      showMacros: true,
      showDetails: true, // ✅ Fibres, Sucres, Sel, Allergènes, etc.
      canSetGoal: true,
      canUseCoach: true, // ✅ Coach IA
      canSaveRecipes: true, // ✅ Sauvegarder recettes
      canEditIngredients: true, // ✅ Modifier ingrédients
      canViewRecipes: true,
    },
  },
};

export type PlanId = 'free' | 'pro' | 'fitness';

export function getPlanById(planId: PlanId) {
  return PLANS[planId.toUpperCase() as keyof typeof PLANS];
}

export function canPerformAction(planId: PlanId, action: string): boolean {
  const plan = getPlanById(planId);
  return (plan.features as any)[action] || false;
}
