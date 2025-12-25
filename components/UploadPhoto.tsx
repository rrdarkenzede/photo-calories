'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import type { Scan } from '@/types';

interface DetectedFood {
  name: string;
  quantity: number;
  unit: 'g' | 'ml';
  confidence: number;
}

interface NutritionInfo {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
}

const NUTRITION_DATABASE: Record<string, NutritionInfo> = {
  'Pizza': { kcal: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sugar: 3.6, salt: 1.3 },
  'Fromage': { kcal: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, salt: 1.6 },
  'Tomate': { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, salt: 0.01 },
  'Basilic': { kcal: 23, protein: 3.1, carbs: 2.6, fat: 0.6, fiber: 1.6, sugar: 0, salt: 0.1 },
  'Huile olivier': { kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, salt: 0 },
  'Pate pizza': { kcal: 280, protein: 9, carbs: 56, fat: 1.3, fiber: 2, sugar: 1, salt: 0.5 },
  'Poulet': { kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, salt: 0.1 },
  'Riz': { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, salt: 0.01 },
  'Brocoli': { kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, salt: 0.03 },
};

export default function UploadPhoto() {
  const { plan, canAddScan, addScan } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<(DetectedFood & { nutrition: NutritionInfo })[]>([]);
  const [countsTowardGoal, setCountsTowardGoal] = useState(true);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canAddScan()) {
      alert('Limite de scans atteinte!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    await analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: imageBase64 }),
          });

          if (!response.ok) throw new Error('Erreur API');
          const data = await response.json();

          if (data.results && Array.isArray(data.results)) {
            const foods = data.results.map((food: DetectedFood) => ({
              ...food,
              nutrition: NUTRITION_DATABASE[food.name] || NUTRITION_DATABASE['Pizza'],
            }));
            setDetectedFoods(foods);
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de l\'analyse');
          setDetectedFoods([]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTotals = () => {
    return detectedFoods.reduce(
      (acc, food) => ({
        kcal: acc.kcal + food.nutrition.kcal * (food.quantity / 100),
        protein: acc.protein + food.nutrition.protein * (food.quantity / 100),
        carbs: acc.carbs + food.nutrition.carbs * (food.quantity / 100),
        fat: acc.fat + food.nutrition.fat * (food.quantity / 100),
        fiber: (acc.fiber || 0) + (food.nutrition.fiber || 0) * (food.quantity / 100),
        sugar: (acc.sugar || 0) + (food.nutrition.sugar || 0) * (food.quantity / 100),
        salt: (acc.salt || 0) + (food.nutrition.salt || 0) * (food.quantity / 100),
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, salt: 0 }
    );
  };

  const handleSave = () => {
    if (detectedFoods.length === 0) {
      alert('Aucun aliment detecte!');
      return;
    }

    const totals = calculateTotals();
    const scan: Scan = {
      id: `photo-${Date.now()}`,
      productName: detectedFoods.map((f) => f.name).join(', '),
      kcal: totals.kcal,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      fiber: totals.fiber,
      sugar: totals.sugar,
      salt: totals.salt,
      timestamp: new Date().toISOString(),
      countsTowardGoal,
      type: 'photo',
      imageUrl: preview || undefined,
    };

    addScan(scan);
    alert(`Photo sauvegardee! ${totals.kcal.toFixed(0)} kcal detectees`);
    reset();
  };

  const reset = () => {
    setPreview(null);
    setDetectedFoods([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-dashed border-blue-300">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing || !canAddScan()}
            className="inline-block text-6xl mb-4 hover:scale-110 transition-transform disabled:opacity-50"
          >
            📸
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Prendre une Photo</h2>
          <p className="text-gray-600 mb-6">Selectionne une image de ton repas pour l'analyser</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing || !canAddScan()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? '⏳ Analyse...' : '📂 Selectionner une photo'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
          </div>

          {detectedFoods.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-4">🍽️ Aliments Detectes</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {detectedFoods.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{food.name}</p>
                      <p className="text-sm text-gray-600">
                        {food.quantity}{food.unit} (confiance: {(food.confidence * 100).toFixed(0)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">{(food.nutrition.kcal * (food.quantity / 100)).toFixed(0)} kcal</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">📊 Valeurs Totales</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-orange-600">{totals.kcal.toFixed(0)}</p>
                  </div>
                  {plan !== 'free' && (
                    <>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-gray-600">Proteines</p>
                        <p className="text-2xl font-bold text-blue-600">{totals.protein.toFixed(1)}g</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border-2 border-yellow-200">
                        <p className="text-sm text-gray-600">Glucides</p>
                        <p className="text-2xl font-bold text-yellow-600">{totals.carbs.toFixed(1)}g</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                        <p className="text-sm text-gray-600">Lipides</p>
                        <p className="text-2xl font-bold text-green-600">{totals.fat.toFixed(1)}g</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={countsTowardGoal}
                  onChange={(e) => setCountsTowardGoal(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <label className="text-gray-700 font-semibold">
                  {countsTowardGoal ? '✅' : '⭕'} Compter vers mon objectif
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  ✅ Valider
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                >
                  🔄 Nouvelle Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-900">
          💡 <strong>Astuce:</strong> Prends une photo claire de ton repas avec bonne luminosite pour une meilleure detection!
        </p>
      </div>
    </div>
  );
}
