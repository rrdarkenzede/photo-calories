'use client';

import { useState, useRef } from 'react';
import { Camera, Search, Loader2, AlertCircle } from 'lucide-react';
import {
  analyzeFoodImage,
  searchFood,
  analyzeResponseToMeal,
  searchResultToMeal,
} from '@/lib/food-analysis-client';
import { useAppStore } from '@/lib/store';

export default function FoodAnalysisPage() {
  const { addMeal } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload & Analysis
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string;

        try {
          // Analyse l'image avec Clarifai + USDA + OFF
          const response = await analyzeFoodImage(base64Image);

          if (!response.success) {
            setError(response.error || 'Failed to analyze image');
            return;
          }

          setResult(response);

          // Ajouter automatiquement au store
          const meal = analyzeResponseToMeal(response);
          if (meal) {
            addMeal(meal);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setLoading(false);
    }
  };

  // Handle Food Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Recherche dans USDA + OpenFoodFacts
      const response = await searchFood(searchQuery);

      if (!response.success) {
        setError(response.error || 'No results found');
        return;
      }

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Add result to meals
  const handleAddMeal = (resultItem: any) => {
    let meal = null;

    if (result.analysis) {
      // From image analysis
      meal = analyzeResponseToMeal(result);
    } else if (result.results) {
      // From search
      const searchResult = resultItem || result.results[0];
      meal = searchResultToMeal(searchResult);
    }

    if (meal) {
      addMeal(meal);
      setResult(null);
      setSearchQuery('');
      alert(`✅ ${meal.name} added to today's meals!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900">🍽️ Food Analysis</h1>
          <p className="text-slate-600">
            Upload image • Search foods • Powered by Clarifai + USDA + OpenFoodFacts
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Image Upload Tab */}
          <div className="bg-white rounded-xl border-2 border-green-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold">Analyse Image</h2>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Analysing...
                </>
              ) : (
                '📸 Select Image'
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <p className="text-sm text-slate-600 text-center">
              Upload a food photo for AI recognition
            </p>
          </div>

          {/* Search Tab */}
          <div className="bg-white rounded-xl border-2 border-emerald-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">Search Foods</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. pizza, chicken, apple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Searching...
                  </>
                ) : (
                  '🔍 Search'
                )}
              </button>
            </form>

            <p className="text-sm text-slate-600 text-center">
              Search in USDA & OpenFoodFacts database
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl border-2 border-green-300 p-6 space-y-6">
            {/* Image Analysis Result */}
            {result.analysis && (
              <>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">🔍 Detected Foods</h3>
                  <div className="space-y-2">
                    {result.analysis.foods.map((food: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <span className="font-medium capitalize">{food.name}</span>
                        <span className="text-sm font-bold text-green-600">{food.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Search Results */}
            {result.results && (
              <>
                <h3 className="text-xl font-bold text-slate-900">📊 Nutrition Data</h3>
                <div className="space-y-3">
                  {result.results.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{item.name}</p>
                          <p className="text-sm text-slate-600">Source: {item.source}</p>
                        </div>
                        <button
                          onClick={() => handleAddMeal(item)}
                          className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <p className="text-slate-600 text-xs">Calories</p>
                          <p className="font-bold text-lg">{item.calories}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <p className="text-slate-600 text-xs">Protein</p>
                          <p className="font-bold text-lg">{item.protein.toFixed(1)}g</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <p className="text-slate-600 text-xs">Carbs</p>
                          <p className="font-bold text-lg">{item.carbs.toFixed(1)}g</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <p className="text-slate-600 text-xs">Fat</p>
                          <p className="font-bold text-lg">{item.fat.toFixed(1)}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Nutrition from Analysis */}
            {result.nutrition && (
              <>
                <h3 className="text-xl font-bold text-slate-900">💪 Macros (per 100g)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
                    <p className="text-sm text-slate-600">Calories</p>
                    <p className="text-3xl font-black text-orange-600">{result.nutrition.calories}</p>
                    <p className="text-xs text-slate-600">kcal</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-slate-600">Protein</p>
                    <p className="text-3xl font-black text-blue-600">{result.nutrition.protein.toFixed(1)}</p>
                    <p className="text-xs text-slate-600">g</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border-2 border-yellow-200">
                    <p className="text-sm text-slate-600">Carbs</p>
                    <p className="text-3xl font-black text-amber-600">{result.nutrition.carbs.toFixed(1)}</p>
                    <p className="text-xs text-slate-600">g</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-lg border-2 border-rose-200">
                    <p className="text-sm text-slate-600">Fat</p>
                    <p className="text-3xl font-black text-rose-600">{result.nutrition.fat.toFixed(1)}</p>
                    <p className="text-xs text-slate-600">g</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddMeal(null)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  ✅ Add to Today's Meals
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
