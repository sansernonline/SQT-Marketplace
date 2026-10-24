# prompt-trading-system — สร้างระบบเทรดอัตโนมัติ: Expert Advisor (EA) และ indicator บน MetaTrader 4/5

ใช้คู่กับ plugin `software-company` · ไฟล์นี้มี prompt 6 ฉบับ ทำเรียงกัน 1 → 6 · ใช้เมื่อจะเขียน EA หรือ indicator ใหม่ · port จาก MetaTrader 4 (MT4) ไป MetaTrader 5 (MT5) · หรือเตรียม EA ที่มีอยู่ไปขาย · เทรดเองด้วยมือ (ซื้อกี่หุ้น · ทบทวนผลเทรด) → plugin `trading-finance` (`prompt/trading-finance/prompt-trading.md`)

## วิธีใช้

วางทั้งไฟล์ใน Claude Code, Codex CLI หรือ Gemini CLI ที่รากโฟลเดอร์โปรเจกต์ แล้วพิมพ์ต่อท้ายว่าจะทำฉบับไหน เช่น `ทำทั้งหมด` หรือ `ทำข้อ 1 และ 2`

<!-- rules:begin -->
**กฎการทำงาน (agent ต้องทำตาม):** เปิด skill `superuser` ก่อนเริ่ม แล้วทำตาม playbook ที่ฉบับนั้นระบุ (ไม่ระบุ → `project-docs`) · กฎร่วม (ถามแบบเลือกคำตอบครั้งเดียว ทุกตัวเลือกมีหลักฐาน · ทำจบรอบเดียว · ตัดสินใจเอง · รายงานสถานะ) อยู่ใน skill `superuser` และ playbook ที่เดียว · ข้อที่ต้องตัดสิน: ใช้ค่าตั้งต้นของเจ้าของใน `~/.claude/superuser-style.md` ก่อน ไม่มี → ค้นแล้วโหวต 3 agent ตาม skill `superuser` หัวข้อ 6 · ถามผู้ใช้เฉพาะข้อที่โหวตแทนไม่ได้ และตัวแนะนำบอกผลโหวต · ตัดสินใจเอง (พร้อมผลโหวต) และสถานะลง `docs/BUILD-PLAN.md` (ยังไม่มี → สร้าง) · ไฟล์ทำงานของ SuperUser (`CONTEXT.md` · `IMPROVEMENTS.md` · log) อยู่ใต้ `.claude/superuser/` ตาม `project-doc-set` ข้อ 1 ไม่วางที่รากโปรเจกต์ · ใช้ skill และ agent ของ plugin `software-company` เท่านั้น (ไม่ใช้ตัวชื่อซ้ำของ plugin อื่น) · เปิด skill ไม่ได้ → อ่าน `skills/<ชื่อ>/SKILL.md` ของ plugin · ไม่มี agent → ใช้ agent ทั่วไปพร้อมเปิด `agents/<ชื่อ>.md` · หาไม่เจอทั้ง 2 ทาง → ข้ามชิ้นนั้น ทำส่วนอื่นให้จบ แล้วรายงานว่าติด · ไม่มี `reviewer` หรือ `brainstormer` (plugin เวอร์ชันเก่า) → `general-purpose` ตัวใหม่ทำหน้าที่เดียวกัน (ตรวจอย่างเดียว ไม่แก้ · เสนอ 2–3 ทาง) · ไม่มี `learning-reviewer` → ข้ามรอบเรียนรู้แล้วจดไว้

**วนจนเสร็จ (agent loop):** ทุกฉบับวน ทำ → ตรวจ → แก้ → ตรวจซ้ำ จนผ่านทุกข้อที่ฉบับนั้นต้องมี · ตรวจด้วยหลักฐานจริง (เปิดไฟล์ · รันคำสั่ง · เทียบแหล่ง) ไม่ใช่คำบอกของตัวที่ทำ · รอบตรวจใช้ `reviewer` ตัวใหม่ทุกรอบ · ไม่ผ่าน → แก้ที่ต้นเหตุแล้วตรวจซ้ำทั้งข้อเดิมและจุดที่แก้ · เหลือแค่ข้อระดับต่ำ → ปิดได้แล้วลงรายงาน · ครบเพดานรอบ (งานกลาง 3 · งานใหญ่หรืองานเสี่ยง 5) ยังไม่ผ่าน → ติดป้าย `ติด` ทำส่วนอื่นให้จบ แล้วรายงานข้อที่เหลือ · รายละเอียดอยู่ใน skill `superuser` กฎข้อ 3
<!-- rules:end -->

