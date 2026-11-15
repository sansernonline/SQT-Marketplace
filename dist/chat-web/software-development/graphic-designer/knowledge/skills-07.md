# skill: software-diagrams

Use when a README or PR needs a quick Mermaid diagram

# Software Diagrams

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** ไดอะแกรมตอบ**คำถามเดียว**
> ถ้าตอบ 2 คำถาม ให้วาด 2 รูป

> **ปลายทางตัดสินเครื่องมือ:** skill นี้วาดไดอะแกรมด่วนด้วย Mermaid ธีมประจำบ้าน สำหรับ README · Pull Request · โน้ตในโค้ดเท่านั้น
> ส่วนรูปในเอกสารโปรเจกต์ (BRD · SRS · FSD · ADR · ER · ผังขั้นตอน) ข้อเสนอลูกค้า สไลด์ และงานพิมพ์ ให้ไปที่ `diagram-figures` · ตารางเลือกทางฉบับเต็มอยู่ที่หัว skill นั้น
>
> **สีในรูปต้องสื่อความหมาย ไม่ใช่ตกแต่ง** และถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้น ไม่ต้องเลือกสีใหม่รายรูป (ค่าเริ่มต้นคือชุดประจำบ้านใน `polished-document-style` · ความหมายของสีดู `branded-document-design/references/tokens-and-type.md`):
> ไดอะแกรมด่วนใช้ **สีหลักสีเดียว** = "ของที่เรากำลังพูดถึง" · เทา = ระบบภายนอก/ปิดอยู่ · ขาวเส้นเทา (`store`) = ที่เก็บข้อมูล · กล่องอื่นใช้ค่าตั้งต้น (3 คลาส `focus` · `ext` · `store` ใน `assets/mermaid-theme.md`) · ถ้าต้องแยกจุดพัง/ข้อยกเว้น/สำเร็จด้วยสีหลายสี แปลว่าตอบหลายคำถามในรูปเดียว ให้แยกเป็นรูปใหม่หรือใช้ `diagram-figures`

## เมื่อไหร่ใช้ skill นี้

ใน README · Pull Request · โน้ตในโค้ด:

- อธิบายสถาปัตยกรรมระบบ
- อธิบายลำดับการทำงานข้ามหลายส่วน
- อธิบายสถานะของข้อมูล
- ออกแบบฐานข้อมูล
- บอกว่าอะไรรันอยู่บนเครื่องไหน
- รีวิวไดอะแกรมที่คนอื่นวาด

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เลือกว่าจะใช้ภาพแบบไหน (SVG / ASCII / Mermaid) | `markdown-visuals` |
| ภาพหน้าจอ · wireframe | `ui-craft` + skill แพลตฟอร์ม |
| กราฟข้อมูล | `web-app-design` → `references/tokens.md` หัวข้อ "สีข้อมูล (กราฟ)" |
| ตัดสินใจเลือกสถาปัตยกรรม | `architecture-patterns` |

## 1 · คำถามไหน วาดแบบไหน

**เริ่มจากคำถาม ไม่ใช่เริ่มจากชนิดไดอะแกรม** — คนวาดผิดเพราะเลือกชนิดก่อนแล้วค่อยยัดเนื้อหาลงไป

| คำถามที่ผู้อ่านมีในหัว | ไดอะแกรม |
|---|---|
| "ระบบนี้คุยกับใครข้างนอกบ้าง" | C4 ระดับ 1 — System Context |
| "ข้างในระบบมีอะไรบ้าง รันแยกกันไหม" | C4 ระดับ 2 — Container |
| "ใน service ตัวนี้แบ่งเป็นส่วนอะไร" | C4 ระดับ 3 — Component |
| "กดปุ่มนี้แล้วเกิดอะไรขึ้นบ้าง ตามลำดับ" | Sequence |
| "เอกสารนี้เปลี่ยนสถานะยังไงได้บ้าง" | State |
| "ตารางไหนเชื่อมกับตารางไหน" | Entity Relationship (ER) |
| "ของจริงรันอยู่บนเครื่องอะไร กี่ตัว" | Deployment |
| "ใครอนุมัติต่อจากใคร" | Flowchart (ขั้นตอนงาน) |
| "ผังคลาวด์ใน repo ที่มีโลโก้ AWS / Azure จริง ๆ" | Infrastructure — ข้อ 3 |
| "อยากได้รูปสวย ๆ ไว้ใส่ข้อเสนอลูกค้า" | ไม่ใช่งานของ skill นี้ — `diagram-figures` |

> **C4 model** คือวิธีวาดสถาปัตยกรรมเป็นชั้น ๆ เหมือนซูมแผนที่ —
> ระดับ 1 มองจากนอกระบบ · ระดับ 2 เปิดฝาดูข้างใน · ระดับ 3 ซูมเข้าไปในกล่องเดียว
> **วาดระดับ 1 กับ 2 ให้ครบก่อนเสมอ** ระดับ 3 วาดเฉพาะส่วนที่ซับซ้อนจริง

## 2 · ธีม — ใช้ชุดเดียวทั้งโปรเจกต์

วางบรรทัด `%%{init: ...}%%` ไว้**บรรทัดแรกสุด**ของทุกไดอะแกรม แล้วใช้สีหลักสีเดียวกับ 3 คลาส `focus` · `ext` · `store` ซึ่งสีหลักสงวนไว้ให้ "ของที่เรากำลังพูดถึง" เท่านั้น
บรรทัดธีม ตัวแทนค่าสี คลาส และตัวอย่างที่เรนเดอร์แล้วอยู่ใน [`assets/mermaid-theme.md`](assets/mermaid-theme.md) ส่วนตารางที่จับคู่เนื้องานกับโทนสีอยู่ใน `diagram-figures/references/colour-by-domain.md`

> ระวัง: **`fontFamily` ต้องอยู่นอก `themeVariables`** ถ้าใส่ไว้ข้างใน จะถูกเมินเงียบ ๆ แล้วกลับไปใช้ฟอนต์เริ่มต้นของ Mermaid

**ตรวจด้วยเครื่องก่อนส่งทุกครั้ง** — กฎข้อนี้ถูกลืมบ่อยที่สุด (โปรเจกต์ทดสอบหนึ่งมี 63 จาก 66 รูปที่ไม่มีบรรทัดธีม และไม่มีใครเห็น):

