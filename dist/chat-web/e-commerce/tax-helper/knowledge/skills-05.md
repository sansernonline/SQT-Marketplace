# skill: hiring-th

Use when a Thai employer hires staff

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


## reference: interview-reference-check-pdpa.md

# Interviews · reference checks · applicant data under the PDPA

Sections 4–6 of `hiring-th`, moved from `../SKILL.md`. Section numbers stay the same. Sections 1–3 and 9–11 are in SKILL.md. Abbreviations: Act (พ.ร.บ.) · Section (ม.) · Personal Data Protection Act B.E. 2562 (2019) (PDPA).

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
| Documents of the person hired | Move to the employee file and use the employee file's retention period | See `pdpa-workflow` and `payroll-th` |

Set the deletion date in the calendar from the day the position closes. Then record it in the ROPA (Record of Processing Activities) as in `pdpa-workflow`.


## reference: job-ad-english.md

# แม่แบบประกาศรับสมัคร (English)

Moved from `../SKILL.md` section 2 · the rules on words to fix before posting an ad stay in SKILL.md section 2

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


## reference: offer-letter-first-week.md

# Offer letter · first week

Sections 7–8 of `hiring-th`, moved from `../SKILL.md`. Section numbers stay the same. Abbreviations: Act (พ.ร.บ.) · Section (ม.).

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

**Caution:** If the applicant accepts and the company then withdraws the offer, it may become a breach of contract dispute (`รอยืนยัน`, awaiting confirmation). Ask a lawyer before withdrawing. Draft the full employment contract with `doc-contract-th`.

## 8 · First week: hand off to other skills

| Topic | Deadline | Use |
|---|---|---|
| Register the employee as an insured person | Within 30 days of the hire date · late or deliberately avoided registration carries up to 6 months in prison, or a fine up to 20,000 baht, or both | `social-security-th` |
| Employer registration | Registered partnerships and companies get an employer number automatically · an employer who is an individual must register as an employer | `social-security-th` |
| Allowance form · bank account · tax data into the payroll run | Before the first pay run | `payroll-th` |
| Employment contract signed | Start date | `doc-contract-th` |
| Leave entitlement and leave forms | First week | `doc-leave` · `labour-law-basics` |
| Privacy notice for employees · system access rights | Day 1 | `pdpa-workflow` |
| Work rules (10 or more employees) | As that skill states | `labour-law-basics` |
| Public holidays for the year | First week | `thai-holidays` |
| 100 employees reached | Count on 1 Oct every year · hire 1 person with a disability per 100 employees without disability, and 1 more for a remainder above 50 · if short, pay into the fund (Section 34) or use the alternatives under Section 35 · check the year's rate and payment date at dep.go.th (`รอยืนยัน` for 2027, B.E. 2570) | No dedicated skill |

Last checked 2026-10-23 · Sources: Social Security Office news, 30 Oct 2024 https://www.sso.go.th/wpr/main/news/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C_detail_detail_1_16_0/28904_28904 · automatic employer registration: Department of Business Development guide for newly formed legal entities https://www.dbd.go.th/storage/manual/644ffb30-f6bf-4e60-a3be-9db74a65509b.pdf · disability quota: Q&A of the Fund for Promotion and Development of the Quality of Life of Persons with Disabilities https://dfund.dep.go.th/%E0%B8%96%E0%B8%B2%E0%B8%A1-%E0%B8%95%E0%B8%AD%E0%B8%9A-%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%99%E0%B8%9E%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3/ · hotline 1506 press 3, or 1546: https://www.labour.go.th/index.php/labor-law


## reference: sources.md

# Sources for the law tables in SKILL.md section 2

Last checked 2026-10-23

- Sections 15 and 53 of the Labour Protection Act B.E. 2541 (1998), as summarised by the Department of Labour Protection and Welfare (the full text from the Royal Gazette and mol.go.th could not be opened): https://www.labour.go.th/index.php/hm7/60-2011-06-02-03-47-12
- Public guide to the Gender Equality Act, updated 2018, by the Department of Women's Affairs and Family Development: https://www.tmd.go.th/media/personnel/hr/act-gender-2558.pdf
- PDPA text in the Personal Data Protection Committee Office's law book (Royal Gazette volume 136, part 69 a): https://mdes.go.th/uploads/tinymce/source/%E0%B8%AA%E0%B8%84%E0%B8%AA/%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%B8%E0%B9%89%E0%B8%A1%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%20(2).pdf
- Section 27 of the Constitution B.E. 2560 (2017), as published by the Senate: https://www.senate.go.th/assets/portals/13/files/%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B9%E0%B8%8D%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AD%E0%B8%B2%E0%B8%93%E0%B8%B2%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A3%20%E0%B8%9E%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%8A%20%E0%B9%92%E0%B9%95%E0%B9%96%E0%B9%90.pdf


