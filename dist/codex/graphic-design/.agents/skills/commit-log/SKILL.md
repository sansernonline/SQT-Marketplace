---
name: commit-log
description: Use when a step of work is finished in a git folder, or the user asks to commit. One Conventional Commit per step so git log is the work log.
---

# commit-log — commit ทุกขั้น ให้ git log เป็นบันทึกงาน

ทำงานเสร็จ 1 ขั้น → commit 1 ครั้ง · อ่าน `git log --oneline` จากล่างขึ้นบนแล้วต้องรู้ว่าทำอะไรไป เรียงอย่างไร เพราะอะไร · อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies`

## 1 · commit เมื่อไหร่

- **ทำได้เมื่อผู้ใช้สั่ง หรือเขียนอนุญาตไว้ใน `~/.claude/superuser-style.md` หรือ `docs/AGENT-LOOP.md`** · ไม่ได้อนุญาต → ทำขั้นที่ 1–5 แล้วใส่ข้อความ commit ที่แนะนำไว้ในคำตอบแทนการ commit
- จบแต่ละขั้นที่ใช้งานได้ (ฟีเจอร์ 1 ชิ้น · แก้บั๊ก · แก้เอกสาร · แก้ config) → ไม่รวบ commit เดียวตอนจบ
- ก่อนแก้อะไรที่เสี่ยง → มีจุดสะอาดให้ถอยกลับ
- ผู้ใช้สั่ง
- **ไม่ push · ไม่ amend · ไม่แก้ history** เว้นแต่ผู้ใช้สั่ง
- โฟลเดอร์ไม่ใช่ git → เสนอ `git init` 1 ครั้ง · ผู้ใช้ไม่เอา → ใช้ log ของ superuser อย่างเดียว ไม่ถามซ้ำ

## 2 · ขั้นตอน

1. `git status` · `git diff` → ดูว่าเปลี่ยนอะไร
2. `git log -10 --oneline` → ใช้ภาษาและชื่อ scope แบบที่ repo ใช้อยู่
3. แยกตามเรื่อง → 1 commit = 1 เรื่อง · subject ต้องใช้ "และ" เชื่อมของที่ไม่เกี่ยวกัน → แยก 2 commit (`git add <ไฟล์>` ทีละเรื่อง)
4. ตรวจของที่ไม่ควรเข้า → ค่าลับ · `.env` · key · ไฟล์ build · ไฟล์ใหญ่ · `.claude/superuser/log/` `inbox/` `learn/` · `_to_delete/` → ใส่ `.gitignore`
5. เลือก type → เขียนข้อความ → commit
6. จด hash ลง log ของงาน (บรรทัด `commit` ใน `log/<วันที่>/main.jsonl`) · บอกผู้ใช้ 1 บรรทัด เช่น `a1b2c3d feat(auth): เพิ่มล็อกอินด้วย LINE`

## 3 · รูปแบบ

```
<type>(<scope>): <subject>

<body — เหตุผล ใส่เมื่อดู subject แล้วไม่รู้ว่าทำไม>

<footer>
```

| type | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `feat` | เพิ่มฟีเจอร์ใหม่ | `feat(auth): add user authentication` |
| `fix` | แก้บั๊ก | `fix(login): resolve login timeout issue` |
| `docs` | แก้เอกสารอย่างเดียว | `docs(api): update API reference` |
| `style` | จัด format · whitespace → logic ไม่เปลี่ยน | `style(header): fix indentation` |
| `refactor` | ปรับโครงสร้าง → behaviour เดิม | `refactor(payment): extract payment logic` |
| `test` | เพิ่มหรือแก้ test | `test(auth): add unit tests for auth module` |
| `chore` | งานบำรุงรักษา · dependency | `chore: update npm packages` |
| `perf` | เร็วขึ้นหรือเบาลง | `perf(db): optimize database queries` |
| `ci` | config ของ Continuous Integration / Continuous Delivery (CI/CD) | `ci: add GitHub Actions workflow` |
| `build` | ระบบ build · สคริปต์ build | `build: add release build target` |
| `revert` | ย้อน commit เดิม | `revert: feat(auth): add user authentication` |

ของที่เปลี่ยนแล้วของเดิมพัง → ใส่ `!` หลัง type (`feat(api)!: ...`) และ footer `BREAKING CHANGE: ...`

## 4 · กติกาข้อความ

- subject บอกว่า**อะไรเปลี่ยนสำหรับคนอ่าน** ไม่ใช่ไฟล์ไหน → `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` ไม่ใช่ `fix: แก้ items.js บรรทัด 42`
- ไม่เกิน 50 ตัวอักษร · ไม่มีจุดท้าย
- อังกฤษ → รูปคำสั่ง ตัวเล็ก (`add` ไม่ใช่ `added`) · repo ภาษาไทย → subject ไทยได้ แต่ `type(scope):` เป็นอังกฤษให้เครื่องมืออ่านได้
- scope = ชื่อโมดูลหรือฟีเจอร์ (`auth` · `report` · `stock`) · ห้าม `misc`
- body ไม่เกิน 3 บรรทัดสั้น ตัดที่ 72 ตัวอักษร · `Closes #123` ปิด issue · `Refs #456` อ้างถึงแต่ไม่ปิด
- ใส่บรรทัดระบุผู้ร่วมเขียนตามที่ระบบหรือผู้ใช้กำหนด

## 5 · ห้าม

- `update code` · `fix bug` · `WIP` · `final` · `แก้นิดหน่อย`
- รายชื่อไฟล์ในข้อความ → diff บอกอยู่แล้ว
- ใช้ `chore` กับฟีเจอร์หรือการแก้บั๊กจริง
- commit ค่าลับหรือรหัสผ่าน
