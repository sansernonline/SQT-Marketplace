---
name: app-verifier-setup
description: Use when a project has no scripted way for an agent to run the app and see the result, or before the first feature or fix on a new project. Builds a project-local verify skill so agents prove work on the real app.
---

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง มันวนปรับปรุงไม่ได้ และคนจะกลายเป็น "คนส่งข้อมูล" ระหว่าง agent กับหน้าจอ
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** สองชิ้น — สคริปต์อยู่กับ test ของโปรเจกต์ · skill เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) · ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่แยกขั้นตอนเป็นไฟล์ร้อยแก้ว** — ลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก · ให้ข้อมูลในสคริปต์เป็นแหล่งเดียว แล้ว skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** — README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) · ใช้ของเดิม ไม่สร้างใหม่ถ้ามี
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (Chromium ที่ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่ถ้ามี) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ WinAppDriver หรือ pywinauto | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro — Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - โปรเจกต์มี `.sandbox/` → ขับเบราว์เซอร์ในห้อง · headless เป็นค่าเริ่ม · อยากให้คนดูได้ เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) · Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) → รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA → ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) → ป้อนค่าที่รู้ล่วงหน้า: emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build · ติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` — ความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ยังไม่ได้รันบนเครื่องจริงให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** — เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) · ใส่ข้อมูลทดสอบ (seed) · รอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ไม่ขึ้นใน 10 วินาที = ล้ม · มือถือ: แยกเวลา build · boot emulator · เปิดแอป · ต่อ check — ดู reference) · ปิดแอปเมื่อจบเสมอ · รันซ้ำได้ผลเดิม ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md))
4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** — ไล่จากเมนู · route · command list · SRS · หนึ่งกลุ่มต่อฟีเจอร์ หนึ่งบรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) · อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาดหนึ่งกรณีต่อฟีเจอร์ · **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ · ผลพิมพ์ `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** — ชื่อฟีเจอร์ที่ไม่มีจริง → exit 1 · แอปไม่ขึ้น → exit 1 · ไม่มี check ไหนได้รัน → exit 1 (ตรวจศูนย์รายการคือพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นผ่านลอย ๆ · รอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **อ่านหน้าจอแล้วต้องรู้ว่าสด** — ลบไฟล์ผลเก่าก่อนอ่านใหม่ · กดเมื่อตำแหน่งเป้าหมายนิ่งสองรอบติด · อ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด = บั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** — แก้แอปให้ผิดหนึ่งจุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** — ส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล · ติดตรงไหน แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** — ภาพหน้าจอ · log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ลบได้เมื่อส่งงานแล้ว)

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม — ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง | การตรวจจะกลายเป็นการแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`agent-team`](../agent-team/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่
