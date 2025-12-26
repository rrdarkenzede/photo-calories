'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
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
      setError('Remplis tous les champs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulated auth - in real app, call backend
      if (email && password.length >= 6) {
        setUser({
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
        });
        setStep('plan');
      } else {
        throw new Error('Email ou mot de passe invalide');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'login' ? (
          <div className="card animate-fade-in space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Bienvenue 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Connecte-toi pour commencer
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="toi@exemple.com"
                    className="input pl-12"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-12"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Ou
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                // Demo login
                setUser({
                  id: 'demo_user',
                  email: 'demo@photo-calories.com',
                  name: 'Utilisateur Demo',
                });
                setStep('plan');
              }}
              className="btn-secondary w-full"
            >
              Mode Demo
            </button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Pas de compte? <span className="font-semibold text-blue-600 dark:text-blue-400">Crée-en un</span>
            </p>
          </div>
        ) : (
          <div className="card animate-fade-in space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Choisis ton plan 🎯
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Tu peux changer quand tu veux
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'free',
                  name: 'Free',
                  price: '0€',
                  color: 'from-slate-600 to-slate-700',
                  features: ['Calories uniquement', '2 scans/jour', '7 jours'],
                },
                {
                  id: 'pro',
                  name: 'Pro',
                  price: '4,99€/mois',
                  color: 'from-blue-600 to-cyan-600',
                  features: ['Calories + Macros', '10 scans/jour', '90 jours'],
                },
                {
                  id: 'fitness',
                  name: 'Fitness 🔥',
                  price: '9,99€/mois',
                  color: 'from-emerald-600 to-teal-600',
                  features: ['Tout illimité', 'Coach IA 24/7', 'Historique infini'],
                },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => selectPlan(plan.id as 'free' | 'pro' | 'fitness')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 dark:hover:border-blue-500 group`}
                  style={{
                    borderColor: 'var(--tw-border-opacity)',
                    backgroundColor: plan.id === 'fitness' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {plan.name}
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {plan.price}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('login')}
              className="btn-secondary w-full"
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
