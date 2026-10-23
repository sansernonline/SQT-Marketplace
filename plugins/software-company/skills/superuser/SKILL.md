---
name: superuser
description: Use when a non-trivial software task starts (feature, bug, refactor, investigation, review) or says superuser.
---

# SuperUser — ประตูหน้าเดียวของทีม agent

> **เปิด `superuser:superuser` ก่อน** — ไฟล์นี้มีเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) · วิธีทำงานของหัวหน้าทีมทั้งหมด (จัดขนาด · งบ · ใบสั่งงาน 5 ข้อ · แจกงาน · ประเมิน · ตรวจซ้ำ · คำตอบ) อยู่ที่แกนใน plugin `superuser` · ติดตั้ง plugin นี้แล้ว superuser มาเองทาง `dependencies`

เรียกได้ทั้ง `/software-company:superuser` หรือพูดว่า "ใช้ superuser" กับงานซอฟต์แวร์

plugin อื่นมี `superuser` ของตัวเอง (`/<plugin>:superuser`) · รายชื่อใน [`agents`](references/agents.md)

---

## 1 · กฎที่ห้ามข้าม

**กฎเฉพาะของ plugin นี้**

- **ที่จด** — การตัดสินใจลง `decision-log` ใน `docs/BUILD-PLAN.md` แทนตารางใน `CONTEXT.md` · ตารางสถานะใช้ `status-report` · `CONTEXT.md` และจุดส่งต่อตาม `handoff` · ไฟล์ style สร้างด้วย `owner-style-capture`
- **principle ที่อยู่หลังกฎ** — ข้อ 3 `principle-prove-it-works` · ข้อ 4 `principle-proceed-on-reversible-work` (เลขข้อของ `superuser:superuser`) · playbook อ่านอย่างเดียว: `investigation` · `review`

---

## 2 · เข้าใจงาน แล้วเลือก playbook

งานขนาดกลางขึ้นไป เลือก **1** ตัว หรือประกอบตาม `playbook-template` แล้วอ่านทั้งไฟล์ก่อนเริ่ม · เข้าได้ 2 ตัว → ท้าย [`triggers`](references/triggers.md)

| playbook | ใช้เมื่อ |
|---|---|
| [`investigation`](references/playbook-investigation.md) | คำถามอ่านอย่างเดียว — X ทำงานอย่างไร · ทำไมถึงทำแบบนี้ · ควรวางไว้ที่ไหน · เรื่องนอกโค้ด → `prior-art-review` · `reference-app-research` ([`triggers`](references/triggers.md)) |
| [`pickup-and-pause`](references/playbook-pickup-and-pause.md) | ทำต่อจากที่ค้าง · รับงานต่อจาก agent อื่น · หยุดงานให้รับต่อได้ |
| [`new-project`](references/playbook-new-project.md) | เริ่มโปรเจกต์ใหม่ที่ยังไม่มีโค้ด จนรันและพิสูจน์ได้ |
| [`feature`](references/playbook-feature.md) | เพิ่มหรือเปลี่ยนพฤติกรรมของโปรแกรมที่มีอยู่ |
| [`bug-fix`](references/playbook-bug-fix.md) | มีของพัง — error · test ล้ม · หน้าจอผิด · หน่วยความจำรั่ว · ผู้ใช้แจ้ง |
| [`refactor`](references/playbook-refactor.md) | เปลี่ยนโครงสร้างโดยพฤติกรรมเท่าเดิม · ย้ายระบบ |
| [`performance`](references/playbook-performance.md) | ช้า · กินเครื่อง · อยากให้ตัวเลขตัวหนึ่งดีขึ้นถึงเป้า |
| [`visual-parity`](references/playbook-visual-parity.md) | หน้าจอจริงต้องตรงกับ mockup หรือระบบเดิม |
| [`prototype`](references/playbook-prototype.md) | มีทางเลือกที่ตอบได้ด้วยการลองรันจริง ไม่ต้องถามคน |
| [`review`](references/playbook-review.md) | ตรวจโค้ด ดีไซน์ หรือเอกสาร ก่อนส่ง |
| [`ship`](references/playbook-ship.md) | เปิด Pull Request (PR) · ดูแลจน Continuous Integration (CI) เขียว · แก้ตามรีวิว · เตรียม merge |
| [`project-docs`](references/playbook-project-docs.md) | เอกสารโปรเจกต์ตามชุด prompt ของ SQT-Marketplace — Business Requirements Document (BRD) · Software Requirements Specification (SRS) · mockup · Functional Specification Document (FSD) · คู่มือ |
| [`unattended-run`](references/playbook-unattended-run.md) | งานยาวหรือหลายเฟสที่คนไม่อยู่ดู — "ทำให้เสร็จ เดี๋ยวกลับมาดู" · "ทำทั้งคืน" |
| [`skill-authoring`](references/playbook-skill-authoring.md) | เขียนหรือแก้ skill · agent · prompt แล้วทดสอบว่าช่วยจริง |
| [`learn-from-session`](references/playbook-learn-from-session.md) | ผู้ใช้สั่ง "รวมบทเรียน" · "reflect" · แก้ทีมเรื่องเดิมซ้ำ |
| [`housekeeping`](references/playbook-housekeeping.md) | เก็บกวาด worktree · branch · sandbox · image เก่า |

