# skill: simplify

Use when a deliverable has steps, layers or options nobody needs yet, or a newcomer must follow it. Not Claude Code /simplify.

# simplify — ทำให้ง่าย คนอ่านครั้งแรกก็ตามได้

ใช้กับทุกงานที่ส่งให้คน ทั้งโค้ด เอกสาร แผน ดีไซน์ สไลด์ ตาราง และคำตอบ · `human-writing` คุมว่า**เขียนอย่างไร** ส่วน skill นี้คุมว่า**ตัวงานมีอะไรบ้าง** · อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies`

## 1 · หลักใหญ่

- **บททดสอบ:** คนที่ไม่ได้อยู่ในงานนี้ เปิดดูอีก 6 เดือนข้างหน้า ต้องเข้าใจและแก้ต่อได้โดยไม่ต้องถามใคร
- ทำเท่าที่โจทย์ต้องการ ไม่เผื่ออนาคตที่ยังไม่มีใครขอ
- ตัดก่อนเพิ่ม · ถ้าตัดส่วนไหนออกแล้วความหมายหรือการทำงานไม่เสีย ให้ตัด
- ของธรรมดาที่คนรู้จักดีกว่าของฉลาดที่ต้องถอดรหัส
- **ง่ายไม่ใช่มักง่าย** — ห้ามตัดความถูกต้อง ความปลอดภัย การตรวจข้อมูลที่รับจากภายนอก การจัดการ error ที่กันข้อมูลหาย และสิ่งที่ผู้ใช้ขอไว้ชัด ๆ
- **ง่ายไม่ใช่กองรวม** — ลดจำนวนของ แต่ยังแยกหน้าที่ชัด 1 ส่วนทำ 1 เรื่อง เหมือนงานของมืออาชีพ

## 2 · บันไดก่อนลงมือ — หยุดที่ขั้นแรกที่ใช้ได้

1. ต้องมีสิ่งนี้จริงไหม · ไม่จำเป็น → ไม่ทำ แล้วบอก 1 บรรทัดว่าข้ามอะไร
2. มีของเดิมที่ใช้ได้แล้วไหม (ไฟล์ แม่แบบ ฟังก์ชัน เครื่องมือ ฟีเจอร์ที่ติดมากับระบบ) · มี → ใช้ของเดิม
3. ทำแบบสั้นที่สุดที่ยังครบและถูก

## 3 · ตามชนิดงาน

| งาน | ทำ | เลี่ยง |
|---|---|---|
| **โค้ด** | ชื่อบอกว่าคืออะไรและมีหน่วย · 1 ฟังก์ชันทำ 1 เรื่อง · คืนค่าออกเร็วแทนการซ้อน `if` · เยื้องไม่เกิน 3 ชั้น · คอมเมนต์บอก "ทำไม" · ตามสไตล์ของโปรเจกต์ | abstraction ที่มีตัวใช้ตัวเดียว · ทางลัดที่ฉลาดแต่อ่านยาก · ไฟล์ก้อนเดียวทำทุกอย่าง · โฟลเดอร์ `utils/` กองรวม · dependency ใหม่เพื่องานไม่กี่บรรทัด |
| **เอกสาร · รายงาน** | ข้อสรุปขึ้นก่อน · 1 ย่อหน้า 1 เรื่อง · ตัวอย่างประกอบข้อที่เป็นนามธรรม · ตารางสำหรับข้อมูลที่เทียบกัน | ทวนสิ่งที่พูดไปแล้ว · หัวข้อที่ไม่มีเนื้อ · ศัพท์ที่คนอ่านไม่รู้ |
| **แผน · ขั้นตอน** | 3–5 ข้อสำคัญ · ทุกข้อมีเจ้าของและวัดได้ว่าเสร็จ · ขั้นน้อยที่สุดที่ได้ผล | รายการ 20 ข้อที่ไม่มีลำดับความสำคัญ · ขั้นที่มีไว้ "เผื่อ" |
| **ดีไซน์ · สไลด์ · รูป** | 1 หน้า 1 ใจความ · ทางสั้นสุดไปถึงเป้าของผู้ใช้ · ใช้แบบที่คนคุ้นเคย | อัดข้อมูลจนต้องเพ่ง · ของตกแต่งที่ไม่ช่วยให้เข้าใจ |
| **ตาราง · ข้อมูล** | คอลัมน์เท่าที่ใช้ตัดสินใจ · สูตรสั้นที่ตามได้ | คอลัมน์ซ้ำความหมาย · สูตรซ้อนยาวบรรทัดเดียว |
| **คำตอบ** | ตอบก่อน · ยาวเท่าที่คำถามต้องการ | อธิบายยาวกว่าตัวงาน |

plugin `software-company` มีรายละเอียดของโค้ดและสถาปัตยกรรมเพิ่ม: `lazy-coding` (เขียนให้น้อย) · `readable-code` (ชื่อ รูปร่างฟังก์ชัน โครงไฟล์) · `simplicity-first` (เอกสาร แผน สถาปัตยกรรม) · ถ้าติดตั้งอยู่ให้เปิดคู่กัน

## 4 · บอกว่าตั้งใจทำให้ง่าย

ทางลัดที่ตั้งใจ ให้เขียนไว้ว่าใช้ได้ถึงแค่ไหนและเปลี่ยนเมื่อไร จะได้ไม่ดูเหมือนลืม เช่น `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` · ในรายงานใส่ 1 บรรทัด `ข้าม: X — เพิ่มเมื่อ Y`

## 5 · ตรวจก่อนส่ง 5 ข้อ

1. คนนอกเปิดดูครั้งแรกแล้วเข้าใจภายใน 30 วินาทีไหม
2. มีส่วนไหน ขั้นไหน หรือชั้นไหนตัดออกได้โดยไม่เสียอะไรไหม ถ้ามีให้ตัด
3. ทุกส่วนที่เพิ่มมา มีเหตุผลว่าต้องใช้ตอนนี้ ไม่ใช่ "เผื่อ" ใช่ไหม
4. ยังครบเรื่องความถูกต้อง ความปลอดภัย และสิ่งที่ผู้ใช้ขอไหม
5. ยังแยกหน้าที่ชัด ไม่ได้ยุบหลายเรื่องไว้ที่เดียวเพื่อให้ดูสั้นใช่ไหม


---

# skill: polished-document-style

Use when a kept doc (report, proposal, Word, PDF) needs headings, tables, theme. Wording → human-writing · designed look → branded-document-design.

# Polished Document Style

> **เส้นแบ่ง:** skill นี้ดูแลหน้าตา (หัวข้อ ตาราง กล่องข้อความ ธีม) · ถ้อยคำทุกบรรทัดเป็นของ `human-writing` — เอกสารที่คนเก็บไว้อ่านเปิดทั้งคู่

## When to use this skill

- Output is meant for **general readers** (managers, executives, clients, customers)
- Document needs **sign-off** or formal review
- Output will be **shared widely** or converted to PDF/Word later · any doc with 3+ sections or 500+ words
- จัดหน้าเอกสารที่คนเก็บไว้อ่านทุกชนิด (Markdown · Word · PDF) รวมถึงข้อความไทยในไฟล์ Office

## When NOT to use

- Internal notes for the author's own team (keep them concise)
- Quick scratch notes · code comments
- A whole Markdown report that must come out as one .docx → `markdown-report-docx` (plugin `software-company`)

> **Note:** This skill governs the *markdown source*. When the deliverable is a
> rendered **.docx / .pptx / .pdf** that a stakeholder will open, use
> `branded-document-design` (plugin `software-company`) on top of it — that skill carries the design tokens,
> the typography scale, Thai typography rules, and the `brandkit.py` builder.

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/markdown-patterns.md](references/markdown-patterns.md) | ถ้าจะเขียนส่วนหัว สารบัญ กล่องข้อความ ตาราง ป้ายสถานะ cover block ตารางเทียบตัวเลือก ส่วนเซ็นรับ หรืออภิธานศัพท์ ให้เปิดดูตัวอย่าง markdown แล้วลอกไปใช้ |
| [scripts/check_outline.py](scripts/check_outline.py) | ถ้า skill ที่เขียนเอกสารมีไฟล์แบบใน `assets/` ให้รัน `python scripts/check_outline.py <แบบ.md> <เอกสาร.md>` ก่อนส่ง — ตรวจหัวข้อครบและเรียงตามแบบ ช่องตัวหนาครบ หัวตารางตรง และไม่มีช่องที่ยังไม่เติม · ในแบบ ใส่ `<!-- optional -->` ท้ายหัวข้อหรือช่องที่ไม่บังคับ · แก้ตัวตรวจแล้วรัน `--self-test` ก่อน |
| [references/theme-colors.md](references/theme-colors.md) | ถ้าต้องเลือกสีหลักของเอกสาร หรือใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์ ให้เปิดดูวิธีประกาศธีม ใครคุมสีส่วนไหน และค่าสีตั้งต้นประจำบ้าน |
| [references/thai-office.md](references/thai-office.md) | ถ้าสร้างไฟล์ Word · Excel · PDF ที่มีภาษาไทย ให้เปิดดูก่อนเรื่องฟอนต์ การจัดย่อหน้า และการส่งออก |

## Document Header (Always)

Every polished doc MUST start with ส่วนหัวชุดเดียวกัน คือ H1 ข้อความล้วน ตามด้วยกล่อง quote ที่บอกเวอร์ชัน วันที่ สถานะ ผู้เขียน ผู้รีวิว และแท็ก แล้วปิดด้วย `---` ตัวอย่างเต็มอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

Status values:
- **Draft** (ร่าง) — work in progress
- **Review** (กำลังรีวิว) — under stakeholder review
- **Approved** (อนุมัติแล้ว) — signed off
- **Archived** (เก็บถาวร) — historical reference

ชุดนี้ 4 ค่าเท่านั้น เขียนเหมือนกันทุก skill (`status-report` ใช้ชุดเดียวกัน และเพิ่ม `ยังไม่เริ่ม` สำหรับเอกสารที่ยังไม่ลงมือ) · ช่อง Status ในตาราง Sign-off เป็นสถานะของคนเซ็น ใช้ **Approved** · **Review** · **Pending** (ยังไม่ส่งให้ดู) · **Rejected**

## Section Hierarchy

- **H1** — Document title (exactly one)
- **H2** — Numbered sections (`## 1. Section`)
- **H3** — Sub-sections (`### 1.1 Sub-topic`)
- **H4** — Rare, use only if needed

**Always add Table of Contents** for docs with 5+ sections และต้องกดลิงก์ในสารบัญแล้วไปถึงหัวข้อจริง ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## ธีมของเอกสาร — ตัดสินใจครั้งเดียว ใช้ทุกที่ในเอกสารนั้น

เอกสาร 1 ฉบับผ่านหลาย skill (markdown · `diagram-figures` · `branded-document-design` · `presentation-design`) จึงเลือกสีหลักครั้งเดียว ประกาศเป็น `<!-- doc-theme: accent=… · ที่มา=… · ยืนยันเมื่อ=YYYY-MM-DD -->` ท้ายส่วนหัวของเอกสาร แล้วทุกเครื่องมืออ่านค่าจากที่นั่น · ต้องเลือกสีหรือใส่สีจริงลงรูป .docx สไลด์ → เปิด [references/theme-colors.md](references/theme-colors.md) (ที่มาของสี ค่าตั้งต้นประจำบ้าน สีของสถานะ)

## คำกำกับ — ใช้คำ ไม่ใช้อีโมจิ

**ไม่มีอีโมจิในเอกสาร** ทั้งหัวข้อ กล่องข้อความ ป้ายสถานะ และตาราง เพราะอีโมจิในหัวข้อและป้ายเป็นสัญญาณว่า AI ทำ (`no-ai-look`) · ใช้คำตัวหนาที่คงที่ทั้งเอกสารแทน

| ใช้ทำอะไร | คำที่ใช้ |
|---|---|
| ระดับความสำคัญ | วิกฤต · สูง · กลาง · ต่ำ |
| สถานะงาน | เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่ |
| ผลตรวจ | ผ่าน · ไม่ผ่าน |
| ชนิดกล่องข้อความ | ข้อแนะนำ (Tip) · ข้อควรจำ (Note) · ข้อควรระวัง (Warning) · อันตราย (Critical) · คำถามที่ยังเปิด (Open Question) |

ช่องใช่/ไม่ในตาราง ใช้เครื่องหมายตัวอักษร `✓` `✗` ได้ (ไม่ใช่อีโมจิสี) หรือเขียน "ใช่" "ไม่" 

## Callout Boxes

Use blockquotes with a bold label (no emoji) มี 5 ชนิด คือ **Tip** (ข้อแนะนำ) · **Note** (ข้อควรจำ) · **Warning** (ข้อควรระวัง) · **Critical** (อันตราย) · **Open Question** (คำถามที่ยังเปิด) ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

**Rules:**
- Keep callouts to 1-3 sentences
- One callout per topic — don't stack
- Don't overuse — max 3-5 per page

## Tables — When and How

Use tables when items have **2+ attributes** ถ้าเขียนเป็น bullet แล้วแต่ละบรรทัดมีหลายค่าคั่นด้วยจุลภาค ให้เปลี่ยนเป็นตาราง ตัวอย่างเทียบกันอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

- Left-align text, center checkmarks/numbers, right-align money
- Use `—` (em dash) for "not applicable", not `-` or blank
- Keep cells short — long content goes in body paragraphs
- Bold key columns: `**email**`

ถ้าเอกสารต้องเทียบตัวเลือกหรือชั่งข้อดีข้อเสีย (strategy, vendor choice, plan options) ให้ใช้ตารางเทียบที่มีคอลัมน์ Recommendation ส่วนเอกสารที่ต้องอนุมัติให้ปิดท้ายด้วยตาราง Sign-off และเอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป (เกณฑ์เดียวกับ `spell-out-abbreviations`) ให้มีอภิธานศัพท์ ตัวอย่างทั้งสามแบบอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## Diagrams

**รูปในเอกสารโปรเจกต์ (รายงาน · ข้อเสนอ · ผังขั้นตอน · ผังข้อมูล) วาดด้วย `diagram-figures` ซึ่งเป็น house style เดียว แล้วฝังเป็นไฟล์ภาพ** · Mermaid (`software-diagrams` ใน plugin `software-company`) ใช้แค่รูปด่วนใน README · PR · โน้ตในโค้ด
skill นี้คุมเฉพาะเรื่องการวางรูปลงในเอกสาร

- วางไว้**หลังย่อหน้าที่อธิบายว่ารูปนี้ตอบคำถามอะไร** ไม่ใช่ลอยขึ้นมาเฉย ๆ
- ทุกรูปมีคำบรรยายใต้รูป 1 บรรทัด ขึ้นต้นด้วย **รูปที่ N —**
- รูปเดียวกันอย่าใส่ซ้ำหลายที่ในเอกสาร ให้อ้างถึงเลขรูปแทน

## Status Badges and Cover Block

ช่องสำคัญในส่วนหัวหรือในตารางให้ใช้ป้ายสถานะเป็นคำตัวหนา เช่น `**Status:** Approved` ส่วนเอกสารทางการ (ข้อเสนอ · รายงานทางการ · สัญญา · postmortem) ให้เปิดด้วย cover block ที่บอกชนิดเอกสาร เวอร์ชัน สถานะ วันที่ ผู้เขียน ผู้รีวิว และเอกสารที่เกี่ยวข้อง ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## Lists and Code Blocks

**Rule:** ไม่ซ้อน bullet เลย ถ้ารายการต้องมีชั้นย่อย ให้แยกเป็นหัวข้อย่อยหรือใช้ตาราง
ตัวอย่างรายการที่ดีและรายการที่ซ้อนเกินอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

Code blocks ต้องระบุภาษาทุกครั้ง (Always specify language) และถ้าโค้ดยาว ให้ใส่ชื่อไฟล์เป็นคอมเมนต์ในบรรทัดแรก ตัวอย่างอยู่ใน [references/markdown-patterns.md](references/markdown-patterns.md)

## เอกสาร Office ภาษาไทย

ไฟล์ Word · Excel · PDF ที่มีภาษาไทย (ฟอนต์ complex script · ไม่ justify · ฝังฟอนต์ · CSV แบบ BOM) → เปิด [references/thai-office.md](references/thai-office.md) ก่อนสร้างไฟล์

## Quality Checklist

Before delivering any polished doc:

- [ ] H1 title in plain text — no emoji in any heading, callout, badge or table
- [ ] Header block with version, date, status, authors (cover block เฉพาะเอกสารทางการ)
- [ ] TOC if 5+ sections
- [ ] All sections numbered consistently
- [ ] Anchor links in TOC actually work
- [ ] Status badges where applicable
- [ ] Tables used (not bullets) where data has 2+ attributes
- [ ] Every flow or relationship has a diagram drawn with `diagram-figures` (plugin `software-company` · house style), not default Mermaid
- [ ] Callout boxes for tips/warnings (not just paragraphs)
- [ ] Code blocks have language hints
- [ ] Glossary for docs with 5+ abbreviations (ตัวย่อตั้งแต่ 5 ตัว)
- [ ] No placeholder text (TBD, TODO, Lorem ipsum) — `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders; keep them
- [ ] Tested rendering in the real viewer (Word · PDF · GitHub preview)

> ไดอะแกรมในเอกสารโปรเจกต์อยู่ใน `diagram-figures` · เอกสารโค้ด (Mermaid ด่วน · ข้อกำหนดซอฟต์แวร์) → ส่วนเพิ่มใน plugin `software-company`

## Anti-patterns

- **Emoji anywhere** — in headings, callouts, badges or tables it reads as AI-made; use bold words
- **Nested bullets** — any bullet under a bullet; use a sub-heading or a table instead
- **Inconsistent terminology** — "user" in one section, "customer" in next
- **Tables of paragraphs** — if cells are >2 sentences, use headings instead

หน้าตาแบบ AI ทุกสื่อ → ก่อนส่งไล่ข้อ 3 ของ `no-ai-look` · กฎเขียนตัวย่อ → `spell-out-abbreviations`


## reference: markdown-patterns.md

# รูปแบบ markdown พร้อมตัวอย่าง

ตัวอย่างโค้ด markdown ของทุกรูปแบบที่ `SKILL.md` อ้างถึง ให้ลอกไปใช้ได้ทันที ส่วนกฎว่าใช้เมื่อไหร่อยู่ใน `SKILL.md`

**สารบัญ:** Document Header · Table of Contents · Callout Boxes · Tables · Figures · Status Badges · Cover Block · Comparison / Decision Tables · Lists · Code Blocks · Approval/Sign-off · Glossary

## Document Header (Always)

Every polished doc MUST start with:

```markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft
> **Authors:** <names> · **Reviewers:** <names>
> **Tags:** `<area>` `<topic>`

