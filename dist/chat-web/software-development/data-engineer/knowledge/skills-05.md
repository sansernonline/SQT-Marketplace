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

# skill: context-budget

Use when a task reads large material or writes long output

# context-budget — decide before you read what enters context

> **One rule:** decide **before** you read, not regret it after. Tokens that enter context cannot be removed, except by `/clear` (drops everything) · `/compact` (shrinks to a summary) · `/rewind` (cuts back to an earlier point). Things you read in (files · PDFs · web pages · search results · command output) are the biggest source, so be most disciplined about them. If a Command-Line Interface (CLI) can do what a Model Context Protocol (MCP) tool does, use the CLI.

## Use when
- About to read something big: a folder of documents · a long PDF · several web pages · search results · a whole code project · command output that may be long.
- Starting work on a folder or project whose structure you do not know.
- Context fills unusually fast, or `/compact` triggers often.
- Setting context rules for the whole team or every project.

Not for: shorter **answers** → `lean-reply/answer-shape` · work summary across sessions → `handoff` · where temp files go → `workspace-rules/temp-file-discipline` · a coding loop that must survive context loss → `spec-to-code-loop` (plugin `software-development`).

## Steps

### 2 · Before reading, choose the route
- Know the file, page and line → read only that range (item 3); several items → read them together in one message.
- Need to find where it is → bounded search (item 3).
- Must search across many items whose location you do not know → send a subagent (item 4).
- Must convert, merge or count a lot of data → write to a file and read only the summary (item 5).

If you do not know how big the thing is, check the size first: PDF pages · file count and size in a folder (`ls -l`, `du -h`) · lines (`wc -l`).

