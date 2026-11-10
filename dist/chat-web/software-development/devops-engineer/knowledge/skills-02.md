# skill: simplicity-first

Use when shaping a software BRD, SRS, FSD, ADR, architecture or roadmap to fewest parts. Code → lazy-coding; other → simplify.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`. The suite-wide rule for every kind of work is `simplify`; this skill is its detail for documents, plans and architecture.

## Check before submitting — 5 items

1. **A tired teammate gets it** in 6 months with no prior context.
2. **Simplest thing that works** — fewest moving parts, boring proven patterns; add complexity only when something breaks.
3. **Every new component, option or layer has evidence it is needed now**, and leaving it out would cost something real.
4. **Nothing can be deleted without losing meaning** — deleting beats adding.
5. **Reads in one pass** — no jargon the audience lacks, an example for every abstract claim, the whole thing fits in two sentences.

Any "no" or "not sure" → simplify before delivering.

## By output type

### Documents (BRD, FSD, ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (Representational State Transfer (REST), queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (user experience (UX), application programming interface (API))

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## Examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various
initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a
dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".


---

# skill: postmortem-template

Use when writing a post-incident review or blameless postmortem of a production outage.

# Blameless Postmortem Template

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง
> ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

## When to use this skill

- After any production incident: a full postmortem for SEV1 / SEV2, repeated SEV3, security, customer-facing or data-integrity incidents; a short writeup for any other SEV3 and for SEV4
- After a near-miss that could have been a major incident
- After significant bugs that reached production
- After a security incident

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เหตุยังเกิดอยู่ ต้องรู้ว่าจะทำอะไรตอนนี้ | `incident-runbook-template` |
| บั๊กธรรมดาที่ไม่ได้ทำให้ระบบจริงล่ม | `bug-report-template` |
| action item "เพิ่ม load test" (ระบบล่มเพราะคนเยอะหรือ connection pool เต็ม) | `load-testing` — ตั้งเกณฑ์ p95 กับอัตรา error · ด่านอนุญาตก่อนยิง · smoke ใน CI |

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** แบบรายงานเหตุขัดข้องขององค์กร · ระดับความรุนแรงที่องค์กรนิยามไว้ (SEV/P1–P4) · postmortem ฉบับก่อนใน `docs/postmortems/` หรือที่ผู้ใช้ชี้
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** ใช้ชื่อระดับความรุนแรงขององค์กร · หลักไม่กล่าวโทษบุคคล ไทม์ไลน์ และ action item ที่มีเจ้าของยังต้องมีทุกแบบ

## Core Principles

1. **Blameless** — focus on systems and processes, not individuals
2. **Honest** — don't soften facts to protect feelings
3. **Actionable** — every postmortem produces concrete action items
4. **Educational** — others should learn from this

## Severity Levels

| Level | Definition | Response Time |
|-------|-----------|---------------|
| **SEV1** | Total outage, data loss, security breach | Immediate, 24/7 |
| **SEV2** | Major feature down, significant user impact | Within 1 hour |
| **SEV3** | Degraded service, partial impact | Within business hours |
| **SEV4** | Minor issue, no user impact | Next business day |

## Output Template

```markdown
# Postmortem: <Short Incident Title>

**Date of Incident:** YYYY-MM-DD
**Date of Postmortem:** YYYY-MM-DD
**Severity:** SEV1 | SEV2 | SEV3 | SEV4
**Duration:** XX hours XX minutes
**Authors:** <names>
**Status:** Draft | Final

---

## 1. Summary

<3-5 sentences for executives: what happened, impact, what we did, what we learned>

## 2. Impact

- **User-facing:** Yes | No
- **Users affected:** ~XX,XXX (X%)
- **Duration:** XX min
- **Revenue impact:** $XXX (if known)
- **Data loss:** None | Minor | Significant
- **SLA breached:** Yes | No
- **Regulatory implications:** None | <describe> — ข้อมูลส่วนบุคคลรั่ว → `pdpa-compliance` ข้อ 8 (แจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลภายใน 72 ชั่วโมง เมื่อเข้าเงื่อนไข)

## 3. Timeline

All times in UTC.

| Time | Event |
|------|-------|
| HH:MM | First customer complaint |
| HH:MM | On-call paged by alert |
| HH:MM | Investigation started |
| HH:MM | Root cause identified |
| HH:MM | Mitigation deployed |
| HH:MM | Service restored |
| HH:MM | All clear confirmed |

## 4. What Happened (Detailed)

### Trigger
What set it off? (deploy · config change · traffic spike · dependency outage · scheduled job) — keep separate from the root cause and from how we noticed

### Detection
How was the incident detected? Was it automated alerting or customer report?
- Time to detect (TTD): XX minutes
- Could we have detected faster? How?
- If a person noticed before any alert, name the gap type (adapted from `incident-postmortem` in claude-tag-plugins · opened 2026-11-10): **coverage** = no rule watched it · **late** = a rule exists but fired too slowly · **noise** = it fired and was ignored. The action item fixes that type (new rule · tighter threshold or window · remove or merge noisy alerts) → alert rules in `observability-basics`.

| Measure from first user impact | Minutes |
|---|---|
| Time to detect (TTD) | XX |
| Time to mitigate (impact stops growing) | XX |
| Time to recover (fully back to normal) | XX |

