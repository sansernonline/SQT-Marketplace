---
name: home-maintenance
description: Use when a Thai home needs a seasonal maintenance schedule (aircon, pump, termites, roof) or compares quotes.
---

# Home Maintenance (Thai climate)

Small jobs on a schedule cost less than one emergency repair in the rainy season.

General information, not engineering advice. Electrical, gas, structural and roof work goes to a licensed or insured technician.

## The Thai year in three seasons

| Season | Months | What it does to a house | Do before it starts |
|---|---|---|---|
| Hot (ฤดูร้อน) | mid-Feb – mid-May | Aircon runs 10+ h/day, pumps work hardest, water pressure drops | Aircon service, pump check, tank clean |
| Rainy (ฤดูฝน) | mid-May – mid-Oct | Roof leaks, blocked gutters, flooding, termites swarm, damp and mould | Roof, gutters, drains, termite check, flood kit — **by April** |
| Cool (ฤดูหนาว) | mid-Oct – mid-Feb | Dry, cheapest time for contractors outside holidays | Painting, waterproofing, big repairs |

## Workflow

1. **Inventory** the house: number of aircons (BTU, room, install year), water tank (size, material), pump, water heater, roof type, appliances under warranty — use the inventory table in [references/maintenance-calendar.md](references/maintenance-calendar.md)
2. **Generate the 12-month calendar** from the reference, adjusted for the inventory (more aircons → stagger cleanings so the bill is spread)
3. **Put each job in the family calendar** 2 weeks ahead with the contractor's number
4. **After each job** record date, cost and who did it — next quote is compared against it
5. **Warranties** — keep receipt + warranty card photo in `important-docs`; diary the expiry date one month ahead so faults are claimed while covered

## Core intervals

| Job | Interval | Why | Typical cost |
|---|---|---|---|
| Aircon filter rinse (self) | every 2–4 weeks | Clogged filter = more power, less cooling | free |
| Aircon full clean (ล้างแอร์) | every 3–6 months; 3 if near a road, pets, or 8+ h/day use | Dirty coil can add 10–25% electricity (รอยืนยัน) | 500–1,000 บาท/unit wall type (รอยืนยัน) |
| Water tank clean (ล้างแท็งก์น้ำ) | every 1–2 years | Sediment, algae | (รอยืนยัน) |
| Pump check — pressure switch, check valve, noise, cycling | every 6 months | A pump that cycles on and off with taps closed = leak | |
| Termite inspection (ปลวก) | yearly; bait/soil treatment contract often 1–3 years | Swarms after first rains | contract (รอยืนยัน) |
| Roof, flashing, gutters (รางน้ำ), downpipes | every March–April | Leaves block gutters → overflow into ceiling | |
| Drains and grease trap (บ่อดักไขมัน) | every 3 months | Smell, flooding | |
| Septic tank (บ่อเกรอะ/ถังบำบัด) emptying | every 2–5 years by use; call the เขต/เทศบาล service | Overflow | (รอยืนยัน) local fee |
| RCD / ELCB test button (เครื่องตัดไฟรั่ว) | monthly press of the test button | Shock protection | free |
| Water heater earth and RCD check | yearly by electrician | Shock risk in the shower | |
| Smoke detector battery, fire extinguisher gauge | 6 months / yearly | | |
| Exterior repaint, waterproof coating | 5–7 years, in cool season | Walls crack and absorb rain | |

Costs vary by city and size — get 2 quotes; a figure marked (รอยืนยัน) is a planning guess, not a price.

ตรวจล่าสุด 2026-10-26 · Season months: the กรมอุตุนิยมวิทยา (TMD) winter outlook runs mid-Oct 2569 to mid-Feb 2570, and TMD declared the rainy season on 15 May 2568 (news reports: https://www.naewna.com/n/?p=113925 · https://www.thairath.co.th/news/society/2787259 · https://www.thansettakij.com/general-news/641947); the hot season actually started late Feb to early Mar in recent years, so the table shows long-run averages — check the TMD seasonal outlook at https://www.tmd.go.th/forecast/seasonal each year. Prices and the aircon electricity figure have no official source and stay (รอยืนยัน).

## Contractor quote checklist

Before paying anything, every quote must show:

- [ ] Contractor's full name, ID card or company registration number, address, phone, LINE
- [ ] Scope in items: what is included and **what is not** (scaffolding, debris removal, materials grade, paint brand and code)
- [ ] Quantities and unit prices, not one lump sum
- [ ] Start date, duration, what happens if it rains
- [ ] Payment schedule tied to finished stages — deposit ≤ 30% (common practice), final payment after inspection
- [ ] Warranty on workmanship (e.g. 6–12 months on leaks) in writing
- [ ] Who pays if they damage something; insurance for high work
- [ ] 2–3 quotes for anything over ~10,000 บาท; compare in one table (scope · price · warranty · timeline · reviews)

For a formal quotation format see `e-commerce` `doc-quotation` (if installed); for a written agreement on a big job see `e-commerce` `doc-contract-th` (if installed).

## Compare quotes by numbers (`decision-scoring`, command `score`)

1. **Iron rules (กฎเหล็ก), drop the quote before scoring:** no written quotation (a verbal price only) · deposit above 30% (common practice, not law) · contractor identity or phone missing. Put them in `must` as `equals` or `max`, for example `{"criterion":"written quote 1=yes","equals":1}` and `{"criterion":"deposit %","max":30}`.
2. **Criteria (default weights, starting value, not yet measured, the user changes them):** total price in baht, same scope for every quote (low, 0.40) · workmanship warranty in months (high, 0.25) · reviews or references 1–5, user's score (high, 0.20) · days to finish (low, 0.15).
3. **Run:** `node decide.mjs score quotes.json`. Compare only quotes with the same scope; if scope differs, fix the scope first, because the cheapest quote is often the one that leaves things out.
4. **Unstable or close** (`ยังไม่นิ่ง`, `สูสี`) → ask the top two contractors for the missing item (warranty in writing, a firm date), then rerun. The user picks; the score is supporting data.

## Worked example

House with 3 wall aircons (bedroom 9,000 BTU ×2, living room 18,000 BTU), cleaned last in March. Schedule: bedrooms in June and December, living room (runs longest) in June, September, December, March. Spread cleanings so no single month carries all three. Quotes for March: A 600/unit, no warranty; B 700/unit incl. coil chemical wash, 30-day re-clean if dripping. Choose B — the drip guarantee prevents a second call-out.

## Related

`household-bills` (spike traced to aircon) · `vehicle-care` · `important-docs` · `trading-finance` `personal-budget` (if installed) (sinking fund: set aside 1% of house value a year for repairs — a common rule of thumb)
