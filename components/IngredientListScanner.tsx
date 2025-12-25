'use client';

import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

interface IngredientInput {
  name: string;
  quantity: number;
  unit: 'g' | 'ml';
}

interface IngredientListScannerProps {
  onIngredientsDetected: (ingredients: IngredientInput[]) => void;
}

export default function IngredientListScanner({ onIngredientsDetected }: IngredientListScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ EXTRACTION TEXTE VIA OCR (Tesseract.js)
  const extractTextFromImage = async (imageData: string): Promise<string> => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageData,
        'fra', // Français
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        }
      );
      return text;
    } catch (error) {
      console.error('Erreur Tesseract:', error);
      throw error;
    }
  };

  // ✅ PARSING INTELLIGENT DES INGRÉDIENTS
  const parseIngredientsList = (text: string): IngredientInput[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const ingredients: IngredientInput[] = [];

    for (const line of lines) {
      // Ignorer les en-têtes
      if (line.toLowerCase().includes('ingrédient') || line.toLowerCase().includes('composition')) {
        continue;
      }

      // Patterns de détection (exemples):
      // "Farine 250g", "Sucre: 100 g", "Lait (200ml)", "Oeufs - 3 unités"
      const patterns = [
        /(.+?)[:\-\(]?\s*(\d+(?:[.,]\d+)?)\s*(g|ml|kg|l|cl|unités?|sachets?)/i,
        /(\d+(?:[.,]\d+)?)\s*(g|ml|kg|l|cl|unités?|sachets?)\s+(.+)/i,
        /(.+?)\s+(\d+(?:[.,]\d+)?)\s*(g|ml|kg|l|cl|unités?|sachets?)/i,
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          let name = match[1].trim();
          let quantity = parseFloat(match[2].replace(',', '.'));
          let unit = match[3].toLowerCase();

          // Conversion en grammes/ml
          if (unit === 'kg') {
            quantity *= 1000;
            unit = 'g';
          } else if (unit === 'l') {
            quantity *= 1000;
            unit = 'ml';
          } else if (unit === 'cl') {
            quantity *= 10;
            unit = 'ml';
          } else if (unit.includes('unit') || unit.includes('sachet')) {
            quantity = quantity * 60; // Estimation 60g par unité
            unit = 'g';
          } else if (unit !== 'g' && unit !== 'ml') {
            unit = 'g'; // Par défaut
          }

          ingredients.push({
            name: name,
            quantity: quantity,
            unit: unit as 'g' | 'ml',
          });
          break;
        }
      }
    }

    return ingredients;
  };

  // ✅ UPLOAD ET ANALYSE
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setOcrProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setImagePreview(imageData);

      try {
        const extractedText = await extractTextFromImage(imageData);
        console.log('📝 Texte extrait:', extractedText);

        const parsedIngredients = parseIngredientsList(extractedText);

        if (parsedIngredients.length > 0) {
          onIngredientsDetected(parsedIngredients);
          alert(`✅ ${parsedIngredients.length} ingrédients détectés! Vérifie et modifie si besoin.`);
        } else {
          alert('❌ Aucun ingrédient détecté. Essaye avec une meilleure photo.');
        }
      } catch (error) {
        console.error('Erreur OCR:', error);
        alert('❌ Erreur lors de l\'analyse. Ressaye avec une meilleure photo.');
      } finally {
        setScanning(false);
        setOcrProgress(0);
        setImagePreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">📋</span>
        <div>
          <h4 className="font-bold text-orange-900 text-lg">Scanner une liste d'ingrédients</h4>
          <p className="text-sm text-orange-700">
            Prends une photo de la liste (emballage, recette) et le tableau se remplit automatiquement!
          </p>
        </div>
      </div>

      {/* PREVIEW IMAGE */}
      {imagePreview && (
        <div className="relative">
          <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg" />
        </div>
      )}

      {/* PROGRESS BAR */}
      {scanning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-orange-700">
            <span>⏳ Analyse en cours...</span>
            <span>{ocrProgress}%</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${ocrProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* BOUTON UPLOAD */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50"
      >
        <span className="text-3xl">📸</span>
        <span className="font-bold text-lg">
          {scanning ? 'Analyse en cours...' : 'Prendre photo de la liste'}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="text-xs text-orange-600 italic">
        💡 Conseil: Photo bien éclairée, texte lisible, pas de reflets
      </div>
    </div>
  );
}