### Investigation
What did we look at? What did we rule out?
- Tools used: ...
- Wrong turns / red herrings: ...

### Mitigation
What stopped the bleeding? (Not necessarily the fix)
- Time to mitigate (TTM): XX minutes

### Resolution
What was the permanent fix?
- Time to resolve (TTR): XX minutes

## 5. Root Cause Analysis

Use **5 Whys** technique:

- Why did the service go down? → Database queries timed out
- Why did queries time out? → Connection pool exhausted
- Why was the pool exhausted? → A new endpoint didn't release connections
- Why didn't it release connections? → Missing `finally` block
- Why wasn't this caught? → No load tests for that endpoint

**Root cause:** <one-sentence statement>

**Contributing factors:**
- ...
- ...

## 6. What Went Well

- Monitoring alerted within X minutes
- Rollback completed quickly thanks to ...
- Team collaboration on Slack was effective
- ...

## 7. What Went Wrong

- Took X minutes longer than needed because ...
- Runbook was outdated
- Required engineer was offline; no backup
- ...

## 8. Where We Got Lucky

- Issue happened during business hours; would have been worse at night
- Customer X didn't notice because they were also having maintenance
- ...

## 9. Action Items

| # | Action | Owner | Type | Priority | Due Date |
|---|--------|-------|------|----------|----------|
| 1 | Add monitoring for X | @alice | Prevent | P1 | YYYY-MM-DD |
| 2 | Update runbook | @bob | Mitigate | P2 | YYYY-MM-DD |
| 3 | Add load test for endpoint (see `load-testing`) | @charlie | Prevent | P1 | YYYY-MM-DD |

**Action types:**
- **Prevent:** stops this from happening again
- **Detect:** catches it sooner if it happens
- **Mitigate:** reduces impact when it happens
- **Process:** improves how we respond

## 10. Lessons Learned

What can other teams learn from this?
- Lesson 1: ...
- Lesson 2: ...

## 11. Supporting Information

- Incident channel: #inc-XXX
- Status page updates: <link>
- Customer communications: <link>
- Graphs / dashboards: <link>
- Related PRs: <links>
```

## Blameless Language Guide

| ✗ Blameful | ✓ Blameless |
|------------|--------------|
| "Alice deployed the bug" | "A bug was deployed in PR #123" |
| "Bob should have caught this in review" | "The review process didn't catch this; we should add automated checks" |
| "QA missed this case" | "Our test coverage didn't include this scenario" |
| "Someone forgot to..." | "The process doesn't ensure that..." |
| "Human error" | "The system allowed the mistake to happen" |

## Quality Checklist

- [ ] Timeline includes specific times (not vague "morning of")
- [ ] Root cause goes deep enough (not just "bug in code")
- [ ] Action items have owners AND due dates
- [ ] Action items are tracked in actual ticket system
- [ ] Blameless language throughout
- [ ] Reviewed by someone NOT involved in incident
- [ ] Shared with broader team for learning

## Common Mistakes

- "Lessons learned: be more careful" — not actionable
- Single root cause when there are usually multiple factors
- Action items without owners → never done
- Skipping postmortem because "minor" — near-misses teach us most
- Hiding postmortems — share widely for org learning
- Blame language even when "talking about systems"

### Quick postmortem (SEV3 not repeated · SEV4 · near-miss)

One block in the incident channel or ticket, same day — no meeting. Trigger · Detection · action-item Type are the same words as the full template (แนวคิดจาก Google SRE postmortem example):

```markdown
**Quick postmortem:** <title> · SEV3 · YYYY-MM-DD · <XX min>
- Trigger → impact: <what set it off> → <who felt what>
- Detection: <alert | customer | chance> after <XX min>
- Mitigation: <what stopped it> after <XX min> from first impact · recovered after <XX min>
- Root cause: <one sentence>
- Action: <one item> · @owner · Type <Prevent | Detect | Mitigate | Process> · due YYYY-MM-DD
```

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


---

# skill: polished-document-style

Use when a kept doc (report, proposal, Word, PDF) needs headings, tables, theme. Wording → human-writing · designed look → branded-document-design.

# Polished Document Style

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **เส้นแบ่ง:** skill นี้ดูแลหน้าตา (หัวข้อ ตาราง กล่องข้อความ ธีม) · ถ้อยคำทุกบรรทัดเป็นของ `human-writing` — เอกสารที่คนเก็บไว้อ่านเปิดทั้งคู่

## When to use this skill

- Output is meant for **general readers** (managers, executives, clients, customers)
- Document needs **sign-off** or formal review
- Output will be **shared widely** or converted to PDF/Word later · any doc with 3+ sections or 500+ words
- จัดหน้าเอกสารที่คนเก็บไว้อ่านทุกชนิด (Markdown · Word · PDF) รวมถึงข้อความไทยในไฟล์ Office

## When NOT to use

- Internal notes for the author's own team (keep them concise)
- Quick scratch notes · code comments
- A whole Markdown report that must come out as one .docx → `markdown-report-docx` (plugin `software-development`)

> **Note:** This skill governs the *markdown source*. When the deliverable is a
> rendered **.docx / .pptx / .pdf** that a stakeholder will open, use
> `branded-document-design` (plugin `software-development`) on top of it — that skill carries the design tokens,
> the typography scale, Thai typography rules, and the `brandkit.py` builder.

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/markdown-patterns.md](references/markdown-patterns.md) | ถ้าจะเขียนส่วนหัว สารบัญ กล่องข้อความ ตาราง ป้ายสถานะ cover block ตารางเทียบตัวเลือก ส่วนเซ็นรับ หรืออภิธานศัพท์ ให้เปิดดูตัวอย่าง markdown แล้วลอกไปใช้ |
| [scripts/check_outline.py](scripts/check_outline.py) | ถ้า skill ที่เขียนเอกสารมีไฟล์แบบใน `assets/` ให้รัน `python scripts/check_outline.py <แบบ.md> <เอกสาร.md>` ก่อนส่ง — ตรวจหัวข้อครบและเรียงตามแบบ ช่องตัวหนาครบ หัวตารางตรง และไม่มีช่องที่ยังไม่เติม · ในแบบ ใส่ `<!-- optional -->` ท้ายหัวข้อหรือช่องที่ไม่บังคับ · แก้ตัวตรวจแล้วรัน `--self-test` ก่อน |
| [references/theme-colors.md](references/theme-colors.md) | ถ้าต้องเลือกสีหลักของเอกสาร หรือใส่สีจริงลงรูป ไฟล์ .docx หรือสไลด์ ให้เปิดดูวิธีประกาศธีม ใครคุมสีส่วนไหน และค่าสีตั้งต้นประจำบ้าน |
| [references/thai-office.md](references/thai-office.md) | ถ้าสร้างไฟล์ Word · Excel · PDF ที่มีภาษาไทย ให้เปิดดูก่อนเรื่องฟอนต์ การจัดย่อหน้า และการส่งออก |

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** มาตรฐานเอกสารของลูกค้าหรือองค์กร: แม่แบบ Word/Google Docs ที่ลูกค้าให้ · เอกสารฉบับก่อนในโปรเจกต์ (`docs/` · `ref/`) · ข้อกำหนดเรื่องรูปแบบใน TOR หรือสัญญา
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** หัวเอกสาร ลำดับหัวข้อ และธีมในไฟล์นี้เป็นค่าสำรอง · ความอ่านง่าย (หัวข้อชัด ตารางอ่านได้) ใช้ทุกแบบ

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

**รูปในเอกสารโปรเจกต์ (รายงาน · ข้อเสนอ · ผังขั้นตอน · ผังข้อมูล) วาดด้วย `diagram-figures` ซึ่งเป็น house style เดียว แล้วฝังเป็นไฟล์ภาพ** · Mermaid (`software-diagrams` ใน plugin `software-development`) ใช้แค่รูปด่วนใน README · PR · โน้ตในโค้ด
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
- [ ] Every flow or relationship has a diagram drawn with `diagram-figures` (plugin `software-development` · house style), not default Mermaid
- [ ] Callout boxes for tips/warnings (not just paragraphs)
- [ ] Code blocks have language hints
- [ ] Glossary for docs with 5+ abbreviations (ตัวย่อตั้งแต่ 5 ตัว)
- [ ] No placeholder text (TBD, TODO, Lorem ipsum) — `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders; keep them
- [ ] Tested rendering in the real viewer (Word · PDF · GitHub preview)

