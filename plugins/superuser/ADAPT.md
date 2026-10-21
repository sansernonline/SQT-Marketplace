# ADAPT — เอา SuperUser ไปใช้กับ plugin ของคุณ

plugin `superuser` คือต้นฉบับของวิธีทำงานแบบ SuperUser ซึ่งใช้ได้ 2 แบบ:

1. **ติดตั้งตัวเดียว** — `/superuser:superuser` ทำงานได้ทันทีกับงานทั่วไป (หาข้อมูล · ทำเอกสาร · ตรวจงาน · งานยาว)
2. **เป็นแม่แบบ** — คัดลอกไปทำ `superuser` ของ plugin สาขาอื่น แล้วปรับเฉพาะส่วนที่เป็นของสาขา

---

## 1 · อะไรเป็นของกลาง อะไรปรับได้

| ส่วน | ของกลาง (ห้ามแก้ใน plugin สาขา) | ปรับตามสาขา |
|---|---|---|
| `skills/superuser/SKILL.md` | บล็อก `<!-- superuser:begin X -->`: `rules` (หัวข้อ 1) · `start` (2) · `team` (5) · `autonomy` (6) · `answer` (7) · `open` (8) · `where` · `improvements` · `learning` (9) · `patterns` (10) | ทุกอย่างนอกบล็อก |
| playbook และ reference | ทั้งไฟล์: `playbook-learn-from-session.md` · `playbook-template.md` · `learning-loop.md` · `brief-template.md` · `team-files.md` · `evidence.md` · `team-roles.md` · `templates/improvements-queue.md` · บล็อก: `review-steps` ใน `playbook-review.md` (ขั้น 2–6) · `unattended-steps` ใน `playbook-unattended-run.md` (ขั้นตอนทั้งหมด) · `context` ใน `references/context-template.md` (sync สร้างจาก `templates/CONTEXT.md` + `templates/IMPROVEMENTS.md`) | playbook ของสาขา · `review` ขั้น 1 และหัวไฟล์ · `unattended-run` หัวไฟล์ (`ลูกทีมต่อชิ้น` · `ผู้ตรวจต่อชิ้น` · `รออนุมัติที่เจอบ่อย`) · `context-template` หัวข้อ "ค่าของ plugin นี้" · `triggers.md` · `examples.md` (ตัวอย่างอย่างเดียว ห้ามเขียนกฎซ้ำกับ `SKILL.md`) |
| skill | `agent-patterns` · `answer-shape` · `commit-log` · `handoff` · `human-writing` · `no-ai-look` · `simplify` — **อยู่ใน `superuser` ที่เดียว ไม่คัดลอก** | skill ของสาขา |
| agent | `brainstormer` · `reviewer` · `learning-reviewer` — อยู่ใน `superuser` ที่เดียว | agent ตามบทบาทของสาขา · ผู้ตรวจเฉพาะทางของสาขา (playbook ใช้แทน `reviewer` ได้ · เพิ่มชื่อลง `CHECKERS` ใน `scripts/check/validate-marketplace.mjs`) |
| hook | `hooks/` ทั้งโฟลเดอร์ (hook · กฎประจำตัว `core-rules.md` · ตัวบอก skill `skill-router.json`) — อยู่ใน `superuser` ที่เดียว | — |
| ค่าเริ่มต้นของ superuser (sync ไม่คัดลอก) | — | `templates/*` ยกเว้น `improvements-queue.md` · playbook `research` · `document` จะถูกคัดลอกไปพร้อมโฟลเดอร์ในข้อ 2 แล้วจะเก็บไว้ ปรับ หรือลบก็ได้ ส่วน plugin สาขาที่มีอยู่แล้วเขียนแม่แบบ `CONTEXT.md` ไว้ในหัวข้อ 9 แทน |

