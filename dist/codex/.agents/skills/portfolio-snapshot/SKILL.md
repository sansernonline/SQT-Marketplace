---
name: portfolio-snapshot
description: Use when the user asks how their portfolio looks now, at month end, or how much they are up or down (สรุปพอร์ต, พอร์ตตอนนี้, กำไรขาดทุน). Produces one page with allocation, gain/loss, cash, income and concentration risks.
---

# Portfolio Snapshot (สรุปพอร์ตหน้าเดียว)

One page that answers "how am I doing?" honestly. Holdings template and the page layout: [references/snapshot-template.md](references/snapshot-template.md). General information, not investment advice.

## Workflow

1. **Load holdings** from the user's file (ask where it lives). Include every account: stock broker, fund accounts (AMC / fund supermarket), RMF/ThaiESG, PVD (latest statement), digital-asset exchange, cash and fixed deposits. Missing an account makes every percentage wrong.
2. **Refresh prices** via an installed market-data plugin; funds use the latest NAV (one business day behind); record the as-of timestamp per source. No data plugin → say so and ask for the broker statement values.
3. **Compute per holding**: market value, cost, unrealised P/L (baht and %), weight %.
4. **Compute portfolio**: total value, cash %, allocation by asset class / sector / market / currency, realised P/L year to date (from `trade-journal`), dividends received YTD (from `dividend-tracker`).
5. **Return since last snapshot** — use the money-weighted shortcut below so deposits are not counted as gains.
6. **Run the risk checks** (table below) and list only the ones that fire.
7. **Save** the snapshot as `snapshot-YYYY-MM.md` so the next one can compare.

## Formulas

```
unrealised P/L        = (price − average cost) × shares
weight                = holding value ÷ total portfolio value
simple return (period)= (end value − start value − net deposits) ÷ (start value + net deposits × 0.5)
```

The ×0.5 assumes deposits arrived mid-period (Modified Dietz shortcut) — good enough for a monthly snapshot; say it is an approximation.

## Risk checks

| Check | Fires when (default) | Say |
|---|---|---|
| Single-name concentration | one stock > 10% (> 20% for a broad index fund) | Name, weight, what a 30% fall costs in baht |
| Sector concentration | one sector > 30% | Sector, weight |
| Cash | < 5% (no dry powder) or > 40% (idle, unless intentional) | Ask whether intentional |
| Losers held long | unrealised loss > 20% and thesis not reviewed in 3 months | Send to `watchlist-setup` review |
| Cash Balance / caution sign | any holding under SET trading measures | Name it |
| Leverage | margin or credit-balance loan > 0 | Loan, maintenance margin buffer |
| Emergency fund | invested money is also the emergency fund | Point to `emergency-fund` |
| Lock-ups | RMF / ThaiESG / PVD counted as spendable | Separate locked from liquid |

## Worked example (as of 2026-10-31, illustrative)

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

## Output

Headline (total value, month return, as-of) · holdings table · allocation (asset class, sector) · YTD realised P/L and dividends · risk checks that fired · one question for the user. Command: `/portfolio`.
