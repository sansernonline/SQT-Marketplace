<!-- merged from skill `pet-care` on 2026-11-27 · description was: Use when a Thai family keeps a dog or cat, no vet diagnosis -->
# pet-care — one record, calendar and budget for a family's dog or cat in Thailand

General information, not veterinary or legal advice. The vet decides vaccines and medicines; the local เขต/เทศบาล/ปศุสัตว์อำเภอ is the authority on registration. This skill never suggests a medicine or a dose.

## Use when
- A Thai family keeps a dog or cat and wants a vaccine calendar, a record, a vet-visit checklist or a yearly budget.
- The user asks what the law requires (rabies vaccine, registration, microchip) or what vaccine schedule to ask the vet about.

Not for: diagnosis or treatment → the vet · pest treatment safe for pets → `home-upkeep` (ask the contractor) · foods toxic to pets (chocolate, grapes, onion, garlic, xylitol) → `family-week`.

## Steps
1. **Law and schedule questions.** Only the rabies vaccine is required by law (พ.ร.บ.โรคพิษสุนัขบ้า พ.ศ. 2535); everything else is good practice. Open [`law-and-vaccines.md`](law-and-vaccines.md) before quoting the law, registration, microchip rules, or the vaccine schedule. Bangkok's new animal-keeping bylaw has a postponed start date: look up the start date, caps and fines live (WebSearch/WebFetch) before quoting; if the page will not open, mark the value (รอยืนยัน).
2. **One record per animal** — [`pet-record.md`](pet-record.md): ID, microchip number, vaccines with dates and sticker photos, weight log, vet contacts. With a record, the vet visit takes 10 minutes instead of 30.
3. **Calendar:** vaccine due dates, monthly prevention, deworming; set reminders 7 days ahead. For due dates in พ.ศ. or across a year-end: `node skills/family-legal/scripts/due-dates.mjs <file.json>` with `lead_days` 7.
4. **Before each vet visit,** write what changed, since when, eating/drinking/toilet, weight; bring the vaccine book.
5. **After the visit,** copy the vet's instructions exactly into the record and book the next visit before leaving.
6. **Budget:** plan with the user's own vet quotes (items and layout in [`budget-and-example.md`](budget-and-example.md); numbers marked (รอยืนยัน) are not prices). Keep an emergency fund, or compare pet insurance with `decision-desk/decision-scoring`, command `payoff`: `node decide.mjs payoff insurance.json`, starting from [`insurance-payoff-example.json`](insurance-payoff-example.json) (made-up numbers; the user replaces the vet quotes and the chances, which are a guess). It shows expected cost and the biggest regret side by side. When the two disagree (`2 เกณฑ์ไม่ตรงกัน`), do not pick for the user: expected cost fits a choice repeated every year, least regret fits a one-off large bill the user could not pay.
7. **Travel or boarding:** pet hotels ask for the vaccine book; rabies within the last year is usually required.

## Check before done
- No medicine or dose was suggested; any vet decision is marked as the vet's.
- Law or fee values not confirmed live carry (รอยืนยัน).
- The record, the calendar (7-day reminders) and the budget total (added to `trading-finance` `budget-and-debt` if installed) exist.

## References
- [`law-and-vaccines.md`](law-and-vaccines.md) — open when the question is about law, registration, microchip or vaccine schedule
- [`pet-record.md`](pet-record.md) — open when creating or updating an animal's record
- [`budget-and-example.md`](budget-and-example.md) — open when building the yearly budget or showing a worked example
- [`insurance-payoff-example.json`](insurance-payoff-example.json) — open when comparing pet insurance
- [`sources.md`](pet-care/sources.md) — sources and check dates
