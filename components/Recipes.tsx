'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function Recipes() {
  const { plan, recipes, removeRecipe } = useStore();
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  const toggleRecipe = (id: number) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  if (recipes.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-gray-300">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune recette</h3>
        <p className="text-gray-600">Crée ta première recette dans l'onglet "Créer une recette"!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-300">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📚</span>
          <div>
            <h2 className="text-2xl font-bold text-orange-900">Mes Recettes</h2>
            <p className="text-sm text-orange-700">{recipes.length} recette{recipes.length > 1 ? 's' : ''} sauvegardée{recipes.length > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all"
          >
            <div
              onClick={() => toggleRecipe(recipe.id)}
              className="p-6 cursor-pointer hover:bg-orange-50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">{recipe.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {recipe.prepTime && (
                      <span className="flex items-center gap-1">
                        ⏱️ {recipe.prepTime} min
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className="flex items-center gap-1">
                        📊 {recipe.difficulty}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      🍽️ {recipe.totalWeight}g
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Supprimer "${recipe.name}"?`)) {
                      removeRecipe(recipe.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  🗑️
                </button>
              </div>

              {plan === 'free' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{recipe.totalKcal.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Calories totales</div>
                </div>
              )}

              {plan === 'pro' && (
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{recipe.totalKcal.toFixed(0)}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{recipe.totalProtein.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Protéines</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{recipe.totalCarbs.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Glucides</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{recipe.totalFat.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Lipides</div>
                  </div>
                </div>
              )}

              {plan === 'FITNESS' && (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">{recipe.totalKcal.toFixed(0)}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{recipe.totalProtein.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">Protéines</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{recipe.totalCarbs.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">Glucides</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600">{recipe.totalFat.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">Lipides</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-pink-600">
                        {recipe.ingredients.reduce((sum, ing) => sum + (ing.sugar || 0), 0).toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Sucres</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-purple-600">
                        {recipe.ingredients.reduce((sum, ing) => sum + (ing.salt || 0), 0).toFixed(2)}g
                      </div>
                      <div className="text-xs text-gray-600">Sel</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-green-600">
                        {recipe.ingredients.reduce((sum, ing) => sum + (ing.fiber || 0), 0).toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Fibres</div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                  {expandedRecipe === recipe.id ? '▲ Masquer les détails' : '▼ Voir les détails'}
                </span>
              </div>
            </div>

            {expandedRecipe === recipe.id && (
              <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
                <h4 className="font-bold text-gray-900 text-lg mb-4">📋 Ingrédients:</h4>
                <div className="space-y-3 mb-6">
                  {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <strong className="text-gray-800">{ingredient.name}</strong>
                          <span className="ml-2 text-sm text-gray-600">
                            {ingredient.quantity}{ingredient.unit}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">({ingredient.category})</span>
                        </div>
                      </div>

                      {plan === 'free' && (
                        <div className="text-center">
                          <span className="text-xl font-bold text-red-600">{ingredient.kcal.toFixed(0)} kcal</span>
                        </div>
                      )}

                      {(plan === 'pro' || plan === 'FITNESS') && (
                        <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                          <div className="text-center">
                            <div className="font-bold text-red-600">{ingredient.kcal.toFixed(0)}</div>
                            <div className="text-xs">kcal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{ingredient.protein.toFixed(1)}g</div>
                            <div className="text-xs">P</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-yellow-600">{ingredient.carbs.toFixed(1)}g</div>
                            <div className="text-xs">G</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-orange-600">{ingredient.fat.toFixed(1)}g</div>
                            <div className="text-xs">L</div>
                          </div>
                        </div>
                      )}

                      {plan === 'FITNESS' && (
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-2">
                          <div className="text-center">Sucres: {(ingredient.sugar || 0).toFixed(1)}g</div>
                          <div className="text-center">Sel: {(ingredient.salt || 0).toFixed(2)}g</div>
                          <div className="text-center">Fibres: {(ingredient.fiber || 0).toFixed(1)}g</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {recipe.instructions && recipe.instructions.length > 0 && (
                  <>
                    <h4 className="font-bold text-gray-900 text-lg mb-4">👨‍🍳 Instructions:</h4>
                    <div className="space-y-3">
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <p className="flex-1 text-gray-700 pt-1">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
