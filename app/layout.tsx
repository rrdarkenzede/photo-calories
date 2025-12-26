import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhotoCalories - Scannez vos calories',
  description: 'App gratuite pour compter vos calories avec l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
