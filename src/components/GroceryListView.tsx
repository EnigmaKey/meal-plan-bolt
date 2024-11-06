import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MealPlan, Recipe } from '../types';
import { parseIngredient, combineIngredients } from '../utils/ingredientParser';
import { ShoppingCart, Check, Trash2 } from 'lucide-react';

interface GroceryItem {
  ingredient: string;
  quantity: string;
  unit: string;
  item: string;
  preparation?: string;
  checked: boolean;
}

export const GroceryListView: React.FC = () => {
  const { user } = useAuth();
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>({});

  useEffect(() => {
    if (user) {
      const savedMealPlan = localStorage.getItem(`mealPlan_${user.id}`);
      if (savedMealPlan) {
        setMealPlan(JSON.parse(savedMealPlan));
      }

      const savedGroceryItems = localStorage.getItem(`groceryList_${user.id}`);
      if (savedGroceryItems) {
        setGroceryItems(JSON.parse(savedGroceryItems));
      } else {
        generateGroceryList(JSON.parse(savedMealPlan || '{}'));
      }
    }
  }, [user]);

  const generateGroceryList = (mealPlan: MealPlan) => {
    if (!user) return;

    // Collect all recipes from the meal plan
    const recipes: Recipe[] = Object.values(mealPlan)
      .flatMap((day) => day.meals)
      .map((meal) => meal.recipe);

    // Parse and combine all ingredients
    const parsedIngredients = recipes
      .flatMap((recipe) => recipe.ingredients)
      .map((ing) => parseIngredient(ing));

    const combinedIngredients = combineIngredients(parsedIngredients);

    // Create a map of existing checked states
    const checkedStates = new Map(
      groceryItems.map(item => [
        `${item.item}-${item.quantity}-${item.unit}`,
        item.checked
      ])
    );

    // Format ingredients into grocery items, preserving checked states
    const items: GroceryItem[] = combinedIngredients.map((ing) => {
      const key = `${ing.item}-${ing.quantity}-${ing.unit}`;
      return {
        ingredient: `${ing.quantity} ${ing.unit} ${ing.item}${
          ing.preparation ? `, ${ing.preparation}` : ''
        }`,
        quantity: ing.quantity,
        unit: ing.unit,
        item: ing.item,
        preparation: ing.preparation,
        checked: checkedStates.get(key) || false,
      };
    });

    // Sort items: unchecked first, then checked
    const sortedItems = [...items].sort((a, b) => {
      if (a.checked === b.checked) {
        return a.item.localeCompare(b.item);
      }
      return a.checked ? 1 : -1;
    });

    setGroceryItems(sortedItems);
    localStorage.setItem(`groceryList_${user.id}`, JSON.stringify(sortedItems));
  };

  const toggleItem = (index: number) => {
    if (!user) return;

    const updatedItems = [...groceryItems];
    updatedItems[index].checked = !updatedItems[index].checked;

    // Re-sort items after toggling
    const sortedItems = [...updatedItems].sort((a, b) => {
      if (a.checked === b.checked) {
        return a.item.localeCompare(b.item);
      }
      return a.checked ? 1 : -1;
    });

    setGroceryItems(sortedItems);
    localStorage.setItem(`groceryList_${user.id}`, JSON.stringify(sortedItems));
  };

  const clearCheckedItems = () => {
    if (!user) return;

    const updatedItems = groceryItems.filter((item) => !item.checked);
    setGroceryItems(updatedItems);
    localStorage.setItem(`groceryList_${user.id}`, JSON.stringify(updatedItems));
  };

  const refreshList = () => {
    generateGroceryList(mealPlan);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Sign in to view your grocery list
        </h2>
        <p className="text-gray-600">
          Create an account or sign in to manage your grocery list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
        <div className="flex gap-2">
          <button
            onClick={refreshList}
            className="px-4 py-2 text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            Refresh from Meal Plan
          </button>
          {groceryItems.some((item) => item.checked) && (
            <button
              onClick={clearCheckedItems}
              className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              <Trash2 size={20} />
              Clear Checked Items
            </button>
          )}
        </div>
      </div>

      {groceryItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Your grocery list is empty. Add some meals to your meal plan to generate a grocery list.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {groceryItems.map((item, index) => (
            <div
              key={`${item.item}-${index}`}
              className={`flex items-start p-4 gap-4 transition-colors ${
                item.checked ? 'bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center ${
                  item.checked
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-300'
                }`}
              >
                {item.checked && <Check size={14} className="text-white" />}
              </button>
              <div className="flex-1">
                <div className={`${item.checked ? 'text-gray-500' : 'text-gray-900'}`}>
                  <span className={`text-lg font-medium ${item.checked ? 'line-through' : ''}`}>
                    {item.item}
                  </span>
                  {item.preparation && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({item.preparation})
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {item.quantity} {item.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};