> ไดอะแกรมในเอกสารโปรเจกต์อยู่ใน `diagram-figures` · เอกสารโค้ด (Mermaid ด่วน · ข้อกำหนดซอฟต์แวร์) → ส่วนเพิ่มใน plugin `software-development`

## Anti-patterns

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

รูปในเอกสารโปรเจกต์วาดด้วย `diagram-figures` (plugin `software-development` · house style) แล้วฝังเป็นไฟล์ภาพ · Mermaid ใช้แค่รูปด่วนใน README · PR ไม่ใช้ในเอกสารที่ส่งต่อ

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
ไฟล์ .docx จาก `branded-document-design` · สไลด์จาก `presentation-design` (ทั้งสามอยู่ใน plugin `software-development`)
ถ้าแต่ละตัวเลือกสีเอง ผู้อ่านจะได้เอกสารที่รูปสีหนึ่ง หัวข้อสีหนึ่ง และสไลด์อีกสีหนึ่ง

**markdown เป็นต้นฉบับหลัก (source of truth) จึงประกาศธีมไว้ที่นี่** — ใส่ไว้ท้ายส่วนหัวของเอกสารหรือในไฟล์ข้างกัน:

```markdown
<!-- doc-theme: accent=<สีหลัก> · ที่มา=<แบรนด์ลูกค้า / เสนอจากเนื้องาน> · ยืนยันเมื่อ=YYYY-MM-DD -->
```

**สีหลักมาจากเนื้องาน ไม่ใช่จากค่าเริ่มต้นของเครื่องมือ**
ถ้ามีสีแบรนด์อยู่แล้วให้ใช้สีนั้น ถ้ายังไม่มีให้ค้นต้นแบบตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · ค้นสดไม่ได้จึงใช้ค่าตั้งต้นประจำบ้าน เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนที่เข้ากับเนื้องานไว้ในรายงาน
(คลังสำรอง: ตารางจับคู่เนื้องานกับโทนสีอยู่ใน `colour-by-domain` ของ skill `diagram-figures` (plugin `software-development`))

