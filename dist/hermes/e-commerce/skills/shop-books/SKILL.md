---
name: shop-books
description: Use when a Thai shop keeps books, plans cash or needs a PromptPay QR
---

# shop-books — bookkeeping, 13-week cash and PromptPay QR

> **One rule:** one bank account for the business, one row per money movement, and one document behind every row; profit on paper is not cash in the bank.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| A Thai shop or SME keeps its books, closes the month | [references/sme-bookkeeping.md](references/sme-bookkeeping.md) |
| The seller may run short of cash in the coming weeks | [references/cash-flow.md](references/cash-flow.md) |
| A Thai business needs a PromptPay QR for payment | [references/promptpay-qr.md](references/promptpay-qr.md) |

Other files in this folder: `13-week-forecast.md`, `bookkeeping-sheet.md`, `close-the-gap.md`, `field-tables.md` and `payload.md`.

## Steps every part shares

1. Take the numbers from the bank statement, platform payout reports and receipts, never from the sales total alone.
2. Use the scripts in `scripts/` (`promptpay.mjs` for the QR payload) instead of typing fields or checksums by hand.
3. Write the date and the source next to every figure.

## Check before done

- Never pay a supplier deposit or a "release fee" to unlock platform money because a chat, call or link asked for it; treat that request as a likely scam (`scam-check` in `trading-finance`).
- Before shipping, check that the money arrived in the bank app or statement (amount, time, payer name), not the transfer slip, which can be edited or reused.
- A business bill paid from a personal card is recorded the same day as owner paid, with the receipt kept; never leave it unrecorded.
- A QR image is regenerated from the payload, never edited by hand.
- General information, not accounting or tax advice; a bookkeeper (ผู้ทำบัญชี) or accountant (นักบัญชี) signs off the books.

Whole job with several steps → playbook [monthly-close](../superuser/references/playbook-monthly-close.md) (month-end steps) or [pricing-check](../superuser/references/playbook-pricing-check.md) (profit check).
