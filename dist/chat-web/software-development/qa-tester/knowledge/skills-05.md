# skill: app-verifier-setup

Use when an agent has no scripted way to run the app

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง ก็ปรับงานต่อเองไม่ได้ และคนต้องคอยส่งต่อสิ่งที่เห็นบนจอให้ agent
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** 2 ชิ้น คือสคริปต์ที่อยู่กับ test ของโปรเจกต์ และ skill ที่เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่เขียนขั้นตอนแยกเป็นไฟล์ข้อความ** เพราะลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก จึงเก็บข้อมูลไว้ในสคริปต์ที่เดียว แล้วให้ skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** จาก README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) ถ้ามีของเดิมให้ใช้ของเดิม ไม่สร้างใหม่
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (ถ้ามี Chromium ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ pywinauto (WinAppDriver รุ่นล่าสุดน่าจะออกปี 2020 และยังไม่ยืนยันว่า Microsoft ยังดูแลอยู่ (รอยืนยัน)) | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro · Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - ถ้าโปรเจกต์มี `.sandbox/` ให้ขับเบราว์เซอร์ใน container ซึ่งค่าเริ่มคือ headless (ไม่เปิดหน้าต่าง) ถ้าอยากให้คนดูได้ ให้เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) ส่วน Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) จึงให้รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA ให้ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) ให้ป้อนค่าที่รู้ล่วงหน้า ผ่าน emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build แล้วติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` เพราะความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ถ้ายังไม่ได้รันบนเครื่องจริง ให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** ให้เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) ใส่ข้อมูลทดสอบ (seed) และรอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ถ้าไม่ขึ้นใน 10 วินาทีถือว่าล้ม · มือถือ: ตั้งเวลาแยกสำหรับ build · boot emulator · เปิดแอป · แต่ละ check ดู reference) ปิดแอปเมื่อจบเสมอ และรันซ้ำต้องได้ผลเดิม (`principle-build-a-tool-not-handwork`)
   - **เว็บหรือ API ที่ต้องเปิดเซิร์ฟเวอร์ก่อน** ใช้ [`scripts/with_server.py`](scripts/with_server.py) เปิด รอพอร์ตพร้อม รันสคริปต์ แล้วปิดให้ครบ เช่น `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (เปิดหลายตัวได้โดยใส่ `--server` กับ `--port` ซ้ำ · log อยู่ใน `--log-dir` ค่าเริ่ม `_to_delete/with-server-logs` ซึ่งสร้างให้เองถ้ายังไม่มี) · ทดสอบบน Windows 2026-11-10 กับ `python -m http.server` แล้วพอร์ตปิดจริงหลังจบ · แอปไดนามิกให้รอ `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) หรือ `data-ready="true"` ก่อนอ่าน DOM ไม่เดา `sleep`

4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** ไล่จากเมนู · route · command list · SRS แล้วเขียน 1 กลุ่มต่อฟีเจอร์ 1 บรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาด 1 กรณีต่อฟีเจอร์ **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ และพิมพ์ผล `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** (ผ่านทั้งที่ไม่ได้ตรวจอะไรจริง) ถ้าชื่อฟีเจอร์ไม่มีจริงให้ exit 1 ถ้าแอปไม่ขึ้นให้ exit 1 และถ้าไม่มี check ไหนได้รันก็ให้ exit 1 (ตรวจ 0 รายการถือว่าพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นจะผ่านลอย ๆ และรอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **ต้องแน่ใจว่าอ่านหน้าจอล่าสุด** โดยลบไฟล์ผลเก่าก่อนอ่านใหม่ และกดเมื่อตำแหน่งเป้าหมายนิ่ง 2 รอบติด ถ้าอ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด ถือเป็นบั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** โดยแก้แอปให้ผิด 1 จุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** โดยส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล ติดตรงไหนให้แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** ทั้งภาพหน้าจอและ log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ผู้ใช้ลบเองได้เมื่อส่งงานแล้ว · agent ไม่ลบ)

## สัญญาสำหรับทดสอบ — ใส่ในแอปตั้งแต่หน้าจอแรก

verify ต้องพึ่งของที่แอปเตรียมไว้ให้ ไม่ใช่เดาจากข้อความหรือ CSS · เขียนสัญญานี้ลงแผนที่ฟีเจอร์ในสคริปต์ และให้ developer ทำตามตั้งแต่ฟีเจอร์แรก

| สิ่งที่แอปต้องมี | ใช้ทำอะไร | กฎ |
|---|---|---|
| `data-testid="<หน้า>-<สิ่งนั้น>"` แบบ kebab-case บนทุกปุ่ม ช่องกรอก ผลลัพธ์ และข้อความ error | หาองค์ประกอบโดยไม่ผูกกับข้อความหรือ CSS → เปลี่ยนภาษาหรือดีไซน์แล้ว check ไม่พัง | เช่น `book-submit` · `summary-total` · `book-error` · ห้ามซ้ำในหน้าเดียว · รายการ testid ทั้งหมดอยู่ในแผนที่ฟีเจอร์ |
| `<html data-ready="false">` → `"true"` เมื่อหน้าโหลดข้อมูลเสร็จ | รอแบบมีเงื่อนไขแทน `sleep` ค่าเดา (ข้อ 5) | ตั้ง `true` หลังข้อมูลชุดสุดท้ายมาถึง ไม่ใช่ตอน component mount |
| reset endpoint เช่น `POST /api/test/reset` → ล้างแล้วใส่ seed ใหม่ ภายใน 5 วินาที | ทุก check เริ่มจากสถานะสะอาด (ข้อ 4) | มีเฉพาะเมื่อตั้ง `ALLOW_TEST_RESET=1` · ไม่ตั้ง → ตอบ 404 · ห้ามเปิดใน production |
| ล็อกนาฬิกา: reset รับ `{"now":"<ISO + offset>"}` แล้วกฎทุกข้ออ่าน "วันนี้" จากโมดูลเดียว (`clock`) | ทดสอบกฎที่ขึ้นกับวันเวลา (หมดอายุ · ยกเลิกก่อน 24 ชั่วโมง) ให้ได้ผลเดิมทุกครั้ง | ไม่ส่ง `now` → ใช้วันเริ่มที่เขียนใน seed · ปิด flag → ใช้เวลาจริง · ห้ามเรียก `Date.now()` / `DateTime.Now` ตรง ๆ ในกฎ |

