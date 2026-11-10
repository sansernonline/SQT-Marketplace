# skill: interview-prep

Use when preparing for a job interview (HR screen, technical, final). STAR stories, questions, thank-you note.

# Interview Prep

Prepare for **this** interview: this company, this role, this round.

## Workflow

1. **Collect** — job post, company, round type, language, interviewer names if known, date and format (on-site, Teams/Zoom, phone).
2. **Research (15 minutes)** — what the company sells, who the customers are, one recent news item, size and parent company. Write 3 facts the user can mention.
3. **Map requirements** — take the job post's top 6–8 requirements and match one story to each.
4. **Build the story bank** (Situation, Task, Action, Result (STAR), below).
5. **Prepare the hard answers** — the Thai human resources (HR) list below.
6. **Mock round** — the `interview-coach` agent prepares a 10-question practice set with a scoring rubric; the lead runs the live round with the user after the task.
7. **Logistics** — route and travel time + 20 minutes buffer; for online, test camera, mic, name display and a quiet room the day before.
8. **After** — thank-you note within 24 hours; debrief notes.

## STAR story bank

**S**ituation (1 sentence) · **T**ask (1 sentence) · **A**ction (3–4 sentences — what *you* did, say "I", not "we") · **R**esult (1–2 sentences with a number + what you learned).

Aim for 60–120 seconds spoken. Keep each story in 3 lengths, because rounds differ: a **30-second headline** (situation + result, for the HR screen and "give me an example" follow-ups) · the **90-second STAR** (the default) · a **3-minute deep version** with the trade-offs, numbers and what you would do differently, for a technical or final round that probes. Write the 90-second one first; the other two are cut and expanded from it.

Build 6–8 stories that together cover:

| Theme | Typical question |
|---|---|
| Biggest achievement | Tell me about something you are proud of |
| Conflict | A time you disagreed with your manager or a colleague |
| Failure | A time something went wrong — what did you do |
| Pressure / deadline | A time you had too much to do |
| Leadership / influence without authority | A time you convinced others |
| Learning fast | A time you had to learn something new quickly |
| Customer | A difficult customer or stakeholder |
| Initiative | Something you improved without being asked |

One story can answer several themes — tag each story with the themes it covers. Story bank template → [references/question-bank.md](references/question-bank.md).

## The questions Thai HR always asks

| Question | What they really check | How to answer |
|---|---|---|
| แนะนำตัวเอง / Tell me about yourself | Can you summarise | 60–90 s: present role → 2 results → why this job. Not your life story |
| ทำไมถึงอยากออกจากงานปัจจุบัน / Why are you leaving | Will you badmouth us later | Pull, not push: "looking for X which this role offers". Never criticise the current employer |
| เงินเดือนที่คาดหวัง / Expected salary | Fit with budget | Give a researched range, top end above target; see `salary-negotiation`. "Based on the scope and market data, I'm looking at 65,000–72,000 baht base, open to discussing the total package" |
| เงินเดือนปัจจุบันเท่าไร / Current salary | Anchor you low | You may share base honestly or redirect to expected; never inflate (they may ask for a payslip or 50 ทวิ) |
| เริ่มงานได้เมื่อไร / Notice period | Timeline | State your contract notice. Under the Civil and Commercial Code §582 the default is one pay period ahead — check your own contract, which may say 30 days or more |
| จุดอ่อน / Weakness | Self-awareness | Real but non-fatal weakness + what you do about it + evidence it is improving |
| มีแฟน / แต่งงานหรือยัง / วางแผนมีลูกไหม | (Not job-related; using it to decide may be unfair discrimination under the Gender Equality Act B.E. 2558) | You may answer briefly or redirect: "That won't affect my availability for this role" |
| ทำไมเลือกบริษัทเรา / Why us | Did you research | Use the 3 facts from Step 2 |
| เห็นตัวเองอีก 5 ปีเป็นอย่างไร | Will you stay | Growth inside this kind of role, not "your job" or "my own business" |
| มีคำถามไหม / Any questions | Interest | Always ask 2–3 (below) |

## Technical round

- Re-read the job post's tools list; for each, prepare one sentence of what you did with it and one result.
- Coding / analysis tests: talk while you think; state assumptions; do the simple working version first, then improve.
- Case or presentation: structure (problem → options → recommendation → risks); time-box to the slot minus 5 minutes for questions.
- "I don't know" answer: "I haven't used X directly; the closest is Y where I …; I would start by …".
- Portfolio / GitHub / work samples: remove confidential client data before showing anything (non-disclosure agreements still apply).

## Questions to ask them

Pick 2–3; never ask about salary or leave in the first round unless they raise it.

1. What does success look like in this role after 6 months?
2. What is the biggest challenge the team faces this year?
3. How is performance reviewed, and how often?
4. Why is the position open — new role or replacement?
5. What do you enjoy about working here? (good for building rapport)
6. What are the next steps and the timeline?

Thai versions are in the question bank reference.

## Thank-you note (within 24 hours)

