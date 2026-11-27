# skill: thai-employment

Use for Thai hiring, payroll, leave, SSO, labour law or holidays

# thai-employment — hiring, payroll, social security and leave

> **One rule:** the Labour Protection Act sets the floor; the company may give more, never less, and every payroll figure comes from the source rows, not from a guess.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| An employer hires staff, writes a job ad or offer | [references/hiring-th.md](references/hiring-th.md) |
| Running monthly payroll, salary withholding, ภ.ง.ด.1 | [references/payroll-th.md](references/payroll-th.md) |
| Social security questions (contributions, benefits, filings) | [references/social-security-th.md](references/social-security-th.md) |
| Labour Protection Act questions (wages, overtime, severance, leave) | [references/labour-law-basics.md](references/labour-law-basics.md) |
| An employee or HR needs a leave form or ledger entry | [references/doc-leave.md](references/doc-leave.md) |
| Planning around Thai public holidays | [references/thai-holidays.md](references/thai-holidays.md) |

Other files in this folder include `leave-and-severance.md`, `leave-forms.md`, `50-tawi.md`, `offer-letter-first-week.md`, `job-ad-thai.md`, `job-ad-english.md` and `interview-reference-check-pdpa.md`. Scripts: `scripts/payroll.mjs`.

## Steps every part shares

1. Take the names, wages and dates from the company's own records, and write `(รอยืนยัน)` for anything missing.
2. Ask the owner about one person and one issue at a time; never fix a row quietly.
3. Run `scripts/payroll.mjs` for any payroll number.

## Check before done

- General information, not legal advice. Disputes go to a labour inspector (hotline 1546) or a labour lawyer.
- Never refuse sick leave to a genuinely sick employee, and never reject a maternity or paternity request on business grounds.
- Leave the company gives beyond the law is written apart from what the law guarantees.
- A check summary lists names and issues only, never ID card numbers or bank account numbers.
- Holiday dates come from the official announcement, never from a formula.

Whole job with several steps → playbook [monthly-close](../superuser/references/playbook-monthly-close.md) (payroll, tax and social security at month end).


## reference: 50-tawi.md

# Withholding tax certificate under section 50 bis (หนังสือรับรองการหักภาษี ณ ที่จ่าย ตามมาตรา 50 ทวิ) — fields

The official form is on rd.go.th (แบบฟอร์ม 50 ทวิ). Many accounting programs print it; this list is for checking or building one.

## Copies

ฉบับที่ 1 (สำหรับผู้ถูกหักภาษี ใช้แนบพร้อมกับแบบแสดงรายการภาษี) · ฉบับที่ 2 (สำหรับผู้ถูกหักภาษี เก็บไว้เป็นหลักฐาน). Payer keeps its own copy.

## Fields

| Section | Field |
|---|---|
| Header | เล่มที่ / เลขที่ (running number) |
| ผู้มีหน้าที่หักภาษี ณ ที่จ่าย | ชื่อ · เลขประจำตัวผู้เสียภาษีอากร (13 หลัก) · ที่อยู่ |
| ผู้ถูกหักภาษี ณ ที่จ่าย | ชื่อ · เลขประจำตัวผู้เสียภาษีอากร / เลขประจำตัวประชาชน · ที่อยู่ |
| ลำดับที่ในแบบ | line number on the return, and tick which return: ภ.ง.ด.1ก · ภ.ง.ด.1ก พิเศษ · ภ.ง.ด.2 · ภ.ง.ด.3 · ภ.ง.ด.2ก · ภ.ง.ด.3ก · ภ.ง.ด.53 |
| ประเภทเงินได้พึงประเมินที่จ่าย | 1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40(1) · 2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40(2) · 3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40(3) · 4.(ก) ดอกเบี้ย ฯลฯ 40(4)(ก) · 4.(ข) เงินปันผล 40(4)(ข) with the tax-credit sub-lines · 5. การจ่ายเงินได้ที่ต้องหักภาษีตามคำสั่งกรมสรรพากรที่ออกตามมาตรา 3 เตรส (services, rent, advertising, transport …) · 6. อื่น ๆ (ระบุ) |
| Per row | วัน เดือน หรือปีภาษี ที่จ่าย · จำนวนเงินที่จ่าย · ภาษีที่หักและนำส่งไว้ |
| Totals | รวมเงินที่จ่ายและภาษีที่หักนำส่ง · รวมเงินภาษีที่หักนำส่ง (ตัวอักษร) |
| Contributions | เงินที่จ่ายเข้า กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน · กองทุนประกันสังคม · กองทุนสำรองเลี้ยงชีพ (amounts) |
| ผู้จ่ายเงิน | (1) หัก ณ ที่จ่าย · (2) ออกให้ตลอดไป · (3) ออกให้ครั้งเดียว · (4) อื่น ๆ |
| Sign-off | ขอรับรองว่าข้อความและตัวเลขดังกล่าวข้างต้นถูกต้องตรงกับความจริงทุกประการ · ลงชื่อผู้จ่ายเงิน · วัน เดือน ปี ที่ออกหนังสือรับรอง · ประทับตรานิติบุคคล (ถ้ามี) |

## Fill-in example (employee, full year 2569)

```
เล่มที่ 1  เลขที่ 2569/012
ผู้มีหน้าที่หักภาษี: บริษัท ตัวอย่าง จำกัด  เลขประจำตัวผู้เสียภาษี 0105xxxxxxxxx
ผู้ถูกหักภาษี: นางสาวตัวอย่าง ใจดี  เลขประจำตัวประชาชน 1xxxxxxxxxxxx
ลำดับที่ 12 ในแบบ [x] ภ.ง.ด.1ก
1. เงินเดือน ค่าจ้าง ฯลฯ ม.40(1)   ปีภาษี 2569   600,000.00   20,450.00
รวม                                         600,000.00   20,450.00
รวมเงินภาษีที่หักนำส่ง (ตัวอักษร): สองหมื่นสี่ร้อยห้าสิบบาทถ้วน
กองทุนประกันสังคม 10,500.00   กองทุนสำรองเลี้ยงชีพ 0.00
ผู้จ่ายเงิน [x] (1) หัก ณ ที่จ่าย
ลงชื่อ ................ ผู้จ่ายเงิน   วันที่ 15 กุมภาพันธ์ 2570
```

## Timing

- Vendor payments (ภ.ง.ด.3/53): give at the time of payment.
- Salary: once a year for the whole year, and within 1 month after an employee leaves (รอยืนยัน exact rule on rd.go.th).
- Payments through e-WHT: the bank issues an electronic certificate — no paper 50 ทวิ.

Last checked 2026-10-06 · Sources: https://www.rd.go.th (แบบ 50 ทวิ)


## reference: doc-leave.md

<!-- merged from skill `doc-leave` on 2026-11-27 · description was: Use when an employee or HR needs a Thai leave form -->
# Thai Leave Forms and Balances

Use the right form, get the balance right and keep a clean record. Leave disputes are decided by the records.

**Entitlement numbers (days, paid days, sections of law) live in `labour-law-basics.md` → `leave-and-severance.md`** . That skill is in the same plugin, so it is always installed. Read the numbers there; do not copy them here or into a form. This skill covers the paperwork, the arithmetic and the approval path.

## 1. Leave types and what each form needs

| Leave | Thai name on the form | Extra document | Notice to give |
|---|---|---|---|
| Sick | ลาป่วย | medical certificate (ใบรับรองแพทย์) when the law/rules require it — see `labour-law-basics.md` | on the day, form on return |
| Personal business | ลากิจ | reason; proof if company rules ask | in advance per work rules (e.g. 3 working days) |
| Annual | ลาพักผ่อนประจำปี / ลาพักร้อน | none | in advance per work rules (e.g. 7 days) |
| Maternity | ลาคลอด | medical certificate with due date | as early as possible |
| Spouse after birth / paternity | ลาเพื่อช่วยภรรยาดูแลบุตร | birth certificate (สูติบัตร) | before or soon after the birth |
| Military | ลาเพื่อรับราชการทหาร | call-up letter | on receipt |
| Training | ลาเพื่อฝึกอบรม | course details | per work rules |
| Sterilisation | ลาเพื่อทำหมัน | medical certificate | |
| Ordination / wedding / unpaid | ลาอุปสมบท / ลาสมรส / ลาโดยไม่รับค่าจ้าง | company benefit, not law — state the company's rule | per work rules |

Keep "what the law guarantees" (from `labour-law-basics.md`) apart from "what the company gives extra". A company may give more, never less.

## 2. Balance calculation

Work in **working days**, half-day units. Exclude weekly rest days and the company's traditional holidays (`thai-holidays.md`).

```
balance_after = carried_forward + entitlement_this_year (pro-rata if partial year) − taken − this_request
pro-rata entitlement = annual entitlement × full months in service this year ÷ 12   (round per policy, e.g. down to 0.5)
paid days used     = min(days taken of this type, paid cap from labour-law-basics); excess = unpaid
```

## 3. Approval flow

| Step | Who | Within | Record |
|---|---|---|---|
| 1 Submit form (paper or HR system) | employee | per notice rule | form no., dates, type, reason, handover |
| 2 Check balance and documents | HR / system | 1 working day | balance before/after on the form |
| 3 Approve / reject with reason | direct supervisor | 2 working days | signature + date; rejection reason in writing |
| 4 Second approval for > 5 days or during blackout | department head | 2 working days | |
| 5 Post to leave ledger and payroll (unpaid days → deduction) | HR | before payroll cut-off | ledger line; `payroll-th.md` |
| 6 File | HR | — | keep with personnel file (retention per company policy, e.g. 2 years after leaving — รอยืนยัน legal minimum) |

Sick leave and emergencies are approved after the fact. The flow is the same; the employee files the form on return.

Rules for supervisors: annual leave dates may be set or agreed by the employer, but the employee must get the leave within the year (detail in `labour-law-basics.md`); never refuse sick leave for a genuinely sick employee; never reject a maternity or paternity request on business grounds.

## 4. Templates

Leave form, leave ledger and annual summary, plus the worked balance example: [references/leave-forms.md](leave-forms.md).

## Rules

