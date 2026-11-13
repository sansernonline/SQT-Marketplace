# gate — ตัดสินว่า skill รุ่นใหม่ดีขึ้นจริงด้วยเกณฑ์ที่ตั้งไว้ก่อน

2 สคริปต์นี้ไม่เรียก model และไม่เสียเงิน ใช้คู่กับผลรันที่มีอยู่แล้ว · ขั้นตอนเต็มของวงปรับอยู่ใน `plugins/superuser/skills/skill-authoring/references/optimize-loop.md`

| สคริปต์ | ใช้เมื่อ | คำสั่ง |
|---|---|---|
| `grader-check.mjs` | ก่อนรัน eval ครั้งแรก และทุกครั้งที่แก้ grader · ตรวจว่า grader ชนิด `regex` ใน `case.yaml` ให้คำตอบอ้างอิงผ่านทุกข้อ และให้คำตอบที่จงใจผิด 1 จุดตกข้อนั้นข้อเดียว | `node scripts/evals/gate/grader-check.mjs <case.yaml> --good ref.md --bad <ชื่อ grader>=wrong.md` |
| `gate.mjs` | มีผลของรุ่นฐานกับรุ่นใหม่แล้ว · ให้คำตัดสิน รับ ไม่รับ หรือเทียบไม่ได้ | `node scripts/evals/gate/gate.mjs --base old.json --cand new.json --split split.json` |
| `gate.mjs --null` | ก่อนเริ่มแก้ · ดูว่ารุ่นเดียวกันรันซ้ำแล้วคะแนนแกว่งเท่าไร | `node scripts/evals/gate/gate.mjs --null old.json --split split.json` |

ทั้ง 2 ตัวมี `--self-test` · `--help` บอกตัวเลือกทั้งหมด

## ผลที่ gate อ่านได้

- ไฟล์ JSON จาก `claude plugin eval --json` หรือ `node scripts/evals/plugin-eval.mjs <plugin> --json <ไฟล์>` · ใช้แขน `with` (เปลี่ยนด้วย `--arm`) · ต้นทุนมี `cost_usd` และ `turns`
- โฟลเดอร์ `runs/` ของ `speed/run-bench.mjs` (ไฟล์ `<งาน>-<label>-<รอบ>.json`) · บอก label ด้วย `--base-label` และ `--cand-label` · คะแนน = test ที่ซ่อนไว้ที่ผ่าน · ต้นทุนมี `cost_usd` `turns` `tokens` `tool_calls` (จำนวนคำสั่งที่ agent เรียกต่อรอบ นับจาก transcript · ไฟล์ผลยังจดคำสั่งที่ล้มใน `toolErrors`) · ผลที่รันก่อน 2026-11-13 ไม่มี `tool_calls` ต้องรันใหม่
- เลือก `tool_calls` เมื่อ skill ตั้งใจลดคำสั่งที่เปลือง หรือราคาแทบไม่ขยับ (คอร์ส Skill Optimization: haiku ราคา $0.031–0.033 ต่อรอบ แม้คำสั่งต่างกัน 3 เท่า)

## ไฟล์ split

```json
{ "costMetric": "cost_usd",
  "splits": { "job-exit-behaviour": "train", "study-drill-behaviour": "val", "task-board-behaviour": "test" } }
```

- เคสที่ไม่อยู่ในรายการนับเป็น train · ไม่มีเคส val เลย gate จะไม่รับ เพราะตัดสินไม่ได้ว่า skill จำโจทย์ · เคส val น้อยกว่า 3 gate เตือนว่าเชื่อได้เฉพาะส่วนต่างที่ใหญ่
- `costMetric` ต้องเขียนก่อนวัดรุ่นใหม่ · gate ไม่ยอมให้ `--cost-metric` เปลี่ยนค่าที่ประกาศไว้
- gate จดรุ่นที่ตัดสินด้วยชุด val ไว้ใน `<split>.gate-log.jsonl` ข้างไฟล์ split · ครบ 3 รุ่นแล้วรุ่นที่ 4 ได้ exit 2 จนกว่าจะเพิ่มโจทย์ val ใหม่

## เกณฑ์ของ gate

- เกณฑ์ของแต่ละชุด = ค่าที่มากกว่าระหว่าง `--eps` (2 จุด) กับ `--z` (1.5) × ความแกว่งของส่วนต่าง 2 รุ่น · ความแกว่งคิดจากรอบซ้ำของเคสเดียวกันทั้ง 2 รุ่น
- ไม่รับเมื่อชุด train หรือ val ลดลงเกินเกณฑ์ของชุดนั้น · train ขึ้นแต่ val ลง = จำโจทย์ (overfit)
- รับเมื่อคะแนนรวม train+val ดีขึ้นเกินเกณฑ์ หรือไม่ลดเกินเกณฑ์และต้นทุนลดอย่างน้อย 10%
- ชุด test แสดงในตารางแต่ไม่ใช้ตัดสิน รันครั้งเดียวกับรุ่นสุดท้าย
- เทียบไม่ได้ (exit 2) เมื่อเคส × รอบไม่ตรงกัน · โจทย์หรือ grader ของเคสเดียวกันเปลี่ยนระหว่าง 2 รุ่น · model ต่างกัน · ไม่ได้ประกาศตัวชี้วัดต้นทุน
- ผ่านประตูไม่ใช่ข้อพิสูจน์ · ที่ z 1.5 รุ่นที่ไม่ต่างจริงยังหลุดผ่านได้ราว 7% (หางเดียวของการแจกแจงปกติ) · งานที่พลาดแล้วเสียหายมากใช้ `--z 2` (ราว 2%) และเพิ่มรอบ

exit: 0 รับ · 1 ไม่รับ · 2 เทียบไม่ได้

## ข้อจำกัด

- `grader-check.mjs` ตรวจได้เฉพาะ `regex` ที่ `target: last_message` และ `match` เป็น `contains` หรือ `not_contains` · grader `llm` ใช้ `judge/calibrate.mjs` · `tool_used` ต้องดูจาก trace
- regex ถูกคอมไพล์ด้วย RegExp ของ JavaScript · ส่วน `claude plugin eval` ใช้ engine อะไรยังไม่ได้ตรวจ · 30 grader ใน repo ใช้ `(?i)` ซึ่ง JavaScript ไม่รับ (นับ 2026-11-11) ต้องดูผลจริงของ eval ว่าเคสเหล่านั้นให้คะแนนอย่างไร
- gate ตรวจซ้ำให้ไม่ได้ ถ้าแก้ grader ต้องรันทั้ง 2 รุ่นใหม่ด้วย grader ชุดเดียวกัน

## ที่มา

ดัดแปลงจากคอร์ส CWN2026 สัปดาห์ 2 บท Skill Optimization (`skill-optimizer`) ของเจ้าของ repo · เรียบเรียงใหม่ 2026-11-11 · สูตรความแกว่งและประตูรับเขียนใหม่จาก `skillopt.py` ฟังก์ชัน `noise_of` `se_diff` `cmd_gate`
