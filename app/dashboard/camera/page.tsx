'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { analyzeFood } from '@/lib/api-helpers';
import { Meal, Ingredient } from '@/lib/types';
import { ArrowLeft, Camera, Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CameraPage() {
  const { addMeal, incrementScans } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeFood(preview);
      setAnalysis(result);
      setMealName(result.name || 'Mon repas');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = () => {
    if (!analysis) return;

    const ingredients: Ingredient[] = [
      {
        id: Date.now().toString(),
        name: analysis.name,
        quantity,
        unit: 'portion',
        calories: (analysis.calories || 0) * quantity,
        protein: (analysis.protein || 0) * quantity,
        carbs: (analysis.carbs || 0) * quantity,
        fat: (analysis.fat || 0) * quantity,
        fiber: (analysis.fiber || 0) * quantity,
        sugar: (analysis.sugar || 0) * quantity,
        sodium: (analysis.sodium || 0) * quantity,
      },
    ];

    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date(),
      name: mealName || analysis.name,
      ingredients,
      totalCalories: ingredients[0].calories,
      totalProtein: ingredients[0].protein,
      totalCarbs: ingredients[0].carbs,
      totalFat: ingredients[0].fat,
      totalFiber: ingredients[0].fiber,
      totalSugar: ingredients[0].sugar,
      totalSodium: ingredients[0].sodium,
      mealType,
    };

    addMeal(meal);
    incrementScans();

    alert('✅ Repas ajouté!');
    setPreview(null);
    setAnalysis(null);
    setMealName('');
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📷 Camera</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Photographie ton repas et l'IA l'analyse</p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <div className="card animate-fade-in space-y-6">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="group-hover:scale-110 transition">
                <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Clique pour télécharger une photo
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  ou fais glisser une image ici
                </p>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-96 object-cover"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setPreview(null)}
                    className="btn-secondary flex-1"
                  >
                    ← Autre photo
                  </button>
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Analyser
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Analysis Result */}
            <div className="card-gradient">
              <div className="flex gap-6">
                {preview && (
                  <img
                    src={preview}
                    alt={analysis.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {analysis.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {analysis.description || 'Plat analysé avec IA'}
                  </p>
                  <span className="badge badge-success">
                    {analysis.calories} kcal/portion
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity and Meal Type */}
            <div className="card space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Quantité (portions)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value)))}
                  step="0.5"
                  min="0.5"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Nom du repas
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={analysis.name}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Type de repas
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="input"
                >
                  <option value="breakfast">🌅 Petit-déjeuner</option>
                  <option value="lunch">🍽️ Déjeuner</option>
                  <option value="dinner">🌙 Dîner</option>
                  <option value="snack">🍎 Collation</option>
                </select>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="card-gradient">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Macronutriments</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: 'Calories', value: (analysis.calories * quantity).toFixed(0), unit: 'kcal' },
                  { label: 'Protéines', value: (analysis.protein * quantity).toFixed(1), unit: 'g' },
                  { label: 'Glucides', value: (analysis.carbs * quantity).toFixed(1), unit: 'g' },
                  { label: 'Lipides', value: (analysis.fat * quantity).toFixed(1), unit: 'g' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur text-center">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPreview(null);
                  setAnalysis(null);
                }}
                className="btn-secondary flex-1"
              >
                ← Nouvelle photo
              </button>
              <button
                onClick={saveMeal}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Ajouter le repas
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
