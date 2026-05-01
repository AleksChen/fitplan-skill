import { describe, expect, it } from "vitest";
import { calculateMacros } from "../src/calculators/macros.js";

describe("macro calculators", () => {
  it("allocates cut macros from body weight and calories", () => {
    expect(calculateMacros({ targetCalories: 2106, weightKg: 75, goal: "cut" })).toEqual({
      calories: 2107,
      proteinG: 150,
      fatG: 47,
      carbsG: 271
    });
  });

  it("caps carbohydrate ratio for glucose control", () => {
    const macros = calculateMacros({ targetCalories: 2000, weightKg: 70, goal: "glucose_control" });

    expect(macros.proteinG).toBe(98);
    expect(macros.carbsG).toBe(190);
    expect(macros.fatG).toBe(94);
    expect((macros.carbsG * 4) / 2000).toBeLessThanOrEqual(0.38);
  });
});
