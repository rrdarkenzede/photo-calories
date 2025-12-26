'use client'

import { useState, useRef, useEffect } from 'react'
import { MealEntry } from '@/lib/calculations'

type ScanMode = 'choose' | 'camera' | 'upload' | 'barcode'
type Plan = 'free' | 'pro' | 'fitness'

export default function ScanModal({ 
  onClose, 
  onAdd, 
  plan 
}: { 
  onClose: () => void
  onAdd: (meal: MealEntry) => void
  plan: Plan
}) {
  const [mode, setMode] = useState<ScanMode>('choose')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string }>>([{ name: '', amount: '' }])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera error:', err)
      alert('Impossible d\'accéder à la caméra')
      setMode('choose')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        setImage(imageData)
        setMode('upload')
        stopCamera()
        analyzeFoodImage(imageData)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setImage(imageData)
        setMode('upload')
        analyzeFoodImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeFoodImage = async (imageData: string) => {
    setLoading(true)
    try {
      // Call our API route that uses Clarifai
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze image')
      }

      const data = await response.json()
      
      // Build result based on plan
      const mockResult = {
        name: data.primary.name.charAt(0).toUpperCase() + data.primary.name.slice(1),
        confidence: data.primary.confidence,
        calories: data.nutrition.calories,
        protein: plan !== 'free' ? data.nutrition.protein : undefined,
        carbs: plan !== 'free' ? data.nutrition.carbs : undefined,
        fat: plan !== 'free' ? data.nutrition.fat : undefined,
        allFoods: data.foods,
        ingredients: plan === 'fitness' ? [
          { name: data.primary.name, amount: '1 portion' },
        ] : undefined
      }
      
      setResult(mockResult)
      if (plan === 'fitness' && mockResult.ingredients) {
        setIngredients(mockResult.ingredients)
      }
    } catch (err) {
      console.error('Analysis error:', err)
      alert('Erreur lors de l\'analyse: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const analyzeBarcodeManual = async (barcode: string) => {
    setLoading(true)
    try {
      // TODO: Integrate OpenFoodFacts API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResult = {
        name: 'Coca-Cola 33cl',
        calories: 140,
        protein: plan !== 'free' ? 0 : undefined,
        carbs: plan !== 'free' ? 35 : undefined,
        fat: plan !== 'free' ? 0 : undefined,
        nutriScore: plan === 'fitness' ? 'E' : undefined,
      }
      
      setResult(mockResult)
    } catch (err) {
      console.error('Barcode error:', err)
      alert('Produit non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  const saveMeal = () => {
    if (!result) return
    
    const meal: MealEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      items: plan === 'fitness' ? ingredients.map(i => `${i.name} (${i.amount})`).filter(i => i.trim()) : [result.name]
    }
    
    onAdd(meal)
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={handleClose}>
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>Scanner un repas</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096' }}>×</button>
        </div>

        {mode === 'choose' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button onClick={() => { setMode('camera'); startCamera(); }} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              📸 Prendre une photo
            </button>
            <button onClick={() => { fileInputRef.current?.click(); }} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              📤 Upload une image
            </button>
            <button onClick={() => setMode('barcode')} style={{ padding: '1.5rem', background: 'white', color: '#1a202c', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
              🔍 Scanner un code-barres
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
        )}

        {mode === 'camera' && !image && (
          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', background: '#000' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => { stopCamera(); setMode('choose'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Annuler</button>
              <button onClick={capturePhoto} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>📸 Capturer</button>
            </div>
          </div>
        )}

        {mode === 'barcode' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#1a202c' }}>Code-barres</label>
              <input 
                type="text" 
                placeholder="Ex: 5449000054227" 
                style={{ width: '100%', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    analyzeBarcodeManual(e.currentTarget.value)
                  }
                }}
              />
            </div>
            <button onClick={() => setMode('choose')} style={{ width: '100%', padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Retour</button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            {image && <img src={image} alt="Analyzing..." style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />}
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>Analyse en cours...</div>
          </div>
        )}

        {result && !loading && (
          <div>
            {image && <img src={image} alt="Food" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />}
            
            <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '2px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>{result.name}</h3>
              {result.confidence && <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '1rem', fontWeight: 600 }}>Confiance: {result.confidence}%</p>}
              
              <div style={{ display: 'grid', gridTemplateColumns: plan === 'free' ? '1fr' : 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>Calories</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#667eea' }}>{result.calories}</div>
                </div>
                {plan !== 'free' && result.protein !== undefined && (
                  <>
                    <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>Protéines</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{result.protein}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>Glucides</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{result.carbs}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>Lipides</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{result.fat}g</div>
                    </div>
                  </>
                )}
                {plan === 'fitness' && result.nutriScore && (
                  <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>Nutri-Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a202c' }}>{result.nutriScore}</div>
                  </div>
                )}
              </div>

              {plan === 'fitness' && ingredients.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Ingrédients</h4>
                  {ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Nom" 
                        value={ing.name}
                        onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Quantité" 
                        value={ing.amount}
                        onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                      <button onClick={() => removeIngredient(i)} style={{ padding: '0.5rem', background: '#fee', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#c53030', fontWeight: 700 }}>×</button>
                    </div>
                  ))}
                  <button onClick={addIngredient} style={{ width: '100%', padding: '0.5rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#667eea', fontWeight: 700, fontSize: '0.9rem' }}>+ Ajouter un ingrédient</button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => { setResult(null); setImage(null); setMode('choose'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Recommencer</button>
              <button onClick={saveMeal} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>✓ Enregistrer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
