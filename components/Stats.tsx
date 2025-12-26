import React from 'react'
import { DailyStats } from '@/lib/calculations'

type Plan = 'free' | 'pro' | 'fitness'

export default function Stats({ stats, plan }: { stats: DailyStats; plan: Plan }) {
  const remaining = Math.max(0, stats.dailyGoal - stats.totalCalories)
  const progress = Math.min(100, (stats.totalCalories / stats.dailyGoal) * 100)

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Scans remaining */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '2px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem' }}>Scans restants</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#667eea' }}>{plan === 'free' ? '2 / 2' : 'Illimité'}</div>
      </div>

      {/* Calorie progress */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '2px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1a202c' }}>{stats.totalCalories}</div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>/ {stats.dailyGoal} cal</div>
        </div>
        <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '20px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${progress}%`, transition: 'width 300ms' }}></div>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#718096', textAlign: 'center' }}>{remaining} cal restantes</div>
      </div>

      {/* Macros */}
      {plan !== 'free' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096', marginBottom: '0.3rem' }}>PROTÉINES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{stats.totalProtein}g</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096', marginBottom: '0.3rem' }}>GLUCIDES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{stats.totalCarbs}g</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096', marginBottom: '0.3rem' }}>LIPIDES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{stats.totalFat}g</div>
          </div>
        </div>
      )}
    </div>
  )
}
