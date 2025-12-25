'use client';

import { useStore } from '@/store/useStore';

export default function GoalTracker() {
  const { goals, getTodayStats } = useStore();
  const todayStats = getTodayStats();

  if (!goals) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-yellow-700">
          ⚠️ Définissez vos objectifs dans le Coach pour tracker votre progression
        </p>
      </div>
    );
  }

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const caloriesProgress = getProgress(todayStats.totalKcal, goals.caloriesPerDay);
  const proteinProgress = getProgress(todayStats.totalProtein, goals.proteinPerDay);
  const carbsProgress = getProgress(todayStats.totalCarbs, goals.carbsPerDay);
  const fatsProgress = getProgress(todayStats.totalFat, goals.fatsPerDay);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Progression d'Aujourd'hui</h3>

      {/* Calories */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-orange-400 font-semibold">🔥 Calories</span>
          <span className="text-white text-sm">
            {todayStats.totalKcal.toFixed(0)} / {goals.caloriesPerDay}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{caloriesProgress.toFixed(0)}%</span>
      </div>

      {/* Protéines */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-400 font-semibold">💪 Protéines</span>
          <span className="text-white text-sm">
            {todayStats.totalProtein.toFixed(1)} / {goals.proteinPerDay}g
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${Math.min(proteinProgress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{proteinProgress.toFixed(0)}%</span>
      </div>

      {/* Glucides */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-yellow-400 font-semibold">🝞 Glucides</span>
          <span className="text-white text-sm">
            {todayStats.totalCarbs.toFixed(1)} / {goals.carbsPerDay}g
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(carbsProgress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{carbsProgress.toFixed(0)}%</span>
      </div>

      {/* Lipides */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-400 font-semibold">🥑 Lipides</span>
          <span className="text-white text-sm">
            {todayStats.totalFat.toFixed(1)} / {goals.fatsPerDay}g
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.min(fatsProgress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{fatsProgress.toFixed(0)}%</span>
      </div>
    </div>
  );
}
