import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Recipe } from '../types';

interface EditRecipeModalProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onClose: () => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  recipe,
  onSave,
  onClose,
}) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients, ''],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Recipe</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Title
            </label>
            <input
              type="text"
              value={editedRecipe.title}
              onChange={(e) =>
                setEditedRecipe({ ...editedRecipe, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                value={editedRecipe.cookTime}
                onChange={(e) =>
                  setEditedRecipe({ ...editedRecipe, cookTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servings
              </label>
              <input
                type="number"
                value={editedRecipe.servings}
                onChange={(e) =>
                  setEditedRecipe({ ...editedRecipe, servings: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients
            </label>
            <div className="space-y-2">
              {editedRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {editedRecipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              + Add Another Ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              value={editedRecipe.instructions}
              onChange={(e) =>
                setEditedRecipe({
                  ...editedRecipe,
                  instructions: e.target.value,
                })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};