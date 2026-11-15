# ไฟล์ตั้งต้นที่คัดลอกไปใช้ได้เลย

## README.md

ตัวอย่างค่าสำรองตาม `references/readme-skeleton.md` (หัวข้อจริงมาจากผลสำรวจใน `SKILL.md` ข้อ 2) · ตัวอย่างนี้เป็น Node + PostgreSQL · หัวข้อที่โปรเจกต์ไม่มีของ ตัดทิ้ง · ภาษาอื่นเปลี่ยนคำสั่งตาม `references/readme-by-stack.md`

```markdown
# <ชื่อโปรเจกต์>

> <ทำอะไรให้ใคร — 2–3 บรรทัด>

**สถานะ:** ใช้งานจริง · **เจ้าของ:** @ชื่อ · **เอกสาร:** [../docs/README.md](../docs/README.md)

![หน้าหลัก](../docs/figures/screenshot.png)

## ต้องมีบนเครื่อง

| เครื่องมือ | เวอร์ชัน | ปักไว้ที่ |
|---|---|---|
| Node.js | 22.x | `.nvmrc` — สั่ง `nvm use` |
| PostgreSQL | 16 | หรือใช้ Docker ตามด้านล่าง |
| Docker | 27+ | |

## เริ่มใช้งาน

    git clone <url> <project-name> && cd <project-name>
    cp .env.example .env        # กรอกค่าตามคอมเมนต์ในไฟล์
    npm ci
    docker compose up -d db
    npm run db:migrate && npm run db:seed
    npm run dev                 # http://localhost:3000

## ตั้งค่า

ค่าทั้งหมดอยู่ใน `.env` (คัดลอกจาก `.env.example`) · environment มี `development` · `staging` · `production` เลือกด้วย `NODE_ENV`

| ตัวแปร | ใช้ทำอะไร | ต้องมี | ค่าตัวอย่าง |
|---|---|:--:|---|
| `DATABASE_URL` | ต่อฐานข้อมูล | ✓ | `postgres://app:app@localhost:5432/app` |
| `APP_SESSION_SECRET` | เข้ารหัส session · ค่าจริงขอจาก @ชื่อ | ✓ | — |
| `LINE_TOKEN` | ส่งแจ้งเตือน LINE · ไม่ใส่ = ไม่ส่ง | | — |

## คำสั่งที่ใช้บ่อย

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รันแบบพัฒนา |
| `npm test` | รัน test ทั้งหมด |
| `npm run lint` | ตรวจสไตล์และ lint |
| `npm run db:migrate` | อัปเดต schema |
| `npm run build` | build ลง `dist/` |

## โครงโปรเจกต์

    src/        โค้ดจริง — unit test อยู่ข้างไฟล์ที่ทดสอบ (`*.test.ts`)
    tests/      เฉพาะ integration และ e2e (.NET · Flutter ใช้เป็นโฟลเดอร์ทดสอบหลักตามที่เครื่องมือบังคับ)
    scripts/    สคริปต์ที่คนต้องรัน

เอกสารอยู่ที่ `../docs/` ที่รากโปรเจกต์ — เริ่มที่ `../docs/README.md` · แผนที่โค้ดเต็มใน `ARCHITECTURE.md`

## สถาปัตยกรรมย่อ

หน้าเว็บ React เรียก API ของโปรเจกต์นี้ · API เก็บข้อมูลใน PostgreSQL และส่งแจ้งเตือนผ่าน LINE

ใน README จริงครอบรูปข้างล่างด้วย ```` ```mermaid ```` (ที่นี่ย่อหน้าไว้เพราะอยู่ในแม่แบบ)

    flowchart TB
      user[ผู้ใช้] --> web[หน้าเว็บ]
      web --> api[API]
      api --> db[(PostgreSQL)]
      api --> line[LINE Messaging API]

## build และไฟล์ที่ได้

    npm run build               # ได้ dist/ (ไฟล์ static) และ dist/server.js
    docker build -t <project-name>:<รุ่น> .

## deploy

merge เข้า `main` → CI build image แล้วขึ้น staging เอง · ขึ้น production กดอนุมัติใน CI · ย้อนรุ่นและขั้นเต็มใน `../docs/runbook-deploy.md`

## ติดปัญหา

| อาการ | แก้ |
|---|---|
| `ECONNREFUSED` ตอนรัน | ยังไม่ได้ `docker compose up -d db` |
| `missing env APP_...` | ยังกรอก `.env` ไม่ครบ ดู `.env.example` |

## ร่วมพัฒนา

แตก branch จาก `main` · commit ตาม Conventional Commits · `npm run lint && npm test` ผ่านก่อนเปิด PR · รายละเอียดใน `CONTRIBUTING.md`

## ติดต่อและขอความช่วยเหลือ

ติดขัดถาม @ชื่อ ในกลุ่ม <ชื่อกลุ่ม> · แจ้งบั๊กเป็น issue

## สัญญาอนุญาต

ใช้ภายใน <บริษัท> ห้ามเผยแพร่
```

## README ส่วนเริ่มใช้งาน — Flutter / Android

ใช้แทนสองส่วน "ต้องมีบนเครื่อง" และ "เริ่มใช้งาน" ข้างบน เมื่อเป็นแอป Flutter

