---
name: debt-payoff
description: Use when the user has several debts (credit cards, บัตรกดเงินสด, personal or car title loans), asks snowball versus avalanche, refinance or consolidation, Thai interest caps, or cannot pay minimums and needs คลินิกแก้หนี้.
---

# Debt Payoff (ปลดหนี้)

General information, not legal or financial advice — for lawsuits or garnishment ask a lawyer (สภาทนายความ legal aid) or the bank's debt team.

## Thai interest caps (Bank of Thailand, regulated lenders)

| Debt | Max interest incl. fees |
|---|---|
| Credit card (บัตรเครดิต) | 16% per year |
| Personal loan — revolving (บัตรกดเงินสด) | 25% per year |
| Personal loan — instalment | 25% per year |
| Car title loan (จำนำทะเบียนรถ) | 24% per year |
| Credit card minimum payment | 8% of balance, kept at 8% until 31 Dec 2569 |

A lender charging above these, or an unlicensed lender (เงินกู้นอกระบบ), is outside the rules — informal loans above 15% per year are illegal under the Civil and Commercial Code (ป.พ.พ. ม.654) and the 2560 loan-interest act; report to police / 1359 (รอยืนยัน hotline).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html , https://www.prachachat.net/finance/news-1368667

## Workflow

1. **List every debt**: lender, balance, rate, minimum payment, overdue status. Use statements, not memory.
2. **Stop the bleeding**: no new borrowing; cards out of the phone wallet. Keep a 1-month mini buffer so a surprise bill does not go back on the card.
3. **Budget the fixed monthly debt payment** from `personal-budget` — minimums on all + everything extra on one target.
4. **Pick order**:
   - **Avalanche** — highest rate first; least total interest.
   - **Snowball** — smallest balance first; fastest first win, keeps people going.
   - Choose snowball if the user has quit plans before; otherwise avalanche.
5. **When a debt is cleared**, roll its whole payment onto the next target.
6. **Check refinance / consolidation** (below).
7. **If minimum payments are impossible** → restructuring channels before the debt turns NPL (90+ days overdue).

## Worked example — snowball vs avalanche

Budget 8,000 baht/month. Debts:

| Debt | Balance | Rate | Minimum used |
|---|---|---|---|
| A — cash card | 80,000 | 25% | 3,000 |
| B — credit card | 15,000 | 16% | 1,000 |
| C — car title loan | 50,000 | 24% | 2,000 |

Simulated monthly, interest added then payments:

| Strategy | Order | Paid off (month) | Total interest | Debt-free |
|---|---|---|---|---|
| Snowball | B → C → A | B 6, C 16, A 23 | 37,843 | month 23 |
| Avalanche | A → C → B | A 20, C 23, B 17 (by minimums) | 36,602 | month 23 |

Avalanche saves about 1,240 baht; snowball clears the first debt in month 6. The gap widens when rates differ more or balances are larger. The real win is the fixed 8,000 — paying only minimums would take years longer.

## Refinance and consolidation

- **Consolidation loan** from a bank at a lower rate is worth it only if: new rate clearly lower, fees counted, and the old cards are closed or the limit cut — otherwise debt doubles.
- **Balance transfer (โอนยอดบัตร)** promotional rate: check the end date and the rate after; pay off before it ends.
- **Home-equity refinance** turns unsecured debt into debt secured on the house — warn about that risk.

## When you cannot pay

| Situation | Channel |
|---|---|
| Still current or under 90 days overdue, income dropped | Ask own bank for debt restructuring (ปรับโครงสร้างหนี้) — BOT requires lenders to offer it before default; long-term loan conversion for card debt |
| NPL card / cash card / personal loan, unsecured, with participating banks | **คลินิกแก้หนี้ by SAM** (บสส.) — interest 3–5% per year, up to 10 years; apply at debtclinicbysam.com (eligibility cut-off dates (รอยืนยัน)) |
| Cannot reach the lender / unfair treatment | BOT Financial Consumer Protection Center (ศคง.) hotline 1213 |
| Already sued | Attend court mediation; ask court legal aid or Lawyers Council |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/personal_finance/finance_banking/2748868

## Rules

- Never suggest a new loan to pay minimums.
- Minimum payment only on a 16% card at 8% minimum still takes years; always show the time to payoff.
- Emergency fund goes to a mini buffer (1 month) during payoff, then grows to full size (`emergency-fund`).
- A "debt clearing" agent asking for an upfront fee is a red flag — run `scam-check`.
