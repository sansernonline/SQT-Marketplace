# skill: chat-reply-templates

Use when a Thai online seller answers everyday buyer chat (price, stock, size, late parcel, discount) on Shopee, Lazada, TikTok Shop, LINE or Facebook.

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


## reference: templates.md

# Thai chat templates

Swap ค่ะ/คะ for ครับ to match the shop voice. Fill every `<...>`.

## Contents
- T1 Price question
- T2 Stock, colour and size
- T3 Late parcel
- T4 Wrong, missing or damaged item
- T5 Refund or return request
- T6 Politely declining a discount
- T7 When will it ship
- T8 Receipt or tax invoice
- Auto-reply after hours

## T1 Price question
> สวัสดีค่ะ ขอบคุณที่สนใจ <ชื่อสินค้า> นะคะ ราคาตอนนี้ <ราคา> บาทค่ะ <ถ้ามีโค้ด: ตอนนี้มีโค้ดส่วนลดร้าน <โค้ด> ลด <x> บาท ถึงวันที่ <วันที่> ค่ะ> กดสั่งได้ที่หน้าสินค้าเลยนะคะ มีอะไรสอบถามเพิ่มเติมได้ค่ะ

## T2 Stock, colour and size
In stock:
> มีของพร้อมส่งค่ะ <สี/ไซซ์> เหลือ <จำนวน หรือ "อีกไม่กี่ชิ้น"> ค่ะ สั่งวันนี้ก่อน <เวลาตัดรอบ> ส่งออกวันนี้เลยค่ะ

Size help:
> ไซซ์ <M> รอบอก <xx> ซม. ยาว <xx> ซม. ค่ะ ถ้าคุณลูกค้าใส่ <ไซซ์ปกติ> ปกติ แนะนำ <ไซซ์> ค่ะ ถ้าชอบหลวม ๆ ขยับขึ้นหนึ่งไซซ์ได้ค่ะ

Out of stock:
> ขออภัยค่ะ <สี/ไซซ์> หมดชั่วคราว ของล็อตใหม่จะเข้าประมาณ <วันที่> ค่ะ กดติดตามร้านหรือกดถูกใจสินค้าไว้ได้เลยนะคะ ตอนนี้มี <ตัวเลือกใกล้เคียง> พร้อมส่งค่ะ

## T3 Late parcel
Still moving:
> ขอโทษที่ทำให้รอนะคะ 🙏 แอดมินเช็กให้แล้วค่ะ ส่งออกวันที่ <วันที่> เลขพัสดุ <เลข> ตอนนี้อยู่ที่ <สถานะล่าสุด> (<วันที่>) ระบบประเมินถึงภายใน <ช่วงวันที่> ค่ะ ถ้าเลยวันที่ <วันที่> แล้วยังไม่ได้รับ ทักแอดมินได้เลย แอดมินจะตามกับขนส่งให้ทันทีค่ะ

Stuck 3+ days or marked delivered but not received:
> แอดมินเปิดเรื่องติดตามกับ <ขนส่ง> ให้แล้วค่ะ เลขเรื่อง <เลข> จะแจ้งความคืบหน้าภายใน <วันที่/เวลา> ค่ะ ถ้าพัสดุสูญหายจริง คุณลูกค้าจะได้รับสินค้าใหม่หรือคืนเงินเต็มจำนวนค่ะ ไม่ต้องกังวลนะคะ

## T4 Wrong, missing or damaged item
> ขอโทษจริง ๆ ค่ะ 🙏 รบกวนส่งรูปสินค้าที่ได้รับ ป้ายพัสดุ และวิดีโอตอนแกะกล่อง (ถ้ามี) ให้แอดมินดูหน่อยนะคะ แอดมินจะ <ส่งของที่ถูกต้องให้ใหม่ / ส่งชิ้นที่ขาดตามไป> ภายใน <วันที่> โดยคุณลูกค้าไม่ต้องเสียค่าส่งเพิ่มค่ะ

If the case must go through the platform:
> เพื่อให้คุณลูกค้าได้รับความคุ้มครองเต็มที่ รบกวนกด "คืนเงิน/คืนสินค้า" ในหน้าคำสั่งซื้อ เลือกเหตุผล "<ได้รับสินค้าผิด/ชำรุด>" แล้วแนบรูปไว้นะคะ แอดมินจะกดยอมรับให้ทันทีค่ะ

## T5 Refund or return request
Accept (see `returns-and-bad-reviews` decision table):
> ได้เลยค่ะ รบกวนกดขอคืนเงินในหน้าคำสั่งซื้อ แอดมินจะอนุมัติภายใน <x> ชั่วโมงค่ะ <ถ้าต้องส่งคืน: ส่งคืนผ่านช่องทางของแพลตฟอร์มได้เลย ไม่มีค่าใช้จ่ายค่ะ>

Change of mind, unopened, inside the policy window:
> รับคืนได้ค่ะ ขอให้สินค้ายังไม่แกะซีลและอยู่ในสภาพเดิมนะคะ กดขอคืนในหน้าคำสั่งซื้อภายใน <วันที่> ได้เลยค่ะ

Outside policy (decline politely, offer something):
> แอดมินเข้าใจคุณลูกค้านะคะ แต่สินค้าเลยระยะคืนตามนโยบาย (<x> วันหลังได้รับ) แล้วค่ะ ถ้าสินค้ามีปัญหาการใช้งาน แอดมินยินดีช่วย <ซ่อม/เปลี่ยนชิ้นส่วน/ให้คำแนะนำ> ค่ะ

## T6 Politely declining a discount
> ขอบคุณที่สนใจนะคะ 😊 ราคานี้เป็นราคาที่ดีที่สุดของร้านแล้วค่ะ เพราะ <ผ้าหนา 12 ออนซ์ เย็บสองชั้น> ค่ะ ถ้าสั่ง <2> ชิ้นขึ้นไป ใช้โค้ด <โค้ด> ลดได้อีก <x> บาท หรือกดติดตามร้านไว้ รอบแคมเปญ <วันที่> จะมีโค้ดลดค่ะ

Never: "ลดไม่ได้ค่ะ" alone, or a private discount sent off-platform.

## T7 When will it ship
> สั่งและชำระก่อน <14:00> ส่งออกวันเดียวกันค่ะ หลังจากนั้นส่งวันทำการถัดไป ปกติ <กรุงเทพฯ 1–2 วัน ต่างจังหวัด 2–4 วัน> ค่ะ (ตามระบบขนส่ง)

## T8 Receipt or tax invoice
VAT-registered shop:
> ออกใบกำกับภาษีเต็มรูปได้ค่ะ รบกวนแจ้งชื่อบริษัท ที่อยู่ เลขประจำตัวผู้เสียภาษี 13 หลัก และสาขา (สำนักงานใหญ่/สาขาที่) ค่ะ

Not VAT-registered:
> ร้านยังไม่ได้จดทะเบียนภาษีมูลค่าเพิ่ม จึงออกใบกำกับภาษีไม่ได้ค่ะ ออกเป็นใบเสร็จรับเงินได้ค่ะ

## Auto-reply after hours
> สวัสดีค่ะ ขอบคุณที่ทักร้าน <ชื่อร้าน> นะคะ ตอนนี้นอกเวลาทำการ (<เวลาทำการ>) แอดมินจะตอบกลับภายใน <เวลา> ค่ะ ระหว่างนี้กดสั่งได้ตามปกติ ระบบจะจัดส่งตามรอบค่ะ