สคริปต์อยู่ในโฟลเดอร์ `scripts/` ของ skill นี้ — รันด้วย path เต็มของสคริปต์ กับโฟลเดอร์ `docs` ของโปรเจกต์ที่ตรวจ (`<path ของ skill>` = โฟลเดอร์ที่ติดตั้ง skill นี้):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 พร้อม ไฟล์:บรรทัด ของบล็อกที่ไม่มี %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # พิสูจน์ว่าตัวตรวจยังจับได้
```

agent ที่ไม่มี shell รันเองไม่ได้ → agent หลักรันหลังรับงาน

## 3 · ผังที่ต้องมีโลโก้จริง (infrastructure)

ถ้าผังโครงสร้างพื้นฐานที่อยู่ใน repo ต้องมีไอคอน Amazon Web Services (AWS) · Azure · Kubernetes ของจริง ซึ่ง Mermaid วาดให้ไม่ได้ ให้ใช้ไลบรารี **`diagrams`** (Python + Graphviz) โดยเริ่มจาก [`assets/infra-diagram.py`](assets/infra-diagram.py)
วิธีติดตั้ง กติกา node ที่ใช้บ่อย และกับดักอยู่ใน [`assets/diagrams-python.md`](assets/diagrams-python.md) · ส่วนผังคลาวด์ที่ลูกค้าหรือสไลด์จะเห็น ให้ใช้ `diagram-figures`

## 4 · กฎที่ทำให้อ่านรู้เรื่อง

**ไม่เกิน 7 กล่อง** — เกินนี้คนอ่านเลิกอ่าน (นับกล่องจริง ไม่นับ subgraph)

**นับกล่องก่อนวาด ไม่ใช่หลังวาด** — ถ้าเกิน 7 ให้**แยกรูปตามลำดับเรื่องก่อนวาด** จดการแยกลง `decision-log` แล้วบอกในคำตอบ
ห้ามวาดจนครบแล้วค่อยบอกทีหลัง

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
อยากแบ่งแบบอื่น บอกได้ — แยกใหม่ได้
```

> **"แยกคนละไฟล์ก็ได้" แปลว่าต้องแยก** — ถ้าคำขอเปิดช่องให้แยก และเนื้อหาเกินเพดาน
> ให้ถือว่าเป็นคำสั่งให้แยก ไม่ใช่ทางเลือก

**3 อย่างนี้ห้ามอยู่ในไดอะแกรม** — เป็นเนื้อหาของคู่มือ ไม่ใช่รูป และทำให้กล่องบานจนผังเบี้ยว

| ห้ามใส่ | ไปอยู่ที่ไหน |
|---|---|
| ตัวเลือกบรรทัดคำสั่ง `--all` `--resume` `--limit N` | `README` หรือ `docs/cli.md` |
| รายการ input/output ของหลายตัว | **ตารางข้างรูป** — คอลัมน์: ส่วนประกอบ · รับอะไร · ให้อะไร · เก็บที่ไหน |
| ชื่อไฟล์หรือ path ครบทุกตัว | ตารางเดียวกัน ใส่ในรูปเฉพาะตัวที่เป็นใจความ |

**คำขอว่า "บอก input/output ด้วย" ไม่ได้แปลว่าให้วาดทุกอย่างเป็นกล่อง** —
กล่องคือสิ่งที่ *ทำงาน* สิ่งที่ *ไหลผ่าน* เป็นป้ายบนเส้น ส่วน *รายละเอียด* ไปอยู่ในตาราง

**ระดับรายละเอียดเดียวกันทั้งรูป** — มี `PostgreSQL` กับ `OrderRepository.cs` อยู่ในรูปเดียวกัน
คือสัญญาณว่าผสม 2 ระดับ

**ทุกเส้นต้องมีป้าย** และป้ายต้องบอก**อะไรไหลผ่าน** ไม่ใช่ว่าต่อกันอยู่

```
ผิด: api --> db
ผิด: api -->|ใช้| db
ถูก: api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**ทิศทางเดียว** — บนลงล่าง (`TB`) หรือซ้ายไปขวา (`LR`) เลือกแล้วอย่าให้มีเส้นวิ่งย้อน
เส้นย้อนแปลว่าเรียงลำดับกล่องผิด ไม่ใช่ว่าต้องวาดลูกศร 2 หัว

**ชื่อกล่อง = สิ่งที่มันทำ ไม่ใช่เทคโนโลยี** เทคโนโลยีใส่บรรทัดที่สองตัวเล็ก

```
ผิด: [Redis]
ถูก: ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**มีคำอธิบายสัญลักษณ์ (legend) เมื่อใช้สีหรือรูปทรงสื่อความหมาย** —
ถ้าอธิบายไม่ได้ว่าทำไมกล่องนี้สีต่าง แปลว่าสีนั้นไม่ควรมี

## 5 · ภาษาไทยในไดอะแกรม

- **ป้ายเส้นภาษาไทยยาวเกิน 3 คำจะทับเส้น** — ตัดให้สั้น หรือใส่ `<br>` เอง
- **ห้ามใช้ `()` `[]` `{}` ในข้อความ** จะไปชนกับไวยากรณ์ Mermaid — ครอบด้วย `"..."` เสมอ
- **วรรณยุกต์ลอยเหนือกล่อง** เมื่อ `fontSize` เล็กกว่า 12px — อย่าลดต่ำกว่านี้
- ชื่อตารางและชื่อฟิลด์ในไดอะแกรม ER ใช้ภาษาอังกฤษ (ตรงกับฐานข้อมูลจริง)
  ส่วนคำอธิบายใช้ไทยได้

## 6 · เรนเดอร์ดูจริง — ห้ามข้าม

ไดอะแกรมที่ไม่เคยเรนเดอร์ยังเป็นแค่ข้อความ ไม่ใช่รูป เพราะไวยากรณ์ผิดบางแบบ Mermaid ไม่แจ้ง error
และบ่อยครั้งวาดออกมาไม่ตรงกับที่คิด

```bash
# ไม่ติดตั้งลงเครื่อง · pin รุ่นที่ทดสอบธีมไว้ (11.17.0 · รุ่นล่าสุด 12.0.0 ณ 2026-10-14 ยังไม่ได้ทดสอบธีม)
npx -y @mermaid-js/mermaid-cli@11.17.0 -i diagram.mmd -o diagram.png -b white -s 2
```

แล้ว**เปิดไฟล์ภาพดูด้วยตา** ไล่ตามนี้:

