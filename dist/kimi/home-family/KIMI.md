# SQT home-family — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/home-family/ โดย scripts/build/build-targets.mjs (v0.2.1) · ห้ามแก้ไฟล์นี้โดยตรง

Household admin for Thai families — reading electricity (MEA/PEA, Ft) and water bills with a monthly tracker, a seasonal home-maintenance schedule for the Thai climate, vehicle tax, compulsory insurance and inspection reminders, weekly meal plans with grocery lists, school terms and enrolment documents, elder-care rights and medication tables, and pet vaccination records. General information only, not legal, tax or medical advice.

ชุดนี้มี skill 11 ตัว · บทบาท 3 บทบาท · คำสั่งสำเร็จรูป 3 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **family-planner** — Use when a Thai family needs its week or term organised — meals and groceries, school fees, an elder's appointments, pet vaccines — as shareable checklists.
- **home-manager** — Use when a Thai household needs bills and upkeep in order — electricity and water, maintenance, contractor quotes, vehicle tax, พ.ร.บ. and licence renewals.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked and propose up to 3 skill or agent edits with evidence. Writes only its own note.
