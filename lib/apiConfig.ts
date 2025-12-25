export const API_KEYS = {
  CLARIFAI_PAT: process.env.CLARIFAI_PAT || '',
  GOOGLE_VISION_API_KEY: process.env.GOOGLE_VISION_API_KEY || '',
  BARCODE_API_KEY: process.env.BARCODE_API_KEY || '',
  USDA_API_KEY: process.env.USDA_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};

export const API_ENDPOINTS = {
  CLARIFAI_BASE: 'https://api.clarifai.com/v2',
  GOOGLE_VISION: 'https://vision.googleapis.com/v1',
  BARCODE_API: 'https://api.barcodelookup.com/v3',
  USDA_FDC: 'https://fdc.nal.usda.gov/api/v1',
  OPENAI: 'https://api.openai.com/v1',
};
