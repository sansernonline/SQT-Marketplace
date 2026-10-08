# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

1 โฟลเดอร์ = 1 GPT หรือ Gem (`<plugin>/<บทบาท>/`)

1. คัดลอก `instructions.md` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน `knowledge/` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน 8000 ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions → ย้ายเนื้อหาไปไว้ใน `knowledge/00-role.md`:
`software-company/business-analyst`, `software-company/clinical-data-analyst`, `software-company/data-engineer`, `software-company/developer`, `software-company/devops-engineer`, `software-company/fintech-compliance-officer`, `software-company/hipaa-officer`, `software-company/insurance-compliance-officer`, `software-company/product-manager`, `software-company/project-manager`, `software-company/qa-tester`, `software-company/quant-analyst`, `software-company/recommendation-engineer`, `software-company/revops-analyst`, `software-company/security-engineer`, `software-company/seo-specialist`, `software-company/solution-architect`, `software-company/system-analyst`, `software-company/technical-writer`

ข้อจำกัด: หน้าเว็บรันสคริปต์ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
