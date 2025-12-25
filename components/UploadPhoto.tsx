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
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        
        <div className="relative bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-3xl p-12 border-2 border-dashed border-blue-500/50 group-hover:border-blue-400/80 transition-all duration-300 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Icon */}
            <div className="text-7xl animate-bounce">📸</div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">Uploader une Photo</h2>
              <p className="text-gray-400 text-lg">
                Sélectionne une image claire de ton repas
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddScan()}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${canAddScan()
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 cursor-pointer'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {canAddScan() ? '📸 Sélectionner une photo' : '🚫 Limite atteinte'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="space-y-4 animate-fadeIn">
          {/* Image Preview */}
          <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-blue-500/50 transition-all">
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
              className="absolute top-4 right-4 z-20 bg-red-600/80 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              ×
            </button>
          </div>

          {/* Analysis Info */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-lg">🤖</span>
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
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
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
        {[
          { icon: '📷', title: 'Bonne luminosité', desc: 'Utilise la lumière naturelle' },
          { icon: '📋', title: 'Image claire', desc: 'Cadre bien ton repas' },
          { icon: '🤞', title: 'Proche du repas', desc: 'Détail au premier plan' },
        ].map((tip, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-gray-700/20"
          >
            <div className="text-3xl mb-3">{tip.icon}</div>
            <p className="text-sm font-bold text-gray-200 mb-1">{tip.title}</p>
            <p className="text-xs text-gray-400">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
