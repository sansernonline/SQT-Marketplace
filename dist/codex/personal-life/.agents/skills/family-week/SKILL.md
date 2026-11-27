---
name: "family-week"
description: "Use when planning the family week, a meal plan or a gift"
---

# family-week — the family week, meals, groceries and gifts

Run the `family-planner` agent with `family-week`, plus `family-care` for whatever applies to: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Output one week table (day · who · what · bring) followed by the grocery list by store section. Never add or change a medicine dose — copy only what the doctor's sheet says. The shareable table shows "ยา ตามตาราง" and a time, never drug names, ID numbers or other health details.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Plan the week: who does what, what to bring, what school and elder items are due" | This page (the week table above) |
| "Plan the meals for a budget, and make the grocery list" | [`references/meal-plan-grocery.md`](references/meal-plan-grocery.md) |
| "Someone's birthday or a holiday is coming, what gift do I get?" | [`references/gift-idea-tracker.md`](references/gift-idea-tracker.md) |

The week table template is in `references/weekly-plan-template.md`. The gift registry template is in `references/gift-registry-template.md`.

## Check before done

- Medicine doses are copied from the doctor's sheet or the label, never changed or added.
- The shareable table has no drug names, ID numbers or health details.
- Meal plans are general information, not dietary advice. For diabetes, kidney disease or allergies, follow the doctor's or dietitian's list.
- A whole family week with several steps → playbook `superuser/references/playbook-family-week.md`.
