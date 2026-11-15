# skill: file-upload-and-storage

Use when users upload files or an app serves stored files

# รับไฟล์อัปโหลดและการเก็บไฟล์

> **กฎข้อเดียว:** ไฟล์ที่ผู้ใช้ส่งมาคือข้อมูลที่เชื่อไม่ได้
> ชื่อไฟล์ นามสกุล ชนิดที่เบราว์เซอร์แจ้งมา และขนาดที่บอกไว้ — **ปลอมได้ทั้งหมด**

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้แนบไฟล์ รูป หรือเอกสาร
- ระบบต้องเก็บไฟล์แล้วส่งกลับให้ดูหรือดาวน์โหลด
- ต้องตัดสินใจว่าเก็บไฟล์ไว้ที่ไหน
- มีไฟล์ที่ไม่ควรให้คนอื่นเห็น แต่ตอนนี้ใครมีลิงก์ก็เปิดได้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| นำเข้า Excel/CSV แล้วเอาข้อมูลเข้าระบบ | `data-import-export` | แทน |
| สิทธิ์ว่าใครเข้าถึงอะไรได้ | `auth-implementation-patterns` | แทน |
| ประมวลผลไฟล์ใหญ่เป็นงานเบื้องหลัง | `background-jobs` | แทน |
| ตาราง metadata ของไฟล์ | `database-design` | คู่ |
| endpoint และ error ของการอัปโหลด | `api-conventions` · `web-service-essentials` | คู่ |
| อายุการเก็บไฟล์ที่มีข้อมูลบุคคล | `pdpa-compliance` | คู่ |
| ขนาดพื้นที่ที่ใช้และการแจ้งเตือน | `observability-basics` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · ตรวจก่อนรับ

| ตรวจอะไร | ทำยังไง |
|---|---|
| **ชนิดไฟล์** | อ่าน**เนื้อในไฟล์** (magic bytes) ไม่ใช่เชื่อนามสกุลหรือ `Content-Type` |
| **ขนาด** | บังคับที่เซิร์ฟเวอร์ **และ**ที่ตัวรับคำขอด้านหน้า — ตรวจฝั่งเบราว์เซอร์เป็นแค่ความสะดวก |
| จำนวนไฟล์ต่อครั้ง | ตั้งเพดาน |
| ขนาดรวมต่อผู้ใช้ | ตั้งโควตา ไม่งั้นคนเดียวกินพื้นที่หมด |
| ชนิดที่อนุญาต | **รายการที่อนุญาต ไม่ใช่รายการที่ห้าม** |

```
รายการที่อนุญาตทั่วไป: jpg · png · webp · pdf · xlsx · docx · csv
ห้ามเสมอ: ไฟล์รันได้ (exe, sh, bat) · ไฟล์สคริปต์ของเซิร์ฟเวอร์ (php, aspx, jsp) · svg ที่ไม่ได้ทำความสะอาด
```

> **SVG คือ HTML** — มันรันสคริปต์ได้ ถ้าจะรับต้องทำความสะอาดก่อน หรือแปลงเป็น PNG
>
> **ตรวจขนาดก่อนอ่านไฟล์เข้าหน่วยความจำ** — ไม่งั้นไฟล์ 5 GB ทำให้เซิร์ฟเวอร์ตาย
> ก่อนที่โค้ดตรวจขนาดจะได้ทำงาน

**สแกนไวรัส** สำหรับไฟล์ที่คนอื่นจะดาวน์โหลดต่อ — ระหว่างรอผลสแกนให้สถานะเป็น `pending`
และยังไม่ให้ใครเข้าถึง

---

## 2 · เก็บที่ไหน

| ที่เก็บ | เหมาะกับ | หมายเหตุ |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | ค่าเริ่มต้นที่ควรใช้ | ขยายได้ · มีลิงก์หมดอายุในตัว |
| ดิสก์ของเซิร์ฟเวอร์ | ระบบเล็ก เครื่องเดียว | **ต้องอยู่นอกโฟลเดอร์ที่เว็บเสิร์ฟ** และต้องสำรองข้อมูล |
| ในฐานข้อมูล | ไฟล์เล็กมากและต้องอยู่ใน transaction เดียวกัน | โตเร็ว · สำรองข้อมูลช้าลงมาก |

> ผิด: **เก็บไฟล์ในโฟลเดอร์ของแอป** — deploy ทีไรหาย และถ้ามีหลาย instance ก็ไม่เห็นกัน
> ผิด: **เก็บไฟล์ในโฟลเดอร์ที่เว็บเสิร์ฟตรง ๆ** — อัปโหลดไฟล์สคริปต์แล้วเรียกรันได้

**ฐานข้อมูลเก็บแค่ metadata ส่วนตัวไฟล์เก็บที่อื่น** — ตาราง metadata ต้องมีคอลัมน์
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · ตั้งชื่อไฟล์ที่เก็บ

**ห้ามใช้ชื่อไฟล์ที่ผู้ใช้ส่งมาเป็นชื่อจริงที่เก็บ**

```
ผิด: uploads/รายงาน (1).xlsx              เว้นวรรค · ภาษาไทย · วงเล็บ
ผิด: uploads/../../etc/passwd             หลุดออกนอกโฟลเดอร์
ถูก: 2026/09/25/01J9Z8K7X2M4.xlsx         สุ่ม · แยกโฟลเดอร์ตามวันที่
```

- ชื่อจริงที่เก็บเป็นค่าสุ่ม (UUIDv7 หรือ ULID) + นามสกุลที่**ตรวจแล้ว**
- ชื่อเดิมของผู้ใช้เก็บไว้ในฐานข้อมูล แล้วส่งกลับตอนดาวน์โหลดผ่าน header
- แยกโฟลเดอร์ตามวันที่ — โฟลเดอร์เดียวที่มีไฟล์เป็นล้านจะช้าและเปิดดูไม่ไหว
- เก็บ checksum ไว้ด้วย — ตรวจไฟล์ซ้ำและตรวจว่าไฟล์ไม่เสีย

---

## 4 · ส่งไฟล์กลับให้ผู้ใช้

| ไฟล์ | วิธีส่ง |
|---|---|
| สาธารณะ (โลโก้ รูปสินค้า) | URL ตรงผ่าน CDN ได้ |
| **ส่วนตัว** (เอกสาร ใบเสร็จ รูปผู้ใช้) | **ลิงก์ที่มีลายเซ็นและหมดอายุ** 5–15 นาที |

> **"ลิงก์เดายาก" ไม่ใช่การควบคุมสิทธิ์** — ลิงก์ถูกส่งต่อ ถูกบันทึกใน log ของ proxy
> และติดอยู่ใน `Referer` เสมอ ไฟล์ส่วนตัวต้อง**ตรวจสิทธิ์ทุกครั้ง**แล้วค่อยออกลิงก์ชั่วคราวให้

- ไฟล์ใหญ่ให้ผู้ใช้อัปโหลดตรงไปที่ object storage ด้วยลิงก์ที่เราเซ็นให้ ตัวไฟล์ไม่ต้องผ่านแอป
  **แต่การตรวจใน §1 ยังต้องครบ** — ทางนี้ข้ามแอปไป เลยต้องคืนการตรวจกลับมาแบบนี้:
  - **ตอนเซ็นลิงก์:** จำกัดขนาดและชนิดไว้ในลายเซ็น — S3 ใช้ presigned POST ที่ policy มี `content-length-range` และเงื่อนไข `Content-Type` (presigned PUT บังคับขนาดไม่ได้) · ผู้ให้บริการอื่นใช้ตัวเทียบเท่า เช่น GCS ใช้ header `x-goog-content-length-range`
  - **ตอนเซ็นลิงก์:** กำหนด key เอง (ชื่อสุ่มตาม §3) ลงที่โฟลเดอร์พักไฟล์ · ลิงก์หมดอายุสั้น · บันทึกแถว metadata ด้วย `scan_status = pending`
  - **หลังอัปโหลดเสร็จ** (event จาก storage หรือผู้ใช้แจ้งว่าเสร็จ): อ่าน magic bytes จริงจาก object · เทียบขนาดจริงกับเพดาน · สแกนไวรัส → ผ่านแล้วย้ายไปที่เก็บจริง และเปลี่ยนเป็น `clean` · ไม่ผ่านให้ลบหรือกักไว้
  - ระหว่าง `pending` ห้ามออกลิงก์ดาวน์โหลดให้ใคร
- ตอนส่งไฟล์ให้ดาวน์โหลด ต้องตั้ง `Content-Disposition` และ `Content-Type` ให้ถูก
  และห้ามส่ง HTML ที่ผู้ใช้อัปโหลดกลับมาแบบให้เบราว์เซอร์เรนเดอร์
- ถ้าทำได้ ให้เสิร์ฟไฟล์ของผู้ใช้จากคนละโดเมนกับแอป เพื่อกันสคริปต์ในไฟล์เข้าถึง cookie ของแอป

---

## 5 · รูปภาพ

- **ห้ามส่งรูปต้นฉบับจากกล้องลงหน้าจอ** — รูป 8 MB บนมือถือคือหน้าเว็บที่โหลดไม่ขึ้น
- สร้างขนาดย่อไว้ล่วงหน้า 2–3 ขนาด (thumbnail · ขนาดกลาง · ขนาดเต็มที่ย่อแล้ว)
- **ลบ EXIF ออก** — ในรูปมีพิกัดที่ถ่าย ผู้ใช้ไม่รู้ว่ากำลังเผยแพร่ออกไป
- แปลงเป็น WebP ถ้าเบราว์เซอร์รองรับ
- หมุนรูปตาม EXIF ก่อนลบ EXIF ทิ้ง ไม่งั้นรูปจากมือถือจะตะแคง
- ถ้าไฟล์ใหญ่หรือมีหลายไฟล์ ให้ย่อรูปเป็นงานเบื้องหลัง (ดู `background-jobs`)

---

## 6 · ลบและอายุการเก็บ

| เรื่อง | กฎ |
|---|---|
| ลบข้อมูลต้นเรื่อง | ต้องมีงานคอยตามลบไฟล์กำพร้าที่เหลืออยู่ด้วย |
| ลำดับการลบ | ลบ metadata ก่อน แล้วค่อยลบไฟล์ — ไฟล์กำพร้าไม่อันตราย แต่ metadata ที่ชี้ไปหาไฟล์ที่หายไปแล้วทำให้หน้าจอพัง |
| ไฟล์ที่อัปโหลดแล้วไม่ถูกผูกกับอะไร | ลบทิ้งหลัง 24 ชั่วโมง |
| อายุการเก็บ | กำหนดต่อประเภทไฟล์ · ไฟล์ที่มีข้อมูลบุคคลต้องมีวันหมดอายุ (ดู `pdpa-compliance`) |
| สำรองข้อมูล | ไฟล์ต้องอยู่ในแผนสำรองเหมือนฐานข้อมูล **และต้องเคยทดสอบกู้คืนจริง** |

---

## 7 · Anti-patterns

- **เชื่อนามสกุลไฟล์** — เปลี่ยนชื่อไฟล์เป็น `.jpg` ใครก็ทำได้
- **ตรวจขนาดแค่ฝั่งเบราว์เซอร์** — ข้ามได้ใน 3 วินาที
- **ใช้ชื่อไฟล์ของผู้ใช้เป็นเส้นทางจริง** — `../` พาไปไหนก็ได้
- **เก็บไฟล์ในโฟลเดอร์ที่เว็บเสิร์ฟ** — อัปโหลดสคริปต์แล้วเรียกรันได้
- **"ลิงก์เดายาก" แทนการตรวจสิทธิ์**
- **รับ SVG โดยไม่ทำความสะอาด** — สคริปต์ทำงานในเบราว์เซอร์คนอื่น
- **ส่งรูปต้นฉบับ 8 MB ลงมือถือ**
- **ไม่ลบ EXIF** — พิกัดบ้านผู้ใช้หลุดออกไปโดยไม่มีใครตั้งใจ
- **ไฟล์ไม่อยู่ในแผนสำรองข้อมูล** — ฐานข้อมูลกู้ได้ แต่เอกสารหายหมด
- **อ่านไฟล์ทั้งก้อนเข้าหน่วยความจำ** — ไฟล์ใหญ่ทำให้ process ตาย


---

# skill: notifications

Use when a system sends email, SMS, LINE or push

# การแจ้งเตือนผู้ใช้

> **กฎข้อเดียว:** ผู้ใช้จะเลิกอ่านทั้งหมด ถ้าได้รับสิ่งที่ไม่ต้องอ่านมากพอ
> ทุกข้อความที่ส่งเกินความจำเป็น ทำให้ข้อความที่จำเป็นถูกมองข้ามไปด้วย
> ข้อความภาษาไทยในแม่แบบ → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ หน้าจอ

## เมื่อไหร่ใช้ skill นี้

- ระบบต้องส่งอีเมล SMS LINE push หรือแจ้งเตือนในแอป
- ผู้ใช้บ่นว่าได้รับซ้ำ ได้รับเยอะเกิน หรือไม่ได้รับเลย
- ต้องทำหน้าตั้งค่าว่าจะรับแจ้งเตือนอะไรบ้าง
- อีเมลสำคัญเข้า spam

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| การแจ้งเตือนทีมเมื่อระบบมีปัญหา | `observability-basics` |
| กลไกคิวและการลองใหม่ | `background-jobs` |
| ข้อความหลายภาษา | `i18n-and-locale` |
| ความยินยอมทางการตลาด | `pdpa-compliance` |

---

## 1 · เลือกช่องทางตามความเร่งด่วน ไม่ใช่ตามความเคยชิน

| ช่องทาง | เหมาะกับ | ข้อจำกัด |
|---|---|---|
| **ในแอป** | ทุกอย่าง — เป็นบันทึกถาวรที่ย้อนดูได้ | เห็นเมื่อเข้าแอป |
| **อีเมล** | ใบเสร็จ สรุป เอกสารแนบ สิ่งที่ต้องเก็บไว้ | ช้า · เข้า spam ได้ |
| **push** | เรื่องที่ต้องรู้ตอนนี้ | ปิดได้ · หายถ้าไม่กด |
| **LINE** | ไทย · ลูกค้าทั่วไป · อัตราเปิดสูง | มีค่าใช้จ่ายต่อข้อความ · มีกฎของผู้ให้บริการ |
| **SMS** | รหัสยืนยัน · เรื่องด่วนที่ต้องถึงแน่ | แพงสุด · 70 ตัวอักษรถ้าเป็นภาษาไทย |

> **SMS ภาษาไทยได้แค่ 70 ตัวอักษรต่อข้อความ** (ไม่ใช่ 160 เหมือนอังกฤษ)
> ถ้าเกินจะถูกตัดเป็นหลายข้อความและคิดเงินเพิ่มทุกท่อน จึงต้องนับความยาวก่อนส่งเสมอ

**เรื่องเดียวส่งช่องทางเดียว** — เว้นแต่เป็นเรื่องที่พลาดไม่ได้จริง ๆ
ให้ผู้ใช้เลือกเองว่าอยากรับทางไหน (ข้อ 5)

---

## 2 · แม่แบบข้อความอยู่นอกโค้ด

```
templates/
  order-confirmed/
    th.subject.txt  th.html  th.txt
    en.subject.txt  en.html  en.txt
```

| กฎ | เหตุผล |
|---|---|
| **ห้ามต่อข้อความในโค้ด** | เพราะแก้คำแต่ละครั้งต้อง deploy ใหม่ |
| ตัวแปรใช้ชื่อ | ตั้งเป็นชื่ออย่าง `{{customerName}}` ไม่ใช่ลำดับ |
| อีเมลต้องมีทั้ง HTML และข้อความล้วน | ตัวกรอง spam ลดคะแนนอีเมลที่มีแต่ HTML |
| แยกไฟล์ต่อภาษา | ดู `i18n-and-locale` |
| **ทดสอบด้วยค่าจริงก่อนส่ง** | `สวัสดีคุณ {{name}}` ที่หลุดออกไปคือความเสียหายต่อแบรนด์ |

**ทุกข้อความต้องมี 3 อย่าง** — เกิดอะไรขึ้น · เกี่ยวกับรายการไหน (มีเลขอ้างอิง) · ต้องทำอะไรต่อ (ปุ่มเดียว)

---

## 3 · ส่งเป็นงานเบื้องหลังเสมอ

> **ส่งอีเมลไม่สำเร็จ ต้องไม่ทำให้การสั่งซื้อล้ม**
> แยกกันด้วยคิว — ธุรกรรมบันทึกเสร็จ แล้วค่อยเข้าคิวส่ง (ดู `background-jobs`)

| เรื่อง | กฎ |
|---|---|
| เข้าคิวหลังธุรกรรมสำเร็จ | ไม่ใช่ระหว่างธุรกรรม เพราะถ้า rollback ทีหลัง อีเมลก็ออกไปแล้ว |
| retry | 3 ครั้ง เว้นระยะเพิ่มเป็นเท่าตัวทุกรอบ แล้วย้ายเข้า dead letter (คิวเก็บงานที่ส่งไม่สำเร็จ) |
| **กันส่งซ้ำ** | ใช้ unique key `(ประเภท, entity_id, event_id, ผู้รับ)` — `event_id` คือรหัสเหตุการณ์หรือเวอร์ชันของการเปลี่ยน (เช่น สถานะคำสั่งซื้อครั้งที่ 2 ของออเดอร์เดียวกันต้องส่งได้) ไม่ใช่หวังว่าจะไม่มีใครเรียกซ้ำ |
| ข้อความเร่งด่วน (รหัส OTP) | ใช้คิวแยก จะได้ไม่ต้องไปต่อแถวหลังอีเมลสรุปรายเดือน 5,000 ฉบับ |

