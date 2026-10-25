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

# skill: docker-sandbox

Use when a project needs its own Docker container (untrusted code, system installs, overnight runs) or the user says sandbox.

# docker-sandbox — ห้องทดลองต่อโปรเจกต์

> เครื่องเราเป็นคนสั่ง ห้องทดลองเป็นที่ลงมือ
> ข้างในติดตั้ง ลบ รันเซิร์ฟเวอร์ ทำฐานข้อมูลทดสอบได้เต็มที่ เพราะพังแล้วล้างทิ้งสร้างใหม่ได้ในคำสั่งเดียว
> ข้างนอก (เครื่องจริง · ระบบจริง · บัญชีจริง) แตะไม่ได้ เพราะไม่มีทางเข้าจากข้างใน

ใช้คู่กับ [`superuser`](../superuser/SKILL.md) — โปรเจกต์ที่มี `.sandbox/` งานติดตั้งและรันทุกอย่างทำในห้องนี้

---

## 1 · หนึ่งโปรเจกต์ = หนึ่งห้อง

- **ห้องเดียวต่อโปรเจกต์** ชื่อ `sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่สร้าง>` (เช่น `sandbox-agent-sample-app-20260125`)
  - ตั้งชื่อครั้งเดียวตอน `up` แรก แล้วเก็บในไฟล์ `.sandbox/.name-<ชื่อโฟลเดอร์>` คำสั่งทีหลังอ่านชื่อจากไฟล์นี้ ชื่อจึงไม่เปลี่ยนตามวัน
  - prefix `sandbox-agent-` บอกว่า agent สร้างห้องนี้ ไม่ใช่คนตั้ง ส่วนวันที่สร้างเก็บซ้ำไว้ใน label `sqt.created`
  - ถ้าโปรเจกต์ต้องมีฐานข้อมูล cache หรือเบราว์เซอร์ ให้เพิ่มเป็น service ใน**ห้องเดียวกัน** (stack เดียว) ไม่แยกห้องใหม่
- **image ฐานใช้ร่วมกันทั้งเครื่อง** — `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) build ครั้งเดียว ส่วน image ของแต่ละโปรเจกต์เพิ่มแค่ชั้นบาง ๆ ที่โปรเจกต์นั้นต้องใช้ จึงไม่กินดิสก์ซ้ำ
- **ห้องที่หยุดอยู่ไม่กิน CPU และหน่วยความจำ** กินแค่ดิสก์ จบงานแล้วให้ `stop` และเลิกงานทั้งวันให้ `stop-all`
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกันที่ต้องแยกเครื่องจริง (งานลองหลายทางทั่วไปใช้ git worktree ต่อตัวตาม `parallel-split-and-merge` เร็วกว่า) แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — เพราะของที่ติดตั้งจะชนกัน โปรเจกต์หนึ่งพังแล้วลามไปอีกโปรเจกต์ และล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ (`sandbox.ps1 claude` ใช้ไม่ได้ในโหมดนี้) | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางที่ต้องแยกเครื่องจริง (ห้องละทาง) |

เพิ่ม `-Locked` ได้ทั้งสองแบบ — ปิดอินเทอร์เน็ตขาออก เหลือเฉพาะโฮสต์ใน `allowlist.txt` เหมาะกับงานที่รันโค้ดที่ยังไม่ไว้ใจ

---

## 3 · ตั้งห้องให้โปรเจกต์ (ครั้งแรก)

1. ตรวจว่า Docker Desktop รันอยู่ — `docker version` ต้องเห็นทั้ง Client และ Server ถ้าไม่เห็น ให้บอกผู้ใช้ให้เปิด Docker Desktop แล้วหยุดเฉพาะงานนี้
2. คัดลอกทุกไฟล์ใน `assets/` ของ skill นี้ไปที่ `<โปรเจกต์>/.sandbox/` (ที่ราก) แล้วประกาศ `.sandbox/` เป็นข้อยกเว้นของรากใน README ของโฟลเดอร์โค้ด ตาม `project-doc-set` ข้อ 1
3. ปรับ `Dockerfile` (ชั้นของโปรเจกต์)
   - ถ้าเป็น .NET ให้ตั้ง `INSTALL_DOTNET=1` แล้วเพิ่ม `apt-get install` ของที่โปรเจกต์ต้องใช้
   - **อย่าแก้ `base.Dockerfile`** ถ้าไม่จำเป็น เพราะทุกโปรเจกต์ใช้ร่วมกัน
   - ถ้าต้องมีฐานข้อมูลทดสอบ ให้เพิ่มเป็น service ใหม่ใน `compose.yaml` (ไม่เปิด port ออกนอก)
4. เพิ่ม `.sandbox/.mode-*` และ `.sandbox/.name-*` ใน `.gitignore`
5. เปิดห้อง — `.\.sandbox\sandbox.ps1 up` (หรือ `up -Isolated` · `up -Browser`) โปรเจกต์แรกของเครื่องต้อง build image ฐานก่อน ใช้เวลาราว 5–15 นาที ส่วนโปรเจกต์ถัดไปจะเร็วขึ้นมาก
6. **พิสูจน์ว่าใช้ได้** — `sandbox.ps1 exec "node -v && python3 --version && git status"` ถ้าโปรเจกต์มีคำสั่ง test ให้รันผ่าน `exec` 1 ครั้ง ส่วนโหมด `-Locked` ต้องเห็นบรรทัด `check passed`
7. ลงใน `docs/README.md` ของโปรเจกต์ — ชื่อห้อง (`sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่>`) · โหมด · port · คำสั่ง test ในห้อง

**ทดสอบจริงแล้ว** บน Windows + Docker Desktop 4.46 (2026-10-05, โปรเจกต์ `sample-app`) — build ห้องได้ · unit test ผ่าน 15/15 · e2e บน Chromium ผ่าน 14/14 ในห้อง

บั๊กที่เจอระหว่างทดสอบแก้ในสคริปต์แล้ว: PowerShell 5.1 กับ stderr · Playwright คนละรุ่นกับ image ฐาน · พอร์ตชน

ถ้าสคริปต์พังบนเครื่องอื่น ให้ใช้ playbook `bug-fix` กับตัวสคริปต์

**พอร์ต** — `up` หาพอร์ตว่างเอง เริ่มที่ 3000 แล้วบอกว่าได้พอร์ตไหน
- ในห้องตั้งตัวแปร `APP_PORT` และ `PORT` เป็นพอร์ตนั้น และ `HOST=0.0.0.0`
- แอปต้องฟังที่ `HOST` เพราะถ้าฟังแค่ `127.0.0.1` ในห้อง เครื่องจะเข้าไม่ถึง
- ฝั่งเครื่องยังเปิดแค่ `127.0.0.1` เหมือนเดิม จึงเข้าจากเครื่องที่ `http://127.0.0.1:<พอร์ต>`

