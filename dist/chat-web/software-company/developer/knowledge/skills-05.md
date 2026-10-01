# skill: temp-file-discipline

Use on every task that writes files into someone's project folder. Sends every temporary file to one `_to_delete/` folder at the project root instead of leaving archives, extracted folders, previews, backups and one-off scripts where the real work lives. Load it before the first file is written, not while cleaning up afterwards.

# ระเบียบไฟล์ชั่วคราว

> **กฎข้อเดียว:** อะไรที่ไม่ใช่ผลงานจริง ต้องอยู่ใน `_to_delete/` เท่านั้น
> ห้ามวางไว้ที่รากโปรเจกต์ ห้ามวางปนกับไฟล์งาน

---

## ลำดับความสำคัญ — ดีที่สุดคือไม่เขียนลงโปรเจกต์เลย

| ไฟล์นั้นต้องอยู่บนเครื่องผู้ใช้ไหม | ทำอย่างไร |
|---|---|
| ไม่ต้อง — เป็นแค่ขั้นกลางระหว่างคิด | ทำในพื้นที่ทำงานของเซสชัน ไม่แตะโฟลเดอร์โปรเจกต์ |
| ต้อง เพราะต้องแตกไฟล์หรือรันที่เครื่องนั้น | `_to_delete/` |
| เป็นผลงานที่ผู้ใช้จะเก็บไว้ | โฟลเดอร์ปลายทางของงานนั้น |

---

## อะไรคือไฟล์ชั่วคราว

- ไฟล์บีบอัดที่ส่งผ่านแชทเพื่อเอาไฟล์ลงเครื่อง และโฟลเดอร์ที่แตกออกมา
- ภาพที่เรนเดอร์ไว้ตรวจงาน · ภาพหน้าจอ · ไฟล์ตัวอย่างที่ทำไว้เทียบ
- สำเนาสำรองของไฟล์ที่กำลังแก้ · ไฟล์ `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx`
- สคริปต์ที่เขียนขึ้นใช้ครั้งเดียว · ไฟล์ log จากการรันครั้งเดียว
- ไฟล์รูปแบบกลางระหว่างแปลง เช่น `.svg` ที่แปลงต่อเป็น `.png` แล้ว
- **เอกสารที่แปลงรูปแบบมาเพื่อให้อ่านหรือประมวลผลง่าย** — `.docx` หรือ `.pdf` ที่แปลงเป็น `.md`
  ต้นฉบับคือของจริง ตัวที่แปลงคือของชั่วคราว · **ห้ามวางปนกันในโฟลเดอร์เอกสาร**
  ไม่งั้นอีกสามเดือนไม่มีใครรู้ว่าไฟล์ไหนคือฉบับที่ลูกค้าเซ็นรับ
- เวอร์ชันเก่าของไฟล์ที่เพิ่งแทนที่ไป

**ไฟล์ที่เลิกใช้แล้วก็คือไฟล์ชั่วคราว** — แทนที่ไฟล์เก่าด้วยของใหม่ ให้ย้ายตัวเก่าเข้า `_to_delete/`
ไม่ใช่ทิ้งไว้ข้าง ๆ กัน

---

## อะไรไม่ใช่

- ผลงานที่ผู้ใช้ขอ
- ไฟล์ต้นทางของผลงาน เช่น `.py` ที่ผลิตรูป หรือ `.html` ที่เป็นแหล่งที่มาของภาพ —
  **ปีหน้าต้องแก้ ต้องมีไฟล์ต้นทาง** เก็บไว้ในโฟลเดอร์ย่อยข้างผลงาน ไม่ใช่ `_to_delete/`
- ไฟล์ที่ผู้ใช้วางไว้เอง แม้จะดูเหมือนขยะ — **ห้ามย้ายของผู้ใช้โดยไม่ถาม**

---

## วิธีใช้

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── transfer.zip
    └── render-check/
```

- โฟลเดอร์เดียวที่**รากของโปรเจกต์** ไม่ต้องแตกย่อยตามวันที่ นอกจากของเยอะจริง
- ใส่ `_to_delete/` ลงใน `.gitignore` ทุกโปรเจกต์ที่ใช้ git — ตรวจก่อน ถ้ายังไม่มีให้เพิ่ม
- โปรเจกต์ที่มีชื่อโฟลเดอร์ชั่วคราวอยู่แล้ว (`tmp/` `scratch/` `.cache/`) ใช้ของเดิม อย่าสร้างซ้ำ

---

## ตอนจบงาน

1. **บอกว่ามีอะไรค้างอยู่ใน `_to_delete/`** เป็นบรรทัดเดียว ไม่ต้องลงรายการยาว
2. **ห้ามลบเอง** — ลบเมื่อผู้ใช้สั่งเท่านั้น การลบในโฟลเดอร์ผู้ใช้กู้คืนไม่ได้
3. ลบไม่ได้เพราะไม่มีสิทธิ์ ก็ให้ย้ายเข้า `_to_delete/` แล้วบอกผู้ใช้ — อย่าทิ้งไว้ที่เดิม

---

## Anti-patterns

- ❌ **แตกไฟล์ zip ลงรากโปรเจกต์** แล้วค่อยเก็บกวาดทีหลัง — ทีหลังไม่เคยมาถึง
- ❌ **ตั้งชื่อ `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`** วางไว้ข้างของเดิม
- ❌ **ลบไฟล์ผู้ใช้เพราะคิดว่าไม่ใช้แล้ว**
- ❌ **เขียนไฟล์ชั่วคราวลงโฟลเดอร์ผู้ใช้ทั้งที่ทำในพื้นที่ของเซสชันได้**
- ❌ **เก็บไฟล์ต้นทางของผลงานไว้ใน `_to_delete/`** — นั่นไม่ใช่ของชั่วคราว
- ❌ **ทิ้งไฟล์ค้างโดยไม่บอก** — ผู้ใช้จะมาเจอเองอีกหลายเดือนถัดไป

---

## ตัวย่อ

- **zip** — ไฟล์บีบอัดรูปแบบ ZIP
- **git** — ระบบควบคุมเวอร์ชัน Git


---

# skill: status-report

Use at the END of every task that produces or checks project work — a document, a mockup, a review, a code round, a fix, a release. Writes one status table (what passed, what stage each item has reached, what is still pending, what comes next) into `docs/BUILD-PLAN.md` and shows the same table in the reply. Keeps one living snapshot plus a one-line history so anyone opening the project knows where it stands without reading the conversation. Load it before reporting "done", not after.

# รายงานสถานะเมื่อจบงาน

> **กฎข้อเดียว:** จบงานทุกครั้ง ต้องมีตารางสถานะใน `docs/BUILD-PLAN.md` และตารางเดียวกันในคำตอบ
> งานที่ไม่มีตารางสถานะ ถือว่ายังไม่จบ

---

## 1 · เขียนที่ไหน — `docs/BUILD-PLAN.md` เสมอ

ทุกงาน ทั้งเอกสาร โค้ด การตรวจ การส่งมอบ เขียนที่ไฟล์เดียวนี้ เพื่อให้มีที่ดูสถานะที่เดียว

| สถานการณ์ | ทำอย่างไร |
|---|---|
| มีไฟล์อยู่แล้ว | แก้เฉพาะสองหัวข้อด้านล่าง — **ห้ามแตะตารางงานหรือหัวข้ออื่น** |
| ยังไม่มีไฟล์ | สร้างไฟล์ที่มีแค่ชื่อโปรเจกต์ + สองหัวข้อด้านล่าง — ตารางงานจะถูกเพิ่มภายหลังเมื่อเริ่มเขียนโค้ด |
| มี subagent หลายตัวทำงานพร้อมกัน | subagent **รายงานกลับ** ตัวหลักเป็นคนเขียนไฟล์คนเดียว ไม่งั้นไฟล์พัง |

สองหัวข้อที่ skill นี้ดูแล (วางไว้บนสุดของไฟล์ ต่อจากชื่อโปรเจกต์):

- `## สถานะล่าสุด` — **เขียนทับทั้งหัวข้อ** ทุกครั้ง เป็นภาพปัจจุบันภาพเดียว ไม่ใช่ต่อท้าย
- `## ประวัติสถานะ` — **เพิ่มหนึ่งบรรทัดบนสุด** ต่องานหนึ่งงาน ไม่ลบของเดิม

