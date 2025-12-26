'use client';

import { useAppStore } from '@/lib/store';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { meals, dailyGoals, currentPlan } = useAppStore();
  const planInfo = require('@/lib/plans').PLANS[currentPlan];

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('fr-FR');
  }).reverse();

  const dailyStats = last7Days.map((dateStr) => {
    const dayMeals = meals.filter((m) => new Date(m.date).toLocaleDateString('fr-FR') === dateStr);
    return {
      date: dateStr,
      calories: dayMeals.reduce((sum, m) => sum + m.totalCalories, 0),
      protein: dayMeals.reduce((sum, m) => sum + m.totalProtein, 0),
      carbs: dayMeals.reduce((sum, m) => sum + m.totalCarbs, 0),
      fat: dayMeals.reduce((sum, m) => sum + m.totalFat, 0),
      meals: dayMeals.length,
    };
  });

  const avgCalories = (dailyStats.reduce((sum, d) => sum + d.calories, 0) / dailyStats.length).toFixed(0);
  const avgProtein = (dailyStats.reduce((sum, d) => sum + d.protein, 0) / dailyStats.length).toFixed(1);
  const avgCarbs = (dailyStats.reduce((sum, d) => sum + d.carbs, 0) / dailyStats.length).toFixed(1);
  const avgFat = (dailyStats.reduce((sum, d) => sum + d.fat, 0) / dailyStats.length).toFixed(1);

  const maxCalories = Math.max(...dailyStats.map((d) => d.calories), dailyGoals.calories);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Average Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Moyennes 7j</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{avgCalories}</p>
            <p className="text-xs text-slate-500 mt-1">Calories/jour</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Protéines avg</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{avgProtein}g</p>
            <p className="text-xs text-slate-500 mt-1">Objectif: {dailyGoals.protein}g</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Glucides avg</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{avgCarbs}g</p>
            <p className="text-xs text-slate-500 mt-1">Objectif: {dailyGoals.carbs}g</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Lipides avg</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{avgFat}g</p>
            <p className="text-xs text-slate-500 mt-1">Objectif: {dailyGoals.fat}g</p>
          </div>
        </div>

        {/* 7-Day Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Derniers 7 jours</h2>
          <div className="space-y-4">
            {dailyStats.map((day) => (
              <div key={day.date}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{day.date}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{day.calories.toFixed(0)} kcal</span>
                </div>
                <div className="flex gap-2">
                  {/* Calories bar */}
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 h-full transition-all"
                      style={{
                        width: `${(day.calories / maxCalories) * 100}%`,
                      }}
                    />
                  </div>
                  {/* Goal line */}
                  <div className="flex items-center justify-center px-3 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full">
                    {day.meals} repas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macros Distribution */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Distribution Macros (Moyennes)</h2>
            <div className="space-y-4">
              {[
                { name: 'Protéines', value: avgProtein, max: dailyGoals.protein, color: '#ef4444' },
                { name: 'Glucides', value: avgCarbs, max: dailyGoals.carbs, color: '#3b82f6' },
                { name: 'Lipides', value: avgFat, max: dailyGoals.fat, color: '#f59e0b' },
              ].map((macro) => (
                <div key={macro.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{macro.name}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{macro.value}g / {macro.max}g</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 transition-all"
                      style={{
                        width: `${Math.min(100, (parseFloat(macro.value) / macro.max) * 100)}%`,
                        backgroundColor: macro.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Statistiques</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Total repas (7j)</span>
                <span className="font-bold text-slate-900 dark:text-white">{dailyStats.reduce((sum, d) => sum + d.meals, 0)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Moyenne repas/jour</span>
                <span className="font-bold text-slate-900 dark:text-white">{(dailyStats.reduce((sum, d) => sum + d.meals, 0) / 7).toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Max calories (1 jour)</span>
                <span className="font-bold text-slate-900 dark:text-white">{Math.max(...dailyStats.map((d) => d.calories)).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Min calories (1 jour)</span>
                <span className="font-bold text-slate-900 dark:text-white">{Math.min(...dailyStats.filter(d => d.calories > 0).map((d) => d.calories)).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Jours suiviés</span>
                <span className="font-bold text-slate-900 dark:text-white">{dailyStats.filter((d) => d.meals > 0).length}/7</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