**ภาษาและรูป:** ทุกเอกสารเขียนตาม skill `human-writing` · รูปในเอกสารส่งมอบใช้ `diagram-figures` · Mermaid (`software-diagrams`) ใช้ได้เฉพาะเอกสารภายในทีม

**ขอบเขต (ห้ามข้าม):** เอกสารและโค้ดเป็นเครื่องมือ **ไม่ใช่คำแนะนำการลงทุน** · ไม่บอกว่ากลยุทธ์ "ทำกำไรได้" จาก backtest อย่างเดียว · รันได้เฉพาะ Strategy Tester และบัญชี demo · **รันบนบัญชีเงินจริง · เปิด Virtual Private Server (VPS) ที่เสียเงิน · ส่งขึ้น Market** อยู่ใน "รออนุมัติ" เสมอ · รหัสผ่านบัญชีเทรด · เลขบัญชีจริง · API key ห้ามอยู่ในโค้ด ไฟล์ `.set` และเอกสาร

**โค้ด MQL (ใช้ทุกฉบับ):** ทำตาม skill `stack-mql` · compile และ backtest ต้องมี terminal (Windows หรือ Wine บน macOS / Linux) · เครื่องไม่มี → เขียนโค้ดและไฟล์ config ให้พร้อม แล้วรายงานว่า `ยังไม่ได้ compile` / `ยังไม่ได้ backtest` ห้ามรายงานว่าผ่าน

| # | งาน | playbook | ได้ไฟล์ |
|---|---|---|---|
| 1 | EA Spec: กลยุทธ์ · ความเสี่ยง · ตาราง input | `project-docs` | `docs/ea/EA-SPEC.md` |
| 2 | EA Design: ส่งออร์เดอร์ · state และการกู้คืน · MT4 กับ MT5 | `project-docs` | `docs/ea/EA-DESIGN.md` |
| 3 | เขียนโค้ด EA พร้อมตัวตรวจก่อนส่งออร์เดอร์ | `new-project` (ยังไม่มีโค้ด) · `feature` (ต่อจากโค้ดเดิม) | โค้ดใน `<repo>/MQL5/` หรือ `<repo>/MQL4/` · `docs/ea/build-log.md` |
| 4 | Backtest และทดสอบความทนทาน | `review` | `docs/ea/backtest-report.md` · ไฟล์ `tester-*.ini` · `.set` |
| 5 | Forward test บนบัญชี demo และขึ้น VPS | `ship` | `docs/ea/forward-test.md` · `docs/ea/runbook.md` |
| 6 | เตรียมขาย: MQL5 Market หรือขายเอง | `ship` | `docs/ea/market-listing.md` · `docs/ea/user-manual.md` · `CHANGELOG.md` |

ใช้ต่อกัน: EA ใหม่ → 1 → 6 ตามลำดับ · port MT4 → MT5 → 1 (เขียน spec จาก EA เดิม) → 2 (หัวข้อความต่าง) → 3 → 4 · EA เดิมที่ไม่มีเอกสาร → `prompt-existing-code.md` ฉบับ 1 ก่อน แล้วค่อย 1 · ไม่แน่ใจว่ากลยุทธ์มีของจริงไหม → 1 → 2 → 3 → 4 แล้วหยุดตัดสินก่อนไป 5 · ตั้งราคาและแพ็กเกจขาย → `prompt-sell-product.md`

## กฎเฉพาะไฟล์นี้

- **เกณฑ์ผ่านของ backtest เขียนในฉบับ 1 ก่อนเห็นผล** และห้ามแก้หลังเห็นผล · จะแก้ → ลงเหตุผลใน `docs/BUILD-PLAN.md` และบอกในรายงานฉบับ 4
- ตัวเลขที่รายงานเป็น "ผลของ EA" มาจากช่วงที่ไม่ได้ใช้ optimize เท่านั้น · ผลช่วง optimize ใส่ได้แต่ติดป้าย `in-sample`
- ข้อมูลราคาและ tick: บอกแหล่ง · ช่วงวันที่ · คุณภาพ (modelling quality ของ MT4 · real ticks ของ MT5) ทุกครั้ง
- ค่าของโบรกเกอร์ (spread · commission · swap · digits · stops level · contract size · เวลา server) อ่านจาก symbol จริงในบัญชีที่จะใช้ ติดวันที่ตรวจ · ไม่รู้ → `(รอยืนยัน)` ห้ามใส่ 0
- agent ที่ใช้: `quant-analyst` (สูตร สถิติ ความทนทาน) · `developer` (โค้ด) · `qa-tester` (test case) · `technical-writer` (คู่มือ) · `reviewer` ตรวจทุกฉบับ

