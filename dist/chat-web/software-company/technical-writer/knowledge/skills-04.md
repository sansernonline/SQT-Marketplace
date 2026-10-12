# skill: commit-message-format

Use when writing a git commit message (Conventional Commits — type, scope, body, footer).

# Conventional Commit Message Format

## When to use this skill

- Writing any git commit message
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Language follows the repo** — check `git log -10` first. A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit

| ❌ Hard to read | ✅ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Examples

### Simple commit
```
feat(auth): add password reset via email
```

### With scope
```
fix(checkout): prevent double-charge on slow networks
```

### With body
```
feat(api): add rate limiting to public endpoints

Implement token bucket algorithm with 100 req/min limit per IP.
Returns 429 status with Retry-After header when exceeded.
Cache state stored in Redis to handle multi-instance deployments.
```

### Breaking change
```
feat(api)!: change auth response shape

BREAKING CHANGE: The /auth endpoint now returns tokens nested under
"data" key instead of root level. Update clients accordingly.

Before: { "access_token": "..." }
After:  { "data": { "access_token": "..." } }
```

### With issue reference
```
fix(login): handle email with leading whitespace

Closes #1234
Refs #5678
```

### Revert
```
revert: feat(auth): add password reset via email

This reverts commit a1b2c3d4.
Reverting due to security issue found in production.

Refs INCIDENT-42
```

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable

## Anti-patterns

- ❌ `update code`
- ❌ `fix bug`
- ❌ `WIP`
- ❌ `final commit` / `final final`
- ❌ Mixed changes: don't combine feature + refactor + fix in one commit
- ❌ Past tense: `added feature` (use `add feature`)
- ❌ Vague scope: `fix(misc): ...` (be specific)

## Splitting Commits

If your change is hard to summarize in one subject, split it:

```bash
# Instead of one big commit
feat(profile): redesign UI, add export, fix bug

# Split into focused commits
refactor(profile): extract user info component
feat(profile): redesign user info layout
feat(profile): add CSV export
fix(profile): correct date format in display
```


---

# skill: markdown-report-docx

Use when a project or course report must ship as a polished .docx from one Markdown source (cover, contents, figures).

# Markdown Report → .docx

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและขั้นตอน ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** Markdown คือต้นฉบับ .docx คือผลที่สร้างจากต้นฉบับ
> แก้ที่ .md แล้วรันสคริปต์ใหม่ทุกครั้ง ไม่เปิด Word แก้มือ เพราะรอบหน้าจะหายหมด

ต้นแบบมาจากรายงานโครงงาน X Fitness Chatbot (29 หน้า): ปกโลโก้กลางหน้า · สารบัญ · ตารางหัวสีแบรนด์อ่อน · กล่องหมายเหตุ · รูปพื้นเข้มพร้อมคำบรรยาย · ตารางสั้นไม่ขาดข้ามหน้า

## เมื่อไหร่ใช้

- รายงานโครงงาน รายงานส่งอาจารย์ รายงานผลทดสอบ เอกสารส่งมอบที่เนื้อหาเขียนเป็น Markdown อยู่แล้ว
- ต้องสร้างรายงานซ้ำหลายรอบ (ผลทดสอบเปลี่ยน → รันใหม่ ได้ไฟล์หน้าตาเดิม)

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ |
|---|---|
| เอกสารทางการแบบปกมีแถบสี กล่อง metadata ตารางลงนาม (SRS · BRD · ข้อเสนอ) | `branded-document-design` เรียก `BrandDoc` ตรง |
| สไลด์นำเสนอ | `html-slide-deck` หรือ `presentation-design` |
| เอกสารที่อยู่ในรีโปเป็น Markdown อย่างเดียว | `polished-document-style` |

---

## 1 · ขั้นตอน

1. เขียนเนื้อหาใน `docs/<ชื่อ>.md` ตาม [`polished-document-style`](../polished-document-style/SKILL.md) · ใส่ front matter (ข้อ 2)
2. รัน `python scripts/md_to_docx.py docs/<ชื่อ>.md -o docs/<ชื่อไฟล์ส่งมอบ>.docx --pdf`
   - สคริปต์ใช้ `brandkit.py` จาก `branded-document-design/scripts/` ที่อยู่ข้างกัน ต้องมี `python-docx`
   - `--pdf` ใช้ Word บน Windows (อัปเดตสารบัญให้ด้วย) ไม่มี Word → LibreOffice
