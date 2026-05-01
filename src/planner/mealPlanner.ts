import type { Food, MacroTargets, Meal, MealFood, MealSlot } from "../types/index.js";
import { round } from "../calculators/energy.js";

const mealDistribution: Record<MealSlot, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack: 0.1
};

const mealTitles: Record<MealSlot, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "加餐"
};

export function generateMeals(foods: Food[], macros: MacroTargets): Meal[] {
  const proteinFoods = foods.filter((food) => food.category === "protein" || food.category === "dairy");
  const carbFoods = foods.filter((food) => food.category === "carb" || food.category === "fruit");
  const fatFoods = foods.filter((food) => food.category === "fat");
  const vegetableFoods = foods.filter((food) => food.category === "vegetable");

  if (!proteinFoods.length || !carbFoods.length || !fatFoods.length || !vegetableFoods.length) {
    throw new Error("foods must include protein, carb, fat, and vegetable categories");
  }

  return (Object.keys(mealDistribution) as MealSlot[]).map((slot, index) => {
    const ratio = mealDistribution[slot];
    const targets = scaleMacros(macros, ratio);
    const foodsForMeal: MealFood[] = [];

    foodsForMeal.push(portionForMacro(pick(proteinFoods, index), "proteinG", targets.proteinG * 0.9));
    foodsForMeal.push(portionForMacro(pick(carbFoods, index), "carbsG", targets.carbsG * 0.9));
    foodsForMeal.push(portionForMacro(pick(fatFoods, index), "fatG", targets.fatG * 0.8));

    if (slot !== "snack") {
      foodsForMeal.push(portionByGrams(pick(vegetableFoods, index), slot === "lunch" ? 200 : 150));
    }

    return {
      slot,
      title: mealTitles[slot],
      foods: foodsForMeal,
      totals: sumMealFoods(foodsForMeal)
    };
  });
}

function scaleMacros(macros: MacroTargets, ratio: number): MacroTargets {
  return {
    calories: round(macros.calories * ratio),
    proteinG: round(macros.proteinG * ratio),
    fatG: round(macros.fatG * ratio),
    carbsG: round(macros.carbsG * ratio)
  };
}

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function portionForMacro(food: Food, macro: "proteinG" | "fatG" | "carbsG", targetG: number): MealFood {
  const valuePer100g = {
    proteinG: food.proteinPer100g,
    fatG: food.fatPer100g,
    carbsG: food.carbsPer100g
  }[macro];

  if (valuePer100g <= 0) {
    return portionByGrams(food, 100);
  }

  const grams = clamp(round((targetG / valuePer100g) * 100), 30, 350);
  return portionByGrams(food, grams);
}

function portionByGrams(food: Food, grams: number): MealFood {
  const ratio = grams / 100;
  return {
    foodId: food.id,
    nameZh: food.nameZh,
    grams,
    basis: food.basis,
    calories: round(food.caloriesPer100g * ratio),
    proteinG: round(food.proteinPer100g * ratio, 1),
    fatG: round(food.fatPer100g * ratio, 1),
    carbsG: round(food.carbsPer100g * ratio, 1)
  };
}

function sumMealFoods(foods: MealFood[]): MacroTargets {
  return foods.reduce(
    (totals, food) => ({
      calories: round(totals.calories + food.calories),
      proteinG: round(totals.proteinG + food.proteinG, 1),
      fatG: round(totals.fatG + food.fatG, 1),
      carbsG: round(totals.carbsG + food.carbsG, 1)
    }),
    { calories: 0, proteinG: 0, fatG: 0, carbsG: 0 }
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
