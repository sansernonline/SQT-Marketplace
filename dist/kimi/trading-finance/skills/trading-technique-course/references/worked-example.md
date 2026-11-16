# Worked example · trading-technique-course

## Worked example (ตัวอย่าง, numbers made up)

**Ask:** "I passed level 0. Level 1 trend: backtest gave 34 signals on 3 SET stocks, expectancy +0.18R. Paper: 20 trades, 8 wins averaging 2.1R, 12 losses averaging 1.05R, 1 moved stop. Can I go to breakout, and can I start with real money?"

**Did:** ran `trade-stats.mjs` on the 20 paper rows (2026-11-10): win rate 40% (95% interval 21.9%–61.3%) · expectancy 0.4 × 2.1 − 0.6 × 1.05 = **+0.21R** · average loss 1.05R · violations 5% · max drawdown 6.3R. Checked the level 1 → 2 gate: 20 trades ✓ · above 0R ✓ · violations 5% ✓ · average loss ✓ · drawdown 6.3R inside the user's 10R ✓ · paper +0.21R is above half of +0.18R ✓. Real-money gate: only 20 of 30 trades and 6 weeks of 8 → not yet.

**Result:** "Level 1 passed; level 2 (breakout) opens. Real money with the trend setup is not open yet: 10 more paper trades and 2 more weeks, still above +0.2R. Keep the trend setup on paper alongside level 2 so its count keeps growing. The moved stop on trade 14 is the one habit to watch."
