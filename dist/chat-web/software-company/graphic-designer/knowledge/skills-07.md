# skill: work-session-context

Use at the END of any significant task to save a concise context summary file under .claude/context/ so work can be resumed in a future session (even after closing terminal or switching teammate). Also use at the START of a session to check existing context. Critical for cross-session continuity and team handoff.

# Work Session Context

## When to use this skill

### 📥 At START of session (always)
- Check `.claude/context/INDEX.md` if exists
- Read recent session files to know what's in progress
- Resume from "Next Steps" of latest session

### 📤 At END of significant work (always)
- After completing a task that took > 5 min
- After making decisions worth remembering
- Before stopping for the day
- After a `/feature-kickoff`, `/sprint-plan`, or similar workflow

### 🤝 For team handoff
- When teammate will pick up
- When work spans multiple days
- When work spans multiple Claude sessions

## File Layout (Convention)

```
<project-root>/
└── .claude/
    └── context/
        ├── INDEX.md                                ← latest summaries (rolling)
        └── sessions/
            ├── 2026-05-30-1430-feature-kickoff.md  ← per-session details
            ├── 2026-05-30-1610-code-review.md
            └── ...
```

**Why this location:**
- `.claude/` is Claude Code convention (excluded by most projects' `.gitignore` patterns — but we WANT this committed)
- Git-tracked → team sees + reviews
- Markdown → readable anywhere
- Subfolder `sessions/` → can be archived/cleaned up

> ⚠️ **Make sure `.claude/context/` is NOT in `.gitignore`** — we want this committed.

## Format: Session File

Filename: `YYYY-MM-DD-HHMM-<short-task-slug>.md`

```markdown
# 📝 <Task Title>

| | |
|--|--|
| **Date** | YYYY-MM-DD HH:MM (timezone) |
| **Agent(s)** | business-analyst, system-analyst |
| **Status** | 🟢 Completed \| 🟡 In Progress \| 🔴 Blocked |
| **Duration** | ~XX min |
| **Triggered by** | User request / /feature-kickoff / etc. |

## 🎯 What was done

1-3 sentences. What did we accomplish?

## 🧠 Key decisions

- Decision 1 (why)
- Decision 2 (why)

## 📂 Files touched

- `path/to/file.ts` — what changed
- `path/to/doc.md` — created

## ❓ Open questions

- [ ] Question 1 (needs answer from: @who)
- [ ] Question 2

## ➡️ Next steps

What should happen next? (Critical — this is how we resume.)

1. ...
2. ...

## 🔗 Related

- Previous session: [link](sessions/...)
- Related issue/PR: ...
- Related docs: ...
```

## Format: INDEX.md

Rolling latest-on-top list:

```markdown
# 📚 Work Context Index

Latest sessions at top. Full details in `sessions/`.

---

## 🟡 In Progress

### 2026-05-30 14:30 — Feature kickoff: User membership
- **Agent:** business-analyst
- **Status:** BRD drafted, awaiting stakeholder review
- **Next:** PM to align timeline once BRD approved
- **File:** [sessions/2026-05-30-1430-feature-kickoff.md](sessions/2026-05-30-1430-feature-kickoff.md)

---

## 🟢 Recently Completed

### 2026-05-30 16:10 — Code review: login.ts
- **Agent:** developer
- **Status:** 3 blocking + 5 nit findings, dev fixed
- **File:** [sessions/2026-05-30-1610-code-review.md](sessions/2026-05-30-1610-code-review.md)

### 2026-05-29 11:00 — Sprint planning
- **Agent:** project-manager
- **Status:** Sprint 12 plan finalized, 25 points committed
- **File:** [sessions/2026-05-29-1100-sprint-plan.md](sessions/2026-05-29-1100-sprint-plan.md)

---

## ⚪ Older (archive after 30 days)

(automatically rolled off, or move to sessions/archive/)
```

## Resume Pattern

At session start (if context exists):

```
1. Read .claude/context/INDEX.md
2. Skim recent in-progress + completed
3. For ANYTHING marked 🟡 In Progress:
   - Read full session file
   - Continue from "Next Steps"
4. Acknowledge user with: "I see we were working on X. Last step was Y. Should I continue?"
```

## Writing Discipline

### ✅ Good summaries

```markdown
## 🎯 What was done
Designed authentication flow using OAuth 2.0 PKCE. Chose Stripe Identity
for KYC. Documented in adr/0007-auth.md.

## ➡️ Next steps
1. Solution architect to review ADR (ping @bob)
2. Once approved, dev starts implementation in /src/auth
3. Need API key for Stripe Identity (request from @alice)
```

### ❌ Bad summaries

```markdown
## What was done
Worked on stuff.

## Next steps
TBD.
```

> 💡 **Concise but complete.** Future you (or teammate) needs enough to resume.

## Granularity Rules

### Write a session file when:
- ✅ Completed a feature-kickoff workflow
- ✅ Finished implementing a feature
- ✅ Made architectural decision
- ✅ Concluded code review with findings
- ✅ Designed test plan for a feature
- ✅ Filed a bug report
- ✅ Conducted threat model
- ✅ Completed sprint planning / retro

### Skip session file for:
- ❌ Single chat answer
- ❌ Quick lookup
- ❌ < 5 min work
- ❌ Trivial edits

## Multi-Agent Sessions

If multiple agents worked (e.g., `/feature-kickoff`):

```markdown
## 🎯 What was done

**business-analyst** → BRD draft at docs/brd/membership-v1.md
**solution-architect** → ADR-0007 at adr/0007-auth.md
**system-analyst** → FSD draft at docs/fsd/membership-v1.md
**project-manager** → Sprint plan with 25 points

## ➡️ Next steps
1. Stakeholder review of BRD by Friday
2. Once approved, dev kickoff Monday
```

## INDEX Maintenance

After each session file is written, update INDEX.md:

1. Move new entry to top of "🟢 Recently Completed" (or "🟡 In Progress")
2. Move stale "In Progress" items to "Recently Completed" or archive
3. Move entries older than 30 days to "⚪ Older"
4. Periodically: move ⚪ Older items to `sessions/archive/`

Keep INDEX.md **scannable** — < 50 entries visible at top level.

## Avoid Bloat

- Don't write a session file for every chat
- Don't duplicate content (link to docs, don't copy)
- Don't write "what was discussed" — write "what was decided"
- One session = one task or one workflow
- 200-400 words per session file (1 page max)

