# ADAPT — เอา SuperUser ไปใช้กับ plugin ของคุณ

plugin `superuser` คือหัวหน้างาน 1 คน ใช้ได้ 2 แบบ:

1. **ติดตั้งตัวเดียว** — `/superuser:superuser` ทำงานได้ทันทีกับงานทั่วไป (หาข้อมูล · ทำเอกสาร · ตรวจงาน · งานยาว) · skill เอกสารหลัก (`polished-document-style` · `document-naming` · `spell-out-abbreviations` · `polite-message-th-en`) อยู่ในแกน · เอกสารออกแบบ สไลด์ รูปประกอบ อยู่ใน `software-company` · ภาพ AI อยู่ใน `graphic-design` · ประชุม อยู่ใน `personal-life`
2. **เป็นแกนให้ plugin สาขา** — plugin ของคุณประกาศ `dependencies` แล้วมี `skills/superuser/SKILL.md` ของตัวเองที่มี**เฉพาะส่วนสาขา** (playbook · agent · เกณฑ์ · รออนุมัติ) และบรรทัดแรกบอกให้เปิดแกนก่อน

---

## 0 · แกน กับ โมดูล — อะไรอยู่ตรงไหน และใครตัดสินใจ

SuperUser คือหัวหน้างาน 1 คน: แจกงาน · ประเมินลูกน้อง · จัดการงาน · ตรวจซ้ำจนสำเร็จ ด้วยลูกน้อง effort ต่ำ · กฎแยกคือ **หัวหน้าทำงานไม่ได้ถ้าขาด → แกน · ทำได้แต่ดีขึ้น → โมดูล** · โมดูลเปิดปิดได้ต่อโฟลเดอร์งานใน `.claude/superuser/config.json` · ค่าเริ่มต้นเปิดทุกตัว

| อยู่ไหน | มีอะไร | ไฟล์ |
|---|---|---|
| **แกน** (อ่านทุกงาน · ปิดไม่ได้) | จัดขนาด + งบ (เร็ว/สมดุล/คุณภาพ ปรับทั้งลูกทีมและผู้ตรวจ) · ใบสั่งงาน 5 ข้อในข้อความส่งงาน · แจกงานขนาน + ระดับโมเดลคู่ effort · ประเมินลูกทีม (ผ่าน/แก้/ทำใหม่ + โปรไฟล์) · ตรวจซ้ำด้วยผู้ตรวจตัวใหม่จนผ่าน · คำตอบ 3 ระดับ · ประหยัด token · หัวหน้าเรียนรู้ตัวเอง (คาด/จริง รวม token จาก SUMMARY) | `skills/superuser/SKILL.md` (แกน ไฟล์เดียว) · `references/lead-playbook.md` → `~/.claude/superuser/LEAD-PLAYBOOK.md` · `templates/TEAM.md` → `~/.claude/superuser/TEAM.md` |
| **แกนที่เปิดเมื่อถึงจังหวะ** | ถามครั้งเดียว · ตัดสินใจเอง · โหวต · รู้ความเสี่ยง · รู้จังหวะหยุด · รายการรออนุมัติทุกสาขา | `references/autonomy.md` |
| **โมดูล** (ปิดได้) | `context` · `log` (log + token ราย agent ใน SUMMARY) · `improvements` · `learning` · `inbox` · `handoff` (ใบสั่งงานเป็นไฟล์ + ใบส่งงาน) · `patterns_advanced` (MoA · Reranker) · `review_gate` · `split_gate` | `references/modules.md` · `templates/config.json` · `hooks/superuser-hook.mjs` (`moduleOn`) · `references/learning-loop.md` · `references/team-files.md` |
| **skill เอกสารของแกน** | เอกสาร Markdown (`polished-document-style`) · ชื่อไฟล์ (`document-naming`) · คำย่อ (`spell-out-abbreviations`) · ข้อความสุภาพ (`polite-message-th-en`) | `plugins/superuser/skills/` · skill เอกสารออกแบบ สไลด์ รูปประกอบ (`branded-document-design` · `presentation-design` · `diagram-figures` …) อยู่ใน `software-company` · ภาพ AI (`image-generation`) ใน `graphic-design` · ประชุม (`meeting-prep-card` · `meeting-summary`) ใน `personal-life` |
| **สาขา** (plugin อื่นต่อยอด) | agent ของสาขา · playbook ของสาขา · เกณฑ์ตรวจของสาขา · รออนุมัติของสาขา · skill เฉพาะทาง | `plugins/<สาขา>/` ประกาศ `dependencies` · ไม่คัดลอก skill agent hook กลาง |
| **ส่วนตัว** (ของเจ้าของเครื่อง ไม่อยู่ใน plugin) | ค่าตั้งต้น · กฎส่วนตัว · อนุญาตล่วงหน้า | `~/.claude/superuser-style.md` |

