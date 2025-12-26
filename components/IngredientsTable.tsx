'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/lib/types';
import { getAutocompleteSuggestions } from '@/lib/api-helpers';
import { Plus, X, Loader2 } from 'lucide-react';

interface IngredientsTableProps {
  ingredients: Ingredient[];
  editable: boolean;
  showMicros: boolean;
  onIngredientsChange?: (ingredients: Ingredient[]) => void;
}

export function IngredientsTable({
  ingredients,
  editable,
  showMicros,
  onIngredientsChange,
}: IngredientsTableProps) {
  const [localIngredients, setLocalIngredients] = useState(ingredients);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      quantity: 100,
      unit: 'g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    const updated = [...localIngredients, newIngredient];
    setLocalIngredients(updated);
    onIngredientsChange?.(updated);
  };

  const handleRemoveIngredient = (id: string) => {
    const updated = localIngredients.filter((ing) => ing.id !== id);
    setLocalIngredients(updated);
    onIngredientsChange?.(updated);
  };

  const handleUpdateIngredient = (id: string, field: string, value: any) => {
    const updated = localIngredients.map((ing) =>
      ing.id === id ? { ...ing, [field]: value } : ing
    );
    setLocalIngredients(updated);
    onIngredientsChange?.(updated);
  };

  const handleNameChange = async (id: string, value: string) => {
    handleUpdateIngredient(id, 'name', value);

    if (value.length > 1) {
      setLoadingSuggestions(true);
      const sug = await getAutocompleteSuggestions(value);
      setSuggestions(sug);
      setActiveSuggestion(null);
      setLoadingSuggestions(false);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const ingredient = localIngredients.find((ing) => ing.name === '');
    if (ingredient) {
      handleUpdateIngredient(ingredient.id, 'name', suggestion);
    }
    setSuggestions([]);
  };

  const totalCalories = localIngredients.reduce((sum, ing) => sum + ing.calories, 0);
  const totalProtein = localIngredients.reduce((sum, ing) => sum + ing.protein, 0);
  const totalCarbs = localIngredients.reduce((sum, ing) => sum + ing.carbs, 0);
  const totalFat = localIngredients.reduce((sum, ing) => sum + ing.fat, 0);
  const totalFiber = localIngredients.reduce((sum, ing) => sum + (ing.fiber || 0), 0);
  const totalSugar = localIngredients.reduce((sum, ing) => sum + (ing.sugar || 0), 0);
  const totalSodium = localIngredients.reduce((sum, ing) => sum + (ing.sodium || 0), 0);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">
                Ingrédient
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                Qte
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                Kcal
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                Prot (g)
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                Carbs (g)
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                Lipides (g)
              </th>
              {showMicros && (
                <>
                  <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                    Fibres (g)
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                    Sucre (g)
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                    Sel (mg)
                  </th>
                </>
              )}
              {editable && <th className="px-4 py-2 text-center"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {localIngredients.map((ingredient) => (
              <tr key={ingredient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-4 py-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleNameChange(ingredient.id, e.target.value)}
                      disabled={!editable}
                      className="w-full px-2 py-1 border rounded disabled:bg-slate-50 dark:disabled:bg-slate-700"
                      placeholder="Nom de l'ingrédient"
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded mt-1 shadow-lg z-10">
                        {loadingSuggestions ? (
                          <div className="p-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Chargement...
                          </div>
                        ) : (
                          suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectSuggestion(sug)}
                              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                            >
                              {sug}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleUpdateIngredient(
                        ingredient.id,
                        'quantity',
                        parseFloat(e.target.value)
                      )
                    }
                    disabled={!editable}
                    className="w-16 px-2 py-1 border rounded text-right disabled:bg-slate-50 dark:disabled:bg-slate-700"
                  />
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  {ingredient.calories.toFixed(0)}
                </td>
                <td className="px-4 py-2 text-right">{ingredient.protein.toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{ingredient.carbs.toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{ingredient.fat.toFixed(1)}</td>
                {showMicros && (
                  <>
                    <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">
                      {(ingredient.fiber || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">
                      {(ingredient.sugar || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">
                      {(ingredient.sodium || 0).toFixed(0)}
                    </td>
                  </>
                )}
                {editable && (
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-slate-50 dark:bg-slate-800 font-semibold">
              <td className="px-4 py-2">TOTAL</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-right">{totalCalories.toFixed(0)}</td>
              <td className="px-4 py-2 text-right">{totalProtein.toFixed(1)}</td>
              <td className="px-4 py-2 text-right">{totalCarbs.toFixed(1)}</td>
              <td className="px-4 py-2 text-right">{totalFat.toFixed(1)}</td>
              {showMicros && (
                <>
                  <td className="px-4 py-2 text-right">{totalFiber.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{totalSugar.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{totalSodium.toFixed(0)}</td>
                </>
              )}
              {editable && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add button */}
      {editable && (
        <button
          onClick={handleAddIngredient}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter un ingrédient
        </button>
      )}

      {/* Message for Pro users */}
      {!editable && localIngredients.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
          🔍 Pour modifier ce tableau, deviens <strong>Plan Fitness!</strong>
        </div>
      )}
    </div>
  );
}
