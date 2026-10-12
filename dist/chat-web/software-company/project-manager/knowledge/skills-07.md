# skill: document-naming

Use when creating, renaming or filing a document a team or client keeps (file name, version, status).

# ตั้งชื่อและจัดเวอร์ชันเอกสาร

> **กฎข้อเดียว:** ไฟล์ที่อยู่ใน git **ห้ามใส่เวอร์ชันในชื่อ** เพราะ git คือประวัติอยู่แล้ว
> ไฟล์ที่ออกไปนอก git **ต้องใส่** เพราะไม่มีอะไรบอกได้อีกแล้วว่าใครถือฉบับไหน

## เมื่อไหร่ใช้ skill นี้

- สร้างเอกสารใหม่ที่ทีมหรือลูกค้าจะเก็บไว้
- ส่งเอกสารออกไปให้คนนอกทีม
- โฟลเดอร์เริ่มมี `final`, `final2`, `ล่าสุด`, `แก้แล้ว`
- มีคนถามว่า "ตกลงยึดฉบับไหน"

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เนื้อหาข้างในเอกสาร | `srs-writing` · `fsd-writing` · `adr-writer` |
| รูปแบบ markdown | `polished-document-style` |
| หน้าตาไฟล์ที่ render ออกมา | `branded-document-design` |
| ไฟล์ชั่วคราวระหว่างทำงาน | `temp-file-discipline` |
| ข้อความ commit | `commit-message-format` |

---

## 1 · เลือกรูปแบบก่อนตั้งชื่อ

**เกณฑ์เดียว: ถ้ามีคนเซ็นหรือส่งออกนอกทีม ให้ทำเป็นไฟล์ส่งมอบ ส่วนเอกสารที่เปลี่ยนตามโค้ดให้เป็น markdown ใน `docs/`**

| เอกสาร | รูปแบบ | เหตุผล |
|---|---|---|
| Project Plan · BRD · SRS · Architecture · FSD · Test Plan (`project-doc-set` ข้อ 2.1) · ข้อเสนอโครงการ · ใบตรวจรับ UAT · สัญญา | **docx** | มีคนเซ็น ต้องล็อกฉบับ |
| คู่มือผู้ใช้ | **docx + PDF** | ผู้ใช้ปลายทางเปิดได้ทุกเครื่อง |
| สไลด์นำเสนอ | **pptx** · ขอ html → .html ไฟล์เดียว (ชนิดไฟล์ตาม `presentation-design`) · PDF เมื่อเครื่องปลายทางไม่มีฟอนต์ | |
| ADR · API spec · data dictionary · runbook · README | **markdown** — ADR `docs/decisions/` และ runbook `docs/` ที่ราก (`project-doc-set` ข้อ 1) · README ในโฟลเดอร์โค้ด | เปลี่ยนตามโค้ด ต้อง diff ได้ |
| บันทึกประชุม · บันทึกการตัดสินใจ | **markdown** ใน `docs/` | ค้นหาง่าย ไม่ต้องเปิดโปรแกรม |

> 🚨 **เขียนร่างเป็น markdown ใน `_to_delete/drafts/` แล้ว render เป็น docx ลง `docs/`**
> `docs/` มีเอกสารส่งมอบฉบับเดียวคือ .docx — ไม่มี .md และ .pdf ของเรื่องเดียวกันวางซ้ำ
> แก้รอบถัดไป → แก้ร่างแล้ว render ใหม่ · ร่างหายแล้ว → แก้ใน .docx โดยตรงแล้วขึ้นเวอร์ชัน

**PDF ทำเฉพาะคู่มือผู้ใช้ หรือเมื่อลูกค้าขอ** — นอกนั้น docx ฉบับเดียว

---

## 2 · รูปแบบชื่อไฟล์

```
<รหัสโปรเจกต์>-<ประเภท>-<เรื่อง>-v<M.m>-<สถานะ>.docx
```

