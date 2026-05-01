import type { Goal, MacroTargets } from "../types/index.js";
import { round } from "./energy.js";

export interface MacroInput {
  targetCalories: number;
  weightKg: number;
  goal: Goal;
}

const proteinPerKg: Record<Goal, number> = {
  cut: 2,
  bulk: 1.8,
  maintain: 1.5,
  glucose_control: 1.4
};

const fatCalorieRatio: Record<Goal, number> = {
  cut: 0.2,
  bulk: 0.25,
  maintain: 0.25,
  glucose_control: 0.32
};

const maxCarbCalorieRatio: Partial<Record<Goal, number>> = {
  glucose_control: 0.38
};

export function calculateMacros(input: MacroInput): MacroTargets {
  if (!Number.isFinite(input.targetCalories) || input.targetCalories <= 0) {
    throw new RangeError("targetCalories must be a positive number");
  }
  if (!Number.isFinite(input.weightKg) || input.weightKg <= 0) {
    throw new RangeError("weightKg must be a positive number");
  }

  const proteinG = round(input.weightKg * proteinPerKg[input.goal]);
  let fatG = round((input.targetCalories * fatCalorieRatio[input.goal]) / 9);
  let carbsG = round((input.targetCalories - proteinG * 4 - fatG * 9) / 4);

  const carbRatioLimit = maxCarbCalorieRatio[input.goal];
  if (carbRatioLimit && carbsG * 4 > input.targetCalories * carbRatioLimit) {
    carbsG = round((input.targetCalories * carbRatioLimit) / 4);
    fatG = round((input.targetCalories - proteinG * 4 - carbsG * 4) / 9);
  }

  return {
    calories: round(proteinG * 4 + fatG * 9 + carbsG * 4),
    proteinG,
    fatG,
    carbsG
  };
}
