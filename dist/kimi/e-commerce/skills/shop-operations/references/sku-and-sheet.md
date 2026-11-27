# SKU naming and master sheet template

Open at step 1 and 2 when naming SKUs or building the master sheet.

## SKU naming

`<CATEGORY 2–3 letters>-<PRODUCT 3–4>-<VARIANT>-<SIZE>`

| Example | Meaning |
|---|---|
| `BAG-TOTE-BLK-L` | bag, tote model, black, large |
| `SKN-SERM-30ML` | skincare, serum, 30 ml |
| `SET-TOTE2-BLK` | bundle of 2 black totes — a bundle has its own SKU and its components listed in the sheet |

Rules: capitals, hyphens, no Thai letters or spaces (some exports break on them), never reuse a retired code, colour codes fixed once (BLK, WHT, NVY, BEI…).

## Master sheet template

| SKU | Name (TH) | on_hand | reserved | available | buffer | Shopee | Lazada | TikTok | LINE/FB | avg/day | lead days | reorder point | reorder qty | supplier | last count |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BAG-TOTE-BLK-L | กระเป๋าผ้า ดำ L | 140 | 6 | =on_hand−reserved | 4 | | | | | 4.0 | 10 | | | | 2026-10-06 |

- `reserved` = paid orders not yet shipped
- `available` = `on_hand − reserved`
- `buffer` = units never shown anywhere, to absorb sync delay
