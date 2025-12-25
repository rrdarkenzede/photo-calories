'use client'

import Link from 'next/link'

export default function Settings() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <Link href="/dashboard">
        <button style={{ marginBottom: '20px' }}>← Retour</button>
      </Link>
      <h1>Paramètres</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <h2>Profil</h2>
        <div style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Nom</label>
            <input type="text" defaultValue="Utilisateur" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input type="email" defaultValue="user@example.com" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Objectif Calorique</label>
            <input type="number" defaultValue="2500" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <button style={{ width: '100%', padding: '10px' }}>Enregistrer</button>
        </div>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <h2>Danger Zone</h2>
        <button style={{ width: '100%', padding: '10px', background: '#ff4444', color: 'white', marginTop: '10px' }}>Déconnexion</button>
      </div>
    </div>
  )
}
