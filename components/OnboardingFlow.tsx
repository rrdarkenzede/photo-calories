'use client'

import { useState } from 'react'
import { calculateBMR, calculateTDEE, calculateMacros, saveProfile, UserProfile } from '@/lib/calculations'

export default function OnboardingFlow({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'M' as 'M' | 'F' | 'Other',
    activityLevel: 'moderate',
    goal: 'maintain',
    restrictions: [] as string[],
    preferences: [] as string[],
    metabolism: 'normal',
  })

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    const bmr = calculateBMR(form.weight, form.height, form.age, form.gender)
    const tdee = calculateTDEE(bmr, form.activityLevel)
    const macros = calculateMacros(tdee, form.goal, form.weight)

    const profile: UserProfile = {
      name: form.name,
      age: form.age,
      weight: form.weight,
      height: form.height,
      gender: form.gender,
      activityLevel: form.activityLevel,
      goal: form.goal,
      restrictions: form.restrictions,
      preferences: form.preferences,
      metabolism: form.metabolism,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: macros.calories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFat: macros.fat,
      scansRemaining: 2,
      createdAt: new Date().toISOString(),
    }

    saveProfile(profile)
    onComplete(profile)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '500px', width: '100%', color: 'white' }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Bienvenue! 👋</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Votre nom</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marie" style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '12px', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Âge: {form.age} ans</label>
              <input type="range" min="13" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Poids: {form.weight} kg</label>
              <input type="range" min="40" max="200" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Taille: {form.height} cm</label>
              <input type="range" min="140" max="220" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Genre</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' | 'Other' })} style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '12px' }}>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="Other">Autre</option>
              </select>
            </div>
            <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Niveau d'activité</h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: 'sedentary', label: '📋 Sédentaire' },
                { value: 'light', label: '🚶 Peu actif' },
                { value: 'moderate', label: '🏃 Modérément actif' },
                { value: 'very_active', label: '💪 Très actif' },
                { value: 'athlete', label: '🏋️ Athlète' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, activityLevel: opt.value })} style={{ padding: '1rem', border: form.activityLevel === opt.value ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', background: form.activityLevel === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePrev} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Précédent</button>
              <button onClick={handleNext} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Votre objectif</h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: 'weight_loss', label: '📉 Perte de poids' },
                { value: 'muscle_gain', label: '💪 Prise de muscle' },
                { value: 'maintain', label: '⚖️ Maintenir' },
                { value: 'bulk', label: '📈 Prise de masse' },
                { value: 'sports', label: '🏆 Sport' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, goal: opt.value })} style={{ padding: '1rem', border: form.goal === opt.value ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', background: form.goal === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePrev} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Précédent</button>
              <button onClick={handleNext} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Restrictions alimentaires</h2>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              {['Végétarien', 'Végan', 'Sans gluten', 'Sans lactose', 'Allergies'].map(res => (
                <label key={res} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.restrictions.includes(res)} onChange={(e) => setForm({ ...form, restrictions: e.target.checked ? [...form.restrictions, res] : form.restrictions.filter(r => r !== res) })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  {res}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePrev} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Précédent</button>
              <button onClick={handleNext} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Résumé</h2>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p>👤 <strong>{form.name}</strong>, {form.age} ans</p>
              <p>⚖️ {form.weight}kg • 📏 {form.height}cm</p>
              <p>🏃 Activité: {form.activityLevel}</p>
              <p>🎯 Objectif: {form.goal}</p>
              {form.restrictions.length > 0 && <p>🚫 Restrictions: {form.restrictions.join(', ')}</p>}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePrev} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Modifier</button>
              <button onClick={handleComplete} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Terminer ✨</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
