# skill: notifications

Use when a system sends email, SMS, LINE or push

# User notifications

> **One rule:** users stop reading everything if they receive enough that they did not need to read.
> Every message sent beyond what is necessary makes the necessary messages get ignored too.
> For Thai text in templates → `human-writing` `references/thai-grammar.md` section 4, register "screen"

## When to use this skill

- The system must send email, SMS, LINE push or in-app notifications
- Users complain of getting duplicates, getting too many, or getting none
- You must build a settings page for which notifications to receive
- Important email lands in spam

## When **not** to use it

| Task | Use this instead |
|---|---|
| Alerting the team when the system has a problem | `observability-basics` |
| Queue mechanics and retries | `background-jobs` |
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
> Separate them with a queue — the transaction is saved first, then the message enters the send queue (see `background-jobs`)

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
- **High-volume marketing email** must also carry a one-click unsubscribe header: `List-Unsubscribe: <https://...>` (an HTTPS URL) together with `List-Unsubscribe-Post: List-Unsubscribe=One-Click` per the RFC 8058 standard, and the email must pass SPF + DKIM (Gmail applies this to senders above about 5,000 messages per day · it applies to marketing email, not transactional · without it the email is more likely to land in spam). Sources: [`references/sources.md`](references/sources.md)
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
- Measure: delivery success rate · bounce rate · queue backlog (see `observability-basics`)

---

## 7 · Link to other skills

- Retry queue and dead letter: `background-jobs`
- Settings table and send log: `database-design`
- Attachments and expiring links: `file-upload-and-storage`
- Delivery success rate metrics: `observability-basics`
- Alerting the team when the system has a problem: `observability-basics` · `incident-runbook-template`
- Broadcast to LINE OA friends (quota · target group · frequency): `e-commerce:line-broadcast` (if installed)


## reference: sources.md

# Sources · notifications

One-click unsubscribe header and SPF + DKIM for high-volume senders: support.google.com/a/answer/14229414 · senders.yahooinc.com/best-practices · checked 22 Oct 2026 (B.E. 2569). The standard is RFC 8058.


---

# skill: pdpa-compliance

Use when software stores personal data in Thailand

# PDPA — personal data

> **The one rule:** data you never collect cannot leak, needs no care and never has to be deleted.
> The first question is always "do we need to collect it?", not "how do we keep it safe?"

> Caution: this is guidance for people who build systems. **It is not legal advice.**
> Anything with legal effect must be decided by a legal adviser.

## Shortcut — apps whose data stays on the user's device only

If the app has no server, no accounts and sends no data out, skip the sections on processors and databases. Then check only these 3 things.