- [ ] กล่องไม่เกิน 7 ใบใช่ไหม
- [ ] ทุกเส้นมีป้ายไหม และป้ายบอกว่าอะไรไหลผ่านไหม
- [ ] มีเส้นวิ่งย้อนทิศไหม
- [ ] ป้ายทับเส้นหรือทับกล่องไหม
- [ ] ข้อความไทยครบ ไม่มีสระหาย
- [ ] ระดับรายละเอียดเดียวกันทั้งรูป
- [ ] คนที่ไม่เคยเห็นระบบนี้อ่านแล้วตอบคำถามต้นทางได้ไหม

**ข้อจำกัดของ Mermaid ที่ต้องรู้ก่อนเสียเวลา:**

| อาการ | สาเหตุ |
|---|---|
| `direction LR` ใน subgraph ไม่ทำงาน | ถูกเมินเมื่อ subgraph มีเส้นเชื่อมออกนอก — ต้องจัดลำดับกล่องเอา |
| กล่องกว้างผิดปกติ | มีข้อความยาวบรรทัดเดียว — ใส่ `<br>` เอง Mermaid ไม่ตัดบรรทัดให้ |
| เส้นทับกันมั่ว | กล่องเยอะเกินไป — Mermaid ไม่มีการจัดเส้นแบบฉลาด ต้องลดกล่อง |
| ฟอนต์ไม่เปลี่ยน | `fontFamily` อยู่ผิดที่ (ดูข้อ 2) |

ถ้าจัดวางเองไม่ได้ดั่งใจจริง ๆ และรูปยังอยู่ในเอกสาร markdown ให้วาด inline SVG ตาม `markdown-visuals` · ส่วนถ้ารูปต้องดูออกแบบมา ให้ไปที่ `diagram-figures`

## 7 · Anti-patterns

- **ไดอะแกรมสถาปัตยกรรม 40 กล่อง** — ไม่มีใครอ่าน แยกเป็น C4 หลายระดับ
- **วาดจนเกินเพดานแล้วค่อยบอก** — ต้องแยกตั้งแต่นับได้ว่าเกิน
- **ยัดตัวเลือกบรรทัดคำสั่งลงในกล่อง** — กล่องบาน ตัวอักษรเล็ก อ่านไม่ออกทั้งรูป
- **เส้นไม่มีป้าย** — ผู้อ่านเดาเองว่าอะไรไหลผ่าน แล้วเดาผิด
- **ผสมระดับรายละเอียด** — `Kubernetes` อยู่ข้าง ๆ `UserService.validate()`
- **สีรุ้ง** — สีต้องมีความหมาย ไม่ใช่ใส่ให้ไม่น่าเบื่อ
- **วาดทุกกรณี error ใน sequence เดียว** — วาดทางหลักก่อน แล้วแยกรูปกรณีพิเศษ
- **ER ที่มีทุกตารางในระบบ** — แยกตามโดเมน
- **ไดอะแกรมที่ไม่มีวันที่และเจ้าของ** — ผ่านไป 1 ปีไม่มีใครกล้าแก้
- **ส่งไดอะแกรมโดยไม่เคยเรนเดอร์ดู**
- **ธีมต่างกันทุกรูปในเอกสารเดียว**

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกรูปแบบภาพในเอกสาร markdown | `markdown-visuals` |
| เอกสารรอบ ๆ ไดอะแกรม | `polished-document-style` |
| ฝังในไฟล์ Word / PowerPoint | `branded-document-design` |
| ไดอะแกรมในเอกสาร SRS | `srs-writing` |
| เลือกสถาปัตยกรรมก่อนวาด | `architecture-patterns` |
| รูปที่ต้องดูออกแบบมาหรือต้องเซ็นรับ | `diagram-figures` |
| บันทึกเหตุผลที่เลือกแบบนี้ | `adr-writer` |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


---

# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

Use on any work handed to people: code, documents, plans, designs, slides, tables and answers · `human-writing` controls **how it is written**, while this skill controls **what the work contains** · lives only in plugin `superuser`; other plugins share it through `dependencies`

## 1 · Main principles

- **The test:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone
- Do only what the task needs; do not provide for a future nobody has asked for
- Cut before adding · if removing a part loses neither meaning nor function, cut it
- Plain things people know beat clever things that need decoding
- **Simple is not sloppy** — never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly
- **Simple is not one big pile** — reduce the number of things, but keep clear separation of duties, 1 part doing 1 thing, as professional work does

## 2 · Ladder before starting — stop at the first step that works

1. Do we really need this · not needed → do not do it, and say in 1 line what you skipped
2. Is there an existing thing that works (file, template, function, tool, a feature that comes with the system) · yes → use the existing thing
3. Do the shortest version that is still complete and correct

## 3 · By kind of work

| Work | Do | Avoid |
|---|---|---|
| **Code** | Names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say "why" · follow the project's style | An abstraction with a single user · a clever shortcut that is hard to read · one big file doing everything · a pile-up `utils/` folder · a new dependency for a few lines of work |
| **Documents · reports** | Conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for data that is compared | Repeating what was already said · headings with no content · terms the reader does not know |
| **Plans · procedures** | 3–5 key items · every item has an owner and a way to measure done · the fewest steps that work | A list of 20 items with no priority · steps kept "just in case" |
| **Designs · slides · figures** | 1 page 1 point · the shortest path to the user's goal · use patterns people are familiar with | Cramming data until people must squint · decoration that does not help understanding |
| **Tables · data** | Only the columns used to decide · short formulas you can follow | Columns that repeat a meaning · long nested formulas in one line |
| **Answers** | Answer first · as long as the question needs | An explanation longer than the work itself |

Plugin `software-development` has more detail on code and architecture: `lazy-coding` (write less) · `readable-code` (names, function shape, file structure) · `simplicity-first` (documents, plans, architecture) · if installed, open them together

## 4 · Say that you made it simple on purpose

