# Changelog — personal-life

## Unreleased

- prompt ใหม่ `prompt/personal-life/prompt-podcast-lesson.md` 5 ฉบับ: วางชุดบทเรียน (`course-builder`) · สคริปต์พูด 1 ตอนพร้อม show notes · สไลด์ประกอบที่ตรงกับสคริปต์ (`presentation-design` และ `html-slide-deck` ของ software-company) · อัดเสียง ตัดต่อ และเวอร์ชันวิดีโอ · ตรวจก่อนปล่อย
- `prompt-podcast-lesson.md` แก้ตามรอบทดสอบจริง (agent ตัวใหม่ทำฉบับ 1–3 กับบทเรียน Git 2 ตอน): ฉบับ 1 มีช่องเครื่องมือที่ผู้ฟังต้องใช้ · จำนวนตอนที่ผู้ใช้กรอกเป็นกรอบ · ส่งโครงตอนเป็น `outline.md` · ฉบับ 2 ใช้กฎภาษาพูดของ `speaking-script` · ตัวเลขเขียนเป็นเลขพร้อมคำอ่าน · บทพูดสรุปท้ายตอนได้แต่ show notes ไม่สรุปซ้ำ · ฉบับ 3 บันทึกผู้พูดต่อแผ่นชัดขึ้น · ไม่มี Playwright มีทางสำรอง · ทำวิดีโอด้วย `video-editing` (หัวข้อสไลด์กับเสียงบรรยาย) แทนอัดหน้าจอ · ตรวจตัวอักษรบนมือถือจริงแทนอ้างข้อที่ไม่ตรง · ฉบับ 4 ใช้ `video-editing` และ `subtitles-th`
- `prompt-podcast-lesson.md` ฉบับ 4: เสียงสังเคราะห์ใช้ `video-editing` ของ graphic-design (หัวข้อเสียงบรรยายจากสคริปต์) (ทำร่างด้วยเสียง Windows · ได้ซับและเวลาสไลด์จากการรันเดียว ไม่ต้องถอดเสียง)

## 0.13.0 — 2026-10-23

- skill ใหม่ `course-builder` ออกแบบหลักสูตรฝั่งผู้สอน (ฝั่งผู้เรียนยังเป็น `learning-path`): ผลลัพธ์การเรียนรู้ด้วยกริยาที่มองเห็นได้ตามอนุกรมวิธานของบลูมฉบับปรับปรุง (Krathwohl 2002) · ตารางสอนพร้อมเวลา · แบบฝึกจากพาทำไปจนทำเอง · rubric 3–4 ระดับพร้อมงานตัวอย่าง · แบบประเมินหลังอบรม · ออนไลน์กับในห้อง · ลิขสิทธิ์สื่อการสอน · ตัวอย่างหลักสูตร Git 1 วันที่รันคำสั่งจริงแล้ว · แนวคิดจาก mattpocock/skills `teach` และ `scaffold-exercises` (MIT · เขียนใหม่) · ตรวจแหล่ง 2026-10-23 · แถวใหม่ใน `triggers.md` หมวดเรียนรู้
- ส่วนเสริมจากการเทียบตัวต่อตัวกับ skill เปิด (2026-10-22 · เขียนใหม่ด้วยคำเรา ระบุที่มาในไฟล์):
  - จัดการชีวิต: `calendar-audit` นับต้นทุนประชุมที่ตัดช่วงโฟกัส (ความยาวประชุม + ราว 23 นาทีกว่าจะกลับเข้างาน · ตัวเลขที่คนอ้างกันทั่วไป ยังไม่ได้เปิดต้นฉบับ (รอยืนยัน)) · `inbox-triage` ร่างตอบหยุดที่โฟลเดอร์ร่าง ผู้ใช้กดส่งเอง และคัดเฉพาะเมลตั้งแต่รอบที่แล้ว · `meeting-prep-card` ด่าน "ประชุม · เขียน · รอ" ก่อนทำการ์ด · `meeting-summary` ทุกมติมีเหตุผล 1 วรรค · `weekly-review` เริ่มจากบันทึกจริงก่อนถามความจำ · `personal-kb` lint รายเดือน 5 ข้อ · `decision-journal` ความมั่นใจเป็นคะแนน 1–10
  - อาชีพ: `interview-prep` เรื่องเล่า 3 ความยาว (30 วินาที · 90 วินาที · 3 นาที) · `linkedin-profile` หัวข้อ Recommendations และแบนเนอร์ 1,584 × 396 px (รอยืนยัน) · `resume-th-en` แยกข้อกำหนดของประกาศงาน 3 ระดับ และข้อความไทยที่จะส่งไม่ใช้ขีดยาว · `performance-self-review` จัดอันดับหลักฐาน 4 ขั้น (Measured · Witnessed · Shown · Claimed) · `salary-negotiation` ตารางเวลาหลังได้ข้อเสนอ 7 วัน และสิ่งที่ต่อรองแทนฐานเงินเดือน · แก้ข้อเท็จจริงกองทุนสำรองเลี้ยงชีพ: ลูกจ้างและนายจ้างสมทบฝ่ายละ 2–15% ของค่าจ้าง อัตราของนายจ้างไม่ต้องเท่าของลูกจ้าง
  - สุขภาพ บ้าน และเรียนรู้: `doctor-visit-prep` การ์ดฉุกเฉิน 1 หน้า (ไม่ใส่เลขบัตรประชาชน) · `thesis-writing` ลำดับหาต้นทางของอ้างอิง (DOI → CrossRef → arXiv → Semantic Scholar → ThaiJO หรือ ThaiLIS → ตัวจัดการอ้างอิง) และกฎประโยคทั่วไปย้ายไป `thai-grammar` · `english-tech-reading` และ `paper-to-practice` รายการตรวจคำอธิบายไทยจากต้นฉบับอังกฤษ 5 ข้อ
