---
name: project-bootstrap
description: Use when starting a repository or one is slow to run on a new machine. Folder layout, newcomer README, one install and one run command, formatter.
---

# ตั้งต้นโปรเจกต์

> **กฎข้อเดียว:** คนที่ไม่เคยเห็นโปรเจกต์นี้มาก่อน ต้องรันได้ภายใน **30 นาที**
> โดยอ่านแค่ `README.md` และไม่ต้องถามใคร

## เมื่อไหร่ใช้ skill นี้

- เริ่ม repository ใหม่
- มีคนใหม่เข้าทีม แล้วใช้เวลาครึ่งวันกว่าจะรันได้
- ทุก pull request มี diff ทั้งไฟล์เพราะตัวจัดรูปแบบตั้งไม่เหมือนกัน
- ไม่มีใครรู้ว่าเอกสารของโปรเจกต์อยู่ที่ไหนบ้าง

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

**โฟลเดอร์โปรเจกต์ (ที่ผู้ใช้เปิด) จัดตาม `project-doc-set` ข้อ 1 แบบ B เสมอ** — เอกสารอยู่นอก repo ส่วนโค้ดอยู่ในโฟลเดอร์ชื่อโปรเจกต์:

```
<Project Name>/          ← โฟลเดอร์ที่ผู้ใช้เปิด — มีแค่ 8 อย่างนี้ (สร้างเมื่อมีของจริง)
  ref/                   ← ของที่ได้รับมา (SRS · TOR · ไฟล์ลูกค้า) อ่านอย่างเดียว ไม่เปลี่ยนชื่อ
  docs/                  ← เอกสารที่เราเขียน — README.md (สารบัญ) · BUILD-PLAN.md · .docx ส่งมอบ
  mockup/                ← .html ที่เปิดแล้วกดได้จริง
  assets/                ← โลโก้ · ไอคอน · favicon · รูปของโปรเจกต์ (ต้นทาง .svg + ไฟล์ export)
  qa/                    ← test case · ผลตรวจ (security-gate · bug-report-template)
  _to_delete/            ← ของชั่วคราวทั้งหมด (temp-file-discipline)
  .claude/               ← skill ของโปรเจกต์ (เช่น verify) — ต้องอยู่ที่ที่เปิด Claude Code
  <project-name>/        ← repo โค้ด (โครงข้างในอยู่ข้างล่าง)
```

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · ติดตั้ง · รัน · test
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  docs/adr/0001-*.md     ← ADR และ runbook เปลี่ยนพร้อมโค้ด จึงอยู่ใน repo
  docs/runbook.md
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ในตารางล่าง)
  tests/
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```

**ชื่อโฟลเดอร์โค้ด** — เอาชื่อโฟลเดอร์โปรเจกต์มาทำเป็นตัวพิมพ์เล็ก เว้นวรรคและเครื่องหมายเปลี่ยนเป็น `-` ตัวเดียว:
`Lumio - Light Meter/` → `lumio-light-meter/`
คำสั่ง build test และ run ทุกตัวรันจากในโฟลเดอร์นี้ ส่วนชื่อแพ็กเกจในภาษาที่บังคับรูปแบบ (Dart `name:` ใน pubspec · Python package) ยังตั้งตามกฎของภาษา เพราะกฎนี้คุมแค่ชื่อโฟลเดอร์

**กฎของราก (ชั้นบนสุดของโฟลเดอร์โปรเจกต์):**
- มีแค่ 8 อย่างในผังบน ถ้าโปรเจกต์มีข้อยกเว้นให้ประกาศใน README ของโปรเจกต์
- README, CHANGELOG และไฟล์ตั้งค่าของโค้ดอยู่ใน repo
- `.docx` / `.xlsx` ไม่อยู่ที่ราก: ไฟล์ที่ได้รับมาเก็บใน `ref/` ส่วนไฟล์ที่เราเขียนเก็บใน `docs/`
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

> **แบบ A** (เอกสารทั้งหมดอยู่ใน repo ไม่มีโฟลเดอร์โปรเจกต์ครอบ) ใช้เฉพาะเมื่อผู้ใช้ขอ — ดู `project-doc-set` ข้อ 1

**`docs/README.md` คือสารบัญ ไม่ใช่เนื้อหา:**

```markdown
| เอกสาร | อ่านเมื่อ | เจ้าของ | อัปเดตล่าสุด |
|---|---|---|---|
| [srs.md](srs.md) | ก่อนเริ่มทุกงาน | @ba | 2026-09-25 |
| [adr/](adr/) | อยากรู้ว่าทำไมเลือกแบบนี้ | @arch | |
| [runbook.md](runbook.md) | ระบบล่ม | @devops | |
```

---

## 2 · README ต้องตอบ 5 คำถาม

| # | คำถาม | ยาวแค่ไหน |
|:--:|---|---|
| 1 | โปรเจกต์นี้คืออะไร ทำอะไรให้ใคร | 2–3 บรรทัด |
| 2 | ต้องมีอะไรบ้างบนเครื่อง (เวอร์ชันด้วย) | ตาราง |
| 3 | **ติดตั้งและรันยังไง** | คำสั่งที่คัดลอกไปวางแล้วใช้ได้จริง |
| 4 | รัน test ยังไง | 1 คำสั่ง |
| 5 | เอกสารและคนที่ต้องถาม อยู่ที่ไหน | ลิงก์ไป `docs/README.md` |

```markdown
## เริ่มใช้งาน

