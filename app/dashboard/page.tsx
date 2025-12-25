'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CameraScanner from '@/components/CameraScanner';
import BarcodeScanner from '@/components/BarcodeScanner';
import RecipeBuilder from '@/components/RecipeBuilder';
import Recipes from '@/components/Recipes';
import Coach from '@/components/Coach';
import History from '@/components/History';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('scanner');

  const tabs = [
    { id: 'scanner', icon: '📸', label: 'Scanner' },
    { id: 'barcode', icon: '📊', label: 'Code-barres' },
    { id: 'recipe', icon: '👨‍🍳', label: 'Recipe Builder' },
    { id: 'recipes', icon: '📚', label: 'Mes Recettes' },
    { id: 'coach', icon: '🏋️', label: 'Coach' },
    { id: 'history', icon: '📜', label: 'Historique' },
  ];

  const renderContent = () => {
    if (activeTab === 'scanner') return <CameraScanner />;
    if (activeTab === 'barcode') return <BarcodeScanner />;
    if (activeTab === 'recipe') return <RecipeBuilder />;
    if (activeTab === 'recipes') return <Recipes />;
    if (activeTab === 'coach') return <Coach />;
    if (activeTab === 'history') return <History />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#1f8b8f] to-[#32b8c6] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }
              `}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