markdown เองไม่มีสี จึงใช้คำกำกับและน้ำหนักตัวอักษรแทน ส่วนไดอะแกรม รูป ไฟล์ .docx และสไลด์อ่านค่าจาก `doc-theme` ถ้า `doc-theme` ยังไม่ประกาศ accent เฉพาะงาน ให้ใช้ค่าตั้งต้นประจำบ้าน ตารางทั้งสองอยู่ข้างล่าง

**คำสถานะไม่ขึ้นกับธีม** — วิกฤต · ผ่าน ใช้คำเดิมทุกเอกสาร ส่วนสีของสถานะในรูป .docx และสไลด์อยู่ข้างล่าง

## ใครคุมสีส่วนไหน

| ส่วนของเอกสาร | ใครคุมสี | อ่านค่าจาก |
|---|---|---|
| หัวข้อ ตาราง กล่องข้อความใน markdown | markdown ไม่มีสี ใช้คำกำกับตัวหนาและน้ำหนักตัวอักษรแทน | — |
| ไดอะแกรม Mermaid | `diagram-figures` → `references/engine-mermaid.md` (README · PR: `software-diagrams` ข้อ 2 ใน plugin `software-development`) | `doc-theme` |
| รูปที่เป็นไฟล์ภาพ | `diagram-figures` (plugin `software-development`) | `doc-theme` |
| ไฟล์ .docx / .pdf ที่ส่งออก | `branded-document-design` (plugin `software-development`) ข้อ 0–1 | `doc-theme` |
| สไลด์ | `presentation-design` (plugin `software-development`) | `doc-theme` |

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

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

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
4. ลงมือที่ตัว render (ไม่แก้ทีละไฟล์ .docx) → render ทุกฉบับ → **ด่านสวยของเอกสาร**: ผู้ตรวจ 2 ตัวใหม่ดูภาพหน้าจริง (ปก · สารบัญ · หน้าเปิดบท · หน้าตารางยาว · หน้ารูป) ใช้ 5 แกนข้างบน ใช้คะแนนที่ต่ำกว่า · เพดาน **3 รอบ** (รายละเอียดเพิ่มที่ `ui-craft/references/states-and-checks.md` ใน plugin `software-development` ถ้าติดตั้ง) · คะแนนทุกรอบลง `docs/BUILD-PLAN.md`
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

- Word ถือว่าไทยเป็น *complex script* — **ห้ามตั้งฟอนต์/ขนาด/ตัวหนาเองด้วยมือ** ใช้ `style_run()` ใน `brandkit.py` (ตั้ง `w:szCs` `w:bCs` `w:iCs` และ `w:rFonts` ครบ 4 ช่อง)
- ฟอนต์ละตินกับไทยคนละตัว → ตั้ง `bk.FONT` กับ `bk.LATIN_FONT` แล้วเรียก `bk.thai_runs(doc.element.body)` กับทุก header/footer ก่อน `save()`
- ระยะบรรทัด 1.3–1.35 (Tahoma) (ค่ากลางอยู่ใน `human-writing` `references/thai-line-breaking.md`) · **ห้าม justify** ย่อหน้าไทย · ส่ง PDF ให้ export จาก Word จริง หรือเปิดตรวจด้วยตาก่อน (LibreOffice ตัดคำไทยต่างจาก Word)
- Linux ไม่มี Tahoma → Loma/Sarabun · ReportLab จัดวรรณยุกต์ผิด

รายละเอียดกับดักฟอนต์คู่ · ฝังฟอนต์ · ฟอนต์ variable · ตัวไทยดูเล็กบน Linux → [`references/thai-fonts.md`](references/thai-fonts.md) — เปิดเมื่อตั้งฟอนต์หรือ PDF เพี้ยน

---

## 3 · โครงหน้าเอกสาร Word

โครงเอกสาร: หน้าปก (โปรเจกต์มีโลโก้และ mockup แล้ว → ปกเฉพาะโปรเจกต์ตามหัวข้อ 0.2 · ไม่มีตัวตนใช้แบบตั้งต้น) → สารบัญ (field TOC) → เนื้อหา (H1 มีเลขข้อ · keep-with-next ทุกหัวข้อ) → ตารางลงนามอนุมัติ · footer "หน้า N" กลางหน้า สีเทา 9pt · โครงเต็มทีละบรรทัด → [`references/word-layout.md`](references/word-layout.md) หัวข้อ "โครงหน้าเอกสาร"

**ปกเข้ม** (แอปหรือแบรนด์ใช้หน้าจอสีเข้ม) → `doc.cover(..., style="night")` · ตัวอย่าง `scripts/example_srs.py` · ภาพ `examples/example_srs-preview.png` · รายละเอียดและบทเรียนจากเจ้าของงาน → [`references/word-layout.md`](references/word-layout.md) กฎที่ต้องจำทุกครั้ง:
- ภาพพื้นปกและโลโก้ห้ามอยู่ใน header หน้าแรก (Word แสดงจางตอนแก้ไฟล์) — ยึดกับย่อหน้าแรกของปก

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

