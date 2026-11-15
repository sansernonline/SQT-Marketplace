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

# skill: audit-trail

Use when a system must record who did what and when

# Audit trail

> **One rule:** a trail cannot be built after the fact.
> The day a customer asks "who changed this price", if it was not recorded beforehand, it can never be answered.

## When to use this skill

- The system has approvals, money, user permissions, or personal data
- A customer or auditor can ask "who did it, when, and what was changed from what to what"
- There was a dispute over edited data and nobody could answer
- The system falls under the Personal Data Protection Act (PDPA) or a standard that must be checkable after the fact

## When to use another skill, or together

| Job | skill | |
|---|---|---|
| Logs for technical troubleshooting | `logging-standards` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `srs-writing` | together |
| Abbreviations in work that people read | `spell-out-abbreviations` | together |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| Who reads it | developers, when troubleshooting | auditors · customers · the legal team |
| What it records | anything that helps troubleshooting | **only events with business meaning** |
| Where it is kept | files · a log collection system | **a table in the database**, or storage that cannot be overwritten |
| Lifetime | 7–90 days | **years, as the law or contract requires** |
| Can it be edited | does not matter | **never edit, never delete** |
| Can it be lost | some loss is acceptable | **cannot be lost.** If the write fails, the transaction must fail with it |

> **Always keep these 2 separate.** An audit log mixed into the general log files
> gets deleted by the log retention period within a month, and nobody finds it when it is needed.

---

## 2 · Fields every entry must have

| Field | Example | Note |
|---|---|---|
| `id` | UUIDv7 | sortable by time |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC**, and the time it happened, not the time it was recorded |
| `actor_id` | `1042` | the user id, not the name, because names can change |
| `actor_type` | `user` · `system` · `api_client` | automated jobs need an identity too |
| `actor_ip` · `user_agent` | | keep only when needed for the audit |
| `action` | `order.cancelled` | **a past-tense verb**, in one style across the system |
| `entity_type` · `entity_id` | `order` · `1042` | the thing acted on |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | only the fields that changed |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" (customer phoned to cancel) | required for actions that need a reason |
| `correlation_id` | `01J9Z8…` | links back to the application log |
| `result` | `success` · `denied` | **denied attempts must be recorded too** |

> **A denied action is worth more than a successful one**, because someone trying to reach something
> they have no right to is what auditors most want to see, and it is the best warning sign there is.

---

## 3 · Which events to record

**Record:**

| Group | Examples |
|---|---|
| money and contracts | create/cancel/refund · price change · discount change |
| approvals | approve · reject · send back for fixing |
| permissions and identity | grant/revoke permission · create/close account · change password · consecutive failed logins |
| personal data | view · edit · export · delete |
| system settings | changing a value that affects the whole system |
| bulk data access | exporting a report · downloading a name list |

**Do not record:** ordinary screen views · searches · sorting · clicks that change nothing.
An audit log that records everything is worth the same as none, because nothing can be found in it.

