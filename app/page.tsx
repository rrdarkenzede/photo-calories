'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      {/* Header */}
      <header className="glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '1.25rem 0', marginBottom: '4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📸 PhotoCalories</h1>
          <button onClick={() => router.push('/app')} className="btn-primary">Démarrer</button>
        </div>
      </header>

      {/* Hero */}
      <main className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Scannez vos calories 📸</h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>Prenez une photo de votre repas, l'IA compte les calories automatiquement</p>
          <button onClick={() => router.push('/app')} className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>
            ✨ Commencer Gratuitement
          </button>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          {[
            { icon: '📸', title: 'Photo → Calories', desc: 'Scannez vos repas en 1 seconde' },
            { icon: '📊', title: 'Macros détaillés', desc: 'Protéines, glucides, graisses' },
            { icon: '📈', title: 'Historique illimité', desc: 'Tous vos repas sauvegardés' },
            { icon: '🎯', title: 'Objectifs personnalisés', desc: 'Adaptés à VOTRE corps' },
          ].map(feature => (
            <div key={feature.title} className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
