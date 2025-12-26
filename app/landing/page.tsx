'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Camera, TrendingUp, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            📸 PhotoCalories
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              À propos
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              Tarifs
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comptez vos calories avec<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              l'IA
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Photographiez votre plat, l'application reconnaît les ingrédients et calcule
            automatiquement les calories et macronutriments. Simple. Rapide. Intelligent.
          </p>

          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors group"
          >
            Commencer <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features */}
        <div className="mt-24 grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: Camera,
              title: 'Scan Instant',
              description: 'Photographiez votre plat et l\'IA reconnaît tous les ingrédients',
            },
            {
              icon: TrendingUp,
              title: 'Suivi Précis',
              description: 'Calories, macros, micros... suivi complet selon votre plan',
            },
            {
              icon: Zap,
              title: 'Coach IA',
              description: 'Un coach personnel qui s\'adapte à vos entraînements (Plan Fitness)',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Plans Adaptés à Vos Besoins
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '0€',
                items: [
                  'Calories uniquement',
                  '2 scans/jour',
                  '7 jours d\'historique',
                  'Avec publicités',
                ],
              },
              {
                name: 'Pro',
                price: '4,99€/mois',
                items: [
                  'Calories + Macros',
                  '10 scans/jour',
                  '90 jours d\'historique',
                  'Analytics avancées',
                  'Pas de publicités',
                ],
              },
              {
                name: 'Fitness',
                price: '9,99€/mois',
                items: [
                  'Calories + Macros + Micros',
                  '40 scans/jour',
                  'Historique illimité',
                  'Coach IA 24/7',
                  'Recipe Builder',
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-lg border p-8 transition-all ${
                  i === 2
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  {plan.price}
                </p>
                <ul className="space-y-3">
                  {plan.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Prêt à transformer vos habitudes alimentaires?
        </h2>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          Commencer Maintenant
        </button>
      </section>
    </div>
  );
}