แอปที่ไม่ใช่เว็บใช้แนวเดียวกัน: Flutter → `Key` / Semantics label ชื่อเดียวกัน · Android → `resource-id` · command line → ตัวเลือก `--now` หรือตัวแปร `APP_NOW` · reset บนมือถือเปิดได้เฉพาะ debug build

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่มด้วย `with_server.py` (ถ้าแอปต้องเปิดเซิร์ฟเวอร์) และกฎรอ `networkidle` หรือ `data-ready` ก่อนอ่าน DOM
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม: ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง (production) | ตรวจไปตรวจมา กลายเป็นแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`references/builtin-verify.md`](references/builtin-verify.md) — Claude Code มี `/verify` ติดเครื่อง: โปรเจกต์ที่รันบน Claude Code ให้สร้าง skill ชื่อ `verify` ที่ `.claude/skills/verify/SKILL.md` ในรูปแบบนั้น แทน `verify-<โปรเจกต์>`
- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`superuser`](../superuser/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่


## reference: android-native.md

# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) · สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่เขียนว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม · ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** ว่ามีเครื่องต่ออยู่ (`adb devices`) และมี APK (`build/app/outputs/flutter-apk/app-debug.apk`) ถ้าไม่ครบ ให้ exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual และ exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อย 1 ข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` จึงใช้ตรวจได้ และช่วยผู้ใช้โปรแกรมอ่านจอด้วย |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) ทำให้เปลืองแบต และ TalkBack พูดซ้ำ ให้แก้โดยแจ้ง UI เฉพาะเมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่ค่าแกว่ง: เปลี่ยนเกิน 1 %) ส่วนค่ารองที่ค่อย ๆ ขยับ ให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่าน 2 ครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด ถ้ากดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุของ flake (ผลไม่คงที่) ที่เหลือ 1 ครั้ง แต่ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) ถ้าไม่ตรวจเงื่อนไขก่อน check จะผ่านทั้งที่ไม่ได้ตรวจอะไร |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` แล้วแอปได้ค่าผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ จึงตรวจได้แค่ว่า "มีค่าออกมา" ตรวจความแม่นไม่ได้ |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` แปลว่าทางเดินข้อมูลถูก ส่วน `เครื่องจริง` แปลว่าค่าถูก ถ้า check ไหนต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (ยังไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator กับ Gradle กินหน่วยความจำมาก จน Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว และหยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- ถ้า emulator ถูกปิดกลางทาง ให้รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี จึงให้รันบน host


## reference: builtin-verify.md

# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `app-verifier-setup` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `app-verifier-setup` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` maintains this one file only and does not create a nested `verify-<project>`


---

# skill: app-verifier-upkeep

Use when a project verify skill no longer matches the app

# app-verifier-upkeep — ดูแลมือและตาให้ตรงกับแอป

> verify skill ที่บอกขั้นตอนผิด อันตรายกว่าไม่มีเลย เพราะ agent จะเชื่อแล้วรายงานว่าผ่าน

ใช้กับ skill ที่สร้างจาก [`app-verifier-setup`](../app-verifier-setup/SKILL.md) · บน Claude Code ไฟล์นั้นคือ `.claude/skills/verify/SKILL.md` (ดู [`app-verifier-setup/references/builtin-verify.md`](../app-verifier-setup/references/builtin-verify.md)) — ดูแลไฟล์เดียว ไม่สร้าง `verify-<โปรเจกต์>` ซ้อน

## ขั้นตอน

1. **ทำรายการฟีเจอร์จริง** โดยดึงจาก route · เมนู · command list · Software Requirements Specification (SRS) ล่าสุด เทียบกับแผนที่ฟีเจอร์ในสคริปต์ `<project-name>/test/e2e/verify.*` แล้วแยกเป็น 3 กลุ่ม: ตรงกัน · หายจากแผนที่ฟีเจอร์ · ไม่มีในแอปแล้ว
2. **อ่านโค้ดพร้อมกันหลายตัว** ส่ง agent `qa-tester` ตัวใหม่ 1 ตัวต่อกลุ่มฟีเจอร์ (ไม่เกิน 5 ฟีเจอร์ต่อตัว) ให้อ่านอย่างเดียว แล้วรายงานว่า check ของแต่ละฟีเจอร์ใน `verify.*` ยังตรงกับโค้ดไหม พร้อมไฟล์และเลขบรรทัด โดยใช้ `parallel-split-and-merge`
3. **ขับแอปจริงรอบเดียว** ใช้ agent ตัวเดียว รัน `verify.*` (สคริปต์เปิดและปิดแอปเอง) ทุกฟีเจอร์ แล้วบันทึกผ่านหรือล้ม · ภาพหน้าจอ · ขั้นที่ล้ม
4. **แก้เฉพาะสิ่งที่พิสูจน์แล้ว** ทุกจุดที่แก้ต้องมีหลักฐานจากข้อ 2 หรือ 3 ถ้าฟีเจอร์ล้มเพราะแอปพังจริง ไม่ใช่เพราะขั้นตอนผิด ให้แยกเป็นรายงานบั๊ก (`bug-report-template`) อย่าแก้ขั้นตอนให้ผ่าน
5. **เพิ่มฟีเจอร์ที่หายจากแผนที่** ตามรูปแบบเดิม และรันจริงอย่างน้อย 1 ครั้งก่อนบันทึก
6. **รวมการแก้เป็นชุดเดียว** เตรียมไว้เป็น commit เดียวหรือ Pull Request (PR) เดียว (commit เมื่อผู้ใช้สั่งเท่านั้น) และในข้อความบอกจำนวนแต่ละกลุ่ม: ตรงกัน · แก้ · เพิ่ม · ลบ · บั๊กที่พบ
7. `status-report` ประเภท `ตรวจ`

## สิ่งที่ห้ามทำ

- แก้ขั้นตอนให้ผ่านทั้งที่แอปทำงานผิด เพราะเท่ากับซ่อนบั๊กไว้ในเครื่องมือตรวจ
- ลบฟีเจอร์ออกจากแผนที่เพราะทดสอบยาก
- แตก PR เป็นหลายชิ้นเล็ก ๆ เพราะคนรีวิวต้องเห็นภาพรวมของการเปลี่ยนในรอบเดียว


---

# skill: docker-sandbox

Use when a project needs a Docker sandbox for untrusted code

# docker-sandbox — ห้องทดลองต่อโปรเจกต์

> เครื่องเราเป็นคนสั่ง ห้องทดลองเป็นที่ลงมือ
> ข้างในติดตั้ง ลบ รันเซิร์ฟเวอร์ ทำฐานข้อมูลทดสอบได้เต็มที่ เพราะพังแล้วล้างทิ้งสร้างใหม่ได้ในคำสั่งเดียว
> ข้างนอก (เครื่องจริง · ระบบจริง · บัญชีจริง) แตะไม่ได้ เพราะไม่มีทางเข้าจากข้างใน

ใช้คู่กับ [`superuser`](../superuser/SKILL.md) — โปรเจกต์ที่มี `.sandbox/` งานติดตั้งและรันทุกอย่างทำในห้องนี้

ไม่ใช้เมื่อ: เขียน Dockerfile หรือ image สำหรับ deploy จริง → [`kubernetes-helm`](../kubernetes-helm/SKILL.md) เพราะห้องทดลองเป็นที่รันงานชั่วคราว ไม่ใช่ image ที่ขึ้น production

---

## 1 · หนึ่งโปรเจกต์ = หนึ่งห้อง

- **ห้องเดียวต่อโปรเจกต์** ชื่อ `sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่สร้าง>` (เช่น `sandbox-agent-sample-app-20260125`)
  - ตั้งชื่อครั้งเดียวตอน `up` แรก แล้วเก็บในไฟล์ `.sandbox/.name-<ชื่อโฟลเดอร์>` คำสั่งทีหลังอ่านชื่อจากไฟล์นี้ ชื่อจึงไม่เปลี่ยนตามวัน
  - prefix `sandbox-agent-` บอกว่า agent สร้างห้องนี้ ไม่ใช่คนตั้ง ส่วนวันที่สร้างเก็บซ้ำไว้ใน label `sqt.created`
  - ถ้าโปรเจกต์ต้องมีฐานข้อมูล cache หรือเบราว์เซอร์ ให้เพิ่มเป็น service ใน**ห้องเดียวกัน** (stack เดียว) ไม่แยกห้องใหม่
- **image ฐานใช้ร่วมกันทั้งเครื่อง** — `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) build ครั้งเดียว ส่วน image ของแต่ละโปรเจกต์เพิ่มแค่ชั้นบาง ๆ ที่โปรเจกต์นั้นต้องใช้ จึงไม่กินดิสก์ซ้ำ
- **ห้องที่หยุดอยู่ไม่กิน CPU และหน่วยความจำ** กินแค่ดิสก์ จบงานแล้วให้ `stop` และเลิกงานทั้งวันให้ `stop-all`
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกันที่ต้องแยกเครื่องจริง (งานลองหลายทางทั่วไปใช้ git worktree ต่อตัวตาม `parallel-split-and-merge` เร็วกว่า) แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — เพราะของที่ติดตั้งจะชนกัน โปรเจกต์หนึ่งพังแล้วลามไปอีกโปรเจกต์ และล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ (`sandbox.ps1 claude` ใช้ไม่ได้ในโหมดนี้) | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางที่ต้องแยกเครื่องจริง (ห้องละทาง) |

เพิ่ม `-Locked` ได้ทั้งสองแบบ — ปิดอินเทอร์เน็ตขาออก เหลือเฉพาะโฮสต์ใน `allowlist.txt` เหมาะกับงานที่รันโค้ดที่ยังไม่ไว้ใจ

---

## 3 · ตั้งห้องให้โปรเจกต์ (ครั้งแรก)

1. ตรวจว่า Docker Desktop รันอยู่ — `docker version` ต้องเห็นทั้ง Client และ Server ถ้าไม่เห็น ให้บอกผู้ใช้ให้เปิด Docker Desktop แล้วหยุดเฉพาะงานนี้
2. คัดลอกทุกไฟล์ใน `assets/` ของ skill นี้ไปที่ `<โปรเจกต์>/.sandbox/` (ที่ราก) แล้วประกาศ `.sandbox/` เป็นข้อยกเว้นของรากใน README ของโฟลเดอร์โค้ด ตาม `project-doc-set` ข้อ 1
3. ปรับ `Dockerfile` (ชั้นของโปรเจกต์)
   - ถ้าเป็น .NET ให้ตั้ง `INSTALL_DOTNET=1` แล้วเพิ่ม `apt-get install` ของที่โปรเจกต์ต้องใช้
   - **อย่าแก้ `base.Dockerfile`** ถ้าไม่จำเป็น เพราะทุกโปรเจกต์ใช้ร่วมกัน
   - ถ้าต้องมีฐานข้อมูลทดสอบ ให้เพิ่มเป็น service ใหม่ใน `compose.yaml` (ไม่เปิด port ออกนอก)
4. เพิ่ม `.sandbox/.mode-*` และ `.sandbox/.name-*` ใน `.gitignore`
5. เปิดห้อง — `.\.sandbox\sandbox.ps1 up` (หรือ `up -Isolated` · `up -Browser`) โปรเจกต์แรกของเครื่องต้อง build image ฐานก่อน ใช้เวลาราว 5–15 นาที ส่วนโปรเจกต์ถัดไปจะเร็วขึ้นมาก
6. **พิสูจน์ว่าใช้ได้** — `sandbox.ps1 exec "node -v && python3 --version && git status"` ถ้าโปรเจกต์มีคำสั่ง test ให้รันผ่าน `exec` 1 ครั้ง ส่วนโหมด `-Locked` ต้องเห็นบรรทัด `check passed`
7. ลงใน `docs/README.md` ของโปรเจกต์ — ชื่อห้อง (`sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่>`) · โหมด · port · คำสั่ง test ในห้อง

**ทดสอบจริงแล้ว** บน Windows + Docker Desktop 4.46 (2026-10-05, โปรเจกต์ `sample-app`) — build ห้องได้ · unit test ผ่าน 15/15 · e2e บน Chromium ผ่าน 14/14 ในห้อง

บั๊กที่เจอระหว่างทดสอบแก้ในสคริปต์แล้ว: PowerShell 5.1 กับ stderr · Playwright คนละรุ่นกับ image ฐาน · พอร์ตชน

ถ้าสคริปต์พังบนเครื่องอื่น ให้ใช้ playbook `bug-fix` กับตัวสคริปต์

**พอร์ต** — `up` หาพอร์ตว่างเอง เริ่มที่ 3000 แล้วบอกว่าได้พอร์ตไหน
- ในห้องตั้งตัวแปร `APP_PORT` และ `PORT` เป็นพอร์ตนั้น และ `HOST=0.0.0.0`
- แอปต้องฟังที่ `HOST` เพราะถ้าฟังแค่ `127.0.0.1` ในห้อง เครื่องจะเข้าไม่ถึง
- ฝั่งเครื่องยังเปิดแค่ `127.0.0.1` เหมือนเดิม จึงเข้าจากเครื่องที่ `http://127.0.0.1:<พอร์ต>`

**Playwright คนละรุ่น** — image ฐานมี Chromium รุ่นล่าสุด ถ้าโปรเจกต์ล็อก Playwright รุ่นอื่นไว้ ให้รัน `npx playwright install chromium` ในห้อง 1 ครั้งหลัง `npm ci` (ไม่ต้อง `--with-deps` เพราะ image มีให้แล้ว)

---

## 4 · ใช้ทุกวัน

| ต้องการ | คำสั่ง (รันที่รากโปรเจกต์บนเครื่อง) |
|---|---|
| รันคำสั่งในห้อง (agent ใช้อันนี้) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| เปิด shell ในห้อง | `.\.sandbox\sandbox.ps1 shell` |
| ให้ Claude Code ทำงานในห้องเต็มที่ (**isolated เท่านั้น**) | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้ · โหมด mount สคริปต์จะปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริง) |
| เอางานจากห้อง isolated ออกมา | `.\.sandbox\sandbox.ps1 sync` แล้วอ่าน patch ก่อน `git apply` |
| ห้องทั้งหมดในเครื่อง | `.\.sandbox\sandbox.ps1 list` |
| ล้างห้องให้สะอาด เริ่มใหม่ | `reset` แล้ว `up` |
| หยุดทุกห้องในเครื่อง คืนหน่วยความจำ | `.\.sandbox\sandbox.ps1 stop-all` |
| ห้องหลายห้องของโปรเจกต์เดียว | ใส่ `-Name <โปรเจกต์>-a1` ทุกคำสั่ง |

**กฎของ agent เมื่อโปรเจกต์มี `.sandbox/`**
- install · build · test · dev server · migration และสคริปต์ใด ๆ ให้รันผ่าน `sandbox.ps1 exec` ไม่รันบนเครื่อง
- skill ตรวจแอปของโปรเจกต์ (`app-verifier-setup`) รัน Playwright ในห้องแบบไม่มีหน้าจอ แล้วคัดภาพออกด้วย `docker compose cp` มาไว้ `_to_delete/`
- ถ้าห้องหยุดอยู่ ให้ `up` เองได้เลย (ย้อนได้) ถ้าห้องพังจนแก้ไม่ได้ ก็ `reset` เองได้ เพราะของในห้องไม่ใช่ของผู้ใช้ — **ยกเว้น** ห้อง isolated ที่ยังไม่ได้ `sync` ต้อง sync ก่อนแล้วค่อย reset

---

## 5 · เบราว์เซอร์เสมือนสำหรับทดสอบ

