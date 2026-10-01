# skill: pdpa-compliance

Use when a system holds personal data about people in Thailand. Covers an inventory of what is held and why, choosing a lawful basis instead of asking consent for everything, recorded and withdrawable consent, data subject rights, collecting only what is needed, retention that actually deletes, processors and the first hours of a breach. Engineering guidance, not legal advice.

# PDPA — ข้อมูลส่วนบุคคล

> **กฎข้อเดียว:** ข้อมูลที่ไม่ได้เก็บ คือข้อมูลที่ไม่รั่ว ไม่ต้องดูแล และไม่ต้องลบ
> คำถามแรกเสมอคือ "จำเป็นต้องเก็บไหม" ไม่ใช่ "เก็บยังไงให้ปลอดภัย"

> ⚠️ นี่คือแนวทางสำหรับคนทำระบบ **ไม่ใช่คำแนะนำทางกฎหมาย**
> เรื่องที่มีผลทางกฎหมายต้องให้ที่ปรึกษากฎหมายตัดสิน

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

---

## 1 · ทำรายการก่อน

**ตอบคำถาม "ข้อมูลของฉันอยู่ที่ไหนบ้าง" ไม่ได้ ถ้าไม่มีรายการนี้**

| ข้อมูล | เก็บที่ไหน | เก็บทำไม | ฐานทางกฎหมาย | เก็บนานเท่าไหร่ | ใครเห็นได้ | ส่งให้ใครบ้าง |
|---|---|---|---|---|---|---|
| ชื่อ-นามสกุล | `users.name` | ระบุตัวลูกค้า | สัญญา | 5 ปีหลังปิดบัญชี | ฝ่ายขาย · ผู้ดูแล | — |
| เบอร์โทร | `users.phone` | แจ้งสถานะจัดส่ง | สัญญา | เท่ากัน | เท่ากัน | ผู้ให้บริการ SMS |
| เลขบัตรประชาชน | `kyc.id_number` | ยืนยันตัวตนตามกฎหมาย | หน้าที่ตามกฎหมาย | 10 ปี | ฝ่ายปฏิบัติตามกฎเกณฑ์ | — |

**ทำรายการนี้ให้ครบทุกที่จริง ๆ** — ฐานข้อมูลหลัก · ที่สำรอง · log · ระบบวิเคราะห์ ·
ที่เก็บไฟล์ · สเปรดชีตที่ทีมทำเอง

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
| ถอนได้ง่ายเท่าที่ให้ | ถ้าให้ด้วยหนึ่งคลิก ต้องถอนด้วยหนึ่งคลิก |
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
> soft delete อย่างเดียว**ไม่นับว่าลบ** · ข้อมูลที่กฎหมายบังคับให้เก็บต่อ (เช่นเอกสารภาษี)
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
ประวัติอาชญากรรม **ข้อมูลสุขภาพ** ข้อมูลชีวภาพ · เก็บเมื่อจำเป็นจริงและมีมาตรการเข้มกว่าปกติ

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
| 7 | บันทึกเหตุการณ์ → `postmortem-template` |

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

# skill: context-budget

Use when a task will read files, search a codebase, run commands with long output, or work through a repository — before the first read, not after the context window is full. Decides when to send a subagent instead of reading directly, how to read part of a file rather than all of it, how to bound a search, when to write intermediate results to disk, and which project notes are worth keeping so the next session does not re-explore the same code.

# งบ context

> **กฎข้อเดียว:** ตัดสินใจ**ก่อน**อ่าน ไม่ใช่หลังอ่านแล้วค่อยเสียดาย
> token ที่เข้า context แล้วเอาออกไม่ได้ จนกว่าจะ `/clear` ซึ่งทิ้งทุกอย่างไปด้วย

## เมื่อไหร่ใช้ skill นี้

- กำลังจะอ่านไฟล์ ค้นโค้ด หรือรันคำสั่งที่ output อาจยาว
- เริ่มงานในโปรเจกต์ที่ยังไม่รู้จักโครงสร้าง
- context เต็มเร็วผิดปกติ หรือโดน `/compact` บ่อย
- จะวางกฎให้ทั้งทีมหรือทุกโปรเจกต์

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ทำให้**คำตอบ**สั้นลง | `answer-shape` |
| เก็บสรุปงานข้ามเซสชัน | `work-session-context` |
| ที่วางไฟล์ชั่วคราว | `temp-file-discipline` |
| loop เขียนโค้ดที่ต้องรอดจากการสูญเสียบริบท | `spec-to-code-loop` |

