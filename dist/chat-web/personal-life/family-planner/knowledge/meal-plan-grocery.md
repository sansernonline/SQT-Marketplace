# skill: meal-plan-grocery

Use when a Thai family wants a weekly meal plan on a budget, a grocery list or less food waste.

# Meal Plan and Grocery List

Plan once on the weekend, shop once, cook twice. The plan is a budget tool as much as a menu.

General information, not dietary advice — for diabetes, kidney disease or allergies, follow the doctor's or dietitian's list.

## Inputs to ask for (once)

| Input | Example |
|---|---|
| People and ages | 2 adults, 1 child 8, 1 grandparent 74 |
| Meals at home | breakfast + dinner daily; weekend lunch |
| Weekly food budget | 2,500 บาท |
| Where they shop | ตลาดสด Sunday + Lotus's/Big C/Makro/Tops |
| Restrictions | grandparent low-salt, soft food; child no spicy |
| Cooking time | 30 min weekdays, 2 h Sunday |
| Kit | rice cooker, one wok, small oven/air fryer, fridge freezer size |

## Workflow

1. **Budget per head per day** = weekly budget ÷ 7 ÷ people. Compare with what the household actually spent last month (`trading-finance` `personal-budget` (if installed))
2. **Pick 4 proteins** for the week (e.g. chicken, pork mince, eggs, fish) and **2 cheap fillers** (tofu, beans/ถั่ว, eggs) — rotating proteins is what keeps cost down. More candidates than the budget allows → choose by numbers, see "Choose items inside the budget" below
3. **Fill the week grid** — [references/weekly-plan-template.md](references/weekly-plan-template.md); one "cook once, eat twice" pair per 2–3 days
4. **Write the grocery list by section** (below) from the grid; check fridge and pantry first and cross off what is there
5. **Batch on Sunday:** rice/grains portions, one braise or curry paste base, washed and cut vegetables (keep 3–4 days), marinated protein portions frozen flat
6. **Leftover night** — Thursday or Friday dinner is "fridge clear-out" (ข้าวผัด, ต้มจับฉ่าย, ไข่เจียวใส่ผัก)
7. **Review** — cross off what was wasted; next week buy less of it

## Grocery list sections

Group items in walking order so one pass covers the store:

| Section | Fresh market (ตลาดสด) | Supermarket |
|---|---|---|
| 1 ผัก / ผลไม้ | ร้านผัก — buy for 3–4 days, then top up mid-week | Produce |
| 2 เนื้อสัตว์ / อาหารทะเล | เขียง — ask for mince/slicing on the spot | Meat counter / chilled |
| 3 ไข่ เต้าหู้ | | Chilled |
| 4 ของแห้ง เครื่องปรุง | ร้านของชำ | Dry goods: rice, noodles, น้ำปลา, ซีอิ๊ว, oil |
| 5 นม / เครื่องดื่ม | | Dairy |
| 6 แช่แข็ง | | Frozen — last, to keep cold |
| 7 ของใช้ในบ้าน | | Household — separate budget line |

Rules: buy rice, oil and sauces monthly in bulk (Makro or promotion weeks); buy vegetables twice a week; check unit price (ราคาต่อกรัม on the shelf label), not pack price.

## Choose items inside the budget (`decision-scoring`, command `knapsack`)

1. **Iron rules first (กฎเหล็ก):** anything on the allergy or doctor's avoid list is removed before the run; anything the grandparent's diet needs goes in with `"must": true`.
2. **Budget** = the protein part of the weekly food budget, in baht (the user sets it; starting value, not yet measured until a month of receipts). **Cost** = shelf price in baht. **Value** = grams of protein in the pack (from the label), or meals served if the user prefers to count meals; one unit per run, never mixed.
3. **Run:** `node decide.mjs knapsack grocery.json`. It tries every set up to 20 items and returns the true best, not just the cheapest per gram.
4. Example input (illustrative prices and grams, budget 400 baht; check the labels):

```json
{"budget":400,"items":[{"name":"chicken breast 1 kg","cost":110,"value":230},{"name":"eggs 30","cost":105,"value":180},{"name":"minced pork 500 g","cost":85,"value":90},{"name":"tofu 10 blocks","cost":60,"value":100},{"name":"mackerel 1 kg","cost":120,"value":200,"must":true}]}
```

