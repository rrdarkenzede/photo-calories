export default function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PhotoCalories</h1>
      <p>Bienvenue!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ marginRight: '10px' }}>
          <button>Scanner un repas</button>
        </a>
        <a href="/dashboard">
          <button>Voir mes stats</button>
        </a>
      </div>
      <h2 style={{ marginTop: '40px' }}>Plans</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Gratuit</h3>
          <p>0€</p>
          <button onClick={() => alert('Plan Gratuit sélectionné')}>Choisir</button>
        </div>
        <div style={{ border: '2px solid blue', padding: '20px' }}>
          <h3>Pro</h3>
          <p>9.99€/mois</p>
          <button onClick={() => alert('Plan Pro sélectionné')}>Choisir</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Fitness</h3>
          <p>19.99€/mois</p>
          <button onClick={() => alert('Plan Fitness sélectionné')}>Choisir</button>
        </div>
      </div>
    </div>
  )
}
