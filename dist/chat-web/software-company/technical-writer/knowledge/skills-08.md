# skill: project-doc-set

Use when a project needs its doc set decided (which docs, order, where they live) or DRAFT open items listed in one Excel.

# ชุดเอกสารโปรเจกต์

> **กฎข้อเดียว:** เอกสารทุกชิ้นต้องตอบได้ว่า **ใครอ่าน** และ **อ่านแล้วตัดสินใจอะไร**
> ถ้าตอบไม่ได้ ก็ไม่ต้องเขียน

---

## เมื่อไหร่ใช้ skill นี้

เปิดโปรเจกต์ใหม่แล้วต้องตัดสินว่ามีเอกสารอะไร · เอกสารกระจัดกระจายไม่รู้ว่าอันไหนตัวจริง · ลูกค้าถามว่าส่งมอบอะไรบ้าง · จะเขียนเอกสารแต่ไม่แน่ใจว่าต้องมีอะไรก่อน

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้แทน |
|---|---|
| โครงโฟลเดอร์ของ**โค้ด** (รวม `docs/` ในโค้ดของแบบ A) · README · CHANGELOG · linter | `project-bootstrap` |
| ตั้ง**ชื่อไฟล์** และเลขเวอร์ชันของเอกสาร | `document-naming` |
| ลงมือเขียนเอกสารชิ้นใดชิ้นหนึ่ง | skill ของเอกสารนั้น (ตารางข้อ 4) |
| จัดรูปแบบหน้าเอกสารให้สวย | `branded-document-design` |

---

## 1 · เอกสารอยู่ในหรืออยู่นอก repo

**ตัดสินข้อนี้ก่อน** (ย้ายทีหลังต้องแก้ลิงก์ทั้งโปรเจกต์) · **ค่าเริ่มต้นคือแบบ B** แม้เอกสารเป็น markdown ล้วน โค้ดอยู่ใน `<project-name>/` (ตัวพิมพ์เล็กคั่น `-`) · แบบ A เมื่อผู้ใช้ขอเท่านั้น

- **แบบ B** (เอกสารนอก repo) — ใช้กับทุกขนาดชุด (S · M · L) · `.docx` / `.xlsx` / mockup / PNG ที่ลูกค้าต้องเห็นไม่ปนใน pull request · ผังรากอยู่ข้างล่าง (ข้อนี้คือเจ้าของผังราก)
- **แบบ A** (เอกสารใน repo) — เฉพาะเมื่อผู้ใช้ขอ และเอกสารเป็น markdown ล้วน · เอกสารกับโค้ดเปลี่ยนใน pull request เดียวกัน · รากเหมือนแบบ B แต่ไม่มี `docs/` ที่ราก — `docs/` อยู่ในโฟลเดอร์โค้ด ผังข้างในเป็นของ `project-bootstrap` ข้อ 1
- แบบ A ที่โตจนมีเอกสารส่งมอบ → ย้ายเป็นแบบ B **ทั้งชุดในครั้งเดียว** เอกสารที่อยู่ 2 ที่คือมี 2 เวอร์ชัน

### โครงของแบบ B

```
<ชื่อโปรเจกต์>/
├─ ref/                 ของที่ได้รับมา — TOR · บันทึกประชุม · ภาพหน้าจอระบบเดิม · ไฟล์จากลูกค้า  **อ่านอย่างเดียว ห้ามแก้**
├─ docs/                เอกสารทุกชิ้นที่เราเขียน — .docx ส่งมอบ และ .md เชิงเทคนิค อยู่ด้วยกัน
│  ├─ figures/          รูปที่ export แล้ว — .png เท่านั้น        [มีเมื่อมีรูปในเอกสารส่งมอบ]
│  │  └─ src/           ไฟล์ต้นทางของรูป (.html · .mmd · .drawio)
│  ├─ decisions/        ADR-NNNN-<slug>.md หนึ่งการตัดสินใจต่อไฟล์  [ทางเลือก]
│  ├─ runbook-<เรื่อง>.md  คู่มือเมื่อระบบมีปัญหา ไฟล์ละเรื่อง        [ทางเลือก]
│  └─ research/         research แอปต้นแบบ (`reference-app-research`) [ทางเลือก]
├─ mockup/              .html ที่เปิดแล้วกดได้จริง
├─ qa/                  test case · ผลทดสอบ · bugs/ รายงานบั๊ก
├─ assets/              โลโก้ · ไอคอนทุกขนาด · favicon · wordmark (ต้นทาง .svg + ไฟล์ export)
├─ _to_delete/          ของชั่วคราวทุกอย่าง
├─ .claude/            skill ของโปรเจกต์ (เช่น verify) — ต้องอยู่ที่ที่เปิด Claude Code
│  └─ superuser/        ไฟล์ทำงานของ SuperUser — CONTEXT.md · HISTORY.md · IMPROVEMENTS.md · log/ · inbox/ · learn/
└─ <project-name>/      repo โค้ด ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-` — โครงข้างในเป็นของ `project-bootstrap`
```

**ไฟล์ของ SuperUser** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`) — ต้นฉบับอยู่ที่ [`superuser/references/team-files.md`](../superuser/references/team-files.md) ที่เดียว

**ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ `<project-name>/docs/`** (แบบ A ย้ายทั้ง `docs/` เข้าโฟลเดอร์โค้ด ผังข้างในเหมือนกัน) (`docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<เรื่อง>.md`) — ข้อนี้คือที่เดียวที่กำหนด

**ข้อยกเว้นของราก:** `.sandbox/` อยู่ที่รากได้เมื่อใช้ `docker-sandbox` · `AGENTS.md` / `GEMINI.md` ตามเงื่อนไขข้างบน — ทุกข้อยกเว้นต้องประกาศใน README ของโฟลเดอร์โค้ด

**โฟลเดอร์สร้างเมื่อมีของจริง ไม่สร้างเผื่อ:** `ref/` เมื่อได้ไฟล์จากลูกค้าหรือระบบเดิม (ห้ามปนใน `docs/`) · `docs/figures/` เมื่อมีรูปวาดเองในเอกสารส่งมอบ (ไม่งั้นรูปติดอยู่ใน `.docx` แก้ไม่ได้) · `docs/decisions/` เมื่อมีการตัดสินใจที่ต้องอธิบายทีหลัง · `docs/research/` เมื่อผู้ใช้อยากได้แอปแบบที่มีอยู่ · `qa/` เมื่อมี test case (test case อยู่ที่นี่เสมอ `docs/test-plan.md` มีแค่แผน) · `assets/` เมื่อมีโลโก้หรือไอคอน

**โปรเจกต์แบบ ecosystem** (sub-project ≥ 2 ตัว แต่ละตัวมีเอกสารชุดของตัวเอง) → โฟลเดอร์ชื่อ `ecosystem/` เสมอ (ห้าม `projects/` `modules/` `apps/`) · `ecosystem/<รหัส>-<SUB>/` มี `docs/` `mockup/` `qa/` และ repo ของตัวเอง · เอกสารที่ครอบทุกตัวอยู่ `docs/` ที่รากที่เดียว · ผังและกฎเต็ม → [`references/ecosystem.md`](references/ecosystem.md)


**กฎของโฟลเดอร์ (ใช้ได้ทั้ง 2 แบบ):**

- **`.docx` กับ `.md` อยู่ใน `docs/` เดียวกันได้** ไม่ต้องแยกโฟลเดอร์ เพราะนามสกุลบอกอยู่แล้วว่าใครอ่าน
- **ไฟล์ต้นทางของรูปห้ามหาย** เพราะถ้าปีหน้าต้องแก้รูปแล้วเหลือแต่ PNG ก็ต้องวาดใหม่ทั้งใบ
- **ทุกปุ่มใน mockup ต้องกดได้จริง** เพราะปุ่มหลอกทำให้รีวิวผิด
- **`.docx` / `.xlsx` อยู่ใน `docs/` และ `qa/` เท่านั้น** ไม่กระจายไปรากโปรเจกต์
- **ของชั่วคราวลง `_to_delete/`** (`temp-file-discipline`)
- **`docs/README.md` เป็นสารบัญ** บอกว่าอ่านอะไรก่อนและใครเป็นเจ้าของ (แม่แบบใน `project-bootstrap` → `assets/starter-files.md`)

---

## 2 · เลือกชุดเอกสารตามขนาดงาน

ขนาดวัดจาก **ระยะเวลา × จำนวนคนที่ต้องเห็นพ้องกัน** ไม่ใช่จำนวนบรรทัดโค้ด

**S** ≤ 2 สัปดาห์ · ทีมเดียว · ไม่มีใครนอกทีมต้องเซ็น — **M** 1–3 เดือน · ผู้ว่าจ้างภายใน · ส่งมอบเป็นรอบ — **L** > 3 เดือน · ลูกค้าภายนอกเซ็นรับ · มีข้อผูกพันตามสัญญา

### 2.1 · เอกสารส่งมอบ — คนอ่านและเซ็น

| เอกสาร | รูปแบบ | ผู้อ่าน | S | M | L |
|---|---|---|:-:|:-:|:-:|
| Project Plan | `.docx` | ผู้ว่าจ้าง · ทีม | ○ | ● | ● |
| SRS | `.docx` | dev · ผู้ว่าจ้าง | ○ | ● | ● |
| Architecture | `.docx` | dev · ops | ○ | ● | ● |
| Test Plan | `.docx` | QA · ผู้ว่าจ้าง | ○ | ● | ● |
| คู่มือผู้ใช้ (`MAN`) | `.docx` → `.pdf` | ผู้ใช้ปลายทาง | ○ | ● | ● |
| FSD | `.docx` | dev · QA | ○ | ○ | ● |
| BRD | `.docx` | ฝ่ายธุรกิจ | ○ | ○ | ● |
| Document Checklist | `.docx` | ทุกฝ่าย | ○ | ○ | ● |
| Test Cases | `.xlsx` | QA | ○ | ○ | ● |

● ต้องมี · ○ ไม่ต้อง เว้นแต่มีเหตุผลเฉพาะ
**ชุด S ไม่มีเอกสารกลุ่มนี้เลย** — ถูกแล้ว

---

### 2.2 · เอกสารเชิงเทคนิค — ทีมและ agent ใช้ระหว่างสร้าง

เป็น markdown ทั้งหมด และ**ขึ้นกับว่าโปรเจกต์มีอะไร** ไม่ใช่ขนาดงาน · ตารางเต็ม (ไฟล์ · ตอบคำถามอะไร) → [`references/technical-docs.md`](references/technical-docs.md)

- **เสมอ:** `<project-name>/README.md` · `docs/BUILD-PLAN.md`
- **มีเงื่อนไข:** USER-STORIES และ `docs/sprints/sprint-NN.md` (ทำงานเป็น sprint) · AGENT-LOOP (agent เขียนโค้ดเป็นรอบ) · API-SPEC (มี API ที่คนอื่นเรียก) · DATA-DICTIONARY (มีฐานข้อมูล) · EVALUATION-POLICY และ PROMPT-LIBRARY (ใช้ LLM) · `docs/decisions/ADR-NNNN-<slug>.md` (การตัดสินใจที่จะถูกถามซ้ำ) · `docs/runbook-<เรื่อง>.md` (ระบบรันจริงและมีคนอยู่เวร)
- ตัวที่คนลืมบ่อยสุดคือ 4 ตัวเรื่อง LLM · API · ฐานข้อมูล แล้วต้องถาม agent ซ้ำทุกรอบว่า prompt ตัวไหนคือตัวจริง

---

## 3 · ลำดับการเขียน

**สายส่งมอบ** — ห้ามข้ามขั้นที่อยู่ในชุดของขนาดงานนั้น (ขั้นที่ไม่อยู่ในชุด เช่น BRD · FSD ของชุด M ให้ข้ามไป)

```
Project Plan ─► BRD ─► SRS ─┬─► mockup
                            └─► Architecture ─► FSD
                                                 │
              User Guide ◄─ Test Cases ◄─ Test Plan
```

**ชิ้นถัดไปเขียนต่อบนฉบับ DRAFT ของชิ้นก่อนหน้าได้** ข้อที่ยังไม่ยืนยันใส่ `(รอยืนยัน)` ไว้ทั้งสองชิ้น · ห้ามเปลี่ยนสถานะชิ้นถัดไปเป็น APPROVED ก่อนชิ้นก่อนหน้า เพราะถ้าชิ้นต้นทางเปลี่ยนต้องรื้อทั้งสาย
ข้อยกเว้นเดียว: **mockup ทำคู่ไปกับ SRS ได้** เพราะภาพหน้าจอช่วยให้ SRS ถูกยืนยันเร็วขึ้น

### 3.1 · ทะเบียนจุดค้าง — ผู้ใช้ถามว่า "ยังติดตรงไหน" ตอบเป็นไฟล์ Excel ไม่ใช่ข้อความในแชต

ป้าย `(รอยืนยัน)` · `(รอวัดใน Phase 0)` และตารางคำถามกระจายอยู่ทุกเอกสาร ผู้ตัดสินใจจึงไม่เห็นภาพรวม · รวมเป็นไฟล์เดียวด้วยสคริปต์ ไม่ไล่อ่านเอง:

```
python scripts/open_items.py docs/ docs/<CODE>-OPEN-ITEMS.xlsx --project <CODE>    # ทดสอบสคริปต์: --self-test
```

