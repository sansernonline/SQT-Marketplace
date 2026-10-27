# skill: project-bootstrap

Use when starting a repository or one is slow to run on a new machine (layout, README, one run command).

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

ใน `<project-name>/` (ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-`): `README.md` (ข้อ 2) · `CHANGELOG.md` · `.env.example` (เฉพาะเมื่ออ่าน environment variable จริง · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · ค่าลับ · `_to_delete/`) · `src/` (unit test อยู่ข้างไฟล์โค้ด · `readable-code` ข้อ 7) · `tests/` (เฉพาะ integration · e2e หรือ stack ที่เครื่องมือบังคับ ดูตารางข้อ 1) · `scripts/` (setup · seed · migrate) — ผังพร้อมคำอธิบาย [`references/code-folder.md`](references/code-folder.md) · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ในโฟลเดอร์โค้ด (`project-doc-set` ข้อ 1)

**ชื่อโฟลเดอร์โค้ด** — เอาชื่อโฟลเดอร์โปรเจกต์มาทำเป็นตัวพิมพ์เล็ก เว้นวรรคและเครื่องหมายเปลี่ยนเป็น `-` ตัวเดียว:
`Lumio - Light Meter/` → `lumio-light-meter/`
คำสั่ง build test และ run ทุกตัวรันจากในโฟลเดอร์นี้ ส่วนชื่อแพ็กเกจในภาษาที่บังคับรูปแบบ (Dart `name:` ใน pubspec · Python package) ยังตั้งตามกฎของภาษา เพราะกฎนี้คุมแค่ชื่อโฟลเดอร์

**กฎของราก (ชั้นบนสุดของโฟลเดอร์โปรเจกต์):**
- มีแค่ของในผัง `project-doc-set` ข้อ 1 · ข้อยกเว้นประกาศใน README ของโปรเจกต์ · README, CHANGELOG และไฟล์ตั้งค่าอยู่ใน repo · `.docx`/`.xlsx` ที่ได้รับมาอยู่ `ref/` ที่เราเขียนอยู่ `docs/`
- **ของชั่วคราวไม่เคยอยู่ที่ราก** — ถ้าไฟล์ชั่วคราวที่ agent สร้างไปตกที่ราก ให้ย้ายเข้า `_to_delete/` ทันที
- ถ้า build แล้วมีโฟลเดอร์งอกที่ราก (เช่น `build/` `lib/` ว่างหลังย้ายโค้ด) แปลว่า cache ของเครื่องมือยังจำ path เก่า ให้ล้าง cache (`flutter clean` · ลบ `obj/`) แล้ว build ใหม่
- ชื่อโฟลเดอร์และไฟล์ใน repo เป็นตัวพิมพ์เล็กคั่นด้วยขีดกลาง ไม่มีเว้นวรรค **ยกเว้นภาษาที่มีธรรมเนียมของตัวเอง** ให้ตามภาษานั้น

**ข้อยกเว้นตาม stack** — ชื่อโฟลเดอร์โค้ด โฟลเดอร์ทดสอบ และชื่อไฟล์ใน repo ใช้ตามที่เครื่องมือของภาษาคาดไว้
ไม่ฝืนให้เป็น `src/` · ปกติไฟล์ทดสอบอยู่ข้างไฟล์โค้ด ใช้โฟลเดอร์ทดสอบแยกเฉพาะ stack ที่เครื่องมือบังคับ (ช่องที่เขียนว่า **บังคับ**):

| Stack | โค้ด | ทดสอบ | ชื่อไฟล์ |
|---|---|---|---|
| Node | `src/` | unit test ข้างไฟล์โค้ด (`*.test.ts`) · integration และ e2e ไว้ใน `tests/` | `kebab-case` |
| .NET | `src/` | `tests/` **บังคับ** (โปรเจกต์ทดสอบแยก `.csproj`) | `PascalCase.cs` |
| Python | `src/<package>/` | unit test ข้างไฟล์โค้ด (`test_*.py`) · integration และ e2e ไว้ใน `tests/` | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` **บังคับ** (โครงเหมือน `lib/`) | `snake_case.dart` (lint `file_names`) · `android/` `ios/` อยู่ใน repo |

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

**เขียนให้คนใช้งานอ่าน** — 1 ข้อ 1 บรรทัด บอกผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit ชื่อไฟล์หรือเลข ticket · งานที่มองไม่เห็นไม่ใส่ เว้นแต่รู้สึกได้ · "เปลี่ยนที่ทำให้ของเดิมพัง" อยู่บนสุดเสมอ · กฎเต็มและตัวอย่าง ผิด → ถูก ใน [`references/changelog-examples.md`](references/changelog-examples.md)
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

ผิด: README มีแต่ชื่อ · คำสั่งที่ไม่เคยรันบนเครื่องเปล่า · "ขอ `.env` จากพี่คนนั้น" (ไม่มี `.env.example`) · ไม่ commit lock file · ไม่มี `.editorconfig` · linter เถียงเรื่องสไตล์ · ไฟล์ทดลองที่ราก (`test.js` `backup_final.zip`) · เอกสารกระจายในแชตและ Drive ไม่มีสารบัญ · CHANGELOG ที่ก๊อปรายการ commit


## 8 · ตัวย่อ

**lock file** ไฟล์ตรึงเวอร์ชัน dependency · **linter** ตัวตรวจโค้ดหาของที่น่าจะผิด · **formatter** ตัวจัดรูปแบบอัตโนมัติ · **LF** Line Feed ตัวขึ้นบรรทัดแบบ Unix (Windows ใช้ CRLF) · **CI** Continuous Integration การตรวจอัตโนมัติทุกครั้งที่รวมโค้ด

## 9 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: ของชั่วคราว → `temp-file-discipline` · commit ที่สร้าง CHANGELOG ได้ → `commit-message-format` · ก่อนเพิ่ม dependency → `lazy-coding` · `prior-art-review` · แม่แบบไฟล์ทั้งหมด → `assets/starter-files.md`


## reference: changelog-examples.md

# CHANGELOG — ตัวอย่าง

อ่านเมื่อเขียน CHANGELOG ครั้งแรกหรือรีวิว · กฎอยู่ใน `SKILL.md` ข้อ 3 · แม่แบบเปล่าอยู่ใน `assets/starter-files.md`

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
### เพิ่ม
- แจ้งเตือนทาง LINE
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
```

เขียนเป็นผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit:

| ✗ | ✓ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## กฎการเขียน (ฉบับเต็ม)

- เขียนให้**คนใช้งาน**อ่าน ไม่ใช่คัดลอกรายการ commit มาวาง
- 1 ข้อ = 1 บรรทัด บอกว่าผู้ใช้ได้อะไรหรือเห็นอะไรเปลี่ยน ไม่ใช่ว่าแก้ไฟล์ไหน
- ไม่ใส่ชื่อไฟล์ ชื่อฟังก์ชัน หรือเลข ticket ยกเว้นผู้อ่านเป็นนักพัฒนาที่เรียก API นั้น
- ไม่ใส่งานที่ผู้ใช้มองไม่เห็น เช่น ปรับโครงโค้ด เพิ่ม test หรือแก้ CI · ยกเว้นทำให้เร็วขึ้นหรือเสถียรขึ้นจนรู้สึกได้ ให้เขียนเป็นผลที่ได้ ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที")
- ในแต่ละหัวข้อ เรียงข้อที่กระทบผู้ใช้มากที่สุดไว้บน · หัวข้อไหนไม่มีของให้ตัดหัวข้อนั้นทิ้ง
- หัวข้อ "เปลี่ยนที่ทำให้ของเดิมพัง" ต้องอยู่**บนสุด**ของเวอร์ชันนั้นเสมอ


## reference: code-folder.md

# โครงในโฟลเดอร์โค้ด — ผังเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 1 · ผังรากอยู่ใน `project-doc-set` ข้อ 1 · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ที่นี่

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · ติดตั้ง · รัน · test
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ใน `SKILL.md` ข้อ 1)
  tests/                 ← บังคับใน .NET · Flutter (`test/`) · Node และ Python ใช้เก็บเฉพาะ integration และ e2e (unit test อยู่ข้างไฟล์โค้ด) — ตาราง stack อยู่ใน `SKILL.md` ข้อ 1
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```


---

# skill: background-jobs

Use when work runs outside the user request (mail, reports, imports, schedules). Queues, retries.

# งานเบื้องหลัง

> **กฎข้อเดียว:** งานเบื้องหลังทุกตัวต้อง**รันซ้ำได้โดยไม่เกิดผลซ้ำ**
> เพราะมันจะถูกรันซ้ำแน่นอน: เครื่องดับกลางทาง · คนกดใหม่ · ระบบ retry ให้เอง

## เมื่อไหร่ใช้ skill นี้

- งานที่ผู้ใช้ไม่ควรต้องนั่งรอ: ส่งอีเมล สร้างรายงาน นำเข้าไฟล์
- งานตามเวลา: สรุปรายวัน ปิดยอดสิ้นเดือน ลบข้อมูลที่หมดอายุ
- เรียกระบบภายนอกที่ช้าหรือล่มบ่อย
- คิวตันหรือมีงานหายแล้วไม่มีใครรู้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| timeout และการ retry ของคำขอปกติ | `error-handling-patterns` | แทน |
| ตัวชี้วัดและการแจ้งเตือน | `observability-basics` | แทน |
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` | แทน |
| นำเข้าไฟล์ Excel/CSV เป็นเนื้องาน | `data-import-export` | แทน |
| ส่งอีเมล/SMS เป็นเนื้องาน | `notifications` | แทน |
| ตารางงานและ index | `database-design` | คู่ |
| log ของ worker และ correlation id | `logging-standards` | คู่ |
| งานลบข้อมูลที่หมดอายุ | `pdpa-compliance` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |
| ออกแบบระบบ agent (Loop · Graph · Dynamic · เลือก framework) | `llm-engineering` → [`agent-systems.md`](../llm-engineering/references/agent-systems.md) | คู่ |

---

## 1 · อะไรควรไปอยู่เบื้องหลัง

| เอาไปเบื้องหลัง | ทำในคำขอเลย |
|---|---|
| ใช้เวลาเกิน 1–2 วินาที | เร็วและผู้ใช้ต้องเห็นผลทันที |
| เรียกระบบภายนอกที่ล้มได้ | ตรวจสิทธิ์ · ตรวจข้อมูล |
| ผู้ใช้ไม่ต้องรอผล (อีเมล แจ้งเตือน) | ผลลัพธ์คือสิ่งที่เขากดมาดู |
| งานหลายรายการเป็นชุด | |

> **อย่าเอาไปเบื้องหลังเพียงเพราะมันช้า** ถ้าผู้ใช้ต้องเห็นผลก่อนไปต่อ
> การย้ายไปเบื้องหลังจะต้องเพิ่มหน้าจอรอ การแจ้งเตือน และที่เก็บผลลัพธ์
> บางครั้งแก้ให้เร็วขึ้นถูกกว่ามาก (ดู `lazy-coding`)

---

## 2 · เลือกกลไก

| กลไก | เหมาะกับ | ระวัง |
|---|---|---|
| **ตารางงานในฐานข้อมูล** | ระบบเล็ก–กลาง · งานไม่เกินหลักพันต่อวัน | ต้องเขียนตัวหยิบงานเอง · ระวัง worker แย่งงานกัน |
| **คิวจริง** (Redis · RabbitMQ · Amazon Simple Queue Service (SQS)) | งานเยอะ · ต้องการ retry และ dead letter ในตัว | เพิ่มของที่ต้องดูแล |
| ตัวตั้งเวลาในแอป (cron ในโค้ด) | งานตามเวลาที่มี instance เดียว | **หลาย instance จะรันพร้อมกัน** · ดูข้อ 5 |
| ตัวตั้งเวลาของแพลตฟอร์ม | งานตามเวลาบนคลาวด์ | |

**ถ้าระบบยังเล็ก ให้เริ่มจากตารางในฐานข้อมูลก่อนเสมอ** เพราะ `SELECT ... FOR UPDATE SKIP LOCKED`
ของ PostgreSQL ให้หลาย worker หยิบงานพร้อมกันได้อย่างปลอดภัย โดยไม่ต้องเพิ่มระบบใหม่

**ทุกงานต้องมีอย่างน้อย:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · รันซ้ำแล้วต้องไม่เกิดผลซ้ำ

ระบบคิวเกือบทั้งหมดรับประกันแค่ว่า "ส่งถึงอย่างน้อย 1 ครั้ง" **ไม่ใช่ 1 ครั้งพอดี**

| วิธี | ใช้ยังไง |
|---|---|
| **กุญแจกันซ้ำ** | unique constraint บน `(job_type, business_key)` ทำให้งานซ้ำ insert ไม่ผ่าน |
| **ตรวจสถานะก่อนทำ** | "ถ้าใบสั่งซื้อนี้ส่งอีเมลไปแล้ว ให้จบเลย" |
| **ส่งต่อ idempotency key** | เวลาเรียก API ภายนอก (ดู `api-conventions`) |
| **ตั้งค่าให้เป็นค่าใหม่ ไม่บวกเพิ่มจากค่าเดิม** | `set status = 'paid'` ปลอดภัยกว่า `balance = balance + 100` |

> 🚨 **งานที่บวกค่าหรือส่งของออกไปข้างนอก ถ้ารันซ้ำจะเสียเงินจริง**
> อีเมล 2 ฉบับแค่น่ารำคาญ แต่โอนเงิน 2 ครั้งเป็นเรื่องใหญ่

---

## 4 · retry และงานที่ตายแล้ว

ตัวเลขนี้สำหรับงานในคิว · ลองใหม่นอกคิวใช้ของ [`error-handling-patterns`](../error-handling-patterns/SKILL.md) §4: service เรียก service ใช้ 3 ครั้ง 1/2/4 วินาที · มีคนรอหน้าจอ → retry ไม่เกิน 1 ครั้งแล้วให้กดเอง

```
ล้ม → รอ 1 นาที → ล้ม → รอ 4 นาที → ล้ม → รอ 16 นาที → ล้มครั้งที่ 4 → dead letter
```

| กฎ | รายละเอียด |
|---|---|
| **มีเพดานเสมอ** | 3–5 ครั้ง ถ้า retry ไม่จำกัด งานเดียวก็ทำให้คิวตัน |
| เว้นเวลาเพิ่มขึ้นทุกรอบ (เท่าตัวคงที่ เช่น ×4) + สุ่มเล็กน้อย | เหมือน `error-handling-patterns` |
| ข้อมูลผิดไม่ต้อง retry | payload ผิดรูปแบบ ลองอีกกี่ครั้งก็เหมือนเดิม |
| **งานที่หมดสิทธิ์ต้องไปที่เดียว** | dead letter (ที่เก็บงานที่ล้มจนหมดสิทธิ์) โดยเก็บ payload เต็มและ error ล่าสุด |
| ต้องมีคนดู dead letter | **แจ้งเตือนเมื่อมีงานเข้าไปใหม่** ไม่ใช่รอให้ลูกค้าทัก |
| เอากลับมารันใหม่ได้ | แก้ต้นเหตุแล้วสั่งรันใหม่จาก dead letter ได้ โดยไม่ต้องเขียนสคริปต์ |

**งานที่ค้างเพราะ worker ตาย** ต้องมีตัวปลดล็อก
งานที่ `locked_at` เก่ากว่า N นาที ให้ถือว่าไม่มีใครทำอยู่แล้ว แล้วปลดล็อกให้ worker อื่นหยิบไปทำต่อ

**สถานะของงานเป็นเครื่องสถานะ ไม่ใช่ boolean** (แนวคิดจาก wshobson python-background-jobs) — ทุกกลไกในข้อ 2 ต้องตอบได้ว่างานอยู่สถานะไหนใน `queued → running → succeeded` หรือ `running → failed (attempts < เพดาน) → queued` หรือ `failed → dead` · เก็บ `attempts` · `locked_at` · `last_error` · `finished_at` ไว้กับงาน · เดินได้เฉพาะลูกศรข้างบน (งาน `succeeded` กลับไป `running` ไม่ได้ ต้องสร้างงานใหม่) · หน้าจอแอดมินและ dead letter อ่านจากสถานะนี้ที่เดียว

---

## 5 · งานตามเวลา

> 🚨 **ถ้ามีหลาย instance งานตามเวลาจะรันหลายรอบพร้อมกัน**
> รายงานสรุปยอดถูกส่ง 3 ฉบับ หรือหักเงิน 3 ครั้ง ก็เพราะข้อนี้

| วิธี | ใช้เมื่อ |
|---|---|
| ล็อกที่ฐานข้อมูล (advisory lock) | ทำได้ทันที ไม่ต้องเพิ่มของ |
| ตัวตั้งเวลาของแพลตฟอร์มยิงเข้ามาที่ endpoint | บนคลาวด์ · Kubernetes CronJob |
| ตัวตั้งเวลาที่รองรับหลาย instance โดยตรง | Quartz · Hangfire |

**กฎของงานตามเวลา:**

- **รับช่วงเวลาเป็นพารามิเตอร์** จะได้รันย้อนหลังวันที่พลาดได้โดยไม่ต้องแก้โค้ด
- ถ้าตกไป 1 รอบ ต้องตามเก็บได้ ไม่ข้ามไปเลย
- ระบุเขตเวลาให้ชัดว่า "ทุกเที่ยงคืน" ของเขตเวลาไหน (ดู `i18n-and-locale`)
- **บันทึกว่ารันรอบไหนสำเร็จแล้ว** ไม่ใช่ดูจาก log

---

## 6 · งานยาวที่ผู้ใช้รออยู่

| ต้องมี | รายละเอียด |
|---|---|
| id ของงาน | คืนให้ทันทีที่รับงาน ผู้ใช้เอาไว้ถามความคืบหน้า |
| สถานะ | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| ความคืบหน้า | "ทำแล้ว 340 จาก 1,200 รายการ" ไม่ใช่หมุนเปล่า ๆ |
| ยกเลิกได้ | งานต้องเช็คสัญญาณยกเลิกเป็นระยะ |
| ผลลัพธ์ | เก็บไว้ให้ดาวน์โหลดได้ พร้อมวันหมดอายุ |
| แจ้งเมื่อเสร็จ | อีเมลหรือแจ้งเตือนในระบบ (ดู `notifications`) |

**แบ่งงานใหญ่เป็นชิ้นเล็ก** เช่น นำเข้า 50,000 แถว ให้แบ่งเป็นงานย่อยละ 500 แถว
เพราะงานเดียวที่ใช้เวลา 40 นาที ถ้าล้มที่นาทีที่ 39 ต้องเริ่มใหม่ทั้งหมด

---

## 7 · วัดอะไร

| ตัวชี้วัด | เตือนเมื่อ |
|---|---|
| จำนวนงานค้างในคิว | โตขึ้นเรื่อย ๆ ไม่ลดลง |
| เวลารอในคิว (p95 · 95% ของงานรอไม่เกินค่านี้) | เกินที่สัญญาไว้ |
| อัตราความล้มเหลว | เกินเกณฑ์ |
| **จำนวนใน dead letter** | **เพิ่มขึ้นแม้แค่ตัวเดียว** |
| รอบของงานตามเวลาที่ไม่ได้รัน | ข้ามรอบ |
| งานที่ค้างอยู่ในสถานะ running นานผิดปกติ | เกิน N เท่าของค่าปกติ |

> **คิวที่ตันจะเงียบสนิท** API ยังตอบ 200 ทุกคำขอ health check เขียวหมด
> แต่ไม่มีอีเมลออกไป 3 ชั่วโมงแล้ว ต้องวัดถึงจะเห็น

---

## 8 · Anti-patterns

- **งานที่รันซ้ำแล้วเกิดผลซ้ำ** — คิวจะรันซ้ำแน่นอน ไม่ใช่อาจจะ
- **retry ไม่จำกัด** — งานเดียวที่พังทำให้ทั้งคิวตัน
- **ไม่มี dead letter** — งานหายเงียบ ๆ ไม่มีใครรู้
- **มี dead letter แต่ไม่มีใครดู** — เท่ากับไม่มี
- **งานตามเวลาบนหลาย instance โดยไม่มีล็อก** — รันซ้อนกัน
- **ส่งข้อมูลทั้งก้อนใน payload** — ควรส่ง id แล้วให้งานไปอ่านเอง จะได้ข้อมูลล่าสุดด้วย
- **งานยาวที่ยกเลิกไม่ได้** — ผู้ใช้กดผิดแล้วต้องรอ 40 นาที
- **หน้าจอที่หมุนเปล่าโดยไม่บอกความคืบหน้า** — ผู้ใช้จะกดซ้ำ แล้วได้งานซ้ำ
- **ไม่วัดคิว** — ตันแล้วรู้ตอนลูกค้าโทรมา

---

## 9 · durable workflow สำหรับงาน agent ที่รันยาวหรือรอคนอนุมัติ

งาน agent ที่วิ่งหลายสิบนาที เรียก LLM และ tool หลายรอบ หรือหยุดรอคนอนุมัติข้ามวัน ใช้คิวธรรมดาไม่พอ เพราะถ้าล้มที่ขั้น 8 จาก 10 ต้องเริ่มใหม่และจ่ายค่า token ซ้ำ · ให้ใช้ engine ที่บันทึกผลทุกขั้นแล้วทำต่อจากจุดเดิมได้

| เครื่องมือ | เหมาะกับ | รอคนอนุมัติด้วย | ระวัง |
|---|---|---|---|
| **Temporal** | โค้ด Python และภาษาอื่น · loop ของ agent อยู่ใน workflow ส่วนการเรียก LLM และ tool เป็น activity · มี `OpenAIAgentsPlugin` · `activity_as_tool` | (ยังไม่ได้ตรวจ หน้า signal) | integration กับ OpenAI Agents SDK ยังเป็น Public Preview |
| **AWS Step Functions** | ขั้นตอนตายตัวบน AWS · fan-out ด้วย `Map` (Inline ขนาน 40 · Distributed 10,000 งานลูก) | `.waitForTaskToken` รอได้ถึง 1 ปีจนมี `SendTaskSuccess` / `SendTaskFailure` · ตั้ง `HeartbeatSeconds` กันค้างเงียบ | งานที่ต้องให้ LLM ตัดสินทาง ต้องให้ Lambda หรือ Bedrock ตัดสินแล้วใช้ `Choice` |
| **checkpointer ของ framework agent** | ไม่อยากเพิ่ม engine · LangGraph `PostgresSaver` · Microsoft Agent Framework `CheckpointManager` · OpenAI `RunState.to_json()` | LangGraph `interrupt()` · OpenAI `needs_approval` · Microsoft Agent Framework `RequestInfoExecutor` | ตัวเก็บในหน่วยความจำหายเมื่อ process รีสตาร์ต · ใช้ตัวที่เก็บลงฐานข้อมูลใน production |

**กฎของโค้ดที่ต้อง replay ได้** (Temporal · Google ADK · Claude Code workflow ใช้หลักเดียวกัน · ตรวจกับ [Temporal: Workflow Definition](https://docs.temporal.io/workflow-definition) 2026-10-26)

- **ห้ามอ่านเวลาหรือสุ่มค่าในโค้ดที่คุมลำดับงาน** (`Date.now()` · `datetime.now()` · `Math.random()` · `uuid4()`) · ตอน replay ค่าจะต่างจากรอบแรก ลำดับงานเพี้ยน แล้วรีใช้ผลเดิมไม่ได้ · ต้องใช้เวลาหรือค่าสุ่ม ให้ทำใน activity หรือใช้ API ของ SDK ที่ให้มาสำหรับเรื่องนี้
- **การเรียก LLM เรียก tool และอ่านเขียนข้างนอกทั้งหมดอยู่ใน activity** ผลถูกบันทึกครั้งเดียว ตอน replay อ่านจากบันทึก ไม่เรียกซ้ำ
- **ลำดับการเรียกต้องเหมือนเดิมทุกรอบ** · แก้ลำดับขั้นในโค้ดที่ยังมีงานค้างอยู่ จะทำให้งานเก่า replay ไม่ผ่าน (Temporal เรียกว่า nondeterminism error) · ต้องเปลี่ยนให้ใช้ versioning หรือ patching ของ engine
- **ขั้นก่อนจุดหยุดรอต้องรันซ้ำได้** (ข้อ 3) · LangGraph รัน node ที่หยุดไว้ใหม่ตั้งแต่ต้นตอน resume จึงย้ายผลข้างเคียงไปไว้หลังจุดหยุด
- **state ที่บันทึกไว้ไม่มีการยืนยันตัวตน** (เอกสาร OpenAI เตือนเรื่อง `RunState`) · โหลดจากที่เก็บที่เราคุมเท่านั้น
- เพดานรอบ งบ token และการหยุดเมื่อไม่ดีขึ้นยังต้องมีเหมือนงานในคิว · รายละเอียดใน [`agent-systems.md`](../llm-engineering/references/agent-systems.md) หัวข้อ 6

ที่มา (เปิดอ่าน 2026-10-26): [Temporal · OpenAI Agents SDK](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [ประกาศ Temporal](https://temporal.io/blog/announcing-openai-agents-sdk-integration) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Step Functions Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html) · [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [OpenAI human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Claude Code workflows](https://code.claude.com/docs/en/workflows)


---

# skill: kubernetes-helm

Use when writing a Dockerfile, Kubernetes (k8s) manifest or Helm chart, deploying staging to production, or running STT/TTS on GPU nodes.

# kubernetes-helm — Dockerfile, manifest, Helm chart และ deploy staging → production

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้และรายงานเขียนตาม `human-writing` · ทุกรุ่นและคำสั่งตรวจกับเอกสารทางการเมื่อ 2026-10-27 ลิงก์อยู่ในไฟล์ `references/` · ตัวที่ยังไม่ได้ตรวจมีป้าย `(ยังไม่ได้ตรวจ)`

> **กฎข้อเดียว:** production รัน image ตัวเดียวกับที่ผ่าน staging มาแล้ว (ระบุด้วย digest ไม่ build ใหม่) และทุก manifest ผ่าน `helm lint` กับ `helm template | kubeconform` ก่อนแตะ cluster · ค่าลับไม่อยู่ใน image ไม่อยู่ใน values

## ใช้เมื่อ

- เขียนหรือแก้ Dockerfile ที่จะรันจริง (ไม่ใช่ห้องทดลอง)
- เขียน manifest ของ Kubernetes (Deployment · probe · securityContext · PodDisruptionBudget · HorizontalPodAutoscaler · NetworkPolicy)
- สร้างหรือแก้ Helm chart · ตั้งค่าแยก staging กับ production · ตั้งวิธีเก็บค่าลับ
- ปล่อยระบบขึ้น staging แล้วเลื่อนขึ้น production · ย้อนรุ่น
- ให้ workload ใช้ GPU (STT/TTS) หรือขยาย worker ตามงานค้างใน Kafka

ไม่ใช้เมื่อ: ยังไม่มี cluster และต้องสร้างเครื่องหรือ node pool → `infra-as-code` · ทีมเล็กที่ VM เครื่องเดียวกับ docker compose พอ → `infra-as-code` หัวข้อ 1 และ 8 ก่อนตัดสินใจใช้ Kubernetes · ห้องทดลองรันโค้ดไม่น่าไว้ใจ → `docker-sandbox` · แค่ขอคำอธิบายแนวคิดสั้น ๆ ตอบตรงโดยไม่ต้องเปิด 9 ขั้น

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| สร้าง cluster · node pool · เครือข่ายจากโค้ด | [`infra-as-code`](../infra-as-code/SKILL.md) | ที่นั่นสร้างของ ที่นี่ลงของบน cluster · คำถามว่าคุ้มใช้ Kubernetes ไหมอยู่ที่นั่น |
| ค่าลับ · config ต่อ environment | [`config-and-secrets`](../config-and-secrets/SKILL.md) | ที่นั่นกำหนดว่าอะไรเป็นลับและหมุนอย่างไร ที่นี่กำหนดว่าเข้า pod ทางไหน |
| pipeline build · ด่าน · rollback ระดับระบบ | [`cicd-and-release`](../cicd-and-release/SKILL.md) | build ครั้งเดียวแล้วเลื่อนขั้น (หัวข้อ 2) มาจากที่นั่น ที่นี่ลงรายละเอียดฝั่ง Kubernetes · เขียนไฟล์ Jenkins → `jenkins-pipeline` ถ้ามี |
| endpoint `/health/live` กับ `/health/ready` · ปิดตัวเรียบร้อย | [`web-service-essentials`](../web-service-essentials/SKILL.md) | probe ในที่นี้ชี้ไปที่ endpoint เหล่านั้น |
| รันโค้ดทดลองใน container | [`docker-sandbox`](../docker-sandbox/SKILL.md) | ห้องทดลองไม่ใช่ image ที่ส่งขึ้น production |
| ตรวจ image และ manifest ก่อนส่ง | [`security-gate`](../security-gate/SKILL.md) | สแกน secret และช่องโหว่ใน image |
| metric · alert · แดชบอร์ด (Prometheus/Grafana) | [`observability-basics`](../observability-basics/SKILL.md) | ที่นี่แค่ให้ pod เปิด metric ได้ |
| Kafka เอง (topic · partition · consumer) | `kafka-streaming` ถ้ามี | ที่นี่มีแค่การขยาย consumer ตามคิว (ขั้น 3.7) |

## 1 · ค้นก่อนถาม แล้วถามรวมครั้งเดียว

ค้นใน repo และเครื่อง: Dockerfile · `deploy/` · `Chart.yaml` · `kubectl config current-context` (อ่านอย่างเดียว) · `helm version` · pipeline ที่มีอยู่ · ถามรวมครั้งเดียวเฉพาะที่หาเองไม่ได้:

| คำถาม | ทำไมต้องรู้ |
|---|---|
| cluster ของ cloud ไหน และ network plugin รองรับ NetworkPolicy ไหม | กำหนดวิธีทำ GPU และ NetworkPolicy ถ้า plugin ไม่บังคับใช้ policy จะไม่มีผล |
| ค่าลับเก็บที่ไหน (vault · secret manager ของ cloud · ไม่มี) | เลือก External Secrets Operator หรือ Sealed Secrets |
| registry ที่ใช้และใครเซ็นหรือสแกน image | ที่ push ที่ดึง และด่านสแกน |
| เพดานเงินของ GPU node pool ต่อเดือน | หัวข้อ "เงินและของนอกเครื่อง" |
| ใครอนุมัติการขึ้น production | ขั้น 8 หยุดรอคนนั้น |

ไม่ได้คำตอบ → ใช้ค่าแนะนำ (ค่าลับ: External Secrets ถ้ามี vault ไม่งั้น Sealed Secrets) แล้วจดใน `decision-log` หรือหัวข้อ "ตัดสินใจเอง" ท้ายรายงาน · ตัวเลขเพดานเงินไม่มีค่าแนะนำ ใส่ `(รอยืนยัน)` และห้ามเพิ่ม GPU เกินที่มีอยู่

## 2 · Dockerfile

แม่แบบเต็มและเหตุผลใน [`references/dockerfile.md`](references/dockerfile.md) · ข้อบังคับ:

1. multi-stage: stage สร้างแยกจาก stage รัน · image สุดท้ายไม่มี compiler หรือ build tool
2. base image ล็อกด้วย digest (`FROM name:tag@sha256:...`) และตั้งตัวอัปเดตตามรอบ (Dependabot ชนิด docker) เพราะการล็อกทำให้ไม่ได้ patch เอง
3. `USER` เป็น UID ตัวเลขที่ไม่ใช่ root ระบุเอง และตรงกับ `runAsUser` ใน manifest
4. มี `.dockerignore` ตัด `.git` `.env` กุญแจ และไฟล์ที่ไม่ใช้
5. ไม่ใช้ `ARG` หรือ `ENV` กับค่าลับ ตอน build ใช้ `RUN --mount=type=secret`
6. `CMD` แบบ exec เพื่อรับสัญญาณปิดตัว · ไม่ใช้ tag `latest`

## 3 · manifest

ชิ้นส่วนและ YAML อยู่ใน [`references/manifest-checklist.md`](references/manifest-checklist.md) · ทุก workload ต้องมี:

1. `resources.requests` ครบ และ memory limit · HPA ต้องมี CPU request
2. `startupProbe` `livenessProbe` `readinessProbe` · liveness ไม่เช็คฐานข้อมูลหรือบริการภายนอก
3. `securityContext`: `runAsNonRoot` · `allowPrivilegeEscalation: false` · drop `ALL` · `seccompProfile: RuntimeDefault` · `readOnlyRootFilesystem: true` พร้อม `emptyDir` ที่เขียนได้
4. `image` เป็น digest · ไม่ใช้ `latest`
5. `PodDisruptionBudget` (`maxUnavailable` ไม่ใช่ 0 เมื่อมีหลาย replica) · `HorizontalPodAutoscaler` หรือ KEDA (อย่างใดอย่างหนึ่งต่อ Deployment)
6. `NetworkPolicy` เริ่มจากปิดทางเข้าทั้งหมดแล้วเปิดเป็นรายเส้น
7. **ขยาย worker ตามงานค้างใน Kafka** ใช้ KEDA ดู consumer lag แทน HPA ที่ดู CPU · `maxReplicaCount` ไม่เกินจำนวน partition · ห้ามมี HPA อีกตัวบน Deployment เดียวกัน · รายละเอียดและตัวอย่าง Deep Research Agent ใน [`references/keda-queue-scaling.md`](references/keda-queue-scaling.md)
8. rollout แบบ RollingUpdate ตั้ง `maxUnavailable` และ `progressDeadlineSeconds` ให้ตั้งใจ ไม่ปล่อยค่าเริ่มต้นโดยไม่รู้

## 4 · Helm chart

รายละเอียด คำสั่ง และตารางค่าลับใน [`references/helm-chart.md`](references/helm-chart.md):

1. 1 chart ต่อระบบที่ปล่อยพร้อมกัน · `values.yaml` เป็นค่าเริ่มต้นปลอดภัย · `values-staging.yaml` กับ `values-production.yaml` ใส่เฉพาะที่ต่าง
2. digest ของ image ไม่มีค่าเริ่มต้น (บังคับด้วย `required`) · ต้องส่งเข้าตอน deploy
3. ค่าลับไม่เข้า `values*.yaml` `--set` หรือ git · chart สร้างแค่ `ExternalSecret` หรือ `SealedSecret` และ pod อ้างด้วย `secretKeyRef`
4. `values.schema.json` ให้ `helm lint` จับค่าผิดชนิด
5. chart ภายนอกล็อก `--version` · chart ของเราเพิ่มเลข `version` ทุกครั้งที่ template เปลี่ยน

## 5 · GPU node pool (STT/TTS)

รายละเอียดแยกตาม cloud ใน [`references/gpu-node-pool.md`](references/gpu-node-pool.md):

1. ต้องมี 4 ชั้นครบ: node ที่มี GPU และ driver → device plugin (NVIDIA device plugin หรือ GPU Operator) → taint และ label → pod ที่ขอ `nvidia.com/gpu` ใน `limits`
2. toleration ไม่พอ ต้องมี `nodeSelector` หรือ affinity ด้วย
3. web และ api ไม่ขอ GPU และไม่มี toleration · stt และ tts เป็น Deployment แยก
4. `startupProbe` ยาวพอให้โหลดโมเดล · image ใหญ่ทำให้ `helm --timeout` ต้องยาวกว่าค่าเริ่มต้น

## 6 · ตรวจก่อนแตะ cluster

รันทั้ง staging และ production values:

```bash
helm lint <chart> --strict -f <chart>/values-<env>.yaml
helm template <release> <chart> -f <chart>/values.yaml -f <chart>/values-<env>.yaml \
  | kubeconform -strict -summary -kubernetes-version <รุ่น-cluster> -schema-location default
```

- `-kubernetes-version` ต้องตรงกับ cluster (ค่าเริ่มต้นคือ `master`) · CRD ที่ไม่มี schema ให้ใส่ catalog หรือ `-ignore-missing-schemas` แล้วจดว่าข้ามอะไร
- ค้น output ของ `helm template` หา: `image:` ทุกตัวมี `@sha256:` · ไม่มี `latest` · ไม่มีค่าลับตัวจริง
- ผลของเครื่องมือที่รันไม่ได้ ระบุใน "ไม่ได้รัน" ไม่เขียนว่าผ่าน

## 7 · deploy staging

1. ยืนยัน context: `kubectl config current-context` ต้องเป็น cluster staging · ไม่ตรง → หยุด
2. `helm upgrade --install ... --atomic --timeout <ยาวพอ>` สำหรับ Helm 3 · Helm 4 ใช้ `--rollback-on-failure` (ธง `--atomic` ถูกระบุว่า deprecated) · ดู `helm version` ก่อนเลือก
3. `kubectl rollout status` ทุก Deployment · ตรวจ pod `Ready` จริง ไม่ใช่แค่ Running
4. ทดสอบตามแผนของทีม (smoke · end-to-end · เสียงจริงสำหรับ voice agent) · ผล + digest ที่ทดสอบบันทึกไว้
5. ซ้อม rollback บน staging 1 ครั้งก่อนปล่อยครั้งแรกของระบบนี้ (`helm rollback`)

## 8 · เลื่อนขึ้น production

ตรวจก่อนเลื่อน (ผ่านครบทุกข้อ ไม่งั้นหยุด):

| ตรวจ | วิธี |
|---|---|
| digest เดียวกับที่ทดสอบบน staging | เทียบ `@sha256:` ใน `helm get values` หรือ `kubectl get deploy -o jsonpath` ของ staging กับค่าใน `values-production.yaml` |
| ไม่ build ใหม่ | log pipeline ไม่มีขั้น build ในงานนี้ |
| chart รุ่นเดียวกัน | `--version` ตรงกับที่ staging |
| ขั้น 6 ผ่านกับ `values-production.yaml` | ผลคำสั่งรอบนี้ |
| คนที่ตกลงไว้ในขั้น 1 อนุมัติ | บันทึกชื่อและเวลา |

**agent ไม่รัน `helm upgrade` กับ production เอง** เว้นแต่ผู้ใช้สั่งในรอบนั้น · ส่งคำสั่งเต็มที่ตรวจแล้วให้คนอนุมัติรัน (หรือให้ขั้นอนุมัติใน pipeline รัน) · หลังปล่อย: `rollout status` → ดูแดชบอร์ดและ alert (`observability-basics`) ตามช่วงที่ตกลง → บันทึกรุ่นที่ใช้

## 9 · rollback

- release ของ Helm: `helm history` แล้ว `helm rollback <release> <revision> --wait` · ไม่ใช้ `kubectl rollout undo` กับของที่ Helm ติดตั้ง
- rollback ไม่ย้อน migration ฐานข้อมูลหรือข้อความที่เข้า Kafka แล้ว · ต้องมีแผนย้อนข้อมูลแยก (`cicd-and-release` หัวข้อ 7 และ 9)
- rollback ด้วยรุ่น (digest) ที่เคยผ่าน ไม่ rebuild เพื่อ "แก้เร็ว"

## เงินและของนอกเครื่อง

GPU node pool และ load balancer คิดเงิน · ทำตามนี้:

1. เพดานเงินมาจากผู้ใช้ skill นี้ขึ้นเพดานเองไม่ได้ ชนเพดาน → ถาม
2. ไม่ลบ namespace · PersistentVolumeClaim · node pool · release ที่ผู้ใช้สร้างเองโดยไม่ถาม
3. ลบแล้วตรวจซ้ำด้วยคำสั่งดูรายการ (`kubectl get`, `helm list`, คำสั่ง list node pool ของ cloud) แล้วสรุปค่าใช้จ่ายที่เกิดจริง
4. scale เหลือ 0 ไม่เท่าลบ: ของที่แค่หยุดอาจยังคิดค่าพื้นที่ (ดิสก์ · load balancer) `(ยังไม่ได้ตรวจ)` กับ cloud ที่ใช้

## ตัวอย่างจริง — voice agent คลินิกทันตกรรม

โจทย์: เว็บแอป (หน้าลูกค้า + หลังบ้าน) · หลาย service คุยกันผ่าน Kafka · STT/TTS บน GPU · Jenkins build → staging → production

| ชิ้น | ทำอย่างไร |
|---|---|
| image | `web` `api` `voice-gateway` `stt` `tts` ทุกตัว multi-stage · non-root · digest · Jenkins build ครั้งเดียวแล้วจด digest |
| chart | `clinic-voice` 1 chart · `services.web` `api` `voiceGateway` `stt` `tts` · values แยกสิ่งแวดล้อม · ค่าลับ (Kafka · ฐานข้อมูล · คีย์ STT/TTS) ผ่าน `ExternalSecret` |
| web · api · gateway | probe ชี้ `/health/live` `/health/ready` · PDB `maxUnavailable: 1` · HPA ที่ CPU 60% |
| stt · tts | `nodeSelector` + toleration + `limits.nvidia.com/gpu: 1` · namespace หรือ NetworkPolicy แยก · `startupProbe` ยาวสำหรับโหลดโมเดล |
| consumer ที่ประมวลผลหลังการโทร | KEDA ดู lag ของ topic · max ไม่เกินจำนวน partition |
| NetworkPolicy | เปิดแค่ ingress → web · web → api · gateway → stt/tts · api → Kafka |
| metric | pod เปิด `/metrics` ให้ Prometheus (ตามแบบของ `observability-basics`) |
| staging → production | ทดสอบ voice จริงบน staging · จด digest · อนุมัติ · `helm upgrade` production ด้วย digest นั้น · ไม่ build ใหม่ |

ผล: คำสั่ง `helm lint` `helm template | kubeconform` ผ่านทั้ง 2 environment · image ใน production `@sha256` ตรงกับ staging · ไม่มีค่าลับใน repo หรือ values

## ตรวจก่อนส่ง

1. Dockerfile: multi-stage · digest · non-root · มี `.dockerignore` · ไม่มีค่าลับใน layer (`docker history` ดู)
2. ทุก workload มี requests · 3 probe · securityContext ครบ · image เป็น digest
3. `helm lint --strict` และ `helm template | kubeconform` ผ่านด้วย values ของทั้ง staging และ production (รันรอบนี้จริง)
4. ค้น `values*.yaml` และ `helm template` ไม่พบรหัสผ่านหรือ token
5. production ใช้ digest เดียวกับ staging และมีบันทึกผู้อนุมัติ · ไม่มีการรัน production โดย agent เอง
6. GPU: ไม่มี pod ของ web บน GPU node · stt/tts ขึ้น GPU node จริง (`-o wide`)
7. ข้อที่ยังไม่ได้ตรวจหรือรันไม่ได้ ระบุไว้ในรายงาน

## ที่มา

ตรวจ 2026-10-27 (รายละเอียดต่อข้ออยู่ใน references):

- Docker — [Build best practices](https://docs.docker.com/build/building/best-practices/) · [Build secrets](https://docs.docker.com/build/building/secrets/)
- Kubernetes — [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) · [Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) · [Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) · [PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) · [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/) · [Images](https://kubernetes.io/docs/concepts/containers/images/) · [Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) · [Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)
- Helm — [upgrade](https://helm.sh/docs/helm/helm_upgrade/) · [lint](https://helm.sh/docs/helm/helm_lint/) · [values](https://helm.sh/docs/chart_best_practices/values/) · [registries](https://helm.sh/docs/topics/registries/) · [rollback](https://helm.sh/docs/helm/helm_rollback/)
- เครื่องมือ — [kubeconform](https://github.com/yannh/kubeconform) · [External Secrets](https://external-secrets.io/latest/introduction/overview/) · [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) · [KEDA](https://keda.sh/docs/latest/concepts/) · [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html)
- cloud GPU — [GKE](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/gpus) · [AKS](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu) · [EKS](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)


## reference: dockerfile.md

# Dockerfile สำหรับใช้งานจริง — แม่แบบและเหตุผล

ใช้กับขั้น 2 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 กับ [Docker build best practices](https://docs.docker.com/build/building/best-practices/) และ [Build secrets](https://docs.docker.com/build/building/secrets/)

## แม่แบบ web service (Node) แบบ multi-stage

```dockerfile
# syntax=docker/dockerfile:1
# ล็อกทั้ง tag และ digest · tag ไว้ให้คนอ่าน digest คือตัวที่ใช้จริง · เลข digest ด้านล่างเป็นตัวอย่าง ต้องแทนด้วยค่าจริงจาก registry
FROM node:22-slim@sha256:<digest-จริง> AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-slim@sha256:<digest-จริง> AS runtime
ENV NODE_ENV=production
WORKDIR /app
# UID/GID ระบุเอง ไม่ให้เปลี่ยนตามรอบ build · ต้องตรงกับ runAsUser ใน manifest
RUN groupadd --gid 10001 app && useradd --uid 10001 --gid 10001 --no-log-init --no-create-home app
COPY --from=build --chown=10001:10001 /app/dist ./dist
COPY --from=build --chown=10001:10001 /app/node_modules ./node_modules
USER 10001:10001
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

- ตัวอย่างข้างบนใช้ `node:22-slim` เป็นแค่ตัวอย่างรูปร่าง · รุ่นจริงของ base image ดูจาก registry วันที่ build แล้วลง digest (`(ยังไม่ได้ตรวจ)` ว่า 22 ยังเป็นรุ่นที่ใช้ได้ ณ วันที่ใช้ skill นี้)
- `CMD` ใช้รูปแบบ exec (`["node", ...]`) เพื่อให้ process ได้รับสัญญาณ SIGTERM ตรง ๆ และปิดตัวเรียบร้อยตาม `web-service-essentials` หัวข้อ 4

## ทำไมทำแบบนี้ (ตรวจ 2026-10-27)

| ข้อ | เหตุผลจากเอกสาร |
|---|---|
| multi-stage | แยก stage สร้างกับ stage รัน เพื่อลดขนาด image สุดท้าย ([best practices](https://docs.docker.com/build/building/best-practices/)) |
| ล็อก digest | "By pinning your images to a digest, you're guaranteed to always use the same image version" · ข้อแลก: ไม่ได้รับ patch ความปลอดภัยอัตโนมัติ เอกสารแนะนำให้ Dependabot (`package-ecosystem: "docker"`) ดันรุ่นตามรอบ |
| `USER` ไม่ใช่ root | "If a service can run without privileges, use `USER`" · ระบุ UID/GID เองเพื่อให้ซ้ำได้ |
| `.dockerignore` | ใช้รูปแบบเดียวกับ `.gitignore` ตัดไฟล์ออกจาก build context |
| ลดขนาด | ใช้ base เล็ก · ไม่ลง package เกินจำเป็น · `apt-get install --no-install-recommends` แล้ว `rm -rf /var/lib/apt/lists/*` ใน `RUN` เดียวกัน |

## `.dockerignore` ขั้นต่ำ

```
.git
.env
.env.*
*.pem
*.key
node_modules
dist
coverage
*.md
Dockerfile*
```

`.env` และกุญแจต้องอยู่ในรายการนี้ทุกโปรเจกต์ ไม่งั้น `COPY . .` พาค่าลับเข้า layer

## ค่าลับตอน build

- ห้าม `ARG` หรือ `ENV` สำหรับค่าลับ เพราะ "they persist in the final image" ([Build secrets](https://docs.docker.com/build/building/secrets/))
- ถ้า build ต้องใช้ token (เช่น private package) ใช้ secret mount ซึ่งมีอยู่เฉพาะ `RUN` นั้น:

```dockerfile
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN="$(cat /run/secrets/npm_token)" npm ci
```

```bash
docker build --secret id=npm_token,src=./npm_token.txt .
```

- unset ตัวแปรใน layer ถัดไปไม่ช่วย: ค่ายังอยู่ใน layer ที่ตั้งไว้ (Docker best practices)
- ค่าลับตอนรัน ไม่อยู่ใน image เลย → ส่งผ่าน Secret ของ Kubernetes ตาม [`helm-chart.md`](helm-chart.md)

## image ของ workload GPU (STT/TTS)

- ใช้ base ที่ผู้ทำ framework หรือ NVIDIA ให้มา (ชื่อ tag ต้องตรงกับ CUDA รุ่นที่ driver บน node รองรับ · ดู [`gpu-node-pool.md`](gpu-node-pool.md)) · ล็อก digest เหมือนกัน
- ไม่ฝังไฟล์โมเดลขนาดหลาย GB ใน layer ที่เปลี่ยนบ่อย: เก็บโมเดลไว้ที่ object storage หรือ volume แล้วโหลดตอนเริ่ม (มี `startupProbe` คุมเวลา) หรือแยก layer โมเดลไว้ล่างสุดให้ cache ได้ · เลือกแบบไหน `(ยังไม่ได้วัด)` ต้องวัดเวลา pull ของ cluster จริง
- ยังรัน non-root ได้ ตรวจว่า user มีสิทธิ์อ่านโฟลเดอร์โมเดลและ cache

## สแกนก่อนส่ง

`docker build` → สแกน image ด้วยเครื่องมือของทีม (เช่น Trivy ใน `security-gate`) → push → จด digest จากผล push (ไม่ใช่ tag) ลงผล build ให้ขั้น deploy ใช้ · ที่ pipeline ทำให้ดู [`cicd-and-release`](../../cicd-and-release/SKILL.md) หัวข้อ 2


## reference: gpu-node-pool.md

# GPU node pool สำหรับ STT/TTS — แยกจากเว็บ

ใช้กับขั้น 5 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · GPU = Graphics Processing Unit · STT = Speech-to-Text · TTS = Text-to-Speech · node pool สร้างโดยผู้ดู cluster หรือ `infra-as-code` ไม่ใช่ agent นี้เอง (ราคาสูง)

## ภาพรวม 4 ชั้น

| ชั้น | ใครให้ | หมายเหตุ |
|---|---|---|
| 1 node ที่มี GPU และ driver | node pool ของ cloud | EKS: AMI แบบ accelerated มี driver ให้ แต่**ไม่มี** NVIDIA device plugin ใน AL2023 ต้องลงเอง ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · GKE: ใส่ `--accelerator type=...,count=...,gpu-driver-version=default\|latest\|disabled` ([GKE GPUs](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/gpus)) · AKS: แนะนำ AKS-managed GPU node pool ที่ลง driver, device plugin และ DCGM exporter ให้ ([AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu)) |
| 2 device plugin | NVIDIA device plugin หรือ GPU Operator | ทำให้ cluster เห็น resource `nvidia.com/gpu` ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GPU Operator ติดตั้ง driver · container toolkit · device plugin · DCGM exporter · GPU Feature Discovery ([overview](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html)) |
| 3 taint และ label | node pool | กันงานอื่นขึ้น GPU node |
| 4 pod ที่ขอ GPU | chart ของเรา | `nvidia.com/gpu` ใน `limits` · toleration · nodeSelector |

ใช้ GPU Operator กับ EKS AMI แล้ว ต้องปิดไม่ให้ Operator ลง driver และ toolkit ซ้ำ (AL2023) ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · ทำตามคู่มือของ cloud ที่ใช้ ไม่ผสมวิธี

## ขอ GPU ใน pod

```yaml
resources:
  requests: { cpu: "2", memory: 8Gi }
  limits:
    memory: 8Gi
    nvidia.com/gpu: 1
nodeSelector:
  accelerator: nvidia-gpu            # label ที่ node pool ติด · ชื่อและค่าเป็นของโปรเจกต์
tolerations:
  - key: nvidia.com/gpu              # ต้องตรงกับ taint จริงของ node pool
    operator: Exists
    effect: NoSchedule
```

- ระบุ GPU ใน `limits` เท่านั้นก็ได้ (request ถูกตั้งเท่า limit ให้) · ถ้าระบุทั้งสอง ต้องเท่ากัน · ระบุ `requests` อย่างเดียวไม่ได้ ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/))
- toleration แค่อนุญาตให้ขึ้น node ที่ติด taint ไม่ได้บังคับให้ไปที่นั่น ([Taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)) จึงต้องมี `nodeSelector` หรือ affinity คู่กันเสมอ
- เลือกชนิด GPU ด้วย label ของ node (ติดเอง หรือใช้ Node Feature Discovery) ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GKE ติด selector `cloud.google.com/gke-accelerator` ให้เอง

## taint ของแต่ละ cloud

| cloud | taint ที่เอกสารระบุ |
|---|---|
| GKE | ติด `nvidia.com/gpu=present:NoSchedule` ให้เฉพาะเมื่อ cluster มี node pool ที่ไม่ใช่ GPU อย่างน้อย 1 ชุด · ใส่ toleration ให้ pod ที่ขอ GPU อัตโนมัติ (ExtendedResourceToleration) |
| AKS | ตัวอย่างในเอกสารใช้ `--node-taints sku=gpu:NoSchedule` ตอนสร้าง node pool · taint และขนาด VM แก้ภายหลังไม่ได้ · pod ต้องมี toleration ตรงกัน |
| EKS | เอกสารหน้า AMI ไม่ระบุ taint · ตั้งเองตอนสร้าง node group `(ยังไม่ได้ตรวจ)` หน้าอื่น |

เขียน toleration ใน chart ให้เป็นค่าใน values (`gpu.tolerations`) เพราะชื่อ taint ต่างกันตาม cloud

## แยกงาน GPU ออกจากเว็บ

- web และ api ไม่มี toleration ของ GPU และไม่ขอ `nvidia.com/gpu` → ไม่มีวันขึ้น GPU node ที่แพง
- stt และ tts เป็น Deployment แยก มี `nodeSelector` + toleration + `limits.nvidia.com/gpu` · ตั้ง `startupProbe` ยาวสำหรับโหลดโมเดล · readiness บอกว่าโมเดลพร้อมแล้วจริง
- แยก namespace หรืออย่างน้อยแยก NetworkPolicy: เฉพาะ voice gateway เรียก stt/tts ได้
- PDB ของ stt/tts ตามจำนวน GPU node ที่มี: ถ้ามี node เดียว `maxUnavailable: 1` จะทำให้ drain ผ่านแล้วบริการหยุด ต้องตกลงเวลาหยุดกับผู้ใช้
- scale ด้วย HPA/KEDA ได้ แต่เพดานต้องไม่เกินจำนวน GPU ที่ node pool ขยายได้ และผู้ใช้ตั้งเพดานเงินไว้ก่อน (SKILL.md หัวข้อ "เงินและของนอกเครื่อง")
- `nvidia.com/gpu` ไม่ overcommit: pod 1 ตัวถือ GPU 1 ตัวทั้งตัว (การแบ่ง GPU เช่น time-slicing หรือ MIG `(ยังไม่ได้ตรวจ)` ต้องเปิดที่ device plugin และอ่านคู่มือ NVIDIA ก่อน)

## ตรวจว่า GPU ใช้ได้จริง

```bash
kubectl describe node <ชื่อ-gpu-node> | grep -A2 -i "nvidia.com/gpu"   # Capacity และ Allocatable ต้องเห็นเลข
kubectl get pods -n <ns> -o wide                                         # stt/tts ต้องอยู่บน GPU node
kubectl exec -n <ns> deploy/stt -- nvidia-smi                            # ต้องมี nvidia-smi ใน image
```

ถ้า pod ค้าง `Pending` ดู `kubectl describe pod` ช่อง Events: มักเป็น taint ไม่ตรง · label ไม่ตรง · GPU ถูกถือครบแล้ว · เวอร์ชัน CUDA ใน image ไม่ตรงกับ driver บน node (ดูตารางความเข้ากันของ NVIDIA ที่ AKS อ้างไว้ใน [AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu))


## reference: helm-chart.md

# Helm chart — โครง values ต่อ environment ค่าลับ และคำสั่ง

ใช้กับขั้น 4 6 7 8 9 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · Helm 4 เป็นรุ่นที่หน้า [helm.sh/docs](https://helm.sh/docs/overview/) ระบุว่าใหม่สุด (4.3.1) · Helm 3 ยังมีเอกสาร (3.22.1)

สารบัญ: [โครง chart](#โครง-chart) · [values ต่อ environment](#values-ต่อ-environment) · [ค่าลับ](#ค่าลับไม่อยู่ใน-values) · [ตรวจ](#ตรวจแบบไม่แตะ-cluster) · [ล็อกรุ่น](#ล็อกรุ่น-chart) · [deploy](#deploy) · [rollback](#rollback)

## โครง chart

```
deploy/chart/clinic-voice/
├─ Chart.yaml            # version = รุ่นของ chart · appVersion = รุ่นของระบบ
├─ values.yaml           # ค่าเริ่มต้นที่ปลอดภัย ไม่มีค่าลับ ไม่มีรุ่น image จริง
├─ values.schema.json    # JSON Schema ให้ helm lint ตรวจชนิดของค่า
├─ values-staging.yaml   # เฉพาะที่ต่างจาก values.yaml
├─ values-production.yaml
└─ templates/            # deployment · service · pdb · hpa หรือ scaledobject · networkpolicy · externalsecret
```

- แยก 1 chart ต่อระบบที่ปล่อยพร้อมกัน แล้วใช้ค่า `services.<ชื่อ>` ต่อ service · หรือ 1 chart ต่อ service ถ้าปล่อยแยกรุ่น · เลือกอย่างเดียวทั้งโปรเจกต์
- เขียนค่าเป็น camelCase เริ่มด้วยตัวเล็ก · ใช้ map ตามชื่อแทน list (override ด้วย `--set` ได้) · ใส่คำอธิบายทุกค่า ([Values best practices](https://helm.sh/docs/chart_best_practices/values/))

## values ต่อ environment

```yaml
# values.yaml  (ค่าเริ่มต้น)
api:
  image: { repository: registry.example.com/clinic/api, digest: "" }   # ว่างไว้ ต้องใส่ตอน deploy
  replicas: 2
  resources:
    requests: { cpu: 250m, memory: 256Mi }
    limits: { memory: 512Mi }
```

```yaml
# values-production.yaml  (เฉพาะที่ต่าง)
api:
  image: { digest: "sha256:<digest-เดียวกับที่ผ่าน-staging>" }
  replicas: 3
```

template ประกอบ image แบบนี้ เพื่อบังคับว่ามี digest: `{{ .repository }}@{{ required "api.image.digest is required" .digest }}`

| environment | ต่างจากค่าเริ่มต้นเรื่อง | ห้ามต่าง |
|---|---|---|
| staging | replica น้อย · ทรัพยากรน้อย · โดเมนทดสอบ · GPU 1 ตัว | digest ของ image ต้องเป็นตัวที่จะขึ้น production |
| production | replica มาก · PDB เข้ม · HPA/KEDA เพดานสูงกว่า | โครง template · ชนิด probe · securityContext |

ลำดับ `-f` มีผล: ไฟล์ขวาสุดชนะ (`-f values.yaml -f values-production.yaml`) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))

## ค่าลับไม่อยู่ใน values

- ห้ามใส่รหัสผ่าน token key ใน `values*.yaml` `--set` หรือ `Chart.yaml` · Secret ของ Kubernetes แค่เข้ารหัส base64 ซึ่ง "provides no additional confidentiality" และเก็บใน etcd แบบไม่เข้ารหัสโดยปริยาย ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/))
- ทางเลือก (เลือกอย่างเดียวต่อโปรเจกต์ และดู [`config-and-secrets`](../../config-and-secrets/SKILL.md) หัวข้อ 6):

| ทาง | เหมาะเมื่อ | ข้อควรรู้ (ตรวจ 2026-10-27) |
|---|---|---|
| External Secrets Operator | มี vault หรือ secret manager ของ cloud อยู่แล้ว | `SecretStore` เก็บการเชื่อมต่อ · `ExternalSecret` บอกว่าดึงค่าไหน แล้วสร้าง Secret ให้และอัปเดตเมื่อต้นทางเปลี่ยน ([ESO](https://external-secrets.io/latest/introduction/overview/)) |
| Sealed Secrets | ไม่มี vault ทีมเล็ก อยากเก็บค่าที่เข้ารหัสใน git | `kubeseal` เข้ารหัส เฉพาะ controller ใน cluster นั้นถอดได้ · ต้องสำรอง key ของ controller ไม่งั้นกู้ไม่ได้ · key หมุนทุก 30 วันโดยปริยาย แต่ไม่แทนการเปลี่ยนรหัสจริง ([sealed-secrets](https://github.com/bitnami-labs/sealed-secrets)) |
| Secrets Store CSI Driver | ไม่อยากให้ค่าลับเป็น Secret ใน cluster | mount จาก store ภายนอกเป็น volume เฉพาะ pod ที่อนุญาต ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)) |

- chart ของเราสร้างแค่ `ExternalSecret` หรือ `SealedSecret` และให้ pod อ้างชื่อ Secret ผ่าน `secretKeyRef` · ค่าจริงไม่ผ่านมือ agent
- ให้ RBAC อ่าน Secret เฉพาะชื่อที่ต้องใช้ (`resourceNames`) · สิทธิ์ `list` Secret เท่ากับอ่านค่าได้ทั้งหมด

## ตรวจแบบไม่แตะ cluster

```bash
helm lint deploy/chart/clinic-voice --strict -f deploy/chart/clinic-voice/values-production.yaml
helm template clinic deploy/chart/clinic-voice \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-production.yaml \
  | kubeconform -strict -summary -kubernetes-version <รุ่น-k8s-ของ-cluster> \
      -schema-location default \
      -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
```

- `helm lint --strict` ทำให้ warning ล้มด้วย · ERROR คือ chart ติดตั้งไม่ได้ ([helm lint](https://helm.sh/docs/helm/helm_lint/))
- `kubeconform`: `-strict` ปฏิเสธ field ที่ไม่มีใน schema · `-kubernetes-version` ค่าเริ่มต้นคือ `master` จึงต้องระบุให้ตรง cluster · `-schema-location default` ต้องใส่คู่กับ catalog ของ CRD ไม่งั้นชนิดในตัวหาไม่เจอ · CRD ที่ไม่มีใน catalog (เช่น ScaledObject) ใช้ `-ignore-missing-schemas` แล้วจดไว้ ([kubeconform](https://github.com/yannh/kubeconform))
- รัน lint+template ทั้ง 2 ไฟล์ values (staging และ production) ไม่ใช่แค่ไฟล์เดียว
- ตรวจ policy เพิ่มด้วยเครื่องมือของทีมถ้ามี (ยังไม่ได้ตรวจ ว่าทีมเลือกตัวไหน)

## ล็อกรุ่น chart

- chart ที่ติดตั้งจาก registry ระบุ `--version` เสมอ (ถ้าไม่ระบุใช้รุ่นล่าสุด) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))
- chart แบบ OCI: `helm upgrade --install <release> oci://<registry>/<repo>/<chart> --version <x.y.z>` · ล็อกด้วย digest ได้โดยต่อ `@sha256:<digest>` ท้าย URL และเอกสารว่า "more secure than a tag because digests are immutable" ([Registries](https://helm.sh/docs/topics/registries/) · หน้านั้นบอกว่ายังไม่ปรับให้ตรง Helm 4)
- chart ภายนอก (ingress controller · KEDA · GPU Operator) ล็อก `--version` ใน pipeline และอัปเดตผ่าน PR
- ลงลายเซ็นได้ด้วย provenance: เทียบ chart กับไฟล์ provenance เพื่อยืนยันว่าไม่ถูกแก้และรู้ว่าใครเซ็น ([Provenance](https://helm.sh/docs/topics/provenance/)) · ใช้เมื่อ chart มาจากภายนอกทีม

## deploy

Helm 3 (`--atomic` = rollback เมื่อพลาด และเปิด `--wait` ให้เอง ([Helm 3 upgrade](https://helm.sh/docs/v3/helm/helm_upgrade/))):

```bash
helm upgrade --install clinic deploy/chart/clinic-voice \
  --namespace clinic-staging --create-namespace \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-staging.yaml \
  --atomic --timeout 10m
```

Helm 4: ใน source ของ `helm upgrade` ธง `--atomic` ถูกทำเครื่องหมาย deprecated ให้ใช้ `--rollback-on-failure` แทน และธงนี้ตั้ง `--wait` เป็นโหมด `watcher` ([upgrade.go](https://raw.githubusercontent.com/helm/helm/main/pkg/cmd/upgrade.go) · [Helm 4 upgrade](https://helm.sh/docs/helm/helm_upgrade/)) · ใช้ `helm version` ดูรุ่นของเครื่อง build แล้วเลือกธงให้ตรง

- `--timeout` ค่าเริ่มต้น 5 นาที ต่อ 1 การทำงาน (เช่น hook job) · workload GPU ที่ต้องดึง image ใหญ่และโหลดโมเดลต้องตั้งยาวกว่านั้น ค่าจริง `(ยังไม่ได้วัด)`
- `--cleanup-on-fail` ลบ resource ใหม่ที่เกิดจาก upgrade ที่ล้มเหลว
- `--install` สร้าง release ถ้ายังไม่มี มิฉะนั้น upgrade

## rollback

```bash
helm history clinic -n clinic-production
helm rollback clinic <revision> -n clinic-production --wait
```

ไม่ระบุ revision (หรือ 0) = กลับรุ่นก่อนหน้า · `--wait` รอจน resource พร้อม ([helm rollback](https://helm.sh/docs/helm/helm_rollback/)) · rollback ย้อนได้เฉพาะสิ่งที่ chart คุม: migration ฐานข้อมูลและข้อความที่เข้า Kafka แล้วไม่ย้อนตาม ดู [`cicd-and-release`](../../cicd-and-release/SKILL.md) หัวข้อ 7 และ 9


## reference: keda-queue-scaling.md

# ขยาย worker ตามงานค้างในคิวด้วย KEDA (Kafka consumer lag)

ใช้กับขั้น 3 ข้อย่อย "ขยายตามคิว" ของ [`SKILL.md`](../SKILL.md) · แหล่งทั้งหมดมาจาก keda.sh ตรวจ 2026-10-27 (KEDA 2.21 เป็นรุ่นล่าสุดที่หน้าเอกสารระบุ) · ฝั่ง Kafka เอง (partition · consumer group · commit offset) ดู `kafka-streaming` ถ้ามีใน plugin

## KEDA ต่างจาก HPA อย่างไร

| เรื่อง | HPA ธรรมดา (`manifest-checklist.md`) | KEDA |
|---|---|---|
| ดูอะไร | CPU หรือ memory ของ pod | งานค้างจากแหล่งข้างนอก เช่น consumer lag ของ Kafka |
| ลงมาเหลือ 0 pod | ไม่ได้ | ได้ เมื่อไม่ใช้ trigger แบบ CPU หรือ memory |
| ใครตัดสินจำนวน pod | HPA controller | KEDA สร้างและดูแล HPA ให้ · KEDA คุมช่วง 0↔1 ส่วน HPA คุมช่วง 1↔N |

เหตุผลที่ต้องใช้: worker ที่ประมวลผลงานค้างอาจ CPU ต่ำ แต่คิวยาวเป็นหมื่น HPA แบบ CPU จะไม่ขยาย ([Concepts](https://keda.sh/docs/latest/concepts/) · [Scaling Deployments](https://keda.sh/docs/latest/concepts/scaling-deployments/))

ติดตั้ง (ผู้ดู cluster เป็นคนทำ ไม่ใช่ agent เอง) ([Deploy](https://keda.sh/docs/latest/deploy/)):

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace   # ล็อก --version ตามขั้น 4
```

หน้าเอกสารบอกว่า KEDA 2.21 ทดสอบกับ Kubernetes 1.34–1.36 · เทียบกับรุ่น cluster ของโปรเจกต์ก่อนติดตั้ง

## ตัวอย่าง: worker ของ Deep Research Agent

โจทย์: งานค้นข้อมูลเข้า topic `research-jobs` (12 partition) · worker อ่านด้วย consumer group `research-workers` · ไม่มีงาน = ไม่ต้องมี worker

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: research-worker
spec:
  scaleTargetRef:
    name: research-worker          # Deployment ใน namespace เดียวกัน
  pollingInterval: 30
  cooldownPeriod: 300
  minReplicaCount: 0
  maxReplicaCount: 12              # ไม่เกินจำนวน partition ของ topic
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: kafka.kafka.svc:9092   # ตัวอย่าง ใช้ค่าจริงของโปรเจกต์
        consumerGroup: research-workers
        topic: research-jobs
        lagThreshold: "5"
        activationLagThreshold: "0"
        limitToPartitionsWithLag: "true"
```

| ช่อง | ความหมายและค่าเริ่มต้น ([Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/) · [ScaledObject spec](https://keda.sh/docs/latest/reference/scaledobject-spec/)) |
|---|---|
| `lagThreshold` | lag รวมทุก partition ที่ต่อ 1 replica · ค่าเริ่มต้น 10 · ตัวอย่างตั้ง 5 เพราะ 1 งานค้นหนักและนาน (ค่าจริงต้องวัด `(ยังไม่ได้วัด)`) |
| `activationLagThreshold` | lag ที่ปลุกจาก 0 · ค่าเริ่มต้น 0 |
| `limitToPartitionsWithLag` | replica ไม่เกินจำนวน partition ที่ยังมี lag · ต้องระบุ `topic` และใช้คู่กับ `allowIdleConsumers: true` ไม่ได้ · ค่าเริ่มต้น false |
| `allowIdleConsumers` | true = replica เกินจำนวน partition ได้ · ค่าเริ่มต้น false · **ห้ามเปิด** เพราะ consumer ส่วนเกินนั่งว่าง |
| `minReplicaCount` / `maxReplicaCount` | ค่าเริ่มต้น 0 / 100 · ตั้ง max ให้ไม่เกินจำนวน partition (โดยปริยาย KEDA ก็ไม่ขยายเกินจำนวน partition อยู่แล้ว) |
| `cooldownPeriod` | รอ 300 วินาทีหลัง trigger เงียบก่อนลงเหลือ 0 · ใช้กับช่วงลงเหลือ 0 เท่านั้น |
| `pollingInterval` | ตรวจ trigger ทุก 30 วินาที (ค่าเริ่มต้น) |
| `fallback` | จำนวน replica สำรองเมื่อ scaler อ่านค่าไม่ได้ (เช่น Kafka ล่ม) · ถ้าใส่ต้องมี `failureThreshold` และ `replicas` |

ถ้าต้องการให้มี worker อย่างน้อย 1 ตัวเสมอ (ไม่รับ cold start) ตั้ง `minReplicaCount: 1`

## ข้อควรระวัง

- **จำนวน partition คือเพดานจริง.** เพิ่ม partition ภายหลังทำให้ลำดับ key เปลี่ยนและ rebalance · ตัดสินใจจำนวน partition ตั้งแต่ออกแบบ topic (`kafka-streaming`) ก่อนตั้ง `maxReplicaCount`
- **ห้ามมี HPA ของเราเองคู่กับ ScaledObject บน Deployment เดียวกัน.** KEDA สร้าง HPA ให้แล้ว admission webhook ของ KEDA ตรวจกรณี ScaledObject 2 ตัวชี้ Deployment เดียวกัน ([Concepts](https://keda.sh/docs/latest/concepts/)) · จะย้าย HPA เดิมให้ KEDA ดู ให้ใช้ annotation `scaledobject.keda.sh/transfer-hpa-ownership: "true"` ตาม [Scaling Deployments](https://keda.sh/docs/latest/concepts/scaling-deployments/) · เอา `spec.replicas` ออกจาก Deployment เหมือนกรณี HPA
- **trigger CPU หรือ memory ลงเหลือ 0 ไม่ได้** · ใช้ Kafka trigger อย่างเดียวถ้าต้องการ scale-to-zero
- **worker ที่ทำงานนาน** ต้องตั้ง `terminationGracePeriodSeconds` ให้พอจบงานที่ถืออยู่ และ commit offset หลังทำเสร็จ ไม่ใช่ตอนรับ · ไม่งั้นตอนลดจำนวน pod งานหาย หรือถูกทำซ้ำ (ทำซ้ำได้ต้องออกแบบให้ idempotent ตาม `principle-safe-to-rerun`) · ลำดับที่ HPA เลือก pod ที่จะถอด `(ยังไม่ได้ตรวจ)`
- **Kafka มี SASL หรือ TLS** ต้องใส่ข้อมูลยืนยันตัวตนให้ scaler ผ่าน `TriggerAuthentication` ที่อ้าง Secret ของ cluster ไม่ใส่รหัสใน `metadata` · รูปแบบดูหัวข้อ SASL/TLS ในหน้า [Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/) (ยังไม่ได้ตรวจรายละเอียดช่องในหน้านั้น)
- **ใน Helm chart** เขียน ScaledObject เป็น template ที่เปิดด้วย `keda.enabled` และปิด HPA ตัวเดิมด้วยค่า `autoscaling.enabled` ตรงข้าม เพื่อไม่ให้ 2 ตัวชน · ตรวจด้วย `helm template` ว่าไม่มีทั้ง HPA และ ScaledObject ของ Deployment เดียวกัน
- **kubeconform** ไม่รู้จัก ScaledObject เพราะเป็น CRD · ใส่ `-schema-location` ของ catalog หรือ `-ignore-missing-schemas` แล้วจดไว้ว่าข้ามตัวไหน (ดู [`helm-chart.md`](helm-chart.md))


## reference: manifest-checklist.md

# Manifest Kubernetes — ชิ้นส่วนที่ workload ต้องมี

ใช้กับขั้น 3 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · ค่าตัวเลขในตัวอย่าง (CPU · memory · จำนวน replica) เป็นจุดเริ่ม ต้องปรับตามการวัดจริง

สารบัญ: [Deployment](#deployment-ของ-web-service-ย่อ) · [PDB](#poddisruptionbudget-pdb) · [HPA](#horizontalpodautoscaler-hpa) · [NetworkPolicy](#networkpolicy) · [rollout และ rollback](#rollout-และ-rollback)

## Deployment ของ web service (ย่อ)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  # ไม่ใส่ replicas ถ้ามี HPA (ดูด้านล่าง)
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 25%, maxUnavailable: 0 }
  selector:
    matchLabels: { app.kubernetes.io/name: api }
  template:
    metadata:
      labels: { app.kubernetes.io/name: api }
    spec:
      terminationGracePeriodSeconds: 30
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: api
          image: registry.example.com/clinic/api@sha256:<digest-จริง>
          ports: [{ name: http, containerPort: 8080 }]
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          startupProbe:
            httpGet: { path: /health/live, port: http }
            failureThreshold: 30
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /health/live, port: http }
            periodSeconds: 10
          readinessProbe:
            httpGet: { path: /health/ready, port: http }
            periodSeconds: 5
          volumeMounts:
            - { name: tmp, mountPath: /tmp }
      volumes:
        - { name: tmp, emptyDir: {} }
```

`maxUnavailable: 0` เป็นตัวเลือกของเรา ไม่ใช่ค่าเริ่มต้น (ค่าเริ่มต้นของทั้ง `maxSurge` และ `maxUnavailable` คือ 25% · [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) ตรวจ 2026-10-27) · ตั้ง 0 เพื่อให้ pod ใหม่พร้อมก่อนถอด pod เก่า ต้องมี capacity เผื่อ

## ทำไมแต่ละส่วนอยู่ตรงนั้น

| ส่วน | ข้อเท็จจริงจากเอกสาร (ตรวจ 2026-10-27) |
|---|---|
| requests/limits | request คือยอดที่รับประกัน scheduler ใช้เลือก node · limit คือเพดาน · CPU เกินเพดานถูก throttle ส่วน memory เกินแล้วอาจถูกฆ่า (OOM) ([Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)) · เราตั้ง memory limit แต่ไม่ตั้ง CPU limit เป็นแนวปฏิบัติของทีม ไม่ใช่ข้อบังคับของเอกสาร ถ้า cluster บังคับ CPU limit ให้ตั้งตามนั้น |
| `startupProbe` | ให้เวลาเริ่มระบบ = `failureThreshold × periodSeconds` (30 × 10 = 300 วินาที) แล้ว liveness ค่อยทำงาน · ถ้า startup ไม่ผ่านจน หมดเวลา container ถูกฆ่า ([Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)) |
| `readinessProbe` | pod ที่ยังไม่ ready จะไม่ได้รับ traffic จาก Service และทำงานตลอดอายุ container (Probes) |
| liveness กับ readiness คนละ path | ห้ามให้ liveness เช็คฐานข้อมูลหรือบริการภายนอก ดู [`web-service-essentials`](../../web-service-essentials/SKILL.md) หัวข้อ 1 |
| securityContext | Pod Security Standards ระดับ Restricted ต้องการ: `runAsNonRoot: true` · `allowPrivilegeEscalation: false` · drop capability `ALL` (เติมได้เฉพาะ `NET_BIND_SERVICE`) · `seccompProfile` เป็น `RuntimeDefault` หรือ `Localhost` ([Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)) · `readOnlyRootFilesystem` เราเติมเอง `(ยังไม่ได้ตรวจในหน้า)` ว่ามาตรฐานไม่บังคับ · แอปที่เขียนไฟล์ต้องมี `emptyDir` (เช่น `/tmp`) |
| `terminationGracePeriodSeconds` | ค่าเริ่มต้น 30 วินาที `(ยังไม่ได้ตรวจในหน้า)` · ตั้งให้มากกว่าเวลาที่แอปใช้ปิดตัว |

บังคับทั้ง namespace: `kubectl label namespace <ns> pod-security.kubernetes.io/enforce=restricted` · workload GPU ที่ติดข้อจำกัดของ Restricted ให้แยก namespace และอธิบายข้อยกเว้น ไม่ลดทั้งระบบ

## PodDisruptionBudget (PDB)

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
spec:
  maxUnavailable: 1
  selector:
    matchLabels: { app.kubernetes.io/name: api }
```

- PDB กันได้เฉพาะการถอดแบบสมัครใจ เช่น `kubectl drain` ไม่กัน node พังกะทันหัน ([PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/))
- เอกสารแนะนำ `maxUnavailable` เพราะปรับตามจำนวน replica เอง · ตั้งเป็น 0 หรือ `minAvailable` เท่าจำนวน replica แล้ว drain จะไม่จบ
- ห้ามให้ 2 PDB ครอบ pod เดียวกัน (eviction ถูกปฏิเสธ)
- service ที่รัน replica เดียวไม่ต้องมี PDB หลอก ๆ: เอกสารบอกให้ไม่มี PDB หรือใช้ `maxUnavailable: 0` พร้อมประสานเวลาหยุดนอก Kubernetes

## HorizontalPodAutoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 60 }
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
```

- ต้องมี CPU request ในทุก container ไม่งั้น HPA ไม่ทำอะไรกับ metric นั้น ([HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/))
- เมื่อใช้ HPA ให้เอา `spec.replicas` ออกจาก Deployment ไม่งั้น `kubectl apply` ทุกครั้งตั้งจำนวนกลับ (เอกสารมีขั้นตอนย้ายแบบไม่ให้ pod หายชั่วคราว)
- 300 วินาทีคือค่าเริ่มต้นของ scale down อยู่แล้ว เขียนไว้ให้คนเห็น
- workload ที่ scale ตามความลึกคิว (Kafka consumer) ใช้ metric อื่น เช่น KEDA `(ยังไม่ได้ตรวจ)` · ดู `kafka-streaming` ถ้ามีใน plugin

## NetworkPolicy

เริ่มจากปิดทุกทางเข้าใน namespace แล้วเปิดทีละเส้นที่ต้องใช้:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes: [Ingress]
```

- policy ไม่มีผลเลยถ้า cluster ไม่มี network plugin (CNI) ที่บังคับใช้ ([Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)) · ตรวจกับผู้ดู cluster ก่อน อย่าเขียนแล้วเชื่อว่ากันได้
- ถ้าปิดขาออกด้วย ต้องเปิด DNS (พอร์ต 53) อย่างชัดเจน `(ยังไม่ได้ตรวจในหน้า)` · และเปิดขาออกไป Kafka · ฐานข้อมูล · บริการ STT/TTS เป็นรายเส้น
- ตัวอย่างเส้นที่เปิด: ingress controller → web · web → api · api → Kafka · api → stt/tts

## rollout และ rollback

```bash
kubectl rollout status deployment/api --timeout=300s
kubectl rollout history deployment/api
kubectl rollout undo deployment/api                    # กลับรุ่นก่อนหน้า
kubectl rollout undo deployment/api --to-revision=3    # กลับรุ่นที่ระบุ
```

- `undo` ไม่ระบุ revision = กลับรุ่นล่าสุดก่อนหน้า ([kubectl rollout undo](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/))
- Deployment เก็บ ReplicaSet เก่าตาม `revisionHistoryLimit` (ค่าเริ่มต้น 10) · rollout ที่ไม่คืบหน้าเกิน `progressDeadlineSeconds` (ค่าเริ่มต้น 600) ถูกมองว่าล้มเหลว ([Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
- release ที่ติดตั้งด้วย Helm ให้ rollback ด้วย `helm rollback` ไม่ใช่ `kubectl rollout undo` เพราะ Helm จะไม่รู้ว่า state เปลี่ยน


---

# skill: kafka-streaming

Use when services pass events via Kafka (topic, producer, consumer, DLQ, ส่ง event ระหว่าง service) or events get lost or doubled.

# kafka-streaming — ออกแบบ topic · producer · consumer ของ Apache Kafka ไม่ให้ event หายหรือซ้ำแบบเงียบ ๆ

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้และเอกสารที่ได้จากมัน เขียนตาม `human-writing` · ค่าตั้งและรุ่นทุกตัวมีลิงก์กับวันที่ตรวจ 2026-10-27 ในหัวข้อ "ที่มา" และ [`config-table`](references/config-table.md)

> **กฎข้อเดียว:** Kafka ส่งให้ "อย่างน้อยหนึ่งครั้ง" ไม่ใช่ "ครั้งเดียว" · ฝั่งส่งต้องไม่ทิ้ง event (ส่งยืนยันครบ + outbox) ฝั่งรับต้องทำซ้ำได้ (เช็ก `event_id`) และ commit offset หลังทำเสร็จเท่านั้น · ขาดข้อใดข้อหนึ่ง event จะหายหรือซ้ำโดยไม่มีใครเห็น

## ใช้เมื่อ

- service 2 ตัวขึ้นไปต้องรับ event เดียวกัน และต้องย้อนอ่านซ้ำได้ (เช่น สรุปสายโทรลง CRM กับแจ้งเตือน LINE จาก event ชุดเดียว)
- ต้องรักษาลำดับ event ต่อสายหรือต่อนัด (เริ่มสาย → จบสาย → สรุป · จอง → เลื่อน → ยกเลิก)
- ผู้ใช้พูดว่า Kafka · topic · consumer group · offset · partition · DLQ · "event หาย" · "event ซ้ำ" · "ส่ง event ระหว่าง service"
- consumer lag โตหรือ consumer ถูก rebalance ไม่หยุด

ไม่ใช้เมื่อ: งานเบื้องหลังของ service เดียว (ส่งเมล ทำรายงาน ตั้งเวลา) มีผู้รับเดียว ไม่ต้องย้อนอ่าน → [`background-jobs`](../background-jobs/SKILL.md) พอ · เลือกสถาปัตยกรรมทั้งระบบ → [`architecture-patterns`](../architecture-patterns/SKILL.md) ก่อน · ข้อมูลที่ส่งเป็นของอุปกรณ์ IoT → `iot-systems`

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| คิวงานธรรมดา มีผู้รับเดียว | [`background-jobs`](../background-jobs/SKILL.md) | หัวข้อ 1 ตัดสินว่าต้องใช้ Kafka จริงไหม |
| งานที่อาจรันซ้ำหรือหยุดกลางทาง | [`principle-safe-to-rerun`](../principle-safe-to-rerun/SKILL.md) | consumer ทุกตัวต้องผ่านหลักนี้ (หัวข้อ 4) |
| ปลายทางเป็นอีเมล LINE push SMS | [`notifications`](../notifications/SKILL.md) | consumer แจ้งเตือนใช้กฎช่องทางและโควตาของ skill นั้น |
| เลือก event-driven เทียบแบบอื่น | [`architecture-patterns`](../architecture-patterns/SKILL.md) | Kafka เป็นเครื่องมือ ไม่ใช่ตัวเลือกสถาปัตยกรรม |
| event มีเบอร์โทร ชื่อ เสียง | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | หัวข้อ 6 ย่อ ส่วนสิทธิ์ของเจ้าของข้อมูลอยู่ที่นั่น |
| ตั้งเฝ้า lag และ alert | [`observability-basics`](../observability-basics/SKILL.md) | หัวข้อ 7 บอกว่าเฝ้าอะไร |
| ออกแบบ pipeline ข้อมูลทั้งสาย | agent `data-engineer` | skill นี้ให้กฎของ Kafka ที่เขาต้องใช้ |

## 1 · ควรใช้ Kafka เมื่อไหร่

| ถามก่อน | ตอบแบบนี้ → Kafka | ตอบแบบนี้ → ไม่ต้อง |
|---|---|---|
| ผู้รับกี่ราย | 2 รายขึ้นไป อ่านชุดเดียวกันคนละจังหวะ | รายเดียว |
| ต้องย้อนอ่าน event เก่าไหม (เติม CRM ใหม่ แก้บั๊กแล้วเล่นซ้ำ) | ต้อง | ทำแล้วทิ้ง |
| ลำดับสำคัญไหม | สำคัญต่อ key (สาย นัด) | ไม่สำคัญ |
| มีคนดูแล cluster ไหม | มี หรือใช้บริการที่มีคนดูแล | ไม่มี และปริมาณเป็นหลักร้อยต่อชั่วโมง |

ปริมาณคลินิกเดียวมักน้อยจน Kafka เกินจำเป็น · ถ้าตอบ "รายเดียว ไม่ย้อนอ่าน" ใช้ `background-jobs` แล้วบอกผู้ใช้ตรง ๆ · ตัดสินแล้วจดเหตุผลลง ADR (`adr-writer`) · ต้นทุน cluster และบริการจัดการต่อเดือน `(ยังไม่ได้ตรวจ)`

## 2 · topic

| เรื่อง | ทำ | เหตุผล |
|---|---|---|
| ชื่อ | `<โดเมน>.<เรื่อง>.events.v<เลข>` เช่น `clinic.call.events.v1` · 1 topic ต่อ 1 เรื่องที่ลำดับต้องรักษา | ชื่อบอกเจ้าของ · เวอร์ชันไว้ย้ายเมื่อ schema หักแบบเข้ากันไม่ได้ |
| key | id ของสิ่งที่ลำดับสำคัญ (`call_id` · `appointment_id`) · ห้ามปล่อย key ว่าง | key เดียวกันลง partition เดียว อ่านตามลำดับที่เขียน · ข้าม partition ไม่รับประกันลำดับ |
| จำนวน partition | วัดจากปริมาณจริง ให้ไม่น้อยกว่า max(เป้า÷ความเร็วเขียนต่อ partition, เป้า÷ความเร็วอ่านต่อ partition) แล้วเผื่อเล็กน้อย · เริ่ม 3–6 สำหรับคลินิกเล็ก `(ประมาณ ยังไม่ได้วัด)` | เพิ่มได้ ลดไม่ได้ · เพิ่มแล้ว key เดิมอาจย้าย partition ลำดับของ key เก่าเพี้ยน |
| replication factor (RF) | 3 บน cluster จริง · 1 ได้แค่เครื่อง dev | RF 3 คือค่าที่ใช้กันทั่วไปใน production |
| `min.insync.replicas` | 2 คู่กับ RF 3 และ `acks=all` | เขียนสำเร็จเมื่อมีสำเนาที่ทันอย่างน้อย 2 ตัว · ล่มได้ 1 เครื่องโดยไม่หายและไม่หยุดเขียน · ค่าเริ่มต้นคือ 1 |
| retention | `retention.ms` ค่าเริ่มต้น 7 วัน · ตั้งให้ยาวกว่าเวลาที่ consumer ดับนานสุดที่ยอมรับ · event ที่มีข้อมูลส่วนบุคคลให้สั้นสุดเท่าที่ใช้ (หัวข้อ 6) | consumer ที่ดับนานกว่า retention จะอ่าน event ที่ถูกลบไปแล้วไม่ได้ |
| compaction | ใช้กับ topic "สถานะล่าสุดต่อ key" เท่านั้น (`cleanup.policy=compact`) · topic event ที่ต้องเก็บประวัติ ใช้ `delete` | compaction เก็บค่าล่าสุดของแต่ละ key ประวัติ จอง→เลื่อน→ยกเลิก จะหาย |
| สร้าง topic | สร้างด้วยโค้ดหรือสคริปต์ที่รีวิวได้ · ปิด `auto.create.topics.enable` | ค่าเริ่มต้นเปิด และ `default.replication.factor` เริ่มที่ 1 พิมพ์ชื่อ topic ผิดอาจได้ topic ใหม่ที่ไม่มีสำเนา (ข้อสรุปจากค่าเริ่มต้นสองตัว ยังไม่ได้ทดลอง) |

## 3 · producer

1. ตั้ง `acks=all` และ `enable.idempotence=true` ชัด ๆ แม้รุ่นใหม่เป็นค่าเริ่มต้นแล้ว · ไฟล์ตั้งค่าไม่ควรขึ้นกับรุ่นของ client ที่เครื่องไหนติดตั้ง
2. เปิด idempotent producer = broker ตัดสำเนาที่เกิดจาก retry ของ producer ตัวเดียวกันให้ · **ไม่กัน** สำเนาที่เกิดจากแอปส่งซ้ำเองหลัง restart
3. รอผลส่งทุกครั้ง (callback หรือ future) · ส่งแล้วไม่ดูผล = ทิ้ง event เงียบ ๆ · ผลส่งล้ม ให้ธุรกรรมของแอปรู้
4. เขียน DB กับส่ง event ในธุรกรรมเดียวไม่ได้ (ส่งก่อน commit แล้ว DB ล้ม · commit แล้วแอปตายก่อนส่ง) → **outbox**: เขียนแถวลงตาราง `outbox` ในธุรกรรมเดียวกับข้อมูลธุรกิจ แล้วมีตัวส่ง (relay) อ่านแถวที่ยังไม่ส่งไปลง Kafka แล้วทำเครื่องหมาย · relay ตายหลังส่งก่อนทำเครื่องหมาย = ส่งซ้ำ จึงต้องมี `event_id` ใน event ทุกตัว
5. Kafka transaction ครอบ Kafka → Kafka เท่านั้น · เขียนลง CRM หรือ LINE ไม่นับ → ใช้ at-least-once + consumer ทำซ้ำได้ ไม่ต้องไล่ exactly-once
6. event 1 ก้อนมี `event_id` · `type` · `occurred_at` · `schema_version` · id ของเรื่อง · ข้อมูลเท่าที่ผู้รับต้องใช้ (โครงเต็มใน [`clinic-example`](references/clinic-example.md))

## 4 · consumer

1. `enable.auto.commit=false` แล้ว commit offset **หลัง** งานเสร็จและเขียนผลลง DB แล้ว · commit ก่อนทำ = ตายกลางทางแล้ว event หาย · auto commit ที่เปิดอยู่เป็นค่าเริ่มต้น commit ตามเวลา ไม่ตามงาน
2. ทำซ้ำได้: ตาราง `processed_events(event_id primary key)` เขียนในธุรกรรมเดียวกับผลงาน · เจอ `event_id` เดิม ข้ามแล้ว commit · ขั้นตอนคิดตาม `principle-safe-to-rerun`
3. ตรวจลำดับด้วยข้อมูลใน event ไม่ใช่เวลารับ: ถ้า event "เลื่อนนัด" มาก่อน "จองนัด" ให้รอหรือส่งเข้าลองใหม่ ไม่ใช่เขียนทับ
4. ล้มชั่วคราว (CRM ช้า LINE ตอบ 5xx) → ลองใหม่ในโปรเซสด้วยหน่วงเวลาเพิ่มขึ้น จำนวนครั้งจำกัด · ล้มถาวร (ข้อมูลผิดรูป schema ไม่ตรง) หรือหมดรอบลอง → ส่งเข้า **DLQ** (dead letter queue คือ topic เก็บ event ที่ประมวลผลไม่ได้) `<topic>.dlq` พร้อม header บอก topic · partition · offset เดิมและชนิด error แล้ว commit ต่อ · ไม่ลองใหม่ไม่รู้จบ เพราะ partition นั้นติดทั้งแถว
5. DLQ ไม่ว่าง = มีงานของคน · ตั้ง alert (หัวข้อ 7) และมีคนรับผิดชอบเล่นซ้ำหลังแก้
6. `auto.offset.reset` ค่าเริ่มต้น `latest` · consumer group ใหม่หรือ offset หมดอายุจะข้าม event เก่าเงียบ ๆ → service ที่ต้องเริ่มจากต้น ตั้ง `earliest` (หรือ `by_duration`)
7. rebalance: ถ้างานต่อ record ช้า (เรียก LINE) ลด `max.poll.records` (ค่าเริ่มต้น 500) หรือเพิ่ม `max.poll.interval.ms` (ค่าเริ่มต้น 5 นาที) ให้รอบหนึ่งจบทัน · เกินแล้วกลุ่มคิดว่า consumer ตาย แล้ว rebalance ทำให้ event ถูกทำซ้ำ · deploy บน container ที่รีสตาร์ทบ่อย พิจารณา `group.instance.id` (static membership) · `group.protocol=consumer` (โปรโตคอลใหม่) เป็นทางเลือก `(ยังไม่ได้ตรวจความพร้อมของ client ที่ใช้)` ใช้ค่าเริ่มต้น `classic` ไปก่อน
8. จำนวน consumer ที่ทำงานได้สูงสุดในกลุ่มเท่ากับจำนวน partition · ตัวที่เกินจะว่าง

## 5 · schema

1. กำหนด schema ให้ทุก event · ใช้ Schema Registry กับ Avro หรือ JSON Schema ถ้ามี cluster รองรับ · ไม่มี registry ให้ใส่ `schema_version` ใน event และให้ผู้รับอ่านแบบยอมรับฟิลด์ที่ไม่รู้จัก
2. ตั้งโหมด `BACKWARD` (ค่าเริ่มต้นของ Confluent Schema Registry) หรือ `BACKWARD_TRANSITIVE` ถ้ามีหลายรุ่นค้างใน topic นาน
3. เปลี่ยนแบบที่ผ่าน: เพิ่มฟิลด์ที่มีค่าปริยาย · ลบฟิลด์ที่เดิมมีค่าปริยาย · **ห้าม** เปลี่ยนชื่อ เปลี่ยนชนิด ลบฟิลด์บังคับ · ต้องหักจริง ให้สร้าง topic `v2` แล้วย้าย
4. ลำดับขึ้น: BACKWARD ต้องอัปเกรด **consumer ก่อน** แล้วค่อยให้ producer ส่งรูปใหม่
5. กฎเต็มของ JSON Schema (open หรือ closed content model) ซับซ้อนกว่า Avro อ่านหน้าทางการก่อนเลือก `(ยังไม่ได้ตรวจรายละเอียด)`

## 6 · event ที่มีข้อมูลส่วนบุคคล (PDPA)

PDPA คือพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล · log ของ Kafka เป็นแบบเพิ่มท้าย ลบรายการเดียวตามคำขอเจ้าของข้อมูลไม่สะดวก (ข้อสรุปจากโครงสร้าง log ยังไม่ได้ทดลอง) จึงออกแบบให้ไม่ต้องลบ

- ใส่เฉพาะ id (`call_id` · `appointment_id` · `patient_id`) ไม่ใส่เบอร์โทร ชื่อ เนื้อเสียง ข้อความถอดเสียง หรืออาการ · ผู้รับที่มีสิทธิ์ไปดึงจากระบบต้นทางด้วย id เอง
- เสียงและถอดเสียงอยู่ที่เก็บของมันเอง event มีแค่ id ของไฟล์
- `retention.ms` ของ topic ที่มี id คนไข้ ตั้งสั้นสุดที่ consumer ฟื้นตัวทัน · DLQ ก็เป็นข้อมูลเช่นกัน ตั้ง retention เท่ากัน
- ผู้ใช้ขอให้ลบข้อมูล → ลบที่ระบบต้นทาง · event ที่เหลือมีแต่ id ที่ชี้ไปหาใครไม่ได้อีก · นโยบายเก็บข้อมูลและสิทธิ์เจ้าของข้อมูลตาม `pdpa-compliance` · ข้อมูลสุขภาพเป็นข้อมูลอ่อนไหว ถามฝ่ายกฎหมายก่อนส่งข้าม service `(รอยืนยัน)`
- เปิดการเข้ารหัสระหว่างทางและสิทธิ์อ่านต่อ topic (ACL) · ค่าลับของ cluster ไม่เข้า git (`config-and-secrets`)

## 7 · ทดสอบและเฝ้าดู

| ทดสอบ | วิธี |
|---|---|
| ใช้ Kafka จริงในเทสต์ | Testcontainers โมดูล Kafka (Java ใช้ `KafkaContainer` กับอิมเมจ `apache/kafka`) หรือ Kafka ในเครื่องผ่าน docker compose · ไม่ mock client เพราะ mock ไม่เห็นปัญหา offset และ rebalance |
| 4 เคสที่ต้องมี | event เดิมเข้า 2 ครั้ง ผลเขียนครั้งเดียว · ตายก่อน commit แล้วเริ่มใหม่ ไม่มี event หาย · event เสียเข้า DLQ แล้ว partition ไม่ติด · event key เดียวกัน 3 ตัวมาตามลำดับ |

เฝ้าดูตามหลัก `observability-basics`: **consumer lag** ต่อกลุ่มและ partition (`kafka-consumer-groups.sh --describe --group <กลุ่ม>` ให้ค่า LAG) · จำนวน event ใน DLQ · อายุของแถว `outbox` ที่เก่าสุดที่ยังไม่ส่ง · จำนวนครั้ง rebalance · ค่าเกณฑ์ alert ตั้งจากปริมาณจริงของระบบ `(รอยืนยัน)`

## ตัวอย่างจริง 1 ชุด

ป้าย `ตัวอย่าง` — ออกแบบบนกระดาษ ยังไม่ได้รันกับ Kafka จริง

**โจทย์:** voice agent คลินิกทันตกรรมส่ง event สายโทร (เริ่ม · จบ · สรุป) และนัดหมาย (จอง · เลื่อน · ยกเลิก) ไปให้ service สรุปลง CRM (Customer Relationship Management คือระบบข้อมูลลูกค้า) กับ service แจ้งเตือนทาง LINE

| เรื่อง | ที่เลือก | เหตุผล |
|---|---|---|
| ต้องใช้ Kafka ไหม | ใช้ · ผู้รับ 2 ราย ต้องเล่นซ้ำเติม CRM ได้ ลำดับสำคัญ | ตรงตามตารางหัวข้อ 1 · ถ้าเหลือผู้รับรายเดียวให้กลับไป `background-jobs` |
| topic | `clinic.call.events.v1` key `call_id` · `clinic.appointment.events.v1` key `appointment_id` | ลำดับต่อสายและต่อนัด |
| ค่า topic | RF 3 · `min.insync.replicas=2` · retention 7 วัน · partition 3 | หัวข้อ 2 |
| ส่ง | voice agent เขียนสรุปสายกับแถว outbox ใน DB ธุรกรรมเดียว · relay ส่งด้วย `acks=all` | หัวข้อ 3 |
| รับ | CRM กับ LINE คนละ consumer group · `processed_events` · commit หลังเขียน · DLQ ต่อ topic | หัวข้อ 4 |
| ข้อมูลใน event | `call_id` · `patient_id` · ชนิด · เวลา · ไม่มีเบอร์โทร ชื่อ เสียง | ผู้รับดึงรายละเอียดเองจากระบบต้นทางตามสิทธิ์ |

โครง event · SQL outbox · โค้ด consumer แบบย่อ · ค่า properties ครบอยู่ใน [`clinic-example`](references/clinic-example.md)

## ตรวจก่อนส่ง

1. มีคำตอบเรื่อง "ต้องใช้ Kafka จริงไหม" พร้อมเหตุผล ไม่ได้ใช้เพราะตามกระแส
2. topic ทุกตัวมี key ที่ตรงกับสิ่งที่ลำดับสำคัญ · RF · `min.insync.replicas` · retention ระบุชัด · ปิดสร้าง topic อัตโนมัติ
3. producer `acks=all` + idempotent · รอผลส่ง · ทางเขียน DB แล้วส่ง event ใช้ outbox
4. consumer ปิด auto commit · commit หลังเสร็จ · มี `event_id` กันซ้ำในธุรกรรมเดียวกับผล · มี DLQ และคนดู
5. `auto.offset.reset` ตั้งตามที่ service ต้องการ ไม่ปล่อยค่าเริ่มต้นโดยไม่คิด
6. schema มีโหมดเข้ากันได้และลำดับอัปเกรด · event ไม่มีเบอร์โทร ชื่อ เสียง
7. เทสต์ 4 เคสผ่านบน Kafka จริง · มี alert consumer lag กับ DLQ
8. ทุกค่าที่อ้างมีลิงก์หรือป้าย `(ยังไม่ได้ตรวจ)` · ไม่เขียนว่า exactly-once ข้ามระบบภายนอก

## ที่มา

ตรวจ 2026-10-27 (เปิดอ่านผ่านเครื่องมือดึงหน้าเว็บ ค่าตัวเลขคัดจากหน้าที่ดึงมา)

- Apache Kafka 4.4 · ค่าตั้ง producer https://kafka.apache.org/44/configuration/producer-configs/ · consumer https://kafka.apache.org/44/configuration/consumer-configs/ · topic https://kafka.apache.org/44/configuration/topic-configs/ · broker https://kafka.apache.org/44/configuration/broker-configs/
- การรับประกันส่ง ลำดับ idempotent producer transaction offset https://kafka.apache.org/44/design/design/ · key กับ partition https://kafka.apache.org/44/getting-started/introduction/ · เพิ่ม partition และดู lag https://kafka.apache.org/44/operations/basic-kafka-operations/
- Confluent Schema Registry https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html · ความหมายการส่ง https://docs.confluent.io/kafka/design/delivery-semantics.html · การรวมกลุ่ม consumer https://docs.confluent.io/kafka/design/consumer-design.html · DLQ (ของ Kafka Connect ใช้เป็นแนวคิดอ้างอิง ไม่ใช่ของ consumer ทั่วไป) https://docs.confluent.io/platform/current/connect/index.html#dead-letter-queue
- เลือกจำนวน partition (บทความปี 2015 ตรวจรุ่นใหม่ก่อนใช้ตัวเลข) https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- Transactional outbox https://microservices.io/patterns/data/transactional-outbox.html
- Testcontainers Kafka https://java.testcontainers.org/modules/kafka/


## reference: clinic-example.md

# ตัวอย่างเต็ม — event สายโทรและนัดหมายของคลินิกทันตกรรม

ป้าย `ตัวอย่าง` — เขียนจากกฎใน [`SKILL.md`](../SKILL.md) ยังไม่ได้รันกับ Kafka จริง ชื่อฟังก์ชันของ client เป็นโค้ดสมมติ ตรวจกับไลบรารีที่ใช้จริงก่อน

## สารบัญ

1. [topic](#1--topic)
2. [โครง event](#2--โครง-event)
3. [outbox ฝั่ง voice agent](#3--outbox-ฝั่ง-voice-agent)
4. [consumer ที่ทำซ้ำได้](#4--consumer-ที่ทำซ้ำได้)
5. [ค่า properties](#5--ค่า-properties)

## 1 · topic

| topic | key | event ชนิด | consumer group |
|---|---|---|---|
| `clinic.call.events.v1` | `call_id` | `call.started` · `call.ended` · `call.summarised` | `crm-summary` |
| `clinic.appointment.events.v1` | `appointment_id` | `appointment.booked` · `appointment.rescheduled` · `appointment.cancelled` | `line-notifier` · `crm-summary` |
| `<topic>.dlq` | เดิม | event ที่ประมวลผลไม่ได้ | คนดูแลเล่นซ้ำ |

สร้างทุก topic ด้วยสคริปต์ที่รีวิวได้: partition 3 · RF 3 · `min.insync.replicas=2` · `retention.ms=604800000` · `cleanup.policy=delete`

## 2 · โครง event

```json
{
  "event_id": "0b6f5c5e-2c3a-4b9e-9a77-5f1d1f7a4c10",
  "type": "appointment.rescheduled",
  "schema_version": 1,
  "occurred_at": "2026-10-27T09:30:00Z",
  "appointment_id": "apt_8841",
  "patient_id": "pat_1207",
  "version": 3,
  "data": { "new_slot_start": "2026-11-02T14:00:00+07:00", "reason_code": "patient_request" }
}
```

- ไม่มีเบอร์โทร ชื่อ เสียง ถอดเสียง · `reason_code` เป็นรหัส ไม่ใช่ข้อความอิสระ
- `version` นับเพิ่มต่อนัด ผู้รับใช้ตัดสินลำดับ ถ้ามาช้ากว่าที่เก็บอยู่ให้ข้าม
- `call.summarised` ใส่ `summary_ref` ชี้ที่เก็บสรุป ไม่ใส่ตัวสรุป

## 3 · outbox ฝั่ง voice agent

```sql
create table outbox (
  id          bigserial primary key,
  event_id    uuid not null unique,
  topic       text not null,
  key         text not null,
  payload     jsonb not null,
  created_at  timestamptz not null default now(),
  sent_at     timestamptz
);
```

```
begin
  insert/update ข้อมูลนัดหรือสรุปสาย
  insert into outbox(...)            -- ธุรกรรมเดียวกัน
commit

relay วนทุกไม่กี่วินาที:
  rows = select ... from outbox where sent_at is null order by id limit 100
  for row in rows:
    producer.send(row.topic, key=row.key, value=row.payload)   -- รอผล ล้มให้หยุดแล้วลองรอบหน้า
    update outbox set sent_at = now() where id = row.id
```

relay ตายหลังส่งก่อน `update` = ส่งซ้ำ · ผู้รับกันด้วย `event_id` (หัวข้อ 4) · ลบแถวที่ส่งแล้วเกินกำหนดด้วยงานเบื้องหลัง (`background-jobs`)

## 4 · consumer ที่ทำซ้ำได้

```
loop:
  records = consumer.poll()
  for r in records:
    try retry(สูงสุด 5 ครั้ง, หน่วงเพิ่มขึ้น):
      begin
        ถ้า event_id อยู่ใน processed_events แล้ว: ข้าม
        ถ้า r.version ต่ำกว่าที่เก็บอยู่: ข้าม
        เขียนผลลง CRM DB
        insert into processed_events(event_id)
      commit
    ถ้าล้มถาวรหรือหมดรอบลอง:
      dlq.send(topic = r.topic + ".dlq", value = r.value,
               headers = { src_topic, src_partition, src_offset, error_class })
  consumer.commit()   -- หลังทุก record ในรอบเสร็จหรือเข้า DLQ แล้วเท่านั้น
```

consumer แจ้งเตือน LINE: ส่งจริงนอกธุรกรรม DB จึงอาจส่งซ้ำถ้าตายหลังส่งก่อน commit · ลดด้วยการบันทึก `event_id` ที่ส่งแล้ว และใช้กลไกกันส่งซ้ำของ LINE ถ้ามี `(ยังไม่ได้ตรวจ ดู e-commerce:line-oa-setup และเอกสาร LINE Messaging API)` · ข้อความซ้ำ 1 ครั้งในกรณีหายากยอมรับได้ ข้อความหายไม่ได้ · กฎโควตากับช่องทางตาม `notifications`

## 5 · ค่า properties

producer (relay):

```properties
acks=all
enable.idempotence=true
delivery.timeout.ms=120000
```

consumer:

```properties
enable.auto.commit=false
auto.offset.reset=earliest
max.poll.records=50
max.poll.interval.ms=300000
# group.instance.id=<ชื่อ pod คงที่>   # ใช้เมื่อรีสตาร์ทบ่อย
```

`max.poll.records=50` เป็นค่าสมมติสำหรับ consumer ที่เรียก LINE ต่อ record `(ประมาณ ยังไม่ได้วัด)` · ค่าอื่นดู [`config-table`](config-table.md)


## reference: config-table.md

# ค่าตั้ง Kafka ที่ skill `kafka-streaming` อ้างถึง

ค่าเริ่มต้นคัดจากเอกสาร Apache Kafka 4.4 · ตรวจ 2026-10-27 · ค่าเปลี่ยนตามรุ่น ตรวจหน้าของรุ่นที่ใช้จริงก่อนลงไฟล์ตั้งค่า

## producer — https://kafka.apache.org/44/configuration/producer-configs/

| ค่า | เริ่มต้น | ที่แนะนำ | หมายเหตุ |
|---|---|---|---|
| `acks` | `all` | `all` ตั้งชัด | idempotence ต้องใช้ `all` |
| `enable.idempotence` | `true` | `true` ตั้งชัด | ตัดสำเนาจาก retry ของ producer ตัวเดียวกัน |
| `retries` | 2147483647 | ไม่แตะ | เอกสารแนะให้คุมด้วย `delivery.timeout.ms` |
| `delivery.timeout.ms` | 120000 | ไม่แตะ จนกว่าจะมีเหตุ | เวลารวมก่อนรายงานสำเร็จหรือล้ม ต้องจัดการผลล้มเสมอ |
| `max.in.flight.requests.per.connection` | 5 | ไม่เกิน 5 | เปิด idempotence ต้อง 5 หรือน้อยกว่า |
| `transactional.id` | `null` | ไม่ใช้ในงานนี้ | transaction ครอบเฉพาะ Kafka ไป Kafka |
| `linger.ms` | 5 | ไม่แตะ | เปลี่ยนจาก 0 เป็น 5 ใน 4.0 |

## consumer — https://kafka.apache.org/44/configuration/consumer-configs/

| ค่า | เริ่มต้น | ที่แนะนำ | หมายเหตุ |
|---|---|---|---|
| `enable.auto.commit` | `true` | `false` | commit เองหลังงานเสร็จ |
| `auto.offset.reset` | `latest` | `earliest` ถ้าต้องอ่านจากต้น | `latest` อาจข้าม record เมื่อเพิ่ม partition · เอกสารแนะ `by_duration` |
| `max.poll.interval.ms` | 300000 | ตามงานต่อรอบ | เกินแล้ว consumer ถูกถือว่าล้ม เกิด rebalance |
| `max.poll.records` | 500 | ลดถ้างานต่อ record ช้า | |
| `session.timeout.ms` | 45000 | ไม่แตะ | ใช้ไม่ได้เมื่อ `group.protocol=consumer` |
| `heartbeat.interval.ms` | 3000 | ไม่แตะ | ต้องน้อยกว่า session timeout ปกติไม่เกินหนึ่งในสาม |
| `isolation.level` | `read_uncommitted` | ไม่แตะ | `read_committed` ใช้เมื่อ producer ใช้ transaction |
| `partition.assignment.strategy` | `RangeAssignor,CooperativeStickyAssignor` | ไม่แตะ | |
| `group.instance.id` | `null` | ตั้งเมื่อรีสตาร์ทบ่อย | static member · id ซ้ำในกลุ่มพร้อมกันไม่ได้ |
| `group.protocol` | `classic` | `classic` | `consumer` เป็นโปรโตคอลใหม่ ยังไม่ได้ตรวจความพร้อมของ client |

## topic — https://kafka.apache.org/44/configuration/topic-configs/

| ค่า | เริ่มต้น | หมายเหตุ |
|---|---|---|
| `retention.ms` | 604800000 (7 วัน) | `-1` คือไม่จำกัดเวลา |
| `retention.bytes` | -1 | จำกัดต่อ partition ไม่ใช่ต่อ topic |
| `cleanup.policy` | `delete` | `compact` เก็บค่าล่าสุดต่อ key |
| `min.insync.replicas` | 1 | ใช้กับการเขียนที่ `acks=all` เท่านั้น |
| `min.cleanable.dirty.ratio` | 0.5 | เฉพาะ topic ที่ compact |
| `delete.retention.ms` | 86400000 (1 วัน) | อายุ tombstone ของ topic ที่ compact |
| `max.message.bytes` | 1048588 | นับหลังบีบอัด |

## broker — https://kafka.apache.org/44/configuration/broker-configs/

| ค่า | เริ่มต้น | หมายเหตุ |
|---|---|---|
| `default.replication.factor` | 1 | ตั้ง 3 ใน production |
| `auto.create.topics.enable` | `true` | ปิดใน production แล้วสร้าง topic ด้วยโค้ด |
| `unclean.leader.election.enable` | `false` | เปิดแล้วข้อมูลอาจหาย ไม่เปิด |
| `offsets.topic.replication.factor` | 3 | |

ค่า `num.partitions` ของ broker อ่านไม่ถึงในหน้าที่ดึง `(ยังไม่ได้ตรวจ)`

## ที่มาอื่น

- Schema Registry ค่าเริ่มต้นโหมด `BACKWARD` — https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html (ตรวจ 2026-10-27)
- เพิ่ม partition แล้ว key ย้าย — https://kafka.apache.org/44/operations/basic-kafka-operations/ (ตรวจ 2026-10-27)
