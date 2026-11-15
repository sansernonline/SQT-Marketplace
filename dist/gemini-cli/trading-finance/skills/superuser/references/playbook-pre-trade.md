# playbook · pre-trade — before opening a position

Use when: about to buy or sell a stock · "how many shares should I buy" · "is it good to enter now".
Main skill: `watchlist-setup` · `technical-signals` · `news-impact` · `position-sizing` · `trade-journal`

## ขั้นตอน (Steps — copy into the todo as written)

1. Read the thesis for this stock from the watchlist. If there is none, write the thesis (the reason to buy), the entry point, and the point where the thesis is wrong, under `watchlist-setup` · ใคร: หัวหน้าทีม (reason from the answer at the start; if none, put `(รอยืนยัน)` (pending confirmation))
2. Look at the price and signals under `technical-signals` and the affecting news under `news-impact` — every number has a reference time · ใคร: `market-analyst` ตัวใหม่
3. Have `risk-manager` calculate the position size under `position-sizing` from capital, risk per trade and stop-loss distance, then check the portfolio's concentration · ใคร: `risk-manager` ตัวใหม่
4. If there is no stop-loss point, stop at this step and do not calculate the size · ใคร: `risk-manager` ตัวใหม่
5. Write an order the user places themselves — price, quantity, stop-loss point, target — then draft the trade journal entry under `trade-journal` · ใคร: หัวหน้าทีม (pressing send on the order is under "รออนุมัติ" (awaiting approval); the user presses it after the run ends)
6. ตรวจ the order — the position size matches the result of step 3, there is a stop-loss point, every number has a reference time · ใคร: `reviewer` ตัวใหม่

## Done when

There is an order ready to press that has a stop-loss point, a size that passed `risk-manager`, and a pre-entry journal entry, with the user sending the order themselves.
