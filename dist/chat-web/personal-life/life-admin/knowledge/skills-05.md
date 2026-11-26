# skill: legal-help-prep

Use when facing a dispute or court summons

# Legal Help Prep (เตรียมเรื่องก่อนไปหาทนายหรือหน่วยงาน)

> **One rule:** put the facts, papers and dates in order; never say who will win. The output is a brief the user carries to a lawyer or an agency, not advice on what the law says about their case.

**When the user asks straight out** "นับวันให้หน่อย" or "จะชนะไหม": say in one line that you do not count legal deadlines or predict the result, and why (a wrong count can lose the case; the result depends on evidence a judge weighs). Then give what does help: the urgency from section 3 (court papers → a lawyer this week), the facts table from section 2, the deadline row with `[ตรวจ]`, and a free legal-aid line from section 6. No pros-and-cons list of the case either; that is a forecast by another name.

General information, not legal advice (ข้อมูลทั่วไป ไม่ใช่คำปรึกษากฎหมาย).

## Use when / not when

| Situation | Use |
|---|---|
| Landlord keeps the deposit · a debt collector calls · a neighbour dispute · unpaid wages · received a letter from a lawyer or the court · "จะไปปรึกษาทนาย ต้องเตรียมอะไร" | this skill |
| Faulty product, refund refused, unknown card charge | `refund-request` (e-commerce, if installed) — it has its own complaint ladder |
| Reading or drafting a contract or lease | `doc-contract-th` (e-commerce, if installed) |
| Laid off or asked to resign | `job-exit` first, then this skill for the visit |
| A death in the family, inheritance, a will | `estate-and-will` |
| Debt plan, which debt to pay first | `debt-payoff` (trading-finance, if installed) |
| Danger to someone's safety right now | call the police emergency line first; this skill can wait |

## 1 · Let the user tell it in their own words first

Ask for the story as it happened, in order, before sorting it into legal boxes. Then ask only what is missing: who, when, how much, what was signed, what was said in writing.

## 2 · Facts table

| # | Fact | Where it comes from | Paper | Status |
|---|---|---|---|---|
| 1 | Paid deposit 2 months, 16,000 บาท | lease clause 4 · transfer slip | have | ✓ |
| 2 | Returned the keys 2026-10-31 | LINE message to the owner | have (screenshot) | ✓ |
| 3 | Owner says the wall was damaged | owner's message 2026-11-02 | photos of the room on move-out day | need to find |

One fact per row. "Where it comes from" is a document, a message or a person, never "I think". Facts the user is unsure of stay in the table marked `ยังไม่แน่ใจ`.

## 3 · How urgent

- **ด่วน (today–3 days):** court papers or a summons received · a police letter · an eviction or seizure date · a deadline printed on a letter within 7 days.
- **ทันเวลา (this month):** a deadline exists but is weeks away · the other side has stopped answering.
- **ปกติ:** nothing dated yet.

Court and police papers always go to a lawyer or the legal-aid line the same week, even when the user thinks the claim is wrong.

## 4 · Deadline block for `important-docs`

Every date that matters becomes one row in the `important-docs` registry (CSV, same columns as there):

```csv
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
contract,"ยื่นคำให้การ คดีเงินประกันห้อง",ตัวเอง,,ศาลแขวง…,2026-11-10,[ตรวจ],,14,digital: Drive/Legal/,summons.pdf,ทนายอาสา,,"วันครบกำหนดต้องให้ทนายนับจากหมาย · เตือน 14/7/3/1 วัน"
```

- **Never compute a legal deadline for the user.** A date that has to be counted from an event (served a summons, received a letter) is written `[ตรวจ]` with the event and its date, and the lawyer or agency fills it in. A wrong count here can lose the case.
- **Run the reminder script only after the real date is in.** `due-dates.mjs` reads JSON, not the CSV, and stops on a date like `[ตรวจ]`. Once the lawyer or agency gives the date, write it the way `important-docs` step 5 does and run `node skills/important-docs/scripts/due-dates.mjs <file.json>`:

  ```json
  { "items": [ { "name": "ยื่นคำให้การ คดีเงินประกันห้อง", "end_date": "2026-11-25", "lead_days": 14 } ] }
  ```
  (`end_date` above is an example; use the date the lawyer gives.)
- Warnings at 14, 7, 3 and 1 days before; who is responsible in `holder`. This differs on purpose from the 60 / 30 / 7-day warnings in `important-docs` step 5: those suit renewals known months ahead, while a legal deadline is usually set only weeks away, so a 60- or 30-day warning would already be past and the last few days matter most.

## 5 · Contact log

Every call, visit and message, newest at the bottom:

| Date | Channel | With whom | Summary (2–4 sentences) | Who does what next | Follow up on |
|---|---|---|---|---|---|
| 2026-11-10 | phone | สคบ. officer (name) | Explained the deposit case; told to send a written demand first | user sends demand letter | 2026-11-17 |

