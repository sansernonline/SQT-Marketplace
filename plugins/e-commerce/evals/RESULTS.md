# ผล eval ของ e-commerce

**ยังไม่ได้รัน** · เคสชุดแรกเขียนเมื่อ 2026-10-28 ยังไม่มีคะแนน ตารางผลจะต่อท้ายไฟล์นี้หลังรันครั้งแรก (ใหม่สุดอยู่ล่างสุด เหมือน `plugins/graphic-design/evals/RESULTS.md`)

## มีเคสอะไรบ้าง

5 skill ที่เกี่ยวกับเงิน ได้แก่ `promptpay-qr` · `payroll-th` · `doc-quotation` · `marketplace-fees-pricing` · `tax-vat-th` · skill ละ 7 เคส รวม 35 เคส

| ชุด | tag | เคสต่อ skill | วัดอะไร | ควรผ่าน |
|---|---|---|---|---|
| กันถอยหลัง (regression) | `regression-suite` | `<skill>-trigger` `-trigger-2` `-trigger-3` (ควรเปิด) · `<skill>-trigger-negative` `-negative-2` `-negative-3` (ไม่ควรเปิด) | skill ถูกเปิดเมื่อควรเปิด และไม่ถูกเปิดเมื่อคำถามเป็นงานของ skill ข้างเคียง | เกือบ 100% ถ้าตกแปลว่า description หรือ skill ข้างเคียงเพิ่งพัง |
| ความสามารถ (capability) | `capability-suite` | `<skill>-behaviour` | agent เรียกสคริปต์ของ skill และตัวเลขในคำตอบตรงกับผลสคริปต์ · `tax-vat-th` ไม่มีสคริปต์ จึงวัดว่ากำหนดยื่นถูกและมีแหล่ง และไม่แต่งยอดหัก ณ ที่จ่าย | เริ่มที่ผ่านน้อยได้ ใช้ดูว่า skill ช่วยมากแค่ไหน |

ชื่อโฟลเดอร์ไม่ใช้ `-regression` เพราะ `validate-marketplace.mjs` สงวนชื่อนี้ไว้ให้อาการที่ agent พลาดจริงแล้วเท่านั้น ชุดนี้ยังไม่เคยรัน จึงแยกด้วย tag แทน · เคส "ไม่ควรเปิด" ตั้งชื่อแบบ `-trigger-negative` ตาม `plugins/software-company/evals`

ตัวเลขที่ใช้ตรวจในเคส behaviour ได้มาจากการรันสคริปต์ของ skill ด้วยโจทย์เดียวกันเมื่อ 2026-10-28 (บรรทัดคอมเมนต์บนสุดของแต่ละ `case.yaml` บอก input ไว้) · ถ้าแก้สคริปต์หรือ `rates.json` ให้รันสคริปต์ใหม่แล้วแก้ pattern ตาม · โจทย์ไม่มีอัตราภาษีที่ไม่มีใน SKILL.md

## วิธีรัน

ทุกคำสั่งเรียก `claude -p` จริง มีค่าใช้จ่าย ใส่ `--max-cost-usd` ทุกครั้ง · ตัวรันทำสำเนาที่ลบ `dependencies` ให้ (eval โหลด plugin ที่มี dependency ไม่ขึ้น) และลองเคส trigger 1 เคสก่อน ถ้า skill ไม่ถูกเปิดจะหยุดก่อนรันทั้งชุด

```
# ทีละ skill (7 เคส × 3 รอบ × 2 แขน)
node scripts/evals/plugin-eval.mjs e-commerce --only "^payroll-th-" --max-cost-usd 5

# แยกชุด
node scripts/evals/plugin-eval.mjs e-commerce --tag regression-suite --max-cost-usd 15
node scripts/evals/plugin-eval.mjs e-commerce --tag capability-suite --allow-tools Write Bash --max-cost-usd 10
```

- เคส behaviour ต้องให้ agent เขียนไฟล์ input และรัน `node` จึงต้องมี `--allow-tools Write Bash` · Bash ใน eval รันใต้ sandbox ซึ่ง Windows ไม่มี ให้รันใน WSL2
- ค่าใช้จ่ายโดยประมาณ: graphic-design 20 เคส × 3 รอบ × 2 แขน ราว 16 ดอลลาร์ (2026-10-26) ชุดนี้ 35 เคสจึงน่าจะราว 28 ดอลลาร์ (อนุมาน ยังไม่ได้วัด)
- `--tag` มีใน `claude plugin eval --help` (ดู 2026-10-28) แต่ยังไม่ได้ลองว่ากรองตาม `tags:` ใน case.yaml ตามที่คาด ถ้าไม่กรองให้ใช้ `--only` แทน

## อ่านผลอย่างไร

- **รายงาน pass^3 ไม่ใช่ pass@3** · pass^3 คือผ่านครบทั้ง 3 รอบ ส่วน pass@3 คือผ่านอย่างน้อย 1 รอบ · เคสที่ผ่านรอบละ 75% ได้ pass^3 ราว 42% (0.75³) ผู้ขายที่ใช้จริงเจอแบบ pass^3
- **ส่วนต่างที่เชื่อได้ต้องมีเคสพอ** · ต้องมีอย่างน้อย 10 เคส × 3 รอบต่อ skill จึงเห็นส่วนต่างราว 20 จุดเปอร์เซ็นต์ที่ใหญ่กว่าช่วงคลาดเคลื่อน · ตอนนี้มี 7 เคสต่อ skill จึงยังใช้ดูแนวโน้มเท่านั้น
- สูตรช่วง p ± 1.96 × √(p(1−p)/n) ใช้ไม่ได้เมื่อ p = 0 หรือ 1 ให้รายงานจำนวนเคสและรอบกำกับทุกแถว เช่น `3/3 · n=3`
- เคสหลายข้อจากโจทย์เดียวกันไม่เป็นอิสระต่อกัน ช่วงจริงจึงกว้างกว่าสูตร
- grader แบบ `llm` ใช้โมเดลเป็นผู้ตัดสิน ยังไม่เคยเทียบกับคะแนนของคน ก่อนเชื่อผลให้สุ่มเทียบกับคนก่อน
- grader `tool_used` ของ Skill และของสคริปต์ตั้ง `arm: with-only` จึงรายงานเป็นตัวชี้วัด ไม่นับคะแนน ส่วนต่างระหว่างแขนมาจาก grader ผลลัพธ์

## ตารางผล

ยังไม่มี
