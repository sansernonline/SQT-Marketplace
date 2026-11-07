# Worked example and sources — copy-trade-check

Moved from `SKILL.md` (copy-trade-check)

## Worked example

**Ask (numbers made up — ตัวอย่าง):** "Pick the signal with the highest Growth from these 3, I'll follow with 50,000 baht." GoldRush Pro: Growth 1,240% · 14 weeks · real · drawdown 78% · max deposit load 92% · 410 trades · profit trades 97%. Steady EU: 85% · 104 weeks · real · 14% · 12% · 620 trades · Sharpe 0.21 · recovery factor 4.1. Swing FX: 210% · 40 weeks · **demo** · 33% · 25% · 95 trades. Plus Calm Yen for the scoring step: 60 weeks · real · 22% · 18% · 240 trades · Sharpe 0.28 · recovery 3.0.

**Did:** legal box first · GoldRush Pro out (14 weeks, load 92%, 97% wins with 78% drawdown points to martingale — history needed to confirm) · Swing FX out (demo) · `decide.mjs score` on the rest (run 2026-10-27): Steady EU 70, Calm Yen 30, stable under ±20% weight shifts · asked for Steady EU's history to run `signal-check.mjs` before going further · sizing: the user can lose 10% → 10 ÷ (14 × 1.5) ≈ 48% of capital, equity stop at 45,000 baht equivalent · 8 weeks of paper tracking first.

**Result:** "The highest Growth, GoldRush Pro, fails 2 hard rules (14 weeks · deposit load 92%) and looks like martingale; its history would confirm. Steady EU leads on the numbers, but send its trade history first, and ask BOT 1213 before moving any money. You decide."

## Sources

All read 2026-10-27 unless marked.

- BOT — [FAQ 21 forex](https://www.bot.or.th/th/faqs/faqs-21.html) (items 2, 3, 4, 6) · [retail portfolio investment abroad](https://www.bot.or.th/en/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-laws/retail-portfolio-investment-abroad.html) · [news 74/2564](https://www.bot.or.th/th/news-and-media/news/news-20211015.html) · 1213 hours from `scam-check` (checked 2026-10-26) · penalty under the Exchange Control Act from search results only (รอยืนยัน)
- DSI — [copy-trade scheme warning, May 2023](https://dsi.go.th/en/Detail/2a62807b58c90766044ba12fe68b2b48)
- MetaTrader 5 help — [signal subscriber settings](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) · [signal statistics](https://www.metatrader5.com/en/terminal/help/signals/signal_monitoring) · MQL5 [Signals rules](https://www.mql5.com/en/signals/rules) · [terms of use](https://www.mql5.com/en/about/terms) (3.7, 3.9) · [article 523](https://www.mql5.com/en/articles/523) (real signals on real accounts only) · [FAQ forum 10773](https://www.mql5.com/en/forum/10773) (Growth formula) · [MQL5 statistics docs](https://www.mql5.com/en/docs/constants/environment_state/statistics) (profit factor, recovery factor, drawdown)
- Research — [Dorfleitner et al. 2018](https://ideas.repec.org/a/eee/quaeco/v70y2018icp160-171.html) (abstract only) · [AAII summary](https://www.aaii.com/journal/article/returns-for-social-trading-platforms-are-negative) · [Nasr et al. 2026](https://ideas.repec.org/a/eee/finlet/v108y2026ics1544612326010093.html) (abstract only) · [ESMA 2018 CFD measures](https://www.esma.europa.eu/node/84933) · [Harvey, Liu, Zhu (NBER w20592)](https://www.nber.org/papers/w20592) · [Magdon-Ismail et al. 2004](https://www.cambridge.org/core/journals/journal-of-applied-probability/article/on-the-maximum-drawdown-of-a-brownian-motion/F9E3B8A454B020DDEBF0AC3390EF7807) (abstract only)
- Formulas — [Wilson interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) · [Student's t-test](https://en.wikipedia.org/wiki/Student%27s_t-test) · [Sharpe 1994](https://web.stanford.edu/~wfsharpe/art/sr/sr.htm)
- Tax — [RD order ป.161/2566](https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/dn161A.pdf) · [RD news 34/2566](https://www.rd.go.th/fileadmin/user_upload/news/2566thai/news34_2566.pdf)
- Martingale, grid and payoff checks — [MQL5 blog 772831](https://www.mql5.com/en/blogs/post/772831) (checklist, no thresholds) · thresholds are ours
