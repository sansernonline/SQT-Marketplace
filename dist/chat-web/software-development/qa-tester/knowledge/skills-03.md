# skill: load-testing

Use when checking how many users a system holds

# load-testing — load tests with a goal, a pass threshold and permission

Sample script [`assets/load-test.js`](assets/load-test.js) · sample workflow [`assets/k6-smoke.yml`](assets/k6-smoke.yml) · tool facts checked 2026-10-28, links in [`sources`](references/sources.md)

> **One rule:** no pass threshold written before the run = no test result, only a graph · and never load a system that is not ours, or production, without a named person's written approval.

## Use when

- Before launching a system or before a campaign that brings many people at once (sale · registration opening · results announcement)
- Someone asks "ระบบรับได้กี่คน" · "ตอนคนเยอะจะช้าไหม" · "เพิ่มเครื่องแล้วดีขึ้นจริงไหม" (how many users can it hold · will it be slow when busy · did adding machines really help)
- A postmortem says the incident happened because load was never tested (`postmortem-template` section 5)
- Setting up a speed smoke test in CI that fails when slower than the threshold
- The user says load test · stress test · spike · soak · k6 · Locust · JMeter · p95 · ยิงโหลด · ทดสอบประสิทธิภาพ

Do not use when: one web page loads slowly in the browser (Lighthouse · Core Web Vitals) → [`web-quality-audit`](../web-quality-audit/SKILL.md) · the live system is slow right now and you must find where → [`observability-basics`](../observability-basics/SKILL.md) first · testing that a button click gives the right result → [`e2e-testing-patterns`](../e2e-testing-patterns/SKILL.md)

## Related skills

- `observability-basics`: open the system's dashboards next to the k6 results (section 6).
- `cicd-and-release` · `jenkins-pipeline`: section 7 says what runs on every PR and what runs on a schedule.
- `test-case-template`: for a whole-release test plan, put the load test in as one row, with the thresholds from section 1.
- `kubernetes-helm` · `infra-as-code`: if you must add machines or autoscale after the run, run again with the same script and compare with the result before.
- `pdpa-compliance`: if test data contains names or phone numbers, use fake data. Do not pull real customer data in to load the system.

## 1 · Goal and pass threshold — write before opening the tool

Get answers to 4 questions, then note them at the top of the script file or the test plan:

| Item | Example answer | If there is no answer |
|---|---|---|
| Expected volume | Peak hour 50 requests per second on path `/api/orders` | Pull it from the live system's logs or metrics · for a new system, use the owner's estimate and tag it `(รอยืนยัน)` (awaiting confirmation) |
| Paths to load | Browse products 70% · add to cart 20% · pay 10% | Load the 1–3 paths that earn the most money or cost the most first |
| Speed threshold | The `p(95)` of response time is at most how many milliseconds | Default 500 ms for an API. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) · adjust once there is a baseline result |
| Error threshold | `http_req_failed` below what percent | Default 1%. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) |

- Measure with percentiles, not averages: an average hides the minority who wait a long time.
- Turn every threshold into `thresholds` in the script (section 4). Do not keep them in the head of whoever reads the result.
- If there is no volume figure at all, you can run smoke and baseline, but you must not conclude "it can handle it", because you do not know what it is handling it against.

## 2 · Permission gate — before every run beyond smoke and every run on production

Loading a system without permission can really bring it down and may be illegal. So stop here and wait for approval. Do not skip it even if the user is in a hurry.

1. **Whose system is it?** · If it belongs to someone else (a partner's API · payment gateway · external SaaS · a competitor's site) → do not load it · use a mock, or a sandbox the provider opens for load testing, and read their terms first.
2. **Environment** · Run on staging or a separate load-test environment · the k6 docs say a QA environment with machines unequal to production cannot be used to judge load capacity, only for smoke.
3. **Production** · Needs a named approver, a time window, a peak volume, and a watcher who can stop at once · start with a low-volume smoke (the k6 docs treat it as a low-risk practice) · never create real orders, payments, emails or SMS.
4. **Anything that causes side effects when hit** · Take payment and message-sending webhooks off the path, or point them at a mock · for an external provider that charges per call, set a spending cap first.
5. **Record** in the script header or plan: system · environment · peak volume · time window · approver · way to stop

The sample script enforces this gate in code: if `BASE_URL` or `TARGET_ENV` is missing, the script stops · if the type is not smoke, or `TARGET_ENV=production` (smoke included), and `APPROVED_BY` is missing, the script stops too.

## 3 · Choose the tool

| If | Use | Reason |
|---|---|---|
| Starting fresh · HTTP API or web · want the pass threshold to fail CI directly | **k6** (default) | Written in JavaScript · `thresholds` in the script · exits with a non-0 code when a threshold fails · AGPL-3.0 licence |
| Team prefers Python · needs complex step sequences or its own protocol | **Locust** | Test scenarios are plain Python code · can be spread over several machines · runs headless in CI · MIT licence |
| The organisation already has a `.jmx` plan · must load JDBC · JMS · LDAP · FTP · SOAP | **JMeter** | Wide protocol support · has a GUI to record plans · use CLI mode (headless) for real runs |

