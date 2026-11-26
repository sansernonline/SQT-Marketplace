# skill: pet-care

Use when a Thai family keeps a dog or cat, no vet diagnosis

# pet-care — one record, calendar and budget for a family's dog or cat in Thailand

General information, not veterinary or legal advice. The vet decides vaccines and medicines; the local เขต/เทศบาล/ปศุสัตว์อำเภอ is the authority on registration. This skill never suggests a medicine or a dose.

## Use when
- A Thai family keeps a dog or cat and wants a vaccine calendar, a record, a vet-visit checklist or a yearly budget.
- The user asks what the law requires (rabies vaccine, registration, microchip) or what vaccine schedule to ask the vet about.

Not for: diagnosis or treatment → the vet · pest treatment safe for pets → `home-maintenance` (ask the contractor) · foods toxic to pets (chocolate, grapes, onion, garlic, xylitol) → `meal-plan-grocery`.

## Steps
1. **Law and schedule questions.** Only the rabies vaccine is required by law (พ.ร.บ.โรคพิษสุนัขบ้า พ.ศ. 2535); everything else is good practice. Open [`references/law-and-vaccines.md`](references/law-and-vaccines.md) before quoting the law, registration, microchip rules, or the vaccine schedule. Bangkok's new animal-keeping bylaw has a postponed start date: look up the start date, caps and fines live (WebSearch/WebFetch) before quoting; if the page will not open, mark the value (รอยืนยัน).
2. **One record per animal** — [`references/pet-record.md`](references/pet-record.md): ID, microchip number, vaccines with dates and sticker photos, weight log, vet contacts. With a record, the vet visit takes 10 minutes instead of 30.
3. **Calendar:** vaccine due dates, monthly prevention, deworming; set reminders 7 days ahead. For due dates in พ.ศ. or across a year-end: `node skills/important-docs/scripts/due-dates.mjs <file.json>` with `lead_days` 7.
4. **Before each vet visit,** write what changed, since when, eating/drinking/toilet, weight; bring the vaccine book.
5. **After the visit,** copy the vet's instructions exactly into the record and book the next visit before leaving.
6. **Budget:** plan with the user's own vet quotes (items and layout in [`references/budget-and-example.md`](references/budget-and-example.md); numbers marked (รอยืนยัน) are not prices). Keep an emergency fund, or compare pet insurance with `decision-desk/decision-scoring`, command `payoff`: `node decide.mjs payoff insurance.json`, starting from [`references/insurance-payoff-example.json`](references/insurance-payoff-example.json) (made-up numbers; the user replaces the vet quotes and the chances, which are a guess). It shows expected cost and the biggest regret side by side. When the two disagree (`2 เกณฑ์ไม่ตรงกัน`), do not pick for the user: expected cost fits a choice repeated every year, least regret fits a one-off large bill the user could not pay.
7. **Travel or boarding:** pet hotels ask for the vaccine book; rabies within the last year is usually required.

## Check before done
- No medicine or dose was suggested; any vet decision is marked as the vet's.
- Law or fee values not confirmed live carry (รอยืนยัน).
- The record, the calendar (7-day reminders) and the budget total (added to `trading-finance` `personal-budget` if installed) exist.

## References
- [`references/law-and-vaccines.md`](references/law-and-vaccines.md) — open when the question is about law, registration, microchip or vaccine schedule
- [`references/pet-record.md`](references/pet-record.md) — open when creating or updating an animal's record
- [`references/budget-and-example.md`](references/budget-and-example.md) — open when building the yearly budget or showing a worked example
- [`references/insurance-payoff-example.json`](references/insurance-payoff-example.json) — open when comparing pet insurance
- [`references/sources.md`](references/sources.md) — sources and check dates


## reference: budget-and-example.md

# Pet budget and worked example

## Budget (plan with your own vet's prices)

| Item | Per year (example to replace with real quotes) |
|---|---|
| Vaccines (core + rabies) | (รอยืนยัน — ask the clinic) |
| Flea/tick/heartworm prevention | (รอยืนยัน) |
| Food (by weight and brand) | kg/month × price × 12 |
| Grooming, litter, toys | |
| Annual check-up and blood test for older pets | (รอยืนยัน) |
| Emergency fund | target: one surgery-sized bill held aside, or insurance premium |

Fill with your clinic's quotes; numbers marked (รอยืนยัน) are not prices. Add the total to `trading-finance` `personal-budget` (if installed).

## Worked example

