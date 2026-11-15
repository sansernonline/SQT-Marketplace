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
| Abbreviations in work that people read | `spell-out-abbreviations` | together |

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

---

## 8 · Anti-patterns

- **Keeping the audit in general log files**: deleted by retention within a month
- **Recording the actor's name instead of the id**: when they change their surname, the old history turns into a different person
- **Recording only successes**: the denied attempts are what auditors look for
- **Recording only "edited data"** without saying from what to what
- **The app has UPDATE permission on the audit table**: a trail that can be edited is not a trail
- **Writing the audit outside the transaction**: the transaction succeeds but there is no record
- **Recording every click**: the important entries sink in a pile of data nobody uses
- **Copying sensitive data into the audit**: it creates a new leak by accident
- **No screen to view it**: the data exists, but a developer must run a query every time a customer asks


---

# skill: notifications

Use when a system sends email, SMS, LINE or push

# User notifications

> **One rule:** users stop reading everything if they receive enough that they did not need to read.
> Every message sent beyond what is necessary makes the necessary messages get ignored too.
> For Thai text in templates → `human-writing` `references/thai-grammar.md` section 4, register "screen"

## When to use this skill

- The system must send email, SMS, LINE push or in-app notifications
- Users complain of getting duplicates, getting too many, or getting none
- You must build a settings page for which notifications to receive
- Important email lands in spam

## When **not** to use it

| Task | Use this instead |
|---|---|
| Alerting the team when the system has a problem | `observability-basics` |
| Queue mechanics and retries | `background-jobs` |
| Multi-language messages | `i18n-and-locale` |
| Marketing consent | `pdpa-compliance` |

---

## 1 · Choose the channel by urgency, not by habit

| Channel | Good for | Limits |
|---|---|---|
| **In-app** | Everything — a permanent record that can be looked back at | Seen only when the user opens the app |
| **Email** | Receipts, summaries, attachments, things to keep | Slow · can land in spam |
| **push** | Things the user must know now | Can be turned off · lost if not tapped |
| **LINE** | Thailand · general customers · high open rate | Cost per message · provider rules apply |
| **SMS** | Verification codes · urgent things that must arrive | Most expensive · 70 characters if Thai |

> **Thai SMS holds only 70 characters per message** (not 160 as in English).
> Anything longer is split into several messages and billed for every part, so always count the length before sending.

**One matter goes on one channel** — unless it is something that truly cannot be missed.
Let the user choose which channel they want (section 5).

---

## 2 · Message templates live outside the code

```
templates/
  order-confirmed/
    th.subject.txt  th.html  th.txt
    en.subject.txt  en.html  en.txt
```

| Rule | Reason |
|---|---|
| **Never build messages by string concatenation in code** | Every wording change would need a new deploy |
| Variables are named | Use names like `{{customerName}}`, not positions |
| Email needs both HTML and plain text | Spam filters lower the score of HTML-only email |
| One file per language | See `i18n-and-locale` |
| **Test with real values before sending** | A leaked `สวัสดีคุณ {{name}}` damages the brand |

**Every message needs 3 things** — what happened · which item it concerns (with a reference number) · what to do next (a single button)

---

## 3 · Always send as a background job

> **A failed email must not make the order fail.**
> Separate them with a queue — the transaction is saved first, then the message enters the send queue (see `background-jobs`)

| Topic | Rule |
|---|---|
| Enqueue after the transaction succeeds | Not during the transaction, because if it rolls back later the email has already gone out |
| retry | 3 times, doubling the wait each round, then move to the dead letter queue (a queue that holds jobs that failed to send) |
| **Prevent duplicate sends** | Use a unique key `(type, entity_id, event_id, recipient)` — `event_id` is the id of the event or version of the change (for example, the 2nd status of the same order must be sendable). Do not just hope nobody calls twice |
| Urgent messages (OTP codes) | Use a separate queue so they do not wait behind 5,000 monthly summary emails |

**Prevent a flood** — set a per-user ceiling per hour, and merge frequent events of the same kind
into one message ("มี 12 รายการใหม่", not 12 messages).

---

## 4 · What must never go in a message

