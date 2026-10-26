# skill: polished-document-style

Use when writing or tidying a document people keep (report, proposal, Word, PDF) — headings, tables, Thai. Designed look → branded-document-design.

# Polished Document Style

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

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
| [references/theme-colors.md](references/theme-colors.md) | ถ้าต้องใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์ ให้เปิดดูว่าใครคุมสีส่วนไหน และค่าสีตั้งต้นประจำบ้านคืออะไร |

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

เอกสาร 1 ฉบับผ่านหลาย skill: markdown (skill นี้) · รูปจาก `diagram-figures` ·
ไฟล์ .docx จาก `branded-document-design` · สไลด์จาก `presentation-design` (ทั้งสามอยู่ใน plugin `software-company`)
ถ้าแต่ละตัวเลือกสีเอง ผู้อ่านจะได้เอกสารที่รูปสีหนึ่ง หัวข้อสีหนึ่ง และสไลด์อีกสีหนึ่ง

**markdown เป็นต้นฉบับหลัก (source of truth) จึงประกาศธีมไว้ที่นี่** — ใส่ไว้ท้ายส่วนหัวของเอกสารหรือในไฟล์ข้างกัน:

```markdown
<!-- doc-theme: accent=<สีหลัก> · ที่มา=<แบรนด์ลูกค้า / เสนอจากเนื้องาน> · ยืนยันเมื่อ=YYYY-MM-DD -->
```

**สีหลักมาจากเนื้องาน ไม่ใช่จากค่าเริ่มต้นของเครื่องมือ**
ถ้ามีสีแบรนด์อยู่แล้วให้ใช้สีนั้น ถ้ายังไม่มีให้ใช้ค่าตั้งต้นประจำบ้าน เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนที่เข้ากับเนื้องานไว้ในรายงาน
(ตารางจับคู่เนื้องานกับโทนสีอยู่ใน `colour-by-domain` ของ skill `diagram-figures` (plugin `software-company`))

markdown เองไม่มีสี จึงใช้คำกำกับและน้ำหนักตัวอักษรแทน ส่วนไดอะแกรม รูป ไฟล์ .docx และสไลด์อ่านค่าจาก `doc-theme` ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ให้ใช้ค่าตั้งต้นประจำบ้าน ตารางทั้งสองอยู่ใน [references/theme-colors.md](references/theme-colors.md)

**คำสถานะไม่ขึ้นกับธีม** — วิกฤต · ผ่าน ใช้คำเดิมทุกเอกสาร ส่วนสีของสถานะในรูป .docx และสไลด์อยู่ใน [references/theme-colors.md](references/theme-colors.md)

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

ใช้กับไฟล์ Word · Excel · PDF ทุกไฟล์ที่มีภาษาไทย จะสร้างด้วยสคริปต์หรือทำมือก็ตาม รายละเอียดและตัวช่วยอยู่ใน `branded-document-design`

- Word นับภาษาไทยเป็น complex script จึงมีช่องฟอนต์ ขนาด และตัวหนาแยกจากละติน ถ้าตั้งแค่ช่องละติน ข้อความไทยจะไม่เปลี่ยน ต้องตั้งให้ครบทั้งสองชุด
- ย่อหน้าไทยไม่จัดชิดสองขอบ (justify) เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดช่องไฟจนเป็นรู (ยกเว้นคู่มือวิทยานิพนธ์สั่ง Thai Distributed)
- ข้อความไทยห้ามใช้ฟอนต์ mono เพราะ Consolas กับ Cascadia ไม่มีอักษรไทย ใช้ mono กับรหัส คีย์ และตัวเลขเท่านั้น
- ส่งออก PDF ให้ฝังฟอนต์ทุกครั้ง ไม่งั้นเครื่องที่ไม่มีฟอนต์จะเอาตัวอื่นมาแทนและวรรณยุกต์ลอย
- CSV ที่ให้คนไทยเปิดใน Excel บันทึกเป็น UTF-8 แบบมี BOM ไม่งั้นภาษาไทยเพี้ยน
- ก่อนบอกว่าเสร็จ แปลงทุกหน้าเป็นภาพแล้วเปิดดูจริง ตารางล้น หัวข้อค้างท้ายหน้า วรรณยุกต์ลอย ดูจากโค้ดไม่เห็น

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

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


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


## reference: theme-colors.md

# ตารางสีของธีมเอกสาร

ไฟล์นี้บอกว่าส่วนไหนของเอกสารใครเป็นคนคุมสี และค่าสีตั้งต้นประจำบ้านคืออะไร ใช้ตอนต้องใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์

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

# skill: diagram-figures

Use when a document, plan, proposal, slide or print (business plan, shop process, budget flow, research, software spec) needs a designed diagram.

