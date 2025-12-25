'use client'

import Link from 'next/link'

export default function Dashboard() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>PhotoCalories Dashboard</h1>
        <div>
          <button style={{ marginRight: '10px' }}>Scanner</button>
          <Link href="/settings">
            <button style={{ marginRight: '10px' }}>Paramètres</button>
          </Link>
          <Link href="/">
            <button>Déconnexion</button>
          </Link>
        </div>
      </div>

      <h2>Vos Statistiques</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Calories Aujourd'hui</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>1850</p>
          <p style={{ fontSize: '12px', color: '#999' }}>/ 2500 kcal</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Repas</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>3</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Moyenne</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>2100</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Scans Restants</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>5</p>
        </div>
      </div>

      <h2>Recettes Suggérées</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Salade Méditerranéenne</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Salade fraîche avec légumes et féta</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px', fontSize: '12px' }}>
            <div><p style={{ color: '#999' }}>Cal</p><p style={{ fontWeight: 'bold' }}>350</p></div>
            <div><p style={{ color: '#999' }}>Pro</p><p style={{ fontWeight: 'bold' }}>12g</p></div>
            <div><p style={{ color: '#999' }}>Carbs</p><p style={{ fontWeight: 'bold' }}>15g</p></div>
            <div><p style={{ color: '#999' }}>Fat</p><p style={{ fontWeight: 'bold' }}>26g</p></div>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Poulet Grillé</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Filet de poulet avec légumes rôtis</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px', fontSize: '12px' }}>
            <div><p style={{ color: '#999' }}>Cal</p><p style={{ fontWeight: 'bold' }}>450</p></div>
            <div><p style={{ color: '#999' }}>Pro</p><p style={{ fontWeight: 'bold' }}>45g</p></div>
            <div><p style={{ color: '#999' }}>Carbs</p><p style={{ fontWeight: 'bold' }}>20g</p></div>
            <div><p style={{ color: '#999' }}>Fat</p><p style={{ fontWeight: 'bold' }}>18g</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