| Never | Put this instead |
|---|---|
| Passwords | A reset link that expires |
| Full card numbers · national ID numbers | The last 4 digits |
| Health data, test results | "มีผลตรวจใหม่ กรุณาเข้าระบบเพื่อดู" |
| Attachments with sensitive data | A link that requires login first |
| Links reachable without identity verification | A short-lived link that checks permission |

> **Treat email as a postcard** — it passes through many systems, sits in a mailbox on a device that may not be theirs,
> and can be found forever.

**Links in email must be on our own domain** — shortened links make users unable to tell them from scam email.

---

## 5 · Let users choose

| Type | Can it be turned off? |
|---|---|
| Transactional (receipts · verification codes · security notices) | ✗ cannot be turned off |
| Action (order status · someone replied) | ✓ the channel can be chosen |
| Periodic summary | ✓ the frequency can be chosen |
| Marketing | ✓ **consent must be obtained before sending** (see `pdpa-compliance`) |

- Settings table: `user_id` · `notification_type` · `channel` · `enabled`
- **Every non-transactional message must have an unsubscribe link**, and it must take effect within 24 hours (our own internal target, stricter than the 2 days that Gmail and Yahoo set)
- **High-volume marketing email** must also carry a one-click unsubscribe header: `List-Unsubscribe: <https://...>` (an HTTPS URL) together with `List-Unsubscribe-Post: List-Unsubscribe=One-Click` per the RFC 8058 standard, and the email must pass SPF + DKIM (Gmail applies this to senders above about 5,000 messages per day · it applies to marketing email, not transactional · without it the email is more likely to land in spam) — sources: support.google.com/a/answer/14229414 · senders.yahooinc.com/best-practices checked 22 Oct 2026 (B.E. 2569)
- Unsubscribing must work without logging in — use a token in the link
- Respect "quiet hours" — never send non-urgent push or SMS at 2 a.m. (by the recipient's time zone)

---

## 6 · Track delivery

| Status | Meaning |
|---|---|
| `queued` · `sent` | Entered the queue · left our system |
| `delivered` | The destination accepted it |
| `bounced` | Did not arrive — **separate hard (the address does not exist) from soft (mailbox full)** |
| `failed` | Could not be sent |

- **Stop sending to an address immediately after a hard bounce** — continuing gets our domain blacklisted
- Keep a send log to answer "why didn't the customer get it" — who, which channel, when, what result
- Email that must arrive needs **SPF · DKIM · DMARC** all set, or it lands in spam with no warning at all
- Measure: delivery success rate · bounce rate · queue backlog (see `observability-basics`)

---

## 7 · Anti-patterns

- **Sending the message in the same request as the transaction** — the email provider is slow and the screen hangs
- **Sending before commit** — rolled back, but the customer already got the email
- **Messages in code** — every wording change needs a new deploy
- **No duplicate prevention** — the customer gets 5 receipts
- **Sending on every channel at once** — the user turns everything off within a week
- **No unsubscribe link** — the user clicks "this is spam" instead and our domain loses reputation
- **Putting sensitive data in the message body**
- **Continuing to send to a hard bounce** — the domain gets blacklisted
- **Not counting the length of Thai SMS** — costs balloon without anyone noticing
- **No send log** — you cannot tell the customer whether it was sent

---

## 8 · Abbreviations

- **OTP** — One-Time Password
- **RFC** — Request for Comments (internet standards documents) · RFC 8058 = the standard for the one-click unsubscribe header
- **push notification** — a notification that pops up on the user's device
- **bounce** — an email that did not arrive and was returned
- **SPF · DKIM · DMARC** — standards that prove an email was really sent from that domain
- **opt-in / opt-out** — asking to receive / asking to stop receiving
- **LINE Official Account** — a business's official account on LINE, used to send messages to customers

## 9 · Link to other skills

| Need | Use together with |
|---|---|
| Retry queue and dead letter | `background-jobs` |
| Multi-language messages | `i18n-and-locale` |
| Marketing consent | `pdpa-compliance` |
| Settings table and send log | `database-design` |
| Delivery success rate metrics | `observability-basics` |
| Attachments and expiring links | `file-upload-and-storage` |
| Alerting the team when the system has a problem | `observability-basics` · `incident-runbook-template` |
| Broadcast to LINE OA friends (quota · target group · frequency) | `e-commerce:line-broadcast` (if installed) |


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