> **สีหลักของรูป = สีหลักของโปรเจกต์** · หาตามลำดับในข้อ 5 ถ้าหาไม่เจอเลยจึงใช้ชุดสีประจำบ้าน `#2A78D6` ใน `polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน")

# Diagram Figures

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

skill นี้คือ house style เดียวของรูปที่ต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" มี 3 engine ซึ่งใช้สี ไอคอน และกติกาชุดเดียวกัน

## เลือกทาง

| ต้องการ | ไปที่ |
|---|---|
| รูปในเอกสารงานใดก็ได้ (แผนธุรกิจ · ผังขั้นตอนของร้าน · ผังเงินครอบครัว · สรุปงานวิจัย · เอกสารซอฟต์แวร์ เช่น เอกสารความต้องการทางธุรกิจ (Business Requirements Document — BRD) · ข้อกำหนดความต้องการซอฟต์แวร์ (Software Requirements Specification — SRS) · ผังความสัมพันธ์ข้อมูล (Entity-Relationship — ER)) และรูปที่ต้องดูออกแบบมา สำหรับข้อเสนอลูกค้า · สไลด์ · งานพิมพ์ · เอกสารเซ็นรับ รวมถึงผังคลาวด์ที่ต้องมีโลโก้จริง | **skill นี้ — HTML layout engine** (ค่าเริ่มต้น · ข้อ 2) |
| รูปแบบเดียวกัน แต่ต้อง generate จากข้อมูลหรือโค้ด เช่น ออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือต้องคุมพิกัดบนกริดเอง | **skill นี้ — SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| บล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) ที่ต้องส่งในไฟล์ Word หรือ Portable Document Format (PDF) ให้หน้าตาเหมือนรูปวาดมือ | **skill นี้ — Mermaid engine** ([references/engine-mermaid.md](references/engine-mermaid.md)) |
| ไดอะแกรมด่วนใน README · Pull Request · โน้ตในโค้ด (ไม่ใช่เอกสารโปรเจกต์) | `software-diagrams` (plugin `software-company`) (Mermaid ธีมประจำบ้าน · ถ้าเป็นผังคลาวด์ใน repo ที่ต้องมีโลโก้ ใช้ไลบรารี `diagrams` ใน skill เดียวกัน) |
| ตัดสินใจว่าจะฝังรูปในไฟล์ markdown แบบไหน (inline SVG · ไฟล์ภาพ · ASCII · Mermaid) | [`markdown-visuals`](../markdown-visuals/SKILL.md) |

**กติกาเลือกทาง (ตรงกับ `software-diagrams` และ `markdown-visuals`):** markdown ใน repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) → Mermaid ผ่าน `software-diagrams` · เอกสารโปรเจกต์ (BRD · SRS · Functional Specification Document (FSD) · Architecture Decision Record (ADR) · ER · ผังขั้นตอน) หรือของที่คนนอกทีมอ่าน → skill นี้

ต้นทุนของ skill นี้คือ **เวลา** เพราะ 1 รูปต้องแก้หลายรอบ
ดังนั้นให้ใช้กับรูปที่คนนอกทีมจะเห็น และเห็นซ้ำหลายครั้งเท่านั้น

## 1 · ตอบสามข้อก่อนเปิดไฟล์

1. **รูปนี้ไปอยู่ที่ไหน** — สไลด์ 16:9 · หน้า A4 · หน้าจอ
   แล้วกำหนด `.sheet{width:...}` ตามนั้น: สไลด์ 1600px · A4 แนวตั้ง 1240px · A4 แนวนอน 1750px
2. **ผู้อ่านคือใคร** — ถ้าเป็นลูกค้าที่ไม่ใช่ช่าง ให้เขียนชื่อกล่องเป็นภาษาไทย ส่วนทีมเทคนิคอ่านชื่อจริงของ service
3. **คำถามเดียวที่รูปนี้ตอบคืออะไร** — 1 รูปตอบ 1 คำถาม (กฎเดียวกับ `software-diagrams` (plugin `software-company`))

## 2 · เลือกโครง

มี 4 โครงในโฟลเดอร์ `assets/` ให้**คัดลอกไปแก้ อย่าเริ่มเขียนเอง** ส่วนรายละเอียดของแต่ละโครงอยู่ในไฟล์ที่ลิงก์ไว้

| คำถามที่รูปตอบ | โครง | รายละเอียด |
|---|---|---|
| "ระบบ ร้าน หรือองค์กรนี้คุยกับใครข้างนอกบ้าง" — ภาพรวมระดับบนสุด (ซอฟต์แวร์เรียก C4 model (Context · Containers · Components · Code) ระดับ 1) | [`figure-context.html`](assets/figure-context.html) | [layout-context.md](references/layout-context.md) |
| "ของจริงอยู่ตรงไหน มีอะไรอยู่ข้างใน" — ฝ่าย · สถานที่ · เครื่อง (ซอฟต์แวร์คือ deployment · container) | [`figure-template.html`](assets/figure-template.html) | [layout-deployment.md](references/layout-deployment.md) |
| "ใช้บริการอะไรของคลาวด์บ้าง" — ต้องมีโลโก้ Amazon Web Services (AWS) · Azure · Google Cloud ของจริง | [`figure-cloud.html`](assets/figure-cloud.html) | [layout-cloud.md](references/layout-cloud.md) |
| "ของ 1 ชิ้น (ข้อความ · คำสั่งซื้อ · เงิน) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" — ผังมีเลขลำดับ ①–⑥ · ผู้ใช้ → ช่องทาง → ชั้นภายใน → บริการภายนอกและข้อมูล | [`figure-flow.html`](assets/figure-flow.html) · [ตัวอย่าง](assets/figure-flow-example.png) | [layout-flow.md](references/layout-flow.md) |

ทุกโครงใช้สี ขนาด ฟอนต์ และสคริปต์ลากเส้นชุดเดียวกัน ต่างกันแค่การจัดวาง

## 3 · หัวรูปต้องมีครบหกอย่าง

โลโก้โปรเจกต์ · ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ

โลโก้อยู่หน้าชื่อรูป (`<img class="logo">` ชี้ไป `assets/logo/` ของโปรเจกต์ · ไม่มีโลโก้ให้จดไว้ในรายงานว่าขาด) · คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ · **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

เหตุผลเต็มกับตัวอย่าง ผิด/ถูก ของคำขยาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "หัวรูป" 

## 4 · ระบบขนาด

**ขนาด ระยะ และมุม อยู่ใน `:root` ของ `assets/figure-template.html` แล้ว อย่าตั้งค่าใหม่เอง**
ตัวเลขพวกนี้ปรับจนรูปดูตั้งใจแล้ว ถ้าขยับเมื่อไหร่ รูปในเอกสารเดียวกันจะดูไม่เท่ากัน

กรอบไอคอน 66px ขึ้นไป (ต่ำกว่า 56px รูปจะโหวง) · เส้นเชื่อมตั้งหรือนอนเท่านั้น หักมุมโค้ง ห้ามเส้นเฉียง

ตารางค่าเต็ม (ตัวอักษร · ไอคอน · กล่อง · `.focus` · เส้น · ระยะ) → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบขนาด" — เปิดเมื่อต้องปรับโครงหรือเขียนโครงใหม่

> **ขนาดตัวอักษรขึ้นกับที่ที่รูปจะไปวาง ไม่ใช่ผ้าใบ** — ตารางข้างบนเหมาะกับสไลด์และจอ · รูปที่จะวางในเอกสาร A4 ต้องคิดย้อนจากขนาดที่วาง: ตัวอักษรเล็กสุดหลังวาง ≥ 7 พอยต์ (point — pt) → `px ขั้นต่ำ = 0.247 × ความกว้างผ้าใบ(px) ÷ ความกว้างที่วาง(ซม.)` · ผ้าใบ 2000px บนหน้าแนวตั้ง 17 ซม. = 29px · บนหน้าแนวนอน 25.7 ซม. = 20px · ขยายฟอนต์แล้วกล่องต้องกว้างพอให้ชื่อไทยไม่ตัดกลางคำ
> **2 ฉบับจากไฟล์ต้นทางเดียว:** ฉบับเต็ม (มีหัวรูป 6 อย่าง · ใช้เปิดเดี่ยว/สไลด์) และฉบับวางในเอกสาร (`?embed=1` ซ่อนหัวรูป เพราะคำบรรยายของเอกสารบอกแล้ว — หัวซ้ำทำให้รูปเล็กลงและดูรก) · สัดส่วนรูปให้กว้างพอวางเต็มหน้าแนวนอน (กว้าง ÷ สูง ≥ 1.46)
> **รูปทั้งชุดใช้ CSS ไฟล์เดียว** (`figure-theme.css` ข้างไฟล์ต้นทาง) ที่ดึงสี ฟอนต์ และโลโก้จากตัวตนของโปรเจกต์ (`assets/logo/` · token ของ mockup) — แก้ที่เดียว รูปทุกใบเปลี่ยนตาม
> **ด่านสวยของรูป** ไปพร้อมด่านสวยของเอกสาร (`branded-document-design` ข้อ 0.1) — เส้นทางหลักเส้นทึบสีเด่น · เส้นรองเทา · มีคำอธิบายสัญลักษณ์ · ลำดับการไหลมีเลขเมื่อมีมากกว่า 3 ขั้น

## 5 · ระบบสี

**สีหลักของรูปคือสีหลักของโปรเจกต์ (หรือของร้าน ครอบครัว งานนั้น)** ห้ามใช้สีจากตัวอย่างหรือจากรูปอ้างอิง หาตามลำดับนี้ เจอที่ไหนหยุดที่นั่น:

1. `doc-theme` ในเอกสารของโปรเจกต์ (ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")
2. สีแบรนด์ที่โปรเจกต์ใช้จริง — ตัวแปรสีหลักในโค้ด (`--primary` · `--brand` · `--accent` ใน CSS · `primary` ใน Tailwind / ธีม UI · `colorPrimary` ในแอปมือถือ) · ชุดแบรนด์ (brand kit) · สีหลักในโลโก้
   ดูสีพื้นจากที่เดียวกันด้วย (`--background` · `--bg` · `background` ใน Tailwind · โหมดมืดหรือสว่างที่แอปใช้เป็นหลัก) เพราะรูปและเด็คใช้สีพื้นตามดีไซน์ของโปรเจกต์
3. ยังไม่มีเลย → ใช้ชุดสีประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · เสนอโทนจาก [references/colour-by-domain.md](references/colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

เจอสีจากข้อ 2 แล้วแต่ยังไม่มี `doc-theme` ให้ประกาศ `doc-theme` ด้วยค่านั้น เพื่อให้รูป เอกสาร และสไลด์ของโปรเจกต์ใช้สีเดียวกัน

ในโครง HTML แก้ที่ `--accent` ใน `:root` ที่เดียว (SVG/Python engine แก้ `ACCENT` ใน `theme.py`) · สีพื้นตามดีไซน์ของโปรเจกต์ → ต่อท้ายชื่อไฟล์ `#accent=<สีหลัก>&bg=<สีพื้น>` · ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์ (สีโลโก้ผู้ให้บริการ · เทาโครงสร้าง) และ**สีไอคอน 7 กลุ่ม** (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) พร้อมความหมาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบสี" — สีที่ 8 แปลว่าใช้สีเพื่อความสวย

**จำกัดจำนวนสี ไม่ได้จำกัดน้ำหนักของสี** — ในรูปที่ต้องดูออกแบบมา สีหลักต้องเห็นได้ทั่วทั้งรูป ไม่ได้อยู่แค่แถบหัว: ป้ายที่ต้องหาให้เจอเร็ว (เลขขั้น · ผู้รับผิดชอบ · สถานะ) ใช้พื้นทึบ · หัวการ์ดเป็นแถบพื้นสีทึบเต็มความกว้าง (ไม่ใช้แถบสีหนาข้างการ์ดมุมมน เพราะเป็นสัญญาณ AI ใน `no-ai-look`) · กล่องสรุปใช้พื้นสีเข้ม · สีพาสเทลใช้ได้แค่เป็นพื้นที่มีตัวหนังสือหรือขอบสีเข้มคู่กัน · ตรวจด้วยแกน "พลังของสี" ในด่านสวยของ `ui-craft` (`ui-craft/references/states-and-checks.md` (plugin `software-company`))

### 5.1 · รูปต้องมีจุดเด่น ไม่จืด

รูปที่อ่านออกแต่จืด = การ์ดขาวหน้าตาเท่ากันทุกใบ · เส้นบางเท่ากันทุกเส้น · ไม่มีอะไรดึงสายตา ผู้ใช้จะบอกว่า "ดีขึ้นแต่ไม่ว้าว" ทางที่ผ่านด่านสวยแล้ว:

| ชิ้น | ทำอย่างไร |
|---|---|
| ผ้าใบ | ใช้พื้นเดียวกับตัวตนของแอป — แอปพื้นมืดก็ใช้รูปพื้นมืดทั้งใบ (ไม่ใช่กรอบขาวล้อมภาพมืด) · ลายจุดตารางจาง ๆ ทึบไม่เกิน 8% ให้มีมิติ |
| เส้นทางหลัก | หนา 6px สีแบรนด์ + เรืองแสง (`filter: drop-shadow(0 0 8px <สีแบรนด์ 75%>)`) · เส้นรองบาง สีเทา ไม่เรือง — ต่างกันชัดจนไม่ต้องอ่านคำอธิบายสัญลักษณ์ |
| จุดเด่น | การ์ด `.focus` 1 ใบต่อรูป: ขอบสีแบรนด์ 3px + แสงรอบ + ไอคอนพื้นสีแบรนด์ · การ์ดอื่นพื้นกลืนกับผ้าใบ |
| ป้ายลำดับ | พื้นสีแบรนด์ ตัวอักษรสีพื้นผ้าใบ + แสงรอบเบา ๆ |
| คอนทราสต์ | ข้อความรองบนพื้นมืด ≥ 7:1 (เทาอ่อน ไม่ใช่เทากลาง) |
| ธีม | ทุกสีเป็นตัวแปรใน css ไฟล์เดียว · หัวลูกศรอ่านสีจากตัวแปร (`getComputedStyle`) ไม่ฝังค่าใน JavaScript (JS) · สีความหมาย (`t-app` `t-alert` `t-warn`) มีคู่สีของพื้นมืด · ห้ามใส่สีใน `style=""` ของไฟล์รูป |

