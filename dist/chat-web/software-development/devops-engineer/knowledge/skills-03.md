# skill: software-diagrams

Use when a README or PR needs a quick Mermaid diagram

# Software Diagrams

> **The one rule of this skill:** a diagram answers **one question**.
> If it answers 2 questions, draw 2 pictures.

> **The destination decides the tool:** this skill draws quick diagrams with Mermaid in the house theme, only for a README · Pull Request · note in code.
> For figures in project documents (BRD · SRS · FSD · ADR · ER · process maps), client proposals, slides and print work, go to `diagram-figures`. The full table for choosing is at the top of that skill.
>
> **Colour in a figure must carry meaning, not decorate.** If the source document already declares a `doc-theme`, use that value and do not pick new colours per figure (the default is the house set in `polished-document-style` · for the meaning of colours see `branded-document-design/references/tokens-and-type.md`):
> A quick diagram uses **one main colour** = "the thing we are talking about" · grey = external/closed systems · white with a grey line (`store`) = data stores · other boxes use the defaults (3 classes `focus` · `ext` · `store` in `assets/mermaid-theme.md`). If you need several colours to separate failure points, exceptions and successes, the figure answers several questions. Split it into new figures or use `diagram-figures`.

## When to use this skill

In a README · Pull Request · note in code:

- Explain the system architecture
- Explain the order of work across several parts
- Explain the states of data
- Design a database
- Say what runs on which machine
- Review a diagram someone else drew


Not for: choosing SVG / ASCII / Mermaid → `markdown-visuals` · screenshots and wireframes → `ui-craft` + the platform skill · data charts → `web-app-design` `references/tokens.md` heading "สีข้อมูล (กราฟ)" · choosing an architecture → `architecture-patterns`

## 1 · Which question, which diagram

**Start from the question, not from the diagram type.**

| The question in the reader's head | Diagram |
|---|---|
| "Who outside does this system talk to?" | C4 level 1 — System Context |
| "What is inside the system? Do the parts run separately?" | C4 level 2 — Container |
| "How is this service divided inside?" | C4 level 3 — Component |
| "When I press this button, what happens, in order?" | Sequence |
| "How can this document change state?" | State |
| "Which table links to which table?" | Entity Relationship (ER) |
| "What machines does the real thing run on, and how many?" | Deployment |
| "Who approves after whom?" | Flowchart (work steps) |
| "A cloud diagram in the repo with real AWS / Azure logos" | Infrastructure — section 3 |
| "I want a nice picture for the client proposal" | Not the job of this skill — `diagram-figures` |

**Always draw C4 levels 1 and 2 in full first.** Draw level 3 only for the parts that are truly complex.

## 2 · Theme — one set for the whole project

Put the `%%{init: ...}%%` line on the **very first line** of every diagram, and use the one main colour with the 3 classes `focus` · `ext` · `store`. The main colour is reserved for "the thing we are talking about" only.
The theme line, colour stand-ins, classes and rendered examples are in [`assets/mermaid-theme.md`](assets/mermaid-theme.md). The table that matches kinds of work to colour tones is in `diagram-figures/references/colour-by-domain.md`.

> Warning: **`fontFamily` must sit outside `themeVariables`.** If you put it inside, it is silently ignored and Mermaid falls back to its default font.

**Check with a tool before every send.** This rule is forgotten most often:

The scripts are in the `scripts/` folder of this skill. Run them with the script's full path and the `docs` folder of the project being checked (`<path ของ skill>` = the folder where this skill is installed):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 with file:line of each block that lacks %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # proves the checker still catches it
```

An agent with no shell cannot run it → the main agent runs it after taking the work back.

## 3 · Diagrams that need real logos (infrastructure)

If an infrastructure diagram that lives in the repo needs real Amazon Web Services (AWS) · Azure · Kubernetes icons, which Mermaid cannot draw, use the **`diagrams`** library (Python + Graphviz), starting from [`assets/infra-diagram.py`](assets/infra-diagram.py).
Install steps, the commonly used node rules and the traps are in [`assets/diagrams-python.md`](assets/diagrams-python.md). For cloud diagrams that a client or a slide will show, use `diagram-figures`.

## 4 · Rules that make it readable

**No more than 7 boxes.** Past that, readers stop reading (count real boxes, not subgraphs).

**Count boxes before drawing, not after.** If there are more than 7, **split the figure by the order of the story before drawing**. Note the split in `decision-log` and say so in the reply.
Never draw everything and then say so afterwards.

The sample reply to the Thai user (kept in Thai because it is the text the agent says):

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
อยากแบ่งแบบอื่น บอกได้ — แยกใหม่ได้
```

> **"Separate files are fine" means you must split.** If the request leaves room to split and the content passes the cap,
> treat it as an order to split, not an option.

**These 3 things do not belong in a diagram.** They are manual content, not a picture, and they swell the boxes until the diagram warps.

| Do not put in | Where it goes |
|---|---|
| Command-line options `--all` `--resume` `--limit N` | `README` or `docs/cli.md` |
| Lists of inputs/outputs for several parts | **A table beside the figure** — columns: component · takes what · gives what · stored where |
| Every file name or path | The same table. Put in the figure only the ones that carry the point |

**A request like "show the input/output too" does not mean draw everything as boxes.**
A box is something that *does work*. What *flows through* is a label on the line. *Detail* goes in the table.

**One level of detail across the whole figure.** If `PostgreSQL` and `OrderRepository.cs` sit in the same figure,
that signals a mix of 2 levels.

**Every line needs a label,** and the label must say **what flows through**, not that they are connected.

```
Wrong: api --> db
Wrong: api -->|ใช้| db
Right: api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**One direction.** Top to bottom (`TB`) or left to right (`LR`). Choose one and let no line run backwards.
A backward line means the boxes are in the wrong order. It does not mean you need a double-headed arrow.

**Box name = what it does, not the technology.** Put the technology on a second line in small type.

```
Wrong: [Redis]
Right: ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**Add a legend when colour or shape carries meaning.**
If you cannot explain why this box has a different colour, that colour should not be there.

## 5 · Thai in diagrams

- **A Thai line label longer than 3 words overlaps the line.** Shorten it, or add `<br>` yourself.
- **Do not use `()` `[]` `{}` in text.** They clash with Mermaid syntax. Always wrap the text in `"..."`.
- **Tone marks float above the box** when `fontSize` is below 12px. Do not go lower.
- Table and field names in an ER diagram use English (matching the real database).
  Descriptions can use Thai.

## 6 · Render and look — never skip

A diagram that was never rendered is still only text, not a picture. Some syntax mistakes give no error in Mermaid,
and the result often does not match what you thought.

```bash
# not installed on the machine · pin the version the theme was tested on (11.17.0 · the latest 12.0.0 as of 2026-10-14 has not been tested with the theme)
npx -y @mermaid-js/mermaid-cli@11.17.0 -i diagram.mmd -o diagram.png -b white -s 2
```

Then **open the image file and look at it with your eyes**. Go through this list:

- [ ] Are there at most 7 boxes?
- [ ] Does every line have a label, and does the label say what flows through?
- [ ] Does any line run in the opposite direction?
- [ ] Does a label overlap a line or a box?
- [ ] Is the Thai text complete, with no missing vowels?
- [ ] Is the level of detail the same across the figure?
- [ ] Does the diagram carry a date and an owner? (without them nobody dares to edit it after a year)
- [ ] Can someone who has never seen this system read it and answer the original question?

**Mermaid limits to know before you waste time:**

| Symptom | Cause |
|---|---|
| `direction LR` inside a subgraph does not work | It is ignored when the subgraph has a line linking out — order the boxes yourself |
| A box is abnormally wide | One long line of text — add `<br>` yourself, Mermaid does not wrap lines |
| Lines overlap in a mess | Too many boxes — Mermaid has no smart line routing, so cut boxes |
| The font does not change | `fontFamily` is in the wrong place (see section 2) |

If you truly cannot get the layout you want and the figure stays in a markdown document, draw an inline SVG per `markdown-visuals`. If the figure must look designed, go to `diagram-figures`.

To record why a design was chosen, use `adr-writer`. A figure that must look designed or needs sign-off → `diagram-figures`.

## Do not look AI-made

Before sending, walk through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass eye check 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass.


---

# skill: incident-runbook-template

Use when writing a runbook or on-call guide

# Incident Runbook Template

## When to use this skill

- Writing a runbook for a known failure mode
- Documenting on-call procedures
- Creating playbooks for common alerts
- After a postmortem finds "we need a runbook for X"
- Onboarding new on-call engineers

## When not to use

| Task | Use this instead |
|---|---|
| The incident is over and you must summarise what happened and how to prevent it | `postmortem-template` |
| Setting up a metric alert or dashboard | `observability-basics` |

## Read more when

| File | Open when |
|---|---|
| [references/runbook-template.md](references/runbook-template.md) | Every time you start a new runbook. Copy the full template from this file and fill it in |
| [references/index-and-alert-links.md](references/index-and-alert-links.md) | If the team has no runbook index page, or alerts do not yet link to a runbook, open this file for examples |
| [references/game-days.md](references/game-days.md) | When planning an incident drill to test that a runbook works in practice |

## 0 · Look for an existing format first (every time)

Before using the structure or template in this file, check whether the user, customer or project already has its own format:

- **Where to look:** existing runbooks: `docs/runbooks/` · the on-call team's wiki · the alerting tool in use (PagerDuty · Opsgenie · Grafana) and the real alert names · the organisation's severity levels
- **Result:** found → use that format (headings, order, field names, numbering) and say in the reply which file's format you used · not found → use the template in this file as a fallback and say that no existing format was found
- **Still required either way:** alert names, commands and dashboards come from the real system. Do not invent examples.

## What's a Runbook?

A **runbook** answers: "Alert X fired. What do I do?" It is not architecture documentation (the bigger picture) or training material (too much detail).
## Runbook Quality Standards

A good runbook is:

| Property | Test |
|----------|------|
| **Actionable** | Can a tired engineer at 3am follow it? |
| **Concrete** | Are commands copy-pasteable? |
| **Tested** | Has someone followed it during a real incident? |
| **Updated** | Was it last reviewed less than 6 months ago? |
| **Discoverable** | Can on-call find it from the alert link? |
| **Concise** | Under 1 page for common cases |