**Name actions in one style across the system:** `<entity>.<past-tense verb>`, for example `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · How to record "what changed"

| Method | Good | Bad |
|---|---|---|
| **Record only the changed fields (from/to)** ✓ | small, readable at once | to see the whole picture you must trace back |
| Record the whole row before and after | full picture | grows very fast and risks keeping more sensitive data than needed |
| Record only that "it was edited" | smallest | **cannot answer the question**, so do not use it |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**For sensitive fields, record only that it changed, not the value:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · Never edit after writing

- Grant the audit table only **INSERT and SELECT**. The account the app uses must have no UPDATE or DELETE permission.
- Write in the same transaction as the real data change. **If the audit write fails, the transaction must fail with it.**
- Never edit history to "tidy up". If a record is wrong, add a correction entry. Do not overwrite.
- A system that needs stronger protection should chain the entries with hashes, to prove nobody inserted or deleted anything.

**Retention** follows the law or the contract. Accounting documents in Thailand usually must be kept 5 years.
When the period ends, move them to cheap storage. Never delete them without someone's approval.

---

## 6 · Who can view, and what must not be recorded

| Topic | Rule |
|---|---|
| Read permission | only roles with an audit duty, and **reading the audit log must also be recorded in the audit** |
| Export | record every time who exported which period |
| **Must not record** | passwords · tokens · ID card numbers · health data · the content of personal data |
| Record instead | point to **which item** was viewed or edited, not the content inside |

> `patient_record.viewed` with the `entity_id` is enough. **Never copy test results into the audit log.**
> Otherwise the audit log becomes the most sensitive data store in the system, without anyone meaning it to.

---

## 7 · Show it to people

The history screen must filter by at least 4 things: **time period · actor · action type · which item**.

Show it as a sentence people can read, not raw JSON (the sample below is the Thai text shown to Thai users: on 25 Sep 2569 [B.E.; 2026] at 16:42, Somchai (sales) cancelled order SO-2026-00042, status: confirmed → cancelled, reason: customer phoned to cancel):

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

Show the time in the viewer's time zone, but store it as UTC (see `i18n-and-locale`).

---

## 8 · Anti-patterns

- **Keeping the audit in general log files**: deleted by retention within a month
- **Recording the actor's name instead of the id**: when they change their surname, the old history turns into a different person
- **Recording only successes**: the denied attempts are what auditors look for
- **Recording only "edited data"** without saying from what to what
- **The app has UPDATE permission on the audit table**: a trail that can be edited is not a trail
- **Writing the audit outside the transaction**: the transaction succeeds but there is no record
- **Recording every click**: the important entries sink in a pile of data nobody uses
- **Copying sensitive data into the audit**: it creates a new leak by accident
- **No screen to view it**: the data exists, but a developer must run a query every time a customer asks


---

# skill: pdpa-compliance

Use when software stores personal data in Thailand

# PDPA — personal data

> **The one rule:** data you never collect cannot leak, needs no care and never has to be deleted.
> The first question is always "do we need to collect it?", not "how do we keep it safe?"

> Caution: this is guidance for people who build systems. **It is not legal advice.**
> Anything with legal effect must be decided by a legal adviser.

## Shortcut — apps whose data stays on the user's device only

If the app has no server, no accounts and sends no data out, skip the sections on processors and databases. Then check only these 3 things.

| Item | Why it still matters | What to do |
|---|---|---|
| Android Auto Backup | By default the system backs up app data to Google Drive on its own | Set `android:allowBackup` and `android:dataExtractionRules` to match your intent, and record the reason in `decision-log` |
| Export · share sheet (the system's share window) | This is the only way data leaves the device | Send only what the user selected, and do not attach location or image metadata without telling them |
| Data the app store forces you to declare | Google Play requires the Data safety form for every app | Fill it in truthfully (if you collect nothing, say so). Whether requesting camera permission requires a privacy policy is `(รอยืนยัน)` (awaiting confirmation), so prepare a short page first |

If you later add analytics · crash reports or user accounts, the app is no longer device-only. Go back and apply the whole skill.

## When to use this skill

- The system stores names, phone numbers, emails, addresses, ID card numbers, photos or other data that identifies a person
- A customer or the legal team asks about PDPA compliance
- You must build a consent page, or a page where users request deletion of their data
- You will send data to an outside service provider

## When **not** to use it

| Task | Use this instead |
|---|---|
| A trail of who did what to the data | `audit-trail` |
| Tables and column-level encryption | `database-design` |
| Authentication and permissions | `auth-implementation-patterns` |
| Masking data in logs | `logging-standards` |
| Where to keep keys | `config-and-secrets` |
| Consent forms, privacy notices and a company's PDPA documents (not a software system) | (if plugin `e-commerce` is installed) `e-commerce:pdpa-workflow`; if it is not, use item 3 of this skill as the outline |

---

## 1 · Make the inventory first

**Without this inventory you cannot answer "where is my data?"**

| Data | Stored where | Why collected | Legal basis | Kept how long | Who can see it | Sent to whom |
|---|---|---|---|---|---|---|
| Full name | `users.name` | Identify the customer | Contract | 5 years after the account closes | Sales · admins | — |
| Phone number | `users.phone` | Send delivery status | Contract | Same as the row above | Same as the row above | SMS provider |
| National ID number | `kyc.id_number` | Legally required identity check | Legal obligation | 10 years | Compliance team | — |

**List every place that really holds data**: main database · backups · logs · analytics systems ·
file storage · spreadsheets the team keeps by hand · mobile apps (Android Auto Backup and files exported through the share sheet)

---

## 2 · Legal basis — not everything needs consent

| Basis | Use when | Example |
|---|---|---|
| **Contract** | Needed to provide the agreed service | Delivery address |
| **Legal obligation** | The law requires you to keep it | Tax documents |
| **Legitimate interest** | Necessary, and does not harm rights excessively | Security logs · fraud prevention |
| **Consent** | No other basis works | Marketing · behavior-tracking cookies |

> **Consent is the weakest basis because it can be withdrawn at any time.**
> If you ask consent for the delivery address and the person withdraws, the system cannot ship.
> **The delivery address uses the contract basis**, not consent.
>
> A button labeled "accept all" that blocks use of the service unless pressed does not count as freely given consent.

---

## 3 · Consent that works in practice

| Required | Details |
|---|---|
| **Separate by purpose** | Email marketing · behavior tracking · sharing with partners — separate checkboxes |
| Not pre-ticked | It must be the user's own action |
| Text an ordinary person can understand | Not a 500-word legal paragraph |
| **Recorded** | Who · for what · when · which text version · through which channel |
| Withdrawing is as easy as giving | If it takes 1 click to give, it must take 1 click to withdraw |
| Withdrawal takes real effect | **Code must actually stop using that data**, not just store the flag |

Required table: `consent` — `user_id` · `purpose` · `granted` · `granted_at` · `withdrawn_at` ·
`policy_version` · `source` · `ip`
**Keep it as history, never overwrite.** You must be able to prove later what the person agreed to at that time.

---

## 4 · Data subject rights

The system must be **able to do these for real**, not wait for manual work each time. In general you must respond within 30 days.

| Right | What the system must be able to do |
|---|---|
| Access | Produce a copy of all that person's data |
| Rectification | Correct inaccurate data, then **pass the correction on to every place the data was sent** |
| **Erasure** | Delete for real from every place in active use, including logs. For backups, take them out of use (if one is restored, delete again) and let them expire through the rotation cycle (see item 6). Tell the data subject by which date the data in backups will be gone. |
| Restriction | Stop using the data temporarily without deleting it |
| Portability | Export in a machine-readable format |
| Objection | Stop the marketing or processing the person objects to |

> **"Erasure" is the hardest one.** Data sits in the database, backups, logs, analytics systems
> and outside providers. **Design for deletion from day one**, not a hunt afterward.
>
> Soft delete alone **does not count as deletion**. Data the law requires you to keep (such as tax documents)
> may be kept, but you must tell the data subject what you keep and why.

---

## 5 · Collect only what you need

| Principle | Example |
|---|---|
| **Do not ask for what you do not use** | An online shop does not need the national ID number |
| Store a range instead of the exact value | Store an age range, not the birth date, if you only use it to group people |
| **Hash or anonymize** for analytics | A statistics system does not need to know who is who |
| Column-level encryption | ID numbers, health data |
| Mask on display | `x-xxxx-xxxx-12-3` |
| **Keep sensitive data out of the main table** | Easier to restrict and audit |

**Sensitive data has a stricter tier** (section 26), for example race, ethnic origin, political opinion, creed, religion or philosophy, sexual behavior,
criminal record, **health data**, disability, trade union data, genetic data, biometric data, and other data that affects the subject in a similar way.
It may be collected only when truly necessary, and needs stricter measures than usual (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act B.E. 2562, 2019) section 26, checked 22 Oct 2026 (B.E. 2569))

**Never use real data on development machines or staging.** Always mask it first (see `cicd-and-release`).

---

## 6 · Retention

- Set it **per data type**, not one value for the whole system
- **Have a real deletion job that runs on a schedule.** A policy with no job running does not exist.
- Logs that contain personal data also have a lifetime (see `logging-standards`)
- Data backups need a rotation cycle that makes old data disappear on its own in the end
- Before the first real deletion, show the list of what will be deleted and have a person approve it

---

## 7 · Outside providers and sending data abroad

| Topic | What to do |
|---|---|
| List of processors | List what data goes to whom — cloud · SMS · email · analytics · chat |
| Contract | Have a data processing agreement with every one |
| Sending abroad | Check that the destination country has adequate standards, or that standard contract clauses cover it |
| Analytics and ad trackers | Count as sending data out — **they need a legal basis** |
| Ending a service | You must get the data back and have them delete it for real |

> **The most commonly forgotten spot:** an analytics plugin added on day one sends users' behavior
> data abroad every day, and nobody ever put it on the list.

---

## 8 · When data leaks — the first 72 hours

| Order | What to do |
|---|---|
| 1 | **Stop the leak first** — revoke keys, close the channel |
| 2 | Assess the scope — what data, how many people, is it sensitive |
| 3 | Preserve evidence — logs and system state **before** you overwrite anything |
| 4 | Notify the internal owner and the legal adviser at once |
| 5 | **Notify the สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Committee Office) within 72 hours** when the conditions are met |
| 6 | Notify the data subjects when the risk to them is high |
| 7 | Record the incident with `postmortem-template` |

**Prepare in advance, not when it happens** — who decides to notify · the legal adviser's phone number ·
the notification message template · how to pull the list of affected people

---

## 9 · Anti-patterns

- **Asking consent for everything** — when they withdraw, the system cannot keep working
- **Pre-ticked checkboxes** — they do not count as consent
- **Storing consent as one value `accepted_terms = true`** — you cannot prove later what was agreed
- **Soft delete, then saying it is deleted**
- **A retention policy with no real deletion job**
- **Real data on staging** — and copied onto developer machines
- **Collecting the national ID number "just in case"**
- **Personal data in logs and crash reports**
- **No list of outside providers** — you cannot say where the data goes
- **Exporting a full-data Excel file** for someone who needs only the totals
- **A privacy policy that does not match what the system really does**

---

## 10 · Frequently cited sections, and abbreviations

Use this when a customer or the legal team asks "which section is this?" (checked against the unofficial English translation of the 2019 Act, Royal Gazette 27 May 2019 (B.E. 2562), on 23 Oct 2026 (B.E. 2569))

| Topic (item in this skill) | Section |
|---|---|
| Consent (item 3) | 19 |
| Legal bases that need no consent (item 2) | 24 |
| Sensitive data (item 5) | 26 |
| Sending data abroad (item 7) | 28 |
| Data subject rights (item 4) — access · portability · objection · erasure · restriction · rectification | 30 · 31 · 32 · 33 · 34 · 35–36 |
| Security measures · deletion system on expiry · breach notice in 72 hours (items 6, 8) | 37(1) · 37(3) · 37(4) |
| Records of processing (item 1) | 39 |
| Data Protection Officer (DPO) | 41 |
| Compensation · punitive damages | 77 · 78 |
| Administrative fines, maximum 1 · 3 · 5 million baht | 82 · 83 · 84 |

**Sectors with a second layer of rules** — health · finance · telecom have their own regulators (กระทรวงสาธารณสุข (Ministry of Public Health) · ธปท. (Bank of Thailand, BOT) / ก.ล.ต. (Securities and Exchange Commission, SEC) / คปภ. (Office of Insurance Commission, OIC) · กสทช. (National Broadcasting and Telecommunications Commission, NBTC)) that add conditions on confidentiality, retention and breach notice. Check that sector's rules before designing, and do not rely on PDPA alone (idea from BV thai-pdpa (MIT))

- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
- **Personal data** — data that identifies a person, directly or indirectly
- **Sensitive data** — the special category of personal data, such as health, race, religion
- **Data controller** — whoever decides how data is collected and used (usually the system owner)
- **Data processor** — whoever processes data on the controller's instructions, such as a cloud provider
- **Data subject** — the person the data belongs to

## 11 · Links to other skills

| Need | Use with |
|---|---|
| A trail of who viewed or changed data | `audit-trail` |
| Tables, encryption and soft delete | `database-design` |
| Masking data in logs | `logging-standards` |
| Access rights and authentication | `auth-implementation-patterns` |
| Masking real data before loading staging | `cicd-and-release` |
| Sending and unsubscribing from marketing messages (consent stays in this skill) | `notifications` |
| Masking data in exported files | `data-import-export` |
| Retention of attached files | `file-upload-and-storage` |
| Jobs that delete expired data | `background-jobs` |
| Recording the incident after a leak | `postmortem-template` · `incident-runbook-template` |


---

# skill: cicd-and-release

Use when setting up or fixing a CI/CD pipeline

# Continuous Integration / Continuous Delivery (CI/CD) and releasing

> **The one rule:** build once, then carry the **same artifact** to every environment.
> If you rebuild when going to production, what passed testing and what the customer runs are not the same thing.

## When to use this skill

- Setting up a pipeline for a new project, or rebuilding an old one that is slow or gives untrustworthy results
- Deciding about branches, versions, environments, or how to release
- Deploys often break, or you cannot roll back
- Someone asks "which version and which commit is production running right now?"

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| Where secrets are stored and how they rotate | `config-and-secrets` | instead |
| The pipeline runs on Jenkins (Jenkinsfile · credentials · approval input) | `jenkins-pipeline` | alongside |
| Dockerfile · Helm chart · deploy to Kubernetes | `kubernetes-helm` | alongside |
| Proportion and scope of tests | `testing-standards` | instead |
| Writing a migration | `database-design` | instead |
| Steps when the system is down | `incident-runbook-template` | instead |
| Writing release notes for users to read | command `/release-notes` | instead |
| Test proportion for each layer in the pipeline | `testing-standards` · `e2e-testing-patterns` | alongside |
| Health check the pipeline uses to decide | `web-service-essentials` | alongside |
| Steps when a deploy breaks the system | `incident-runbook-template` · `postmortem-template` | alongside |
| Commit messages that can generate release notes automatically | `commit-message-format` | alongside |
| Abbreviations in work that people read | `spell-out-abbreviations` | alongside |

**Working pipeline files for GitHub Actions, Azure DevOps and GitLab** are in `references/per-platform.md`.
**Read more when needed:** [`references/deployment-plan-template.md`](references/deployment-plan-template.md) — plan template

---

## 1 · Pipeline stages

| Order | Stage | Blocks when | Acceptable time |
|:--:|---|---|---|
| 1 | Check code format + lint | a rule is broken | < 1 minute |
| 2 | Build | compile fails · a warning set as an error appears | < 3 minutes |
| 3 | Unit test | a test fails · coverage is below the threshold | < 5 minutes |
| 4 | Check dependencies + secrets leaked into git | a high-severity vulnerability or a secret is found | < 2 minutes |
| 5 | Create the artifact + stamp the version | — | < 2 minutes |
| 6 | Deploy to staging | — | |
| 7 | Integration + end-to-end test | a test fails | < 15 minutes |
| 8 | **Human gate** (production only) | nobody has clicked approve yet | |
| 9 | Deploy to production | — | |
| 10 | Post-deploy check | a failed health check triggers an automatic rollback | < 2 minutes |

**Stages 1–5 are CI. They must run on every pull request**, not only at merge.
**Stages 1–5 together should finish within 10 minutes.** If they take longer, people start looking for ways to skip them.

---

## 2 · Build once, then promote

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (this one)
                                           ├→ uat      (same one)
                                           └→ production (same one)
```

