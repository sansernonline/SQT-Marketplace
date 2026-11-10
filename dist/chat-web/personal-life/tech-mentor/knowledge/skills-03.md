# skill: cert-prep

Use when preparing for a cloud or developer certification (AWS, Azure, GCP, CKA, PSM). Week plan, practice exams.

# Certification Prep

Study what the exam guide weighs, prove it with practice scores, and book the date once the scores are steady.

## Workflow

1. **Get the official exam guide.** Download it from the vendor's page, not from a course site. Record the exam code and version (for example SAA-C03), the domains and their weights, the question count, the time limit, the passing score and the price. The current facts for common exams are in [references/exam-facts.md](references/exam-facts.md). Re-check them on the vendor page, because exam versions change
2. **Gap map.** For each domain, the user rates themselves 0–3 (0 = never heard of it, 3 = do it at work). **Priority = weight × (3 − rating)**. Study the highest priority first
3. **Baseline practice exam** in week 1, before studying, timed. This is the real gap map. The self-rating is only a guess
4. **Week-by-week plan.** Use the template in the plan-template reference (see "Gap map and plan template"). Size (default, not yet measured): 6–10 hours a week for 4–8 weeks for an associate-level exam with some experience. Double it for a first exam in a new area. Before writing it:
   - **Check the hours against the real week.** After the user gives hours per week, ask one more question: "สัปดาห์ปกติมีอะไรอยู่แล้วบ้าง (งาน ลูก เดินทาง ออกกำลัง)". Then say whether the number looks realistic or tight. No answer → write in the plan that it assumes those hours, and re-check at the end of week 2 against hours actually done
   - **Split the whole plan in three phases** (default, not yet measured): learn ~60% · practice exams ~30% · weak-domain review ~10%. Weak domains from the gap map get about twice the hours of strong ones
   - **Supplement or replace?** If the user already follows a course with its own calendar (Udemy, a bootcamp, a tutoring school), ask whether this plan adds to it or replaces it. Never run two full syllabi side by side
   - **Crash mode when under 4 weeks remain:** say plainly there will be gaps. Study only the highest-weight domains from the exam guide, take a practice set every day, and keep the last 2–3 days light (review cards, no new full exams)
5. **Each study session**: read or watch (40%) → hands-on lab (40%) → write flashcards from your mistakes (20%) (default split, not yet measured)
6. **Spaced repetition**: review cards on day 1, 3, 7, 14 and 30 after they are written (Anki or any spaced repetition system (SRS) app). 15 minutes a day beats a 3-hour weekend cram. How to write good cards, the box schedule without an app, and question drills in chat → `study-drill`
7. **Practice-exam loop**: 1 full timed exam per week. For **every** wrong *and* every guessed answer, write why the right answer is right and why yours was wrong, then make 1 card. Track the score per domain
8. **Booking rule**: book the exam when **2 practice exams in a row** score at least **10 points above** the pass mark (default margin, not yet measured) (for example ≥ 82% where 72% is needed), with no domain below the pass mark. Book 2–3 weeks out, so the date creates focus
9. **Final week**: no new topics. Weak-domain review, 1 last practice exam 3 days before, then the exam-day checklist below
10. **After**: record the result, the score per domain and the renewal date in `learning-log.md`, and set a renewal reminder 3 months before expiry

## Gap map and plan template

Worked gap map (AWS SAA-C03) and the week-by-week plan file to copy to `cert/<exam-code>-plan.md` → [references/plan-template.md](references/plan-template.md)

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
- Certifications prove a baseline. Pair each one with a small project (see `side-project-picker`) so the skill shows in a portfolio

Source for the real-week check, the three phases, crash mode and supplement-or-replace: ideas from anthropics/claude-for-legal `law-student/skills/study-plan` steps 2–3 (Apache-2.0, rewritten for cert exams, viewed 2026-11-10).

Related: `study-drill` (cards and drills), `learning-path` (for skills beyond the exam), `side-project-picker`, `english-tech-reading` (for long, conditional English questions), and `sprint-plan` in `software-development` for Scrum context.


## reference: exam-facts.md

# Exam facts for common certifications

Always re-check on the vendor page before booking. Exam versions, prices and pass marks change, and prices differ by country.

