'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { MealEntry } from '@/lib/calculations'

type ScanMode = 'choose-photo' | 'camera' | 'barcode-choose' | 'barcode-input' | 'search-results' | 'result'
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
  const [quantity, setQuantity] = useState('100')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const cameraReadyRef = useRef(false)

  const stopAllStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      })
      
      streamRef.current = mediaStream
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play().catch(err => console.error('Play error:', err))
        
        const onLoadedMetadata = () => {
          cameraReadyRef.current = true
          videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata)
          callback()
        }
        
        videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata)
        
        setTimeout(() => {
          if (!cameraReadyRef.current) {
            cameraReadyRef.current = true
            callback()
          }
        }, 3000)
      }
    } catch (err) {
      alert('Erreur caméra: ' + (err instanceof Error ? err.message : 'Erreur'))
      stopAllStreams()
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReadyRef.current) {
      alert('La caméra n\'est pas prête')
      return
    }
    
    if (videoRef.current.videoWidth === 0) {
      alert('Image vide')
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

      if (!response.ok) throw new Error('Erreur analyse')

      const data = await response.json()
      
      const mockResult = {
        name: data.primary?.name || 'Aliment',
        confidence: data.primary?.confidence || 0,
        calories: Math.round(data.nutrition?.calories || 0),
        protein: Math.round((data.nutrition?.protein || 0) * 10) / 10,
        carbs: Math.round((data.nutrition?.carbs || 0) * 10) / 10,
        fat: Math.round((data.nutrition?.fat || 0) * 10) / 10,
        sugars: Math.round((data.nutrition?.sugars || 0) * 10) / 10,
        fiber: Math.round((data.nutrition?.fiber || 0) * 10) / 10,
        sodium: Math.round((data.nutrition?.sodium || 0) * 1000),
        type: 'photo',
      }
      
      setResult(mockResult)
      setMode('result')
      setLoading(false)
    } catch (err) {
      alert('Erreur analyse: ' + (err instanceof Error ? err.message : 'Erreur'))
      setLoading(false)
    }
  }

  const searchByName = async (name: string) => {
    if (!name.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()
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
      brand: product.brand || '',
      image: product.image || null,
      calories: Math.round(product.calories || 0),
      protein: Math.round((product.protein || 0) * 10) / 10,
      carbs: Math.round((product.carbs || 0) * 10) / 10,
      fat: Math.round((product.fat || 0) * 10) / 10,
      sugars: Math.round((product.sugars || 0) * 10) / 10,
      fiber: Math.round((product.fiber || 0) * 10) / 10,
      sodium: Math.round((product.sodium || 0) * 1000),
      servingSize: product.servingSize || '100g',
      type: 'search',
    }
    
    setResult(mockResult)
    setQuantity('100')
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

      if (!response.ok) throw new Error('Produit non trouvé')

      const product = await response.json()
      const mockResult = {
        name: product.name || 'Produit',
        brand: product.brand || '',
        image: product.image || null,
        calories: Math.round(product.calories || 0),
        protein: Math.round((product.protein || 0) * 10) / 10,
        carbs: Math.round((product.carbs || 0) * 10) / 10,
        fat: Math.round((product.fat || 0) * 10) / 10,
        sugars: Math.round((product.sugars || 0) * 10) / 10,
        fiber: Math.round((product.fiber || 0) * 10) / 10,
        sodium: Math.round((product.sodium || 0) * 1000),
        servingSize: product.servingSize || '100g',
        type: 'barcode',
      }
      
      setResult(mockResult)
      setQuantity('100')
      setMode('result')
      setBarcodeInput('')
    } catch (err) {
      alert('Produit non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const calculateNutrition = () => {
    if (!result) return result
    const q = parseInt(quantity) || 100
    const multiplier = q / 100
    return {
      ...result,
      calories: Math.round(result.calories * multiplier),
      protein: Math.round((result.protein * multiplier) * 10) / 10,
      carbs: Math.round((result.carbs * multiplier) * 10) / 10,
      fat: Math.round((result.fat * multiplier) * 10) / 10,
      sugars: Math.round((result.sugars * multiplier) * 10) / 10,
      fiber: Math.round((result.fiber * multiplier) * 10) / 10,
      sodium: Math.round((result.sodium * multiplier) * 1000) / 1000,
    }
  }

  const saveMeal = () => {
    const finalResult = calculateNutrition()
    if (!finalResult) return
    
    const meal: MealEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: finalResult.name,
      calories: finalResult.calories,
      protein: plan !== 'free' ? finalResult.protein : undefined,
      carbs: plan !== 'free' ? finalResult.carbs : undefined,
      fat: plan !== 'free' ? finalResult.fat : undefined,
      items: [finalResult.name]
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
    setQuantity('100')
    setBarcodeInput('')
    setSearchInput('')
    setSearchResults([])
    setMode(tab === 'barcode' ? 'barcode-choose' : 'barcode-choose')
  }

  const switchTab = (newTab: Tab) => {
    stopAllStreams()
    setTab(newTab)
    setResult(null)
    setImage(null)
    setQuantity('100')
    setBarcodeInput('')
    setSearchInput('')
    setSearchResults([])
    setMode('barcode-choose')
  }

  useEffect(() => {
    return () => {
      stopAllStreams()
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  const displayNutrition = calculateNutrition()

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={handleClose}>
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '95vh', overflow: 'auto', padding: '0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '2px solid #e2e8f0', flexShrink: 0 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>Scanner un repas</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096', padding: 0 }}>×</button>
        </div>

        {/* Tabs */}
        {!result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '2px solid #e2e8f0', flexShrink: 0 }}>
            <button onClick={() => switchTab('barcode')} style={{ padding: '1rem', background: tab === 'barcode' ? '#667eea' : 'white', color: tab === 'barcode' ? 'white' : '#1a202c', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              🔍 Chercher
            </button>
            <button onClick={() => switchTab('analysis')} style={{ padding: '1rem', background: tab === 'analysis' ? '#667eea' : 'white', color: tab === 'analysis' ? 'white' : '#1a202c', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              📸 Photo
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          
          {/* SEARCH MODE */}
          {tab === 'barcode' && mode === 'barcode-choose' && !result && (
            <div>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1a202c' }}>Chercher par nom</h3>
                  <input 
                    type="text" 
                    placeholder="Ex: Coca, Banane, Yaourt..." 
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
                    autoFocus
                  />
                </div>

                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1a202c' }}>Ou code-barres</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Ex: 3017620422003" 
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && barcodeInput.trim()) {
                          searchBarcode(barcodeInput)
                        }
                      }}
                    />
                    <button 
                      onClick={() => { if (barcodeInput.trim()) searchBarcode(barcodeInput) }}
                      disabled={loading}
                      style={{ padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1 }}
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>⏳ Recherche...</div>
              )}
              
              {!loading && searchResults.length > 0 && (
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {searchResults.length} résultats
                  </div>
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
                      <div style={{ fontWeight: 700, color: '#1a202c' }}>{product.name}</div>
                      {product.brand && (
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>Par: {product.brand}</div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: '#667eea', fontWeight: 600 }}>{Math.round(product.calories)} cal</div>
                    </button>
                  ))}
                </div>
              )}
              
              {!loading && searchInput.trim().length > 1 && searchResults.length === 0 && (
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center', color: '#718096' }}>
                  Aucun résultat
                </div>
              )}
            </div>
          )}

          {/* ANALYSIS - PHOTO CHOOSE */}
          {tab === 'analysis' && mode === 'barcode-choose' && !result && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                onClick={() => startCamera(() => setMode('camera'))} 
                style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}
              >
                📱 Utiliser la caméra
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}
              >
                📁 Upload une image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
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

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c' }}>Analyse en cours...</div>
            </div>
          )}

          {/* RESULT */}
          {result && mode === 'result' && !loading && displayNutrition && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {image && <img src={image} alt="Food" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px' }} />}
              
              <div style={{ background: '#f7fafc', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e2e8f0', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a202c', margin: 0, marginBottom: '0.5rem' }}>{displayNutrition.name}</h3>
                {displayNutrition.brand && (
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500, margin: 0, marginBottom: '1rem' }}>Par: {displayNutrition.brand}</p>
                )}
                
                {/* Quantity selector - only for non-free plans */}
                {plan !== 'free' && (
                  <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'white', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
                    <label style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Quantité (en grammes)</label>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
                
                {/* CALORIES - Always show */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: plan === 'free' ? 0 : '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.3rem' }}>CALORIES</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{displayNutrition.calories}</div>
                </div>

                {/* MACROS - Pro and Fitness only */}
                {plan !== 'free' && displayNutrition.protein !== undefined && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>PROTÉINES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{displayNutrition.protein}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>GLUCIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{displayNutrition.carbs}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>LIPIDES</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a202c' }}>{displayNutrition.fat}g</div>
                    </div>
                  </div>
                )}

                {/* MICROS - Fitness only */}
                {plan === 'fitness' && displayNutrition.sugars !== undefined && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SUCRES</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{displayNutrition.sugars}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>FIBRES</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{displayNutrition.fiber}g</div>
                    </div>
                    <div style={{ background: 'white', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.2rem' }}>SODIUM</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{Math.round(displayNutrition.sodium)}mg</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && mode === 'result' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', padding: '1.5rem', borderTop: '2px solid #e2e8f0', flexShrink: 0 }}>
            <button onClick={resetAll} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: '#1a202c' }}>Recommencer</button>
            <button onClick={saveMeal} style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>✓ Enregistrer</button>
          </div>
        )}
      </div>
    </div>
  )
}
