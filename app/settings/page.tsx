'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, LogOut, Bell, Eye, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Utilisateur',
    email: 'user@example.com',
    dailyCalorieGoal: 2500,
  })

  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    goals: true,
    newRecipes: false,
  })

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  const handleSaveProfile = () => {
    toast.success('Profil mis à jour')
  }

  const handleLogout = () => {
    toast.success('Déconnexion réussie')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-8 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-500" />
          Paramètres
        </h1>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
            <div className="space-y-4">
              <Input
                label="Nom"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="Objectif Calorique Quotidien"
                type="number"
                value={profile.dailyCalorieGoal}
                onChange={(e) =>
                  setProfile({ ...profile, dailyCalorieGoal: parseInt(e.target.value) })
                }
              />
              <Button onClick={handleSaveProfile} className="w-full gap-2">
                <Save className="w-5 h-5" />
                Enregistrer
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary-500" />
              Notifications
            </h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [key]: e.target.checked })
                    }
                    className="w-5 h-5 accent-primary-500"
                  />
                  <span className="font-medium capitalize">
                    {key === 'daily' && 'Rappel Quotidien'}
                    {key === 'weekly' && 'Résumé Hebdomadaire'}
                    {key === 'goals' && 'Alertes Objectifs'}
                    {key === 'newRecipes' && 'Nouvelles Recettes'}
                  </span>
                </label>
              ))}
              <Button onClick={() => toast.success('Notifications mises à jour')} className="w-full mt-4">
                Enregistrer
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary-500" />
              Thématé
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {(['light', 'dark', 'auto'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === t
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-dark-200 dark:border-dark-700'
                  }`}
                >
                  <span className="capitalize font-medium">
                    {t === 'light' && '☀️ Clair'}
                    {t === 'dark' && '🌜 Sombre'}
                    {t === 'auto' && '🔄 Auto'}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary-500" />
              Sécurité
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">Changer le mot de passe</Button>
              <Button variant="outline" className="w-full">2FA - Vérification Deux Étapes</Button>
            </div>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-full gap-2"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </motion.div>
      </div>
    </div>
  )
}