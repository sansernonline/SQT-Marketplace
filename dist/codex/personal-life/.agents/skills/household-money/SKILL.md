---
name: household-money
description: Use when tracking power and water bills or cutting subscriptions
argument-hint: '<bills|subscriptions> [month or statement files]'
---

# household-money — household bills and subscription cuts

> **One rule:** Nothing is paid to a new account number until the user has checked it with a number they already trust. An old auto-debit is never treated as approval.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Read my electricity or water bill, or track the bills each month" | [`references/household-bills.md`](references/household-bills.md) |
| "Cut the subscriptions I don't use, or find charges on my statement" | [`references/subscription-audit.md`](references/subscription-audit.md) |

The bill tracker template is in `references/bill-tracker-template.md`. Statement patterns are in `references/statement-patterns.md`. Cancel steps are in `references/cancel-steps.md`.

## Check before done

- A bill or message that asks to pay a new account number is checked by calling the number on an old bill or in the utility's own app, never the number in the message. Nothing is paid until then.
- An old auto-debit is not approval. A jump in the amount is still checked.
- Do not judge anyone's spending. Show the numbers and let the user decide.
- Units and percentages are calculated by the script, not by hand: `node power-bill.mjs --history scripts/example-history.json`.
- A charge nobody can name may be fraud. Call the card issuer, and see `digital-hygiene`.
- Say once that this is general information, not financial advice. For a large money decision, ask a licensed adviser.
- A whole bills or subscriptions job → playbooks `superuser/references/playbook-bills.md` or `playbook-subscriptions.md`.
