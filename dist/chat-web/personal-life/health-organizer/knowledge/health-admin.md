# skill: health-admin

Use for checkups, doctors, medicine, sleep, exercise; no diagnosis

# health-admin — checkups, doctor visits, medicine, sleep and exercise paperwork

> **One rule:** This skill organises and copies facts. It never diagnoses, never suggests a dose, and never changes a medicine.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "When should I book my yearly checkup? Which package is covered?" | [`references/annual-checkup.md`](references/annual-checkup.md) |
| "I have a doctor visit, help me write down what to say" | [`references/doctor-visit-prep.md`](references/doctor-visit-prep.md) |
| "Build a daily medicine schedule from my prescription" | [`references/medication-schedule.md`](references/medication-schedule.md) |
| "I sleep badly, help me keep a sleep diary" | [`references/sleep-log.md`](references/sleep-log.md) |
| "I want to start or restart regular exercise" | [`references/exercise-plan.md`](references/exercise-plan.md) |

The lab results tracker is in `references/results-tracker.md`. The emergency card is in `references/emergency-card.md`.

## Steps every part shares

1. Start from the paper in front of the user: the label, the prescription, the lab report or the doctor's note.
2. Copy values exactly as printed. Do not convert units or round.
3. Turn worries into questions for the doctor or pharmacist.

## Check before done

- Never diagnose, and never say a result is normal or abnormal. Only the report's own flag (H, L or `*`) is recorded.
- Never suggest a dose, a change, a skip, a stop or a double. Dose questions go to the pharmacist (เภสัชกร) or the doctor.
- Emergency signs (chest pain, stroke signs, severe breathing trouble, heavy bleeding, overdose) → **1669 now**, before anything else in the answer.
- Say once that this is general information, not medical advice.
- Medicines are copied from the label word for word. A label that is unclear is marked `[ถามเภสัชกร]`.
- Health details stay private. A shared family table shows "ยา ตามตาราง" and a time, never drug names.
- A whole checkup cycle or medicine routine with several steps → playbooks `superuser/references/playbook-checkup-cycle.md`, `playbook-doctor-visit.md` or `playbook-medication-routine.md`.


## reference: annual-checkup.md

<!-- merged from skill `annual-checkup` on 2026-11-27 · description was: Use when planning a yearly checkup in Thailand -->
# Annual Checkup

Plan what to check, use the free rights you already pay for, and keep every year's numbers in one table.

General information, not medical advice — the doctor decides which tests you need; rights lists change, so verify before booking.

## Step 1 — which scheme are you under

