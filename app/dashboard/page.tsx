'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import {
  Plus,
  Barcode,
  Camera,
  Settings,
  TrendingUp,
  Zap,
  Flame,
  Droplets,
  Wheat,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const {
    currentUser,
    currentPlan,
    dailyGoals,
    meals,
    logout,
    totalScans,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      router.push('/');
    }
    setIsDark(document.documentElement.classList.contains('dark'));
  }, [currentUser, router]);

  if (!mounted) return null;

  const today = new Date().toLocaleDateString('fr-FR');
  const todaysMeals = meals.filter(
    (m) => new Date(m.date).toLocaleDateString('fr-FR') === today
  );

  const totalCalories = todaysMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = todaysMeals.reduce((acc, m) => acc + m.totalProtein, 0);
  const totalCarbs = todaysMeals.reduce((acc, m) => acc + m.totalCarbs, 0);
  const totalFat = todaysMeals.reduce((acc, m) => acc + m.totalFat, 0);

  const calorieProgress = dailyGoals
    ? (totalCalories / dailyGoals.calories) * 100
    : 0;
  const proteinProgress = dailyGoals ? (totalProtein / dailyGoals.protein) * 100 : 0;
  const carbsProgress = dailyGoals ? (totalCarbs / dailyGoals.carbs) * 100 : 0;
  const fatProgress = dailyGoals ? (totalFat / dailyGoals.fat) * 100 : 0;

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 lg:hidden hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📸 PhotoCalories</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">👋 {currentUser?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed lg:static w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 overflow-y-auto transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40`}
        >
          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-3">
                Ajouter un repas
              </p>
              <div className="space-y-2">
                <Link
                  href="/dashboard/camera"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="w-5 h-5" />
                  <span>Caméra</span>
                </Link>
                <Link
                  href="/dashboard/barcode"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Barcode className="w-5 h-5" />
                  <span>Code-barres</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-3">
                Plan: <span className="text-blue-600 dark:text-blue-400">{currentPlan}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {currentPlan === 'fitness' && (
                <Link
                  href="/dashboard/coach"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Coach IA</span>
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Calories',
                value: totalCalories,
                unit: `/ ${dailyGoals?.calories || 2000}`,
                color: 'from-orange-600 to-red-600',
                icon: Flame,
                progress: calorieProgress,
              },
              {
                label: 'Protéines',
                value: totalProtein.toFixed(1),
                unit: `/ ${dailyGoals?.protein || 150}g`,
                color: 'from-blue-600 to-cyan-600',
                icon: Droplets,
                progress: proteinProgress,
              },
              {
                label: 'Glucides',
                value: totalCarbs.toFixed(1),
                unit: `/ ${dailyGoals?.carbs || 200}g`,
                color: 'from-amber-600 to-yellow-600',
                icon: Wheat,
                progress: carbsProgress,
              },
              {
                label: 'Lipides',
                value: totalFat.toFixed(1),
                unit: `/ ${dailyGoals?.fat || 65}g`,
                color: 'from-emerald-600 to-teal-600',
                icon: TrendingUp,
                progress: fatProgress,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="card animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </span>
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {stat.unit}
                  </p>
                  <div className="progress-bar mt-3">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(stat.progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/dashboard/camera"
              className="card hover:shadow-lg transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Photographier un repas
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    📷 Caméra
                  </p>
                </div>
                <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 opacity-50 group-hover:opacity-100 transition" />
              </div>
            </Link>

            <Link
              href="/dashboard/barcode"
              className="card hover:shadow-lg transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Scanner un code-barres
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    💱 Code-barres
                  </p>
                </div>
                <Barcode className="w-8 h-8 text-emerald-600 dark:text-emerald-400 opacity-50 group-hover:opacity-100 transition" />
              </div>
            </Link>
          </div>

          {/* Meals List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Repas d'aujourd'hui</h2>
              <span className="badge badge-primary">{todaysMeals.length} repas</span>
            </div>

            {todaysMeals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 mb-4">😲 Aucun repas ajouté aujourd'hui</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                  Commence en prenant une photo ou en scannant un code-barres!
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/camera" className="btn-primary">
                    <Camera className="w-4 h-4" />
                    Camera
                  </Link>
                  <Link href="/dashboard/barcode" className="btn-secondary">
                    <Barcode className="w-4 h-4" />
                    Code-barres
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {meal.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {meal.ingredients.map((i) => i.name).join(', ')}
                        </p>
                      </div>
                      <span className="badge badge-primary">
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
