'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Barcode,
  History,
  Settings,
  ChevronDown,
  Zap,
  TrendingUp,
  Book,
  User,
  LogOut,
  Plus,
  X,
  Check,
  Trash2,
  Download,
} from 'lucide-react';

// Import services
import { detectFoodInImage } from '@/lib/vision';
import { searchFoodByName, getProductByBarcode } from '@/lib/openfoodfacts';
import { loadMeals, saveMeal, deleteMeal, loadPlan, savePlan } from '@/lib/storage';
import BarcodeScanner from '@/components/BarcodeScanner';
import ManualBarcodeInput from '@/components/ManualBarcodeInput';
import NutriscoreBadge from '@/components/NutriscoreBadge';
import { exportMealsToCSV, downloadCSV } from '@/lib/export';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [scansRemaining, setScansRemaining] = useState(2);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [meals, setMeals] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualBarcode, setShowManualBarcode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data
  useEffect(() => {
    const savedMeals = loadMeals();
    const savedPlan = searchParams?.get('plan') || loadPlan();
    setMeals(savedMeals);
    setPlan(savedPlan);
    
    // Set scans based on plan
    if (savedPlan === 'free') setScansRemaining(2);
    else if (savedPlan === 'pro') setScansRemaining(10);
    else if (savedPlan === 'fitness') setScansRemaining(40);
  }, [searchParams]);

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieProgress = (totals.calories / dailyCalories) * 100;

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (scansRemaining <= 0) {
      alert('Plus de scans disponibles! Upgrade ton plan.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      try {
        // Detect with AI
        const detectedFoods = await detectFoodInImage(imageData);
        if (detectedFoods.length === 0) throw new Error('Aucun aliment détecté');

        // Get nutrition
        const topFood = detectedFoods[0].name;
        const searchResults = await searchFoodByName(topFood);
        
        const product = searchResults[0];
        const meal = {
          id: Date.now(),
          name: product?.name || topFood,
          calories: Math.round(product?.calories || 0),
          protein: product?.protein,
          carbs: product?.carbs,
          fat: product?.fat,
          image: imageData,
          nutriscore: product?.nutriscore,
          timestamp: new Date().toISOString(),
        };

        setMeals([...meals, meal]);
        saveMeal(meal);
        setScansRemaining(scansRemaining - 1);
        setShowUploadModal(false);
      } catch (error) {
        alert('Erreur lors de la détection');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Handle barcode scan
  const handleBarcodeScan = async (barcode: string) => {
    if (scansRemaining <= 0) {
      alert('Plus de scans disponibles!');
      return;
    }

    setIsLoading(true);
    try {
      const product = await getProductByBarcode(barcode);
      if (!product) throw new Error('Produit non trouvé');

      const meal = {
        id: Date.now(),
        name: product.name,
        calories: Math.round(product.calories),
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
        image: product.image,
        nutriscore: product.nutriscore,
        timestamp: new Date().toISOString(),
      };

      setMeals([...meals, meal]);
      saveMeal(meal);
      setScansRemaining(scansRemaining - 1);
      setShowScanner(false);
      setShowManualBarcode(false);
    } catch (error) {
      alert('Erreur: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* TOP BAR */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PhotoCalories</span>
            </div>

            {/* Plan Badge & Scans */}
            <div className="flex items-center gap-4">
              {/* Plan selector */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-semibold text-gray-700">Plan:</span>
                <select
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    savePlan(e.target.value);
                    if (e.target.value === 'free') setScansRemaining(2);
                    else if (e.target.value === 'pro') setScansRemaining(10);
                    else setScansRemaining(40);
                  }}
                  className="font-bold text-blue-600 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="free">FREE</option>
                  <option value="pro">PRO</option>
                  <option value="fitness">FITNESS</option>
                </select>
              </div>

              {/* Scans remaining */}
              <div className="px-4 py-2 bg-blue-50 rounded-full">
                <span className="text-sm font-semibold text-blue-600">
                  {scansRemaining} scans restants
                </span>
              </div>

              {/* Settings */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* CALORIES GOAL BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Objectif du jour</h2>
              <p className="text-gray-600">
                {Math.round(totals.calories)} / {dailyCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-blue-600">
                {Math.round(calorieProgress)}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                calorieProgress > 100
                  ? 'bg-red-500'
                  : calorieProgress > 80
                  ? 'bg-yellow-500'
                  : 'bg-blue-600'
              }`}
            />
          </div>

          {/* Macros (PRO/FITNESS only) */}
          {plan !== 'free' && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-purple-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Protéines</p>
                <p className="text-2xl font-bold text-purple-600">{totals.protein.toFixed(0)}g</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Glucides</p>
                <p className="text-2xl font-bold text-pink-600">{totals.carbs.toFixed(0)}g</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Lipides</p>
                <p className="text-2xl font-bold text-yellow-600">{totals.fat.toFixed(0)}g</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 2 BIG BUTTONS - SCAN & UPLOAD */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* SCAN BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowScanner(true)}
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-12 text-white shadow-2xl shadow-blue-500/30 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center">
              <Camera className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-3xl font-black mb-2">Scanner ton plat</h3>
              <p className="text-blue-100">Prends une photo en direct</p>
            </div>
          </motion.button>

          {/* UPLOAD BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadModal(true)}
            className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl p-12 text-white shadow-2xl shadow-cyan-500/30 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center">
              <Upload className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-3xl font-black mb-2">Upload une image</h3>
              <p className="text-cyan-100">Choisis depuis ta galerie</p>
            </div>
          </motion.button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowManualBarcode(true)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
          >
            <Barcode className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Code-barres manuel</span>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition">
            <Book className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-900">Mes recettes</span>
          </button>

          <button
            onClick={() => downloadCSV(exportMealsToCSV(meals), 'photocalories.csv')}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition"
          >
            <Download className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-gray-900">Export CSV</span>
          </button>
        </div>

        {/* MEALS HISTORY */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
            <span className="text-sm text-gray-500">{meals.length} repas</span>
          </div>

          <div className="space-y-4">
            {meals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun repas enregistré</p>
                <p className="text-gray-400 text-sm">Scanne ton premier plat!</p>
              </div>
            ) : (
              meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
                >
                  {/* Image */}
                  {meal.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{meal.name}</h3>
                      {meal.nutriscore && <NutriscoreBadge score={meal.nutriscore} size="sm" />}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(meal.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  {/* Calories */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{meal.calories}</p>
                    <p className="text-sm text-gray-500">kcal</p>
                  </div>

                  {/* Macros (PRO/FITNESS) */}
                  {plan !== 'free' && meal.protein && (
                    <div className="flex gap-2 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-lg font-semibold">
                        P: {meal.protein.toFixed(0)}g
                      </span>
                      <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-lg font-semibold">
                        G: {meal.carbs.toFixed(0)}g
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-lg font-semibold">
                        L: {meal.fat.toFixed(0)}g
                      </span>
                    </div>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => {
                      setMeals(meals.filter((m) => m.id !== meal.id));
                      deleteMeal(meal.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-xl transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showManualBarcode && (
        <ManualBarcodeInput
          onSubmit={handleBarcodeScan}
          onClose={() => setShowManualBarcode(false)}
        />
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Upload une image</h2>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
              id="upload-input"
            />
            
            <label
              htmlFor="upload-input"
              className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-2xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="font-semibold text-gray-900">Clique pour choisir une image</p>
              <p className="text-sm text-gray-500 mt-2">ou glisse-dépose ici</p>
            </label>
          </motion.div>
        </div>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-center mt-4 font-semibold">Analyse en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
