# skill: background-jobs

Use when work runs outside the request in queues or schedules

# Background jobs

> **The one rule:** every background job must be **safe to run again without repeating its effect**,
> because it will certainly run again: the machine dies halfway · a person clicks again · the system retries by itself.

## When to use this skill

- Work the user should not have to sit and wait for: sending email, building a report, importing a file
- Scheduled work: a daily summary, month-end closing, deleting expired data
- Calling an external system that is slow or often down
- A jammed queue, or jobs that vanish with nobody noticing

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| Timeouts and retries for ordinary requests | `error-handling-patterns` | instead |
| Events across several services through Kafka (several consumers read the same event · history is kept) | `kafka-streaming` | instead |
| A job queue through RabbitMQ (several workers · retry · dead letter · needs a real broker) | `rabbitmq-messaging` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Choosing the overall architecture | `architecture-patterns` | instead |
| Importing Excel/CSV files as the main job | `data-import-export` | instead |
| Sending email/SMS as the main job | `notifications` | instead |
| The job table and indexes | `database-design` | alongside |
| Worker logs and correlation id | `logging-standards` | alongside |
| Jobs that delete expired data | `pdpa-compliance` | alongside |
| Abbreviations in work that people read | `spell-out-abbreviations` | alongside |
| Designing an agent system (Loop · Graph · Dynamic · choosing a framework) | `llm-engineering` → [`agent-systems.md`](../llm-engineering/references/agent-systems.md) | alongside |

---

## 1 · What belongs in the background

| Send to the background | Do inside the request |
|---|---|
| Takes more than 1–2 seconds | Fast, and the user must see the result at once |
| Calls an external system that can fail | Permission checks · data validation |
| The user does not wait for the result (email, notification) | The result is what they clicked to see |
| Many items done as a batch | |

> **Do not move work to the background just because it is slow.** If the user must see the result before moving on,
> moving it adds a waiting screen, a notification, and a place to store results.
> Sometimes making it faster is much cheaper (see `lazy-coding`).

---

## 2 · Choose a mechanism

| Mechanism | Fits | Watch out for |
|---|---|---|
| **Job table in the database** | small to medium systems · up to a few thousand jobs a day | you must write the job picker yourself · watch for workers fighting over jobs |
| **A real queue** (Redis · RabbitMQ · Amazon Simple Queue Service (SQS)) | many jobs · need built-in retry and dead letter | one more thing to look after |
| In-app scheduler (cron in code) | scheduled work with a single instance | **several instances will run it at the same time** · see section 5 |
| Platform scheduler | scheduled work on the cloud | |