Result when run: chicken, eggs, tofu and mackerel (395 of 400 baht, 710 g protein); pork mince is left out. Two sets within a few grams of each other → the family picks by taste. Protein grams are not a diet plan; for a medical diet follow the doctor's list.

## Food safety in Thai heat

- Cooked food out of the fridge: within 2 hours, 1 hour if the kitchen is above ~32 °C
- Cool a big pot fast — split into shallow boxes before refrigerating
- Fridge 0–4 °C, freezer −18 °C; label boxes with the date; cooked leftovers 3–4 days
- Reheat soups and curries until boiling; do not reheat rice more than once

## Worked example

4 people (2 adults, child 8, grandparent 74), 2,500 บาท/week → 2,500 ÷ 7 ÷ 4 = **≈ 89 บาท/คน/วัน** for breakfast + dinner, plus weekend lunch.

| Day | Breakfast | Dinner |
|---|---|---|
| Sun | ข้าวต้มหมูสับ | ต้มจืดเต้าหู้หมูสับ + ไก่ทอดสมุนไพร (**batch: cook 2× ไก่**) |
| Mon | ไข่ต้ม ขนมปัง นม | ไก่ (leftover) ผัดกะเพรา — child version not spicy + ผัดผักรวม |
| Tue | โจ๊กไก่ (from Sunday stock) | แกงจืดตำลึง + ปลาทูทอด |
| Wed | ข้าวไข่เจียว | พะโล้ไข่หมู (**batch: double**) |
| Thu | ข้าวต้ม + พะโล้ (leftover) | **fridge clear-out:** ข้าวผัด + ต้มจับฉ่าย |
| Fri | ขนมปัง ไข่ดาว นม | ปลานึ่งมะนาว (grandparent: less chilli and salt) + ผักลวก |
| Sat | ข้าวเหนียวหมูปิ้ง (bought) | ต้มยำน้ำใส + ผัดผักบุ้ง |

Grandparent soft/low-salt: steam or boil, season at the table, not in the pot. Shop: ตลาดสด Sunday (vegetables, chicken, pork, fish), supermarket for dairy/dry goods, top-up vegetables Wednesday.

## Related

`kids-school` (lunch boxes, school milk) · `elder-care` (diet notes from the doctor) · `household-bills` (gas cylinder and electricity) · `trading-finance` `personal-budget` (if installed)


## reference: weekly-plan-template.md

# Weekly meal plan — template

Week of: ________ · Budget: ________ บาท · People: ____ · Budget/คน/วัน: ____

| วัน | เช้า | กลางวัน | เย็น | ทำเผื่อ (batch) / ของเหลือ | คนที่ต้องทำเมนูแยก |
|---|---|---|---|---|---|
| อาทิตย์ | | | | | |
| จันทร์ | | | | | |
| อังคาร | | | | | |
| พุธ | | | | | |
| พฤหัสบดี | | | | เคลียร์ตู้เย็น | |
| ศุกร์ | | | | | |
| เสาร์ | | | | | |

## Grocery list

| หมวด | รายการ | จำนวน | ราคาประมาณ | ซื้อที่ | ✔ |
|---|---|---|---|---|---|
| ผัก / ผลไม้ | | | | | ☐ |
| เนื้อสัตว์ / อาหารทะเล | | | | | ☐ |
| ไข่ เต้าหู้ | | | | | ☐ |
| ของแห้ง เครื่องปรุง | | | | | ☐ |
| นม / เครื่องดื่ม | | | | | ☐ |
| แช่แข็ง | | | | | ☐ |
| **รวม** | | | | | |

## Sunday batch list

- [ ] Rice / grains portioned
- [ ] Stock (น้ำซุป) — chicken bones or pork bones, frozen in 500 ml boxes
- [ ] Vegetables washed, dried, cut (3–4 days)
- [ ] Protein marinated and frozen flat in labelled bags (date + dish)
- [ ] One double-batch dish for Monday/Thursday

## Waste log (5 minutes, end of week)

| ทิ้งอะไร | ปริมาณ | ทำไม | สัปดาห์หน้าเปลี่ยนอะไร |
|---|---|---|---|
| | | | |
