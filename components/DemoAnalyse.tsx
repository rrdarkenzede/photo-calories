'use client';

import { useState } from 'react';
import { useAnalysePhoto } from '@/hooks/useAnalysePhoto';
import { useAnalyseCodeBarre } from '@/hooks/useAnalyseCodeBarre';

export function DemoAnalyse() {
  const [fichierSelectionne, setFichierSelectionne] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [codeBarre, setCodeBarre] = useState<string>('');
  const { analyserPhoto, chargement: chargementPhoto, resultat: resultatPhoto } = useAnalysePhoto();
  const { analyserCodeBarre, chargement: chargementCodeBarre, resultat: resultatCodeBarre } = useAnalyseCodeBarre();

  // Gerer upload fichier
  const gererChangementFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    setFichierSelectionne(fichier);

    // Preview
    const lecteur = new FileReader();
    lecteur.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    lecteur.readAsDataURL(fichier);
  };

  // Analyser photo
  const gererAnalysePhoto = async () => {
    if (!imagePreview) return;
    await analyserPhoto(imagePreview);
  };

  // Analyser code-barre
  const gererAnalyseCodeBarre = async () => {
    if (!codeBarre.trim()) return;
    await analyserCodeBarre(codeBarre);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Teste les APIs 🚀</h1>

      {/* SECTION PHOTO */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">📸 Analyser une Photo</h2>
        
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={gererChangementFichier}
            className="block w-full border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-pointer"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg mx-auto"
            />
          </div>
        )}

        <button
          onClick={gererAnalysePhoto}
          disabled={!imagePreview || chargementPhoto}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          {chargementPhoto ? '⏳ Analyse en cours...' : '🤖 Analyser Photo'}
        </button>

        {resultatPhoto && (
          <div className="mt-6 bg-white p-4 rounded-lg border-2 border-blue-200">
            {resultatPhoto.erreur ? (
              <div className="text-red-600">
                <p className="font-bold">❌ Erreur:</p>
                <p>{resultatPhoto.erreur}</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="font-bold">🔍 Aliments Detectes:</p>
                  <ul className="list-disc list-inside mt-2">
                    {resultatPhoto.alimentsDetectes.map((aliment, idx) => (
                      <li key={idx}>
                        {aliment} ({resultatPhoto.confidences[idx]}% de confiance)
                      </li>
                    ))}
                  </ul>
                </div>

                {resultatPhoto.produitsPrincipal && (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="font-bold text-green-700">✅ Produit Principal:</p>
                    <p className="text-lg mt-1">{resultatPhoto.produitsPrincipal.nom}</p>
                    <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">Calories</p>
                        <p className="font-bold">{resultatPhoto.produitsPrincipal.calories} kcal</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">Proteines</p>
                        <p className="font-bold">{resultatPhoto.produitsPrincipal.proteines}g</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">Glucides</p>
                        <p className="font-bold">{resultatPhoto.produitsPrincipal.glucides}g</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">Lipides</p>
                        <p className="font-bold">{resultatPhoto.produitsPrincipal.lipides}g</p>
                      </div>
                    </div>
                    {resultatPhoto.produitsPrincipal.nutriScore && (
                      <p className="mt-2 text-sm">
                        Nutri-Score: <span className="font-bold">{resultatPhoto.produitsPrincipal.nutriScore}</span>
                      </p>
                    )}
                  </div>
                )}

                {resultatPhoto.produitsSimilaires.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold">🔗 Produits Similaires:</p>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {resultatPhoto.produitsSimilaires.map((produit, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                          <p className="font-semibold">{produit.nom}</p>
                          <p className="text-gray-600">{produit.calories} kcal</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION CODE-BARRE */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📦 Analyser Code-Barre</h2>
        
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={codeBarre}
            onChange={(e) => setCodeBarre(e.target.value)}
            placeholder="Entrez le code-barre (ex: 5000159523015)"
            className="flex-1 border-2 border-purple-300 rounded-lg p-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          onClick={gererAnalyseCodeBarre}
          disabled={!codeBarre.trim() || chargementCodeBarre}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          {chargementCodeBarre ? '⏳ Recherche...' : '🔍 Chercher Produit'}
        </button>

        {resultatCodeBarre && (
          <div className="mt-6 bg-white p-4 rounded-lg border-2 border-purple-200">
            {resultatCodeBarre.erreur ? (
              <div className="text-red-600">
                <p className="font-bold">❌ Erreur:</p>
                <p>{resultatCodeBarre.erreur}</p>
              </div>
            ) : resultatCodeBarre.produit ? (
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="font-bold text-purple-700">✅ Produit Trouve:</p>
                <p className="text-lg mt-1">{resultatCodeBarre.produit.nom}</p>
                <p className="text-sm text-gray-600 mt-1">Code-barre: {resultatCodeBarre.codeBarre}</p>
                <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600">Calories</p>
                    <p className="font-bold">{resultatCodeBarre.produit.calories} kcal</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600">Proteines</p>
                    <p className="font-bold">{resultatCodeBarre.produit.proteines}g</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600">Glucides</p>
                    <p className="font-bold">{resultatCodeBarre.produit.glucides}g</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600">Lipides</p>
                    <p className="font-bold">{resultatCodeBarre.produit.lipides}g</p>
                  </div>
                </div>
                {resultatCodeBarre.produit.nutriScore && (
                  <p className="mt-2 text-sm">
                    Nutri-Score: <span className="font-bold">{resultatCodeBarre.produit.nutriScore}</span>
                  </p>
                )}
                {resultatCodeBarre.produit.marques && (
                  <p className="mt-2 text-sm">
                    Marque: <span className="font-semibold">{resultatCodeBarre.produit.marques}</span>
                  </p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
