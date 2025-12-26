'use client';

import React, { useState } from 'react';
import { X, Search, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface ManualBarcodeInputProps {
  onSubmit: (barcode: string) => void;
  onClose: () => void;
}

export default function ManualBarcodeInput({ onSubmit, onClose }: ManualBarcodeInputProps) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate barcode
    if (barcode.length < 8) {
      setError('Code-barres trop court (min 8 chiffres)');
      return;
    }
    
    if (!/^\d+$/.test(barcode)) {
      setError('Le code-barres ne doit contenir que des chiffres');
      return;
    }
    
    onSubmit(barcode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Keyboard className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Saisie manuelle</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Code-barres (EAN-13, UPC-A, etc.)
            </label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
                setError(null);
              }}
              placeholder="ex: 3017620422003"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg tracking-wider"
              autoFocus
              maxLength={20}
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          {/* Examples */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Exemples:</p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setBarcode('3017620422003')}
                className="block text-sm text-blue-600 hover:underline"
              >
                3017620422003 (Nutella)
              </button>
              <button
                type="button"
                onClick={() => setBarcode('5449000054227')}
                className="block text-sm text-blue-600 hover:underline"
              >
                5449000054227 (Coca-Cola)
              </button>
              <button
                type="button"
                onClick={() => setBarcode('8076809513203')}
                className="block text-sm text-blue-600 hover:underline"
              >
                8076809513203 (Barilla Pâtes)
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
          >
            <Search className="w-5 h-5" />
            Rechercher
          </motion.button>
        </form>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Cherche dans la base OpenFoodFacts (700k+ produits)
        </p>
      </motion.div>
    </div>
  );
}
