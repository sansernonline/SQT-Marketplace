# Changelog — software-company

## 2.6.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- agent 13 ตัวที่ยาวเกิน 150 บรรทัด เหลือ 87–117 บรรทัด · เนื้อหาย้ายไป references/ ของ skill ที่เกี่ยวข้อง
- แก้ตัวอย่างโค้ดที่ผิด: SQL ต่อ string (data-engineer) · AND/OR (clinical-data-analyst) · rollup รันซ้ำแล้วนับซ้ำ และรับรู้รายได้เกิน 1 วัน (revops-analyst)
- ความปลอดภัย: rag-architecture มีหัวข้อความปลอดภัย · md_to_docx.py ไม่ต่อ path เข้าคำสั่ง PowerShell · build_deck.py ฝังได้เฉพาะรูปในโฟลเดอร์งาน · incident-response ต้องมีคนอนุมัติก่อนแก้ระบบจริง
- ค่าที่ไม่ตรงกันข้าม skill: เงินใช้ decimal ไม่ใช้ float · ระดับความรุนแรงของการรีวิวชุดเดียว · LCP 2.5 วินาที · รหัสผ่านขั้นต่ำ 15 ตัวตาม NIST SP 800-63B-4
- รุ่นภาษาและ runtime (Python · .NET · Node) ตรวจกับเว็บทางการ 2026-10-14 · เลิกเขียนชื่อรุ่นโมเดลตายตัว
- ย้ายตาราง/ตัวอย่างยาวจาก SKILL.md ไป references/ (architecture-patterns · seo-audit-checklist · llm-design · healthcare-design · iot-design · ui-craft · srs-writing · test-case-template ฯลฯ)
