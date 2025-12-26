/**
 * Export utilities for PhotoCalories
 */

import { Meal } from './storage';

/**
 * Export meals to CSV format
 */
export function exportMealsToCSV(meals: Meal[]): string {
  // CSV Headers
  const headers = [
    'Date',
    'Heure',
    'Nom',
    'Calories',
    'Protéines (g)',
    'Glucides (g)',
    'Lipides (g)',
    'Nutriscore',
  ];

  // CSV Rows
  const rows = meals.map((meal) => {
    const date = new Date(meal.timestamp);
    return [
      date.toLocaleDateString('fr-FR'),
      date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      meal.name.replace(/,/g, ';'), // Replace commas to avoid CSV issues
      meal.calories,
      meal.protein?.toFixed(1) || 'N/A',
      meal.carbs?.toFixed(1) || 'N/A',
      meal.fat?.toFixed(1) || 'N/A',
      (meal as any).nutriscore || 'N/A',
    ];
  });

  // Combine headers and rows
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string = 'photocalories_export.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export meals with date range
 */
export function exportMealsByDateRange(meals: Meal[], startDate: Date, endDate: Date): string {
  const filtered = meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    return mealDate >= startDate && mealDate <= endDate;
  });

  return exportMealsToCSV(filtered);
}

/**
 * Generate summary statistics for export
 */
export function generateSummaryStats(meals: Meal[]) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const count = meals.length;
  const averages = {
    calories: Math.round(totals.calories / count) || 0,
    protein: Math.round(totals.protein / count) || 0,
    carbs: Math.round(totals.carbs / count) || 0,
    fat: Math.round(totals.fat / count) || 0,
  };

  return {
    totals,
    averages,
    count,
    dateRange: {
      start: meals[0]?.timestamp,
      end: meals[meals.length - 1]?.timestamp,
    },
  };
}

/**
 * Export summary to text
 */
export function exportSummaryToText(meals: Meal[]): string {
  const stats = generateSummaryStats(meals);
  
  return `
📊 PHOTOCALORIES - RÉSUMÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Période: ${new Date(stats.dateRange.start).toLocaleDateString('fr-FR')} - ${new Date(stats.dateRange.end).toLocaleDateString('fr-FR')}
Nombre de repas: ${stats.count}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAUX:
  🔥 Calories: ${stats.totals.calories} kcal
  💪 Protéines: ${stats.totals.protein.toFixed(1)}g
  🍞 Glucides: ${stats.totals.carbs.toFixed(1)}g
  🧈 Lipides: ${stats.totals.fat.toFixed(1)}g

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MOYENNES PAR REPAS:
  🔥 Calories: ${stats.averages.calories} kcal
  💪 Protéines: ${stats.averages.protein}g
  🍞 Glucides: ${stats.averages.carbs}g
  🧈 Lipides: ${stats.averages.fat}g

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
}
