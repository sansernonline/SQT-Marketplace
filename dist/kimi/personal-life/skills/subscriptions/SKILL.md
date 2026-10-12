---
name: "subscriptions"
description: "Audit recurring charges from statements — cost per use, cancel, downgrade or keep, exact cancel steps, trial-end reminders."
disableModelInvocation: true
---

Run the `subscription-audit` skill with the `life-admin` agent on: **$ARGUMENTS**

Produces the cost-per-use table, a decision per line, cancellation steps by billing channel (App Store, Google Play, merchant, bank auto-debit), the annual-versus-monthly break-even for anything kept, and a calendar reminder 2 days before every free trial ends. The result is appended to `subscriptions.md` with the next audit date.