### 3 · Read only a range, and search with a boundary
3 numeric rules (use them as they are if the user's `CLAUDE.md` has no "งบ context" section): **read only a range of any file over 300 lines** · **add `--glob` to `grep`/`rg`** · **end with `| head -50`**.

| Thing | How to read it |
|---|---|
| Folder of documents | Names and sizes first, then open only files whose names match the question |
| PDF · long report | Table of contents first, then name the pages or chapters |
| Web page | Ask for only the part you need (a number, a date, one heading) |
| Code | `rg -l` to learn which file, then drill in · `-C2` context is enough |
| Session files · `.jsonl` logs | One line can be megabytes: never `cat` · `wc -l -c <file>` first · find long lines with `awk 'length>100000{print NR": "length}' <file> \| head -20` · read one field at a time with `cut -c1-2000` or `jq` |

Read the whole file when you are about to overwrite it, or it is short, or you must understand all of it to edit correctly and it is under ~300 lines.

### 4 · Send a subagent instead (the biggest saving)
A subagent has its own context: it can read 20 items and send back one paragraph.

| Use a subagent when | Do it yourself when |
|---|---|
| You expect to read over 20k tokens or over 5 files whose location you do not know (default, not measured; estimate from the step's PERT in `superuser/model-scorecard` if present), or must search across many items to answer one question | You know the files and locations, even 4–6 of them: read them together in one message, faster than a new subagent |
| Exploring an unknown folder or project · checking across many files | Editing the file already open · work that needs full detail to continue |

**Always set the format and length of the result**, or the subagent returns a long report and you save nothing. Wrong: "Take a look at these 12 contracts". Right: "Find the expiry date, penalty and renewal terms of each contract. Return a table, 1 line per contract, with file:page. Do not paste contract text. At most 15 lines." Code work: "Return a list of file:line in call order, do not paste code".

### 5 · Write to a file instead of holding it in the conversation
```bash
<command with long output> > <temp folder>/out.log 2>&1; tail -20 <temp folder>/out.log
```
Use it for text pulled from the web or PDFs · big data tables (filter or count with a script, do not read every row) · test results · logs · file conversions. Where to put these files → `workspace-rules/temp-file-discipline`. Note what you find into a file on the first pass so you do not read it again.

If it repeats on every task, let a hook filter long output before it enters context: coding example in `superuser` → `references/code-extensions.md` (the addition in plugin `software-development`).

### 6 · So the next session does not explore again
Work you return to often needs a short map that **loads automatically**: where things are · what must not be read · commands used often. General work: the section "ของอยู่ที่ไหน" in `.claude/superuser/CONTEXT.md`, at most 40 lines. Files with other names (`notes.md`) do not load themselves, so they are wasted. An outdated map is worse than none: no full file list or change history in it. Code work (project and folder `CLAUDE.md`, example maps) → `superuser` → `references/code-extensions.md`.

### 7 · Other settings that help
Turn off MCP servers and plugins you do not use · pick model and effort at the start · `/clear` when the topic changes · project `CLAUDE.md` at most 40 lines (table with reasons: [`references/settings.md`](references/settings.md)) · on Windows (Git Bash · PowerShell) see [`references/windows-shell.md`](references/windows-shell.md).

**Compact yourself at about 70%, do not wait for the system** (70% is a default, not measured). When about 70% of context is used and a step has just finished (tests pass · file saved · check passed): first update "รับงานต่อ" in `CONTEXT.md` (`handoff` item 5), then `/compact` and say what to keep (files edited · decisions · next step). The system's own compaction often hits mid-step, before anything is written down.

### 7.1 · Seams between phases
Ask in order; **the first yes is the route**, then stop:

| # | Ask | If yes |
|---|---|---|
| 1 | Does the next phase need this context as its source, and is there room left (roughly over 150k tokens · default, not measured)? | **Continue** in the same session |
| 2 | Will the next phase move to another vendor's tool, model, or repo? | **handoff**: update "รับงานต่อ" and start in the new place (`handoff` item 5) |
| 3 | Can the next phase be split off without talking to us (no user answer to wait for, no context beyond what a brief can say)? | **subagent**: send the 5-part brief |
| 4 | Can this whole context be dropped (everything needed is in files) and the new topic is unrelated? | **clear**: cannot be undone; check `notes/` and "รับงานต่อ" are complete first |
| 5 | None of the above | **compact** and say what to keep (item 7) |

Item 4 is the only one that cannot be undone: answer yes only with evidence everything is in files; if unsure, go to 5.

## Project map
- Workers read `docs/FILE-MAP.md` instead of exploring the repo.
- Generate it: `node scripts/map-folder.mjs [dir=.] [--out docs/FILE-MAP.md] [--max 400] [--stdout]`.
- It lists each file with a role line and its relative imports, then a Mermaid folder graph.
- Over `--max` files it lists folders with file counts only.
- It never copies file contents beyond the role line. Regenerate after big changes.

## Check before done
- Big things were read by range, bounded search, subagent or file, not opened whole.
- Every subagent brief said the result format and length.
- Long output went to a file with only a tail or summary read back.

## Anti-patterns
Opening the whole thing to "see what is in it" when the table of contents or `head -40` answers it · searching without a boundary (`rg` without `--glob`; opening every search link) · searching across 10 items yourself instead of a subagent · sending a subagent to read something whose location you know · letting long output in one lump · reading the same thing again because you forgot (note findings to a file) · a map file that does not load automatically · a 300-line `CLAUDE.md` · all MCP servers always on.

## References
- [`references/settings.md`](references/settings.md) — open when setting rules for a team or project
- [`references/windows-shell.md`](references/windows-shell.md) — open when working in Git Bash or PowerShell on Windows
- [`references/sources.md`](references/sources.md) — sources and licences

## Squeeze logs
- Run long test or build logs through `node scripts/squeeze-log.mjs [file] [--max 100] [--context 3]` (stdin if no file) before reading them or handing them to another agent.
- It keeps the first 10 and last 20 lines, every error/fail/warn line with context, and collapses repeated lines as `(×N)`.
- The first output line says `squeeze-log: <in> → <out> lines · errors <k>`.


## reference: settings.md

# Settings that save context

Moved from `SKILL.md` item 7. Open it when you are about to advise the user on settings.

| Action | Effect |
|---|---|
| **Turn off MCP servers the task does not use**. If a CLI can do the job, use the CLI | Tool names and instructions of every server still load in every session |
| Pick the model and effort at the start of the session | Switching model mid-session loses the cache, so the whole conversation is read again (changing effort on Opus · Sonnet · Haiku 5.5 and Fable 5.1 through an Application Programming Interface (API) key or a subscription keeps the cache · through Bedrock · Agent Platform · a gateway or special setups, see the conditions at the link) · ([Claude Code: prompt caching](https://code.claude.com/docs/en/prompt-caching) · checked 21 Oct 2569 BE) |
| Fast mode — the user turns it on with `/fast` at the start of the session · the agent never turns it on | Opus only · up to 2.5 times faster text generation, but the first token is not faster · 2 times the price, and subscription users pay from usage credits, not the quota · worth it for a step that writes a long piece, not for short steps that wait on tools · turning it on mid-session pays the fast price once for the whole uncached conversation · ([Claude Code: fast mode](https://code.claude.com/docs/en/fast-mode) · [API: fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · checked 21 Oct 2569 BE) |
| Turn off plugins unrelated to the task | The description of every skill is always in context |
| `permissions.deny` in `.claude/settings.json` for folders that should not be read | The system guards it, so you do not depend on discipline |
| `/clear` when the topic changes (costs nothing) · `/compact <what to keep>` at a rest point in the work, not when nearly full · on the wrong path → `/rewind` to an earlier point | Frees space · `/compact` while the cache is warm is cheap, but after a long pause the whole conversation is read again · `/rewind` cuts back to a point where the cache already exists |
| Project `CLAUDE.md` at most 40 lines · `~/.claude/CLAUDE.md` (used by every project) at most 60 lines — this set's own cap, stricter than the official docs, which suggest at most 200 · the one shipped in `scripts/install/CLAUDE.global.md` is 84 lines (over the cap, waiting to be cut) | Every line costs tokens in every session |


## reference: sources.md

# Sources · context-budget

- Compact yourself at about 70% (section 7): idea from strategic-compact in everything-claude-code (MIT). 70% is a default, not measured.
- Seams between phases (section 7.1): mattpocock-skills (MIT) · PHASE-BOUNDARIES · seen 2026-11-10. The 150k token line is a default, not measured.


## reference: windows-shell.md

# Shell traps on Windows

Open it when working on a Windows machine through Git Bash or PowerShell · every item happened in the SQT-Marketplace repo between 2026-10-23 and 25 · kept as a reference file first; if it happens again, promote it to a skill.

| Symptom | Cause | Do this instead |
|---|---|---|
| Deleted every folder the user told you to keep (2026-10-25) | `ls` on the machine is aliased to `ls -F`, so folder names end with `/`. The keep list written as a regex matched no name, and then `rm -rf` deleted all of them · `rm` in Git Bash does not use the recycle bin | Build the list with `find <dir> -mindepth 1 -maxdepth 1 -printf '%f\n'` or `\ls -1A` · print the delete list and the keep list and compare them before running `rm` · move to `_to_delete/` instead of deleting |
| A pattern in JSON or a regex is wrong: `\b` became `\b` (2026-10-23) | Python code was sent through a heredoc in the Bash tool, and the escapes were interpreted twice | Edit the file with the Edit tool · or write the script to a file first and then run it · check the result by reading the actual value · a `\r` that became a real CR character in a .md is now caught by the SQT-Marketplace checker (2026-10-25), but a lost `\b` is still not caught |
| The validator fails with "documents do not match the real ones" though the content matches · the zip in `dist/` changes though nothing was edited (2026-10-25) | A new worktree with `core.autocrlf=true` checks files out as CRLF, but the scripts build text with LF | Scripts that compare or build files must convert CRLF to LF first (`sync-docs` · `writeZip` already do) · files that must be CRLF are declared in `.gitattributes` · check whether they really differ with `git diff --ignore-cr-at-eol --stat` |
| A plugin hook does nothing, with no error (2026-10-25) | It checks it is the main file with `fileURLToPath(import.meta.url) === process.argv[1]`, which does not match on Windows when called through `${CLAUDE_PLUGIN_ROOT}/…` | Compare with `process.argv[1].replace(/\/g, "/").endsWith("<file name>")` as in `superuser-hook.mjs` · test the hook by calling it through the real path Claude Code uses |

## Small things worth knowing

- `perl -i` or `sed -i` on a CRLF file: a regex anchored to the line end with `$` must allow for `\r` (`(\r?)$`), or the edit silently does not apply
- `cd` in Bash does not carry across commands · use a full quoted path, because folder names often contain spaces and `&`
- A `.cmd` script that ends with `pause` waits for a key · when running it from an agent, pass empty stdin (`< /dev/null`), save the output to a file, and read the end of the file
