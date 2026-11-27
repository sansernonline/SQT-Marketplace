# skill: career-growth

Use when starting a job, writing a self-review or leaving a job

# career-growth — first 90 days, self-review and leaving a job

> **One rule:** Sign nothing on the day you are handed a document. Ask for time, keep the evidence, and check every number against the rights table first.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "I just started, I'm on probation, what should I do in the first 90 days?" | [`references/new-job-first-90-days.md`](references/new-job-first-90-days.md) |
| "Year-end review is coming" or "I want to ask for a promotion" | [`references/performance-self-review.md`](references/performance-self-review.md) |
| "I was laid off", "I want to resign", "they gave me an exit agreement" | [`references/job-exit.md`](references/job-exit.md) |

## Check before done

- This skill puts facts and documents in order. It never decides whether a dismissal was fair, and it never says how much to sue for.
- Say once that this is general information, not legal advice. The law behind the numbers is the Labour Protection Act (พ.ร.บ.คุ้มครองแรงงาน). Point to the `thai-employment` skill; do not restate the law from memory.
- Never say "you get nothing" about probation from memory. A row the user cannot work out stays `[ตรวจ]` and goes to the labour office or a lawyer.
- An exit agreement that says the user gives up all further claims needs a lawyer or the labour office to read it before signing.
- Preparing a complaint or a visit to a lawyer → `family-legal`.
- A whole promotion case with several steps → playbook `superuser/references/playbook-promotion-case.md`.


## reference: job-exit.md

<!-- merged from skill `job-exit` on 2026-11-27 · description was: Use when laid off, resigning or signing an exit agreement -->
# Job Exit — the employee's side (ถูกเลิกจ้าง · ถูกขอให้ลาออก · ลาออกเอง)

> **One rule:** sign nothing on the day. Ask for time to read, keep the evidence, and compare every number with the rights table below first. This skill puts facts and documents in order; it never decides whether a dismissal was fair.

General information, not legal advice (ข้อมูลทั่วไป ไม่ใช่คำปรึกษากฎหมาย). The law behind the numbers is the Labour Protection Act (พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541 and amendments). Its sections, the severance table and notice rules live in `thai-employment` (e-commerce) and are **not restated here**, so there is one copy to keep current.

## Use when / not when

| Situation | Use |
|---|---|
| HR calls a meeting and hands over a termination letter · asked to sign a resignation or a "mutual agreement" · quitting and wants final pay right | this skill |
| How many days of severance, notice rules, section numbers | `thai-employment` (e-commerce, if installed) sections 4–5 |
| The employer's side: how to terminate correctly | `thai-employment`, "Termination checklist" in its reference |
| Unemployment benefit details, section 39 contributions | `thai-employment` (e-commerce, if installed) |
| Preparing a complaint or a visit to a lawyer | `family-legal` |
| Starting the next job | `new-job-first-90-days.md` |
| Is the dismissal fair, how much to sue for | a labour lawyer or the labour office — this skill only lists the facts to bring |

## 1 · On the day — step back

Say, in writing if possible: "ขอรับเอกสารกลับไปอ่านก่อนนะครับ/คะ จะตอบภายในวันที่ …". Pressure to sign today ("ถ้าไม่เซ็นวันนี้จะไม่ได้อะไรเลย") is a reason to slow down, not to hurry. Ask for copies of everything shown in the meeting.

## 2 · Keep the evidence (before access is cut)

- [ ] Employment contract, offer letter, job description, work rules (ข้อบังคับเกี่ยวกับการทำงาน)
- [ ] Payslips for the last 12 months, bonus and commission terms
- [ ] The termination letter, or the resignation or agreement form they want signed — note whether a reason is written in it
- [ ] Warning letters, if any, with dates
- [ ] Chats and emails about the exit, as screenshots with date and time
- [ ] Time records if overtime is unpaid

Keep only your own employment papers. Copying company data you have no right to take can create a new problem.

## 3 · Rights table — check every row before signing

