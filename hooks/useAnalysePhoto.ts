/**
 * Hook pour analyser une photo de plat
 * Utilise Clarifai pour detection IA + OpenFoodFacts pour donnees nutritionnelles
 */

import { useState } from 'react';
import { detecterAlimentDansImage, obtenirMeilleurMatchAliment } from '@/lib/vision';
import { chercherAlimentParNom, chercherAvecFallback } from '@/lib/openfoodfacts';
import type { ProduitAlimentaire } from '@/lib/openfoodfacts';

export interface ResultatAnalyse {
  alimentsDetectes: string[];
  confidences: number[];
  produitsPrincipal: ProduitAlimentaire | null;
  produitsSimilaires: ProduitAlimentaire[];
  erreur?: string;
}

export function useAnalysePhoto() {
  const [chargement, setChargement] = useState(false);
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);

  const analyserPhoto = async (imageBase64: string): Promise<ResultatAnalyse> => {
    setChargement(true);
    try {
      console.log('🔍 Debut analyse photo...');

      // 1️⃣ DETECTION CLARIFAI
      console.log('📸 Appel Clarifai pour detection IA...');
      const alimentsDetectes = await detecterAlimentDansImage(imageBase64);
      
      if (alimentsDetectes.length === 0) {
        throw new Error('Aucun aliment detecte dans la photo. Essayez une autre image.');
      }

      console.log('✅ Aliments detectes:', alimentsDetectes);

      // 2️⃣ RECHERCHE DANS OPENFOODFACTS
      const meilleurAliment = obtenirMeilleurMatchAliment(alimentsDetectes);
      console.log('🎯 Meilleur match:', meilleurAliment);

      let produitPrincipal: ProduitAlimentaire | null = null;
      let produitsSimilaires: ProduitAlimentaire[] = [];

      if (meilleurAliment) {
        console.log(`🔎 Recherche OpenFoodFacts pour: "${meilleurAliment}"...`);
        const resultatsRecherche = await chercherAvecFallback(meilleurAliment);
        
        if (resultatsRecherche.length > 0) {
          produitPrincipal = resultatsRecherche[0];
          produitsSimilaires = resultatsRecherche.slice(1, 5);
          console.log('✅ Produit trouve:', produitPrincipal);
        }
      }

      const resultatFinal: ResultatAnalyse = {
        alimentsDetectes: alimentsDetectes.map((a) => a.nom),
        confidences: alimentsDetectes.map((a) => a.confiance),
        produitsPrincipal,
        produitsSimilaires,
      };

      setResultat(resultatFinal);
      console.log('✨ Analyse complete:', resultatFinal);
      return resultatFinal;
    } catch (error) {
      const messageErreur = error instanceof Error ? error.message : 'Erreur analyse';
      console.error('❌ Erreur:', messageErreur);
      const resultatErreur: ResultatAnalyse = {
        alimentsDetectes: [],
        confidences: [],
        produitsPrincipal: null,
        produitsSimilaires: [],
        erreur: messageErreur,
      };
      setResultat(resultatErreur);
      return resultatErreur;
    } finally {
      setChargement(false);
    }
  };

  return { analyserPhoto, chargement, resultat, setResultat };
}
