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
| Date and time format in JSON | `api-design` |
| Thai fonts and document layout | `document-design` |
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

`errors-and-logs` (error messages that must be translated) · `slide-deck` (Thai fonts in slides) · `data-import-export` (B.E. years in imports · CSV that opens in Excel) · `async-messaging` (multi-language message templates) · `human-writing/translate-th-en` (plugin `superuser`: translating whole documents, a glossary per project)

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

Use together with `i18n-and-locale` (store a neutral value, convert at display time) and `human-writing/translate-th-en` (plugin `superuser`) · every item is `จากแหล่ง` (from a source) except those with a label

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
