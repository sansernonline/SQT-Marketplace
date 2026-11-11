---
name: superuser
description: Use when software work has several steps (multi-module change, feature plus tests). One-file bug → just fix.
---

# SuperUser — ประตูหน้าเดียวของทีม agent

> **เปิด `superuser:superuser` ก่อน** — ไฟล์นี้มีเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) · วิธีทำงานของหัวหน้าทีมทั้งหมด (จัดขนาด · งบ · ใบสั่งงาน 5 ข้อ · แจกงาน · ประเมิน · ตรวจซ้ำ · คำตอบ) อยู่ที่แกนใน plugin `superuser` · ติดตั้ง plugin นี้แล้ว superuser มาเองทาง `dependencies`

เรียกได้ทั้ง `/software-development:superuser` หรือพูดว่า "ใช้ superuser" กับงานซอฟต์แวร์

plugin อื่นมี `superuser` ของตัวเอง (`/<plugin>:superuser`) · รายชื่อใน [`agents`](references/agents.md)

---

## 1 · กฎที่ห้ามข้าม

**กฎเฉพาะของ plugin นี้**

- **ที่จด** — การตัดสินใจลง `decision-log` ใน `docs/BUILD-PLAN.md` แทนตารางใน `CONTEXT.md` · ตารางสถานะใช้ `status-report` · `CONTEXT.md` และจุดส่งต่อตาม `handoff` · ไฟล์ style สร้างด้วย `owner-style-capture`
- **principle ที่อยู่หลังกฎ** — ข้อ 3 `principle-prove-it-works` · ข้อ 4 `principle-proceed-on-reversible-work` (เลขข้อของ `superuser:superuser`) · playbook อ่านอย่างเดียว: `investigation` · `review`

---

## 2 · เข้าใจงาน แล้วเลือก playbook

งานขนาดกลางขึ้นไป เลือก **1** ตัวจาก [`playbooks`](references/playbooks.md) แล้วอ่านทั้งไฟล์ก่อนเริ่ม

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

**หัวหน้าทีม** คือตัวที่ผู้ใช้คุยด้วย ตัวเดียวต่อโปรเจกต์ · งานใหญ่ประสานและตรวจ ไม่เขียนโค้ดชิ้นใหญ่เอง (ของกลาง ชิ้นเล็ก และงานโค้ดรวมคาดไม่ถึง 200 บรรทัดทำเองได้ ตามแกน `superuser` หัวข้อ 2) · เลือก agent: โค้ด → `developer` · test และตรวจแอป → `qa-tester` · ดีไซน์ระบบ → `solution-architect` · spec → `system-analyst` · เอกสาร → `technical-writer` · หน้าที่เต็ม agent สาขา ระดับโมเดล และเพิ่มเติมของงานโค้ด (worktree · งานอ่านอย่างเดียว) ใน [`agents`](references/agents.md)

---

## 6 · ความเป็นอิสระ — ไม่หยุดงาน

งานที่ย้อนได้ทำต่อเลย · งานที่ย้อนไม่ได้หรือกระทบคนนอก agent ไม่ทำเอง · รายการ "รออนุมัติ" กฎ commit และที่อนุญาตไว้ล่วงหน้า → [`approvals`](references/approvals.md)

---

## 7 · คำตอบตอนจบ

- บอก principle เฉพาะเมื่อมันเปลี่ยนการตัดสินใจ · ตารางสถานะใช้คำของ `status-report` (ชุดคำงานโค้ด ต่างจาก plugin อื่นโดยตั้งใจ)

---

## 9 · ไฟล์กลาง — `CONTEXT.md` · `IMPROVEMENTS.md`

งานซอฟต์แวร์ใช้ `docs/BUILD-PLAN.md` (ตารางสถานะและ `decision-log`) แทน `HISTORY.md` · สร้าง `CONTEXT.md` ตาม `handoff` → `references/team-memory.md` หัวข้อ 2

**รูปแบบการทำงาน** — เลือกตอนวางแผน · วิธีทำ ต้นทุน กับดัก → `agent-patterns` · ตัวอย่าง → [`examples`](references/examples.md)

