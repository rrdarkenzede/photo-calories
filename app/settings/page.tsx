'use client'

export default function Settings() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <a href="/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '1rem' }}>← Retour au Dashboard</a>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>⚙️ Paramètres</h1>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Profil</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nom</label>
            <input type="text" defaultValue="Utilisateur" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
            <input type="email" defaultValue="user@example.com" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Objectif Calorique (kcal/jour)</label>
            <input type="number" defaultValue="2500" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
          </div>
          <button style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>💾 Enregistrer</button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d32f2f' }}>Zone de Danger</h2>
          <button style={{ width: '100%', padding: '0.75rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>🚪 Déconnexion</button>
        </div>
      </main>
    </div>
  )
}
