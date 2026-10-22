---
name: triage-mail
description: Triage the inbox into verify, today, this week, delegate, file and archive, via the installed email plugin.
argument-hint: '[--days 7]'
disable-model-invocation: true
---

Run the `inbox-triage` skill over the user's email via their installed email plugin: **$ARGUMENTS**

Output is six buckets with counts (Verify · Today · This week · Delegate · File · Archive; Verify holds suspected phishing and comes first); answer-today items get drafted replies one by one, only on request.
