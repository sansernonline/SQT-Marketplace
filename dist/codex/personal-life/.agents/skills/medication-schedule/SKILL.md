---
name: medication-schedule
description: Use when someone needs a daily medicine schedule from Thai drug labels, refills or an allergy list. No dosing.
---

# Medication Schedule

Turn the bag of medicines from the hospital into one table everyone in the house can follow.

General information to help organise, not medical advice — dose questions go to the pharmacist (เภสัชกร) or doctor.

## Hard rules

1. **Copy, never compose.** Every dose, time and condition comes from the label (ฉลากยา) or prescription word for word. If the label is unclear, write `[ถามเภสัชกร]` — do not fill it in.
2. **No changes.** Do not advise skipping, doubling, stopping, splitting, crushing, or moving a dose to another time — even if the user asks. Answer: "Please call the pharmacist at the hospital where you got it; their number is usually on the bag."
3. **Missed dose** — write down what the label or leaflet says about missed doses; if it says nothing, the action is "call the pharmacist".
4. **Interactions** — do not judge. List every medicine, supplement and herbal product together and ask the pharmacist to check them.
5. **Overdose or poisoning** → 1669, or ศูนย์พิษวิทยา รามาธิบดี 1367.

## Thai label words → schedule columns

| On the label | Meaning to record | Column |
|---|---|---|
| ก่อนอาหาร | Before meal — copy the minutes if the label gives them; if not, write `[ถามเภสัชกร]` next to the time | Before breakfast / lunch / dinner |
| หลังอาหาร / หลังอาหารทันที | After meal / immediately after meal | After breakfast / lunch / dinner |
| ก่อนนอน | At bedtime | Bedtime |
| ทุก 6 ชั่วโมง / ทุก 8 ชั่วโมง | Every N hours | Exact clock times agreed with the pharmacist |
| เมื่อมีอาการ / เวลาปวด | As needed | Separate "as needed" list, with the label's maximum per day |
| รับประทานจนหมด | Finish the whole course | Note "until finished" + expected end date |
| ห้ามรับประทานร่วมกับ… / ระวัง… | Warning | Warnings column |

## Daily schedule table

| Medicine (name on label + strength) | Purpose (as the doctor said) | Before bkfst | After bkfst | Before lunch | After lunch | Before dinner | After dinner | Bedtime | As needed (max/day) | Warnings on label | Start | End / ongoing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Example: [ชื่อยา] 500 mg | [as written] | | 1 tab | | | | 1 tab | | | หลังอาหารทันที | 2026-10-01 | ongoing |

A printable tick sheet:

| Date | [time 1] | [time 2] | [time 3] | [time 4] | Note |
|---|---|---|---|---|---|
| | ☐ | ☐ | ☐ | ☐ | |

## Refill reminders

For each ongoing medicine:

| Medicine | Units per day (from label) | Units on hand | Days left = on hand ÷ per day | Refill by (days left − 7) | Where (hospital / pharmacy) | Appointment needed? |
|---|---|---|---|---|---|---|

Do not count days by hand: write `on_hand`, `per_day` (from the label only) and `start_date` as JSON and run `node skills/important-docs/scripts/due-dates.mjs --refill <file.json>` (example: `skills/important-docs/scripts/example-refill.json`). It returns days of supply, the last day with medicine, the reminder date and a status; `per_day` of 0 is refused. It never suggests a dose.

Worked example (this is the script's example file): 60 tablets on hand, label says 1 tablet twice a day → 2 per day → 30 days left → set reminder at day 23. Hospital follow-up appointments (ใบนัด) often refill at the visit — check the ใบนัด date is before the medicine runs out.

## Allergy and side-effect list

| Substance (medicine, food, latex) | Reaction | When | Confirmed by doctor? | Card / record at hospital? |
|---|---|---|---|---|

Keep a photo of the hospital's drug-allergy card (บัตรแพ้ยา) if one was issued; show it at every new hospital, clinic and pharmacy.

## Workflow

1. Photograph every label and the prescription slip.
2. Build the medicine list and schedule table by copying labels.
3. Mark anything unclear `[ถามเภสัชกร]`; collect those questions for `doctor-visit-prep`.
4. Set phone reminders for each column used; add refill reminders.
5. Review at every doctor visit — remove stopped medicines, add new ones exactly as prescribed.
6. For an older family member: one copy on the fridge, one on the caregiver's phone.

Related: `doctor-visit-prep` · `annual-checkup` · `important-docs` in `personal-life` (keep the allergy card and prescriptions) · `scam-check` in `trading-finance` (miracle-cure sellers).