**ลายจุดตาราง + เส้นเรืองแสง = house style ที่อนุมัติแล้ว** (ข้อยกเว้น "หน้าตาที่อนุมัติแล้วชนะเสมอ" ใน `no-ai-look`) · ตอนสแกนด้วย `slop_scan.py` ให้ติด `slop-ok` ที่ `grid-bg` และ `neon-glow` ของรูปเหล่านี้ พร้อมเหตุผลสั้น ๆ

**วิธีเลือกแนว:** เขียน 3 แนวเป็น css ทับ (override) ฉีดเข้ารูปจริง 2 รูปตอนเรนเดอร์ (`add_init_script` ก่อนสคริปต์วาดเส้นทำงาน) → วางเทียบกับรูปเดิม → ให้ผู้ตรวจที่ไม่ได้ทำให้คะแนน → แก้ theme css ไฟล์เดียวแล้วเรนเดอร์ทั้งชุด · รูปมืดในเอกสารหน้าขาวต้องเป็นการตัดสินใจที่จดไว้ (เช่น หน้าเปิดบทและปกก็มืด) ไม่ใช่เผลอ

## 6 · ไอคอน — ใช้ของทางการจากคลัง และวาดเองเฉพาะเมื่อไม่มี

**มีไอคอนทางการของบริการนั้นหรือไม่** เป็นตัวตัดสิน

- **ถ้ามี** (AWS · Azure · Google Cloud · Kubernetes · เครื่องมือโอเพนซอร์สส่วนใหญ่) ให้ใช้ของทางการจาก `assets/`
  คือ 205 ตัวที่คัดไว้ใน `assets/icons/` หรือคลังเต็มผ่าน `python assets/find-icon.py <ชื่อ>` ชุดเหล่านี้เผยแพร่มาเพื่อวาดผังสถาปัตยกรรมโดยเฉพาะ ส่วนรายการกลุ่ม คำสั่ง และสัญญาอนุญาตอยู่ใน [references/icons.md](references/icons.md)
- **ถ้าไม่มี** หรือเป็นของที่เราสร้างเอง ให้วาดไอคอนเส้นเอง แล้วเขียนที่เชิงอรรถว่า
  ไอคอนไม่ใช่โลโก้ทางการ (โครง `figure-template.html` มีบรรทัดนี้ให้แล้ว)
- **ห้ามปนกัน**ในรูปเดียว เพราะโลโก้สีจัดข้าง ๆ ไอคอนเส้นบางทำให้รูปดูไม่เสร็จ

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน · ต้องอ่านออกที่ 24px (รายละเอียดเกิน 3 เส้นกลายเป็นก้อนดำ)

## 7 · สายเชื่อม

**ในคอลัมน์เดียวกัน** ใช้ลูกศรลง `.down` · **ข้ามคอลัมน์** ใช้รายการ `WIRES` ท้ายไฟล์ (`{from, fs, to, ts, tp, label}`) ให้สคริปต์ลากหลังจัดหน้า — ห้ามเขียนพิกัดตายตัว

**กติกาที่ห้ามพลาด:**

- เส้นตั้งหรือนอนเท่านั้น หักมุมโค้งด้วย `elbow()` (ใช้ `mx` เมื่อหลายเส้นใช้ช่องเดียวกัน) · ห้ามเส้นเฉียง
- ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์ (ป้ายยาวขึ้น → เพิ่ม `gap` ของ `.stage`)
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป · ต่อเข้ากล่องเล็กที่สุดที่ถูกต้อง
- ป้ายบอกว่า**อะไรไหลผ่าน** (`HTTPS 443`) ไม่ใช่ `เชื่อมต่อ` · ไม่มีอะไรจะบอกไม่ต้องใส่ป้าย · เส้นที่ยังไม่ต่อจริงใช้ `planned:true` พร้อมเชิงอรรถ

ตัวอย่างโค้ด `WIRES` · ที่มาของแต่ละกติกา · `lp` · `tp` → [`references/wires.md`](references/wires.md) — เปิดเมื่อเขียน `WIRES`

## 8 · ภาษาไทย

- **`line-height` ต่ำกว่า 1.5 ไม่ได้** เพราะสระบนกับวรรณยุกต์ซ้อนกัน 2 ชั้นจะโดนตัด ด้วยเหตุผลเดียวกันจึง **ห้ามกำหนดความสูงตายตัวให้กล่องข้อความ**
- ฟอนต์เรียงตามนี้ `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` ซึ่งตั้งไว้ในโครงแล้ว
รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก · เอกสาร Word ใช้ฟอนต์ไทยของแบรนด์ ถ้าไม่มีจึงใช้ Tahoma (`branded-document-design` ข้อ 2) รูปในนั้นต่างฟอนต์ได้ · ถ้าเครื่องไม่มีฟอนต์ไทยสักตัว สระจะผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**
- **ไทยไม่เว้นวรรคระหว่างคำ** เบราว์เซอร์จึงตัดบรรทัดกลางคำ ถ้าข้อความยาวให้ใส่ `<br>` เอง
- ตัวอักษรไทยดูเล็กกว่าอังกฤษที่ขนาดเท่ากัน ดังนั้นคำอธิบายอย่าต่ำกว่า 12px

## 9 · เรนเดอร์แล้วเปิดดู — ห้ามข้าม

```bash
pip install playwright && playwright install chromium
cp <skill>/assets/render-figure.py docs/figures/render.py     # ครั้งแรกของโปรเจกต์
python docs/figures/render.py                  # ทุกรูปใน docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
python docs/figures/render.py arch-01 --min-px 20             # เฉพาะรูปที่ระบุ · ตัวอักษรขั้นต่ำตามขนาดที่วาง (ข้อ 4)
python assets/render-figure.py figure.html figure.png 2       # ไฟล์เดียว (สไลด์ · ลองแนว)
```

- **script render อยู่ที่ `docs/figures/render.py` ข้างโฟลเดอร์ `src/`** — เป็นเครื่องมือของโปรเจกต์ที่ต้องใช้ทุกครั้งที่แก้รูป ห้ามเก็บไว้ใน `_to_delete/` หรือ scratchpad (ล้างโฟลเดอร์ชั่วคราวแล้วจะเหลือต้นฉบับที่ render ไม่ได้) · ห้ามลบ `docs/figures/src/` เพราะ .png เป็นแค่ผลลัพธ์
- แบบโฟลเดอร์ได้ 2 ฉบับต่อรูป (ฉบับเต็ม + ฉบับวางในเอกสาร `?embed=1` ตามข้อ 4) และตรวจข้อความให้: ตัวอักษรเล็กกว่า `--min-px` · ชื่อหรือป้ายตกบรรทัด · ข้อความล้นกล่องหรือผ้าใบ · ป้ายทับกัน → `problems: 0` และ exit 0 จึงผ่าน

ใช้ตัวคูณ **2** เสมอ เพราะตัวคูณ 1 ได้ภาพเบลอเมื่อเอาไปขยายในสไลด์

แล้วรันตัวตรวจเรขาคณิต ซึ่งจับเส้นเฉียง มุมที่ไม่ใช่มุมโค้ง ป้ายทับกัน และเส้นพาดผ่านตัวหนังสือ:

```bash
python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = ผ่าน
python scripts/check-figure-source.py docs/figures/src       # ทุกรูปเริ่มจากโครงของ skill นี้
```

จากนั้นเปิดไฟล์ภาพดูด้วยตา แล้วไล่ตามนี้:

- [ ] สายข้ามคอลัมน์มีหัวลูกศรครบทุกเส้นไหม · เส้นพาดทับกล่องหรือทับตัวหนังสือไหม
- [ ] ป้ายบนเส้นอ่านออกไหม และไม่ทับกันเองไหม
- [ ] ข้อความไทยครบไหม สระหรือวรรณยุกต์หายไหม มีคำไหนถูกตัดกลางคำไหม
- [ ] กล่อง `.focus` มีกล่องเดียวจริงไหม · หัวรูปมีครบ 6 อย่างไหม · โลโก้ขึ้นจริงไหม
- [ ] ย่อรูปลงเหลือความกว้าง 25% แล้วยังแยกออกไหมว่าอะไรอยู่ตรงไหน
- [ ] วัดตัวอักษรเล็กสุดใน HTML แล้วคิดเป็น pt ตามขนาดที่จะวางจริง (ข้อ 4) ได้ ≥ 7pt
- [ ] คนที่ไม่เคยเห็นระบบนี้ ตอบคำถามต้นทางได้ไหม

