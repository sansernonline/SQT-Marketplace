---
name: chat-reply-templates
description: Use when a Thai online seller answers everyday buyer chat (price, stock, size, late parcel, discount) on Shopee, Lazada, TikTok Shop, LINE or Facebook.
---

# Chat Reply Templates (Thai)

Response time and chat rate count toward shop ratings on the big platforms, and a fast, polite answer is half of every sale. Templates make the answer fast; filling them with the order's real facts makes it right.

## Workflow

1. **Read the order first** — order number, items, paid or not, ship date, tracking status, chat history
2. **Pick the template** from the table and from [templates](references/templates.md)
3. **Fill every `<...>`** with real facts; never send a template with a blank or a guessed date
4. **Match the voice** — ค่ะ or ครับ consistently; the shop's name for itself (แอดมิน / ร้าน <name>)
5. **Say the next step and when** — "แอดมินจะแจ้งกลับภายใน 17:00 วันนี้ค่ะ" and then actually do it
6. **Log** recurring questions; 3 of the same question in a week means the listing or FAQ auto-reply is missing it

## Which template

| Buyer says | Template | Check first |
|---|---|---|
| ราคาเท่าไหร่ / ลดได้ไหม | T1 price · T6 decline discount | current price and running vouchers |
| มีของไหม / มีสีนี้ไหม / ไซซ์ไหนดี | T2 stock & size | master sheet (`multi-shop-stock`), size chart |
| ของยังไม่มา | T3 late parcel | tracking page, courier status, platform's estimated date |
| ได้ของผิด / ไม่ครบ / ชำรุด | T4 wrong or damaged item | photos/video from buyer, packing record |
| ขอคืนเงิน / ขอคืนสินค้า | T5 refund | decision table in `returns-and-bad-reviews` |
| ส่งของวันไหน | T7 shipping time | cut-off time, today's shipments |
| ขอใบเสร็จ / ใบกำกับภาษี | T8 receipt | VAT-registered or not (`seller-tax-basics`) |

## Rules

- Answer within the platform's expected window during shop hours; set an auto-reply for after hours that says when a person will answer
- Never send a buyer to pay outside Shopee, Lazada or TikTok Shop, or give a LINE ID or phone number there — it breaks platform rules and removes buyer protection
- Never blame the courier or the buyer; state facts and the fix
- Never promise a delivery date the courier has not shown
- Never paste another buyer's details, and never ask for a buyer's ID card or bank account in chat (refunds go through the platform)
- Keep emoji to 1–2 per message; no stickers in complaint chats
- Quotation or tax invoice for a business buyer → `thai-workplace` `doc-quotation`
- LINE shop auto-replies and rich menu → `thai-workplace` `line-oa-setup`

## Worked example

Buyer (Shopee): "สั่งไปตั้งแต่วันที่ 2 ยังไม่ได้เลย ร้านโกงหรือเปล่า"
Check: shipped 3 Oct with Flash, tracking shows "ถึงศูนย์คัดแยก ขอนแก่น" on 5 Oct, platform estimate 6–8 Oct.

Reply (T3 filled):
> สวัสดีค่ะคุณลูกค้า ขอโทษที่ทำให้รอนะคะ 🙏 แอดมินเช็กให้แล้วค่ะ พัสดุส่งออกวันที่ 3 ต.ค. เลขพัสดุ TH123456789 ตอนนี้อยู่ที่ศูนย์คัดแยกขอนแก่น (5 ต.ค.) ระบบประเมินว่าจะถึงภายใน 6–8 ต.ค. ค่ะ ถ้าถึงวันที่ 8 แล้วยังไม่ได้รับ ทักแอดมินได้เลยนะคะ แอดมินจะติดตามกับขนส่งให้ทันทีค่ะ

## Related

- `returns-and-bad-reviews` — refunds and public review replies
- `shipping-compare` — courier claims for lost parcels
