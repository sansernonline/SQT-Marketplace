---
name: polished-document-style
description: Use when a kept doc (report, proposal, Word, PDF) needs headings, tables, theme. Wording → human-writing · designed look → branded-document-design.
---

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
