'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import type { Scan } from '@/store/useStore';

interface Product {
  code: string;
  name: string;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  quantity?: number;
  unit?: string;
}

export default function BarcodeScanner() {
  const { plan, canAddScan, addScan } = useStore();
  const [code, setCode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [countsTowardGoal, setCountsTowardGoal] = useState(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchProduct = async (barcode: string) => {
    if (!barcode.trim()) {
      setError('❌ Code-barres vide');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const response = await fetch(`/api/barcode?code=${encodeURIComponent(barcode)}`);
      const data = await response.json();

      if (data.product) {
        setProduct(data.product);
      } else {
        setError('❌ Produit non trouvé');
      }
    } catch (err) {
      setError('❌ Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      await searchProduct(code);
    }
  };

  const handleAddProduct = () => {
    if (!product || !canAddScan()) {
      alert('❌ Impossible d\'ajouter le produit');
      return;
    }

    const scan: Scan = {
      id: `barcode-${Date.now()}`,
      productName: product.name,
      kcal: product.kcal * quantity,
      protein: (product.protein || 0) * quantity,
      carbs: (product.carbs || 0) * quantity,
      fat: (product.fat || 0) * quantity,
      timestamp: new Date().toISOString(),
      countsTowardGoal,
      type: 'barcode',
    };

    addScan(scan);
    alert(`✅ ${product.name} ajouté!`);
    setCode('');
    setProduct(null);
    setQuantity(1);
    inputRef.current?.focus();
  };

  if (plan === 'free') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-300">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-3xl font-bold text-purple-900 mb-3">Scanner Code-Barres</h2>
        <p className="text-purple-700 mb-6">
          Scanne les codes-barres pour ajouter rapidement des produits!
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all">
          💎 Upgrade vers PRO
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
        <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
          <span className="text-4xl">📊</span>
          Scanner un Code-Barres
        </h2>

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Code-Barres
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Scanne ou tape le code..."
                className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {loading ? '⏳' : '🔍'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded text-red-700">
            {error}
          </div>
        )}

        {product && (
          <div className="mt-6 p-6 bg-white rounded-xl border-2 border-green-200">
            <h3 className="text-xl font-bold mb-4">✅ Produit Trouvé</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Nom:</p>
                <p className="text-lg font-bold text-gray-800">{product.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Calories</p>
                <p className="text-xl font-bold text-orange-600">{product.kcal}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Code</p>
                <p className="text-lg font-mono text-gray-700">{product.code}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantité
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                checked={countsTowardGoal}
                onChange={(e) => setCountsTowardGoal(e.target.checked)}
                className="w-5 h-5 rounded accent-green-600"
              />
              <label className="text-gray-700 font-semibold">
                {countsTowardGoal ? '✅' : '⭕'} Compter vers mon objectif
              </label>
            </div>

            <button
              onClick={handleAddProduct}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              ✅ Ajouter le produit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
