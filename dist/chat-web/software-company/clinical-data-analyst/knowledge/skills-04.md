# skill: pdpa-compliance

Use when software stores personal data of people in Thailand (PDPA consent, rights, retention, breach).

# PDPA — ข้อมูลส่วนบุคคล

> **กฎข้อเดียว:** ข้อมูลที่ไม่ได้เก็บ คือข้อมูลที่ไม่รั่ว ไม่ต้องดูแล และไม่ต้องลบ
> คำถามแรกเสมอคือ "จำเป็นต้องเก็บไหม" ไม่ใช่ "เก็บยังไงให้ปลอดภัย"

> ⚠️ นี่คือแนวทางสำหรับคนทำระบบ **ไม่ใช่คำแนะนำทางกฎหมาย**
> เรื่องที่มีผลทางกฎหมายต้องให้ที่ปรึกษากฎหมายตัดสิน

## ทางลัด — แอปที่ข้อมูลอยู่ในเครื่องผู้ใช้เท่านั้น

ถ้าแอปไม่มีเซิร์ฟเวอร์ ไม่มีบัญชี และไม่ส่งข้อมูลออก ให้ข้ามหัวข้อเรื่องผู้ประมวลผลและฐานข้อมูลได้ แล้วตรวจแค่ 3 เรื่องนี้

| เรื่อง | ทำไมยังเกี่ยว | ทำอะไร |
|---|---|---|
| Android Auto Backup | ระบบสำรองข้อมูลแอปขึ้น Google Drive เองโดยค่าเริ่มต้น | ตั้ง `android:allowBackup` และ `android:dataExtractionRules` ให้ตรงกับที่ตั้งใจ แล้วลงเหตุผลไว้ใน `decision-log` |
| ส่งออก · share sheet (หน้าต่างแชร์ของระบบ) | ข้อมูลออกจากเครื่องทางนี้ทางเดียว | ส่งเฉพาะที่ผู้ใช้เลือก และไม่แนบตำแหน่งหรือ metadata ของภาพโดยไม่บอก |
| ข้อมูลที่ร้านค้าบังคับให้แจ้ง | Google Play บังคับกรอกแบบฟอร์ม Data safety ทุกแอป | กรอกตามจริง (ไม่เก็บก็ตอบว่าไม่เก็บ) ส่วนเรื่องที่ว่าขอสิทธิ์กล้องแล้วต้องมีนโยบายความเป็นส่วนตัวไหม `(รอยืนยัน)` ให้เตรียมหน้าสั้น ๆ ไว้ก่อน |

ถ้าภายหลังเพิ่ม analytics · crash report หรือบัญชีผู้ใช้ แอปนี้ก็ไม่ใช่แอปในเครื่องอย่างเดียวแล้ว ให้กลับไปใช้ทั้ง skill

## เมื่อไหร่ใช้ skill นี้

- ระบบเก็บชื่อ เบอร์โทร อีเมล ที่อยู่ เลขบัตร รูป หรือข้อมูลอื่นที่ระบุตัวบุคคลได้
- ลูกค้าหรือฝ่ายกฎหมายถามเรื่องความสอดคล้องกับ PDPA
- ต้องทำหน้าขอความยินยอม หรือหน้าให้ผู้ใช้ขอลบข้อมูล
- จะส่งข้อมูลให้ผู้ให้บริการภายนอก

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ร่องรอยว่าใครทำอะไรกับข้อมูล | `audit-trail` |
| ตารางและการเข้ารหัสระดับคอลัมน์ | `database-design` |
| การยืนยันตัวตนและสิทธิ์ | `auth-implementation-patterns` |
| ปิดบังข้อมูลใน log | `logging-standards` |
| ที่เก็บกุญแจ | `config-and-secrets` |
| แบบฟอร์มยินยอม ประกาศความเป็นส่วนตัว และเอกสาร PDPA ของบริษัท (ไม่ใช่ระบบซอฟต์แวร์) | (ถ้าติดตั้ง plugin `e-commerce`) `e-commerce:pdpa-workflow` ไม่มีก็ใช้ข้อ 3 ของ skill นี้เป็นโครง |

---

## 1 · ทำรายการก่อน

**ตอบคำถาม "ข้อมูลของฉันอยู่ที่ไหนบ้าง" ไม่ได้ ถ้าไม่มีรายการนี้**

