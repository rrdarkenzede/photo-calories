'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import type { Scan } from '@/types';

export default function UploadPhoto() {
  const { plan, addScan, canAddScan } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockScan: Scan = {
        id: `photo-${Date.now()}`,
        productName: 'Pizza',
        kcal: 532,
        protein: 22,
        carbs: 66,
        fat: 20,
        timestamp: new Date().toISOString(),
        countsTowardGoal: true,
        type: 'photo',
      };
      addScan(mockScan);
      alert('✅ Photo analysée!');
      setPreview(null);
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upload Zone */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        
        <div className="relative bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-indigo-500/20 rounded-3xl p-12 border-2 border-dashed border-blue-400/50 group-hover:border-blue-400/80 transition-all duration-300 backdrop-blur-md">
          <div className="text-center space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg animate-pulse" />
              <div className="relative text-7xl animate-float">📸</div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">Uploader une Photo</h2>
              <p className="text-gray-300 text-lg">
                Sélectionne une image claire de ton repas
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddScan()}
              className={`
                relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${canAddScan()
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 cursor-pointer'
                  : 'bg-gray-500/30 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {canAddScan() ? '📋 Sélectionner une photo' : '🚭 Limite atteinte'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="space-y-4 animate-slideInUp">
          {/* Image Preview */}
          <div className="relative group rounded-2xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-cyan-500/20 z-10 pointer-events-none" />
            <img
              src={preview}
              alt="Preview"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 z-20 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              ×
            </button>
          </div>

          {/* Analysis Info */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 backdrop-blur-md">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span>Vision AI va analyser tes macros</span>
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${isAnalyzing
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 hover:-translate-y-1 active:translate-y-0'
              }
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyse en cours...
              </span>
            ) : (
              '✅ Analyser la photo'
            )}
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-4 backdrop-blur-md hover:border-blue-400/60 transition-all">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-sm text-gray-300 font-semibold">Bonne luminosité</p>
          <p className="text-xs text-gray-400 mt-1">Utilise la lumière naturelle</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 backdrop-blur-md hover:border-purple-400/60 transition-all">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-sm text-gray-300 font-semibold">Image claire</p>
          <p className="text-xs text-gray-400 mt-1">Cadre bien ton repas</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-md hover:border-green-400/60 transition-all">
          <div className="text-2xl mb-2">🙋</div>
          <p className="text-sm text-gray-300 font-semibold">Proche du repas</p>
          <p className="text-xs text-gray-400 mt-1">Détail au premier plan</p>
        </div>
      </div>
    </div>
  );
}