| Scheme | Who | Where to check / book |
|---|---|---|
| ประกันสังคม มาตรา 33 / 39 (Social Security Office, SSO) | Employees and former employees continuing contributions | Hospitals in the SSO checkup programme — ask the registered hospital; สายด่วน 1506 |
| บัตรทอง (หลักประกันสุขภาพแห่งชาติ, สปสช.) | Thai citizens without other public cover | Registered primary unit, health centre (รพ.สต.), pharmacies or clinics in the network for some services; สายด่วน 1330 |
| ข้าราชการ (กรมบัญชีกลาง) | Civil servants and family | Government hospitals; annual checkup reimbursement rules (รอยืนยัน — check with the agency's HR) |
| Private insurance / employer package | Per policy | Read the policy's checkup benefit |

Preventive and health-promotion (P&P) services from สปสช. are generally available to all Thai citizens regardless of scheme (รอยืนยัน — confirm with 1330 for your case).

## Step 2 — free SSO checkup items (มาตรา 33 and 39, 14 items, from 1 Jan 2567 / 2024)

| Item | Age band and frequency |
|---|---|
| Hearing screening (finger rub test) | 15+ · yearly |
| Breast exam by doctor/health worker + self-exam teaching | 30–39 every 2 years · 40+ yearly |
| Eye exam by ophthalmologist (includes Snellen chart and eye pressure) | 40–54 every 2 years · 55+ yearly |
| Complete blood count (CBC) | 15–34 once · 35+ yearly |
| Urinalysis (UA) | 35+ · yearly |
| Fasting blood sugar (FBS) | 35+ · yearly |
| Kidney function (creatinine, Cr, and eGFR) | 35+ · yearly |
| Cholesterol (total and HDL) | 20–34 every 5 years · 35+ yearly |
| Hepatitis B screening (HBsAg) | Born before 1992 (พ.ศ. 2535) · once |
| Cervical cancer — Pap smear | 30+ · every 3 years |
| Cervical cancer — VIA | 30–55 every 5 years · over 55 Pap smear only (the SSO infographic says 30–55; some articles say 30–54 — รอยืนยัน) |
| Cervical cancer — HPV DNA test (new in 2567) | 30+ · every 5 years |
| Colorectal cancer — FIT (faecal immunochemical test, replaces FOBT) | 50+ · yearly |
| Chest X-ray | 15+ · every 3 years |

Rows with only 2 sources — HPV DNA, chest X-ray, CBC, UA, FBS, kidney, cholesterol, hepatitis B, hearing, breast, eye — stay (รอยืนยัน): tell the user and confirm with the hospital or 1506 before booking.

Sources and check dates: [references/sources.md](sources.md)

## Step 3 — gold card (บัตรทอง) preventive services, working age

Cancer screening rows — nhso.go.th pages did not open on 2026-10-26, so all three stay (รอยืนยัน) with 1330:

| Item | Age and interval |
|---|---|
| Cervical cancer (Pap smear, VIA or HPV DNA, self-sampling allowed) | 30–59 · once every 5 years (a ministry document says up to 59 years 11 months) |
| Colorectal cancer — FIT | 50–70 · once every 2 years (FIT is open under all schemes, not only the gold card; an older สปสช. page says 50+ yearly) |
| Oral cancer screening | 40+ · yearly |

Other working-age preventive services the สปสช. lists (age and interval not confirmed for this check — ask 1330) (รอยืนยัน): blood pressure check · diabetes blood screening · cardiovascular risk screening · smoking, alcohol and substance risk screening · HIV screening · diphtheria–tetanus vaccine · breast self-exam teaching · family planning and contraception · iron supplement for women of reproductive age · health counselling.

Sources and check dates: [references/sources.md](sources.md)

## Step 4 — general items by band (to discuss with the doctor)

Beyond the free list, private packages often add liver function, uric acid, glycated haemoglobin (HbA1c), lipid profile, ultrasound, electrocardiogram (ECG), mammogram, prostate-specific antigen (PSA) or thyroid tests. More tests are not automatically better — ask the doctor which add-ons fit your age, family history and risk. To compare packages (government benefit vs private A, B), score them with `decision-desk/decision-scoring`: `node decide.mjs score packages.json`, from [references/package-score-example.json](package-score-example.json) (its numbers are made up, replace them with the quotes in hand). Criteria and weights are defaults, not yet measured: out-of-pocket price (low, 0.5) · count of the doctor-recommended items included (high, 0.35) · days to get results (low, 0.15). Iron rule (กฎเหล็ก): the package must include every item the doctor recommended for the user's age band (the example uses a minimum count of 6), otherwise it is dropped. When the script says `ยังไม่นิ่ง`, it does not pick: the user decides, with the doctor. The score compares packages only; it never judges a test result. The example is built to tie on purpose: the two private packages both get 50 and the script says `ยังไม่นิ่ง` (it does not pick). A tie is the right answer when the numbers cannot decide: do not change the weights until one wins. Ask the doctor which listed item the user needs most (the one the cheaper package lacks or the faster package includes), then choose on that, and keep the reason in the user's own note. Add-ons commonly discussed by age band:

| Band | Commonly discussed with the doctor |
|---|---|
| 18–39 | Blood pressure every visit, weight/waist, lipids per risk, cervical screening from 30, vaccines (tetanus booster, hepatitis B if not immune) |
| 40–54 | + blood sugar, lipids, eye exam, breast exam yearly; family history of early heart disease or cancer may change the plan |
| 55+ | + kidney function, urinalysis, vision, fall risk and bone health; hearing check at every age from 15; colorectal screening is a 50+ item (see Step 2) |
| 65+ | + vaccines for older adults (influenza yearly, pneumococcal — ask), memory and medication review |

## Step 5 — results table (track trends)

Copy values **exactly as printed**, including the unit and the lab's reference range. Template → [references/results-tracker.md](results-tracker.md).

## Workflow

1. Ask: age, sex, scheme, family history the user wants to note, last checkup date.
2. List the free items due this year (Steps 2–3) and mark "due / not due / ask".
3. Booking checklist: hospital in the programme, bring บัตรประชาชน, fasting 8–12 hours if blood sugar or lipids are taken (confirm with the hospital), previous results, medicine list.
4. After the checkup: log results; mark any value outside the printed range as **"ask doctor"** — no interpretation.
5. Set a reminder for next year's date and for any follow-up the doctor ordered.

Related: `doctor-visit-prep.md` (questions about results) · `medication-schedule.md` · `family-legal` in `personal-life` (store the PDF reports) · `exercise-plan.md`.

## เรียกเป็นคำสั่ง

`/personal-life:health-admin <plan|log|trend> [age] [sex] [scheme — sso|gold|civil|private]`

Run the `health-organizer` agent with the `health-admin` skill: **the user's request**

- `plan` — list the checkup items for the age/sex band, mark which are free under the user's scheme (verify), and draft the booking checklist
- `log` — add this year's results (value, unit, reference range printed on the report) to the results table
- `trend` — show the results table across years and list questions for the doctor; never label a result normal or abnormal

Emergency symptoms → 1669 first.

## References

- [`results-tracker.md`](results-tracker.md) — results table template (Step 5)
- [`sources.md`](sources.md) — sources and check dates for Steps 2–3; open before citing a right or an interval


## reference: doctor-visit-prep.md

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


## reference: emergency-card.md

# Emergency card · doctor-visit-prep

## Emergency card — one page, kept separately

Not the visit card: this one lives in the wallet, in the phone's lock-screen medical info (Medical ID on iPhone, Emergency information on Android), and with the person who would ride in the ambulance. Update it whenever `medication-schedule.md` changes.

```
Name · date of birth · blood group (from a lab result, not memory)
Conditions: ___            Allergies (medicine / food / latex) and reaction: ___
Current medicines — name, strength, how often (copied from labels): ___
Implants, pacemaker, pregnancy possible: ___
Scheme and chosen hospital: ประกันสังคม / บัตรทอง / ข้าราชการ / insurer + policy number
Emergency contacts (2): name · relation · phone
Language the person is most comfortable with: ___
```

No ID-card number on it — the card itself is in the same wallet. Half a page in Thai, half in English if the person travels.


## reference: exercise-plan.md

<!-- merged from skill `exercise-plan` on 2026-11-27 · description was: Use when starting or restarting regular exercise -->
# Exercise Plan

Get from "not exercising" to the World Health Organization (WHO) weekly guidance safely, over about 8–12 weeks.

General information, not medical advice — with a health condition, ask your doctor or a physical therapist (นักกายภาพบำบัด) first.

## The target — WHO 2020 guidance

| Group | Aerobic per week | Muscle strengthening | Extra |
|---|---|---|---|
| Adults 18–64 | 150–300 min moderate, **or** 75–150 min vigorous, or a mix | All major muscle groups, ≥ 2 days | Limit sitting; replace with any activity |
| Adults 65+ | Same as above | ≥ 2 days | Varied balance + strength activity ≥ 3 days, to prevent falls |
| Pregnancy / postpartum (no contraindication) | ≥ 150 min moderate | Include gentle strengthening | Follow the obstetrician's advice |

Sources and check date: [references/sources.md](exercise-plan/sources.md)

Intensity without a watch — **talk test**: moderate = you can talk but not sing; vigorous = only a few words between breaths.

## See a doctor before starting if

- Known heart disease, high blood pressure, diabetes, kidney disease, or recent surgery
- Chest pain, dizziness or fainting with exertion, or unexplained shortness of breath
- Pregnant, or joint/back problems that hurt now
- Age 65+ and inactive, or any medicine that affects heart rate or blood sugar

Answering "yes" does not mean "don't exercise" — it means get the doctor's limits first and bring them to `doctor-visit-prep.md`.

Stop and seek care (1669 if severe) for: chest pain or pressure, fainting, severe breathlessness that does not settle with rest, sudden one-sided weakness.

## Beginner progressive plan (walking + basic strength)

| Week | Aerobic (brisk walk, cycle, swim) | Strength (bodyweight) | Weekly aerobic total |
|---|---|---|---|
| 1 | 10 min × 5 days | 1 set × 8 reps, 2 days | 50 min |
| 2 | 15 min × 5 | 1 × 10, 2 days | 75 |
| 3 | 20 min × 5 | 2 × 8, 2 days | 100 |
| 4 | 20 min × 5 (recovery week, same as wk 3) | 2 × 8, 2 days | 100 |
| 5 | 25 min × 5 | 2 × 10, 2 days | 125 |
| 6 | 30 min × 5 | 2 × 12, 2 days | **150 — guidance reached** |
| 7–8 | 30 min × 5, add 2 × 1-min faster intervals | 3 × 10, 2–3 days | 150+ |
| 9–12 | 35–45 min × 5 or mix in vigorous days | progress: harder variation | 175–225 (+10–20% a week) |

Strength set (no equipment): wall or knee push-up · chair squat (sit-to-stand) · glute bridge · standing calf raise · plank on knees (10–30 s) · bird-dog.

Progression rule: from a low base (under 150 min a week) add about 25 min a week at most, as in weeks 1–6; from 150 min up, increase total weekly time by about 10–20% at most; repeat a week if anything still hurts the next day; every 4th week hold steady.

## Office worker mobility (every 45–60 min of sitting, 2–3 min)

1. Stand up, walk to get water or use stairs.
2. Neck: slow ear-to-shoulder, 5 each side.
3. Shoulder rolls backward × 10; chest-opener with hands clasped behind × 20 s.
4. Wrist and finger stretches × 20 s each (keyboard / mouse).
5. Standing hip-flexor stretch, 20 s each side.
6. Calf raises × 15.

Screen rule 20-20-20: every 20 minutes look at something about 6 metres (20 feet) away for 20 seconds.

## Thai context tips

- Heat: exercise early morning or evening; drink before you are thirsty; skip outdoor sessions on very high heat-index days or when PM2.5 is high (check the Air4Thai app from กรมควบคุมมลพิษ) — move indoors.
- Free options: public parks (สวนลุมพินี, สวนเบญจกิตติ), community stadiums, stairs at the condo or office.

## Workflow

1. Screen with the "see a doctor first" list.
2. Ask the user: current activity, available days and times, place (home, gym, park), any pain.
3. Pick a start week from the table (inactive → week 1).
4. Output the weekly schedule as a calendar-style table plus a habit tracker.
5. Review every 2 weeks: completed sessions, any pain, adjust.

Habit tracker template:

| Week | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Total min | Notes (pain, energy) |
|---|---|---|---|---|---|---|---|---|---|

Related: `sleep-log.md` (sleep affects recovery) · `doctor-visit-prep.md` · `annual-checkup.md`.


## reference: medication-schedule.md

<!-- merged from skill `medication-schedule` on 2026-11-27 · description was: Use when building a daily medicine schedule, no dosing advice -->
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

Do not count days by hand: write a JSON file `{"today": "YYYY-MM-DD", "refills": [{"name", "on_hand", "per_day" (from the label only), "start_date", "remind_days": 7}]}` with one object per medicine, and run `node skills/family-legal/scripts/due-dates.mjs --refill <file.json>` (example: `skills/family-legal/scripts/example-refill.json`). It returns days of supply, the last day with medicine, the reminder date and a status; `per_day` of 0 is refused. It never suggests a dose.

Worked example (this is the script's example file): 60 tablets on hand, label says 1 tablet twice a day → 2 per day → 30 days left → set reminder at day 23. Hospital follow-up appointments (ใบนัด) often refill at the visit — check the ใบนัด date is before the medicine runs out.

## Allergy and side-effect list

| Substance (medicine, food, latex) | Reaction | When | Confirmed by doctor? | Card / record at hospital? |
|---|---|---|---|---|

Keep a photo of the hospital's drug-allergy card (บัตรแพ้ยา) if one was issued; show it at every new hospital, clinic and pharmacy.

## Workflow

1. Photograph every label and the prescription slip.
2. Build the medicine list and schedule table by copying labels.
3. Mark anything unclear `[ถามเภสัชกร]`; collect those questions for `health-admin`.
4. Set phone reminders for each column used; add refill reminders.
5. Review at every doctor visit — remove stopped medicines, add new ones exactly as prescribed.
6. For an older family member: one copy on the fridge, one on the caregiver's phone.

Related: `health-admin` · `family-legal` in `personal-life` (keep the allergy card and prescriptions) · `scam-check` in `trading-finance` (miracle-cure sellers).


## reference: question-bank.md

# Question bank and worked example · doctor-visit-prep

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

Thai phrasing if needed: "ขอถามคำถามสั้น ๆ 3 ข้อได้ไหมคะ/ครับ" · "อาการแบบไหนที่ต้องรีบกลับมาหรือไปห้องฉุกเฉินคะ/ครับ" · "ยานี้ทานนานแค่ไหน และต้องระวังอะไรบ้างคะ/ครับ"


## Worked example — top 3 questions

Visit for morning headaches, 3 weeks, home blood pressure (BP) readings 150/95 on 4 mornings:
1. "My home blood pressure readings are on this sheet — could they be connected to the headaches, and do I need more checks?"
2. "Is any medicine or supplement on my list a possible cause?"
3. "Which signs mean I should go to the emergency room instead of waiting?"


## reference: results-tracker.md

# Checkup Results Tracker

Copy each value exactly as printed on the lab report. Do not convert units. Do not label results normal or abnormal — the "flag" column only records what the **report itself** marks (H / L / *) or "outside printed range".

## Results by year

| Test | Unit | Lab's printed range | 2024 | 2025 | 2026 | Report flag | Question for the doctor |
|---|---|---|---|---|---|---|---|
| Weight | kg | — | | | | | |
| Waist | cm | — | | | | | |
| Blood pressure | mmHg | — | | | | | |
| Fasting blood sugar (FBS) | mg/dL | | | | | | |
| HbA1c (if done) | % | | | | | | |
| Total cholesterol | mg/dL | | | | | | |
| HDL | mg/dL | | | | | | |
| LDL (if done) | mg/dL | | | | | | |
| Triglycerides (if done) | mg/dL | | | | | | |
| Creatinine (Cr) | mg/dL | | | | | | |
| eGFR (if printed) | mL/min/1.73m² | | | | | | |
| Uric acid (if done) | mg/dL | | | | | | |
| SGOT / AST (if done) | U/L | | | | | | |
| SGPT / ALT (if done) | U/L | | | | | | |
| Hemoglobin (CBC) | g/dL | | | | | | |
| Urinalysis | text | | | | | | |
| FIT (faecal immunochemical test; older reports say FOBT) | pos/neg | | | | | | |
| Pap / VIA | result text | | | | | | |
| HPV DNA test (if done) | result text | | | | | | |
| Chest X-ray | result text | | | | | | |
| Vision / hearing | result text | | | | | | |

Different hospitals may use different ranges and units — note the hospital name per year:

| Year | Hospital / clinic | Scheme used | Fasting? | Report file name |
|---|---|---|---|---|
| | | | | |

## Worked example — how to write the question

FBS 2024 = 98, 2025 = 104, 2026 = 109 mg/dL; 2026 report flags H, printed range 70–100.
Write: **"FBS rose each year (98 → 104 → 109) and 2026 is flagged above the printed range. Do I need more tests or a follow-up date, and is there anything I should change?"**
Do not write "I am pre-diabetic" — that is the doctor's call.


## reference: sleep-log.md

<!-- merged from skill `sleep-log` on 2026-11-27 · description was: Use when sleeping badly and keeping a sleep diary, no diagnosis -->
# Sleep Log

General information, not medical advice — ask a doctor about persistent sleep problems; never start, stop or change sleep medicine on your own.

## How much sleep

Adults generally need **7 or more hours** a night on a regular basis (American Academy of Sleep Medicine and Sleep Research Society consensus, 2015). Individual need varies.

Sources and check date (2026-10-06): [references/sources.md](sleep-log/sources.md)

## Sleep diary — fill every morning (2 weeks)

| Date | Bed time | Lights off | Minutes to fall asleep (guess) | Times woke up | Total awake in night (min) | Final wake time | Out of bed | Quality 1–5 | Naps (time, min) | Caffeine after 14:00 | Alcohol | Exercise | Screen in bed | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Guess times — do not watch the clock at night (that worsens sleep). Wearables are fine as an extra column, not a replacement.

## Simple numbers from the diary

- **Time in bed** = out of bed − lights off
- **Total sleep** = time in bed − minutes to fall asleep − awake in night − (final wake to out of bed)
- **Sleep efficiency** = total sleep ÷ time in bed × 100 — the number to show the doctor, not to self-diagnose

Worked example: lights off 23:00, out of bed 07:00 → 480 min in bed. Fell asleep in 40 min, awake 50 min in the night, lay in bed 20 min after waking → total sleep 370 min (6 h 10 min). Efficiency 370 ÷ 480 = 77%.

## Sleep hygiene checklist

- [ ] Same wake-up time every day, including weekends (±1 hour)
- [ ] Bedroom dark, quiet, cool — find your own comfortable setting and keep it steady
- [ ] No caffeine (coffee, tea, energy drinks, ชาเย็น) after about 14:00
- [ ] Alcohol not used as a sleep aid — it fragments the second half of the night
- [ ] Screens off 30–60 min before bed, or at least night mode and low brightness
- [ ] Heavy meals finished 2–3 hours before bed
- [ ] Exercise most days, finished a few hours before bed
- [ ] Bed only for sleep — if awake about 20 minutes, get up, do something calm in dim light, return when sleepy
- [ ] Daylight in the morning (10–30 min)
- [ ] Naps short (≤ 20–30 min) and before 15:00

## Bring to the doctor if

- Sleep problems at least 3 nights a week for 3 months, or affecting work or driving
- Loud snoring, gasping or pauses in breathing noticed by a partner
- Falling asleep while driving or in meetings
- Uncomfortable urge to move legs at night
- Low mood, anxiety, or thoughts of self-harm (สายด่วนสุขภาพจิต 1323, 24 hours)

What to bring: the 2-week diary · medicine and supplement list (`medication-schedule.md`) · caffeine and alcohol amounts · shift-work schedule · partner's observations · your questions (`doctor-visit-prep.md`). Ask whether a sleep test (polysomnography, การตรวจการนอนหลับ) is needed — the doctor decides.

## Workflow

1. Copy the diary table; fill for 14 days.
2. Compute averages: bed time, wake time, total sleep, efficiency.
3. Tick the hygiene checklist; pick only **2** changes for the next 2 weeks.
4. Compare the next 2 weeks.
5. Any "bring to the doctor" item → `doctor-visit-prep.md`.

Related: `exercise-plan.md` · `doctor-visit-prep.md` · `weekly-review` in `personal-life`.


## reference: sources.md

# Sources · annual-checkup

## Step 3 — gold card preventive services

ตรวจล่าสุด 2026-10-26 (nhso.go.th returned 404/500; search snippets from nhso.go.th agree on FIT 50–70 every 2 years) · แหล่ง (cancer rows): https://www.thansettakij.com/health/wellbeing/557796 (2 มี.ค. 2566, สปสช.) · https://www.hfocus.org/content/2026/07/38619 (6 ก.ค. 2569, FIT) · https://www.khaosod.co.th/politics/news_7500428 (9 ก.พ. 2566) · nhso.go.th could not list the full working-age items, so verify with สปสช. 1330 or the สปสช. app / LINE @nhso.

## Step 2 — SSO checkup items

Age bands and intervals match the official SSO infographic (sso.go.th, undated) and PPTV; ThaiPBS and Bangkokbiznews confirm the 14 items but not the bands. Rows with only 2 sources — HPV DNA, chest X-ray, CBC, UA, FBS, kidney, cholesterol, hepatitis B, hearing, breast, eye — stay (รอยืนยัน): tell the user and confirm with the hospital or 1506 before booking. Pap smear 30+ every 3 years and FIT 50+ yearly have 3 sources. The 14 items and the start date (1 Jan 2567 / 2024) are confirmed by a government Public Relations Department (PRD) page that quotes the Social Security Office (SSO).

ตรวจล่าสุด 2026-10-26 · SSO infographic https://www.sso.go.th/wpr/assets/upload/images/sso/77cfae7b318fe6606167326d27a6c43f.jpg · แหล่งเดิม (ตรวจ 2026-10-22): https://radiochiangrai.prd.go.th/th/content/category/detail/id/36/iid/251114 (กรมประชาสัมพันธ์ ยืนยันกับสำนักงานประกันสังคม 17 ม.ค. 2567 — รายการ 14 ข้อ) · https://www.prachachat.net/hilight-prachachat/news-1566620 (17 พ.ค. 2567 — ช่วงอายุ) · https://www.thaipbs.or.th/news/content/340054 (16 พ.ค. 2567 — ช่วงอายุ) · https://www.ktc.co.th/article/healthy-beauty/healthy/social-security-health-care (อัปเดต 13 ส.ค. 2569) · official page to verify: sso.go.th
