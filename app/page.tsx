'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Camera, Scan, Book, BarChart3, Sparkles, Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PLAN_FEATURES } from '@/lib/constants'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'fitness'>('free')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const planInfo = PLAN_FEATURES[currentPlan]

  const handleScanner = () => {
    toast.loading('Redirection vers le scanner...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  }

  const handleStats = () => {
    toast.loading('Chargement du tableau de bord...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  }

  const handleChoosePlan = (plan: 'free' | 'pro' | 'fitness') => {
    setCurrentPlan(plan)
    toast.success(`Plan ${PLAN_FEATURES[plan].name} sélectionné ! 🎉`)
  }

  return (
    <div className="min-h-screen">
      {/* Header moderne */}
      <header className="glass glass-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-900 dark:text-white">
                  PhotoCalories
                </h1>
                <p className="text-xs text-dark-500">Nutrition par IA</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Badge variant="success">
                {planInfo.scans} scans restants
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/settings')}
              >
                {planInfo.name}
              </Button>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="info" className="mb-6">
            🎉 Nouvelle version 2.0
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-dark-900 dark:text-white mb-6">
            Suivez votre nutrition
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
              avec l&apos;IA
            </span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-300 mb-12 max-w-2xl mx-auto">
            Scannez vos repas en photo ou code-barres pour un suivi nutritionnel automatique et précis
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={handleScanner}
            >
              <Camera className="w-5 h-5" />
              Scanner un repas
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={handleStats}
            >
              <BarChart3 className="w-5 h-5" />
              Voir mes stats
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover gradient>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Scan Photo</h3>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              IA de reconnaissance alimentaire avec Clarifai
            </p>
          </Card>

          <Card hover gradient>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Code-barres</h3>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              Base OpenFoodFacts avec milliers de produits
            </p>
          </Card>

          <Card hover gradient>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Recettes</h3>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              Créez et sauvegardez vos recettes favorites
            </p>
          </Card>

          <Card hover gradient>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Coach IA</h3>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              Conseils personnalisés pour atteindre vos objectifs
            </p>
          </Card>
        </div>
      </section>

      {/* Plans Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choisissez votre plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(PLAN_FEATURES).map(([key, plan]) => (
            <Card
              key={key}
              hover
              gradient
              className={key === 'pro' ? 'ring-2 ring-primary-500' : ''}
            >
              {key === 'pro' && (
                <Badge variant="success" className="mb-4">Populaire</Badge>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">
                {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                {plan.price > 0 && <span className="text-sm text-dark-500">/mois</span>}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span>
                  {plan.scans} scans/jour
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span>
                  Historique {plan.history === -1 ? 'illimité' : `${plan.history} jours`}
                </li>
                <li className="flex items-center gap-2">
                  <span className={plan.recipes ? 'text-primary-500' : 'text-dark-300'}>
                    {plan.recipes ? '✓' : '✕'}
                  </span>
                  Recettes personnalisées
                </li>
                <li className="flex items-center gap-2">
                  <span className={plan.stats ? 'text-primary-500' : 'text-dark-300'}>
                    {plan.stats ? '✓' : '✕'}
                  </span>
                  Statistiques avancées
                </li>
                <li className="flex items-center gap-2">
                  <span className={plan.coach ? 'text-primary-500' : 'text-dark-300'}>
                    {plan.coach ? '✓' : '✕'}
                  </span>
                  Coach IA
                </li>
              </ul>
              <Button
                variant={key === 'pro' ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => handleChoosePlan(key as 'free' | 'pro' | 'fitness')}
              >
                {currentPlan === key ? 'Plan actuel' : 'Choisir ce plan'}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass glass-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-dark-600 dark:text-dark-400">
          <p>© 2025 PhotoCalories - Nutrition par IA</p>
        </div>
      </footer>
    </div>
  )
}