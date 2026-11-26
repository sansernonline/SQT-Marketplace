# Chasing overdue invoices (ตามหนี้ลูกค้าเครดิต) · doc-quotation

Open when the user asks to chase overdue invoices from several credit customers (B2B buyers, resellers, agents), at month end or billing day. One awkward message to one customer → `human-writing/polite-message-th-en` (plugin `superuser`), whose tone ladder the levels below follow. Process from Anthropic's invoice-chase skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), rewritten for Thai sellers; no text copied.

## Levels

| Level | When | Message (LINE, the channel sellers actually use) |
|---|---|---|
| 1 Reminder | just past due, or a good payer | invoices, total, due dates, "หากชำระแล้วขออภัยและรบกวนส่งสลิปให้ด้วยนะคะ" + PromptPay QR for the total (`promptpay-qr`) |
| 2 Second request | about 2 weeks later, or a sometimes-late payer | same facts + ask for the date they will pay; offer to split a large amount |
| 3 Before stopping supply | still unpaid after level 2 | same facts + the date after which credit sales pause, only if the owner will really do it; a formal demand letter if the owner decides (`doc-thai-official`) |

## Rules for every level

- State facts and the next step. Never threaten, insult, shame, or tell anyone else about the debt (family, staff, a group chat, a public post). Never write the debt on the outside of an envelope.
- A business whose normal trade is giving credit may fall under the Debt Collection Act B.E. 2558 (พ.ร.บ.การทวงถามหนี้), which limits contact times, how often you contact, and what you may say (รอยืนยัน whether your shop is covered and the current rules, with a lawyer).
- Late-payment interest: if the contract sets no rate, default interest under the Civil and Commercial Code ม.224 is **5% a year** since 11 Apr 2564 (ม.7 rate 3% a year), per the Bank of Thailand, checked 2026-11-10: [bot.or.th article 3 Jul 2564](https://www.bot.or.th/th/research-and-publications/articles-and-publications/articles/Article_3Jul2021.html). Mention it only after level 2, and only if the owner wants to claim it.
- How long the shop can still sue for an unpaid sale (prescription) is limited by law (รอยืนยัน the period with a lawyer); do not let an invoice sit for years.
