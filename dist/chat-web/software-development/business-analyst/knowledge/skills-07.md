# skill: principle-proceed-on-reversible-work

Use before asking to continue on undoable work

# principle · proceed on reversible work: if it can be undone, do it

> Every question that stops and waits for an answer is time when both the person and the agent are not working.
> If the work is reversible, doing it and letting them look is faster than asking and waiting.

## Tell them apart

| Reversible: do it now | Irreversible: prepare it in "รออนุมัติ" (awaiting approval) and carry on with the rest |
|---|---|
| Edit a file that has a copy or history (document file · sheet · git) | Edit or delete real data (database · master sheet · the user's files) |
| Draft a document · draft an email or customer reply (not yet sent) · draft a mockup | Send an email, message or post to outsiders |
| Run tests · calculate · try in a copy | Release to the real system (deploy · announce a price · publish) |
| Choose between 2 paths that can be changed later | Pay money · book · accept terms · enter a real secret |
| Move a temporary file to `_to_delete/` | Delete permanently |
| Code: commit on the work branch, when the user allows it | Code: merge into the main branch · force-push |

## Before you ask, pass these three gates

1. **Can an experiment show it?** If the answer is behaviour, speed, looks or output, try a draft (code work: playbook `prototype` in plugin `software-development`) instead of asking.
2. **Is it reversible?** If so, pick the path with the least impact, do it, and note it in [`decision-log`](../decision-log/SKILL.md).
3. **Is it a fact or the user's taste?** Numbers, names, dates and budgets must never be guessed: put `(รอยืนยัน)` (awaiting confirmation) and carry on with the rest. If the brand colour is missing, use that skill's default with `(รอยืนยัน)` and collect the question into "ค้างอยู่" (pending) once.

If you pass all 3 gates and still must ask, do not stop and wait. Collect every question into "ค้างอยู่" once, with your recommended path, and carry on with the rest. For irreversible work, prepare the command, the diff or the draft message in "รออนุมัติ" and do not do it yourself.

**The one exception where you may ask first:** at the start of the job, if the brief can be read in so many ways that the whole output would differ, ask once, putting every question of that round together as multiple choice, with evidence for every option (skill `superuser` section 6 → `autonomy`). After you start, do not ask again. For a fork that is irreversible, costly or reaches outsiders, use [`flag-and-propose`](../flag-and-propose/SKILL.md).

## What not to do

- Ask "ให้ทำต่อไหม" (shall I continue?) after each step of a job that was already ordered
- Offer a plan and wait for approval when the work is clear and reversible
- Use this principle as an excuse to do things the user did not ask for, because "continue" means finishing the ordered work, not widening the scope yourself


---

# skill: document-naming

Use when naming or filing a document others keep

# Naming and versioning documents

> **The one rule:** a file that a system already keeps history for (git · Google Docs version history) **must not carry a version in its name.**
> A file that leaves that system **must carry one**, because nothing else can tell you who holds which copy.

## When to use this skill

- Creating a new document that the team or the client will keep.
- Sending a document to people outside the team.
- A folder starts to fill with `final`, `final2`, `ล่าสุด` (latest), `แก้แล้ว` (edited).
- Someone asks "so which version do we go with?"

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| The content inside the document | `human-writing` (code work: `srs-writing` · `fsd-writing` in plugin `software-development`) | instead |
| Markdown formatting | `polished-document-style` | instead |
| The look of the rendered file | `branded-document-design` (plugin `software-development`) | instead |
| Temporary files during work | `superuser:temp-file-discipline` | instead |
| Code work: commit messages · version of the **program** · the project document index | `commit-message-format` · `cicd-and-release` · `project-bootstrap` (plugin `software-development`) | instead / together |
| Abbreviations in work people read | [`spell-out-abbreviations`](../spell-out-abbreviations/SKILL.md) | together |

**The revision-history table template and the standard file-name list** are in `assets/naming-cheatsheet.md`.

---

## 1 · Pick the format before naming

**One test: if someone signs it or it goes outside the team, make it a deliverable file. A document that changes with the work stays markdown in the documents folder (e.g. `docs/`).**

| Document | Format | Reason |
|---|---|---|
| Proposal · quotation · handover report · acceptance certificate · contract (software project document sets → plugin `software-development`) | **docx** | Someone signs it, so the version must be locked |
| User manual | **docx + PDF** | End users can open it on any machine |
| Presentation slides | **pptx** · if html is requested → a single .html file (file type per `presentation-design` in plugin `software-development`) · PDF when the target machine lacks the fonts | |
| Work procedures · internal guides · README · meeting notes · decision records (code work → plugin `software-development`) | **markdown** in the documents folder | It changes often, needs diffs, and is easy to search |

> 🚨 **Markdown source that can be re-rendered is kept permanently in `docs/src/<topic>.md`, then rendered to docx into the documents folder (`docs/`).**
> `docs/` holds exactly one deliverable for that topic, the .docx. No .md or .pdf of the same topic sits beside it. (The source lives in `docs/src/`, not `_to_delete/`, because it is needed every time you revise.)
> On the next revision, edit `docs/src/` and render again. Never open Word and edit by hand (matches `markdown-report-docx`). The "ต้นฉบับ" (source) line on the cover points to this file.

**Make a PDF only for user manuals, or when the client asks.** Otherwise, one docx.

---

## 2 · File name format

```
<project code>-<type>-<topic>-v<M.m>-<status>.docx
```

| Document type | Format | Example |
|---|---|---|
| Exported file | `<project>-<type>-v<M.m>-<status>.docx` | `ACME-QUOTE-v1.2-APPROVED.docx` |
| Several topics | Add the topic after the type | `ACME-REPORT-sales-v0.3-DRAFT.docx` |
| Version actually sent to the client | Add the date at the very end, in International Organization for Standardization (ISO) 8601 format | `ACME-QUOTE-v1.2-APPROVED-2026-09-25.docx` |
| Markdown document | `<type>-<topic>.md`, lowercase, hyphens | `docs/guide-onboarding.md` |
| Meeting notes (exception: date first) | `YYYY-MM-DD-<topic>.md` | `docs/meetings/2026-09-25-kickoff.md` |

**File name rules:**

- No spaces; use hyphens. Spaces break links and command-line commands.
- **The date is always ISO `YYYY-MM-DD`** and goes at the very end, so sorting by name also sorts by time. The one exception: meeting notes put the date first, because the `docs/meetings/` folder holds only meeting notes, so it sorts by date at once.
- File names are in English even when the content is Thai. This avoids trouble when attaching to email and zipping across systems.
- Never put a person's name in a file name. `-somchai-edit` is a sign that people are not working from one source.

**Check with the script:** `node <this skill's folder>/scripts/doc-name-check.mjs docs/*` → it lists wrong names with a proposed name. To rename many files, add `--plan _to_delete/renames.json` to get a plan without touching files, check or edit the plan, then run `--plan _to_delete/renames.json --apply`. The script does not rename `APPROVED` files, does not overwrite existing files, and does not put received files (`ref/`) in the plan.

---

## 3 · Versions

| Which number goes up | When |
|---|---|
| **major** (1.x → 2.0) | Scope changes · document structure changes · needs a new sign-off |
| **minor** (1.1 → 1.2) | Content added or edited, still the same topic |
| No number change | Typo fixes, layout, but you **must still log it in the revision history** |

- The first version shown to anyone is `v0.1`, and the first version someone signs is `v1.0`.
- **Version numbers only move forward.** Never go back to an old number.
- A file that a system keeps history for has no version number in its name. To refer to a version, use a tag, commit, or version history.

---

## 4 · Status is a different thing from version

| Status | Means | Who may edit |
|---|---|---|
| `DRAFT` | Still being written | The author |
| `REVIEW` | Sent for review, awaiting comments | The author, following the comments received |
| `APPROVED` | Signed off | **No edits.** Raise a new version as DRAFT |

> **Once `APPROVED`, never edit the original file**, even for a typo.
> If you can, the version the client holds and the one we hold will differ, even though the file names match letter for letter.

---

## 5 · The revision history must be in the file

**A file name says only which version this is, not what changed.**
Every exported document must have this table on the first page.

```markdown
| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | สมชาย | เพิ่มบทสรุปผู้บริหาร · ตารางราคาเป็น 12 รายการ | ลูกค้าขอเพิ่มสรุป |
| 1.1 | 2026-09-12 | สมชาย | แก้ระยะส่งมอบจาก 3 วันเป็น 5 วัน | ถามผู้ขนส่งแล้วทำไม่ได้ |
| 1.0 | 2026-09-01 | สมชาย | ฉบับเซ็นรับ | — |
```

- **The "แก้อะไร" (what changed) column must be concrete.** "Improved the content" helps nobody.
- Put the newest on top. A reader opening the file wants to know what changed last.

---

## 6 · Storage and sending

| Topic | Rule |
|---|---|
| Source | Lives in `docs/src/` of the work, in one place only (code work: `project-doc-set` in plugin `software-development`) |
| Exported files | Live in the documents folder (`docs/`) or the client's storage, **not the project root** |
| Received files | Keep their original name; never rename. They refer to that name |
| Files mid-conversion | `_to_delete/` (see `superuser:temp-file-discipline`) |
| Sending by chat or email | Always send a file with the version and status in the name. Never send `เอกสาร.docx` |

---

## 7 · Anti-patterns

- **`final.docx`, `final2.docx`, `final_ล่าสุด.docx`**: nobody knows which is newer.
- **`ใบเสนอราคา แก้แล้ว.docx`**: edited from which version, and what was edited?
- **Putting a version in the name of a file that a system keeps history for.** You get `spec-v1.md` and `spec-v2.md` side by side forever.
- **Editing a file that is already `APPROVED`**, even a single typo.
- **No revision-history table.** Then you must open and compare page by page.
- **Dates like `25-09-2026` or `250926`.** They do not sort, and people read them differently.


---

# skill: pdpa-compliance

Use when software stores personal data in Thailand

# PDPA — personal data

> **The one rule:** data you never collect cannot leak, needs no care and never has to be deleted.
> The first question is always "do we need to collect it?", not "how do we keep it safe?"

> Caution: this is guidance for people who build systems. **It is not legal advice.**
> Anything with legal effect must be decided by a legal adviser.

## Shortcut — apps whose data stays on the user's device only

If the app has no server, no accounts and sends no data out, skip the sections on processors and databases. Then check only these 3 things.

| Item | Why it still matters | What to do |
|---|---|---|
| Android Auto Backup | By default the system backs up app data to Google Drive on its own | Set `android:allowBackup` and `android:dataExtractionRules` to match your intent, and record the reason in `decision-log` |
| Export · share sheet (the system's share window) | This is the only way data leaves the device | Send only what the user selected, and do not attach location or image metadata without telling them |
| Data the app store forces you to declare | Google Play requires the Data safety form for every app | Fill it in truthfully (if you collect nothing, say so). Whether requesting camera permission requires a privacy policy is `(รอยืนยัน)` (awaiting confirmation), so prepare a short page first |

If you later add analytics · crash reports or user accounts, the app is no longer device-only. Go back and apply the whole skill.

## When to use this skill

- The system stores names, phone numbers, emails, addresses, ID card numbers, photos or other data that identifies a person
- A customer or the legal team asks about PDPA compliance
- You must build a consent page, or a page where users request deletion of their data
- You will send data to an outside service provider

## When **not** to use it

| Task | Use this instead |
|---|---|
| A trail of who did what to the data | `audit-trail` |
| Tables and column-level encryption | `database-design` |
| Authentication and permissions | `auth-implementation-patterns` |
| Masking data in logs | `logging-standards` |
| Where to keep keys | `config-and-secrets` |
| Consent forms, privacy notices and a company's PDPA documents (not a software system) | (if plugin `e-commerce` is installed) `e-commerce:pdpa-workflow`; if it is not, use item 3 of this skill as the outline |

---

## 1 · Make the inventory first

**Without this inventory you cannot answer "where is my data?"**

| Data | Stored where | Why collected | Legal basis | Kept how long | Who can see it | Sent to whom |
|---|---|---|---|---|---|---|
| Full name | `users.name` | Identify the customer | Contract | 5 years after the account closes | Sales · admins | — |
| Phone number | `users.phone` | Send delivery status | Contract | Same as the row above | Same as the row above | SMS provider |
| National ID number | `kyc.id_number` | Legally required identity check | Legal obligation | 10 years | Compliance team | — |

**List every place that really holds data**: main database · backups · logs · analytics systems ·
file storage · spreadsheets the team keeps by hand · mobile apps (Android Auto Backup and files exported through the share sheet)

---

## 2 · Legal basis — not everything needs consent

| Basis | Use when | Example |
|---|---|---|
| **Contract** | Needed to provide the agreed service | Delivery address |
| **Legal obligation** | The law requires you to keep it | Tax documents |
| **Legitimate interest** | Necessary, and does not harm rights excessively | Security logs · fraud prevention |
| **Consent** | No other basis works | Marketing · behavior-tracking cookies |

> **Consent is the weakest basis because it can be withdrawn at any time.**
> If you ask consent for the delivery address and the person withdraws, the system cannot ship.
> **The delivery address uses the contract basis**, not consent.
>
> A button labeled "accept all" that blocks use of the service unless pressed does not count as freely given consent.

---

## 3 · Consent that works in practice

| Required | Details |
|---|---|
| **Separate by purpose** | Email marketing · behavior tracking · sharing with partners — separate checkboxes |
| Not pre-ticked | It must be the user's own action |
| Text an ordinary person can understand | Not a 500-word legal paragraph |
| **Recorded** | Who · for what · when · which text version · through which channel |
| Withdrawing is as easy as giving | If it takes 1 click to give, it must take 1 click to withdraw |
| Withdrawal takes real effect | **Code must actually stop using that data**, not just store the flag |

Required table: `consent` — `user_id` · `purpose` · `granted` · `granted_at` · `withdrawn_at` ·
`policy_version` · `source` · `ip`
**Keep it as history, never overwrite.** You must be able to prove later what the person agreed to at that time.

---

## 4 · Data subject rights

The system must be **able to do these for real**, not wait for manual work each time. In general you must respond within 30 days.

| Right | What the system must be able to do |
|---|---|
| Access | Produce a copy of all that person's data |
| Rectification | Correct inaccurate data, then **pass the correction on to every place the data was sent** |
| **Erasure** | Delete for real from every place in active use, including logs. For backups, take them out of use (if one is restored, delete again) and let them expire through the rotation cycle (see item 6). Tell the data subject by which date the data in backups will be gone. |
| Restriction | Stop using the data temporarily without deleting it |
| Portability | Export in a machine-readable format |
| Objection | Stop the marketing or processing the person objects to |

> **"Erasure" is the hardest one.** Data sits in the database, backups, logs, analytics systems
> and outside providers. **Design for deletion from day one**, not a hunt afterward.
>
> Soft delete alone **does not count as deletion**. Data the law requires you to keep (such as tax documents)
> may be kept, but you must tell the data subject what you keep and why.

---

## 5 · Collect only what you need

| Principle | Example |
|---|---|
| **Do not ask for what you do not use** | An online shop does not need the national ID number |
| Store a range instead of the exact value | Store an age range, not the birth date, if you only use it to group people |
| **Hash or anonymize** for analytics | A statistics system does not need to know who is who |
| Column-level encryption | ID numbers, health data |
| Mask on display | `x-xxxx-xxxx-12-3` |
| **Keep sensitive data out of the main table** | Easier to restrict and audit |

**Sensitive data has a stricter tier** (section 26), for example race, ethnic origin, political opinion, creed, religion or philosophy, sexual behavior,
criminal record, **health data**, disability, trade union data, genetic data, biometric data, and other data that affects the subject in a similar way.
It may be collected only when truly necessary, and needs stricter measures than usual (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act B.E. 2562, 2019) section 26, checked 22 Oct 2026 (B.E. 2569))

**Never use real data on development machines or staging.** Always mask it first (see `cicd-and-release`).

---

## 6 · Retention

- Set it **per data type**, not one value for the whole system
- **Have a real deletion job that runs on a schedule.** A policy with no job running does not exist.
- Logs that contain personal data also have a lifetime (see `logging-standards`)
- Data backups need a rotation cycle that makes old data disappear on its own in the end
- Before the first real deletion, show the list of what will be deleted and have a person approve it

---

## 7 · Outside providers and sending data abroad

| Topic | What to do |
|---|---|
| List of processors | List what data goes to whom — cloud · SMS · email · analytics · chat |
| Contract | Have a data processing agreement with every one |
| Sending abroad | Check that the destination country has adequate standards, or that standard contract clauses cover it |
| Analytics and ad trackers | Count as sending data out — **they need a legal basis** |
| Ending a service | You must get the data back and have them delete it for real |

> **The most commonly forgotten spot:** an analytics plugin added on day one sends users' behavior
> data abroad every day, and nobody ever put it on the list.

---

## 8 · When data leaks — the first 72 hours

| Order | What to do |
|---|---|
| 1 | **Stop the leak first** — revoke keys, close the channel |
| 2 | Assess the scope — what data, how many people, is it sensitive |
| 3 | Preserve evidence — logs and system state **before** you overwrite anything |
| 4 | Notify the internal owner and the legal adviser at once |
| 5 | **Notify the สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Committee Office) within 72 hours** when the conditions are met |
| 6 | Notify the data subjects when the risk to them is high |
| 7 | Record the incident with `postmortem-template` |

