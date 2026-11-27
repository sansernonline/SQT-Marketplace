# skill: buyer-help

Use when you, the buyer, weigh a big buy, want a refund or a warranty

# buyer-help — compare, get money back, complain and claim warranty

> **One rule:** keep every step in writing with a date and a deadline, and deal with the seller inside the platform chat or the official channel, never by paying a new fee.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Comparing products or services by total cost before a big purchase | [references/buy-compare.md](references/buy-compare.md) |
| Wants money back, a refund, or a card dispute | [references/refund-request.md](references/refund-request.md) |
| Faulty product or bad service, seller refuses, complain up the ladder | [references/complain.md](references/complain.md) |
| Filing warranty cards or preparing a warranty claim | [references/warranty-tracker.md](references/warranty-tracker.md) |

Other files in this folder: `complaint-letter.md`, `cancellation-notice.md`, `extended-warranty.md`, `review-trust.md`, and `templates/score-example.json` for the scoring example.

## Steps every part shares

1. Write the facts first: what was bought, from whom, when, how it was paid, what went wrong, and what the buyer wants. Missing facts are written `(รอยืนยัน)`.
2. Check every time-limited right on the first day (cooling-off, platform return window, card dispute window), because those deadlines come before anything else.
3. Send one request per message, with one date for the answer.

## Check before done

- General information, not legal advice. For a large sum, an injury or a contract the buyer signed, the buyer asks a lawyer (ทนายความ) or the สภาทนายความ legal aid centre.
- Keep all communication with the seller inside the platform chat; never move it to LINE or a phone call.
- If someone asks the buyer to pay a fee to get a refund, stop and check with `scam-check` (plugin `trading-finance`) or warn the buyer not to pay.
- Quote hotlines and office addresses only from the file, and tell the buyer to check them on the official site.
- Never draft threats, false public reviews or defamation; a public review states facts and dates only.

Whole job with several steps → playbook [buy-decision](../superuser/references/playbook-buy-decision.md), [complaint](../superuser/references/playbook-complaint.md), [refund](../superuser/references/playbook-refund.md) or [warranty-claim](../superuser/references/playbook-warranty-claim.md).


## reference: buy-compare.md

<!-- merged from skill `buy-compare` on 2026-11-27 · description was: Use before a big purchase in Thailand to compare total cost -->
# Buy and Compare

## Workflow

1. **Define the job** — what must it do, for how long, for whom. Write 2–3 must-haves (a "no" on any of these removes the option).
2. **Shortlist 2–4 options** — not 10.
3. **Total cost of ownership (TCO)** over the expected life, in baht.
4. **Decision matrix** — `decide.mjs score` with the budget as a hard rule (below).
5. **Review trust check** — [references/review-trust.md](review-trust.md).
6. **Where to buy** — official store / authorised dealer vs marketplace seller; warranty validity differs.
7. **Decide**, then log the purchase in `warranty-tracker.md`.

## Decision matrix

Score with `decision-desk/decision-scoring` command `score` (`node decide.mjs score <file.json>`), not by multiplying by hand. A hand total (365 vs 405) does not say whether the winner holds when a weight moves; the script shifts each weight ±20% and says `นิ่ง` (holds) or `ยังไม่นิ่ง` (flips).

| Step | Rule |
|---|---|
| Hard rules first (`must`, the option is dropped before scoring) | budget cap on the price you pay today (`max`) · any must-have from step 1 that is a number |
| Criteria (`better`) | TCO in baht from the section below (`low`), not a 1–5 guess · the rest 1–5 (`high`): core job, brand service in Thailand, warranty and service centres, size and fit, resale |
| Weights | 5–7 criteria, add to 1 · set them **before** scoring, otherwise people tune weights to justify the one they already like |
| Read the result line | `นิ่ง` → buy it · `ยังไม่นิ่ง` or `สูสี` → show the top 2 and the criterion that flips them; the buyer chooses, the score does not |

With only 2 options left, min-max scoring gives 0 and 100 on every criterion, so read the raw numbers in brackets too.

Worked run on the air-conditioner case (`templates/score-example.json`, run 2026-10-28), TCO of a 12,000 BTU unit over 7 years with the electricity rate and its check date, fixed-speed vs inverter → [references/tco-example.md](tco-example.md).

## Total cost of ownership

TCO = purchase price + delivery/installation + running costs × years + consumables + maintenance + financing cost − resale value.

| Cost item | Ask / find |
|---|---|
| Installation | Included? (air conditioners, water heaters often charge extra for pipes and brackets) |
| Electricity / fuel | Power rating or ฉลากประหยัดไฟเบอร์ 5 data × hours × rate |
| Consumables | Filters, ink, capsules, subscriptions |
| Maintenance | Cleaning service (e.g. air-con cleaning), servicing intervals |
| Financing | "0% 10 months" — is the cash price the same as the instalment price? |
| Resale | Phones and cars keep value differently by brand |

