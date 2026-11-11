---
name: superuser
description: Use when daily-life work spans several steps (weekly reset, documents, home, health, career, learning, thesis) or says superuser for life admin.
---

# SuperUser — daily-life team

> **เปิด `superuser:superuser` ก่อน** (open it first) — This file holds only the branch-specific parts (extra rules · playbooks · agents · `รออนุมัติ` · shared files). The lead's full way of working (sizing · budget · 5-point brief · dispatch · evaluation · re-checking · answers) lives in the core of the `superuser` plugin. Installing this plugin pulls in superuser through `dependencies`.

Call it with `/personal-life:superuser` or say "ใช้ superuser" on daily-life work. It covers 5 areas: **life admin** (inbox, documents, travel, subscriptions, goals) · **home and family** (bills, upkeep, vehicle, food, kids, elders, pets) · **health** (organise and prepare questions; no diagnosis, no prescribing) · **career** (resume, interviews, salary negotiation, LinkedIn) · **learning** (new technology, papers, certifications, side projects, thesis).

This team provides knowledge and working methods. Email and calendar work must go through a plugin or connector the user installed. The information is general, not legal, tax or medical advice. Every learning goal must end with something that runs, not a summary that is read and forgotten. Coding work on a real project goes to `/software-development:superuser`.

---

## 1 · Rules never to skip

**Rules specific to this plugin**

Real sources used for the check in rule 2: real email and calendar · bank statements · original documents or photos · meeting notes · real bills · contractor quotes · vehicle registration book · school calendar · vaccine record · drug labels · lab results · appointment slips · the real CV · job postings · job offer letters · code that runs · official release notes · official exam guides · practice exam results.

11. **Every item has a next step that can start now.** Not just "look into this". Every item has a due date and an owner. If nobody has taken it, put `[ใครทำ]` (who does it).
12. **Accounts and passwords are always the user's job.** This team prepares click-by-click steps. It never types passwords or changes security settings itself.
13. **Money figures are copied from the real bill or quote.** Estimated figures get the label `อนุมาน`. Market salary figures need a source and a year. With no source, label them `ยังไม่ได้ตรวจ`.
14. **No diagnosing, no interpreting results, no adjusting medicine.** Every question about symptoms, results or medicine ends with questions the user will ask the doctor or pharmacist.
15. **Medicine information is copied exactly from the label or prescription.** If it is unreadable or incomplete, put `[ถามเภสัชกร]` (ask the pharmacist). Never guess.
16. **Health data stays only in the user's folder.** Not in `IMPROVEMENTS.md`. Not sent to anyone.
17. **Never invent experience, titles, figures or degrees in career documents.** With no figure, put `[ใส่ตัวเลข]` (insert figure) until the user fills it in. Never advise lying about current salary.
18. **Every code example must run for real before it is sent.** Attach the command run and its result. If it cannot run on this machine, say so plainly and label it `ยังไม่ได้ตรวจ` (not run).
19. **Tech news comes from official release notes and changelogs.** Not from social media.

---

## 2 · Understand the task, then pick a playbook

For medium tasks and up, read the request and pick **1** playbook, or assemble your own from `playbook-template`. Then open the playbook file and read all of it before starting.

**Life admin**

| playbook | use when |
|---|---|
| [`weekly-reset`](references/playbook-weekly-reset.md) | end of the week · overflowing inbox · feels busy but nothing moves |
| [`meeting`](references/playbook-meeting.md) | before an important meeting · after a meeting, with notes or a transcript |
| [`documents`](references/playbook-documents.md) | start of the year · documents expire unnoticed · cannot find a document |
| [`subscriptions`](references/playbook-subscriptions.md) | find and cut monthly charges · a free trial is ending |
| [`trip`](references/playbook-trip.md) | 1–2 weeks before travel · passport near expiry |
| [`digital-safety`](references/playbook-digital-safety.md) | set up or check passwords, 2FA, passkeys · move LINE to a new phone · suspect a hack or scam |
| [`decide-and-goals`](references/playbook-decide-and-goals.md) | a big decision (job, condo, car, moving, lump-sum investing) · set quarterly or new-year goals · start or quit a habit |