---

## 1. EA Spec: กลยุทธ์ · ความเสี่ยง · ตาราง input

playbook `project-docs` · agent `quant-analyst` + `business-analyst` · skill `stack-mql` · `simplicity-first` · `spell-out-abbreviations`
**ผลลัพธ์:** `docs/ea/EA-SPEC.md`

### โจทย์ (ผู้ใช้กรอก)

- ชื่อ EA / indicator:
- MT4 · MT5 · ทั้ง 2:
- symbol และ timeframe ที่ตั้งใจใช้:
- กลยุทธ์เล่าแบบคน (เข้าเมื่อไร ออกเมื่อไร):
- indicator ที่ใช้และค่าตั้ง:
- เงื่อนไขห้ามเทรด (ข่าว · spread กว้าง · ช่วงเวลา · วันศุกร์ดึก):
- ความเสี่ยงต่อไม้ (% หรือ lot คงที่) / ขาดทุนสูงสุดต่อวัน / max drawdown ที่รับได้:
- ชนิดบัญชี (netting · hedging · ไม่รู้) / โบรกเกอร์ที่จะใช้:
- ไฟล์อ้างอิง (EA เดิม · ภาพกราฟ · บันทึกเทรด) path ใน `ref/`:

### หัวข้อที่ต้องมี

1. **กฎเข้าและออก** — เขียนเป็นเงื่อนไขที่ตรวจได้ทีละข้อ (ไม่มีคำว่า "ประมาณ" · "แนวโน้มดี") · รหัส `R-xx` ทุกข้อ · ตัวอย่าง 1 แท่งที่เข้า และ 1 แท่งที่เกือบเข้าแต่ไม่เข้า
2. **ตัวกรองห้ามเทรด** — ข่าว · spread · session · ตลาดปิด · เวลาอิงเวลา server หรือ Greenwich Mean Time (GMT) (ระบุ offset เป็น input)
3. **ความเสี่ยงและขนาดไม้** — สูตรคำนวณ lot จาก % เสี่ยงและระยะ Stop Loss (SL) (รวม contract size และค่าเงินบัญชี) · SL / Take Profit (TP) / trailing / break-even · จำนวนไม้สูงสุดพร้อมกัน · หยุดเทรดเมื่อขาดทุนรายวันหรือ drawdown ถึงเกณฑ์
4. **ตาราง input** — `| ชื่อ input | ความหมาย | หน่วย (pip · point · % · lot) | default | ช่วงที่อนุญาต | ช่วง optimize |` · input ที่ไม่ optimize เขียนว่า `คงที่`
5. **เกณฑ์ผ่าน backtest** — profit factor · max drawdown · จำนวนไม้ขั้นต่ำ · ผลช่วง out-of-sample ต้องไม่แย่กว่าช่วง in-sample เกินกี่ % · ตัวเลขทุกตัวผู้ใช้ยืนยัน ไม่รู้ → ค่าแนะนำพร้อมเหตุผลและ `(รอยืนยัน)`
6. **นอกขอบเขต** — สิ่งที่ EA ไม่ทำ (เช่น ไม่ martingale · ไม่ grid · ไม่เทรดหลาย symbol จาก chart เดียว)

### กฎเฉพาะฉบับนี้

- กลยุทธ์ที่ใช้ martingale · grid ไม่มี SL · หรือเพิ่ม lot หลังแพ้ → ทำได้ถ้าผู้ใช้ยืนยัน แต่ต้องมีหัวข้อ "ความเสี่ยงล้างพอร์ต" พร้อมตัวเลขว่าแพ้ติดกันกี่ไม้แล้ว margin หมด
- กฎที่ยังกำกวม → ถามรวมครั้งเดียวก่อนเริ่ม · ไม่ได้คำตอบ → เลือกแบบที่เข้าน้อยกว่า และลง `## ตัดสินใจเอง`

---

## 2. EA Design: ส่งออร์เดอร์ · state และการกู้คืน · MT4 กับ MT5