- อ่านทุก `.docx` ใน `docs/`: ตารางคำถาม · ตารางข้อสมมติที่ยังไม่ตัดสิน · ตารางลงนามที่ยัง "รอ" · ป้ายในเนื้อหา · ข้ามประวัติการแก้ไข สารบัญ บรรทัดอธิบายป้าย และ `(รอบหลัง)`
- แผ่น **สรุป** นับตามเอกสาร × ประเภทด้วยสูตร · แผ่น **รายการค้าง** มีหัวข้อในเอกสาร · ใครตอบ · ตัดสินภายใน · ค่าที่ใช้ไปก่อน · ข้อที่อ้างถึงกัน · ช่อง "สถานะ" และ "คำตอบ" ให้กรอก
- ประเภท: **เจ้าของตัดสิน** (ค้นเว็บแล้วปิดไม่ได้) · **ทีมตัดสิน** (BA · SA) · **กฎหมาย** · **วัดจริง** (ไม่มีตัวเลขเผยแพร่) · **ลงนาม** — คำถามที่อ้างคำถามของเจ้าของในเอกสารอื่นถูกนับเป็น "เจ้าของตัดสิน" ด้วย
- **ก่อนส่ง เปิดอ่านรายการด้วยตาเอง** — สคริปต์จับจากถ้อยคำ แถวที่ตอบไปแล้วแต่เขียนไม่ตรงคำว่า "ตอบแล้ว · ปิดแล้ว · ตัดสินแล้ว" ยังติดมา · ในชุดตัวอย่างหนึ่ง (6 ฉบับ) ได้ 75 รายการ มีแถวแบบนี้ราว 3 แถว
- ผู้ใช้กรอกคำตอบแล้ว → เติมคำตอบลงเอกสารต้นทาง ลบป้าย บันทึกในประวัติการแก้ไข แล้วรันสคริปต์ซ้ำ · ไฟล์นี้เป็นรายการงาน ไม่ใช่ต้นฉบับ อย่าแก้คำตอบในไฟล์นี้แทนเอกสาร

**สายเทคนิค** — เขียนเมื่อถึงจุดที่ต้องใช้ ไม่ต้องรอใคร: README · BUILD-PLAN ก่อนโค้ดบรรทัดแรก · DATA-DICTIONARY ตอนออกแบบตารางแรก · API-SPEC ตอน endpoint แรก · PROMPT-LIBRARY ตอน prompt แรกที่ใช้จริง · ADR ตอนตัดสินใจ (ไม่ใช่ตอนสรุปท้าย เพราะเหตุผลจริงหายแล้ว) · Runbook ก่อนขึ้นระบบจริง — ตารางเต็มใน [`references/technical-docs.md`](references/technical-docs.md)

---

## 4 · ใครเขียนชิ้นไหน ด้วย skill อะไร

ตารางเต็ม (agent · skill ต่อเอกสาร 16 ชนิด) → [`references/technical-docs.md`](references/technical-docs.md) · หลัก ๆ: SRS → `srs-writing` · FSD → `fsd-writing` · ADR → `adr-writer` · Test → `test-case-template` · mockup → `web-app-design` + `ui-craft` · README → `project-bootstrap`

---

## 5 · รูปในเอกสาร — เลือกให้ถูกตั้งแต่ต้น

- รูปในเอกสารโปรเจกต์ทุกชนิด (BRD · SRS · FSD · ADR · ER · ผังขั้นตอน) · สไลด์ · งานพิมพ์ → `diagram-figures` (house style เดียว) เก็บ `docs/figures/` + ต้นทางใน `src/` · **Mermaid ค่าเริ่มต้นห้ามเข้าเอกสารโปรเจกต์**
- รูปด่วนใน README · PR · โน้ตในโค้ด → Mermaid (`software-diagrams`) ฝังใน `.md` (สีสุ่มไม่มีความหมาย ไทยล้นกรอบ ย่อลง A4 แล้วอ่านไม่ออก)

**หัวรูปทุกใบต้องมีครบ 6 อย่าง** — โลโก้โปรเจกต์ · ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ (รายละเอียดอยู่ใน `diagram-figures` ข้อ 3)
รูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมลและสไลด์แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้**

---

## 6 · ธีมสีของชุดเอกสาร

ประกาศครั้งเดียวต่อโปรเจกต์ บนหัวไฟล์ต้นทางของทุกเอกสาร:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(ตัวอย่างใช้สีประจำบ้าน `#2A78D6` — แทนด้วยสีหลักของโปรเจกต์)

`branded-document-design` · `presentation-design` · `diagram-figures`
อ่านค่านี้แทนการเลือกสีเอง เอกสาร สไลด์ และรูปทุกใบจึงเป็นชุดเดียวกัน

**สีมาจากเนื้องาน ไม่ใช่จากรสนิยม** — มีสีแบรนด์ใช้สีแบรนด์ · ยังไม่มีใช้สีประจำบ้านของ `branded-document-design` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม
ข้อยกเว้นที่ไม่เปลี่ยนตามธีม: สีโลโก้ผู้ให้บริการ · สีเทาของเส้นโครงสร้าง · เขียว = ผ่าน / แดง = ไม่ผ่าน

---

## 7 · รายการตรวจก่อนส่งมอบชุดเอกสาร

- [ ] ทุกไฟล์ `.docx` เปิด Navigation Pane แล้ว**เห็นหัวข้อครบ** (ใช้ Heading style จริง ไม่ใช่ตัวหนา)
- [ ] ทุกเอกสารมีหน้าประวัติการแก้ไข · เลขเวอร์ชัน · วันที่ · ผู้จัดทำ
- [ ] ทุกรูปมีเลขรูปและถูกอ้างในเนื้อความอย่างน้อย 1 ครั้ง
- [ ] ไฟล์ต้นทางของทุกรูปอยู่ใน `docs/figures/src/` (ถ้ามีโฟลเดอร์นี้)
- [ ] เอกสารเชิงเทคนิคที่เข้าเงื่อนไขในข้อ 2.2 มีครบ เช่น ถ้ามี API ต้องมี API-SPEC และถ้าใช้ LLM ต้องมี PROMPT-LIBRARY
- [ ] ตัวย่อทุกตัวเขียนเต็มครั้งแรกที่ปรากฏ
- [ ] ชื่อไฟล์ตรงตาม `document-naming` — ไม่มี `final2` ไม่มี `ล่าสุด`
- [ ] เอกสารในชุดอ้างเวอร์ชันของกันและกันตรงกัน
- [ ] รัน `scripts/open_items.py` แล้วทะเบียนจุดค้างไม่มีแถวสถานะ "เปิด" (หรือผู้ว่าจ้างรับรู้ทุกแถวที่ยังเปิด)
- [ ] บอกผู้ใช้ว่ามีอะไรค้างใน `_to_delete/` (ไม่ลบเอง — ลบเมื่อผู้ใช้สั่งเท่านั้น)

---

## 8 · Anti-patterns

❌ `.docx` ไม่มี Heading style · เก็บแต่ PNG ไม่เก็บต้นทาง · `.docx` และ mockup ใน repo โค้ด (ถึงจุดนี้ต้องย้ายเป็นแบบ B) · เอกสารอยู่ 2 ที่ (= 2 เวอร์ชัน) · FSD ก่อน SRS ยืนยัน · ใช้ LLM แต่ไม่มี PROMPT-LIBRARY · sub-project ชื่อ `projects/` `modules/` `apps/` · โฟลเดอร์ว่างสร้างเผื่อ · เอกสารชิ้นเดียวตอบทุกคำถาม

---

## 9 · ตัวย่อ

ADR Architecture Decision Record · BRD Business Requirements Document · FSD Functional Specification Document · QA Quality Assurance · SRS Software Requirements Specification · TOC Table of Contents

---

## 10 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: วาดรูป → `diagram-figures` (เอกสารโปรเจกต์) · `software-diagrams` (README · PR) · ของชั่วคราว → `temp-file-discipline` · สถานะเอกสารใน `docs/BUILD-PLAN.md` → `status-report` · รายการตรวจฉบับพิมพ์ → `assets/doc-set-checklist.md`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/writer-templates.md`](references/writer-templates.md) — แม่แบบเอกสารของ `technical-writer` (tutorial · API reference · release notes · README ดู `project-bootstrap`)

**คู่มือต้องขึ้นเว็บ ค้นได้ มีหลายรุ่น:** [`references/docs-site.md`](references/docs-site.md) · เลือก MkDocs Material · Docusaurus · Starlight · VitePress · ผลทดสอบค้นหาภาษาไทย · ที่วางเว็บ · ฟอนต์ไทย


## reference: docs-site.md

# เว็บเอกสาร (docs site)

เลือกตัวสร้างเว็บเอกสารเมื่อคู่มือหรือเอกสารนักพัฒนาต้องขึ้นเว็บ ค้นหาได้ และมีหลายรุ่น · ใช้คู่กับ `SKILL.md` ข้อ 1 (เอกสารอยู่ไหน) และแม่แบบใน [`writer-templates.md`](writer-templates.md)
ข้อเท็จจริงตรวจ 2026-10-23 จากเอกสารทางการ · npm · PyPI · GitHub และการทดสอบจริง (ตาราง "ที่มา")
ตัวย่อ: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · ต้องมีเว็บเอกสารไหม

| สถานการณ์ | ใช้ |
|---|---|
| คนนอกทีมอ่านบ่อย (API สาธารณะ · SDK · คู่มือที่อัปเดตทุกรุ่น) · ต้องค้นหา · มีหลายรุ่นพร้อมกัน | เว็บเอกสาร (ไฟล์นี้) |
| ทีมอ่านเอง | `README.md` + `docs/*.md` บน GitHub พอ |
| ลูกค้าเซ็นรับ | `.docx` ตาม `SKILL.md` ข้อ 2.1 · เว็บเอกสารไม่แทนเอกสารส่งมอบ |

## 2 · เทียบ 4 ตัว

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| ต้องมี | Python | Node · React | Node · Astro | Node · Vue |
| รุ่นล่าสุด | 9.7.7 | 3.10.2 | 0.42.6 (ยังไม่ถึง 1.0) | 1.6.4 · รุ่น 2.0 ยังเป็น alpha |
| ค้นหาในตัว | มี · lunr.js + lunr-languages (ตั้ง `lang: th` ได้) | ไม่มี · ตัวทางการคือ Algolia DocSearch · ค้นในเครื่องใช้ปลั๊กอินชุมชน | มี · Pagefind เปิดเองไม่ต้องตั้ง | มี · MiniSearch (`provider: 'local'`) หรือ Algolia |
| หลายรุ่น (versioning) | ผ่าน `mike` ซึ่งเป็นเครื่องมือภายนอก | ในตัว `docusaurus docs:version` | ปลั๊กอินชุมชน `starlight-versions` | ไม่มี · issue #109 ยังเปิด |
| หลายภาษา (i18n) | แปล UI ได้ (มี `th`) · เว็บหลายภาษา = โปรเจกต์ละภาษา + ตัวเลือกภาษา | ในตัว | ในตัว · มี UI ภาษาไทยมาให้ | ในตัว |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: ผู้สร้างประกาศว่าดูแลเฉพาะจุดวิกฤตถึง 5 พ.ค. 2027 และให้ย้ายไป Zensical (รุ่น 0.0.71 · สถานะ Alpha · MIT) · โปรเจกต์ใหม่ที่ต้องอยู่หลายปีให้เขียนเรื่องนี้ลง ADR
เลือกเร็ว: ทีม Python → MkDocs Material (วางแผนย้าย) · ต้องหลายรุ่นในตัว → Docusaurus · อยากได้เว็บเบา ตั้งค่าน้อย → Starlight · ทีม Vue → VitePress

## 3 · ค้นหาภาษาไทย ทดสอบจริง