| ประเภทเอกสาร | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ไฟล์ส่งออก | `<โปรเจกต์>-<ประเภท>-v<M.m>-<สถานะ>.docx` | `TRS-SRS-v1.2-APPROVED.docx` |
| ไฟล์ส่งออกที่มีหลายเรื่อง | เติมเรื่องต่อจากประเภท | `TRS-FSD-recording-v0.3-DRAFT.docx` |
| ฉบับที่ส่งให้ลูกค้าจริง | เติมวันที่ ISO ท้ายสุด | `TRS-SRS-v1.2-APPROVED-2026-09-25.docx` |
| เอกสาร markdown ใน `docs/` | `<ประเภท>-<เรื่อง>.md` ตัวพิมพ์เล็ก ขีดกลาง | `docs/runbook-recording.md` |
| ADR | `ADR-NNNN-<slug>.md` เรียงเลขต่อเนื่อง ใน `docs/decisions/` | `docs/decisions/ADR-0007-choose-whisper.md` |
| บันทึกประชุม | `YYYY-MM-DD-<เรื่อง>.md` | `docs/meetings/2026-09-25-kickoff.md` |

**กฎชื่อไฟล์:**

- ไม่มีเว้นวรรค ใช้ขีดกลาง — เว้นวรรคทำให้ลิงก์และคำสั่งใน command line พัง
- **วันที่เป็น ISO `YYYY-MM-DD` เสมอ** และวางท้ายสุด — เรียงตามชื่อแล้วได้เรียงตามเวลาเอง
- ชื่อไฟล์เป็นอังกฤษ แม้เนื้อหาเป็นไทย — กันปัญหาตอนแนบอีเมลและ zip ข้ามระบบ
- ห้ามใส่ชื่อคนในชื่อไฟล์ — `-somchai-edit` คือสัญญาณว่าไม่ได้ใช้ต้นฉบับเดียว

---

## 3 · เวอร์ชัน

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| **major** (1.x → 2.0) | ขอบเขตเปลี่ยน · โครงเอกสารเปลี่ยน · ต้องเซ็นรับใหม่ |
| **minor** (1.1 → 1.2) | เพิ่มหรือแก้เนื้อหา ยังเป็นเรื่องเดิม |
| ไม่ขึ้นเลข | แก้คำผิด จัดหน้า — แต่**ยังต้องลงประวัติการแก้ไข** |

- ฉบับที่ส่งให้คนดูครั้งแรกคือ `v0.1` ส่วนฉบับแรกที่มีคนเซ็นคือ `v1.0`
- **เลขเวอร์ชันเดินหน้าอย่างเดียว** ไม่ย้อนกลับไปใช้เลขเดิม
- ไฟล์ใน git ไม่มีเลขเวอร์ชันในชื่อ — ถ้าต้องอ้างถึงฉบับหนึ่ง ให้อ้าง tag หรือ commit

---

## 4 · สถานะ — คนละเรื่องกับเวอร์ชัน

| สถานะ | แปลว่า | ใครแก้ได้ |
|---|---|---|
| `DRAFT` | ยังเขียนอยู่ | ผู้เขียน |
| `REVIEW` | ส่งให้ตรวจแล้ว รอความเห็น | ผู้เขียน ตามความเห็นที่ได้ |
| `APPROVED` | เซ็นรับแล้ว | **ห้ามแก้** ต้องขึ้นเวอร์ชันใหม่เป็น DRAFT |

> **`APPROVED` แล้วห้ามแก้ไฟล์เดิม** แม้จะเป็นแค่คำผิด
> ถ้าแก้ได้ ฉบับที่ลูกค้าถืออยู่กับฉบับที่เราถืออยู่จะไม่เหมือนกัน โดยที่ชื่อไฟล์เหมือนกันทุกตัวอักษร

---

## 5 · ประวัติการแก้ไขต้องอยู่ในไฟล์

**ชื่อไฟล์บอกได้แค่ว่านี่คือฉบับไหน ไม่ได้บอกว่าเปลี่ยนอะไร**
ทุกเอกสารส่งออกต้องมีตารางนี้ในหน้าแรก

```markdown
| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | สมชาย | เพิ่ม FR-14.1 ถึง 14.12 · TC เป็น 245 ข้อ | ลูกค้าขอเพิ่มรายงานสรุป |
| 1.1 | 2026-09-12 | สมชาย | แก้ NFR-PERF-010 จาก 3 วินาทีเป็น 5 | วัดจากของจริงแล้วทำไม่ได้ |
| 1.0 | 2026-09-01 | สมชาย | ฉบับเซ็นรับ | — |
```

