<!-- merged from skill `observability-basics` on 2026-11-27 · description was: Use when a live system needs metrics, logs or alerts -->
# Measuring and monitoring a system

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · These three answer different questions](#1--these-three-answer-different-questions)
- [2 · The four signals to measure](#2--the-four-signals-to-measure)
- [3 · Naming metrics](#3--naming-metrics)
- [4 · Alerts](#4--alerts)
- [5 · Dashboards](#5--dashboards)
- [6 · Business metrics](#6--business-metrics)
- [References](#references)

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
| Log line format and masking | `errors-and-logs` |
| A trail of who did what | `web-service-essentials` |
| Health check endpoint | `web-service-essentials` |
| Steps during an incident | `incident-runbook-template.md` |
| Post-incident summary | `postmortem-template.md` |

---

## 1 · These three answer different questions

| | Answers the question | Example | Cost |
|---|---|---|---|
| **metric** | "Is it bad now? Getting better or worse?" | error 2.3% · p95 = 840 ms | Cheapest, keeps a long time |
| **log** | "What happened in that request?" | message + stack trace + id | Medium cost |
| **trace** | "Which step is slow?" | one request across 5 services | Most expensive, sample it |

**Order of use during an incident:** the metric says there **is a problem** → the trace says **where** → the log says **why**.
All 3 must be linked by the same correlation id (see `errors-and-logs`).

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
(see `async-messaging`).

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
- Details on PromQL · alert rule examples · provisioning · a voice agent example (STT · LLM · TTS latency · Kafka lag · GPU): `prometheus-grafana.md`

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

- [`prometheus-grafana.md`](prometheus-grafana.md) — open for PromQL · alert rules · Grafana provisioning · voice agent example
- `ai-engineering` → `references/mcp-server.md` item 1.1 — when an agent must read Prometheus or Grafana through MCP
- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources
