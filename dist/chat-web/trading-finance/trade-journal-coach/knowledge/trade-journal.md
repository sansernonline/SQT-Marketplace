# skill: trade-journal

Use when logging a trade (entry, exit, why) or reviewing results weekly or monthly, with win rate, expectancy, drawdown.

# Trade Journal (บันทึกการเทรด)

The minimum record that still teaches you something later. Fill-in template and CSV header: [references/journal-template.md](references/journal-template.md).

Two modes: **1 Log a trade** (entry, exit, read) and **2 Review** (weekly or monthly, from the same file). General information, not investment advice.

## Mode 1 · Log a trade

### Workflow

1. **Before or at entry** (30 seconds) — date/time, symbol, side (buy/sell), shares, entry, stop, target, planned risk in baht (from `position-sizing`), setup name, one-sentence reason, one-word emotion.
2. **While open** — only log changes to the stop or size, with the reason. Moving a stop further away is logged as a **rule violation**.
3. **At exit** (30 seconds) — exit date, exit price, costs (commission + VAT from the broker confirmation), P/L in baht and in **R**, one sentence on what actually happened, did I follow the plan (Y/N).
4. **Weekly** — run mode 2 below, or hand the file to the `trade-journal-coach` agent.

### The R-multiple — the one number that makes trades comparable

```
1R            = planned risk per share × shares = |entry − stop| × shares
R-multiple    = net P/L in baht ÷ 1R
```

Example: bought 200 @ 48.50, stop 47.50 → 1R = 1.00 × 200 = 200 baht. Sold 200 @ 50.25, costs 40 baht → net P/L = 1.75 × 200 − 40 = 310 → **+1.55R**. Stopped out at 47.50 with costs 40 → −240 baht = **−1.20R** (more than −1R because of costs or slippage — that gap is information).

### Setup names — pick from a short fixed list

Free-text setups cannot be counted later. Keep 3–6 names the user actually trades, e.g. `breakout-volume`, `pullback-50ma`, `earnings-gap`, `dividend-run-up`, `range-bounce`, plus `no-setup` for impulse trades (honest labelling matters more than looking good).

### Emotion tags — one word

calm · confident · FOMO (กลัวตกรถ) · revenge (เอาคืน) · bored · fearful · hopeful. Two of these — FOMO and revenge — are where most review findings come from.

### Habit rules

- Entry takes **under a minute** — longer and the habit dies within two weeks.
- **Never edit past entries**; a later lesson goes in a new note column or a new row.
- Write the reason **before** the price moves; a reason written after the exit is a story, not data.
- Paper trades go in the same format, flagged `paper`, so `paper-trading` stats are comparable.
- Record the costs actually charged; Thai broker statements show commission, trading fee, clearing fee and VAT separately — add them up.
- Screenshot optional; the written record is mandatory.
- The `trade-journal-coach` agent quotes this file back in reviews — write it knowing someone will read it.

### Worked example (one row, filled)

| Field | Entry |
|---|---|
| Date in | 2026-10-06 10:15 |
| Symbol / side | ABC / buy |
| Shares · entry · stop · target | 200 · 48.50 · 47.50 · 51.00 |
| 1R (baht) | 200 |
| Setup | breakout-volume |
| Reason | Broke 3-month high 48.00 on 2.1× volume, trend up |
| Emotion | calm |
| Date out · exit · costs | 2026-10-14 · 50.25 · 40 |
| P/L baht · R | +310 · +1.55R |
| What happened | Stalled under 50.50, sold on plan rule "exit if no new high in 5 days" |
| Plan followed | Y |