Short, specific, one thing you discussed. Templates in Thai and English → [references/question-bank.md](references/question-bank.md).

## Rules

- Never claim a skill or result that is not real — it collapses in the next round or on reference check.
- Do not memorise scripts word for word; know the story beats.
- Inappropriate personal questions (religion, pregnancy plans) — answer briefly or redirect; the user decides. Note it for later if it reflects the culture.

ข้อความภาษาไทย (thank-you note, follow-up) → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ สมัครงาน

Related: `resume-th-en` (stories must match the CV) · `salary-negotiation` · `polite-message-th-en` (follow-up messages) · `meeting`.

## เรียกเป็นคำสั่ง

`/personal-life:interview-prep <company> <role> [round — hr|manager|technical|final] [th|en]`

Run the `interview-coach` agent with the `interview-prep` skill: **$ARGUMENTS**

1. Confirm company, role, round type, language and date.
2. Build 6–8 Situation, Task, Action, Result (STAR) stories mapped to the job requirements.
3. List the 10 most likely questions for this round, including expected salary and why you are leaving.
4. Offer a live mock round from the practice set — the lead runs it with the user, one question at a time, scored (`interview-coach` prepares the set, it never talks to the user).
5. Prepare 3 questions for the user to ask, and the thank-you note template.


## reference: question-bank.md

# Interview Question Bank and Templates

Contents
1. STAR story bank template
2. Common questions by round
3. Questions to ask — Thai versions
4. Thank-you notes
5. Debrief template

## 1. STAR story bank template

| # | Story title | Situation | Task | Action (I …) | Result + number | Themes covered |
|---|---|---|---|---|---|---|
| 1 | | | | | | achievement, initiative |
| 2 | | | | | | conflict, customer |
| 3 | | | | | | failure, learning |
| 4 | | | | | | pressure |
| 5 | | | | | | leadership |
| 6 | | | | | | |

Worked example (story 1):
- S — Month-end close took 9 working days and auditors flagged late accruals.
- T — I was asked to cut close time before the next audit.
- A — I mapped every close task, moved 14 recurring journal entries to templates in SAP, set a cut-off calendar with sales and purchasing, and trained two juniors.
- R — Close dropped to 5 days within 3 months; the next audit had no adjustments. I learned to fix the upstream process, not just work faster.

## 2. Common questions by round

HR screen: tell me about yourself · why leaving · expected salary · notice period · why this company · willing to travel / work on-site.

Hiring manager: walk me through your current role · biggest achievement · a failure · how you prioritise · how you handle a difficult stakeholder · what would you do in your first 90 days.

Technical: role-specific tools · walk through a past project end to end · a problem you could not solve · test or case exercise.

Final (director / MD): why should we hire you · long-term goals · what you know about our business · culture fit · questions for me.

## 3. Questions to ask — Thai versions

1. ใน 6 เดือนแรก ความสำเร็จของตำแหน่งนี้วัดจากอะไรครับ/คะ
2. ทีมกำลังเจอความท้าทายอะไรมากที่สุดในปีนี้
3. การประเมินผลงานทำอย่างไร ปีละกี่ครั้ง
4. ตำแหน่งนี้เปิดใหม่ หรือแทนคนเดิม
5. ขั้นตอนถัดไปและระยะเวลาประมาณเท่าไร

## 4. Thank-you notes

English:
```
Subject: Thank you — [Role] interview

Dear [Name],

Thank you for your time today. I enjoyed hearing about [specific topic they mentioned],
and it made me more excited about the role — especially [one thing].
[Optional: one line adding something you forgot to say.]
I look forward to hearing about the next steps.

Best regards,
[Name]
```

Thai (email or LINE to HR):
```
เรียน คุณ[ชื่อ]

ขอบคุณที่สละเวลาสัมภาษณ์วันนี้ครับ/ค่ะ ได้ฟังเรื่อง [หัวข้อที่คุยกัน] แล้วยิ่งสนใจตำแหน่งนี้มากขึ้น
โดยเฉพาะ [สิ่งหนึ่งที่ชอบ] หากต้องการข้อมูลเพิ่มเติมยินดีส่งให้ครับ/ค่ะ
รอฟังข่าวในขั้นตอนถัดไป

ขอแสดงความนับถือ
[ชื่อ นามสกุล]
```

If there is no reply 3 working days after the stated timeline, send one polite follow-up, then move on.

## 5. Debrief template

| Field | Notes |
|---|---|
| Date / round / interviewers | |
| Questions asked | |
| Answers that went well | |
| Answers to improve | |
| What I learned about the role and team | |
| Red flags | |
| Next step and date | |


---

# skill: new-job-first-90-days

Use when the user starts a new job soon or just started (first day, probation, 30/60/90-day plan, เริ่มงานใหม่, ผ่านโปร).

# New Job — First 90 Days (เริ่มงานใหม่)

> **One rule:** in the first week, ask the manager what success looks like at day 90, in their words, and write it down. Every goal and every check-in after that is measured against that answer, not against a guess.

