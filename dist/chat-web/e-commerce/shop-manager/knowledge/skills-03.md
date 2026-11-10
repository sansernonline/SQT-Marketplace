# skill: import-landed-cost

Use when a Thai seller imports goods from China (1688, Taobao, shipping agent) and needs the real cost per unit (CIF, duty, VAT, car vs sea).

# ต้นทุนนำเข้าจากจีนต่อชิ้น (landed cost)

อยู่ใน plugin `e-commerce` · ถ้อยคำเขียนตาม `human-writing` · skill นี้คิดต้นทุนจริงต่อชิ้นของสินค้าที่สั่งจากจีน แยกออกมาจาก `thai-business-setup` หัวข้อ 5 เมื่อ 2026-10-28 · เนื้อหานี้เป็นข้อมูลทั่วไป ไม่ใช่คำปรึกษาภาษีหรือกฎหมาย ตัวเลขภาษีของกิจการจริงให้นักบัญชีคิดซ้ำ

ตัวย่อในไฟล์นี้: ภาษีมูลค่าเพิ่ม (VAT) · ราคาสินค้ารวมค่าประกันภัยและค่าขนส่งถึงด่านศุลกากรไทย (CIF) · รหัสพิกัดศุลกากร (HS code) · ลูกบาศก์เมตร (คิว)

> **กฎข้อเดียว:** อัตราอากรไม่มีค่าตั้งต้น ต้องค้นพิกัดแล้วใส่เองทุกล็อต และให้สคริปต์คิด ไม่คิดมือ

## ใช้เมื่อ

- สั่งสินค้าจากจีน (1688 · Taobao · โรงงาน) ผ่านชิปปิ้ง แล้วอยากรู้ต้นทุนถึงร้านต่อชิ้น
- เทียบใบเสนอราคาชิปปิ้งทางรถกับทางเรือ หรือแบบเหมาภาษีกับแยกจ่าย

ไม่ใช้เมื่อ: เลือกรูปแบบธุรกิจหรือจดทะเบียน → `thai-business-setup` · ตั้งราคาขายบนแพลตฟอร์มหลังรู้ต้นทุนแล้ว → `marketplace-fees-pricing` · ยื่น VAT รายเดือนและใช้ภาษีซื้อ → `tax-vat-th`

## 1 · สูตร

```
CIF            = ค่าสินค้า + ค่าขนส่งถึงด่านศุลกากรไทย + ค่าประกันภัย
อากรขาเข้า      = CIF × อัตราอากรตามพิกัด
ภาษีสรรพสามิต   = เฉพาะสินค้าที่มี (ราคาขายปลีกแนะนำ × อัตรา)
VAT            = (CIF + อากร + สรรพสามิต + ภาษีอื่นถ้ามี) × 7%
ต้นทุนถึงร้าน    = CIF + อากร + สรรพสามิต + VAT + ค่าบริการชิปปิ้งและพิธีการ + ค่าส่งในไทย
```

กิจการที่จด VAT แล้วและนำเข้าในชื่อตัวเอง เอา VAT ตอนนำเข้าไปเป็นภาษีซื้อได้ เพราะใบเสร็จรับเงินของกรมศุลกากรเป็นใบกำกับภาษีเฉพาะส่วนที่เป็น VAT จึงไม่ต้องนับ VAT ก้อนนี้เป็นต้นทุน

## 2 · กติกาปี 2569: ยกเลิกยกเว้นอากร 1,500 บาทแล้ว

