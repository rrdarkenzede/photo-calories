'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (imageData: string) => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        onUpload(imageData);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload une image</h2>

        <label
          onClick={() => inputRef.current?.click()}
          className="block p-12 border-2 border-dashed border-gray-300 rounded-2xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-900 mb-1">Clique pour choisir</p>
          <p className="text-sm text-gray-600 font-semibold">ou glisse et depose</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </motion.div>
    </div>
  );
}
