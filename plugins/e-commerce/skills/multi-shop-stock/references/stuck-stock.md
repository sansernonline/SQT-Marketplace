# Stuck stock (สินค้าค้างสต็อก)

Open at the monthly count when the script reports slow, dead, or overstock SKUs.

Reorder rules only see what runs out; the money lost quietly sits in what never sells.

| Status | Test | What the script does |
|---|---|---|
| Slow mover (เคลื่อนไหวช้า) | no sale for 28 days | no days-of-cover figure, never reorders |
| Dead stock (สต็อกตาย) | no sale for 90 days | same, flagged louder |
| Overstock (ล้นสต็อก) | more than 120 days of sales on hand | counts only the units beyond 120 days |

These lines are starting values, not measured on Thai shops (source in `references/sources.md`).
1. Put **one line in baht at the top of the report**: money tied in stuck stock = units × cost per unit. The script prints it first (`เงินจมในสต็อกค้าง`).
2. For each stuck SKU give the owner 3 choices with the numbers that decide them (units left · sales per day · gross profit per unit, `marketplace-fees-pricing`): **Keep** (stock is small, or a campaign sold it last year) · **Discount or bundle** (price still above cost after campaign fees; bundle with a fast seller) · **Delist** (no sale in 90 days and a discount would sell below cost; clear through a sale lot or return to the supplier if terms allow).
3. Never reorder a slow or dead SKU, even below the reorder point. The owner decides, the sheet does not.

