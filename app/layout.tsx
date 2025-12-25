import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhotoCalories - Nutrition par IA',
  description: 'Scannez vos repas pour un suivi nutritionnel automatique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
