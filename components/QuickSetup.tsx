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
  })

  const handleComplete = () => {
    // Default values for Free/Pro (no detailed questionnaire)
    const bmr = calculateBMR(form.weight, form.height, form.age, form.gender)
    const tdee = calculateTDEE(bmr, 'moderate') // Default moderate activity
    const macros = calculateMacros(tdee, 'maintain', form.weight) // Default maintain goal

    const profile: UserProfile = {
      name: form.name,
      age: form.age,
      weight: form.weight,
      height: form.height,
      gender: form.gender,
      activityLevel: 'moderate',
      goal: 'maintain',
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
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '500px', width: '100%', color: 'white', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)' }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>Salut! 👋</h2>
            <p style={{ color: '#555', marginBottom: '2rem', fontSize: '0.95rem' }}>On doit juste connaître quelques infos pour calculer tes calories journalières</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Quel est ton nom?</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marie" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <button onClick={() => setStep(2)} disabled={!form.name} style={{ width: '100%', padding: '1rem', background: form.name ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0,0,0,0.1)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: form.name ? 'pointer' : 'not-allowed', opacity: form.name ? 1 : 0.6 }}>Continuer</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#1a1a1a' }}>Tes mesures</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#1a1a1a' }}>Âge: {form.age} ans</label>
              <input type="range" min="13" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#1a1a1a' }}>Poids: {form.weight} kg</label>
              <input type="range" min="40" max="200" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#1a1a1a' }}>Taille: {form.height} cm</label>
              <input type="range" min="140" max="220" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Genre</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' | 'Other' })} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="Other">Autre</option>
              </select>
            </div>

            <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>Choisis ton plan 🎯</h2>
            <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Le questionnaire pointu c'est seulement si tu prends Fitness+</p>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { value: 'free', label: '📱 Gratuit', desc: '2 scans/jour, historique 7j' },
                { value: 'pro', label: '⭐ Pro', desc: '10 scans/jour, historique 90j' },
                { value: 'fitness', label: '💪 Fitness+', desc: 'Questionnaire + Coach IA, 40 scans/jour' },
              ].map(plan => (
                <button key={plan.value} onClick={() => {
                  const newProfile: UserProfile = {
                    name: form.name,
                    age: form.age,
                    weight: form.weight,
                    height: form.height,
                    gender: form.gender,
                    activityLevel: 'moderate',
                    goal: 'maintain',
                    plan: plan.value as any,
                    bmr: 0,
                    tdee: 0,
                    targetCalories: 0,
                    targetProtein: 0,
                    targetCarbs: 0,
                    targetFat: 0,
                    createdAt: new Date().toISOString(),
                  }
                  saveProfile(newProfile)
                  if (plan.value === 'fitness') {
                    setStep(4) // Go to detailed questionnaire
                  } else {
                    // Calculate with defaults and complete
                    const bmr = calculateBMR(form.weight, form.height, form.age, form.gender)
                    const tdee = calculateTDEE(bmr, 'moderate')
                    const macros = calculateMacros(tdee, 'maintain', form.weight)
                    const finalProfile: UserProfile = {
                      ...newProfile,
                      bmr: Math.round(bmr),
                      tdee: Math.round(tdee),
                      targetCalories: macros.calories,
                      targetProtein: macros.protein,
                      targetCarbs: macros.carbs,
                      targetFat: macros.fat,
                    }
                    saveProfile(finalProfile)
                    onComplete(finalProfile)
                  }
                }} style={{ padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '12px', background: 'white', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{plan.label}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{plan.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>Ton activité 🏃</h2>
            <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Ceci déterminera tes objectifs en calories</p>
            
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { value: 'sedentary', label: 'Sédentaire (peu/pas d\'exercice)' },
                { value: 'light', label: 'Léger (1-3j/semaine)' },
                { value: 'moderate', label: 'Modéré (3-4j/semaine)' },
                { value: 'very_active', label: 'Actif (5-6j/semaine)' },
                { value: 'athlete', label: 'Athlète (6-7j/semaine)' },
              ].map(opt => {
                const currentForm = form as any
                return (
                  <button key={opt.value} onClick={() => (currentForm as any).activityLevel = opt.value} style={{ padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '12px', background: 'white', color: '#1a1a1a', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' }}>
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <button onClick={() => setStep(5)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Suivant</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>Ton objectif 🎯</h2>
            <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.85rem' }}>C'est celui-ci qui détermine tes macros</p>
            
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { value: 'weight_loss', label: 'Perte de poids' },
                { value: 'maintain', label: 'Maintenir mon poids' },
                { value: 'muscle_gain', label: 'Prise de muscle' },
                { value: 'bulk', label: 'Prise de masse' },
              ].map(opt => {
                const currentForm = form as any
                return (
                  <button key={opt.value} onClick={() => (currentForm as any).goal = opt.value} style={{ padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '12px', background: 'white', color: '#1a1a1a', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' }}>
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <button onClick={handleComplete} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Démarrer 🚀</button>
          </div>
        )}
      </div>
    </div>
  )
}