---

## 2 · ตาราง `## สถานะล่าสุด`

```markdown
## สถานะล่าสุด

อัปเดต: 2026-10-01 14:20 · งานล่าสุด: เขียน SRS

| รายการ | ประเภท | สถานะ | ผลตรวจ | ค้าง / หมายเหตุ |
|---|---|---|---|---|
| SRS (`docs/srs.md`) | เอกสาร | DRAFT | ผ่าน — 42 FR ตรวจได้ทุกข้อ | FR-031 รอยืนยันตัวเลข |
| mockup (`mockup/`) | เอกสาร | REVIEW | ไม่ผ่าน — ปุ่มหลอก 3 จุด | แก้ `order.html` |
| FSD | เอกสาร | ยังไม่เริ่ม | — | รอ architecture |
| FR-001 ถึง FR-012 | โค้ด | เสร็จ | ผ่าน — test 48/48 | — |

**ค้างอยู่ (ต้องมีคนตัดสิน):**
1. FR-031 เวลาตอบสนองกี่วินาที — ถามผู้ว่าจ้าง

**ถัดไป:** แก้ปุ่มหลอกใน mockup → เขียน architecture
```

### ค่าที่ใช้ในแต่ละคอลัมน์ — ใช้เฉพาะค่าเหล่านี้

| คอลัมน์ | ค่าที่ใช้ได้ |
|---|---|
| ประเภท | `เอกสาร` · `โค้ด` · `ตรวจ` · `ส่งมอบ` |
| สถานะ (เอกสาร) | `ยังไม่เริ่ม` · `DRAFT` · `REVIEW` · `APPROVED` |
| สถานะ (โค้ด) | `รอทำ` · `กำลังทำ` · `เสร็จ` · `ติด` — ตรงกับตารางงานของ `spec-to-code-loop` |
| ผลตรวจ | `ผ่าน — <หลักฐาน>` · `ไม่ผ่าน — <สิ่งที่ไม่ผ่าน>` · `ยังไม่ตรวจ` · `—` (ยังไม่มีอะไรให้ตรวจ) |

- **ผลตรวจต้องมีหลักฐานเสมอ** — ตัวเลข test ที่รันจริง จำนวนข้อที่ตรวจ ชื่อไฟล์ที่ดู · ไม่ได้รันหรือไม่ได้ตรวจ เขียน `ยังไม่ตรวจ` ห้ามเขียน `ผ่าน`
- `APPROVED` มีแต่คนเปลี่ยนได้ — agent ตั้งได้สูงสุด `DRAFT` หรือ `REVIEW`
- ตารางมีทุกรายการของโปรเจกต์ ไม่ใช่แค่งานรอบนี้ — รายการที่รอบนี้ไม่ได้แตะ คัดลอกค่าเดิมมา
- หนึ่งแถวต่อเอกสารหนึ่งฉบับ · โค้ดรวมเป็นช่วงรหัส (`FR-001 ถึง FR-012`) ได้ถ้าสถานะเท่ากัน อย่าทำตารางยาวเกิน 25 แถว

### "ค้างอยู่" กับ "ถัดไป"

- **ค้างอยู่** = สิ่งที่ agent ไปต่อเองไม่ได้ ต้องมีคนตอบหรือตัดสิน · เขียนเป็นคำถามที่ตอบได้ พร้อมบอกว่าถามใคร · ไม่มีให้เขียน `ไม่มี`
- **ถัดไป** = งานลำดับถัดไปไม่เกิน 3 อย่าง

---

## 3 · บรรทัดใน `## ประวัติสถานะ`

หนึ่งบรรทัดต่องาน ใหม่สุดอยู่บน:

```markdown
## ประวัติสถานะ

- 2026-10-01 14:20 · เขียน SRS · DRAFT · ผ่าน 42/42 FR · ค้าง 1
- 2026-09-30 10:05 · ตรวจ mockup · ไม่ผ่าน · ปุ่มหลอก 3 จุด
```

รูปแบบ: `วันที่ เวลา · งาน · สถานะ · ผล · ค้างกี่ข้อ` — ไม่เกินหนึ่งบรรทัด ไม่ใส่รายละเอียดที่อยู่ในตารางแล้ว

---

## 4 · ในคำตอบ

แสดงตาราง `สถานะล่าสุด` เฉพาะ **แถวที่เปลี่ยนในรอบนี้** + "ค้างอยู่" + "ถัดไป" แล้วบอกว่าตารางเต็มอยู่ใน `docs/BUILD-PLAN.md` — ไม่ต้องแปะทั้งไฟล์

---

## 5 · รายการตรวจก่อนบอกว่าจบ

- [ ] อ่าน `docs/BUILD-PLAN.md` จากดิสก์ก่อนแก้ (คนอื่นอาจแก้ไปแล้ว)
- [ ] `## สถานะล่าสุด` เขียนทับ ไม่ได้ต่อท้าย · มีวันที่เวลา
- [ ] ทุกแถวที่เขียนว่า `ผ่าน` มีหลักฐาน
- [ ] ไม่ได้ตั้ง `APPROVED` เอง
- [ ] เพิ่มบรรทัดใน `## ประวัติสถานะ` หนึ่งบรรทัด
- [ ] ไม่แตะตารางงานหรือหัวข้ออื่นในไฟล์
- [ ] คำตอบมีตารางเฉพาะแถวที่เปลี่ยน + ค้าง + ถัดไป

---