- **คอลัมน์ "แก้อะไร" ต้องเป็นรูปธรรม** — "ปรับปรุงเนื้อหา" ไม่มีประโยชน์กับใครเลย
- เรียงใหม่อยู่บน — คนเปิดอ่านอยากรู้ว่าเปลี่ยนอะไรล่าสุด
- **ไฟล์ที่ส่งต่อกันเป็นเดือนต้องดูตารางนี้แล้วรู้ทันทีว่าถือฉบับเก่าอยู่ไหม**

---

## 6 · ที่เก็บและการส่ง

| เรื่อง | กฎ |
|---|---|
| ต้นฉบับ | อยู่ใน `docs/` ที่รากเสมอ (`project-doc-set` ข้อ 1) |
| ไฟล์ส่งออก | อยู่ใน `docs/` (ตาม `project-doc-set`) หรือที่เก็บของลูกค้า **ไม่ใช่รากโปรเจกต์** |
| ไฟล์ที่ได้รับมา | เก็บชื่อเดิมของเขาไว้ ห้ามเปลี่ยน — เขาอ้างถึงชื่อนั้น |
| ไฟล์ระหว่างแปลง | `_to_delete/` (ดู `temp-file-discipline`) |
| ส่งทางแชตหรืออีเมล | ส่งไฟล์ที่มีเวอร์ชันและสถานะในชื่อเสมอ ไม่ส่ง `เอกสาร.docx` |

---

## 7 · Anti-patterns

- ❌ **`final.docx`, `final2.docx`, `final_ล่าสุด.docx`** — ไม่มีใครรู้ว่าอันไหนใหม่กว่า
- ❌ **`SRS แก้แล้ว.docx`** — แก้จากฉบับไหน แก้อะไร
- ❌ **ใส่เวอร์ชันในชื่อไฟล์ที่อยู่ใน git** — จะได้ `spec-v1.md` กับ `spec-v2.md` อยู่คู่กันตลอดไป
- ❌ **แก้ไฟล์ที่ `APPROVED` แล้ว** แม้แต่คำผิดเดียว
- ❌ **ไม่มีตารางประวัติการแก้ไข** — แล้วต้องเปิดเทียบทีละหน้า
- ❌ **แก้ใน Word โดยไม่แก้ markdown ต้นฉบับ** — 2 ฉบับเริ่มไม่ตรงกันตั้งแต่นาทีนั้น
- ❌ **วันที่แบบ `25-09-2026` หรือ `250926`** — เรียงไม่ได้ และคนอ่านคนละแบบ
- ❌ **ชื่อไฟล์ภาษาไทยที่มีเว้นวรรค** — ลิงก์พัง แนบอีเมลแล้วชื่อเพี้ยน

---

## 8 · ตัวย่อ

- **SRS** — Software Requirements Specification (เอกสารข้อกำหนดซอฟต์แวร์)
- **FSD** — Functional Specification Document (เอกสารข้อกำหนดเชิงหน้าที่)
- **BRD** — Business Requirements Document (เอกสารความต้องการทางธุรกิจ)
- **UAT** — User Acceptance Testing (การทดสอบเพื่อตรวจรับโดยผู้ใช้)
- **ADR** — Architecture Decision Record (บันทึกการตัดสินใจเชิงสถาปัตยกรรม)
- **ISO 8601** — มาตรฐานรูปแบบวันที่ `YYYY-MM-DD`

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เนื้อหาของ SRS · FSD · ADR | `srs-writing` · `fsd-writing` · `adr-writer` |
| รูปแบบ markdown และธีมสีเอกสาร | `polished-document-style` |
| render เป็น .docx ให้สวย | `branded-document-design` |
| ไฟล์ชั่วคราวระหว่างแปลง | `temp-file-discipline` |
| เวอร์ชันของ **โปรแกรม** (ไม่ใช่เอกสาร) | `cicd-and-release` |
| สารบัญว่าเอกสารไหนอยู่ที่ไหน | `project-bootstrap` |

**แม่แบบตารางประวัติการแก้ไข และรายการชื่อไฟล์มาตรฐาน** อยู่ใน `assets/naming-cheatsheet.md`


---

# skill: project-doc-set

Use when a new project needs its document set decided (which docs, order, where docs and mockups live).

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