ต้องมี: Node 22 · PostgreSQL 16 · Docker

    git clone <url> <project-name> && cd <project-name>
    cp .env.example .env        # กรอกค่าตามคอมเมนต์ในไฟล์
    npm ci
    docker compose up -d db
    npm run db:migrate && npm run db:seed
    npm run dev                 # เปิด http://localhost:3000

รัน test:  npm test
```

แอป Flutter / Android ไม่มี DB หรือ Docker แต่ก็ต้องบอกของบนเครื่องให้ครบ
ดูแม่แบบ "README ส่วนเริ่มใช้งาน — Flutter / Android" ใน `assets/starter-files.md`

> **ทุกคำสั่งต้องเคยรันจริงบนเครื่องเปล่า** เพราะ README ส่วนใหญ่ผิดตรงที่คนเขียน
> มีของครบอยู่แล้วบนเครื่องตัวเอง จึงไม่เห็นว่ามีขั้นตอนที่หายไป
>
> **1 คำสั่งติดตั้ง 1 คำสั่งรัน** — ถ้ามี 12 ขั้นตอน ให้เขียนเป็น `scripts/setup.sh`

---

## 3 · CHANGELOG

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เพิ่ม
- แจ้งเตือนทาง LINE
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
```

- เขียนให้**คนใช้งาน**อ่าน ไม่ใช่คัดลอกรายการ commit มาวาง
- หัวข้อ "เปลี่ยนที่ทำให้ของเดิมพัง" ต้องอยู่**บนสุด**ของเวอร์ชันนั้นเสมอ
- เลขเวอร์ชันและกฎการขึ้นเลข ดู `cicd-and-release`

---

## 4 · ตัวจัดรูปแบบและ linter — จบการเถียงเรื่องสไตล์

| ไฟล์ | ทำอะไร | ทุกภาษา |
|---|---|---|
| `.editorconfig` | เว้นวรรค · ตัวขึ้นบรรทัดใหม่ · encoding | ✅ |
| ตัวจัดรูปแบบ | จัดรูปแบบอัตโนมัติตอนบันทึก | Prettier · dotnet format · black/ruff · `dart format` |
| linter | จับของที่ผิดจริง ไม่ใช่เรื่องสไตล์ | ESLint · analyzer ของ .NET · ruff · `flutter analyze` (กฎใน `analysis_options.yaml`) |