---

## 3 · ตัวกระตุ้น — เจอสถานการณ์นี้ เรียก skill นี้

ตารางสถานการณ์ → skill มีที่เดียวคือ [`triggers`](references/triggers.md) เปิดเมื่อไม่แน่ใจว่าจะเรียก skill ไหน

skill กลาง (หลักการ · ตรวจงาน · แบ่งงาน · เอกสาร · รูป · สไลด์) อยู่ใน plugin `superuser` · ส่วนที่ใช้เฉพาะงานโค้ดของ skill เหล่านั้นอยู่ใน [`code-extensions`](references/code-extensions.md) — เปิดคู่กันเมื่องานเป็นโค้ด

---

## 4 · เกณฑ์โค้ด และดัชนี principle

**เกณฑ์โค้ด — ทุก diff ต้องผ่านทั้ง 3 ข้อ** (เกณฑ์เต็มและดัชนี principle ทุกกลุ่มอยู่ใน [`principles`](references/principles.md))
- **เรียบง่าย** — ไม่มีของที่ยังไม่ต้องใช้ · diff สั้นที่สุดที่ยังถูก · `lazy-coding`
- **โครงแบบวิศวกร** — โฟลเดอร์ตามฟีเจอร์ · 1 ไฟล์ 1 หน้าที่ · ค่าตั้งนอกโค้ด · test ข้างโค้ด · `readable-code`
- **ปลอดภัยตั้งแต่ต้น** — ตรวจ input ทันที · SQL ใช้ parameter · ตรวจสิทธิ์ฝั่งเซิร์ฟเวอร์ · ค่าลับนอกโค้ด · [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md)
- 3 ข้อไปด้วยกัน · diff สั้นกว่าแต่ผู้ใช้ลำบากขึ้น → `principle-user-experience-first` ชนะ

---

## 5 · หัวหน้าทีมและ subagent

**หัวหน้าทีม** คือตัวที่ผู้ใช้คุยด้วย ตัวเดียวต่อโปรเจกต์ · งานใหญ่ประสานและตรวจ ไม่เขียนโค้ดชิ้นใหญ่เอง (ของกลางและชิ้นเล็กทำเองได้ตามหัวข้อแบ่งงาน) · เลือก agent: โค้ด → `developer` · test และตรวจแอป → `qa-tester` · ดีไซน์ระบบ → `solution-architect` · spec → `system-analyst` · เอกสาร → `technical-writer` · หน้าที่เต็มและ agent สาขาใน [`agents`](references/agents.md)

