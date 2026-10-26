# ผล eval ของ trading-finance

## 2026-10-26 · skill ใหม่ 4 ตัว · Claude Code 2.1.310 · เคสละ 3 รอบ · ผู้ตัดสิน haiku · 6.23 ดอลลาร์

รันที่สำเนาที่ลบ `dependencies` ออก เพราะ eval โหลด plugin ที่มี dependency ไม่ขึ้น (`skill-authoring` `eval-format.md`) · skill กลางของ superuser จึงไม่อยู่ในรอบนี้ · คะแนนคือ 0–1 ของ grader ที่นับคะแนน

| เคส | มี skill | ไม่มี skill | ต่าง | อ่านผล |
|---|---|---|---|---|
| `bonds-and-deposits-trigger` | 0.67 | 1.00 | -0.33 | skill เปิด 3/3 แต่เกณฑ์เทียบความเสี่ยงผ่านแค่ 1/3 ส่วนรอบไม่มี skill ผ่าน 3/3 · ต้องดูว่า skill ทำให้คำตอบแคบลงไหม |
| `bonds-and-deposits-behaviour` | 1.00 | 0.83 | +0.17 | |
| `credit-bureau-trigger` | 1.00 | 1.00 | 0 | skill เปิด 3/3 |
| `credit-bureau-behaviour` | 1.00 | 0.50 | +0.50 | ไม่มี skill พลาดข้อเท็จจริงและเรื่องรับลบประวัติทั้ง 3 รอบ |
| `home-refinance-trigger` | 0.50 | 0.50 | 0 | เกณฑ์เทียบค่าธรรมเนียมผ่าน 0/3 ทั้ง 2 รอบ เกณฑ์อาจเข้มเกิน |
| `home-refinance-behaviour` | 1.00 | 0.50 | +0.50 | ไม่มี skill ไม่คิดค่าปรับและไม่เทียบรีเทนชั่นทั้ง 3 รอบ |
| `rebalance-and-dca-trigger` | 1.00 | 1.00 | 0 | skill เปิด 3/3 |
| `rebalance-and-dca-behaviour` | 0.50 | 0.50 | 0 | เกณฑ์ RMF ผ่าน 0/3 ทั้ง 2 รอบ เกณฑ์อาจเข้มเกิน |
