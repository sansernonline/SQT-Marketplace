# skill: pdpa-compliance

Use when a system holds personal data about people in Thailand. Data inventory, lawful basis, withdrawable consent, subject rights, minimisation, retention that deletes, processors, breach first hours. Not legal advice.

# PDPA — ข้อมูลส่วนบุคคล

> **กฎข้อเดียว:** ข้อมูลที่ไม่ได้เก็บ คือข้อมูลที่ไม่รั่ว ไม่ต้องดูแล และไม่ต้องลบ
> คำถามแรกเสมอคือ "จำเป็นต้องเก็บไหม" ไม่ใช่ "เก็บยังไงให้ปลอดภัย"

> ⚠️ นี่คือแนวทางสำหรับคนทำระบบ **ไม่ใช่คำแนะนำทางกฎหมาย**
> เรื่องที่มีผลทางกฎหมายต้องให้ที่ปรึกษากฎหมายตัดสิน

## ทางลัด — แอปที่ข้อมูลอยู่ในเครื่องผู้ใช้เท่านั้น

ไม่มีเซิร์ฟเวอร์ ไม่มีบัญชี ไม่ส่งข้อมูลออก → ข้ามหัวข้อเรื่องผู้ประมวลผลและฐานข้อมูลได้ เหลือตรวจ 3 เรื่องนี้

| เรื่อง | ทำไมยังเกี่ยว | ทำอะไร |
|---|---|---|
| Android Auto Backup | ระบบสำรองข้อมูลแอปขึ้น Google Drive เองโดยค่าเริ่มต้น | ตั้ง `android:allowBackup` และ `android:dataExtractionRules` ให้ตรงกับที่ตั้งใจ · ลงเหตุผลใน `decision-log` |
| ส่งออก · share sheet (หน้าต่างแชร์ของระบบ) | ข้อมูลออกจากเครื่องทางนี้ทางเดียว | ส่งเฉพาะที่ผู้ใช้เลือก · ไม่แนบตำแหน่งหรือ metadata ของภาพโดยไม่บอก |
| ข้อมูลที่ร้านค้าบังคับให้แจ้ง | Google Play บังคับกรอกแบบฟอร์ม Data safety ทุกแอป | กรอกตามจริง (ไม่เก็บ ก็ตอบว่าไม่เก็บ) · ขอสิทธิ์กล้องแล้วต้องมีนโยบายความเป็นส่วนตัวไหม `(รอยืนยัน)` — เตรียมหน้าสั้น ๆ ไว้ก่อน |

ภายหลังเพิ่ม analytics · crash report · บัญชีผู้ใช้ = ไม่ใช่แอปในเครื่องอย่างเดียวแล้ว กลับไปใช้ทั้ง skill

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

# skill: markdown-visuals

Use when a markdown document needs a picture (wireframe, UI state, architecture, flow, data viz). Picks inline SVG, image, ASCII or Mermaid and embeds it so it renders in GitHub, Notion, VS Code and Obsidian.

# Markdown Visuals

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- Producing **any** design mockup, wireframe, or UI spec
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user said "make a mockup," "show me how it looks," or "design X"

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

---

## Decision tree: which format?

```
What are you showing?
│
├─ UI mockup / component state / icon       →  Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (see polished-document-style)
├─ Architecture / ER / class                →  Mermaid
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG
├─ Photo, screenshot, complex illustration  →  External file → ![alt](assets/x.png)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Default to inline SVG** for anything that isn't a flow/sequence (use Mermaid for those). It renders everywhere, versions in git, doesn't bloat the repo with binaries, and the user can read/edit the markup.

---

## 1 · Inline SVG (primary technique)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background -->
  <rect width="640" height="280" rx="14" fill="#1c2230"/>

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
- Mockup of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

**อย่าเลือกสีเอง** ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ใช้ชุดนั้น
ถ้ายังไม่มี ให้เสนอโทนจากเนื้องานแล้วรอผู้ใช้ยืนยัน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน `svg-diagram-system` ข้อ 0)

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีหลักที่ผู้ใช้เลือก** |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**หนึ่งเอกสารใช้หนึ่งชุด** — รูปสิบรูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปที่ไม่สวยแต่สีตรงกัน

### Reusable SVG snippets

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

### Worked example — UI state mockup

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states:

```markdown
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
![Hover state showing magnified Projects tile](assets/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="assets/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file alongside the doc.

---

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

### Box-drawing characters

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

### Common patterns

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

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

---

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ต้องคุมตำแหน่งเอง → SVG หรือ `svg-diagram-system` |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง → ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ → ไฟล์ภาพ |

---

## Combining formats in one doc

A full design spec usually mixes formats. Pattern from `DockXI/docs/12-design-mockup.md`:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't pick one format and force everything into it — each format has a sweet spot.

---

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

---

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG with 200+ lines** — extract to `assets/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax for GitHub compat
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

---

## Quick-start recipe

When the user asks for a design / mockup:

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

If unsure whether a visual will render, mention that the user should preview in GitHub/Notion to confirm.

---

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`