---

## 1 · อะไรกิน context จริง ๆ

| แหล่ง | ขนาดโดยประมาณ | คุมได้ไหม |
|---|---|---|
| **output ของ tool** (อ่านไฟล์ · grep · bash) | ใหญ่สุด — ไฟล์เดียวเป็นหมื่น token ได้ | ✅ คุมได้เต็มที่ — เนื้อหาทั้งหน้านี้ |
| schema ของ tool จาก MCP server | ต่อ server หลักพัน token ทุกเซสชัน | ✅ ปิดตัวที่ไม่ใช้ |
| `CLAUDE.md` | ตามที่เขียน | ✅ เขียนให้สั้น |
| description ของ skill | ~100 token ต่อ skill | ✅ ตัดให้กระชับ |
| ประวัติบทสนทนา | โตเรื่อย ๆ | ⚠️ `/clear` เมื่อเปลี่ยนเรื่อง |

> **ลำดับความสำคัญชัดเจน** — ตัด description ของ skill ทั้งชุดได้ไม่กี่พัน token
> แต่ `cat` ไฟล์ 3,000 บรรทัดครั้งเดียวกินมากกว่านั้น
> **ที่ต้องวินัยที่สุดคือแถวบนสุดของตาราง**

---

## 2 · ต้นไม้ตัดสินใจก่อนอ่าน

```
ต้องรู้อะไรจากไฟล์/โฟลเดอร์นี้
├─ รู้ชื่อไฟล์และบรรทัดอยู่แล้ว        → อ่านเฉพาะช่วง (ข้อ 3)
├─ ต้องหาว่าอยู่ตรงไหน                → grep แบบมีขอบเขต (ข้อ 4)
├─ ต้องเปิดดูมากกว่า 3 ไฟล์           → ส่ง subagent (ข้อ 5)
└─ ต้องแปลง/รวม/นับข้อมูลจำนวนมาก     → เขียนลงไฟล์แล้วอ่านเฉพาะสรุป (ข้อ 6)
```

**เช็กขนาดก่อนเสมอ** เมื่อไม่รู้ว่าไฟล์ใหญ่แค่ไหน:

```bash
wc -l path/to/file          # กี่บรรทัด
du -h path/to/file          # กี่ไบต์
```

---

## 3 · อ่านเฉพาะช่วง

| ต้องการ | คำสั่ง |
|---|---|
| ดูว่าไฟล์เกี่ยวกับอะไร | `head -40 file.ts` |
| ดูโครงสร้าง | `rg -n '^(export |class |def |function )' file.ts` |
| อ่านรอบ ๆ บรรทัดที่สนใจ | `sed -n '120,180p' file.ts` |
| ด้วย Read tool | ใส่ `offset` และ `limit` |

**เกณฑ์:** ไฟล์เกิน **300 บรรทัด** ให้ถือว่าต้องอ่านเฉพาะช่วง เว้นแต่จะแก้ทั้งไฟล์จริง ๆ

**ยอมอ่านทั้งไฟล์ได้เมื่อ** — กำลังจะเขียนทับทั้งไฟล์ · ไฟล์ตั้งค่าสั้น ๆ ·
ต้องเข้าใจไฟล์ทั้งไฟล์เพื่อแก้ให้ถูก และไฟล์ไม่เกิน ~300 บรรทัด

---

## 4 · ค้นแบบมีขอบเขต

```bash
# ❌ คืนมาเป็นพัน ๆ บรรทัด
rg 'user'

# ✅ จำกัดชนิดไฟล์ · จำกัดบริบท · จำกัดจำนวน
rg -n 'createUser' --glob '*.ts' -C2 | head -50

# ✅ อยากรู้แค่ว่าอยู่ไฟล์ไหน
rg -l 'createUser' --glob '*.ts'

# ✅ อยากรู้แค่จำนวน
rg -c 'TODO' --glob '*.ts' | head -20
```

| กฎ | เหตุผล |
|---|---|
| ใส่ `--glob` เสมอ | กัน `node_modules` และไฟล์ build |
| `-l` ก่อน แล้วค่อยเจาะ | รู้ว่าอยู่ไฟล์ไหนก่อน ค่อยอ่านเฉพาะไฟล์นั้น |
| ปิดท้าย `| head -N` | กันกรณีที่ pattern กว้างกว่าที่คิด |
| `-C2` พอ ไม่ต้อง `-C10` | บริบทสองบรรทัดพอให้รู้ว่าใช่ไหม |

