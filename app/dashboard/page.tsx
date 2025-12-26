'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Upload, Settings, Zap } from 'lucide-react';

// Import services
import { detectFoodInImage } from '@/lib/vision';
import { searchFoodByName } from '@/lib/openfoodfacts';
import { loadMeals, addMeal, loadPlan, savePlan } from '@/lib/storage';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [scansRemaining, setScansRemaining] = useState(2);
  const [dailyCalories] = useState(2000);
  const [meals, setMeals] = useState<any[]>([]);
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
      alert('Plus de scans disponibles!');
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
          timestamp: new Date().toISOString(),
        };

        setMeals([...meals, meal]);
        addMeal(meal);
        setScansRemaining(scansRemaining - 1);
      } catch (error) {
        alert('Erreur détection');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PhotoCalories</span>
            </div>

            <div className="flex items-center gap-4">
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

              <div className="px-4 py-2 bg-blue-50 rounded-full">
                <span className="text-sm font-semibold text-blue-600">
                  {scansRemaining} scans
                </span>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* GOAL BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Objectif</h2>
              <p className="text-gray-600">{Math.round(totals.calories)} / {dailyCalories} kcal</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-blue-600">{Math.round(calorieProgress)}%</p>
            </div>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>

          {plan !== 'free' && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-purple-50 rounded-2xl">
                <p className="text-sm text-gray-600">Protéines</p>
                <p className="text-2xl font-bold text-purple-600">{totals.protein.toFixed(0)}g</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-2xl">
                <p className="text-sm text-gray-600">Glucides</p>
                <p className="text-2xl font-bold text-pink-600">{totals.carbs.toFixed(0)}g</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                <p className="text-sm text-gray-600">Lipides</p>
                <p className="text-2xl font-bold text-yellow-600">{totals.fat.toFixed(0)}g</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 2 BIG BUTTONS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <Camera className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-3xl font-black">Scanner</h3>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl p-12 text-white shadow-2xl relative"
          >
            <Upload className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-3xl font-black">Upload</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </motion.button>
        </div>

        {/* HISTORY */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Historique ({meals.length})</h2>
          {meals.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Aucun repas</p>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  {meal.image && (
                    <img src={meal.image} alt={meal.name} className="w-16 h-16 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{meal.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(meal.timestamp).toLocaleString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{meal.calories}</p>
                    <p className="text-sm text-gray-500">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-center mt-4 font-semibold">Analyse...</p>
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