**ไฟล์ของ SuperUser — สรุปจาก `team-files` (ต้นฉบับ):** `CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md` · `log/` · `inbox/` · `learn/` อยู่ใน `.claude/superuser/` (`log/` `inbox/` `learn/` ไม่ commit · รายละเอียด → `superuser/references/team-files.md`) · `BRIEF.md` อยู่ `docs/BRIEF.md` · ไม่มี `.superuser/tmp/` ของชั่วคราวลง `_to_delete/` · `AGENTS.md` / `GEMINI.md` มีเฉพาะเมื่อใช้ Codex / Gemini จริง และประกาศเป็นข้อยกเว้นของรากใน README ของโฟลเดอร์โค้ด · โปรเจกต์เก่าที่มี `.superuser/` hook ยังอ่านได้ ย้ายเข้า `.claude/superuser/` เมื่อสะดวก

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

**สายเทคนิค** — เขียนเมื่อถึงจุดที่ต้องใช้ ไม่ต้องรอใคร: README · BUILD-PLAN ก่อนโค้ดบรรทัดแรก · DATA-DICTIONARY ตอนออกแบบตารางแรก · API-SPEC ตอน endpoint แรก · PROMPT-LIBRARY ตอน prompt แรกที่ใช้จริง · ADR ตอนตัดสินใจ (ไม่ใช่ตอนสรุปท้าย เพราะเหตุผลจริงหายแล้ว) · Runbook ก่อนขึ้นระบบจริง — ตารางเต็มใน [`references/technical-docs.md`](references/technical-docs.md)

---

## 4 · ใครเขียนชิ้นไหน ด้วย skill อะไร

ตารางเต็ม (agent · skill ต่อเอกสาร 16 ชนิด) → [`references/technical-docs.md`](references/technical-docs.md) · หลัก ๆ: SRS → `srs-writing` · FSD → `fsd-writing` · ADR → `adr-writer` · Test → `test-case-template` · mockup → `web-app-design` + `ui-craft` · README → `project-bootstrap`

---

## 5 · รูปในเอกสาร — เลือกให้ถูกตั้งแต่ต้น

- รูปใน README · PR · เอกสารในทีม → Mermaid (`software-diagrams`) ฝังใน `.md`
- รูปในเอกสารที่ลูกค้าเซ็น · สไลด์ · งานพิมพ์ → `diagram-figures` เก็บ `docs/figures/` + ต้นทางใน `src/` · **Mermaid ค่าเริ่มต้นห้ามเข้าเอกสารส่งมอบ** (สีสุ่มไม่มีความหมาย ไทยล้นกรอบ ย่อลง A4 แล้วอ่านไม่ออก)

**หัวรูปทุกใบต้องมีครบ 5 อย่าง** — ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ
รูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมลและสไลด์แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้**

---

## 6 · ธีมสีของชุดเอกสาร

ประกาศครั้งเดียวต่อโปรเจกต์ บนหัวไฟล์ต้นทางของทุกเอกสาร:

```markdown
<!-- doc-theme: accent=#5B4BE8 -->
```

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
- [ ] `_to_delete/` ว่าง หรือถูกลบไปแล้ว

---

## 8 · Anti-patterns

❌ `.docx` ไม่มี Heading style · เก็บแต่ PNG ไม่เก็บต้นทาง · `.docx` และ mockup ใน repo โค้ด (ถึงจุดนี้ต้องย้ายเป็นแบบ B) · เอกสารอยู่ 2 ที่ (= 2 เวอร์ชัน) · FSD ก่อน SRS ยืนยัน · ใช้ LLM แต่ไม่มี PROMPT-LIBRARY · sub-project ชื่อ `projects/` `modules/` `apps/` · โฟลเดอร์ว่างสร้างเผื่อ · เอกสารชิ้นเดียวตอบทุกคำถาม

---

## 9 · ตัวย่อ

ADR Architecture Decision Record · BRD Business Requirements Document · FSD Functional Specification Document · QA Quality Assurance · SRS Software Requirements Specification · TOC Table of Contents

---

## 10 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: วาดรูป → `diagram-figures` (ส่งมอบ) · `software-diagrams` (ในทีม) · ของชั่วคราว → `temp-file-discipline` · สถานะเอกสารใน `docs/BUILD-PLAN.md` → `status-report` · รายการตรวจฉบับพิมพ์ → `assets/doc-set-checklist.md`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/writer-templates.md`](references/writer-templates.md) — แม่แบบเอกสารของ


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

