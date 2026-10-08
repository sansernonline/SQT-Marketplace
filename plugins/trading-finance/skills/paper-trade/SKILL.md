---
name: paper-trade
description: Log or review virtual-money trades with the paper-trading ledger. Log before entry, review monthly statistics.
argument-hint: <log|stats|setup> [trade details]
disable-model-invocation: true
---

Run the virtual trading account with the `paper-trading` skill: **$ARGUMENTS**

- `log` — record a planned trade (entry, stop, target, thesis) BEFORE it happens
- `stats` — monthly summary: trades, win rate, expectancy, rule violations
- `setup` — create or reset the ledger with virtual capital and rules
