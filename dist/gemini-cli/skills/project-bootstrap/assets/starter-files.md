# ไฟล์ตั้งต้นที่คัดลอกไปใช้ได้เลย

## README.md

```markdown
# <ชื่อโปรเจกต์>

> <ทำอะไรให้ใคร — 2–3 บรรทัด>

**สถานะ:** 🟢 ใช้งานจริง · **เจ้าของ:** @ชื่อ · **เอกสาร:** [docs/README.md](docs/README.md)

## ต้องมีบนเครื่อง

| เครื่องมือ | เวอร์ชัน | หมายเหตุ |
|---|---|---|
| Node.js | 22.x | |
| PostgreSQL | 16 | หรือใช้ Docker ตามด้านล่าง |
| Docker | 27+ | |

## เริ่มใช้งาน

    git clone <url> <project-name> && cd <project-name>
    cp .env.example .env        # กรอกค่าตามคอมเมนต์ในไฟล์
    npm ci
    docker compose up -d db
    npm run db:migrate && npm run db:seed
    npm run dev                 # http://localhost:3000

## คำสั่งที่ใช้บ่อย

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รันแบบพัฒนา |
| `npm test` | รัน test ทั้งหมด |
| `npm run lint` | ตรวจสไตล์และ lint |
| `npm run db:migrate` | อัปเดต schema |

## โครงโฟลเดอร์

    src/        โค้ดจริง
    tests/      test
    docs/       เอกสาร — เริ่มที่ docs/README.md
    scripts/    สคริปต์ที่คนต้องรัน

## ติดปัญหา

| อาการ | แก้ |
|---|---|
| `ECONNREFUSED` ตอนรัน | ยังไม่ได้ `docker compose up -d db` |
| `missing env APP_...` | ยังกรอก `.env` ไม่ครบ ดู `.env.example` |
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
| 2 | [adr/](adr/) | อยากรู้ว่าทำไมเลือกแบบนี้ | @arch | |
| 3 | [fsd-*.md](.) | ก่อนลงมือทำหน้าจอนั้น | @sa | |
| 4 | [API-CONVENTIONS.md](../API-CONVENTIONS.md) | ก่อนเพิ่ม endpoint | @dev | |
| 5 | [runbook.md](runbook.md) | ระบบล่ม | @devops | |
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

> `.gitattributes` ไม่รองรับคอมเมนต์ท้ายบรรทัด — คอมเมนต์ต้องอยู่บรรทัดของตัวเอง

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

เพิ่มบล็อกนี้**เฉพาะโปรเจกต์ Flutter / Android** — ไฟล์ keystore หลุดคือความเสี่ยงหลักของแอปมือถือ:

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
