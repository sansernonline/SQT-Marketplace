# SQT online-seller — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/online-seller/ โดย scripts/build/build-targets.mjs (v0.3.0) · ห้ามแก้ไฟล์นี้โดยตรง

Toolkit for Thai small sellers on Shopee, Lazada, TikTok Shop, LINE and Facebook — listings that avoid prohibited claims, fees and pricing, one stock sheet across shops, chat replies, live-selling scripts, couriers and COD, returns and bad reviews, and seller tax basics (40(8), VAT threshold). General information only, not tax or legal advice.

ชุดนี้มี skill 12 ตัว · บทบาท 6 บทบาท · คำสั่งสำเร็จรูป 4 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **customer-chat** — Use when a Thai online seller must answer a customer — price, stock, late parcel, refund, haggling, bad review.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **live-seller** — Use when planning a live sale on TikTok Shop, Shopee, Lazada or Facebook Live. Run sheet, hook, flash deals, CTA lines.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; specialists go first.
- **shop-manager** — Use when a Thai online seller needs a listing, a price after platform fees, or stock synced across marketplaces.
