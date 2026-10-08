# skill: polite-message-th-en

Use when writing an awkward everyday message in Thai or English (favour, decline, chasing payment, apology, follow-up) in the right register. Not complaints.

# Polite Messages in Thai and English

Say the hard thing clearly. Politeness belongs in the wording, not in hiding the request.

## Workflow

1. **Situation**: what the message is for (ask / decline / chase payment / apologise / complain / follow up), who it goes to, through which channel (LINE, email, letter), and what the user wants to happen
2. **Register**: choose it from the relationship using the register table. When unsure, go one step more formal; it is easier to relax later
3. **Tone level**: choose it on the tone ladder. The first contact is level 1 or 2. Move up one level per reminder, never two
4. **Draft**: start from [references/templates.md](references/templates.md). Every message needs: greeting → context in one line → **the request or point, with a date** → a softener → sign-off
5. **Check**: the request is in the first 3 lines; there is one ask per message; numbers, dates and amounts are exact; there is nothing the user would regret if it were forwarded
6. Give both Thai and English when the reader may use either. They are written for the same tone, not translated word for word

## Thai register table

| Element | Casual (friend, peer) | Polite (colleague, customer, เจ้าของร้าน) | Formal (senior, official, ผู้ใหญ่, letter) |
|---|---|---|---|
| End particle | ครับ / ค่ะ, sometimes นะครับ / นะคะ | ครับ / ค่ะ on every sentence | ครับ / ค่ะ; in letters, no particle, formal verbs instead |
| "You" | เธอ / ชื่อเล่น / พี่ / น้อง | คุณ + first name | ท่าน, or คุณ + full name + position |
| "I" | เรา / ชื่อเล่น | ผม / ดิฉัน (ฉัน in LINE) | ผม / ดิฉัน / กระผม (very formal) |
| Asking | ช่วย...หน่อยได้ไหม | รบกวน...ด้วยครับ/ค่ะ | ขอความกรุณา... / ใคร่ขอความอนุเคราะห์... |
| Permission | ขอ...นะ | ขออนุญาต...ครับ/ค่ะ | ขออนุญาต... / จึงเรียนมาเพื่อโปรดพิจารณา |
| Thanks | ขอบใจนะ / ขอบคุณนะ | ขอบคุณมากครับ/ค่ะ | ขอขอบพระคุณเป็นอย่างสูง |
| Sorry | โทษที / ขอโทษนะ | ขออภัยครับ/ค่ะ / ขอโทษด้วยครับ/ค่ะ | ขออภัยเป็นอย่างสูง / ต้องขออภัยในความไม่สะดวก |

Notes:
- **รบกวน** literally means "to disturb". It is the default polite opener for a request: รบกวนส่ง...ภายในวันศุกร์ได้ไหมครับ
- **ขออนุญาต** before doing something to someone: ขออนุญาตทวงถาม... (permission to follow up) softens a payment chase
- **ท่าน** sounds stiff in LINE between peers. Keep it for seniors and for formal letters
- For formal letters (หนังสือราชการ), use `doc-thai-official` in `thai-workplace`

## English register in brief

| Casual | Polite (default) | Formal |
|---|---|---|
| Can you…? | Could you…? / Would you be able to…? | I would be grateful if you could… |
| Sorry, I can't | Unfortunately I won't be able to… | I regret that I am unable to… |
| Just checking… | I wanted to follow up on… | I am writing to follow up on… |

## Softening phrases

| Thai | English | Use |
|---|---|---|
| ไม่ทราบว่า...สะดวกไหมครับ/คะ | Would it be possible to…? | Before a request |
| ถ้าไม่เป็นการรบกวน | If it's not too much trouble | A favour |
| เข้าใจว่าช่วงนี้อาจจะยุ่ง | I understand things may be busy | Chasing a slow reply |
| อาจจะตกหล่นไป | It may have slipped through | Assuming no bad intent |
| ขอบคุณล่วงหน้านะครับ/คะ | Thanks in advance | Closing a request |
| เสียดายมากที่ครั้งนี้... | I'm sorry that this time… | Declining |

Do not stack softeners. One or two per message; more sounds sarcastic or unsure.

## Tone ladder

