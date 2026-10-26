# SQT personal-life — Gemini CLI

> สร้างอัตโนมัติจาก plugins/personal-life/ โดย scripts/build/build-targets.mjs (v0.15.3) · ห้ามแก้ไฟล์นี้โดยตรง

Daily-life admin, five categories — life admin (weekly reviews, inbox triage, documents, travel, decisions, subscriptions, digital safety, goals), home and family (bills, maintenance, vehicle, meals, school, elder care, pets, floods, wills), health (exercise, sleep, checkups, medication, doctor visits, pregnancy — never diagnoses), career (CVs, interviews, salary, LinkedIn), and learning (learning paths, papers, tech radar, certs, side projects, thesis). General information only.

ชุดนี้มี skill 76 ตัว · บทบาท 12 บทบาท · คำสั่งสำเร็จรูป 16 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **career-coach** — Use when changing jobs, asking for a raise, writing a CV or LinkedIn profile, or weighing offers. Thai or English.
- **doc-caretaker** — Use when an important document is missing, expiring or piled up. Keeps one registry of ID, property, vehicle, insurance.
- **family-planner** — Use when a Thai family needs its week organised — meals, groceries, school fees, elder appointments, pet vaccines.
- **health-organizer** — Use to organise family health admin — checkups, results, medication, sleep, doctor questions. Never diagnoses; 1669.
- **home-manager** — Use for Thai household bills and upkeep — utilities, repairs, contractor quotes, vehicle tax, พ.ร.บ., renewals.
- **interview-coach** — Use when an interview is coming — practice sets, STAR stories, hard Thai HR questions, scoring. Offers → career-coach.
- **life-admin** — Use for recurring personal admin — weekly reviews, subscription audits, digital safety, goals, habits, polite messages.
- **meeting-prep** — Use before and after a meeting that matters. One-page prep card (goal, questions, context) and action-item summary.
- **tech-mentor** — Use to keep up with tech, learn a new technology, prepare for a certification, or pick a 2-weekend side project.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