**Playwright คนละรุ่น** — image ฐานมี Chromium รุ่นล่าสุด ถ้าโปรเจกต์ล็อก Playwright รุ่นอื่นไว้ ให้รัน `npx playwright install chromium` ในห้อง 1 ครั้งหลัง `npm ci` (ไม่ต้อง `--with-deps` เพราะ image มีให้แล้ว)

---

## 4 · ใช้ทุกวัน

| ต้องการ | คำสั่ง (รันที่รากโปรเจกต์บนเครื่อง) |
|---|---|
| รันคำสั่งในห้อง (agent ใช้อันนี้) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| เปิด shell ในห้อง | `.\.sandbox\sandbox.ps1 shell` |
| ให้ Claude Code ทำงานในห้องเต็มที่ (**isolated เท่านั้น**) | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้ · โหมด mount สคริปต์จะปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริง) |
| เอางานจากห้อง isolated ออกมา | `.\.sandbox\sandbox.ps1 sync` แล้วอ่าน patch ก่อน `git apply` |
| ห้องทั้งหมดในเครื่อง | `.\.sandbox\sandbox.ps1 list` |
| ล้างห้องให้สะอาด เริ่มใหม่ | `reset` แล้ว `up` |
| หยุดทุกห้องในเครื่อง คืนหน่วยความจำ | `.\.sandbox\sandbox.ps1 stop-all` |
| ห้องหลายห้องของโปรเจกต์เดียว | ใส่ `-Name <โปรเจกต์>-a1` ทุกคำสั่ง |

**กฎของ agent เมื่อโปรเจกต์มี `.sandbox/`**
- install · build · test · dev server · migration และสคริปต์ใด ๆ ให้รันผ่าน `sandbox.ps1 exec` ไม่รันบนเครื่อง
- skill ตรวจแอปของโปรเจกต์ (`app-verifier-setup`) รัน Playwright ในห้องแบบไม่มีหน้าจอ แล้วคัดภาพออกด้วย `docker compose cp` มาไว้ `_to_delete/`
- ถ้าห้องหยุดอยู่ ให้ `up` เองได้เลย (ย้อนได้) ถ้าห้องพังจนแก้ไม่ได้ ก็ `reset` เองได้ เพราะของในห้องไม่ใช่ของผู้ใช้ — **ยกเว้น** ห้อง isolated ที่ยังไม่ได้ `sync` ต้อง sync ก่อนแล้วค่อย reset

---

## 5 · เบราว์เซอร์เสมือนสำหรับทดสอบ

