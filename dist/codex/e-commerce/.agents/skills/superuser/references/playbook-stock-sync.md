# playbook · stock-sync — keep stock the same across several shops

Use when: the same goods sell on several platforms and oversell · counts do not match
Main principles: [`shop-principles`](../../shop-principles/SKILL.md) · [`shop-money.md`](../../shop-principles/references/shop-money.md)
Main skills: `shop-operations`

## ขั้นตอน · Steps (copy into the todo exactly)

1. Open `shop-money.md` first. Then merge the stock figures from every shop and the real goods in the warehouse into one master file · ใคร: `shop-manager` ตัวใหม่
2. Give SKUs the same naming style in every shop · ใคร: `shop-manager` ตัวใหม่
3. Set the stock sync rules, a buffer (stock held back from sale) per shop, and the reorder point, per `shop-operations` · ใคร: `shop-manager` ตัวใหม่
4. Make an adjustment list per shop (which shop, which SKU, from how many to how many), and keep the edits in the live shops under "รออนุมัติ" (awaiting approval) · ใคร: `shop-manager` ตัวใหม่ · ผู้ใช้อนุมัติการแก้ในร้านจริง
5. Check (ตรวจ) that the quantity shown in each shop does not exceed available − buffer (real stock in the warehouse − reserved stock − buffer), that a sync cadence is set, and that the rules follow `shop-money.md` · ใคร: `reviewer` ตัวใหม่

## Done when

The master stock file matches the real goods · the quantity shown in every shop is at most available − buffer · the adjustment list is ready to apply.
