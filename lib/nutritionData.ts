interface NutritionData {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
}

export const NUTRITION_DATABASE: Record<string, NutritionData> = {
  // Viandes & Poissons
  'chicken': { name: 'Poulet', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, salt: 0.1 },
  'beef': { name: 'Bœuf', kcal: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, salt: 0.06 },
  'pork': { name: 'Porc', kcal: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, sugar: 0, salt: 0.08 },
  'salmon': { name: 'Saumon', kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, salt: 0.06 },
  'tuna': { name: 'Thon', kcal: 130, protein: 28, carbs: 0, fat: 1, fiber: 0, sugar: 0, salt: 0.05 },
  'shrimp': { name: 'Crevettes', kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, salt: 0.6 },
  'fish': { name: 'Poisson blanc', kcal: 82, protein: 17.5, carbs: 0, fat: 0.7, fiber: 0, sugar: 0, salt: 0.1 },

  // Féculents
  'rice': { name: 'Riz blanc', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, salt: 0.01 },
  'pasta': { name: 'Pâtes', kcal: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, salt: 0.01 },
  'bread': { name: 'Pain', kcal: 265, protein: 9, carbs: 49, fat: 3.3, fiber: 2.7, sugar: 5, salt: 1.2 },
  'potato': { name: 'Pommes de terre', kcal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.1, sugar: 0.8, salt: 0.01 },
  'quinoa': { name: 'Quinoa', kcal: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, sugar: 0.9, salt: 0.01 },

  // Légumes
  'broccoli': { name: 'Brocoli', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, salt: 0.03 },
  'carrot': { name: 'Carottes', kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, salt: 0.07 },
  'tomato': { name: 'Tomate', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, salt: 0.01 },
  'spinach': { name: 'Épinards', kcal: 23, protein: 2.7, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, salt: 0.08 },
  'lettuce': { name: 'Salade', kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, sugar: 0.8, salt: 0.03 },
  'pepper': { name: 'Poivron', kcal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2, salt: 0.004 },
  'onion': { name: 'Oignon', kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, salt: 0.004 },
  'mushroom': { name: 'Champignons', kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sugar: 2, salt: 0.005 },

  // Fruits
  'apple': { name: 'Pomme', kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, salt: 0.001 },
  'banana': { name: 'Banane', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, salt: 0.001 },
  'orange': { name: 'Orange', kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9, salt: 0 },
  'strawberry': { name: 'Fraises', kcal: 32, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2, sugar: 4.9, salt: 0.001 },

  // Produits laitiers
  'milk': { name: 'Lait', kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5, salt: 0.1 },
  'yogurt': { name: 'Yaourt', kcal: 59, protein: 10, carbs: 3.5, fat: 0.4, fiber: 0, sugar: 3.5, salt: 0.1 },
  'cheese': { name: 'Fromage', kcal: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, salt: 1.6 },
  'butter': { name: 'Beurre', kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1, salt: 0.6 },

  // Légumineuses
  'lentils': { name: 'Lentilles', kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, sugar: 1.8, salt: 0.002 },
  'chickpeas': { name: 'Pois chiches', kcal: 134, protein: 8.9, carbs: 23, fat: 2.6, fiber: 7.6, sugar: 4.8, salt: 0.007 },
  'beans': { name: 'Haricots', kcal: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4, sugar: 0.3, salt: 0.012 },

  // Œufs
  'egg': { name: 'Œuf', kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, salt: 0.4 },

  // Fast Food
  'pizza': { name: 'Pizza', kcal: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sugar: 3.6, salt: 1.3 },
  'burger': { name: 'Burger', kcal: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.5, sugar: 6, salt: 0.8 },
  'fries': { name: 'Frites', kcal: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, sugar: 0.2, salt: 0.2 },
  'sandwich': { name: 'Sandwich', kcal: 226, protein: 11, carbs: 27, fat: 8, fiber: 2, sugar: 4, salt: 1.1 },

  // Boissons
  'cola': { name: 'Coca-Cola', kcal: 42, protein: 0, carbs: 11, fat: 0, fiber: 0, sugar: 11, salt: 0.01 },
  'juice': { name: 'Jus de fruits', kcal: 45, protein: 0.5, carbs: 11, fat: 0.1, fiber: 0.2, sugar: 9.6, salt: 0.01 },
  'water': { name: 'Eau', kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, salt: 0 },

  // Desserts
  'cake': { name: 'Gâteau', kcal: 257, protein: 4, carbs: 38, fat: 10, fiber: 0.7, sugar: 25, salt: 0.5 },
  'cookie': { name: 'Cookies', kcal: 502, protein: 5.6, carbs: 64, fat: 25, fiber: 2, sugar: 35, salt: 0.5 },
  'ice cream': { name: 'Glace', kcal: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, sugar: 21, salt: 0.1 },
  'chocolate': { name: 'Chocolat', kcal: 546, protein: 4.9, carbs: 61, fat: 31, fiber: 7, sugar: 48, salt: 0.02 },

  // Snacks
  'chips': { name: 'Chips', kcal: 536, protein: 6.6, carbs: 53, fat: 34, fiber: 4.4, sugar: 0.4, salt: 1.5 },
  'nuts': { name: 'Noix', kcal: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, sugar: 2.6, salt: 0.02 },
};

export function getNutritionInfo(foodName: string): NutritionData | null {
  const key = foodName.toLowerCase().trim();
  return NUTRITION_DATABASE[key] || null;
}

export function searchNutritionDatabase(query: string): NutritionData[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(NUTRITION_DATABASE)
    .filter(item => item.name.toLowerCase().includes(lowerQuery))
    .slice(0, 20);
}