## Review trust check

Trust verified-purchase reviews with photos after weeks of use and reviews that name a drawback; distrust bursts of 5-star reviews, delivery-only praise and undisclosed paid creators. Sort by lowest rating and most recent. Full signal and red-flag lists → [references/review-trust.md](review-trust.md).

## Where to buy — warranty check

- Official / mall stores (Shopee Mall, LazMall, brand's own store) usually honour the Thai manufacturer warranty.
- Grey-import ("เครื่องหิ้ว", "ประกันร้าน") may have only the shop's warranty — price the risk.
- Keep the tax invoice or receipt; some brands require online registration within a set time (see `warranty-tracker.md`).

Related: `warranty-tracker.md` · `refund-request.md` · `scam-check` in `trading-finance` (if installed; deals that are too good) · `budget-and-debt` in `trading-finance` (if installed).

## เรียกเป็นคำสั่ง

`/e-commerce:buyer-help <product category> [option A] [option B] [budget]`

Run the `consumer-advocate` agent with the `buyer-help` skill: **the user's request**

1. Missing must-haves, budget or how long the user plans to keep it → mark `(รอยืนยัน)` and list them; the lead asks once at the start.
2. Recommend one option with the reason, and note warranty terms to log in `warranty-tracker.md`.


## reference: cancellation-notice.md

# Cancellation notice — direct sales and direct marketing (มาตรา 33)

```
เรื่อง  แจ้งเลิกสัญญาซื้อขาย ตามพระราชบัญญัติขายตรงและตลาดแบบตรง พ.ศ. 2545 มาตรา 33

เรียน  [ชื่อบริษัท]

ข้าพเจ้า [ชื่อ นามสกุล] ได้สั่งซื้อ [สินค้า/บริการ] คำสั่งซื้อเลขที่ [เลข] ราคา [จำนวน] บาท
ได้รับสินค้าเมื่อวันที่ [วันที่]

ข้าพเจ้าขอใช้สิทธิเลิกสัญญาตามมาตรา 33 และขอให้คืนเงินจำนวน [จำนวน] บาท
ภายใน 15 วัน นับจากวันที่ได้รับหนังสือฉบับนี้ ตามมาตรา 36 โดยโอนเข้าบัญชี [ธนาคาร / ชื่อบัญชี — ส่งแยกเมื่อบริษัทติดต่อกลับ]
ข้าพเจ้าเก็บรักษาสินค้าไว้ในสภาพเดิม พร้อมส่งคืนหรือให้บริษัทมารับตามที่ตกลง

ขอแสดงความนับถือ
[ชื่อ] · [โทร] · [วันที่]
```

Send so the date is provable: email + registered mail (ไปรษณีย์ลงทะเบียนตอบรับ), or the company's official channel with a screenshot.


## reference: complain.md

<!-- merged from skill `complain` on 2026-11-27 · description was: Draft a complaint and escalation plan for a faulty product, bad service or refused refund, up to the OCPB hotline 1166. -->
Run the `consumer-advocate` agent with the `refund-request.md` skill: **the user's request**

1. Collect the facts and build the evidence list; anything missing → mark `(รอยืนยัน)` and list it; the lead asks once at the start.
2. Check time-limited rights first with `refund-request.md` Step 1 (cooling-off, platform window, card dispute).
3. Identify the current step on the escalation ladder.
4. Draft the letter or message for that step in Thai (English too if the seller is foreign), with a dated deadline.
5. Write what happens next if the deadline passes.


## reference: complaint-letter.md

# Complaint Letter (Thailand)

Use after the refund route in SKILL.md fails or the seller will not fix, deliver or keep a promise. Firm, dated, specific — and one rung at a time.

## Contents
- [Evidence list](#evidence-list)
- [Workflow](#workflow)
- [Tone rules](#tone-rules)
- [Complaint Templates](#complaint-templates)
  - [0. Step 1 — letter to the seller](#0-step-1--letter-to-the-seller)
  - [1. Platform escalation message](#1-platform-escalation-message)
  - [2. Complaint to สคบ.](#2-complaint-to-สคบ)
  - [3. English version](#3-english-version)
  - [4. Follow-up after deadline](#4-follow-up-after-deadline)

## Evidence list

- [ ] Receipt / tax invoice / order confirmation with order number
- [ ] Product page or advertisement as it was when you bought (screenshot; the Wayback Machine if changed)
- [ ] Chat history with the seller — export or screenshot with dates visible
- [ ] Photos / video of the fault, unboxing video if you have it, and the parcel label
- [ ] Delivery record (tracking, delivery photo)
- [ ] Payment proof — bank transfer slip, card statement line
- [ ] Warranty card, service-centre job sheets, repair receipts
- [ ] Timeline: date — what happened — who you spoke to
- [ ] Copy of your บัตรประชาชน (for สคบ.) — write "ใช้สำหรับร้องเรียน สคบ. เท่านั้น" across the copy and sign

## Workflow

1. Write the timeline and gather evidence (above).
2. Decide what you want: repair · replacement · refund · partial refund · compensation for a specific cost. One primary request.
3. Check time-limited rights first → step 1 in `refund-request.md`.
4. Draft the step-1 letter with the template; send in writing (platform chat, email, or registered mail ไปรษณีย์ลงทะเบียนตอบรับ for a shop with no online channel).
5. Diary the deadline. If it passes, move one step up, attaching the earlier letter.
6. At สคบ.: file online or call 1166; keep the complaint number; reply quickly to any request for documents.

The letter templates are at the bottom of this file.

## Tone rules

- Facts and dates, no insults, no threats beyond the next lawful step.
- One request, one deadline.
- Public reviews: facts only ("ordered on …, received …, seller did not reply by …"). Exaggeration can expose the user to a defamation claim (หมิ่นประมาท).
- Thai text → `human-writing` `references/thai-grammar.md` section 4, the complaint register · write the deadline as a number of days from the date the letter is received, not a fixed date · state the next step directly ("จะร้องเรียนต่อ … โดยไม่แจ้งอีก"), not "จำเป็นต้องดำเนินการ…ต่อไป"

## Complaint Templates

### 0. Step 1 — letter to the seller

```
เรื่อง  ขอให้ [ซ่อม / เปลี่ยนสินค้า / คืนเงิน] สินค้า [ชื่อสินค้า] คำสั่งซื้อเลขที่ [เลข]

เรียน  [ชื่อร้าน / ผู้จัดการ บริษัท ...]
สิ่งที่ส่งมาด้วย  1. ใบเสร็จ / หลักฐานการชำระเงิน
                 2. ภาพถ่าย / วิดีโอ ความชำรุดบกพร่อง
                 3. ประวัติการติดต่อ

ข้าพเจ้า [ชื่อ นามสกุล] ได้ซื้อ [สินค้า/บริการ] จากท่านเมื่อวันที่ [วันที่] ราคา [จำนวน] บาท
ชำระโดย [โอนเงิน / บัตรเครดิต] (หลักฐานแนบ 1)

เมื่อวันที่ [วันที่] พบว่า [อธิบายปัญหาตามจริง สั้น ๆ] (ภาพถ่าย/วิดีโอ แนบ 2)
ข้าพเจ้าได้แจ้งท่านแล้วเมื่อวันที่ [วันที่] ทาง [ช่องทาง] แต่ [ยังไม่ได้รับการแก้ไข / ได้รับคำตอบว่า ...] (แนบ 3)

จึงขอให้ท่าน [ซ่อม / เปลี่ยนสินค้าใหม่ / คืนเงินจำนวน ... บาท] ภายใน 7 วัน นับจากวันที่ได้รับหนังสือฉบับนี้
หากพ้นกำหนดดังกล่าว ข้าพเจ้าจะร้องเรียนต่อ [แพลตฟอร์ม / สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ.)] โดยไม่แจ้งอีก

จึงเรียนมาเพื่อโปรดดำเนินการ

ขอแสดงความนับถือ
[ชื่อ นามสกุล]
โทร [เบอร์] · อีเมล [อีเมล]
วันที่ [วันที่]
```

สิ่งที่ส่งมาด้วย sits under เรียน, the same term and position as a company letter (`thai-business-docs`); the body refers to each item as (แนบ 1) (แนบ 2).

### 1. Platform escalation message

```
เรื่อง ขอให้แพลตฟอร์มช่วยตรวจสอบคำสั่งซื้อ [เลข]

สั่งซื้อ [สินค้า] จากร้าน [ชื่อร้าน] เมื่อ [วันที่] ราคา [จำนวน] บาท
ได้รับสินค้าเมื่อ [วันที่] พบ [ปัญหา] (แนบภาพ/วิดีโอ)
แจ้งร้านค้าแล้วเมื่อ [วันที่] ทางแชทของแพลตฟอร์ม ร้านค้า [ไม่ตอบ / ปฏิเสธ]
ขอให้แพลตฟอร์มพิจารณา [คืนเงินเต็มจำนวน / คืนสินค้าและคืนเงิน] ตามนโยบายคืนสินค้า
```

### 2. Complaint to สคบ.

Fields the online form usually asks (register at complaint.ocpb.go.th — verify): ชื่อ-ที่อยู่ผู้ร้อง · ชื่อ-ที่อยู่ผู้ถูกร้อง (business name, registered address, phone, website/shop link) · ประเภทสินค้า/บริการ · มูลค่า · รายละเอียดเรื่อง · ความประสงค์ · เอกสารแนบ.

Summary text:
```
ข้าพเจ้าซื้อ [สินค้า/บริการ] จาก [ชื่อผู้ประกอบการ] เมื่อ [วันที่] ราคา [จำนวน] บาท ชำระโดย [วิธี]
ปัญหา: [อธิบาย]
การติดต่อผู้ประกอบการ: [วันที่ 1 — ช่องทาง — ผล] [วันที่ 2 — ช่องทาง — ผล]
ได้ส่งหนังสือลงวันที่ [วันที่] ขอให้แก้ไขภายใน 7 วัน นับจากวันที่ได้รับหนังสือแล้ว แต่ผู้ประกอบการ [ไม่ดำเนินการ]
ความประสงค์: ขอให้ สคบ. ไกล่เกลี่ยให้ผู้ประกอบการ [คืนเงิน ... บาท / เปลี่ยนสินค้า]
เอกสารแนบ: ใบเสร็จ, หลักฐานโอนเงิน, ภาพถ่าย, ประวัติแชท, หนังสือที่ส่งถึงผู้ประกอบการ, สำเนาบัตรประชาชน
```

### 3. English version

```
Subject: Request for [repair / replacement / refund] — order [number]

Dear [Company],

On [date] I bought [product] (order [number], [amount] THB).
On [date] I found [problem] (photos attached). I reported it on [date] via [channel] and have not received a resolution.

Please [repair / replace / refund THB ...] within 7 days of receiving this letter.
If this is not resolved by then, I will escalate to [the platform / the Office of the Consumer Protection Board of Thailand].

Regards,
[Name] · [Phone] · [Email]
```

### 4. Follow-up after deadline

```
เรื่อง ติดตามหนังสือลงวันที่ [วันที่] คำสั่งซื้อ [เลข]

ตามที่ข้าพเจ้าได้ขอให้ [ดำเนินการ] ภายใน 7 วัน นับจากวันที่ได้รับหนังสือฉบับดังกล่าว บัดนี้พ้นกำหนดแล้วยังไม่ได้รับการแก้ไข
ข้าพเจ้าจึงได้ยื่นเรื่องร้องเรียนต่อ [แพลตฟอร์ม / สคบ.] เลขที่เรื่อง [เลข] เมื่อวันที่ [วันที่]
หากท่านประสงค์จะแก้ไขโดยตรง ยังสามารถติดต่อข้าพเจ้าได้ที่ [เบอร์]
```


## reference: extended-warranty.md

# Extended warranty — decision rule

Moved from `SKILL.md`. Open when a shop offers an extended plan at checkout.

Buy only if **all** are true:
- A repair would hurt your budget (not easily paid from savings)
- The plan pays off on expected cost: **chance the covered part fails during the extension x repair cost it covers > plan price**. Take the chance from the brand's failure reports or owner reviews and the repair cost from the service centre's quote, each written down with date and source. Example: 15% x 8,000 = 1,200, so a 3,900 plan fails the test
- No usable chance figure → the shortcut is plan price below about 10–15% of the item price (rule of thumb, kept as the fallback when there is no data), or compare buy vs skip with `decision-desk/decision-scoring` command `payoff` using minimax regret, only when you have no idea at all of the chance: scenarios = fails / does not fail; regret of buying = plan price (when it does not fail); regret of skipping = repair cost − plan price (when it fails); take the option with the smaller worst regret. So it picks "buy" only when the repair cost is above 2 times the plan price. Example with repair 8,000 and plan 3,900 (chance 15%): worst regret buy 3,900, skip 4,100 → minimax regret says buy, while the expected-value test above (1,200 < 3,900) says skip. The two disagree, so use the chance figure whenever you have one
- It covers what actually fails for this item (compressor, screen, accidental damage) — read exclusions
- The provider will exist and is reachable in 3 years; claims go to an authorised centre

Skip if: the item is cheap to replace · the credit card already extends the warranty (some do — check card benefits) · the plan duplicates the manufacturer warranty for the first year · you are likely to replace the item before it expires.

Worked example: laptop 32,000 baht, 2-year extension offered at 3,900 baht (12%). Common failure for this model per owner reviews: battery (≈ 2,500 baht to replace) — excluded by the plan as a consumable. **Skip**; set aside 3,900 in a repair fund instead.


## reference: refund-request.md

<!-- merged from skill `refund-request` on 2026-11-27 · description was: Use when a buyer wants money back or to complain about a seller -->
# Refund Request (Thailand)

Time-limited rights first — they expire while people are still arguing with the seller.

General information, not legal advice — for large amounts, injury or a contract you signed, ask a lawyer (ทนายความ) or the legal aid centre of สภาทนายความ; for bank disputes the Bank of Thailand (BOT)'s ศูนย์คุ้มครองผู้ใช้บริการทางการเงิน (hotline 1213) can help.

## Step 1 — which route, and its clock

| Situation | Route | Clock starts | Deadline |
|---|---|---|---|
| Bought from a direct seller (ขายตรง, door-to-door / agent) or a direct marketer (ตลาดแบบตรง — selling to you through media, including many online shops registered with สคบ.) and changed your mind | Statutory cancellation — พ.ร.บ.ขายตรงและตลาดแบบตรง พ.ศ. 2545 | Day you **received** the goods/service | **7 days**, written notice (มาตรา 33) |
| Marketplace purchase (Shopee, Lazada, TikTok Shop) — wrong, damaged, fake, not received | Platform return/refund request in the app | Delivery date | Platform window — shown on the order (รอยืนยัน — varies by platform, store type and promotion; check the order page today) |
| Paid by credit/debit card; seller won't refund or never delivered | Card dispute / chargeback via your bank | Transaction or statement date | Bank's card terms (รอยืนยัน — commonly counted from the statement date; read your card's ข้อกำหนดและเงื่อนไข and call immediately) |
| Card charge you did not make | Report unauthorised use to the bank | When you see it | **At once** — call the bank's 24-hour line, freeze the card |
| Paid by bank transfer / PromptPay to a fake shop | Police report + bank hold request | When you realise | **At once** — ศูนย์ Anti Online Scam Operation Center (AOC) 1441 (24 hours) and your bank |
| Defective product, any channel | Seller's liability for defects (ป.พ.พ. มาตรา 472) | Discovering the defect | Lawsuit barred after 1 year (มาตรา 474) — see Step 2 below |

## The 7-day cancellation (direct sales / direct marketing)

Under the พ.ร.บ.ขายตรงและตลาดแบบตรง พ.ศ. 2545:
- **มาตรา 33** — the consumer may cancel by **written notice within 7 days of receiving the goods or service**, without giving a reason. Some goods and services are excluded by ministerial rule (รอยืนยัน — check the current exclusion list with สคบ.).
- **มาตรา 34** — after cancelling, keep the goods with reasonable care for **21 days** from cancelling, or return them; for consumables, return the unused part.
- **มาตรา 35** — you pay only for damage caused by your own fault, not for normal opening or testing.
- **มาตรา 36** — the business must refund in full within **15 days** of receiving the cancellation notice; late refunds attract a penalty set by the committee.
- **มาตรา 30–31** — the business must give you sales documents in Thai stating the cancellation right clearly.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://legardy.com/thai-law/direct-sell-law/direct-sell-law-section-3 · https://www.drthawip.com/book/export/html/3439
Section text comes from 2 secondary websites. Check the official law at krisdika.go.th (Office of the Council of State) · ocpb.go.th. The official text has not been opened and checked yet (รอยืนยัน).

Whether a particular online shop counts as a "direct marketer" under the Act depends on the business (registered ผู้ประกอบธุรกิจตลาดแบบตรง, selling through its own media) — if in doubt, send the notice anyway within 7 days and ask สคบ. 1166.

Notice template (Thai, มาตรา 33) and how to send it so the date is provable → [references/cancellation-notice.md](cancellation-notice.md)

## Platform refund — steps

1. Record an **unboxing video** for future orders (start before cutting the tape) — the strongest evidence for "wrong/empty/damaged".
2. Do **not** press "ได้รับสินค้าแล้ว / Order received" until you have checked the item — on several platforms confirming releases payment to the seller and may shorten your window.
3. Open the return/refund request from the order page, choose the exact reason, upload photos/video.
4. Keep all communication in the platform chat — never move to LINE or phone with the seller (this is also where scams start → `scam-check` in `trading-finance` (if installed)).
5. If rejected, escalate to platform customer service within their appeal window, then Step 2 below.

## Card dispute (chargeback) — steps

1. Contact the seller first in writing and keep the reply (banks usually ask).
2. Call the card issuer: say "ขอปฏิเสธรายการ / dispute transaction", give date, amount, merchant.
3. Fill the bank's dispute form; attach order, evidence of non-delivery or defect, your request to the seller.
4. Ask whether the disputed amount is suspended from your payment while investigated; pay the rest of the statement on time.
5. Note the case number and expected timeline; follow up in writing.
6. If the bank refuses or does not respond, contact ศูนย์คุ้มครองผู้ใช้บริการทางการเงิน ธปท. 1213.

Unauthorised card transactions: under the BOT fraud measures (first Oct 2564, restated Mar 2566), banks refund debit-card holders within 5 working days (วันทำการ) and do not bill credit-card holders for the amount and interest, once it is reasonable that the cardholder was not at fault. Since 13 Apr 2568 the พ.ร.ก. มาตรการป้องกันและปราบปรามอาชญากรรมทางเทคโนโลยี (ฉบับที่ 2) also makes banks, payment providers, phone networks and platforms share the loss when they did not follow their regulator's standard (BOT standard for banks announced 28 Apr 2568; the days limit inside it not checked — รอยืนยัน).

ตรวจล่าสุด 2026-10-14 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20211019.html · https://www.bot.or.th/th/news-and-media/news/news-20250428.html · https://www.thebangkokinsight.com/news/stock-finance/finance/1437029/ · https://thethaiger.com/th/news/488483/

## Step 2 — refund refused? Escalate one rung at a time

| Step | Who | How | Give them | Move up when |
|---|---|---|---|---|
| 1 | Seller / shop / service provider | Chat on the platform (keeps a record), email, or letter | 3–7 days to answer (the template says ภายใน 7 วัน นับจากวันที่ได้รับหนังสือฉบับนี้) | No reply or refusal by the date |
| 2 | Platform (Shopee, Lazada, TikTok Shop, delivery app) | In-app "return/refund" or dispute, then customer service ticket | Platform's own window — act **before** it closes | Platform rejects, or seller is off-platform |
| 2b | Card issuer / bank (if paid by card) | Dispute or chargeback — see "Card dispute (chargeback) — steps" | Bank's dispute window (รอยืนยัน — read your card terms) | Bank declines |
| 2c | Online-transaction complaints | ศูนย์รับเรื่องร้องเรียนปัญหาออนไลน์ (Online Complaint Center, OCC, under สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ — Electronic Transactions Development Agency, ETDA) hotline 1212 | — | Not resolved |
| 3 | สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ., Office of the Consumer Protection Board) | Hotline **1166**, OCPB Connect app, online at **complaint.ocpb.go.th** (register with บัตรประชาชน), or in person; provinces → สคบ.จังหวัด at the provincial hall | สคบ. may call both sides to a mediation; can sue on the consumer's behalf in some cases | Mediation fails |
| 4 | ศาล — consumer case (คดีผู้บริโภค) | File at the court where the cause arose (มูลคดีเกิด) or where the business is domiciled — not simply where you live (รอยืนยัน — one official court page so far); can be filed **orally** with a court case officer (เจ้าพนักงานคดี) who writes it down | Court hearing | — |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.marketingoops.com/digital-life/ocpb-online-complaint/ · https://www.mitihoon.com/2026/06/05/647541/ (สคบ. channels 1166, OCPB Connect, ocpb.go.th) — verify the URL at www.ocpb.go.th before sending. Hotline 1166 and the online complaint site checked on the official page https://complaint.ocpb.go.th on 2026-11-10.

Consumer court basics (พ.ร.บ.วิธีพิจารณาคดีผู้บริโภค พ.ศ. 2551):
- A consumer (or the body suing for them) pays no court fees to file or at any step of the case, but the final costs order is not covered; the court may make the consumer pay the waived fees if the claim was baseless, inflated or abusive; a business that sues is not exempt (มาตรา 18)
- A claim can be filed orally or in writing; a court case officer writes down an oral claim (มาตรา 20)
- A business suing a consumer must file in the one court whose area covers the consumer's domicile (ภูมิลำเนา), even when another court would otherwise be open to it (มาตรา 17)

Last checked 2026-10-23 · official source: Royal Gazette (ราชกิจจานุเบกษา) เล่ม 125 ตอนที่ 38 ก (volume 125, part 38 ก) (25 Feb 2008, B.E. 2551) https://ratchakitcha.soc.go.th/documents/242398.pdf · sections 17 · 18 · 20 have not been amended (Amendment No. 2, B.E. 2556 (2013), amended section 19 · Amendment No. 3, B.E. 2558 (2015), amended section 49 paragraph 2 and section 51, and repealed sections 52–54)
Confirmed by: ศาลแพ่งตลิ่งชัน https://civiltlc.coj.go.th/th/content/page/index/id/397228 · Veridian E-Journal มหาวิทยาลัยศิลปากร 10(3) 2560 · วิทยานิพนธ์มหาวิทยาลัยธุรกิจบัณฑิตย์ 2560 · https://legardy.com/thai-law/consumer-case-procedure/consumer-case-procedure-filing-section-17-21

Watch the clock: a defect lawsuit is barred 1 year after discovering the defect (ป.พ.พ. มาตรา 474 — see `warranty-tracker.md`). Don't let steps 1–3 run past it.

Evidence list, workflow, tone rules, letter templates (to the seller, platform, สคบ., English, follow-up) → [references/complaint-letter.md](complaint-letter.md)

Worked example (direct-marketing cancellation, with dates): [references/worked-example.md](worked-example.md)

Related: `warranty-tracker.md` · `scam-check` in `trading-finance` (if installed) · `human-writing/polite-message-th-en` (plugin `superuser`) · `family-legal` in `personal-life` (if installed).


## reference: review-trust.md

# Review trust signals and fake-review red flags

Moved from `SKILL.md`. Open when checking reviews for a shortlisted option.

## Trust more

- Verified-purchase reviews with **photos or video of the actual unit**, especially after weeks of use
- Reviews that mention a specific drawback alongside praise
- Long-form reviews from people with a review history across many products (Google Maps Local Guides, Pantip threads with older accounts)
- Independent testing: brand-neutral tech reviewers who disclose sponsorship, ฉลากเบอร์ 5 (การไฟฟ้า) data, มอก. (Thai Industrial Standards Institute, TISI) certification for regulated products

## Fake-review red flags

- Many 5-star reviews posted within a few days, similar wording or the same photo angles
- Reviews about delivery or the seller only ("ส่งไว แพ็คดี") — not about the product
- Reviewer accounts with no history, or only 5-star reviews
- Rating far above comparable products at a much lower price
- "Review for gift / refund" cards inside the package — the reviews are bought
- Livestream or TikTok creator with no disclosure (#ad / #sponsored, โฆษณา) that is clearly paid
- Product page that merged reviews from a different, earlier product

Sort by **lowest rating** and **most recent** — patterns in 1–2 star reviews (same fault after 2 months) tell you more than the average.


## reference: sources.md

# Sources · warranty-tracker

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://legardy.com/thai-law/civil-commercial/civil-and-commercial-section474 · https://www.thailawonline.com/th/thai-civil-code/section-474/
Section texts come from 2 secondary websites. Check the official law at krisdika.go.th (สำนักงานคณะกรรมการกฤษฎีกา, Office of the Council of State) · ocpb.go.th. The official text has not been opened yet (รอยืนยัน, awaiting confirmation).


## reference: tco-example.md

# Worked example — 12,000 BTU air conditioner, 7 years

Moved from `SKILL.md` (Total cost of ownership). The decision-matrix file for the same case is `templates/score-example.json`.

Assumptions: 8 hours a day, 365 days; electricity ≈ 4.13 baht per unit incl. VAT (กกพ. average 3.86 before VAT for bills from ก.ย. 2569; your home tier may differ — see `personal-life:household-money` if installed, or mea.or.th / pea.co.th) · ตรวจล่าสุด 2026-10-22 · แหล่ง: https://erc.or.th/th/news-release/3472. Ft/tariff changes each period — a Thai PBS report of 23 Jul 2026 puts Sep–Dec 2569 at 3.95 baht before VAT (secondary source, erc.or.th not opened: รอยืนยัน), so recompute with the current rate. Power draws are illustrative averages — use the model's label figures.

| | A: fixed-speed | B: inverter |
|---|---|---|
| Price incl. installation | 11,900 | 16,900 |
| Average power | 1.1 kW | 0.7 kW |
| kWh per year (× 2,920 h) | 3,212 | 2,044 |
| Electricity per year | 13,266 | 8,442 |
| Electricity 7 years | 92,862 | 59,094 |
| **TCO 7 years** (cleaning equal, excluded) | **104,762** | **75,994** |

B costs 5,000 more upfront and saves about 28,800 over 7 years; payback ≈ 5,000 ÷ 4,824 per year ≈ 1 year.

Decision-matrix run on the same case (budget 18,000 baht): option C at 24,900 baht is dropped by the hard rule; B inverter 75, A fixed-speed 35; result line `B inverter อันดับ 1 นิ่ง (ขยับน้ำหนักทีละเกณฑ์ ±20% แล้วไม่เปลี่ยน · นำอันดับ 2 อยู่ 40 คะแนน)`. Run 2026-10-28.


## reference: warranty-tracker.md

<!-- merged from skill `warranty-tracker` on 2026-11-27 · description was: Use when filing warranty cards or preparing a claim -->
# Warranty Tracker

A warranty is worth nothing if you cannot find the receipt on the day the item breaks.

General information, not legal advice.

## The registry

One CSV (opens in any spreadsheet) for everything over about 1,000 baht or with a warranty. It uses **the same columns as `family-legal` in `personal-life`**, so if that skill is installed the rows go into the same `important-docs.csv` with `section = warranty` — one file, not two. Without it, keep `warranties.csv` with these columns; it can be merged later by copy-paste.

```
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
warranty,Refrigerator [brand] [model],Home,[serial no.],[store] order 123,2026-08-12,2027-08-12,,30,digital: Drive/Docs/Warranty/,2026-08-12_fridge_receipt.pdf,[call centre],18990,compressor to 2031; paid by credit card; registered online
```

| Column | What goes in it |
|---|---|
| item | item + brand + model |
| ref_no | serial number (full — it is not a secret) |
| issuer | shop or platform + order number |
| start_date / end_date | bought on / manufacturer warranty ends (YYYY-MM-DD) |
| extended_until | extended plan end, if any |
| renew_lead_days | 30 — test the item before the warranty ends |
| location / file | where the paper receipt and warranty card are / receipt photo file |
| contact | authorised service centre phone |
| amount | price paid |
| notes | paid by (card, cash), registered online?, longer part warranties, claim history |

File name pattern: `YYYY-MM-DD_item_type.ext` (receipt, warranty-card, serial-photo).

For the monthly check, filter or grep the rows with `end_date` in the next 60 days instead of reading the whole file.

## Receipt-photo habit (do it at the counter or on unboxing day)

1. Photo the **receipt / tax invoice** flat, all corners visible — thermal paper fades within months.
2. Photo the **serial number label** and the **warranty card**.
3. Screenshot the **online order page** (price, seller name, date) — sellers sometimes edit listings later.
4. Register the product online if the brand offers it; screenshot the confirmation.
5. Add one row to the registry; store the files in one folder.
6. Calendar reminder 30 days before the warranty ends — check for faults while still covered.

## What the law gives you anyway

Even without a warranty card, the seller is liable for defects that existed at delivery and make the item unfit for normal use (ป.พ.พ. มาตรา 472, ความชำรุดบกพร่อง). A lawsuit over the defect is barred once **1 year has passed from discovering the defect** (มาตรา 474) — so a complaint that drags on must not run past that date without filing. Unsafe products causing injury or damage are covered by the พ.ร.บ.ความรับผิดต่อความเสียหายที่เกิดขึ้นจากสินค้าที่ไม่ปลอดภัย พ.ศ. 2551. The section texts come from secondary websites only (รอยืนยัน with the official law at krisdika.go.th · ocpb.go.th). Sources: [`sources.md`](sources.md).


The manufacturer's warranty is a contract on top of this — read what it excludes (water damage, "misuse", installation by non-authorised technicians, consumables).

## Making a claim

1. Check the registry: date, warranty end, receipt.
2. Record the fault: video showing the problem, date first noticed.
3. Contact the authorised service centre (not only the shop) — get a **job/ticket number**.
4. When handing over: get a **receipt for the item** listing condition, accessories, and serial number. Photo the item before handover.
5. Ask the expected repair time in writing. Note every call (date, name, what was said).
6. Repeated failure of the same fault (e.g. 3 repairs) → ask in writing for replacement or refund; if refused → `refund-request.md` (complaint letters in its `complaint-letter.md`).

## Extended warranty — decision rule

Buy only when a repair would hurt the budget **and** chance of failure x covered repair cost > plan price (no chance figure → plan under about 10–15% of item price, or `decision-desk/decision-scoring` `payoff` minimax regret) **and** it covers what actually fails. Full rule, skip conditions and the laptop example → [references/extended-warranty.md](extended-warranty.md).

## Monthly check (5 minutes)

- Anything bought this month not in the registry?
- Any warranty ending in the next 60 days → test the item now.

Related: `buy-compare.md` · `refund-request.md` · `family-legal` in `personal-life`.


## reference: worked-example.md

# Worked example · refund-request

## Worked example

Bought a skincare set through a Facebook advertiser's own website (direct marketing), received 2026-10-01, changed mind on 2026-10-04:
1. Day 3 of 7 — the มาตรา 33 right applies. Send the cancellation notice by email and registered mail on 2026-10-04.
2. Keep the set unopened for 21 days or return per the company's instructions.
3. Refund due by 15 days from the company receiving the notice (≈ 2026-10-21 if received 2026-10-06).
4. No refund by then → "Step 2 — refund refused?", rung 3 (สคบ. 1166), attaching the notice and postal receipt.
