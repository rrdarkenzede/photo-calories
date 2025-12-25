import { API_CONFIG, FOOD_RECOGNITION_MODE } from './apiConfig';
import { searchIngredients, INGREDIENTS } from './ingredients';

export interface DetectedFood {
  name: string;
  confidence: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: 'g' | 'ml';
  fiber?: number;
  sugar?: number;
  salt?: number;
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
}

export async function analyzeFoodImage(imageBase64: string): Promise<DetectedFood[]> {
  try {
    // ✅ APPEL API RÉEL VIA NOTRE ROUTE
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'analyse');
    }

    const data = await response.json();
    const concepts = data.concepts || [];

    console.log('🔍 Concepts détectés:', concepts);

    const detectedFoods = concepts
      .filter((c: any) => c.value > 0.6)
      .slice(0, 5)
      .map((concept: any) => matchFoodFromDatabase(concept.name, concept.value))
      .filter((food: DetectedFood | null) => food !== null) as DetectedFood[];

    if (detectedFoods.length === 0) {
      throw new Error('Aucun aliment détecté');
    }

    return detectedFoods;
  } catch (error) {
    console.error('❌ Erreur analyse:', error);
    throw error;
  }
}

function matchFoodFromDatabase(foodName: string, confidence: number): DetectedFood | null {
  const normalizedName = foodName.toLowerCase().trim();

  const foodMapping: { [key: string]: string } = {
    'chicken': 'poulet',
    'beef': 'bœuf',
    'pork': 'porc',
    'steak': 'steak',
    'meat': 'viande',
    'turkey': 'dinde',
    'fish': 'poisson',
    'salmon': 'saumon',
    'tuna': 'thon',
    'rice': 'riz',
    'pasta': 'pâtes',
    'bread': 'pain',
    'potato': 'pomme de terre',
    'fries': 'frites',
    'broccoli': 'brocoli',
    'carrot': 'carotte',
    'tomato': 'tomate',
    'salad': 'salade',
    'apple': 'pomme',
    'banana': 'banane',
    'orange': 'orange',
    'egg': 'œuf',
    'cheese': 'fromage',
    'milk': 'lait',
    'yogurt': 'yaourt',
    'burger': 'hamburger',
    'pizza': 'pizza',
    'sandwich': 'sandwich',
  };

  let searchTerm = normalizedName;
  for (const [english, french] of Object.entries(foodMapping)) {
    if (normalizedName.includes(english)) {
      searchTerm = french;
      break;
    }
  }

  const results = searchIngredients(searchTerm);

  if (results.length === 0) {
    console.warn(`⚠️ Aliment "${foodName}" non trouvé dans la base`);
    return null;
  }

  const ingredient = results[0];
  const estimatedQuantity = estimateQuantity(ingredient.category);
  const multiplier = estimatedQuantity / 100;

  return {
    name: ingredient.name,
    confidence,
    kcal: ingredient.kcal100g * multiplier,
    protein: ingredient.protein * multiplier,
    carbs: ingredient.carbs * multiplier,
    fat: ingredient.fat * multiplier,
    fiber: ingredient.fiber ? ingredient.fiber * multiplier : undefined,
    sugar: ingredient.sugar ? ingredient.sugar * multiplier : undefined,
    salt: ingredient.salt ? ingredient.salt * multiplier : undefined,
    nutriScore: ingredient.nutriScore,
    quantity: estimatedQuantity,
    unit: 'g',
  };
}

function estimateQuantity(category: string): number {
  const quantities: { [key: string]: number } = {
    'Viandes': 200,
    'Poissons': 150,
    'Féculents': 150,
    'Légumes': 100,
    'Fruits': 150,
    'Produits laitiers': 125,
    'Oléagineux': 30,
  };

  return quantities[category] || 100;
}