| แบบ | ใช้เมื่อ | วิธี |
|---|---|---|
| headless ในห้อง (ค่าเริ่ม) | test อัตโนมัติ · verify skill · ไม่ต้องมีใครดู | Playwright Chromium มากับ image ฐานแล้ว |
| **มองเห็นได้** (`up -Browser`) | อยากดู agent กดจริงทีละขั้น · ตรวจหน้าจอด้วยตา · อัดภาพ | เบราว์เซอร์จริงในคอนเทนเนอร์แยก ดูสดที่ `http://127.0.0.1:7900` และ Playwright ในห้องจะขับผ่าน `SELENIUM_REMOTE_URL` ให้เอง (Playwright เรียกความสามารถนี้ว่ายังทดลอง) |
| ให้ Claude Code ในห้องคุมเบราว์เซอร์เอง | งานสำรวจหน้าเว็บที่ยังไม่มีสคริปต์ | ติดตั้ง Playwright MCP server ในห้อง (`.mcp.json` ของโปรเจกต์) ให้ทำงานแบบ headless |

- เบราว์เซอร์ในห้องไม่มีบัญชี ไม่มีคุกกี้ ไม่มีรหัสผ่านของผู้ใช้ — ล็อกอินด้วยบัญชีทดสอบของโปรเจกต์เท่านั้น
- ภาพและวิดีโอจากการทดสอบ คัดออกมาที่ `_to_delete/` ด้วย `docker compose cp`
- Playwright MCP ในห้อง (ตัวอย่างจากงานสอน ยังไม่ใช่เกณฑ์): รันเป็น root ต้องใส่ `--no-sandbox` · ค่า `--browser` ต้องตรงกับ `--help` ของรุ่นที่ลง (`chromium` หรือ `chrome` ถ้าไม่ตรงจะหาเบราว์เซอร์ไม่เจอ) · ภาพ screenshot ที่ตั้งชื่อแบบ relative ไปลงที่ working directory ของ process ไม่ใช่ `--output-dir` ต้องย้ายเอง · คลิกแล้ว timeout "not visible/stable" อาจเป็นแท็บเบื้องหลัง ดู `e2e-testing-patterns`
- เบราว์เซอร์ของผู้ใช้บนเครื่อง (Chrome ที่ล็อกอินอยู่) ใช้กับเว็บจริงที่ต้องใช้บัญชีจริงเท่านั้น และทำตามกติกาของเครื่องมือนั้น ไม่ใช่ที่ทดสอบ

## 6 · CAPTCHA

- **ระบบของเราเอง** — CAPTCHA ไม่ควรขวางการทดสอบตั้งแต่ต้น
  - ใช้ค่าทดสอบ (test site key) ที่ผู้ให้บริการแจกไว้ ซึ่งผ่านทุกครั้ง reCAPTCHA · hCaptcha · Cloudflare Turnstile มีให้ทุกเจ้า ดูค่าได้จากเอกสารผู้ให้บริการ
  - หรือปิดด้วยค่าตั้งเฉพาะ environment ทดสอบ (`CAPTCHA_ENABLED=false`)
  - **ค่าทดสอบต้องไม่หลุดไปถึงระบบจริง** — ใส่ตัวตรวจตอนเริ่มระบบว่า production ห้ามใช้ test key (`config-and-secrets`)
- **เว็บของคนอื่น** — agent **ไม่แก้ CAPTCHA และไม่หาทางหลบ** (ไม่ใช้บริการรับแก้ ไม่ปลอมตัวเป็นคน) ถ้าเจอ CAPTCHA ให้หยุดขั้นนั้น บอกผู้ใช้ให้ทำเอง แล้วทำส่วนอื่นต่อ ถ้าต้องดึงข้อมูลจากเว็บนั้นบ่อย ให้หา API ทางการแทน
- เหตุผล — CAPTCHA คือเจ้าของเว็บบอกว่า "ห้ามบอท" การหลบจึงเท่ากับฝ่าข้อตกลงของเขา และทำให้ IP หรือบัญชีถูกแบน

## 7 · ในห้องทำได้เต็มที่

ติดตั้งโปรแกรม (`sudo apt-get` · `npm -g` · `pip`) · ลบไฟล์ในห้อง · รันเซิร์ฟเวอร์และฐานข้อมูลทดสอบ · ดาวน์โหลด dependency · commit ในสำเนาของโหมด isolated · ทดลองทำลายแล้วสร้างใหม่

เรื่องที่ยังอยู่ใน "รออนุมัติ" แม้อยู่ในห้อง (เตรียมไว้ ไม่ทำเอง) — เพราะผลออกไปนอกห้อง:
- ส่งข้อมูล อีเมล ข้อความ หรือเรียก API ที่มีผลจริงกับคนหรือระบบภายนอก
- ใช้บัญชีจริง ค่าลับจริง ฐานข้อมูลจริง
- push ขึ้น remote · deploy
- ในโหมด mount — ลบหรือเขียนทับไฟล์ของผู้ใช้ใน `/work` ที่ไม่ใช่ผลงานของรอบนี้ (มันคือโฟลเดอร์จริง)

---

## 8 · ห้ามแก้ compose ให้มีสิ่งเหล่านี้

| ห้าม | เพราะ |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | ห้องจะมองเห็นและแตะเครื่องจริงได้ |
| mount `/var/run/docker.sock` หรือ `//./pipe/docker_engine` | คุม Docker ได้ = คุมเครื่องได้ |
| mount โฟลเดอร์ home · `.ssh` · `.aws` · `.azure` · `.claude` ของเครื่อง · โปรไฟล์เบราว์เซอร์ · ไดรฟ์ทั้งลูก | ค่าลับหลุดได้ทันทีที่โค้ดในห้องอ่าน |
| เปิด port แบบ `"3000:3000"` (ทุกการ์ดแลน) | คนในเครือข่ายเดียวกันเข้าถึงได้ — ใช้ `127.0.0.1:` เสมอ |
| ใส่ค่าลับจริงใน `Dockerfile` หรือ image | ค่าลับติดไปกับ image ตลอด |
| ปิดหรือเพิ่ม limit `cpus` `mem_limit` `pids_limit` จนเครื่องค้าง | ห้องที่วนไม่จบจะกินเครื่องทั้งเครื่อง |
| mount ของจากเครื่องแบบเขียนได้ ทั้งที่ห้องแค่ต้องอ่าน (`ref/` · ข้อมูลตัวอย่าง · cache SDK ที่แชร์ · ซอร์สต้นทางของโหมด isolated) | โค้ดในห้องที่ถูกหลอกจะเขียนกลับเครื่องได้ — ใส่ `:ro` ทุก mount ที่ไม่ใช่ผลงานของรอบนี้ แล้วให้ห้องคัดลอกเข้าพื้นที่ของตัวเองถ้าต้องแก้ (แนวคิดจาก anthropics/claude-code devcontainer และ trailofbits/skills) |

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

`sandbox.ps1 claude` จึงรันได้เฉพาะโหมด isolated — โหมด mount สคริปต์ปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริงของผู้ใช้ (§7 ข้อสุดท้าย)

