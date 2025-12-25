// Configuration des API externes
export const API_CONFIG = {
  // OpenFoodFacts - API GRATUITE pour les codes-barres
  OPENFOODFACTS: {
    BASE_URL: 'https://world.openfoodfacts.org/api/v2',
    USER_AGENT: 'PhotoCalories - Web App - Version 1.0',
  },

  // Clarifai - API reconnaissance alimentaire
  CLARIFAI: {
    API_KEY: process.env.NEXT_PUBLIC_CLARIFAI_API_KEY || '95cc52863ab2402baca61c72e1170fa9',
    MODEL_ID: 'food-item-recognition',
    USER_ID: 'clarifai',
    APP_ID: 'main',
  },

  // USDA FoodData Central - 900,000+ aliments GRATUITS
  USDA: {
    API_KEY: process.env.NEXT_PUBLIC_USDA_API_KEY || 'D6D0KtUuGyownWVE3AtKLObhm2VL7PggbPhipqW4',
    BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
  },

  // Groq API - Coach IA
  GROQ: {
    API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || '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',
    BASE_URL: 'https://api.groq.com/openai/v1',
  },
};

// ✅ MODE API RÉEL ACTIVÉ
export const FOOD_RECOGNITION_MODE: 'clarifai' | 'mock' = 'clarifai';
