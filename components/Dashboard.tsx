'use client'

import { useState, useEffect } from 'react'
import { getTodayMeals, getAllMeals, MealEntry, UserProfile, PLAN_FEATURES, changePlan, saveProfile, Plan } from '@/lib/calculations'
import AddMealModal from './AddMealModal'
import AnalyticsView from './AnalyticsView'
import HistoryView from './HistoryView'
import CoachTab from './CoachTab'

type TabType = 'home' | 'history' | 'analytics' | 'coach'

export default function Dashboard({ profile: initialProfile }: { profile: UserProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [allMeals, setAllMeals] = useState<MealEntry[]>([])
  const [tab, setTab] = useState<TabType>('home')
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [scansRemaining, setScansRemaining] = useState(2)

  useEffect(() => {
    setMeals(getTodayMeals())
    setAllMeals(getAllMeals())
    // Set scans based on plan
    const scans = { free: 2, pro: 10, fitness: 40 }
    setScansRemaining(scans[profile.plan] || 2)
  }, [])

  const addMeal = (meal: MealEntry) => {
    setMeals([...meals, meal])
    setAllMeals([...allMeals, meal])
    setShowAddMeal(false)
    setScansRemaining(Math.max(0, scansRemaining - 1))
  }

  const handlePlanChange = (newPlan: Plan) => {
    const updated = changePlan(profile, newPlan)
    setProfile(updated)
    saveProfile(updated)
    setShowPlanDropdown(false)
    // Update scans
    const scans = { free: 2, pro: 10, fitness: 40 }
    setScansRemaining(scans[newPlan] || 2)
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    saveProfile(updatedProfile)
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
    <div style={{ minHeight: '100vh', background: '#f5f7fa', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem' }}>
        {tab === 'home' && (
          <>
            {/* Header with Plan + Scans */}
            <header style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2d3748', margin: 0 }}>PhotoCalories</h1>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} style={{ background: 'white', border: '2px solid #e2e8f0', color: '#2d3748', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {PLAN_FEATURES[profile.plan].name} 💎
                  </button>
                  
                  {showPlanDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', minWidth: '300px', zIndex: 1000, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                      {(['free', 'pro', 'fitness'] as Plan[]).map(planId => {
                        const plan = PLAN_FEATURES[planId]
                        const isActive = profile.plan === planId
                        
                        return (
                          <div key={planId} style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'white', transition: 'background 0.2s' }} onClick={() => handlePlanChange(planId)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                              <div>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#2d3748' }}>{plan.name}</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#718096' }}>{plan.price === 0 ? 'Gratuit' : plan.price + '€/mois'}</p>
                              </div>
                              {isActive && <span style={{ fontSize: '1.2rem' }}>✓</span>}
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                              {plan.features.slice(0, 2).map((f, i) => (
                                <li key={i}>• {f}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Scans counter */}
              <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.25rem' }}>Scans restants</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#667eea' }}>{scansRemaining} / {profile.plan === 'free' ? 2 : profile.plan === 'pro' ? 10 : 40}</div>
              </div>
            </header>

            {/* Calorie Goal Bar */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', border: '2px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#2d3748', textAlign: 'center' }}>{totalCal}</h2>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#718096', textAlign: 'center' }}>/ {profile.targetCalories} cal</p>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(calPercent, 100)}%`, transition: 'width 0.3s' }} />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#718096', textAlign: 'center' }}>{Math.max(0, profile.targetCalories - totalCal)} cal restantes</p>
            </div>

            {/* Big Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setShowAddMeal(true)} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', transition: 'all 0.2s' }}>
                📸<br/>Scanner
              </button>
              <button onClick={() => setShowAddMeal(true)} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)', transition: 'all 0.2s' }}>
                📤<br/>Upload
              </button>
            </div>

            {/* Macros (Pro/Fitness only) */}
            {(profile.plan === 'pro' || profile.plan === 'fitness') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatCard label="🥩 Prot" current={totalProt} target={profile.targetProtein} percent={protPercent} />
                <StatCard label="🥔 Carbs" current={totalCarbs} target={profile.targetCarbs} percent={carbPercent} />
                <StatCard label="🧈 Gras" current={totalFat} target={profile.targetFat} percent={fatPercent} />
              </div>
            )}

            {/* Meals List */}
            {meals.length > 0 && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, color: '#2d3748' }}>Repas du jour</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {meals.map(meal => (
                    <div key={meal.id} style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#2d3748' }}>{meal.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#718096' }}>{meal.time}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#667eea' }}>{meal.calories}cal</div>
                          {(profile.plan === 'pro' || profile.plan === 'fitness') && (
                            <div style={{ fontSize: '0.75rem', color: '#718096' }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'history' && <HistoryView meals={allMeals} showMacros={profile.plan !== 'free'} />}
        {tab === 'analytics' && <AnalyticsView meals={allMeals} profile={profile} />}
        {tab === 'coach' && <CoachTab profile={profile} onProfileUpdate={handleProfileUpdate} />}
      </div>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '2px solid #e2e8f0', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          {[
            { id: 'home' as const, icon: '🏠', label: 'Accueil' },
            { id: 'history' as const, icon: '📜', label: 'Historique' },
            { id: 'analytics' as const, icon: '📊', label: 'Stats' },
            { id: 'coach' as const, icon: '🤖', label: 'Coach' },
          ].map(nav => (
            <button key={nav.id} onClick={() => setTab(nav.id)} style={{ flex: 1, padding: '1rem 0.5rem', background: 'transparent', border: 'none', color: tab === nav.id ? '#667eea' : '#a0aec0', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{nav.icon}</div>
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Add Meal Modal */}
      {showAddMeal && <AddMealModal onClose={() => setShowAddMeal(false)} onAdd={addMeal} scansRemaining={scansRemaining} />}
      
      {/* Close dropdown when clicking outside */}
      {showPlanDropdown && <div onClick={() => setShowPlanDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />}
    </div>
  )
}

function StatCard({ label, current, target, percent }: { label: string; current: number; target: number; percent: number }) {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: '#2d3748' }}>{current}</div>
      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem' }}>/ {target}g</div>
      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  )
}
