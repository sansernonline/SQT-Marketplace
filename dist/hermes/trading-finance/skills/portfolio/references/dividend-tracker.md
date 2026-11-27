<!-- merged from skill `dividend-tracker` on 2026-11-27 · description was: Use when asking about dividend income, XD dates or yield -->
# Dividend Tracker (ติดตามเงินปันผล)

Tracker template: [references/dividend-template.md](dividend-template.md). General information, not investment or tax advice — for the tax decision ask a นักบัญชี or RD 1161. Tax treatment of dividends: `income-tax-th`.

## The dates — SET (T+2 settlement)

| Term | Meaning | Rule of thumb |
|---|---|---|
| Board approval date | Board proposes the dividend (interim: board decides; annual: needs the AGM) | Announced on SET news |
| **XD** (Excluding Dividend) | First day a buyer does **not** get the dividend | **1 business day before** the record date |
| Last day to buy | Business day before XD | Buy on or before this day to receive the dividend |
| **Record date** | Day the share register is closed to list holders | Shares must have settled (T+2) by this day |
| **XM** (Excluding Meeting) | First day a buyer cannot attend / vote at the meeting | Same mechanics as XD, for the meeting record date |
| Payment date | Cash arrives (bank account or broker's cash account linked via ATS / PromptPay) | Annual dividend: within 1 month of the AGM approval (พ.ร.บ.บริษัทมหาชนจำกัด มาตรา 115) |

On the XD day the price usually opens lower by about the dividend — buying the day before XD just to "collect" it gains nothing before tax and loses 10% to withholding.

ตรวจล่าสุด 2026-10-06 · sources: [`sources.md`](dividend-tracker/sources.md)

## Formulas

```
gross dividend        = DPS (dividend per share) × shares held on record date
withholding tax       = 10% × gross            (Thai listed company → individual resident)
net cash received     = gross × 0.90
trailing yield        = DPS paid in last 12 months ÷ current price
yield on cost         = annual DPS ÷ average cost per share
portfolio yield       = expected annual net dividends ÷ current portfolio value
```

Gross, withheld, net and yields per holding: `node money-calc.mjs dividend <file.json>` (script in `portfolio-snapshot.md`, see its Script path; the worked example in [`worked-example.md`](dividend-tracker/worked-example.md) is `../portfolio/scripts/examples/dividend.json` and gives 1,600 / 160 / 1,440 and 4.5%). `source` is `thai-listed` or `thai-fund` (10% withheld) or `foreign` (the script refuses until `withholdingPct` is given from a checked source).

**Tax**: the 10% is withheld at source; the holder may leave it as final tax or include all such dividends in ภ.ง.ด.90 and claim the dividend tax credit (เครดิตภาษีเงินปันผล). Which is cheaper depends on the marginal rate — compute it with `income-tax-th` (same plugin). Thai mutual fund dividends: 10% withheld, no credit. Foreign dividends (DRs, offshore): withholding differs by country — ask the user's situation, mark unknown rates (รอยืนยัน).

## Workflow

1. Build `dividends.csv` from holdings: symbol, shares, DPS, type (interim/annual), status (`declared` / `estimated`), XD, record date, payment date, gross, tax 10%, net.
2. Fill declared amounts from SET news / company IR; for undeclared, estimate from last year's DPS and payout ratio and **label as estimated**.
3. Flag XD dates **at least a week ahead** for names the user is thinking of buying or trimming.
4. Monthly rollup: net cash by payment month, running annual total, portfolio yield.
5. On payment date reconcile expected vs received (broker statement / ใบแจ้งการจ่ายเงินปันผล, which is also the tax certificate — keep it for filing).
6. Year end: total gross, total withheld, list of certificates for `income-tax-th`.

## Rules

- Never present an estimate as declared — label every figure.
- A yield far above the market (e.g. 10%+) usually means the market expects a cut; check the payout ratio and cash flow before believing it.
- Shares bought on the XD day or later do not get this dividend — check the trade date, not the settlement date.
- Stock dividends (หุ้นปันผล) and XR (rights) change share count; adjust shares before computing next DPS yield.

Output: upcoming XD list (next 30 days), monthly net cash table, annual total with gross / withheld / net, and which figures are estimates.

## References

- [`worked-example.md`](dividend-tracker/worked-example.md) — open when you want a filled-in dividend calculation
- [`sources.md`](dividend-tracker/sources.md) — open when you must re-check settlement or payment rules
