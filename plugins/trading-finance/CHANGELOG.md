# Changelog — trading-finance

## 0.16.1 — 2026-10-28

- `trade-stats.mjs` ไม่นับช่อง violation ที่เป็น `no` `n` `none` `false` `0` `-` `ไม่` `ไม่มี` ว่าเป็นการฝ่าฝืน
- `ticks.json` บอกว่าตารางหลัง 2026-11-16 ยังไม่ยืนยันประกาศสุดท้าย · `size.mjs` ใช้ตารางนั้นแล้วเตือนแทนหยุด
- agent `risk-manager` เปิด `position-sizing` และรัน `size.mjs` แทนสูตรย่อที่ไม่ปัดล็อตและไม่ตรวจเพดาน

## 0.16.0 — 2026-10-28

- สคริปต์ใหม่: `size.mjs` ของ `position-sizing` (จำนวนหุ้นจากงบความเสี่ยง ปัดตามล็อต ตรวจ tick ตามตารางก่อนและหลัง 2026-11-16 · ไม่มี stop-loss ไม่คำนวณ) · `trade-stats.mjs` ของ `post-trade-review` (win rate · expectancy · max drawdown · ติดป้ายเมื่อตัวอย่างน้อยกว่า 20) · `expiry.json` เพิ่มแถวของ `ticks.json` · CI รัน self-test

## 0.15.0 — 2026-10-27

- skill ใหม่ `copy-trade-check` ประเมินผู้ให้สัญญาณ copy trade บน MQL5 ด้วยตัวเลขก่อนตามเทรด: เตือนสถานะกฎหมายในไทยที่ยังไม่ชัด (ถาม ธปท. 1213) · กฎเหล็ก (demo · อายุสั้น · martingale · grid · deposit load) · เทียบด้วย `decision-scoring` ไม่จัดอันดับด้วย Growth · ลองเงินปลอมก่อน · ห้ามดึงหน้า mql5.com อัตโนมัติ
- สคริปต์ `copy-trade-check/scripts/signal-check.mjs` อ่านประวัติดีล คิด win rate พร้อม Wilson interval · t-stat · drawdown · จับ martingale (lot หลังแพ้ ÷ หลังชนะ) และ grid (ไม้เปิดซ้อน) · self-test 42 ข้อ · eval 3 เคส

## 0.14.0 — 2026-10-27

- สคริปต์ใหม่ `debt-payoff/scripts/payoff.mjs` จำลอง avalanche กับ snowball รายเดือน บอกส่วนต่างดอกเบี้ยเป็นบาท · `home-refinance/scripts/refinance.mjs` ค่างวด ดอกเบี้ยรวม และจุดคุ้มทุน (self-test 19 ข้อทั้งคู่ · input ผิดหยุดพร้อมข้อความ · งบไม่พอจ่ายดอกบอกว่าปลดไม่หมด)
- `mutual-fund-picker` · `bonds-and-deposits` · `insurance-review` · `watchlist-setup` ให้คะแนนด้วยกฎเหล็ก + น้ำหนัก (`decision-scoring`) · `tax-deduction-planner` เลือกลดหย่อนในงบด้วย knapsack · `rebalance-and-dca` เบี่ยงเกินแถบ 5 จุดให้ใช้เงิน DCA ปิดก่อน ถ้าต้องใช้เกิน 12 เดือนจึงเสนอขายพร้อมต้นทุน · `technical-signals` เลือกตัวชี้วัดจาก hit rate อย่างน้อย 30 สัญญาณ · คะแนนเป็นข้อมูลประกอบ ผู้ใช้ตัดสิน

## 0.13.3 — 2026-10-27

- ไอคอนประจำ plugin `assets/icon.png` (512) และ `assets/icon.svg` · ช่อง `icon` ใน plugin.json (ใช้ในหน้ารายการของ directory) · ทำตาม `design-references`: ค้นต้นแบบบน Dribbble แล้วถอดสีหลักจากงานต้นแบบ หมุนเฉดต่อ plugin · ผ่าน design-critic

