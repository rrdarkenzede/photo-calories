'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { analyzeFood } from '@/lib/api-helpers';
import { ArrowLeft, Camera, Upload, Loader2, Check, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function CameraPage() {
  const router = useRouter();
  const { addMeal, plan } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [useCamera, setUseCamera] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setUseCamera(true);
      }
    } catch (err) {
      setError('📱 Caméra non accessible. Utilise la galerie.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const photo = canvasRef.current.toDataURL('image/jpeg');
      setPreview(photo);
      setUseCamera(false);
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      setUseCamera(false);
    }
  };

  const analyzeImage = async () => {
    if (!preview) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeFood(preview);
      setAnalysis(result);
      setMealName(result.name || 'Mon repas');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = () => {
    if (!analysis) return;

    const ingredients: any[] = [
      {
        id: Date.now().toString(),
        name: analysis.name,
        quantity,
        unit: 'portion',
        calories: (analysis.calories || 0) * quantity,
        protein: (analysis.protein || 0) * quantity,
        carbs: (analysis.carbs || 0) * quantity,
        fat: (analysis.fat || 0) * quantity,
        fiber: (analysis.fiber || 0) * quantity,
        sugar: (analysis.sugar || 0) * quantity,
        sodium: (analysis.sodium || 0) * quantity,
      },
    ];

    const meal: any = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      name: mealName || analysis.name,
      ingredients,
      nutrition: {
        calories: ingredients[0].calories,
        protein: ingredients[0].protein,
        carbs: ingredients[0].carbs,
        fat: ingredients[0].fat,
        fiber: ingredients[0].fiber,
        sugar: ingredients[0].sugar,
        sodium: ingredients[0].sodium,
      },
      mealType,
    };

    addMeal(meal);

    alert('✅ Repas ajouté!');
    setPreview(null);
    setAnalysis(null);
    setMealName('');
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-green-200 sticky top-0 z-10 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-green-100 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-green-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">📷 Camera</h1>
              <p className="text-xs text-slate-600 font-bold">Photographie ton repas</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-600 uppercase">Plan</p>
            <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {plan}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto flex flex-col">
        {!useCamera && !analysis ? (
          <div className="flex flex-col gap-6 flex-1">
            {/* Upload Area */}
            {!preview && (
              <div className="flex flex-col gap-4">
                {/* Camera Button */}
                <button
                  onClick={startCamera}
                  className="w-full p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                >
                  <Camera className="w-6 h-6" />
                  📱 Prendre une photo
                </button>

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 rounded-2xl border-2 border-green-300 bg-white text-green-600 font-black text-lg flex items-center justify-center gap-3 hover:bg-green-50 active:scale-95 transition-all duration-300"
                >
                  <Upload className="w-6 h-6" />
                  Galerie
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {error && (
                  <div className="p-4 rounded-xl bg-red-100 border-2 border-red-300 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-bold">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="rounded-2xl overflow-hidden border-2 border-green-300 flex-1">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    onClick={() => setPreview(null)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 font-bold"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 font-black"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Analyser
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : useCamera ? (
          <div className="flex flex-col gap-4 flex-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl border-2 border-green-300 flex-1 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={stopCamera}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 font-bold"
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
              <button
                onClick={capturePhoto}
                className="btn-primary flex-1 flex items-center justify-center gap-2 font-black"
              >
                <Camera className="w-5 h-5" />
                Capturer
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 flex-1">
            {/* Analysis Result */}
            <div className="card border-2 border-green-300 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {preview && (
                  <img
                    src={preview}
                    alt={analysis.name}
                    className="w-full sm:w-24 h-64 sm:h-24 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{analysis.name}</h2>
                  <p className="text-sm text-slate-600 mb-3 font-bold">
                    {analysis.description || 'Plat analysé avec IA'}
                  </p>
                  <span className="badge badge-primary text-sm font-black">
                    {Math.round(analysis.calories)} kcal/portion
                  </span>
                </div>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="card border-2 border-green-200">
              <h3 className="text-lg font-black text-slate-900 mb-4">Macronutriments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Cal', value: (analysis.calories * quantity).toFixed(0), unit: 'kcal', emoji: '🔥' },
                  { label: 'Prot', value: (analysis.protein * quantity).toFixed(1), unit: 'g', emoji: '💪' },
                  { label: 'Carbs', value: (analysis.carbs * quantity).toFixed(1), unit: 'g', emoji: '🍜' },
                  { label: 'Fat', value: (analysis.fat * quantity).toFixed(1), unit: 'g', emoji: '🧈' },
                ].map((item) => (
                  <div key={item.label} className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 text-center">
                    <p className="text-2xl mb-1">{item.emoji}</p>
                    <p className="text-xs font-black text-slate-600 uppercase mb-1">{item.label}</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-bold">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Settings */}
            <div className="card border-2 border-green-200 space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">😗 Quantité</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                    className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 font-black text-lg hover:bg-green-200 transition-all duration-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value)))}
                    step="0.5"
                    min="0.5"
                    className="input flex-1 text-center font-black text-xl"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 0.5)}
                    className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 font-black text-lg hover:bg-green-200 transition-all duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">📄 Nom du repas</label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={analysis.name}
                  className="input font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-3 uppercase">🍰 Type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value as any)} className="input font-bold">
                  <option value="breakfast">🌅 Petit-déjeuner</option>
                  <option value="lunch">🍴 Déjeuner</option>
                  <option value="dinner">🌙 Dîner</option>
                  <option value="snack">🍎 Collation</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setPreview(null);
                  setAnalysis(null);
                  setMealName('');
                  setQuantity(1);
                }}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 font-bold"
              >
                <Camera className="w-5 h-5" />
                Nouvelle photo
              </button>
              <button
                onClick={saveMeal}
                className="btn-primary flex-1 flex items-center justify-center gap-2 font-black"
              >
                <Check className="w-5 h-5" />
                Ajouter le repas
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
