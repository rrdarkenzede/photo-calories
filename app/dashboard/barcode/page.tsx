'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getBarcodeProduct } from '@/lib/api-helpers';
import { Meal, Ingredient } from '@/lib/types';
import { ArrowLeft, Loader2, Check, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BarcodePage() {
  const { addMeal, incrementScans } = useAppStore();
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [error, setError] = useState<string | null>(null);

  const handleSearchBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const prod = await getBarcodeProduct(barcode);
      if (prod) {
        setProduct(prod);
        setMealName(prod.name);
      } else {
        setError('Produit non trouvé. Vérifie le code-barres.');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = () => {
    if (!product) return;

    const ingredients: Ingredient[] = [
      {
        id: Date.now().toString(),
        name: product.name,
        quantity,
        unit: 'portion',
        calories: (product.calories || 0) * quantity,
        protein: (product.protein || 0) * quantity,
        carbs: (product.carbs || 0) * quantity,
        fat: (product.fat || 0) * quantity,
        fiber: (product.fiber || 0) * quantity,
        sugar: (product.sugar || 0) * quantity,
        sodium: (product.sodium || 0) * quantity,
      },
    ];

    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date(),
      name: mealName || product.name,
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

    alert('✅ Produit ajouté!');
    setProduct(null);
    setBarcode('');
    setMealName('');
    setQuantity(1);
  };

  const getNutriScoreColor = (score: string): string => {
    const colors: Record<string, string> = {
      'A': '#2ecc71',
      'B': '#a4d65e',
      'C': '#ffc844',
      'D': '#f7931e',
      'E': '#e74c3c',
    };
    return colors[score] || '#bdc3c7';
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Code-barres 💱</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Scanne un code-barres pour ajouter un produit</p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!product ? (
          <div className="card animate-fade-in">
            <form onSubmit={handleSearchBarcode} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Code-barres (UPC/EAN)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="ex: 3017620432247"
                    className="input flex-1 font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Chercher
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  🚧 <strong>Astuce:</strong> Cherche le code-barres sur l'emballage et saisis-le ci-dessus
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Product Info */}
            <div className="card-gradient">
              <div className="flex gap-6">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  {product.brand && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <span className="font-semibold">Marque:</span> {product.brand}
                    </p>
                  )}
                  {product.nutriScore && (
                    <div
                      className="inline-block px-3 py-1 rounded-full font-bold text-white text-sm"
                      style={{
                        backgroundColor: getNutriScoreColor(product.nutriScore),
                      }}
                    >
                      Nutri-Score {product.nutriScore}
                    </div>
                  )}
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
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={product.name}
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
                  { label: 'Calories', value: (product.calories * quantity).toFixed(0), unit: 'kcal' },
                  { label: 'Protéines', value: (product.protein * quantity).toFixed(1), unit: 'g' },
                  { label: 'Glucides', value: (product.carbs * quantity).toFixed(1), unit: 'g' },
                  { label: 'Lipides', value: (product.fat * quantity).toFixed(1), unit: 'g' },
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
                  setProduct(null);
                  setBarcode('');
                  setMealName('');
                  setQuantity(1);
                  setError(null);
                }}
                className="btn-secondary flex-1"
              >
                ← Nouveau scan
              </button>
              <button
                onClick={saveMeal}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Ajouter le produit
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
