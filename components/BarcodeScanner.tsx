'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { searchProductByBarcode } from '@/lib/openfoodfacts';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export default function BarcodeScanner() {
  const { plan, addScan, canAddScan } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [countsTowardGoal, setCountsTowardGoal] = useState(true);
  const [quantity, setQuantity] = useState(100);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);

        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        codeReader.decodeFromVideoDevice(
          null,
          videoRef.current,
          async (result, error) => {
            if (result) {
              const barcode = result.getText();
              console.log('✅ Code-barres détecté:', barcode);
              stopScanning();
              await handleBarcodeDetected(barcode);
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error('Erreur scan:', error);
            }
          }
        );
      }
    } catch (err) {
      console.error('Erreur caméra:', err);
      setError('❌ Impossible d\'accéder à la caméra. Vérifie les permissions.');
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const handleBarcodeDetected = async (barcode: string) => {
    if (!canAddScan()) {
      alert('🚫 Limite de scans quotidiens atteinte! Upgrade ton plan.');
      return;
    }

    setLoading(true);

    try {
      const product = await searchProductByBarcode(barcode);

      if (!product) {
        alert('❌ Produit non trouvé dans OpenFoodFacts. Essaie la saisie manuelle.');
        setLoading(false);
        return;
      }

      setScannedProduct(product);
    } catch (error) {
      console.error('Erreur recherche produit:', error);
      alert('⚠️ Erreur lors de la recherche. Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualBarcode.trim()) {
      alert('❌ Entre un code-barres valide');
      return;
    }

    await handleBarcodeDetected(manualBarcode.trim());
  };

  const handleSaveToHistory = () => {
    if (!scannedProduct) return;

    const multiplier = quantity / 100;

    addScan({
      id: `scan-${Date.now()}`,
      productName: scannedProduct.brand
        ? `${scannedProduct.brand} - ${scannedProduct.name}`
        : scannedProduct.name,
      kcal: scannedProduct.kcal * multiplier,
      protein: scannedProduct.protein * multiplier,
      carbs: scannedProduct.carbs * multiplier,
      fat: scannedProduct.fat * multiplier,
      fiber: scannedProduct.fiber ? scannedProduct.fiber * multiplier : undefined,
      sugar: scannedProduct.sugar ? scannedProduct.sugar * multiplier : undefined,
      salt: scannedProduct.salt ? scannedProduct.salt * multiplier : undefined,
      timestamp: new Date().toISOString(),
      countsTowardGoal,
      type: 'barcode',
    });

    alert(`✅ Produit sauvegardé ${countsTowardGoal ? 'et compté vers ton objectif' : 'à titre indicatif'}!`);
    reset();
  };

  const reset = () => {
    setScannedProduct(null);
    setManualBarcode('');
    setQuantity(100);
    setCountsTowardGoal(true);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const kcalTotal = scannedProduct ? (scannedProduct.kcal * quantity) / 100 : 0;
  const proteinTotal = scannedProduct ? (scannedProduct.protein * quantity) / 100 : 0;
  const carbsTotal = scannedProduct ? (scannedProduct.carbs * quantity) / 100 : 0;
  const fatTotal = scannedProduct ? (scannedProduct.fat * quantity) / 100 : 0;
  const fiberTotal = scannedProduct?.fiber ? (scannedProduct.fiber * quantity) / 100 : 0;
  const sugarTotal = scannedProduct?.sugar ? (scannedProduct.sugar * quantity) / 100 : 0;
  const saltTotal = scannedProduct?.salt ? (scannedProduct.salt * quantity) / 100 : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-800">
          {error}
        </div>
      )}

      {!isScanning && !scannedProduct && !loading && (
        <div className="space-y-4">
          <button
            onClick={startScanning}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-8 rounded-2xl hover:shadow-2xl transition-all"
          >
            <span className="text-5xl">📱</span>
            <div className="text-left">
              <div className="text-2xl font-bold">Scanner un code-barres</div>
              <div className="text-sm opacity-90">Détection automatique via caméra</div>
            </div>
          </button>

          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="font-bold text-gray-900 mb-3">🔢 Saisie manuelle</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Entre le code-barres..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <button
                onClick={handleManualSearch}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-[500px] object-cover"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-4 border-white/30 m-8 rounded-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-2 bg-red-500 animate-pulse"></div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-center mb-4">
              <p className="text-white text-lg font-semibold">📱 Scanne le code-barres</p>
              <p className="text-white/70 text-sm">Centre-le dans le cadre</p>
            </div>
            <button
              onClick={stopScanning}
              className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-300">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <h3 className="text-2xl font-bold text-purple-900 mb-2">Recherche en cours...</h3>
          <p className="text-purple-700">Consultation de la base OpenFoodFacts...</p>
        </div>
      )}

      {scannedProduct && !loading && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
            <div className="flex items-start gap-4 mb-4">
              {scannedProduct.imageUrl && (
                <img
                  src={scannedProduct.imageUrl}
                  alt={scannedProduct.name}
                  className="w-24 h-24 object-cover rounded-xl shadow-md"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900">{scannedProduct.name}</h3>
                {scannedProduct.brand && (
                  <p className="text-sm text-green-700 font-semibold">{scannedProduct.brand}</p>
                )}
                {scannedProduct.nutriScore && (
                  <span
                    className={`
                    inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold
                    ${scannedProduct.nutriScore === 'A' ? 'bg-green-500 text-white' : ''}
                    ${scannedProduct.nutriScore === 'B' ? 'bg-lime-400 text-green-900' : ''}
                    ${scannedProduct.nutriScore === 'C' ? 'bg-yellow-400 text-yellow-900' : ''}
                    ${scannedProduct.nutriScore === 'D' ? 'bg-orange-400 text-orange-900' : ''}
                    ${scannedProduct.nutriScore === 'E' ? 'bg-red-500 text-white' : ''}
                  `}
                  >
                    Nutri-Score: {scannedProduct.nutriScore}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📏 Quantité consommée (en grammes):
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="flex-1 accent-green-600"
                />
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold"
                />
                <span className="text-gray-600 font-semibold">g</span>
              </div>
            </div>

            {plan === 'free' && (
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">{kcalTotal.toFixed(0)}</div>
                <div className="text-lg text-gray-700">Calories</div>
                <div className="text-xs text-gray-500 mt-2">Pour {quantity}g</div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💎 <strong>Upgrade vers PRO</strong> pour voir P/G/L!
                  </p>
                </div>
              </div>
            )}

            {plan === 'pro' && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-red-600">{kcalTotal.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-blue-600">{proteinTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Protéines</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-yellow-600">{carbsTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Glucides</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-orange-600">{fatTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Lipides</div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mb-2">Pour {quantity}g</div>
                <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg">
                  <p className="text-sm text-purple-800">
                    💎 <strong>Upgrade vers FITNESS</strong> pour détails complets!
                  </p>
                </div>
              </>
            )}

            {plan === 'FITNESS' && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-red-600">{kcalTotal.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-blue-600">{proteinTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Protéines</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-yellow-600">{carbsTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Glucides</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-orange-600">{fatTotal.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600">Lipides</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-pink-600">{sugarTotal.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Sucres</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-purple-600">{saltTotal.toFixed(2)}g</div>
                    <div className="text-xs text-gray-600">Sel</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-md">
                    <div className="text-xl font-bold text-green-600">{fiberTotal.toFixed(1)}g</div>
                    <div className="text-xs text-gray-600">Fibres</div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500">Pour {quantity}g</div>
              </>
            )}

            {(plan === 'pro' || plan === 'FITNESS') && (
              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-300 cursor-pointer hover:border-teal-500 transition-all mt-4">
                <input
                  type="checkbox"
                  checked={countsTowardGoal}
                  onChange={(e) => setCountsTowardGoal(e.target.checked)}
                  className="w-5 h-5 rounded accent-teal-600"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">
                    {countsTowardGoal ? '✅ Compter vers mon objectif' : '📊 À titre indicatif uniquement'}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    {countsTowardGoal
                      ? 'Ce scan sera ajouté à ton total quotidien'
                      : 'Ce scan sera sauvegardé mais ne comptera pas vers ton objectif'}
                  </p>
                </div>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveToHistory}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              💾 Sauvegarder
            </button>
            <button
              onClick={reset}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
            >
              🔄 Nouveau scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