A deliberate shortcut should be written down with how far it works and when it changes, so it does not look forgotten, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` (gloss: simple: kept in memory — move to Redis when running more than 1 process) · in the report put 1 line `ข้าม: X — เพิ่มเมื่อ Y` (skipped: X — add when Y)

## 5 · 5-point check before sending

1. Can an outsider open it for the first time and understand within 30 seconds
2. Is there any part, step or layer that can be cut with no loss? If so, cut it
3. Does every part added have a reason it is needed now, not "just in case"
4. Is it still complete on correctness, safety, and what the user asked for
5. Are duties still clearly separated, and not several things squashed into one place to look short


---

# skill: no-ai-look

Use when making visuals so they do not look AI-made

# no-ai-look — work that looks designed by a person, not by AI

> **One rule:** every choice (color, font, layout, image, word) must be answerable as "chosen because of this project", not "because it is the default."
> The defaults of models and frameworks are the average of everyone's work, so work that uses the average all looks the same, and viewers recognize at once that AI made it.

**Last line of every answer that makes or reviews a visual piece, including a quick "is it OK to send?" check:** the `no-ai-look:` log line from section 3.3, filled with the real counts (eye check `ด่านตา n/9`, web pages add `(หน้าเว็บ n/14)`) · items you could not check count as not passed, so the line reads below 9/9 · A script result of 0 alone never makes the line pass, because the script reads only values in the code · Script not run (no shell in this session) → write `สคริปต์ ไม่ได้รัน` in its slot · When the `ด่านก่อนลงมือ:` line of `design-references` is also due, it goes right above this one

Lives only in plugin `superuser`; other plugins share it through `dependencies` · the full list for every medium with sources → [`references/catalog.md`](references/catalog.md)

## Use together with

This skill controls only "does it look like AI". Spacing, color, fonts and components still belong to that job's skill, such as `ui-craft` with the platform skills · `presentation-design` · `graphic-design` · `brand-kit` · `brief-to-image` · `image-generation` (plugin `graphic-design`). Words in the work use `human-writing`.

**A look the project has already approved always wins** (brand kit · a diagram's house style · a theme already delivered). If what is approved matches a ban here, keep it and note that it is intentional (item 3).

---

## 1 · Before starting — decide 5 things and write them down

Do this before drawing the first piece. Write them where the project already keeps its look (`docs/README.md` field `doc-theme` · app tokens · brand kit); do not create a new file if a place already exists.

1. **What the work is for** — choose 1: persuade (sales page · post) · use (app · dashboard) · read (document · article) · experience (game · showpiece). The layout comes from this item, not from a ready-made structure. Sketch 2–3 really different layouts in ASCII, then choose the one that fits this content and these users, with a 1-line reason; do not use the first one that comes to mind, because the first is usually the default (idea from anthropics/skills `frontend-design` section Process · Apache-2.0 · source code AN in `catalog`).
2. **1 main color** tied to this business, then derive the neutrals from it. Never use a color that frameworks and tutorials use often as the brand color (Tailwind's indigo-500 `#6366f1` · shadcn/ui's default dark gray button).
3. **2 fonts** — 1 heading font with personality + 1 body font that reads easily. Write the reason for each in 1 line. Thai work needs a family with full Thai coverage.
4. **A real source of inspiration** — the product's own world (materials · shop signs · documents of the field) or a named style (Swiss · risograph · 1960s travel posters). Never order with floating adjectives ("พรีเมียม" "ทันสมัย" "สดใส"), because you get the average of that category. **Search references first:** take the project's words and search live per `design-references` (plugin `superuser`) with the type that fits the work, then extract colors from the chosen work. The stored color library is used when live search is impossible.
5. **Real content** — names, numbers, dates, real screenshots, real people or clients. If you do not have it, put `(รอยืนยัน)` (awaiting confirmation); never invent it.

**Test:** take the logo off; could this work still be used by a competitor? If yes, it is still too average; add what only this project has.

---

## 2 · The most common signals — never use them as the default

Each item is allowed if there is a reason from the project (item 3). Fixes and sources for every item are in the catalog.

| Group | Signal | Use instead |
|---|---|---|
| Color | Purple-blue-cyan gradient · gradient text · neon on dark · a circular glow behind the content · cream background because it "looks tasteful" · the cream + terracotta + serif set that shows up on every "warm" job | 1 solid brand color · emphasis by size or weight |
| Surface | Frosted glass across the page · decorative grid or stripes · thin line + wide shadow on one box | Plain background · pick either line or shadow |
| Cards | A thick colored bar on the side of a rounded card · cards inside cards · corner radius so big it becomes a blob · a grid of 3–6 identical-looking cards | Spacing and type · group by importance |
| Headings | A small badge above the heading ("Introducing") · an icon in a rounded tile above the heading · numbers 01/02/03 with no real sequence · giant italic serif · Inter/Geist on every job | Put the useful words in the heading itself · fonts per item 1 |
| Page structure | Centered hero → 3 cards → customer logos → pricing → FAQ on every page · opening section → feature list → how it works 1–6 → install button · giant number + small label in 3 boxes · every slide is a title + 3–4 bullets | Structure from the page's goal · change the layout with the content |
| Icons | Emoji in place of icons or in headings · one thin-line icon set at size 16 everywhere · icons bigger than the content | One deliberately chosen SVG icon set · real screenshots or charts instead of icons |
| Motion | fade-up on every piece · a dot that blinks nonstop · a blinking cursor in still text · self-scrolling elements · bouncy easing · an image that zooms on hover | Move only what has meaning, 150–300 ms ease-out, using transform/opacity |
| AI images | Plastic-smooth skin · golden or dramatic light in every scene · teal-orange tone · an unnaturally clean scene · average-looking people · hands, teeth, text that are off · clay 3D or glossy isometric | One light source with a reason · signs of use · specify style and color in the prompt · edit, never use the first image you get |
| Logos | A gradient circle with a hole in the middle · circuit patterns · infinity · swoosh curves · melting letters · details lost at 16 px | A shape from something specific to the brand · deliver as vector · test at favicon size |
| Documents | Emoji before headings · every bullet starts in bold · Title Case on every heading · every section a list · 4 levels of headings in a short note · ending every section with a summary · default-looking Mermaid | Short prose · only the headings needed · diagrams in the house style |
| Words | Broad ad words (supercharge · ยกระดับ · ไร้รอยต่อ) · the slogan "ไม่ใช่แค่ X แต่คือ Y" · sets of 3 everywhere · frequent long dashes · canned opening sentences ("ในยุคดิจิทัลที่…") | Follow `human-writing` · say what the user can do, with numbers · check Thai with `thai-grammar`, not English rules (full stops, dashes, word breaks differ) |