| แบบ | ใช้เมื่อ | วิธี |
|---|---|---|
| headless ในห้อง (ค่าเริ่ม) | test อัตโนมัติ · verify skill · ไม่ต้องมีใครดู | Playwright Chromium มากับ image ฐานแล้ว |
| **มองเห็นได้** (`up -Browser`) | อยากดู agent กดจริงทีละขั้น · ตรวจหน้าจอด้วยตา · อัดภาพ | เบราว์เซอร์จริงในคอนเทนเนอร์แยก ดูสดที่ `http://127.0.0.1:7900` และ Playwright ในห้องจะขับผ่าน `SELENIUM_REMOTE_URL` ให้เอง (Playwright เรียกความสามารถนี้ว่ายังทดลอง) |
| ให้ Claude Code ในห้องคุมเบราว์เซอร์เอง | งานสำรวจหน้าเว็บที่ยังไม่มีสคริปต์ | ติดตั้ง Playwright MCP server ในห้อง (`.mcp.json` ของโปรเจกต์) ให้ทำงานแบบ headless |

- เบราว์เซอร์ในห้องไม่มีบัญชี ไม่มีคุกกี้ ไม่มีรหัสผ่านของผู้ใช้ — ล็อกอินด้วยบัญชีทดสอบของโปรเจกต์เท่านั้น
- ภาพและวิดีโอจากการทดสอบ คัดออกมาที่ `_to_delete/` ด้วย `docker compose cp`
- เบราว์เซอร์ของผู้ใช้บนเครื่อง (Chrome ที่ล็อกอินอยู่) ใช้กับเว็บจริงที่ต้องใช้บัญชีจริงเท่านั้น และทำตามกติกาของเครื่องมือนั้น ไม่ใช่ที่ทดสอบ

## 6 · CAPTCHA

- **ระบบของเราเอง** — CAPTCHA ไม่ควรขวางการทดสอบตั้งแต่ต้น
  - ใช้ค่าทดสอบ (test site key) ที่ผู้ให้บริการแจกไว้ ซึ่งผ่านทุกครั้ง reCAPTCHA · hCaptcha · Cloudflare Turnstile มีให้ทุกเจ้า ดูค่าได้จากเอกสารผู้ให้บริการ
  - หรือปิดด้วยค่าตั้งเฉพาะ environment ทดสอบ (`CAPTCHA_ENABLED=false`)
  - **ค่าทดสอบต้องไม่หลุดไปถึงระบบจริง** — ใส่ตัวตรวจตอนเริ่มระบบว่า production ห้ามใช้ test key (`config-and-secrets`)
- **เว็บของคนอื่น** — agent **ไม่แก้ CAPTCHA และไม่หาทางหลบ** (ไม่ใช้บริการรับแก้ ไม่ปลอมตัวเป็นคน) ถ้าเจอ CAPTCHA ให้หยุดขั้นนั้น บอกผู้ใช้ให้ทำเอง แล้วทำส่วนอื่นต่อ ถ้าต้องดึงข้อมูลจากเว็บนั้นบ่อย ให้หา API ทางการแทน
- เหตุผล — CAPTCHA คือเจ้าของเว็บบอกว่า "ห้ามบอท" การหลบจึงเท่ากับฝ่าข้อตกลงของเขา และทำให้ IP หรือบัญชีถูกแบน

## 7 · ในห้องทำได้เต็มที่

ติดตั้งโปรแกรม (`sudo apt-get` · `npm -g` · `pip`) · ลบไฟล์ในห้อง · รันเซิร์ฟเวอร์และฐานข้อมูลทดสอบ · ดาวน์โหลด dependency · commit ในสำเนาของโหมด isolated · ทดลองทำลายแล้วสร้างใหม่

เรื่องที่ยังอยู่ใน "รออนุมัติ" แม้อยู่ในห้อง (เตรียมไว้ ไม่ทำเอง) — เพราะผลออกไปนอกห้อง:
- ส่งข้อมูล อีเมล ข้อความ หรือเรียก API ที่มีผลจริงกับคนหรือระบบภายนอก
- ใช้บัญชีจริง ค่าลับจริง ฐานข้อมูลจริง
- push ขึ้น remote · deploy
- ในโหมด mount — ลบหรือเขียนทับไฟล์ของผู้ใช้ใน `/work` ที่ไม่ใช่ผลงานของรอบนี้ (มันคือโฟลเดอร์จริง)

---

## 8 · ห้ามแก้ compose ให้มีสิ่งเหล่านี้