## 6 · สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนว่า `ผ่าน` โดยไม่ได้รัน test หรือไม่ได้ตรวจจริง | ตารางสถานะที่โกหกแย่กว่าไม่มีตาราง |
| ต่อท้าย `## สถานะล่าสุด` ทุกรอบ | ไฟล์ยาวขึ้นเรื่อย ๆ และไม่รู้ว่าแถวไหนคือปัจจุบัน |
| สร้างไฟล์สถานะใหม่ (`STATUS.md` `progress.md`) | สถานะกระจายหลายที่ ไม่มีใครรู้ว่าดูที่ไหน |
| ซ่อนรายการที่ไม่ผ่านไว้ในร้อยแก้ว | คนอ่านตารางแล้วเข้าใจว่าผ่านหมด |
| ให้ subagent เขียน `BUILD-PLAN.md` เอง | เขียนชนกันแล้วไฟล์พัง |

---

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ตารางงานและวงรอบเขียนโค้ด ในไฟล์เดียวกัน | `spec-to-code-loop` |
| ชุดเอกสารของโปรเจกต์และสถานะเอกสาร | `project-doc-set` |
| บันทึกบริบทเพื่อทำต่อในรอบสนทนาหน้า | `work-session-context` |
| รูปแบบตารางและเอกสาร | `polished-document-style` |
| ชื่อและสถานะของไฟล์เอกสาร | `document-naming` |


---

# skill: database-design

Use when designing or changing a database schema — tables, columns, indexes, relationships or a migration. Covers relational versus document, naming, identifier choice, the four data types teams get wrong, where indexes help, constraints, expand-and-contract migrations and multi-tenant layouts. Load it before the first CREATE TABLE.

# ออกแบบฐานข้อมูล

> **กฎข้อเดียว:** schema คือของที่แก้ยากที่สุดในระบบ
> โค้ดผิดแก้วันนี้จบวันนี้ · schema ผิดอยู่กับมันสามปี พร้อมข้อมูลจริงอีกสิบล้านแถวที่ต้องย้ายตาม

## เมื่อไหร่ใช้ skill นี้

- ออกแบบฐานข้อมูลของระบบใหม่ หรือ module ใหม่
- จะเพิ่ม/แก้ตาราง คอลัมน์ ความสัมพันธ์ หรือ index
- จะเขียน migration โดยเฉพาะตอนที่ระบบมีข้อมูลจริงแล้ว
- query ช้าแล้วสงสัยว่าเป็นที่ schema หรือที่ index

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` |
| ออกแบบ endpoint และรูปร่าง JSON | `api-conventions` |
| เก็บรหัสผ่าน token สิทธิ์ผู้ใช้ | `auth-implementation-patterns` |
| ที่เก็บ connection string | `config-and-secrets` |
| รัน migration ใน pipeline | `cicd-and-release` |

---

## 1 · เลือกชนิดฐานข้อมูลก่อน

| เกณฑ์ | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| ข้อมูลมีความสัมพันธ์ชัด ต้อง join | ✅ | ❌ ต้องทำมือ |
| รูปร่างข้อมูลไม่แน่นอน ต่างกันรายตัว | ⚠️ ใช้คอลัมน์ JSON | ✅ |
| ต้องการ transaction ข้ามหลายตาราง | ✅ | ⚠️ ได้แต่แพงกว่า |
| รายงาน ผลรวม การวิเคราะห์ | ✅ | ❌ |
| เขียนหนักมาก log/telemetry | ⚠️ | ✅ หรือใช้ time-series |

> **ค่าเริ่มต้นคือ relational** — เลือก document เมื่อ**ตอบได้ว่าทำไม**
> "ยืดหยุ่นกว่า" ไม่ใช่เหตุผล แปลว่ายังไม่ได้ออกแบบ
> ระบบส่วนใหญ่ที่เลือก document เพราะยืดหยุ่น สุดท้ายเขียนโค้ด join เองในแอป

**ผสมกันได้** — ใช้ relational เป็นหลัก แล้วเก็บของที่รูปร่างไม่แน่นอนเป็นคอลัมน์ `jsonb`
ตัวเลือกนี้ดีกว่าแยกฐานข้อมูลสองตัวเกือบทุกกรณี

---

## 2 · กฎตั้งชื่อ — เลือกครั้งเดียว ใช้ทั้งระบบ

| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ตาราง | `snake_case` **พหูพจน์** | `orders`, `order_items` |
| คอลัมน์ | `snake_case` เอกพจน์ | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<ตารางเอกพจน์>_id` | `customer_id` |
| ตารางเชื่อม | `<a>_<b>` เรียงตามตัวอักษร | `role_users` → `user_roles` |
| index | `ix_<ตาราง>_<คอลัมน์>` | `ix_orders_customer_id` |
| unique | `ux_<ตาราง>_<คอลัมน์>` | `ux_users_email` |
| foreign key constraint | `fk_<ตาราง>_<ตารางปลายทาง>` | `fk_orders_customers` |
| check constraint | `ck_<ตาราง>_<เรื่อง>` | `ck_orders_total_non_negative` |

**สิ่งที่ห้ามทำ:**

- ❌ ใส่ชนิดข้อมูลในชื่อ — `name_varchar`, `is_active_bit`
- ❌ ใส่ชื่อตารางนำหน้าคอลัมน์ — `order_order_date` (มันอยู่ในตาราง `orders` อยู่แล้ว)
- ❌ ใช้คำสงวน — `user`, `order`, `group`, `key` ต้องใส่เครื่องหมายคำพูดทุกครั้ง ใช้ `users`, `orders` แทน
- ❌ ตัวย่อที่คนอ่านไม่ออก — `cst_nm` ประหยัดได้ 8 ตัวอักษร แลกกับความสับสนสามปี

> SQL Server ที่ใช้ `PascalCase` ก็ได้ ถ้าโปรเจกต์เดิมใช้อยู่แล้ว
> **ความสม่ำเสมอสำคัญกว่ารูปแบบไหนถูก** — อย่าเปลี่ยนกลางทาง

---

## 3 · คอลัมน์ที่ทุกตารางต้องมี

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

เพิ่มตามความจำเป็น:

| คอลัมน์ | ใส่เมื่อ | หมายเหตุ |
|---|---|---|
| `deleted_at timestamptz` | ต้องกู้ข้อมูลคืนได้ หรือกฎหมายบังคับให้เก็บ | **ทุก query ต้องกรอง** ไม่งั้นข้อมูลที่ลบแล้วโผล่ |
| `created_by` / `updated_by` | ต้องตอบได้ว่าใครแก้ | เก็บ id ผู้ใช้ ไม่ใช่ชื่อ |
| `row_version` / `xmin` | มีคนแก้พร้อมกันได้ | ใช้คู่กับ ETag ใน `api-conventions` |
| `tenant_id` | ระบบหลายผู้เช่า | ดูข้อ 10 |

