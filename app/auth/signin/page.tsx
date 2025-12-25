'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SignInClient = dynamic(() => Promise.resolve(function SignInContent() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
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
      
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      router.push('/dashboard')
    } catch (err) {
      setError('Erreur de connexion')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { supabase } = await import('@/lib/auth')
      if (!supabase) {
        setError('Service non disponible')
        return
      }
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (err) setError(err.message)
    } catch (err) {
      setError('Erreur Google')
    }
  }

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Se connecter</h1>
        
        {error && <div style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>OU</div>
        
        <button onClick={handleGoogleSignIn} className="glass" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600, marginBottom: '1rem', cursor: 'pointer' }}>🔴 Google</button>
        
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Pas de compte? <a href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>S'inscrire</a></p>
      </div>
    </div>
  )
}), { ssr: false })

export default SignInClient
