# skill: data-import-export

Use when a system imports or exports Excel or CSV

# Importing and exporting data

> **The one rule:** validate everything first, then write.
> If you write halfway and then find a bad row, the data is left half-done and nobody knows what to fix.

## When to use this skill

- A screen lets users upload Excel or CSV to bring data into the system
- A button exports to Excel or CSV
- Moving data from an old system into a new one
- A user uploads and gets the message "ไฟล์ไม่ถูกต้อง" (file is invalid) without knowing what is wrong

## When to use another skill instead, or together

| Job | skill | |
|---|---|---|
| Receiving general file uploads (images, documents) | `web-service-essentials` | Instead |
| Building a nicely formatted Excel file | `anthropic-skills:xlsx` | Instead |
| Queue mechanics and progress | `async-messaging` | Instead |
| Buddhist Era (B.E.) years and Thai sorting order | `i18n-and-locale` | Instead |
| Sending documents into Thai accounting software (PEAK · FlowAccount) through an API instead of a file | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | Instead |
| Recording who imported or exported what | `web-service-essentials` | Together |
| Masking personal data in export files | `pdpa-compliance` | Together |
| Telling the user when an import finishes | `async-messaging` | Together |
| Limits and constraints of the target table | `database-design` | Together |

---

## 1 · Give a template, do not make people guess

**Every import screen needs a button to download a template.** The template contains

- Column headers that match exactly what the system needs
- **1–2 correct sample rows**
- A row explaining which columns are required, what format, and which values are accepted
- A separate sheet for lists of selectable values (status, type, unit)

| How the file differs from the template | Do this |
|---|---|
| Column order swapped | ✓ Read by header name, not by position |
| Header has extra spaces or different letter case | ✓ Trim spaces and compare case-insensitively |
| Extra unknown columns | ✓ Skip them, but **tell the user what was skipped** |
| A required column is missing | ✗ Stop at once and say which column is missing |

---

## 2 · Three layers of validation before writing anything

| Layer | Checks | Example message |
|:--:|---|---|
| 1 · File | Opens · has the needed sheet · all required columns present · within the maximum row count | "ไม่พบคอลัมน์ 'รหัสสินค้า'" (column 'product code' not found) |
| 2 · Per row | Data type · required values · in the allowed list · number range | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" (row 42, column 'quantity' must be a number above 0, found '-5') |
| 3 · Relationships | The code exists in the system · no duplicates within the file · business rules | "แถว 88 ไม่พบลูกค้ารหัส C-1042" (row 88, customer code C-1042 not found) |

**An error report must state: row · column · value found · value expected**

```
Wrong: "ไฟล์ไม่ถูกต้อง"
Wrong: "พบข้อผิดพลาด 37 รายการ"
Right: a table of check results, with a button to download the original file with an "ข้อผิดพลาด" (error) column appended
```

> **Report all errors in one pass. Do not stop at the first bad row.**
> The user then fixes everything in one round, instead of uploading 37 times.

---

## 3 · Writing into the system

| Mode | Use when |
|---|---|
| **All or nothing** | The default. The file must be fully correct to be imported |
| Do what passes, skip the bad rows | The file is very large and the rows are unrelated, and **the user must choose this, the system does not decide for them** |

- **Always show a summary page before confirming**, such as "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" (will add 120 · update 45 · skip 3 · error 0), then have the user click confirm
- If the file has duplicate rows, stop and say so. Do not silently use the last row
- If the data already exists in the system, let the user choose: skip · overwrite · stop
- **Every import must be recorded in the audit log**: who imported, which file, how many rows affected (see `web-service-essentials`)
- **Keep the original file**, so when there is a problem you can look back at what the submitted file really looked like
- Make it reversible: store a batch id (the id of the import run) on every imported row

**Large files run as background jobs.** Above roughly 1,000 rows, put them in a queue,
split into batches of 500 rows, show progress, and allow cancel (see `async-messaging`).

---

## 4 · Excel and CSV traps

| Trap | What happens | Fix |
|---|---|---|
| **Thai in CSV garbled** | Opened in Excel, the characters are unreadable | Save as UTF-8 **with a BOM**, or recommend .xlsx |
| **Codes starting with 0 lose it** | `0812345678` becomes `812345678` | Always read as text, and on export set the cell format to text |
| **Long numbers turn into scientific notation** | A 13-digit ID card number → `1.23457E+12` | Same as above |
| **Dates interpreted automatically** | Is `03/04/2026` March or April | Force `YYYY-MM-DD` in the template |
| **B.E. and C.E. years mixed** | Silently off by 543 years | **Ask on the import screen which year style the file uses** |
| Trailing spaces in a value | Code matching fails | Trim leading and trailing spaces on every value |
| Cells that are formulas | You get the formula instead of the value | Read the calculated value |
| **Values starting with `=` `+` `-` `@` in an export file** | Excel runs a command when the user opens it | Prefix with `'` any value that starts with these characters |