## 10 · กับดักที่เจอจริง

ถ้ารูปออกมาผิด เช่น หัวลูกศรหาย เส้นลากผิดกล่อง สระไทยหาย หรือป้ายทับกล่อง ให้เปิดตารางอาการ → สาเหตุ → ทางแก้ใน [references/pitfalls.md](references/pitfalls.md) ก่อนแก้เอง

## 11 · Anti-patterns

- **ใช้ skill นี้กับรูปในทีม** — เสียเวลาหลายรอบเพื่อความสวยที่ไม่มีใครต้องการ
- **ใช้โลโก้ทางการในลักษณะที่ดูเหมือนผู้ให้บริการรับรอง** — ข้อ 6 และ [icons.md](references/icons.md)
- **กล่อง `.focus` 2 กล่อง** — แปลว่ารูปตอบ 2 คำถาม
- **ส่งไฟล์ HTML ให้ลูกค้า** — ให้ส่ง PNG ส่วนไฟล์ HTML คือแหล่งที่มา เก็บไว้ใน repo
- **ไม่เก็บไฟล์ HTML** — ปีหน้าต้องแก้รูป แล้วต้องวาดใหม่ทั้งใบ
- **รูปไม่มีวันที่และเจ้าของ**
- **เส้นเฉียงหรือมุมแหลม** — เส้นต้องตั้งหรือนอน หักด้วยมุมโค้ง (ข้อ 4 และ 7)
- **ไอคอนต่างสไตล์ปนกัน** — เส้นบางปนเส้นหนา ปนไอคอนทึบ
- **รูปจืด: การ์ดขาวเท่ากันทุกใบ เส้นบางเท่ากันทุกเส้น** — อ่านออกแต่ไม่มีจุดเด่น ทำตามข้อ 5.1

## 12 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ไดอะแกรมด่วนใน markdown ของ repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) | `software-diagrams` (plugin `software-company`) |
| เลือกวิธีฝังรูปในไฟล์ markdown | `markdown-visuals` |
| เอารูปไปวางในสไลด์ | `presentation-design` |
| เอารูปไปวางในไฟล์ Word / PDF | `branded-document-design` |
| รูปในเอกสาร SRS | `srs-writing` (plugin `software-company`) |
| สีและระยะห่างของหน้าจอแอป (คนละระบบกับรูปนี้) | `ui-craft` (plugin `software-company`) |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

HTML — HyperText Markup Language · PNG — Portable Network Graphics · SVG — Scalable Vector Graphics · CSS — Cascading Style Sheets


## reference: colour-by-domain.md

# ตารางเนื้องาน → โทนสี

ใช้เมื่อเอกสารยังไม่มี `doc-theme` และยังไม่มีสีแบรนด์ ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากตารางนี้ไว้ในรายงานให้ผู้ใช้เลือกทีหลัง (ลำดับเต็มอยู่ใน `diagram-figures` ข้อ 5) ตารางนี้ใช้ร่วมกันทั้ง 2 engine ของ `diagram-figures` และทุก skill ที่วาดรูป

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |


## reference: design-system.md

# ระบบออกแบบของรูป — รายละเอียด

สารบัญ: หัวรูป → ระบบขนาด → ระบบสี → ไอคอนเส้นที่วาดเอง · กฎสั้นอยู่ใน `SKILL.md`

## หัวรูป (จากข้อ 3)

โลโก้อยู่หน้าชื่อรูป โครงทุกตัวมีช่อง `<img class="logo">` ชี้ไปที่ `assets/logo/` ของโปรเจกต์อยู่แล้ว ให้แก้แค่ชื่อไฟล์ ถ้าโปรเจกต์ยังไม่มีโลโก้ ช่องนี้จะหายไปเอง แต่ต้องจดไว้ในรายงานว่ายังขาดโลโก้ เพราะรูปที่ไม่มีโลโก้ถูกถามเสมอว่า "โลโก้อยู่ไหน"

เหตุผลไม่ใช่ความสวย แต่เป็นเพราะรูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมล ในสไลด์ ในเอกสารสัญญา
แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ:

```
ผิด: ภาพรวมระบบ Dr Screening
ถูก: เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## ระบบขนาด (จากข้อ 4)

| อย่าง | ค่า |
|---|---|
| ตัวอักษร | ชื่อรูป 30 · ชื่อกล่อง 16 · คำอธิบาย 13.5 · ป้ายกลุ่ม 12 ตัวใหญ่ |
| ไอคอน | กรอบ 66px · มุม 18px · ไอคอน 29px · เส้น 1.6px |
| กล่อง | มุม 20px · ขอบ 1px เทาอ่อน · กล่องซ้อนใน มุม 16px พื้นเทาอ่อนมาก |
| กล่อง `.focus` | ขอบ 2px สี `--accent` เฉดเข้ม · มุม 22px |
| เส้นเชื่อม | แนวตั้งหรือแนวนอนเท่านั้น · หักมุมฉากด้วยมุมโค้งรัศมี 10px (SVG/Python engine ใช้ 12–14) · ห้ามเส้นเฉียง ห้ามเส้นโค้งอิสระ ห้ามมุมแหลม |
| ระยะ | 12 · 20 · 26 · 34 · 48 · ช่องว่างระหว่างคอลัมน์ 130 |

> **กรอบไอคอนต้องใหญ่** — 66px คือจุดที่รูปเริ่มดูตั้งใจ ไม่ใช่ผังที่ generate มา
> ถ้าต่ำกว่า 56px ไอคอนจะกลายเป็นจุดเล็ก ๆ ในกล่องใหญ่ และรูปจะดูโหวง

## ระบบสี (จากข้อ 5)

ในโครง HTML ให้แก้ที่ `--accent` ใน `:root` ที่เดียว แล้วเฉดอ่อนและเข้มจะคำนวณจากค่านั้น (ส่วน SVG/Python engine แก้ที่ `ACCENT` ใน `theme.py`)

**สีพื้นของรูปตามดีไซน์ของโปรเจกต์** — ต่อท้ายชื่อไฟล์ด้วย `#accent=<สีหลัก>&bg=<สีพื้น>` ให้ตรงกับเด็คหรือแอป พื้นเข้มหรือสว่างก็ได้ เทาทุกระดับคำนวณจากสีพื้น (ตอนนี้มีใน `figure-flow.html`) ถ้าไม่ใส่ `bg` ได้พื้นขาว

ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์:

- **สีโลโก้ผู้ให้บริการ** — AWS ส้ม Azure ฟ้า ต้องเป็นสีจริงของเขา ไม่ใช่สีแบรนด์เรา
- **เทาโครงสร้าง** — เส้นขอบและพื้นกล่องต้องจางพอที่จะไม่แย่งสายตากับเนื้อหา

**สีไอคอนมี 7 กลุ่ม และแต่ละกลุ่มต้องมีความหมาย**

| คลาส | ใช้กับ |
|---|---|
| `t-neutral` | คน อุปกรณ์ ของนอกระบบ ที่เก็บไฟล์ธรรมดา |
| `t-edge` | ทางเข้า-ออก · gateway · API |
| `t-app` | เครื่องมือที่ผู้ใช้ทำงานด้วย |
| `t-view` | ส่วนที่ผู้ใช้ใช้ดูหรืออ่านผล |
| `t-data` | ฐานข้อมูล · สำรองข้อมูล |
| `t-alert` | คิว งานที่ค้างได้ ของที่พังแล้วเจ็บ |
| `t-warn` | ของที่มีเงื่อนไข — สัญญาอนุญาต ข้อจำกัดทางกฎหมาย |

ทุกกรอบมี**พื้นอ่อนกับขอบในโทนเดียวกัน** ไม่ใช่พื้นสีทึบ เพราะสีทึบจะดึงสายตาไปจากเนื้อหา
ถ้าอยากได้สีที่ 8 แปลว่ากำลังใช้สีเพื่อความสวย ไม่ใช่เพื่อสื่อความหมาย

## ไอคอนเส้นที่วาดเอง (จากข้อ 6)

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน
รูปทรงต้องอ่านออกที่ขนาด 24px เพราะลายละเอียดเกิน 3 เส้นจะกลายเป็นก้อนดำ

## ฟอนต์ในรูปที่ฝังเด็ค (จากข้อ 8)

  รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก รูปจะได้ฟอนต์เดียวกับเนื้อความของเด็ค · เอกสาร Word ใช้ฟอนต์ไทยของแบรนด์ ถ้าไม่มีจึงใช้ Tahoma ตาม `branded-document-design` ข้อ 2 รูปในนั้นต่างฟอนต์ได้
  ถ้าเครื่องไม่มีสักตัว จะตกไปใช้ฟอนต์ที่วางสระผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**


## reference: engine-mermaid.md

# Mermaid → รูปเส้นตั้งฉากมุมโค้ง

ทางที่ 3 ของ `diagram-figures` ใช้เมื่อเอกสารมีบล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) แล้วต้องส่งเป็นไฟล์ Word หรือ PDF ที่ดูออกแบบมา
ถ้าใช้ภาพที่ Mermaid วาดเอง เส้นจะโค้งอิสระและเฉียง สีจะไม่ตรงกับรูปที่วาดด้วยมือ ตัวนี้จึงอ่านบล็อกเดิมแล้ววาดใหม่ด้วยกติกาเดียวกับโครง HTML

## ได้อะไร

- เส้นตั้งหรือนอนเท่านั้น หักมุมด้วยมุมโค้ง (รัศมีอยู่ใน `theme.py`: `WIRE_R` 12 · กล่อง `BOX_R` 10)
- ป้ายบนเส้นเป็นป้ายขาวขอบอ่อน และมีตัวตรวจว่าป้ายไม่ทับกล่องหรือเส้น
- กล่องหลักกล่องเดียวเป็นการ์ดเข้มขอบไล่สี ตรงกับกล่อง `.focus`
- จัดวางด้วย ELK (`elkjs` แบบ layered + orthogonal) จึงไม่ต้องวางพิกัดเอง

## ใช้

1. คัดลอกโฟลเดอร์ `assets/mermaid-engine/` ไปไว้ที่ `docs/figures/src/gen/`
2. แก้ `figures.json`:
   - `prefix` คือรหัสโปรเจกต์ (`document-naming`)
   - `drafts` คือโฟลเดอร์ไฟล์ `.md` ที่มีบล็อก Mermaid
   - `skip` คือบล็อกที่มีรูปวาดมือแล้ว
   - `captions` ใช้แทนคำบรรยายที่สร้างจากหัวข้อ
3. แก้ `theme.py`: ให้ `ACCENT` และ `SECOND` ตรงกับ `doc-theme` ของโปรเจกต์ ส่วน `MEASURE_FONTS` ต้องชี้ไฟล์ฟอนต์จริงในเครื่อง
4. รัน `python build.py` จะได้ `docs/figures/<prefix>-<ไฟล์>-m<N>.png` และ `map.md` ที่บอกว่าบล็อกไหนกลายเป็นไฟล์ไหน
   - ถ้ายังไม่มี `elkjs` ตัว `elk.py` จะติดตั้งรุ่น 0.9.3 ลงโฟลเดอร์ `node_modules` ที่ตั้งไว้ให้เอง
5. ต้องดู output ทุกครั้ง:
   - บรรทัด `PROBLEM` คือเส้นเฉียง ป้ายทับ หรือบล็อกที่อ่านไม่ออก ห้ามส่งงานถ้ายังมีบรรทัดนี้
   - เปิดดูด้วยตาอย่างน้อย 1 รูปต่อชนิด

## ข้อจำกัด

- ใช้ได้ 4 ชนิด: `sequenceDiagram` · `stateDiagram-v2` · `erDiagram` · `gantt` ส่วน flowchart ให้วาดเป็นโครง HTML (ข้อ 2 ของ SKILL.md) เพราะ flowchart คือรูปที่คนอ่านมากที่สุด
- รูปกว้าง 1240px ตามหน้า A4 แนวตั้ง ถ้ารูปมีคนเกี่ยวข้องเกิน 7 คน ตัวหนังสือจะเล็ก ให้แยกรูป หรือวางรูปนั้นในหน้าแนวนอน


## reference: engine-svg-python.md

# SVG/Python engine — รูปที่ generate จากข้อมูลหรือโค้ด

ทางที่ 2 ของ `diagram-figures` ใช้แทนโครง HTML เมื่อรูปต้องสร้างจากข้อมูลหรือโค้ด เช่น รูปหลายใบที่ต้องออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือรูปที่ต้องคุมตำแหน่งทุกจุดเองบนกริดด้วยเส้นตั้งฉากมุมโค้ง
Python เขียน SVG ลงกริดแล้วเรนเดอร์เป็น PNG ส่วนไอคอนและโลโก้มาจากคลังเดียวกับโครง HTML ([icons.md](icons.md))

ข้อเสียคือใช้เวลา เพราะ 1 รูปต้องแก้หลายรอบ ดังนั้นให้ใช้เฉพาะรูปที่คนนอกทีมจะเห็นและเห็นซ้ำ

> **สีหลัก = สีหลักของโปรเจกต์** · หาตามลำดับใน `diagram-figures` ข้อ 5 (ระบบสี) แล้วใส่ใน `ACCENT` ของ `theme.py` · ชุดประจำบ้าน `#2A78D6` ใช้เฉพาะเมื่อลำดับนั้นหาไม่เจอเลย

---

