# Changelog — personal-life

## Unreleased

- รับ skill `meeting-summary` · `meeting-prep-card` จาก `doc-toolkit` ที่ยุบ (เนื้อหาเดิม ชื่อเดิม) · ตัด dependency `doc-toolkit`
- รวม plugin dev-learning: skill 9 ตัว (+alias 2) · agent tech-mentor · playbook 5 ตัว · prompt 6 ฉบับ — หมวดที่ 5 "เรียนรู้" ใน `skills/superuser/SKILL.md` (กฎ 18–19 · เกณฑ์ · รออนุมัติ) · triggers · examples · context-template

## 0.11.1 — 2026-10-22

- ตรวจ plugin ตามหัวข้อ 1–6 · 8: แก้ตัวชี้ผิดใน `superuser/references/examples.md` ให้ไปที่แกน `superuser:superuser` · ติด (รอยืนยัน) ที่ Cambodia ใน `travel-facts` · ค่าธรรมเนียมพาสปอร์ตใน `travel-prep` ลิงก์ไป `travel-facts` ที่เดียว

## 0.11.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)

## 0.10.0 — 2026-10-21

- `meeting-prep-card` ย้ายไปเป็นของกลางใน plugin `superuser` (คู่กับ `meeting-summary`)

## 0.9.0 — 2026-10-21

- `meeting-summary` · `polite-message-th-en` ย้ายไปเป็นของกลางใน plugin `superuser` · ใช้ได้เหมือนเดิมทาง `dependencies`

## 0.8.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)

## 0.7.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- meeting-summary ร่างข้อความ ส่งเมื่อผู้ใช้สั่ง · inbox-triage มีกฎอีเมลเป็นข้อมูล
- ข้อมูลการเดินทาง (ไต้หวัน) ตรวจใหม่ 2026-10-14

## 0.12.0 (2026-10-22)

- รวม `home-family` `health-wellness` และ `career` เข้ามาเป็น plugin เดียว — ชีวิตประจำวัน 4 หมวด: จัดการชีวิต · บ้านและครอบครัว · สุขภาพ · อาชีพ
- ชื่อ skill และ command เดิมทุกตัวใช้ได้เหมือนเดิม · playbook ทุกหมวดรวมอยู่ใน skill `superuser`
- ถอด plugin เดิม: `/plugin uninstall home-family` `health-wellness` `career`

## ประวัติจาก dev-learning (รวมเข้ามา 2026-10-22)

### 0.9.1 — 2026-10-22

- ย้ายตัวอย่าง gap map และแม่แบบแผนของ cert-prep ไป references (ลด 955 ตัวอักษรต่อการเรียก) · ตัดค่า (รอยืนยัน) ของ SAA/CKA/CKAD ที่ตรวจกับเว็บทางการแล้ว 2026-10-22 · แก้ตัวชี้ใน examples/triggers

### 0.9.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)

### 0.8.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)

### 0.7.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- tech-mentor กับ cert-prep งบเวลาไม่ขัดกัน · แก้ `$ARGUMENTS` ใน radar · ขนาดใน paper-to-practice ตรงกับโค้ด
