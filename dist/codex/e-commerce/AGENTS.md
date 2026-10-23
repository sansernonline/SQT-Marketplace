# SQT e-commerce — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/e-commerce/ โดย scripts/build/build-targets.mjs (v1.0.0) · ห้ามแก้ไฟล์นี้โดยตรง

Online buying and selling toolkit for Thailand, both sides in one plugin — sell on Shopee, Lazada, TikTok Shop, LINE and Facebook (listings, fees and pricing, one stock sheet, chat replies, live-selling scripts, couriers and COD, returns) and buy with confidence (decision matrix and total cost, fake-review check, warranty registry, complaint letters up to OCPB hotline 1166, refunds and chargebacks). General information only, not tax or legal advice.

ชุดนี้มี skill 45 ตัว · บทบาท 7 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **consumer-advocate** — Use for a big purchase, faulty product, refused refund, complaint to a seller, platform or สคบ., card dispute, warranty.
- **customer-chat** — Use when a Thai online seller must answer a customer — price, stock, late parcel, refund, haggling, bad review.
- **live-seller** — Use when planning a live sale on TikTok Shop, Shopee, Lazada or Facebook Live. Run sheet, hook, flash deals, CTA lines.
- **shop-manager** — Use when a Thai online seller needs a listing, a price after platform fees, or stock synced across marketplaces.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
