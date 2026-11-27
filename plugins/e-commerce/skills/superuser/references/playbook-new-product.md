# playbook · new-product — list a new product with the full set

Use when: a new product will be listed on 1 or more platforms
Main principles: [`shop-principles`](../../shop-principles/SKILL.md) · [`selling.md`](../../shop-principles/references/selling.md) · [`shop-money.md`](../../shop-principles/references/shop-money.md)
Main skills: `sales-copy` · `pricing-and-costs` · `shop-operations`

## ขั้นตอน · Steps (copy into the todo exactly)

1. Open `selling.md` and `shop-money.md` first. Then collect the data — product, cost per unit, platforms, shop type, category, parcel weight and size, stock on hand, and the SKU this product already has on any other shop. Mark any missing item `(รอยืนยัน)` (awaiting confirmation) · ใคร: หัวหน้าทีม
2. Work out the real shipping cost from the parcel size per `pricing-and-costs` (`references/shipping-compare.md`, volumetric weight) · ใคร: `shop-manager` ตัวใหม่
3. Set the price per platform with the formula in `pricing-and-costs`, as a table, and tell the user to check the rates against Seller Centre · ใคร: `shop-manager` ตัวใหม่
4. Write the product name, search keywords, description, and image checklist per platform, following `sales-copy` · ใคร: `shop-manager` ตัวใหม่
5. Set the SKU and enter it in the master stock file per `shop-operations` (`references/multi-shop-stock.md`), with a reorder point. If the product already sells on another shop, reuse that SKU and set the quantity shown on each shop to at most available − buffer with `scripts/stock-calc.mjs`; an existing oversell problem → playbook `stock-sync` · ใคร: `shop-manager` ตัวใหม่
6. Check (ตรวจ) banned advertising words, the SKU, and image sizes for each platform (`campaign-set` in graphic-design, ถ้าติดตั้ง), judge the listing against `selling.md`, and recalculate the price and the shown stock against `shop-money.md` principles 1 and 4 (price covers every fee layer · shown stock ≤ available − buffer on every shop) · ใคร: `reviewer` ตัวใหม่

## Done when

The price table has been recalculated · every platform's listing has passed the banned-word check · the SKU is in the stock file and the quantity shown on each shop is ≤ available − buffer · the actual listing is under "รออนุมัติ" (awaiting approval).
