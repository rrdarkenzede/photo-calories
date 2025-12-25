import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoCalories - Scanne tes repas',
  description: 'Prends une photo, connais tes calories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
