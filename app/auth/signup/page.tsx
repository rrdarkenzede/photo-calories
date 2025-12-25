'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SignUpClient = dynamic(() => Promise.resolve(function SignUpContent() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase } = await import('@/lib/auth')
      if (!supabase) {
        setError('Service non disponible')
        setLoading(false)
        return
      }
      
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      router.push('/onboarding')
    } catch (err) {
      setError('Erreur d\'inscription')
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>S'inscrire</h1>
        
        {error && <div style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>{loading ? 'Inscription...' : 'S\'inscrire'}</button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>Déjà inscrit? <a href="/auth/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Se connecter</a></p>
      </div>
    </div>
  )
}), { ssr: false })

export default SignUpClient
