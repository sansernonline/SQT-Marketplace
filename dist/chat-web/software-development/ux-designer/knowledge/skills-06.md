# skill: flag-and-propose

Use when a mid-task finding needs a decision before going on

# Flag what you found, then propose a way forward

> **Language:** write every line of wording following `human-writing`. This skill gives the format and structure. human-writing says how to write so the reader understands.

> **The one rule:** open with the **impact**, close with **one question**.
> The middle is evidence and proposals, not a story of how you found it.

## When to use this skill

- You find something that makes the original plan unusable while working on something else.
- Numbers, files or documents disagree, and you must know which to follow. Only when a wrong choice cannot be undone. If it can be undone, choose yourself and log it in [`decision-log`](../decision-log/SKILL.md).
- There are several ways forward that cannot be undone, cost a lot of money or time, or go out to outsiders, and the user must choose first. In SuperUser, finish the other parts first, then write this under **รออนุมัติ** (awaiting approval) at the end. Do not stop to ask mid-task.
- You propose adding or changing something the user has not asked for.

## When to use something else, or use it together

| Work | Skill | |
|---|---|---|
| Answer a question the user asked | `answer-shape` | instead |
| A reversible choice (can be changed later at no cost) | `principle-proceed-on-reversible-work`: do it now, then log it in `decision-log` | instead |
| An unknown fact (number, name, date, budget) | Put `(รอยืนยัน)` (awaiting confirmation) and keep going; do not stop to ask | instead |
| Report finished work | `human-writing` · `status-report` | instead |
| Explain something complex so it is understood | `answer-shape` | instead |
| Write a document for others to read | `polished-document-style` | instead |
| Something is really broken and must be fixed now | `targeted-fix`: fix first, then report | instead |
| Spell out abbreviations and jargon in the answer | `spell-out-abbreviations` | together |
| What you found is a real system incident | `incident-runbook-template` · `postmortem-template` (plugin `software-development`) | together |

---

## 1 · The 4-block answer

| Block | Length | Rule |
|---|---|---|
| 1 · What you found + the result if not fixed | 1–2 lines | **Always first.** No lead-in, no repeating the question |
| 2 · Evidence | Table, at most 5 rows | Only the numbers that disagree. Do not tell how you checked |
| 3 · Proposal | Table, at most 5 rows | Do what → **get what**, not do what → how |
| 4 · Closing question | 1 question | One question, multiple choice, every option backed by evidence (section 6) |

Block 2 can be cut if there are no numbers. Block 3 can be cut if you have no real proposal yet.
**Blocks 1 and 4 cannot be cut.**

**The whole answer should end within 1 screen.** Longer than that means you are explaining a process, not asking for a decision.

---

## 2 · Block 1: the one-sentence formula

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| Wrong: written as a story | Right: written opening with the impact |
|---|---|
| "ระหว่างทำสรุปยอดผมพบว่าไฟล์ยอดขายที่ดึงมาเมื่อเช้านี้นั้นเป็นฉบับก่อนที่ร้านจะแก้ราคา…" | "**สรุปยอดขายใช้ราคาเก่า** เพราะดึงจากไฟล์ก่อนร้านแก้ราคา ต้องดึงใหม่ก่อนส่งบัญชี ไม่งั้นภาษีคำนวณผิด 38 รายการ" |

- **The "ไม่งั้น…" (otherwise…) part must be concrete.** "ข้าม FR-14.x (Functional Requirement — ความต้องการเชิงฟังก์ชัน ข้อ 14.x) ทั้งชุด" (skips the whole FR-14.x set), not "อาจมีปัญหาตามมา" (may cause problems later).
- Do not say when or how you found it, unless how you found it changes what must be done.
- Use bold only for **words that change the decision**, not every important word.

---

## 3 · Numbers that disagree: always a comparison table

