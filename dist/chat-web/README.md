# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

1 โฟลเดอร์ = 1 GPT หรือ Gem (`<plugin>/<บทบาท>/`)

1. คัดลอก `instructions.md` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน `knowledge/` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน 8000 ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions → ย้ายเนื้อหาไปไว้ใน `knowledge/00-role.md`:
`e-commerce/learning-reviewer`, `e-commerce/reviewer`, `graphic-design/learning-reviewer`, `graphic-design/reviewer`, `personal-life/learning-reviewer`, `personal-life/reviewer`, `software-company/qa-tester`, `software-company/reverse-engineer`, `software-company/solution-architect`, `software-company/technical-writer`, `software-company/learning-reviewer`, `software-company/reviewer`, `superuser/learning-reviewer`, `superuser/reviewer`, `trading-finance/learning-reviewer`, `trading-finance/reviewer`

ข้อจำกัด: หน้าเว็บรันสคริปต์ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