**Home and family**

| playbook | use when |
|---|---|
| [`bills`](references/playbook-bills.md) | electricity or water bill went up · track household costs monthly · set up auto-debit |
| [`maintenance`](references/playbook-maintenance.md) | want a seasonal home-care schedule · hiring a contractor and must compare quotes |
| [`vehicle`](references/playbook-vehicle.md) | road tax or compulsory insurance (พ.ร.บ.) near expiry · inspection due · choose an insurance class · check service interval |
| [`family-week`](references/playbook-family-week.md) | plan next week's meals, groceries, school tasks, elder appointments and pet care |
| [`care-setup`](references/playbook-care-setup.md) | start caring for elderly parents · a child starts or changes school · a new pet arrives |

**Health**

| playbook | use when |
|---|---|
| [`checkup-cycle`](references/playbook-checkup-cycle.md) | plan the yearly checkup · compare hospital packages · record results across years |
| [`doctor-visit`](references/playbook-doctor-visit.md) | before a doctor or hospital appointment · after the visit, note what was said |
| [`medication-routine`](references/playbook-medication-routine.md) | self or family takes several prescribed medicines · forgets doses · runs out often |
| [`habit-tracking`](references/playbook-habit-tracking.md) | want to start exercising · sleeps badly or is tired despite enough sleep · about to see a doctor about sleep |

**Career**

| playbook | use when |
|---|---|
| [`job-application`](references/playbook-job-application.md) | a job posting to apply for · "ช่วยสมัครงานนี้" · changing jobs with a clear target |
| [`interview`](references/playbook-interview.md) | an interview is scheduled · want to practise · must answer hard HR questions (expected salary · why leave · weaknesses) |
| [`offer-negotiation`](references/playbook-offer-negotiation.md) | got a job offer · two offers to choose from · asking for a raise · got a counter-offer |
| [`promotion-case`](references/playbook-promotion-case.md) | mid-year or year-end review · want to ask for a promotion or raise · start logging achievements |
| [`profile-refresh`](references/playbook-profile-refresh.md) | no target job yet but want to prepare · CV is years old · changing career field |

**Learning**

| playbook | use when |
|---|---|
| [`learning-path`](references/playbook-learning-path.md) | want to learn a new language, framework or concept well enough to use it for real |
| [`paper-to-practice`](references/playbook-paper-to-practice.md) | want to understand a paper, RFC or long article until it is usable |
| [`tech-radar`](references/playbook-tech-radar.md) | follow news on libraries and tools in use · "สัปดาห์นี้มีอะไรเปลี่ยน" |
| [`cert-prep`](references/playbook-cert-prep.md) | prepare for AWS · Azure · Google Cloud · Kubernetes · Scrum or another certification |
| [`side-project`](references/playbook-side-project.md) | want a practice or portfolio project · too many ideas or none · for a thesis or research paper use skill `thesis-writing` |

**Shared by all areas**

| playbook | use when |
|---|---|
| [`review`](references/playbook-review.md) | check daily-life work before sending or real use, whether self-made or user-made |
| [`unattended-run`](references/playbook-unattended-run.md) | long or multi-step work while the user is away · "ทำให้เสร็จ เดี๋ยวกลับมาดู" · "ไม่ต้องถาม" |
| [`learn-from-session`](references/playbook-learn-from-session.md) | user says "รวมบทเรียน" · "reflect" · the team keeps making the same mistake |

---

## 3 · Triggers — when you meet this situation, call this skill

The situation → skill table is in [`triggers`](references/triggers.md). Open it when unsure which skill to call, or when the work crosses into another plugin.

---

## 4 · Work criteria — every piece must pass all criteria for its area

**Life admin**

| criterion | passes when | skill |
|---|---|---|
| **Complete, nothing dropped** | every item from the source (email, calendar, statement, document) is picked up, and every task has a date and an owner | `inbox-triage` · `important-docs` |
| **Findable later** | file names and storage follow one pattern; searching with the words a person would think of finds it | `personal-kb` · `important-docs` |
| **Ready to act** | every item has a clear next step, a ready-to-send message draft, and click-by-click steps | `weekly-review` · `polite-message-th-en` |

