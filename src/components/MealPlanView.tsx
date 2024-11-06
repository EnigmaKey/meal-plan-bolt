import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Recipe, MealPlan, DayPlan } from '../types';
import { Clock, Plus, X } from 'lucide-react';
import { RecipeDetail } from './RecipeDetail';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TIMES = ['breakfast', 'lunch', 'dinner'] as const;

export const MealPlanView: React.FC = () => {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealTime, setSelectedMealTime] = useState<typeof MEAL_TIMES[number]>('breakfast');

  useEffect(() => {
    if (user) {
      const savedMealPlan = localStorage.getItem(`mealPlan_${user.id}`);
      if (savedMealPlan) {
        setMealPlan(JSON.parse(savedMealPlan));
      }
      const userRecipes = JSON.parse(localStorage.getItem(`recipes_${user.id}`) || '[]');
      setRecipes(userRecipes);
    }
  }, [user]);

  const handleAddMeal = (recipe: Recipe) => {
    if (!user || !selectedDay || !selectedMealTime) return;

    const updatedPlan = { ...mealPlan };
    if (!updatedPlan[selectedDay]) {
      updatedPlan[selectedDay] = { meals: [] };
    }

    // Remove any existing meal for the same meal time
    updatedPlan[selectedDay].meals = updatedPlan[selectedDay].meals.filter(
      (meal) => meal.mealTime !== selectedMealTime
    );

    // Add the new meal
    updatedPlan[selectedDay].meals.push({
      mealTime: selectedMealTime,
      recipe,
    });

    // Sort meals by time
    updatedPlan[selectedDay].meals.sort(
      (a, b) => MEAL_TIMES.indexOf(a.mealTime) - MEAL_TIMES.indexOf(b.mealTime)
    );

    setMealPlan(updatedPlan);
    localStorage.setItem(`mealPlan_${user.id}`, JSON.stringify(updatedPlan));
    setShowAddModal(false);
  };

  const removeMeal = (day: string, mealTime: string) => {
    if (!user) return;

    const updatedPlan = { ...mealPlan };
    if (updatedPlan[day]) {
      updatedPlan[day].meals = updatedPlan[day].meals.filter(
        (meal) => meal.mealTime !== mealTime
      );
      if (updatedPlan[day].meals.length === 0) {
        delete updatedPlan[day];
      }
    }

    setMealPlan(updatedPlan);
    localStorage.setItem(`mealPlan_${user.id}`, JSON.stringify(updatedPlan));
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Sign in to plan your meals
        </h2>
        <p className="text-gray-600">
          Create an account or sign in to start planning your weekly meals.
        </p>
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Plan</h2>

      <div className="grid gap-6">
        {DAYS.map((day) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
            </div>

            <div className="grid gap-4">
              {MEAL_TIMES.map((mealTime) => {
                const meal = mealPlan[day]?.meals.find(
                  (m) => m.mealTime === mealTime
                );

                return (
                  <div
                    key={mealTime}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {mealTime}
                      </span>
                      {meal ? (
                        <div className="flex items-center justify-between mt-2">
                          <div
                            className="flex-1 cursor-pointer hover:text-emerald-600"
                            onClick={() => setSelectedRecipe(meal.recipe)}
                          >
                            <p className="font-medium text-gray-900">
                              {meal.recipe.title}
                            </p>
                            {meal.recipe.cookTime && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock size={14} className="mr-1" />
                                <span>{meal.recipe.cookTime} mins</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeMeal(day, mealTime)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDay(day);
                            setSelectedMealTime(mealTime);
                            setShowAddModal(true);
                          }}
                          className="mt-2 flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          <Plus size={16} className="mr-1" />
                          Add meal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddMealModal
          recipes={recipes}
          onSelect={handleAddMeal}
          onClose={() => setShowAddModal(false)}
          day={selectedDay}
          mealTime={selectedMealTime}
        />
      )}
    </div>
  );
};

interface AddMealModalProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onClose: () => void;
  day: string;
  mealTime: string;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  recipes,
  onSelect,
  onClose,
  day,
  mealTime,
}) => {
  const [search, setSearch] = useState('');

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Add meal for {day} - {mealTime}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <div className="grid gap-4">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div>
                <p className="font-medium text-gray-900">{recipe.title}</p>
                {recipe.cookTime && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>{recipe.cookTime} mins</span>
                  </div>
                )}
              </div>
            </button>
          ))}

          {filteredRecipes.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No recipes found. Try a different search term or add a new recipe.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};