สิ่งที่สาขาส่งเข้าแกนได้ (extension contract): `agents/*.md` · `skills/superuser/SKILL.md` ส่วนสาขา · `skills/superuser/references/playbook-*.md` · `examples.md` · `triggers.md` · `review` ขั้น 1 · `unattended-run` หัวไฟล์ · `context-template` หัวข้อ "ค่าของ plugin นี้" — นอกนั้นแก้ที่แกนแล้ว sync

---

## 1 · อะไรเป็นของกลาง อะไรปรับได้

| ส่วน | ของกลาง (อยู่ใน `plugins/superuser` ที่เดียว ไม่คัดลอก) | ปรับตามสาขา (อยู่ใน plugin สาขา) |
|---|---|---|
| `skills/superuser/SKILL.md` | แกนทั้งไฟล์ (หัวข้อ 1–9) · Claude Code เปิดให้ทาง `superuser:superuser` | `SKILL.md` ของสาขา: frontmatter · บรรทัด "เปิด `superuser:superuser` ก่อน" · กฎเพิ่มเลข 11 ขึ้นไป · ตาราง playbook · เกณฑ์ 3 ข้อ · ตาราง agent · รออนุมัติของสาขา · ตัวอย่างตารางสถานะ · ไฟล์กลางของสาขา · **ห้ามมีบล็อก `<!-- superuser:begin -->` อีก** (sync `--check` จับ) |
| playbook และ reference | ทั้งไฟล์ คัดลอกไปทุกสาขาเพื่อให้ลิงก์ในสาขาใช้ได้: `playbook-learn-from-session.md` · `playbook-template.md` · `learning-loop.md` · `brief-template.md` · `team-files.md` · `evidence.md` · `team-roles.md` · `voting.md` · `templates/improvements-queue.md` · `lead-playbook.md` · `templates/TEAM.md` · `templates/config.json` · บล็อก `review-steps` ใน `playbook-review.md` (ขั้น 2–6) · `unattended-steps` ใน `playbook-unattended-run.md` · `context` ใน `references/context-template.md` · `autonomy.md` และ `modules.md` อยู่ที่แกนที่เดียว (เปิดผ่านแกน) | playbook ของสาขา · `review` ขั้น 1 และหัวไฟล์ · `unattended-run` หัวไฟล์ (`ลูกทีมต่อชิ้น` · `ผู้ตรวจต่อชิ้น` · `รออนุมัติที่เจอบ่อย`) · `context-template` หัวข้อ "ค่าของ plugin นี้" · `triggers.md` · `examples.md` (ตัวอย่างอย่างเดียว ห้ามเขียนกฎซ้ำกับแกน) |
| skill | หัวหน้างานและเอกสารหลัก 31 ตัวใน `plugins/superuser/skills/` (รายการจริงใน `SHARED_ONLY_IN_SUPERUSER` ของ `sync-superuser.mjs`) · skill เอกสารออกแบบ สไลด์ รูป ประชุม อยู่ใน plugin สาขาที่ใช้มากสุด (`software-company` · `graphic-design` · `personal-life`) สาขาอื่นอ้างด้วยชื่อ plugin | skill ของสาขา · ส่วนเฉพาะสาขาของ skill กลางเขียนเป็นไฟล์ใน `skills/superuser/references/` ของสาขา (ตัวอย่าง: `software-company` → `code-extensions.md`) |
| agent | `brainstormer` · `reviewer` (ค่าเริ่ม `sonnet` + `medium` · งานใหญ่หรืองบคุณภาพหัวหน้าส่ง `model: opus`) · `learning-reviewer` | agent ตามบทบาทของสาขา · ผู้ตรวจเฉพาะทาง (เพิ่มชื่อลง `CHECKERS` ใน `scripts/check/validate-marketplace.mjs`) |
| hook | `hooks/` ทั้งโฟลเดอร์ (hook · กฎประจำตัว `core-rules.md` · ตัวบอก skill `skill-router.json`) | — |
| ค่าเริ่มต้นของ superuser (sync ไม่คัดลอก) | — | playbook `research` · `document` · `pickup-and-pause` และ `templates/CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md` คัดลอกไปตอนตั้งสาขาใหม่ แล้วเก็บ ปรับ หรือลบก็ได้ |

