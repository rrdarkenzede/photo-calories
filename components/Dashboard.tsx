'use client'

import { useState, useEffect } from 'react'
import { getTodayMeals, decrementScans, MealEntry, UserProfile } from '@/lib/calculations'

export default function Dashboard({ profile: initialProfile }: { profile: UserProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })

  useEffect(() => {
    setMeals(getTodayMeals())
  }, [])

  const totalCal = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProt = meals.reduce((sum, m) => sum + (m.protein || 0), 0)
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0)
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0)

  const calPercent = Math.round((totalCal / profile.targetCalories) * 100)
  const protPercent = Math.round((totalProt / profile.targetProtein) * 100)
  const carbPercent = Math.round((totalCarbs / profile.targetCarbs) * 100)
  const fatPercent = Math.round((totalFat / profile.targetFat) * 100)

  const addMeal = () => {
    if (mealForm.name && mealForm.calories) {
      if (profile.scansRemaining <= 0) {
        alert('Pas de scans restants! (Gratuit: 2/jour)')
        return
      }

      const newMeal: MealEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        name: mealForm.name,
        calories: parseInt(mealForm.calories),
        protein: mealForm.protein ? parseInt(mealForm.protein) : undefined,
        carbs: mealForm.carbs ? parseInt(mealForm.carbs) : undefined,
        fat: mealForm.fat ? parseInt(mealForm.fat) : undefined,
        items: [mealForm.name],
      }

      setMeals([...meals, newMeal])
      setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '' })
      setShowAddMeal(false)

      decrementScans()
      setProfile({ ...profile, scansRemaining: profile.scansRemaining - 1 })
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <header className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Salut {profile.name}! 👋</h1>
              <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Scans restants</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{profile.scansRemaining} / 2</div>
            </div>
          </div>
        </header>

        {/* Main Stats */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{totalCal}</h2>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>/ {profile.targetCalories} cal</p>
          <div style={{ margin: '1.5rem 0 0 0', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(calPercent, 100)}%`, transition: 'width 0.3s' }} />
          </div>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>{Math.max(0, profile.targetCalories - totalCal)} cal restantes</p>
        </div>

        {/* Macros - FREE PLAN HIDES THEM */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="🥩 Prot" current={totalProt} target={profile.targetProtein} percent={protPercent} />
          <StatCard label="🥔 Carbs" current={totalCarbs} target={profile.targetCarbs} percent={carbPercent} />
          <StatCard label="🧈 Gras" current={totalFat} target={profile.targetFat} percent={fatPercent} />
        </div>

        {/* Add Meal Button */}
        <button onClick={() => setShowAddMeal(true)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
          📸 Ajouter un repas
        </button>

        {/* Add Meal Form */}
        {showAddMeal && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: 'white' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Ajouter un repas</h3>
            <input type="text" placeholder="Nom du repas" value={mealForm.name} onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Calories" value={mealForm.calories} onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Protéines (opt)" value={mealForm.protein} onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Glucides (opt)" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Graisses (opt)" value={mealForm.fat} onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 1rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowAddMeal(false)} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
              <button onClick={addMeal} style={{ flex: 1, padding: '0.75rem', background: 'rgba(102, 126, 234, 0.9)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Ajouter</button>
            </div>
          </div>
        )}

        {/* Meals List */}
        {meals.length > 0 && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Repas du jour</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {meals.map(meal => (
                <div key={meal.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{meal.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{meal.time}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{meal.calories}cal</div>
                      {meal.protein && <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, current, target, percent }: { label: string; current: number; target: number; percent: number }) {
  return (
    <div className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{current}</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.5rem' }}>/ {target}g</div>
      <div style={{ height: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  )
}
