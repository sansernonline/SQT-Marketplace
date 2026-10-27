# SQT e-commerce — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/e-commerce/ โดย scripts/build/build-targets.mjs (v1.2.0) · ห้ามแก้ไฟล์นี้โดยตรง

Thai online selling, buying and small-business back office — sell on Shopee, Lazada, TikTok Shop, LINE and Facebook (listings, pricing, stock, chat, live, returns), buy with confidence (total cost, warranty, OCPB 1166 complaints, refunds), and run the company (quotations, contracts, VAT and withholding tax, payroll, social security, year-end filing, labour law, PDPA, LINE OA, PromptPay). General information only, not tax or legal advice.

ชุดนี้มี skill 70 ตัว · บทบาท 11 บทบาท · คำสั่งสำเร็จรูป 14 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **compliance-helper** — Use when a Thai SME handles personal data under PDPA — consent forms, breach response, data-subject requests, ROPA.
- **consumer-advocate** — Use for a big purchase, faulty product, refused refund, complaint to a seller, platform or สคบ., card dispute, warranty.
- **customer-chat** — Use when a Thai online seller must answer a customer — price, stock, late parcel, refund, haggling, bad review.
- **line-admin** — Use when setting up or running a LINE Official Account — Messaging API, webhook, chatbot, broadcast, rich menu.
- **live-seller** — Use when planning a live sale on TikTok Shop, Shopee, Lazada or Facebook Live. Run sheet, hook, flash deals, CTA lines.
- **shop-manager** — Use when a Thai online seller needs a listing, a price after platform fees, or stock synced across marketplaces.
- **tax-helper** — Use when a Thai SME or person asks what to file and when (VAT, WHT, social security), hiring or business setup.
- **thai-doc-writer** — Use when drafting Thai business documents — ใบเสนอราคา, invoice, receipt, official letter, contract, leave form.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