**Do not fix it by swapping one default for another** — dropping purple for cream + terracotta + serif (or + olive green) is still a formula. This set is "the default of someone who knows purple is the default". A bento grid and mesh-style gradient backgrounds are not signals in themselves; do not hunt to cut everything that looks modern.

---

## 3 · Check before sending

### 3.1 HTML/CSS work (mockup · web page · HTML deck · HTML document cover)

```bash
python <path ของ skill นี้>/scripts/slop_scan.py <ไฟล์หรือโฟลเดอร์>          # ตาราง
python <path ของ skill นี้>/scripts/slop_scan.py <path> --min P2 --json       # เฉพาะข้อหนัก
python <path ของ skill นี้>/scripts/slop_scan.py --url https://...           # หน้าที่ขึ้นเว็บแล้ว + stylesheet ที่หน้า <link> ไว้ (ไม่รัน JavaScript) · path ไฟล์ในเครื่องหรือ file:///... ก็ได้
python <path ของ skill นี้>/scripts/slop_scan.py --self-test                  # รันก่อน ถ้าแก้สคริปต์
```

- **The `ui-scan` hook of plugin `superuser` runs this script by itself every time a UI file is Written/Edited** (`.html` `.css` `.scss` `.less` `.jsx` `.tsx` `.vue` `.svelte` `.astro`, including files in `_to_delete/` · it skips `node_modules` `dist` `build` `.claude` `vendor` and `.min.` files). P0/P1 are sent back to be fixed at once · P2 is passed as context · an unchanged result is not warned again · turn it off with `"ui_scan": false` in `.claude/superuser/config.json`. The hook checks one file at a time; before sending, still run the whole folder once.
- A page drawn entirely by JavaScript (SPA): `--url` sees only the skeleton → check the source code, or save the page from the browser as .html and check that file.

- Checks 43 rules from the code (colors, cards, type, motion, words, broken images, inputs with no label, contrast of Tailwind classes) · nothing extra to install
- Levels: P0 unusable · P1 hard to read · P2 clear AI signal · P3 look again (may be intentional) · any P0 or P1 → exit 1
- **Fix P0 and P1 first**, then P2. For things that are intentional, write `/* slop-ok: <rule> <reason> */` or `<!-- slop-ok: <rule> <reason> -->` in that file; the reason shows up in the report for the reviewer.
- Checking 0 files = wrong, not a pass (the script exits 2)
- A script result is a reason to look again, not an order to fix every item. The script does not see images; the items in 3.2 must always pass the eye gate.
- **0 script items does not mean pass:** the script catches only defaults readable from code, and work whose whole page is the category average is invisible to it (a landing page really tried 2026-11-06 got 0 items but still looked AI-made). Work can be sent when it passes both the script and the eye gate 3.2.

### 3.2 Eye gate (every medium, including images, PPTX slides, posters, Word documents)

Render to an image at real size and answer item by item, yes or no. Count pass or fail by the criterion written in that item (in some items "yes" means fail). An item with several questions must pass every question to count as 1. For any item that fails, fix it, or note the reason it is kept on purpose under `## ตัดสินใจเอง` (decided on my own).

1. **With the logo and product name covered, can you still tell whose it is?** — if not = fail · extra test: replace the product name with one competitor's name; if every sentence and image is still true = fail
2. **Squint** — is there one dominant element, or does everything demand attention at once?
3. **Count the signals in item 2** — 3 or more in one piece = looks AI-made
4. **Real content** — are there names, numbers, real images, or only generic words and stock photos?
5. **One set** — every slide, every post uses one system, but the layout does not repeat on every page. A single piece (a 1-image post · a single cover) answers `ไม่ใช้` (not applicable) and counts this item as passed.
6. **AI images** — look at hands, teeth, text, shadows, light, real-world scale; zoom to 200% before use
7. **Blank space** — is there room for the important things to breathe, not packed edge to edge?
8. **Words** — read the headings aloud; do they sound like a person telling a friend, or like a slogan on a sign? (a slogan = fail · `human-writing` item 8) · does a heading break a line in the middle of a phrase? (web pages: look at width 375; slides, posts, covers: look at the piece's real size) (such as "ทำงานเป็น / ทีม"); if it breaks = fail, set the break yourself with `<wbr>` or `text-wrap: balance` · a heading whose wording the user set themselves: use it as given, and note it as kept on purpose · **Large Thai type:** zoom in on upper vowels and tone marks (ที่ · ทั้ง · ปี่) to see that they do not collide with or overlap the line above, and that lower vowels (ุ · ู) do not overlap the line below · a collision = fail; increase the line spacing per the table in `human-writing` [`thai-line-breaking`](../human-writing/references/thai-line-breaking.md) (Thai headings no lower than 1.4) · real incident 2026-11-06: a post with tight heading line-height, where the tone marks of the lower line hit the upper line, but the maker reported that Thai type did not break
9. **Cut 1 piece before sending** — find something that can be removed without the work losing anything (a shadow · a border line · a decorative icon · a label above a heading · motion · a gradient · a summary paragraph) and really remove it · send only if you find nothing · do not cut shadows, rounded corners, the hero image, or icons that the depth language of the look or the owner's chosen style requires, because cutting until it is flat is the mistake on the other side (user asked for rounded corners, shadows and icons back 2026-11-09) · AI work almost always has at least 1 extra piece, because models add more than they cut (idea from Anthropic's frontend-design · Apache-2.0)

**Web pages, marketing landing pages and a product's home page answer 5 more items** (posts, banners, covers and single images use only items 1–9) (opening section = the first screen seen before scrolling, or the hero):

10. **Does the opening section have at least 1 real thing from the product?** A screenshot of real use · real numbers with a source · a named real customer's voice · real work done · none = fail · at width 1440, does the opening section have unintended blank space over 1/3 of the screen? If yes = fail (that blank space is the place for the real thing)
11. **Is the order of sections built on this product's story, not the formula opening → feature list → how it works → install button or pricing?** If not = fail. Write 1 sentence on how this product's story should be told (start from the problem the user meets · start from a demo of the real thing · start from customer results) and order the sections by that sentence · you may keep the usual formula when that sentence really leads to the same order, and you must note it.
12. **Does a row of equal cells (3–6 cells of identical size and look) have a reason from the content?** The reason is that each cell is really equally important and about equally long. No reason = fail; make the more important cell bigger, or change to a list, prose or a single image. A small sequence number on a cell heading is allowed only when the steps must really be followed in order.
13. **Does the page's color have a source other than the logo or icon?** Sources that count: a reference searched this round (`design-references`) · the product's materials or world · an approved brand. Pulled from the icon alone = fail.
14. **Is every mono font spot on code, commands, file names, or numbers that must line up in columns?** Mono on brand names, menus, table headers or captions, to make it "look like a developer's", is costume = fail