**เพิ่มเติมของงานโค้ด**
- งานขนานแยก worktree · `docs/BUILD-PLAN.md` หัวหน้าทีมเขียนคนเดียว · อ่าน diff เองก่อนรับ · ระดับโมเดลของงานโค้ดใน [`agents`](references/agents.md)
- **งานอ่านอย่างเดียว** — agent ส่วนใหญ่มีเครื่องมือเขียนไฟล์ ส่งงานตรวจหรืองานหาคำตอบให้เขียนในคำขอว่า "ห้ามเขียนหรือแก้ไฟล์"

---

## 6 · ความเป็นอิสระ — ไม่หยุดงาน

หลักที่อยู่หลังหัวข้อนี้: `principle-proceed-on-reversible-work`

ตัวอย่างงานที่ย้อนได้และลำดับแหล่งข้อมูลทางการของ plugin นี้ → [`examples`](references/examples.md)

**รออนุมัติ** — งานที่ย้อนกลับไม่ได้หรือกระทบคนนอก agent จะไม่ทำเอง:
- deploy ขึ้นระบบจริง · แตะฐานข้อมูลจริง · ลบข้อมูลหรือไฟล์ของผู้ใช้
- ติดตั้งโปรแกรมทั้งเครื่อง · ใช้สิทธิ์ admin
- `git commit` · `push` (ดูกฎ commit ด้านล่าง)
- force-push · rewrite ประวัติบน branch ที่คนอื่นใช้ · merge เข้า branch หลัก
- ส่งข้อความหรืออีเมลถึงลูกค้าหรือคนนอก
- ใส่ค่าลับจริง · จ่ายเงิน · ยอมรับเงื่อนไขในนามผู้ใช้
- เจอ CAPTCHA บนเว็บของคนอื่น — ไม่แก้ ไม่หาทางหลบ ให้บอกผู้ใช้ทำเอง ส่วนระบบของเราเองให้ใช้ค่าทดสอบของผู้ให้บริการแทน (ดู `docker-sandbox` ข้อ 6)

อนุญาตไว้ล่วงหน้า · ทำได้เต็มที่ใน Docker sandbox → [`approvals`](references/approvals.md)

**กฎ commit** — ผู้ใช้สั่ง หรือเขียนอนุญาตไว้ชัดใน `~/.claude/superuser-style.md` หรือ `docs/AGENT-LOOP.md` หรือหัวข้อ "กติกา" ใน `CONTEXT.md` → commit เป็นชิ้นเล็กตาม `commit-message-format` บน branch งาน ไม่ลง branch หลัก · ไม่ได้อนุญาต → ใส่ข้อความ commit ที่แนะนำไว้ในคำตอบ · ไม่เดาว่าได้รับอนุญาตจากเอกสารอื่น (push ไม่ทำเว้นแต่ผู้ใช้สั่งหรือเขียนไว้ในไฟล์เหล่านี้) · playbook ทุกตัวอ้างกฎนี้

---

## 7 · คำตอบตอนจบ

- บอก principle เฉพาะเมื่อมันเปลี่ยนการตัดสินใจ · ตารางสถานะใช้คำของ `status-report` (ชุดคำงานโค้ด ต่างจาก plugin อื่นโดยตั้งใจ)

---

## 9 · ไฟล์กลาง — `CONTEXT.md` · `IMPROVEMENTS.md`

งานซอฟต์แวร์ใช้ `docs/BUILD-PLAN.md` (ตารางสถานะและ `decision-log`) แทน `HISTORY.md` · สร้าง `CONTEXT.md` ตาม `handoff` → `references/team-memory.md` หัวข้อ 2

**รูปแบบการทำงาน** — เลือกตอนวางแผน · วิธีทำ ต้นทุน กับดัก → `agent-patterns` · ตัวอย่าง → [`examples`](references/examples.md)