- ตั้งแต่ 1 ม.ค. 2569 ของที่ยกเว้นอากรเหลือเฉพาะของที่แต่ละรายมีราคาศุลกากรไม่เกิน 1 บาท ตามประกาศกรมศุลกากร ที่ 219/2568 (ยกเลิกประกาศ ที่ 191/2561) · ผลจริงคือเสียอากรตั้งแต่บาทแรก
- VAT ของนำเข้าราคาไม่เกิน 1,500 บาท เก็บแล้วตั้งแต่ 5 ก.ค. 2567
- อัตรา VAT 7%: พระราชกฤษฎีกา (ฉบับที่ 807) พ.ศ. 2569 คงอัตรา 6.3% สำหรับการขาย การให้บริการ และการนำเข้า ถึง 30 ก.ย. 2570 รวมภาษีท้องถิ่นแล้วเป็น 7% ตามที่ `tax-vat-th` สรุป
- ยังไม่พบประกาศกระทรวงการคลังที่ต่อการยกเว้นอากร 1,500 บาทมาถึงปี 2569 ถ้ามีประกาศใหม่ ให้แก้หัวข้อนี้

## 3 · หาอัตราอากรและข้อห้าม

1. หา HS code 8 หลัก แล้วดูอัตราที่เมนู "ค้นหาพิกัดอัตราอากรขาเข้า" ในฐานข้อมูลพิกัดของกรมศุลกากร http://itd.customs.go.th/igtf/viewerCont.do?param=main · ไม่แน่ใจพิกัดถาม Call Center กรมศุลกากร 1164
2. สินค้าจากจีนขอลดหรือยกเว้นอากรตามความตกลงการค้าเสรีอาเซียน-จีน (ACFTA) ได้ ถ้ามีหนังสือรับรองถิ่นกำเนิดสินค้า Form E แสดงต่อกรมศุลกากรไทย · ถามชิปปิ้งตั้งแต่แรกว่าทำ Form E ให้ได้ไหม
3. ตรวจว่าเป็น "ของต้องกำกัด" (ต้องได้รับอนุญาตหรือทำตามเงื่อนไขก่อนนำเข้า) ไหม เช่น อาหาร ยา และเครื่องสำอาง (สำนักงานคณะกรรมการอาหารและยา: อย.) · เครื่องวิทยุคมนาคม (สำนักงาน กสทช.) · สินค้าที่มีมาตรฐานบังคับ (สำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม: สมอ.) (รอยืนยัน รายการสินค้าของแต่ละหน่วยงาน)

## 4 · ส่งทางรถหรือทางเรือ

| เรื่อง | ทางรถ | ทางเรือ |
|---|---|---|
| เหมาะกับ | ของเบา มูลค่าสูง อยากได้เร็ว | ของหนักหรือเทอะทะ ล็อตใหญ่ รอได้ |
| เวลา | สั้นกว่า | ยาวกว่า |
| ราคาต่อคิว | แพงกว่า | ถูกกว่า |
| คิดเงิน | ต่อกิโลกรัมหรือต่อคิว ใช้แบบที่ได้เงินมากกว่า | เหมือนกัน |

ตารางนี้เป็นลักษณะทั่วไปของตลาดชิปปิ้ง (อนุมาน ไม่ใช่ตัวเลขทางการ) · ขอใบเสนอราคาจริงจากชิปปิ้ง 2–3 เจ้า แล้วถาม 5 ข้อนี้

1. คิดราคาต่อกิโลกรัมหรือต่อคิว ขั้นต่ำเท่าไร ปัดเศษอย่างไร
2. ราคารวมอากรและ VAT แล้วหรือยัง ("เหมาภาษี" หรือแยกจ่าย)
3. นำเข้าในชื่อใคร และจะได้ใบขนสินค้ากับใบเสร็จของกรมศุลกากรในชื่อกิจการเราไหม · ถ้าเป็นชื่อชิปปิ้ง VAT ก้อนนั้นเอาไปเป็นภาษีซื้อของเราไม่ได้ (อนุมาน จากหลักที่ใบเสร็จศุลกากรเป็นใบกำกับภาษี)
4. สินค้าเสียหายหรือหาย ชดเชยเท่าไร
5. สำแดงราคาตามจริงไหม · การสำแดงราคาต่ำกว่าจริงเป็นความเสี่ยงทางกฎหมายของผู้นำเข้า (รอยืนยัน มาตราและโทษใน พ.ร.บ.ศุลกากร พ.ศ. 2560)