3. แปลง PDF เป็นภาพแล้ว**เปิดดูทุกหน้า** ตามข้อ 5 · เจอปัญหา → แก้ที่ .md แล้วรันใหม่
4. ตั้งชื่อไฟล์ส่งมอบตาม [`document-naming`](../document-naming/SKILL.md) เช่น `XFitness-Chatbot_Project-Report-v1.0.docx`

ลองดูตัวอย่างครบทุกองค์ประกอบ: `python scripts/md_to_docx.py assets/example-report.md --pdf`

## 2 · Front matter

```yaml
---
title: X Fitness Chatbot                      # ชื่อใหญ่สีแบรนด์บนปก
subtitle: เอกสารการพัฒนาโครงงานและผลการทดสอบ   # บรรทัดรองตัวหนา
meta: วิชา 06048308 · ฉบับ 1.2 · 10 ตุลาคม 2569 # บรรทัดเล็กใต้ชื่อรอง
note: ผู้พัฒนา 68076040 ชื่อ นามสกุล            # ตัวเอียงสีเทา (ไม่บังคับ)
logo: ../assets/logo-on-light.png             # path เทียบกับไฟล์ .md (ไม่บังคับ)
logo_width_cm: 6.5
brand: E10613          # สีหลัก: หัวข้อ H1 ชื่อปก เลขข้อ
brand_deep: 8E0A12     # หัวข้อ H2 ตัวหนังสือหัวตาราง โค้ดในบรรทัด
brand_tint: FDECEC     # พื้นหัวตาราง
brand_tint_2: FEF6F6   # พื้นแถวสลับ (ตารางเกิน 6 แถว)
---
```

ค่าเสริม: `brand_2` (สี accent รอง) · `toc: no` (ไม่ใส่สารบัญ) · `footer: Page` (คำหน้าเลขหน้า ค่าเริ่มต้น "หน้า") · `figure_width_cm` (ค่าเริ่มต้น 17) · `cover_top_pt` (ระยะจากขอบบนถึงโลโก้ ค่าเริ่มต้น 150)

**สีมาจากเจ้าของงาน** — ดูดสีจากโลโก้หรือหน้าเว็บของลูกค้า ไม่มี → ใส่ `brand: 2A78D6` (ค่าประจำบ้าน) เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · `brand_tint` ต้องอ่อนพอให้ตัวหนังสือ `brand_deep` อ่านชัด (contrast ≥ 4.5:1)

## 3 · Markdown แต่ละแบบกลายเป็นอะไร