## Runbook Template

The full template is in [references/runbook-template.md](references/runbook-template.md). Every runbook has these sections in this order, and each section must contain the following.

| Section | Must contain |
|---|---|
| Header | Severity · Service · Owner Team · Last Reviewed · Linked Alert |
| TL;DR (30 seconds) | One paragraph: what broke, what to do first, and whom to call |
| How to Detect | Symptoms users see and symptoms seen internally · the alert that fires · the dashboard to open |
| Diagnosis (60 seconds) | A decision flowchart and quick checks written as commands to copy and run, in order |
| Mitigation Steps | Steps ordered from low risk to high (the same order as `incident-response` Phase 3). Every step states Expected effect · **VERIFY** (the command or graph to look at, and the value to expect. If you do not see that value, the step has not worked yet. Do not move to the next step without knowing what the previous step did) and Caveats or If doesn't work · the agent only proposes commands and expected results, and the on-call person runs them or approves them before anything touches production |
| Escalation Path | Who is called when, in clear minutes |
| Verification | A checklist to confirm it is really fixed |
| After Resolution | Log it in the incident channel → update the status page → open a postmortem ticket → update this runbook |
| Related Runbooks · Background | Links to related runbooks, and a short background of the problem (optional) |

**Mitigation order in the template:** Reduce load (low risk) → Scale up (medium risk) → Rollback recent deploy (higher risk) → Failover to backup region (last resort)

**Escalation order in the template:** If it cannot be fixed in 15 minutes, call the secondary on-call. If two people cannot fix it in 30 minutes, call the service's owning team. If it is still SEV1 after 45 minutes, call the incident commander (IC). If SEV1 runs past 1 hour, call the head of engineering.

**Count it as fixed when** the error rate is back to normal · latency p95 is below the threshold · the status page says "Operational" · there are no new alerts · customers have stopped reporting problems, and you have watched for another 30 minutes.

> Use `postmortem-template` skill for the full analysis

## Runbook Index and Alert Links

Keep one index page of runbooks in one place, searchable by service, by alert name, and by the most frequent incidents in the last 90 days.

Every alert **must** link to a runbook through the alert's `runbook_url:` annotation, and should carry a matching `dashboard:` too. Examples of the index page and a Prometheus alerting rule are in [references/index-and-alert-links.md](references/index-and-alert-links.md).

## What Makes Runbooks Fail

| Problem | Fix |
|---------|-----|
| Out of date | Review every 6 months, update after every incident |
| Too long | Split into 1 runbook per failure mode |
| Too generic | Be specific to YOUR service |
| No commands | Include actual copy-paste commands |
| Not discoverable | Link it from the alert and the index page |
| No ownership | Each runbook has a team owner |
| Not tested | Run game days, and follow it during real incidents |
| Commands rot silently | CI job on every change to `runbooks/`: pull every fenced `bash` block → `bash -n` (parses) · every `./scripts/*.sh` it names exists in the repo · every `kubectl` resource name exists in staging (`kubectl get ... -n staging`) · fail the build on any miss. A command that cannot run at 3am is worse than no runbook (idea from wshobson/agents incident-runbook-templates) |

## Game Days

Test a runbook by deliberately simulating a failure. Each quarter, pick one runbook, simulate the incident in staging, and have on-call follow it. Then update the runbook for the gaps found. The full checklist is in [references/game-days.md](references/game-days.md).

## Anti-patterns

- **Theoretical runbooks** written by someone who never saw the failure
- **"Contact the team"** without saying who or how
- **Treating mitigation as the root-cause fix** (mitigation should be FAST; the fix comes later)

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |


## reference: game-days.md

# Game Days

A checklist for incident-response drills that test a runbook; use it when planning the quarterly drill

Test runbooks by faking failures on purpose:

```markdown
## Game Day Checklist

Quarterly:
- [ ] Pick a runbook to test
- [ ] Simulate the failure in staging (chaos engineering)
- [ ] On-call engineer follows runbook
- [ ] Identify gaps
- [ ] Update runbook based on learnings
- [ ] Repeat with different runbook next quarter
```


## reference: index-and-alert-links.md

# Runbook Index และการผูก runbook กับ alert

An example runbook index page and an example of linking a runbook from an alert; use it when setting up the team's runbook system for the first time

## Runbook Index Pattern

Maintain a central index (`docs/runbook-index.md`). Each runbook is one file `docs/runbook-<service>-<เรื่อง>.md` per `document-naming`:

```markdown
# Runbook Index

## By Service
- API Service
  - [High error rate](runbook-api-high-error-rate.md)
  - [Memory leak](runbook-api-memory-leak.md)
- Database
  - [Connection pool exhausted](runbook-db-conn-pool.md)
  - [Replication lag](runbook-db-repl-lag.md)

## By Alert Name
| Alert | Runbook |
|-------|---------|
| `api_5xx_rate_high` | [API: High error rate](link) |
| `db_connections_high` | [DB: Connection pool](link) |
| `disk_full_warn` | [Generic: Disk full](link) |

## Most Common Incidents (last 90 days)
1. High error rate on payment service — [runbook](link) (12 times)
2. DB replication lag — [runbook](link) (8 times)
3. Cache invalidation storm — [runbook](link) (5 times)
```

## Linking Runbook to Alert

Every alert MUST link to a runbook:

```yaml
# Prometheus alerting rule (rule file loaded by Prometheus; Alertmanager only routes the alert)
- alert: APIHighErrorRate
  # share of requests that are 5xx — needs the denominator, otherwise it is requests per second
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m])) > 0.05
  for: 5m
  annotations:
    summary: "API error rate > 5%"
    runbook_url: "https://runbooks.example.com/api/high-error-rate"
    dashboard: "https://grafana.example.com/d/api-overview"
```


## reference: runbook-template.md

# Runbook Template

**สารบัญ:** แม่แบบเต็ม 1 บล็อก: TL;DR · How to Detect · Diagnosis · Mitigation Steps (ขั้น 1–5) · Escalation Path · Verification · After Resolution · Related Runbooks · Background