**Prepare in advance, not when it happens** — who decides to notify · the legal adviser's phone number ·
the notification message template · how to pull the list of affected people

---

## 9 · Anti-patterns

- **Asking consent for everything** — when they withdraw, the system cannot keep working
- **Pre-ticked checkboxes** — they do not count as consent
- **Storing consent as one value `accepted_terms = true`** — you cannot prove later what was agreed
- **Soft delete, then saying it is deleted**
- **A retention policy with no real deletion job**
- **Real data on staging** — and copied onto developer machines
- **Collecting the national ID number "just in case"**
- **Personal data in logs and crash reports**
- **No list of outside providers** — you cannot say where the data goes
- **Exporting a full-data Excel file** for someone who needs only the totals
- **A privacy policy that does not match what the system really does**

---

## 10 · Frequently cited sections, and abbreviations

Use this when a customer or the legal team asks "which section is this?" (checked against the unofficial English translation of the 2019 Act, Royal Gazette 27 May 2019 (B.E. 2562), on 23 Oct 2026 (B.E. 2569))

| Topic (item in this skill) | Section |
|---|---|
| Consent (item 3) | 19 |
| Legal bases that need no consent (item 2) | 24 |
| Sensitive data (item 5) | 26 |
| Sending data abroad (item 7) | 28 |
| Data subject rights (item 4) — access · portability · objection · erasure · restriction · rectification | 30 · 31 · 32 · 33 · 34 · 35–36 |
| Security measures · deletion system on expiry · breach notice in 72 hours (items 6, 8) | 37(1) · 37(3) · 37(4) |
| Records of processing (item 1) | 39 |
| Data Protection Officer (DPO) | 41 |
| Compensation · punitive damages | 77 · 78 |
| Administrative fines, maximum 1 · 3 · 5 million baht | 82 · 83 · 84 |

