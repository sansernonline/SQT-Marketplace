# SQT home-family — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/home-family/ โดย scripts/build/build-targets.mjs (v0.3.0) · ห้ามแก้ไฟล์นี้โดยตรง

Household admin for Thai families — reading electricity (MEA/PEA, Ft) and water bills with a monthly tracker, a seasonal home-maintenance schedule for the Thai climate, vehicle tax, compulsory insurance and inspection reminders, weekly meal plans with grocery lists, school terms and enrolment documents, elder-care rights and medication tables, and pet vaccination records. General information only, not legal, tax or medical advice.

ชุดนี้มี skill 11 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 3 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **family-planner** — Use when a Thai family needs its week organised — meals, groceries, school fees, elder appointments, pet vaccines.
- **home-manager** — Use for Thai household bills and upkeep — utilities, repairs, contractor quotes, vehicle tax, พ.ร.บ., renewals.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; specialists go first.
