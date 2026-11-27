---
name: portfolio
description: Use when checking the portfolio, dividends, DCA or rebalancing
---

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
