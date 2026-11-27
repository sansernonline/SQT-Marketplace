# skill: portfolio

Use when checking the portfolio, dividends, DCA or rebalancing

# portfolio — snapshot, dividends, DCA and rebalancing

> **One rule:** write the target mix and the rebalancing rule down before the money goes in, then follow the rule rather than the news.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "How is the portfolio doing?" (honest snapshot of value, weight and gain) | [references/portfolio-snapshot.md](references/portfolio-snapshot.md) |
| Setting up monthly DCA, or rebalancing the mix | [references/rebalance-and-dca.md](references/rebalance-and-dca.md) |
| Dividend income, XD dates or yield | [references/dividend-tracker.md](references/dividend-tracker.md) |

Templates: [references/snapshot-template.md](references/snapshot-template.md), [references/dividend-template.md](references/dividend-template.md). Worked examples: [references/worked-example.md](references/worked-example.md), [references/dca-example.md](references/dca-example.md), [references/rebalance-example.md](references/rebalance-example.md). Script: `scripts/money-calc.mjs`.

## Steps every part shares

1. Refresh prices from an installed market-data plugin, and record the as-of time for each source. If there is no data plugin, ask for the broker statement values.
2. Run the data checks in the part before any total is shown.
3. Run `scripts/money-calc.mjs` for every total, drift or dividend figure.

## Check before done

- General information, not investment or tax advice. For the tax side of a dividend, the user asks a นักบัญชี or the Revenue Department (RD) call centre 1161.
- Never present an estimate as a declared figure; label every estimate.
- A holding with missing cost or units stays in the table at value and weight, with its P/L marked unknown, never dropped quietly.
- Never rebalance by selling RMF, ThaiESG or old SSF units early, because the tax saved must be repaid.
- An unreadable figure in a screenshot or PDF is asked about, never guessed.

Whole job with several steps → playbook [portfolio-check](../superuser/references/playbook-portfolio-check.md).


## reference: before-order-and-tax-wrappers.md

# Checks before any order, and tax-wrapper switching · rebalance-and-dca

Open when the plan is about to turn into a sell, switch or buy, or when RMF, ThaiESG or SSF units are involved.

## Before any order

What comes out of the skill is a draft plan for the user, not an order. Before the user sells, switches or buys:

| Check | Why | How |
|---|---|---|
| Money already on its way | A pending DCA, a salary transfer or a dividend may close part of the gap for free | List money arriving in the next month and run `drift` again with it |
| Fund cut-off time and NAV date | An order after the cut-off gets the next day's NAV; a switch out and in may sit uninvested for 1–2 days | Read the cut-off and settlement days in each fund's prospectus or factsheet (รอยืนยัน per fund; never quote a time from memory) |
| Minimums and whole units | A fund's minimum order, a stock's board lot (rules in `position-sizing`), or a DR's lot can leave part of the plan unbuyable | Round the plan to what can actually be ordered and show the left-over cash |
| ETF or DR price vs its NAV | An exchange-traded fund (ETF) or depositary receipt (DR) can trade above or below the value it holds, more in thin trading | Compare the price with the latest indicative NAV on the issuer's page; avoid the first and last minutes of the session |
| Hard-to-sell holdings | Corporate bonds and thinly traded names cost more to sell than the band saves | Use a wider band for them, or only redirect new money there |

When DCA and selling are close, show both in baht: the cost of selling or switching now (fees + tax + commission) against the months DCA alone needs (`drift` output). If the months are near N, say so; the user picks.

## Tax-wrapped units

- Never rebalance by selling RMF, ThaiESG or old SSF units early; the tax saved must be repaid (`income-tax-th`).
- An RMF can be switched to another RMF, at the same or a different fund house, without breaking the holding period; the transfer must finish within 5 business days and may carry a fee (2 sources only, รอยืนยัน with the fund house).
- ThaiESG to ThaiESG and SSF to SSF switches: ask the receiving fund house whether the holding period carries over (รอยืนยัน).
- RMF DCA must not lapse: the 3% / 5,000 baht minimum was dropped from 1 Jan 2563, but the user must keep buying every year until age 55 and may skip at most 1 year in a row (a year with no income does not count as a skip).