`software-company` เขียน `playbook-review.md` และ `playbook-unattended-run.md` เองทั้งไฟล์ (ตรวจด้วย diff · `BUILD-PLAN.md` · commit ทีละชิ้น) จึงอยู่ใน `OPT_OUT` ของ `sync-superuser.mjs` · plugin อื่นที่จะออกจากบล็อกไหน ต้องเพิ่มชื่อลง `OPT_OUT` พร้อมเหตุผล

**ทำไมของกลางไม่คัดลอกแล้ว** (ตั้งแต่ superuser 2.0.0): สำเนา 6 skill × 12 plugin ทำให้รายการ skill ของทุก session ยาว 49,564 ตัวอักษร เกินงบ 30,000 ของ Claude Code จนคำอธิบายถูกตัด (debug log `Skill listing over budget`) และ hook ทำงานซ้ำ 12 ครั้งต่อเหตุการณ์ · ตอนนี้ plugin สาขาประกาศ `"dependencies": ["superuser"]` ใน `plugin.json` แล้ว Claude Code ติดตั้ง superuser ให้เอง · ชุดใน `dist/` (zip ของ claude.ai · Codex · Gemini · Kimi) ไม่มีระบบ dependencies สคริปต์ build จึงใส่ของกลางลงชุดของทุก plugin ให้ใช้เดี่ยวได้

ของกลางแก้ที่ plugin `superuser` ที่เดียว แล้วรัน:

```
node scripts/sync/sync-superuser.mjs          # คัดลอกของกลางไปทุก plugin
node scripts/sync/sync-superuser.mjs --check  # ตรวจอย่างเดียว ไม่เขียน
```

`validate-marketplace.mjs` ตรวจด้วยว่าของกลางในทุก plugin ตรงกับต้นฉบับ ถ้าไม่ตรงจะขึ้น error

---

## 2 · ขั้นตอนทำ superuser ของสาขาใหม่

1. สร้างโครง plugin: `.claude-plugin/plugin.json` (ใส่ `"dependencies": ["superuser"]`) · `skills/` · `agents/` · คำสั่ง (ถ้ามี) ให้เป็น skill ที่ตั้ง `disable-model-invocation: true`
2. คัดลอก `skills/superuser/` ทั้งโฟลเดอร์จาก `superuser` แล้วรัน `node scripts/sync/sync-superuser.mjs` ให้ไฟล์กลางของ skill นี้ตามไปครบ · ห้ามคัดลอก skill · agent · hook กลาง (sync ตรวจแล้วขึ้น error)
3. แก้นอกบล็อก ตามตารางข้อ 3
4. รัน `node scripts/check/validate-marketplace.mjs` ให้ผ่าน แล้ว `node scripts/sync/sync-docs.mjs`
5. ลองงานจริง 3 งาน (เล็ก · กลาง · ใหญ่) แล้วดูว่าจัดขนาดและเลือก playbook ถูกไหม

---

## 3 · ต้องปรับอะไรบ้าง

