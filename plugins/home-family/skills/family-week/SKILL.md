---
name: family-week
description: Plan the coming family week — meals and grocery list, school items, elder appointments and medication, pet care — as one shareable table.
argument-hint: <household size and budget> [school, elder, pet notes]
disable-model-invocation: true
---

Run the `family-planner` agent with `meal-plan-grocery`, plus `kids-school`, `elder-care` and `pet-care` for whatever applies to: **$ARGUMENTS**

Output one week table (day · who · what · bring) followed by the grocery list by store section. Never add or change a medicine dose — copy only what the doctor's sheet says.
