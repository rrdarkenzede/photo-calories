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
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      router.push('/login');
    }
    setIsDark(document.documentElement.classList.contains('dark'));
  }, [currentUser, router]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">Chargement...</p>
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Mobile Menu */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white lg:hidden hover:scale-110 transition-all duration-300 shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Header */}
      <div className="border-b-2 border-blue-200 dark:border-blue-900 sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              📸 PhotoCalories
            </h1>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">👋 {currentUser?.email}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 font-bold text-lg"
          >
            {isDark ? <Sun className="w-6 h-6 text-orange-500" /> : <Moon className="w-6 h-6 text-blue-600" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed lg:static w-64 h-screen bg-white dark:bg-slate-900 border-r-2 border-blue-200 dark:border-blue-900 p-4 overflow-y-auto transition-all duration-300 lg:translate-x-0 z-40 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold transition-all duration-300 hover:shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="pt-4 border-t-2 border-blue-200 dark:border-blue-900">
              <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase mb-3 pl-4">
                💱 Ajouter
              </p>
              <div className="space-y-2">
                <Link
                  href="/dashboard/camera"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Caméra
                </Link>
                <Link
                  href="/dashboard/barcode"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Barcode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Code-barres
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-blue-200 dark:border-blue-900">
              <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase pl-4">
                🎯 Plan: <span className="text-blue-600 dark:text-blue-400 capitalize">{currentPlan}</span>
              </p>
            </div>

            <div className="pt-4 border-t-2 border-blue-200 dark:border-blue-900 space-y-2">
              {currentPlan === 'fitness' && (
                <Link
                  href="/dashboard/coach"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Coach IA
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-300 font-bold"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </nav>
        </div>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
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
                color: 'from-blue-600 to-cyan-500',
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
                  className="card border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 p-3 sm:p-4 animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-400 uppercase">
                      {stat.label}
                    </span>
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 font-bold">
                    {stat.unit}
                  </p>
                  <div className="progress-bar mt-2">
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
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <Link
              href="/dashboard/camera"
              className="card border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">
                    Photo
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                    📷 Caméra
                  </p>
                </div>
                <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              </div>
            </Link>

            <Link
              href="/dashboard/barcode"
              className="card border-2 border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">
                    Scan
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300">
                    💱 Code-barres
                  </p>
                </div>
                <Barcode className="w-10 h-10 text-emerald-600 dark:text-emerald-400 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              </div>
            </Link>
          </div>

          {/* Meals */}
          <div className="card border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Repas d'aujourd'hui</h2>
              <span className="badge badge-primary text-xs sm:text-sm">{todaysMeals.length} repas</span>
            </div>

            {todaysMeals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-4">😲</p>
                <p className="text-slate-600 dark:text-slate-400 font-bold mb-2">Aucun repas ajouté</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">Commence en prenant une photo!</p>
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
                    className="p-3 sm:p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 group hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 truncate">
                          {meal.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">
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