Two or more values that do not match are always harder to read in a sentence than in a table.

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| ออเดอร์ที่ดึงมา | 214 | **245** |
| ราคา SKU-07 | 390 | **420** |
| ค่าส่งต่างประเทศ | ไม่มี | **มี** |
```

- Column headings say **which value can be trusted**: "ที่บันทึกไว้ / ของจริง" (recorded / actual), not "เก่า / ใหม่" (old / new).
- Bold the correct side, so a glance shows what to follow.
- Rows that already match: **leave them out.**

**Drop an old question or assumption that new data made obsolete, in one line,**
such as "คำถามข้อ 1 เรื่องยอดไม่ตรง — ตกไปเอง" (question 1 about the mismatched total, dropped by itself), and move on. Do not explain why it dropped.

---

## 4 · Proposals as a "do what → get what" table

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| สารบัญของโฟลเดอร์งาน (`README`) | รู้ว่าอ่านอะไรก่อน ใครเป็นเจ้าของ |
| วันที่และฉบับบนหน้าแรกของแต่ละไฟล์ | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- The right column is the **benefit**, not the steps. The reader is deciding whether it is worth it, not doing it.
- Order from most worthwhile downward, not in the order of doing. "Worthwhile" is measured by the formula: people or files that benefit × impact × confidence ÷ effort. With 3 or more items, fill in numbers using the template [`templates/priority.json`](templates/priority.json) and run `node <plugin>/skills/decision-scoring/scripts/decide.mjs priority priority.json`. Put `"first": true` on any item that makes the result wrong or unsafe so it always comes first. If time is limited, use `knapsack` instead (`decision-scoring`).
- **Tie the proposal to the problem you just found, if you can.** It is the strongest reason you have.
- More than 5 rows means you are proposing several things mixed together. Split them into separate rounds.

---

## 5 · Also say what you will **not** do

One line, with the reason and when to do it instead.

> รายงานย้อนหลังรายปีไม่ทำตอนนี้ — ทำหลังยอดเดือนนี้ยืนยัน

This line heads off **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** (what about that one, why not do it), which is the question that follows almost every time.
It also signals that you thought it through and did not forget.

---

## 6 · Close with one question

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วยดึงไฟล์ใหม่ + อัปเดตสรุป
```

| Rule | Reason |
|---|---|
| **One question** per answer | If you ask two or more, you get an answer to only one |
| Answerable in a few words | "ทั้ง 4" · "เริ่มข้อ 2" |
| Offer an "all of them" option | Most users pick it. Typing their own answer costs them time |
| If there is a recommended order, put it in the question | They can answer "ตามนั้น" in one word |
| **Ask as multiple choice, every option backed by evidence** per `superuser` §6: 2–4 options · the recommended one on top, ending with `(แนะนำ)` (recommended) and 1 line of reason | They can just pick, and do not choose from options you made up |

**Never close by asking "มีอะไรให้ช่วยเพิ่มไหม" (anything else I can help with)**. It does not ask for a decision.

---

## 7 · Full example

A before-and-after example (a software requirements document and work plan) is in [`references/example.md`](references/example.md)

---


## 8 · Anti-patterns

- **Opening with "ระหว่างตรวจผมพบว่า…" (while checking I found…).** The reader must read to the end of the paragraph to learn what to do.
- **Disagreeing numbers written as a sentence.** "เดิม 214 ตอนนี้ 245" (was 214, now 245) makes the eye jump back and forth.
- **Explaining how the problem happened** when it does not change what must be done.
- **A proposal that says how to do it instead of the benefit.** The reader still cannot decide.
- **Three questions in one paragraph.** You get one answer and must ask again.
- **Closing with "แจ้งได้เลยครับ" (just let me know).** It asks for no decision.
- **A long apology for a mistake.** Say what was wrong and how you fix it. That is enough.
- **Reporting without proposing.** It pushes all the thinking back to the user.


## reference: example.md

# flag-and-propose — full example