- 1 request = 1 form = 1 ledger line. Correct with a new line; never overwrite.
- Medical certificates and reasons are sensitive personal data (health) — HR-only access (`pdpa-workflow`).
- Rules about notice periods and documents belong in the company work rules (ข้อบังคับเกี่ยวกับการทำงาน); a form cannot add new restrictions.

## Related

`labour-law-basics.md` (entitlements) · `payroll-th.md` (unpaid leave deduction) · `thai-holidays.md` · `thai-business-docs` · `pdpa-workflow`.


## reference: example-accountant.md

# Example: hiring 1 accounting officer

Moved from `SKILL.md` section 9 · every name, number and date in this file is an **example** · the company has 25 employees and is hiring 1 accounting officer, salary budget 22,000–26,000 baht, 3 candidates in the final round (A · B · C)

**Screening sheet**

| Criterion | Weight | 1 = | 3 = | 5 = |
|---|---|---|---|---|
| Monthly close | 30 | can post daily entries but has never closed the books | can close with someone checking, can explain a bank reconciliation | closes on time alone 12 months in a row, can explain every month-end adjusting entry |
| Monthly withholding tax and VAT | 25 | cannot pick the right withholding rate | gets 4 of 5 test questions right | gets 5 of 5 right and can explain input tax that cannot be reclaimed |
| Excel | 15 | uses only add and subtract formulas | can use XLOOKUP and pivot tables | finishes a reconciliation file from bank data within the 30-minute test |
| Attention to detail (check 20 documents hiding 6 errors) | 20 | finds at most 2 | finds 4 | finds all 6 |
| Chasing documents from vendors and the team | 10 | cannot say how they would chase | tells of 1 time, with the result | tells of 2 or more times, with numbers, such as pending documents cut from 30 to 5 |

**Scores after the interview**

| Criterion | Weight | A | B | C |
|---|---|---|---|---|
| Monthly close | 30 | 4 | 5 | 3 |
| Withholding tax and VAT | 25 | 3 | 4 | 5 |
| Excel | 15 | 5 | 3 | 4 |
| Attention to detail | 20 | 4 | 3 | 5 |
| Chasing documents | 10 | 3 | 4 | 2 |
| Sum of weight × score | | 380 | 395 | 395 |
| **Total score (÷ 5)** | | **76.0** | **79.0** | **79.0** |

How B's score is worked out: 30×5 + 25×4 + 15×3 + 20×3 + 10×4 = 150 + 100 + 45 + 60 + 40 = 395, then ÷ 5 = 79.0

B and C tie, so run `node decide.mjs score templates/score-example.json` (actually run 2026-10-28 · the script rescales each criterion to 0–100 by the best and worst candidate, so the numbers differ from total score ÷ 5): B 52 · C 52 · A 45, and it prints

`ผล: ยังไม่นิ่ง อันดับ 1 เปลี่ยนเมื่อ ปิดงบรายเดือน ×0.8 → C · ภาษีหัก ณ ที่จ่ายและ VAT ×1.2 → C · …`

Rank 1 can flip, so the score cannot decide in place of people. The interview panel discussed that the first-year job needs monthly close (B scored 5, C scored 3) more than tax and attention to detail (where C is better), so they chose B and wrote this reason down · C is kept as the reserve for 6 months per section 6 · nobody scored 1 on any criterion, so nobody fails a minimum.

**Offer to B** Salary 25,000 baht, start 1 Dec 2569, probation 119 days (1 Dec 2569 to 29 Mar 2570) · if the company dismisses after 120 consecutive days of work and no exception in section 7 applies, severance equals 30 days of the last wage rate = 25,000 ÷ 30 × 30 = 25,000 baht, and the company must still give advance notice or pay wages in lieu of notice.


## reference: hiring-th.md

<!-- merged from skill `hiring-th` on 2026-11-27 · description was: Use when a Thai employer hires staff -->
# Hiring one position (Thai employer side)

## Contents

