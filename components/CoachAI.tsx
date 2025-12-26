'use client'

import { MealEntry, UserProfile } from '@/lib/calculations'

export default function CoachAI({ meals, profile }: { meals: MealEntry[]; profile: UserProfile }) {
  const totalProt = meals.reduce((sum, m) => sum + (m.protein || 0), 0)
  const totalCal = meals.reduce((sum, m) => sum + m.calories, 0)

  const recommendations = [
    totalProt < profile.targetProtein ? `🥩 Tu manques de ${profile.targetProtein - totalProt}g de protéines. Essaie un yaourt grec ou une barre protéinée!` : '✅ Excellent apport en protéines!',
    totalCal < profile.targetCalories * 0.8 ? `🍽️ Tu es en dessous de tes calories. Ajoute une collation!` : totalCal > profile.targetCalories ? '⚠️ Tu dépasses légèrement tes calories.' : '✅ Calories parfaites!',
  ]

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Coach IA 🤖</h2>
      
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {recommendations.map((rec, i) => (
            <p key={i} style={{ margin: '0.75rem 0' }}>{rec}</p>
          ))}
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Suggestions repas</h3>
        {[
          { name: '🍗 Poulet grillé + Riz blanc', cal: '400 cal', prot: '35g protéines' },
          { name: '🐟 Saumon + Brocoli', cal: '380 cal', prot: '40g protéines' },
          { name: '🥚 Oeufs + Toast complet', cal: '350 cal', prot: '25g protéines' },
        ].map(sug => (
          <div key={sug.name} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 600 }}>{sug.name}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{sug.cal} • {sug.prot}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
