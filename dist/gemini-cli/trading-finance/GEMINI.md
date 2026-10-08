# SQT trading-finance — Gemini CLI

> สร้างอัตโนมัติจาก plugins/trading-finance/ โดย scripts/build/build-targets.mjs (v0.4.0) · ห้ามแก้ไฟล์นี้โดยตรง

Retail trader and personal finance toolkit for Thai investors — watchlists, technical signals, paper trading, trade journal with behavior review, position sizing, dividend tracking, budget planning and scam checks, plus verified Thai money skills: investment tax and filing (dividend credit, crypto exemption, foreign income), year-end tax deduction planner with /tax-plan, mutual fund picking, retirement planning with social security pension, debt payoff and คลินิกแก้หนี้, insurance review with co-payment rules, and emergency fund sizing. Data comes from whatever market-data plugins the user already has.

ชุดนี้มี skill 21 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 7 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **alert-dispatcher** — Use when the user wants price or news alerts on watched symbols. Sets up scheduled checks through the platform's automation features, keeps alerts few and meaningful, and routes notifications to the channel the user chose.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **market-analyst** — Use when the user asks about a specific stock, a market trend, or wants a watchlist analysed before buying or selling. Explains price data and news in plain language, never as financial advice.
- **risk-manager** — Use before opening any new position, when the user asks how much to buy, or when the portfolio has drifted. Computes position size from capital and per-trade risk, checks concentration and drawdown, and refuses to size a trade with no stop-loss.
- **trade-journal-coach** — Use when reviewing past trades, keeping a trade journal, or asking why the user keeps losing money in the same way. Finds repeated behavior patterns in the journal and turns them into one concrete rule to test next month.
