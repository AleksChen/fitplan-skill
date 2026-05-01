# FitPlan Skill

**Languages:** English | [中文](README.zh-CN.md) | [Español](README.es.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [العربية](README.ar.md)

FitPlan Skill is a platform-neutral AI skill and TypeScript toolkit for turning a user profile into explainable calorie targets, macro targets, meal suggestions, and a local HTML nutrition dashboard.

It can be used in two ways: as an AI assistant skill through `SKILL.md`, or as a TypeScript library inside a web app, CLI, bot, agent, or backend service.

![FitPlan Skill dashboard preview](docs/images/dashboard-preview.png)

_Dashboard preview generated with gpt-image-2 for README illustration._

> FitPlan Skill is an MVP for general fitness and nutrition planning. It does not provide medical diagnosis, treatment, or prescription advice.

## Features

- Calculates BMR with the Mifflin-St Jeor equation.
- Estimates TDEE with PAL activity factors.
- Supports four goals: `cut`, `bulk`, `maintain`, and `glucose_control`.
- Allocates protein, fat, and carbohydrate targets automatically.
- Generates a starter meal plan from a bundled Chinese food database.
- Keeps food weight basis explicit: raw, cooked, or packaged-label weight.
- Returns structured JSON for downstream apps and agents.
- Renders an offline, single-file local HTML dashboard.

## Architecture

FitPlan Skill is split into three reusable layers:

| Layer | Files | Purpose |
| --- | --- | --- |
| Skill instructions | `SKILL.md` | Guides an AI assistant through intake, calculation, meal planning, and output. |
| Calculation engine | `src/` | TypeScript functions for BMR, TDEE, macros, and meal generation. |
| Presentation layer | `templates/` / `src/render/` | Produces a browser-ready local HTML dashboard. |

Common integration modes:

- **AI Skill:** install or copy the repository into a skill-enabled assistant runtime.
- **TypeScript library:** call `createFitPlan` from Node.js, a web build, an agent runtime, or a backend service.
- **Local HTML generator:** call `createFitPageHtml` to get a complete standalone HTML string.
- **Data package:** reuse and extend `assets/foods_zh.json` as a starter food database.

## Project Structure

```text
fitplan-skill/
├── SKILL.md                 # Platform-neutral AI skill instructions
├── README.md                # Project overview and usage
├── assets/
│   └── foods_zh.json        # Chinese food database
├── docs/
│   └── nutrition-logic.md   # Formula and default-parameter notes
├── src/
│   ├── calculators/         # BMR, TDEE, and macro calculations
│   ├── planner/             # Meal generation
│   ├── render/              # HTML rendering
│   ├── types/               # TypeScript types
│   └── index.ts             # Public API entry
├── scripts/
│   ├── clean.mjs            # Removes build output
│   └── copy-assets.mjs      # Copies runtime assets into dist
├── templates/
│   └── modern-v1.html       # Single-file HTML template
└── tests/                   # Unit tests
```

## Installation and Development

```bash
npm install
npm test
npm run build
```

You can also use pnpm:

```bash
pnpm install
pnpm test
pnpm run build
```

## Use as an AI Skill

Place this repository in the target runtime's Skills directory and let the assistant read `SKILL.md`. A user can ask in plain language, for example:

```text
Create a cutting meal plan for me. I am male, 30 years old, 175 cm, 75 kg, train 4 times a week, and do not eat beef.
```

The skill guides the assistant to:

1. Collect or normalize height, weight, age, sex, activity level, goal, and dietary preferences.
2. Calculate BMR, TDEE, target calories, and macro targets.
3. Generate a structured meal plan.
4. Render a local HTML dashboard when useful.
5. Add clear safety boundaries for diabetes, kidney disease, pregnancy, eating disorders, adolescents, older adults, and other clinical contexts.

## Use as a TypeScript Library

```ts
import { createFitPlan, createFitPageHtml } from "fitplan-skill";

const input = {
  profile: {
    sex: "male",
    age: 30,
    heightCm: 175,
    weightKg: 75,
    activityLevel: "moderate",
    goal: "cut"
  }
} as const;

const plan = createFitPlan(input);
const html = createFitPageHtml(input);

console.log(plan.macros);
console.log(html);
```

Example output excerpt:

```json
{
  "energy": {
    "bmr": 1699,
    "tdee": 2633,
    "targetCalories": 2106
  },
  "macros": {
    "calories": 2107,
    "proteinG": 150,
    "fatG": 47,
    "carbsG": 271
  },
  "meals": [
    {
      "slot": "breakfast",
      "title": "早餐",
      "totals": {
        "calories": 788,
        "proteinG": 43.9,
        "fatG": 35.7,
        "carbsG": 71.9
      }
    }
  ]
}
```

`createFitPageHtml` returns a complete HTML document with embedded styles and data. It does not depend on a CDN.

## Input Shape

```ts
type UserProfile = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "high" | "athlete";
  goal: "cut" | "bulk" | "maintain" | "glucose_control";
};
```

Activity levels:

- `sedentary`: desk work and little exercise
- `light`: 1-3 training sessions per week
- `moderate`: 3-5 training sessions per week
- `high`: 6-7 sessions per week or physical work
- `athlete`: high training volume or near twice-daily training

Goals:

- `cut`: fat loss with about a 20% calorie deficit
- `bulk`: muscle gain with about a 10% calorie surplus
- `maintain`: weight maintenance
- `glucose_control`: glucose-conscious planning at maintenance calories with a lower carbohydrate ratio

## Output

`createFitPlan` returns:

- `profile`: normalized user profile
- `energy.bmr`: basal metabolic rate
- `energy.tdee`: total daily energy expenditure
- `energy.targetCalories`: goal-adjusted calorie target
- `macros`: protein, fat, and carbohydrate grams
- `meals`: breakfast, lunch, dinner, and snack
- `notes`: weight-basis, accuracy, and health-boundary notes

## Food Database

The bundled food database lives at `assets/foods_zh.json`. Add new foods with the same schema:

```json
{
  "id": "chicken_breast_raw",
  "nameZh": "鸡胸肉",
  "category": "protein",
  "basis": "raw",
  "servingUnit": "g",
  "caloriesPer100g": 120,
  "proteinPer100g": 23,
  "fatPer100g": 2,
  "carbsPer100g": 0
}
```

The `basis` field matters:

- `raw`: raw weight
- `cooked`: cooked weight
- `packaged`: nutrition-label weight

## Nutrition Logic

Detailed formulas are documented in [docs/nutrition-logic.md](docs/nutrition-logic.md).

Default strategy:

- Cut: `TDEE * 0.8`, protein around `2.0g/kg`
- Bulk: `TDEE * 1.1`, protein around `1.8g/kg`
- Maintain: `TDEE * 1.0`, protein around `1.5g/kg`
- Glucose control: `TDEE * 1.0`, carbohydrate calories capped around 38%

## Health Boundaries

FitPlan Skill does not diagnose, treat, or manage disease. People in the following situations should consult a physician or registered dietitian before changing their diet:

- Diabetes or glucose-lowering medication
- Kidney, liver, or cardiovascular disease
- Pregnancy or lactation
- Eating disorders or related history
- Adolescence or older adulthood
- Recent surgery or recovery from major illness

## License

MIT