| Level | Name | Thai marker | English marker | When |
|---:|---|---|---|---|
| 1 | Gentle | อาจจะตกหล่นไป, รบกวนช่วยดู... | Just a gentle reminder… | First nudge, a good relationship |
| 2 | Clear | ขอติดตามเรื่อง... ครบกำหนดวันที่... | Following up on… which was due on… | First formal follow-up |
| 3 | Firm | ขอความกรุณาดำเนินการภายในวันที่... | Please arrange this by… | Second reminder, no reply |
| 4 | Final | หากไม่ได้รับภายในวันที่... จำเป็นต้อง... | If we do not receive this by…, we will… | Last notice: state the consequence |
| 5 | Formal action | A letter (หนังสือทวงถาม), registered post | Formal demand letter | Hand to a lawyer or a debt process |

Rules for the ladder:
- Every level states the **exact amount, the reference and the date**
- Level 4 names a consequence the user **will really carry out**. An empty threat ruins level 5
- Stay polite at every level. Firm means specific and dated, not rude

## Worked example — chasing an unpaid invoice (LINE, to a small client)

- Day +3 after the due date, level 1: "สวัสดีครับคุณเอ ขออนุญาตทวงถามใบแจ้งหนี้ INV-2026-031 ยอด 18,500 บาท ครบกำหนดวันที่ 30 ก.ย. ครับ อาจจะตกหล่นไป รบกวนช่วยตรวจสอบให้หน่อยนะครับ ขอบคุณครับ"
- Day +10, level 3: "...ขอความกรุณาโอนชำระภายในวันศุกร์ที่ 17 ต.ค. นี้ครับ หากมีปัญหาเรื่องเอกสารแจ้งได้เลยครับ"
- Day +20, level 4: "...หากไม่ได้รับชำระภายในวันที่ 31 ต.ค. ผมจำเป็นต้องหยุดงานส่วนที่เหลือไว้ก่อนจนกว่าจะเคลียร์ยอดนี้ครับ"

Related: `inbox-triage` (which messages to answer first), `meeting-summary` (written follow-up after a meeting), and `doc-thai-official` and `doc-quotation` in `thai-workplace`.


## reference: templates.md

# Message templates — Thai and English