Moved from [SKILL.md](../SKILL.md) §7

Abbreviations in the example: Functional Requirement (FR) · Non-Functional Requirement (NFR) · Test Case (TC) · Architecture Decision Record (ADR) · Functional Specification Document (FSD) · Application Programming Interface (API)

**Before: 1 long paragraph with 3 lumps. After reading it, you still do not know what to answer.**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี NFR" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ NFR ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**After: the same structure in 4 blocks**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ NFR ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | NFR | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/decisions/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**What disappeared, though the information is just as complete:** the lead-in · the story of how it was found ·
full file names that do not help the decision · the explanation of why the old question dropped ·
the how-to details of each proposal


---

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

# skill: i18n-and-locale

Use when a system shows text, dates or money in Thai and English

# Language and Locale Formats

> **The one rule:** Store a neutral value, convert at display time.
> Store time in UTC, store years in C.E. (Common Era), and store money as a number paired with a currency code.
> Anything "converted first and stored after" becomes data you cannot convert back.

## When to use this skill

- The system has Thai and English users, or may have them in the future
- You must show dates in B.E. (Buddhist Era) while storing C.E.
- Thai names sort in the wrong order, or search does not find them
- Thai text breaks a line in the middle of a word, or overflows a button

## When **not** to use it

| Task | Use this instead |
|---|---|
| Date and time data types in the database | `database-design` |
| Date and time format in JSON | `api-conventions` |
| Thai fonts and document layout | `branded-document-design` |
| Thai fonts on screen | the platform skill + `ui-craft` |

---

## 1 · Translated text

**No user-visible text may be embedded in code**, even if the project has only one language today.

```
locales/
  th.json        ← main language, the source of truth
  en.json
```

| Stack | Translation files | Key format |
|---|---|---|
| Web / libraries that use JSON | `locales/th.json` · `en.json` | Dot-separated by location, `order.cancel.confirmTitle` |
| Flutter (`gen-l10n`) | `lib/l10n/app_th.arb` · `app_en.arb` + `l10n.yaml` at the root of the code folder | **camelCase, no dots**, `orderCancelConfirmTitle`. An ARB key becomes a Dart getter name, so dots do not work. |

**Name a key by where it lives, not by its content:**

```jsonc
// Right: you can change the wording without changing the key
"order.cancel.confirmTitle": "ยืนยันการยกเลิกคำสั่งซื้อ"
// Wrong: once the wording changes, the key and the content no longer match
"ยืนยันการยกเลิก": "ยืนยันการยกเลิกคำสั่งซื้อ"
```

| Rule | Reason |
|---|---|
| Variables use names, not positions — `"เหลือ {count} รายการ"` | Word order differs in each language |
| **Never build a sentence from fragments** | Other languages order words differently, so the resulting sentence is ungrammatical |
| For a missing key, show the key, not an empty value | An empty value leaves a button with no text, and nobody sees that it broke |
| Check in Continuous Integration (CI) that every language has every key | Otherwise you find out when a customer sees it |

```
Wrong: t("มีทั้งหมด") + count + t("รายการ")
Right: t("list.total", { count })
```

**Wording in the Thai file**

- Write the Thai text directly from what the screen must say. Do not translate word by word from the key or from English text.
- 1 action, 1 word across the whole app (บันทึก, not a mix of เซฟ and บันทึก). Keep the word pairs in `locales/glossary.md` and check against that file every time you add a key.
- For wording on buttons, labels, and error messages, see `human-writing` `references/thai-grammar.md` section 4, screen register.

---

## 2 · Time — store UTC, show in the viewer's time zone

```
Store:  2026-09-25T02:42:13.482Z          (always UTC)
Show:   25 ก.ย. 2569 09:42                (viewer's Asia/Bangkok)
```

