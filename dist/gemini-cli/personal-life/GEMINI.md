# SQT personal-life — Gemini CLI

> สร้างอัตโนมัติจาก plugins/personal-life/ โดย scripts/build/build-targets.mjs (v0.4.1) · ห้ามแก้ไฟล์นี้โดยตรง

Personal life administration for busy adults — weekly reviews, meeting prep and summaries, inbox triage method, calendar audits, personal knowledge notes, important-document registry with expiry tracking, travel checklists, gift tracking, a decision journal, subscription audits from Thai bank statements, family digital hygiene and scam defence, quarterly goals and habit design, and polite Thai-English message templates. Knowledge and workflow only; it complements email/calendar/note plugins instead of duplicating their connectors.

ชุดนี้มี skill 18 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **doc-caretaker** — Use when the user cannot find an important document, something is about to expire, or the paper pile needs organising — keeps one registry of ID, property, vehicle, insurance and contract papers with expiry reminders.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **life-admin** — Use for recurring personal admin — weekly reviews, subscription audits, family digital safety, quarterly goals and habits, awkward polite messages, and the small repeated tasks that eat adult life.
- **meeting-prep** — Use before and after any meeting the user cares about. Builds a one-page prep card before (goal, questions, context) and an action-item summary after (who does what by when), because meetings without outputs are just conversations.