ภาษาไทยไม่เว้นวรรคระหว่างคำ ตัวค้นหาที่แยกคำด้วยช่องว่างจะหาคำกลางประโยคไม่เจอ · ทดสอบ 2026-10-23 ด้วยหน้าไทย 2 หน้า ค้น 9 คำ: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| ตัวค้นหา (รุ่นที่ทดสอบ) | ใช้ใน | เอกสารบอกเรื่องไทย | เจอ |
|---|---|---|---|
| Pagefind 1.5.2 (สร้าง index แล้วค้นในเบราว์เซอร์) | Starlight | มี `th` · ไม่มี stemming · หัวข้อตัดคำพูดถึงแค่จีน ญี่ปุ่น เกาหลี | 6/9 · พลาด กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (ตัดคำด้วย wordcut · ทดสอบใน Node ไม่ใช่ในธีม) | MkDocs Material · ปลั๊กอิน `@easyops-cn/docusaurus-search-local` (รับทุกภาษาของ lunr-languages) | Material รับ `lang: th` | 6/9 · พลาด ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 ค่าตั้งต้น (prefix + fuzzy แบบ VitePress) | VitePress | VitePress ตัดคำด้วย `Intl.Segmenter` เฉพาะจีนกับญี่ปุ่น | 0/9 |
| MiniSearch + `tokenize` ที่ใช้ `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | ตั้ง `tokenize` เองได้ | 9/9 (ทดสอบใน Node 22 · ยังไม่ได้ทดสอบใน VitePress ทั้งเว็บ) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | ตารางภาษาของ Algolia: Thai segmentation "Not supported" | ไม่ได้ทดสอบ |

- ผลขึ้นกับคำศัพท์ของโปรเจกต์ → ก่อนส่ง ค้นคำจริง 20 คำ แล้วจดผลใน README ของเว็บเอกสาร
- DocSearch ฟรีเฉพาะเอกสารเทคนิคและบล็อกเทคนิคที่เปิดสาธารณะ เว็บต้องพร้อมใช้งานจริงและไม่มีเนื้อหาที่ไม่ใช่เทคนิค

## 4 · ที่วาง

| | GitHub Pages | Cloudflare |
|---|---|---|
| ราคา | ฟรี · บัญชีฟรีต้องใช้ repo public | Pages มีแผนฟรี · Workers static assets: คำขอไฟล์ static ฟรีไม่จำกัด |
| ขีดจำกัด | เว็บ ≤ 1 GB · bandwidth 100 GB/เดือน (soft) · build 10 ครั้ง/ชม. (soft · ไม่นับ build ผ่าน GitHub Actions) · deploy เกิน 10 นาทีล้ม | Pages แผนฟรี: 500 build/เดือน · build ทีละ 1 · ไม่เกิน 20 นาที · 20,000 ไฟล์ · ไฟล์ละ ≤ 25 MiB |
| เงื่อนไข | ห้ามใช้เป็นโฮสต์ฟรีของธุรกิจออนไลน์หรือ SaaS · เว็บเป็นสาธารณะแม้ repo เป็น private | หน้า Pages บอกให้โปรเจกต์ใหม่เริ่มที่ Workers |

เอกสารที่ห้ามคนนอกเห็นไม่ขึ้นเว็บสาธารณะ เก็บเป็น `docs/*.md` ใน repo (วิธีจำกัดสิทธิ์ผู้อ่านของแต่ละเจ้ายังไม่ได้ตรวจ)

## 5 · ฟอนต์ไทย

- ใช้ฟอนต์เดียวกับแอป: `Inter` + `Noto Sans Thai` (`web-app-design` → `references/tokens.md`) · ตัวเลือกอื่นใน Google Fonts ที่มีอักษรไทยและเป็น OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- โหลดผ่าน Google Fonts CSS2 API ใส่ `display=swap` · API แยกบล็อก `/* thai */` ด้วย `unicode-range: U+0E01-0E5B …` ให้เอง เบราว์เซอร์จึงโหลดเฉพาะส่วนที่หน้าใช้ (ดูจาก CSS ที่ API ส่งกลับ 2026-10-23)
- line-height ของภาษาไทยบวก 0.1 จากค่าของอังกฤษ (`ui-craft` ข้อ 2)
- ตั้งฟอนต์ตามช่องที่ธีมเปิดให้ · ชื่อตัวตั้งค่าและตัวแปร CSS ของแต่ละธีมยังไม่ได้ตรวจ

## 6 · เนื้อหาอยู่ใน repo ข้างโค้ด

- ต้นฉบับของเว็บเอกสารอยู่ในโฟลเดอร์โค้ด `<project-name>/docs/` พร้อมไฟล์ตั้งค่าของตัวสร้าง (ผังแบบ A ของ `project-bootstrap` ข้อ 1) · โค้ดกับคู่มือเปลี่ยนใน pull request เดียวกัน
- โปรเจกต์แบบ B: `.docx` ส่งมอบ · ADR · runbook · BUILD-PLAN ยังอยู่ `docs/` ที่ราก · เว็บเอกสารรับแค่ของที่คนนอกอ่าน (คู่มือ · tutorial · API reference · release notes) · เนื้อหาเดียวกันห้ามอยู่ 2 ที่
- build ใน Continuous Integration (CI) ทุก pull request และ deploy เมื่อ merge (`cicd-and-release`)
- ข้อยกเว้นของรากประกาศใน README ของโฟลเดอร์โค้ด (`SKILL.md` ข้อ 1)

## ที่มา

| เรื่อง | URL หรือหลักฐาน (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (สถานะ · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (ไฟล์ `lunr.th.js` ใช้ wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| ปลั๊กอินค้นในเครื่องของ Docusaurus | https://github.com/easyops-cn/docusaurus-search-local |
| รุ่นและ licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` ใน https://github.com/google/fonts · CSS จริงจาก fonts.googleapis.com |
| ทดสอบค้นไทย | Pagefind ผ่าน `npx pagefind@1.5.2` + เบราว์เซอร์ · lunr และ MiniSearch ผ่าน Node 22 · หน้าทดสอบ 2 หน้า คำค้น 9 คำในข้อ 3 |


## reference: ecosystem.md

# โปรเจกต์แบบ ecosystem — 1 ระบบ แบ่งเป็นหลาย sub-project

อ่านเมื่อโปรเจกต์มี sub-project ตั้งแต่ 2 ตัวและแต่ละตัวมีเอกสารชุดของตัวเอง · กฎย่ออยู่ใน `SKILL.md` ข้อ 1

ใช้เมื่อโปรเจกต์เป็นชุดผลิตภัณฑ์ที่มี sub-project ตั้งแต่ 2 ตัวขึ้นไป และแต่ละตัวมีเอกสารชุดของตัวเอง (SRS · mockup · สถาปัตยกรรม) เช่น Quanton ที่แบ่งเป็น CONNECT · LAB · INTEL · DESK
**ชื่อโฟลเดอร์ต้องเป็น `ecosystem/` เสมอ** ห้ามใช้ `projects/` `modules/` หรือ `apps/` เพราะพอเปิดโฟลเดอร์แล้วต้องรู้ทันทีว่าทุกตัวข้างในเป็นชิ้นของระบบเดียวกัน

```
<ชื่อโปรเจกต์>/
├─ docs/                เอกสารระดับ ecosystem — README (สารบัญ) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <รหัส>-<SUB>/     1 โฟลเดอร์ต่อ 1 sub-project เช่น QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    repo โค้ดของ sub-project นี้ (ตัวพิมพ์เล็กคั่น `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   ใช้ร่วมกันทั้ง ecosystem (กติกาเดียวกับแบบ B)
```

- เอกสารที่ครอบทุก sub-project (BRD · แผนโครงการ · BUILD-PLAN) อยู่ใน `docs/` ที่รากที่เดียว ห้ามก๊อปไปไว้ในแต่ละ sub-project
- สร้างโฟลเดอร์ sub-project เมื่อเริ่มเขียนเอกสารของตัวนั้นจริง ไม่สร้างเผื่อ
- ชื่อโฟลเดอร์ sub-project = รหัสโปรเจกต์ + ชื่อ sub-project ตัวพิมพ์ใหญ่ (`QTN-CONNECT`) ใช้รหัสเดียวกับที่เอกสารอ้าง
- โปรเจกต์ที่ใช้ `projects/` อยู่แล้ว → เปลี่ยนชื่อเป็น `ecosystem/` แล้วแก้ path ในเอกสารและสคริปต์ทุกไฟล์ในรอบเดียวกัน
- โปรเจกต์ที่มีผลิตภัณฑ์เดียว ไม่ต้องมี `ecosystem/` ใช้แบบ B ตามปกติ


## reference: technical-docs.md

# เอกสารเชิงเทคนิค — ตาราง ลำดับเขียน และใครเขียน

อ่านเมื่อเลือกชุดเอกสารเชิงเทคนิค หรือกำลังจะเขียนชิ้นใดชิ้นหนึ่ง · สรุปอยู่ใน `SKILL.md` ข้อ 2.2–4

## เอกสารเชิงเทคนิค (ข้อ 2.2)

กลุ่มนี้เป็น **markdown ทั้งหมด** และ**ไม่ได้ขึ้นกับขนาดงาน** แต่ขึ้นกับว่าโปรเจกต์มีอะไร

| เอกสาร | ไฟล์ | ตอบคำถามว่า | ต้องมีเมื่อ |
|---|---|---|---|
| README | `<project-name>/README.md` | ติดตั้งและรันยังไง | **เสมอ** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | จะสร้างอะไรก่อนหลัง · ตอนนี้ถึงไหนแล้ว | **เสมอ** |
| USER-STORIES | `docs/USER-STORIES.md` | จะสร้างอะไรให้ใคร · story ไหนพร้อมเข้า sprint · AC คืออะไร | ทำงานเป็น sprint หรือมี backlog (`user-story-writer`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | sprint นี้รับ story ไหน · เป้าหมายคืออะไร · เสี่ยงอะไร | ทำงานเป็น sprint (`/sprint-plan`) — ไฟล์ละ sprint ไม่เขียนทับของเก่า |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | agent ทำงานเป็นวงจรแบบไหน · อะไรคือเงื่อนไขว่าจบ | ให้ agent เขียนโค้ดเป็นรอบ ๆ (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | endpoint ไหนรับอะไร คืนอะไร พังยังไง | มี API ที่คนอื่นเรียก (`api-conventions`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | ฟิลด์นี้แปลว่าอะไร · ค่าที่เป็นไปได้มีอะไรบ้าง | มีฐานข้อมูลหรือสคีมาข้อมูล (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | วัดว่าผลลัพธ์ดีพอหรือยังด้วยอะไร · เกณฑ์ผ่านเท่าไร | ผลลัพธ์มาจากโมเดลหรือ LLM ที่ไม่ได้ถูกเสมอ |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | prompt ตัวจริงคือตัวไหน เวอร์ชันอะไร เปลี่ยนอะไรไป | ใช้ LLM ในเส้นทางหลักของระบบ |
| ADR | `docs/decisions/ADR-*.md` | ทำไมถึงเลือกทางนี้ ไม่เลือกทางนั้น | มีการตัดสินใจที่จะถูกถามซ้ำ (`adr-writer`) |
| Runbook | `docs/runbook-<เรื่อง>.md` ไฟล์ละเรื่อง | ระบบล่มตอนตี 2 ต้องทำอะไร | มีระบบที่รันอยู่จริงและมีคนอยู่เวร |

> **เอกสาร 4 ตัวที่มีเงื่อนไขเรื่อง LLM · API · ฐานข้อมูล คือตัวที่คนลืมบ่อยที่สุด**
> แล้วไปจบด้วยการถาม agent ซ้ำทุกรอบว่า "prompt ตัวไหนคือตัวจริง" หรือ "ฟิลด์นี้แปลว่าอะไร"

## สายเทคนิค — เขียนเมื่อไหร่ (ข้อ 3)

| เขียนเมื่อ | เอกสาร |
|---|---|
| ก่อนเขียนโค้ดบรรทัดแรก | README · BUILD-PLAN |
| ก่อนปล่อย agent ทำงานเป็นรอบ | AGENT-LOOP |
| ตอนออกแบบตารางแรก | DATA-DICTIONARY |
| ตอนออกแบบ endpoint แรก | API-SPEC |
| ตอนเขียน prompt ตัวแรกที่จะใช้จริง | PROMPT-LIBRARY · EVALUATION-POLICY |
| ตอนตัดสินใจเรื่องที่จะถูกถามซ้ำ | ADR |
| ก่อนขึ้นระบบจริง | Runbook |

> **ADR กับ DATA-DICTIONARY เขียนตอนที่ตัดสินใจ ไม่ใช่ตอนสรุปท้ายโปรเจกต์**
> เขียนย้อนหลังก็ได้ แต่ตอนนั้นเหตุผลจริงหายไปแล้ว

## ใครเขียนชิ้นไหน ด้วย skill อะไร (ข้อ 4)

| เอกสาร | agent | skill ที่ใช้ |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `branded-document-design` |
| BRD · user story | `business-analyst` | `user-story-writer` |
| SRS | `system-analyst` | `srs-writing` |
| FSD | `system-analyst` | `fsd-writing` |
| Architecture | `solution-architect` | `architecture-patterns` · `diagram-figures` |
| ADR | `solution-architect` | `adr-writer` |
| Test Plan · Test Cases | `qa-tester` | `test-case-template` |
| mockups | `ux-designer` | `web-app-design` · `ui-craft` |
| คู่มือผู้ใช้ (`MAN`) | `technical-writer` | `polished-document-style` |
| Runbook | `devops-engineer` | `incident-runbook-template` |
| BUILD-PLAN | `project-manager` | `simplicity-first` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-conventions` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | — (คู่กับ skill `llm-engineering`) |


## reference: writer-templates.md

# แม่แบบของ technical-writer — README · tutorial · API reference · release notes

**สารบัญ:** README · Tutorial Template · API Reference Template · Release Notes Template

เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Outputs

### README

ไม่มีแม่แบบ README ที่นี่ — ใช้แม่แบบเดียวของ `project-bootstrap` (`SKILL.md` ข้อ 2 และ `assets/starter-files.md`) ที่ตอบ 5 คำถาม: คืออะไร · ต้องมีอะไรบนเครื่อง (เวอร์ชัน) · ติดตั้งและรันอย่างไร · รัน test อย่างไร · เอกสารและคนที่ต้องถามอยู่ที่ไหน

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes ต้องอยู่ก่อนหัวข้ออื่นเสมอ (ต่อจาก Highlights) — กฎเต็มของ release notes อยู่ใน skill `release-notes`

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## 🆕 New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (ภาษาไทย)

> โครงเดียวกับฉบับอังกฤษ · ถ้อยคำใช้ระดับ ข่าว (`human-writing` `references/thai-grammar.md` หัวข้อ 4): ไม่มีบุรุษที่ 1 · แต่ละบรรทัด ประธาน + กริยา + กรรม · ตัวเลขต้องวัดจริง ไม่มีก็ไม่ใส่ · ตัวอย่าง ✅/❌ อยู่ใน skill `release-notes` ข้อ 4

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````


---

# skill: product-naming

Use when naming a product, shop, service, app or brand, or checking how a name sounds in Thai.

# ตั้งชื่อผลิตภัณฑ์

> **กฎข้อเดียว:** ชื่อที่ดีคือชื่อที่คน**พิมพ์ถูกตั้งแต่ครั้งแรก หลังได้ยินครั้งเดียว**
> ความหมายลึกซึ้งมาทีหลังได้ แต่ถ้าสะกดผิด ลูกค้าก็หาไม่เจอ

