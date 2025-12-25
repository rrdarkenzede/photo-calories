'use client';

import { useStore } from '@/store/useStore';

export default function Header() {
  const { plan, setPlan, totalCalories, totalProtein, totalCarbs, totalFat, scansToday } =
    useStore();

  const planEmojis: Record<string, string> = {
    free: '🆓',
    pro: '⭐',
    fitness: '💎',
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black via-gray-900/80 to-transparent border-b border-orange-500/30 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              <span className="text-white">Photo</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                Calories
              </span>
            </h1>
            <p className="text-gray-400 text-lg font-semibold">
              🔍 Scanne • 📋 Analyse • 🎯 Optimise
            </p>
          </div>

          {/* Plan Selector */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Plan Actuel</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'fitness')}
              className="px-6 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white border-2 border-orange-500/50 hover:border-orange-400 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-lg hover:shadow-xl"
            >
              <option value="free" className="bg-gray-900">🆓 FREE</option>
              <option value="pro" className="bg-gray-900">⭐ PRO</option>
              <option value="fitness" className="bg-gray-900">💎 FITNESS</option>
            </select>
            <div className="text-sm text-gray-300 font-semibold">
              Scans: <span className="text-orange-400">{scansToday}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Plan', value: plan.toUpperCase(), unit: '', icon: planEmojis[plan], color: 'from-gray-600 to-gray-700' },
            { label: 'Calories', value: totalCalories.toFixed(0), unit: 'kcal', icon: '🔥', color: 'from-red-600 to-rose-700' },
            { label: 'Protéines', value: totalProtein.toFixed(0), unit: 'g', icon: '💪', color: 'from-blue-600 to-cyan-700' },
            { label: 'Glucides', value: totalCarbs.toFixed(0), unit: 'g', icon: '🍞', color: 'from-yellow-600 to-amber-700' },
            { label: 'Lipides', value: totalFat.toFixed(0), unit: 'g', icon: '🥑', color: 'from-orange-600 to-red-700' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:shadow-lg hover:shadow-orange-500/20 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase text-gray-200 group-hover:text-white transition-colors">{stat.label}</p>
                <span className="text-xl group-hover:scale-125 transition-transform">{stat.icon}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-300">{stat.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