Sources and check dates: [sources.md](sources.md).


## reference: dca-example.md

# Worked example — DCA (ลงทุนสม่ำเสมอ) · rebalance-and-dca

Open when showing the user how dollar-cost averaging (DCA) buys units.

5,000 baht a month for 3 months; NAV 10.00, 8.00, 12.50.

| Month | NAV | Units |
|---|---|---|
| 1 | 10.00 | 500 |
| 2 | 8.00 | 625 |
| 3 | 12.50 | 400 |
| Total | — | 1,525 units for 15,000 |

Average cost 9.84 per unit, below the simple average NAV 10.17 — DCA buys more units when prices fall. It does not prevent losses; it removes timing decisions. Set it as a bank auto-debit right after payday (`budget-and-debt`).


## reference: dividend-template.md

# Dividend tracker template

## CSV header (`dividends.csv`)

```csv
symbol,shares,dps,type,status,period,xd_date,record_date,pay_date,gross,withholding,net,received,certificate_kept,note
```

| Column | Values |
|---|---|
| type | `interim`, `annual`, `fund`, `foreign` |
| status | `declared`, `estimated`, `paid` |
| withholding | 10% for Thai listed shares and Thai funds; foreign = per country (mark unknown) |
| received | actual net amount from the statement, filled on pay date |
| certificate_kept | Y/N — the dividend payment notice doubles as the withholding certificate |

## Monthly rollup

```
Year ____         Gross     Withheld    Net      Of which estimated
Jan
...
Dec
Total
Portfolio value ______   Portfolio net yield ____%
```

## Year-end checklist

- [ ] Every `declared` row has `received` filled
- [ ] Gaps explained (sold before XD, rounding, foreign tax)
- [ ] Certificates collected for every Thai dividend (needed if claiming the tax credit)
- [ ] Hand totals to `income-tax-th` to compare "final 10%" vs "include and claim credit"


## reference: dividend-tracker.md

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


## reference: portfolio-snapshot.md

<!-- merged from skill `portfolio-snapshot` on 2026-11-27 · description was: Use when asking how the portfolio is doing -->
# Portfolio Snapshot (สรุปพอร์ตหน้าเดียว)

One page that answers "how am I doing?" honestly. Holdings template and the page layout: [references/snapshot-template.md](snapshot-template.md). General information, not investment advice.

## Workflow

1. **Load holdings** from the user's file (ask where it lives). Include every account: stock broker, fund accounts (AMC / fund supermarket), Retirement Mutual Fund (RMF) / ThaiESG, provident fund (PVD) (latest statement), digital-asset exchange, cash and fixed deposits. Missing an account makes every percentage wrong.
2. **Refresh prices** via an installed market-data plugin; funds use the latest NAV (one business day behind); record the as-of timestamp per source. If there is no data plugin, say so and ask for the broker statement values. Then run the **data checks** below before any total; if the holdings live in the user's own spreadsheet with formulas, run the 9 checks in `trade-journal`'s [spreadsheet-check](../../trade-journal/references/spreadsheet-check.md) too.
3. **Compute per holding**: market value, cost, unrealised P/L (baht and %), weight %.
4. **Compute portfolio**: total value, cash %, allocation by asset class / sector / market / currency, realised P/L year to date (from `trade-journal`), dividends received YTD (from `dividend-tracker.md`).
5. **Return since last snapshot** — use the money-weighted shortcut below so deposits are not counted as gains. Then say where it came from (section "Where the return came from").
6. **Run the risk checks** (table below) and list only the ones that fire.
7. **Save** the snapshot as `snapshot-YYYY-MM.md` so the next one can compare.

## Data checks — before any total

Check these and list only what fires:

