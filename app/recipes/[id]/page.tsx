'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Recipe {
  id: string
  title: string
  desc: string
  image: string
  cal: number
  pro: number
  carbs: number
  fat: number
  time: number
  difficulty: string
  servings: number
  ingredients: string[]
  steps: string[]
}

const recipesData: Recipe[] = [
  {
    id: '1',
    title: 'Salade Méditerranéenne',
    desc: 'Salade fraîche avec légumes et féta',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    cal: 350,
    pro: 12,
    carbs: 15,
    fat: 26,
    time: 15,
    difficulty: 'Facile',
    servings: 2,
    ingredients: [
      '200g de laitue romaine',
      '100g de tomates cerises',
      '80g de concombre',
      '50g de féta',
      '30g d\'olives noires',
      '2 c.à.s d\'huile d\'olive',
      'Jus de citron',
      'Sel et poivre',
    ],
    steps: [
      'Laver et couper la laitue en morceaux',
      'Couper les tomates cerises en deux',
      'Émincer le concombre en rondelles',
      'Émietter la féta sur la salade',
      'Ajouter les olives',
      'Assaisonner avec huile d\'olive, citron, sel et poivre',
      'Mélanger délicatement et servir frais',
    ],
  },
  {
    id: '2',
    title: 'Poulet Grillé',
    desc: 'Filet de poulet avec légumes rôtis',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800',
    cal: 450,
    pro: 45,
    carbs: 20,
    fat: 18,
    time: 30,
    difficulty: 'Moyen',
    servings: 2,
    ingredients: [
      '2 filets de poulet (300g)',
      '200g de brocoli',
      '150g de carottes',
      '2 c.à.s d\'huile d\'olive',
      '1 c.à.c de paprika',
      'Thym, ail, sel, poivre',
    ],
    steps: [
      'Préchauffer le four à 200°C',
      'Assaisonner le poulet avec paprika, sel et poivre',
      'Couper les légumes en morceaux',
      'Disposer poulet et légumes sur une plaque',
      'Arroser d\'huile d\'olive et ajouter thym et ail',
      'Cuire au four 25-30 minutes',
      'Servir chaud',
    ],
  },
  {
    id: '3',
    title: 'Smoothie Bowl',
    desc: 'Açaï avec fruits et granola',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    cal: 280,
    pro: 8,
    carbs: 48,
    fat: 7,
    time: 10,
    difficulty: 'Facile',
    servings: 1,
    ingredients: [
      '100g de purée d\'açaï',
      '1 banane',
      '100ml de lait d\'amande',
      '50g de myrtilles',
      '30g de granola',
      '1 c.à.s de miel',
      'Graines de chia',
    ],
    steps: [
      'Mixer açaï, banane et lait d\'amande',
      'Verser dans un bol',
      'Ajouter myrtilles et granola',
      'Saupoudrer de graines de chia',
      'Arroser de miel',
      'Servir immédiatement',
    ],
  },
  {
    id: '4',
    title: 'Poke Bowl',
    desc: 'Riz, saumon, algues et sauce soja',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    cal: 520,
    pro: 38,
    carbs: 55,
    fat: 12,
    time: 20,
    difficulty: 'Moyen',
    servings: 2,
    ingredients: [
      '200g de riz sushi',
      '250g de saumon frais',
      '100g d\'edamame',
      '1 avocat',
      '50g d\'algues wakame',
      'Graines de sésame',
      'Sauce soja',
      '1 c.à.s de sauce sriracha',
    ],
    steps: [
      'Cuire le riz selon les instructions',
      'Couper le saumon en cubes',
      'Mariner le saumon dans sauce soja 10 min',
      'Préparer edamame et couper avocat',
      'Réhydrater les algues',
      'Assembler: riz, saumon, légumes, algues',
      'Parsemer de sésame et servir avec sauce',
    ],
  },
]

export default function RecipeDetail() {
  const router = useRouter()
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [servings, setServings] = useState(2)

  useEffect(() => {
    const found = recipesData.find(r => r.id === params.id)
    if (found) {
      setRecipe(found)
      setServings(found.servings)
    }
  }, [params.id])

  if (!recipe) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Recette non trouvée</div>
  }

  const multiplier = servings / recipe.servings

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container">
          <button onClick={() => router.push('/dashboard')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>← Retour</button>
        </div>
      </header>

      {/* Hero Image */}
      <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
        <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Main Content */}
      <main className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>{recipe.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>{recipe.desc}</p>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Calories</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff6b6b' }}>{Math.round(recipe.cal * multiplier)}</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Protéines</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ecdc4' }}>{Math.round(recipe.pro * multiplier)}g</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Temps</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#45b7d1' }}>{recipe.time} min</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Difficulté</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#96ceb4' }}>{recipe.difficulty}</p>
          </div>
        </div>

        {/* Servings Adjuster */}
        <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Nombre de portions</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              −
            </button>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>🛒 Ingrédients</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                ✓ {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>👨‍🍳 Préparation</h2>
          <ol style={{ paddingLeft: '1.5rem' }}>
            {recipe.steps.map((step, idx) => (
              <li key={idx} style={{ padding: '0.75rem 0', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  )
}