- An artifact is a file that can really be deployed: a container image · a published zip file · a package
- **Environments may differ only in the config applied at run time**, not in a new build
- Keep artifacts for at least 30 days so you can go back, because a rollback means deploying an old artifact, not rebuilding from an old commit

> Wrong: **running `git pull` on the production machine and building there.** Nobody then knows which commit is running,
> and the dependencies pulled at that moment may not be the set that was tested.

---

## 3 · A version must trace back to a commit

Use Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| Which number goes up | When |
|---|---|
| MAJOR | a change that breaks the callers (see the table in `api-conventions`) |
| MINOR | a new capability; old behavior still works |
| PATCH | a bug fix |

- **The git tag is the source of truth.** `v1.4.0` points to exactly one commit.
- Attach the commit hash to the artifact too, for example `1.4.0+abc1234`
- The `/version` endpoint must return the same value (see `web-service-essentials`). A mobile app with no endpoint shows it on the "About" page instead.
- **Exception for Flutter / Android:** the number after `+` in `pubspec.yaml` is the versionCode, which must be an integer, so it cannot hold a hash (see the section "Android / Flutter apps")
- Before 1.0.0, use `0.x` and treat big changes as still allowed

---

## 4 · Branches

| Style | How | Fits |
|---|---|---|
| **trunk-based** (recommended) | short-lived branches of 1–2 days, merged into `main` often · unfinished work hidden behind a feature flag | most teams · frequent releases |
| release branch | `main` + `release/1.4` for urgent fixes | software that customers install themselves · several versions to maintain at once |
| gitflow | `develop` + `feature` + `release` + `hotfix` | big releases, rarely · usually more complex than needed |