**Someone who did not make it must check by eye, on every job before sending** — the maker cannot see their own defaults (2026-11-06: the maker reported Thai type did not break, but another person opened the image and saw the tone marks hit the line above).
- Send the **rendered image at real size** (not code) to a fresh subagent who did not take part: `design-critic` (graphic-design), or `reviewer` if there is none · send 3.2 with the job's brief, never the maker's answer or opinion, because reviewers tend to go along
- Ask for 2 things: the item-by-item answers of 3.2 · 3 places that look AI-made with how to fix them; no praise
- For an item where reviewer and maker disagree, use the reviewer's answer, then fix it or note the reason it is kept · after fixing, send the new image to a new reviewer to look only at the items fixed
- If the maker is a subagent that cannot call other agents, send the image path back to the lead to call the reviewer, and write `รอหัวหน้า` (waiting for the lead) in the eye-check field
- Skippable only for the reference board page (not yet our work) and work the owner ordered skipped · the 3 directions sent to the owner to pick at the end must pass the check before sending · if skipped, the result line says `ตรวจตา ข้าม เพราะ…` (eye check skipped because…)

### 3.3 Record the result

1 line at the end of the answer or report: `no-ai-look: สคริปต์ P0 0 · P1 0 · P2 n (ตั้งใจ n) · ด่านตา 9/9 (หน้าเว็บ 14/14) · ตรวจตา <agent ที่ตรวจ> ไม่ตรงกับคนทำ n ข้อ · ตัดออก: <ชิ้นที่ตัด>` · an incomplete eye gate, or answers by the maker alone = not yet passed, even with 0 script items · items kept on purpose go under `## ตัดสินใจเอง` with the reason · new builds must have the `design-references` line `ด่านก่อนลงมือ:` alongside, all 7 fields per `design-references` gate item 6, because checking only at the end cannot catch work that did not search first

---

## 4 · Writing a brief for an image tool, or a task sheet for a subagent

Put these in every time, otherwise you get the average:

- A named style + 1–3 real reference images (not adjectives)
- The brand's hex colors · light source and time · lens or camera angle
- Details observed from the real thing (place, signs of use, season, what kind of people)
- What you do not want: teal-orange tone · plastic-smooth skin · golden light in every scene · text in the image (put text as a separate editable layer)
- Once you get an image you must **edit** it: crop, retouch, adjust the light; never use the first image that comes out

---

Rules for writing abbreviations → `spell-out-abbreviations`


## reference: catalog.md

# catalog — signals that make work look AI-made (full version)

Extension of `no-ai-look`. Open it when the script reports an unfamiliar rule, or when you must check media the script cannot see.
The "Rule" column is the name in `scripts/slop_scan.py` (empty = checked by the eye gate, item 3.2). The "Source" column uses the codes in section 9. Only items with at least 2 sources are kept, except those marked (1 source).

## Contents