**กันการส่งถล่ม** — ตั้งเพดานต่อผู้ใช้ต่อชั่วโมง และรวบเรื่องเดียวกันที่เกิดถี่ ๆ
เป็นข้อความเดียว ("มี 12 รายการใหม่" ไม่ใช่ 12 ข้อความ)

---

## 4 · ห้ามใส่อะไรในข้อความ

| ห้าม | ใส่แทน |
|---|---|
| รหัสผ่าน | ลิงก์ตั้งรหัสใหม่ที่หมดอายุ |
| เลขบัตรเต็ม · เลขบัตรประชาชน | 4 ตัวท้าย |
| ข้อมูลสุขภาพ ผลตรวจ | "มีผลตรวจใหม่ กรุณาเข้าระบบเพื่อดู" |
| ไฟล์แนบที่มีข้อมูลอ่อนไหว | ลิงก์ที่ต้องเข้าสู่ระบบก่อน |
| ลิงก์ที่เข้าถึงได้โดยไม่ต้องยืนยันตัวตน | ลิงก์ที่มีอายุสั้นและตรวจสิทธิ์ |

> **ถือว่าอีเมลคือไปรษณียบัตร** — ผ่านหลายระบบ ค้างอยู่ในกล่องจดหมายบนเครื่องที่อาจไม่ใช่ของเขา
> และถูกค้นเจอได้ตลอดไป

**ลิงก์ในอีเมลต้องเป็นโดเมนของเรา** — ลิงก์ย่อทำให้ผู้ใช้แยกไม่ออกจากอีเมลหลอกลวง

---

## 5 · ให้ผู้ใช้เลือกได้

| ประเภท | ปิดได้ไหม |
|---|---|
| ธุรกรรม (ใบเสร็จ · รหัสยืนยัน · แจ้งความปลอดภัย) | ✗ ปิดไม่ได้ |
| การดำเนินการ (สถานะคำสั่งซื้อ · มีคนตอบกลับ) | ✓ เลือกช่องทางได้ |
| สรุปประจำงวด | ✓ เลือกความถี่ได้ |
| การตลาด | ✓ **ต้องขอความยินยอมก่อนส่ง** (ดู `pdpa-compliance`) |

- ตารางตั้งค่า: `user_id` · `notification_type` · `channel` · `enabled`
- **ทุกข้อความที่ไม่ใช่ธุรกรรมต้องมีลิงก์ยกเลิกรับ** และต้องมีผลภายใน 24 ชั่วโมง (เป้าภายในของเรา เข้มกว่าที่ Gmail และ Yahoo กำหนดไว้ที่ 2 วัน)
- **อีเมลการตลาดที่ส่งปริมาณมาก** ต้องใส่ header ยกเลิกรับแบบคลิกเดียวด้วย: `List-Unsubscribe: <https://...>` (URL แบบ HTTPS) คู่กับ `List-Unsubscribe-Post: List-Unsubscribe=One-Click` ตามมาตรฐาน RFC 8058 และอีเมลต้องผ่าน SPF + DKIM (Gmail ใช้กับผู้ส่งเกินราว 5,000 ฉบับต่อวัน · ใช้กับอีเมลการตลาด ไม่ใช่ธุรกรรม · ถ้าไม่ใส่ อีเมลมีโอกาสเข้า spam มากขึ้น) — แหล่ง: support.google.com/a/answer/14229414 · senders.yahooinc.com/best-practices ตรวจ 22 ต.ค. 2569
- ยกเลิกรับได้โดยไม่ต้องเข้าสู่ระบบ — ใช้ token ในลิงก์
- เคารพ "เวลาเงียบ" — ไม่ส่ง push หรือ SMS ที่ไม่ด่วนตอนตี 2 (ตามเขตเวลาผู้รับ)

---

## 6 · ติดตามผลการส่ง

| สถานะ | หมายถึง |
|---|---|
| `queued` · `sent` | เข้าคิว · ส่งออกจากระบบเราแล้ว |
| `delivered` | ปลายทางรับแล้ว |
| `bounced` | ส่งไม่ถึง — **แยก hard (ที่อยู่ไม่มีจริง) กับ soft (กล่องเต็ม)** |
| `failed` | ส่งไม่ออก |

- **hard bounce ต้องหยุดส่งที่อยู่นั้นทันที** — ส่งต่อไปเรื่อย ๆ ทำให้โดเมนเราถูกขึ้นบัญชีดำ
- เก็บ log การส่งไว้ตอบคำถาม "ทำไมลูกค้าไม่ได้รับ" — ใคร ช่องทางไหน เมื่อไหร่ ผลอะไร
- อีเมลที่ต้องถึงแน่ ๆ ต้องตั้ง **SPF · DKIM · DMARC** ให้ครบ ไม่อย่างนั้นอีเมลจะเข้า spam โดยไม่มีสัญญาณเตือนอะไรเลย
- วัด: อัตราส่งสำเร็จ · อัตรา bounce · คิวค้าง (ดู `observability-basics`)

---

## 7 · Anti-patterns

- **ส่งข้อความในคำขอเดียวกับธุรกรรม** — ผู้ให้บริการอีเมลช้า แล้วหน้าจอค้าง
- **ส่งก่อน commit** — rollback แล้วแต่ลูกค้าได้อีเมลไปแล้ว
- **ข้อความอยู่ในโค้ด** — แก้คำแต่ละครั้งต้อง deploy ใหม่
- **ไม่กันซ้ำ** — ลูกค้าได้ใบเสร็จ 5 ฉบับ
- **ส่งทุกช่องทางพร้อมกัน** — ผู้ใช้ปิดทุกอย่างภายในสัปดาห์เดียว
- **ไม่มีลิงก์ยกเลิกรับ** — ผู้ใช้กด "นี่คือ spam" แทน แล้วโดเมนเราเสียชื่อ
- **ใส่ข้อมูลอ่อนไหวในตัวข้อความ**
- **ส่งต่อไปยัง hard bounce** — โดเมนถูกขึ้นบัญชีดำ
- **ไม่นับความยาว SMS ภาษาไทย** — ค่าใช้จ่ายบานโดยไม่รู้ตัว
- **ไม่มี log การส่ง** — ตอบลูกค้าไม่ได้ว่าส่งไปหรือยัง

---

## 8 · ตัวย่อ

- **OTP** — One-Time Password (รหัสผ่านใช้ครั้งเดียว)
- **RFC** — Request for Comments (เอกสารมาตรฐานอินเทอร์เน็ต) · RFC 8058 = มาตรฐาน header ยกเลิกรับคลิกเดียว
- **push notification** — การแจ้งเตือนที่เด้งขึ้นบนเครื่องผู้ใช้
- **bounce** — อีเมลที่ส่งไม่ถึงและถูกตีกลับ
- **SPF · DKIM · DMARC** — มาตรฐานพิสูจน์ว่าอีเมลถูกส่งจากโดเมนนั้นจริง
- **opt-in / opt-out** — การขอรับ / การยกเลิกรับ
- **LINE Official Account** — บัญชีทางการของธุรกิจบน LINE ใช้ส่งข้อความหาลูกค้า

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| คิว retry และ dead letter | `background-jobs` |
| ข้อความหลายภาษา | `i18n-and-locale` |
| ความยินยอมทางการตลาด | `pdpa-compliance` |
| ตารางตั้งค่าและ log การส่ง | `database-design` |
| ตัวชี้วัดอัตราส่งสำเร็จ | `observability-basics` |
| ไฟล์แนบและลิงก์ที่หมดอายุ | `file-upload-and-storage` |
| การแจ้งเตือนทีมเมื่อระบบมีปัญหา | `observability-basics` · `incident-runbook-template` |
| broadcast ถึงเพื่อน LINE OA (โควตา · กลุ่มเป้าหมาย · ความถี่) | `e-commerce:line-broadcast` (ถ้าติดตั้ง) |


---

# skill: data-import-export

Use when a system imports or exports Excel or CSV

# นำเข้าและส่งออกข้อมูล

> **กฎข้อเดียว:** ตรวจให้จบก่อน แล้วค่อยเขียน
> ถ้าเขียนไปครึ่งทางแล้วเจอแถวผิด ข้อมูลจะค้างอยู่ครึ่ง ๆ และไม่มีใครรู้ว่าต้องแก้ตรงไหน

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้อัปโหลด Excel หรือ CSV เพื่อนำข้อมูลเข้าระบบ
- มีปุ่มส่งออกเป็น Excel หรือ CSV
- ย้ายข้อมูลจากระบบเก่าเข้าระบบใหม่
- ผู้ใช้อัปโหลดแล้วได้ข้อความว่า "ไฟล์ไม่ถูกต้อง" แล้วไม่รู้ว่าผิดตรงไหน

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| รับไฟล์อัปโหลดทั่วไป (รูป เอกสาร) | `file-upload-and-storage` | แทน |
| สร้างไฟล์ Excel ที่จัดรูปแบบสวยงาม | `anthropic-skills:xlsx` | แทน |
| กลไกคิวและความคืบหน้า | `background-jobs` | แทน |
| ปี พ.ศ. และการเรียงลำดับไทย | `i18n-and-locale` | แทน |
| ส่งเอกสารเข้าโปรแกรมบัญชีไทย (PEAK · FlowAccount) ผ่าน API แทนไฟล์ | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | แทน |
| บันทึกว่าใครนำเข้าหรือส่งออกอะไร | `audit-trail` | คู่ |
| ปิดบังข้อมูลส่วนบุคคลในไฟล์ส่งออก | `pdpa-compliance` | คู่ |
| แจ้งผู้ใช้เมื่อนำเข้าเสร็จ | `notifications` | คู่ |
| ข้อจำกัดและ constraint ของตารางปลายทาง | `database-design` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · ให้แม่แบบ อย่าให้เดา

**ทุกหน้าจอนำเข้าต้องมีปุ่มดาวน์โหลดแม่แบบ** ในแม่แบบมี

- หัวคอลัมน์ตรงกับที่ระบบต้องการเป๊ะ
- **แถวตัวอย่าง 1–2 แถวที่ถูกต้อง**
- แถวคำอธิบายว่าคอลัมน์ไหนบังคับ รูปแบบอะไร ค่าที่รับได้มีอะไรบ้าง
- ชีตแยกสำหรับรายการค่าที่เลือกได้ (สถานะ ประเภท หน่วย)

| ไฟล์ต่างจากแม่แบบแบบไหน | ทำ |
|---|---|
| ลำดับคอลัมน์สลับ | ✓ อ่านจากชื่อหัวคอลัมน์ ไม่ใช่ตำแหน่ง |
| หัวคอลัมน์มีเว้นวรรคเกิน ตัวพิมพ์ต่าง | ✓ ตัดช่องว่างและเทียบแบบไม่สนตัวพิมพ์ |
| มีคอลัมน์เกินที่ไม่รู้จัก | ✓ ข้ามไป แต่**บอกให้รู้ว่าข้ามอะไร** |
| ขาดคอลัมน์บังคับ | ✗ หยุดทันที บอกว่าขาดคอลัมน์ไหน |

---

## 2 · ตรวจสามชั้น ก่อนเขียนอะไรทั้งนั้น

| ชั้น | ตรวจอะไร | ตัวอย่างข้อความ |
|:--:|---|---|
| 1 · ไฟล์ | เปิดได้ · มีชีตที่ต้องการ · คอลัมน์บังคับครบ · ไม่เกินจำนวนแถวสูงสุด | "ไม่พบคอลัมน์ 'รหัสสินค้า'" |
| 2 · รายแถว | ชนิดข้อมูล · ค่าบังคับ · อยู่ในรายการที่กำหนด · ช่วงตัวเลข | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" |
| 3 · ความสัมพันธ์ | รหัสมีอยู่จริงในระบบ · ไม่ซ้ำกันเองในไฟล์ · กฎทางธุรกิจ | "แถว 88 ไม่พบลูกค้ารหัส C-1042" |

**รายงานความผิดพลาดต้องระบุ: แถว · คอลัมน์ · ค่าที่พบ · ค่าที่ควรเป็น**

```
ผิด: "ไฟล์ไม่ถูกต้อง"
ผิด: "พบข้อผิดพลาด 37 รายการ"
ถูก: ตารางผลตรวจ พร้อมปุ่มดาวน์โหลดไฟล์เดิมที่มีคอลัมน์ "ข้อผิดพลาด" ต่อท้าย
```

> **รายงานข้อผิดพลาดทั้งหมดในครั้งเดียว ไม่หยุดที่แถวแรกที่ผิด**
> ผู้ใช้จะได้แก้รอบเดียวจบ ไม่ใช่อัปโหลดใหม่ 37 รอบ

---

## 3 · เขียนลงระบบ

| แบบ | ใช้เมื่อ |
|---|---|
| **ทั้งหมดหรือไม่ทำเลย** | ค่าเริ่มต้น ไฟล์ต้องถูกหมดถึงจะนำเข้า |
| ทำเท่าที่ผ่าน ข้ามแถวที่ผิด | ไฟล์ใหญ่มากและแต่ละแถวไม่เกี่ยวกัน โดย**ผู้ใช้ต้องเลือกเอง ระบบไม่ตัดสินใจแทน** |

- **ทุกครั้งต้องมีหน้าสรุปก่อนยืนยัน** เช่น "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" แล้วให้กดยืนยัน
- ถ้าเจอแถวซ้ำในไฟล์ ให้หยุดและบอก ไม่ใช่ใช้แถวสุดท้ายเงียบ ๆ
- ถ้าข้อมูลมีอยู่แล้วในระบบ ให้ผู้ใช้เลือก: ข้าม · เขียนทับ · หยุด
- **นำเข้าทุกครั้งต้องบันทึกใน audit** ว่าใครนำเข้า ไฟล์อะไร กระทบกี่แถว (ดู `audit-trail`)
- **เก็บไฟล์ต้นฉบับไว้** พอมีปัญหาจะได้ย้อนดูว่าไฟล์ที่ส่งมาหน้าตาอย่างไรจริง ๆ
- ทำให้ย้อนกลับได้: บันทึก batch id (รหัสรอบนำเข้า) ไว้กับทุกแถวที่นำเข้า

**ไฟล์ใหญ่ทำเป็นงานเบื้องหลัง**: ถ้าเกินประมาณ 1,000 แถวให้เข้าคิว
แบ่งเป็นชุดละ 500 แถว แสดงความคืบหน้า และยกเลิกได้ (ดู `background-jobs`)

---

## 4 · กับดักของ Excel และ CSV

| กับดัก | ผลที่เกิด | ทางแก้ |
|---|---|---|
| **ภาษาไทยใน CSV เพี้ยน** | เปิดใน Excel แล้วตัวอักษรอ่านไม่ออก | บันทึกเป็น UTF-8 **พร้อม BOM** หรือแนะให้ใช้ .xlsx |
| **รหัสที่ขึ้นต้นด้วย 0 หาย** | `0812345678` กลายเป็น `812345678` | อ่านเป็นข้อความเสมอ ส่วนตอนส่งออกให้ตั้งรูปแบบเซลล์เป็นข้อความ |
| **เลขยาวกลายเป็นเลขยกกำลัง** | เลขบัตร 13 หลัก → `1.23457E+12` | เหมือนข้างบน |
| **วันที่ถูกตีความเอง** | `03/04/2026` เป็นมีนาคมหรือเมษายน | บังคับ `YYYY-MM-DD` ในแม่แบบ |
| **ปี พ.ศ. กับ ค.ศ. ปนกัน** | เพี้ยน 543 ปีเงียบ ๆ | **ถามในหน้าจอนำเข้าว่าไฟล์ใช้ปีแบบไหน** |
| ช่องว่างท้ายค่า | จับคู่รหัสไม่เจอ | ตัดช่องว่างหัวท้ายทุกค่า |
| เซลล์ที่เป็นสูตร | ได้สูตรแทนค่า | อ่านค่าที่คำนวณแล้ว |
| **สูตรที่ขึ้นต้นด้วย `=` `+` `-` `@` ในไฟล์ส่งออก** | ผู้ใช้เปิดแล้ว Excel รันคำสั่ง | เติม `'` นำหน้าค่าที่ขึ้นต้นด้วยอักขระเหล่านี้ |

> **ช่องโหว่ที่คนไม่ค่อยรู้**: ชื่อลูกค้าที่เป็น `=cmd|'/c calc'!A1` ถ้าส่งออกดิบ ๆ
> แล้วมีคนเปิดใน Excel มันจะพยายามรันคำสั่งจริง ตอนส่งออกจึงต้อง escape เสมอ

---

## 5 · ส่งออก

