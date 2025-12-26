'use client';

import React, { useState, useCallback } from 'react';
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
  ChevronDown,
  Home,
  Book,
  Zap,
  BarChart3,
} from 'lucide-react';

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState(searchParams?.get('plan') || 'free');
  const [activeTab, setActiveTab] = useState('scan');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedMeal, setDetectedMeal] = useState<any | null>(null);

  // Mock nutrition database
  const foodDatabase: Record<string, any> = {
    pain: { name: 'Pain blanc', calories: 265, protein: 9, carbs: 49, fat: 3.3 },
    fromage: { name: 'Fromage cheddar', calories: 403, protein: 25, carbs: 3, fat: 33 },
    tomate: { name: 'Tomate', calories: 18, protein: 1, carbs: 4, fat: 0 },
    lait: { name: 'Lait demi-écrémé', calories: 49, protein: 3.3, carbs: 4.8, fat: 1.6 },
    oeuf: { name: 'Oeuf', calories: 155, protein: 13, carbs: 1, fat: 11 },
    riz: { name: 'Riz blanc cuit', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    poulet: { name: 'Poulet rôti', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    huile: { name: 'Huile olive', calories: 884, protein: 0, carbs: 0, fat: 100 },
    pizza: { name: 'Pizza (slice)', calories: 285, protein: 12, carbs: 36, fat: 10 },
    yaourt: { name: 'Yaourt nature', calories: 59, protein: 3.5, carbs: 4.7, fat: 0.4 },
  };

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

  // Mock AI detection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        // Mock AI detection
        setTimeout(() => {
          setDetectedMeal({
            name: 'Sandwich fromage-tomate',
            calories: 400,
            protein: 15,
            carbs: 45,
            fat: 18,
            ingredients: [
              { name: 'Pain blanc', quantity: 50, calories: 265, protein: 9, carbs: 49, fat: 3.3 },
              { name: 'Fromage cheddar', quantity: 50, calories: 403, protein: 25, carbs: 3, fat: 33 },
              { name: 'Tomate', quantity: 100, calories: 18, protein: 1, carbs: 4, fat: 0 },
            ],
          });
          setIngredients(
            [
              { name: 'Pain blanc', quantity: 50, calories: 265, protein: 9, carbs: 49, fat: 3.3 },
              { name: 'Fromage cheddar', quantity: 50, calories: 403, protein: 25, carbs: 3, fat: 33 },
              { name: 'Tomate', quantity: 100, calories: 18, protein: 1, carbs: 4, fat: 0 },
            ].map((ing, i) => ({ ...ing, id: i }))
          );
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMeal = () => {
    if (detectedMeal) {
      setMeals([
        ...meals,
        {
          id: Date.now(),
          ...detectedMeal,
          timestamp: new Date().toLocaleString('fr-FR'),
          image: uploadedImage,
        },
      ]);
      setDetectedMeal(null);
      setUploadedImage(null);
      setActiveTab('history');
    }
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter((m) => m.id !== id));
  };

  const handleAddIngredient = (foodName: string) => {
    const food = foodDatabase[foodName.toLowerCase()] || {
      name: foodName,
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 5,
    };
    setIngredients([
      ...ingredients,
      { ...food, id: Date.now(), quantity: 100 },
    ]);
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
    if (plan === 'fitness') {
      setShowModal('recipe_saved');
      setTimeout(() => {
        setShowModal(null);
        setIngredients([]);
      }, 2000);
    }
  };

  const handleLaunchAnalysis = () => {
    if (plan === 'fitness') {
      handleAddMeal();
      setIngredients([]);
    }
  };

  // Lock check helper
  const isFeatureLocked = (feature: string) => {
    if (feature === 'macros' && plan === 'free') return true;
    if (feature === 'table' && plan !== 'fitness') return true;
    if (feature === 'coach' && plan !== 'fitness') return true;
    if (feature === 'recipes' && plan !== 'fitness') return true;
    if (feature === 'nutriscore' && plan !== 'fitness') return true;
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
            <p className="text-3xl font-black text-blue-600">{totals.calories}</p>
            {plan !== 'free' && (
              <p className="text-xs text-gray-600 mt-1">/ {dailyCalories}</p>
            )}
          </div>

          {plan !== 'free' && (
            <>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <p className="text-sm text-gray-600 mb-2">💪 Protéine</p>
                <p className="text-3xl font-black text-purple-600">{totals.protein.toFixed(1)}g</p>
                {plan === 'fitness' && <p className="text-xs text-gray-600 mt-1">/ 100g</p>}
              </div>
              <div className="card bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300">
                <p className="text-sm text-gray-600 mb-2">🍞 Glucides</p>
                <p className="text-3xl font-black text-pink-600">{totals.carbs.toFixed(1)}g</p>
                {plan === 'fitness' && <p className="text-xs text-gray-600 mt-1">/ 300g</p>}
              </div>
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
                <p className="text-sm text-gray-600 mb-2">🧈 Lipides</p>
                <p className="text-3xl font-black text-yellow-600">{totals.fat.toFixed(1)}g</p>
                {plan === 'fitness' && <p className="text-xs text-gray-600 mt-1">/ 65g</p>}
              </div>
            </>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'scan', icon: Upload, label: 'Upload' },
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

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Upload Tab */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              {!uploadedImage && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card border-dashed border-4 border-blue-300 bg-blue-50 text-center py-12"
                >
                  <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Uploadez votre plat</h3>
                  <p className="text-gray-600 mb-6">IA reconnaît les calories en 2 sec</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input">
                    <button
                      as="button"
                      className="btn-primary cursor-pointer"
                      onClick={() => document.getElementById('image-input')?.click()}
                    >
                      Sélectionner image
                    </button>
                  </label>
                </motion.div>
              )}

              {uploadedImage && !detectedMeal && (
                <div className="card text-center">
                  <img src={uploadedImage} alt="preview" className="w-full rounded-lg mb-4 max-h-64 object-cover" />
                  <div className="animate-pulse">
                    <p className="text-gray-600">🔍 Analyse en cours...</p>
                  </div>
                </div>
              )}

              {detectedMeal && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card">
                  {uploadedImage && (
                    <img src={uploadedImage} alt="meal" className="w-full rounded-lg mb-4 max-h-64 object-cover" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{detectedMeal.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="text-2xl font-bold text-blue-600">{detectedMeal.calories}</p>
                    </div>
                    {plan !== 'free' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Protéine</p>
                          <p className="text-2xl font-bold text-purple-600">{detectedMeal.protein}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Glucides</p>
                          <p className="text-2xl font-bold text-pink-600">{detectedMeal.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lipides</p>
                          <p className="text-2xl font-bold text-yellow-600">{detectedMeal.fat}g</p>
                        </div>
                      </>
                    )}
                  </div>

                  {plan === 'fitness' && (
                    <div>
                      <h4 className="font-bold mb-3 text-gray-900">Ingredients Table</h4>
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                              <th className="text-left p-2">Ingredient</th>
                              <th className="text-center p-2">Qty</th>
                              <th className="text-center p-2">Cal</th>
                              <th className="text-center p-2">P</th>
                              <th className="text-center p-2">C</th>
                              <th className="text-center p-2">F</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ingredients.map((ing) => (
                              <tr key={ing.id} className="border-b border-gray-200 hover:bg-blue-50">
                                <td className="p-2 font-semibold">{ing.name}</td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    value={ing.quantity}
                                    onChange={(e) =>
                                      handleUpdateIngredient(ing.id, 'quantity', parseFloat(e.target.value))
                                    }
                                    className="w-12 px-1 py-1 border rounded text-center"
                                  />
                                  g
                                </td>
                                <td className="text-center">{((ing.calories * ing.quantity) / 100).toFixed(0)}</td>
                                <td className="text-center">{((ing.protein * ing.quantity) / 100).toFixed(1)}</td>
                                <td className="text-center">{((ing.carbs * ing.quantity) / 100).toFixed(1)}</td>
                                <td className="text-center">{((ing.fat * ing.quantity) / 100).toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddMeal}
                      className="btn-success flex-1"
                    >
                      Save Meal
                    </motion.button>
                    {plan === 'fitness' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveRecipe}
                          className="btn-secondary flex-1"
                        >
                          Save Recipe
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setUploadedImage(null);
                        setDetectedMeal(null);
                        setIngredients([]);
                      }}
                      className="btn-ghost px-6"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Table Tab */}
          {activeTab === 'table' && plan === 'fitness' && (
            <div className="card">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Ingredients Table</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="text-left p-2">Ingredient</th>
                      <th className="text-center p-2">Quantité</th>
                      <th className="text-center p-2">Calories</th>
                      <th className="text-center p-2">Protéine</th>
                      <th className="text-center p-2">Glucides</th>
                      <th className="text-center p-2">Lipides</th>
                      <th className="text-center p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing) => (
                      <tr key={ing.id} className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="p-2 font-semibold">{ing.name}</td>
                        <td className="text-center">
                          <input
                            type="number"
                            value={ing.quantity}
                            onChange={(e) =>
                              handleUpdateIngredient(ing.id, 'quantity', parseFloat(e.target.value))
                            }
                            className="w-16 px-2 py-1 border rounded text-center"
                          />
                          g
                        </td>
                        <td className="text-center">{((ing.calories * ing.quantity) / 100).toFixed(0)}</td>
                        <td className="text-center">{((ing.protein * ing.quantity) / 100).toFixed(1)}</td>
                        <td className="text-center">{((ing.carbs * ing.quantity) / 100).toFixed(1)}</td>
                        <td className="text-center">{((ing.fat * ing.quantity) / 100).toFixed(1)}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteIngredient(ing.id)}
                            className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg mb-6">
                <div>
                  <p className="text-sm text-gray-600">Total Calories</p>
                  <p className="text-2xl font-bold text-blue-600">{ingredientsTotals.calories.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Protéine</p>
                  <p className="text-2xl font-bold text-purple-600">{ingredientsTotals.protein.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Glucides</p>
                  <p className="text-2xl font-bold text-pink-600">{ingredientsTotals.carbs.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Lipides</p>
                  <p className="text-2xl font-bold text-yellow-600">{ingredientsTotals.fat.toFixed(1)}g</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-gray-900">Ajouter un ingrédient:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ex: pomme, riz, poulet..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddIngredient((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="input-field"
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="ex: pomme, riz, poulet..."]') as HTMLInputElement;
                      if (input?.value) {
                        handleAddIngredient(input.value);
                        input.value = '';
                      }
                    }}
                    className="btn-primary px-4"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (ingredients.length > 0) {
                      setMeals([
                        ...meals,
                        {
                          id: Date.now(),
                          name: 'Custom Meal',
                          ...ingredientsTotals,
                          timestamp: new Date().toLocaleString('fr-FR'),
                        },
                      ]);
                      setIngredients([]);
                      setActiveTab('history');
                    }
                  }}
                  className="btn-success flex-1"
                >
                  Launch Analysis
                </motion.button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {meals.length === 0 ? (
                <div className="card text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun repas enregistré</p>
                </div>
              ) : (
                meals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex gap-4">
                      {meal.image && (
                        <img src={meal.image} alt={meal.name} className="w-24 h-24 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{meal.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{meal.timestamp}</p>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">Cal</p>
                            <p className="font-bold text-blue-600">{meal.calories}</p>
                          </div>
                          {plan !== 'free' && (
                            <>
                              <div>
                                <p className="text-gray-600">P</p>
                                <p className="font-bold text-purple-600">{meal.protein?.toFixed(1) || 'N/A'}g</p>
                              </div>
                              <div>
                                <p className="text-gray-600">C</p>
                                <p className="font-bold text-pink-600">{meal.carbs?.toFixed(1) || 'N/A'}g</p>
                              </div>
                              <div>
                                <p className="text-gray-600">F</p>
                                <p className="font-bold text-yellow-600">{meal.fat?.toFixed(1) || 'N/A'}g</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition self-start"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Coach Tab */}
          {activeTab === 'coach' && plan === 'fitness' && (
            <div className="card">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Coach IA 24/7</h3>
              <p className="text-gray-600 mb-6">Complétez votre profil pour des recommandations personnalisées</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Âge</label>
                  <input type="number" placeholder="25" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Poids (kg)</label>
                  <input type="number" placeholder="70" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Taille (cm)</label>
                  <input type="number" placeholder="180" className="input-field" />
                </div>
                <button className="btn-primary w-full">Calculate TDEE</button>
              </div>
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && plan === 'fitness' && (
            <div className="card text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune recette sauvegardée</p>
              <p className="text-sm text-gray-500 mt-2">Créez une recette en analysant un repas</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-sm w-full mx-4"
            >
              {showModal.startsWith('locked_') && (
                <>
                  <div className="text-center">
                    <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Feature Lockée</h3>
                    <p className="text-gray-600 mb-6">
                      Cette fonctionnalité nécessite le plan <span className="font-bold">Fitness</span>
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setPlan('fitness');
                        setShowModal(null);
                      }}
                      className="btn-primary w-full"
                    >
                      Switch to Fitness
                    </motion.button>
                  </div>
                </>
              )}
              {showModal === 'recipe_saved' && (
                <>
                  <div className="text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Recette Sauvegardée!</h3>
                    <p className="text-gray-600">Vous pouvez la réutiliser anytime</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <motion.nav className="fixed bottom-0 left-0 right-0 md:hidden border-t-2 border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="flex justify-around">
          {[
            { id: 'scan', icon: Home, label: 'Home' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'coach', icon: Zap, label: 'Coach' },
            { id: '', icon: Settings, label: 'Settings' },
          ].map((nav) => (
            <motion.button
              key={nav.id}
              onClick={() => (nav.id ? setActiveTab(nav.id) : (window.location.href = '/settings'))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 border-t-2 transition-all ${
                activeTab === nav.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <nav.icon className="w-5 h-5" />
              <span className="text-xs">{nav.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default DashboardPage;
