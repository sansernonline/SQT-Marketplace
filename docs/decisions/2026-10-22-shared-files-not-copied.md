# ของกลางไม่คัดลอกไปทุก plugin · 2026-10-22

สถานะ: accepted

## ตัดสินใจ

skill agent และ hook กลางอยู่ที่ plugin `superuser` ที่เดียว · plugin สาขาประกาศ `dependencies: ["superuser"]` แล้วใช้ร่วมกัน · `SKILL.md` ของสาขามีเฉพาะส่วนสาขา (playbook · agent · เกณฑ์ · รออนุมัติ) และบรรทัดแรกบอกให้เปิดแกนก่อน · คัดลอกเฉพาะ reference ของ `skills/superuser/` ที่ลิงก์ในสาขาต้องใช้ ด้วย `scripts/sync/sync-superuser.mjs`

## ทำไมไม่ใช้ทางที่ใครก็คาด

ทางปกติคือทุก plugin พึ่งตัวเองได้ — คัดลอกของกลางลงทุกตัว ติดตั้งตัวเดียวก็ครบ

- สำเนา 6 skill × 12 plugin ทำให้รายการ skill ของทุก session ยาว 49,564 ตัวอักษร เกินงบ 30,000 ของ Claude Code จนคำอธิบาย skill ถูกตัด และ hook ทำงานซ้ำ 12 ครั้งต่อเหตุการณ์ `จากแหล่ง` (`plugins/superuser/ADAPT.md` หัวข้อ "ทำไมของกลางไม่คัดลอกแล้ว" · ตั้งแต่ superuser 2.0.0)
- ตั้งแต่ 3.0.0 `SKILL.md` ของสาขาก็ไม่คัดลอกแกนด้วย — สำเนา 11 ไฟล์ × 50 KB เหลือส่วนสาขา 11–13 KB `จากแหล่ง` (ที่เดียวกัน)
- ต้นทุนที่ยอมรับ: ติดตั้ง plugin สาขาต้องติดตั้ง `superuser` ด้วย · ชุดใน `dist/` (zip ของ claude.ai · Codex · Gemini · Kimi) ไม่มีระบบ dependencies สคริปต์ build จึงยังใส่ของกลางลงทุกชุดและรวมแกน + ส่วนสาขาเป็น `SKILL.md` ไฟล์เดียว

## ขอบเขต

- ใช้กับ plugin ใน `plugins/` ที่ติดตั้งผ่าน Claude Code marketplace
- ไม่ใช้กับ `dist/` — ชุดแจกยังคัดลอกเพราะปลายทางไม่มี dependencies
- ของกลางแก้ที่ `plugins/superuser` ที่เดียว · `validate-marketplace.mjs` ตรวจว่าสำเนาใน plugin อื่นตรงต้นฉบับ

## ทบทวนเมื่อ

- Claude Code ขยายงบรายการ skill เกิน 30,000 ตัวอักษร หรือเลิกตัดคำอธิบาย
- marketplace ติดตั้ง dependencies ให้อัตโนมัติไม่ได้อีก หรือ `dist/` ได้ระบบ dependencies
