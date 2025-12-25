'use client'

import { useState } from 'react'

export default function RecipeBuilder() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', ingredients: '', calories: '' })

  const addRecipe = () => {
    if (form.name && form.calories) {
      setRecipes([...recipes, { id: Date.now(), ...form }])
      setForm({ name: '', ingredients: '', calories: '' })
      setShowForm(false)
    }
  }

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recettes sauvegardées 👨‍🍳</h2>
      
      <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, marginBottom: '1.5rem', cursor: 'pointer' }}>
        ➕ Créer une recette
      </button>

      {showForm && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
          <input type="text" placeholder="Nom de la recette" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
          <textarea placeholder="Ingrédients (un par ligne)" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 0.75rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' }} />
          <input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} style={{ width: '100%', padding: '0.75rem', margin: '0 0 1rem 0', border: 'none', borderRadius: '8px', fontSize: '1rem' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
            <button onClick={addRecipe} style={{ flex: 1, padding: '0.75rem', background: 'rgba(102, 126, 234, 0.9)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Sauvegarder</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {recipes.map(recipe => (
          <div key={recipe.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>{recipe.name}</h3>
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', opacity: 0.8 }}>{recipe.calories}cal</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{recipe.ingredients}</p>
            <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.5)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Utiliser (0 scan!)</button>
          </div>
        ))}
      </div>
    </div>
  )
}
