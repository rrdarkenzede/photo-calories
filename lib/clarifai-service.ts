/**
 * Clarifai Food Recognition Service
 * Identifie les aliments dans une image avec IA
 * API: https://api.clarifai.com/v2
 */

const CLARIFAI_API_KEY = process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '95cc52863ab2402baca61c72e1170fa9';
const CLARIFAI_USER_ID = 'clarifai';
const CLARIFAI_APP_ID = 'main';
const CLARIFAI_MODEL_ID = 'food-item-recognition';

export interface ClarifaiPrediction {
  name: string;
  confidence: number; // 0-100
}

export interface ClarifaiFoodAnalysis {
  foods: ClarifaiPrediction[];
  mainFood: string;
  confidence: number;
  rawResponse?: any;
}

// French translations for common food items
const FOOD_TRANSLATIONS: Record<string, string> = {
  // Breads
  'bread': 'pain',
  'white bread': 'pain blanc',
  'brown bread': 'pain complet',
  'sliced bread': 'pain tranché',
  'whole wheat bread': 'pain complet',
  
  // Meats
  'chicken': 'poulet',
  'chicken breast': 'poitrine de poulet',
  'grilled chicken': 'poulet grillé',
  'roasted chicken': 'poulet rôti',
  'fried chicken': 'poulet frit',
  'beef': 'boeuf',
  'ground beef': 'boeuf haché',
  'steak': 'steak',
  'pork': 'porc',
  'ham': 'jambon',
  'turkey': 'dinde',
  'fish': 'poisson',
  'salmon': 'saumon',
  'tuna': 'thon',
  'shrimp': 'crevette',
  
  // Vegetables
  'salad': 'salade',
  'green salad': 'salade verte',
  'tomato': 'tomate',
  'carrot': 'carotte',
  'lettuce': 'laitue',
  'spinach': 'épinards',
  'broccoli': 'brocoli',
  'potato': 'pomme de terre',
  'french fries': 'frites',
  'onion': 'oignon',
  'garlic': 'ail',
  'bell pepper': 'poivron',
  'cucumber': 'concombre',
  
  // Fruits
  'apple': 'pomme',
  'banana': 'banane',
  'orange': 'orange',
  'strawberry': 'fraise',
  'blueberry': 'myrtille',
  'grape': 'raisin',
  'watermelon': 'pastèque',
  'kiwi': 'kiwi',
  'mango': 'mangue',
  'pineapple': 'ananas',
  'lemon': 'citron',
  
  // Grains & Pasta
  'rice': 'riz',
  'cooked rice': 'riz cuit',
  'white rice': 'riz blanc',
  'brown rice': 'riz complet',
  'pasta': 'pâtes',
  'cooked pasta': 'pâtes cuites',
  'noodles': 'nouilles',
  
  // Prepared dishes
  'pizza': 'pizza',
  'pizza pie': 'pizza',
  'hamburger': 'hamburger',
  'burger': 'burger',
  'hot dog': 'hot dog',
  'sandwich': 'sandwich',
  'salad': 'salade',
  'soup': 'soupe',
  'pasta dish': 'plat de pâtes',
  
  // Dairy
  'cheese': 'fromage',
  'milk': 'lait',
  'yogurt': 'yaourt',
  'butter': 'beurre',
  'cream': 'crème',
  
  // Beverages
  'coffee': 'café',
  'tea': 'thé',
  'water': 'eau',
  'juice': 'jus',
  'soda': 'soda',
  'beer': 'bière',
  'wine': 'vin',
  
  // Desserts
  'cake': 'gâteau',
  'chocolate': 'chocolat',
  'ice cream': 'glace',
  'cookie': 'biscuit',
  'donut': 'donut',
};

/**
 * Analyse une image alimentaire avec Clarifai
 * @param imageBase64 - Image en base64 (sans data:image/... prefix)
 * @returns Food predictions
 */
