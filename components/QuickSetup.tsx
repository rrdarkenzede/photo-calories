'use client'

import { useState } from 'react'
import { calculateBMR, calculateTDEE, calculateMacros, saveProfile, UserProfile } from '@/lib/calculations'

export default function QuickSetup({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'M' as 'M' | 'F' | 'Other',
    activityLevel: 'moderate',
    goal: 'maintain',
  })

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
      plan: 'free',
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: macros.calories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFat: macros.fat,
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
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Salut! 👋</h2>
            <p style={{ opacity: 0.7, marginBottom: '2rem', fontSize: '0.95rem' }}>On doit juste connaître quelques infos pour calculer tes calories journalières</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Quel est ton nom?</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marie" style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>

            <button onClick={() => setStep(2)} disabled={!form.name} style={{ width: '100%', padding: '1rem', background: form.name ? 'var(--primary)' : 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: form.name ? 'pointer' : 'not-allowed', opacity: form.name ? 1 : 0.6 }}>Continuer</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Tes mesures</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Âge: {form.age} ans</label>
              <input type="range" min="13" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Poids: {form.weight} kg</label>
              <input type="range" min="40" max="200" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Taille: {form.height} cm</label>
              <input type="range" min="140" max="220" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Genre</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' | 'Other' })} style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '12px', fontFamily: 'inherit' }}>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="Other">Autre</option>
              </select>
            </div>

            <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Ton niveau d'activité</h2>
            
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { value: 'sedentary', label: 'Sédentaire (peu/pas d\'exercice)' },
                { value: 'light', label: 'Léger (1-3j/semaine)' },
                { value: 'moderate', label: 'Modéré (3-4j/semaine)' },
                { value: 'very_active', label: 'Actif (5-6j/semaine)' },
                { value: 'athlete', label: 'Athlète (6-7j/semaine)' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, activityLevel: opt.value })} style={{ padding: '1rem', border: form.activityLevel === opt.value ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', background: form.activityLevel === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' }}>
                  {form.activityLevel === opt.value && '✓ '}{opt.label}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(4)} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Ton objectif</h2>
            
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { value: 'weight_loss', label: 'Perte de poids' },
                { value: 'maintain', label: 'Maintenir mon poids' },
                { value: 'muscle_gain', label: 'Prise de muscle' },
                { value: 'bulk', label: 'Prise de masse' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, goal: opt.value })} style={{ padding: '1rem', border: form.goal === opt.value ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', background: form.goal === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' }}>
                  {form.goal === opt.value && '✓ '}{opt.label}
                </button>
              ))}
            </div>

            <button onClick={handleComplete} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Démarrer 🚀</button>
          </div>
        )}
      </div>
    </div>
  )
}
