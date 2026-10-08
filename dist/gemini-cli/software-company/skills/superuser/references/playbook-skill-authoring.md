# playbook · skill-authoring — เขียนหรือแก้ skill แล้วพิสูจน์ว่ามันช่วยจริง

ใช้เมื่อ: สร้าง skill ใหม่ · แก้ SKILL.md · แก้ไฟล์ agent · แก้ prompt ใน `prompt/` (รวม `authoring a skill` · `eval` ของ pstack)
skill หลัก: [`repeated-mistakes-to-checks`](../../repeated-mistakes-to-checks/SKILL.md) · `spell-out-abbreviations` · `simplicity-first`

## ขั้นตอน (คัดลง todo ตรงตัว)

1. หาก่อนว่ามี skill ที่ครอบเรื่องนี้แล้วหรือไม่ — แก้ตัวเดิมดีกว่าสร้างใหม่ และชื่อใหม่ต้องบอกว่าทำอะไร ไม่ใช่ชื่อเล่น
2. เขียน description ให้บอก "ใช้เมื่อ" ด้วยคำที่ผู้ใช้พูดจริง และห้ามมี `": "` ที่ไม่อยู่ในเครื่องหมายคำพูด
3. เนื้อหา — กฎสั้น · ขั้นตอนที่ทำตามได้ · สิ่งที่ห้าม ส่วนที่เป็นกลไกให้ย้ายออกจาก SKILL.md: `scripts/` สำหรับโค้ดที่รัน · `assets/` สำหรับแม่แบบ (SKILL.md เหลือแค่บอกว่าเรียกใช้เมื่อไร)
4. เตรียมงานทดสอบ 3–5 งานที่ skill ควรช่วย และ 1 งานที่ไม่ควรถูกเรียก
5. **ทดสอบแบบปิดตา** — ส่ง subagent ตัวใหม่ 2 ชุดทำงานเดียวกัน ชุดหนึ่งมี skill อีกชุดไม่มี (หรือใช้ skill รุ่นเก่า) แล้วให้ subagent ตัวที่ 3 ที่ไม่รู้ว่าผลไหนมาจากชุดไหน ให้คะแนนตามเกณฑ์ที่เขียนไว้ก่อน
6. ถ้า skill ใหม่ไม่ชนะชัด ให้แก้แล้วทดสอบใหม่ หรือไม่เพิ่มเลย แล้วลงผลใน `decision-log`
7. ใน repo SQT-Marketplace ให้รัน `node scripts/check/validate-marketplace.mjs --self-test` แล้วตามด้วย `node scripts/check/validate-marketplace.mjs` · `node scripts/sync/sync-docs.mjs` · `node scripts/build/build-targets.mjs`
8. `status-report`

## จบเมื่อ

validator ไม่มี error ใหม่ และมีผลทดสอบปิดตาที่บอกว่า skill ช่วยจริง
