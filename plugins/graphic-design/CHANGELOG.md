# Changelog — graphic-design

## Unreleased

- เพิ่ม skill `speaking-script`: สคริปต์ให้คนพูดหน้ากล้อง (คลิป influencer · รีวิว · พิธีกร · voiceover) — กฎข้อเดียว write for the ear · hook ก่อนทักทาย · ตารางภาษาเขียน → ภาษาพูด · จับเวลาด้วยนาฬิกาไม่นับคำ · ขั้น 0 หาคลิปอ้างอิงก่อนเขียน · eval 3 เคส ใน `evals/speaking-script-*` · เพิ่มแถวใน skill-router (พร้อมกัน pattern โค้ดไม่จับ "สคริปต์พูด" อีก) · triggers · file-map
- `brief-to-image`: เพิ่มขั้น 0 หารูปอ้างอิงที่ชอบก่อนเขียน prompt แล้วแตกว่าชอบอะไร (แสง · สี · องค์ประกอบ) ใส่ใน brief — ลดผลงานหน้าตาเหมือนกันทุกชิ้น

## 0.10.0 — 2026-10-23

- รับ skill `image-generation` จาก `doc-toolkit` ที่ยุบ (ชื่อเดิม) · ตัด dependency `doc-toolkit`
- `brief-to-image`: `references/prompt-anatomy.md` เพิ่มหัวข้อ Tactile 3D hero object: แม่แบบภาพวัตถุ 3 มิติจับต้องได้ 8 บรรทัด (subject · material · light · shadow · lens · background · one colour · negatives) พร้อมตัวอย่างเครื่องหมายคำถามกระดาษตัดสีส้มบนกระดาษครีม · เพิ่มสารบัญเพราะไฟล์ยาวเกิน 100 บรรทัด · ลิงก์จาก `SKILL.md` · `image-generation` `references/styles.md` แถว `3d` เปลี่ยนจาก prompt ทั่วไป (clay · studio · pastel) เป็นวัสดุ แสง เงา และ negative ที่ระบุชัด แล้วชี้ไปแม่แบบ
- `video-script-to-clip`: เพิ่ม `references/production-tools.md` เครื่องมือแปลงสคริปต์เป็นคลิป (CapCut · DaVinci Resolve รุ่นฟรี · HyperFrames · Remotion) พร้อมเงื่อนไขใช้เพื่อการค้าของเพลง เทมเพลต และฟอนต์ใน CapCut · เกณฑ์ Company License ของ Remotion · ค่าส่งออกต่อแพลตฟอร์ม · ฟอนต์ซับไทย · กฎเพลง ตรวจแหล่ง 2026-10-23 · ลิงก์จาก `SKILL.md` หัวข้อ Related · แถวใหม่ใน `triggers.md`
- `brief-to-image`: ตาราง Failure modes 8 อาการ บอกว่าแก้อย่างเดียวอะไรเมื่อรูปพลาด (ตัวอักษรเพี้ยน → เอาคำออกจาก prompt แล้วใส่ข้อความตอนจัดหน้า · ภาพในชุดไม่เข้ากัน → style lock sheet กับ seed หรือรูปอ้างอิงเดียวกัน) · ผู้ใช้ Gemini API: โมเดล `imagen-4.0-*` ปิดบริการเมื่อ 2026-08-17 ตามหน้า deprecations ให้ใช้รุ่น `gemini-*-image` และจดรหัสโมเดลที่ใช้จริง (ตรวจ 2026-10-23) · `image-generation` เขียน 1 ย่อหน้าบนสุดของ `image-style.md` ว่าภาพชุดนี้คืออะไร (ใครดู · ดูแล้วรู้สึกอะไร · จะไม่เป็นแบบไหน) แล้วเทียบทุกรูปกับย่อหน้านี้
- `brand-kit`: แยก Imagery กับ Voice · Voice ใช้คู่ก่อนกับหลังภาษาไทยที่เจ้าของแบรนด์เขียนเอง พร้อมเลือก ครับ/ค่ะ สรรพนาม และระดับภาษา 1 แบบจาก `thai-grammar` ข้อความไทยของแบรนด์จึงเสียงเดียวกันทุกชิ้น
- `design-review`: squint test (หรี่ตา ซูม 10% หรือเบลอ 10 px แล้วดูว่าอะไรยังเห็น) · เช็กตัวอักษร 4 ข้อ (ระดับต่างกันด้วยขนาดและน้ำหนัก ไม่ใช่สีอย่างเดียว · บรรทัดเนื้อความ 45–75 ตัวละติน หรือราว 35–55 ตัวไทย · ไม่ใส่ letter-spacing กับเนื้อความไทย · 1 บล็อก 1 การจัดแนว)
- `motion-basics`: ตาราง token การเคลื่อนไหวของ Material 3 (easing 5 แบบ · ช่วงเวลา 50–1000 ms) ตรวจกับ material-web (Apache-2.0) 2026-10-23 · ฉากหลังที่เคลื่อนไหวต้องมีความหมาย ฉากที่แค่ตกแต่งให้ตัดทิ้ง
- `video-script-to-clip`: เครื่องหมายวรรคตอนไทยในซับไตเติลและข้อความบนจอ · ข้อความการตลาดบนจอทั้งคลิป 15 วินาที ไม่เกินราว 120 ตัวอักษรไทย (ไม่นับวรรณยุกต์และสระบนล่าง)
- ใช้แกน `superuser` 3.1.0: playbook `team-project` และค่าตั้ง hook `guard` · `recompact` (ปิดไว้)

## 0.9.1 — 2026-10-22

- แก้ชื่อ plugin ของ `image-generation` (เป็น `doc-toolkit`) · แก้ตัวชี้ใน examples/triggers

## 0.9.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)

## 0.8.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)

## 0.7.0 — 2026-10-19

- รับ skill กลาง `no-ai-look` จาก `superuser` · agent ทั้ง 4 ตัว (`art-director` · `brand-keeper` · `design-critic` · `social-creator`) ทำตามและตรวจก่อนส่ง
- skill 9 ตัวมีหัวข้อ "Not an AI look" · brief ของรูป AI ใส่แนวที่มีชื่อ · hex · แสง · สิ่งที่ไม่เอา ตามข้อ 4 ของ `no-ai-look`

## 0.6.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
