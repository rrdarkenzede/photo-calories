'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function RecipeBuilder() {
  const { plan, addRecipe } = useStore();
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: '',
    quantity: 100,
    unit: 'g',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const addIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({
        name: '',
        quantity: 100,
        unit: 'g',
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const calculateTotals = () => {
    return ingredients.reduce(
      (acc, ing) => ({
        kcal: acc.kcal + ing.kcal,
        protein: acc.protein + ing.protein,
        carbs: acc.carbs + ing.carbs,
        fat: acc.fat + ing.fat,
        weight: acc.weight + ing.quantity,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, weight: 0 }
    );
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim() || ingredients.length === 0) {
      alert('❌ Remplis tous les champs!');
      return;
    }

    const totals = calculateTotals();
    addRecipe({
      id: Date.now(),
      name: recipeName,
      createdAt: new Date().toISOString(),
      ingredients: ingredients.map((ing, idx) => ({
        id: `ing-${idx}`,
        name: ing.name,
        category: 'custom',
        quantity: ing.quantity,
        unit: ing.unit,
        weight: ing.quantity,
        kcal100g: ing.kcal,
        kcal: ing.kcal,
        protein: ing.protein,
        carbs: ing.carbs,
        fat: ing.fat,
      })),
      totalKcal: totals.kcal,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      totalWeight: totals.weight,
    });

    alert(`✅ Recette "
${recipeName}" sauvegardée!`);
    setRecipeName('');
    setIngredients([]);
  };

  if (plan === 'free') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-300">
        <h2 className="text-3xl font-bold text-purple-900 mb-3">💤 Créateur de Recettes</h2>
        <p className="text-purple-700 mb-6">Crée tes propres recettes personnalisées!</p>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all">
          💎 Upgrade vers PRO
        </button>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <span className="text-4xl">👨‍🍳</span>
          Créer une Recette
        </h2>

        <div className="bg-white rounded-xl p-6 space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la recette</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="ex: Pizza Maïsonnelle"
              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-indigo-900 mb-4">📕 Ajouter des Ingrédients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                placeholder="Nom de l'ingrédient"
                className="px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: Number(e.target.value) })}
                placeholder="Quantité"
                className="px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <input
                type="number"
                value={newIngredient.kcal}
                onChange={(e) => setNewIngredient({ ...newIngredient, kcal: Number(e.target.value) })}
                placeholder="Calories"
                className="px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                value={newIngredient.protein}
                onChange={(e) => setNewIngredient({ ...newIngredient, protein: Number(e.target.value) })}
                placeholder="Protéines (g)"
                className="px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={addIngredient}
              className="w-full py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-all"
            >
              ➕ Ajouter l'ingrédient
            </button>
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="bg-white rounded-xl p-6 space-y-4 mb-6">
            <h3 className="font-bold text-indigo-900 mb-4">📋 Ingrédients ({ingredients.length})</h3>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{ing.name}</p>
                    <p className="text-sm text-gray-600">{ing.quantity}{ing.unit}</p>
                  </div>
                  <button
                    onClick={() => removeIngredient(idx)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✗
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-bold text-indigo-900 mb-2">Totaux:</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-orange-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-700">Calories</p>
                  <p className="font-bold text-orange-600">{totals.kcal.toFixed(0)}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-700">Protéines</p>
                  <p className="font-bold text-blue-600">{totals.protein.toFixed(1)}g</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-700">Glucides</p>
                  <p className="font-bold text-yellow-600">{totals.carbs.toFixed(1)}g</p>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-700">Lipides</p>
                  <p className="font-bold text-green-600">{totals.fat.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveRecipe}
          disabled={!recipeName || ingredients.length === 0}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 transition-all"
        >
          💾 Sauvegarder la Recette
        </button>
      </div>
    </div>
  );
}