| Item | What to check | Rule lives in |
|---|---|---|
| Severance (ค่าชดเชย) | Days of service from the start date (probation counts) × the band in the table | `thai-employment` → `references/labour-law-basics.md` §5 (ม.118, ม.119 exceptions) |
| Pay in lieu of notice (สินจ้างแทนการบอกกล่าวล่วงหน้า) | Was notice given on or before a pay day? If not, how much is owed | `thai-employment` → `references/labour-law-basics.md` §4 (ม.17, ม.17/1) |
| Wages, overtime, commission still owed | Amounts and the pay date | `thai-employment` → `references/labour-law-basics.md` §4 (ม.70) |
| Unused annual leave | Days left this year, paid out | `thai-employment` → `references/labour-law-basics.md` §4 (ม.67) |
| Bonus and benefits in the contract | Pro-rata rules in the contract or work rules | the contract |
| Provident fund (กองทุนสำรองเลี้ยงชีพ) | Vesting of the employer's share, keep or move | the fund's rules · `retirement-and-insurance` (trading-finance, if installed) |
| Unemployment benefit | Laid off and resigned are paid differently; register in time (section 5) | `thai-employment` · sso.go.th |
| Tax on the final pay | Severance under the labour law has its own tax treatment | section 5 · `thai-employment` `leave-and-severance.md` item 9 (e-commerce, if installed) or an accountant |
| Work certificate (หนังสือรับรองการทำงาน) | Ask for it; the employer must issue one on request | `thai-employment` termination checklist |

Write the expected amount next to each row, and the section from the "Rule lives in" column (ม.118 · ม.17 · ม.67 …) so the user can check it, even when `thai-employment` is not installed. A row you cannot work out stays `[ตรวจ]` and goes to the labour office or a lawyer; do not guess it.

## 4 · Papers they ask you to sign

- **Resignation letter (ใบลาออก) when you did not choose to leave:** severance in the table is for a termination by the employer. Signing a resignation can be read as leaving by choice, which changes severance and the unemployment rate. Ask the labour office before signing (section 6) (รอยืนยัน).
- **Mutual agreement or release (ข้อตกลงเลิกจ้าง · หนังสือสละสิทธิ์/ปลดเปลื้อง):** compare the sum with the rights table first. A clause saying you give up all further claims needs a lawyer or the labour office to read it before you sign.
- Sign only the version you read. Write the date. Keep a copy or a photo of the signed page.

## 5 · The first 30 days after leaving

- **Register as unemployed within 30 days** of the last working day, on the Department of Employment's site (the SSO page names e-service.doe.go.th). Registering later still works, but the benefit counts only from the day you register. The benefit needs at least 6 months of contributions within the 15 months before leaving. sso.go.th, unemployment benefit page, viewed 2026-11-10.
- **How much is paid** differs for laid off and for resigned or contract ended. The figures and the wage cap are kept in `thai-employment`. The SSO page viewed 2026-11-10 still shows 50% for up to 180 days (laid off), 30% for up to 90 days (resigned) and a 15,000 บาท cap, while `thai-employment` records a newer rate and cap from 2568–2569. Ask 1506 which one applies to you (รอยืนยัน).
- **Keep social security under section 39:** possible if you paid under section 33 for at least 12 months; apply within 6 months of leaving (form สปส. 1-20). sso.go.th, section 39 page, viewed 2026-11-10.
- **Tax on severance:** severance under the labour law for leaving not by choice is exempt up to the last 400 days' wages and no more than 600,000 บาท; with 5 years of service or more you may choose to tax it separately from other income on the ภ.ง.ด.91 attachment. Revenue Department, PND 91 instructions for tax year 2568, viewed 2026-11-10. Details → `thai-employment` `leave-and-severance.md` item 9 (e-commerce, if installed); working it out with your own figures and the withholding → an accountant.

## 6 · Where to complain

| Channel | What it does | Contact |
|---|---|---|
| Department of Labour Protection and Welfare (กรมสวัสดิการและคุ้มครองแรงงาน) | Questions about rights; complaints about unpaid money | hotline **1546** (or 1506 then 3) |
| Labour inspector (พนักงานตรวจแรงงาน), form **คร.7** | When the employer does not pay wages, overtime, holiday pay, severance or a deposit owed. File with the inspector where you worked or where the employer is based, or online; decided within 60 days, extendable by 30 | provincial labour office · online via s90.labour.go.th/e_request |
| Free legal aid | Before signing a release, or when going to the labour court | see `family-legal`, section 6 |

Preparing the visit (facts table, deadlines, contact log) → `family-legal`.

## Quitting by choice (ลาออกเอง)

1. Give written notice following the contract; the minimum notice rule is in `thai-employment` → `references/labour-law-basics.md` §4.
2. Before the last day, list the final pay items from the rights table (wages, leave, bonus terms, provident fund) and ask HR for the pay date in writing.
3. Ask for the work certificate and the 50 ทวิ for the year.
4. Unemployment and section 39 → section 5.

