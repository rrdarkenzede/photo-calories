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
      
      const detectedIngredients = data.ingredients
        .filter((ing: any) => ing.confidence > 40)
        .map((ing: any) => ({
          name: ing.name,
          amount: '100g',
        }))
      
      const mockResult = {
        name: data.primary.name.charAt(0).toUpperCase() + data.primary.name.slice(1),
        confidence: data.primary.confidence,
        calories: data.nutrition.calories,
        protein: plan !== 'free' ? data.nutrition.protein : undefined,
        carbs: plan !== 'free' ? data.nutrition.carbs : undefined,
        fat: plan !== 'free' ? data.nutrition.fat : undefined,
        sugars: plan === 'fitness' ? data.nutrition.sugars : undefined,
        fiber: plan === 'fitness' ? data.nutrition.fiber : undefined,
        sodium: plan === 'fitness' ? data.nutrition.sodium : undefined,
        allFoods: data.foods,
        ingredients: detectedIngredients,
      }
      
      setResult(mockResult)
      if (plan === 'fitness' && detectedIngredients.length > 0) {
        setIngredients(detectedIngredients)
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResult = {
        name: 'Coca-Cola 33cl',
        calories: 140,
        protein: plan !== 'free' ? 0 : undefined,
        carbs: plan !== 'free' ? 35 : undefined,
        fat: plan !== 'free' ? 0 : undefined,
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
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '95vh', overflow: 'auto', padding: '1.5rem', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', margin: 0, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Scanner un repas</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096', flexShrink: 0, padding: 0 }}>×</button>
        </div>

        {mode === 'choose' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button onClick={() => { setMode('camera'); startCamera(); }} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              📷 Prendre une photo
            </button>
            <button onClick={() => { fileInputRef.current?.click(); }} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              📤 Upload une image
            </button>
            <button onClick={() => setMode('barcode')} style={{ padding: '1.2rem', background: 'white', color: '#1a202c', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              🔍 Scanner un code-barres
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
        )}

        {mode === 'camera' && !image && (
          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', background: '#000', display: 'block' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => { stopCamera(); setMode('choose'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Annuler</button>
              <button onClick={capturePhoto} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>📷 Capturer</button>
            </div>
          </div>
        )}

        {mode === 'barcode' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#1a202c', fontSize: '0.95rem' }}>Code-barres</label>
              <input 
                type="text" 
                placeholder="Ex: 5449000054227" 
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
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
            {image && <img src={image} alt="Analyzing..." style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />}
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c' }}>Analyse en cours...</div>
          </div>
        )}

        {result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {image && <img src={image} alt="Food" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />}
            
            <div style={{ background: '#f7fafc', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem', margin: 0 }}>{result.name}</h3>
              {result.confidence && (
                <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '1rem', fontWeight: 600, margin: '0.5rem 0 1rem 0', wordBreak: 'break-word' }}>
                  Confiance: {result.confidence}%
                </p>
              )}
              {result.allFoods && result.allFoods.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '1rem', fontWeight: 500, margin: '0 0 1rem 0', wordBreak: 'break-word' }}>
                  Contient: {result.allFoods.slice(0, 5).map((f: any) => f.name).join(', ')}{result.allFoods.length > 5 ? '...' : ''}
                </p>
              )}
              
              {/* Calories Main Display */}
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.3rem' }}>CALORIES</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{result.calories}</div>
              </div>

              {/* Macros Grid - Responsive */}
              {plan !== 'free' && result.protein !== undefined && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>PROTÉINES</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{result.protein}g</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>GLUCIDES</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{result.carbs}g</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>LIPIDES</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{result.fat}g</div>
                  </div>
                </div>
              )}

              {/* Micros for Fitness Plan */}
              {plan === 'fitness' && result.sugars !== undefined && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SUCRES</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{result.sugars}g</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>FIBRES</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{result.fiber}g</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SODIUM</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{result.sodium}mg</div>
                  </div>
                </div>
              )}

              {/* Ingredients for Fitness Plan */}
              {plan === 'fitness' && ingredients.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.6rem', margin: 0 }}>Ingrédients détectés</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '150px', overflowY: 'auto' }}>
                    {ingredients.slice(0, 3).map((ing, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr auto', gap: '0.4rem', alignItems: 'center', minWidth: 0 }}>
                        <input 
                          type="text" 
                          placeholder="Nom" 
                          value={ing.name}
                          onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                          style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', minWidth: 0, boxSizing: 'border-box' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Quantité" 
                          value={ing.amount}
                          onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                          style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', minWidth: 0, boxSizing: 'border-box' }}
                        />
                        <button onClick={() => removeIngredient(i)} style={{ padding: '0.4rem 0.6rem', background: '#fee', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#c53030', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                  {ingredients.length > 3 && (
                    <div style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '0.3rem' }}>+{ingredients.length - 3} plus</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <button onClick={() => { setResult(null); setImage(null); setMode('choose'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c', fontSize: '0.95rem' }}>Recommencer</button>
              <button onClick={saveMeal} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>✓ Enregistrer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
