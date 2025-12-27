'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Type, Search } from 'lucide-react';

interface BarcodeModalProps {
  onClose: () => void;
  onSubmit: (barcode: string) => void;
  plan: string;
}

export default function BarcodeModal({ onClose, onSubmit, plan }: BarcodeModalProps) {
  const [mode, setMode] = useState<'camera' | 'manual' | 'search' | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onSubmit(manualCode.trim());
      onClose();
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      onSubmit(searchQuery.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Code-barres</h2>

        {!mode ? (
          <div className="space-y-3">
            <button
              onClick={() => setMode('camera')}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-3"
            >
              <Camera className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">Scanner la caméra</span>
            </button>

            <button
              onClick={() => setMode('manual')}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition flex items-center gap-3"
            >
              <Type className="w-6 h-6 text-green-600" />
              <span className="font-bold text-gray-900">Taper manuellement</span>
            </button>

            <button
              onClick={() => setMode('search')}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition flex items-center gap-3"
            >
              <Search className="w-6 h-6 text-purple-600" />
              <span className="font-bold text-gray-900">Chercher par nom</span>
            </button>
          </div>
        ) : mode === 'camera' ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold mb-4">Fonction caméra non configurée</p>
            <button
              onClick={() => setMode(null)}
              className="px-6 py-2 bg-gray-200 text-gray-900 font-bold rounded-full"
            >
              Retour
            </button>
          </div>
        ) : mode === 'manual' ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Exemple: 3274080005003"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500 font-mono text-gray-900 placeholder:text-gray-500"
              autoFocus
            />
            <button
              onClick={handleManualSubmit}
              disabled={!manualCode.trim()}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 transition"
            >
              Rechercher
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full py-3 bg-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-300 transition"
            >
              Retour
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ex: yaourt nature, lait..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            <button
              onClick={handleSearchSubmit}
              disabled={!searchQuery.trim()}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 transition"
            >
              Rechercher
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full py-3 bg-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-300 transition"
            >
              Retour
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
