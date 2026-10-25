# Changelog — trading-finance

## Unreleased

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
