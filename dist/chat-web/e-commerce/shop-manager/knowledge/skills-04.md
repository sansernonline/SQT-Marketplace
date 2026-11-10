# skill: shop-daily-briefing

Use when a Thai online seller starts the day and asks what to handle first (late orders, pending returns, unanswered chats, low stock).

# Shop Daily Briefing

Part of plugin `e-commerce`. Wording follows `human-writing`. Turns this morning's order, chat and stock exports into 3–6 decisions for today, most money at risk first.

> **One rule:** every item comes from data pulled today, carries a number and a deadline, and ends with the next step. Yesterday's numbers are not today's briefing.

## Use when / not when

| Situation | Use |
|---|---|
| "วันนี้ต้องทำอะไรก่อน", start of the shop day, after a campaign night, back from a day off | this skill |
| Sync stock across platforms, reorder points | `multi-shop-stock` |
| Write the reply to one chat | `chat-reply-templates` |
| Decide one return, dispute or review | `returns-and-bad-reviews` |
| Will cash run short in the coming weeks | `cash-flow` |
| Weekly or monthly review of reviews | `returns-and-bad-reviews`, monthly review |

## Steps

1. **Ask for today's exports**, not a summary from memory. Per platform (Shopee, Lazada, TikTok Shop, LINE or Facebook orders): orders to ship, orders past their ship-by time, open return or refund requests and disputes, unanswered chats, and the master stock sheet. A source the owner cannot export today is named in the briefing as missing; never fill it from yesterday.
2. **Collect candidate items** from 6 checks:

| Check | Item when | Next step points to |
|---|---|---|
| Orders past or near ship-by time | any order whose ship-by time is today or passed | pack and hand over before the courier cut-off; late shipping can cost shop rating points (รอยืนยัน the penalty in each Seller Centre) |
| Return, refund or dispute requests | any request with a response deadline today or tomorrow | `returns-and-bad-reviews` decision table; a missed deadline is usually an automatic refund |
| Payment problems | COD refused parcels coming back, unpaid LINE or Facebook orders older than the shop's hold time | cancel or chase per shop policy |
| Parcels stuck | tracking unchanged for longer than the courier's normal time | open a courier claim (`shipping-compare`) and tell the buyer (`chat-reply-templates` T3) |
| Stock | SKU at or below its reorder point, or oversold (negative available) | `multi-shop-stock`: stop selling on extra channels, reorder |
| Chats | unanswered chats, sorted by the "Which chat first" table | `chat-reply-templates` |

3. **Rank** by baht at risk first (order value, refund amount, sales lost per day of stock-out), then by the nearest deadline.
4. **Write 3–6 items**, each 1 line: what, how many, baht at risk, deadline, next step. Example shape: "ออเดอร์ 4 ใบเลยเวลาเตรียมส่ง รวม 2,360 บาท · ส่งให้ทันรอบรถ 17:00 วันนี้".
5. **Fold the rest** into 1 line with the count ("อีก 9 เรื่องเล็ก: แชตถามสินค้า 7 · สต็อกใกล้จุดสั่ง 2"). More than 6 items in the list means nothing stands out.
6. **Stop there.** The briefing lists decisions; the owner picks. Do not send replies, cancel orders or reorder from inside the briefing.

Ship-by and response deadlines differ by platform and change often. Read them from the shop's own Seller Centre and write the date checked next to them (รอยืนยัน each platform's current rule; none are stored in this skill).

## Worked example

Exports at 08:30 (illustrative numbers): Shopee 23 orders to ship, 4 of them past ship-by; Lazada 1 return request due tomorrow, ฿890; TikTok Shop 2 parcels with no tracking update for 5 days; master sheet shows `BAG-TOTE-BLK-L` available 12, reorder point 126; 14 unanswered chats, 1 says "จะแจ้ง สคบ.".

Briefing:

