'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function Coach() {
  const { plan, goals, setGoals, getTodayStats } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    caloriesPerDay: goals?.caloriesPerDay || 2000,
    proteinPerDay: goals?.proteinPerDay || 150,
    carbsPerDay: goals?.carbsPerDay || 200,
    fatsPerDay: goals?.fatsPerDay || 65,
  });

  const todayStats = getTodayStats();

  const handleSave = () => {
    setGoals(formData);
    setIsEditing(false);
    alert('✅ Objectifs sauvegardés!');
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (plan === 'free') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-300">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-purple-900 mb-3">Coach Nutritionnel</h2>
          <p className="text-purple-700 mb-6">
            Définis tes objectifs caloriques et macros quotidiens avec un suivi en temps réel!
          </p>
          <div className="bg-white rounded-xl p-6 mb-6">
            <p className="text-gray-700 mb-4">
              📊 <strong>Fonctionnalités PRO/FITNESS:</strong>
            </p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>✅ Définir tes objectifs caloriques quotidiens</li>
              <li>✅ Objectifs protéines / glucides / lipides</li>
              <li>✅ Suivi en temps réel de ta progression</li>
              <li>✅ Barres de progression visuelles</li>
              <li>✅ Conseils nutritionnels personnalisés</li>
            </ul>
          </div>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all">
            💎 Upgrade vers PRO/FITNESS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            <div>
              <h2 className="text-2xl font-bold text-teal-900">Coach Nutritionnel</h2>
              <p className="text-sm text-teal-700">Définis et suis tes objectifs quotidiens</p>
            </div>
          </div>
          {!isEditing && goals && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all"
            >
              ✏️ Modifier
            </button>
          )}
        </div>

        {!goals && !isEditing && (
          <div className="text-center py-8">
            <p className="text-gray-700 mb-4">Tu n'as pas encore défini tes objectifs!</p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              🎯 Définir mes objectifs
            </button>
          </div>
        )}

        {isEditing && (
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔥 Calories par jour (kcal)
              </label>
              <input
                type="number"
                value={formData.caloriesPerDay}
                onChange={(e) => setFormData({ ...formData, caloriesPerDay: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💪 Protéines par jour (g)
              </label>
              <input
                type="number"
                value={formData.proteinPerDay}
                onChange={(e) => setFormData({ ...formData, proteinPerDay: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🍞 Glucides par jour (g)
              </label>
              <input
                type="number"
                value={formData.carbsPerDay}
                onChange={(e) => setFormData({ ...formData, carbsPerDay: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🥑 Lipides par jour (g)
              </label>
              <input
                type="number"
                value={formData.fatsPerDay}
                onChange={(e) => setFormData({ ...formData, fatsPerDay: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (goals) {
                    setFormData({
                      caloriesPerDay: goals.caloriesPerDay,
                      proteinPerDay: goals.proteinPerDay,
                      carbsPerDay: goals.carbsPerDay,
                      fatsPerDay: goals.fatsPerDay,
                    });
                  }
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {goals && !isEditing && (
        <div className="space-y-4">
          {/* CALORIES */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-gray-800">Calories</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {todayStats.totalKcal.toFixed(0)} / {goals.caloriesPerDay}
                </div>
                <div className="text-xs text-gray-600">
                  {getProgressPercentage(todayStats.totalKcal, goals.caloriesPerDay).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${getProgressColor(
                  getProgressPercentage(todayStats.totalKcal, goals.caloriesPerDay)
                )}`}
                style={{
                  width: `${getProgressPercentage(todayStats.totalKcal, goals.caloriesPerDay)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Reste: {Math.max(0, goals.caloriesPerDay - todayStats.totalKcal).toFixed(0)} kcal
            </p>
          </div>

          {/* PROTÉINES */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <span className="font-bold text-gray-800">Protéines</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {todayStats.totalProtein.toFixed(1)}g / {goals.proteinPerDay}g
                </div>
                <div className="text-xs text-gray-600">
                  {getProgressPercentage(todayStats.totalProtein, goals.proteinPerDay).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${getProgressColor(
                  getProgressPercentage(todayStats.totalProtein, goals.proteinPerDay)
                )}`}
                style={{
                  width: `${getProgressPercentage(todayStats.totalProtein, goals.proteinPerDay)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Reste: {Math.max(0, goals.proteinPerDay - todayStats.totalProtein).toFixed(1)}g
            </p>
          </div>

          {/* GLUCIDES */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍞</span>
                <span className="font-bold text-gray-800">Glucides</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  {todayStats.totalCarbs.toFixed(1)}g / {goals.carbsPerDay}g
                </div>
                <div className="text-xs text-gray-600">
                  {getProgressPercentage(todayStats.totalCarbs, goals.carbsPerDay).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${getProgressColor(
                  getProgressPercentage(todayStats.totalCarbs, goals.carbsPerDay)
                )}`}
                style={{
                  width: `${getProgressPercentage(todayStats.totalCarbs, goals.carbsPerDay)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Reste: {Math.max(0, goals.carbsPerDay - todayStats.totalCarbs).toFixed(1)}g
            </p>
          </div>

          {/* LIPIDES */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥑</span>
                <span className="font-bold text-gray-800">Lipides</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {todayStats.totalFat.toFixed(1)}g / {goals.fatsPerDay}g
                </div>
                <div className="text-xs text-gray-600">
                  {getProgressPercentage(todayStats.totalFat, goals.fatsPerDay).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${getProgressColor(
                  getProgressPercentage(todayStats.totalFat, goals.fatsPerDay)
                )}`}
                style={{
                  width: `${getProgressPercentage(todayStats.totalFat, goals.fatsPerDay)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Reste: {Math.max(0, goals.fatsPerDay - todayStats.totalFat).toFixed(1)}g
            </p>
          </div>

          {/* CONSEILS */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💡</span>
              <h3 className="text-xl font-bold text-green-900">Conseils du jour</h3>
            </div>
            <div className="space-y-3">
              {todayStats.totalProtein < goals.proteinPerDay * 0.5 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">
                    💪 <strong>Protéines:</strong> Il te reste encore{' '}
                    {(goals.proteinPerDay - todayStats.totalProtein).toFixed(0)}g à consommer!
                    Pense aux œufs, poulet ou yaourt grec.
                  </p>
                </div>
              )}
              {todayStats.totalKcal > goals.caloriesPerDay * 0.9 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm text-gray-700">
                    ✅ <strong>Excellent!</strong> Tu as presque atteint ton objectif calorique!
                  </p>
                </div>
              )}
              {todayStats.totalKcal < goals.caloriesPerDay * 0.3 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-700">
                    ⚠️ <strong>Attention:</strong> Tu n'as consommé que{' '}
                    {((todayStats.totalKcal / goals.caloriesPerDay) * 100).toFixed(0)}% de ton objectif.
                    N'oublie pas de bien manger!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
