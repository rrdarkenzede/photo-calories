'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getBarcodeProduct } from '@/lib/api-helpers';
import { IngredientsTable } from '@/components/IngredientsTable';
import { Meal, Ingredient } from '@/lib/types';
import { ArrowLeft, Loader2, Check, Search } from 'lucide-react';
import Link from 'next/link';

export default function BarcodePage() {
  const { currentPlan, addMeal, incrementScans } = useAppStore();
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanMethod, setScanMethod] = useState<'manual' | 'camera'>('manual');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setScanMethod('manual');
  };

  const handleSearchBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    try {
      const prod = await getBarcodeProduct(barcode);
      if (prod) {
        setProduct(prod);
        setMealName(prod.name);
      } else {
        alert('Produit non trouvé. Vérifie le code-barres.');
      }
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Code-barres</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!product ? (
          <div className="space-y-6">
            {/* Method selector */}
            <div className="flex gap-4">
              <button
                onClick={() => setScanMethod('manual')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  scanMethod === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                Saisie manuelle
              </button>
              <button
                onClick={() => {
                  setScanMethod('camera');
                  startCamera();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  scanMethod === 'camera'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                Caméra
              </button>
            </div>

            {/* Manual input */}
            {scanMethod === 'manual' && (
              <form onSubmit={handleSearchBarcode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Code-barres (UPC/EAN)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="ex: 3017620432247"
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white font-mono"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition"
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
              </form>
            )}

            {/* Camera */}
            {scanMethod === 'camera' && (
              <div className="space-y-4">
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                  🚧 La détection de code-barres nécessite une caméra haute résolution.
                  <br />
                  Utilise plutôt la saisie manuelle pour l'instant.
                </p>
                <button
                  onClick={stopCamera}
                  className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
                >
                  Revenir à la saisie manuelle
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex gap-6">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  {product.brand && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Marque: <span className="font-semibold">{product.brand}</span>
                    </p>
                  )}
                  {product.nutriScore && (
                    <div className="inline-block px-3 py-1 rounded-lg font-bold text-white mb-3"
                      style={{
                        backgroundColor: {
                          'A': '#2ecc71',
                          'B': '#a4d65e',
                          'C': '#ffc844',
                          'D': '#f7931e',
                          'E': '#e74c3c',
                        }[product.nutriScore] || '#bdc3c7'
                      }}
                    >
                      Nutri-Score {product.nutriScore}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity and Meal Type */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Quantité (portions)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value)))}
                  step="0.5"
                  min="0.5"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Nom du repas
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={product.name}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Type de repas
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="breakfast">🌅 Petit-déjeuner</option>
                  <option value="lunch">🍽️ Déjeuner</option>
                  <option value="dinner">🌙 Dîner</option>
                  <option value="snack">🍎 Collation</option>
                </select>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Calories</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(product.calories * quantity).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Protéines</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(product.protein * quantity).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Glucides</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(product.carbs * quantity).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lipides</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(product.fat * quantity).toFixed(1)}g
                  </p>
                </div>
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
                }}
                className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
              >
                ← Retour
              </button>
              <button
                onClick={saveMeal}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition"
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
