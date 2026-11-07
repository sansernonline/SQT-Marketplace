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

ผิด: `.docx` ไม่มี Heading style · เก็บแต่ PNG ไม่เก็บต้นทาง · `.docx` และ mockup ใน repo โค้ด (ถึงจุดนี้ต้องย้ายเป็นแบบ B) · เอกสารอยู่ 2 ที่ (= 2 เวอร์ชัน) · FSD ก่อน SRS ยืนยัน · ใช้ LLM แต่ไม่มี PROMPT-LIBRARY · sub-project ชื่อ `projects/` `modules/` `apps/` · โฟลเดอร์ว่างสร้างเผื่อ · เอกสารชิ้นเดียวตอบทุกคำถาม

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

ไม่มีแม่แบบ README ที่นี่ — ใช้แม่แบบเดียวของ `project-bootstrap` (`SKILL.md` ข้อ 2 และ `assets/starter-files.md`) โครง 15 หัวข้อ (9 มีเสมอ · 6 มีเมื่อโปรเจกต์มีของนั้น) อยู่ใน `references/readme-skeleton.md` · คำสั่งต่อภาษาใน `references/readme-by-stack.md`

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

> โครงเดียวกับฉบับอังกฤษ · ถ้อยคำใช้ระดับ ข่าว (`human-writing` `references/thai-grammar.md` หัวข้อ 4): ไม่มีบุรุษที่ 1 · แต่ละบรรทัด ประธาน + กริยา + กรรม · ตัวเลขต้องวัดจริง ไม่มีก็ไม่ใส่ · ตัวอย่าง ถูก/ผิด อยู่ใน skill `release-notes` ข้อ 4

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

- **สะกดแปลกเพื่อให้ได้โดเมน** — `Kleen` `Fyre` `Qwik` ลูกค้าพิมพ์ผิดตลอดไป
- **ต่อท้ายด้วย `-soft` `-tech` `-sys` `-solutions`** — ดูเป็นปี 2005
- **ใส่ตัวเลขในชื่อ** — `App360` `Pro24` ตกรุ่นทันทีที่เปลี่ยนรุ่น
- **ชื่อที่บอกความสามารถเฉพาะ** — `InvoiceMaster` แล้ววันที่ทำเรื่องอื่นด้วย
- **3 คำขึ้นไป** — ไม่มีใครพูดเต็ม จะถูกย่อจนจำไม่ได้
- **คำไทยทับศัพท์ที่ฝรั่งอ่านไม่ออก** ถ้าคิดจะขายต่างประเทศ
- **ชื่อที่ต้องอธิบายว่าทำไมถึงตั้งชื่อนี้** — ลูกค้าไม่มีเวลาฟัง
- **เลือกชื่อก่อนตรวจโดเมนและเครื่องหมายการค้า** — เสียเวลา 2 รอบ
- **ระดมชื่อคนเดียวในหัว** — ได้ชื่อจากมุมเดียว ให้เดินตาม 9 สูตรแทน

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

> ระวัง: **คำจริงหาโดเมนยากที่สุด** จึงต้องเตรียมแผนสำรอง เช่น เติมคำบอกหมวด (`arc.app`, `getprism.com`)
> หรือใช้โดเมนสั้นแบบอื่น

## เรื่องเล่าที่ดีกับที่แย่

| | ตัวอย่าง |
|---|---|
| ✓ ดี | "Aegis คือโล่ของเทพซุส — ระบบนี้มีไว้ปกป้อง" — สั้น จำได้ เล่าต่อได้ |
| ✗ แย่ | "A มาจาก Advanced, U มาจาก Unified, R มาจาก Realtime…" — ไม่มีใครจำ |
| ✗ แย่ | "ชื่อนี้มาจากชื่อหมาที่บ้าน" — ความหมายส่วนตัว ลูกค้าไม่รู้สึกด้วย |


---

# skill: project-bootstrap

Use when starting a repository or one is slow to run on a new machine (layout, README, one run command).

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
- 🚨 ตั้ง `end_of_line = lf` และ `.gitattributes` `* text=auto eol=lf` — ไม่งั้นทีมที่ใช้ Windows ปนระบบอื่นจะเจอ pull request ที่ diff ทั้งไฟล์
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

# โครง README และเอกสารคู่ — ฉบับเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 2 · แม่แบบที่คัดลอกไปใช้ได้อยู่ใน `assets/starter-files.md` · คำสั่งและไฟล์ของแต่ละภาษาอยู่ใน [`readme-by-stack.md`](readme-by-stack.md)

