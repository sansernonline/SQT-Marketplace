# Worked example and sources — copy-trade-check

Moved from `SKILL.md` (copy-trade-check)

## Worked example

**Ask (numbers made up — ตัวอย่าง):** "Pick the signal with the highest Growth from these 3, I'll follow with 50,000 baht." GoldRush Pro: Growth 1,240% · 14 weeks · real · drawdown 78% · max deposit load 92% · 410 trades · profit trades 97%. Steady EU: 85% · 104 weeks · real · 14% · 12% · 620 trades · Sharpe 0.21 · recovery factor 4.1. Swing FX: 210% · 40 weeks · **demo** · 33% · 25% · 95 trades. Plus Calm Yen for the scoring step: 60 weeks · real · 22% · 18% · 240 trades · Sharpe 0.28 · recovery 3.0.

**Did:** legal box first · GoldRush Pro out (14 weeks, load 92%, 97% wins with 78% drawdown points to martingale — history needed to confirm) · Swing FX out (demo) · `decide.mjs score` on the rest (run 2026-10-27): Steady EU 70, Calm Yen 30, stable under ±20% weight shifts · asked for Steady EU's history to run `signal-check.mjs` before going further · sizing: the user can lose 10% → X ≤ 10 ÷ (14 × 1.5) = 47.6, rounded down to 47% deposit load, equity stop at 45,000 baht equivalent · 8 weeks of paper tracking first.

**Result:** "The highest Growth, GoldRush Pro, fails 2 hard rules (14 weeks · deposit load 92%) and looks like martingale; its history would confirm. Steady EU leads on the numbers, but send its trade history first, and ask BOT 1213 before moving any money. You decide."

## Worked example — weekly check (ตัวอย่าง, numbers made up)

**Set before subscribing:** deposit load X = 47% (X ≤ L ÷ (D × k) = 10 ÷ (14 × 1.5) = 47.6, rounded down) · L = 10% · provider record drawdown 14% × 1.5 = 21% · gap limit 3 points over 4 weeks · time stop 12 weeks. File: `scripts/monitor-example.json`.

**Hand calculation** (the same numbers are asserted in `copy-monitor.mjs --self-test`):

| Week | Provider % | Should get = × 0.47 | Ours % | Gap | Net index after fees | Down from peak |
|---|---|---|---|---|---|---|
| W1 | +4 | +1.88 | 1000 → 1018 = +1.80 | −0.08 | 1.018 (peak) | 0 |
| W2 | −2 | −0.94 | 1018 → 1003 = −1.47 | −0.53 | 1.003 | 1.47% |
| W3 | +2 | +0.94 | 1003 → 1010 = +0.70 · fee 30 → net −2.29 | −0.24 | 0.980 | 3.73% |
| W4 | −6 | −2.82 | 1010 → 960 = −4.95 | −2.13 | 0.9315 | (1.018 − 0.9315) ÷ 1.018 = 8.50% |
| W5 | −1 | −0.47 | 960 → 948 = −1.25 | −0.78 | 0.9198 | 9.64% |

Gap over W1–W4 = −0.08 − 0.53 − 0.24 − 2.13 = −2.99 points, not yet past −3. Gap over W2–W5 = −0.53 − 0.24 − 2.13 − 0.78 = −3.69 points, past the −3 limit (both sums use the unrounded gaps, as the script prints them, so they can differ by 0.01 from adding the rounded column). Drawdown 9.64% is still under 10%.

**Result:** "ผล: เลิกตาม — our account trails what the provider's numbers say we should get by 3.69 points over 4 weeks, past the 3 we set before subscribing, so the written rule says stop. Before following any other signal, compare our broker's spread and slippage with the provider's. Unsubscribing will not close the 2 open positions — decide on them separately."

## Sources

All read 2026-10-27 unless marked.

