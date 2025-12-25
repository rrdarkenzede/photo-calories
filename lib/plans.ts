// ✅ Configuration des plans d'abonnement

export interface PlanConfig {
  name: string;
  emoji: string;
  color: string;
  scanLimit: number;
  features: string[];
  price?: number;
}

export const PLANS: Record<string, PlanConfig> = {
  FREE: {
    name: 'Gratuit',
    emoji: '🌟',
    color: 'bg-gray-100 text-gray-800',
    scanLimit: 2,
    features: [
      '📋 2 scans par jour',
      '🔍 Reconnaissance d\'aliments basique',
      '📊 Calories affichées',
      '📋 Historique limité',
    ],
    price: 0,
  },
  PRO: {
    name: 'Pro',
    emoji: '🌟',
    color: 'bg-blue-100 text-blue-800',
    scanLimit: 15,
    features: [
      '📋 15 scans par jour',
      '🔍 Reconnaissance d\'aliments avancée',
      '📊 Calories + Macros',
      '📋 Historique complet',
      '🜟 Géstion des recettes',
      '🏓️ Coach nutritionnel basique',
    ],
    price: 4.99,
  },
  FITNESS: {
    name: 'Fitness',
    emoji: '👊',
    color: 'bg-green-100 text-green-800',
    scanLimit: 40,
    features: [
      '📋 40 scans par jour',
      '🔍 Reconnaissance d\'aliments Pro+',
      '📊 Calories + Macros + Micros',
      '📋 Historique illimité',
      '🜟 Géstion des recettes avancée',
      '🏓️ Coach nutritionnel IA complet',
      '📈 Analyisde de progression',
      '📧 Suggestions personnalisées',
    ],
    price: 9.99,
  },
};

export function getPlanFeatures(plan: string): string[] {
  return PLANS[plan]?.features || [];
}

export function getScanLimit(plan: string): number {
  return PLANS[plan]?.scanLimit || 0;
}

export function getPlanName(plan: string): string {
  return PLANS[plan]?.name || 'Unknown';
}

export function getAllPlans() {
  return Object.entries(PLANS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}