| ห้าม | เพราะ |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | ห้องจะมองเห็นและแตะเครื่องจริงได้ |
| mount `/var/run/docker.sock` หรือ `//./pipe/docker_engine` | คุม Docker ได้ = คุมเครื่องได้ |
| mount โฟลเดอร์ home · `.ssh` · `.aws` · `.azure` · `.claude` ของเครื่อง · โปรไฟล์เบราว์เซอร์ · ไดรฟ์ทั้งลูก | ค่าลับหลุดได้ทันทีที่โค้ดในห้องอ่าน |
| เปิด port แบบ `"3000:3000"` (ทุกการ์ดแลน) | คนในเครือข่ายเดียวกันเข้าถึงได้ — ใช้ `127.0.0.1:` เสมอ |
| ใส่ค่าลับจริงใน `Dockerfile` หรือ image | ค่าลับติดไปกับ image ตลอด |
| ปิดหรือเพิ่ม limit `cpus` `mem_limit` `pids_limit` จนเครื่องค้าง | ห้องที่วนไม่จบจะกินเครื่องทั้งเครื่อง |
| mount ของจากเครื่องแบบเขียนได้ ทั้งที่ห้องแค่ต้องอ่าน (`ref/` · ข้อมูลตัวอย่าง · cache SDK ที่แชร์ · ซอร์สต้นทางของโหมด isolated) | โค้ดในห้องที่ถูกหลอกจะเขียนกลับเครื่องได้ — ใส่ `:ro` ทุก mount ที่ไม่ใช่ผลงานของรอบนี้ แล้วให้ห้องคัดลอกเข้าพื้นที่ของตัวเองถ้าต้องแก้ (แนวคิดจาก anthropics/claude-code devcontainer และ trailofbits/skills) |

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

`sandbox.ps1 claude` จึงรันได้เฉพาะโหมด isolated — โหมด mount สคริปต์ปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริงของผู้ใช้ (§7 ข้อสุดท้าย)

**ขีดจำกัดของ `-Locked`** — DNS ออกได้เฉพาะ resolver ที่ห้องได้รับ (ของ Docker) ไม่ใช่ DNS server ใดก็ได้ แต่ resolver นั้นยังส่งต่อคำถามออกนอก จึงยังแอบส่งข้อมูลผ่าน DNS (DNS tunnelling) ได้ งานที่ห้ามข้อมูลรั่วเด็ดขาดให้รันแบบไม่มีเครือข่ายเลย

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปจึงช้ากว่าไฟล์ใน volume ถ้า build หรือ test ช้ามาก ให้ใช้ `-Isolated` (ตรวจจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ จึงควรใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- ถ้ารัน `sandbox.ps1` ไม่ได้ ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- `parallel-attempts-pick-best` — ปกติผู้แข่งใช้ git worktree ต่อตัว · ใช้ห้อง isolated ต่อตัว (`-Name <โปรเจกต์>-a1` …) เฉพาะงานที่ต้องแยกเครื่องจริง
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `superuser` — เก็บกวาดห้องและ image เก่า


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


---

# skill: polished-document-style

Use when writing or tidying a document people keep (report, proposal, Word, PDF) — headings, tables, Thai. Designed look → branded-document-design.

# Polished Document Style

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## When to use this skill

- Output is meant for **general readers** (managers, executives, clients, customers)
- Document needs **sign-off** or formal review
- Output will be **shared widely** or converted to PDF/Word later · any doc with 3+ sections or 500+ words
- จัดหน้าเอกสารที่คนเก็บไว้อ่านทุกชนิด (Markdown · Word · PDF) รวมถึงข้อความไทยในไฟล์ Office

## When NOT to use

- Internal notes for the author's own team (keep them concise)
- Quick scratch notes · code comments
- A whole Markdown report that must come out as one .docx → `markdown-report-docx` (plugin `software-company`)

> **Note:** This skill governs the *markdown source*. When the deliverable is a
> rendered **.docx / .pptx / .pdf** that a stakeholder will open, use
> `branded-document-design` (plugin `software-company`) on top of it — that skill carries the design tokens,
> the typography scale, Thai typography rules, and the `brandkit.py` builder.

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/markdown-patterns.md](references/markdown-patterns.md) | ถ้าจะเขียนส่วนหัว สารบัญ กล่องข้อความ ตาราง ป้ายสถานะ cover block ตารางเทียบตัวเลือก ส่วนเซ็นรับ หรืออภิธานศัพท์ ให้เปิดดูตัวอย่าง markdown แล้วลอกไปใช้ |
| [scripts/check_outline.py](scripts/check_outline.py) | ถ้า skill ที่เขียนเอกสารมีไฟล์แบบใน `assets/` ให้รัน `python scripts/check_outline.py <แบบ.md> <เอกสาร.md>` ก่อนส่ง — ตรวจหัวข้อครบและเรียงตามแบบ ช่องตัวหนาครบ หัวตารางตรง และไม่มีช่องที่ยังไม่เติม · ในแบบ ใส่ `<!-- optional -->` ท้ายหัวข้อหรือช่องที่ไม่บังคับ · แก้ตัวตรวจแล้วรัน `--self-test` ก่อน |
| [references/theme-colors.md](references/theme-colors.md) | ถ้าต้องใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์ ให้เปิดดูว่าใครคุมสีส่วนไหน และค่าสีตั้งต้นประจำบ้านคืออะไร |

## Document Header (Always)

Every polished doc MUST start with ส่วนหัวชุดเดียวกัน คือ H1 ข้อความล้วน ตามด้วยกล่อง quote ที่บอกเวอร์ชัน วันที่ สถานะ ผู้เขียน ผู้รีวิว และแท็ก แล้วปิดด้วย `---` ตัวอย่างเต็มอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

