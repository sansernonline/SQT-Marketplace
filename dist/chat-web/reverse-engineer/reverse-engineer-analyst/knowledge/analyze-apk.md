# skill: analyze-apk

Use when inspecting an Android APK — manifest declarations, resources, decompiled classes and method references.

# Analyze Android APK

## ขั้นตอน

1. **ยืนยันสิทธิ์** — เฉพาะแอปที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต
2. **Engine** — มี REA + JADX และ JDK บนเครื่อง → ใช้ Android analysis ของ REA ได้ manifest · classes · decompiled methods · ไม่มี → ทำข้อ 3–4
3. **ทำเอง (สถิต)** — APK คือ zip: แตกดู `AndroidManifest.xml` (ถ้าเป็น binary XML ต้องมี apktool หรือ jadx — ไม่มีให้บอกข้อจำกัด) · `resources.arsc` · รายการ .dex · assets และ lib/ (native .so ต่อด้วย `analyze-native-binary` ได้) · Flutter app → เจอ libapp.so ให้บอกว่าเป็น Flutter (โค้ด Dart อยู่ใน .so ไม่มี Java ให้ decompile)
   - มี jadx บนเครื่อง (ต้องมี Java 11+) → `jadx -d out/ app.apk` ได้ Java source + resources + manifest ที่ถอดแล้ว · ชื่อถูก obfuscate (a.b.c) → เพิ่ม `--deobf` · เอาแค่โค้ด → `--no-res` · method ที่ถอดไม่ครบให้คงไว้ → `--show-bad-code` · ถอดไม่ผ่าน → `-m fallback` ได้โค้ดใกล้ bytecode
   - จากนั้น grep ใน `out/sources/` หา URL · permission string · ชื่อ class ที่ manifest ประกาศ
   - ข้อระวัง: jadx ถอดไม่ได้ 100% (README บอกเอง) method ที่มี error จะมีคอมเมนต์กำกับ อย่าอ้างเป็นหลักฐานพฤติกรรม · ชื่อจาก `--deobf` เป็นชื่อที่ jadx ตั้งให้ ไม่ใช่ชื่อเดิมของผู้พัฒนา · ตรวจคำสั่ง 2026-10-23 จาก README ของ jadx (github.com/skylot/jadx)
4. **รายงานตามกฎหลักฐาน** — สิทธิ์ (permissions) · activity · service ที่ manifest ประกาศคือหลักฐานตรง · พฤติกรรมภายในที่ decompile ไม่ได้ให้ติดป้าย `ยังไม่ได้ตรวจ` · implementation ใหม่ + เทสต์
