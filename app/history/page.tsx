'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Trash2, Download, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { toast } from 'sonner'

export default function HistoryPage() {
  const [meals, setMeals] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('/api/meals')
        const data = await response.json() as unknown
        const d = data as Record<string, unknown>
        setMeals((d.meals as unknown[]) || [])
      } catch (error) {
        console.error('Erreur chargement repas:', error)
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [])

  const handleDelete = (id: string) => {
    setMeals(meals.filter((meal: unknown) => (meal as Record<string, unknown>).id !== id))
    toast.success('Repas supprimé')
  }

  const handleDownload = () => {
    toast.success('Téléchargement lancé')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary-500" />
              Historique
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-2">Vos repas enregistrés</p>
          </div>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="w-5 h-5" />
            Exporter
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          {['all', 'today', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-dark-800 text-dark-700 dark:text-dark-200'
              }`}
            >
              {f === 'all' && 'Tous'}
              {f === 'today' && 'Aujourd\'hui'}
              {f === 'week' && 'Cette semaine'}
              {f === 'month' && 'Ce mois'}
            </button>
          ))}
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          {meals.length > 0 ? (
            meals.map((meal: unknown, index: number) => {
              const m = meal as Record<string, unknown>
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-dark-500 capitalize">{m.type as string}</p>
                        <h3 className="text-lg font-semibold mb-3">{m.date as string}</h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Cal</p>
                            <p className="font-semibold">{m.totalCalories as number} kcal</p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Protéines</p>
                            <p className="font-semibold">{m.totalProtein as number}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Glucides</p>
                            <p className="font-semibold">{m.totalCarbs as number}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Lipides</p>
                            <p className="font-semibold">{m.totalFat as number}g</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id as string)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <Card>
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                <p className="text-dark-500">Aucun repas enregistré</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}