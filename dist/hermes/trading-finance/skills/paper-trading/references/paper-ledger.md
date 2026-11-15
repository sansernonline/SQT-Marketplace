# Paper ledger template

Same columns as the live `trade-journal` CSV, with `account = paper`, plus two columns for realism.

```csv
id,account,date_in,symbol,side,shares,entry,stop,target,one_r_baht,setup,reason,emotion,stop_changes,date_out,exit,costs_baht,pnl_baht,r_multiple,what_happened,plan_followed,violation,fill_status,cash_after,notes
```

| Extra column | Values |
|---|---|
| fill_status | `filled`, `no-fill` (limit touched but not traded through), `passed` (would have hesitated), `gap-fill` (opened past the stop) |
| cash_after | virtual cash after costs, so over-allocation shows up |

## Rule sheet (fill once, before trade #1)

```
Start date ______   Virtual capital ______ baht   Real account size ______
Setups allowed: ____________________________
Risk per trade ___%   Max open positions ___   Max position ___% of capital
Entry rule: ________________________________
Exit rule (stop / target / time): __________
Commission used ___% + VAT 7% on commission   Slippage assumed: 1 tick
Rule changes restart the count: Y
```

## Monthly summary box

```
Month ____  Trades ____  Passed/no-fill ____
Win rate ___%  Avg win ___R  Avg loss ___R  Expectancy ___R
Max drawdown ___%  Violations ___ (___%)
Graduation gate met? Y/N — which line fails: ______
One lesson: ______________________________
```
