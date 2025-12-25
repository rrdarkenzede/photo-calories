'use client'

import { useState, useEffect } from 'react'
import { getProfile, UserProfile } from '@/lib/calculations'
import Dashboard from '@/components/Dashboard'
import QuickSetup from '@/components/QuickSetup'

export default function AppPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = getProfile()
    setProfile(saved)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Chargement...</h2>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <QuickSetup onComplete={(p) => { setProfile(p) }} />
  }

  return <Dashboard profile={profile} />
}
