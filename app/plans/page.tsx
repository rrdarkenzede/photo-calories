'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/auth'
import { useState } from 'react'

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: ['2 scans/jour', 'Historique 7 jours', 'Calories SEULEMENT', '❌ Macros'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    popular: true,
    features: ['10 scans/jour', 'Historique 90 jours', '✅ Calories + Macros', '✅ Analytics', '✅ Recipe Builder'],
  },
  {
    id: 'fitness',
    name: 'Fitness+',
    price: 9.99,
    features: ['40 scans/jour', 'Historique ILLIMITÉ', '✅ Tous les détails', '✅ Coach IA 24/7', '✅ Sync Fitness apps'],
  },
]

export default function PlansPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    setLoading(planId)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // TODO: Intégrer Stripe/PayPal
    console.log(`Selected plan: ${planId}`)
    setLoading(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <header className="glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PhotoCalories</h1>
          <button onClick={() => router.push('/')} className="btn-primary">Accueil</button>
        </div>
      </header>

      <main className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, textAlign: 'center', color: 'white', marginBottom: '3rem' }}>Choisissez votre plan</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {plans.map(plan => (
            <div key={plan.id} className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: plan.popular ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)', position: 'relative', transform: plan.popular ? 'scale(1.05)' : 'scale(1)' }}>
              {plan.popular && <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '25px', fontWeight: 700 }}>⭐ POPULAIRE</div>}
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>{plan.price}€{plan.price > 0 && '/mois'}</div>
              <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {plan.features.map(feature => (
                  <li key={feature} style={{ padding: '0.75rem 0', fontWeight: 600 }}>✓ {feature}</li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan(plan.id)} disabled={loading === plan.id} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {loading === plan.id ? 'Chargement...' : plan.price === 0 ? 'Commencer gratuitement' : 'Souscrire'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
