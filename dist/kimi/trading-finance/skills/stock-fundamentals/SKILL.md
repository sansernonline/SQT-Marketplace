---
name: stock-fundamentals
description: Use when reading a Thai stock's financial statements or ratios (P/E, P/BV, ROE, D/E, payout, งบการเงิน) or screening SET names before a watchlist.
---

# Stock Fundamentals (อ่านงบและตัวเลขพื้นฐานหุ้น SET)

General information, not investment advice. This skill turns a company's filed statements into a handful of ratios and the places worth a second look. It never says buy or sell.

> **One rule:** every ratio comes from a `ratios.mjs` run on figures the user (or a data plugin) took from the filed statement, with the statement date and the price date beside it — a ratio without both dates is not shown.

## Use when / not when

| Situation | Use |
|---|---|
| "P/E ของ ABC เท่าไร ถูกไหม" · "ROE เท่านี้ดีไหม" · "งบไตรมาสนี้อ่านยังไง" · "คัดหุ้นปันผลเข้าลิสต์" | this skill |
| Writing the thesis, entry and invalidation for a name | `watchlist-setup` (call this skill first for the numbers) |
| What the chart says, entry timing | `technical-signals` |
| Results came out today, does it change the thesis | `news-impact` (results day) |
| Dividend dates, XD, dividend tax | `dividend-tracker` · `tax-basics-th` |
| Choosing a mutual fund | `mutual-fund-picker` |

## Where the figures come from

- The statement filed on set.or.th (company page → financial statements, or the company news item with the PDF). Use the **consolidated** statement (งบการเงินรวม) unless the company has none.
- Profit line: **กำไรสุทธิส่วนที่เป็นของผู้ถือหุ้นบริษัทใหญ่** (profit attributable to owners of the parent), not total profit that includes non-controlling interests. Equity line: **ส่วนของผู้ถือหุ้นบริษัทใหญ่**.
- 12 months = the last 4 quarters added up (trailing). Quarterly figures alone make P/E look 4 times too high.
- Thai statements are often in thousand baht (พันบาท). Put that in `unit` (1000); shares stay in shares and price in baht. A wrong unit is the most common error — the margin flag below catches most of it.
- Data plugin or Settrade page figures are fine too, but record the as-of date they show.

## The ratios

| Ratio | Formula | Read it as |
|---|---|---|
| EPS (กำไรต่อหุ้น) | net profit (owners) ÷ shares | Base for P/E and payout |
| P/E | price ÷ EPS | Years of today's profit the price pays for. Compare with the same company's own history and its sector, never across sectors. Not meaningful when EPS ≤ 0 |
| P/BV | price ÷ (equity ÷ shares) | Price against book value. Most useful for banks, insurers, property; less for asset-light companies |
| ROE | net profit ÷ equity | Profit per baht of shareholders' money. End-of-period equity here; average equity is more exact |
| D/E | total liabilities ÷ equity | How much the company leans on debt. **Not for banks or insurers** (deposits and reserves are debt by nature) |
| Interest coverage | EBIT ÷ interest expense (ต้นทุนทางการเงิน) | Times profit covers interest |
| Dividend yield | dividends per share (12 months) ÷ price | Cash return at today's price, before 10% withholding |
| Payout (อัตราการจ่ายปันผล) | dividends per share ÷ EPS | Share of profit paid out. Above 100% = paying more than it earns |
| Net margin | net profit ÷ revenue | Also the unit check: a margin far outside normal usually means a unit mistake |
| Growth | (this 12 months − previous 12 months) ÷ previous | Revenue and profit, year on year |

Banks: look instead at net interest margin (NIM), non-performing loan (NPL) ratio, coverage ratio and capital adequacy (BIS ratio) from the bank's own report. Insurers: capital adequacy ratio (CAR) and loss ratio. The script prints this note and leaves D/E out when `sector` is `bank` or `insurance`.

## Flags — where to open the statement

The script lists these. A flag is "go read the notes to the statement", not a verdict. Thresholds are starting values, not measured; the user may change them in the script.

