---
name: incidents-and-monitoring
description: Use when a live system is down, or for metrics, alerts or runbooks
argument-hint: '<incident description, e.g. "users cannot log in since 14:00 UTC">'
---

# incidents-and-monitoring — watch a live system, run an incident, write it up

> **One rule:** a person must approve any change to production during an incident. The agent proposes the command and its expected effect, and the on-call person runs it or approves it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Is the system healthy?", "What should we alert on?", "The system is slow, where is it?" | [`references/observability-basics.md`](references/observability-basics.md) (PromQL and Grafana details: [`references/prometheus-grafana.md`](references/prometheus-grafana.md)) |
| "The site is down", "users cannot log in", "we may have leaked data" | [`references/incident-response.md`](references/incident-response.md) |
| "Write a runbook", "on-call guide", "what do we do when this alert fires" | [`references/incident-runbook-template.md`](references/incident-runbook-template.md) (full template: [`references/runbook-template.md`](references/runbook-template.md)) |
| "Write a postmortem", "blameless review", "what went wrong last week" | [`references/postmortem-template.md`](references/postmortem-template.md) (full template: [`references/template.md`](references/template.md)) |

Drills for a runbook: [`references/game-days.md`](references/game-days.md). Alert-to-runbook links: [`references/index-and-alert-links.md`](references/index-and-alert-links.md).

## Steps every part shares

1. Name the one thing that is wrong, and write down the time of each event as it happens.
2. Keep the live log to one timestamped line per event. Polish it after the incident, not during.
3. Measure with symptoms users feel (errors, latency at the 95th percentile), not with averages or with CPU alone.
4. Give the on-call person one step at a time, each with the value to expect. If the value is not there, the step did not work.
5. After the incident is stable, write the postmortem within 48 hours.

## Check before done

- Every production change (rollback, failover, scaling, feature flags, WAF or firewall rules) has a named human who approved it.
- A security breach or leaked personal data goes to `security-analyst` at once. The 72-hour clock to notify the PDPC (Personal Data Protection Committee) starts when the breach is known (`pdpa-compliance` section 8).
- Every runbook command is checked against staging before use, and every alert links to its runbook.
- Metric labels never hold user ids, order ids or phone numbers; those go to logs.
- The postmortem is blameless and states facts without softening them.

Whole job → playbook `incident` (`superuser/references/playbook-incident.md`), with the steps in `incident-response` as the work format.
