<!-- merged from skill `shop-daily-briefing` on 2026-11-27 · description was: Use when a Thai online seller starts the day -->
# Shop Daily Briefing

Turns this morning's order, chat and stock exports into 3–6 decisions for today, most money at risk first.

> **One rule:** every item comes from data pulled today, carries a number and a deadline, and ends with the next step. Yesterday's numbers are not today's briefing.

## Use when / not when

| Situation | Use |
|---|---|
| "วันนี้ต้องทำอะไรก่อน", start of the shop day, after a campaign night, back from a day off | this skill |
| Sync stock across platforms, reorder points | `multi-shop-stock.md` |
| Write the reply to one chat | `customer-care` |
| Decide one return, dispute or review | `customer-care` |
| Will cash run short in the coming weeks | `shop-books` |
| Weekly or monthly review of reviews | `customer-care`, monthly review |

## Steps

1. **Ask for today's exports**, not a summary from memory. Per platform (Shopee, Lazada, TikTok Shop, LINE or Facebook orders): orders to ship, orders past their ship-by time, open return or refund requests and disputes, unanswered chats, and the master stock sheet. A source the owner cannot export today is named in the briefing as missing; never fill it from yesterday.
2. **Collect candidate items** from 6 checks:

| Check | Item when | Next step points to |
|---|---|---|
| Orders past or near ship-by time | any order whose ship-by time is today or passed | pack and hand over before the courier cut-off; late shipping can cost shop rating points (รอยืนยัน the penalty in each Seller Centre) |
| Return, refund or dispute requests | any request with a response deadline today or tomorrow | `customer-care` decision table; a missed deadline is usually an automatic refund |
| Payment problems | COD refused parcels coming back, unpaid LINE or Facebook orders older than the shop's hold time | cancel or chase per shop policy |
| Parcels stuck | tracking unchanged for longer than the courier's normal time | open a courier claim (`pricing-and-costs`) and tell the buyer (`customer-care` T3) |
| Stock | SKU at or below its reorder point, or oversold (negative available) | `multi-shop-stock.md`: stop selling on extra channels, reorder |
| Chats | unanswered chats, sorted by the "Which chat first" table | `customer-care` |

3. **Rank** by baht at risk first (order value, refund amount, sales lost per day of stock-out), then by the nearest deadline.
4. **Write 3–6 items**, each 1 line: what, how many, baht at risk, deadline, next step. Example shape: "ออเดอร์ 4 ใบเลยเวลาเตรียมส่ง รวม 2,360 บาท · ส่งให้ทันรอบรถ 17:00 วันนี้".
5. **Fold the rest** into 1 line with the count ("อีก 9 เรื่องเล็ก: แชตถามสินค้า 7 · สต็อกใกล้จุดสั่ง 2"). One line joined with `·`, not a sub-list and no advice per folded item; advice there makes them items again. More than 6 items in the list means nothing stands out.
6. **Stop there.** The briefing lists decisions; the owner picks. Do not send replies, cancel orders or reorder from inside the briefing.

Ship-by and response deadlines differ by platform and change often. Read them from the shop's own Seller Centre and write the date checked next to them (รอยืนยัน each platform's current rule; none are stored in this skill).

## Worked example

Exports to briefing, 6 items (illustrative): [references/worked-example.md](worked-example.md)

## Check before handing over

1. Every item has a number in baht or units, a deadline and a next step.
2. No more than 6 items; the rest folded into 1 line.
3. Every source used was exported today; missing sources are named.
4. No platform deadline is stated as fact without the Seller Centre date checked.

Sources: [references/sources.md](shop-daily-briefing/sources.md)
