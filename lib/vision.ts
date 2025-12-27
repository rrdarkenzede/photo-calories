/**
 * API Clarifai de Reconnaissance d'Aliments
 * Detection d'aliments dans les images
 */

const CLE_API_CLARIFAI = process.env.NEXT_PUBLIC_CLARIFAI_KEY || '95cc52863ab2402baca61c72e1170fa9';
const ID_MODELE_CLARIFAI = 'food-item-recognition';
const ID_VERSION_MODELE_CLARIFAI = 'dfebc169854e429086aceb8368662641';

export interface AlimentDetecte {
  nom: string;
  confiance: number;
}

/**
 * Detecter aliments dans une image avec Clarifai
 */
export async function detecterAlimentDansImage(imageBase64: string): Promise<AlimentDetecte[]> {
  try {
    const donneesBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLE_API_CLARIFAI}`,
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
                base64: donneesBase64,
              },
            },
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.outputs || data.outputs.length === 0) {
      console.error('Aucune sortie de Clarifai');
      return [];
    }

    const concepts = data.outputs[0]?.data?.concepts || [];
    
    return concepts
      .slice(0, 5)
      .map((concept: any) => ({
        nom: concept.name,
        confiance: Math.round(concept.value * 100),
      }));
  } catch (error) {
    console.error('Erreur API Clarifai:', error);
    return [];
  }
}

/**
 * Detecter aliment depuis fichier image
 */
export async function detecterAlimentDepuisFichier(fichier: File): Promise<AlimentDetecte[]> {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    
    lecteur.onload = async (e) => {
      const donneesImage = e.target?.result as string;
      const aliments = await detecterAlimentDansImage(donneesImage);
      resolve(aliments);
    };
    
    lecteur.onerror = () => reject(new Error('Echec lecture du fichier'));
    
    lecteur.readAsDataURL(fichier);
  });
}

/**
 * Detecter aliment depuis URL
 */
export async function detecterAlimentDepuisURL(urlImage: string): Promise<AlimentDetecte[]> {
  try {
    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLE_API_CLARIFAI}`,
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
                url: urlImage,
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
        nom: concept.name,
        confiance: Math.round(concept.value * 100),
      }));
  } catch (error) {
    console.error('Erreur detection URL Clarifai:', error);
    return [];
  }
}

/**
 * Obtenir le meilleur match d'aliment detecte
 */
export function obtenirMeilleurMatchAliment(alimentsDetectes: AlimentDetecte[]): string | null {
  if (alimentsDetectes.length === 0) return null;
  
  const tries = [...alimentsDetectes].sort((a, b) => b.confiance - a.confiance);
  return tries[0].nom;
}

/**
 * Detecter et obtenir l'aliment principal
 */
export async function detecterEtObtenirAlimentPrincipal(imageBase64: string): Promise<string | null> {
  const detectes = await detecterAlimentDansImage(imageBase64);
  return obtenirMeilleurMatchAliment(detectes);
}
