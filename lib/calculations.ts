import type { CoachProfile } from '@/types';

export function calculateBMR(
  height: number,
  weight: number,
  age: number,
  gender: 'M' | 'F'
): number {
  if (gender === 'M') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
}

export function calculateTDEE(bmr: number, exerciseFreq: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    intense: 1.725,
    veryIntense: 1.9,
  };
  return bmr * (multipliers[exerciseFreq] || 1.5);
}

export function calculateMacroGoals(
  tdee: number,
  weight: number,
  goal: 'loss' | 'maintain' | 'gain'
) {
  let calorieMultiplier = 1;
  if (goal === 'loss') calorieMultiplier = 0.85;
  else if (goal === 'gain') calorieMultiplier = 1.1;

  const calories = Math.round(tdee * calorieMultiplier);
  const protein = Math.round(weight * (goal === 'gain' ? 2 : goal === 'loss' ? 1.2 : 1.5));
  const fat = Math.round(weight * 0.8);
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

  return { calories, protein, carbs, fat };
}

export function unitToGrams(quantity: number, unit: string): number {
  const conversions: Record<string, number> = {
    g: 1,
    ml: 1,
    piece: 100,
    cuillere: 15,
  };
  return quantity * (conversions[unit] || 1);
}

// ✅ NOUVELLE FONCTION
export function calculateCoachData(profile: CoachProfile) {
  const bmr = calculateBMR(
    profile.height,
    profile.weight,
    profile.age,
    profile.gender
  );

  const tdee = calculateTDEE(bmr, profile.exerciseFreq);
  const macros = calculateMacroGoals(tdee, profile.weight, profile.goal);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    macros,
  };
}
