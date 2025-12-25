import { API_CONFIG } from './apiConfig';

export interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    value: number;
    unitName: string;
  }[];
  brandOwner?: string;
  ingredients?: string;
}

export interface FoodNutrients {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
}

// ✅ DICTIONNAIRE MASSIF FR → EN (100+ traductions)
const TRANSLATION_FR_TO_EN: { [key: string]: string } = {
  // Viandes
  'poulet': 'chicken', 'dinde': 'turkey', 'bœuf': 'beef', 'boeuf': 'beef',
  'porc': 'pork', 'agneau': 'lamb', 'veau': 'veal', 'canard': 'duck',
  'lapin': 'rabbit', 'steak': 'steak', 'viande': 'meat', 'jambon': 'ham',
  'bacon': 'bacon', 'saucisse': 'sausage', 'merguez': 'merguez sausage',
  'chorizo': 'chorizo', 'salami': 'salami', 'foie': 'liver',
  
  // Poissons
  'saumon': 'salmon', 'thon': 'tuna', 'cabillaud': 'cod', 'morue': 'cod',
  'truite': 'trout', 'poisson': 'fish', 'crevette': 'shrimp', 'crevettes': 'shrimp',
  'moules': 'mussels', 'huîtres': 'oysters', 'crabe': 'crab', 'homard': 'lobster',
  'sardine': 'sardine', 'maquereau': 'mackerel', 'anchois': 'anchovy',
  
  // Féculents
  'riz': 'rice', 'pâtes': 'pasta', 'pain': 'bread', 'pomme de terre': 'potato',
  'frites': 'french fries', 'quinoa': 'quinoa', 'lentilles': 'lentils',
  'pois chiches': 'chickpeas', 'haricots': 'beans', 'semoule': 'semolina',
  'couscous': 'couscous', 'boulgour': 'bulgur', 'flocons d\'avoine': 'oatmeal',
  
  // Légumes
  'tomate': 'tomato', 'carotte': 'carrot', 'brocoli': 'broccoli',
  'chou-fleur': 'cauliflower', 'chou': 'cabbage', 'salade': 'lettuce',
  'épinards': 'spinach', 'courgette': 'zucchini', 'aubergine': 'eggplant',
  'poivron': 'pepper', 'oignon': 'onion', 'ail': 'garlic', 'concombre': 'cucumber',
  'champignon': 'mushroom', 'asperge': 'asparagus', 'artichaut': 'artichoke',
  'betterave': 'beet', 'céleri': 'celery', 'radis': 'radish',
  
  // Fruits
  'pomme': 'apple', 'banane': 'banana', 'orange': 'orange', 'fraise': 'strawberry',
  'fraises': 'strawberries', 'raisin': 'grape', 'raisins': 'grapes',
  'poire': 'pear', 'pêche': 'peach', 'kiwi': 'kiwi', 'ananas': 'pineapple',
  'mangue': 'mango', 'melon': 'melon', 'pastèque': 'watermelon',
  'cerise': 'cherry', 'abricot': 'apricot', 'prune': 'plum',
  
  // Produits laitiers
  'lait': 'milk', 'yaourt': 'yogurt', 'fromage': 'cheese', 'beurre': 'butter',
  'crème': 'cream', 'œuf': 'egg', 'oeufs': 'eggs', 'mozzarella': 'mozzarella',
  'parmesan': 'parmesan', 'emmental': 'emmental', 'camembert': 'camembert',
  
  // Oléagineux
  'amandes': 'almonds', 'noix': 'walnuts', 'noisettes': 'hazelnuts',
  'cacahuètes': 'peanuts', 'pistaches': 'pistachios', 'cajou': 'cashew',
};

