# Context file template — e-commerce

The team lead uses this template when it first creates the file. The writing rules are in section 9 of `superuser`.

## Values for this plugin

Fill these in place of the blanks in the template below.

**Sales work**
- Job name: online clothing shop
- What the job is: what is sold, on which platform, shop type
- Rules (`กติกา`): where the main stock file is · target margin · the shop's tone of voice
- Example IMPROVEMENTS row: a platform added a fee for its free-shipping program in some categories · evidence: the platform's announcement page + Seller Centre · merge into `marketplace-fees-pricing` references/fee-structures.md

**Buying work**
- Job name: complaint, broken refrigerator
- What the job is: what happened, with which shop, what is wanted, which step it is at
- Rules (`กติกา`): deadline of the right · channels already used · where the evidence is kept
- Example IMPROVEMENTS row: a platform moved the dispute button into the order detail page · evidence: the platform's help page + a trial in the app · merge into `refund-request`

**Back-office work (tax, payroll, PDPA, LINE OA)**
- Job name: back office, Example Co., Ltd.
- What the job is: which company, VAT registered or not, how many employees, accounting period
- Rules (`กติกา`): where the payroll file is · who the accountant and auditor are · which file holds the LINE secrets (do not open it)
- Example IMPROVEMENTS row: the online filing system moved the withholding tax menu into e-WHT · evidence: Revenue Department website + 2 sources · merge into `tax-vat-th`

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
- **ทำต่อเป็นข้อแรก:** ...
- **รออนุมัติ:** ...
- **ค้างอยู่:** ...
- **ระวัง:** ...

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
