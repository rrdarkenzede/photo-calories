'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, TrendingUp, Book, Settings, LogOut, Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatsCard from '@/components/StatsCard'
import Scanner from '@/components/Scanner'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [recipes, setRecipes] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recipesRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/recipes'),
        ])

        const statsData = await statsRes.json() as unknown
        const recipesData = await recipesRes.json() as unknown

        const sd = statsData as Record<string, unknown>
        const rd = recipesData as Record<string, unknown>

        setStats((sd.stats as Record<string, number>) || null)
        setRecipes((rd.recipes as unknown[]) || [])
      } catch (error) {
        console.error('Erreur chargement données:', error)
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleScanComplete = (result: unknown) => {
    console.log('Scan complété:', result)
    setShowScanner(false)
    toast.success('Scan enregistré avec succès !')
  }

  const handleViewRecipes = () => {
    toast.info('Redirection vers recettes...')
    // TODO: Créer page recettes
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-600 dark:text-dark-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      {/* Header */}
      <header className="glass glass-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-dark-900 dark:text-white">PhotoCalories</h1>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Button
                size="sm"
                onClick={() => setShowScanner(true)}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Scanner
              </Button>
              <Link href="/settings">
                <button
                  className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  aria-label="Paramètres"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/">
                <button
                  className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  aria-label="Déconnexion"
                  onClick={() => toast.success('Déconnexion réussie')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Vos Statistiques</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Calories Aujourd&apos;hui"
              value={stats?.todayCalories || 0}
              goal={stats?.todayCaloriesGoal || 2500}
              icon={TrendingUp}
              color="blue"
              progress={((stats?.todayCalories || 0) / (stats?.todayCaloriesGoal || 2500)) * 100}
            />
            <StatsCard
              title="Repas Enregistrés"
              value={stats?.mealsLogged || 0}
              icon={Camera}
              color="green"
            />
            <StatsCard
              title="Moyenne Quotidienne"
              value={Math.round(stats?.averageDailyCalories || 0)}
              icon={TrendingUp}
              color="orange"
            />
            <StatsCard
              title="Scans Restants"
              value={stats?.scansRemaining || 5}
              icon={Camera}
              color="purple"
            />
          </div>
        </section>

        {/* Recipes Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recettes Suggérées</h2>
            <Button
              variant="outline"
              onClick={handleViewRecipes}
              className="gap-2"
            >
              <Book className="w-4 h-4" />
              Voir Toutes
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recipes.length > 0 ? (
              recipes.slice(0, 4).map((recipe: unknown, index: number) => {
                const r = recipe as Record<string, unknown>
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover gradient>
                      <h3 className="text-lg font-semibold mb-2">{r.name as string}</h3>
                      <p className="text-dark-600 dark:text-dark-400 text-sm mb-4">
                        {r.description as string}
                      </p>
                      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-dark-200 dark:border-dark-700">
                        <div className="text-center">
                          <p className="text-xs text-dark-500 mb-1">Cal</p>
                          <p className="font-semibold">450</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-dark-500 mb-1">Pro</p>
                          <p className="font-semibold">35g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-dark-500 mb-1">Carbs</p>
                          <p className="font-semibold">45g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-dark-500 mb-1">Fat</p>
                          <p className="font-semibold">15g</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <p className="col-span-2 text-center text-dark-500">Aucune recette disponible</p>
            )}
          </div>
        </section>
      </main>

      {/* Scanner Modal */}
      {showScanner && (
        <Scanner
          onClose={() => setShowScanner(false)}
          onScanComplete={handleScanComplete}
        />
      )}
    </div>
  )
}