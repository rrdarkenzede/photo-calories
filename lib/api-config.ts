export const API_CONFIG = {
  clarifai: {
    apiKey: process.env.NEXT_PUBLIC_CLARIFAI_API_KEY!,
    modelId: 'food-item-recognition',
    userId: 'clarifai',
    appId: 'main',
  },
  usda: {
    apiKey: process.env.NEXT_PUBLIC_USDA_API_KEY!,
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
  },
  openFoodFacts: {
    baseUrl: process.env.NEXT_PUBLIC_OPENFOODFACTS_API || 'https://world.openfoodfacts.org',
  },
}

export const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/food-item-recognition/outputs'
export const USDA_SEARCH_URL = `${API_CONFIG.usda.baseUrl}/foods/search`
export const USDA_FOOD_URL = `${API_CONFIG.usda.baseUrl}/food`