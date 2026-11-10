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

## ยังไม่ได้รันรอบแดง/เขียว (2026-11-10)

skill ใหม่ด้านล่างมีเคสครบ 3 ชุดแล้ว แต่**ยังไม่ได้รันรอบแดง/เขียว** ตาม `skill-authoring` · รอผู้ใช้อนุมัติค่า eval ก่อนรัน · ใช้ `-guard` ไม่ใช่ `-regression` เพราะยังไม่เคยเห็นอาการพลาดจริง

| skill | เคสที่มี | สถานะ | คำสั่งเมื่ออนุมัติ |
|---|---|---|---|
| `task-board` | `-trigger` · `-behaviour` · `-guard` | ยังไม่ได้รัน | `node scripts/evals/plugin-eval.mjs personal-life --only "^task-board-" --max-cost-usd 5` |
| `study-drill` | `-trigger` · `-behaviour` · `-guard` | ยังไม่ได้รัน | `node scripts/evals/plugin-eval.mjs personal-life --only "^study-drill-" --max-cost-usd 5` |
| `new-job-first-90-days` | `-trigger` · `-behaviour` · `-guard` | ยังไม่ได้รัน | `node scripts/evals/plugin-eval.mjs personal-life --only "^new-job-first-90-days-" --max-cost-usd 5` |
| `job-exit` | `-trigger` · `-behaviour` · `-guard` | ยังไม่ได้รัน | `node scripts/evals/plugin-eval.mjs personal-life --only "^job-exit-" --max-cost-usd 5` |
| `legal-help-prep` | `-trigger` · `-behaviour` · `-guard` | ยังไม่ได้รัน | `node scripts/evals/plugin-eval.mjs personal-life --only "^legal-help-prep-" --max-cost-usd 5` |