**Rules that hold whichever style you pick:**

- `main` must be deployable at all times
- Protect `main`: require a pull request and a green CI, and never push directly
- Expect merge conflicts on any branch older than 1 week
- Delete the branch right after merging (`gh pr merge --delete-branch`) · turn on "Automatically delete head branches" in the repo's Settings → General on GitHub so it deletes after every PR · a deleted branch can be restored from the PR page

---

## 5 · Environments and gates

| Environment | Data | Who deploys | What it must pass |
|---|---|---|---|
| dev | fake | automatic on every commit | build passes |
| staging | production-like (masked) | automatic on merge into `main` | unit + integration |
| uat | production-like | the team clicks | users pass their testing |
| production | real | **a person clicks approve** | everything above |

- Staging must be as close to production as possible: database version, operating system, config values
- **Never copy real data into staging without masking personal data**
- If you have only one environment because of budget, say so plainly in the documents and use feature flags to help

---

## 6 · Secrets in the pipeline

- Store them in the platform's secret store, not in pipeline files
- Grant only the permissions that stage needs. For example, the build stage does not need the production database password.
- A pipeline that runs from an outsider's fork **must not see secrets**
- The tool that detects secrets leaked into git must sit at stage 4, not run once a year

Full detail is in `config-and-secrets`.