**If the system is still small, always start with a table in the database,** because PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED`
lets several workers pick jobs at once safely, with no new system to add.

**Every job needs at least:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · Running again must not repeat the effect

Almost every queue system guarantees only "delivered at least once", **not exactly once**.

| Method | How to use it |
|---|---|
| **Duplicate-blocking key** | a unique constraint on `(job_type, business_key)` makes a duplicate job fail to insert |
| **Check state before acting** | "if the email for this purchase order was already sent, stop" |
| **Pass on an idempotency key** | when calling an external API (see `api-conventions`) |
| **Set a new value, do not add to the old one** | `set status = 'paid'` is safer than `balance = balance + 100` |

> **A job that adds to a value or sends something outside costs real money if it runs twice.**
> Two emails are only annoying, but two money transfers are a big problem.

---

## 4 · Retry and dead jobs

These numbers are for jobs in a queue · for retries outside a queue use [`error-handling-patterns`](../error-handling-patterns/SKILL.md) §4: service-to-service calls use 3 tries at 1/2/4 seconds · when a person waits on the screen → at most 1 retry, then let them press again

```
fail → wait 1 min → fail → wait 4 min → fail → wait 16 min → 4th failure → dead letter
```

| Rule | Detail |
|---|---|
| **Always set a cap** | 3–5 tries · with unlimited retries a single job can jam the queue |
| Increase the wait each round (a fixed multiple such as ×4) + a little randomness | same as `error-handling-patterns` |
| Bad data needs no retry | a malformed payload stays the same however many times you try |
| **A job that has run out of tries goes to one place** | dead letter (where jobs that failed until they ran out of tries are kept), keeping the full payload and the last error |
| A person must watch the dead letter | **alert when a new job arrives there**, do not wait for a customer to complain |
| It can be run again | after fixing the cause, you can re-run from the dead letter without writing a script |

**A job stuck because a worker died** needs an unlocker.
If a job's `locked_at` is older than N minutes, treat it as having nobody working on it, and unlock it so another worker picks it up.

**Job state is a state machine, not a boolean** (idea from wshobson python-background-jobs) — every mechanism in section 2 must be able to say which state a job is in: `queued → running → succeeded`, or `running → failed (attempts < cap) → queued`, or `failed → dead` · keep `attempts` · `locked_at` · `last_error` · `finished_at` with the job · move only along the arrows above (a `succeeded` job cannot go back to `running`; create a new job) · the admin screen and the dead letter read from this state in one place

---

## 5 · Scheduled jobs

> **With several instances, a scheduled job runs several times at once.**
> A summary report sent 3 times, or money charged 3 times, comes from this.

| Method | Use when |
|---|---|
| Lock in the database (advisory lock) | you can do it right away with nothing added |
| The platform scheduler calls an endpoint | on the cloud · Kubernetes CronJob |
| A scheduler that supports several instances directly | Quartz · Hangfire |

**Rules for scheduled jobs:**

- **Take the time range as a parameter**, so you can re-run missed dates without changing code
- If a run is missed, you must be able to catch up, not skip it for good
- State the time zone clearly: "every midnight" in which zone (see `i18n-and-locale`)
- **Record which runs succeeded**, do not infer it from logs

---

## 6 · Long jobs the user waits on

| Needed | Detail |
|---|---|
| Job id | return it the moment the job is accepted · the user uses it to ask about progress |
| State | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| Progress | "340 of 1,200 items done" (ทำแล้ว 340 จาก 1,200 รายการ), not a blind spinner |
| Cancellable | the job must check for a cancel signal regularly |
| Result | keep it available to download, with an expiry date |
| Notify when done | email or an in-system notification (see `notifications`) |

**Split a big job into small pieces.** For example, import 50,000 rows as sub-jobs of 500 rows each,
because a single 40-minute job that fails at minute 39 must start over from the beginning.

---

## 7 · What to measure

| Metric | Alert when |
|---|---|
| Jobs waiting in the queue | keeps growing and does not fall |
| Wait time in the queue (p95 · 95% of jobs wait no longer than this) | above what was promised |
| Failure rate | above the threshold |
| **Count in the dead letter** | **rises, even by just one** |
| Scheduled runs that did not run | a run was skipped |
| Jobs stuck in the running state for an unusual time | more than N times the normal |

> **A jammed queue is completely silent.** The API still answers 200 to every request and the health checks are all green,
> but no email has gone out for 3 hours. You see it only if you measure.

---

## 8 · Anti-patterns

- **A job that repeats its effect when run again** — the queue will certainly run it again, not maybe
- **Unlimited retry** — one broken job jams the whole queue
- **No dead letter** — jobs vanish silently and nobody knows
- **A dead letter that nobody watches** — the same as having none
- **Scheduled jobs on several instances with no lock** — they run on top of each other
- **Sending the whole data block in the payload** — send the id and let the job read it itself, so it gets the latest data too
- **A long job that cannot be cancelled** — the user clicks wrong and waits 40 minutes
- **A blind spinner that gives no progress** — the user clicks again and gets a duplicate job
- **Not measuring the queue** — it jams and you find out when a customer calls

---

## 9 · Durable workflow for agent jobs that run long or wait for human approval

An agent job that runs for tens of minutes, calls an LLM and tools many times, or pauses for approval across days cannot use a plain queue, because a failure at step 8 of 10 means starting over and paying the token cost again · use an engine that records the result of every step and resumes from the same point

| Tool | Fits | Waits for human approval | Watch out for |
|---|---|---|---|
| **Temporal** | Python and other languages · the agent loop lives in a workflow, while LLM and tool calls are activities · has `OpenAIAgentsPlugin` · `activity_as_tool` | (`ยังไม่ได้ตรวจ` · see the signal page) | the integration with the OpenAI Agents SDK is still in Public Preview |
| **AWS Step Functions** | fixed steps on AWS · fan-out with `Map` (Inline in parallel 40 · Distributed 10,000 child jobs) | `.waitForTaskToken` can wait up to 1 year until `SendTaskSuccess` / `SendTaskFailure` arrives · set `HeartbeatSeconds` to prevent a silent hang | when an LLM must choose the route, let Lambda or Bedrock decide, then use `Choice` |
| **Agent framework checkpointer** | you do not want to add an engine · LangGraph `PostgresSaver` · Microsoft Agent Framework `CheckpointManager` · OpenAI `RunState.to_json()` | LangGraph `interrupt()` · OpenAI `needs_approval` · Microsoft Agent Framework `RequestInfoExecutor` | an in-memory store is lost when the process restarts · use a database-backed store in production |

**Rules for code that must be replayable** (Temporal · Google ADK · Claude Code workflows use the same principle · checked against [Temporal: Workflow Definition](https://docs.temporal.io/workflow-definition) 2026-10-26)

- **Never read the time or draw a random value in code that controls the order of work** (`Date.now()` · `datetime.now()` · `Math.random()` · `uuid4()`) · on replay the value differs from the first run, the order drifts, and the old result cannot be reused · do anything that needs time or randomness in an activity, or use the SDK's own API for it
- **All LLM calls, tool calls, and outside reads and writes go in activities.** The result is recorded once, and replay reads the record instead of calling again.
- **The order of calls must be the same on every run** · changing the order of steps in code that still has jobs in flight makes the old jobs fail replay (Temporal calls this a nondeterminism error) · switch to the engine's versioning or patching
- **The steps before a wait point must be safe to repeat** (section 3) · LangGraph re-runs the paused node from the start on resume, so move side effects to after the wait point
- **Saved state carries no identity check** (the OpenAI docs warn about `RunState`) · load it only from a store we control
- The cap on rounds, the token budget, and stopping when there is no improvement are still needed, as for jobs in a queue · details in [`agent-systems.md`](../llm-engineering/references/agent-systems.md) section 6

Sources (opened 2026-10-26): [Temporal · OpenAI Agents SDK](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [Temporal announcement](https://temporal.io/blog/announcing-openai-agents-sdk-integration) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Step Functions Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html) · [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [OpenAI human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Claude Code workflows](https://code.claude.com/docs/en/workflows)


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
- **Never put `user_id` · a phone number · `call_id` in a label**, because every new value is a new series, until the metrics system cannot cope · these ids go in logs and traces
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

A system with an SLO uses this instead of a fixed error % threshold, because it says "if this goes on, when will the whole month's budget run out?" (idea from the Google SRE Workbook)

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

## 7 · Anti-patterns

- **Watching the average response time**: it hides the people who hit the problem every time
- **Alerts that need no action**: they teach everyone to ignore alerts
- **Alerting on CPU and memory**: a system at CPU 90% with normal users is not an incident
- **Putting unbounded ids in labels**: the metrics system brings itself down
- **A dashboard with 40 graphs**: nobody knows which one to look at
- **Measuring only the technical side, not the business**: everything is green but nobody can place an order
- **Tracing every request**: expensive for no extra gain, sampling is enough
- **No line marking the deploy time**: you lose half an hour before you remember you just deployed
- **Alerts with no link to a runbook**: the receiver starts searching from zero at 3 a.m.

---

## 8 · Abbreviations

- **metric**: a number collected over time
- **trace**: following one request along the whole path it travels
- **p95 / p99**: the 95th and 99th percentiles (only 5% or 1% of requests are slower than this)
- **label / tag**: a tag attached to a metric, used to look at groups separately
- **on-call**: the duty of receiving incident alerts outside working hours
- **SLO**: Service Level Objective (a service-level target you set yourself, such as 99.5% success)
- **error budget / burn rate**: the time you may fail per month under the SLO, and how fast you are using it up (item 4.1)

## 9 · Links to other skills

| Need | Use together with |
|---|---|
| Log format and correlation id | `logging-standards` |
| Health checks the monitor uses | `web-service-essentials` |
| Metrics for queues and background jobs | `background-jobs` |
| Error rate and circuit breaking | `error-handling-patterns` |
| Steps when an alert fires | `incident-runbook-template` |
| Post-incident summary | `postmortem-template` |
| Target numbers agreed with the customer | `srs-writing` |
| PromQL · alert rules · Grafana provisioning · voice agent example | `references/prometheus-grafana.md` |
| Let an agent read Prometheus or Grafana through MCP | `mcp-server` item 1.1 |

Source of item 3.1: prometheus.io (metric types · naming · histograms · alerting) and grafana.com (dashboard best practices · provisioning), checked 2026-10-27 · full links are at the end of `references/prometheus-grafana.md`


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
