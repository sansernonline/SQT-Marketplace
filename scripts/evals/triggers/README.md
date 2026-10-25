# scripts/evals/triggers — Claude เปิด skill ที่ควรเปิดไหม

skill ทำงานได้ต่อเมื่อ Claude เปิดมันก่อน · Claude เลือกเปิดจากชื่อและคำอธิบาย 1 บรรทัดในรายการ skill เท่านั้น
ชุดนี้วัดว่าคำขอจริง 10 แบบ (แก้ .docx · สรุปประชุม · อีเมล · README · เทียบ · โค้ด · บั๊ก · สไลด์ · ภาษี · สัตว์เลี้ยง) ทำให้ Claude เปิด skill ที่ต้องใช้หรือเปล่า

## วิธีรัน

```bash
node scripts/evals/triggers/run-triggers.mjs --runs 2                               # plugin ในรีโปตอนนี้ · เคสละ 2 รอบ
node scripts/evals/triggers/run-triggers.mjs --src <โฟลเดอร์ plugins รุ่นก่อน> --label before --runs 2
node scripts/evals/triggers/run-triggers.mjs --cases docx-edit,readme                # เฉพาะบางเคส
node scripts/evals/triggers/run-triggers.mjs --budget-fraction 0.02 --label budget2  # ลองงบรายการ skill 2%
```

| ตัวเลือก | ค่าเริ่ม | ความหมาย |
|---|---|---|
| `--src` | `plugins/` | โฟลเดอร์ที่มี plugin ทุกตัว |
| `--label` | `current` | ชื่อชุดผล · ผลรายรอบอยู่ใน `_to_delete/triggers/<label>/` |
| `--runs` | `1` | รอบต่อเคส · ผลแกว่ง ตัดสินจริงใช้ 3 รอบขึ้นไป |
| `--cases` | ทุกเคส | id ใน `cases.json` คั่นด้วย `,` |
| `--budget-fraction` | ค่าของ Claude Code (1%) | งบรายการ skill เป็นสัดส่วนของ context |
| `--parallel` · `--budget` | `4` · `1` | รันพร้อมกันกี่รอบ · เพดานดอลลาร์ต่อรอบ |

- ใช้ `claude` ที่ล็อกอินอยู่ · รอบละราว $0.05–0.15
- โหลดเฉพาะ plugin จาก `--src` (`--setting-sources project`) ไม่โหลด plugin ที่ติดตั้งในเครื่อง
- ห้ามเครื่องมือเขียนไฟล์ รันคำสั่ง และส่ง agent จึงวัดแค่การเลือก skill ช่วงต้นงาน
- **ผ่าน** = เปิดครบทุกตัวใน `expect_all` และอย่างน้อย 1 ตัวใน `expect_any` · เทียบชื่อหลัง `:` จึงไม่สนว่ามาจาก plugin ไหน
- บรรทัด `listing:` ในผลคัดจาก debug log ของ Claude Code ถ้าเห็น `Skill listing over budget` แปลว่าคำอธิบายบางตัวถูกตัดทิ้ง
- ตารางสรุปต่อท้าย `RESULTS.md` ทุกครั้งที่รัน

## เพิ่มเคส

เพิ่มแถวใน `cases.json` · คำขอเขียนแบบที่ผู้ใช้พิมพ์จริง ไม่ใส่ชื่อ skill · ไฟล์ที่คำขออ้างถึงวางใน `fixtures/`
