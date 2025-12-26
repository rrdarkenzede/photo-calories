import React from 'react'
import { MealEntry } from '@/lib/calculations'

type Plan = 'free' | 'pro' | 'fitness'

export default function MealHistory({ meals, plan }: { meals: MealEntry[]; plan: Plan }) {
  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', marginBottom: '1.5rem' }}>Historique du jour</h2>
      
      {meals.length === 0 ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#718096', border: '2px solid #e2e8f0' }}>
          Aucun repas enregistré
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {meals.map((meal) => (
            <div key={meal.id} style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.3rem' }}>{meal.time}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.5rem' }}>{meal.name}</div>
                {plan !== 'free' && meal.protein !== undefined && (
                  <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                    P: {meal.protein}g | C: {meal.carbs}g | L: {meal.fat}g
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#667eea' }}>{meal.calories}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>cal</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