1. Shopee ออเดอร์ 4 ใบเลยเวลาเตรียมส่ง รวม ฿2,360 · แพ็กก่อน ส่งทันรอบรถ 17:00
2. แชตลูกค้าขู่แจ้ง สคบ. (ออเดอร์ ฿1,250) · เจ้าของตอบเองภายในชั่วโมงนี้ ด้วยข้อเท็จจริงเท่านั้น
3. Lazada คำขอคืน ฿890 ครบกำหนดตอบพรุ่งนี้ · ตัดสินตามตารางใน `returns-and-bad-reviews`
4. `BAG-TOTE-BLK-L` เหลือ 12 ชิ้น ต่ำกว่าจุดสั่ง 126 · ขายแค่ช่องทางเดียว และสั่งของวันนี้ (รัน `stock-calc.mjs`)
5. TikTok Shop พัสดุ 2 ชิ้นไม่ขยับ 5 วัน (฿640) · เปิดเคลมกับขนส่งและแจ้งลูกค้า
6. อีก 13 แชตถามสินค้า · ตอบหลังข้อ 1–5

## Check before handing over

1. Every item has a number in baht or units, a deadline and a next step.
2. No more than 6 items; the rest folded into 1 line.
3. Every source used was exported today; missing sources are named.
4. No platform deadline is stated as fact without the Seller Centre date checked.

## Sources

- Anthropic `anthropics/commerce-agents` (Apache-2.0) merchant-agent `inventory-operations` ("The daily briefing") and `anthropics/knowledge-work-plugins` (Apache-2.0) small-business `ticket-deflector` (proactive order triage), read 2026-11-10 through the lead's research notes. Ideas only, rewritten for Thai marketplaces; no text copied.


---

# skill: doc-quotation

Use when issuing a Thai quotation, invoice, billing note or receipt (VAT, withholding, total in words).

# Thai Sales Documents — quotation to receipt

The right documents at the right time prevent arguments about payment. This is general information, not tax advice. The company's accountant (นักบัญชี) has the final word on tax documents.

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** ใบเสนอราคา ใบแจ้งหนี้ หรือใบเสร็จฉบับก่อนของบริษัท (ไฟล์ที่ผู้ใช้ให้ หรือใน `docs/` · `ref/`) → ดูหัวกระดาษ เลขรัน เงื่อนไขชำระเงิน และหมายเหตุท้ายเอกสาร
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** เลขรันต่อจากฉบับล่าสุด · ช่องที่กฎหมายบังคับในข้อ 2 ต้องครบไม่ว่าใช้แบบไหน

## 1. Which document, when

| Document | Purpose | When issued | Legal weight |
|---|---|---|---|
| **ใบเสนอราคา** (quotation, QT) | offer of price and terms | before the sale | becomes a contract when the customer signs/accepts (often with a purchase order, PO) |
| **ใบแจ้งหนี้** (invoice) | asks for payment | on delivery or milestone | commercial only — not a tax document |
| **ใบวางบิล** (billing note) | lists several invoices to be paid on the customer's pay run | to the customer's accounts payable (AP) team on their billing day | commercial only; customer signs receipt of the bill |
| **ใบเสร็จรับเงิน** (receipt) | proves money received | when paid | evidence of payment (keep a copy) |
| **ใบกำกับภาษี** (tax invoice) | evidence of output VAT; lets the buyer claim input VAT | at the **tax point** — goods: on delivery; services: when payment is received | only a VAT-registered business may issue it; required fields under ม.86/4 |

Combined forms are normal: "ใบแจ้งหนี้/ใบกำกับภาษี" (goods) and "ใบเสร็จรับเงิน/ใบกำกับภาษี" (services, issued on payment). Not VAT-registered → never show VAT or the word ใบกำกับภาษี.

## 2. Required fields

| Field | QT | Invoice | Billing note | Receipt | Tax invoice |
|---|---|---|---|---|---|
| Seller name, address, เลขประจำตัวผู้เสียภาษีอากร 13 digits | ✓ | ✓ | ✓ | ✓ | ✓ + "สำนักงานใหญ่" or "สาขาที่ ..." |
| Customer name and address | ✓ | ✓ | ✓ | ✓ | ✓; buyer tax ID + branch if the buyer is VAT-registered |
| Document number and date | ✓ | ✓ | ✓ | ✓ | ✓ (and book number if used) |
| Items: description, quantity, unit, unit price, amount | ✓ | ✓ | invoice list | ✓ | ✓ |
| Subtotal, VAT 7% shown separately, total | ✓ | ✓ | total due | ✓ | ✓ (VAT **must** be separate) |
| Total in Thai words | ✓ | ✓ | ✓ | ✓ | ✓ |
| Validity date (ยืนราคาถึง) | ✓ | | | | |
| Payment terms and bank account / PromptPay QR | ✓ | ✓ | ✓ | | |
| Signature of issuer / receiver | ✓ | | ✓ (customer signs receipt of bill) | ✓ (ผู้รับเงิน) | |

