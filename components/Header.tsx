'use client';

import { useStore } from '@/store/useStore';

export default function Header() {
  const { plan, setPlan, totalCalories, totalProtein, totalCarbs, totalFat, scansToday } =
    useStore();

  const planLabels: Record<string, string> = {
    free: 'FREE',
    pro: 'PRO',
    fitness: 'FITNESS',
  };

  return (
    <header className="bg-gradient-to-b from-black via-gray-900/80 to-transparent border-b border-orange-500/20 sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
        {/* Titre + Plan */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-2">
              <span className="text-white">Photo</span>
              <span className="text-orange-400">Calories</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-semibold">
              🔍 Scanne • 📋 Analyse • 🎯 Optimise
            </p>
          </div>

          {/* Sélecteur de plan */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Plan actuel</span>
            <div className="flex items-center gap-3">
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'fitness')}
                className="px-4 py-2 rounded-xl font-bold text-sm md:text-base border border-orange-500/40 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              >
                <option value="free" className="bg-gray-900 text-white">
                  🆓 FREE
                </option>
                <option value="pro" className="bg-gray-900 text-white">
                  ⭐ PRO
                </option>
                <option value="fitness" className="bg-gray-900 text-white">
                  💎 FITNESS
                </option>
              </select>
              <span className="text-xs text-gray-400">
                Scans aujourd'hui: <span className="text-orange-400 font-semibold">{scansToday}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg p-3 border border-orange-500/30">
            <p className="text-xs text-gray-400 mb-1">Plan</p>
            <p className="text-lg font-bold text-orange-400">{planLabels[plan]}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-lg p-3 border border-red-500/30">
            <p className="text-xs text-gray-400 mb-1">Calories aujourd'hui</p>
            <p className="text-lg font-bold text-red-400">{totalCalories.toFixed(0)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/30">
            <p className="text-xs text-gray-400 mb-1">Protéines</p>
            <p className="text-lg font-bold text-blue-400">{totalProtein.toFixed(0)}g</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg p-3 border border-yellow-500/30">
            <p className="text-xs text-gray-400 mb-1">Glucides</p>
            <p className="text-lg font-bold text-yellow-400">{totalCarbs.toFixed(0)}g</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-3 border border-orange-500/30">
            <p className="text-xs text-gray-400 mb-1">Lipides</p>
            <p className="text-lg font-bold text-orange-400">{totalFat.toFixed(0)}g</p>
          </div>
        </div>
      </div>
    </header>
  );
}