| Exam | Format | Questions | Time | Pass mark | Price (USD) | Valid for |
|---|---|---:|---:|---|---:|---|
| AWS Solutions Architect – Associate (SAA-C03 — aws.amazon.com shows no SAA-C04 on 2026-10-22; third-party sites claiming one are not confirmed) | Multiple choice / multiple response | 65 (50 scored + 15 unscored) | 130 min | 720 / 1000 (scaled, compensatory) | 150 | 3 years (รอยืนยัน) |
| Microsoft Azure Administrator (AZ-104) | Mixed, may include case studies | 40–60 | 100 min | 700 / 1000 | 165 (price varies by country, รอยืนยัน for Thailand) | 1 year, renewed by a free online assessment on Microsoft Learn (opens 6 months before expiry) |
| Certified Kubernetes Administrator (CKA) | Performance-based, live terminal, kubernetes.io/docs allowed | 15–25 tasks (รอยืนยัน) | 2 hours | 66% | 445 (includes 1 retake and 2 killer.sh simulator sessions) | 2 years |
| Certified Kubernetes Application Developer (CKAD) | Performance-based | (รอยืนยัน — not published) | 2 hours | 66% | 445 | 2 years |
| Google Cloud Associate Cloud Engineer | Multiple choice / multiple select | 50–60 | 2 hours | Not published | 125 | 3 years (source: cloud.google.com/learn/certification/cloud-engineer, ตรวจ 22 ต.ค. 2569) |
| Scrum.org Professional Scrum Master I (PSM I) | Multiple choice, multiple answer, true/false | 80 | 60 min | 85% | 200 | Does not expire. The attempt password does not expire either |

## Domain weights

**AWS SAA-C03**: Design Secure Architectures 30% · Design Resilient Architectures 26% · Design High-Performing Architectures 24% · Design Cost-Optimized Architectures 20%.

**CKA**: Troubleshooting 30% · Cluster Architecture, Installation & Configuration 25% · Services & Networking 20% · Workloads & Scheduling 15% · Storage 10%.

**AZ-104**: 5 domains — identities and governance, storage, compute, virtual networking, monitoring (weights: รอยืนยัน, take them from the current study guide).

ตรวจล่าสุด 2026-10-22 (SAA, CKA, CKAD) · แหล่ง: https://aws.amazon.com/certification/certified-solutions-architect-associate/ · https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks · ตรวจ 2026-10-06 · https://docs.aws.amazon.com/aws-certification/latest/examguides/solutions-architect-associate-03.html · https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/ · https://www.scrum.org/assessments/professional-scrum-master-i-certification (figures confirmed via scrum.org forum pages) · AZ-104 figures from secondary sources (https://trainingcamp.com/what-is-azure-administrator/), so confirm them on learn.microsoft.com


## reference: plan-template.md

# Gap map example and week plan template

## Gap map example (Amazon Web Services (AWS) SAA-C03)

| Domain | Weight | Self-rating (0–3) | Priority = W × (3 − r) | Baseline practice % |
|---|---:|---:|---:|---:|
| Design Secure Architectures | 30% | 1 | 60 | 55 |
| Design Resilient Architectures | 26% | 2 | 26 | 70 |
| Design High-Performing Architectures | 24% | 2 | 24 | 68 |
| Design Cost-Optimized Architectures | 20% | 1 | 40 | 50 |

→ Order: Secure (Identity and Access Management (IAM), Key Management Service (KMS), Virtual Private Cloud (VPC) security) → Cost (pricing models, storage tiers) → Resilient → Performance.

## Plan template (copy to `cert/<exam-code>-plan.md`)

```markdown
# <Exam name> (<code>) — target date <YYYY-MM-DD>
Pass mark: <x> · Questions: <n> · Time: <min> · Guide version: <v> (checked <date>)

| Week | Domain focus | Read/watch | Hands-on lab | Practice exam % | Cards added |
|---|---|---|---|---|---|
| 1 | Baseline + highest-priority domain | | | baseline: | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | Weakest domain from practice | | | | |
| 6 | Review only, final practice exam | — | redo 2 labs | | |

Booking rule: two consecutive practice scores ≥ pass + 10, no domain below pass.
```


---

# skill: study-drill

Use when the user wants flashcards from notes, or to be quizzed for an exam without being told the answer (ทำบัตรคำ, ติวสอบ, quiz me).

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
5. **Cards from mistakes first.** A wrong answer in a practice exam becomes a card before anything else (`cert-prep` step 7). A miss inside a drill that is still running becomes a card only after the user reaches the answer (section 3 step 4); until then no card, padded or `(ยังไม่ได้ตรวจ)`, may carry that answer.
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
