---
name: project-bootstrap
description: Use when starting a repository or one is slow to run on a new machine (layout, README, one run command).
---

# ตั้งต้นโปรเจกต์

> **กฎข้อเดียว:** คนที่ไม่เคยเห็นโปรเจกต์นี้มาก่อน ต้องรันได้ภายใน **30 นาที**
> โดยอ่านแค่ `README.md` และไม่ต้องถามใคร

## เมื่อไหร่ใช้ skill นี้

เริ่ม repository ใหม่ · คนใหม่ใช้ครึ่งวันกว่าจะรันได้ · pull request diff ทั้งไฟล์เพราะตัวจัดรูปแบบไม่ตรงกัน · ไม่มีใครรู้ว่าเอกสารอยู่ไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ตั้ง pipeline build และ deploy | `cicd-and-release` |
| ค่าตั้งต่อ environment และ secret | `config-and-secrets` |
| เลือกสถาปัตยกรรม | `architecture-patterns` |
| ตั้ง test framework | `testing-standards` |
| ตั้งชื่อเอกสาร | `document-naming` |

---

## 1 · โครงโฟลเดอร์

**ราก (โฟลเดอร์ที่ผู้ใช้เปิด) จัดตาม `project-doc-set` ข้อ 1 แบบ B** — ผังราก แบบ ecosystem และที่อยู่ไฟล์ของ SuperUser (`.claude/superuser/`) อยู่ที่นั่นที่เดียว · โค้ดอยู่ใน `<project-name>/` โครงข้างในเป็นแบบนี้:

ใน `<project-name>/` (ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-`): `README.md` (ข้อ 2) · `CHANGELOG.md` · `.env.example` (เฉพาะเมื่ออ่าน environment variable จริง · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · ค่าลับ · `_to_delete/`) · `src/` · `tests/` · `scripts/` (setup · seed · migrate) — ผังพร้อมคำอธิบาย [`references/code-folder.md`](references/code-folder.md) · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ในโฟลเดอร์โค้ด (`project-doc-set` ข้อ 1)

**ชื่อโฟลเดอร์โค้ด** — เอาชื่อโฟลเดอร์โปรเจกต์มาทำเป็นตัวพิมพ์เล็ก เว้นวรรคและเครื่องหมายเปลี่ยนเป็น `-` ตัวเดียว:
`Lumio - Light Meter/` → `lumio-light-meter/`
คำสั่ง build test และ run ทุกตัวรันจากในโฟลเดอร์นี้ ส่วนชื่อแพ็กเกจในภาษาที่บังคับรูปแบบ (Dart `name:` ใน pubspec · Python package) ยังตั้งตามกฎของภาษา เพราะกฎนี้คุมแค่ชื่อโฟลเดอร์

**กฎของราก (ชั้นบนสุดของโฟลเดอร์โปรเจกต์):**
- มีแค่ของในผัง `project-doc-set` ข้อ 1 · ข้อยกเว้นประกาศใน README ของโปรเจกต์ · README, CHANGELOG และไฟล์ตั้งค่าอยู่ใน repo · `.docx`/`.xlsx` ที่ได้รับมาอยู่ `ref/` ที่เราเขียนอยู่ `docs/`
- **ของชั่วคราวไม่เคยอยู่ที่ราก** — ถ้าไฟล์ชั่วคราวที่ agent สร้างไปตกที่ราก ให้ย้ายเข้า `_to_delete/` ทันที
- ถ้า build แล้วมีโฟลเดอร์งอกที่ราก (เช่น `build/` `lib/` ว่างหลังย้ายโค้ด) แปลว่า cache ของเครื่องมือยังจำ path เก่า ให้ล้าง cache (`flutter clean` · ลบ `obj/`) แล้ว build ใหม่
- ชื่อโฟลเดอร์และไฟล์ใน repo เป็นตัวพิมพ์เล็กคั่นด้วยขีดกลาง ไม่มีเว้นวรรค **ยกเว้นภาษาที่มีธรรมเนียมของตัวเอง** ให้ตามภาษานั้น

**ข้อยกเว้นตาม stack** — ชื่อโฟลเดอร์โค้ด โฟลเดอร์ทดสอบ และชื่อไฟล์ใน repo ใช้ตามที่เครื่องมือของภาษาคาดไว้
ไม่ฝืนให้เป็น `src/` `tests/`:

| Stack | โค้ด | ทดสอบ | ชื่อไฟล์ |
|---|---|---|---|
| ทั่วไป (Node · .NET) | `src/` | `tests/` | `kebab-case` (.NET ใช้ `PascalCase.cs`) |
| Python | `src/<package>/` | `tests/` | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` | `snake_case.dart` (lint `file_names`) · `android/` `ios/` อยู่ใน repo |

skill อื่นที่เขียน `tests/` หรือ `test/` ให้อ่านว่า "โฟลเดอร์ทดสอบของ stack นั้น" แล้วเลือกชื่อเดียวใช้ทั้ง repo

**แบบ A** (ใช้เมื่อผู้ใช้ขอเท่านั้น · ข้อนี้คือเจ้าของผัง) — เพิ่ม `<project-name>/docs/` ในโฟลเดอร์โค้ด เป็น markdown ล้วน ผังข้างในเหมือน `docs/` ของแบบ B (`README.md` สารบัญ · `decisions/ADR-NNNN-<slug>.md` · `runbook-<เรื่อง>.md` · `research/`) ไม่มี `.docx` หรือ PNG ส่งมอบ · ส่วนที่เหลือของรากยังตามผัง `project-doc-set` ข้อ 1 โดยไม่มี `docs/` ที่ราก

**`docs/README.md` คือสารบัญ ไม่ใช่เนื้อหา:**

แม่แบบ → `assets/starter-files.md` (คอลัมน์ เอกสาร · อ่านเมื่อ · เจ้าของ · อัปเดตล่าสุด)

---

## 2 · README ต้องตอบ 5 คำถาม

| # | คำถาม | ยาวแค่ไหน |
|:--:|---|---|
| 1 | โปรเจกต์นี้คืออะไร ทำอะไรให้ใคร | 2–3 บรรทัด |
| 2 | ต้องมีอะไรบ้างบนเครื่อง (เวอร์ชันด้วย) | ตาราง |
| 3 | **ติดตั้งและรันยังไง** | คำสั่งที่คัดลอกไปวางแล้วใช้ได้จริง |
| 4 | รัน test ยังไง | 1 คำสั่ง |
| 5 | เอกสารและคนที่ต้องถาม อยู่ที่ไหน | ลิงก์ไป `docs/README.md` |

แม่แบบ README (Node · Flutter / Android) → `assets/starter-files.md` · แอปที่ไม่มี DB หรือ Docker ก็ต้องบอกของบนเครื่องให้ครบ

> **ทุกคำสั่งต้องเคยรันจริงบนเครื่องเปล่า** เพราะ README ส่วนใหญ่ผิดตรงที่คนเขียน
> มีของครบอยู่แล้วบนเครื่องตัวเอง จึงไม่เห็นว่ามีขั้นตอนที่หายไป
>
> **1 คำสั่งติดตั้ง 1 คำสั่งรัน** — ถ้ามี 12 ขั้นตอน ให้เขียนเป็น `scripts/setup.sh`

---

## 3 · CHANGELOG

รูปแบบ Keep a Changelog · หัวข้อ เพิ่ม · แก้ · เปลี่ยนที่ทำให้ของเดิมพัง · มี `[ยังไม่ปล่อย]` รอไว้เสมอ — ตัวอย่างเต็ม [`references/changelog-examples.md`](references/changelog-examples.md)

**ต้องมี CHANGELOG ไหม**

| สถานการณ์ | CHANGELOG |
|---|---|
| ส่งงานให้ลูกค้า มีรอบ UAT หรือมีเลขเวอร์ชัน | ต้องมี — ลูกค้าและผู้ตรวจรับดูว่ารอบนี้ได้อะไร |
| คนอื่นเรียกใช้ (API · library · แอปที่มีผู้ใช้) | ต้องมี — เขารู้ว่าต้องแก้อะไรฝั่งตัวเองไหม |
| ต้นแบบ · สคริปต์ส่วนตัว · ทำคนเดียวและไม่มีรอบปล่อย | ไม่ต้อง — `git log` พอ · เขียนเหตุผลไว้ใน README |

**เขียนให้คนใช้งานอ่าน** — 1 ข้อ 1 บรรทัด บอกผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit ชื่อไฟล์หรือเลข ticket · งานที่มองไม่เห็นไม่ใส่ เว้นแต่รู้สึกได้ · "เปลี่ยนที่ทำให้ของเดิมพัง" อยู่บนสุดเสมอ · กฎเต็มและตัวอย่าง ❌ → ✅ ใน [`references/changelog-examples.md`](references/changelog-examples.md)
- เลขเวอร์ชันและกฎการขึ้นเลข ดู `cicd-and-release`

---

## 4 · ตัวจัดรูปแบบและ linter — จบการเถียงเรื่องสไตล์

- `.editorconfig` (เว้นวรรค · ตัวขึ้นบรรทัด · encoding) ทุกภาษา · แม่แบบพร้อม `.gitattributes` → `assets/starter-files.md`
- ตัวจัดรูปแบบจัดสไตล์ตอนบันทึก (Prettier · dotnet format · black/ruff · `dart format`) · linter จับของที่ผิดจริงเท่านั้น (ESLint · analyzer ของ .NET · ruff · `flutter analyze`)
- 🚨 ตั้ง `end_of_line = lf` และ `.gitattributes` `* text=auto eol=lf` — ไม่งั้นทีมที่ใช้ Windows ปนระบบอื่นจะเจอ pull request ที่ diff ทั้งไฟล์
- **ตัวจัดรูปแบบตัดสินใจแทนคน** จะเลือกค่าไหนก็ได้ แต่ต้องเป็นค่าเดียวกันทั้งทีม
- ให้ CI ตรวจด้วย ไม่ใช่พึ่งว่าทุกคนตั้งเครื่องเหมือนกัน
- เวลาเปิดใช้กับโปรเจกต์เก่า ให้จัดรูปแบบทั้ง repo ใน **commit เดียวที่ไม่มีอย่างอื่นปน**
  แล้วใส่ commit นั้นใน `.git-blame-ignore-revs`

---

## 5 · Dependency

- **commit lock file เสมอ** และติดตั้งบน CI ด้วยคำสั่งที่ยึด lock (`npm ci` · `flutter pub get --enforce-lockfile`) ไม่งั้น build แต่ละวันได้คนละชุด
- ตรวจช่องโหว่ใน pipeline (`cicd-and-release`) · อัปเดตเป็นรอบ: patch เดือนละครั้ง minor ไตรมาสละครั้ง ไม่ใช่รอพัง
- dependency ใหม่ต้องมีเหตุผลใน pull request (`lazy-coding`)

**ก่อนเพิ่มไลบรารี ถาม 3 ข้อ** — มาตรฐานของภาษาทำได้ไหม โครงการยังมีชีวิตอยู่ไหม และ
สัญญาอนุญาตใช้ได้กับงานที่ขายไหม (ดู `prior-art-review`)

---

## 6 · รายการตรวจเมื่อเปิดโปรเจกต์ใหม่

ติ๊ก `[x]` เฉพาะข้อที่**รันหรือเปิดดูแล้วในรอบนี้** ข้อที่ยังไม่ได้สร้างหรือยังไม่ได้รัน ให้ใส่ `[ ]` พร้อมบอกว่าค้างอะไร ส่วนข้อที่ไม่เกี่ยวกับโปรเจกต์นี้ ให้ใส่ `N/A — <เหตุผล>`

- [ ] `README.md` ตอบครบ 5 คำถาม และคำสั่งเคยรันจริงบนเครื่องเปล่า
- [ ] รากตรงผังใน `project-doc-set` ข้อ 1 (repo ชื่อโปรเจกต์ตัวเล็กคั่น `-` · ecosystem ใช้ `ecosystem/`) และไม่มีไฟล์ชั่วคราวหรือ `.docx` ที่ราก
- [ ] `.env.example` มีค่าครบทุกตัวพร้อมคอมเมนต์ ถ้าโปรเจกต์ไม่อ่าน environment variable เลย (เช่นแอปมือถือออฟไลน์) ก็ไม่ต้องสร้าง แต่ให้เขียนใน README ว่า "ไม่มีค่าตั้งภายนอก"
- [ ] `.editorconfig` · `.gitattributes` · ตัวจัดรูปแบบ · linter ตั้งแล้ว และ CI ตรวจ
- [ ] `.gitignore` ครอบคลุม `.env` · โฟลเดอร์ build · `_to_delete/` · Android: `key.properties` · `*.jks` · `*.keystore`
- [ ] `docs/README.md` เป็นสารบัญ พร้อมเจ้าของแต่ละเอกสาร
- [ ] `CHANGELOG.md` มีหัวข้อ "ยังไม่ปล่อย" รออยู่
- [ ] test อย่างน้อย 1 ตัวที่รันผ่าน เพื่อพิสูจน์ว่าโครงใช้ได้
- [ ] `main` ถูกป้องกัน ต้องผ่าน pull request และ CI ส่วน repo ที่ยังไม่มี remote หรือทำคนเดียวข้ามข้อนี้ได้ แต่ต้องเขียนเหตุผลไว้ใน README และรัน test กับ linter ก่อน commit แทน
- [ ] **ให้คนที่ไม่ได้ตั้งโปรเจกต์ลองทำตาม README แล้วจับเวลา**

---

## 7 · Anti-patterns

❌ README มีแต่ชื่อ · คำสั่งที่ไม่เคยรันบนเครื่องเปล่า · "ขอ `.env` จากพี่คนนั้น" (ไม่มี `.env.example`) · ไม่ commit lock file · ไม่มี `.editorconfig` · linter เถียงเรื่องสไตล์ · ไฟล์ทดลองที่ราก (`test.js` `backup_final.zip`) · เอกสารกระจายในแชตและ Drive ไม่มีสารบัญ · CHANGELOG ที่ก๊อปรายการ commit


## 8 · ตัวย่อ

**lock file** ไฟล์ตรึงเวอร์ชัน dependency · **linter** ตัวตรวจโค้ดหาของที่น่าจะผิด · **formatter** ตัวจัดรูปแบบอัตโนมัติ · **LF** Line Feed ตัวขึ้นบรรทัดแบบ Unix (Windows ใช้ CRLF) · **CI** Continuous Integration การตรวจอัตโนมัติทุกครั้งที่รวมโค้ด

## 9 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: ของชั่วคราว → `temp-file-discipline` · commit ที่สร้าง CHANGELOG ได้ → `commit-message-format` · ก่อนเพิ่ม dependency → `lazy-coding` · `prior-art-review` · แม่แบบไฟล์ทั้งหมด → `assets/starter-files.md`