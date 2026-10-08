---
name: inbox-triage
description: Use when a personal or work email inbox is overwhelming or the user asks what mail needs a reply today. Sorts into today, week, delegate, verify, archive.
---

# Inbox Triage

Get to "nothing hiding in here" in ten minutes a day. This is a method; reading and moving mail is done by whatever email plugin or app the user has — this skill does not replace it.

## Daily workflow (10 minutes)

1. **Scan oldest unanswered first** — newest mail is often a reply to something older.
2. **Run each message through the decision table** — one decision per message, no re-reading later.
3. **Two-minute rule** — if the reply takes under two minutes, send it now.
4. **Schedule the rest** — every "this week" item gets a calendar slot or a dated task, not a flag.
5. **Close** — inbox shows only items received after the session started.

## Decision table

| Test (in this order) | Bucket | Action |
|---|---|---|
| Asks for a password, OTP, payment change, or has a link "from" a Thai bank, the RD, a courier or the police | **Verify** | Do not click. Check in the official app or by calling the number on the card. Thai banks stopped sending links by SMS and email in 2023 |
| Blocks someone today, or has a deadline today/tomorrow | **Today** | Reply now or block a slot today |
| Real request, not urgent | **This week** | Dated task / calendar slot; reply "received, will answer by [day]" if the sender waits |
| Someone else should handle it | **Delegate** | Forward with one line: what you need back and by when; log in `waiting-for` |
| Receipts, e-Tax invoices, statements, bookings | **File** | Move to the matching folder (below), then archive |
| Newsletters, CC, notifications | **Archive** | Archive; unsubscribe if unopened for 3 issues |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20230309.html

## Folder / label set (keep it to seven)

`1-Today` · `2-This week` · `3-Waiting for` · `Receipts-Tax` (e-Tax invoices, ใบเสร็จ, insurance premium certificates — needed for ลดหย่อน) · `Travel` · `Reference` · Archive. More labels = more deciding.

## Thai mail that matters (do not archive blind)

- **e-Tax Invoice / e-Receipt** in your name and ID — keep for deduction campaigns and warranty claims (`warranty-tracker` in consumer-rights, if installed)
- **ใบแจ้งหนี้ / e-Statement** — card and utility bills; check due dates in the weekly review
- **Insurance renewal and premium certificate** (หนังสือรับรองการชำระเบี้ย) — for tax and for `important-docs`
- **Government** — messages from RD, SSO or DLT usually point you to log in on the official site; type the address yourself

## Waiting-for log

```
| Sent | To | What I need back | Chase on |
|---|---|---|---|
| 2026-10-06 | Khun Ploy | signed quotation | 2026-10-09 |
```

Chase politely on the date (`polite-message-th-en` for the wording).

## Worked example

Monday, 63 unread. Ten minutes:
- 2 **verify** — "KBank: account suspended, click to confirm" (phish — report and delete) · courier "fee unpaid" SMS-style mail (delete)
- 3 **today** — boss asks for figures by 15:00 (slot 13:00–14:00) · school form due tomorrow (signed, replied) · landlord asks repair time (2-minute reply)
- 5 **this week** — dated tasks Wed/Thu
- 2 **delegate** — IT access request to the admin, logged
- 6 **file** — e-Tax invoices to `Receipts-Tax`
- 45 **archive** — 4 newsletters unsubscribed

## Rules

- Daily habit, not a monthly marathon; skip a day → do two short sessions, never a backlog weekend
- Never mark-read-and-forget — every kept item leaves with an owner and a date
- Do not set up auto-delete rules on anything that could be a bill, a tax document or a government notice
- Reply "received, will answer by …" beats silence for anything over 2 days

Related: `weekly-review` (clears `Waiting for`) · `digital-hygiene` (phishing, account takeover) · `subscription-audit` (newsletter and trial mail).
