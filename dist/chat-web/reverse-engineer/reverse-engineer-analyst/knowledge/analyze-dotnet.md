# skill: analyze-dotnet

Use when inspecting a .NET assembly (.dll/.exe) — metadata, CIL instructions, declared dependencies, build comparison.

# Analyze .NET Assembly

## ขั้นตอน

1. **ยืนยันสิทธิ์** — เฉพาะ assembly ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต
2. **Engine** — มี REA → ใช้ static .NET inspection ของ REA (ไม่ต้องมีเครื่องมือเพิ่ม) ได้ metadata · CIL · native dependencies · ไม่มี REA → ทำข้อ 3–4
3. **ทำเอง** — อ่าน metadata (assembly name · version · references) · ถ้ามี ilspy / ildasm / dotnet-ildasm บนเครื่องผู้ใช้ให้ใช้ decompile เป็น C# · ไม่มีเลย → ค้นสตริงและชื่อ type/method จากไฟล์โดยตรง แล้วบอกข้อจำกัด
   - ilspycmd (ติดตั้ง `dotnet tool install --global ilspycmd` ต้องมี .NET SDK) · ทั้ง assembly เป็นโปรเจกต์ → `ilspycmd -o out/ -p App.dll` · type เดียวออกจอ → `ilspycmd -t Namespace.TypeName App.dll` · ดู IL แทน C# → `ilspycmd -il App.dll` · รายชื่อ class → `ilspycmd -l c App.dll` · dependency อยู่คนละโฟลเดอร์ → `-r libs/` · single-file bundle → `ilspycmd -d -o out/ App.exe` แตก assembly ข้างในก่อน
   - ข้อระวังตามชนิด build: ReadyToRun ยังมี IL อยู่ decompile ได้ปกติ (native code ที่แนบมาเป็นแค่ cache) · trimmed build ตัด member ที่ไม่ถูกใช้ทิ้ง — โค้ดที่หายไม่ได้แปลว่าไม่เคยมี · Native AOT ไม่มี IL เลย ilspycmd อ่านไม่ได้ → ไปใช้ `analyze-native-binary` (ข้อระวังนี้มาจากเอกสาร .NET ทั่วไป README ของ ilspycmd ไม่ได้กล่าวถึง (ยังไม่ได้ตรวจกับเอกสาร ILSpy)) · ตรวจคำสั่ง 2026-10-23 จาก README ของ ICSharpCode.ILSpyCmd
4. **รายงานตามกฎหลักฐาน** — ทุกข้อสรุปชี้ type/method จริง · obfuscated assembly (ชื่อถูกแปลง) ให้บอกตรง ๆ ว่าอ่านได้แค่โครง · implementation ใหม่ + เทสต์เทียบพฤติกรรม
