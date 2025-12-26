export const API_CONFIG = {
  clarifai: {
    baseUrl: 'https://api.clarifai.com/v2',
    apiKey: process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '',
  },
  usda: {
    baseUrl: 'https://fdc.nal.usda.gov/api/v1',
    apiKey: process.env.NEXT_PUBLIC_USDA_API_KEY || '',
  },
  openFoodFacts: {
    baseUrl: process.env.NEXT_PUBLIC_OPENFOODFACTS_API || 'https://world.openfoodfacts.org',
  },
}