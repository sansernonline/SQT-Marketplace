---
name: triage-mail
description: Triage the inbox into today, this week, delegate and archive with the two-minute rule, via the installed email plugin.
argument-hint: '[--days 7]'
disable-model-invocation: true
---

Run the `inbox-triage` skill over the user's email via their installed email plugin: **$ARGUMENTS**

Output is four buckets with counts; answer-today items get drafted replies one by one, only on request.
