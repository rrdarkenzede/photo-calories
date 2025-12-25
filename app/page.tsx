'use client'

import { useState } from 'react'
import { Camera, Scan, Book, BarChart3, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PLAN_FEATURES } from '@/lib/constants'

export default function HomePage() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'fitness'>('free')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass glass-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PhotoCalories</h1>
              <p className="text-xs text-gray-500">Nutrition par IA</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Suivez votre nutrition avec l&apos;IA
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Scannez vos repas pour un suivi nutritionnel automatique
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/dashboard">
            <Button size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Scanner un repas
            </Button>
          </a>
          <a href="/dashboard">
            <Button size="lg" variant="outline" className="gap-2">
              <BarChart3 className="w-5 h-5" />
              Voir mes stats
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-6">
          <Card hover>
            <Camera className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">Scan Photo</h3>
            <p className="text-sm text-gray-600">IA de reconnaissance alimentaire</p>
          </Card>
          <Card hover>
            <Scan className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold mb-2">Code-barres</h3>
            <p className="text-sm text-gray-600">900k+ produits référencés</p>
          </Card>
          <Card hover>
            <Book className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">Recettes</h3>
            <p className="text-sm text-gray-600">Vos recettes favorites</p>
          </Card>
          <Card hover>
            <Sparkles className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-semibold mb-2">Coach IA</h3>
            <p className="text-sm text-gray-600">Conseils personnalisés</p>
          </Card>
        </div>
      </section>

      {/* Plans */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Plans</h2>
        <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {Object.entries(PLAN_FEATURES).map(([key, plan]) => (
            <Card key={key} hover className={key === 'pro' ? 'ring-2 ring-blue-500' : ''}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                {plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li>✓ {plan.scans} scans/jour</li>
                <li>✓ Historique {plan.history === -1 ? 'illimité' : `${plan.history}j`}</li>
                <li className={!plan.recipes ? 'line-through opacity-50' : ''}>✓ Recettes</li>
                <li className={!plan.stats ? 'line-through opacity-50' : ''}>✓ Stats avancées</li>
              </ul>
              <Button
                variant={key === 'pro' ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => {
                  if (currentPlan !== key) {
                    alert(`Plan ${plan.name} sélectionné!`)
                  }
                }}
              >
                {currentPlan === key ? 'Plan actuel' : 'Choisir'}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
