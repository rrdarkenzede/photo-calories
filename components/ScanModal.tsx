'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { MealEntry } from '@/lib/calculations'

type ScanMode = 'choose-photo' | 'camera' | 'barcode-choose' | 'barcode-input' | 'barcode-camera' | 'search-name' | 'search-results' | 'result'
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
  const [mode, setMode] = useState<ScanMode>('barcode-choose')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; nutrition?: any }>>([{ name: '', amount: '100g' }])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const cameraReadyRef = useRef(false)

  useEffect(() => {
    console.log('🎉 ScanModal mounted! Tab:', tab, 'Mode:', mode)
    return () => {
      console.log('🧹 ScanModal unmounting')
    }
  }, [])

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

  const stopAllStreams = () => {
    console.log('🛑 Stopping all streams...')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('  └─ Stopping track:', track.kind)
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    cameraReadyRef.current = false
  }

  const startCamera = async (callback: () => void) => {
    stopAllStreams()
    
    try {
      console.log('📱 Requesting camera permission...')
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      console.log('✅ Camera granted')
      streamRef.current = mediaStream
      
      if (videoRef.current) {
        console.log('  └─ Attaching stream to video element')
        videoRef.current.srcObject = mediaStream
        videoRef.current.play().then(() => {
          console.log('  └─ Video playing')
        }).catch(err => console.error('  └─ Play error:', err))
        
        const onLoadedMetadata = () => {
          console.log('✅ Video metadata loaded:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
          cameraReadyRef.current = true
          videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata)
          callback()
        }
        
        videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata)
        
        const timeout = setTimeout(() => {
          if (!cameraReadyRef.current) {
            console.log('⚠️  Camera ready timeout - proceeding anyway')
            cameraReadyRef.current = true
            callback()
          }
        }, 3000)
        
        videoRef.current.addEventListener('loadedmetadata', () => clearTimeout(timeout), { once: true })
      }
    } catch (err) {
      console.error('❌ Camera error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      alert(`Camera error:\n${errorMsg}`)
      stopAllStreams()
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReadyRef.current) {
      alert('Camera not ready')
      return
    }
    
    if (videoRef.current.videoWidth === 0) {
      alert('Empty video')
      return
    }
    
    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        setImage(imageData)
        stopAllStreams()
        analyzeFoodImage(imageData)
      }
    } catch (err) {
      console.error('Capture error:', err)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setImage(imageData)
        stopAllStreams()
        setShowPhotoOptions(false)
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
        throw new Error('Failed to analyze')
      }

      const data = await response.json()
      const detectedIngredients = data.ingredients?.filter((ing: any) => ing.confidence > 40) || []
      
      const mockResult = {
        name: data.primary?.name || 'Food Item',
        confidence: data.primary?.confidence,
        calories: data.nutrition?.calories || 0,
        protein: data.nutrition?.protein,
        carbs: data.nutrition?.carbs,
        fat: data.nutrition?.fat,
        sugars: data.nutrition?.sugars,
        fiber: data.nutrition?.fiber,
        sodium: data.nutrition?.sodium,
        ingredients: detectedIngredients,
        type: 'photo',
      }
      
      setResult(mockResult)
      if (plan === 'fitness' && detectedIngredients.length > 0) {
        setIngredients(detectedIngredients.map((ing: any) => ({ name: ing.name, amount: '100g', nutrition: ing.nutrition })))
      }
      setMode('result')
    } catch (err) {
      alert('Analysis error: ' + (err instanceof Error ? err.message : 'Unknown'))
      setLoading(false)
    }
  }

  const searchByName = async (name: string) => {
    if (!name.trim()) {
      setSearchResults([])
      return
    }

    console.log(`🔍 Searching for: ${name}`)
    setLoading(true)
    
    try {
      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()
      console.log(`✅ Got ${data.products?.length || 0} results`)
      
      setSearchResults(data.products || [])
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchInput(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(() => {
        searchByName(value)
      }, 500)
    } else {
      setSearchResults([])
    }
  }

  const selectProduct = (product: any) => {
    const mockResult = {
      name: product.name,
      brand: product.brand,
      image: product.image,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
      servingSize: product.servingSize,
      type: 'search',
    }
    
    setResult(mockResult)
    setMode('result')
  }

  const searchBarcode = async (barcode: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })

      if (!response.ok) throw new Error('Not found')

      const product = await response.json()
      const mockResult = {
        name: product.name,
        brand: product.brand,
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
        type: 'barcode',
      }
      
      setResult(mockResult)
      setMode('result')
      setBarcodeInput('')
    } catch (err) {
      alert('Product not found')
    } finally {
      setLoading(false)
    }
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
      items: [result.name]
    }
    
    onAdd(meal)
  }

  const handleClose = () => {
    stopAllStreams()
    onClose()
  }

  const resetAll = () => {
    stopAllStreams()
    setResult(null)
    setImage(null)
    setIngredients([{ name: '', amount: '100g' }])
    setBarcodeInput('')
    setSearchInput('')
    setSearchResults([])
    setShowPhotoOptions(false)
    setMode(tab === 'barcode' ? 'barcode-choose' : 'choose-photo')
  }

  const switchTab = (newTab: Tab) => {
    stopAllStreams()
    setTab(newTab)
    setResult(null)
    setImage(null)
    setBarcodeInput('')
    setSearchInput('')
    setSearchResults([])
    setShowPhotoOptions(false)
    setMode(newTab === 'barcode' ? 'barcode-choose' : 'choose-photo')
  }

  useEffect(() => {
    return () => {
      stopAllStreams()
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  const displayNutrition = calculatedNutrition || {
    calories: result?.calories || 0,
    protein: result?.protein || 0,
    carbs: result?.carbs || 0,
    fat: result?.fat || 0,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={handleClose}>
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '95vh', overflow: 'auto', padding: '0', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>Scanner un repas</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096', padding: 0 }}>×</button>
        </div>

        {/* Tabs */}
        {!result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '2px solid #e2e8f0' }}>
            <button onClick={() => switchTab('barcode')} style={{ padding: '1rem', background: tab === 'barcode' ? '#667eea' : 'white', color: tab === 'barcode' ? 'white' : '#1a202c', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              🔍 Barcode
            </button>
            <button onClick={() => switchTab('analysis')} style={{ padding: '1rem', background: tab === 'analysis' ? '#667eea' : 'white', color: tab === 'analysis' ? 'white' : '#1a202c', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              📸 Photo
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '1.5rem', minHeight: '300px', maxHeight: 'calc(95vh - 200px)', overflow: 'auto' }}>
          
          {/* BARCODE - SEARCH BY NAME */}
          {tab === 'barcode' && mode === 'barcode-choose' && !result && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Cherche par nom</h3>
              <input 
                type="text" 
                placeholder="Ex: Coca, Banane, Yaourt..." 
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1rem' }}
                autoFocus
              />
              
              {loading && (
                <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>⏳ Recherche en cours...</div>
              )}
              
              {!loading && searchResults.length > 0 && (
                <div style={{ display: 'grid', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {searchResults.map((product, i) => (
                    <button
                      key={i}
                      onClick={() => selectProduct(product)}
                      style={{ padding: '1rem', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#667eea'
                        e.currentTarget.style.background = '#f0f4ff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0'
                        e.currentTarget.style.background = '#f7fafc'
                      }}
                    >
                      {product.image && (
                        <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', float: 'left', marginRight: '0.8rem', marginBottom: '0.5rem' }} />
                      )}
                      <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>{product.name}</div>
                      {product.brand && (
                        <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.3rem' }}>Par: {product.brand}</div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: '#667eea', fontWeight: 600 }}>{Math.round(product.calories)} cal</div>
                    </button>
                  ))}
                </div>
              )}
              
              {!loading && searchInput.trim().length > 1 && searchResults.length === 0 && (
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center', color: '#718096' }}>
                  Aucun résultat pour "{searchInput}"
                </div>
              )}
              
              {searchInput.trim().length === 0 && searchResults.length === 0 && (
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                  Commence à écrire pour chercher...
                </div>
              )}
            </div>
          )}

          {/* BARCODE - MANUAL INPUT */}
          {tab === 'barcode' && mode === 'barcode-input' && !result && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Entrez le code EAN</h3>
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
                <button onClick={() => setMode('barcode-choose')} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Retour</button>
                <button onClick={() => { if (barcodeInput.trim()) searchBarcode(barcodeInput) }} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>🔍 Chercher</button>
              </div>
            </div>
          )}

          {/* ANALYSIS - PHOTO CHOOSE */}
          {tab === 'analysis' && mode === 'choose-photo' && !result && (
            <div>
              <button 
                onClick={() => setShowPhotoOptions(!showPhotoOptions)} 
                style={{ width: '100%', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1rem' }}
              >
                📸 {showPhotoOptions ? 'Fermer' : 'Prendre une photo'}
              </button>
              
              {showPhotoOptions && (
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <button onClick={() => startCamera(() => setMode('camera'))} style={{ padding: '1rem', background: 'white', border: '2px solid #667eea', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#667eea' }}>
                    📱 Utiliser la caméra
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: '1rem', background: 'white', border: '2px solid #667eea', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#667eea' }}>
                    📁 Upload une image
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </div>
              )}
            </div>
          )}

          {/* CAMERA MODE */}
          {mode === 'camera' && !image && (
            <div>
              <div style={{ position: 'relative', marginBottom: '1rem', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button onClick={() => { stopAllStreams(); resetAll(); }} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Annuler</button>
                <button onClick={capturePhoto} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>📸 Capturer</button>
              </div>
            </div>
          )}

          {/* RESULT */}
          {result && mode === 'result' && (
            <div>
              {image && <img src={image} alt="Food" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />}
              
              <div style={{ background: '#f7fafc', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a202c', margin: 0, marginBottom: '1rem' }}>{result.name}</h3>
                
                {result.brand && (
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500, margin: 0, marginBottom: '0.5rem' }}>Par: {result.brand}</p>
                )}
                
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.3rem' }}>CALORIES</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{Math.round(displayNutrition.calories)}</div>
                </div>

                {plan !== 'free' && displayNutrition.protein !== undefined && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>PROTÉINES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{Math.round(displayNutrition.protein * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>GLUCIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{Math.round(displayNutrition.carbs * 10) / 10}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>LIPIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{Math.round(displayNutrition.fat * 10) / 10}g</div>
                    </div>
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
