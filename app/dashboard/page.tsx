'use client'

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>📸 PhotoCalories</h1>
          </a>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📷 Scanner</button>
            <a href="/settings"><button style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>⚙️</button></a>
            <a href="/"><button style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>🚪</button></a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>📊 Vos Statistiques</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Calories Aujourd'hui</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>1850</p>
            <p style={{ fontSize: '0.75rem', color: '#999' }}>/ 2500 kcal</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Repas Enregistrés</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>3</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Moyenne Quotidienne</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>2100</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Scans Restants</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>5</p>
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🍳 Recettes Suggérées</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Salade Méditerranéenne</h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>Salade fraîche avec légumes et féta</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div><p style={{ color: '#999' }}>Cal</p><p style={{ fontWeight: 'bold' }}>350</p></div>
              <div><p style={{ color: '#999' }}>Pro</p><p style={{ fontWeight: 'bold' }}>12g</p></div>
              <div><p style={{ color: '#999' }}>Carbs</p><p style={{ fontWeight: 'bold' }}>15g</p></div>
              <div><p style={{ color: '#999' }}>Fat</p><p style={{ fontWeight: 'bold' }}>26g</p></div>
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Poulet Grillé</h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>Filet de poulet avec légumes rôtis</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div><p style={{ color: '#999' }}>Cal</p><p style={{ fontWeight: 'bold' }}>450</p></div>
              <div><p style={{ color: '#999' }}>Pro</p><p style={{ fontWeight: 'bold' }}>45g</p></div>
              <div><p style={{ color: '#999' }}>Carbs</p><p style={{ fontWeight: 'bold' }}>20g</p></div>
              <div><p style={{ color: '#999' }}>Fat</p><p style={{ fontWeight: 'bold' }}>18g</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