**เด็ค Stage** (ค่าเริ่มต้นของเด็คที่ใช้พูด): สี `accent`/`bg` ถอดจากงานต้นทางตาม `presentation-design` `references/deck-theme.md` (`source_palette.py` พิมพ์บรรทัด `StageDeck(...)` ให้) · ต้นทางไม่มีสี ให้หาตาม `diagram-figures` ข้อ 5 · พื้นสว่าง `FFFFFF` คู่ `block=True` (ปกและหน้าคั่นบทเป็นสีหลักทึบ) เป็นค่าเริ่มต้น ใช้พื้นเข้มเมื่องานต้นทางเข้ม · ไม่มีสีเลยใช้ `#2A78D6` พื้น `FFFFFF` + `(รอยืนยัน)` · รายละเอียด → `references/brandkit-usage.md`

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
| ไดอะแกรมที่จะเอามาแปะเป็นรูป | `diagram-figures` (รูปออกแบบ) · `software-diagrams` (plugin `software-development`) (Mermaid) → export PNG → `figure()` |
| อ่านไฟล์ Office ที่ลูกค้าส่งมา | `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` |
| สเปรดชีตส่งมอบ | `anthropic-skills:xlsx` (โทเคนสีชุดเดียวกันใช้ได้) |
| เนื้อหาและความครบถ้วนของเอกสาร SRS | `srs-writing` (plugin `software-development`) |
| โครงเรื่องและเลย์เอาต์ของสไลด์ | `presentation-design` |
| เด็คนำเสนอเป็น .html ไฟล์เดียว | `html-slide-deck` (มี .pptx แล้วใช้ทางเข้าจาก .pptx ใน skill เดียวกัน) |
| ไดอะแกรมที่วาดด้วย Mermaid ธีมเดียวกัน | `software-diagrams` (plugin `software-development`) |
| ที่มาของระบบสีและตัวอักษร · โลโก้ | `graphic-design` (plugin `software-development`) |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

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
          head_font="Chakra Petch", body_font="IBM Plex Sans Thai", block=False, **colors)
# accent / bg = สีหลักกับสีพื้นจากดีไซน์ของโปรเจกต์ · colors = สีที่โปรเจกต์กำหนดไว้แล้ว เช่น text="1B2430"
# block=True = cover() และ section() เป็นพื้นสีหลักทึบเต็มแผ่น ตัวอักษรบนนั้นได้ ≥ 4.5:1 (ขาว เกือบดำ หรือดำ)
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

- **สีมาจากดีไซน์ของโปรเจกต์ 2 ค่า** คือ `accent` (สีหลัก) กับ `bg` (สีพื้น) หาตามลำดับใน `diagram-figures` ข้อ 5 (`doc-theme` → ดีไซน์ในโค้ด เช่น `--primary` · `--background` · ธีม Tailwind · โหมดมืด/สว่างของแอป → โลโก้และชุดแบรนด์ → ยังไม่มีเลยใช้สีประจำบ้าน `#2A78D6` พื้น `FFFFFF` แล้วเขียน `(รอยืนยัน)`) ห้ามใช้สีของต้นแบบ · งานที่นำมาทำเด็คมีสีของตัวเอง ให้ถอดด้วย `presentation-design/scripts/source_palette.py` ก่อน · เด็คพื้นสว่างใส่ `block=True` ให้ปกและหน้าคั่นบทเป็นสีหลักทึบเต็มแผ่น (`presentation-design` `references/deck-theme.md`)
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
6. **เฉพาะชุดเอกสารซอฟต์แวร์** (BRD · SRS · FSD ที่ปกต้องมาจากรูปทรงโลโก้หรือ mockup จริง · ใช้เครื่องสร้างปก) → ถ้ามี plugin `software-development` ดู `doc-cover-design` เพิ่ม · ไม่มีก็ทำตามข้อ 1–5 ได้ครบ


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

> **กับดัก complex script:** Word ถือว่าภาษาไทยเป็น *complex script* คนละชุดกับ latin
> ถ้าตั้งแค่ `run.font.size` / `run.font.bold` ตัวอักษรไทยจะ **ไม่เปลี่ยนตาม**
> ต้องตั้ง `w:szCs`, `w:bCs`, `w:iCs` และ `w:rFonts` ให้ครบทั้ง `ascii/hAnsi/cs/eastAsia`
> ฟังก์ชัน `style_run()` ใน `brandkit.py` จัดการให้แล้ว **ห้ามตั้งฟอนต์เองด้วยมือ**

> **กับดักฟอนต์คู่:** ถ้าใช้ฟอนต์ละตินกับฟอนต์ไทยคนละตัว เช่น Noto Sans + Noto Sans Thai
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
| แดง | อันตราย · ห้าม · ลบทิ้ง · ผิดพลาด · เลยกำหนด | `critical` · สถานะ "ค้าง/ล้มเหลว" · ขั้นที่ทำลายข้อมูล · เส้นที่พัง |
| เหลือง/ส้ม | ระวัง · รอดำเนินการ · ข้อแม้ · ทางที่ไม่ใช่เส้นหลัก | `warning` · สถานะ "กำลังทำ" · โซน/เส้นข้อยกเว้น (`#C77A11`) |
| เขียว | สำเร็จ · ผ่าน · ปลอดภัย · เสร็จแล้ว | `success` · สถานะ "เสร็จ" · ผลลัพธ์ที่ยืนยันแล้ว |
| สีหลัก (สีแบรนด์ ไม่มีแบรนด์ใช้น้ำเงินประจำบ้าน) | ข้อมูล · การกระทำหลัก · เส้นทางปกติ | `tip` · ปุ่มหลัก · กล่อง/เส้นเส้นทางหลัก |
| ม่วง | คำถาม · ทางเลือก · หมายเหตุเสริม | `question` · ของเสริมที่ไม่บังคับ |
| เทา | เป็นกลาง · ปิดใช้งาน · ของภายนอก | `note` · ระบบภายนอก · ส่วนที่ปิดอยู่ |

