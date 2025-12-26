'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { deleteMeal } from '@/lib/storage';
import NutriscoreBadge from '@/components/NutriscoreBadge';

interface HistorySectionProps {
  meals: any[];
  plan: string;
}

export default function HistorySection({ meals, plan }: HistorySectionProps) {
  const [showHistory, setShowHistory] = useState(plan !== 'free');
  const [localMeals, setLocalMeals] = useState(meals);

  const handleDelete = (id: number) => {
    setLocalMeals(localMeals.filter((m) => m.id !== id));
    deleteMeal(id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
        {plan === 'free' && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 font-semibold rounded-full transition ${
              showHistory
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showHistory ? 'Désactiver' : 'Activer'}
          </button>
        )}
      </div>

      {!showHistory && plan === 'free' ? (
        <div className="text-center py-12 text-gray-400">
          <p>Historique désactivé (FREE plan)</p>
        </div>
      ) : localMeals.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Aucun repas enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localMeals.map((meal) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
            >
              {/* Image */}
              {meal.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{meal.name}</h3>
                  {meal.nutriscore && <NutriscoreBadge score={meal.nutriscore} />}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(meal.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>

              {/* Calories */}
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{meal.calories}</p>
                <p className="text-sm text-gray-500">kcal</p>
              </div>

              {/* Macros (PRO/FITNESS) */}
              {plan !== 'free' && meal.protein && (
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-lg font-semibold">
                    P: {meal.protein.toFixed(0)}g
                  </span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-lg font-semibold">
                    G: {meal.carbs?.toFixed(0) || 0}g
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-lg font-semibold">
                    L: {meal.fat?.toFixed(0) || 0}g
                  </span>
                </div>
              )}

              {/* Delete */}
              <button
                onClick={() => handleDelete(meal.id)}
                className="p-2 hover:bg-red-100 rounded-xl transition"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
