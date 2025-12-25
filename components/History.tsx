'use client';

import { useStore } from '@/store/useStore';
import type { Scan } from '@/store/useStore';

export default function History() {
  const { scans, removeScan } = useStore();

  const todayScans = scans.filter((s: Scan) => {
    const scanDate = new Date(s.timestamp).toLocaleDateString('fr-FR');
    const today = new Date().toLocaleDateString('fr-FR');
    return scanDate === today;
  });

  const totalToday = todayScans.reduce(
    (acc, scan) => ({
      kcal: acc.kcal + scan.kcal,
      protein: acc.protein + scan.protein,
      carbs: acc.carbs + scan.carbs,
      fat: acc.fat + scan.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (todayScans.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-gray-300">
        <p className="text-xl text-gray-900 font-semibold">📄 Aucun scan aujourd'hui</p>
        <p className="text-gray-700 mt-2">Commence par scanner une photo ou un code-barres!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 border-2 border-blue-500/50">
        <h1 className="text-3xl font-bold text-white mb-6">📌 Historique d'Aujourd'hui</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-300 mb-1">Calories</p>
            <p className="text-3xl font-bold text-orange-400">{totalToday.kcal.toFixed(0)}</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-300 mb-1">Protéines</p>
            <p className="text-3xl font-bold text-blue-400">{totalToday.protein.toFixed(1)}g</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-300 mb-1">Glucides</p>
            <p className="text-3xl font-bold text-yellow-400">{totalToday.carbs.toFixed(1)}g</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-300 mb-1">Lipides</p>
            <p className="text-3xl font-bold text-green-400">{totalToday.fat.toFixed(1)}g</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {todayScans.map((scan: Scan) => {
          const scanTime = new Date(scan.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={scan.id} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 hover:border-orange-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {scan.type === 'barcode' ? '📊' : '📸'}
                    </span>
                    <h3 className="text-lg font-bold text-white">{scan.productName}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{scanTime}</p>
                </div>
                <button
                  onClick={() => removeScan(scan.id)}
                  className="text-red-400 hover:text-red-300 font-bold text-lg"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Calories</p>
                  <p className="text-lg font-bold text-orange-400">{scan.kcal.toFixed(0)}</p>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">P</p>
                  <p className="text-lg font-bold text-blue-400">{scan.protein.toFixed(1)}g</p>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">G</p>
                  <p className="text-lg font-bold text-yellow-400">{scan.carbs.toFixed(1)}g</p>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">L</p>
                  <p className="text-lg font-bold text-green-400">{scan.fat.toFixed(1)}g</p>
                </div>
              </div>

              {scan.countsTowardGoal ? (
                <span className="text-xs text-green-400 font-semibold">✅ Compte vers l'objectif</span>
              ) : (
                <span className="text-xs text-gray-500 font-semibold">📊 Indicatif</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