Output (mode 1): append the row to `trade-journal.csv` (or the user's existing file) and reply with the R-multiple and one line — no commentary unless asked.

## Mode 2 · Review (ทบทวนผลการเทรด)

Coach tape review, not an accountant's report. Input: this journal (columns `r_multiple`, `pnl_baht`, `setup`, `emotion`, `violation`). Formulas, script usage and a worked example: [references/review-stats.md](references/review-stats.md).

Fewer than 20 closed trades: report the numbers but say the sample is too small to judge the strategy; judge only rule-following. Violation rate above 10% means the stats describe the rule-breaking, not the strategy.

### Workflow

0. If the journal is the user's own Excel or Google Sheets file with formulas (not the plain CSV from mode 1), run the 9 checks in [references/spreadsheet-check.md](references/spreadsheet-check.md) first; a broken range or a typed-in commission rate makes every stat below wrong.
1. Load closed trades since the last review (filter rows by `date_out` into a temp file first, because the script has no date option, then pass that file to the script; do not read the whole journal into context); separate `live` and `paper`.
2. Run `scripts/trade-stats.mjs` (win rate, average win and loss in R, payoff, expectancy, profit factor, max drawdown, streaks, violation rate) and show its output once so the user can check it; do not compute by hand. Self-test: `node scripts/trade-stats.mjs --self-test`.
3. **Group losing trades** by setup, by emotion tag, by day of week / time of day, and by violation; find the cluster with the largest total -R, not the most memorable trade.
4. **Name one pattern** that cost the most this period, quoting 2-3 actual journal lines as evidence.
5. **Write one rule** as a countable gate: "No entry within 15 minutes after a stop-out" or "No `breakout-volume` entry when volume < 1.5x average".
6. Verdict on last period's rule: followed how often, did it help: keep / adjust / drop.

Output (mode 2): one page: stats table (live, paper separately) · sample-size warning if N < 20 · the one pattern with quoted evidence · the one new rule · last rule's verdict. No pep talks, no list of ten lessons.

Related: strategy practice in `paper-trading`; sizing fixes in `position-sizing`.

## เรียกเป็นคำสั่ง

`/trading-finance:trade-journal <entry|exit|read|review> [trade details or week|month]`

Use the `trade-journal` skill: **$ARGUMENTS**

- `entry` — log symbol, size, entry, stop, target, setup, one-sentence reason, one-word emotion
- `exit` — log exit price, costs, R-multiple (net of costs), one-sentence what happened
- `read` — show recent entries for review
- `review [week|month]` — mode 2 with the `trade-journal-coach` agent; default period is this month


## reference: journal-template.md

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
| shares, entry, stop, target | numbers on valid ticks | 200, 48.50, 47.50, 51.00 |
| one_r_baht | \|entry − stop\| × shares | 200 |
| setup | one name from the fixed list | breakout-volume |
| reason | one sentence, written before entry | Broke 3-month high on 2.1× volume |
| emotion | one word | calm |
| stop_changes | "date: old→new, reason" or blank | 10-09: 47.50→48.50, breakeven |
| date_out, exit, costs_baht | from the broker confirmation | 2026-10-14, 50.25, 40 |
| pnl_baht | (exit − entry) × shares × side − costs | 310 |
| r_multiple | pnl_baht ÷ one_r_baht, 2 decimals | 1.55 |
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
4. `dividend-run-up`
5. `range-bounce`
6. `no-setup` — impulse trade, logged honestly


## reference: review-stats.md

# Review statistics (สถิติทบทวน)

Used by mode 2 of `trade-journal`. Let N = closed trades, W = winners (R > 0), L = losers (R ≤ 0).

| Statistic | Formula | Read it as |
|---|---|---|
| Win rate | W ÷ N | Means little alone — 30% can be very profitable with big winners |
| Average win (R) | sum of winning R ÷ W | |
| Average loss (R) | sum of losing R ÷ L (as a positive number) | Should be close to 1.0; above 1.2 = stops slipping or moved |
| Payoff ratio | avg win ÷ avg loss | |
| **Expectancy (R per trade)** | win rate × avg win − loss rate × avg loss | Average R earned per trade; > 0 = edge, in baht = expectancy × typical 1R |
| Profit factor | gross profit ÷ gross loss (baht) | > 1.5 decent, < 1 losing |
| Breakeven win rate | 1 ÷ (1 + payoff ratio) | Win rate needed at the current payoff to make zero |
| **Max drawdown** | largest fall from a running peak of the equity curve to a later low, ÷ that peak | Size of the worst losing stretch you must be able to sit through |
| Max consecutive losses | longest run of R ≤ 0 | Check: 2% risk × this run = pain you can stand? |
| Violation rate | trades with a `violation` ÷ N | Target 0; above 10% the stats describe the rule-breaking, not the strategy |

Fewer than 20 trades: report the numbers but say the sample is too small to judge the strategy — judge only rule-following.

## Script

`trade-stats.mjs` computes the table above from the journal: win rate, average win and loss in R, payoff ratio, expectancy, breakeven win rate, profit factor (needs `pnl_baht` on every row), max drawdown in R (and % of capital when `capital` is given), longest winning and losing streaks, violation rate (a `violation` of blank, `no`, `n`, `none`, `false`, `0`, `-`, `ไม่` or `ไม่มี` is not a violation). `live` and `paper` rows (column `account`) are reported separately. Rows with a blank `r_multiple` are open trades and are skipped. With fewer than 20 closed trades the output carries a small-sample label.

```
node trade-stats.mjs <file.json|file.csv> [--capital 100000] [--json]     # example file: scripts/example.json
node trade-stats.mjs --self-test
```

Input: the `trade-journal.csv` header as is, or JSON `[ {...} ]` / `{ "capital": 100000, "trades": [ {...} ] }`. Needed per row: `r_multiple`; used when present: `account`, `pnl_baht`, `violation`. Keep rows in exit order — drawdown and streaks follow file order. A non-numeric `r_multiple` or `pnl_baht` stops the script with a message naming the row and field. The script does the numbers only; finding the pattern and writing the one rule (steps 3–6) stays with you.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/trade-journal/scripts/trade-stats.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/trade-journal/scripts/trade-stats.mjs` · Node only, no dependencies. The worked example below is `scripts/example.json` and gives the same numbers.

## Worked example — 10 trades (R): +2.0, −1.0, −1.0, +3.0, −1.2, +0.5, −1.0, +1.5, −1.0, −2.0

- W = 4 (2.0, 3.0, 0.5, 1.5 → sum 7.0); L = 6 (sum 7.2)
- Win rate = 4/10 = **40%**; avg win = 7.0/4 = **1.75R**; avg loss = 7.2/6 = **1.20R**
- Payoff = 1.75/1.20 = 1.46 → breakeven win rate = 1/(1+1.46) = 41%
- Expectancy = 0.40 × 1.75 − 0.60 × 1.20 = 0.70 − 0.72 = **−0.02R** per trade — about breakeven
- Equity in R, starting 0: 2, 1, 0, 3, 1.8, 2.3, 1.3, 2.8, 1.8, −0.2. Peak 3.0 → low −0.2 = drawdown **3.2R**. With 1R = 1,000 baht on 100,000 capital, from the peak of 103,000 to 99,800 = 3,200 ÷ 103,000 = **3.1%**
- Pattern found: the −2.0R trade had violation `moved-stop`, and the −1.2R trade was tagged FOMO. Without the moved stop (−1.0 instead of −2.0), expectancy = (7.0 − 6.2) ÷ 10 = **+0.08R**. The one rule: "Stops only move toward profit — never away." Count violations next month.


## reference: spreadsheet-check.md

# Check the user's spreadsheet before trusting it

Used by `trade-journal` (review mode) and `portfolio-snapshot` when the user's own Excel or Google Sheets file is the source. A wrong formula in the user's sheet turns every number after it wrong, and the review then teaches the wrong lesson.

Open the file with the `xlsx` skill (Anthropic's built-in) when it is installed; otherwise ask the user to export CSV and say formulas could not be checked. Read formulas, not only the shown values.

## The 9 checks

| # | Check | What to look for | Typical damage in a journal or portfolio sheet |
|---|---|---|---|
| 1 | Error cells | `#REF!` `#VALUE!` `#N/A` `#DIV/0!` `#NAME?` | A total that silently skips the broken row |
| 2 | Numbers typed into formulas | `=B2*0.0017` or `=C5*1.07` — a rate that should sit in its own cell | Commission or VAT rate changed but old rows still use the typed one |
| 3 | A formula that breaks the column pattern | Row 37 uses a different formula from rows 2–36 | One trade's P/L or R is computed differently |
| 4 | Ranges that miss rows | `SUM(F2:F99)` while trades run to row 120; first or last row left out | Win rate and total P/L leave out the newest trades |
| 5 | Values pasted over formulas | A cell that looks computed but is a typed number | Stale P/L that never updates with the price |
| 6 | Circular references | A cell that depends on itself | Numbers that change on every recalculation |
| 7 | Links to other files or moved sheets | `[old.xlsx]Sheet1!A1`, references to deleted tabs | Prices or costs from a file that no longer updates |
| 8 | Units and percent | Thousands mixed with baht; `5` meaning 5% next to `0.05` | Weights or returns 100 times off |
| 9 | Hidden rows, columns or tabs | Rows or tabs set to hidden | Old trades or manual overrides nobody sees |

Model-integrity checks for company models (balance sheet ties, cash-flow ties, discounted cash flow) are left out; they do not apply to a personal journal or holdings list.

## Report

One table: sheet · cell or range · check number · what is wrong · effect on the review. Fix nothing in the user's file without asking; propose the fix and let the user apply it, or work from a corrected copy and say so. Then run the plugin script (`trade-stats.mjs`, `money-calc.mjs`) on the corrected numbers, not the sheet's own totals.

## Source

Checks adapted from `audit-xls` step 2, anthropics/financial-services (Apache-2.0, viewed 2026-11-10) — reworded for personal sheets; model-integrity step dropped.
