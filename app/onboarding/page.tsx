'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { calculateBMR, calculateTDEE, calculateMacros, supabase } from '@/lib/auth'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'M',
    activity_level: 'moderate',
    goal: 'maintain',
    dietary_restrictions: [] as string[],
  })

  const handleUpdate = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.gender)
    const tdee = calculateTDEE(bmr, formData.activity_level)
    const macros = calculateMacros(tdee, formData.goal, formData.weight)

    const { error } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email: user.email,
        ...formData,
        bmr,
        tdee,
        ...macros,
        plan: 'free',
        scans_remaining: 2,
        scans_limit: 2,
      },
    ])

    if (error) {
      console.error(error)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Profil de base</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom</label>
                <input type="text" value={formData.name} onChange={(e) => handleUpdate('name', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Age: {formData.age}</label>
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
                  <option value="Other">Autre</option>
                </select>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Suivant</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Niveau d'activité</h2>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { value: 'sedentary', label: '📍 Sédentaire (pas d\'exercice)' },
                  { value: 'light', label: '🚶 Peu actif (1-2x/semaine)' },
                  { value: 'moderate', label: '🏃 Modérément actif (3-5x/semaine)' },
                  { value: 'very_active', label: '💪 Très actif (6-7x/semaine)' },
                  { value: 'athlete', label: '🏋️ Athlète (quotidien intensif)' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleUpdate('activity_level', option.value)}
                    style={{
                      padding: '1rem',
                      border: formData.activity_level === option.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      background: formData.activity_level === option.value ? 'var(--primary-light)' : 'transparent',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {option.label}
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
                  { value: 'maintain', label: '⚖️ Maintenir le poids' },
                  { value: 'bulk', label: '📈 Prise de masse' },
                  { value: 'sports', label: '🏆 Préparation sportive' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleUpdate('goal', option.value)}
                    style={{
                      padding: '1rem',
                      border: formData.goal === option.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      background: formData.goal === option.value ? 'var(--primary-light)' : 'transparent',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>{loading ? 'Création du profil...' : 'Terminer'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