Keep the reference number an agency gives. Never write ID or account numbers in full; the last 4 digits are enough.

## 6 · Where to take it

| Where | For | Contact | Checked |
|---|---|---|---|
| สภาทนายความ (Lawyers Council), legal aid | Free help for people who cannot afford a lawyer or who were treated unfairly; volunteer lawyers at police stations. Income and case rules not found on the page (รอยืนยัน) | hotline **1167** · 02-522-7124 to 27 · lawyerscouncil.or.th/services | ✓ 2026-11-10 |
| สำนักงานอัยการสูงสุด, legal aid by public prosecutors | Legal advice line; may take a request for further help after the advice | hotline **1157** · ago.go.th/oagservice · app อัยการช่วยได้ | ✓ 2026-11-10 |
| ศูนย์ดำรงธรรม (complaint centre, Ministry of Interior) | Complaints about local officials, public nuisance, cases no other agency takes | **1567** (free call) | ✓ 2026-11-10 |
| สคบ. (Office of the Consumer Protection Board) | Consumer disputes; register to complain online and keep the reference number | **1166** · complaint.ocpb.go.th · LINE @ocpbconnect | ✓ 2026-11-10 |
| กรมสวัสดิการและคุ้มครองแรงงาน | Unpaid wages, severance (form คร.7) | **1546** — details in `job-exit` section 6 | ✓ 2026-11-10 |
| กองทุนยุติธรรม (Justice Fund, Ministry of Justice) | Said to help with lawyer fees, court fees and bail | official page did not open; the 1111 ext. 77 line seen only in news (รอยืนยัน) | ✗ |

Pick the place by the kind of dispute; when unsure, start with 1167 or 1157 and bring this brief.

## 7 · What this brief does not do

End every brief with these lines, so the user and the next reader know its limits:

- ไม่ได้ประเมินว่าใครถูกหรือจะชนะ
- ไม่ได้คำนวณอายุความหรือวันครบกำหนดทางกฎหมาย (ช่อง `[ตรวจ]` ให้ทนายหรือเจ้าหน้าที่กรอก)
- ไม่ใช่การรับเป็นคดี และไม่ใช่คำปรึกษากฎหมาย

## Worked example

`ตัวอย่าง` The landlord of a 6-room building keeps a 16,000 บาท deposit and claims wall damage. Story first, then the facts table (5 rows, 1 marked `ยังไม่แน่ใจ`: whether photos were taken on move-out day — found later in the phone gallery). Urgency: ทันเวลา (no court paper). Consumer-type rental rules and the demand-letter ladder → `refund-request` and `moving-house` (deposit section); this skill adds the contact log and the deadline row with `[ตรวจ]` for any date counted from the demand letter. Brief ends with the "does not do" lines.

## Check before sending

- [ ] The story came from the user before any sorting
- [ ] Every fact has a source and a paper status
- [ ] No legal deadline computed; counted dates are `[ตรวจ]`
- [ ] Every hotline and agency has an official link and check date, or `(รอยืนยัน)`
- [ ] The "does not do" lines and "not legal advice" are present

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: sources.md

# Sources · legal-help-prep

## Source

Ideas from anthropics/claude-for-legal `legal-clinic/skills/client-intake`, `legal-clinic/skills/deadlines` and `legal-clinic/skills/client-comms-log` (Apache-2.0, rewritten for a person preparing their own case in Thailand, viewed 2026-11-10).

Sources, viewed 2026-11-10: https://www.lawyerscouncil.or.th/services · https://www.ago.go.th/oagservice/ · https://damrongdham.moi.go.th/news/7197a0f8-11b9-40f2-99bd-e820564ec9b1 · https://www.ocpb.go.th/faqs.php · https://complaint.ocpb.go.th/ · https://www.labour.go.th. Sources, viewed 2026-11-10: https://www.lawyerscouncil.or.th/services · https://www.ago.go.th/oagservice/ · https://damrongdham.moi.go.th/news/7197a0f8-11b9-40f2-99bd-e820564ec9b1 · https://www.ocpb.go.th/faqs.php · https://complaint.ocpb.go.th/ · https://www.labour.go.th


---

# skill: personal-kb

Use when building a personal knowledge base

# Personal KB (คลังความรู้ส่วนตัว)

A knowledge base works only if search finds the note in ten seconds. Plain Markdown files, so it survives any app change. When a notes plugin or app (Obsidian, Notion, Apple Notes) is installed, write there and keep this as the naming and tagging convention.

## Layout

```
kb/
  index.md            ← evergreen notes by category, refreshed monthly
  names.md            ← short decoder of nicknames, relatives and home words (≤ 100 lines)
  inbox/              ← quick captures, emptied weekly
  people/             ← one note per person (context, last talk, preferences)
  projects/           ← one folder per active project; archive when done
  reference/          ← how-tos, recipes, manuals, addresses, procedures
  journal/            ← dated notes, meeting notes, weekly reviews
  archive/
```

