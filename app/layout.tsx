import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '📸 PhotoCalories - Comptez vos calories avec l\'IA',
  description: 'Photographiez votre plat, l\'IA reconnaît les ingrédients et calcule automatiquement les calories et macronutriments.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('dark')
            `,
          }}
        />
      </head>
      <body className={`${geist.className} bg-gradient-to-br from-green-50 to-emerald-50 text-slate-900 transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