---

# skill: thai-business-setup

Use when starting a Thai business

# Starting a business in Thailand: choose a form and register

This skill helps the user choose between trading as an individual, a partnership or a company. It walks them through registration, then through the checklist after registration. The content is general information, not tax or legal advice. An accountant should recalculate the tax figures for a real business.

## 1 · Choosing a business form

Compare 4 forms (individual + commercial registration (ทะเบียนพาณิชย์) · registered ordinary partnership (ห้างหุ้นส่วนสามัญนิติบุคคล) · limited partnership (ห้างหุ้นส่วนจำกัด) · limited company (บริษัทจำกัด)) by liability for debts, capital, where to register, fees and tax (progressive 0–35% for an individual, the juristic person rate for the others). The full table, the order of questions for choosing a form and the sources checked 2026-10-23 are in [`references/business-forms.md`](references/business-forms.md). Open that file before answering which form to register.

## 2 · Income tax: individual vs juristic person

The individual tax brackets (tax year 2025 (B.E. 2568)), the SME juristic person rates, the 3 profit scenarios and how to run `decide.mjs` with `tax-compare.mjs` are in [`references/income-tax-compare.md`](references/income-tax-compare.md). These figures do not yet include the second layer of tax when money leaves the company. Open that file before comparing numbers.

## 3 · Registration

An individual registers commercial registration (anyone selling online must register). Partnerships and companies register through DBD Biz Regist (online only from 1 Nov 2026 (B.E. 2569)). The steps, fees and sources checked are in [`references/registration.md`](references/registration.md). Check the rate in the system before every payment.

## 4 · After registration: checklist

| Task | When | Use |
|---|---|---|
| Open a bank account in the business name, separate from personal money | Right away | Recommended practice |
| Juristic person: keep books from the registration date · appoint a qualified bookkeeper · close the first accounting period within 12 months · keep books and documents for at least 5 years from the closing date | Right away | `dbd-annual-filing` |
| Register for VAT when revenue from selling goods or services exceeds 1.8 million baht a year. File the request within 30 days of the date revenue passes it · below that, the owner can still register voluntarily · a juristic person can file the VAT request together with the incorporation request | By revenue | `tax-vat-th` |
| Issue electronic tax invoices (e-Tax Invoice) | After VAT registration | `e-tax-invoice` |
| First hire: register the employee as an insured person within 30 days of the start date · an employer who is an individual must register as an employer themselves | When hiring | `hiring-th` · `social-security-th` |
| Withholding tax and monthly VAT | Every month | `tax-vat-th` |
| Payroll | Every month | `payroll-th` |
| Financial statements and yearly tax | After the accounting year closes | `dbd-annual-filing` |
| Privacy notice for customers and staff | Before collecting data | `pdpa-workflow` |
| Quotation, invoice, receipt · PromptPay QR | When sales open | `doc-quotation` · `promptpay-qr` |

Last checked 2026-10-23 · sources: [`references/sources.md`](references/sources.md)

## 5 · Import cost from China

Moved to the skill `import-landed-cost` (CIF formula, duty and VAT · 2026 rules · by road or by sea · script `landed-cost.mjs`).

## 6 · When to ask an accountant or lawyer

- Before choosing a form, if profit is expected to exceed 1 million baht a year or partners put in unequal amounts (recommended practice)
- A shareholder, partner or director is a foreigner · DBD asks for extra documents under the orders of the Central Partnership and Company Registration Office (company: no. 2/2569 · partnership: no. 205/2555), and the law on foreign business operation needs a lawyer's review
- Registered capital over 5 million baht · DBD asks for extra documents under order no. 1/2567
- Revenue is near 1.8 million baht, or the business is about to register for VAT
- Financial statements or tax were filed late (penalties grow every day; see `dbd-annual-filing`)

## 7 · รออนุมัติ (awaiting approval)

These steps cannot be undone or they affect outsiders. The agent prepares the data and drafts, but does not do them.

- Filing a real registration, verifying identity or paying a fee in a government system
- Signing a partnership agreement or a lease
- Filing a VAT registration request
- Entering the user's password, identity verification code or account number

## 8 · Links to other skills

