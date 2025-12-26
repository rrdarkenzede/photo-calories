/**
 * ANALYSE ALIMENTAIRE IA - Mock Implementation
 * Analyse les images de repas et retourne calories + macronutriments
 */

interface FoodAnalysis {
  name: string;
  description: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  confidence: number; // 0-100%
}

// Base de données d'aliments communs
const FOOD_DATABASE: { [key: string]: FoodAnalysis } = {
  pizza: {
    name: '🍕 Pizza',
    description: 'Tranche de pizza au fromage',
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    fiber: 2,
    sugar: 3,
    sodium: 600,
    confidence: 92,
  },
  burger: {
    name: '🍔 Burger',
    description: 'Hamburger avec fromage et sauce',
    calories: 540,
    protein: 28,
    carbs: 40,
    fat: 28,
    fiber: 2,
    sugar: 8,
    sodium: 1100,
    confidence: 90,
  },
  salade: {
    name: '🥗 Salade',
    description: 'Salade verte avec vinaigrette',
    calories: 120,
    protein: 8,
    carbs: 15,
    fat: 4,
    fiber: 4,
    sugar: 3,
    sodium: 250,
    confidence: 85,
  },
  poulet: {
    name: '🍗 Poulet grillé',
    description: 'Filet de poulet grillé',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 75,
    confidence: 88,
  },
  pates: {
    name: '🍝 Pâtes',
    description: 'Pâtes avec sauce tomate',
    calories: 280,
    protein: 10,
    carbs: 48,
    fat: 3,
    fiber: 3,
    sugar: 5,
    sodium: 400,
    confidence: 87,
  },
  riz: {
    name: '🍚 Riz blanc',
    description: 'Portion de riz cuit',
    calories: 206,
    protein: 4.3,
    carbs: 45,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0,
    sodium: 2,
    confidence: 89,
  },
  sandwich: {
    name: '🥪 Sandwich',
    description: 'Sandwich jambon-fromage',
    calories: 320,
    protein: 15,
    carbs: 35,
    fat: 12,
    fiber: 2,
    sugar: 4,
    sodium: 800,
    confidence: 86,
  },
  oeufs: {
    name: '🥚 Œufs',
    description: '2 œufs brouillés',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    sodium: 194,
    confidence: 91,
  },
  pommes: {
    name: '🍎 Pomme',
    description: 'Pomme moyenne',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sugar: 19,
    sodium: 2,
    confidence: 94,
  },
  banane: {
    name: '🍌 Banane',
    description: 'Banane moyenne',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    fiber: 3.1,
    sugar: 14,
    sodium: 1,
    confidence: 95,
  },
};

/**
 * Analyse une image alimentaire et retourne les nutritions
 * @param imageData Base64 encoded image
 * @returns FoodAnalysis object
 */
export async function analyzeFood(imageData: string): Promise<FoodAnalysis> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Mock: Sélectionne aléatoirement un aliment pour la démo
        const foods = Object.values(FOOD_DATABASE);
        const randomFood = foods[Math.floor(Math.random() * foods.length)];

        // Ajoute une petite variation pour faire réaliste
        const variation = 0.9 + Math.random() * 0.2; // ±10%

        resolve({
          ...randomFood,
          calories: Math.round(randomFood.calories * variation),
          protein: parseFloat((randomFood.protein * variation).toFixed(1)),
          carbs: parseFloat((randomFood.carbs * variation).toFixed(1)),
          fat: parseFloat((randomFood.fat * variation).toFixed(1)),
        });
      } catch (error) {
        reject(new Error('❌ Erreur lors de l\'analyse de l\'image'));
      }
    }, 1500); // Simule le délai API
  });
}

/**
 * Scanne un code-barres et retourne les infos nutritionnelles
 * @param barcode Barcode string
 * @returns FoodAnalysis object
 */
export async function scanBarcode(barcode: string): Promise<FoodAnalysis> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Mock: Retourne un aliment aléatoire
        const foods = Object.values(FOOD_DATABASE);
        const randomFood = foods[Math.floor(Math.random() * foods.length)];

        resolve(randomFood);
      } catch (error) {
        reject(new Error('❌ Code-barres non trouvé'));
      }
    }, 800);
  });
}
