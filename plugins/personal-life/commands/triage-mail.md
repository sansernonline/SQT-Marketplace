---
name: triage-mail
description: Triage the inbox into answer-today, this-week, delegate, and archive using the two-minute rule, working through whichever email plugin the user has installed.
argument-hint: [--days 7]
---

Run the `inbox-triage` skill over the user's email via their installed email plugin: **$ARGUMENTS**

Output is four buckets with counts; answer-today items get drafted replies one by one, only on request.
