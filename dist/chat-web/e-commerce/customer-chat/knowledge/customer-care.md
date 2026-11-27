# skill: customer-care

Use when a Thai seller answers buyer chat, returns or bad reviews

# customer-care — chat replies, returns and public reviews

> **One rule:** every reply uses the shop's written policy and the order's real facts; a reply never promises what the policy does not give.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Reply to a buyer's chat (price, stock, late parcel, haggling) | [references/chat-reply-templates.md](references/chat-reply-templates.md) |
| A return, refund or bad review came in | [references/returns-and-bad-reviews.md](references/returns-and-bad-reviews.md) |
| Public answer to a review | [references/review-replies.md](references/review-replies.md) |

Ready-made wording: [references/templates.md](references/templates.md). Worked case: [references/worked-example.md](references/worked-example.md).

## Steps every part shares

1. Read the order, the chat and the tracking status; write `(รอยืนยัน)` for any fact you do not have.
2. Check the shop's written policy; if it is silent or contradicts itself, ask the owner before drafting.
3. Fill every `<...>` in a template with a real fact before sending.

## Check before done

- Never move a buyer off-platform to pay, and never give a LINE ID or phone number on Shopee, Lazada or TikTok Shop.
- Never ask a buyer to delete or change a review in exchange for money or a gift.
- Never put another customer's name, phone or address in a reply, and never blame the courier in public.
- No refund, discount or compensation that the owner has not approved.
- Check each platform's response deadline for returns and disputes in its Seller Centre, and write the date checked.

Whole job with several steps → playbook [customer-issue](../superuser/references/playbook-customer-issue.md).


## reference: chat-reply-templates.md

<!-- merged from skill `chat-reply-templates` on 2026-11-27 · description was: Use when a Thai seller replies to buyer chat on marketplaces -->
# Chat Reply Templates (Thai)

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, the client or the project already has its own format:

- **What to look at:** the shop's voice: the last 10–20 real messages the shop sent to customers (pasted by the user or in a file) · the sentence endings used (ค่ะ · ครับ · คะ · จ้า) · how the shop addresses customers · emoji · the shop's return policy and shipping times
- **Result:** if found, use it (headings, order, field names, running numbers) and say in the reply which file the format came from. If not found, use the templates in this file as the fallback and say that no existing format was found
- **Every format still needs the content:** templates T1–T5 are the skeleton of the content, while the wording and voice are the shop's. If there are no chat samples, ask the user one question about how the shop speaks, then continue

## Workflow

1. **Read the order first** — order number, items, paid or not, ship date, tracking status, chat history
2. **Pick the template** from the table and from [templates](templates.md)
3. **Fill every `<...>`** with real facts; never send a template with a blank or a guessed date
4. **Match the voice** — ค่ะ or ครับ consistently; the shop's name for itself (แอดมิน / ร้าน <name>)
5. **Say the next step and when** — "แอดมินจะแจ้งกลับภายใน 17:00 วันนี้ค่ะ" and then actually do it
6. **Log** recurring questions; 3 of the same question in a week means the listing or FAQ auto-reply is missing it

## Which template

| Buyer says | Template | Check first |
|---|---|---|
| ราคาเท่าไหร่ / ลดได้ไหม | T1 price · T6 decline discount | current price and running vouchers |
| มีของไหม / มีสีนี้ไหม / ไซซ์ไหนดี | T2 stock & size | master sheet (`shop-operations`), size chart |
| ของยังไม่มา | T3 late parcel | tracking page, courier status, platform's estimated date |
| ได้ของผิด / ไม่ครบ / ชำรุด | T4 wrong or damaged item | photos/video from buyer, packing record |
| ขอคืนเงิน / ขอคืนสินค้า | T5 refund | decision table in `returns-and-bad-reviews.md` |
| ส่งของวันไหน | T7 shipping time | cut-off time, today's shipments |
| ขอใบเสร็จ / ใบกำกับภาษี | T8 receipt | VAT-registered or not (`thai-tax`) |

## Which chat first

When chats pile up, answer by money at risk and deadline, not by arrival order:

| Order | Chat | Why first |
|---|---|---|
| 1 | Return or refund request, or open dispute, with little time left to respond | a missed deadline is usually an automatic refund (`returns-and-bad-reviews.md`, return windows table; the deadlines there are still รอยืนยัน, so read them in Seller Centre) |
| 2 | Buyer mentions สคบ., police report, lawyer, or posting publicly | escalate to the owner the same hour; reply with facts only |
| 3 | Same buyer writing for the 2nd or 3rd time about one order | each extra message means the last answer did not solve it |
| 4 | Late parcel, wrong or damaged item | money and a review at stake |
| 5 | Pre-sale questions (price, stock, size) | a sale to win, no loss yet |

## Rules

- **Reply from the shop's written policy.** If the buyer asks for something the policy does not give (return after the window, extra compensation), draft a polite no with what the shop *can* do. If the policy says nothing or contradicts itself, ask the owner before drafting; do not invent a policy in the reply. Never offer a refund or exchange while a dispute is open on the platform; the platform's process decides
- Return windows and how to count their days: `returns-and-bad-reviews.md` "Return windows"
- Answer within the platform's expected window during shop hours; set an auto-reply for after hours that says when a person will answer
- Never send a buyer to pay outside Shopee, Lazada or TikTok Shop, or give a LINE ID or phone number there — it breaks platform rules and removes buyer protection
- Never blame the courier or the buyer; state facts and the fix
- Never promise a delivery date the courier has not shown
- Never paste another buyer's details, and never ask for a buyer's ID card or bank account in chat (refunds go through the platform)
- Keep emoji to 1–2 per message; no stickers in complaint chats
- Thai text → `human-writing` `thai-grammar.md` section 4, the shop-chat register · put the shop name or แอดมิน in once at the start; later sentences can leave it out
- Quotation or tax invoice for a business buyer → `thai-business-docs`
- LINE shop auto-replies → `line-oa` · rich menu image → `graphic-design:line-design` (if installed)

## Related

- `returns-and-bad-reviews.md` — refunds and public review replies
- `pricing-and-costs` — courier claims for lost parcels

## References

- [`worked-example.md`](worked-example.md) — open when you want a filled-in late-parcel reply (T3)

## Run as a command

`/e-commerce:customer-care <platform> <what the customer wrote> [order status, photos, shop voice]`

Run `customer-care` (and `returns-and-bad-reviews.md` for returns, refunds and reviews) with the `customer-chat` agent for: **the user's request**

Give one ready-to-send reply, plus the next action for the seller (refund, resend, open a dispute, nothing).


## reference: returns-and-bad-reviews.md

<!-- merged from skill `returns-and-bad-reviews` on 2026-11-27 · description was: Use when a Thai seller gets a return or bad review -->
# Returns and Bad Reviews

Decide by rule, not by mood.

## Return windows (buyer side)

| Platform | Standard window | Notes |
|---|---|---|
| Shopee | 15 days from receipt ("คืนสินค้าได้ใน 15 วัน" / 15 Days Free Return on eligible items) (รอยืนยัน) | Some categories excluded; the seller agrees or disputes in Seller Centre within the response deadline (รอยืนยัน) |
| Lazada | 15 days from delivery for most sellers (รอยืนยัน); LazMall may differ | Change-of-mind returns depend on category and programme (รอยืนยัน) |
| TikTok Shop | 7 days after delivery (ทั่วไป); 15 days with free return for Mall (รอยืนยัน — no official Thai page found; check Seller Center) | "No longer needed" return reasons exist on some items (รอยืนยัน) |
| LINE / Facebook | Whatever the shop states | State it in the description and the chat auto-reply; consumer law still protects against defective goods |

Count every window from the date the parcel was actually delivered (tracking), not the order date; if only an estimate is known, say the count is from the estimated date.

The windows above are from one third-party source, not an official page — confirm each window and response deadline in the platform's own Seller Centre help page before relying on it (รอยืนยัน). Sources and check dates: [references/sources.md](sources.md)

## Workflow — return or refund request

