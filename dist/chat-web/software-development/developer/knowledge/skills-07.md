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
| Receiving general file uploads (images, documents) | `file-upload-and-storage` | Instead |
| Building a nicely formatted Excel file | `anthropic-skills:xlsx` | Instead |
| Queue mechanics and progress | `background-jobs` | Instead |
| Buddhist Era (B.E.) years and Thai sorting order | `i18n-and-locale` | Instead |
| Sending documents into Thai accounting software (PEAK · FlowAccount) through an API instead of a file | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | Instead |
| Recording who imported or exported what | `audit-trail` | Together |
| Masking personal data in export files | `pdpa-compliance` | Together |
| Telling the user when an import finishes | `notifications` | Together |
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
- **Every import must be recorded in the audit log**: who imported, which file, how many rows affected (see `audit-trail`)
- **Keep the original file**, so when there is a problem you can look back at what the submitted file really looked like
- Make it reversible: store a batch id (the id of the import run) on every imported row

**Large files run as background jobs.** Above roughly 1,000 rows, put them in a queue,
split into batches of 500 rows, show progress, and allow cancel (see `background-jobs`).

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
| Download link | Must expire (see `file-upload-and-storage`) |
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
| Through a partner app the accounting software certifies (PEAK: menu ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก, i.e. Settings > External application connections) | Online shop that already uses a back-office system → `ecommerce-patterns` `references/thai-marketplace-apis.md` |

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
- Tax invoice rules (section 86/4 · e-Tax Invoice & e-Receipt vs by Email) → `e-commerce:e-tax-invoice` (if installed)

## 6 · Prevent duplicates and reconcile

- Keep a mapping table: our id ↔ the accounting software's id · PEAK recommends keeping External Reference and a mapping to prevent duplicate documents · FlowAccount uses `externalDocumentId` to hold our id
- Neither vendor's docs have an idempotency key → look up the mapping before every POST create (`principle-safe-to-rerun`)
- A timeout does not mean failure · pull the list by date range and compare before resending
- On 429 → wait per `retryAfterSeconds` or back off exponentially (1 · 2 · 4 · 8 seconds, as PEAK recommends)
- Reconcile every day: the document count and total of the 2 systems must match → `fintech-payments` (`references/agent-payment-integration.md`, section Settlement Reconciliation)
- Log every send to audit: who sent · which document · destination id · result → `audit-trail`
- Client Token · client secret · connectId stay outside the code → `config-and-secrets` · PEAK UAT is http, so use test data only

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

# skill: observability-basics

Use when a live system needs metrics, logs or alerts

# Measuring and monitoring a system

> **The one rule:** if a customer is the one who tells us the system is down, monitoring has failed.
> It does not mean the customer is kind.

## When to use this skill

- The system has real users
- Someone asks "is the system healthy right now?" and you must open the logs to answer
- You get woken in the middle of the night by an alert that needs no action
- The system is slow and you do not know where

## When **not** to use it

| Job | Use this instead |
|---|---|
| Log line format and masking | `logging-standards` |
| A trail of who did what | `audit-trail` |
| Health check endpoint | `web-service-essentials` |
| Steps during an incident | `incident-runbook-template` |
| Post-incident summary | `postmortem-template` |

---

## 1 · These three answer different questions

| | Answers the question | Example | Cost |
|---|---|---|---|
| **metric** | "Is it bad now? Getting better or worse?" | error 2.3% · p95 = 840 ms | Cheapest, keeps a long time |
| **log** | "What happened in that request?" | message + stack trace + id | Medium cost |
| **trace** | "Which step is slow?" | one request across 5 services | Most expensive, sample it |

**Order of use during an incident:** the metric says there **is a problem** → the trace says **where** → the log says **why**.
All 3 must be linked by the same correlation id (see `logging-standards`).

---

## 2 · The four signals to measure

