# โครงในโฟลเดอร์โค้ด — ผังเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 1 · ผังรากอยู่ใน `project-doc-set` ข้อ 1 · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ที่นี่

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · โครง 15 หัวข้อ (references/readme-skeleton.md)
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  ARCHITECTURE.md        ← แผนที่โค้ด · มีเมื่อผังใน README เกิน 15 บรรทัดหรือระบบมีหลายส่วน (references/readme-skeleton.md)
  CONTRIBUTING.md        ← มีเมื่อหัวข้อร่วมพัฒนาใน README ยาวเกิน 5 บรรทัด
  LICENSE                ← repo เปิดสาธารณะหรือสัญญาจ้างระบุ
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ใน `SKILL.md` ข้อ 1)
  tests/                 ← บังคับใน .NET · Flutter (`test/`) · Node และ Python ใช้เก็บเฉพาะ integration และ e2e (unit test อยู่ข้างไฟล์โค้ด) — ตาราง stack อยู่ใน `SKILL.md` ข้อ 1
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```
