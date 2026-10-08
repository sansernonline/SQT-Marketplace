# SQT online-seller — Gemini CLI

> สร้างอัตโนมัติจาก plugins/online-seller/ โดย scripts/build/build-targets.mjs (v0.2.2) · ห้ามแก้ไฟล์นี้โดยตรง

Toolkit for Thai small sellers on Shopee, Lazada, TikTok Shop, LINE and Facebook — listings that avoid prohibited claims, fees and pricing, one stock sheet across shops, chat replies, live-selling scripts, couriers and COD, returns and bad reviews, and seller tax basics (40(8), VAT threshold). General information only, not tax or legal advice.

ชุดนี้มี skill 12 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 4 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **customer-chat** — Use when a Thai online seller must answer a customer — price, stock, late parcel, wrong or damaged item, refund, haggling, bad review. Polite Thai replies in the shop's voice, inside platform policy.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **live-seller** — Use when planning a live-selling session on TikTok Shop, Shopee Live, Lazada Live or Facebook Live. Minute-by-minute run sheet, opening hook, flash deals, CTA lines and a claims compliance check.
- **shop-manager** — Use when a Thai online seller needs a product listing, a price after platform fees, or stock kept in sync across Shopee, Lazada, TikTok Shop, LINE and Facebook so nothing oversells.
