# skill: decision-log

Use whenever an agent makes a judgment call on its own during long or unattended work (choosing an approach, filling a gap, resolving conflicting docs, skipping something). Appends one auditable row to docs/BUILD-PLAN.md.

# decision-log — ทุกการตัดสินใจเองต้องตรวจย้อนได้

> ให้ agent ทำต่อเองโดยไม่ถามได้ ก็ต่อเมื่อคนกลับมาเห็นได้ว่ามันเลือกอะไรไปบ้าง และกลับคำตัดสินทีละข้อได้

มาจาก `show-me-your-work` ของ pstack · ปรับให้ใช้ไฟล์เดียวกับ [`status-report`](../status-report/SKILL.md)

## เขียนที่ไหน

`docs/BUILD-PLAN.md` หัวข้อ `## ตัดสินใจเอง` — หัวข้อสุดท้ายของไฟล์ · ลำดับเต็ม: `## สถานะล่าสุด` → ตารางงาน → `## ประวัติสถานะ` → `## ตัดสินใจเอง` · ไม่มีหัวข้อหรือไม่มีไฟล์ ให้สร้าง
subagent ไม่เขียนเอง — **รายงานการตัดสินใจกลับมา** ตัวหลักเป็นคนลงตาราง

```markdown
## ตัดสินใจเอง

| วันที่ | งาน | เรื่อง | เลือก | ไม่เลือก | เหตุผล · หลักฐาน |
|---|---|---|---|---|---|
| 2026-10-04 15:40 | SRS | เวลาตอบสนองหน้าค้นหา | ≤ 2 วินาที (รอยืนยัน) | ≤ 1 วินาที | BRD ไม่ระบุ · ใช้ค่าที่ระบบเดิมทำได้ (วัดจริง 1.6 วินาที) |
| 2026-10-04 16:05 | FR-012 | เก็บไฟล์แนบ | ดิสก์ในเครื่อง + path ในฐานข้อมูล | object storage | ขนาดงาน S · ย้ายทีหลังได้ · ADR-004 |
```

## ต้องลงเมื่อ

- เลือกระหว่างหลายทางที่ใช้ได้ทั้งคู่
- เอกสารไม่ได้บอก แล้ว agent เติมค่าเอง
- เอกสารสองฉบับขัดกัน แล้วเลือกยึดฉบับหนึ่ง
- ข้ามขั้นตอนหรือฉบับที่สั่ง เพราะทำไม่ได้หรือไม่จำเป็น
- ผลทดลองตัดสินทางเลือก (จาก playbook `prototype` หรือ `parallel-attempts-pick-best`)

**ไม่ต้องลง** — เรื่องที่ skill หรือเอกสารสั่งไว้ชัดแล้ว · การตั้งชื่อตัวแปรทั่วไป

## หลักการเลือกเมื่อต้องตัดสินเอง

เลือกทางที่ผลกระทบน้อยสุด — ย้อนกลับง่าย · แก้ไฟล์น้อย · ตรงกับที่เอกสารหรือ repo ใช้อยู่ · ไม่ปิดทางเลือกอื่น
**ข้อเท็จจริง** (ตัวเลข ชื่อ วันที่ งบ) ห้ามเดา — ใส่ค่าที่ใช้ชั่วคราวพร้อม `(รอยืนยัน)` แล้วลงคำถามใน "ค้างอยู่" ของ `status-report` · งานที่ย้อนไม่ได้ เตรียมคำสั่งหรือ diff ไว้ใน "รออนุมัติ" — ไม่ทำเอง

## กติกาของแถว

- หนึ่งแถวต่อหนึ่งการตัดสินใจ · ลงทันทีที่ตัดสิน ไม่รวบไปเขียนตอนจบ
- "ไม่เลือก" ต้องมีอย่างน้อยหนึ่งทาง — ถ้าไม่มีทางอื่นเลย ไม่ใช่การตัดสินใจ
- "เหตุผล · หลักฐาน" ระบุที่มา — ไฟล์ · ADR · ตัวเลขที่วัด · ติดป้าย `วัดจริง` / `อนุมาน` เมื่อเป็นตัวเลข
- ไม่ลบแถวเก่า · ผู้ใช้ไม่เห็นด้วย แก้ที่แถวนั้นแล้วสั่งทำใหม่เฉพาะงานนั้น
- **ผู้ใช้เป็นคนตัดสินเอง** (เช่น ยอมรับความเสี่ยงจาก `security-gate`) ลงตารางเดียวกัน แล้วเพิ่มคอลัมน์ท้าย `ผู้ตัดสิน` = `agent` · `ผู้ใช้` · ไม่มีคอลัมน์นี้ = agent ตัดสินทุกแถว

## ในคำตอบตอนจบ

หัวข้อ **ตัดสินใจเอง** ท้ายคำตอบ แสดง**ทุกแถวของรอบนี้** (เลือกอะไร · ไม่เลือกอะไร · ทำไม หนึ่งบรรทัด) แล้วชี้ไปที่ตารางเต็ม
เกิน 15 แถว สรุปเป็นกลุ่มได้ (เช่น "เลือก dependency 6 ตัว") แต่ต้องบอกจำนวนรวมและลิงก์ไปที่ตาราง · แถวที่กระทบผลมากยังต้องแสดงเต็ม


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap, UX, API design, sprint plan). Simplest version that works, the tired-teammate test, no buzzwords or extra layers. For code use lazy-coding.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry
