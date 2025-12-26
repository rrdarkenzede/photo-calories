'use client'

import { useState } from 'react'
import { MealEntry, calculateDailyStats } from '@/lib/calculations'
import ScanModal from '@/components/ScanModal'
import Header from '@/components/Header'
import Stats from '@/components/Stats'
import MealHistory from '@/components/MealHistory'

type Plan = 'free' | 'pro' | 'fitness'

const PLAN: Plan = 'free'

export default function Home() {
  const [meals, setMeals] = useState<MealEntry[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      time: '12:30',
      name: 'Salade Caesar',
      calories: 450,
      protein: 20,
      carbs: 35,
      fat: 25,
      items: ['Salade Caesar']
    }
  ])
  const [showScanModal, setShowScanModal] = useState(false)

  const addMeal = (meal: MealEntry) => {
    setMeals([...meals, meal])
    setShowScanModal(false)
  }

  const stats = calculateDailyStats(meals)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '0' }}>
      <Header plan={PLAN} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats */}
        <Stats stats={stats} plan={PLAN} />

        {/* Action Button - SINGLE BUTTON */}
        <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={() => setShowScanModal(true)}
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
          >
            📸 Scanner un repas
          </button>
        </div>

        {/* Meal History */}
        <MealHistory meals={meals} plan={PLAN} />
      </main>

      {/* Modal */}
      {showScanModal && (
        <ScanModal
          onClose={() => setShowScanModal(false)}
          onAdd={addMeal}
          plan={PLAN}
        />
      )}
    </div>
  )
}
