# evals ของ plugin superuser — วัดทีละ skill ด้วย `claude plugin eval`

เคสละ 1 โฟลเดอร์ `evals/<skill>-<เคส>/case.yaml` ในรูปแบบทางการของ Claude Code (schema 1.1 · ตรวจเอกสาร 2026-10-23 · รายละเอียดช่องและ grader ใน `skills/skill-authoring/references/eval-format.md`) · skill ใหม่ทุกตัวมี 3 เคส: `-trigger` (ถูกเปิดไหม) · `-behaviour` (ทำตามกฎหลักไหม) · `-regression` (เรื่องที่เคยพลาดไม่กลับมา)

## รัน

```
claude plugin eval plugins/superuser --trust-plugin --no-publish --max-cost-usd 5            # ทุกเคส
claude plugin eval plugins/superuser --trust-plugin --case "human-writing-*" --no-publish      # skill เดียว
claude plugin eval plugins/superuser --trust-plugin --json _to_delete/eval.json --threshold 0.8 --no-publish --max-cost-usd 20   # CI
```

- รันจากรากของ repo · ต้อง Claude Code 2.1.269 ขึ้นไป · ใช้บัญชีที่ล็อกอินอยู่ มีค่าใช้จ่าย (เคสละ 3 รอบ × 2 แขน)
- ทุกเคสรัน 2 แขน: มี plugin และไม่มี plugin · ผลบอก `WITH` `W/OUT` `Δ` · `Δ` ใกล้ 0 = โจทย์ง่ายเกินไป หรือ skill ไม่ได้ช่วย ทั้ง 2 อย่างต้องแก้
- แต่ละรอบเป็น home ว่าง ไม่มี CLAUDE.md ไม่มี auto memory ไม่มี plugin อื่น เห็นแต่ `plugins/superuser` · hook ของ plugin ยังทำงาน · เครื่องมือเขียนไฟล์และ Bash ต้องเปิดด้วย `--allow-tools` และ Bash บน Windows ต้องรันใน WSL2 (ไม่มี sandbox) — เคสที่นี่ใช้แค่เครื่องมืออ่านจึงรันบน Windows ได้
- ผลลง `evals/results/<timestamp>/` (`aggregate-result.json` + `report.html`) · โฟลเดอร์นี้ต้องอยู่ใน `.gitignore` (ยังไม่ได้เพิ่ม · รอผู้ดูแล) · ผลที่อยากเก็บสรุปลง `RESULTS.md` ที่นี่ บรรทัดละรอบ
- exit code: 0 ผ่าน · 1 มีเคสไม่ถึง threshold หรือโหลดไม่ได้ · 2 รันไม่ครบ (เงินหรือ auth)

## ต่างจาก `scripts/evals/` ของ repo อย่างไร

| | `plugins/<plugin>/evals/` (ที่นี่) | `scripts/evals/` (`triggers` · `speed` · `coding` · `review-recall`) |
|---|---|---|
| วัดอะไร | skill 1 ตัวทำตามกฎไหม เทียบกับไม่มี plugin | ทั้งทีม: skill ถูกเปิดข้ามทุก plugin · เวลาและค่าใช้จ่ายของ playbook · คุณภาพโค้ด |
| รูปแบบ | `case.yaml` ทางการ · `claude plugin eval` รันและให้คะแนน | `cases.json` และสคริปต์ `run-*.mjs` ของเราเอง เรียก `claude -p` เอง |
| เทียบกับอะไร | รอบไม่มี plugin (ตัวรันทำให้) | รุ่นก่อนจาก git ref (ตัวรันแตก worktree เอง) |
| โหลด plugin | เฉพาะ plugin ที่ชี้ · ไม่ตาม `dependencies` | ทุก plugin ใน `plugins/` หรือ `--plugin-dir` ที่ระบุ |
| รันเมื่อ | สร้างหรือแก้ skill ตัวนั้น | แก้ของที่กระทบทั้งทีม (description หลายตัว · hook · playbook · ระดับโมเดล) |

เคสที่นี่ไม่แทน `scripts/evals/triggers` — ตัวนั้นเห็น skill ทุก plugin พร้อมกันจึงจับการแย่งกันระหว่าง skill ได้ ส่วนเคส `-trigger` ที่นี่เห็นแค่ plugin เดียว

## เคสที่มี

| skill | เคส | พิสูจน์ |
|---|---|---|
| `human-writing` | `human-writing-trigger` | โจทย์เขียนอีเมลภาษาไทย (ไม่เอ่ยชื่อ skill) เปิด `human-writing` และคำตอบไม่มีอีโมจิ |
| `human-writing` | `human-writing-behaviour` | รายงานสถานะไทย: ข้อสรุปขึ้นก่อน · ไม่มีคำฟุ่มเฟือย (ทำการ · มีการ) · ไม่มีอีโมจิ · ตัวย่อเขียนเต็มครั้งแรก |
| `human-writing` | `human-writing-regression` | ย่อข้อความแล้วคำทำหน้าที่และคำสุภาพยังอยู่ (กฎ "ตัดรายการ ไม่ตัดคำทำหน้าที่" ที่เพิ่ม 2026-10-22 หลังพลาดจริง) |

`(ยังไม่ได้ตรวจ)` ยังไม่ได้รันชุดนี้จริงบนเครื่องนี้ — รูปแบบไฟล์ตรงเอกสาร แต่ผลคะแนนรอบแรกยังไม่มี
