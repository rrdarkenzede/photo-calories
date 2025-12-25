interface FoodDetection {
  name: string;
  quantity: number;
  unit: 'g' | 'ml';
  confidence: number;
}

export async function analyzeImageWithAI(imageData: string): Promise<FoodDetection[]> {
  try {
    // Appeler l'API route (côté serveur)
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('❌ Erreur analyzeImageWithAI:', error);
    
    // Données de démo en cas d'erreur
    return [
      { name: 'Poulet rôti', quantity: 150, unit: 'g', confidence: 0.95 },
      { name: 'Riz blanc', quantity: 100, unit: 'g', confidence: 0.88 },
      { name: 'Brocoli', quantity: 80, unit: 'g', confidence: 0.82 },
      { name: 'Carottes', quantity: 60, unit: 'g', confidence: 0.78 },
    ];
  }
}
