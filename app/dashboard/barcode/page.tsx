'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { scanBarcode } from '@/lib/api-helpers';
import { ArrowLeft, Barcode, Loader2, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BarcodePage() {
  const router = useRouter();
  const { addMeal, plan } = useAppStore();

  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const scanCode = async () => {
    if (!barcode.trim()) {
      setError('📝 Saisir un code-barres!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await scanBarcode(barcode);
      setAnalysis(result);
      setMealName(result.name || 'Mon repas');
      setBarcode('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du scan');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = () => {
    if (!analysis) return;

    const ingredients: any[] = [
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

    const meal: any = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      name: mealName || analysis.name,
      ingredients,
      nutrition: {
        calories: ingredients[0].calories,
        protein: ingredients[0].protein,
        carbs: ingredients[0].carbs,
        fat: ingredients[0].fat,
        fiber: ingredients[0].fiber,
        sugar: ingredients[0].sugar,
        sodium: ingredients[0].sodium,
      },
      mealType,
    };

    addMeal(meal);

    alert('✅ Repas ajouté!');
    setAnalysis(null);
    setMealName('');
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-green-200 sticky top-0 z-10 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-green-100 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-green-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">📦 Code-barres</h1>
              <p className="text-xs text-slate-600 font-bold">Scanne l'emballage</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-600 uppercase">Plan</p>
            <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {plan}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto flex flex-col">
        {!analysis ? (
          <div className="flex flex-col gap-6 flex-1">
            {/* Input Area */}
            <div className="card border-2 border-green-300">
              <label className="block text-sm font-black text-slate-900 mb-3 uppercase">📱 Code-barres</label>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && scanCode()}
                  placeholder="3123456789012"
                  className="input flex-1 font-bold text-center"
                  autoFocus
                />
                <button
                  onClick={scanCode}
                  disabled={loading}
                  className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 font-black px-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scan...
                    </>
                  ) : (
                    <>
                      <Barcode className="w-5 h-5" />
                      Scan
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-100 border-2 border-red-300 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-bold">{error}</p>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="card border-2 border-green-200 bg-green-50">
              <h3 className="text-sm font-black text-slate-900 mb-2 uppercase">💡 Comment ça marche?</h3>
              <ul className="text-sm text-slate-600 space-y-2 font-bold">
                <li>✓ Trouve le code-barres sur l'emballage</li>
                <li>✓ Saisis ou scanne le numéro</li>
                <li>✓ L'IA retourne les calories + macros</li>
                <li>✓ Personnalise la quantité et valide</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 flex-1">
            {/* Analysis Result */}
            <div className="card border-2 border-green-300 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-24 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Barcode className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{analysis.name}</h2>
                  <p className="text-sm text-slate-600 mb-3 font-bold">
                    {analysis.description || 'Produit scanné'}
                  </p>
                  <span className="badge badge-primary text-sm font-black">
                    {Math.round(analysis.calories)} kcal/portion
                  </span>
                </div>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="card border-2 border-green-200">
              <h3 className="text-lg font-black text-slate-900 mb-4">Macronutriments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Cal', value: (analysis.calories * quantity).toFixed(0), unit: 'kcal', emoji: '🔥' },
                  { label: 'Prot', value: (analysis.protein * quantity).toFixed(1), unit: 'g', emoji: '💪' },
                  { label: 'Carbs', value: (analysis.carbs * quantity).toFixed(1), unit: 'g', emoji: '🍜' },
                  { label: 'Fat', value: (analysis.fat * quantity).toFixed(1), unit: 'g', emoji: '🧈' },
                ].map((item) => (
                  <div key={item.label} className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 text-center">
                    <p className="text-2xl mb-1">{item.emoji}</p>
                    <p className="text-xs font-black text-slate-600 uppercase mb-1">{item.label}</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-bold">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Settings */}
            <div className="card border-2 border-green-200 space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">🥣 Quantité</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                    className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 font-black text-lg hover:bg-green-200 transition-all duration-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value)))}
                    step="0.5"
                    min="0.5"
                    className="input flex-1 text-center font-black text-xl"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 0.5)}
                    className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 font-black text-lg hover:bg-green-200 transition-all duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">📄 Nom du repas</label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={analysis.name}
                  className="input font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">🍰 Type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value as any)} className="input font-bold">
                  <option value="breakfast">🌅 Petit-déjeuner</option>
                  <option value="lunch">🍽️ Déjeuner</option>
                  <option value="dinner">🌙 Dîner</option>
                  <option value="snack">🍎 Collation</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setMealName('');
                  setQuantity(1);
                }}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 font-bold"
              >
                📱 Nouveau scan
              </button>
              <button
                onClick={saveMeal}
                className="btn-primary flex-1 flex items-center justify-center gap-2 font-black"
              >
                <Check className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
