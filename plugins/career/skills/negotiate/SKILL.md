---
name: negotiate
description: Compare offers on total compensation and draft what to say to negotiate salary, a raise or a counter-offer.
argument-hint: <offer|raise|counter> [offer details]
disable-model-invocation: true
---

Run the `career-coach` agent with the `salary-negotiation` skill: **$ARGUMENTS**

- `offer` — build the total-compensation table for the offer (and the current job), find the gap, draft the reply in Thai and English
- `raise` — build the case from `performance-self-review`, pick the number, draft the meeting opener
- `counter` — the current employer counter-offered; run the counter-offer checklist before answering