| Item | Why it still matters | What to do |
|---|---|---|
| Android Auto Backup | By default the system backs up app data to Google Drive on its own | Set `android:allowBackup` and `android:dataExtractionRules` to match your intent, and record the reason in `decision-desk/decision-log` |
| Export · share sheet (the system's share window) | This is the only way data leaves the device | Send only what the user selected, and do not attach location or image metadata without telling them |
| Data the app store forces you to declare | Google Play requires the Data safety form for every app | Fill it in truthfully (if you collect nothing, say so). Whether requesting camera permission requires a privacy policy is `(รอยืนยัน)` (awaiting confirmation), so prepare a short page first |

If you later add analytics · crash reports or user accounts, the app is no longer device-only. Go back and apply the whole skill.

## When to use this skill

- The system stores names, phone numbers, emails, addresses, ID card numbers, photos or other data that identifies a person
- A customer or the legal team asks about PDPA compliance
- You must build a consent page, or a page where users request deletion of their data
- You will send data to an outside service provider

## When **not** to use it

| Task | Use this instead |
|---|---|
| A trail of who did what to the data | `audit-trail` |
| Tables and column-level encryption | `database-design` |
| Authentication and permissions | `auth-implementation-patterns` |
| Masking data in logs | `logging-standards` |
| Where to keep keys | `config-and-secrets` |
| Consent forms, privacy notices and a company's PDPA documents (not a software system) | (if plugin `e-commerce` is installed) `e-commerce:pdpa-workflow`; if it is not, use item 3 of this skill as the outline |

---

## 1 · Make the inventory first

**Without this inventory you cannot answer "where is my data?"**

| Data | Stored where | Why collected | Legal basis | Kept how long | Who can see it | Sent to whom |
|---|---|---|---|---|---|---|
| Full name | `users.name` | Identify the customer | Contract | 5 years after the account closes | Sales · admins | — |
| Phone number | `users.phone` | Send delivery status | Contract | Same as the row above | Same as the row above | SMS provider |
| National ID number | `kyc.id_number` | Legally required identity check | Legal obligation | 10 years | Compliance team | — |

**List every place that really holds data**: main database · backups · logs · analytics systems ·
file storage · spreadsheets the team keeps by hand · mobile apps (Android Auto Backup and files exported through the share sheet)

---

## 2 · Legal basis — not everything needs consent

| Basis | Use when | Example |
|---|---|---|
| **Contract** | Needed to provide the agreed service | Delivery address |
| **Legal obligation** | The law requires you to keep it | Tax documents |
| **Legitimate interest** | Necessary, and does not harm rights excessively | Security logs · fraud prevention |
| **Consent** | No other basis works | Marketing · behavior-tracking cookies |

> **Consent is the weakest basis because it can be withdrawn at any time.**
> If you ask consent for the delivery address and the person withdraws, the system cannot ship.
> **The delivery address uses the contract basis**, not consent.
>
> A button labeled "accept all" that blocks use of the service unless pressed does not count as freely given consent.

---

## 3 · Consent that works in practice

| Required | Details |
|---|---|
| **Separate by purpose** | Email marketing · behavior tracking · sharing with partners — separate checkboxes |
| Not pre-ticked | It must be the user's own action |
| Text an ordinary person can understand | Not a 500-word legal paragraph |
| **Recorded** | Who · for what · when · which text version · through which channel |
| Withdrawing is as easy as giving | If it takes 1 click to give, it must take 1 click to withdraw |
| Withdrawal takes real effect | **Code must actually stop using that data**, not just store the flag |

Required table: `consent` — `user_id` · `purpose` · `granted` · `granted_at` · `withdrawn_at` ·
`policy_version` · `source` · `ip`
**Keep it as history, never overwrite.** You must be able to prove later what the person agreed to at that time.

---

## 4 · Data subject rights

The system must be **able to do these for real**, not wait for manual work each time. In general you must respond within 30 days.

| Right | What the system must be able to do |
|---|---|
| Access | Produce a copy of all that person's data |
| Rectification | Correct inaccurate data, then **pass the correction on to every place the data was sent** |
| **Erasure** | Delete for real from every place in active use, including logs. For backups, take them out of use (if one is restored, delete again) and let them expire through the rotation cycle (see item 6). Tell the data subject by which date the data in backups will be gone. |
| Restriction | Stop using the data temporarily without deleting it |
| Portability | Export in a machine-readable format |
| Objection | Stop the marketing or processing the person objects to |

> **"Erasure" is the hardest one.** Data sits in the database, backups, logs, analytics systems
> and outside providers. **Design for deletion from day one**, not a hunt afterward.
>
> Soft delete alone **does not count as deletion**. Data the law requires you to keep (such as tax documents)
> may be kept, but you must tell the data subject what you keep and why.

---

## 5 · Collect only what you need

| Principle | Example |
|---|---|
| **Do not ask for what you do not use** | An online shop does not need the national ID number |
| Store a range instead of the exact value | Store an age range, not the birth date, if you only use it to group people |
| **Hash or anonymize** for analytics | A statistics system does not need to know who is who |
| Column-level encryption | ID numbers, health data |
| Mask on display | `x-xxxx-xxxx-12-3` |
| **Keep sensitive data out of the main table** | Easier to restrict and audit |

**Sensitive data has a stricter tier** (section 26), for example race, ethnic origin, political opinion, creed, religion or philosophy, sexual behavior,
criminal record, **health data**, disability, trade union data, genetic data, biometric data, and other data that affects the subject in a similar way.
It may be collected only when truly necessary, and needs stricter measures than usual (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act B.E. 2562, 2019) section 26, checked 22 Oct 2026 (B.E. 2569))