---

## 5 · ส่ง subagent ไปแทน

**นี่คือข้อที่ประหยัดได้มากที่สุดในหน้านี้**

subagent มี context ของตัวเอง — มันอ่านไปยี่สิบไฟล์ได้
แล้วคืนกลับมาที่บทสนทนาหลักแค่ย่อหน้าเดียว ส่วนที่มันอ่านไม่เข้ามาด้วย

| ใช้ subagent เมื่อ | ทำเองเมื่อ |
|---|---|
| ต้องเปิดดูเกิน 3 ไฟล์เพื่อตอบคำถามเดียว | รู้ไฟล์และบรรทัดอยู่แล้ว |
| สำรวจโปรเจกต์ที่ยังไม่รู้จัก | แก้ไฟล์ที่กำลังเปิดอยู่ |
| ตรวจ/รีวิวข้ามหลายไฟล์ | งานที่ต้องเห็นรายละเอียดเต็มเพื่อแก้ต่อ |

**สั่งให้ดี = บอกว่าจะเอาอะไรกลับมา:**

```
❌ "ดูโค้ดส่วน auth ให้หน่อย"
   → มันอาจคืนมาทั้งไฟล์

✅ "หาว่า flow การเข้าสู่ระบบเริ่มที่ไหนและผ่านอะไรบ้าง
    คืนกลับมาแค่ รายการ ไฟล์:บรรทัด ตามลำดับการเรียก
    ไม่ต้องแปะโค้ด ไม่เกิน 15 บรรทัด"
```

> 🚨 **กำหนดรูปร่างและความยาวของผลลัพธ์เสมอ** — subagent ที่ไม่ได้ถูกบอกว่าจะเอาอะไร
> จะคืนรายงานยาว ๆ กลับมา แล้วก็ไม่ได้ประหยัดอะไรเลย

---

## 6 · เขียนลงไฟล์ แทนถือไว้ในบทสนทนา

```bash
# ❌ output ทั้งหมดเข้า context
npm test

# ✅ เข้า context แค่บรรทัดสรุป
npm test > _to_delete/test.log 2>&1; tail -20 _to_delete/test.log

# ✅ ข้อมูลใหญ่ ประมวลผลในไฟล์ เอาเข้ามาแค่ผลลัพธ์
jq '[.[] | select(.status=="failed")] | length' _to_delete/report.json
```

**ใช้กับ** — ผลรัน test · log · ผลลัพธ์จากการแปลงไฟล์ · ข้อมูลที่ต้องกรอง/นับ
ที่เก็บคือ `_to_delete/` ตาม `temp-file-discipline`

---

## 7 · ทำให้เซสชันหน้าไม่ต้องสำรวจซ้ำ

โปรเจกต์ที่กลับมาทำบ่อย ควรมีแผนที่สั้น ๆ ที่ **ถูกโหลดอัตโนมัติ**

| ไฟล์ | โหลดเอง | เหมาะกับ |
|---|:--:|---|
| **`<project>/CLAUDE.md`** | ✅ | แผนที่โปรเจกต์ · คำสั่งที่ใช้บ่อย · กฎเฉพาะโปรเจกต์ |
| `<project>/<โฟลเดอร์ใหญ่>/CLAUDE.md` | ✅ เมื่อทำงานในโฟลเดอร์นั้น | โมดูลที่ซับซ้อนเป็นพิเศษ |
| `context.md` · `notes.md` ชื่ออื่น | ❌ | **ต้องสั่งให้อ่านทุกครั้ง = เสียเปล่า** |

> 🚨 **อย่าตั้งชื่อไฟล์แผนที่เป็นอย่างอื่น** — `CLAUDE.md` ถูกอ่านให้อัตโนมัติ
> ไฟล์ชื่ออื่นต้องมีคนสั่งให้อ่าน ซึ่งแปลว่าจ่าย token เพิ่มเพื่อไปอ่านสิ่งที่ควรฟรี

**สิ่งที่ควรอยู่ในแผนที่ของโปรเจกต์** — สั้น ๆ ไม่เกิน 40 บรรทัด:

```markdown
## แผนที่
- API อยู่ที่ `src/api/` · หน้าจอ `src/pages/` · ชนิดข้อมูลร่วม `src/types.ts`
- ตรรกะการคิดราคาทั้งหมดอยู่ใน `src/pricing/` ที่เดียว
- `legacy/` ไม่ได้ใช้แล้ว **ห้ามอ่าน**

## คำสั่ง
- รัน `npm run dev` · test `npm test` · migrate `npm run db:migrate`

## กฎเฉพาะที่นี่
- ห้ามแก้ `generated/` เป็นไฟล์ที่สร้างอัตโนมัติ
```

**ไม่ควรมี** — เนื้อหาที่อ่านจากโค้ดได้อยู่แล้ว · รายการไฟล์ทั้งหมด · ประวัติการเปลี่ยนแปลง
แผนที่ที่ล้าสมัยแย่กว่าไม่มีแผนที่ เพราะมันพาไปผิดที่โดยมั่นใจ

---

## 8 · ค่าตั้งที่ช่วยได้อีก

| ทำอะไร | ได้อะไร |
|---|---|
| **ปิด MCP server ที่ไม่ได้ใช้ในโปรเจกต์นั้น** | schema ของทุก tool โหลดทุกเซสชัน — ตัดได้หลักพัน token |
| ปิดปลั๊กอินที่ไม่เกี่ยวกับงานนั้น | description ของ skill ทุกตัวอยู่ใน context เสมอ |
| `permissions.deny` ใน `.claude/settings.json` สำหรับโฟลเดอร์ที่ไม่ควรอ่าน | กันพลาดเชิงระบบ ไม่ต้องพึ่งวินัย |
| `/clear` เมื่อเปลี่ยนเรื่อง · `/compact` เมื่อใกล้เต็ม | คืนที่ว่าง |
| `CLAUDE.md` ยาวไม่เกิน 40 บรรทัด | ทุกบรรทัดจ่ายต้นทุนทุกเซสชัน |

---

## 9 · Anti-patterns

- ❌ **`cat` ไฟล์ใหญ่เพื่อ "ดูก่อนว่ามีอะไร"** — `head -40` ตอบคำถามเดียวกันด้วย 1% ของต้นทุน
- ❌ **`rg` โดยไม่ใส่ `--glob`** — ได้ `node_modules` มาเต็ม
- ❌ **อ่านสิบไฟล์เองเพื่อตอบคำถามเดียว** — งานของ subagent
- ❌ **สั่ง subagent แบบไม่บอกว่าจะเอาอะไรกลับมา** — ได้รายงานยาวกลับมา ไม่ได้ประหยัด
- ❌ **รัน test แล้วปล่อย output เข้า context ทั้งก้อน**
- ❌ **อ่านไฟล์เดิมซ้ำเพราะลืมว่าเคยอ่านแล้ว** — จดสิ่งที่พบลงไฟล์ตั้งแต่รอบแรก
- ❌ **`context.md` หรือชื่ออื่นที่ไม่ได้โหลดอัตโนมัติ** — ใช้ `CLAUDE.md`
- ❌ **`CLAUDE.md` ยาว 300 บรรทัด** — จ่ายทุกเซสชันของทุกคนในทีม
- ❌ **เปิด MCP server ไว้ครบทุกตัวตลอดเวลา**

---

## 10 · ตัวย่อ

- **context window** — พื้นที่จำกัดที่โมเดลเห็นข้อมูลทั้งหมดของบทสนทนานั้น
- **token** — หน่วยนับข้อความที่โมเดลใช้ ประมาณ 1 คำภาษาอังกฤษ หรือ 2–3 ตัวอักษรไทย
- **subagent** — agent ย่อยที่มี context ของตัวเอง ทำงานแล้วคืนกลับมาแค่ข้อสรุป
- **MCP** — Model Context Protocol (มาตรฐานให้เครื่องมือภายนอกต่อเข้ากับโมเดล)
- **`rg`** — ripgrep เครื่องมือค้นข้อความในไฟล์ที่เร็วกว่า grep

## 11 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ทำให้คำตอบสั้นลง | `answer-shape` |
| ที่วางไฟล์ระหว่างทาง | `temp-file-discipline` |
| เก็บสรุปข้ามเซสชัน | `work-session-context` |
| loop เขียนโค้ดที่ต้องรอดจากการสูญเสียบริบท | `spec-to-code-loop` |
| แผนที่โปรเจกต์และโครงโฟลเดอร์ | `project-bootstrap` |
| แก้บั๊กเฉพาะจุดโดยไม่อ่านทั้งโปรเจกต์ | `targeted-fix` |