| Signal | Measures | Numbers to watch |
|---|---|---|
| **Request rate** | How much work is coming in | Per second, split by endpoint |
| **Error rate** | What percentage fails | Split 4xx (user's fault) from 5xx (our fault) |
| **Response time** | How slow | **p50 · p95 · p99** |
| **Resources** | Is anything near full | CPU · memory · disk space · connection pool |

> **Never look at the average response time.** An average of 200 ms sounds good
> while 5% of users wait 9 seconds. The average always hides the people who hit the problem. **Look at p95 and p99.**

**For queues and background jobs**, add 3 more: jobs waiting in the queue · wait time in the queue · jobs that failed for good
(see `background-jobs`).

---

## 3 · Naming metrics

```
<domain>_<what is measured>_<unit>

http_requests_total              cumulative count
http_request_duration_seconds    duration
orders_created_total             business event
queue_depth_jobs                 value at this moment
```

| Rule | Reason |
|---|---|
| Always end with the unit | `_seconds`, not `_time`, which nobody can tell is seconds or milliseconds |
| End cumulative values with `_total` | It says the value keeps rising and is not the current value |
| Use labels instead of making new names | `http_requests_total{route,status}`, not a separate name per endpoint |
| **A label must not take unbounded values** | If you put a user id or order id in a label, the metrics system cannot cope |

### 3.1 · If you use Prometheus and Grafana

- **Metric types:** a counter counts events (read it with `rate()`) · a gauge holds the value right now · a histogram holds durations when you need p95 · a summary is for when you do not need to aggregate across instances
- **Units:** seconds · bytes · ratio 0 to 1 (`_seconds`, not `_milliseconds`)
- p95: `histogram_quantile(0.95, sum by (le) (rate(<name>_bucket[5m])))`
- Every alert rule has `for:` · `severity` · a runbook link · alert on symptoms (latency · error), not on CPU or GPU
- Keep dashboards as JSON in git and provision them from files · RED per service · USE per resource
- Details on PromQL · alert rule examples · provisioning · a voice agent example (STT · LLM · TTS latency · Kafka lag · GPU): `references/prometheus-grafana.md`

---

## 4 · Alerts

> **Every alert must give the receiver something to do.** If the person reads it and has nothing to do,
> in 3 weeks they will mute alerts, and the day a real one fires nobody will see it.

**Alert on what users feel, not on machine numbers**

| ✗ Alert like this | ✓ Alert like this |
|---|---|
| CPU over 80% | Error rate over 2% for 5 minutes |
| Memory over 70% | p95 of the payment page over 3 seconds for 10 minutes |
| pod restart | Successful orders drop by more than 50% against last week |
| disk 60% | **disk will be full in 4 hours at the current rate** |

| Level | Example | Send to |
|---|---|---|
| **Wake a person** | Users cannot use the system · data is being damaged | Phone call · push |
| **Check in work hours** | disk will be full in 3 days · errors rising but still low | Team chat |
| **Just record it** | Everything else | Dashboard |

**Every alert must have:** what broke · who is affected · **a link to the runbook** · a link to the dashboard.
**Always set a duration (for N minutes)**, not an alert the moment a value spikes once.

### 4.1 · Error budget and burn rate

A system with an SLO uses this instead of a fixed error % threshold, because it says "if this goes on, when will the whole month's budget run out?"

- **Budget** = the time you may fail in 30 days → SLO 99.9% = 43 minutes · 99.5% = 3.6 hours · 99% = 7.2 hours
- **Burn rate** = current error rate ÷ (1 − SLO) → burn 1 = the budget runs out exactly on day 30 · burn 10 = gone in 3 days
- Set 3 alert levels as in the table, and every level must hold true over both the long window and the short window (short window = 1/12 of the long one), so the alert stops as soon as the system recovers

| Level | burn rate | Long window · short window | Budget already used | SLO 99.9% means errors above | Send to |
|---|---|---|---|---|---|
| Fast burn | 14.4 | 1 hour · 5 minutes | 2% of the month in 1 hour | 1.44% | Wake a person |
| Slow burn | 6 | 6 hours · 30 minutes | 5% of the month in 6 hours | 0.6% | Wake a person |
| Slow leak | 1 | 3 days · 6 hours | 10% of the month in 3 days | 0.1% | Team chat |

Show the remaining budget on the overview dashboard. When the budget is nearly gone, stop shipping features and fix stability first. Agree this rule with the product owner in advance, not in the middle of an argument.

---

## 5 · Dashboards

Two pages are enough.

| Page | Answers the question | Contains |
|---|---|---|
| **Overview** | "Is it normal now?" | The 4 signals for the whole system · dependency status · latest releases |
| **Deep dive per service** | "Where did it break?" | The 4 signals split by endpoint · queues · database |

- **A vertical line marks the deploy time.** Most problems start after this line, and you see it in one second
- The overview page must be readable in 10 seconds, so keep it to 6 graphs at most
- Draw the alert threshold lines on the graphs, so you can see how far the value is from the line

---

## 6 · Business metrics

Technical metrics all green while the business has stalled really happens, and you will not catch it unless you measure it.

| Example | What it catches |
|---|---|
| Successful orders per hour | The pay button is broken even though every endpoint returns 200 |
| Successful login rate | A problem with an external identity provider |
| Background jobs waiting more than N minutes | The queue is stuck but the API still answers normally |
| Emails that failed to send | Customers do not get receipts, with no error anywhere |

**Pick 3–5 that are the heart of the business**, and alert when they drop abnormally against the same period last week.

---

## References

- [`references/prometheus-grafana.md`](references/prometheus-grafana.md) — open for PromQL · alert rules · Grafana provisioning · voice agent example
- `mcp-server` item 1.1 — when an agent must read Prometheus or Grafana through MCP
- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: prometheus-grafana.md

# Prometheus and Grafana — using them correctly

Part of `observability-basics` · the thinking about what to measure and what to alert on is in `SKILL.md` sections 2 · 4 · 5 · this file says how to do it in Prometheus and Grafana · metric names and numbers labelled `ตัวอย่าง` (example) are hypothetical data and must be adjusted to the real system

## Contents

- [1 · The 4 metric types](#1--the-4-metric-types)
- [2 · Names and units](#2--names-and-units)
- [3 · Labels and cardinality](#3--labels-and-cardinality)
- [4 · Common PromQL](#4--common-promql)
- [5 · Alert rules](#5--alert-rules)
- [6 · Grafana](#6--grafana)
- [7 · Voice agent system example](#7--voice-agent-system-example)
- [8 · Check before sending](#8--check-before-sending)
- [9 · Sources](#9--sources)

## 1 · The 4 metric types

| Type | What it is | Use when | Example |
|---|---|---|---|
| counter | A cumulative value that only goes up and returns to 0 when the process restarts | Counting events that have happened (requests · errors · finished jobs) · read with `rate()`, never the raw value | `http_requests_total` |
| gauge | The value at that moment, can go up and down | Things that are pending or measurable right now (calls in progress · queue length · memory) | `voice_calls_active` |
| histogram | Counts measured values into ranges (buckets), with a sum and a count | Durations or sizes where you need p95 · p99 and want to aggregate across many instances | `http_request_duration_seconds` |
| summary | Computes quantiles on the app side, over a sliding time window | Use only when you do not need to aggregate across instances · the quantiles and window are chosen when writing the code and cannot be changed later | Rare; normally choose histogram |

- Never average quantiles from a summary across several instances; the result has no statistical meaning (the Prometheus docs use this wording)
- **How to choose** (prometheus.io/docs/practices/histograms/ checked 2026-10-27): if the library and Prometheus you use support it, use a native histogram first, because you can change the percentile and time window later in PromQL · if not supported but you need to aggregate across instances, use a classic histogram · use a summary only when you do not need to aggregate across instances
- The Prometheus docs recommend native histograms first, but the libraries that support them are still limited; if your library does not support them, use a classic histogram and place buckets so that an edge sits at the SLO value, otherwise the estimated p95 will be off (example in the docs: true p95 about 320 ms is estimated as 443 ms because the bucket is wide from 300 to 450 ms)

## 2 · Names and units

| Rule | Right | Wrong |
|---|---|---|
| Start with one word that names the system | `voice_stage_duration_seconds` | `stage_duration` |
| Use base units: seconds · bytes · ratio 0 to 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| The unit goes at the end, in plural form | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| A counter ends in `_total` (if it has a unit, the unit comes first) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 name, 1 unit, 1 meaning | All in seconds | Half in seconds, half in milliseconds |
| Do not put a label name again in the metric name | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · Labels and cardinality

Every unique set of label values is 1 new time series. The Prometheus docs warn you to avoid labels whose values are unbounded, such as user id or email.

| Must not be a label | Use instead |
|---|---|
| `user_id` · `customer_id` · phone number · email | Leave it out · keep it in logs or traces · if you must count per person, use a database, not a metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | Logs and traces tied to the same id (`logging-standards`) |
| A full URL that has an id or query string | A route template such as `/orders/{id}` |
| An error message with variable values | A limited set of error codes such as `reason="timeout"` |

- A label you may use must have all its possible values countable in advance (stage = 3 values · status = 5 groups) · the number of series of one metric is close to the product of the number of values in each label · a histogram multiplies by the number of buckets on top
- To find which metric makes series explode: open the TSDB status page in the Prometheus UI · the `tsdb_stats` tool of `prometheus-mcp` gives similar information (see `mcp-server` step 1.1)

## 4 · Common PromQL

| Need | Query | Note |
|---|---|---|
| Requests per second | `sum by (route) (rate(http_requests_total[5m]))` | The `[5m]` range should be several times the scrape interval (number not yet checked against the docs) |
| Error rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | Count 5xx (our fault) apart from 4xx · with no traffic the quotient is NaN and the alert rule will not fire, which can hide a system receiving no requests at all; add a separate rule that alerts on no requests |
| p95 of latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | Keep `le` in `sum by` · to split by route, add `route` to `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | Use when the library and Prometheus support it |
| Average latency (for context only, never for deciding) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | See `SKILL.md` section 2 |
| Disk will be full in 4 hours | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | An example of saturation that warns ahead of time (not yet checked against the PromQL docs) |

## 5 · Alert rules

Principle from the Prometheus docs: alert on symptoms users feel (latency · errors) at the highest point in the stack you can · wake someone for latency at a single point of the stack · put causes (CPU · GPU · consumer lag) on the dashboard for tracing, and do not wake anyone for them · except for things a person must act on before the system goes down, such as capacity

Exception: a number users feel directly counts as a symptom even if it comes from an underlying system, such as Kafka consumer lag that makes callers wait for an answer (section 7); it may wake someone · lag that affects nobody right away, such as a report job after the call ends, is a cause; put it on the dashboard or the team chat

Every rule must have 4 things

| Item | Where | Reason |
|---|---|---|
| `for:` | In the rule | Do not alert the moment the value spikes once · if omitted, the rule fires from the first evaluation round |
| Severity level | Label `severity` (the name and values are a convention the team sets, not required by Prometheus) | Lets Alertmanager route it to the right place · use 3 levels per `SKILL.md` section 4: wake someone · look during work hours · log it |
| Runbook link | Annotation `runbook_url` (the key name is a convention; the docs say only that an annotation can hold a runbook link) | The responder starts from a procedure, not from zero at 3 a.m. |
| `summary` stating the symptom and who is affected | Annotation | Reading it on a phone tells you what to do |

Example (hypothetical thresholds; set them from the real SLO):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` stops alerts from flapping when the value hovers around the threshold · for burn rate alerts see `SKILL.md` section 4.1

## 6 · Grafana

| Topic | How |
|---|---|
| 1 dashboard per 1 service | A service that takes requests uses RED: Rate · Errors · Duration · resources (CPU · GPU · disk · connection pool) use USE: Utilization · Saturation · Errors · the Grafana docs say RED stands for the user experience, so set alerts from RED and use USE to trace causes |
| Keep it as code | Dashboard JSON lives in git · the Grafana docs treat not keeping JSON in version control as a sign the system is not yet in order · when many dashboards look alike, generate them with grafonnet (Jsonnet) or grafanalib (Python) |
| Load automatically | A provider YAML file in `provisioning/dashboards/` points `options.path` to the JSON folder |
| Stop edits in the browser from being lost | Set `allowUiUpdates: false` · whoever wants a change edits the JSON in git and opens a PR · loading from files always overwrites the version in the database |
| Do not copy a dashboard | Use template variables (choose service · environment) on a parent dashboard · the Grafana docs warn that copying means you do not get fixes from the original |
| Temporary dashboards | Name them starting with `TEST:` and delete when done |
| uid | Set a fixed `uid` in the JSON so links from alerts do not break · `uid` and `title` must be unique within the same folder |

Example provider (checked against the Grafana docs 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · Voice agent system example

All metric names in this section are set by the team (examples), except `DCGM_FI_DEV_GPU_UTIL` and `kafka_consumergroup_lag*`, which come from exporters

**Latency of each stage of a call** · 1 histogram split by stage with a `stage` label that has limited values

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- Place buckets densely in the range 0.1 to 3 seconds, for example `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5`, with an edge at the threshold you set (1.5 seconds in the example of section 5)
- p95 per stage: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · put it in one chart with 3 lines and you see at once which stage eats the time
- Alert on `voice_turn_duration_seconds` (the symptom callers feel); do not alert on every stage · stages are for tracing causes
- Never put `call_id` or the caller's phone number as a label · the call id goes to logs and traces

**Kafka consumer lag** · when the pipeline sends call events through Kafka

- The lag value comes from a Kafka exporter · `kafka_exporter` (danielqsj · Apache-2.0 · not an official Apache project · checked 2026-10-27) gives `kafka_consumergroup_lag{consumergroup,topic,partition}` and `kafka_consumergroup_lag_sum{consumergroup,topic}` · if you use another exporter, the names may differ
- Wake someone when the lag of a consumer that makes callers wait (such as the real-time call summarizer) is high and does not fall for a long time · example `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` with `for: 10m` (hypothetical threshold) · lag of a report job after the call ends is fine to send to the team chat
- The `partition` label is only for drill-down charts; do not put it in alert rules

**GPU utilization** · the exporter is NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` is a gauge in % (checked from `etc/default-counters.csv` of the repo 2026-10-27) · this name was set by the exporter and does not follow the rules of section 2; use it as it is
- GPU is a cause (USE), not a symptom · put it on the dashboard next to the latency of the stages that use the GPU (STT · TTS) · high utilization together with a high p95 of that stage means the machine is saturated and you must add machines or reduce load
- GPU that stays high for many hours alerts at the look-during-work-hours level; it does not wake anyone

## 8 · Check before sending

- [ ] Every metric has a unit and `_total` per the rules · no label with unbounded values (user · phone · call id)
- [ ] Latency is a histogram with a bucket edge at the SLO threshold · no decisions from averages
- [ ] Every alert has `for:` · `severity` · `runbook_url` · `summary` · alerts on symptoms, not on CPU or GPU
- [ ] Dashboards are JSON in git · provisioned from files · `allowUiUpdates: false`
- [ ] There is a RED dashboard per service and USE per resource

## 9 · Sources

Checked 2026-10-27

| Topic | Source |
|---|---|
| Metric types | prometheus.io/docs/concepts/metric_types/ |
| Names, units, label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| Principle of alerting on symptoms | prometheus.io/docs/practices/alerting/ |
| Rule syntax `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| Dashboard provisioning | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (not official to Kafka) |
| `predict_linear` · `[5m]` range vs scrape interval · NaN behavior when dividing by 0 | General team knowledge (not yet checked against the official PromQL pages) |


## reference: sources.md

# Sources · observability-basics

Source of item 3.1: prometheus.io (metric types · naming · histograms · alerting) and grafana.com (dashboard best practices · provisioning), checked 2026-10-27 · full links are at the end of `references/prometheus-grafana.md`


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

# skill: project-bootstrap

Use when starting a repository or setting up a new machine

# Project bootstrap

> **The one rule:** someone who has never seen this project must be able to run it within **30 minutes**,
> reading only `README.md` and asking nobody.

## When to use this skill

Starting a new repository · a newcomer needs half a day before the project runs · a pull request shows a whole-file diff because formatters disagree · nobody knows where the documents are

Not for: build and deploy pipeline → `cicd-and-release` · per-environment settings and secrets → `config-and-secrets` · choosing an architecture → `architecture-patterns` · test framework → `testing-standards` · naming documents → `document-naming`

---

## 1 · Folder layout

**The root (the folder the user opens) follows `project-doc-set` item 1, layout B.** The root tree, the ecosystem layout and the SuperUser file locations (`.claude/superuser/`) are defined there and only there. Code lives in `<project-name>/`. Its inner layout is:

Inside `<project-name>/` (lowercase project name, words joined by `-`): `README.md` (item 2) · `CHANGELOG.md` · `ARCHITECTURE.md` · `CONTRIBUTING.md` · `LICENSE` (these 3 only when the conditions in `references/readme-skeleton.md` section 2 apply) · `.env.example` (only when the project really reads environment variables · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · secrets · `_to_delete/`) · `src/` (unit tests sit beside the code files · `readable-code` item 7) · `tests/` (integration · e2e only, or stacks whose tools require it, see "Exceptions by stack" below) · `scripts/` (setup · seed · migrate). The annotated tree is in [`references/code-folder.md`](references/code-folder.md). ADRs (architecture decision records) and runbooks live in `docs/` at the root, not in the code folder (`project-doc-set` item 1).

**Code folder name.** Take the project folder name, lowercase it, and turn each run of spaces and punctuation into a single `-`:
`Lumio - Light Meter/` → `lumio-light-meter/`
Run every build, test and run command from inside this folder. In languages that force a package-name format (Dart `name:` in pubspec · Python package), keep naming the package by the language's rules, because this rule governs only the folder name.

**Root rules (the top level of the project folder):**
- Hold only what is in the `project-doc-set` item 1 layout. Exceptions are declared in the project's README. README, CHANGELOG and config files live in the repo. Received `.docx`/`.xlsx` files go in `ref/`. Ones we write go in `docs/`.
- **Temporary files never live at the root.** If a temp file an agent created lands at the root, move it into `_to_delete/` at once.
- If a build leaves a stray folder at the root (such as an empty `build/` or `lib/` after moving the code), a tool cache still remembers the old path. Clear the cache (`flutter clean` · delete `obj/`) and build again.
- Folder and file names in the repo are lowercase with hyphens and no spaces. **The exception is a language with its own convention.** Follow that language.

**Exceptions by stack.** The code folder name, the test folder and the file names follow what the language's tools expect. Do not force `src/`. Test files normally sit beside the code files; use a separate test folder only for stacks whose tools require one (.NET: `tests/` with a separate test `.csproj` · Dart / Flutter: `lib/`, `test/` and `integration_test/` required). The full per-stack table is in [`references/code-folder.md`](references/code-folder.md). When another skill writes `tests/` or `test/`, read it as "the test folder of that stack". Pick one name and use it across the whole repo.

**Layout A** (use only when the user asks · this item owns the layout). Add `<project-name>/docs/` inside the code folder, as plain markdown. The inner layout matches the `docs/` of layout B (`README.md` index · `decisions/ADR-NNNN-<slug>.md` · `runbook-<topic>.md` · `research/`). It has no `.docx` or PNG deliverables. The rest of the root still follows the `project-doc-set` item 1 layout, without a `docs/` at the root.

**`docs/README.md` is an index, not content:**

Template → `assets/starter-files.md` (columns: document · read when · owner · last updated)

---

## 2 · README — broad outline, then survey the project before choosing sections

READMEs differ from job to job. A web app · library · CLI (Command-Line Interface) · mobile app · monorepo · infra or script project needs different sections and commands. So work in 3 layers:

**Layer 1 · Broad outline (fixed).** The README must answer these questions for a newcomer, in the order they need them:
What is this and who uses it → what must be on the machine → install and run → configure → common commands (test) → project structure → architecture → build → deploy → troubleshooting → contributing → contact → license
Drop any question the project has nothing for. The exception is "configure", which must say there are no external settings.

**Layer 2 · Survey before writing (every time).** Record the results in `_to_delete/readme-survey.md` and use them to decide layer 3.
1. **Read the project:** package manifest files (`package.json` · `*.csproj` · `pyproject.toml` · `pubspec.yaml` and so on) · version-pin files · `Dockerfile` / `compose` · CI (Continuous Integration) files · `Makefile` / scripts · `.env.example` · top-level folders → this gives the project type, stack, the commands that really exist and the system's components (`code-orientation` if the code is large).
2. **Search the official documentation for that stack** (`research-with-sources`): install, run, test and build commands, and which files to commit, for the version the project uses. Never put commands from memory or from the fallback table into the README without checking them.
3. **Look at 2–3 READMEs of well-known projects of the same type** (search by project type + stack) to see which extra sections readers in that field expect. For example, a library has code samples and a table of supported versions · a CLI has command options · infra has what to prepare in the cloud account · a mobile app has flavors and how to sign the app.
4. If search is impossible (no internet), use the layer 3 fallback tables and mark each unchecked command `(รอยืนยัน)` (awaiting confirmation).

**Layer 3 · Choose sections and commands.** Arrange the sections from layer 1 plus the extra sections found in step 3. Take commands from steps 1–2. The full table (what each section answers · how long it should be · where to move it when too long) is in [`references/readme-skeleton.md`](references/readme-skeleton.md). It is a fallback and a length guide, not a list that must be complete.

- **The README holds only what a newcomer uses in the first 30 minutes.** Move anything longer to `ARCHITECTURE.md` · `CONTRIBUTING.md` · `docs/runbook-deploy.md` and link back (see the "split into other files" table and the `ARCHITECTURE.md` template in the same file).
- **Fallback tables by language** (Node · .NET · Python · Java · Go · Flutter · Rust · Laravel) → [`references/readme-by-stack.md`](references/readme-by-stack.md). Use them as the starting point for the layer 2 step 2 search. For a stack not in the tables, search the official documentation directly.
- Copy-ready templates (Node · Flutter / Android) → `assets/starter-files.md`. An app with no DB or Docker must still list everything needed on the machine.

> **Every command must have been run on a clean machine.** Most READMEs are wrong because the author
> already has everything on their own machine and cannot see the missing steps.
>
> **1 install command, 1 run command.** If there are 12 steps, write them as `scripts/setup.sh`.

---

## 3 · CHANGELOG

Use the Keep a Changelog 1.1.0 format. Order the headings in each version as follows and drop headings with no items: **เปลี่ยนที่ทำให้ของเดิมพัง** (breaking changes; our own addition, always on top) · เพิ่ม · เปลี่ยน · จะเลิกใช้ · เอาออก · แก้ · ความปลอดภัย. Keep `[ยังไม่ปล่อย]` (unreleased) at the top at all times. Put the newest version first. Write dates as `YYYY-MM-DD`. The full example is in [`references/changelog-examples.md`](references/changelog-examples.md).

**Is a CHANGELOG needed?**

| Situation | CHANGELOG |
|---|---|
| Delivered to a customer, with a UAT (user acceptance testing) round or a version number | Required — the customer and the acceptance reviewer see what this round delivers |
| Others call it (API · library · app with users) | Required — they learn whether they must change anything on their side |
| Prototype · personal script · solo work with no release rounds | Not needed — `git log` is enough · write the reason in the README |

**Write for the people who use the product.** 1 item per line, stating the result the user sees, not a commit list, file names or ticket numbers. Leave out invisible work unless it can be felt. "เปลี่ยนที่ทำให้ของเดิมพัง" is always on top. The full rules and the wrong → right examples are in [`references/changelog-examples.md`](references/changelog-examples.md).
- For version numbers and bump rules, see `cicd-and-release`.

---

## 4 · Formatters and linters — end the style arguments

- `.editorconfig` (indentation · line endings · encoding) for every language · template with `.gitattributes` → `assets/starter-files.md`
- The formatter fixes style on save (Prettier · dotnet format · black/ruff · `dart format`). The linter catches only real mistakes (ESLint · .NET analyzers · ruff · `flutter analyze`).
- Set `end_of_line = lf` and `.gitattributes` `* text=auto eol=lf`. Otherwise a team mixing Windows with other systems gets pull requests that diff the whole file.
- **The formatter decides for people.** Any setting is fine, but the whole team must use the same one.
- Have CI check it too, instead of trusting that everyone set up their machine the same way.
- When turning it on in an old project, format the whole repo in **one commit with nothing else in it**,
  then add that commit to `.git-blame-ignore-revs`.

---

## 5 · Dependencies

- **Always commit the lock file**, and install on CI with a command that follows the lock (`npm ci` · `flutter pub get --enforce-lockfile`). Otherwise each day's build gets a different set.
- Check for vulnerabilities in the pipeline (`cicd-and-release`). Update on a schedule: patch monthly, minor quarterly, not only when something breaks.
- A new dependency needs a reason in the pull request (`lazy-coding`).

**Before adding a library, ask 3 questions:** can the language's standard library do it, is the project still alive, and
does the license allow use in work that is sold (see `prior-art-review`)?

---

## 6 · Checklist when opening a new project

Tick `[x]` only for items you **ran or opened in this round**. For an item not yet built or run, write `[ ]` and say what is pending. For an item that does not apply to this project, write `N/A — <reason>`.

- [ ] `README.md` answers the layer 1 questions the project has content for · sections and commands come from the layer 2 survey results (`_to_delete/readme-survey.md` exists) · commands have been run on a clean machine
- [ ] The root matches the layout in `project-doc-set` item 1 (repo named as the lowercase project name joined by `-` · an ecosystem uses `ecosystem/`) and has no temp files or `.docx` at the root
- [ ] `.env.example` lists every value with comments. If the project reads no environment variables at all (for example an offline mobile app), do not create it, but write "ไม่มีค่าตั้งภายนอก" (no external settings) in the README
- [ ] `.editorconfig` · `.gitattributes` · formatter · linter are set up, and CI checks them
- [ ] `.gitignore` covers `.env` · build folders · `_to_delete/` · Android: `key.properties` · `*.jks` · `*.keystore`
- [ ] `docs/README.md` is an index, with an owner for each document
- [ ] `CHANGELOG.md` has an "ยังไม่ปล่อย" heading waiting
- [ ] At least 1 test runs and passes, to prove the layout works
- [ ] `main` is protected and needs a pull request and CI. A repo with no remote, or a solo repo, may skip this, but must write the reason in the README and run tests and the linter before each commit instead.
- [ ] **Have someone who did not set up the project follow the README, and time them**

---
## References

- [`references/code-folder.md`](references/code-folder.md) — annotated code-folder tree and the per-stack table (Node · .NET · Python · Dart / Flutter); open when choosing code, test and file-name layout
- [`references/readme-skeleton.md`](references/readme-skeleton.md) · [`references/readme-by-stack.md`](references/readme-by-stack.md) — README section table and fallback commands by language; open at layer 3 of item 2
- [`references/changelog-examples.md`](references/changelog-examples.md) — open when writing a CHANGELOG entry
- Temp files → `temp-file-discipline` · commits that can build a CHANGELOG → `commit-message-format` · before adding a dependency → `lazy-coding`, `prior-art-review` · file templates → `assets/starter-files.md`


## reference: changelog-examples.md

# CHANGELOG — examples

Read this when writing a CHANGELOG for the first time or reviewing one. The rules are in `SKILL.md` item 3. The blank template is in `assets/starter-files.md`. The sample below is Thai because the CHANGELOG itself is written for Thai users.

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
### เพิ่ม
- แจ้งเตือนทาง LINE
### จะเลิกใช้
- ส่งออกรายงานเป็น CSV จะเอาออกในรุ่น 2.0 — ใช้ Excel แทน
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### ความปลอดภัย
- ผู้ใช้ที่ถูกปิดบัญชีเปิดลิงก์ใบเสร็จเก่าไม่ได้แล้ว

## [1.1.1] — 2026-09-10 [ถอน]
```

## Headings and version numbers

| Heading (Keep a Changelog) | Use for | Version part to bump (Semantic Versioning) |
|---|---|---|
| เปลี่ยนที่ทำให้ของเดิมพัง (breaking changes; our own addition) | Users or calling systems must change something on their side | MAJOR · in the `0.y.z` range, MINOR is allowed |
| เพิ่ม (Added) | New capability | MINOR |
| เปลี่ยน (Changed) | Existing behavior works differently but does not break | MINOR |
| จะเลิกใช้ (Deprecated) | Still works but will be removed · name the removal version and the replacement | MINOR |
| เอาออก (Removed) | Already removed | MAJOR |
| แก้ (Fixed) | Bugs | PATCH |
| ความปลอดภัย (Security) | Vulnerabilities already closed · do not describe how to attack | PATCH, or by size |

The version-bump column is this skill's own proposal. Semantic Versioning says only this: MAJOR = incompatible with the old version · MINOR = backward-compatible additions or deprecation notices · PATCH = backward-compatible bug fixes.

If a released version must be pulled because of a serious bug or vulnerability, append `[ถอน]` to the version heading (Keep a Changelog uses `[YANKED]`). Do not delete that version. Sources: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning 2.0.0](https://semver.org/) · opened 2026-11-07

Write what the user sees, not a list of commits:

| ✗ | ✓ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## Writing rules (full version)

- Write for the **people who use the product**. Do not paste the commit list.
- 1 item = 1 line. Say what the user gains or sees change, not which file changed.
- Leave out file names, function names and ticket numbers, unless the reader is a developer who calls that API.
- Leave out work the user cannot see, such as code restructuring, new tests or CI fixes. The exception is a speed or stability gain big enough to feel. Then write it as the result ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที").
- Within each heading, put the items that affect users most at the top. Drop any heading that has no items.
- The heading "เปลี่ยนที่ทำให้ของเดิมพัง" must always sit at the **top** of that version. Every deprecation, removal and breaking change must be listed, even a small one.


## reference: code-folder.md

# Code folder layout — full tree

The rules are in `SKILL.md` item 1. The root tree is in `project-doc-set` item 1. ADRs (architecture decision records) and runbooks live in `docs/` at the root, not here.

```
<project-name>/          ← lowercase project name, words joined by `-`
  README.md              ← item 2 · broad outline + survey the project before choosing sections
  CHANGELOG.md           ← what changed in each version
  ARCHITECTURE.md        ← code map · add it when the README tree passes 15 lines or the system has many parts (references/readme-skeleton.md)
  CONTRIBUTING.md        ← add it when the contributing section in the README passes 5 lines
  LICENSE                ← public repo, or the contract requires it
  .env.example           ← every required value (see config-and-secrets) · only when the project really reads environment variables
  .editorconfig          ← item 4
  .gitattributes
  .gitignore             ← build output · secrets · `_to_delete/`
  src/                   ← the real code (or the layout the stack expects, per `SKILL.md` item 1)
  tests/                 ← required in .NET · Flutter (`test/`) · Node and Python keep only integration and e2e here (unit tests sit beside the code files) — the stack table is at the end of this file
  scripts/               ← setup, seed, migrate — scripts a person has to run
```

## Exceptions by stack

**Exceptions by stack.** The code folder name, the test folder and the file names in the repo follow what the language's tools expect.
Do not force `src/`. Test files normally sit beside the code files. Use a separate test folder only for stacks whose tools require one (the cells marked **required**):

| Stack | Code | Tests | File names |
|---|---|---|---|
| Node | `src/` | Unit tests beside the code files (`*.test.ts`) · integration and e2e in `tests/` | `kebab-case` |
| .NET | `src/` | `tests/` **required** (a separate test `.csproj` project) | `PascalCase.cs` |
| Python | `src/<package>/` | Unit tests beside the code files (`test_*.py`) · integration and e2e in `tests/` | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` **required** (same layout as `lib/`) | `snake_case.dart` (lint `file_names`) · `android/` `ios/` stay in the repo |

When another skill writes `tests/` or `test/`, read it as "the test folder of that stack". Pick one name and use it across the whole repo.


## reference: readme-by-stack.md

# README by language — commands, files and extra sections

Use this with [`readme-skeleton.md`](readme-skeleton.md). These tables are a fallback and a starting point for search terms (`SKILL.md` item 2, layer 2). They are not commands you can paste in as is. Take the real commands from the project's files and the official documentation for the version in use. **Run every command on a clean machine before it goes into the README** (`SKILL.md` item 2). A cell marked ※ means the official page was not opened to confirm it in the round it was written (2026-11-07).

## 1 · Versions, main files and per-environment settings

Put these into README section 4 "Prerequisites" and section 6 "Configuration".

| Stack | manifest + lock (commit both) | Pin the runtime version in a file | Per-environment settings |
|---|---|---|---|
| Node / TypeScript | `package.json` + `package-lock.json` or `pnpm-lock.yaml` (one lock type only) | `.nvmrc` (`nvm use`) · `engines` in `package.json` is only a warning until `engine-strict` is on | Vite: `.env` · `.env.[mode]` · `.env.local` · only `VITE_*` reaches the browser · Angular: `src/environments/` + `ng build --configuration <name>` |
| .NET / C# | `.sln` or `.slnx` + `.csproj` · `packages.lock.json` optional ※ | `global.json` → `sdk.version` (full number) + `rollForward` (set `disable` when using a lock file) | `appsettings.json` + `appsettings.{Env}.json` · chosen by `ASPNETCORE_ENVIRONMENT` (web) or `DOTNET_ENVIRONMENT` · unset = Production · dev secrets: `dotnet user-secrets` · `launchSettings.json` is for dev machines only |
| Python | `pyproject.toml` + `uv.lock` · do not commit `.venv` | `.python-version` (`uv python pin`) + `requires-python` | No central standard · `.env` + environment variables, or the framework's settings ※ |
| Java / Kotlin | `pom.xml` or `build.gradle.kts` + `settings.gradle.kts` | Gradle wrapper (commit `gradlew` `gradlew.bat` `gradle/wrapper/*`) · Maven wrapper `mvnw` ※ · Java Development Kit (JDK) version | Spring Boot: `application.yml` + `application-{profile}.yml` · enable with `SPRING_PROFILES_ACTIVE` or `--spring.profiles.active=prod` |
| Go | `go.mod` + `go.sum` | The `go 1.xx` line (minimum) + `toolchain` | No standard · environment variables ※ |
| Flutter / Dart | `pubspec.yaml` + `pubspec.lock` (apps commit the lock · libraries do not) | `environment:` in pubspec ※ · FVM if used (not official) | Flavors: Android `productFlavors` in `android/app/build.gradle.kts` · iOS uses schemes ※ · `--dart-define` ※ |
| Rust | `Cargo.toml` + `Cargo.lock` | `rust-toolchain.toml` (`channel` + `components`) | No standard · environment variables ※ |
| PHP / Laravel | `composer.json` + `composer.lock` | `"php": "^8.x"` in `require` | `.env` (not committed) + `.env.example` · `APP_ENV` selects `.env.[APP_ENV]` · `APP_DEBUG=false` in production |

## 2 · Commands

Put these into README section 5 "Getting started", 7 "Common commands" and 10 "Build and output files".

| Stack | Install | Run | test | lint · format | build / package → output files |
|---|---|---|---|---|---|
| Node / TypeScript | `npm ci` (follows the lock) · `pnpm install --frozen-lockfile` | `npm run dev` ※ | `npm test` ※ | `npm run lint` ※ · Prettier ※ | `npm run build` ※ → `dist/` |
| .NET / C# | `dotnet restore` | `dotnet run` · `dotnet run -lp https` | `dotnet test` ※ | `dotnet format` ※ | `dotnet publish` (net8.0 and later default to Release) → `bin/Release/<tfm>/publish/` · `-r <RID> --self-contained` (Runtime Identifier (RID), for example `linux-x64`) |
| Python | `uv sync` | `uv run <command>` | `uv run pytest` ※ | `ruff check` · `ruff format` | `uv build` ※ → wheel · sdist |
| Java / Kotlin | Fetched at build time | `./mvnw spring-boot:run` · `./gradlew bootRun` ※ | `./mvnw test` · `./gradlew test` ※ | Spotless · Checkstyle · ktlint (no single standard) ※ | `./mvnw package` · `./gradlew build` ※ → a jar, run with `java -jar` |
| Go | `go mod download` ※ | `go run ./cmd/<name>` ※ | `go test ./...` ※ | `gofmt` · `go vet` ※ | `go build ./...` ※ → one binary file |
| Flutter / Dart | `flutter pub get` ※ | `flutter run --flavor <name>` | `flutter test` ※ | `flutter analyze` · `dart format .` ※ | `flutter build appbundle` → `build/app/outputs/bundle/release/app.aab` · `flutter build ipa` ※ |
| Rust | `cargo fetch` ※ | `cargo run` ※ | `cargo test` ※ | `cargo clippy` · `cargo fmt` ※ | `cargo build --release` ※ → `target/release/` |
| PHP / Laravel | `composer install` · `npm ci && npm run build` (assets) ※ | `php artisan serve` ※ | `php artisan test` | Laravel Pint ※ | deploy: `php artisan config:cache` (never run in dev) · `php artisan storage:link` |

## 3 · Extra README sections by language

| Stack | What to add |
|---|---|
| Node / TypeScript | The Node version from `.nvmrc` + tell readers to run `nvm use` · npm or pnpm (never 2 lock types) · a `scripts` table · every `VITE_*` variable, with a warning that the value reaches the browser · Angular: the list of configurations |
| .NET / C# | The Software Development Kit (SDK) version from `global.json` · which project is the startup project · where `ASPNETCORE_ENVIRONMENT` is set · the key names to set through `user-secrets` (no values) · the `dotnet publish` command actually used · the EF Core migration commands |
| Python | The version from `.python-version` · uv, or venv + pip (one way only) · with a src layout, install before testing · where the ruff settings live · the `.env` file that must exist |
| Java / Kotlin | The JDK version · always use `./mvnw` or `./gradlew`, never the locally installed tool · a profile table and how to enable each · the name and location of the jar produced |
| Go | The version from the `go` and `toolchain` lines · what each binary in `cmd/` does · the environment variables read |
| Flutter / Dart | The Flutter and Dart versions · a flavor table (name · applicationId · entry file) · signing: where `key.properties` and the keystore are, and whom to ask (never commit them) · iOS: team and provisioning · the build command per flavor and where the output lands |
| Rust | The toolchain from `rust-toolchain.toml` · the feature flags available · the binaries in `src/bin/` · the Minimum Supported Rust Version (MSRV) if it is a library |
| PHP / Laravel | The PHP version and required extensions · `cp .env.example .env` → `php artisan key:generate` ※ → migrate · build assets · deploy steps (`config:cache` · `storage:link` · queue worker) |

## 4 · Folder layout from official sources

Use this for README section 8 "Project structure". This repo's rules (code folder name · test location) are in `SKILL.md` item 1 and win when they conflict.

| Stack | Layout the tools expect | Source |
|---|---|---|
| Node / TypeScript | npm sets none · follow the framework generator (`src/` · `public/` · `vite.config.ts` or `angular.json`) ※ | — |
| .NET / C# | No official page · most common is `src/<App>/` + `tests/<App>.Tests/` + `global.json` + `.slnx` ※ | — |
| Python | src layout: `src/<package>/` · `pyproject.toml` at the root | [PyPA src vs flat](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) |
| Java / Kotlin | `src/main/java` (or `kotlin`) · `src/main/resources` · `src/test/java` | [Maven Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html) |
| Go | `cmd/<binary>/main.go` · `internal/` · a small package can keep its files at the root · `golang-standards/project-layout` and `pkg/` come from the community, not the Go team | [Organizing a Go module](https://go.dev/doc/modules/layout) |
| Flutter / Dart | `lib/` (`lib/src/` for internals) · `test/` · `android/` · `ios/` ※ | [Dart package layout](https://dart.dev/tools/pub/package-layout) |
| Rust | `src/main.rs` · `src/lib.rs` · `src/bin/` · `tests/` · `examples/` · `benches/` | [Cargo project layout](https://doc.rust-lang.org/cargo/guide/project-layout.html) |
| PHP / Laravel | `app/` · `config/` · `database/` · `public/` · `resources/` · `routes/` · `storage/` · `tests/` | [Laravel 13.x structure](https://laravel.com/docs/13.x/structure) |

## 5 · Sources (opened 2026-11-07)

[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci) · [package.json engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) · [pnpm install](https://pnpm.io/cli/install) · [nvm .nvmrc](https://github.com/nvm-sh/nvm/blob/master/README.md) · [Vite env and mode](https://vite.dev/guide/env-and-mode) · [Angular environments](https://angular.dev/tools/cli/environments) · [global.json](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json) · [ASP.NET Core environments](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments) · [user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) · [dotnet publish](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-publish) · [Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) · [uv project layout](https://docs.astral.sh/uv/concepts/projects/layout/) · [uv Python versions](https://docs.astral.sh/uv/concepts/python-versions/) · [Ruff configuration](https://docs.astral.sh/ruff/configuration/) · [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) · [Spring Boot profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html) · [Spring Boot Maven run](https://docs.spring.io/spring-boot/maven-plugin/run.html) · [Go toolchains](https://go.dev/doc/toolchain) · [Flutter flavors](https://docs.flutter.dev/deployment/flavors) · [Flutter Android release](https://docs.flutter.dev/deployment/android) · [Cargo FAQ](https://doc.rust-lang.org/cargo/faq.html) · [rust-toolchain.toml](https://rust-lang.github.io/rustup/overrides.html) · [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md) · [Laravel configuration](https://laravel.com/docs/12.x/configuration)

Tool versions change fast (Laravel 13.x was already out on the date checked). Before using these tables on a real project, open the official page for the version in use.


## reference: readme-skeleton.md

# README skeleton and companion documents — full version

The rules are in `SKILL.md` item 2 · a copy-ready template is in `assets/starter-files.md` · commands and files for each language are in [`readme-by-stack.md`](readme-by-stack.md)

## 1 · README sections in the order a newcomer needs them

> This table is the fallback and the length criteria for layer 3 in `SKILL.md` item 2 · the real sections of each project come from the layer 2 survey (read the project · official docs · READMEs of projects of the same type) · a section that this type of project needs but that is not in the table may be added.

The order follows what someone who has just arrived needs: what is this → install → run → change code → ship · the "Sources" column is the number of the 5 main sources (item 4) that recommend the section · a row that merges several topics gives a range · "—" means no main source recommends it; it is this skill's own judgment. The section names in the "Section" column are the Thai headings written into the README, so they stay Thai (English gloss in brackets).

| # | Section | Question it answers | Present when | How long · where to move it if longer | Sources |
|:--:|---|---|---|---|:--:|
| 1 | ชื่อ + ทำอะไรให้ใคร (name + what it does for whom) | What is this, who uses it | always | 2–3 lines · first line at most 120 characters | 5 |
| 2 | บรรทัดสถานะ (status line) | Is it still in development, who owns it, where are the docs | always | 1 line: status · owner · link to `docs/README.md` | 2–4 (status 2 · owner 4 · docs link 4) |
| 3 | ภาพหน้าจอหรือตัวอย่างผล (screenshot or sample output) | What does it look like or produce | there is a screen or output to look at | 1 image, or a sample command with its output | 2 (usage example 3) |
| 4 | ต้องมีบนเครื่อง (needed on the machine) | What must be installed first, which version | always | table: tool · version · which file pins the version (`.nvmrc` · `global.json`) | 3 |
| 5 | เริ่มใช้งาน (getting started) | How to install and run | always | commands that can be copied, pasted and run, at most 6 commands · more than that becomes `scripts/setup` | 4 |
| 6 | ตั้งค่า (configuration) | What must be configured, how many environments, how to switch | the project reads values from outside | table: variable name · what it is for · required or not · sample value (no real values) · for a secret give only the name and where to get it · if there is none, write "ไม่มีค่าตั้งภายนอก" (no external config) | 0 · based on Twelve-Factor |
| 7 | คำสั่งที่ใช้บ่อย (common commands) | How to run dev · test · lint · format · build | always | table of 4–8 rows · test must be 1 command | 2 |
| 8 | โครงโปรเจกต์ (project layout) | What is in which folder | always | a one-level tree, at most 15 lines · more → `ARCHITECTURE.md`, code-map section | 1 |
| 9 | สถาปัตยกรรมย่อ (short architecture) | How many parts the system has, how they talk | more than 1 part (web page + API + database · queue · external service) | 3–5 lines + a Mermaid diagram at Context or Container level · full → `ARCHITECTURE.md` | — · based on matklad and C4 |
| 10 | build และไฟล์ที่ได้ (build and output files) | How to make the deliverable, what files come out, where | there is something to build (web · app · binary · package) | build command per target + the path of the output file | 2 (counted together with deploy) |
| 11 | deploy | Where it goes live, who triggers it, through which Continuous Integration (CI), how to roll back | it can be deployed | 3–5 lines · full steps → `docs/runbook-deploy.md` | 2 (counted together with build) |
| 12 | ติดปัญหา (troubleshooting) | Common symptoms and fixes | always | table of symptom · fix · start from what you hit yourself while writing the README | — |
| 13 | ร่วมพัฒนา (contributing) | branch · commit · pull request (PR) · what to check before sending | other people change the code | 3–5 lines · longer → `CONTRIBUTING.md` | 4 |
| 14 | ติดต่อและขอความช่วยเหลือ (contact and help) | Whom to ask when stuck, which channel | always | 1–2 lines | 4 |
| 15 | สัญญาอนุญาต (license) | How far it can be reused | always · the last section | 1 line + the `LICENSE` file · for internal work write "ใช้ภายใน <บริษัท> ห้ามเผยแพร่" (internal use at <company>, do not distribute) | 2 |

**Skeleton rules**
- Cut a section that has nothing in it; do not write "none" · except section 6, which must say there is no external config.
- The README holds only what a newcomer needs in the first 30 minutes · anything longer moves to the file named in column 2, with a link back; do not delete it.
- Longer than 100 lines → put a table of contents under the status line.
- Edit the README in the same commit as the code that changes a command or setting.
- Each language has sections to add (Flutter flavors · .NET `user-secrets`) → [`readme-by-stack.md`](readme-by-stack.md) section 3.

## 2 · What goes into other files

| File | Lives at | Content | Create when |
|---|---|---|---|
| `ARCHITECTURE.md` | `<project-name>/` | a code map for people who change the code (section 3) | the folder tree in the README exceeds 15 lines, or the system has more than 1 part |
| `CHANGELOG.md` | `<project-name>/` | what users see changing in each version | per the table in `SKILL.md` item 3 |
| `CONTRIBUTING.md` | `<project-name>/` | developer machine setup · branch · commit · PR · lint and test before sending | README section 13 is longer than 5 lines |
| `LICENSE` | `<project-name>/` | the full license text | the repo is public, or the contract requires it |
| `SECURITY.md` | `<project-name>/` or `.github/` | how to report a vulnerability · versions still supported | the repo is public, or delivered to a customer who maintains it |
| `CODEOWNERS` | `.github/` | which folder whom must review in a PR | there are several teams or owners |
| `runbook-deploy.md` | `docs/` at the root | build → release → run steps · each environment's setup · rolling back | the deploy steps are longer than 5 lines |
| `decisions/ADR-NNNN-<slug>.md` | `docs/` at the root | decision records (Architecture Decision Record (ADR)), one per decision | a hard-to-reverse decision is made (`adr-writer`) |
| Architecture, delivery edition | `docs/` at the root | an arc42-style architecture document | delivering to a customer or there is an acceptance reviewer (`project-doc-set`) |

The location of `docs/` follows layout B in `project-doc-set` item 1 · GitHub looks for `CONTRIBUTING` and `CODEOWNERS` in `.github/` first, then the repo root, then `docs/` · documents in `docs/` can be split by what the reader needs into 4 kinds (Diátaxis): learning (tutorial) · getting a job done (how-to, e.g. a runbook) · looking up facts (reference, e.g. an API settings table) · understanding the reasons (explanation, e.g. ARCHITECTURE · ADR)

## 3 · ARCHITECTURE.md

**Default: matklad's short form** — the reader is someone who will change the code and wants to know where the thing that does X lives.

```markdown
# สถาปัตยกรรม

## ภาพรวม
<ระบบแก้ปัญหาอะไร รับอะไรเข้า ส่งอะไรออก — 1 ย่อหน้า + รูป Context หรือ Container 1 รูป>

## แผนที่โค้ด
<แต่ละโฟลเดอร์หรือโมดูลหลักทำอะไร คุยกับใคร — ทีละย่อหน้าสั้น ๆ>

## ข้อห้ามที่ต้องรักษา
<กฎที่โค้ดต้องไม่ละเมิด เช่น "ชั้น domain ไม่ import ฐานข้อมูล" · "ทุกการเขียนเงินผ่าน ledger">

## เส้นแบ่งระหว่างชั้น
<ตรงไหนคือ API สาธารณะ ตรงไหนแก้ได้อิสระ>

## เรื่องที่ตัดผ่านทุกส่วน
<log · error · สิทธิ์ · config · การทดสอบ — ทำแบบไหน อยู่ที่ไหน>
```

- Short; include only what rarely changes · you may name a file, module or type, but put no links, because links break when files move; let people search by name instead.
- Do not explain every module in detail · do not chase every commit · review 2–3 times a year.
- Diagrams use only the 2 C4 levels, Context and Container, which c4model.com says are enough for most teams · do not draw the Code level · draw with Mermaid per `software-diagrams`.

**Use arc42 instead when** delivering to a customer or another team who will maintain it · there are quality requirements (speed, security) that must be proven · an acceptance reviewer is needed — choose only the sections that have real content from the 12 sections: goals · constraints · scope and context · solution strategy · building blocks · runtime view · deployment · cross-cutting concepts · decisions (point to ADRs) · quality requirements · risks and technical debt · glossary · this edition lives in `docs/` per `project-doc-set`, not in the code folder.

## 4 · Sources (read 2026-11-07)

The 5 main sources used to count the "Sources" column in item 1:
- [standard-readme spec](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — required sections · license at the end · table of contents when over 100 lines
- [Make a README](https://www.makeareadme.com/) — long is better than short; if too long, move, do not delete
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Google documentation guide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) · [Best practices](https://google.github.io/styleguide/docguide/best_practices.html) — change docs together with code
- [Microsoft Engineering Playbook: Project and Repositories](https://microsoft.github.io/code-with-engineering-playbook/documentation/guidance/project-and-repositories/) — folder layout · compile test build deploy

Supporting sources: [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) · [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) · [arc42](https://arc42.org/overview) · [C4 model diagrams](https://c4model.com/diagrams) · [Diátaxis](https://diataxis.fr/) · [Twelve-Factor: Config](https://12factor.net/config) · [Build, release, run](https://12factor.net/build-release-run)

The section order · the 15-line and 6-command ceilings · the configuration table · the troubleshooting and short-architecture sections are this skill's own judgment, not the sources' words.


---

# skill: docker-sandbox

Use when a project needs a Docker sandbox for untrusted code

# docker-sandbox: one lab per project

> Inside, you can install, delete, run servers, and build test databases freely, because when something breaks you wipe it and rebuild with one command.
> Outside (the real machine · real systems · real accounts) cannot be touched, because there is no way in from the inside.

Do not use when: writing a Dockerfile or image for a real deploy → [`kubernetes-helm`](../kubernetes-helm/SKILL.md), because the lab is a temporary place to run work, not an image that goes to production.

---

## 1 · One project = one lab

- **One lab per project**, named `sandbox-agent-<folder name>-<creation date>` (e.g. `sandbox-agent-sample-app-20260125`).
  - The name is set once at the first `up` and stored in the file `.sandbox/.name-<folder name>`. Later commands read the name from this file, so the name does not change with the date.
  - The creation date is also kept in the label `sqt.created`.
  - If the project needs a database, cache, or browser, add it as a service in the **same lab** (one stack). Do not create a separate lab.
- **The base image is shared across the whole machine.** `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) is built once. Each project's image adds only a thin layer the project needs, so disk is not used twice.
- **A stopped lab uses no CPU or memory**, only disk. Run `stop` when you finish a task, and `stop-all` when you finish for the day.
- **Extra temporary labs** (`-Name <project>-a1`) are for trying several paths in parallel when they need truly separate machines. (For ordinary multi-path trials, use one git worktree per attempt following `parallel-split-and-merge`; it is faster.) `destroy` them as soon as you pick a path.
- **Never put several projects in one lab**, because installed things collide, one project's breakage spreads to another, and you cannot wipe one project at a time.

## 2 · Two modes: choose by the work

| | **mount** (default) | **isolated** (`-Isolated`) |
|---|---|---|
| Project files | The real folder is attached at `/work`; edits show on the machine at once | A copy lives in a volume; the real folder is attached read-only at `/src` |
| Who edits files | Claude Code on the machine edits files as usual (`sandbox.ps1 claude` does not work in this mode) | Claude Code **inside the lab** (`sandbox.ps1 claude`) |
| Who runs commands | Sent into the lab with `sandbox.ps1 exec "..."` | Claude Code in the lab runs them itself, with no permission prompt |
| How results come back | Already in the folder | `sandbox.ps1 sync` → a patch in `_to_delete\sandbox\`, then the person runs `git apply` |
| Use when | Daily work while a person is watching | Overnight work · risky work · trying several paths that need separate machines (one lab per path) |

You can add `-Locked` to either mode. It blocks outbound internet, leaving only the hosts in `allowlist.txt`. It suits work that runs code you do not yet trust.

---

## 3 · Set up the lab for a project (first time)

1. Check that Docker Desktop is running: `docker version` must show both Client and Server. If it does not, tell the user to open Docker Desktop and stop only this task.
2. Copy every file in this skill's `assets/` to `<project>/.sandbox/` (at the root). Then declare `.sandbox/` as a root exception in the README of the code folder, following `project-doc-set` item 1.
3. Adjust the `Dockerfile` (the project layer).
   - For .NET, set `INSTALL_DOTNET=1` and add an `apt-get install` for whatever the project needs.
   - **Do not edit `base.Dockerfile`** unless necessary, because every project shares it.
   - If you need a test database, add it as a new service in `compose.yaml` (do not open a port to the outside).
4. Add `.sandbox/.mode-*` and `.sandbox/.name-*` to `.gitignore`.
5. Start the lab with `.\.sandbox\sandbox.ps1 up` (or `up -Isolated` · `up -Browser`). The first project on a machine must build the base image first, which takes about 5–15 minutes. Later projects are much faster.
6. **Prove it works:** `sandbox.ps1 exec "node -v && python3 --version && git status"`. If the project has a test command, run it once through `exec`. In `-Locked` mode you must see the line `check passed`.
7. Record in the project's `docs/README.md`: the lab name (`sandbox-agent-<folder name>-<date>`) · mode · port · test command in the lab.

If the script breaks on another machine, use the `bug-fix` playbook on the script itself.

**Ports:** `up` finds a free port itself, starting at 3000, and says which port it got.
- Inside the lab it sets the variables `APP_PORT` and `PORT` to that port, and `HOST=0.0.0.0`.
- The app must listen on `HOST`, because if it listens only on `127.0.0.1` inside the lab, the machine cannot reach it.
- On the machine side the port is still opened only on `127.0.0.1`, so you reach it from the machine at `http://127.0.0.1:<port>`.

**A different Playwright version:** the base image has the latest Chromium. If the project pins another Playwright version, run `npx playwright install chromium` in the lab once after `npm ci` (no `--with-deps` needed, because the image already has them).

---

## 4 · Daily use

| Need | Command (run at the project root on the machine) |
|---|---|
| Run a command in the lab (agents use this one) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| Open a shell in the lab | `.\.sandbox\sandbox.ps1 shell` |
| Let Claude Code work fully in the lab (**isolated only**) | `.\.sandbox\sandbox.ps1 claude` (log in once the first time; the volume keeps it · in mount mode the script refuses, because `/work` is the real folder) |
| Bring work out of an isolated lab | `.\.sandbox\sandbox.ps1 sync`, then read the patch before `git apply` |
| All labs on the machine | `.\.sandbox\sandbox.ps1 list` |
| Wipe the lab clean and start over | `reset`, then `up` |
| Stop every lab on the machine and free memory | `.\.sandbox\sandbox.ps1 stop-all` |
| Several labs for one project | Put `-Name <project>-a1` on every command |

**Agent rules when a project has `.sandbox/`**
- Run install · build · test · dev server · migration and any script through `sandbox.ps1 exec`. Never run them on the machine.
- The project's app-checking skill (`app-verifier-setup`) runs Playwright headless in the lab, then copies the images out with `docker compose cp` into `_to_delete/`.
- If the lab is stopped, you may `up` it yourself (reversible). If the lab breaks beyond repair, you may `reset` it yourself, because what is in the lab is not the user's. **Exception:** an isolated lab that has not been `sync`ed must be synced first, then reset.

---

## 5 · Virtual browser for testing

| Type | Use when | How |
|---|---|---|
| Headless in the lab (default) | Automated tests · verify skill · nobody needs to watch | Playwright Chromium already comes with the base image |
| **Visible** (`up -Browser`) | You want to watch the agent click step by step · check the screen by eye · record images | A real browser in a separate container, watched live at `http://127.0.0.1:7900`. Playwright in the lab drives it through `SELENIUM_REMOTE_URL` automatically (Playwright calls this capability experimental) |
| Let Claude Code in the lab control the browser itself | Exploring web pages that have no script yet | Install the Playwright MCP server in the lab (the project's `.mcp.json`) and run it headless |

- The browser in the lab has no accounts, cookies, or user passwords. Log in only with the project's test accounts.
- Copy images and videos from tests out to `_to_delete/` with `docker compose cp`.
- Playwright MCP quirks (root, `--browser`, screenshot paths, click timeouts): [references/playwright-mcp.md](references/playwright-mcp.md).
- The user's own browser on the machine (the logged-in Chrome) is for real websites that need a real account, and follows that tool's rules. It is not a place to test.

## 6 · CAPTCHA

- **Our own system:** a CAPTCHA should not block testing from the start.
  - Use the test site keys the provider publishes, which pass every time. reCAPTCHA · hCaptcha · Cloudflare Turnstile all have them; see the provider's documentation for the values.
  - Or turn it off with a setting for the test environment only (`CAPTCHA_ENABLED=false`).
  - **Test values must never reach the real system.** Add a startup check that production must not use a test key (`config-and-secrets`).
- **Other people's websites:** the agent **does not solve a CAPTCHA and does not look for a way around it** (no solving services, no pretending to be a person). If you meet a CAPTCHA, stop that step, tell the user to do it themselves, and continue with the other parts. If you need data from that site often, look for an official API instead.

## 7 · What you may do freely in the lab

Install programs (`sudo apt-get` · `npm -g` · `pip`) · delete files in the lab · run servers and test databases · download dependencies · commit in the copy in isolated mode · try destroying things and rebuild.

These still stay under "รออนุมัติ" (awaiting approval) even inside the lab (prepare them, do not do them yourself), because the result leaves the lab:
- Sending data, email, or messages, or calling an API that has a real effect on people or outside systems.
- Using real accounts, real secrets, or the real database.
- Pushing to a remote · deploying.
- In mount mode: deleting or overwriting the user's files in `/work` that are not this round's work (it is the real folder).

---

## 8 · Never edit compose to include these

| Never | Because |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | The lab could see and touch the real machine |
| Mounting `/var/run/docker.sock` or `//./pipe/docker_engine` | Controlling Docker = controlling the machine |
| Mounting the machine's home folder · `.ssh` · `.aws` · `.azure` · `.claude` · browser profiles · a whole drive | Secrets can leak the moment code in the lab reads them |
| Opening a port like `"3000:3000"` (every network card) | People on the same network can reach it. Always use `127.0.0.1:` |
| Putting real secrets in the `Dockerfile` or image | The secret stays in the image forever |
| Removing or raising the limits `cpus` `mem_limit` `pids_limit` until the machine hangs | A lab stuck in a loop will eat the whole machine |
| Mounting things from the machine as writable when the lab only needs to read (`ref/` · sample data · a shared SDK cache · the source folder of isolated mode) | Tricked code in the lab can write back to the machine. Add `:ro` to every mount that is not this round's work, and have the lab copy into its own space if it must edit |

The Claude Code documentation warns that even in a container, running without permission prompts (`--dangerously-skip-permissions`) cannot stop project code that deliberately steals what is in the lab, including Claude Code's own token. Use it only with a repo you trust, and use `-Locked` when unsure.

**Limits of `-Locked`:** DNS can go out only through the resolver the lab was given (Docker's), not any DNS server. But that resolver still forwards queries outward, so data can still be smuggled out through DNS (DNS tunnelling). For work where data must never leak, run with no network at all.

---

## 9 · Windows notes

- Docker Desktop uses WSL 2. Files on drive `C:` that are mounted in are slower than files in a volume. If build or test is very slow, use `-Isolated`.
- **Projects in a OneDrive folder:** mount mode makes `node_modules` and build files sync to the cloud, so use `-Isolated` or move the project out of OneDrive.
- If you cannot run `sandbox.ps1`, use `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <command>`.
- `-Locked` reads the host's IP once at startup. A service whose IP changes often may drop out; run `up -Locked` again.

## Links to other skills

- `config-and-secrets`: put test values in a `.env` that stays out of git, and do not bake them into the image.
- The `superuser` playbook `housekeeping`: cleans up old labs and images.

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: playwright-mcp.md

# Playwright MCP in the lab · docker-sandbox

Open from SKILL.md section 5 when you run Playwright MCP inside the lab.

- Playwright MCP in the lab (examples from teaching work, not yet a standard): running as root needs `--no-sandbox` · the `--browser` value must match the `--help` of the installed version (`chromium` or `chrome`; if it does not match, it cannot find the browser) · screenshots with a relative file name land in the process's working directory, not `--output-dir`, so move them yourself · a click that times out with "not visible/stable" may be a background tab; see `e2e-testing-patterns`.


## reference: sources.md

# Sources · docker-sandbox

- Tested for real on Windows + Docker Desktop 4.46 (2026-10-05, project `sample-app`): the lab built · unit tests passed 15/15 · e2e on Chromium passed 14/14 in the lab.
- Bugs found during testing were fixed in the script: PowerShell 5.1 with stderr · Playwright a different version from the base image · port collisions.
- Verified: `npm ci` for just 2 packages took 52 seconds on a OneDrive folder (why `-Isolated` is advised on OneDrive).
- The `:ro` mount rule is an idea from anthropics/claude-code devcontainer and trailofbits/skills.


---

# skill: project-doc-set

Use when choosing a project doc set or open-items Excel

# Project doc set

> **One rule:** every doc must answer **who reads it** and **what they decide after reading**.
> If it cannot answer, do not write it.

---

## When to use this skill

Use it when: opening a new project and deciding which docs it needs · docs are scattered and nobody knows which is the real one · a client asks what will be delivered · about to write a doc but unsure what must come first.

## When **not** to use it

| Situation | Use instead |
|---|---|
| Folder layout of the **code** (including the `docs/` inside code in type A) · README · CHANGELOG · linter | `project-bootstrap` |
| Naming **files** and version numbers of docs | `document-naming` |
| Actually writing one doc | The skill for that doc (table in section 4) |
| Making document pages look good | `branded-document-design` |

---

## 1 · Docs inside or outside the repo

**Decide this first** (moving later means fixing links across the whole project). **The default is type B**, even when the docs are pure markdown. The code lives in `<project-name>/` (lowercase, joined with `-`). Use type A only when the user asks.

- **Type B** (docs outside the repo): use it for every set size (S · M · L). `.docx` / `.xlsx` / mockups / PNGs that the client must see stay out of pull requests. The root layout is below (this section owns the root layout).
- **Type A** (docs inside the repo): only when the user asks and the docs are pure markdown. Docs and code change in the same pull request. The root looks like type B but has no root `docs/`. The `docs/` folder sits inside the code folder, and its inner layout belongs to `project-bootstrap` section 1.
- A type A project that grows deliverable docs moves to type B **as a whole set in one go**. A doc that lives in 2 places means 2 versions.

### Type B layout

```
<project-name>/
├─ ref/                 things received — TOR · meeting notes · screenshots of the old system · client files  **read-only, never edit**
├─ docs/                every doc we write — delivered .docx and technical .md live together
│  ├─ figures/          exported figures — .png only        [exists when delivered docs have figures]
│  │  └─ src/           source files of the figures (.html · .mmd · .drawio)
│  ├─ decisions/        ADR-NNNN-<slug>.md, one decision per file  [optional]
│  ├─ runbook-<topic>.md  guide for when the system has problems, one topic per file  [optional]
│  └─ research/         research on a reference app (`reference-app-research`) [optional]
├─ mockup/              .html that opens and really clicks
├─ qa/                  test cases · test results · bugs/ bug reports
├─ assets/              logos · icons in all sizes · favicon · wordmark (.svg source + exports)
├─ _to_delete/          every kind of temporary item
├─ .claude/            project skills (such as verify) — must sit where Claude Code is opened
│  └─ superuser/        SuperUser working files — CONTEXT.md · HISTORY.md · IMPROVEMENTS.md · log/ · inbox/ · learn/
└─ <project-name>/      code repo, project name lowercase joined with `-` — inner layout belongs to `project-bootstrap`
```

**SuperUser files** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`): the single source is [`superuser/references/team-files.md`](../superuser/references/team-files.md).

**ADRs and runbooks live in the root `docs/`, not in `<project-name>/docs/`.** Type A moves the whole `docs/` into the code folder, with the same inner layout. Paths: `docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<topic>.md`. This section is the only place that defines this.

**Root exceptions:** `.sandbox/` may sit at the root when you use `docker-sandbox` · `AGENTS.md` / `GEMINI.md` under the conditions above. Declare every exception in the README of the code folder.

**Create folders when real content exists, not in advance:** `ref/` when you get files from the client or the old system (never mix them into `docs/`) · `docs/figures/` when a delivered doc has a self-drawn figure (otherwise the figure is stuck inside the `.docx` and cannot be edited) · `docs/decisions/` when a decision needs explaining later · `docs/research/` when the user wants an app like an existing one · `qa/` when test cases exist (test cases always live here; `docs/test-plan.md` holds only the plan) · `assets/` when there is a logo or icon.

**Ecosystem project** (2 or more sub-projects, each with its own doc set): the folder is always named `ecosystem/` (never `projects/` `modules/` `apps/`). `ecosystem/<code>-<SUB>/` holds `docs/` `mockup/` `qa/` and its own repo. Docs that cover all sub-projects live in one place, the root `docs/`. Full layout and rules: [`references/ecosystem.md`](references/ecosystem.md).


**Folder rules (both types):**

- **`.docx` and `.md` may share one `docs/`.** No need for separate folders, because the extension already says who reads it.
- **Never lose the source files of figures.** If a figure must change next year and only the PNG is left, the whole figure must be redrawn.
- **Every button in a mockup must really click**, because a fake button makes the review wrong.
- **`.docx` / `.xlsx` live only in `docs/` and `qa/`.** Do not scatter them to the project root.
- **Temporary items go to `_to_delete/`** (`temp-file-discipline`).
- **`docs/README.md` is the index.** It says what to read first and who owns what (template in `project-bootstrap` → `assets/starter-files.md`).

---

## 2 · Choose the doc set by project size

Size is measured by **duration × number of people who must agree**, not by lines of code.

**S** ≤ 2 weeks · one team · nobody outside the team signs — **M** 1–3 months · internal client · delivered in rounds — **L** > 3 months · external client signs off · contractual obligations

### 2.1 · Deliverable docs: people read and sign them

| Doc | Format | Readers | S | M | L |
|---|---|---|:-:|:-:|:-:|
| Project Plan | `.docx` | client · team | ○ | ● | ● |
| SRS | `.docx` | dev · client | ○ | ● | ● |
| Architecture | `.docx` | dev · ops | ○ | ● | ● |
| Test Plan | `.docx` | QA · client | ○ | ● | ● |
| User guide (`MAN`) | `.docx` → `.pdf` | end users | ○ | ● | ● |
| FSD | `.docx` | dev · QA | ○ | ○ | ● |
| BRD | `.docx` | business side | ○ | ○ | ● |
| Document Checklist | `.docx` | everyone | ○ | ○ | ● |
| Test Cases | `.xlsx` | QA | ○ | ○ | ● |

● required · ○ not needed unless there is a specific reason
**Set S has none of these docs.** That is correct.

---

### 2.2 · Technical docs: the team and agents use them while building

All markdown. They **depend on what the project contains**, not on project size. Full table (file · question answered): [`references/technical-docs.md`](references/technical-docs.md).

- **Always:** `<project-name>/README.md` · `docs/BUILD-PLAN.md`
- **Conditional:** USER-STORIES and `docs/sprints/sprint-NN.md` (work runs in sprints) · AGENT-LOOP (an agent writes code in rounds) · API-SPEC (an API that others call) · DATA-DICTIONARY (a database exists) · EVALUATION-POLICY and PROMPT-LIBRARY (LLM used) · `docs/decisions/ADR-NNNN-<slug>.md` (decisions that will be questioned again) · `docs/runbook-<topic>.md` (system in real use and someone on call)

---

## 3 · Writing order

**Delivery track.** Never skip a step that belongs to the set for that size. Skip steps that are not in the set, such as BRD · FSD in set M.

```
Project Plan ─► BRD ─► SRS ─┬─► mockup
                            └─► Architecture ─► FSD
                                                 │
              User Guide ◄─ Test Cases ◄─ Test Plan
```

**The next doc may build on the DRAFT of the previous one.** Put `(รอยืนยัน)` (awaiting confirmation) on every unconfirmed item in both docs. Never set the next doc to APPROVED before the previous one, because if the upstream doc changes, the whole chain must be redone.
The one exception: **the mockup may run in parallel with the SRS**, because screenshots help the SRS get confirmed faster.

### 3.1 · Open-items register: when the user asks "what is still stuck", answer with an Excel file, not chat text

Labels such as `(รอยืนยัน)` · `(รอวัดใน Phase 0)` (awaiting measurement in Phase 0) and question tables are spread over every doc, so the decision maker sees no overall picture. Merge them into one file with the script. Do not read them all by hand:

```
python scripts/open_items.py docs/ docs/<CODE>-OPEN-ITEMS.xlsx --project <CODE>    # test the script: --self-test
```

- It reads every `.docx` in `docs/`: question tables · tables of undecided assumptions · sign-off tables still "waiting" · labels in the body. It skips revision history, table of contents, label-explanation lines and `(รอบหลัง)` (later round).
- The **สรุป** (summary) sheet counts by document × type with formulas. The **รายการค้าง** (open items) sheet has the heading in the doc · who answers · decide by · value used for now · cross-references · and "สถานะ" (status) and "คำตอบ" (answer) columns for people to fill in.
- Types (ประเภทที่ต้องเลือก), shown in Thai in the sheet: **เจ้าของตัดสิน** (owner decides: a web search cannot close it) · **ทีมตัดสิน** (team decides: BA · SA) · **กฎหมาย** (legal) · **วัดจริง** (needs a real-world number: none is published) · **ลงนาม** (sign-off). A question that cites an owner question in another doc also counts as "เจ้าของตัดสิน".
- **Before sending, read the list by eye.** The script matches wording. A row that was already answered but does not use the words "ตอบแล้ว · ปิดแล้ว · ตัดสินแล้ว" (answered · closed · decided) still gets through.
- When the user fills in answers: write the answer into the source doc, remove the label, record it in the revision history, then rerun the script. This file is a work list, not a source. Do not edit answers in this file in place of the doc.

**Technical track.** Write when you reach the point of need. No need to wait for anyone: README · BUILD-PLAN before the first line of code · DATA-DICTIONARY when designing the first table · API-SPEC at the first endpoint · PROMPT-LIBRARY at the first prompt really used · ADR at decision time (not in the final wrap-up, because the real reasons are gone by then) · Runbook before going live. Full table in [`references/technical-docs.md`](references/technical-docs.md).

---

## 4 · Who writes which doc, with which skill

Full table (agent · skill for each of 16 doc types): [`references/technical-docs.md`](references/technical-docs.md). Main ones: SRS → `srs-writing` · FSD → `fsd-writing` · ADR → `adr-writer` · Test → `test-case-template` · mockup → `web-app-design` + `ui-craft` · README → `project-bootstrap`

---

## 5 · Figures in docs: choose correctly from the start

- Figures in every kind of project doc (BRD · SRS · FSD · ADR · ER · flowcharts) · slides · print work → `diagram-figures` (one house style). Keep them in `docs/figures/` with sources in `src/`. **Default Mermaid is banned from project docs.**
- Quick figures in a README · PR · code notes → Mermaid (`software-diagrams`) embedded in `.md` (colours are random and meaningless, Thai overflows the boxes, and shrunk to A4 it is unreadable).

**Every figure header needs all 6 items:** project logo · title · 1-line subtitle · figure number · version and date · owner (details in `diagram-figures` section 3).

---

## 6 · Colour theme of the doc set

Declare it once per project, at the top of every doc's source file:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(The example uses the house colour `#2A78D6`. Replace it with the project's main colour.)

`branded-document-design` · `presentation-design` · `diagram-figures`
read this value instead of picking colours themselves, so docs, slides and every figure form one set.

**Colour comes from the work, not from taste.** If there is a brand colour, use it. If not, use the house colour of `branded-document-design`, write `(รอยืนยัน)`, and carry on without stopping to ask.
Exceptions that do not follow the theme: service provider logo colours · grey structural lines · green = pass / red = fail

---

## 7 · Checklist before delivering the doc set

- [ ] In every `.docx`, open the Navigation Pane and **see all headings** (use real Heading styles, not bold text)
- [ ] Every doc has a revision history page · version number · date · author
- [ ] Every figure has a figure number and is cited in the body at least once
- [ ] The source file of every figure is in `docs/figures/src/` (if this folder exists)
- [ ] Technical docs that meet the conditions in section 2.2 are all present. For example, if there is an API there must be an API-SPEC, and if an LLM is used there must be a PROMPT-LIBRARY
- [ ] Every abbreviation is spelled out at first appearance
- [ ] File names follow `document-naming`: no `final2`, no `ล่าสุด` ("latest")
- [ ] Docs in the set cite each other's versions consistently
- [ ] Run `scripts/open_items.py`, and the open-items register has no row with status "เปิด" (open), or the client knows about every row still open
- [ ] Tell the user what is left in `_to_delete/` (do not delete it yourself; delete only when the user says so)

---

## 8 · Anti-patterns

Wrong: `.docx` with no Heading style · keeping only the PNG and not the source · `.docx` and mockups inside the code repo (at this point move to type B) · a doc in 2 places (= 2 versions) · FSD before the SRS is confirmed · using an LLM with no PROMPT-LIBRARY · sub-projects named `projects/` `modules/` `apps/` · empty folders created in advance · one doc that answers every question

---

## 10 · Links to other skills

Doc status in `docs/BUILD-PLAN.md` → `status-report` · checklist for the printed version → `assets/doc-set-checklist.md`

**Read more when needed:** [`references/writer-templates.md`](references/writer-templates.md): `technical-writer` doc templates (tutorial · API reference · release notes · for README see `project-bootstrap`)

**When the guide must go on the web, be searchable and have many versions:** [`references/docs-site.md`](references/docs-site.md): choosing MkDocs Material · Docusaurus · Starlight · VitePress · Thai search test results · hosting · Thai fonts


## reference: docs-site.md

# Docs site

Pick a docs-site generator when a manual or developer documentation must go on the web, be searchable, and have several versions · use with `SKILL.md` item 1 (where the documents live) and the templates in [`writer-templates.md`](writer-templates.md).
Facts checked 2026-10-23 from official docs · npm · PyPI · GitHub and real tests (section "Sources").
Abbreviations: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · Is a docs site needed

| Situation | Use |
|---|---|
| People outside the team read often (public API · SDK · a manual updated every release) · search needed · several versions at once | a docs site (this file) |
| The team reads it themselves | `README.md` + `docs/*.md` on GitHub is enough |
| The customer signs for acceptance | `.docx` per `SKILL.md` item 2.1 · a docs site does not replace the handover document |

## 2 · Comparing the 4 generators

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| Requires | Python | Node · React | Node · Astro | Node · Vue |
| Latest version | 9.7.7 | 3.10.2 | 0.42.6 (not yet 1.0) | 1.6.4 · 2.0 is still alpha |
| Built-in search | yes · lunr.js + lunr-languages (can set `lang: th`) | no · the official one is Algolia DocSearch · local search uses a community plugin | yes · Pagefind is on by default, no setup | yes · MiniSearch (`provider: 'local'`) or Algolia |
| Versioning | via `mike`, an external tool | built in, `docusaurus docs:version` | community plugin `starlight-versions` | none · issue #109 is still open |
| Multiple languages (i18n) | the UI can be translated (`th` exists) · a multilingual site = one project per language + a language switcher | built in | built in · a Thai UI is included | built in |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: the maintainers announced they will maintain only critical fixes until 5 May 2027 and told users to move to Zensical (version 0.0.71 · status Alpha · MIT) · a new project that must live for years should record this in an ADR.
Quick pick: Python team → MkDocs Material (plan a move) · need built-in versioning → Docusaurus · want a light site with little setup → Starlight · Vue team → VitePress

## 3 · Thai search, tested for real

Thai has no spaces between words, so a search engine that splits words on spaces cannot find a word in the middle of a sentence · tested 2026-10-23 with 2 Thai pages, searching 9 words: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| Search engine (version tested) | Used in | What the docs say about Thai | Found |
|---|---|---|---|
| Pagefind 1.5.2 (builds an index, searches in the browser) | Starlight | has `th` · no stemming · the word-segmentation section mentions only Chinese, Japanese, Korean | 6/9 · missed กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (word splitting with wordcut · tested in Node, not in the theme) | MkDocs Material · plugin `@easyops-cn/docusaurus-search-local` (accepts every lunr-languages language) | Material accepts `lang: th` | 6/9 · missed ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 defaults (prefix + fuzzy as in VitePress) | VitePress | VitePress segments with `Intl.Segmenter` only for Chinese and Japanese | 0/9 |
| MiniSearch + a `tokenize` that uses `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | `tokenize` can be set by yourself | 9/9 (tested in Node 22 · not yet tested in a whole VitePress site) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | Algolia's language table: Thai segmentation "Not supported" | not tested |

- Results depend on the project's vocabulary → before delivery, search 20 real terms and record the results in the docs site's README.
- DocSearch is free only for technical documentation and technical blogs that are public. The site must be live and have no non-technical content.

## 4 · Hosting

| | GitHub Pages | Cloudflare |
|---|---|---|
| Price | free · a free account needs a public repo | Pages has a free plan · Workers static assets: static file requests are free and unlimited |
| Limits | site ≤ 1 GB · bandwidth 100 GB/month (soft) · build 10 times/hour (soft · builds through GitHub Actions do not count) · a deploy over 10 minutes fails | Pages free plan: 500 builds/month · 1 build at a time · max 20 minutes · 20,000 files · each file ≤ 25 MiB |
| Conditions | must not be used as free hosting for an online business or SaaS · the site is public even if the repo is private | the Pages page tells new projects to start on Workers |

A document that outsiders must not see does not go on a public site. Keep it as `docs/*.md` in the repo (how each host restricts readers has not been checked).

## 5 · Thai fonts

- Use the same fonts as the app: `Inter` + `Noto Sans Thai` (`web-app-design` → `references/tokens.md`) · other Google Fonts choices that have Thai letters and are OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- Load through the Google Fonts CSS2 API with `display=swap` · the API splits out the `/* thai */` block with `unicode-range: U+0E01-0E5B …` by itself, so the browser loads only the parts the page uses (seen in the CSS the API returned 2026-10-23)
- Thai line-height is the English value plus 0.1 (`ui-craft` item 2)
- Set the font in the slot the theme exposes · the setting names and CSS variables of each theme have not been checked

## 6 · Content lives in the repo beside the code

- The docs site source lives in the code folder `<project-name>/docs/` with the generator's config file (layout A of `project-bootstrap` item 1) · code and manual change in the same pull request
- Type B projects: the handover `.docx` · ADR · runbook · BUILD-PLAN stay in `docs/` at the root · the docs site takes only what outsiders read (manual · tutorial · API reference · release notes) · the same content must never live in 2 places
- Build in Continuous Integration (CI) on every pull request and deploy on merge (`cicd-and-release`)
- An exception to the root is declared in the code folder's README (`SKILL.md` item 1)

## Sources

| Topic | URL or evidence (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (status · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (file `lunr.th.js` uses wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| Docusaurus local-search plugin | https://github.com/easyops-cn/docusaurus-search-local |
| Versions and licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` in https://github.com/google/fonts · real CSS from fonts.googleapis.com |
| Thai search test | Pagefind via `npx pagefind@1.5.2` + a browser · lunr and MiniSearch via Node 22 · 2 test pages, the 9 search words in item 3 |


## reference: ecosystem.md

# Ecosystem project: 1 system split into several sub-projects

Read this when a project has 2 or more sub-projects and each one has its own doc set. The short rule is in `SKILL.md` section 1.

Use it when the project is a product suite with 2 or more sub-projects, and each has its own doc set (SRS · mockup · architecture). Example: Quanton, split into CONNECT · LAB · INTEL · DESK.
**The folder must always be named `ecosystem/`.** Never use `projects/`, `modules/` or `apps/`. When someone opens the folder, they must see at once that everything inside is a piece of one system.

```
<project-name>/
├─ docs/                ecosystem-level docs — README (index) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <code>-<SUB>/     1 folder per sub-project, e.g. QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    code repo of this sub-project (lowercase, joined with `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   shared by the whole ecosystem (same rules as type B)
```

- Docs that cover every sub-project (BRD · project plan · BUILD-PLAN) live in one place, the root `docs/`. Never copy them into each sub-project.
- Create a sub-project folder when you start writing that sub-project's docs. Do not create folders in advance.
- Sub-project folder name = project code + sub-project name in capitals (`QTN-CONNECT`). Use the same code the docs cite.
- If a project already uses `projects/`, rename it to `ecosystem/` and fix the paths in every doc and script in the same pass.
- A project with a single product does not need `ecosystem/`. Use type B as usual.


## reference: technical-docs.md

# Technical docs: table, writing order and who writes what

Read this when choosing the technical doc set or about to write one of them. The summary is in `SKILL.md` sections 2.2–4.

## Technical docs (section 2.2)

This group is **all markdown** and **does not depend on project size**. It depends on what the project contains.

| Doc | File | Answers the question | Needed when |
|---|---|---|---|
| README | `<project-name>/README.md` | How to install and run | **Always** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | What to build first and next · where we are now | **Always** |
| USER-STORIES | `docs/USER-STORIES.md` | What to build for whom · which story is ready for a sprint · what the AC (acceptance criteria) are | Work runs in sprints or there is a backlog (`user-story-writer`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | Which stories this sprint takes · what the goal is · what the risks are | Work runs in sprints (`/sprint-plan`). One file per sprint; never overwrite old ones |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | How the agent works in a cycle · what the stop condition is | An agent writes code in rounds (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | What each endpoint accepts, returns and how it fails | There is an API that others call (`api-conventions`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | What a field means · what values it can take | There is a database or data schema (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | What measures whether the output is good enough · what the pass threshold is | Output comes from a model or LLM that is not always right |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | Which prompt is the real one · which version · what changed | An LLM sits on the system's main path |
| ADR | `docs/decisions/ADR-*.md` | Why we chose this way and not the other | A decision will be questioned again (`adr-writer`) |
| Runbook | `docs/runbook-<topic>.md`, one topic per file | What to do when the system goes down at 2 a.m. | A system is really running and someone is on call |

> **The 4 conditional docs (LLM · API · database) are the ones people forget most often.**
> The team then ends up asking the agent every round "which prompt is the real one" or "what does this field mean".

## Technical track: when to write (section 3)

| Write when | Doc |
|---|---|
| Before the first line of code | README · BUILD-PLAN |
| Before letting an agent work in rounds | AGENT-LOOP |
| When designing the first table | DATA-DICTIONARY |
| When designing the first endpoint | API-SPEC |
| When writing the first prompt that will really be used | PROMPT-LIBRARY · EVALUATION-POLICY |
| When deciding something that will be questioned again | ADR |
| Before going live | Runbook |

> **Write the ADR and DATA-DICTIONARY at decision time, not in the project wrap-up.**
> You can write them afterwards, but the real reasons are gone by then.

## Who writes which doc, with which skill (section 4)

| Doc | agent | skill used |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `branded-document-design` |
| BRD · user story | `business-analyst` | `user-story-writer` |
| SRS | `system-analyst` | `srs-writing` |
| FSD | `system-analyst` | `fsd-writing` |
| Architecture | `solution-architect` | `architecture-patterns` · `diagram-figures` |
| ADR | `solution-architect` | `adr-writer` |
| Test Plan · Test Cases | `qa-tester` | `test-case-template` |
| mockups | `ux-designer` | `web-app-design` · `ui-craft` |
| User guide (`MAN`) | `technical-writer` | `polished-document-style` |
| Runbook | `devops-engineer` | `incident-runbook-template` |
| BUILD-PLAN | `project-manager` | `simplicity-first` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-conventions` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | none (pairs with skill `llm-engineering`) |


## reference: writer-templates.md

# technical-writer templates — README · tutorial · API reference · release notes

**Contents:** README · Tutorial Template · API Reference Template · Release Notes Template

Open when you actually have to write this kind of document · put `(รอยืนยัน)` (to be confirmed) on any part you do not know.

## Standard Outputs

### README

There is no README template here — use the single template of `project-bootstrap` (`SKILL.md` item 2 and `assets/starter-files.md`). The 15-section skeleton (9 always present · 6 present when the project has that thing) is in `references/readme-skeleton.md` · commands per language are in `references/readme-by-stack.md`.

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes must always come before the other sections (right after Highlights) — the full release notes rules are in the skill `release-notes`.

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (Thai)

> Same structure as the English version · wording at news register (`human-writing` `references/thai-grammar.md` section 4): no first person · each line has subject + verb + object · numbers must be measured, and if there are none, leave them out · right/wrong examples are in the skill `release-notes` item 4.

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````
