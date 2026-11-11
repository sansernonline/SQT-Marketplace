# Changelog — trading-finance

## 0.21.4 — 2026-11-11

- สำเนา `superuser/references/` (brief-template · review-lenses · team-roles) ตรงกับแกน 3.38.0: ใบสั่งงานสั้น · โหมด test ของผู้ตรวจ · รอลูกทีมแบบ background

## 0.21.3 — 2026-11-11

- `superuser/references/team-roles.md` ตรงกับแกน: ผู้ตรวจในงบสมดุลใช้ระดับกลางทุกรอบ ระดับใหญ่เฉพาะรอบสุดท้ายของงานเสี่ยง

## 0.21.2 — 2026-11-11

- ใบสั่งงานแบบสั้นของ `worker` ตาม `superuser` 3.36.0: ชี้ไฟล์และหัวข้อของ spec แทนการคัดลอก · 1 หน่วยของโจทย์ = 1 ใบ เขียนทั้งโค้ดและ test

## 0.21.1 — 2026-11-11

- ใบสั่งงานแบบสั้นสำหรับ `worker` (`references/brief-template.md`) และ `team-roles.md` ตามต้นฉบับใน `superuser` 3.35.0: ลูกทีมค่าเริ่ม `haiku` รัน test เองได้

## 0.21.0 — 2026-11-10

- `trading-technique-course` (ใหม่): หลักสูตรเทคนิคเทรด 5 ด่าน เริ่มที่จัดขนาดไม้และ stop-loss แล้วไปเทรนด์ · breakout · mean reversion · แนวรับแนวต้าน · แต่ละด่านมีกฎเข้าออกเป็นข้อ ทดสอบย้อนหลังด้วยมือ ฝึกใน `paper-trading` และวัดด้วย `trade-stats.mjs` ก่อนผ่านด่าน · eval 3 เคส (trigger · behaviour · guard)
- `copy-trade-check` ครบวงจร: ตั้งค่าการคัดลอก (deposit load จากขาดทุนที่รับได้ · equity stop · ผลต่างจากผู้ให้สัญญาณ) · นับค่าสมาชิก ส่วนแบ่ง 20% ของ MQL5 และค่า VPS ก่อนสมัคร · เกณฑ์เลิกตามที่เขียนก่อนใช้เงินจริง · เฝ้าดูรายสัปดาห์ด้วยสคริปต์ใหม่ `copy-monitor.mjs` (self-test 22 ข้อ) · description ครอบการตั้งค่าและเฝ้าดู
- `copy-trade-check` กล่องกฎหมาย: อ่าน FAQ ธปท. ใหม่ 2026-11-10 ข้อ 4 ตอบกรณีคนไทยเทรดผ่านเว็บโบรกเกอร์ต่างประเทศตรง ๆ (ทำได้ในขอบเขต ธปท. โอนผ่านธนาคารพาณิชย์ ไม่เกิน 5 ล้านดอลลาร์ต่อปี) จึงแก้ประโยคเดิมที่บอกว่าไม่พบข้อความ · โทษตามข้อ 5 ยืนยันจากแหล่งแล้ว · เพิ่ม ก.ล.ต. ไม่ได้กำกับ forex (รอยืนยัน) และรายชื่อ Investor Alert
- agent `trade-journal-coach` และ `risk-manager` รับ skill ใหม่และงานเฝ้าดู copy trade · triggers เพิ่ม 1 แถว แก้ 1 แถว
- `copy-trade-check` ตัวอย่างเฝ้าดูรายสัปดาห์ใช้ deposit load 47% ตามสูตร X ≤ 10 ÷ (14 × 1.5) = 47.6 ปัดลง (เดิม 50% เกินสูตร) · คิดตารางใหม่ด้วย `copy-monitor.mjs` (ห่างรวม 4 สัปดาห์ 3.69 จุด) · self-test 23 ข้อ เพิ่มข้อที่ตรวจว่า `monitor-example.json` ตรงกับชุดคิดมือ
- eval `trading-technique-course-behaviour`: โจทย์ใช้ตัวเลขต่างจากตัวอย่างใน skill (ขาดทุนเฉลี่ย 1.4R เกิน 1.2R จึงไม่ผ่านด่าน · expectancy +0.31R คิดด้วย `trade-stats.mjs`) และแก้เกณฑ์ regex กับ llm ให้ตรงคำตอบใหม่

