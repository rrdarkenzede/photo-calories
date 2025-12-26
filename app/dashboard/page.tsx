'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { PlanSwitcher } from '@/components/PlanSwitcher';
import { PLANS } from '@/lib/plans';
import { Camera, Upload, History, BarChart3, ChefHat, Settings, Flame, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentPlan, todayStats, dailyGoals, scansUsedToday } = useAppStore();
  const planInfo = PLANS[currentPlan];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <PlanSwitcher />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Tableau de Bord
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Plan: <span className="font-semibold uppercase">{currentPlan}</span>
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Calories consommées */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Consommées</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {todayStats?.consumed.calories || 0}
              </p>
              <p className="text-xs text-slate-500">calories</p>
            </div>

            {/* Calories brûlées (Fitness only) */}
            {currentPlan === 'fitness' && (
              <div className="space-y-2 border-l border-slate-200 dark:border-slate-700 pl-6">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Brûlées</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.burned || 0}
                </p>
                <p className="text-xs text-slate-500">calories</p>
              </div>
            )}

            {/* Net / Objectif */}
            <div className="space-y-2 border-l border-slate-200 dark:border-slate-700 pl-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Objectif</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {dailyGoals.calories}
              </p>
              <p className="text-xs text-slate-500">
                Reste:{' '}
                <span className="font-semibold">
                  {Math.max(0, dailyGoals.calories - (todayStats?.consumed.calories || 0))}
                </span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((todayStats?.consumed.calories || 0) / dailyGoals.calories) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {((todayStats?.consumed.calories || 0) / dailyGoals.calories * 100).toFixed(0)}% de ton objectif
            </p>
          </div>
        </div>

        {/* Macros (Pro & Fitness) */}
        {planInfo.features.macros && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Macronutriments</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Protéines</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.protein || 0}g
                </p>
                <p className="text-xs text-slate-500">Objectif: {dailyGoals.protein}g</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Glucides</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.carbs || 0}g
                </p>
                <p className="text-xs text-slate-500">Objectif: {dailyGoals.carbs}g</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Lipides</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.fat || 0}g
                </p>
                <p className="text-xs text-slate-500">Objectif: {dailyGoals.fat}g</p>
              </div>
            </div>
          </div>
        )}

        {/* Micros (Fitness only) */}
        {planInfo.features.micros && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Micronutriments</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fibres</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.fiber || 0}g
                </p>
                <p className="text-xs text-slate-500">Objectif: {dailyGoals.fiber}g</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sucre</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.sugar || 0}g
                </p>
                <p className="text-xs text-slate-500">Objectif: &lt;{dailyGoals.sugar}g</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sel</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {todayStats?.consumed.sodium || 0}mg
                </p>
                <p className="text-xs text-slate-500">&lt;{dailyGoals.sodium}mg</p>
              </div>
            </div>
          </div>
        )}

        {/* Scans counter */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Scans utilisés aujourd\'hui
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {scansUsedToday} / {planInfo.scansPerDay}
            </span>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/dashboard/scanner"
            className="flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-semibold transition-all group"
          >
            <Camera className="w-6 h-6 group-hover:scale-110 transition" />
            Scan ton plat
          </Link>
          <Link
            href="/dashboard/barcode"
            className="flex items-center justify-center gap-3 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-4 rounded-lg font-semibold transition-all group"
          >
            <Upload className="w-6 h-6 group-hover:scale-110 transition" />
            Code-barres
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/history"
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <History className="w-5 h-5" />
            Historique
          </Link>
          {planInfo.features.analytics && (
            <Link
              href="/dashboard/analytics"
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-lg font-medium transition"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
          )}
          {planInfo.features.recipeBuilder && (
            <Link
              href="/dashboard/recipes"
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-lg font-medium transition"
            >
              <ChefHat className="w-5 h-5" />
              Recettes
            </Link>
          )}
          {planInfo.features.coachAI && (
            <Link
              href="/dashboard/coach"
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-lg font-medium transition"
            >
              <Target className="w-5 h-5" />
              Coach IA
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
