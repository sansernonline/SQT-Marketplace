# Rebalance — band source, scoring command and worked example

Moved from `SKILL.md` (rebalance-and-dca)

## Band source and scoring command

The 5-point band comes from Vanguard's study of rebalancing (2010, US market, checked 2026-10-27): https://indexacapital.com/bundles/unaiadvisor/docs/papers/2010-Vanguard-Best-practices-for-portfolio-rebalancing.pdf . It is a rule of thumb for US portfolios, not a Thai rule. To compare several ways of rebalancing on cost and months to target (both `low`), use `decision-scoring`, command `score`. Script path: see `decision-scoring` (superuser plugin). Weights 0.5 cost / 0.5 months are starting values, not yet measured; the user's weights win. Selling RMF or ThaiESG early goes in `must`, not in the weights. The worked example's options A/B/C are in `references/rebalance-score.json` (its switching fee is a placeholder; replace it from the factsheet):

```
node plugins/superuser/skills/decision-scoring/scripts/decide.mjs score plugins/trading-finance/skills/rebalance-and-dca/references/rebalance-score.json
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
