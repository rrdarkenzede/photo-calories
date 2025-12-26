'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setPlan } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'plan'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Remplis tous les champs!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (email && password.length >= 6) {
        setUser({
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
        });
        setStep('plan');
      } else {
        throw new Error('😔 Email ou mot de passe invalide');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = (plan: 'free' | 'pro' | 'fitness') => {
    setPlan(plan);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'login' ? (
          <div className="card border-2 border-blue-300 dark:border-blue-700 animate-fade-in space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold mb-4 transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Link>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                Bienvenue 🙋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Connecte-toi pour commencer
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                  📬 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="input border-blue-300 dark:border-blue-700"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                  🔐 Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input border-blue-300 dark:border-blue-700"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-300 dark:border-red-700 animate-fade-in">
                  <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg font-black py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  '🔐 Se connecter'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-blue-200 dark:border-blue-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold text-sm">
                  OU
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setUser({
                  id: 'demo_user',
                  email: 'demo@photo-calories.com',
                  name: 'Utilisateur Demo',
                });
                setStep('plan');
              }}
              className="btn-secondary w-full text-lg font-black py-3"
            >
              🔮 Essayer la démo
            </button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-bold">
              Pas de compte? <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Crée-en un</span>
            </p>
          </div>
        ) : (
          <div className="card border-2 border-emerald-300 dark:border-emerald-700 animate-fade-in space-y-6">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                🎯 Choisis un plan
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Tu peux changer quand tu veux!
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'free',
                  name: '🔷 Free',
                  price: '0€',
                  color: 'from-slate-500 to-slate-600',
                  features: ['📊 Calories', '2 scans/jour', '7 jours'],
                },
                {
                  id: 'pro',
                  name: '💎 Pro',
                  price: '4,99€/mois',
                  color: 'from-blue-600 to-cyan-500',
                  features: ['Calories + Macros', '10 scans/jour', '90 jours'],
                },
                {
                  id: 'fitness',
                  name: '🔥 Fitness',
                  price: '9,99€/mois',
                  color: 'from-emerald-600 to-teal-500',
                  features: ['✨ Tout illimité', '🤖 Coach IA', 'Historique infini'],
                  highlight: true,
                },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => selectPlan(plan.id as 'free' | 'pro' | 'fitness')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 border-emerald-400 dark:border-emerald-600 shadow-lg'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className={`text-lg font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.price}
                    </div>
                  </div>
                  <ul className="text-xs font-bold text-slate-600 dark:text-slate-400 space-y-1 uppercase tracking-wide">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('login')}
              className="btn-secondary w-full text-base font-bold py-2"
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
