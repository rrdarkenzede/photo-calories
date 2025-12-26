/**
 * French Translation System
 * Traduit les noms d'aliments et les messages de l'UI
 */

// Food translations (English → French)
export const FOOD_TRANSLATIONS: Record<string, string> = {
  // Breads & Grains
  'bread': 'pain',
  'white bread': 'pain blanc',
  'brown bread': 'pain complet',
  'sliced bread': 'pain tranché',
  'whole wheat bread': 'pain complet',
  'croissant': 'croissant',
  'bagel': 'bagel',
  'baguette': 'baguette',
  'roll': 'petit pain',
  
  // Meats & Proteins
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
  'bacon': 'bacon',
  'sausage': 'saucisse',
  'turkey': 'dinde',
  'fish': 'poisson',
  'salmon': 'saumon',
  'tuna': 'thon',
  'shrimp': 'crevette',
  'cod': 'morue',
  'trout': 'truite',
  'crab': 'crabe',
  'lobster': 'homard',
  'egg': 'oeuf',
  'tofu': 'tofu',
  'beans': 'haricots',
  'lentils': 'lentilles',
  'chickpea': 'pois chiche',
  
  // Vegetables
  'salad': 'salade',
  'green salad': 'salade verte',
  'tomato': 'tomate',
  'carrot': 'carotte',
  'lettuce': 'laitue',
  'spinach': 'épinards',
  'broccoli': 'brocoli',
  'cauliflower': 'chou-fleur',
  'cabbage': 'chou',
  'potato': 'pomme de terre',
  'sweet potato': 'patate douce',
  'french fries': 'frites',
  'fries': 'frites',
  'onion': 'oignon',
  'garlic': 'ail',
  'bell pepper': 'poivron',
  'cucumber': 'concombre',
  'zucchini': 'courgette',
  'eggplant': 'aubergine',
  'peas': 'petits pois',
  'corn': 'maïs',
  'green beans': 'haricots verts',
  'asparagus': 'asperges',
  'mushroom': 'champignon',
  'avocado': 'avocat',
  
  // Fruits
  'apple': 'pomme',
  'banana': 'banane',
  'orange': 'orange',
  'strawberry': 'fraise',
  'blueberry': 'myrtille',
  'raspberry': 'framboise',
  'grape': 'raisin',
  'watermelon': 'pastèque',
  'melon': 'melon',
  'kiwi': 'kiwi',
  'mango': 'mangue',
  'pineapple': 'ananas',
  'peach': 'pêche',
  'pear': 'poire',
  'plum': 'prune',
  'cherry': 'cerise',
  'lemon': 'citron',
  'lime': 'citron vert',
  'coconut': 'noix de coco',
  'grapefruit': 'pamplemousse',
  'date': 'datte',
  'fig': 'figue',
  'apricot': 'abricot',
  
  // Rice & Pasta
  'rice': 'riz',
  'cooked rice': 'riz cuit',
  'white rice': 'riz blanc',
  'brown rice': 'riz complet',
  'basmati rice': 'riz basmati',
  'jasmine rice': 'riz jasmin',
  'pasta': 'pâtes',
  'cooked pasta': 'pâtes cuites',
  'spaghetti': 'spaghetti',
  'noodles': 'nouilles',
  'udon noodles': 'nouilles udon',
  'ramen': 'ramen',
  'risotto': 'risotto',
  'couscous': 'couscous',
  'quinoa': 'quinoa',
  
  // Prepared Dishes
  'pizza': 'pizza',
  'pizza pie': 'pizza',
  'hamburger': 'hamburger',
  'burger': 'burger',
  'cheeseburger': 'cheeseburger',
  'hot dog': 'hot dog',
  'sandwich': 'sandwich',
  'sub sandwich': 'sandwich sous-marin',
  'wrap': 'wrap',
  'taco': 'taco',
  'burrito': 'burrito',
  'quesadilla': 'quesadilla',
  'soup': 'soupe',
  'pasta dish': 'plat de pâtes',
  'curry': 'curry',
  'stir fry': 'sauté',
  'stew': 'ragoût',
  'casserole': 'casserole',
  'grilled dish': 'plat grillé',
  'roasted vegetables': 'légumes rôtis',
  
  // Dairy & Cheese
  'cheese': 'fromage',
  'cheddar': 'cheddar',
  'mozzarella': 'mozzarella',
  'parmesan': 'parmesan',
  'brie': 'brie',
  'feta': 'feta',
  'gouda': 'gouda',
  'milk': 'lait',
  'whole milk': 'lait entier',
  'skim milk': 'lait écrémé',
  'yogurt': 'yaourt',
  'greek yogurt': 'yaourt grec',
  'butter': 'beurre',
  'cream': 'crème',
  'sour cream': 'crème aigre',
  'cream cheese': 'fromage à tartiner',
  
  // Beverages
  'coffee': 'café',
  'espresso': 'espresso',
  'cappuccino': 'cappuccino',
  'tea': 'thé',
  'black tea': 'thé noir',
  'green tea': 'thé vert',
  'herbal tea': 'tisane',
  'water': 'eau',
  'juice': 'jus',
  'orange juice': 'jus d\'orange',
  'apple juice': 'jus de pomme',
  'smoothie': 'smoothie',
  'protein shake': 'shake protéiné',
  'milk shake': 'milk-shake',
  'soda': 'soda',
  'cola': 'cola',
  'beer': 'bière',
  'wine': 'vin',
  'red wine': 'vin rouge',
  'white wine': 'vin blanc',
  'whiskey': 'whisky',
  'vodka': 'vodka',
  'rum': 'rhum',
  'cocktail': 'cocktail',
  
  // Desserts & Sweets
  'cake': 'gâteau',
  'chocolate cake': 'gâteau au chocolat',
  'cheesecake': 'cheesecake',
  'brownie': 'brownie',
  'chocolate': 'chocolat',
  'dark chocolate': 'chocolat noir',
  'milk chocolate': 'chocolat au lait',
  'ice cream': 'glace',
  'vanilla ice cream': 'glace à la vanille',
  'chocolate ice cream': 'glace au chocolat',
  'cookie': 'biscuit',
  'chocolate chip cookie': 'biscuit aux pépites de chocolat',
  'donut': 'donut',
  'doughnut': 'donut',
  'pastry': 'pâtisserie',
  'pie': 'tarte',
  'apple pie': 'tarte aux pommes',
  'pumpkin pie': 'tarte à la citrouille',
  'tart': 'tartelette',
  'candy': 'bonbon',
  'chocolate bar': 'barre de chocolat',
  'granola bar': 'barre de céréales',
  'muffin': 'muffin',
  'waffle': 'gaufre',
  'pancake': 'crêpe',
  'crepe': 'crêpe',
  'pudding': 'pudding',
  'mousse': 'mousse',
  'tiramisu': 'tiramisu',
  'gelato': 'gelato',
  'sorbet': 'sorbet',
  
  // Breakfast Items
  'cereal': 'céréales',
  'oatmeal': 'flocons d\'avoine',
  'granola': 'granola',
  'muesli': 'muesli',
  'toast': 'toast',
  'jam': 'confiture',
  'honey': 'miel',
  'maple syrup': 'sirop d\'érable',
  'bacon': 'bacon',
  'sausage': 'saucisse',
  'hash browns': 'pommes de terre rissolées',
  
  // Nuts & Seeds
  'almond': 'amande',
  'peanut': 'cacahuète',
  'walnut': 'noix',
  'cashew': 'noix de cajou',
  'pistachio': 'pistache',
  'sunflower seed': 'graine de tournesol',
  'pumpkin seed': 'graine de courge',
  'chia seed': 'graine de chia',
  'flaxseed': 'graine de lin',
  
  // Oils & Condiments
  'olive oil': 'huile d\'olive',
  'vegetable oil': 'huile végétale',
  'salt': 'sel',
  'pepper': 'poivre',
  'sugar': 'sucre',
  'honey': 'miel',
  'ketchup': 'ketchup',
  'mayonnaise': 'mayonnaise',
  'mustard': 'moutarde',
  'soy sauce': 'sauce soja',
  'hot sauce': 'sauce piquante',
  'vinegar': 'vinaigre',
};

// UI Message translations
export const UI_TRANSLATIONS: Record<string, string> = {
  // Buttons
  'Select Image': 'Sélectionner une image',
  'Search': 'Rechercher',
  'Add': 'Ajouter',
  'Cancel': 'Annuler',
  'Save': 'Enregistrer',
  'Delete': 'Supprimer',
  'Update': 'Modifier',
  'Scan': 'Scanner',
  'Upload': 'Télécharger',
  
  // Messages
  'Loading': 'Chargement...',
  'Error': 'Erreur',
  'Success': 'Succès',
  'Please wait': 'Veuillez patienter',
  'No results found': 'Aucun résultat trouvé',
  'Try again': 'Réessayer',
  'Something went wrong': 'Une erreur s\'est produite',
  
  // Nutrition labels
  'Calories': 'Calories',
  'Protein': 'Protéines',
  'Carbohydrates': 'Glucides',
  'Carbs': 'Glucides',
  'Fat': 'Lipides',
  'Fiber': 'Fibres',
  'Sugar': 'Sucres',
  'Sodium': 'Sodium',
  
  // Sections
  'Today\'s Summary': 'Résumé d\'aujourd\'hui',
  'Search Foods': 'Rechercher des aliments',
  'Analyze Image': 'Analyser une image',
  'Detected Foods': 'Aliments détectés',
  'Nutrition Data': 'Données nutritionnelles',
  'Add to Today\'s Meals': 'Ajouter aux repas d\'aujourd\'hui',
  'Daily Totals': 'Totaux quotidiens',
  
  // Status
  'Analyzing': 'Analyse en cours...',
  'Searching': 'Recherche en cours...',
  'Added': 'Ajouté',
  'Removed': 'Supprimé',
  'Updated': 'Modifié',
};

/**
 * Translate food name from English to French
 */
export function translateFood(englishName: string): string {
  const name = englishName.toLowerCase().trim();
  return FOOD_TRANSLATIONS[name] || englishName;
}

/**
 * Translate UI message
 */
export function translateUI(englishMessage: string): string {
  return UI_TRANSLATIONS[englishMessage] || englishMessage;
}

/**
 * Translate nutrition label
 */
export function translateNutrition(nutrientName: string): string {
  return UI_TRANSLATIONS[nutrientName] || nutrientName;
}

/**
 * Format nutrition value with translated label
 */
export function formatNutritionLabel(nutrient: string, value: number, unit: string = 'g'): string {
  const translatedNutrient = translateNutrition(nutrient);
  if (nutrient === 'Calories') {
    return `${translatedNutrient}: ${value} kcal`;
  }
  return `${translatedNutrient}: ${value} ${unit}`;
}