export async function analyzeFoodImage(imageBase64: string): Promise<ClarifaiFoodAnalysis> {
  try {
    // Nettoyer le base64 si nécessaire
    let cleanBase64 = imageBase64;
    if (imageBase64.includes('data:image')) {
      cleanBase64 = imageBase64.split(',')[1];
    }

    const response = await fetch(
      `https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/models/${CLARIFAI_MODEL_ID}/outputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: cleanBase64,
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(`Clarifai API error: ${response.status}`, await response.text());
      throw new Error(`Clarifai API error: ${response.status}`);
    }

    const data = await response.json();

    // Vérifier les erreurs
    if (data.status?.code !== 10000) {
      console.error('Clarifai error:', data.status);
      throw new Error(data.status?.description || 'Clarifai analysis failed');
    }

    // Extraire les prédictions
    const outputs = data.outputs?.[0];
    if (!outputs) throw new Error('No outputs from Clarifai');

    const concepts = outputs.data?.concepts || [];

    // Transformer en format interne avec traductions FR
    const foods: ClarifaiPrediction[] = concepts
      .filter((concept: any) => concept.value >= 0.1) // Confiance >= 10%
      .slice(0, 10) // Top 10
      .map((concept: any) => {
        const englishName = concept.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const frenchName = FOOD_TRANSLATIONS[englishName] || englishName;
        return {
          name: frenchName,
          confidence: Math.round(concept.value * 100),
        };
      })
      .filter((f: ClarifaiPrediction) => f.name.length > 0); // Enlever vides

    if (foods.length === 0) {
      throw new Error('No foods detected with sufficient confidence');
    }

    return {
      foods,
      mainFood: foods[0].name,
      confidence: foods[0].confidence,
      rawResponse: data,
    };
  } catch (error) {
    console.error('Clarifai analysis error:', error);
    throw error;
  }
}

/**
 * Batch analysis - plusieurs images
 */
export async function analyzeFoodImageBatch(
  imageBase64Array: string[]
): Promise<ClarifaiFoodAnalysis[]> {
  return Promise.all(
    imageBase64Array.map(img => 
      analyzeFoodImage(img).catch(err => ({
        foods: [],
        mainFood: 'erreur',
        confidence: 0,
        error: err.message,
      }))
    )
  );
}

/**
 * Analyse avec fallback local si Clarifai fail
 */
export async function analyzeFoodImageWithFallback(
  imageBase64: string,
  fallbackFunction?: () => Promise<ClarifaiFoodAnalysis>
): Promise<ClarifaiFoodAnalysis> {
  try {
    return await analyzeFoodImage(imageBase64);
  } catch (error) {
    console.warn('Clarifai failed, using fallback:', error);
    
    if (fallbackFunction) {
      return fallbackFunction();
    }

    // Fallback par défaut - retourner vide
    return {
      foods: [],
      mainFood: 'inconnu',
      confidence: 0,
    };
  }
}

/**
 * Map les noms Clarifai vers noms USDA standard
 * Ex: "sliced bread" → "bread"
 */
export function normalizeClairifaiName(name: string): string {
  const normalizations: Record<string, string> = {
    'pain tranché': 'pain',
    'pain blanc': 'pain',
    'pain complet': 'pain',
    'poulet grillé': 'poulet',
    'poulet rôti': 'poulet',
    'poulet frit': 'poulet',
    'poitrine de poulet': 'poulet',
    'boeuf haché': 'boeuf',
    'riz cuit': 'riz',
    'riz blanc': 'riz',
    'riz complet': 'riz',
    'pâtes cuites': 'pâtes',
    'salade verte': 'salade',
    'pizza pie': 'pizza',
    'hamburger': 'burger',
    'hot dog': 'hotdog',
    // English fallback
    'sliced bread': 'bread',
    'white bread': 'bread',
    'brown bread': 'bread',
    'grilled chicken': 'chicken',
    'roasted chicken': 'chicken',
    'fried chicken': 'chicken',
    'chicken breast': 'chicken',
    'ground beef': 'beef',
    'cooked rice': 'rice',
    'white rice': 'rice',
    'brown rice': 'rice',
    'cooked pasta': 'pasta',
    'green salad': 'salad',
    'pizza pie': 'pizza',
  };

  return normalizations[name] || name;
}

/**
 * Translate English food names to French
 */
export function translateFoodName(englishName: string): string {
  return FOOD_TRANSLATIONS[englishName.toLowerCase()] || englishName;
}
