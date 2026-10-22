# สรุป context — superuser 3.0 (22 ต.ค. 2026)

## โจทย์
อยากให้ superuser เป็น plugin ที่ดังแบบ Superpowers และเป็นแกนกลางที่ plugin อื่น (เช่น software-company) ต่อยอดได้

## แนวคิดที่ตกลงกัน
- superuser = หัวหน้างาน 1 คน เก่ง 4 เรื่อง: แจกงาน · ประเมินลูกน้อง · จัดการงาน · ตรวจซ้ำจนสำเร็จ ด้วยลูกน้อง effort ต่ำ
- กฎแยก: หัวหน้าทำงานไม่ได้ถ้าขาด → แกน · ทำได้แต่ดีขึ้น → โมดูล ที่เปิดปิดเองได้
- แกน (หัวข้อ 1–8): จัดขนาด + งบ เร็ว/สมดุล/คุณภาพ · ใบสั่งงาน 5 ข้อ · แจกงานขนาน + ระดับโมเดลคู่ effort · ประเมินลูกทีม ผ่าน/แก้/ทำใหม่ + โปรไฟล์ · reviewer ตัวใหม่วนจนผ่าน (cap 3/5 รอบ) · รู้ความเสี่ยง · รู้จังหวะหยุด · คำตอบ 3 ระดับ + รายงานปิดงานครึ่งหน้า · ประหยัด token · หัวหน้าเรียนรู้การตัดสินใจตัวเอง (คาด/จริง)
- โมดูล (หัวข้อ 9–11): context · log · improvements · learning · inbox · handoff · patterns_advanced (MoA · Reranker) · review_gate · split_gate — ค่าเริ่มต้นเปิดทุกตัว ใน `.claude/superuser/config.json`
- ต่อยอด: software-company ประกาศ `dependencies: ["superuser"]` → ติดตั้งตัวเดียวได้ superuser มาเอง · ควรใส่ช่วงเวอร์ชัน `^3.0` และ tag `superuser--v3.0.0` (`claude plugin tag --push`)

## ที่ทำไปแล้ว (superuser 3.0.0)
- `plugins/superuser/skills/superuser/SKILL.md` เขียนใหม่ · `references/lead-playbook.md` → `~/.claude/superuser/LEAD-PLAYBOOK.md` · `templates/TEAM.md` → `~/.claude/superuser/TEAM.md` · `templates/config.json` → `.claude/superuser/config.json`
- hook อ่าน config (`moduleOn`) สำหรับ log · inbox · review_gate · split_gate · self-test 55/55
- `ADAPT.md` หัวข้อ 0 ตารางแกน/โมดูล/สาขา/ส่วนตัว + extension contract · sync ไป 11 plugin ครบ (บล็อกใหม่ `modules`) · CHANGELOG · plugin.json · marketplace.json อัปเดต
- กฎรีวิวเลื่อนจากข้อ 2 เป็นข้อ 3 (ใบสั่งงานเป็นข้อ 2) แก้ที่ hook แล้ว

## รอบ 2 (22 ต.ค. 2026 ช่วงบ่าย) — ทำแล้ว
- แกน 2 ชั้น: `SKILL.md` 46 → 27 KB · `references/autonomy.md` (ถาม · ตัดสินใจเอง · รออนุมัติ · รู้จังหวะหยุด) · `references/modules.md` (โมดูล · config · รอบเรียนรู้ · ด่าน hook)
- SKILL.md ของ 11 plugin สาขาเหลือเฉพาะส่วนสาขา (50 → 11–13 KB) ขึ้นต้น "เปิด `superuser:superuser` ก่อน" · sync `--check` จับบล็อกค้างและบรรทัดชี้ที่หาย · `build-targets.mjs` รวมแกน + สาขาเป็นไฟล์เดียวใน dist
- plugin ใหม่ `sqt-toolkit` 1.0.0 = skill เอกสาร สไลด์ รูป ประชุม 15 ตัว ย้ายจาก superuser (เหลือ 28) · ทุกสาขา `dependencies` = `[{superuser ^3.0}, {sqt-toolkit ^1.0}]` (object form ตรวจกับ docs แล้ว 22 ต.ค.)
- ผู้ตรวจขยับตามงบ (reviewer ค่าเริ่ม sonnet+medium) · ใบสั่งงาน 5 ข้อในข้อความ ไฟล์เฉพาะโมดูล handoff
- hook: token ราย agent ใน `log/SUMMARY.md` · gate-state ไม่ parse ทั้ง transcript (371 → 140 ms) · fast-path · self-test 60/60
- software-company ออกจาก `OPT_OUT` รับบล็อก review/unattended เหมือนสาขาอื่น
- validate error 0 · sync-docs · file-map · diagrams · dist สร้างใหม่ (ผลดูในรายงานปิดงานของ session)

## ค้างอยู่
- [ ] **tag release ก่อนใคร install จาก GitHub**: `claude plugin tag superuser 3.0.0 --push` และ `claude plugin tag sqt-toolkit 1.0.0 --push` (ช่วงเวอร์ชันใน dependencies resolve จาก tag `<plugin>--v<version>`) — ไม่ tag = install plugin สาขาล้ม
- [ ] commit (ยังไม่ commit ทั้งชุด) แล้ว `claude plugin update` บนเครื่องนี้ (cache ยังเป็น software-company 2.5.0 · superuser ไม่เคยติดตั้ง)
- [ ] ลองใช้จริง 1 งาน (เช่น Telex) ดูใบสั่งงาน 5 ข้อ · คาด/จริง · ตัวเลข token ใน SUMMARY — ใช้เป็น eval ก่อน/หลังสำหรับ README
- [ ] ยังไม่ได้ตรวจ: ชื่อลูกทีมในคอลัมน์ token (จาก `agentType` ใน meta.json) ตรงกับคอลัมน์ log (`input.agent_type`) ไหม · ลูกทีมที่ยังไม่จบตอน Stop นับรอบถัดไป
- [ ] รูป `docs/plugins/sqt-toolkit/` ไม่มี agent/playbook ให้วาด (data ว่าง) — ดูว่าควรตัดออกจากชุดรูปหรือทำรูป map แบบ skill ล้วน
- [ ] ทำให้ดัง: README ภาษาอังกฤษ + GIF เดโม · ตัด path ส่วนตัวออกจากแกน · ส่ง official marketplace · รองรับ Codex/Cursor/OpenCode