playbook `project-docs` · agent `solution-architect` + `developer` · skill `stack-mql` · `error-handling-patterns` · `logging-standards` · `architecture-patterns`
**ต้องมีก่อน:** `docs/ea/EA-SPEC.md`
**ผลลัพธ์:** `docs/ea/EA-DESIGN.md`

### หัวข้อที่ต้องมี

1. **โครงไฟล์และฟังก์ชัน** — ไฟล์ `.mq5` / `.mq4` · `.mqh` ที่ใช้ร่วม · 1 ฟังก์ชัน 1 หน้าที่ (สัญญาณ · ขนาดไม้ · ส่งออร์เดอร์ · จัดการไม้เปิด · ตัวกรอง) พร้อม `R-xx` ที่แต่ละฟังก์ชันรับผิดชอบ
2. **การส่งออร์เดอร์** — ตัวตรวจทั้งหมดตาม `stack-mql` ข้อ 3 · ผลส่งกลับแต่ละรหัสทำอะไร (ลองใหม่ · หยุดไม้นั้น · หยุด EA) · magic number · slippage · filling mode (MT5)
3. **state และการกู้คืน** — terminal รีสตาร์ท · เน็ตหลุด · มีไม้ค้างก่อนเปิด EA · ย้ายเครื่อง VPS: แต่ละกรณี EA สร้าง state จากอะไร · ค่าที่เก็บใน GlobalVariable หรือไฟล์
4. **MT4 กับ MT5** (ทำทั้ง 2 หรือ port) — ตารางส่วนที่ต่างตาม `stack-mql` ข้อ 2 · ส่วนไหนแยกด้วย `#ifdef __MQL5__` · netting ทำให้กลยุทธ์เปลี่ยนไหม
5. **log และการแจ้งเตือน** — log อะไร เมื่อไร · แจ้งเตือนผ่านอะไร (push ของ MetaTrader · อีเมล · ไม่แจ้ง) · ห้าม log รหัสผ่านหรือเลขบัญชีเต็ม
6. **ผังการทำงาน 1 รูป** — แท่งใหม่ → ตัวกรอง → สัญญาณ → ขนาดไม้ → ตัวตรวจ → ส่ง → อ่านผล → log

---

## 3. เขียนโค้ด EA พร้อมตัวตรวจก่อนส่งออร์เดอร์

playbook `new-project` (ยังไม่มีโค้ด) หรือ `feature` (ต่อจากโค้ดเดิม) · agent `developer` + `quant-analyst` · skill `stack-mql` · `lazy-coding` · `readable-code` · `principle-small-verifiable-steps` · `principle-prove-it-works` · `config-and-secrets`
**ต้องมีก่อน:** `EA-SPEC.md` · `EA-DESIGN.md`
**ผลลัพธ์:** โค้ดใน `<repo>/MQL5/Experts/<ชื่อ>/` (หรือ `MQL4/`) บน branch `ea/<ชื่อ>` · script test ใน `<repo>/MQL5/Scripts/<ชื่อ>-tests/` · `docs/ea/build-log.md` · **ไม่แก้โค้ด** เว้นแต่ข้างล่างติ๊ก `[x]`

- [ ] อนุญาตให้สร้างและแก้โค้ด (commit บนเครื่องเท่านั้น · ไม่ push · ไม่ merge เข้า branch หลัก) · ยังไม่มี git → `git init` ได้
- [ ] มีเครื่อง Windows ที่ติดตั้ง terminal ให้ compile (path ของ `metaeditor64.exe` / `metaeditor.exe`):

### สิ่งที่ต้องได้

1. compile ได้ 0 errors 0 warnings · แนบท้าย `.log` ของ compile ใน `build-log.md` (ไม่มีเครื่อง → `ยังไม่ได้ compile`)
2. ทุกกฎ `R-xx` มีฟังก์ชันรับผิดชอบ · ตาราง `| R-xx | ฟังก์ชัน | ไฟล์:บรรทัด | script test |` ใน `build-log.md`
3. ฟังก์ชันสัญญาณและขนาดไม้มี script test ป้อนข้อมูลตายตัวแล้วเทียบผล · ขนาดไม้ test อย่างน้อย 3 symbol ที่ digits และ contract size ต่างกัน
4. ตัวตรวจก่อนส่งออร์เดอร์ครบตาม `stack-mql` ข้อ 3 · ผลส่งกลับทุกรหัสใน `EA-DESIGN.md` หัวข้อ 2 มีโค้ดจัดการ
5. input ตรงตาราง `EA-SPEC.md` หัวข้อ 4 ทุกตัว · ค่าผิดช่วง → `INIT_PARAMETERS_INCORRECT`