| Check | Fires when | Do |
|---|---|---|
| Size | A holding's gain is far beyond what its asset class could do (a money market fund +40%, a bond fund doubling) | Ask whether units, a split or a typo; do not compute until answered |
| Adds up | Sum of holdings ≠ the account total on the statement | Show the difference in baht; find the missing or extra line |
| Missing pieces | A holding has no cost or no units | Keep it in value and weight, mark P/L as unknown; never drop the row quietly |
| Stale | Fund NAV and stock prices are from different dates, or a statement is older than a month | Show each as-of date; say which totals mix dates |
| Counted twice | The same fund appears in the fund app and again inside a PVD or RMF statement, or one account was exported twice | Keep one, say which |
| Unreadable | A figure in a screenshot or PDF cannot be read clearly | Ask; never guess a number |

When a check fires, say which conclusion depends on that number (for example "the cash % and the concentration warning both use the DEF row, which has no cost").

## Formulas

```
unrealised P/L        = (price − average cost) × shares
weight                = holding value ÷ total portfolio value
simple return (period)= (end value − start value − net deposits) ÷ (start value + net deposits × 0.5)
```

The ×0.5 assumes deposits arrived mid-period (Modified Dietz shortcut) — good enough for a monthly snapshot; say it is an approximation.

Run the numbers with the script instead of by hand (the worked example below is `scripts/examples/snapshot.json` and gives the same figures):

```
node money-calc.mjs snapshot <file.json> [--json]     # also: attribution · drift · dividend · afterTax · fee · --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/portfolio/scripts/money-calc.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/portfolio/scripts/money-calc.mjs` · Node only, no dependencies. One script serves `rebalance-and-dca.md`, `dividend-tracker.md`, `fund-and-bond-picker` and `fund-and-bond-picker` too; example files for every command are in `scripts/examples/`.

## Where the return came from

One return figure hides which holding did the work. `node money-calc.mjs attribution <file.json>` splits each holding into price change (end − start − new money), dividends received, and its part of the portfolio return, using the same mid-period shortcut as the return above. New money is never counted as gain. When one holding accounts for more than half of all the movement (gains and losses added as sizes), the script names it: the month's result is that holding's result. The 50% line is a starting value, not measured.

Example `scripts/examples/attribution.json` (illustrative): ABC +8,000 price and 1,440 dividend = +9,440, DEF −5,000, the index fund +10,000 of new money and 0 gain, the money market fund +200, cash 0; total +4,640 = +1.6% on 291,800. ABC is 64.5% of the movement, so it is named. A dividend paid into the cash account goes in `dividends` only: if the cash row's end value already includes it, take it out of that row, or it is counted twice.

## Risk checks

| Check | Fires when (default) | Say |
|---|---|---|
| Single-name concentration | one stock > 10% (> 20% for a broad index fund) | Name, weight, what a 30% fall costs in baht |
| Sector concentration | one sector > 30% | Sector, weight |
| Cash | < 5% (no dry powder) or > 40% (idle, unless intentional) | Ask whether intentional |
| Losers held long | unrealised loss > 20% and thesis not reviewed in 3 months | Send to `market-watch` review |
| Cash Balance / caution sign | any holding under SET trading measures | Name it |
| Leverage | margin or credit-balance loan > 0 | Loan, maintenance margin buffer |
| Emergency fund | invested money is also the emergency fund | Point to `budget-and-debt` |
| Lock-ups | RMF / ThaiESG / PVD counted as spendable | Separate locked from liquid |

## Worked example

Holdings table, return and firing checks (illustrative, as of 2026-10-31): [references/worked-example.md](worked-example.md)

## Output

Headline (total value, month return, as-of) · data checks that fired · holdings table · allocation (asset class, sector) · YTD realised P/L and dividends · where the return came from · risk checks that fired · one question for the user. Command: `/portfolio`.

## เรียกเป็นคำสั่ง

`/trading-finance:portfolio [--file <path>]`

Run the `portfolio` skill: **the user's request**

If no portfolio file is known, ask where holdings are tracked. Mark stale prices honestly when a data plugin is missing for a market.

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: rebalance-and-dca.md

