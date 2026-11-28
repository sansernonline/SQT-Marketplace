# skill: job-search

Use for a CV, interview, salary, new job, self-review or leaving a job

# job-search — job search, first 90 days, self-review and leaving a job

> **One rule:** Only write what the user has done. A missing fact stays as a blank such as `[ใส่ตัวเลข]`, never invented.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Help me write a CV or resume, in Thai or English, or fix my LinkedIn" | [`references/resume-th-en.md`](references/resume-th-en.md) |
| "I have an interview coming up" or "what will they ask me?" | [`references/interview-prep.md`](references/interview-prep.md) |
| "I got an offer", "what salary should I ask for?", "I want a raise" | [`references/salary-negotiation.md`](references/salary-negotiation.md) |
| "I just started, I am on probation" · "year-end review is coming" · "I was laid off" or "I want to resign" | [`parts/career-growth/guide.md`](parts/career-growth/guide.md) (first 90 days · self-review · leaving a job; sign nothing on the day you get a document) |

LinkedIn profile work is in `references/linkedin.md`. Question lists and templates are in `references/question-bank.md` and `references/templates.md`.

## Check before done

- Every claim in a CV or interview answer comes from the user. Nothing is made up, and a missing number stays as `[ใส่ตัวเลข]`.
- The CV has no national ID number, full address, bank account or salary. The reference explains why.
- Never inflate the current salary. HR may ask for a payslip or a 50 ทวิ form.
- Never suggest a fake offer to get a counter-offer.
- Say once that this is general information, not professional advice. For tax, ask an accountant (นักบัญชี). For a contract dispute, ask a labour lawyer.
- A whole job search with several steps → playbook `superuser/references/playbook-job-application.md`, `playbook-interview.md` or `playbook-offer-negotiation.md`, whichever fits.


## reference: interview-prep.md

<!-- merged from skill `interview-prep` on 2026-11-27 · description was: Use when preparing for a job interview -->
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

One story can answer several themes — tag each story with the themes it covers. Story bank template → [references/question-bank.md](question-bank.md).

## The questions Thai HR always asks

| Question | What they really check | How to answer |
|---|---|---|
| แนะนำตัวเอง / Tell me about yourself | Can you summarise | 60–90 s: present role → 2 results → why this job. Not your life story |
| ทำไมถึงอยากออกจากงานปัจจุบัน / Why are you leaving | Will you badmouth us later | Pull, not push: "looking for X which this role offers". Never criticise the current employer |
| เงินเดือนที่คาดหวัง / Expected salary | Fit with budget | Give a researched range, top end above target; see `salary-negotiation.md`. "Based on the scope and market data, I'm looking at 65,000–72,000 baht base, open to discussing the total package" |
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

Short, specific, one thing you discussed. Templates in Thai and English → [references/question-bank.md](question-bank.md).

## Rules

- Never claim a skill or result that is not real — it collapses in the next round or on reference check.
- Do not memorise scripts word for word; know the story beats.
- Inappropriate personal questions (religion, pregnancy plans) — answer briefly or redirect; the user decides. Note it for later if it reflects the culture.

ข้อความภาษาไทย (thank-you note, follow-up) → `human-writing` `thai-grammar.md` หัวข้อ 4 ระดับ สมัครงาน

Related: `resume-th-en.md` (stories must match the CV) · `salary-negotiation.md` · `human-writing/polite-message-th-en` (follow-up messages) · `meeting`.

## เรียกเป็นคำสั่ง

`/personal-life:job-search <company> <role> [round — hr|manager|technical|final] [th|en]`

Run the `interview-coach` agent with the `job-search` skill: **the user's request**

Follow the Workflow above, in this order: confirm the inputs · build the stories · list the 10 most likely questions for this round · offer the mock round · prepare 3 questions to ask and the thank-you template.


## reference: linkedin.md

# LinkedIn Profile (Thai market)

Open when the user asks to improve a LinkedIn profile. Keep CV and profile consistent: same dates, titles and bullet formula as the CV (SKILL.md Step 3).

Recruiters in Thailand search LinkedIn mostly in English, by job title + skill + location. The profile must match those searches and then convince in the first 2 lines.

## Workflow