## Check before sending

- [ ] The first line tells the user not to sign today
- [ ] Every number points to `thai-employment` or an official page with date; none restated from memory
- [ ] Every rights row names its section (ม.118 severance · ม.17 notice · ม.67 leave)
- [ ] Every row the agent could not compute is `[ตรวจ]`
- [ ] Says it is not legal advice, and no ruling on fairness

## References

- [`worked-example.md`](job-exit/worked-example.md) — open for a full example of a "mutual agreement" offer
- [`sources.md`](sources.md) — official pages viewed 2026-11-10 (SSO · Revenue Department · labour office)


## reference: new-job-first-90-days.md

<!-- merged from skill `new-job-first-90-days` on 2026-11-27 · description was: Use when starting a new job or probation -->
# New Job — First 90 Days (เริ่มงานใหม่)

> **One rule:** in the first week, ask the manager what success looks like at day 90, in their words, and write it down. Every goal and every check-in after that is measured against that answer, not against a guess.

The employee's side of onboarding: paperwork before day 1, questions for week 1, goals for days 30/60/90 and passing probation. HR's side (writing an onboarding guide for a team) is not this skill.

Not for: comparing or negotiating offers → `job-search` · the law on probation, notice, severance → `thai-employment` (e-commerce, if installed) · social security after changing employer → `thai-employment` (e-commerce, if installed) · writing the probation or year-end self-review → `performance-self-review.md` · leaving or being let go → `job-exit.md`

## 1 · Before day 1

- [ ] Documents HR asked for: ID card and house registration copies, degree certificate and transcript, bank book page for salary, photo. Black out what HR does not need; never send a full ID number in a chat app (`digital-hygiene`). **When the user pastes their full ID and asks to put it in the checklist,** write only the last 4 digits (`x-xxxx-xxxx1-23-4`) and a blank they fill in themselves, then say why in one line; do not repeat the full number anywhere in the answer, not even in a "copy this" block.
- [ ] **Social security:** the new employer registers you; ask HR when it will show in the SSO app, then check it did (`thai-employment`).
- [ ] **Tax allowances:** tell HR your deductions (spouse, children, parents, insurance) on their form so less tax is withheld each month (ชื่อแบบ ล.ย.01 (รอยืนยัน กับ HR)). Year-end planning → `income-tax-th` (trading-finance, if installed).
- [ ] **Provident fund** from the old job: ask both HR teams whether it can move to the new fund or stay, before it is paid out (time limit set by each fund (รอยืนยัน)).
- [ ] Copy the signed offer, contract and job description into `family-legal`. Note the probation length and how it is judged.

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

- Start the brag document on day 1 (`performance-self-review.md`, weekly entry). Probation reviews are decided on evidence from these 90 days.
- Two weeks before the review date, send the manager a one-page summary: the day-90 answer from question 1 · what was done against it · one thing still to learn.
- When severance starts to count during probation, and what notice the employer must give, are rules of the Labour Protection Act → `thai-employment` → `references/labour-law-basics.md` section 4. This skill does not restate them. Asked "what do I get if let go in probation": name the Act (พ.ร.บ.คุ้มครองแรงงาน), point to `thai-employment` and to the rights table in `job-exit.md` section 3, and do not say "nothing" from memory.
- After passing: update LinkedIn (`job-search`, `linkedin.md`) and file the confirmation letter in `family-legal`.

## Check before sending

- [ ] The manager's day-90 answer is written in their words
- [ ] 3 goals per stage, each visible when done
- [ ] Legal points point to `thai-employment`; no section number or day count restated here
- [ ] No full ID or account number anywhere in the answer, even when the user asked for it (last 4 digits only)

## References

- [`worked-example.md`](worked-example.md) — a data analyst's 119-day probation, start to review


## reference: performance-self-review.md

<!-- merged from skill `performance-self-review` on 2026-11-27 · description was: Use when writing a self-review or promotion case -->
# Performance Self-Review

Your record is the evidence.

Not for: negotiating the raise number or an offer → `job-search`.

## Workflow