| เรื่อง | กฎ |
|---|---|
| ขนาด | ถ้าเกินประมาณ 50,000 แถว ให้ทำเป็นงานเบื้องหลัง แล้วส่งลิงก์ให้ดาวน์โหลด |
| สิทธิ์ | **ส่งออกได้เฉพาะข้อมูลที่ผู้ใช้คนนั้นมีสิทธิ์เห็นอยู่แล้ว** เพราะนี่คือจุดรั่วที่พบบ่อยที่สุด |
| audit | บันทึกทุกครั้งว่าใครส่งออกข้อมูลอะไร ช่วงไหน กี่แถว |
| ข้อมูลส่วนบุคคล | ปิดบังคอลัมน์ที่ไม่จำเป็น (ดู `pdpa-compliance`) |
| ชื่อไฟล์ | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| ส่วนหัวของไฟล์ | ใส่เงื่อนไขกรองที่ใช้ และเวลาที่ส่งออก ไม่งั้นอีก 3 เดือนไม่มีใครรู้ว่าไฟล์นี้คือข้อมูลอะไร |
| ลิงก์ดาวน์โหลด | ต้องหมดอายุ (ดู `file-upload-and-storage`) |
| รูปแบบ | `.xlsx` สำหรับคนอ่าน · CSV สำหรับเครื่องอ่าน |

---

## 6 · Anti-patterns

- **"ไฟล์ไม่ถูกต้อง"** ผู้ใช้ทำอะไรต่อไม่ได้
- **หยุดที่แถวแรกที่ผิด** ผู้ใช้ต้องอัปโหลดใหม่ 30 รอบ
- **เขียนไปตรวจไป** พอล้มกลางทาง ข้อมูลก็ค้างครึ่ง ๆ
- **ไม่มีหน้าสรุปก่อนยืนยัน** เขียนทับข้อมูลจริงโดยไม่มีใครทันได้ดู
- **ไม่มีแม่แบบให้ดาวน์โหลด** ผู้ใช้ต้องเดาหัวคอลัมน์
- **อ่านคอลัมน์ตามตำแหน่ง** ผู้ใช้แทรกคอลัมน์เดียวก็พังทั้งไฟล์
- **อ่านรหัสเป็นตัวเลข** เลข 0 นำหน้าหายทุกครั้ง
- **ไม่ถามว่าปีเป็น พ.ศ. หรือ ค.ศ.** ปีเพี้ยน 543 ปีโดยไม่มีใครรู้
- **ส่งออกโดยไม่ escape สูตร** เปิดไฟล์แล้วรันคำสั่ง
- **ส่งออกได้เกินสิทธิ์ที่มี** ข้อมูลรั่วผ่านปุ่มที่เราทำเอง
- **ไม่เก็บไฟล์ต้นฉบับ** มีปัญหาแล้วย้อนดูไม่ได้


## reference: thai-accounting-apis.md

# Connecting to Thai SME accounting software through API

Use when our system must push sales or purchase documents into the customer's accounting software, instead of exporting Excel for them to re-key. The rules of `SKILL.md` still apply: validate everything before writing · summary page before confirming · batch id · audit.
Every fact comes from the vendors' documents, opened 2026-10-23. Prices and API fees were rechecked 2026-10-26 (table "Sources"). Prices and terms change often: confirm with the vendor before quoting a customer.
Abbreviations: small and medium enterprises (SME) · Application Programming Interface (API) · User Acceptance Testing (UAT) is the test system · Hash-based Message Authentication Code (HMAC) is a signature made from a secret key · Software Development Kit (SDK).

## 1 · Choose a route

| Route | Use when |
|---|---|
| Send a file using the accounting software's import template (file format of each vendor not yet checked) | Few documents · the customer's package has no API |
| Connect to the API directly (sections 2–3) | Hundreds of documents per month · need status back, such as paid |
| Through a partner app the accounting software certifies (PEAK: menu ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก, i.e. Settings > External application connections) | Online shop that already uses a back-office system → `ecommerce-patterns` `references/thai-marketplace-apis.md` |

## 2 · PEAK

| Topic | Information |
|---|---|
| Docs | developers.peakaccount.com (API Integration Guide · file `llms.txt` links every page) · has a Postman collection |
| Package | PEAK PRO Plus (12,000 baht/year) or higher · PEAK PRO Plus price per the developers page on 2026-10-26 · API fee is paid before go-live under the agreed package terms; the docs state no amount (`รอยืนยัน`, pending confirmation · per the go-live document, confirm the API fee, the number of items, and the trial terms with the PEAK team before putting them in a quotation) |
| Get access | Fill in the form, the team replies within 3 working days · you get Connect ID + Application Code · UAT and production credentials are separate |
| Authentication | Client Token valid 24 hours (`POST /api/v1/ClientToken`) · User Token per business, the customer creates it in the menu เชื่อมต่อแอปพลิเคชันภายนอก (External application connections) with the Application Code · header `Time-Stamp` (yyyyMMddHHmmss, UTC) · `Time-Signature` = HMAC-SHA1 of the Time-Stamp, with connectId as the key |
| What it can do | contacts · products (has adjust) · services · quotations · invoices · billing notes · receipts · credit notes · purchase orders · expenses · daily journals · receive payment · void · approve · attach files |
| e-Tax | Has an endpoint to send e-Tax Invoice for invoice and receipt · sends e-Receipt |
| UAT | `http://peakengineapidev.azurewebsites.net/api/v1` (http, not https) · free for 3 months · open Mon–Fri 08:00–22:00 |
| Production | `https://api.peakaccount.com/api/v1` · before go-live must pass the Final UAT Review (test case · error case · duplicate case · accounting result) |
| rate limit | ClientToken request 10 times/minute/IP · trial balance report (`GET /api/v1/FinancialReports/trialbalance`) 10 times/minute and 1 concurrent · per User Token: GET 20 concurrent · POST 10 concurrent · file attach 10 concurrent · over the limit → HTTP 429 `RATE_LIMITED` with `retryAfterSeconds` |
| Billed by | Only successful POST Create (invoice · receipt · quotation · billing note · purchase order · expense · daily journal) |
| webhook | Events Create · Edit · Void · PaidPayment · VoidPayment of the main documents (contact · product only Create · Edit) · can set a custom header per endpoint, such as `x-api-key` · the docs say nothing about signatures or redelivery |

## 3 · FlowAccount

| Topic | Information |
|---|---|
| Docs | developers.flowaccount.com · the spec actually in use `https://developers.flowaccount.com/swagger.yml` (OpenAPI 3.0.2 · 130 paths) · SDKs in several languages at github.com/flowaccount |
| Package | Only Pro Business has Open API (price page 2026-10-26: ฿457/month · ฿5,490/year) · Free · Standard (฿1,990/year) · Pro (฿2,990/year) have no API · the price page lists no separate API fee · import up to 5,000 items/month, beyond that special pricing · the API page says "Pay when you go live" and gives no amount (`รอยืนยัน`, pending confirmation) |
| Get access | Form request-openapi · team replies within 1–2 working days · sandbox usable for 30 days · real credentials are emailed to the business owner within 3 working days after the package is confirmed |
| Authentication | OAuth 2.0 · Client Credentials = 1 client per business · OpenID = partner with 1 client for many businesses (scope `flowaccount-api offline_access` · refresh token about 30 days from the last use) · token at `https://openapi.flowaccount.com/{test or v1}/token` valid 86,400 seconds · sent in header `Authorization: Bearer` |
| base URL | sandbox `https://openapi.flowaccount.com/test` · production `https://openapi.flowaccount.com/v1` |
| What it can do | contacts · products · quotations · billing-notes · tax-invoices · receipts · cash-invoices · purchases · purchases-orders · expenses · withholding-taxes · journal-entries · chart-of-accounts · change status · receive payment · attach files · export PDF · send email |
| Cross-system reference | Field `externalDocumentId` "รหัสเอกสารอ้างอิงจากระบบภายนอก" (document id referenced from an external system) |
| e-Tax · rate limit · webhook | Not found in swagger.yml (searching webhook · etax · rate limit · 429 gave 0 hits) nor on the pages developers.flowaccount.com · flowaccount.com/en/developers on 2026-10-26 (not yet checked with the vendor · contact developer_support@flowaccount.com) |

## 4 · Other vendors

| Software | What was found |
|---|---|
| TRCLOUD | The vendor's API page says it has a RESTful API · create an API Key from the settings menu · has Custom API & Webhook · no public developer docs found, ask the sales team for the manual |
| AccRevo | No public API found · the website has a launch article about AccRevoX × MCP (works with Claude) |
| Express | Searched twice, found no vendor website and no public API |

## 5 · e-Tax Invoice

- Pick one system to issue the tax invoice number · our system and the accounting software must not both issue numbers
- Send into the accounting software as the source document, then let the accounting software issue the e-Tax · PEAK has an endpoint to send e-Tax · FlowAccount not found in the spec, ask the vendor
- Tax invoice rules (section 86/4 · e-Tax Invoice & e-Receipt vs by Email) → `e-commerce:e-tax-invoice` (if installed)

## 6 · Prevent duplicates and reconcile

- Keep a mapping table: our id ↔ the accounting software's id · PEAK recommends keeping External Reference and a mapping to prevent duplicate documents · FlowAccount uses `externalDocumentId` to hold our id
- Neither vendor's docs have an idempotency key → look up the mapping before every POST create (`principle-safe-to-rerun`)
- A timeout does not mean failure · pull the list by date range and compare before resending
- On 429 → wait per `retryAfterSeconds` or back off exponentially (1 · 2 · 4 · 8 seconds, as PEAK recommends)
- Reconcile every day: the document count and total of the 2 systems must match → `fintech-payments` (`references/agent-payment-integration.md`, section Settlement Reconciliation)
- Log every send to audit: who sent · which document · destination id · result → `audit-trail`
- Client Token · client secret · connectId stay outside the code → `config-and-secrets` · PEAK UAT is http, so use test data only

## Sources

| Topic | URL (opened 2026-10-23) |
|---|---|
| PEAK packages · UAT free 3 months · guide | https://www.peakaccount.com/developers · https://developers.peakaccount.com/reference/api-integration-guide |
| PEAK list of all API pages | https://developers.peakaccount.com/llms.txt |
| PEAK token · signature | https://developers.peakaccount.com/reference/peak-api-client-token-guide.md |
| PEAK rate limit · billing count · go-live | https://developers.peakaccount.com/reference/copy-of-api-rate-limiting-concurrency-control.md · .../peak-api-transaction-counting.md · .../peak-api-implementation-go-live-guide.md |
| PEAK webhook · API access rights | https://developers.peakaccount.com/reference/webhook.md · .../api-access-rights.md |
| PEAK help center (packages · User Token) | https://intercom.help/peak/en/articles/13176287 · https://intercom.help/peak/en/articles/10078711 |
| FlowAccount API page · price (rechecked 2026-10-26) | https://flowaccount.com/en/developers · https://flowaccount.com/en/pricing |
| FlowAccount connection · token | https://developers.flowaccount.com/tutorial/connect-open-api · .../tutorial/connect/client-credentials-flow · .../tutorial/connect/open-id-flow |
| FlowAccount spec · SDK | https://developers.flowaccount.com/swagger.yml · https://github.com/flowaccount/open-api (README says swagger.yml is the spec in actual use) |
| TRCLOUD · AccRevo | https://www.trcloud.co/api.php · https://www.accrevo.com/ |


---

# skill: observability-basics

Use when a live system needs metrics, logs or alerts

# วัดผลและเฝ้าระบบ

> **กฎข้อเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
> ไม่ใช่ว่าลูกค้าใจดี

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้จริงแล้ว
- มีคนถามว่า "ตอนนี้ระบบปกติดีไหม" แล้วต้องไปเปิด log ดูถึงจะตอบได้
- ถูกปลุกกลางดึกด้วยการแจ้งเตือนที่ไม่ต้องทำอะไร
- ระบบช้าแล้วไม่รู้ว่าช้าตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปแบบบรรทัด log และการปิดบัง | `logging-standards` |
| ร่องรอยว่าใครทำอะไร | `audit-trail` |
| endpoint health check | `web-service-essentials` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |

---

## 1 · สามอย่างนี้ตอบคนละคำถาม

| | ตอบคำถาม | ตัวอย่าง | ต้นทุน |
|---|---|---|---|
| **metric** (ตัวชี้วัด) | "ตอนนี้แย่ไหม แย่ขึ้นหรือลง" | error 2.3% · p95 = 840 ms | ถูกสุด เก็บได้นาน |
| **log** (บันทึก) | "คำขอนั้นเกิดอะไรขึ้น" | ข้อความ + stack trace + id | แพงปานกลาง |
| **trace** (การไล่รอย) | "ช้าที่ขั้นตอนไหน" | คำขอเดียว ผ่าน 5 service | แพงสุด สุ่มเก็บ |

**ลำดับการใช้เวลาเกิดเหตุ:** metric บอกว่า**มีปัญหา** → trace บอกว่า**ตรงไหน** → log บอกว่า**ทำไม**
ทั้ง 3 อย่างต้องเชื่อมกันด้วย correlation id ตัวเดียวกัน (ดู `logging-standards`)

---

## 2 · สี่สัญญาณที่ต้องวัด

| สัญญาณ | วัดอะไร | ตัวเลขที่ดู |
|---|---|---|
| **อัตราคำขอ** | มีงานเข้ามาเท่าไหร่ | ต่อวินาที แยกตาม endpoint |
| **อัตราความผิดพลาด** | ล้มกี่เปอร์เซ็นต์ | แยก 4xx (ผู้ใช้ผิด) กับ 5xx (เราผิด) |
| **เวลาตอบสนอง** | ช้าแค่ไหน | **p50 · p95 · p99** |
| **ทรัพยากร** | ใกล้เต็มไหม | CPU · หน่วยความจำ · พื้นที่ · connection pool |

> **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง** — เฉลี่ย 200 ms ฟังดูดี
> ทั้งที่ผู้ใช้ 5% รอ 9 วินาที ค่าเฉลี่ยกลบคนที่เจอปัญหาเสมอ **ดู p95 และ p99**

**สำหรับคิวและงานเบื้องหลัง** เพิ่มอีก 3 ตัว — งานค้างในคิว · เวลารอในคิว · งานที่ล้มถาวร
(ดู `background-jobs`)

---

## 3 · ตั้งชื่อตัวชี้วัด

```
<โดเมน>_<สิ่งที่วัด>_<หน่วย>

http_requests_total              จำนวนสะสม
http_request_duration_seconds    ระยะเวลา
orders_created_total             เหตุการณ์ทางธุรกิจ
queue_depth_jobs                 ค่า ณ ขณะนั้น
```

| กฎ | เหตุผล |
|---|---|
| ลงท้ายด้วยหน่วยเสมอ | `_seconds` ไม่ใช่ `_time` ที่ไม่มีใครรู้ว่าวินาทีหรือมิลลิวินาที |
| ค่าสะสมลงท้าย `_total` | บอกว่าเป็นค่าที่เพิ่มขึ้นเรื่อย ๆ ไม่ใช่ค่าปัจจุบัน |
| ใช้ label แทนการสร้างชื่อใหม่ | `http_requests_total{route,status}` ไม่ใช่ชื่อแยกต่อ endpoint |
| **label ห้ามมีค่าที่ไม่จำกัด** | ถ้าใส่ user id หรือ order id เป็น label ระบบเก็บ metric จะรับไม่ไหว |

### 3.1 · ถ้าใช้ Prometheus และ Grafana

- **ชนิด metric:** counter ใช้นับเหตุการณ์ (อ่านด้วย `rate()`) · gauge ใช้ค่า ณ ตอนนี้ · histogram ใช้ระยะเวลาที่ต้องหา p95 · summary ใช้เมื่อไม่ต้องรวมข้าม instance
- **หน่วย:** วินาที · byte · ratio 0 ถึง 1 (`_seconds` ไม่ใช่ `_milliseconds`)
- **ห้ามใส่ `user_id` · เบอร์โทร · `call_id` เป็น label** เพราะทุกค่าใหม่คือ series ใหม่ 1 เส้น จนระบบเก็บ metric รับไม่ไหว · id เหล่านี้ลง log และ trace
- p95: `histogram_quantile(0.95, sum by (le) (rate(<ชื่อ>_bucket[5m])))`
- alert ทุกกฎมี `for:` · `severity` · ลิงก์ runbook · เตือนจากอาการ (latency · error) ไม่เตือนจาก CPU หรือ GPU
- dashboard เก็บเป็น JSON ใน git แล้ว provision ด้วยไฟล์ · RED ต่อ service · USE ต่อทรัพยากร
- รายละเอียด PromQL · ตัวอย่างกฎ alert · provisioning · ตัวอย่างระบบ voice agent (latency STT · LLM · TTS · lag ของ Kafka · GPU): `references/prometheus-grafana.md`

---

## 4 · การแจ้งเตือน

> **แจ้งเตือนทุกครั้งต้องมีอะไรให้ทำ** — ถ้าคนรับอ่านแล้วไม่ต้องทำอะไร
> อีก 3 สัปดาห์เขาจะปิดเสียงแจ้งเตือน แล้ววันที่ของจริงเกิดก็จะไม่มีใครเห็น

**แจ้งเตือนจากสิ่งที่ผู้ใช้รู้สึก ไม่ใช่จากตัวเลขของเครื่อง**

| ✗ เตือนแบบนี้ | ✓ เตือนแบบนี้ |
|---|---|
| CPU เกิน 80% | อัตรา error เกิน 2% นาน 5 นาที |
| หน่วยความจำเกิน 70% | p95 ของหน้าชำระเงินเกิน 3 วินาที นาน 10 นาที |
| pod restart | คำสั่งซื้อสำเร็จลดลงเกิน 50% เทียบกับสัปดาห์ก่อน |
| disk 60% | **disk จะเต็มใน 4 ชั่วโมงตามอัตราปัจจุบัน** |

