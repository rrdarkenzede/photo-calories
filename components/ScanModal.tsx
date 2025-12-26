'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { MealEntry } from '@/lib/calculations'

type ScanMode = 'choose-photo' | 'camera' | 'upload' | 'choose-barcode' | 'barcode-camera' | 'barcode-input' | 'result'
type Tab = 'barcode' | 'analysis'
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
  const [tab, setTab] = useState<Tab>('barcode')
  const [mode, setMode] = useState<ScanMode>('choose-barcode')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; nutrition?: any }>>([{ name: '', amount: '100g' }])
  const [barcodeInput, setBarcodeInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [barcodeStream, setBarcodeStream] = useState<MediaStream | null>(null)

  const calculatedNutrition = useMemo(() => {
    if (!result || !ingredients.length) return null

    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, sugars: 0, fiber: 0, sodium: 0 }

    ingredients.forEach(ing => {
      if (!ing.name || !ing.nutrition) return

      const amountMatch = ing.amount.match(/(\d+)/)
      const amount = amountMatch ? parseInt(amountMatch[1]) : 100
      const multiplier = amount / 100

      totals.calories += Math.round(ing.nutrition.calories * multiplier)
      totals.protein += Math.round(ing.nutrition.protein * multiplier * 10) / 10
      totals.carbs += Math.round(ing.nutrition.carbs * multiplier * 10) / 10
      totals.fat += Math.round(ing.nutrition.fat * multiplier * 10) / 10
      totals.sugars += (ing.nutrition.sugars || 0) * multiplier
      totals.fiber += (ing.nutrition.fiber || 0) * multiplier
      totals.sodium += (ing.nutrition.sodium || 0) * multiplier
    })

    return totals
  }, [ingredients, result])

  const startPhotoCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setMode('camera')
    } catch (err) {
      console.error('Camera error:', err)
      alert('Impossible d\'accéder à la caméra')
    }
  }

  const startBarcodeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setBarcodeStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setMode('barcode-camera')
      // Start barcode detection
      scanBarcodeFrame(mediaStream)
    } catch (err) {
      console.error('Camera error:', err)
      alert('Impossible d\'accéder à la caméra')
    }
  }

  const scanBarcodeFrame = (mediaStream: MediaStream) => {
    if (!videoRef.current || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const video = videoRef.current
    canvasRef.current.width = video.videoWidth
    canvasRef.current.height = video.videoHeight

    const scan = async () => {
      if (mode !== 'barcode-camera') return

      ctx.drawImage(video, 0, 0)
      const imageData = canvasRef.current!.toDataURL('image/jpeg')

      try {
        // Try to decode using jsBarcode or similar
        // For now, use the uploaded image
        const response = await fetch('/api/decode-barcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.barcode) {
            stopBarcodeCamera()
            searchBarcode(data.barcode)
            return
          }
        }
      } catch (err) {
        console.error('Barcode detection error:', err)
      }

      requestAnimationFrame(scan)
    }

    scan()
  }

  const stopPhotoCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const stopBarcodeCamera = () => {
    if (barcodeStream) {
      barcodeStream.getTracks().forEach(track => track.stop())
      setBarcodeStream(null)
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
        stopPhotoCamera()
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
          nutrition: ing.nutrition,
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
        type: 'photo',
      }
      
      setResult(mockResult)
      if (plan === 'fitness' && detectedIngredients.length > 0) {
        setIngredients(detectedIngredients)
      }
      setMode('result')
    } catch (err) {
      console.error('Analysis error:', err)
      alert('Erreur lors de l\'analyse: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setLoading(false)
    }
  }

  const searchBarcode = async (barcode: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })

      if (!response.ok) {
        throw new Error('Product not found')
      }

      const product = await response.json()
      
      const mockResult = {
        name: product.name,
        brand: product.brand,
        image: product.image,
        code: barcode,
        calories: product.calories,
        protein: plan !== 'free' ? product.protein : undefined,
        carbs: plan !== 'free' ? product.carbs : undefined,
        fat: plan !== 'free' ? product.fat : undefined,
        sugars: plan === 'fitness' ? product.sugars : undefined,
        fiber: plan === 'fitness' ? product.fiber : undefined,
        sodium: plan === 'fitness' ? product.sodium : undefined,
        servingSize: product.servingSize,
        type: 'barcode',
      }
      
      setResult(mockResult)
      setMode('result')
      setBarcodeInput('')
    } catch (err) {
      console.error('Barcode error:', err)
      alert('Produit non trouvé dans Open Food Facts')
    } finally {
      setLoading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '100g' }])
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
    
    const finalNutrition = calculatedNutrition || {
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    }
    
    const meal: MealEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: result.name,
      calories: finalNutrition.calories,
      protein: finalNutrition.protein,
      carbs: finalNutrition.carbs,
      fat: finalNutrition.fat,
      items: [result.name]
    }
    
    onAdd(meal)
  }

  const handleClose = () => {
    stopPhotoCamera()
    stopBarcodeCamera()
    onClose()
  }

  const resetAll = () => {
    stopPhotoCamera()
    stopBarcodeCamera()
    setResult(null)
    setImage(null)
    setIngredients([{ name: '', amount: '100g' }])
    setBarcodeInput('')
    if (tab === 'barcode') {
      setMode('choose-barcode')
    } else {
      setMode('choose-photo')
    }
  }

  const switchTab = (newTab: Tab) => {
    stopPhotoCamera()
    stopBarcodeCamera()
    setTab(newTab)
    setResult(null)
    setImage(null)
    setBarcodeInput('')
    if (newTab === 'barcode') {
      setMode('choose-barcode')
    } else {
      setMode('choose-photo')
    }
  }

  useEffect(() => {
    return () => {
      stopPhotoCamera()
      stopBarcodeCamera()
    }
  }, [])

  const displayNutrition = calculatedNutrition || {
    calories: result?.calories || 0,
    protein: result?.protein || 0,
    carbs: result?.carbs || 0,
    fat: result?.fat || 0,
    sugars: result?.sugars || 0,
    fiber: result?.fiber || 0,
    sodium: result?.sodium || 0,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={handleClose}>
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '95vh', overflow: 'auto', padding: '0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>Scanner un repas</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096', padding: 0 }}>×</button>
        </div>

        {/* Tabs */}
        {!result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '2px solid #e2e8f0' }}>
            <button
              onClick={() => switchTab('barcode')}
              style={{
                padding: '1rem',
                background: tab === 'barcode' ? '#667eea' : 'white',
                color: tab === 'barcode' ? 'white' : '#1a202c',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              🏷️ Code-barres
            </button>
            <button
              onClick={() => switchTab('analysis')}
              style={{
                padding: '1rem',
                background: tab === 'analysis' ? '#667eea' : 'white',
                color: tab === 'analysis' ? 'white' : '#1a202c',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              📸 Analyse photo
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          
          {/* BARCODE TAB - CHOOSE MODE */}
          {tab === 'barcode' && mode === 'choose-barcode' && !result && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button onClick={startBarcodeCamera} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                📱 Scanner avec caméra
              </button>
              <button onClick={() => setMode('barcode-input')} style={{ padding: '1.2rem', background: 'white', color: '#1a202c', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                ⌨️ Entrer manuellement
              </button>
            </div>
          )}

          {/* BARCODE TAB - MANUAL INPUT */}
          {tab === 'barcode' && mode === 'barcode-input' && !result && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1rem', marginTop: 0 }}>Entré le code EAN du produit</h3>
              <input 
                type="text" 
                placeholder="Ex: 3017620422003" 
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && barcodeInput.trim()) {
                    searchBarcode(barcodeInput)
                  }
                }}
                autoFocus
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => setMode('choose-barcode')}
                  style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}
                >
                  Retour
                </button>
                <button 
                  onClick={() => {
                    if (barcodeInput.trim()) {
                      searchBarcode(barcodeInput)
                    }
                  }}
                  style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  🔍 Chercher
                </button>
              </div>
            </div>
          )}

          {/* BARCODE CAMERA */}
          {mode === 'barcode-camera' && !result && (
            <div>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', background: '#000', display: 'block' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button onClick={() => { stopBarcodeCamera(); setMode('choose-barcode'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Annuler</button>
                <div style={{ padding: '1rem', background: '#667eea20', borderRadius: '12px', fontWeight: 700, color: '#667eea', textAlign: 'center', fontSize: '0.9rem' }}>En attente du code...</div>
              </div>
            </div>
          )}

          {/* ANALYSIS TAB */}
          {tab === 'analysis' && mode === 'choose-photo' && !result && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button onClick={startPhotoCamera} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                📷 Prendre une photo
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                📂 Upload une image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
          )}

          {/* PHOTO CAMERA */}
          {mode === 'camera' && !image && (
            <div>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', background: '#000', display: 'block' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button onClick={() => { stopPhotoCamera(); setMode('choose-photo'); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Annuler</button>
                <button onClick={capturePhoto} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>📸 Capturer</button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c' }}>Recherche en cours...</div>
            </div>
          )}

          {/* RESULT */}
          {result && mode === 'result' && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {image && <img src={image} alt="Food" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />}
              {result.image && !image && <img src={result.image} alt={result.name} style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />}
              
              <div style={{ background: '#f7fafc', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a202c', margin: 0, marginBottom: '0.5rem' }}>{result.name}</h3>
                {result.brand && (
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500, margin: 0, marginBottom: '0.5rem' }}>Par: {result.brand}</p>
                )}
                {result.confidence && (
                  <p style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600, margin: 0, marginBottom: '1rem' }}>Confiance: {result.confidence}%</p>
                )}
                {result.servingSize && (
                  <p style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 500, margin: 0, marginBottom: '1rem' }}>Portion: {result.servingSize}</p>
                )}
                
                {/* CALORIES */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.3rem' }}>CALORIES</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{Math.round(displayNutrition.calories)}</div>
                </div>

                {/* MACROS */}
                {plan !== 'free' && displayNutrition.protein !== undefined && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>PROTÉINES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{Math.round(displayNutrition.protein * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>GLUCIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{Math.round(displayNutrition.carbs * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>LIPIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{Math.round(displayNutrition.fat * 10) / 10}g</div>
                    </div>
                  </div>
                )}

                {/* MICROS */}
                {plan === 'fitness' && displayNutrition.sugars !== undefined && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SUCRES</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{Math.round(displayNutrition.sugars * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>FIBRES</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{Math.round(displayNutrition.fiber * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SODIUM</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{Math.round(displayNutrition.sodium)}mg</div>
                    </div>
                  </div>
                )}

                {/* INGREDIENTS TABLE - ANALYSIS ONLY */}
                {plan === 'fitness' && result.type === 'photo' && ingredients.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a202c', margin: 0, marginBottom: '0.6rem' }}>Ingrédients détectés</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                      {ingredients.map((ing, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr auto', gap: '0.4rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                          <input 
                            type="text" 
                            placeholder="Nom" 
                            value={ing.name}
                            onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                            style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                          />
                          <input 
                            type="text" 
                            placeholder="100g" 
                            value={ing.amount}
                            onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                            style={{ padding: '0.4rem', border: '1px solid #667eea', borderRadius: '6px', fontSize: '0.85rem', boxSizing: 'border-box', background: '#f0f4ff' }}
                          />
                          <button onClick={() => removeIngredient(i)} style={{ padding: '0.3rem 0.5rem', background: '#fee', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#c53030', fontWeight: 700, fontSize: '0.85rem' }}>×</button>
                        </div>
                      ))}
                    </div>
                    {ingredients.length > 3 && (
                      <button onClick={addIngredient} style={{ width: '100%', padding: '0.5rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#667eea', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' }}>+ Ajouter</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && mode === 'result' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', padding: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
            <button onClick={resetAll} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Recommencer</button>
            <button onClick={saveMeal} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>✓ Enregistrer</button>
          </div>
        )}
      </div>
    </div>
  )
}
