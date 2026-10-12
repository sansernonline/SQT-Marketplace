# SQT thai-workplace — Gemini CLI

> สร้างอัตโนมัติจาก plugins/thai-workplace/ โดย scripts/build/build-targets.mjs (v0.4.2) · ห้ามแก้ไฟล์นี้โดยตรง

Thai workplace toolkit for SMEs — LINE OA and chatbots, business documents (quotations, สารบรรณ letters, contracts), PDPA, VAT and withholding tax with a filing calendar, payroll and 50 ทวิ, social security, e-Tax Invoice, year-end DBD and corporate tax, Labour Protection Act basics, PromptPay QR and public holidays. General information only, not legal or tax advice.

ชุดนี้มี skill 21 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 8 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **compliance-helper** — Use when a Thai company handles personal data under PDPA — consent forms, breach response, data-subject requests, ROPA. SME workflows; not legal advice.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked and propose up to 3 skill or agent edits with evidence. Writes only its own note.
- **line-admin** — Use when setting up or running a LINE Official Account — Messaging API, webhook, chatbot, broadcast, rich menu. Uses your own credentials.
- **tax-helper** — Use when a Thai person or small company asks what to file and when — VAT ภ.พ.30, withholding tax, ภ.ง.ด. forms, social security. Builds a filing calendar.
- **thai-doc-writer** — Use when drafting Thai business documents — ใบเสนอราคา, invoice, receipt, official letter, contract, leave form. Right format and register; flags legal points.