---

# skill: work-session-context

Use at the END of any significant task to save a concise context summary file under .claude/context/ so work can be resumed in a future session (even after closing terminal or switching teammate). Also use at the START of a session to check existing context. Critical for cross-session continuity and team handoff.

# Work Session Context

## When to use this skill

### 📥 At START of session (always)
- Check `.claude/context/INDEX.md` if exists
- Read recent session files to know what's in progress
- Resume from "Next Steps" of latest session

### 📤 At END of significant work (always)
- After completing a task that took > 5 min
- After making decisions worth remembering
- Before stopping for the day
- After a `/feature-kickoff`, `/sprint-plan`, or similar workflow

### 🤝 For team handoff
- When teammate will pick up
- When work spans multiple days
- When work spans multiple Claude sessions

## File Layout (Convention)

```
<project-root>/
└── .claude/
    └── context/
        ├── INDEX.md                                ← latest summaries (rolling)
        └── sessions/
            ├── 2026-05-30-1430-feature-kickoff.md  ← per-session details
            ├── 2026-05-30-1610-code-review.md
            └── ...
```

**Why this location:**
- `.claude/` is Claude Code convention (excluded by most projects' `.gitignore` patterns — but we WANT this committed)
- Git-tracked → team sees + reviews
- Markdown → readable anywhere
- Subfolder `sessions/` → can be archived/cleaned up

> ⚠️ **Make sure `.claude/context/` is NOT in `.gitignore`** — we want this committed.

## Format: Session File

Filename: `YYYY-MM-DD-HHMM-<short-task-slug>.md`

```markdown
# 📝 <Task Title>

| | |
|--|--|
| **Date** | YYYY-MM-DD HH:MM (timezone) |
| **Agent(s)** | business-analyst, system-analyst |
| **Status** | 🟢 Completed \| 🟡 In Progress \| 🔴 Blocked |
| **Duration** | ~XX min |
| **Triggered by** | User request / /feature-kickoff / etc. |

## 🎯 What was done

1-3 sentences. What did we accomplish?

## 🧠 Key decisions

- Decision 1 (why)
- Decision 2 (why)

## 📂 Files touched

- `path/to/file.ts` — what changed
- `path/to/doc.md` — created

## ❓ Open questions

- [ ] Question 1 (needs answer from: @who)
- [ ] Question 2

## ➡️ Next steps

What should happen next? (Critical — this is how we resume.)

1. ...
2. ...

## 🔗 Related

- Previous session: [link](sessions/...)
- Related issue/PR: ...
- Related docs: ...
```

## Format: INDEX.md

Rolling latest-on-top list:

```markdown
# 📚 Work Context Index

Latest sessions at top. Full details in `sessions/`.

---

## 🟡 In Progress

### 2026-05-30 14:30 — Feature kickoff: User membership
- **Agent:** business-analyst
- **Status:** BRD drafted, awaiting stakeholder review
- **Next:** PM to align timeline once BRD approved
- **File:** [sessions/2026-05-30-1430-feature-kickoff.md](sessions/2026-05-30-1430-feature-kickoff.md)

---

## 🟢 Recently Completed

### 2026-05-30 16:10 — Code review: login.ts
- **Agent:** developer
- **Status:** 3 blocking + 5 nit findings, dev fixed
- **File:** [sessions/2026-05-30-1610-code-review.md](sessions/2026-05-30-1610-code-review.md)

### 2026-05-29 11:00 — Sprint planning
- **Agent:** project-manager
- **Status:** Sprint 12 plan finalized, 25 points committed
- **File:** [sessions/2026-05-29-1100-sprint-plan.md](sessions/2026-05-29-1100-sprint-plan.md)

---

## ⚪ Older (archive after 30 days)

(automatically rolled off, or move to sessions/archive/)
```

## Resume Pattern

At session start (if context exists):

```
1. Read .claude/context/INDEX.md
2. Skim recent in-progress + completed
3. For ANYTHING marked 🟡 In Progress:
   - Read full session file
   - Continue from "Next Steps"
4. Acknowledge user with: "I see we were working on X. Last step was Y. Should I continue?"
```

## Writing Discipline

### ✅ Good summaries

```markdown
## 🎯 What was done
Designed authentication flow using OAuth 2.0 PKCE. Chose Stripe Identity
for KYC. Documented in adr/0007-auth.md.

## ➡️ Next steps
1. Solution architect to review ADR (ping @bob)
2. Once approved, dev starts implementation in /src/auth
3. Need API key for Stripe Identity (request from @alice)
```

### ❌ Bad summaries

```markdown
## What was done
Worked on stuff.

## Next steps
TBD.
```

> 💡 **Concise but complete.** Future you (or teammate) needs enough to resume.

## Granularity Rules

### Write a session file when:
- ✅ Completed a feature-kickoff workflow
- ✅ Finished implementing a feature
- ✅ Made architectural decision
- ✅ Concluded code review with findings
- ✅ Designed test plan for a feature
- ✅ Filed a bug report
- ✅ Conducted threat model
- ✅ Completed sprint planning / retro

### Skip session file for:
- ❌ Single chat answer
- ❌ Quick lookup
- ❌ < 5 min work
- ❌ Trivial edits

## Multi-Agent Sessions

If multiple agents worked (e.g., `/feature-kickoff`):

```markdown
## 🎯 What was done

**business-analyst** → BRD draft at docs/brd/membership-v1.md
**solution-architect** → ADR-0007 at adr/0007-auth.md
**system-analyst** → FSD draft at docs/fsd/membership-v1.md
**project-manager** → Sprint plan with 25 points

## ➡️ Next steps
1. Stakeholder review of BRD by Friday
2. Once approved, dev kickoff Monday
```

## INDEX Maintenance

After each session file is written, update INDEX.md:

1. Move new entry to top of "🟢 Recently Completed" (or "🟡 In Progress")
2. Move stale "In Progress" items to "Recently Completed" or archive
3. Move entries older than 30 days to "⚪ Older"
4. Periodically: move ⚪ Older items to `sessions/archive/`

Keep INDEX.md **scannable** — < 50 entries visible at top level.

## Avoid Bloat

- Don't write a session file for every chat
- Don't duplicate content (link to docs, don't copy)
- Don't write "what was discussed" — write "what was decided"
- One session = one task or one workflow
- 200-400 words per session file (1 page max)

