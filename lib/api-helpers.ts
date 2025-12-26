// Clarifai - Food recognition
export async function recognizeFood(imageBase64: string): Promise<string[]> {
  // Using Clarifai API to identify food items
  const response = await fetch('https://api.clarifai.com/v2/models/bd367be194cf45149e75112268e2a16b/outputs', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.NEXT_PUBLIC_CLARIFAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_app_id: {
        user_id: 'clarifai',
        app_id: 'main',
      },
      inputs: [
        {
          data: {
            image: {
              base64: imageBase64.split(',')[1],
            },
          },
        },
      ],
    }),
  });

  const data = await response.json();
  const concepts = data.outputs[0].data.concepts;
  return concepts
    .filter((c: any) => c.value > 0.8)
    .map((c: any) => c.name)
    .slice(0, 5);
}

// USDA FoodData Central - Get nutrition info
export async function getNutritionInfo(foodName: string): Promise<any> {
  const response = await fetch(
    `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(foodName)}&pageSize=1&api_key=${process.env.NEXT_PUBLIC_USDA_API_KEY}`
  );

  const data = await response.json();
  if (data.foods.length === 0) return null;

  const food = data.foods[0];
  const nutrients = food.foodNutrients || [];

  const getNutrient = (id: number, name: string, defaultVal = 0) => {
    const nutrient = nutrients.find((n: any) => n.nutrient?.id === id);
    return nutrient ? nutrient.value : defaultVal;
  };

  return {
    name: food.description,
    calories: getNutrient(1008, 'energy'),
    protein: getNutrient(1003, 'protein'),
    carbs: getNutrient(1005, 'carbohydrate'),
    fat: getNutrient(1004, 'lipid'),
    fiber: getNutrient(1079, 'fiber'),
    sugar: getNutrient(2000, 'sugars'),
    sodium: getNutrient(1093, 'sodium'),
  };
}

// Analyze food from image - combines recognition + nutrition lookup
export async function analyzeFood(imageBase64: string): Promise<any> {
  try {
    // Step 1: Recognize food items in the image
    const foods = await recognizeFood(imageBase64);
    
    if (foods.length === 0) {
      throw new Error('Aucun plat reconnu. Essaie une photo plus claire.');
    }

    // Step 2: Get nutrition info for the main food item
    const mainFood = foods[0];
    const nutritionInfo = await getNutritionInfo(mainFood);

    if (!nutritionInfo) {
      throw new Error(`Impossible de trouver les infos nutritionnelles pour "${mainFood}"`);
    }

    return {
      ...nutritionInfo,
      recognizedItems: foods,
      description: `Plat contenant: ${foods.slice(0, 3).join(', ')}.`,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de l\'analyse de l\'image');
  }
}

// OpenFoodFacts - Barcode lookup
export async function getBarcodeProduct(barcode: string): Promise<any> {
  const response = await fetch(`https://world.openfoodsfacts.org/api/v0/product/${barcode}.json`);

  if (!response.ok) return null;

  const data = await response.json();
  if (data.status === 0) return null;

  const nutrients = data.product.nutriments || {};

  return {
    barcode,
    name: data.product.product_name || 'Unknown',
    brand: data.product.brands || 'Unknown',
    calories: nutrients['energy-kcal'] || nutrients['energy-kj'] / 4.184 || 0,
    protein: nutrients.proteins || 0,
    carbs: nutrients.carbohydrates || 0,
    fat: nutrients.fat || 0,
    fiber: nutrients['fiber'] || 0,
    sugar: nutrients.sugars || 0,
    sodium: nutrients.sodium || 0,
    nutriScore: data.product.nutriscore_grade?.toUpperCase() || 'N/A',
    imageUrl: data.product.image_front_url || null,
  };
}

// Autocomplete suggestions for ingredient names
export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  const response = await fetch(
    `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${process.env.NEXT_PUBLIC_USDA_API_KEY}`
  );

  const data = await response.json();
  return data.foods.map((f: any) => f.description).slice(0, 5);
}
