'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'PRO' | 'FITNESS'>('FREE');

  const plans = [
    {
      id: 'FREE' as const,
      name: 'Gratuit',
      emoji: '🆓',
      price: '0€',
      scans: '2 scans/jour',
      features: [
        '📸 Scanner de plats basique',
        '📱 Scanner code-barres',
        '🔥 Comptage calories',
        '📊 Historique limité',
      ],
      color: 'from-gray-400 to-gray-600',
      popular: false,
    },
    {
      id: 'PRO' as const,
      name: 'Pro',
      emoji: '⭐',
      price: '4,99€/mois',
      scans: '15 scans/jour',
      features: [
        '✅ Tout du plan Gratuit',
        '💪 Macros détaillées (P/G/L)',
        '🎯 Objectifs personnalisés',
        '📈 Stats avancées',
        '🔔 Rappels quotidiens',
      ],
      color: 'from-yellow-400 to-orange-500',
      popular: false,
    },
    {
      id: 'FITNESS' as const,
      name: 'Fitness',
      emoji: '💎',
      price: '9,99€/mois',
      scans: '40 scans/jour',
      features: [
        '✅ Tout du plan Pro',
        '🤖 Coach IA personnalisé',
        '📚 Recettes adaptées',
        '🍳 Créateur de recettes',
        '🏆 Programme nutritionnel',
        '⚡ Analyses temps réel',
      ],
      color: 'from-purple-500 to-pink-600',
      popular: true, // ✅ POPULAIRE!
    },
  ];

  const handleStart = () => {
    localStorage.setItem('selectedPlan', selectedPlan);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f8b8f] to-[#32b8c6]">
      {/* HEADER */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl">🍎</span>
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
                Calorie<span className="text-[#1f8b8f]">Tracker</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Ta santé, ton pouvoir
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center text-white">
        <h2 className="text-4xl sm:text-6xl font-black mb-6">
          Prends une photo de ton repas,<br />
          <span className="text-yellow-300">connaît tes calories</span>
        </h2>
        <p className="text-lg sm:text-2xl mb-8 text-white/90">
          Prends une photo de ton plat et laisse l'IA calculer automatiquement les calories et nutriments. Simple, rapide, précis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-white text-[#1f8b8f] rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
          >
            📸 Commencer Gratuitement
          </button>
          <button className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-full font-bold text-lg hover:bg-white/30 transition-colors">
            🎥 Voir la démo
          </button>
        </div>
      </section>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            🎯 Ton Plan
          </h2>
          <p className="text-lg text-white/90">
            💡 Change de plan à tout moment pour tester
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'ring-4 ring-yellow-400 scale-105'
                  : 'hover:scale-102'
              }`}
            >
              {/* BADGE POPULAIRE */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  🔥 POPULAIRE
                </div>
              )}

              {/* CHECKMARK SI SÉLECTIONNÉ */}
              {selectedPlan === plan.id && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                  ✓
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{plan.emoji}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-sm text-gray-600 mb-2">{plan.scans}</div>
                <div className="text-3xl font-black bg-gradient-to-r from-gray-900 to-[#1f8b8f] bg-clip-text text-transparent">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-lg flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-12 py-5 bg-white text-[#1f8b8f] rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            🚀 Commencer avec le plan {plans.find(p => p.id === selectedPlan)?.name}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white/10 backdrop-blur text-white text-center py-8">
        <p className="text-sm">
          © 2025 CalorieTracker - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
