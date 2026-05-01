import { describe, expect, it } from "vitest";
import { calculateBmr, calculateTargetCalories, calculateTdee } from "../src/calculators/energy.js";

describe("energy calculators", () => {
  it("calculates male BMR with Mifflin-St Jeor", () => {
    expect(calculateBmr({ sex: "male", age: 30, heightCm: 175, weightKg: 75 })).toBe(1699);
  });

  it("calculates female BMR with Mifflin-St Jeor", () => {
    expect(calculateBmr({ sex: "female", age: 28, heightCm: 165, weightKg: 60 })).toBe(1330);
  });

  it("calculates TDEE and cut target calories", () => {
    const tdee = calculateTdee(1699, "moderate");
    expect(tdee).toBe(2633);
    expect(calculateTargetCalories(tdee, "cut")).toBe(2106);
  });
});
