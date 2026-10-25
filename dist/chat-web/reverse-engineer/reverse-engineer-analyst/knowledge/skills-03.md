# skill: analyze-dotnet

Use when inspecting a .NET assembly (.dll/.exe) — metadata, CIL instructions, declared dependencies, build comparison.

# Analyze .NET Assembly

## ขั้นตอน

1. **ยืนยันสิทธิ์** — เฉพาะ assembly ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต
2. **อ่าน metadata** (assembly name · version · references) · ถ้ามี ilspy / ildasm / dotnet-ildasm ที่ผู้ใช้ติดตั้งเองให้ใช้ decompile เป็น C# · ไม่มีเลย → ค้นสตริงและชื่อ type/method จากไฟล์โดยตรง แล้วบอกข้อจำกัด
   - ilspycmd (ติดตั้ง `dotnet tool install --global ilspycmd` ต้องมี .NET SDK) · ทั้ง assembly เป็นโปรเจกต์ → `ilspycmd -o out/ -p App.dll` · type เดียวออกจอ → `ilspycmd -t Namespace.TypeName App.dll` · ดู IL แทน C# → `ilspycmd -il App.dll` · รายชื่อ class → `ilspycmd -l c App.dll` · dependency อยู่คนละโฟลเดอร์ → `-r libs/` · single-file bundle → `ilspycmd -d -o out/ App.exe` แตก assembly ข้างในก่อน
   - ข้อระวังตามชนิด build: ReadyToRun ยังมี IL อยู่ decompile ได้ปกติ (native code ที่แนบมาเป็นแค่ cache) · trimmed build ตัด member ที่ไม่ถูกใช้ทิ้ง — โค้ดที่หายไม่ได้แปลว่าไม่เคยมี · Native AOT ไม่มี IL เลย ilspycmd อ่านไม่ได้ → ไปใช้ `analyze-native-binary` (ข้อระวังนี้มาจากเอกสาร .NET ทั่วไป README ของ ilspycmd ไม่ได้กล่าวถึง (ยังไม่ได้ตรวจกับเอกสาร ILSpy)) · ตรวจคำสั่ง 2026-10-23 จาก README ของ ICSharpCode.ILSpyCmd
3. **รายงานตามกฎหลักฐาน** — ทุกข้อสรุปชี้ type/method จริง · obfuscated assembly (ชื่อถูกแปลง) ให้บอกตรง ๆ ว่าอ่านได้แค่โครง · implementation ใหม่ + เทสต์เทียบพฤติกรรม


---

# skill: analyze-apk

Use when inspecting an Android APK — manifest declarations, resources, decompiled classes and method references.

# Analyze Android APK

## ขั้นตอน

1. **ยืนยันสิทธิ์** — เฉพาะแอปที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต
2. **ตรวจเครื่องมือ** — `npm run doctor -- --target android` ตรวจ JADX, Apktool และ ADB · ไม่ติดตั้งเองโดยไม่ได้รับอนุมัติ
3. **คัดแยกแบบสถิต** — APK คือ zip: แตกดู `AndroidManifest.xml` (ถ้าเป็น binary XML ต้องมี apktool หรือ jadx — ไม่มีให้บอกข้อจำกัด) · `resources.arsc` · รายการ .dex · assets และ lib/ (native .so ต่อด้วย `analyze-native-binary` ได้) · Flutter app → เจอ libapp.so ให้บอกว่าเป็น Flutter (โค้ด Dart อยู่ใน .so ไม่มี Java ให้ decompile)
   - มี jadx บนเครื่อง (ต้องมี Java 11+) → `jadx -d out/ app.apk` ได้ Java source + resources + manifest ที่ถอดแล้ว · ชื่อถูก obfuscate (a.b.c) → เพิ่ม `--deobf` · เอาแค่โค้ด → `--no-res` · method ที่ถอดไม่ครบให้คงไว้ → `--show-bad-code` · ถอดไม่ผ่าน → `-m fallback` ได้โค้ดใกล้ bytecode
   - จากนั้น grep ใน `out/sources/` หา URL · permission string · ชื่อ class ที่ manifest ประกาศ
   - ข้อระวัง: jadx ถอดไม่ได้ 100% (README บอกเอง) method ที่มี error จะมีคอมเมนต์กำกับ อย่าอ้างเป็นหลักฐานพฤติกรรม · ชื่อจาก `--deobf` เป็นชื่อที่ jadx ตั้งให้ ไม่ใช่ชื่อเดิมของผู้พัฒนา · ตรวจคำสั่ง 2026-10-23 จาก README ของ jadx (github.com/skylot/jadx)
4. **ต้องดูอุปกรณ์ตอนรัน** — ขออนุญาตแยกทุกครั้งก่อนใช้ ADB เพื่อติดตั้ง ลบ เปิดปิดแอป ส่งไฟล์ หรืออ่านข้อมูลสด · ระบุอุปกรณ์และคำสั่งที่จะใช้ ห้ามแตะอุปกรณ์อื่นที่พบจาก `adb devices` และคืนค่าที่เปลี่ยนเมื่อจบ
5. **รายงานตามกฎหลักฐาน** — สิทธิ์ (permissions) · activity · service ที่ manifest ประกาศคือหลักฐานตรง · พฤติกรรมภายในที่ decompile ไม่ได้ให้ติดป้าย `ยังไม่ได้ตรวจ` · implementation ใหม่ + เทสต์
