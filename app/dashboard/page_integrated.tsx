'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Barcode,
  History,
  Settings,
  Plus,
  X,
  Trash2,
  Lock,
  Home,
  Book,
  Zap,
  BarChart3,
} from 'lucide-react';

// Import new services
import { detecterAlimentDansImage } from '@/lib/vision';
import { chercherAlimentParNom, obtenirProduitParCodeBarres, obtenirEstimationAlimentGenerique } from '@/lib/openfoodfacts';
import { 
  saveMeals, 
  loadMeals, 
  addMeal as saveMeal, 
  deleteMeal as removeMeal,
  savePlan,
  loadPlan,
  saveRecipes,
  loadRecipes,
  addRecipe,
  saveProfile,
  loadProfile,
  calculateTDEE
} from '@/lib/storage';
import { translateFood } from '@/lib/translations';
import BarcodeScanner from '@/components/BarcodeScanner';

// Wrapper component for SearchParams
function DashboardContent() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [activeTab, setActiveTab] = useState('scan');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedMeal, setDetectedMeal] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [profile, setProfile] = useState<any>({
    age: 25,
    weight: 70,
    height: 180,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMeals = loadMeals();
    const savedRecipes = loadRecipes();
    const savedPlan = searchParams?.get('plan') || loadPlan();
    const savedProfile = loadProfile();
    
    setMeals(savedMeals);
    setRecipes(savedRecipes);
    setPlan(savedPlan);
    if (savedProfile) {
      setProfile(savedProfile);
      if (savedProfile.dailyCalories) {
        setDailyCalories(savedProfile.dailyCalories);
      }
    }
  }, []);

  // Save meals when changed
  useEffect(() => {
    if (meals.length > 0) {
      saveMeals(meals);
    }
  }, [meals]);

  // Save plan when changed
  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  // Calculate daily totals
  const calculateDailyTotals = () => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Calculate ingredients totals
  const calculateIngredientsTotals = () => {
    return ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + (ing.calories * ing.quantity) / 100,
        protein: acc.protein + (ing.protein * ing.quantity) / 100,
        carbs: acc.carbs + (ing.carbs * ing.quantity) / 100,
        fat: acc.fat + (ing.fat * ing.quantity) / 100,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totals = calculateDailyTotals();
  const ingredientsTotals = calculateIngredientsTotals();

  // REAL AI detection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setUploadedImage(imageData);
      setIsLoading(true);

      try {
        // Step 1: Detect food with Clarifai
        const detectedFoods = await detecterAlimentDansImage(imageData);
        
        if (detectedFoods.length === 0) {
          throw new Error('Aucun aliment détecté');
        }

        // Step 2: Get nutrition from OpenFoodFacts
        const topFood = detectedFoods[0].nom;
        const searchResults = await chercherAlimentParNom(topFood);
        
        let mealData;
        if (searchResults.length > 0) {
          // Use first result
          const product = searchResults[0];
          mealData = {
            nom: product.nom,
            calories: Math.round(product.calories),
            proteines: product.proteines,
            glucides: product.glucides,
            lipides: product.lipides,
            image: product.image || imageData,
            nutriScore: product.nutriScore,
            alimentsDetectes: detectedFoods.map(f => `${f.nom} (${f.confiance}%)`).join(', '),
          };
          
          // Create ingredients from API data
          if (product.ingredients && product.ingredients.length > 0) {
            setIngredients(
              product.ingredients.slice(0, 5).map((ing: string, i: number) => {
                const estimate = obtenirEstimationAlimentGenerique(ing);
                return {
                  id: i,
                  nom: ing,
                  quantity: 100,
                  calories: estimate.calories,
                  proteines: estimate.proteines,
                  glucides: estimate.glucides,
                  lipides: estimate.lipides,
                };
              })
            );
          }
        } else {
          // Fallback to generic estimate
          const estimate = obtenirEstimationAlimentGenerique(topFood);
          mealData = {
            nom: translateFood(topFood) || topFood,
            calories: Math.round(estimate.calories),
            proteines: estimate.proteines,
            glucides: estimate.glucides,
            lipides: estimate.lipides,
            image: imageData,
            nutriScore: estimate.nutriScore,
            alimentsDetectes: detectedFoods.map(f => `${f.nom} (${f.confiance}%)`).join(', '),
          };
          
          // Generic ingredients
          setIngredients([{
            id: 0,
            nom: topFood,
            quantity: 100,
            calories: estimate.calories,
            proteines: estimate.proteines,
            glucides: estimate.glucides,
            lipides: estimate.lipides,
          }]);
        }

        setDetectedMeal(mealData);
      } catch (error) {
        console.error('Detection error:', error);
        alert('Erreur lors de la détection. Essayez avec une autre image.');
        setUploadedImage(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle barcode scan
  const handleBarcodeScan = async (barcode: string) => {
    setShowBarcodeScanner(false);
    setIsLoading(true);

    try {
      const product = await obtenirProduitParCodeBarres(barcode);
      
      if (!product) {
        alert('Produit non trouvé. Essayez un autre code-barres.');
        return;
      }

      const mealData = {
        nom: product.nom,
        calories: Math.round(product.calories),
        proteines: product.proteines,
        glucides: product.glucides,
        lipides: product.lipides,
        image: product.image,
        nutriScore: product.nutriScore,
        codeBarres: barcode,
        marques: product.marques,
      };

      setDetectedMeal(mealData);
      setUploadedImage(product.image || null);
      setActiveTab('scan');
    } catch (error) {
      console.error('Barcode error:', error);
      alert('Erreur lors de la recherche du produit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = () => {
    if (detectedMeal) {
      const newMeal = {
        id: Date.now(),
        ...detectedMeal,
        timestamp: new Date().toISOString(),
        ingredients: ingredients.length > 0 ? ingredients : undefined,
      };
      
      setMeals([...meals, newMeal]);
      saveMeal(newMeal);
      
      setDetectedMeal(null);
      setUploadedImage(null);
      setIngredients([]);
      setActiveTab('history');
    }
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter((m) => m.id !== id));
    removeMeal(id);
  };

  const handleAddIngredient = async (foodName: string) => {
    setIsLoading(true);
    try {
      const results = await chercherAlimentParNom(foodName);
      
      let food;
      if (results.length > 0) {
        food = results[0];
      } else {
        food = obtenirEstimationAlimentGenerique(foodName);
      }
      
      setIngredients([
        ...ingredients,
        { 
          ...food, 
          id: Date.now(), 
          quantity: 100 
        },
      ]);
    } catch (error) {
      console.error('Add ingredient error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleUpdateIngredient = (id: number, key: string, value: any) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [key]: value } : ing))
    );
  };

  const handleSaveRecipe = () => {
    if (plan === 'fitness' && ingredients.length > 0) {
      const newRecipe = {
        id: Date.now(),
        nom: detectedMeal?.nom || 'Custom Recipe',
        ingredients: ingredients,
        totalCalories: ingredientsTotals.calories,
        totalProteines: ingredientsTotals.protein,
        totalGlucides: ingredientsTotals.carbs,
        totalLipides: ingredientsTotals.fat,
        createdAt: new Date().toISOString(),
      };
      
      setRecipes([...recipes, newRecipe]);
      addRecipe(newRecipe);
      
      setShowModal('recipe_saved');
      setTimeout(() => {
        setShowModal(null);
      }, 2000);
    }
  };

  const handleCalculateTDEE = () => {
    const tdee = calculateTDEE(profile);
    setDailyCalories(tdee);
    setProfile({ ...profile, dailyCalories: tdee });
    saveProfile({ ...profile, dailyCalories: tdee });
    setShowModal('tdee_calculated');
    setTimeout(() => setShowModal(null), 2000);
  };

  // Lock check helper
  const isFeatureLocked = (feature: string) => {
    if (feature === 'macros' && plan === 'free') return true;
    if (feature === 'table' && plan !== 'fitness') return true;
    if (feature === 'coach' && plan !== 'fitness') return true;
    if (feature === 'recipes' && plan !== 'fitness') return true;
    if (feature === 'barcode' && plan === 'free') return true;
    return false;
  };

  const handleLockedFeature = (feature: string) => {
    if (isFeatureLocked(feature)) {
      setShowModal(`locked_${feature}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-24 md:pb-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b-2 border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black gradient-text">PhotoCalories</h1>
            <a href="/settings">
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                <Settings className="w-5 h-5" />
              </button>
            </a>
          </div>

          {/* Plan Switcher */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['free', 'pro', 'fitness'].map((p) => (
              <motion.button
                key={p}
                onClick={() => setPlan(p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  plan === p
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <p className="text-sm text-gray-600 mb-2">🔥 Calories</p>
            <p className="text-3xl font-black text-blue-600">{Math.round(totals.calories)}</p>
            {plan !== 'free' && (
              <p className="text-xs text-gray-600 mt-1">/ {dailyCalories}</p>
            )}
          </div>

          {plan !== 'free' && (
            <>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <p className="text-sm text-gray-600 mb-2">💪 Protéine</p>
                <p className="text-3xl font-black text-purple-600">{totals.protein.toFixed(1)}g</p>
              </div>
              <div className="card bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300">
                <p className="text-sm text-gray-600 mb-2">🍞 Glucides</p>
                <p className="text-3xl font-black text-pink-600">{totals.carbs.toFixed(1)}g</p>
              </div>
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
                <p className="text-sm text-gray-600 mb-2">🧈 Lipides</p>
                <p className="text-3xl font-black text-yellow-600">{totals.fat.toFixed(1)}g</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'scan', icon: Upload, label: 'Upload' },
            { id: 'barcode', icon: Barcode, label: 'Scan', locked: plan === 'free' },
            { id: 'table', icon: BarChart3, label: 'Tableau', locked: plan !== 'fitness' },
            { id: 'history', icon: History, label: 'Historique' },
            { id: 'coach', icon: Zap, label: 'Coach', locked: plan !== 'fitness' },
            { id: 'recipes', icon: Book, label: 'Recettes', locked: plan !== 'fitness' },
          ].map((tab: any) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (tab.locked) {
                  handleLockedFeature(tab.id);
                } else if (tab.id === 'barcode') {
                  setShowBarcodeScanner(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id && !tab.locked
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.locked && <Lock className="w-3 h-3" />}
            </motion.button>
          ))}
        </div>

        {/* Tab Content - Continued in next message due to length */}
        {activeTab === 'scan' && (
          <div className="card text-center py-12">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Uploadez votre plat</h3>
            <p className="text-gray-600 mb-6">IA reconnaît les aliments en 2 sec</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input">
              <button
                className="btn-primary cursor-pointer"
                onClick={() => document.getElementById('image-input')?.click()}
              >
                Sélectionner image
              </button>
            </label>
          </div>
        )}

        {activeTab === 'history' && meals.map(meal => (
          <div key={meal.id} className="card mb-4">
            <h4 className="font-bold">{meal.nom}</h4>
            <p className="text-sm text-gray-600">{new Date(meal.timestamp).toLocaleString('fr-FR')}</p>
            <p className="text-blue-600 font-bold">{meal.calories} kcal</p>
            <button onClick={() => handleDeleteMeal(meal.id)} className="text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </div>
  );
}

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
