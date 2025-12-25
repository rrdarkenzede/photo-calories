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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'upload', label: 'Upload Photo', icon: '📸' },
    { id: 'camera', label: 'Caméra Live', icon: '📹' },
    { id: 'barcode', label: 'Code-barres', icon: '📊' },
    { id: 'recipe', label: 'Créer Recette', icon: '👨‍🍳' },
    { id: 'recipes', label: 'Mes Recettes', icon: '📖' },
    { id: 'coach', label: 'Coach', icon: '💪' },
    { id: 'history', label: 'Historique', icon: '📋' },
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />

      {/* Navigation Principale */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-orange-500/30 shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 p-4 min-w-max px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap
                  flex items-center gap-2 text-sm md:text-base
                  ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
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

      {/* Footer Élégant */}
      <footer className="mt-auto bg-gradient-to-t from-black via-gray-900/50 to-transparent border-t border-orange-500/20 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Principale Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
                PhotoCalories
              </h3>
              <p className="text-gray-400 text-sm">
                Scanne • Analyse • Optimise
              </p>
            </div>

            {/* Plan Actuel */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Plan actuel:</p>
              <p className="text-xl font-bold text-orange-400">{plan}</p>
            </div>

            {/* Conseil */}
            <div className="text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/30">
                <span className="text-xl">💡</span>
                <span className="text-xs text-orange-300 font-semibold">
                  Photo claire = Meilleure détection
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-6" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © 2025 PhotoCalories • Tous droits réservés
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Fait avec</span>
              <span className="text-red-500 text-lg animate-pulse">❤</span>
              <span>pour les passionnés de fitness</span>
            </div>
          </div>

          {/* Gradient Background Effect */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      </footer>

      {/* CSS pour animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