> 🚨 **soft delete ไม่ใช่ของฟรี** — ทุก unique constraint ต้องคิดใหม่
> `ux_users_email` จะกันไม่ให้สมัครอีเมลเดิมซ้ำ แม้บัญชีเก่าถูกลบไปแล้ว
> แก้ด้วย partial index — `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · เลือกชนิด identifier

| ชนิด | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| `bigint` เรียงเพิ่ม | เล็ก เร็ว index ไม่แตก อ่านง่ายตอนไล่ปัญหา | เดา id ถัดไปได้ · รวมข้อมูลหลายที่แล้วชนกัน | ค่าเริ่มต้น ระบบเดียว ฐานข้อมูลเดียว |
| **UUIDv7 / ULID** | เรียงตามเวลา · สร้างจากฝั่งแอปได้ · ไม่ชนกัน | 16 ไบต์ · อ่านด้วยตายาก | ระบบกระจาย · ต้องสร้าง id ก่อนบันทึก · id โผล่ใน URL |
| `UUIDv4` สุ่มล้วน | ไม่ชนกัน เดาไม่ได้ | **index แตกกระจาย เขียนช้าลงชัดเจนเมื่อข้อมูลเยอะ** | เลี่ยงถ้าเลือกได้ |

> 🚨 **UUIDv4 เป็น primary key คือกับดักที่เจอบ่อยที่สุด**
> ค่าสุ่มล้วนทำให้ทุกการ insert ไปแทรกกลางโครงสร้าง index
> ตอนข้อมูลหลักหมื่นไม่รู้สึก ตอนหลักสิบล้านคือช้าจนต้องรื้อ
> ถ้าต้องใช้ UUID ให้ใช้ **v7** ซึ่งขึ้นต้นด้วยเวลา จึงเรียงเพิ่มเหมือน bigint

**เลขที่คนเห็น ≠ primary key** — เลขใบสั่งซื้อ `SO-2026-00042` ที่ลูกค้าอ้างถึง
ให้เป็นคอลัมน์ต่างหากที่มี unique constraint ไม่ใช่เอา primary key ไปโชว์

---

## 5 · normalisation แค่ไหนพอ

**เริ่มที่ 3NF เสมอ** — ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว

denormalise ได้เมื่อครบสามข้อนี้เท่านั้น:

1. วัดแล้วว่าช้าจริง (มีตัวเลข ไม่ใช่ความรู้สึก)
2. รู้ว่าข้อมูลซ้ำจะถูกอัปเดตยังไงให้ตรงกัน
3. เขียนเหตุผลไว้ในคอมเมนต์ของตาราง

**ยกเว้นที่ยอมรับกันทั่วไป** — ข้อมูลที่ต้อง "แช่แข็ง" ณ เวลาหนึ่ง:
ราคาสินค้าในใบสั่งซื้อต้องคัดลอกลง `order_items.unit_price`
ไม่ใช่ join ไปหา `products.price` เพราะราคาวันนี้ไม่ใช่ราคาวันที่ลูกค้าซื้อ

---

## 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

### เงิน

```sql
total_amount   numeric(19,4)   NOT NULL      -- ✅
currency       char(3)         NOT NULL      -- ✅ ISO 4217 เช่น THB
total_amount   float / double                -- ❌ 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> ❌ **float กับเงินคือบั๊กที่หาไม่เจอ** — ยอดรวมเพี้ยนไปสตางค์เดียวต่อรายการ
> พอปิดงบสิ้นเดือนถึงรู้ แล้วไล่ย้อนไม่ได้ว่าเพี้ยนตรงไหน

### เวลา

