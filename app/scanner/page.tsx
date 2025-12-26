'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

export default function Scanner() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    setScanning(true)
    // Simulation IA - remplace par vraie API Clarifai plus tard
    setTimeout(() => {
      const foods = [
        { food: 'Salade César', cal: 350, pro: 25, carbs: 15, fat: 20 },
        { food: 'Burger + Frites', cal: 850, pro: 35, carbs: 75, fat: 45 },
        { food: 'Poke Bowl', cal: 520, pro: 38, carbs: 55, fat: 12 },
        { food: 'Pizza Margherita', cal: 650, pro: 28, carbs: 70, fat: 25 },
        { food: 'Sushi Mix', cal: 420, pro: 32, carbs: 48, fat: 8 },
      ]
      const random = foods[Math.floor(Math.random() * foods.length)]
      
      const newResult: ScanResult = {
        id: Date.now().toString(),
        image: image!,
        food: random.food,
        calories: random.cal,
        protein: random.pro,
        carbs: random.carbs,
        fat: random.fat,
        date: new Date().toISOString(),
      }
      
      // Sauvegarder dans localStorage
      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]')
      history.unshift(newResult)
      localStorage.setItem('scanHistory', JSON.stringify(history))
      
      setResult(newResult)
      setScanning(false)
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => router.push('/dashboard')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>← Retour</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📷 Scanner</h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      {/* Main */}
      <main className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
        {/* Upload Zone */}
        {!image && (
          <div style={{
            border: '3px dashed var(--border)',
            borderRadius: '12px',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg)',
            cursor: 'pointer',
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📷</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ajouter une photo</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Cliquez pour sélectionner un repas à scanner</p>
            </label>
          </div>
        )}

        {/* Image Preview + Analysis */}
        {image && (
          <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={image} alt="Food" style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem' }} />
            
            {!result && !scanning && (
              <button
                onClick={analyzeImage}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🤖 Analyser avec l'IA
              </button>
            )}

            {scanning && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>🔍</div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Analyse en cours...</p>
              </div>
            )}

            {result && (
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>✅ {result.food}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Calories</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ff6b6b' }}>{result.calories}</p>
                  </div>
                  <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Protéines</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#4ecdc4' }}>{result.protein}g</p>
                  </div>
                  <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Glucides</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#45b7d1' }}>{result.carbs}g</p>
                  </div>
                  <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Lipides</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#96ceb4' }}>{result.fat}g</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setImage(null)
                    setResult(null)
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-alt)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  📷 Scanner un autre repas
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
