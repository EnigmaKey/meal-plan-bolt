import React from 'react';
import { ArrowLeft, Clock, Users, Edit2, BookmarkPlus, Check } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  showEditButton?: boolean;
  showSaveButton?: boolean;
  isSaved?: boolean;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onEdit,
  onSave,
  showEditButton,
  showSaveButton,
  isSaved,
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onBack}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          {showEditButton && onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <Edit2 size={24} />
            </button>
          )}
        </div>
        {showSaveButton && onSave && (
          <button
            onClick={onSave}
            className={`absolute top-4 right-24 px-4 py-2 rounded-full shadow-md flex items-center gap-2 ${
              isSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isSaved ? <Check size={20} /> : <BookmarkPlus size={20} />}
            <span>{isSaved ? 'Saved' : 'Save Recipe'}</span>
          </button>
        )}
      </div>
      
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h2>
        
        <div className="flex gap-4 mb-6">
          {recipe.cookTime && (
            <div className="flex items-center text-gray-600">
              <Clock size={20} className="mr-2" />
              <span>{recipe.cookTime} mins</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center text-gray-600">
              <Users size={20} className="mr-2" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <div className="prose prose-emerald max-w-none">
            {recipe.instructions.split('\n').map((step, index) => (
              <p key={index} className="mb-4 text-gray-700">{step}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};