**Sectors with a second layer of rules** — health · finance · telecom have their own regulators (กระทรวงสาธารณสุข (Ministry of Public Health) · ธปท. (Bank of Thailand, BOT) / ก.ล.ต. (Securities and Exchange Commission, SEC) / คปภ. (Office of Insurance Commission, OIC) · กสทช. (National Broadcasting and Telecommunications Commission, NBTC)) that add conditions on confidentiality, retention and breach notice. Check that sector's rules before designing, and do not rely on PDPA alone (idea from BV thai-pdpa (MIT))

- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
- **Personal data** — data that identifies a person, directly or indirectly
- **Sensitive data** — the special category of personal data, such as health, race, religion
- **Data controller** — whoever decides how data is collected and used (usually the system owner)
- **Data processor** — whoever processes data on the controller's instructions, such as a cloud provider
- **Data subject** — the person the data belongs to

## 11 · Links to other skills

| Need | Use with |
|---|---|
| A trail of who viewed or changed data | `audit-trail` |
| Tables, encryption and soft delete | `database-design` |
| Masking data in logs | `logging-standards` |
| Access rights and authentication | `auth-implementation-patterns` |
| Masking real data before loading staging | `cicd-and-release` |
| Sending and unsubscribing from marketing messages (consent stays in this skill) | `notifications` |
| Masking data in exported files | `data-import-export` |
| Retention of attached files | `file-upload-and-storage` |
| Jobs that delete expired data | `background-jobs` |
| Recording the incident after a leak | `postmortem-template` · `incident-runbook-template` |
