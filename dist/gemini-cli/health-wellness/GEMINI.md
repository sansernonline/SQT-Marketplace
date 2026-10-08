# SQT health-wellness — Gemini CLI

> สร้างอัตโนมัติจาก plugins/health-wellness/ โดย scripts/build/build-targets.mjs (v0.1.0) · ห้ามแก้ไฟล์นี้โดยตรง

Personal health organiser for people in Thailand — beginner exercise plans built on WHO activity guidance, a sleep diary, annual checkup planning with Thai social security and gold-card preventive rights, a medication schedule and refill reminders for medicines a doctor already prescribed, and doctor-visit preparation. Strict scope - it organises, reminds and prepares questions; it never diagnoses or changes doses, and sends emergencies to 1669.

ชุดนี้มี skill 8 ตัว · บทบาท 2 บทบาท · คำสั่งสำเร็จรูป 2 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **health-organizer** — Use when the user organises their own or a family member's health admin — annual checkup, results over years, medication schedule, sleep diary, beginner exercise, or doctor-visit questions. Never diagnoses or doses; emergencies 1669.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
