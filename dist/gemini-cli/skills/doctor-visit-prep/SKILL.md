---
name: doctor-visit-prep
description: Use before a doctor or hospital visit in Thailand to build a symptom timeline, medicine and allergy list and top questions, and afterwards to record what was said, prescriptions and follow-up. Never suggests a diagnosis.
---

# Doctor Visit Prep

A Thai outpatient consultation is often only a few minutes. Arrive with one page.

General information to help organise, not medical advice. Emergency signs (chest pain, stroke signs, severe breathing difficulty, heavy bleeding) → **1669 now**, not an appointment.

## Before the visit — the one-page visit card

1. **Reason in one sentence** — "Headache most mornings for 3 weeks, worse this week."
2. **Symptom timeline** (template below).
3. **Medicine list** — from `medication-schedule`, including supplements, herbal products and anything bought at a pharmacy.
4. **Allergies** — medicine, food, latex; reaction.
5. **Relevant history** — conditions, surgeries, pregnancy possibility, family history the user wants to mention.
6. **Top 3 questions** — the most important first; the doctor may only have time for three.
7. **Bring** — บัตรประชาชน, insurance card or scheme info, previous results (`annual-checkup` table), the medicine bags themselves if unsure, ใบนัด if a follow-up.

## Symptom timeline template

| Date / time | What happened (describe, don't label) | Severity 0–10 | Lasted | What made it better / worse | What I took or did | Photo / reading |
|---|---|---|---|---|---|---|

Describe what you feel ("pressure behind the eyes", "burning when urinating"), not what you think it is. Home readings (blood pressure, temperature, blood sugar) go in with time and device.

Useful OLDCARTS prompts for the description: **O**nset · **L**ocation · **D**uration · **C**haracter · **A**ggravating / relieving · **R**adiation (spreads where) · **T**iming · **S**everity.

## Question bank — pick three

About the problem
- What do you think is causing this, and what else could it be?
- Do I need any tests? What will they show, and when do I get the results?
- What should I watch for that means I must come back sooner or go to the emergency room?

About treatment
- What is this medicine for, how long do I take it, and what side effects should I report?
- Does it interact with anything on my list (show the list)?
- What happens if I don't treat it now?
- Are there non-medicine options?

About cost and rights
- Is this covered under my scheme (ประกันสังคม / บัตรทอง / ข้าราชการ / insurance)?
- Is there an equivalent covered option or a generic?
- Do I need a referral letter (ใบส่งตัว) to see a specialist under my scheme?

Thai phrasing if needed: "ขอถามคำถามสั้น ๆ 3 ข้อได้ไหมคะ/ครับ" · "อาการแบบไหนที่ต้องรีบกลับมาหรือไปห้องฉุกเฉินคะ/ครับ" · "ยานี้ทานนานแค่ไหน และต้องระวังอะไรบ้าง"

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

Then update `medication-schedule` and the `annual-checkup` results table, and store papers in `important-docs` (`personal-life`).

## Worked example — top 3 questions

Visit for morning headaches, 3 weeks, home BP readings 150/95 on 4 mornings:
1. "My home blood pressure readings are on this sheet — could they be connected to the headaches, and do I need more checks?"
2. "Is any medicine or supplement on my list a possible cause?"
3. "Which signs mean I should go to the emergency room instead of waiting?"

Related: `medication-schedule` · `annual-checkup` · `sleep-log` · `meeting-prep-card` in `personal-life`.
