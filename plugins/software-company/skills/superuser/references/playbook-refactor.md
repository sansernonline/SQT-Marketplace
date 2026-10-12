# playbook · refactor — เปลี่ยนโครงสร้าง พฤติกรรมเท่าเดิม

ใช้เมื่อ: ย้ายไฟล์ · แยกโมดูล · เปลี่ยนชื่อทั้งระบบ · ยุบชั้นที่ไม่จำเป็น · เปลี่ยน API ภายใน (ย้ายหน้าจอที่หน้าตาต้องเหมือนเดิม → `visual-parity`)
skill หลัก: [`code-orientation`](../../code-orientation/SKILL.md) · skill ตาม stack · `lazy-coding` · `readable-code` · [`principle-build-a-tool-not-handwork`](../../principle-build-a-tool-not-handwork/SKILL.md)

## ขั้นตอน (คัดลง todo ตรงตัว)

1. เขียนพฤติกรรมที่ต้องเท่าเดิมเป็นรายการที่ตรวจได้ แล้วตรวจว่ามี test หรือ skill ตรวจแอปครอบไว้ ถ้าไม่มี ให้เพิ่ม test ที่ล็อกพฤติกรรมเดิมก่อนแตะโค้ด
2. บันทึกผลก่อนเปลี่ยน — test ทั้งชุด · ภาพหน้าจอหรือผลลัพธ์ที่ใช้เทียบ
3. ลบโค้ดตายและชั้นที่มีผู้เรียกแค่ที่เดียวก่อน
4. แก้รูปแบบเดียวกันหลายจุด ใช้เครื่องมือตาม [`principle-build-a-tool-not-handwork`](../../principle-build-a-tool-not-handwork/SKILL.md)
5. ถ้ามี API ภายในใหม่ ให้ย้ายผู้เรียกทุกตัวแล้วลบของเก่าตาม [`principle-replace-then-delete`](../../principle-replace-then-delete/SKILL.md)
6. หาผลกระทบนอกจุดที่แก้ตาม [`blast-radius`](../../blast-radius/SKILL.md) — ผู้เรียกทางอ้อม · ข้อมูลที่บันทึกไว้แล้ว · ระบบนอก repo
7. รัน test ชุดเดิมและเทียบผลกับข้อ 2 — ต้องเท่ากันทุกข้อ
8. ส่งมอบตามกฎ commit ใน `superuser` หัวข้อ 6 แต่ละชิ้นต้องผ่าน test แล้วจบด้วย `status-report`

## จบเมื่อ

test ชุดเดิมผ่านเท่าเดิม · ผลลัพธ์ที่เทียบในข้อ 2 ตรงกัน · จำนวนบรรทัดรวมใน diff ลดลง หรือมีเหตุผลชัดว่าทำไมไม่ลด
