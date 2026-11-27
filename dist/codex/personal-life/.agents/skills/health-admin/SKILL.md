---
name: health-admin
description: Use for checkups, doctors, medicine, sleep, exercise; no diagnosis
argument-hint: '<checkup|doctor|medicine|sleep|exercise> [age, scheme or reason]'
---

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