Two levels deep at most. A note's home is decided in two seconds: *is it about a person, a project, a reusable fact, or a day?*

## Naming

| Kind | Pattern | Example |
|---|---|---|
| Dated | `YYYY-MM-DD topic.md` | `2026-10-06 condo committee.md` |
| Evergreen | `topic.md` — noun first | `aircon service – Daikin bedroom.md` |
| Person | `firstname lastname.md` (plus Thai name in the note) | `ploy srisuk.md` |

## The Thai search problem

Thai has no spaces between words, so many tools match Thai words badly ("ภาษี" may not find "ภาษีเงินได้" in some apps, or finds too much). Fix:

- **File names in English or transliteration** (`tax 2569 deductions.md`), Thai content inside
- **Tags line at the top in both languages**: `tags: #tax #ภาษี #ลดหย่อน #deduction`
- **One spelling** — pick `Ploy` not `Ploi/พลอย/Ploy S.` and keep an alias line: `aliases: พลอย, Ploi`
- Dates always ค.ศ. `YYYY-MM-DD` in names — sorting and search break with mixed พ.ศ./ค.ศ.

### `names.md` — the decoder read first

Thai family talk is full of nicknames and kin words that match no file name ("ป้าน้อย" · "บ้านสวน" · "พี่หมู ที่ทำงาน"). Keep one short file, read before any search:

```markdown
ป้าน้อย = พี่สาวแม่ · ชื่อจริง สมศรี · → people/somsri.md
บ้านสวน = ที่ดินราชบุรี · → reference/ratchaburi land.md
พี่หมู = หัวหน้าทีมบัญชี (งาน) · → people/kittipong.md
```

Keep it under about 100 lines. A name used every week goes up here; one not used for months moves down into its people note's `aliases:` line. Never put ID numbers, phone numbers or health details in it.

## Note template

```markdown
# [Title]
tags: #area #คำไทย
aliases: [other names people use]
source: [link / book / person] · created YYYY-MM-DD

[One idea, in your own words. Max ~1 screen.]

Related: [[other note]]
```

## Workflow

1. **Capture (< 1 minute)** — drop into `kb/inbox/` with a dated name; formatting optional.
2. **Weekly sort (10 minutes, in `weekly-review`)** — for each inbox note: delete · merge into an existing note · file it with a proper name and tags.
3. **Split** notes over one screen into one-idea notes and link them.
4. **Index and lint monthly** — add new evergreen notes to `kb/index.md` under their category, then run the lint: notes with no `tags:` line (`grep -rL '^tags:' kb --include=*.md`) · inbox notes older than 14 days · two notes with the same title · `[[links]]` to notes that do not exist · people notes with no "last talk" date. Fix or delete each hit in the same sitting; a lint list that is carried over is a to-do list, not a knowledge base.
5. **Retrieval** — decode the words with `names.md` first, then search by file name, then tags, then full text. When a note was hard to find, rename it or add the alias you searched for — that is the maintenance loop.
6. **Answering from notes** — every answer names the note and its date ("จาก `2025-05-11 notes.md`"). A note used for a status (who is doing what, a balance, a booking) that is older than 1 month, or for a fact older than 1 year, gets the line "โน้ตนี้อายุ … อาจเปลี่ยนแล้ว". **Two notes that disagree → show both with their dates**; never pick one silently.

## Rules

- Capture is fast; organisation happens weekly, not at capture time
- **Never store passwords, OTPs, recovery codes, full ID or card numbers** — they go to a password manager (`digital-hygiene`)
- Notes about other people: facts and preferences they shared with you, not gossip or health details they did not want written
- Back up the `kb/` folder with the rest of the user's files (3-2-1 rule in `digital-hygiene`)

Related: `meeting` (Leg 2 summaries file into `journal/`) · `important-docs` (documents, not notes) · `weekly-review`.

## References

- [`references/worked-example.md`](references/worked-example.md) — open for a model fix of a hard-to-find note
- [`references/sources.md`](references/sources.md) — where the `names.md` and answering rules came from


## reference: sources.md

# Sources · personal-kb

- Source for `names.md` and the answering rules: ideas from anthropics/knowledge-work-plugins `productivity/skills/memory-management` and `enterprise-search/skills/knowledge-synthesis` (Apache-2.0, rewritten, viewed 2026-11-10).


## reference: worked-example.md

# Worked example · personal-kb

User: "I wrote down how to reset the water pump last year." Search `pump` → nothing; full-text `ปั๊ม` → 14 hits in chat exports. Found it in `2025-05-11 notes.md`, mixed with a shopping list. Fix: move into `reference/water pump – reset and service.md`, tags `#home #ปั๊มน้ำ #pump`, alias "Mitsubishi pump", link from `index.md` under Home. Next search: 2 seconds.
