# โครงในโฟลเดอร์โค้ด — ผังเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 1 · ผังรากอยู่ใน `project-doc-set` ข้อ 1

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · ติดตั้ง · รัน · test
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  docs/decisions/ADR-0001-<slug>.md  ← ADR และ runbook เปลี่ยนพร้อมโค้ด จึงอยู่ใน repo (ชื่อตาม document-naming)
  docs/runbook-<เรื่อง>.md            ← ไฟล์ละเรื่อง
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ในตารางล่าง)
  tests/
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```
