'use client'

import { useState, useRef } from 'react'
import { calculateBMR, calculateTDEE, calculateMacros } from '@/lib/auth'

type UserData = {
  age: number
  weight: number
  height: number
  gender: 'M' | 'F'
  activity_level: string
  goal: string
  bmr: number
  tdee: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
}

type MealEntry = {
  id: string
  time: string
  items: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function AppPage() {
  const [step, setStep] = useState<'setup' | 'app'>('setup')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [inputMeal, setInputMeal] = useState('')
  const [inputCalories, setInputCalories] = useState('')
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleSetup = (data: Partial<UserData>) => {
    if (data.age && data.weight && data.height && data.gender && data.activity_level && data.goal) {
      const bmr = calculateBMR(data.weight, data.height, data.age, data.gender)
      const tdee = calculateTDEE(bmr, data.activity_level)
      const macros = calculateMacros(tdee, data.goal, data.weight)
      
      setUserData({
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        activity_level: data.activity_level,
        goal: data.goal,
        bmr,
        tdee,
        targetCalories: macros.calories,
        targetProtein: macros.protein,
        targetCarbs: macros.carbs,
        targetFat: macros.fat,
      })
      setStep('app')
    }
  }

  const addMeal = () => {
    if (inputMeal && inputCalories) {
      const newMeal: MealEntry = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('fr-FR'),
        items: inputMeal,
        calories: parseInt(inputCalories),
        protein: Math.round(parseInt(inputCalories) * 0.3 / 4),
        carbs: Math.round(parseInt(inputCalories) * 0.5 / 4),
        fat: Math.round(parseInt(inputCalories) * 0.2 / 9),
      }
      setMeals([...meals, newMeal])
      setInputMeal('')
      setInputCalories('')
    }
  }

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0)
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0)
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0)

  if (step === 'setup') {
    return <SetupScreen onSetup={handleSetup} />
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <header className="glass" style={{ borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📸 PhotoCalories</h1>
          <button onClick={() => { setStep('setup'); setUserData(null) }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Nouveau profil</button>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard label="Calories" current={totalCalories} target={userData?.targetCalories || 0} />
          <StatCard label="Protéines (g)" current={totalProtein} target={userData?.targetProtein || 0} />
          <StatCard label="Glucides (g)" current={totalCarbs} target={userData?.targetCarbs || 0} />
          <StatCard label="Graisses (g)" current={totalFat} target={userData?.targetFat || 0} />
        </div>

        {/* Add Meal */}
        <div className="glass" style={{ borderRadius: '24px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ajouter un repas</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Ex: Pâtes bolognaise"
              value={inputMeal}
              onChange={(e) => setInputMeal(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
            <input
              type="number"
              placeholder="Calories"
              value={inputCalories}
              onChange={(e) => setInputCalories(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', width: '120px', fontSize: '1rem' }}
            />
            <button onClick={addMeal} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Ajouter</button>
          </div>
          
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
          <button onClick={() => cameraRef.current?.click()} className="glass" style={{ width: '100%', padding: '1rem', border: '2px dashed var(--border)', borderRadius: '12px', fontWeight: 600 }}>📷 Ou prenez une photo</button>
        </div>

        {/* Meals List */}
        {meals.length > 0 && (
          <div className="glass" style={{ borderRadius: '24px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Repas du jour</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {meals.map(meal => (
                <div key={meal.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{meal.items}</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{meal.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{meal.calories}cal</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
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

function SetupScreen({ onSetup }: { onSetup: (data: any) => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'M',
    activity_level: 'moderate',
    goal: 'maintain',
  })

  const handleUpdate = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '500px', width: '100%' }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Votre profil</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Âge: {formData.age}</label>
              <input type="range" min="13" max="100" value={formData.age} onChange={(e) => handleUpdate('age', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Poids (kg): {formData.weight}</label>
              <input type="range" min="40" max="200" value={formData.weight} onChange={(e) => handleUpdate('weight', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Taille (cm): {formData.height}</label>
              <input type="range" min="140" max="220" value={formData.height} onChange={(e) => handleUpdate('height', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Genre</label>
              <select value={formData.gender} onChange={(e) => handleUpdate('gender', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Suivant</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Activité</h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: 'sedentary', label: '📍 Sédentaire' },
                { value: 'light', label: '🚶 Peu actif' },
                { value: 'moderate', label: '🏃 Modéré' },
                { value: 'very_active', label: '💪 Très actif' },
                { value: 'athlete', label: '🏋️ Athlète' },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleUpdate('activity_level', opt.value)} style={{ padding: '1rem', border: formData.activity_level === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px', background: formData.activity_level === opt.value ? 'rgba(102, 126, 234, 0.2)' : 'transparent', fontWeight: 600, cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Suivant</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Objectif</h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: 'weight_loss', label: '📉 Perte de poids' },
                { value: 'muscle_gain', label: '💪 Prise de muscle' },
                { value: 'maintain', label: '⚖️ Maintenir' },
                { value: 'bulk', label: '📈 Prise de masse' },
                { value: 'sports', label: '🏆 Sport' },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleUpdate('goal', opt.value)} style={{ padding: '1rem', border: formData.goal === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px', background: formData.goal === opt.value ? 'rgba(102, 126, 234, 0.2)' : 'transparent', fontWeight: 600, cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <button onClick={() => onSetup(formData)} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Commencer ✨</button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, current, target }: { label: string; current: number; target: number }) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0
  return (
    <div className="glass" style={{ borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{current}</div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Objectif: {target} ({percentage}%)</div>
      <div style={{ marginTop: '0.75rem', height: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, #ec4899 100%)', width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}
