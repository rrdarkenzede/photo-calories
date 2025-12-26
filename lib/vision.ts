/**
 * Clarifai Food Recognition API
 * Détection d'aliments dans les images
 */

const CLARIFAI_API_KEY = process.env.NEXT_PUBLIC_CLARIFAI_KEY || 'a002eba876f64c5c94ed96c4dac62c02';
const CLARIFAI_MODEL_ID = 'food-item-recognition';
const CLARIFAI_MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641';

export interface DetectedFood {
  name: string;
  confidence: number;
}

/**
 * Detect food items in an image using Clarifai
 */
export async function detectFoodInImage(imageBase64: string): Promise<DetectedFood[]> {
  try {
    // Remove data:image prefix if present
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLARIFAI_API_KEY}`,
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
                base64: base64Data,
              },
            },
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.outputs || data.outputs.length === 0) {
      console.error('No outputs from Clarifai');
      return [];
    }

    const concepts = data.outputs[0]?.data?.concepts || [];
    
    return concepts
      .slice(0, 5) // Top 5 results
      .map((concept: any) => ({
        name: concept.name,
        confidence: Math.round(concept.value * 100),
      }));
  } catch (error) {
    console.error('Clarifai API error:', error);
    return [];
  }
}

/**
 * Detect food from image file
 */
export async function detectFoodFromFile(file: File): Promise<DetectedFood[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      const foods = await detectFoodInImage(imageData);
      resolve(foods);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
}

/**
 * Detect food from URL
 */
export async function detectFoodFromURL(imageUrl: string): Promise<DetectedFood[]> {
  try {
    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLARIFAI_API_KEY}`,
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
                url: imageUrl,
              },
            },
          },
        ],
      }),
    });

    const data = await response.json();
    const concepts = data.outputs?.[0]?.data?.concepts || [];
    
    return concepts
      .slice(0, 5)
      .map((concept: any) => ({
        name: concept.name,
        confidence: Math.round(concept.value * 100),
      }));
  } catch (error) {
    console.error('Clarifai URL detection error:', error);
    return [];
  }
}

/**
 * Get best food match from detected items
 */
export function getBestFoodMatch(detectedFoods: DetectedFood[]): string | null {
  if (detectedFoods.length === 0) return null;
  
  // Return the food with highest confidence
  const sorted = [...detectedFoods].sort((a, b) => b.confidence - a.confidence);
  return sorted[0].name;
}

/**
 * Detect and get top food name
 */
export async function detectAndGetTopFood(imageBase64: string): Promise<string | null> {
  const detected = await detectFoodInImage(imageBase64);
  return getBestFoodMatch(detected);
}
