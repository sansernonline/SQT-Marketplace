# SQT career — Gemini CLI

> สร้างอัตโนมัติจาก plugins/career/ โดย scripts/build/build-targets.mjs (v0.2.0) · ห้ามแก้ไฟล์นี้โดยตรง

Career toolkit for people working in Thailand — Thai and international CV conventions with ATS-friendly templates in both languages, interview preparation with a STAR story bank and the questions Thai HR always asks, salary negotiation with total-compensation maths (bonus months, provident fund match, social security, insurance) and scripts in Thai and English, self-review and promotion cases, and LinkedIn profiles tuned for the Thai market.

ชุดนี้มี skill 8 ตัว · บทบาท 3 บทบาท · คำสั่งสำเร็จรูป 3 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **career-coach** — Use when changing jobs, asking for a raise or promotion, writing a CV or LinkedIn profile, or weighing two offers. Turns experience into numbered achievements and drafts what to say to HR in Thai or English.
- **interview-coach** — Use when the user has an interview coming, wants a mock interview or STAR stories, or must answer hard Thai HR questions (expected salary, why leaving, weaknesses). Runs mock rounds one question at a time and scores each answer.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
