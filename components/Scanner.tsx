'use client';

import { useState, useRef } from 'react';

interface ScannerProps {
  onScan: (code: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      if (value.trim()) {
        onScan(value);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <button
        onClick={() => setIsActive(!isActive)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
      >
        {isActive ? '🚫 Désactiver Scanner' : '📊 Activer Scanner'}
      </button>

      {isActive && (
        <input
          ref={inputRef}
          type="text"
          onKeyUp={handleKeyUp}
          placeholder="Scanne un code-barres ou tape..."
          autoFocus
          className="mt-4 w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      )}
    </div>
  );
}
