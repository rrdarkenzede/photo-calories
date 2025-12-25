'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'free' | 'pro' | 'fitness';
}

export default function UpgradePopup({ isOpen, onClose, currentPlan }: UpgradePopupProps) {
  const { setPlan } = useStore();

  if (!isOpen) return null;

  const plans = [
    {
      id: 'pro',
      name: 'Pro',
      price: '$4.99/mois',
      features: ['10 scans/jour', 'Macros complets', 'Recettes illimitées'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'fitness',
      name: 'Fitness',
      price: '$9.99/mois',
      features: ['40 scans/jour', 'Tous les macros + micros', 'Coach IA complet'],
      color: 'from-orange-500 to-red-500',
      popular: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-orange-500/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Upgrade ton Plan</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-white transition-all"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-6 border-2 ${
                plan.popular
                  ? 'border-orange-500 bg-gradient-to-br from-orange-500/10 to-red-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              } hover:border-orange-400 transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  💎 Populaire
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-orange-400 text-lg font-bold mb-4">{plan.price}</p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">\u2713</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setPlan(plan.id as 'pro' | 'fitness');
                  onClose();
                }}
                disabled={currentPlan === plan.id}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {currentPlan === plan.id ? '✅ Actuellement' : 'Sélectionner'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400">
            💳 Tous les plans incluent: limite de scans quotidiens, suivi complet des calories
          </p>
        </div>
      </div>
    </div>
  );
}