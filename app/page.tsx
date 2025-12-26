'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Camera, TrendingUp, Zap, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="border-b-2 border-blue-200 dark:border-blue-900 sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            📸 PhotoCalories
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg transition-all duration-300"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Reconnaît 10 000+ aliments</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
            <span className="text-slate-900 dark:text-white">Comptez vos calories avec</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">l'IA en 1 clic</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Photographiez votre plat, l'IA reconnaît les ingrédients et calcule les calories + macronutriments. Zéro calcul, zéro prise de tête!
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/login"
              className="btn-primary text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 animate-bounce-soft"
            >
              Démarrer Gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Camera,
              title: '📸 Scan Instant',
              description: 'Prends une photo, l\'IA reconnaît le plat en 2 secondes',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: TrendingUp,
              title: '📊 Suivi Complet',
              description: 'Calories, protéines, carbs, lipides... tout tracké automatiquement',
              color: 'from-emerald-500 to-teal-500',
            },
            {
              icon: Zap,
              title: '🤖 Coach IA',
              description: 'Un coach personnalisé qui s\'adapte à tes objectifs (Plan Fitness)',
              color: 'from-orange-500 to-red-500',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="card border-2 border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-y-2 border-blue-200 dark:border-blue-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-black text-center text-slate-900 dark:text-white mb-16">
            Plans à Petit Prix
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: '🔷 Free',
                price: '0€',
                desc: 'Gratuit pour commencer',
                items: ['📊 Calories', '2 scans/jour', '7 jours historique', '📱 Mobile-friendly'],
                border: 'border-slate-300',
              },
              {
                name: '💎 Pro',
                price: '4,99€',
                desc: 'Par mois',
                items: ['📊 Calories + Macros', '10 scans/jour', '90 jours historique', '📈 Analytics pro'],
                border: 'border-blue-400',
                highlight: false,
              },
              {
                name: '🔥 Fitness',
                price: '9,99€',
                desc: 'Par mois',
                items: ['✨ Tout illimité', '🔓 Pas de limites', '🤖 Coach IA 24/7', '👨‍🍳 Recipe Builder'],
                border: 'border-emerald-400',
                highlight: true,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg ${
                  plan.highlight
                    ? `${plan.border} bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 shadow-lg scale-105 sm:scale-100 sm:hover:scale-105 order-first sm:order-none col-span-full sm:col-span-1`
                    : `${plan.border} bg-white dark:bg-slate-800 hover:scale-105`
                }`}
              >
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">{plan.desc}</p>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-6">
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`w-full block text-center font-bold py-3 rounded-xl transition-all duration-300 ${
                    plan.highlight ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Essayer Maintenant
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Prêt à transformer tes habitudes?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Rejoins 10k+ utilisateurs qui trackent déjà leurs calories avec PhotoCalories. C'est gratuit pour commencer!
          </p>
          <Link
            href="/login"
            className="inline-flex btn-primary text-lg py-4 px-8 animate-glow-pulse"
          >
            Commencer Gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-blue-200 dark:border-blue-900 py-8 bg-slate-50 dark:bg-slate-900 text-center">
        <p className="text-slate-600 dark:text-slate-400 font-bold">
          © 2025 PhotoCalories | Powered by AI 🚀
        </p>
      </footer>
    </div>
  );
}
