'use client'

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📸 PhotoCalories</h1>
        <p style={{ color: '#666' }}>Nutrition par IA</p>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Suivez votre nutrition avec l'IA</h2>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>Scannez vos repas pour un suivi automatique</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/dashboard">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              📷 Scanner un repas
            </button>
          </a>
          <a href="/dashboard">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'white', color: '#0070f3', border: '2px solid #0070f3', borderRadius: '8px', cursor: 'pointer' }}>
              📊 Voir mes stats
            </button>
          </a>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Fonctionnalités</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📷</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Scan Photo</h4>
            <p style={{ color: '#666' }}>IA de reconnaissance alimentaire</p>
          </div>
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Statistiques</h4>
            <p style={{ color: '#666' }}>Suivi de vos calories</p>
          </div>
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Recettes</h4>
            <p style={{ color: '#666' }}>Vos recettes favorites</p>
          </div>
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Coach IA</h4>
            <p style={{ color: '#666' }}>Conseils personnalisés</p>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Plans</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gratuit</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>0€</div>
            <ul style={{ textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <li>✅ 5 scans/jour</li>
              <li>✅ Historique 7 jours</li>
              <li>❌ Recettes</li>
            </ul>
            <button onClick={() => alert('Plan Gratuit sélectionné!')} style={{ padding: '0.75rem 2rem', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>Choisir</button>
          </div>
          
          <div style={{ padding: '2rem', border: '3px solid #0070f3', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0070f3', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.875rem' }}>Populaire</div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pro</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>9.99€<span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/mois</span></div>
            <ul style={{ textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <li>✅ Scans illimités</li>
              <li>✅ Historique 30 jours</li>
              <li>✅ Recettes personnalisées</li>
            </ul>
            <button onClick={() => alert('Plan Pro sélectionné!')} style={{ padding: '0.75rem 2rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>Choisir</button>
          </div>
          
          <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Fitness</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>19.99€<span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/mois</span></div>
            <ul style={{ textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <li>✅ Tout Pro</li>
              <li>✅ Historique illimité</li>
              <li>✅ Coach IA personnel</li>
            </ul>
            <button onClick={() => alert('Plan Fitness sélectionné!')} style={{ padding: '0.75rem 2rem', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>Choisir</button>
          </div>
        </div>
      </section>
    </div>
  )
}