ย้ายมาจาก agent `technical-writer` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Outputs

### README Template

```markdown
# Project Name

> One-line description that fits in a tweet.

[![badges]](#)

**Demo:** [link] · **Docs:** [link] · **Discord:** [link]

---

## ✨ Features

- 🚀 What makes this special — feature 1
- ⚡ Killer feature 2
- 🔒 Reassuring feature 3

## 🚀 Quick Start

\`\`\`bash
npm install package-name
\`\`\`

\`\`\`typescript
import { thing } from 'package-name';

const result = thing({ option: 'value' });
\`\`\`

That's it. You're done.

## 📚 Documentation

- [Getting Started](#) — 10-minute tutorial
- [How-To Guides](#) — Solve specific problems
- [API Reference](#) — Full API spec
- [Concepts](#) — Why and how it works

## 🤝 Contributing

See [CONTRIBUTING.md](#).

## 📄 License

MIT
```

### Tutorial Template

```markdown
# 🎓 Tutorial: Build Your First X in 10 Minutes

> 💡 **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- ✅ Node.js 18+
- ✅ A free account at example.com
- ⏱️ 10 minutes

## Step 1: Set Up

Run:
\`\`\`bash
npx create-thing my-project
cd my-project
\`\`\`

> 💡 **What just happened?** Brief explanation.

You should see:
\`\`\`
✓ Project created
\`\`\`

## Step 2: Configure

...

## Step 3: Run It

...

## ✅ Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
```

### API Reference Template (per endpoint)

```markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

🔒 Required. Bearer token in `Authorization` header.

### Request

\`\`\`http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
\`\`\`

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Display name, 1-100 chars |
| `tags` | string[] | ❌ | Up to 10 tags |

### Response: 201 Created

\`\`\`json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

\`\`\`typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ name: 'My Resource' })
});
\`\`\`
```

### Release Notes Template

```markdown
# 🚀 Release v2.1.0 — YYYY-MM-DD

## ✨ Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is now 50% faster
- **Fixed:** Z bug affecting users on platform A

## 🆕 New Features

### Feature Name

Description with user-facing benefit.

\`\`\`bash
# Example usage
command --new-flag
\`\`\`

📖 [Read the docs](#)

## 🔧 Improvements

- Faster initial load time
- Better error messages for X

## 🐛 Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## ⚠️ Breaking Changes

### `api.oldMethod()` removed

**Before:**
\`\`\`typescript
api.oldMethod(arg)
\`\`\`

**After:**
\`\`\`typescript
api.newMethod({ arg })
\`\`\`

📖 [Migration guide](#)

## 🙏 Contributors

Thanks to: @alice, @bob, @charlie
```


---

# skill: context-budget

Use when a task will read many files, search a codebase or run long-output commands.

# งบ context

> **กฎข้อเดียว:** ตัดสินใจ**ก่อน**อ่าน ไม่ใช่อ่านแล้วค่อยเสียดาย
> token ที่เข้า context แล้วเอาออกไม่ได้ ยกเว้นสั่ง `/clear` ซึ่งทิ้งทุกอย่างไปด้วย

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
| **output ของ tool** (อ่านไฟล์ · grep · bash) | ใหญ่สุด ไฟล์เดียวเป็นหมื่น token ได้ | ✅ คุมได้เต็มที่ ทั้งหน้านี้พูดถึงเรื่องนี้ |
| schema ของ tool จาก MCP server | หลักพัน token ต่อ server ทุกเซสชัน | ✅ ปิดตัวที่ไม่ใช้ |
| `CLAUDE.md` | ตามที่เขียน | ✅ เขียนให้สั้น |
| description ของ skill | ~100 token ต่อ skill | ✅ ตัดให้กระชับ |
| ประวัติบทสนทนา | โตเรื่อย ๆ | ⚠️ `/clear` เมื่อเปลี่ยนเรื่อง |

> **เห็นชัดว่าควรคุมอะไรก่อน**: ตัด description ของ skill ทั้งชุดได้แค่ไม่กี่พัน token
> แต่ `cat` ไฟล์ 3,000 บรรทัดครั้งเดียวกินมากกว่านั้น
> **ต้องมีวินัยที่สุดกับแถวบนสุดของตาราง**