## เมื่อไหร่ใช้ skill นี้

- ตั้งชื่อผลิตภัณฑ์ ร้าน บริการ แอป แบรนด์ โมดูล หรือชื่อโครงการภายใน
- มีชื่ออยู่แล้วแต่รู้สึกว่าเชย ยาว หรือซ้ำกับคนอื่น
- มีผลิตภัณฑ์หลายตัวและอยากให้ชื่อเป็นตระกูลเดียวกัน
- ต้องเลือกจากรายการชื่อที่ระดมมาแล้ว แต่ตัดสินใจไม่ลง

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| โลโก้ สี ตัวอักษรของแบรนด์ | `graphic-design` (plugin `software-company`) |
| ตั้งชื่อไฟล์เอกสาร | `document-naming` |
| ตั้งชื่อตาราง คอลัมน์ (งานซอฟต์แวร์) | `database-design` (plugin `software-company`) |
| ตั้งชื่อ endpoint (งานซอฟต์แวร์) | `api-conventions` (plugin `software-company`) |

---

## 1 · หกข้อที่ตัดชื่อทิ้งทันที

ทดสอบก่อนคิดต่อ ถ้าตกข้อไหนข้อหนึ่งให้ตัดทิ้งเลย ไม่ต้องเสียดาย

| # | ทดสอบ | ตกเมื่อ |
|:--:|---|---|
| 1 | **ทดสอบโทรศัพท์** — พูดชื่อให้คนฟังทางโทรศัพท์ เขาพิมพ์ถูกไหม | ต้องสะกดให้ฟัง |
| 2 | **ความยาว** | เกิน 3 พยางค์ หรือเกิน 12 ตัวอักษร |
| 3 | **โดเมนและ handle** | `.com` และ `.co` ถูกจับหมด และ handle โซเชียลไม่ว่างสักที่ |
| 4 | **ชนของที่มีอยู่** | มีผลิตภัณฑ์ ร้าน หรือบริการในหมวดเดียวกันชื่อเดียวกันหรือใกล้กันมาก |
| 5 | **ความหมายในภาษาอื่น** | แปลว่าอะไรไม่ดีในภาษาที่ลูกค้าพูด |
| 6 | **คนไทยออกเสียงได้** | มีเสียงควบที่คนไทยเลี่ยง หรือลงท้ายด้วยเสียงที่กลืนหาย |

> 🚨 **ข้อ 1 คือข้อที่ฆ่าชื่อมากที่สุด** เพราะชื่อที่สะกดแปลกเพื่อให้ได้โดเมน
> ต้องแลกกับการที่ลูกค้าทุกคนพิมพ์ผิดตลอดไป
>
> 🚨 **ข้อ 6 คนมักลืม** — ถ้าชื่อมี `th` `v` `z` ท้ายคำ หรือควบ `str-` `spl-`
> คนไทยจะออกเสียงเพี้ยนแล้วพิมพ์ตามที่ได้ยิน

---

## 2 · เก้าสูตรผลิตชื่อ

อย่านั่งนึกลอย ๆ ให้เดินทีละสูตร คิดสูตรละ 5–10 ชื่อ แล้วค่อยคัด

| # | สูตร | วิธี | ตัวอย่าง |
|:--:|---|---|---|
| 1 | **คำจริง ตัดท้าย** | เอาคำอังกฤษมาตัดพยางค์สุดท้ายทิ้ง | `figure` → **Figma** · `velocity` → **Velo** |
| 2 | **2 คำชนกัน** | ตัดหัวท้าย 2 คำมาต่อกัน | `fold`+`drop` → **Foldrop** · `data`+`dog` → **Datadog** |
| 3 | **คำ + ปัจจัย** | เติม `-io` `-ly` `-ify` `-o` `-a` `-ex` | `home`+`ify` → **Homify** · `aurum`+`io` → **Aurio** |
| 4 | **รากละติน/กรีก** | หาคำรากของสิ่งที่ทำ แล้วย่อให้สั้น | `lumen` → **Lumo** · `nexus` → **Nexa** |
| 5 | **ตัวอักษรตระกูล** | คำบอกหน้าที่ + ตัวต่อท้ายประจำตระกูล | **TradeXI · TelXI · DockXI · SoundXI** |
| 6 | **คำสั้นไร้ความหมาย** | 4–5 ตัวอักษร พยัญชนะ-สระ-พยัญชนะ อ่านได้ทันที | **Quix · Zeno · Riva · Volt** |
| 7 | **คำจริงยืมข้ามบริบท** | คำธรรมดาที่ไม่เกี่ยวกับงาน แต่ให้ความรู้สึกตรง | **Slack · Notion · Arc · Linear** |
| 8 | **2 พยางค์อ่านลื่น** | คำจริง 2 คำสั้น ๆ วางคู่กัน | **Speak Go · Cash App** |
| 9 | **คำเต็ม 2 คำที่ไม่เกี่ยวกัน** | เอาคำจริง 2 คำที่ไม่เกี่ยวกับสินค้าและไม่เกี่ยวกันเอง มาต่อเป็นคำเดียว | **Tailscale · Snowflake · Firebase · Basecamp** |

**สูตรที่ให้ชื่อ "cool + clean" มากที่สุด** คือสูตร 1 · 4 · 6 เพราะได้ชื่อสั้น ไร้ความหมายตรงตัว และจำง่าย
**สูตร 7 ได้ชื่อที่ดูโตแล้ว** แต่โดเมนหายากที่สุด

**ตัวอักษรที่ให้ความรู้สึกทันสมัย** — ขึ้นต้นด้วย `x` `z` `q` `v` หรือลงท้ายด้วย `-o` `-a` `-ix` `-ex`
**ตัวอักษรที่ทำให้ดูเชย** — ต่อท้ายด้วย `-soft` `-tech` `-sys` `-pro` `-plus` `-max`

---

**สูตร 9 ลงลึก** — เอาคำจริง 2 คำเต็ม ๆ (ไม่ตัดอะไร) ที่ไม่เกี่ยวกับสินค้าและไม่เกี่ยวกันเอง วางติดกัน · รวมไม่เกิน 3 พยางค์ · คำแรกเป็นรูปธรรม · อ่านออกเสียงทุกคู่ก่อนเลือก → เหตุผล กฎ และคลังคำ A/B สำหรับจับคู่ใน [`references/formula-9-deep-dive.md`](references/formula-9-deep-dive.md) — เปิดเมื่อใช้สูตร 9

## 3 · ใส่ความหมายให้ชื่อ

ชื่อสั้นและทันสมัยไม่จำเป็นต้องไร้ความหมาย เพราะความหมายมาได้ 2 ทาง

| ทาง | สูตรที่ให้มา | ตัวอย่าง |
|---|---|---|
| **มีมาแต่กำเนิด** | 4 รากละติน/กรีก · 7 คำจริงยืมข้ามบริบท | `Aurio` จาก *aurum* ทอง · `Anchor` ความมั่นคง |
| **ใส่ทีหลัง** | 6 คำสั้นไร้ความหมาย | `Quix` ตั้งก่อน แล้วค่อยผูกกับความเร็ว |

> **ทางที่ 2 ใช้ได้จริงและปลอดภัยกว่า** ดู Kodak, Häagen-Dazs, Apple ไม่มีชื่อไหนบอกว่าขายอะไร
> ความหมายถูกสร้างขึ้นหลังจากนั้นทั้งหมด

**กฎของความหมาย:** หารากจาก**สิ่งที่ผู้ใช้ได้** ไม่ใช่สิ่งที่ระบบทำ
เช่น ระบบจัดการคลังทอง ให้ใช้ราก "ทอง" ไม่ใช่ราก "คลังสินค้า"

**ทดสอบ:** เขียนความหมายเป็น **1 บรรทัด** ได้ไหม
"Aurio — จาก aurum ภาษาละตินแปลว่าทอง" แค่นี้จบ ถ้าต้องอธิบายเกิน 1 ประโยค แปลว่าความหมายอ่อนเกินไป

**คลังช่วยคิด** — ตารางรากละติน/กรีกที่ใช้ได้จริง (แสง · ทอง · เชื่อมต่อ · เวลา · ปกป้อง ฯลฯ) และตารางคำจริงยืมข้ามบริบทแยกตามความรู้สึก (เร็ว · มั่นคง · ชัดเจน · เป็นระเบียบ · เชื่อมโยง · นำทาง · เงียบ) → [`references/meaning-libraries.md`](references/meaning-libraries.md) — เปิดเมื่อใช้สูตร 4 หรือ 7 · คำจริงหาโดเมนยากที่สุด ต้องมีแผนสำรอง (`arc.app` · `getprism.com`)

**เรื่องเล่า:** สั้น จำได้ เล่าต่อได้ (ไม่ใช่ตัวย่อต่อกัน หรือชื่อหมาที่บ้าน) → ตัวอย่างดี/แย่ใน `references/meaning-libraries.md`

**เขียนความหมายลงเอกสารแบรนด์** ตั้งแต่วันเลือกชื่อ ไม่ใช่รอให้มีคนถาม
ทีมขายจะได้เล่าเหมือนกันทุกคน

---

## 4 · ตระกูลชื่อ เมื่อมีหลายผลิตภัณฑ์

เลือกแบบเดียว แล้วใช้ทั้งตระกูล

| แบบ | หน้าตา | ดี | เสีย |
|---|---|---|---|
| **ต่อท้ายเหมือนกัน** | `TradeXI` `TelXI` `DockXI` | รู้ทันทีว่าบ้านเดียวกัน และตั้งชื่อตัวใหม่ง่าย | ถ้าตัวเดียวเสียชื่อ จะกระทบทั้งตระกูล |
| **นำหน้าเหมือนกัน** | `QuixChat` `QuixFlow` | แบรนด์แม่เด่น | ชื่อยาวขึ้นทุกตัว |
| **อิสระ** | `Aurio` `Homify` `Foldrop` | แต่ละตัวขายตัวเองได้ และขายแยกได้ | ต้องสร้างแบรนด์ใหม่ทุกตัว |

**เกณฑ์เลือก:** ถ้าขายรวมเป็นชุด ให้ใช้ตระกูลเดียวกัน แต่ถ้าอาจขายแยกหรือขายกิจการทีหลัง ให้ตั้งแบบอิสระ

> **จดชื่อตระกูลไว้เป็นเอกสาร** พร้อมกฎการตั้งชื่อตัวถัดไป
> ไม่งั้นตัวที่ 5 จะหลุดแบบ แล้วทั้งชุดดูมั่ว

---

## 5 · ตรวจของว่างก่อนตกหลุมรัก

**ตรวจตอนเหลือ 5 ชื่อ ไม่ใช่ตอนเหลือชื่อเดียว** เพราะถ้าชอบชื่อไหนมากแล้วมารู้ว่าใช้ไม่ได้ จะเจ็บกว่า

| ตรวจอะไร | ที่ไหน | ตกเมื่อ |
|---|---|---|
| โดเมน | ผู้ให้บริการจดโดเมน | `.com` และ `.co` ถูกจับ และตัวสำรองก็ไม่เหลือ |
| เครื่องหมายการค้าไทย | กรมทรัพย์สินทางปัญญา | มีของจดไว้ในหมวดสินค้าหรือบริการของเรา |
| เครื่องหมายการค้าสากล | ฐานข้อมูล WIPO | เหมือนข้อบน ถ้าจะขายต่างประเทศ |
| ชื่อแพ็กเกจ (ถ้าเป็นซอฟต์แวร์) | npm · PyPI · NuGet | ถูกใช้แล้วในระบบนิเวศที่จะเผยแพร่ |
| ชื่อในแอปสโตร์ (ถ้าเป็นแอป) | App Store · Play Store | มีแอปชื่อเดียวกันในหมวดเดียวกัน |
| handle โซเชียล | X · Instagram · Facebook · TikTok · GitHub · LINE | ไม่ว่างสักที่ |
| ค้นหาธรรมดา | เสิร์ชเอนจิน | หน้าแรกเต็มไปด้วยของคนอื่น |

**เกณฑ์ตัดสิน:** โดเมนหลักต้องได้ handle ต้องว่างอย่างน้อยครึ่งหนึ่ง และ
เครื่องหมายการค้าในหมวดของเราต้องไม่ชน 3 ข้อนี้ไม่มีข้อยกเว้น

---

## 6 · เสียงและการพิมพ์ในบริบทไทย

| เรื่อง | กฎ |
|---|---|
| ลูกค้าไทยจะเขียนชื่อเป็นภาษาไทยแน่นอน | ลองเขียนดูเองก่อน เช่น `Aurio` เป็น "ออริโอ" แล้วดูว่าอ่านลื่นไหม |
| เลือกคำไทยทางการ 1 แบบ | เขียนตามหลักเกณฑ์ทับศัพท์ของราชบัณฑิตยสภา ไม่ใส่วรรณยุกต์ (ซอฟต์แวร์ ไม่ใช่ ซ้อฟต์แว่ร์) · บันทึกลง brand kit · แบบอื่นที่ลูกค้าพิมพ์กันจริงเก็บเป็นคำค้น (search keyword) ไม่ใช้ในงาน |
| เสียงที่คนไทยกลืน | `-th` `-v` `-s` ท้ายคำ หายเกือบทุกครั้ง |
| เสียงควบที่เลี่ยงกัน | `str-` `spl-` `thr-` |
| ชื่อที่พิมพ์ผิดง่ายบนแป้นไทย | เลี่ยงตัวที่อยู่ใกล้กันจนสลับได้ |
| ความยาวเมื่อเขียนไทย | ไม่ควรเกิน 5 พยางค์ไทย |

