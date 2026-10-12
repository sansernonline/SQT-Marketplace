# prompt — ชุดคำสั่งพร้อมวาง สำหรับทุก plugin ในชุด

1 ไฟล์ต่อ 1 สถานการณ์หรือช่วงงาน ทุก plugin · ในไฟล์มีหลาย prompt (เรียกว่า "ฉบับ") แต่ละฉบับทำงาน 1 ชิ้น

แยกโฟลเดอร์ตาม plugin · ชื่อโฟลเดอร์ = ชื่อ plugin

```
prompt/
├─ README.md            ไฟล์นี้ (สารบัญ)
├─ software-company/    18 ไฟล์
├─ career/ · consumer-rights/ · dev-learning/ · graphic-design/
├─ health-wellness/ · home-family/ · online-seller/ · personal-life/
├─ thai-workplace/ · trading-finance/
│                       4–5 ไฟล์ตามสถานการณ์ + README.md (รายการไฟล์ · เลือกจากสถานการณ์)
└─ superuser/           งานทั่วไป + ฉบับกลางที่ใช้ได้ทุก plugin
```

| plugin | ไฟล์ |
|---|---|
| `software-company` | `software-company/` — 18 ไฟล์ตามช่วงงาน · ดู [รายการไฟล์](#รายการไฟล์) |
| plugin อื่น 10 ตัว | `<ชื่อ plugin>/prompt-<สถานการณ์>.md` · เลือกไฟล์จาก `<ชื่อ plugin>/README.md` · ดู [plugin อื่น](#plugin-อื่น) |
| `superuser` | `superuser/prompt-superuser.md` ไฟล์เดียว |

## วิธีใช้ (software-company)

1. เปิด Claude Code, Codex CLI หรือ Gemini CLI ที่**รากโฟลเดอร์โปรเจกต์**
2. วางทั้งไฟล์ แล้วพิมพ์ต่อท้ายว่าจะทำฉบับไหน เช่น `ทำทั้งหมด` หรือ `ทำข้อ 3 และ 4`
3. agent เปิด skill `superuser` (playbook `project-docs`) แล้วถามช่อง "ผู้ใช้กรอก" ที่ยังว่างครั้งเดียวก่อนเริ่ม จากนั้นทำทุกฉบับที่สั่งจนจบในรอบเดียว ไม่หยุดรอให้พิมพ์ `ต่อ`
4. ระหว่างทาง agent เลือกเองทางที่ผลกระทบน้อยสุด และจดไว้ใน `docs/BUILD-PLAN.md` หัวข้อ `## ตัดสินใจเอง` (skill `decision-log`)
5. คุณตรวจทีเดียวตอนจบ · ไม่เห็นด้วยข้อไหน → แก้ที่หัวข้อนั้น แล้วสั่งทำใหม่เฉพาะฉบับนั้น

## รายการไฟล์

ไฟล์จัดเป็น 6 กลุ่มตามช่วงงาน · ชื่อไฟล์ไม่มีชื่อกลุ่ม ให้ดูจากตารางนี้

| กลุ่ม | ไฟล์ | ใช้เมื่อ | ฉบับในไฟล์ |
|---|---|---|---|
| ก่อนได้งาน | `software-company/prompt-proposal.md` | ลูกค้าส่ง TOR หรือขอใบเสนอ | 1 อ่าน TOR · 2 ประเมินงานและราคา · 3 proposal |
| ก่อนได้งาน | `software-company/prompt-poc.md` | ต้องพิสูจน์ให้ลูกค้าหรือผู้บริหารเห็นว่าทำได้จริง ก่อนลงเงิน | 1 แผนและเกณฑ์ผ่าน · 2 สร้าง POC · 3 วัดผลและเตรียม demo · 4 สรุปผลและข้อเสนอไปต่อหรือไม่ |
| ก่อนได้งาน | `software-company/prompt-tor.md` | เราเป็นผู้ว่าจ้าง หรือช่วยลูกค้าร่าง TOR | 1 ร่าง TOR · 2 ราคากลางและเกณฑ์ให้คะแนน · 3 ตรวจ TOR ก่อนประกาศ |
| Dev | `software-company/prompt-new-project.md` | เปิดโปรเจกต์ใหม่ | **0 research แอปต้นแบบ** (เช่น "อยากได้แบบ MobaXterm") · 1 project plan · 2 BRD · 3 SRS · **4 user story (ชี้ไป prompt-user-story)** · 5 mockup · 6 ตรวจ mockup (ชี้ไป prompt-mockup) · 7 architecture + ADR · 8 FSD · 9 test plan + test case · 10 tech doc · **11 prompt agent-loop ของโปรเจกต์** · 12 คู่มือ (ชี้ไป prompt-manual) · 13 ตรวจเอกสาร · 14 render .docx/.pdf · 15 Document Checklist (ขนาด L) |
| Dev | `software-company/prompt-user-story.md` | ต้องมี backlog ก่อนวางแผน sprint | 1 story จาก SRS/BRD · 2 story ฟีเจอร์ใหม่จากคำเล่า · 3 ปรับ story ให้พร้อมเข้า sprint |
| Dev | `software-company/prompt-mockup.md` | ต้องมีหน้าจอให้ลูกค้าเห็นก่อนเขียนโค้ด | 1 สร้าง mockup กดได้จริง · 2 ตรวจ mockup · 3 แก้ตามความเห็นลูกค้า / CR |
| Dev | `software-company/prompt-existing-dev.md` | รับแอปที่มีอยู่มาพัฒนาต่อ | 1 รับช่วงโค้ด · 2 เพิ่มฟีเจอร์ · 3 ปรับโครง/อัปเกรดเวอร์ชัน · 4 ทำให้เร็วขึ้น |
| Dev | `software-company/prompt-change.md` | มีคำขอเปลี่ยน / พบบั๊ก หลังส่งงาน | 1 change request · 2 bugfix |
| Test | `software-company/prompt-test-automation.md` | มีแอปแล้ว ต้องทำ automated test อย่างเดียว | 1 แผนทดสอบอัตโนมัติ · 2 test case จากแอปจริง · 3 เขียน test · 4 ต่อเข้า CI |
| Test | `software-company/prompt-quality.md` | ตรวจคุณภาพก่อนปล่อยหรือตามรอบ | 1 security review · 2 code review · 3 doc sync (เอกสารกับโค้ดไม่ตรงกัน) |
| เอกสาร | `software-company/prompt-existing-code.md` | มีแอปอยู่แล้ว ได้รับมอบหมายให้ทำเอกสาร | 1 reverse spec (`docs/as-is/`) · 2 SRS · 3 FSD · 4 tech doc · 5 คู่มือ (ชี้ไป prompt-manual) |
| เอกสาร | `software-company/prompt-manual.md` | ทำคู่มือและอบรมผู้ใช้ | 1 user manual แยกบทบาท · 2 training guide |
| ส่งมอบและดูแล | `software-company/prompt-release.md` | เตรียม deploy / ออกรุ่น | 1 deploy guide · 2 release notes · 3 runbook |
| ส่งมอบและดูแล | `software-company/prompt-handover.md` | ส่งงานต่อ / ปิดโครงการ | 1 handover · 2 retrospective |
| ส่งมอบและดูแล | `software-company/prompt-operations.md` | ระบบขึ้นใช้งานจริงแล้ว | 1 รับมือระบบล่ม · 2 postmortem · 3 แผนเฝ้าระวัง · 4 threat model · 5 เก็บกวาดเครื่อง |
| Dev | `software-company/prompt-explore.md` | ต้องรู้หรือพิสูจน์ก่อนลงมือ | 1 ตอบคำถามเชิงเทคนิค · 2 ทำเองหรือใช้ของที่มี · 3 ทดลองหลายแบบ · 4 หน้าจอตรงต้นแบบ |
| ผลิตภัณฑ์ | `software-company/prompt-product.md` | ตัดสินใจเชิงผลิตภัณฑ์ / นำเสนอ | 1 ตั้งชื่อ · 2 roadmap · 3 แผน sprint · 4 deck นำเสนอ |
| ผลิตภัณฑ์ | `software-company/prompt-growth.md` | ให้คนค้นเจอและเริ่มใช้ | 1 ตรวจ SEO · 2 เพิ่ม conversion · 3 ภาพประกอบ · 4 ประสบการณ์นักพัฒนา |

## เลือกจากสถานการณ์

ไฟล์ในตารางนี้อยู่ใน `software-company/` ทั้งหมด

| สถานการณ์ | ใช้ |
|---|---|
| ลูกค้าส่ง TOR มาให้ยื่นข้อเสนอ | `prompt-proposal.md` ทั้งหมด · TOR กำหนดให้ทำ POC → `prompt-poc.md` ก่อนฉบับ 3 ของ proposal |
| ลูกค้ายังไม่เชื่อว่าทำได้ ขอดูของจริงก่อน | `prompt-poc.md` ทั้งหมด → ผ่าน → `prompt-proposal.md` ฉบับ 2 → 3 |
| ต้องเขียน TOR เพื่อหาผู้รับจ้าง | `prompt-tor.md` ทั้งหมด · ไม่แน่ใจว่าทำได้จริง → `prompt-poc.md` ก่อนฉบับ 1 |
| ลูกค้าอยากได้ระบบใหม่ ยังไม่มีอะไรเลย | `prompt-new-project.md` ทั้งหมด (วาง `prompt-user-story.md` และ `prompt-mockup.md` ต่อท้ายด้วย) |
| จะเริ่ม sprint แต่ยังไม่มี backlog | `prompt-user-story.md` ฉบับ 1 (มี SRS) หรือ 2 (ไม่มี) → 3 → `prompt-product.md` ฉบับ 3 |
| ลูกค้าดู mockup แล้วขอแก้ | `prompt-mockup.md` ฉบับ 3 (ขัดกับ SRS → `prompt-change.md` ฉบับ 1 ก่อน) |
| มีแอปแล้ว ให้มาทำ spec | `prompt-existing-code.md` ฉบับ 1 → 2 → 3 |
| มีแอปแล้ว ให้มาทำคู่มือผู้ใช้ | `prompt-existing-code.md` ฉบับ 1 (เฉพาะ `features.md`) → `prompt-manual.md` ฉบับ 1 |
| มีแอปแล้ว ให้มาทำ API spec หรือ data dictionary | `prompt-existing-code.md` ฉบับ 1 → 4 |
| มีแอปแล้ว ให้มาทำ automated test | `prompt-test-automation.md` ทั้งหมด |
| รับโค้ดจากทีมอื่นมาดูแลต่อ | `prompt-existing-dev.md` ฉบับ 1 · ไม่มีเอกสารเลยเพิ่ม `prompt-existing-code.md` ฉบับ 1 |
| ลูกค้าขอเพิ่มฟีเจอร์ในแอปเดิม | `prompt-change.md` ฉบับ 1 → `prompt-existing-dev.md` ฉบับ 2 |
| framework หมดอายุ ต้องอัปเกรด | `prompt-existing-dev.md` ฉบับ 3 (ไม่มี test → `prompt-test-automation.md` ก่อน) |
| ระบบช้า | `prompt-existing-dev.md` ฉบับ 4 |
| ผู้ใช้แจ้งบั๊ก | `prompt-change.md` ฉบับ 2 |
| ก่อนขึ้นระบบจริง | `prompt-quality.md` → `prompt-release.md` → `prompt-operations.md` ฉบับ 3 และ 4 |
| ระบบจริงล่ม | `prompt-operations.md` ฉบับ 1 → 2 → `prompt-change.md` ฉบับ 2 |
| "โค้ดตรงนี้ทำงานอย่างไร" · "ทำไมทำแบบนี้" | `prompt-explore.md` ฉบับ 1 |
| ต้องเลือกไลบรารี / ทางทำ แต่ยังไม่แน่ใจ | `prompt-explore.md` ฉบับ 2 → 3 |
| หน้าจอที่ทำไม่เหมือน mockup | `prompt-explore.md` ฉบับ 4 |
| ผลิตภัณฑ์ใหม่ยังไม่มีชื่อ / ต้องวางแผนหลายเดือน | `prompt-product.md` ฉบับ 1 → 2 → 3 |
| ต้องไปนำเสนอ | `prompt-product.md` ฉบับ 4 |
| เว็บไม่มีคนเข้า / มีคนเข้าแต่ไม่สมัคร | `prompt-growth.md` ฉบับ 1 → 2 |

สถานการณ์ใหม่ที่ประกอบจากฉบับที่มีอยู่ได้ → เพิ่มแถวในตารางนี้ ไม่ต้องสร้างไฟล์ใหม่

## plugin อื่น

แยกไฟล์ตามสถานการณ์แบบเดียวกับ `software-company` · แต่ละโฟลเดอร์มี `README.md` ของตัวเอง มีตาราง "รายการไฟล์" และ "เลือกจากสถานการณ์" (16–20 แถว) · เปิด agent ที่**โฟลเดอร์งานของเรื่องนั้น** (ไม่ใช่โฟลเดอร์โปรเจกต์โค้ด) · เลือกไฟล์จากตาราง กรอกช่อง "ผู้ใช้กรอก" แล้ววางทั้งไฟล์ + `ทำข้อ N`

ต่างจาก `software-company` ตรงนี้: ใช้ playbook ของ plugin นั้น (ไม่ใช่ `project-docs`) · ไฟล์ทำงานของ `superuser` (`.claude/superuser/CONTEXT.md`) อยู่ในโฟลเดอร์งาน · ของที่ย้อนไม่ได้ (ส่ง · จ่าย · ยื่น · โพสต์ · ลบ) อยู่ใน "รออนุมัติ" เสมอ · ฉบับ "ตรวจก่อนส่ง" มีฉบับเดียวต่อ plugin ไฟล์อื่นชี้ไปที่ฉบับนั้น

| plugin | ไฟล์ (สถานการณ์) | ฉบับ |
|---|---|---|
| [`career`](career/README.md) | `prompt-job-search` หางาน สัมภาษณ์ ต่อรอง · `prompt-at-work` ระหว่างทำงาน · `prompt-career-change` เปลี่ยนสาย กลับมาทำงาน · `prompt-leaving-job` ลาออก ถูกเลิกจ้าง | 13 |
| [`consumer-rights`](consumer-rights/README.md) | `prompt-before-buying` ก่อนซื้อ ก่อนโอน · `prompt-money-back` ขอเงินคืน ถูกหลอก บิลผิด · `prompt-complaint` ร้องเรียน ยกเลิกสัญญา ประกันภัย ผู้รับเหมา · `prompt-warranty` ประกันสินค้า เสียซ้ำ | 12 |
| [`dev-learning`](dev-learning/README.md) | `prompt-start-learning` เริ่มเรียน stack ใหม่ · `prompt-read-and-apply` paper เอกสารอังกฤษ เล่าให้ทีม · `prompt-keep-up` เรดาร์ อัปเกรดเวอร์ชัน · `prompt-certification` สอบใบรับรอง · `prompt-portfolio` side project | 14 |
| [`graphic-design`](graphic-design/README.md) | `prompt-brand` brand kit ของพิมพ์ จัดไฟล์ · `prompt-campaign` แคมเปญ โปรด่วน ลูกค้าสั่งแก้ · `prompt-images` ชุดภาพ AI ภาพสินค้า โพสต์ทั้งเดือน · `prompt-video` วิดีโอสั้น โลโก้เคลื่อนไหว | 14 |
| [`health-wellness`](health-wellness/README.md) | `prompt-checkup` ตรวจประจำปี ผลผิดปกติ สิทธิรักษา · `prompt-doctor-and-meds` หาหมอ ยา โรคประจำตัว · `prompt-family-care` พ่อแม่หลายโรค ผ่าตัด การ์ดฉุกเฉิน · `prompt-lifestyle` ออกกำลัง นอน ออฟฟิศซินโดรม เครียด | 13 |
| [`home-family`](home-family/README.md) | `prompt-house` บิล ซ่อม ย้ายเข้า น้ำท่วม · `prompt-vehicle` ภาษีรถ อุบัติเหตุ รถมือสอง · `prompt-family-week` แผนสัปดาห์ เปิดเทอม ไม่อยู่บ้าน · `prompt-care` ผู้สูงอายุ ลูก สัตว์เลี้ยง | 14 |
| [`online-seller`](online-seller/README.md) | `prompt-open-shop` เปิดร้าน ลงสินค้า ถูกระงับ · `prompt-stock-and-profit` กำไร สต็อก ปิดยอด ภาษี · `prompt-campaign-live` วันแคมเปญ ไลฟ์ · `prompt-customers` ตอบลูกค้า พัสดุหาย ข้อพิพาท | 15 |
| [`personal-life`](personal-life/README.md) | `prompt-weekly-routine` ทบทวนสัปดาห์ ประชุม กลับจากลา · `prompt-papers-and-money` เอกสาร บัตรหาย แฟ้มฉุกเฉิน รายจ่าย · `prompt-online-safety` บัญชี ถูกแฮก มือถือหาย · `prompt-life-events` เดินทาง ตัดสินใจ ย้ายบ้าน ข้อความลำบากใจ | 17 |
| [`thai-workplace`](thai-workplace/README.md) | `prompt-documents` เอกสารธุรกิจ ทวงเงิน ใบลดหนี้ · `prompt-tax-filing` ปิดงาน ภาษี เปิดบริษัท ยื่นเลยกำหนด · `prompt-employees` รับคน ลาออก วันหยุด · `prompt-pdpa-line` PDPA LINE OA | 17 |
| [`trading-finance`](trading-finance/README.md) | `prompt-trading` ก่อนเทรด ทบทวน ติดดอย · `prompt-investing` พอร์ต กองทุน ตลาดร่วง · `prompt-money-plan` แผนเงิน เงินก้อน ตกงาน · `prompt-tax` ภาษี · `prompt-scam` มิจฉาชีพ | 17 |
| `superuser` | `superuser/prompt-superuser.md` ไฟล์เดียว: 1 หาข้อมูลที่ยืนยันได้ · 2 ทำเอกสาร · 3 ตรวจงาน · 4 งานยาวที่ไม่มีคนดู (ทุก plugin) · 5 รวมบทเรียนเข้า skill (ทุก plugin) · 6 ทำ superuser ให้ plugin สาขาใหม่ | 6 |

เพิ่ม plugin ใหม่ → `superuser/prompt-superuser.md` ฉบับ 6 สร้างโฟลเดอร์ prompt ของ plugin นั้นแบบเดียวกันให้ด้วย แล้วเพิ่มแถวในตารางนี้ · สถานการณ์ใหม่ของ plugin เดิม → เพิ่มแถวใน `README.md` ของ plugin นั้นก่อน สร้างฉบับใหม่เมื่อประกอบจากฉบับที่มีไม่ได้

## โครงโฟลเดอร์ของโปรเจกต์ที่ prompt สร้างไฟล์ลงไป (software-company)

```
<project>/
├─ ref/          ไฟล์ที่ได้รับมา (TOR บันทึกประชุม ภาพระบบเดิม) — อ่านอย่างเดียว
├─ docs/         เอกสารทุกฉบับที่เราเขียน · BUILD-PLAN.md (สถานะ) · AGENT-LOOP.md
│  ├─ figures/   รูปในเอกสาร + src/ ไฟล์ต้นทาง
│  ├─ decisions/ ADR
│  └─ research/  research แอปต้นแบบ
├─ mockup/       UI mockup (.html กดได้จริง)
├─ qa/           test case · ผลทดสอบ · bugs/
├─ assets/       โลโก้ ไอคอน favicon
├─ _to_delete/   ของชั่วคราว
└─ <repo>/       โค้ด
```

สร้างโฟลเดอร์เมื่อมีไฟล์จะใส่จริงเท่านั้น · รายละเอียดอยู่ใน skill `project-doc-set`

## agent-loop

ไม่มี prompt agent-loop (prompt ที่สั่ง agent เขียนโปรแกรมวนจนเสร็จ) แบบสำเร็จรูป · ฉบับที่ 11 ของ `prompt-new-project.md` **สร้าง `docs/AGENT-LOOP.md` เฉพาะโปรเจกต์นั้น** จากเอกสารที่ทำไว้ (ข้อกำหนด · คำสั่ง test · path ของ mockup) แล้วค่อยนำ prompt นั้นไปใช้เขียนโปรแกรม · รอบแรกของ loop ตั้ง git ให้เอง (`git init` · branch `build/loop` · commit แรก) ทุก commit อยู่บนเครื่อง ไม่ push และไม่ merge เข้า branch หลัก

## หมายเหตุ

- ฉบับส่วนใหญ่สร้างเอกสารอย่างเดียว ไม่แก้โค้ด · ฉบับที่แก้โค้ดมีช่องให้ติ๊กอนุญาตก่อนเสมอ: bugfix ใน `prompt-change.md` · ฉบับ 2–4 ใน `prompt-existing-dev.md` · ฉบับ 3–4 ใน `prompt-test-automation.md` · ฉบับ 4 ใน `prompt-explore.md` · ฉบับ 3 ใน `prompt-operations.md` · ฉบับ 2 ใน `prompt-poc.md`
- กฎการทำงานร่วม (ตัดสินใจเอง · พิสูจน์ผล · รายงานสถานะ) อยู่ใน skill `superuser` · `decision-log` · `principle-prove-it-works` · `status-report` · ไม่เขียนซ้ำในไฟล์ prompt · จะแก้กฎ → แก้ที่ skill ที่เดียว
- คู่มือผู้ใช้มีที่เดียวคือ `prompt-manual.md` ฉบับ 1 · `prompt-new-project.md` ฉบับ 12 ชี้ไปที่นั่น
- user story มีที่เดียวคือ `prompt-user-story.md` · mockup มีที่เดียวคือ `prompt-mockup.md` · `prompt-new-project.md` ฉบับ 4–6 ชี้ไปที่นั่น
- ภาษาทุกเอกสารตาม `human-writing` · รูปในเอกสารส่งมอบใช้ `diagram-figures` แบบเดียวทั้งชุด
- ไฟล์แยกรายฉบับรุ่นเก่าและ `agent-loop.ps1` เก็บไว้ที่ `../_to_delete/prompt-folders-backup/` · ไฟล์เดียวต่อ plugin รุ่นเก่าเก็บไว้ที่ `../_to_delete/prompt-single-file-backup/` — ลบได้เมื่อไม่ต้องการ
