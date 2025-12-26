import React from 'react'

type Plan = 'free' | 'pro' | 'fitness'

export default function Header({ plan }: { plan: Plan }) {
  return (
    <header style={{ background: 'white', borderBottom: '2px solid #e2e8f0', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>PhotoCalories</h1>
        </div>
        <div style={{ 
          background: plan === 'free' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f4ff',
          color: plan === 'free' ? 'white' : '#667eea',
          padding: '0.6rem 1.2rem',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          {plan === 'free' ? '💎 Gratuit' : plan === 'pro' ? '⭐ Pro' : '🏋️ Fitness'}
        </div>
      </div>
    </header>
  )
}
