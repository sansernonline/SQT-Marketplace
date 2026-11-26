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
| Metrics and alerts | `observability-basics` | instead |
| Events across several services through Kafka (several consumers read the same event · history is kept) | `kafka-streaming` | instead |
| A job queue through RabbitMQ (several workers · retry · dead letter · needs a real broker) | `rabbitmq-messaging` | instead |
| Importing Excel/CSV files as the main job | `data-import-export` | instead |
| Sending email/SMS as the main job | `notifications` | instead |
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

**Job state is a state machine, not a boolean** — every mechanism in section 2 must be able to say which state a job is in: `queued → running → succeeded`, or `running → failed (attempts < cap) → queued`, or `failed → dead` · keep `attempts` · `locked_at` · `last_error` · `finished_at` with the job · move only along the arrows above (a `succeeded` job cannot go back to `running`; create a new job) · the admin screen and the dead letter read from this state in one place

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

## 8 · Payload

- **Send the id, not the whole data block, in the payload** — the job reads it itself, so it gets the latest data too

---

## 9 · Durable workflow for agent jobs that run long or wait for human approval

An agent job that runs tens of minutes, calls an LLM and tools many times, or pauses for approval across days cannot use a plain queue, because a failure at step 8 of 10 means starting over and paying the token cost again · use an engine that records the result of every step and resumes from the same point

- [`references/durable-workflow.md`](references/durable-workflow.md) — open before choosing an engine (Temporal · Step Functions · checkpointer) or writing replayable code

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: durable-workflow.md

# Durable workflow for agent jobs · background-jobs

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
- The cap on rounds, the token budget, and stopping when there is no improvement are still needed, as for jobs in a queue · details in [`agent-systems.md`](../../llm-engineering/references/agent-systems.md) section 6


## reference: sources.md

# Sources · background-jobs

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
| Android Auto Backup | By default the system backs up app data to Google Drive on its own | Set `android:allowBackup` and `android:dataExtractionRules` to match your intent, and record the reason in `decision-desk/decision-log` |
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

**Do not export a full-data Excel file for someone who needs only the totals.**

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

**Sectors with a second layer of rules** — health · finance · telecom have their own regulators (กระทรวงสาธารณสุข (Ministry of Public Health) · ธปท. (Bank of Thailand, BOT) / ก.ล.ต. (Securities and Exchange Commission, SEC) / คปภ. (Office of Insurance Commission, OIC) · กสทช. (National Broadcasting and Telecommunications Commission, NBTC)) that add conditions on confidentiality, retention and breach notice. Check that sector's rules before designing, and do not rely on PDPA alone

## 11 · Links to other skills

Also: `notifications` (sending and unsubscribing from marketing messages; consent stays here) · `data-import-export` (masking exported files) · `file-upload-and-storage` (retention of attached files) · `background-jobs` (jobs that delete expired data) · `incident-runbook-template` (after a leak).

## References

- [`references/glossary.md`](references/glossary.md) — open when a term (controller · processor · sensitive data) must be explained


## reference: glossary.md

# PDPA glossary

- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
- **Personal data** — data that identifies a person, directly or indirectly
- **Sensitive data** — the special category of personal data, such as health, race, religion
- **Data controller** — whoever decides how data is collected and used (usually the system owner)
- **Data processor** — whoever processes data on the controller's instructions, such as a cloud provider
- **Data subject** — the person the data belongs to
