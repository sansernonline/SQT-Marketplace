# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อ 1:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎข้อ 2:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายจะได้ไม่ต้องเดา

## รูปแบบ

```
ถูก: Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
ผิด: MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็มแล้ววงเล็บตัวย่อ ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่มีที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

### เอกสารภาษาไทย

ครั้งแรกเขียน **ไทย (ชื่อเต็มอังกฤษ: ตัวย่อ)** เช่น ปัญญาประดิษฐ์ (Artificial Intelligence: AI) · ครั้งต่อไปใช้คำไทยหรือตัวย่อก็ได้ แต่ต้องเลือกแบบเดียวทั้งเอกสาร · กฎนี้เป็นที่เดียวที่กำหนดรูปแบบ `human-writing` `references/thai-grammar.md` หัวข้อ 5 แถว 4 ใช้ตามนี้

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) ถ้าไม่แน่ใจ **ให้ขยาย** เพราะขยายเกินไม่เสียหาย แต่คนอ่านไม่รู้เรื่องเสียหาย

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ขยายตัวย่อแล้วอาจยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
ผิด: ใช้ idempotency key กันงานซ้ำ
ถูก: ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

ผิด: ต้องดู cash flow ก่อนกู้
ถูก: ต้องดู cash flow (เงินเข้า-ออกจริงแต่ละเดือน) ก่อนกู้
```

**คำอธิบายต้องสั้นกว่า 1 บรรทัด** ถ้ายาวกว่านั้นให้แยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม ถ้าเดาไม่ได้ก็ต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมเดียวกันแต่คนละส่วนงาน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · สไลด์ · ป้ายและข้อความบนหน้าจอ · ข้อความขายของ · คำอธิบายไดอะแกรม · คอมเมนต์ในโค้ด ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Key Performance Indicator (KPI) · Service Level Agreement (SLA) ·
Return on Investment (ROI) · Stock Keeping Unit (SKU) · Value Added Tax (VAT) ·
Cash on Delivery (COD) · Objectives and Key Results (OKR) ·
Personally Identifiable Information (PII) · Proof of Concept (POC)

ตัวย่อฝั่งโค้ด (RBAC · SSO · CI/CD · SRS · ADR ฯลฯ) → ส่วนเพิ่มใน plugin `software-development` → `superuser` → `references/code-extensions.md`

## Anti-patterns

- ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่าค่านี้วัดอะไร
- อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค


---

# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer

This skill gives the shape and structure; every line of wording follows `human-writing` · lives only in plugin `superuser`; other plugins share it through `dependencies`

> **One rule:** whatever structure the content has, the answer uses that shape.
> Comparison → table · connections → figure · one thing → sentences

---

## Pick the shape from signals in the question

The quoted signals are Thai user phrasings; English meanings are in brackets.

| Signal | Shape |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" ("which is better" · "how do they differ" · "what options are there") | **Comparison table** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" ("what connects to what" · "how does data flow" · "what is the sequence") | **Figure** |
| "มีอะไรบ้าง" ("what are there") when the items are not compared | **Bullet list** |
| "ทำไม" · "แปลว่าอะไร" ("why" · "what does it mean") · one thing with no branches | **Plain sentences** |
| Several numbers that must be seen together | **Table** |
| Steps that must be done in order | **Numbered list** |
| Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

**The most important signal is having 2 or more "things being compared"**; use a table then,
because in a paragraph the reader must hold the first one in their head while reading the second.

---

## A table that reads easily

- **The first column is the thing being compared**, and the next columns are the aspects compared
- **3–5 columns**; more than that cannot be read in time, and at most 8 rows in a chat answer
- **Every cell must have content** — an empty cell means that column should not exist, or the data is incomplete; if there is no data, write "ไม่มี" (none) plainly · a table where every cell says "it depends" also has no content
- **At most 1 line per cell**; if longer, move it below the table
- **Order rows by weight**: the recommended one or the most used one on top, not alphabetical
- **Column headings are the questions in the reader's head**, not names of academic fields

```
ผิด: | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
ถูก: | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

(Gloss: wrong = "Option | Performance | Complexity" · right = "Option | How fast | Does it need much upkeep".)

**Always close a table with a 1-line conclusion** — a table gives data; it does not say what to choose

---

## When a figure beats a table

Use a figure when **the relationship is the answer** — a table can give properties, but cannot say what connects to what.

| Use a figure | Use a table |
|---|---|
| What connects to what · what sits inside what | Which is better than which, and in what respect |
| A sequence with forks or loops back | A straight sequence of steps with no branches (a numbered list is enough) |
| The same thing in several states | Different things on the same aspects |

In chat, **a small ASCII figure or a short Mermaid is enough** — no need to open a drawing tool

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

(Gloss: กล้อง = camera/scanner · รายงาน = report · ที่เก็บถาวร = permanent storage.)

A figure that must be a real file to go into a document or slides uses the figure-drawing skill of that plugin (if there is one)

---

## When sentences beat both

- The answer is shorter than 3 lines — a 2-row table is only decoration and explains nothing
- A question answered "yes" or "no" followed by 1 sentence of reason
- A matter where **the reason matters more than the options** — a table cuts the reason to fit the cell

> A table with one row or 2 short rows means the wrong shape was used · a figure that draws what one sentence can say is the same

---

## When you cannot continue

Whenever you are blocked → list only 2 things: **what is blocking** and **what you need from the user**

- 1 line per item · at most 4 items
- Do not tell the cause at length, do not answer side topics, do not plan the work ahead — wait until you have the thing, then do it
- If there are several paths for the user to choose → each path is 1 item, the easiest on top

```
ผิด: ย่อหน้ายาวเล่าว่า container ใหม่ · โฟลเดอร์ว่าง · OneDrive หาย · แล้ววางแผนแก้ 3 ข้อรอไว้
ถูก: ติดอยู่ 1 เรื่อง:
   - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
   ต้องการ 1 อย่าง:
   - แนบ Mockup.html มา หรือบอก path ใหม่
```

(Gloss: wrong = a long paragraph telling that the container is new · the folder is empty · OneDrive is gone · and then planning 3 fixes while waiting · right = "Blocked on 1 thing: cannot see the file — the linked folder is empty. Need 1 thing: attach Mockup.html or give the new path.")

---

## Abbreviations

Abbreviations used in this file · rules for writing abbreviations → `spell-out-abbreviations`

- **ASCII** — American Standard Code for Information Interchange (drawing figures with plain characters)
- **Mermaid** — a language that writes diagrams as text and lets a program draw them
- **DICOM** — Digital Imaging and Communications in Medicine (a standard for medical image files and transfer)
- **API** — Application Programming Interface (the channel through which one program calls another)
