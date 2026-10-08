# SQT superuser — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/superuser/ โดย scripts/build/build-targets.mjs (v1.0.0) · ห้ามแก้ไฟล์นี้โดยตรง

SuperUser core — a lead agent that sizes the task, picks or builds a playbook, hands parts to subagents, proves the result, keeps one shared CONTEXT.md, logs every action and learns after every task with a machine-wide improvement queue. Use it alone or as the master copy other plugins adapt.

ชุดนี้มี skill 3 ตัว · บทบาท 1 บทบาท · คำสั่งสำเร็จรูป 0 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
