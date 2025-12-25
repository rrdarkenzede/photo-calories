'use client'

import { useRouter } from 'next/navigation'
import { useState, CSSProperties, useEffect } from 'react'

const recipes = [
  { id: '1', title: 'Salade Méditerranéenne', desc: 'Salade fraîche avec légumes et féta', cal: 350, pro: 12, carbs: 15, fat: 26 },
  { id: '2', title: 'Poulet Grillé', desc: 'Filet de poulet avec légumes rôtis', cal: 450, pro: 45, carbs: 20, fat: 18 },
  { id: '3', title: 'Smoothie Bowl', desc: 'Açaï avec fruits et granola', cal: 280, pro: 8, carbs: 48, fat: 7 },
  { id: '4', title: 'Poke Bowl', desc: 'Riz, saumon, algues et sauce soja', cal: 520, pro: 38, carbs: 55, fat: 12 },
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
    { label: 'Calories Aujourd\'hui', value: todayCalories.toString(), goal: '2500', color: '#ff6b6b' },
    { label: 'Repas Enregistrés', value: todayMeals.toString(), color: '#4ecdc4' },
    { label: 'Objectif', value: '2500', color: '#45b7d1' },
    { label: 'Restant', value: (2500 - todayCalories).toString(), color: '#96ceb4' },
  ]

  const handleRecipeClick = (id: string) => {
    router.push(`/recipes/${id}`)
  }

  const handleRecipeHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    target.style.transform = 'translateY(-4px)'
    target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
  }

  const handleRecipeLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    target.style.transform = 'translateY(0)'
    target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
  }

  const baseRecipeStyle: CSSProperties = {
    background: 'var(--bg)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 onClick={() => router.push('/')} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}>📷 PhotoCalories</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => router.push('/scanner')} style={{ padding: '0.5rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>📷 Scanner</button>
            <button onClick={() => router.push('/history')} style={{ padding: '0.5rem 1.5rem', background: 'var(--bg-alt)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>📊</button>
            <button onClick={() => router.push('/settings')} style={{ padding: '0.5rem 1.5rem', background: 'var(--bg-alt)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>⚙️</button>
            <button onClick={() => router.push('/')} style={{ padding: '0.5rem 1.5rem', background: 'var(--bg-alt)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>🚪</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '2rem 0' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === 'stats' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'stats' ? 'white' : 'var(--text)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            📊 Statistiques
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === 'recipes' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'recipes' ? 'white' : 'var(--text)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            🍽️ Recettes
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>Vos Statistiques</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{
                  background: 'var(--bg)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${stat.color}`,
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
                  {stat.goal && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>/ {stat.goal} kcal</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>Recettes Suggérées</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  style={baseRecipeStyle}
                  onClick={() => handleRecipeClick(recipe.id)}
                  onMouseEnter={handleRecipeHover}
                  onMouseLeave={handleRecipeLeave}
                >
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{recipe.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{recipe.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div><p style={{ color: 'var(--text-secondary)' }}>Cal</p><p style={{ fontWeight: 700, color: 'var(--primary)' }}>{recipe.cal}</p></div>
                    <div><p style={{ color: 'var(--text-secondary)' }}>Pro</p><p style={{ fontWeight: 700, color: 'var(--primary)' }}>{recipe.pro}g</p></div>
                    <div><p style={{ color: 'var(--text-secondary)' }}>Carbs</p><p style={{ fontWeight: 700, color: 'var(--primary)' }}>{recipe.carbs}g</p></div>
                    <div><p style={{ color: 'var(--text-secondary)' }}>Fat</p><p style={{ fontWeight: 700, color: 'var(--primary)' }}>{recipe.fat}g</p></div>
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