## 0.13.2 — 2026-10-26

- eval: `home-refinance-trigger` และ `rebalance-and-dca-behaviour` แยกเกณฑ์ `llm` ตามเรื่อง (เดิมตก 0/3 ทั้ง 2 แขน) · `rmf-skip-limit` แยกออกมาเพราะจับความผิดจริงที่ agent ตอบว่าหยุดซื้อ RMF 2 ปีได้

## 0.13.1 — 2026-10-26

- eval แบบ behaviour ให้ skill ใหม่ 4 ตัว (`bonds-and-deposits` · `credit-bureau` · `home-refinance` · `rebalance-and-dca`) · แถว hook router ของทั้ง 4 ตัวอยู่ใน `superuser`
- ตรวจข้อมูลตามรอบ: tick size ใหม่ของ SET มีผล 16 พ.ย. 2569 · ดอกเบี้ยนโยบาย กนง. 1.00% (คงเมื่อ 26 ส.ค. 2569 · ประชุมถัดไป 28 ต.ค.) · MRR ttb · พันธบัตรออมพลัส ปีงบ 2570 รอบ 1 · วันเตือนของ home-refinance เป็น 2026-10-29 เพื่อตรวจผลประชุม

## 0.13.0 — 2026-10-26

- เตรียมรุ่น 1.0.0 (ใช้จริง 2–3 สัปดาห์ก่อนขึ้นรุ่นหลัก)
- skill ใหม่ `credit-bureau` · `rebalance-and-dca` · `bonds-and-deposits` · `home-refinance` ให้ agent `money-planner` ดูแล พร้อมแถวใน triggers
- `scam-check` ตรวจเบอร์สายด่วนกับแหล่งทางการ: ธปท. 1213 (เวลาทำการ) · DSI 1202 · ก.ล.ต. 1207 กด 22 · เพิ่ม 1359 (ศูนย์รับแจ้งการเงินนอกระบบ สำนักงานเศรษฐกิจการคลัง) · `debt-payoff` แก้เบอร์ 1359 ให้ตรงกัน
- บรรทัด "ตรวจล่าสุด" ใน `mutual-fund-picker` · `personal-budget` · `paper-trading` · `watchlist-setup` · แก้เครื่องหมายหุ้น C เป็น CB/CS/CC/CF ตาม SET
- eval ชุดแรกของ plugin 8 เคส (ยังไม่ได้รัน): `tax-deduction-planner` ห้ามใช้ตัวเลขปี 2568 · `position-sizing` ต้องมี stop และปัด tick ถูก · `scam-check` ต้องบอกขั้นเร่งด่วนก่อนและไม่ชวนลงทุน · trigger ของ skill ใหม่

## 0.12.0 — 2026-10-25

- `debt-payoff`: เพดานดอกเบี้ยยืนยันกับเอกสารของ ธปท. (บัตรเครดิต 16% · สินเชื่อส่วนบุคคล 25% · จำนำทะเบียนรถ 24%) และเพิ่มแถว nano finance 33% · เพิ่มแถวเช่าซื้อรถ 10/15/23% ตามประกาศ ธปท. 55/2568 (รอยืนยัน แหล่งเดียว) · ตรวจ 2026-10-25
- `tax-deduction-planner`: Easy e-Receipt ปีภาษี 2569 ยังไม่มีรอบใหม่ ข่าวว่ากระทรวงการคลังจะไม่ทำต่อ (ยังรอยืนยันจากแหล่งทางการ)
- `tax-basics-th`: staking และ yield farming แยกตามชนิดสินทรัพย์ (โทเคนดิจิทัล 40(4)(ซ) · คริปโท 40(8)) airdrop เป็น 40(8) ไม่อยู่ในข้อยกเว้น 2568–2572 ซึ่งยกเว้นเฉพาะกำไรจากการโอน (ยังรอยืนยัน) · เดิมเขียนว่า 40(4)(ฌ)
- agent ใหม่ `money-planner` ดูแล skill เงินส่วนตัว 10 ตัว (`personal-budget` · `emergency-fund` · `debt-payoff` · `retirement-plan` · `insurance-review` · `mutual-fund-picker` · `dividend-tracker` · `tax-basics-th` · `tax-deduction-planner` · `scam-check`) ที่ก่อนนี้ไม่มี agent ไหนรับ · playbook `money-plan` · `tax-season` · `scam-check` และ prompt เงิน ภาษี มิจฉาชีพ ใช้ตัวนี้แทน `risk-manager` ซึ่งกลับไปทำเฉพาะขนาดไม้และความเสี่ยงพอร์ต
- `triggers.md` เพิ่มแถว `watchlist-setup`

