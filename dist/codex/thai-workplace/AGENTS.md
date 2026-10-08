# SQT thai-workplace — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/thai-workplace/ โดย scripts/build/build-targets.mjs (v0.4.1) · ห้ามแก้ไฟล์นี้โดยตรง

Thai workplace toolkit for SMEs — LINE OA setup and chatbots, Thai business documents (quotation, official letters per the สารบรรณ regulation, contracts, leave forms), PDPA workflows, VAT and withholding tax with a rate table and filing calendar, payroll with PIT withholding and 50 ทวิ, social security under the 2026 wage cap, e-Tax Invoice, year-end DBD and corporate tax filing, Labour Protection Act basics (OT, leave, severance), PromptPay QR payloads and Thai public holidays. General information only, not legal or tax advice.

ชุดนี้มี skill 21 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 8 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **compliance-helper** — Use when a Thai company must handle personal data under PDPA — consent forms, breach response, data-subject requests, ROPA. Practical SME workflows; general information, not legal advice.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **line-admin** — Use when setting up or running a LINE Official Account — Messaging API, webhook, chatbot, broadcast, rich menu. Uses the user's own channel credentials and states the plan quota before any send.
- **tax-helper** — Use when a Thai person or small company asks what to file and when — VAT ภ.พ.30, withholding tax, ภ.ง.ด. forms, social security. Builds a filing calendar with the form per deadline, verified against the Revenue Department.
- **thai-doc-writer** — Use when drafting Thai business documents — ใบเสนอราคา, invoice, receipt, official letter, contract, leave form. Correct format and register; flags points that need a lawyer or accountant.