| หัวข้อใน SKILL.md | ปรับอะไร | ตัวอย่างจาก plugin `career` |
|---|---|---|
| frontmatter `description` | งานของสาขา ≤ 160 ตัวอักษร (`validate-marketplace.mjs` ขึ้น error เกินนี้) · แบบ "Use when <งานสาขา> spans several steps (<งานตัวอย่าง>) or the user says superuser for <สาขา>." · คำว่า superuser ต้องผูกกับสาขา ไม่งั้นติดตั้ง 3 plugin แล้วติดพร้อมกันทั้ง 3 ตัว | "Use when career work spans several steps (application, CV, interview, offer, promotion) or the user says superuser for a career task." |
| หัวเรื่อง และบรรทัดใต้ | ทีมนี้ทำงานอะไร · ส่งต่อเรื่องไหนให้ผู้เชี่ยวชาญ | ข้อพิพาทแรงงาน → จัดข้อเท็จจริงแล้วส่งต่อศาลแรงงานหรือทนาย |
| 1 · กฎ | ใต้บล็อก `rules`: "ของจริงที่ใช้ตรวจตามข้อ 2" และกฎเฉพาะสาขา 1–3 ข้อ เลข 10 ขึ้นไป · ที่จดการตัดสินใจถ้าไม่ใช่ `CONTEXT.md` | ไม่แต่งประสบการณ์หรือวุฒิ · ตัวเลขเงินเดือนตลาดต้องมีแหล่งและปี |
| 2 · ตาราง playbook | 4–7 playbook ของงานที่เกิดบ่อยในสาขา + `review` · `unattended-run` · `learn-from-session` · ทุกขั้นของทุก playbook จบด้วย `ใคร:` ตาม `playbook-template` (validator ตรวจ) | `job-application` · `interview` · `offer-negotiation` · "ร่าง CV · ใคร: `career-coach` ตัวใหม่" |
| 3 · ตัวกระตุ้น | ตารางสถานการณ์ → skill ของสาขา · งานข้ามสาขา → plugin อื่น ใน `references/triggers.md` (SKILL.md เหลือลิงก์ 1 บรรทัด) | มีนัดสัมภาษณ์ → `interview-prep` + agent `interview-coach` |
| 4 · เกณฑ์งาน | 3 ข้อที่ "เสร็จ" ของสาขานี้ต้องผ่าน + skill ที่ใช้ตรวจ | จริง · ตรงเป้า · พร้อมใช้ |
| 5 · agent | แถว agent ตามบทบาท · งานข้ามสาขา เหนือบล็อก `team` · ตัวอย่างระดับโมเดลใน `references/examples.md` | CV → `career-coach` · สัมภาษณ์ → `interview-coach` |
| 6 · รออนุมัติ | ใต้บล็อก `autonomy`: สิ่งที่ย้อนไม่ได้ของสาขานี้ · ตัวอย่างงานที่ย้อนได้และลำดับแหล่งข้อมูลทางการไปที่ `references/examples.md` | กดส่งใบสมัคร · ตอบรับข้อเสนอ · ยื่นลาออก |
| 7 · ตัวอย่างตารางสถานะ | 1 แถวที่เป็นงานจริงของสาขา | CV ภาษาอังกฤษ · คำค้นครบ 12 คำ |
| 9 · ไฟล์กลาง | ใต้บล็อก `where`: ตัวอย่างโฟลเดอร์งาน · แม่แบบ `CONTEXT.md` · ข้อมูลที่ห้ามใส่ | ห้ามใส่เงินเดือนจริงใน CONTEXT |
| 10 · ตารางรูปแบบ | ตัวอย่าง 6 รูปแบบในงานของสาขา ใน `references/examples.md` | MoA: ข้อเสนองาน 2 ที่ → 3 มุม แล้วรวม |

---

## 4 · กติกาที่ต้องคงไว้

- มีหัวหน้าทีม 1 ตัวต่อโฟลเดอร์งาน และลูกทีมรายงานกลับหัวหน้าเท่านั้น
- เข้าใจงานและจัดขนาดก่อนเลือก playbook
- ทุกขั้นตรวจกับของจริง ข้อเท็จจริงสาธารณะต้องมี ≥ 3 แหล่งยืนยัน
- งานที่ย้อนไม่ได้ให้เข้า "รออนุมัติ" ส่วนการจ่ายเงิน ใส่รหัสผ่าน ลบข้อมูลจริง และ CAPTCHA อนุญาตล่วงหน้าไม่ได้
- ไฟล์ทำงานอยู่ใน `.claude/superuser/` ไม่วางที่รากโปรเจกต์ · `CONTEXT.md` เป็นไฟล์กลาง จบทุกงานด้วยรอบเรียนรู้ และไม่แก้ skill เองระหว่างทำงานอื่น
- ทุกคำตอบเขียนตาม `human-writing`
