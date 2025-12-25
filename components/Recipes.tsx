'use client';

import { useStore } from '@/store/useStore';
import type { Recipe } from '@/store/useStore';

export default function Recipes() {
  const { recipes, removeRecipe, plan } = useStore();

  if (recipes.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border-2 border-amber-300">
        <p className="text-xl text-amber-900 font-semibold">📖 Aucune recette sauvegardée</p>
        <p className="text-amber-700 mt-2">Crée ta première recette depuis l'onglet "Créer Recette"</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">📖 Mes Recettes ({recipes.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/60 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-orange-400 mb-2">{recipe.name}</h3>
              <p className="text-sm text-gray-400">{recipe.ingredients.length} ingrédients</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-black/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Calories</p>
                <p className="text-lg font-bold text-orange-400">{recipe.totalKcal.toFixed(0)}</p>
              </div>
              <div className="bg-black/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Poids</p>
                <p className="text-lg font-bold text-blue-400">{recipe.totalWeight.toFixed(0)}g</p>
              </div>
            </div>

            {plan !== 'free' && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">P</p>
                  <p className="text-sm font-bold text-blue-400">{recipe.totalProtein.toFixed(1)}g</p>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">G</p>
                  <p className="text-sm font-bold text-yellow-400">{recipe.totalCarbs.toFixed(1)}g</p>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">L</p>
                  <p className="text-sm font-bold text-green-400">{recipe.totalFat.toFixed(1)}g</p>
                </div>
              </div>
            )}

            <button
              onClick={() => removeRecipe(recipe.id)}
              className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/40 transition-all"
            >
              🗑️ Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
