'use client';

import { useStore } from '@/store/useStore';

export default function PlanSelector() {
  const { plan, setPlan } = useStore();

  const plans = [
    { id: 'FREE' as const, emoji: '🆓', label: 'Gratuit', color: 'from-gray-500 to-gray-600' },
    { id: 'PRO' as const, emoji: '⭐', label: 'Pro', color: 'from-yellow-500 to-orange-500' },
    { id: 'FITNESS' as const, emoji: '💎', label: 'Fitness', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 border-2 border-pink-200 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🎯</span> Ton Plan
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`p-4 rounded-xl font-bold transition-all ${
              plan === p.id
                ? `bg-gradient-to-r ${p.color} text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 hover:scale-102'
            }`}
          >
            <div className="text-3xl mb-2">{p.emoji}</div>
            <div className="text-sm">{p.label}</div>
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-600 mt-4 text-center">
        💡 Change de plan à tout moment pour tester
      </p>
    </div>
  );
}