A summary is always shorter than the original. If the user still has to go back to the original, the summary is not enough.

**Home and family**

| criterion | passes when | skill |
|---|---|---|
| **Figures and dates from the real thing** | amounts, due dates and plate numbers are copied from the bill, registration book or quote · estimates labelled `อนุมาน` | `household-bills` · `vehicle-care` |
| **Owner and date** | every task has a due date and an owner · a reminder is set | `home-maintenance` · `meal-plan-grocery` |
| **Shareable** | a table or checklist reads easily on a phone and can go straight into the family group chat | every skill |

Government entitlements and rates change often. Check the official website every time they are used.

**Health**

| criterion | passes when | skill |
|---|---|---|
| **Copied from the real thing** | every drug name, dose, lab value and appointment date matches the label, result sheet or appointment slip. If incomplete, put `[ถามเภสัชกร]` | `medication-schedule` · `annual-checkup` |
| **In scope** | no sentence diagnoses, interprets results or suggests a dose, and medical questions are turned into questions for the doctor | `doctor-visit-prep` |
| **Really usable** | a table, card or reminder that the user or carer can use at once, printed or on a phone | `medication-schedule` · `doctor-visit-prep` |

If unsure whether something is out of scope, treat it as out of scope and send it as a question for the doctor or pharmacist.

**Career**

| criterion | passes when | skill |
|---|---|---|
| **True** | every title, date and figure comes from the user or a document. If missing, put `[ใส่ตัวเลข]` | `resume-th-en` |
| **On target** | matches the set job or reader, has all keywords from the posting, and irrelevant material is cut | `resume-th-en` · `linkedin-profile` |
| **Ready to use** | the user can copy it to send or say it at once · both Thai and English when readers could be either · the Applicant Tracking System (ATS) can read the file | `interview-prep` · `salary-negotiation` |

Answer money questions as a table of total yearly income, never base salary alone.

**Learning**

| criterion | passes when | skill |
|---|---|---|
| **Runs** | every code example is really run, with command and result · every milestone ends with something that runs | `paper-to-practice` · `learning-path` |
| **Cites official sources** | version, feature and exam information comes from official docs, release notes or exam guides, with link and date | `tech-radar` · `cert-prep` |
| **Fits the time** | the plan fits the time the user really has per week and has a checkpoint to continue or stop | `learning-path` |

Learn from the real thing before summaries. Reading the official docs and trying to run them beats reading 10 summary articles.

---

## 5 · Lead and subagents

| rule | detail |
|---|---|
| **Pick the agent by role** | routine tasks, subscriptions, security, goals and messages → `life-admin` · important documents → `doc-caretaker` · meetings → `meeting-prep` · bills, home and vehicle → `home-manager` · food, school, elders, pets → `family-planner` · health → `health-organizer` (caring for several people in the household → a new one per person so data does not mix) · CV, LinkedIn, offers, promotion → `career-coach` · interviews and practice → `interview-coach` · learning technology, papers, radar, certifications, side projects → `tech-mentor` (work that splits into several pieces, such as many papers or many libraries in the radar → a new one per piece) |
| **Cross-branch work** | polite messages → `polite-message-th-en` (plugin `superuser`) · coding on a real project → `software-development` · money, tax, insurance, debt → `trading-finance` · complaints against shops or contractors → `e-commerce` · labour-law rights → `e-commerce` · profile photos and visual portfolios → `graphic-design`. If that plugin is not installed, tell the user it exists, then continue with general knowledge labelled `ยังไม่ได้ตรวจ`. For multi-step work in that branch, hand off to that plugin's `/<plugin>:superuser`. |

---

## 6 · Independence — do not stop

For examples of reversible work and this plugin's order of official sources → [`examples`](references/examples.md)

**Exception that must stop work.** If the user describes symptoms that may be an emergency (chest pain · cannot breathe · one-sided weakness · unconscious · heavy bleeding · thoughts of self-harm), stop all work and tell them to call 1669 or go to the emergency room at once, before anything else.

