# `/verify` ที่มากับ Claude Code — กับ app-verifier ของเรา

ที่มา: code.claude.com/docs/en/skills (อ่าน 2026-10-23) · ตัวเลขรุ่นที่อ้างมาจากหน้านั้น ไม่ได้ทดสอบกับทุกรุ่น

## สิ่งที่ Claude Code มีอยู่แล้ว

- skill ติดเครื่อง 3 ตัวทำงานด้วยกัน: `/run` เปิดและขับแอปให้เห็นว่าการแก้ใช้ได้ · `/verify` build แล้วรันแอปเพื่อยืนยันว่าโค้ดที่แก้ทำสิ่งที่ควรทำ โดยไม่ถอยไปพึ่ง test หรือ type check · `/run-skill-generator` สอน 2 ตัวแรกว่า build และเปิดโปรเจกต์นี้อย่างไร
- `/verify` และ `/code-review` รันเมื่อผู้ใช้เรียกเท่านั้น (ตั้งแต่ v2.1.215 — ก่อนหน้านั้น Claude เรียกเองได้)
- `/run-skill-generator` รันจาก environment สะอาด จดสิ่งที่ใช้ได้จริง (คำสั่งติดตั้ง · env · สคริปต์เปิด) แล้ว commit เป็น skill ของโปรเจกต์ที่ `.claude/skills/run-<name>/` — รันครั้งเดียวต่อโปรเจกต์ และอีกครั้งเมื่อวิธี build เปลี่ยน
- `/verify` จดสูตรของตัวเองได้: ถ้าไม่มีสูตร มันเขียนสิ่งที่ใช้ได้ลง `.claude/skills/verify/SKILL.md` ที่รากโปรเจกต์ (monorepo: ในโฟลเดอร์ package ที่แตะ) · **skill ที่รากชื่อ `verify` แทนที่ `/verify` ติดเครื่อง**
- session ที่เริ่มโดยมี skill ชื่อ `verify` หรือ `simplify` ของโปรเจกต์ (หรือส่วนตัว · องค์กร · `.claude/commands/`) → คำสั่ง commit ของ Claude Code สั่งให้รันก่อนทุก commit ยกเว้นแก้เฉพาะเอกสารหรือ test · ตัวติดเครื่อง · plugin skill · skill จาก claude.ai ไม่นับ
- ปิดทั้งชุดได้ด้วย `disableBundledSkills` (เหลือ `/doctor`)

## สิ่งที่ `app-verifier-setup` เพิ่มให้

| ของเรา | ตัวติดเครื่องไม่มี |
|---|---|
| สัญญาสำหรับทดสอบในแอป: `data-testid` · `data-ready` · reset endpoint ใต้ flag · นาฬิกาล็อกได้ (`clock`) | มันขับแอปจากสิ่งที่เห็น ไม่ได้บังคับให้แอปเตรียมที่ยึด |
| แผนที่ฟีเจอร์เป็นข้อมูลในสคริปต์ `test/e2e/verify.*` พิมพ์ `PASS/FAIL` พร้อม expected กับ actual · ตรวจ 0 รายการ = exit 1 | สูตรเป็นภาษาคนใน SKILL.md |
| พิสูจน์ว่าจับของผิดได้ (ทำให้พัง 1 จุด ต้อง FAIL) และ agent `qa-tester` ตัวใหม่ใช้ได้จริง | — |
| หลักฐานทุกรอบใน `_to_delete/verify-runs/` · ขับมือถือ native · CLI · API ได้ ไม่ใช่แค่เว็บ | — |

## ตัดสินใจ

**โปรเจกต์ที่ทำงานบน Claude Code ที่มี `/verify` ติดเครื่อง → `app-verifier-setup` สร้าง skill ของโปรเจกต์ที่ `.claude/skills/verify/SKILL.md` (ชื่อ `verify` ไม่ใช่ `verify-<โปรเจกต์>`) ในรูปแบบสูตรที่ `/verify` จดเอง** — ส่วนแรกคือสูตร build และเปิดแอป (แบบเดียวกับที่ `/run-skill-generator` จด) ต่อด้วยของเรา: คำสั่งรัน `test/e2e/verify.*` · ลิงก์แผนที่ฟีเจอร์ · สัญญาสำหรับทดสอบ · ข้อห้าม (หัวข้อ "SKILL.md ของ verify skill ต้องมี" ใน SKILL.md หลัก) · ได้ 2 อย่างฟรี: แทนที่ตัวติดเครื่อง และถูกรันก่อน commit อัตโนมัติ

- ก่อนเขียน ให้อ่าน `.claude/skills/verify/SKILL.md` หรือ `run-<name>/` ที่ `/verify` จดไว้แล้ว (ถ้ามี) แล้วเขียนต่อในรูปแบบเดียวกัน — ฟิลด์ frontmatter ที่ตัวติดเครื่องใช้ยังไม่ได้ตรวจจากเอกสาร (ยังไม่ได้ตรวจ)
- monorepo → วางในโฟลเดอร์ package ที่แตะ ตามกติกาของตัวติดเครื่อง
- Codex · Gemini หรือ Claude Code รุ่นก่อน v2.1.145 (ยังไม่ได้ตรวจว่า `/verify` เริ่มรุ่นไหน) → ใช้ชื่อเดิม `verify-<โปรเจกต์>` ใน `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` ดูแลไฟล์นี้ไฟล์เดียว ไม่สร้าง `verify-<โปรเจกต์>` ซ้อน
