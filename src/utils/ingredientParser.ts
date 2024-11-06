interface ParsedIngredient {
    quantity: string;
    unit: string;
    item: string;
    preparation?: string;
  }
  
  export function parseIngredient(ingredient: string): ParsedIngredient {
    // Common units of measurement
    const units = [
      'cup', 'cups',
      'tbsp', 'tablespoon', 'tablespoons',
      'tsp', 'teaspoon', 'teaspoons',
      'oz', 'ounce', 'ounces',
      'lb', 'pound', 'pounds',
      'g', 'gram', 'grams',
      'ml', 'milliliter', 'milliliters',
      'l', 'liter', 'liters',
      'pinch', 'pinches',
      'dash', 'dashes',
      'piece', 'pieces',
      'slice', 'slices',
      'can', 'cans',
      'package', 'packages',
      'bunch', 'bunches'
    ];
  
    // Regular expressions for matching
    const quantityRegex = /^(\d+(?:\/\d+)?|\d*\.\d+|\d+)\s*/;
    const unitRegex = new RegExp(`^(${units.join('|')})\\b`, 'i');
    const prepRegex = /,\s*([\w\s]+)$/;
  
    let remaining = ingredient.trim();
    const result: ParsedIngredient = {
      quantity: '',
      unit: '',
      item: '',
    };
  
    // Extract quantity
    const quantityMatch = remaining.match(quantityRegex);
    if (quantityMatch) {
      result.quantity = quantityMatch[1];
      remaining = remaining.slice(quantityMatch[0].length).trim();
    }
  
    // Extract unit
    const unitMatch = remaining.match(unitRegex);
    if (unitMatch) {
      result.unit = unitMatch[1].toLowerCase();
      remaining = remaining.slice(unitMatch[0].length).trim();
    }
  
    // Extract preparation instructions
    const prepMatch = remaining.match(prepRegex);
    if (prepMatch) {
      result.preparation = prepMatch[1].trim();
      remaining = remaining.slice(0, -prepMatch[0].length).trim();
    }
  
    // What's left is the item
    result.item = remaining.trim();
  
    // Handle cases where no unit is provided
    if (!result.unit && result.quantity && !isNaN(Number(result.quantity))) {
      result.unit = 'piece';
      if (Number(result.quantity) > 1) {
        result.unit = 'pieces';
      }
    }
  
    return result;
  }
  
  // Helper function to convert fractions and decimals to numbers
  function parseQuantity(quantity: string): number {
    if (quantity.includes('/')) {
      const [numerator, denominator] = quantity.split('/').map(Number);
      return numerator / denominator;
    }
    return Number(quantity);
  }
  
  // Helper function to standardize units
  function standardizeUnit(unit: string): string {
    const unitMappings: { [key: string]: string } = {
      'tablespoon': 'tbsp',
      'tablespoons': 'tbsp',
      'teaspoon': 'tsp',
      'teaspoons': 'tsp',
      'ounce': 'oz',
      'ounces': 'oz',
      'pound': 'lb',
      'pounds': 'lb',
      'gram': 'g',
      'grams': 'g',
      'milliliter': 'ml',
      'milliliters': 'ml',
      'liter': 'l',
      'liters': 'l',
    };
  
    return unitMappings[unit.toLowerCase()] || unit.toLowerCase();
  }
  
  export function combineIngredients(ingredients: ParsedIngredient[]): ParsedIngredient[] {
    const combined = new Map<string, ParsedIngredient>();
  
    for (const ing of ingredients) {
      const standardUnit = standardizeUnit(ing.unit);
      const key = `${ing.item.toLowerCase()}-${standardUnit}`;
  
      if (combined.has(key)) {
        const existing = combined.get(key)!;
        const totalQuantity = parseQuantity(existing.quantity) + parseQuantity(ing.quantity);
        
        combined.set(key, {
          ...existing,
          quantity: totalQuantity.toString(),
          preparation: ing.preparation 
            ? existing.preparation 
              ? `${existing.preparation}; ${ing.preparation}`
              : ing.preparation
            : existing.preparation
        });
      } else {
        combined.set(key, {
          ...ing,
          unit: standardUnit
        });
      }
    }
  
    return Array.from(combined.values()).sort((a, b) => a.item.localeCompare(b.item));
  }