Full tax-invoice field list, abbreviated invoices and e-Tax: `e-tax-invoice`. VAT 7% is the rate until 30 Sep 2570; VAT registration is compulsory above 1.8 million baht revenue a year (`tax-vat-th`).

## 3. Numbering

- 1 running series per document type: `QT2610-0001`, `IV2610-0001`, `BN…`, `RC…`, tax invoices `TX2610-0001` (prefix + YYMM + running).
- Tax invoices: 1 series **per branch**, no gaps, no reuse. To fix a wrong one, cancel it (stamp "ยกเลิก", keep all copies) and reissue with a new number that refers to the old one. Or correct it with a credit/debit note (ใบลดหนี้/ใบเพิ่มหนี้).
- Keep copies 5 years minimum, 7 recommended (`sme-bookkeeping` section 2 — per a Revenue Department ruling, not yet checked against the current statute).

## 4. VAT and withholding tax lines — worked example

Service fee 50,000 to a company client that withholds 3% (service, see `tax-vat-th` for rates).

| Line | Baht |
|---|---|
| ค่าบริการ (รวมเป็นเงิน) | 50,000.00 |
| ภาษีมูลค่าเพิ่ม 7% | 3,500.00 |
| **รวมทั้งสิ้น** | **53,500.00** |
| หัก ภาษี ณ ที่จ่าย 3% (on 50,000, before VAT) | −1,500.00 |
| **ยอดชำระสุทธิ** | **52,000.00** |

Total in words: **ห้าหมื่นสามพันห้าร้อยบาทถ้วน**; net payment: ห้าหมื่นสองพันบาทถ้วน.

- Withholding tax (WHT) base excludes VAT. The client gives you **50 ทวิ** for 1,500 — keep it; it is credited against your income tax.
- Because this is a service, the tax invoice is issued **when the 52,000 arrives** (receipt/tax invoice for the full 53,500, noting WHT 1,500).
- The quotation should say "ราคายังไม่รวม VAT 7%" or "รวม VAT แล้ว" — never leave it ambiguous.

Thai amount-in-words rules: 1 = หนึ่ง alone, but a trailing 1 after tens/hundreds is "เอ็ด" (21 ยี่สิบเอ็ด, 101 หนึ่งร้อยเอ็ด); 20 = ยี่สิบ; whole baht end with "ถ้วน"; satang: 1,234.50 = หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์.

In code, use a tested library rather than writing the rules again: npm `thai-baht-text` (antronic/thai-baht-text-js, MIT, has unit tests) — `ThaiBahtText(10050)` → หนึ่งหมื่นห้าสิบบาทถ้วน. Still spot-check เอ็ด, ยี่สิบ and satang cases against the rules above. ตรวจล่าสุด 2026-10-23 · แหล่ง: https://github.com/antronic/thai-baht-text-js

## 5. Workflow

1. Confirm: seller VAT-registered? buyer company (WHT) or person? goods or service (tax point)?
2. Quotation with validity (usually 15–30 days) and terms (เครดิต 30 วัน, deposit %, delivery).
3. Customer accepts → PO or signed QT.
4. Deliver → invoice (goods: invoice/tax invoice).
5. Customer's billing day → billing note listing open invoices.
6. Paid → receipt (services: receipt/tax invoice); collect 50 ทวิ if withheld.
7. File: output VAT in รายงานภาษีขาย for ภ.พ.30 (`tax-vat-th`).

Templates for all 5 documents: [references/templates.md](references/templates.md).

## Script

Run `thai-doc-total.mjs` for every document with money on it: do not add up, take VAT or write the amount in Thai words by hand. It follows section 4: line = quantity × price − discount; VAT is rounded once on the whole document, not per line; withholding tax is taken on the amount before VAT; net payment = total − withholding. It prints the total and the net as Thai words (`…บาทถ้วน` or `…บาท…สตางค์`). Its self-test reproduces the 50,000 example in section 4 (53,500 · 1,500 · 52,000) and checks เอ็ด, ยี่สิบ, satang and million cases.

