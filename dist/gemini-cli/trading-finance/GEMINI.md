# SQT trading-finance — Gemini CLI

> สร้างอัตโนมัติจาก plugins/trading-finance/ โดย scripts/build/build-targets.mjs (v0.16.0) · ห้ามแก้ไฟล์นี้โดยตรง

Trading and personal finance toolkit for Thai investors — watchlists, signals, paper trading, trade journal, position sizing, dividends, budgets and scam checks, plus Thai money skills: investment tax, year-end deduction planning (/tax-plan), mutual funds, retirement, debt payoff and คลินิกแก้หนี้, insurance review and emergency funds, credit bureau reports, bonds and deposits, rebalancing and DCA, and home refinance. Uses whatever market-data plugins you already have.

ชุดนี้มี skill 61 ตัว · บทบาท 8 บทบาท · คำสั่งสำเร็จรูป 7 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **alert-dispatcher** — Use when the user wants price or news alerts on watched symbols. Sets scheduled checks and keeps alerts few.
- **market-analyst** — Use when asking about a stock, market trend or watchlist before trading. Explains price and news plainly; not advice.
- **money-planner** — Use for personal money — budget, debt, emergency fund, retirement, insurance, funds, personal tax, scam checks.
- **risk-manager** — Use before opening a position, asking how much to buy, or when a portfolio drifts. Never sizes without a stop-loss.
- **trade-journal-coach** — Use when reviewing past trades or a trade journal, or asking why you keep losing the same way. Finds one rule to test.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