Status values:
- **Draft** (ร่าง) — work in progress
- **Review** (กำลังรีวิว) — under stakeholder review
- **Approved** (อนุมัติแล้ว) — signed off
- **Archived** (เก็บถาวร) — historical reference

ชุดนี้ 4 ค่าเท่านั้น เขียนเหมือนกันทุก skill (`status-report` ใช้ชุดเดียวกัน และเพิ่ม `ยังไม่เริ่ม` สำหรับเอกสารที่ยังไม่ลงมือ) · ช่อง Status ในตาราง Sign-off เป็นสถานะของคนเซ็น ใช้ **Approved** · **Review** · **Pending** (ยังไม่ส่งให้ดู) · **Rejected**

## Section Hierarchy

- **H1** — Document title (exactly one)
- **H2** — Numbered sections (`## 1. Section`)
- **H3** — Sub-sections (`### 1.1 Sub-topic`)
- **H4** — Rare, use only if needed

**Always add Table of Contents** for docs with 5+ sections และต้องกดลิงก์ในสารบัญแล้วไปถึงหัวข้อจริง ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## ธีมของเอกสาร — ตัดสินใจครั้งเดียว ใช้ทุกที่ในเอกสารนั้น

เอกสาร 1 ฉบับผ่านหลาย skill: markdown (skill นี้) · รูปจาก `diagram-figures` ·
ไฟล์ .docx จาก `branded-document-design` · สไลด์จาก `presentation-design` (ทั้งสามอยู่ใน plugin `software-company`)
ถ้าแต่ละตัวเลือกสีเอง ผู้อ่านจะได้เอกสารที่รูปสีหนึ่ง หัวข้อสีหนึ่ง และสไลด์อีกสีหนึ่ง

**markdown เป็นต้นฉบับหลัก (source of truth) จึงประกาศธีมไว้ที่นี่** — ใส่ไว้ท้ายส่วนหัวของเอกสารหรือในไฟล์ข้างกัน:

```markdown
<!-- doc-theme: accent=<สีหลัก> · ที่มา=<แบรนด์ลูกค้า / เสนอจากเนื้องาน> · ยืนยันเมื่อ=YYYY-MM-DD -->
```

**สีหลักมาจากเนื้องาน ไม่ใช่จากค่าเริ่มต้นของเครื่องมือ**
ถ้ามีสีแบรนด์อยู่แล้วให้ใช้สีนั้น ถ้ายังไม่มีให้ใช้ค่าตั้งต้นประจำบ้าน เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนที่เข้ากับเนื้องานไว้ในรายงาน
(ตารางจับคู่เนื้องานกับโทนสีอยู่ใน `colour-by-domain` ของ skill `diagram-figures` (plugin `software-company`))

markdown เองไม่มีสี จึงใช้คำกำกับและน้ำหนักตัวอักษรแทน ส่วนไดอะแกรม รูป ไฟล์ .docx และสไลด์อ่านค่าจาก `doc-theme` ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ให้ใช้ค่าตั้งต้นประจำบ้าน ตารางทั้งสองอยู่ใน [references/theme-colors.md](references/theme-colors.md)

**คำสถานะไม่ขึ้นกับธีม** — วิกฤต · ผ่าน ใช้คำเดิมทุกเอกสาร ส่วนสีของสถานะในรูป .docx และสไลด์อยู่ใน [references/theme-colors.md](references/theme-colors.md)

## คำกำกับ — ใช้คำ ไม่ใช้อีโมจิ

**ไม่มีอีโมจิในเอกสาร** ทั้งหัวข้อ กล่องข้อความ ป้ายสถานะ และตาราง เพราะอีโมจิในหัวข้อและป้ายเป็นสัญญาณว่า AI ทำ (`no-ai-look`) · ใช้คำตัวหนาที่คงที่ทั้งเอกสารแทน

| ใช้ทำอะไร | คำที่ใช้ |
|---|---|
| ระดับความสำคัญ | วิกฤต · สูง · กลาง · ต่ำ |
| สถานะงาน | เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่ |
| ผลตรวจ | ผ่าน · ไม่ผ่าน |
| ชนิดกล่องข้อความ | ข้อแนะนำ (Tip) · ข้อควรจำ (Note) · ข้อควรระวัง (Warning) · อันตราย (Critical) · คำถามที่ยังเปิด (Open Question) |

ช่องใช่/ไม่ในตาราง ใช้เครื่องหมายตัวอักษร `✓` `✗` ได้ (ไม่ใช่อีโมจิสี) หรือเขียน "ใช่" "ไม่" 

## Callout Boxes

Use blockquotes with a bold label (no emoji) มี 5 ชนิด คือ **Tip** (ข้อแนะนำ) · **Note** (ข้อควรจำ) · **Warning** (ข้อควรระวัง) · **Critical** (อันตราย) · **Open Question** (คำถามที่ยังเปิด) ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

