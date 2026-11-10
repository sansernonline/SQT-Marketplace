---
name: cash-flow
description: Use when a Thai seller or SME may run short of cash (13-week forecast, slow marketplace payouts, COD, stock buys, VAT and WHT due dates).
---

# Cash Flow for a Thai Small Business

A shop can be profitable and still unable to pay the supplier on Friday. Profit is counted when you sell; cash arrives when the platform pays out, the courier remits COD, or the customer transfers. This skill forecasts cash week by week for 13 weeks and says what to do before the balance goes negative. General information, not financial or tax advice.

> **One rule:** forecast cash on the day it actually moves, from your own history, not from sales figures or platform promises. Every week, replace the forecast with the actual and roll forward one week.

## Use when / not when

| Situation | Use |
|---|---|
| "Will I have enough to pay X", big stock order coming, sales up but bank down, peak season (11.11, 12.12) | this skill |
| Recording what already happened, month-end close | `sme-bookkeeping` (the forecast starts from its journal) |
| Is the product priced to make money at all | `marketplace-fees-pricing` |
| Which courier pays COD faster or cheaper | `shipping-compare` |
| Exact tax form dates and penalties | `tax-vat-th` · salary and social security dates → `payroll-th` · `social-security-th` |
| Personal household budget | `personal-budget` in `trading-finance` (if installed) |

## 1. Measure your real delays first

Do not guess payout timing. Take last month's orders and the payout reports and measure, per channel, the days from **order date** to **money in your bank**.

| Channel | What drives the delay | Measure |
|---|---|---|
| Shopee · Lazada · TikTok Shop | Delivery time + buyer confirmation or auto-confirm window + the platform's release and withdrawal cycle. Rules differ by platform and change; read the current terms in each seller centre (รอยืนยัน per platform) | median days, and the slowest 10% |
| Courier COD (LINE, Facebook, own web) | Delivery + the courier's COD remittance cycle + refused parcels that come back with no cash (`shipping-compare`) | days, and refusal rate % |
| Bank transfer, PromptPay | Usually same day | — |
| B2B invoice with credit terms | The terms you gave (30, 60 days) plus how late customers really pay | days after due date |

Write the result as a lag table, e.g. Shopee 9 days, TikTok 12 days, COD 6 days with 8% refused. Use these numbers in the forecast. Returns and refunds also come out of later payouts; take last month's return rate per channel.

Keep the slow end too, not just the median: a channel that pays in 9 days on average but sometimes in 15 is the one that leaves you short. With fewer than 3 measured payouts for a channel, use median + 30% as its slow lag and label it `(ค่าเริ่มต้น ยังไม่ได้วัดกับร้านจริง)` until real payouts replace it. The 30% is a starting value from Anthropic's cash-flow-snapshot skill, not a measured Thai figure.

## 2. Build the 13-week forecast

Template: [references/13-week-forecast.md](references/13-week-forecast.md). One column per week (Monday to Sunday), rows:

1. **Opening cash** = business bank balance (week 1 = today's real balance; later weeks = previous closing).
2. **Cash in** — platform payouts by channel (sales shifted by the lag from section 1, minus fees and returns) · COD remittances (minus refusals and COD fee) · direct transfers · customer invoices due · other (loans received, owner putting money in).
3. **Cash out** — stock purchases on the date you pay the supplier (deposit and balance separately) · packaging · ads (card bill date, not click date) · shipping you pay · rent, utilities, software · wages and owner draw · loan repayments · **tax and social security on their due dates** (section 3).
4. **Closing cash** = opening + in − out.
5. **Minimum buffer** — a floor you do not go below, e.g. 2 weeks of fixed costs (rent, wages, loans, owner draw).

Highlight every week where closing cash is below the buffer. That week is the problem to solve now, not then.

6. **Slow-case closing** — the same week with every payout shifted by its slow lag instead of the median. A week that is fine on the median but below the buffer in the slow case still gets a flag.

Every flag names the source, the week and the amount, so the owner knows whom to call: "TikTok payout in week 3 lands 6 days late in the slow case; week 3 closes at 18,400, below the 40,000 buffer". A flag that only says "cash may be tight" is not finished.

## 3. Tax and contribution dates that take cash

Put these in the forecast on the date the money leaves, for the forms that apply to you. Full calendar, e-Filing extensions and weekend shifts: `tax-vat-th` section 2.

| What | Paid | Amount to forecast |
|---|---|---|
| WHT you withheld (ภ.ง.ด.1, 3, 53) | by the 7th of next month on paper; e-Filing later (see `tax-vat-th`) | the WHT you deducted last month — it is not your money, keep it aside |
| VAT (ภ.พ.30), if registered | by the 15th of next month on paper; e-Filing later | output VAT − input VAT for last month; a big stock month can mean a refund or credit instead |
| Social security (สปส.1-10) | by the 15th of next month | employee share withheld + employer share |
| Half-year and annual income tax (ภ.ง.ด.94 / 90 individuals · ภ.ง.ด.51 / 50 companies) | see `seller-tax-basics` · `tax-vat-th` | estimate from year-to-date profit; this is the payment that most often surprises small shops |

ตรวจล่าสุด 2026-10-25 (วันครบกำหนดยกมาจาก `tax-vat-th` และ `social-security-th` ซึ่งตรวจกับเว็บทางการ 2026-10-22 · รอบนี้ไม่ได้เปิดตัวบทซ้ำ) · แหล่ง: https://www.rd.go.th · https://www.sso.go.th

## 4. Warning signs and what to do

| Sign | Likely cause | Action, cheapest first |
|---|---|---|
| Sales up, bank down | Cash tied in stock and payouts in transit | Slow the next stock order; buy in smaller lots more often |
| Stock on hand > 2 months of sales | Over-buying, slow lines | Bundle or discount slow SKUs (`multi-shop-stock`), stop reordering them |
| COD refusals or returns rising | Wrong buyers, slow delivery | Push prepaid (`promptpay-qr`), confirm COD orders by chat before shipping |
| Paying WHT or VAT from new sales | Tax money spent as working capital | Move withheld tax and VAT into a separate "tax" account on the day you collect it |
| Card bill paid late or only the minimum | Ads spending ahead of payouts | Cap daily ad spend to what last week's payouts can cover |
| Forecast below buffer within 4 weeks | Any of the above | Close the gap with the cheapest source first, ranked by cost per baht in [references/close-the-gap.md](references/close-the-gap.md); compare any loan on its full yearly cost in writing |
| Owner draws exceed profit for 3 months | Business funding the household | Fix the owner draw at a set amount (`sme-bookkeeping` section 3) |

Closing the gap: cheapest source first (supplier terms that lose no discount → early collection → smaller stock lots → short loan at its full yearly cost); the ranked table with formulas and a worked 11.11 stock-order example are in [references/close-the-gap.md](references/close-the-gap.md).

Never pay supplier deposits or "release fees" to unlock platform money at the request of a chat, call or link — platforms pay out through the seller centre only. Treat such messages as possible scams (`scam-check` in `trading-finance`, if installed).

## Check before handing over

1. Week 1 opening = today's real bank balance.
2. Payouts are shifted by measured lags, net of fees and returns.
3. Tax, social security and owner draw appear as cash out on their dates.
4. Every week below the buffer, on the median or the slow case, has a named source, amount, action and owner.

## Related

`sme-bookkeeping` (actuals that feed the forecast) · `marketplace-fees-pricing` · `shipping-compare` · `multi-shop-stock` · `promptpay-qr` · `tax-vat-th` · `payroll-th` · `social-security-th` · `seller-tax-basics`