---
```

Status values:
- **Draft** — work in progress
- **Review** — under stakeholder review
- **Approved** — signed off
- **Archived** — historical reference

## Table of Contents

**Always add Table of Contents** for docs with 5+ sections:

```markdown
## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope](#2-scope)
3. [Details](#3-details)
```

## Callout Boxes

Use blockquotes with a bold label — no emoji. 5 ชนิด ชื่อไทยคู่กัน: Tip (ข้อแนะนำ) · Note (ข้อควรจำ) · Warning (ข้อควรระวัง) · Critical (อันตราย) · Open Question (คำถามที่ยังเปิด):

```markdown
> **Tip:** Brief actionable insight.

> **Warning:** Important caveat or limitation.

> **Critical:** Must-read before proceeding.

> **Note:** Additional context or background.

> **Open Question:** Needs decision/clarification.
```

## Tables — When and How

### When to use tables instead of bullets

Use tables when items have **2+ attributes**:

Don't use bullets:
```markdown
- email: string, required, unique
- age: number, optional
- role: enum, required, default "user"
```

Use a table:
```markdown
| Field | Type   | Required | Default | Description       |
|-------|--------|:--------:|:-------:|-------------------|
| email | string | ✓        | —       | Unique login email|
| age   | number | ✗        | —       | Optional          |
| role  | enum   | ✓        | `user`  | Access level      |
```

## Figures (รูปในเอกสาร)

รูปในเอกสารโปรเจกต์วาดด้วย `diagram-figures` (plugin `software-company` · house style) แล้วฝังเป็นไฟล์ภาพ · Mermaid ใช้แค่รูปด่วนใน README · PR ไม่ใช้ในเอกสารที่ส่งต่อ

```markdown
ลำดับการเรียกเมื่อผู้ใช้กดบันทึกแสดงในรูปที่ 3

![ลำดับการเรียกเมื่อผู้ใช้กดบันทึก](figures/fig-03.png)

**รูปที่ 3 —** ลำดับการเรียกเมื่อผู้ใช้กดบันทึก
```

## Status Badges (Inline)

For key fields in headers/tables:

```markdown
**Status:** Approved
**Priority:** High
**Risk Level:** Medium
**Service Level Agreement (SLA):** < 200ms
```

Multiple badges in a header:

```markdown
> **Approved** · **High Priority** · Owner @alice · Due 2025-03-15
```

## Cover Block Pattern

For formal documents (Business Requirements Document (BRD), Functional Specification Document (FSD), Architecture Decision Record (ADR), postmortem):

```markdown
# <Title>

| | |
|--|--|
| **Document Type** | BRD \| FSD \| ADR \| Postmortem |
| **Version** | 1.2 |
| **Status** | Approved |
| **Date** | 2025-01-15 |
| **Author(s)** | @alice, @bob |
| **Reviewer(s)** | @charlie |
| **Related** | [BRD-001](link), [FSD-005](link) |

---
```

## Comparison / Decision Tables

For trade-off analysis (architect, Project Manager (PM), Search Engine Optimization (SEO) recommendations):

```markdown
| Option | Cost | Effort | Risk | Time-to-Value | Recommendation |
|--------|:----:|:------:|:----:|:-------------:|:--------------:|
| **A**  | ฿80k | Med  | Low  | Fast | **Recommended** |
| B      | ฿40k | Low  | High | Med  | Not recommended |
| C      | ฿150k| High | Low  | Slow | Future consideration |
```

## Lists — When to nest, when to flatten

### Good list
```markdown
- Email is unique across all users
- Passwords must be 8+ characters with mixed case
- Sessions expire after 30 days of inactivity
```

### Bad list (over-nested)
```markdown
- Users
  - Email
    - Must be unique
    - Required
  - Password
    - 8+ chars
    - Mixed case
```

→ Should be a table instead.

## Code Blocks

Always specify language:

````markdown
```typescript
const user: User = { id: 1, email: 'a@b.com' };
```

```bash
npm install
```

```sql
SELECT * FROM users WHERE id = $1;
```
````

For long blocks, put the file name in a comment on the first line:

```typescript
// src/services/auth.ts
export async function login(email: string, password: string) {
  // ...
}
```

## Approval/Sign-off Section (End of Doc)

For documents needing formal approval:

```markdown
## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Approved | 2025-01-15 |
| Tech Lead | @bob | Review | — |
| QA Lead | @charlie | Pending | — |
| Security | @dave | Rejected | 2025-01-14 |
```

## Glossary Section

For docs with 5+ technical terms:

```markdown
## Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token, used for stateless auth |
| **SLA** | Service Level Agreement |
```

Define acronyms on first use, then add to glossary.


## reference: thai-office.md

# เอกสาร Office ภาษาไทย

ใช้กับไฟล์ Word · Excel · PDF ทุกไฟล์ที่มีภาษาไทย จะสร้างด้วยสคริปต์หรือทำมือก็ตาม รายละเอียดและตัวช่วยอยู่ใน `branded-document-design`

- Word นับภาษาไทยเป็น complex script จึงมีช่องฟอนต์ ขนาด และตัวหนาแยกจากละติน ถ้าตั้งแค่ช่องละติน ข้อความไทยจะไม่เปลี่ยน ต้องตั้งให้ครบทั้งสองชุด
- ย่อหน้าไทยไม่จัดชิดสองขอบ (justify) เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดช่องไฟจนเป็นรู (ยกเว้นคู่มือวิทยานิพนธ์สั่ง Thai Distributed)
- ข้อความไทยห้ามใช้ฟอนต์ mono เพราะ Consolas กับ Cascadia ไม่มีอักษรไทย ใช้ mono กับรหัส คีย์ และตัวเลขเท่านั้น
- ส่งออก PDF ให้ฝังฟอนต์ทุกครั้ง ไม่งั้นเครื่องที่ไม่มีฟอนต์จะเอาตัวอื่นมาแทนและวรรณยุกต์ลอย
- CSV ที่ให้คนไทยเปิดใน Excel บันทึกเป็น UTF-8 แบบมี BOM ไม่งั้นภาษาไทยเพี้ยน
- ก่อนบอกว่าเสร็จ แปลงทุกหน้าเป็นภาพแล้วเปิดดูจริง ตารางล้น หัวข้อค้างท้ายหน้า วรรณยุกต์ลอย ดูจากโค้ดไม่เห็น


## reference: theme-colors.md

# ตารางสีของธีมเอกสาร

ไฟล์นี้บอกว่าส่วนไหนของเอกสารใครเป็นคนคุมสี และค่าสีตั้งต้นประจำบ้านคืออะไร ใช้ตอนต้องใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์

## ประกาศธีม — ตัดสินใจครั้งเดียว ใช้ทุกที่ในเอกสารนั้น

เอกสาร 1 ฉบับผ่านหลาย skill: markdown (`polished-document-style`) · รูปจาก `diagram-figures` ·
ไฟล์ .docx จาก `branded-document-design` · สไลด์จาก `presentation-design` (ทั้งสามอยู่ใน plugin `software-company`)
ถ้าแต่ละตัวเลือกสีเอง ผู้อ่านจะได้เอกสารที่รูปสีหนึ่ง หัวข้อสีหนึ่ง และสไลด์อีกสีหนึ่ง

**markdown เป็นต้นฉบับหลัก (source of truth) จึงประกาศธีมไว้ที่นี่** — ใส่ไว้ท้ายส่วนหัวของเอกสารหรือในไฟล์ข้างกัน:

```markdown
<!-- doc-theme: accent=<สีหลัก> · ที่มา=<แบรนด์ลูกค้า / เสนอจากเนื้องาน> · ยืนยันเมื่อ=YYYY-MM-DD -->
```

**สีหลักมาจากเนื้องาน ไม่ใช่จากค่าเริ่มต้นของเครื่องมือ**
ถ้ามีสีแบรนด์อยู่แล้วให้ใช้สีนั้น ถ้ายังไม่มีให้ค้นต้นแบบตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · ค้นสดไม่ได้จึงใช้ค่าตั้งต้นประจำบ้าน เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนที่เข้ากับเนื้องานไว้ในรายงาน
(คลังสำรอง: ตารางจับคู่เนื้องานกับโทนสีอยู่ใน `colour-by-domain` ของ skill `diagram-figures` (plugin `software-company`))

markdown เองไม่มีสี จึงใช้คำกำกับและน้ำหนักตัวอักษรแทน ส่วนไดอะแกรม รูป ไฟล์ .docx และสไลด์อ่านค่าจาก `doc-theme` ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ให้ใช้ค่าตั้งต้นประจำบ้าน ตารางทั้งสองอยู่ข้างล่าง

**คำสถานะไม่ขึ้นกับธีม** — วิกฤต · ผ่าน ใช้คำเดิมทุกเอกสาร ส่วนสีของสถานะในรูป .docx และสไลด์อยู่ข้างล่าง

## ใครคุมสีส่วนไหน

| ส่วนของเอกสาร | ใครคุมสี | อ่านค่าจาก |
|---|---|---|
| หัวข้อ ตาราง กล่องข้อความใน markdown | markdown ไม่มีสี ใช้คำกำกับตัวหนาและน้ำหนักตัวอักษรแทน | — |
| ไดอะแกรม Mermaid | `diagram-figures` → `references/engine-mermaid.md` (README · PR: `software-diagrams` ข้อ 2 ใน plugin `software-company`) | `doc-theme` |
| รูปที่เป็นไฟล์ภาพ | `diagram-figures` (plugin `software-company`) | `doc-theme` |
| ไฟล์ .docx / .pdf ที่ส่งออก | `branded-document-design` (plugin `software-company`) ข้อ 0–1 | `doc-theme` |
| สไลด์ | `presentation-design` (plugin `software-company`) | `doc-theme` |

## ค่าตั้งต้นประจำบ้าน (house default)

ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ทุก skill ใช้ชุดนี้เป็นค่าตั้งต้น เพื่อให้รูป เอกสาร และสไลด์เป็นชุดสีเดียวกันตั้งแต่แรก ชุดนี้คือชุดเดียวกับ `presentation-design` และ `branded-document-design`:

| token | ค่า | ใช้กับ |
|---|---|---|
| brand | `#2A78D6` | สีหลัก · หัวข้อ · เส้น accent |
| brand-deep | `#2A4C86` | หัวตาราง · H2 · ชื่อระบบ |
| brand-2 | `#6A5CD6` | accent รอง (ม่วง) |
| tint | `#EDF1FB` | พื้นหัวตาราง · พื้นกล่องเน้น |
| ink / body | `#333B4A` / `#414957` | หัวข้อ / เนื้อความ |
| muted / faint | `#7D8492` / `#A9AEB9` | คำบรรยาย / หมายเหตุ |
| line | `#E4E7EE` | เส้นขอบ · เส้นเชื่อม |
| exception | `#C77A11` | ทาง/โซนที่ไม่ใช่เส้นทางหลัก (ต่างจาก brand เสมอ) |
| ฟอนต์ | Tahoma (เอกสาร/สไลด์) · Noto Sans Thai → Tahoma (ภาพ) | ทั้งไทยและอังกฤษ |

เมื่อประกาศ accent เฉพาะงานแล้ว ให้ใช้ค่านั้นแทน brand ส่วนสีอื่นคำนวณจาก accent ตัวนั้น


---

# skill: branded-document-design

Use when a Word, PowerPoint or PDF deliverable (proposal, report, contract) must look designed. Whole report from one Markdown → markdown-report-docx.

# Branded Document Design

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** เอกสารที่ส่งออกไปต้องดูออกว่าตั้งใจออกแบบ คือมีชุดสี ชุดขนาดตัวอักษร
> และช่องไฟที่เหมือนกันทุกหน้า ไม่ใช่เปิด Word แล้วพิมพ์เลย

## เมื่อไหร่ใช้ skill นี้

- ผลลัพธ์คือ **.docx / .pptx / .pdf** (ใบเสนอราคา · แผนธุรกิจ · รายงาน · สัญญา · เอกสารซอฟต์แวร์ เช่น SRS) ที่ลูกค้า ผู้บริหาร หรือทีมอื่นจะเปิดดู
- เอกสารต้อง **เซ็นอนุมัติ** หรือแนบไปกับสัญญา/ข้อเสนอ
- เอกสารไทย–อังกฤษปนกัน (ถ้าตั้งฟอนต์ไม่ครบจะพังง่ายมาก)
- ต้องออกเอกสารแบบเดียวกันซ้ำ ๆ และอยากให้ทุกฉบับหน้าตาเหมือนกัน

## เมื่อไหร่ **ไม่** ใช้

- ผลลัพธ์เป็น markdown (ในรีโปหรือโฟลเดอร์งาน) ให้ใช้ `polished-document-style`
- ต้องแค่ **อ่าน/แกะ** ไฟล์ Office ที่ได้รับมา ให้ใช้ `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf`
- ไดอะแกรมในเอกสาร markdown ให้ใช้ `markdown-visuals`
- รายงานทั้งเล่มจาก Markdown ไฟล์เดียว (ปกโลโก้กลาง · สารบัญ · ตาราง · รูป) ให้ใช้ `markdown-report-docx` ซึ่งมีสคริปต์ md → docx พร้อมแล้ว

**ลำดับที่ถูกต้อง:** เขียนเนื้อหาเป็น markdown ก่อน (polished-document-style)
→ ค่อยใช้ skill นี้ render เป็นไฟล์ส่งมอบ และแก้เนื้อหาที่ markdown เสมอ (markdown คือต้นฉบับ)

---

**ติดตั้งก่อนใช้:** `pip install python-docx python-pptx` · LibreOffice (`soffice`) สำหรับแปลงเป็น PDF · `pdftoppm` (poppler) สำหรับแปลงเป็นภาพ

## 0 · สีมาจากโปรเจกต์ — หาตามลำดับ ไม่หยุดรอ

**ถ้า markdown ต้นทางมี `doc-theme` อยู่แล้ว ให้ใช้ค่านั้น อย่าถามซ้ำ อย่าตั้งใหม่**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")

ถ้ายังไม่มี ให้หาตามลำดับใน `diagram-figures` ข้อ 5 ที่เดียว (`doc-theme` → สีแบรนด์ในโค้ด โลโก้ ชุดแบรนด์ → ยังไม่มีเลย)
ยังไม่มีเลย → **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้ · ค้นสดไม่ได้ → ใช้สีประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · เสนอโทนตามเนื้องาน (ดูบรรทัดถัดไป) ไว้ในรายงานให้ผู้ใช้เลือกทีหลัง
ได้สีแล้ว**เขียนกลับลง `doc-theme`** ในไฟล์ markdown เพื่อให้เอกสาร รูป และสไลด์ใช้สีเดียวกัน

โทนที่เสนอตามเนื้องาน (การแพทย์ · การเงิน · ราชการ ฯลฯ · คลังสำรอง ใช้เมื่อค้นสดไม่ได้) → [`references/palette-examples.md`](references/palette-examples.md) · ลูกค้ามีแบรนด์แล้วใช้สีแบรนด์เสมอ

**สีหลักมีสีเดียว** เฉดอ่อนและเข้มทั้งหมดคำนวณจากสีนั้น ไม่เลือกเพิ่มทีละสี
สีที่ไม่ผูกกับสีหลักมีแค่สีสถานะ (สำเร็จ · เตือน · ผิดพลาด) และต้องคงความหมายเดิมเสมอ


## 0.1 · หน้าตาเอกสารต่อจากหน้าตาของแบรนด์หรือแอป — ทำก่อน render ครั้งแรก

> ค่าตั้งต้นของ skill นี้ (Tahoma · ปกแถบสีทึบ · ตารางมีเส้นทุกช่อง) คือ**พื้น** ไม่ใช่หน้าตาส่งมอบ
> ใช้ค่าตั้งต้นตรง ๆ = เอกสารที่ดูเหมือนพิมพ์จาก Word ทุกบริษัท ทั้งที่แบรนด์หรือแอปของงานนั้นผ่านด่านสวยแล้ว

1. **มีตัวตนอยู่แล้วไหม** — ดู brand kit เดิม (`graphic-design:brand-kit` ถ้าติดตั้ง ใช้สีและฟอนต์จากชุดนั้น) · `assets/logo/` · `docs/design/` · งานซอฟต์แวร์: mockup ที่ผ่านด่านสวย (คะแนนใน `docs/BUILD-PLAN.md`) · `docs/README.md` ช่อง `doc-theme` → มี: เอกสารต้องใช้โลโก้ (ปก + หัวหน้า) สีแบรนด์ และลวดลายเดียวกับแอป · ไม่มี: ทำตามข้อ 0
2. **ทำ 1 แนวก่อน** · ถ้าผู้ใช้ไม่ว้าวหรือขอหลายแนว จึงทำ **3 แนวขนานกัน** (ค่าแรง 3–5 เท่า · `parallel-attempts-pick-best` · agent ที่มี Bash ตัวใหม่แนวละตัว · ปกใช้วิธีโหวต 3 แนวในหัวข้อ 0.2) — แต่ละแนวทำ HTML จำลองหน้า A4: ปก · หน้าเนื้อหาที่มีตารางข้อกำหนดจริง 4 แถว + callout · หน้าสารบัญหรือหน้ารูป · **รูป 1 รูปทำใหม่ตามแนว** (ใช้ `diagram-figures`) · หัวไฟล์บอกวิธีทำแต่ละชิ้นใน Word จริง · เมื่อทำหลายแนว แนวต้องต่างกันจริง เช่น ปกมืดต่อจากแอป / รายงานสว่างแบบบรรณาธิการ / สเปกวิศวกรรม
3. **ผู้ตรวจ 2 ตัวที่ไม่ได้ทำ** (ถ้ามีแนวเดียว ให้คะแนนแนวนั้นอย่างเดียว ไม่ต้องผสม) ให้คะแนน 1–5 (ผ่าน = 4): ความประทับใจแรก · ต่อเนื่องกับแอป · ความประณีต (ตารางไทยยาว 60 แถว ไม่ตัดกลางคำ · สเกลตัวอักษร · คอนทราสต์) · รูปอ่านออกเมื่อวางจริง · สร้างใน Word ได้จริง → **ผสมได้** (ปกจากแนวหนึ่ง เนื้อจากอีกแนว) ถ้าผู้ตรวจระบุชิ้นชัด
4. ลงมือที่ตัว render (ไม่แก้ทีละไฟล์ .docx) → render ทุกฉบับ → **ด่านสวยของเอกสาร**: ผู้ตรวจ 2 ตัวใหม่ดูภาพหน้าจริง (ปก · สารบัญ · หน้าเปิดบท · หน้าตารางยาว · หน้ารูป) ใช้ 5 แกนข้างบน ใช้คะแนนที่ต่ำกว่า · เพดาน **3 รอบ** (รายละเอียดเพิ่มที่ `ui-craft/references/states-and-checks.md` ใน plugin `software-company` ถ้าติดตั้ง) · คะแนนทุกรอบลง `docs/BUILD-PLAN.md`
5. **ฟอนต์:** ใช้ฟอนต์ไทยของแบรนด์ที่ติดตั้งในเครื่องและฝังในไฟล์ (`embed_fonts`) · Tahoma เป็นทางสำรองเมื่อฝังไม่ได้ · **ห้ามตั้งข้อความไทยด้วยฟอนต์ mono** (Cascadia/Consolas ไม่มีอักษรไทย) — mono ใช้กับรหัส คีย์ ตัวเลขเท่านั้น
6. **รูปในเอกสาร · กฎที่ด่านสวยจับได้บ่อย · ปก** (ขนาดพิกเซลขั้นต่ำ กฎใน `check` ของตัว render สูตรปก) → [`references/word-layout.md`](references/word-layout.md) หัวข้อท้ายไฟล์

## 0.2 · ปกที่ต้องเป็นของเอกสารชุดนี้ — ทำ 3 แนวแล้วโหวต 2 ใน 3

ใช้เมื่อชุดเอกสาร (ข้อเสนอ · รายงาน · แผนธุรกิจ) ต้องมีปกของตัวเอง และปกตั้งต้นดูเหมือนของงานอื่น · ทำแนวเดียวก่อน ถ้าผู้ใช้ไม่ว้าวหรือขอหลายแนวจึงใช้ (ค่าแรง 3–5 เท่า) · ขั้นเต็ม (หาของจริงมาจับ · ผู้ออกแบบ 3 ตัว · ผู้ตรวจ 3 ตัว · เกณฑ์โหวต · ข้อความบนปก) อยู่ใน [`cover-vote`](references/cover-vote.md)

---

## 1 · Design tokens — ห้าม hardcode สีนอกตารางนี้

ตารางนี้กำหนด**หน้าที่**ของแต่ละ token ไม่ได้กำหนดค่าสี · ค่าจริงมาจากข้อ 0 แล้วตั้งครั้งเดียวด้วย `use_brand(...)`

- token: `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + สีสถานะ 6 ตัว (สำเร็จ · ข้อมูล · เตือน · ผิดพลาด · เน้น · เป็นกลาง) ที่**ไม่เปลี่ยนตามแบรนด์**
- เลือกสีตามความหมาย ไม่ใช่ตามความสวย (แดง = อันตราย/ผิดจริงเท่านั้น) · ใช้ชุดความหมายเดียวกับไดอะแกรม
- เกณฑ์ที่ต้องผ่านทุกชุดสี: เนื้อความและ `text_muted` บนพื้น ≥ 4.5:1 · H2 และหัวตาราง (`brand_deep`) ≥ 7:1 · H1 และตัวเลข KPI (`brand` ตัวใหญ่) ≥ 3:1 · `use_brand()` ตรวจให้และหยุดถ้าไม่ผ่าน · พิมพ์ขาวดำแล้วยังแยกลำดับชั้นออก · ไม่ผ่านให้ปรับความเข้ม ไม่เปลี่ยนสี
- ตัวอักษรไม่ใช้ดำสนิท (ใช้ `text_body`) · **อย่าเพิ่มขนาดตัวอักษรนอกสเกล** (เนื้อความ Word 11pt · สไลด์ 17pt)

ตาราง token เต็ม · ตารางความหมายของสี · สเกลตัวอักษร (pt) · องค์ประกอบที่ใช้ซ้ำ + เมธอด → [`references/tokens-and-type.md`](references/tokens-and-type.md) — เปิดเมื่อตั้งธีมหรือเลือกขนาด/สี · ตัวอย่างชุดสีที่เคยใช้ → [`references/palette-examples.md`](references/palette-examples.md)

---

## 2 · ฟอนต์และภาษาไทย — จุดที่พังบ่อยที่สุด

ใช้ฟอนต์ไทยของแบรนด์ตามข้อ 0.1 ข้อ 5 ก่อน · ไม่มีหรือฝังไม่ได้ ใช้ **Tahoma** เป็นทางสำรอง · กฎที่ห้ามพลาด:

- 🚨 Word ถือว่าไทยเป็น *complex script* — **ห้ามตั้งฟอนต์/ขนาด/ตัวหนาเองด้วยมือ** ใช้ `style_run()` ใน `brandkit.py` (ตั้ง `w:szCs` `w:bCs` `w:iCs` และ `w:rFonts` ครบ 4 ช่อง)
- 🚨 ฟอนต์ละตินกับไทยคนละตัว → ตั้ง `bk.FONT` กับ `bk.LATIN_FONT` แล้วเรียก `bk.thai_runs(doc.element.body)` กับทุก header/footer ก่อน `save()`
- ระยะบรรทัด 1.3–1.35 (Tahoma) (ค่ากลางอยู่ใน `human-writing` `references/thai-line-breaking.md`) · **ห้าม justify** ย่อหน้าไทย · ส่ง PDF ให้ export จาก Word จริง หรือเปิดตรวจด้วยตาก่อน (LibreOffice ตัดคำไทยต่างจาก Word)
- Linux ไม่มี Tahoma → Loma/Sarabun · ReportLab จัดวรรณยุกต์ผิด

รายละเอียดกับดักฟอนต์คู่ · ฝังฟอนต์ · ฟอนต์ variable · ตัวไทยดูเล็กบน Linux → [`references/thai-fonts.md`](references/thai-fonts.md) — เปิดเมื่อตั้งฟอนต์หรือ PDF เพี้ยน

---

## 3 · โครงหน้าเอกสาร Word

โครงเอกสาร: หน้าปก (โปรเจกต์มีโลโก้และ mockup แล้ว → ปกเฉพาะโปรเจกต์ตามหัวข้อ 0.2 · ไม่มีตัวตนใช้แบบตั้งต้น) → สารบัญ (field TOC) → เนื้อหา (H1 มีเลขข้อ · keep-with-next ทุกหัวข้อ) → ตารางลงนามอนุมัติ · footer "หน้า N" กลางหน้า สีเทา 9pt · โครงเต็มทีละบรรทัด → [`references/word-layout.md`](references/word-layout.md) หัวข้อ "โครงหน้าเอกสาร"

**ปกเข้ม** (แอปหรือแบรนด์ใช้หน้าจอสีเข้ม) → `doc.cover(..., style="night")` · ตัวอย่าง `scripts/example_srs.py` · ภาพ `examples/example_srs-preview.png` · รายละเอียดและบทเรียนจากเจ้าของงาน → [`references/word-layout.md`](references/word-layout.md) กฎที่ต้องจำทุกครั้ง:
- 🚨 ภาพพื้นปกและโลโก้ห้ามอยู่ใน header หน้าแรก (Word แสดงจางตอนแก้ไฟล์) — ยึดกับย่อหน้าแรกของปก

**หัวตารางหน้าใน ห้ามใช้พื้นสีเข้มเต็มแถบ** · พื้นปกเข้ม ขนาดโลโก้ ตัวหนังสือเล็ก เส้นแสงใต้ชื่อ → [`references/word-layout.md`](references/word-layout.md)

หน้ากระดาษ A4 · ขอบ บน/ล่าง 2.2 ซม. · ซ้าย/ขวา 2.0 ซม. ได้ความกว้างเนื้อหา **17 ซม. = 9638 twips** (`BODY_TWIPS`)
(ใช้ตัวเลขนี้ตั้งความกว้างคอลัมน์ตารางให้รวมกันพอดี)

---

## 4 · องค์ประกอบที่ใช้ซ้ำ

องค์ประกอบ (`cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()`) หน้าตาและเมธอดครบ → [`references/tokens-and-type.md`](references/tokens-and-type.md)

**สัดส่วนที่พอดี:** callout ไม่เกิน 3–5 กล่องต่อ 10 หน้า · KPI strip 3–5 ช่อง · ตารางเกิน 6 คอลัมน์ให้เปลี่ยนเป็นหน้าแนวนอน (`landscape_section()`)

---

## 5 · วิธีใช้ brandkit

นำเข้า: `from brandkit import BrandDoc, use_brand, to_pdf` (วาง `scripts/` ไว้ใน path หรือ copy `brandkit.py` มาข้างงาน) · สไลด์ → `brandkit_pptx.BrandDeck` · เด็คพูด → `brandkit_stage.StageDeck`

โค้ดตัวอย่างครบ (Word · สไลด์ · เด็ค Stage) → [`references/brandkit-usage.md`](references/brandkit-usage.md) · เมธอดทั้งหมด → `references/api.md` · สคริปต์ที่รันได้ `scripts/example_srs.py` · `scripts/example_deck.py`

**เด็ค Stage** (ค่าเริ่มต้นของเด็คที่ใช้พูด): สี `accent`/`bg` หาตาม `diagram-figures` ข้อ 5 · ไม่มีเลยใช้ `#2A78D6` พื้น `09090A` + `(รอยืนยัน)` · รายละเอียด → `references/brandkit-usage.md`

---

## 6 · ตรวจงานด้วยตา — ขั้นตอนที่ห้ามข้าม

เอกสารที่ยังไม่มีใครเปิดดูหน้าจริง ถือว่ายังไม่เสร็จ เพราะอาจมีตารางล้นขอบ หัวข้อค้างท้ายหน้า
วรรณยุกต์ลอย ปัญหาเหล่านี้ดูจากโค้ดไม่เห็น
render เป็น PDF แล้วแปลงเป็นภาพ แล้ว **เปิดภาพดูจริงทุกหน้า** (Read tool) ก่อนส่งมอบ · คำสั่ง `soffice` · `pdftoppm` และรายการตรวจ 7 ข้อ → [`references/visual-check.md`](references/visual-check.md)

---

## 7 · Anti-patterns

- **ใช้ Heading style ที่มากับ Word** → ใช้ `h1()/h2()/h3()`
- **เส้นตารางดำหนาแบบค่าเริ่มต้น** → เส้น `line` 0.5pt
- **ตัวอักษรสีดำสนิท** → ใช้ `text_body`
- **หัวตารางตัวหนาแต่ไม่มีพื้นสี**
- **ปล่อยความกว้างคอลัมน์ให้ Word คิดเอง** → `fixed_widths()` เสมอ
- **อีโมจิเยอะเกิน**
- **ส่งไฟล์โดยไม่เคย render ดู**
- **ใช้หน้าตาตั้งต้นของ skill เป็นเอกสารส่งมอบ ทั้งที่แอปมีตัวตนแล้ว** → ทำข้อ 0.1
- **รูปกว้าง 2000px วางในหน้าแนวตั้ง 17 ซม. โดยไม่คิดขนาดตัวอักษร** → ตัวอักษรเหลือราว 5pt (ข้อ 0.1 ข้อ 6)
- **ภาพตกแต่งบนปกที่ไม่มีใครบอกว่าว้าว** → ตัดออก ให้ตัวอักษรเป็นจุดเด่น (references/word-layout.md ข้อ 8)
- **สร้าง .docx โดยไม่เก็บ markdown ต้นฉบับ**

เหตุผลและสิ่งที่ใช้แทนของแต่ละข้อ → [`references/anti-patterns.md`](references/anti-patterns.md)

---

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---------|-----------|
| โครงเนื้อหา/สำนวนเอกสารทางการ · **ธีมสีของเอกสาร** | `polished-document-style` |
| ไดอะแกรมที่จะเอามาแปะเป็นรูป | `diagram-figures` (รูปออกแบบ) · `software-diagrams` (plugin `software-company`) (Mermaid) → export PNG → `figure()` |
| อ่านไฟล์ Office ที่ลูกค้าส่งมา | `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` |
| สเปรดชีตส่งมอบ | `anthropic-skills:xlsx` (โทเคนสีชุดเดียวกันใช้ได้) |
| เนื้อหาและความครบถ้วนของเอกสาร SRS | `srs-writing` (plugin `software-company`) |
| โครงเรื่องและเลย์เอาต์ของสไลด์ | `presentation-design` |
| เด็คนำเสนอเป็น .html ไฟล์เดียว | `html-slide-deck` · มี .pptx แล้ว → `pptx-to-html-deck` |
| ไดอะแกรมที่วาดด้วย Mermaid ธีมเดียวกัน | `software-diagrams` (plugin `software-company`) |
| ที่มาของระบบสีและตัวอักษร · โลโก้ | `graphic-design` (plugin `software-company`) |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: anti-patterns.md

# Anti-patterns — เหตุผลและสิ่งที่ใช้แทน

หัวข้อสั้นอยู่ใน `SKILL.md`

- **ใช้ Heading style ที่มากับ Word** — จะทับสีที่ตั้งไว้ ให้ใช้ `h1()/h2()/h3()`
  ซึ่งตั้ง `outlineLvl` เอง สารบัญ (TOC) จึงยังเห็นหัวข้อ
- **เส้นตารางดำหนาแบบค่าเริ่มต้น** — เอกสารดูเก่าทันที ใช้เส้นสี `line` หนา 0.5pt ระหว่างแถว (ใต้แถวหัวคือเส้นแบรนด์ 1.5pt)
- **ตัวอักษรสีดำสนิท** — ให้ใช้ `text_body` ซึ่งเป็นเทาเข้ม เนื้อความจะนุ่มขึ้นมาก
- **หัวตารางตัวหนาแต่ไม่มีพื้นสี** — ตารางข้ามหน้าแล้วคนอ่านไม่รู้ว่าเริ่มตรงไหน
- **ปล่อยความกว้างคอลัมน์ให้ Word คิดเอง** — ต้อง `fixed_widths()` เสมอ
  ไม่งั้นคอลัมน์รหัสจะกว้างเท่าคอลัมน์รายละเอียด
- **อีโมจิเยอะเกิน** — 1 ตัวต่อ callout พอ ไม่ใส่ในหัวข้อทุกอัน
- **ส่งไฟล์โดยไม่เคย render ดู** — ดูข้อ 6
- **สร้าง .docx โดยไม่เก็บ markdown ต้นฉบับ** — รอบหน้าแก้ไม่ได้


## reference: api.md

# brandkit API — อ้างอิงเมธอด

ทุกเมธอดคืนอ็อบเจกต์ที่สร้าง (paragraph / table / slide) จึงปรับแต่งต่อได้

## สารบัญ

1. [brandkit.py — Word (.docx)](#brandkitpy--word-docx)
2. [brandkit_pptx.py — สไลด์ (.pptx)](#brandkit_pptxpy--สไลด์-pptx)
3. [brandkit_stage.py — เด็ค Stage (.pptx)](#brandkit_stagepy--เด็ค-stage-pptx)
4. [สูตรความกว้างคอลัมน์ (Word)](#สูตรความกว้างคอลัมน์-word)

---

## brandkit.py — Word (.docx)

### สร้างเอกสาร

```python
BrandDoc(path_template=None, page="A4", margins_cm=(2.2, 2.0, 2.2, 2.0),
         footer_text="หน้า")
```

| พารามิเตอร์ | ความหมาย |
|-------------|----------|
| `path_template` | ไฟล์ .docx/.dotx ที่ใช้เป็นแม่แบบ (มี header/logo ขององค์กรอยู่แล้ว) |
| `page` | `"A4"` หรือ `"Letter"` |
| `margins_cm` | (บน, ขวา, ล่าง, ซ้าย) |
| `footer_text` | คำนำหน้าเลขหน้า · `""` = เลขเปล่า |

### บล็อกระดับหน้า

| เมธอด | หมายเหตุ |
|-------|----------|
| `cover(title, subtitle, meta, note, logo, logo_width_cm=None, eyebrow=None, meta_rows=None, top_space_pt=24, page_break=True, style="light", art_colors=None)` | โลโก้รับได้ทั้ง .png และ .emf แต่ **.svg ใช้ไม่ได้ใน python-docx** ต้องแปลงเป็น PNG ก่อน (`rsvg-convert -w 600` หรือ `cairosvg`) |
| `cover(..., style="night")` | **ปกเข้มเต็มหน้า** (ดูตัวอย่าง `examples/example_srs-preview.png`): พื้นเทาเข้ม `#1C1C22` + แสงจางสีแบรนด์ · `logo` (ไม่ใส่ = ไม่มีโลโก้) เล็กมุมซ้ายบน กว้าง 4.6 ซม. · `eyebrow` → ชื่อเอกสาร (32pt · ยาวเกิน 2 บรรทัดลดเป็น 26pt) → `subtitle` → เส้นแสงเต็มแนวข้อความ · `meta_rows` ค่าสั้น (≤18 ตัวอักษร ไม่เกิน 4 ค่า) เป็นตาราง 4 ช่อง ที่เหลือเป็นแถว ป้าย/ค่า · `note` ท้ายสุด · ปกไม่มี footer · `art_colors=(สี1, สี2, สี3)` สีเส้นแสงจากซ้ายไปขวา และแสงพื้น (ค่าเริ่มต้น `brand_2` → `brand` → `brand` อ่อน) · ภาพพื้น/โลโก้/เส้นยึดกับย่อหน้าในเนื้อหา ไม่ใช่ header · ต้องมี numpy + pillow (`cover_art.py`) · `logo_width_cm` ค่าเริ่มต้น 2.6 (light) / 4.6 (night) |
| `toc(heading="สารบัญ", levels="1-3")` | แทรก field TOC แล้วใน Word กด **Ctrl+A แล้ว F9** เพื่อให้รายการขึ้น (ตอนสร้างจะยังว่าง) |
| `page_break()` | |
| `landscape_section()` | เปิดส่วนแนวนอนสำหรับตารางกว้าง |

### หัวข้อและข้อความ

| เมธอด | ผลลัพธ์ |
|-------|---------|
| `h1(text)` `h2(text)` `h3(text)` | 16 / 12.5 / 11.5 pt · bold · brand / brand_deep / text · ตั้ง `outlineLvl` ให้ TOC เห็น |
| `para(text, size, color, bold, italic, align, space_after)` | `align` = `"center"｜"right"｜"justify"` (ไทยอย่าใช้ justify) |
| `rich([(text, opts), ...])` | หลายรูปแบบในย่อหน้าเดียว เช่น `[("สถานะ: ", {"bold": True}), ("อนุมัติ", {"color": "green"})]` |
| `bullets([...], style="List Bullet")` | `style="List Number"` สำหรับเลขลำดับ |
| `code(text)` | บล็อกโค้ดพื้นเทา |

### ตารางและข้อมูล

| เมธอด | หมายเหตุ |
|-------|----------|
| `table(headers, rows, widths=None, zebra=False, align=None, first_col_bold=False, size=None, header_style="tint")` | `widths` หน่วย twips รวม **9638** (`BODY_TWIPS`) สำหรับ A4 ขอบ 2 ซม. · `align` = list ต่อคอลัมน์ · `header_style="tint"` (ค่าเริ่มต้น) หัวพื้น `brand` ผสมขาว 80% ตัวหนา `brand_deep` ไม่มีเส้นบน เส้น `brand` 1.5pt ใต้หัวเส้นเดียว เส้นแถวบาง ไม่มีเส้นตั้ง · `"classic"` = แบบเดิม (หัว `brand_tint` กริดเทาบาง) |
| `pill_table(headers, rows, status_col, palette, widths)` | `palette = {"เสร็จ": "green", "ค้าง": "red"}` · โทนที่ใช้ได้: green blue amber red violet grey |
| `kpi_row([(value, label), ...])` | 3–5 ช่องพอดี |
| `signoff([(role, name), ...])` | ตารางเซ็นอนุมัติ |

### อื่น ๆ

| เมธอด | หมายเหตุ |
|-------|----------|
| `callout(kind, title, body)` | kind = `tip｜note｜warning｜critical｜success｜question` |
| `figure(image_path, caption, width_cm=15.5, number=None)` | `number=1` จะขึ้นต้นคำบรรยายว่า "รูปที่ 1 — " |
| `save(path)` | |

### ฟังก์ชันระดับโมดูล

| ฟังก์ชัน | ใช้เมื่อ |
|----------|---------|
| `use_brand(**tokens)` | เปลี่ยนชุดสีทั้งชุด ต้องเรียก **ก่อน** สร้าง `BrandDoc` |
| `style_run(run, size, color, bold, italic, mono)` | ตั้งฟอนต์เอง (ครอบคลุม complex-script ให้แล้ว) |
| `shade(cell, token)` · `left_accent(cell, token, size)` | ระบายพื้น / แถบสีซ้ายของเซลล์ |
| `fixed_widths(table, widths)` | บังคับความกว้างคอลัมน์ |
| `set_borders(table)` · `row_borders(table)` · `no_borders(table)` · `cell_border(cell, edge, color, size)` | `row_borders` = เส้นแนวนอนอย่างเดียว · `cell_border(..., color=None)` = ไม่มีเส้นด้านนั้น |
| `mix(color, other="FFFFFF", amount=0.5)` | ผสมสีทำสีอ่อน/เข้มจาก palette |
| `repeat_header(row)` · `keep_with_next(paragraph)` | |
| `add_field(paragraph, "PAGE")` | แทรก field ของ Word |
| `to_pdf(docx_path, outdir)` | เรียก LibreOffice แปลงเป็น PDF |

---

## brandkit_pptx.py — สไลด์ (.pptx)

```python
BrandDeck(template=None)      # 16:9 (13.333 × 7.5 นิ้ว)
```

| เมธอด | สไลด์ที่ได้ |
|-------|-------------|
| `title_slide(title, subtitle, meta)` | พื้นฟ้าอ่อน + เส้นแบรนด์คั่น |
| `section(title, kicker=None)` | แถบแบรนด์แนวตั้งซ้าย + ชื่อส่วน |
| `bullets_slide(title, items, subtitle=None)` | หัวข้อ + ขีดม่วงใต้หัวข้อ + bullet 17pt |
| `kpi_slide(title, items, subtitle=None)` | การ์ดตัวเลข |
| `table_slide(title, headers, rows, col_widths, subtitle, status_col, palette)` | `col_widths` เป็นสัดส่วน เช่น `[1, 4, 2, 2]` |
| `image_slide(title, image_path, caption, subtitle)` | รูปกลางสไลด์ พอดีกรอบอัตโนมัติ |
| `quote_slide(text, source)` | สไลด์คำพูด/ข้อสรุป |
| `save(path)` | |

**ข้อจำกัดที่ต้องรู้**

- สไลด์ทุกอันสร้างจาก layout ว่าง (`slide_layouts[6]`) จึงไม่มีช่อง placeholder ให้แก้ใน PowerPoint
  แบบเทมเพลตปกติ ถ้าลูกค้าต้องแก้เองเยอะ ให้ส่ง `template=` เป็นไฟล์ .pptx ขององค์กรแทน
- ตารางใน python-pptx ไม่มี API ปิดเส้นขอบตรง ๆ ถ้าอยากได้ตารางไม่มีเส้น ให้เรียงกล่องข้อความแทน
- ความสูงแถวตารางเป็นค่าต่ำสุด ข้อความยาวจะดันแถวสูงขึ้นเอง ให้เผื่อพื้นที่

---

## brandkit_stage.py — เด็ค Stage (.pptx)

```python
StageDeck(accent="2A78D6", bg="09090A", project="", template=None,
          head_font="Chakra Petch", body_font="IBM Plex Sans Thai", **colors)
# accent / bg = สีหลักกับสีพื้นจากดีไซน์ของโปรเจกต์ · colors = สีที่โปรเจกต์กำหนดไว้แล้ว เช่น text="1B2430"
```

ทุกแผ่นยกเว้นปกและคั่นบทมี: สี่เหลี่ยมสีหลัก + ชื่อหมวด (`kicker`) · หัวสไลด์ 28 pt · เส้นท้ายกระดาษ · `PROJECT · หมวด` · เลขหน้า 2 หลัก

| เมธอด | สไลด์ที่ได้ |
|-------|-------------|
| `cover(title, lines, meta, logo=None, mark=None)` | ชื่อ 60 pt + ขีดสีหลัก · `lines[1]` เป็นสีหลัก · `mark` = สัญลักษณ์ใหญ่จางทางขวา (ไม่ใส่ = วงแหวนจาง) |
| `section(number, title, note)` | คั่นบท — เลขใหญ่สีหลัก |
| `figure(kicker, title, image, caption, subtitle)` | รูปผังเต็มแผ่น (เรนเดอร์ด้วย `#bg=` เดียวกับเด็ค) |
| `compare(kicker, title, headers, rows, widths=(1, 1.85, 1.95))` | ตารางเส้นคั่นแถว · คอลัมน์ 1 เทา 2 หนาขาว 3 เนื้อความ · ไม่เกิน 5 แถว |
| `stats(kicker, title, items, subtitle)` | ตัวเลขใหญ่ 2–4 ช่อง + ตัวอย่างถาม/ตอบใต้ตัวเลข |
| `steps(kicker, title, rows, example_head, note)` | ขั้นตอนมีเลข · `rows = [(ชื่อ, ทำอะไร, ตัวอย่าง)]` ไม่เกิน 6 ขั้น |
| `points(kicker, title, points, image, caption, side, side_caption)` | ภาพซ้าย + ใจความมีขีดสีหลัก · `side` = ภาพเล็กขวา เช่น QR |
| `statement(kicker, text, sub)` | ข้อความเดียวกลางแผ่น |
| `save(path)` | |

ตัวช่วยสี: `make_theme(accent, bg)` คืนชุดสีทั้งหมด · `fit(color, bg)` ปรับความสว่างโดยคงความสดจนอ่านออกบนพื้นนั้น · `is_dark(bg)` · `contrast(a, b)`

---

## สูตรความกว้างคอลัมน์ (Word)

| จำนวนคอลัมน์ | ตัวอย่าง widths (รวม 9638) |
|:---:|---|
| 2 | `[2600, 7038]` — หัวข้อ/รายละเอียด |
| 3 | `[1400, 6238, 2000]` — รหัส/รายการ/ผู้รับผิดชอบ |
| 4 | `[1100, 4478, 1900, 2160]` — รหัส/รายการ/ผู้รับผิดชอบ/สถานะ |
| 5 | `[1000, 1800, 2838, 2000, 2000]` |
| 6 ขึ้นไป | ใช้ `landscape_section()` (พื้นที่ 14570 twips) |


## reference: brandkit-usage.md

# วิธีใช้ brandkit — โค้ดตัวอย่าง

อ่านเมื่อเริ่มเขียนสคริปต์สร้างไฟล์จริง · เมธอดทั้งหมดอยู่ใน `api.md`

## เอกสาร Word (`brandkit.py`)

```python
import sys; sys.path.insert(0, "scripts")     # หรือ copy brandkit.py มาไว้ข้างงาน
from brandkit import BrandDoc, use_brand, to_pdf

doc = BrandDoc()                                # A4 · Tahoma · สีประจำบ้าน
doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
          subtitle="ระบบตัวอย่าง (Sample System) — Project Control & Monitor",
          meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
          logo="asset/Sample_Logo_Badge.png")
doc.toc()

doc.h1("1. ภาพรวมระบบ")
doc.para("ระบบตัวอย่างเป็นระบบบริหารและติดตามโครงการ ...")
doc.kpi_row([("19", "โครงการ"), ("115", "Work items"), ("103", "Open tasks")])
doc.table(["หัวข้อ", "รายละเอียด"],
          [["URL ระบบ", "https://app.example.com"]],
          widths=[2600, 7038])                  # รวม = 9638
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

## สไลด์ (`brandkit_pptx.py`)

สไลด์ใช้ `brandkit_pptx.py` ซึ่งกินโทเคนชุดเดียวกัน:

```python
from brandkit_pptx import BrandDeck
d = BrandDeck()                                  # 16:9
d.title_slide("ระบบตัวอย่าง", "Project Control & Monitor", "19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน", ["...", "..."], subtitle="สรุปจาก SRS v3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items")])
d.table_slide("สถานะ Milestone", headers, rows, col_widths=[1, 4, 2, 2],
              status_col=3, palette={"เสร็จ": "green", "กำลังทำ": "amber"})
d.image_slide("สถาปัตยกรรม", "diagrams/arch.png", caption="ภาพรวมองค์ประกอบ")
d.save("deck.pptx")
```

เมธอดทั้งหมดอยู่ใน `references/api.md` ส่วนไฟล์ตัวอย่างที่รันได้จริงคือ
`scripts/example_srs.py` (เอกสาร) · `scripts/example_deck.py` (สไลด์ `BrandDeck`)

## เด็ค "Stage" (`brandkit_stage.py`) — ค่าเริ่มต้นของเด็คที่ใช้พูด

`brandkit_stage.py` ทำเด็คโครงเดียวกับต้นแบบ หัวเรื่อง Chakra Petch เนื้อความ IBM Plex Sans Thai ส่วน**สีพื้นและสีหลักมาจากดีไซน์ของโปรเจกต์** พื้นเข้มหรือสว่างก็ได้
(ต้นแบบด้านโครงเด็คเท่านั้น: X Fitness Chatbot Summary v1.2 · ตัวอย่างที่รันแล้ว `examples/example_stage.pptx`)

```python
from brandkit_stage import StageDeck
d = StageDeck(accent="2A78D6", bg="09090A", project="Sample Chatbot")   # ตัวอย่าง: สีหลัก · สีพื้นต้องมาจากดีไซน์ของโปรเจกต์คุณเอง
d.cover("Sample Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
        meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
         "fig-flow-dark.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
d.save("deck.pptx")
```

- **สีมาจากดีไซน์ของโปรเจกต์ 2 ค่า** คือ `accent` (สีหลัก) กับ `bg` (สีพื้น) หาตามลำดับใน `diagram-figures` ข้อ 5 (`doc-theme` → ดีไซน์ในโค้ด เช่น `--primary` · `--background` · ธีม Tailwind · โหมดมืด/สว่างของแอป → โลโก้และชุดแบรนด์ → ยังไม่มีเลยใช้สีประจำบ้าน `#2A78D6` พื้น `09090A` แล้วเขียน `(รอยืนยัน)`) ห้ามใช้สีของต้นแบบ
- เทาทุกระดับคำนวณจาก `bg` (พื้นเข้มผสมขาว พื้นสว่างผสมดำ) จึงอมโทนเดียวกับพื้นของโปรเจกต์ · `accent_hi` คือสีหลักที่ปรับความสว่างจนอ่านออกบนพื้นนั้น ใช้กับตัวเลขใหญ่ เลขลำดับ และคำเน้น · โปรเจกต์ที่กำหนดสีตัวหนังสือไว้แล้ว ส่งทับได้ เช่น `text="1B2430"`
- ฟอนต์ใช้ของโปรเจกต์ได้ (`head_font=` · `body_font=`) ถ้าโปรเจกต์ยังไม่มี ใช้ Chakra Petch + IBM Plex Sans Thai
- **รูปผังต้องใช้สีพื้นเดียวกับเด็ค** — เรนเดอร์ `diagram-figures` ด้วย `#accent=<สีหลัก>&bg=<สีพื้น>` (ตอนนี้มีใน `figure-flow.html`)
- **ต้องติดตั้งฟอนต์ Chakra Petch และ IBM Plex Sans Thai** (Google Fonts · ใช้ฟรี) ในเครื่องที่เปิดไฟล์ ถ้าเครื่องปลายทางไม่มี ให้ส่ง PDF คู่ไปด้วย หรือสร้างใหม่ด้วย `head_font="Tahoma", body_font="Tahoma"`
- ถ้าจะพิมพ์ ให้สร้างอีกชุดด้วย `bg="FFFFFF"` แทนการใช้พื้นเข้มเปลืองหมึก · `BrandDeck` (แถบสีด้านบน) ยังใช้ได้กับรายงานที่ส่งให้อ่านเอง


## reference: cover-vote.md

# ปกที่ต้องเป็นของเอกสารชุดนี้ — ทำ 3 แนวแล้วโหวต 2 ใน 3

เปิดเมื่อชุดเอกสารต้องมีปกของตัวเอง

ใช้เมื่อชุดเอกสาร (ข้อเสนอ · รายงาน · แผนธุรกิจ) ต้องมีปกของตัวเอง และปกตั้งต้นดูเหมือนของงานอื่น · ทำแนวเดียวก่อน ถ้าผู้ใช้ไม่ว้าวหรือขอหลายแนวจึงใช้ (ค่าแรง 3–5 เท่า)

1. **หาของจริงมาจับ** — โลโก้ ชื่อ กริยาหลักของงาน (เสนอ · วิเคราะห์ · ขาย) หรือภาพจริงของงาน · ดูปกจริงของคนอื่นอย่างน้อย 6 ใบ · ทุกรูปบนปกต้องชี้กลับไปที่ของจริงได้ ไม่งั้นตัดออก
2. **ผู้ออกแบบ 3 ตัว (ใช้ `parallel-attempts-pick-best`)** โจทย์เดียวกัน ต่างกันที่แนว: A วาดจากข้อมูลจริงของงาน · B ภาพจริงของงานเป็นพระเอก (หน้าจอ ภาพถ่าย ตัวอย่างผลงาน) · C รูปทรงโลโก้หรือตัวอักษรเป็นโครง ไม่มีภาพวาด · agent ต้องมี Bash เพื่อ render แล้วเปิดดูภาพเอง
3. **ผู้ตรวจ 3 ตัวใหม่ ไม่เคยเห็นงาน คนละมุม** — ผู้กำกับศิลป์ (ว้าวจริงไหม ดูเป็นงาน AI ไหม) · แบรนด์และลูกค้า (จำได้ไหม รู้ว่างานเกี่ยวกับอะไรไหม ไปด้วยกันทั้งชุดไหม) · การผลิตใน Word (ทำซ้ำได้ไหม ข้อความแก้ได้ไหม) · ให้ใส่ปกเดิมเป็นตัวเลือกด้วย
4. **เกณฑ์ที่ให้คะแนน 1–5 แล้วโหวต** ว้าวเทียบปกเดิม · ไม่ซ้ำงานอื่น · บอกความจริงของงาน · เข้ากับทั้งชุด · ความประณีต (ไทย คอนทราสต์ ตัวเล็กสุด) · สร้างใน Word ได้และทำซ้ำได้ · แนวที่ได้ **2 ใน 3 เสียงชนะ** · ยกส่วนเด่นของแนวที่แพ้มาได้ไม่เกิน 2 ชิ้น · เสียงแตก 3 ทาง ให้ "ทำซ้ำได้" ตัดสิน
5. **ข้อความบนปกเป็นข้อความ Word แก้ได้** (ชื่อ เวอร์ชัน วันที่) · ภาพพื้นไม่ฝังตัวหนังสือ · ยึดภาพกับย่อหน้าแรก ไม่วางใน header
6. **เฉพาะชุดเอกสารซอฟต์แวร์** (BRD · SRS · FSD ที่ปกต้องมาจากรูปทรงโลโก้หรือ mockup จริง · ใช้เครื่องสร้างปก) → ถ้ามี plugin `software-company` ดู `doc-cover-design` เพิ่ม · ไม่มีก็ทำตามข้อ 1–5 ได้ครบ


## reference: palette-examples.md

# ตัวอย่างชุดสีที่เคยใช้จริง

> ระวัง: **นี่คือตัวอย่าง ไม่ใช่ค่ามาตรฐาน**
> เลือกสีจากเนื้องานตามข้อ 0 ของ `SKILL.md` ก่อนเสมอ
> ใช้ไฟล์นี้เพื่อดูว่าชุดที่ครบและผ่านเกณฑ์ contrast (ตรวจด้วยสคริปต์แล้ว 22 ต.ค. 2569) หน้าตาเป็นอย่างไร ไม่ใช่เพื่อคัดลอก

## ชุด A — น้ำเงิน–ม่วง (ซอฟต์แวร์ทั่วไป · สกัดจาก Apps Track)

โทนสว่าง โปร่ง นุ่มนวล ตัวอักษรเทาเย็น

```python
use_brand(
    brand="2A78D6", brand_2="6A5CD6", brand_deep="2A4C86",
    brand_tint="EDF1FB", brand_tint_2="F6F8FD",
    text="333B4A", text_body="414957", text_muted="676D7A", line="E4E7EE",
)
```

## ชุด B — เขียวอมฟ้า (การแพทย์ · สุขภาพ)

```python
use_brand(
    brand="0E8F86", brand_2="2F9E6E", brand_deep="0A5A56",
    brand_tint="E6F4F2", brand_tint_2="F3FAF9",
    text="2C3A38", text_body="3A4846", text_muted="636F6A", line="E1EAE8",
)
```

## ชุด C — กรมท่า (ราชการ · กฎหมาย)

```python
use_brand(
    brand="1F3C88", brand_2="5B4B8A", brand_deep="14275C",
    brand_tint="E8ECF7", brand_tint_2="F5F7FC",
    text="2B3245", text_body="3A4156", text_muted="636A7D", line="E2E6F0",
)
```

## ชุด D — เหลืองอำพัน + เทาเหล็ก (อุตสาหกรรม · โรงงาน)

accent อุ่นบนโครงเทาเย็น — ใช้ accent เฉพาะจุดที่ต้องการให้สังเกต ไม่ใช่ทั้งหน้า

```python
use_brand(
    brand="B57509", brand_2="8C5A2B", brand_deep="704805",
    brand_tint="FBF2E1", brand_tint_2="FDF9F1",
    text="2F3439", text_body="3E444A", text_muted="676F76", line="E5E8EA",
)
```

## สีสถานะ — ชุดเดียวกันทุกแบรนด์

สีสถานะ**ไม่เปลี่ยนตามแบรนด์** เพราะความหมายของมันคงที่

| สถานะ | พื้น | ตัวอักษร |
|---|---|---|
| สำเร็จ | `E9F7EF` | `17794A` |
| ข้อมูล | `EAF2FD` | `2160AB` |
| เตือน | `FDF5E4` | `96660D` |
| ผิดพลาด | `FDEDEC` | `A63A34` |
| เน้น | `F1EEFC` | `52439F` |
| เป็นกลาง | `F2F4F8` | `626A7A` |

> ถ้าสีแบรนด์ชนกับสีสถานะตัวใดตัวหนึ่ง (เช่น แบรนด์เป็นเขียว) ให้เปลี่ยน**สีแบรนด์ในบริบทนั้น**
> อย่าเปลี่ยนสีสถานะ — ผู้อ่านตีความเขียวว่าผ่านไปแล้วก่อนอ่านข้อความ

## วิธีตรวจก่อนใช้

1. เนื้อความและ `text_muted` บนพื้นขาวและพื้น `brand_tint` ≥ 4.5:1 · `brand_deep` (H2 และหัวตาราง) บนพื้นขาวและ `brand_tint` ≥ 7:1 · `brand` (H1 16pt ตัวหนา และตัวเลข KPI นับเป็นตัวใหญ่) ≥ 3:1
2. พิมพ์ขาวดำแล้วยังแยกหัวข้อกับเนื้อความออก
3. เปิดไฟล์ที่เรนเดอร์แล้วดูด้วยตา ไม่ใช่เชื่อค่าในตาราง

## โทนที่เสนอตามเนื้องาน (ใช้เมื่อไม่มีสีแบรนด์ให้ยึด)

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |

ถ้าลูกค้ามีแบรนด์อยู่แล้ว ให้ใช้สีแบรนด์ ตารางนี้ใช้เฉพาะตอนไม่มีอะไรให้ยึด


## reference: thai-fonts.md

# ฟอนต์และภาษาไทย — รายละเอียด

กฎที่ห้ามพลาดย่อไว้ใน `SKILL.md`

ใช้ **Tahoma** เป็นค่าเริ่มต้น: มีทุกเครื่อง Windows/Office · วรรณยุกต์ไม่ชนสระ ·
bold อ่านออกชัด · ความสูง x-height ไทยกับอังกฤษใกล้เคียงกัน

> 🚨 **กับดัก complex script:** Word ถือว่าภาษาไทยเป็น *complex script* คนละชุดกับ latin
> ถ้าตั้งแค่ `run.font.size` / `run.font.bold` ตัวอักษรไทยจะ **ไม่เปลี่ยนตาม**
> ต้องตั้ง `w:szCs`, `w:bCs`, `w:iCs` และ `w:rFonts` ให้ครบทั้ง `ascii/hAnsi/cs/eastAsia`
> ฟังก์ชัน `style_run()` ใน `brandkit.py` จัดการให้แล้ว **ห้ามตั้งฟอนต์เองด้วยมือ**

> 🚨 **กับดักฟอนต์คู่:** ถ้าใช้ฟอนต์ละตินกับฟอนต์ไทยคนละตัว เช่น Noto Sans + Noto Sans Thai
> การตั้งช่อง `cs` อย่างเดียวไม่พอ Word จะวาดตัวไทยด้วยฟอนต์ช่องละตินถ้าฟอนต์นั้นมีตัวไทย ถ้าไม่มีจะตกไปใช้ Browallia New แบบเงียบ ๆ
> ให้ตั้ง `bk.FONT` (ไทย) กับ `bk.LATIN_FONT` (ละติน) แล้วเรียก `bk.thai_runs(doc.element.body)` กับทุก header และ footer ก่อน `save()`
> ฟังก์ชันนี้แยกข้อความไทยออกเป็น run ของตัวเอง และตั้งทั้ง 4 ช่องเป็นฟอนต์ไทย
> ฟอนต์ที่ไม่ได้มีทุกเครื่องให้เรียก `bk.embed_fonts(doc)` เพื่อฝังฟอนต์ในไฟล์ ซึ่งทำได้เฉพาะฟอนต์ที่สัญญาอนุญาตยอมให้ฝัง เช่น OFL แต่ไฟล์จะใหญ่ขึ้นหลาย MB
> ฟอนต์ variable เช่น Cascadia Mono จะกลายเป็น Calibri เมื่อ Word export เป็น PDF ให้ใช้ Consolas กับโค้ด

กฎอื่นสำหรับเอกสารไทย:

- ระยะบรรทัด **1.3–1.35** สำหรับ Tahoma (อังกฤษล้วนใช้ 1.15 ได้ แต่ไทยมีวรรณยุกต์และสระบน–ล่าง ต้องเว้นที่) · ฟอนต์ตระกูล Noto มีความสูงบรรทัดในตัว 1.36–1.51 em จึงใช้ **1.1–1.15** ก็ได้ระยะเท่ากัน — ตัดสินจากหน้า PDF จริง ไม่ใช่จากตัวเลข
- **ห้ามจัดชิดขอบ 2 ด้าน (justify)** กับย่อหน้าไทย เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดคำจนเป็นรู
- LibreOffice ตัดคำไทยไม่เหมือน Word ถ้าจะส่ง PDF ให้ export จาก Word จริง
  หรืออย่างน้อยเปิด PDF ตรวจด้วยตาก่อนส่ง
- สร้าง PDF บน Linux ที่ไม่มี Tahoma ให้ใช้ **Loma** หรือ **Sarabun** แทน
  (ReportLab จัดวรรณยุกต์ไทยผิด ให้ใช้ python-docx→LibreOffice หรือ WeasyPrint แทน)
- เวลา preview บน Linux ตัวอักษรไทยจะดู **เล็กกว่า** latin เพราะฟอนต์แทนที่มี x-height ต่ำกว่า
  ไม่ใช่บั๊กของขนาดฟอนต์ บน Windows ที่มี Tahoma จริงจะสูงเท่ากัน จึงให้ตรวจรอบสุดท้ายจาก Word


## reference: tokens-and-type.md

# Design tokens · สเกลตัวอักษร · องค์ประกอบที่ใช้ซ้ำ

สารบัญ: tokens → ความหมายของสี → สเกลตัวอักษร → องค์ประกอบที่ใช้ซ้ำ

ตารางนี้กำหนด**หน้าที่**ของแต่ละ token ไม่ได้กำหนดค่าสี
ค่าจริงมาจากข้อ 0 แล้วตั้งครั้งเดียวด้วย `use_brand(...)`

| Token | หน้าที่ | ได้มาจาก |
|-------|---------|----------|
| `brand` | หัวข้อ H1 · ตัวเลข KPI · แถบ accent · ลิงก์ (ถ้า `brand` ต่ำกว่า 4.5:1 บนพื้นขาว ใช้ `brand_deep` กับลิงก์) | สีแบรนด์ (ไม่มี → ค่าประจำบ้าน + `(รอยืนยัน)`) |
| `brand_2` | accent รอง · ขีดใต้หัวข้อสไลด์ · ปลายไล่สี | เพื่อนบ้านของสีหลักบนวงล้อสี |
| `brand_deep` | หัวข้อ H2 · ตัวอักษรหัวตาราง | สีหลักผสมดำ ให้ contrast ≥ 7:1 บนพื้นขาว |
| `brand_tint` | พื้นหัวตาราง · การ์ด KPI · พื้นหน้าปก | สีหลักผสมขาวประมาณ 90% |
| `brand_tint_2` | แถวสลับ (zebra) ในตารางยาว | สีหลักผสมขาวประมาณ 96% |
| `text` | หัวข้อ H3 · ข้อความเน้น | เทาเข้มอมโทนเดียวกับสีหลัก |
| `text_body` | เนื้อความทั้งหมด | เทาเข้มอ่อนกว่า `text` 1 ขั้น **ไม่ใช่ดำสนิท เพราะดำสนิทล้าตา** |
| `text_muted` | คำบรรยายรูป · meta · footer | เทากลาง contrast ≥ 4.5:1 บนพื้นขาวและ `brand_tint` |
| `line` | เส้นตาราง เส้นคั่น | เทาอ่อนมาก เห็นได้แต่ไม่แย่งสายตา |

**สีสถานะ 6 ตัว** (แต่ละตัวมีคู่สีพื้นกับสีตัวอักษร): สำเร็จ · ข้อมูล · เตือน · ผิดพลาด · เน้น · เป็นกลาง
สีสถานะ**ไม่เปลี่ยนตามแบรนด์** เพราะเขียวคือผ่าน แดงคือไม่ผ่าน ในทุกเอกสาร
พื้นคือเฉดอ่อนมาก ตัวอักษรคือเฉดเข้มของสีเดียวกัน ให้ contrast ≥ 4.5:1

**ความหมายของแต่ละสี — เลือกสีตามความหมายเสมอ** (เหมือนกันทั้งเอกสารและไดอะแกรม)

| สี | หมายความว่า | ใช้กับ (callout / pill / กล่อง / เส้นในรูป) |
|---|---|---|
| 🔴 แดง | อันตราย · ห้าม · ลบทิ้ง · ผิดพลาด · เลยกำหนด | `critical` · สถานะ "ค้าง/ล้มเหลว" · ขั้นที่ทำลายข้อมูล · เส้นที่พัง |
| 🟠 เหลือง/ส้ม | ระวัง · รอดำเนินการ · ข้อแม้ · ทางที่ไม่ใช่เส้นหลัก | `warning` · สถานะ "กำลังทำ" · โซน/เส้นข้อยกเว้น (`#C77A11`) |
| 🟢 เขียว | สำเร็จ · ผ่าน · ปลอดภัย · เสร็จแล้ว | `success` · สถานะ "เสร็จ" · ผลลัพธ์ที่ยืนยันแล้ว |
| 🔵 สีหลัก (สีแบรนด์ ไม่มีแบรนด์ใช้น้ำเงินประจำบ้าน) | ข้อมูล · การกระทำหลัก · เส้นทางปกติ | `tip` · ปุ่มหลัก · กล่อง/เส้นเส้นทางหลัก |
| 🟣 ม่วง | คำถาม · ทางเลือก · หมายเหตุเสริม | `question` · ของเสริมที่ไม่บังคับ |
| ⚪ เทา | เป็นกลาง · ปิดใช้งาน · ของภายนอก | `note` · ระบบภายนอก · ส่วนที่ปิดอยู่ |

กฎเดียว: **เลือกสีตามความหมาย ไม่ใช่ตามความสวย** อย่าใช้แดงเพราะอยากให้เด่น ใช้แดงเฉพาะเมื่ออันตรายหรือผิดจริง และไดอะแกรมก็ใช้ชุดความหมายเดียวกันนี้ (ดู `software-diagrams` · `diagram-figures` ที่มี `EXCEPT_HUE` ส้มสำหรับทางที่ไม่ผ่านเส้นหลัก)

> **เกณฑ์ที่ต้องผ่านทุกชุดสี:** เนื้อความและ `text_muted` บนพื้น ≥ 4.5:1 · H2 และหัวตาราง (`brand_deep`) ≥ 7:1 ·
> H1 และตัวเลข KPI (`brand` ตัวใหญ่ ตามนิยามตัวใหญ่ของ WCAG 2.2 ข้อ 1.4.3) ≥ 3:1 ·
> พิมพ์ขาวดำแล้วยังแยกลำดับชั้นออก ถ้าไม่ผ่านให้ปรับความเข้ม ไม่เปลี่ยนสี
>
> **ตัวอย่างชุดสีที่เคยใช้จริง** (ไม่ใช่ค่ามาตรฐาน อย่าคัดลอกไปใช้โดยไม่ดูเนื้องาน) → `references/palette-examples.md`

> 💡 **เปลี่ยนแบรนด์ทั้งชุดในบรรทัดเดียว:**
> `use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")`

## สเกลตัวอักษร (pt)

| ระดับ | Word | Slide | น้ำหนัก · สี |
|-------|------|-------|--------------|
| ชื่อบนปก | 20 | 40 | bold · `brand` (Word) / `brand_deep` (สไลด์) |
| H1 | 16 | 26 | bold · `brand` |
| H2 | 12.5 | — | bold · `brand_deep` |
| H3 | 11.5 | — | bold · `text` |
| เนื้อความ | 11 | 17 | regular · `text_body` |
| ตาราง | 11 | 12.5 | regular · `text_body` |
| คำบรรยาย/footer | 8.5–9 | 10–12 | italic หรือ regular · `text_muted` |

**อย่าเพิ่มขนาดนอกสเกลนี้** เพราะทุกขนาดที่เพิ่มทำให้เอกสารดูไม่สม่ำเสมอ และคนอ่านสังเกตเห็น

## องค์ประกอบที่ใช้ซ้ำ (จากข้อ 4)

| องค์ประกอบ | หน้าตา | เมธอด |
|-----------|--------|-------|
| หน้าปก | โลโก้ + ชื่อสีแบรนด์ กลางหน้า | `cover()` |
| ตาราง | หัวพื้น `brand_tint` ตัวอักษร `brand_deep` · เส้นแบรนด์ 1.5pt ใต้แถวหัว · เส้นระหว่างแถว `line` 0.5pt · หัวซ้ำทุกหน้า | `table()` |
| ตารางสถานะ | คอลัมน์สถานะย้อมสีตามค่า | `pill_table()` |
| แถบตัวเลขสรุป | การ์ดพื้น `brand_tint` ตัวเลขใหญ่สีแบรนด์ + ป้ายเทาเล็ก | `kpi_row()` |
| กล่องข้อความ | พื้นสีอ่อน + แถบสีหนาด้านซ้าย + อีโมจิ 1 ตัว | `callout()` |
| รูปพร้อมคำบรรยาย | รูปกลางหน้า + "รูปที่ N — ..." เอียงเทาใต้รูป | `figure()` |
| บล็อกโค้ด | พื้นเทาอ่อน ฟอนต์ Consolas 9pt | `code()` |
| ตารางเซ็น | บทบาท / ชื่อ / ลายเซ็น / วันที่ | `signoff()` |

**สัดส่วนที่พอดี:** callout ไม่เกิน 3–5 กล่องต่อ 10 หน้า · แถบตัวเลขสรุป (KPI strip) 3–5 ช่อง (ตั้งแต่ 6 ช่อง ตัวเลขจะเล็กจนไม่เด่น) ·
ตารางเกิน 6 คอลัมน์ให้เปลี่ยนเป็นหน้าแนวนอน (`landscape_section()`)


## reference: visual-check.md

# ตรวจเอกสารด้วยตา — คำสั่งและรายการตรวจ

```bash
soffice --headless --convert-to pdf --outdir _to_delete/preview SRS.docx
pdftoppm -png -r 80 _to_delete/preview/SRS.pdf _to_delete/preview/page      # ได้ page-1.png หรือ page-01.png (เลขเติมศูนย์ตามจำนวนหน้าทั้งหมด)
```

แล้ว **เปิดภาพดูจริงทุกหน้า** (Read tool) ก่อนส่งมอบ ตรวจตามนี้:

- [ ] ไม่มีตารางล้นขอบกระดาษ คอลัมน์กว้างพอดี ไม่มีคำถูกบีบขึ้นบรรทัดใหม่แปลก ๆ
- [ ] ไม่มีหัวข้อค้างอยู่บรรทัดสุดท้ายของหน้า
- [ ] วรรณยุกต์/สระไทยไม่ชนกัน และไม่มีตัวอักษรกลายเป็นกล่องสี่เหลี่ยม
- [ ] หน้าปกไม่มีข้อความล้นหรือตกขอบ · **หน้า 2 ไม่ว่าง** (ปกเต็มหน้าแล้วย่อหน้าตัวแบ่งหน้าตกไปหน้า 2 — `cover()` ใส่ตัวแบ่งไว้ท้ายย่อหน้าสุดท้ายแล้ว ถ้าเขียนปกเองต้องทำแบบเดียวกัน)
- [ ] ช่องไฟก่อน/หลังตารางและ callout เท่ากันทั้งเอกสาร
- [ ] footer เลขหน้าครบทุกหน้า
- [ ] ไม่มี TBD / Lorem ipsum / placeholder หลงเหลือ (ยกเว้น `(รอยืนยัน)` ที่อยู่ในรายการรอยืนยันของรายงาน)


## reference: word-layout.md

# ปกเข้มและหัวตาราง — รายละเอียดจากงานจริง

อ่านเมื่อทำปกแบบเข้ม หรือปรับหัวตารางในหน้าใน · กฎย่อที่ต้องใช้ทุกครั้งอยู่ใน `SKILL.md` ข้อ 3

## แบบปกเข้ม

**แบบปกเข้ม (เมื่อแอปหรือแบรนด์ใช้หน้าจอสีเข้ม):** ปกเต็มหน้าสีเทาเข้มเกือบดำแบบกลาง ๆ (เช่น `#1C1C22`) มีแสงเรืองสีแบรนด์จางมาก (ไม่เกิน 15%) — แสงม่วงเข้มเต็มมุมทำให้ปกดูเป็นสีม่วง เจ้าของงานขอกลับเป็นเทาเข้ม ·
ชื่อเอกสาร ชื่อรอง และเส้นใต้ชื่อ วาง**ชิดใต้โลโก้** ไม่ใช่กลางหรือล่างหน้า ส่วนตารางข้อมูลเอกสารอยู่ค่อนไปทางล่าง ·
โลโก้แบบตัวอักษรสว่าง (light-on-dark) มุมซ้ายบน · ชื่อเอกสาร 28–32pt · ตารางข้อมูลเอกสาร 4 ช่อง
(รหัสเอกสาร · เวอร์ชัน · วันที่ · สถานะ) · หน้าในเป็นพื้นขาว บล็อกโค้ดสีเข้ม header มีโลโก้เล็ก ชื่อเอกสาร และรหัสเอกสาร
footer มีชื่อระบบกับ "หน้า / ทั้งหมด" — สีเข้มอยู่ที่ปกหน้าเดียว จึงยังพิมพ์ได้ ขนาดชื่อเอกสารบนปกแบบนี้เกินสเกลข้อ 1 ได้
โลโก้บนปกใช้**ขนาดเล็ก (กว้างราว 4.5 ซม.) มุมซ้ายบน เหนือชื่อเอกสาร** — เคยลองขยายสัญลักษณ์เป็นภาพหลักกลางปก เจ้าของงานขอกลับเป็นขนาดเล็ก
ถ้าต้องการลูกเล่น ให้ลากแสงสีของโลโก้เป็นเส้นยาวเท่าแนวข้อความ (เว้นขอบซ้ายขวาเท่าระยะขอบกระดาษ — เส้นที่ชนขอบกระดาษถูกขอให้เว้นขอบ) เป็นแท่งหนาสม่ำเสมอ **ปลายตัดตรง มุมมนเล็กน้อย** (หนาราว 0.7 มม. มุมราว 0.25 มม.) — ปลายเรียวแหลมถูกทักว่าแหลมไป · แสงเรืองต้องจางเป็นศูนย์ก่อนถึงขอบภาพ ไม่อย่างนั้นจะเห็นขอบกล่องของภาพ แทนเส้นใต้ชื่อเอกสาร (ยึดภาพเส้นกับย่อหน้าใต้ชื่อ เพื่อให้ตามได้ทั้งชื่อ 1 และ 2 บรรทัด) · เส้นต้องเป็น**ภาพเดียวต่อเนื่อง** ความหนาและแสงเท่ากันตลอด ไล่สีแบบ smoothstep ปลายสองข้างจางลงนุ่ม ๆ และวาดที่ 300 dpi — ห้ามวางแถบสั้นซ้อนบนเส้นยาว เพราะจะเห็นเป็นก้อนหนาที่สีไม่ต่อกัน (เจ้าของงานทักว่า "เส้นสีไม่ smooth")
> 🚨 **ภาพพื้นปกและโลโก้บนปก ห้ามวางใน header ของหน้าแรก** — Word แสดงทุกอย่างใน header เป็นสีจางระหว่างอ่านหรือแก้ตัวเอกสาร ปกเข้มทั้งหน้าจึงดูซีด (ใน PDF ไม่จาง จึงตรวจจาก PDF อย่างเดียวไม่เจอ — เจ้าของงานทักว่า "ดูซีด ๆ") ให้ยึดภาพแบบลอยหลังข้อความไว้กับย่อหน้าแรกของปกแทน และตั้ง `relativeHeight` แบบที่ Word ใช้ (ภาพพื้น 251658240 · ภาพที่อยู่เหนือขึ้นไปเพิ่มทีละ 1024) เพราะ Word จะเรียงเลขน้อย ๆ อย่าง 1, 2, 3 ใหม่ตอนบันทึก แล้วภาพพื้นจะทับโลโก้

ตัวหนังสือเล็กบนปกเข้ม (ป้ายกำกับ ข้อมูลผู้เขียน หมายเหตุ) ใช้ขนาด**อย่างน้อย 8.5pt** และสีเทาอ่อน `#CFCCDE` ขึ้นไป ชื่อรองใช้สีอ่อนเกือบขาว — ตัว 7.5pt สีเทากลางบนพื้นเข้มดูจาง

**ใช้ในโค้ด:** `doc.cover(title, subtitle=..., eyebrow=..., meta_rows=[...], logo="logo.png", style="night")` — โลโก้ไม่บังคับ · สีเส้นแสงปรับได้ด้วย `art_colors=(สี1, สี2, สี3)` · หน้าตาที่ได้: `examples/example_srs-preview.png` (ปก + หน้าใน) · ตัวอย่างเรียก: `scripts/example_srs.py` · `table()` ใช้หัวตารางแบบนี้เป็นค่าเริ่มต้น (`header_style="classic"` = แบบเดิม)

## หัวตารางในหน้าใน

**หัวตารางในหน้าใน ห้ามใช้พื้นสีเข้มเต็มแถบ** แม้ปกจะสีเข้มก็ตาม เพราะตารางมีทุกหน้า สีเข้มจึงหนักตาและเปลืองหมึก (เจ้าของงานขอเปลี่ยนจริงในงานหนึ่ง)
ให้ใช้พื้นอ่อนของสีแบรนด์ที่ยังเห็นชัดว่าเป็นแถวหัว เช่น `#E4DCFD` (พื้นที่อ่อนกว่านี้อย่าง `#F5F3FF` เจ้าของงานบอกว่าจางไป) ตัวหนังสือสีเข้มของแบรนด์ตัวหนา
เส้นขอบมีเส้นเดียว คือเส้นสีแบรนด์ 1.5pt ใต้แถวหัว ไม่มีเส้นด้านบน (เส้นดำด้านบนดูหนักและถูกขอให้ปรับ) และไม่เว้นช่องขาวระหว่างช่องหัว เพราะจะทำให้เส้นใต้หัวขาดเป็นช่วง
Word วาดเส้นขอบไล่สีไม่ได้ ถ้าใส่ไล่สี สีจะเปลี่ยนเป็นช่วงตามคอลัมน์

## โครงหน้าเอกสาร (ย้ายมาจาก `SKILL.md` ข้อ 3 — ไม่แก้ถ้อยคำ)

```
หน้าปก        โลโก้กลาง → ชื่อเอกสาร (brand, bold) → ชื่อระบบ (text, bold)
              → บรรทัดเวอร์ชัน/วันที่ (9pt) → หมายเหตุการแก้ไข (8pt เอียง เทา)
              → ขึ้นหน้าใหม่
สารบัญ        field TOC (ผู้ใช้กด F9 อัปเดต) → ขึ้นหน้าใหม่
เนื้อหา        H1 มีเลขข้อเสมอ ("1. ภาพรวมระบบ") · H2 เป็น "1.1"
              ทุก H1/H2/H3 ตั้ง keep-with-next กันหัวข้อค้างท้ายหน้า
ท้ายเอกสาร    ตารางลงนามอนุมัติ
footer        "หน้า N" กลางหน้า สีเทา 9pt
```

## รูปในเอกสาร · กฎด่านสวย · ปก (ย้ายมาจาก SKILL.md §0.1 ข้อ 6–8)

6. **รูปในเอกสาร:** ตัวอักษรเล็กสุดหลังวางจริง ≥ 7pt → พิกเซลขั้นต่ำบนผ้าใบ = `0.247 × ความกว้างผ้าใบ(px) ÷ ความกว้างที่วาง(ซม.)` (ผ้าใบ 2000px วางกว้าง 17 ซม. = 29px · วางบนหน้าแนวนอน 25.7 ซม. = 20px · ใช้ 26px ให้ได้ 9pt) · รูปกว้างให้วางหน้าแนวนอนเต็มความกว้างคอลัมน์ (≥ 95%) · ใช้**ฉบับวางในเอกสารที่ไม่มีหัวรูป** เพราะคำบรรยายใน Word บอกเลขและชื่อรูปแล้ว · คำบรรยายรูป ≥ 9pt สีเนื้อความ · หลังรูปขึ้น section ใหม่ ห้ามย่อหน้าถัดไปไหลมาหน้ารูป
7. **สิ่งที่ด่านสวยจับได้บ่อย (ใส่เป็นกฎใน `check` ของตัว render):** เครื่องหมาย markdown หลุด (`**` · backtick) · ข้อความไทยในฟอนต์ mono · ตารางล้นคอลัมน์ข้อความ · สารบัญเหลือรายการเดียวตกหน้าถัดไป · รายการรหัสถูกตัดกลางรหัส (ให้บรรทัดละ 1 รหัส ฟอนต์เดียวทั้งคอลัมน์) · ป้าย "(รอยืนยัน)" ใช้สีเตือน ไม่ใช่สีแบรนด์ · ตัวตนหายหลังหน้าปก (หน้าเปิดบทใช้แถบสีแบรนด์ของแอป) · มีปกสว่างไว้พิมพ์คู่กับปกมืด
8. **ปก — ตัวอักษรล้วนก่อน ภาพทีหลัง** (ปกเฉพาะโปรเจกต์ที่ใช้รูปทรงโลโก้หรือหน้าจอจริง แทนภาพตกแต่ง → `doc-cover-design` (plugin `software-company`))**:** ภาพประกอบบนปกไม่บังคับ และปกโล่งที่จัดตัวอักษรดีชนะภาพที่ไม่ว้าวเสมอ · แบบที่ผ่านด่าน: ชนิดเอกสาร (SRS · FSD · ARCH) ตัวใหญ่ 150–200px สีแบรนด์เป็นจุดเด่นเดียว (กว้างไม่เกิน ~85% ของคอลัมน์ · ชื่อเกิน 5 ตัวอย่าง TESTPLAN แยก 2 บรรทัด ไม่ย่อจนเล็กกว่าฉบับอื่น — ทั้งชุดต้องดูขนาดเท่ากัน) → เส้นสั้นสีแบรนด์ → ชื่อไทย → ชื่ออังกฤษ → บรรทัดสรุป 1 ประโยค (≥ 12pt คอลัมน์แคบ) → แถวข้อมูลท้ายหน้า (ป้าย ≥ 10pt) · ที่เหลือปล่อยว่าง · ส่วนที่ตำแหน่งตายตัว (โลโก้ · ชนิดเอกสาร · เส้น · ป้ายสถานะ) วาดลงภาพพื้นปก ส่วนชื่อและข้อมูลเป็นข้อความ Word ให้ค้นและแก้ได้ · ป้าย `(รอยืนยัน)` บนพื้นมืดใช้สีเตือนแบบสว่าง ไม่ใส่พื้นไฮไลต์ · **ผู้ใช้บอกปกไม่สวย → ตัดภาพตกแต่งออกก่อน** (เส้นโค้ง จุดเรือง gradient) แล้วทำปกตัวอักษรล้วน 3 แนวให้เลือก (โปรเจกต์มีโลโก้หรือ mockup → ใช้ `doc-cover-design` ข้อ 7 แทน)
