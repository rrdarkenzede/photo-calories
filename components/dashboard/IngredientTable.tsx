'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientTable({ ingredients, onChange }: IngredientTableProps) {
  const handleDelete = (id: number) => {
    onChange(ingredients.filter((i) => i.id !== id));
  };

  const handleUpdate = (id: number, field: string, value: any) => {
    onChange(
      ingredients.map((i) =>
        i.id === id ? { ...i, [field]: value } : i
      )
    );
  };

  const handleAdd = () => {
    onChange([
      ...ingredients,
      {
        id: Date.now(),
        name: '',
        quantity: 100,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-2 font-semibold">Ingédient</th>
              <th className="text-center py-2 px-2 font-semibold">Qty</th>
              <th className="text-center py-2 px-2 font-semibold">Cal</th>
              <th className="text-center py-2 px-2 font-semibold">P</th>
              <th className="text-center py-2 px-2 font-semibold">G</th>
              <th className="text-center py-2 px-2 font-semibold">L</th>
              <th className="text-center py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr key={ing.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <input
                    type="text"
                    placeholder="Nom"
                    value={ing.name}
                    onChange={(e) => handleUpdate(ing.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={ing.quantity}
                    onChange={(e) =>
                      handleUpdate(ing.id, 'quantity', parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={ing.calories}
                    onChange={(e) =>
                      handleUpdate(ing.id, 'calories', parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={ing.protein}
                    onChange={(e) =>
                      handleUpdate(ing.id, 'protein', parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={ing.carbs}
                    onChange={(e) =>
                      handleUpdate(ing.id, 'carbs', parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={ing.fat}
                    onChange={(e) =>
                      handleUpdate(ing.id, 'fat', parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => handleDelete(ing.id)}
                    className="p-1 hover:bg-red-100 rounded transition"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Ajouter un ingédient
      </button>
    </div>
  );
}
