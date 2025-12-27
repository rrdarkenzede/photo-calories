/**
 * OpenFoodFacts API Integration avec fallback USDA
 * API gratuite pour obtenir les donnees nutritionnelles
 */

import { chercherUSDAParNom, obtenirMeilleurAlimentUSDA } from './usda';

export interface ProduitAlimentaire {
  nom: string;
  codeBarres?: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres?: number;
  sucres?: number;
  sodium?: number;
  image?: string;
  nutriScore?: string;
  ingredients?: string[];
  marques?: string;
}

const URL_BASE = 'https://world.openfoodfacts.org';

/**
 * Chercher produits par nom
 */
export async function chercherAlimentParNom(requete: string): Promise<ProduitAlimentaire[]> {
  try {
    const response = await fetch(
      `${URL_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(requete)}&json=1&page_size=20&fields=product_name,nutriments,image_front_url,nutriscore_grade,ingredients_text,brands,code`
    );

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      console.log('Aucun resultat OpenFoodFacts, essai USDA...');
      const resultatsUSDA = await chercherUSDAParNom(requete);
      return resultatsUSDA.map((aliment) => ({
        nom: aliment.nom,
        calories: aliment.calories,
        proteines: aliment.proteines,
        glucides: aliment.glucides,
        lipides: aliment.lipides,
        fibres: aliment.fibres,
        sucres: aliment.sucres,
        sodium: aliment.sodium,
        nutriScore: 'N/A',
      }));
    }

    return data.products
      .filter((p: any) => p.product_name && p.nutriments)
      .map((p: any) => ({
        nom: p.product_name,
        codeBarres: p.code,
        calories: p.nutriments['energy-kcal'] || p.nutriments['energy-kcal_100g'] || 0,
        proteines: p.nutriments.proteins || p.nutriments.proteins_100g || 0,
        glucides: p.nutriments.carbohydrates || p.nutriments.carbohydrates_100g || 0,
        lipides: p.nutriments.fat || p.nutriments.fat_100g || 0,
        fibres: p.nutriments.fiber || p.nutriments.fiber_100g || 0,
        sucres: p.nutriments.sugars || p.nutriments.sugars_100g || 0,
        sodium: p.nutriments.sodium || p.nutriments.sodium_100g || 0,
        image: p.image_front_url || '',
        nutriScore: p.nutriscore_grade?.toUpperCase() || 'N/A',
        ingredients: p.ingredients_text ? [p.ingredients_text] : [],
        marques: p.brands || '',
      }));
  } catch (error) {
    console.error('Erreur API OpenFoodFacts:', error);
    try {
      const resultatsUSDA = await chercherUSDAParNom(requete);
      return resultatsUSDA.map((aliment) => ({
        nom: aliment.nom,
        calories: aliment.calories,
        proteines: aliment.proteines,
        glucides: aliment.glucides,
        lipides: aliment.lipides,
        fibres: aliment.fibres,
        sucres: aliment.sucres,
        sodium: aliment.sodium,
        nutriScore: 'N/A',
      }));
    } catch (erreurUSDA) {
      console.error('Fallback USDA egalement echoue:', erreurUSDA);
      return [];
    }
  }
}

/**
 * Obtenir produit par code-barres
 */
export async function obtenirProduitParCodeBarres(codeBarres: string): Promise<ProduitAlimentaire | null> {
  try {
    const response = await fetch(`${URL_BASE}/api/v0/product/${codeBarres}.json`);
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const p = data.product;
    return {
      nom: p.product_name || 'Produit inconnu',
      codeBarres: codeBarres,
      calories: p.nutriments['energy-kcal'] || p.nutriments['energy-kcal_100g'] || 0,
      proteines: p.nutriments.proteins || p.nutriments.proteins_100g || 0,
      glucides: p.nutriments.carbohydrates || p.nutriments.carbohydrates_100g || 0,
      lipides: p.nutriments.fat || p.nutriments.fat_100g || 0,
      fibres: p.nutriments.fiber || p.nutriments.fiber_100g || 0,
      sucres: p.nutriments.sugars || p.nutriments.sugars_100g || 0,
      sodium: p.nutriments.sodium || p.nutriments.sodium_100g || 0,
      image: p.image_front_url || '',
      nutriScore: p.nutriscore_grade?.toUpperCase() || 'N/A',
      ingredients: p.ingredients_text ? [p.ingredients_text] : [],
      marques: p.brands || '',
    };
  } catch (error) {
    console.error('Erreur recherche code-barres OpenFoodFacts:', error);
    return null;
  }
}

/**
 * Chercher aliments par nom avec fallback
 */
