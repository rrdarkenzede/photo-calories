'use client'

import { useState, useEffect } from 'react'
import { Camera, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Scanner from '@/components/Scanner'

export default function DashboardPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json() as Record<string, unknown>
        setStats((data.stats as Record<string, number>) || null)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="glass glass-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">PhotoCalories</h1>
            </Link>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowScanner(true)} className="gap-2">
                <Camera className="w-4 h-4" />
                Scanner
              </Button>
              <Link href="/settings">
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" variant="outline">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Vos Statistiques</h2>
        
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <Card hover>
            <p className="text-gray-600 text-sm mb-2">Calories Aujourd&apos;hui</p>
            <p className="text-3xl font-bold">{stats?.todayCalories || 0}</p>
            <p className="text-xs text-gray-500 mt-2">/ {stats?.todayCaloriesGoal || 2500} kcal</p>
          </Card>
          <Card hover>
            <p className="text-gray-600 text-sm mb-2">Repas</p>
            <p className="text-3xl font-bold">{stats?.mealsLogged || 0}</p>
          </Card>
          <Card hover>
            <p className="text-gray-600 text-sm mb-2">Moyenne</p>
            <p className="text-3xl font-bold">{Math.round(stats?.averageDailyCalories || 0)}</p>
          </Card>
          <Card hover>
            <p className="text-gray-600 text-sm mb-2">Scans Restants</p>
            <p className="text-3xl font-bold">{stats?.scansRemaining || 5}</p>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-8">Recettes Suggérées</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card hover>
            <h3 className="font-bold mb-2">Salade Méditerranéenne</h3>
            <p className="text-sm text-gray-600 mb-4">Salade fraîche avec légumes et féta</p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div><p className="text-gray-500">Cal</p><p className="font-bold">350</p></div>
              <div><p className="text-gray-500">Pro</p><p className="font-bold">12g</p></div>
              <div><p className="text-gray-500">Carbs</p><p className="font-bold">15g</p></div>
              <div><p className="text-gray-500">Fat</p><p className="font-bold">26g</p></div>
            </div>
          </Card>
          <Card hover>
            <h3 className="font-bold mb-2">Poulet Grillé</h3>
            <p className="text-sm text-gray-600 mb-4">Filet de poulet avec légumes rôtis</p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div><p className="text-gray-500">Cal</p><p className="font-bold">450</p></div>
              <div><p className="text-gray-500">Pro</p><p className="font-bold">45g</p></div>
              <div><p className="text-gray-500">Carbs</p><p className="font-bold">20g</p></div>
              <div><p className="text-gray-500">Fat</p><p className="font-bold">18g</p></div>
            </div>
          </Card>
        </div>
      </main>

      {/* Scanner */}
      {showScanner && (
        <Scanner
          onClose={() => setShowScanner(false)}
          onScanComplete={(result) => {
            console.log('Scan:', result)
            setShowScanner(false)
            alert('Scan enregistré!')
          }}
        />
      )}
    </div>
  )