**ทดสอบจริง** — พูดชื่อให้คนไทย 3 คนฟังทางโทรศัพท์ แล้วให้เขาพิมพ์ลงไลน์ส่งกลับมา
ถ้ามีสักคนพิมพ์ไม่ตรง ชื่อนั้นตก

---

## 7 · ห้าข้อทดสอบก่อนตัดสินใจครั้งสุดท้าย

| # | ทดสอบ | ผ่านเมื่อ |
|:--:|---|---|
| 1 | เขียนในประโยคจริง | "ลองใช้ ___ ดูสิ" ฟังแล้วไม่ขัด |
| 2 | เขียนคู่กับคำบอกหมวด | "___ — ระบบจัดการคลังทอง" อ่านแล้วเข้าใจ |
| 3 | ย่อเป็นไอคอน | ตัวแรกหรือ 2 ตัวแรกทำเป็นสัญลักษณ์ได้ |
| 4 | อยู่รอดเมื่อขอบเขตโต | ชื่อที่มีคำว่า "ทอง" จะพังวันที่ขายเงินด้วย |
| 5 | ทนต่อการล้อ | ลองคิดมุกล้อชื่อตัวเอง ถ้าคิดออกง่ายเกินไป ระวัง |

**ข้อ 4 สำคัญที่สุดสำหรับสิ่งที่จะโตต่อ (ผลิตภัณฑ์ ร้าน แบรนด์)** — ชื่อที่บอกความสามารถวันนี้
จะกลายเป็นกรงขังเมื่อผลิตภัณฑ์โตขึ้น ชื่อไร้ความหมายจึงปลอดภัยกว่าในระยะยาว

---

## 8 · Anti-patterns

- ❌ **สะกดแปลกเพื่อให้ได้โดเมน** — `Kleen` `Fyre` `Qwik` ลูกค้าพิมพ์ผิดตลอดไป
- ❌ **ต่อท้ายด้วย `-soft` `-tech` `-sys` `-solutions`** — ดูเป็นปี 2005
- ❌ **ใส่ตัวเลขในชื่อ** — `App360` `Pro24` ตกรุ่นทันทีที่เปลี่ยนรุ่น
- ❌ **ชื่อที่บอกความสามารถเฉพาะ** — `InvoiceMaster` แล้ววันที่ทำเรื่องอื่นด้วย
- ❌ **3 คำขึ้นไป** — ไม่มีใครพูดเต็ม จะถูกย่อจนจำไม่ได้
- ❌ **คำไทยทับศัพท์ที่ฝรั่งอ่านไม่ออก** ถ้าคิดจะขายต่างประเทศ
- ❌ **ชื่อที่ต้องอธิบายว่าทำไมถึงตั้งชื่อนี้** — ลูกค้าไม่มีเวลาฟัง
- ❌ **เลือกชื่อก่อนตรวจโดเมนและเครื่องหมายการค้า** — เสียเวลา 2 รอบ
- ❌ **ระดมชื่อคนเดียวในหัว** — ได้ชื่อจากมุมเดียว ให้เดินตาม 9 สูตรแทน

---

## 9 · ตัวย่อ

- **portmanteau** — คำที่เกิดจากการเอา 2 คำมาตัดต่อกัน
- **handle** — ชื่อบัญชีบนโซเชียล เช่น `@quixapp`
- **WIPO** — World Intellectual Property Organization (องค์การทรัพย์สินทางปัญญาโลก)
- **npm · PyPI · NuGet** — คลังแพ็กเกจของ Node, Python และ .NET ตามลำดับ

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| โลโก้ สี ตัวอักษรของชื่อที่เลือกแล้ว | `graphic-design` (plugin `software-company`) |
| เช็กว่ามีคนทำของแบบเดียวกันชื่อนี้อยู่แล้วไหม | `prior-art-review` |
| ชื่อที่ใช้ในเอกสารและไฟล์ส่งมอบ | `document-naming` |
| คำที่ใช้เรียกฟีเจอร์ในตัวผลิตภัณฑ์ | `i18n-and-locale` (plugin `software-company`) |
| นำเสนอชื่อที่คัดแล้วให้ผู้มีอำนาจตัดสินใจ | `presentation-design` |

**ตารางคัดชื่อที่กรอกต่อได้ทันที** → `assets/name-shortlist.md`


## reference: formula-9-deep-dive.md

# สูตร 9 ลงลึก

เปิดเมื่อผลิตชื่อด้วยสูตร 9

## แบบที่ให้ชื่อดูเท่าที่สุดโดยไม่ต้องประดิษฐ์คำ

`Tailscale` = *tail* + *scale* ซึ่งทั้ง 2 คำไม่เกี่ยวกับเครือข่ายส่วนตัวเลย และไม่เกี่ยวกันเองด้วย

| ต่างจากสูตร 2 ตรงไหน | |
|---|---|
| สูตร 2 | **ตัด**พยางค์ก่อนต่อ เช่น `fold`+`drop` → Foldrop คำที่ได้จึงไม่ใช่คำจริง |
| สูตร 9 | **ไม่ตัดอะไรเลย** เอาคำจริง 2 คำเต็ม ๆ วางติดกัน |

**ทำไมได้ผล**

| เหตุผล | |
|---|---|
| จำง่าย | ผู้ฟังรู้จักทั้ง 2 คำอยู่แล้ว ไม่ต้องจำการสะกดใหม่ |
| ไม่ซ้ำใคร | คู่คำที่ไม่มีเหตุผลต้องอยู่ด้วยกัน จึงไม่มีใครเคยจับคู่ไว้ |
| โดเมนหาง่าย | มักหาง่ายกว่าคำเดี่ยว แต่ยังต้องตรวจตามหัวข้อ 5 ใน `SKILL.md` |
| ผ่านทดสอบโทรศัพท์ | พูดแล้วพิมพ์ถูกทันที เพราะเป็นคำที่เขารู้จัก |

**กฎของสูตรนี้**

- รวมกันไม่เกิน **3 พยางค์** — `Tailscale` 2 · `Basecamp` 2 · `Snowflake` 2
- **คำแรกควรเป็นรูปธรรม** คือสิ่งที่นึกภาพออก (tail, snow, fire, base, bit, black, cloud)
- อย่าให้คู่คำอธิบายสินค้า เพราะถ้าอธิบายได้ มันจะกลายเป็นชื่อเชย ๆ แบบ `DataSync`
- **ห้ามให้ความหมายรวมกันแล้วแปลก** ลองอ่านออกเสียงและนึกภาพก่อน
- ตัวสะกดต้องไม่ชนกันจนอ่านยาก ให้เลี่ยงคำแรกที่ลงท้ายด้วยตัวเดียวกับที่คำหลังขึ้นต้น

**วิธีผลิต** — ทำ 2 คลังแยกกัน แล้วสุ่มจับคู่และอ่านออกเสียงทุกคู่

| คลัง A — รูปธรรม | คลัง B — โครงสร้าง/มาตรา |
|---|---|
| tail · snow · fire · bit · black · cloud · iron · salt · moon · north · glass · pine | scale · flake · base · bucket · camp · bird · flare · stack · frame · gate · port · line |

ตัวอย่างที่ได้จากการจับคู่ — `Saltframe` · `Pinegate` · `Moonstack` · `Ironport` · `Glassline`

> **ความหมายใส่ทีหลังได้เต็มที่** (ดูข้อ 3) — `Tailscale` ไม่ได้มีความหมายตั้งแต่แรก
> แต่พอใช้ไปสักพัก คนก็ผูกมันกับเรื่องของเครือข่ายที่ขยายได้ไปเอง


## reference: meaning-libraries.md

# คลังช่วยคิดความหมายของชื่อ

สารบัญ: คลังรากละติน/กรีก → คลังคำจริงยืมข้ามบริบท → เรื่องเล่าที่ดีกับที่แย่

## คลังรากละติน/กรีก ที่ใช้ได้จริง

| ความหมาย | ราก | ชื่อที่ได้ |
|---|---|---|
| แสง · ความชัด | *lux · lumen* | Lumo · Lumen · Lucent |
| ทอง · มีค่า | *aurum* | Aurio · Aura |
| เชื่อมต่อ | *nexus · syn-* | Nexa · Syno · Nexo |
| พลัง · ไฟฟ้า | *volta · vis* | Volta · Vira |
| วง · โลก | *orbis · kyklos* | Orbis · Kyklo |
| เวลา · จังหวะ | *tempus · chronos · kairos* | Tempo · Chrono · Kairo |
| ไหล · เคลื่อน | *fluxus · kinesis* | Flux · Kinet |
| เสียง | *sonus · vox* | Sona · Voxa |
| เก็บ · หีบ | *arca* | Arca · Arka |
| ปกป้อง · โล่ | *aegis · scutum* | Aegis · Scuto |
| ดูแล · รักษา | *cura* | Cura · Curo |
| จุดเริ่ม | *arche* | Arka · Archo |
| รูปแบบ | *morphe* | Morpho · Forma |
| คำ · ภาษา | *lexis · verbum* | Lexi · Verba |
| มอง · ตรวจ | *specto* | Specta · Scopo |
| ใหม่ | *nova* | Nova · Novo |
| จริง | *veritas* | Vera · Verio |
| งาน · ผลงาน | *opus* | Opus · Opero |
| ท่า · ประตู | *portus · porta* | Porta · Portio |

## คลังคำจริงยืมข้ามบริบท แยกตามความรู้สึก

| ความรู้สึก | คำ |
|---|---|
| เร็ว · คล่อง | Arc · Bolt · Dash · Swift · Rush · Skim |
| มั่นคง · ปลอดภัย | Anchor · Vault · Keel · Bastion · Forge · Bedrock |
| ชัดเจน · เห็นได้ | Prism · Lens · Beacon · Signal · Facet |
| เป็นระเบียบ | Grid · Frame · Ledger · Atlas · Index · Stack |
| เชื่อมโยง | Bridge · Relay · Mesh · Loom · Thread · Weave |
| นำทาง | Compass · Pilot · Helm · North · Trail |
| เงียบ · เรียบ | Slate · Quill · Linen · Drift · Still |

> ⚠️ **คำจริงหาโดเมนยากที่สุด** จึงต้องเตรียมแผนสำรอง เช่น เติมคำบอกหมวด (`arc.app`, `getprism.com`)
> หรือใช้โดเมนสั้นแบบอื่น

## เรื่องเล่าที่ดีกับที่แย่

| | ตัวอย่าง |
|---|---|
| ✅ ดี | "Aegis คือโล่ของเทพซุส — ระบบนี้มีไว้ปกป้อง" — สั้น จำได้ เล่าต่อได้ |
| ❌ แย่ | "A มาจาก Advanced, U มาจาก Unified, R มาจาก Realtime…" — ไม่มีใครจำ |
| ❌ แย่ | "ชื่อนี้มาจากชื่อหมาที่บ้าน" — ความหมายส่วนตัว ลูกค้าไม่รู้สึกด้วย |


---

# skill: no-ai-look

Use when making or reviewing anything people look at (screen, slide, poster, logo, AI image, document) so it looks made by a person, not AI.

# no-ai-look — งานที่ดูเหมือนคนออกแบบ ไม่ใช่ AI

> **กฎข้อเดียว:** ทุกการเลือก (สี ฟอนต์ เลย์เอาต์ รูป คำ) ต้องตอบได้ว่า "เลือกเพราะโปรเจกต์นี้" ไม่ใช่ "เพราะเป็นค่าตั้งต้น"
> ค่าตั้งต้นของโมเดลและ framework คือค่าเฉลี่ยของงานทั้งโลก งานที่ใช้ค่าเฉลี่ยจึงหน้าตาเหมือนกันหมด และคนดูจำได้ทันทีว่า AI ทำ

อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies` · รายการเต็มทุกสื่อพร้อมที่มา → [`references/catalog.md`](references/catalog.md)

## ใช้คู่กับอะไร

skill นี้คุมแค่ "ดูเหมือน AI หรือไม่" ส่วนระยะ สี ฟอนต์ และคอมโพเนนต์ยังเป็นของ skill งานนั้น เช่น `ui-craft` กับ skill แพลตฟอร์ม · `presentation-design` · `graphic-design` · `brand-kit` · `brief-to-image` · `image-generation` (plugin `graphic-design`) · ส่วนคำในงานใช้ `human-writing`

**หน้าตาที่โปรเจกต์อนุมัติแล้วชนะเสมอ** (brand kit · house style ของ diagram · ธีมที่ส่งมอบแล้ว) ถ้าของที่อนุมัติแล้วตรงกับข้อห้ามในนี้ ให้คงไว้ แล้วจดว่าเป็นของที่ตั้งใจ (ข้อ 3)

---

## 1 · ก่อนลงมือ — ตัดสินใจ 5 อย่างแล้วจดไว้

ทำก่อนวาดชิ้นแรก จดไว้ที่ที่โปรเจกต์เก็บหน้าตาอยู่แล้ว (`docs/README.md` ช่อง `doc-theme` · token ของแอป · brand kit) ไม่สร้างไฟล์ใหม่ถ้ามีที่อยู่แล้ว

1. **งานนี้มีไว้ทำอะไร** — เลือก 1: โน้มน้าว (หน้าขาย · โพสต์) · ใช้งาน (แอป · แดชบอร์ด) · อ่าน (เอกสาร · บทความ) · ประสบการณ์ (เกม · งานโชว์) · เลย์เอาต์มาจากข้อนี้ ไม่ใช่จากโครงสำเร็จรูป
2. **สีหลัก 1 สี** ที่ผูกกับธุรกิจนี้ แล้วไล่สีกลางจากสีนั้น · ห้ามใช้สีที่ framework และ tutorial ใช้บ่อยเป็นสีแบรนด์ (indigo-500 `#6366f1` ของ Tailwind · ปุ่มเทาเข้มตั้งต้นของ shadcn/ui)
3. **ฟอนต์ 2 ตัว** — หัวข้อ 1 ตัวที่มีบุคลิก + เนื้อหา 1 ตัวที่อ่านง่าย · เขียนเหตุผลที่เลือกคนละ 1 บรรทัด · งานไทยต้องเป็นตระกูลที่มีไทยครบ
4. **แหล่งแรงบันดาลใจจริง** — โลกของสินค้านั้นเอง (วัสดุ · ป้ายหน้าร้าน · เอกสารในวงการ) หรือแนวที่มีชื่อ (Swiss · risograph · โปสเตอร์ท่องเที่ยวยุค 60) · ห้ามสั่งด้วยคำคุณศัพท์ลอย ๆ ("พรีเมียม" "ทันสมัย" "สดใส") เพราะได้ค่าเฉลี่ยของหมวดนั้น
5. **เนื้อหาจริง** — ชื่อ ตัวเลข วันที่ ภาพหน้าจอจริง รูปคนหรือลูกค้าจริง · ยังไม่มีให้ใส่ `(รอยืนยัน)` ไม่แต่งขึ้นเอง

