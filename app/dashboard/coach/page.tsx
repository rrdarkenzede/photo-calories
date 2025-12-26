'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CoachProfile } from '@/lib/types';
import { ArrowLeft, Zap, Info } from 'lucide-react';
import Link from 'next/link';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'weightLoss' | 'maintenance' | 'muscleGain';
type Gender = 'male' | 'female';

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sédentaire',
  light: 'Léger',
  moderate: 'Modéré',
  active: 'Actif',
  veryActive: 'Très actif',
};

const GOAL_LABELS: Record<Goal, string> = {
  weightLoss: 'Perte de poids',
  maintenance: 'Maintien',
  muscleGain: 'Prise de muscle',
};

const GENDER_LABELS: Record<Gender, string> = {
  male: 'Homme',
  female: 'Femme',
};

export default function CoachPage() {
  const { currentPlan, coachProfile, setCoachProfile, setDailyGoals } = useAppStore();
  const [step, setStep] = useState<'form' | 'result'>(coachProfile ? 'result' : 'form');
  const [profile, setProfile] = useState<Partial<CoachProfile>>(coachProfile || {});

  const calculateGoals = (prof: CoachProfile) => {
    // Calcul BMR (Basal Metabolic Rate) avec Mifflin-St Jeor
    let bmr = 0;
    if (prof.gender === 'male') {
      bmr = 10 * prof.weight + 6.25 * prof.height - 5 * prof.age + 5;
    } else {
      bmr = 10 * prof.weight + 6.25 * prof.height - 5 * prof.age - 161;
    }

    // Multiplication par activité
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const tdee = bmr * activityMultipliers[prof.activityLevel as ActivityLevel];

    // Ajustement selon objectif
    let dailyCalories = tdee;
    if (prof.goal === 'weightLoss') {
      dailyCalories = tdee - 500; // -500 = 0.5kg/semaine
    } else if (prof.goal === 'muscleGain') {
      dailyCalories = tdee + 300; // +300 = croissance musculaire modérée
    }

    // Macros basées sur le poids corporel et l'objectif
    const protein = prof.weight * 2.2; // 2.2g/kg pour muscle gain
    const fatCalories = dailyCalories * 0.25;
    const fat = fatCalories / 9;
    const carbCalories = dailyCalories - protein * 4 - fat * 9;
    const carbs = carbCalories / 4;

    return {
      calories: Math.round(dailyCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      fiber: 25,
      sugar: 50,
      sodium: 2300,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullProfile = profile as CoachProfile;
    setCoachProfile(fullProfile);
    const goals = calculateGoals(fullProfile);
    setDailyGoals(goals);
    setStep('result');
  };

  const goals = coachProfile ? calculateGoals(coachProfile) : null;

  if (currentPlan !== 'fitness') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">🔒 Fitness Only</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Le Coach IA est réservé au plan Fitness</p>
          <Link href="/dashboard" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Coach IA 🤖</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Calcule tes objectifs nutritionnels personnalisés</p>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 space-y-6">
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Les objectifs seront calculés selon tes données. Sois honnête pour des résultats précis!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Âge (ans)
                </label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  required
                  min="18"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                  required
                  step="0.1"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Sexe
                </label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Sélectionne...</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Niveau d'activité
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: '🛋️ Sédentaire (pas ou peu d\'exercice)' },
                  { value: 'light', label: '🚶 Léger (1-3 jours/semaine)' },
                  { value: 'moderate', label: '🏃 Modéré (3-5 jours/semaine)' },
                  { value: 'active', label: '💪 Actif (6-7 jours/semaine)' },
                  { value: 'veryActive', label: '🔥 Très actif (entraînement intensif quotidien)' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profile.activityLevel === option.value}
                      onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
                      required
                      className="w-4 h-4"
                    />
                    <span className="text-slate-900 dark:text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Objectif
              </label>
              <div className="space-y-2">
                {[
                  { value: 'weightLoss', label: '📉 Perte de poids (-500 kcal/jour)' },
                  { value: 'maintenance', label: '➡️ Maintien (calories = TDEE)' },
                  { value: 'muscleGain', label: '📈 Prise de muscle (+300 kcal/jour)' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profile.goal === option.value}
                      onChange={(e) => setProfile({ ...profile, goal: e.target.value as Goal })}
                      required
                      className="w-4 h-4"
                    />
                    <span className="text-slate-900 dark:text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Zap className="w-5 h-5" />
              Calculer mes objectifs
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Profile summary */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profil</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Âge</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{coachProfile?.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Poids</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{coachProfile?.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Taille</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{coachProfile?.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Sexe</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {coachProfile?.gender ? GENDER_LABELS[coachProfile.gender as Gender] : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-2">
                  <span className="text-slate-600 dark:text-slate-400">Activité</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {coachProfile?.activityLevel ? ACTIVITY_LABELS[coachProfile.activityLevel as ActivityLevel] : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-2">
                  <span className="text-slate-600 dark:text-slate-400">Objectif</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {coachProfile?.goal ? GOAL_LABELS[coachProfile.goal as Goal] : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated goals */}
            {goals && (
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tes objectifs calculés</h2>
                <div className="grid sm:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Calories/jour</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{goals.calories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Protéines</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{goals.protein}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Glucides</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{goals.carbs}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Lipides</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{goals.fat}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Fibres</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{goals.fiber}g</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('form')}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Modifier le profil
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
