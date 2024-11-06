import React, { useState } from 'react';
import { Search as SearchIcon, BookmarkPlus } from 'lucide-react';
import { Recipe } from '../types';
import { searchRecipes } from '../services/recipeService';
import { RecipeCard } from './RecipeCard';
import { RecipeDetail } from './RecipeDetail';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModel';

export const SearchView: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (err) {
      console.error(err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe, event?: React.MouseEvent) => {
    event?.stopPropagation();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const existingRecipes = JSON.parse(localStorage.getItem(`recipes_${user.id}`) || '[]');
    const isAlreadySaved = existingRecipes.some((r: Recipe) => r.id === recipe.id);
    
    if (!isAlreadySaved) {
      localStorage.setItem(
        `recipes_${user.id}`,
        JSON.stringify([...existingRecipes, recipe])
      );
    }
  };

  const isRecipeSaved = (recipeId: string): boolean => {
    if (!user) return false;
    const existingRecipes = JSON.parse(localStorage.getItem(`recipes_${user.id}`) || '[]');
    return existingRecipes.some((r: Recipe) => r.id.toString() === recipeId);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onSave={() => handleSaveRecipe(selectedRecipe)}
        isSaved={isRecipeSaved(selectedRecipe.id.toString())}
        showSaveButton
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search recipes..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <RecipeCard
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
              <button
                onClick={(e) => handleSaveRecipe(recipe, e)}
                className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all ${
                  isRecipeSaved(recipe.id.toString())
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100'
                }`}
              >
                <BookmarkPlus size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {loading ? 'Searching for recipes...' : 'No recipes found. Try searching for something!'}
          </p>
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};