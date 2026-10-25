# SQT reverse-engineer — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/reverse-engineer/ โดย scripts/build/build-targets.mjs (v0.3.0) · ห้ามแก้ไฟล์นี้โดยตรง

Evidence-first reverse-engineering toolkit for JavaScript/Electron apps, native binaries, .NET assemblies, websites, Android APKs, network captures and firmware. One entry skill routes to per-target static-analysis modules, a tool readiness checker reports which user-installed tools are present without downloading anything, and every conclusion carries evidence and stated limitations. For software you own or are authorized to examine only.

ชุดนี้มี skill 42 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 1 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **reverse-engineer-analyst** — Use for inspecting an app, binary, assembly, website or APK without source — explain with evidence, then rebuild.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
