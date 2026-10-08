# SQT online-seller — OpenAI Codex CLI

> สร้างอัตโนมัติจาก plugins/online-seller/ โดย scripts/build/build-targets.mjs (v0.2.1) · ห้ามแก้ไฟล์นี้โดยตรง

Toolkit for Thai small sellers on Shopee, Lazada, TikTok Shop, LINE and Facebook — platform-specific listing titles and descriptions, prohibited health and beauty claims, marketplace fee structures and a price formula, one master stock sheet across shops, Thai chat reply templates, live-selling scripts, courier and COD comparison, returns and bad-review handling, and online-seller tax basics (40(8), 60% deemed expense, VAT threshold, platform income reporting). General information only, not tax or legal advice.

ชุดนี้มี skill 12 ตัว · บทบาท 4 บทบาท · คำสั่งสำเร็จรูป 4 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **customer-chat** — Use when a Thai online seller must answer a customer — price, stock, late parcel, wrong or damaged item, refund, haggling, bad review. Polite Thai replies in the shop's voice, inside platform policy.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **live-seller** — Use when planning a live-selling session on TikTok Shop, Shopee Live, Lazada Live or Facebook Live. Minute-by-minute run sheet, opening hook, flash deals, CTA lines and a claims compliance check.
- **shop-manager** — Use when a Thai online seller needs a product listing, a price after platform fees, or stock kept in sync across Shopee, Lazada, TikTok Shop, LINE and Facebook so nothing oversells.