1. **Read the request and evidence** — reason, photos, unboxing video, order history of this buyer
2. **Check your evidence** — packing video, weight at drop-off, tracking events
3. **Decide with the table** below; reply with `chat-reply-templates.md` T4 or T5
4. **Act inside the platform's deadline** — a missed deadline is usually an automatic refund to the buyer
5. **Inspect returned goods** before restocking; sellable → `on_hand`, defective → `damaged` (`shop-operations`)
6. **Log the cause** — wrong item, size, damage, courier, misleading listing; fix the listing or packing if a cause repeats 3 times a month

## Decision table

| Situation | Action |
|---|---|
| Wrong item / missing item, and your packing video does not prove otherwise | Accept; send correct item or refund; apologise |
| Damaged in transit, buyer has photos | Accept; refund or resend; claim from courier (`pricing-and-costs`) |
| Defective product | Accept; refund or replace; check the batch |
| Item value under about ฿100–150 and return shipping costs more | Refund without return ("คืนเงินโดยไม่ต้องคืนสินค้า") if the platform allows |
| Change of mind, unopened, inside window | Accept per platform policy |
| Change of mind, used or opened hygiene item (cosmetics, underwear) outside policy | Decline politely with the policy; offer help |
| Buyer claims "not received", tracking shows delivered with photo/signature | Send the proof; ask buyer to check with household/guard; dispute only if buyer refuses |
| Your packing video clearly shows the correct, complete item | Dispute through the platform with the video |
| Same buyer, third suspicious claim | Dispute with evidence; report the account to the platform |

Dispute only when both are true. (1) Hard rule: you hold proof (packing video, or tracking with photo or signature); no proof → refund fast. (2) The expected value is above ฿100 (starting value, not yet measured; raise it if disputes take your time or hurt your rating):

```
expected value = chance of winning x value at stake - cost of your time
value at stake = refund amount + shipping lost (+ rating points at risk, only if you can put a baht figure on them)
cost of time   = minutes spent x your hourly rate / 60
```