- ข้อเท็จจริงที่ตรวจใหม่ 2026-10-22: `vehicle-care` ค่าตรวจสภาพที่ ตรอ. เป็นราคาที่มักอ้างถึง ไม่ใช่อัตราตามกฎหมาย (รอยืนยัน · ถามสถานีก่อนไป) และวงเงินค่ารักษาของ พ.ร.บ. 80,000 บาท ติด (รอยืนยัน) · แม่แบบบันทึกรถเตือนใบขับขี่ 30 วันก่อนหมดอายุ · `elder-care` เบี้ยยังชีพคงอัตราเดิม พร้อมหมายเหตุข่าวอัตราใหม่ที่ยังไม่ยืนยัน · `pet-care` ค่าปรับเมื่อไม่ฉีดวัคซีนพิษสุนัขบ้า (รอยืนยัน)
- ใช้แกน `superuser` 3.1.0: playbook `team-project` และค่าตั้ง hook `guard` · `recompact` (ปิดไว้)

## 0.12.0 — 2026-10-22

- รวม `home-family` `health-wellness` และ `career` เข้ามาเป็น plugin เดียว — ชีวิตประจำวัน 4 หมวด: จัดการชีวิต · บ้านและครอบครัว · สุขภาพ · อาชีพ
- รวม plugin dev-learning: skill 9 ตัว (+alias 2) · agent tech-mentor · playbook 5 ตัว · prompt 6 ฉบับ — หมวดที่ 5 "เรียนรู้" ใน `skills/superuser/SKILL.md` (กฎ 18–19 · เกณฑ์ · รออนุมัติ) · triggers · examples · context-template
- ชื่อ skill และ command เดิมทุกตัวใช้ได้เหมือนเดิม · playbook ทุกหมวดรวมอยู่ใน skill `superuser`
- รับ skill `meeting-summary` · `meeting-prep-card` จาก `doc-toolkit` ที่ยุบ (ชื่อเดิม) · ตัด dependency `doc-toolkit`
- ถอด plugin เดิม: `/plugin uninstall home-family` `health-wellness` `career` `dev-learning`

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
