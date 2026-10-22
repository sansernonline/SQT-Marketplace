# สัญญาของ 1 งานใน evals/coding/tasks/<cN-ชื่อ>/

| ไฟล์ | คืออะไร |
|---|---|
| `TASK.md` | คำสั่งที่ส่งให้ทีมตรงตัว เขียนแบบลูกค้าแจ้ง (ภาษาไทย) บอกคำสั่งรัน test ของ repo |
| `task.json` | `{ "stack": "dotnet|typescript|python|sql", "title": "...", "test": ["คำสั่ง", "args"...], "testFiles": "<regex ของ path ไฟล์ test ที่ทีมเขียนเอง>" }` — `test` คือคำสั่งรัน test ของ repo (exit ≠ 0 = มี test ล้ม) |
| `repo/` | โค้ดตั้งต้นที่รันได้ มี test ของ repo เองบ้าง (ผ่านกับโค้ดตั้งต้น) |
| `hidden/` | test ที่ทีมไม่เห็น · check วางทับรากของสำเนางาน (หรือโฟลเดอร์ย่อยตามที่ check กำหนด) |
| `reference/` | คำตอบอ้างอิง เก็บเฉพาะไฟล์ที่แก้หรือเพิ่ม · วางทับ `repo/` แล้วต้องผ่าน hidden ครบ · ใช้เทียบขนาด diff |
| `check.mjs` | `export async function check(dir)` คืน `{ pass, total, clean, cleanNote, metrics }` · ท้ายไฟล์ `cli(import.meta, check)` จาก `../../lib.mjs` |

- `check(dir)` ห้ามแก้ `dir` — ใช้ `prepare(dir, hiddenDir)` ได้สำเนาชั่วคราว แล้ว `cleanup` ตอนจบ
- `clean` = build · type · lint ไม่มีปัญหาใหม่ (แต่ละงานกำหนดเอง) · `cleanNote` บอกเหตุถ้าไม่ clean
- `metrics` = ตัวเลขเฉพาะงาน (เช่น `latency_ms`, `subscriptions_after_destroy`, `query_ms`)
- ตัวตรวจ: `check(repo)` ต้องได้ `pass < total` และ `check(repo + reference)` ต้องได้ `pass === total` และ `clean === true`
- test ที่ซ่อนไว้ต้องทดสอบ "พฤติกรรม" ไม่ใช่ชื่อตัวแปรภายใน · ชื่อ API สาธารณะที่ test เรียกต้องบอกไว้ใน `TASK.md` หรือมีอยู่แล้วใน repo
- งานต้องรันได้บน Windows และ Linux · ไม่ใช้ server ภายนอก ไม่ใช้ Docker
- ข้อความใน TASK.md เขียนภาษาคน สั้น ตัวเลขเป็นตัวเลข