// ✅ DICTIONNAIRE MASSIF EN → FR (200+ traductions - SANS DOUBLONS)
const TRANSLATION_EN_TO_FR: { [key: string]: string } = {
  // Aliments principaux
  'chicken': 'Poulet', 'turkey': 'Dinde', 'beef': 'Bœuf', 'pork': 'Porc',
  'lamb': 'Agneau', 'veal': 'Veau', 'duck': 'Canard', 'rabbit': 'Lapin',
  'salmon': 'Saumon', 'tuna': 'Thon', 'cod': 'Cabillaud', 'trout': 'Truite',
  'shrimp': 'Crevettes', 'mussels': 'Moules', 'oysters': 'Huîtres',
  'rice': 'Riz', 'pasta': 'Pâtes', 'bread': 'Pain', 'potato': 'Pomme de terre',
  'tomato': 'Tomate', 'carrot': 'Carotte', 'broccoli': 'Brocoli',
  'lettuce': 'Salade', 'spinach': 'Épinards', 'zucchini': 'Courgette',
  'apple': 'Pomme', 'banana': 'Banane', 'orange': 'Orange', 'strawberry': 'Fraise',
  'milk': 'Lait', 'cheese': 'Fromage', 'egg': 'Œuf', 'butter': 'Beurre',
  'yogurt': 'Yaourt', 'cream': 'Crème',
  
  // États de cuisson
  'raw': 'cru', 'cooked': 'cuit', 'grilled': 'grillé', 'roasted': 'rôti',
  'fried': 'frit', 'boiled': 'bouilli', 'steamed': 'à la vapeur',
  'baked': 'au four', 'sauteed': 'sauté', 'broiled': 'grillé',
  
  // Préparations
  'fresh': 'frais', 'frozen': 'surgelé', 'canned': 'en conserve',
  'dried': 'séché', 'smoked': 'fumé', 'salted': 'salé', 'pickled': 'mariné',
  
  // Parties d'animaux
  'breast': 'blanc', 'thigh': 'cuisse', 'leg': 'cuisse', 'wing': 'aile',
  'fillet': 'filet', 'steak': 'steak', 'ground': 'haché', 'minced': 'haché',
  'skin': 'avec peau', 'skinless': 'sans peau',
  'boneless': 'sans os', 'bone-in': 'avec os',
  
  // Types de lait/produits (CORRECTION DES DOUBLONS)
  'whole milk': 'lait entier',
  'whole wheat': 'blé complet',
  'skim': 'écrémé', 
  'low-fat': 'allégé', 
  '2%': 'demi-écrémé',
  'fat-free': '0% MG', 
  'full-fat': 'entier',
  
  // Termes généraux
  'broilers': '', 
  'fryers': '', 
  'roasters meat': '', 
  'meat only': 'sans peau',
  'with skin': 'avec peau', 
  'without skin': 'sans peau', 
  'all grades': '',
  'trimmed': 'paré', 
  'untrimmed': 'non paré', 
  'separable lean': 'partie maigre',
  'separable fat': 'gras', 
  'edible portion': 'partie comestible',
  
  // Nettoyage
  'broilers or fryers': '', 
  'all classes': '',
  'composite': '', 
  'nfs': '', 
  'ns as to': '',
};

/**
 * ✅ Traduit FR → EN
 */
function translateQueryToEnglish(queryFR: string): string {
  const lowerQuery = queryFR.toLowerCase().trim();
  
  if (TRANSLATION_FR_TO_EN[lowerQuery]) {
    return TRANSLATION_FR_TO_EN[lowerQuery];
  }
  
  for (const [fr, en] of Object.entries(TRANSLATION_FR_TO_EN)) {
    if (lowerQuery.includes(fr)) {
      return en;
    }
  }
  
  return lowerQuery;
}

/**
 * ✅ Traduit EN → FR (NETTOYAGE MASSIF)
 */
