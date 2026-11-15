> Design of a "Deep Research Agent system" as a product: the user types one topic and gets a report with references · sources actually opened were checked on 2026-10-27 · `(ยังไม่ได้ตรวจ)` (not yet checked) = not yet opened and read · `อนุมาน` (inferred) = our own conclusion, not what the web page says
>
> This file is a map of the system. The detail of each piece is in the files and skills it points to, not copied again here.

**Contents**

- [1. Architecture](#1-architecture)
- [2. Queue](#2-queue)
- [3. Budget and stopping](#3-budget-and-stopping)
- [4. Browser agent](#4-browser-agent)
- [5. Research PDFs and vector DB](#5-research-pdfs-and-vector-db)
- [6. Citation checking](#6-citation-checking)
- [7. Web app and users](#7-web-app-and-users)
- [8. Metrics to watch](#8-metrics-to-watch)
- [9. Worked example](#9-worked-example)
- [10. Check before sending](#10-check-before-sending)
- [11. Sources](#11-sources)

## 1. Architecture

Before building, answer first whether multi-agent is worth it → [`agent-systems.md`](agent-systems.md) section 1 · search work that splits into separate paths fits · work where every agent needs the same context does not ([A2])

```text
ผู้ใช้ → API → planner → คิว → worker หลายตัว → ตัวตรวจอ้างอิง → writer → รายงาน
                 ↑__________ ถ้าข้อมูลยังไม่พอ planner ออกคำถามย่อยเพิ่ม __________|
```

| Role | What it does | Why separate |
|---|---|---|
| planner (orchestrator) | Splits the topic into sub-questions, sets the budget, decides whether it is enough | Holds the whole plan in one place, so the others need not know the big picture |
| worker | Searches one sub-question with its own tools (web · browser · PDF · vector DB) and returns a short conclusion with its source | Each one has clean context, searches in parallel, and one failing does not fail the whole job |
| citation agent | Matches every claim to the text in the source | So the writer does not check its own work |
| writer | Composes the report, charts, cover image from claims that have already passed only | Separates finding from writing |

Systems that really exist (opened and read):

| System | Structure the doc page describes | How to use it |
|---|---|---|
| Anthropic Research ([A2]) | A lead agent plans and stores the plan in memory · subagents search in parallel in their own context · a CitationAgent at the end finds where each claim should cite | The main reference pattern of this design |
| GPT Researcher ([G1]) | A planner creates questions · execution agents search each one · summarise and link back to sources · a publisher merges into a report · searches in parallel | See how it filters content before it enters the LLM |
| LangChain open_deep_research ([L1]) | Uses a different model for each role (summarise · search · compress · write report) · searches through Tavily by default · has MCP · older versions have a supervisor with parallel researchers | See the split of models by role (the steps of the current version are not stated in the README: not yet checked in `configuration.py`) |
| Stanford STORM ([S1]) | 2 phases: gather information and make an outline → write the article with references · asks from many perspectives · Co-STORM lets a person steer | See how it opens perspectives before splitting sub-questions |

## 2. Queue

| Ask first | This answer → Kafka | This answer → a simpler queue is enough |
|---|---|---|
| How many receivers of an event | Several (worker · progress recorder · statistics collector) read the same stream | One kind of worker takes the job |
| Must we read events back (replay after a bug fix · look back at why a report was wrong) | Yes | Do it and discard |
| Does anyone look after a cluster | Yes, or use a managed service | No |

The criteria above are taken from [`kafka-streaming`](../../kafka-streaming/SKILL.md) section 1 · if the answer is "one receiver, no read-back", use a background job queue (Redis · Simple Queue Service (SQS) · a job table in the database) per [`background-jobs`](../../background-jobs/SKILL.md) · start simple and move when you can measure that it is not enough (`อนุมาน`, inferred) · most of our jobs run for minutes and are one job per report, so they fall on the "no Kafka needed" side from the start · if the user's brief already fixes Kafka, follow it and record the reason (several receivers + read-back) in an Architecture Decision Record (ADR) → `adr-writer`

If using Kafka:

- 1 sub-question = 1 message, with `report_id` as the key so that the jobs of one report stay in one partition and in order
- A worker must be repeatable with an unchanged result, because a message may arrive twice (at-least-once) · write a worker's result keyed by `report_id + question_id` → `principle-safe-to-rerun`
- A job that fails more than the limit goes to a dead-letter topic (DLQ), not loops forever → `kafka-streaming`
- Scale workers by backlog with KEDA reading consumer lag → [`kubernetes-helm/references/keda-queue-scaling.md`](../../kubernetes-helm/references/keda-queue-scaling.md) · set the worker ceiling by money budget, not by queue length (section 3)

## 3. Budget and stopping

Numbers from a source ([A2]): an agent uses about 4 times the tokens of a chat · multi-agent about 15 times · tokens explain 80% of the difference in results on BrowseComp · Anthropic says it pays off only for high-value work. This number is Anthropic's own and at that time used Opus 4 and Sonnet 4; our system must measure its own

| Level | What to set | Behaviour on hitting it |
|---|---|---|
| Per report | Total tokens · number of search rounds · number of concurrent workers · total time | The planner stops opening new questions and writes from what it has, stating it is incomplete |
| Per worker | Number of tool calls · tokens · time | Return what it found and tag it "ไม่ครบ" (incomplete) |
| Per user | Monthly or daily quota, deducted at actual use when a worker finishes | Refuse before starting if the estimate exceeds the quota · see the quota pattern in [`saas-platform`](../../saas-platform/SKILL.md) (usage metering) |
| Whole system | KEDA worker ceiling (`maxReplicaCount`) · daily money ceiling | Stop accepting new jobs and tell the user the queue is full |

The effort-scaling rules from [A2] serve as a starting point, then adjust with eval: a simple fact question 1 agent with 3–10 tool calls · a direct comparison 2–4 subagents with 10–15 calls each · complex research more than 10 subagents with clearly split duties · the planner must choose the level from the difficulty of the topic, not use the top level every time

Conditions to stop searching (must be written in the planner's instructions and enforced in code too, not relying on the instructions alone):

1. Every sub-question has an answer with at least 1 checked source
2. The latest round brought no new claims (information saturated)
3. Any one budget in the table above is hit

Why it must be enforced in code: when simulating prompts, Anthropic saw agents keep going even after getting enough results ([A2])

## 4. Browser agent

An agent that clicks around the web meets strangers' text all the time · Open Worldwide Application Security Project (OWASP) calls this indirect prompt injection: outside content carries hidden instructions, and the model obeys ([O1]) · Anthropic measured its own browser agent at an attack success rate of 1.4%–2.4% after adding defence layers, across 4 Claude models (Sonnet 4.5 from 13.8% in the bare model down to 1.9%), and says itself that 1% is still a risk and not fully solved ([A3]), so design on the assumption that someone can break in

| Item | Do |
|---|---|
| Where it runs | A single-use throwaway container with no secrets and no access to the internal network · `docker-sandbox` |
| Text in web pages | Is data, not instructions · wrap it in delimiters and tell the model it is untrusted content ([O1]) |
| Permissions | Only what the search task needs: read-only · no form submits, no purchases, no deletes · risky work gets a person's approval ([O1]) |
| User credentials | Not given to the browser agent · pages that need login are out of scope, tell the user to send the file themselves |
| Output leaving the worker | Check the format with code (schema) · the worker has no tool to send data outside ([O1]) |
| robots.txt and site terms | Read and follow before fetching · the RFC 9309 standard (September 2022) says robots.txt is "not a form of access authorization" ([R1]), only a courtesy agreement for crawlers, so also read the site's terms of use · do not bypass paywalls or logins |
| Domain limits | A domain denylist and a rate limit per domain |

Test with web pages we make ourselves that carry hidden instructions, and pass them before release (adversarial test per [O1]) · include in the eval in section 6

## 5. Research PDFs and vector DB

The full process (splitting · chunk · embedding · hybrid search · rerank) is in [`rag-architecture.md`](rag-architecture.md). Here is only where research differs:

- To get provenance at page and paragraph level: store metadata on every chunk = `source_id` · url or DOI · title · author · year · page · character position · fetch date · file hash (to know when the source changed)
- Split chunks by the article's headings (abstract · method · results) and keep the parent chunk so the writer can use wider context, following the parent-child pattern in `rag-architecture.md`
- Tables, formulas, figures in articles: check that the text extractor really reads them, and if not, tag "ตัวเลขจากตารางยังไม่ได้ยืนยัน" (numbers from the table not yet confirmed), which is better than giving a wrong number
- The memory store (vector DB) keeps checked results for reuse across reports, must be split by user or tenant and carry a date so old data can be cut · do not store results that have not passed the checker
- A PDF the user uploads is that user's private data, not mixed into the shared store · file storage route → `file-upload-and-storage`

## 6. Citation checking

Every claim in the report must have a record (claim, source_id, quoted text, location) that the checker can match

1. Split the draft report into claims one at a time (numbers, names, dates, conclusions)
2. For each one: pull the text from the source at the stated location and have the checker answer "does this text confirm the claim?" = confirmed · partly confirmed · not confirmed
3. Not confirmed → cut it or rewrite it to match the source · partly confirmed → lower the confidence of the sentence · never keep a claim with no source
4. Compare numbers and names with code first, then use the model (checking by code is cheaper and does not hallucinate) · the check must be real, not the model saying it checked → [`agent-systems.md`](agent-systems.md) section 7
5. A source that is a URL: open it for real this round, do not use a link the model remembered

Measure with eval (a set of about 20 real topics as a starting point per [A2], then add from the errors found):

| Metric | Meaning |
|---|---|
| citation precision | Claims cited correctly ÷ all claims cited |
| citation recall | Claims with correct sources ÷ all claims that should have sources |
| faithfulness | Whether the answer is grounded in the retrieved context (defined in `llm-evaluation-patterns.md`) |
| source quality | [A2] used an LLM judge to score accuracy, citations, completeness, source quality, and tool efficiency, and found that people must also test, because people saw the agent prefer SEO sites over primary sources |

How to build the test set, judge with an LLM judge, and A/B → [`llm-evaluation-patterns.md`](llm-evaluation-patterns.md) · set the pass threshold as a number before starting to measure (`(รอยืนยัน)` awaiting confirmation from the project owner)

## 7. Web app and users

| Topic | Do | Pointer |
|---|---|---|
| Login | Session or OAuth per user · check permissions at the API every time, not at the screen | `auth-implementation-patterns` |
| Per-user quota | Reserve quota when accepting the job, return the unused part at the end · show the remaining balance before pressing start | `saas-platform` |
| Job status | The user sees "แตกคำถาม → ค้น 7/12 → ตรวจอ้างอิง → เขียน" (split questions → search 7/12 → check citations → write) as a stream (Server-Sent Events (SSE) or WebSocket) · store status in the database so a new page still shows it | `web-service-essentials` |
| Job fails midway | Keep a checkpoint per sub-question and continue from the same point, not restart ([A2] recommends resuming from a checkpoint) · releasing a new version must not kill running jobs ([A2] uses rainbow deployment) | `jenkins-pipeline` · `kubernetes-helm` |
| Scheduled repeat research | A schedule table in the database creates jobs into the same queue as normal jobs, counting quota the same way · prevent double runs with the key `schedule_id + time slot` · compare the new round with the previous one and say what changed | `background-jobs` |
| Personal data in the topic | A topic may contain a person's name or health data · tell the user before sending · do not put the full topic in logs (store the job ID) · set a retention period for reports and allow deletion · Anthropic watches the agents' decision patterns and does not store conversation content, to protect privacy ([A2]) | `pdpa-compliance` · `logging-standards` |
| Back office | View jobs by user · cost per report · adjust quota · stop runaway jobs · every admin action is logged | `audit-trail` |

## 8. Metrics to watch

How to collect and alert with Prometheus and Grafana → [`observability-basics`](../../observability-basics/SKILL.md) and [`prometheus-grafana.md`](../../observability-basics/references/prometheus-grafana.md) · below is what this system must have (the metric names are our proposal)

| Metric | Example name | Why watch |
|---|---|---|
| Time per report (p50 · p95) | `research_report_duration_seconds` | Does the user wait too long |
| Tokens per report by role | `research_tokens_total{role}` | Shows where the money goes, and compares with the budget |
| Backlog in the queue | consumer lag (Kafka exporter) | The same one KEDA uses to scale |
| Rate of claims that fail the check | `research_claims_rejected_total` ÷ total | A spike = a worker or a source has a problem |
| Reports that hit the budget before finishing | `research_budget_hit_total{limit}` | Budget set too low, or the planner searches wastefully |
| Tool errors | `research_tool_errors_total{tool}` | Sites blocking · browser hanging |

Keep a trace per report to follow how the agent decided · [A2] added full production tracing because agents are non-deterministic and hard to debug · do not use `user_id` or the topic as a Prometheus label (too many values)

## 9. Worked example

The user's brief: type one topic, get a report with references · schedule repeat research · a web app for customers and a back office · staging then production

| Layer | Choice | Section in this file |
|---|---|---|
| User | Web app, login, per-user quota, streamed status | 7 |
| API | Receive topic → check quota → create job → pass to planner | 3 · 7 |
| planner | Split sub-questions, choose effort level, send into the Kafka topic `research.questions` | 1 · 3 |
| worker | 4 kinds: web search · browser agent (sandbox) · read PDF · search vector DB · each kind is its own deployment, scaled by KEDA on lag | 2 · 4 · 5 |
| Results | topic `research.findings` → citation checker → claims that pass go to the database | 6 |
| writer | Compose from claims that passed · charts → `data-analysis` · cover image → `graphic-design:image-generation` · Word export → `markdown-report-docx` | 1 |
| Scheduling | A scheduler in the database creates jobs into the same API | 7 |
| Release | Docker image → Jenkins tests + eval → Helm to staging → check → production | `jenkins-pipeline` · `kubernetes-helm` |
| Monitoring | Prometheus + Grafana per section 8 | 8 |

Recommended build order (`อนุมาน`, inferred): get planner + web-search worker + citation checker + writer running in one process and passing eval first → split into queue and services → add other worker kinds (PDF, then browser agent because it is the riskiest) → add scheduling and quota · if it does not yet pass eval when run as one, splitting services will only make debugging harder

## 10. Check before sending

- [ ] Every claim in the 20 sample-topic reports has a source the checker can match, and citation precision / recall have been reported
- [ ] Hit every budget level and the system stops and reports "ไม่ครบ" (incomplete), does not hang, does not overspend
- [ ] A test web page carrying hidden instructions does not make a worker obey or send data out
- [ ] User A sees and is charged only A's quota · the memory store does not mix across users
- [ ] Kill a worker mid-job, and the job continues from the checkpoint with no duplicate results
- [ ] KEDA scales up and down with lag at staging and does not exceed the ceiling
- [ ] Every metric in section 8 has a chart, and at least 3 have alerts (time · backlog · claims failing)
- [ ] Before delivering, run `security-gate` and `principle-prove-it-works`

## 11. Sources

Every link was actually opened 2026-10-27. Company figures are reported by the company itself, with no independent reviewer

| Code | Source | Used for |
|---|---|---|
| A2 | [Anthropic, How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (2025-06-13) | orchestrator-worker structure · CitationAgent · 4x and 15x · effort-scaling rules · eval · production |
| A3 | [Anthropic, Mitigating the risk of prompt injections in browser use](https://www.anthropic.com/research/prompt-injection-defenses) (2025-11-24) | Attack success rate of a browser agent |
| O1 | [OWASP, LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | indirect injection · least privilege · human approval · adversarial test |
| R1 | [RFC 9309, Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html) (September 2022) | robots.txt is not an authorization |
| G1 | [GPT Researcher](https://github.com/assafelovic/gpt-researcher) | planner · execution · publisher |
| L1 | [LangChain open_deep_research](https://github.com/langchain-ai/open_deep_research) | Split models by role |
| S1 | [Stanford STORM](https://github.com/stanford-oval/storm) (Shao et al., NAACL 2024, arXiv:2402.14207) | pre-writing · multiple perspectives |

Not checked: the real cost per report of our system · the internal steps of the current open_deep_research version · numeric criteria of SQS/Redis versus Kafka (use the criteria in `kafka-streaming` instead)