| Topic | Rule |
|---|---|
| Time an event happened | `timestamptz`, stored as UTC and converted at display time |
| Birth date, due date | Plain `date`. **No time and no time zone.** |
| "Today" in a report | Say whose time zone "today" means. Daily sales reports go wrong because of this very often. |
| Business hours | Store as `time` + the branch's time zone |

> **Thailand has no daylight saving (seasonal clock change), so it never hits this problem, until the day you sell to a customer abroad.**
> Code that adds 7 hours by hand breaks the moment a user is outside the country, so always use a time zone library.

---

## 3 · Buddhist Era

**Always store C.E., and convert to B.E. only at display time.** (`B.E. = C.E. + 543`)

| Point to watch | What to do |
|---|---|
| The user enters "2569" | Accept it, then convert to 2026 as soon as it enters the input layer |
| A 2-digit year "69" | **Never guess.** Force 4 digits, or ask clearly. If the spec says it is definitely a 2-digit B.E. year (official documents), convert in 2 steps and write a test: `68 → 2568 → 2025` |
| Importing an Excel file | First check whether the year column is B.E. or C.E. If you get it wrong, years are off by 543 with no error |
| Exporting to another system | Always send C.E., unless the destination says it needs B.E. |
| Thai digits ๒๕๖๙ | You may display them, but **never store them**. Convert ๐–๙ → 0–9 at the input layer before parsing (forms where users paste text from official documents hit this often) |

**If the system has both kinds of users, let the user pick the calendar**, but the stored value stays the same.

**Checker** — write a short script that sweeps the code for Thai text embedded in code outside the translation files · hard-coded year numbers 25xx · `new Date("…")` that takes a string with no time zone. Run it in CI before merge. (The idea comes from BV thai-date-format: a converter needs its own tests.)

---

## 4 · Sorting and searching Thai

Standard sorting (by character code) **is wrong for Thai**, because leading vowels such as เ แ โ ใ ไ
sit before the consonant they are pronounced after.

| Need | What to do |
|---|---|
| Sort Thai names | Use a Thai collation, such as PostgreSQL `th-TH-x-icu` and SQL Server `Thai_100_CI_AS` |
| Sort Thai names in a Flutter app | Dart has no built-in Thai collation (`compareTo` sorts by character code), so use the platform `Collator` through a plugin or platform channel. If that is not worth it, sort by creation time instead and tell the user. (`ยังไม่ได้ตรวจ` any package that does this) |
| Search ignoring case and tone marks | Normalize the text first, then store it in a separate search column |
| Search for a word mid-sentence | Thai has no spaces, so full-text search that splits words on spaces does not work |

> **Thai is written without spaces between words**, which affects 3 things:
> search (you need a word segmenter) · line breaking (browsers break mid-word) · truncating text with `...`
>
> On line breaking: major browsers already break Thai with a dictionary. **Never add `word-break: break-all`**, because it breaks mid-word.
> (`line-break: strict` only changes the punctuation rules for Chinese, Japanese, and Korean, and does not help Thai.)
> Then test with real Thai text. Do not test with Lorem ipsum, because it has a space after every word.
>
> Flutter `Text` breaks Thai lines with the engine's own word segmenter and has no CSS to set.
> So check with real long Thai text on a real device at both screen sizes, and allow for `maxLines` + `overflow: TextOverflow.ellipsis`.

---

## 5 · Numbers, money, and units

| Data | Store | Show |
|---|---|---|
| Money | Exact decimal, not float (in the database use `decimal(19,4)` per `stack-sql`) + currency code | `1,250.00 บาท` or `฿1,250.00` |
| Thousands separator and decimal point | Not stored | Per locale. Some countries swap them relative to Thailand. |
| Percent | Store as a decimal fraction (`0.075`) or basis points (`750` = 7.5%). **Pick one form for the whole system.** Never store as a whole-number percent, because 7.5% would become 7 or 8 | `7.5%` |
| Address | Separate fields following the Thai structure (แขวง/เขต or ตำบล/อำเภอ — sub-district/district) | |
| Phone number | Store in international format `+66812345678` | Show `081-234-5678` |

