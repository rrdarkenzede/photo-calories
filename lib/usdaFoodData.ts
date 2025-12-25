import { API_KEYS, API_ENDPOINTS } from './apiConfig';

export async function searchUSDAFood(query: string) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.USDA_FDC}/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${API_KEYS.USDA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('USDA Food search error:', error);
    throw error;
  }
}

export async function getUSDAFoodDetails(fdcId: string) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.USDA_FDC}/food/${fdcId}?api_key=${API_KEYS.USDA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('USDA Food details error:', error);
    throw error;
  }
}
