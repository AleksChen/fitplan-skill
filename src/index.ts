import foodsZh from "../assets/foods_zh.json" with { type: "json" };
import { calculateBmr, calculateTargetCalories, calculateTdee } from "./calculators/energy.js";
import { calculateMacros } from "./calculators/macros.js";
import { generateMeals } from "./planner/mealPlanner.js";
import { renderFitPageHtml } from "./render/html.js";
import type { CreateFitPlanInput, FitPlan, Food } from "./types/index.js";

export * from "./calculators/energy.js";
export * from "./calculators/macros.js";
export * from "./planner/mealPlanner.js";
export * from "./render/html.js";
export * from "./types/index.js";

export const defaultFoods = foodsZh as Food[];

export function createFitPlan(input: CreateFitPlanInput): FitPlan {
  const bmr = calculateBmr(input.profile);
  const tdee = calculateTdee(bmr, input.profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, input.profile.goal);
  const macros = calculateMacros({
    targetCalories,
    weightKg: input.profile.weightKg,
    goal: input.profile.goal
  });
  const meals = generateMeals(input.foods ?? defaultFoods, macros);

  return {
    profile: input.profile,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    energy: { bmr, tdee, targetCalories },
    macros,
    meals,
    notes: [
      "食物重量以 basis 字段为准：raw 为生重，cooked 为熟重，packaged 为包装标示。",
      "实际摄入会受品牌、烹饪方式和称量误差影响，建议连续记录 1-2 周后微调。",
      "控糖、肾病、孕期、饮食障碍、未成年人或其他临床情况，请先咨询专业医生或注册营养师。"
    ]
  };
}

export function createFitPageHtml(input: CreateFitPlanInput): string {
  return renderFitPageHtml(createFitPlan(input));
}