### กฎเฉพาะฉบับนี้

- ทีละกฎ: เขียน → compile → script test → ผ่านแล้วค่อยไปกฎถัดไป
- เจอกฎที่เขียนเป็นโค้ดไม่ได้ เพราะกำกวม → ไม่เดา · ลงคำถามค้างใน `docs/BUILD-PLAN.md` แล้วทำกฎอื่นต่อ

---

## 4. Backtest และทดสอบความทนทาน

playbook `review` · agent `quant-analyst` (นำ) + `qa-tester` · skill `stack-mql` · `principle-prove-it-works` · `markdown-visuals` · `polished-document-style`
**ต้องมีก่อน:** โค้ดที่ compile ได้ · เกณฑ์ผ่านใน `EA-SPEC.md` หัวข้อ 5
**ผลลัพธ์:** `docs/ea/backtest-report.md` · `tester-*.ini` และ `.set` ทุกชุดที่ใช้ใน `docs/ea/tester/`

### ข้อมูล (ผู้ใช้กรอก)

- ช่วงข้อมูลทั้งหมด (ปี-เดือน ถึง ปี-เดือน):
- แหล่งข้อมูล tick (ของโบรกเกอร์ · ซื้อมา · ไม่รู้):
- ทุนตั้งต้น / ค่าเงินบัญชี / leverage:
- ค่า spread · commission · swap ของบัญชีจริง (ไม่รู้ → ให้ agent อ่านจาก symbol):

### หัวข้อที่ต้องมี

1. **ตั้งค่าที่รันซ้ำได้** — ไฟล์ `.ini` และ `.set` ทุกชุด · โหมด tick · ช่วงวันที่ · คนอื่นรันแล้วได้ตัวเลขเดียวกัน
2. **แบ่งข้อมูล** — in-sample (optimize) · out-of-sample (ไม่แตะจนจบ) · walk-forward อย่างน้อย 4 ช่วง (หรือ forward period ของ MT5)
3. **ผลเทียบเกณฑ์** — ตาราง `| เกณฑ์ | ผ่านเมื่อ | in-sample | out-of-sample | walk-forward | ผ่าน/ไม่ผ่าน |` · กราฟ equity และ drawdown
4. **ความทนทาน** — เปลี่ยน input หลัก ±10–20% แล้วผลยังผ่านไหม (ตารางหรือ heatmap) · Monte Carlo สลับลำดับไม้และสุ่ม spread / slippage อย่างน้อย 1,000 รอบ → drawdown ที่ percentile 95 · symbol และ timeframe อื่นอย่างน้อย 2 ชุด
5. **สัญญาณ overfit** — จำนวน input ที่ optimize เทียบกับจำนวนไม้ · ผลดีเฉพาะช่วงแคบ ๆ ของ input · ผลพังเมื่อเพิ่ม spread นิดเดียว
6. **edge case** — gap วันจันทร์ · ตลาดปิดวันหยุด · spread กว้างช่วงข่าว · ทุนน้อยจนส่งไม้ขั้นต่ำไม่ได้ · บัญชี netting และ hedging (MT5)
7. **คำตัดสิน** — `ผ่าน` · `ผ่านแบบมีเงื่อนไข` · `ไม่ผ่าน` พร้อมเหตุผลข้อละ 1 บรรทัด

### กฎเฉพาะฉบับนี้

- ไม่ผ่านก็รายงานว่าไม่ผ่าน · ห้ามตัดช่วงข้อมูลที่ผลแย่ออก · ห้าม optimize ซ้ำบนช่วง out-of-sample
- จำนวนไม้น้อยกว่าที่เกณฑ์กำหนด → คำตัดสินคือ `ยังไม่พอบอก` ไม่ใช่ `ผ่าน`

---

## 5. Forward test บนบัญชี demo และขึ้น VPS

playbook `ship` · agent `devops-engineer` + `quant-analyst` · skill `stack-mql` · `incident-runbook-template` · `observability-basics`
**ต้องมีก่อน:** `backtest-report.md` คำตัดสิน `ผ่าน` หรือ `ผ่านแบบมีเงื่อนไข`
**ผลลัพธ์:** `docs/ea/forward-test.md` · `docs/ea/runbook.md` · **รออนุมัติ:** เปิด VPS ที่เสียเงิน · ย้ายไปบัญชีเงินจริง