<!-- merged from skill `rebalance-and-dca` on 2026-11-27 · description was: Use when setting up monthly DCA or rebalancing a portfolio -->
# Rebalance and DCA (ลงทุนรายเดือน · ปรับสัดส่วนพอร์ต) — a draft plan: target mix, monthly DCA, rebalancing rule

General information, not investment advice.

> **One rule:** decide the target mix and the rebalancing trigger in writing before the money goes in, then follow the rule, not the news.

## Use when
- "I want to invest X baht every month" · "my stock part grew too big" · "should I sell winners?"

Not for: which fund to buy, factsheets → `fund-and-bond-picker` · RMF / ThaiESG amounts for tax → `income-tax-th` · current mix of a stock account → `portfolio-snapshot.md` · short-term trade size → `position-sizing` · no emergency fund or high-interest debt yet → `budget-and-debt` and `budget-and-debt` first.

## Steps
1. **Target mix.** Per pot of money, set goal and horizon (retirement 20 years, house down payment 4 years); money needed within 3 years does not go into equity. One simple mix per pot (for example equity 60 / bonds 40; equity may split Thai / global; 2–4 lines in all). Write mix, trigger and review date in the user's notes (`CONTEXT.md` or the finance folder). Review the mix at least once a year and after a change in goal, income or horizon.
2. **DCA (ลงทุนสม่ำเสมอ).** Amount = the fixed investment line from `budget-and-debt`, moved on payday by standing order. Split it by the target mix, or send all of it to the line under target (this rebalances for free). Thai funds: most asset management companies and bank apps offer a monthly auto-buy (ตั้งซื้ออัตโนมัติ); check the fund's minimum and front-end fee in the factsheet. Thai stocks: many brokers offer a stock DCA service; check commission and minimums (รอยืนยัน per broker). RMF and ThaiESG count toward this year's deduction only if paid by 31 December and within the caps in `income-tax-th`; prefer DCA over one lump in December if cash flow allows. DCA lowers average cost only when prices move both ways and does not prevent losses (worked numbers: [`dca-example.md`](dca-example.md)).
3. **Pick one rebalance rule.** Calendar: once a year on a fixed date (for example the first week of December, before tax-fund cut-offs), good for most people. Band: deviation = actual share − target share (percentage points, may be negative); act when the absolute deviation is above the band, default 5 points (starting value, not yet measured), for larger portfolios checked monthly. Both: look once a year, act only if the band is broken, which keeps fees low. Never rebalance on news or after one bad month; 5 points is a rule of thumb, not a regulation.
4. **When the deviation is above the band, close it with new money first** (redirecting new money costs nothing, so it is always allowed). Months to close = gap in baht ÷ (monthly DCA × (1 − target share of the underweight asset)), where gap in baht = target share × total portfolio value − current value of the underweight asset (the `(1 − target share)` part is there because new money also grows the whole portfolio). At most N months (N = 12, starting value, not yet measured): close it with DCA, do not sell. More than N months: selling or switching is allowed, but tell the user the cost (selling, switching and buying fees + tax on what is sold + broker commission) and the months DCA alone would take; the user decides. If DCA and selling are close, show both in baht; if the months are near N, say so.
   - Compute deviation, gap and months with `node money-calc.mjs drift <file.json>` (script in `portfolio-snapshot.md`, see its Script path; worked example `../portfolio/scripts/examples/drift.json` gives 10.9 points and 20 months). `bandPoints` and `maxMonths` default to 5 and 12.
   - To compare ways of rebalancing on cost and months to target (both `low`), use `decision-desk/decision-scoring`, command `score` (script path: see `decision-desk/decision-scoring`, superuser plugin); example options in `rebalance-score.json` (its switching fee is a placeholder, replace from the factsheet). Weights 0.5 cost / 0.5 months are starting values, not yet measured; the user's weights win. Selling RMF or ThaiESG early goes in `must`, not in the weights.
