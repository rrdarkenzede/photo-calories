'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Upload, Barcode, Settings, Zap, Search, Book, TrendingUp } from 'lucide-react';

import { detectFoodInImage } from '@/lib/vision';
import { searchFoodByName, getProductByBarcode } from '@/lib/openfoodfacts';
import { loadMeals, addMeal, loadPlan, savePlan, loadProfile, loadRecipes } from '@/lib/storage';

// Modals/Components
import ScanModal from '@/components/dashboard/ScanModal';
import UploadModal from '@/components/dashboard/UploadModal';
import BarcodeModal from '@/components/dashboard/BarcodeModal';
import ResultModal from '@/components/dashboard/ResultModal';
import HistorySection from '@/components/dashboard/HistorySection';
import CoachModal from '@/components/dashboard/CoachModal';
import RecipeBuilder from '@/components/dashboard/RecipeBuilder';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [scansRemaining, setScansRemaining] = useState(2);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [meals, setMeals] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  
  // Modals
  const [showScan, setShowScan] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);
  
  // Result data
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedMeals = loadMeals();
    const savedPlan = searchParams?.get('plan') || loadPlan();
    const savedRecipes = loadRecipes();
    const profile = loadProfile();
    
    setMeals(savedMeals);
    setRecipes(savedRecipes);
    setPlan(savedPlan);
    
    // Set scans based on plan
    if (savedPlan === 'free') setScansRemaining(2);
    else if (savedPlan === 'pro') setScansRemaining(10);
    else if (savedPlan === 'fitness') setScansRemaining(40);
    
    // Set daily calories from profile
    if (profile?.dailyCalories) {
      setDailyCalories(profile.dailyCalories);
    }
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

  // Handle scan/upload result
  const handleScanResult = async (imageData: string) => {
    if (scansRemaining <= 0) {
      alert('Plus de scans disponibles!');
      return;
    }

    setIsLoading(true);
    try {
      const detectedFoods = await detectFoodInImage(imageData);
      if (detectedFoods.length === 0) throw new Error('Aucun aliment détecté');

      const topFood = detectedFoods[0].name;
      const searchResults = await searchFoodByName(topFood);
      const product = searchResults[0];

      // Create result object
      const result = {
        name: product?.name || topFood,
        calories: Math.round(product?.calories || 0),
        protein: product?.protein,
        carbs: product?.carbs,
        fat: product?.fat,
        image: imageData,
        detectedFoods,
      };

      setCurrentResult(result);
      setShowResult(true);
      setScansRemaining(scansRemaining - 1);
    } catch (error) {
      alert('Erreur détection: ' + error);
    } finally {
      setIsLoading(false);
      setShowScan(false);
      setShowUpload(false);
    }
  };

  // Handle barcode result
  const handleBarcodeResult = async (barcode: string) => {
    if (scansRemaining <= 0) {
      alert('Plus de scans!');
      return;
    }

    setIsLoading(true);
    try {
      const product = await getProductByBarcode(barcode);
      if (!product) throw new Error('Produit non trouvé');

      const result = {
        name: product.name,
        calories: Math.round(product.calories),
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
        nutriscore: product.nutriscore,
        image: product.image,
      };

      setCurrentResult(result);
      setShowResult(true);
      setScansRemaining(scansRemaining - 1);
    } catch (error) {
      alert('Erreur: ' + error);
    } finally {
      setIsLoading(false);
      setShowBarcode(false);
    }
  };

  // Save meal from result
  const handleSaveMeal = (mealData: any, countInGoal: boolean) => {
    const meal = {
      id: Date.now(),
      ...mealData,
      timestamp: new Date().toISOString(),
      countInGoal,
    };
    
    setMeals([...meals, meal]);
    addMeal(meal);
    setShowResult(false);
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* TOP BAR */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">PhotoCalories</span>
            </div>

            {/* Plan + Scans + Settings */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Plan Selector */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-xs md:text-sm font-semibold text-gray-700">Plan:</span>
                <select
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    savePlan(e.target.value);
                    if (e.target.value === 'free') setScansRemaining(2);
                    else if (e.target.value === 'pro') setScansRemaining(10);
                    else setScansRemaining(40);
                  }}
                  className="font-bold text-blue-600 bg-transparent border-none outline-none cursor-pointer text-xs md:text-sm"
                >
                  <option value="free">FREE</option>
                  <option value="pro">PRO</option>
                  <option value="fitness">FITNESS</option>
                </select>
              </div>

              {/* Scans Remaining */}
              <div className="px-3 md:px-4 py-2 bg-blue-50 rounded-full">
                <span className="text-xs md:text-sm font-semibold text-blue-600">
                  {scansRemaining} <span className="hidden sm:inline">scans</span>
                </span>
              </div>

              {/* Settings */}
              <button 
                onClick={() => plan !== 'free' && setShowCoach(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* GOAL BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Objectif du jour</h2>
              <p className="text-gray-600 font-semibold">
                {Math.round(totals.calories)} / {dailyCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-black text-blue-600">
                {Math.round(calorieProgress)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full ${
                calorieProgress > 100 ? 'bg-red-500' :
                calorieProgress > 80 ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
            />
          </div>

          {/* Macros (PRO/FITNESS only) */}
          {plan !== 'free' && (
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6">
              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-2xl">
                <p className="text-xs md:text-sm text-gray-700 font-semibold mb-1">Protéines</p>
                <p className="text-xl md:text-2xl font-black text-purple-700">
                  {totals.protein.toFixed(0)}g
                </p>
              </div>
              <div className="text-center p-3 md:p-4 bg-pink-50 rounded-2xl">
                <p className="text-xs md:text-sm text-gray-700 font-semibold mb-1">Glucides</p>
                <p className="text-xl md:text-2xl font-black text-pink-700">
                  {totals.carbs.toFixed(0)}g
                </p>
              </div>
              <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-2xl">
                <p className="text-xs md:text-sm text-gray-700 font-semibold mb-1">Lipides</p>
                <p className="text-xl md:text-2xl font-black text-yellow-700">
                  {totals.fat.toFixed(0)}g
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 2 BIG BUTTONS */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* SCAN BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowScan(true)}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 transition"
          >
            <Camera className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-black mb-2 text-white drop-shadow-lg">Scanner ton plat</h3>
            <p className="text-blue-50 text-sm md:text-base font-semibold">Prends une photo en direct</p>
          </motion.button>

          {/* UPLOAD BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-cyan-600/40 hover:shadow-cyan-600/60 transition"
          >
            <Upload className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-black mb-2 text-white drop-shadow-lg">Upload une image</h3>
            <p className="text-cyan-50 text-sm md:text-base font-semibold">Choisis depuis ta galerie</p>
          </motion.button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Barcode */}
          <button
            onClick={() => setShowBarcode(true)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
          >
            <Barcode className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">Code-barres</span>
          </button>

          {/* Recipe Builder (FITNESS only) */}
          {plan === 'fitness' && (
            <button
              onClick={() => setShowRecipeBuilder(true)}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition"
            >
              <Book className="w-6 h-6 text-green-600" />
              <span className="font-bold text-gray-900">Mes recettes</span>
            </button>
          )}

          {/* Coach (PRO/FITNESS) */}
          {plan !== 'free' && (
            <button
              onClick={() => setShowCoach(true)}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition"
            >
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="font-bold text-gray-900">Coach / Goal</span>
            </button>
          )}
        </div>

        {/* HISTORY SECTION */}
        <HistorySection meals={meals} plan={plan} />
      </div>

      {/* MODALS */}
      {showScan && (
        <ScanModal onClose={() => setShowScan(false)} onCapture={handleScanResult} />
      )}

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUpload={handleScanResult} />
      )}

      {showBarcode && (
        <BarcodeModal onClose={() => setShowBarcode(false)} onSubmit={handleBarcodeResult} plan={plan} />
      )}

      {showResult && currentResult && (
        <ResultModal
          result={currentResult}
          plan={plan}
          onClose={() => {
            setShowResult(false);
            setCurrentResult(null);
          }}
          onSave={handleSaveMeal}
        />
      )}

      {showCoach && (
        <CoachModal plan={plan} onClose={() => setShowCoach(false)} onSave={(goal) => setDailyCalories(goal)} />
      )}

      {showRecipeBuilder && plan === 'fitness' && (
        <RecipeBuilder
          recipes={recipes}
          onClose={() => setShowRecipeBuilder(false)}
          onUseRecipe={(recipe) => {
            handleSaveMeal(recipe, true);
            setShowRecipeBuilder(false);
          }}
        />
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-center mt-4 font-bold text-gray-900">Analyse en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