```markdown
## ต้องมีบนเครื่อง

| เครื่องมือ | เวอร์ชัน | หมายเหตุ |
|---|---|---|
| Flutter SDK | <ตามที่ใช้จริง> | channel stable · `flutter --version` |
| JDK | 17 | ที่ Android Gradle Plugin ต้องการ |
| Android SDK | platform + build-tools ตาม `android/app/build.gradle.kts` (Flutter รุ่นเก่าใช้ `build.gradle`) | ติดตั้งผ่าน Android Studio หรือ `sdkmanager` |
| อีมูเลเตอร์หรือเครื่องจริง | API ≥ minSdk ของแอป | เปิด USB debugging ถ้าใช้เครื่องจริง |

## เริ่มใช้งาน

    git clone <url> <project-name> && cd <project-name>
    flutter doctor                        # ต้องไม่มี ✗ ในส่วน Flutter และ Android toolchain
    flutter pub get --enforce-lockfile
    flutter run                           # เลือกอีมูเลเตอร์หรือเครื่องที่ต่ออยู่

รัน test:  flutter test
ไม่มีค่าตั้งภายนอก — ไม่มี `.env`
```

## docs/README.md

```markdown
# สารบัญเอกสาร

อ่านตามลำดับนี้ถ้าเพิ่งเข้าโปรเจกต์ — 1 → 2 → 4

| # | เอกสาร | อ่านเมื่อ | เจ้าของ | อัปเดตล่าสุด |
|:--:|---|---|---|---|
| 1 | [srs.md](srs.md) | ก่อนเริ่มทุกงาน — ระบบต้องทำอะไรได้ | @ba | |
| 2 | [decisions/](decisions/) | อยากรู้ว่าทำไมเลือกแบบนี้ | @arch | |
| 3 | [fsd-*.md](.) | ก่อนลงมือทำหน้าจอนั้น | @sa | |
| 4 | [API-CONVENTIONS.md](API-CONVENTIONS.md) | ก่อนเพิ่ม endpoint | @dev | |
| 5 | [runbook-*.md](.) | ระบบล่ม | @devops | |
| 6 | [releases/](releases/) | หาไฟล์ที่ส่งลูกค้าไปแล้ว | @pm | |

**ต้นฉบับทุกฉบับอยู่ที่นี่** — ไฟล์ .docx ใน `releases/` คือของที่ render ออกไป ห้ามแก้ที่นั่น
```

## .editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{cs,csproj}]
indent_size = 4

[*.py]
indent_size = 4

[*.md]
trim_trailing_whitespace = false    # สองเว้นวรรคท้ายบรรทัด = ขึ้นบรรทัดใหม่

[Makefile]
indent_style = tab
```

## .gitattributes

```
* text=auto eol=lf

# ไฟล์สคริปต์ Windows ต้องเป็น CRLF ไม่อย่างนั้นรันพัง
*.bat text eol=crlf
*.cmd text eol=crlf

*.png  binary
*.jpg  binary
*.pdf  binary
*.docx binary
*.xlsx binary
*.pptx binary
*.zip  binary
*.webp binary
*.ttf  binary
*.otf  binary
```

เพิ่มบล็อกนี้**เฉพาะโปรเจกต์ Flutter / Android**:

```
# gradle/wrapper/gradle-wrapper.jar
*.jar       binary
*.jks       binary
*.keystore  binary
# ถ้าเป็น lf ไฟล์ .bat บน Windows รันพัง
gradlew.bat text eol=crlf
```

> `.gitattributes` ไม่รองรับคอมเมนต์ท้ายบรรทัด คอมเมนต์จึงต้องอยู่บรรทัดของตัวเอง

## .gitignore — ส่วนที่คนลืมบ่อย

```
.env
.env.*
!.env.example

_to_delete/
*.log
.DS_Store
Thumbs.db

node_modules/
dist/
bin/
obj/
__pycache__/
.venv/
```

เพิ่มบล็อกนี้**เฉพาะโปรเจกต์ Flutter / Android** เพราะไฟล์ keystore หลุดคือความเสี่ยงหลักของแอปมือถือ:

```
build/
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
android/local.properties
android/key.properties
*.jks
*.keystore
```

## CHANGELOG.md

```markdown
# Changelog

รูปแบบตาม Keep a Changelog · เลขเวอร์ชันตาม Semantic Versioning
หัวข้อในรุ่น: เปลี่ยนที่ทำให้ของเดิมพัง · เพิ่ม · เปลี่ยน · จะเลิกใช้ · เอาออก · แก้ · ความปลอดภัย (ตัดที่ไม่มีของ)

## [ยังไม่ปล่อย]

## [0.1.0] — YYYY-MM-DD
### เพิ่ม
- ฉบับแรก
```

## scripts/setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail          # หยุดทันทีเมื่อมีคำสั่งไหนล้ม

command -v node >/dev/null || { echo "ต้องติดตั้ง Node 22 ก่อน"; exit 1; }
[ -f .env ] || { cp .env.example .env; echo "สร้าง .env แล้ว — กรอกค่าให้ครบก่อนรันต่อ"; }

npm ci
docker compose up -d db
npm run db:migrate
npm run db:seed
echo "เสร็จแล้ว — รันด้วย: npm run dev"
```
