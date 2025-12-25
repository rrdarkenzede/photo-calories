'use client'

import { useState, useEffect } from 'react'
import OnboardingFlow from '@/components/OnboardingFlow'
import Dashboard from '@/components/Dashboard'
import { getProfile } from '@/lib/calculations'

export default function AppPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = getProfile()
    setProfile(saved)
    setLoading(false)
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.5rem' }}>Chargement...</div>
  }

  if (!profile) {
    return <OnboardingFlow onComplete={(newProfile) => setProfile(newProfile)} />
  }

  return <Dashboard profile={profile} />
}
