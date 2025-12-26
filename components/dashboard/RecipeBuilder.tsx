'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { addRecipe } from '@/lib/storage';
import IngredientTable from './IngredientTable';

interface RecipeBuilderProps {
  recipes: any[];
  onClose: () => void;
  onUseRecipe: (recipe: any) => void;
}

export default function RecipeBuilder({ recipes, onClose, onUseRecipe }: RecipeBuilderProps) {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<any[]>([]);

  const handleCreateRecipe = () => {
    if (!recipeName.trim() || ingredients.length === 0) return;

    const totals = ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + (ing.calories || 0),
        protein: acc.protein + (ing.protein || 0),
        carbs: acc.carbs + (ing.carbs || 0),
        fat: acc.fat + (ing.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const recipe = {
      id: Date.now(),
      name: recipeName,
      ingredients,
      ...totals,
      createdAt: new Date().toISOString(),
    };

    addRecipe(recipe);
    setMode('list');
    setRecipeName('');
    setIngredients([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {mode === 'list' ? 'Mes recettes' : 'Créer une recette'}
        </h2>

        {mode === 'list' ? (
          <div className="space-y-4">
            {recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>Aucune recette sauvegardée</p>
              </div>
            ) : (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{recipe.name}</h3>
                    <p className="text-sm text-gray-500">
                      {recipe.calories} kcal • P: {recipe.protein.toFixed(0)}g • G:
                      {recipe.carbs.toFixed(0)}g • L: {recipe.fat.toFixed(0)}g
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onUseRecipe({
                        name: recipe.name,
                        calories: recipe.calories,
                        protein: recipe.protein,
                        carbs: recipe.carbs,
                        fat: recipe.fat,
                        ingredients: recipe.ingredients,
                        isRecipe: true,
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
                  >
                    Utiliser
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => setMode('create')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer une nouvelle recette
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nom de la recette</label>
              <input
                type="text"
                placeholder="Ex: Pizza maison"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Ingédients</label>
              <IngredientTable ingredients={ingredients} onChange={setIngredients} />
            </div>

            {/* Totals */}
            {ingredients.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-bold mb-3">Totaux</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {ingredients.reduce((acc, i) => acc + i.calories, 0)}
                    </p>
                    <p className="text-xs text-gray-600">kcal</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {ingredients.reduce((acc, i) => acc + i.protein, 0).toFixed(0)}g
                    </p>
                    <p className="text-xs text-gray-600">Prot</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">
                      {ingredients.reduce((acc, i) => acc + i.carbs, 0).toFixed(0)}g
                    </p>
                    <p className="text-xs text-gray-600">Glucides</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {ingredients.reduce((acc, i) => acc + i.fat, 0).toFixed(0)}g
                    </p>
                    <p className="text-xs text-gray-600">Lipides</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCreateRecipe}
                disabled={!recipeName.trim() || ingredients.length === 0}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Créer la recette
              </button>
              <button
                onClick={() => setMode('list')}
                className="flex-1 py-3 bg-gray-200 text-gray-900 font-bold rounded-full"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
