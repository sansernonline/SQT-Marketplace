# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build-targets.mjs (v2.0.0) — ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

หนึ่งโฟลเดอร์ = หนึ่ง GPT หรือ Gem (`<plugin>/<role>/`)

1. คัดลอก `instructions.md` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน `knowledge/` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน 8000 ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions ถูกย้ายเนื้อหาไปไว้ใน `knowledge/00-role.md` แทน:
`business-analyst`, `clinical-data-analyst`, `data-engineer`, `developer`, `devops-engineer`, `fintech-compliance-officer`, `hipaa-officer`, `insurance-compliance-officer`, `product-manager`, `project-manager`, `qa-tester`, `quant-analyst`, `recommendation-engineer`, `revops-analyst`, `security-engineer`, `seo-specialist`, `solution-architect`, `system-analyst`, `technical-writer`, `ux-designer`

ข้อจำกัด: หน้าเว็บรัน script ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
