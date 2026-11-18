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
| Markdown formatting | `polished-document-style` | instead |
| The look of the rendered file | `branded-document-design` (plugin `software-development`) | instead |
| Temporary files during work | `superuser:temp-file-discipline` | instead |
| Code work: commit messages · version of the **program** · the project document index | `commit-message-format` · `cicd-and-release` · `project-bootstrap` (plugin `software-development`) | instead / together |

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
> `docs/` holds exactly one deliverable for that topic, the .docx. No .md or .pdf of the same topic sits beside it.
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
- Never name a file `final` · `final2` · `final_ล่าสุด` · `แก้แล้ว`: nobody can tell which is newer, or what was edited from which version. Use the version, status and revision history instead.

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

**Checker** — write a short script that sweeps the code for Thai text embedded in code outside the translation files · hard-coded year numbers 25xx · `new Date("…")` that takes a string with no time zone. Run it in CI before merge. A converter needs its own tests.

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

## Links to other skills

`error-handling-patterns` (error messages that must be translated) · `presentation-design` (Thai fonts in slides) · `data-import-export` (B.E. years in imports · CSV that opens in Excel) · `notifications` (multi-language message templates) · `translate-th-en` (plugin `superuser`: translating whole documents, a glossary per project)

## References

- [`references/thai-text-tools.md`](references/thai-text-tools.md) — open for word segmentation · transliteration to Roman letters · validating national ID numbers in code
- [`references/abbreviations.md`](references/abbreviations.md) — open when a term (i18n · collation · ICU · BCP 47 · ARB · BOM) must be explained


## reference: abbreviations.md

## 8 · Abbreviations

- **i18n** — internationalization (making software support many languages and locales; abbreviated this way because 18 letters sit between i and n)
- **locale** — the set of local conventions: language, date format, numbers, and currency
- **collation** — a database's rules for ordering and comparing text
- **UTC** — Coordinated Universal Time (the world standard time; Thailand is UTC+7)
- **ICU** — International Components for Unicode (the standard library for language rules and sorting)
- **BCP 47** — Best Current Practice (BCP) 47, the standard for language codes such as `th-TH`, `en-US`
- **ARB** — Application Resource Bundle (the JSON-style translation file that Flutter `gen-l10n` uses)
- **BOM** — Byte Order Mark (the 3 bytes at the start of a file that tell Excel it is UTF-8)


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


---

# skill: audit-trail

Use when a system must record who did what and when

# Audit trail

> **One rule:** a trail cannot be built after the fact.
> The day a customer asks "who changed this price", if it was not recorded beforehand, it can never be answered.

## When to use this skill

- The system has approvals, money, user permissions, or personal data
- A customer or auditor can ask "who did it, when, and what was changed from what to what"
- There was a dispute over edited data and nobody could answer
- The system falls under the Personal Data Protection Act (PDPA) or a standard that must be checkable after the fact

## When to use another skill, or together

| Job | skill | |
|---|---|---|
| Logs for technical troubleshooting | `logging-standards` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `srs-writing` | together |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| Who reads it | developers, when troubleshooting | auditors · customers · the legal team |
| What it records | anything that helps troubleshooting | **only events with business meaning** |
| Where it is kept | files · a log collection system | **a table in the database**, or storage that cannot be overwritten |
| Lifetime | 7–90 days | **years, as the law or contract requires** |
| Can it be edited | does not matter | **never edit, never delete** |
| Can it be lost | some loss is acceptable | **cannot be lost.** If the write fails, the transaction must fail with it |

> **Always keep these 2 separate.** An audit log mixed into the general log files
> gets deleted by the log retention period within a month, and nobody finds it when it is needed.

---

## 2 · Fields every entry must have

| Field | Example | Note |
|---|---|---|
| `id` | UUIDv7 | sortable by time |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC**, and the time it happened, not the time it was recorded |
| `actor_id` | `1042` | the user id, not the name, because names can change |
| `actor_type` | `user` · `system` · `api_client` | automated jobs need an identity too |
| `actor_ip` · `user_agent` | | keep only when needed for the audit |
| `action` | `order.cancelled` | **a past-tense verb**, in one style across the system |
| `entity_type` · `entity_id` | `order` · `1042` | the thing acted on |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | only the fields that changed |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" (customer phoned to cancel) | required for actions that need a reason |
| `correlation_id` | `01J9Z8…` | links back to the application log |
| `result` | `success` · `denied` | **denied attempts must be recorded too** |

> **A denied action is worth more than a successful one**, because someone trying to reach something
> they have no right to is what auditors most want to see, and it is the best warning sign there is.

---

## 3 · Which events to record

**Record:**

| Group | Examples |
|---|---|
| money and contracts | create/cancel/refund · price change · discount change |
| approvals | approve · reject · send back for fixing |
| permissions and identity | grant/revoke permission · create/close account · change password · consecutive failed logins |
| personal data | view · edit · export · delete |
| system settings | changing a value that affects the whole system |
| bulk data access | exporting a report · downloading a name list |

**Do not record:** ordinary screen views · searches · sorting · clicks that change nothing.
An audit log that records everything is worth the same as none, because nothing can be found in it.

**Name actions in one style across the system:** `<entity>.<past-tense verb>`, for example `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · How to record "what changed"

| Method | Good | Bad |
|---|---|---|
| **Record only the changed fields (from/to)** ✓ | small, readable at once | to see the whole picture you must trace back |
| Record the whole row before and after | full picture | grows very fast and risks keeping more sensitive data than needed |
| Record only that "it was edited" | smallest | **cannot answer the question**, so do not use it |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**For sensitive fields, record only that it changed, not the value:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · Never edit after writing

- Grant the audit table only **INSERT and SELECT**. The account the app uses must have no UPDATE or DELETE permission.
- Write in the same transaction as the real data change. **If the audit write fails, the transaction must fail with it.**
- Never edit history to "tidy up". If a record is wrong, add a correction entry. Do not overwrite.
- A system that needs stronger protection should chain the entries with hashes, to prove nobody inserted or deleted anything.

**Retention** follows the law or the contract. Accounting documents in Thailand usually must be kept 5 years.
When the period ends, move them to cheap storage. Never delete them without someone's approval.

---

## 6 · Who can view, and what must not be recorded

| Topic | Rule |
|---|---|
| Read permission | only roles with an audit duty, and **reading the audit log must also be recorded in the audit** |
| Export | record every time who exported which period |
| **Must not record** | passwords · tokens · ID card numbers · health data · the content of personal data |
| Record instead | point to **which item** was viewed or edited, not the content inside |

> `patient_record.viewed` with the `entity_id` is enough. **Never copy test results into the audit log.**
> Otherwise the audit log becomes the most sensitive data store in the system, without anyone meaning it to.

---

## 7 · Show it to people

The history screen must filter by at least 4 things: **time period · actor · action type · which item**.

Show it as a sentence people can read, not raw JSON (the sample below is the Thai text shown to Thai users: on 25 Sep 2569 [B.E.; 2026] at 16:42, Somchai (sales) cancelled order SO-2026-00042, status: confirmed → cancelled, reason: customer phoned to cancel):

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

Show the time in the viewer's time zone, but store it as UTC (see `i18n-and-locale`).