## 0.20.2 — 2026-11-10

- `stock-fundamentals`: ถูกถามว่าควรขายหรือซื้อไหม ไม่ตอบว่าไม่ควรขาย ไม่บอกให้ถือ และไม่ทำรายการขายเมื่อ… ให้ตัวเลขที่ต้องดูแล้วส่งเงื่อนไขขายให้ `watchlist-setup` (eval 2026-11-10 ตก 2/3 รอบเพราะข้อนี้)
- eval `stock-fundamentals-behaviour`: ให้ Bash และ Write ใน allowed_tools เพื่อรัน `ratios.mjs`

## 0.20.1 — 2026-11-10

- `mutual-fund-picker`: description ตัดเรื่อง DCA ออกและชี้ `rebalance-and-dca` · ขั้นตั้งแผน DCA ชี้ไปตัวเดียวกัน
- `emergency-fund`: แหล่งเงินคุ้มครองเงินฝากเปลี่ยนเป็นหน้า dpa.or.th ตรวจ 2026-11-10 (1 ล้านบาท · มีผล 11 ส.ค. 2564 · รายการที่ไม่คุ้มครอง) และชี้ `bonds-and-deposits` สำหรับเงินส่วนเกิน
- `retirement-plan`: `--mc` คิดช่วงก่อนเกษียณรายเดือนแบบเดียวกับแผนหลัก แต่ละกองใช้ผลตอบแทนของตัวเอง · ความผันผวน 0 ได้เงินก้อนเท่าแผนและโอกาส 100% เมื่อแผนบอกพอ (self-test)
- `emergency-fund`: เงินว่างงาน 60% และเพดาน 17,500 เขียนตาม `social-security-th` พร้อม (รอยืนยัน) ไม่ใช่ข้อเท็จจริง
- `portfolio-snapshot`: ตัวอย่างที่มาของผลตอบแทนนับกองตลาดเงิน +200 ครบ และเตือนอย่านับปันผลในบัญชีเงินสด 2 รอบ
- `stock-fundamentals`: ตัวอย่างอ่านงบเลิกใช้คำว่า "cheap"

## 0.20.0 — 2026-11-10

- `stock-fundamentals` (ใหม่): อ่านงบหุ้น SET เป็น P/E · P/BV · ROE · D/E · ปันผล พร้อมจุดที่ต้องเปิดงบดู และคัดผู้สมัครเข้า watchlist · สคริปต์ `ratios.mjs` + eval 3 เคส
- `retirement-plan`: `retire.mjs --mc` สุ่มผลตอบแทน 5,000 รอบ (seed คงที่) บอกโอกาสเงินอยู่ถึงอายุเป้าหมาย · ผู้ใช้ต้องใส่ความผันผวนเอง · เพิ่มตาราง 2 ทาง อายุเกษียณ × ค่าใช้จ่าย
- `watchlist-setup`: หุ้นถือยาวมี thesis 3 เสา + ความเสี่ยงที่ทำให้ล้ม + บันทึกอัปเดต ทบทวนอย่างน้อยทุกไตรมาส · แม่แบบ `thesis-<TICKER>.md`
- `news-impact`: โหมด `week-ahead` (งบออก XD ประชุม กนง. 7 วันข้างหน้า) และ `results` (ตกลงล่วงหน้า 3 สถานการณ์ แล้วเทียบกับเสาของ thesis)
- `portfolio-snapshot`: ตรวจข้อมูล 6 ข้อก่อนสรุปยอด · `money-calc.mjs attribution` แยกผลตอบแทนเป็นราคา เงินเข้า ปันผล และเรียกชื่อตัวที่อธิบายเกินครึ่ง
- `rebalance-and-dca`: หัวข้อ 5 เช็กก่อนส่งคำสั่ง (เงินที่กำลังเข้า · เวลาตัดรอบกอง · หน่วยขั้นต่ำ · ราคา ETF/DR ห่าง NAV · ของขายยาก) และทบทวนสัดส่วนเป้าหมายปีละครั้ง
- `scam-check`: วลีไทยที่ต้องหยุด (การันตีกำไร ไม่มีความเสี่ยง ฯลฯ) · ใบอนุญาตที่ใช้เป็นป้าย · รีวิวที่ได้ค่าตอบแทน · อันดับไม่มีผู้ให้และวันที่
- `bonds-and-deposits`: หัวข้อ 4 ราคากองตราสารหนี้เมื่อดอกเบี้ยขยับ (duration) และบันไดครบกำหนดรายไตรมาส
- `personal-budget`: ทบทวนรายเดือนอธิบายเฉพาะรายการที่ต่างเกิน 10% และเกิน 500 บาท
- `insurance-review`: เช็กผู้รับผลประโยชน์ในกรมธรรม์ PVD กองทุน ว่าตรงกับที่ตั้งใจ
- `trade-journal`: ตรวจไฟล์ Excel ของผู้ใช้ 9 ข้อก่อนเชื่อตัวเลข (`references/spreadsheet-check.md`) · `portfolio-snapshot` ใช้ร่วม
- agent `market-analyst` ใช้ `stock-fundamentals` · `alert-dispatcher` ส่งสรุปสัปดาห์หน้าได้ · triggers เพิ่ม 1 แถว แก้ 1 แถว

