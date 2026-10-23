# IMPROVEMENTS — สิ่งที่ SuperUser เจอ รอรวมเข้า skill และ agent

| วันที่ | เจออะไร | ใครเจอ | หลักฐาน · แหล่ง | ควรไปรวมที่ | ควรรวมไหม | รวมแล้ว |
|---|---|---|---|---|---|---|
| 2026-10-23 | ย้าย skill ข้าม plugin แล้วแทนชื่อ plugin ทั้ง repo ทำให้ตัวชี้แบบ `plugin:skill` ผิดที่ (`e-commerce:seller-tax-basics` ทั้งที่ skill ย้ายไป thai-workplace) · ตัวตรวจ `plugin:ชื่อ` ที่เทียบกับโฟลเดอร์จริงจับได้ 1 จุดจริง ไม่มีเตือนผิดนอกจาก marker `superuser:begin/end` | หัวหน้าทีม | `trading-finance/skills/tax-basics-th/SKILL.md:10` · `thai-workplace/skills/doc-quotation/SKILL.md:86` · ตัวตรวจต้นแบบใน scratchpad | `scripts/check/validate-marketplace.mjs` (ตรวจ `plugin:ชื่อ` ข้าม marker) | ใหม่ | ยัง |
| 2026-10-23 | มีเครื่องมืออื่นแก้ repo พร้อมกัน แยกบรรทัดของทีมเราได้ด้วยการเทียบบรรทัดที่เพิ่มกับ input ของ tool_use ใน transcript (ไม่ใช่ผลที่อ่าน เพราะ diff ที่เพิ่งดูทำให้ผ่านผิด) · เจอ `brief-to-image` ขั้น 0 ที่ไม่ใช่ของทีม | หัวหน้าทีม | ไฟล์แก้ 18:05 ไม่มีใน tool_use ของ session ใดในรอบนี้ | `commit-log` ขั้น 2 ข้อ 1 (ก่อน stage ตรวจว่าบรรทัดไหนเป็นของทีม) · hook จดไฟล์ที่ทีมแก้ต่อ session | ใหม่ | ยัง |
| 2026-10-23 | CHANGELOG ตกหล่นเมื่อแก้หลาย plugin ในรอบเดียว: ส่วนเสริมจากการเทียบลงโค้ดครบแต่บาง plugin ไม่มีบรรทัดใน CHANGELOG และหัวรุ่นที่ตั้งตอนรวม plugin ไปต่อท้ายไฟล์แทนบนสุด | หัวหน้าทีม | thai-workplace `0.10.0` · personal-life `0.12.0` อยู่ท้ายไฟล์ · trading-finance ไม่มีบรรทัดของ paper-trading · position-sizing · retirement-plan | validator (หัวรุ่นต้องเรียงจากใหม่ไปเก่า · plugin.json ต้องมีหัวรุ่นตรงกัน) | ใหม่ | ยัง |
| 2026-10-23 | description ของ software-company ใน `plugin.json` เขียน 81 skill และใน `marketplace.json` เขียน 113 skill ขณะที่ของจริง 95 · ไม่มีตัวตรวจหรือสคริปต์ sync ตัวเลขในช่องนี้ | `general-purpose` (ร่าง CHANGELOG) → หัวหน้าทีม | `sync-docs.mjs` รายงาน 95 skill · 29 command · 39 agent | `scripts/sync/sync-docs.mjs` (เขียนตัวเลขใน description ให้ด้วย) | ใหม่ | ยัง |
| 2026-10-23 | ข้อกฎหมายที่ agent "แก้" จากเว็บรองอาจกลับความหมาย: มาตรา 17 พ.ร.บ.วิธีพิจารณาคดีผู้บริโภคถูกเขียนใหม่ผิดทั้งที่แหล่งรองอ้างตัวบทถูก · ตรวจกับราชกิจจานุเบกษาแล้วแก้คืน | หัวหน้าทีม → agent ตรวจกฎหมาย | `complaint-letter-th/SKILL.md:28` · ราชกิจจานุเบกษา เล่ม 125 ตอนที่ 38 ก | `superuser` หัวข้อ 6 ข้อเท็จจริงสาธารณะ (ข้อกฎหมายต้องเทียบตัวบทที่ยกมาคำต่อคำ ไม่ใช่ถอดความ) | ใหม่ | ยัง |
| 2026-10-23 | checkout ใหม่บน Windows ที่ `core.autocrlf=true` ทำให้ validator ล้มที่ "เอกสารไม่ตรงกับของจริง" ทั้งที่เนื้อหาตรง เพราะ `sync-docs.mjs --check` เทียบข้อความที่สร้างแบบ LF กับไฟล์ CRLF | หัวหน้าทีม | worktree ที่ `b6c4c30`: รอบแรก exit 1 · รัน `sync-docs.mjs` แล้ว `git diff` ว่าง · รอบสอง exit 0 | `scripts/sync/sync-docs.mjs` ฟังก์ชัน `edit` (แปลง `\r\n` เป็น `\n` ก่อนเทียบ) | ใหม่ | ยัง |

<!--
จดเมื่อ: ข้อเท็จจริงที่เปลี่ยน · วิธีที่ skill เดิมไม่ได้บอก · skill บอกผิดหรือล้าสมัย · กับดักที่เจอซ้ำได้
ไม่จด: เรื่องเฉพาะงานนี้ · ค่าลับ · ข้อมูลส่วนบุคคล
-->
