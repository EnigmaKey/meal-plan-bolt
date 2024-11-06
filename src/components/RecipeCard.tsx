import React from 'react';
import { Clock } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const getDefaultImage = (title: string): string => {
  // Common food keywords and their corresponding Unsplash images
  const defaultImages: { [key: string]: string } = {
    // Meals
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    dinner: 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d',
    
    // Proteins
    chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
    beef: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976',
    fish: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62',
    salmon: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6',
    shrimp: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47',
    
    // Carbs
    pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
    rice: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6',
    bread: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    
    // Vegetables
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    vegetable: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    
    // Desserts
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    cookie: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    dessert: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    
    // Default
    default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352'
  };

  const titleLower = title.toLowerCase();
  
  // Find the first matching keyword in the title
  const matchingKey = Object.keys(defaultImages).find(key => 
    titleLower.includes(key)
  );

  return matchingKey 
    ? `${defaultImages[matchingKey]}?auto=format&fit=crop&w=800&q=80` 
    : `${defaultImages.default}?auto=format&fit=crop&w=800&q=80`;
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const imageUrl = recipe.image || getDefaultImage(recipe.title);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-102 hover:shadow-lg"
    >
      <img
        src={imageUrl}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-1" />
          <span className="text-sm">
            {recipe.cookTime ? `${recipe.cookTime} mins` : 'Time N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};