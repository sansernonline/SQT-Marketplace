---
name: debt-payoff
description: Use when the user has several debts (cards, personal or title loans), or asks snowball vs avalanche.
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
| Nano finance (สินเชื่อรายย่อยเพื่อการประกอบอาชีพ) | 33% per year |
| Car or motorbike hire purchase (เช่าซื้อ) for personal use | new car 10% · used car 15% · motorbike 23% per year, effective rate (ประกาศ ธปท. 55/2568 ลงวันที่ 2 ธ.ค. 2568 · รอยืนยัน) |
| Credit card minimum payment | 8% of balance, kept at 8% until 31 Dec 2569 |

A lender charging above these, or an unlicensed lender (เงินกู้นอกระบบ), is outside the rules — informal loans above 15% per year are illegal under the Civil and Commercial Code (ป.พ.พ. ม.654) and the 2560 loan-interest act; report to police or **1359**, the ศูนย์รับแจ้งการเงินนอกระบบ สำนักงานเศรษฐกิจการคลัง (office hours; 1359.go.th, ตรวจ 2026-10-26 · https://www.1359.go.th/contact/ , https://www.thansettakij.com/finance/489385).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html , https://www.prachachat.net/finance/news-1368667 · ตรวจซ้ำ 2026-10-22: หน้า BOT news-20251204-2 ยืนยันขั้นต่ำ 8% ถึงสิ้นปี 2569 · เพดาน 16/25/24/33% ตรวจล่าสุด 2026-10-25 · แหล่ง: https://www.bot.or.th/content/dam/bot/documents/th/our-services/bot-license-check/interest.pdf (ประกาศ ธปท. สนส. 11-13/2563 · เช่าซื้อ 10/15/23% อยู่ในเอกสารเดียวกัน ตรวจ 2026-10-25 แหล่งเดียว) , https://www.thairath.co.th/money/personal_finance/finance_banking/2843164 , https://www.sawad.co.th/article/legal-interest-rates-and-calculation (25/24/33%) , https://www.tcc.or.th/credit-card-interest/ (16%)

## Workflow

1. **List every debt**: lender, balance, rate, minimum payment, overdue status. Use statements, not memory.
2. **Stop the bleeding**: no new borrowing; cards out of the phone wallet. Keep a 1-month mini buffer so a surprise bill does not go back on the card.
3. **Budget the fixed monthly debt payment** from `personal-budget` — minimums on all + everything extra on one target.
4. **Pick order by the numbers** — run `payoff.mjs` (section "Simulation script" below) on the real debt list and budget:
   - **Avalanche** — highest rate first; least total interest.
   - **Snowball** — smallest balance first; fastest first win, keeps people going.
   - Gap = snowball total interest − avalanche total interest (baht). Avalanche is the default. If the gap is at most 1 month of the budget (starting value, not yet measured) **and** the user says they have quit plans before or need early wins, snowball is fine — tell the user it costs that many baht extra. If the gap is larger, show both and say how many baht the user pays for the earlier first win; the user decides.
5. **When a debt is cleared**, roll its whole payment onto the next target.
6. **Check refinance / consolidation** (below).
7. **If minimum payments are impossible**, use the restructuring channels before the debt turns a non-performing loan (NPL, 90+ days overdue).

## Simulation script

`payoff.mjs` simulates avalanche and snowball month by month: each month it adds interest (balance × yearly rate ÷ 12), pays every minimum, and puts the rest of the budget on the target debt; when a debt clears, its payment rolls to the next. Output: the month each debt clears, the month all clear, total interest, and the gap in baht.

```
node payoff.mjs <file.json> [--json]     # example file: scripts/example.json
node payoff.mjs --self-test
```

Input file: `{ "budget": 8000, "debts": [ { "name": "...", "balance": 15000, "rate": 16, "min": 1000 } ] }` · rate is % a year (24, not 0.24; the script warns below 1). For a credit card whose minimum is a share of the balance (8% above), put `"minPct": 8` (optional `"minFloor"` in baht) instead of `"min"`, so the minimum falls as the balance falls. Debt names must differ (two cards: `"บัตร KTC"`, `"บัตร KTC (2)"`); a repeated name stops the script. Every field must be a finite number; a bad field stops the script with a message naming it. If the budget is below the sum of minimums the script stops and says so. If the monthly interest is more than the payment, the debt never clears: the script reports that the budget cannot clear these debts and does not compare the two methods. If snowball finishes sooner than avalanche, it says so as it is.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/debt-payoff/scripts/payoff.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/debt-payoff/scripts/payoff.mjs` · Node only, no dependencies.

Debt output is information; the user decides.

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

Avalanche saves about 1,240 baht (1,241 by `payoff.mjs scripts/example.json`, run 2026-10-27). That is under 1 month of the 8,000 budget, so snowball is a fair choice for a user who needs early wins, and costs about 1,240 baht extra; snowball clears the first debt in month 6. The gap widens when rates differ more or balances are larger. The real win is the fixed 8,000 — paying only minimums would take years longer.

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