| ข้อมูล | เก็บที่ไหน | เก็บทำไม | ฐานทางกฎหมาย | เก็บนานเท่าไหร่ | ใครเห็นได้ | ส่งให้ใครบ้าง |
|---|---|---|---|---|---|---|
| ชื่อ-นามสกุล | `users.name` | ระบุตัวลูกค้า | สัญญา | 5 ปีหลังปิดบัญชี | ฝ่ายขาย · ผู้ดูแล | — |
| เบอร์โทร | `users.phone` | แจ้งสถานะจัดส่ง | สัญญา | เหมือนแถวบน | เหมือนแถวบน | ผู้ให้บริการ SMS |
| เลขบัตรประชาชน | `kyc.id_number` | ยืนยันตัวตนตามกฎหมาย | หน้าที่ตามกฎหมาย | 10 ปี | ฝ่ายปฏิบัติตามกฎเกณฑ์ | — |

**ทำรายการนี้ให้ครบทุกที่จริง ๆ** — ฐานข้อมูลหลัก · ที่สำรอง · log · ระบบวิเคราะห์ ·
ที่เก็บไฟล์ · สเปรดชีตที่ทีมทำเอง · แอปมือถือ: Android Auto Backup และไฟล์ที่ส่งออกผ่าน share sheet

---

## 2 · ฐานทางกฎหมาย — ไม่ใช่ทุกอย่างต้องขอความยินยอม

| ฐาน | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| **สัญญา** | จำเป็นเพื่อให้บริการตามที่ตกลง | ที่อยู่สำหรับจัดส่ง |
| **หน้าที่ตามกฎหมาย** | กฎหมายบังคับให้เก็บ | เอกสารภาษี |
| **ประโยชน์อันชอบธรรม** | จำเป็นและไม่กระทบสิทธิเกินควร | log ความปลอดภัย · ป้องกันการฉ้อโกง |
| **ความยินยอม** | ทำไม่ได้ด้วยฐานอื่น | การตลาด · cookie ติดตามพฤติกรรม |

> 🚨 **ความยินยอมคือฐานที่อ่อนที่สุด เพราะถอนเมื่อไหร่ก็ได้**
> ถ้าขอความยินยอมสำหรับที่อยู่จัดส่ง แล้วเขาถอน ระบบจะส่งของไม่ได้
> **ที่อยู่จัดส่งใช้ฐานสัญญา** ไม่ใช่ความยินยอม
>
> การกดปุ่ม "ยอมรับทั้งหมด" ที่ทำให้ใช้งานต่อไม่ได้ถ้าไม่กด ไม่ถือว่าเป็นความยินยอมโดยอิสระ

---

## 3 · ความยินยอมที่ใช้ได้จริง

| ต้องมี | รายละเอียด |
|---|---|
| **แยกเป็นเรื่อง ๆ** | การตลาดทางอีเมล · การติดตามพฤติกรรม · การส่งต่อให้พันธมิตร — แยกช่องกัน |
| ไม่ติ๊กมาให้ล่วงหน้า | ต้องเป็นการกระทำของผู้ใช้เอง |
| ข้อความที่คนทั่วไปอ่านเข้าใจ | ไม่ใช่ย่อหน้ากฎหมาย 500 คำ |
| **บันทึกไว้** | ใคร · เรื่องอะไร · เมื่อไหร่ · ข้อความเวอร์ชันไหน · จากช่องทางไหน |
| ถอนได้ง่ายเท่าที่ให้ | ถ้าให้ได้ด้วย 1 คลิก ก็ต้องถอนได้ด้วย 1 คลิก |
| ถอนแล้วมีผลจริง | **ต้องมีโค้ดที่หยุดใช้ข้อมูลนั้นจริง** ไม่ใช่แค่เก็บค่าไว้ |

ตารางที่ต้องมี: `consent` — `user_id` · `purpose` · `granted` · `granted_at` · `withdrawn_at` ·
`policy_version` · `source` · `ip`
**เก็บเป็นประวัติ ไม่ใช่เขียนทับ** — ต้องพิสูจน์ย้อนหลังได้ว่าตอนนั้นเขายินยอมอะไรไว้

---

## 4 · สิทธิของเจ้าของข้อมูล

ระบบต้อง**ทำได้จริง** ไม่ใช่รอทำมือทุกครั้ง โดยทั่วไปต้องตอบสนองภายใน 30 วัน

