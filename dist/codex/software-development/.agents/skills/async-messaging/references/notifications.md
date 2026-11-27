<!-- merged from skill `notifications` on 2026-11-27 · description was: Use when a system sends email, SMS, LINE or push -->
# User notifications

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Choose the channel by urgency, not by habit](#1--choose-the-channel-by-urgency-not-by-habit)
- [2 · Message templates live outside the code](#2--message-templates-live-outside-the-code)
- [3 · Always send as a background job](#3--always-send-as-a-background-job)
- [4 · What must never go in a message](#4--what-must-never-go-in-a-message)
- [5 · Let users choose](#5--let-users-choose)
- [6 · Track delivery](#6--track-delivery)
- [7 · Link to other skills](#7--link-to-other-skills)

> **One rule:** users stop reading everything if they receive enough that they did not need to read.
> Every message sent beyond what is necessary makes the necessary messages get ignored too.
> For Thai text in templates → `human-writing` `thai-grammar.md` section 4, register "screen"

## When to use this skill

- The system must send email, SMS, LINE push or in-app notifications
- Users complain of getting duplicates, getting too many, or getting none
- You must build a settings page for which notifications to receive
- Important email lands in spam

## When **not** to use it

| Task | Use this instead |
|---|---|
| Alerting the team when the system has a problem | `incidents-and-monitoring` |
| Queue mechanics and retries | `background-jobs.md` |
| Multi-language messages | `i18n-and-locale` |
| Marketing consent | `pdpa-compliance` |

---

## 1 · Choose the channel by urgency, not by habit

| Channel | Good for | Limits |
|---|---|---|
| **In-app** | Everything — a permanent record that can be looked back at | Seen only when the user opens the app |
| **Email** | Receipts, summaries, attachments, things to keep | Slow · can land in spam |
| **push** | Things the user must know now | Can be turned off · lost if not tapped |
| **LINE** | Thailand · general customers · high open rate | Cost per message · provider rules apply |
| **SMS** | Verification codes · urgent things that must arrive | Most expensive · 70 characters if Thai |

> **Thai SMS holds only 70 characters per message** (not 160 as in English).
> Anything longer is split into several messages and billed for every part, so always count the length before sending.

**One matter goes on one channel** — unless it is something that truly cannot be missed.
Let the user choose which channel they want (section 5).

---

## 2 · Message templates live outside the code

```
templates/
  order-confirmed/
    th.subject.txt  th.html  th.txt
    en.subject.txt  en.html  en.txt
```

| Rule | Reason |
|---|---|
| **Never build messages by string concatenation in code** | Every wording change would need a new deploy |
| Variables are named | Use names like `{{customerName}}`, not positions |
| Email needs both HTML and plain text | Spam filters lower the score of HTML-only email |
| One file per language | See `i18n-and-locale` |
| **Test with real values before sending** | A leaked `สวัสดีคุณ {{name}}` damages the brand |

**Every message needs 3 things** — what happened · which item it concerns (with a reference number) · what to do next (a single button)

---

## 3 · Always send as a background job

> **A failed email must not make the order fail.**
> Separate them with a queue — the transaction is saved first, then the message enters the send queue (see `background-jobs.md`)

| Topic | Rule |
|---|---|
| Enqueue after the transaction succeeds | Not during the transaction, because if it rolls back later the email has already gone out |
| retry | 3 times, doubling the wait each round, then move to the dead letter queue (a queue that holds jobs that failed to send) |
| **Prevent duplicate sends** | Use a unique key `(type, entity_id, event_id, recipient)` — `event_id` is the id of the event or version of the change (for example, the 2nd status of the same order must be sendable). Do not just hope nobody calls twice |
| Urgent messages (OTP codes) | Use a separate queue so they do not wait behind 5,000 monthly summary emails |

**Prevent a flood** — set a per-user ceiling per hour, and merge frequent events of the same kind
into one message ("มี 12 รายการใหม่", not 12 messages).

---

## 4 · What must never go in a message

| Never | Put this instead |
|---|---|
| Passwords | A reset link that expires |
| Full card numbers · national ID numbers | The last 4 digits |
| Health data, test results | "มีผลตรวจใหม่ กรุณาเข้าระบบเพื่อดู" |
| Attachments with sensitive data | A link that requires login first |
| Links reachable without identity verification | A short-lived link that checks permission |

> **Treat email as a postcard** — it passes through many systems, sits in a mailbox on a device that may not be theirs,
> and can be found forever.

**Links in email must be on our own domain** — shortened links make users unable to tell them from scam email.

---

## 5 · Let users choose

| Type | Can it be turned off? |
|---|---|
| Transactional (receipts · verification codes · security notices) | ✗ cannot be turned off |
| Action (order status · someone replied) | ✓ the channel can be chosen |
| Periodic summary | ✓ the frequency can be chosen |
| Marketing | ✓ **consent must be obtained before sending** (see `pdpa-compliance`) |

- Settings table: `user_id` · `notification_type` · `channel` · `enabled`
- **Every non-transactional message must have an unsubscribe link**, and it must take effect within 24 hours (our own internal target, stricter than the 2 days that Gmail and Yahoo set)
- **High-volume marketing email** must also carry a one-click unsubscribe header: `List-Unsubscribe: <https://...>` (an HTTPS URL) together with `List-Unsubscribe-Post: List-Unsubscribe=One-Click` per the RFC 8058 standard, and the email must pass SPF + DKIM (Gmail applies this to senders above about 5,000 messages per day · it applies to marketing email, not transactional · without it the email is more likely to land in spam). Sources: [`sources.md`](notifications/sources.md)
- Unsubscribing must work without logging in — use a token in the link
- Respect "quiet hours" — never send non-urgent push or SMS at 2 a.m. (by the recipient's time zone)

---

## 6 · Track delivery

| Status | Meaning |
|---|---|
| `queued` · `sent` | Entered the queue · left our system |
| `delivered` | The destination accepted it |
| `bounced` | Did not arrive — **separate hard (the address does not exist) from soft (mailbox full)** |
| `failed` | Could not be sent |

- **Stop sending to an address immediately after a hard bounce** — continuing gets our domain blacklisted
- Keep a send log to answer "why didn't the customer get it" — who, which channel, when, what result
- Email that must arrive needs **SPF · DKIM · DMARC** all set, or it lands in spam with no warning at all
- Measure: delivery success rate · bounce rate · queue backlog (see `incidents-and-monitoring`)

---

## 7 · Link to other skills

- Retry queue and dead letter: `background-jobs.md`
- Settings table and send log: `database-design`
- Attachments and expiring links: `web-service-essentials`
- Delivery success rate metrics: `incidents-and-monitoring`
- Alerting the team when the system has a problem: `incidents-and-monitoring`
- Broadcast to LINE OA friends (quota · target group · frequency): `e-commerce:line-oa` (if installed)