กฎเดียว: **เลือกสีตามความหมาย ไม่ใช่ตามความสวย** อย่าใช้แดงเพราะอยากให้เด่น ใช้แดงเฉพาะเมื่ออันตรายหรือผิดจริง และไดอะแกรมก็ใช้ชุดความหมายเดียวกันนี้ (ดู `software-diagrams` · `diagram-figures` ที่มี `EXCEPT_HUE` ส้มสำหรับทางที่ไม่ผ่านเส้นหลัก)

> **เกณฑ์ที่ต้องผ่านทุกชุดสี:** เนื้อความและ `text_muted` บนพื้น ≥ 4.5:1 · H2 และหัวตาราง (`brand_deep`) ≥ 7:1 ·
> H1 และตัวเลข KPI (`brand` ตัวใหญ่ ตามนิยามตัวใหญ่ของ WCAG 2.2 ข้อ 1.4.3) ≥ 3:1 ·
> พิมพ์ขาวดำแล้วยังแยกลำดับชั้นออก ถ้าไม่ผ่านให้ปรับความเข้ม ไม่เปลี่ยนสี
>
> **ตัวอย่างชุดสีที่เคยใช้จริง** (ไม่ใช่ค่ามาตรฐาน อย่าคัดลอกไปใช้โดยไม่ดูเนื้องาน) → `references/palette-examples.md`

> **เปลี่ยนแบรนด์ทั้งชุดในบรรทัดเดียว:**
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
> **ภาพพื้นปกและโลโก้บนปก ห้ามวางใน header ของหน้าแรก** — Word แสดงทุกอย่างใน header เป็นสีจางระหว่างอ่านหรือแก้ตัวเอกสาร ปกเข้มทั้งหน้าจึงดูซีด (ใน PDF ไม่จาง จึงตรวจจาก PDF อย่างเดียวไม่เจอ — เจ้าของงานทักว่า "ดูซีด ๆ") ให้ยึดภาพแบบลอยหลังข้อความไว้กับย่อหน้าแรกของปกแทน และตั้ง `relativeHeight` แบบที่ Word ใช้ (ภาพพื้น 251658240 · ภาพที่อยู่เหนือขึ้นไปเพิ่มทีละ 1024) เพราะ Word จะเรียงเลขน้อย ๆ อย่าง 1, 2, 3 ใหม่ตอนบันทึก แล้วภาพพื้นจะทับโลโก้

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
8. **ปก — ตัวอักษรล้วนก่อน ภาพทีหลัง** (ปกเฉพาะโปรเจกต์ที่ใช้รูปทรงโลโก้หรือหน้าจอจริง แทนภาพตกแต่ง → `doc-cover-design` (plugin `software-development`))**:** ภาพประกอบบนปกไม่บังคับ และปกโล่งที่จัดตัวอักษรดีชนะภาพที่ไม่ว้าวเสมอ · แบบที่ผ่านด่าน: ชนิดเอกสาร (SRS · FSD · ARCH) ตัวใหญ่ 150–200px สีแบรนด์เป็นจุดเด่นเดียว (กว้างไม่เกิน ~85% ของคอลัมน์ · ชื่อเกิน 5 ตัวอย่าง TESTPLAN แยก 2 บรรทัด ไม่ย่อจนเล็กกว่าฉบับอื่น — ทั้งชุดต้องดูขนาดเท่ากัน) → เส้นสั้นสีแบรนด์ → ชื่อไทย → ชื่ออังกฤษ → บรรทัดสรุป 1 ประโยค (≥ 12pt คอลัมน์แคบ) → แถวข้อมูลท้ายหน้า (ป้าย ≥ 10pt) · ที่เหลือปล่อยว่าง · ส่วนที่ตำแหน่งตายตัว (โลโก้ · ชนิดเอกสาร · เส้น · ป้ายสถานะ) วาดลงภาพพื้นปก ส่วนชื่อและข้อมูลเป็นข้อความ Word ให้ค้นและแก้ได้ · ป้าย `(รอยืนยัน)` บนพื้นมืดใช้สีเตือนแบบสว่าง ไม่ใส่พื้นไฮไลต์ · **ผู้ใช้บอกปกไม่สวย → ตัดภาพตกแต่งออกก่อน** (เส้นโค้ง จุดเรือง gradient) แล้วทำปกตัวอักษรล้วน 3 แนวให้เลือก (โปรเจกต์มีโลโก้หรือ mockup → ใช้ `doc-cover-design` ข้อ 7 แทน)


---

# skill: diagram-figures

Use when a document, plan, proposal, slide or print (business plan, shop process, budget flow, research, software spec) needs a designed diagram.

