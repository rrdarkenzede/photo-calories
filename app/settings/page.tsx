'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const SettingsPage = () => {
  const [plan, setPlan] = useState('free');
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [fitnessGoal, setFitnessGoal] = useState('maintain');

  const calculateCalories = () => {
    if (!age || !weight || !height) return 2000;
    // Harris-Benedict formula
    let bmr = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
    const factors: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = bmr * (factors[activity] || 1.55);
    
    const goals: any = {
      loss: tdee - 500,
      maintain: tdee,
      gain: tdee + 500,
    };
    return Math.round(goals[fitnessGoal] || 2000);
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      features: ['Calories', 'Historique 7j', '2 scans/j'],
    },
    {
      id: 'pro',
      name: 'Premium',
      price: '4,99€/mois',
      features: ['Calories + Macros', 'Historique illimité', 'Code-barres'],
    },
    {
      id: 'fitness',
      name: 'Elite',
      price: '9,99€/mois',
      features: ['Tout illimité', 'Coach IA', 'Recipe Builder'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-gray-700/30 backdrop-blur-md bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Paramétres</h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Plan Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Votre Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(p => (
              <motion.button
                key={p.id}
                onClick={() => setPlan(p.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl text-left border-2 transition-all duration-300 ${
                  plan === p.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-sm text-gray-400">{p.price}</p>
                  </div>
                  {plan === p.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full" />
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
            <h2 className="text-2xl font-bold mb-6 text-white">Vos Objectifs</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Objectif Calorique Quotidien
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-2">💫 Objectif: {dailyGoal} kcal/jour</p>
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
            <h2 className="text-2xl font-bold mb-6 text-white">Profil Coach IA</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">  Âge
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Poids (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Taille (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="180"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Activité</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="input-field"
                >
                  <option value="sedentary">Sédentaire</option>
                  <option value="light">Légère</option>
                  <option value="moderate">Modérée</option>
                  <option value="active">Active</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Objectif</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="input-field"
                >
                  <option value="loss">Perdre du poids</option>
                  <option value="maintain">Maintenir</option>
                  <option value="gain">Gagner du muscle</option>
                </select>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-300 mb-1">Objectif Calculé</p>
                    <p className="text-2xl font-bold text-blue-300">{calculateCalories()} kcal/jour</p>
                    <p className="text-xs text-blue-300/70 mt-1">Basé sur vos caractéristiques</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold text-white transition-all duration-300 shadow-lg"
        >
          Sauvegarder les paramétres
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;
