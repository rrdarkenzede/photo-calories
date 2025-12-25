'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: ['5 scans/jour', 'Historique 7 jours', 'Stats basiques'],
    notIncluded: ['Recettes personnalisées', 'Coach IA'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    popular: true,
    features: ['Scans illimités', 'Historique 30 jours', 'Recettes personnalisées', 'Stats avancées'],
    notIncluded: ['Coach IA'],
  },
  {
    id: 'fitness',
    name: 'Fitness+',
    price: 19.99,
    features: ['Tout Pro', 'Historique illimité', 'Coach IA personnel', 'Macros avancés'],
    notIncluded: [],
  },
]

export default function Home() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('free')

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📷 PhotoCalories</h1>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '0.5rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Tableau de bord</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700 }}>Votre coach nutritionnel IA</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Scannez vos repas en photo. L'IA analyse automatiquement vos calories, macros et micronutriments.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/dashboard')} style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>📸 Commencer</button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'var(--bg)', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: '8px', cursor: 'pointer' }}>En savoir plus</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 700 }}>Fonctionnalités</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '📸', title: 'Scan Photo', desc: 'Reconnaissance IA des aliments' },
              { icon: '📊', title: 'Statistiques', desc: 'Suivi des calories et macros' },
              { icon: '📖', title: 'Recettes', desc: '1000+ recettes personnalisées' },
              { icon: '✨', title: 'Coach IA', desc: 'Conseils nutrition personnels' },
            ].map((feature) => (
              <div key={feature.title} style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 700 }}>Tarifs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                padding: '2rem',
                background: 'var(--bg)',
                border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '12px',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.popular ? '0 10px 30px rgba(0,112,243,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>POPULAIRE</div>}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, margin: '1rem 0' }}>{plan.price}€{plan.price > 0 && <span style={{ fontSize: '1rem', fontWeight: 500 }}>/mois</span>}</div>
                <ul style={{ marginBottom: '2rem', listStyle: 'none' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ padding: '0.5rem 0', color: 'var(--text)' }}>✅ {feature}</li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} style={{ padding: '0.5rem 0', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>❌ {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: selectedPlan === plan.id ? 'var(--primary)' : 'var(--bg-alt)',
                    color: selectedPlan === plan.id ? 'white' : 'var(--text)',
                    border: selectedPlan === plan.id ? 'none' : '1px solid var(--border)',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  {selectedPlan === plan.id ? '✓ Sélectionné' : 'Choisir'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div className="container">
          <p>© 2025 PhotoCalories. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