| สิทธิ | ระบบต้องทำอะไรได้ |
|---|---|
| ขอดู | ออกสำเนาข้อมูลทั้งหมดของคนนั้น |
| ขอแก้ | แก้ข้อมูลที่ไม่ถูกต้อง แล้ว**ส่งต่อการแก้ไปยังที่ที่เคยส่งข้อมูลไป** |
| **ขอลบ** | ลบจริงจากทุกที่ที่ใช้งานอยู่ รวม log · ส่วนไฟล์สำรองให้ตัดออกจากการใช้งาน (ถ้ากู้คืนต้องลบซ้ำ) แล้วปล่อยให้หมดอายุตามรอบหมุนเวียน (ดูข้อ 6) พร้อมบอกเจ้าของข้อมูลว่าข้อมูลในไฟล์สำรองจะหายภายในวันที่เท่าไร |
| ขอให้ระงับใช้ | หยุดใช้ชั่วคราวโดยไม่ลบ |
| ขอย้ายข้อมูล | ส่งออกในรูปแบบที่เครื่องอ่านได้ |
| คัดค้าน | หยุดการตลาดหรือการประมวลผลที่คัดค้าน |

> 🚨 **"ขอลบ" คือข้อที่ทำยากที่สุด** — ข้อมูลอยู่ในฐานข้อมูล ที่สำรอง log ระบบวิเคราะห์
> และผู้ให้บริการภายนอก **ออกแบบให้ลบได้ตั้งแต่วันแรก** ไม่ใช่มาไล่หาทีหลัง
>
> soft delete อย่างเดียว**ไม่นับว่าลบ** ส่วนข้อมูลที่กฎหมายบังคับให้เก็บต่อ (เช่นเอกสารภาษี)
> เก็บได้ แต่ต้องบอกเจ้าของข้อมูลว่าเก็บอะไรไว้เพราะอะไร

---

## 5 · เก็บเท่าที่จำเป็น

| หลัก | ตัวอย่าง |
|---|---|
| **ไม่ถามสิ่งที่ไม่ได้ใช้** | ขายของออนไลน์ ไม่ต้องขอเลขบัตรประชาชน |
| เก็บช่วงแทนค่าจริง | เก็บช่วงอายุ ไม่ใช่วันเกิด ถ้าใช้แค่แบ่งกลุ่ม |
| **แฮชหรือทำให้ไม่ระบุตัวตน** สำหรับงานวิเคราะห์ | ระบบสถิติไม่ต้องรู้ว่าใครเป็นใคร |
| เข้ารหัสระดับคอลัมน์ | เลขบัตร ข้อมูลสุขภาพ |
| ปิดบังตอนแสดง | `x-xxxx-xxxx-12-3` |
| **แยกข้อมูลอ่อนไหวออกจากตารางหลัก** | จำกัดสิทธิ์และตรวจสอบง่ายกว่า |

**ข้อมูลอ่อนไหวเป็นชั้นที่เข้มกว่า** (มาตรา 26) — เช่น เชื้อชาติ เผ่าพันธุ์ ความคิดเห็นทางการเมือง ความเชื่อลัทธิ ศาสนาหรือปรัชญา พฤติกรรมทางเพศ
ประวัติอาชญากรรม **ข้อมูลสุขภาพ** ความพิการ ข้อมูลสหภาพแรงงาน ข้อมูลพันธุกรรม ข้อมูลชีวภาพ และข้อมูลอื่นที่กระทบเจ้าของข้อมูลในทำนองเดียวกัน
จึงเก็บได้เมื่อจำเป็นจริงและต้องมีมาตรการเข้มกว่าปกติ (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา 26 ตรวจ 22 ต.ค. 2569)

**ห้ามใช้ข้อมูลจริงบนเครื่องพัฒนาหรือ staging** — ต้องปิดบังก่อนเสมอ (ดู `cicd-and-release`)

---

## 6 · อายุการเก็บ

- กำหนด**ต่อประเภทข้อมูล** ไม่ใช่ทั้งระบบเป็นค่าเดียว
- **มีงานลบจริงที่รันตามรอบ** — นโยบายที่ไม่มีงานรันคือนโยบายที่ไม่มีอยู่จริง
- log ที่มีข้อมูลบุคคลก็มีอายุเช่นกัน (ดู `logging-standards`)
- ไฟล์สำรองข้อมูลต้องมีรอบหมุนเวียนที่ทำให้ข้อมูลเก่าหายไปเองในที่สุด
- ก่อนลบจริงครั้งแรก ให้แสดงรายการที่จะถูกลบและให้คนอนุมัติ

