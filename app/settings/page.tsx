'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';

const SettingsPage = () => {
  const [plan, setPlan] = useState('fitness');
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(180);
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  const calculateTDEE = () => {
    // Harris-Benedict formula
    const bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    const factors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
    const tdee = bmr * (factors[activity] || 1.55);

    const adjustments: Record<string, number> = {
      loss: -500,
      maintain: 0,
      gain: 500,
    };

    return Math.round(tdee + (adjustments[goal] || 0));
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      desc: 'Pour commencer',
      features: ['📸 Upload photo', '🔥 Calories', '📅 Historique 7j'],
    },
    {
      id: 'pro',
      name: 'Premium',
      desc: 'Suivi complet',
      features: ['🔥 Calories + Macros', '🔍 Analytics', '📅 Historique illimité'],
    },
    {
      id: 'fitness',
      name: 'Elite',
      desc: 'Tout illimité',
      features: ['✨ TOUT', '🤖 Coach IA', '📖 Recipe Builder'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b-2 border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <h1 className="text-2xl font-black gradient-text">Paramétres</h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        {/* Plan Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black mb-8 text-gray-900">Votre Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <motion.button
                key={p.id}
                onClick={() => setPlan(p.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                  plan === p.id
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg ring-2 ring-blue-300/50'
                    : 'border-gray-200 bg-white hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-600">{p.desc}</p>
                  </div>
                  {plan === p.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-lg">✔️</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Goals Section */}
        {plan !== 'free' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Vos Objectifs</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">🌟 Objectif Calorique Quotidien</label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <span>💯</span> Objectif: <span className="font-bold text-blue-600">{dailyGoal} kcal/jour</span>
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Coach Profile (Fitness Only) */}
        {plan === 'fitness' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Coach IA - Profil Personnalisé</h2>
            <p className="text-gray-600 mb-6">🤖 Complétez votre profil pour des recommandations scientifiques</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Âge (ans)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Poids (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 70)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Taille (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 180)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">🏃 Niveau d'Activité</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="input-field"
                >
                  <option value="sedentary">Sédentaire (peu d'activité)</option>
                  <option value="light">Légère (1-3j/semaine)</option>
                  <option value="moderate">Modérée (3-5j/semaine)</option>
                  <option value="active">Active (6-7j/semaine)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">🎯 Objectif</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="input-field"
                >
                  <option value="loss">Perdre du poids</option>
                  <option value="maintain">Maintenir</option>
                  <option value="gain">Gagner du muscle</option>
                </select>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">🥺</div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">Objectif Calculé (Formule Harris-Benedict)</p>
                    <p className="text-3xl font-black text-blue-600 mb-1">{calculateTDEE()} kcal/jour</p>
                    <p className="text-xs text-blue-800/80">
                      Basé sur votre BMR, activité et objectif
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold text-white transition-all duration-300 shadow-lg"
        >
          Sauvegarder les Paramétres
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;
