'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IngredientsTable } from '@/components/IngredientsTable';
import { Ingredient, Recipe } from '@/lib/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function RecipesPage() {
  const { recipes, addRecipe, removeRecipe, currentPlan } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState('');

  const handleCreateRecipe = () => {
    if (!recipeName.trim() || ingredients.length === 0) {
      alert('Remplis le nom et ajoute des ingrédients!');
      return;
    }

    const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const totalProtein = ingredients.reduce((sum, ing) => sum + ing.protein, 0);
    const totalCarbs = ingredients.reduce((sum, ing) => sum + ing.carbs, 0);
    const totalFat = ingredients.reduce((sum, ing) => sum + ing.fat, 0);

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: recipeName,
      ingredients,
      instructions,
      servings,
      createdAt: new Date(),
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    };

    addRecipe(recipe);
    setRecipeName('');
    setIngredients([]);
    setInstructions('');
    setServings(1);
    setShowForm(false);
    alert('✅ Recette créée!');
  };

  if (currentPlan !== 'fitness') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">🔒 Fitness Only</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Le Recipe Builder est réservé au plan Fitness</p>
          <Link href="/dashboard" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recettes</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            Créer une recette
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nouvelle recette</h2>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Nom de la recette
              </label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="ex: Poulet rôti aux légumes"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Nombre de portions
              </label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value)))}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Ingrédients
              </label>
              <IngredientsTable
                ingredients={ingredients}
                editable={true}
                showMicros={true}
                onIngredientsChange={setIngredients}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Instructions (optionnel)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Etapes de préparation..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateRecipe}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Créer la recette
              </button>
            </div>
          </div>
        )}

        {recipes.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">Aucune recette sauvegardée</p>
            <p className="text-sm text-slate-500 mt-1">Crée ta première recette!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{recipe.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{recipe.servings} portion(s)</p>
                  </div>
                  <button
                    onClick={() => removeRecipe(recipe.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Calories</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {(recipe.totalCalories / recipe.servings).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Prot</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {(recipe.totalProtein / recipe.servings).toFixed(1)}g
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Carbs</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {(recipe.totalCarbs / recipe.servings).toFixed(1)}g
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Lipides</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {(recipe.totalFat / recipe.servings).toFixed(1)}g
                    </p>
                  </div>
                </div>

                {recipe.instructions && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-medium mb-1">Instructions:</p>
                    <p className="text-slate-500 dark:text-slate-500 line-clamp-3">{recipe.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
