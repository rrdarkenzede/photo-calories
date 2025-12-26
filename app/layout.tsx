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
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            `,
          }}
        />
      </head>
      <body className={`${geist.className} bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200`}>
        {children}
      </body>
    </html>
  );
}
