# SQT personal-life — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/personal-life/ โดย scripts/build/build-targets.mjs (v0.5.0) · ห้ามแก้ไฟล์นี้โดยตรง

Personal life admin for busy adults — weekly reviews, meeting prep and summaries, inbox triage, important documents with expiry dates, travel checklists, gifts, a decision journal, subscription audits from Thai bank statements, scam defence, goals and habits, and polite Thai-English messages. Works alongside email, calendar and note plugins.

ชุดนี้มี skill 18 ตัว · บทบาท 6 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **doc-caretaker** — Use when an important document is missing, expiring or piled up. Keeps one registry of ID, property, vehicle, insurance.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **life-admin** — Use for recurring personal admin — weekly reviews, subscription audits, digital safety, goals, habits, polite messages.
- **meeting-prep** — Use before and after a meeting that matters. One-page prep card (goal, questions, context) and action-item summary.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; specialists go first.
