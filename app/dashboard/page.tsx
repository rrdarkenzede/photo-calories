'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Plus, X, Edit2, Trash2, TrendingUp, Zap, ChefHat, History, Settings } from 'lucide-react';
import Link from 'next/link';

const Dashboard = () => {
  const [plan, setPlan] = useState('free'); // free, pro, fitness
  const [activeTab, setActiveTab] = useState('scan'); // scan, table, history, settings
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: 100, unit: 'g' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const cameraRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);

  // Nutrition data mock
  const nutritionDb: any = {
    'lait': { calories: 64, protein: 3.2, carbs: 4.8, fat: 3.6, fiber: 0, sugar: 4.8, sodium: 49 },
    'laitue': { calories: 15, protein: 1.2, carbs: 2.9, fat: 0.2, fiber: 1.3, sugar: 0.6, sodium: 36 },
    'pain': { calories: 265, protein: 9, carbs: 49, fat: 3.3, fiber: 2.7, sugar: 3, sodium: 500 },
    'poulet': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    'riz': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 2 },
    'pâtes': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 6 },
    'tomate': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
    'olive': { calories: 115, protein: 0.8, carbs: 6.3, fat: 10.7, fiber: 1.6, sugar: 0.5, sodium: 346 },
    'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 3, sodium: 500 },
    'glace': { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0, sugar: 21, sodium: 52 },
  };

  const calculateTotalNutrition = () => {
    return ingredients.reduce((acc, ing) => {
      const db = nutritionDb[ing.name.toLowerCase()] || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
      const multiplier = ing.quantity / 100;
      return {
        calories: acc.calories + (db.calories * multiplier),
        protein: acc.protein + (db.protein * multiplier),
        carbs: acc.carbs + (db.carbs * multiplier),
        fat: acc.fat + (db.fat * multiplier),
        fiber: acc.fiber + (db.fiber * multiplier),
        sugar: acc.sugar + (db.sugar * multiplier),
        sodium: acc.sodium + (db.sodium * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
  };

  const addIngredient = () => {
    if (newIngredient.name) {
      if (editingId !== null) {
        setIngredients(ingredients.map((ing, i) => i === editingId ? newIngredient : ing));
        setEditingId(null);
      } else {
        setIngredients([...ingredients, newIngredient]);
      }
      setNewIngredient({ name: '', quantity: 100, unit: 'g' });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setLoading(false);
          // Mock data
          setMealName('Plat identifié');
          setIngredients([
            { name: 'Pain', quantity: 100, unit: 'g' },
            { name: 'Fromage', quantity: 50, unit: 'g' },
          ]);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMeal = () => {
    if (mealName && ingredients.length > 0) {
      const nutrition = calculateTotalNutrition();
      setHistory([{
        id: Date.now(),
        name: mealName,
        image: imagePreview,
        ingredients,
        nutrition,
        date: new Date(),
      }, ...history]);
      // Reset
      setMealName('');
      setIngredients([]);
      setImagePreview(null);
      setActiveTab('history');
    }
  };

  const calories = calculateTotalNutrition().calories;
  const dailyGoal = plan === 'free' ? null : 2000;
  const caloriesRemaining = dailyGoal ? dailyGoal - calories : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 md:pb-0">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-gray-700/30 backdrop-blur-md bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            PhotoCalories
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Plan</p>
              <p className="text-sm font-bold capitalize text-white">{plan}</p>
            </div>
            <Link href="/">
              <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Calories Card */}
        <div className="max-w-6xl mx-auto px-4 py-4 border-t border-gray-700/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Calories</p>
              <p className="text-2xl font-bold text-white">{Math.round(calories)}</p>
              {caloriesRemaining !== null && (
                <p className="text-xs text-gray-300 mt-1">Restant: {Math.round(caloriesRemaining)}</p>
              )}
            </motion.div>

            {(plan === 'pro' || plan === 'fitness') && (
              <>
                <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Protéines</p>
                  <p className="text-2xl font-bold text-purple-300">{Math.round(calculateTotalNutrition().protein)}g</p>
                </motion.div>

                <motion.div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Glucides</p>
                  <p className="text-2xl font-bold text-yellow-300">{Math.round(calculateTotalNutrition().carbs)}g</p>
                </motion.div>

                <motion.div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Lipides</p>
                  <p className="text-2xl font-bold text-orange-300">{Math.round(calculateTotalNutrition().fat)}g</p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <motion.div className="flex gap-2 mb-8 flex-wrap md:flex-nowrap">
          {[
            { id: 'scan', icon: Camera, label: 'Scanner' },
            plan === 'fitness' && { id: 'table', icon: ChefHat, label: 'Ingrédients' },
            { id: 'history', icon: History, label: 'Historique' },
          ].filter(Boolean).map((tab: any) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6">Upload ou Scan</h2>

              {imagePreview && (
                <div className="mb-6 relative">
                  <img src={imagePreview} alt="Preview" className="w-full rounded-lg max-h-96 object-cover" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </button>
                {/* Camera would go here */}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin">
                    <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full" />
                  </div>
                  <p className="mt-4 text-gray-300">Analyse en cours...</p>
                </div>
              )}

              {mealName && !loading && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Nom du plat</p>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4"
                  />

                  {plan === 'fitness' && (
                    <button
                      onClick={() => setActiveTab('table')}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold transition"
                    >
                      Modifier les ingrédients
                    </button>
                  )}

                  <button
                    onClick={saveMeal}
                    className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold transition"
                  >
                    Enregistrer
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'table' && plan === 'fitness' && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6">Ingrédients</h2>

              {/* Input */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Nom de l'ingrédient"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  className="input-field"
                  list="ingredients"
                />
                <datalist id="ingredients">
                  {Object.keys(nutritionDb).map(ing => <option key={ing} value={ing} />)}
                </datalist>
                <input
                  type="number"
                  placeholder="Quantité"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
                <button
                  onClick={addIngredient}
                  className="py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">Ingrédient</th>
                      <th className="text-center py-3 px-4 text-gray-400">Qté</th>
                      <th className="text-right py-3 px-4 text-gray-400">Cal</th>
                      <th className="text-right py-3 px-4 text-gray-400">Prot</th>
                      <th className="text-right py-3 px-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, i) => {
                      const db = nutritionDb[ing.name.toLowerCase()] || { calories: 0, protein: 0 };
                      return (
                        <tr key={i} className="border-b border-gray-700 hover:bg-gray-800/30">
                          <td className="py-3 px-4 text-white">{ing.name}</td>
                          <td className="text-center py-3 px-4 text-gray-300">{ing.quantity}g</td>
                          <td className="text-right py-3 px-4 text-yellow-400 font-bold">{Math.round(db.calories * ing.quantity / 100)}</td>
                          <td className="text-right py-3 px-4 text-purple-400 font-bold">{Math.round(db.protein * ing.quantity / 100 * 10) / 10}g</td>
                          <td className="text-right py-3 px-4">
                            <button onClick={() => removeIngredient(i)} className="p-2 hover:bg-red-600/20 rounded transition">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={saveMeal}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold transition"
              >
                Enregistrer la recette
              </button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-6">Historique</h2>
              {history.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-400">Aucun plat enregistré pour le moment</p>
                </div>
              ) : (
                history.map(meal => (
                  <motion.div key={meal.id} className="card" whileHover={{ scale: 1.02 }}>
                    <div className="flex gap-4">
                      {meal.image && (
                        <img src={meal.image} alt={meal.name} className="w-24 h-24 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{meal.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{meal.date.toLocaleString('fr-FR')}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="text-sm">
                            <p className="text-gray-400 text-xs">Calories</p>
                            <p className="font-bold text-yellow-400">{Math.round(meal.nutrition.calories)}</p>
                          </div>
                          {(plan === 'pro' || plan === 'fitness') && (
                            <>
                              <div className="text-sm">
                                <p className="text-gray-400 text-xs">Protéines</p>
                                <p className="font-bold text-purple-400">{Math.round(meal.nutrition.protein)}g</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-400 text-xs">Glucides</p>
                                <p className="font-bold text-blue-400">{Math.round(meal.nutrition.carbs)}g</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-400 text-xs">Lipides</p>
                                <p className="font-bold text-orange-400">{Math.round(meal.nutrition.fat)}g</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <motion.nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-gray-700 z-40">
        <div className="flex justify-around">
          {[{ id: 'scan', icon: Camera }, { id: 'history', icon: History }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex items-center justify-center ${
                activeTab === tab.id ? 'text-blue-400 border-t-2 border-blue-400' : 'text-gray-400'
              }`}
            >
              <tab.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default Dashboard;
