<!-- merged from skill `cert-prep` on 2026-11-27 · description was: Use when preparing for an exam or a cloud or developer certification, or making flashcards and quizzes for one -->
# Certification Prep

Study what the exam guide weighs, prove it with practice scores, and book the date once the scores are steady.

## Quiz or cards only (no plan needed)

The user is mid-quiz, says "ถามฉันหน่อย อย่าเพิ่งเฉลย", or asks for cards from notes → do this, skip the workflow:

1. **Wrong answer → no answer key.** Do not say the right answer. Ask one narrowing question back so the gap shows. Give the answer only once the user reaches it, or after three narrowing questions. Exception: whenever what the user says contradicts a line in their own notes, quote that line back right away.
2. **No card may carry the answer to the open quiz question** until the user reaches it.
3. **Cards come from the notes.** One idea per card, question on the front, source on every card. Never pad to a requested count: make fewer and say why, or mark each card not from the notes `(ยังไม่ได้ตรวจ)`.

Full card rules and the drill → [references/cards-and-drills.md](cards-and-drills.md)

## Workflow

1. **Get the official exam guide.** Download it from the vendor's page, not from a course site. Record the exam code and version (for example SAA-C03), the domains and their weights, the question count, the time limit, the passing score and the price. The current facts for common exams are in [references/exam-facts.md](exam-facts.md). Re-check them on the vendor page, because exam versions change
2. **Gap map.** For each domain, the user rates themselves 0–3 (0 = never heard of it, 3 = do it at work). **Priority = weight × (3 − rating)**. Study the highest priority first
3. **Baseline practice exam** in week 1, before studying, timed. This is the real gap map. The self-rating is only a guess
4. **Week-by-week plan.** Use the template in the plan-template reference (see "Gap map and plan template"). Size (default, not yet measured): 6–10 hours a week for 4–8 weeks for an associate-level exam with some experience. Double it for a first exam in a new area. Before writing it:
   - **Check the hours against the real week.** After the user gives hours per week, ask one more question: "สัปดาห์ปกติมีอะไรอยู่แล้วบ้าง (งาน ลูก เดินทาง ออกกำลัง)". Then say whether the number looks realistic or tight. No answer → write in the plan that it assumes those hours, and re-check at the end of week 2 against hours actually done
   - **Split the whole plan in three phases** (default, not yet measured): learn ~60% · practice exams ~30% · weak-domain review ~10%. Weak domains from the gap map get about twice the hours of strong ones
   - **Supplement or replace?** If the user already follows a course with its own calendar (Udemy, a bootcamp, a tutoring school), ask whether this plan adds to it or replaces it. Never run two full syllabi side by side
   - **Crash mode when under 4 weeks remain:** say plainly there will be gaps. Study only the highest-weight domains from the exam guide, take a practice set every day, and keep the last 2–3 days light (review cards, no new full exams)
5. **Each study session**: read or watch (40%) → hands-on lab (40%) → write flashcards from your mistakes (20%) (default split, not yet measured)
6. **Cards and review** (one schedule only: the box schedule below). Write cards from the user's notes and mistakes as one line each: `Q: … | A: … | src: … | box: 1 | next: 2026-11-11`. One idea per card, a question on the front, a source on every card, and unsourced facts marked `(ยังไม่ได้ตรวจ)`. 8 sure cards beat 20 guessed ones. 15 minutes a day beats a 3-hour weekend cram. Review with five boxes (default intervals, not yet measured):

   | Answer | Card moves to | Next review |
   |---|---|---|
   | Right | one box up | box 2 → +1 day · 3 → +3 · 4 → +7 · 5 → +21 |
   | Half right | stays | +1 day |
   | Wrong | one box down | again in about 4 hours |

   Anki or any spaced repetition system (SRS) app may use its own schedule instead; do not fight it. Full card rules and the Socratic question drill ("quiz me, don't tell me the answer") → [references/cards-and-drills.md](cards-and-drills.md)
7. **Practice-exam loop**: 1 full timed exam per week. For **every** wrong *and* every guessed answer, write why the right answer is right and why yours was wrong, then make 1 card. Track the score per domain
8. **Booking rule**: book the exam when **2 practice exams in a row** score at least **10 points above** the pass mark (default margin, not yet measured) (for example ≥ 82% where 72% is needed), with no domain below the pass mark. Book 2–3 weeks out, so the date creates focus
9. **Final week**: no new topics. Weak-domain review, 1 last practice exam 3 days before, then the exam-day checklist below
10. **After**: record the result, the score per domain and the renewal date in `learning-log.md`, and set a renewal reminder 3 months before expiry

## Gap map and plan template

Worked gap map (AWS SAA-C03) and the week-by-week plan file to copy to `cert/<exam-code>-plan.md` → [references/plan-template.md](plan-template.md)

## Hands-on labs — rules

- Labs run in a **sandbox account with a budget alert** (AWS Budgets, Azure cost alert or a Google Cloud Platform (GCP) budget at ฿300 or less). Delete everything at the end of the session
- For Certified Kubernetes Administrator (CKA) and Certified Kubernetes Application Developer (CKAD), practise only in a terminal with `kubectl` against a real cluster (kind, minikube or a killer.sh session). The exam is all hands-on, and the speed comes from typing, not reading
- At least 1 lab per domain, taken from the exam guide's task statements

## Exam-day rules (online proctoring)

- Run the vendor's **system check** on the same computer and network 2–3 days before
- A clean desk, no second monitor connected, the phone out of reach, the door closed, and nobody walking in. A family member entering can void the exam
- Valid identity document (ID) matching the registered name **exactly**, including the order of first and last name. Check this when booking
- Log in 15–30 minutes early for the check-in photos (รอยืนยัน: time per vendor)
- Time management: mark and move on at about 2 minutes per question for multiple choice (default, not yet measured; check the exam's question count and time limit). For performance-based exams (CKA/CKAD), skip any task worth little that is taking more than 2× its share of the time
- Test centre as an alternative if the home has unreliable internet or no quiet room

## Rules

- The official exam guide outranks every course, video and blog
- Practice scores are measured, not felt. Never book on "I feel ready"
- Dumps (leaked real questions) breach the candidate agreement and can lead to the certification being revoked. Refuse to use them
- Certifications prove a baseline. Pair each one with a small project (see `tech-growth`) so the skill shows in a portfolio

Related: `learning-path` (for skills beyond the exam), `tech-growth`, `english-tech-reading.md` (for long, conditional English questions), and `product-planning` in `software-development` for Scrum context.

## References

- [`cards-and-drills.md`](cards-and-drills.md) — card rules, box schedule notes, question drill; open when making cards or quizzing
- [`cards-example.md`](cards-example.md) — worked example, notes to cards and a drill
- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources
