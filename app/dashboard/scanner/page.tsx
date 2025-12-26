'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { recognizeFood, getNutritionInfo } from '@/lib/api-helpers';
import { IngredientsTable } from '@/components/IngredientsTable';
import { Meal, Ingredient } from '@/lib/types';
import { Camera, Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function ScannerPage() {
  const { currentPlan, addMeal, incrementScans } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [step, setStep] = useState<'camera' | 'result'>('camera');
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setRecognizing(true);
    try {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);

      const imageData = canvasRef.current.toDataURL('image/jpeg');
      const foodNames = await recognizeFood(imageData);

      const newIngredients: Ingredient[] = [];

      for (const foodName of foodNames) {
        try {
          const nutrition = await getNutritionInfo(foodName);
          if (nutrition) {
            newIngredients.push({
              id: Date.now().toString() + Math.random(),
              name: nutrition.name,
              quantity: 100,
              unit: 'g',
              calories: nutrition.calories || 0,
              protein: nutrition.protein || 0,
              carbs: nutrition.carbs || 0,
              fat: nutrition.fat || 0,
              fiber: nutrition.fiber || 0,
              sugar: nutrition.sugar || 0,
              sodium: nutrition.sodium || 0,
            });
          }
        } catch (e) {
          console.log(`Pas d'info pour ${foodName}`);
        }
      }

      setIngredients(newIngredients);
      stopCamera();
      setStep('result');
    } finally {
      setRecognizing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        const foodNames = await recognizeFood(imageData);

        const newIngredients: Ingredient[] = [];

        for (const foodName of foodNames) {
          try {
            const nutrition = await getNutritionInfo(foodName);
            if (nutrition) {
              newIngredients.push({
                id: Date.now().toString() + Math.random(),
                name: nutrition.name,
                quantity: 100,
                unit: 'g',
                calories: nutrition.calories || 0,
                protein: nutrition.protein || 0,
                carbs: nutrition.carbs || 0,
                fat: nutrition.fat || 0,
                fiber: nutrition.fiber || 0,
                sugar: nutrition.sugar || 0,
                sodium: nutrition.sodium || 0,
              });
            }
          } catch (e) {
            console.log(`Pas d'info pour ${foodName}`);
          }
        }

        setIngredients(newIngredients);
        setStep('result');
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = () => {
    if (ingredients.length === 0) {
      alert('Ajoute au moins un ingrédient!');
      return;
    }

    const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const totalProtein = ingredients.reduce((sum, ing) => sum + ing.protein, 0);
    const totalCarbs = ingredients.reduce((sum, ing) => sum + ing.carbs, 0);
    const totalFat = ingredients.reduce((sum, ing) => sum + ing.fat, 0);
    const totalFiber = ingredients.reduce((sum, ing) => sum + (ing.fiber || 0), 0);
    const totalSugar = ingredients.reduce((sum, ing) => sum + (ing.sugar || 0), 0);
    const totalSodium = ingredients.reduce((sum, ing) => sum + (ing.sodium || 0), 0);

    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date(),
      name: mealName || 'Repas sans nom',
      ingredients,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
      totalSodium,
      mealType,
    };

    addMeal(meal);
    incrementScans();

    alert('✅ Repas ajouté!');
    setStep('camera');
    setIngredients([]);
    setMealName('');
    startCamera();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scanner Repas</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'camera' ? (
          <div className="space-y-6">
            {/* Camera Preview */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={startCamera}
              />
            </div>
            <canvas ref={canvasRef} hidden />

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={captureAndRecognize}
                disabled={recognizing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {recognizing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Reconnaissance...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Prendre une photo
                  </>
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Télécharger image
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Meal Info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Nom du repas
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="ex: Déjeuner avec ma famille"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Type de repas
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="breakfast">🌅 Petit-déjeuner</option>
                  <option value="lunch">🍽️ Déjeuner</option>
                  <option value="dinner">🌙 Dîner</option>
                  <option value="snack">🍎 Collation</option>
                </select>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ingrédients reconnus</h2>
              <IngredientsTable
                ingredients={ingredients}
                editable={currentPlan === 'fitness'}
                showMicros={currentPlan !== 'free'}
                onIngredientsChange={setIngredients}
              />
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Calories</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {ingredients.reduce((sum, ing) => sum + ing.calories, 0).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Protéines</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {ingredients.reduce((sum, ing) => sum + ing.protein, 0).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Glucides</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {ingredients.reduce((sum, ing) => sum + ing.carbs, 0).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lipides</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {ingredients.reduce((sum, ing) => sum + ing.fat, 0).toFixed(1)}g
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('camera');
                  setIngredients([]);
                  startCamera();
                }}
                className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
              >
                ← Retour
              </button>
              <button
                onClick={saveMeal}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition"
              >
                <Check className="w-5 h-5" />
                Sauvegarder
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
