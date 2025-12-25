'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { analyzeFoodImage, DetectedFood } from '@/lib/clarifai';

export default function CameraScanner() {
  const { plan, addScan, canAddScan } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [countsTowardGoal, setCountsTowardGoal] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!canAddScan()) {
      alert('🚫 Limite de scans quotidiens atteinte! Upgrade ton plan pour scanner plus.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    setShowResults(false);

    try {
      const foods = await analyzeFoodImage(imageData);
      setDetectedFoods(foods);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur analyse:', error);
      alert('⚠️ Erreur lors de l\'analyse. Vérifie ta connexion et ta clé API Clarifai.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToHistory = () => {
    const totalKcal = detectedFoods.reduce((sum, f) => sum + f.kcal, 0);
    const totalProtein = detectedFoods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = detectedFoods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat = detectedFoods.reduce((sum, f) => sum + f.fat, 0);
    const totalFiber = detectedFoods.reduce((sum, f) => sum + (f.fiber || 0), 0);
    const totalSugar = detectedFoods.reduce((sum, f) => sum + (f.sugar || 0), 0);
    const totalSalt = detectedFoods.reduce((sum, f) => sum + (f.salt || 0), 0);

    addScan({
      id: `scan-${Date.now()}`,
      productName: `Repas scanné (${detectedFoods.length} aliments)`,
      kcal: totalKcal,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      sugar: totalSugar,
      salt: totalSalt,
      timestamp: new Date().toISOString(),
      countsTowardGoal,
      type: 'photo',
    });

    alert(`✅ Repas sauvegardé ${countsTowardGoal ? 'et compté vers ton objectif' : 'à titre indicatif'}!`);
    reset();
  };

  const reset = () => {
    setSelectedImage(null);
    setDetectedFoods([]);
    setShowResults(false);
    setAnalyzing(false);
    setCountsTowardGoal(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalKcal = detectedFoods.reduce((sum, f) => sum + f.kcal, 0);
  const totalProtein = detectedFoods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = detectedFoods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = detectedFoods.reduce((sum, f) => sum + f.fat, 0);
  const totalFiber = detectedFoods.reduce((sum, f) => sum + (f.fiber || 0), 0);
  const totalSugar = detectedFoods.reduce((sum, f) => sum + (f.sugar || 0), 0);
  const totalSalt = detectedFoods.reduce((sum, f) => sum + (f.salt || 0), 0);

  return (
    <div className="space-y-6">
      {!selectedImage && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🖼️</span>
            <div>
              <h3 className="text-2xl font-bold text-blue-900">Upload une photo</h3>
              <p className="text-sm text-blue-700">Sélectionne une image depuis ta galerie</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            📂 Choisir une image
          </button>

          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Astuce:</strong> Prends une photo claire de ton repas avec une bonne luminosité
              pour une meilleure détection.
            </p>
          </div>
        </div>
      )}

      {selectedImage && !analyzing && !showResults && (
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
          <img src={selectedImage} alt="Selected" className="w-full max-h-96 object-contain" />
          <button
            onClick={reset}
            className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600"
          >
            ❌
          </button>
        </div>
      )}

      {analyzing && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-300">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <h3 className="text-2xl font-bold text-purple-900 mb-2">Analyse en cours...</h3>
          <p className="text-purple-700">Clarifai analyse ton plat...</p>
          <div className="mt-4">
            <div className="inline-block animate-spin text-4xl">⚙️</div>
          </div>
        </div>
      )}

      {showResults && detectedFoods.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="text-2xl font-bold text-green-900">Repas analysé!</h3>
                <p className="text-sm text-green-700">
                  {detectedFoods.length} aliment{detectedFoods.length > 1 ? 's' : ''} détecté
                  {detectedFoods.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {plan === 'free' && (
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">{totalKcal.toFixed(0)}</div>
                <div className="text-lg text-gray-700">Calories</div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💎 <strong>Upgrade vers PRO</strong> pour voir P/G/L!
                  </p>
                </div>
              </div>
            )}

            {plan === 'pro' && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-red-600">{totalKcal.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Protéines</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Glucides</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Lipides</div>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg">
                  <p className="text-sm text-purple-800">
                    💎 <strong>Upgrade vers Fitness</strong> pour détails complets!
                  </p>
                </div>
              </>
            )}

            {plan === 'fitness' && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-red-600">{totalKcal.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Protéines</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Glucides</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Lipides</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-pink-600">{totalSugar.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Sucres</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-purple-600">{totalSalt.toFixed(2)}g</div>
                    <div className="text-xs text-gray-600">Sel</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-green-600">{totalFiber.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Fibres</div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 space-y-3">
              <h4 className="font-bold text-green-900 text-lg">📋 Détails:</h4>
              {detectedFoods.map((food, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <strong className="text-gray-800 text-lg">{food.name}</strong>
                      <span className="ml-3 text-sm text-gray-600">
                        {food.quantity}{food.unit}
                      </span>
                      <span className="ml-2 text-xs text-green-600 font-semibold">
                        {(food.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    {plan === 'fitness' && food.nutriScore && (
                      <span
                        className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        ${food.nutriScore === 'A' ? 'bg-green-500 text-white' : ''}
                        ${food.nutriScore === 'B' ? 'bg-lime-400 text-green-900' : ''}
                        ${food.nutriScore === 'C' ? 'bg-yellow-400 text-yellow-900' : ''}
                        ${food.nutriScore === 'D' ? 'bg-orange-400 text-orange-900' : ''}
                        ${food.nutriScore === 'E' ? 'bg-red-500 text-white' : ''}
                      `}
                      >
                        {food.nutriScore}
                      </span>
                    )}
                  </div>

                  {plan === 'free' && (
                    <div className="text-center py-2">
                      <span className="text-2xl font-bold text-red-600">{food.kcal.toFixed(0)} kcal</span>
                    </div>
                  )}

                  {(plan === 'pro' || plan === 'fitness') && (
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-bold text-red-600">{food.kcal.toFixed(0)}</div>
                        <div className="text-xs">kcal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{food.protein.toFixed(1)}g</div>
                        <div className="text-xs">P</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">{food.carbs.toFixed(1)}g</div>
                        <div className="text-xs">G</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{food.fat.toFixed(1)}g</div>
                        <div className="text-xs">L</div>
                      </div>
                    </div>
                  )}

                  {plan === 'fitness' && (
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-2">
                      <div className="text-center">Sucres: {(food.sugar || 0).toFixed(1)}g</div>
                      <div className="text-center">Sel: {(food.salt || 0).toFixed(2)}g</div>
                      <div className="text-center">Fibres: {(food.fiber || 0).toFixed(1)}g</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(plan === 'pro' || plan === 'fitness') && (
              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-300 cursor-pointer hover:border-teal-500 transition-all mt-4">
                <input
                  type="checkbox"
                  checked={countsTowardGoal}
                  onChange={(e) => setCountsTowardGoal(e.target.checked)}
                  className="w-5 h-5 rounded accent-teal-600"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">
                    {countsTowardGoal ? '✅ Compter vers mon objectif' : '📊 À titre indicatif uniquement'}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    {countsTowardGoal
                      ? 'Ce scan sera ajouté à ton total quotidien'
                      : 'Ce scan sera sauvegardé mais ne comptera pas vers ton objectif'}
                  </p>
                </div>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveToHistory}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              💾 Sauvegarder
            </button>
            <button
              onClick={reset}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
            >
              🔄 Nouveau scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
