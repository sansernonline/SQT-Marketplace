# skill: principle-prove-it-works

Use when about to say anything is done, fixed, passing or working. Verify against the real thing.

# principle · prove it works — พิสูจน์กับของจริง

> "เสร็จแล้ว" ที่ไม่มีหลักฐาน คือการโยนงานตรวจไปให้คนอื่น

## กฎ

ก่อนใช้คำว่า เสร็จ · แก้แล้ว · ผ่าน · ใช้ได้ ต้องเห็นผลจากของจริงด้วยตาตัวเองในรอบนี้ก่อน

| งาน | หลักฐานที่นับ | ไม่นับ |
|---|---|---|
| ฟีเจอร์ | กดบนแอปที่รันอยู่ด้วย skill ตรวจแอป เห็นผลตามเกณฑ์ | compile ผ่าน · อ่านโค้ดแล้วดูถูก |
| ฟีเจอร์ที่ใช้ฮาร์ดแวร์ (เซนเซอร์ · กล้อง · GPS) | emulator กับค่าที่ฉีดเข้าพิสูจน์ได้แค่**เส้นทางโค้ด** (ติดป้าย `emulator`) ส่วนความแม่นยำต้องลองกับเครื่องจริง (ติดป้าย `เครื่องจริง <รุ่น>`) | emulator ผ่าน แล้วรายงานว่า "ค่าแม่น" |
| แก้บั๊ก | รันกรณีที่เคยล้มซ้ำทางเดิม (หน้าจอหรือ API เดิม) แล้วผ่าน | test อื่นผ่าน |
| test | test ล้มเมื่อโค้ดผิด (ลองทำโค้ดให้ผิดดู 1 ครั้ง) | test ผ่าน |
| mockup | เปิดในเบราว์เซอร์ กดทุกปุ่ม ไม่มีปุ่มหลอก | HTML ถูกไวยากรณ์ |
| เอกสาร | reviewer ตัวใหม่เปิดไฟล์ที่ render แล้ว ตรวจข้อกำหนดทีละข้อ (ตัวที่เขียนไม่อ่านงานตัวเองซ้ำ) | เขียนไฟล์สำเร็จ |
| ตัวเลขที่วัด | รู้ว่าอะไรจำกัดตัวเลขนั้น และวัดซ้ำได้ใกล้เคียง ค่าทางกายภาพ (lux · ระยะ · น้ำหนัก) ต้องเทียบกับเครื่องมือวัดอ้างอิงที่สอบเทียบแล้ว ถ้าไม่มีเครื่องมือให้ติดป้าย `ยังไม่ได้ตรวจ` พร้อมบอกว่าความแม่นยำยังไม่ได้เทียบ | วัดครั้งเดียว · เทียบกับตัวเอง |
| งานของ subagent | อ่าน diff และรันเอง | subagent รายงานว่าเสร็จ |

## วิธีทำ

1. ก่อนลงมือ เขียนว่า "จะรู้ได้อย่างไรว่าเสร็จ" ในรูปที่ตรวจได้
2. หลังทำ ให้ตรวจตามนั้นกับของจริง แล้วบันทึกผลดิบ (ตัวเลข · ภาพ · output)
3. ถ้าตรวจไม่ได้จริง ๆ (ไม่มีสภาพแวดล้อม · ต้องใช้บัญชีจริง) ให้บอกตรง ๆ ว่า `ยังไม่ได้ตรวจ` และขาดอะไร ห้ามเขียน `ผ่าน`

## สัญญาณว่ากำลังข้าม

- คำว่า "น่าจะ" · "ควรจะ" · "ในทางทฤษฎี" ในรายงานจบงาน
- ส่งคำสั่งให้ผู้ใช้ไปรันเอง ทั้งที่เรารันได้
- ตรวจแค่ส่วนที่ง่าย แล้วสรุปรวมว่าผ่านทั้งหมด


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap). Simplest that works.

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
