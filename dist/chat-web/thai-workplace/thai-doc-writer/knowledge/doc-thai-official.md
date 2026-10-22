# skill: doc-thai-official

Use when drafting a formal Thai letter or memo to a government agency or company. Saraban rules.

# Thai Official Letter (หนังสือราชการ / หนังสือแบบราชการ)

Steps: pick the letter type, pick the salutation for the recipient's rank, fill the template, and state the request with a date.

Authority: ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 and amendments up to (ฉบับที่ 4) พ.ศ. 2564. Companies writing to government copy the same layout on their own letterhead (no ครุฑ — the Garuda emblem is for government agencies only).

## 1. Which type

| Type | Use when | Signed by | Key look |
|---|---|---|---|
| **หนังสือภายนอก** | Formal letter between agencies, or to a company/person outside | Head of agency or delegate | Garuda/letterhead top-centre, ที่ top-left, address top-right, full signature block |
| **หนังสือภายใน (บันทึกข้อความ)** | Inside the same agency/company | Person in charge | Header "บันทึกข้อความ", lines ส่วนราชการ / ที่ / วันที่ / เรื่อง, less formal |
| **หนังสือประทับตรา** | Routine matter between agencies at กรม level or to a person — ask for documents, acknowledge receipt, send a copy, remind | Stamped with the agency seal, initialled by a ข้าราชการ ระดับหัวหน้ากอง or delegate | No salutation, no closing; ถึง instead of เรียน |
| หนังสือสั่งการ (คำสั่ง ระเบียบ ข้อบังคับ) | Orders and rules | Authorised head | Separate formats — out of scope here |
| หนังสือประชาสัมพันธ์ (ประกาศ แถลงการณ์ ข่าว) | Public notices | Authorised head | "ประกาศ ...", ประกาศ ณ วันที่ |

Templates for the first three: [references/templates.md](references/templates.md).

## 2. Salutation and closing by recipient

| Recipient | คำขึ้นต้น | คำลงท้าย |
|---|---|---|
| Ordinary person, director, manager, governor, minister (most letters) | **เรียน** | **ขอแสดงความนับถือ** |
| Top office holders — ประธานองคมนตรี, นายกรัฐมนตรี, ประธานรัฐสภา, ประธานสภาผู้แทนราษฎร, ประธานวุฒิสภา, ประธานศาลฎีกา, ประธานศาลรัฐธรรมนูญ, ประธานศาลปกครองสูงสุด, รัฐบุรุษ, heads of independent constitutional bodies | **กราบเรียน** | **ขอแสดงความนับถืออย่างยิ่ง** |
| Monk (พระภิกษุ) | นมัสการ | ขอนมัสการด้วยความเคารพ |
| Senior monk (สมเด็จพระราชาคณะ) | นมัสการ | ขอนมัสการด้วยความเคารพอย่างยิ่ง |
| Royalty and สมเด็จพระสังฆราช | Use the royal forms in ภาคผนวก 2 of the ระเบียบ — do not improvise | (same appendix) |

- Write the recipient by **position**, not name: เรียน อธิบดีกรมสรรพากร, not เรียน นายสมชาย.
- กราบเรียน always pairs with ขอแสดงความนับถืออย่างยิ่ง; mixing levels reads as an error.

## 3. Closing sentence (the ask)

| Purpose | Phrase |
|---|---|
| Inform only | จึงเรียนมาเพื่อโปรดทราบ |
| Ask for a decision | จึงเรียนมาเพื่อโปรดพิจารณา |
| Ask for a favour/support | จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ |
| Ask to act | จึงเรียนมาเพื่อโปรดดำเนินการต่อไปด้วย |
| Inform and comply | จึงเรียนมาเพื่อโปรดทราบและถือปฏิบัติ |
| With กราบเรียน | จึงกราบเรียนมาเพื่อโปรดพิจารณา |

Add the deadline in the body: "ภายในวันที่ 20 ตุลาคม 2569" — without a date there is no deadline.

## 4. Layout rules

- Font TH Sarabun New / TH SarabunPSK 16 pt; A4; margins about 3 cm left, 2 cm right (house style may differ).
- **ที่** — agency code + file number / running number, e.g. ที่ กค 0702/1234; companies use their own, e.g. ที่ สท. 045/2569.
- Date in หนังสือภายนอก: "6 ตุลาคม 2569" (no word วันที่); in บันทึกข้อความ: "วันที่ 6 ตุลาคม 2569". Buddhist year.
- **อ้างถึง** only for a letter the recipient already has; **สิ่งที่ส่งมาด้วย** lists enclosures, numbered.
- Body pattern: ด้วย/ตามที่ (background) → paragraph of facts → ในการนี้/จึง (the request).
- Thai numerals (๑ ๒ ๓) are optional; government practice favours them, but be consistent through the whole letter. Arabic is fine for company letters.
- Contact block at bottom-left: ส่วนราชการเจ้าของเรื่อง, โทร., ไปรษณีย์อิเล็กทรอนิกส์.
- 1 matter per letter. Polite, precise, no slang, no English unless a proper noun.

## Workflow

1. Ask: sender, recipient position, purpose (inform / request / approve), deadline, enclosures, any letter being referred to.
2. Choose the type (section 1) and salutation/closing pair (section 2).
3. Fill the template from references; write the body ด้วย → facts → request with a date.
4. Check: salutation and closing match; ที่ and date present; enclosures numbered and actually attached; signer's full name in brackets and position under it.
5. Output .docx on letterhead (styling → `branded-document-design`).