Start from a chance of winning of 0.7 for a clear video and 0.5 for tracking proof only (starting value, not yet measured; replace with the shop's own win rate once 10 disputes are logged). Example: ฿400 item, video proof, 20 minutes at ฿150 an hour → 0.7 x 400 - 50 = ฿230 → dispute. ฿120 item, tracking only, 20 minutes → 0.5 x 120 - 50 = ฿10, below ฿100 → refund fast and keep the rating. When the outcome hangs on a platform ruling you cannot estimate, `decision-desk/decision-scoring` command `payoff` compares dispute vs refund across scenarios. The numbers are information; the seller decides.

## Review replies

Bad reviews stay public; your reply is read by the next 1,000 buyers, not by the reviewer. Templates in [review replies](review-replies.md).

Do:

- Reply within 24–48 hours, short, calm, in the same language as the review
- Thank, acknowledge the specific problem, state what was done or offered, invite to chat
- State facts that help future buyers ("สินค้าไซซ์เล็กกว่าปกติ แนะนำเพิ่มหนึ่งไซซ์ ร้านเพิ่มตารางไซซ์แล้วค่ะ")
- Write for the next buyer, not the reviewer: answer the doubt a stranger has after reading the review, then stop. The reviewer gets the personal part in chat
- Sizing or fit complaint → name the measurement that caused it, the fix in the listing (size chart added, "สั่งเพิ่ม 1 ไซซ์"), and that exchange is open — a fit reply that removes the next buyer's doubt is the one that sells
- Thai text → `human-writing` `thai-grammar.md` section 4, register: shop chat · use direct verbs ("ร้านส่งของใหม่ให้แล้ว", not "ร้านได้ส่ง…แล้ว") · promise 1 change that really happens, not "กำลังปรับปรุง" (being improved)

Don't:

- Argue, blame the buyer or the courier by name, or use sarcasm
- Post the order number, order details, the buyer's name, phone or address — one order number lets anyone look up the buyer
- Offer money, a coupon or a gift **in exchange for changing or deleting a review** — platforms treat it as review manipulation
- Buy fake reviews or ask friends to post them — penalties and possible removal
- Report a review only because it is negative; report it only if it breaks rules (abuse, personal data, spam, wrong product)

## Monthly review of reviews

Replying one review at a time fixes the reply, not the cause. Once a month, read the low reviews together:

1. Pull all 1–3 star reviews from the last 90 days on every platform. If a source cannot be pulled, name it in the report ("TikTok Shop not included: export failed"), never skip it silently. Fewer than 6 low reviews a quarter: do not shrink to a 30-day window, it is too few to show a pattern.
2. Group them into 3–5 themes (size runs small, parcel crushed, colour differs from photo, slow shipping). Count reviews per theme, and sort by count, not by how angry the words are.
3. Under each theme quote 2–3 reviews word for word, without rewording. Remove the buyer's name, order number and anything else that identifies them, as in the "Don't" list above.
4. Check the order data for the same theme before it becomes a review: returns with the same reason, chats asking the same question (`chat-reply-templates.md` step 6).
5. End with 3 things to do this week tied to the top theme, each one concrete (add a size chart, change box size, retake the photo in daylight).

Low-review replies still follow the rules above; the monthly review never offers anything for changing a review.

## Related

- `chat-reply-templates.md` (T4, T5), `pricing-and-costs` (claims), `shop-operations` (damaged stock), `sales-copy` (fix the cause in the listing)
- [`review-replies.md`](review-replies.md) — reply templates · [`sources.md`](sources.md) — sources and check dates for the return windows


## reference: review-replies.md

# Public review reply templates (Thai)

Short is better — keep ขอโทษ / ขอบคุณ / นะคะ, and cut only repeated facts. Fill `<...>`; never include order details or personal data.

Thai text → `human-writing` `references/thai-grammar.md` section 4, the shop-chat register

## Product defect (1–2 stars)
> ขอโทษคุณลูกค้าจริง ๆ ค่ะที่ได้รับสินค้า<ปัญหา> ร้านทักแชทไป <เปลี่ยนสินค้าใหม่/คืนเงิน> ให้แล้วนะคะ และส่งล็อตนี้ตรวจเพิ่มแล้วค่ะ ขอบคุณที่แจ้งให้ร้านทราบค่ะ

## Late delivery (not the shop's fault)
> ขอโทษที่ทำให้รอนานนะคะ ร้านส่งออกภายในวันที่สั่ง แต่พัสดุล่าช้าระหว่างขนส่ง ร้านตามกับขนส่งให้แล้ว และ <สิ่งที่เปลี่ยนจริง 1 อย่าง เช่น ตอนนี้ตัดรอบส่งวันละ 2 รอบแล้ว>ค่ะ ขอบคุณที่อดทนรอค่ะ

## Size or colour not as expected
> ขอบคุณสำหรับรีวิวค่ะ สินค้ารุ่นนี้ <ไซซ์ค่อนข้างเล็ก/สีจริงเข้มกว่าในรูปเล็กน้อย> ร้านเพิ่ม <ตารางไซซ์/รูปถ่ายแสงธรรมชาติ> ในหน้าสินค้าแล้วค่ะ หากต้องการเปลี่ยนไซซ์ ทักแชทได้เลยนะคะ

## Wrong item sent
> ขอโทษจริง ๆ ค่ะที่ร้านส่งสินค้าผิด ร้านส่งของใหม่ให้แล้ว และเพิ่มขั้นตอนตรวจก่อนแพ็กทุกออเดอร์ค่ะ

## Review that is unfair or factually wrong
> ขอบคุณที่แสดงความคิดเห็นค่ะ ร้านตรวจสอบแล้วพบว่า <ข้อเท็จจริงสั้น ๆ เช่น สินค้าจัดส่งครบตามวิดีโอขณะแพ็ก> หากยังมีข้อสงสัย ทักแชทร้านได้ตลอดนะคะ ร้านยินดีช่วยค่ะ

## 3 stars, mixed
> ขอบคุณสำหรับรีวิวค่ะ ดีใจที่ชอบ<ข้อดีที่ลูกค้าบอก> ส่วนเรื่อง<ข้อติ> ร้านรับไปปรับปรุงแล้วค่ะ

## 5 stars (short, varied — do not paste the same line on every review)
> ขอบคุณมากค่ะ ดีใจที่ <สินค้า> ถูกใจนะคะ 😊


## reference: sources.md

# Sources · returns-and-bad-reviews

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bigseller.com/blog/articleDetails/tiktok-shop-launches-no-longer-needed-return-policy.2213.htm · the windows above are from one third-party source, not an official page — confirm each window and response deadline in the platform's own Seller Centre help page before relying on it (รอยืนยัน)


## reference: templates.md

# Thai chat templates

Swap ค่ะ/คะ for ครับ to match the shop voice. Fill every `<...>`.

Thai text → `human-writing` `references/thai-grammar.md` section 4, the shop-chat register

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
> ขอโทษที่ทำให้รอนะคะ 🙏 แอดมินเช็กให้แล้วค่ะ ส่งออกวันที่ <วันที่> เลขพัสดุ <เลข> ตอนนี้อยู่ที่ <สถานะล่าสุด> (<วันที่>) ระบบประเมินถึงภายใน <ช่วงวันที่> ค่ะ ถ้าเลยวันที่ <วันที่> แล้วยังไม่ได้รับ ทักมาได้เลยนะคะ จะตามกับขนส่งให้ทันทีค่ะ

Stuck 3+ days or marked delivered but not received:
> แอดมินเปิดเรื่องติดตามกับ <ขนส่ง> ให้แล้วค่ะ เลขเรื่อง <เลข> ถ้าพัสดุสูญหายจริง คุณลูกค้าจะได้รับสินค้าใหม่หรือคืนเงินเต็มจำนวนค่ะ แอดมินจะแจ้งผลภายใน <วันที่/เวลา> ค่ะ

## T4 Wrong, missing or damaged item
> ขอโทษจริง ๆ ค่ะ 🙏 รบกวนส่งรูปสินค้าที่ได้รับ ป้ายพัสดุ และวิดีโอตอนแกะกล่อง (ถ้ามี) ให้แอดมินดูหน่อยนะคะ แอดมินจะ <ส่งของที่ถูกต้องให้ใหม่ / ส่งชิ้นที่ขาดตามไป> ภายใน <วันที่> โดยคุณลูกค้าไม่ต้องเสียค่าส่งเพิ่มค่ะ

If the case must go through the platform:
> เพื่อให้คุณลูกค้าได้รับความคุ้มครองเต็มที่ รบกวนกด "คืนเงิน/คืนสินค้า" ในหน้าคำสั่งซื้อ เลือกเหตุผล "<ได้รับสินค้าผิด/ชำรุด>" แล้วแนบรูปไว้นะคะ แอดมินจะกดยอมรับให้ทันทีค่ะ

## T5 Refund or return request
Accept (see `returns-and-bad-reviews.md` decision table):
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


## reference: worked-example.md

# Worked example · chat-reply-templates

Buyer (Shopee): "สั่งไปตั้งแต่วันที่ 2 ยังไม่ได้เลย ร้านโกงหรือเปล่า"
Check: shipped 3 Oct with Flash, tracking shows "ถึงศูนย์คัดแยก ขอนแก่น" on 5 Oct, platform estimate 6–8 Oct.

Reply (T3 filled):
> สวัสดีค่ะคุณลูกค้า ขอโทษที่ทำให้รอนะคะ 🙏 แอดมินเช็กให้แล้วค่ะ พัสดุส่งออกวันที่ 3 ต.ค. เลขพัสดุ TH123456789 ตอนนี้อยู่ที่ศูนย์คัดแยกขอนแก่น (5 ต.ค.) ระบบประเมินว่าจะถึงภายใน 6–8 ต.ค. ค่ะ ถ้าถึงวันที่ 8 แล้วยังไม่ได้รับ ทักมาได้เลยนะคะ จะตามกับขนส่งให้ทันทีค่ะ