| Need | Use |
|---|---|
| Tax for an online seller who is an individual (deducting expenses · ภ.ง.ด.90 (PND 90) and 94 (PND 94)) | `seller-tax-basics` |
| Monthly filing of VAT, withholding tax and penalties | `tax-vat-th` + agent `tax-helper` |
| Partnership, lease and work-for-hire contracts | `doc-contract-th` |
| Setting a selling price on Shopee, Lazada and TikTok Shop once the cost is known | `marketplace-fees-pricing` |
| Comparing domestic carriers | `shipping-compare` |
| Naming the business before reserving the name | `product-naming` (plugin `software-development`) |


## reference: business-forms.md

# Choosing a business form (moved from SKILL.md section 1)

Part of the skill `thai-business-setup`. For the abbreviations, see the top of SKILL.md.

## 1 · Choosing a business form

| Topic | Individual + commercial registration (บุคคลธรรมดา + ทะเบียนพาณิชย์) | Registered ordinary partnership (ห้างหุ้นส่วนสามัญนิติบุคคล) | Limited partnership (ห้างหุ้นส่วนจำกัด) | Limited company (บริษัทจำกัด) |
|---|---|---|---|---|
| Founders | 1 person | 2 or more partners | 2 or more partners | 2 or more promoters (ผู้เริ่มก่อการ) |
| Liability for debts | The owner is fully liable. The business is not separate from the person. | Every partner is jointly liable without limit. | Limited-liability partners: up to the amount they invested, and they cannot manage the business. Unlimited-liability partners: no limit, and they act as managing partners. | Shareholders are liable only for unpaid share value. |
| Contribution | The owner's money | Money, property or labour | Money, property or labour (limited-liability partners cannot contribute labour) | Shares with a par value of at least 5 baht, with at least 25% called up |
| Register at | District office (Bangkok) · municipality · subdistrict administrative organization (อบต.) · Pattaya City | DBD Biz Regist (online) | DBD Biz Regist | DBD Biz Regist |
| Government fee | 50 baht | 1,000 baht | 1,000 baht | 5,500 baht (memorandum of association 500 + company registration 5,000) + stamp duty 200 (+200 if there are articles of association) |
| Accounting and auditor | No auditor. Keep income and expense records for tax filing (รอยืนยัน (awaiting confirmation): an individual's bookkeeping duty). | A qualified bookkeeper · a licensed auditor, except a partnership with capital up to 5 million, assets up to 30 million and revenue up to 30 million baht (but ภ.ง.ด.50 (PND 50, corporate income tax return) must attach the report of the person who audited and certified the accounts) | Same as the registered ordinary partnership | A qualified bookkeeper + a licensed auditor who audits the financial statements every year |
| Income tax | Progressive rate 0–35% (section 2) | Corporate income tax (section 2) | Corporate income tax | Corporate income tax |
| Yearly filings | ภ.ง.ด.90 and ภ.ง.ด.94 (PND 90 and PND 94, individual income tax returns; see `seller-tax-basics`) | Financial statements + ภ.ง.ด.50 (see `dbd-annual-filing`) | Financial statements + ภ.ง.ด.50 | Shareholder meeting + financial statements + บอจ.5 (shareholder list) + ภ.ง.ด.50 |

**Decide with 5 questions**

1. Are you working alone or with partners? One person can start as an individual. A company needs 2 or more promoters.
2. Could the business take on a large debt or be sued (a loan · a high-value contract · a product that could injure someone)? If so, choose a form that limits liability.
3. About how much is the yearly profit? Then compare the tax as in section 2. At a profit of about 1 million baht, the tax is close for both forms. What differs is the yearly bookkeeping and audit burden.
4. Are your customers companies that want a tax invoice and withhold tax? Many business customers find it easier to buy from a juristic person (common practice, not law).
5. Can you carry the yearly bookkeeping and audit cost? Get quotes from 2–3 accounting firms before registering. The fees are market prices, with no official rate.

You can start small and move up later: a partnership can convert into a company for a 5,000 baht fee.

Last checked 2026-10-23 · Sources: the DBD manual for newly registered juristic persons (liability · bookkeeper · auditor · employer registration) https://www.dbd.go.th/storage/manual/644ffb30-f6bf-4e60-a3be-9db74a65509b.pdf · registering a partnership https://www.dbd.go.th/storage/manual/66c900f7-4df6-4344-b0c4-cd11a2ab7b20.pdf · registering a company in one day https://www.dbd.go.th/storage/manual/0097faba-992d-4e07-8f37-d029a4d6c133.pdf · commercial registration https://www.dbd.go.th/storage/manual/43eec450-c4b5-4fe5-9b9e-2814d961eeec.pdf · Ministerial Regulation on partnership and limited company fees, B.E. 2563 (2020) (กฎกระทรวงค่าธรรมเนียมห้างหุ้นส่วนและบริษัทจำกัด พ.ศ. 2563, Royal Gazette vol. 137, part 106 ก) https://www.dbd.go.th/data-storage/attachment/561b5f78c634931010a7d26420.PDF


## reference: income-tax-compare.md

# Income tax: individual vs juristic person (moved from SKILL.md section 2)

Part of the skill `thai-business-setup`. `seller-tax-basics/scripts/tax-compare.mjs` uses this set of figures.

## 2 · Income tax: individual vs juristic person

**Individual** (tax year 2025 (B.E. 2568), per the ภ.ง.ด.90 (PND 90, individual income tax return) instructions)

Bracket table with the cumulative tax at the top of each band: `seller-tax-basics` "Income tax brackets".

Someone with income other than salary of 120,000 baht or more must also use a second method: assessable income (excluding salary) × 0.5%. They pay whichever method gives more tax. If the second method comes to 5,000 baht or less, they pay by the bracket table in `seller-tax-basics`. The personal allowance is 60,000 baht. For how a seller deducts expenses, use `seller-tax-basics`.

**Juristic person**

| Type | Net profit | Rate |
|---|---|---|
| SME: paid-up capital at the last day of the accounting period of up to 5 million baht, and revenue from goods and services of up to 30 million baht | Up to 300,000 | Exempt |
| | 300,001–3,000,000 | 15% |
| | Over 3,000,000 | 20% |
| Does not meet the SME criteria | Every baht | 20% |

Last checked 2026-10-23 · Sources: the ภ.ง.ด.90 instructions for tax year 2025 (B.E. 2568) (rate table · method 2 × 0.005 · personal allowance) https://www.rd.go.th/fileadmin/tax_pdf/pit/2568/Ins90_241268.pdf · juristic person rates for accounting periods from 1 Jan 2017 onward https://www.rd.go.th/26218.html and the SME criteria https://www.rd.go.th/841.html (these 2 pages were last updated in 2017 and 2020 · no announcement of a rate change found)

**Example** Profit before tax of 1,000,000 baht a year (assumed figures)

| Form | Calculation | Tax (baht) |
|---|---|---|
| Individual (profit after actual expenses, then the 60,000 personal allowance) | Net income 940,000 → 65,000 + (940,000 − 750,000) × 20% | 103,000 |
| Individual, method 2 (assuming revenue of 4,000,000) | 4,000,000 × 0.5% = 20,000, which is below the first method, so pay by the first method | Not used |
| Company that meets the SME criteria | (1,000,000 − 300,000) × 15% | 105,000 |

The tax is close for both forms. But the remaining 895,000 baht in the company still belongs to the company. Paying it out as director salary or dividends adds a second layer of tax. Have an accountant work out both layers before deciding.

### Profit alone can mislead, so work out 3 scenarios

At a profit of 1,000,000 the individual pays slightly less. At a profit of 3,000,000 the company pays almost 200,000 less. Changing the business form is hard to undo, so look at several scenarios.

1. Ask the user for 3 things: yearly profit in a bad, middle and good case · the probability of each case (they add up to 1) · the extra bookkeeping and audit cost the company would pay, from real quotes · never fill in the probabilities or the bookkeeping cost for the user.
2. Node is required. Put the data in a file shaped like `seller-tax-basics/scripts/example-company.json`, then run 2 commands.

```bash
node <path>/tax-compare.mjs company.json            # <path>: see Script path below · tax table for both forms per scenario
node tax-compare.mjs company.json --payoff > payoff.json
node decide.mjs payoff payoff.json                    # decision-scoring: expected value · worst case · maximum regret
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/seller-tax-basics/scripts/tax-compare.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/seller-tax-basics/scripts/tax-compare.mjs` · `decide.mjs` is in the `decision-desk/decision-scoring` skill of plugin `superuser` (if it is not installed, walk the user through the table for both forms and let them choose).

3. Read the result line. Expected value and minimum regret may point different ways. With probabilities 0.4 · 0.4 · 0.2 and a bookkeeping cost of 60,000, the output says "2 เกณฑ์ไม่ตรงกัน" (the 2 criteria disagree): expected value picks the individual, 172,400 vs 183,000. Minimum regret picks the company, 62,000 vs 182,000. This means the answer depends on the probabilities the user gave. Changing the form is hard to undo, so explain both criteria and let the user and the accountant decide. None of this includes the second layer of tax when money leaves the company.


## reference: registration.md

# Registration (moved from SKILL.md section 3)

Part of the skill `thai-business-setup`.

## 3 · Registration

### Individual: commercial registration (ทะเบียนพาณิชย์)

- You must register when you run a business covered by the Ministry of Commerce announcement of 2024 (B.E. 2567). Examples: selling goods at 300 baht a day or more, or holding 10,000 baht or more of stock for sale · buying and selling goods or services over the internet · acting as a broker or agent for goods worth 300 baht a day or more · making goods and selling them under the same criteria.
- Register within 30 days of starting the business. Register a change or closure within 30 days as well.
- In Bangkok, file at one of the 50 district offices (or the Standards, Finance and Property Office, Finance Bureau). Outside Bangkok, file at the municipality, the subdistrict administrative organization (อบต.) or Pattaya City, according to where the head office is.
- Fees: new registration 50 baht · each change 20 baht · closure 20 baht · replacement certificate 30 baht.
- Display the commercial registration certificate at the head office (or display it electronically). Put up a name sign at the head office and every branch.

### Partnership and company: DBD Biz Regist

From 1 Jul 2026 (B.E. 2569), new partnerships and companies register only through the digital juristic person registration system (DBD Biz Regist). Paper is no longer accepted. From 1 Nov 2026, every kind of partnership and company registration request is filed online only. For help with the system, call the Call Center on 1570.

1. Check and reserve the juristic person's name at reserve.dbd.go.th (if you still need to pick a name, use `product-naming`).
2. Prepare the data: head office address with the house code number · business objectives · capital and number of shares or invested amounts · promoters or partners · directors and signing authority (company) or the managing partner (partnership) · licensed auditor and fee (company) · 2 witnesses (company).
3. A company can register the memorandum of association and the company itself on the same day when all of these are done: every subscriber has signed for shares · the incorporation meeting is held and everyone agrees · the promoters hand the business over to the directors · at least 25% of the share value has been called up.
4. File the request in DBD Biz Regist and pay the fees in the table.
5. You receive a 13-digit juristic person registration number. This number serves as the taxpayer ID, and the social security employer registration is created automatically.
6. If the registered capital is over 5 million baht, or a shareholder or an authorized director is a foreigner, send extra documents as the registrar orders (see section 6).

| Item | Fee (baht) |
|---|---|
| Partnership registration | 1,000 |
| Memorandum of association registration | 500 |
| Limited company registration | 5,000 |
| Stamp duty on the memorandum of association · articles of association (if any) | 200 · 200 |
| Certificate | 40 per item |
| Registration certificate | 100 per copy |
| Certified copy of a document | 50 per page |
| Converting a partnership into a company | 5,000 |

The 50% discount for online filing under the 2020 (B.E. 2563) ministerial regulation was valid only until 31 Dec 2023. Today online filing costs the same as the rates in the table. DBD has a draft of a new fee regulation that was open for comment in Mar–Apr 2026 (รอยืนยัน (awaiting confirmation) whether it has been issued). So check the rate in the system before every payment.

Last checked 2026-10-23 · Sources: DBD news of 23 Oct 2026 (B.E. 2569) on online-only service from 1 Nov 2026 https://www.dbd.go.th/news/37630092569 · Lopburi Provincial Commerce Office announcement of 29 May 2026 on ending paper registration on 1 Jul 2026 https://lopburi.moc.go.th/th/content/category/detail/id/161/iid/166937 · fees and steps: the 3 DBD manuals and the ministerial regulation listed in section 1


## reference: sources.md

# Sources · thai-business-setup

Last checked 2026-10-23 · Sources: VAT registration threshold https://www.rd.go.th/7061.html · bookkeeping duty, VAT registration with incorporation and automatic employer registration: the DBD manual for newly registered juristic persons (link in section 1) · employee registration within 30 days: Social Security Office news of 30 Oct 2024 (B.E. 2567) (link in `hiring-th/references/offer-letter-first-week.md` section 8)

Origin of the idea: the order of questions for choosing a business form took its idea from https://github.com/Boom-Vitt/claude-thai-business-skills (MIT License · Copyright (c) 2026 Vittawat (boombignose) · LICENSE file checked 2026-10-23). It was rewritten from scratch with no copied text, and every figure was rechecked against official sources.