## 1 · หัวข้อ README เรียงตามลำดับที่คนใหม่ต้องใช้

> ตารางนี้คือค่าสำรองและเกณฑ์ความยาวของชั้น 3 ใน `SKILL.md` ข้อ 2 · หัวข้อจริงของแต่ละโปรเจกต์มาจากผลสำรวจชั้น 2 (อ่านโปรเจกต์ · เอกสารทางการ · README ของโปรเจกต์ประเภทเดียวกัน) · หัวข้อที่โปรเจกต์ประเภทนั้นต้องมีแต่ไม่อยู่ในตาราง ให้เพิ่มได้

ลำดับนี้ไล่ตามที่คนเพิ่งมาถึงต้องการ: นี่คืออะไร → ติดตั้ง → รัน → แก้โค้ด → ส่งขึ้นระบบ · คอลัมน์ "แหล่ง" คือจำนวนแหล่งใน 5 แหล่งหลัก (หัวข้อ 4) ที่แนะนำหัวข้อนั้น · แถวที่รวมหลายเรื่องบอกเป็นช่วง · "—" คือไม่มีแหล่งหลักแนะนำ เป็นการตัดสินของ skill นี้

| # | หัวข้อ | ตอบคำถามอะไร | มีเมื่อ | ยาวแค่ไหน · ยาวเกินย้ายไปไหน | แหล่ง |
|:--:|---|---|---|---|:--:|
| 1 | ชื่อ + ทำอะไรให้ใคร | นี่คืออะไร ใครใช้ | เสมอ | 2–3 บรรทัด · บรรทัดแรกไม่เกิน 120 ตัวอักษร | 5 |
| 2 | บรรทัดสถานะ | ยังพัฒนาอยู่ไหม ใครเป็นเจ้าของ เอกสารอยู่ไหน | เสมอ | 1 บรรทัด: สถานะ · เจ้าของ · ลิงก์ `docs/README.md` | 2–4 (สถานะ 2 · เจ้าของ 4 · ลิงก์เอกสาร 4) |
| 3 | ภาพหน้าจอหรือตัวอย่างผล | หน้าตาหรือผลลัพธ์เป็นแบบไหน | มีหน้าจอหรือผลที่ดูได้ | 1 รูป หรือคำสั่งตัวอย่างพร้อมผล | 2 (ตัวอย่างการใช้ 3) |
| 4 | ต้องมีบนเครื่อง | ต้องลงอะไรก่อน รุ่นไหน | เสมอ | ตาราง: เครื่องมือ · รุ่น · ปักรุ่นไว้ที่ไฟล์ไหน (`.nvmrc` · `global.json`) | 3 |
| 5 | เริ่มใช้งาน | ติดตั้งและรันยังไง | เสมอ | คำสั่งที่คัดลอกไปวางแล้วรันได้ ไม่เกิน 6 คำสั่ง · เกินนั้นทำเป็น `scripts/setup` | 4 |
| 6 | ตั้งค่า | ต้องตั้งค่าอะไร มีกี่ environment สลับยังไง | โปรเจกต์อ่านค่าจากภายนอก | ตาราง: ชื่อตัวแปร · ใช้ทำอะไร · ต้องมีไหม · ค่าตัวอย่าง (ไม่ใส่ค่าจริง) · ค่าลับบอกแค่ชื่อและที่ขอ · ไม่มีเลยเขียน "ไม่มีค่าตั้งภายนอก" | 0 · อิง Twelve-Factor |
| 7 | คำสั่งที่ใช้บ่อย | dev · test · lint · format · build สั่งยังไง | เสมอ | ตาราง 4–8 แถว · test ต้องเป็น 1 คำสั่ง | 2 |
| 8 | โครงโปรเจกต์ | อะไรอยู่โฟลเดอร์ไหน | เสมอ | ผังชั้นเดียว ไม่เกิน 15 บรรทัด · เกิน → `ARCHITECTURE.md` หัวข้อแผนที่โค้ด | 1 |
| 9 | สถาปัตยกรรมย่อ | ระบบมีกี่ส่วน คุยกันยังไง | มีมากกว่า 1 ส่วน (หน้าเว็บ + API + ฐานข้อมูล · คิว · บริการภายนอก) | 3–5 บรรทัด + รูป Mermaid ระดับ Context หรือ Container · เต็ม → `ARCHITECTURE.md` | — · อิง matklad และ C4 |
| 10 | build และไฟล์ที่ได้ | ทำตัวส่งมอบยังไง ได้ไฟล์อะไร อยู่ไหน | มีของที่ต้อง build (เว็บ · แอป · binary · package) | คำสั่ง build ต่อเป้าหมาย + path ของไฟล์ที่ได้ | 2 (นับรวม deploy) |
| 11 | deploy | ขึ้นระบบที่ไหน ใครกด ผ่าน Continuous Integration (CI) ตัวไหน ย้อนยังไง | ขึ้นระบบได้ | 3–5 บรรทัด · ขั้นเต็ม → `docs/runbook-deploy.md` | 2 (นับรวม build) |
| 12 | ติดปัญหา | อาการที่เจอบ่อยและวิธีแก้ | เสมอ | ตาราง อาการ · แก้ · เริ่มจากที่เจอเองตอนเขียน README | — |
| 13 | ร่วมพัฒนา | branch · commit · pull request (PR) · ตรวจอะไรก่อนส่ง | มีคนอื่นแก้โค้ด | 3–5 บรรทัด · ยาว → `CONTRIBUTING.md` | 4 |
| 14 | ติดต่อและขอความช่วยเหลือ | ติดขัดถามใคร ช่องทางไหน | เสมอ | 1–2 บรรทัด | 4 |
| 15 | สัญญาอนุญาต | เอาไปใช้ต่อได้แค่ไหน | เสมอ · เป็นหัวข้อสุดท้าย | 1 บรรทัด + ไฟล์ `LICENSE` · งานภายในเขียน "ใช้ภายใน <บริษัท> ห้ามเผยแพร่" | 2 |

**กฎของโครง**
- หัวข้อที่ไม่มีของ ตัดทิ้ง ไม่เขียนว่า "ไม่มี" · ยกเว้นหัวข้อ 6 ที่ต้องบอกว่าไม่มีค่าตั้งภายนอก
- README มีแค่สิ่งที่คนใหม่ต้องใช้ใน 30 นาทีแรก · ของที่ยาวกว่านั้นย้ายไปไฟล์ในหัวข้อ 2 แล้วลิงก์กลับ ไม่ลบทิ้ง
- ยาวเกิน 100 บรรทัด → ใส่สารบัญใต้บรรทัดสถานะ
- แก้ README ใน commit เดียวกับโค้ดที่ทำให้คำสั่งหรือค่าตั้งเปลี่ยน
- แต่ละภาษามีหัวข้อที่ต้องเพิ่ม (flavor ของ Flutter · `user-secrets` ของ .NET) → [`readme-by-stack.md`](readme-by-stack.md) หัวข้อ 3

## 2 · ของที่แยกไปไฟล์อื่น

| ไฟล์ | อยู่ที่ | เนื้อหา | สร้างเมื่อ |
|---|---|---|---|
| `ARCHITECTURE.md` | `<project-name>/` | แผนที่โค้ดสำหรับคนแก้โค้ด (หัวข้อ 3) | ผังโฟลเดอร์ใน README เกิน 15 บรรทัด หรือระบบมีมากกว่า 1 ส่วน |
| `CHANGELOG.md` | `<project-name>/` | สิ่งที่ผู้ใช้เห็นเปลี่ยนในแต่ละรุ่น | ตามตารางใน `SKILL.md` ข้อ 3 |
| `CONTRIBUTING.md` | `<project-name>/` | ตั้งเครื่องนักพัฒนา · branch · commit · PR · lint และ test ก่อนส่ง | หัวข้อ 13 ของ README ยาวเกิน 5 บรรทัด |
| `LICENSE` | `<project-name>/` | ข้อความสัญญาอนุญาตเต็ม | repo เปิดสาธารณะ หรือสัญญาจ้างระบุ |
| `SECURITY.md` | `<project-name>/` หรือ `.github/` | ช่องทางแจ้งช่องโหว่ · รุ่นที่ยังดูแล | repo เปิดสาธารณะ หรือส่งมอบให้ลูกค้าดูแลต่อ |
| `CODEOWNERS` | `.github/` | โฟลเดอร์ไหนใครต้องตรวจ PR | มีหลายทีมหรือหลายเจ้าของ |
| `runbook-deploy.md` | `docs/` ที่ราก | ขั้น build → release → run · ตั้งค่าแต่ละ environment · ย้อนรุ่น | ขั้น deploy ยาวเกิน 5 บรรทัด |
| `decisions/ADR-NNNN-<slug>.md` | `docs/` ที่ราก | บันทึกการตัดสินใจ (Architecture Decision Record (ADR)) ทีละเรื่อง | ตัดสินใจเรื่องที่ย้อนยาก (`adr-writer`) |
| Architecture ฉบับส่งมอบ | `docs/` ที่ราก | เอกสารสถาปัตยกรรมแบบ arc42 | ส่งมอบลูกค้าหรือมีผู้ตรวจรับ (`project-doc-set`) |

