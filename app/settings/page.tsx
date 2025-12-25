'use client'

import { useState, CSSProperties } from 'react'

export default function Settings() {
  const [formData, setFormData] = useState({ name: 'Utilisateur', email: 'user@example.com', goal: 2500 })
  const [saved, setSaved] = useState(false)

  const goToDashboard = () => window.location.href = '/dashboard'
  const goToHome = () => window.location.href = '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'goal' ? parseInt(value) : value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container">
          <button onClick={goToDashboard} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', textDecoration: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>← Retour</button>
        </div>
      </header>

      {/* Main */}
      <main className="container" style={{ padding: '3rem 0', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 700 }}>⚙️ Paramètres</h1>

        {/* Profile Section */}
        <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Profil</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Objectif Calorique (kcal/jour)</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
          >
            💾 Enregistrer
          </button>
          {saved && <p style={{ marginTop: '1rem', color: '#4caf50', fontWeight: 600, textAlign: 'center' }}>✓ Paramètres enregistrés avec succès!</p>}
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--danger)', boxShadow: '0 2px 8px rgba(211,47,47,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600, color: 'var(--danger)' }}>Zone de Danger</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Une fois déconnecté, vous devrez vous authentifier à nouveau.</p>
          <button
            onClick={goToHome}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--danger)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger)')}
          >
            🚪 Déconnexion
          </button>
        </div>
      </main>
    </div>
  )
}
