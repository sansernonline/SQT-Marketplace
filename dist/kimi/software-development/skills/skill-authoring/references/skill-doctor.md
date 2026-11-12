# Reading /skill-doctor output

Moved from SKILL.md section 8. "หัวข้อ 4" means the wiring list in [`wiring-and-validator`](wiring-and-validator.md).

## 8 · อ่านผล `/skill-doctor`

- `/skill-doctor` (Claude Code 2.1.252 ขึ้นไป · ในโหมดโต้ตอบเปิดแท็บ Stats ของ `/plugin` · โหมด `-p` พิมพ์เป็นข้อความ) บอกต้นทุน context ของแต่ละ skill และจำนวนครั้งที่ถูกเรียก พร้อมธง **ไม่เคยถูกเรียก** = อยู่ในรายการแต่ไม่เคยเปิดเลย · เริ่มดูจากตัวที่ธงขึ้นและกิน context มากที่สุด (`จากแหล่ง` หน้า skills · ช่วงเวลาที่นับยังไม่ได้ตรวจ)
- skill ของเราไม่เคยถูกเรียก ไล่ตามลำดับ: (1) YAML พังไหม → รัน validator (2) description บอก "ใช้เมื่อ" ด้วยคำที่ผู้ใช้พิมพ์จริงไหม → แก้แล้วรันเคส `-trigger` (3) hook router มีแถวไหม → หัวข้อ 4 (4) งานนั้นเกิดจริงไหม → ไม่เกิดใน 1 เดือน ย้าย skill ไป plugin ที่งานนั้นอยู่ หรือยุบรวมกับตัวที่ใกล้กัน แล้วบันทึกใน CHANGELOG
- **เขียนไว้ใน settings ไม่เท่ากับติดตั้งแล้ว** — หลังติดตั้งให้เปิดแชตใหม่แล้วนับ skill ที่ agent เห็นจริง (คอร์ส 2026-11-04: 13 จาก 21 โต๊ะไม่มี `core` ทั้งที่แม่แบบเขียนชื่อไว้) · กฎ "ห้ามเด็ดขาด" อย่าให้อยู่แค่ใน skill เพราะ skill อาจไม่ถูกเรียก ใส่ใน hook หรือ CLAUDE.md ด้วย (ชั้นของตัวตรวจดู `repeated-mistakes-to-checks`)
- skill ของ plugin ปิดได้จาก `/plugin` เท่านั้น (`skillOverrides` ใน settings ใช้กับ skill ส่วนตัวและโปรเจกต์) · `/doctor` บอกต้นทุน context ของรายการทั้งชุด