- BOT — [FAQ 21 forex](https://www.bot.or.th/th/faqs/faqs-21.html) (items 2, 3, 4, 6) · [retail portfolio investment abroad](https://www.bot.or.th/en/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-laws/retail-portfolio-investment-abroad.html) · [news 74/2564](https://www.bot.or.th/th/news-and-media/news/news-20211015.html) · 1213 hours from `scam-check` (checked 2026-10-26) · re-read 2026-11-10: item 4 (foreign broker website allowed within BOT limits, via a Thai commercial bank, up to USD 5 million a year, 6 asset types) and item 5 (fine up to 20,000 baht or prison up to 3 years for running forex services; 5–10 years and 500,000–1,000,000 baht under the public-fraud lending law for soliciting the public)
- SEC — [Investor Alert list](https://market.sec.or.th/public/idisc/th/InvestorAlert) (opened 2026-11-10, updated 9 Nov 2569) · SEC statement 19 Sep 2022 that forex is outside SEC supervision, read via [PPTV](https://www.pptvhd36.com/wealth/stock-investment/180854) on 2026-11-10 · the SEC's own [PDF](https://www.sec.or.th/TH/Template3/Articles/2565/190965.pdf) returned 403 (รอยืนยัน)
- Setup and costs, read 2026-11-10 — [signal subscriber help](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) (deposit load, leverage, equity stop, deviation, SL/TP, unsubscribe, VPS, auto-renew) · [Signals rules](https://www.mql5.com/en/signals/rules) (V.6 20% commission · V.7 no refund · VI.1 results differ) · [provider help](https://www.metatrader5.com/en/terminal/help/signals/signal_provider) (monthly price in USD; no minimum stated) · [MetaTrader VPS plans](https://www.mql5.com/en/vps/forex-plans) (15 · 39 · 65 · 120 USD) · minimum signal price 30 USD appears only in 2017 forum posts (รอยืนยัน)
- DSI — [copy-trade scheme warning, May 2023](https://dsi.go.th/en/Detail/2a62807b58c90766044ba12fe68b2b48)
- MetaTrader 5 help — [signal subscriber settings](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) · [signal statistics](https://www.metatrader5.com/en/terminal/help/signals/signal_monitoring) · MQL5 [Signals rules](https://www.mql5.com/en/signals/rules) · [terms of use](https://www.mql5.com/en/about/terms) (3.7, 3.9) · [article 523](https://www.mql5.com/en/articles/523) (real signals on real accounts only) · [FAQ forum 10773](https://www.mql5.com/en/forum/10773) (Growth formula) · [MQL5 statistics docs](https://www.mql5.com/en/docs/constants/environment_state/statistics) (profit factor, recovery factor, drawdown)
- Research — [Dorfleitner et al. 2018](https://ideas.repec.org/a/eee/quaeco/v70y2018icp160-171.html) (abstract only) · [AAII summary](https://www.aaii.com/journal/article/returns-for-social-trading-platforms-are-negative) · [Nasr et al. 2026](https://ideas.repec.org/a/eee/finlet/v108y2026ics1544612326010093.html) (abstract only) · [ESMA 2018 CFD measures](https://www.esma.europa.eu/node/84933) · [Harvey, Liu, Zhu (NBER w20592)](https://www.nber.org/papers/w20592) · [Magdon-Ismail et al. 2004](https://www.cambridge.org/core/journals/journal-of-applied-probability/article/on-the-maximum-drawdown-of-a-brownian-motion/F9E3B8A454B020DDEBF0AC3390EF7807) (abstract only)
- Formulas — [Wilson interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) · [Student's t-test](https://en.wikipedia.org/wiki/Student%27s_t-test) · [Sharpe 1994](https://web.stanford.edu/~wfsharpe/art/sr/sr.htm)
- Tax — [RD order ป.161/2566](https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/dn161A.pdf) · [RD news 34/2566](https://www.rd.go.th/fileadmin/user_upload/news/2566thai/news34_2566.pdf)
- Martingale, grid and payoff checks — [MQL5 blog 772831](https://www.mql5.com/en/blogs/post/772831) (checklist, no thresholds) · thresholds are ours