**ทดสอบ:** เอาโลโก้ออกแล้วงานนี้ยังใช้กับคู่แข่งได้ไหม ถ้าได้ แปลว่ายังเฉลี่ยเกิน ให้เพิ่มสิ่งที่โปรเจกต์นี้มีคนเดียว

---

## 2 · สัญญาณที่เจอบ่อยที่สุด — ห้ามใช้เป็นค่าตั้งต้น

แต่ละข้อใช้ได้ถ้ามีเหตุผลจากโปรเจกต์ (ข้อ 3) · ทางแก้และที่มาของทุกข้ออยู่ใน catalog

| กลุ่ม | สัญญาณ | ใช้แทน |
|---|---|---|
| สี | ไล่สีม่วง-น้ำเงิน-ฟ้า · ตัวอักษรไล่สี · นีออนบนพื้นมืด · แสงฟุ้งวงกลมหลังเนื้อหา · พื้นครีมเพราะ "ดูมีรสนิยม" · ชุดครีม + ส้มอิฐ (terracotta) + เซอริฟ ที่โผล่ทุกงาน "แบบอบอุ่น" | สีแบรนด์ทึบ 1 สี · เน้นด้วยขนาดหรือน้ำหนัก |
| พื้นผิว | กระจกฝ้าทั่วหน้า · ลายกริดหรือลายทางตกแต่ง · เส้นบาง + เงากว้างบนกล่องเดียว | พื้นเรียบ · เลือกเส้นหรือเงาอย่างเดียว |
| การ์ด | แถบสีหนาข้างการ์ดมุมมน · การ์ดซ้อนการ์ด · มุมโค้งใหญ่จนเป็นก้อน · กริดการ์ดหน้าตาเหมือนกัน 3–6 ใบ | ระยะห่างและตัวอักษร · จัดกลุ่มตามความสำคัญ |
| หัวข้อ | ป้ายเล็กเหนือหัวข้อ ("Introducing") · ไอคอนในกรอบมนเหนือหัวข้อ · เลข 01/02/03 ที่ไม่มีลำดับจริง · เซอริฟตัวเอียงขนาดยักษ์ · Inter/Geist ทุกงาน | ใส่คำที่มีประโยชน์ในหัวข้อเลย · ฟอนต์ตามข้อ 1 |
| โครงหน้า | ฮีโร่กลางจอ → การ์ด 3 ใบ → โลโก้ลูกค้า → ราคา → FAQ ทุกหน้า · ตัวเลขยักษ์ + ป้ายเล็ก 3 ช่อง · สไลด์ทุกหน้าเป็นหัว + 3–4 bullet | โครงจากเป้าหมายของหน้า · เปลี่ยนเลย์เอาต์ตามเนื้อหา |
| ไอคอน | อีโมจิแทนไอคอนหรือในหัวข้อ · ไอคอนเส้นบางชุดเดียวขนาด 16 ทุกที่ · ไอคอนใหญ่กว่าเนื้อหา | ชุดไอคอน SVG ชุดเดียวที่ตั้งใจเลือก · ภาพหน้าจอหรือกราฟจริงแทนไอคอน |
| การเคลื่อนไหว | fade-up ทุกชิ้น · จุดกระพริบไม่หยุด · เคอร์เซอร์กระพริบในข้อความนิ่ง · ตัวเลื่อนเอง · easing เด้ง · รูปซูมเมื่อชี้ | ขยับเฉพาะที่มีความหมาย 150–300 ms ease-out ใช้ transform/opacity |
| รูป AI | ผิวเนียนเหมือนพลาสติก · แสงทองหรือแสงดราม่าทุกฉาก · โทนเขียวอมฟ้า-ส้ม · ฉากสะอาดเกินจริง · คนหน้าตาเฉลี่ย · มือ ฟัน ตัวหนังสือเพี้ยน · 3D ดินปั้นหรือ isometric มันวาว | แสงจากแหล่งเดียวที่มีเหตุผล · ร่องรอยการใช้งาน · ระบุแนวและสีใน prompt · ตัดต่อ ไม่ใช้ภาพแรกที่ได้ |
| โลโก้ | วงกลมไล่สีมีรูตรงกลาง · ลายวงจร · อินฟินิตี้ · เส้นโค้งพุ่ง · ตัวอักษรละลาย · รายละเอียดหายที่ 16 px | รูปทรงจากสิ่งเฉพาะของแบรนด์ · ส่งเป็น vector · ทดสอบที่ขนาด favicon |
| เอกสาร | อีโมจิหน้าหัวข้อ · ทุก bullet ขึ้นต้นตัวหนา · Title Case ทุกหัว · ทุกส่วนเป็นรายการ · หัวข้อ 4 ชั้นในโน้ตสั้น · จบทุกส่วนด้วยสรุป · Mermaid หน้าตาตั้งต้น | ร้อยแก้วสั้น · หัวข้อเท่าที่จำเป็น · diagram ตาม house style |
| คำ | คำโฆษณากว้าง ๆ (supercharge · ยกระดับ · ไร้รอยต่อ) · "ไม่ใช่แค่ X แต่คือ Y" แบบสโลแกน · ชุดละ 3 ทุกที่ · ขีดยาวถี่ · ประโยคเปิดสำเร็จรูป ("ในยุคดิจิทัลที่…") | ตาม `human-writing` · บอกว่าผู้ใช้ทำอะไรได้ พร้อมตัวเลข · ภาษาไทยตรวจด้วย `thai-grammar` ไม่ใช่กฎอังกฤษ (จุด ขีด การตัดคำ ต่างกัน) |

**อย่าแก้ด้วยการเปลี่ยนค่าตั้งต้นหนึ่งไปเป็นอีกค่าตั้งต้นหนึ่ง** — เลิกม่วงแล้วไปใช้ครีม + ส้มอิฐ + เซอริฟ (หรือ + เขียวขี้ม้า) ก็ยังเป็นสูตรสำเร็จ ชุดนี้คือ "ค่าตั้งต้นของคนที่รู้ว่าม่วงคือค่าตั้งต้น" · bento grid และพื้นไล่สีแบบ mesh ไม่ได้เป็นสัญญาณในตัวเอง อย่าไล่ตัดทุกอย่างที่ดูทันสมัย

---

## 3 · ตรวจก่อนส่ง

### 3.1 งานที่เป็น HTML/CSS (mockup · หน้าเว็บ · เด็ค HTML · ปกเอกสาร HTML)

```bash
python <path ของ skill นี้>/scripts/slop_scan.py <ไฟล์หรือโฟลเดอร์>          # ตาราง
python <path ของ skill นี้>/scripts/slop_scan.py <path> --min P2 --json       # เฉพาะข้อหนัก
python <path ของ skill นี้>/scripts/slop_scan.py --url https://...           # หน้าที่ขึ้นเว็บแล้ว + stylesheet ที่หน้า <link> ไว้ (ไม่รัน JavaScript)
python <path ของ skill นี้>/scripts/slop_scan.py --self-test                  # รันก่อน ถ้าแก้สคริปต์
```

- **hook `ui-scan` ของ plugin `superuser` รันสคริปต์นี้ให้เองทุกครั้งที่ Write/Edit ไฟล์ UI** — P0/P1 ถูกส่งกลับให้แก้ทันที · P2 แจ้งเป็นบริบท · ผลเดิมไม่เตือนซ้ำ · ปิดด้วย `"ui_scan": false` ใน `.claude/superuser/config.json` · hook ตรวจทีละไฟล์ ก่อนส่งยังต้องรันทั้งโฟลเดอร์ 1 รอบ
- หน้าที่วาดด้วย JavaScript ทั้งหน้า (SPA) `--url` เห็นแค่โครง → ตรวจโค้ดต้นทาง หรือบันทึกหน้าจากเบราว์เซอร์เป็น .html แล้วตรวจไฟล์นั้น

- ตรวจ 43 กฎจากโค้ด (สี การ์ด ตัวอักษร การเคลื่อนไหว คำ รูปเสีย ช่องกรอกไม่มี label คอนทราสต์ class ของ Tailwind) · ไม่ต้องติดตั้งอะไรเพิ่ม
- ระดับ: P0 ใช้ไม่ได้ · P1 อ่านยาก · P2 สัญญาณ AI ชัด · P3 ให้ดูอีกครั้ง (อาจตั้งใจ) · มี P0 หรือ P1 → exit 1
- **แก้ P0 และ P1 ก่อน** แล้วค่อยแก้ P2 · ของที่ตั้งใจให้เขียน `/* slop-ok: <กฎ> <เหตุผล> */` หรือ `<!-- slop-ok: <กฎ> <เหตุผล> -->` ในไฟล์นั้น เหตุผลจะขึ้นในรายงานให้ผู้ตรวจเห็น
- ตรวจ 0 ไฟล์ = ผิด ไม่ใช่ผ่าน (สคริปต์ออก exit 2)
- ผลจากสคริปต์คือเหตุผลให้ดูซ้ำ ไม่ใช่คำสั่งให้แก้ทุกข้อ · สคริปต์ไม่เห็นภาพ ข้อในตาราง 3.2 ต้องดูด้วยตาเสมอ

### 3.2 ดูด้วยตา (ทุกสื่อ รวมรูป สไลด์ PPTX โปสเตอร์ เอกสาร Word)

เรนเดอร์เป็นภาพที่ขนาดใช้จริงแล้วไล่ 9 ข้อ:

1. **เอาโลโก้ออก** — ยังรู้ไหมว่างานของใคร ถ้าใช้กับคู่แข่งได้ = ไม่ผ่าน
2. **หรี่ตา** — มีของเด่นอย่างเดียวไหม หรือทุกอย่างเรียกร้องพร้อมกัน
3. **นับสัญญาณในข้อ 2** — 3 ข้อขึ้นไปในชิ้นเดียว = ดูเหมือน AI ทำ
4. **เนื้อหาจริง** — มีชื่อ ตัวเลข ภาพจริงไหม หรือเป็นคำกลาง ๆ กับภาพสต็อก
5. **ชุดเดียวกัน** — สไลด์ทุกหน้า โพสต์ทุกโพสต์ ใช้ระบบเดียวกัน แต่เลย์เอาต์ไม่ซ้ำกันทุกหน้า
6. **รูป AI** — ดูมือ ฟัน ตัวหนังสือ เงา แสง ขนาดของจริง ซูม 200 % ก่อนใช้
7. **พื้นที่ว่าง** — มีที่ให้ของสำคัญหายใจไหม ไม่ได้อัดเต็มขอบ
8. **คำ** — อ่านหัวข้อออกเสียง ฟังเหมือนคนพูดไหม (`human-writing` ข้อ 8)
9. **ตัดออก 1 ชิ้นก่อนส่ง** — หาของที่เอาออกแล้วงานไม่เสียอะไร (เงา · เส้นกรอบ · ไอคอนประดับ · ป้ายเหนือหัวข้อ · การเคลื่อนไหว · ไล่สี · ย่อหน้าสรุป) แล้วเอาออกจริง · หาไม่เจอเลยค่อยส่ง · งาน AI มักมีของเกิน 1 ชิ้นเสมอ เพราะโมเดลเติมมากกว่าตัด (แนวคิดจาก frontend-design ของ Anthropic · Apache-2.0)

**ให้คนที่ไม่ได้ทำตรวจ:** ส่งภาพให้ subagent ตัวใหม่ (`reviewer` หรือ `design-critic`) พร้อมข้อ 3.2 แล้วขอ "จุดที่ดูเหมือน AI ทำ 3 จุด พร้อมวิธีแก้" ห้ามชม · คนทำเองมองไม่เห็นค่าตั้งต้นของตัวเอง

### 3.3 บันทึกผล

ท้ายคำตอบหรือรายงาน 1 บรรทัด: `no-ai-look: สคริปต์ P0 0 · P1 0 · P2 n (ตั้งใจ n) · ตา 9/9 · ตัดออก: <ชิ้นที่ตัด>` · ข้อที่ตั้งใจคงไว้ให้ลง `## ตัดสินใจเอง` พร้อมเหตุผล

---

## 4 · เขียน brief ให้เครื่องมือสร้างภาพหรือ subagent

