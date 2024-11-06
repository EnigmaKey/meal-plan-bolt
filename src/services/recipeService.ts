import { Recipe } from "../types";

const API_KEY = "e03a4bb5e9aa43d3a4e36729d23d72a6";
const BASE_URL = "https://api.spoonacular.com/recipes";

export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(
        query
      )}&number=12&addRecipeInformation=true&fillIngredients=true`
    );
    const data = await response.json();

    return data.results.map((recipe: Recipe) => ({
      id: recipe.id.toString(),
      title: recipe.title,
      ingredients: recipe.extendedIngredients?.map(
        (ing: { original: string }) => ing.original
      ),
      instructions: recipe.instructions || "No instructions available.",
      source: "api",
      cookTime: recipe.readyInMinutes?.toString(),
      servings: recipe.servings?.toString(),
      image: recipe.image,
    }));
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw new Error("Failed to search recipes");
  }
}
