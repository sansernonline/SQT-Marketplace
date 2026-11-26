---
name: hiring-th
description: Use when a Thai employer hires staff
---

# Hiring one position (Thai employer side)

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

Last checked 2026-10-23 · sources: [references/sources.md](references/sources.md)

### Wording to fix before posting

| Written like this | Rewrite as | Because |
|---|---|---|
| "รับเฉพาะเพศหญิง" · "ชายเท่านั้น" | Do not state gender. Write the work to be done instead · if the nature of the work truly needs one gender, record the reason for the work | Section 15 · Gender Equality Act |
| "โสด ไม่มีบุตร" | Remove | Unrelated to ability to do the job (recommended practice) · the government guide raises this case as a question to think about but does not rule on it |
| "อายุ 22–30 ปี" | "มีประสบการณ์ปิดงบรายเดือนอย่างน้อย 1 ปี" | The law does not yet ban it directly, but age does not measure ability and it removes strong candidates for no need (recommended practice) |
| "บุคลิกดี หน้าตาดี" | "คุยกับลูกค้าหน้าร้านได้วันละ 50 คน" | It cannot be measured, so it cannot be scored fairly |
| "ไม่มีโรคประจำตัว" · asking religion on the application | Remove · for jobs where the law requires a health check, do it after the offer, with explicit consent | PDPA Section 26 |
| "แนบรูปถ่ายเต็มตัว" | Do not ask for a photo | A photo invites judging by looks (recommended practice) |
| "ต้องวางเงินค้ำประกันการทำงาน" | Check the labour law limits first | See `doc-contract-th` section 4 (`รอยืนยัน`, awaiting confirmation: ministerial regulation on security deposits) |

### Job ad templates

Thai: [references/job-ad-thai.md](references/job-ad-thai.md) · English: [references/job-ad-english.md](references/job-ad-english.md) · Both open with the first-90-days work and measurable requirements, and end with the non-discrimination sentence and the link to the applicant privacy notice.

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
| 4 Interview plan · 5 Reference and background checks · 6 Applicant data under the PDPA | [references/interview-reference-check-pdpa.md](references/interview-reference-check-pdpa.md) |
| 7 Offer letter · 8 First week | [references/offer-letter-first-week.md](references/offer-letter-first-week.md) |

## 9 · Example: one accountant position

Scorecard with 5 criteria · scores for 3 candidates · the `decide.mjs score` result showing `ยังไม่นิ่ง` (not stable), then the panel decides · an offer with a 119-day probation and the severance due if dismissed after 120 days → [references/example-accountant.md](references/example-accountant.md) (open it when you want the full example)

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
| Full employment contract, and the clauses to flag for a lawyer | `doc-contract-th` |
| Probation, notice, severance, leave, minimum wage | `labour-law-basics` |
| Register insured persons and contributions | `social-security-th` |
| First payroll run, withholding tax and allowance forms | `payroll-th` |
| Leave forms and remaining leave balance | `doc-leave` |
| Privacy notice, ROPA and data subject requests | `pdpa-workflow` + agent `compliance-helper` |
| Result letters or letters to agencies | `doc-thai-official` + agent `thai-doc-writer` |
| Applicant side: CV · interview practice · salary negotiation | `resume-th-en` · `interview-prep` · `salary-negotiation` (plugin `personal-life`) |
