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

  const planColors: Record<string, string> = {
    free: 'from-gray-500 to-slate-600',
    pro: 'from-blue-500 to-cyan-600',
    fitness: 'from-purple-500 to-pink-600',
  };

  const StatCard = ({
    label,
    value,
    unit,
    icon,
    gradient,
  }: {
    label: string;
    value: string;
    unit: string;
    icon: string;
    gradient: string;
  }) => (
    <div className={`
      group relative rounded-xl p-4 overflow-hidden transition-all duration-300 cursor-pointer
      border border-white/10 hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5
      bg-gradient-to-br ${gradient}
    `}>
      {/* Background blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
            {label}
          </p>
          <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-300">{unit}</p>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );

  return (
    <header className="relative bg-gradient-to-b from-black/95 via-gray-900/50 to-transparent border-b border-orange-500/20 sticky top-0 z-50 backdrop-blur-2xl shadow-2xl">
      {/* Background animation orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Titre + Plan Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                  <span className="text-white">Photo</span>
                  <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                    Calories
                  </span>
                </h1>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-32" />
              </div>
            </div>
            <p className="text-gray-400 text-base md:text-lg font-semibold tracking-wide">
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0s' }}>🔍</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.1s' }}>Scanne</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.3s' }}>📋</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.4s' }}>Analyse</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.5s' }}>•</span>
              <span className="inline-block animate-bounce mr-2" style={{ animationDelay: '0.6s' }}>🎯</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>Optimise</span>
            </p>
          </div>

          {/* Plan Selector - Premium Style */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Plan Actuel</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'fitness')}
              className={`
                relative px-6 py-3 rounded-xl font-bold text-lg backdrop-blur-md transition-all duration-300
                border-2 cursor-pointer focus:outline-none
                bg-gradient-to-r ${planColors[plan]}
                text-white border-white/20 hover:border-white/40
                hover:shadow-lg shadow-lg shadow-${plan === 'fitness' ? 'purple' : plan === 'pro' ? 'blue' : 'gray'}-500/50
              `}
            >
              <option value="free" className="bg-gray-900 text-white">🆓 FREE</option>
              <option value="pro" className="bg-gray-900 text-white">⭐ PRO</option>
              <option value="fitness" className="bg-gray-900 text-white">💎 FITNESS</option>
            </select>
            <div className="text-sm text-gray-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Scans: <span className="text-orange-400 font-bold text-lg">{scansToday}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Plan"
            value={plan.toUpperCase()}
            unit=""
            icon={planEmojis[plan]}
            gradient="from-gray-500/20 to-slate-600/20"
          />
          <StatCard
            label="Calories"
            value={totalCalories.toFixed(0)}
            unit="kcal"
            icon="🔥"
            gradient="from-red-500/20 to-rose-600/20"
          />
          <StatCard
            label="Protéines"
            value={totalProtein.toFixed(0)}
            unit="g"
            icon="💪"
            gradient="from-blue-500/20 to-cyan-600/20"
          />
          <StatCard
            label="Glucides"
            value={totalCarbs.toFixed(0)}
            unit="g"
            icon="🍞"
            gradient="from-yellow-500/20 to-amber-600/20"
          />
          <StatCard
            label="Lipides"
            value={totalFat.toFixed(0)}
            unit="g"
            icon="🥑"
            gradient="from-orange-500/20 to-red-600/20"
          />
        </div>
      </div>
    </header>
  );
}
