---
name: shipping-compare
description: Use when a Thai online seller compares couriers (Flash, Kerry, J&T, Thailand Post, SPX). Cost on real parcel mix, COD fees and payout, volumetric weight.
---

# Shipping Compare

The cheapest courier on a rate card is often not the cheapest on your parcels. Compare on your own last month of orders: real weights, real sizes, real destinations, real COD share.

## Where the choice actually exists

| Channel | Who picks the courier | What the seller controls |
|---|---|---|
| Shopee | Platform's supported list (SPX Express and partners) per shop settings | Which supported couriers to enable; parcel size and weight; drop-off vs pick-up |
| Lazada | Lazada Logistics / assigned partner | Parcel size; drop-off point |
| TikTok Shop | Platform-assigned partners | Parcel size; pick-up booking |
| LINE / Facebook / own website | **The seller** | Courier, COD, insurance, rate deal |

On marketplaces the platform's shipping rate and subsidies apply; the comparison below matters most for LINE and Facebook orders and for choosing among enabled couriers.

## Workflow

1. **Export last month's orders** — weight, box size, destination province, COD yes/no, COD amount
2. **Group** into 3–5 typical parcels (e.g. 0.5 kg envelope, 1 kg box 20x15x10, 3 kg box 30x25x20) with their share of orders
3. **Get quotes** for each typical parcel from each courier's app or website, **as a business account** (volume rates are lower than walk-in), Bangkok and upcountry
4. **Compute chargeable weight** for each (rule below)
5. **Add COD cost** = COD fee % × COD amount (+ VAT if charged) for the COD share
6. **Score** with the comparison table — cost per average order, plus pick-up, payout days, claim experience
7. **Trial** the winner for two weeks on real orders before switching everything; keep a second courier for remote areas and outages

## Chargeable weight

```
Volumetric weight (kg) = width × length × height (cm) ÷ divisor
Chargeable weight      = the higher of actual weight and volumetric weight, rounded up to the courier's step
```

Divisor is usually 5,000 or 6,000 depending on the courier and service — confirm on each courier's rate page (รอยืนยัน per courier). Example: pillow box 40 x 30 x 20 cm, actual 1.2 kg → 24,000 ÷ 5,000 = 4.8 kg volumetric → charged as 5 kg. Repacking into 35 x 25 x 15 cm → 2.6 kg → charged as 3 kg. A smaller box is the cheapest shipping discount.

## Comparison table (fill with your quotes)

| | Flash Express | Kerry (KEX) | J&T Express | ไปรษณีย์ไทย (EMS/ลงทะเบียน) | SPX Express |
|---|---|---|---|---|---|
| Price 0.5 kg BKK / upcountry | | | | | |
| Price 1 kg box | | | | | |
| Price 3 kg box | | | | | |
| COD fee | ≈2.14%–2.5% via partner systems (รอยืนยัน) | (รอยืนยัน) | ≈2.5% (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) |
| COD payout | (รอยืนยัน) days | | | Wallet@Post or bank transfer | |
| Max weight | 50 kg reported (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) |
| Free pick-up minimum | | | | | |
| Remote-area surcharge | | | | | |
| Claim limit without insurance | | | | | |
| **Cost per average order** | | | | | |

Context: Flash, Kerry (KEX) and J&T reportedly raised base prices by ฿3 per parcel from 1 April 2026 (fuel costs). COD maximum per parcel at Flash reported ฿50,000 (รอยืนยัน).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://zortout.com/en/docs/how-to-register-and-ship-cash-on-delivery-cod-packages-via-flash-express · https://www.car250.com/?p=463590 · courier rate pages — every rate (รอยืนยัน) in the courier's own app

## Worked example — LINE shop, 300 orders a month

Mix: 60% 0.5 kg envelopes, 40% 1 kg boxes; 30% COD, average COD ฿450.
Courier A: envelope ฿28, box ฿35, COD 2.5% → (0.6 × 28 + 0.4 × 35) + 0.3 × 450 × 2.5% = 16.8 + 14 + 3.38 = **฿34.18 per order**.
Courier B: envelope ฿25, box ฿38, COD 3% → 15 + 15.2 + 4.05 = **฿34.25 per order** (illustrative quotes).
Near tie — decide on pick-up reliability and COD payout speed, not the rate card.

## Packaging

- Box or mailer just big enough; fill gaps (paper, air pillows) so nothing moves when shaken
- Liquids: tape the cap, bag it in a zip bag, upright arrow; glass: 5 cm cushioning on all sides + "ระวังแตก" sticker (stickers do not replace padding)
- Waterproof outer layer for paper goods — rainy season May–October
- Label flat on the largest face; old labels removed; phone number readable
- **Record a packing video** of every order with the order number visible — it decides "ได้ของไม่ครบ" disputes (`returns-and-bad-reviews`)
- Packaging cost (box, tape, filler, label) goes into `C` in `marketplace-fees-pricing`

## Claims for lost or damaged parcels

1. Buyer reports → collect photos of box and item, tracking number, packing video
2. File with the courier (marketplace orders: through the platform's shipping dispute) within the courier's claim window (รอยืนยัน per courier)
3. Compensation is capped by declared value or insurance — insure parcels above the uninsured cap
4. Resend or refund the buyer first if the platform requires it; recover from the courier afterwards

## Related

- `marketplace-fees-pricing` (shipping `S`), `chat-reply-templates` T3 late parcel, `returns-and-bad-reviews`
- `thai-workplace` `promptpay-qr` — prepaid transfer instead of COD for LINE/Facebook orders cuts COD fees and refused parcels