---

## 7 · Database migration in the pipeline

```
deploy schema (expand) → deploy code → check → deploy schema (contract) in the next round
```

- Run the migration as **its own stage** before the code deploy, not when the app boots
  (if several app instances boot at once, the migrations collide and can corrupt data)
- Use an account that can change the schema only in this stage. The account the app runs with must not be able to change the schema.
- A migration must work with the previous code version too, or rolling back the code will break the system
- Always back up first, and **test that the restore really works**
- **Exception: databases on the user's device** (SQLite · sqflite · drift on mobile) must migrate when the app opens, because there is no other way.
  The rules above apply to server databases shared by several instances. For an on-device migration, write tests that start from every schema version ever released.

For the expand/contract method, see `database-design` item 9.

---

## 8 · Release methods

| Method | How it works | Needs | Fits |
|---|---|---|---|
| stop and replace | shut down → replace → start | nothing | internal systems · can shut down at night |
| **rolling** | replace machines one at a time | a reliable health check · both versions can run together | the default for systems that run several instances |
| blue-green | bring up the whole new set, then switch traffic | 2 times the resources, temporarily | must roll back within seconds |
| canary | release to 5% of users first, then widen 5 → 25 → 100% by the numeric criteria below | metrics that split by version | large systems · high risk |

> **Rolling has a point people often forget:** during the deploy, the old and new versions serve at the same time.
> The API and schema must therefore work with both versions. If you did not design for this, some users will hit errors on every deploy.

**Criteria for widening a canary (numeric, agreed before the deploy).** Use burn rate (the rate at which the error budget is spent) by the formula in [`observability-basics`](../observability-basics/SKILL.md) section 4.1, measured on the new version's traffic only. Do not copy the formula here.

| Step | Traffic | Hold at least | Widen when (all must pass) |
|---|---|---|---|
| 1 | 5% | 30 minutes and at least 1,000 requests | short-window burn rate < 1 · p95 (95th percentile) latency no more than 1.2 times the old version (starting value, not yet measured) · health check passes on every machine |
| 2 | 25% | 1 hour | same criteria again |
| 3 | 100% | watch the first hour | short-window burn rate < 1 |

The hold time and the minimum request count are starting values, not yet measured. Adjust them to real traffic. If traffic is too low to reach 1,000 requests in 30 minutes, hold longer until it does. Do not lower the criteria. For a system with no SLO (Service Level Objective), use this criterion instead: the new version's errors ≤ max(2 times the old version, the old version + 0.5 percentage points) (starting value, not yet measured).

A **feature flag** (a switch that turns a feature on or off) separates "releasing the code" from "turning the feature on".

- You can merge unfinished code into `main` with the flag off
- Turn it on for some groups first, and turn it off instantly without a deploy
- **A flag needs an expiry date**, because a flag left for 1 year becomes two code paths that nobody dares to delete.
  Remove it within 2 sprints after it reaches 100%.

---

## 9 · Rollback

**Set the criteria in advance.** Do not decide while everyone is panicking and arguing over whether to wait a little longer. Use the burn rate from [`observability-basics`](../observability-basics/SKILL.md) section 4.1 instead of "errors above X%":

