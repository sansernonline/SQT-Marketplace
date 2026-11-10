---
name: trade-journal
description: Use when logging a trade (entry, exit, why) or reviewing results weekly or monthly, with win rate, expectancy, drawdown.
argument-hint: <entry|exit|read|review> [trade details or week|month]
---

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
