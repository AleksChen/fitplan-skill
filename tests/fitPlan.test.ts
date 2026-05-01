import { describe, expect, it } from "vitest";
import { createFitPageHtml, createFitPlan } from "../src/index.js";

describe("fit plan", () => {
  const profile = {
    sex: "male" as const,
    age: 30,
    heightCm: 175,
    weightKg: 75,
    activityLevel: "moderate" as const,
    goal: "cut" as const
  };

  it("creates a complete plan", () => {
    const plan = createFitPlan({ profile, generatedAt: "2026-04-29T00:00:00.000Z" });

    expect(plan.energy.bmr).toBe(1699);
    expect(plan.macros.proteinG).toBe(150);
    expect(plan.meals).toHaveLength(4);
    expect(plan.notes.length).toBeGreaterThan(0);
  });

  it("renders a single-file html dashboard", () => {
    const html = createFitPageHtml({ profile, generatedAt: "2026-04-29T00:00:00.000Z" });

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("FitPlan");
    expect(html).toContain('"targetCalories":2106');
    expect(html).toContain("<style>");
    expect(html).not.toContain("cdn.tailwindcss.com");
    expect(html).not.toContain(".innerHTML");
    expect(html).not.toContain("innerHTML =");
    expect(html).not.toContain("__FITPLAN_DATA__");
  });

  it("escapes script-closing sequences in injected data", () => {
    const html = createFitPageHtml({
      profile,
      foods: [
        {
          id: "unsafe_protein",
          nameZh: "</SCRIPT><script>alert(1)</script>",
          category: "protein",
          basis: "raw",
          servingUnit: "g",
          caloriesPer100g: 100,
          proteinPer100g: 20,
          fatPer100g: 2,
          carbsPer100g: 0
        },
        {
          id: "rice",
          nameZh: "米饭",
          category: "carb",
          basis: "cooked",
          servingUnit: "g",
          caloriesPer100g: 116,
          proteinPer100g: 2.6,
          fatPer100g: 0.3,
          carbsPer100g: 25.9
        },
        {
          id: "oil",
          nameZh: "橄榄油",
          category: "fat",
          basis: "packaged",
          servingUnit: "g",
          caloriesPer100g: 884,
          proteinPer100g: 0,
          fatPer100g: 100,
          carbsPer100g: 0
        },
        {
          id: "veg",
          nameZh: "西兰花",
          category: "vegetable",
          basis: "cooked",
          servingUnit: "g",
          caloriesPer100g: 35,
          proteinPer100g: 2.4,
          fatPer100g: 0.4,
          carbsPer100g: 7.2
        }
      ]
    });

    expect(html).toContain("<\\/script><script>alert(1)<\\/script>");
    expect(html).not.toContain("</SCRIPT><script>alert(1)</script>");
  });
});