- [0 · Find the existing template first (every time)](#0--find-the-existing-template-first-every-time)
- [1 · Work sequence](#1--work-sequence)
- [2 · A job ad that does not discriminate](#2--a-job-ad-that-does-not-discriminate)
- [3 · Scorecard](#3--scorecard)
- [4–8 · Details in separate files](#48--details-in-separate-files)
- [9 · Example: one accountant position](#9--example-one-accountant-position)
- [10 · Awaiting approval](#10--awaiting-approval)
- [11 · Links to other skills](#11--links-to-other-skills)

This skill walks through hiring one position, from drafting the job ad to the new employee finishing the first week. Every applicant gets the same questions and criteria. Applicant data is kept under the personal data protection law. The offer letter does not conflict with labour law.

This content is general information, not legal advice. For disputes, ask a labour inspector (hotline 1506 press 3, or 1546) or a labour lawyer.

## 0 · Find the existing template first (every time)

Before you use the outline or templates in this file, check whether the user, client or project already has its own:

- **Where to look:** the company's earlier job ads and careers page (tone, benefits already advertised) · search 3–5 ads for the same position in the same area or industry (JobThai · JobsDB · LinkedIn) to see the duties, skills and salary range the market writes
- **Result:** if found, use that template (headings, order, field names, running numbers) and say in the reply which file's template you used. If not found, use the templates in this file as the fallback and say that no earlier template was found.
- **Still required in every template:** the ad template in section 2 is the fallback · the anti-discrimination rules in section 2 apply to every template

## 1 · Work sequence

| # | Step | Output | Section |
|---|---|---|---|
| 1 | Write the work to be done in the first 90 days, then turn it into 4–6 criteria with weights | Scorecard | 3 |
| 2 | Draft the TH/EN job ad from the criteria in step 1, then remove discriminatory requirements | Ad ready to post | 2 |
| 3 | Screen applications with the scorecard. Everyone scores alone before discussing | Interview shortlist | 3 |
| 4 | Interview with the same questions, panel of 2–3, write down the answers | Score per candidate | 4 |
| 5 | Check references only for the person who will get an offer, after consent | Check record | 5 |
| 6 | Send the offer letter | Offer signed and accepted | 7 |
| 7 | Tell the candidates not selected, then set the data deletion date | Result emails · deletion date in the calendar | 6 |
| 8 | First week: social security · payroll · employment contract · leave | Completed checklist | 8 |

Steps 2 · 5 · 6 · 7 contain work that needs approval first (section 10).

## 2 · A job ad that does not discriminate

### Laws that touch a job ad

| Law | Effect on the job ad |
|---|---|
| Labour Protection Act B.E. 2541 (1998) Section 15 | The employer must treat male and female employees equally in employment, unless the nature or condition of the work makes that impossible · the same work must get the same pay for men and women (Section 53) |
| Gender Equality Act B.E. 2558 (2015) (in force 9 Sep 2015) | Bans unjust direct or indirect discrimination, exclusion or restriction of benefits because a person is male, female, or expresses a gender different from their birth sex · the government guide gives the example of a company advertising "รับเลขานุการเฉพาะเพศหญิง" (secretary, women only) when a qualified male applicant exists, as unjust discrimination between genders · not following an order of the Committee on Unjust Gender Discrimination (วลพ.) carries up to 6 months in prison, or a fine up to 20,000 baht, or both |
| PDPA Section 26 | Religion, health, disability, criminal record, biometric data and the other sensitive data in this section can be collected only with the data subject's explicit consent, or under an exception that the section states |
| Age | No law found that directly bans a private employer from stating an age range in a job ad · Constitution B.E. 2560 (2017) Section 27 paragraph 3 bans unjust discrimination because of age, sex, disability, religion and other grounds, but how far it binds private employers is not yet checked (`รอยืนยัน`, awaiting confirmation) |

Last checked 2026-10-23 · sources: [references/sources.md](sources.md)

### Wording to fix before posting

| Written like this | Rewrite as | Because |
|---|---|---|
| "รับเฉพาะเพศหญิง" · "ชายเท่านั้น" | Do not state gender. Write the work to be done instead · if the nature of the work truly needs one gender, record the reason for the work | Section 15 · Gender Equality Act |
| "โสด ไม่มีบุตร" | Remove | Unrelated to ability to do the job (recommended practice) · the government guide raises this case as a question to think about but does not rule on it |
| "อายุ 22–30 ปี" | "มีประสบการณ์ปิดงบรายเดือนอย่างน้อย 1 ปี" | The law does not yet ban it directly, but age does not measure ability and it removes strong candidates for no need (recommended practice) |
| "บุคลิกดี หน้าตาดี" | "คุยกับลูกค้าหน้าร้านได้วันละ 50 คน" | It cannot be measured, so it cannot be scored fairly |
| "ไม่มีโรคประจำตัว" · asking religion on the application | Remove · for jobs where the law requires a health check, do it after the offer, with explicit consent | PDPA Section 26 |
| "แนบรูปถ่ายเต็มตัว" | Do not ask for a photo | A photo invites judging by looks (recommended practice) |
| "ต้องวางเงินค้ำประกันการทำงาน" | Check the labour law limits first | See `thai-business-docs` → `references/doc-contract-th.md` section 4 (`รอยืนยัน`, awaiting confirmation: ministerial regulation on security deposits) |

### Job ad templates

Thai: [references/job-ad-thai.md](job-ad-thai.md) · English: [references/job-ad-english.md](job-ad-english.md) · Both open with the first-90-days work and measurable requirements, and end with the non-discrimination sentence and the link to the applicant privacy notice.

## 3 · Scorecard

Scorecard rules:

1. 4–6 criteria, tied to the work in the first 90 days, total weight 100.
2. Score 1–5, and write the descriptions for scores 1 · 3 · 5 before opening the first application (scores 2 and 4 sit in between).
3. Total score = sum of (weight × score) ÷ 5, which gives a maximum of 100.
4. A minimum requirement that rejects an applicant at once applies only to what the law or the job truly requires, such as a professional licence.
5. Everyone on the panel scores alone before discussing. If scores on the same criterion differ by 2 or more, open the notes, look at the evidence together, and then adjust.
6. After totalling, check stability with `decision-desk/decision-scoring` command `score` (`node decide.mjs score <file.json>` · scorecard weight ÷ 100 · every criterion `better: high` · minimum requirements from rule 4 go in `must`). The script shifts each criterion's weight by ±20% and reports whether the rank 1 result is `นิ่ง` (stable) or `ยังไม่นิ่ง` (not stable). If stable, make the offer to rank 1. If not stable (including tied totals), the panel decides between the top 2 itself, looking at how much the criterion that flipped the result matters to the job, and records the reason. Template: `templates/score-example.json`

| Criterion | Weight | 1 = | 3 = | 5 = | Evidence from |
|---|---|---|---|---|---|
| {main duty 1} | {…} | {cannot do it yet} | {can do it with someone checking} | {does it alone fully, has work to show} | CV · test · interview question {…} |
| {tool skill} | {…} | | | | Test {…} minutes |
| {working with others} | {…} | | | | Interview question {…} |

## 4–8 · Details in separate files

| Section | File |
|---|---|
| 4 Interview plan · 5 Reference and background checks · 6 Applicant data under the PDPA | [references/interview-reference-check-pdpa.md](interview-reference-check-pdpa.md) |
| 7 Offer letter · 8 First week | [references/offer-letter-first-week.md](offer-letter-first-week.md) |

## 9 · Example: one accountant position

Scorecard with 5 criteria · scores for 3 candidates · the `decide.mjs score` result showing `ยังไม่นิ่ง` (not stable), then the panel decides · an offer with a 119-day probation and the severance due if dismissed after 120 days → [references/example-accountant.md](example-accountant.md) (open it when you want the full example)

## 10 · Awaiting approval

These cannot be undone or affect people outside. The agent prepares drafts but does not do them.

- Posting the job ad on a job site or social media in the company's name
- Sending the offer letter (it binds the company once the applicant accepts)
- Telling an applicant they did not pass
- Contacting a referee or applying for a criminal record check
- Deleting real applicant data (the agent prepares the list of items past their deletion date for the user to confirm first)

## 11 · Links to other skills

| Need | Use |
|---|---|
| Full employment contract, and the clauses to flag for a lawyer | `thai-business-docs` |
| Probation, notice, severance, leave, minimum wage | `labour-law-basics.md` |
| Register insured persons and contributions | `social-security-th.md` |
| First payroll run, withholding tax and allowance forms | `payroll-th.md` |
| Leave forms and remaining leave balance | `doc-leave.md` |
| Privacy notice, ROPA and data subject requests | `pdpa-workflow` + agent `compliance-helper` |
| Result letters or letters to agencies | `thai-business-docs` + agent `thai-doc-writer` |
| Applicant side: CV · interview practice · salary negotiation | `job-search` (plugin `personal-life`) |


## reference: holidays-2569-2570.md

# Thai holidays 2569 (2026) and 2570 (2027)

Contents: 1. 2569 government and bank · 2. 2570 bank (announced) and government (pending) · 3. Islamic and regional days

## 1. 2569 (2026)

| Date | Day | Holiday | Govt | Bank |
|---|---|---|---|---|
| 1 Jan | Thu | วันขึ้นปีใหม่ | ✓ | ✓ |
| 2 Jan | Fri | วันหยุดพิเศษ (Cabinet 12 Nov 2024 [B.E. 2567]) | ✓ | ✓ |
| 3 Mar | Tue | วันมาฆบูชา | ✓ | ✓ |
| 6 Apr | Mon | วันจักรี | ✓ | ✓ |
| 13–15 Apr | Mon–Wed | วันสงกรานต์ | ✓ | ✓ |
| 1 May | Fri | วันแรงงานแห่งชาติ | — (government offices open) | ✓ |
| 4 May | Mon | วันฉัตรมงคล | ✓ | ✓ |
| 13 May | Wed | วันพืชมงคล | ✓ | — |
| 31 May → 1 Jun | Sun → Mon | วันวิสาขบูชา → substitute day | ✓ | ✓ |
| 3 Jun | Wed | วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี | ✓ | ✓ |
| 28 Jul | Tue | วันเฉลิมพระชนมพรรษา ร.10 | ✓ | ✓ |
| 29 Jul | Wed | วันอาสาฬหบูชา | ✓ | ✓ |
| 30 Jul | Thu | วันเข้าพรรษา | ✓ | — |
| 12 Aug | Wed | วันแม่แห่งชาติ | ✓ | ✓ |
| 13 Oct | Tue | วันนวมินทรมหาราช | ✓ | ✓ |
| 16 Oct | Fri | วันหยุดพิเศษ **Bangkok only** (Cabinet 19 May 2026 [B.E. 2569], IMF–World Bank meetings) | Bangkok only | Bangkok only (announced by the Bank of Thailand · BAHTNET and cheque clearing closed) |
| 23 Oct | Fri | วันปิยมหาราช | ✓ | ✓ |
| 5 Dec → 7 Dec | Sat → Mon | วันพ่อแห่งชาติ → substitute day | ✓ | ✓ |
| 10 Dec | Thu | วันรัฐธรรมนูญ | ✓ | ✓ |
| 31 Dec | Thu | วันสิ้นปี | ✓ | ✓ |

Last checked 2026-10-14 · Sources: https://image.mfa.go.th/mfa/0/kjBTSaxCcf/วันหยุด/วันหยุด2569/Holidays2026.pdf · https://www.bot.or.th/th/news-and-media/news/news-20260713.html (16 Oct, banks in Bangkok) · https://www.thaipbs.or.th/news/content/505358 (1 May) · https://www.infoquest.co.th/?p=64932 · https://www.thaipost.net/general-news/999175/ (16 Oct) · weekdays recomputed

## 2. 2570 (2027)

Bank holidays, from Bank of Thailand Notification No. 37/2569 (ประกาศธนาคารแห่งประเทศไทย ที่ 37/2569), Royal Gazette (ราชกิจจานุเบกษา) vol. 143, special part 202 ง, 25 Aug 2026 [B.E. 2569]:

| # | Date | Day | Holiday |
|---|---|---|---|
| 1 | 1 Jan | Fri | วันขึ้นปีใหม่ |
| 2 | 22 Feb | Mon | substitute for วันมาฆบูชา (Sun 21 Feb) |
| 3 | 6 Apr | Tue | วันจักรี |
| 4–6 | 13–15 Apr | Tue–Thu | วันสงกรานต์ |
| 7 | 3 May | Mon | substitute for วันแรงงาน (Sat 1 May) |
| 8 | 4 May | Tue | วันฉัตรมงคล |
| 9 | 20 May | Thu | วันวิสาขบูชา |
| 10 | 3 Jun | Thu | วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี |
| 11 | 19 Jul | Mon | substitute for วันอาสาฬหบูชา (Sun 18 Jul) |
| 12 | 28 Jul | Wed | วันเฉลิมพระชนมพรรษา ร.10 |
| 13 | 12 Aug | Thu | วันแม่แห่งชาติ |
| 14 | 13 Oct | Wed | วันนวมินทรมหาราช |
| 15 | 25 Oct | Mon | substitute for วันปิยมหาราช (Sat 23 Oct) |
| 16 | 6 Dec | Mon | substitute for วันพ่อแห่งชาติ (Sun 5 Dec) |
| 17 | 10 Dec | Fri | วันรัฐธรรมนูญ |
| 18 | 31 Dec | Fri | วันสิ้นปี |

Last checked 2026-10-06 · Sources: https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/ThaiPDF/25690175.pdf

Government 2570: cabinet list not yet found on 2026-10-06. Expect the bank list plus วันพืชมงคล (date รอยืนยัน) and วันเข้าพรรษา (Mon 19 Jul 2570, the day after อาสาฬหบูชา, รอยืนยัน), and any special days the cabinet adds. Treat all government-only dates as `(รอยืนยัน)` until announced.

## 3. Islamic and regional days

- The Islamic Bank of Thailand (ธนาคารอิสลามแห่งประเทศไทย) closes on วันอีฎิ้ลฟิตริ and วันอีฎิ้ลอัฎฮา per the Office of the Chularajmontri (สำนักจุฬาราชมนตรี).
- Bank branches in Narathiwat, Pattani, Yala, Satun and Songkhla also close on those two days and on วันตรุษจีน (Chinese New Year).
- Dates come from the Office of the Chularajmontri announcement each year (รอยืนยัน per year).


## reference: interview-reference-check-pdpa.md

# Interviews · reference checks · applicant data under the PDPA

Sections 4–6 of `thai-employment`, moved from `../SKILL.md`. Section numbers stay the same. Sections 1–3 and 9–11 are in `hiring-th.md`. Abbreviations: Act (พ.ร.บ.) · Section (ม.) · Personal Data Protection Act B.E. 2562 (2019) (PDPA).

## 4 · Interview plan

**45–60 minute outline (recommended practice)**

| Part | Time | What happens |
|---|---|---|
| Opening | 5 minutes | Introduce the panel, explain the steps, and say that you will take notes on the answers |
| Same questions for everyone | 30 minutes | 6–8 questions tied to the criteria on the scorecard · alternate experience questions ("เล่าครั้งที่คุณ…") with situation questions ("ถ้า… คุณจะทำอย่างไร") |
| Real work test | 0–20 minutes | If the candidate was not tested earlier, give everyone the same task and the same time |
| Candidate's questions | 10 minutes | Answer about the job, the team and the next steps |
| Closing | 2 minutes | Give the date when you will announce the result |

**Panel:** 2–3 people (line manager · a future teammate · HR). Split the criteria among them. The same person asks the same question of every candidate. Each person scores right after each interview ends.

**How to take notes:** Write what the candidate said and the numbers they gave ("ปิดงบ 3 บริษัท ตรงเวลา 11 จาก 12 เดือน"). Do not write impressions ("ดูไม่มั่นใจ"). Notes are personal data: keep and delete them as in section 6.

**Do not ask about:** plans to marry or have children · religion · chronic illness · sexual orientation · disability unrelated to the job. If the job truly needs a physical ability, ask every candidate the same question, "ทำงาน {X} ได้ไหม" (because of Section 15 · the Gender Equality Act · PDPA Section 26).

## 5 · Reference and background checks

PDPA Section 25 bans collecting personal data from any source other than the data subject. The exceptions: you tell the subject within 30 days of collecting and get consent, or the case is exempt under Section 24 or 26. The easiest route is to get written consent before you call. Criminal records are sensitive data under Section 26 and need explicit consent.

Last checked 2026-10-23 · Source: PDPA Sections 24 · 25 · 26 in the law book of the Personal Data Protection Committee Office (mdes.go.th link in section 2).

1. Check only the 1–2 final people who will get an offer.
2. Ask for consent covering: the names and phone numbers of referees the candidate chose · the questions you will ask · what you will use the answers for · how long you will keep them · no call to the current employer if the candidate does not allow it (recommended practice).
3. Ask every referee the same 5 questions.
4. Write the answers as heard. Use them as input to the score, never as the only basis for a decision.
5. Check criminal records only for roles where it truly matters (cash, customer data, children). Record only "ผ่าน" or "ต้องคุยต่อ", then delete the copy once the decision is made.

**The 5 questions**

1. คุณทำงานกับ {ชื่อผู้สมัคร} ในบทบาทอะไร ช่วงไหน
2. งานหลักที่เขารับผิดชอบคืออะไร ผลงานที่จำได้มีอะไรบ้าง
3. ถ้าให้เลือกงาน 1 อย่างที่เขาทำได้ดีที่สุด คืออะไร
4. เรื่องไหนที่เขาควรพัฒนาต่อ
5. ถ้ามีโอกาส คุณจะร่วมงานกับเขาอีกไหม เพราะอะไร

## 6 · Applicant data under the PDPA

**Privacy notice for applicants.** Give it before or when you collect data (Section 23). It must cover 6 points.

| Point required by Section 23 | What the notice says |
|---|---|
| Purpose | Used to consider hiring for the position {…} · legal basis: taking steps at the applicant's request before entering a contract (Section 24(3)) |
| Whether the data is required, and what happens if not given | Without a CV or a contact channel, the company cannot consider the application |
| Data collected and how long it is kept | Application data · interview notes · test results · reference check results · retention periods as in the table below |
| Who sees the data | The interview panel · HR · {the applicant tracking system provider} |
| Data controller and contact channel | {company name, address, email} · {Data Protection Officer, if any} |
| Applicant's rights | Access, copy, correct, delete, object, and withdraw consent, as the rights referred to in Section 23(6) · use `pdpa-workflow` for how to file a request |

**Retention periods.** These are recommended practice, not figures in the law. The law only says you must have a system to delete data once the retention period ends or it is no longer needed, under Section 37(3).

| Data | How long to keep | Because |
|---|---|---|
| Applications, notes and scores of people not selected | 6 months after the position closes, then delete | Covers the probation of the person hired. If that person fails, you can contact the next candidate. It is also long enough to answer questions about the selection result |
| Talent pool | 12 months, only for people who gave separate consent | Consent can be withdrawn at any time |
| Criminal record check results | Record "ผ่าน", then delete the copy once the decision is made | Sensitive data under Section 26. The less you keep, the lower the risk |
| Documents of the person hired | Move to the employee file and use the employee file's retention period | See `pdpa-workflow` and `payroll-th.md` |

Set the deletion date in the calendar from the day the position closes. Then record it in the ROPA (Record of Processing Activities) as in `pdpa-workflow`.


## reference: job-ad-english.md

# แม่แบบประกาศรับสมัคร (English)

Moved from `../SKILL.md` section 2 · the rules on words to fix before posting an ad stay in `hiring-th.md` section 2

```
Role: {title} · {team} · reports to {manager title}
Location: {district} · Work mode: {on-site / hybrid / remote}
Working days and hours: {…}
Salary: THB {min}–{max} per month

What you will deliver in the first 90 days
- {outcome 1, measurable}
- {outcome 2}
- {outcome 3}

Must have (each item is assessed in screening or interview)
- {skill or experience the job really uses}
- {licence required by law for this job, if any}

Nice to have: {…}
Benefits: Social Security · {others}

How to apply: send {CV / portfolio} to {email or link} by {date}
Process: CV screen → {…}-minute test → {…} interview round(s) → every applicant hears back within {…} days
We assess applicants on the skills the job needs, regardless of sex, gender expression, religion, disability or age.
Applicant data is used only to assess your application. Applicant privacy notice: {link}
```


## reference: job-ad-thai.md

# Job ad template (Thai)

Moved from `SKILL.md` section 2 · the English version is in [job-ad-english.md](job-ad-english.md)

```
ตำแหน่ง: {ชื่อตำแหน่ง} · {แผนก} · รายงานต่อ {ตำแหน่งหัวหน้า}
สถานที่ทำงาน: {เขตหรืออำเภอ} · รูปแบบ: {เข้าออฟฟิศ / ไฮบริด / ทำงานที่บ้าน}
วันและเวลาทำงาน: {…}
เงินเดือน: {ต่ำสุด}–{สูงสุด} บาท/เดือน

งานที่ต้องทำได้ใน 90 วันแรก
- {งานที่ 1 พร้อมผลที่วัดได้ เช่น ปิดงบรายเดือนภายในวันที่ 5}
- {งานที่ 2}
- {งานที่ 3}

คุณสมบัติที่ต้องมี (ทุกข้อจะวัดในการคัดกรองและสัมภาษณ์)
- {ทักษะหรือประสบการณ์ที่งานใช้จริง}
- {ใบอนุญาตที่กฎหมายกำหนดสำหรับงานนี้ ถ้ามี}

มีแล้วดี: {…}
สวัสดิการ: ประกันสังคม · {อื่น ๆ}

วิธีสมัคร: ส่ง {CV / แฟ้มผลงาน} ถึง {อีเมลหรือลิงก์} ภายใน {วันที่}
ขั้นตอน: คัดเอกสาร → แบบทดสอบ {…} นาที → สัมภาษณ์ {…} รอบ → แจ้งผลทุกคนภายใน {…} วันหลังสัมภาษณ์
บริษัทฯ พิจารณาจากความสามารถที่งานต้องใช้ ไม่เลือกปฏิบัติด้วยเหตุเพศ การแสดงออกทางเพศ ศาสนา ความพิการ หรืออายุ
ข้อมูลในใบสมัครใช้เพื่อพิจารณารับเข้าทำงานเท่านั้น อ่านประกาศความเป็นส่วนตัวสำหรับผู้สมัคร: {ลิงก์}
```


## reference: labour-law-basics.md

<!-- merged from skill `labour-law-basics` on 2026-11-27 · description was: Use for Thai Labour Protection Act questions -->
# Thai Labour Law Basics (พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541 และที่แก้ไขเพิ่มเติม)

## Contents

- [1. Working time](#1-working-time)
- [2. Overtime and holiday pay](#2-overtime-and-holiday-pay)
- [3. Leave entitlements](#3-leave-entitlements)
- [4. Probation, notice, pay in lieu](#4-probation-notice-pay-in-lieu)
- [5. Severance pay (ม.118)](#5-severance-pay-ม118)
- [5a. Check before dismissing](#5a-check-before-dismissing)
- [5b. Employee or freelancer](#5b-employee-or-freelancer)
- [6. Minimum wage](#6-minimum-wage)
- [Rules of thumb](#rules-of-thumb)
- [Related](#related)
- [References](#references)

These are the numbers HR is asked about every week. This is general information, not legal advice. Disputes go to the labour inspector (สำนักงานสวัสดิการและคุ้มครองแรงงาน, hotline 1546) or a labour lawyer. The Act sets a floor; a contract or work rules may give more, never less.

## 1. Working time

| Item | Rule | Section |
|---|---|---|
| Normal hours | ≤ 8 h/day and ≤ 48 h/week; hazardous work ≤ 7 h/day, 42 h/week | ม.23 |
| Break | ≥ 1 hour after no more than 5 consecutive hours | ม.27 |
| Weekly holiday | ≥ 1 day per week, at most 6 days apart | ม.28 |
| Traditional holidays | ≥ 13 days a year including Labour Day 1 May (see `thai-holidays.md`) | ม.29 |
| OT and holiday work | only with the employee's consent each time (except continuous/emergency work); OT + holiday OT ≤ 36 h/week | ม.24, กฎกระทรวง |

## 2. Overtime and holiday pay

| Situation | Pay | Section |
|---|---|---|
| OT on a working day | **1.5×** hourly wage per hour | ม.61 |
| Work during normal hours on a holiday — monthly-paid employee | **+1×** hourly wage (on top of the monthly salary) | ม.62(1) |
| Work during normal hours on a holiday — daily/hourly-paid employee | **2×** hourly wage | ม.62(2) |
| OT on a holiday (beyond normal hours) | **3×** hourly wage | ม.63 |
| Hourly wage of a monthly employee | monthly salary ÷ 30 ÷ normal hours per day | ม.68 |

Example: salary 24,000, 8-hour day → hourly 100. 3 h OT on Wednesday = 450. 8 h on a public holiday = 800 extra. 2 h after that = 600.

## 3. Leave entitlements

Full table with pay, documents and the 2568 changes: [references/leave-and-severance.md](leave-and-severance.md). Headline:

| Leave | Days | Paid |
|---|---|---|
| Sick | as actually sick | up to **30 working days/year**; employer may ask for a medical certificate for 3+ consecutive days |
| Annual | **≥ 6 working days** after 1 year of service | yes |
| Personal business (ลากิจ) | ≥ 3 working days/year | yes |
| Maternity | **120 days** (was 98) incl. prenatal visits | employer pays up to **60 days** (was 45); SSO pays its maternity cash separately |
| Paternity / helping spouse care for newborn | **15 working days** (new) | yes (รอยืนยัน pay rule in the final text) |
| Child care when the newborn is ill or disabled | +15 days | 50% of wage |
| Military, training, sterilisation | per ม.33, 35, 36 | military up to 60 days paid |

Changes in force from **7 Dec 2568** (พ.ร.บ.คุ้มครองแรงงาน (ฉบับที่ 9) พ.ศ. 2568).

## 4. Probation, notice, pay in lieu

- **Probation** — the Act sets no length. A probationer is an employee: dismissal still needs notice (ม.17). Service of **120 days or more** earns severance even during probation — hence "119-day probation" contracts.
- **Notice (ม.17)** — a fixed-term contract ends on its date without notice (para 1). For a contract with no fixed term, either side gives written notice **on or before a pay day** so the contract ends on the **next pay day**; no more than 3 months' notice is required (para 2). If the employer gives no reason in the dismissal letter, it cannot rely on ม.119 grounds afterwards (para 3). Paras 1-3 checked against the gazette text of the 2541 Act.
- **Pay in lieu (ม.17 para 4 · ม.17/1)** — the employer may pay the wages due up to the notice end date and let the employee leave at once (ม.17 para 4). If it dismisses without notice, ม.17/1 requires a sum equal to the wages the employee would have earned from the leaving date to the date the termination would have taken effect, paid on the leaving date.
- On termination also pay: unused annual leave pro rata (ม.67), outstanding wages and OT within 3 days (ม.70).

## 5. Severance pay (ม.118)

| Continuous service | Severance (days of last wage) |
|---|---|
| 120 days – under 1 year | 30 |
| 1 – under 3 years | 90 |
| 3 – under 6 years | 180 |
| 6 – under 10 years | 240 |
| 10 – under 20 years | 300 |
| 20 years or more | **400** |

- Retirement counts as termination — severance is due (ม.118/1). An employee over 60 may elect to retire with 30 days' notice.
- **Not owed (ม.119)** when dismissed for: dishonesty or a crime against the employer; intentional harm; negligence causing serious damage; breaching work rules after a written warning (valid 1 year) — serious cases need no warning; absent **3 consecutive working days** without good reason; imprisonment by final judgment.
- Extra severance applies for relocation (ม.120) and redundancy from new technology (ม.121–122).

Worked example: last wage 30,000/month (1,000/day), 7 years of service → 240 days × 1,000 = **240,000** + notice pay if no notice given.

## 5a. Check before dismissing

Run these 7 checks **before** the decision is made, not after the letter is written. Any check that hits → stop and send the case to a labour lawyer (ทนายความด้านแรงงาน) with the facts below. The numbers in sections 4 and 5 are what a dismissal costs when it is lawful; these checks are about whether it is.

| # | Check | Why it matters |
|---|---|---|
| 1 | Did the employee complain recently (to the owner, the labour office, or about pay or OT)? | a dismissal soon after a complaint looks like retaliation; ask "why now?" |
| 2 | Is the employee on leave, or just back from maternity or sick leave? | timing again; leave is a legal right (section 3) |
| 3 | Is the employee pregnant? | **ม.43 forbids dismissing a female employee because she is pregnant** |
| 4 | Is there a written warning for the conduct, still within 1 year? | ม.119 lets you skip severance for a rule breach only after a written warning, except serious cases (section 5) |
| 5 | Did others do the same thing without being dismissed? | unequal treatment points to another reason |
| 6 | Do the work rules or the contract promise a procedure (warning steps, hearing)? | skipping your own procedure weakens the case |
| 7 | Does the reason in the letter fit a ม.119 ground exactly, and is it written in the letter? | ม.17 para 3: a reason not written in the letter cannot be relied on later (section 4) |

Even a dismissal that pays full severance can be unfair. The Labour Court may order the employer to take the employee back at the same wage, or order compensation instead (พ.ร.บ.จัดตั้งศาลแรงงานและวิธีพิจารณาคดีแรงงาน ม.49). An employee who is part of a pending labour demand has extra protection under the Labour Relations Act (รอยืนยัน the section and its conditions).

## 5b. Employee or freelancer

Shops often pay admins, live hosts and video editors as "freelancers". What the contract calls them does not decide it; how the work is done does (`thai-business-docs` → `references/doc-contract-th.md` section 1: จ้างแรงงาน ม.575 vs จ้างทำของ ม.587).

| Points to employee | Points to freelancer (hire of work) |
|---|---|
| shop sets hours and the place, checks attendance | person chooses when and where, paid for the result |
| shop gives orders on how to do the work and can discipline | shop accepts or rejects the finished result only |
| paid by the month, day or hour | paid per piece, per clip, per job |
| shop provides the tools and accounts | person uses own tools |
| cannot send someone else in their place | may hire helpers or work for other shops |

These signs are general guidance, not a legal test (รอยืนยัน with a labour lawyer or the labour office, hotline 1546). Mostly the left column → treat as an employee: social security registration (`social-security-th.md`), wages through `payroll-th.md`, severance and leave rights in this skill. Mostly the right → a hire-of-work contract (`thai-business-docs`) and withholding tax on the fee (`thai-tax`). A mix → ask before the first payment, because back-paying social security and severance later costs more.

## 6. Minimum wage

Set by the Wage Committee (คณะกรรมการค่าจ้าง) by province. From 1 Jul 2568 (ประกาศฉบับที่ 14) the top rate is **400 baht/day** (Bangkok, Chonburi, Rayong, Chachoengsao, Phuket, Ko Samui district, and hotels and service venues nationwide) and the lowest is **337 baht/day**. The committee met 17 มี.ค. 2569 and postponed any 2569 raise, so these rates are still in force. Always look up the current announcement (ประกาศคณะกรรมการค่าจ้าง เรื่อง อัตราค่าจ้างขั้นต่ำ) on mol.go.th / wage.mol.go.th before quoting — a round for 2570 may come (รอยืนยัน).

## Rules of thumb

- 10+ employees → must have Thai-language work rules (ข้อบังคับเกี่ยวกับการทำงาน, ม.108) announced within 15 days of reaching 10 employees and posted at the workplace. No filing with the labour office since 2560 (NCPO Order 21/2560; sources: https://www.ilct.co.th/amendment-to-labour-protection-act/ · https://legardy.com/thai-law/labor-law/labor-law-section-9 — รอยืนยัน on mol.go.th / krisdika.go.th, checked 22 ต.ค. 2569).
- Put every warning, consent to OT and termination in writing.
- Pay on time: late wages carry 15% per year interest; wilful delay 15% every 7 days (ม.9).

## Related

`payroll-th.md` (OT in payroll) · `social-security-th.md` (maternity cash, unemployment) · `doc-leave.md` · `thai-business-docs` · `thai-holidays.md`.

## References

- [`leave-and-severance.md`](leave-and-severance.md) — open for the full leave table with pay, documents and the 2568 changes
- [`sources.md`](labour-law-basics/sources.md) — sources and check dates for sections 3, 4, 5a and 6


## reference: leave-and-severance.md

# Leave entitlements and termination checklist

General information under พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541 as amended to (ฉบับที่ 9) พ.ศ. 2568. Company rules may be more generous.

## Leave table

| Leave | Entitlement | Paid by employer | Section | Notes |
|---|---|---|---|---|
| Sick leave (ลาป่วย) | as actually sick | up to 30 working days a year | ม.32, ม.57 | medical certificate may be required for 3+ consecutive days; work injury leave does not count toward the 30 |
| Sterilisation leave | as the doctor certifies | yes | ม.33, ม.57 | |
| Personal business (ลากิจธุระอันจำเป็น) | ≥ 3 working days/year | yes, 3 days | ม.34, ม.57/1 | |
| Military service / reserve call-up | as called | up to 60 days/year | ม.35, ม.58 | |
| Training / skills development | per rules | not required | ม.36 | |
| Annual leave (ลาพักร้อน) | ≥ 6 working days after 1 year | yes | ม.30, ม.56 | may carry forward by agreement; unused paid on termination (ม.67) |
| Maternity (ลาคลอด) | **120 days** including prenatal visits | up to **60 days** | ม.41, ม.59 | was 98 days / 45 paid before 7 Dec 2568 |
| Spouse helping after birth | **15 working days** | yes (รอยืนยัน) | new 2568 | new since 7 Dec 2568 |
| Child care — newborn ill/disabled | +15 days | 50% of wage | new 2568 | |
| Pregnant employee | may ask for temporary lighter duties | — | ม.42 | no dismissal because of pregnancy (ม.43) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=551748 · https://flowaccount.com/blog/maternity-leave-law/

## Termination checklist

1. Reason documented; check ม.119 grounds if refusing severance (written warning on file?).
2. Notice dated at or before a pay day; otherwise compute pay in lieu (ม.17/1).
3. Severance per ม.118 table from the start date (probation counts).
4. Unused annual leave pro rata.
5. Final wages, OT, commission within 3 days of termination (ม.70).
6. SSO: สปส.6-09 by the 15th of next month (see `social-security-th.md`).
7. 50 ทวิ for the year to date (see `payroll-th.md`).
8. Work certificate (หนังสือรับรองการทำงาน) on request — required by ป.พ.พ. ม.585.
9. Severance under labour law is tax-exempt only when the employee was let go involuntarily (not retirement, not a contract that simply ended), and only up to the wages of the last 400 days, capped at **600,000 baht**; the rest is taxable. With 5 years of service or more, the employee may instead tax the one-off termination pay separately from other income. Checked 2026-11-10: Revenue Department guide to ภ.ง.ด.91, tax year 2568, [rd.go.th/fileadmin/tax_pdf/pit/2568/Ins91_241268.pdf](https://www.rd.go.th/fileadmin/tax_pdf/pit/2568/Ins91_241268.pdf). Withholding on the severance → the accountant.


## reference: leave-forms.md

# Leave form, ledger and annual summary

## 1. ใบลา (leave form)

```
ใบลา                                                    เลขที่ {LV2610-0001}
                                                       วันที่เขียน {6 ต.ค. 2569}
เรียน {ชื่อผู้บังคับบัญชา}

ข้าพเจ้า {ชื่อ-นามสกุล} รหัสพนักงาน {…} ตำแหน่ง {…} แผนก {…}
ขอลา  [ ] ป่วย  [ ] กิจ  [ ] พักผ่อนประจำปี  [ ] คลอด  [ ] ช่วยภรรยาดูแลบุตร
      [ ] รับราชการทหาร  [ ] ฝึกอบรม  [ ] ทำหมัน  [ ] อื่น ๆ {…}
เนื่องจาก {เหตุผล}
ตั้งแต่วันที่ {…} [ ] เต็มวัน [ ] ครึ่งเช้า [ ] ครึ่งบ่าย  ถึงวันที่ {…}  รวม {…} วันทำการ
ระหว่างลาติดต่อได้ที่ {โทรศัพท์}   ผู้รับมอบงาน {ชื่อ} งานที่ส่งมอบ {…}
เอกสารแนบ [ ] ใบรับรองแพทย์ [ ] สูติบัตร [ ] หนังสือเรียกพล [ ] อื่น ๆ

ลงชื่อ ……………… ผู้ลา

— สำหรับฝ่ายบุคคล —
ประเภทนี้ ปีนี้: สิทธิ {…} วัน  ใช้แล้ว {…}  ครั้งนี้ {…}  คงเหลือ {…}
[ ] ได้รับค่าจ้าง  [ ] ไม่ได้รับค่าจ้าง {…} วัน (เกินสิทธิตามกฎหมาย/ระเบียบ)
ผู้ตรวจสอบ ……………… วันที่ ………

— ความเห็นผู้บังคับบัญชา —
[ ] อนุมัติ  [ ] ไม่อนุมัติ เพราะ {…}
ลงชื่อ ……………… วันที่ ………      (ผู้อนุมัติขั้นที่ 2 ถ้ามี) ……………… วันที่ ………
```

## 2. Leave ledger (one row per request)

| เลขที่ | รหัส | ชื่อ | ประเภท | ตั้งแต่ | ถึง | วันทำการ | ได้รับค่าจ้าง | ไม่รับค่าจ้าง | คงเหลือหลังลา | ผู้อนุมัติ | วันที่อนุมัติ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| LV2610-0001 | E012 | {…} | พักผ่อน | 2026-09-30 | 2026-10-02 | 3.0 | 3.0 | 0 | 3.5 | {…} | 2026-09-24 |

## 3. Annual summary per employee (for year-end and termination)

| ประเภท | ยกมา | สิทธิปีนี้ | ใช้ | คงเหลือ | ยกไปปีหน้า | จ่ายแทนเมื่อพ้นสภาพ |
|---|---|---|---|---|---|---|
| พักผ่อน | | | | | | |
| ป่วย (ได้รับค่าจ้าง) | — | | | — | — | — |
| กิจ | — | | | — | — | — |

## Worked example (company policy numbers, not the legal minimum)

Company policy: 10 days annual leave a year, carry forward up to 5 days, pro-rata in the year of joining, round down to 0.5.
Employee joined 1 Apr 2568. In 2569 she carried forward 3 days.

| Item | Days |
|---|---|
| Carried forward from 2568 | 3.0 |
| Entitlement 2569 (full year) | 10.0 |
| Taken Jan–Sep | 6.5 |
| This request: Wed 30 Sep – Fri 2 Oct (3 working days) | 3.0 |
| **Balance after** | **3.5** |

Check the legal floor separately: the company's 10 days must be at least the statutory annual leave in `labour-law-basics.md`, and unused leave is paid out on termination per that skill.


## reference: offer-letter-first-week.md

# Offer letter · first week

Sections 7–8 of `thai-employment`, moved from `../SKILL.md`. Section numbers stay the same. Abbreviations: Act (พ.ร.บ.) · Section (ม.).

## 7 · Offer letter

```
{หัวกระดาษบริษัท}
วันที่ {วัน เดือน ปี พ.ศ.}
เรื่อง ข้อเสนอการจ้างงาน
เรียน คุณ{ชื่อ นามสกุล}

บริษัท {ชื่อ} จำกัด (บริษัทฯ) ยินดีเสนอการจ้างงานแก่คุณ ตามรายละเอียดดังนี้
1. ตำแหน่ง {…} สังกัด {แผนก} รายงานต่อ {ตำแหน่งหัวหน้า}
2. วันเริ่มงาน {วันที่} สถานที่ทำงาน {…} วันและเวลาทำงาน {…}
3. ค่าจ้าง เงินเดือน {…} บาท ({จำนวนเงินเป็นตัวอักษร}) ต่อเดือน ก่อนหักภาษีเงินได้และเงินสมทบประกันสังคม จ่ายทุกวันที่ {…} ของเดือน
4. สวัสดิการ {…}
5. ทดลองงาน {…} วัน นับจากวันเริ่มงาน ประเมินผลตามเกณฑ์ที่แนบ การเลิกจ้างระหว่างทดลองงานเป็นไปตามกฎหมายคุ้มครองแรงงาน
6. เงื่อนไขก่อนเริ่มงาน {เอกสารที่ต้องนำมา · ผลตรวจประวัติตามที่คุณให้ความยินยอม (ถ้ามี)}
7. บริษัทฯ และคุณจะลงนามสัญญาจ้างในวันเริ่มงาน ข้อกำหนดอื่นเป็นไปตามสัญญาจ้างและข้อบังคับเกี่ยวกับการทำงานของบริษัทฯ

กรุณาตอบรับเป็นลายลักษณ์อักษรภายในวันที่ {…} หากบริษัทฯ ไม่ได้รับคำตอบภายในวันดังกล่าว ข้อเสนอนี้เป็นอันสิ้นผล

ขอแสดงความนับถือ

({ชื่อผู้มีอำนาจลงนาม})
{ตำแหน่ง}

ข้าพเจ้ารับข้อเสนอข้างต้น
ลงชื่อ ................................ ({ชื่อผู้สมัคร})  วันที่ ................
```

**Probation, notice and severance: what the letter must not contradict**

- The Labour Protection Act does not set how long probation may last. A person on probation is an employee protected by law (พ.ร.บ.คุ้มครองแรงงาน).
- Ending employment during probation still needs advance written notice, given on or before any pay day, so that the termination takes effect on the next pay day (Section 17 paragraph 2). This applies to contracts with no fixed term. A fixed-term contract ends when the term ends, with no notice needed, under Section 17 paragraph 1.
- Without notice, the employer must pay an amount equal to the wages the employee would have earned from the day of dismissal to the day the termination takes effect. Pay it on the day of dismissal (Section 17/1).
- If the termination letter gives no reason, the employer cannot cite the Section 119 grounds later (Section 17 paragraph 3).
- Checked 2026-10-26. Section 17 against the text in the Royal Gazette, volume 115, part 8 ก, 20 Feb 1998 (B.E. 2541), page 6 (copy at web.archive.org of ratchakitcha.soc.go.th). Section 17/1 against the Labour Protection Act (No. 7) B.E. 2562 (2019), as cited by the Secretariat of the Senate at senate.go.th/assets/portals/93/fileups/272/files/Sub_Jun/12know/k147.pdf page 141. Not yet compared directly with the Royal Gazette issue for Act No. 7. Not yet checked that Acts No. 8 and 9 did not amend Section 17.
- Severance when the employer dismisses an employee who is not at fault starts once the employee has worked 120 days in a row. So a 119-day probation is common. It does not allow dismissal without notice.

| Continuous service | Severance (last wage rate) |
|---|---|
| 120 days but under 1 year | 30 days |
| 1 year but under 3 years | 90 days |
| 3 years but under 6 years | 180 days |
| 6 years but under 10 years | 240 days |
| 10 years but under 20 years | 300 days |
| 20 years or more | 400 days |

No severance is due when: the employee resigns · acts dishonestly in duty or commits an intentional crime against the employer · intentionally damages the employer · is negligent and causes the employer serious damage · breaks a lawful rule or order after receiving a written warning (a warning is valid for 1 year from the date of the offence; a serious case needs no warning) · abandons duty for 3 working days in a row without good reason · is sentenced to prison by a final judgment · and the fixed-term cases as the law states them.

Last checked 2026-10-23 · Source: https://www.labour.go.th/index.php/hm7/56-2011-06-02-03-42-46 (severance table and exceptions · the page still shows the old maternity leave figures, so use only the severance part)

**Caution:** If the applicant accepts and the company then withdraws the offer, it may become a breach of contract dispute (`รอยืนยัน`, awaiting confirmation). Ask a lawyer before withdrawing. Draft the full employment contract with `thai-business-docs`.

## 8 · First week: hand off to other skills

| Topic | Deadline | Use |
|---|---|---|
| Register the employee as an insured person | Within 30 days of the hire date · late or deliberately avoided registration carries up to 6 months in prison, or a fine up to 20,000 baht, or both | `social-security-th.md` |
| Employer registration | Registered partnerships and companies get an employer number automatically · an employer who is an individual must register as an employer | `social-security-th.md` |
| Allowance form · bank account · tax data into the payroll run | Before the first pay run | `payroll-th.md` |
| Employment contract signed | Start date | `thai-business-docs` |
| Leave entitlement and leave forms | First week | `doc-leave.md` · `labour-law-basics.md` |
| Privacy notice for employees · system access rights | Day 1 | `pdpa-workflow` |
| Work rules (10 or more employees) | As that skill states | `labour-law-basics.md` |
| Public holidays for the year | First week | `thai-holidays.md` |
| 100 employees reached | Count on 1 Oct every year · hire 1 person with a disability per 100 employees without disability, and 1 more for a remainder above 50 · if short, pay into the fund (Section 34) or use the alternatives under Section 35 · check the year's rate and payment date at dep.go.th (`รอยืนยัน` for 2027, B.E. 2570) | No dedicated skill |

Last checked 2026-10-23 · Sources: Social Security Office news, 30 Oct 2024 https://www.sso.go.th/wpr/main/news/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C_detail_detail_1_16_0/28904_28904 · automatic employer registration: Department of Business Development guide for newly formed legal entities https://www.dbd.go.th/storage/manual/644ffb30-f6bf-4e60-a3be-9db74a65509b.pdf · disability quota: Q&A of the Fund for Promotion and Development of the Quality of Life of Persons with Disabilities https://dfund.dep.go.th/%E0%B8%96%E0%B8%B2%E0%B8%A1-%E0%B8%95%E0%B8%AD%E0%B8%9A-%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%99%E0%B8%9E%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3/ · hotline 1506 press 3, or 1546: https://www.labour.go.th/index.php/labor-law


## reference: payroll-th.md

<!-- merged from skill `payroll-th` on 2026-11-27 · description was: Use when running Thai monthly payroll -->
# payroll-th — Thai monthly payroll: gross to net pay, filing and remittance

General information, not tax advice. Check unusual cases (bonus, stock, foreign staff) with an accountant.

## Use when
- Running monthly payroll: gross pay − social security (SSO) − provident fund (PVD) − personal income tax (PIT) = net pay, then file and remit.
- Year-end filing (ภ.ง.ด.1ก, 50 ทวิ).

Not for: SSO rules → `social-security-th.md` · OT rates and leave → `labour-law-basics.md` · VAT and other tax calendar → `thai-tax` · pay day falling on a holiday → `thai-holidays.md`.

## Steps

| # | Step | Output | Deadline |
|---|---|---|---|
| 1 | Close attendance: OT, unpaid leave, new joiners, leavers, then run the 9 checks below | timesheet | before cut-off |
| 2 | Gross = salary + OT + allowances + commission + taxable benefits | payroll register | |
| 3 | SSO employee and employer share at the rate, floor and cap in `social-security-th.md` section 1 | employee + employer share | |
| 4 | PVD employee % and employer % (if the company has a fund; rules in "Provident fund (PVD) basics" below) | | |
| 5 | PIT withholding by annualisation (below) | withholding tax (WHT) per head | |
| 6 | Net pay = gross − SSO − PVD − PIT − other agreed deductions | payslip | pay day per contract (at least once a month, ม.70) |
| 7 | File **ภ.ง.ด.1** and remit WHT | RD receipt | 7th next month (paper); e-Filing = paper deadline + the current e-Filing extension (look it up live, `thai-tax` → `references/tax-vat-th.md` section 2) |
| 8 | File **สปส.1-10** and remit SSO (both shares) | SSO receipt | deadline in `social-security-th.md` section 5 |
| 9 | Remit PVD to the fund manager | | per fund rules |
| 10 | Archive register, payslips, receipts: keep 5 years minimum, 7 recommended (`shop-books` → `references/sme-bookkeeping.md` section 2; per a Revenue Department ruling, not yet checked against the current statute) | | |

Year end: **ภ.ง.ด.1ก** (annual summary per employee) by end of February; give every employee **50 ทวิ** for the year (by February, รอยืนยัน exact day) and within 1 month after anyone leaves (รอยืนยัน).

### Check the inputs before step 5
Most errors are in the timesheet and employee list, not the tax maths. Run these 9 checks against the attendance file and last month's register:
1. Clock-in with no clock-out.
2. OT far above this person's normal month (real peak or typo; OT needs the employee's consent, `labour-law-basics.md` section 1, and pays 1.5× or 3×).
3. Zero hours for someone who normally works (unrecorded leave, left, or missing file).
4. Wage rate differs from last month (raise not approved in writing, or wrong row).
5. Duplicate or overlapping rows.
6. Leave beyond entitlement (`labour-law-basics.md` section 3).
7. Someone paid last month is missing (resigned, final pay per `labour-law-basics.md` section 4, or dropped by mistake).
8. New joiner with no starting documents (no ล.ย.01, no SSO registration).
9. Total payroll differs from last month by more than 10%: explain it in 1 line (new staff, OT, bonus) before paying.

- Never guess a missing time or fix a row quietly. Ask the owner one person and one issue at a time, and write the answer next to the row.
- SSO uses the wage floor and cap in `social-security-th.md`; a wage above the cap still pays the capped amount.
- The check summary lists names and issues only, never ID card numbers or bank account numbers (`pdpa-workflow`).

### PIT withholding on salary (ม.40(1)), annualisation per ม.50(1) ประมวลรัษฎากร
1. Annual income = monthly taxable pay × pay periods in the year (12, or remaining months for a mid-year joiner + income already paid).
2. Less expense deduction: 50% of income, max **100,000**.
3. Less allowances declared on ล.ย.01: personal **60,000**; spouse with no income 60,000; child 30,000 each (60,000 for 2nd+ child born 2561 or later); parents 30,000 each (aged 60+, income under 30,000); **SSO actually paid** (up to 12 × the monthly maximum in `social-security-th.md` section 1 = 10,500 in 2569, รอยืนยัน); PVD employee contributions (within 15% of wage, overall retirement cap 500,000); life/health insurance as declared.
4. Apply the progressive rates → annual tax. Bracket table: `thai-tax` "Income tax brackets"; the script reads the same rates from `scripts/rates.json`.
5. Monthly WHT = annual tax ÷ 12. Recalculate when salary changes or a bonus is paid.

Last checked 2026-10-06 (sources in [`sources.md`](payroll-th/sources.md)).

**Bonus month:** compute tax on (annual salary + bonus) and on annual salary alone; the difference is withheld in the bonus month on top of the normal monthly WHT.

**Script:** `node payroll.mjs <file.json> [--json]` runs steps 3–6 per person (input format, path and warnings: [`script-and-example.md`](script-and-example.md)). Rates live in `scripts/rates.json`; before the January run, check rd.go.th and edit it. The result is supporting information, not tax advice.

### Provident fund (PVD) basics
- Voluntary, set up by the employer with an asset manager under พ.ร.บ.กองทุนสำรองเลี้ยงชีพ 2530. Separate from SSO.
- Employee saves 2–15% of wage; employer contributes at least the employee's rate and not more than 15%.
- Employer's share can vest by years of service (e.g. 0% under 1 year → 100% at 5 years) — the fund's rules say.
- Tax: the employee contribution is an allowance; its limits are in PIT step 3 above.

### ภ.ง.ด.1 and ภ.ง.ด.1ก
- **ภ.ง.ด.1** monthly: 1 line per employee paid (tax ID, name, pay date, amount paid, tax withheld). No return needed in a month where nothing was paid.
- **ภ.ง.ด.1ก** yearly: totals per employee for the calendar year; must agree with the 12 ภ.ง.ด.1 returns and the 50 ทวิ issued (the usual audit question).
- 50 ทวิ certificate fields and template: [`50-tawi.md`](50-tawi.md).

### Rules
- Collect ล.ย.01 (allowance declaration) from each employee at hiring and each January; no form means personal allowance only.
- Never pay salary in cash without a signed receipt; bank transfer is the record.
- Payroll data is personal data: access-limited (`pdpa-workflow`).

## Check before done
- The 9 input checks were run and any flag was resolved with the owner.
- Net pay = gross − SSO − PVD − PIT − other deductions, and ภ.ง.ด.1 and สปส.1-10 dates are stated.
- Tax year rates in `rates.json` match rd.go.th for the current year.

## References
- [`script-and-example.md`](script-and-example.md) — open when running `payroll.mjs` or checking a worked example
- [`50-tawi.md`](50-tawi.md) — open when issuing a 50 ทวิ
- [`sources.md`](payroll-th/sources.md) — sources and check dates

## เรียกเป็นคำสั่ง

`/e-commerce:thai-employment [month|year-end] [--employees <file>]`

Run `thai-employment` with the `tax-helper` agent for: **the user's request**

Uses `social-security-th.md` for the SSO cap and `labour-law-basics.md` for OT rates. Produces the payroll register, payslip figures, and the filing dates for ภ.ง.ด.1 (7th on paper; e-Filing = paper deadline + the current extension, looked up live per `thai-tax` → `references/tax-vat-th.md` section 2) and สปส.1-10 (deadline in `social-security-th.md` section 5), ending with the accountant handoff checklist.


## reference: script-and-example.md

# payroll.mjs details and worked example

## Script

`payroll.mjs` runs all the steps of the annualisation method: annual income → deduct expenses → allowances → progressive tax → divide by 12 periods, together with social security (5% of wages, floor base 1,650 up to the cap, rounded to whole baht) and the employee's provident fund (PVD) contribution. It gives the monthly withholding tax and the net pay per person.

```
node payroll.mjs <file.json> [--json]     # example file: scripts/example.json
node payroll.mjs --self-test
```

Input file: `{ "employees": [ { "name": "...", "gross": 50000, "pvd_employee_pct": 0, "pvd_employer_pct": 0, "spouse": false, "children": 0, "children_2nd_plus": 0, "parents": 0, "other_deductions": 0, "periods": 12 } ] }`

- `name` and `gross` alone are enough to run; the rest default to 0 / false / 12.
- A wrong field makes the script stop with a message that names the field.
- Social security is computed from the average monthly wage (`gross` × `periods` ÷ 12) and spread across periods, so the annual allowance always equals 12 months.
- If the employee PVD exceeds 15% of wages, the script warns and allows only 15% as a deduction.
- The tax brackets, the social security cap and the allowances live in `scripts/rates.json` (it carries the date checked and the source; the script prints them in the result and warns when they are older than 90 days).
- The social security cap and the top rate are checked against `scripts/check/facts.json` at the root of the SQT-Marketplace repo (it does not ship with the plugin).
- Negative net pay, and a PVD value below 1 (for example 0.05 instead of 5), raise a warning.
- When the tax year changes, edit `rates.json` before running in January.
- Bonuses, mid-year hires and income already paid are not included; work them out yourself with the bonus rule in `payroll-th.md`.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-employment/scripts/payroll.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/thai-employment/scripts/payroll.mjs` · Node only, no dependencies.

## Worked example

Single employee, salary 50,000/month, no PVD.

| Line | Baht |
|---|---|
| Annual income 50,000 × 12 | 600,000 |
| Expense 50% capped | −100,000 |
| Personal allowance | −60,000 |
| SSO 875 × 12 | −10,500 |
| **Net income** | **429,500** |
| Tax: 7,500 + (429,500 − 300,000) × 10% | 7,500 + 12,950 = **20,450** |
| **Monthly WHT** 20,450 ÷ 12 | **1,704.17** |

Payslip: gross 50,000 − SSO 875 − WHT 1,704.17 = **net 47,420.83**.


## reference: social-security-th.md

<!-- merged from skill `social-security-th` on 2026-11-27 · description was: Use for Thai social security questions -->
# Thai Social Security (ประกันสังคม)

Who pays how much, what the money buys, and what the employer must file by when. This is general information, not legal advice. The Social Security Office (สำนักงานประกันสังคม, SSO, hotline 1506) has the final say.

## 1. The three kinds of insured person

| Section | Who | Base and rate | Monthly amount |
|---|---|---|---|
| **มาตรา 33** | Employees aged 15–60 of an employer with 1+ staff | 5% employee + 5% employer + 2.75% government, on wages between **1,650** and the cap | max **875** each side (2569–2571) |
| **มาตรา 39** | Former ม.33 who paid 12+ months and left within 6 months, choosing to stay in | 9% of a fixed base of **4,800** | **432** |
| **มาตรา 40** | Self-employed / informal workers not in ม.33 | Choose a plan | **70 / 100 / 300** |

### The wage cap is rising (มาตรา 33)

| Period | Wage cap | Max contribution (each of employee and employer) |
|---|---|---|
| until 31 Dec 2568 | 15,000 | 750 |
| **1 Jan 2569 – 2571** | **17,500** | **875** |
| 2572 – 2574 | 20,000 | 1,000 |
| 2575 onwards | 23,000 | 1,150 |

The 5% employee share covers: sickness, maternity, disability, death 1.5% · child allowance and old age 3% · unemployment 0.5%.
Minimum base 1,650 baht (ข่าวอ้างข้อความกฎกระทรวง "ไม่ต่ำกว่า 1,650 ไม่เกิน 17,500 ใช้ตั้งแต่ 1 ม.ค. 2569" ตรวจ 2026-10-22 · รอยืนยัน กับราชกิจจานุเบกษา).

Sources and check dates: [references/sources.md](social-security-th/sources.md)

## 2. Benefits (มาตรา 33 — seven cases)

| Case | Main benefit | Qualifying contributions |
|---|---|---|
| Sickness (non-work) | Free treatment at the chosen hospital; sick-pay 50% of wage for days off beyond employer-paid sick leave, up to 90 days per time / 180 per year | 3 months within the last 15 |
| Maternity | Lump sum **15,000** per birth + maternity cash 50% of wage for 90 days (รอยืนยัน whether SSO days changed with the 120-day leave law) + antenatal care up to 1,500 | 5 months within the last 15 |
| Disability | Monthly cash for life depending on severity, plus treatment | 3 months within the last 15 |
| Death (non-work) | Funeral grant 50,000 + survivor's lump sum by contribution years (รอยืนยัน) | 1 month within the last 6 |
| Child allowance | 1,000 per month per child aged 0–6, up to 3 children | 12 months within the last 36 |
| Old age | Pension 20% of the average last-60-months wage, +1.5% per year beyond 15 years — if 180+ months paid; otherwise lump sum | 180 months for pension |
| Unemployment | Laid off: **60%** of wage for up to 180 days from 28 Jun 2568 per the government news agency (กฎกระทรวง ฉบับที่ 2 พ.ศ. 2568), but SSO's own page (dated 3 Oct 2567, before the change) still says **50%** (รอยืนยัน which rate SSO pays now; gazette text not opened). Wage is the capped wage: SSO's page uses the 15,000 cap (ceiling 9,000/month at 60%, 7,500 at 50%); whether the 17,500 cap from 1 Jan 2569 applies to this benefit is (รอยืนยัน) · resigned or contract ended: 30% for up to 90 days · register online at e-service.doe.go.th (กรมการจัดหางาน) within 30 days; registered in time, pay starts from day 8 | 6 months within the last 15 |

The 17,500 cap from 1 Jan 2569 in section 1 still rests on news sources, no official page found (รอยืนยัน). Sources, checked 2026-11-10: [references/sources.md](social-security-th/sources.md)

มาตรา 39 gets the same except unemployment. มาตรา 40 benefits depend on the plan (70 = sickness, disability, death · 100 = + old-age lump sum · 300 = + child allowance).

## 3. Workmen's Compensation Fund (กองทุนเงินทดแทน)

- **Employer pays alone** — employees never contribute. Covers injury, illness, disability or death **from work**.
- Rate **0.2–1.0%** of annual payroll by business-risk category, applied to wages up to **240,000 baht per employee per year** (รอยืนยัน the per-head cap).
- Pay the estimated contribution by **31 January** each year; file the actual wage report (กท.20ก) by **28 February**.
- Work injury: employer reports on **กท.16** within **15 days** of knowing; the employee gets treatment at a network hospital and 70% of wage for days off.

## 4. Provident fund (กองทุนสำรองเลี้ยงชีพ, PVD)

Not social security. Rules and tax limits: `payroll-th.md` "Provident fund (PVD) basics".

## 5. Employer deadlines

| What | Form | Deadline |
|---|---|---|
| Register as employer when hiring the first employee | สปส.1-01 | within 30 days |
| Register a new employee | สปส.1-03 | within 30 days of start |
| Employee leaves | สปส.6-09 | by the 15th of the month after leaving |
| Monthly contribution and wage report | **สปส.1-10** | by the **15th** of the following month (e-Service at sso.go.th, bank or counter) |
| Late monthly contribution | — | surcharge **2% per month** on the unpaid amount |

## Workflow

1. Identify the section (33 / 39 / 40) and, for employers, headcount and payroll.
2. Compute the contribution: min(max(wage, 1,650), cap) × 5% — round to the baht per SSO rules.
3. For a claim, list the qualifying condition from section 2, the documents (ID card, bank book, medical certificate or birth certificate) and where to file (e-Self Service / SSO branch).
4. For employers, add section 5 dates to the calendar from `thai-tax`.

## Worked example

Salary 30,000. Base capped at 17,500 → employee 875, employer 875. Salary 12,000 → 600 each. Employer with 10 staff at 20,000 remits 17,500 SSO by the 15th (8,750 employer share + 8,750 withheld from staff), plus Workmen's Compensation at, say, 0.2% × (20,000 × 12 × 10) = 4,800 for the year.

## Related

`payroll-th.md` (deduction in the payslip · provident fund) · `labour-law-basics.md` (leave, maternity) · `thai-tax` · `thai-holidays.md`.


## reference: sources.md

# Sources for the law tables in `hiring-th.md` section 2

Last checked 2026-10-23

- Sections 15 and 53 of the Labour Protection Act B.E. 2541 (1998), as summarised by the Department of Labour Protection and Welfare (the full text from the Royal Gazette and mol.go.th could not be opened): https://www.labour.go.th/index.php/hm7/60-2011-06-02-03-47-12
- Public guide to the Gender Equality Act, updated 2018, by the Department of Women's Affairs and Family Development: https://www.tmd.go.th/media/personnel/hr/act-gender-2558.pdf
- PDPA text in the Personal Data Protection Committee Office's law book (Royal Gazette volume 136, part 69 a): https://mdes.go.th/uploads/tinymce/source/%E0%B8%AA%E0%B8%84%E0%B8%AA/%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%B8%E0%B9%89%E0%B8%A1%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%20(2).pdf
- Section 27 of the Constitution B.E. 2560 (2017), as published by the Senate: https://www.senate.go.th/assets/portals/13/files/%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B9%E0%B8%8D%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AD%E0%B8%B2%E0%B8%93%E0%B8%B2%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A3%20%E0%B8%9E%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%8A%20%E0%B9%92%E0%B9%95%E0%B9%96%E0%B9%90.pdf


## reference: thai-holidays.md

<!-- merged from skill `thai-holidays` on 2026-11-27 · description was: Use when planning around Thai public holidays -->
# Thai Holidays Planner

Three calendars exist and they differ. Pick the right one before planning anything.

## 1. Which calendar applies

| Calendar | Set by | Who follows it | Typical differences |
|---|---|---|---|
| **วันหยุดราชการ** (government) | มติคณะรัฐมนตรี, usually announced the year before | ministries, schools, state agencies | adds วันพืชมงคล and วันเข้าพรรษา; cabinet may add special days (วันหยุดพิเศษ) late |
| **วันหยุดสถาบันการเงิน** (bank) | ประกาศธนาคารแห่งประเทศไทย in ราชกิจจานุเบกษา, around August of the year before | banks, SET, payment cut-offs, filing deadlines that fall on a bank holiday | no วันพืชมงคล / วันเข้าพรรษา; follows special days only if BOT re-announces |
| **วันหยุดตามประเพณี** of a private company | the employer, at least **13 days/year including วันแรงงาน** (พ.ร.บ.คุ้มครองแรงงาน ม.29) | private employees | the company picks from the official list; if a holiday falls on the weekly rest day, the next working day is off (ม.29) |

Rule of thumb: payroll date, tax and SSO deadlines, and transfers follow the **bank** calendar; staff days off follow the **company** announcement (see `labour-law-basics.md` for holiday pay).

## 2. Substitution days (วันหยุดชดเชย)

- A holiday falling on Saturday or Sunday moves to the next working day **only when the announcement says so** — check the list, don't compute it yourself.
- Songkran on a weekend usually gets a substitution day; Buddhist days falling on a weekend do too in recent years (e.g. วิสาขบูชา 31 May 2569 → Monday 1 June).
- Private companies: ม.29 obliges a substitute day when a traditional holiday the company chose falls on the weekly rest day.

## 3. Lists

Full 2569 and 2570 tables with weekdays and sources: [references/holidays-2569-2570.md](holidays-2569-2570.md).

Headline for 2569 (2026): 2 Jan special day · Songkran 13–15 Apr · วิสาขบูชา substitution 1 Jun · 16 Oct special holiday **Bangkok only** for government and banks (IMF–World Bank meetings) · พ่อแห่งชาติ substitution 7 Dec.

## 4. Business flags

| Day | Flag |
|---|---|
| มาฆบูชา, วิสาขบูชา, อาสาฬหบูชา, เข้าพรรษา, ออกพรรษา | no alcohol sales (สุรา) nationwide; alcohol promotions off; tone respectful |
| 12 Aug, 5 Dec, royal birthdays, memorial days (13 Oct, 23 Oct) | respectful tone; no slapstick campaigns |
| Songkran, New Year | courier cut-offs 2–4 days earlier; customer service staffing; plan stock |
| Long weekends (4+ days) | travel demand up, B2B response slow; avoid launch or deadline |
| Periods of national mourning or elections | pause promotions until the official announcement ends |

## 5. Yearly update (do this every September)

1. Look for the **BOT announcement** for next year on bot.or.th (วันหยุดสถาบันการเงิน) — usually published in August.
2. Look for the **cabinet resolution** on government holidays (thaigov.go.th / ราชกิจจานุเบกษา); special days can be added mid-year — re-check in May and September.
3. Lunar Buddhist days move every year — take dates from the announcement, never from a formula.
4. Update `holidays-2569-2570.md` (add the new year, drop the oldest), with "ตรวจล่าสุด" and the source URL.
5. Company: issue the staff holiday announcement (13+ days) before 1 January.

## Rules

- The official announcement is the only source; aggregator lists (even news sites) have had wrong weekdays.
- If a year is not announced yet, mark every date `(รอยืนยัน)`.
- Marketing flags are guidance; when unsure, stay quiet and respectful.

## Related

`labour-law-basics.md` (holiday pay, ม.29) · `payroll-th.md` (pay day on a holiday) · `thai-tax` (deadline moves to next working day) · `line-oa` (timing).
