# playbook · pre-trade — before opening a position

Use when: about to buy or sell a stock · "how many shares should I buy" · "is it good to enter now".
Main principles: [`money-principles`](../../money-principles/SKILL.md) · [`trading.md`](../../money-principles/references/trading.md) · [`fundamentals.md`](../../money-principles/references/fundamentals.md) · [`market-watch.md`](../../money-principles/references/market-watch.md)
Main skills: `market-watch` · `technical-signals` · `position-sizing` · `trade-journal` · `stock-fundamentals` · `trade-journal`

## ขั้นตอน (Steps — copy into the todo exactly)

1. Open `trading.md` first. Collect at the start, in one question: capital, budget, entry, stop, and a price-history CSV from the broker app if no market-data tool is connected. Then read the thesis for this stock from the user's `watchlist.md` in the finance folder (`market-watch` → `references/watchlist-setup.md` step 5). If there is none, write the thesis (the reason to buy), the entry point, and the point where the thesis is wrong, under `market-watch`. If the trade copies another person's trades or signals, check that source under `trade-journal` first · ใคร: หัวหน้าทีม (reason from the answer at the start; if none, put `(รอยืนยัน)` (pending confirmation))
2. Open `fundamentals.md` and `market-watch.md`, then look at the price and signals under `technical-signals` (price history: the `date,close,volume` CSV collected in step 1 with the other inputs; none and no market-data tool → mark the signal part `(รอยืนยัน)`), the company's statements under `stock-fundamentals`, and the affecting news under `market-watch` — every number has a reference time. Asked "are the financials OK?": pass on the script's flags and the company's own trend, say peers were not compared unless the user supplied them, and give no verdict · ใคร: `market-analyst` ตัวใหม่
3. Have `risk-manager` calculate the position size under `position-sizing` from capital (the trading account), risk per trade and stop-loss distance, then check the portfolio's concentration; when the user also names a budget, the final size is the smaller of the script's size and the budget, and both numbers are shown · ใคร: `risk-manager` ตัวใหม่
4. If there is no stop-loss point, stop at this step and do not calculate the size · ใคร: `risk-manager` ตัวใหม่
5. Write an order the user places themselves — price, quantity, stop-loss point, target — then draft the trade journal entry under `trade-journal` · ใคร: หัวหน้าทีม (pressing send on the order is under "รออนุมัติ" (awaiting approval); the user presses it after the run ends)
6. ตรวจ the order — the position size matches the result of step 3, there is a stop-loss point, every number has a reference time, and the order follows `trading.md` principles 1–4 and 8 (loss cap, size from the loss, exit written first, concentration, costs) and the step 2 summary follows `fundamentals.md` (no verdict, statement date shown) · ใคร: `reviewer` ตัวใหม่

## Done when

There is an order ready to press that has a stop-loss point, a size that passed `risk-manager`, and a pre-entry journal entry, with the user sending the order themselves.