5. **How to rebalance, cheapest first.**
   1. Redirect new money to the line under target. No selling, no fees.
   2. Switch (สับเปลี่ยน) inside the same fund house; often free or cheap, check the factsheet.
   3. Sell and buy only if steps 1–2 would take more than about 12 months. Count front-end and back-end fees, broker commission, and tax on what is sold (rules in `income-tax-th`).
   4. Never rebalance by selling RMF, ThaiESG or old SSF units early (the tax saved must be repaid). An RMF may be switched to another RMF without breaking the holding period; RMF DCA must not lapse (at most 1 year skipped in a row). Switching rules and details (รอยืนยัน with the fund house): [`before-order-and-tax-wrappers.md`](before-order-and-tax-wrappers.md).
6. **Before any order**, the output is a draft plan, not an order. Run the 5 checks in [`before-order-and-tax-wrappers.md`](before-order-and-tax-wrappers.md): money already on its way (rerun `drift` with it) · fund cut-off time and NAV date (read the factsheet, รอยืนยัน per fund, never quote a time from memory) · minimums and whole units (show the left-over cash) · ETF or DR price vs its NAV · hard-to-sell holdings (wider band, or only redirect new money). When DCA and selling are close, show both in baht; if the months are near N, say so.
7. Show the worked example when helpful (target 60/40, equity 10.9 points over, DCA 10,000 a month → 20 months by new money alone, so switching is offered next to it with its cost, options A/B/C), then the user picks. Record the date and the new mix.

## Check before done
- Target mix and trigger written down, with the date; percentages add up to 100 and the gap is in baht.
- Months for DCA to close the deviation worked out before any sale; fees and tax-wrapper rules named before any sale or switch.
- Step 6 checks were run and the plan is called a draft, not an order.
- No specific fund named as "the best".

## References
- [`rebalance-example.md`](rebalance-example.md) — open for the worked example (options A/B/C), band source and the `score` command run
- [`dca-example.md`](dca-example.md) — open to show how DCA buys units (3-month NAV example)
- [`rebalance-score.json`](rebalance-score.json) — input for `decision-scoring score`
- [`before-order-and-tax-wrappers.md`](before-order-and-tax-wrappers.md) — open before any order, and for RMF / ThaiESG / SSF switching and DCA rules
- [`sources.md`](rebalance-and-dca/sources.md) — open to re-check RMF, band and source dates (RMF checked 2026-10-26)


## reference: rebalance-example.md

# Rebalance — band source, scoring command and worked example

Moved from `SKILL.md` (rebalance-and-dca)

## Band source and scoring command

The 5-point band comes from Vanguard's study of rebalancing (2010, US market, checked 2026-10-27): https://indexacapital.com/bundles/unaiadvisor/docs/papers/2010-Vanguard-Best-practices-for-portfolio-rebalancing.pdf . It is a rule of thumb for US portfolios, not a Thai rule. To compare several ways of rebalancing on cost and months to target (both `low`), use `decision-desk/decision-scoring`, command `score`. Script path: see `decision-desk/decision-scoring` (superuser plugin). Weights 0.5 cost / 0.5 months are starting values, not yet measured; the user's weights win. Selling RMF or ThaiESG early goes in `must`, not in the weights. The worked example's options A/B/C are in `references/rebalance-score.json` (its switching fee is a placeholder; replace it from the factsheet):

```
node plugins/superuser/skills/decision-desk/parts/decision-scoring/scripts/decide.mjs score plugins/trading-finance/skills/portfolio/references/rebalance-score.json
```

Run 2026-10-28: A, B and C all score 50 and the result reads `ยังไม่นิ่ง` (not stable) — cost and time trade off one for one, so the user chooses.

## Worked example

Target equity 60 / bonds 40. Today: equity funds 780,000 · bond fund 320,000 · total 1,100,000. DCA 10,000 a month.

