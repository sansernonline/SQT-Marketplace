# SQT consumer-rights — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/consumer-rights/ โดย scripts/build/build-targets.mjs (v0.5.0) · ห้ามแก้ไฟล์นี้โดยตรง

Consumer toolkit for buyers in Thailand — compare purchases with a decision matrix and total cost of ownership, spot fake reviews, keep a warranty and receipt registry, write complaint letters in Thai with the escalation ladder from seller to platform to the Office of the Consumer Protection Board (hotline 1166) to the consumer court, and request refunds using the direct-marketing cooling-off right, platform disputes and credit-card chargebacks. General information, not legal advice.

ชุดนี้มี skill 11 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 2 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **consumer-advocate** — Use for a big purchase, faulty product, refused refund, complaint to a seller, platform or สคบ., card dispute, warranty.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