| เก็บ | ใช้ | เหตุผล |
|---|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` (SQL Server ใช้ `datetimeoffset`) เก็บเป็น UTC | ประเทศไทยไม่มี daylight saving แต่ระบบที่ขายต่างประเทศมี |
| วันเกิด วันครบกำหนด | `date` | ไม่มีเวลา ไม่มีโซนเวลา |
| ช่วงเวลาเปิดร้าน | `time` + คอลัมน์โซนเวลาแยก | |

**กฎ:** เก็บ UTC · แปลงเป็น `+07:00` ตอนแสดงผลเท่านั้น · ห้ามเก็บเวลาไทยดิบ ๆ ใน `timestamp` ที่ไม่มีโซน

**พุทธศักราช** — เก็บเป็น ค.ศ. เสมอ แปลงเป็น พ.ศ. ตอนแสดงผล
ฐานข้อมูลที่เก็บปี 2569 จะคำนวณช่วงเวลาผิดทุกฟังก์ชัน

### enum / สถานะ

| วิธี | ดีเมื่อ | เสียเมื่อ |
|---|---|---|
| ตาราง lookup + foreign key | ค่าเพิ่มได้โดยไม่ deploy · มีชื่อไทย/อังกฤษ · มีลำดับการแสดง | ต้อง join |
| `check constraint` เป็นข้อความ | ค่าคงที่ ไม่ค่อยเปลี่ยน | เพิ่มค่าต้อง migration |
| ชนิด `enum` ของ PostgreSQL | เร็ว เล็ก | **ลบค่าออกไม่ได้** เปลี่ยนลำดับไม่ได้ |
| `int` ดิบ ๆ | — | ❌ อ่าน `status = 3` แล้วไม่มีใครรู้ว่าอะไร |

### boolean

- ตั้งชื่อเป็นประโยคบอกเล่าเชิงบวก — `is_active` ✅ · `is_not_disabled` ❌
- **ถ้าอาจมีสถานะที่สามในอนาคต อย่าใช้ boolean** — `is_approved` จะกลายเป็น `approval_status`
  ในหกเดือน เมื่อมี "รออนุมัติ" เพิ่มมา

---

## 7 · index — วางตรงไหนถึงได้ผล

**ต้องมี:**

- ทุก foreign key (ฐานข้อมูลส่วนใหญ่ **ไม่สร้างให้อัตโนมัติ**)
- คอลัมน์ที่ปรากฏใน `WHERE` ของ query ที่วิ่งบ่อย
- คอลัมน์ที่ใช้ `ORDER BY` คู่กับ pagination

**composite index — ลำดับคอลัมน์สำคัญ:**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

ลำดับคือ **เท่ากับ → ช่วง → เรียงลำดับ**
index `(a, b)` ใช้กับ query ที่กรองด้วย `a` อย่างเดียวได้ แต่กรองด้วย `b` อย่างเดียว**ไม่ได้**

**อย่าใส่ index เมื่อ:**

- ตารางเล็กกว่าไม่กี่พันแถว — ฐานข้อมูลอ่านทั้งตารางเร็วกว่า
- คอลัมน์มีค่าซ้ำเยอะ เช่น `is_active` ที่ 95% เป็น true
- ตารางเขียนหนักกว่าอ่านมาก — ทุก index คือต้นทุนที่จ่ายทุกครั้งที่เขียน

> **วัดก่อนเดา** — `EXPLAIN ANALYZE` (PostgreSQL) หรือ execution plan (SQL Server)
> บอกได้ว่า index ถูกใช้จริงไหม การเดาว่า "น่าจะช่วย" ผิดบ่อยกว่าถูก

---

## 8 · constraint อยู่ที่ฐานข้อมูล ไม่ใช่แค่ที่แอป

| กฎ | ที่ควรอยู่ |
|---|---|
| อีเมลห้ามซ้ำ | `UNIQUE` ที่ฐานข้อมูล **และ** ตรวจในแอปเพื่อให้ข้อความ error สวย |
| ยอดเงินห้ามติดลบ | `CHECK (total_amount >= 0)` |
| ใบสั่งซื้อต้องมีลูกค้าจริง | `FOREIGN KEY` |
| สถานะต้องเป็นค่าที่กำหนด | `CHECK` หรือ lookup table |

> **เหตุผล:** แอปไม่ใช่ทางเดียวที่แตะข้อมูล — ยังมี script แก้ข้อมูลด่วน
> งาน import ตอนตีสาม และ service ตัวที่สองที่เขียนทีหลัง
> constraint ที่ฐานข้อมูลคือด่านสุดท้ายที่ไม่มีใครข้ามได้

**`ON DELETE` ต้องเลือกอย่างตั้งใจ:**

| ตัวเลือก | ความหมาย | ใช้กับ |
|---|---|---|
| `RESTRICT` (ค่าเริ่มต้นที่ควรใช้) | ลบไม่ได้ถ้ายังมีลูก | เกือบทุกกรณี |
| `CASCADE` | ลบลูกตามทั้งหมด | ของที่เป็นส่วนประกอบจริง ๆ เช่น `order_items` |
| `SET NULL` | ลูกกลายเป็นไม่มีพ่อ | ความสัมพันธ์ที่ไม่บังคับ |

`CASCADE` ผิดที่เดียว = ลบลูกค้าหนึ่งคนแล้วประวัติการซื้อสิบปีหายตาม

---

## 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

**กฎสามข้อ:**

1. **เดินหน้าอย่างเดียว** — migration ที่ merge แล้วห้ามแก้ ถ้าผิดให้เขียนตัวใหม่ทับ
2. **หนึ่ง migration ทำเรื่องเดียว** — ไล่ปัญหาง่าย rollback ตรงจุด
3. **โค้ดเวอร์ชันเก่ากับ schema เวอร์ชันใหม่ต้องอยู่ด้วยกันได้** — ระหว่าง deploy มีทั้งสองเวอร์ชันวิ่งพร้อมกันเสมอ

### expand / contract — ขั้นตอนมาตรฐานสำหรับการเปลี่ยนที่ทำลายของเดิม

ตัวอย่าง: เปลี่ยนชื่อคอลัมน์ `name` → `full_name`

| รอบ deploy | ฐานข้อมูล | โค้ด |
|:--:|---|---|
| **1 · ขยาย** | เพิ่ม `full_name` (nullable) | เขียนลงทั้งสองคอลัมน์ · อ่านจาก `name` |
| **2 · ย้าย** | คัดลอกข้อมูลเก่าเป็นชุด ๆ | อ่านจาก `full_name` ถ้าไม่มีค่อยดู `name` |
| **3 · บีบ** | ตั้ง `NOT NULL` · ลบ `name` | อ่านและเขียน `full_name` อย่างเดียว |

ทำสามรอบดูเสียเวลา แต่แต่ละรอบ rollback ได้โดยไม่เสียข้อมูล
การทำรอบเดียวคือการยอมรับว่าจะปิดระบบ

**คำสั่งที่ล็อกตารางจนระบบค้าง** (ระวังเป็นพิเศษบนตารางใหญ่):

- เพิ่มคอลัมน์ที่มี `DEFAULT` และ `NOT NULL` พร้อมกัน — PostgreSQL รุ่นใหม่ทำได้เร็ว แต่ MySQL ยังเขียนใหม่ทั้งตาราง
- เปลี่ยนชนิดข้อมูล
- สร้าง index ธรรมดา → ใช้ `CREATE INDEX CONCURRENTLY` (PostgreSQL) หรือ `ONLINE = ON` (SQL Server)

**ทดสอบ migration กับสำเนาข้อมูลจริงเสมอ** — migration ที่รัน 0.2 วินาทีบนเครื่องตัวเอง
อาจใช้ 40 นาทีบน production พร้อมล็อกตารางไว้ตลอด

---

## 10 · ระบบหลายผู้เช่า (multi-tenant)

| แบบ | แยกกันแค่ไหน | ต้นทุน | เหมาะกับ |
|---|---|---|---|
| คอลัมน์ `tenant_id` ในทุกตาราง | ต่ำ — พลาดที่เดียวข้อมูลรั่วข้ามผู้เช่า | ถูกสุด | ผู้เช่าเยอะ ข้อมูลต่อรายไม่ใหญ่ |
| schema แยกต่อผู้เช่า | กลาง | migration ต้องวนทุก schema | ผู้เช่าหลักสิบถึงหลักร้อย |
| ฐานข้อมูลแยกต่อผู้เช่า | สูงสุด | แพงสุด | ลูกค้าองค์กรที่บังคับให้แยก |

> 🚨 ถ้าเลือกแบบ `tenant_id` — **บังคับที่ชั้นล่างสุด ไม่ใช่ที่ query แต่ละตัว**
> ใช้ row-level security ของฐานข้อมูล หรือ global filter ของ ORM
> เพราะ query ที่ลืมใส่ `WHERE tenant_id = ?` แค่ตัวเดียว คือข้อมูลลูกค้ารายหนึ่งโผล่ให้อีกรายเห็น
> และมันจะไม่มี error ให้เห็นเลย

---

## 11 · ข้อมูลส่วนบุคคล

- ทำรายการไว้ว่า **คอลัมน์ไหนคือข้อมูลส่วนบุคคล** — ตอบคำถาม "ข้อมูลฉันอยู่ที่ไหนบ้าง" ไม่ได้ถ้าไม่มีรายการนี้
- เลขบัตรประชาชน หมายเลขบัตรเครดิต ข้อมูลสุขภาพ — เข้ารหัสระดับคอลัมน์ หรือไม่เก็บเลยถ้าไม่จำเป็น
- กำหนด **อายุการเก็บ** ต่อตาราง และมีงานลบจริงตามนั้น
- ต้องลบได้เมื่อเจ้าของขอ — soft delete อย่างเดียวไม่นับว่าลบ
- ห้ามคัดลอกข้อมูลจริงลงเครื่อง developer โดยไม่ปิดบัง

---

## 12 · Anti-patterns

- ❌ **ตารางเดียวเก็บทุกอย่าง** (`entity` / `attribute` / `value`) — query อะไรก็ยากไปหมด
- ❌ **`varchar(255)` ทุกคอลัมน์** — ตัวเลขนี้ไม่ได้มีความหมายอะไรเลย กำหนดจากข้อมูลจริง
- ❌ **เก็บหลายค่าในคอลัมน์เดียว** — `"1,4,7"` ค้นไม่ได้ constraint ไม่ได้ ใช้ตารางเชื่อม
- ❌ **ไม่มี foreign key เพราะ "แอปดูแลเอง"** — แล้ววันหนึ่งก็มีแถวกำพร้า
- ❌ **index ทุกคอลัมน์เผื่อไว้** — เขียนช้าลง พื้นที่บาน โดยไม่มีใครได้ประโยชน์
- ❌ **`SELECT *` ในโค้ดจริง** — เพิ่มคอลัมน์ทีไรโค้ดพังทุกที
- ❌ **ตรรกะธุรกิจใน trigger** — ไล่ปัญหาไม่เจอ เพราะไม่มีใครเห็นว่ามันทำงาน
- ❌ **migration ที่เขียนข้อมูลด้วย** ปนกับที่เปลี่ยนโครงสร้าง — rollback แล้วข้อมูลหาย
- ❌ **แก้ schema บน production ด้วยมือ** — รอบหน้าที่ deploy จะไม่ตรงกัน

---

## 13 · ตัวย่อ

- **3NF** — Third Normal Form (การจัดตารางให้ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว)
- **UUID** — Universally Unique Identifier (รหัสสุ่มยาวที่ไม่ชนกันแม้สร้างคนละเครื่อง)
- **ULID** — Universally Unique Lexicographically Sortable Identifier (UUID ที่เรียงตามเวลาได้)
- **ORM** — Object-Relational Mapper (ตัวแปลงระหว่างตารางกับ object ในโค้ด)
- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล)

## 14 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปร่าง JSON ที่ API ส่งออก | `api-conventions` |
| รัน migration ตอน deploy | `cicd-and-release` |
| ที่เก็บ connection string | `config-and-secrets` |
| ตาราง user, role, session | `auth-implementation-patterns` |
| วาดผัง ER | `svg-diagram-system` หรือ `markdown-visuals` |
| บันทึกเหตุผลที่เลือกฐานข้อมูลตัวนี้ | `adr-writer` |

**ไวยากรณ์เฉพาะแต่ละฐานข้อมูล ชนิดข้อมูลเทียบกัน และคำสั่ง migration ของแต่ละ ORM** → `references/per-stack.md`


## reference: per-stack.md

# ไวยากรณ์และเครื่องมือแยกตามฐานข้อมูล/ORM

1. [ชนิดข้อมูลเทียบกัน](#1--ชนิดข้อมูลเทียบกัน)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [คำสั่งตรวจ query ช้า](#9--คำสั่งตรวจ-query-ช้า)

---

## 1 · ชนิดข้อมูลเทียบกัน

| ต้องการเก็บ | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| id เรียงเพิ่ม | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` หรือ `CHAR(36)` |
| เงิน | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| เวลา + โซนเวลา | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (เก็บ UTC) |
| วันที่ล้วน | `date` | `date` | `DATE` |
| ข้อความยาวไม่จำกัด | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| ข้อความไทย | `text` (UTF-8 อยู่แล้ว) | **`nvarchar` เท่านั้น** | `utf8mb4` |
| จริง/เท็จ | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (มี index ได้) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| ไฟล์ไบนารี | `bytea` (หรือเก็บนอกฐานข้อมูล) | `varbinary(max)` | `BLOB` |

