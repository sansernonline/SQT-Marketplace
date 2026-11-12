# Eval cases: 3 per new skill

Moved from SKILL.md section 6. "หัวข้อ 7" means [`before-after-testing`](before-after-testing.md). Template path `templates/ISSUES.md` is at `../templates/ISSUES.md` from here.

## 6 · eval — 3 เคสต่อ skill ใหม่ ในรูปแบบ `claude plugin eval`

เคสอยู่ที่ `plugins/<plugin>/evals/<skill>-<เคส>/case.yaml` · รูปแบบทางการและคำสั่งทั้งหมดใน [`eval-format`](eval-format.md) · ตัวอย่างจริง 3 ไฟล์ของ `human-writing` ใน `plugins/superuser/evals/` และ README ที่นั่นอธิบายการรัน

| เคส | พิสูจน์อะไร | grader หลัก |
|---|---|---|
| `<skill>-trigger` | โจทย์ที่ผู้ใช้พิมพ์จริง (ไม่เอ่ยชื่อ skill) ทำให้ skill ถูกเปิด | `tool_used` เครื่องมือ `Skill` จับชื่อ skill (`arm: with-only` เพราะรอบไม่มี plugin เปิดไม่ได้อยู่แล้ว) + grader ผลลัพธ์ 1 ตัวที่ให้คะแนนได้ · โจทย์ต้องเขียนโดยคนหรือ agent ที่ไม่เคยเห็น description (ชุดคำที่เคยเห็น hit@1 98.3% ชุดใหม่ 80% ในการจำลอง BM25 n=60 ไม่ใช่ Claude เลือกจริง · อ่านจากคอร์ส 2026-11-04) · วิธีวัดที่แน่นกว่านี้อยู่ใน `eval-format` |
| `<skill>-behaviour` | เปิดแล้วทำตามกฎหลัก 2–3 ข้อ | `regex` กับผล (`not_contains` คำต้องห้าม · `match` สิ่งที่ต้องมี) + `llm` เกณฑ์ที่ regex จับไม่ได้ |
| `<skill>-regression` | เรื่องที่ agent พลาดจริงในรอบแดง (หัวข้อ 7) หรือใน digest ของ `session-lessons-to-skills` ไม่กลับมา | `regex` ที่จับอาการเดิมตรง ๆ · เขียนอาการและวันที่ที่เห็นไว้ใน `description` ของเคส |

- **ชุดเคสต้องไม่ตาย** ทุกเคส "ต้องไม่เกิด" มีเคส "ต้องเกิด" คู่ · ไม่ปรับเคสให้เขียว · วงปรับตามคะแนนคงเกณฑ์ ไม่ลบเคสยาก ไม่เปลี่ยนผู้ตัดสินเพื่อให้ผ่าน · นำร่อง 3 รายการดูทุกแถวก่อนรันทั้งชุด · ปิดสำเนา plugin ที่ติดตั้งก่อนวัด · ปรับ judge กับป้ายคนก่อนเชื่อคะแนน — กติกาเต็มใน [`eval-loop-rules`](eval-loop-rules.md) · รับชุดที่ไม่ได้เขียนเองมาตรวจด้วย [`eval-audit`](eval-audit.md)
- **รอบแดงทำถูกอยู่แล้ว** → ตั้งชื่อเคส `<skill>-guard` ไม่นับเป็น 1 ใน 3 เคส · แดงทำถูกทุกโจทย์ → ย่อ skill เหลือสคริปต์กับข้อเท็จจริงที่โมเดลไม่รู้เอง แล้วถามผู้ใช้ว่าคงหรือเลิก · validator ล้มเมื่อ `case.yaml` ของ `-regression` เขียนว่ายังไม่เคยเห็นจริง

- โจทย์ต้องเป็นงานที่ agent ทำไม่ได้ดีโดยไม่มี skill — โจทย์ง่ายเกินไปทั้ง 2 รอบผ่านหมด วัดอะไรไม่ได้ (`จากแหล่ง` skill-creator) · ค่าเริ่มต้นรัน 3 รอบต่อเคส ทั้งรอบมี plugin และไม่มี แล้วรายงาน `WITH` `W/OUT` `Δ`
- เทียบฉบับแก้กับ git ref ด้วย `node scripts/evals/ab/ab-run.mjs --help` (baseline แคชตาม commit · คะแนนจาก regex) · ปรับ judge ด้วย `node scripts/evals/judge/calibrate.mjs --help`
- **ตัดสินว่ารุ่นใหม่ดีขึ้นด้วยตัวเลขที่ตั้งไว้ก่อน ไม่ใช่ด้วยตา** · ตรวจ grader regex ด้วย `scripts/evals/gate/grader-check.mjs` ก่อนใช้ token (คำตอบอ้างอิงผ่าน 100% · คำตอบที่ผิด 1 จุดตกข้อนั้นข้อเดียว) · แบ่งเคสเป็น train/val/test แล้วแก้จาก train เท่านั้น · ให้ `scripts/evals/gate/gate.mjs` ตัดสินจากความแกว่งของรอบซ้ำ (exit 0 รับ · 1 ไม่รับ · 2 เทียบไม่ได้) · จดสาเหตุลงสมุดปัญหาและแก้ไม่เกิน 3 จุดต่อรุ่น — ขั้นตอนเต็มใน [`optimize-loop`](optimize-loop.md) · แม่แบบ [`templates/ISSUES.md`](../templates/ISSUES.md)
- รัน: `node scripts/evals/plugin-eval.mjs <plugin> --only "^<skill>-" --max-cost-usd 5` (plugin ที่มี `dependencies` โหลดไม่ขึ้นถ้ารัน `claude plugin eval` ตรง ๆ · รายละเอียดใน `eval-format`) · ใน CI เพิ่ม `--json results.json --threshold 0.8` และอ่าน exit code (0 ผ่าน · 1 ไม่ผ่าน · 2 ชนเพดานเงินหรือ auth)
- ใส่ `evals/results/` ใน `.gitignore` · ผลสรุปที่อยากเก็บลง `RESULTS.md` ของ plugin นั้น
- eval ของ repo (`scripts/evals/triggers` `speed` `coding`) เป็นคนละชั้น: วัดข้ามทุก plugin และเทียบ 2 รุ่นจาก git ref · ไม่แทนกัน (ความต่างใน README ของ `plugins/superuser/evals/`)