1. **Keep a brag document** all year — 5 minutes every Friday (template below).
2. **2 weeks before the review** — pull the year's entries, group them by the company's review criteria or your key performance indicators (KPIs).
3. **Frame each item as impact** (formula below). Pick the top 3–5.
4. **Fill the self-assessment** — the company form or the template in [references/templates.md](templates.md).
5. **Rate yourself honestly** — 1 level above where your manager will likely land is fine; 2 levels is not credible.
6. **Prepare the conversation** — 3 wins, 1 growth area with a plan, 1 ask (training, scope, promotion, raise). Before the form goes in, run a **reader test**: a fresh reader (a subagent that has not seen this chat, or the user in a new chat) gets only the form and answers as the manager deciding a promotion would — "what changed because of this person · which claim has no evidence · what is the ask". Method: `thesis-writing`, "Reader test".
7. **After the meeting** — send a short written recap of what was agreed.

## Brag document — weekly entry

| Date | What I did | Result / number | Who noticed (feedback, message) | Skill shown | KPI it links to |
|---|---|---|---|---|---|
| 2026-03-14 | Fixed duplicate-invoice bug in billing export | 312 duplicate invoices stopped per month | CFO thanked team on email | Problem solving | Billing accuracy |

Also save: thank-you messages, customer compliments, certificates, screenshots of dashboards (no confidential data). Store in a folder per year.

**Evidence ladder** — rank each entry by how well it would survive a sceptical reader, and lead the review with the top rung:
1. **Measured** — a number from a system or report someone else can open (dashboard, ticket count, audit result)
2. **Witnessed** — a named person said it in writing (email, chat, review comment)
3. **Shown** — the artifact exists (document, code, deck) but nobody measured its effect
4. **Claimed** — only your memory; find a proxy from rungs 1–3 before review season or leave it out

**Backfill when the document is empty** — do not start from memory. Scan the year's record first: sent mail and chat threads, calendar, closed tickets, git log and merged pull requests (developers: `git log --author=me --since=YYYY-01-01 --oneline`), delivered files. List what the record shows, then ask the user only for the result and who noticed.

## Impact framing

**Result for the business ← what I did ← how I did it.** Lead with the result.

| Activity framing (weak) | Impact framing (strong) |
|---|---|
| Ran 24 training sessions | Cut new-hire time-to-productive from 8 to 5 weeks by running 24 onboarding sessions |
| ทำรายงานยอดขายทุกเดือน | ทำให้ผู้บริหารตัดสินใจเรื่องสต็อกได้เร็วขึ้น 1 สัปดาห์ ด้วยรายงานยอดขายรายเดือนแบบอัตโนมัติ |
| Handled customer complaints | Brought complaint resolution time from 5 days to 2 and kept 3 key accounts worth 4.2 million baht a year |

Impact categories that land with Thai management: money (revenue, cost, ลดต้นทุน) · time · risk / compliance (audit, PDPA, safety) · customers · people (trained, retained).

## Self-assessment — rules

- Use numbers and dates; avoid adjectives ("excellent", "ดีมาก").
- Acknowledge one real miss and what you changed — it makes the wins believable.
- Link to company goals by name (the objectives and key results (OKR), KPI or strategic theme).
- Credit the team where it was a team result, then say your part ("I led …", "I built …").
- Keep it to one page or what the form allows.

## Asking for promotion

Promotion is usually "already doing the next level's work", not "deserve it for time served".

1. Get the next level's job description or competency framework from HR.
2. Map evidence: for each requirement, 1 or 2 brag-doc items showing you already do it.
3. Find the gap honestly; propose how to close it in 3–6 months.
4. Ask your manager early (not at the review meeting itself): "What would you need to see from me to be promoted to [level] in the next cycle?"
5. Agree measurable criteria and a date; confirm by email.
6. Re-check monthly in 1:1s.

Promotion case template (Thai and English) → [references/templates.md](templates.md).

Related: `job-search` (turning the review into a raise) · `job-search` (brag doc becomes CV bullets) · `weekly-review` in `personal-life` (the Friday habit).


## reference: sources.md

# Sources · job-exit

Ideas from anthropics/claude-for-legal `employment-legal/skills/termination-review` (employer's side, Apache-2.0, turned to the employee's side and rewritten, viewed 2026-11-10).

Sources: https://www.sso.go.th/wpr/ (hotline 1506; unemployment and section 39 detail pages under "สิทธิประโยชน์") · https://www.rd.go.th/fileadmin/tax_pdf/pit/2568/Ins91_241268.pdf · https://rd.go.th/65809.html · viewed 2026-11-10.

