/**
 * Hook pour analyser un code-barre
 * Scanne le code-barre et recupere les donnees nutritionnelles
 */

import { useState } from 'react';
import { obtenirProduitParCodeBarres } from '@/lib/openfoodfacts';
import type { ProduitAlimentaire } from '@/lib/openfoodfacts';

export interface ResultatCodeBarre {
  produit: ProduitAlimentaire | null;
  codeBarre: string;
  erreur?: string;
}

export function useAnalyseCodeBarre() {
  const [chargement, setChargement] = useState(false);
  const [resultat, setResultat] = useState<ResultatCodeBarre | null>(null);

  const analyserCodeBarre = async (codeBarre: string): Promise<ResultatCodeBarre> => {
    setChargement(true);
    try {
      console.log(`📋 Recherche code-barre: ${codeBarre}...`);

      const produit = await obtenirProduitParCodeBarres(codeBarre);

      if (!produit) {
        throw new Error(`Produit non trouve pour code-barre: ${codeBarre}`);
      }

      console.log('✅ Produit trouve:', produit);

      const resultatFinal: ResultatCodeBarre = {
        produit,
        codeBarre,
      };

      setResultat(resultatFinal);
      return resultatFinal;
    } catch (error) {
      const messageErreur = error instanceof Error ? error.message : 'Erreur analyse code-barre';
      console.error('❌ Erreur:', messageErreur);
      const resultatErreur: ResultatCodeBarre = {
        produit: null,
        codeBarre,
        erreur: messageErreur,
      };
      setResultat(resultatErreur);
      return resultatErreur;
    } finally {
      setChargement(false);
    }
  };

  return { analyserCodeBarre, chargement, resultat, setResultat };
}
