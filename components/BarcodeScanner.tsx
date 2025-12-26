'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-code-scanner-region';

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Silent fail for scanning errors (too frequent)
        }
      );
    } catch (err: any) {
      console.error('Scanner error:', err);
      setError('Impossible de démarrer la caméra. Vérifiez les permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-md p-4">
        {/* Close button */}
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scanner area */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Scan Code-Barres</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!error && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 text-center mb-4">
                Placez le code-barres dans le cadre
              </p>
              <div
                id={qrCodeRegionId}
                className="w-full rounded-lg overflow-hidden border-4 border-blue-300"
              />
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              La caméra détecte automatiquement les codes EAN-13, UPC-A, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