Sources: https://www.labour.go.th (hotline line in the page footer) · https://nakhonsawan.labour.go.th/การยื่นคำร้อง/469-work-25657 (คร.7, a provincial office page) · viewed 2026-11-10. The labour court itself was not checked for this skill (ยังไม่ได้ตรวจ).


## reference: templates.md

# Self-Review and Promotion Templates

Contents
1. Self-assessment (English)
2. Self-assessment (Thai)
3. Promotion case

## 1. Self-assessment (English)

```
Review period: [Jan–Dec YYYY]      Role: [title]      Manager: [name]

Top results
1. [Result + number] — by [what I did] — links to [KPI / goal]
2. ...
3. ...

Goals set last year → outcome
| Goal | Target | Actual | Comment |
|------|--------|--------|---------|

What did not go well, and what I changed
[One honest item + the change + evidence it worked]

Skills I grew
[Skill — evidence]

Next year — what I want to achieve
1. [Goal with number and date]
2. ...

Support I need
[Training, tools, scope, mentoring]

Self-rating: [level] — because [one-sentence justification]
```

## 2. Self-assessment (Thai)

```
รอบการประเมิน: [ม.ค.–ธ.ค. 25xx]   ตำแหน่ง: [ตำแหน่ง]   หัวหน้างาน: [ชื่อ]

ผลงานสำคัญ
1. [ผลลัพธ์พร้อมตัวเลข] จากการ [สิ่งที่ทำ] (KPI [ชื่อ])
2. ...
3. ...

เป้าหมายปีที่แล้ว → ผลที่ได้
| เป้าหมาย | ค่าเป้า | ผลจริง | หมายเหตุ |

สิ่งที่ยังทำได้ไม่ดี และสิ่งที่ปรับแล้ว
[เรื่องจริง 1 เรื่อง + สิ่งที่ปรับ + หลักฐานว่าดีขึ้น]

ทักษะที่พัฒนา
[ทักษะ] ([หลักฐาน])

เป้าหมายปีหน้า
1. [เป้าหมายพร้อมตัวเลขและกำหนดเวลา]

สิ่งที่ต้องการการสนับสนุน
[อบรม เครื่องมือ ขอบเขตงาน พี่เลี้ยง]

ประเมินตนเอง: [ระดับ] เหตุผล [หนึ่งประโยค]
```

## 3. Promotion case

| Next-level requirement | My evidence (date, result) | Gap | Plan to close |
|---|---|---|---|
| Leads projects across teams | Led SAP migration with IT + Sales, Mar–Jun | — | — |
| Coaches juniors | Trained 2 juniors to close entities alone | — | — |
| Presents to senior management | Presented Q3 results once | Only once | Present quarterly from Q1 |

Opening line for the conversation:
- EN: "I'd like to talk about my path to [level]. Here's where I think I already meet the criteria, and one gap I'm working on. What else would you need to see?"
- TH: "อยากขอคุยเรื่องการเติบโตไปตำแหน่ง [ระดับ] ครับ/ค่ะ ได้เตรียมหลักฐานว่าส่วนไหนทำได้แล้ว และส่วนที่ยังต้องพัฒนา อยากทราบว่าพี่/คุณอยากเห็นอะไรเพิ่มอีกบ้าง"

## Worked example — top-3 summary

## Worked example — top-3 summary

> 1. Cut month-end close from 9 to 5 working days (Jan–Apr), freeing 4 days a month for analysis — KPI: reporting timeliness.
> 2. Led the audit preparation; zero adjustments from the auditor for the first time in 3 years — KPI: compliance.
> 3. Trained 2 juniors who now close 3 entities independently — KPI: team capability.
> Growth area: presenting to the board — enrolled in a presentation course (Q3), presented the Q3 results myself.
> Ask: scope to own the consolidation process next year, with promotion to Senior Accountant as the goal.


## reference: worked-example.md

# Worked example · new-job-first-90-days

## Worked example

Starts as a data analyst on 1 Dec, 119-day probation in the contract. Before day 1: documents sent with ID number blacked out in the chat copy, tax allowance form filled for 1 child and parents, provident fund question sent to both HR teams. Week 1: manager answers "ภายใน 3 เดือน dashboard ยอดขายรายสัปดาห์ต้องออกเองได้โดยไม่ต้องให้ทีม IT ทำ". 30/60/90 goals all point at that dashboard. Day 30 check-in moves one goal (data source changed). The brag document has 11 entries by day 100; the summary goes to the manager 2 weeks before the review.
