# SQT career — Gemini CLI

> สร้างอัตโนมัติจาก plugins/career/ โดย scripts/build/build-targets.mjs (v0.5.0) · ห้ามแก้ไฟล์นี้โดยตรง

Career toolkit for people working in Thailand — Thai and international CV conventions with ATS-friendly templates in both languages, interview preparation with a STAR story bank and the questions Thai HR always asks, salary negotiation with total-compensation maths (bonus months, provident fund match, social security, insurance) and scripts in Thai and English, self-review and promotion cases, and LinkedIn profiles tuned for the Thai market.

ชุดนี้มี skill 12 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 3 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **career-coach** — Use when changing jobs, asking for a raise, writing a CV or LinkedIn profile, or weighing offers. Thai or English.
- **interview-coach** — Use when an interview is coming — practice sets, STAR stories, hard Thai HR questions, scoring. Offers → career-coach.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
