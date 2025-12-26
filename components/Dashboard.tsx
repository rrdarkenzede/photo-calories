'use client'

import { useState, useEffect } from 'react'
import { getTodayMeals, getAllMeals, MealEntry, UserProfile, PLAN_FEATURES, changePlan, saveProfile, Plan } from '@/lib/calculations'
import ScanModal from './ScanModal'
import AnalyticsView from './AnalyticsView'
import HistoryView from './HistoryView'
import CoachTab from './CoachTab'

type TabType = 'home' | 'history' | 'analytics' | 'coach'

export default function Dashboard({ profile: initialProfile }: { profile: UserProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [allMeals, setAllMeals] = useState<MealEntry[]>([])
  const [tab, setTab] = useState<TabType>('home')
  const [showScan, setShowScan] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [scansRemaining, setScansRemaining] = useState(2)

  useEffect(() => {
    setMeals(getTodayMeals())
    setAllMeals(getAllMeals())
    const scans = { free: 2, pro: 10, fitness: 40 }
    setScansRemaining(scans[profile.plan] || 2)
  }, [])

  const addMeal = (meal: MealEntry) => {
    setMeals([...meals, meal])
    setAllMeals([...allMeals, meal])
    setShowScan(false)
    setScansRemaining(Math.max(0, scansRemaining - 1))
  }

  const handlePlanChange = (newPlan: Plan) => {
    const updated = changePlan(profile, newPlan)
    setProfile(updated)
    saveProfile(updated)
    setShowPlanDropdown(false)
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
            {/* Header */}
            <header style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', margin: 0 }}>PhotoCalories</h1>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} style={{ background: 'white', border: '2px solid #e2e8f0', color: '#1a202c', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {PLAN_FEATURES[profile.plan].name} 💎
                  </button>
                  
                  {showPlanDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', minWidth: '300px', zIndex: 1000, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
                      {(['free', 'pro', 'fitness'] as Plan[]).map(planId => {
                        const plan = PLAN_FEATURES[planId]
                        const isActive = profile.plan === planId
                        
                        return (
                          <div key={planId} style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'white', transition: 'background 0.2s' }} onClick={() => handlePlanChange(planId)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                              <div>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1a202c' }}>{plan.name}</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>{plan.price === 0 ? 'Gratuit' : plan.price + '€/mois'}</p>
                              </div>
                              {isActive && <span style={{ fontSize: '1.2rem', color: '#667eea' }}>✓</span>}
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                              {plan.features.slice(0, 2).map((f, i) => (
                                <li key={i} style={{ marginBottom: '0.25rem' }}>• {f}</li>
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
                <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.25rem', fontWeight: 600 }}>Scans restants</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#667eea' }}>{scansRemaining} / {profile.plan === 'free' ? 2 : profile.plan === 'pro' ? 10 : 40}</div>
              </div>
            </header>

            {/* Calorie Goal Bar */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', border: '2px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#1a202c', textAlign: 'center' }}>{totalCal}</h2>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#4a5568', textAlign: 'center', fontWeight: 600 }}>/ {profile.targetCalories} cal</p>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(calPercent, 100)}%`, transition: 'width 0.3s' }} />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.95rem', color: '#4a5568', textAlign: 'center', fontWeight: 600 }}>{Math.max(0, profile.targetCalories - totalCal)} cal restantes</p>
            </div>

            {/* Big Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setShowScan(true)} disabled={scansRemaining === 0} style={{ padding: '1.5rem', background: scansRemaining === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', cursor: scansRemaining === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', transition: 'all 0.2s', opacity: scansRemaining === 0 ? 0.5 : 1 }}>
                📸<br/>Scanner
              </button>
              <button onClick={() => setShowScan(true)} disabled={scansRemaining === 0} style={{ padding: '1.5rem', background: scansRemaining === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', cursor: scansRemaining === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)', transition: 'all 0.2s', opacity: scansRemaining === 0 ? 0.5 : 1 }}>
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
                <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, color: '#1a202c', fontSize: '1.1rem' }}>Repas du jour</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {meals.map(meal => (
                    <div key={meal.id} style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1a202c' }}>{meal.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>{meal.time}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#667eea' }}>{meal.calories}cal</div>
                          {(profile.plan === 'pro' || profile.plan === 'fitness') && (
                            <div style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600 }}>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</div>
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
            <button key={nav.id} onClick={() => setTab(nav.id)} style={{ flex: 1, padding: '1rem 0.5rem', background: 'transparent', border: 'none', color: tab === nav.id ? '#667eea' : '#718096', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{nav.icon}</div>
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Scan Modal */}
      {showScan && <ScanModal onClose={() => setShowScan(false)} onAdd={addMeal} plan={profile.plan} />}
      
      {/* Close dropdown when clicking outside */}
      {showPlanDropdown && <div onClick={() => setShowPlanDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />}
    </div>
  )
}

function StatCard({ label, current, target, percent }: { label: string; current: number; target: number; percent: number }) {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center' }}>
      <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem', color: '#1a202c' }}>{current}</div>
      <div style={{ fontSize: '0.75rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>/ {target}g</div>
      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  )
}
