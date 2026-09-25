---
name: project-bootstrap
description: Use when starting a new repository, or when an existing one takes too long to run on a new machine. Sets the folder layout, a README that answers the five questions a newcomer has, one command to install and one to run, formatter and editor settings that stop whole-file diffs, and a dependency policy. The target is running within thirty minutes.
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

```
<project>/
  README.md              ← ข้อ 2 · ไฟล์แรกที่ทุกคนเปิด
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets)
  .editorconfig          ← ข้อ 4
  .gitignore
  docs/
    README.md            ← สารบัญเอกสาร — อ่านอะไรก่อน ใครเป็นเจ้าของ
    srs.md  fsd-*.md
    adr/0001-*.md        ← หนึ่งการตัดสินใจต่อไฟล์
    runbook.md
    releases/            ← ไฟล์ส่งมอบที่มีเวอร์ชันในชื่อ
  src/                   ← โค้ดจริง
  tests/
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
  _to_delete/            ← ของชั่วคราวทั้งหมด (ดู temp-file-discipline)
```

**กฎ:** รากโปรเจกต์มีแต่ไฟล์ตั้งค่าและ README · ของชั่วคราวไม่เคยอยู่ที่ราก ·
ชื่อโฟลเดอร์และไฟล์เป็นตัวพิมพ์เล็กขีดกลาง ไม่มีเว้นวรรค

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

    git clone <url> && cd <project>
    cp .env.example .env        # กรอกค่าตามคอมเมนต์ในไฟล์
    npm ci
    docker compose up -d db
    npm run db:migrate && npm run db:seed
    npm run dev                 # เปิด http://localhost:3000

รัน test:  npm test
```

> **ทุกคำสั่งต้องเคยถูกรันจริงบนเครื่องเปล่า** — README ส่วนใหญ่ผิดเพราะคนเขียน
> มีของครบอยู่แล้วบนเครื่องตัวเอง จึงไม่เห็นว่ามีขั้นตอนที่หายไป
>
> **หนึ่งคำสั่งติดตั้ง หนึ่งคำสั่งรัน** — ถ้ามี 12 ขั้นตอน ให้เขียนเป็น `scripts/setup.sh`

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
| ตัวจัดรูปแบบ | จัดรูปแบบอัตโนมัติตอนบันทึก | Prettier · dotnet format · black/ruff |
| linter | จับของที่ผิดจริง ไม่ใช่เรื่องสไตล์ | ESLint · analyzer ของ .NET · ruff |

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
> ทีมที่ปนกันระหว่าง Windows กับที่อื่น ถ้าไม่ตั้ง จะเจอ pull request ที่ diff ทั้งไฟล์
> ทั้งที่แก้บรรทัดเดียว แล้วรีวิวไม่ได้เลย

- **ตัวจัดรูปแบบตัดสินใจแทนคน** — เลือกอะไรก็ได้ แต่ต้องเป็นค่าเดียวกันทั้งทีม
- ให้ CI ตรวจด้วย ไม่ใช่พึ่งว่าทุกคนตั้งเครื่องเหมือนกัน
- เวลาเปิดใช้กับโปรเจกต์เก่า ให้จัดรูปแบบทั้ง repo ใน **commit เดียวที่ไม่มีอย่างอื่นปน**
  แล้วใส่ commit นั้นใน `.git-blame-ignore-revs`

---

## 5 · Dependency

| กฎ | เหตุผล |
|---|---|
| **commit lock file เสมอ** | ไม่งั้น build วันนี้กับพรุ่งนี้ได้คนละชุด |
| ติดตั้งบน CI ด้วยคำสั่งที่ยึด lock (`npm ci`) | ไม่ใช่คำสั่งที่อัปเดต lock ให้เอง |
| ตรวจช่องโหว่ใน pipeline | ดู `cicd-and-release` |
| อัปเดตเป็นรอบ ไม่ใช่ตอนที่พังแล้ว | เดือนละครั้งสำหรับ patch · ไตรมาสละครั้งสำหรับ minor |
| เพิ่ม dependency ใหม่ต้องมีเหตุผลใน pull request | ดู `lazy-coding` |

**ก่อนเพิ่มไลบรารี ถามสามข้อ** — มาตรฐานของภาษาทำได้ไหม · โครงการยังมีชีวิตอยู่ไหม ·
สัญญาอนุญาตใช้ได้กับงานที่ขายไหม (ดู `prior-art-review`)

---

## 6 · รายการตรวจเมื่อเปิดโปรเจกต์ใหม่

- [ ] `README.md` ตอบครบ 5 คำถาม และคำสั่งเคยรันจริงบนเครื่องเปล่า
- [ ] `.env.example` มีค่าครบทุกตัวพร้อมคอมเมนต์
- [ ] `.editorconfig` · `.gitattributes` · ตัวจัดรูปแบบ · linter ตั้งแล้ว และ CI ตรวจ
- [ ] `.gitignore` ครอบคลุม `.env` · โฟลเดอร์ build · `_to_delete/`
- [ ] `docs/README.md` เป็นสารบัญ พร้อมเจ้าของแต่ละเอกสาร
- [ ] `CHANGELOG.md` มีหัวข้อ "ยังไม่ปล่อย" รออยู่
- [ ] test อย่างน้อยหนึ่งตัวที่รันผ่าน เพื่อพิสูจน์ว่าโครงใช้ได้
- [ ] `main` ถูกป้องกัน ต้องผ่าน pull request และ CI
- [ ] **ให้คนที่ไม่ได้ตั้งโปรเจกต์ลองทำตาม README แล้วจับเวลา**

---

## 7 · Anti-patterns

- ❌ **README ที่มีแต่ชื่อโปรเจกต์** — คนใหม่ต้องไปถามทุกอย่าง
- ❌ **คำสั่งติดตั้งที่ไม่เคยรันบนเครื่องเปล่า** — จะมีขั้นตอนหายเสมอ
- ❌ **"ขอ `.env` จากพี่คนนั้น"** — ไม่มี `.env.example` คือหนี้ที่ทุกคนจ่ายซ้ำ
- ❌ **ไม่ commit lock file** — build ไม่เหมือนเดิมทุกครั้ง
- ❌ **ไม่มี `.editorconfig`** — diff ทั้งไฟล์ในทุก pull request
- ❌ **linter ที่เถียงเรื่องสไตล์** — ควรให้ตัวจัดรูปแบบจัดการ linter ไว้จับบั๊ก
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
