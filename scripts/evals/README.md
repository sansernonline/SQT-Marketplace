# evals — ชุดวัดผลจริงของ SQT-Marketplace

ทุกชุดเรียก `claude -p` จริง ใช้บัญชีที่ล็อกอินอยู่ มีค่าใช้จ่าย · ผลรายรอบอยู่ใน `_to_delete/` · ตารางสรุปต่อท้าย `RESULTS.md` ของแต่ละชุด (ใหม่สุดอยู่ล่างสุด) · แก้ skill agent หรือ hook ที่กระทบทั้งทีมแล้วให้รันชุดที่เกี่ยวก่อนปล่อย

| ชุด | วัดอะไร | รันเมื่อ | ค่าใช้จ่ายโดยประมาณ | คำสั่งเริ่มต้น |
|---|---|---|---|---|
| [`triggers/`](triggers/README.md) | Claude เปิด skill ที่ควรเปิดไหม จากคำขอจริง 10 แบบ | แก้ description · ย้าย skill ข้าม plugin · เปลี่ยนรายการ skill กลาง · hook บอก skill | รอบละ $0.05–0.15 · 10 เคส × 2 รอบ ≈ $2–3 | `node scripts/evals/triggers/run-triggers.mjs --runs 2 --label <ชื่อรุ่น>` |
| [`speed/`](speed/README.md) | เวลา รอบคุย ค่าใช้จ่าย จำนวนลูกทีม และ test ที่ซ่อนไว้ ของ plugin 2 รุ่นบนงานเดียวกัน (t1–t5) | แก้ playbook · กติกาแบ่งงาน · ด่านของ hook · ระดับโมเดล | รอบละ $0.5–2.5 · t1 2 รอบ × 2 รุ่น ≈ $3 | `node scripts/evals/speed/run-bench.mjs --old <git ref> --tasks t1 --runs 2` |
| [`coding/`](coding/README.md) | คุณภาพโค้ด เต็ม 10 ต่องาน (ถูกต้อง · test ของทีม · สะอาด · ตามแบบแผน · รายงานจริง) 8 งาน c1–c8 | แก้ skill หรือ agent ที่เกี่ยวกับโค้ด | รอบละไม่เกิน `--budget` (ค่าเริ่ม $8) + ผู้ตัดสิน $1 · 1 งาน × 2 รุ่น ≈ $5–15 | `node scripts/evals/coding/run-coding.mjs --verify` (ฟรี) แล้ว `--old <git ref> --tasks c5` |
| [`review-recall/`](review-recall/README.md) | `reviewer` ของ superuser ชี้ข้อผิดที่ฝังไว้ได้กี่ข้อ (recall) ในงาน 8 ชิ้น 12 ข้อ · ให้คะแนนด้วยการเทียบไฟล์ บรรทัด และคำ ไม่ใช้ผู้ตัดสิน | แก้ `reviewer.md` · กฎใน `human-writing` · เปลี่ยนโมเดลหรือ effort ของ reviewer | 8 เคส × reviewer 1 ครั้ง · เพดาน `--budget` ครั้งละ $1 → ไม่เกิน $8 ต่อรอบ · ราคาต่อ token ดูหน้า Pricing ทางการ | `node scripts/evals/review-recall/run-review-recall.mjs --verify` (ฟรี) แล้ว `--run` |

## กติการ่วม

- **โหลด plugin ให้ครบ** — ทุกตัวรันส่ง `--plugin-dir` ของ plugin ที่เทียบพร้อม `superuser` จาก repo รุ่นเดียวกัน (`--plugin-dir` ไม่ติดตั้ง dependencies ให้ ตั้งแต่ superuser 2.0.0 ของกลางไม่อยู่ใน plugin สาขา) · `triggers` โหลดทุก plugin ใน `plugins/` อยู่แล้ว
- **รุ่นก่อน = git ref** — ตัวรันแตก worktree ออกมาที่ `_to_delete/` เอง แล้วลบตอนจบ · รุ่นหลังค่าเริ่ม = ไฟล์ในโฟลเดอร์ตอนนี้
- **ไม่โหลด plugin ที่ติดตั้งในเครื่อง** (`--setting-sources project`) ผลจึงมาจากไฟล์ใน repo เท่านั้น
- **ผลแกว่ง** — ตัดสินจริงใช้ 2 รอบขึ้นไป (triggers 3 · speed 5) · รอบเดียวใช้ดูแนวโน้ม
- ต้องมี Node 22 · Python 3 + `pytest` · `dotnet` และ `npm` สำหรับงาน coding บางงาน

## ผลล่าสุดอยู่ที่

- `triggers/RESULTS.md` · `speed/RESULTS.md` · `coding/RESULTS.md`
- บทสรุปที่มาของการแก้: `docs/research/skill-triggering.md` (triggers) · `docs/research/เร่งความเร็วงาน agent Claude Code.md` (speed)