ตรวจล่าสุด 2026-10-23 · แหล่ง: ประกาศกรมศุลกากร ที่ 219/2568 (ลงนาม 4 ธ.ค. 2568 มีผล 1 ม.ค. 2569) https://www.customs.go.th/cont_strc_download_with_docno_date.php?lang=th&top_menu=menu_homepage&current_id=14232a32414d505f4a464b47464b4a · VAT ของนำเข้าราคาต่ำเริ่ม 5 ก.ค. 2567: เอกสารมาตรการจัดเก็บรายได้ปีงบประมาณ 2569 ของกรมศุลกากร https://www.customs.go.th/data_files/8342f73dce85665090d55bb44eb9a0e4.pdf · พ.ร.ฎ. ฉบับที่ 807 (ราชกิจจานุเบกษา เล่ม 143 ตอนที่ 50 ก 23 ส.ค. 2569) https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf · ฐาน VAT การนำเข้า ประมวลรัษฎากร ม.79/2 https://www.rd.go.th/5205.html · สูตรอากรและ VAT ของกรมศุลกากร http://ccc.customs.go.th/data_files/bdab2d48d4dd6ac677eeecd215c82ba2.pdf · ใบเสร็จศุลกากรเป็นใบกำกับภาษีเฉพาะส่วน VAT https://www.rd.go.th/7047.html · Form E https://www.dft.go.th/th-th/DFT-Service/ServiceData-Information/dft-service-data-privilege/Detail-dft-service-data-privilege/ArticleId/23580/Test · นิยามของต้องกำกัด https://www.customs.go.th/cont_strc_simple.php?ini_content=business_160426_03_160930_01_160930_01&ini_menu=menu_goods_control_permit&lang=th&left_menu=menu_goods_control_permit

## 5 · ตัวอย่าง: กระเป๋าผ้า 200 ใบจาก 1688 ส่งทางรถ

ทุกตัวเลขในหัวข้อนี้เป็น**ตัวอย่าง** ใช้แสดงวิธีคิดเท่านั้น

| สมมุติฐาน | ค่าที่ใช้ |
|---|---|
| ราคาสินค้า | 25 หยวนต่อใบ × 200 ใบ = 5,000 หยวน |
| อัตราแลกเปลี่ยน | 5.00 บาทต่อหยวน (ใช้อัตราจริงของวันจ่ายเงิน) |
| ค่าส่งในจีนถึงโกดังชิปปิ้ง | 100 หยวน |
| ค่าขนส่งจีนถึงไทยทางรถ | 0.4 คิว × 6,000 บาทต่อคิว |
| ค่าประกันภัย | 1% ของค่าสินค้า |
| อัตราอากร | 20% (ค้นอัตราจริงของพิกัดสินค้า และดูสิทธิ Form E) |
| ค่าบริการชิปปิ้งและพิธีการ | 1,000 บาทต่อล็อต |
| ค่าส่งในไทยถึงร้าน | 300 บาท |

| บรรทัด | วิธีคิด | บาท |
|---|---|---|
| ค่าสินค้า | 5,000 × 5.00 | 25,000.00 |
| ค่าส่งในจีน | 100 × 5.00 | 500.00 |
| ค่าขนส่งจีนถึงไทย | 0.4 × 6,000 | 2,400.00 |
| ค่าประกันภัย | 25,000 × 1% | 250.00 |
| **CIF** | รวม 4 บรรทัดบน | **28,150.00** |
| อากรขาเข้า | 28,150 × 20% | 5,630.00 |
| VAT | (28,150 + 5,630) × 7% | 2,364.60 |
| ค่าบริการชิปปิ้งและพิธีการ | | 1,000.00 |
| ค่าส่งในไทย | | 300.00 |
| **รวมจ่ายจริง** | | **37,444.60** |
| **ต้นทุนต่อใบ (ยังไม่จด VAT)** | 37,444.60 ÷ 200 | **187.22** |
| ต้นทุนต่อใบ (จด VAT และนำเข้าในชื่อตัวเอง) | (37,444.60 − 2,364.60) ÷ 200 | 175.40 |