> 🚨 **SQL Server + ภาษาไทย** — `varchar` ทำให้ตัวอักษรไทยกลายเป็น `?`
> ต้องใช้ `nvarchar` และเขียนค่าคงที่เป็น `N'ข้อความ'` เสมอ
>
> 🚨 **MySQL ต้องเป็น `utf8mb4`** — ชุดอักขระที่ชื่อ `utf8` เฉย ๆ ของ MySQL
> เก็บได้แค่ 3 ไบต์ ทำให้อีโมจิและอักขระบางตัวหาย

---

## 2 · PostgreSQL

```sql
CREATE TABLE orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no      varchar(20)  NOT NULL,
  customer_id   bigint       NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status        varchar(20)  NOT NULL DEFAULT 'draft',
  total_amount  numeric(19,4) NOT NULL DEFAULT 0,
  currency      char(3)      NOT NULL DEFAULT 'THB',
  meta          jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0),
  CONSTRAINT ck_orders_status CHECK (status IN ('draft','confirmed','shipped','cancelled'))
);

CREATE UNIQUE INDEX ux_orders_order_no ON orders (order_no) WHERE deleted_at IS NULL;
CREATE INDEX ix_orders_customer_id ON orders (customer_id);
CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC);
```

**สร้าง index โดยไม่ล็อกตาราง:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- ห้ามอยู่ใน transaction · ถ้าล้มจะเหลือ index สถานะ invalid ต้อง DROP แล้วทำใหม่
```

**อัปเดต `updated_at` อัตโนมัติ:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**row-level security สำหรับระบบหลายผู้เช่า:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- แอปตั้งค่าต่อ connection: SET app.tenant_id = '42';
```

---

## 3 · SQL Server

```sql
CREATE TABLE orders (
  id            bigint IDENTITY(1,1) PRIMARY KEY,
  order_no      nvarchar(20)   NOT NULL,
  customer_id   bigint         NOT NULL,
  status        nvarchar(20)   NOT NULL CONSTRAINT df_orders_status DEFAULT N'draft',
  total_amount  decimal(19,4)  NOT NULL CONSTRAINT df_orders_total DEFAULT 0,
  created_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_created DEFAULT sysdatetimeoffset(),
  updated_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_updated DEFAULT sysdatetimeoffset(),
  row_version   rowversion,
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0)
);

CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC)
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL เท่านั้น
```

- `rowversion` ใช้เป็น ETag สำหรับตรวจการแก้ชนกันได้ตรง ๆ
- เรียงลำดับภาษาไทย ให้ตั้ง collation `Thai_100_CI_AS` ที่ระดับคอลัมน์หรือฐานข้อมูล
- `datetime` แบบเก่ามีความละเอียดแค่ 3.33 มิลลิวินาที — ใช้ `datetime2` / `datetimeoffset` แทน

---

## 4 · MySQL / MariaDB

