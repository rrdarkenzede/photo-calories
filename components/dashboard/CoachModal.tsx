'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { saveProfile, loadProfile } from '@/lib/storage';

interface CoachModalProps {
  plan: string;
  onClose: () => void;
  onSave: (dailyCalories: number) => void;
}

export default function CoachModal({ plan, onClose, onSave }: CoachModalProps) {
  const [profile, setProfile] = useState({
    age: 25,
    weight: 70,
    height: 175,
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'maintain' as 'lose' | 'maintain' | 'gain',
    dailyCalories: 2000,
  });

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile({ ...profile, ...saved });
  }, []);

  // Calculate TDEE (Mifflin-St Jeor)
  const calculateTDEE = () => {
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let tdee = bmr * activityMultipliers[profile.activityLevel];

    if (profile.goal === 'lose') {
      tdee -= 500;
    } else if (profile.goal === 'gain') {
      tdee += 500;
    }

    return Math.round(tdee);
  };

  const handleSave = () => {
    const dailyCalories = plan === 'fitness' ? calculateTDEE() : profile.dailyCalories;
    saveProfile({ ...profile, dailyCalories });
    onSave(dailyCalories);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full my-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {plan === 'fitness' ? 'Coach IA - Calcul TDEE' : 'Définir mon objectif'}
        </h2>

        {plan === 'pro' ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Calories quotidiennes</label>
              <input
                type="number"
                value={profile.dailyCalories}
                onChange={(e) =>
                  setProfile({ ...profile, dailyCalories: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Poids (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Taille (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) =>
                    setProfile({ ...profile, height: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Genre</label>
                <select
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      gender: e.target.value as 'male' | 'female',
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Activité physique</label>
              <select
                value={profile.activityLevel}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    activityLevel: e.target.value as any,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
              >
                <option value="sedentary">Sédentaire</option>
                <option value="light">Légère (1-3j/semaine)</option>
                <option value="moderate">Modérée (3-5j/semaine)</option>
                <option value="active">Active (6-7j/semaine)</option>
                <option value="very_active">Très active (2x/jour)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Objectif</label>
              <select
                value={profile.goal}
                onChange={(e) =>
                  setProfile({ ...profile, goal: e.target.value as any })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500"
              >
                <option value="lose">Perdre du poids</option>
                <option value="maintain">Maintenir</option>
                <option value="gain">Prendre du poids</option>
              </select>
            </div>

            {/* TDEE Result */}
            <div className="p-4 bg-blue-50 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Calories recommandées</p>
              <p className="text-3xl font-black text-blue-600">{calculateTDEE()}</p>
              <p className="text-xs text-gray-500 mt-1">kcal/jour (calcul scientifique)</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition text-lg"
        >
          Enregistrer
        </button>
      </motion.div>
    </div>
  );
}