ทุก plugin รับบล็อกกลางของ `playbook-review.md` และ `playbook-unattended-run.md` เหมือนกัน ส่วนที่เป็นของงานโค้ดของ `software-company` อยู่นอกบล็อก (หัวไฟล์และขั้น 1) · plugin ที่จะออกจากบล็อกไหน ต้องเพิ่มชื่อลง `OPT_OUT` ของ `sync-superuser.mjs` พร้อมเหตุผล

**ทำไมของกลางไม่คัดลอกแล้ว** (ตั้งแต่ superuser 2.0.0): สำเนา 6 skill × 12 plugin ทำให้รายการ skill ของทุก session ยาว 49,564 ตัวอักษร เกินงบ 30,000 ของ Claude Code จนคำอธิบายถูกตัด และ hook ทำงานซ้ำ 12 ครั้งต่อเหตุการณ์ · ตั้งแต่ 3.0.0 `SKILL.md` ของสาขาก็ไม่คัดลอกแกนแล้ว (สำเนา 11 ไฟล์ × 50 KB → ส่วนสาขา 11–13 KB) · ชุดใน `dist/` (zip ของ claude.ai · Codex · Gemini · Kimi) ไม่มีระบบ dependencies สคริปต์ build จึงใส่ของกลางลงชุดของทุก plugin และรวมแกน + ส่วนสาขาเป็น `SKILL.md` ไฟล์เดียว

ของกลางแก้ที่ plugin `superuser` ที่เดียว แล้วรัน:

```
node scripts/sync/sync-superuser.mjs          # คัดลอกไฟล์กลางของ skill superuser ไปทุก plugin
node scripts/sync/sync-superuser.mjs --check  # ตรวจอย่างเดียว ไม่เขียน
```

`validate-marketplace.mjs` ตรวจด้วยว่าของกลางในทุก plugin ตรงกับต้นฉบับ ถ้าไม่ตรงจะขึ้น error

---

## 2 · ขั้นตอนทำ superuser ของสาขาใหม่

1. สร้างโครง plugin: `.claude-plugin/plugin.json` ใส่ `"dependencies": [{ "name": "superuser", "version": "^3.0" }]` · `skills/` · `agents/` · คำสั่ง (ถ้ามี) เป็น skill ที่ตั้ง `disable-model-invocation: true`
2. คัดลอก `skills/superuser/` ของ plugin สาขาที่ใกล้เคียง (เช่น `personal-life`) มาเป็นต้นแบบ แล้วรัน `node scripts/sync/sync-superuser.mjs` ให้ไฟล์กลางตามไปครบ · ห้ามคัดลอก skill · agent · hook กลาง และห้ามคัดลอกแกนจาก `plugins/superuser/skills/superuser/SKILL.md` (sync ตรวจแล้วขึ้น error)
3. แก้ `SKILL.md` ของสาขาตามตารางข้อ 3 · คงบรรทัด "เปิด `superuser:superuser` ก่อน" ไว้ใต้ชื่อเรื่อง
4. รัน `node scripts/check/validate-marketplace.mjs` ให้ผ่าน แล้ว `node scripts/sync/sync-docs.mjs`
5. ลองงานจริง 3 งาน (เล็ก · กลาง · ใหญ่) แล้วดูว่าจัดขนาดและเลือก playbook ถูกไหม และ token ใน `log/SUMMARY.md` ตรงกับที่คาด

---

## 3 · ต้องปรับอะไรบ้าง ใน `SKILL.md` ของสาขา

