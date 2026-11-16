# Central file template — personal-life

The team lead uses this template when it first creates the files. The writing rules are in section 9 of `superuser`.

- Contents: [Values for this plugin](#values-for-this-plugin) · [CONTEXT.md](#contextmd) · [IMPROVEMENTS.md](#improvementsmd)

## Values for this plugin

Fill the blanks in the template below. Pick the set that matches the kind of work.

**Life admin**
- ชื่องาน: งานส่วนตัว
- งานนี้คืออะไร: what it covers, and on what cycle
- กติกา: where the document register file is · the weekly review day · which email plugin to use
- Example IMPROVEMENTS row: a streaming service moved its cancel button to the website and removed it from the app · evidence: the service's help page + a trial · merge into `subscription-audit` references/cancel-steps.md

**Home and family**
- ชื่องาน: งานบ้าน
- งานนี้คืออะไร: what is covered, which home, who in the household is responsible for what
- กติกา: where the bills sheet is · budget per person · who gets reminders about what
- Example IMPROVEMENTS row: car tax can be renewed online for cars that need an inspection, once inspected at a private inspection centre (ตรอ.) · evidence: Department of Land Transport website + 2 sources · merge into `vehicle-care`

**Health**
- ชื่องาน: สุขภาพ แม่
- งานนี้คืออะไร: who is cared for and what, which appointments or cycles are running
- กติกา: where the medication schedule file is · who is the main caregiver · do not send data out of the folder
- Example IMPROVEMENTS row: the Social Security Office website moved its health-check entitlement list page · evidence: link to the new official page · merge into `annual-checkup`

**Career**
- ชื่องาน: หางาน 2026
- งานนี้คืออะไร: career goal, positions being applied for, overall status
- กติกา: CV language · where the main CV file is · never reveal the current salary in documents that go out (keep the real figure in the user's own file, not here)
- Example IMPROVEMENTS row: the applicant tracking systems (ATS) of several large companies read two-column PDFs in the wrong order · evidence: converted the file to text as a test · links to 3 vendor guides · merge into `resume-th-en`

**Learning** — ชื่องาน: เรียน Rust · งานนี้คืออะไร: what is being learned, for which job, which milestone it is at
- กติกา: hours per week · command to run the examples · exam date (if any) · never put secrets or tokens of the cloud account used for labs · example IMPROVEMENTS row: a new exam guide for one certification changed the topic weights · evidence: link to the official exam guide · merge into `cert-prep` references/exam-facts.md

<!-- superuser:begin context -->
## CONTEXT.md

```markdown
# <ชื่องาน> — CONTEXT

> คนและ bot ทุกตัวอ่านหัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ก่อนทำงาน (หัวข้ออื่นเปิดเมื่อต้องใช้) · อัปเดต: <วันที่ เวลา> โดย superuser (<โมเดล>)

## งานนี้คืออะไร
3 บรรทัด — ทำอะไร ให้ใคร สถานะโดยรวม

## เป้าตอนนี้
งานที่กำลังทำ และ "เสร็จ" หมายถึงอะไร

## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| ... | ทำอยู่ | ... | 2026-10-07 |

## กติกา
- ข้อห้ามและข้อต้องทำของงานนี้
- อนุญาตล่วงหน้า: (ถ้ามี)

## ของอยู่ที่ไหน
ดัชนีของโปรเจกต์ · อ่านก่อนค้น · แตะไฟล์ไหนแล้วแก้แถวของไฟล์นั้นในรอบเดียวกัน · คอลัมน์ "ใช้เมื่อ" บอกรูปคำถามที่ควรเปิดไฟล์นั้น (ตารางเส้นทาง) · คลุมเครือจริงให้เปิดไฟล์ที่ย้อนง่ายสุดแล้วจดใน "ตัดสินใจเอง"
| ไฟล์ | คืออะไร | ใช้เมื่อ | ตรวจล่าสุด |
|---|---|---|---|

## การตัดสินใจ
| วันที่ | เลือก | ไม่เลือก | เพราะ |
|---|---|---|---|

## รอผู้ใช้
ไม่เกิน 10 แถว · แถวบนสุดคือข้อที่ **ต่อไป** ในคำตอบชี้ให้ผู้ใช้ทำ · "ทำไมต้องเป็นคุณ" ใช้ 4 ค่า: ตัดสิน · ตรวจด้วยตาหรือหู · ใช้เงินหรือ token · รับรองข้อความที่ agent เขียนแทน · agent ลบแถวทันทีที่ผู้ใช้ตอบหรือปลดล็อกแล้ว
| เรื่อง | ทำไมต้องเป็นคุณ | หลักฐาน | ปลดล็อกอะไร · ตอบแบบไหน | วันที่เพิ่ม |
|---|---|---|---|---|

## รับงานต่อ
- **ส่งมาแล้ว:** N ครั้ง (บวก 1 เฉพาะตอนส่งต่อจริง (จบ session · สลับโมเดล) ไม่บวกตอน /compact · อ่านแล้วเห็น N สูง = ข้อความเก่า ไม่ใช่ข่าวใหม่ ให้ตรวจกับของจริงก่อนทำตาม)
- **สมุดงาน:** `notes/<แผน>.md` · `ledger/<แผน>.md` (ถ้ามี)
- **ทำต่อเป็นข้อแรก:** ... (ตัวที่เริ่มทำเติม `รับโดย: <เครื่องมือ>/<branch หรือ session> · <วันที่ เวลา>` ก่อนเริ่ม · มีชื่อคนอื่นแล้ว เลือกข้ออื่น · เสร็จแล้วลบข้อออกจากหัวข้อนี้และจด 1 บรรทัดใน `HISTORY.md`)
- **รออนุมัติ:** ...
- **ค้างอยู่:** ...
- **ระวัง:** ... (บันทึกที่ขัดกับของจริงให้แก้ตามที่เห็นจริง · 2 บันทึกขัดกันแต่ยังตรวจไม่ได้ ติดป้าย `ขัดกัน: ดู <อีกที่>` ทั้งคู่)

## ไฟล์อื่น
`HISTORY.md` งานที่เสร็จแล้ว · `IMPROVEMENTS.md` · `handoff/` ใบสั่งและใบส่งงาน · `log/` · `learn/` · `inbox/` (ทั้งหมดอยู่ใน `.claude/superuser/`)
```

## IMPROVEMENTS.md

```markdown
# IMPROVEMENTS — สิ่งที่ SuperUser เจอ รอรวมเข้า skill และ agent

| วันที่ | เจออะไร | ใครเจอ | หลักฐาน · แหล่ง | ควรไปรวมที่ | ควรรวมไหม | รวมแล้ว |
|---|---|---|---|---|---|---|
| 2026-10-07 | <เรื่องที่ใช้กับงานอื่นได้> | `<agent>` | <ลิงก์ · ไฟล์ · ผลที่รัน> | `<skill>` | ใหม่ | ยัง |

<!--
จดเมื่อ: ข้อเท็จจริงที่เปลี่ยน · วิธีที่ skill เดิมไม่ได้บอก · skill บอกผิดหรือล้าสมัย · กับดักที่เสียเวลาเกิน 15 นาที
ไม่จด: เรื่องเฉพาะงานนี้ · ค่าลับ · ข้อมูลส่วนบุคคล
ควรรวมไหม: ใหม่ (ยังไม่ตัดสิน) · ควรรวม · ไม่รวม (<เหตุผล>) · รวมแล้ว: ยัง · แล้ว <วันที่> (<ไฟล์>) · แถวที่ไม่รวมใส่ — · แถวใหม่อยู่บน · เรื่องซ้ำเพิ่มหลักฐานในแถวเดิม
ใครเจอ: ชื่อ agent ที่เจอ เช่น software-development:qa-tester · หัวหน้าทีม · ผู้ใช้ · หลายตัวเรียงด้วย →
จดแถวใหม่ → เพิ่ม 1 แถวในคิวกลาง ~/.claude/superuser/IMPROVEMENTS.md ด้วย
-->
```
<!-- superuser:end context -->