- Versions seen on 2026-10-28: k6 v2.3.0 (2026-09-21), and the 1.x line still gets a security patch v1.8.2 (2026-10-12) · pin the version in CI, do not use `latest` · `setup-k6-action` without `k6-version` always gets the latest ([README](https://github.com/grafana/setup-k6-action) checked 2026-10-28)
- Grafana Cloud k6 (runs from the cloud · stores results): price and quota `(ยังไม่ได้ตรวจ)` (not yet checked) · start with k6 on a machine or a CI runner, which is free
- The machine that sends the load must not be the same machine as the system under load, or they fight over CPU and the result is skewed.

## 4 · Test types and the script

Order per the k6 docs: **smoke always first** → average-load → other types by risk · use a plain load shape (ramp up · hold · ramp down). Do not run load that goes up and down several times, because the cause is hard to find.

| Type | What it asks | Virtual users (VU) and time, per the k6 docs | When |
|---|---|---|---|
| smoke | Is the script right? Does the system answer when few people use it? | Few · seconds to a few minutes | Before every other type · every PR in CI |
| load (average-load) | Does normal volume pass the threshold? | Equal to production average · 5–60 minutes | Before releasing a version · as the baseline |
| stress | What happens above normal? | Above average · 5–60 minutes | Systems at risk in heavy-use periods |
| spike | Does it survive a sudden rush? | Very high · a few minutes | Before a campaign · flash sale |
| soak | After long use, does memory leak or do connections hang? | Average · several hours | Systems that stay up for long periods |
| breakpoint | Where is the ceiling? | Ramp up until it breaks | Run only a few times, always needs approval per section 2 · the sample script has no such type, write the stages yourself |

The script [`assets/load-test.js`](assets/load-test.js) picks the type with `TEST_TYPE`. Every type uses the `ramping-arrival-rate` executor (it fixes the number of iterations per unit of time, so when the system slows down it still gets hit at the same rate, and you see the real symptoms) · the core is thresholds:

```javascript
thresholds: {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
  http_req_duration: ['p(95)<500'],              // default, not measured
  'http_req_duration{type:API}': ['p(95)<500'],  // separate threshold by tag
},
```

- `abortOnFail` stops the run when a threshold fails midway, instead of pounding the system to the end · `delayAbortEval` waits to collect samples before judging
- Every number in the script (rate · VU · stages) is a **default, not measured** value. Adjust per section 1.
- Run: `k6 run -e TEST_TYPE=smoke -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com assets/load-test.js > _to_delete/k6.log 2>&1; tail -40 _to_delete/k6.log` (k6 prints a long progress log for as long as the run lasts, so read only the closing summary)

## 5 · Reading the result

Details and worked examples are in [`reading-results`](references/reading-results.md) · in short:

1. Look at the thresholds lines at the end of the report first (pass/fail), then the exit code: 0 = every threshold passed · a failed threshold usually gives 99
2. Look at `http_req_failed` before `http_req_duration`. If errors spike, the response times you see may be fast only because errors answer fast.
3. Look at the load-sending machine. CPU at full or too few VU = the result shows the limit of the load generator, not the system.
4. Compare with the previous baseline using the same script, same data, same environment · change one thing at a time
5. The report says "which threshold passed or failed, at what volume", not "the system holds 10,000 people", unless you really ran that.

For a multi-stage system (for example listen to audio → chat → speak): load each stage alone first, then the whole path · the bottleneck differs per stage (an example from a teaching job, not a threshold: chat holds 4 · listening holds 32 · speaking holds 2) · whole-system speed equals the weakest stage · a queue does not make it faster, it keeps it from breaking (the extra people get slower answers instead of errors) · set the consumer's prefetch equal to the number of jobs the backend can really do at once (`rabbitmq-messaging` section 4) · if the backend dies mid-run, add a watchdog per section 8 of `rabbitmq-messaging`

## 6 · Run together with monitoring

The k6 result says it is slow, but not why · during the run, open the dashboards per `observability-basics` section 2 (latency · traffic · errors · saturation) for the server, database and queue · note the start and end time of the run so you can match the graphs · common bottlenecks: database connection pool · queries without an index · connections not returned (example in `postmortem-template` section 5)

## 7 · Plug into CI

| Run when | Type | Where |
|---|---|---|
| Every PR or every push | smoke · a few minutes | staging or the PR's environment |
| Overnight or on a schedule | load · stress · spike | a separate load-test environment |
| Before a major release | the full set chosen in section 4 · run at least 2 rounds | an environment equal to production |

- The k6 docs warn that load tests take 3–15 minutes or more, so do not put them on the path that deploys automatically, and do not trust pass/fail alone until the process is stable.
- GitHub Actions: `grafana/setup-k6-action@v1.2.2` (set `k6-version`) installs k6, then `grafana/run-k6-action@v1.5.0` runs it (pinned versions, checked 2026-10-28) · full example in [`assets/k6-smoke.yml`](assets/k6-smoke.yml) · Jenkins or other CI call `k6 run` directly
- Do not wrap `k6 run` in a script that swallows the exit code (for example one with a trailing `echo`) · make `k6 run` the last command, or keep `$?` and `exit` with that value
- `BASE_URL` and tokens come from CI secret variables (`config-and-secrets`), not written into the script

## Check before sending

1. Expected volume, paths, and the p95 and error-rate thresholds exist before the run · guessed values carry the label "ค่าตั้งต้น ยังไม่ได้วัด" (default, not measured)
2. The system is ours · the environment is stated clearly · beyond smoke there is a named approver · production has a watcher and a way to stop
3. No real money, email, SMS or order came from the run
4. Thresholds are in `thresholds` · `abortOnFail` is set on the error rate
5. smoke passed before other types · the load generator is not the same machine as the system
6. The report states results against thresholds and the baseline at the volume really run, and does not conclude beyond what was run
7. CI does not swallow the exit code · secrets come from secret variables · the k6 version is pinned

## References

- [`references/reading-results.md`](references/reading-results.md) — open to read a k6 result (section 5)
- [`references/mcp-k6.md`](references/mcp-k6.md) — open when using the k6 MCP server
- [`references/worked-example.md`](references/worked-example.md) — open for a flash-sale example run through sections 1 to 7
- [`references/sources.md`](references/sources.md) — links and check date 2026-10-28 for every tool fact


## reference: mcp-k6.md

# k6 MCP (grafana/mcp-k6)

Extension of `load-testing` · checked 2026-10-28 from https://github.com/grafana/mcp-k6 and https://api.github.com/repos/grafana/mcp-k6/releases · not embedded in the plugin; the user installs it if wanted

## Status

| Topic | What was seen |
|---|---|
| Maintainer | Grafana (repo `grafana/mcp-k6`) |
| Status | The README says it is still experimental |
| Latest version | v0.7.0 on 2026-10-05 |
| License | The repo page is inconsistent: the sidebar says AGPL-3.0 but the README says MIT · open the LICENSE file before using it in customer work |
| Tools | `validate_script` (runs 1 VU for 1 round) · `run_script` (real run, up to 5 minutes) · `list_sections` · `get_documentation` |

## Cautions

- `run_script` sends real requests to the targets in the script · `validate_script` also sends 1 round · the permission gate in `load-testing` section 2 applies to calls through MCP too, with no exceptions
- Start with only `get_documentation` and `validate_script` pointed at staging · have the agent call `run_script` only when the user allows it in that round
- HTTP mode has no built-in authentication; use it only in a trusted network · stdio on your own machine is better

## Install (the user does it, pin the version)

Claude Code via Docker (command form per the README):

```bash
claude mcp add --scope=user --transport=stdio k6 -- docker run --rm -i grafana/mcp-k6:<tag ของ v0.7.0>
```

The Docker Hub image tag that matches v0.7.0 `(ยังไม่ได้ตรวจ)` (not yet checked) · the README uses `latest`, but open the tag page and put in a pinnable version instead · other ways: Homebrew (`brew tap grafana/grafana` then `brew install mcp-k6`) or the `.deb` `.rpm` packages from the v0.7.0 release page · running natively also needs k6 on PATH

The k6 docs still mention the command `k6 x mcp`, which pulls the latest version automatically · to pin a version, use the standalone `mcp-k6` as above (from search results citing https://grafana.com/docs/k6/v2.3.x/set-up/configure-ai-assistant/; that page was not opened directly)


## reference: reading-results.md

# Reading k6 results and writing the report

Extension of `load-testing` section 5 · k6 facts checked 2026-10-28 from the pages linked at the end of the file · the interpretation is general practice, not yet tested against a real system this round

## 1 · Read in this order

| Order | What to look at | Interpretation |
|---|---|---|
| 1 | exit code | 0 = every threshold passed · not 0 = failed · a failed threshold usually gives 99 |
| 2 | the thresholds line at the end of the report | which thresholds passed, which failed, and the actual values |
| 3 | `http_req_failed` | if errors spike → a fast response time may only be because errors return fast, so do not celebrate the p95 yet |
| 4 | `http_req_duration` p95 and p99 | the range most users experience, and the tail a few users wait through · the average cannot be used to decide |
| 5 | `checks` | whether the answers are correct, not just a status 200 |
| 6 | warnings about not enough VUs, or rounds that did not start | the load generator could not keep up with the set rate; this run shows the limit of the generator, not the system (metric name of the dropped rounds `(ยังไม่ได้ตรวจ)` — not yet checked) |

## 2 · Find where it jams

Look at the system graphs for the same period as the run (`observability-basics` section 2):

| Symptom in the graph | Suspect first |
|---|---|
| App CPU full, response time grows with it | Heavy code or too few machines · try adding machines and run again |
| App CPU idle, but response time grows | Waiting on something outside: database connection pool · table locks · an external API |
| Errors start at a certain load and then spike | Hit a ceiling (pool · open files · rate limit) · find the setting at that load |
| soak: memory keeps rising and never drops | Memory leak · connections not returned |
| Response time good at first, then worse as the data grows | Query without an index · table grown from data the run created |

## 3 · Re-run so results are comparable

- Same script, same starting data, same environment · clean up the data the previous run created
- Change one thing at a time (code, or a setting, or machine size) and run against the baseline
- The k6 docs advise running the same way at least 2 rounds before releasing a version, because each round's result varies

## 4 · One-page report format

```markdown
## ผล load test · <ระบบ> · <YYYY-MM-DD>

- environment: <staging-perf> · ผู้อนุมัติ: <ชื่อ> · ช่วงเวลา: <เริ่ม–จบ>
- แบบ: <smoke · load · spike> · ปริมาณสูงสุดที่ยิงจริง: <รอบต่อวินาที>
- k6 รุ่น: <v2.x.y> · exit code: <0 หรือ 99>

| เกณฑ์ | ตั้งไว้ | ได้จริง | ผล |
|---|---|---|---|
| http_req_duration p(95) | < 500 ms | <ค่า> | ผ่าน / ไม่ผ่าน |
| http_req_failed | < 1% | <ค่า> | ผ่าน / ไม่ผ่าน |

คอขวดที่เห็น: <กราฟไหน ที่ปริมาณเท่าไร>
ทำต่อ: <ข้อแก้ 1–3 ข้อ> · ยิงซ้ำหลังแก้: <วันที่>
```

Write results only as actually run · if you only ran 50 rounds per second → never write "can handle 1,000 users at once"

## Sources

- exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/ (checked 2026-10-28)
- thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/ (checked 2026-10-28)
- run at least 2 rounds again https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/ (checked 2026-10-28)


## reference: sources.md

# Sources · load-testing

Checked 2026-10-28 (opened through a web-fetch tool that summarises pages with a small model, so reopen the raw page before locking a value in production)

- thresholds · `abortOnFail` · `delayAbortEval` · per-tag thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/
- names of all 6 executors https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ · options of `ramping-arrival-rate` https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/
- test types and their order https://grafana.com/docs/k6/latest/testing-guides/test-types/
- CI · environment · production https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/
- exit codes 0 and 99 · scripts that swallow the exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/
- GitHub Actions https://github.com/grafana/run-k6-action
- k6 licence https://github.com/grafana/k6 · versions https://api.github.com/repos/grafana/k6/releases
- Locust https://docs.locust.io/en/stable/what-is-locust.html · JMeter https://jmeter.apache.org/ (the home page links to the Apache Software Foundation licence and does not state the latest version)
- Not yet checked (`ยังไม่ได้ตรวจ`): Grafana Cloud k6 price and quota · latest versions of Locust and JMeter


## reference: worked-example.md

# Worked example · load-testing

## One worked example

Label `ตัวอย่าง` (example): designed on paper, no real system has been loaded

**Problem:** An online shop will run a flash sale at noon on Friday. It went down before because the connection pool filled up. They want to know whether it survives this time.

| Step | What is done | Section |
|---|---|---|
| Goal | Volume from the previous campaign (รอยืนยัน) · path: browse products → add to cart → pay with a mock · p95 at most 500 ms · errors at most 1% (default, not measured) | 1 |
| Permission | Load staging at production size · payment points at a mock · approver and time window noted in the script header | 2 |
| Run | smoke → load (baseline) → spike | 4 |
| Monitor | Dashboards of connection pool and database CPU during the run | 6 |
| Result | Report which thresholds passed and failed at the volume really run, then add smoke to CI | 5 · 7 |



---

# skill: fsd-writing

Use when writing or reviewing a Functional Specification Document

# Writing a Functional Specification Document (FSD)

> For Thai text, use the business register (`human-writing` `references/thai-grammar.md` section 4).

> **The one rule:** An FSD is done when a developer can read it and **write code without guessing or asking**.
> Every point that forces a guess becomes rework after delivery.

## When to use this skill

- Writing an FSD or Functional Spec for a feature, a module, or a whole system
- Expanding a Software Requirements Specification (SRS) or Business Requirements Document (BRD) to a level detailed enough to build from
- Reviewing someone else's FSD, where you must say what is missing
- A developer keeps asking the same questions while building. That means the FSD is incomplete.

Not for: requirements a customer signs off → `srs-writing` · user stories for a sprint → `user-story-writer` · endpoints of one feature → command `/api-design` (system-wide agreements → `api-conventions`) · tables and columns → `database-design`

## Read more when

| File | Open when |
|---|---|
| [references/worked-examples.md](references/worked-examples.md) | You are writing the first use case, screen, state table, or business rule of the document. Open the full examples and copy the format. |
| [references/edge-cases.md](references/edge-cases.md) | You are writing the errors and edge cases section, and when you review before sending, to cover every case. |
| [references/fsd-vs-srs.md](references/fsd-vs-srs.md) | You are unsure whether a piece of content belongs in the SRS or the FSD. Open this comparison table. |
| [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md) | You are writing an easy-to-read FSD for stakeholders (Mode B, the same 11 sections as item 3), or you need a reviewer-friendly template for a use case, API endpoint, or data model. |
| [references/figures.md](references/figures.md) | You are planning which section needs which figure type. |
| [references/outline-sections.md](references/outline-sections.md) | You must decide which section can be skipped. Open this table. The full copy-and-fill outline is in [assets/fsd-outline.md](assets/fsd-outline.md). |
| [references/related-skills.md](references/related-skills.md) | The task needs another skill alongside this one, such as figures, API agreements, or test cases. Open it to see which one. |

## 0 · Look for an existing template first (every time)

Before you use the outline or templates in this file, check whether the user, customer, or project already has its own:

- **Where to look:** the FSD (Functional Specification Document) template from the client or the TOR (terms of reference) · an earlier FSD of the same system · the screen spec template the dev team uses (look in `docs/`, or ask the user one question)
- **Result:** Found → use it (sections, order, field names, numbering) and say in the reply which file it came from. Not found → use the template in this file as a fallback and say that no earlier template was found.
- **Still required in every template:** the FSD/SRS boundary in item 1 and linking codes to use cases.

## 1 · How an FSD differs from an SRS — the boundary must be clear

These two documents get mixed up most often. The result is an SRS so long the customer does not read it, and an FSD so shallow that developers must ask.
The SRS says what the system **must be able to do**. The FSD says **how** the system does it. A dimension-by-dimension comparison is in [references/fsd-vs-srs.md](references/fsd-vs-srs.md).

> **An FSD must not create new requirements.** When you find something the SRS does not cover, **add it to the open-questions list**, mark it `(รอยืนยัน)` (awaiting confirmation), and keep working on the rest.
> The item must be added to the SRS first. Do not write it quietly into the FSD.
> An item that shows up in the FSD with no source is one the customer will refuse to pay for at acceptance.

## 2 · Working order

1. Read the whole SRS or BRD first, then **list the items that are still unclear**. Ask once, at the start, as multiple choice. Every option has evidence (skill `superuser` item 6). Ask only about items where different readings would change the whole deliverable (options = the possible readings, citing the item in the SRS/BRD). Mark the rest `(รอยืนยัน)` and keep going.
2. Confirm who the document is for: developers only (**Mode A**, the default), or also a customer who reads it to sign off (**Mode B**: the same 11 sections in the same order, only laid out so a reviewer can read them easily; see [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md)).
3. Go use case by use case, not screen by screen. Screens come from use cases, not the other way around.
4. Write the business rules separately first, then refer to them from the steps (item 7).
5. Build the traceability matrix as you go, not at the end.
6. **Draw, then collect questions.** While drawing the sequence diagram, cancellation flow, and ERD, you will find matters the stories and SRS do not answer (for example, whether a course deducts a session at booking or at attendance). Note them at the end of the document as questions with a proposed answer marked `(รอยืนยัน)`. Do not choose for the customer.
7. Review by item 11 before sending.

## 3 · Document outline

There are 11 sections, in this order: Introduction · Users and permissions · Process overview · Use cases · Screen requirements · State diagram · Business rules · Data and integrations · Errors and edge cases · Traceability matrix · Revision history.
You may skip only the screen requirements if there is no screen, and the state diagram if there are no states. The full outline is in **[`assets/fsd-outline.md`](assets/fsd-outline.md)**. The table of the question each section answers is in [references/outline-sections.md](references/outline-sections.md).

## 4 · Use cases — one format across the document

Every use case has a header table (comes from · actor · preconditions · result on success · frequency), followed by tables for the main steps, alternatives, and error cases. The full example UC-ORD-010 is in [references/worked-examples.md](references/worked-examples.md).

**Rules for a use case:**

- **One use case = one user goal**, not one screen.
- Every use case needs at least one **alternative** and one **error case**.
  A use case with only the smooth path is a use case that is not finished.
- The "what the system does next" column must not be empty. An empty cell means nobody has worked out how the system responds.
- **Always re-check preconditions on the server.** Hiding a button is not access control.
- Write it as alternating "user does → system responds", not as a paragraph of narrative.

## 5 · Screen requirements

The full example SC-ORD-020 with its field table is in [references/worked-examples.md](references/worked-examples.md).

**Every screen must specify all 6 things:**

| Required | Detail |
|---|---|
| Field table | Type · required or not · validation rule · **the actual error message** · default value |
| Permission per role | Which role can see · edit · only read · not see at all |
| The five screen states | Empty · loading · error · partial · success (see `ui-craft`) |
| Actions and results | Which button goes where · which button opens a confirmation box |
| Display rules | Date format · decimals for money · rounding · time zone |
| Data source | Which endpoint or table this field comes from |

> **"The actual error message" means the words the user will really see**, not "show a warning message".
> If you leave it out, the developer will invent one, and the system will end up with ten different phrasings.
>
> **Display rules must be written down.** A "total" that does not say how it rounds
> is a bug you will find at month-end reconciliation.

## 6 · State diagram — the point FSDs forget most often

Anything with a "status" (an order, a leave request, a work ticket, a document) needs a table with the columns From · To · Who can do it · Condition · Side effects, and **must not have only a picture**. A sample table is in [references/worked-examples.md](references/worked-examples.md).

**Rules:**

- **A transition not in the table is a transition that must be rejected.** Write a clear "not allowed" row.
  What is forbidden is the hardest thing to test if nobody wrote it down.
- Every state needs an exit, except a final state that is meant to end.
- Side effects on other systems (email, stock, accounting) belong in this table, not hidden in the steps.

## 7 · Business rules separate from the steps

Each rule has a code, a name, the rule text, and a source. A sample BR-030 is in [references/worked-examples.md](references/worked-examples.md).

- **Write each rule in one place**, then cite it by code from everywhere it applies. If you copy it into three places, someday you will miss one when you change it.
- Every rule needs a **source**. A rule with no source is a rule the team made up.
- A rule that changes over time (tax rate, fee) must say **where it is stored**:
  in code, in a settings table, or editable by the system administrator.

## 8 · Errors and edge cases to answer in full

The edge-case table is what the test team will use, and it is what most FSDs lack. It runs from no data, rapid repeated clicks, and two people editing at once, to insufficient permission. Go through every row in [references/edge-cases.md](references/edge-cases.md) and answer every row that touches the feature.

## 9 · Codes and traceability

```
UC-<module>-<3-digit number>      use case              UC-ORD-010
SC-<module>-<3-digit number>      screen requirement    SC-ORD-020
BR-<3-digit number>               business rule         BR-030
```

Use the same system as `srs-writing`: **number in steps of 10**, and **never reuse a code that has been issued**.

| SRS | FSD | Screen | test case | Status |
|---|---|---|---|---|
| FR-ORD-040 | UC-ORD-010 | SC-ORD-020 | TC-ORD-010..014 | Done |
| FR-ORD-040 | UC-ORD-010 · 010-E1 | SC-ORD-020 | TC-ORD-015 | Done |

- **Every use case must trace back to a requirement in the SRS.** If it cannot, someone added a bonus nobody ordered.
- **Every requirement in the SRS must have at least one use case.** If it has none, it was forgotten.
- Alternatives and error cases need their own test cases. Do not count them with the main path.

## 10 · Figures in the document

The table of which section needs which figure type is in [references/figures.md](references/figures.md). The point to remember: a state diagram goes **with the table, not instead of it**.

Every figure in an FSD document (Mode A and Mode B, in markdown and in the file the customer signs off) uses `diagram-figures` in one house style. Screen sketches use `markdown-visuals`.
Mermaid through `software-diagrams` is only for drafts discussed in chat. Do not put it in a delivered document.
**Every figure in one version uses the same color theme**, per `doc-theme` (see `polished-document-style`).

## 11 · Completeness review before sending

**Completeness**

- [ ] Every requirement in the SRS has at least one use case
- [ ] Every use case has at least one alternative and one error case
- [ ] Every screen has a field table with all 5 columns, and the five states
- [ ] Everything that has a status has a state transition table, including the "not allowed" rows
- [ ] Every relevant row of the edge-case table in item 8 is answered

**Clarity**

- [ ] No phrase such as "as appropriate", "automatically", or "as needed" without saying what it means
- [ ] Every error message is written as real words, not "show a warning message"
- [ ] Every number has a unit and a source
- [ ] Field names, status names, and endpoint names are in English, matching what the real code will use

**Consistency**

- [ ] The same word means the same thing throughout (there is a glossary)
- [ ] State names match across the diagram, the table, and the use cases
- [ ] No new requirement that is missing from the SRS

> **Final test:** Have one developer who was not in the meeting read it.
> Every question they ask is one gap to fill before sending.

If nobody is free to read it, use a fresh agent that gets only the FSD file. Have it answer 8–10 questions that a developer and QA would ask (for example, "what happens on a duplicate booking?" and "which states can be reversed?"). Fix every answer that is wrong or says "I don't know" before sending. For the method and the Thai-specific questions (B.E. years · document number format), see [`../srs-writing/references/reader-test.md`](../srs-writing/references/reader-test.md).

**Once code exists, compare the FSD with the real code.** Do this when you review the FSD after a build or before taking over a fix.

- Go code by code through item 9. Search the code and tests for use case codes and screen names (`rg -n "UC-0[0-9]+" --glob '!**/node_modules/**' | head -50`). A code that appears nowhere in the code or tests is a gap. Answer whether it is not built yet or built under another name.
- Compare the 3 places that differ most often: field table (item 5) ↔ validation code · state transition table (item 6) ↔ the code that changes state (including "not allowed" rows) · error messages (item 8) ↔ strings in the code.
- Record each difference as a table `| spec:line | file:line | who is right |` and let a person decide. During the review, do not change the FSD to match the code, and do not change the code to match the FSD.


## reference: edge-cases.md

# Errors and edge cases to answer in full

The test team uses this table, and most FSDs lack it. Go through every row that touches the feature, then write the answers into section 9 of the document.

| Case | Question to answer |
|---|---|
| No data | What does the empty screen show? Is there a button that points to the next step? |
| Very large data | How many items per page? How are they sorted? Can the user search? |
| Rapid repeated clicks | How do you prevent duplicate work? (See idempotency key in `api-conventions`) |
| Two people edit at once | Who wins? What does the other person see? (See ETag in `api-conventions`) |
| Connection drops midway | Is the entered data lost? Does a retry create a duplicate? |
| Session timeout | Does the user get kicked out at once, or is their input kept? |
| Boundary values | 0 · negative values · today · last day of the month · leap year |
| Unusually long text | Does a 200-character name break the layout? |
| Thai text and special characters | Does sorting work? Does search find it? Do emoji break anything? |
| External system does not respond | How many seconds to wait? How many retries? What does the user see meanwhile? |
| Insufficient permission | Visible but not clickable, or not visible at all? **Choose one clearly.** |


## reference: figures.md

# Figures in an FSD document

This table says which figure type belongs in which FSD section. The drawing tool and the color theme are in `SKILL.md` item 10.

| Section | Figure to include |
|---|---|
| 3 Process overview | Flowchart of the work from start to finish |
| 4 Use cases with several parties | Sequence diagram |
| 5 Screens | Screen sketch with numbers pointing to the field table |
| 6 States | State diagram — **a companion to the table, not a replacement** |
| 8 Data | ER diagram of only the tables this module touches |


## reference: fsd-vs-srs.md

# How an FSD differs from an SRS

This table compares the two documents one dimension at a time. Use it when you must decide whether a piece of content belongs in the SRS or the FSD.

| | SRS | FSD |
|---|---|---|
| Question answered | What the system **must be able to do** | **How** the system does it |
| Main readers | Customer · executives · the person who signs off | developer · tester · ux |
| Level of detail | "The system must let users cancel an order" | Where the button sits · which statuses allow cancelling · who has permission · what confirms it · what message appears when cancelling is impossible · what the system does next |
| Changes | Need approval and affect the contract | Can change inside the team, as long as they still meet the same SRS item |
| Content unit | Requirement (`FR-…`) | Use case (`UC-…`) + screen requirement (`SC-…`) |
| Numbers | Come from the customer | Come from the SRS; never invent new ones |


## reference: outline-sections.md

# FSD sections and when you may skip them

This table sums up the question each FSD section answers. The full outline with fill-in hints is in [`../assets/fsd-outline.md`](../assets/fsd-outline.md).

| # | Section | Question it answers | Skippable? |
|---|---|---|---|
| 1 | Introduction · scope · references | What does this version cover? Which SRS items does it cite? | No |
| 2 | Users and permissions | Who can do what? | No |
| 3 | Process overview | How does the work flow from start to finish? | No |
| 4 | Individual use cases | How is each task done, step by step? | No |
| 5 | Screen requirements | What is on the screen? What does each field validate? | Skippable if there is no screen |
| 6 | State diagram | Which states can this item move between? | Skippable if there are no states |
| 7 | Business rules | Which rules are enforced? | No |
| 8 | Data and integrations | What data is used? Which systems connect? | No |
| 9 | Errors and edge cases | How can it fail, and what does the user see? | No |
| 10 | Traceability matrix | Which SRS item does this come from, and what tests it? | No |
| 11 | Revision history | Who changed what, and when? | No |


## reference: related-skills.md

# Links to other skills

If the task needs knowledge beyond the FSD, open the skill in the right-hand column alongside this one.

| Need | Use with |
|---|---|
| Requirement level the customer signs off | `srs-writing` |
| Markdown format and color theme of the document | `polished-document-style` |
| Look of the exported .docx file | `branded-document-design` |
| Figures in the document | `diagram-figures` (every figure in a delivered document) · `markdown-visuals` (screen sketches) · `software-diagrams` (Mermaid drafts for chat only) |
| API agreements the FSD refers to | `api-conventions` |
| Data model the FSD refers to | `database-design` |
| The five screen states and design rules | `ui-craft` + the platform skill |
| Turning use cases into test cases | `test-case-template` |
| Splitting into user stories at sprint start | `user-story-writer` |
| Cutting unneeded content from the document | `simplicity-first` |

**Document outline you can copy and fill in right away** → [`../assets/fsd-outline.md`](../assets/fsd-outline.md)


## reference: stakeholder-doc-templates.md

# Stakeholder document (Mode B) — style, diagrams, templates

**สารบัญ:** Document Structure · Formatting Rules (hierarchy · markers · callouts · tables · badges) · Diagrams · Templates: Use Case · API Endpoint · Data Model

Moved from the system-analyst agent. Read when writing a Mode B document. A Mode A use case follows `SKILL.md` §4 and [`worked-examples.md`](worked-examples.md); the templates below are the same content in reviewer-friendly form, never a different format.

Mode B is **the same FSD** as Mode A — the same 11 sections in the same order as `SKILL.md` §3 — styled for reviewers who sign off: a short summary up front, plain words, more tables, less code. It never adds or drops a section; only the style changes. Diagrams follow `SKILL.md` §10. IDs follow `SKILL.md` §9 (`UC-<module>-<3 digits>`, steps of 10).

## Document Structure

Every stakeholder doc MUST follow the 11 FSD sections (`SKILL.md` §3, full outline in [`assets/fsd-outline.md`](../assets/fsd-outline.md)):

````markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft | Review | Approved
> **Authors:** ... · **Reviewers:** ...

---

## Table of Contents

1. [Introduction](#1-introduction) — starts with a one-paragraph summary for non-technical readers
2. [Users & Permissions](#2-users--permissions)
3. [Process Overview](#3-process-overview)
4. [Use Cases](#4-use-cases)
5. [Screen Specifications](#5-screen-specifications)
6. [State Machines](#6-state-machines)
7. [Business Rules](#7-business-rules)
8. [Data & Integrations](#8-data--integrations) — API endpoints and data model go here
9. [Errors & Edge Cases](#9-errors--edge-cases)
10. [Traceability](#10-traceability)
11. [Revision History](#11-revision-history)

---

## 1. Introduction

> **For non-technical readers** — 1 paragraph explaining what this feature does and why.

### Scope

**In scope**
- ...

**Out of scope**
- ...

### Glossary
- ...

[... continue all 11 sections; skip 5 only if there are no screens and 6 only if nothing has a status ...]
````

## Formatting Rules

### Hierarchy & Numbering
- H1 = document title (only ONE)
- H2 = numbered sections (1., 2., 3.)
- H3 = sub-sections (1.1, 1.2)
- Always add TOC for docs with 5+ sections
- Use anchor links in TOC

### Visual Markers

No emoji or icons in headings, body, tables, labels or callouts (`human-writing` · `polished-document-style`). Use words:

| Need | Write |
|--------|---------|
| Yes / no in a table | ✓ / ✗ |
| Status | Draft · Approved · Pending · In Progress |
| Severity or priority | Critical · High · Medium · Low |
| Tip, warning, critical, note | Bold callout label (below) |

### Callout Boxes (Blockquotes)

```markdown
> **Tip:** Brief insight here.

> **Warning:** Important caveat.

> **Critical:** Must read before proceeding.

> **Note:** Additional context.
```

### Tables

Prefer tables over bullet lists when data has 2+ attributes:

```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✓ | User's email |
| age | number | ✗ | Optional |
```

Align headers to data when helpful:
```markdown
| Field | Type | Required |
|:------|:-----|:--------:|
```

### Status Badges (in tables/inline)

```markdown
**Status:** Approved
**Priority:** High
**Risk:** Medium
```

---

# Diagrams

Follow `SKILL.md` §10. A Mode B document is delivered to people who sign it, so every figure is a house-style figure made with `diagram-figures` (same theme for every figure in one document, per `doc-theme`). Mermaid through `software-diagrams` is only for a quick sketch in chat, never for the delivered file. Screen sketches use `markdown-visuals`.

## When to use which diagram

| Diagram | Use for | FSD section |
|---------|---------|---|
| Flowchart | Business processes, decision trees | 3 Process Overview |
| Sequence diagram | Interactions between systems/actors over time | 4 Use Cases (multi-party) |
| State diagram | Object lifecycle, status transitions — **next to the table, not instead of it** | 6 State Machines |
| ER diagram | Tables of this module only | 8 Data & Integrations |
| Timeline (Gantt) | Schedule, if the document has one | appendix |

Embed each figure as an image with a numbered caption, for example `![Figure 4-1 Place order — sequence](figures/uc-ord-010-sequence.svg)`.

---

# Templates

## Use Case Template (Mode B)

````markdown
### UC-ORD-010: <Use Case Name>

| Field | Value |
|-------|-------|
| **ID** | UC-ORD-010 (next use case in this module: UC-ORD-020) |
| **From (SRS)** | FR-ORD-040 |
| **Actor** | Customer |
| **Priority** | High |
| **Status** | Approved |
| **Trigger** | User clicks "Place Order" |
| **Frequency** | ~200 per day `(รอยืนยัน)` |

#### Preconditions
- User is authenticated
- Cart contains at least 1 item

#### Postconditions
- Order created with status `pending`
- Inventory reserved
- Confirmation email sent

#### Main Flow

| Step | Actor | Action | System Response |
|:----:|:------|:-------|:----------------|
| 1 | User | Reviews cart and clicks "Place Order" | Shows order summary |
| 2 | User | Confirms payment method | Validates payment info |
| 3 | System | Submits payment to gateway | Receives auth code |
| 4 | System | Creates order record | Returns order #ORD-XXXX |
| 5 | System | Sends confirmation email | — |
| 6 | User | Sees confirmation page | — |

#### Alternative Flows

> **010-A1: Payment declined at step 3**
> 3a. Gateway returns decline
> 3b. System shows error, suggests alternate payment
> 3c. Returns to step 2

#### Exception Flows

> **010-E1: Gateway timeout at step 3**
> 3a. System waits 30s
> 3b. Logs incident, marks order as `payment_pending`
> 3c. Sends "We'll retry" email to user

#### Sequence Diagram

![Figure 4-1 UC-ORD-010 Place order — Customer, UI, API, Payment Gateway, Database](figures/uc-ord-010-sequence.svg)

> Drawn with `diagram-figures` (house style). Steps: Customer clicks "Place Order" → UI sends POST /orders → API charges the gateway → gateway returns auth code → API inserts the order → UI shows the confirmation page.
````

## API Endpoint Template (Mode B)

````markdown
### POST `/api/v1/orders`

> Create a new order from cart contents.

| Attribute | Value |
|-----------|-------|
| **Auth Required** | Yes (Bearer token) |
| **Rate Limit** | 10 req/min per user |
| **Idempotent** | Yes (use `Idempotency-Key` header) |

#### Request Headers

| Header | Required | Example |
|--------|:--------:|---------|
| `Authorization` | ✓ | `Bearer eyJ...` |
| `Idempotency-Key` | Recommended | `unique-request-id` |
| `Content-Type` | ✓ | `application/json` |

#### Request Body

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "shipping_address_id": "uuid",
  "payment_method_id": "uuid"
}
```

#### Response: 201 Created

```json
{
  "data": {
    "id": "ORD-12345",
    "status": "pending",
    "total": 1250.00,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

Every error body is `application/problem+json` (RFC 9457): `type` · `title` · `status` · `detail` · `requestId`, plus `errors[]` for validation. Shape and status rules: `web-service-essentials` §2.

| Code | When | `type` (suffix) |
|:----:|:-----|:-----|
| 401 | Missing/invalid token | `unauthorized` |
| 402 | Payment declined | `payment-declined` |
| 409 | Inventory unavailable | `out-of-stock` |
| 422 | Validation failed | `validation` + `errors[]` (`field` · `code` · `message`) |
| 429 | Rate limit exceeded | `rate-limited` + `Retry-After` header |
````

## Data Model Template (Mode B)

````markdown
## 8. Data & Integrations

### Entity Relationship Diagram

![Figure 8-1 Order module — USER places ORDER, ORDER contains ORDER_ITEM](figures/order-er.svg)

> Drawn with `diagram-figures` (house style), tables of this module only.

### Tables

#### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation |

> **Security:** `email` is encrypted at rest using AES-256.
````

---


## reference: worked-examples.md

# Full examples of a use case, screen, state diagram, and business rule

Every example in this file follows one story: cancelling an order. Copy the format and use it right away. The rules for each format are in `SKILL.md`. The Thai text inside the code blocks is sample output for a Thai FSD, so it stays in Thai.

## Use case (item 4)

```markdown
### UC-ORD-010 · ยกเลิกคำสั่งซื้อ

| | |
|---|---|
| **มาจาก** | FR-ORD-040 |
| **ผู้ทำ** | ลูกค้า · เจ้าหน้าที่ฝ่ายขาย |
| **เงื่อนไขก่อนเริ่ม** | เข้าสู่ระบบแล้ว · คำสั่งซื้ออยู่ในสถานะ `confirmed` |
| **ผลเมื่อสำเร็จ** | คำสั่งซื้อเป็น `cancelled` · คืนจำนวนสินค้าเข้าคลัง · ส่งอีเมลแจ้ง |
| **ความถี่** | ประมาณ 30 ครั้งต่อวัน |

**ขั้นตอนหลัก**

| # | ผู้ทำ | การกระทำ | ระบบทำอะไรต่อ |
|:--:|---|---|---|
| 1 | ลูกค้า | เปิดหน้ารายละเอียดคำสั่งซื้อ | แสดงปุ่ม "ยกเลิก" เฉพาะเมื่อ BR-030 ผ่าน |
| 2 | ลูกค้า | กด "ยกเลิก" | เปิดกล่องยืนยัน พร้อมช่องเหตุผล (บังคับ) |
| 3 | ลูกค้า | เลือกเหตุผล แล้วกดยืนยัน | ตรวจ BR-030 อีกครั้งที่ฝั่งเซิร์ฟเวอร์ |
| 4 | ระบบ | — | เปลี่ยนสถานะ · คืนสต็อก · บันทึกผู้ทำและเวลา · ส่งอีเมล |
| 5 | ระบบ | — | แสดงข้อความสำเร็จ และปุ่มยกเลิกหายไป |

**ทางเลือกอื่น**

| รหัส | แยกที่ขั้น | เงื่อนไข | ผลลัพธ์ |
|---|:--:|---|---|
| 010-A1 | 3 | ผู้ทำเป็นเจ้าหน้าที่ | ข้ามช่องเหตุผล แต่บังคับกรอกหมายเหตุภายใน |

**กรณีผิดพลาด**

| รหัส | เกิดที่ขั้น | สาเหตุ | ผู้ใช้เห็นอะไร | ระบบทำอะไร |
|---|:--:|---|---|---|
| 010-E1 | 3 | มีคนเปลี่ยนสถานะไปก่อนแล้ว | "คำสั่งซื้อนี้ถูกจัดส่งแล้ว ยกเลิกไม่ได้" | ไม่เปลี่ยนอะไร · โหลดหน้าใหม่ |
| 010-E2 | 4 | คืนสต็อกไม่สำเร็จ | "ระบบขัดข้อง กรุณาลองใหม่" + รหัสอ้างอิง | ย้อนกลับทั้งรายการ · บันทึก log ระดับ error |
```

## Screen requirement (item 5)

```markdown
### SC-ORD-020 · หน้ารายละเอียดคำสั่งซื้อ

**เส้นทาง:** `/orders/{id}` · **ใช้ใน:** UC-ORD-010, UC-ORD-020

| ฟิลด์ | ชนิด | บังคับ | กฎตรวจ | ข้อความเมื่อไม่ผ่าน | ค่าเริ่มต้น |
|---|---|:--:|---|---|---|
| เหตุผลที่ยกเลิก | เลือกจากรายการ | ลูกค้า ✓ · เจ้าหน้าที่ ✗ (010-A1) | ต้องเป็นค่าในรายการ BR-031 | "กรุณาเลือกเหตุผล" | — |
| หมายเหตุภายใน | ข้อความยาว | เจ้าหน้าที่ ✓ · ลูกค้าไม่เห็นช่องนี้ | ไม่เกิน 500 ตัวอักษร | "กรุณากรอกหมายเหตุ" · "หมายเหตุยาวเกิน 500 ตัวอักษร" | ว่าง |
```

## State transition table (item 6)

| From | To | Who can do it | Condition | Side effects |
|---|---|---|---|---|
| `draft` | `confirmed` | Customer | At least 1 item · complete address | Deduct stock · send email |
| `confirmed` | `cancelled` | Customer · staff | BR-030 | Return stock · send email |
| `confirmed` | `shipped` | Warehouse staff | Has a tracking number | Send SMS |
| `shipped` | `cancelled` | — | **Not allowed** | — |

## Business rules (item 7)

```markdown
**BR-030 · ยกเลิกคำสั่งซื้อได้เมื่อไหร่**
ยกเลิกได้เมื่อสถานะเป็น `confirmed` และยังไม่เกิน 24 ชั่วโมงนับจากเวลายืนยัน
เจ้าหน้าที่ระดับหัวหน้าขึ้นไปยกเลิกได้โดยไม่จำกัดเวลา แต่ต้องกรอกหมายเหตุ
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.2

**BR-031 · เหตุผลที่ลูกค้าเลือกได้ตอนยกเลิก**
สั่งผิดรายการ · ได้ราคาที่ถูกกว่า · รอนานเกินไป · ไม่ต้องการแล้ว · อื่น ๆ
ผู้ดูแลระบบแก้รายการนี้ได้ในหน้าตั้งค่า โดยไม่ต้องแก้โค้ด
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.3 `(รอยืนยัน)`
```


---

# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

> **One rule:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone.

## Use when
- Any work handed to people (code, documents, plans, designs, slides, tables, answers) may hold more than the task needs.
- `human-writing` controls how it is written; this skill controls what the work contains.

Not for: Claude Code's own `/simplify` command · more detail on code and architecture (if installed) → `lazy-coding` · `readable-code` · `simplicity-first` in plugin `software-development`.

## Steps
1. Climb the ladder and stop at the first step that works: (a) is this really needed? If not, do not do it and say in 1 line what you skipped; (b) is there an existing thing that works (file, template, function, tool, built-in feature)? Use it; (c) do the shortest version that is still complete and correct.
2. Do only what the task needs; cut before adding (if removing a part loses neither meaning nor function, cut it); plain things people know beat clever things that need decoding.
3. Apply by kind of work:
   - **Code:** names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say why · follow the project's style. Avoid an abstraction with one user, clever hard-to-read shortcuts, one big file, a pile-up `utils/`, a new dependency for a few lines.
   - **Documents · reports:** conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for compared data. Avoid repeats, empty headings, unknown terms.
   - **Plans · procedures:** 3–5 key items, each with an owner and a way to measure done · fewest steps that work. Avoid a 20-item list with no priority.
   - **Designs · slides · figures:** 1 page 1 point · shortest path to the user's goal · familiar patterns. Avoid cramming and decoration that does not help.
   - **Tables · data:** only columns used to decide · short formulas. Avoid columns that repeat a meaning and long nested formulas.
   - **Answers:** answer first, as long as the question needs.
4. **Simple is not sloppy:** never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly. **Simple is not one big pile:** keep clear separation of duties, 1 part doing 1 thing.
5. When you take a deliberate shortcut, write how far it works and when it changes, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process`, and put 1 line in the report: `ข้าม: X — เพิ่มเมื่อ Y`.

## Check before done
- [ ] An outsider can open it for the first time and understand within 30 seconds.
- [ ] No part, step or layer can be cut with no loss.
- [ ] Every added part has a reason it is needed now, not "just in case".
- [ ] Still complete on correctness, safety and what the user asked for.
- [ ] Duties still clearly separated, not squashed into one place to look short.


---

# skill: stack-dotnet

Use when writing or fixing C# and .NET code

# stack-dotnet — write C# that builds clean, passes tests, and avoids the usual traps

Use whenever the work touches C# code of any kind: ASP.NET Core (Web API · Model-View-Controller (MVC) · minimal API) · Entity Framework (EF) Core · ASP.NET MVC 5 on .NET Framework 4.x that is still maintained.

---

## 1 · Start: read the version first, then run the same commands every time

- Find the Software Development Kit (SDK) version in `global.json`, and the target version in `<TargetFramework>` in `*.csproj` or `Directory.Build.props`.
- Versions (last checked 2026-10-14 · source: https://dotnet.microsoft.com/platform/support/policy/dotnet-core): `net10.0` is the latest Long Term Support (LTS) release, supported until 2028-11-14 · `net8.0` (LTS) and `net9.0` (Standard Term Support, STS) are near the end, supported until 2026-11-10 · if you meet these 2, tell the owner and do not upgrade on your own mid-task · recheck this page before relying on it.
- If you find `net48` or `v4.x` in `<TargetFrameworkVersion>`, it is .NET Framework, so use the legacy commands below.

| Step | .NET (Core) 8+ | .NET Framework 4.x (Windows) |
|---|---|---|
| Restore packages | `dotnet restore` | `msbuild App.sln -t:restore` or `nuget restore App.sln` |
| build | `dotnet build -warnaserror` (or per the repo's policy) | `msbuild App.sln -p:Configuration=Release` |
| Run all tests | `dotnet test` | `vstest.console.exe Tests/bin/Release/App.Tests.dll` |
| Format | `dotnet format --verify-no-changes` | Per `.editorconfig` in Visual Studio |

Run a single test:

```bash
dotnet test --filter "FullyQualifiedName~OrderServiceTests.Cancel"   # VSTest (default)
dotnet test --filter-method "*Cancel_*"                               # xUnit v3 on Microsoft Testing Platform (MTP)
vstest.console.exe App.Tests.dll /TestCaseFilter:"FullyQualifiedName~Cancel"   # .NET Framework
```

- A full test run prints a long log. Append `2>&1 | tail -40` to see only the summary and the failed tests.
- If the repo sets MTP in `global.json` (`"test": { "runner": "Microsoft.Testing.Platform" }`), use the `--filter-*` form on the 2nd line.
- `msbuild` and `vstest.console.exe` live in Visual Studio or Build Tools. Open them through Developer PowerShell. A Linux machine cannot build a .NET Framework web project, so say plainly that it has not been built.

## 2 · Structure and patterns

Set this once in `Directory.Build.props` for every project in the solution:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

- If an old repo has hundreds of warnings, do not switch on `TreatWarningsAsErrors` for the whole solution in one task. Turn it on only for new projects, and add no new warnings.
- Organise folders by feature (`Features/Orders/...`) per `readable-code`, but if the repo already uses `Controllers/ Services/`, follow the existing layout.
- Use file-scoped namespaces (`namespace App.Orders;`), make Data Transfer Objects (DTO) a `record`, and never return an EF entity straight out of an API.
- Async all the way: a method that waits on I/O takes `CancellationToken ct` and passes it down every layer to EF and `HttpClient`.
- Choose minimal API or controllers to match what the repo uses. Do not mix them within one feature.

Service lifetimes in Dependency Injection (DI):

| Lifetime | Use for | Never |
|---|---|---|
| Singleton | Stateless things · caches · `TimeProvider` | Take a Scoped service in the constructor (`DbContext` would live across requests) |
| Scoped | `DbContext` · services that use per-request data | Call it from a `BackgroundService` directly (use `IServiceScopeFactory.CreateScope()` instead) |
| Transient | Light, stateless things | Hold a resource that needs disposing and hand it to a singleton |

Use the options pattern for config values, and validate them at app start:

```csharp
builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration("Smtp")
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

An outcome that is "unsuccessful but expected" (not found · duplicate · out of stock) is returned as a value (a `Result<T>` record with `IsSuccess`, `Value`, `Error`, `Code`), not thrown. Keep exceptions for what the code does not expect. Use one code → status mapping for the whole system, then emit `ProblemDetails`. If the repo already has `FluentResults` or `ErrorOr`, use that one and do not add a second record on top. Code: [`references/patterns.md`](references/patterns.md).

**4 checks for a new type**: (1) hide the internals: use a `record` whose constructor is `private` and give it a `Create` factory (2) the rules live in the type, so an invalid value cannot be built (3) validate once, in the constructor or factory (4) expose no setter: use `init` or a `readonly record struct`

## 3 · EF Core

| Topic | Do this |
|---|---|
| Read-only | `AsNoTracking()` · fetch only the columns you use with `Select(o => new OrderDto(...))` |
| N+1 | Never loop and query inside the loop. Use `Include` or a projection. If you `Include` several collections, add `AsSplitQuery()` |
| Update or delete many rows | Use `ExecuteUpdateAsync` / `ExecuteDeleteAsync`, do not load and edit one by one, but note these commands bypass the change tracker |
| migration | Read the SQL every time: `dotnet ef migrations script --idempotent -o migrate.sql` |
| production | Never `EnsureCreated()`, and never `Database.Migrate()` at app start when several instances start together. Run the script at deploy time instead |
| Concurrent edits | Use `[Timestamp] byte[] RowVersion` (SQL Server) or `IsConcurrencyToken()`, then catch `DbUpdateConcurrencyException` to tell the user |
| Time | Always store UTC, and PostgreSQL (Npgsql) requires `DateTimeKind.Utc` for `timestamptz` |

Look at the SQL EF really generates before handing over:

```csharp
var sql = db.Orders.Where(o => o.Status == Status.Open).ToQueryString();
// or in Development
options.LogTo(Console.WriteLine, LogLevel.Information).EnableSensitiveDataLogging();
```

Use `EnableSensitiveDataLogging` on dev machines only. For schema and indexes, follow `database-design`.

## 4 · Common traps

| Trap | What happens | Do this instead |
|---|---|---|
| `async void` | An exception crashes the process and cannot be caught | Use `async Task`, except for UI event handlers |
| `.Result` · `.Wait()` · `GetAwaiter().GetResult()` | MVC 5 deadlocks · Core eats threads until the app slows | Use `async Task<ActionResult>` all the way, and `ConfigureAwait(false)` in libraries |
| `new HttpClient()` every time | Sockets run out and DNS never refreshes | Use `IHttpClientFactory` or a typed client; on .NET Framework use `static readonly HttpClient` |
| Forgetting to dispose | Connections and files stay open | `using var` · `await using` for `IAsyncDisposable` |
| Building SQL by string concatenation | SQL injection | LINQ · `FromSql($"...{id}")` (it parameterises for you) · Dapper with `new { id }` · never `FromSqlRaw` with a string you built |
| Parsing or formatting with the machine's culture | A `th-TH` machine uses the Buddhist calendar, so the year comes out as 2569 and parsing "2026-01-05" gives a year wrong by 543 | Store and parse with `CultureInfo.InvariantCulture` · show Buddhist Era years only when displaying, per `i18n-and-locale` |
| Money as `double` | 0.1 + 0.2 ≠ 0.3 | Use `decimal` and state the column as `decimal(18,2)` explicitly |
| `DateTime.Now` | Cannot be tested, and time drifts with the server | Use `TimeProvider` through DI and `FakeTimeProvider` in tests |
| Thai time | The server runs in UTC | `TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok")`; on .NET Framework on Windows use `"SE Asia Standard Time"` |
| An array or string ≥ 85,000 bytes | Lands on the Large Object Heap (LOH) and burdens the memory garbage collector (GC) | Stream the data · `ArrayPool<T>` · `IAsyncEnumerable<T>` for long lists |
| `$"..."` in a log call | Cannot search by field, and builds the string even when the log level is off | Message template: `log.LogInformation("Order {OrderId} paid", id)`; for other formats see `logging-standards` |

For where to catch exceptions and how to retry, see `error-handling-patterns`. In ASP.NET Core, use `IExceptionHandler` + `AddProblemDetails()` in one place.

## 5 · Tests

- Use the framework the repo already has. For a new project use xUnit (v3 for .NET 8+), per `testing-standards`.
- FluentAssertions from v8 onward needs a paid licence for commercial use, while v7 is still free (Apache 2.0). In a new project use xUnit's asserts or AwesomeAssertions (a free fork). If the repo already uses v8, ask the owner about the licence.
- Test names: `Method_Condition_Result`, for example `Cancel_WhenAlreadyShipped_Throws`
- For new logic or a bug, write a failing test first, then fix it until green, and a bug needs a test that reproduces the real symptom.
- Test a whole API path with `WebApplicationFactory<Program>`. If the test cannot see `Program`, add `public partial class Program;`.
- For a real database use Testcontainers (`Testcontainers.MsSql` · `Testcontainers.PostgreSql`). Never use EF InMemory in place of a real database, because it does not check constraints and translates SQL differently.

For the full xUnit setup and a `WebApplicationFactory` example, see [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#net--xunit)

## 6 · .NET-specific security

| Topic | ASP.NET Core | MVC 5 (.NET Framework) |
|---|---|---|
| Cross-Site Request Forgery (CSRF) | For MVC add `AutoValidateAntiforgeryToken` as a global filter; Razor Pages check it themselves | `@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]` on every POST |
| Login required by default | Set `FallbackPolicy` to `RequireAuthenticatedUser()`, then add `[AllowAnonymous]` one place at a time on pages open to everyone | `GlobalFilters.Filters.Add(new AuthorizeAttribute())` |
| Extra fields posted (over-posting) | Bind into a DTO that holds only the editable fields | Use a separate view model, never bind the entity directly |
| Output | Razor encodes for you, but never use `Html.Raw` on user data | The same, and beware `MvcHtmlString` |
| Data Protection keys | With several instances or containers, keep the keys in one shared place (`PersistKeysToDbContext` or a file share), or cookies break on every restart | The same `machineKey` in `web.config` on every machine |
| secret | dev: `dotnet user-secrets set "Db:Password" "..."` · prod: environment variable or secret store | Keep a separate `web.config` transform and never commit real values |

- A committed `appsettings.json` or `web.config` must not hold passwords, real connection strings or API keys. For storing secrets, see `config-and-secrets`.
- For input validation · uploads · encryption, see `principle-secure-by-default`.

## 7 · Check before sending

- [ ] `dotnet build -warnaserror` gives 0 warnings (or, in an old repo, adds no warnings over before)
- [ ] `dotnet test` all pass, and the report says how many passed out of how many (long output → `> _to_delete/test.txt 2>&1`, then `tail -20`)
- [ ] `dotnet format --verify-no-changes` finds nothing to fix
- [ ] New behaviour has a test that was red before the fix
- [ ] No new `.Result` · `.Wait()` · `async void`: `grep -rnE "\.Result\b|\.Wait\(\)|async void" --include=*.cs`
- [ ] For any query you changed, you looked at the real SQL and there is no N+1
- [ ] The migration has an `--idempotent` script, you read it, and it has no unintended `DROP`
- [ ] If you cannot build .NET Framework on this machine, write in the report that it was not built. Do not say it passed.

## References

- [`references/patterns.md`](references/patterns.md) — open when writing a `Result<T>` or a validated value type (Thai national ID example, not compiled)


## reference: patterns.md

# C# patterns · stack-dotnet

## Result<T> for expected failures

```csharp
public sealed record Result<T>(bool IsSuccess, T? Value, string? Error, string? Code)
{
    public static Result<T> Ok(T value) => new(true, value, null, null);
    public static Result<T> Fail(string error, string? code = null) => new(false, default, error, code);
}

// service
return stock < qty ? Result<Order>.Fail("สต็อกไม่พอ", "OUT_OF_STOCK") : Result<Order>.Ok(order);

// endpoint — one code → status mapping for the whole system, then emit ProblemDetails
return r.IsSuccess ? Results.Ok(r.Value) : Results.Problem(r.Error, statusCode: r.Code switch { "NOT_FOUND" => 404, "OUT_OF_STOCK" => 409, _ => 400 });
```

## Value type with private constructor (Thai national ID)

```csharp
// Thai national ID: 13 digits + check digit · money in satang (long), never double
public readonly record struct ThaiNationalId
{
    public string Value { get; }
    private ThaiNationalId(string v) => Value = v;
    public static ThaiNationalId? Create(string s)
    {
        if (s.Length != 13 || !s.All(char.IsAsciiDigit)) return null;
        var sum = s.Take(12).Select((c, i) => (c - '0') * (13 - i)).Sum();
        return (11 - sum % 11) % 10 == s[12] - '0' ? new ThaiNationalId(s) : null;
    }
}
```
(This C# example has not been compiled · the check-digit formula is the same as in the TypeScript example that has been run)


---

# skill: stack-typescript

Use when writing or reviewing TypeScript code

# stack-typescript — TypeScript the team can read easily and that is hard to break

> **One rule:** let the compiler catch bugs instead of people. `tsc` passing with 0 errors does not mean done, but failing means not started.

## Use when
- Writing or reviewing TypeScript in a Node backend (Express · Fastify · NestJS), Angular, or React/Vite code.

Not for: least code → `lazy-coding` · names and layout → `readable-code` · types and data shape before writing → `principle-data-shape-first` · browser tests → `e2e-testing-patterns` · screens and tokens → `web-app-design`

## Steps
1. Look at the repo before the first command. Use the package manager its lockfile shows (`package-lock.json` · `pnpm-lock.yaml` · `yarn.lock`), never 2 lockfiles. Follow `.nvmrc` or `engines` for Node; if absent use the latest Long Term Support (LTS), re-checking https://nodejs.org/en/about/previous-releases first (dated notes: `references/sources.md`). Follow the existing module system (`"type"` · `tsconfig` `module`), never mix ESM and CJS. Use an existing `package.json` script before guessing a command.
2. Install and verify with the repo's commands: `npm ci` (pnpm `install --frozen-lockfile` · yarn `install --immutable`) · `npx tsc --noEmit` · `npm run lint && npm test && npm run build 2>&1 | tail -40` · one test: `npx vitest run <file> -t "<name>"`. Angular: `ng test --include=...` and check the bundle size at the end of `ng build`. `npm install <pkg>` changes the lockfile, so commit it in the same round.
3. Write strict TypeScript. Instead of `any` use `unknown` then narrow (`typeof` · `in` · a type guard). Instead of `value!` to silence an error, check `if (!value) throw …` or fix the source type. Instead of `as Order` on outside data, parse with zod (or the repo's library). Instead of several booleans for a state, use a discriminated union. Instead of `const x: Config = {...}` that loses the literal, use `satisfies Config`.
4. Set `tsconfig` `"strict": true` · `noUncheckedIndexedAccess` · `noImplicitOverride`. If an old repo has strict off, turn it on one folder at a time, not for the whole repo in one task. For `enum` vs string union follow the repo; a new repo uses `as const` + union. Keep API types shared by frontend and backend in one place.
5. For types standing for a national ID number, an amount of money or a document number, apply 4 checks: hide the internals (one `parse` function creates values) · put the rules in the type (a rule-breaking value cannot be created) · validate once at the entrance · expose nothing mutable (`readonly` fields, never return an internal array). Examples: `references/examples.md`.
6. Node backend: turn on `@typescript-eslint/no-floating-promises` and `no-misused-promises`; every `async` is `await`ed or has a `.catch` that does something real. Express 4 does not forward `async` handler errors: use Express 5 or wrap (Fastify and NestJS handle it). Parse `process.env` with a schema once at startup and refuse to start on a bad value (`config-and-secrets`). Shut down cleanly: on `SIGTERM` stop accepting requests → wait for pending → close the DB pool, with a force-exit timer (code in `references/examples.md`). Use `stream.pipeline` for large files, never `readFile` them whole. No `fs.*Sync` · heavy `crypto.*Sync` · big loops in a request path. Use parameterized queries (`$1` · `?`) or an ORM, never string-concatenated SQL. Use structured logs per `logging-standards`, no `console.log` in a server.
7. Angular: standalone components · `inject()` · `signal`/`computed`/`input()`/`output()` · `OnPush` · `@if`/`@for (x of xs; track x.id)` · lazy routes · `async` pipe/`toSignal`/`takeUntilDestroyed()`. No new NgModule, no `*ngIf`/`*ngFor`, no `BehaviorSubject` state inside a component, no `subscribe` without unsubscribing. Keep logic in `computed`, never call a heavy function in a binding. Never use `DomSanitizer.bypassSecurityTrust*` on user data (if truly needed, comment why it is safe). In an old repo (v14–19) follow its style and do not migrate inside a feature task; propose migration separately. Full table, React/Vite notes and v22 facts: `references/angular.md`. For speed work on a React or Next.js repo read Vercel `react-best-practices` live (link in `references/angular.md`); on a conflict with step 3, follow this skill.
8. Avoid the common traps (time zone: store ISO 8601 UTC · money: integer satang · `===` · no shared-object mutation · cancel subscriptions · narrow imports · `Intl.Collator('th')` for Thai sorting · schema-parse `JSON.parse` at the edge): `references/traps.md`.
9. Test with the framework the repo has (Vitest and Angular examples: [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#node--typescript--vitest)). HTTP API: `supertest` (Express · NestJS) or `fastify.inject()`, no real port. Angular v21+ CLI uses Vitest, not Karma. For new logic or a bug fix, write a red test first, then fix to green. A snapshot alone is not a test; assert the values that matter. Read a signal directly (`component.unpaid()`); skip `fakeAsync` if nothing is really async.
10. Security: before installing a new package check spelling (typosquat) · download count · maintainer · latest release date, and for an internal scope set the registry in `.npmrc`. Run `npm audit --omit=dev`; commit the lockfile and use `npm ci` in CI. Never use `innerHTML` · `[innerHTML]` · `dangerouslySetInnerHTML` with user data. Cookie login sets `HttpOnly` · `Secure` · `SameSite` and guards against Cross-Site Request Forgery (CSRF: token or `withXsrfConfiguration`). Cross-Origin Resource Sharing (CORS): list origins one by one, never `*` with `credentials`. No secrets in the frontend (`environment.ts` and `VITE_*` are readable by everyone). Security headers: `helmet` · `@fastify/helmet`.

## Check before done
- `tsc --noEmit` 0 errors · lint 0 warnings in the changed files
- The whole test suite passes, and new behaviour has a test that was red before the fix
- No `any` · `as` on external data · new `!` in the diff
- No floating promise and no subscription left uncancelled
- Frontend: bundle size compared before and after; if it grew more than 20 KB (gzip), give the reason in the report
- If the lockfile changed, the new packages were checked per step 10

## References
- [`references/examples.md`](references/examples.md) — open for zod/union code, the branded ID type and the shutdown handler
- [`references/angular.md`](references/angular.md) — open for an Angular or React/Vite task (full do/do-not table, v22 facts)
- [`references/traps.md`](references/traps.md) — open when touching dates, money, equality, shared state, imports or sorting
- [`references/sources.md`](references/sources.md) — dated sources (Node LTS status to re-check)
- Also: `principle-secure-by-default` · `error-handling-patterns` · `i18n-and-locale` (Thai dates, Buddhist Era)


## reference: angular.md

# Angular and React notes · stack-typescript

Open when the repo is Angular (or React/Vite/Next.js) and you write or review components, state, forms, HTTP or routes.

The latest is v22 (released 3 Jun 2026 · source: https://angular.dev/reference/releases · checked 22 Oct 2026): new apps are zoneless and `OnPush` is the default, and Signal Forms are production-ready (these last 3 points (รอยืนยัน) — the source page does not state them; check the v22 release notes before citing).

| Topic | Do this | Do not |
|---|---|---|
| component | standalone · `inject()` | create a new NgModule |
| state | `signal` · `computed` · `input()` · `output()` | `BehaviorSubject` for state inside a component |
| change detection | `OnPush` (default in v22) | `Default`/`Eager` without a reason |
| template | `@if` · `@for (x of xs; track x.id)` · `@switch` | `*ngIf` · `*ngFor` (deprecated since v20) |
| form | Signal Forms (v22); an existing repo uses typed reactive forms | `UntypedFormGroup` |
| HTTP | `HttpClient` + functional interceptor (`withInterceptors`) | add the token header one place at a time |
| subscription | `async` pipe · `toSignal` · `takeUntilDestroyed()` | `subscribe` and never unsubscribe |
| route | lazy `loadComponent` · `loadChildren` | import every page in the root route |

- Move logic out of templates into `computed` so a template only displays, and never call a heavy function in a binding.
- Never use `DomSanitizer.bypassSecurityTrust*` on data sent by users. If it is truly needed, comment why it is safe.
- **Old repo (v14–19)**: write in the style the repo already uses, use new features only where that version supports them, and do not migrate the whole repo inside a feature task. If you want to migrate, propose it as a separate task, then use `ng generate @angular/core:control-flow` and Angular's other schematics.
- React or Vite: keep state in the component first · `useEffect` needs a cleanup · list keys are ids, not indexes · client-side env may use only `VITE_*`, and treat it as visible to everyone.
- For a React or Next.js repo where speed must be chased (repeated renders · bundle · waterfall data fetching), pull the rules from Vercel `react-best-practices` and read them live while working: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices — a link only, no rules copied here, because that repo's licence has not been checked (checked 23 Oct 2026) · a rule that conflicts with item 2 of this skill (strict TS): follow ours.

```ts
export class OrderList {
  private orders = toSignal(inject(OrderApi).list(), { initialValue: [] });
  readonly unpaid = computed(() => this.orders().filter(o => o.status === 'unpaid'));
}
// <ul>@for (o of unpaid(); track o.id) { <li>{{ o.id }}</li> } @empty { <li>ไม่มีรายการค้างจ่าย</li> }</ul>
```


## reference: examples.md

# Code examples and new-type checks · stack-typescript

Open when writing a zod parse, a discriminated union, a branded type for IDs or money, or the graceful-shutdown handler.

## Parse and union

```ts
const Order = z.object({ id: z.uuid(), totalSatang: z.number().int().nonnegative() });
type Order = z.infer<typeof Order>;

type PayResult =
  | { status: 'paid'; receiptId: string }
  | { status: 'failed'; reason: 'declined' | 'timeout' };
// switch (r.status) ครบทุกกรณี · default: const _never: never = r;
```

**4 new-type checks** (idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10). Apply them to types that stand for a national ID number, an amount of money, a document number:

1. **Hide the internals** — users of the type create a value in only one way (a `parse` function) and never edit fields directly.
2. **The rules live in the type** — a value that breaks the rules cannot be created; the rules are not written only in a document.
3. **Check at the entrance** — validate once at creation, and then the whole system can trust the type.
4. **Expose nothing mutable** — `readonly` on every field, and never return an internal array for others to change.

```ts
type ThaiNationalId = string & { readonly __brand: 'ThaiNationalId' };  // 13 หลัก + ตรวจเลขท้าย
const checkDigit = (d: string) => (11 - (d.slice(0, 12).split('').reduce((s, c, i) => s + Number(c) * (13 - i), 0) % 11)) % 10;
const parseNationalId = (s: string): ThaiNationalId | null =>
  /^\d{13}$/.test(s) && checkDigit(s) === Number(s[12]) ? (s as ThaiNationalId) : null;
// จำนวนเงินเก็บเป็นสตางค์ (number เต็ม) ไม่ใช้ float · ตัวอย่างเลข 1234567890121 สร้างขึ้นเอง ไม่ใช่เลขของใคร
```

## Graceful shutdown

```ts
const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(async () => { await db.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
});
```


## reference: sources.md

# Sources · stack-typescript

- Node LTS · https://nodejs.org/en/about/previous-releases · last checked 2026-10-14: LTS is 24 and 22 · 26 is still Current, so do not use it in production until this page lists it as LTS · the next one to expire is 22 (2027-04-30 (รอยืนยัน)) · re-check this page before use · Node 26 will probably become LTS in late Oct 2026 (รอยืนยัน); re-check this line right after that date
- Angular releases · https://angular.dev/reference/releases · checked 22 Oct 2026 (v22 released 3 Jun 2026)
- 4 new-type checks · idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10
- Vercel react-best-practices · https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices · licence not checked (checked 23 Oct 2026) · link only, no rules copied


## reference: traps.md

# Common traps · stack-typescript

Open when the code touches dates and time zones, money, equality, shared objects, subscriptions, large imports, sorting Thai names or JSON parsing.

| Trap | Symptom | Do this |
|---|---|---|
| time and time zone | the date goes back 1 day between 00:00–06:59 Thai time | store and send ISO 8601 in UTC, then display with `Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok' })`; for the Buddhist Era year see `i18n-and-locale` |
| money | `0.1 + 0.2 !== 0.3` | store as satang (integer); for tax or currency conversion use the decimal library the repo uses |
| `==` | `'0' == false` is true | always use `===` and turn on eslint `eqeqeq` |
| mutating a shared object | values change by themselves across pages | create a new one with spread · `structuredClone` · `readonly` in the type |
| memory leak | RAM keeps growing | cancel subscriptions · `removeEventListener` · `clearInterval`, and caches need a cap |
| big imports | bundle bloats by hundreds of KB | `import { debounce } from 'lodash-es'`, not all of lodash, and check the bundle after the build |
| sorting Thai names | leading vowels sort wrong | use `new Intl.Collator('th').compare`, not bare `localeCompare` |
| `JSON.parse` without checks | crash deep in the code | parse with a schema at the system edge (item 2) |
