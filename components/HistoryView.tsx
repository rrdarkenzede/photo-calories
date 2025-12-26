'use client'

import { MealEntry } from '@/lib/calculations'

export default function HistoryView({ meals, showMacros }: { meals: MealEntry[]; showMacros: boolean }) {
  const grouped = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) acc[meal.date] = []
    acc[meal.date].push(meal)
    return acc
  }, {} as Record<string, MealEntry[]>)

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: '#1a202c' }}>Historique 📜</h2>
      
      {meals.length === 0 ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: '#4a5568', border: '2px solid #e2e8f0' }}>Aucun repas enregistré</div>
      ) : (
        Object.entries(grouped).reverse().map(([date, dayMeals]) => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.75rem' }}>
              {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {dayMeals.map(meal => (
                <div key={meal.id} style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1a202c' }}>{meal.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>{meal.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#667eea', fontSize: '1.1rem' }}>{meal.calories}cal</div>
                    {meal.protein && showMacros && (
                      <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600 }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
                    )}
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