1. Pick 1–2 **target roles** (the job titles you want to be found for).
2. Collect 10–15 **keywords** from 5 real job posts for those roles (JobsDB + LinkedIn). Count which words repeat.
3. Write the **headline** (formula below).
4. Write the **About** section.
5. Rewrite **Experience** bullets — copy from the CV (SKILL.md Step 3: action + result + number).
6. Fill **Skills** — top 5 pinned should be the post keywords.
7. Add **Featured** items.
8. Set **location, open-to-work and contact** settings.
9. Run the checklist.

## Headline formula (up to 220 characters)

**Target title | specialty or domain | proof point | keyword**

| Weak | Strong |
|---|---|
| Accountant at ABC Co., Ltd. | Senior Accountant \| Manufacturing & SAP FI \| Cut month-end close 9→5 days \| IFRS/TFRS |
| Looking for opportunities | Data Analyst \| SQL · Power BI · Python \| Retail & e-commerce analytics \| Bangkok |
| วิศวกร | Project Engineer \| EPC & Solar PV \| 12 MW delivered on time \| PMP \| EEC Thailand |

Do not write "unemployed", "seeking", or only the employer name. Write the headline in English even if the About has Thai, because most searches are in English.

## About section — 4 short paragraphs

1. **Hook** (first 2 lines show before "see more") — who you are + strongest result.
2. **What you do** — domain, typical problems you solve, tools.
3. **Proof** — 3 bullet results with numbers.
4. **Call to action** — what you are open to and how to contact you.

Optional: a short Thai paragraph at the end for Thai-company recruiters ("ยินดีพูดคุยเรื่องโอกาสงานด้าน …").

Example hook:
> I help manufacturers close their books faster and pass audits cleanly. 6 years in accounting for automotive parts; cut month-end close from 9 to 5 days with SAP automation.

## Thai market keywords (examples by function)

These are recruiter search terms, kept as written — not text to paste in unchanged. Use only the ones that are true for you.

| Function | Keywords recruiters search |
|---|---|
| Finance / accounting | TFRS, IFRS, SAP FI/CO, month-end closing, consolidation, BOI, transfer pricing, CPA (ผู้สอบบัญชีรับอนุญาต) |
| Software / IT | Java, .NET, React, Node.js, AWS / Azure, Kubernetes, SAP ABAP, PDPA, ISO 27001 |
| Data | SQL, Power BI, Tableau, Python, data warehouse, dbt, Looker |
| Engineering / manufacturing | Lean, Six Sigma, TPM, IATF 16949, ISO 9001, EEC, PLC, AutoCAD |
| HR | HRBP, C&B, payroll, Thai labour law, SSO, PVD, talent acquisition |
| Sales / marketing | B2B, key account, modern trade, e-commerce (Shopee / Lazada / TikTok Shop), CRM, LINE OA |
| Supply chain | procurement, S&OP, WMS, customs, BOI, FTA, Incoterms |

Language skills: list Thai (Native), English with level, plus Japanese / Chinese if any — Japanese companies are a large employer group in Thailand and search JLPT levels.

## Featured

Pin 2–4: a portfolio link, a public case study or article, a presentation, a certificate. Nothing confidential from an employer.

## Recommendations

Ask for 2–3, from a manager, a client and a peer — one each. Make it easy: send a 2-line brief of what to mention (the project, the result with a number) and offer to write one back. Recruiters read these as references before they call; an empty section reads as "nobody would".

## Settings