## Integration with Other Skills

- **At start of every workflow command** (e.g., `/feature-kickoff`): check context
- **`polished-document-style`** — use for stakeholder-facing output, NOT for session files (those should be quick + scannable)
- **`commit-message-format`** — when committing session file, use: `docs(context): <task summary>`
- **`status-report`** — the project-wide status table lives in `docs/BUILD-PLAN.md` (what passed, stage, pending). Session files here record *how* the work went; link to BUILD-PLAN instead of copying its table

## Sample Workflow

```
User: /feature-kickoff ระบบสมาชิก
       ↓
Claude (orchestrator):
  1. Check .claude/context/INDEX.md ✓
     (no existing membership work — fresh start)
  2. Run business-analyst → BRD
  3. Run solution-architect → ADR
  4. Run system-analyst → FSD
  5. Run project-manager → Plan
       ↓
Workflow done. Now save context:
  - Write sessions/2026-05-30-1430-membership-kickoff.md
  - Update INDEX.md
  - Suggest git commit:
    `git add .claude/context/ && git commit -m "docs(context): kickoff for membership feature"`
       ↓
User closes terminal.
       ↓
Next day, new session:
       ↓
Claude:
  1. Check .claude/context/INDEX.md
  2. Sees 🟡 In Progress: membership kickoff
  3. Reads session file
  4. "I see we kicked off membership yesterday. BRD/FSD/Plan done,
      next step is dev kickoff. Want to proceed?"
```

## Setup Tips (One-time)

If `.claude/context/` doesn't exist yet, create it:

```bash
mkdir -p .claude/context/sessions
touch .claude/context/INDEX.md
echo "# 📚 Work Context Index" > .claude/context/INDEX.md
```

Make sure not gitignored:
```bash
# Check
grep -E "^\.claude" .gitignore

# If listed, refine to allow context:
# .gitignore should NOT include `.claude/` blanket
# OR add specific allow: !.claude/context/
```

## Anti-patterns

- ❌ **Saving everything** — only significant work
- ❌ **Copying chat history** — write decisions, not transcript
- ❌ **Forgetting INDEX.md update** — INDEX is the entry point
- ❌ **Not committing to git** — defeats team handoff purpose
- ❌ **Including secrets** in session files (PII, API keys, etc.)
- ❌ **Vague "Next steps"** — must be actionable