| Line | Now | % now | Target % | Deviation (points) | Target baht | Gap |
|---|---|---|---|---|---|---|
| Equity | 780,000 | 70.9 | 60 | +10.9 | 660,000 | −120,000 |
| Bonds | 320,000 | 29.1 | 40 | −10.9 | 440,000 | +120,000 |

Deviation 10.9 is above the 5-point band. Months for DCA (all into bonds) to close it = 120,000 ÷ (10,000 × (1 − 0.40)) = 20, which is more than N = 12, so selling or switching may be offered with its costs (switching fee from the factsheet, tax if sold) next to DCA alone; the user decides. Check: after 20 months bonds are 320,000 + 200,000 = 520,000 of 1,300,000 = 40%. With a DCA of 20,000 a month it would take 10 months, and DCA alone (option A) is the rule. Options shown to the user:

| Option | What happens | Cost |
|---|---|---|
| A · New money only | Put the whole 10,000 a month into bonds | About 20 months to close the gap at today's prices (120,000 ÷ 6,000); no fees |
| B · Switch now | Switch 120,000 from the equity fund to a bond fund at the same fund house | Switching fee per factsheet; done in a few days |
| C · Half and half | Switch 60,000 now, redirect DCA for 10 months | Half the fee of B, back to target in about 10 months (60,000 ÷ 6,000) |

The user picks. Record the date and the new mix.


## reference: snapshot-template.md

# Portfolio snapshot template

## Holdings file (`holdings.csv`)

```csv
account,asset_class,symbol,market,currency,units,avg_cost,locked_until,note
```

`asset_class`: `thai-stock`, `foreign-stock`, `equity-fund`, `bond-fund`, `money-market`, `rmf`, `thaiesg`, `pvd`, `digital-asset`, `deposit`, `cash`. `locked_until` for RMF (age 55), ThaiESG (5 years), PVD (leaving job / retirement), fixed deposits.

## One-page layout (`snapshot-YYYY-MM.md`)

```markdown
# Portfolio snapshot — YYYY-MM-DD (prices as of ______)

Total ______ baht · Month return ___% · YTD realised P/L ______ · Dividends YTD ______

## Holdings
| Holding | Units | Avg cost | Price | Value | P/L | Weight |

## Allocation
| Asset class | Value | % |      | Sector | % |

## Liquid vs locked
Liquid ______ · Locked (RMF/ThaiESG/PVD/FD) ______

## Risk checks that fired
- ...

## One question for you
- ...
```


## reference: sources.md

# Sources · portfolio-snapshot

- Checklist idea: `portfolio-rebalance-review` step 1 and `prospect-intake` step 2, anthropics/claude-for-financial-advisors (Apache-2.0, viewed 2026-11-10), reworded for Thai accounts.
- Idea: `variance-analysis`, anthropics/knowledge-work-plugins (Apache-2.0, viewed 2026-11-10), cut to price, new money and dividends; script written from scratch.


## reference: worked-example.md

# Worked example (as of 2026-10-31, illustrative) · portfolio-snapshot

| Holding | Shares/units | Avg cost | Price | Value | P/L | Weight |
|---|---|---|---|---|---|---|
| ABC | 2,000 | 42.00 | 49.00 | 98,000 | +14,000 (+16.7%) | 32.7% |
| DEF | 1,000 | 60.00 | 45.00 | 45,000 | −15,000 (−25.0%) | 15.0% |
| SET50 index fund | 4,000 | 11.50 | 12.25 | 49,000 | +3,000 (+6.5%) | 16.3% |
| Money market fund | — | — | — | 78,000 | — | 26.0% |
| Cash at broker | — | — | — | 30,000 | — | 10.0% |
| **Total** | | | | **300,000** | **+2,000** | 100% |

Start of month 285,000, deposited 10,000 → return = (300,000 − 285,000 − 10,000) ÷ (285,000 + 5,000) = **+1.7%**.

Checks firing: ABC 32.7% > 10% (a 30% fall = −29,400 baht ≈ −9.8% of portfolio); DEF −25% — thesis last reviewed when? Cash + money market 36% — intentional?
