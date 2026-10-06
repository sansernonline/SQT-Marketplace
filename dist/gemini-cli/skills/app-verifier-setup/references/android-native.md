# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) — สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่ระบุว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม — ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** — มีเครื่องต่ออยู่ (`adb devices`) · มี APK (`build/app/outputs/flutter-apk/app-debug.apk`) · ไม่ครบ → exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** — `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual · exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อยหนึ่งข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` — ได้ทั้งการตรวจและผู้ใช้โปรแกรมอ่านจอ |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) — เปลืองแบตและ TalkBack พูดซ้ำ · แก้โดยแจ้ง UI เมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่สั่น: เปลี่ยนเกิน 1 %) ค่ารองที่ค่อย ๆ ไหลให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่านสองครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด กดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุ flake ที่เหลือหนึ่งครั้ง — ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) · ไม่ตรวจเงื่อนไขก่อน check จะผ่านลอย ๆ |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` — แอปได้ผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ ตรวจได้แค่ว่า "มีค่าออกมา" ไม่ใช่ความแม่น |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` = ทางเดินข้อมูลถูก · `เครื่องจริง` = ค่าถูก · check ที่ต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (รอยืนยัน — ไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator + Gradle กินหน่วยความจำมาก — Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว · หยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- emulator ถูกปิดกลางทาง → รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี → รันบน host
