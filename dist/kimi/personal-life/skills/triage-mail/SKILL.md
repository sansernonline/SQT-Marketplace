---
name: "triage-mail"
description: "Triage the inbox into verify, today, this week, delegate, file and archive, via the installed email plugin."
disableModelInvocation: true
---

Run the `inbox-triage` skill over the user's email via their own email connector (setup: `inbox-triage`, "Connecting your mail"): **$ARGUMENTS**

Output is six buckets with counts (Verify · Today · This week · Delegate · File · Archive; Verify holds suspected phishing and comes first); answer-today items get drafted replies one by one, only on request.
