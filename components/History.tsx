'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function History() {
  const { scans, deleteScan, plan } = useStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');

  const getFilteredScans = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (filter === 'today') {
      return scans.filter((scan) => {
        const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
        return scanDate === today;
      });
    }

    if (filter === 'week') {
      return scans.filter((scan) => {
        const scanDate = new Date(scan.timestamp);
        return scanDate >= weekAgo;
      });
    }

    return scans;
  };

  const filteredScans = getFilteredScans();

  const totalKcal = filteredScans.reduce((sum, s) => sum + s.kcal, 0);
  const totalProtein = filteredScans.reduce((sum, s) => sum + s.protein, 0);
  const totalCarbs = filteredScans.reduce((sum, s) => sum + s.carbs, 0);
  const totalFat = filteredScans.reduce((sum, s) => sum + s.fat, 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">📜 Historique</h2>

        {/* FILTERS */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'today'
                ? 'bg-[#1f8b8f] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'week'
                ? 'bg-[#1f8b8f] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#1f8b8f] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tout
          </button>
        </div>
      </div>

      {/* STATS RÉSUMÉ */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
        <h3 className="font-bold text-blue-900 text-lg mb-4">
          📊 Résumé ({filteredScans.length} scans)
        </h3>

        {/* ✅ AFFICHAGE SELON LE PLAN */}
        {plan === 'free' && (
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {totalKcal.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Calories totales</div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-xs text-yellow-800">
                💎 <strong>Upgrade vers PRO</strong> pour voir P/C/F
              </p>
            </div>
          </div>
        )}

        {plan === 'pro' && (
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-red-600">{totalKcal.toFixed(0)}</div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-gray-600">Protéines</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
              <div className="text-xs text-gray-600">Glucides</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
              <div className="text-xs text-gray-600">Lipides</div>
            </div>
          </div>
        )}

        {plan === 'FITNESS' && (
          <>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-red-600">{totalKcal.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Protéines</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Glucides</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Lipides</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              💎 Détails complets disponibles dans chaque scan
            </div>
          </>
        )}
      </div>

      {/* LISTE DES SCANS */}
      {filteredScans.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun scan</h3>
          <p className="text-gray-600">Commence à scanner des aliments!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans
            .slice()
            .reverse()
            .map((scan) => (
              <div
                key={scan.id}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {scan.type === 'barcode' ? '📊' : '📸'}
                      </span>
                      <h4 className="font-bold text-lg text-gray-800">
                        {scan.productName}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(scan.timestamp).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteScan(scan.id)}
                    className="text-red-500 hover:text-red-700 text-xl p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>

                {/* AFFICHAGE SELON LE PLAN */}
                {plan === 'free' && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-2xl font-bold text-red-600">
                      {scan.kcal.toFixed(0)} kcal
                    </span>
                  </div>
                )}

                {plan === 'pro' && (
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="bg-red-50 rounded-lg p-2 text-center">
                      <div className="font-bold text-red-600">{scan.kcal.toFixed(0)}</div>
                      <div className="text-xs text-gray-600">kcal</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="font-bold text-blue-600">{scan.protein.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">P</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <div className="font-bold text-yellow-600">{scan.carbs.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">C</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 text-center">
                      <div className="font-bold text-orange-600">{scan.fat.toFixed(1)}g</div>
                      <div className="text-xs text-gray-600">F</div>
                    </div>
                  </div>
                )}

                {plan === 'FITNESS' && (
                  <>
                    <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <div className="font-bold text-red-600">{scan.kcal.toFixed(0)}</div>
                        <div className="text-xs text-gray-600">kcal</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <div className="font-bold text-blue-600">{scan.protein.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600">P</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2 text-center">
                        <div className="font-bold text-yellow-600">{scan.carbs.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600">C</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <div className="font-bold text-orange-600">{scan.fat.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600">F</div>
                      </div>
                    </div>
                    {(scan.sugar !== undefined || scan.salt !== undefined || scan.fiber !== undefined) && (
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        {scan.sugar !== undefined && (
                          <div className="text-center">Sucres: {scan.sugar.toFixed(1)}g</div>
                        )}
                        {scan.salt !== undefined && (
                          <div className="text-center">Sel: {scan.salt.toFixed(2)}g</div>
                        )}
                        {scan.fiber !== undefined && (
                          <div className="text-center">Fibres: {scan.fiber.toFixed(1)}g</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
