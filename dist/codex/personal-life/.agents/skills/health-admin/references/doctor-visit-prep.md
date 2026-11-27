<!-- merged from skill `doctor-visit-prep` on 2026-11-27 · description was: Use when preparing for a doctor visit, with no diagnosis -->
# Doctor Visit Prep

A Thai outpatient consultation is often only a few minutes. Arrive with one page.

General information to help organise, not medical advice. Emergency signs (chest pain, stroke signs, severe breathing difficulty, heavy bleeding) → **1669 now**, not an appointment.

## Before the visit — the one-page visit card

1. **Reason in one sentence** — "Headache most mornings for 3 weeks, worse this week."
2. **Symptom timeline** (template below).
3. **Medicine list** — from `medication-schedule.md`, including supplements, herbal products and anything bought at a pharmacy.
4. **Allergies** — medicine, food, latex; reaction.
5. **Relevant history** — conditions, surgeries, pregnancy possibility, family history the user wants to mention.
6. **Top 3 questions** — the most important first; the doctor may only have time for three.
7. **Bring** — บัตรประชาชน, insurance card or scheme info, previous results (`annual-checkup.md` table), the medicine bags themselves if unsure, ใบนัด if a follow-up.

## Symptom timeline template

| Date / time | What happened (describe, don't label) | Severity 0–10 | Lasted | What made it better / worse | What I took or did | Photo / reading |
|---|---|---|---|---|---|---|

Describe what you feel ("pressure behind the eyes", "burning when urinating"), not what you think it is. Home readings (blood pressure, temperature, blood sugar) go in with time and device.

Useful OLDCARTS prompts for the description: **O**nset · **L**ocation · **D**uration · **C**haracter · **A**ggravating / relieving · **R**adiation (spreads where) · **T**iming · **S**everity.

Question bank (pick three): [`question-bank.md`](question-bank.md). Emergency card (separate one-page card, not the visit card): [`emergency-card.md`](emergency-card.md).

## During the visit

- Hand over the one-page card first.
- Write answers down or ask permission to record.
- Repeat back: "So I should … and come back if …" — this catches misunderstandings.
- Before leaving the pharmacy counter, read each label and ask about anything unclear.

## After the visit — summary

| Field | Notes |
|---|---|
| Date, hospital, doctor, department | |
| What the doctor said (their words) | |
| Tests done / ordered, result date | |
| New medicines — copied exactly from label | |
| Stopped or changed medicines (as the doctor said) | |
| Things to do (diet, rest, exercise limits) | |
| Warning signs to return early | |
| Follow-up date (ใบนัด) | |
| Cost and what the scheme covered | |
| Questions for next time | |

Then update `medication-schedule.md` and the `annual-checkup.md` results table, and store papers in `family-legal`.

Related: `medication-schedule.md` · `annual-checkup.md` · `sleep-log.md` · `meeting`.

## เรียกเป็นคำสั่ง

`/personal-life:health-admin <before|after> [reason for visit]`

Run the `health-organizer` agent with the `health-admin` skill: **the user's request**

- `before` — build the one-page visit card: symptom timeline, medicine list (from `medication-schedule.md`), allergies, top 3 questions
- `after` — fill the after-visit summary: what the doctor said, new prescriptions copied exactly, tests ordered, follow-up date, warning signs to watch

Never diagnose or suggest doses. Emergency symptoms → 1669 first.

## References

- [`question-bank.md`](question-bank.md) — open to pick the top 3 questions for the doctor
- [`emergency-card.md`](emergency-card.md) — open when the user asks for an emergency card
