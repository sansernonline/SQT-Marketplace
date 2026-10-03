# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build-targets.mjs (v1.32.0) — ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

หนึ่งโฟลเดอร์ = หนึ่ง GPT หรือ Gem (`<plugin>/<role>/`)

1. คัดลอก `instructions.md` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน `knowledge/` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน 8000 ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions ถูกย้ายเนื้อหาไปไว้ใน `knowledge/00-role.md` แทน:
`business-analyst`, `developer`, `devops-engineer`, `product-manager`, `security-engineer`, `seo-specialist`, `solution-architect`, `system-analyst`, `technical-writer`, `data-engineer`, `llm-architect`, `ml-engineer`, `mlops-engineer`, `prompt-engineer`, `cro-specialist`, `ecommerce-engineer`, `inventory-specialist`, `recommendation-engineer`, `quant-analyst`, `game-designer`, `game-developer`, `live-ops-specialist`, `multiplayer-engineer`, `clinical-data-analyst`, `fhir-specialist`, `hipaa-officer`

ข้อจำกัด: หน้าเว็บรัน script ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
