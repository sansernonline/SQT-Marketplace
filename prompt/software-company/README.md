# prompt/software-company — ชุดคำสั่งพร้อมวางของ plugin `software-company`

- **รายการไฟล์และวิธีใช้** อยู่ใน [`../README.md`](../README.md) หัวข้อ "วิธีใช้ (software-company)" ที่เดียว ไม่ลอกมาไว้ที่นี่
- **บล็อกกฎร่วม** `<!-- rules:begin -->` … `<!-- rules:end -->` ในทุกไฟล์ห้ามแก้ด้วยมือ — แก้ `RULES` ใน `scripts/sync/sync-prompt-rules.mjs` แล้วรัน `node scripts/sync/sync-prompt-rules.mjs` · กฎเฉพาะไฟล์วางใต้ `rules:end`
- **ไฟล์ใหม่** วาง `<!-- rules:begin -->` เว้น 1 บรรทัดว่าง แล้วตามด้วย `<!-- rules:end -->` ใต้หัวข้อ "วิธีใช้" จากนั้นรัน `node scripts/sync/sync-prompt-rules.mjs` ให้เติมกฎ · ถ้า marker 2 บรรทัดติดกันโดยไม่มีบรรทัดว่างคั่น script จะหาบล็อกไม่เจอ · เพิ่มไฟล์แล้วให้เพิ่มแถวในตาราง "รายการไฟล์" และ "เลือกจากสถานการณ์" ของ `../README.md` และแก้จำนวนไฟล์ที่นั่นด้วย