**สารบัญ**
- [0 · สีมาจากเนื้องาน — ไม่หยุดถาม](#0--สีมาจากเนื้องาน--ไม่หยุดถาม)
- [1 · ลำดับการทำงาน](#1--ลำดับการทำงาน)
- [2 · โครงไฟล์](#2--โครงไฟล์)
- [3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง](#3--กฎข้อที่หนึ่ง--กริดก่อน-เส้นทีหลัง)
- [4 · เส้นเชื่อม](#4--เส้นเชื่อม)
- [5 · ป้ายบนเส้น — สองบทบาทเท่านั้น](#5--ป้ายบนเส้น--สองบทบาทเท่านั้น)
- [6 · โซน](#6--โซน)
- [7 · ไอคอนและโลโก้](#7--ไอคอนและโลโก้)
- [8 · เรนเดอร์](#8--เรนเดอร์)
- [9 · วงจรตรวจงาน — ห้ามข้าม](#9--วงจรตรวจงาน--ห้ามข้าม)
- [10 · ค่าคงที่ที่ใช้ได้จริง](#10--ค่าคงที่ที่ใช้ได้จริง)
- [11 · แถบสัญลักษณ์](#11--แถบสัญลักษณ์)
- [ตัวย่อ](#ตัวย่อ)

## 0 · สีมาจากเนื้องาน — ไม่หยุดถาม

**ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้นและอย่าถามซ้ำ**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร") ถ้ายังไม่มี ให้ทำตามข้างล่างนี้แล้วเขียนกลับลง `doc-theme`

**ไม่มีสีแบรนด์ → ทำตามลำดับใน `diagram-figures` ข้อ 5:** ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม
เสนอโทนจากเนื้องานตามตารางใน [colour-by-domain.md](colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

ใส่**สีหลักสีเดียว**ที่ `ACCENT` ใน `assets/svg-engine/theme.py` แล้วเฉดอ่อนและเข้มทั้งหมด
จะคำนวณจากสีนั้นด้วย `tint()` โค้ดวาดรูปจึงไม่มีสีอื่นฝังอยู่

สีเดียวที่ไม่ผูกกับ `ACCENT` คือ `EXCEPT_HUE` สำหรับป้าย "ข้อยกเว้น" ซึ่งต้องต่างจากสีหลักเสมอ
ถ้าสีหลักเป็นส้มอยู่แล้ว ให้เปลี่ยน `EXCEPT_HUE` เป็นสีอื่นที่ตัดกัน

---

## 1 · ลำดับการทำงาน

1. อ่านไดอะแกรมที่มีอยู่ทั้งหมดก่อน แล้วถามว่า**รูปนี้ตอบคำถามอะไร** — 1 รูปตอบ 1 คำถาม
2. เลือกสีตามข้อ 0 (ไม่มีสี → ค่าประจำบ้าน + `(รอยืนยัน)`)
3. **วางตำแหน่งทุกกล่องลงกริดก่อนลากเส้น** — ข้อนี้สำคัญที่สุด ดูข้อ 3
4. แก้ `theme.py` และ `ref.py` ให้เสร็จก่อน แล้วค่อยเขียนไฟล์รูป
5. **เรนเดอร์แล้วเปิดไฟล์ภาพดูจริง** ไม่ใช่แค่เช็กว่าสคริปต์รันผ่าน
6. เมื่อได้รูปที่สะอาดแล้ว จึงเขียนลงโฟลเดอร์ปลายทาง ส่วนรูปเก่าให้ย้ายไป `_to_delete/`

---

## 2 · โครงไฟล์

```
architecture/
  01-system-context.png      ← ผลลัพธ์ เลขนำหน้าเรียงตามลำดับการอ่าน
  _src/
    theme.py                 ← สีทั้งหมด — แก้ที่นี่ที่เดียว
    ref.py                   ← ภาษาภาพ: โซน หน่วย เส้น ป้าย แถบสัญลักษณ์
    render.py                ← SVG → PNG ด้วย Playwright ที่ 2 เท่า
    d01.py … dNN.py          ← หนึ่งไฟล์ต่อหนึ่งรูป มีแต่การจัดวาง
    logos/                   ← โลโก้ผลิตภัณฑ์ + colors.json
```

ให้คัดลอกทั้งโฟลเดอร์ [`assets/svg-engine/`](../assets/svg-engine/) ไปเป็น `_src/` แล้วเริ่มงาน — [`d01.py`](../assets/svg-engine/d01.py) เป็นรูปตัวอย่างที่เรนเดอร์ได้จริง

---

## 3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง

เส้นเฉียงทำให้อ่านยาก แต่การดัดเส้นทีหลังไม่ช่วย **ต้องแก้ที่ตำแหน่ง**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # คอลัมน์
R1,R2,R3          = 288,458,624                  # แถว ห่างกัน ~170
```

ทุกกล่องอยู่บนจุดตัดของคอลัมน์กับแถว และไม่มีตัวไหนหลุดกริด
เมื่อทุกจุดอยู่บนเส้นเดียวกัน เส้นเชื่อมก็ตั้งฉากได้เองโดยไม่ต้องดัด

### กฎจุดกึ่งกลาง

ตัวที่รับหลายทางต้องอยู่**กึ่งกลางของทางเหล่านั้น** ไม่ใช่เกาะแถวใดแถวหนึ่ง
และถ้าส่งต่อหลายทาง ก็ต้องอยู่กึ่งกลางของทางที่ส่งออกด้วย

ให้ใช้**จุดรวมเดียวและจุดแยกเดียว** เพื่อให้เส้นสมมาตร

```python
RM = (R1+R2)//2      # Nginx อยู่กึ่งกลางของสองแถวที่รับเข้ามา
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # เข้าจากบน
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # เข้าจากล่าง
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # ออกขึ้นบน
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # ออกลงล่าง
```

### ช่องเดินสาย

เส้นที่ต้องข้ามกริด **ห้ามวิ่งทับแถวที่มีกล่อง** ให้จองช่องว่างไว้เฉพาะ

```python
TB = 238        # ช่องบน — ห่างจากขอบโซนอย่างน้อย 36
MB = R3-48      # ช่องกลาง — ระหว่างแถว
```

---

## 4 · เส้นเชื่อม

เส้นตั้งฉากทั้งหมดและมุมโค้งรัศมี 14 — จุดนี้ทำให้ดูประณีตขึ้นมากโดยไม่เสียความชัดเจน
`ref.flow(pts, dashed=False, arrow=True)` คำนวณมุมโค้งให้เอง

**หัวลูกศรต้องจบที่ขอบไอคอน ไม่ใช่ที่ป้ายชื่อ** — เช่น `CD-30` เมื่อไอคอนกว้าง 46

---

## 5 · ป้ายบนเส้น — สองบทบาทเท่านั้น

| บทบาท | สี | ใช้กับ |
|---|---|---|
| ปกติ | เฉดอ่อนของ `ACCENT` | สิ่งที่ไหลผ่านเส้นตามปกติ |
| ข้อยกเว้น | `EXCEPT_HUE` | ทางที่ไม่ผ่านประตูหน้า · กรณีพิเศษ |

**ข้อยกเว้นมีได้ป้ายเดียวต่อรูป** ถ้ามีตั้งแต่ 2 ป้าย แปลว่าไม่มีป้ายไหนเด่นจริง

ป้ายบอกว่า**อะไรไหลผ่าน** เช่น `SQL` `/api/` `DICOM 11112` ไม่ใช่ `เชื่อมต่อ`

---

## 6 · โซน

โซนเป็นกรอบพื้นสีอ่อนมาก ส่วนป้ายชื่อเป็นแคปซูลพื้นขาวคร่อมเส้นขอบและมีจุดสีนำหน้า

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| ชนิด | เส้น | ความหมาย |
|---|---|---|
| `physical` | ทึบ | ขอบเขตของจริงทางกายภาพ — ห้อง อาคาร เครื่อง |
| `logical` | ประ | ขอบเขตเชิงตรรกะ — Docker Compose · namespace · VPC |
| `outside` | ประ | นอกระบบที่เราดูแล |

ผู้อ่านจะเห็นทันทีว่าอันไหนมีอยู่จริง และซ้อนโซนได้ไม่เกิน 3 ชั้น

---

## 7 · ไอคอนและโลโก้

ไอคอน**ลอยบนพื้น ไม่มีกรอบ ไม่มีไทล์** ส่วนชื่อและคำอธิบายอยู่ใต้ภาพ

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  มี logos/<slug>.svg → ใช้โลโก้จริง เติมสีจาก colors.json
#  ไม่มี              → ใช้สัญลักษณ์เส้นที่ออกแบบเอง
```

ค่าที่ใช้ได้จริง: ไอคอน 46 · ชื่อ 11.5 ตัวหนา ห่างจากกึ่งกลาง `size/2+20` · คำอธิบาย 10 ห่าง `size/2+35`

โลโก้เอามาจากคลังไอคอนของ skill นี้ ([icons.md](icons.md)) ให้รัน `python assets/find-icon.py --group brands <ชื่อ>` จากโฟลเดอร์ `diagram-figures/` แล้ว `--copy` ไปไว้ใน `_src/logos/`
Simple Icons ให้ SVG สีเดียว `viewBox 0 0 24 24` และมาพร้อม `colors.json` ที่เก็บรหัสสีทางการของแต่ละแบรนด์

### เรื่องเครื่องหมายการค้า — ห้ามข้าม

- โลโก้เป็นของเจ้าของ ใช้เพื่ออ้างถึงตัวผลิตภัณฑ์ในผังได้
  แต่**ห้ามดัดแปลงรูปทรง ห้ามยืดบีบ และห้ามทำให้ดูเหมือนเจ้าของมารับรอง**
- ถ้าตัวไหนไม่มีไฟล์โลโก้ ให้ใช้สัญลักษณ์แทน แล้ว**ระบุชื่อตัวนั้นไว้ในหมายเหตุท้ายรูป**
- อย่าไปดาวน์โหลดโลโก้ใหม่มาเอง ให้ใช้จากชุดที่มีอยู่ หรือให้ผู้ใช้หาจากหน้า brand ของโครงการนั้น

---

## 8 · เรนเดอร์

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

เรนเดอร์ที่ 2 เท่าเสมอ เพราะ 1 เท่าได้ภาพเบลอเมื่อขยายในสไลด์

ภาษาไทยต้องมีฟอนต์ไทยในเครื่องที่เรนเดอร์ แล้วประกาศไว้ใน `font-family` ของ `<svg>`
**อย่าใช้ Python Imaging Library (PIL) วาดข้อความไทยปนอังกฤษ** เพราะจะได้กล่องสี่เหลี่ยมแทนตัวอักษร

---

## 9 · วงจรตรวจงาน — ห้ามข้าม

เรนเดอร์ → เปิดไฟล์ภาพดูจริง → แก้ → เรนเดอร์ใหม่ จนกว่าจะสะอาด
**6 ข้อนี้เจอซ้ำทุกครั้ง ให้ตรวจทุกรอบ:**

1. **ป้ายบนเส้นทับไอคอนหรือชื่อ** — ย้ายไปกึ่งกลางช่วงที่ยาวที่สุด หรือย้ายไปบนขาตั้ง
2. **เส้นที่ออกจากไอคอนตัดคำอธิบายของตัวเอง** — เริ่มเส้นที่ `cy+58` ไม่ใช่ `cy+32`
3. **ขอบโซนตัดคำอธิบายแถวล่างสุด** — ขอบล่างโซนต้อง ≥ `R_ล่างสุด + 58 + 24`
4. **ข้อความกำกับโซนนั่งทับเส้นขอบ** — รวมกับชื่อในแคปซูลเดียว
5. **หัวลูกศรไปจบที่ป้ายชื่อ ไม่ใช่ที่ไอคอน** — ให้จบที่ขอบไอคอน
6. **ข้อความล้นกรอบ** — ไทย 11.5px ≈ 6.0 px/ตัว · หัวเรื่อง 15px ≈ 7.5 px/ตัว
   ถ้าที่ไม่พอ ให้ตัดคำ **อย่าลดขนาดตัวอักษร**

---

## 10 · ค่าคงที่ที่ใช้ได้จริง

```
ความกว้าง 1400 · ขอบ 56
หัวเรื่องกลางหน้า 22 · คำอธิบายใต้หัว 12.5
ชื่อหน่วย 11.5 ตัวหนา · คำอธิบาย 10 · ป้ายบนเส้น 10.5
เส้นเชื่อม 1.6 · ขอบโซน 1.4 · รัศมีมุมโค้ง 14 · ป้ายสูง 21
```

---

## 11 · แถบสัญลักษณ์

ทุกรูปปิดท้ายด้วยแถบเดียวที่บอกว่ากรอบแต่ละแบบคืออะไร และป้าย 2 สีต่างกันตรงไหน
แล้วต่อด้วยหมายเหตุ 2–4 บรรทัด ซึ่งรวมบรรทัดเรื่องเครื่องหมายการค้า และการอ้างถึงรูปอื่นที่เกี่ยวข้อง

---

## ตัวย่อ

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: icons.md

# คลังไอคอน — ใช้ร่วมกันทั้งโครง HTML และ SVG/Python engine

**ไอคอนมีให้แล้ว 205 ตัวใน `assets/icons/`** ไม่ต้องติดตั้งอะไรเพิ่ม —
เป็น PNG พื้นโปร่ง 160×160 ซึ่งเป็นไอคอนทางการของผู้ให้บริการและเครื่องมือ แบ่งเป็น 9 กลุ่ม

| โฟลเดอร์ | มีอะไร |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · ผู้ใช้ … |

รายชื่อทั้งหมดอยู่ใน [`assets/icons/INDEX.md`](../assets/icons/INDEX.md) และเปิด [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) เพื่อดูรูปทั้งหมดในหน้าเดียว

**ถ้าต้องการตัวที่ไม่มีใน 205 ตัวนี้** ให้ค้นในคลังเต็ม `assets/tech-icons.zip` (8,602 ไอคอน · 5 กลุ่ม) ด้วย [`find-icon.py`](../assets/find-icon.py) ซึ่งไม่ต้องติดตั้งอะไรและไม่ต้องแตกทั้งก้อน

| กลุ่ม | มีอะไร |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · ฐานข้อมูล · คิว · CI/CD · เฝ้าระวัง · Kubernetes · ภาษาโปรแกรม · GIS |
| `brands/` | 3,461 SVG สีเดียว · โลโก้แบรนด์ + รหัสสีทางการใน `colors.json` |
| `devtools/` | 572 SVG มีสี · โลโก้เครื่องมือนักพัฒนา |
| `ui/` | 2,112 SVG ไอคอนเส้นทั่วไป (Lucide) ไม่ใช่โลโก้ |

```bash
python assets/find-icon.py kafka redis                       # ค้นชื่อ
python assets/find-icon.py --group ui user                    # ค้นเฉพาะกลุ่ม
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # สีทางการของโลโก้
```

ให้ดึงมาเฉพาะตัวที่ใช้แล้ววางไว้ข้างไฟล์รูป ห้ามแตกทั้งคลังลงโปรเจกต์ สัญญาอนุญาตของคลังคือ MIT · CC0 · ISC (ดู `--groups`) แต่โลโก้ยังเป็นเครื่องหมายการค้าของเจ้าของ

> **เรื่องสัญญาอนุญาต** — ชุดไอคอนสถาปัตยกรรมของ AWS · Azure · Google Cloud
> เผยแพร่มาเพื่อใช้วาดผังสถาปัตยกรรมโดยเฉพาะ จึงใช้ในเอกสารข้อเสนอได้
> สิ่งที่ทำไม่ได้คือใช้โลโก้ในลักษณะที่ทำให้เข้าใจว่าผู้ให้บริการรับรองหรือร่วมงานด้วย
> และใช้เป็นส่วนหนึ่งของแบรนด์ตัวเอง ส่วนถ้าไม่มีไอคอนทางการของเครื่องมือนั้น ให้วาดไอคอนเส้นเองตาม [SKILL.md](../SKILL.md) ข้อ 6


## reference: layout-cloud.md

# โครง `figure-cloud.html` — ผังคลาวด์พร้อมโลโก้ผู้ให้บริการ

โครงนี้ตอบคำถาม "ใช้บริการอะไรของคลาวด์บ้าง" ไฟล์โครงอยู่ที่ [`assets/figure-cloud.html`](../assets/figure-cloud.html)

ใช้เมื่อผู้อ่านคาดหวังจะเห็นไอคอน Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes ของจริง แบบผังอ้างอิงที่ผู้ให้บริการเผยแพร่ ไอคอนหาได้จากคลังตาม [icons.md](icons.md)

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**กติกาเฉพาะโครงนี้:**

- **สายที่ข้ามขอบเขต ให้ออกจากขอบของกล่องขอบเขต** (`n-region`) ไม่ใช่จากกล่องข้างใน
  — เพราะถ้าต่อจากกล่องข้างใน เส้นจะพาดทะแยงทับทุกอย่างที่ขวางทาง
- **เส้นประ = ขอบเขตที่ผู้ให้บริการจัดการให้** ส่วนเส้นทึบสีส้ม = เครื่องที่เราดูแลเอง
  และให้ใส่ความหมายไว้ในคำอธิบายสัญลักษณ์เสมอ
- ไอคอนแสดงเปล่า ๆ ไม่ต้องมีกรอบ เพราะโลโก้มีสีและรูปทรงของตัวเองอยู่แล้ว
- ชื่อบริการใช้ชื่อทางการ (`Amazon RDS`) ส่วนคำอธิบายใต้ชื่อเป็นภาษาไทยได้


## reference: layout-context.md

# โครง `figure-context.html` — ระบบกับโลกภายนอก

ตอบคำถาม "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" (C4 ระดับ 1) ไฟล์โครงอยู่ที่ [`assets/figure-context.html`](../assets/figure-context.html)

```
┌─ หัวรูป ────────────────────────────────────────────────────────┐
│  ผู้ใช้งาน (แถบนอน)   →   ระบบที่อธิบาย (การ์ดใหญ่)   ←   ระบบภายนอก  │
│  ─ เจ้าหน้าที่           ─ ชื่อ + คำขยาย                ─ external system │
│  ─ แพทย์                ─ หน้าที่ 3-6 ข้อ               ─ ชื่อ + สถานะ    │
│  ─ ผู้ดูแล               ─ ป้ายข้อจำกัด                                │
├─ คำอธิบายสัญลักษณ์ ─────────────────────────────────────────────┤
│  เชิงอรรถ — ความหมายเส้นประ · ตัวย่อทั้งหมด · รูปถัดไป              │
└────────────────────────────────────────────────────────────────┘
```

- **ผู้ใช้งานอยู่ซ้าย ส่วนระบบภายนอกอยู่ขวา** และไม่ปนกัน เพราะคนกับเครื่องเป็นคนละชนิด
- **หน้าที่ในการ์ดกลางมี 3 ถึง 6 ข้อ** ถ้าเกินนี้ แปลว่ากำลังเขียน SRS ไม่ใช่วาดรูป
- **ระบบภายนอกที่ยังไม่ได้เชื่อม** ให้ใช้เส้นประ (`planned:true`) แล้วเขียนไว้ในการ์ดว่าอยู่ในแผนเวอร์ชันไหน
  — เพราะรูปที่วาดเฉพาะของที่มีแล้วจะถูกถามซ้ำทุกรอบว่า "แล้วเชื่อม HIS หรือยัง"
- **มีคำอธิบายสัญลักษณ์เสมอ** เมื่อรูปทรงหรือเส้นสื่อความหมาย
- **ตัวย่อเขียนเต็มที่เชิงอรรถ** เพราะผู้อ่านฝั่งลูกค้าไม่รู้ว่า SEG คืออะไร


## reference: layout-deployment.md

# โครง `figure-template.html` — deployment · ข้างในเครื่อง

ตอบคำถาม "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" ไฟล์โครงอยู่ที่ [`assets/figure-template.html`](../assets/figure-template.html)

โครงนี้มี 3 คอลัมน์ เรียงซ้ายไปขวาตามทิศที่ข้อมูลไหล:

```
┌─ หัวรูป ───────────────────────────────────────────────┐
│  ชื่อ + คำขยาย                    เลขรูป · เวอร์ชัน · เจ้าของ  │
├────────────┬──────────────────────────┬────────────────┤
│ นอกระบบ    │  ⬅ กล่อง .focus           │ ปลายทาง        │
│ คน อุปกรณ์  │  สิ่งที่เอกสารนี้อธิบาย       │ ข้อบังคับ       │
│ ระบบอื่น    │  ซ้อนได้อีก 1 ชั้น          │ ของที่ไหลออก    │
├────────────┴──────────────────────────┴────────────────┤
│ เชิงอรรถ — รูปอื่นที่เกี่ยวข้อง · ที่มาของไอคอน              │
└────────────────────────────────────────────────────────┘
```

**ซ้อนกล่องได้ไม่เกิน 3 ชั้น** คือ คอลัมน์ → กล่องใหญ่ → กล่องย่อย
ถ้ามีชั้นที่ 4 แปลว่ารูปนี้ตอบ 2 คำถาม ให้แยกเป็น 2 รูป

**กล่อง `.focus` มีได้กล่องเดียวต่อรูป** ถ้ามี 2 กล่อง แปลว่ายังไม่ได้ตัดสินใจว่ารูปนี้เรื่องอะไร


## reference: layout-flow.md

# โครง `figure-flow.html` — ข้อมูลไหลผ่านอะไร ตามลำดับไหน

ตอบคำถาม "ข้อความ 1 ชิ้น (คำขอ · งาน · เอกสาร) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" ไฟล์โครงอยู่ที่ [`assets/figure-flow.html`](../assets/figure-flow.html) · ตัวอย่างที่เรนเดอร์แล้ว [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ หัวรูป ──────────────────────────────────── ①–⑥ ความหมายเลขลำดับ ┐
│ ┌ผู้ใช้┐   ┌ช่องทาง┐    ┌ เครื่องที่รัน (เทา) ─────────┐   ┌ บริการภายนอก ┐ │
│ │ คน  │①→│ เว็บ   │②→ │ ┌ ระบบ .focus (สีหลัก) ┐ │③→ │ AI · API     │ │
│ │ คน  │①→│ LINE  │②→ │ │ ชั้น · หน้าที่         │ │   └─────────────┘ │
│ │ คน  │ →│ หลังบ้าน│ → │ │ ชั้น · หน้าที่         │ │④→ ┌ ข้อมูล ──────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ ไฟล์ · DB    │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ เชิงอรรถ: ความหมายพื้นสีอ่อน · เส้นประ · ตัวย่อทั้งหมด ───────────────┤
```

## สี — มาจากสีหลักของโปรเจกต์ตัวเดียว

- แก้ `--accent` ใน `:root` ที่เดียว แล้วเฉดเข้ม พื้นอ่อน และสีตัวหนังสือบนพื้นสีหลักคำนวณให้เอง (สีสว่างเช่นเหลือง สคริปต์จะสลับตัวหนังสือเป็นสีเข้มให้อ่านออก)
- หาสีหลักตามลำดับใน SKILL.md ข้อ 5 · ลองสีอื่นโดยไม่แก้ไฟล์: เปิด `figure-flow.html#accent=0F8B8D`
- **สีหลักใช้กับ 4 อย่างเท่านั้น:** ขอบกล่อง `.focus` · ป้ายชื่อระบบ · เส้นทางข้อมูลกับเลขลำดับ · ชื่อโปรเจกต์ในหัวรูป
- โครงที่เหลือเป็นเทากลาง — กลุ่มเส้นประ กล่องเครื่องที่รัน การ์ด ส่วนไอคอนใช้ 7 สีความหมายเดิม (ข้อ 5)

## กติกา

- **ทิศเดียว ซ้าย → ขวา**: ผู้ใช้ → ช่องทาง → ระบบ → ของที่ระบบเรียกใช้ ถ้ามีเส้นย้อนกลับ ให้บอกในคำอธิบายชั้น (เช่น "push คำตอบกลับ LINE") แทนการลากเส้นย้อน
- **เลขลำดับ = เส้นทางของ 1 ข้อความ** ไม่ใช่เลขเส้น เส้นที่เกิดพร้อมกันใช้เลขเดียวกัน (สองช่องทางเข้า = ② ทั้งคู่) · เส้นทางแยกที่ไม่ได้เกิดทุกครั้ง (เช่นอ่านภาพ) ไม่ต้องมีเลข
- **ชั้นในกล่องระบบ 5–9 ชั้น** เรียงตามลำดับที่ข้อความผ่าน · ชื่อชั้นสั้น หน้าที่ 1–2 บรรทัด ถ้าเกิน 9 ชั้น แยกเป็นรูปข้างในระบบอีกรูป
- **ชั้นเน้น `.guard` ไม่เกิน 2 ชั้น** และเขียนความหมายไว้ที่เชิงอรรถ
- **เส้นต่อเข้าชั้นที่ทำงานนั้นจริง** ไม่ใช่ขอบกล่องใหญ่ — เส้นวาดอยู่บนกล่อง หัวลูกศรจึงถึงชั้นข้างใน
- **เส้นที่ใช้ช่องว่างเดียวกันต้องไม่ตัดกัน** — เลื่อนช่วงหักด้วย `mx` (เส้นที่ปลายอยู่สูงกว่าให้ `mx` น้อยกว่า) แล้วเรนเดอร์ดูทุกครั้ง
- ป้ายบนเส้นเป็นคำสั้น 1–3 คำบอกว่าอะไรไหลผ่าน (`HTTPS` · `webhook` · `ถาม LLM`) · ต้นเส้นมีเลขลำดับ ให้ใช้ `lp:"start"` เมื่อช่วงท้ายสั้นเกิน


## reference: pitfalls.md

# กับดักที่เจอจริง — โครง HTML

อาการที่เจอซ้ำเมื่อทำรูปด้วยโครงใน `assets/` พร้อมสาเหตุและทางแก้ ส่วนกับดักของ SVG/Python engine อยู่ใน [engine-svg-python.md](engine-svg-python.md) ข้อ 9

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| หัวลูกศรหายทั้งรูป | สคริปต์ลบ `path` ทุกตัวก่อนวาดใหม่ รวมถึงสามเหลี่ยมหัวลูกศรที่อยู่ใน `<defs>` — ลบเฉพาะ `path.wire` (โครงแก้ไว้แล้ว) |
| เส้นลากไปผิดกล่อง | `id` ไปติดกล่องอื่นที่หน้าตาเหมือนกัน — เปิด console ดู `wire: ไม่พบ id` และตรวจว่า `id` ไม่ซ้ำ |
| เส้นจ่อกลางกล่องสูง แล้วพาดทับของข้างใน | ใส่ `tp` / `fp` ให้เส้นเข้าใกล้ขอบบน |
| สระไทยหาย | เครื่องไม่มีฟอนต์ไทยในรายการ — ติดตั้ง Noto Sans Thai หรือเพิ่มฟอนต์ที่มีเข้าไปในรายการ |
| ภาพเบลอในสไลด์ | เรนเดอร์ด้วยตัวคูณ 1 |
| รูปมีขอบขาวเยอะ | ถ่ายทั้งหน้าแทนที่จะถ่ายเฉพาะ `.sheet` |
| แก้ข้อความแล้วเส้นหลุด | เขียนพิกัดเส้นตายตัวแทนที่จะใช้ `WIRES` |
| ป้ายบนเส้นทับกล่อง หรือบังเส้นจนมองไม่เห็น | ป้ายกว้างกว่าช่องว่างระหว่างคอลัมน์ — เพิ่ม `gap` หรือตัดคำในป้ายให้สั้นลง |
| ชื่อกล่องภาษาไทยตกบรรทัดสอง | คอลัมน์แคบไป — เพิ่มความกว้างคอลัมน์นั้น อย่าลดขนาดตัวอักษร |
| ใช้ไอคอนเป็นไฟล์ภาพแล้วเส้นลากผิดตำแหน่งทั้งรูป | สคริปต์คำนวณก่อนรูปโหลดเสร็จ — เรียก `draw()` ใน `window.onload` ไม่ใช่ตอนอ่านสคริปต์ (`figure-cloud.html` ทำไว้แล้ว) |
| เส้นหักมุมใน `figure-flow.html` ตัดกันเอง | หลายเส้นใช้ช่องว่างเดียวกัน — ตั้ง `mx` ให้เส้นที่ปลายอยู่สูงกว่ามีค่าน้อยกว่า แล้วเรนเดอร์ดูใหม่ |
| ลูกศรหายเข้าไปใต้กล่องระบบ | ชั้น `.wires` ไม่มี `z-index` — โครง flow ตั้งไว้แล้ว ถ้าก๊อปไปใช้โครงอื่นต้องตั้งตาม |
| รูปออกมาเป็นสีของรูปตัวอย่าง | ลืมแก้ `--accent` — หาสีหลักของโปรเจกต์ตาม SKILL.md ข้อ 5 ก่อนเรนเดอร์ |
| เส้นพาดทะแยงทับทั้งรูป | ต่อเส้นจากกล่องข้างในกล่องขอบเขต — ต่อจากขอบของกล่องขอบเขตแทน |


## reference: wires.md

# สายเชื่อม — รายละเอียด

เปิดเมื่อเขียน `WIRES` หรือแก้เส้นที่ลากผิด

**ในคอลัมน์เดียวกัน** ให้ใช้ลูกศรลง `.down` ระหว่างกล่อง โดยไม่ต้องเขียนอะไรเพิ่ม

**ข้ามคอลัมน์** ให้ใช้รายการ `WIRES` ท้ายไฟล์ แล้วสคริปต์จะลากเส้นให้หลังจัดหน้าเสร็จ:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^id ต้นทาง   ^ด้านออก  ^id ปลายทาง  ^ด้านเข้า ^ตำแหน่งบนขอบ 0=บน 1=ล่าง
```

ที่ต้องคำนวณหลังจัดหน้า เพราะตำแหน่งกล่องขึ้นกับความยาวข้อความไทย
ถ้าเขียนพิกัดตายตัวไว้ พอแก้ข้อความทีเดียวเส้นจะหลุดทั้งรูป

**กติกา:**

- **เส้นวิ่งแนวตั้งหรือแนวนอนเท่านั้น และหักมุมด้วยมุมโค้ง** — ฟังก์ชัน `elbow()` ในโครงทำให้เอง (นอน → ตั้ง → นอน) ใช้ `mx` เลื่อนช่วงหักเมื่อหลายเส้นใช้ช่องเดียวกัน อย่าเขียน `path` เป็นเส้นตรงจากจุดถึงจุด เพราะกล่องสองข้างสูงไม่เท่ากันแล้วเส้นจะเฉียง
- **ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์** ไม่อย่างนั้นป้ายจะทับกล่องหรือบังเส้นจนหาย ถ้าป้ายยาวขึ้น ต้องเพิ่ม `gap` ของ `.stage` ตามไปด้วย
- เลื่อนป้ายไปตามเส้นได้ด้วย `lp` (0 = ต้นทาง · 1 = ปลายทาง · ไม่ใส่ = กลางเส้น)
- เส้นที่ยังไม่ได้เชื่อมจริง ให้ใช้ `planned:true` เพื่อได้เส้นประ แล้ว**เขียนความหมายไว้ที่เชิงอรรถ**
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป เพราะเกินนี้รูปจะกลายเป็นใยแมงมุม
- ต่อเข้า**กล่องเล็กที่สุดที่ถูกต้อง** ไม่ใช่กล่องใหญ่ที่ครอบอยู่ ถ้ากล่องสูงมาก ให้ใส่ `tp` เพื่อเลี่ยงไม่ให้เส้นจ่อกลางกล่อง
- ป้ายบนเส้นบอกว่า**อะไรไหลผ่าน** เช่น `HTTPS 443` ไม่ใช่ `เชื่อมต่อ` ส่วนเส้นที่ไม่มีอะไรจะบอก ไม่ต้องใส่ป้ายเลยดีกว่าใส่คำว่า "ใช้"


---

# skill: software-diagrams

Use when a README, PR or code note needs a quick Mermaid diagram. Diagrams in project docs (BRD, SRS, FSD, ER, flows) → diagram-figures.

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

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`