**Rules:**
- Keep callouts to 1-3 sentences
- One callout per topic — don't stack
- Don't overuse — max 3-5 per page

## Tables — When and How

Use tables when items have **2+ attributes** ถ้าเขียนเป็น bullet แล้วแต่ละบรรทัดมีหลายค่าคั่นด้วยจุลภาค ให้เปลี่ยนเป็นตาราง ตัวอย่างเทียบกันอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

- Left-align text, center checkmarks/numbers, right-align money
- Use `—` (em dash) for "not applicable", not `-` or blank
- Keep cells short — long content goes in body paragraphs
- Bold key columns: `**email**`

ถ้าเอกสารต้องเทียบตัวเลือกหรือชั่งข้อดีข้อเสีย (strategy, vendor choice, plan options) ให้ใช้ตารางเทียบที่มีคอลัมน์ Recommendation ส่วนเอกสารที่ต้องอนุมัติให้ปิดท้ายด้วยตาราง Sign-off และเอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป (เกณฑ์เดียวกับ `spell-out-abbreviations`) ให้มีอภิธานศัพท์ ตัวอย่างทั้งสามแบบอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## Diagrams

**รูปในเอกสารโปรเจกต์ (รายงาน · ข้อเสนอ · ผังขั้นตอน · ผังข้อมูล) วาดด้วย `diagram-figures` ซึ่งเป็น house style เดียว แล้วฝังเป็นไฟล์ภาพ** · Mermaid (`software-diagrams` ใน plugin `software-company`) ใช้แค่รูปด่วนใน README · PR · โน้ตในโค้ด
skill นี้คุมเฉพาะเรื่องการวางรูปลงในเอกสาร

- วางไว้**หลังย่อหน้าที่อธิบายว่ารูปนี้ตอบคำถามอะไร** ไม่ใช่ลอยขึ้นมาเฉย ๆ
- ทุกรูปมีคำบรรยายใต้รูป 1 บรรทัด ขึ้นต้นด้วย **รูปที่ N —**
- รูปเดียวกันอย่าใส่ซ้ำหลายที่ในเอกสาร ให้อ้างถึงเลขรูปแทน

## Status Badges and Cover Block

ช่องสำคัญในส่วนหัวหรือในตารางให้ใช้ป้ายสถานะเป็นคำตัวหนา เช่น `**Status:** Approved` ส่วนเอกสารทางการ (ข้อเสนอ · รายงานทางการ · สัญญา · postmortem) ให้เปิดด้วย cover block ที่บอกชนิดเอกสาร เวอร์ชัน สถานะ วันที่ ผู้เขียน ผู้รีวิว และเอกสารที่เกี่ยวข้อง ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## Lists and Code Blocks

**Rule:** ไม่ซ้อน bullet เลย ถ้ารายการต้องมีชั้นย่อย ให้แยกเป็นหัวข้อย่อยหรือใช้ตาราง
ตัวอย่างรายการที่ดีและรายการที่ซ้อนเกินอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

Code blocks ต้องระบุภาษาทุกครั้ง (Always specify language) และถ้าโค้ดยาว ให้ใส่ชื่อไฟล์เป็นคอมเมนต์ในบรรทัดแรก ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## เอกสาร Office ภาษาไทย

ใช้กับไฟล์ Word · Excel · PDF ทุกไฟล์ที่มีภาษาไทย จะสร้างด้วยสคริปต์หรือทำมือก็ตาม รายละเอียดและตัวช่วยอยู่ใน `branded-document-design`

- Word นับภาษาไทยเป็น complex script จึงมีช่องฟอนต์ ขนาด และตัวหนาแยกจากละติน ถ้าตั้งแค่ช่องละติน ข้อความไทยจะไม่เปลี่ยน ต้องตั้งให้ครบทั้งสองชุด
- ย่อหน้าไทยไม่จัดชิดสองขอบ (justify) เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดช่องไฟจนเป็นรู (ยกเว้นคู่มือวิทยานิพนธ์สั่ง Thai Distributed)
- ข้อความไทยห้ามใช้ฟอนต์ mono เพราะ Consolas กับ Cascadia ไม่มีอักษรไทย ใช้ mono กับรหัส คีย์ และตัวเลขเท่านั้น
- ส่งออก PDF ให้ฝังฟอนต์ทุกครั้ง ไม่งั้นเครื่องที่ไม่มีฟอนต์จะเอาตัวอื่นมาแทนและวรรณยุกต์ลอย
- CSV ที่ให้คนไทยเปิดใน Excel บันทึกเป็น UTF-8 แบบมี BOM ไม่งั้นภาษาไทยเพี้ยน
- ก่อนบอกว่าเสร็จ แปลงทุกหน้าเป็นภาพแล้วเปิดดูจริง ตารางล้น หัวข้อค้างท้ายหน้า วรรณยุกต์ลอย ดูจากโค้ดไม่เห็น

