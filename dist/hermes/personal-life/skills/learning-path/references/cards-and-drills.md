# Cards and question drills (for exam notes)

Open when the user asks for flashcards, a quiz without the answer, or a deck keeps failing the same cards. This covers certification exams and other exams (school and university notes).

> **One rule:** fewer cards that are right beat many cards that are guessed. A card with no source the agent is unsure of is marked `(ยังไม่ได้ตรวจ)`, and 8 sure cards are better than 20 with 5 wrong.

Two tools for the same goal: cards to remember, and a question drill to understand.

## Not for

- Learning a new technology through a real project → `learning-path`
- Understanding one English paragraph or error message → `english-tech-reading.md`
- A child's homework check at home → `family-care`

## 1 · Writing cards

1. **One idea per card.** Two facts on one card = two cards.
2. **The front is a question**, not a topic. "S3 Standard-IA เหมาะกับข้อมูลแบบไหน" — not "S3 storage classes".
3. **The back is the rule in 1–2 sentences**, not a paragraph. Add one short example if it helps.
4. **Every card names its source**: the user's note, the page of the exam guide, the official docs URL. Facts the agent adds from its own knowledge with no source are marked `(ยังไม่ได้ตรวจ)` until the user checks them.
5. **Cards from mistakes first.** A wrong answer in a practice exam becomes a card before anything else (`learning-path` → `references/cert-prep.md` step 7). A miss inside a drill that is still running becomes a card only after the user reaches the answer (section 3 step 4); until then no card, padded or `(ยังไม่ได้ตรวจ)`, may carry that answer.
6. Keep cards as markdown, one file per subject (`kb/cards/aws-saa.md` if `personal-kb` is used), one card per line: `Q: … | A: … | src: … | box: 1 | next: 2026-11-11`. Anki import works from the same lines.

## 2 · Box schedule without an app

The intervals are in `learning-path` → `references/cert-prep.md` step 6 (the only review schedule in this skill). A card that falls back down more than twice is not a memory problem; it goes to the drill in section 3. The user's spaced repetition system (SRS) app (Anki) may use its own schedule instead; do not fight it.

## 3 · Question drill (Socratic)

1. **Ask a scenario, not a definition.** "บริษัทเก็บ log 7 ปี เปิดดูปีละครั้ง เลือก storage class อะไร เพราะอะไร".
2. **Wrong answer → no answer key.** Ask back so the gap shows ("ถ้าต้องเปิดดูภายใน 1 นาทีล่ะ ยังเลือกตัวเดิมไหม").
3. **Right answer, loose reason → not passed yet.** Ask for the reason in one sentence.
4. **Give the answer only** when the user has reached it, or is truly stuck after three narrowing questions. Then explain in 2–3 sentences and make a card.
5. **One exception:** if the user says something that contradicts the notes they gave, quote the line from their notes back right away.
6. Stop after 10–15 questions or 20 minutes. Close with: what was solid, the 2–3 gaps, the cards made.

## Check before sending

- [ ] Every card: one idea, question on the front, 1–2 sentence back, source named
- [ ] Unsourced cards marked `(ยังไม่ได้ตรวจ)` · no card count padded to a target
- [ ] In a drill, no answer given before the user reached it or three narrowing questions passed

Worked example (notes to 9 cards and a drill on NAT gateway): [cards-example.md](cards-example.md)
