# evals — ชุดวัดผลจริงของ SQT-Marketplace

ทุกชุดเรียก `claude -p` จริง ใช้บัญชีที่ล็อกอินอยู่ มีค่าใช้จ่าย · ผลรายรอบอยู่ใน `_to_delete/` · ตารางสรุปต่อท้าย `RESULTS.md` ของแต่ละชุด (ใหม่สุดอยู่ล่างสุด) · แก้ skill agent หรือ hook ที่กระทบทั้งทีมแล้วให้รันชุดที่เกี่ยวก่อนปล่อย

| ชุด | วัดอะไร | รันเมื่อ | ค่าใช้จ่ายโดยประมาณ | คำสั่งเริ่มต้น |
|---|---|---|---|---|
| [`triggers/`](triggers/README.md) | Claude เปิด skill ที่ควรเปิดไหม จากคำขอจริง 10 แบบ | แก้ description · ย้าย skill ข้าม plugin · เปลี่ยนรายการ skill กลาง · hook บอก skill | รอบละ $0.05–0.15 · 10 เคส × 2 รอบ ≈ $2–3 | `node scripts/evals/triggers/run-triggers.mjs --runs 2 --label <ชื่อรุ่น>` |
| [`speed/`](speed/README.md) | เวลา รอบคุย ค่าใช้จ่าย จำนวนลูกทีม และ test ที่ซ่อนไว้ ของ plugin 2 รุ่นบนงานเดียวกัน (t1–t5) | แก้ playbook · กติกาแบ่งงาน · ด่านของ hook · ระดับโมเดล | รอบละ $0.5–2.5 · t1 2 รอบ × 2 รุ่น ≈ $3 | `node scripts/evals/speed/run-bench.mjs --old <git ref> --tasks t1 --runs 2` |
| [`coding/`](coding/README.md) | คุณภาพโค้ด เต็ม 10 ต่องาน (ถูกต้อง · test ของทีม · สะอาด · ตามแบบแผน · รายงานจริง) 8 งาน c1–c8 | แก้ skill หรือ agent ที่เกี่ยวกับโค้ด | รอบละไม่เกิน `--budget` (ค่าเริ่ม $8) + ผู้ตัดสิน $1 · 1 งาน × 2 รุ่น ≈ $5–15 | `node scripts/evals/coding/run-coding.mjs --verify` (ฟรี) แล้ว `--old <git ref> --tasks c5` |
| [`review-recall/`](review-recall/README.md) | `reviewer` ของ superuser ชี้ข้อผิดที่ฝังไว้ได้กี่ข้อ (recall) ในงาน 8 ชิ้น 12 ข้อ · ให้คะแนนด้วยการเทียบไฟล์ บรรทัด และคำ ไม่ใช้ผู้ตัดสิน | แก้ `reviewer.md` · กฎใน `human-writing` · เปลี่ยนโมเดลหรือ effort ของ reviewer | 8 เคส × reviewer 1 ครั้ง · เพดาน `--budget` ครั้งละ $1 → ไม่เกิน $8 ต่อรอบ · ราคาต่อ token ดูหน้า Pricing ทางการ | `node scripts/evals/review-recall/run-review-recall.mjs --verify` (ฟรี) แล้ว `--run` |
| [`models/`](models/README.md) | model ไหนเหมาะกับขั้นไหน: คะแนน เวลา รอบคุย token ค่าใช้จ่าย ความคุ้ม ของ haiku · sonnet · opus · fable บนขั้น code · code-quality · review · plan (ใช้งานของ speed · coding · review-recall ซ้ำ) | เปลี่ยน model ประจำของ agent หรือขั้น | เพดานรวม `--budget-total` ค่าเริ่ม $20 · ประมาณ $12–24 ดู `--plan` | `node scripts/evals/models/run-models.mjs --plan` (ฟรี) แล้ว `--run` |
| [`dispatch/`](dispatch/README.md) | หัวหน้าทีม superuser แจกงานถูกไหม: ลูกทีมกี่ตัว (เทียบความกว้างของกราฟจาก `plan.mjs`) · model ระดับไหน · งานเสี่ยงไม่มี haiku · แบ่งคลื่นไม่เกิน 8 · บรรทัด `คาด:` · 8 เคส 2 แขน (มี plugin กับไม่มี) วัดจากแผน JSON ไม่ได้ลงมือจริง | แก้หัวข้อ 2 หรือ 5 ของ `superuser/SKILL.md` · ตารางระดับ model · `parallel-split-and-merge` | 8 เคส × 3 รอบ × 2 แขน บน sonnet ≈ $4.80 (ประมาณ) · เพดาน `--budget-total` ค่าเริ่ม $3 | `node scripts/evals/dispatch/run-dispatch.mjs --verify` (ฟรี) แล้ว `--plan` แล้ว `--run` |
| [`plugin-eval.mjs`](plugin-eval.mjs) | เคส `claude plugin eval` ใน `plugins/<plugin>/evals/` เทียบรอบมี skill กับไม่มี · ทำสำเนาที่ลบ `dependencies` เพราะ eval โหลด plugin ที่มี dependency ไม่ขึ้น · ลองเคส trigger 1 เคสก่อนรันทั้งชุด | เพิ่มหรือแก้ skill และเคส eval ของ plugin สาขา | 20 เคส × 3 รอบ × 2 แขน ราว 16 ดอลลาร์ (2026-10-26) · ตั้ง `--max-cost-usd` เสมอ | `node scripts/evals/plugin-eval.mjs <plugin> --only "^<skill>-" --max-cost-usd 5` |
| [`ab/`](ab/ab-run.mjs) | `ab-run.mjs`: baseline (git ref หรือไม่มี plugin) เทียบ working tree ผ่าน `claude -p --plugin-dir` · baseline แคชตาม commit รันใหม่เมื่อ ref ขยับ · คะแนนจาก regex · `installed-collision.mjs` ตรวจ plugin ที่ติดตั้งอยู่ (ใช้ร่วมกับ `plugin-eval.mjs`) | เทียบ description หรือ skill 2 ฉบับเร็ว ๆ ก่อนรันชุดเต็ม | ต่อเคสต่อรอบตามขนาดโจทย์ · มี `--max-cost-usd` · `--dry-run` ไม่เสียเงิน | `node scripts/evals/ab/ab-run.mjs --help` |
| [`judge/`](judge/calibrate.mjs) | `calibrate.mjs`: ปรับ LLM judge กับป้ายของคน · TPR · TNR · accuracy แยก train/dev/test · ตารางข้อที่ไม่ตรง · ไม่เรียก model | ก่อนเชื่อคะแนน grader `llm` | ฟรี | `node scripts/evals/judge/calibrate.mjs --help` |
| [`scorecard.mjs`](scorecard.mjs) | ชั้น 0 ของ [`docs/SKILL-SCORECARD.md`](../../docs/SKILL-SCORECARD.md): นับต่อ skill ว่ามีเคสเปิด · ไม่ควรเปิด · พฤติกรรม · สคริปต์ · แถววันหมดอายุ แล้วให้ระดับ D ถึง C พร้อมรายการ skill ที่ควรเขียนเคสก่อน | ทุก commit · ก่อนวางแผนเขียนเคส | ฟรี ไม่เรียก `claude` | `node scripts/evals/scorecard.mjs [--md <ไฟล์>] [--plugin <ชื่อ>]` |
| [`skill-grades.mjs`](skill-grades.mjs) | ชั้น 1–2 ของ SKILL-SCORECARD: อ่าน `aggregate-result.json` จาก `plugin-eval.mjs` (และผลรายรอบของ `triggers/`) แล้วให้ต่อ skill: recall · false trigger · อัตราผ่านพร้อมช่วง 95% Wilson · uplift พร้อมช่วง Newcombe · pass^k · ระดับ B หรือ A* · "ทำต่อ" (แก้ description · แก้เนื้อ · ตัด · รันเพิ่ม) · สูตรใน `speed/stats.mjs` | หลังรัน `plugin-eval.mjs` หรือ `triggers/` · audit หัวข้อ 13 | ฟรี ไม่เรียก `claude` | `node scripts/evals/skill-grades.mjs [--plugin <ชื่อ>] [--results <ไฟล์หรือโฟลเดอร์>] [--triggers <โฟลเดอร์>] [--md <ไฟล์>]` · `--self-test` |

