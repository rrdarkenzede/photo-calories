'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Info } from 'lucide-react';
import NutriscoreBadge from '@/components/NutriscoreBadge';
import IngredientTable from './IngredientTable';

interface ResultModalProps {
  result: any;
  plan: string;
  onClose: () => void;
  onSave: (mealData: any, countInGoal: boolean) => void;
}

export default function ResultModal({ result, plan, onClose, onSave }: ResultModalProps) {
  const [showIngredients, setShowIngredients] = useState(plan === 'fitness');
  const [ingredients, setIngredients] = useState(result.detectedFoods || []);
  const [saveAsRecipe, setSaveAsRecipe] = useState(false);

  // Calculate totals from ingredients
  const totals = ingredients.reduce(
    (acc: any, ing: any) => ({
      calories: acc.calories + (ing.calories || 0),
      protein: acc.protein + (ing.protein || 0),
      carbs: acc.carbs + (ing.carbs || 0),
      fat: acc.fat + (ing.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSave = (countInGoal: boolean) => {
    const mealData = plan === 'fitness' && showIngredients ? {
      ...result,
      ...totals,
      ingredients,
      isRecipe: saveAsRecipe,
    } : result;

    onSave(mealData, countInGoal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {result.name}
        </h2>

        {/* Image */}
        {result.image && (
          <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
            <img
              src={result.image}
              alt={result.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* FREE PLAN: Only calories */}
        {plan === 'free' && (
          <div className="text-center p-8 bg-blue-50 rounded-2xl mb-6">
            <p className="text-6xl font-black text-blue-600 mb-2">{result.calories}</p>
            <p className="text-xl text-gray-600 font-semibold">calories</p>
          </div>
        )}

        {/* PRO PLAN: Calories + Macros */}
        {plan === 'pro' && (
          <div className="space-y-4 mb-6">
            {/* Calories */}
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <p className="text-5xl font-black text-blue-600 mb-1">{result.calories}</p>
              <p className="text-lg text-gray-600 font-semibold">calories</p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-2xl">
                <p className="text-2xl font-bold text-purple-600">{result.protein?.toFixed(0) || 0}g</p>
                <p className="text-sm text-gray-600">Protéines</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-2xl">
                <p className="text-2xl font-bold text-pink-600">{result.carbs?.toFixed(0) || 0}g</p>
                <p className="text-sm text-gray-600">Glucides</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                <p className="text-2xl font-bold text-yellow-600">{result.fat?.toFixed(0) || 0}g</p>
                <p className="text-sm text-gray-600">Lipides</p>
              </div>
            </div>
          </div>
        )}

        {/* FITNESS PLAN: Everything + Ingredient Table */}
        {plan === 'fitness' && (
          <div className="space-y-6 mb-6">
            {!showIngredients ? (
              // Show button to edit ingredients
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  Veux-tu modifier les ingrédients détectés?
                </p>
                <button
                  onClick={() => setShowIngredients(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
                >
                  Oui, modifier le tableau
                </button>
              </div>
            ) : (
              // Ingredient table
              <div>
                <h3 className="text-xl font-bold mb-4">Ingrédients détectés</h3>
                <IngredientTable
                  ingredients={ingredients}
                  onChange={setIngredients}
                />

                {/* Totals */}
                <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="font-bold text-lg mb-4">Totaux</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{totals.calories.toFixed(0)}</p>
                      <p className="text-xs text-gray-600">kcal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{totals.protein.toFixed(0)}g</p>
                      <p className="text-xs text-gray-600">Protéines</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-600">{totals.carbs.toFixed(0)}g</p>
                      <p className="text-xs text-gray-600">Glucides</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{totals.fat.toFixed(0)}g</p>
                      <p className="text-xs text-gray-600">Lipides</p>
                    </div>
                  </div>
                </div>

                {/* Save as recipe checkbox */}
                <label className="flex items-center gap-3 mt-4 p-4 bg-green-50 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsRecipe}
                    onChange={(e) => setSaveAsRecipe(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold text-gray-900">
                    Sauvegarder comme recette réutilisable
                  </span>
                </label>
              </div>
            )}

            {/* Nutriscore */}
            {result.nutriscore && (
              <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <span className="font-semibold text-gray-700">Nutri-Score:</span>
                <NutriscoreBadge score={result.nutriscore} />
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          {/* FREE: Only one button */}
          {plan === 'free' && (
            <button
              onClick={() => handleSave(true)}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition text-lg"
            >
              Enregistrer
            </button>
          )}

          {/* PRO/FITNESS: Two buttons */}
          {plan !== 'free' && (
            <>
              <button
                onClick={() => handleSave(true)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Compter dans mon objectif
              </button>
              <button
                onClick={() => handleSave(false)}
                className="w-full py-4 bg-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-300 transition flex items-center justify-center gap-2"
              >
                <Info className="w-5 h-5" />
                Juste indicatif (ne pas compter)
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