Contents
1. [Asking for something](#1-asking-for-something)
2. [Declining](#2-declining)
3. [Chasing payment](#3-chasing-payment-one-template-per-level)
4. [Apologising](#4-apologising)
5. [Complaining](#5-complaining-to-a-shop-a-landlord-or-a-service)
6. [Following up after silence](#6-following-up-after-silence)

`[ ]` = fill in. Use ครับ or ค่ะ to match the writer. These templates are in the polite register; for casual or formal, adjust with the register table in SKILL.md.

---

## 1. Asking for something

**Thai**
```
สวัสดีครับ/ค่ะ คุณ[ชื่อ]
[บริบท 1 บรรทัด เช่น ตามที่คุยกันเรื่อง...]
รบกวนช่วย[สิ่งที่ขอ] ภายในวันที่ [วันที่] ได้ไหมครับ/คะ
[เหตุผลสั้น ๆ ว่าทำไมต้องวันนั้น]
ถ้าไม่สะดวก แจ้งได้เลยนะครับ/คะ ขอบคุณล่วงหน้าครับ/ค่ะ
```

**English**
```
Hi [Name],
[One line of context.]
Could you [request] by [date]? [Short reason for the date.]
If that doesn't work, just let me know and we'll find another way.
Thanks in advance,
[Name]
```

## 2. Declining

Structure: thanks → a clear no → a short reason (optional, never a lie) → an alternative if there is one.

**Thai**
```
ขอบคุณที่นึกถึงนะครับ/คะ
เสียดายมากที่ครั้งนี้[ผม/ดิฉัน]คงรับไม่ไหว เพราะ[เหตุผลสั้น ๆ]
ถ้าเป็น[ทางเลือกอื่น เช่น เดือนหน้า / แนะนำคุณ...] ยินดีเลยครับ/ค่ะ
```

**English**
```
Thank you for thinking of me.
Unfortunately I won't be able to take this on, as [short reason].
[If useful: I could do X instead / You might try Y.]
```

## 3. Chasing payment (one template per level)

**Level 1 — Gentle**
```
TH: สวัสดีครับ/ค่ะ ขออนุญาตทวงถามใบแจ้งหนี้เลขที่ [INV] ยอด [จำนวน] บาท ครบกำหนดวันที่ [วันที่] ครับ/ค่ะ อาจจะตกหล่นไป รบกวนช่วยตรวจสอบให้หน่อยนะครับ/คะ
EN: Hi [Name], a gentle reminder that invoice [INV] for THB [amount] was due on [date]. It may have slipped through — could you take a look?
```

**Level 2 — Clear**
```
TH: ขอติดตามใบแจ้งหนี้ [INV] ยอด [จำนวน] บาท ซึ่งครบกำหนดเมื่อ [วันที่] ครับ/ค่ะ แนบใบแจ้งหนี้มาอีกครั้ง ช่องทางชำระ: [บัญชี]
EN: Following up on invoice [INV] (THB [amount]), due on [date]. I've attached it again. Payment details: [account].
```

**Level 3 — Firm**
```
TH: ขอความกรุณาชำระยอด [จำนวน] บาท (ใบแจ้งหนี้ [INV]) ภายในวันที่ [วันที่] ครับ/ค่ะ หากมีปัญหาเรื่องเอกสารหรือขั้นตอนอนุมัติ แจ้งได้เลยครับ/ค่ะ
EN: Please arrange payment of THB [amount] (invoice [INV]) by [date]. If something is holding it up on your side, let me know what's needed.
```

**Level 4 — Final**
```
TH: เนื่องจากยังไม่ได้รับชำระใบแจ้งหนี้ [INV] ยอด [จำนวน] บาท ซึ่งเกินกำหนดมา [x] วัน หากไม่ได้รับชำระภายในวันที่ [วันที่] [ผม/ดิฉัน]จำเป็นต้อง[ผลที่จะทำจริง] ครับ/ค่ะ
EN: Invoice [INV] (THB [amount]) is now [x] days overdue. If payment is not received by [date], we will [real consequence].
```

## 4. Apologising

Structure: own it → the impact on them → the fix → what changes so it doesn't happen again. No "if you were offended".

**Thai**
```
ต้องขออภัยจริง ๆ ครับ/ค่ะ ที่[สิ่งที่ผิดพลาด]
ทำให้คุณ[ผลกระทบ]
ตอนนี้[ผม/ดิฉัน]ได้[สิ่งที่แก้แล้ว] และจะ[สิ่งที่จะเปลี่ยน]เพื่อไม่ให้เกิดขึ้นอีกครับ/ค่ะ
```

**English**
```
I'm sorry that [what went wrong]. I know it meant [impact on them].
I've [fix], and from now on I'll [change] so it doesn't happen again.
```

## 5. Complaining (to a shop, a landlord or a service)

Structure: facts with dates → what was expected → what you want, with a date → reference numbers.

**Thai**
```
เรียน [ฝ่ายบริการลูกค้า / คุณ...]
[ผม/ดิฉัน]สั่ง/ใช้บริการ [สินค้า/บริการ] เมื่อวันที่ [วันที่] เลขที่อ้างอิง [เลข]
ปัญหาที่พบ: [ข้อเท็จจริง]
จึงขอความกรุณา[คืนเงิน / เปลี่ยนสินค้า / ซ่อม] ภายในวันที่ [วันที่]
แนบ [ใบเสร็จ / รูป] มาด้วยครับ/ค่ะ ขอบคุณครับ/ค่ะ
```

**English**
```
Dear [Team/Name],
On [date] I [bought/used] [item/service], reference [no.].
The problem: [facts].
I'd like a [refund/replacement/repair] by [date]. Receipt and photos attached.
```

If the merchant does not respond, the next step is a complaint to the Office of the Consumer Protection Board (สคบ.) (รอยืนยัน: current channel and hotline).

## 6. Following up after silence

**Thai**
```
สวัสดีครับ/ค่ะ ขอติดตามเรื่อง[เรื่อง]ที่ส่งไปเมื่อวันที่ [วันที่] ครับ/ค่ะ
เข้าใจว่าช่วงนี้อาจจะยุ่ง ถ้าสะดวกตอบภายใน[วันที่]จะช่วยได้มาก เพราะ[เหตุผล]
```

**English**
```
Hi [Name], I wanted to follow up on [topic] from [date].
I understand things may be busy — a reply by [date] would help, since [reason].
```

Third follow-up with no reply: change the channel (from email to a phone call) rather than sending a fourth message.
