import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoCalories - Analyse IA de vos repas',
  description: 'Scannez votre plat, l\'IA reconnaît les calories et macronutriments en 2 secondes. Suivi complet avec plans Free, Pro et Fitness.',
  keywords: ['calories', 'nutrition', 'fitness', 'tracking', 'ai', 'photo'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