---

## 7 · ผู้ให้บริการภายนอกและการส่งข้อมูลออกนอกประเทศ

| เรื่อง | ต้องทำ |
|---|---|
| รายชื่อผู้ประมวลผล | ทำรายการว่าส่งข้อมูลอะไรให้ใคร — คลาวด์ · SMS · อีเมล · วิเคราะห์ · แชต |
| สัญญา | มีข้อตกลงการประมวลผลข้อมูลกับทุกราย |
| ส่งออกนอกประเทศ | ตรวจว่าประเทศปลายทางมีมาตรฐานเพียงพอ หรือมีข้อสัญญามาตรฐานรองรับ |
| ตัววัดสถิติและโฆษณา | นับเป็นการส่งข้อมูลออกไป — **ต้องมีฐานทางกฎหมายรองรับ** |
| ยกเลิกใช้บริการ | ต้องได้ข้อมูลคืนและให้เขาลบจริง |

> **จุดที่คนลืมบ่อยที่สุด** — ปลั๊กอินวัดสถิติที่ใส่ไว้ตั้งแต่วันแรก ส่งข้อมูลพฤติกรรม
> ผู้ใช้ออกไปต่างประเทศทุกวัน โดยไม่เคยมีใครใส่ไว้ในรายการ

---

## 8 · เมื่อข้อมูลรั่ว — 72 ชั่วโมงแรก

| ลำดับ | ทำอะไร |
|---|---|
| 1 | **หยุดการรั่วก่อน** — เพิกถอนกุญแจ ปิดช่องทาง |
| 2 | ประเมินขอบเขต — ข้อมูลอะไร กี่คน อ่อนไหวไหม |
| 3 | เก็บหลักฐาน — log และสถานะระบบ **ก่อน**ที่จะแก้ทับ |
| 4 | แจ้งผู้รับผิดชอบภายในและที่ปรึกษากฎหมายทันที |
| 5 | **แจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลภายใน 72 ชั่วโมง** เมื่อเข้าเงื่อนไข |
| 6 | แจ้งเจ้าของข้อมูล เมื่อมีความเสี่ยงสูงต่อเขา |
| 7 | บันทึกเหตุการณ์ด้วย `postmortem-template` |

**เตรียมไว้ล่วงหน้า ไม่ใช่ตอนเกิดเรื่อง** — ใครเป็นคนตัดสินใจแจ้ง · เบอร์ที่ปรึกษากฎหมาย ·
แม่แบบข้อความแจ้ง · วิธีดึงรายชื่อผู้ได้รับผลกระทบ

---

## 9 · Anti-patterns

- ❌ **ขอความยินยอมสำหรับทุกอย่าง** — พอเขาถอน ระบบทำงานต่อไม่ได้
- ❌ **ช่องติ๊กที่ติ๊กมาให้แล้ว** — ไม่ถือเป็นความยินยอม
- ❌ **เก็บความยินยอมเป็นค่าเดียว `accepted_terms = true`** — พิสูจน์ย้อนหลังไม่ได้ว่ายินยอมอะไร
- ❌ **soft delete แล้วบอกว่าลบแล้ว**
- ❌ **นโยบายอายุการเก็บที่ไม่มีงานลบจริง**
- ❌ **ใช้ข้อมูลจริงบน staging** — และคัดลอกลงเครื่อง developer
- ❌ **เก็บเลขบัตรประชาชนเพราะ "เผื่อใช้"**
- ❌ **ข้อมูลส่วนบุคคลใน log และในรายงาน crash**
- ❌ **ไม่มีรายการผู้ให้บริการภายนอก** — ตอบไม่ได้ว่าข้อมูลไปที่ไหนบ้าง
- ❌ **ส่งออก Excel ที่มีข้อมูลเต็ม** ให้คนที่ต้องการแค่ยอดรวม
- ❌ **นโยบายความเป็นส่วนตัวที่ไม่ตรงกับสิ่งที่ระบบทำจริง**

---

## 10 · มาตราที่อ้างบ่อย และตัวย่อ

ใช้ตอนลูกค้าหรือฝ่ายกฎหมายถามว่า "ข้อนี้อยู่มาตราไหน" (ตรวจกับฉบับแปลอังกฤษไม่เป็นทางการของ พ.ร.บ. 2562 ราชกิจจานุเบกษา 27 พ.ค. 2562 เมื่อ 23 ต.ค. 2569)