> **A vulnerability people rarely know about:** a customer name of `=cmd|'/c calc'!A1`, if exported raw
> and someone opens it in Excel, will try to run the command for real. So always escape on export.

---

## 5 · Export

| Topic | Rule |
|---|---|
| Size | Above roughly 50,000 rows, run it as a background job and send a download link |
| Permission | **Export only data that this user already has permission to see**, because this is the most common leak |
| audit | Record every time who exported what data, which period, how many rows |
| Personal data | Mask columns that are not needed (see `pdpa-compliance`) |
| File name | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| File header | Put in the filter conditions used and the export time. Otherwise in 3 months nobody knows what data this file is |
| Download link | Must expire (see `web-service-essentials`) |
| Format | `.xlsx` for people to read · CSV for machines to read |


## reference: thai-accounting-apis.md

# Connecting to Thai SME accounting software through API

Use when our system must push sales or purchase documents into the customer's accounting software, instead of exporting Excel for them to re-key. The rules of `SKILL.md` still apply: validate everything before writing · summary page before confirming · batch id · audit.
Every fact comes from the vendors' documents, opened 2026-10-23. Prices and API fees were rechecked 2026-10-26 (table "Sources"). Prices and terms change often: confirm with the vendor before quoting a customer.
Abbreviations: small and medium enterprises (SME) · Application Programming Interface (API) · User Acceptance Testing (UAT) is the test system · Hash-based Message Authentication Code (HMAC) is a signature made from a secret key · Software Development Kit (SDK).

## 1 · Choose a route

| Route | Use when |
|---|---|
| Send a file using the accounting software's import template (file format of each vendor not yet checked) | Few documents · the customer's package has no API |
| Connect to the API directly (sections 2–3) | Hundreds of documents per month · need status back, such as paid |
| Through a partner app the accounting software certifies (PEAK: menu ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก, i.e. Settings > External application connections) | Online shop that already uses a back-office system → `domain-systems` `references/thai-marketplace-apis.md` |

## 2 · PEAK

| Topic | Information |
|---|---|
| Docs | developers.peakaccount.com (API Integration Guide · file `llms.txt` links every page) · has a Postman collection |
| Package | PEAK PRO Plus (12,000 baht/year) or higher · PEAK PRO Plus price per the developers page on 2026-10-26 · API fee is paid before go-live under the agreed package terms; the docs state no amount (`รอยืนยัน`, pending confirmation · per the go-live document, confirm the API fee, the number of items, and the trial terms with the PEAK team before putting them in a quotation) |
| Get access | Fill in the form, the team replies within 3 working days · you get Connect ID + Application Code · UAT and production credentials are separate |
| Authentication | Client Token valid 24 hours (`POST /api/v1/ClientToken`) · User Token per business, the customer creates it in the menu เชื่อมต่อแอปพลิเคชันภายนอก (External application connections) with the Application Code · header `Time-Stamp` (yyyyMMddHHmmss, UTC) · `Time-Signature` = HMAC-SHA1 of the Time-Stamp, with connectId as the key |
| What it can do | contacts · products (has adjust) · services · quotations · invoices · billing notes · receipts · credit notes · purchase orders · expenses · daily journals · receive payment · void · approve · attach files |
| e-Tax | Has an endpoint to send e-Tax Invoice for invoice and receipt · sends e-Receipt |
| UAT | `http://peakengineapidev.azurewebsites.net/api/v1` (http, not https) · free for 3 months · open Mon–Fri 08:00–22:00 |
| Production | `https://api.peakaccount.com/api/v1` · before go-live must pass the Final UAT Review (test case · error case · duplicate case · accounting result) |
| rate limit | ClientToken request 10 times/minute/IP · trial balance report (`GET /api/v1/FinancialReports/trialbalance`) 10 times/minute and 1 concurrent · per User Token: GET 20 concurrent · POST 10 concurrent · file attach 10 concurrent · over the limit → HTTP 429 `RATE_LIMITED` with `retryAfterSeconds` |
| Billed by | Only successful POST Create (invoice · receipt · quotation · billing note · purchase order · expense · daily journal) |
| webhook | Events Create · Edit · Void · PaidPayment · VoidPayment of the main documents (contact · product only Create · Edit) · can set a custom header per endpoint, such as `x-api-key` · the docs say nothing about signatures or redelivery |

## 3 · FlowAccount