## กติการ่วม

- **โหลด plugin ให้ครบ** — ทุกตัวรันส่ง `--plugin-dir` ของ plugin ที่เทียบพร้อม `superuser` จาก repo รุ่นเดียวกัน (`--plugin-dir` ไม่ติดตั้ง dependencies ให้ ตั้งแต่ superuser 2.0.0 ของกลางไม่อยู่ใน plugin สาขา) · `triggers` โหลดทุก plugin ใน `plugins/` อยู่แล้ว
- **รุ่นก่อน = git ref** — ตัวรันแตก worktree ออกมาที่ `_to_delete/` เอง แล้วลบตอนจบ · รุ่นหลังค่าเริ่ม = ไฟล์ในโฟลเดอร์ตอนนี้
- **ไม่โหลด plugin ที่ติดตั้งในเครื่อง** (`--setting-sources project`) ผลจึงมาจากไฟล์ใน repo เท่านั้น
- **ผลแกว่ง** — ตัดสินจริงใช้ 2 รอบขึ้นไป (triggers 3 · speed 5) · รอบเดียวใช้ดูแนวโน้ม
- ต้องมี Node 22 · Python 3 + `pytest` · `dotnet` และ `npm` สำหรับงาน coding บางงาน

## ผลล่าสุดอยู่ที่

- `triggers/RESULTS.md` · `speed/RESULTS.md` · `coding/RESULTS.md`
- บทสรุปที่มาของการแก้: `docs/research/skill-triggering.md` (triggers) · `docs/research/เร่งความเร็วงาน agent Claude Code.md` (speed)
