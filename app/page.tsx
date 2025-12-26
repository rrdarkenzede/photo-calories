'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background shapes */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', borderRadius: '50%', top: '-200px', right: '-100px', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)', borderRadius: '50%', bottom: '-150px', left: '-100px', animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Logo/Icon */}
        <div style={{ marginBottom: '2rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-20px)', transition: 'all 0.8s ease-out' }}>
          <div style={{ fontSize: '5rem', textAlign: 'center', marginBottom: '1rem' }}>📸</div>
        </div>

        {/* Main heading */}
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          fontWeight: 900, 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.8s ease-out 0.2s'
        }}>
          PhotoCalories
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', 
          color: '#4a5568', 
          textAlign: 'center', 
          maxWidth: '700px', 
          marginBottom: '3rem',
          lineHeight: 1.6,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.8s ease-out 0.4s'
        }}>
          Scanne ton repas, découvre tes calories et macros instantanément avec l'IA
        </p>

        {/* Feature cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          width: '100%', 
          maxWidth: '900px', 
          marginBottom: '3rem',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease-out 0.6s'
        }}>
          <FeatureCard icon="⚡" title="Scan instantané" desc="Photo → Résultat en 2 secondes" />
          <FeatureCard icon="🎯" title="Précis" desc="Calories + macros détaillés" />
          <FeatureCard icon="📊" title="Suivi complet" desc="Historique & statistiques" />
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/app')}
          style={{
            padding: '1.25rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transitionDelay: '0.8s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.3)'
          }}
        >
          Commencer gratuitement →
        </button>

        {/* Trust badge */}
        <p style={{ 
          marginTop: '2rem', 
          color: '#718096', 
          fontSize: '0.9rem',
          opacity: mounted ? 1 : 0,
          transition: 'all 0.8s ease-out 1s'
        }}>
          ✓ Sans engagement • ✓ 2 scans gratuits par jour
        </p>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0, 0, 0, 0.1)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
        cursor: 'default'
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: '#718096', lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}
