'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Zap, Info } from 'lucide-react';
import Link from 'next/link';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'weightLoss' | 'maintenance' | 'muscleGain';
type Gender = 'male' | 'female';

interface CoachProfile {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

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
  const { plan, coachProfile, setCoachProfile, setGoal } = useAppStore();
  const [step, setStep] = useState<'form' | 'result'>(coachProfile ? 'result' : 'form');
  const [profile, setProfile] = useState<Partial<CoachProfile>>(
    coachProfile 
      ? {
          age: coachProfile.age,
          weight: coachProfile.weight,
          height: coachProfile.height,
          gender: coachProfile.gender,
          activityLevel: coachProfile.activityLevel,
          goal: coachProfile.goal as Goal,
        }
      : {}
  );

  const calculateGoals = (prof: CoachProfile) => {
    let bmr = 0;
    if (prof.gender === 'male') {
      bmr = 10 * prof.weight + 6.25 * prof.height - 5 * prof.age + 5;
    } else {
      bmr = 10 * prof.weight + 6.25 * prof.height - 5 * prof.age - 161;
    }

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const tdee = bmr * activityMultipliers[prof.activityLevel as ActivityLevel];

    let dailyCalories = tdee;
    if (prof.goal === 'weightLoss') {
      dailyCalories = tdee - 500;
    } else if (prof.goal === 'muscleGain') {
      dailyCalories = tdee + 300;
    }

    const protein = prof.weight * 2.2;
    const fatCalories = dailyCalories * 0.25;
    const fat = fatCalories / 9;
    const carbCalories = dailyCalories - protein * 4 - fat * 9;
    const carbs = carbCalories / 4;

    return {
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullProfile = profile as CoachProfile;
    setCoachProfile(fullProfile);
    const goals = calculateGoals(fullProfile);
    setGoal({
      dailyCalories: goals.dailyCalories,
      protein: goals.protein,
      carbs: goals.carbs,
      fat: goals.fat,
    });
    setStep('result');
  };

  const goals = coachProfile ? calculateGoals(coachProfile as CoachProfile) : null;

  if (plan !== 'fitness') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Fitness Only</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Le Coach IA est réservé au plan Fitness</p>
          <Link href="/dashboard" className="btn-primary w-full block text-center">
            Retour au Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Coach IA 🤖</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Personnalise tes objectifs nutritionnels</p>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="card animate-fade-in space-y-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-300">Remplis honnêtement pour des résultats précis!</p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Âge</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                required
                min="1"
                max="120"
                className="input"
                placeholder="ex: 25"
              />
            </div>

            {/* Grid: Weight & Height */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Poids (kg)</label>
                <input
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                  required
                  step="0.5"
                  min="10"
                  max="300"
                  className="input"
                  placeholder="ex: 70"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Taille (cm)</label>
                <input
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                  required
                  min="50"
                  max="250"
                  className="input"
                  placeholder="ex: 180"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Sexe</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'male', label: '👨 Homme', emoji: '👨' },
                  { value: 'female', label: '👩 Femme', emoji: '👩' },
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profile.gender === option.value}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
                      required
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      profile.gender === option.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}>
                      <span className="text-xl mb-2 block">{option.emoji}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Niveau d'activité</label>
              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: '🛋️ Sédentaire', desc: 'Pas ou peu d\'exercice' },
                  { value: 'light', label: '🚶 Léger', desc: '1-3 jours/semaine' },
                  { value: 'moderate', label: '🏃 Modéré', desc: '3-5 jours/semaine' },
                  { value: 'active', label: '💪 Actif', desc: '6-7 jours/semaine' },
                  { value: 'veryActive', label: '🔥 Très actif', desc: 'Entraînement quotidien' },
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profile.activityLevel === option.value}
                      onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
                      required
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      profile.activityLevel === option.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900 dark:text-white">{option.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Objectif</label>
              <div className="space-y-2">
                {[
                  { value: 'weightLoss', label: '📉 Perte de poids', desc: '-500 kcal/jour (~0.5kg/semaine)' },
                  { value: 'maintenance', label: '➡️ Maintien', desc: 'Calories = TDEE' },
                  { value: 'muscleGain', label: '📈 Prise de muscle', desc: '+300 kcal/jour' },
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profile.goal === option.value}
                      onChange={(e) => setProfile({ ...profile, goal: e.target.value as Goal })}
                      required
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      profile.goal === option.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900 dark:text-white">{option.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Calculer mes objectifs
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Profile Summary */}
            <div className="card">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">📋 Ton Profil</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Âge', value: `${coachProfile?.age} ans` },
                  { label: 'Poids', value: `${coachProfile?.weight} kg` },
                  { label: 'Taille', value: `${coachProfile?.height} cm` },
                  { label: 'Sexe', value: GENDER_LABELS[coachProfile?.gender as Gender] || 'N/A' },
                  { label: 'Activité', value: ACTIVITY_LABELS[coachProfile?.activityLevel as ActivityLevel] || 'N/A' },
                  { label: 'Objectif', value: GOAL_LABELS[coachProfile?.goal as Goal] || 'N/A' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculated Goals */}
            {goals && (
              <div className="card-gradient">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">🏆 Tes Objectifs Calculés</h2>
                <div className="grid sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Calories', value: goals.dailyCalories, unit: '/jour' },
                    { label: 'Protéines', value: goals.protein, unit: 'g' },
                    { label: 'Glucides', value: goals.carbs, unit: 'g' },
                    { label: 'Lipides', value: goals.fat, unit: 'g' },
                    { label: 'Fibres', value: 25, unit: 'g' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">{item.label}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/dashboard" className="btn-secondary flex-1 block text-center">
                ← Dashboard
              </Link>
              <button
                onClick={() => setStep('form')}
                className="btn-primary flex-1"
              >
                ✏️ Modifier
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
