import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { RecipeDetail } from './RecipeDetail';
import { EditRecipeModal } from './EditRecipeModal';

export const RecipesView: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (user) {
      const userRecipes = JSON.parse(localStorage.getItem(`recipes_${user.id}`) || '[]');
      setRecipes(userRecipes);
    } else {
      setRecipes([]);
    }
  }, [user]);

  const handleEdit = (recipe: Recipe, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingRecipe(recipe);
  };

  const handleDelete = async (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user || !window.confirm('Are you sure you want to delete this recipe?')) return;

    const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    localStorage.setItem(`recipes_${user.id}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  const handleSaveEdit = (updatedRecipe: Recipe) => {
    if (!user) return;

    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    localStorage.setItem(`recipes_${user.id}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
    setEditingRecipe(null);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Sign in to view your recipes
        </h2>
        <p className="text-gray-600">
          Create an account or sign in to save and manage your recipes.
        </p>
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <div>
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
          onEdit={() => setEditingRecipe(selectedRecipe)}
          showEditButton
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't saved any recipes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <RecipeCard
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(recipe, e)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={(e) => handleDelete(recipe.id, e)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onSave={handleSaveEdit}
          onClose={() => setEditingRecipe(null)}
        />
      )}
    </div>
  );
};