| Topic | Information |
|---|---|
| Docs | developers.flowaccount.com · the spec actually in use `https://developers.flowaccount.com/swagger.yml` (OpenAPI 3.0.2 · 130 paths) · SDKs in several languages at github.com/flowaccount |
| Package | Only Pro Business has Open API (price page 2026-10-26: ฿457/month · ฿5,490/year) · Free · Standard (฿1,990/year) · Pro (฿2,990/year) have no API · the price page lists no separate API fee · import up to 5,000 items/month, beyond that special pricing · the API page says "Pay when you go live" and gives no amount (`รอยืนยัน`, pending confirmation) |
| Get access | Form request-openapi · team replies within 1–2 working days · sandbox usable for 30 days · real credentials are emailed to the business owner within 3 working days after the package is confirmed |
| Authentication | OAuth 2.0 · Client Credentials = 1 client per business · OpenID = partner with 1 client for many businesses (scope `flowaccount-api offline_access` · refresh token about 30 days from the last use) · token at `https://openapi.flowaccount.com/{test or v1}/token` valid 86,400 seconds · sent in header `Authorization: Bearer` |
| base URL | sandbox `https://openapi.flowaccount.com/test` · production `https://openapi.flowaccount.com/v1` |
| What it can do | contacts · products · quotations · billing-notes · tax-invoices · receipts · cash-invoices · purchases · purchases-orders · expenses · withholding-taxes · journal-entries · chart-of-accounts · change status · receive payment · attach files · export PDF · send email |
| Cross-system reference | Field `externalDocumentId` "รหัสเอกสารอ้างอิงจากระบบภายนอก" (document id referenced from an external system) |
| e-Tax · rate limit · webhook | Not found in swagger.yml (searching webhook · etax · rate limit · 429 gave 0 hits) nor on the pages developers.flowaccount.com · flowaccount.com/en/developers on 2026-10-26 (not yet checked with the vendor · contact developer_support@flowaccount.com) |

## 4 · Other vendors

| Software | What was found |
|---|---|
| TRCLOUD | The vendor's API page says it has a RESTful API · create an API Key from the settings menu · has Custom API & Webhook · no public developer docs found, ask the sales team for the manual |
| AccRevo | No public API found · the website has a launch article about AccRevoX × MCP (works with Claude) |
| Express | Searched twice, found no vendor website and no public API |

## 5 · e-Tax Invoice

- Pick one system to issue the tax invoice number · our system and the accounting software must not both issue numbers
- Send into the accounting software as the source document, then let the accounting software issue the e-Tax · PEAK has an endpoint to send e-Tax · FlowAccount not found in the spec, ask the vendor
- Tax invoice rules (section 86/4 · e-Tax Invoice & e-Receipt vs by Email) → `e-commerce:thai-tax` (if installed)

## 6 · Prevent duplicates and reconcile

- Keep a mapping table: our id ↔ the accounting software's id · PEAK recommends keeping External Reference and a mapping to prevent duplicate documents · FlowAccount uses `externalDocumentId` to hold our id
- Neither vendor's docs have an idempotency key → look up the mapping before every POST create (`code-craft`)
- A timeout does not mean failure · pull the list by date range and compare before resending
- On 429 → wait per `retryAfterSeconds` or back off exponentially (1 · 2 · 4 · 8 seconds, as PEAK recommends)
- Reconcile every day: the document count and total of the 2 systems must match → `domain-systems` (`references/agent-payment-integration.md`, section Settlement Reconciliation)
- Log every send to audit: who sent · which document · destination id · result → `web-service-essentials`
- Client Token · client secret · connectId stay outside the code → `web-service-essentials` · PEAK UAT is http, so use test data only

## Sources

| Topic | URL (opened 2026-10-23) |
|---|---|
| PEAK packages · UAT free 3 months · guide | https://www.peakaccount.com/developers · https://developers.peakaccount.com/reference/api-integration-guide |
| PEAK list of all API pages | https://developers.peakaccount.com/llms.txt |
| PEAK token · signature | https://developers.peakaccount.com/reference/peak-api-client-token-guide.md |
| PEAK rate limit · billing count · go-live | https://developers.peakaccount.com/reference/copy-of-api-rate-limiting-concurrency-control.md · .../peak-api-transaction-counting.md · .../peak-api-implementation-go-live-guide.md |
| PEAK webhook · API access rights | https://developers.peakaccount.com/reference/webhook.md · .../api-access-rights.md |
| PEAK help center (packages · User Token) | https://intercom.help/peak/en/articles/13176287 · https://intercom.help/peak/en/articles/10078711 |
| FlowAccount API page · price (rechecked 2026-10-26) | https://flowaccount.com/en/developers · https://flowaccount.com/en/pricing |
| FlowAccount connection · token | https://developers.flowaccount.com/tutorial/connect-open-api · .../tutorial/connect/client-credentials-flow · .../tutorial/connect/open-id-flow |
| FlowAccount spec · SDK | https://developers.flowaccount.com/swagger.yml · https://github.com/flowaccount/open-api (README says swagger.yml is the spec in actual use) |
| TRCLOUD · AccRevo | https://www.trcloud.co/api.php · https://www.accrevo.com/ |


---

# skill: errors-and-logs

Use when code can fail, needs retry or timeout, or writes logs

# errors-and-logs — handle failures on purpose and write logs people can read

> **One rule:** catch an error only when you can really do something about it, and log each failure once, at the outermost layer.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Code calls a network, database, file or another system; "should I retry?"; "the user sees a blank error" | [`references/error-handling-patterns.md`](references/error-handling-patterns.md) |
| Writing or reviewing log lines, log levels, log files, "nothing in the log" | [`references/logging-standards.md`](references/logging-standards.md) |
| Code for a specific stack (.NET, Angular, Node, Python) | [`references/per-stack.md`](references/per-stack.md) |

## Steps every part shares

1. **Decide where the error is handled.** Inner layers (DB, HTTP, files) let it pass or turn it into a domain error. Business logic catches only where a real fallback exists. The outermost layer (controller, handler, main) catches everything, logs once, and returns an answer the user understands.
2. **Sort the failure before you act.** A user mistake, a transient failure, a rate limit, a permanent failure, or our own bug. Only a transient failure or a rate limit may retry, and only after the time the server asks for.
3. **Give every outside call a timeout.** Most libraries wait forever by default. The total retry time must be shorter than the caller's own timeout.
4. **Write the log line in the shared format.** Time with timezone, level 5 characters wide, an 8-character correlation id, the source module, one sentence, then `key=value` context. Read `references/logging-standards.md` section 1 for the full layout.
5. **Show the user a message they can act on, and log the detail.** Never send a stack trace or SQL text to the user.

## Check before done

- **Never log** passwords, tokens or API keys, cookies or Authorization headers, OTP or PIN, card numbers or CVV, national ID numbers, health data, or full payloads that hold personal data. Check that a test log with `password` and `token` prints `***`.
- Never write an empty `catch`, and never `return null` in place of an error. If you really swallow an error, write the reason in a comment next to it.
- A write that retries carries an idempotency key, or a customer may be charged twice.
- A person waiting on a screen gets at most 1 automatic retry, then a retry button they press themselves.
- Each outside dependency has at least one failure-path test (timeout, 5xx, bad payload).

## References

- [`references/sources.md`](references/sources.md) and [`references/error-handling-patterns.md`](references/error-handling-patterns.md) — error patterns and where the ideas came from
- [`assets/logger.node.js`](assets/logger.node.js) and [`assets/logger_py.py`](assets/logger_py.py) — tested logger starters with password masking
- Retry numbers for background jobs live in `async-messaging`; alarms and error-rate metrics live in `incidents-and-monitoring`


## reference: error-handling-patterns.md