- Location: city (e.g. Bangkok, Thailand) — recruiters filter by it
- Open to work: "Recruiters only" if still employed (your employer's recruiters may still see it — LinkedIn says it tries to hide it but cannot guarantee)
- Custom URL: linkedin.com/in/firstname-lastname
- Photo: face filling ~60% of the frame, plain background; banner 1,584 × 396 px with domain or city — keep the left third clear where the photo overlaps on desktop (banner size as commonly published; LinkedIn help page for personal profiles not found on 2026-10-23 → รอยืนยัน — tell the user it is the commonly published size, not an official one; see the Sources section at the end of this file)
- Contact: email you check; no phone number in public fields

## Checklist

- [ ] Headline has target title + 2 keywords + proof
- [ ] About first 2 lines stand alone
- [ ] Each role has 2–4 result bullets
- [ ] Top 5 skills match job-post keywords
- [ ] Profile and CV dates and titles match exactly
- [ ] No confidential numbers (client names, unpublished revenue) without permission

Related: `salary-negotiation.md` · `interview-prep.md`.

## Sources

ตรวจล่าสุด 2026-10-26 · banner 1,584 × 396 px (4:1, JPG or PNG under 8 MB) agrees across secondary guides (https://linearity.io/blog/linkedin-size-guide/ · https://magicstudio.com/blog/linkedin-background-photo/) · the official LinkedIn help page found (https://www.linkedin.com/help/linkedin/answer/a563309) covers company Pages only (cover 1,512 × 256 px), so the personal banner size stays (รอยืนยัน) — tell the user it is the commonly published size, not an official one


## reference: offer-scoring-example.md

# Compare offers by numbers — example input and result

```json
{"criteria":[{"name":"total per year","weight":0.4,"better":"high"},{"name":"commute min","weight":0.2,"better":"low"},{"name":"growth 1-5","weight":0.25,"better":"high"},{"name":"leave days","weight":0.15,"better":"high"}],
 "must":[{"criterion":"total per year","min":850000}],
 "options":[{"name":"A","values":{"total per year":912000,"commute min":90,"growth 1-5":3,"leave days":12}},
            {"name":"B","values":{"total per year":858000,"commute min":60,"growth 1-5":4,"leave days":15}},
            {"name":"C","values":{"total per year":800000,"commute min":30,"growth 1-5":5,"leave days":15}}]}
```

Result when run: C is dropped by the iron rule, B 60 and A 40, B stays first when each weight moves ±20%. With only 2 options every criterion becomes 0 or 100, so read the raw numbers in brackets too.


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


## reference: resume-th-en.md

<!-- merged from skill `resume-th-en` on 2026-11-27 · description was: Use when writing a Thai or English CV or resume, or improving a LinkedIn profile for a Thai job search -->
# Resume and LinkedIn — Thai and International

## Contents

- [Step 1 — pick the convention](#step-1--pick-the-convention)
- [Never put on any CV](#never-put-on-any-cv)
- [Step 2 — ATS-friendly structure](#step-2--ats-friendly-structure)
- [Step 3 — the bullet formula](#step-3--the-bullet-formula)
- [Step 4 — the one-page rule](#step-4--the-one-page-rule)
- [Workflow](#workflow)
- [Checklist before sending](#checklist-before-sending)
- [LinkedIn profile](#linkedin-profile)
- [Not an AI look](#not-an-ai-look)
- [References](#references)
- [เรียกเป็นคำสั่ง](#เรียกเป็นคำสั่ง)

A CV gets a few seconds of a recruiter's first look, and it has to survive 2 readers: the applicant tracking system (ATS) that parses it, and the person who skims it.

General information, not professional advice — for visa or licence claims on a CV, ask the employer's HR.

## Step 1 — pick the convention

| Signal in the job post | Convention | Photo | Age / birth date | Marital status, religion | Length |
|---|---|---|---|---|---|
| Thai-language post, Thai SME or family business | **Thai** | Usually expected (formal, plain background) | Common | Leave out unless the form requires it | 1–2 pages |
| English post at a multinational in Thailand | **Hybrid** | Only if the company's own form asks | Leave out | Leave out | 1 page under ~10 years' experience, 2 max |
| Overseas role (US, UK, EU, Australia, Singapore) | **International** | **Leave out** — photos are not expected there and can count against you | Leave out | Leave out | US: 1 page early-career · UK/EU: 2 pages ok |
| Government / state enterprise (ราชการ / รัฐวิสาหกิจ) | Their own ใบสมัคร form | As the form says | As the form says | As the form says | Form |

## Never put on any CV

- เลขบัตรประจำตัวประชาชน (national ID number), passport number, bank account — identity-theft risk; HR collects these after the offer, under the Personal Data Protection Act (PDPA, พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล)
- Full home address — เขต/จังหวัด is enough
- Current salary — only when asked, and see `salary-negotiation.md`
- Copies of บัตรประชาชน, ทะเบียนบ้าน or transcripts as attachments, unless the post asks

## Step 2 — ATS-friendly structure

1. **Header** — name, phone, email, LinkedIn URL, city. Not inside a Word header/footer or text box (many ATS skip those).
2. **Summary** — 2–3 lines: role + years + 2 strongest results + target.
3. **Experience** — reverse chronological; company, title, month-year range, 3–6 bullets each.
4. **Skills** — plain comma list using the exact words of the job post.
5. **Education** — degree, university, year. GPA only if ≥ 3.25 or the post asks, and only within ~3 years of graduating.
6. **Certifications / languages** — with level and year (TOEIC 850, IELTS 7.0, JLPT N3).

ATS rules: single column · standard headings ("Experience", "ประสบการณ์ทำงาน") · no tables, icons, skill bars or charts · real text, not images · PDF unless the portal asks for .docx · file name `Firstname-Lastname-CV-Role.pdf`.

Thai CVs: use a standard Thai font (TH Sarabun New, Noto Sans Thai) and embed fonts in the PDF — otherwise vowels and tone marks break on the recruiter's machine.

## Step 3 — the bullet formula

**Action verb + what you did + result + number.**

| Weak | Strong |
|---|---|
| Responsible for monthly reports | Automated the monthly sales report in Power BI, cutting preparation from 3 days to 4 hours |
| ดูแลลูกค้าองค์กร | ดูแลลูกค้าองค์กร 35 ราย ต่อสัญญาได้ 92% และเพิ่มยอดขายต่อรายเฉลี่ย 18% ในปี 2568 |
| มีส่วนร่วมในการพัฒนาระบบ ซึ่งทำให้การปิดงบเร็วขึ้น | ลดเวลาปิดงบจาก 8 วันเหลือ 5 วัน |
| Helped with the ERP project | Led migration of 120,000 customer records to SAP with zero critical defects at go-live |

No number? Find a proxy — people served, time saved, transactions, percentage, ranking, deadline met. If truly none, write the scope ("for 3 branches, 40 staff").

Thai verbs: พัฒนา · ลด · เพิ่ม · นำทีม · ออกแบบ · บริหาร · ปรับปรุง · ประสาน · ริเริ่ม · วิเคราะห์
English verbs: Led · Built · Cut · Grew · Launched · Automated · Negotiated · Redesigned · Delivered

## Step 4 — the one-page rule

- Under ~10 years' experience → 1 page. Roles older than 10–15 years → 1 line each.
- 1 line per bullet where possible, 2 at most.
- Remove: "References available on request", objective statements, hobbies with no signal, high-school details.
- Margins at least 1.5 cm — white space is readability.

## Workflow

1. Get the job post. Mark its 8–10 key requirements and keywords, and sort them into 3 tiers: **must-have** (in the title, "required", or a licence/degree) · **strong plus** ("preferred", "an advantage") · **nice-to-have** (everything else). Must-haves each get a bullet in the top half of page 1; strong pluses go in Skills and one bullet; nice-to-haves only if true and there is room. A missing must-have is named once, honestly, in the cover email — never hidden by keyword stuffing.
2. Pick convention (Step 1) and language. Thai post → Thai CV; English post → English CV; unsure → both.
3. Rewrite experience with the formula; leave missing numbers as `[ใส่ตัวเลข]` — never invent.
4. Mirror the post's exact keywords in Summary and Skills (only true ones).
5. Run the checklist. Output the CV plus a short "what changed" list.

## Checklist before sending

- [ ] Phone and email correct; email is professional
- [ ] Every bullet has a result; at least half have a number
- [ ] Job-post keywords appear naturally
- [ ] Dates as month + year; any gap over 6 months explained in one line (study, family, freelance)
- [ ] No ID number, no full address, no salary
- [ ] Spell-checked in both languages; company names in their official spelling
- [ ] PDF opens with correct Thai on another machine
- [ ] Thai CV uses พ.ศ. or ค.ศ. consistently (ค.ศ. = พ.ศ. − 543), never both
- [ ] **Reader test** passed: a fresh reader (a subagent that has not seen this chat, or the user in a new chat) gets only the CV and the job post, reads for 6 seconds as the HR screener would, then answers "what role is this person for · their 2 strongest results · which must-have is missing". A wrong answer marks what to fix. Method: `thesis-writing`, "Reader test"

Thai text (CV, cover email) → `human-writing` `thai-grammar.md` section 4, the job-application register · no long dash (—) in text that will be sent; use a space, "โดย" or brackets instead

## LinkedIn profile

For a LinkedIn profile (argument `linkedin`), use the CV bullets from Step 3 and the keywords from the Workflow, then follow [references/linkedin.md](linkedin.md): target roles, 10–15 keywords from 5 real job posts, headline formula (up to 220 characters), About in 4 paragraphs, Skills, Featured, Recommendations, settings and its own checklist. Profile and CV dates and titles must match exactly.

**Hard rules (LinkedIn):** No confidential employer or client data on LinkedIn without the user's permission. Leave the phone number out of public LinkedIn fields.
If the user is still employed, set Open to work to Recruiters only, and say it cannot be fully hidden.

## Not an AI look

Before handing over, run `design-gate/no-ai-look` section 3. CVs are usually PDF or .docx, so only the eye check (3.2) applies; the script is for HTML/CSS. For a resume that means: no emoji headings, no bold-first bullets, no generic claims without numbers.

Related: `interview-prep.md` (every bullet becomes a Situation, Task, Action, Result (STAR) story) · `family-legal` in `personal-life` (store certificates and transcripts).

## References

- [`templates.md`](templates.md) — fill-in templates (English, Thai, cover email) and a worked example of a summary line; open when drafting
- [`linkedin.md`](linkedin.md) — LinkedIn headline, About, Thai keyword table, settings, checklist and banner-size source; open for a LinkedIn profile

## เรียกเป็นคำสั่ง

`/personal-life:job-search <th|en|both|linkedin> [job post URL or text]`

Run the `career-coach` agent with the `job-search` skill: **the user's request** (with `linkedin`, work from the LinkedIn reference instead of the CV steps)

1. Ask for the current CV (or work history) and the target job post if not given.
2. Decide Thai-company vs international convention from the job post (see the skill's decision table).
3. Rewrite every bullet as action + result + number; mark missing numbers `[ใส่ตัวเลข]`.
4. Output the CV in the requested language(s), then a short list of what changed and why.


## reference: salary-negotiation.md

<!-- merged from skill `salary-negotiation` on 2026-11-27 · description was: Use when handling a job offer or salary talk -->
# Salary Negotiation (Thailand)

## Contents

- [Step 1 — market data](#step-1--market-data)
- [Step 2 — total compensation](#step-2--total-compensation)
- [Worked example — two offers](#worked-example--two-offers)
- [Step 3 — set three numbers](#step-3--set-three-numbers)
- [Step 4 — scripts](#step-4--scripts)
- [Step 5 — timeline after the offer and the levers besides base](#step-5--timeline-after-the-offer-and-the-levers-besides-base)
- [Counter-offer rules (current employer tries to keep you)](#counter-offer-rules-current-employer-tries-to-keep-you)
- [Rules](#rules)
- [เรียกเป็นคำสั่ง](#เรียกเป็นคำสั่ง)
- [References](#references)

Negotiate on **total compensation per year**, not base salary per month.

Not for: writing up what you achieved for a review → `job-search` part `career-growth`.

General information, not professional advice — for tax effects ask a นักบัญชี or check `income-tax-th` in `trading-finance` (if installed); for contract disputes ask a labour lawyer.

## Step 1 — market data

| Source | What it gives | Notes |
|---|---|---|
| Robert Walters Thailand Salary Survey (robertwalters.co.th/salarysurvey) | Base ranges by role and seniority, Bangkok and Eastern Seaboard | Free download, yearly |
| Adecco Thailand Salary Guide (adecco.co.th) | Ranges by function and industry + mobility survey | Free download, yearly |
| Michael Page / PageGroup Thailand salary guide | Mid–senior ranges, multinational bias | Yearly (รอยืนยัน — edition availability) |
| JobsDB (th.jobsdb.com) | Salary ranges in live job posts; salary insights pages | Many posts hide salary — use the ones that show it |
| LinkedIn job posts and Salary insights | Ranges where disclosed | Thin data for Thailand |
| Peers, recruiters, alumni groups | Real offers | Ask for ranges, not exact salaries |

Use 3 sources (name + year); write the range as low / mid / high with source and year. Fewer than 3 → mark the range `(รอยืนยัน)`. Salary surveys have no official source, so named recruiter guides count as the source for this case. Recruiter guides skew to multinationals — Thai SMEs often pay below the range.

## Step 2 — total compensation

| Component | How to value it per year |
|---|---|
| Base salary | monthly × 12 |
| Guaranteed 13th month | 1 × monthly (only if in the contract) |
| Performance bonus | monthly × expected months — ask "what was the average payout over the last 3 years?" Discount if not guaranteed |
| Allowances (transport, phone, position, shift) | monthly × 12 — check if counted in the salary base for overtime and severance |
| Provident fund (กองทุนสำรองเลี้ยงชีพ, PVD) employer match | base × match % × 12 — employee and employer each 2–15% of wage, the employer rate need not equal the employee's (SEC); check the **vesting** schedule |
| Social security (ประกันสังคม) | Not extra money — both sides pay 5% of wage capped at 17,500 baht (max 875/month each) from 1 Jan 2026; identical across offers |
| Group health / life insurance | Ask the out-patient (OPD) and in-patient (IPD) limits; value at what you would pay for similar individual cover |
| Annual leave, work-from-home (WFH) days | Not money, but price it: each extra leave day ≈ base ÷ 22 |
| Stock / restricted stock units (RSU) | Only count what vests within the period you will realistically stay |
| Sign-on bonus | One-off; check claw-back if you leave within 12 months |

Social security ceiling steps under the ministerial regulation (B.E. 2568): 17,500 baht (2569–2571) → 20,000 baht (2572–2574) → 23,000 baht (2575 onward). Several independent sources agree on the numbers, but the Royal Gazette (ราชกิจจานุเบกษา) text itself has not been opened — `(รอยืนยัน)` until the official link is added.

## Worked example — two offers

Two offers (A: 60,000 base · 2 months bonus · 3,000 allowance · 5% PVD match; B: 66,000 base · 1 month bonus) come to 912,000 vs 858,000 a year: B's base is 10% higher but A is worth 54,000 more, before insurance. Full table: [references/worked-example-two-offers.md](worked-example-two-offers.md). Show a table like it before any discussion of "which is better".

### Compare offers by numbers (`decision-desk/decision-scoring`, command `score`)

1. **Iron rule first (กฎเหล็ก):** total compensation per year below your walk-away (Step 3) is dropped, however good the rest looks. Put it in `must` as `min`. An offer with no written terms for base, bonus and PVD is not scored until it is in writing.
2. **Criteria (default weights, starting value, not yet measured — the user changes them):**

| Criterion | `better` | Weight |
|---|---|---|
| Total compensation per year, baht (Step 2 total) | high | 0.40 |
| Commute, round trip minutes per day | low | 0.20 |
| Growth, 1–5 (user's score: scope, mentor, title path) | high | 0.25 |
| Annual leave days | high | 0.15 |

3. **Run:** `node decide.mjs score offers.json` (path of the script: see the `decision-desk/decision-scoring` skill). Input, using the table above plus a third offer that is under the walk-away:

Example input (3 offers, iron rule 850,000) and the result when run: [references/offer-scoring-example.md](offer-scoring-example.md)
4. **Unstable or close** (`ยังไม่นิ่ง`, `สูสี`) → show the user the top two and the criterion that flips them; the user decides. Money and career: the score is supporting data, not advice.

## Step 3 — set three numbers

1. **Target** — what you actually want (market mid–high for your results).
2. **Anchor** — what you say first: target + 5–10%.
3. **Walk-away** — below this you decline. Decide it before the call, write it down as a number of total compensation per year: it becomes the `min` iron rule in the score above.

Rule of thumb when changing jobs in Thailand: a 10–20% base increase is commonly discussed; more for scarce skills, less in a slow market (รอยืนยัน — practitioner rule, not survey data; check the current Adecco / Robert Walters guide).

## Step 4 — scripts

Expected salary, early in the process:
- EN: "Based on the role's scope and market data for similar positions, I'm looking at a base of 70,000 to 78,000 baht, and I'm open to discussing the full package."
- TH: "จากขอบเขตงานและข้อมูลตลาดของตำแหน่งใกล้เคียง คาดหวังฐานเงินเดือนประมาณ 70,000–78,000 บาท และยินดีพูดคุยเรื่องสวัสดิการโดยรวมครับ/ค่ะ"

Responding to an offer below target:
- EN: "Thank you — I'm excited about the role. Looking at the total package, I was expecting closer to 75,000 base, given [one result with a number]. Is there flexibility on base, or on the bonus guarantee or start date allowance?"
- TH: "ขอบคุณมากครับ/ค่ะ สนใจตำแหน่งนี้มาก เมื่อดูแพ็กเกจโดยรวมแล้ว คาดหวังฐานเงินเดือนใกล้ 75,000 บาท เนื่องจาก [ผลงานพร้อมตัวเลข] พอจะปรับฐานเงินเดือน หรือส่วนอื่นเช่นโบนัสการันตีได้ไหมครับ/คะ"

Asking for a raise (internal):
- EN: "Over the last 12 months I [result 1] and [result 2]. The market range for this scope is [range, source]. I'd like to discuss moving my base to [number]."
- TH: "ในรอบ 12 เดือนที่ผ่านมา [ผลงาน 1] และ [ผลงาน 2] ข้อมูลตลาดของงานขอบเขตนี้อยู่ที่ [ช่วง, แหล่ง] จึงอยากขอให้พิจารณาปรับฐานเงินเดือนเป็น [ตัวเลข] ครับ/ค่ะ"

Then **stop talking** and wait.

## Step 5 — timeline after the offer and the levers besides base

| Day | Do |
|---|---|
| 0 — offer arrives | Thank them, ask for it in writing and for the reply deadline. Do not accept or counter on the call |
| 1–2 | Build the total-compensation table (Step 2) and the 3 numbers (Step 3); re-check market data |
| 2–3 | One counter with evidence (Step 4 script); name 1–2 levers below as alternatives if base is fixed |
| 3–5 | Their reply. At most 2 rounds — a third round costs goodwill you will need on day 1 of the job |
| 5–7 | Final offer letter with every agreed item written in; then accept, then resign (Counter-offer rules) |

Many Thai companies, and most large ones, have a salary band (กรอบเงินเดือน) per level that HR cannot move — when "the base is fixed", move to the levers: **sign-on bonus** (one-off, outside the band) · **guaranteed bonus for year 1** · **earlier review** (6 months instead of 12, criteria written) · **title or level** (changes the band) · **PVD match rate** · **extra annual leave days** · **work-from-home days** · **training or certification budget** · **start date** (finish your bonus period first) · **notice-period buyout** · **relocation or housing allowance** (for Eastern Seaboard or upcountry sites). Ask for the 2 that matter most to you, not the whole list.

## Counter-offer rules (current employer tries to keep you)

1. Ask why you wanted to leave — does the counter fix that reason, or only the money?
2. Is it a real base change in writing, or a promise ("next review")? Only written counts.
3. Will your manager trust you the same way after you nearly left?
4. Never use a fake offer to get a counter — it is easily called.
5. If you accept the new offer: resign in writing, give the contract notice, and keep it polite — `human-writing/polite-message-th-en`.

## Rules

- Never inflate current salary — HR may ask for a payslip or 50 ทวิ.
- Get the final offer in writing (offer letter: base, bonus terms, allowances, PVD, probation length, notice period, start date) before resigning.
- Probation: under the Labour Protection Act §118, severance starts after 120 days of continuous work regardless of probation label — check the offer letter does not imply otherwise.
- Keep every offer letter in `family-legal`.

## เรียกเป็นคำสั่ง

`/personal-life:job-search <offer|raise|counter> [offer details]`

Run the `career-coach` agent with the `job-search` skill: **the user's request**

- `offer` — build the total-compensation table for the offer (and the current job), find the gap, draft the reply in Thai and English
- `raise` — build the case from `job-search` part `career-growth`, pick the number, draft the meeting opener
- `counter` — the current employer counter-offered; run the counter-offer checklist before answering

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: sources.md

# Sources · salary-negotiation

ตรวจล่าสุด 22 ต.ค. 2569 · กองทุนสำรองเลี้ยงชีพ: https://www.sec.or.th/TH/Template3/Articles/2566/160566.pdf · ประกันสังคม: https://www.krungsri.com/th/krungsri-the-coach/life/good-life/sso-section-33-rate-increase · https://www.thansettakij.com/general-news/646834 (ข่าววันที่ 18 ธ.ค. 2568 รายงานว่ากฎกระทรวงลงราชกิจจานุเบกษาแล้ว ไม่ได้ระบุวันประกาศ) · https://www.bakermckenzie.com/en/insight/publications/alerts/2025/12/thailand-higher-wage-base-for-ssf-contributions

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.robertwalters.co.th/salarysurvey.html · https://adecco.co.th/en/knowledge-center/detail/salary-guide/download-adecco-thailand-salary-guide-2025


## reference: templates.md

# CV Templates

Contents
1. English — international / hybrid (1 page)
2. Thai — Thai company
3. Cover email (English and Thai)

## 1. English — international / hybrid

```
FIRSTNAME LASTNAME
Bangkok, Thailand · +66 8X XXX XXXX · name@email.com · linkedin.com/in/name

SUMMARY
[Role] with [N] years in [industry]. [Result with number]. [Result with number].
Looking for [target role] where I can [what you bring].

EXPERIENCE
[Job Title] — [Company], [City]                          [Mon YYYY] – Present
• [Verb] [what], [result] by [number]
• [Verb] [what], [result] by [number]
• [Verb] [what] for [scope], [result]

[Job Title] — [Company], [City]                          [Mon YYYY] – [Mon YYYY]
• ...

SKILLS
[Keyword], [Keyword], [Tool], [Tool] · Languages: Thai (native), English (professional)

EDUCATION
[Degree], [Major] — [University], [YYYY]

CERTIFICATIONS
[Certificate] — [Issuer], [YYYY]
```

## 2. Thai — Thai company

```
[รูปถ่ายหน้าตรง พื้นหลังเรียบ — เฉพาะเมื่อบริษัทคาดหวัง]

[ชื่อ นามสกุล] (ชื่อเล่น [ชื่อเล่น])
โทร 08X-XXX-XXXX · อีเมล name@email.com · [เขต], [จังหวัด]
ตำแหน่งที่สนใจ  [ตำแหน่ง]

สรุปคุณสมบัติ
[ตำแหน่ง] ประสบการณ์ [N] ปี ในธุรกิจ [อุตสาหกรรม] มีผลงาน [ผลงานพร้อมตัวเลข] และ [ผลงานพร้อมตัวเลข]

ประสบการณ์ทำงาน
[เดือน ปี] – ปัจจุบัน   [ตำแหน่ง] · [ชื่อบริษัท]
  • [กริยา] [สิ่งที่ทำ] ส่งผลให้ [ผลลัพธ์] [ตัวเลข]
  • ...

การศึกษา
[ปี พ.ศ.]  [วุฒิ] สาขา [สาขา] · [มหาวิทยาลัย]  (เกรดเฉลี่ย [x.xx] — ใส่เมื่อเพิ่งจบ)

ทักษะ
ภาษา: ไทย (ภาษาแม่), อังกฤษ ([ระดับ / คะแนน])
โปรแกรม: [Excel, SAP, ...]
อื่น ๆ: [ใบขับขี่, พร้อมเดินทางต่างจังหวัด — ใส่เมื่องานต้องการ]
```

Fields a Thai application form may ask — fill only when asked: อายุ · สถานภาพ · สัญชาติ · ศาสนา · สถานะทางทหาร (ผ่านการเกณฑ์ทหาร / ได้รับการยกเว้น — men).

## 3. Cover email

English:
```
Subject: Application — [Role] — [Your Name]

Dear [Name / Hiring Team],

I am applying for the [Role] position advertised on [JobsDB / LinkedIn / your website].
At [Company] I [one result with a number], which matches your need for [requirement from the post].
My CV is attached. I would welcome the chance to discuss how I can help [team or company goal].

Best regards,
[Name] · [Phone]
```

Thai:
```
เรื่อง สมัครงานตำแหน่ง [ตำแหน่ง] ([ชื่อ นามสกุล])

เรียน ฝ่ายทรัพยากรบุคคล / คุณ[ชื่อ]

ดิฉัน/ผมขอสมัครงานตำแหน่ง [ตำแหน่ง] ตามที่ประกาศใน [ช่องทาง]
ปัจจุบันทำงานที่ [บริษัท] มีผลงาน [ผลงานพร้อมตัวเลข] ซึ่งตรงกับคุณสมบัติด้าน [ข้อกำหนด]
ได้แนบประวัติย่อมาพร้อมนี้ หวังเป็นอย่างยิ่งว่าจะได้รับโอกาสเข้าสัมภาษณ์

ขอแสดงความนับถือ
[ชื่อ นามสกุล] · โทร [เบอร์]
```

## Worked example — summary line

> Before: "Hard-working accountant with good teamwork skills."
> After: "Accountant with 6 years in manufacturing; closed month-end in 5 working days instead of 9 and passed 3 Revenue Department audits with no adjustments. Seeking a senior accounting role with ERP responsibility."


## reference: worked-example-two-offers.md

# Worked example · two offers

| | Offer A | Offer B |
|---|---|---|
| Base | 60,000 × 12 = 720,000 | 66,000 × 12 = 792,000 |
| Bonus | 2 months avg = 120,000 | 1 month avg = 66,000 |
| Allowance | 3,000 × 12 = 36,000 | 0 |
| PVD employer match | 5% × 60,000 × 12 = 36,000 | none |
| **Total cash + PVD** | **912,000** | **858,000** |