| Flag | Fires at | Usual reason to look for |
|---|---|---|
| Growth jump | revenue or profit +100% or more, or −50% or worse | Acquisition, asset sale, one-off gain, base year was a loss |
| Margin outside −50% to 60% | net margin | Wrong unit, one-off gain, holding company |
| ROE above 40% | ROE | One-off gain, or tiny equity after big payouts or buybacks |
| D/E above 2 (general companies) | D/E | Read debt maturities and covenants in the notes |
| Coverage below 1.5 | EBIT ÷ interest | Profit barely pays the interest |
| Payout above 100%, or dividend while EPS ≤ 0 | payout | Paid from retained earnings or borrowing |
| EPS ≤ 0 or equity ≤ 0 | — | P/E, P/BV, ROE do not apply |

**One-off items** (กำไรพิเศษ: land sale, revaluation, impairment) go in `oneOff`; the script then shows core EPS and core P/E next to the reported ones. If the user does not know, say the reported profit may include them.

## Workflow

1. Ask for the symbol and get the latest filed statement; write down the statement date (end of period) and the filing date.
2. Fill the input file (example `scripts/example.json`). Missing optional fields are fine; missing required ones stop the script with the field name.
3. Run `node scripts/ratios.mjs <file.json>` (`--json` for raw numbers · `--self-test` checks the hand-worked examples). **Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/stock-fundamentals/scripts/ratios.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/stock-fundamentals/scripts/ratios.mjs` · Node only.
4. Show the table, then each flag with what to read in the statement notes. Compare P/E and P/BV only with the company's own past and its sector peers that the user names or the data plugin gives (with dates).
5. Hand over to `watchlist-setup` if the user wants to follow the name: the numbers feed its thesis pillars.

## Screen — candidates, not conclusions

Put several companies in `companies` and a `screen` (`maxPE` · `minROE` · `maxDE` · `minYield`). A name passes only if it meets every limit **and** has no flag. Passing means "worth reading the statement", never "worth buying"; the script prints that line and the answer keeps it. Screen limits are the user's; this skill has no default limits.

## Worked example (illustrative, not a real company)

`scripts/example.json`: AAA, statement 30 Sep 2026, price 40 baht on 7 Nov 2026, figures in thousand baht.

| Ratio | Working | Result |
|---|---|---|
| EPS | 2,500,000 thousand ÷ 1,000 million shares | 2.50 |
| P/E | 40 ÷ 2.50 | 16.0 |
| P/BV | 40 ÷ (20,000,000 thousand ÷ 1,000 million) | 2.00 |
| ROE | 2,500,000 ÷ 20,000,000 | 12.5% |
| D/E | 15,000,000 ÷ 20,000,000 | 0.75 |
| Coverage | 3,600,000 ÷ 400,000 | 9.0 times |
| Yield · payout | 1.50 ÷ 40 · 1.50 ÷ 2.50 | 3.75% · 60% |
| Core P/E | land sale 500,000 thousand removed → EPS 2.00 | 20.0 |

Reading: on reported profit P/E is 16; without the land sale it is 20, so the lower figure came from a one-off. BBB in the same file is a loss maker with D/E 3 and interest coverage 0.75, paying a dividend anyway: five flags, and it fails the screen.

## Check before sending

- Every ratio came from a `ratios.mjs` run this session; statement date and price date are shown
- Profit and equity are the owners-of-the-parent lines; 12 months, not one quarter
- Every flag the script printed is passed on with what to read in the notes
- Banks and insurers have no D/E; the note about NIM, NPL or CAR is passed on
- No buy, sell or "cheap/expensive" verdict; a screen pass is called a candidate

## Sources

- Ratio groups (profitability, liquidity, leverage, efficiency, valuation) follow the idea of `analyzing-financial-statements` in anthropics/claude-cookbooks (MIT, viewed 2026-11-10) — formulas are textbook ones, the script is written from scratch in Node, no code copied
- Flag idea (growth over 100%, margins out of range) from `audit-xls` step 3f, anthropics/financial-services (Apache-2.0, viewed 2026-11-10); thresholds here are our own starting values
- Statement deadlines (45 days after a quarter, 2–3 months for the year): see `watchlist-setup`, checked 2026-10-26 with SET and SEC links
