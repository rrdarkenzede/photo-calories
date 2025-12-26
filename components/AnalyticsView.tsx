'use client'

import { MealEntry, UserProfile } from '@/lib/calculations'

export default function AnalyticsView({ meals, profile }: { meals: MealEntry[]; profile: UserProfile }) {
  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const last7Days = meals.filter(m => m.date >= sevenDaysAgo)
  const daysWithData = [...new Set(last7Days.map(m => m.date))].length
  const avgCalories = last7Days.length > 0 ? Math.round(last7Days.reduce((sum, m) => sum + m.calories, 0) / daysWithData) : 0
  const totalProtein = last7Days.reduce((sum, m) => sum + (m.protein || 0), 0)

  const topMeals = [...new Map(last7Days.map(m => [m.name, m.calories])).entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Statistiques 📊</h2>

      {/* Period Selector */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['7 jours', '30 jours', '90 jours'].map(period => (
          <button key={period} style={{ flex: 1, padding: '0.75rem', background: period === '7 jours' ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            {period}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Moyenne Cal/jour</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{avgCalories}</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Jours actifs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{daysWithData}/7</div>
        </div>
      </div>

      {/* Top Meals */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Repas les plus consommés</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {topMeals.map(([name, cal]) => (
            <div key={name} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{cal}cal</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Insights</h3>
        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          <p>✅ Excellente semaine! {Math.round((daysWithData / 7) * 100)}% de réussite!</p>
          <p>💪 Apport protéiné: {totalProtein}g (Bon!)</p>
          <p>📈 Tendance: Calories stables</p>
        </div>
      </div>
    </div>
  )
}
