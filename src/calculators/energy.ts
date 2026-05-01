import type { ActivityLevel, Goal, Sex } from "../types/index.js";

export const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9
};

export const goalCalorieMultipliers: Record<Goal, number> = {
  cut: 0.8,
  bulk: 1.1,
  maintain: 1,
  glucose_control: 1
};

export interface BmrInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
}

export function calculateBmr(input: BmrInput): number {
  assertPositive("age", input.age);
  assertPositive("heightCm", input.heightCm);
  assertPositive("weightKg", input.weightKg);

  const sexOffset = input.sex === "male" ? 5 : -161;
  return round(10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + sexOffset);
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  assertPositive("bmr", bmr);
  return round(bmr * activityFactors[activityLevel]);
}

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  assertPositive("tdee", tdee);
  return round(tdee * goalCalorieMultipliers[goal]);
}

export function round(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function assertPositive(name: string, value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive number`);
  }
}
