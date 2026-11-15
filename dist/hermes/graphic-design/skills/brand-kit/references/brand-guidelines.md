# Brand guidelines — เอกสารแนวทางแบรนด์ฉบับเต็ม

ส่วนยาวของหัวข้อ "เขียนเป็นเอกสาร" ใน `SKILL.md` · ใช้เมื่อองค์กรหรือทีมต้องมีคู่มือเต็ม: น้ำเสียง ข้อความหลัก กติกาอนุมัติงาน การเก็บไฟล์ หรือต้องซิงก์สีเข้า token

> **กฎข้อเดียว:** แนวทางแบรนด์ต้องเป็นไฟล์เดียว `docs/brand-guidelines.md` ที่ทุกคนและทุก agent อ่านจากที่เดียว · สีและฟอนต์ในนั้นเป็นต้นทาง ไฟล์ token ทำตามนั้น ไม่ใช่กลับกัน

ลอกและปรับจาก ui-ux-pro-max-skill (MIT · commit `b7d5353` · ดู 2026-11-05) · เนื้อต้นฉบับอังกฤษคงไว้ที่ `data/upstream/` ไม่แก้ · สัญญาอนุญาต `data/upstream/LICENSE`

## เลือกงานให้ถูก

| งาน | ใช้ |
|---|---|
| ร้านเล็ก ต้องการชุดแบรนด์อ่านจบใน 5 นาที (โลโก้ 4 แบบ สีตามบทบาท ฟอนต์ไทย) | `SKILL.md` ส่วน Workflow |
| องค์กรหรือทีมที่ต้องมีคู่มือเต็ม: น้ำเสียง ข้อความหลัก กติกาอนุมัติงาน การเก็บไฟล์ | ไฟล์นี้ |
| อ่านโค้ดที่มีอยู่แล้วสรุปเป็น token | `ui-craft` → `design_tokens.py` (plugin `software-development`) |
| เขียน token สามชั้นและสร้าง CSS | `design-system` (plugin `software-development`) |
| ตรวจคอนทราสต์ของคู่สี | ตารางตัวอย่างใน `SKILL.md` |

## ขั้นตอน

1. **เริ่มจากแม่แบบ** `templates/brand-guidelines-starter.md` → คัดลอกเป็น `docs/brand-guidelines.md` แล้วเติมข้อมูลจริงของแบรนด์ · ข้อมูลที่ยังไม่มีใส่ `(รอยืนยัน)` ไม่แต่งเอง
2. **เติมทีละหัวข้อ** ตามตารางด้านล่าง · อ่านไฟล์ต้นฉบับเฉพาะหัวข้อที่กำลังทำ
3. **สีและฟอนต์เป็นตัวเลขที่ตรวจได้** · ฟอนต์ไทยเลือกตาม `thai-fonts.md` ไม่ใช้ตัวอย่างฟอนต์อังกฤษของต้นฉบับกับงานไทย
4. **ซิงก์เข้า token** (เมื่อมีแอปหรือเว็บ): `node scripts/sync-brand-to-tokens.cjs` → ได้ `assets/design-tokens.json` · สร้าง `design-tokens.css` ให้อัตโนมัติถ้า skill `design-system` ติดตั้งอยู่ข้างกัน ไม่มี → สคริปต์เตือนและเขียนแค่ JSON · มี token หรือ `:root` เดิมในโปรเจกต์ สคริปต์หยุดและรายงาน ไม่เขียนทับ (`--force` เฉพาะไฟล์ที่ซิงก์เองรอบก่อน)
5. **ตรวจงานก่อนส่ง:** `node scripts/validate-asset.cjs <ไฟล์>` (ชื่อไฟล์ ขนาด ชนิด) · `node scripts/extract-colors.cjs <ภาพ>` เทียบสีภาพกับพาเลตต์ · `node scripts/inject-brand-context.cjs` พิมพ์สรุปแบรนด์ไว้แปะใน prompt ของ agent

สคริปต์ทั้ง 4 อยู่ใน `scripts/` ของ skill `brand-kit` เป็น Node ไม่ติดตั้งแพ็กเกจเพิ่ม ไม่ต่อเน็ต · อ่านและเขียนไฟล์ตามโฟลเดอร์ที่รัน (ราก project) ไม่ใช่โฟลเดอร์ skill

## หัวข้อและไฟล์ต้นฉบับ

| หัวข้อ | ไฟล์ใน `data/upstream/` |
|---|---|
| น้ำเสียง | `voice-framework.md` |
| ข้อความหลัก | `messaging-framework.md` |
| ภาพลักษณ์ | `visual-identity.md` · `logo-usage-rules.md` |
| สีและตัวอักษร | `color-palette-management.md` · `typography-specifications.md` |
| ไฟล์งานและการอนุมัติ | `asset-organization.md` · `approval-checklist.md` |
| ตรวจความสม่ำเสมอ | `consistency-checklist.md` |
| ปรับแบรนด์แล้วซิงก์ทุกที่ | `update.md` |
| โครงเอกสาร | `brand-guideline-template.md` |

## ข้อจำกัดที่ต้องรู้

- ต้นฉบับเขียนภาษาอังกฤษและตัวอย่างเป็นสีฟ้า-ม่วงแบบ SaaS · ใช้เป็นโครงเท่านั้น สีจริงมาจากแบรนด์ (`no-ai-look` ข้อ 1)
- `update.md` เป็นคำสั่งของ ClaudeKit ต้นทาง (`/brand update`) ยังไม่มีคำสั่งนี้ใน marketplace เรา ให้ทำตามขั้นตอนในไฟล์ด้วยมือ
- ไม่มีตัวสร้างโลโก้หรือไอคอน — เจ้าของเลือกไม่ใช้งานที่ agent วาดเอง ถามหาตัวอย่างอ้างอิงก่อนเสมอ (`icon-design`)

## ตรวจก่อนส่ง

1. `docs/brand-guidelines.md` ไม่มีค่าที่ไม่ได้มาจากเจ้าของแบรนด์ (ไม่มีที่ไม่รู้ให้ `(รอยืนยัน)`)
2. ทุกคู่สีข้อความ/พื้นผ่าน 4.5:1 (ข้อความปกติ)
3. ถ้าซิงก์ token แล้ว เปิด `assets/design-tokens.json` เทียบสีกับเอกสาร 1 ครั้ง

## ที่มา

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/brand` · MIT · commit `b7d5353` · ดู 2026-11-05 · ไฟล์ใน `data/upstream/` `scripts/` `templates/` คัดลอกไม่แก้