**`รออนุมัติ`.** Irreversible or affects outsiders. The agent does not do these itself:
- Send email or messages, or accept an appointment, to anyone (company HR, boss, contractor, school, clinic, family group).
- Submit a job application · accept, decline or negotiate a real job offer · hand in a resignation · edit the real LinkedIn profile · set the Open to Work status.
- Book or contact a hospital, clinic or pharmacy · send health data to anyone, including family · buy a health-check package, medicine or equipment.
- Cancel or sign up for a service · book tickets or lodging · set up or cancel auto-debit.
- Delete or archive many emails · move files without a log that lets them be moved back.
- Change account passwords or security settings. The user always does this.
- Register for an exam · pay exam fees or buy a course · install software machine-wide or use admin rights · push to a public repo · post an article or on social media.
- Pay money · any kind of transfer (paying a bill, contractor deposit, renewing tax or insurance) · enter passwords, card numbers or account numbers · accept terms on the user's behalf.
- Delete the user's real files or data. Move them to `_to_delete/` instead.
- Hit a CAPTCHA. Do not solve it or dodge it. Tell the user to do it.

**Pre-approved.** If the user wrote it in `~/.claude/superuser-style.md` or the "กติกา" section of `CONTEXT.md`, for example "ติดป้ายและเก็บถาวรอีเมลโฆษณาได้เลย" · "อัปเดตตารางบิลเมื่อผมส่งรูปบิลมาได้เลย" · "อัปเดตตารางยาในโฟลเดอร์นี้ได้เลยเมื่อผมส่งรูปฉลากมา" · "แก้ CV ในโฟลเดอร์นี้ได้เลยไม่ต้องถาม" · "สร้างโฟลเดอร์ฝึกและติดตั้งแพ็กเกจใน venv ได้เลย", that item needs no `รออนุมัติ`, but only within the written scope. **Cannot be pre-approved:** send messages on the user's behalf · submit applications · accept or decline offers · hand in a resignation · register for or pay for exams and courses · post on the user's behalf · send health data to others · adjust or suggest doses · diagnose · change passwords or security settings · book or cancel paid services · pay or transfer money · enter passwords or card data · delete real data · CAPTCHA

---

## 7 · Final answer

Status table. Use it in place of the list under **ที่ทำ** when several items have different statuses.

| task | status | evidence |
|---|---|---|
| คัดอินบ็อกซ์สัปดาห์นี้ (triage this week's inbox) | เสร็จ | triaged 64/64 messages · 5 need a reply today, with drafts · ตรวจจริง |
| ตารางบิลไฟ ต.ค. (October electricity bill table) | เสร็จ | copied from the real bill (`จากแหล่ง`) · up 18% because the billing period was 33 days · total re-added and matches (`ตรวจจริง`) |
| ตารางยาของคุณแม่ (mother's medicine table) | เสร็จ | 7/7 drugs match the label photos · refill reminders all set · ตรวจจริง |
| CV ภาษาอังกฤษสำหรับตำแหน่ง Data Engineer (English CV for a Data Engineer role) | เสร็จ | all 12 keywords from the posting are in the CV · ตรวจจริง |
| ตัวอย่างโค้ด Raft leader election (Raft leader election code example) | เสร็จ | `python raft_demo.py` ran and passed; elected a leader across 3 nodes · ตรวจจริง |

---

## 9 · Shared files — `CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md`

Example work folders: `ชีวิต/` · `life-admin/` · `บ้าน/` · `ครอบครัว/` · `สุขภาพ/แม่/` · `สมัครงาน/` · `learning/rust/`

The `CONTEXT.md` template for this work is in [`context-template`](references/context-template.md). Its sections: งานนี้คืออะไร · เป้าตอนนี้ · ความคืบหน้า · กติกา · ของอยู่ที่ไหน · การตัดสินใจ · รับงานต่อ

- Never put in: ID card numbers, passport numbers, full account numbers · passwords · private email contents · health data of household members · disease names, results or medicine details in summary sections (point to the file instead) · national ID numbers · real salary (keep it in the user's own file) · other people's data · secrets or tokens for cloud accounts used in labs.

**Work patterns.** The lead picks a pattern when planning. Method, cost and pitfalls are in `agent-patterns`. Examples from this plugin's work are in [`examples`](references/examples.md).