**Plurals and gender** — Thai has no plural form, but English does.
So let a library handle it. Do not write `if (count > 1)` yourself, because some languages have more than 2 forms.

---

## 6 · Screens

| Topic | Rule |
|---|---|
| Text length | English can be up to 1.5 times longer than Thai, so **leave room and do not fix a button's width** |
| Line height | Thai needs more, because upper vowels and tone marks stack 2 levels high |
| Fonts | Must have every weight for both Thai and English, or the system draws a fake bold |
| Testing | Test with real text in both languages, **not Lorem ipsum** |
| Switching language | Save the choice in the user profile, not only in the session. For an app with no user accounts (an offline mobile app), store the value on the device, with the default "follow the device language". |
| Exporting CSV for Thai users to open in Excel | Use UTF-8 **with a BOM** (otherwise Thai text is garbled). Use `.` for decimals and ISO 8601 UTC for time, such as `2026-10-05T03:15:00Z`. See also `data-import-export`. |

---

## 7 · Anti-patterns

- **Text embedded in code** because "there is only one language for now"
- **Building a sentence from fragments** — other languages order words differently
- **Storing B.E. in the database** — every function will compute time spans wrongly
- **Adding 7 hours by hand in code** — breaks the moment there are users outside the Thai time zone
- **Sorting Thai names with the standard collation** — wrong order with no error
- **Testing screens with Lorem ipsum** — you never see Thai line-breaking problems
- **`if (count > 1) "s"`** — works only for English
- **2-digit years** — "69" is 1969, 2069, or 2569
- **Importing Excel without asking whether the year is B.E. or C.E.** — years are off by 543 with nothing to warn you
- **A translation key that is missing and shows an empty value** — you get an empty button nobody notices

---

## 8 · Abbreviations

- **i18n** — internationalization (making software support many languages and locales; abbreviated this way because 18 letters sit between i and n)
- **locale** — the set of local conventions: language, date format, numbers, and currency
- **collation** — a database's rules for ordering and comparing text
- **UTC** — Coordinated Universal Time (the world standard time; Thailand is UTC+7)
- **ICU** — International Components for Unicode (the standard library for language rules and sorting)
- **BCP 47** — Best Current Practice (BCP) 47, the standard for language codes such as `th-TH`, `en-US`
- **ARB** — Application Resource Bundle (the JSON-style translation file that Flutter `gen-l10n` uses)
- **BOM** — Byte Order Mark (the 3 bytes at the start of a file that tell Excel it is UTF-8)

## 9 · Links to other skills

| Need | Use with |
|---|---|
| Date and time data types and collation | `database-design` |
| Date, time, and money format in JSON | `api-conventions` |
| Error messages that must be translated | `error-handling-patterns` |
| Thai fonts on screen | `ui-craft` + the platform skill |
| Thai fonts in documents and slides | `branded-document-design` · `presentation-design` |
| Importing files with B.E. years · exporting CSV that opens in Excel without garbled Thai | `data-import-export` |
| Multi-language notification message templates | `notifications` |
| Translating a whole set of documents or screen text, Thai↔English · a glossary per project | `translate-th-en` (plugin `superuser`) |
| Word segmentation · transliteration to Roman letters · validating national ID numbers in code | [`references/thai-text-tools.md`](references/thai-text-tools.md) |


## reference: thai-text-tools.md

# Thai text processing tools — only what was checked against official docs (2026-10-23)

Use together with `i18n-and-locale` (store a neutral value, convert at display time) and `translate-th-en` (plugin `superuser`) · every item is `จากแหล่ง` (from a source) except those with a label

## Word segmentation, transliteration, dates, numbers — PyThaiNLP (Python · Apache-2.0)

