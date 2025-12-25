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
      <nav className="glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-md)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📷 PhotoCalories</h1>
          <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}>Dashboard</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', animation: 'fadeIn 0.8s ease' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', borderRadius: '24px', padding: '4rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🍽️</div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Votre Coach Nutrition IA</h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>Scannez vos repas instantanément. Notre IA analyse automatiquement calories, macros et micronutriments pour vous.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.15rem', borderRadius: '14px' }}>🚀 Commencer Gratuitement</button>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={{ padding: '1.2rem 2.5rem', fontSize: '1.15rem', background: 'white', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: '14px', fontWeight: 700 }}>En savoir plus</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.05)' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 800, color: 'white' }}>Fonctionnalités Premium</h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4rem' }}>Tout ce dont vous avez besoin pour atteindre vos objectifs</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '📸', title: 'Scan IA', desc: 'Reconnaissance instantanée des aliments par intelligence artificielle', color: '#ec4899' },
              { icon: '📊', title: 'Stats Avancées', desc: 'Suivi détaillé de vos calories et macros au quotidien', color: '#8b5cf6' },
              { icon: '🍳', title: '1000+ Recettes', desc: 'Base de données complète avec recettes personnalisées', color: '#f59e0b' },
              { icon: '🤖', title: 'Coach Personnel', desc: 'Conseils nutrition adaptés à vos objectifs', color: '#10b981' },
            ].map((feature) => (
              <div key={feature.title} className="glass" style={{ padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700, color: feature.color }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 800, color: 'white' }}>Choisissez Votre Plan</h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4rem' }}>Des prix transparents, sans surprise</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            {plans.map((plan) => (
              <div key={plan.id} className="glass" style={{
                padding: '2.5rem',
                border: plan.popular ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '24px',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.popular ? 'var(--shadow-xl), 0 0 0 1px var(--primary)' : 'var(--shadow-lg)',
                transition: 'all 0.3s ease',
              }} onMouseEnter={(e) => e.currentTarget.style.transform = plan.popular ? 'scale(1.08)' : 'scale(1.03)'} onMouseLeave={(e) => e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)'}>
                {plan.popular && <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '25px', fontSize: '0.85rem', fontWeight: 700, boxShadow: 'var(--shadow-lg)' }}>⭐ POPULAIRE</div>}
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>{plan.name}</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1.5rem 0', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{plan.price}€{plan.price > 0 && <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>/mois</span>}</div>
                <ul style={{ marginBottom: '2rem', listStyle: 'none' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ padding: '0.75rem 0', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.3rem' }}>✅</span> {feature}</li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', textDecoration: 'line-through', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.3rem' }}>❌</span> {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: selectedPlan === plan.id ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--bg-alt)',
                    color: selectedPlan === plan.id ? 'white' : 'var(--text)',
                    border: selectedPlan === plan.id ? 'none' : '2px solid var(--border)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    boxShadow: selectedPlan === plan.id ? 'var(--shadow-lg)' : 'none',
                  }}
                >
                  {selectedPlan === plan.id ? '✓ Sélectionné' : 'Choisir ce plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', padding: '3rem 0', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
        <div className="container">
          <p style={{ fontSize: '1.1rem' }}>© 2025 PhotoCalories. Propulsé par l'IA. Fait avec ❤️</p>
        </div>
      </footer>
    </div>
  )
}
