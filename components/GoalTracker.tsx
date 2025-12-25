'use client';

import { useStore } from '@/store/useStore';

export default function GoalTracker() {
  const { plan, goals, getTodayStats } = useStore();

  // Ne pas afficher pour FREE
  if (plan === 'free') return null;

  // ✅ Utiliser getTodayStats au lieu de getTodayProgress
  const progress = getTodayStats();
  const dailyGoals = goals;

  if (!dailyGoals) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">⚙️</div>
        <h3 className="text-xl font-bold text-yellow-900 mb-2">
          Configure ton Coach Fitness
        </h3>
        <p className="text-yellow-700 mb-4">
          Définis tes objectifs pour suivre ta progression quotidienne!
        </p>
        <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700">
          Configurer mes objectifs
        </button>
      </div>
    );
  }

  // Calculer les pourcentages
  const calcProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percent: number) => {
    if (percent < 80) return 'bg-green-500';
    if (percent < 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const calorieProgress = calcProgress(progress.totalKcal, dailyGoals.caloriesPerDay);
  const proteinProgress = calcProgress(progress.totalProtein, dailyGoals.proteinPerDay);
  const carbsProgress = calcProgress(progress.totalCarbs, dailyGoals.carbsPerDay);
  const fatProgress = calcProgress(progress.totalFat, dailyGoals.fatsPerDay);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-2xl font-bold text-[#1f8b8f]">📊 Suivi du jour</h3>

      {/* CALORIES */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">🔥 Calories</span>
          <span className="text-sm font-bold">
            {progress.totalKcal.toFixed(0)} / {dailyGoals.caloriesPerDay} kcal
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getProgressColor(calorieProgress)}`}
            style={{ width: `${calorieProgress}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-600 mt-1">
          {calorieProgress.toFixed(0)}%
        </div>
      </div>

      {/* PROTÉINES */}
      {plan === 'pro' || plan === 'FITNESS' ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">💪 Protéines</span>
            <span className="text-sm font-bold">
              {progress.totalProtein.toFixed(1)} / {dailyGoals.proteinPerDay}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${getProgressColor(proteinProgress)}`}
              style={{ width: `${proteinProgress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">
            {proteinProgress.toFixed(0)}%
          </div>
        </div>
      ) : null}

      {/* GLUCIDES */}
      {plan === 'FITNESS' ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">🍞 Glucides</span>
            <span className="text-sm font-bold">
              {progress.totalCarbs.toFixed(1)} / {dailyGoals.carbsPerDay}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${getProgressColor(carbsProgress)}`}
              style={{ width: `${carbsProgress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">
            {carbsProgress.toFixed(0)}%
          </div>
        </div>
      ) : null}

      {/* LIPIDES */}
      {plan === 'FITNESS' ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">🥑 Lipides</span>
            <span className="text-sm font-bold">
              {progress.totalFat.toFixed(1)} / {dailyGoals.fatsPerDay}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${getProgressColor(fatProgress)}`}
              style={{ width: `${fatProgress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">
            {fatProgress.toFixed(0)}%
          </div>
        </div>
      ) : null}

      {/* MESSAGE DE MOTIVATION */}
      <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border-2 border-teal-200">
        {calorieProgress < 50 ? (
          <p className="text-sm text-teal-800">
            💪 Continue! Tu as encore {(dailyGoals.caloriesPerDay - progress.totalKcal).toFixed(0)} kcal à consommer.
          </p>
        ) : calorieProgress < 80 ? (
          <p className="text-sm text-teal-800">
            🔥 Super! Tu es sur la bonne voie, reste constant!
          </p>
        ) : calorieProgress < 100 ? (
          <p className="text-sm text-orange-800">
            ⚠️ Attention, tu approches de ton objectif!
          </p>
        ) : (
          <p className="text-sm text-red-800">
            🚨 Objectif dépassé! Évite de manger davantage aujourd'hui.
          </p>
        )}
      </div>
    </div>
  );
}
