export interface Recipe {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string;
    source: 'manual' | 'api';
    cookTime?: string;
    servings?: string;
    image?: string;
  }
  
  export interface Meal {
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    recipe: Recipe;
  }
  
  export interface DayPlan {
    meals: Meal[];
  }
  
  export interface MealPlan {
    [key: string]: DayPlan;
  }
  
  export interface GroceryItem {
    quantity: string;
    unit: string;
    category?: string;
  }
  
  export interface GroceryList {
    [ingredient: string]: GroceryItem;
  }