| เรื่อง (ข้อใน skill นี้) | มาตรา |
|---|---|
| ความยินยอม (ข้อ 3) | 19 |
| ฐานทางกฎหมายที่ไม่ต้องขอความยินยอม (ข้อ 2) | 24 |
| ข้อมูลอ่อนไหว (ข้อ 5) | 26 |
| ส่งข้อมูลออกนอกประเทศ (ข้อ 7) | 28 |
| สิทธิเจ้าของข้อมูล (ข้อ 4) — ขอดู · ขอย้าย · คัดค้าน · ขอลบ · ขอระงับ · ขอแก้ | 30 · 31 · 32 · 33 · 34 · 35–36 |
| มาตรการความปลอดภัย · ระบบลบเมื่อหมดอายุ · แจ้งเหตุรั่วใน 72 ชั่วโมง (ข้อ 6, 8) | 37(1) · 37(3) · 37(4) |
| บันทึกรายการประมวลผล (ข้อ 1) | 39 |
| เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) | 41 |
| ค่าสินไหม · ค่าเสียหายเชิงลงโทษ | 77 · 78 |
| โทษปรับทางปกครอง สูงสุด 1 · 3 · 5 ล้านบาท | 82 · 83 · 84 |

**ภาคที่มีกฎทับอีกชั้น** — สุขภาพ · การเงิน · โทรคมนาคม มีหน่วยกำกับของตัวเอง (กระทรวงสาธารณสุข · ธปท./ก.ล.ต./คปภ. · กสทช.) ที่เพิ่มเงื่อนไขเรื่องความลับ อายุการเก็บ และการแจ้งเหตุ ให้ตรวจกฎของภาคนั้นก่อนออกแบบ ไม่ใช่ยึด PDPA อย่างเดียว (แนวคิดจาก BV thai-pdpa (MIT))

- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
- **ข้อมูลส่วนบุคคล** — ข้อมูลที่ระบุตัวบุคคลได้ ไม่ว่าทางตรงหรือทางอ้อม
- **ข้อมูลอ่อนไหว** — ข้อมูลส่วนบุคคลกลุ่มพิเศษ เช่น สุขภาพ เชื้อชาติ ศาสนา
- **ผู้ควบคุมข้อมูล** — ผู้ตัดสินใจว่าจะเก็บและใช้ข้อมูลอย่างไร (โดยทั่วไปคือเจ้าของระบบ)
- **ผู้ประมวลผลข้อมูล** — ผู้ที่ประมวลผลข้อมูลตามคำสั่งของผู้ควบคุม เช่น ผู้ให้บริการคลาวด์
- **เจ้าของข้อมูล** — บุคคลที่ข้อมูลนั้นเป็นของเขา

## 11 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ร่องรอยว่าใครดูหรือแก้ข้อมูล | `audit-trail` |
| ตาราง การเข้ารหัส และ soft delete | `database-design` |
| ปิดบังข้อมูลใน log | `logging-standards` |
| สิทธิ์เข้าถึงและการยืนยันตัวตน | `auth-implementation-patterns` |
| ปิดบังข้อมูลจริงก่อนลง staging | `cicd-and-release` |
| การส่งและการยกเลิกรับข้อความการตลาด (เรื่องความยินยอมอยู่ที่ skill นี้) | `notifications` |
| ปิดบังข้อมูลในไฟล์ส่งออก | `data-import-export` |
| อายุการเก็บไฟล์แนบ | `file-upload-and-storage` |
| งานลบข้อมูลที่หมดอายุ | `background-jobs` |
| บันทึกเหตุการณ์หลังข้อมูลรั่ว | `postmortem-template` · `incident-runbook-template` |


---

# skill: markdown-visuals

Use when a markdown doc needs a picture. Pick inline SVG, image file, ASCII or Mermaid by where it is read (GitHub drops inline SVG).

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-company`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-company`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-company`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-company`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-company`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams` (plugin `software-company`) ข้อ 1–5 และ `assets/mermaid-theme.md`** · Mermaid ในเอกสารโปรเจกต์ที่ต้องแปลงเป็นรูปลง Word ใช้ตัวแปลงใน `diagram-figures` → `references/engine-mermaid.md`
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-company`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-company`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-company`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากเนื้องานไว้ในรายงาน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีแบรนด์** (ไม่มี → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).