## 0.19.2 — 2026-11-10

- อ้างถึง plugin ซอฟต์แวร์ด้วยชื่อใหม่ `software-development` (เดิม `software-company`)
- ของกลางจาก superuser 3.33.0 (sync): ขั้นตรวจงานใหม่ใน `playbook-review` · แจกงานและรอลูกทีมใน `team-roles` · รอบ `playbook-unattended-run` มีตรวจเครื่องมือและกล่องขาออก · แม่แบบสมุดงาน ledger และแนวคิดที่ปฏิเสธใน `templates/` · แม่แบบ `config.json` มีโมดูล hook ใหม่

## 0.19.1 — 2026-11-08

- `references/examples.md`: ตัวอย่างระดับโมเดลจัดตามกฎ 3 ข้อของ superuser 3.26.0 (งานเสี่ยง → opus · งานกลไกที่มีแบบ → haiku · ที่เหลือ → sonnet)

## 0.19.0 — 2026-11-08

- ยุบ `post-trade-review` เข้า `trade-journal` (โหมด 2 ทบทวนผล) · สูตรและตัวอย่างอยู่ใน `references/review-stats.md` · สคริปต์ย้ายเป็น `trade-journal/scripts/trade-stats.mjs` · **เรียกชื่อเก่าไม่ได้แล้ว**
- `paper-trading` · `technical-signals` · playbook `review` `trade-review` · triggers · agent `trade-journal-coach` ชี้ตัวใหม่ · CI (`.github/workflows/check.yml`) รัน self-test ที่ path ใหม่

## 0.18.1 — 2026-11-07

- ประหยัด token (ตรวจ plugin หัวข้อ 8): ย้ายตาราง drawdown · knapsack · ตัวอย่างและแหล่งของ copy-trade-check · rebalance · ความหมายสัญญาณ ไป references/ ของแต่ละ skill · `post-trade-review` และ playbook ให้สคริปต์อ่านบันทึกแทนเปิดทั้งไฟล์ และจำกัดคำตอบ subagent ไม่เกิน 20 บรรทัด · ตัดประโยคซ้ำใน `superuser/SKILL.md`

## 0.18.0 — 2026-11-07

- เอาคำสั่งที่เป็นแค่ทางลัดไปหา skill ตัวเดียวออก 6 ตัว เรียก skill ตรงแทน เช่น `/trading-finance:trade-journal` · ขั้นตอนและ `argument-hint` ของคำสั่งเดิมย้ายไปหัวข้อ "เรียกเป็นคำสั่ง" ท้าย SKILL.md ของ skill ปลายทาง: `journal` → `trade-journal` · `paper-trade` → `paper-trading` · `portfolio` → `portfolio-snapshot` · `review-week` → `post-trade-review` · `tax-plan` → `tax-deduction-planner` · `watch` → `watchlist-setup`

