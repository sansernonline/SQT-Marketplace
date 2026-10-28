---
name: cert-prep
description: Use when preparing for a cloud or developer certification (AWS, Azure, GCP, CKA, PSM). Week plan, practice exams.
---

# Certification Prep

Study what the exam guide weighs, prove it with practice scores, and book the date once the scores are steady.

## Workflow

1. **Get the official exam guide.** Download it from the vendor's page, not from a course site. Record the exam code and version (for example SAA-C03), the domains and their weights, the question count, the time limit, the passing score and the price. The current facts for common exams are in [references/exam-facts.md](references/exam-facts.md). Re-check them on the vendor page, because exam versions change
2. **Gap map.** For each domain, the user rates themselves 0–3 (0 = never heard of it, 3 = do it at work). **Priority = weight × (3 − rating)**. Study the highest priority first
3. **Baseline practice exam** in week 1, before studying, timed. This is the real gap map. The self-rating is only a guess
4. **Week-by-week plan.** Use the template in the plan-template reference (see "Gap map and plan template"). Size (default, not yet measured): 6–10 hours a week for 4–8 weeks for an associate-level exam with some experience. Double it for a first exam in a new area
5. **Each study session**: read or watch (40%) → hands-on lab (40%) → write flashcards from your mistakes (20%) (default split, not yet measured)
6. **Spaced repetition**: review cards on day 1, 3, 7, 14 and 30 after they are written (Anki or any spaced repetition system (SRS) app). 15 minutes a day beats a 3-hour weekend cram
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

Related: `learning-path` (for skills beyond the exam), `side-project-picker`, `english-tech-reading` (for long, conditional English questions), and `sprint-plan` in `software-company` for Scrum context.