## Worked example (company to Revenue Department)

เรียน อธิบดีกรมสรรพากร · เรื่อง ขอขยายระยะเวลายื่นเอกสารประกอบการตรวจสอบ · body: ตามที่ … ในการนี้ บริษัทฯ ขอขยายระยะเวลาถึงวันที่ 15 พฤศจิกายน 2569 · จึงเรียนมาเพื่อโปรดพิจารณา · ขอแสดงความนับถือ.

## Related

`doc-quotation` · `doc-contract-th` · `doc-leave` · `thai-holidays` (dates).


## reference: templates.md

# Templates — หนังสือภายนอก, บันทึกข้อความ, หนังสือประทับตรา

Contents
1. [หนังสือภายนอก](#1-หนังสือภายนอก)
2. [หนังสือภายใน (บันทึกข้อความ)](#2-หนังสือภายใน-บันทึกข้อความ)
3. [หนังสือประทับตรา](#3-หนังสือประทับตรา)
4. [Final checklist](#4-final-checklist)

Layout per ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม (ฉบับที่ 4) พ.ศ. 2564. Placeholders in {braces}.

## 1. หนังสือภายนอก

```
                              [ครุฑ / ตราบริษัท]
ที่ {รหัส}/{เลขทะเบียนส่ง}                                   {ชื่อส่วนราชการ/บริษัท}
                                                           {ที่อยู่}
                                                           {รหัสไปรษณีย์}

                                    {วัน เดือน ปี เช่น 6 ตุลาคม 2569}

เรื่อง  {สรุปเรื่องสั้น ๆ ไม่เกินหนึ่งบรรทัด}

{เรียน | กราบเรียน}  {ตำแหน่งผู้รับ}

อ้างถึง  {หนังสือที่อ้าง ลงวันที่ ...}            ← ใส่เมื่อมีเท่านั้น

สิ่งที่ส่งมาด้วย  ๑. {เอกสาร}  จำนวน {n} ฉบับ
                ๒. {เอกสาร}  จำนวน {n} ฉบับ

          ด้วย/ตามที่ {ความเป็นมา} ...............................................
.....................................................................................

          {ข้อเท็จจริง / รายละเอียด} ......................................

          ในการนี้ {สิ่งที่ขอ พร้อมกำหนดวัน} ...............................

          จึงเรียนมาเพื่อโปรด{ทราบ | พิจารณา | ดำเนินการ}

                                    {ขอแสดงความนับถือ | ขอแสดงความนับถืออย่างยิ่ง}

                                         {ลายมือชื่อ}
                                      ({ชื่อเต็ม})
                                      {ตำแหน่ง}

{ส่วนราชการ/ฝ่ายเจ้าของเรื่อง}
โทร. {เบอร์}
ไปรษณีย์อิเล็กทรอนิกส์ {email}
สำเนาส่ง {ถ้ามี}
```

## 2. หนังสือภายใน (บันทึกข้อความ)

```
[ครุฑ/โลโก้เล็ก]                 บันทึกข้อความ
ส่วนราชการ  {ฝ่าย/แผนก}  โทร. {ต่อ}
ที่  {เลขที่}                      วันที่  {6 ตุลาคม 2569}
เรื่อง  {เรื่อง}
-------------------------------------------------------------------
เรียน  {ตำแหน่งผู้รับ}

          {ความเป็นมา}

          {ข้อเท็จจริง/ข้อพิจารณา}

          จึงเรียนมาเพื่อโปรด{ทราบ | พิจารณา | อนุมัติ}

                                         {ลายมือชื่อ}
                                      ({ชื่อเต็ม})
                                      {ตำแหน่ง}
```

No คำลงท้าย is required in บันทึกข้อความ.

## 3. หนังสือประทับตรา

```
                              [ครุฑ]
ที่ {รหัส}/{เลข}

ถึง  {ส่วนราชการ/บุคคลผู้รับ}

          {ข้อความ — สั้น ตรงประเด็น เช่น ขอส่งสำเนา... มาเพื่อทราบ}

                                    {ชื่อส่วนราชการ}
                                    {วัน เดือน ปี}
                         [ตราชื่อส่วนราชการ + ลายมือชื่อย่อผู้รับผิดชอบ]

{ส่วนราชการเจ้าของเรื่อง}
โทร. {เบอร์}
```

Not used for important matters (policy, money, legal rights) — use หนังสือภายนอก.

## 4. Final checklist

- [ ] Type matches the purpose; หนังสือประทับตรา only for routine matters
- [ ] คำขึ้นต้น and คำลงท้าย pair correctly (เรียน ↔ ขอแสดงความนับถือ; กราบเรียน ↔ ขอแสดงความนับถืออย่างยิ่ง)
- [ ] Recipient by position; signer's name in brackets with position below
- [ ] ที่, date (Buddhist year), เรื่อง present; numerals one style throughout
- [ ] Every item in สิ่งที่ส่งมาด้วย is attached
- [ ] The request has a date
- [ ] Contact line filled

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.arch.chula.ac.th/arch-cu/files/formcontentepost/%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%93%20%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%97%E0%B8%B5%E0%B9%88%204%20%E0%B8%9E.%E0%B8%A8.%202564.pdf · https://psdg.moe.go.th/wp-content/uploads/2023/06/คู่มืองานสารบรรณ-กพร.สป.pdf
