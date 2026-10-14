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
| แบบฟอร์มยินยอม ประกาศความเป็นส่วนตัว และเอกสาร PDPA ของบริษัท (ไม่ใช่ระบบซอฟต์แวร์) | (ถ้าติดตั้ง plugin `thai-workplace`) `thai-workplace:pdpa-workflow` ไม่มีก็ใช้ข้อ 3 ของ skill นี้เป็นโครง |

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
| **ขอลบ** | ลบจริงจากทุกที่ที่มี รวม log และไฟล์สำรอง |
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

**ข้อมูลอ่อนไหวเป็นชั้นที่เข้มกว่า** — เชื้อชาติ ศาสนา ความคิดเห็นทางการเมือง พฤติกรรมทางเพศ
ประวัติอาชญากรรม **ข้อมูลสุขภาพ** ข้อมูลชีวภาพ จึงเก็บได้เมื่อจำเป็นจริงและต้องมีมาตรการเข้มกว่าปกติ

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

## 10 · ตัวย่อ

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
| ความยินยอมสำหรับการตลาด | `notifications` |
| ปิดบังข้อมูลในไฟล์ส่งออก | `data-import-export` |
| อายุการเก็บไฟล์แนบ | `file-upload-and-storage` |
| งานลบข้อมูลที่หมดอายุ | `background-jobs` |
| บันทึกเหตุการณ์หลังข้อมูลรั่ว | `postmortem-template` · `incident-runbook-template` |


---

# skill: docker-sandbox

Use when a project should run in its own Docker container, not on the host, or the user says sandbox.

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
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกัน แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — เพราะของที่ติดตั้งจะชนกัน โปรเจกต์หนึ่งพังแล้วลามไปอีกโปรเจกต์ และล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางพร้อมกัน (ห้องละทาง) |

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
| ให้ Claude Code ทำงานในห้องเต็มที่ | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้) |
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

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปจึงช้ากว่าไฟล์ใน volume ถ้า build หรือ test ช้ามาก ให้ใช้ `-Isolated` (ตรวจจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ จึงควรใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- ถ้ารัน `sandbox.ps1` ไม่ได้ ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) — ผู้แข่งแต่ละตัวได้ห้อง isolated ของตัวเอง (`-Name <โปรเจกต์>-a1` …)
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `superuser` — เก็บกวาดห้องและ image เก่า


---

# skill: markdown-visuals

Use when a markdown doc needs a picture (UI state, flow, architecture) that renders everywhere. Mermaid content → software-diagrams.

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — wireframe sketch or UI state in a spec, FSD, ADR or README
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (software-diagrams)
├─ Architecture / ER / class                →  Mermaid (software-diagrams)
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Follow the tree above**; when two branches fit, pick inline SVG over an image file. Inline SVG renders everywhere and versions cleanly in git. It adds no binary files to the repo, and the user can read and edit the markup.

## 1 · Inline SVG (primary technique)

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
- `xmlns="http://www.w3.org/2000/svg"` — without this, GitHub may not render
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

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
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
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax so GitHub renders it
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

Not sure a visual will render? Tell the user to preview it in GitHub or Notion.

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[diagram-figures]] — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

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

Pattern from `DockXI/docs/12-design-mockup.md`:

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

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states.
