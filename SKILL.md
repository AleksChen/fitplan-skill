---
name: fitplan-skill
description: Generate nutrition plans from user profile data, including BMR/TDEE, macro targets, meal suggestions, and a local single-file HTML dashboard. Use when a user asks for diet planning, fitness meal plans, macro calculation, calorie targets, cutting, bulking, maintaining weight, or glucose-conscious eating.
---

# FitPlan Skill

Use this skill to create practical nutrition plans from structured or conversational user inputs. The instructions are platform-neutral and can be used by any AI assistant or agent runtime that supports skill-style Markdown instructions.

## Workflow

1. Collect the minimum profile:
   - sex
   - age
   - height in cm
   - weight in kg
   - activity level
   - goal
   - dietary exclusions or preferences, if any
2. Convert fuzzy answers into structured fields. If a value is missing and materially changes the result, ask one short follow-up question.
3. Calculate:
   - BMR with Mifflin-St Jeor
   - TDEE with PAL activity factor
   - target calories from the selected goal
   - protein, fat, and carbohydrate targets
4. Generate a plan from known foods, keeping cooked/raw basis clear.
5. Include a health boundary note for diabetes, kidney disease, pregnancy, eating disorders, adolescents, older adults, or any clinical condition.
6. When useful, render a FitPage HTML dashboard with `renderFitPageHtml`.

## Activity Levels

- `sedentary`: desk work, little exercise
- `light`: 1-3 training sessions per week
- `moderate`: 3-5 sessions per week
- `high`: 6-7 sessions per week or physical work
- `athlete`: twice-daily training or endurance volume

## Goals

- `cut`: about 20% calorie deficit, high protein
- `bulk`: about 10% calorie surplus, high protein
- `maintain`: calorie maintenance
- `glucose_control`: maintenance calories with lower carbohydrate ratio and low-GI food priority

## Output Style

Show numbers with sensible rounding. Explain that food weights in the bundled database use the `basis` field, such as raw, cooked, or packaged.

Avoid overclaiming precision. A generated plan is a starting point, not a medical prescription.
