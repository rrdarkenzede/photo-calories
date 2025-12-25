'use client';

import React, { useState } from 'react';

type Tab = 'dashboard' | 'scanner' | 'recipes' | 'history' | 'stats' | 'settings';
type Plan = 'free' | 'pro' | 'fitness';

const PLAN_FEATURES = {
  free: { scans: 2, features: ['Photo', 'Barcode'] },
  pro: { scans: 10, features: ['Photo', 'Barcode', 'Recipes', 'History'] },
  fitness: { scans: 40, features: ['Photo', 'Barcode', 'Recipes', 'History', 'Coach'] },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentPlan, setCurrentPlan] = useState<Plan>('free');
  const [todayCalories, setTodayCalories] = useState(0);
  const [scansToday, setScansToday] = useState(0);

  const maxScans = PLAN_FEATURES[currentPlan].scans;
  const scansRemaining = maxScans - scansToday;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-gray-900 to-gray-900/50 backdrop-blur border-b border-orange-500/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black">
                <span className="text-white">Photo</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Calories</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">Scan • Analyze • Track</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-400">{todayCalories}</p>
              <p className="text-xs text-gray-400">kcal today</p>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="flex gap-2">
            {(['free', 'pro', 'fitness'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setCurrentPlan(plan)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentPlan === plan
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {plan === 'free' && '🆓'} {plan === 'pro' && '⭐'} {plan === 'fitness' && '💎'} {plan.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Scan Limit */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Today's Scans</h2>
                <span className="text-2xl font-bold text-orange-400">{scansRemaining}/{maxScans}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${(scansToday / maxScans) * 100}%` }}
                />
              </div>
            </div>

            {/* Macro Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Protein', value: 0, unit: 'g', icon: '💪', color: 'from-blue-600' },
                { label: 'Carbs', value: 0, unit: 'g', icon: '🥦', color: 'from-yellow-600' },
                { label: 'Fat', value: 0, unit: 'g', icon: '🥑', color: 'from-orange-600' },
              ].map((macro) => (
                <div key={macro.label} className={`bg-gradient-to-br ${macro.color} to-gray-900 rounded-xl p-4 border border-white/10`}>
                  <p className="text-2xl mb-1">{macro.icon}</p>
                  <p className="text-xs text-gray-300">{macro.label}</p>
                  <p className="text-2xl font-bold">{macro.value}{macro.unit}</p>
                </div>
              ))}
            </div>

            {/* Big Scanner Button */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="w-full py-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-3"
            >
              📸
              Take a Photo
            </button>

            {/* Plan Features */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="font-bold mb-3">Current Plan Features</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {PLAN_FEATURES[currentPlan].features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-orange-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50 text-center">
              <p className="text-6xl mb-4">📸</p>
              <h2 className="text-2xl font-bold mb-2">Camera Scanner</h2>
              <p className="text-gray-400 mb-6">Take a photo of your food</p>
              <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-all">
                📸 Open Camera
              </button>
            </div>

            {currentPlan !== 'free' && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50 text-center">
                <p className="text-6xl mb-4">🍳</p>
                <h2 className="text-2xl font-bold mb-2">Create Recipe</h2>
                <p className="text-gray-400 mb-6">Add ingredients manually</p>
                <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-all">
                  🍳 Create Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="animate-fadeIn">
            {currentPlan === 'free' ? (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center">
                <p className="text-6xl mb-4">🔒</p>
                <p className="text-gray-400 mb-4">Recipes are available on PRO plan</p>
                <button onClick={() => setCurrentPlan('pro')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                  Upgrade to PRO
                </button>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center text-gray-400">
                <p className="text-6xl mb-4">🍳</p>
                <p>No recipes yet. Create your first recipe!</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            {currentPlan === 'free' ? (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center">
                <p className="text-6xl mb-4">📋</p>
                <p className="text-gray-400 mb-4">History is available on PRO plan</p>
                <button onClick={() => setCurrentPlan('pro')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                  Upgrade to PRO
                </button>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center text-gray-400">
                <p className="text-6xl mb-4">📝</p>
                <p>No scans yet. Start by taking a photo!</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="animate-fadeIn">
            {currentPlan === 'free' ? (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center">
                <p className="text-6xl mb-4">⚡</p>
                <p className="text-gray-400 mb-4">Stats are available on PRO plan</p>
                <button onClick={() => setCurrentPlan('pro')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                  Upgrade to PRO
                </button>
              </div>
            ) : currentPlan === 'fitness' ? (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center text-gray-400">
                <p className="text-6xl mb-4">📊</p>
                <p>Advanced stats coming soon!</p>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 text-center text-gray-400">
                <p className="text-6xl mb-4">📈</p>
                <p>Stats will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <h3 className="font-bold mb-4">Settings</h3>
              <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-all">
                ⚙️ Profile Settings
              </button>
              <p className="text-xs text-gray-500 mt-4">Current Plan: <span className="text-orange-400 font-bold">{currentPlan.toUpperCase()}</span></p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/50 backdrop-blur border-t border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-around">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'scanner', icon: '📸', label: 'Scanner' },
            { id: 'recipes', icon: '🍳', label: 'Recipes' },
            { id: 'history', icon: '📋', label: 'History' },
            { id: 'stats', icon: '📈', label: 'Stats' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all text-xs font-semibold ${
                activeTab === item.id
                  ? 'bg-orange-600/30 text-orange-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