ราคาหน้าเว็บ 25 หยวนคิดเป็น 125 บาท แต่ต้นทุนถึงร้านอยู่ที่ 175–187 บาท สูงขึ้น 40–50% · เอาต้นทุนนี้ไปตั้งราคาขายต่อด้วย `marketplace-fees-pricing`

## 6 · ให้สคริปต์คิด ไม่คิดมือ

`scripts/landed-cost.mjs` คิดตารางข้างบนครบทุกบรรทัดในครั้งเดียว ได้ต้นทุนต่อชิ้นทั้ง 2 แบบ (จด VAT หรือยัง) · อัตรา VAT อยู่ใน `scripts/rates.json` พร้อมวันที่ตรวจ เตือนเมื่อเก่ากว่า 90 วันหรือเลย 30 ก.ย. 2570 · อัตราอากรไม่มีค่าตั้งต้น ต้องค้นพิกัดแล้วใส่เองทุกล็อต

```bash
node scripts/landed-cost.mjs scripts/example.json     # ตัวอย่างกระเป๋า 200 ใบ → 187.22 และ 175.40 ต่อใบ
node scripts/landed-cost.mjs --self-test
```

**Script path:** ติดตั้งจาก marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/import-landed-cost/scripts/landed-cost.mjs | sort -V | tail -1` · ใน repo SQT-Marketplace: `plugins/e-commerce/skills/import-landed-cost/scripts/landed-cost.mjs` · Node อย่างเดียว ไม่มี dependency

## 7 · เมื่อไหร่ต้องถามนักบัญชีหรือทนาย

- นำเข้าสินค้าที่อาจเป็นของต้องกำกัด หรือไม่แน่ใจ HS code

## 8 · รออนุมัติ

ย้อนไม่ได้หรือกระทบคนนอก agent เตรียมข้อมูลและร่างให้ แต่ไม่ทำเอง

- โอนเงินซื้อสินค้า จ่ายค่าชิปปิ้ง หรือชำระอากรและภาษี
- ลงนามสัญญากับชิปปิ้ง
- ใส่รหัสผ่าน รหัสยืนยันตัวตน หรือเลขบัญชีของผู้ใช้

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| ตั้งราคาขายบน Shopee Lazada TikTok Shop หลังรู้ต้นทุน | `marketplace-fees-pricing` |
| เลือกรูปแบบธุรกิจ จดทะเบียน และจด VAT | `thai-business-setup` |
| ยื่น VAT รายเดือนและภาษีซื้อ | `tax-vat-th` + agent `tax-helper` |
| เทียบขนส่งในประเทศ | `shipping-compare` |
| ถ้อยคำทุกบรรทัด | `human-writing` |

## ตรวจก่อนส่ง

1. อัตราอากรมาจากพิกัดจริงของสินค้า ไม่ใช่ค่าในตัวอย่าง และบอกว่าดูสิทธิ Form E แล้วหรือยัง
2. ตัวเลขทุกบรรทัดมาจาก `landed-cost.mjs` และคำเตือนของสคริปต์ (rates.json เก่า · อัตราอากรผิดหน่วย) ส่งต่อให้ผู้ใช้ครบ
3. บอกต้นทุนต่อชิ้นทั้ง 2 แบบ (จด VAT หรือยัง) และบอกว่า VAT นำเข้าเป็นภาษีซื้อได้เฉพาะเมื่อนำเข้าในชื่อกิจการเอง

ที่มาของแนวคิด: โครงคำนวณ landed cost ได้แนวคิดจาก https://github.com/Boom-Vitt/claude-thai-business-skills (MIT License · Copyright (c) 2026 Vittawat (boombignose) · ตรวจไฟล์ LICENSE 2026-10-23) · เขียนใหม่ทั้งหมด ไม่คัดลอกข้อความ และตรวจตัวเลขทุกตัวกับแหล่งทางการใหม่ · ต้นทางยังเขียนว่าพัสดุราคาต่ำกว่า 1,500 บาทอาจไม่เสียอากร ซึ่งไม่ตรงกับกติกาตั้งแต่ 1 ม.ค. 2569


---

# skill: seller-tax-basics

Use when a Thai individual selling online asks about tax (40(8), deemed expenses, PND 90 and 94, VAT).

# Seller Tax Basics (Thai individual online seller)

General information, not tax advice — confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. Figures are as checked below (brackets from the tax year 2568 ภ.ง.ด.90 instructions, same as `thai-business-setup` section 2; no change announced for tax year 2569 as of the check date).

The Revenue Department already sees most online sales: banks and e-wallets report high-volume accounts, and large platforms report seller income. Not filing is no longer invisible.

## Workflow

1. **Classify income** — selling goods online as an individual = เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees
3. **Choose the expense method** — 60% deemed or actual (table below); compute both
4. **Run the 0.5% minimum-tax check** (below) — it often decides the bill for low-margin shops
5. **File half-year** ภ.ง.ด.94 for January–June sales (by 30 September; e-filing extension for this form is not confirmed — `tax-vat-th` section 2 lists only VAT and withholding forms)
6. **File full-year** ภ.ง.ด.90 by 31 March of the following year (by 31 March 2570 — the +8-day e-Filing extension in `tax-vat-th` section 2 covers forms due up to 31 Jan 2570; no renewal announced yet, so plan for no extension (expected) and check rd.go.th before filing), crediting tax paid with ภ.ง.ด.94
7. **Watch the value added tax (VAT) line** monthly — when sales for the year pass ฿1.8 million, register for VAT within 30 days (below)
8. **Keep records** (list below) (retention period: `sme-bookkeeping` section 2 — 5 years minimum, 7 recommended — per a Revenue Department ruling, not yet checked against the current statute)

## Thresholds and key figures

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married (for filing purposes) |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | Applies when non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Personal income tax brackets (net income) | 0–150,000: exempt · 150,001–300,000: 5% · 300,001–500,000: 10% · 500,001–750,000: 15% · 750,001–1,000,000: 20% · 1,000,001–2,000,000: 25% · 2,000,001–5,000,000: 30% · above 5,000,000: 35% |
| VAT registration | Compulsory once annual sales exceed ฿1.8 million; register (ภ.พ.01) within 30 days of exceeding; then file ภ.พ.30 every month, even with zero sales: paper by the 15th, e-filing by the 23rd while the +8-day extension runs (to 31 Jan 2570, see `tax-vat-th`) |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th · https://flowaccount.com/blog/shopee-income-tax-threshold/ · https://www.thairath.co.th/money/personal_finance/finance_banking/2778210 · https://www.prd.go.th/th/content/category/detail/id/33/iid/526275 (VAT 7% to 30 Sep 2570, same source as `tax-vat-th`) · ตรวจซ้ำ 2026-10-22: พ.ร.ฎ. ฉบับที่ 807 พ.ศ. 2569 ลงราชกิจจานุเบกษา 23 ส.ค. 2569 มีผล 1 ต.ค. 2569 (ไฟล์กรมสรรพากร https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf มีจริง แต่อ่านข้อความไม่ออก · วัน/เลขฉบับจาก lookuptax.com และข่าว — ตรวจกับราชกิจจาฯ อีกครั้ง) · 40(8) หักเหมา 60% อัตราเดียว: ข่าวกรมสรรพากร ต.ค. 2560 https://media.thaigov.go.th (ยังไม่ได้เทียบประกาศฉบับปัจจุบัน)

## 60% deemed vs actual expenses

| Use | When |
|---|---|
| **60% deemed (หักเหมา)** | Real costs are below 60% of sales (high-margin products, handmade, digital) or the seller has no receipts |
| **Actual (หักตามจริง)** | Real costs are above 60% (most resellers on thin margins) **and** every cost has a proper receipt or tax invoice: goods bought, packaging, platform fees, shipping, ads, rent |

You choose per tax year; switching to actual means you must be able to prove every baht.

## Worked example — single reseller, tax year 2569

Gross sales ฿1,200,000 (all channels). Actual costs with receipts ฿900,000. No other income, only the personal allowance.

| | 60% deemed | Actual |
|---|---|---|
| Expense | 720,000 | 900,000 |
| Net after expense | 480,000 | 300,000 |
| Less personal allowance | 60,000 | 60,000 |
| Net income | 420,000 | 240,000 |
| Tax by brackets | 7,500 + 12,000 = **19,500** | 4,500 |
| 0.5% minimum check (0.5% × 1,200,000) | 6,000 | 6,000 → higher than 4,500 and over ฿5,000 |
| **Tax payable** | **19,500** | **6,000** |

Actual expenses win, but only with receipts — and the 0.5% minimum lifts the bill from ฿4,500 to ฿6,000. Sales are under ฿1.8 million, so no VAT registration yet; as sales grow, check monthly.

### Run the script, do not add up by hand

`scripts/tax-compare.mjs` does the table above in one call: both methods, the 0.5% check and which one is cheaper. Rates live in `scripts/rates.json` with the date they were checked; the report prints that date and warns when it is older than 90 days.

```bash
node scripts/tax-compare.mjs scripts/example.json      # { "sales": 1200000, "actual_expenses": 900000 } → 19,500 vs 6,000
node scripts/tax-compare.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/seller-tax-basics/scripts/tax-compare.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/seller-tax-basics/scripts/tax-compare.mjs` · Node only, no dependencies.

`allowances` is the year's total allowances (default: personal ฿60,000 only). Salary or other income types are out of scope — use `payroll-th` or ask an accountant. Comparing sole trader against a company: `"mode": "company"`, see `thai-business-setup` section 2.

## Who reports your sales to the Revenue Department

| Reporter | Rule |
|---|---|
| Banks, e-wallets, payment providers — กฎหมาย e-Payment (พ.ร.บ.แก้ไขเพิ่มเติมประมวลรัษฎากร ฉบับที่ 48 พ.ศ. 2562) | Report accounts that **receive more than 3,000 deposits/transfers a year**, or **more than 400 transactions with a total above ฿2 million a year**, counted per institution |
| E-commerce platforms (ประกาศอธิบดีกรมสรรพากร, from accounting periods starting 1 Jan 2567) | Platforms registered in Thailand with revenue above ฿1,000 million a year keep a special account and send seller income data within 150 days after year-end |

Being reported is not a tax bill; it means the Revenue Department can compare your filing with the data.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.kasikornbank.com/th/kwealth/Pages/e-payment-tax.aspx · https://brandinside.asia/?p=160771 · thresholds as reported; regulation text (รอยืนยัน) at rd.go.th

## Registration

- **ทะเบียนพาณิชย์ (commercial registration)** — online sellers are required to register with the local registrar or กรมพัฒนาธุรกิจการค้า (DBD) within 30 days of starting (รอยืนยัน current exemptions); then the DBD Registered trust mark is possible
- **VAT** — see thresholds; voluntary registration earlier is allowed but adds monthly filing
- **Company** — consider when net profit regularly pushes the owner into the 25%+ bracket; ask an accountant

## Records to keep

- Platform monthly income/payout reports and fee invoices (Shopee, Lazada, TikTok Shop each provide downloadable statements)
- Bank and e-wallet statements for LINE/Facebook sales
- Purchase receipts and tax invoices for stock, packaging, shipping, ads
- Stock records (`multi-shop-stock`) — they back up the cost of goods sold
- Copies of ภ.ง.ด.94, ภ.ง.ด.90, ภ.พ.30 and payment receipts

## Related

- `marketplace-fees-pricing` — VAT `v` in the price formula after registering
- `doc-quotation` — invoices and receipts; `tax-vat-th` — VAT filing calendar
- `trading-finance` `tax-basics-th` (if installed) — other personal income (investments) in the same ภ.ง.ด.90