```
node thai-doc-total.mjs <file.json> [--json]     # example file: scripts/example.json
node thai-doc-total.mjs --self-test
```

Input file: `{ "items": [ { "name": "...", "qty": 1, "price": 50000, "discount": 0 } ], "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }` · `vatMode` is `exclusive` (prices exclude VAT, the default) · `inclusive` (prices already include VAT) · `none` (seller not VAT-registered). `discount` is baht off that line. `vatRate` defaults to `vat_pct` in `scripts/rates.json` (7%, checked 2026-10-25, reduced rate ends 30 Sep 2570); the script warns when that file is older than 90 days or the end date has passed — then check rd.go.th and update `rates.json` or pass `vatRate`. A document total above 9,999,999,999.99 baht stops the script (satang and Thai words stay exact only below that); split it into several documents. `whtRate` defaults to 0. A tax ID that fails the check digit gives a warning, not a stop. A bad field stops the script with a message naming it.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/doc-quotation/scripts/thai-doc-total.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/doc-quotation/scripts/thai-doc-total.mjs` · Node only, no dependencies.

## 6. Chasing overdue invoices (ตามหนี้ลูกค้าเครดิต)

For a batch of B2B buyers, resellers and agents on credit terms, at month end or billing day. One awkward message to one customer → `polite-message-th-en` (plugin `superuser`), whose tone ladder the levels below follow. Process from Anthropic's invoice-chase skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), rewritten for Thai sellers; no text copied.

1. **Check the bank first, every time.** Match each overdue invoice against deposits and PromptPay slips. A customer who paid anything in the last 14 days is not chased; mark "อาจจ่ายแล้ว ตรวจก่อน".
2. **Grade each customer by history**: pays on time · sometimes late · late again and again. The grade sets the tone of the message, not the amount.
3. **One message per customer**, listing all their overdue invoices with number, date, amount and days overdue, and the total.
4. **Show the owner a summary table first** (customer · invoices · total · days overdue · grade · level), then draft all messages. Nothing is sent until the owner approves each one.
5. **Pick the level**:

| Level | When | Message (LINE, the channel sellers actually use) |
|---|---|---|
| 1 Reminder | just past due, or a good payer | invoices, total, due dates, "หากชำระแล้วขออภัยและรบกวนส่งสลิปให้ด้วยนะคะ" + PromptPay QR for the total (`promptpay-qr`) |
| 2 Second request | about 2 weeks later, or a sometimes-late payer | same facts + ask for the date they will pay; offer to split a large amount |
| 3 Before stopping supply | still unpaid after level 2 | same facts + the date after which credit sales pause, only if the owner will really do it; a formal demand letter if the owner decides (`doc-thai-official`) |

Rules for every level:

- State facts and the next step. Never threaten, insult, shame, or tell anyone else about the debt (family, staff, a group chat, a public post). Never write the debt on the outside of an envelope.
- A business whose normal trade is giving credit may fall under the Debt Collection Act B.E. 2558 (พ.ร.บ.การทวงถามหนี้), which limits contact times, how often you contact, and what you may say (รอยืนยัน whether your shop is covered and the current rules, with a lawyer).
- Late-payment interest: if the contract sets no rate, default interest under the Civil and Commercial Code ม.224 is **5% a year** since 11 Apr 2564 (ม.7 rate 3% a year), per the Bank of Thailand, checked 2026-11-10: [bot.or.th article 3 Jul 2564](https://www.bot.or.th/th/research-and-publications/articles-and-publications/articles/Article_3Jul2021.html). Mention it only after level 2, and only if the owner wants to claim it.
- How long the shop can still sue for an unpaid sale (prescription) is limited by law (รอยืนยัน the period with a lawyer); do not let an invoice sit for years.


## Rules

- Words must match digits to the satang; check rounding of VAT per document, not per line.
- Add a PromptPay QR for the amount due (`promptpay-qr`).
- Output .docx or PDF. Never change an issued copy; any edit needs a new number.

## Related

`e-tax-invoice` · `tax-vat-th` · `promptpay-qr` · `doc-contract-th` · `seller-tax-basics`.

## เรียกเป็นคำสั่ง

`/e-commerce:doc-quotation <customer> <items and prices> [terms]`

Run `doc-quotation` with the `thai-doc-writer` agent for: **$ARGUMENTS**

Confirm VAT rate and payment terms before producing the final document; amounts in digits and Thai words must match exactly.


## reference: templates.md

# Sales document templates

Contents: 1. Quotation · 2. Invoice / tax invoice (goods) · 3. Billing note · 4. Receipt / tax invoice (services)

Placeholders in `{}`. Header block is the same on every document:

```
{ชื่อบริษัท} ({สำนักงานใหญ่ | สาขาที่ 00001})
{ที่อยู่} โทร {โทรศัพท์}
เลขประจำตัวผู้เสียภาษีอากร {13 หลัก}
```

## 1. ใบเสนอราคา (Quotation)

```
ใบเสนอราคา / QUOTATION                เลขที่ {QT2610-0001}   วันที่ {6 ต.ค. 2569}
เรียน {ชื่อลูกค้า} ที่อยู่ {…} เลขประจำตัวผู้เสียภาษี {…}

