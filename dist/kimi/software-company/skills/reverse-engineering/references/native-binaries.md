# native (PE · ELF · Mach-O) และ .NET

แนวคิดดัดแปลงจาก `native-and-artifacts.md` ของ REA (MIT · © 2026 morluto) เขียนใหม่ให้ใช้สคริปต์ในเครื่องและ Ghidra ที่ผู้ใช้ติดตั้งเอง

| หัวข้อ | |
|---|---|
| [1 · native ทีละขั้น](#1--native-ทีละขั้น) | [2 · .NET](#2--net) |
| [3 · Ghidra headless](#3--ghidra-headless) | [4 · ไฟล์ที่ถูก pack และภาษาเฉพาะ](#4--ไฟล์ที่ถูก-pack-และภาษาเฉพาะ) |

## 1 · native ทีละขั้น

ทุกขั้นอ่านไฟล์อย่างเดียว ไม่โหลดหรือรัน binary

| ขั้น | คำสั่ง | ได้อะไร |
|---|---|---|
| 1 ชนิดไฟล์ | `python -I scripts/triage.py <file>` | PE / ELF / Mach-O · สถาปัตยกรรม · .NET หรือไม่ |
| 2 header · section · import · export | `python -I scripts/pe_elf_info.py <file>` (`--limit 0` ดูครบ · `--json` เก็บไว้เทียบ) | DLL หรือ .so ที่ใช้ · ฟังก์ชันที่เรียก · ฟังก์ชันที่เปิดให้คนอื่นเรียก |
| 3 strings | `python -I scripts/triage.py <file> --pattern '<regex>'` เช่น `https?://` หรือ `select .* from` | URL · SQL · ข้อความ error (ค่าลับถูกปิด) |
| 4 disassembly ของจุดที่สนใจ | `objdump -d --start-address=0x… --stop-address=0x… <file>` | assembly เฉพาะช่วง (ผลยาว เขียนลงไฟล์) |
| 5 pseudo-C | Ghidra headless (หัวข้อ 3) | ฟังก์ชันที่อ่านได้ ชื่อหายถ้าไม่มี symbol |

import บอกได้มากโดยไม่ต้อง decompile:

| import ที่เห็น | บอกอะไร |
|---|---|
| `WINHTTP` · `WININET` · `ws2_32` · `libcurl` · `libssl` | ออกเครือข่าย |
| `bcrypt` · `ncrypt` · `crypt32` · `libcrypto` | เข้ารหัส · ใบรับรอง |
| `advapi32!Reg*` | อ่านเขียน registry |
| `sqlite3_*` · `odbc32` | ฐานข้อมูล |
| `mscoree.dll` เท่านั้น | เป็น .NET ไปหัวข้อ 2 |

- address และ pseudocode เป็นผลวิเคราะห์ ไม่ใช่ซอร์สต้นฉบับ
- ไม่มี import หรือ symbol ไม่ได้แปลว่าไม่มีการเรียก (อาจโหลดตอนรันด้วย `LoadLibrary` / `dlopen` หรือถูก strip) ให้จดเป็นสิ่งที่ยังไม่รู้
- delay-load import ของ PE สคริปต์ยังไม่แสดงรายชื่อ บอกแค่ว่ามี · ใช้ `objdump -p` ดูต่อ
- Mach-O สคริปต์อ่านได้แค่ header และ dylib ที่ลิงก์ · import และ export ใช้ Ghidra

## 2 · .NET

- ดูโครงก่อนด้วย `python -I scripts/dotnet_meta.py <dll>` — รายชื่อ assembly ที่อ้าง · class · method · P/Invoke (`Type.method -> dll!ชื่อ`) · resource · `--strings` แสดง user string ที่ปิดค่าลับแล้ว · ไม่ต้องติดตั้งอะไร · ไม่รองรับ metadata แบบ `#-` ที่มี pointer table
- โค้ด C# อ่านได้ใช้ `ilspycmd` (คำสั่งใน SKILL.md หัวข้อ 5.1) · ได้โค้ดเกือบเท่าต้นฉบับ SQL ครบ เสียแค่ comment และชื่อตัวแปร
- `.pdb` ที่วางข้าง ๆ คืนชื่อไฟล์และเลขบรรทัด · `.dll.config` มีค่าตั้ง (และมักมีความลับ — ชื่ออย่างเดียว)
- ASP.NET MVC ที่ compile view ไว้: `.cshtml` กลับมาเป็น class ใต้ `<Assembly>.Views.<Controller>`
- Xamarin หรือ .NET for Android: โค้ด C# อยู่ใน `assemblies/*.dll` ของ APK (บางทีถูกบีบแบบ LZ4 ขึ้นต้น `XALZ`) แกะตัวนั้น ไม่ใช่ `classes.dex`
- **NativeAOT** compile เป็น machine code แล้ว decompiler ของ .NET ใช้ไม่ได้ · `pe_elf_info.py` จะบอก `dotnet: False` ทั้งที่ strings มีชื่อ namespace ของ .NET · วิเคราะห์แบบ native (หัวข้อ 1 และ 3) · type ที่กู้ได้ไม่ใช่ C# ต้นฉบับ
- single-file bundle (ไฟล์ exe เดียวที่มี dll ข้างใน) ต้องแตกก่อน ใช้ `ilspycmd -d -o <out> App.exe` · triage เจอ obfuscator ให้หยุดบอกผู้ใช้ก่อน · assembly ที่ถูกทำให้อ่านยากได้แค่โครง ให้บอกตรง ๆ
- ตัวเลือกของ `ilspycmd` ที่ใช้บ่อย: type เดียวใช้ `-t Namespace.TypeName` · ดู IL แทน C# ใช้ `-il` · รายชื่อ class ใช้ `-l c` · dependency อยู่คนละโฟลเดอร์ใช้ `-r <โฟลเดอร์>` (ตรวจจาก README ของ ICSharpCode.ILSpyCmd 2026-10-23)
- ReadyToRun ยังมี IL อยู่ decompile ได้ตามปกติ · trimmed build ตัด member ที่ไม่ถูกใช้ทิ้ง โค้ดที่หายจึงไม่ได้แปลว่าไม่เคยมี (2 ข้อนี้มาจากเอกสาร .NET ทั่วไป ยังไม่ได้ตรวจกับ ILSpy)

## 3 · Ghidra headless

ใช้เมื่อขั้น 1–4 ตอบคำถามไม่ได้ · Ghidra และ JDK 21 ต้องติดตั้งโดยผู้ใช้ (SKILL.md หัวข้อ 5) · ยังไม่ได้ทดลองบนเครื่องที่เขียนเอกสารนี้ เพราะไม่มี Ghidra (`ยังไม่ได้ตรวจ`)

```bash
# Windows ใช้ support\analyzeHeadless.bat · project ชั่วคราว ลบทิ้งเมื่อจบ ไม่แก้ byte ของไฟล์เป้าหมาย
<ghidra>/support/analyzeHeadless _to_delete/re/<ชื่อ>/ghidra tmp -import <file> \
  -scriptPath <โฟลเดอร์สคริปต์ของเรา> -postScript <สคริปต์ส่งออก> _to_delete/re/<ชื่อ>/out -deleteProject
```

- ส่งออก pseudo-C เฉพาะฟังก์ชันที่ต้องดู (ตาม address จาก import หรือ string) ไม่ส่งออกทั้งไฟล์ ผลจะยาวเกินอ่าน
- ชุดที่ควรได้จากการรัน 1 ครั้ง: รายชื่อฟังก์ชันพร้อม address · strings พร้อมจุดที่อ้างถึง (xref) · import และ export · pseudo-C และ disassembly ของฟังก์ชันที่สนใจ · สคริปต์ส่งออกต้องเขียนเองผ่าน API ของ Ghidra
- อ่าน pseudo-C เทียบกับ disassembly ทุกครั้งก่อนอ้างฟังก์ชันในรายงาน เพราะ decompiler เดา type และยุบโค้ดผิดได้ ส่วน disassembly คือสิ่งที่รันจริง (แนวคิดจาก ghidra-headless ใน trailofbits/skills-curated (CC-BY-SA) เขียนใหม่ด้วยคำของเรา)
- ตรวจว่ามี Ghidra · IDA · Hopper ไหมด้วย `node scripts/check-tools.mjs --target native`
- address ของ ELF เป็น virtual address ไม่ใช่ file offset ห้ามบวก image base เอง
- เป้าหมายที่ไม่น่าไว้ใจ ให้รัน Ghidra ใน `docker-sandbox` ด้วย เพราะ parser ของ Ghidra อ่านไฟล์ด้วยสิทธิ์ผู้ใช้
- IDA · Hopper · Binary Ninja ใช้แทนได้เฉพาะสัญญาอนุญาตของผู้ใช้เอง เปิดแบบอ่านอย่างเดียว ไม่ save ทับ

## 4 · ไฟล์ที่ถูก pack และภาษาเฉพาะ

| เห็นอะไร | หมายถึง | ทำอะไรต่อ |
|---|---|---|
| section ชื่อ `UPX0` `UPX1` · section ที่ raw size 0 แต่ virtual size ใหญ่ | ถูก pack | จดตัวตนของไฟล์เดิมและไฟล์ที่แตกแยกกัน · การแตก stub ไม่ได้แปลว่าได้โปรแกรมจริง · ถามผู้ใช้ก่อนแตก |
| `.gopclntab` (สคริปต์บอก `Go binary`) · string `go1.` | Go | ชื่อฟังก์ชันยังอยู่ใน pclntab · Ghidra รุ่นใหม่อ่านได้ |
| string `/rustc/` · `.cargo/registry` | Rust | ชื่อ crate จาก path ใน strings · ไม่มี section `.dep-v0` ไม่ได้แปลว่าไม่มี dependency |
| ไฟล์ไม่มี header (firmware) | raw binary | ต้องรู้สถาปัตยกรรมและจุดเริ่มก่อน ถามผู้ใช้หรือดูเอกสารของอุปกรณ์ · image ที่มีหลายส่วนดู [firmware](firmware.md) |
| `.wasm` | WebAssembly | WABT (`wasm2wat`) ที่ผู้ใช้ติดตั้ง · WAT ไม่ใช่ซอร์สต้นฉบับ |
