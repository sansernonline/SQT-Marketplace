---
name: load-testing
description: Use when checking how many users a system holds
---

# load-testing — load tests with a goal, a pass threshold and permission

Lives in plugin `software-development` · wording in this file follows `human-writing` · every tool fact has a link and the check date 2026-10-28 in the "Sources" section · sample script [`assets/load-test.js`](assets/load-test.js) · sample workflow [`assets/k6-smoke.yml`](assets/k6-smoke.yml) · how to read results [`reading-results`](references/reading-results.md) · k6 MCP [`mcp-k6`](references/mcp-k6.md)

> **One rule:** no pass threshold written before the run = no test result, only a graph · and never load a system that is not ours, or production, without a named person's written approval.

## Use when

- Before launching a system or before a campaign that brings many people at once (sale · registration opening · results announcement)
- Someone asks "ระบบรับได้กี่คน" · "ตอนคนเยอะจะช้าไหม" · "เพิ่มเครื่องแล้วดีขึ้นจริงไหม" (how many users can it hold · will it be slow when busy · did adding machines really help)
- A postmortem says the incident happened because load was never tested (`postmortem-template` section 5)
- Setting up a speed smoke test in CI that fails when slower than the threshold
- The user says load test · stress test · spike · soak · k6 · Locust · JMeter · p95 · ยิงโหลด · ทดสอบประสิทธิภาพ

Do not use when: one web page loads slowly in the browser (Lighthouse · Core Web Vitals) → [`web-quality-audit`](../web-quality-audit/SKILL.md) · the live system is slow right now and you must find where → [`observability-basics`](../observability-basics/SKILL.md) first · testing that a button click gives the right result → [`e2e-testing-patterns`](../e2e-testing-patterns/SKILL.md)

## Use another skill instead, or together

| Situation | Use | How it relates to this skill |
|---|---|---|
| Browser-side speed of one page | [`web-quality-audit`](../web-quality-audit/SKILL.md) | This skill measures the server side when busy, not page paint time |
| You must see which part of the system clogs during the run | [`observability-basics`](../observability-basics/SKILL.md) | Open the system's dashboards next to the k6 results (section 6) |
| Adding a smoke test to a pipeline | [`cicd-and-release`](../cicd-and-release/SKILL.md) · [`jenkins-pipeline`](../jenkins-pipeline/SKILL.md) | Section 7 says what runs on every PR and what runs on a schedule |
| A whole-release test plan with every kind of test | [`test-case-template`](../test-case-template/SKILL.md) | Put the load test in as one row of the plan, with the thresholds from section 1 |
| After the run you must add machines or autoscale | [`kubernetes-helm`](../kubernetes-helm/SKILL.md) · [`infra-as-code`](../infra-as-code/SKILL.md) | Run again with the same script after the change and compare with the result before |
| Test data contains names or phone numbers | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | Use fake data. Do not pull real customer data in to load the system |

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

## Check before sending

1. Expected volume, paths, and the p95 and error-rate thresholds exist before the run · guessed values carry the label "ค่าตั้งต้น ยังไม่ได้วัด" (default, not measured)
2. The system is ours · the environment is stated clearly · beyond smoke there is a named approver · production has a watcher and a way to stop
3. No real money, email, SMS or order came from the run
4. Thresholds are in `thresholds` · `abortOnFail` is set on the error rate
5. smoke passed before other types · the load generator is not the same machine as the system
6. The report states results against thresholds and the baseline at the volume really run, and does not conclude beyond what was run
7. CI does not swallow the exit code · secrets come from secret variables · the k6 version is pinned

## Sources

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