| ลำดับ | รายการ | จำนวน | หน่วย | ราคาต่อหน่วย | จำนวนเงิน |
| 1 | {…} | {…} | {…} | {…} | {…} |
                                   รวมเป็นเงิน      {…}
                                   ภาษีมูลค่าเพิ่ม 7%  {…}
                                   รวมทั้งสิ้น        {…}
({จำนวนเงินตัวอักษร})

ยืนราคาถึง: {วันที่}   กำหนดส่งมอบ: {…}   เงื่อนไขชำระ: {มัดจำ 50% / เครดิต 30 วัน}
ชำระโดยโอน: {ธนาคาร} {เลขบัญชี} ชื่อบัญชี {…} หรือ PromptPay QR
ผู้เสนอราคา ............ (……)            ผู้อนุมัติสั่งซื้อ ............ วันที่ ……
```

## 2. ใบแจ้งหนี้/ใบกำกับภาษี (goods, issued on delivery)

```
ใบแจ้งหนี้/ใบกำกับภาษี   (ต้นฉบับ)       เลขที่ {TX2610-0001}   วันที่ {…}
ลูกค้า {ชื่อ} {ที่อยู่} เลขประจำตัวผู้เสียภาษี {…} {สำนักงานใหญ่ | สาขาที่ …}
อ้างอิงใบสั่งซื้อ {PO…}   ครบกำหนดชำระ {…}
[ตารางรายการ เหมือนใบเสนอราคา]
มูลค่าสินค้า {…}  ภาษีมูลค่าเพิ่ม 7% {…}  รวมทั้งสิ้น {…}  ({ตัวอักษร})
```

## 3. ใบวางบิล (Billing note)

```
ใบวางบิล  เลขที่ {BN2610-0001}  วันที่ {…}   ลูกค้า {…}
| ลำดับ | เลขที่ใบแจ้งหนี้ | วันที่ | ครบกำหนด | จำนวนเงิน |
                                     รวม {…} ({ตัวอักษร})
ผู้วางบิล ............   ผู้รับวางบิล ............  วันที่นัดชำระ {…}
```

## 4. ใบเสร็จรับเงิน/ใบกำกับภาษี (services, issued on payment)

```
ใบเสร็จรับเงิน/ใบกำกับภาษี  เลขที่ {RC2610-0001}  วันที่ {วันที่รับเงิน}
ได้รับเงินจาก {ชื่อลูกค้า} {ที่อยู่} เลขประจำตัวผู้เสียภาษี {…} {สาขา}
| รายการ | จำนวนเงิน |
ค่าบริการ {…} | ภาษีมูลค่าเพิ่ม 7% {…} | รวม {…}
หักภาษี ณ ที่จ่าย {3%} {…} (ตามหนังสือรับรอง 50 ทวิ เลขที่ {…})   รับชำระสุทธิ {…}
ชำระโดย [ ] เงินสด [ ] โอน {ธนาคาร/วันที่} [ ] เช็ค {เลขที่}
ผู้รับเงิน ............
```