## 0.17.1 — 2026-11-01

- `home-refinance`: กนง. 28 ต.ค. 2569 คงดอกเบี้ยนโยบาย 1.00% (มติ 6–0) ใส่แหล่งข่าว 3 แห่งที่ตรวจ 2026-11-01 · ครั้งถัดไป 23 ธ.ค. 2569 · เลื่อนวันตรวจใน `expiry.json` เป็น 2026-12-24

## 0.17.0 — 2026-10-28

- สคริปต์ใหม่ `tax-deduction-planner/scripts/tax.mjs` คิดภาษีก่อน/หลัง/ประหยัด อัตราส่วนเพิ่ม ห้องเหลือ RMF ThaiESG วงเงินรวม 500,000 ค่า `value` ของ knapsack และเทียบรวมหรือไม่รวมปันผล · อัตราอ่านจาก `rates-2569.json` ที่มีวันตรวจ · self-test 24 ข้อ
- สคริปต์ใหม่ `retirement-plan/scripts/retire.mjs` คิดเงินที่ต้องมี บำนาญประกันสังคม เงินออมต่อเดือน สามคันโยก และช่วงผลตอบแทน · เพดานค่าจ้างอ่านจาก `sso-pension.json` · self-test 26 ข้อ
- สคริปต์ใหม่ `portfolio-snapshot/scripts/money-calc.mjs` 5 คำสั่ง (`snapshot` `drift` `dividend` `afterTax` `fee`) ใช้ร่วม 5 skill แทนคิดในหัว · self-test 36 ข้อ
- สคริปต์ใหม่ `technical-signals/scripts/indicators.mjs` SMA EMA RSI MACD วอลุ่ม และ hit rate พร้อมช่วง Wilson จาก CSV ของผู้ใช้ · self-test 19 ข้อ
- `technical-signals` เลือก RSI หรือ MACD เมื่อช่วง 95% ไม่ทับกัน แทนเกณฑ์ต่าง 5 จุดที่เล็กกว่าความคลาดเคลื่อน
- `size.mjs` riskPct เกิน 2% หยุดถ้าไม่มี `riskPctApprovedBy` · เพิ่ม `gapMultiplier` `openRiskPct` และ margin ของ forex · ค่าคงที่มีคอมเมนต์ที่มา
- `payoff.mjs` ชื่อหนี้ซ้ำหยุดพร้อมข้อความ · ขั้นต่ำบัตรเป็น % ของยอดด้วย `minPct` `minFloor`
- `refinance.mjs` รับอัตราหลายช่วง (`rates`) และคำสั่ง `scenarios` ที่เขียนตารางให้ `decide.mjs payoff`
- `trade-stats.mjs` แสดงช่วง Wilson ของ win rate · เกณฑ์ 1.2R และ 10% เป็นค่าคงที่พร้อมคอมเมนต์ว่ายังไม่ได้วัด
- `rebalance-and-dca` มีไฟล์ตัวอย่าง `decide.mjs score` เทียบวิธีปรับสัดส่วน น้ำหนัก 0.5/0.5 ยังไม่ได้วัด
- `tax-deduction-planner` และ `retirement-plan` มีรายการตรวจก่อนส่ง · `tax-basics-th` ชี้ไป `tax.mjs` ตอนเทียบปันผล
- `copy-trade-check` อยู่ในตารางตัวกระตุ้นและในหน้าที่ของ agent `risk-manager`
- eval: เคส behaviour ที่มีสคริปต์ตรวจว่ารันสคริปต์จริง · เพิ่ม 8 เคส (ไม่ควรเปิด 2 · tax-basics-th · debt-payoff · retirement-plan) · ทุกเคสติดป้าย capability หรือ regression · RESULTS.md จดแผนรอบหน้า (ยังไม่ได้รัน)

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
