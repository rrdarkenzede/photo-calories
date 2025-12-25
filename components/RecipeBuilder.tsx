'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { searchIngredients, INGREDIENTS } from '@/lib/ingredients';
import { searchIngredientsUSDA } from '@/lib/usdaFoodData';
import { searchProductByName } from '@/lib/openfoodfacts';
import { Recipe, RecipeIngredient } from '@/store/useStore';

type IngredientData = typeof INGREDIENTS[0];

export default function RecipeBuilder() {
  const { plan, addRecipe } = useStore();
  const [recipeName, setRecipeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [prepTime, setPrepTime] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<string>('Moyen');
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);

    try {
      // ✅ 1. BASE LOCALE (200 ingrédients français - PRIORITÉ)
      const resultsLocal = searchIngredients(query).slice(0, 5);

      // ✅ 2. USDA (900,000+ aliments - traduits en français)
      const resultsUSDA = await searchIngredientsUSDA(query);

      // ✅ 3. OPENFOODFACTS (1M+ produits de marque)
      const resultsOpenFood = await searchProductByName(query, 1);
      const openFoodFormatted = resultsOpenFood.map((product) => ({
        id: `openfood-${product.name}`,
        name: product.name,
        category: 'Produits de marque',
        kcal100g: product.kcal,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
        fiber: product.fiber,
        sugar: product.sugar,
        salt: product.salt,
        nutriScore: product.nutriScore,
        brand: product.brand,
      }));

      // ✅ FUSION DES 3 SOURCES (priorité: local > USDA > OpenFood)
      const allResults = [
        ...resultsLocal,
        ...resultsUSDA.slice(0, 10),
        ...openFoodFormatted.slice(0, 5),
      ].slice(0, 20);

      console.log(`✅ ${allResults.length} résultats trouvés pour "${query}"`);
      setSearchResults(allResults);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addIngredient = (ingredient: any) => {
    const newIngredient: RecipeIngredient = {
      id: `recipe-ing-${Date.now()}-${Math.random()}`,
      name: ingredient.name,
      category: ingredient.category,
      quantity: 100,
      unit: 'g',
      weight: 100,
      kcal100g: ingredient.kcal100g,
      kcal: ingredient.kcal100g,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber,
      sugar: ingredient.sugar,
      salt: ingredient.salt,
    };

    setSelectedIngredients([...selectedIngredients, newIngredient]);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const updateIngredientQuantity = (id: string, quantity: number) => {
    setSelectedIngredients(
      selectedIngredients.map((ing) => {
        if (ing.id === id) {
          const multiplier = quantity / 100;
          return {
            ...ing,
            quantity,
            weight: quantity,
            kcal: ing.kcal100g * multiplier,
            protein: (ing.kcal100g > 0 ? (ing.protein / (ing.kcal100g / 100)) : ing.protein) * multiplier,
            carbs: (ing.kcal100g > 0 ? (ing.carbs / (ing.kcal100g / 100)) : ing.carbs) * multiplier,
            fat: (ing.kcal100g > 0 ? (ing.fat / (ing.kcal100g / 100)) : ing.fat) * multiplier,
            fiber: ing.fiber ? (ing.kcal100g > 0 ? (ing.fiber / (ing.kcal100g / 100)) : ing.fiber) * multiplier : undefined,
            sugar: ing.sugar ? (ing.kcal100g > 0 ? (ing.sugar / (ing.kcal100g / 100)) : ing.sugar) * multiplier : undefined,
            salt: ing.salt ? (ing.kcal100g > 0 ? (ing.salt / (ing.kcal100g / 100)) : ing.salt) * multiplier : undefined,
          };
        }
        return ing;
      })
    );
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter((ing) => ing.id !== id));
  };

  const addInstructionStep = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim()) {
      alert('❌ Donne un nom à ta recette!');
      return;
    }

    if (selectedIngredients.length === 0) {
      alert('❌ Ajoute au moins un ingrédient!');
      return;
    }

    const totalKcal = selectedIngredients.reduce((sum, ing) => sum + ing.kcal, 0);
    const totalProtein = selectedIngredients.reduce((sum, ing) => sum + ing.protein, 0);
    const totalCarbs = selectedIngredients.reduce((sum, ing) => sum + ing.carbs, 0);
    const totalFat = selectedIngredients.reduce((sum, ing) => sum + ing.fat, 0);
    const totalWeight = selectedIngredients.reduce((sum, ing) => sum + ing.weight, 0);

    const recipe: Recipe = {
      id: Date.now(),
      name: recipeName,
      ingredients: selectedIngredients,
      createdAt: new Date().toISOString(),
      totalKcal,
      totalProtein,
      totalCarbs,
      totalFat,
      totalWeight,
      prepTime,
      difficulty,
      instructions: instructions.filter((s) => s.trim() !== ''),
    };

    addRecipe(recipe);
    alert('✅ Recette sauvegardée!');
    resetForm();
  };

  const resetForm = () => {
    setRecipeName('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIngredients([]);
    setPrepTime(30);
    setDifficulty('Moyen');
    setInstructions(['']);
    setShowResults(false);
  };

  const totalKcal = selectedIngredients.reduce((sum, ing) => sum + ing.kcal, 0);
  const totalProtein = selectedIngredients.reduce((sum, ing) => sum + ing.protein, 0);
  const totalCarbs = selectedIngredients.reduce((sum, ing) => sum + ing.carbs, 0);
  const totalFat = selectedIngredients.reduce((sum, ing) => sum + ing.fat, 0);
  const totalWeight = selectedIngredients.reduce((sum, ing) => sum + ing.weight, 0);
  const totalFiber = selectedIngredients.reduce((sum, ing) => sum + (ing.fiber || 0), 0);
  const totalSugar = selectedIngredients.reduce((sum, ing) => sum + (ing.sugar || 0), 0);
  const totalSalt = selectedIngredients.reduce((sum, ing) => sum + (ing.salt || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">👨‍🍳</span>
          <div>
            <h2 className="text-2xl font-bold text-orange-900">Créateur de Recettes</h2>
            <p className="text-sm text-orange-700">900,000+ ingrédients disponibles (USDA + OpenFood + Base locale)</p>
          </div>
        </div>

        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Nom de la recette..."
          className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 mb-4"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Temps de préparation</label>
            <select
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 heure</option>
              <option value={90}>1h30</option>
              <option value={120}>2 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Difficulté</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Rechercher un ingrédient</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ex: poulet, riz, brocoli... (900,000+ aliments)"
            className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500"
          />

          {searching && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-orange-300 rounded-xl shadow-2xl p-4 text-center">
              <div className="inline-block animate-spin text-2xl">⚙️</div>
              <p className="text-sm text-gray-600 mt-2">Recherche dans 900,000+ aliments...</p>
            </div>
          )}

          {!searching && showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-orange-300 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
              {searchResults.map((ingredient, idx) => (
                <button
                  key={`${ingredient.id}-${idx}`}
                  onClick={() => addIngredient(ingredient)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-all border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{ingredient.name}</div>
                      <div className="text-xs text-gray-600">
                        {ingredient.category} • {ingredient.kcal100g} kcal/100g
                        {ingredient.brand && ` • ${ingredient.brand}`}
                      </div>
                    </div>
                    {ingredient.nutriScore && (
                      <span
                        className={`
                          ml-2 px-2 py-1 rounded-full text-xs font-bold
                          ${ingredient.nutriScore === 'A' ? 'bg-green-500 text-white' : ''}
                          ${ingredient.nutriScore === 'B' ? 'bg-lime-400 text-green-900' : ''}
                          ${ingredient.nutriScore === 'C' ? 'bg-yellow-400 text-yellow-900' : ''}
                          ${ingredient.nutriScore === 'D' ? 'bg-orange-400 text-orange-900' : ''}
                          ${ingredient.nutriScore === 'E' ? 'bg-red-500 text-white' : ''}
                        `}
                      >
                        {ingredient.nutriScore}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searching && showResults && searchResults.length === 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-red-300 rounded-xl shadow-2xl p-4 text-center">
              <p className="text-red-600 font-semibold">❌ Aucun résultat trouvé</p>
            </div>
          )}
        </div>
      </div>

      {selectedIngredients.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
          <h3 className="text-xl font-bold text-green-900 mb-4">📋 Ingrédients ({selectedIngredients.length})</h3>

          <div className="space-y-3 mb-6">
            {selectedIngredients.map((ingredient) => (
              <div key={ingredient.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <strong className="text-gray-800">{ingredient.name}</strong>
                    <span className="ml-2 text-xs text-gray-500">({ingredient.category})</span>
                  </div>
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ❌
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredientQuantity(ingredient.id, Number(e.target.value))}
                    className="flex-1 accent-green-600"
                  />
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredientQuantity(ingredient.id, Number(e.target.value))}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold"
                  />
                  <span className="text-gray-600 font-semibold">g</span>
                </div>

                {/* ✅ TOUT LE MONDE VOIT TOUT (plan FITNESS appliqué à tous) */}
                <div className="grid grid-cols-4 gap-2 mt-3 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-bold text-red-600">{ingredient.kcal.toFixed(0)}</div>
                    <div className="text-xs">kcal</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{ingredient.protein.toFixed(1)}g</div>
                    <div className="text-xs">P</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{ingredient.carbs.toFixed(1)}g</div>
                    <div className="text-xs">G</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{ingredient.fat.toFixed(1)}g</div>
                    <div className="text-xs">L</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-2">
                  <div className="text-center">Sucres: {(ingredient.sugar || 0).toFixed(1)}g</div>
                  <div className="text-center">Sel: {(ingredient.salt || 0).toFixed(2)}g</div>
                  <div className="text-center">Fibres: {(ingredient.fiber || 0).toFixed(1)}g</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
            <h4 className="font-bold text-blue-900 mb-4">📊 Totaux nutritionnels</h4>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-red-600">{totalKcal.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Protéines</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Glucides</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Lipides</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-white rounded-xl p-3 text-center shadow-md">
                <div className="text-lg font-bold text-pink-600">{totalSugar.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Sucres</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md">
                <div className="text-lg font-bold text-purple-600">{totalSalt.toFixed(2)}g</div>
                <div className="text-xs text-gray-600">Sel</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md">
                <div className="text-lg font-bold text-green-600">{totalFiber.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Fibres</div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500">Poids total: {totalWeight}g</div>
          </div>
        </div>
      )}

      {selectedIngredients.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
          <h3 className="text-xl font-bold text-purple-900 mb-4">📝 Instructions (optionnel)</h3>

          <div className="space-y-3 mb-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Étape ${index + 1}...`}
                  className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                  rows={2}
                />
                {instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(index)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addInstructionStep}
            className="w-full py-3 bg-purple-200 text-purple-800 rounded-xl font-bold hover:bg-purple-300 transition-all"
          >
            ➕ Ajouter une étape
          </button>
        </div>
      )}

      {selectedIngredients.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleSaveRecipe}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            💾 Sauvegarder la recette
          </button>
          <button
            onClick={resetForm}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
          >
            🔄 Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}
