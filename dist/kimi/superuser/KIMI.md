# SQT superuser — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/superuser/ โดย scripts/build/build-targets.mjs (v3.6.1) · ห้ามแก้ไฟล์นี้โดยตรง

SuperUser — a team lead agent. Sizes the task and picks a budget, writes a 5-point brief for every piece, dispatches low-effort subagents in parallel, scores them, and re-checks with a fresh reviewer until done. Optional modules (shared context, logs, improvements, learning loop, inbox, hook gates) switch on and off per project. Use it alone or as the core other plugins extend.

ชุดนี้มี skill 36 ตัว · บทบาท 3 บทบาท · คำสั่งสำเร็จรูป 0 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