The employee's side of onboarding: paperwork before day 1, questions for week 1, goals for days 30/60/90 and passing probation. HR's side (writing an onboarding guide for a team) is not this skill.

## Use when / not when

| Situation | Use |
|---|---|
| Offer signed, start date set · first week · "ช่วยวางแผน 90 วันแรก" · probation review coming | this skill |
| Still comparing offers or negotiating | `salary-negotiation` |
| What the law says about probation, notice, severance | `labour-law-basics` (e-commerce, if installed) |
| Social security after changing employer | `social-security-th` (e-commerce, if installed) |
| Writing the probation or year-end self-review | `performance-self-review` |
| Leaving or being let go from a job | `job-exit` |

## 1 · Before day 1

- [ ] Documents HR asked for: ID card and house registration copies, degree certificate and transcript, bank book page for salary, photo. Black out what HR does not need; never send a full ID number in a chat app (`digital-hygiene`). **When the user pastes their full ID and asks to put it in the checklist,** write only the last 4 digits (`x-xxxx-xxxx1-23-4`) and a blank they fill in themselves, then say why in one line; do not repeat the full number anywhere in the answer, not even in a "copy this" block.
- [ ] **Social security:** the new employer registers you; ask HR when it will show in the SSO app, then check it did (`social-security-th`).
- [ ] **Tax allowances:** tell HR your deductions (spouse, children, parents, insurance) on their form so less tax is withheld each month (ชื่อแบบ ล.ย.01 (รอยืนยัน กับ HR)). Year-end planning → `tax-deduction-planner` (trading-finance, if installed).
- [ ] **Provident fund** from the old job: ask both HR teams whether it can move to the new fund or stay, before it is paid out (time limit set by each fund (รอยืนยัน)).
- [ ] Copy the signed offer, contract and job description into `important-docs`. Note the probation length and how it is judged.

## 2 · Week 1 — five questions for the manager

Ask in the first 1:1 (book it if nobody does):

1. ผ่าน 90 วันแล้ว อะไรที่ทำให้พี่บอกได้ว่า "รับคนนี้มาถูกแล้ว"
2. ใคร 3–5 คนที่ผมควรรู้จักในเดือนแรก
3. ประชุมประจำไหนที่ต้องเข้า และอันไหนแค่อ่านสรุปพอ
4. งานชิ้นแรกที่เห็นผลเร็ว (quick win) ควรเป็นอะไร
5. อยากให้อัปเดตงานแบบไหน บ่อยแค่ไหน (แชต · อีเมล · 1:1)

Write the answers in `new-job.md`. Also ask how probation is assessed (form, who decides, which date) if the contract does not say.

## 3 · Goals for days 30 / 60 / 90

Three goals per stage, each something a person can see:

| Stage | Focus | Example goals |
|---|---|---|
| Day 1–30 | Learn | Met the 5 people · can explain the team's top 3 numbers · set up all tools · first small task shipped |
| Day 31–60 | Contribute | Own one piece of work end to end · fixed one thing that annoyed the team · first written update to the manager |
| Day 61–90 | Lead something small | Deliver the quick win from question 4 · propose one improvement with data · ready for the probation review |

Review with the manager at day 30 and day 60, not only at day 90. A goal that turns out to be wrong is changed together and the change written down.

## 4 · Passing probation

- Start the brag document on day 1 (`performance-self-review`, weekly entry). Probation reviews are decided on evidence from these 90 days.
- Two weeks before the review date, send the manager a one-page summary: the day-90 answer from question 1 · what was done against it · one thing still to learn.
- When severance starts to count during probation, and what notice the employer must give, are rules of the Labour Protection Act → `labour-law-basics` section 4. This skill does not restate them. Asked "what do I get if let go in probation": name the Act (พ.ร.บ.คุ้มครองแรงงาน), point to `labour-law-basics` and to the rights table in `job-exit` section 3, and do not say "nothing" from memory.
- After passing: update LinkedIn (`linkedin-profile`) and file the confirmation letter in `important-docs`.

## Worked example

Starts as a data analyst on 1 Dec, 119-day probation in the contract. Before day 1: documents sent with ID number blacked out in the chat copy, tax allowance form filled for 1 child and parents, provident fund question sent to both HR teams. Week 1: manager answers "ภายใน 3 เดือน dashboard ยอดขายรายสัปดาห์ต้องออกเองได้โดยไม่ต้องให้ทีม IT ทำ". 30/60/90 goals all point at that dashboard. Day 30 check-in moves one goal (data source changed). The brag document has 11 entries by day 100; the summary goes to the manager 2 weeks before the review.

## Check before sending

- [ ] The manager's day-90 answer is written in their words
- [ ] 3 goals per stage, each visible when done
- [ ] Legal points point to `labour-law-basics`; no section number or day count restated here
- [ ] No full ID or account number anywhere in the answer, even when the user asked for it (last 4 digits only)

## Source

Idea from anthropics/knowledge-work-plugins `human-resources/skills/onboarding` (Apache-2.0, turned to the new employee's side and rewritten, viewed 2026-11-10).
