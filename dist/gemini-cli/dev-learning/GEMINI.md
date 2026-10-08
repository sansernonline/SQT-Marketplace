# SQT dev-learning — Gemini CLI

> สร้างอัตโนมัติจาก plugins/dev-learning/ โดย scripts/build/build-targets.mjs (v0.3.0) · ห้ามแก้ไฟล์นี้โดยตรง

Stay-current toolkit for developers — a weekly tech radar over followed libraries and tools, turning papers and long technical articles into working example code, personal learning paths tied to real projects, faster reading of English technical documentation, certification study plans for AWS, Azure, Google Cloud, Kubernetes and Scrum exams, and a scored picker for finishable practice side projects.

ชุดนี้มี skill 9 ตัว · บทบาท 2 บทบาท · คำสั่งสำเร็จรูป 2 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **tech-mentor** — Use when the user wants to keep up with tech, learn a new technology, turn reading into working knowledge, prepare for a certification, or pick a side project. Designs learning loops that end in working code, sized to a working week.
