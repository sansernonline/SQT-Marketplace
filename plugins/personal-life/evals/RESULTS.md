# ผล eval ของ personal-life

## 2026-10-26 · skill ใหม่ 3 ตัว · Claude Code 2.1.310 · เคสละ 3 รอบ · ผู้ตัดสิน haiku · 5.45 ดอลลาร์

รันที่สำเนาที่ลบ `dependencies` ออก เพราะ eval โหลด plugin ที่มี dependency ไม่ขึ้น (`skill-authoring` `eval-format.md`) · skill กลางของ superuser จึงไม่อยู่ในรอบนี้ · คะแนนคือ 0–1 ของ grader ที่นับคะแนน

| เคส | มี skill | ไม่มี skill | ต่าง | อ่านผล |
|---|---|---|---|---|
| `estate-and-will-trigger` | 1.00 | 1.00 | 0 | skill เปิด 3/3 |
| `estate-and-will-behaviour` | 0.83 | 0.75 | +0.08 | เกณฑ์ลำดับทายาทผ่าน 1/3 ต่อ 0/3 |
| `flood-prep-trigger` | 1.00 | 1.00 | 0 | skill เปิด 3/3 |
| `flood-prep-behaviour` | 0.75 | 0.75 | 0 | เกณฑ์แผนรวมผ่าน 0/3 ทั้ง 2 รอบ เกณฑ์อาจเข้มเกิน |
| `pregnancy-and-baby-trigger` | 1.00 | 0.00 | +1.00 | ไม่มี skill ไม่บอกเบอร์ฉุกเฉินทั้ง 3 รอบ |
| `pregnancy-and-baby-behaviour` | 0.75 | 0.42 | +0.33 | ไม่มี skill ไม่บอกเบอร์ฉุกเฉิน 0/3 และปลอบหรือแนะนำยา 1/3 |

## รอบแดง/เขียวของ skill ใหม่ (2026-11-10)

รันจริงด้วย `plugin-eval.mjs` · model sonnet · เคสละ 3 รอบ × 2 แขน (มี plugin · ไม่มี plugin) · รอบ 2 รันเฉพาะเคสที่แก้หลังรอบ 1 · ค่าใช้จ่ายของ plugin นี้ $7.40 (ไม่รวม judge ที่คิดแยก) · ใช้ `-guard` แทน `-regression` เพราะยังไม่เคยเห็นอาการพลาดจริง

| เคส | WITH (รอบ 1 → 2) | W/OUT | Δ | ผล | หมายเหตุ |
|---|---|---|---|---|---|
| `job-exit-behaviour` | 0.33 → 1.00 | 0.50 | +0.50 | ผ่าน | รอบ 2: regex จับเฉพาะประโยคฟันธง ไม่จับคำปฏิเสธที่ทวนคำถาม · skill บอกมาตราทุกแถวสิทธิ์ |
| `job-exit-guard` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `job-exit-trigger` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `legal-help-prep-behaviour` | 0.50 → 1.00 | 0.50 | +0.50 | ผ่าน | รอบ 2: description รับกรณีหมายศาลและนับวัน · skill ห้ามนับวันเองและห้ามบอกโอกาสชนะ |
| `legal-help-prep-guard` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `legal-help-prep-trigger` | 1.00 | 0.67 | +0.33 | ผ่าน |  |
| `new-job-first-90-days-behaviour` | 0.00 → 1.00 | 0.00 | +1.00 | ผ่าน | รอบ 2: skill ใส่เลขบัตรแค่ 4 ตัวท้ายแม้ผู้ใช้ขอเอง · ชี้ พ.ร.บ.คุ้มครองแรงงาน |
| `new-job-first-90-days-guard` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `new-job-first-90-days-trigger` | 1.00 | 0.33 | +0.67 | ผ่าน |  |
| `study-drill-behaviour` | 0.33 → 0.67 | 0.00 | +0.67 | ยังไม่ผ่าน | รอบ 2: โน้ตในโจทย์เดิมเฉลยคำตอบเอง จึงเปลี่ยนเป็น EBS · ยังตก 1/3 รอบที่เฉลยตรง ๆ |
| `study-drill-guard` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `study-drill-trigger` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `task-board-behaviour` | 1.00 | 0.50 | +0.50 | ผ่าน |  |
| `task-board-guard` | 1.00 | 1.00 | +0.00 | ผ่าน |  |
| `task-board-trigger` | 1.00 | 0.00 | +1.00 | ผ่าน |  |
