'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-500">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-6">Profil</h2>
          <div className="space-y-4">
            <Input label="Nom" defaultValue="Utilisateur" />
            <Input label="Email" type="email" defaultValue="user@example.com" />
            <Input label="Objectif Calorique" type="number" defaultValue="2500" />
            <Button className="w-full">Enregistrer</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Danger Zone</h2>
          <Button variant="danger" className="w-full">Déconnexion</Button>
        </Card>
      </main>
    </div>
  )