```sql
CREATE TABLE orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(20)   NOT NULL,
  customer_id  BIGINT        NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_orders_order_no (order_no),
  KEY ix_orders_customer_id (customer_id),
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- `ALTER TABLE` ส่วนใหญ่เขียนตารางใหม่ทั้งตาราง — ตารางใหญ่ให้ใช้ `pt-online-schema-change` หรือ `gh-ost`
- ตั้งเวลาเซิร์ฟเวอร์เป็น UTC (`default_time_zone = '+00:00'`)

---

## 5 · MongoDB

```js
db.createCollection("orders", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["orderNo", "customerId", "totalAmount", "createdAt"],
    properties: {
      orderNo:     { bsonType: "string" },
      customerId:  { bsonType: "objectId" },
      totalAmount: { bsonType: "decimal" },   // ❌ อย่าใช้ double กับเงิน
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอและไม่โตไม่จำกัด** · นอกนั้นให้อ้างอิง
- เอกสารหนึ่งใบมีเพดาน 16 MB — อาเรย์ที่โตเรื่อย ๆ จะชนเพดานวันหนึ่ง
- `Decimal128` เท่านั้นสำหรับเงิน

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ✅ ตรวจ SQL ก่อนรันจริง
dotnet ef database update                                # dev เท่านั้น
```

> **บน production ให้รัน script ที่ตรวจแล้ว ไม่ใช่ `database update`**
> คำสั่งนั้นต้องการสิทธิ์แก้ schema จาก connection ของแอป ซึ่งไม่ควรมีอยู่แล้ว

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete ทั้งระบบ
    e.Property(x => x.RowVersion).IsRowVersion();        // ตรวจการแก้ชนกัน
});
```

---

## 7 · Prisma / Drizzle (Node)

```prisma
model Order {
  id          BigInt   @id @default(autoincrement())
  orderNo     String   @unique @map("order_no") @db.VarChar(20)
  totalAmount Decimal  @map("total_amount") @db.Decimal(19, 4)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(3)
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  BigInt   @map("customer_id")

  @@index([status, createdAt], name: "ix_orders_status_created")
  @@map("orders")
}
```

```bash
npx prisma migrate dev --name add_order_status   # dev — สร้างไฟล์ migration
npx prisma migrate deploy                        # production — รันเฉพาะที่มีอยู่แล้ว
```

- `Decimal` ของ Prisma กลับมาเป็น object ไม่ใช่ number — คำนวณด้วย `decimal.js` อย่าแปลงเป็น float
- `BigInt` แปลงเป็น JSON ตรง ๆ ไม่ได้ ต้องแปลงเป็น string ที่ชั้น API

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

```python
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")
    op.alter_column("orders", "status", nullable=False)
    op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                    postgresql_concurrently=True)
```

> `--autogenerate` **ไม่เห็น** การเปลี่ยนชื่อ (มองเป็นลบแล้วเพิ่มใหม่ = ข้อมูลหาย)
> อ่านไฟล์ที่มันสร้างทุกครั้งก่อน commit

---

## 9 · คำสั่งตรวจ query ช้า

| ฐานข้อมูล | คำสั่ง |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · ส่วนขยาย `pg_stat_statements` |
| SQL Server | เปิด "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**สัญญาณอันตรายที่ต้องแก้:** `Seq Scan` / `Table Scan` บนตารางใหญ่ ·
จำนวนแถวที่ประมาณไว้ต่างจากที่ได้จริงเกินสิบเท่า · `Nested Loop` ที่วนหลักแสนรอบ


---

# skill: api-conventions

Use when starting an API, adding endpoints, or reviewing one for consistency. The project-wide rulebook decided once and applied everywhere — URL naming, versioning and what counts as a breaking change, pagination, how dates, money, identifiers and nulls are represented, validation errors, idempotency and deprecation. Ships a fillable conventions document.

# ข้อตกลงของ API

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกันแบบ "ไม่ค่อยถูกตามทฤษฎี" ใช้งานง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ — เพราะฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ในของเดิม และอยากให้เข้ากันได้
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "การเปลี่ยนนี้ทำให้ client พังไหม"

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` |
| health check, error envelope, graceful shutdown | `web-service-essentials` |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` |
| token, scope, สิทธิ์ | `auth-implementation-patterns` |

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `API-CONVENTIONS.md` ที่รากโปรเจกต์ (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
ทุกข้อในหน้านี้ที่ตัดสินใจแล้ว ให้เขียนลงไฟล์นั้น พร้อมวันที่และเหตุผลสั้น ๆ

> ข้อตกลงที่อยู่ในหัวคนใดคนหนึ่ง ไม่ใช่ข้อตกลง — คนที่เข้าทีมเดือนหน้าจะทำอีกแบบ

---

## 2 · ตั้งชื่อ URL

```
GET    /v1/orders                 รายการ
POST   /v1/orders                 สร้าง
GET    /v1/orders/{id}            รายตัว
PATCH  /v1/orders/{id}            แก้บางส่วน
PUT    /v1/orders/{id}            แทนที่ทั้งตัว
DELETE /v1/orders/{id}            ลบ
GET    /v1/orders/{id}/items      ทรัพยากรลูก
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD
```

| กฎ | ✅ | ❌ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่มี `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ — ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`) เป็นค่าเริ่มต้นที่แนะนำ
และต้องตอบให้ได้ว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**อะไรคือการเปลี่ยนที่ทำให้ฝั่งเรียกพัง:**

| การเปลี่ยน | พังไหม |
|---|:--:|
| เพิ่ม endpoint ใหม่ | ไม่ |
| เพิ่มฟิลด์ **ที่ไม่บังคับ** ใน request | ไม่ |
| เพิ่มฟิลด์ใน response | ไม่* |
| เพิ่มค่า enum ใหม่ | **พัง** — client ที่ `switch` ครบทุกค่าจะเจอค่าที่ไม่รู้จัก |
| ลบ/เปลี่ยนชื่อฟิลด์ | **พัง** |
| เปลี่ยนชนิดข้อมูล (`"12"` → `12`) | **พัง** |
| ทำให้ฟิลด์ที่เคยไม่บังคับกลายเป็นบังคับ | **พัง** |
| เปลี่ยน HTTP status ที่คืนในกรณีเดิม | **พัง** |
| ทำให้กฎ validation เข้มขึ้น | **พัง** |

\* ต่อเมื่อบอกฝั่งเรียกไว้แต่แรกว่า "ฟิลด์ที่ไม่รู้จักให้ข้ามไป"
ข้อนี้ต้องเขียนไว้ใน `API-CONVENTIONS.md` ไม่ใช่หวังเอาเอง

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** — แต่ละเวอร์ชันที่ยังเปิดอยู่คือโค้ดที่ต้องดูแลอีกชุด

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" คือรายการที่จะมีหมื่นรายการในสองปี

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีการเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ช้าลงเรื่อย ๆ · ข้อมูลซ้ำ/หายเมื่อมีการแทรกระหว่างหน้า |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null เมื่อหมดแล้ว
    "hasMore": true
  }
}
```

- ห่อรายการไว้ใน `data` เสมอ — ตอบเป็นอาเรย์เปล่า ๆ แล้ววันหนึ่งจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` เป็นของแพง — ทำเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** — ฝั่งเรียกห้ามแกะหรือประกอบเอง

---