| ระดับ | ตัวอย่าง | ส่งไปไหน |
|---|---|---|
| **ปลุกคน** | ผู้ใช้ใช้งานไม่ได้ · ข้อมูลกำลังเสียหาย | โทร · push |
| **ดูในเวลางาน** | disk จะเต็มใน 3 วัน · error เพิ่มแต่ยังไม่มาก | แชตของทีม |
| **แค่บันทึกไว้** | ทุกอย่างที่เหลือ | แดชบอร์ด |

**ทุกการแจ้งเตือนต้องมี:** อะไรพัง · กระทบใคร · **ลิงก์ไป runbook** · ลิงก์ไปแดชบอร์ด
**ตั้งช่วงเวลา (นาน N นาที) เสมอ** ไม่ใช่เตือนทันทีที่ค่าพุ่งครั้งเดียว

### 4.1 · งบความผิดพลาด (error budget) และอัตราเผางบ (burn rate)

ระบบที่มี SLO ใช้วิธีนี้แทนการตั้งเกณฑ์ error % ตายตัว เพราะมันบอกว่า "ถ้าปล่อยไว้แบบนี้ งบทั้งเดือนจะหมดเมื่อไหร่" (แนวคิดจาก Google SRE Workbook)

- **งบ** = เวลาที่ยอมให้ล้มได้ใน 30 วัน → SLO 99.9% = 43 นาที · 99.5% = 3.6 ชั่วโมง · 99% = 7.2 ชั่วโมง
- **burn rate** = อัตรา error ตอนนี้ ÷ (1 − SLO) → burn 1 = งบหมดพอดีวันที่ 30 · burn 10 = หมดใน 3 วัน
- ตั้งแจ้งเตือน 3 ระดับตามตาราง และทุกระดับต้องเป็นจริงทั้งช่วงยาวและช่วงสั้น (ช่วงสั้น = 1/12 ของช่วงยาว) จะได้หยุดเตือนทันทีที่ระบบหาย

| ระดับ | burn rate | ช่วงยาว · ช่วงสั้น | กินงบไปแล้ว | SLO 99.9% แปลว่า error เกิน | ส่งไปไหน |
|---|---|---|---|---|---|
| ไหม้เร็ว | 14.4 | 1 ชั่วโมง · 5 นาที | 2% ของเดือน ใน 1 ชั่วโมง | 1.44% | ปลุกคน |
| ไหม้ช้า | 6 | 6 ชั่วโมง · 30 นาที | 5% ของเดือน ใน 6 ชั่วโมง | 0.6% | ปลุกคน |
| รั่วซึม | 1 | 3 วัน · 6 ชั่วโมง | 10% ของเดือน ใน 3 วัน | 0.1% | แชตของทีม |

งบเหลือเท่าไหร่ให้ขึ้นบนแดชบอร์ดภาพรวม — งบใกล้หมด = หยุดปล่อยฟีเจอร์ ไปแก้ความเสถียรก่อน เป็นกติกาที่ตกลงกับเจ้าของผลิตภัณฑ์ล่วงหน้า ไม่ใช่ตอนทะเลาะกัน

---

## 5 · แดชบอร์ด

ทำ 2 หน้าพอ

| หน้า | ตอบคำถาม | มีอะไร |
|---|---|---|
| **ภาพรวม** | "ตอนนี้ปกติไหม" | 4 สัญญาณของทั้งระบบ · สถานะ dependency · การปล่อยของล่าสุด |
| **เจาะลึกต่อ service** | "พังตรงไหน" | 4 สัญญาณแยกตาม endpoint · คิว · ฐานข้อมูล |

- **เส้นแนวตั้งบอกเวลาที่ deploy** — ปัญหาส่วนใหญ่เริ่มหลังเส้นนี้ และเห็นได้ในวินาทีเดียว
- หน้าภาพรวมต้องอ่านจบใน 10 วินาที จึงควรมีไม่เกิน 6 กราฟ
- ใส่เส้นเกณฑ์ที่ตั้งแจ้งเตือนไว้ในกราฟ จะได้รู้ว่าห่างจากเส้นแค่ไหน

---

## 6 · ตัวชี้วัดทางธุรกิจ

ตัวชี้วัดทางเทคนิคเขียวหมดแต่ธุรกิจหยุดเดิน เป็นเรื่องที่เกิดขึ้นจริงและตรวจไม่เจอถ้าไม่วัด

| ตัวอย่าง | จับอะไรได้ |
|---|---|
| คำสั่งซื้อสำเร็จต่อชั่วโมง | ปุ่มชำระเงินพังแม้ทุก endpoint คืน 200 |
| อัตราเข้าสู่ระบบสำเร็จ | ผู้ให้บริการยืนยันตัวตนภายนอกมีปัญหา |
| งานเบื้องหลังที่รอเกิน N นาที | คิวตัน แต่ API ยังตอบปกติ |
| อีเมลส่งไม่สำเร็จ | ลูกค้าไม่ได้รับใบเสร็จ โดยไม่มี error ที่ไหนเลย |

**เลือก 3–5 ตัวที่เป็นหัวใจของธุรกิจ** แล้วเตือนเมื่อมันตกผิดปกติเทียบกับช่วงเดียวกันของสัปดาห์ก่อน

---

## 7 · Anti-patterns

- **ดูค่าเฉลี่ยของเวลาตอบสนอง** — กลบคนที่เจอปัญหาทุกครั้ง
- **แจ้งเตือนที่ไม่ต้องทำอะไร** — สอนให้ทุกคนเลิกสนใจการแจ้งเตือน
- **เตือนจาก CPU และหน่วยความจำ** — ระบบที่ CPU 90% แต่ผู้ใช้ปกติ ไม่ใช่เหตุ
- **ใส่ id ที่ไม่จำกัดค่าเป็น label** — ระบบเก็บ metric ล่มเสียเอง
- **แดชบอร์ด 40 กราฟ** — ไม่มีใครรู้ว่าต้องดูอันไหน
- **วัดแต่เทคนิค ไม่วัดธุรกิจ** — ทุกอย่างเขียวแต่ไม่มีใครสั่งซื้อได้
- **เก็บ trace ทุกคำขอ** — แพงโดยไม่ได้อะไรเพิ่ม สุ่มเก็บก็พอ
- **ไม่มีเส้นบอกเวลา deploy** — เสียเวลาครึ่งชั่วโมงกว่าจะนึกได้ว่าเพิ่ง deploy ไป
- **แจ้งเตือนที่ไม่มีลิงก์ไป runbook** — คนรับต้องเริ่มค้นจากศูนย์ตอนตี 3

---

## 8 · ตัวย่อ

- **metric** — ตัวชี้วัด ตัวเลขที่เก็บตามเวลา
- **trace** — การไล่รอยคำขอหนึ่งตลอดเส้นทางที่มันวิ่งผ่าน
- **p95 / p99** — เปอร์เซ็นไทล์ที่ 95 และ 99 (ช้ากว่านี้มีแค่ 5% หรือ 1% ของคำขอ)
- **label / tag** — ป้ายกำกับที่แนบกับตัวชี้วัด ใช้แยกดูเป็นกลุ่ม
- **on-call** — เวรรับแจ้งเหตุนอกเวลาทำการ
- **SLO** — Service Level Objective (เป้าหมายระดับบริการที่ตั้งไว้เอง เช่น สำเร็จ 99.5%)
- **error budget / burn rate** — เวลาที่ยอมให้ล้มได้ต่อเดือนตาม SLO และความเร็วที่กำลังใช้มันหมด (ข้อ 4.1)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| health check ที่ระบบเฝ้าใช้ | `web-service-essentials` |
| ตัวชี้วัดของคิวและงานเบื้องหลัง | `background-jobs` |
| อัตรา error และการตัดวงจร | `error-handling-patterns` |
| ขั้นตอนเมื่อการแจ้งเตือนดัง | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |
| ตัวเลขเป้าหมายที่ตกลงกับลูกค้า | `srs-writing` |
| PromQL · กฎ alert · Grafana provisioning · ตัวอย่าง voice agent | `references/prometheus-grafana.md` |
| ให้ agent อ่าน Prometheus หรือ Grafana ผ่าน MCP | `mcp-server` ข้อ 1.1 |

ที่มาของข้อ 3.1: prometheus.io (metric types · naming · histograms · alerting) และ grafana.com (dashboard best practices · provisioning) ตรวจ 2026-10-27 · ลิงก์เต็มอยู่ท้าย `references/prometheus-grafana.md`


## reference: prometheus-grafana.md

# Prometheus and Grafana — using them correctly

Part of `observability-basics` · the thinking about what to measure and what to alert on is in `SKILL.md` sections 2 · 4 · 5 · this file says how to do it in Prometheus and Grafana · metric names and numbers labelled `ตัวอย่าง` (example) are hypothetical data and must be adjusted to the real system

## Contents