| Condition (new version's traffic) | Action |
|---|---|
| burn rate ≥ 14.4 over both the 1-hour and the 5-minute windows | roll back at once, without waiting for anyone |
| burn rate ≥ 6 over both the 6-hour and the 30-minute windows | roll back and open an incident |
| burn rate 1–6 | stop widening, stay at the current step, have a person look |
| p95 latency above 2 times the old version for 10 minutes (starting value, not yet measured) or the health check fails | roll back |

During a 5% canary, when the 1-hour window is not yet full, you may use the short window (5 minutes) with the 14.4 criterion. But the request count must first reach the minimum for that step before you trust the number.

| Required | Criterion |
|---|---|
| Rollback command | works with a single command |
| Time taken | under 5 minutes |
| **Real rehearsal** | at least once a quarter, on staging |
| Data | a migration already applied must not break the old code |

> **A rollback that has never been rehearsed is the same as no rollback**, because you find out it does not work at the moment you need it.

---

## 10 · The pipeline must be fast and trustworthy

| Problem | Fix |
|---|---|
| Slow | cache dependencies · run several test sets in parallel · move slow tests to a nightly run |
| Tests with unstable results (flaky) | **quarantine at once** and open a task to fix, because a test that sometimes fails and sometimes passes makes people stop reading results |
| Everyone waits in the queue | add runners · let pull requests run only the relevant parts |
| The build is not the same every time | lock dependency versions (lock file) · pin image versions by digest |

**Metrics worth watching:** how often you release · how long from commit to live ·
what percentage of deploys break · how long recovery takes

**Common symptoms and the first place to look** (idea from wshobson deployment-pipeline-design)

| Symptom | Look here first |
|---|---|
| Passes on the machine, fails on CI | lock file not committed · environment variables that exist only locally · file name letter case (Linux tells them apart) · the runner's time zone is UTC |
| Fails sometimes | flaky tests (row above) · jobs running at the same time fight over the same port or database · runner out of memory |
| Slower every week | the cache key changes every time so it never hits · an unpinned image is pulled again · one test suite grows and is not split |
| Deploy is green but nothing changes on the server | reusing an old artifact or the `latest` tag · CDN or reverse proxy cache · an old instance still receives traffic |
| permission denied or an empty secret on a branch or PR | a PR from a fork gets no secrets · environment protection rule · the token expired or its scope is too small |

---

## Android / Flutter apps — differences from servers

| Topic | Rule |
|---|---|
| Version number | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` follows SemVer · **`N` is the versionCode, an integer that only goes up** (for example the CI run number) · pass the commit hash through `--dart-define=GIT_SHA=<hash>` and show it on the "About" page |
| Build once | `flutter build appbundle --release` gives one Android App Bundle (AAB) file, then promote that same file through the Play tracks: internal → closed → production · do not rebuild per track |
| Staged release | production uses a staged rollout in % (for example 5 → 20 → 50 → 100) instead of a server canary · Play tracks stand in for the environments in section 5 |
| Rollback | **you cannot roll back a version on Play**, because the versionCode cannot go down and devices that already installed it do not go back. Halt the rollout, then release a fix with a higher versionCode, and rehearse this procedure instead of section 9 |
| Signing key | keep the upload key in the CI secret store as base64 + the password as a separate secret · `android/key.properties` and `*.jks` go in `.gitignore` · **back up the key outside CI in at least 1 place.** If you lose it, you cannot update the app until Play support resets it (use Play App Signing so Google holds the real key) |

---

## 11 · Anti-patterns

- **Rebuilding when going to production** means what was tested is not what is released
- **Deploying by hand from steps in a Word file** · on the day the author is out sick, nobody can deploy
- **Secrets in pipeline files** · anyone who can read the code can read the secrets
- **Letting a failed test pass** once makes people stop trusting results for good
- **Deploying on Friday evening** in a team that cannot yet roll back with a single command
- **Server database migration run at app boot** · several instances collide (mobile on-device databases are the exception, see section 7)
- **No artifact kept** turns a rollback into rebuilding from an old commit
- **Environments whose config differs unpredictably** · "it passed on staging"
- **A feature flag with no removal date**
- **A pipeline that takes 45 minutes** · people start merging without waiting for the result


## reference: deployment-plan-template.md

# แม่แบบแผน deploy

Open when you actually need to write this kind of document · put `(รอยืนยัน)` on anything you do not know

## Standard Output: Polished Deployment Plan

```markdown
# Deployment Plan: <Release vX.Y.Z>

| | |
|--|--|
| **Release** | vX.Y.Z |
| **Type** | Routine \| Major \| Hotfix |
| **Status** | Planned |
| **Deploy Lead** | @name |
| **Maintenance Window** | YYYY-MM-DD HH:MM-HH:MM UTC |
| **Expected Downtime** | Zero / 5 min |

---

## Pre-Deployment Checklist

| # | Item | Owner | Status |
|:-:|------|:------|:------:|
| 1 | All tests passing in CI | @dev | Done |
| 2 | Security scan passed | @security | Done |
| 3 | Database migrations reviewed | @dba | Pending |
| 4 | Rollback plan documented | @devops | Pending |
| 5 | Stakeholders notified | @pm | Pending |
| 6 | On-call engineer briefed | @oncall | Pending |
| 7 | Status page prepared | @devops | Pending |

## Deployment Flow

_[รูปขั้นตอน deploy: Tag release → CI สุดท้าย → ผ่านทั้งหมด? (ไม่ผ่าน = หยุดและตรวจ) → canary 5% → ปกติหลัง 10 นาที? (ไม่ = rollback) → 50% → ปกติ? (ไม่ = rollback) → 100% → smoke test → เสร็จ. วาดด้วย skill `diagram-figures`]_

## Deployment Steps

| Step | Action | Command/Link | Owner |
|:----:|--------|--------------|:------|
| 1 | Tag release | `git tag vX.Y.Z && git push --tags` | @devops |
| 2 | Trigger CD pipeline | [Pipeline link](#) | @devops |
| 3 | Deploy canary | Auto via pipeline | — |
| 4 | Monitor canary | [Grafana](#) | @oncall |
| 5 | Approve full deploy | Slack `/deploy approve` | @lead |
| 6 | Verify production | Smoke test suite | @qa |

## Verification

### Health Checks
- [ ] `/health` returns 200
- [ ] All pods/instances running
- [ ] Database connections OK
- [ ] No spike in 5xx errors (Grafana dashboard X)

### Smoke Tests
- [ ] User login works
- [ ] Critical user journey #1 works
- [ ] Critical API endpoints return expected response

### Key Metrics (15 min post-deploy)
| Metric | Baseline | Threshold | Current |
|--------|---------:|----------:|--------:|
| p95 latency | 150ms | < 200ms | — |
| Error rate | 0.1% | < 0.5% | — |
| Throughput | 1000 RPS | > 800 RPS | — |

## Rollback Plan

> **Triggers:** Any of the following requires immediate rollback
> - 5xx error rate > 2% sustained for 5 min
> - p95 latency > 500ms sustained for 5 min
> - Customer-impacting bug confirmed

### Rollback Steps
1. Run: `./scripts/rollback.sh vX.Y.Z-1`
2. Verify health checks
3. Post in #incidents channel
4. Schedule post-mortem within 48h

## Post-Deployment

- Monitor for 1 hour post-deploy
- Update changelog with release notes
- Send announcement to #releases
- Close release ticket
```


## reference: per-platform.md

# Starter pipeline files by platform

**Contents:** 1 GitHub Actions · 2 Azure DevOps · 3 GitLab CI · 4 Multi-stage Dockerfile · 5 Capability comparison table

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Multi-stage Dockerfile](#4--multi-stage-dockerfile)
5. [Capability comparison table](#5--capability-comparison-table)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` runs on every pull request.

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:                       # cancel the older run when a new push arrives
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }   # full history is needed to compute the version

      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --coverage

      - name: ตรวจ dependency
        run: npm audit --audit-level=high

      - name: ตรวจ secret รั่วใน repo
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }} # required when the repo belongs to an organization; not needed for a personal account (gitleaks-action README, checked 22 Oct 2026 (B.E. 2569))

      - uses: actions/upload-artifact@v4
        with:
          name: app-${{ github.sha }}
          path: dist/
          retention-days: 30
