# ผล eval ของ software-development

## 2026-11-12 · security-audit และ design-direction-lookup · เคสละ 3 รอบ (trigger 5 รอบ)

รันด้วย `scripts/evals/plugin-eval.mjs` บนสำเนาที่ลบ `dependencies` · รอบแรกตัวให้คะแนนหลายตัว error เพราะเขียน `(?i)` ในตัว regex (JavaScript ไม่รับ) จึงแก้แล้วรันซ้ำ

| เคส | รอบแรก มี · ไม่มี skill | หลังแก้ มี · ไม่มี skill | อ่านผล |
|---|---|---|---|
| `design-direction-lookup-behaviour` | 0.67 · 0.67 | 1.00 · 0.89 | รอบแรก grader `contrast-checked` error |
| `design-direction-lookup-regression` | 0.50 · 0.50 | 0.67 · 0.83 | รอบแรก grader error · รอบ 2 หมดเวลา 400 วินาที ขยายเป็น 700 · รอบ 3 ตก `font-licence-stated` 1 รอบ |
| `design-direction-lookup-trigger` | 0.00 · 0.00 | 1.00 · 1.00 | เดิม `count:6` นับเท่ากันพอดี คำตอบมีสี 36 ค่าจึงตก · เปลี่ยนเป็นอย่างน้อย 6 |
| `security-audit-regression` | 0.50 · 0.50 | 1.00 · 1.00 | รอบแรก grader error |
| `security-audit-trigger` | 0.80 · 0.00 | 1.00 · 0.00 | skill ช่วยชัด |
| `security-audit-behaviour` | 0.00 · 0.00 | 0.00 · 0.00 | ไม่ได้ให้ Write · หาโฟลเดอร์ `resources/shop-api` ไม่เจอเพราะ `add_dirs` ไม่คัดลอกเข้าโฟลเดอร์ที่รัน · เพิ่ม `fixture.sh` แล้ว **ยังไม่ได้รันยืนยัน** (รอบที่ 4 ถูกหยุดเพราะหน่วยความจำเครื่องไม่พอ) |

ค่าใช้จ่ายรวมของ plugin นี้ในวันนั้นราว $22 (รอยืนยัน) · เคส `-existing` 10 เคสที่วาง `add_dirs` ไว้ใต้ `execution:` ถูกย้ายไปใต้ `context:` และได้ `fixture.sh` · ยังไม่ได้รันยืนยัน
