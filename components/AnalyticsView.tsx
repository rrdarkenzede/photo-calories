'use client'

import { MealEntry, UserProfile } from '@/lib/calculations'

export default function AnalyticsView({ meals, profile }: { meals: MealEntry[]; profile: UserProfile }) {
  const last7Days = meals.filter(m => {
    const mealDate = new Date(m.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return mealDate >= weekAgo
  })

  const totalCal = last7Days.reduce((sum, m) => sum + m.calories, 0)
  const avgCal = Math.round(totalCal / 7)

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: '#1a202c' }}>Statistiques 📊</h2>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>Moyenne 7 jours</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{avgCal} cal</div>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.5rem', fontWeight: 600 }}>Objectif: {profile.targetCalories} cal</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>Total cette semaine</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#764ba2' }}>{totalCal} cal</div>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.5rem', fontWeight: 600 }}>{last7Days.length} repas scannés</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.75rem', fontWeight: 600 }}>Tes objectifs</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 600 }}>Calories</div>
              <div style={{ fontWeight: 900, color: '#1a202c' }}>{profile.targetCalories}</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 600 }}>Protéines</div>
              <div style={{ fontWeight: 900, color: '#1a202c' }}>{profile.targetProtein}g</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 600 }}>Glucides</div>
              <div style={{ fontWeight: 900, color: '#1a202c' }}>{profile.targetCarbs}g</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 600 }}>Lipides</div>
              <div style={{ fontWeight: 900, color: '#1a202c' }}>{profile.targetFat}g</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
