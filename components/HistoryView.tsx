'use client'

import { MealEntry } from '@/lib/calculations'

export default function HistoryView({ meals, showMacros }: { meals: MealEntry[]; showMacros: boolean }) {
  const grouped = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) acc[meal.date] = []
    acc[meal.date].push(meal)
    return acc
  }, {} as Record<string, MealEntry[]>)

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Historique 📜</h2>
      
      {meals.length === 0 ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', opacity: 0.7 }}>Aucun repas enregistré</div>
      ) : (
        Object.entries(grouped).reverse().map(([date, dayMeals]) => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.75rem' }}>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {dayMeals.map(meal => (
                <div key={meal.id} className="glass" style={{ padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{meal.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{meal.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{meal.calories}cal</div>
                    {meal.protein && showMacros && <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>P:{meal.protein}g</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
