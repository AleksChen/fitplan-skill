export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "high"
  | "athlete";

export type Goal = "cut" | "bulk" | "maintain" | "glucose_control";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface UserProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface Food {
  id: string;
  nameZh: string;
  category:
    | "protein"
    | "carb"
    | "fat"
    | "vegetable"
    | "fruit"
    | "dairy"
    | "mixed";
  basis: "raw" | "cooked" | "packaged";
  servingUnit: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  fiberPer100g?: number;
  glycemicLoadHint?: "low" | "medium" | "high";
  tags?: string[];
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface EnergyResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
}

export interface MealFood {
  foodId: string;
  nameZh: string;
  grams: number;
  basis: Food["basis"];
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface Meal {
  slot: MealSlot;
  title: string;
  foods: MealFood[];
  totals: MacroTargets;
}

export interface FitPlan {
  profile: UserProfile;
  generatedAt: string;
  energy: EnergyResult;
  macros: MacroTargets;
  meals: Meal[];
  notes: string[];
}

export interface CreateFitPlanInput {
  profile: UserProfile;
  foods?: Food[];
  generatedAt?: string;
}
