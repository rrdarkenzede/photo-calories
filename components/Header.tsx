'use client';

import { useStore } from '@/store/useStore';

export default function Header() {
  const { plan, setPlan } = useStore();

  return (
    <header className="bg-gradient-to-r from-[#1f8b8f] to-[#32b8c6] shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TOP ROW */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📸</div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                PhotoCalories
              </h1>
              <p className="text-sm text-white/80">
                Scanne • Analyse • Optimise
              </p>
            </div>
          </div>

          {/* MENU DÉROULANT PLAN */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white/90">Mon Plan:</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'FITNESS')}
              className="px-5 py-3 rounded-xl font-bold text-lg border-2 border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            >
              <option value="free" className="bg-gray-800 text-white">
                🆓 FREE
              </option>
              <option value="pro" className="bg-gray-800 text-white">
                ⭐ PRO
              </option>
              <option value="FITNESS" className="bg-gray-800 text-white">
                💎 FITNESS
              </option>
            </select>
          </div>
        </div>

        {/* BOTTOM ROW - Info Plan */}
        <div className="flex items-center justify-center gap-2 py-3 px-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <span className="text-2xl">💡</span>
          <p className="text-sm text-white/90 font-medium">
            Change de plan à tout moment pour tester les fonctionnalités
          </p>
        </div>
      </div>
    </header>
  );
}
