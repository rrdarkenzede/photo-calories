'use client';

import { useAppStore } from '@/lib/store';
import { PLANS } from '@/lib/plans';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Helper function to calculate nutrition totals from ingredients
function calculateNutritionTotals(ingredients: any[]) {
  return {
    totalCalories: ingredients.reduce((sum, ing) => sum + (ing.calories || 0), 0),
    totalProtein: ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0),
    totalCarbs: ingredients.reduce((sum, ing) => sum + (ing.carbs || 0), 0),
    totalFat: ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0),
  };
}

export default function HistoryPage() {
  const { plan, meals } = useAppStore();
  const planInfo = PLANS[plan];

  // Group meals by date
  const mealsByDate = meals.reduce(
    (acc, meal) => {
      const date = new Date(meal.date).toLocaleDateString('fr-FR');
      if (!acc[date]) acc[date] = [];
      acc[date].push(meal);
      return acc;
    },
    {} as Record<string, typeof meals>
  );

  const sortedDates = Object.keys(mealsByDate).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Historique</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {meals.length} repas • {planInfo.historicDays} jours de conservation
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {meals.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">Aucun repas enregistré</p>
            <p className="text-sm text-slate-500 mt-1">Commence par scanner un plat!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((dateStr) => {
              const mealsForDate = mealsByDate[dateStr];
              const dailyTotals = mealsForDate.reduce(
                (acc, meal) => {
                  const mealNutrition = calculateNutritionTotals(meal.ingredients || []);
                  return {
                    totalCalories: acc.totalCalories + mealNutrition.totalCalories,
                    totalProtein: acc.totalProtein + mealNutrition.totalProtein,
                    totalCarbs: acc.totalCarbs + mealNutrition.totalCarbs,
                    totalFat: acc.totalFat + mealNutrition.totalFat,
                  };
                },
                { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
              );

              return (
                <div key={dateStr}>
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dateStr}</h2>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  </div>

                  {/* Meals for this date */}
                  <div className="space-y-4">
                    {mealsForDate.map((meal) => {
                      const mealNutrition = calculateNutritionTotals(meal.ingredients || []);
                      return (
                        <div
                          key={meal.id}
                          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {meal.name}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(meal.date).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                              {meal.mealType === 'breakfast' && '🌅'}
                              {meal.mealType === 'lunch' && '🍽️'}
                              {meal.mealType === 'dinner' && '🌙'}
                              {meal.mealType === 'snack' && '🍎'}
                            </span>
                          </div>

                          {/* Meal stats */}
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Calories</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {mealNutrition.totalCalories.toFixed(0)}
                              </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Prot</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {mealNutrition.totalProtein.toFixed(1)}g
                              </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Carbs</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {mealNutrition.totalCarbs.toFixed(1)}g
                              </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Lipides</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {mealNutrition.totalFat.toFixed(1)}g
                              </p>
                            </div>
                          </div>

                          {/* Ingredients preview */}
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            <p className="font-medium mb-1">Ingrédients:</p>
                            <p className="text-slate-500 dark:text-slate-500">
                              {meal.ingredients.map((ing) => ing.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Daily totals */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
                    <div className="flex justify-between items-center text-sm">
                      <span>TOTAL DU JOUR</span>
                      <div className="flex gap-6">
                        <span>{dailyTotals.totalCalories.toFixed(0)} kcal</span>
                        <span>{dailyTotals.totalProtein.toFixed(1)}g prot</span>
                        <span>{dailyTotals.totalCarbs.toFixed(1)}g carbs</span>
                        <span>{dailyTotals.totalFat.toFixed(1)}g lip</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
