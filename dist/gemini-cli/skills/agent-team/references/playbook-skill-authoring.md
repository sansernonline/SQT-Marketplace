# playbook · skill-authoring — เขียนหรือแก้ skill แล้วพิสูจน์ว่ามันช่วยจริง

ใช้เมื่อ: สร้าง skill ใหม่ · แก้ SKILL.md · แก้ไฟล์ agent · แก้ prompt ใน `prompt/` (รวม `authoring a skill` · `eval` ของ pstack)
skill หลัก: [`principle-rules-as-checks-not-text`](../../principle-rules-as-checks-not-text/SKILL.md) · `spell-out-abbreviations` · `simplicity-first`

## ขั้นตอน (คัดลง todo ตรงตัว)

1. หาก่อนว่ามี skill ที่ครอบเรื่องนี้แล้วหรือไม่ — แก้ตัวเดิมดีกว่าสร้างใหม่ · ชื่อใหม่ต้องบอกว่าทำอะไร ไม่ใช่ชื่อเล่น
2. เขียน description ให้บอก "ใช้เมื่อ" ด้วยคำที่ผู้ใช้พูดจริง · ห้ามมี `": "` ที่ไม่ครอบเครื่องหมายคำพูด
3. เนื้อหา — กฎสั้น · ขั้นตอนที่ทำตามได้ · สิ่งที่ห้าม · ส่วนที่เป็นกลไกย้ายออกจาก SKILL.md — `scripts/` สำหรับโค้ดที่รัน · `assets/` สำหรับแม่แบบ (SKILL.md เหลือแค่บอกว่าเรียกเมื่อไร)
4. เตรียมงานทดสอบ 3–5 งานที่ skill ควรช่วย และ 1 งานที่ไม่ควรถูกเรียก
5. **ทดสอบแบบปิดตา** — ส่ง subagent ตัวใหม่สองชุดทำงานเดียวกัน ชุดหนึ่งมี skill อีกชุดไม่มี (หรือ skill รุ่นเก่า) แล้วให้ subagent ตัวที่สามซึ่งไม่รู้ว่าผลไหนมาจากชุดไหน ให้คะแนนตามเกณฑ์ที่เขียนไว้ก่อน
6. skill ใหม่ไม่ชนะชัด → แก้แล้วทดสอบใหม่ หรือไม่เพิ่ม · ลงผลใน `decision-log`
7. ใน repo SQT-Marketplace รัน `node scripts/validate-marketplace.mjs --self-test` แล้ว `node scripts/validate-marketplace.mjs` · `node scripts/sync-docs.mjs` · `node scripts/build-targets.mjs`
8. `status-report`

## จบเมื่อ

validator ไม่มี error ใหม่ และมีผลทดสอบปิดตาที่บอกว่า skill ช่วยจริง