ใส่ทุกครั้ง ไม่งั้นได้ค่าเฉลี่ย:

- แนวที่มีชื่อ + ภาพอ้างอิงจริง 1–3 ภาพ (ไม่ใช่คำคุณศัพท์)
- สี hex ของแบรนด์ · แหล่งแสงและเวลา · เลนส์หรือมุมกล้อง
- รายละเอียดที่สังเกตจากของจริง (สถานที่ ร่องรอย ฤดู คนแบบไหน)
- สิ่งที่ไม่เอา: โทนเขียวอมฟ้า-ส้ม · ผิวเนียนพลาสติก · แสงทองทุกฉาก · ตัวหนังสือในภาพ (ใส่ตัวหนังสือเป็นชั้นแยกที่แก้ได้)
- ได้ภาพมาแล้วต้อง**แก้** — ครอป ตัดต่อ ปรับแสง ไม่ใช้ภาพแรกที่ออกมา

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกแล้ววงเล็บตัวย่อ เช่น Cascading Style Sheets (CSS) · ดู `human-writing` ข้อ 3


## reference: catalog.md

# catalog — สัญญาณที่ทำให้งานดูเหมือน AI ทำ (ฉบับเต็ม)

ส่วนขยายของ `no-ai-look` · เปิดเมื่อสคริปต์รายงานกฎที่ไม่คุ้น หรือต้องตรวจสื่อที่สคริปต์ไม่เห็น
คอลัมน์ "กฎ" คือชื่อใน `scripts/slop_scan.py` (ว่าง = ดูด้วยตา) · คอลัมน์ "ที่มา" ใช้รหัสในหัวข้อ 9 · เก็บเฉพาะข้อที่มีอย่างน้อย 2 แหล่ง ยกเว้นที่เขียนว่า (1 แหล่ง)

## สารบัญ

