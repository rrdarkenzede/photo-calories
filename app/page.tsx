'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import UploadPhoto from '@/components/UploadPhoto';
import CameraScanner from '@/components/CameraScanner';
import BarcodeScanner from '@/components/BarcodeScanner';
import RecipeBuilder from '@/components/RecipeBuilder';
import Recipes from '@/components/Recipes';
import Coach from '@/components/Coach';
import History from '@/components/History';
import GoalTracker from '@/components/GoalTracker';
import { useStore } from '@/store/useStore';

type Tab = 'upload' | 'camera' | 'barcode' | 'recipe' | 'recipes' | 'coach' | 'history';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const { plan } = useStore();

  const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
    { id: 'upload', label: 'Upload Photo', icon: '📸', color: 'from-cyan-500 to-blue-500' },
    { id: 'camera', label: 'Caméra Live', icon: '📹', color: 'from-blue-500 to-indigo-500' },
    { id: 'barcode', label: 'Code-barres', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { id: 'recipe', label: 'Créer Recette', icon: '👨‍🍳', color: 'from-orange-500 to-red-500' },
    { id: 'recipes', label: 'Mes Recettes', icon: '📖', color: 'from-green-500 to-emerald-500' },
    { id: 'coach', label: 'Coach', icon: '💪', color: 'from-yellow-500 to-orange-500' },
    { id: 'history', label: 'Historique', icon: '📋', color: 'from-pink-500 to-rose-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadPhoto />;
      case 'camera':
        return <CameraScanner />;
      case 'barcode':
        return <BarcodeScanner />;
      case 'recipe':
        return <RecipeBuilder />;
      case 'recipes':
        return <Recipes />;
      case 'coach':
        return <Coach />;
      case 'history':
        return <History />;
      default:
        return <UploadPhoto />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Navigation Principale - Enhanced */}
        <nav className="sticky top-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-orange-500/20 shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-4 min-w-max px-6 max-w-7xl mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap
                    flex items-center gap-2 text-sm md:text-base
                    ${activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-orange-500/50 scale-105`
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/40 hover:text-white border border-transparent hover:border-orange-500/30'
                    }
                  `}
                >
                  {activeTab === tab.id && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 animate-pulse" />
                  )}
                  <span className="text-lg">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Contenu Principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </main>

        {/* Footer Élégant - Enhanced */}
        <footer className="mt-auto bg-gradient-to-t from-black via-gray-900/50 to-transparent border-t border-orange-500/20 pt-12 pb-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Principale Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Logo & Description */}
              <div className="text-center md:text-left group">
                <h3 className="text-2xl font-bold gradient-text mb-2 group-hover:animate-glow transition-all">
                  PhotoCalories
                </h3>
                <p className="text-gray-400 text-sm">
                  🔍 Scanne • 📋 Analyse • 🎯 Optimise
                </p>
              </div>

              {/* Plan Actuel */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Plan actuel:</p>
                <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-500/30 hover:border-orange-500/60 transition-all">
                  {plan === 'free' && <span className="text-xl">🆓</span>}
                  {plan === 'pro' && <span className="text-xl">⭐</span>}
                  {plan === 'fitness' && <span className="text-xl">💎</span>}
                  <span className="text-lg font-bold text-orange-400 uppercase">{plan}</span>
                </div>
              </div>

              {/* Conseil */}
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all">
                  <span className="text-xl animate-pulse">💡</span>
                  <span className="text-xs text-purple-300 font-semibold">
                    Photo claire = Meilleure détection
                  </span>
                </div>
              </div>
            </div>

            {/* Divider avec gradient */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-6" />

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs text-center md:text-left hover:text-gray-400 transition-colors">
                © 2025 PhotoCalories • Tous droits réservés
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                <span>Fait avec</span>
                <span className="text-red-500 text-lg animate-pulse">❤</span>
                <span>pour les passionnés de fitness</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