**ขีดจำกัดของ `-Locked`** — DNS ออกได้เฉพาะ resolver ที่ห้องได้รับ (ของ Docker) ไม่ใช่ DNS server ใดก็ได้ แต่ resolver นั้นยังส่งต่อคำถามออกนอก จึงยังแอบส่งข้อมูลผ่าน DNS (DNS tunnelling) ได้ งานที่ห้ามข้อมูลรั่วเด็ดขาดให้รันแบบไม่มีเครือข่ายเลย

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปจึงช้ากว่าไฟล์ใน volume ถ้า build หรือ test ช้ามาก ให้ใช้ `-Isolated` (ตรวจจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ จึงควรใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- ถ้ารัน `sandbox.ps1` ไม่ได้ ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- `parallel-attempts-pick-best` — ปกติผู้แข่งใช้ git worktree ต่อตัว · ใช้ห้อง isolated ต่อตัว (`-Name <โปรเจกต์>-a1` …) เฉพาะงานที่ต้องแยกเครื่องจริง
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `superuser` — เก็บกวาดห้องและ image เก่า


---

# skill: security-gate

Use when about to ship or merge code, as a security check

# security-gate — ประตูความปลอดภัยก่อนส่งงาน

> เครื่องมือสแกนหาเจอเร็วแต่แจ้งผิดเยอะ ส่วนคนตรวจเข้าใจบริบทแต่ช้า
> ประตูนี้ให้เครื่องหาก่อน แล้ว agent ยืนยันทุกข้อกับโค้ดจริง ก่อนจะถึงมือคน

ใช้ร่วมกับ [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md) ส่วนรายงานเชิงลึกให้ใช้ agent `security-engineer`

## ขั้นตอน

1. **รันในห้อง** (sandbox ของโปรเจกต์) — ถ้าโปรเจกต์มี `.sandbox/` ให้รันทุกคำสั่งผ่าน `sandbox.ps1 exec` ส่วนเครื่องมือที่ยังไม่มีให้ติดตั้งในห้องได้เลย ไม่ติดตั้งบนเครื่องผู้ใช้
2. **สแกน 3 ด้าน** (เลือกตามที่โปรเจกต์มี)

   | ด้าน | เครื่องมือแนะนำ | คำสั่งตัวอย่าง |
   |---|---|---|
   | ค่าลับหลุด (รวมประวัติ git) | gitleaks 8.19+ | ประวัติ git: `gitleaks git . --redact` · ไฟล์ที่ยังไม่ commit: `gitleaks dir . --redact` (`detect`/`protect` ถูก deprecate ตั้งแต่ v8.19.0 — ที่มา github.com/gitleaks/gitleaks/releases/tag/v8.19.0 · ตรวจ 22 ต.ค. 2569) |
   | dependency มีช่องโหว่ | ตัวที่มากับภาษา + trivy หรือ osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | โค้ดเขียนแบบเสี่ยง (static analysis) | semgrep | มีเน็ต: `semgrep scan --config p/default --metrics=off` · ห้อง `-Locked` หรือเข้า semgrep.dev ไม่ได้: `semgrep scan --config <skill นี้>/assets/semgrep-offline.yml --metrics=off` |
   | dependency ของ Dart / Flutter และ Gradle | osv-scanner (อ่าน `pubspec.lock` และ `gradle.lockfile`) | `osv-scanner scan source -r .` (ยังไม่ได้ตรวจบนเครื่องนี้) · ใช้ `flutter pub outdated` ดูของที่ค้างเวอร์ชัน · ถ้า Gradle ไม่มี lockfile ต้องเปิด `dependencyLocking` ก่อนถึงจะสแกนได้ |
   | Dockerfile · compose · IaC (ถ้ามี) | trivy | `trivy config .` ส่วนแอป Android ไม่มีส่วนนี้ ให้อ่าน `android/app/build.gradle*` ด้วยตาแทน (signingConfig ต้องไม่ฝังรหัสผ่าน และ release ต้องเปิด minify) |
   | แอป Android (ถ้ามี) | ตรวจด้วยตาตาม [`references/android.md`](references/android.md) ถ้าต้องการเชิงลึกให้ใช้ MobSF (Mobile Security Framework) | — |

   **รายการตรวจ Android** → [`references/android.md`](references/android.md)

   เก็บผลดิบใน `_to_delete/security/`
   - **ห้ามใช้ `--config auto` คู่กับ `--metrics=off`** — semgrep ไม่ยอมรัน (เจอจริงในโปรเจกต์ตัวอย่าง)
   - **ชุดกฎ semgrep เลือกตามภาษาที่เจอ ไม่ใช่ `p/default` อย่างเดียว** (แนวคิดจาก trailofbits/skills `semgrep` · CC-BY-SA เขียนใหม่ด้วยคำเรา) — ทุกโปรเจกต์: `p/security-audit` + `p/secrets` รันครั้งเดียวทั้ง repo · แล้วเพิ่มตามภาษา: `p/python` (+`p/django` หรือ `p/flask`) · `p/javascript` + `p/typescript` (+`p/react` · `p/nodejs`) · `p/csharp` · `p/dockerfile` · มีหลายภาษาใส่ `--config` หลายตัวในคำสั่งเดียวได้ · ชุดกฎไหนโหลดไม่ได้ (ไม่มีเน็ต · ชื่อผิด) ต้องขึ้นในรายงานว่าไม่ได้รัน ไม่ใช่หายเงียบ
   - ชุดออฟไลน์มี 6 กฎที่แทบไม่มีกรณีปลอดภัย (eval · HTML จากตัวแปร · shell จากตัวแปร · SQL ต่อสตริง · ค่าลับในโค้ด) และพิสูจน์แล้วว่าจับได้ครบในไฟล์ที่ตั้งใจเขียนผิด ถ้าเครื่องมือไหนรันไม่ได้ ให้เขียนในรายงานว่า `ยังไม่ได้ตรวจ` พร้อมเหตุผล
   - **semgrep รองรับ Dart น้อยมาก และกฎออฟไลน์เขียนไว้สำหรับเว็บกับ backend** ถ้า semgrep ไม่เจออะไรในโปรเจกต์ Flutter ก็ไม่ได้แปลว่าปลอดภัย รายงานต้องเขียนว่าโค้ด Dart `ยังไม่ได้ตรวจด้วย static analysis` แล้วพึ่ง `flutter analyze` กับการอ่านโค้ดแทน ห้ามสรุปว่า `ผ่าน` จากผลว่าง
3. **ยืนยันทุกข้อ** — เปิดโค้ดจริงดูว่าใช้ได้จริงไหม (เช่น ช่องโหว่อยู่ในฟังก์ชันที่โปรเจกต์ไม่ได้เรียก) แล้วติดป้าย `ยืนยันแล้ว` / `แจ้งผิด` / `ยังไม่ยืนยัน` พร้อมเหตุผล · `ยังไม่ยืนยัน` ไม่ติดระดับ และบอกว่าขาดหลักฐานอะไร · ลูกค้าขอตรวจลึกทั้งระบบ หรือเจอข้อที่ต้องไล่เส้นทางข้อมูลข้ามหลายไฟล์ → [`security-audit`](../security-audit/SKILL.md) (ผู้ยืนยันเป็นตัวใหม่ ไม่ใช่ตัวที่สแกน)
4. **จัดระดับและตัดสิน**

   | ระดับ | ทำอะไร |
   |---|---|
   | ค่าลับจริงหลุด | **หยุดทันที บอกผู้ใช้** ต้องเปลี่ยนค่าลับที่ผู้ให้บริการ เพราะลบจากไฟล์อย่างเดียวไม่พอ และ agent ไม่แก้ประวัติ git เอง |
   | critical · high ที่ยืนยันแล้ว | **ห้ามส่ง** จนกว่าจะแก้ หรือผู้ใช้ยอมรับความเสี่ยงเป็นลายลักษณ์อักษรใน `decision-log` |
   | medium | แก้ในรอบนี้ถ้าประเมินว่าใช้ไม่เกิน 1 ชั่วโมง (ค่าตั้งต้น ยังไม่ได้วัด · ปรับตามทีมได้) · เกินนั้นเปิดเป็นงานแยกเข้าคิว แล้วเรียงด้วย `decision-scoring` คำสั่ง `priority` แบบ `rice` (คนหรือระบบที่โดน × ผลกระทบ × ความมั่นใจ ÷ ชั่วโมงแก้) · ผลสูสีให้คนเลือก |
   | low · แจ้งผิด | บันทึกเหตุผล ไม่ต้องแก้ |

5. **แก้**
   - ช่องโหว่ใน dependency ให้อัปเดตเป็นเวอร์ชันที่แก้แล้ว แล้วรัน test
   - ช่องโหว่ในโค้ดให้ใช้ playbook `bug-fix` (หาต้นเหตุ + เขียน test ที่ล้มก่อนแก้ + ค้นจุดอื่นที่เขียนแบบเดียวกัน)
   - รูปแบบที่เจอซ้ำให้ส่งต่อ `repeated-mistakes-to-checks` ไปทำเป็นกฎ lint
6. **รายงาน** — `qa/security/<ปี-เดือน-วัน>-gate.md` ตาราง `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` พร้อมคำตัดสิน 1 บรรทัด (`ผ่าน` · `ผ่านหลังแก้` · `ไม่ผ่าน`) ห้ามคัดค่าลับลงรายงาน (ให้ใช้ผลแบบ `--redact`) แล้วรายงานสถานะด้วย `status-report` ประเภท `ตรวจ`
   - **ต้องมีหัวข้อ "ไม่ได้รัน"** ก่อนคำตัดสิน: เครื่องมือหรือชุดกฎที่ติดตั้งไม่ได้ · ออก exit code ไม่ใช่ 0 · ภาษาที่สแกนเนอร์ไม่รองรับ (เช่น Dart) · ไฟล์หรือโฟลเดอร์ที่ข้าม — ระบุชื่อและเหตุผลทีละรายการ · รายงานที่สแกนไม่ครบแต่เขียนเหมือนครบ แย่กว่าไม่สแกน · ถ้ามีรายการในหัวข้อนี้ คำตัดสิน `ผ่าน` ต้องต่อท้ายว่า `(ยกเว้นที่ไม่ได้รัน)`
   - ก่อนส่งมอบลูกค้า หรือสัญญาระบุ OWASP → กรอกรายงานรายข้อ A01–A10 ตาม [`references/owasp-top10.md`](references/owasp-top10.md) เพิ่มอีกไฟล์ `qa/security/<ปี-เดือน-วัน>-owasp.md` · ผลสแกนของ gate นี้ใช้เป็นหลักฐานข้อ A02 · A03 · A04 · A05 · A08

## เมื่อไรต้องรัน

- ทุกครั้งก่อน playbook `ship` และก่อนส่งมอบงานลูกค้า
- หลังเพิ่มหรืออัปเดต dependency — ผลสแกนมีรายการ ให้ทำตาม [`references/dependency-updates.md`](references/dependency-updates.md) (จัดกลุ่มตามความเสี่ยงจริง · ลำดับ patch → minor → major · พิสูจน์ · ลง CHANGELOG)
- สัญญาหรือข้อกำหนดความปลอดภัยระบุว่าเว็บแอปหรือ API ต้องผ่าน OWASP Top 10:2025 → อ่าน [`references/owasp-top10.md`](references/owasp-top10.md) (ตาราง A01–A10 ที่ต้องมีและพิสูจน์ด้วย · เกณฑ์ส่งมอบ · ข้อสัญญา [`owasp-contract-clause.md`](references/owasp-contract-clause.md) · วิธีตาม stack [`owasp-stack-checks.md`](references/owasp-stack-checks.md) · แม่แบบรายงาน [`assets/owasp-report.md`](assets/owasp-report.md))
- โปรเจกต์ที่ยังใช้งานอยู่ให้รันสัปดาห์ละครั้งตามรอบ (scheduled task) เพราะช่องโหว่ใหม่ถูกประกาศทุกวันแม้โค้ดไม่เปลี่ยน

## ไม่ใช่หน้าที่ของ skill นี้

- ทดสอบเจาะระบบจริงหรือระบบของคนอื่น เพราะ skill นี้ทำเฉพาะโค้ดและ environment ทดสอบของโปรเจกต์นี้
- รับรองว่าปลอดภัย 100% รายงานบอกแค่ว่าตรวจอะไร ด้วยอะไร และอะไรที่ยังไม่ได้ตรวจ
- รีวิวตรรกะและการออกแบบของ diff → `code-review-checklist` (ก่อน merge รันทั้งสองตัว)


## reference: android.md

# รายการตรวจ Android — ใช้กับ `security-gate` ข้อ 2

**รายการตรวจ Android** — ดู `AndroidManifest.xml` ที่รวมแล้ว (merged manifest) ไม่ใช่แค่ไฟล์ต้นฉบับ เพราะ plugin เติม permission ให้เอง · โฟลเดอร์เปลี่ยนตามเวอร์ชัน Android Gradle Plugin (AGP) (`merged_manifests/<variant>/` หรือ `merged_manifest/<variant>/process<Variant>MainManifest/` — ยังไม่ได้ตรวจ) ให้หาด้วย `find build -path '*merged_manifest*' -name AndroidManifest.xml` หลัง build release
- `android:exported` — ให้มีแค่ activity หลักที่เป็น `true` ส่วนตัวอื่นต้องมีเหตุผล
- `android:allowBackup` / `dataExtractionRules` — ตั้งชัดว่าข้อมูลไหนสำรองได้ ไม่ปล่อยค่าเริ่มต้น
- `android:debuggable` ต้องไม่มีใน release และ `usesCleartextTraffic` ต้องไม่เป็น `true`
- permission เท่าที่ใช้จริง — แอปออฟไลน์ต้องไม่มี `INTERNET` และต้องตรวจตัวที่ plugin เติมมาด้วย
- `key.properties` · `*.jks` · `*.keystore` ไม่อยู่ใน git (`git ls-files` แล้วค้น)


## reference: dependency-updates.md

# Updating vulnerable dependencies — an extension of `security-gate` step 5

Use when the dependency scan result has entries, or a new dependency was just added · ideas from wshobson `dependency-management` (MIT) and Trail of Bits `supply-chain-risk-auditor` (CC-BY-SA 4.0 — ideas only, rewritten in our own words)

## 1 · Scan — use the tool that comes with the language, then add one that reads lockfiles of every language

| stack | Command | Note |
|---|---|---|
| Node | `npm audit --omit=dev --json > _to_delete/security/npm-audit.json` | `--omit=dev` drops things that never reach production · never `npm audit fix --force` because it allows updates across a major version |
| Python | `pip-audit -r requirements.txt` or `pip-audit` inside the venv | For projects using `uv` / `poetry`, export the lockfile to requirements first |
| .NET | `dotnet list package --vulnerable --include-transitive` | Without `--include-transitive` you see only directly referenced ones |
| Every stack | `trivy fs --scanners vuln .` or `osv-scanner scan source -r .` | Reads the lockfiles of every language at once, use it to confirm the results above and to catch Dart · Go · Rust |

**Always commit the lockfile** (`package-lock.json` · `uv.lock` / `poetry.lock` · `packages.lock.json` · `pubspec.lock`) — with no lockfile each machine gets different versions, and the scanner does not know which version is really used

## 2 · Group by real risk, not by the scanner's severity label

Answer 3 questions per entry, then fill the table `| แพ็กเกจ | เวอร์ชัน | ช่องโหว่ | ใช้ถึงโค้ดที่เสี่ยงไหม | ตรง/ผ่านตัวอื่น | มีเวอร์ชันแก้ไหม | ทำอะไร |` (package · version · vulnerability · reaches the risky code · direct/via another · fixed version available · action)

| Question | Look at | Effect on the decision |
|---|---|---|
| Does our code call the vulnerable function, and can outside input reach it | `grep` the function name in the advisory · the path of input | Does not reach → may be downgraded, but the reason must be recorded, not closed silently |
| Referenced directly or through another package (transitive) | `npm ls <pkg>` · `pipdeptree -r -p <pkg>` · `dotnet nuget why <pkg>` | transitive → fix at the parent first, and if the parent has no new version yet, override in the lockfile and note that it must be removed when the parent is fixed |
| Is there a fixed version | The `fixed in` field of the advisory | None → find a replacement package, or close the input's entry path and record it as an accepted risk in `decision-log` |

Resulting summary: **fix now** (really reached + a fix exists) · **fix next round** (cannot be reached, but a fix exists) · **accept the risk temporarily** (no fix — the user must see it and agree)

## 3 · Update order — small first, split the large ones out so they are visible

1. All **patch** updates in one round (1.2.3 → 1.2.9) — by the semver contract they do not change behaviour, but you still must run tests
2. **minor** may be combined if in the same group (for example the `@angular/*` set together) · read the release notes for the word deprecated
3. **major — 1 PR per 1 package**: read the migration guide first, change the code accordingly, then run the whole test set · never bundle 2 majors in one PR, because when it breaks you will not know which one
4. A package nobody maintains any more (no release over 2 years · open security issues) → open a separate task to find a replacement, do not hide it inside an update PR

Automatic route: turn on **Renovate** or **Dependabot** to file PRs in the order above by themselves (group patch+minor automatically · major in its own PR · set the day of the week) — a person still must read the release notes and merge, and never auto-merge a major

## 4 · Prove it before closing the entry

- The whole test set is green and the build passes from a clean machine with the committed lockfile
- **Walk the vulnerability's original path again** — if the advisory says input of form X makes it break, really send X in (in a sandbox) and see that it does not break · write it as a test if you can, so it does not regress when someone downgrades
- Re-run the scanner of item 1, and that entry must be gone, not merely have its version changed in the file

## 5 · Record

- `CHANGELOG.md` under the heading Security: package · from → to · vulnerability ID (CVE or GHSA) · 1 line on whether we reach that vulnerability
- Entries with an accepted risk or an override in the lockfile → `decision-log` with the date to come back and look
- That round's gate report (`qa/security/<วัน>-gate.md`) points to the CHANGELOG instead of writing it again


## reference: owasp-contract-clause.md

# ข้อกำหนด OWASP Top 10:2025 ในสัญญาและ SRS

ร่างนี้ใช้เป็นจุดเริ่ม ไม่ใช่คำแนะนำทางกฎหมาย · สัญญาจริงให้ `legal-compliance-officer` หรือทนายของผู้ว่าจ้างตรวจ · ร่างสัญญาภาษาไทยทั้งฉบับใช้ `e-commerce:doc-contract-th`

## ทำไมต้องเขียนให้วัดได้

"ระบบต้องปลอดภัยตาม OWASP" วัดไม่ได้ แล้วจะเถียงกันตอนส่งมอบ · ให้เขียนเป็น **เกณฑ์รับงาน** ที่ตรวจได้ทีละข้อ และบอกขอบเขตที่ไม่รวม

## ร่างข้อกำหนด (ภาษาไทย)

> **ข้อ X ความปลอดภัยของระบบ**
>
> X.1 ผู้รับจ้างจะพัฒนาระบบโดยมีมาตรการรองรับความเสี่ยงทั้ง 10 ข้อของ Open Worldwide Application Security Project (OWASP) Top 10 ฉบับปี 2025 (A01 ถึง A10)
>
> X.2 ก่อนส่งมอบแต่ละงวด ผู้รับจ้างจะส่งรายงานผลการตรวจ OWASP Top 10:2025 ซึ่งระบุ สำหรับแต่ละข้อ (ก) มาตรการที่ใช้ (ข) วิธีตรวจและเครื่องมือที่ใช้ (ค) หลักฐานผลการตรวจ และ (ง) สถานะ ผ่าน · ผ่านโดยการตรวจเอกสารหรือการตั้งค่าพร้อมระบุไฟล์ที่ตรวจ (สำหรับข้อที่ทดสอบอัตโนมัติไม่ได้) · ไม่ผ่าน · ไม่เกี่ยวข้องพร้อมเหตุผล · ยอมรับความเสี่ยงตามข้อ X.4 · ยังไม่ได้ตรวจพร้อมเหตุผล
>
> X.3 งวดงานจะถือว่าผ่านเกณฑ์ด้านความปลอดภัยเมื่อ (ก) ไม่มีข้อใดมีสถานะไม่ผ่าน (ข) ไม่มีข้อใดมีสถานะยังไม่ได้ตรวจ และ (ค) ไม่มีช่องโหว่ระดับวิกฤต (Critical) หรือสูง (High) ที่ยืนยันแล้วค้างอยู่ในโค้ดหรือไลบรารีที่ใช้ ณ วันส่งมอบ โดยวัดระดับตามคะแนน Common Vulnerability Scoring System (CVSS) รุ่น 3.1 ขึ้นไป ที่เครื่องมือตรวจในภาคผนวกรายงาน · ช่องโหว่ที่ยังไม่มีเวอร์ชันแก้ไขจากผู้พัฒนาไลบรารี ผู้รับจ้างจะแจ้งพร้อมมาตรการบรรเทา แล้วให้ใช้ข้อ X.4
>
> X.4 ข้อใดที่ผู้ว่าจ้างตกลงยอมรับความเสี่ยง ให้บันทึกเป็นลายลักษณ์อักษร พร้อมชื่อผู้อนุมัติและวันที่
>
> X.5 ขอบเขตนี้ไม่รวม (ก) การทดสอบเจาะระบบ (penetration test) โดยบุคคลภายนอก เว้นแต่ตกลงไว้ในภาคผนวก (ข) โครงสร้างพื้นฐานและเซิร์ฟเวอร์ที่ผู้ว่าจ้างจัดหาและดูแลเอง (ค) ช่องโหว่ที่ประกาศหลังวันส่งมอบ ซึ่งให้เป็นไปตามข้อตกลงการดูแลรักษาระบบ (ถ้ามี)
>
> X.6 การตรวจตามข้อนี้ไม่ใช่การรับรองว่าระบบปลอดภัยโดยสมบูรณ์

## ร่างใน SRS — หมวดความต้องการที่ไม่ใช่ฟังก์ชัน ด้านความปลอดภัย (Non-Functional Requirement (NFR))

| รหัส | ความต้องการ | วิธีตรวจรับ |
|---|---|---|
| NFR-SEC-01 | ระบบรองรับ OWASP Top 10:2025 ครบ A01–A10 | รายงานผลการตรวจตามข้อ X.2 ผ่านเกณฑ์ข้อ X.3 |
| NFR-SEC-02 | ทุก endpoint ตรวจสิทธิ์ฝั่ง server และผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตน | ชุด test ด้านสิทธิ์ (A01) ผ่านทั้งหมด |
| NFR-SEC-03 | ไม่มี dependency ที่มีช่องโหว่ระดับ critical หรือ high (ตาม CVSS) ณ วันส่งมอบ ยกเว้นตามข้อ X.3 | ผลสแกน dependency ในภาคผนวกรายงาน |
| NFR-SEC-04 | admin และธุรกรรมเงินใช้การยืนยันตัวตนหลายชั้น (MFA) | ชุด test ด้าน login (A07) |
| NFR-SEC-05 | เหตุการณ์ความปลอดภัยมี log และแจ้งเตือน | ชุด test ด้าน log (A09) + ตัวอย่าง log |

เพิ่มหรือตัดแถวตามระบบ · ทุกแถวต้องมี "วิธีตรวจรับ" ที่ทำได้จริง


## reference: owasp-stack-checks.md

# OWASP Top 10:2025 ตาม stack ที่ทีมใช้

เปิดไฟล์นี้ตอนเขียนโค้ดและตอนกรอกรายงาน · แต่ละข้อบอก "ใช้อะไร" และ "อย่าทำ" · ค่าเริ่มของ framework ที่ปลอดภัยอยู่แล้ว ให้ใช้ตามนั้น ไม่เขียนเอง

- [.NET / ASP.NET Core](#net--aspnet-core)
- [TypeScript · Node · Angular](#typescript--node--angular)
- [Python (FastAPI · Django · Flask)](#python-fastapi--django--flask)
- [SQL (SQL Server · PostgreSQL · MySQL)](#sql-sql-server--postgresql--mysql)
- [เครื่องมือที่ใช้พิสูจน์](#เครื่องมือที่ใช้พิสูจน์)

---

## .NET / ASP.NET Core

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | `FallbackPolicy` = ต้อง login ทุก endpoint แล้วเปิดเฉพาะที่ตั้งใจด้วย `[AllowAnonymous]` · ตรวจเจ้าของ record ด้วย `IAuthorizationService` + resource-based policy · ASP.NET MVC แบบเก่าใช้ `[Authorize]` ระดับ controller + filter กลาง · antiforgery token ทุก form (`[ValidateAntiForgeryToken]` หรือ `AutoValidateAntiforgeryTokenAttribute` ทั้งแอป) · รับ input ผ่าน ViewModel หรือ DTO ไม่ bind entity ตรง | ซ่อนปุ่มใน view แล้วถือว่าคุมสิทธิ์แล้ว · ใช้ id จาก URL ค้น DB โดยไม่กรองด้วย user |
| A02 | `app.UseExceptionHandler` + `UseHsts` ใน production · `customErrors mode="RemoteOnly"` (MVC เก่า) · ลบ header `Server` · `X-Powered-By` | เปิด `UseDeveloperExceptionPage` บน production · เก็บ connection string ใน `appsettings.json` ที่ commit |
| A03 | `dotnet list package --vulnerable --include-transitive` · `Directory.Packages.props` คุมเวอร์ชันที่เดียว · SBOM: `dotnet CycloneDX` | ใช้แพ็กเกจที่ไม่มีคนดูแลแล้ว (ดูวันออกล่าสุด) |
| A04 | ASP.NET Core Identity (PBKDF2) หรือ `Rfc2898DeriveBytes.Pbkdf2` · Data Protection API สำหรับค่าที่ต้องถอดกลับ · ค่าลับใน User Secrets หรือ Key Vault | `MD5` · `SHA1` · `DES` · เขียน crypto เอง |
| A05 | EF Core LINQ · `FromSqlInterpolated` · Dapper พร้อม parameter · Razor encode HTML ให้เอง | `FromSqlRaw` ต่อสตริง · `Html.Raw` กับข้อมูลผู้ใช้ · `Process.Start` กับ input |
| A07 | Identity: `Lockout.MaxFailedAccessAttempts` + `PasswordSignInAsync(..., lockoutOnFailure: true)` (หน้า Login ที่ scaffold มาตั้งเป็น false) · cookie `HttpOnly` `Secure` `SameSite` · JWT: ตั้ง `ValidateIssuer` `ValidateAudience` `ValidateLifetime` `ValidateIssuerSigningKey` = true | `ValidateLifetime = false` · รับ algorithm `none` |
| A08 | `System.Text.Json` · webhook ตรวจลายเซ็น Hash-based Message Authentication Code (HMAC) ด้วย `CryptographicOperations.FixedTimeEquals` | `BinaryFormatter` · `TypeNameHandling.All` ของ Newtonsoft |
| A09 | `ILogger` แบบ structured (Serilog) · log ผล login · ถูกปฏิเสธสิทธิ์ · ตัดค่าลับด้วย destructuring policy | log ทั้ง request body ที่มีรหัสผ่าน |
| A10 | ตัวจับกลาง `IExceptionHandler` (.NET 8 ขึ้นไป · ลงทะเบียน `AddExceptionHandler<T>()` + `AddProblemDetails()` **และ** ต้องมี `app.UseExceptionHandler()` ใน pipeline ไม่งั้นตัวจับไม่ทำงาน) คืน `ProblemDetails` · .NET เก่ากว่าใช้ `UseExceptionHandler` กับ lambda หรือ path · `TransactionScope` หรือ `BeginTransaction` ครอบงานหลายขั้น · `CancellationToken` + timeout ของ `HttpClient` | `catch { }` ว่าง · `catch` แล้วคืน `true` จากตัวตรวจสิทธิ์ |

## TypeScript · Node · Angular

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | middleware ตรวจสิทธิ์ตัวเดียวที่ router ระดับบน (ปฏิเสธเป็นค่าเริ่ม) · query กรองด้วย `userId` ของ session ทุกครั้ง · Angular route guard ใช้แค่ซ่อนหน้า ส่วนสิทธิ์จริงตรวจที่ API · SSRF: allowlist host ก่อน `fetch` URL ที่ผู้ใช้ส่ง · CSRF token เมื่อใช้ cookie session · ตรวจ body ด้วย schema (zod) แล้วหยิบเฉพาะฟิลด์ที่อนุญาต | เชื่อ `role` ที่ client ส่งมา · `Object.assign(entity, req.body)` · `cors({ origin: true, credentials: true })` |
| A02 | `helmet()` · `NODE_ENV=production` · ปิด source map ใน production build · Express `app.disable("x-powered-by")` | ส่ง `err.stack` กลับ client |
| A03 | `npm ci` + `package-lock.json` · `npm audit --omit=dev` · SBOM: `npx @cyclonedx/cyclonedx-npm` · ตรวจ `postinstall` ของแพ็กเกจใหม่ | `npm install` แพ็กเกจที่ชื่อคล้ายของดัง (typosquat) โดยไม่ดูผู้ดูแล |
| A04 | `argon2` หรือ `bcrypt` · `crypto.randomBytes` · `crypto.timingSafeEqual` | `Math.random()` ทำ token · `crypto.createHash("md5")` กับรหัสผ่าน |
| A05 | ORM (Prisma · TypeORM) หรือ parameter `$1` · Angular escape ให้เอง · `execFile` พร้อม argument เป็น array | `innerHTML` · `bypassSecurityTrustHtml` กับข้อมูลผู้ใช้ · `eval` · `exec` ต่อสตริง · `new Function` |
| A07 | `express-rate-limit` ที่ `/login` · cookie `httpOnly` `secure` `sameSite` · JWT: `jwt.verify(token, key, { algorithms: ["RS256"], issuer, audience })` (ระบุ algorithm ที่ใช้จริงตายตัว) | เก็บ token ใน `localStorage` ของระบบที่มีข้อมูลอ่อนไหว · `jwt.decode` แทน `verify` |
| A08 | ตรวจลายเซ็น webhook ก่อน `JSON.parse` · Subresource Integrity (SRI) กับ script จาก CDN | `node-serialize` · โหลด script จาก CDN โดยไม่มี `integrity` |
| A09 | pino หรือ winston แบบ JSON · `redact: ["req.headers.authorization", "*.password"]` | `console.log(req.body)` |
| A10 | Express error middleware ตัวสุดท้าย · `process.on("unhandledRejection")` log แล้วปิดอย่างเป็นระเบียบ · transaction ของ ORM · `AbortSignal.timeout()` กับ `fetch` | `.catch(() => {})` · promise ที่ไม่มีใคร await |

## Python (FastAPI · Django · Flask)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | FastAPI `Depends(current_user)` ระดับ router · Django `LoginRequiredMixin` + `get_object_or_404(Model, pk=..., owner=request.user)` · SSRF: allowlist host ก่อน `httpx.get` · Django CSRF middleware เปิดไว้ · รับ input ด้วย Pydantic model หรือ Django `ModelForm(fields=[...])` | `Model.objects.get(pk=id)` โดยไม่กรองเจ้าของ · `fields = "__all__"` · `@csrf_exempt` ทั้ง view โดยไม่มีเหตุผล |
| A02 | Django `DEBUG=False` · `SECURE_*` settings · `python manage.py check --deploy` · FastAPI ปิด `/docs` บน production ถ้าไม่ได้ตั้งใจเปิด | `DEBUG=True` · `ALLOWED_HOSTS=["*"]` |
| A03 | lockfile (`uv.lock` · `poetry.lock` · `requirements.txt` ที่ pin เวอร์ชัน + `--require-hashes`) · `pip-audit` · SBOM: `cyclonedx-py environment` (หรือ `requirements` · `poetry`) | `pip install` จาก URL ที่ไม่รู้จัก |
| A04 | `argon2-cffi` · Django password hasher ค่าเริ่ม · `secrets.token_urlsafe` · `hmac.compare_digest` | `hashlib.md5(password)` · `random` ทำ token |
| A05 | ORM หรือ `cursor.execute(sql, params)` · Jinja2 `autoescape=True` · `subprocess.run([...])` แบบ list | f-string ใน SQL · `shell=True` กับ input · `eval` |
| A07 | `slowapi` หรือ django-axes กัน login รัว · PyJWT: `jwt.decode(token, key, algorithms=["RS256"], audience=..., issuer=...)` (ระบุ algorithm ที่ใช้จริงตายตัว) | `jwt.decode(..., options={"verify_signature": False})` |
| A08 | ตรวจลายเซ็น webhook ด้วย `hmac.compare_digest` · `yaml.safe_load` · `json` | `pickle.loads` · `yaml.load` กับข้อมูลภายนอก |
| A09 | `logging` แบบ structured (structlog) · filter ตัดค่าลับ | log `request.headers` ทั้งก้อน |
| A10 | FastAPI `@app.exception_handler(Exception)` · Django `handler500` · `with transaction.atomic():` · timeout ทุกการเรียก `httpx` | `except Exception: pass` · ตัวตรวจสิทธิ์ที่ `except` แล้ว `return True` |

## SQL (SQL Server · PostgreSQL · MySQL)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | user ของแอปมีสิทธิ์เท่าที่ใช้ (ไม่ใช่ `sa` · `postgres` · `root`) · แยก user อ่านอย่างเดียวสำหรับรายงาน · Row-Level Security (RLS) ของ PostgreSQL หรือ SQL Server สำหรับระบบหลายลูกค้า (multi-tenant) | ให้แอปใช้ user เจ้าของ database |
| A02 | ปิด port DB จากภายนอก · บังคับ TLS ของการเชื่อมต่อ · ปิด `xp_cmdshell` | เปิด DB ออก internet |
| A04 | Transparent Data Encryption (TDE) หรือเข้ารหัสระดับดิสก์ · คอลัมน์อ่อนไหวเข้ารหัสระดับแอป หรือ Always Encrypted · backup เข้ารหัส | เก็บเลขบัตรประชาชน · เลขบัตรเครดิตเป็นข้อความเปล่า |
| A05 | stored procedure หรือ query ที่รับ parameter · ถ้าต้องสร้าง SQL แบบ dynamic ใช้ `sp_executesql` พร้อม parameter และ `QUOTENAME` กับชื่อ object | `EXEC('... ' + @input)` · ต่อชื่อตารางจาก input |
| A09 | audit ตารางเงินและสิทธิ์ (trigger หรือ temporal table) · log login ล้มของ DB | ปิด audit เพื่อให้เร็ว |
| A10 | `BEGIN TRY ... BEGIN CATCH ... ROLLBACK` · `SET XACT_ABORT ON` · migration รันซ้ำได้ (`IF NOT EXISTS`) | migration ที่ล้มกลางทางแล้วทิ้งตารางครึ่ง ๆ |

## เครื่องมือที่ใช้พิสูจน์

| ใช้ทำอะไร | เครื่องมือ | ครอบข้อ |
|---|---|---|
| ค่าลับ · dependency · โค้ดเสี่ยง · ไฟล์ตั้งค่าโครงสร้างพื้นฐาน (Infrastructure as Code (IaC)) | ตาม [`security-gate`](../../security-gate/SKILL.md) (gitleaks · npm audit · pip-audit · dotnet · osv-scanner · trivy · semgrep) | A02 · A03 · A04 · A05 · A08 |
| semgrep ชุดเฉพาะ OWASP | `semgrep scan --config p/owasp-top-ten --metrics=off` (ต้องมีเน็ต) · ออฟไลน์ใช้ชุดของ `security-gate` | A01 · A04 · A05 · A08 |
| สแกนแอปที่รันอยู่ (header · cookie · error page) | OWASP ZAP (Zed Attack Proxy) baseline กับ environment ทดสอบของโปรเจกต์เท่านั้น: `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t <URL ทดสอบ>` | A02 · A05 · A07 |
| SBOM | CycloneDX ตามภาษา (ข้างบน) เก็บที่ `qa/security/sbom/` | A03 |
| test สิทธิ์ · login · error · webhook | integration test ของโปรเจกต์ ตั้งชื่อขึ้นต้นด้วยรหัสข้อ (`A01_...`) | A01 · A06 · A07 · A08 · A09 · A10 |

- ZAP ยิงจริง → ใช้กับ environment ทดสอบที่ทีม deploy เองเท่านั้น ห้ามยิง production หรือระบบของคนอื่นโดยไม่มีหนังสืออนุญาต
- เครื่องมือไหนรันไม่ได้ ให้เขียน `ยังไม่ได้ตรวจ` พร้อมเหตุผลในรายงาน ห้ามสรุปว่าผ่านจากผลว่าง


## reference: owasp-top10.md

# OWASP Top 10:2025 — a delivered system must pass an item-by-item checklist

An extension of [`SKILL.md`](../SKILL.md) · use when building or delivering a web app or API whose contract or security requirement (NFR) names OWASP Top 10:2025

> A web-app contract may say "must pass OWASP Top 10:2025", but nobody can issue a certificate like that
> What can really be delivered is **a report that says, item by item A01–A10, what controls it, what checks it, and what evidence there is**
> This file makes every system the team builds have that report, from design to delivery

Open Worldwide Application Security Project (OWASP) Top 10:2025 is the list of the 10 most common and most serious web-app risks, in its latest edition (original: owasp.org/Top10/2025)

Use together with: [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) (writing code) · [`security-gate`](../SKILL.md) (scan before sending) · the command `/software-development:threat-model` (design) · agent `security-engineer` (in-depth report)

---

## 1 · The 10 items, and what the system must have

Each item has 3 parts → **must have** (what code and configuration must do) · **prove with** (a test or tool that can really run) · **business-owner wording** (for explaining to the customer and in the report)

| Item | Risk | Business-owner wording (ภาษาเจ้าของกิจการ) | Must have | Prove with |
|---|---|---|---|---|
| A01 | Broken Access Control | ลูกค้าคนหนึ่งเห็นข้อมูลของอีกคนได้ | Check permissions server-side on every endpoint · deny by default · check ownership of the record every time one is read or changed by id · stop the server from fetching internal URLs (Server-Side Request Forgery (SSRF)) with an allowlist · Cross-Origin Resource Sharing (CORS) never `*` together with cookies · a system using cookie sessions must have a token against forged requests on the user's behalf (Cross-Site Request Forgery (CSRF)) · accept input through a Data Transfer Object (DTO) or an allowed-field list, never bind a whole object (stops a client sending `role` · `isAdmin` itself) | integration test per endpoint: not logged in → 401 · wrong role → 403 · another person's id → 403 or 404 · POST with no CSRF token → 403 (cookie-based systems) · sending an extra `role` field → the value in the database does not change |
| A02 | Security Misconfiguration | ตั้งค่าเซิร์ฟเวอร์หละหลวม เปิดหน้า admin ทิ้งไว้ | Configure by the same script in every environment, differing only in secrets · turn off debug · stack traces · directory listing · sample admin pages · add security headers (Content Security Policy (CSP) including `frame-ancestors` · HTTP Strict Transport Security (HSTS) · X-Content-Type-Options) · no default passwords · cloud storage not public | Scan headers (OWASP ZAP (Zed Attack Proxy) baseline) · `trivy config .` · a test that production returns errors with no stack trace |
| A03 | Software Supply Chain Failures | ใช้ไลบรารีเก่า หรือมีช่องโหว่ | Lockfiles for every language · a list of software components (Software Bill of Materials (SBOM)) · no dependency with a critical or high vulnerability · cut what is not used · pull only from official registries | `security-gate` dependency side (npm audit · pip-audit · `dotnet list package --vulnerable` · osv-scanner) · SBOM in CycloneDX form |
| A04 | Cryptographic Failures | ไม่เข้ารหัสรหัสผ่านและข้อมูลสำคัญ | Transport Layer Security (TLS) 1.2 or higher everywhere + HSTS · passwords use Argon2id · bcrypt · PBKDF2 (never MD5 · SHA-1 · plain SHA-256) · sensitive data encrypted at rest · secrets outside code · store only the data you use | semgrep (crypto rules) · a test that passwords in the DB are not the original text · check the TLS of the deployed server |
| A05 | Injection | กรอกคำสั่งในช่องค้นหา แล้วดึงฐานข้อมูลได้ | SQL only through parameters or an ORM · never concatenate strings into shell commands · HTML-escape on output (stops Cross-Site Scripting (XSS)) · validate input at the system boundary | semgrep · a test sending `' OR 1=1--` · `<script>` · `; rm` which must not take effect |
| A06 | Insecure Design | ออกแบบผิดตั้งแต่ต้น เช่น ใช้คูปองซ้ำได้ | threat model of login · permissions · money · personal data before writing · business rules enforced at the server (cannot reuse · balance cannot go negative · repeating does not charge twice) · rate limit · file upload: check the type from the file contents, limit size, store outside the web root, rename ([`file-upload-and-storage`](../../file-upload-and-storage/SKILL.md)) | The threat model document · a test uploading a `.php` · `.exe` renamed to `.jpg` → rejected · an abuse-case test, at least 1 per business rule about money or permissions |
| A07 | Authentication Failures | เดารหัสได้ไม่จำกัด ไม่มี MFA | Limit failed logins · multiple-factor authentication (Multi-Factor Authentication (MFA)) for admin and money work · passwords at least 15 characters (8 if MFA is present per National Institute of Standards and Technology (NIST) Special Publication (SP) 800-63B-4) and check against lists of leaked passwords · a failed-login message does not reveal whether the user exists · session id random from the server and rotated after login · JSON Web Token (JWT) checks `iss` `aud` `exp` and the algorithm | test: N failed logins → delayed or locked · expired token → 401 · the failure message is the same for existing and non-existing users |
| A08 | Software or Data Integrity Failures | อัปเดตหรือข้อมูลถูกแก้ระหว่างทาง โดยไม่ตรวจ | Never deserialize outside data into an object that can run code · webhooks verify signatures · update files verify a checksum or signature · the automatic delivery pipeline (CI/CD) uses least privilege and has no secrets in logs · prices and amounts are computed at the server and values from the client are not trusted | test a webhook with a wrong signature → rejected · test sending a fake price from the client → the server's price is used |
| A09 | Security Logging and Alerting Failures | ถูกเจาะแล้วไม่มีใครรู้ ไม่มี log | Log successful and failed logins · permission denials · failed input validation · admin actions · money changes — with time · who · what · result · no passwords, tokens, or ID-card numbers in logs · an alert when logins fail in bursts | a test that a failed login leaves a log line · searching the logs for secrets must find none · see `audit-trail` · `logging-standards` |
| A10 | Mishandling of Exceptional Conditions | ระบบล่มแล้วแสดงข้อมูลภายใน หรือเปิดช่องให้ผ่าน | Every error is caught, with a global handler as the last gate · on failure **close**, not open (permission check errors → deny) · a transaction that does not complete must roll back · error messages shown to users carry no stack trace or SQL · limit quota · timeout | test: make the DB or an external service fail mid-operation → a normal error, and data is not left half done · permission check throws → 403, not let through |

**Items that do not apply**: write `ไม่เกี่ยว` (not applicable) with a 1-line reason, for example A07 in a system with no login at all · never leave blank

How to write it for the team's stacks (.NET · TypeScript/Node/Angular · Python · SQL) → [`owasp-stack-checks.md`](owasp-stack-checks.md)

---

## 2 · When to use it in the job

| Phase | Do | Get |
|---|---|---|
| Taking the job · writing the contract | Put in the requirements and acceptance criteria per [`owasp-contract-clause.md`](owasp-contract-clause.md) · put in the requirements document (Software Requirements Specification (SRS)) security category (`srs-writing`) | Customer and team agree on what "pass" means |
| Design | threat model of login · permissions · money · personal data (A01 · A06 · A07) · state roles and permissions as a table | `docs/security/threat-model.md` |
| Writing code | Follow the "must have" column and [`owasp-stack-checks.md`](owasp-stack-checks.md) · make every item that can be so a reusable shared piece (one permission checker · one error handler · one logger) | Code where the safe way is the easiest way |
| test | Write tests per the "prove with" column, put them in the normal test folder, named starting with the item code, such as `A01_other_user_order_returns_404` | Evidence that can be re-run every time |
| Before delivery | Run `security-gate`, then fill [`assets/owasp-report.md` (in the security-gate folder)](../assets/owasp-report.md) item by item | `qa/security/<ปี-เดือน-วัน>-owasp.md` |

---

## 3 · The report before delivery — rules

- 1 row per item, all of A01–A10 · status uses only these 6 values

  | Status | Deliverable | Write when |
  |---|---|---|
  | `ผ่าน` (pass) | Yes | There is evidence that can be run — test name + run result · tool name + result file |
  | `ผ่าน (ตรวจด้วยตา)` (pass, checked by eye) | Yes, if it says which file was checked and that item truly cannot have a test written | For example a server configuration the team did not deploy a test for |
  | `ไม่เกี่ยว — <เหตุผล>` (not applicable — <reason>) | Yes | The system has no such part at all |
  | `ยอมรับความเสี่ยง — <วันที่ · ใคร>` (risk accepted — <date · who>) | Yes | The customer approved in writing, recorded in `decision-log` |
  | `ไม่ผ่าน` (fail) | No | A confirmed vulnerability was found |
  | `ยังไม่ได้ตรวจ — <เหตุผล>` (not yet checked — <reason>) | No | The tool cannot run or it has not been done |

- **Deliverable when** there is no `ไม่ผ่าน` item and no `ยังไม่ได้ตรวจ` item
- **An item that is `ไม่ผ่าน` is written as a finding block, one per entry** (template in `assets/owasp-report.md` (in the security-gate folder)) — ID `F-01` · file:line · item A0x + the Application Security Verification Standard (ASVS) level it must reach (L1 every system · L2 has personal data or transactions · L3 money, health, critical infrastructure) · impact in business-owner wording · fix · evidence used to confirm (command · test · image) · 1 block per vulnerability, never several spots in one row (idea from agamm/claude-code-owasp (MIT))
- Always include a section **scope not checked**, for example penetration testing by outsiders · the customer's servers the team did not deploy · libraries with no vulnerability data
- Never write "100% secure" or "OWASP certified" — OWASP issues no certificates · if it can be delivered, write "passes the OWASP Top 10:2025 criteria per the checklist in this report"
- The totals count all 6 statuses separately, for example `ผ่าน 7 · ผ่าน (ตรวจด้วยตา) 1 · ไม่เกี่ยว 2 · ยอมรับความเสี่ยง 0 · ไม่ผ่าน 0 · ยังไม่ได้ตรวจ 0`
- Summarise the status into `docs/BUILD-PLAN.md` with `status-report` of type `ตรวจ` (check) (who did it · who checked · check result `ผ่าน — ผ่าน 8 · ไม่เกี่ยว 2` or `ไม่ผ่าน — A01 · A07`)

---

## 4 · Who does what

| Part | agent |
|---|---|
| Contract and SRS requirements | `business-analyst` · legal clauses → `legal-compliance-officer` |
| threat model · permissions table · design review | `security-engineer` |
| Code and tests per the "must have" · "prove with" columns | `developer` (and the agent for the stack) |
| Scan and fill the report | `security-engineer` through `security-gate` |
| Check the report before sending to the customer | a new `reviewer` — every row marked `ผ่าน` (pass) must have evidence that can really be opened |

---

## 5 · Not this file's job

- Real penetration testing, or testing someone else's system — this file checks only this project's code and test environment
- Other standards, such as OWASP API Security Top 10 · Application Security Verification Standard (ASVS) · Payment Card Industry Data Security Standard (PCI-DSS) · the Personal Data Protection Act (PDPA) — use the skill for that topic (`fintech-payments` · `pdpa-compliance`), but this report can be used as a common base
- Mobile apps — use OWASP Mobile Top 10 together with [`android.md`](android.md) · the backend of a mobile app still uses this file


---

# skill: adversarial-review-panel

Use for an adversarial review or stress test before shipping

# adversarial-review-panel — คณะรีวิวที่ตั้งใจหาเรื่อง

> ผู้ตรวจคนเดียวเห็นแค่มุมเดียว ส่วนคณะที่ถูกสั่งให้ "พยายามทำให้มันพัง" คนละมุม จะจับสิ่งที่คนเดียวมองข้ามได้
> ผลลัพธ์คือคำตัดสิน **ไม่ใช่การแก้งาน**

เส้นแบ่งกับ [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md): panel โจมตีงานที่เสร็จแล้ว 1 ชิ้นก่อนส่ง · ยังไม่มีงานหรือยังไม่รู้ว่ารูปแบบไหนดี (แผน · ดีไซน์ · ร่าง) → สร้างหลายแบบแล้วเลือกด้วย pick-best ก่อน

## ขั้นตอน

1. **ขอบเขต** — สิ่งที่จะรีวิว เช่น เอกสาร · แผน · ผลวิจัย · รายการสินค้า · ชุดไฟล์ที่สร้างหรือแก้ในรอบนี้ รวมของรอบข้างที่ต้องอ่านประกอบ
2. **แพ็กเกจและเจตนา** — สร้างแพ็กเกจรีวิวตาม [`review-lenses`](../superuser/references/review-lenses.md) ข้อ 1 (diff เป็นไฟล์ · เงื่อนไข spec คัดตรงตัว · รหัส `head:`) แล้วเขียนเจตนา 1 ย่อหน้าว่างานนี้ตั้งใจทำอะไร โดยดูจากคำขอ · บันทึกงาน · ตัวงานเอง ถ้าไม่แน่ใจให้เลือกการตีความที่ผลกระทบน้อยสุด แล้วจดลง [`decision-log`](../decision-log/SKILL.md) โดยไม่หยุดถาม
3. **ตั้งคณะ 3 คน ต่างมุมกัน** (แต่ละคนคือ agent `reviewer` ตัวใหม่ อ่านอย่างเดียว · งานชิ้นเดียวที่ไม่เสี่ยงใช้ `reviewer` ตัวเดียวพอ) — ใน Claude Code โมเดลทุกตัวมาจากค่ายเดียวกัน ความต่างจึงต้องมาจากมุมที่สั่งให้ดู และการผสมโมเดลหลายขนาด

   | ผู้ตรวจ | มุม | ระดับโมเดล |
   |---|---|---|
   | ก | ความถูกต้อง — ข้อเท็จจริงผิด · ตัวเลขไม่ตรง · กรณีขอบ · ข้อมูลว่าง | ใหญ่ |
   | ข | ความเสี่ยงและข้อมูล — ข้อมูลส่วนบุคคล · ค่าลับ · สิทธิ์ · เงินหรือการกระทำที่ย้อนกลับไม่ได้ · ข้อกฎหมายหรือข้อตกลงที่ละเมิด | ใหญ่ |
   | ค | ความเรียบง่ายและคนใช้ต่อ — ส่วนเกินจำเป็น · ขัดกันเอง · คำหรือชื่อที่ชวนเข้าใจผิด · คนอ่านหรือลูกค้าจริงจะติดตรงไหน | กลาง |

   งานโค้ด (ขอบเขตจาก git · มุมเพิ่มของแต่ละผู้ตรวจ · แอปมือถือ) → ส่วนเพิ่มใน plugin `software-development` → `superuser` → `references/code-extensions.md`

   **ผู้ตรวจจากค่ายอื่น (ถ้ามี)** — ถ้าเครื่องมี Command-Line Interface (CLI) ของโมเดลค่ายอื่นติดตั้งไว้แล้ว (เช่น `codex` · `gemini`) ให้ใช้แทนผู้ตรวจ ค ด้วย prompt และมุมเดิม ในโหมดอ่านอย่างเดียว เพราะโมเดลต่างค่ายอาจพลาดไม่เหมือนกัน (ยังไม่มีหลักฐานวัดเทียบว่าดีกว่าค่ายเดียว) แต่ **เนื้องานจะถูกส่งออกไปยังผู้ให้บริการนั้น** จึงใช้ได้เฉพาะเมื่ออนุญาตไว้ล่วงหน้าใน `~/.claude/superuser-style.md` หรือ `docs/AGENT-LOOP.md` ถ้าไม่มี CLI หรือไม่ได้อนุญาต ให้ใช้คณะค่ายเดียวตามตาราง

   ข้อควรรู้ว่าความเป็นอิสระมาจากไหน: ในบันทึกรอบเดียวของคอร์ส CWN2026 (2026-11-04) ผู้ตัดสิน Codex เขียนข้อสอบรับงาน 47 ข้อก่อนแอปมี · 25 ข้อ (53%) ใช้ไม่ได้เมื่อรันกับของจริงต้นฉบับ · จับของที่ผู้สร้างพลาดได้ 2 ข้อ (ผ่าน 20/22 → 22/22) · ข้อมูลที่ 2 ฝั่งใช้ร่วมกันผิด (ตรงจอจริง 278/300) และถูกจับเพราะรันซ้ำกับต้นฉบับจริง ไม่ใช่เพราะต่างค่าย · เส้นที่สำคัญจึงเป็น **คำตอบมาจากต้นฉบับจริง** ไม่ใช่ยี่ห้อโมเดล · ไม่มีกลุ่มควบคุม จึงแยกผลของยี่ห้อโมเดลออกไม่ได้

4. **ปล่อยพร้อมกันในข้อความเดียว อ่านอย่างเดียว** — ทุกคนได้ path แพ็กเกจและเจตนาเดียวกัน ต่างกันแค่มุม (มุมของแต่ละคนคือเลนส์ใน `review-lenses` ข้อ 2) · prompt ไม่มีความเห็นของหัวหน้าทีมว่างานดีหรือไม่ ให้ส่งผลเป็นตาราง `| ปัญหา | ที่ไหน (หน้า · ข้อ · ไฟล์:บรรทัด) | ทำให้พังอย่างไร (ขั้นตอนหรือ input) | ความรุนแรง |` ไม่เกิน 40 บรรทัดต่อคน และ **ห้ามแก้ไฟล์**
5. **ยืนยันทุกข้อ ทีละข้อ** — ข้อละ 1 ผู้ยืนยัน (`reviewer` ตัวใหม่ ค่าตั้งต้น `FALSE_POSITIVE` มั่นใจต่ำกว่า 80 ไม่เข้ารายงาน ตาม `review-lenses` ข้อ 3) ตรวจกับต้นฉบับจริงหรือรันให้เห็น ข้อที่ยืนยันไม่ได้ให้ติด `PLAUSIBLE` (เป็นไปได้ แต่ยังพิสูจน์ไม่ได้) หรือทิ้งพร้อมเหตุผล ส่วนข้อ `PLAUSIBLE` ให้ตัดสินเองโดยเลือกทางที่ผลกระทบน้อยสุด แล้วจดลงรายการ ยกเว้นเรื่องในรายการ "รออนุมัติ" ของ `superuser` (ลบหรือเขียนทับของผู้ใช้ · commit/push · ส่งออกนอกเครื่อง) ให้เตรียมไว้และจดลงรายการ ไม่ทำเอง
6. **ซักค้าน (เฉพาะงานเสี่ยงสูง หรือเมื่อตาราง 3 ใบขัดกัน)** — ผู้โหวต 3 คน **คงที่ 3 เสมอ** ไม่ลดไม่เพิ่มตามงบ เพื่อให้ความมั่นใจเทียบข้ามรอบได้ · ถือคนละเลนส์ `security-reach` · `security-impact` · `security-defense` (หรือเลนส์ที่เหมาะกับข้อนั้น) ยืนยันได้ต้องอ้าง `ไฟล์:บรรทัด` ของทางเข้า จุดที่พัง และตัวกันที่ขาด ไม่ครบถือว่าไม่ยืนยัน · รวม 3 ตารางเป็นใบเดียว ตัดชื่อคนเจอออก แล้วส่งกลับให้ผู้ตรวจแต่ละคน (ตัวเดิมผ่าน `SendMessage` ไม่ต้องอ่านไฟล์ใหม่) ตอบทีละข้อว่า `ยืนยัน` · `ค้าน` (พร้อมเหตุผลหรือขั้นที่ทำให้ไม่พัง) · `ไม่รู้` · ข้อ `PLAUSIBLE` จากข้อ 5 เข้ารอบนี้ด้วย · งานปกติข้ามข้อนี้ เพราะเป็นอีก 3 รอบ token
7. **ให้น้ำหนัก 4 กลุ่ม** — `ยืนยันข้าม` (2 คนขึ้นไปเจอเองโดยอิสระ) > `เห็นพ้อง` (เจอคนเดียว ซักค้านแล้วคนอื่นยืนยัน) > `คนเดียว` (ไม่มีใครค้านแต่ไม่มีใครยืนยัน · จริงต่อเมื่อมีขั้นตอนทำให้พังชัด) > `ขัดแย้ง` (มีคนค้าน — หัวหน้าทีมตัดสินเองจากต้นฉบับ ไม่นับเสียง) · ไม่ได้ซักค้าน → มีแค่ `ยืนยันข้าม` กับ `คนเดียว` · ความเห็นเรื่องรสนิยมเป็นแค่ข้อสังเกตทุกกลุ่ม (แนวคิดจาก adverse ของ addyosmani · MIT)
8. **คำตัดสิน** — ก่อนเขียน เทียบ `head:` ในแพ็กเกจกับของจริง ไม่ตรงหรือมีผู้ตรวจที่ล้ม ยังรัน หรือถูกตัดผล ให้รายงานตามนั้น ห้ามนับเป็นสะอาด · 1 บรรทัด: `ส่งได้` · `ส่งได้หลังแก้` · `ยังไม่ควรส่ง` แล้วตามด้วยรายการ: สูง · กลาง · ต่ำ (ตามนิยามใน `reviewer`) แต่ละข้อบอกกลุ่มจากข้อ 7 · ข้อที่ปัดทิ้งบันทึกใน `ledger.md` พร้อมเหตุผลจากรายการของ `review-lenses` ข้อ 4
9. การสั่งแก้ต่อเป็นหน้าที่ของผู้ใช้หรือ playbook ส่วน skill นี้หยุดที่คำตัดสิน

## ข้อควรระวัง

- คณะรีวิวใช้ token ราว 3 เท่าของ `reviewer` ตัวเดียว · เลือกคณะเมื่อ ราคาของการพลาด × โอกาสพลาด มากกว่าค่าผู้ตรวจที่เพิ่มอีก 2 ตัว (คิดด้วย `decision-scoring` คำสั่ง `review`) · ถ้าประเมินไม่ได้ ใช้ค่าตั้งต้น (ยังไม่ได้วัด): งานที่ส่งคนนอก เงิน กฎหมาย สุขภาพ หรือเลือกทางที่ย้อนไม่ได้ → คณะ 3 มุม · ที่เหลือ → `reviewer` ตัวเดียว · งานโค้ดดู `code-review-checklist` · `pr-description-template` (plugin `software-development`)
- ผู้ตรวจ Artificial Intelligence (AI) ก็แจ้งปัญหาที่ไม่มีจริงได้ ทุกข้อจึงต้องผ่านข้อ 5 ก่อนเข้ารายงาน

## ที่มา

ผู้โหวต 3 เลนส์ ค่าตั้งต้น false positive · claude-security (All rights reserved · เอาแค่กลไก) · agents/scan-verifier.md · ดู 2026-11-10 · ผู้ยืนยันทีละข้อ · code-review (Anthropic) · ดู 2026-11-10 · ความสดของผลรีวิว · qodo · skills/qodo-review-resolver/SKILL.md · ดู 2026-11-10 · รายละเอียดอื่นดู `review-lenses` หัวข้อ "ที่มา"