> **สีหลักของรูป = สีหลักของโปรเจกต์** · หาตามลำดับในข้อ 5 ถ้าหาไม่เจอเลยจึงใช้ชุดสีประจำบ้าน `#2A78D6` ใน `polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน")

# Diagram Figures

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

skill นี้คือ house style เดียวของรูปที่ต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" มี 3 engine ซึ่งใช้สี ไอคอน และกติกาชุดเดียวกัน

## เลือกทาง

| ต้องการ | ไปที่ |
|---|---|
| รูปในเอกสารงานใดก็ได้ (แผนธุรกิจ · ผังขั้นตอนของร้าน · ผังเงินครอบครัว · สรุปงานวิจัย · เอกสารซอฟต์แวร์ เช่น เอกสารความต้องการทางธุรกิจ (Business Requirements Document — BRD) · ข้อกำหนดความต้องการซอฟต์แวร์ (Software Requirements Specification — SRS) · ผังความสัมพันธ์ข้อมูล (Entity-Relationship — ER)) และรูปที่ต้องดูออกแบบมา สำหรับข้อเสนอลูกค้า · สไลด์ · งานพิมพ์ · เอกสารเซ็นรับ รวมถึงผังคลาวด์ที่ต้องมีโลโก้จริง | **skill นี้ — HTML layout engine** (ค่าเริ่มต้น · ข้อ 2) |
| รูปแบบเดียวกัน แต่ต้อง generate จากข้อมูลหรือโค้ด เช่น ออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือต้องคุมพิกัดบนกริดเอง | **skill นี้ — SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| บล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) ที่ต้องส่งในไฟล์ Word หรือ Portable Document Format (PDF) ให้หน้าตาเหมือนรูปวาดมือ | **skill นี้ — Mermaid engine** ([references/engine-mermaid.md](references/engine-mermaid.md)) |
| ไดอะแกรมด่วนใน README · Pull Request · โน้ตในโค้ด (ไม่ใช่เอกสารโปรเจกต์) | `software-diagrams` (plugin `software-development`) (Mermaid ธีมประจำบ้าน · ถ้าเป็นผังคลาวด์ใน repo ที่ต้องมีโลโก้ ใช้ไลบรารี `diagrams` ใน skill เดียวกัน) |
| ตัดสินใจว่าจะฝังรูปในไฟล์ markdown แบบไหน (inline SVG · ไฟล์ภาพ · ASCII · Mermaid) | [`markdown-visuals`](../markdown-visuals/SKILL.md) |

**กติกาเลือกทาง (ตรงกับ `software-diagrams` และ `markdown-visuals`):** markdown ใน repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) → Mermaid ผ่าน `software-diagrams` · เอกสารโปรเจกต์ (BRD · SRS · Functional Specification Document (FSD) · Architecture Decision Record (ADR) · ER · ผังขั้นตอน) หรือของที่คนนอกทีมอ่าน → skill นี้

ต้นทุนของ skill นี้คือ **เวลา** เพราะ 1 รูปต้องแก้หลายรอบ
ดังนั้นให้ใช้กับรูปที่คนนอกทีมจะเห็น และเห็นซ้ำหลายครั้งเท่านั้น

## 1 · ตอบสามข้อก่อนเปิดไฟล์

1. **รูปนี้ไปอยู่ที่ไหน** — สไลด์ 16:9 · หน้า A4 · หน้าจอ
   แล้วกำหนด `.sheet{width:...}` ตามนั้น: สไลด์ 1600px · A4 แนวตั้ง 1240px · A4 แนวนอน 1750px
2. **ผู้อ่านคือใคร** — ถ้าเป็นลูกค้าที่ไม่ใช่ช่าง ให้เขียนชื่อกล่องเป็นภาษาไทย ส่วนทีมเทคนิคอ่านชื่อจริงของ service
3. **คำถามเดียวที่รูปนี้ตอบคืออะไร** — 1 รูปตอบ 1 คำถาม (กฎเดียวกับ `software-diagrams` (plugin `software-development`))

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
3. ยังไม่มีเลย → **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
4. ค้นสดไม่ได้ → ใช้ชุดสีประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · เสนอโทนจาก [references/colour-by-domain.md](references/colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

เจอสีจากข้อ 2 แล้วแต่ยังไม่มี `doc-theme` ให้ประกาศ `doc-theme` ด้วยค่านั้น เพื่อให้รูป เอกสาร และสไลด์ของโปรเจกต์ใช้สีเดียวกัน

ในโครง HTML แก้ที่ `--accent` ใน `:root` ที่เดียว (SVG/Python engine แก้ `ACCENT` ใน `theme.py`) · สีพื้นตามดีไซน์ของโปรเจกต์ → ต่อท้ายชื่อไฟล์ `#accent=<สีหลัก>&bg=<สีพื้น>` · ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์ (สีโลโก้ผู้ให้บริการ · เทาโครงสร้าง) และ**สีไอคอน 7 กลุ่ม** (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) พร้อมความหมาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบสี" — สีที่ 8 แปลว่าใช้สีเพื่อความสวย

