# scripts/evals/models — เทียบ model ต่อขั้นของทีม agent

อยากรู้ว่าขั้นไหนใช้ model ถูกลงได้โดยคุณภาพไม่ตก ขั้นไหนต้องใช้ตัวแรง → รันงานเดิมที่มีอยู่แล้วกับหลาย model แล้วเทียบ คะแนน เวลา รอบคุย token ค่าใช้จ่าย และความคุ้ม (คะแนน ÷ ดอลลาร์)
ไม่เขียนตัวรันใหม่ซ้ำ: เรียกงานและตัวให้คะแนนของ `speed/` · `coding/` · `review-recall/` ที่มีอยู่

## วัดอะไร

| ขั้น | งาน | คะแนน (เต็ม 10) |
|---|---|---|
| `code` | `speed/tasks/t1` แก้บั๊กวันที่ไทย | test ที่ซ่อนผ่านกี่ข้อ ÷ ทั้งหมด |
| `code-quality` | `coding/tasks/c5-csv-import` | `run-coding.mjs --score --no-judge` (ถูกต้อง · test ของทีม · สะอาด เต็ม 8) ปรับเป็นเต็ม 10 |
| `review` | `review-recall` เคส r1 r2 r3 | ข้อผิดที่ฝังไว้ที่ reviewer เจอ ÷ ทั้งหมด (เทียบข้อความ ไม่ใช้ผู้ตัดสิน) |
| `plan` | spec สั้นให้แตกงาน ([`plan-task.mjs`](plan-task.mjs)) | checklist 5 ข้อ ข้อละ 2: 3–6 ขั้น · ทุกขั้นมี "เสร็จเมื่อ" · ทุกขั้นระบุไฟล์ · ครอบคลุม csv เกณฑ์ รายงาน test README · ไม่เกิน 60 บรรทัด |

model: `claude-haiku-5-5` · `claude-sonnet-5-5` · `claude-opus-5-5` · `claude-fable-5-1` (ราคาจาก `plugins/superuser/skills/model-scorecard/references/prices.json`) · ทุกรอบส่ง `--model` และ `--effort` (ค่าเริ่ม `medium`) ไม่โหลด plugin จึงวัดตัว model ไม่ใช่ทีม

## คำสั่ง

```powershell
node scripts/evals/models/run-models.mjs --verify   # ฟรี: งานและตัวให้คะแนนพร้อมไหม
node scripts/evals/models/run-models.mjs --plan     # ฟรี: ตารางงาน ประมาณค่าใช้จ่าย ชุดที่อยู่ในงบ
node scripts/evals/models/run-models.mjs --run      # เสียเงิน: ต้องใส่ --run เอง
```

| ตัวเลือก | ค่าเริ่ม | ความหมาย |
|---|---|---|
| `--models` | ทั้ง 4 | เลือก model คั่นด้วย `,` |
| `--steps` | ทั้ง 4 | เลือกขั้น |
| `--skip` | — | ตัดบางช่อง เช่น `claude-fable-5-1:code-quality` (`--plan` พิมพ์ชุดแนะนำให้) |
| `--effort` | `medium` | ส่งเข้า `claude --effort` · `none` = ไม่ส่ง |
| `--budget-total` | 20 | เพดานรวมทั้งรอบ (ดอลลาร์) · ใช้ถึงเท่านี้แล้วข้ามช่องที่เหลือ |

## ค่าใช้จ่าย

- เพดานต่อครั้งเรียก (`--max-budget-usd`): code $3 · code-quality $5 · review $1 ต่อเคส · plan $1
- รันจากถูกไปแพง (haiku → fable) ช่องที่แพงสุดจึงถูกตัดก่อนเมื่อถึงงบ · เกินงบได้อย่างมากเท่าเพดานของช่องสุดท้ายที่กำลังรัน
- `--plan` ประมาณจาก $ ต่อครั้งบน sonnet ในผลเก่า (`speed/RESULTS.md` t1 · `coding/RESULTS.md` c5) × อัตราราคาเฉลี่ยถ่วงของ model ÷ sonnet · ผลเก่าไม่เก็บ token จึงสมมุติสัดส่วน token (cache อ่าน 85%) · `review` กับ `plan` ยังไม่เคยวัด ใช้ค่าสมมุติ · ตัวเลขผิดได้เป็นเท่าตัว
- ประมาณรอบแรก (2026-10-27) ทั้ง 16 ช่อง $24 เกินงบ $20 → ชุดแนะนำตัด fable ที่ code-quality กับ review เหลือ ≈ $12

## ผล

`RESULTS.md` ต่อท้ายทุกครั้งที่รัน: ตารางรายขั้น (model × คะแนน · เวลา · รอบคุย · token · $ · ความคุ้ม) แล้วสรุปว่าแต่ละขั้นควรใช้ model ไหน (คะแนนอยู่ในระยะ 1 จากสูงสุด แล้วเลือกตัวคะแนน ÷ $ สูงสุด) · ไฟล์รายรอบอยู่ `_to_delete/models/`

## ข้อจำกัด

- **รอบเดียวต่อช่อง** ดูแนวโน้มเท่านั้น ตัดสินเปลี่ยน model ของ agent ต้องรันซ้ำอย่างน้อย 2 รอบและดูหลายงานต่อขั้น
- งานละ 1 ชิ้น (review 3 เคส) ตัวแทนของขั้นได้แค่หยาบ ๆ
- `code-quality` ไม่มีผู้ตัดสิน (ไม่นับ "ตามแบบแผน" กับ "รายงานจริง") · `review` ไม่มีเลข token เพราะตัวรันเดิมไม่เก็บ
- `review` เรียก `run-review-recall.mjs --run` จึงต่อท้าย `review-recall/RESULTS.md` ด้วย (label `models-<model>`) · reviewer อาจใช้ model ตามที่ `reviewer.md` กำหนดแทน `--model` ตัวรันเดิมเตือนไว้ในผล
- ยังไม่เคยรันจริง ไม่รู้ว่า CLI รับ `--effort` กับทุก model หรือไม่ · `--verify` ไม่เรียก model จึงตรวจไม่ได้ (รันช่อง haiku plan ราว $0.00 ก่อนเป็นการลอง)
