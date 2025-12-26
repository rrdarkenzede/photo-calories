'use client';

import { useAppStore } from '@/lib/store';
import { PLANS } from '@/lib/plans';
import { ArrowLeft, Bell, Moon, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { currentPlan, dailyGoals, setDailyGoals } = useAppStore();
  const planInfo = PLANS[currentPlan];
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paramètres</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Compte</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Plan actuel</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {currentPlan === 'free' && 'Gratuit - 2 scans/jour'}
                  {currentPlan === 'pro' && 'Pro - 10 scans/jour'}
                  {currentPlan === 'fitness' && 'Fitness - 40 scans/jour'}
                </p>
              </div>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-lg uppercase text-sm">
                {currentPlan}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Historique</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Conservé pendant {planInfo.historicDays} jours
                </p>
              </div>
            </div>

            {currentPlan === 'free' && (
              <Link
                href="/"
                className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition"
              >
                <span>Passer à Pro ou Fitness</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Nutrition Goals Section */}
        {currentPlan !== 'free' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Objectifs nutritionnels</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Calories/jour
                </label>
                <input
                  type="number"
                  value={dailyGoals.calories}
                  onChange={(e) => setDailyGoals({ calories: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Protéines (g)
                </label>
                <input
                  type="number"
                  value={dailyGoals.protein}
                  onChange={(e) => setDailyGoals({ protein: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Glucides (g)
                </label>
                <input
                  type="number"
                  value={dailyGoals.carbs}
                  onChange={(e) => setDailyGoals({ carbs: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Lipides (g)
                </label>
                <input
                  type="number"
                  value={dailyGoals.fat}
                  onChange={(e) => setDailyGoals({ fat: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              💡 Ces objectifs sont modifiables. Utilise le Coach IA pour des recommendations personnalisées!
            </p>
          </div>
        )}

        {/* Preferences Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Préférences</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-900 dark:text-white">Mode sombre</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-900 dark:text-white">Notifications</span>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors"
                disabled
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Sécurité
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Données locales</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Toutes tes données sont stockées localement sur ton appareil. Aucun serveur externe n'a accès à tes informations personnelles.
              </p>
              <button className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition">
                Supprimer toutes les données
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