## 5 · filtering · sorting · ฟิลด์ที่ขอ

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| เรื่อง | ข้อตกลง |
|---|---|
| กรองค่าเท่ากับ | `?status=confirmed` |
| หลายค่า | `?status=confirmed,shipped` |
| ช่วง | `?createdAt[gte]=...&createdAt[lt]=...` |
| เรียง | `?sort=-createdAt,orderNo` — `-` คือมากไปน้อย |
| ค้นหาข้อความ | `?q=สมชาย` แยกจากการกรอง |
| เลือกฟิลด์ | `?fields=id,orderNo` |

- **อนุญาตเฉพาะฟิลด์ที่กำหนดไว้** — รับชื่อฟิลด์อะไรก็ได้ = ช่องโหว่และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ให้ตอบ `400` ดีกว่าเงียบ ๆ ข้าม — ฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

---

## 6 · รูปแบบข้อมูล

| ข้อมูล | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ชื่อฟิลด์ | `camelCase` ทั้งระบบ | `createdAt` |
| เวลา | RFC 3339 · UTC · ลงท้าย `Z` | `"2026-09-25T09:42:13.482Z"` |
| วันที่ล้วน | `YYYY-MM-DD` | `"2026-09-25"` |
| เงิน | ตัวเลขเป็น**สตริง** + สกุลเงินแยก | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **สตริงเสมอ** | `"1042"` ไม่ใช่ `1042` |
| enum | `SCREAMING_SNAKE` หรือ `lower_snake` เลือกแบบเดียว | `"CONFIRMED"` |
| ระยะเวลา | วินาทีเป็นตัวเลข ตั้งชื่อให้รู้หน่วย | `"timeoutSeconds": 30` |
| ประเทศ / สกุลเงิน / ภาษา | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> 🚨 **id เป็นตัวเลขใน JSON คือระเบิดเวลา** — JavaScript เก็บจำนวนเต็มได้ปลอดภัยถึง 9,007,199,254,740,991
> `bigint` ที่โตเกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และเปลี่ยนเป็นสตริงทีหลังคือ breaking change
>
> 🚨 **เงินเป็น float ใน JSON** — `1250.10` ที่วิ่งผ่านสองภาษาอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องต่างกันอย่างชัดเจน:**

- ใน response — ฟิลด์ที่มีอยู่แต่ไม่มีค่า ให้ส่ง `null` ไม่ใช่ตัดออก ฝั่งเรียกจะได้ไม่ต้องเช็คสองแบบ
- ใน `PATCH` — `{"note": null}` = ล้างค่า · ไม่ส่งคีย์ `note` เลย = ไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** — ฝั่งเรียกจะได้วนลูปได้เลย

---

## 7 · error

รูปแบบ error envelope อยู่ที่ `web-service-essentials` (RFC 9457) — ใช้ตัวเดียวกัน
สิ่งที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

```jsonc
// 422 Unprocessable Content
{
  "type": "https://api.acme.co/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "traceId": "01J9Z8...",
  "errors": [
    { "field": "email",          "code": "invalid_format", "message": "รูปแบบอีเมลไม่ถูกต้อง" },
    { "field": "items[0].qty",   "code": "min_value",      "message": "ต้องมากกว่า 0" }
  ]
}
```

- **`code` คือของที่โปรแกรมอ่าน · `message` คือของที่คนอ่าน** — อย่าให้ฝั่งเรียกต้องแปลงข้อความเป็นเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ให้ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่งห้ารอบ
- ข้อความภาษาไทยหรืออังกฤษ เลือกจาก `Accept-Language` ถ้ารองรับหลายภาษา

**เลือก status ให้ตรง:** `400` รูปแบบคำขอผิด · `401` ยังไม่ได้ยืนยันตัวตน · `403` ยืนยันแล้วแต่ไม่มีสิทธิ์ ·
`404` ไม่มีหรือไม่ให้รู้ว่ามี · `409` ชนกับสถานะปัจจุบัน · `422` รูปแบบถูกแต่ข้อมูลไม่ผ่านกฎ · `429` เรียกถี่เกิน

---

## 8 · เรียกซ้ำไม่เกิดผลซ้ำ และการแก้ชนกัน

### idempotency key (รหัสกำกับคำขอ — ส่งซ้ำแล้วไม่ทำงานซ้ำ)

**บังคับกับทุก `POST` ที่มีผลทางการเงินหรือส่งของออกไปข้างนอก**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← ฝั่งเรียกสร้าง เก็บไว้ใช้ตอน retry
```

- เซิร์ฟเวอร์เก็บคู่ (key, ผลลัพธ์) ไว้อย่างน้อย 24 ชั่วโมง
- key เดิม + เนื้อหาเดิม → คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิม + เนื้อหา**ต่าง** → `422` ไม่ใช่ทำงานใหม่
- เครือข่ายขาดตอนรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ — ฝั่งเรียก retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มีสิ่งนี้ คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

`429` ที่ไม่มี `Retry-After` ทำให้ฝั่งเรียกเดาเอง แล้วส่วนใหญ่จะเดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: true
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** — ติดต่อไปตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่สมเหตุสมผล: API ภายใน 1 รอบ release · API ที่คนนอกใช้ อย่างน้อย 6 เดือน

---

## 11 · Anti-patterns

- ❌ **`200 OK` พร้อม `{"success": false}`** — ทำให้ตัวตรวจสอบและ log ทั้งระบบตาบอด
- ❌ **กริยาใน URL** — `/createOrder`, `/getOrderById`
- ❌ **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูลห้าหมื่นแถวพร้อมกัน
- ❌ **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- ❌ **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงหลุดข้อมูลภายใน
- ❌ **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- ❌ **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงให้เองโดยไม่มีใครกด
- ❌ **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- ❌ **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง

---

## 12 · ตัวย่อ

- **API** — Application Programming Interface (ช่องทางให้โปรแกรมเรียกใช้กันเอง)
- **CRUD** — Create Read Update Delete (สร้าง อ่าน แก้ ลบ)
- **RFC 3339** — มาตรฐานรูปแบบวันเวลาในข้อความ
- **RFC 9457** — มาตรฐานรูปร่างข้อความ error ของ HTTP
- **ETag** — Entity Tag (รหัสระบุรุ่นของข้อมูล ใช้ตรวจว่ามีคนแก้ไปก่อนไหม)
- **ISO 4217** — มาตรฐานรหัสสกุลเงิน เช่น THB
- **OpenAPI** — รูปแบบมาตรฐานสำหรับบรรยาย API ให้เครื่องอ่านได้

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| health check · error envelope · timeout | `web-service-essentials` |
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ | command `/api-design` |
| ชนิดข้อมูลในฐานข้อมูล | `database-design` |
| token · scope · สิทธิ์ | `auth-implementation-patterns` |
| correlation id ที่โผล่ใน error | `logging-standards` |
| test สัญญาระหว่างระบบ | `testing-standards` |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`