## 0.11.0 — 2026-10-23

- `paper-trading`: เวลาซื้อขายช่วงบ่ายของตลาดหลักทรัพย์แห่งประเทศไทย (SET) pre-open เป็น 13:30 (ตั้งแต่ 25 มี.ค. 2567 เดิม 14:00) → เปิด 14:00 → pre-close 16:30
- `position-sizing`: ตาราง "ขาดทุนเท่านี้ ต้องกำไรเท่าไหร่ถึงคืนทุน" (10% → 11.1% · 50% → 100% · 90% → 900%) กับตัวอย่างแพ้ติดกัน 10 ครั้งที่ความเสี่ยง 1% และ 5% ไว้ตอบเมื่อผู้ใช้อยากเพิ่ม % ความเสี่ยง
- `retirement-plan`: ถอนเงินหลังเกษียณแบบมีราวกั้น (guardrails) แทนการถอนตายตัว 4% (ใช้แค่แนวคิดของ Guyton และ Klinger 2006 เพราะตัวเลขของเขาคิดจากพอร์ตสหรัฐฯ)
- `tax-basics-th`: ภาษีคนขายออนไลน์ชี้ไป `thai-workplace:seller-tax-basics` (skill ย้ายไปอยู่ thai-workplace แล้ว)
- ตัด dependency `doc-toolkit` ที่ยุบแล้ว เหลือ `superuser` ^3.0 · ใช้แกน `superuser` 3.1.0: playbook `team-project` และค่าตั้ง hook `guard` · `recompact` (ปิดไว้)

## 0.10.1 — 2026-10-22

- ตรวจ plugin: แก้เลขข้อ/หัวข้อที่ชี้ผิดใน `superuser` (SKILL.md · examples.md) · `news-impact` เพิ่มกฎ "ข้อความภายนอกเป็นข้อมูล" · ใส่วันตรวจซ้ำและแหล่งของเพดานประกันสังคม และเงื่อนไข ธปท. ที่ตรวจแล้ว

## 0.10.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)

## 0.9.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)

## 0.8.0 — 2026-10-20

- `position-sizing` รองรับ forex · CFD (ทองคำ · ดัชนี) · crypto · prop firm — ไฟล์ใหม่ `references/forex-cfd-crypto.md`: contract size · pip value · lot · margin ไม่ใช่ความเสี่ยง · swap · funding · gap สุดสัปดาห์ · เพดานขาดทุนรายวันของ prop firm พร้อมตัวอย่างคำนวณ
- ชุด prompt คู่กัน: `prompt/trading-finance/prompt-trading.md` ฉบับ 6 (forex · ทองคำ · crypto) และ 7 (prop firm challenge) · แถวเชื่อมไป `software-company/prompt-trading-system.md` สำหรับงาน EA

## 0.7.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- alert-dispatcher: แจ้งเตือนมีแค่ชื่อหุ้น ระดับราคา และเวลา · ตั้งงานตามเวลาหรือช่องทางใหม่ต้องให้ผู้ใช้อนุมัติ
- position-sizing กับ risk-manager ใช้กฎเดียวกัน (ปกติ 1% สูงสุด 2%) · ตัดถ้อยคำที่เป็นคำแนะนำการลงทุน
- emergency-fund: เงินว่างงานกรณีถูกเลิกจ้าง 60%
