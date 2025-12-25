'use client';

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📸 PhotoCalories API</h1>
        
        <section className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🚀 API Endpoints</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-gray-800 p-4 rounded">
              <p className="font-mono text-sm mb-2">POST /api/scan</p>
              <p className="text-xs">Analyze food image and return macro data</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <p className="font-mono text-sm mb-2">POST /api/barcode</p>
              <p className="text-xs">Scan barcode and return product info</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <p className="font-mono text-sm mb-2">POST /api/nutrition</p>
              <p className="text-xs">Calculate nutrition info from ingredients</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📚 Documentation</h2>
          <p className="text-gray-400 mb-4">
            API documentation coming soon. Check the <code className="bg-gray-800 px-2 py-1 rounded">/api</code> directory for endpoint implementations.
          </p>
        </section>
      </div>
    </main>
  );
}
