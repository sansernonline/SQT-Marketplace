# Trade journal template

## CSV header (copy as the first line of `trade-journal.csv`)

```csv
id,account,date_in,symbol,side,shares,entry,stop,target,one_r_baht,setup,reason,emotion,stop_changes,date_out,exit,costs_baht,pnl_baht,r_multiple,what_happened,plan_followed,violation,notes
```

| Column | Meaning | Example |
|---|---|---|
| id | running number, never reused | 37 |
| account | `live` or `paper` | live |
| date_in | ISO date and time (Gregorian, not พ.ศ., so it sorts) | 2026-10-06 10:15 |
| symbol / side | ticker, `buy` or `short` | ABC, buy |
| shares, entry, stop, target | numbers on valid ticks | 200, 48.50, 47.75, 51.00 |
| one_r_baht | \|entry − stop\| × shares | 150 |
| setup | one name from the fixed list | breakout-volume |
| reason | one sentence, written before entry | Broke 3-month high on 2.1× volume |
| emotion | one word | calm |
| stop_changes | "date: old→new, reason" or blank | 10-09: 47.75→48.50, breakeven |
| date_out, exit, costs_baht | from the broker confirmation | 2026-10-14, 50.25, 40 |
| pnl_baht | (exit − entry) × shares × side − costs | 310 |
| r_multiple | pnl_baht ÷ one_r_baht, 2 decimals | 2.07 |
| what_happened | one sentence | Stalled under 50.50, exited on time rule |
| plan_followed | Y / N | Y |
| violation | blank, or `moved-stop`, `oversize`, `no-stop`, `no-setup`, `revenge` | |
| notes | later lessons — add, never overwrite earlier text | |

## Quick fill-in card (for chat or a phone note)

```
ENTRY  #__  [live|paper]  date ____  symbol ____  buy/short
       shares ____  entry ____  stop ____  target ____  1R ____ baht
       setup ____________  emotion ______
       reason: ______________________________________
EXIT   date ____  exit ____  costs ____  P/L ____ baht = ____ R
       what happened: _______________________________
       plan followed Y/N   violation: ______
```

## Fixed setup list (edit once, then keep stable)

1. `breakout-volume`
2. `pullback-50ma`
3. `earnings-gap`
4. `range-bounce`
5. `no-setup` — impulse trade, logged honestly