## Quality Checklist

Before delivering any polished doc:

- [ ] H1 title in plain text — no emoji in any heading, callout, badge or table
- [ ] Header block with version, date, status, authors (cover block เฉพาะเอกสารทางการ)
- [ ] TOC if 5+ sections
- [ ] All sections numbered consistently
- [ ] Anchor links in TOC actually work
- [ ] Status badges where applicable
- [ ] Tables used (not bullets) where data has 2+ attributes
- [ ] Every flow or relationship has a diagram drawn with `diagram-figures` (plugin `software-company` · house style), not default Mermaid
- [ ] Callout boxes for tips/warnings (not just paragraphs)
- [ ] Code blocks have language hints
- [ ] Glossary for docs with 5+ abbreviations (ตัวย่อตั้งแต่ 5 ตัว)
- [ ] No placeholder text (TBD, TODO, Lorem ipsum) — `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders; keep them
- [ ] Tested rendering in the real viewer (Word · PDF · GitHub preview)

> ไดอะแกรมในเอกสารโปรเจกต์อยู่ใน `diagram-figures` · เอกสารโค้ด (Mermaid ด่วน · ข้อกำหนดซอฟต์แวร์) → ส่วนเพิ่มใน plugin `software-company`

## Anti-patterns

- **Emoji anywhere** — in headings, callouts, badges or tables it reads as AI-made; use bold words
- **Nested bullets** — any bullet under a bullet; use a sub-heading or a table instead
- **Inconsistent terminology** — "user" in one section, "customer" in next
- **Tables of paragraphs** — if cells are >2 sentences, use headings instead

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: markdown-patterns.md

# รูปแบบ markdown พร้อมตัวอย่าง

ตัวอย่างโค้ด markdown ของทุกรูปแบบที่ `SKILL.md` อ้างถึง ให้ลอกไปใช้ได้ทันที ส่วนกฎว่าใช้เมื่อไหร่อยู่ใน `SKILL.md`

**สารบัญ:** Document Header · Table of Contents · Callout Boxes · Tables · Figures · Status Badges · Cover Block · Comparison / Decision Tables · Lists · Code Blocks · Approval/Sign-off · Glossary

## Document Header (Always)

Every polished doc MUST start with:

```markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft
> **Authors:** <names> · **Reviewers:** <names>
> **Tags:** `<area>` `<topic>`