### ข้อมูล (ผู้ใช้กรอก)

- บัญชี demo ของโบรกเกอร์ไหน (ไม่ใส่เลขบัญชีและรหัสผ่าน):
- ระยะเวลา forward test ที่รับได้ (สัปดาห์):
- VPS (ของ MetaQuotes · เช่าเอง · เครื่องที่บ้าน):

### หัวข้อที่ต้องมี

1. **แผน forward test** — ระยะเวลา · จำนวนไม้ขั้นต่ำ · เกณฑ์ว่าผลจริงห่างจาก backtest ได้แค่ไหน (เช่น drawdown เกิน backtest 1.5 เท่า → หยุด)
2. **ตารางเทียบรายสัปดาห์** — `| สัปดาห์ | ไม้ | ผล | drawdown | slippage เฉลี่ย | ต่างจาก backtest |` (ผู้ใช้หรือ agent เติมทุกสัปดาห์)
3. **runbook** — ติดตั้งบน VPS · ไฟล์ `.set` ที่ใช้ · อาการผิดปกติแต่ละแบบ (ไม่เข้าไม้ · error ซ้ำ · ไม้ค้าง · เวลา server เปลี่ยน) → ตรวจอะไร → แก้อย่างไร · วิธีหยุด EA ฉุกเฉินและปิดไม้ด้วยมือ
4. **เกณฑ์ย้ายไปเงินจริง** — ผ่านข้อไหนบ้าง · เริ่มด้วยขนาดเท่าไร (เช่น 25% ของขนาดใน spec)

---

## 6. เตรียมขาย: MQL5 Market หรือขายเอง

playbook `ship` · agent `product-manager` + `technical-writer` + `developer` · skill `stack-mql` · `product-naming` · `image-generation` · `human-writing`
**ต้องมีก่อน:** `backtest-report.md` · `forward-test.md`
**ผลลัพธ์:** `docs/ea/market-listing.md` · `docs/ea/user-manual.md` · `CHANGELOG.md` · ภาพหน้าจอใน `docs/ea/screenshots/` · **รออนุมัติ:** ส่งขึ้น Market · เปิดขายจริง

### ข้อมูล (ผู้ใช้กรอก)

- ช่องทาง (MQL5 Market · ขายเอง · ทั้ง 2):
- ราคา / เช่ารายเดือนไหม (ยังไม่รู้ → `prompt-sell-product.md` ฉบับ 1 ก่อน):
- มีรุ่นทดลองไหม:

### หัวข้อที่ต้องมี

1. **ตรวจกฎ Market** — ตาราง `| กฎ | EA เราเป็นอย่างไร | ผ่าน/ไม่ผ่าน |` ตาม `stack-mql` ข้อ 6 (ไฟล์เดียว · ไม่มี DLL · ไม่ล็อกบัญชีหรือ symbol · ส่งออร์เดอร์ได้ทุก symbol ที่ตรวจ · ไม่สัญญาผลกำไร) · ตรวจกฎจากหน้าทางการรอบนี้ ติดวันที่
2. **หน้าสินค้า** — ชื่อตามกฎ Market · คำบรรยาย: ภาพรวม → วิธีทำงาน → ตั้งค่า → เงื่อนไขการเทรดที่แนะนำ → ตาราง input · ไม่มีคำว่า "กำไรแน่นอน" หรือตัวเลขผลตอบแทนที่ไม่มีหลักฐาน · ภาพหน้าจอจาก tester จริง
3. **ขายเอง** — ล็อก license ตาม `stack-mql` ข้อ 7 · วิธีส่งไฟล์และต่ออายุ · เงื่อนไขการใช้และการคืนเงิน (ร่างให้ผู้ใช้ตรวจ ติดป้าย `(ให้ผู้รู้กฎหมายตรวจ)`)
4. **คู่มือผู้ใช้** — ติดตั้ง · เพิ่ม URL ใน allow list (ถ้าใช้ `WebRequest`) · ค่าที่แนะนำต่อ symbol · คำเตือนความเสี่ยง
5. **CHANGELOG** — รุ่นแรก · รุ่นถัดไปเขียนสิ่งที่เปลี่ยนเป็นภาษาคน

### กฎเฉพาะฉบับนี้

- ผลที่แสดงในหน้าสินค้ามาจาก `backtest-report.md` ช่วง out-of-sample และ `forward-test.md` เท่านั้น · ติดป้ายว่าเป็นผลในอดีต ไม่รับประกันอนาคต
