# Legal box, research, setup and costs, tax · copy-trade-check

Full text moved out of SKILL.md. Open it when the answer ends in subscribing with real money (legal), when the user asks for the top-Growth signal (research), when setting up the copy or counting costs (setup), or when asked about tax.

## Legal route in Thailand (full box)

Bank of Thailand (ธปท., BOT) [FAQ 21](https://www.bot.or.th/th/faqs/faqs-21.html), read 2026-11-10: BOT has no policy to license forex businesses, and running a forex service or receiving or sending money to settle forex trades, inside or outside Thailand, is an offence under the Exchange Control Act (พ.ร.บ.ควบคุมการแลกเปลี่ยนเงิน พ.ศ. 2485) — fine up to 20,000 baht, prison up to 3 years, or both (items 2 and 5). So **no forex broker is licensed in Thailand**, and a Thai agent, a Thai personal account or an e-wallet that takes the deposit is outside the law. Item 4 answers the individual's own case: a Thai person may trade on a foreign broker's website "ภายใต้ขอบเขตที่ ธปท. กำหนด", sending money **through a Thai commercial bank**, up to USD 5 million a year, in stocks, bonds, fund units, deposits, derivatives or investment-linked insurance. Whether leveraged forex or CFDs count as "derivatives" in that list is not written (รอยืนยัน). The SEC (ก.ล.ต.) does not supervise forex, because forex is not a securities, derivatives or digital-asset business under its laws (SEC statement of 19 Sep 2022 as reported by [PPTV](https://www.pptvhd36.com/wealth/stock-investment/180854); the SEC's own file returned 403, so รอยืนยัน). Check the broker's name on the SEC [Investor Alert list](https://market.sec.or.th/public/idisc/th/InvestorAlert) (opened 2026-11-10; not being listed proves nothing) and run `scam-check`. **Before any real money leaves Thailand, the user asks BOT on 1213** (ศคง., office hours). This skill never says a transfer is allowed; the user decides.

## Why not "highest Growth" (research)

Following the providers with the highest past cumulative return lost heavily on social-trading platforms; ranking by Sharpe ratio did better, and after costs no selection rule earned a positive abnormal return (Dorfleitner et al. 2018, Quarterly Review of Economics and Finance 70 — **abstract only read**). AAII's summary of the same data: copying the top leader lost about 92% over 36 months on Ayondo and about 79% over 29 months on Wikifolio. Popularity did not predict later returns on eToro (Nasr et al. 2026, abstract only). Base rate: 74–89% of retail CFD accounts lose money (ESMA 2018).

## Section 5 · Setup settings and costs

Settings from the MetaTrader 5 help ([signal subscriber](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber), read 2026-11-10):

| Setting | What it does | Set it to |
|---|---|---|
| Use no more than X% of deposit | Lot = provider lot × (follower balance ÷ provider balance) × X%, adjusted for currency. Official example: follower 8,000 EUR at 50%, provider 10,000 USD, EURUSD 1.2 → provider 1 lot becomes 0.48 lot. Higher follower leverage does not raise lots; lower leverage shrinks them (provider 1:100, follower 1:10 → 1 lot becomes 0.1) | From the sizing rule in SKILL.md |
| Stop if equity is less than | Below this equity the copying stops and all positions close · 0 = no limit | Never 0 · starting equity × (1 − L) |
| Deviation / slippage | Set in spreads · a requote widens it by 0.5 spread · a second requote drops sync until re-sync | Keep low; prefer the provider's broker server |
| Copy Stop Loss and Take Profit | SL/TP sit at the follower's broker, so they work while the terminal is off | On |

**Why our result will differ from the provider's.** The MQL5 Signals rules (VI.1) say subscriber results can differ. Causes named in the help: a different broker (other prices, spread and execution, so stops can trigger earlier), slippage and requotes, volume limits or missing symbols at the follower's broker, and any manual or EA trade on the following account. Pending orders are not copied. One account follows one signal. Prefer the same broker and server as the provider; section 8 measures the gap.

**Costs, counted before subscribing:**

| Cost | Fact | Source, read 2026-11-10 |
|---|---|---|
| Subscription | Monthly fee in USD set by the provider, paid up front for the period · no refund when the subscriber cancels (V.7) · MQL5 keeps 20% (V.6) · unsubscribing passes the locked payment to the provider · auto-renew covers at most 3 months and is cancelled if the price rises · a current minimum price was not found on an official page (รอยืนยัน) | [Signals rules](https://www.mql5.com/en/signals/rules) · [signal subscriber help](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) · [provider help](https://www.metatrader5.com/en/terminal/help/signals/signal_provider) |
| VPS | The terminal must stay online. MetaTrader VPS list price: 15 USD for 1 month · 39 for 3 · 65 for 6 · 120 for 12 (10 USD a month) · full refund within the first 24 hours | [VPS plans](https://www.mql5.com/en/vps/forex-plans) |
| Spread and commission | The follower's broker, not the provider's; read the symbol spec | `position-sizing` forex reference |

**Break-even example.** A 20 USD signal plus a 15 USD VPS on a 1,500 USD account is 35 ÷ 1,500 = 2.3% a month (ตัวอย่าง).

## Section 9 · Tax

Revenue Department order ป.161/2566 (15 Sep 2023), amended by ป.162/2566 (20 Nov 2023): a Thai tax resident with foreign-source income must include it in the tax year it is **brought into Thailand**, for income brought in from 1 Jan 2024; income earned before 1 Jan 2024 is outside it. Tax withheld abroad under a double-tax treaty can be credited (RD news 34/2566). Not confirmed: which section of section 40 forex/CFD profit falls under and whether losses offset (รอยืนยัน — ask RD on 1161) · the 180-day residence test comes from search results only (รอยืนยัน). Details → `income-tax-th`.
