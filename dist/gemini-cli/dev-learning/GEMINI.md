# SQT dev-learning — Gemini CLI

> สร้างอัตโนมัติจาก plugins/dev-learning/ โดย scripts/build/build-targets.mjs (v0.9.0) · ห้ามแก้ไฟล์นี้โดยตรง

Stay-current toolkit for developers — a weekly tech radar over followed libraries and tools, turning papers and long technical articles into working example code, personal learning paths tied to real projects, faster reading of English technical documentation, certification study plans for AWS, Azure, Google Cloud, Kubernetes and Scrum exams, and a scored picker for finishable practice side projects, and thesis and journal-paper writing with verified citations.

ชุดนี้มี skill 50 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 2 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **tech-mentor** — Use to keep up with tech, learn a new technology, prepare for a certification, or pick a 2-weekend side project.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
