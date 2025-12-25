import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhotoCalories - Nutrition par IA',
  description: 'Scannez vos repas pour un suivi nutritionnel automatique',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0070f3" />
      </head>
      <body>{children}</body>
    </html>
  )
}
