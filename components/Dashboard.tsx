'use client'

import { useState, useEffect } from 'react'
import { getTodayMeals, getAllMeals, MealEntry, UserProfile, PLAN_FEATURES, changePlan, saveProfile, Plan } from '@/lib/calculations'
import AddMealModal from './AddMealModal'
import AnalyticsView from './AnalyticsView'
import HistoryView from './HistoryView'
import RecipeBuilder from './RecipeBuilder'

type TabType = 'home' | 'history' | 'analytics' | 'recipes'

export default function Dashboard({ profile: initialProfile }: { profile: UserProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [allMeals, setAllMeals] = useState<MealEntry[]>([])
  const [tab, setTab] = useState<TabType>('home')
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)

  useEffect(() => {
    setMeals(getTodayMeals())
    setAllMeals(getAllMeals())
  }, [])

  const addMeal = (meal: MealEntry) => {
    setMeals([...meals, meal])
    setAllMeals([...allMeals, meal])
    setShowAddMeal(false)
  }

  const handlePlanChange = (newPlan: Plan) => {
    const updated = changePlan(profile, newPlan)
    setProfile(updated)
    saveProfile(updated)
    setShowPlanDropdown(false)
  }

  const totalCal = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProt = meals.reduce((sum, m) => sum + (m.protein || 0), 0)
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0)
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0)

  const calPercent = Math.round((totalCal / profile.targetCalories) * 100)
  const protPercent = Math.round((totalProt / profile.targetProtein) * 100)
  const carbPercent = Math.round((totalCarbs / profile.targetCarbs) * 100)
  const fatPercent = Math.round((totalFat / profile.targetFat) * 100)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem' }}>
        {tab === 'home' && (
          <>
            {/* Header with Plan Dropdown */}
            <header className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Salut {profile.name}! \ud83d\udcaa</h1>
                </div>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                    {PLAN_FEATURES[profile.plan].name} \ud83d\udd13
                  </button>
                  
                  {showPlanDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', minWidth: '300px', zIndex: 1000, overflow: 'hidden' }}>
                      {(['free', 'pro', 'fitness'] as Plan[]).map(planId => {
                        const plan = PLAN_FEATURES[planId]
                        const isActive = profile.plan === planId
                        
                        return (
                          <div key={planId} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent', transition: 'background 0.2s' }} onClick={() => handlePlanChange(planId)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                              <div>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{plan.name}</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', opacity: 0.7 }}>{plan.price === 0 ? 'Gratuit' : plan.price + '/mois'}</p>
                              </div>
                              {isActive && <span style={{ fontSize: '1.2rem' }}>\u2713</span>}
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
                              {plan.features.slice(0, 2).map((f, i) => (
                                <li key={i}>\u2022 {f}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </header>

            {/* Main Stats */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem', color: 'white', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{totalCal}</h2>
              <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>/ {profile.targetCalories} cal</p>
              <div style={{ margin: '1.5rem 0 0 0', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(calPercent, 100)}%`, transition: 'width 0.3s' }} />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>{Math.max(0, profile.targetCalories - totalCal)} cal restantes</p>
            </div>

            {/* Macros */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatCard label="\ud83e\udd69 Prot" current={totalProt} target={profile.targetProtein} percent={protPercent} />
              <StatCard label="\ud83e\udd54 Carbs" current={totalCarbs} target={profile.targetCarbs} percent={carbPercent} />
              <StatCard label="\ud83e\uddc8 Gras" current={totalFat} target={profile.targetFat} percent={fatPercent} />
            </div>

            {/* Add Meal Button */}
            <button onClick={() => setShowAddMeal(true)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
              \ud83d\udcf8 Ajouter un repas
            </button>

            {/* Meals List */}
            {meals.length > 0 && (
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Repas du jour</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {meals.map(meal => (
                    <div key={meal.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{meal.name}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{meal.time}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{meal.calories}cal</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'history' && <HistoryView meals={allMeals} showMacros={true} />}
        {tab === 'analytics' && <AnalyticsView meals={allMeals} profile={profile} />}
        {tab === 'recipes' && <RecipeBuilder />}
      </div>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          {[
            { id: 'home' as const, icon: '\ud83c\udfe0', label: 'Accueil' },
            { id: 'history' as const, icon: '\ud83d\udcdc', label: 'Historique' },
            { id: 'analytics' as const, icon: '\ud83d\udcc8', label: 'Stats' },
            { id: 'recipes' as const, icon: '\ud83d\udc68\u200d\ud83c\udf73', label: 'Recettes' },
          ].map(nav => (
            <button key={nav.id} onClick={() => setTab(nav.id)} style={{ flex: 1, padding: '1rem 0.5rem', background: 'transparent', border: 'none', color: tab === nav.id ? '#667eea' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{nav.icon}</div>
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Add Meal Modal */}
      {showAddMeal && <AddMealModal onClose={() => setShowAddMeal(false)} onAdd={addMeal} scansRemaining={999} />}
      
      {/* Close dropdown when clicking outside */}
      {showPlanDropdown && <div onClick={() => setShowPlanDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />}
    </div>
  )
}

function StatCard({ label, current, target, percent }: { label: string; current: number; target: number; percent: number }) {
  return (
    <div className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{current}</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.5rem' }}>/ {target}g</div>
      <div style={{ height: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  )
}
