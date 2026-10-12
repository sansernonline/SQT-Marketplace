# SQT trading-finance — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/trading-finance/ โดย scripts/build/build-targets.mjs (v0.4.2) · ห้ามแก้ไฟล์นี้โดยตรง

Trading and personal finance toolkit for Thai investors — watchlists, signals, paper trading, trade journal, position sizing, dividends, budgets and scam checks, plus Thai money skills: investment tax, year-end deduction planning (/tax-plan), mutual funds, retirement, debt payoff and คลินิกแก้หนี้, insurance review and emergency funds. Uses whatever market-data plugins you already have.

ชุดนี้มี skill 22 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 7 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **alert-dispatcher** — Use when the user wants price or news alerts on watched symbols. Sets up scheduled checks, keeps alerts few, and routes them to the channel the user chose.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked and propose up to 3 skill or agent edits with evidence. Writes only its own note.
- **market-analyst** — Use when asked about a stock, a market trend, or a watchlist before buying or selling. Explains price data and news in plain words, never as financial advice.
- **risk-manager** — Use before opening a position, when asked how much to buy, or when the portfolio has drifted. Sizes from capital and risk; refuses to size without a stop-loss.
- **trade-journal-coach** — Use when reviewing past trades, keeping a trade journal, or asking why you keep losing the same way. Finds repeated patterns, turns them into one rule to test.
