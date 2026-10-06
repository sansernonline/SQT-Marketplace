---
name: trade-journal
description: Use right after entering or exiting a trade, or when the user says they forget why they traded (บันทึกการเทรด, จดเทรด). Captures setup, reason, emotion, plan and outcome in under a minute.
---

# Trade Journal (บันทึกการเทรด)

The minimum record that still teaches you something later. Fill-in template and CSV header: [references/journal-template.md](references/journal-template.md).

## Workflow

1. **Before or at entry** (30 seconds) — date/time, symbol, side (buy/sell), shares, entry, stop, target, planned risk in baht (from `position-sizing`), setup name, one-sentence reason, one-word emotion.
2. **While open** — only log changes to the stop or size, with the reason. Moving a stop further away is logged as a **rule violation**.
3. **At exit** (30 seconds) — exit date, exit price, costs (commission + VAT from the broker confirmation), P/L in baht and in **R**, one sentence on what actually happened, did I follow the plan (Y/N).
4. **Weekly** — hand the file to `post-trade-review` / the `trade-journal-coach` agent.

## The R-multiple — the one number that makes trades comparable

```
1R            = planned risk per share × shares = |entry − stop| × shares
R-multiple    = net P/L in baht ÷ 1R
```

Example: bought 200 @ 48.50, stop 47.75 → 1R = 0.75 × 200 = 150 baht. Sold 200 @ 50.25, costs 40 baht → net P/L = 1.75 × 200 − 40 = 310 → **+2.07R**. Stopped out at 47.75 with costs 40 → −190 baht = **−1.27R** (more than −1R because of costs or slippage — that gap is information).

## Setup names — pick from a short fixed list

Free-text setups cannot be counted later. Keep 3–6 names the user actually trades, e.g. `breakout-volume`, `pullback-50ma`, `earnings-gap`, `dividend-run-up`, `range-bounce`, plus `no-setup` for impulse trades (honest labelling matters more than looking good).

## Emotion tags — one word

calm · confident · FOMO (กลัวตกรถ) · revenge (เอาคืน) · bored · fearful · hopeful. Two of these — FOMO and revenge — are where most review findings come from.

## Habit rules

- Entry takes **under a minute** — longer and the habit dies within two weeks.
- **Never edit past entries**; a later lesson goes in a new note column or a new row.
- Write the reason **before** the price moves; a reason written after the exit is a story, not data.
- Paper trades go in the same format, flagged `paper`, so `paper-trading` stats are comparable.
- Record the costs actually charged; Thai broker statements show commission, trading fee, clearing fee and VAT separately — add them up.
- Screenshot optional; the written record is mandatory.
- The `trade-journal-coach` agent quotes this file back in reviews — write it knowing someone will read it.

## Worked example (one row, filled)

| Field | Entry |
|---|---|
| Date in | 2026-10-06 10:15 |
| Symbol / side | ABC / buy |
| Shares · entry · stop · target | 200 · 48.50 · 47.75 · 51.00 |
| 1R (baht) | 150 |
| Setup | breakout-volume |
| Reason | Broke 3-month high 48.00 on 2.1× volume, trend up |
| Emotion | calm |
| Date out · exit · costs | 2026-10-14 · 50.25 · 40 |
| P/L baht · R | +310 · +2.07R |
| What happened | Stalled under 50.50, sold on plan rule "exit if no new high in 5 days" |
| Plan followed | Y |

Output: append the row to `trade-journal.csv` (or the user's existing file) and reply with the R-multiple and one line — no commentary unless asked.
