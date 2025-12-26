'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const recipes = [
  { id: '1', title: 'Salade Méditerranéenne', desc: 'Salade fraîche avec légumes et féta', cal: 350, pro: 12, carbs: 15, fat: 26, emoji: '🥗' },
  { id: '2', title: 'Poulet Grillé', desc: 'Filet de poulet avec légumes rôtis', cal: 450, pro: 45, carbs: 20, fat: 18, emoji: '🍗' },
  { id: '3', title: 'Smoothie Bowl', desc: 'Açaï avec fruits et granola', cal: 280, pro: 8, carbs: 48, fat: 7, emoji: '🥤' },
  { id: '4', title: 'Poke Bowl', desc: 'Riz, saumon, algues et sauce soja', cal: 520, pro: 38, carbs: 55, fat: 12, emoji: '🍱' },
]

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'stats' | 'recipes'>('stats')
  const [todayCalories, setTodayCalories] = useState(0)
  const [todayMeals, setTodayMeals] = useState(0)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    const today = new Date().toDateString()
    const todayScans = history.filter((item: any) => new Date(item.date).toDateString() === today)
    const calories = todayScans.reduce((sum: number, item: any) => sum + item.calories, 0)
    setTodayCalories(calories)
    setTodayMeals(todayScans.length)
  }, [])

  const stats = [
    { label: 'Calories Aujourd\'hui', value: todayCalories.toString(), goal: '2500', color: '#ec4899', icon: '🔥' },
    { label: 'Repas Enregistrés', value: todayMeals.toString(), color: '#8b5cf6', icon: '🍽️' },
    { label: 'Objectif', value: '2500', color: '#10b981', icon: '🎯' },
    { label: 'Restant', value: (2500 - todayCalories).toString(), color: '#f59e0b', icon: '⚡' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '1.25rem 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-md)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 onClick={() => router.push('/')} style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>📷 PhotoCalories</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => router.push('/scanner')} className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}>📷 Scanner</button>
            <button onClick={() => router.push('/history')} className="glass" style={{ padding: '0.65rem 1rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '1.2rem' }}>📊</button>
            <button onClick={() => router.push('/settings')} className="glass" style={{ padding: '0.65rem 1rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '1.2rem' }}>⚙️</button>
            <button onClick={() => router.push('/')} className="glass" style={{ padding: '0.65rem 1rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '1.2rem' }}>🚪</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '2.5rem 0' }}>
        {/* Tabs */}
        <div className="glass" style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '2.5rem', padding: '0.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '0.85rem 2rem',
              background: activeTab === 'stats' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
              color: activeTab === 'stats' ? 'white' : 'var(--text)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            📊 Statistiques
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            style={{
              padding: '0.85rem 2rem',
              background: activeTab === 'recipes' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
              color: activeTab === 'recipes' ? 'white' : 'var(--text)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            🍽️ Recettes
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div style={{ animation: 'slideUp 0.5s ease' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800, color: 'white' }}>Vos Statistiques</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="glass card" style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  borderLeft: `5px solid ${stat.color}`,
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>{stat.label}</p>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                  </div>
                  <p style={{ fontSize: '3rem', fontWeight: 800, color: stat.color, marginBottom: '0.25rem' }}>{stat.value}</p>
                  {stat.goal && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/ {stat.goal} kcal</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div style={{ animation: 'slideUp 0.5s ease' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800, color: 'white' }}>Recettes Suggérées</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="glass card"
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                  style={{ borderRadius: '20px', padding: '2rem', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{recipe.emoji}</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>{recipe.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{recipe.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(236,72,153,0.1)', borderRadius: '10px' }}><p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Cal</p><p style={{ fontWeight: 800, color: '#ec4899', fontSize: '1.1rem' }}>{recipe.cal}</p></div>
                    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(139,92,246,0.1)', borderRadius: '10px' }}><p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Pro</p><p style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '1.1rem' }}>{recipe.pro}g</p></div>
                    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: '10px' }}><p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Carbs</p><p style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>{recipe.carbs}g</p></div>
                    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: '10px' }}><p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Fat</p><p style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1.1rem' }}>{recipe.fat}g</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
