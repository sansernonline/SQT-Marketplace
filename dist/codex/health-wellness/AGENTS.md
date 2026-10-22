# SQT health-wellness — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/health-wellness/ โดย scripts/build/build-targets.mjs (v0.7.0) · ห้ามแก้ไฟล์นี้โดยตรง

Personal health organiser for people in Thailand — beginner exercise plans built on WHO activity guidance, a sleep diary, annual checkup planning with Thai social security and gold-card preventive rights, a medication schedule and refill reminders for medicines a doctor already prescribed, and doctor-visit preparation. Strict scope - it organises, reminds and prepares questions; it never diagnoses or changes doses, and sends emergencies to 1669.

ชุดนี้มี skill 48 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 2 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **health-organizer** — Use to organise family health admin — checkups, results, medication, sleep, doctor questions. Never diagnoses; 1669.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