function translateFoodNameToFrench(nameEN: string): string {
  let nameFR = nameEN;
  
  // Étape 1: Traductions principales
  for (const [en, fr] of Object.entries(TRANSLATION_EN_TO_FR)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    nameFR = nameFR.replace(regex, fr);
  }
  
  // Étape 2: Nettoyage des termes inutiles
  const termsToRemove = [
    'broilers or fryers', 'roasters', 'all classes', 'all grades',
    'composite', 'nfs', 'ns as to', 'USDA Commodity',
    'separable lean and fat', 'choice', 'select', 'prime',
  ];
  
  termsToRemove.forEach(term => {
    const regex = new RegExp(term, 'gi');
    nameFR = nameFR.replace(regex, '');
  });
  
  // Étape 3: Nettoyage final
  nameFR = nameFR
    .replace(/\s+/g, ' ')           // Espaces multiples → simple
    .replace(/,\s*,/g, ',')         // Virgules multiples
    .replace(/,\s*$/g, '')          // Virgule à la fin
    .replace(/^\s*,/g, '')          // Virgule au début
    .replace(/\s+,/g, ',')          // Espace avant virgule
    .trim();
  
  // Capitalisation
  nameFR = nameFR.charAt(0).toUpperCase() + nameFR.slice(1);
  
  return nameFR;
}

/**
 * Recherche USDA
 */
export async function searchUSDAFoods(query: string, pageSize = 20): Promise<USDAFood[]> {
  try {
    const queryEN = translateQueryToEnglish(query);
    console.log(`🔍 Recherche USDA: "${query}" → "${queryEN}"`);
    
    const response = await fetch(
      `${API_CONFIG.USDA.BASE_URL}/foods/search?api_key=${API_CONFIG.USDA.API_KEY}&query=${encodeURIComponent(queryEN)}&pageSize=${pageSize}&dataType=Branded,SR Legacy,Foundation`
    );

    if (!response.ok) {
      throw new Error('Erreur API USDA');
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('❌ Erreur USDA:', error);
    return [];
  }
}

/**
 * Extrait macros
 */
export function extractNutrients(food: USDAFood): FoodNutrients {
  const nutrients: FoodNutrients = {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  food.foodNutrients.forEach((nutrient) => {
    switch (nutrient.nutrientNumber) {
      case '208': nutrients.kcal = nutrient.value; break;
      case '203': nutrients.protein = nutrient.value; break;
      case '205': nutrients.carbs = nutrient.value; break;
      case '204': nutrients.fat = nutrient.value; break;
      case '291': nutrients.fiber = nutrient.value; break;
      case '269': nutrients.sugar = nutrient.value; break;
      case '307': nutrients.salt = (nutrient.value / 1000) * 2.5; break;
    }
  });

  return nutrients;
}

/**
 * ✅ Recherche avec traduction 100% FRANÇAIS
 */
export async function searchIngredientsUSDA(queryFR: string): Promise<any[]> {
  const foods = await searchUSDAFoods(queryFR, 20);

  return foods
    .map((food) => {
      const nutrients = extractNutrients(food);
      const nameFR = translateFoodNameToFrench(food.description);
      
      // Filtre les noms vides ou trop courts
      if (nameFR.length < 3) return null;
      
      return {
        id: `usda-${food.fdcId}`,
        name: nameFR, // ✅ 100% FRANÇAIS
        category: food.dataType === 'Branded' ? 'Marques' : 'Aliments',
        kcal100g: Math.round(nutrients.kcal),
        protein: Number(nutrients.protein.toFixed(1)),
        carbs: Number(nutrients.carbs.toFixed(1)),
        fat: Number(nutrients.fat.toFixed(1)),
        fiber: nutrients.fiber ? Number(nutrients.fiber.toFixed(1)) : undefined,
        sugar: nutrients.sugar ? Number(nutrients.sugar.toFixed(1)) : undefined,
        salt: nutrients.salt ? Number(nutrients.salt.toFixed(2)) : undefined,
        brandOwner: food.brandOwner,
      };
    })
    .filter(Boolean); // Retire les nulls
}