- [The whole template](#runbook-template) is in a single block; copy the whole block into a new runbook file

The full template for one runbook, ready to copy and fill in. The rules for what each section must contain are in `SKILL.md`

````markdown
# Runbook: <Alert Name or Failure Mode>

| | |
|--|--|
| **Severity** | SEV1 \| SEV2 \| SEV3 \| SEV4 (table in `postmortem-template`) |
| **Service** | service-name |
| **Owner Team** | @team-name |
| **Last Reviewed** | YYYY-MM-DD |
| **Linked Alert** | [Grafana/PagerDuty link] |

---

## TL;DR (30 seconds)

> One paragraph: what's broken, what to do first, who to call.

## How to Detect

**Symptoms:**
- User-facing: ...
- Internal: ...

**Alerts that fire:**
- [Alert Name](link) — fires when ...
- [Another Alert](link) — fires when ...

**Dashboards to check:**
- [Main Dashboard](link)
- [Service Health](link)

## Diagnosis (60 seconds)

```mermaid
flowchart TD
    Start([Alert fires]) --> Q1{Is the service healthy in dashboard?}
    Q1 -->|No| A[Check infrastructure]
    Q1 -->|Yes| Q2{Are errors >5%?}
    Q2 -->|Yes| B[Check recent deploys]
    Q2 -->|No| Q3{Is latency high?}
    Q3 -->|Yes| C[Check downstream services]
    Q3 -->|No| D[Check alert config - may be false alarm]
```

### Quick checks (run in order)

**1. Is service responding?**
```bash
curl -fsS https://api.example.com/health || echo "DOWN"
```

**2. Are recent deploys suspicious?**
```bash
gh release list --repo our-org/service --limit 5
```

**3. Check error rate in logs:**
```bash
# Last 10 min of 5xx errors
kubectl logs -n prod deployment/api --since=10m | grep -c '"status":5'
```

**4. Check downstream dependencies:**
- Database: [Dashboard link]
- Redis: [Dashboard link]
- External API: [Status page link]

## Mitigation Steps

> **Human approval:** an agent only proposes the command and its expected effect. A human on-call runs it or approves it before it touches production (`principle-proceed-on-reversible-work`, `incident-response` Phase 3).

Try mitigations in order of risk (lowest first) — the same order as `incident-response` Phase 3:

### Step 1: Disable the broken feature or reduce load (low risk)
```bash
# Turn off the feature flag of the suspect feature
./scripts/flag.sh set new-checkout off --env prod

# Or enable rate limiting
kubectl set env deployment/api -n prod RATE_LIMIT_AGGRESSIVE=true
```

**Expected effect:** Error rate drops within 2 min
**VERIFY:** `./scripts/flag.sh get new-checkout --env prod` → `off` · dashboard 5xx panel < 1% for 2 min
**If doesn't work:** Go to Step 2

### Step 2: Scale up (medium risk)
```bash
kubectl scale deployment/api -n prod --replicas=10
```

**Expected effect:** Latency improves within 3 min
**VERIFY:** `kubectl get deployment/api -n prod` → READY `10/10` · p95 panel back under threshold
**Caveats:** Will increase cost, monitor budget alerts

### Step 3: Rollback recent deploy (higher risk)
```bash
kubectl rollout undo deployment/api -n prod
```

**Expected effect:** Reverts to previous version
**VERIFY:** `kubectl rollout status deployment/api -n prod` → `successfully rolled out` · running image tag = previous release
**Caveats:** Check for schema migrations before rolling back. A rollout undo does not delete data, but old code may break on a schema the new release already migrated — roll back only if the migration is backward-compatible

### Step 4: Block bad traffic at the WAF or firewall (high risk)
```bash
# Block the abusive IP range / path at the web application firewall (WAF)
./scripts/waf-block.sh --cidr 203.0.113.0/24 --ttl 1h
```

**Expected effect:** Abusive traffic stops reaching the service
**VERIFY:** `./scripts/waf-block.sh list` shows the CIDR with TTL · requests from that range in access log → 0 · request rate from real users unchanged
**Caveats:** Can block real users; set a TTL (time to live) and check the allow list

### Step 5: Failover to backup region (last resort)
```bash
# Update DNS to point to backup region
./scripts/failover-to-us-west.sh
```

**Expected effect:** All traffic shifts to backup
**VERIFY:** `dig +short api.example.com` → backup region IP · backup region request rate ≈ previous primary rate · primary → 0
**Caveats:** Some user data may need migration, full rollback complex

## Escalation Path

```
You can't resolve in 15 min
  ↓
1. Page secondary on-call (PagerDuty group: team-secondary)
  ↓
You both can't in 30 min
  ↓
2. Page service owner team (team-owner)
  ↓
Still SEV1 after 45 min
  ↓
3. Page incident commander on-call (IC)
  ↓
SEV1 still active after 1h
  ↓
4. Page engineering leadership
```

## Verification (after mitigation)

Confirm the issue is resolved:

- [ ] Error rate back to baseline
- [ ] Latency p95 < threshold
- [ ] Status page updated to "Operational"
- [ ] No new alerts firing
- [ ] Customer reports stopped
- [ ] Monitor for 30 min before considering resolved

## After Resolution

1. **Document in incident channel**: what happened, what you did
2. **Update status page**: clear incident, post resolution message
3. **Create postmortem ticket**: if SEV1/SEV2, schedule postmortem
4. **Update this runbook**: if you learned something new

> Use `postmortem-template` skill for the full analysis

## Related Runbooks

- [Database connection issues](link)
- [Cache failure](link)
- [Authentication service down](link)

## Background / Why this happens

Optional section: brief context on why this failure mode exists.
Useful for new on-call engineers.
````


---

# skill: logging-standards

Use when writing or reviewing code that logs

# Logging Standards

> **The one rule:** Logs exist for a person to read at 3 a.m. when the system is down, not while writing the code.
> If a line does not help answer "what happened, to whom, and when", do not write it.

## When to use this skill

- Starting any new project (service, API, worker, batch, desktop, frontend)
- Someone asks for "a log file", or asks about log format and levels
- You are chasing a production problem and find that the existing logs are unusable

## When **not** to use it

- You need metrics or tracing (Prometheus, OpenTelemetry). That is a different topic from logs, so use `observability-basics`.
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

The default is `DEBUG` in dev and `INFO` in production, adjustable with the env var `LOG_LEVEL`. **No new build is needed; just restart (or reload the config).** .NET reads it from `appsettings.json` instead (see `references/per-stack.md`).

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
| `references/per-stack.md` | .NET (Serilog) + Angular | Caution: not yet compiled or tested |

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

`testing-standards` (tests with full coverage) · `incident-runbook-template` · `postmortem-template`


## reference: per-stack.md

# Set up the logger to produce the same format — .NET and Angular

> Warning: the code in this file is **not yet compiled or tested** (unlike `assets/logger.node.js` and
> `assets/logger_py.py`, which have really been run). It uses the standard setup of each library.
> At the first build, compare the output lines with the format in SKILL.md item 1.

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
// Right: fixed message + values go in {Context} as k=v, per the format in SKILL.md item 1
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


---

# skill: web-service-essentials

Use when building or reviewing an HTTP backend

# Web Service Essentials

> **The one rule:** before writing the first business endpoint, the service must be able to answer
> "Are you still alive? · Are you ready for work? · Which version are you running now?" If it cannot, on the day the system goes down you will be guessing blind.

## When to use this skill

- Starting a new service / REST API / microservice
- Someone asks for a health check, ping, readiness, liveness, or version endpoint
- Deploying to production for the first time, or moving into Docker/Kubernetes
- You must set one API error format for the whole system

## When **not** to use it

- To design business endpoints, use the command `/api-design`
- For URL style · paging · dates · API ids, use `api-conventions`
- For log format, use `logging-standards`
- To choose an architecture, use `architecture-patterns`
- To check responses against OpenAPI in CI or catch breaking changes, see `api-conventions` [`references/contract-testing.md`](../api-conventions/references/contract-testing.md)

---

## 1 · The 4 basic endpoints

| Endpoint | What it answers | auth | Checks dependencies | Who calls it |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | no | no | load balancer, every second |
| `GET /health/live` | the process is still alive | no | **no** | orchestrator (restarts if dead) |
| `GET /health/ready` | ready to take traffic | no | yes | orchestrator (removes from the pool) |
| `GET /version` | what is running | no* | no | a person, when tracing a problem |

> **live must not check dependencies.** This is the most common mistake.
> If `/health/live` checks the database (DB) and the DB goes down briefly, Kubernetes will **kill every pod**
> even though the app itself is fine. When the DB comes back, no pod is left to take traffic.
> The dependency check belongs in `/health/ready`, which only removes a pod from the pool for a while.

\* If you do not want the public to see the commit hash in `/version`, restrict it so only the internal network can call it.

**Wire it to Kubernetes like this** — live and ready must point to different paths, or the point above means nothing.

```yaml
livenessProbe:            # dead → restart the container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # let the app start first, or it gets killed before it can listen
  periodSeconds: 10
  failureThreshold: 3     # restart only after 3 failures in a row (30 seconds)
readinessProbe:           # not ready → remove from the Service for a while, no restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

For an app with a long warm-up (loading a model · a big cache), add a `startupProbe` pointing to `/health/live` with a high `failureThreshold`, instead of stretching the liveness `initialDelaySeconds`.

### Response shape (the same in every language)

```jsonc
// GET /health/ready → 200 normally · 503 when a critical dependency is down
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 states, not 2:**
- `up` — everything is normal → 200
- `degraded` — a **non-critical** dependency is down (such as email) but the service can still take traffic → 200
- `down` — a critical dependency is down (such as the DB) → **503**

**Every check must have a timeout** (default 3 seconds). Otherwise a hung dependency
makes the health endpoint hang too, and the orchestrator makes the wrong decision for the whole system.

**Never send a stack trace or connection string out through these endpoints**, because anyone can call them.

---

## 2 · One error format for the whole system

Follow **RFC 9457 (`application/problem+json`)**, which is a real standard, so you do not invent your own.

```jsonc
// 422 — the format is right, but the data fails a rule (see the table below)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // matches the cid in the log — trace the case at once
  "errors": [                           // validation only · every field in one response
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` is the full path including array indexes · `code` is for programs · `message` is for people

| Status | Use when |
|---|---|
| 400 | Malformed data |
| 401 | Not yet authenticated |
| 403 | Authenticated but not allowed |
| 404 | The thing does not exist |
| 409 | Conflicts with current state (duplicate, overwrite) |
| 422 | Format is right but breaks a business rule |
| 429 | Called too often — must have `Retry-After` |
| 500 | Our side broke — **never send internal details out**, send `requestId` instead |

> **A 500 must say only "an error occurred, please report this requestId".** The real details stay in the log.
> Sending a stack trace out is like handing the system's blueprint to someone looking for a way in.

---

## 3 · Request id

- Accept it from the **`X-Request-Id`** header only when it matches `^[A-Za-z0-9-]{1,64}$` · if it is missing or does not match → create a new one (a uuid cut to 8 characters).
  This value goes into every log line. If you accept it as is, the sender can insert new lines or fake text into the log (log injection).
- **Return it in a response header every time**, including on errors.
- Put it in every log line (see `logging-standards`) and in the error body.
- Pass it on to the downstream service every time you call across systems.

When a customer calls to say "it broke", ask for the requestId and `grep` once to find the whole story.

---

## 4 · Graceful shutdown

On a new deploy the orchestrator sends `SIGTERM`. If the app dies at once, requests in progress are cut off midway.

```
SIGTERM → 1. Stop accepting new requests (make /health/ready answer down at once)
          2. Wait for in-flight requests to finish (timeout 15–30 seconds)
          3. Close the DB pool / queues / files
          4. exit(0)
```

> Step 1 matters more than it looks. `/health/ready` must answer `down` about 5 seconds **before** the real shutdown,
> so the load balancer removes us from the pool in time. Otherwise traffic keeps arriving while we are closing.

---

## 5 · What must exist before deploy (not optional)

- **Timeouts everywhere**: incoming requests, outgoing calls, and DB queries. Without a timeout, the moment a downstream is slow, the whole system hangs with it.
- **Limit body size** (for example 1MB) to stop memory blowing up from a large payload.
- **Cross-Origin Resource Sharing (CORS) names the origin explicitly** — `*` is allowed only for a public API with no cookies.
- **Rate limit** at least on the login endpoint and on anything that sends a one-time password (OTP)/email.
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (replaces the old `X-Frame-Options` header · also add `X-Frame-Options: DENY` for old browsers) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` sets them all in one line · .NET: `UseHsts()` sets only HSTS, and the rest needs a short middleware or the package `NetEscapades.AspNetCore.SecurityHeaders` (example in `references/per-stack.md`)
- **Turn off the full error page in production** (`app.UseDeveloperExceptionPage()` in dev only)
- **Put the version in the path**: `/api/v1/...` from day one, because moving later costs much more.
- **OpenAPI** generated from the real code, not written by hand and then forgotten.

---

## 6 · Ready-made code

| File | Stack | Status |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ all 4 endpoints run and tested, plus the degraded/down/timeout cases |
| `assets/health_py.py` | Python / FastAPI | ✓ run and tested the same way, results match on every field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | Caution: not yet compiled or tested |

Usage snippets for the Node and Python routers: [`references/per-stack.md`](references/per-stack.md).

---

## 7 · Check the work

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# stop the DB and call again — ready must be 503 but live must still be 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` does **not** touch the DB — it still answers 200 with the DB stopped
- [ ] `/health/ready` answers 503 when a critical dependency is down
- [ ] When a non-critical dependency is down, the result is `degraded` + 200 (still takes traffic)
- [ ] Every check has a timeout — make a dependency hang, and the endpoint must answer within ~3 seconds
- [ ] `/version` matches the commit actually deployed
- [ ] Every response has `X-Request-Id`, including a 500
- [ ] Trigger a 500 and confirm no stack trace / connection string leaks out
- [ ] After `SIGTERM`, in-flight requests finish before the app closes
- [ ] `/ping` is not written to the log (or the file fills up with pings)


## reference: per-stack.md

# .NET และ Angular

> Caution: the code in this file is **not yet compiled or tested** (unlike `assets/health.node.js` and
> `assets/health_py.py`, which have been run against every endpoint). It is the standard setup of
> ASP.NET Core. On the first run, compare the response with the shape in SKILL.md section 1.

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

Make the response match the same format as the other stacks:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core already ships `ProblemDetails`. Use it, and do not invent your own format.

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

Make `/health/ready` answer down for a short while before the real shutdown, so the load balancer removes the instance from its pool in time.
Use `IHostedLifecycleService.StoppingAsync` (.NET 8 and later), because the host calls it **before** it stops Kestrel (after `ApplicationStopping`).
So you can wait with `await Task.Delay` without blocking a thread, and the server still answers 503 for the load balancer to see.

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

Host shutdown order (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` of the hosted services (including Kestrel) → `StoppedAsync` → `ApplicationStopped` — per the .NET Generic Host page at learn.microsoft.com (checked 22 Oct 2026)

### สิ่งที่ต้องเปิดก่อน deploy

Register services only **before** `builder.Build()`. After Build the service list is read-only, and calling `builder.Services.Add…` then throws `InvalidOperationException` at app start.

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

To avoid writing your own middleware, use the package `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) which sets the full basic header set

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**Turn problem+json into a message the user can understand**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**System status page**, so the support team can check it without calling a developer:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |

## Wiring the ready-made health router

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```


---

# skill: human-writing

Use before writing anything people read, in Thai or English

# human-writing — write like a person: smooth to read, easy to understand

## Use when
- Writing anything a person will read, from chat to labels in a diagram, in Thai or English.

Not for: the look of kept documents (headings, tables, text boxes, theme) → `polished-document-style` · abbreviations and glossaries → `spell-out-abbreviations`.

## Steps

### 1 · Core principles
- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

### 2 · Symbols and numbers
- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ). Do not chain sentences into fragments with `→` or `·`. If an outsider must guess what an arrow means, add words. In tables short text is fine, but it must read as human language, not code.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes. Use bold words instead, such as **หมายเหตุ**. Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` from the first place they appear.
- **Dates** in Thai text use พ.ศ. or ค.ศ., one style across the whole set. File names, codes, and machine-read data use `YYYY-MM-DD` in Common Era.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่`. Check results use `ผ่าน · ไม่ผ่าน`.

### 3 · Words
- Use words people actually say. No bureaucratic words or literal-translation jargon. Keep terms the field uses in English (token · prompt · API · OCR). Explain a coined or confusing term the first time. Abbreviations → `spell-out-abbreviations`.
- Call one thing by one word across the whole set: chat, slides, documents, diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ").
- **Cut items, not function words.** Every length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing, or moving content to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). They do work in the sentence; without them Thai turns curt and reads like a translation.
- Avoid AI-looking moves: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" · closing with "หวังว่าจะช่วยได้" · "หลาย" when you know the number · stacked hedges (hedge once, where you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ.") · claims a competitor could also make (put in a real name or number). For the look of the work, use `no-ai-look`.

### 4 · Answering in chat
- First sentence answers directly, then the reason. Short question → 2–3 sentences, no headings or tables.
- Table to compare 2 or more options or many numbers; list for several items to scan. No nested bullets (use a new bold heading). 2–3 short items go on one line with ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right, with no long apology. If unsure, say where and how to check; do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, close with 1 easy question.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" or "พูดง่าย ๆ": rewrite the last answer at half the length, no unexplained jargon, no new content.
- End with 1 thing they can do next. No recap.
- **Answering from a document or the web**: retell in your own words, never sentence-by-sentence translation · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · sources together at the end.

### 5 · Documents and reports
- The first paragraph is the conclusion; reading only it gives the point. Headings say what the content is, not the category name. At most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning. Footnotes are for definitions and number sources; never hide an important conclusion there.
- Work summaries and status reports: bold headings only as needed, **ผล** → **ที่ทำ** → **ต่อไป** (add headings for real content, such as awaiting approval). Cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision. Tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires; this skill covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the piece.

### 6 · Slides and headings of every kind
Applies to slide titles, figure titles, document headings, and box titles in a diagram.
- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader · the verb matches what the page shows · do not use "คน" for things that are not people.
- The caption under a picture must say what the picture does not; if it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

### 7 · Diagrams
- Box labels are short nouns of 1–4 words · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## Check before sending
1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Any padding to cut without changing meaning? Cut it, but `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding; if cutting made a sentence curt, put them back.
6. Does every heading pass section 6?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. The final verdict on language, taste and looks belongs to the user.

## References
- [`references/headings-and-examples.md`](references/headings-and-examples.md) — open for examples of every rule, the before → after heading table, and their sources
- [`references/thai-grammar.md`](references/thai-grammar.md) — open when writing Thai of 1 paragraph or more (sentence structure · register); example paragraphs in [`references/thai-examples.md`](references/thai-examples.md)
- [`references/strict-review.md`](references/strict-review.md) — open for research or work sent to outsiders
- [`references/thai-line-breaking.md`](references/thai-line-breaking.md) — open for Thai documents with justified alignment


## reference: headings-and-examples.md

# Headings, slides, diagrams and before → after examples (full version)

Read when writing a slide title, figure title or diagram label, or when you want examples of fixes. The short rules are in `SKILL.md` sections 6–7.

## Slides and headings of every kind

- A slide title = the conclusion of the page, not the topic name: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**Write titles that read smoothly and are not ambiguous.** This applies to slide titles, figure titles, document headings and box titles in a diagram.

- **A title with 2 parts needs a connector** (ส่วน · แต่ · เพราะ · จึง — as for · but · because · so). Do not just place 2 phrases side by side, because the reader has to guess how the 2 parts relate.
- **The connector must match the real relationship.** Use "เพราะ" or "จึง" only when one part really is the cause of the other. If the 2 parts just split roles, use "ส่วน". If they contrast, use "แต่". 1 title, 1 connector. If it needs 2, you crammed too much in: cut it down to one topic.
- **The title must still be short.** A slide title is at most 2 lines (about 15 words). If it is longer, move detail down into the page body. Do not add connectors until the title becomes a paragraph.
- **Use phrases people actually say.** If shortening leaves a string of nouns such as "AI ทำงานภาษา", find the verb people really use, such as "AI ช่วยเขียนคำตอบ".
- **Choose words by reader.** If the reader is not technical, use "ระบบ" (system) instead of "โค้ด" (code) and "ตรวจขาเข้า" (check incoming) instead of "Guard". Technical terms are fine when the reader is a technical team.
- **The verb must match what the page shows.** If a box in the figure is a checking step, use "ตรวจ" (check) or "ตัดสิน" (judge), not "ตัดสินใจ" (decide), which sounds like choosing a path.
- **Do not use "คน" (person) for things that are not people**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **The summary line under a figure must say what the figure does not.** If it is only an arrow chain of steps that repeats the figure, cut it, or replace it with 1 sentence saying why this figure matters.
- **Test**: read the title once to an outsider. If they cannot retell it in their own words, or have to ask "what does that mean", rewrite it.
- Page structure: problem → fix → result. Each part can be read in one glance.
- Write a speaking script the way it is actually spoken. It must read aloud without tripping.

## Diagram

- A box label is a short noun of 1–4 words that people understand: "รับข้อมูลเข้า" not "Ingress Layer Handler"
- An arrow label is a verb: "ส่งไฟล์" · "ตรวจสิทธิ์". An unlabelled arrow must be impossible to misread.
- Every word in the figure must match the word in the document.
- The figure title is a conclusion, like a slide title. Under the figure, 1 sentence says what to look at.
- If the project has a house style, follow it. For how to draw, see the figure skill of that plugin.

## Before → after examples

Write a condition as a full sentence with a connector (section 2):

  - Before: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - After: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - Before: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - After: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| Before | After |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทุกข้อความผ่าน 8 ขั้น: AI ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ | ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน |
| Guard ขาเข้า (ในรูปที่ทำให้คนทั่วไปดู) | ตรวจขาเข้า |
| guard ขาเข้า → ค้นคลังความรู้ → แนบกฎร้าน → Typhoon → guard ขาออก (บรรทัดใต้รูปที่ซ้ำกับรูป) | AI มีหน้าที่เขียนให้อ่านง่าย ส่วนเรื่องเงิน เวลา และกฎร้าน ระบบตรวจทุกครั้ง |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .claude/superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.claude/superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |
| `${CLAUDE_PLUGIN_ROOT}` คือ path ของ version ที่ติดตั้งอยู่ และจะเปลี่ยนเมื่อ plugin อัปเดต ส่วนโฟลเดอร์เก่าระบบจะลบทิ้งเองภายหลัง [ที่มา] | แต่ละ version ติดตั้งเป็นโฟลเดอร์ของตัวเอง พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่ แล้วลบโฟลเดอร์เก่าทิ้ง |
| ข้อยกเว้น: plugin จาก marketplace บน claude.ai … จะไม่ถูก pin ด้วยฟิลด์นี้ (แยกย่อหน้า) | … ไม่งั้นเครื่องที่ลงไว้จะใช้ชุดเก่าต่อ (ยกเว้น plugin จาก marketplace บน claude.ai ซึ่งเห็นการแก้ทันที) |

## Examples for the rules in SKILL.md (moved from SKILL.md)

| Section | Rule | Example |
|---|---|---|
| 1 | Plain words (English) | buy, not purchase |
| 2 | `→` order of steps | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` separates nouns | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` introduces detail | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | Write numbers as numerals | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | Say what the number means | "กำไร 32% ของราคาขาย" not a bare "margin 32%" |
| 2 | Compare so it is easy to picture | "เร็วขึ้น 3.2 เท่า" reads easier than "ลดลง 69%" |
| 2 | Uncertain result | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | Words people actually say | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | Abbreviation at first use | Large Language Model (LLM) |
| 3 | Coined term | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | Cut padding words | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | No stacked hedges | อาจจะ · น่าจะ · ในบางกรณี in one sentence |
| 4 | First sentence answers directly | Asked "ใส่ในรายงานดีไหม" → "ควรใส่ครับ", then the reason |
| 4 | Report by result | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | Cause and effect in one paragraph | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | Bold labels | **ระวัง:** · **สิ่งที่ยังอยู่:** not "**ระวัง (เจอบ่อย):**" |
| 5 | Heading says the content | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" is better than "ผลการทดลอง" |
| 5 | Column heading | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | Phrase people say | "AI ช่วยเขียนคำตอบ" not "AI ทำงานภาษา" |
| 6 | Words by reader | General reader: "ระบบ" "ตรวจขาเข้า" instead of "โค้ด" "Guard" |
| 6 | No "คน" for non-people | "ให้ระบบตัดสิน" |

Sources: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย (guide to drafting Thai documents)


## reference: strict-review.md

# Strict review — for research and work sent to outsiders

The default for `human-writing` is a **normal check**: go through the 7 points in section 8 of SKILL.md once, then send. Use this file only when the user asks for a **strict review** (ตรวจเข้ม).

**Passing the rules ≠ reading smoothly.** The review pass catches only what has a rule (sentence structure · words to avoid · register). Work that passes every rule but has no voice is called **flat** (`อ่านแบน`). Label it as flat. Do not report it as passing. Whether it reads like a person wrote it is for the user to decide by reading aloud, not for the model doing the check (the model that drafted and the model that checks share the same blind spots).

## When to turn it on

- The user says "ตรวจเข้ม" · "ตรวจแบบงานวิจัย" · "ขัดภาษาให้สุด" · "วนตรวจจนไม่เจอที่ผิด" · "strict"
- Or the work is a thesis · independent study (IS) · research article · report for a lecturer or committee · official letter, and the user did not ask for the quick version.
- For book structure, chapters and citations, use skill `thesis-writing` (plugin `personal-life`) alongside. This file covers language only.

## Steps

1. **Open [`thai-grammar`](thai-grammar.md) in full**, and [`thai-line-breaking`](thai-line-breaking.md) if the output is a file.
2. **Choose the register** from the table in section 4. Research uses the academic register. State the chosen register on the first line of the review result.
3. **Read the whole piece once first** without editing. For work over 3,000 words, review chapter by chapter. Tell the user how you split it, then carry on without stopping to ask.
4. **Review pass.** Run `python scripts/thai_tells.py <file>` first (the machine catches words to avoid · connectors over budget · mid-paragraph dots · ๆ with no space), then read it yourself for what the script cannot see. Record every spot in a table. Do not edit while recording.

   | # | Rule code | Original text | Fix |
   |---|---|---|---|
   | 1 | `t-chueung` | …ซึ่งพัฒนาโดย… ซึ่งเปิดเป็น… | … |

   **Sort by weight, not by the order found.** At the top are the spots that tell the reader at once a machine wrote it: canned opening sentences · recap at the end of a paragraph · groups of 3 everywhere · broad ad words · repeated sentence structures side by side. Then the small things (extra connectors · punctuation). Fixing the top 5 first often makes several of the lower ones vanish. A short piece with only small findings is fixed in one pass, with no loop.
   **Compare with the author's voice.** If there is text the user wrote themselves (`ก่อน → หลัง` pairs in `~/.claude/superuser-style.md` · earlier emails or chapters by the user), read against it: sentence length · pronouns · sentence-final particles · words the user never uses. Record each spot that differs from the user's voice with code `v-voice` in the table. If there are no samples, check against the rules only, and label the result `อ่านแบน` as usual (idea from humanizer by blader · MIT).
5. **Fix pass.** Fix according to the table, then reread the whole piece (do not look only at the fixed spots, because fixing one spot often makes the neighbouring joins stumble).
6. **Repeat steps 4–5** until the review pass finds nothing. **At most 5 rounds.** If spots remain after 5 rounds, report them with the reason they were not fixed.
7. If working under `superuser`, make each review round a new `reviewer` (small model · low effort), and let the lead do the fixing. The `reviewer` may report only the rule codes found, and does not judge whether it reads smoothly. For the fix pass, give the fixer the whole rule set, not just the points flagged (if you give only the flagged points, the fixer will keep going in circles).

## Extra checks for research

| Code | Check |
|---|---|
| `a-register` | Academic register throughout · no ครับ/ค่ะ · no ผม/ฉัน (use `ผู้วิจัย` or drop the pronoun) · every formal-side word in the pairs of the `r-drift` table · `สามารถ…ได้` complete |
| `a-term` | One word per technical term across the whole book · first use written as `ไทย (English)`, then Thai afterwards · abbreviations spelled out at first use in every chapter · matches the Royal Society of Thailand's coined terms where they exist |
| `a-claim` | Every statement of fact has a citation · no citing a source that was not opened · the researcher's opinion is clearly separated from fact |
| `a-hedge` | Hedge only as far as the data supports: a result from a small sample says `ในกลุ่มตัวอย่างนี้` · no stacked hedges · no claiming more than the result shows |
| `a-number` | Numbers have units · same decimals across a table · numbers in the text match the table · percentages state the base |
| `a-ref` | Tables, figures and equations are numbered and referred to in the text before they appear · figure and table titles are conclusions |
| `a-cite` | One citation style across the whole book (APA 7 or the faculty's) · the reference list at the end covers everything cited in the text |
| `a-tense` | The method chapter and results are told as things already done · do not switch between `จะ` and `ได้` in one chapter |
| `a-break` | After export, run `scripts/thai_linebreak.py --check` and open the PDF to look at every page |

## What to send the user

- First line: the register used · the number of rounds · `ผ่านกฎ` (passed the rules) or `เหลือ N จุด` (N spots left) · if flat, say `ผ่านกฎ · อ่านแบน` with the paragraphs worth reading aloud.
- A table of fixes across all rounds (rule code · old · new). It lets the user answer the committee about what was changed and why.
- Spots not fixed, and why (for example wording fixed by the faculty's template · quoted speech).
- The fixed file overwrites the original. Keep the original in `_to_delete/`.

Source of the review loop: skill `kode-thai` in [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT) · adapted with a cap on rounds, and used only on request, because the full version costs tens of thousands of tokens per round.


## reference: thai-examples.md

# Thai paragraph examples, before → after (one register at a time)

Open before writing a long Thai paragraph, and look at the pair for the register you will use. Example pairs teach better than rules, because you see sentence structure and tone together. Rule codes are in [`thai-grammar`](thai-grammar.md).

**Rules of this file.** 1 pair = 1 paragraph. The "after" must be text the owner wrote or edited. Text written by the team is labelled `(ชั่วคราว)` (temporary) until the owner reads it and accepts it. At most 10 pairs per register. When a new rule absorbs a pair, delete that pair. Every pair states its source and date.

## Register อธิบาย (explain): README and technical docs

**Before**

> ในยุคปัจจุบันที่ข้อมูลมีความสำคัญอย่างมาก ระบบนี้ถูกออกแบบมาเพื่อทำการประมวลผลข้อมูลจากหลายแหล่ง ซึ่งจะช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลได้อย่างมีประสิทธิภาพ โดยระบบจะทำการดึงข้อมูลทุก 5 นาที ดังนั้นผู้ใช้จึงไม่ต้องกังวลเรื่องข้อมูลไม่อัปเดต

**After**

> ระบบนี้รวมข้อมูลจาก 3 แหล่ง (ERP · ไฟล์ Excel ของฝ่ายขาย · API ของขนส่ง) ไว้ที่เดียว ข้อมูลพวกนี้ระบบจะดึงใหม่ทุก 5 นาที เปิดหน้า dashboard เมื่อไหร่ก็เห็นตัวเลขของ 5 นาทีก่อน ถ้าแหล่งไหนล่ม แถวของแหล่งนั้นจะขึ้นเวลาที่ดึงได้ครั้งสุดท้ายแทน

Rules applied: `t-block` (ในยุคปัจจุบัน) · `t-padding` (ทำการ ×2 · มีความสำคัญ) · `t-thuk` · `t-chueung` · `t-budget` (ซึ่ง โดย ดังนั้น in one paragraph) · `t-reassure` · `f1` put the data first · `f2` condition comes first · "หลายแหล่ง" → the 3 named sources · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ธุรกิจ (business): proposal to a customer

**Before**

> เรามีความยินดีที่จะนำเสนอโซลูชันที่จะช่วยยกระดับการทำงานของท่าน ไม่ว่าจะเป็นการจัดการเอกสาร การอนุมัติ หรือการรายงาน ซึ่งทั้งหมดนี้จะถูกรวมไว้ในแพลตฟอร์มเดียว โดยทีมงานของเราจะทำการติดตั้งและฝึกอบรมให้อย่างครบถ้วน

**After**

> บริษัทฯ เสนอระบบจัดการเอกสาร (Document Management System: DMS) ที่รวมงาน 3 อย่างของฝ่ายจัดซื้อไว้ในหน้าเดียว คือยื่นเอกสาร อนุมัติ และออกรายงาน ติดตั้งและอบรมผู้ใช้ 20 คนให้เสร็จภายใน 15 วันทำการ นับจากวันลงนามในสัญญา ค่าใช้จ่ายและเงื่อนไขอยู่ในหัวข้อ 4

Rules applied: register ธุรกิจ (`เรา` `ท่าน` → `บริษัทฯ` and the department name) · broad ad words (ยกระดับ · โซลูชัน) → what is actually done · `t-mai-wa` · `t-thuk` · `t-padding` · `t-doi` · key term at first use as `ไทย (English: abbreviation)` · a number replaces "อย่างครบถ้วน" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ราชการ (official): resolution in meeting minutes

**Before**

> ที่ประชุมได้มีการพิจารณาเรื่องการจัดซื้อเครื่องคอมพิวเตอร์ ซึ่งฝ่ายไอทีได้ทำการเสนอราคามาแล้ว โดยที่ประชุมเห็นว่ามีความเหมาะสม ดังนั้นจึงมีมติให้ทำการจัดซื้อต่อไป ทั้งนี้ให้ฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จโดยเร็ว

**After**

> ฝ่ายเทคโนโลยีสารสนเทศเสนอจัดซื้อเครื่องคอมพิวเตอร์ 12 เครื่อง วงเงิน 420,000 บาท ตามใบเสนอราคาเลขที่ QT-2569-031 ที่ประชุมพิจารณาแล้วเห็นว่าราคาอยู่ในงบประมาณที่ได้รับอนุมัติ มติที่ประชุม อนุมัติให้จัดซื้อตามที่เสนอ และมอบฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จภายใน 30 วัน นับจากวันที่รับรองรายงานการประชุมฉบับนี้

Rules applied: `t-padding` (ได้มีการ · ทำการ ×2 · มีความเหมาะสม) · `t-chueung` · `t-doi` · `t-budget` (ดังนั้น · ทั้งนี้) · extras for the official register: call departments by their real names · figures and document numbers · keep `ดำเนินการ` because it is a standard form word · deadline `ภายใน X วัน นับจาก…` instead of "โดยเร็ว" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ข่าว (news): release note

**Before**

> ในเวอร์ชันนี้ เราได้ทำการปรับปรุงประสิทธิภาพในส่วนของการส่งออกรายงาน ซึ่งจะทำให้ผู้ใช้ได้รับประสบการณ์ที่ดียิ่งขึ้น นอกจากนี้ยังมีการแก้ไขข้อผิดพลาดต่าง ๆ อีกมากมาย

**After**

> ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จากเดิม 12 วินาที เพราะเปลี่ยนมาเขียนไฟล์ทีละก้อนแทนสร้างทั้งไฟล์ในหน่วยความจำ แก้บั๊กวันที่ใน Excel แสดงเป็น ค.ศ. ทั้งที่ตั้งค่าเป็น พ.ศ. (ฝ่ายบัญชีแจ้งเมื่อ 2 ต.ค.) เวอร์ชัน 2.4.0 · 22 ต.ค. 2569

Rules applied: register ข่าว (no `เรา` · first sentence says who does what to what · close with version and date) · `t-padding` · `t-block` (ในส่วนของ) · `t-chueung` · `f7` (นอกจากนี้) · "ต่าง ๆ อีกมากมาย" → say what was fixed · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register แชตร้าน (shop chat): replying to a customer about a late parcel

**Before**

> สวัสดีค่ะ ทางร้านต้องขออภัยในความไม่สะดวกเป็นอย่างสูงนะคะ ทางร้านได้ทำการตรวจสอบแล้วพบว่าพัสดุของลูกค้าอยู่ระหว่างการจัดส่ง ทางร้านจะทำการติดตามให้อย่างใกล้ชิด ไม่ต้องกังวลนะคะ

**After**

> ขอโทษด้วยนะคะที่ของยังไม่ถึง ร้านเช็กกับ Flash แล้ว พัสดุเลข TH1234 ออกจากศูนย์คัดแยกลาดกระบังเมื่อเช้านี้ ปกติถึงบ้านภายใน 1–2 วันค่ะ ถ้าพรุ่งนี้เย็นยังไม่ได้รับ ทักมาได้เลย ร้านจะเปิดเรื่องตามกับขนส่งให้ทันทีค่ะ

Rules applied: register แชตร้าน (`ทางร้าน` ×3 → `ร้าน` once per sentence · ค่ะ in every message · keep the apology, because polite words are not padding) · `t-padding` (ทำการ ×2) · `t-reassure` → the next step the customer can take · "อย่างใกล้ชิด" "อย่างสูง" → facts (parcel number · sorting centre · time) · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

---

Registers with no pair yet: marketing · personal · academic · complaint · job application · screen. Add them from the owner's edits under the rules above (`thai-grammar` section 8). The 5 team-written pairs above wait for the owner to read them aloud and accept or edit them.


## reference: thai-grammar.md

# Smooth Thai: 7-point composition framework · words to avoid · registers

Open this file when writing or editing Thai of 1 paragraph or more, or when a strict review is ordered (see [`strict-review`](strict-review.md)). Short chat messages, labels, buttons and variable names do not need it.

Thai written by AI carries English sentence structure: sentences run long, are chained with "ซึ่ง" and "โดย", and open the same way every time. Deleting banned words fixes only the symptom. The cause is sentence structure, covered by the 7 points below. Once the structure is right, most of the smaller rules pass by themselves.

Every rule has a code (`f1` · `t-chueung`) to cite during review.

**Contents**

- [1 · The 7-point composition framework](#1--the-7-point-composition-framework)
- [2 · Moves AI likes to use (fix on sight)](#2--moves-ai-likes-to-use-fix-on-sight)
- [3 · Grammar AI often gets wrong](#3--grammar-ai-often-gets-wrong)
- [4 · Registers](#4--registers)
- [5 · Loanwords: pick 1 form per word, use it throughout](#5--loanwords-pick-1-form-per-word-use-it-throughout)
- [6 · Closing](#6--closing)
- [7 · Translating English into Thai](#7--translating-english-into-thai)
- [8 · Discipline for adding rules, and companion files](#8--discipline-for-adding-rules-and-companion-files)

## 1 · The 7-point composition framework

| Code | Point | Before (literal translation) | After (Thai) |
|---|---|---|---|
| `f1` | **Put the topic first.** Do not drag a long subject along as in English. Stop using `การที่…นั้น…` and `การที่ X ทำให้ Y`. | ระบบประมวลผลข้อมูลพวกนี้ทุก 5 นาที | ข้อมูลพวกนี้ ระบบจะ process ทุก 5 นาที |
| `f2` | **Condition and time come first.** Do not trail them at the end with "เมื่อ…". | DB จะเริ่ม timeout เมื่อ traffic พุ่งสูง | พอ traffic พุ่ง DB ก็เริ่ม timeout |
| `f3` | **Start a new sentence with a space or a new paragraph.** Do not put a full stop after every sentence. Use a full stop at the end of a paragraph, or between 2 long sentences on different topics. | เร็วขึ้น. ใช้ memory น้อยลง. ทีมพอใจ. | เร็วขึ้น ใช้ memory น้อยลง ทีมพอใจ |
| `f4` | **Close the clause with a final word:** `ด้วย` `แล้ว` `เลย` `อยู่` `อยู่ดี` `ต่างหาก`. A "ไม่ได้…อย่างเดียว" or "ไม่ใช่แค่…" sentence must close with `ด้วย`. A "ไม่ได้อยู่ที่ X อยู่ที่ Y" sentence must close with `ต่างหาก`. | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุน | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุนต่างหาก |
| `f5` | **Drop a subject that is already known, and use a demonstrative instead of a pronoun** (`ตัวนี้` `เคสนั้น` `ตรงนี้แหละที่…`). Do not use `มัน` `เขา` `พวกเขา` for it/they. Take care not to drop so much that it is unclear who acts. | มันลด memory และมันยังปรับปรุงการทดสอบ | ทั้งลด memory และยังปรับปรุงการทดสอบอีกด้วย |
| `f6` | **Use "ก็" to control rhythm:** `พอ X ก็ Y` · `ถ้า X ก็ Y` · `X แล้วก็ Y`. Link a sequence of actions with `แล้ว`. | ถ่ายรูปบิล ระบบอ่านรายการให้เอง | ถ่ายรูปบิลแล้วระบบจะอ่านรายการให้เอง |
| `f7` | **Change topic with a question, a demonstrative or "แต่"** instead of `อย่างไรก็ตาม` `นอกจากนี้` (this cuts about half of them). After listing 2–3 problems, put a turning point before the fix. | อย่างไรก็ตาม การใช้งานจริงมีข้อจำกัด | แต่พอขึ้น production จริง ก็มีเรื่องให้ปวดหัวอีก |

**"ก็" does not go everywhere (`f6-scope`).** A `…ทีไร` sentence does not need ก็ (`ลองทีไร พังทุกที`). A `ไม่ว่าจะ…เมื่อไหร่` sentence needs `ก็จะ`. A result that is the definition of its cause (cost = price of raw materials) takes no ก็ (`วัตถุดิบขึ้นเมื่อไหร่ ต้นทุนต่อจานขึ้นตามทันที`).

## 2 · Moves AI likes to use (fix on sight)

| Code | Move | Fix |
|---|---|---|
| `t-chueung` | "ซึ่ง" chained several levels deep | At most 1 ซึ่ง per sentence. Use "ที่" when the noun is clear. Or split the sentence. |
| `t-budget` | Frequent formal connectors | Per paragraph: ซึ่ง ≤ 1 · โดย ≤ 1 · ดังนั้น ≤ 1. `ทั้งนี้` does not open a paragraph (allowed near a disclaimer or a call to action). This budget does **not** count the final words `ด้วย` `แล้ว` `เลย` `อยู่`, nor `เพื่อ…เพื่อ` in official letters. If a final word reads oddly, restructure the sentence, do not delete the word. In an explanatory article, order connectors ดังนั้น → นอกจากนี้ (rarely) → แต่. |
| `t-doi` | `โดยที่… โดยการ… โดยมี…` | Use ผ่าน · จาก · ด้วย, or no connector at all. |
| `t-khanathi` | `ในขณะที่` used to mean "while (contrast)" / "but" | `A เชื่อ X แต่ B เชื่อ Y` · `ส่วน B กลับเชื่อ Y` (ในขณะที่ = the same period of time) |
| `t-thuk` | ถูก- in every sentence (literal passive) | ถูก/โดน is for bad things or an unknown doer. Otherwise say who did it. |
| `t-padding` | ทำการ · มีการ · ได้มีการ · มีความ + adjective · ที่มีความ | Use the verb directly: `ซับซ้อน` not `มีความซับซ้อน`. Exception: `เป็นความ + verb` (`เป็นความตั้งใจ`) must be kept. |
| `t-khong` | ของ…ของ…ของ | Join the nouns directly: `การพัฒนาเศรษฐกิจไทย` |
| `t-nueng-nai` | หนึ่งใน…ที่สุด (one of the most) | `…ที่สุดคนหนึ่ง` |
| `t-mai-wa` | ไม่ว่าจะเป็น A, B หรือ C (merely listing items) | `A B หรือ C` · `ทั้ง A B และ C` |
| `t-hedge` | Stacked hedges `อาจจะมีความเป็นไปได้ที่จะ` | A single `อาจ`, exactly where you are truly unsure. |
| `t-pronoun` | เรา…เรา…เรา / ท่าน | Drop after the first sentence. Address the reader as `คุณ`, not `ท่าน` (except in official letters). |
| `t-mun` | `มันเป็นที่ชัดเจนว่า` (it is clear that) | `ชัดเจนว่า` |
| `t-comma` | Commas around a modifier `แฮรารี, นักประวัติศาสตร์, แย้งว่า` | Use spaces. |
| `t-dash` | Long dash — and ; | Use a space, a new paragraph, or ที่/ซึ่ง. |
| `t-particle` | ครับ/ค่ะ in document body text | Allowed only in chat, quoted speech and personal blogs (opening, closing, and when speaking to the reader directly, such as `มาดูกันครับ`). |
| `t-overcut` | Cutting words until it turns curt: `อยากช่วย` `ใช้ template` `ส่งมา` | Thai does not "pay rent" on every word the way English does. `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` and the polite words `ขอ` `รบกวน` `นะ` do real work: `อยากจะช่วย` · `ให้ใช้ template` · `รบกวนส่งมาด้วยนะครับ`. The "cut words" rule of other skills applies only to padding words (`t-padding`). |
| `t-reassure` | Vague soothing `ไม่ต้องกังวล` `สบายใจได้` | End on a fact and the next step: `แอดมินจะแจ้งผลภายในพรุ่งนี้ค่ะ` |
| `t-force` | `ระบบบังคับให้…` `ระบบไม่อนุญาตให้…` (the system forces… / does not allow…) | Tell it as a capability or a sequence: `ต้องยืนยันอีเมลก่อน ถึงจะเข้าใช้ได้` (`ถึงจะ` for sequence · `ก็ต่อเมื่อ` for a single condition) |
| `t-samrap` | `สำหรับผมแล้ว ผมคิดว่า` · `สำหรับ…นั้น` opening a sentence | `ผมว่า…` · put the topic first as in `f1` |
| `t-topology` | Telling structure instead of the case `มีเส้นทางเชื่อมระหว่าง A กับ B` | Tell who does what and what happens: `ลูกค้ากดสั่ง ร้านเห็นรายการทันที` |
| `t-considered` | `ถูกพิจารณาว่าเป็น` `ถูกมองว่า` (is considered) | `ถือว่าเป็น` · `คนมองว่า` · or say who is looking. |

**Words and phrases to avoid (`t-block`).** Fix on sight, unless inside `` ` `` or quotation marks (quoted for discussion):

`ในยุคปัจจุบัน` · `ในโลกปัจจุบัน` · `ในโลกที่…` · `เป็นที่ทราบกันดีว่า` · `เป็นที่รู้กันว่า` · `ปฏิเสธไม่ได้ว่า` · `เป็นสิ่งสำคัญที่ต้องตระหนัก` · `มีความสำคัญ` (use `สำคัญ`) · `การที่…นั้น` · `ในเรื่องของ` · `ในส่วนของ` · `อย่างมหาศาล` · `อย่างน่าทึ่ง` · `อย่างไม่น่าเชื่อ` · `ทุกสิ่งที่คุณต้องรู้เกี่ยวกับ` · `โดยสรุปแล้ว` · `กล่าวโดยสรุป` · `นั่นเอง!` · `รีบ…เลย!`

Ad words that are acceptable when paired with a number: `อย่างมาก` · `อย่างมีประสิทธิภาพ` (business documents only) · a single `!` at a hook or call to action on a sales page, not elsewhere.

## 3 · Grammar AI often gets wrong

| Code | Topic | Example |
|---|---|---|
| `g-classifier` | Wrong or missing classifier | server 1 `เครื่อง` · function/parameter 1 `ตัว` · token/record 1 `อัน` · บรรทัด · หน้า · รายการ. If unsure, avoid counting. The official register needs exact classifiers (ถัง · ฉบับ · ราย); informal registers may use `อัน` `ตัว`. |
| `g-cha` | Missing `จะ` in a future or hypothetical sentence | `จะเลือกตัวไหนขึ้นอยู่กับ…` · `วิธีนี้จะคุม rate ได้` |
| `g-function` | Short connector used with the wrong function | `จะ` ≠ `จน` · informal language uses `เวลา` `ตอนที่` instead of `เมื่อ` · `เหมาะกับ` needs กับ |
| `g-verb` | Literally translated verb | burst ≠ `ระเบิด` (use `ยิง`) · drop ≠ `ทิ้ง` (use `ปฏิเสธ`) · match ≠ `ซ้ำ` (use `ตรง`) · cap ≠ `ครอบ` (use `จำกัดไว้ที่`) · throttle ≠ `บีบคอ` (use `ชะลอ` `หน่วง`). A verb that is a physical image in English often needs a different Thai verb. |
| `g-capability` | สามารถ…ได้ (can) | Academic, official and news writing use the full `สามารถ + verb + ได้`. General writing uses `verb + ได้`. |
| `g-time` | Period of time takes ของ | `ในศตวรรษที่ 20` not `ของศตวรรษที่ 20` |
| `g-tirai` | `ทีไร` must close with `ทุกที` or `ไม่เคย…สักที` | `ฝนตกทีไร น้ำท่วมทุกที` · `ทุกครั้ง` is weaker and breaks the idiom · `ทีไร…เสมอ` is borderline, avoid. |
| `g-quant` | A number paired with a feeling verb | `ตัวเลขไม่ตรงกับที่คาด` not `ที่รู้สึก` |
| `g-yamok` | Mai yamok attached to the word `ต่างๆ` `บ่อยๆ` | Put a space before and after: `ต่าง ๆ` `บ่อย ๆ` throughout. Source: spacing rules item ๑.๒.๑๕.๑ "เว้นวรรคเล็กหน้าและหลังเครื่องหมายไปยาลใหญ่ ไม้ยมก …" with example `วันหนึ่ง ๆ เขาทำอะไรบ้าง` · Royal Society of Thailand office https://www.orst.go.th/iwfm_table.asp?a=36 (checked 2026-10-26 · royin.go.th could not be opened from this machine; the same site moved to orst.go.th) |

## 4 · Registers

Choose the register before writing, then keep it for the whole piece (`r-drift`). Change only at a new heading.

| Work | Register | Final particle ครับ/ค่ะ | Speaker/reader |
|---|---|---|---|
| Technical docs · README · manuals · explanatory articles | อธิบาย (explain) | None | `เรา` / `คุณ` |
| Sales pages · landing pages | การตลาด (marketing) | None | `คุณ` only in the body (do not use `เจ้าของร้าน` `ผู้ใช้` in place of คุณ) |
| Personal blog · telling experience · team announcements | ส่วนตัว (personal) | Opening, closing, and when speaking to the reader directly | `ผม` / `ดิฉัน` according to the author (if unknown, use the owner's default in `~/.claude/superuser-style.md` and note it as `ตัดสินใจเอง`) |
| News · release notes · announcements · CHANGELOG | ข่าว (news) | None | No first person · first sentence says who does what to what · the source goes in sentence 2 · close with the version, date or source · `ดังนั้น` only when there is a real cause |
| Thesis · IS · research article · long analysis | วิชาการ (academic) | None | `ผู้วิจัย` or drop the pronoun · `เรา` only for shared experience |
| Official letters · meeting minutes · policy | ราชการ (official) | None | No first person · use standard-form wording (word table below) |
| Company letter to a customer · proposal · BRD FSD SRS · company profile | ธุรกิจ (business) | None | `บริษัทฯ` or the team name, not `เรา` · `คุณ` only in steps telling the reader to do something · key term at first use `ไทย (English: abbreviation)` |
| Customer chat · live selling · review replies · broadcast | แชตร้าน (shop chat) | In every message (ค่ะ or ครับ, one style for the whole shop) | The shop calls itself `ร้าน` or `แอดมิน` once per message · customer is `คุณลูกค้า` or dropped · end on a fact and the next step, no vague soothing (`t-reassure`) |
| Complaint letter · refund request · contract cancellation | ร้องเรียน (complaint) | None | `ข้าพเจ้า` · recipient `ท่าน` or the company name · facts, dates, amounts before the demand · deadline `ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้` · no threats, no apology |
| CV · job application letter · salary negotiation · LinkedIn | สมัครงาน (job application) | None in a CV · yes in letters and messages to HR | `ผม` / `ดิฉัน` · a CV bullet starts with a verb and ends with a number (`ลดเวลาปิดงบจาก 8 วันเหลือ 5 วัน`) · no `ซึ่งทำให้` |
| On-screen text · buttons · errors · notifications · placeholders | หน้าจอ (screen) | None | `คุณ` or dropped · a button starts with a verb (`บันทึก` `ส่งคำขอ`) · an error = what happened + what to do next, in 1–2 sentences · no stacked `กรุณา` `ท่าน` `ครับ/ค่ะ` · 1 word per action across the whole app, kept in a glossary |

**Person and reader do not switch within a paragraph (`r-deixis`).** Teaching uses `เรา`, advising uses `คุณ`, never mixed in a paragraph. In text that speaks to the reader, `ใคร` `คน` `ผู้ใช้` do not appear in place of the reader: `ขาดทุน แต่ไม่มีใครรู้` → `ขาดทุนโดยไม่รู้ตัว`

**Extra for the official register** (temporary · from one set of examples, waiting for real letters to confirm). A procedure sentence = doer + method + what is done + destination. Call documents by their real names, do not abbreviate like notes (`15/30/45`). Word swaps: เซ็น → `ลงนาม` · ทำ → `ดำเนินการ` · เช็ค → `ตรวจสอบ` · ส่งให้ → `ส่งมาเพื่อ…` · open questions → `ประเด็นที่ยังต้องการคำชี้แจง`. The official correspondence regulation in force is edition 4 of B.E. 2564 (checked 2026-10-22, edition 5 not found).

**Extra for the marketing register.** A single `!` at a hook or call to action · `…` as a coach-style pause is allowed in financial work · a soft close (`ลองได้เลย`) is better than a curt command · do not open a sales page with a definition `X คือ…` · financial work closes with 1 sentence of advice on moderation (`กู้เท่าที่จำเป็นและชำระคืนไหว`) and folds the disclaimer into a sentence in the same voice.

**Word pairs where you pick one side for the whole piece (`r-drift`)**

| Informal | Formal (academic · official) |
|---|---|
| ยังไง | อย่างไร |
| คนไหน · แบบไหน | คนใด · รูปแบบใด |
| เยอะ | มาก · จำนวนมาก |
| ทำไม | เพราะเหตุใด |
| ตอนนี้ | ขณะนี้ · ปัจจุบัน |
| อยากรู้ | ต้องการทราบ |

**Extra for the academic register.** Sentences may be long but must alternate with short ones · `ทว่า` `อย่างไรก็ตาม` `นอกจากนี้` only at real turning points · assert directly, do not hedge if the source did not hedge · open with a question or the frame of the topic, not something broad · close by posing a new question, not by recapping.

## 5 · Loanwords: pick 1 form per word, use it throughout

| Form | Use when | Example |
|---|---|---|
| Translate to Thai | A Thai word people know exists, or the Royal Society of Thailand coined one | เสรีภาพ · ผลิตภาพ · ทุนนิยม |
| Write the sound in Thai | Proper names, new words with no direct Thai word | อัลกอริทึม · บล็อกเชน · ซอฟต์แวร์ |
| Keep English letters | Brand names, abbreviations, terms developers use in English | Google · API · deploy · query |
| Coin a Thai term + brackets at first use | A core concept used repeatedly · abbreviations | ระเบียบในจินตนาการ (imagined order), then Thai only afterwards · ปัญญาประดิษฐ์ (Artificial Intelligence: AI), then Thai or AI, one style for the whole piece. This is the one form for every plugin (`spell-out-abbreviations` · `srs-writing` · `thesis-writing` refer here). |

Mix English only at a single noun or verb (`deploy โค้ด` `query ตาราง`), not `ทำการ deployment ของ code`. Write sounds in Thai following the Royal Society of Thailand's transliteration rules: no tone marks, unless the word's sound collides with a Thai word and causes confusion, such as `โค้ก` (item ๕) (`ซอฟต์แวร์` not `ซ้อฟต์แว่ร์`). Add the silencer mark (karan) on letters that are not pronounced (item ๓.๑). Choose 1 spelling per word and note it. (Source: Office of the Prime Minister announcement, "Rules for transliterating English", announced 26 August B.E. 2532, Royal Gazette volume 106 part 153, 14 September 1989 · read the PDF published by the Royal Society of Thailand https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000753.PDF pages 1-5, checked 2026-10-26 · the consonant table (table 2) has not been compared letter by letter.) Write a foreign person's name in Thai, then English in brackets at first use: `ไมเคิล แซนเดล (Michael Sandel)`. Do not use commas around a modifier.

## 6 · Closing

No recap (`c-recap`). End with what to do next, a newly posed question, or simply stop.

## 7 · Translating English into Thai

Use when the source is English (docs · error messages · papers · articles) and the result is Thai for people to read. Retell the whole paragraph, do not translate sentence by sentence.

1. Reorder by `f1` `f2`: topic first, condition and time first. Turn English passives back into who-did-it (`t-thuk`), except for bad things or an unknown doer.
2. Add nothing the source lacks: no ครับ/ค่ะ, no `อาจจะ` or other hedges the source did not make. Do not drop numbers or conditions.
3. Translate idioms by meaning, not word by word. For an author's metaphor used throughout the piece, coin 1 Thai word and use it every time (section 5, row 4).
4. `it is … that …` `there is` `one of the most` have no Thai form: `ชัดเจนว่า` · `มี…` · `…ที่สุดคนหนึ่ง` (`t-mun` `t-nueng-nai`) · `is considered` is not `ถูกพิจารณาว่า` (`t-considered`).
5. English italics used for emphasis become a final word or word order in Thai (`ต่างหาก` `เลย` `แหละ`), not italics. Foreign person's name `ไมเคิล แซนเดล (Michael Sandel)` at first use.
6. Technical terms stay English per section 5. Verbs that are physical images (burst · cap · throttle · drop) take a different Thai verb each (`g-verb`). Choose classifiers yourself, do not translate `a` `an`.
7. Read the whole paragraph aloud. If you can tell the source was English, restructure it.

## 8 · Discipline for adding rules, and companion files

- **A new rule needs a source:** the owner's edit (before → after) · a source actually opened, with its date · or a real run result. If none, tag it `(ชั่วคราว)` (temporary), like the extra official-register rule above.
- **The user edits an agent's Thai.** Before adding a rule, search this file for whether the rule already exists. If it exists but was not applied, fix the wording or move the rule, and do not add a duplicate. If not, store the before/after pair in [`thai-examples`](thai-examples.md) first (the "after" text must be the user's, not one the agent wrote). Only when it repeats 2 or more times, summarise it into a rule. The examples file keeps at most 10 pairs per register, and a rule that absorbs a pair deletes that pair.
- **Before/after pairs teach better than rules.** Before writing a long Thai paragraph, open [`thai-examples`](thai-examples.md) and look at the pair for the register in use.
- **Automatic checker** `scripts/thai_tells.py` catches `t-block` `t-budget` `t-padding` `f3` (mid-paragraph full stops) `g-yamok` `t-dash` and `ทั้งนี้` opening a paragraph. It only warns, and does not judge whether the text reads smoothly. What the script cannot see (`f1` `f2` `f4`–`f7`, register) you still have to read yourself.
- **Thai letters in exported files** (line breaking · spacing · line-height per medium) live only in [`thai-line-breaking`](thai-line-breaking.md). Other skills link to it.

---

Source: distilled from [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT License · Copyright (c) 2026 Chakrit Wichian · full licence text in [`THIRD-PARTY-NOTICES`](../THIRD-PARTY-NOTICES.md)): the 7-point framework · files `ai-tells` · `grammar` · `register` · `style-rules` · `forbidden-phrases` · `decisions/` (polite words are not an AI tell · Thai does not cut words the English way · do not let the model judge language quality · example pairs before rules), checked 2026-10-22. Academic sources as cited by that repo: Iwasaki & Ingkaphirom · Takahashi 2023 (ก็) · Olsson 2013 (แล้ว) · spacing rules of the Royal Society of Thailand. The 5 extra register rows (business · shop chat · complaint · job application · screen) come from sweeping the templates in the SQT-Marketplace plugins on 2026-10-22.


## reference: thai-line-breaking.md

# Breaking Thai words so lines wrap cleanly

Use whenever you export a Thai document as Word · PDF · HTML · slides with justified paragraphs, or when you see a line with stretched letter spacing (`เ ท ค โ น โ ล ยี`).

## Why it happens

Thai has no spaces between words, so the program must guess where to break. If it cannot guess (a run tagged as English · a font that does not support Thai · a file generated by a script), the whole block of Thai text becomes one long word. The previous line is left with empty space, and justification then stretches the spacing letter by letter to fill the line.

## Fix by file type

| File | Fix |
|---|---|
| **.docx** (made by you or received) | Run `python scripts/thai_linebreak.py <file>.docx` after the file is built. It inserts invisible break points (U+200B) between words · tags runs as Thai · binds numbers to neighbouring words ("4 ประเด็น" does not split across lines) · keep the original in `_to_delete/` · test the script itself with `python -B scripts/thai_linebreak.py --self-test` (pythainlp not needed). |
| **.md before converting with pandoc** | Run the same script on the .md · code inside `` ` `` is not touched. |
| **python-docx / docx-js** | Set the Thai language on the run (`w:lang w:bidi="th-TH"`) and the complex-script font (`w:rFonts w:cs="TH Sarabun New"`) at creation time, then run the script at the end. |
| **HTML** | Chrome · Edge · Firefox break Thai words on their own, no ZWSP needed · set `<html lang="th">` · CSS `word-break: normal; overflow-wrap: anywhere; line-break: auto;` · use `text-align: left` for Thai content · never `word-break: break-all` (breaks mid-word). |
| **PDF** | Fix at the source (.docx or HTML), then convert again. |
| **Slides .pptx** | Thai text boxes left-aligned · long text cannot go through the script, so break lines by hand at phrase boundaries. |

## Paragraph alignment

- General Thai content: **left-aligned** is the safest.
- Academic or official work that needs justification: use "ชิดสองข้าง" (justify, `both`) only **after** running the script.
- Do not use "กระจายแบบไทย" (Thai distribute, `thaiDistribute`) or "กระจาย" (distribute, `distribute`) for body text, because they stretch letters on every line. The script reports paragraphs that use them, and can change them with `--align both` or `--align left`.

## Never break here

- A number and its unit or prefix: `4 ประเด็น` · `ตารางที่ 1` · `พ.ศ. 2569` · `50 %`
- Before `ๆ` `ฯ`, and before vowels or tone marks that cannot start a line.
- Short proper names: `IEEE Transactions`. If it is hard to read after wrapping onto a new line, hold it together with a non-breaking space.

## Line spacing per medium (the central values other skills refer to)

Thai has upper vowels, lower vowels and tone marks that can stack 2 levels, so it needs more line spacing than Latin. Pure Latin can use 1.2–1.4, but for Thai below about 1.4 the upper vowels and tone marks collide or get clipped. The values in the table are the central values the skills in this set use. Change them here, and the skills that refer to them follow.

| Medium | Body text | Headings | Used by |
|---|---|---|---|
| Web page (CSS `line-height` times font size) | 1.6 · long articles 1.75–1.85 | Thai not below 1.4 · large pure-Latin headings can go down to 1.0–1.1 | `web-app-design` · `dynamic-website` |
| Mobile app | 1.5–1.75 · the smaller the screen, the more spacing | Not below 1.4 | `mobile-app-design` |
| Windows app | 20px at 14px text for on-screen text · long paragraphs 22px | Follow the Fluent scale | `windows-app-design` |
| Slides | Not below 1.5 | Not below 1.4 | `presentation-design` |
| Graphics · posts · posters | 1.5–1.7 | Not below 1.4 | `brand-kit` · `graphic-design` |
| Diagram | Not below 1.5 | — | `diagram-figures` |
| Word .docx (Tahoma font) | 1.3–1.35 as "Multiple" (หลายเท่า) | Follow the template | `branded-document-design` |

**Word does not count the same way as CSS.** "Multiple" in Word multiplies the line height that the font itself defines, and Thai fonts already reserve room for vowels and tone marks. So the number in Word can be lower than on the web without lines colliding. Whenever you change the font, reopen the PDF and look at every page again.

**Web pages must tolerate user adjustment.** WCAG 2.2 criterion 1.4.12 (level AA) requires that when the user sets line spacing to 1.5 times the font size, content must not be cut off or overlap. How to check is in `web-quality-audit`.

## Check

1. Run `--check` to see the number of break points and the paragraphs that are distributed.
2. Convert to PDF and open every page, looking for lines with abnormally wide letter spacing.
3. The word segmenter (pythainlp `newmm`) can break wrongly now and then, for example `ท่า|ทางการ` where it should be `ท่าทาง|การ`. A wrong break point does not change the text, it only may start a new line mid-word. If you find it on a real line, fix that spot by hand.

**Good to know:** the invisible break points are in the actual file. Searching for a word in Word mostly still finds it, but if you copy text into another system and search fails, run the script on the print copy only.