<!-- merged from skill `error-handling-patterns` on 2026-11-27 · description was: Use when writing code that can fail, with retry and timeout -->
# Error handling

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill, or use it alongside](#when-to-use-another-skill-or-use-it-alongside)
- [1 · Where to catch, where to let it pass](#1--where-to-catch-where-to-let-it-pass)
- [2 · The message to the user ≠ the message in the log](#2--the-message-to-the-user--the-message-in-the-log)
- [3 · Classify before deciding](#3--classify-before-deciding)
- [4 · Timeout and retry](#4--timeout-and-retry)
- [5 · Circuit breaker](#5--circuit-breaker)
- [6 · Partial failure](#6--partial-failure)
- [7 · Check before sending](#7--check-before-sending)
- [References](#references)

> **The one rule:** catch an error only when you **can really do something about it.**
> Catching it and doing nothing is worse than not catching, because the system keeps going while it is already broken inside.

## When to use this skill

- Writing code that calls the network, a database, files, or another team's system
- Deciding whether to retry, how many times, and how long to wait
- The user sees "an error occurred" and does not know what to do next
- Tracing a problem and finding nothing in the log because someone caught and discarded the error

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| The JSON shape of errors the API sends out | `web-service-essentials` · `api-design` | instead |
| Log line format and data masking | `logging-standards.md` | instead |
| Fixing one specific bug someone reported | `fix-at-source/targeted-fix` | instead |
| Steps when the system is really down | `incidents-and-monitoring` | instead |
| Error-rate metrics and alerts | `incidents-and-monitoring` | alongside |
| Where a failed background job goes next | `async-messaging` | alongside |
| Error messages that must be translated into several languages | `i18n-and-locale` | alongside |
| Tests for failure cases | `test-automation` | alongside |

---

## 1 · Where to catch, where to let it pass

| Layer | What to do |
|---|---|
| Innermost layer (calls DB, HTTP, files) | **let it pass**, or convert it into a domain error that has meaning |
| Business logic layer | catch only where there is a real fallback (a default value, a backup data source) |
| **Outermost layer** (controller, handler, main) | **catch everything** · log once · convert to an answer the user understands |

> **Log in one place only, the outermost layer.** If every layer catches, logs, and rethrows,
> 1 error becomes 10 log lines and nobody knows they are the same event.

**3 things you must never do:**

```csharp
try { ... } catch { }                      // wrong: swallowed silently
try { ... } catch (Exception) { return null; }   // wrong: the caller gets null and never learns what happened
catch (Exception ex) { log.Error(ex); throw; }   // wrong: logs again at every layer
```

**If you really mean to swallow it, write the reason:**

```csharp
catch (SmtpException ex)
{
    // swallowed on purpose — a failed notification email should not make the order fail
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · The message to the user ≠ the message in the log

| | The user sees | The log keeps |
|---|---|---|
| Content | what happened · what to do next | stack trace · variable values · request id |
| Language | the user's language | English is fine |
| Internal detail | **none at all** | allowed |
| Link between the 2 sides | **a reference code** | the same code |

```
Wrong: "เกิดข้อผิดพลาด" (An error occurred)   the user cannot tell what to do
Wrong: "SqlException: timeout expired"      leaks internal detail, and they cannot read it anyway
Right: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
       (Save failed because the system was slow. Try again in 1 minute. Reference: 01J9Z8K)
```

**A good message has 3 parts**: what happened · why (if you can say) · what to do next.
The reference code is the same correlation id as in `logging-standards.md`.

---

## 3 · Classify before deciding

| Type | Example | What to do | Log level |
|---|---|---|---|
| **User mistake** | incomplete input, wrong format | tell them to fix it · **do not retry** | no log needed |
| **Transient** | timeout · 503 · deadlock · dropped connection | **may retry** | warning |
| **Rate limited** | 429 Too Many Requests | may retry **after the time `Retry-After` gives** (if absent, use the formula in §4) · never fire faster than that | warning |
| **Permanent** | 404 · 401 · data fails a condition | do not retry · say so clearly | warning |
| **Our bug** | null reference · cannot convert the type | do not retry · **someone must fix it** | error |
| **Inconsistent data** | totals do not match, an impossible state | stop · **call a person** | error + alert |

> **Retrying an error that no number of tries will cure means firing again at a system that is already down, so it falls harder.**
> Sending `400` or `401` another 100 times gets the same answer.

---

## 4 · Timeout and retry

**Every call that leaves the process needs a timeout** — the default in most libraries is "wait forever"

| Call | A timeout that works in general |
|---|---|
| Ordinary database query | 5–10 seconds |
| Internal HTTP | 3–5 seconds |
| External HTTP | 10–30 seconds |
| Heavy background job | set it from the real work, and it must be possible to cut it off |

**The retry formula** (service-to-service calls · jobs in a queue use the numbers in [`async-messaging`](../../async-messaging/SKILL.md) §4 · when a person sits waiting on the screen → see the last item below):

```
at most 3 tries · exponential delay + jitter
try 1 waits 1 second · try 2 waits 2 · try 3 waits 4  (each ±20% random)
```

- **You need the random part** — otherwise every instance retries at the exact same moment and hits the target system again together
- **The total retry time must be less than the caller's timeout**, or the caller has given up while we are still trying
- **Retrying a write needs an idempotency key**, or the customer is charged twice (see `api-design`)
- **A person sits waiting on the screen** → at most 1 automatic retry, then show a "ลองอีกครั้ง" (try again) button for them to press (do not use the 3 tries of the formula above)

---

## 5 · Circuit breaker

When the target is down, firing more does not help. It only makes us hang along with it.

```
closed (normal) → N failures in a row → open (do not call at all, answer with an error at once)
                → wait X seconds → half-open: let 1 request try → success: back to closed · failure: stay open
```

A default that works: if 5 calls fail in a row within 30 seconds, keep the circuit open for 60 seconds.

**Add one when** — calling an external system that has gone down before · calling across several services · a slow target spreads the slowness to us
**Not needed when** — calling your own database · a job that runs once a day

---

## 6 · Partial failure

Work that handles many items must be able to answer **"8 of 10 succeeded, where did the other 2 go?"**

| Style | Fits |
|---|---|
| All or nothing (transaction) | money · stock · anything that breaks when half done |
| Do what you can, then report the items that failed | data import · notifying many people |

The second style must **return the failed items with a reason for each**, not just say "some items failed".

**Cleanup must always run**, whether or not the main work succeeds: closing files, returning connections, deleting temp files.
Use `finally` / `using` / `with` / `defer` instead of repeating it on every exit path.

---

## 7 · Check before sending

Go through this against the diff every time you touch code that calls outside the process

- [ ] Every `catch` clearly does one of these: handles it and goes on · converts it to an error of its own layer and throws on · lets it pass to the outermost layer to log (section 1) — no `catch` that logs and rethrows
- [ ] Every outside call (HTTP · DB · queue · file) has a deliberate timeout and retries only the transient types in section 3 · a write that retries has an idempotency key (section 4)
- [ ] The message to the user says what to do next · no stack trace or table name goes out (section 2) · the log for the same error has a correlation id and enough data to reproduce it
- [ ] Outcomes the business expects (not found · insufficient balance · duplicate) are return values or types the caller must handle, not exceptions
- [ ] Each outside dependency has at least 1 failure-path test (timeout · 5xx · bad payload), and a test confirms that partial failure follows section 6 and does not fail the whole page
- [ ] None of these 4 kinds of silent failure swallowing:
  - **optional chaining or `?? default`** that lets a missing value pass with nobody knowing (`order?.total ?? 0` turns an order that failed to load into a zero total)
  - **falling back to a mock or sample data outside tests** — the live system shows fake data and looks normal
  - **retries run out, then silence** — after the last try it returns empty or success, throws no error, and tells the caller nothing
  - **a catch that logs and carries on in the UI** — the user sees a normal screen although the data never arrived; show an error state they can see

## References

- [`sources.md`](sources.md) — where the checklist ideas came from


## reference: logging-standards.md

<!-- merged from skill `logging-standards` on 2026-11-27 · description was: Use when writing or reviewing code that logs -->
# Logging Standards

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Line format — the same in every language](#1--line-format--the-same-in-every-language)
- [2 · Log levels — write them to match their meaning](#2--log-levels--write-them-to-match-their-meaning)
- [3 · Correlation id — what makes logs usable](#3--correlation-id--what-makes-logs-usable)
- [4 · Log files](#4--log-files)
- [5 · What must never go into a log](#5--what-must-never-go-into-a-log)
- [6 · Ready-to-use code](#6--ready-to-use-code)
- [7 · Checking the work](#7--checking-the-work)
- [8 · Anti-patterns not covered above](#8--anti-patterns-not-covered-above)
- [9 · Links to other skills](#9--links-to-other-skills)

> **The one rule:** Logs exist for a person to read at 3 a.m. when the system is down, not while writing the code.
> If a line does not help answer "what happened, to whom, and when", do not write it.

## When to use this skill

- Starting any new project (service, API, worker, batch, desktop, frontend)
- Someone asks for "a log file", or asks about log format and levels
- You are chasing a production problem and find that the existing logs are unusable

## When **not** to use it

- You need metrics or tracing (Prometheus, OpenTelemetry). That is a different topic from logs, so use `incidents-and-monitoring`.
- You are building a service health endpoint. Use `web-service-essentials`.

---

## 1 · Line format — the same in every language

```
2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1b2] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 userId=57 ms=134
└───────── time + timezone ─────────┘ └level┘  └ cid ┘ └source┘ └─ message ─┘  └──── context k=v ────┘
```

| Part | Rule |
|---|---|
| time | `YYYY-MM-DD HH:mm:ss.SSS ±HH:MM` — **the timezone is required**, or you cannot compare logs across machines |
| level | Left-aligned, 5 characters wide (`INFO ` `WARN ` `ERROR` `DEBUG` `FATAL`), so the columns line up |
| cid | An 8-character correlation id in square brackets. If there is none, use `[--------]` (also 8 characters, so the columns line up) |
| source | The module or class that writes the log, not the file name |
| message | One sentence, with no variables embedded in the string |
| context | `key=value` separated by spaces. If a value contains a space, wrap it in `"` |

**Why not JSON:** This file is mainly for people to open and `grep`. This format still works with `grep "\[a3f9c1b2\]"` or `awk`, but the eye reads it at once without any tool.
When you must ship logs to a central system such as Grafana Loki or Elasticsearch, Logstash, Kibana (ELK), add one more JSON sink (the destination logs are sent to). But **do not drop the text file**.

**1 event = 1 line**, except a stack trace, which follows indented by 4 spaces.

---

## 2 · Log levels — write them to match their meaning

| Level | Use when | Example |
|---|---|---|
| `FATAL` | The app is about to die and cannot continue | Cannot connect to the DB at start |
| `ERROR` | This job failed **and someone must look** | Saving an order failed |
| `WARN` | Abnormal, but the system can continue | Retry number 2, disk down to 10% |
| `INFO` | An important business event | Order created, user logged in, job started/finished |
| `DEBUG` | Details for chasing problems — **off in production** | Values computed along the way |
| `TRACE` | Step-by-step detail — turn on only when really chasing | Raw payload |

> Warning: **an `ERROR` that nobody needs to act on is a `WARN`.** If ERROR fires every minute until people stop looking,
> you have just destroyed your own alarm system.

The default is `DEBUG` in dev and `INFO` in production, adjustable with the env var `LOG_LEVEL`. **No new build is needed; just restart (or reload the config).** .NET reads it from `appsettings.json` instead (see `per-stack.md`).

---

## 3 · Correlation id — what makes logs usable

One request uses one id from start to finish, so every line that comes from that request has the same id.

```
Client ──X-Request-Id?── API Gateway ──┬── Service A ──┐
                        (create if none)└── Service B ──┴─→ every line has the same cid
```

- Take it from the header **`X-Request-Id`** only when it matches `^[A-Za-z0-9-]{1,64}$`. If it is missing or does not match, create a new one (`uuid v4`, first 8 characters). For the reason, see `web-service-essentials` item 3.
- **Always return it in the response header**, so the customer can send the id when reporting a problem and we can trace it at once.
- Pass it to the downstream service on every cross-system call.
- Store it with a mechanism that is separate per request: `AsyncLocalStorage` (Node) · `ContextVar` (Python)
  · `IHttpContextAccessor`/`LogContext` (.NET). **Never use a global variable**, because ids mix as soon as several requests run at once.

---

## 4 · Log files

```
logs/
  app-20260831.log        all levels · rotate at midnight · keep 30 days · max 100MB per file
  error-20260831.log      ERROR/FATAL only · keep 90 days
  fatal.log               uncaught exceptions (app died)
```

- Set the folder with the env var `LOG_DIR`. **Never hardcode the path.**
- Compress old files (`.gz`) and **retention is required**. Otherwise the disk fills and the system goes down from its own logs.
- In a container, also log to stdout (besides the file) so `docker logs` works.
- `logs/` must be in `.gitignore`.

---

## 5 · What must never go into a log

Passwords · tokens/API keys · cookies/Authorization headers · OTP/PIN · credit card numbers/CVV ·
**national ID numbers** · health data · full payloads that contain personal data

Helper already provided: the redaction function (which hides secret values) checks **whether the key name contains a forbidden word** (`userPassword`, `pwd`,
`accessToken` are all caught) and replaces the value with `***`. It checks up to 4 levels deep inside an object.

> **Log injection** — A value from a user may contain `\n`. If you let it through, the user can "forge" a fake log line,
> which misleads readers and breaks parsers. So the provided code strips `\r\n\t` from every value and from the main message.

---

## 6 · Ready-to-use code

| File | Stack | Status |
|---|---|---|
| `assets/logger.node.js` | Node/TS — winston + winston-daily-rotate-file | ✓ Run and tested 2026-10-25 (Node 22.23.2 · winston 3.19.0 · winston-daily-rotate-file 5.0.0 · password redaction · correlation id · strips line breaks in the main message and values) |
| `assets/logger_py.py` | Python — stdlib only, nothing to install | ✓ Run and tested 2026-10-25 (Python 3.13.5 · same test set) |
| `per-stack.md` | .NET (Serilog) + Angular | Caution: not yet compiled or tested |

```js
// Node
const { withCorrelation } = require('./logger.node');
const log = withCorrelation(req.id).child({ source: 'orders' });
log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
log.error('บันทึกไม่สำเร็จ', err);          // pass an Error directly; the stack is added for you
```

```python
# Python
from logger_py import setup_logging, get_logger, set_correlation_id
setup_logging(app_name="myapi")             # once, when the app starts
log = get_logger("orders")
log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
log.exception("บันทึกไม่สำเร็จ")             # inside except — the stack is added for you
```

---

## 7 · Checking the work

```bash
# no leftover print/console.log in production code
grep -rnE "console\.(log|error)|Console\.WriteLine|^\s*print\(" src/ --include="*.ts" \
  --include="*.js" --include="*.cs" --include="*.py" | grep -v test | head -30

# the output logs are readable and greppable
tail -n 50 logs/app-*.log
grep "a3f9c1b2" logs/app-*.log          # does one request show every line?
```

- [ ] Every line has all of: time+timezone · level · cid · source
- [ ] `grep` with one cid shows the story of that request from start to finish
- [ ] No secrets leak: log an object with `password` and `token`, and you must see `***`
- [ ] Feeding in a value that contains `\n` produces no fake line
- [ ] With `LOG_LEVEL=INFO`, DEBUG really disappears
- [ ] Files rotate daily and have retention (left for 1 month, the disk must not fill)
- [ ] `logs/` is in `.gitignore`
- [ ] The response sends `X-Request-Id` back to the customer

---

## 8 · Anti-patterns not covered above

- **A silent `try { } catch (e) { }`** — log at least 1 line
- **Log, then rethrow** — one problem shows up 3 times in the file. Log at the top layer that really handles the error instead.
- **Logging inside a loop that runs thousands of times** — log one summary when the loop ends
- **Logging everything** — the file grows so large you cannot find anything, and it is expensive and slow

---

## 9 · Links to other skills

`test-automation` (tests with full coverage) · `incidents-and-monitoring`


## reference: per-stack.md

# Set up the logger to produce the same format — .NET and Angular

> Warning: the code in this file is **not yet compiled or tested** (unlike `assets/logger.node.js` and
> `assets/logger_py.py`, which have really been run). It uses the standard setup of each library.
> At the first build, compare the output lines with the format in `logging-standards.md` item 1.

---

## Contents

1. [.NET / C# — Serilog](#net--c--serilog)
2. [Angular / frontend](#angular--frontend)
3. [Comparison table](#comparison-table)

---

## .NET / C# — Serilog

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

`appsettings.json` — keeps the settings outside the code, so you can change the log level without a new build:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
      }
    }
  }
}
```

`Program.cs`:

```csharp
using Serilog;
using Serilog.Events;

const string LineTemplate =
    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}  {Level:u5}  " +
    "[{CorrelationId}] {SourceContext}  {Message:lj}  {Context:l}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("CorrelationId", "--------") // default when there is no request (8 characters)
    .Enrich.WithProperty("Context", "")              // empty when there is no context k=v
    .WriteTo.Console(outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "app-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 100 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "error-.log"),
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90,
        outputTemplate: LineTemplate)
    .CreateLogger();

builder.Host.UseSerilog();
```

> `{Level:u5}` means upper case, 5 characters wide, which gives `INFO ` `WARN ` `ERROR` to match the other stacks.
> `{Message:lj}` and `{Context:l}` mean the string is not wrapped in an extra layer of `"`.

### Middleware correlation id

```csharp
using System.Text.RegularExpressions;

public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string Header = "X-Request-Id";
    // accept from the customer only letters, digits, and - up to 36 characters — blocks people stuffing long text or \n into the log
 into the log
    private static readonly Regex Valid = new("^[A-Za-z0-9-]{1,36}$", RegexOptions.Compiled);

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[Header].FirstOrDefault();
        if (cid is null || !Valid.IsMatch(cid))
            cid = Guid.NewGuid().ToString("N")[..8];   // missing or invalid → create a new one

        var logCid = cid.Length > 8 ? cid[..8] : cid;   // the log uses the first 8 characters to fit the cid column (same as Node/Python) — the header returns the full value

        ctx.Response.Headers[Header] = cid;          // return it so the customer can quote it

        // LogContext is tied only to this request's async flow — it does not mix with other requests
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", logCid))
            await next(ctx);
    }
}
```

### Writing logs

```csharp
// Right: fixed message + values go in {Context} as k=v, per the format in `logging-standards.md` item 1
//    Output: ... INFO   [a3f9c1b2] Orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 ms=134
using (Serilog.Context.LogContext.PushProperty("Context", $"orderId={orderId} ms={sw.ElapsedMilliseconds}"))
    _logger.LogInformation("สร้างคำสั่งซื้อสำเร็จ");

// Wrong: a variable embedded in the string — every line becomes a different message and cannot be grouped
_logger.LogInformation($"สร้างคำสั่งซื้อ {orderId} สำเร็จ");
```

### Redacting secrets

Serilog does not redact secrets automatically. The surest way is to **never pass a whole object into the log**.
Pick only the fields you need. If you must pass the whole object, write an `IDestructuringPolicy`
or add `[NotLogged]` through `Destructure.ByTransforming<T>()`.

---

## Angular / frontend

The principle differs from the backend: **a browser cannot write files**, so important logs must be sent up to the backend.

```ts
// core/logger.service.ts
import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private http = inject(HttpClient);
  private buffer: unknown[] = [];

  private write(level: Level, message: string, ctx: Record<string, unknown> = {}) {
    // dev: print to the console for chasing problems — prod: silent, except WARN and above, which go to the server
    if (isDevMode()) console[level === 'ERROR' ? 'error' : 'log'](level, message, ctx);
    if (level === 'DEBUG' || (!isDevMode() && level === 'INFO')) return;   // prod sends only WARN and above

    this.buffer.push({ ts: new Date().toISOString(), level, message, ctx });
    if (this.buffer.length >= 10 || level === 'ERROR') this.flush();
  }

  /** Send in batches, not line by line — otherwise the network tab fills with the log's own requests */
  flush() {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);
    this.http.post('/api/client-logs', { entries: batch }).subscribe({ error: () => {} });
  }

  debug = (m: string, c?: Record<string, unknown>) => this.write('DEBUG', m, c);
  info  = (m: string, c?: Record<string, unknown>) => this.write('INFO', m, c);
  warn  = (m: string, c?: Record<string, unknown>) => this.write('WARN', m, c);
  error = (m: string, c?: Record<string, unknown>) => this.write('ERROR', m, c);
}
```

Catch every uncaught error:

```ts
// core/global-error.handler.ts
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private log = inject(LoggerService);
  handleError(err: unknown) {
    const e = err as Error;
    this.log.error(e?.message ?? 'unknown error', { stack: e?.stack?.slice(0, 2000) });
    if (isDevMode()) console.error(err);
  }
}
// app.config.ts → providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```

Send a correlation id with every request so client-side and server-side logs connect:

```ts
// core/correlation.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const correlationInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID().slice(0, 8) } }));
```

**On the backend** you need an endpoint `POST /api/client-logs` that:
- Limits the body size and applies a rate limit. Otherwise it becomes a hole for people to flood you with logs.
- Writes to a separate file `logs/client-YYYYMMDD.log`
- **Treats the content as untrusted data**, so strip `\r\n` from every value just like a normal log

---

## Comparison table

| Topic | .NET | Node | Python | Angular |
|---|---|---|---|---|
| Library | Serilog | winston | stdlib `logging` | Hand-written (thin) |
| File rotation | `rollingInterval: Day` | `winston-daily-rotate-file` | `TimedRotatingFileHandler` | — (sent to the backend) |
| correlation | `LogContext.PushProperty` | `AsyncLocalStorage` + `child()` | `ContextVar` | header `X-Request-Id` |
| Level | `LogEventLevel` | `level` | `setLevel` | Its own enum |
| External configuration | `appsettings.json` | env `LOG_LEVEL` | env `LOG_LEVEL` | `isDevMode()` |


## reference: sources.md

# Sources · error-handling-patterns

- Section 7 checklist: idea from ECC error-handling.
- The 4 silent-failure kinds in section 7: adapted from silent-failure-hunter in pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10.