| Task | Function | Note |
|---|---|---|
| Word segmentation | `pythainlp.tokenize.word_tokenize(text, engine="newmm")` | default `newmm` (dictionary + maximal matching) · other engines `attacut` `deepcut` `icu` `longest` `nlpo3` · pass `custom_dict` as a Trie for project-specific terms |
| Romanization by the Royal Institute (RTGS) | `pythainlp.transliterate.romanize(text, engine="royin")` | default `royin` = RTGS · use for slugs and names whose owner has no English spelling yet (for personal names always use the owner's own spelling first) |
| Thai dates | `pythainlp.util.thai_strftime(dt, "%-d %b %y")` · `thai_strptime(text, fmt, year="be")` · `convert_years(year, src="be", target="ad")` | Thai month names and Buddhist Era years at display time · always store as Common Era in the system |
| Numbers as words | `pythainlp.util.bahttext(1500.50)` · `num_to_thaiword(n)` · `thaiword_to_num(s)` · `thai_digit_to_arabic_digit(s)` | `bahttext` gives "หนึ่งพันห้าร้อยบาทห้าสิบสตางค์", used in quotations and receipts |
| Clean text | `pythainlp.util.normalize(text)` | removes zero-width characters · repeated spaces · repeated vowels · stray marks — run before comparing or storing, and store as Unicode NFC |

Source: [pythainlp.org/docs/5.1](https://pythainlp.org/docs/5.1/) (api/tokenize · api/transliterate · api/util) · viewed 2026-10-23 · license Apache-2.0 per the foot of the docs page (the LICENSE file in the repo was not opened)

## 13-digit Thai national ID number — check the checksum

- Formula: digits 1–12 multiplied by weights 13 down to 2 and summed · `r = sum mod 11` · check digit = `(11 − r) mod 10` must equal digit 13
- PyThaiNLP **does not have** this function (the util index was checked) · use `python-stdnum` module `stdnum.th.pin` (`validate` · `is_valid` · `calc_check_digit` · version 2.2 · LGPL-2.1+) — [arthurdejong.org/python-stdnum/doc/stdnum.th.pin](https://arthurdejong.org/python-stdnum/doc/stdnum.th.pin) · or the `thai-id-validate` script (validate.py · validate.ts · MIT) in [Boom-Vitt/claude-thai-skills](https://github.com/Boom-Vitt/claude-thai-skills)
- JavaScript: the npm package `thai-id-validator` (no dependencies · license not checked) · the 4-line formula can be written yourself, no need to install
- A passing checksum = the format is right, not that this number really exists · an ID number is personal data; store and log it per `pdpa-compliance`

## Thai addresses — split into fields

- No general library has been verified to split Thai addresses completely (other libraries not checked) · one with code and tests: `thai-address` (parse.py · parse.ts · MIT · 11 fields · a table of 77 provinces and postal code → province) in Boom-Vitt/claude-thai-skills — the author states it is not for routing deliveries
- A safer way in a form: let the user pick province → district → subdistrict from a list, and fill the postal code automatically · store in separate fields from the start, not as one line to split later

## Sorting, counting length, truncating text

- Do not sort Thai by codepoint · use ICU: JavaScript `new Intl.Collator("th")` · PostgreSQL collation `th-TH-x-icu` · MySQL `utf8mb4_thai_520_w2`
- Count length and truncate at grapheme cluster boundaries (vowels and tone marks are not separated from the consonant): JavaScript `Intl.Segmenter("th", { granularity: "grapheme" })` · Python regex `\X` · to cut at a word boundary, run `word_tokenize` first
- Old files encoded in TIS-620 / cp874 must be decoded first (`pandas.read_csv(..., encoding="cp874")`) · `chardet` often guesses wrong on short Thai text

Source for the last 3 sections: `thai-text-processing` and `thai-id-validate` `thai-address` in Boom-Vitt/claude-thai-skills (MIT · viewed 2026-10-23) · reworded, not copied
