# รูปแบบการแพ็กแอปที่เจอบ่อย

รู้ว่าแอปแพ็กแบบไหน ก็ไปถึงชั้นที่อ่านได้เลย — ดูหัวข้อนี้ก่อนเปิด decompiler · ทุกคำสั่งในไฟล์นี้ **อ่านหรือแตกไฟล์อย่างเดียว** ยกเว้นที่ติดป้าย **ถามก่อน** (ตามตารางสิทธิ์ใน `SKILL.md` §2)

## แอปของ Mozilla (Firefox · Thunderbird)

- ตัวติดตั้งเต็มบน Windows คือ **7-Zip SFX stub** (PE32 เล็ก มี 3 section) ที่ต่อ archive ของแอปไว้ท้ายไฟล์ · `7z x setup.exe` ได้ `core/` กับ `setup.exe`
- `core/application.ini` — เวอร์ชัน · BuildID · repository ต้นทาง · SourceStamp (หลักฐานว่าสร้างจากซอร์สไหน)
- `core/omni.ja` — ไฟล์ ZIP (Thunderbird 97MB ขึ้นไป) เก็บ JavaScript ของแอปเกือบทั้งหมด (`modules/` · `chrome/`) และค่าเริ่มต้น (`defaults/pref/*.js`) · แตกด้วย 7z แล้ว Grep หา feature · `omni.ja` มักเป็นทางที่ถูกที่สุดที่ได้คำตอบครบ
- DLL ใหญ่ ๆ คือชั้น native: `xul.dll` (เอนจิน Gecko) · `nss3.dll`/`freebl3.dll` (การเข้ารหัส) · `rnp.dll` (OpenPGP) · `libotr.dll` (เข้ารหัสแชต)
- `thunderbird.exe` เป็นแค่ตัวเรียก (launcher stub)

## แอป Electron / Node

- `app.asar` — archive แบบ ASAR · `python -I scripts/asar_extract.py extract app.asar outdir` (ดู javascript-electron.md) · JS ฝั่ง renderer มัก minify แต่ยังอ่านได้ · ไฟล์ `.map` (source map) อาจมีซอร์สต้นฉบับ (`scripts/sourcemap_list.py`)
- `resources/app/package.json` บอกชื่อแอป · จุดเริ่มทำงาน · รายการ dependency
- native module: ไฟล์ `*.node` (เป็น PE DLL) — ถือเป็น native binary

## แอป .NET

- PE ที่มี CLI header (triage รายงาน `.NET / managed PE`) · `ilspycmd -p -o <out> <dll>` ได้ project C# ใกล้ต้นฉบับ — ลองกับงานจริงแล้ว: logic เหมือนเดิม SQL ครบ หายแค่คอมเมนต์กับชื่อตัวแปรในฟังก์ชัน
- `.pdb` ข้าง dll คืนชื่อไฟล์และเลขบรรทัดเดิม · `.dll.config` เก็บค่าตั้ง (และมักมีความลับ)
- ASP.NET MVC ที่ precompile view: `.cshtml` กลับมาเป็นคลาสใต้ `<Assembly>.Views.<Controller>`
- APK ของ Xamarin: โค้ด C# อยู่ใน `assemblies/*.dll` ใน APK (บางทีบีบด้วย LZ4 เป็น `XALZ`) — decompile ไฟล์พวกนี้ ไม่ใช่ `classes.dex`
- ดูว่าเป็น bundled / single-file deployment (แตกตัวเองตอนรัน) หรือไม่ — แตกออกมาก่อน
- การประกาศ P/Invoke บอกว่าโค้ด managed เรียกฟังก์ชันไหนใน DLL native

## Android APK

- เป็น ZIP · มี `classes.dex` (Dalvik bytecode — ใช้ `jadx` หรือ `apktool` ได้โค้ดใกล้ Java) · `AndroidManifest.xml` (XML แบบ binary — `scripts/apk_inventory.py` ถอดได้ ไม่งั้นใช้ `apktool` หรือ `aapt2`) · `resources.arsc` · native lib ใต้ `lib/`

## ตัวติดตั้ง Windows ทั่วไป

- 7-Zip SFX: แตกด้วย `7z x`
- NSIS: แตกด้วย `7z x` (triage เจอ marker `NullsoftInstall`)
- MSI: **ใช้ `7z x file.msi` หรือ `lessmsi x file.msi <out>\` ก่อน** — อ่านไฟล์อย่างเดียว ไม่เรียก Windows Installer · `msiexec /a file.msi /qb TARGETDIR=<out>` (administrative install) **ถามก่อน** เพราะเป็นการรัน Windows Installer บนเครื่องผู้ใช้ (บอกว่าจะรันอะไร กับไฟล์ไหน) · ไฟล์ที่ไม่รู้ที่มา → รันใน `docker-sandbox` เท่านั้น
- MSI transform และ stub ที่ดาวน์โหลดตัวจริงทีหลัง อาจไม่มี payload เลย — ดูให้รู้แต่แรกจะได้ไม่เสียแรง

## ไฟล์รายงานและ ETL (Extract-Transform-Load) ขององค์กร

บ่อยครั้งเป็นที่เดียวที่สูตรคำนวณอยู่ · ไม่ต้องใช้ decompiler เลย

| ไฟล์ | คืออะไร | ชั้นที่อ่านได้ |
|---|---|---|
| `.rpt` Crystal Reports | OLE compound file | `strings` เห็น SQL ชื่อตารางและฟิลด์ · สูตรต้องใช้ Crystal Designer หรือ export ด้วย RptToXml |
| `.pbix` Power BI | ZIP | `Report/Layout` เป็น JSON แบบ UTF-16 (หน้า visual filter) · measure ใน `DataModel` ต้องใช้ pbi-tools หรือ Tabular Editor |
| `.dtsx` SQL Server Integration Services (SSIS) | XML | ค้น `SqlCommand` · `ConnectionManager` · `DTS:ObjectName` · ลำดับ package ดูใน master package |
| `.rdl` SQL Server Reporting Services (SSRS) | XML | `CommandText` ของแต่ละ dataset |
| `.mdb` / `.accdb` | ฐานข้อมูล Access | query และโมดูล VBA · เปิดด้วย mdbtools หรือ Access |