1. [สีและพื้นผิว](#1--สีและพื้นผิว)
2. [การ์ด กล่อง และโครงหน้า](#2--การ์ด-กล่อง-และโครงหน้า)
3. [ตัวอักษรและหัวข้อ](#3--ตัวอักษรและหัวข้อ)
4. [การเคลื่อนไหว](#4--การเคลื่อนไหว)
5. [คำในหน้าจอ สไลด์ และโฆษณา](#5--คำในหน้าจอ-สไลด์-และโฆษณา)
6. [รูป AI โลโก้ โปสเตอร์ โพสต์](#6--รูป-ai-โลโก้-โปสเตอร์-โพสต์)
7. [สไลด์ เอกสาร diagram](#7--สไลด์-เอกสาร-diagram)
8. [คุณภาพพื้นฐาน (ไม่ใช่ AI แต่พังจริง)](#8--คุณภาพพื้นฐาน)
9. [ที่มา](#9--ที่มา)

---

## 1 · สีและพื้นผิว

| สัญญาณ | ทำไมดูเป็น AI | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|---|
| ไล่สีม่วง-น้ำเงิน-ฟ้า หรือชมพู | ค่าตั้งต้นจาก tutorial และ framework ไม่มีใครเลือก | สีแบรนด์ 1 สีที่ผูกกับธุรกิจ | `ai-palette` | IM · CM · UN · VP |
| ปุ่มและลิงก์สี indigo `#6366f1` | indigo-500 ของ Tailwind ที่ tutorial และโค้ดที่ AI สร้างใช้บ่อย (ค่าตั้งต้นของ shadcn/ui เป็นเทาเข้มเกือบดำ ไม่ใช่ indigo — ตรวจ 22 ต.ค. 2569) | ตั้ง token สีเอง | `framework-default` | CM · UN · SK · VP · 21 |
| ตัวอักษรไล่สี | เน้นแบบประดับ ไม่ได้บอกอะไร | สีทึบ + ขนาดหรือน้ำหนัก | `gradient-text` | IM · DC |
| นีออน/เงาเรืองบนพื้นมืด | สูตร "cyberpunk" ตั้งต้น | ลด glow ให้ข้อมูลเด่นแทน | `neon-glow` | IM · DC |
| แสงฟุ้งวงกลมหลังเนื้อหา | ฉากหลัง AI ที่เห็นบ่อยสุด | ระยะห่าง คอนทราสต์ หัวข้อชัด | `radial-halo` | IM · DC |
| พื้นครีม/เบจ + เซอริฟ + เขียวขี้ม้า | "รสนิยมดี" ที่กลายเป็นสูตรใหม่ | เลือกจากบริบทโปรเจกต์ | `cream-palette` | IM · UN · SK |
| พื้นครีม (ราว `#F4F1EA`) + สีเน้นส้มอิฐ (terracotta) + หัวข้อเซอริฟคอนทราสต์สูง เป็นชุดตั้งต้น | ชุด "อบอุ่น มีรสนิยม" ที่โมเดลหยิบเมื่อ brief ไม่ได้กำหนดสี · ส้มอิฐใกล้สีแบรนด์ของ Anthropic เอง งานลูกค้าจึงฟ้องง่าย | สีจากธุรกิจและวัสดุจริงของโปรเจกต์ · ใช้ครีมได้เมื่อแบรนด์หรือ brief สั่ง | `cream-palette` บางส่วน (จับพื้นครีม ไม่จับส้มอิฐ) | AN (1 แหล่ง · anthropics/skills `frontend-design` Apache-2.0 · ตรวจ 2026-10-23) |
| ดำอมสี (`#111` · `#0B0B0B`) แทนดำทุกงาน คู่สีเน้นอุ่น 1 สี เป็นค่าตั้งต้น | ท่าตกแต่งของ template ที่ใส่ไม่ว่างานเรื่องอะไร ดูตั้งใจแต่ไม่มีใครเลือก | ดำจริง หรือเฉดเข้มของสีแบรนด์ที่มีเหตุผลจากงาน · จดเหตุผลไว้ข้าง token | | AN (1 แหล่ง · หัวข้อ template chrome ของ `frontend-design` · ตรวจ 2026-10-23) |
| กระจกฝ้าทั่วหน้า | ใช้ประดับ ไม่ได้แก้ปัญหาชั้นซ้อน | ใช้เฉพาะของที่ลอยทับเนื้อหาจริง | `glassmorphism` | IM · DC |
| ลายกริดหรือลายทางตกแต่งพื้น | เติมที่ว่างด้วยเส้น | พื้นเรียบ · กริดเฉพาะ canvas/แผนที่ | `grid-bg` `stripes` | IM (1 แหล่ง) |
| ค่าตั้งต้นของ shadcn ทั้งชุด (เทา slate · มุมเดียวทั้งแอป · `rounded-2xl shadow-lg p-6` · `max-w-7xl`) | หน้าตาของ framework ไม่ใช่การตัดสินใจ | ตั้ง token สี มุม เงา ระยะ ก่อนสร้าง | `framework-default` บางส่วน | CM · UN · SK · VP · CV |
| ใช้ทั้งคอนทราสต์ต่ำและสีเทาบนพื้นสี | ดู "สะอาด" แต่อ่านไม่ออก | ≥ 4.5:1 · ใช้เฉดเข้มของสีพื้น | `low-contrast` | IM (1 แหล่ง) |

## 2 · การ์ด กล่อง และโครงหน้า

| สัญญาณ | ทำไมดูเป็น AI | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|---|
| แถบสีหนาข้างการ์ดมุมมน | ทำให้การ์ดธรรมดาดูเหมือนคำเตือน | เอาออกถ้าไม่ได้บอกสถานะ · ป้ายพื้นทึบ | `side-tab` | IM · GD (ข้อ 7) |
| การ์ดซ้อนการ์ด | ชั้นลึกเกิน ที่ทำงานเหลือน้อย | ระยะห่าง ตัวอักษร เส้นคั่น | `nested-cards` | IM (1 แหล่ง) |
| เส้น 1px + เงากว้างบนกล่องเดียว | กำหนดขอบซ้ำ 2 ทาง | เลือกอย่างเดียว | `hairline-shadow` | IM (1 แหล่ง) |
| มุมโค้งใหญ่เกินกล่อง | ทุกการ์ดเป็นก้อนเหมือนกัน | ลดตามขนาดกล่อง | `huge-radius` | IM (1 แหล่ง) |
| กริดการ์ดไอคอน-หัว-ข้อความเหมือนกัน | ทุกข้อน้ำหนักเท่ากัน | จัดกลุ่ม · ให้ข้อสำคัญใหญ่กว่า | | IM · GD |
| ตัวเลขยักษ์ + ป้ายเล็ก + สถิติ 3 ช่อง | template หน้าขาย | ใช้ตัวเลขเมื่อช่วยอธิบาย พร้อมบริบท | | IM (1 แหล่ง) |
| โครงหน้าตายตัว: ฮีโร่กลาง → การ์ด 3 → โลโก้ลูกค้า → ราคา → FAQ → footer 4 คอลัมน์ | ลำดับของ template ไม่ใช่ของหน้า | สร้างจากเป้าหมายของหน้าและสิ่งแรกที่คนอ่านต้องทำ | | CM · UN · VP · SK |
| ระยะห่างเท่ากันหมด | แยกไม่ออกว่าอะไรอยู่กลุ่มเดียวกัน | ใกล้ในกลุ่ม ห่างระหว่างกลุ่ม | | IM (1 แหล่ง) |
| สมมาตรทุกอย่าง จัดกลางทุกอย่าง | ไม่มีจุดตั้งใจ | อสมมาตร · ช่องใหญ่ 1 ช่อง · ฮีโร่เยื้อง | | 21 · AN · GA |
| เนื้อหาตั้งค่ายัดใน modal | ที่ไม่พอ | หน้าแยก | | IM (1 แหล่ง) |

## 3 · ตัวอักษรและหัวข้อ

| สัญญาณ | ทำไมดูเป็น AI | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|---|
| Inter/Geist ทุกงาน | ทำให้สินค้าต่างกันดูเหมือนกัน | ฟอนต์ตามบุคลิก · คงไว้ถ้าเป็นฟอนต์แบรนด์ | `overused-font` | IM · GD · AN |
| เปลี่ยนไป Space Grotesk ทุกงานแทน | ค่าตั้งต้นตัวใหม่ | มีเหตุผลจากโปรเจกต์ | | UN · SK |
| เซอริฟตัวเอียงขนาดยักษ์ | ทางลัดสู่ "editorial" | แบบอักษรตามบุคลิกสินค้า | `italic-serif-display` | IM (1 แหล่ง) |
| ป้ายเล็กเหนือหัวข้อ ("Introducing" · "New") | เพิ่มบรรทัดที่ไม่บอกอะไร ดูเหมือนกดได้ | ใส่คำนั้นในหัวข้อเลย หรือตัด | `eyebrow-badge` | IM (1 แหล่ง) |
| ไอคอนในกรอบมนเหนือหัวข้อการ์ด | pattern การ์ดฟีเจอร์ของ AI | ไอคอนข้างหัวข้อ หรือเอากรอบออก | `icon-tile` | IM (1 แหล่ง) |
| เลข 01/02/03 ที่ไม่มีลำดับ | รกโดยไม่บอกอะไร | ใช้เมื่อมีขั้นตอนจริง | `numbered-labels` | IM (1 แหล่ง) |
| หัวข้อยาวขนาด display กินจอแรก | ไม่เหลือที่อธิบาย | สั้นลงหรือเล็กลง | | IM (1 แหล่ง) |
| หัวกับเนื้อหาขนาดใกล้กัน | สแกนไม่ได้ | ต่างกันชัดด้วยขนาด น้ำหนัก ระยะ | | IM (1 แหล่ง) |
| บีบระยะตัวอักษรแรง | ตัวติดกันอ่านยาก | ไม่ต่ำกว่า -0.03em | `crushed-tracking` | IM (1 แหล่ง) |
| อีโมจิในหัวข้อหรือแทนไอคอน | ไม่มีระบบไอคอน | ชุด SVG ชุดเดียว | `emoji-heading` | CM · UN · WW |
| ไอคอนเส้นบางชุดเดียว (เช่น Lucide) ขนาด 16 ทุกที่ | ซ้ำกับทุกสินค้า | เลือกชุดที่ตั้งใจ · ใช้ภาพหน้าจอ/กราฟจริงแทน | | BL · 2S |

## 4 · การเคลื่อนไหว

| สัญญาณ | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|
| fade-up และ hover-scale ทุกชิ้น | ขยับเฉพาะที่มีความหมาย 150–300 ms ease-out · เว็บที่ต้องมีชีวิตใช้ทางเข้า 4 แบบสลับกัน ไม่ซ้ำแบบเดียวทุกจุด (`dynamic-website` ใน software-company) | | UN · SK · BL |
| จุดสถานะกระพริบไม่หยุด | นิ่ง · ขยับเมื่อสถานะเปลี่ยน | `pulsing-dot` | IM (1 แหล่ง) |
| เคอร์เซอร์กระพริบในข้อความนิ่ง | เก็บไว้ในช่องที่พิมพ์ได้ | `blinking-cursor` | IM (1 แหล่ง) |
| ตัวอักษร/โลโก้เลื่อนเอง | นิ่ง หรือมีปุ่มหยุด | `marquee` | IM (1 แหล่ง) |
| easing เด้งหรือยืด | settle เร็ว · เด้งเฉพาะช่วงที่เข้ากับสินค้า | `bounce-easing` | IM · GD motion-basics |
| animate ความกว้าง ระยะ หรือ `transition: all` | transform/opacity | `layout-animation` | IM (1 แหล่ง) |
| รูปซูมหรือหมุนเมื่อชี้ | นิ่ง เว้นแต่บอกว่ากดได้ | `hover-zoom-image` | IM (1 แหล่ง) |
| เนื้อหาซ่อนรอ animation ถ้า script ไม่ทำงานก็ไม่โผล่ | มองเห็นเป็นค่าตั้งต้น | | IM (1 แหล่ง) |

## 5 · คำในหน้าจอ สไลด์ และโฆษณา

หลักใหญ่อยู่ใน `human-writing` ข้อ 3 · ตารางนี้เก็บเฉพาะที่เจอในงานออกแบบ

| สัญญาณ | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|
| คำโฆษณากว้าง ๆ (supercharge · world-class · seamless · ยกระดับ · ไร้รอยต่อ · ล้ำสมัย) | บอกว่าผู้ใช้ทำอะไรได้ ดีขึ้นแค่ไหน | `buzzword` | IM · WW · 2S |
| "Not a feature. A platform." · "ไม่ใช่แค่… แต่คือ…" | อธิบายตรง ๆ | `forced-contrast` | IM · human-writing |
| ขีดยาวทุกประโยค | อังกฤษ: แยกเป็นประโยคด้วยจุด · ไทย: เว้นวรรคหรือขึ้นย่อหน้า ไม่ใส่จุดกลางย่อหน้า (`thai-grammar` `f3` `t-dash`) | `em-dash-overuse` | IM · WW |
| ประโยคเปิดสำเร็จรูป ("In today's fast-paced world" · "ในยุคดิจิทัลที่…") | เปิดด้วยสิ่งที่สินค้านี้ทำได้คนเดียว | `stock-opener` | 2S · WW |
| ท่อนสั้นมีจุดคั่น ("Fast. Simple. Powerful.") · ชุดละ 3 · ชื่อฟีเจอร์ 2 คำนาม | ประโยคเต็มที่มีข้อมูล | | SJ · CM · WW · OW |
| ไม่มีชื่อ ตัวเลข วันที่ · คำอ้างที่ใช้กับคู่แข่งได้ | 1 คำอ้างที่มีแค่เรา พร้อมตัวเลข | | 21 · GA · CP |
| หลักฐานปลอม: รูปทีมที่ไม่ใช่ทีม · โลโก้ที่ไม่ใช่ลูกค้า · persona แต่ง | คนจริง ลูกค้าจริงเท่านั้น | | 21 · WW · CP |
| อีโมจิเรียงในบรรทัดโปรโมต | ไม่ใส่ หรือ 1 ตัวที่มีความหมาย | | WW · CM |
| "theater" ใช้ปัดตก | บอกว่าอะไรไม่ได้ผลและเพราะอะไร | `theater` | IM (1 แหล่ง) |
| คำทางการเกินจำเป็น (utilize · facilitate) · คำเชื่อมแข็ง (Moreover) · ออกตัว ("It's important to note") | คำธรรมดา | `stock-opener` บางส่วน | WW · TS |
| ภาษาไทย: ระดับภาษาผิดที่ · ครับ/ค่ะ/สรรพนามไม่เข้ากับคนอ่าน · สำนวนแปลตรงตัว · ลำดับคำแบบอังกฤษ · ตัดคำจนห้วน | อ่านออกเสียง · ระดับภาษาจากตาราง `human-writing` `references/thai-grammar.md` หัวข้อ 4 · โครงประโยคตามหัวข้อ 1–2 ของไฟล์เดียวกัน · รัน `scripts/thai_tells.py` | | 1S · `thai-grammar` |

## 6 · รูป AI โลโก้ โปสเตอร์ โพสต์

| สัญญาณ | ใช้แทน | ที่มา |
|---|---|---|
| ผิวเนียนไร้รูขุมขน · ทุกวัสดุมันวาวแบบเดียว | เก็บพื้นผิวและร่องรอยจริง | KR · BK · MF |
| สีอิ่ม แสงทองหรือแสงดราม่าทุกฉาก แม้ในอาคาร | แสงจากแหล่งเดียวที่มีเหตุผล เงาตรงกัน | BK · GC · KR |
| โทนเขียวอมฟ้า-ส้ม (ยิ่ง prompt สั้นยิ่งเป็น) | ระบุพาเลต หรือสั่งไม่เอา | FL · 2S |
| คนหน้าตาเฉลี่ย สมบูรณ์แบบ เป็นภาพเหมารวม | รายละเอียดจากการสังเกต: สถานที่ เวลา คนแบบไหน | BK · KR · CP |
| ฉากสะอาดเหมือนโชว์รูม | รอยยับ ร่องรอยใช้งาน แสงธรรมดา | MF · KR |
| ฟิสิกส์ผิด: เงาไม่ตรงแสง เงาสะท้อนผิด เส้นบิด ขนาดไม่สมจริง | ตรวจด้วยตาก่อนใช้ | KR · MF |
| มือ ฟัน ตัวหนังสือมั่ว ฝูงคนซ้ำหน้า | ซูม 200 % ตรวจ · ตัวหนังสือใส่เป็นชั้นแยก | KR · FL · MR |
| ใช้ภาพแรกที่ได้ ไม่แก้ | ครอป ตัดต่อ ปรับ (1 แหล่ง แต่ตรงกับหลักข้อ "แก้ ไม่รับเฉย ๆ") | CP |
| 3D ดินปั้น / isometric / มันวาว | แนวที่เข้ากับแบรนด์ · ภาพจริง | 2S · MF · doc-cover-design ข้อ 9 |
| สั่งด้วยคำคุณศัพท์ ("premium" · "vibrant") | แนวที่มีชื่อ + ภาพอ้างอิง + hex | MR · VP · CP |
| โลโก้วงกลมไล่สีมีรูกลาง · เส้นโค้งพุ่ง · อินฟินิตี้ · ลายวงจร | รูปทรงจากสิ่งเฉพาะ (วาฬของ DeepSeek · เรือใบของ Midjourney) | QW · BU |
| ตัวอักษรเกือบเป็นตัว ละลาย สมมาตรเพี้ยน รายละเอียดหายที่ขนาดเล็ก ไฟล์ raster อย่างเดียว | vector · ทดสอบที่ขนาด favicon · ตัวอักษรจริง | BU · KR · MR |
| โปสเตอร์อัดเต็มขอบ ไม่มีที่ว่าง ย่อหน้าตัวจิ๋ว | ของเด่น 1 ชิ้น · ที่ว่างเยอะ · ตัดคำให้คำสำคัญใหญ่ได้ | MR · KR |
| หลายฟอนต์ หลายสไตล์ภาพในกรอบเดียว (flat + 3D สมจริง + ตัวอักษรมีลาย) | 2–3 ฟอนต์ ภาษาภาพเดียว | MR · KR |
| ตัวหนังสือฝังในภาพ | ชั้นข้อความที่แก้ได้ | KR · MR |
| ฟีดโพสต์แต่ละโพสต์คนละสไตล์ | ระบบแบรนด์เดียวทุกโพสต์ | KR · PN · 2S |
| วงกลมเรืองแสงลอย ๆ สื่อ "เทคโนโลยี" · ภาพสต็อกจับมือ ลูกศรพุ่ง | ของจริง หรือพื้นที่ว่าง | GD (ข้อ 7) (1 แหล่ง) |

## 7 · สไลด์ เอกสาร diagram

| สัญญาณ | ใช้แทน | กฎ | ที่มา |
|---|---|---|---|
| ทุกสไลด์เลย์เอาต์เดียว 3–4 bullet ยาวเท่ากัน | เปลี่ยนตามเนื้อหา · มีหน้าประโยคเดียวบ้าง | | 2S · GA |
| หัวสไลด์รูปแบบเดียว (ยาวเท่ากัน · Title Case · มีโคลอน) | หัว = ข้อสรุป (`human-writing` ข้อ 6) | | 2S · TS |
| ไอคอนเส้นและภาพกลาง ๆ ที่ใช้กับหัวข้อไหนก็ได้ | ภาพจริง กราฟ ภาพหน้าจอ | | 2S · GA |
| ไม่มีข้อมูลจริง รายละเอียดลูกค้า หรือแบรนด์ | ใส่ข้อมูลจริง หรือ `(รอยืนยัน)` | | GA · 21 |
| ทุก bullet ขึ้นต้นตัวหนา | ร้อยแก้ว หรือรายการธรรมดา | `bold-first-bullets` | TF · TS |
| อีโมจิหน้าหัวข้อ · ตัวหนาเยอะ · bullet สัญลักษณ์แปลก | หัวข้อเรียบ · ตัวหนา 2–3 จุด | `emoji-heading` | TS · WW · 2S |
| จัดรูปแบบเกินงาน: รายการทุกที่ หัวข้อ 4 ชั้น ตารางในโน้ตสั้น | รวมส่วน ตัดหัวข้อ | | TS · UM |
| จบทุกส่วนด้วยสรุปหรือความเห็น | จบเมื่อพูดครบ | | TS · WW |
| อ้างอิงหรือคอมโพเนนต์ที่ไม่มีจริง (ลิงก์ตาย · DOI ปลอม · service ที่ระบบไม่มี) | ตรวจกับแหล่งหรือโค้ดทุกตัว | | TS · IL |
| Mermaid หน้าตาตั้งต้น: วางเอง ลูกศรพันไม่มีป้าย รวมหลาย flow ในรูปเดียว | house style ของโปรเจกต์ · ป้ายทุกลูกศร · 1 flow ต่อรูป | | YM · IL |
| ข้อความ Lorem หรือ "ตัวอย่าง" | เนื้อหาสมจริง | `lorem` | IM · ui-craft |

## 8 · คุณภาพพื้นฐาน

ไม่ใช่สัญญาณ AI โดยตรง แต่พังจริง และสคริปต์ตรวจให้: ช่องกรอกมีแค่ placeholder (`placeholder-label`) · รูปไม่มี src (`broken-image`) · ข้ามระดับหัวข้อ (`skipped-heading`) · ตัวอักษรต่ำกว่า 11 px (`tiny-text`) · ระยะบรรทัดเนื้อหาต่ำกว่า 1.3 (`tight-leading`) · จัดชิดสองข้าง (`justified`) · ถ่างตัวอักษรในเนื้อหา (`wide-body-tracking`) · ย่อหน้าตัวพิมพ์ใหญ่ (`all-caps-body`) · ทับรูปด้วยสีเกือบทึบ (`image-overlay`)
ตรวจจากหน้าที่เรนเดอร์แล้วเท่านั้น (สคริปต์ไม่เห็น): ข้อความถูกทับ · ล้นกรอบ · เมนูโดนตัด · บรรทัดยาวเกิน 75 ตัวอักษร · คอลัมน์แรกยาวไม่เท่ากัน · error ของ JavaScript ตอนโหลด

**ไม่ใช่สัญญาณ** (ข้อมูลไม่สนับสนุน อย่าไล่ตัด): bento grid · พื้นไล่สีแบบ mesh/blob (UN)

---

## 9 · ที่มา

ค้นเมื่อ ต.ค. 2026

| รหัส | แหล่ง |
|---|---|
| IM | Impeccable — impeccable.style/slop (กฎตรวจ 61 ข้อบนเว็บ · 62 ข้อใน README ณ 2026-10-23 · ตอนเก็บแคตตาล็อกนี้มี 59 + 6 ข้อรีวิว) |
| AN | Anthropic frontend-design skill — skills.sh/anthropics/claude-code/frontend-design |
| CM | codemyspec.com/blog/vibe-coded-websites-look-the-same |
| UN | claudecodehq.com/playbooks/unslop-ui |
| SK | skills.cat/skills/funboy322/avoid-ai-design |
| VP | vp0.com/blogs/why-does-my-ai-app-look-generic |
| CV | enter.converge.ai/page/en-US/blog/ai-design-sameness |
| 21 | 21st.dev/blog/website-not-look-ai-generated |
| BL | blode.co/writing/you-dont-have-to-make-ai-slop |
| 2S | 2slides.com/blog/can-ai-make-slides-that-dont-look-ai-generated |
| GA | gamma.app/explore/content/guides/what-ai-makes-presentations-that-dont-look-ai-generated |
| CP | creativepool.com (บทความเรื่องงานภาพ AI ที่เหมือนกันหมด) |
| WW | writewithai.substack.com/p/10-dead-giveaways-your-content-screams |
| SJ | seojuice.com/tools/vibe-coded |
| OW | onlinewritingclub.com |
| TS | techspot.com/news/109186 (สรุปหน้า Wikipedia "Signs of AI writing") |
| TF | tropes.fyi/tropes/bold-first-bullets |
| UM | unmarkdown.com/blog/how-to-make-chatgpt-output-look-professional |
| IL | ilograph.com/blog/posts/diagrams-ai-can-and-cannot-generate |
| YM | yomotherboard.com/?p=585548 |
| KR | krumzi.com/blog/is-this-image-ai-generated |
| BK | ischool.berkeley.edu (Hany Farid เรื่องภาพ AI) |
| MF | meltflexai.com/blog/why-ai-renders-look-fake |
| GC | getcoai.com |
| FL | datalab.flitto.com (โทนส้ม-เขียวอมฟ้าในภาพ AI) |
| MR | mikareyes.com (วิธีจับและแก้โปสเตอร์ AI) |
| QW | qwe.edu.pl/tutorial/ai-company-logos-look-like-buttholes-2025 |
| BU | bushe.co/answers/how-to-detect-ai-generated-logos |
| PN | postnitro.ai blog |
| 1S | 1stopasia.com/blog/english-to-thai-ai-translation |
| GD | skill `graphic-design` ของ `software-company` ข้อ 7 (กฎเดิมของชุดนี้) |