ที่อยู่ของ `docs/` ตามผังแบบ B ใน `project-doc-set` ข้อ 1 · GitHub หา `CONTRIBUTING` และ `CODEOWNERS` ใน `.github/` ก่อน แล้วราก repo แล้ว `docs/` · เอกสารใน `docs/` แบ่งตามสิ่งที่ผู้อ่านต้องการได้ 4 แบบ (Diátaxis): เรียนรู้ (tutorial) · ทำงานให้เสร็จ (how-to เช่น runbook) · เปิดหาข้อเท็จจริง (reference เช่น ตารางค่าตั้ง API) · เข้าใจเหตุผล (explanation เช่น ARCHITECTURE · ADR)

## 3 · ARCHITECTURE.md

**ค่าเริ่ม: แบบสั้นของ matklad** — ผู้อ่านคือคนที่จะแก้โค้ดและอยากรู้ว่าของที่ทำ X อยู่ตรงไหน

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

- สั้น ใส่เฉพาะของที่ไม่ค่อยเปลี่ยน · เอ่ยชื่อไฟล์ โมดูล หรือ type ได้ แต่ไม่ใส่ลิงก์ เพราะลิงก์เสียเมื่อย้ายไฟล์ ให้คนค้นด้วยชื่อแทน
- ไม่อธิบายทุกโมดูลละเอียด · ไม่ไล่แก้ทุก commit · ทบทวนปีละ 2–3 ครั้ง
- รูปใช้แค่ 2 ระดับของ C4 คือ Context กับ Container ซึ่ง c4model.com บอกว่าพอสำหรับทีมส่วนใหญ่ · ระดับ Code ไม่วาดเก็บ · วาดด้วย Mermaid ตาม `software-diagrams`

**ใช้ arc42 แทนเมื่อ** ส่งมอบให้ลูกค้าหรือทีมอื่นดูแลต่อ · มีข้อกำหนดคุณภาพ (ความเร็ว ความปลอดภัย) ที่ต้องพิสูจน์ · ต้องมีผู้ตรวจรับ — เลือกเฉพาะหัวข้อที่มีของจริงจาก 12 หัวข้อ: เป้าหมาย · ข้อจำกัด · ขอบเขตและบริบท · แนวทางแก้ · ส่วนประกอบ · การทำงานขณะรัน · การติดตั้ง (deployment) · แนวคิดที่ตัดผ่าน · การตัดสินใจ (ชี้ไป ADR) · ข้อกำหนดคุณภาพ · ความเสี่ยงและหนี้เทคนิค · อภิธานศัพท์ · ฉบับนี้อยู่ `docs/` ตาม `project-doc-set` ไม่ใช่ในโฟลเดอร์โค้ด

## 4 · แหล่ง (เปิดอ่าน 2026-11-07)

5 แหล่งหลักที่ใช้นับคอลัมน์ "แหล่ง" ในหัวข้อ 1:
- [standard-readme spec](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — หัวข้อบังคับ · สัญญาอนุญาตอยู่ท้าย · สารบัญเมื่อเกิน 100 บรรทัด
- [Make a README](https://www.makeareadme.com/) — ยาวดีกว่าสั้น ยาวเกินให้ย้าย ไม่ใช่ลบ
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Google documentation guide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) · [Best practices](https://google.github.io/styleguide/docguide/best_practices.html) — แก้เอกสารพร้อมโค้ด
- [Microsoft Engineering Playbook: Project and Repositories](https://microsoft.github.io/code-with-engineering-playbook/documentation/guidance/project-and-repositories/) — โครงโฟลเดอร์ · compile test build deploy

แหล่งประกอบ: [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) · [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) · [arc42](https://arc42.org/overview) · [C4 model diagrams](https://c4model.com/diagrams) · [Diátaxis](https://diataxis.fr/) · [Twelve-Factor: Config](https://12factor.net/config) · [Build, release, run](https://12factor.net/build-release-run)

ลำดับหัวข้อ · เพดาน 15 บรรทัดและ 6 คำสั่ง · ตารางตั้งค่า · หัวข้อติดปัญหาและสถาปัตยกรรมย่อ เป็นการตัดสินของ skill นี้ ไม่ใช่คำของแหล่ง
