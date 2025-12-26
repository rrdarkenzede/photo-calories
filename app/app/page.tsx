'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '@/lib/calculations'
import Dashboard from '@/components/Dashboard'

export default function AppPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load or create default profile
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('photocal_profile')
      if (saved) {
        try {
          setProfile(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to parse profile:', e)
          // Create default profile
          const defaultProfile = createDefaultProfile()
          localStorage.setItem('photocal_profile', JSON.stringify(defaultProfile))
          setProfile(defaultProfile)
        }
      } else {
        // First time - create default profile
        const defaultProfile = createDefaultProfile()
        localStorage.setItem('photocal_profile', JSON.stringify(defaultProfile))
        setProfile(defaultProfile)
      }
    }
    setLoading(false)
  }, [])

  if (loading || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Chargement...</h2>
        </div>
      </div>
    )
  }

  return <Dashboard profile={profile} />
}

function createDefaultProfile(): UserProfile {
  return {
    name: 'Utilisateur',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'M',
    activityLevel: 'moderate',
    goal: 'maintain',
    plan: 'free',
    bmr: 1650,
    tdee: 2250,
    targetCalories: 2250,
    targetProtein: 140,
    targetCarbs: 280,
    targetFat: 60,
    createdAt: new Date().toISOString(),
  }
}
