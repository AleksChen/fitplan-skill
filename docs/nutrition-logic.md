# Nutrition Logic

FitPlan Skill uses deterministic calculations so generated plans are explainable and testable.

## BMR

Mifflin-St Jeor:

- Male: `10 * weightKg + 6.25 * heightCm - 5 * age + 5`
- Female: `10 * weightKg + 6.25 * heightCm - 5 * age - 161`

## TDEE

`TDEE = BMR * activityFactor`

| Level | Factor |
| --- | ---: |
| sedentary | 1.2 |
| light | 1.375 |
| moderate | 1.55 |
| high | 1.725 |
| athlete | 1.9 |

## Goal Calories

| Goal | Multiplier |
| --- | ---: |
| cut | 0.8 |
| bulk | 1.1 |
| maintain | 1.0 |
| glucose_control | 1.0 |

## Macro Defaults

| Goal | Protein | Fat |
| --- | ---: | ---: |
| cut | 2.0 g/kg | 20% calories |
| bulk | 1.8 g/kg | 25% calories |
| maintain | 1.5 g/kg | 25% calories |
| glucose_control | 1.4 g/kg | 32% calories, carb calories capped around 38% |

These values are conservative defaults for general fitness planning. They should be adjusted for clinical or sport-specific contexts.