```ini
# .editorconfig
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

> 🚨 **`end_of_line = lf` และ `.gitattributes` ที่มี `* text=auto eol=lf`**
> ทีมที่ใช้ทั้ง Windows และระบบอื่น ถ้าไม่ตั้งไว้ จะเจอ pull request ที่ diff ทั้งไฟล์
> ทั้งที่แก้บรรทัดเดียว จนรีวิวไม่ได้เลย

- **ตัวจัดรูปแบบตัดสินใจแทนคน** จะเลือกค่าไหนก็ได้ แต่ต้องเป็นค่าเดียวกันทั้งทีม
- ให้ CI ตรวจด้วย ไม่ใช่พึ่งว่าทุกคนตั้งเครื่องเหมือนกัน
- เวลาเปิดใช้กับโปรเจกต์เก่า ให้จัดรูปแบบทั้ง repo ใน **commit เดียวที่ไม่มีอย่างอื่นปน**
  แล้วใส่ commit นั้นใน `.git-blame-ignore-revs`

---

## 5 · Dependency

| กฎ | เหตุผล |
|---|---|
| **commit lock file เสมอ** | ไม่งั้น build วันนี้กับพรุ่งนี้ได้คนละชุด |
| ติดตั้งบน CI ด้วยคำสั่งที่ยึด lock (`npm ci` · `flutter pub get --enforce-lockfile`) | ไม่ใช่คำสั่งที่อัปเดต lock ให้เอง |
| ตรวจช่องโหว่ใน pipeline | ดู `cicd-and-release` |
| อัปเดตเป็นรอบ ไม่ใช่ตอนที่พังแล้ว | patch เดือนละครั้ง ส่วน minor ไตรมาสละครั้ง |
| เพิ่ม dependency ใหม่ต้องมีเหตุผลใน pull request | ดู `lazy-coding` |

**ก่อนเพิ่มไลบรารี ถาม 3 ข้อ** — มาตรฐานของภาษาทำได้ไหม โครงการยังมีชีวิตอยู่ไหม และ
สัญญาอนุญาตใช้ได้กับงานที่ขายไหม (ดู `prior-art-review`)

---

## 6 · รายการตรวจเมื่อเปิดโปรเจกต์ใหม่

ติ๊ก `[x]` เฉพาะข้อที่**รันหรือเปิดดูแล้วในรอบนี้** ข้อที่ยังไม่ได้สร้างหรือยังไม่ได้รัน ให้ใส่ `[ ]` พร้อมบอกว่าค้างอะไร ส่วนข้อที่ไม่เกี่ยวกับโปรเจกต์นี้ ให้ใส่ `N/A — <เหตุผล>`

- [ ] `README.md` ตอบครบ 5 คำถาม และคำสั่งเคยรันจริงบนเครื่องเปล่า
- [ ] โฟลเดอร์โปรเจกต์มีแค่ `ref/` · `docs/` · `mockup/` · `assets/` · `qa/` · `_to_delete/` · `.claude/` · `<project-name>/` (repo ชื่อโปรเจกต์ตัวเล็กคั่น `-`) และไม่มีไฟล์ชั่วคราวหรือ `.docx` ที่ราก
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

- ❌ **README ที่มีแต่ชื่อโปรเจกต์** — คนใหม่ต้องไปถามทุกอย่าง
- ❌ **คำสั่งติดตั้งที่ไม่เคยรันบนเครื่องเปล่า** — จะมีขั้นตอนหายเสมอ
- ❌ **"ขอ `.env` จากพี่คนนั้น"** — การไม่มี `.env.example` คือหนี้ที่ทุกคนต้องจ่ายซ้ำ
- ❌ **ไม่ commit lock file** — build ไม่เหมือนเดิมทุกครั้ง
- ❌ **ไม่มี `.editorconfig`** — diff ทั้งไฟล์ในทุก pull request
- ❌ **linter ที่เถียงเรื่องสไตล์** — สไตล์ให้ตัวจัดรูปแบบจัดการ ส่วน linter มีไว้จับบั๊ก
- ❌ **ไฟล์ทดลองที่รากโปรเจกต์** — `test.js`, `ลองดู.py`, `backup_final.zip`
- ❌ **เอกสารกระจายอยู่ในแชตและ Google Drive** — ไม่มีสารบัญเดียว
- ❌ **CHANGELOG ที่คัดลอกรายการ commit มาวาง** — ไม่มีใครอ่านรู้เรื่อง

---

## 8 · ตัวย่อ

- **lock file** — ไฟล์ที่ตรึงเวอร์ชันของ dependency ทุกตัวไว้เป๊ะ ๆ
- **linter** — เครื่องมือตรวจโค้ดหาของที่น่าจะผิด
- **formatter** — ตัวจัดรูปแบบโค้ดอัตโนมัติ
- **LF** — Line Feed (ตัวขึ้นบรรทัดใหม่แบบ Unix ต่างจาก CRLF ของ Windows)
- **CI** — Continuous Integration (การตรวจอัตโนมัติทุกครั้งที่รวมโค้ด)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| pipeline build และ deploy | `cicd-and-release` |
| `.env` และที่เก็บ secret | `config-and-secrets` |
| ตั้ง test framework | `testing-standards` |
| โครงและชื่อของเอกสารใน `docs/` | `document-naming` |
| ของชั่วคราวใน `_to_delete/` | `temp-file-discipline` |
| รูปแบบข้อความ commit ที่สร้าง CHANGELOG ได้ | `commit-message-format` |
| ตัดสินใจก่อนเพิ่ม dependency | `lazy-coding` · `prior-art-review` |

**แม่แบบ README · docs/README · .editorconfig · .gitattributes** → `assets/starter-files.md`