**จำกัดจำนวนสี ไม่ได้จำกัดน้ำหนักของสี** — ในรูปที่ต้องดูออกแบบมา สีหลักต้องเห็นได้ทั่วทั้งรูป ไม่ได้อยู่แค่แถบหัว: ป้ายที่ต้องหาให้เจอเร็ว (เลขขั้น · ผู้รับผิดชอบ · สถานะ) ใช้พื้นทึบ · หัวการ์ดเป็นแถบพื้นสีทึบเต็มความกว้าง (ไม่ใช้แถบสีหนาข้างการ์ดมุมมน เพราะเป็นสัญญาณ AI ใน `no-ai-look`) · กล่องสรุปใช้พื้นสีเข้ม · สีพาสเทลใช้ได้แค่เป็นพื้นที่มีตัวหนังสือหรือขอบสีเข้มคู่กัน · ตรวจด้วยแกน "พลังของสี" ในด่านสวยของ `ui-craft` (`ui-craft/references/states-and-checks.md` (plugin `software-development`))

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

### 7.1 · จัดวาง — ผังขั้นตอนและผังทีม

ผู้ใช้ตั้งกติกานี้หลังเห็นรูปจริง (2026-10-28) เพราะรูปที่เส้นโค้งไปมาและกล่องกระจายไม่เป็นแถวอ่านแล้วงง

- **อ่านจากบนลงล่าง** ชั้นละ 1 ระดับ: ทางเข้า → ตัวกลาง → ผู้รับงาน → ผล · ใช้ซ้ายไปขวาเฉพาะเมื่อมีแกนเวลา (Gantt)
- **ตัวกลางอยู่กลางรูป** (หัวหน้าทีม · ระบบหลัก · กล่อง `.focus`) และจัดทั้งรูปไว้กลางเป็นหลัก ไม่ชิดซ้ายจนอีกฝั่งโล่ง
- **ของที่อยู่ระดับเดียวกันอยู่ในกรอบเดียวกัน แถวเดียวกัน** และมีชื่อกลุ่มบนเส้นขอบ เช่น "ทางเข้า" หรือ "agent 8 ตัว"
  - กรอบเป็นเส้นเดียว ไม่มีพื้น ไม่มีเงา
  - การ์ดในกรอบเดียวกันสูงเท่ากัน
  - มีมากจนแถวเดียวไม่พอ ให้ตัดเป็นหลายแถวในกรอบเดิม และจัดแถวสุดท้ายไว้กลาง
- **ถ้าทุกกล่องในกลุ่มรับของเดียวกัน ให้ลากเส้นเดียวเข้ากรอบ** ไม่แตกเส้นไปทุกกล่อง · ถ้าแต่ละกล่องเป็นทางเลือกต่างกัน ให้ลากเส้นแยกต่อกล่อง แล้วย้ายชื่อกลุ่มไปขอบล่าง เส้นจะได้ไม่ทับชื่อ
- **รางเส้นอยู่นอกกรอบ** — เส้นที่ออกหรือเข้ากลุ่มหักมุมในช่องว่างระหว่างกรอบ ไม่ทับชื่อกลุ่มหรือการ์ด
- **ให้ดูนุ่มนวล** — ช่วงตรงของเส้นยังตั้งหรือนอน แต่ทุกมุมที่หักเป็นโค้งรัศมีราว 12 px (ช่วงสั้นกว่า 24 px ลดรัศมีตาม) · การ์ดมุมมน 14 px · กรอบกลุ่มมุมมน 20 px · ป้ายเป็นแคปซูล · ไม่ใช้มุมแหลมกับกล่องหรือเส้น
- **คำไทยห้ามขาดกลางคำ** — ตัวตัดคำของเบราว์เซอร์แยกบางคำผิด และท่อนที่ได้อาจไม่ตรงขอบคำ (เช่น `เช็|กมิจฉา|ชีพ`) · เก็บรายชื่อคำเหล่านี้ไว้ (ทีละ · สต็อก · ร้านค้า · เช็ก) แล้วห้ามตัดบรรทัดตรงจุดใดที่อยู่กลางคำในรายชื่อ (ห่อด้วย `white-space:nowrap`) · ข้อความยาวที่ไม่มีในรายชื่อ ใส่ `<br>` เองตามข้อ 8 · เปิดรูปดูทุกการ์ด
- **ทุกกล่องมีชื่อและคำอธิบาย 1 บรรทัด** ไม่ใช่มีแค่ไอคอน · ขั้นที่ต่อกันเป็นลำดับ (1 → 2 → 3) ไม่ต้องใส่กรอบ เพราะไม่ใช่ของระดับเดียวกัน

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
- **ของระดับเดียวกันกระจายคนละแถวหรือไม่มีกรอบ · ตัวกลางชิดขอบรูป** — จัดตามข้อ 7.1
- **ไอคอนต่างสไตล์ปนกัน** — เส้นบางปนเส้นหนา ปนไอคอนทึบ
- **รูปจืด: การ์ดขาวเท่ากันทุกใบ เส้นบางเท่ากันทุกเส้น** — อ่านออกแต่ไม่มีจุดเด่น ทำตามข้อ 5.1

## 12 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ไดอะแกรมด่วนใน markdown ของ repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) | `software-diagrams` (plugin `software-development`) |
| เลือกวิธีฝังรูปในไฟล์ markdown | `markdown-visuals` |
| เอารูปไปวางในสไลด์ | `presentation-design` |
| เอารูปไปวางในไฟล์ Word / PDF | `branded-document-design` |
| รูปในเอกสาร SRS | `srs-writing` (plugin `software-development`) |
| สีและระยะห่างของหน้าจอแอป (คนละระบบกับรูปนี้) | `ui-craft` (plugin `software-development`) |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

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