1. [Colors and surfaces](#1--colors-and-surfaces)
2. [Cards, boxes and page structure](#2--cards-boxes-and-page-structure)
3. [Type and headings](#3--type-and-headings)
4. [Motion](#4--motion)
5. [Words on screens, slides and ads](#5--words-on-screens-slides-and-ads)
6. [AI images, logos, posters, posts](#6--ai-images-logos-posters-posts)
7. [Slides, documents, diagrams](#7--slides-documents-diagrams)
8. [Basic quality (not AI, but really broken)](#8--basic-quality)
9. [Sources](#9--sources)

---

## 1 · Colors and surfaces

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Purple-blue-cyan or pink gradient | Default from tutorials and frameworks; nobody chose it | 1 brand color tied to the business | `ai-palette` | IM · CM · UN · VP |
| Buttons and links in indigo `#6366f1` | Tailwind's indigo-500, often used by tutorials and AI-generated code (shadcn/ui's default is near-black dark gray, not indigo — checked 22 Oct 2026) | Set your own color tokens | `framework-default` | CM · UN · SK · VP · 21 |
| Gradient text | Decorative emphasis that says nothing | Solid color + size or weight | `gradient-text` | IM · DC |
| Neon/glow shadows on dark backgrounds | The default "cyberpunk" recipe | Reduce glow so the data stands out | `neon-glow` | IM · DC |
| A circular glow behind the content | The most common AI backdrop | Spacing, contrast, clear headings | `radial-halo` | IM · DC |
| Cream/beige background + serif + olive green | "Good taste" that became the new recipe | Choose from the project's context | `cream-palette` | IM · UN · SK |
| Cream background (about `#F4F1EA`) + terracotta accent + high-contrast serif headings as the starting set | The "warm, tasteful" set the model grabs when the brief fixes no colors. Terracotta is close to Anthropic's own brand color, so client work gives it away easily | Colors from the business and the project's real materials · cream is fine when the brand or brief orders it | `cream-palette` in part (catches the cream background, not the terracotta) | AN (1 source · anthropics/skills `frontend-design` Apache-2.0 · checked 2026-10-23) |
| Tinted black (`#111` · `#0B0B0B`) instead of black on every job, with 1 warm accent color as the default | A template's decorating habit applied whatever the subject; looks deliberate but nobody chose it | True black, or a dark shade of a brand color with a reason from the job · note the reason beside the token | | AN (1 source · the template chrome section of `frontend-design` · checked 2026-10-23) |
| Frosted glass across the whole page | Decoration; does not solve a layering problem | Use only for things that really float over content | `glassmorphism` | IM · DC |
| Decorative grid or stripe pattern on the background | Fills empty space with lines | Plain background · grid only for canvas/maps | `grid-bg` `stripes` | IM (1 source) |
| The whole shadcn default set (slate gray · one corner radius across the app · `rounded-2xl shadow-lg p-6` · `max-w-7xl`) | The look of a framework, not a decision | Set tokens for color, corners, shadow, spacing before building | `framework-default` in part | CM · UN · SK · VP · CV |
| Both low contrast and gray on a colored background | Looks "clean" but cannot be read | ≥ 4.5:1 · use a dark shade of the background color | `low-contrast` | IM (1 source) |

## 2 · Cards, boxes and page structure

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| A thick colored bar on the side of a rounded card | Makes an ordinary card look like a warning | Remove it if it does not show status · a solid-color label | `side-tab` | IM · GD (item 7) |
| Cards inside cards | Too deep; little room left to work | Spacing, type, divider lines | `nested-cards` | IM (1 source) |
| A 1px line + wide shadow on one box | Defines the edge twice | Choose one | `hairline-shadow` | IM (1 source) |
| Corner radius too big for the box | Every card is the same blob | Reduce by box size | `huge-radius` | IM (1 source) |
| A grid of identical icon-heading-text cards | Every item has the same weight | Group · make the important item bigger | | IM · GD |
| Giant number + small label + 3-box stats | A sales-page template | Use numbers when they help explain, with context | | IM (1 source) |
| Fixed page structure: centered hero → 3 cards → customer logos → pricing → FAQ → 4-column footer | The order of a template, not of the page | Build from the page's goal and what the reader must do first | | CM · UN · VP · SK |
| Identical spacing everywhere | Cannot tell what is in the same group | Close within a group, far between groups | | IM (1 source) |
| Everything symmetric, everything centered | No point of intent | Asymmetry · 1 large cell · an off-center hero | | 21 · AN · GA |
| Settings content crammed in a modal | Not enough room | A separate page | | IM (1 source) |

## 3 · Type and headings

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Inter/Geist on every job | Makes different products look the same | A font by personality · keep it if it is the brand font | `overused-font` | IM · GD · AN |
| Switching to Space Grotesk on every job instead | The new default | A reason from the project | | UN · SK |
| Giant italic serif | A shortcut to "editorial" | A typeface by the product's personality | `italic-serif-display` | IM (1 source) |
| A small badge above the heading ("Introducing" · "New") | Adds a line that says nothing and looks clickable | Put that word in the heading, or cut it | `eyebrow-badge` | IM (1 source) |
| An icon in a rounded tile above a card heading | The AI feature-card pattern | An icon beside the heading, or remove the tile | `icon-tile` | IM (1 source) |
| Numbers 01/02/03 with no sequence | Clutter that says nothing | Use when there are real steps | `numbered-labels` | IM (1 source) |
| A long display-size heading eating the first screen | No room left to explain | Shorter or smaller | | IM (1 source) |
| Heading and body at close sizes | Cannot be scanned | Clear difference in size, weight, spacing | | IM (1 source) |
| Strongly squeezed letter spacing | Letters touch and are hard to read | Not below -0.03em | `crushed-tracking` | IM (1 source) |
| Emoji in headings or in place of icons | No icon system | One SVG set | `emoji-heading` | CM · UN · WW |
| One thin-line icon set (such as Lucide) at size 16 everywhere | Repeats across every product | Choose a set on purpose · use real screenshots/charts instead | | BL · 2S |

## 4 · Motion

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| fade-up and hover-scale on every piece | Move only what has meaning, 150–300 ms ease-out · a site that must feel alive uses 4 entrance styles in turn, not the same one everywhere (`dynamic-website` in software-development) | | UN · SK · BL |
| A status dot that blinks nonstop | Still · moves when the status changes | `pulsing-dot` | IM (1 source) |
| A blinking cursor in still text | Keep it in typeable fields | `blinking-cursor` | IM (1 source) |
| Text/logos that scroll by themselves | Still, or with a stop button | `marquee` | IM (1 source) |
| Bouncy or stretchy easing | Settle fast · bounce only where it fits the product | `bounce-easing` | IM · GD motion-basics |
| Animating width, spacing, or `transition: all` | transform/opacity | `layout-animation` | IM (1 source) |
| An image that zooms or rotates on hover | Still, unless it says it can be clicked | `hover-zoom-image` | IM (1 source) |
| Content hidden waiting for an animation, and if the script fails it never appears | Visible by default | | IM (1 source) |

## 5 · Words on screens, slides and ads

The main principles are in `human-writing` item 3. This table keeps only what shows up in design work.

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Broad ad words (supercharge · world-class · seamless · ยกระดับ · ไร้รอยต่อ · ล้ำสมัย) | Say what the user can do and how much better | `buzzword` | IM · WW · 2S |
| "Not a feature. A platform." · "ไม่ใช่แค่… แต่คือ…" | Explain directly | `forced-contrast` | IM · human-writing |
| A long dash in every sentence | English: split into sentences with a full stop · Thai: a space or a new paragraph, no full stop mid-paragraph (`thai-grammar` `f3` `t-dash`) | `em-dash-overuse` | IM · WW |
| Canned opening sentences ("In today's fast-paced world" · "ในยุคดิจิทัลที่…") | Open with what only this product can do | `stock-opener` | 2S · WW |
| Short fragments split by full stops ("Fast. Simple. Powerful.") · sets of 3 · feature names of 2 nouns | A full sentence that carries information | | SJ · CM · WW · OW |
| No names, numbers or dates · claims a competitor could also make | 1 claim only we have, with a number | | 21 · GA · CP |
| Fake proof: a team photo that is not the team · logos that are not clients · invented personas | Real people, real clients only | | 21 · WW · CP |
| Emoji lined up in a promo line | None, or 1 that means something | | WW · CM |
| "theater" used to wave things off | Say what does not work and why | `theater` | IM (1 source) |
| Overly formal words (utilize · facilitate) · stiff connectors (Moreover) · hedges ("It's important to note") | Ordinary words | `stock-opener` in part | WW · TS |
| Thai: wrong register · ครับ/ค่ะ/pronouns that do not fit the reader · literal-translation idioms · English word order · cutting words until curt | Read aloud · register from the table in `human-writing` `references/thai-grammar.md` section 4 · sentence structure per sections 1–2 of the same file · run `scripts/thai_tells.py` of `human-writing` | | 1S · `thai-grammar` |

## 6 · AI images, logos, posters, posts

| Signal | Use instead | Source |
|---|---|---|
| Smooth pore-free skin · every material glossy in the same way | Keep real texture and marks | KR · BK · MF |
| Saturated color, golden or dramatic light in every scene, even indoors | One light source with a reason, matching shadows | BK · GC · KR |
| Teal-orange tone (the shorter the prompt, the more it happens) | Specify the palette, or order it away | FL · 2S |
| Average-looking, perfect, stereotyped people | Details from observation: place, time, what kind of people | BK · KR · CP |
| A showroom-clean scene | Wrinkles, signs of use, ordinary light | MF · KR |
| Wrong physics: shadows not matching light, wrong reflections, bent lines, unrealistic scale | Check by eye before use | KR · MF |
| Hands, teeth, garbled text, crowds with repeated faces | Zoom to 200% to check · put text in a separate layer | KR · FL · MR |
| Using the first image you get without editing | Crop, edit, adjust (1 source, but matches the principle "edit, do not just accept") | CP |
| Clay 3D / isometric / glossy | A style that fits the brand · real photos | 2S · MF · doc-cover-design item 9 |
| Prompting with adjectives ("premium" · "vibrant") | A named style + reference image + hex | MR · VP · CP |
| A gradient circle logo with a hole in the middle · swoosh curves · infinity · circuit patterns | A shape from something specific (DeepSeek's whale · Midjourney's sailboat) | QW · BU |
| Letters that are almost letters, melting, off symmetry, details lost at small size, raster file only | Vector · test at favicon size · real lettering | BU · KR · MR |
| A poster packed edge to edge, no blank space, tiny paragraphs | 1 hero item · lots of white space · cut words so the key word can be big | MR · KR |
| Many fonts and many image styles in one frame (flat + realistic 3D + textured lettering) | 2–3 fonts, one visual language | MR · KR |
| Text embedded in the image | An editable text layer | KR · MR |
| A feed where each post has a different style | One brand system across every post | KR · PN · 2S |
| Floating glowing circles meaning "technology" · stock photos of handshakes · arrows shooting up | The real thing, or empty space | GD (item 7) (1 source) |

## 7 · Slides, documents, diagrams

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Every slide has one layout with 3–4 bullets of equal length | Change with the content · have some one-sentence pages | | 2S · GA |
| One title pattern across slides (equal length · Title Case · with a colon) | Title = the conclusion (`human-writing` item 6) | | 2S · TS |
| Line icons and middling images that fit any topic | Real photos, charts, screenshots | | 2S · GA |
| No real data, client details or brand | Put in real data, or `(รอยืนยัน)` | | GA · 21 |
| Every bullet starts in bold | Prose, or a plain list | `bold-first-bullets` | TF · TS |
| Emoji before headings · lots of bold · odd bullet symbols | Plain headings · bold in 2–3 places | `emoji-heading` | TS · WW · 2S |
| Over-formatting: lists everywhere, 4 levels of headings, tables in a short note | Merge sections, cut headings | | TS · UM |
| Ending every section with a summary or opinion | End when it has all been said | | TS · WW |
| References or components that do not exist (dead links · fake DOIs · services the system does not have) | Check every one against the source or code | | TS · IL |
| Default-looking Mermaid: self-placed, tangled arrows with no labels, several flows in one picture | The project's house style · a label on every arrow · 1 flow per picture | | YM · IL |
| Lorem text or "ตัวอย่าง" | Realistic content | `lorem` | IM · ui-craft |

## 8 · Basic quality

Not AI signals directly, but really broken, and the script checks them: an input with only a placeholder (`placeholder-label`) · an image with no src (`broken-image`) · a skipped heading level (`skipped-heading`) · text under 11 px (`tiny-text`) · body line spacing under 1.3 (`tight-leading`) · justified alignment (`justified`) · letter-spaced body text (`wide-body-tracking`) · an all-caps paragraph (`all-caps-body`) · a nearly opaque color over an image (`image-overlay`)
Check only from the rendered page (the script cannot see): text overlapped · overflowing its frame · a menu cut off · lines longer than 75 characters · the first column of uneven length · JavaScript errors on load

**Not signals** (the data does not support them; do not hunt to cut): bento grid · mesh/blob gradient backgrounds (UN)

---

## 9 · Sources

Searched Oct 2026

| Code | Source |
|---|---|
| IM | Impeccable — impeccable.style/slop (61 check rules on the web · 62 in the README as of 2026-10-23 · when this catalog was gathered there were 59 + 6 review items) |
| AN | Anthropic frontend-design skill — skills.sh/anthropics/claude-code/frontend-design · the Process section (draft several ASCII layouts, then compare with the brief) from github.com/anthropics/skills/tree/main/skills/frontend-design · Apache-2.0 · seen 2026-11-10 |
| CM | codemyspec.com/blog/vibe-coded-websites-look-the-same |
| UN | claudecodehq.com/playbooks/unslop-ui |
| SK | skills.cat/skills/funboy322/avoid-ai-design |
| VP | vp0.com/blogs/why-does-my-ai-app-look-generic |
| CV | enter.converge.ai/page/en-US/blog/ai-design-sameness |
| 21 | 21st.dev/blog/website-not-look-ai-generated |
| BL | blode.co/writing/you-dont-have-to-make-ai-slop |
| 2S | 2slides.com/blog/can-ai-make-slides-that-dont-look-ai-generated |
| GA | gamma.app/explore/content/guides/what-ai-makes-presentations-that-dont-look-ai-generated |
| CP | creativepool.com (an article on AI images that all look alike) |
| WW | writewithai.substack.com/p/10-dead-giveaways-your-content-screams |
| SJ | seojuice.com/tools/vibe-coded |
| OW | onlinewritingclub.com |
| TS | techspot.com/news/109186 (a summary of the Wikipedia page "Signs of AI writing") |
| TF | tropes.fyi/tropes/bold-first-bullets |
| UM | unmarkdown.com/blog/how-to-make-chatgpt-output-look-professional |
| IL | ilograph.com/blog/posts/diagrams-ai-can-and-cannot-generate |
| YM | yomotherboard.com/?p=585548 |
| KR | krumzi.com/blog/is-this-image-ai-generated |
| BK | ischool.berkeley.edu (Hany Farid on AI images) |
| MF | meltflexai.com/blog/why-ai-renders-look-fake |
| GC | getcoai.com |
| FL | datalab.flitto.com (orange-teal tone in AI images) |
| MR | mikareyes.com (how to spot and fix AI posters) |
| QW | qwe.edu.pl/tutorial/ai-company-logos-look-like-buttholes-2025 |
| BU | bushe.co/answers/how-to-detect-ai-generated-logos |
| PN | postnitro.ai blog |
| 1S | 1stopasia.com/blog/english-to-thai-ai-translation |
| GD | skill `graphic-design` of `software-development` item 7 (this set's original rules) |