---

## 2 · ต้นไม้ตัดสินใจก่อนอ่าน

```
ต้องรู้อะไรจากไฟล์/โฟลเดอร์นี้
├─ รู้ชื่อไฟล์และบรรทัดอยู่แล้ว        → อ่านเฉพาะช่วง (ข้อ 3)
├─ ต้องหาว่าอยู่ตรงไหน                → grep แบบมีขอบเขต (ข้อ 4)
├─ ต้องเปิดดูมากกว่า 3 ไฟล์           → ส่ง subagent (ข้อ 5)
└─ ต้องแปลง/รวม/นับข้อมูลจำนวนมาก     → เขียนลงไฟล์แล้วอ่านเฉพาะสรุป (ข้อ 6)
```

ถ้าไม่รู้ว่าไฟล์ใหญ่แค่ไหน ให้**เช็กขนาดก่อนเสมอ**:

```bash
wc -l path/to/file          # กี่บรรทัด
du -h path/to/file          # กี่ไบต์
```

---

## 3 · อ่านเฉพาะช่วง

| ต้องการ | คำสั่ง |
|---|---|
| ดูว่าไฟล์เกี่ยวกับอะไร | `head -40 file.ts` |
| ดูโครงสร้าง | `rg -n '^(export \|class \|def \|function )' file.ts` |
| อ่านรอบ ๆ บรรทัดที่สนใจ | `sed -n '120,180p' file.ts` |
| ด้วย Read tool | ใส่ `offset` และ `limit` |

**เกณฑ์:** ไฟล์ที่เกิน **300 บรรทัด** ให้อ่านเฉพาะช่วง เว้นแต่จะแก้ทั้งไฟล์จริง ๆ

**อ่านทั้งไฟล์ได้เมื่อ**: กำลังจะเขียนทับทั้งไฟล์ · ไฟล์ตั้งค่าสั้น ๆ ·
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
| ปิดท้าย `\| head -N` | กันกรณีที่ pattern กว้างกว่าที่คิด |
| `-C2` พอ ไม่ต้อง `-C10` | บริบท 2 บรรทัดพอให้รู้ว่าใช่ไหม |

---

## 5 · ส่ง subagent ไปแทน

**นี่คือข้อที่ประหยัดได้มากที่สุดในหน้านี้**

subagent มี context ของตัวเอง จึงอ่านไป 20 ไฟล์ได้
แล้วส่งกลับมาที่บทสนทนาหลักแค่ย่อหน้าเดียว โดยเนื้อหาที่มันอ่านไม่เข้ามาด้วย

| ใช้ subagent เมื่อ | ทำเองเมื่อ |
|---|---|
| ต้องเปิดดูเกิน 3 ไฟล์เพื่อตอบคำถามเดียว | รู้ไฟล์และบรรทัดอยู่แล้ว |
| สำรวจโปรเจกต์ที่ยังไม่รู้จัก | แก้ไฟล์ที่กำลังเปิดอยู่ |
| ตรวจ/รีวิวข้ามหลายไฟล์ | งานที่ต้องเห็นรายละเอียดเต็มเพื่อแก้ต่อ |

**สั่งให้ดีคือบอกว่าต้องการอะไรกลับมา:**

```
❌ "ดูโค้ดส่วน auth ให้หน่อย"
   → มันอาจคืนมาทั้งไฟล์

✅ "หาว่า flow การเข้าสู่ระบบเริ่มที่ไหนและผ่านอะไรบ้าง
    คืนกลับมาแค่ รายการ ไฟล์:บรรทัด ตามลำดับการเรียก
    ไม่ต้องแปะโค้ด ไม่เกิน 15 บรรทัด"
```

> 🚨 **กำหนดรูปแบบและความยาวของผลลัพธ์เสมอ** ถ้าไม่บอกว่าต้องการอะไร
> subagent จะส่งรายงานยาว ๆ กลับมา แล้วก็ไม่ได้ประหยัดอะไรเลย

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

**ใช้กับ**: ผลรัน test · log · ผลลัพธ์จากการแปลงไฟล์ · ข้อมูลที่ต้องกรอง/นับ
เก็บไว้ที่ `_to_delete/` ตาม `temp-file-discipline`

