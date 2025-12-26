'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import {
  Barcode,
  Camera,
  Settings,
  TrendingUp,
  Zap,
  Flame,
  Droplets,
  Wheat,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { PLANS } from '@/lib/plans';

export default function Dashboard() {
  const router = useRouter();
  const {
    currentUser,
    currentPlan,
    dailyGoals,
    meals,
    logout,
    setPlan,
    scansUsedToday,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-green-200 border-t-green-600 mb-4" />
          <p className="text-slate-600 font-bold text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('fr-FR');
  const todaysMeals = meals.filter(
    (m) => new Date(m.date).toLocaleDateString('fr-FR') === today
  );

  const totalCalories = todaysMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = todaysMeals.reduce((acc, m) => acc + m.totalProtein, 0);
  const totalCarbs = todaysMeals.reduce((acc, m) => acc + m.totalCarbs, 0);
  const totalFat = todaysMeals.reduce((acc, m) => acc + m.totalFat, 0);

  const calorieProgress = dailyGoals ? (totalCalories / dailyGoals.calories) * 100 : 0;
  const proteinProgress = dailyGoals ? (totalProtein / dailyGoals.protein) * 100 : 0;
  const carbsProgress = dailyGoals ? (totalCarbs / dailyGoals.carbs) * 100 : 0;
  const fatProgress = dailyGoals ? (totalFat / dailyGoals.fat) * 100 : 0;

  const maxScans = PLANS[currentPlan].scansPerDay;
  const scansRemaining = maxScans - scansUsedToday;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handlePlanChange = (plan: 'free' | 'pro' | 'fitness') => {
    setPlan(plan);
    setPlanMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-green-200 sticky top-0 z-50 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            📸 PhotoCalories
          </h1>

          {/* Plan Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setPlanMenuOpen(!planMenuOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 font-bold text-green-700 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 active:scale-95"
            >
              <span className="text-sm">
                {currentPlan === 'free' && '🔧 Free'}
                {currentPlan === 'pro' && '💎 Pro'}
                {currentPlan === 'fitness' && '🔥 Fitness'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${planMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {planMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border-2 border-green-300 shadow-lg overflow-hidden animate-slide-down z-50">
                {[
                  { id: 'free', name: '🔧 Free - 0€', desc: 'Gratuit' },
                  { id: 'pro', name: '💎 Pro - 4,99€', desc: '/mois' },
                  { id: 'fitness', name: '🔥 Fitness - 9,99€', desc: '/mois' },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id as 'free' | 'pro' | 'fitness')}
                    className={`w-full text-left px-4 py-3 font-bold transition-all duration-300 flex items-center justify-between ${
                      currentPlan === plan.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'text-slate-900 hover:bg-green-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black">{plan.name}</p>
                      <p className="text-xs opacity-75">{plan.desc}</p>
                    </div>
                    {currentPlan === plan.id && <span className="text-lg">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-green-100 border-2 border-green-300 lg:hidden hover:bg-green-200 transition-all duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-green-700" /> : <Menu className="w-6 h-6 text-green-700" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar */}
        <div
          className={`fixed lg:static w-64 h-screen bg-white border-r-2 border-green-200 p-4 overflow-y-auto transition-all duration-300 lg:translate-x-0 z-40 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold transition-all duration-300 hover:shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="pt-4 border-t-2 border-green-200">
              <p className="text-xs font-black text-slate-600 uppercase mb-3 pl-4">💱 Ajouter</p>
              <div className="space-y-2">
                <Link
                  href="/dashboard/camera"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-100 text-slate-900 font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="w-5 h-5 text-green-600" />
                  Caméra
                </Link>
                <Link
                  href="/dashboard/barcode"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-100 text-slate-900 font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Barcode className="w-5 h-5 text-emerald-600" />
                  Code-barres
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-green-200">
              <p className="text-xs font-black text-slate-600 uppercase pl-4">Scans</p>
              <div className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300">
                <p className="text-2xl font-black text-green-700">{scansRemaining}/{maxScans}</p>
                <p className="text-xs font-bold text-slate-600 mt-1">Restants aujourd'hui</p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-green-200 space-y-2">
              {currentPlan === 'fitness' && (
                <Link
                  href="/dashboard/coach"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-100 text-slate-900 font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Coach IA
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-100 text-slate-900 font-bold transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5 text-slate-600" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 text-red-600 transition-all duration-300 font-bold"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </nav>
        </div>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {/* Bienvenue */}
          <div className="mb-6 animate-fade-in">
            <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Bienvenue 👋</p>
            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-black text-slate-900">{currentUser?.email}</h2>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-600 uppercase">Scans</p>
                <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {scansRemaining}/{maxScans}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              {
                label: 'Calories',
                value: totalCalories,
                unit: `/ ${dailyGoals?.calories || 2000}`,
                color: 'from-orange-500 to-red-500',
                icon: Flame,
                progress: calorieProgress,
              },
              {
                label: 'Protéines',
                value: totalProtein.toFixed(0),
                unit: `/ ${dailyGoals?.protein || 150}g`,
                color: 'from-green-600 to-emerald-500',
                icon: Droplets,
                progress: proteinProgress,
              },
              {
                label: 'Glucides',
                value: totalCarbs.toFixed(0),
                unit: `/ ${dailyGoals?.carbs || 200}g`,
                color: 'from-amber-500 to-yellow-500',
                icon: Wheat,
                progress: carbsProgress,
              },
              {
                label: 'Lipides',
                value: totalFat.toFixed(0),
                unit: `/ ${dailyGoals?.fat || 65}g`,
                color: 'from-emerald-600 to-teal-500',
                icon: TrendingUp,
                progress: fatProgress,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="card border-2 border-green-200 hover:border-green-400 p-3 sm:p-4 animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-black text-slate-600 uppercase">
                      {stat.label}
                    </span>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-bold">{stat.unit}</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill" style={{ width: `${Math.min(stat.progress, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <Link
              href="/dashboard/camera"
              className="card border-2 border-green-300 hover:border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105 group p-4"
            >
              <div className="flex items-center gap-4">
                <Camera className="w-12 h-12 text-green-600 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase">Photo</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-green-600 transition-all duration-300">
                    📷 Caméra
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/barcode"
              className="card border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 hover:scale-105 group p-4"
            >
              <div className="flex items-center gap-4">
                <Barcode className="w-12 h-12 text-emerald-600 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase">Scan</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-all duration-300">
                    💱 Code
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Meals */}
          <div className="card border-2 border-green-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Repas d'aujourd'hui</h2>
              <span className="badge badge-primary text-xs sm:text-sm">{todaysMeals.length} repas</span>
            </div>

            {todaysMeals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-4">😲</p>
                <p className="text-slate-600 font-bold mb-2">Aucun repas ajouté</p>
                <p className="text-sm text-slate-500 mb-6">Commence en prenant une photo!</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Link href="/dashboard/camera" className="btn-primary text-sm font-bold py-2 px-4">
                    <Camera className="w-4 h-4" />
                    Camera
                  </Link>
                  <Link href="/dashboard/barcode" className="btn-secondary text-sm font-bold py-2 px-4">
                    <Barcode className="w-4 h-4" />
                    Code
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3 sm:p-4 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300 group hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 group-hover:text-green-600 transition-all duration-300 truncate">
                          {meal.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">
                          {meal.ingredients.map((i) => i.name).join(', ')}
                        </p>
                      </div>
                      <span className="badge badge-primary text-xs sm:text-sm font-black whitespace-nowrap">
                        {Math.round(meal.totalCalories)} kcal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
