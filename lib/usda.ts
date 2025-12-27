/**
 * USDA FoodData Central API
 * Base de donnees nutritionnelle officielle USA
 */

const USDA_API_KEY = 'D6D0KtUuGyownWVE3AtKLObhm2VL7PggbPhipqW4';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface AlimentUSDA {
  nom: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres?: number;
  sucres?: number;
  sodium?: number;
  taillePortions?: string;
  unitesPortions?: string;
}

/**
 * Rechercher USDA FoodData Central par nom d'aliment
 */
export async function chercherUSDAParNom(requete: string): Promise<AlimentUSDA[]> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(requete)}&pageSize=10&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) {
      console.error(`Erreur API USDA: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const aliments = data.foods || [];

    return aliments.slice(0, 5).map((aliment: any) => {
      const nutriments = aliment.foodNutrients || [];

      const obtenirNutriment = (id: number, unite: string = 'G') => {
        const nutriment = nutriments.find(
          (n: any) => n.nutrientId === id && n.unitName === unite
        );
        return nutriment ? Math.round(nutriment.value * 10) / 10 : 0;
      };

      return {
        nom: aliment.description || 'Inconnu',
        calories: obtenirNutriment(1008, 'KCAL'),
        proteines: obtenirNutriment(1003),
        glucides: obtenirNutriment(1005),
        lipides: obtenirNutriment(1004),
        fibres: obtenirNutriment(1079),
        sucres: obtenirNutriment(2000),
        sodium: obtenirNutriment(1093),
        taillePortions: aliment.servingSize || 100,
        unitesPortions: aliment.servingSizeUnit || 'g',
      };
    });
  } catch (error) {
    console.error('Erreur recherche USDA:', error);
    return [];
  }
}

/**
 * Obtenir aliment USDA par ID
 */
export async function obtenirAlimentUSDAParId(fdcId: string): Promise<AlimentUSDA | null> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
    );

    if (!response.ok) return null;

    const aliment = await response.json();
    const nutriments = aliment.foodNutrients || [];

    const obtenirNutriment = (id: number, unite: string = 'G') => {
      const nutriment = nutriments.find(
        (n: any) => n.nutrientId === id && n.unitName === unite
      );
      return nutriment ? Math.round(nutriment.value * 10) / 10 : 0;
    };

    return {
      nom: aliment.description || 'Inconnu',
      calories: obtenirNutriment(1008, 'KCAL'),
      proteines: obtenirNutriment(1003),
      glucides: obtenirNutriment(1005),
      lipides: obtenirNutriment(1004),
      fibres: obtenirNutriment(1079),
      sucres: obtenirNutriment(2000),
      sodium: obtenirNutriment(1093),
      taillePortions: aliment.servingSize || 100,
      unitesPortions: aliment.servingSizeUnit || 'g',
    };
  } catch (error) {
    console.error('Erreur obtention aliment USDA:', error);
    return null;
  }
}

/**
 * Obtenir le meilleur resultat USDA
 */
export function obtenirMeilleurAlimentUSDA(aliments: AlimentUSDA[]): AlimentUSDA | null {
  if (aliments.length === 0) return null;
  const avecDonnees = aliments.filter((a) => a.calories && a.proteines && a.glucides && a.lipides);
  return avecDonnees.length > 0 ? avecDonnees[0] : aliments[0];
}
