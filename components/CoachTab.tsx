'use client'

import { useState } from 'react'
import { UserProfile } from '@/lib/calculations'

export default function CoachTab({ profile, onProfileUpdate }: { profile: UserProfile; onProfileUpdate: (profile: UserProfile) => void }) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [form, setForm] = useState({
    activityLevel: profile.activityLevel,
    goal: profile.goal,
    restrictions: '',
    metabolism: 'normal' as 'slow' | 'normal' | 'fast',
    diet: 'balanced' as 'keto' | 'mediterranean' | 'balanced' | 'high_protein',
  })

  const handleSubmit = () => {
    const updated: UserProfile = {
      ...profile,
      activityLevel: form.activityLevel,
      goal: form.goal,
    }
    onProfileUpdate(updated)
    setShowQuestionnaire(false)
  }

  if (profile.plan !== 'fitness') {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '16px', color: '#1a1a1a', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>🔒 Coach IA - Fitness+ seulement</h3>
        <p style={{ opacity: 0.7 }}>Upgrade vers Fitness+ pour accéder au Coach IA personnalisé</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: '#1a1a1a' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Salut {profile.name}! 🤖</h2>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Je suis ton Coach IA personnalisé</p>
      </div>

      {/* Main Coach Message */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: '#1a1a1a' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
          💬 "Salut! J'ai analysé tes données. Tu brûles environ <strong>{profile.tdee} cal/jour</strong>."
        </p>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          "Basé sur ton objectif <strong>({profile.goal})</strong>, ton plan idéal est:"
        </p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#667eea' }}>🔥 Calories</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{profile.targetCalories}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>kcal/jour</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#667eea' }}>🥩 Protéines</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{profile.targetProtein}g</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>/jour</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#667eea' }}>🥔 Glucides</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{profile.targetCarbs}g</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>/jour</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#667eea' }}>🧈 Graisses</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{profile.targetFat}g</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>/jour</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Button */}
      <button
        onClick={() => setShowQuestionnaire(!showQuestionnaire)}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        ⚙️ Customiser mes objectifs
      </button>

      {/* Questionnaire Form */}
      {showQuestionnaire && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: '#1a1a1a' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 700 }}>📋 Questionnaire détaillé</h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>🏃 Niveau d'activité physique?</label>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {[
                { value: 'sedentary', label: 'Sédentaire (peu/pas d\'exercice)' },
                { value: 'light', label: 'Léger (1-3j/semaine)' },
                { value: 'moderate', label: 'Modéré (3-4j/semaine)' },
                { value: 'very_active', label: 'Actif (5-6j/semaine)' },
                { value: 'athlete', label: 'Athlète (6-7j/semaine)' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, activityLevel: opt.value })}
                  style={{
                    padding: '0.75rem',
                    border: form.activityLevel === opt.value ? '2px solid #667eea' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: form.activityLevel === opt.value ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                  }}
                >
                  {form.activityLevel === opt.value && '✓ '}{opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>💪 Objectif principal?</label>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {[
                { value: 'weight_loss', label: 'Perte de poids' },
                { value: 'maintain', label: 'Maintenir mon poids' },
                { value: 'muscle_gain', label: 'Prise de muscle' },
                { value: 'bulk', label: 'Prise de masse' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, goal: opt.value })}
                  style={{
                    padding: '0.75rem',
                    border: form.goal === opt.value ? '2px solid #667eea' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: form.goal === opt.value ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                  }}
                >
                  {form.goal === opt.value && '✓ '}{opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>⚡ Métabolisme?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {[
                { value: 'slow', label: 'Lent' },
                { value: 'normal', label: 'Normal' },
                { value: 'fast', label: 'Rapide' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, metabolism: opt.value as any })}
                  style={{
                    padding: '0.75rem',
                    border: form.metabolism === opt.value ? '2px solid #667eea' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: form.metabolism === opt.value ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {form.metabolism === opt.value && '✓ '}{opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✓ Mettre à jour mes objectifs
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', color: '#1a1a1a' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>💡 Conseils du jour</h3>
        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>🥗 Nutrition</div>
            <p style={{ margin: 0, opacity: 0.8 }}>Ajoute plus de légumes verts pour augmenter ton apport en fibres!</p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>💪 Training</div>
            <p style={{ margin: 0, opacity: 0.8 }}>Continue tes séances! Tu es sur la bonne voie.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