## Integration with Other Skills

- **At start of every workflow command** (e.g., `/feature-kickoff`): check context
- **`polished-document-style`** — use for stakeholder-facing output, NOT for session files (those should be quick + scannable)
- **`commit-message-format`** — when committing session file, use: `docs(context): <task summary>`
- **`status-report`** — the project-wide status table lives in `docs/BUILD-PLAN.md` (what passed, stage, pending). Session files here record *how* the work went; link to BUILD-PLAN instead of copying its table

## Sample Workflow

```
User: /feature-kickoff ระบบสมาชิก
       ↓
Claude (orchestrator):
  1. Check .claude/context/INDEX.md ✓
     (no existing membership work — fresh start)
  2. Run business-analyst → BRD
  3. Run solution-architect → ADR
  4. Run system-analyst → FSD
  5. Run project-manager → Plan
       ↓
Workflow done. Now save context:
  - Write sessions/2026-05-30-1430-membership-kickoff.md
  - Update INDEX.md
  - Suggest git commit:
    `git add .claude/context/ && git commit -m "docs(context): kickoff for membership feature"`
       ↓
User closes terminal.
       ↓
Next day, new session:
       ↓
Claude:
  1. Check .claude/context/INDEX.md
  2. Sees 🟡 In Progress: membership kickoff
  3. Reads session file
  4. "I see we kicked off membership yesterday. BRD/FSD/Plan done,
      next step is dev kickoff. Want to proceed?"
```

## Setup Tips (One-time)

If `.claude/context/` doesn't exist yet, create it:

```bash
mkdir -p .claude/context/sessions
touch .claude/context/INDEX.md
echo "# 📚 Work Context Index" > .claude/context/INDEX.md
```

Make sure not gitignored:
```bash
# Check
grep -E "^\.claude" .gitignore

# If listed, refine to allow context:
# .gitignore should NOT include `.claude/` blanket
# OR add specific allow: !.claude/context/
```

## Anti-patterns

- ❌ **Saving everything** — only significant work
- ❌ **Copying chat history** — write decisions, not transcript
- ❌ **Forgetting INDEX.md update** — INDEX is the entry point
- ❌ **Not committing to git** — defeats team handoff purpose
- ❌ **Including secrets** in session files (PII, API keys, etc.)
- ❌ **Vague "Next steps"** — must be actionable