---

## 7 · ทำให้เซสชันหน้าไม่ต้องสำรวจซ้ำ

โปรเจกต์ที่กลับมาทำบ่อย ควรมีแผนที่โปรเจกต์สั้น ๆ ที่ **โหลดอัตโนมัติ**

| ไฟล์ | โหลดเอง | เหมาะกับ |
|---|:--:|---|
| **`<project>/CLAUDE.md`** | ✅ | แผนที่โปรเจกต์ · คำสั่งที่ใช้บ่อย · กฎเฉพาะโปรเจกต์ |
| `<project>/<โฟลเดอร์ใหญ่>/CLAUDE.md` | ✅ เมื่อทำงานในโฟลเดอร์นั้น | โมดูลที่ซับซ้อนเป็นพิเศษ |
| `context.md` · `notes.md` ชื่ออื่น | ❌ | **ต้องสั่งให้อ่านทุกครั้ง จึงเสียเปล่า** |

> 🚨 **อย่าตั้งชื่อไฟล์แผนที่เป็นอย่างอื่น** เพราะ `CLAUDE.md` ถูกอ่านให้อัตโนมัติ
> ส่วนไฟล์ชื่ออื่นต้องมีคนสั่งให้อ่าน เท่ากับจ่าย token เพิ่มเพื่ออ่านสิ่งที่ควรได้ฟรี

**สิ่งที่ควรอยู่ในแผนที่ของโปรเจกต์** สั้น ๆ ไม่เกิน 40 บรรทัด:

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

**ไม่ควรมี**: เนื้อหาที่อ่านจากโค้ดได้อยู่แล้ว · รายการไฟล์ทั้งหมด · ประวัติการเปลี่ยนแปลง
แผนที่ล้าสมัยแย่กว่าไม่มีแผนที่ เพราะมันพาไปผิดที่อย่างมั่นใจ

---

## 8 · ค่าตั้งที่ช่วยได้อีก

| ทำอะไร | ได้อะไร |
|---|---|
| **ปิด MCP server ที่ไม่ได้ใช้ในโปรเจกต์นั้น** | schema ของทุก tool โหลดทุกเซสชัน จึงตัดได้หลักพัน token |
| ปิดปลั๊กอินที่ไม่เกี่ยวกับงานนั้น | description ของ skill ทุกตัวอยู่ใน context เสมอ |
| `permissions.deny` ใน `.claude/settings.json` สำหรับโฟลเดอร์ที่ไม่ควรอ่าน | ระบบกันพลาดให้ ไม่ต้องพึ่งวินัย |
| `/clear` เมื่อเปลี่ยนเรื่อง · `/compact` เมื่อใกล้เต็ม | คืนที่ว่าง |
| `CLAUDE.md` ยาวไม่เกิน 40 บรรทัด | ทุกบรรทัดกิน token ทุกเซสชัน |

---

## 9 · Anti-patterns

- ❌ **`cat` ไฟล์ใหญ่เพื่อ "ดูก่อนว่ามีอะไร"** ทั้งที่ `head -40` ตอบคำถามเดียวกันได้ด้วยต้นทุน 1%
- ❌ **`rg` โดยไม่ใส่ `--glob`** ได้ `node_modules` มาเต็ม
- ❌ **อ่าน 10 ไฟล์เองเพื่อตอบคำถามเดียว** ทั้งที่ควรส่ง subagent
- ❌ **สั่ง subagent แบบไม่บอกว่าต้องการอะไรกลับมา** ได้รายงานยาวกลับมา ไม่ได้ประหยัด
- ❌ **รัน test แล้วปล่อย output เข้า context ทั้งก้อน**
- ❌ **อ่านไฟล์เดิมซ้ำเพราะลืมว่าเคยอ่านแล้ว** ให้จดสิ่งที่พบลงไฟล์ตั้งแต่รอบแรก
- ❌ **`context.md` หรือชื่ออื่นที่ไม่ได้โหลดอัตโนมัติ** ให้ใช้ `CLAUDE.md`
- ❌ **`CLAUDE.md` ยาว 300 บรรทัด** ทุกคนในทีมต้องจ่าย token ทุกเซสชัน
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
