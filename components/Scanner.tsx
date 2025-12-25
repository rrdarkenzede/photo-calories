'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { fetchProductByBarcode, searchProducts, formatBarcodeScan } from '@/lib/api';

interface ScannerProps {
  plan: string;
}

export default function Scanner({ plan }: ScannerProps) {
  const { addScan, scansToday, getScansLimit, plan: userPlan } = useStore();
  const [barcode, setBarcode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const scanLimit = getScansLimit();
  const canScan = scansToday < scanLimit;

  const handleBarcodeScan = async () => {
    if (!barcode.trim()) return;
    if (!canScan) {
      alert(`Limite atteinte: ${scansToday}/${scanLimit} scans aujourd'hui`);
      return;
    }

    setLoading(true);
    const product = await fetchProductByBarcode(barcode);
    setLoading(false);

    if (product) {
      addScan(formatBarcodeScan(product));
      alert(`✅ ${product.name} ajouté!`);
      setBarcode('');
    } else {
      alert('❌ Produit non trouvé');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!canScan) {
      alert(`Limite atteinte: ${scansToday}/${scanLimit} scans aujourd'hui`);
      return;
    }

    setLoading(true);
    const products = await searchProducts(searchQuery);
    setResults(products);
    setLoading(false);
  };

  const selectProduct = (product: any) => {
    addScan(formatBarcodeScan(product));
    alert(`✅ ${product.name} ajouté!`);
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#1f8b8f] mb-2">📱 Scanner Produits</h2>
      
      <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
        Scans utilisés: <span className="font-bold">{scansToday}/{scanLimit}</span>
        {userPlan === 'FREE' && ' (Upgrade pour plus de scans)'}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Code-barres
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
              placeholder="Scanne ou saisis un code-barres"
              disabled={!canScan}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8b8f] disabled:bg-gray-100"
            />
            <button
              onClick={handleBarcodeScan}
              disabled={loading || !canScan}
              className="px-6 py-2 bg-[#1f8b8f] text-white font-semibold rounded-lg hover:bg-[#1f8b8f]/90 disabled:opacity-50"
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ou cherche un produit
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Lait, yaourt, pain..."
              disabled={!canScan}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8b8f] disabled:bg-gray-100"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !canScan}
              className="px-6 py-2 bg-[#1f8b8f] text-white font-semibold rounded-lg hover:bg-[#1f8b8f]/90 disabled:opacity-50"
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Résultats ({results.length})</h3>
            <div className="space-y-2">
              {results.map((product) => (
                <button
                  key={product.barcode}
                  onClick={() => selectProduct(product)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-gray-800">{product.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {product.kcal} kcal/100g • P: {product.protein}g • C: {product.carbs}g • F: {product.fat}g
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