---

# skill: software-diagrams

Use when a software question needs a picture — architecture, how a request flows, what states a record moves through, how tables relate, or what runs where. Picks the diagram type that answers the question and draws it in Mermaid with one shared theme. Routes vendor icons to the Python diagrams library and designed figures to diagram-figures.

# Software Diagrams

> **กฎข้อเดียวของ skill นี้:** ไดอะแกรมตอบ**คำถามเดียว**
> ถ้าตอบสองคำถาม ให้วาดสองรูป

---

> **ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ใช้ค่านั้น** — อย่าเลือกสีใหม่รายรูป
> (ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")

## เมื่อไหร่ใช้ skill นี้

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
| กราฟข้อมูล | `web-app-design` |
| ตัดสินใจเลือกสถาปัตยกรรม | `architecture-patterns` |

---

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
| "ผังคลาวด์ที่มีโลโก้ AWS / Azure จริง ๆ" | Infrastructure — ข้อ 3 |
| "อยากได้รูปสวย ๆ ไว้ใส่ข้อเสนอลูกค้า" | ภาพประกอบ — `diagram-figures` |

> **C4 model** คือวิธีวาดสถาปัตยกรรมเป็นชั้น ๆ เหมือนซูมแผนที่ —
> ระดับ 1 มองจากนอกระบบ · ระดับ 2 เปิดฝาดูข้างใน · ระดับ 3 ซูมเข้าไปในกล่องเดียว
> **วาดระดับ 1 กับ 2 ให้ครบก่อนเสมอ** ระดับ 3 วาดเฉพาะส่วนที่ซับซ้อนจริง

---

## 2 · ธีม — ใช้ชุดเดียวทั้งโปรเจกต์

> **สีหลักมาจากเนื้องาน ไม่ใช่จาก skill นี้**
> ถ้าโปรเจกต์มีสีแบรนด์อยู่แล้ว ใช้สีนั้น ถ้ายังไม่มี ให้เสนอโทนจากเนื้องานแล้วรอยืนยัน
> (ตารางเนื้องาน → โทน อยู่ใน `svg-diagram-system` ข้อ 0)
> **ทั้งไดอะแกรมใช้สีหลักสีเดียว** ที่เหลือเป็นเทาโครงสร้างซึ่งไม่ต้องเปลี่ยนตามแบรนด์

วางบรรทัด `%%{init: ...}%%` ไว้**บรรทัดแรกสุด**ของทุกไดอะแกรม
ชุดเต็มพร้อมตัวอย่างที่เรนเดอร์แล้วอยู่ใน **`assets/mermaid-theme.md`**

```
%%{init: {'theme':'base','fontFamily':'Tahoma, Arial, sans-serif','themeVariables':{
  'fontSize':'13px','primaryColor':'#FFFFFF','primaryTextColor':'<TEXT>',
  'primaryBorderColor':'<LINE>','lineColor':'<LINE_DARK>','clusterBkg':'<BG_SOFT>',
  'clusterBorder':'<LINE>','edgeLabelBackground':'#FFFFFF'}}}%%
```

| ตัวแทนค่า | คือสีอะไร |
|---|---|
| `<TEXT>` | เทาเข้มสำหรับตัวอักษร — ไม่ใช่ดำสนิท |
| `<LINE>` | เทาอ่อนสำหรับเส้นขอบกล่อง |
| `<LINE_DARK>` | เทากลางสำหรับเส้นเชื่อม เข้มกว่า `<LINE>` หนึ่งขั้น |
| `<BG_SOFT>` | เทาอ่อนมากสำหรับพื้นของกลุ่ม |

> ⚠️ **`fontFamily` ต้องอยู่นอก `themeVariables`** — เป็นจุดที่พลาดกันมากที่สุด
> ใส่ไว้ข้างในจะถูกเมินเงียบ ๆ แล้วกลับไปใช้ฟอนต์เริ่มต้นของ Mermaid
> (ทดสอบแล้วกับ Mermaid 11 — ดูหลักฐานใน `assets/mermaid-theme.md`)

**สีในไดอะแกรมใช้ 3 คลาสพอ** — กล่องส่วนใหญ่เป็นสีขาวเส้นเทา **สีหลักสงวนไว้ให้
"ของที่เรากำลังพูดถึง" เท่านั้น** นี่คือที่เดียวในรูปที่สีมีความหมาย

```
classDef focus fill:<ACCENT_TINT>,stroke:<ACCENT>,stroke-width:1.5px,color:<ACCENT_DEEP>
classDef ext   fill:<BG_SOFT>,stroke:<LINE>,color:<TEXT_MUTED>
classDef store fill:#FFFFFF,stroke:<LINE>,color:<TEXT>
```

| ตัวแทนค่า | คือสีอะไร |
|---|---|
| `<ACCENT>` | สีหลักที่ผู้ใช้เลือก |
| `<ACCENT_TINT>` | สีหลักผสมขาวประมาณ 90% |
| `<ACCENT_DEEP>` | สีหลักผสมดำ ให้ contrast ≥ 7:1 บนพื้น `<ACCENT_TINT>` |
| `<TEXT_MUTED>` | เทากลางสำหรับของที่ไม่ใช่จุดสนใจ |

| คลาส | ใช้กับ |
|---|---|
| `focus` | ระบบ/ส่วนที่เอกสารนี้กำลังอธิบาย |
| `ext` | ระบบภายนอก · คน · ของที่เราไม่ได้ดูแล |
| `store` | ฐานข้อมูล · คิว · ที่เก็บไฟล์ |

ถ้ารู้สึกว่าต้องการคลาสที่ 4 — มักแปลว่าไดอะแกรมกำลังตอบสองคำถาม ให้แยกรูป

---

## 3 · ผังที่ต้องมีโลโก้จริง (infrastructure)

เมื่อผู้อ่านคาดหวังจะเห็นไอคอน Amazon Web Services (AWS) · Azure · Kubernetes ของจริง
Mermaid วาดให้ไม่ได้ — ใช้ไลบรารี **`diagrams`** (Python) แทน

| ต้องการ | ใช้ |
|---|---|
| C4 · sequence · state · ER · flowchart | **Mermaid** (ข้อ 2) |
| ผังของจริงบนคลาวด์ พร้อมโลโก้ผู้ให้บริการ | **`diagrams`** (Python + Graphviz) |
| รูปในข้อเสนอลูกค้า · สไลด์ · เอกสารเซ็นรับ ที่ต้องดู "ออกแบบมา" | **`diagram-figures`** |
| ลากวางเอง ปรับตำแหน่งทีละกล่อง | draw.io — คนทำเอง agent ทำแทนไม่ได้ |

> **อย่าวาดสองที่** — เรื่องเดียวกันเลือกเครื่องมือเดียว
> ในทีมพัฒนาใช้ Mermaid (อยู่ใน git · diff ได้ · แก้ง่าย) ·
> เอกสารเสนอลูกค้าหรือผู้บริหารใช้ `diagrams`

### ติดตั้ง

```bash
pip install diagrams
# ต้องมี Graphviz ด้วย ไม่งั้นรันแล้วไม่มีไฟล์ออกมาและไม่มี error
apt install graphviz     # Windows: choco install graphviz   macOS: brew install graphviz
dot -V                   # ตรวจว่าติดตั้งแล้วจริง
```

### เริ่มจากโครงที่ทดสอบแล้ว

คัดลอก **`assets/infra-diagram.py`** ไปแก้ — ตั้งธีมชุดเดียวกับ Mermaid ในข้อ 2 ไว้ให้แล้ว
รายชื่อ node ที่ใช้บ่อยและกับดักที่เจอจริงอยู่ใน **`assets/diagrams-python.md`**

### กติกาเพิ่มจากข้อ 4

- **หนึ่งกล่องต่อหนึ่งหน้าที่ จำนวนใส่ในป้าย** — `"Web / App ×2-6"` อ่านง่ายกว่าวาดกล่องเหมือนกันสามใบ
  (กล่องซ้ำไม่ได้บอกอะไรเพิ่ม นอกจากทำให้เส้นพันกัน)
- **กลุ่มมีแค่ 2 สี** — `BOX` เทาอ่อน กับ `FOCUS` ฟ้า สำหรับส่วนที่เอกสารนี้กำลังพูดถึง
- **ไอคอนต้องเป็นของจริง** — ระบบไม่ได้ใช้ AWS ห้ามหยิบไอคอน AWS มาใช้เพราะสวย
  ใช้ `diagrams.onprem.*` หรือ `diagrams.generic.*` แทน
- ป้ายเส้นยังต้องบอกว่า**อะไรไหลผ่าน** เหมือนเดิม — `SQL` `put object` `session` ไม่ใช่ `ใช้`

### กับดักที่เสียเวลาแน่ถ้าไม่รู้ก่อน

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| `TypeError: unsupported operand type(s) for >>: 'list' and 'list'` | ต่อ list เข้ากับ list ไม่ได้ — วนลูป หรือยุบเป็นกล่องเดียวแล้วใส่จำนวนในป้าย |
| ภาษาไทยสระหาย วรรณยุกต์ลอยผิดที่ | ฟอนต์ไม่รองรับไทย (ค่าเริ่มต้นคือ DejaVu Sans) — ตั้ง `fontname` เป็น Noto Sans Thai · TH Sarabun New · Loma · โครงมี `pick_font()` เลือกให้อัตโนมัติ |
| รูปสูงยาวเป็นเส้นเดียว | `direction="TB"` กับสายยาว — เปลี่ยนเป็น `"LR"` |
| ชื่อกลุ่มโดนเส้นพาดทับ | เพิ่ม `ranksep` / `nodesep` หรือย้ายกล่องที่เส้นวิ่งผ่าน |
| รันแล้วเงียบ ไม่มีไฟล์ | ไม่ได้ติดตั้ง Graphviz — `dot -V` |

เรนเดอร์แล้ว**เปิดดูด้วยตา**ตามเช็กลิสต์ข้อ 6 เหมือนกันทุกข้อ

---

## 4 · กฎที่ทำให้อ่านรู้เรื่อง

**เจ็ดกล่อง** — เกินนี้คนอ่านเลิกอ่าน (นับกล่องจริง ไม่นับ subgraph)

**นับกล่องก่อนวาด ไม่ใช่หลังวาด** — เกินเจ็ดเมื่อไหร่ **หยุด แล้วเสนอการแยกรูปให้ผู้ใช้เลือก**
ห้ามวาดต่อจนครบแล้วค่อยบอกทีหลัง

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
ตกลงตามนี้ไหม หรือจะแบ่งแบบอื่น
```

> **"แยกคนละไฟล์ก็ได้" = ต้องแยก** — ถ้าคำขอเปิดช่องให้แยก และเนื้อหาเกินเพดาน
> ให้ถือว่าเป็นคำสั่งให้แยก ไม่ใช่ทางเลือก

**สามอย่างนี้ห้ามอยู่ในไดอะแกรม** — มันคือคู่มือ ไม่ใช่รูป และทำให้กล่องบานจนผังเบี้ยว

| ห้ามใส่ | ไปอยู่ที่ไหน |
|---|---|
| ตัวเลือกบรรทัดคำสั่ง `--all` `--resume` `--limit N` | `README` หรือ `docs/cli.md` |
| รายการ input/output ของหลายตัว | **ตารางข้างรูป** — คอลัมน์: ส่วนประกอบ · รับอะไร · ให้อะไร · เก็บที่ไหน |
| ชื่อไฟล์หรือ path ครบทุกตัว | ตารางเดียวกัน ใส่ในรูปเฉพาะตัวที่เป็นใจความ |

**คำขอว่า "บอก input/output ด้วย" ไม่ได้แปลว่าให้วาดทุกอย่างเป็นกล่อง** —
กล่องคือสิ่งที่ *ทำงาน* · สิ่งที่ *ไหลผ่าน* เป็นป้ายบนเส้น · *รายละเอียด* เป็นตาราง

**ระดับรายละเอียดเดียวกันทั้งรูป** — มี `PostgreSQL` กับ `OrderRepository.cs` อยู่ในรูปเดียวกัน
คือสัญญาณว่าผสมสองระดับ

**ทุกเส้นต้องมีป้าย** และป้ายต้องบอก**อะไรไหลผ่าน** ไม่ใช่ว่าต่อกันอยู่

```
❌ api --> db
❌ api -->|ใช้| db
✅ api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**ทิศทางเดียว** — บนลงล่าง (`TB`) หรือ ซ้ายไปขวา (`LR`) เลือกแล้วอย่าให้มีเส้นวิ่งย้อน
เส้นย้อนแปลว่าเรียงลำดับกล่องผิด ไม่ใช่ว่าต้องวาดลูกศรสองหัว

**ชื่อกล่อง = สิ่งที่มันทำ ไม่ใช่เทคโนโลยี** เทคโนโลยีใส่บรรทัดที่สองตัวเล็ก

```
❌ [Redis]
✅ ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**มีคำอธิบายสัญลักษณ์ (legend) เมื่อใช้สีหรือรูปทรงสื่อความหมาย** —
ถ้าอธิบายไม่ได้ว่าทำไมกล่องนี้สีต่าง แปลว่าสีนั้นไม่ควรมี

---

## 5 · ภาษาไทยในไดอะแกรม

- **ป้ายเส้นภาษาไทยยาวเกิน 3 คำจะทับเส้น** — ตัดให้สั้น หรือใส่ `<br>` เอง
- **ห้ามใช้ `()` `[]` `{}` ในข้อความ** จะไปชนกับไวยากรณ์ Mermaid — ครอบด้วย `"..."` เสมอ
- **วรรณยุกต์ลอยเหนือกล่อง** เมื่อ `fontSize` เล็กกว่า 12px — อย่าลดต่ำกว่านี้
- ชื่อตารางและชื่อฟิลด์ในไดอะแกรม ER ใช้ภาษาอังกฤษ (ตรงกับฐานข้อมูลจริง)
  ส่วนคำอธิบายใช้ไทยได้

---

## 6 · เรนเดอร์ดูจริง — ห้ามข้าม

ไดอะแกรมที่ไม่เคยเรนเดอร์คือข้อความ ไม่ใช่รูป Mermaid เงียบ ๆ เวลาเจอไวยากรณ์ผิด
บางกรณี และวาดออกมาคนละแบบกับที่คิดบ่อยมาก

```bash
npm i -g @mermaid-js/mermaid-cli
mmdc -i diagram.mmd -o diagram.png -b white -s 2
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

ถ้าจัดวางเองไม่ได้ดั่งใจจริง ๆ ให้เปลี่ยนไปวาด SVG มือตาม `markdown-visuals`

---

## 7 · Anti-patterns

- ❌ **ไดอะแกรมสถาปัตยกรรม 40 กล่อง** — ไม่มีใครอ่าน แยกเป็น C4 หลายระดับ
- ❌ **วาดจนเกินเพดานแล้วค่อยบอก** — ต้องหยุดถามตอนนับได้ว่าเกิน
- ❌ **ยัดตัวเลือกบรรทัดคำสั่งลงในกล่อง** — กล่องบาน ตัวอักษรเล็ก อ่านไม่ออกทั้งรูป
- ❌ **เส้นไม่มีป้าย** — ผู้อ่านเดาเองว่าอะไรไหลผ่าน แล้วเดาผิด
- ❌ **ผสมระดับรายละเอียด** — `Kubernetes` อยู่ข้าง ๆ `UserService.validate()`
- ❌ **สีรุ้ง** — สีต้องมีความหมาย ไม่ใช่ใส่ให้ไม่น่าเบื่อ
- ❌ **วาดทุกกรณี error ใน sequence เดียว** — วาดทางหลักก่อน แล้วแยกรูปกรณีพิเศษ
- ❌ **ER ที่มีทุกตารางในระบบ** — แยกตามโดเมน
- ❌ **ไดอะแกรมที่ไม่มีวันที่และเจ้าของ** — หนึ่งปีผ่านไปไม่มีใครกล้าแก้
- ❌ **ส่งไดอะแกรมโดยไม่เคยเรนเดอร์ดู**
- ❌ **ธีมต่างกันทุกรูปในเอกสารเดียว**

---

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกรูปแบบภาพในเอกสาร markdown | `markdown-visuals` |
| เอกสารรอบ ๆ ไดอะแกรม | `polished-document-style` |
| ฝังในไฟล์ Word / PowerPoint | `branded-document-design` |
| ไดอะแกรมในเอกสาร SRS | `srs-writing` |
| เลือกสถาปัตยกรรมก่อนวาด | `architecture-patterns` |
| รูปที่ลูกค้าจะเห็น ต้องจัดวางเอง | `diagram-figures` |
| บันทึกเหตุผลที่เลือกแบบนี้ | `adr-writer` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`
