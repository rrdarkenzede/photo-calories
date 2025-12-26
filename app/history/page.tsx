'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ScanResult {
  id: string
  image: string
  food: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: string
}

export default function History() {
  const router = useRouter()
  const [history, setHistory] = useState<ScanResult[]>([])
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    setHistory(stored)
  }, [])

  const filterHistory = () => {
    const now = new Date()
    if (filter === 'today') {
      return history.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate.toDateString() === now.toDateString()
      })
    }
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return history.filter(item => new Date(item.date) > weekAgo)
    }
    return history
  }

  const filteredHistory = filterHistory()
  const totalCalories = filteredHistory.reduce((sum, item) => sum + item.calories, 0)
  const totalProtein = filteredHistory.reduce((sum, item) => sum + item.protein, 0)

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem('scanHistory', JSON.stringify(newHistory))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => router.push('/dashboard')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>← Retour</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📊 Historique</h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      {/* Main */}
      <main className="container" style={{ padding: '2rem 0' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.75rem 1.5rem',
              background: filter === 'all' ? 'var(--primary)' : 'var(--bg)',
              color: filter === 'all' ? 'white' : 'var(--text)',
              border: filter === 'all' ? 'none' : '1px solid var(--border)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('today')}
            style={{
              padding: '0.75rem 1.5rem',
              background: filter === 'today' ? 'var(--primary)' : 'var(--bg)',
              color: filter === 'today' ? 'white' : 'var(--text)',
              border: filter === 'today' ? 'none' : '1px solid var(--border)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setFilter('week')}
            style={{
              padding: '0.75rem 1.5rem',
              background: filter === 'week' ? 'var(--primary)' : 'var(--bg)',
              color: filter === 'week' ? 'white' : 'var(--text)',
              border: filter === 'week' ? 'none' : '1px solid var(--border)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            7 derniers jours
          </button>
        </div>

        {/* Summary */}
        {filteredHistory.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Calories</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ff6b6b' }}>{totalCalories}</p>
            </div>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Protéines</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#4ecdc4' }}>{totalProtein}g</p>
            </div>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Repas Scannés</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#45b7d1' }}>{filteredHistory.length}</p>
            </div>
          </div>
        )}

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun repas scanné</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Commencez à scanner vos repas pour voir l'historique</p>
            <button
              onClick={() => router.push('/scanner')}
              style={{
                padding: '1rem 2rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📷 Scanner maintenant
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredHistory.map((item) => (
              <div key={item.id} style={{
                background: 'var(--bg)',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}>
                <img src={item.image} alt={item.food} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.food}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    <span><strong>{item.calories}</strong> kcal</span>
                    <span><strong>{item.protein}g</strong> pro</span>
                    <span><strong>{item.carbs}g</strong> carbs</span>
                    <span><strong>{item.fat}g</strong> fat</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