```

`.github/workflows/deploy.yml` takes the same artifact from ci and deploys it to one environment at a time.

```yaml
name: deploy
on:
  workflow_run:
    workflows: [ci]
    types: [completed]
    branches: [main]

jobs:
  staging:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4             # scripts/deploy.sh comes from the repo
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4    # the build output comes from the artifact (dist/)
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production        # <- set required reviewers here = the human gate
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4   # same artifact as staging
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh production
      - name: ตรวจหลัง deploy
        run: |
          for i in $(seq 1 10); do
            curl -fsS https://api.example.co/health/ready && exit 0
            sleep 6
          done
          ./scripts/rollback.sh && exit 1
```

**Cautions:**

- `pull_request_target` can see secrets and runs code from forks, so **do not use it** unless you know exactly what you are doing.
- Set `permissions` as narrow as possible in every workflow, because some organizations default to write access on the whole repo.
- The versions in the examples (`@v4`, Node 22, .NET 8.x) are only examples. Check the latest versions before use (`รอยืนยัน`, awaiting confirmation).
- Pin each action at least by version tag (`@v4`). For stricter control, pin by commit hash.
- `environment:` is where you set approvers (required reviewers) and secrets that belong to one environment.

---

## 2 · Azure DevOps

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [main] }

variables:
  buildConfiguration: Release

stages:
- stage: build
  jobs:
  - job: build
    pool: { vmImage: ubuntu-latest }
    steps:
    - task: UseDotNet@2
      inputs: { version: '8.x' }
    - script: dotnet restore
    - script: dotnet build -c $(buildConfiguration) --no-restore
    - script: dotnet test -c $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
    - script: dotnet publish -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory) --no-build
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: app

- stage: staging
  dependsOn: build
  jobs:
  - deployment: staging
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app
          - script: ./scripts/deploy.sh staging

- stage: production
  dependsOn: staging
  jobs:
  - deployment: production
    environment: production        # <- set approval on the Environments page
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app          # same artifact from the build stage
          - script: ./scripts/deploy.sh production
```

- A `deployment` job differs from a plain `job` because it binds to an environment, so it gets deploy history and an approval step.
- Keep secrets in a variable group linked to Azure Key Vault. Do not write them into files.
- Secret variables are **not passed into scripts automatically**. Map them one by one through `env:`.

---

## 3 · GitLab CI

`.gitlab-ci.yml`

```yaml
stages: [test, build, deploy]

default:
  interruptible: true

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  key: { files: [requirements.txt] }
  paths: [.cache/pip]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - ruff check .
    - pytest --cov --cov-fail-under=70
  coverage: '/TOTAL.*\s+(\d+%)$/'

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - echo "$CI_JOB_TOKEN" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:staging:
  stage: deploy
  environment: { name: staging, url: https://staging.example.co }
  script: ./scripts/deploy.sh staging $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  environment: { name: production, url: https://example.co }
  when: manual                     # <- human gate
  script: ./scripts/deploy.sh production $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

- Mark secret variables `Masked` and `Protected` under Settings → CI/CD.
- Use `when: manual` together with a protected environment. Only then is it an approval gate that really blocks.

---

## 4 · Multi-stage Dockerfile

```dockerfile
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package*.json ./
# this layer stays cached as long as the lock file does not change
RUN npm ci
COPY . .
RUN npm run build

# ---- run stage ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
# do not run as root
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js
CMD ["node", "dist/main.js"]
```

**Rules:**

- Copy the files that change least first, so the early layers reuse the cache.
- Do not copy `.env`, `.git` or `node_modules` into the image. Block them with `.dockerignore`.
- For a build that gives the same result every time, pin the base image by digest.
- Always name the tag with the commit hash. `latest` may serve as an alias, but never deploy with `latest`.

---

## 5 · Capability comparison table

| Need | GitHub Actions | Azure DevOps | GitLab CI |
|---|---|---|---|
| Human approval gate | Environment + required reviewers | Environment approvals | `when: manual` + protected env |
| Store artifacts | `upload/download-artifact` | `publish` / `download` | `artifacts:` |
| Cache dependencies | `actions/cache` or `cache:` in setup | `Cache@2` | `cache:` |
| Secrets per environment | Environment secrets | Variable group + Key Vault | Protected variables per environment |
| Cancel older runs | `concurrency` | `batch: true` (merges triggers that arrive while a run is active; it does not cancel the older run) | `interruptible: true` |
| Run in parallel | `strategy.matrix` | `strategy.matrix` | `parallel:` |
| Self-hosted runners | Yes | Yes | Yes |

> **Every platform can do the same things**, so do not choose by feature list.
> Pick the one that lives where the repo lives, and put your effort into the content of the pipeline instead.


---

# skill: repeated-mistakes-to-checks

Use when the same mistake gets corrected twice

# repeated-mistakes-to-checks: a mistake that repeats must become impossible

> The agent does not need to remember a hundred rules. If the path has guard rails at the right places, it hits one and gets stopped at the right moment on its own.
> A warning in SKILL.md is the weakest guard rail. Use it as the last resort.

This comes from pstack's correct command and rules-as-checks (not in this marketplace).

## Do not use when

For choosing among `session-lessons-to-skills` · `repeated-mistakes-to-checks` · `owner-style-capture`, see the central table in [`session-lessons-to-skills`](../session-lessons-to-skills/SKILL.md), under the heading "Which one to use".

## Steps

1. **Gather evidence:** what the user corrected (messages in this conversation · lines with `correction: true` in `.claude/superuser/log/` · repeated topics in `.claude/superuser/learn/` · rows of the "การตัดสินใจ" (decisions) table that start with `ผู้ใช้แก้ —` (user corrected) · review comments · work a client sent back · commits reverted repeatedly). You need at least 2 incidents of the same thing. One incident does not count yet.
   - **Do not wait for the user to say it again; dig it out yourself.** Read the user's messages in the conversation, working back from the latest, and look for 3 kinds of signal: a prohibition ("อย่า…" · "ไม่ต้อง…") · "ฉันไม่ได้ขอ" (I did not ask for that) or a request to redo · a revert or overwrite of work the agent just finished. Then rank by severity before going to step 2.

     | Severity | Signal | Next |
     |---|---|---|
     | High | A revert · deleting something the agent added · "ทำไมแตะไฟล์นี้" (why did you touch this file) | Build a check right away, even after one incident, if a machine can check it |
     | Medium | "อย่า…" · "ไม่ได้ขอ" repeated 2 or more times | Go to step 2 as usual |
     | Low | A preference about wording or format | `owner-style-capture` |
2. **Sort into types.** Name each type of mistake short and clear, e.g. "using a price excluding VAT in a quotation" · "forgetting the source date in a report" · "using Buddhist Era years in the database".
3. **Choose the layer to fix at: the highest you can.**

   | Layer | Examples | Why it beats the layer below |
   |---|---|---|
   | Structure | A template that leaves only the fields that must be filled · leave only one way to do it · delete old things that cause confusion | The wrong path disappears |
   | Data type | A date field in a sheet set to accept only dates · in code: separate types `ThaiYear` and `Year` | The machine stops you |
   | Check script | A formula that compares totals in a sheet · a grep script that finds banned words in documents · lint in CI · **an error message that says how to fix it** | On a hit you know at once what to do |
   | Check examples | A set of examples that must pass before sending · a test that fails when behavior is wrong | Catches it before sending or merging |
   | Text | Edit a paragraph in SKILL.md or an agent | Use only when the layers above are truly impossible. A "never" rule must not live only in a skill, because the skill may not be called (course CWN2026 2026-11-04: asked about the plan without calling the skill, the agent opened the whole answer-key heading). Put it in a hook or CLAUDE.md too |

4. **Build the check.** Write the smallest form that catches that type ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md)).
   - Draft a rule that a regex can catch first: name the tool or file the rule governs · the pattern · the message shown on a hit (saying how to fix) · 1 example that must hit and 1 example that must not hit (used in step 5). If a regex cannot catch it → use the text layer and say why.
5. **Prove it really catches.** Take the code or document from the real mistake (or recreate it faithfully) and run the check, which **must fail.** Then run it on the current version, which must pass. A check that has never failed is a broken check.
6. **Log it in the table:** `| ความผิด | ชั้นที่แก้ | ตัวตรวจ (ไฟล์) | พิสูจน์ด้วย |` (mistake · layer fixed · check (file) · proven by) in `.claude/superuser/IMPROVEMENTS.md` (for code work, `docs/AGENT-RULES.md` or the `README` of the skill repo also works). Then add 1 line under the "กติกา" (rules) heading of `CONTEXT.md` that points to it.
7. Repeat every time the user corrects a new topic for the 2nd time.

## Do not wait for a repeat: signs you should build a check right away

- If the same rule lives in several files (e.g. repeated in every prompt), move it to one place and let the others refer to it.
- If you are about to write one more "never..." line when a machine could check it (grep · formula · CI), build a check instead.
- A check's error message must say how to fix it, not just say it is wrong.

Examples in this set:

| Rule | Used to be | Now it is |
|---|---|---|
| A skill's description must not contain `": "` without quotation marks | A warning in a document | `scripts/check/validate-marketplace.mjs` + `--self-test` |
| Numbers in the README must match reality | Edited by hand | `scripts/sync/sync-docs.mjs --check` |
| SuperUser shared files must be identical in every plugin | A text line "edit every copy" | `scripts/sync/sync-superuser.mjs --check` |

## What not to do

- Add a "never..." text to SKILL.md when it could be a check.
- Create a rule that was not proven with a real mistake, because a rule that misses its target makes everyone wrongly believe they are safe.
- Check so broadly that it also catches correct things, because in the end everyone learns to skip it.

## Source

hookify (Apache-2.0) · `agents/conversation-analyzer.md` · viewed 2026-11-10 (dig out the user's correction signals working back from the latest, rank by severity, draft regex-style rules).
