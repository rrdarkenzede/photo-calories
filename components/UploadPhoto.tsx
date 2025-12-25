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
      alert('Photo analysee!');
      setPreview(null);
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-dashed border-blue-300">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Prendre une Photo</h2>
          <p className="text-gray-600 mb-6">Selectionne une image de ton repas</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddScan()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            Selectionner une photo
          </button>
        </div>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
          </button>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-900">
          <strong>Astuce:</strong> Prends une photo claire de ton repas avec bonne luminosite!
        </p>
      </div>
    </div>
  );
}
