# playbook · incident — get a live system back up, then learn from it

Use when: "the site is down" · "users cannot log in since 14:00" · "errors jumped after the deploy" · "we may have leaked data" · an alert fires on production (a bug found in a test or on a dev machine → `bug-fix`)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md) (when data may have leaked)
Main skills: [`incidents-and-monitoring`](../../incidents-and-monitoring/SKILL.md) (work format: `references/incident-response.md`) · `cicd-and-release` (rollback) · `errors-and-logs` · `pdpa-compliance` (personal data) · `security-operations` (an attack) · `fix-at-source/principle-fix-root-cause`

> Every change to production (rollback · failover · scaling · feature flag · firewall rule) waits for a named person's approval. The agent prepares the command and the value it expects to see; the on-call person runs it or approves it.

## ขั้นตอน · Steps (copy into the todo as written)

1. Open [`references/operations.md`](../../dev-principles/references/operations.md) first. Declare the incident: write the one thing users feel is wrong, when it started, the severity, and who is the incident commander (one person) in a single status note `docs/postmortems/<YYYY-MM-DD>-<topic>.md` (the same file becomes the postmortem in step 6) · start the timeline there, one timestamped line per event · ใคร: หัวหน้าทีม
2. **Measure what users feel** — error rate · latency at the 95th percentile · traffic, compared with the same hour before it started, per `incidents-and-monitoring/references/observability-basics.md` · list what changed in the last 24 hours (deploys · config · flags · dependencies · traffic) · ใคร: `devops-engineer` ตัวใหม่
3. **Stop the harm before finding the cause** — if a recent change lines up with the start time, prepare the rollback or flag-off command with its expected effect and put it under "รออนุมัติ" (awaiting approval) · if personal data or an attack may be involved, hand over to `security-analyst` at once and start the 72-hour PDPC clock from the moment it was known (`pdpa-compliance`) · ใคร: `devops-engineer` ตัวใหม่ (pass in the status note) · data or attack: `security-analyst` ตัวใหม่ · approval: the on-call person
4. After each approved action, check the step 2 numbers again and log the value seen in the status note · not back to normal → next hypothesis, one change at a time · ใคร: `devops-engineer` ตัวใหม่ (pass in the status note)
5. Once stable, find the root cause in a copy of the system, not in production — reproduce it, then write a test that fails first, per playbook [`bug-fix`](playbook-bug-fix.md) steps 2–8, doing its step 2 reproduction in staging or a copy instead of production · ใคร: `developer` ตัวใหม่
6. Write the blameless postmortem within 48 hours per `incidents-and-monitoring/references/postmortem-template.md`: timeline · impact in numbers · root cause · what helped · what slowed us · follow-up items each with an owner and a date · add the missing alert or runbook line · ใคร: `technical-writer` ตัวใหม่ (pass in the status note)
7. **Check (ตรวจ)** the postmortem and the fix: no person blamed · every production change has an approver's name · every follow-up has an owner and a date · the step 5 test passes · if personal data leaked, the notification record exists (ตัดสินผลตาม [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md)) · fail → fix → recheck · ใคร: `reviewer` ตัวใหม่
8. Deliver the fix through playbook [`ship`](playbook-ship.md), then finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Common excuses — read before skipping a step

| Excuse | Reality |
|---|---|
| "I'll write the timeline afterwards" | Memory after an incident is wrong about times and order · one line per event now costs seconds |
| "Rolling back is obvious, just do it" | A rollback is a production change · it still needs the approver's name, and the database change may not roll back with the app |
| "Find the cause first, then fix" | Users are hurt every minute · stop the harm first, find the cause in a copy afterwards |
| "It is back up, so we are done" | Without a postmortem and follow-up items with owners, the same incident comes back |

## Done when

Users' numbers are back to normal (step 2 values before and after) · the postmortem has owners and dates for every follow-up · the root-cause fix passed `ship`