| หัวข้อ | ปรับอะไร | ตัวอย่างจาก plugin `personal-life` |
|---|---|---|
| frontmatter `description` | งานของสาขา ≤ 160 ตัวอักษร ห้ามมี `: ` (YAML พัง) · แบบ "Use when <งานสาขา> spans several steps (<งานตัวอย่าง>) or the user says superuser for <สาขา>." · คำว่า superuser ต้องผูกกับสาขา ไม่งั้นติดตั้ง 3 plugin แล้วติดพร้อมกันทั้ง 3 ตัว | "Use when career work spans several steps (application, CV, interview, offer, promotion) or the user says superuser for a career task." |
| หัวเรื่อง · บรรทัดชี้แกน · บรรทัดใต้ | ชื่อทีม · บรรทัด "เปิด `superuser:superuser` ก่อน" (ห้ามตัด) · ทีมนี้ทำงานอะไร ส่งต่อเรื่องไหนให้ผู้เชี่ยวชาญ | ข้อพิพาทแรงงาน → จัดข้อเท็จจริงแล้วส่งต่อศาลแรงงานหรือทนาย |
| 1 · กฎ | "ของจริงที่ใช้ตรวจตามข้อ 2" และกฎเฉพาะสาขา 1–3 ข้อ เลข 11 ขึ้นไป (ข้อ 0–10 อยู่ในแกน) · ที่จดการตัดสินใจถ้าไม่ใช่ `CONTEXT.md` | ไม่แต่งประสบการณ์หรือวุฒิ · ตัวเลขเงินเดือนตลาดต้องมีแหล่งและปี |
| 2 · ตาราง playbook | 4–7 playbook ของงานที่เกิดบ่อยในสาขา + `review` · `unattended-run` · `learn-from-session` · ทุกขั้นจบด้วย `ใคร:` ตาม `playbook-template` (validator ตรวจ) | `job-application` · `interview` · `offer-negotiation` · "ร่าง CV · ใคร: `career-coach` ตัวใหม่" |
| 3 · ตัวกระตุ้น | ตารางสถานการณ์ → skill ของสาขา · งานข้ามสาขา → plugin อื่น ใน `references/triggers.md` | มีนัดสัมภาษณ์ → `interview-prep` + agent `interview-coach` |
| 4 · เกณฑ์งาน | 3 ข้อที่ "เสร็จ" ของสาขานี้ต้องผ่าน + skill ที่ใช้ตรวจ | จริง · ตรงเป้า · พร้อมใช้ |
| 5 · agent | ตาราง agent ตามบทบาท · งานข้ามสาขา · ตัวอย่างระดับโมเดลใน `references/examples.md` | CV → `career-coach` · สัมภาษณ์ → `interview-coach` |
| 6 · รออนุมัติ | สิ่งที่ย้อนไม่ได้ของสาขานี้ (เพิ่มจากรายการทุกสาขาใน `autonomy.md`) · ตัวอย่างงานที่ย้อนได้ไปที่ `examples.md` | กดส่งใบสมัคร · ตอบรับข้อเสนอ · ยื่นลาออก |
| 7 · ตัวอย่างตารางสถานะ | 1 แถวที่เป็นงานจริงของสาขา | CV ภาษาอังกฤษ · คำค้นครบ 12 คำ |
| 9 · ไฟล์กลาง | ตัวอย่างโฟลเดอร์งาน · แม่แบบ `CONTEXT.md` · ข้อมูลที่ห้ามใส่ · ตัวอย่างรูปแบบการทำงานใน `examples.md` | ห้ามใส่เงินเดือนจริงใน CONTEXT |

---

## 4 · กติกาที่ต้องคงไว้

- มีหัวหน้าทีม 1 ตัวต่อโฟลเดอร์งาน และลูกทีมรายงานกลับหัวหน้าเท่านั้น
- เข้าใจงานและจัดขนาดก่อนเลือก playbook · ทุกชิ้นที่ส่งลูกทีมมีใบสั่งงาน 5 ข้อ
- ทุกขั้นตรวจกับของจริง ข้อเท็จจริงสาธารณะต้องมี ≥ 3 แหล่งยืนยัน
- งานที่ย้อนไม่ได้ให้เข้า "รออนุมัติ" ส่วนการจ่ายเงิน ใส่รหัสผ่าน ลบข้อมูลจริง และ CAPTCHA อนุญาตล่วงหน้าไม่ได้
- ไฟล์ทำงานอยู่ใน `.claude/superuser/` ไม่วางที่รากโปรเจกต์ · `CONTEXT.md` เป็นไฟล์กลาง จบทุกงานด้วยรอบเรียนรู้ และไม่แก้ skill เองระหว่างทำงานอื่น
- ทุกคำตอบเขียนตาม `human-writing`