---
```

Status values:
- **Draft** — work in progress
- **Review** — under stakeholder review
- **Approved** — signed off
- **Archived** — historical reference

## Table of Contents

**Always add Table of Contents** for docs with 5+ sections:

```markdown
## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope](#2-scope)
3. [Details](#3-details)
```

## Callout Boxes

Use blockquotes with a bold label — no emoji. 5 ชนิด ชื่อไทยคู่กัน: Tip (ข้อแนะนำ) · Note (ข้อควรจำ) · Warning (ข้อควรระวัง) · Critical (อันตราย) · Open Question (คำถามที่ยังเปิด):

```markdown
> **Tip:** Brief actionable insight.

> **Warning:** Important caveat or limitation.

> **Critical:** Must-read before proceeding.

> **Note:** Additional context or background.

> **Open Question:** Needs decision/clarification.
```

## Tables — When and How

### When to use tables instead of bullets

Use tables when items have **2+ attributes**:

Don't use bullets:
```markdown
- email: string, required, unique
- age: number, optional
- role: enum, required, default "user"
```

Use a table:
```markdown
| Field | Type   | Required | Default | Description       |
|-------|--------|:--------:|:-------:|-------------------|
| email | string | ✓        | —       | Unique login email|
| age   | number | ✗        | —       | Optional          |
| role  | enum   | ✓        | `user`  | Access level      |
```

## Figures (รูปในเอกสาร)

รูปในเอกสารโปรเจกต์วาดด้วย `diagram-figures` (plugin `software-company` · house style) แล้วฝังเป็นไฟล์ภาพ · Mermaid ใช้แค่รูปด่วนใน README · PR ไม่ใช้ในเอกสารที่ส่งต่อ

```markdown
ลำดับการเรียกเมื่อผู้ใช้กดบันทึกแสดงในรูปที่ 3

![ลำดับการเรียกเมื่อผู้ใช้กดบันทึก](figures/fig-03.png)

**รูปที่ 3 —** ลำดับการเรียกเมื่อผู้ใช้กดบันทึก
```

## Status Badges (Inline)

For key fields in headers/tables:

```markdown
**Status:** Approved
**Priority:** High
**Risk Level:** Medium
**Service Level Agreement (SLA):** < 200ms
```

Multiple badges in a header:

```markdown
> **Approved** · **High Priority** · Owner @alice · Due 2025-03-15
```

## Cover Block Pattern

For formal documents (Business Requirements Document (BRD), Functional Specification Document (FSD), Architecture Decision Record (ADR), postmortem):

```markdown
# <Title>

| | |
|--|--|
| **Document Type** | BRD \| FSD \| ADR \| Postmortem |
| **Version** | 1.2 |
| **Status** | Approved |
| **Date** | 2025-01-15 |
| **Author(s)** | @alice, @bob |
| **Reviewer(s)** | @charlie |
| **Related** | [BRD-001](link), [FSD-005](link) |

---
```

## Comparison / Decision Tables

For trade-off analysis (architect, Project Manager (PM), Search Engine Optimization (SEO) recommendations):

```markdown
| Option | Cost | Effort | Risk | Time-to-Value | Recommendation |
|--------|:----:|:------:|:----:|:-------------:|:--------------:|
| **A**  | ฿80k | Med  | Low  | Fast | **Recommended** |
| B      | ฿40k | Low  | High | Med  | Not recommended |
| C      | ฿150k| High | Low  | Slow | Future consideration |
```

## Lists — When to nest, when to flatten

### Good list
```markdown
- Email is unique across all users
- Passwords must be 8+ characters with mixed case
- Sessions expire after 30 days of inactivity
```

### Bad list (over-nested)
```markdown
- Users
  - Email
    - Must be unique
    - Required
  - Password
    - 8+ chars
    - Mixed case
```

→ Should be a table instead.

## Code Blocks

Always specify language:

````markdown
```typescript
const user: User = { id: 1, email: 'a@b.com' };
```

```bash
npm install
```

```sql
SELECT * FROM users WHERE id = $1;
```
````

For long blocks, put the file name in a comment on the first line:

```typescript
// src/services/auth.ts
export async function login(email: string, password: string) {
  // ...
}
```

## Approval/Sign-off Section (End of Doc)

For documents needing formal approval:

```markdown
## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Approved | 2025-01-15 |
| Tech Lead | @bob | Review | — |
| QA Lead | @charlie | Pending | — |
| Security | @dave | Rejected | 2025-01-14 |
```

## Glossary Section

For docs with 5+ technical terms:

```markdown
## Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token, used for stateless auth |
| **SLA** | Service Level Agreement |
```

Define acronyms on first use, then add to glossary.


## reference: theme-colors.md

# ตารางสีของธีมเอกสาร

ไฟล์นี้บอกว่าส่วนไหนของเอกสารใครเป็นคนคุมสี และค่าสีตั้งต้นประจำบ้านคืออะไร ใช้ตอนต้องใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์

## ใครคุมสีส่วนไหน

| ส่วนของเอกสาร | ใครคุมสี | อ่านค่าจาก |
|---|---|---|
| หัวข้อ ตาราง กล่องข้อความใน markdown | markdown ไม่มีสี ใช้คำกำกับตัวหนาและน้ำหนักตัวอักษรแทน | — |
| ไดอะแกรม Mermaid | `diagram-figures` → `references/engine-mermaid.md` (README · PR: `software-diagrams` ข้อ 2 ใน plugin `software-company`) | `doc-theme` |
| รูปที่เป็นไฟล์ภาพ | `diagram-figures` (plugin `software-company`) | `doc-theme` |
| ไฟล์ .docx / .pdf ที่ส่งออก | `branded-document-design` (plugin `software-company`) ข้อ 0–1 | `doc-theme` |
| สไลด์ | `presentation-design` (plugin `software-company`) | `doc-theme` |

## ค่าตั้งต้นประจำบ้าน (house default)

ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ทุก skill ใช้ชุดนี้เป็นค่าตั้งต้น เพื่อให้รูป เอกสาร และสไลด์เป็นชุดสีเดียวกันตั้งแต่แรก ชุดนี้คือชุดเดียวกับ `presentation-design` และ `branded-document-design`:

| token | ค่า | ใช้กับ |
|---|---|---|
| brand | `#2A78D6` | สีหลัก · หัวข้อ · เส้น accent |
| brand-deep | `#2A4C86` | หัวตาราง · H2 · ชื่อระบบ |
| brand-2 | `#6A5CD6` | accent รอง (ม่วง) |
| tint | `#EDF1FB` | พื้นหัวตาราง · พื้นกล่องเน้น |
| ink / body | `#333B4A` / `#414957` | หัวข้อ / เนื้อความ |
| muted / faint | `#7D8492` / `#A9AEB9` | คำบรรยาย / หมายเหตุ |
| line | `#E4E7EE` | เส้นขอบ · เส้นเชื่อม |
| exception | `#C77A11` | ทาง/โซนที่ไม่ใช่เส้นทางหลัก (ต่างจาก brand เสมอ) |
| ฟอนต์ | Tahoma (เอกสาร/สไลด์) · Noto Sans Thai → Tahoma (ภาพ) | ทั้งไทยและอังกฤษ |

เมื่อประกาศ accent เฉพาะงานแล้ว ให้ใช้ค่านั้นแทน brand ส่วนสีอื่นคำนวณจาก accent ตัวนั้น
