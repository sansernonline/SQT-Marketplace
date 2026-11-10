---
name: study-drill
description: Use when the user wants flashcards from notes, or to be quizzed for an exam without being told the answer (ทำบัตรคำ, ติวสอบ, quiz me).
---

# Study Drill (บัตรคำและซ้อมถามตอบ)

> **One rule:** fewer cards that are right beat many cards that are guessed. A card with no source the agent is unsure of is marked `(ยังไม่ได้ตรวจ)`, and 8 sure cards are better than 20 with 5 wrong.

Two tools for the same goal: cards to remember, and a question drill to understand. Works for cloud certifications, English for work, Thai professional licence exams and school or university exams.

## Use when / not when

| Situation | Use |
|---|---|
| "ทำบัตรคำจากโน้ตนี้ให้หน่อย" · "ถามฉันหน่อย อย่าเพิ่งเฉลย" · a deck keeps failing the same cards | this skill |
| Planning the weeks before a cert exam, booking rule, exam day | `cert-prep` (sends card writing here) |
| Learning a new technology through a real project | `learning-path` |
| Understanding one English paragraph or error message | `english-tech-reading` |
| A child's homework check at home | `kids-school` |

## 1 · Writing cards

1. **One idea per card.** Two facts on one card = two cards.
2. **The front is a question**, not a topic. "S3 Standard-IA เหมาะกับข้อมูลแบบไหน" — not "S3 storage classes".
3. **The back is the rule in 1–2 sentences**, not a paragraph. Add one short example if it helps.
4. **Every card names its source**: the user's note, the page of the exam guide, the official docs URL. Facts the agent adds from its own knowledge with no source are marked `(ยังไม่ได้ตรวจ)` until the user checks them.
5. **Cards from mistakes first.** A wrong answer in a practice exam becomes a card before anything else (`cert-prep` step 7).
6. Keep cards as markdown, one file per subject (`kb/cards/aws-saa.md` if `personal-kb` is used), one card per line: `Q: … | A: … | src: … | box: 1 | next: 2026-11-11`. Anki import works from the same lines.

## 2 · Box schedule without an app

Five boxes (default intervals, not yet measured; from the source below):

| Answer | Card moves to | Next review |
|---|---|---|
| Right | one box up | box 2 → +1 day · 3 → +3 · 4 → +7 · 5 → +21 |
| Half right | stays | +1 day |
| Wrong | one box down | again in about 4 hours |

A card that falls back down more than twice is not a memory problem; it goes to the drill in section 3. The user's SRS app (Anki) may use its own schedule instead; do not fight it.

## 3 · Question drill (Socratic)

1. **Ask a scenario, not a definition.** "บริษัทเก็บ log 7 ปี เปิดดูปีละครั้ง เลือก storage class อะไร เพราะอะไร".
2. **Wrong answer → no answer key.** Ask back so the gap shows ("ถ้าต้องเปิดดูภายใน 1 นาทีล่ะ ยังเลือกตัวเดิมไหม").
3. **Right answer, loose reason → not passed yet.** Ask for the reason in one sentence.
4. **Give the answer only** when the user has reached it, or is truly stuck after three narrowing questions. Then explain in 2–3 sentences and make a card.
5. **One exception:** if the user says something that contradicts the notes they gave, quote the line from their notes back right away.
6. Stop after 10–15 questions or 20 minutes. Close with: what was solid, the 2–3 gaps, the cards made.

## Worked example

The user pastes 2 pages of AWS VPC notes and asks for cards. Output: 9 cards, each with `src: note p.1` or `p.2`; 2 cards added from general knowledge are marked `(ยังไม่ได้ตรวจ)` with the AWS docs page to check. The next day the user misses "NAT gateway vs internet gateway" twice → a drill: "instance ใน private subnet ต้องโหลดแพตช์จากเน็ต ต้องผ่านอะไร" → the user answers "internet gateway" → asked back "แล้วจากเน็ตจะเปิด connection เข้ามาที่ instance ได้ไหม" → the user reaches NAT on the second question → card rewritten from the user's own words.

## Check before sending

- [ ] Every card: one idea, question on the front, 1–2 sentence back, source named
- [ ] Unsourced cards marked `(ยังไม่ได้ตรวจ)` · no card count padded to a target
- [ ] In a drill, no answer given before the user reached it or three narrowing questions passed

## Source

Ideas from anthropics/claude-for-legal `law-student/skills/flashcards` and `law-student/skills/socratic-drill` (Apache-2.0, rewritten without the US law examples, viewed 2026-11-10). Box intervals are that skill's defaults, not measured by us.

Related: `cert-prep` · `english-tech-reading` · `personal-kb`