- [1 · The 4 metric types](#1--the-4-metric-types)
- [2 · Names and units](#2--names-and-units)
- [3 · Labels and cardinality](#3--labels-and-cardinality)
- [4 · Common PromQL](#4--common-promql)
- [5 · Alert rules](#5--alert-rules)
- [6 · Grafana](#6--grafana)
- [7 · Voice agent system example](#7--voice-agent-system-example)
- [8 · Check before sending](#8--check-before-sending)
- [9 · Sources](#9--sources)

## 1 · The 4 metric types

| Type | What it is | Use when | Example |
|---|---|---|---|
| counter | A cumulative value that only goes up and returns to 0 when the process restarts | Counting events that have happened (requests · errors · finished jobs) · read with `rate()`, never the raw value | `http_requests_total` |
| gauge | The value at that moment, can go up and down | Things that are pending or measurable right now (calls in progress · queue length · memory) | `voice_calls_active` |
| histogram | Counts measured values into ranges (buckets), with a sum and a count | Durations or sizes where you need p95 · p99 and want to aggregate across many instances | `http_request_duration_seconds` |
| summary | Computes quantiles on the app side, over a sliding time window | Use only when you do not need to aggregate across instances · the quantiles and window are chosen when writing the code and cannot be changed later | Rare; normally choose histogram |

- Never average quantiles from a summary across several instances; the result has no statistical meaning (the Prometheus docs use this wording)
- **How to choose** (prometheus.io/docs/practices/histograms/ checked 2026-10-27): if the library and Prometheus you use support it, use a native histogram first, because you can change the percentile and time window later in PromQL · if not supported but you need to aggregate across instances, use a classic histogram · use a summary only when you do not need to aggregate across instances
- The Prometheus docs recommend native histograms first, but the libraries that support them are still limited; if your library does not support them, use a classic histogram and place buckets so that an edge sits at the SLO value, otherwise the estimated p95 will be off (example in the docs: true p95 about 320 ms is estimated as 443 ms because the bucket is wide from 300 to 450 ms)

## 2 · Names and units

| Rule | Right | Wrong |
|---|---|---|
| Start with one word that names the system | `voice_stage_duration_seconds` | `stage_duration` |
| Use base units: seconds · bytes · ratio 0 to 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| The unit goes at the end, in plural form | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| A counter ends in `_total` (if it has a unit, the unit comes first) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 name, 1 unit, 1 meaning | All in seconds | Half in seconds, half in milliseconds |
| Do not put a label name again in the metric name | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · Labels and cardinality

Every unique set of label values is 1 new time series. The Prometheus docs warn you to avoid labels whose values are unbounded, such as user id or email.

| Must not be a label | Use instead |
|---|---|
| `user_id` · `customer_id` · phone number · email | Leave it out · keep it in logs or traces · if you must count per person, use a database, not a metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | Logs and traces tied to the same id (`logging-standards`) |
| A full URL that has an id or query string | A route template such as `/orders/{id}` |
| An error message with variable values | A limited set of error codes such as `reason="timeout"` |

- A label you may use must have all its possible values countable in advance (stage = 3 values · status = 5 groups) · the number of series of one metric is close to the product of the number of values in each label · a histogram multiplies by the number of buckets on top
- To find which metric makes series explode: open the TSDB status page in the Prometheus UI · the `tsdb_stats` tool of `prometheus-mcp` gives similar information (see `mcp-server` step 1.1)

## 4 · Common PromQL

| Need | Query | Note |
|---|---|---|
| Requests per second | `sum by (route) (rate(http_requests_total[5m]))` | The `[5m]` range should be several times the scrape interval (number not yet checked against the docs) |
| Error rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | Count 5xx (our fault) apart from 4xx · with no traffic the quotient is NaN and the alert rule will not fire, which can hide a system receiving no requests at all; add a separate rule that alerts on no requests |
| p95 of latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | Keep `le` in `sum by` · to split by route, add `route` to `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | Use when the library and Prometheus support it |
| Average latency (for context only, never for deciding) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | See `SKILL.md` section 2 |
| Disk will be full in 4 hours | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | An example of saturation that warns ahead of time (not yet checked against the PromQL docs) |

## 5 · Alert rules

Principle from the Prometheus docs: alert on symptoms users feel (latency · errors) at the highest point in the stack you can · wake someone for latency at a single point of the stack · put causes (CPU · GPU · consumer lag) on the dashboard for tracing, and do not wake anyone for them · except for things a person must act on before the system goes down, such as capacity

Exception: a number users feel directly counts as a symptom even if it comes from an underlying system, such as Kafka consumer lag that makes callers wait for an answer (section 7); it may wake someone · lag that affects nobody right away, such as a report job after the call ends, is a cause; put it on the dashboard or the team chat

Every rule must have 4 things

| Item | Where | Reason |
|---|---|---|
| `for:` | In the rule | Do not alert the moment the value spikes once · if omitted, the rule fires from the first evaluation round |
| Severity level | Label `severity` (the name and values are a convention the team sets, not required by Prometheus) | Lets Alertmanager route it to the right place · use 3 levels per `SKILL.md` section 4: wake someone · look during work hours · log it |
| Runbook link | Annotation `runbook_url` (the key name is a convention; the docs say only that an annotation can hold a runbook link) | The responder starts from a procedure, not from zero at 3 a.m. |
| `summary` stating the symptom and who is affected | Annotation | Reading it on a phone tells you what to do |

Example (hypothetical thresholds; set them from the real SLO):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` stops alerts from flapping when the value hovers around the threshold · for burn rate alerts see `SKILL.md` section 4.1

## 6 · Grafana

| Topic | How |
|---|---|
| 1 dashboard per 1 service | A service that takes requests uses RED: Rate · Errors · Duration · resources (CPU · GPU · disk · connection pool) use USE: Utilization · Saturation · Errors · the Grafana docs say RED stands for the user experience, so set alerts from RED and use USE to trace causes |
| Keep it as code | Dashboard JSON lives in git · the Grafana docs treat not keeping JSON in version control as a sign the system is not yet in order · when many dashboards look alike, generate them with grafonnet (Jsonnet) or grafanalib (Python) |
| Load automatically | A provider YAML file in `provisioning/dashboards/` points `options.path` to the JSON folder |
| Stop edits in the browser from being lost | Set `allowUiUpdates: false` · whoever wants a change edits the JSON in git and opens a PR · loading from files always overwrites the version in the database |
| Do not copy a dashboard | Use template variables (choose service · environment) on a parent dashboard · the Grafana docs warn that copying means you do not get fixes from the original |
| Temporary dashboards | Name them starting with `TEST:` and delete when done |
| uid | Set a fixed `uid` in the JSON so links from alerts do not break · `uid` and `title` must be unique within the same folder |

Example provider (checked against the Grafana docs 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · Voice agent system example

All metric names in this section are set by the team (examples), except `DCGM_FI_DEV_GPU_UTIL` and `kafka_consumergroup_lag*`, which come from exporters

**Latency of each stage of a call** · 1 histogram split by stage with a `stage` label that has limited values

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- Place buckets densely in the range 0.1 to 3 seconds, for example `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5`, with an edge at the threshold you set (1.5 seconds in the example of section 5)
- p95 per stage: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · put it in one chart with 3 lines and you see at once which stage eats the time
- Alert on `voice_turn_duration_seconds` (the symptom callers feel); do not alert on every stage · stages are for tracing causes
- Never put `call_id` or the caller's phone number as a label · the call id goes to logs and traces

**Kafka consumer lag** · when the pipeline sends call events through Kafka

- The lag value comes from a Kafka exporter · `kafka_exporter` (danielqsj · Apache-2.0 · not an official Apache project · checked 2026-10-27) gives `kafka_consumergroup_lag{consumergroup,topic,partition}` and `kafka_consumergroup_lag_sum{consumergroup,topic}` · if you use another exporter, the names may differ
- Wake someone when the lag of a consumer that makes callers wait (such as the real-time call summarizer) is high and does not fall for a long time · example `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` with `for: 10m` (hypothetical threshold) · lag of a report job after the call ends is fine to send to the team chat
- The `partition` label is only for drill-down charts; do not put it in alert rules

**GPU utilization** · the exporter is NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` is a gauge in % (checked from `etc/default-counters.csv` of the repo 2026-10-27) · this name was set by the exporter and does not follow the rules of section 2; use it as it is
- GPU is a cause (USE), not a symptom · put it on the dashboard next to the latency of the stages that use the GPU (STT · TTS) · high utilization together with a high p95 of that stage means the machine is saturated and you must add machines or reduce load
- GPU that stays high for many hours alerts at the look-during-work-hours level; it does not wake anyone

## 8 · Check before sending

- [ ] Every metric has a unit and `_total` per the rules · no label with unbounded values (user · phone · call id)
- [ ] Latency is a histogram with a bucket edge at the SLO threshold · no decisions from averages
- [ ] Every alert has `for:` · `severity` · `runbook_url` · `summary` · alerts on symptoms, not on CPU or GPU
- [ ] Dashboards are JSON in git · provisioned from files · `allowUiUpdates: false`
- [ ] There is a RED dashboard per service and USE per resource

## 9 · Sources

Checked 2026-10-27

| Topic | Source |
|---|---|
| Metric types | prometheus.io/docs/concepts/metric_types/ |
| Names, units, label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| Principle of alerting on symptoms | prometheus.io/docs/practices/alerting/ |
| Rule syntax `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| Dashboard provisioning | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (not official to Kafka) |
| `predict_linear` · `[5m]` range vs scrape interval · NaN behavior when dividing by 0 | General team knowledge (not yet checked against the official PromQL pages) |


---

# skill: i18n-and-locale

Use when a system shows text, dates or money in Thai and English

# ภาษาและรูปแบบท้องถิ่น

> **กฎข้อเดียว:** เก็บเป็นค่ากลาง แปลงตอนแสดงผล
> เวลาเก็บเป็น UTC ปีเก็บเป็น ค.ศ. ส่วนเงินเก็บเป็นตัวเลขคู่กับรหัสสกุลเงิน
> อะไรที่ "แปลงไว้ก่อนแล้วค่อยเก็บ" จะกลายเป็นข้อมูลที่แปลงกลับไม่ได้

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้ทั้งไทยและอังกฤษ หรืออาจมีในอนาคต
- ต้องแสดงวันที่แบบ พ.ศ. ควบคู่กับการเก็บ ค.ศ.
- เรียงชื่อภาษาไทยแล้วลำดับไม่ถูก หรือค้นหาแล้วไม่เจอ
- ข้อความไทยตัดบรรทัดกลางคำ หรือล้นออกนอกปุ่ม

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ชนิดข้อมูลวันเวลาในฐานข้อมูล | `database-design` |
| รูปแบบวันเวลาใน JSON | `api-conventions` |
| ฟอนต์ไทยและการจัดหน้าเอกสาร | `branded-document-design` |
| ฟอนต์ไทยบนหน้าจอ | skill แพลตฟอร์ม + `ui-craft` |

---

## 1 · ข้อความแปล

**ห้ามมีข้อความที่ผู้ใช้เห็นฝังอยู่ในโค้ด** แม้โครงการจะมีภาษาเดียววันนี้

```
locales/
  th.json        ← ภาษาหลัก เป็นแหล่งความจริง
  en.json
```

| Stack | ไฟล์ข้อความแปล | รูปแบบคีย์ |
|---|---|---|
| เว็บ / ไลบรารีที่ใช้ JSON | `locales/th.json` · `en.json` | จุดคั่นตามที่อยู่ `order.cancel.confirmTitle` |
| Flutter (`gen-l10n`) | `lib/l10n/app_th.arb` · `app_en.arb` + `l10n.yaml` ที่รากของโฟลเดอร์โค้ด | **camelCase ไม่มีจุด** `orderCancelConfirmTitle` — คีย์ ARB กลายเป็นชื่อ getter ของ Dart จุดจึงใช้ไม่ได้ |

**ตั้งชื่อคีย์ตามที่มันอยู่ ไม่ใช่ตามเนื้อความ:**

```jsonc
// ถูก: เปลี่ยนคำได้โดยไม่ต้องแก้คีย์
"order.cancel.confirmTitle": "ยืนยันการยกเลิกคำสั่งซื้อ"
// ผิด: พอเปลี่ยนคำ คีย์กับเนื้อหาก็ไม่ตรงกัน
"ยืนยันการยกเลิก": "ยืนยันการยกเลิกคำสั่งซื้อ"
```

| กฎ | เหตุผล |
|---|---|
| ตัวแปรใช้ชื่อ ไม่ใช่ลำดับ — `"เหลือ {count} รายการ"` | ลำดับคำแต่ละภาษาไม่เหมือนกัน |
| **ห้ามต่อประโยคจากชิ้นส่วน** | ภาษาอื่นเรียงคำคนละแบบ ประโยคที่ได้จะผิดไวยากรณ์ |
| คีย์ที่ขาดให้แสดงคีย์ ไม่ใช่ค่าว่าง | ค่าว่างทำให้ปุ่มไม่มีข้อความ และไม่มีใครเห็นว่าพัง |
| ตรวจใน Continuous Integration (CI) ว่าทุกภาษามีคีย์ครบ | ไม่งั้นจะรู้ตอนลูกค้าเห็นแล้ว |

```
ผิด: t("มีทั้งหมด") + count + t("รายการ")
ถูก: t("list.total", { count })
```

**ถ้อยคำในไฟล์ภาษาไทย**

- เขียนข้อความไทยตรง ๆ จากสิ่งที่หน้าจอต้องบอก ไม่แปลจากคีย์หรือจากข้อความอังกฤษทีละคำ
- 1 การกระทำ 1 คำทั้งแอป (บันทึก ไม่ใช่ เซฟ ปนกับ บันทึก) · เก็บคู่คำไว้ใน `locales/glossary.md` แล้วตรวจกับไฟล์นี้ทุกครั้งที่เพิ่มคีย์
- ถ้อยคำบนปุ่ม ป้าย และข้อความ error → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ หน้าจอ

---

## 2 · เวลา — เก็บ UTC แสดงตามเขตเวลาผู้ดู

```
เก็บ:   2026-09-25T02:42:13.482Z          (UTC เสมอ)
แสดง:   25 ก.ย. 2569 09:42                (Asia/Bangkok ของผู้ดู)
```

| เรื่อง | กฎ |
|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` เก็บเป็น UTC แล้วแปลงตอนแสดง |
| วันเกิด วันครบกำหนด | `date` ล้วน **ห้ามมีเวลาและโซนเวลา** |
| "วันนี้" ในรายงาน | ต้องระบุว่าเป็นวันนี้ของเขตเวลาไหน รายงานยอดขายรายวันเพี้ยนเพราะข้อนี้บ่อยมาก |
| ช่วงเวลาทำการ | เก็บเป็น `time` + เขตเวลาของสาขา |

> **ไทยไม่มี daylight saving (ปรับเวลาตามฤดู) จึงไม่เคยเจอปัญหา จนถึงวันที่ขายให้ลูกค้าต่างประเทศ**
> โค้ดที่บวก 7 ชั่วโมงเองจะผิดทันทีที่มีผู้ใช้นอกประเทศ จึงต้องใช้ไลบรารีเขตเวลาเสมอ

---

## 3 · พุทธศักราช

**เก็บ ค.ศ. เสมอ แปลงเป็น พ.ศ. ตอนแสดงผลเท่านั้น** (`พ.ศ. = ค.ศ. + 543`)

| จุดที่ต้องระวัง | ทำยังไง |
|---|---|
| ผู้ใช้กรอก "2569" | รับเข้ามาแล้วแปลงเป็น 2026 ทันทีที่ชั้นรับข้อมูล |
| ปี 2 หลัก "69" | **ห้ามเดา** ให้บังคับกรอก 4 หลัก หรือถามให้ชัด · ถ้าสเปกบอกว่าเป็น พ.ศ. 2 หลักแน่ ๆ (เอกสารราชการ) ให้แปลง 2 ขั้นและเขียน test ไว้: `68 → 2568 → 2025` |
| นำเข้าไฟล์ Excel | ตรวจก่อนว่าคอลัมน์ปีเป็น พ.ศ. หรือ ค.ศ. ถ้าพลาด ปีจะเพี้ยน 543 ปีโดยไม่มี error |
| ส่งออกให้ระบบอื่น | ส่งเป็น ค.ศ. เสมอ เว้นแต่ปลายทางระบุว่าต้องการ พ.ศ. |
| เลขไทย ๒๕๖๙ | ใช้แสดงได้ แต่**ห้ามเก็บ** · แปลง ๐–๙ → 0–9 ที่ชั้นรับข้อมูลก่อน parse (ฟอร์มที่ผู้ใช้วางข้อความจากเอกสารราชการเจอบ่อย) |

**ถ้าระบบมีผู้ใช้ทั้ง 2 แบบ ให้ผู้ใช้เลือกปฏิทินได้** แต่ค่าที่เก็บยังเป็นแบบเดิม

**ตัวตรวจ** — เขียนสคริปต์สั้น ๆ กวาดโค้ดหา ข้อความไทยที่ฝังในโค้ดนอกไฟล์แปล · ตัวเลขปี 25xx ที่เขียนตายตัว · `new Date("…")` ที่รับสตริงไม่ระบุเขตเวลา แล้วรันใน CI ก่อน merge (แนวคิดจาก BV thai-date-format: ตัวแปลงต้องมี test ของมันเอง)

---

## 4 · การเรียงลำดับและการค้นหาภาษาไทย

การเรียงแบบมาตรฐาน (ตามรหัสอักขระ) **ผิดสำหรับภาษาไทย** เพราะสระหน้าอย่าง เ แ โ ใ ไ
อยู่หน้าพยัญชนะที่มันออกเสียงตาม

| ต้องการ | ทำยังไง |
|---|---|
| เรียงชื่อไทย | ใช้ collation ของภาษาไทย เช่น PostgreSQL `th-TH-x-icu` และ SQL Server `Thai_100_CI_AS` |
| เรียงชื่อไทยในแอป Flutter | Dart ไม่มี collation ไทยในตัว (`compareTo` เรียงตามรหัสอักขระ) จึงต้องใช้ `Collator` ของ platform ผ่าน plugin หรือ platform channel ถ้าไม่คุ้มให้เรียงตามเวลาที่สร้างแทนแล้วบอกผู้ใช้ (ยังไม่ได้ตรวจ package ที่ทำเรื่องนี้) |
| ค้นหาไม่สนตัวพิมพ์และวรรณยุกต์ | normalize ข้อความก่อน แล้วเก็บลงคอลัมน์ค้นหาที่แยกไว้ต่างหาก |
| ค้นหาคำกลางประโยค | ภาษาไทยไม่มีเว้นวรรค full-text search ที่แบ่งคำด้วยเว้นวรรคจึงใช้ไม่ได้ |

> **ภาษาไทยเขียนติดกันไม่มีเว้นวรรคระหว่างคำ** จึงกระทบ 3 เรื่อง:
> ค้นหา (ต้องมีตัวตัดคำ) · ตัดบรรทัด (เบราว์เซอร์ตัดกลางคำ) · ตัดข้อความด้วย `...`
>
> เรื่องตัดบรรทัด: เบราว์เซอร์หลักตัดคำไทยด้วยพจนานุกรมให้อยู่แล้ว **ห้ามใส่ `word-break: break-all`** เพราะจะตัดกลางคำ
> (`line-break: strict` เปลี่ยนแค่กฎเครื่องหมายวรรคตอนของจีน ญี่ปุ่น เกาหลี ไม่ช่วยภาษาไทย)
> แล้วทดสอบด้วยข้อความไทยจริง อย่าทดสอบด้วย Lorem ipsum เพราะมีเว้นวรรคทุกคำ
>
> Flutter `Text` ตัดบรรทัดไทยด้วยตัวตัดคำของ engine เอง และไม่มี CSS ให้ตั้ง
> จึงต้องตรวจด้วยข้อความไทยยาวจริงบนเครื่องจริงทั้ง 2 ขนาดจอ แล้วเผื่อ `maxLines` + `overflow: TextOverflow.ellipsis`

---

## 5 · ตัวเลข เงิน และหน่วย

| ข้อมูล | เก็บ | แสดง |
|---|---|---|
| เงิน | ทศนิยมแบบตรงตัว ไม่ใช่ float (ฐานข้อมูลใช้ `decimal(19,4)` ตาม `stack-sql`) + รหัสสกุลเงิน | `1,250.00 บาท` หรือ `฿1,250.00` |
| ตัวคั่นหลักพันและจุดทศนิยม | ไม่เก็บ | ตามท้องถิ่น บางประเทศใช้สลับกับไทย |
| เปอร์เซ็นต์ | เก็บเป็นสัดส่วนทศนิยม (`0.075`) หรือ basis points (`750` = 7.5%) **เลือกแบบเดียวทั้งระบบ** · ห้ามเก็บเป็นจำนวนเต็มเปอร์เซ็นต์ เพราะ 7.5% จะกลายเป็น 7 หรือ 8 | `7.5%` |
| ที่อยู่ | แยกฟิลด์ตามโครงของไทย (แขวง/เขต หรือ ตำบล/อำเภอ) | |
| เบอร์โทร | เก็บรูปแบบสากล `+66812345678` | แสดง `081-234-5678` |

**พหูพจน์และเพศ** — ภาษาไทยไม่มีรูปพหูพจน์ แต่ภาษาอังกฤษมี
จึงควรให้ไลบรารีจัดการ อย่าเขียน `if (count > 1)` เอง เพราะบางภาษามีมากกว่า 2 รูป

---

## 6 · หน้าจอ

| เรื่อง | กฎ |
|---|---|
| ความยาวข้อความ | อังกฤษยาวกว่าไทยได้ถึง 1.5 เท่า จึงต้อง**เผื่อที่ อย่าตรึงความกว้างปุ่ม** |
| ความสูงบรรทัด | ไทยต้องการมากกว่า เพราะมีสระบนและวรรณยุกต์ซ้อนกัน 2 ชั้น |
| ฟอนต์ | ต้องมีน้ำหนักครบทั้งไทยและอังกฤษ ไม่งั้นระบบจะวาดตัวหนาปลอมขึ้นเอง |
| ทดสอบ | ทดสอบด้วยข้อความจริงของทั้ง 2 ภาษา **ไม่ใช่ Lorem ipsum** |
| สลับภาษา | จำค่าไว้ที่โปรไฟล์ผู้ใช้ ไม่ใช่แค่ใน session ส่วนแอปที่ไม่มีบัญชีผู้ใช้ (แอปมือถือออฟไลน์) ให้เก็บค่าในเครื่อง โดยค่าเริ่มต้นคือ "ตามภาษาของเครื่อง" |
| ส่งออก CSV ให้คนไทยเปิดใน Excel | ใช้ UTF-8 แบบ**มี BOM** (ไม่งั้นไทยเพี้ยน) ทศนิยมใช้ `.` และเวลาเป็น ISO 8601 UTC เช่น `2026-10-05T03:15:00Z` ดูเพิ่มที่ `data-import-export` |

---

## 7 · Anti-patterns

- **ข้อความฝังในโค้ด** เพราะ "ตอนนี้มีภาษาเดียว"
- **ต่อประโยคจากชิ้นส่วน** — ภาษาอื่นเรียงคำคนละแบบ
- **เก็บ พ.ศ. ลงฐานข้อมูล** — ทุกฟังก์ชันจะคำนวณช่วงเวลาผิด
- **บวก 7 ชั่วโมงเองในโค้ด** — พังทันทีที่มีผู้ใช้นอกเขตเวลาไทย
- **เรียงชื่อไทยด้วย collation มาตรฐาน** — ลำดับผิดโดยไม่มี error
- **ทดสอบหน้าจอด้วย Lorem ipsum** — ไม่เจอปัญหาการตัดบรรทัดของไทยเลย
- **`if (count > 1) "s"`** — ใช้ได้แค่ภาษาอังกฤษ
- **ปี 2 หลัก** — "69" คือ 1969, 2069 หรือ 2569
- **นำเข้า Excel โดยไม่ถามว่าปีเป็น พ.ศ. หรือ ค.ศ.** — ปีเพี้ยน 543 ปีโดยไม่มีอะไรเตือน
- **คีย์แปลที่หายแล้วแสดงค่าว่าง** — ได้ปุ่มเปล่าที่ไม่มีใครสังเกต

---

## 8 · ตัวย่อ

- **i18n** — internationalization (การทำให้รองรับหลายภาษาและท้องถิ่น ที่ย่อแบบนี้เพราะมีตัวอักษร 18 ตัวระหว่าง i กับ n)
- **locale** — ชุดค่าประจำท้องถิ่น ได้แก่ ภาษา รูปแบบวันที่ ตัวเลข และสกุลเงิน
- **collation** — กฎการเรียงลำดับและเปรียบเทียบข้อความของฐานข้อมูล
- **UTC** — Coordinated Universal Time (เวลามาตรฐานสากล ไทยคือ UTC+7)
- **ICU** — International Components for Unicode (ไลบรารีมาตรฐานสำหรับกฎภาษาและการเรียงลำดับ)
- **BCP 47** — Best Current Practice (BCP) 47 มาตรฐานรหัสภาษา เช่น `th-TH`, `en-US`
- **ARB** — Application Resource Bundle (ไฟล์ข้อความแปลแบบ JSON ที่ Flutter `gen-l10n` ใช้)
- **BOM** — Byte Order Mark (3 ไบต์ต้นไฟล์ที่บอก Excel ว่าเป็น UTF-8)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ชนิดข้อมูลวันเวลาและ collation | `database-design` |
| รูปแบบวันเวลาและเงินใน JSON | `api-conventions` |
| ข้อความ error ที่ต้องแปล | `error-handling-patterns` |
| ฟอนต์ไทยบนหน้าจอ | `ui-craft` + skill แพลตฟอร์ม |
| ฟอนต์ไทยในเอกสารและสไลด์ | `branded-document-design` · `presentation-design` |
| นำเข้าไฟล์ที่ปีเป็น พ.ศ. · ส่งออก CSV ที่ Excel เปิดแล้วไทยไม่เพี้ยน | `data-import-export` |
| แม่แบบข้อความแจ้งเตือนหลายภาษา | `notifications` |
| แปลเอกสารหรือข้อความหน้าจอทั้งชุด ไทย↔อังกฤษ · glossary ต่อโปรเจกต์ | `translate-th-en` (plugin `superuser`) |
| ตัดคำ · ถอดเสียงเป็นอักษรโรมัน · ตรวจเลขบัตรประชาชน ในโค้ด | [`references/thai-text-tools.md`](references/thai-text-tools.md) |


## reference: thai-text-tools.md

# Thai text processing tools — only what was checked against official docs (2026-10-23)

Use together with `i18n-and-locale` (store a neutral value, convert at display time) and `translate-th-en` (plugin `superuser`) · every item is `จากแหล่ง` (from a source) except those with a label

## Word segmentation, transliteration, dates, numbers — PyThaiNLP (Python · Apache-2.0)

| Task | Function | Note |
|---|---|---|
| Word segmentation | `pythainlp.tokenize.word_tokenize(text, engine="newmm")` | default `newmm` (dictionary + maximal matching) · other engines `attacut` `deepcut` `icu` `longest` `nlpo3` · pass `custom_dict` as a Trie for project-specific terms |
| Romanization by the Royal Institute (RTGS) | `pythainlp.transliterate.romanize(text, engine="royin")` | default `royin` = RTGS · use for slugs and names whose owner has no English spelling yet (for personal names always use the owner's own spelling first) |
| Thai dates | `pythainlp.util.thai_strftime(dt, "%-d %b %y")` · `thai_strptime(text, fmt, year="be")` · `convert_years(year, src="be", target="ad")` | Thai month names and Buddhist Era years at display time · always store as Common Era in the system |
| Numbers as words | `pythainlp.util.bahttext(1500.50)` · `num_to_thaiword(n)` · `thaiword_to_num(s)` · `thai_digit_to_arabic_digit(s)` | `bahttext` gives "หนึ่งพันห้าร้อยบาทห้าสิบสตางค์", used in quotations and receipts |
| Clean text | `pythainlp.util.normalize(text)` | removes zero-width characters · repeated spaces · repeated vowels · stray marks — run before comparing or storing, and store as Unicode NFC |

Source: [pythainlp.org/docs/5.1](https://pythainlp.org/docs/5.1/) (api/tokenize · api/transliterate · api/util) · viewed 2026-10-23 · license Apache-2.0 per the foot of the docs page (the LICENSE file in the repo was not opened)

## 13-digit Thai national ID number — check the checksum

- Formula: digits 1–12 multiplied by weights 13 down to 2 and summed · `r = sum mod 11` · check digit = `(11 − r) mod 10` must equal digit 13
- PyThaiNLP **does not have** this function (the util index was checked) · use `python-stdnum` module `stdnum.th.pin` (`validate` · `is_valid` · `calc_check_digit` · version 2.2 · LGPL-2.1+) — [arthurdejong.org/python-stdnum/doc/stdnum.th.pin](https://arthurdejong.org/python-stdnum/doc/stdnum.th.pin) · or the `thai-id-validate` script (validate.py · validate.ts · MIT) in [Boom-Vitt/claude-thai-skills](https://github.com/Boom-Vitt/claude-thai-skills)
- JavaScript: the npm package `thai-id-validator` (no dependencies · license not checked) · the 4-line formula can be written yourself, no need to install
- A passing checksum = the format is right, not that this number really exists · an ID number is personal data; store and log it per `pdpa-compliance`

## Thai addresses — split into fields

- No general library has been verified to split Thai addresses completely (other libraries not checked) · one with code and tests: `thai-address` (parse.py · parse.ts · MIT · 11 fields · a table of 77 provinces and postal code → province) in Boom-Vitt/claude-thai-skills — the author states it is not for routing deliveries
- A safer way in a form: let the user pick province → district → subdistrict from a list, and fill the postal code automatically · store in separate fields from the start, not as one line to split later

## Sorting, counting length, truncating text

- Do not sort Thai by codepoint · use ICU: JavaScript `new Intl.Collator("th")` · PostgreSQL collation `th-TH-x-icu` · MySQL `utf8mb4_thai_520_w2`
- Count length and truncate at grapheme cluster boundaries (vowels and tone marks are not separated from the consonant): JavaScript `Intl.Segmenter("th", { granularity: "grapheme" })` · Python regex `\X` · to cut at a word boundary, run `word_tokenize` first
- Old files encoded in TIS-620 / cp874 must be decoded first (`pandas.read_csv(..., encoding="cp874")`) · `chardet` often guesses wrong on short Thai text

Source for the last 3 sections: `thai-text-processing` and `thai-id-validate` `thai-address` in Boom-Vitt/claude-thai-skills (MIT · viewed 2026-10-23) · reworded, not copied


---

# skill: project-bootstrap

Use when starting a repository or setting up a new machine

# ตั้งต้นโปรเจกต์

> **กฎข้อเดียว:** คนที่ไม่เคยเห็นโปรเจกต์นี้มาก่อน ต้องรันได้ภายใน **30 นาที**
> โดยอ่านแค่ `README.md` และไม่ต้องถามใคร

## เมื่อไหร่ใช้ skill นี้

เริ่ม repository ใหม่ · คนใหม่ใช้ครึ่งวันกว่าจะรันได้ · pull request diff ทั้งไฟล์เพราะตัวจัดรูปแบบไม่ตรงกัน · ไม่มีใครรู้ว่าเอกสารอยู่ไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ตั้ง pipeline build และ deploy | `cicd-and-release` |
| ค่าตั้งต่อ environment และ secret | `config-and-secrets` |
| เลือกสถาปัตยกรรม | `architecture-patterns` |
| ตั้ง test framework | `testing-standards` |
| ตั้งชื่อเอกสาร | `document-naming` |

---

## 1 · โครงโฟลเดอร์

**ราก (โฟลเดอร์ที่ผู้ใช้เปิด) จัดตาม `project-doc-set` ข้อ 1 แบบ B** — ผังราก แบบ ecosystem และที่อยู่ไฟล์ของ SuperUser (`.claude/superuser/`) อยู่ที่นั่นที่เดียว · โค้ดอยู่ใน `<project-name>/` โครงข้างในเป็นแบบนี้:

ใน `<project-name>/` (ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-`): `README.md` (ข้อ 2) · `CHANGELOG.md` · `ARCHITECTURE.md` · `CONTRIBUTING.md` · `LICENSE` (3 ตัวนี้เมื่อมีเงื่อนไขใน `references/readme-skeleton.md` หัวข้อ 2) · `.env.example` (เฉพาะเมื่ออ่าน environment variable จริง · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · ค่าลับ · `_to_delete/`) · `src/` (unit test อยู่ข้างไฟล์โค้ด · `readable-code` ข้อ 7) · `tests/` (เฉพาะ integration · e2e หรือ stack ที่เครื่องมือบังคับ ดูตารางข้อ 1) · `scripts/` (setup · seed · migrate) — ผังพร้อมคำอธิบาย [`references/code-folder.md`](references/code-folder.md) · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ในโฟลเดอร์โค้ด (`project-doc-set` ข้อ 1)

**ชื่อโฟลเดอร์โค้ด** — เอาชื่อโฟลเดอร์โปรเจกต์มาทำเป็นตัวพิมพ์เล็ก เว้นวรรคและเครื่องหมายเปลี่ยนเป็น `-` ตัวเดียว:
`Lumio - Light Meter/` → `lumio-light-meter/`
คำสั่ง build test และ run ทุกตัวรันจากในโฟลเดอร์นี้ ส่วนชื่อแพ็กเกจในภาษาที่บังคับรูปแบบ (Dart `name:` ใน pubspec · Python package) ยังตั้งตามกฎของภาษา เพราะกฎนี้คุมแค่ชื่อโฟลเดอร์

**กฎของราก (ชั้นบนสุดของโฟลเดอร์โปรเจกต์):**
- มีแค่ของในผัง `project-doc-set` ข้อ 1 · ข้อยกเว้นประกาศใน README ของโปรเจกต์ · README, CHANGELOG และไฟล์ตั้งค่าอยู่ใน repo · `.docx`/`.xlsx` ที่ได้รับมาอยู่ `ref/` ที่เราเขียนอยู่ `docs/`
- **ของชั่วคราวไม่เคยอยู่ที่ราก** — ถ้าไฟล์ชั่วคราวที่ agent สร้างไปตกที่ราก ให้ย้ายเข้า `_to_delete/` ทันที
- ถ้า build แล้วมีโฟลเดอร์งอกที่ราก (เช่น `build/` `lib/` ว่างหลังย้ายโค้ด) แปลว่า cache ของเครื่องมือยังจำ path เก่า ให้ล้าง cache (`flutter clean` · ลบ `obj/`) แล้ว build ใหม่
- ชื่อโฟลเดอร์และไฟล์ใน repo เป็นตัวพิมพ์เล็กคั่นด้วยขีดกลาง ไม่มีเว้นวรรค **ยกเว้นภาษาที่มีธรรมเนียมของตัวเอง** ให้ตามภาษานั้น

**ข้อยกเว้นตาม stack** — ชื่อโฟลเดอร์โค้ด โฟลเดอร์ทดสอบ และชื่อไฟล์ใน repo ใช้ตามที่เครื่องมือของภาษาคาดไว้
ไม่ฝืนให้เป็น `src/` · ปกติไฟล์ทดสอบอยู่ข้างไฟล์โค้ด ใช้โฟลเดอร์ทดสอบแยกเฉพาะ stack ที่เครื่องมือบังคับ (ช่องที่เขียนว่า **บังคับ**):

| Stack | โค้ด | ทดสอบ | ชื่อไฟล์ |
|---|---|---|---|
| Node | `src/` | unit test ข้างไฟล์โค้ด (`*.test.ts`) · integration และ e2e ไว้ใน `tests/` | `kebab-case` |
| .NET | `src/` | `tests/` **บังคับ** (โปรเจกต์ทดสอบแยก `.csproj`) | `PascalCase.cs` |
| Python | `src/<package>/` | unit test ข้างไฟล์โค้ด (`test_*.py`) · integration และ e2e ไว้ใน `tests/` | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` **บังคับ** (โครงเหมือน `lib/`) | `snake_case.dart` (lint `file_names`) · `android/` `ios/` อยู่ใน repo |

skill อื่นที่เขียน `tests/` หรือ `test/` ให้อ่านว่า "โฟลเดอร์ทดสอบของ stack นั้น" แล้วเลือกชื่อเดียวใช้ทั้ง repo

**แบบ A** (ใช้เมื่อผู้ใช้ขอเท่านั้น · ข้อนี้คือเจ้าของผัง) — เพิ่ม `<project-name>/docs/` ในโฟลเดอร์โค้ด เป็น markdown ล้วน ผังข้างในเหมือน `docs/` ของแบบ B (`README.md` สารบัญ · `decisions/ADR-NNNN-<slug>.md` · `runbook-<เรื่อง>.md` · `research/`) ไม่มี `.docx` หรือ PNG ส่งมอบ · ส่วนที่เหลือของรากยังตามผัง `project-doc-set` ข้อ 1 โดยไม่มี `docs/` ที่ราก

**`docs/README.md` คือสารบัญ ไม่ใช่เนื้อหา:**

แม่แบบ → `assets/starter-files.md` (คอลัมน์ เอกสาร · อ่านเมื่อ · เจ้าของ · อัปเดตล่าสุด)

---

## 2 · README — โครงกว้าง แล้วสำรวจโปรเจกต์ก่อนเลือกหัวข้อ

README ของแต่ละงานไม่เหมือนกัน · แอปเว็บ · library · CLI (Command-Line Interface) · แอปมือถือ · monorepo · infra หรือสคริปต์ ต้องการหัวข้อและคำสั่งต่างกัน จึงทำ 3 ชั้น:

**ชั้น 1 · โครงกว้าง (ตายตัว)** — README ต้องตอบคำถามเหล่านี้ให้คนใหม่ ตามลำดับที่ต้องใช้:
นี่คืออะไร ใครใช้ → ต้องมีอะไรบนเครื่อง → ติดตั้งและรัน → ตั้งค่า → คำสั่งที่ใช้บ่อย (test) → โครงสร้างโปรเจกต์ → สถาปัตยกรรม → build → deploy → ติดปัญหา → ร่วมพัฒนา → ติดต่อ → สัญญาอนุญาต
คำถามไหนไม่มีของในโปรเจกต์ ตัดทิ้ง ยกเว้น "ตั้งค่า" ที่ต้องบอกว่าไม่มีค่าตั้งภายนอก

**ชั้น 2 · สำรวจก่อนเขียน (ทุกครั้ง)** — จดผลลง `_to_delete/readme-survey.md` แล้วใช้ตัดสินชั้น 3
1. **อ่านโปรเจกต์:** ไฟล์ประกาศแพ็กเกจ (`package.json` · `*.csproj` · `pyproject.toml` · `pubspec.yaml` ฯลฯ) · ไฟล์ปักรุ่น · `Dockerfile` / `compose` · ไฟล์ CI (Continuous Integration) · `Makefile` / สคริปต์ · `.env.example` · โฟลเดอร์บนสุด → ได้ประเภทงาน stack คำสั่งที่มีอยู่จริง และส่วนประกอบของระบบ (`code-orientation` ถ้าโค้ดเยอะ)
2. **ค้นเอกสารทางการของ stack นั้น** (`research-with-sources`): คำสั่งติดตั้ง รัน test build และไฟล์ที่ควร commit ของรุ่นที่โปรเจกต์ใช้ · ห้ามเอาคำสั่งจากความจำหรือจากตารางสำรองลง README โดยไม่ตรวจ
3. **ดู README ของโปรเจกต์ดังประเภทเดียวกัน 2–3 ตัว** (ค้นด้วยประเภทงาน + stack) เพื่อดูว่าวงการนั้นคนอ่านคาดหวังหัวข้อไหนเพิ่ม เช่น library มีตัวอย่างโค้ดและตารางรุ่นที่รองรับ · CLI มีตัวเลือกคำสั่ง · infra มีสิ่งที่ต้องเตรียมในบัญชี cloud · แอปมือถือมี flavor และวิธีเซ็นแอป
4. ค้นไม่ได้ (ไม่มีเน็ต) → ใช้ชั้น 3 ค่าสำรอง แล้วติด `(รอยืนยัน)` ที่คำสั่งที่ยังไม่ได้ตรวจ

**ชั้น 3 · เลือกหัวข้อและคำสั่ง** — จัดหัวข้อจากชั้น 1 + หัวข้อเพิ่มที่ได้จากข้อ 3 · คำสั่งจากข้อ 1–2 · ตารางเต็ม (ตอบอะไร · ยาวแค่ไหน · ยาวเกินย้ายไปไหน) → [`references/readme-skeleton.md`](references/readme-skeleton.md) เป็นค่าสำรองและเกณฑ์ความยาว ไม่ใช่รายการที่ต้องมีครบ

- **README มีแค่สิ่งที่คนใหม่ใช้ใน 30 นาทีแรก** — ยาวเกินย้ายไป `ARCHITECTURE.md` · `CONTRIBUTING.md` · `docs/runbook-deploy.md` แล้วลิงก์กลับ (ตาราง "แยกไปไฟล์อื่น" และแม่แบบ `ARCHITECTURE.md` ในไฟล์เดียวกัน)
- **ตารางสำรองตามภาษา** (Node · .NET · Python · Java · Go · Flutter · Rust · Laravel) → [`references/readme-by-stack.md`](references/readme-by-stack.md) · ใช้เป็นจุดตั้งต้นของคำค้นในชั้น 2 ข้อ 2 · stack ที่ไม่อยู่ในตาราง ค้นจากเอกสารทางการตรง ๆ
- แม่แบบที่คัดลอกไปใช้ (Node · Flutter / Android) → `assets/starter-files.md` · แอปที่ไม่มี DB หรือ Docker ก็ต้องบอกของบนเครื่องให้ครบ

> **ทุกคำสั่งต้องเคยรันจริงบนเครื่องเปล่า** เพราะ README ส่วนใหญ่ผิดตรงที่คนเขียน
> มีของครบอยู่แล้วบนเครื่องตัวเอง จึงไม่เห็นว่ามีขั้นตอนที่หายไป
>
> **1 คำสั่งติดตั้ง 1 คำสั่งรัน** — ถ้ามี 12 ขั้นตอน ให้เขียนเป็น `scripts/setup.sh`

---

## 3 · CHANGELOG

รูปแบบ Keep a Changelog 1.1.0 · หัวข้อในแต่ละรุ่นเรียงแบบนี้ ตัดหัวข้อที่ไม่มีของ: **เปลี่ยนที่ทำให้ของเดิมพัง** (ของเราเพิ่ม อยู่บนสุดเสมอ) · เพิ่ม · เปลี่ยน · จะเลิกใช้ · เอาออก · แก้ · ความปลอดภัย · มี `[ยังไม่ปล่อย]` รอไว้บนสุดเสมอ · รุ่นใหม่อยู่บน วันที่แบบ `YYYY-MM-DD` — ตัวอย่างเต็ม [`references/changelog-examples.md`](references/changelog-examples.md)

**ต้องมี CHANGELOG ไหม**

| สถานการณ์ | CHANGELOG |
|---|---|
| ส่งงานให้ลูกค้า มีรอบ UAT หรือมีเลขเวอร์ชัน | ต้องมี — ลูกค้าและผู้ตรวจรับดูว่ารอบนี้ได้อะไร |
| คนอื่นเรียกใช้ (API · library · แอปที่มีผู้ใช้) | ต้องมี — เขารู้ว่าต้องแก้อะไรฝั่งตัวเองไหม |
| ต้นแบบ · สคริปต์ส่วนตัว · ทำคนเดียวและไม่มีรอบปล่อย | ไม่ต้อง — `git log` พอ · เขียนเหตุผลไว้ใน README |

**เขียนให้คนใช้งานอ่าน** — 1 ข้อ 1 บรรทัด บอกผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit ชื่อไฟล์หรือเลข ticket · งานที่มองไม่เห็นไม่ใส่ เว้นแต่รู้สึกได้ · "เปลี่ยนที่ทำให้ของเดิมพัง" อยู่บนสุดเสมอ · กฎเต็มและตัวอย่าง ผิด → ถูก ใน [`references/changelog-examples.md`](references/changelog-examples.md)
- เลขเวอร์ชันและกฎการขึ้นเลข ดู `cicd-and-release`

---

## 4 · ตัวจัดรูปแบบและ linter — จบการเถียงเรื่องสไตล์

- `.editorconfig` (เว้นวรรค · ตัวขึ้นบรรทัด · encoding) ทุกภาษา · แม่แบบพร้อม `.gitattributes` → `assets/starter-files.md`
- ตัวจัดรูปแบบจัดสไตล์ตอนบันทึก (Prettier · dotnet format · black/ruff · `dart format`) · linter จับของที่ผิดจริงเท่านั้น (ESLint · analyzer ของ .NET · ruff · `flutter analyze`)
- ตั้ง `end_of_line = lf` และ `.gitattributes` `* text=auto eol=lf` — ไม่งั้นทีมที่ใช้ Windows ปนระบบอื่นจะเจอ pull request ที่ diff ทั้งไฟล์
- **ตัวจัดรูปแบบตัดสินใจแทนคน** จะเลือกค่าไหนก็ได้ แต่ต้องเป็นค่าเดียวกันทั้งทีม
- ให้ CI ตรวจด้วย ไม่ใช่พึ่งว่าทุกคนตั้งเครื่องเหมือนกัน
- เวลาเปิดใช้กับโปรเจกต์เก่า ให้จัดรูปแบบทั้ง repo ใน **commit เดียวที่ไม่มีอย่างอื่นปน**
  แล้วใส่ commit นั้นใน `.git-blame-ignore-revs`

---

## 5 · Dependency

- **commit lock file เสมอ** และติดตั้งบน CI ด้วยคำสั่งที่ยึด lock (`npm ci` · `flutter pub get --enforce-lockfile`) ไม่งั้น build แต่ละวันได้คนละชุด
- ตรวจช่องโหว่ใน pipeline (`cicd-and-release`) · อัปเดตเป็นรอบ: patch เดือนละครั้ง minor ไตรมาสละครั้ง ไม่ใช่รอพัง
- dependency ใหม่ต้องมีเหตุผลใน pull request (`lazy-coding`)

**ก่อนเพิ่มไลบรารี ถาม 3 ข้อ** — มาตรฐานของภาษาทำได้ไหม โครงการยังมีชีวิตอยู่ไหม และ
สัญญาอนุญาตใช้ได้กับงานที่ขายไหม (ดู `prior-art-review`)

---

## 6 · รายการตรวจเมื่อเปิดโปรเจกต์ใหม่

ติ๊ก `[x]` เฉพาะข้อที่**รันหรือเปิดดูแล้วในรอบนี้** ข้อที่ยังไม่ได้สร้างหรือยังไม่ได้รัน ให้ใส่ `[ ]` พร้อมบอกว่าค้างอะไร ส่วนข้อที่ไม่เกี่ยวกับโปรเจกต์นี้ ให้ใส่ `N/A — <เหตุผล>`

- [ ] `README.md` ตอบคำถามในชั้น 1 ที่โปรเจกต์มีของครบ · หัวข้อและคำสั่งมาจากผลสำรวจชั้น 2 (มี `_to_delete/readme-survey.md`) · คำสั่งเคยรันจริงบนเครื่องเปล่า
- [ ] รากตรงผังใน `project-doc-set` ข้อ 1 (repo ชื่อโปรเจกต์ตัวเล็กคั่น `-` · ecosystem ใช้ `ecosystem/`) และไม่มีไฟล์ชั่วคราวหรือ `.docx` ที่ราก
- [ ] `.env.example` มีค่าครบทุกตัวพร้อมคอมเมนต์ ถ้าโปรเจกต์ไม่อ่าน environment variable เลย (เช่นแอปมือถือออฟไลน์) ก็ไม่ต้องสร้าง แต่ให้เขียนใน README ว่า "ไม่มีค่าตั้งภายนอก"
- [ ] `.editorconfig` · `.gitattributes` · ตัวจัดรูปแบบ · linter ตั้งแล้ว และ CI ตรวจ
- [ ] `.gitignore` ครอบคลุม `.env` · โฟลเดอร์ build · `_to_delete/` · Android: `key.properties` · `*.jks` · `*.keystore`
- [ ] `docs/README.md` เป็นสารบัญ พร้อมเจ้าของแต่ละเอกสาร
- [ ] `CHANGELOG.md` มีหัวข้อ "ยังไม่ปล่อย" รออยู่
- [ ] test อย่างน้อย 1 ตัวที่รันผ่าน เพื่อพิสูจน์ว่าโครงใช้ได้
- [ ] `main` ถูกป้องกัน ต้องผ่าน pull request และ CI ส่วน repo ที่ยังไม่มี remote หรือทำคนเดียวข้ามข้อนี้ได้ แต่ต้องเขียนเหตุผลไว้ใน README และรัน test กับ linter ก่อน commit แทน
- [ ] **ให้คนที่ไม่ได้ตั้งโปรเจกต์ลองทำตาม README แล้วจับเวลา**

---

## 7 · Anti-patterns

ผิด: README มีแต่ชื่อ · คำสั่งที่ไม่เคยรันบนเครื่องเปล่า · "ขอ `.env` จากพี่คนนั้น" (ไม่มี `.env.example`) · ไม่ commit lock file · ไม่มี `.editorconfig` · linter เถียงเรื่องสไตล์ · ไฟล์ทดลองที่ราก (`test.js` `backup_final.zip`) · เอกสารกระจายในแชตและ Drive ไม่มีสารบัญ · CHANGELOG ที่ก๊อปรายการ commit


## 8 · ตัวย่อ

**lock file** ไฟล์ตรึงเวอร์ชัน dependency · **linter** ตัวตรวจโค้ดหาของที่น่าจะผิด · **formatter** ตัวจัดรูปแบบอัตโนมัติ · **LF** Line Feed ตัวขึ้นบรรทัดแบบ Unix (Windows ใช้ CRLF) · **CI** Continuous Integration การตรวจอัตโนมัติทุกครั้งที่รวมโค้ด

## 9 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: ของชั่วคราว → `temp-file-discipline` · commit ที่สร้าง CHANGELOG ได้ → `commit-message-format` · ก่อนเพิ่ม dependency → `lazy-coding` · `prior-art-review` · แม่แบบไฟล์ทั้งหมด → `assets/starter-files.md`


## reference: changelog-examples.md

# CHANGELOG — ตัวอย่าง

อ่านเมื่อเขียน CHANGELOG ครั้งแรกหรือรีวิว · กฎอยู่ใน `SKILL.md` ข้อ 3 · แม่แบบเปล่าอยู่ใน `assets/starter-files.md`

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
### เพิ่ม
- แจ้งเตือนทาง LINE
### จะเลิกใช้
- ส่งออกรายงานเป็น CSV จะเอาออกในรุ่น 2.0 — ใช้ Excel แทน
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### ความปลอดภัย
- ผู้ใช้ที่ถูกปิดบัญชีเปิดลิงก์ใบเสร็จเก่าไม่ได้แล้ว

## [1.1.1] — 2026-09-10 [ถอน]
```

## หัวข้อและเลขรุ่น

| หัวข้อ (Keep a Changelog) | ใช้กับ | ขึ้นเลขรุ่นส่วนไหน (Semantic Versioning) |
|---|---|---|
| เปลี่ยนที่ทำให้ของเดิมพัง (ของเราเพิ่ม) | ผู้ใช้หรือระบบที่เรียกใช้ต้องแก้ฝั่งตัวเอง | MAJOR · ช่วง `0.y.z` ขึ้น MINOR ได้ |
| เพิ่ม (Added) | ความสามารถใหม่ | MINOR |
| เปลี่ยน (Changed) | ของเดิมทำงานต่างไปแต่ไม่พัง | MINOR |
| จะเลิกใช้ (Deprecated) | ยังใช้ได้ แต่จะเอาออก · บอกรุ่นที่จะเอาออกและของที่ใช้แทน | MINOR |
| เอาออก (Removed) | เอาออกแล้ว | MAJOR |
| แก้ (Fixed) | บั๊ก | PATCH |
| ความปลอดภัย (Security) | ช่องโหว่ที่ปิดแล้ว · ไม่บอกวิธีโจมตี | PATCH หรือตามขนาด |

คอลัมน์ขึ้นเลขรุ่นเป็นข้อเสนอของ skill นี้ · Semantic Versioning บอกไว้แค่ MAJOR = ไม่เข้ากับของเดิม · MINOR = เพิ่มหรือประกาศเลิกใช้แบบเข้ากันได้ · PATCH = แก้บั๊กแบบเข้ากันได้

รุ่นที่ปล่อยไปแล้วต้องถอนเพราะบั๊กร้ายหรือช่องโหว่ → ต่อท้ายหัวรุ่นด้วย `[ถอน]` (Keep a Changelog ใช้ `[YANKED]`) ไม่ลบรุ่นนั้นทิ้ง · แหล่ง: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning 2.0.0](https://semver.org/) · เปิดอ่าน 2026-11-07

เขียนเป็นผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit:

| ✗ | ✓ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## กฎการเขียน (ฉบับเต็ม)

- เขียนให้**คนใช้งาน**อ่าน ไม่ใช่คัดลอกรายการ commit มาวาง
- 1 ข้อ = 1 บรรทัด บอกว่าผู้ใช้ได้อะไรหรือเห็นอะไรเปลี่ยน ไม่ใช่ว่าแก้ไฟล์ไหน
- ไม่ใส่ชื่อไฟล์ ชื่อฟังก์ชัน หรือเลข ticket ยกเว้นผู้อ่านเป็นนักพัฒนาที่เรียก API นั้น
- ไม่ใส่งานที่ผู้ใช้มองไม่เห็น เช่น ปรับโครงโค้ด เพิ่ม test หรือแก้ CI · ยกเว้นทำให้เร็วขึ้นหรือเสถียรขึ้นจนรู้สึกได้ ให้เขียนเป็นผลที่ได้ ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที")
- ในแต่ละหัวข้อ เรียงข้อที่กระทบผู้ใช้มากที่สุดไว้บน · หัวข้อไหนไม่มีของให้ตัดหัวข้อนั้นทิ้ง
- หัวข้อ "เปลี่ยนที่ทำให้ของเดิมพัง" ต้องอยู่**บนสุด**ของเวอร์ชันนั้นเสมอ · ทุกการเลิกใช้ เอาออก และเปลี่ยนที่ทำให้พัง ต้องลงทุกครั้ง แม้เป็นเรื่องเล็ก


## reference: code-folder.md

# โครงในโฟลเดอร์โค้ด — ผังเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 1 · ผังรากอยู่ใน `project-doc-set` ข้อ 1 · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ที่นี่

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · โครงกว้าง + สำรวจโปรเจกต์ก่อนเลือกหัวข้อ
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  ARCHITECTURE.md        ← แผนที่โค้ด · มีเมื่อผังใน README เกิน 15 บรรทัดหรือระบบมีหลายส่วน (references/readme-skeleton.md)
  CONTRIBUTING.md        ← มีเมื่อหัวข้อร่วมพัฒนาใน README ยาวเกิน 5 บรรทัด
  LICENSE                ← repo เปิดสาธารณะหรือสัญญาจ้างระบุ
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ใน `SKILL.md` ข้อ 1)
  tests/                 ← บังคับใน .NET · Flutter (`test/`) · Node และ Python ใช้เก็บเฉพาะ integration และ e2e (unit test อยู่ข้างไฟล์โค้ด) — ตาราง stack อยู่ใน `SKILL.md` ข้อ 1
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```


## reference: readme-by-stack.md

# README ตามภาษา — คำสั่ง ไฟล์ และหัวข้อที่ต้องเพิ่ม

ใช้คู่กับ [`readme-skeleton.md`](readme-skeleton.md) · ตารางนี้เป็นค่าสำรองและจุดตั้งต้นของคำค้น (`SKILL.md` ข้อ 2 ชั้น 2) ไม่ใช่คำสั่งที่ใส่ได้ทันที · คำสั่งจริงเอาจากไฟล์ในโปรเจกต์และเอกสารทางการของรุ่นที่ใช้ **ทุกคำสั่งต้องรันจริงบนเครื่องเปล่าก่อนลง README** (`SKILL.md` ข้อ 2) · ช่องที่มี ※ คือยังไม่ได้เปิดหน้าทางการยืนยันในรอบที่เขียน (2026-11-07)

## 1 · รุ่น ไฟล์หลัก และค่าตั้งตาม environment

ใส่ลงหัวข้อ 4 "ต้องมีบนเครื่อง" และหัวข้อ 6 "ตั้งค่า" ของ README

| Stack | manifest + lock (commit ทั้งคู่) | ปักรุ่น runtime ที่ไฟล์ | ค่าตั้งตาม environment |
|---|---|---|---|
| Node / TypeScript | `package.json` + `package-lock.json` หรือ `pnpm-lock.yaml` (lock แบบเดียว) | `.nvmrc` (`nvm use`) · `engines` ใน `package.json` เป็นแค่คำเตือนจนกว่าจะเปิด `engine-strict` | Vite: `.env` · `.env.[mode]` · `.env.local` · มีแค่ `VITE_*` ที่ถึง browser · Angular: `src/environments/` + `ng build --configuration <ชื่อ>` |
| .NET / C# | `.sln` หรือ `.slnx` + `.csproj` · `packages.lock.json` ไม่บังคับ ※ | `global.json` → `sdk.version` (เลขเต็ม) + `rollForward` (ใช้ lock file ให้ตั้ง `disable`) | `appsettings.json` + `appsettings.{Env}.json` · เลือกด้วย `ASPNETCORE_ENVIRONMENT` (เว็บ) หรือ `DOTNET_ENVIRONMENT` · ไม่ตั้ง = Production · ค่าลับตอน dev: `dotnet user-secrets` · `launchSettings.json` ใช้แค่เครื่อง dev |
| Python | `pyproject.toml` + `uv.lock` · ไม่ commit `.venv` | `.python-version` (`uv python pin`) + `requires-python` | ไม่มีมาตรฐานกลาง · `.env` + environment variable หรือ settings ของ framework ※ |
| Java / Kotlin | `pom.xml` หรือ `build.gradle.kts` + `settings.gradle.kts` | Gradle wrapper (commit `gradlew` `gradlew.bat` `gradle/wrapper/*`) · Maven wrapper `mvnw` ※ · รุ่น Java Development Kit (JDK) | Spring Boot: `application.yml` + `application-{profile}.yml` · เปิดด้วย `SPRING_PROFILES_ACTIVE` หรือ `--spring.profiles.active=prod` |
| Go | `go.mod` + `go.sum` | บรรทัด `go 1.xx` (ขั้นต่ำ) + `toolchain` | ไม่มีมาตรฐาน · environment variable ※ |
| Flutter / Dart | `pubspec.yaml` + `pubspec.lock` (แอป commit lock · library ไม่ commit) | `environment:` ใน pubspec ※ · FVM ถ้าใช้ (ไม่ใช่ทางการ) | flavor: Android `productFlavors` ใน `android/app/build.gradle.kts` · iOS ใช้ scheme ※ · `--dart-define` ※ |
| Rust | `Cargo.toml` + `Cargo.lock` | `rust-toolchain.toml` (`channel` + `components`) | ไม่มีมาตรฐาน · environment variable ※ |
| PHP / Laravel | `composer.json` + `composer.lock` | `"php": "^8.x"` ใน `require` | `.env` (ไม่ commit) + `.env.example` · `APP_ENV` เลือก `.env.[APP_ENV]` · `APP_DEBUG=false` ใน production |

## 2 · คำสั่ง

ใส่ลงหัวข้อ 5 "เริ่มใช้งาน" · 7 "คำสั่งที่ใช้บ่อย" · 10 "build และไฟล์ที่ได้"

| Stack | ติดตั้ง | รัน | test | lint · format | build / แพ็ก → ไฟล์ที่ได้ |
|---|---|---|---|---|---|
| Node / TypeScript | `npm ci` (ยึด lock) · `pnpm install --frozen-lockfile` | `npm run dev` ※ | `npm test` ※ | `npm run lint` ※ · Prettier ※ | `npm run build` ※ → `dist/` |
| .NET / C# | `dotnet restore` | `dotnet run` · `dotnet run -lp https` | `dotnet test` ※ | `dotnet format` ※ | `dotnet publish` (net8.0 ขึ้นไปเป็น Release เอง) → `bin/Release/<tfm>/publish/` · `-r <RID> --self-contained` (Runtime Identifier (RID) เช่น `linux-x64`) |
| Python | `uv sync` | `uv run <คำสั่ง>` | `uv run pytest` ※ | `ruff check` · `ruff format` | `uv build` ※ → wheel · sdist |
| Java / Kotlin | ดึงตอน build | `./mvnw spring-boot:run` · `./gradlew bootRun` ※ | `./mvnw test` · `./gradlew test` ※ | Spotless · Checkstyle · ktlint (ไม่มีตัวกลาง) ※ | `./mvnw package` · `./gradlew build` ※ → jar รันด้วย `java -jar` |
| Go | `go mod download` ※ | `go run ./cmd/<ชื่อ>` ※ | `go test ./...` ※ | `gofmt` · `go vet` ※ | `go build ./...` ※ → binary ไฟล์เดียว |
| Flutter / Dart | `flutter pub get` ※ | `flutter run --flavor <ชื่อ>` | `flutter test` ※ | `flutter analyze` · `dart format .` ※ | `flutter build appbundle` → `build/app/outputs/bundle/release/app.aab` · `flutter build ipa` ※ |
| Rust | `cargo fetch` ※ | `cargo run` ※ | `cargo test` ※ | `cargo clippy` · `cargo fmt` ※ | `cargo build --release` ※ → `target/release/` |
| PHP / Laravel | `composer install` · `npm ci && npm run build` (asset) ※ | `php artisan serve` ※ | `php artisan test` | Laravel Pint ※ | deploy: `php artisan config:cache` (ห้ามรันตอน dev) · `php artisan storage:link` |

## 3 · หัวข้อที่ต้องเพิ่มใน README ตามภาษา

| Stack | เพิ่มอะไร |
|---|---|
| Node / TypeScript | รุ่น Node จาก `.nvmrc` + บอกให้สั่ง `nvm use` · ใช้ npm หรือ pnpm (ห้ามมี lock 2 แบบ) · ตาราง `scripts` · ตัวแปร `VITE_*` ทุกตัวพร้อมเตือนว่าค่าถึง browser · Angular: รายชื่อ configuration |
| .NET / C# | รุ่น Software Development Kit (SDK) ตาม `global.json` · project ไหนเป็นตัวเริ่ม · ตั้ง `ASPNETCORE_ENVIRONMENT` ที่ไหนบ้าง · ชื่อคีย์ที่ต้องใส่ผ่าน `user-secrets` (ไม่ใส่ค่า) · คำสั่ง `dotnet publish` ที่ใช้จริง · คำสั่ง migration ของ EF Core |
| Python | รุ่นจาก `.python-version` · ใช้ uv หรือ venv + pip (ทางเดียว) · เป็น src layout ต้องติดตั้งก่อน test · ตั้งค่า ruff อยู่ไหน · ไฟล์ `.env` ที่ต้องมี |
| Java / Kotlin | รุ่น JDK · ใช้ `./mvnw` หรือ `./gradlew` เสมอ ไม่ใช่ตัวที่ลงในเครื่อง · ตาราง profile และวิธีเปิด · ชื่อและที่อยู่ jar ที่ได้ |
| Go | รุ่นจากบรรทัด `go` และ `toolchain` · binary ใน `cmd/` แต่ละตัวทำอะไร · environment variable ที่อ่าน |
| Flutter / Dart | รุ่น Flutter และ Dart · ตาราง flavor (ชื่อ · applicationId · ไฟล์เริ่ม) · signing: `key.properties` และ keystore อยู่ไหน ขอจากใคร (ห้าม commit) · iOS: team และ provisioning · คำสั่ง build ต่อ flavor และที่อยู่ไฟล์ที่ได้ |
| Rust | toolchain จาก `rust-toolchain.toml` · feature flag ที่มี · binary ใน `src/bin/` · รุ่น Rust ต่ำสุดที่รองรับ (Minimum Supported Rust Version (MSRV)) ถ้าเป็น library |
| PHP / Laravel | รุ่น PHP และ extension ที่ต้องมี · `cp .env.example .env` → `php artisan key:generate` ※ → migrate · build asset · ขั้น deploy (`config:cache` · `storage:link` · queue worker) |

## 4 · โครงโฟลเดอร์ตามแหล่งทางการ

ใช้ประกอบหัวข้อ 8 "โครงโปรเจกต์" · กฎของ repo นี้ (ชื่อโฟลเดอร์โค้ด · ที่อยู่ test) อยู่ใน `SKILL.md` ข้อ 1 และชนะเมื่อขัดกัน

| Stack | โครงที่เครื่องมือคาดไว้ | แหล่ง |
|---|---|---|
| Node / TypeScript | npm ไม่กำหนด · ใช้ตามตัวสร้างของ framework (`src/` · `public/` · `vite.config.ts` หรือ `angular.json`) ※ | — |
| .NET / C# | ไม่มีหน้าทางการ · ที่พบบ่อย `src/<App>/` + `tests/<App>.Tests/` + `global.json` + `.slnx` ※ | — |
| Python | src layout: `src/<package>/` · `pyproject.toml` ที่ราก | [PyPA src vs flat](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) |
| Java / Kotlin | `src/main/java` (หรือ `kotlin`) · `src/main/resources` · `src/test/java` | [Maven Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html) |
| Go | `cmd/<binary>/main.go` · `internal/` · แพ็กเกจเล็กวางไฟล์ที่รากได้ · `golang-standards/project-layout` และ `pkg/` เป็นของชุมชน ไม่ใช่ของทีม Go | [Organizing a Go module](https://go.dev/doc/modules/layout) |
| Flutter / Dart | `lib/` (`lib/src/` ส่วนภายใน) · `test/` · `android/` · `ios/` ※ | [Dart package layout](https://dart.dev/tools/pub/package-layout) |
| Rust | `src/main.rs` · `src/lib.rs` · `src/bin/` · `tests/` · `examples/` · `benches/` | [Cargo project layout](https://doc.rust-lang.org/cargo/guide/project-layout.html) |
| PHP / Laravel | `app/` · `config/` · `database/` · `public/` · `resources/` · `routes/` · `storage/` · `tests/` | [Laravel 13.x structure](https://laravel.com/docs/13.x/structure) |

## 5 · แหล่ง (เปิดอ่าน 2026-11-07)

[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci) · [package.json engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) · [pnpm install](https://pnpm.io/cli/install) · [nvm .nvmrc](https://github.com/nvm-sh/nvm/blob/master/README.md) · [Vite env and mode](https://vite.dev/guide/env-and-mode) · [Angular environments](https://angular.dev/tools/cli/environments) · [global.json](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json) · [ASP.NET Core environments](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments) · [user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) · [dotnet publish](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-publish) · [Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) · [uv project layout](https://docs.astral.sh/uv/concepts/projects/layout/) · [uv Python versions](https://docs.astral.sh/uv/concepts/python-versions/) · [Ruff configuration](https://docs.astral.sh/ruff/configuration/) · [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) · [Spring Boot profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html) · [Spring Boot Maven run](https://docs.spring.io/spring-boot/maven-plugin/run.html) · [Go toolchains](https://go.dev/doc/toolchain) · [Flutter flavors](https://docs.flutter.dev/deployment/flavors) · [Flutter Android release](https://docs.flutter.dev/deployment/android) · [Cargo FAQ](https://doc.rust-lang.org/cargo/faq.html) · [rust-toolchain.toml](https://rust-lang.github.io/rustup/overrides.html) · [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md) · [Laravel configuration](https://laravel.com/docs/12.x/configuration)

รุ่นของเครื่องมือเปลี่ยนเร็ว (Laravel 13.x ออกแล้ว ณ วันที่ตรวจ) · ก่อนใช้ตารางนี้กับโปรเจกต์จริง เปิดหน้าทางการของรุ่นที่ใช้


## reference: readme-skeleton.md

# README skeleton and companion documents — full version

The rules are in `SKILL.md` item 2 · a copy-ready template is in `assets/starter-files.md` · commands and files for each language are in [`readme-by-stack.md`](readme-by-stack.md)

## 1 · README sections in the order a newcomer needs them

> This table is the fallback and the length criteria for layer 3 in `SKILL.md` item 2 · the real sections of each project come from the layer 2 survey (read the project · official docs · READMEs of projects of the same type) · a section that this type of project needs but that is not in the table may be added.

The order follows what someone who has just arrived needs: what is this → install → run → change code → ship · the "Sources" column is the number of the 5 main sources (item 4) that recommend the section · a row that merges several topics gives a range · "—" means no main source recommends it; it is this skill's own judgment. The section names in the "Section" column are the Thai headings written into the README, so they stay Thai (English gloss in brackets).

| # | Section | Question it answers | Present when | How long · where to move it if longer | Sources |
|:--:|---|---|---|---|:--:|
| 1 | ชื่อ + ทำอะไรให้ใคร (name + what it does for whom) | What is this, who uses it | always | 2–3 lines · first line at most 120 characters | 5 |
| 2 | บรรทัดสถานะ (status line) | Is it still in development, who owns it, where are the docs | always | 1 line: status · owner · link to `docs/README.md` | 2–4 (status 2 · owner 4 · docs link 4) |
| 3 | ภาพหน้าจอหรือตัวอย่างผล (screenshot or sample output) | What does it look like or produce | there is a screen or output to look at | 1 image, or a sample command with its output | 2 (usage example 3) |
| 4 | ต้องมีบนเครื่อง (needed on the machine) | What must be installed first, which version | always | table: tool · version · which file pins the version (`.nvmrc` · `global.json`) | 3 |
| 5 | เริ่มใช้งาน (getting started) | How to install and run | always | commands that can be copied, pasted and run, at most 6 commands · more than that becomes `scripts/setup` | 4 |
| 6 | ตั้งค่า (configuration) | What must be configured, how many environments, how to switch | the project reads values from outside | table: variable name · what it is for · required or not · sample value (no real values) · for a secret give only the name and where to get it · if there is none, write "ไม่มีค่าตั้งภายนอก" (no external config) | 0 · based on Twelve-Factor |
| 7 | คำสั่งที่ใช้บ่อย (common commands) | How to run dev · test · lint · format · build | always | table of 4–8 rows · test must be 1 command | 2 |
| 8 | โครงโปรเจกต์ (project layout) | What is in which folder | always | a one-level tree, at most 15 lines · more → `ARCHITECTURE.md`, code-map section | 1 |
| 9 | สถาปัตยกรรมย่อ (short architecture) | How many parts the system has, how they talk | more than 1 part (web page + API + database · queue · external service) | 3–5 lines + a Mermaid diagram at Context or Container level · full → `ARCHITECTURE.md` | — · based on matklad and C4 |
| 10 | build และไฟล์ที่ได้ (build and output files) | How to make the deliverable, what files come out, where | there is something to build (web · app · binary · package) | build command per target + the path of the output file | 2 (counted together with deploy) |
| 11 | deploy | Where it goes live, who triggers it, through which Continuous Integration (CI), how to roll back | it can be deployed | 3–5 lines · full steps → `docs/runbook-deploy.md` | 2 (counted together with build) |
| 12 | ติดปัญหา (troubleshooting) | Common symptoms and fixes | always | table of symptom · fix · start from what you hit yourself while writing the README | — |
| 13 | ร่วมพัฒนา (contributing) | branch · commit · pull request (PR) · what to check before sending | other people change the code | 3–5 lines · longer → `CONTRIBUTING.md` | 4 |
| 14 | ติดต่อและขอความช่วยเหลือ (contact and help) | Whom to ask when stuck, which channel | always | 1–2 lines | 4 |
| 15 | สัญญาอนุญาต (license) | How far it can be reused | always · the last section | 1 line + the `LICENSE` file · for internal work write "ใช้ภายใน <บริษัท> ห้ามเผยแพร่" (internal use at <company>, do not distribute) | 2 |

**Skeleton rules**
- Cut a section that has nothing in it; do not write "none" · except section 6, which must say there is no external config.
- The README holds only what a newcomer needs in the first 30 minutes · anything longer moves to the file named in column 2, with a link back; do not delete it.
- Longer than 100 lines → put a table of contents under the status line.
- Edit the README in the same commit as the code that changes a command or setting.
- Each language has sections to add (Flutter flavors · .NET `user-secrets`) → [`readme-by-stack.md`](readme-by-stack.md) section 3.

## 2 · What goes into other files

| File | Lives at | Content | Create when |
|---|---|---|---|
| `ARCHITECTURE.md` | `<project-name>/` | a code map for people who change the code (section 3) | the folder tree in the README exceeds 15 lines, or the system has more than 1 part |
| `CHANGELOG.md` | `<project-name>/` | what users see changing in each version | per the table in `SKILL.md` item 3 |
| `CONTRIBUTING.md` | `<project-name>/` | developer machine setup · branch · commit · PR · lint and test before sending | README section 13 is longer than 5 lines |
| `LICENSE` | `<project-name>/` | the full license text | the repo is public, or the contract requires it |
| `SECURITY.md` | `<project-name>/` or `.github/` | how to report a vulnerability · versions still supported | the repo is public, or delivered to a customer who maintains it |
| `CODEOWNERS` | `.github/` | which folder whom must review in a PR | there are several teams or owners |
| `runbook-deploy.md` | `docs/` at the root | build → release → run steps · each environment's setup · rolling back | the deploy steps are longer than 5 lines |
| `decisions/ADR-NNNN-<slug>.md` | `docs/` at the root | decision records (Architecture Decision Record (ADR)), one per decision | a hard-to-reverse decision is made (`adr-writer`) |
| Architecture, delivery edition | `docs/` at the root | an arc42-style architecture document | delivering to a customer or there is an acceptance reviewer (`project-doc-set`) |

The location of `docs/` follows layout B in `project-doc-set` item 1 · GitHub looks for `CONTRIBUTING` and `CODEOWNERS` in `.github/` first, then the repo root, then `docs/` · documents in `docs/` can be split by what the reader needs into 4 kinds (Diátaxis): learning (tutorial) · getting a job done (how-to, e.g. a runbook) · looking up facts (reference, e.g. an API settings table) · understanding the reasons (explanation, e.g. ARCHITECTURE · ADR)

## 3 · ARCHITECTURE.md

**Default: matklad's short form** — the reader is someone who will change the code and wants to know where the thing that does X lives.

```markdown
# สถาปัตยกรรม

## ภาพรวม
<ระบบแก้ปัญหาอะไร รับอะไรเข้า ส่งอะไรออก — 1 ย่อหน้า + รูป Context หรือ Container 1 รูป>

## แผนที่โค้ด
<แต่ละโฟลเดอร์หรือโมดูลหลักทำอะไร คุยกับใคร — ทีละย่อหน้าสั้น ๆ>

## ข้อห้ามที่ต้องรักษา
<กฎที่โค้ดต้องไม่ละเมิด เช่น "ชั้น domain ไม่ import ฐานข้อมูล" · "ทุกการเขียนเงินผ่าน ledger">

## เส้นแบ่งระหว่างชั้น
<ตรงไหนคือ API สาธารณะ ตรงไหนแก้ได้อิสระ>

## เรื่องที่ตัดผ่านทุกส่วน
<log · error · สิทธิ์ · config · การทดสอบ — ทำแบบไหน อยู่ที่ไหน>
```

- Short; include only what rarely changes · you may name a file, module or type, but put no links, because links break when files move; let people search by name instead.
- Do not explain every module in detail · do not chase every commit · review 2–3 times a year.
- Diagrams use only the 2 C4 levels, Context and Container, which c4model.com says are enough for most teams · do not draw the Code level · draw with Mermaid per `software-diagrams`.

**Use arc42 instead when** delivering to a customer or another team who will maintain it · there are quality requirements (speed, security) that must be proven · an acceptance reviewer is needed — choose only the sections that have real content from the 12 sections: goals · constraints · scope and context · solution strategy · building blocks · runtime view · deployment · cross-cutting concepts · decisions (point to ADRs) · quality requirements · risks and technical debt · glossary · this edition lives in `docs/` per `project-doc-set`, not in the code folder.

## 4 · Sources (read 2026-11-07)

The 5 main sources used to count the "Sources" column in item 1:
- [standard-readme spec](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — required sections · license at the end · table of contents when over 100 lines
- [Make a README](https://www.makeareadme.com/) — long is better than short; if too long, move, do not delete
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Google documentation guide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) · [Best practices](https://google.github.io/styleguide/docguide/best_practices.html) — change docs together with code
- [Microsoft Engineering Playbook: Project and Repositories](https://microsoft.github.io/code-with-engineering-playbook/documentation/guidance/project-and-repositories/) — folder layout · compile test build deploy

Supporting sources: [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) · [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) · [arc42](https://arc42.org/overview) · [C4 model diagrams](https://c4model.com/diagrams) · [Diátaxis](https://diataxis.fr/) · [Twelve-Factor: Config](https://12factor.net/config) · [Build, release, run](https://12factor.net/build-release-run)

The section order · the 15-line and 6-command ceilings · the configuration table · the troubleshooting and short-architecture sections are this skill's own judgment, not the sources' words.