Puppy adopted 1 July 2026 at 8 weeks. Vet plan: core vaccine 1 July, boosters 29 July and 26 August, rabies at 12–16 weeks (with the August visit, vet's decision), microchip with registration at the สำนักงานเขต (check fee). Reminders: rabies booster August 2027; monthly prevention on the 1st. The family adds a line "ฉีดพิษสุนัขบ้าแล้ว — เลขสติกเกอร์ ___" to the record so boarding and the เขต can see it at once.


## reference: law-and-vaccines.md

# Pet law and vaccine schedule

General information, not veterinary or legal advice. The vet decides vaccines and medicines; the local เขต/เทศบาล/ปศุสัตว์อำเภอ is the authority on registration.

## The law

| Law | What it means for owners |
|---|---|
| พ.ร.บ.โรคพิษสุนัขบ้า พ.ศ. 2535 มาตรา 5 | Owners must have every controlled animal (dogs, cats and others named by regulation) vaccinated against rabies by a vet or authorised person, on the schedule set by regulation; a vaccination tag/certificate is issued each time. Penalty for not vaccinating: fine up to 200 บาท under มาตรา 21 (iLaw, กรมปศุสัตว์ summary and local bylaws in the Royal Gazette agree — confirmed 2026-10-26) |
| Schedule under the law | Dogs: first vaccine at 2–4 months old, the next dose by the date on the vaccination certificate (confirmed). The law itself does not say "every year" — yearly boosters are the กรมปศุสัตว์ recommendation. Cats are controlled animals under a 2560 ministerial regulation, first dose at 2–4 months (รอยืนยัน) |
| Local registration | Many local authorities require dog registration and/or a microchip under their own ข้อบัญญัติ. Bangkok: the 2548 dog bylaw applies now, and the Bangkok veterinary office microchips and registers for free; the commonly quoted 120-day deadline and 450-baht fee were not confirmed (รอยืนยัน). A new Bangkok animal-keeping bylaw (ข้อบัญญัติ … การควบคุมการเลี้ยงหรือปล่อยสัตว์ พ.ศ. 2567) was announced with compulsory microchips, a cap on animals by home size and fines. Its start date has been postponed: look up the current start date, caps and fines live (WebSearch/WebFetch, Bangkok Metropolitan Administration site or the สำนักงานเขต) before quoting; if the page will not open, mark the value (รอยืนยัน) |
| พ.ร.บ.ป้องกันการทารุณกรรมและการจัดสวัสดิภาพสัตว์ พ.ศ. 2557 | Owners must provide proper food, shelter and care; abandonment is an offence |

Free rabies vaccination campaigns are run by local authorities and ปศุสัตว์ — usually around World Rabies Day (28 September) and ahead of the hot season (รอยืนยัน local dates).

## Typical vaccine and prevention schedule

What the vet commonly follows (the vet decides — use this only to know what to ask):

| Age / interval | Dog | Cat |
|---|---|---|
| 6–8 weeks | Core combination vaccine (distemper, parvo, hepatitis) | Core combination (panleukopenia, calicivirus, herpesvirus) |
| every 3–4 weeks until ~16 weeks | Core boosters | Core boosters |
| 3–4 months | **Rabies (legal requirement)** | **Rabies (legal requirement)** |
| 1 year, then yearly or as the vet says | Core booster + **rabies yearly** | Core booster + **rabies yearly** |
| Monthly or per product | Flea/tick and heartworm prevention — ask the vet | Flea prevention |
| Every 3–6 months | Deworming per vet | Deworming per vet |
| 6 months+ | Discuss neutering (ทำหมัน) | Discuss neutering |

Sources and check date: [`sources.md`](sources.md).


## reference: pet-record.md

# Pet record

## Profile

| | |
|---|---|
| ชื่อ | |
| ชนิด / พันธุ์ / สี | |
| เพศ / ทำหมันแล้ว? | |
| วันเกิด (หรือประมาณ) | |
| เลขไมโครชิป | |
| เลขทะเบียนสัตว์ (เขต/เทศบาล) | |
| คลินิก/โรงพยาบาลสัตว์ประจำ · เบอร์ | |
| โรงพยาบาลสัตว์ 24 ชม. ใกล้บ้าน · เบอร์ | |
| แพ้ยา / อาหาร | |

## Vaccines

| วันที่ | วัคซีน | ล็อต/สติกเกอร์ (ถ่ายรูปแนบ) | สัตวแพทย์ | ครั้งต่อไป |
|---|---|---|---|---|
| | พิษสุนัขบ้า | | | |
| | รวม (core) | | | |

## Prevention

| ประเภท | ผลิตภัณฑ์ (ตามที่สัตวแพทย์สั่ง) | วันที่ให้ | ครั้งต่อไป |
|---|---|---|---|
| เห็บหมัด | | | |
| พยาธิหนอนหัวใจ | | | |
| ถ่ายพยาธิ | | | |

## Weight and visits

| วันที่ | น้ำหนัก (กก.) | เหตุผลที่ไปหา | สัตวแพทย์บอกว่า (คัดลอกตามจริง) | ค่าใช้จ่าย |
|---|---|---|---|---|
| | | | | |


## reference: sources.md

# Sources · pet-care

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://www.ilaw.or.th/articles/16300 · https://www.dld.go.th (กรมปศุสัตว์) · ข้อบัญญัติท้องถิ่นที่ลอกมาตรา 5 https://ratchakitcha.soc.go.th/documents/20751.pdf · สำนักงานสัตวแพทย์สาธารณสุข กทม. https://webportal.bangkok.go.th/VPH/ · Bangkok bylaw delay: Thansettakij 7 ม.ค. 2569 · InfoQuest

Used for the law table in [`law-and-vaccines.md`](law-and-vaccines.md).
