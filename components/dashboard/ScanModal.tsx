'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';

interface ScanModalProps {
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export default function ScanModal({ onClose, onCapture }: ScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  React.useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (error) {
        setHasPermission(false);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Scanner ton plat</h2>

        {!hasPermission ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Accès caméra refusé. Autorise l'accès dans tes paramètres.
            </p>
          </div>
        ) : (
          <>
            <div className="relative rounded-2xl overflow-hidden bg-black mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
              onClick={handleCapture}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg"
            >
              <Camera className="w-6 h-6" />
              Prendre une photo
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
