'use client'

import { useState, useRef } from 'react'
import { MealEntry } from '@/lib/calculations'

export default function AddMealModal({ onClose, onAdd, scansRemaining }: { onClose: () => void; onAdd: (meal: MealEntry) => void; scansRemaining: number }) {
  const [method, setMethod] = useState<'photo' | 'barcode' | 'manual'>('manual')
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [barcode, setBarcode] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddMeal = () => {
    if (!form.name || !form.calories) {
      alert('Nom et calories requis!')
      return
    }
    if (scansRemaining <= 0) {
      alert('Pas de scans restants!')
      return
    }

    const meal: MealEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      name: form.name,
      calories: parseInt(form.calories),
      protein: form.protein ? parseInt(form.protein) : undefined,
      carbs: form.carbs ? parseInt(form.carbs) : undefined,
      fat: form.fat ? parseInt(form.fat) : undefined,
      items: [form.name],
    }
    onAdd(meal)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
      <div className="glass" style={{ width: '100%', borderRadius: '24px 24px 0 0', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', color: 'white' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', margin: 0 }}>Ajouter un repas</h2>

        {/* Method Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { id: 'photo', icon: '📸', label: 'Photo' },
            { id: 'barcode', icon: '📦', label: 'Code' },
            { id: 'manual', icon: '⌨️', label: 'Manuel' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id as any)} style={{ padding: '1rem', border: method === m.id ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', background: method === m.id ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{m.icon}</div>
              {m.label}
            </button>
          ))}
        </div>

        {/* Photo Method */}
        {method === 'photo' && (
          <div style={{ marginBottom: '2rem' }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '2rem', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem' }}>
              📸 Prendre une photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => {
              if (e.target.files?.[0]) {
                const reader = new FileReader()
                reader.onload = (ev) => {
                  // Simulé: Analyser la photo avec IA
                  setForm({ ...form, name: 'Repas (photo)', calories: '450', protein: '20', carbs: '50', fat: '15' })
                }
                reader.readAsDataURL(e.target.files[0])
              }
            }} />
            <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '1rem 0' }}>Prend -1 scan</p>
          </div>
        )}

        {/* Barcode Method */}
        {method === 'barcode' && (
          <div style={{ marginBottom: '2rem' }}>
            <input type="text" placeholder="Entrer le code barres" value={barcode} onChange={(e) => setBarcode(e.target.value)} style={{ width: '100%', padding: '0.75rem', margin: '0 0 1rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Prend -1 scan</p>
          </div>
        )}

        {/* Manual Method */}
        {method === 'manual' && (
          <div style={{ marginBottom: '2rem' }}>
            <input type="text" placeholder="Nom du repas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Protéines (opt)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Glucides (opt)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
            <input type="number" placeholder="Graisses (opt)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 1rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
          <button onClick={handleAddMeal} style={{ flex: 1, padding: '1rem', background: 'rgba(102, 126, 234, 0.9)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Ajouter (-1 scan)</button>
        </div>
      </div>
    </div>
  )
}