**Never use real data on development machines or staging.** Always mask it first (see `cicd-and-release`).

**Do not export a full-data Excel file for someone who needs only the totals.**

---

## 6 · Retention

- Set it **per data type**, not one value for the whole system
- **Have a real deletion job that runs on a schedule.** A policy with no job running does not exist.
- Logs that contain personal data also have a lifetime (see `logging-standards`)
- Data backups need a rotation cycle that makes old data disappear on its own in the end
- Before the first real deletion, show the list of what will be deleted and have a person approve it

---

## 7 · Outside providers and sending data abroad

| Topic | What to do |
|---|---|
| List of processors | List what data goes to whom — cloud · SMS · email · analytics · chat |
| Contract | Have a data processing agreement with every one |
| Sending abroad | Check that the destination country has adequate standards, or that standard contract clauses cover it |
| Analytics and ad trackers | Count as sending data out — **they need a legal basis** |
| Ending a service | You must get the data back and have them delete it for real |

> **The most commonly forgotten spot:** an analytics plugin added on day one sends users' behavior
> data abroad every day, and nobody ever put it on the list.

---

## 8 · When data leaks — the first 72 hours

| Order | What to do |
|---|---|
| 1 | **Stop the leak first** — revoke keys, close the channel |
| 2 | Assess the scope — what data, how many people, is it sensitive |
| 3 | Preserve evidence — logs and system state **before** you overwrite anything |
| 4 | Notify the internal owner and the legal adviser at once |
| 5 | **Notify the สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Committee Office) within 72 hours** when the conditions are met |
| 6 | Notify the data subjects when the risk to them is high |
| 7 | Record the incident with `postmortem-template` |

**Prepare in advance, not when it happens** — who decides to notify · the legal adviser's phone number ·
the notification message template · how to pull the list of affected people

---

## 10 · Frequently cited sections, and abbreviations

Use this when a customer or the legal team asks "which section is this?" (checked against the unofficial English translation of the 2019 Act, Royal Gazette 27 May 2019 (B.E. 2562), on 23 Oct 2026 (B.E. 2569))

| Topic (item in this skill) | Section |
|---|---|
| Consent (item 3) | 19 |
| Legal bases that need no consent (item 2) | 24 |
| Sensitive data (item 5) | 26 |
| Sending data abroad (item 7) | 28 |
| Data subject rights (item 4) — access · portability · objection · erasure · restriction · rectification | 30 · 31 · 32 · 33 · 34 · 35–36 |
| Security measures · deletion system on expiry · breach notice in 72 hours (items 6, 8) | 37(1) · 37(3) · 37(4) |
| Records of processing (item 1) | 39 |
| Data Protection Officer (DPO) | 41 |
| Compensation · punitive damages | 77 · 78 |
| Administrative fines, maximum 1 · 3 · 5 million baht | 82 · 83 · 84 |

**Sectors with a second layer of rules** — health · finance · telecom have their own regulators (กระทรวงสาธารณสุข (Ministry of Public Health) · ธปท. (Bank of Thailand, BOT) / ก.ล.ต. (Securities and Exchange Commission, SEC) / คปภ. (Office of Insurance Commission, OIC) · กสทช. (National Broadcasting and Telecommunications Commission, NBTC)) that add conditions on confidentiality, retention and breach notice. Check that sector's rules before designing, and do not rely on PDPA alone

## 11 · Links to other skills

Also: `notifications` (sending and unsubscribing from marketing messages; consent stays here) · `data-import-export` (masking exported files) · `file-upload-and-storage` (retention of attached files) · `background-jobs` (jobs that delete expired data) · `incident-runbook-template` (after a leak).

## References

- [`references/glossary.md`](references/glossary.md) — open when a term (controller · processor · sensitive data) must be explained


## reference: glossary.md

# PDPA glossary

- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
- **Personal data** — data that identifies a person, directly or indirectly
- **Sensitive data** — the special category of personal data, such as health, race, religion
- **Data controller** — whoever decides how data is collected and used (usually the system owner)
- **Data processor** — whoever processes data on the controller's instructions, such as a cloud provider
- **Data subject** — the person the data belongs to