| เขียนใน .md | ได้ใน .docx |
|---|---|
| `# 1. หัวข้อ` · `##` · `###` | หัวข้อ 3 ระดับ สีแบรนด์ อยู่ในสารบัญ ไม่ค้างท้ายหน้า · **ใส่เลขข้อเอง** |
| ย่อหน้า มี `**ตัวหนา**` · `` `โค้ด` `` | เนื้อความเทาเข้ม · ตัวหนาสีเข้ม · โค้ดฟอนต์ monospace สี `brand_deep` |
| ตาราง `\| … \|` | หัวพื้น `brand_tint` · คอลัมน์แรกตัวหนา · กว้างตามความยาวข้อความ · เกิน 6 แถวมีแถวสลับสี · ไม่เกิน 8 แถวอยู่หน้าเดียวกันทั้งตาราง · หัวตารางซ้ำเมื่อข้ามหน้า |
| `> ข้อความ` | กล่อง "หมายเหตุ" พื้นเทา |
| `> [!TIP]` · `[!WARNING]` · `[!IMPORTANT]` · `[!CAUTION]` · `[!NOTE]` | กล่องข้อแนะนำ · ข้อควรระวัง · สำคัญ · อันตราย · หมายเหตุ |
| `![คำบรรยาย](path.png)` | รูปกลางหน้า + "รูปที่ N — คำบรรยาย" ตัวเอียง อยู่หน้าเดียวกับรูป |
| `1. …` | เลขข้อสีแบรนด์ ตั้งเลขใหม่ทุกรายการ |
| `- …` | bullet |
| ```` ``` ```` | กล่องโค้ดพื้นเทา |
| `<!-- pagebreak -->` | ขึ้นหน้าใหม่ |
| `---` · `<!-- อื่น ๆ -->` | ข้าม |

บรรทัดที่อยู่ก่อนตาราง (ย่อหน้านำหรือกล่องหมายเหตุ) ถูกผูกให้อยู่หน้าเดียวกับตาราง

## 4 · กฎเขียนให้ออกมาสวย

- **ตารางคือเครื่องมือหลัก** — ข้อมูลที่มีหัวข้อ + รายละเอียดเขียนเป็นตาราง 2 คอลัมน์ ดีกว่าย่อหน้ายาว
- **เซลล์ตารางไม่เกิน ~170 ตัวอักษร** — ยาวกว่านั้นตัดไปเขียนใต้ตาราง
- **รูปพื้นเข้มหรือพื้นขาวเลือกแบบเดียวทั้งเล่ม** · กว้าง 1600–2000 px · วาดด้วย [`diagram-figures`](../diagram-figures/SKILL.md) แล้ว export PNG
- **ผลทดสอบมาจากไฟล์ผลจริง** — สร้างตารางผลด้วยสคริปต์แล้วแทรกระหว่าง `<!-- RESULTS:START -->` กับ `<!-- RESULTS:END -->` ใน .md ก่อนรัน ไม่พิมพ์ตัวเลขเอง
- **ข้อมูลจำลองต้องบอก** — กล่องหมายเหตุ 1 บรรทัดตั้งแต่หน้าแรกของเนื้อหา
- **หัวข้อไม่ใส่อีโมจิ** · กล่องละ 1 สัญลักษณ์ที่สคริปต์ใส่ให้แล้ว

## 5 · ตรวจด้วยตา — ห้ามข้าม

```bash
python -c "import pymupdf; d=pymupdf.open('report.pdf'); [p.get_pixmap(dpi=70).save(f'_to_delete/p{i+1:02}.png') for i,p in enumerate(d)]"
```

เปิดภาพทุกหน้า (Read tool) แล้วไล่เช็ก:

- [ ] ปก: โลโก้ไม่แตก ชื่อไม่ขึ้นบรรทัดใหม่กลางคำ
- [ ] สารบัญมีเลขหน้าครบ (ว่าง → เปิดใน Word กด F9 หรือใช้ `--pdf` บน Windows)
- [ ] ไม่มีหน้าที่เกือบว่าง · ไม่มีหัวข้อค้างท้ายหน้า · คำบรรยายรูปไม่หลุดไปหน้าถัดไป
- [ ] คอลัมน์ตารางไม่ตัดชื่อหรือรหัสกลางคำ — ถ้าตัด ย่อข้อความในคอลัมน์ที่ยาวที่สุด
- [ ] สีแบรนด์ตรงกับโลโก้ (ไม่มีแบรนด์ → ค่าประจำบ้าน + `(รอยืนยัน)`) · ไม่มีสีฟ้าค่าเริ่มต้นของ Word หลงเหลือ
- [ ] ไม่มี placeholder `[...]` หลงเหลือ · `(รอยืนยัน)` ไม่ใช่ placeholder ให้คงไว้ และทุกจุดอยู่ในรายการรอยืนยันของรายงาน

## 6 · Anti-patterns

- ❌ **แก้ .docx ใน Word แล้วส่ง** — รันใหม่เมื่อไรก็หาย · แก้ที่ .md
- ❌ **ใช้ List Number ของ Word** — นับต่อข้ามรายการ สคริปต์จึงใส่เลขเอง
- ❌ **ภาพหน้าจอขนาดเล็กขยายเต็มหน้า** — แตก ให้ถ่ายใหม่ที่ความกว้าง ≥ 1600 px
- ❌ **ตารางกว้าง 7 คอลัมน์ขึ้นไปในหน้าแนวตั้ง** — แยกเป็น 2 ตาราง
- ❌ **ส่งโดยไม่ได้เปิดดู PDF** — ดูข้อ 5

## 7 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| เพิ่มองค์ประกอบที่สคริปต์ไม่มี (KPI · pill · ลงนาม · หน้าแนวนอน) | เรียก `BrandDoc` ใน [`branded-document-design`](../branded-document-design/SKILL.md) ต่อจาก `build()` |
| สไลด์คู่กับรายงานชุดเดียวกัน สีเดียวกัน | [`html-slide-deck`](../html-slide-deck/SKILL.md) |
| ชื่อไฟล์และเวอร์ชัน | [`document-naming`](../document-naming/SKILL.md) |
| รูปในรายงาน | [`diagram-figures`](../diagram-figures/SKILL.md) |