export async function chercherAvecFallback(requete: string): Promise<ProduitAlimentaire[]> {
  let resultats = await chercherAlimentParNom(requete);

  if (resultats.length === 0) {
    const simplifie = requete.split(' ')[0];
    resultats = await chercherAlimentParNom(simplifie);
  }

  return resultats;
}

/**
 * Estimer nutrition pour aliments generiques (fallback)
 */
export function obtenirEstimationAlimentGenerique(nomAliment: string): ProduitAlimentaire {
  const nomBas = nomAliment.toLowerCase();

  const baseDonneesGenerique: Record<string, Partial<ProduitAlimentaire>> = {
    pain: { calories: 265, proteines: 9, glucides: 49, lipides: 3.3 },
    'pain blanc': { calories: 265, proteines: 9, glucides: 49, lipides: 3.3 },
    'pain complet': { calories: 247, proteines: 13, glucides: 41, lipides: 3.4 },
    bread: { calories: 265, proteines: 9, glucides: 49, lipides: 3.3 },
    poulet: { calories: 165, proteines: 31, glucides: 0, lipides: 3.6 },
    chicken: { calories: 165, proteines: 31, glucides: 0, lipides: 3.6 },
    boeuf: { calories: 250, proteines: 26, glucides: 0, lipides: 17 },
    beef: { calories: 250, proteines: 26, glucides: 0, lipides: 17 },
    poisson: { calories: 206, proteines: 22, glucides: 0, lipides: 12 },
    fish: { calories: 206, proteines: 22, glucides: 0, lipides: 12 },
    oeuf: { calories: 155, proteines: 13, glucides: 1, lipides: 11 },
    egg: { calories: 155, proteines: 13, glucides: 1, lipides: 11 },
    fromage: { calories: 403, proteines: 25, glucides: 3, lipides: 33 },
    cheese: { calories: 403, proteines: 25, glucides: 3, lipides: 33 },
    lait: { calories: 49, proteines: 3.3, glucides: 4.8, lipides: 1.6 },
    milk: { calories: 49, proteines: 3.3, glucides: 4.8, lipides: 1.6 },
    yaourt: { calories: 59, proteines: 3.5, glucides: 4.7, lipides: 0.4 },
    yogurt: { calories: 59, proteines: 3.5, glucides: 4.7, lipides: 0.4 },
    tomate: { calories: 18, proteines: 1, glucides: 4, lipides: 0 },
    tomato: { calories: 18, proteines: 1, glucides: 4, lipides: 0 },
    salade: { calories: 15, proteines: 1.4, glucides: 2.9, lipides: 0 },
    salad: { calories: 15, proteines: 1.4, glucides: 2.9, lipides: 0 },
    carotte: { calories: 41, proteines: 1, glucides: 10, lipides: 0 },
    carrot: { calories: 41, proteines: 1, glucides: 10, lipides: 0 },
    riz: { calories: 130, proteines: 2.7, glucides: 28, lipides: 0.3 },
    rice: { calories: 130, proteines: 2.7, glucides: 28, lipides: 0.3 },
    'pates': { calories: 131, proteines: 5, glucides: 25, lipides: 1.1 },
    pasta: { calories: 131, proteines: 5, glucides: 25, lipides: 1.1 },
    'pomme de terre': { calories: 77, proteines: 2, glucides: 17, lipides: 0.1 },
    potato: { calories: 77, proteines: 2, glucides: 17, lipides: 0.1 },
    pomme: { calories: 52, proteines: 0.3, glucides: 14, lipides: 0 },
    apple: { calories: 52, proteines: 0.3, glucides: 14, lipides: 0 },
    banane: { calories: 89, proteines: 1.1, glucides: 23, lipides: 0.3 },
    banana: { calories: 89, proteines: 1.1, glucides: 23, lipides: 0.3 },
    orange: { calories: 47, proteines: 0.9, glucides: 12, lipides: 0 },
    burger: { calories: 215, proteines: 15, glucides: 16, lipides: 11 },
    pizza: { calories: 285, proteines: 12, glucides: 36, lipides: 10 },
    'frites': { calories: 365, proteines: 3.4, glucides: 48, lipides: 17 },
    fries: { calories: 365, proteines: 3.4, glucides: 48, lipides: 17 },
    sandwich: { calories: 250, proteines: 12, glucides: 30, lipides: 9 },
  };

  const correspondance = baseDonneesGenerique[nomBas];
  if (correspondance) {
    return {
      nom: nomAliment,
      calories: correspondance.calories || 100,
      proteines: correspondance.proteines || 5,
      glucides: correspondance.glucides || 10,
      lipides: correspondance.lipides || 3,
      nutriScore: 'C',
    };
  }

  return {
    nom: nomAliment,
    calories: 100,
    proteines: 5,
    glucides: 15,
    lipides: 3,
    nutriScore: 'N/A',
  };
}
