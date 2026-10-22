# สร้างปกใน Word จริง — สูตรที่ผ่านแล้ว และเครื่องสร้างปกที่ใช้ซ้ำได้

ใช้กับ `SKILL.md` ข้อ 5 · พิสูจน์แล้ว 2026-10-15 (เครื่องสร้างปกรอบ 2) เฉพาะปก Software Requirements Specification (SRS): ตัวหนังสือในป้ายเวอร์ชันเป็นข้อความ Word บนรูปป้ายในภาพพื้น · ตำแหน่งแนวตั้งของข้อความใน Word ตรงกับภาพตัวอย่าง (ค่ากลางต่อสไตล์ 0 px · แนวนอนไม่ได้แก้) · ภาพพื้นไม่จาง · ได้ 2 หน้าพอดี (Word 365 บน Windows 11 · Word ผ่าน Component Object Model (COM) → PDF → `pdftoppm`)

## เครื่องสร้างปก `scripts/cover-engine/`

```
cover-engine/src/
├─ build_all.py    สั่งทั้งหมดในคำสั่งเดียว
├─ fonts.py        (รันเมื่อ COVER_INSTALL_FONTS=1) ตัดฟอนต์ variable เป็นไฟล์ static แล้วติดตั้งให้ผู้ใช้คนเดียว (ไม่ใช้ admin)
├─ capture.py      ถ่ายจอจาก mockup จริงที่ 2x (แนวหน้าจอจริง)
├─ render.py       HTML → ภาพตัวอย่าง 150 จุดต่อนิ้ว (dots per inch, dpi) · ภาพพื้น 300 dpi (ซ่อนข้อความ) · ตำแหน่งกล่องข้อความ → build/layout/*.json · checks.json
├─ docx_build.py   ภาพพื้น + ข้อความ Word ในกรอบยึดกับหน้า ด้วย brandkit.py
├─ word_pdf.py     Word COM → PDF → PNG
├─ calibrate.py    วัดระยะเหลื่อมระหว่าง Word กับภาพตัวอย่าง แก้รอบถัดไป
└─ web/            cover.html · cover.js (3 หน้า pageTile · pageShot · pageGrid + ป้ายเวอร์ชัน `pill` · บรรทัดชื่อชุด `seriesLine`) · projects.js (ข้อมูลโปรเจกต์ — แก้ที่นี่) · set.html
```

วิธีใช้กับโปรเจกต์ใหม่:
1. คัดลอกทั้งโฟลเดอร์ `cover-engine/` ไปที่โฟลเดอร์ render ของโปรเจกต์ (เช่น `docs/design/cover/`)
2. วางไฟล์ SVG โลโก้ของแต่ละโปรเจกต์ใน `cover-engine/assets/<project>/` (ภาพหน้าจอที่ถ่ายได้จะอยู่ที่ `build/shots/shot-<screen>.png`) แล้วแก้ `src/web/projects.js`: path SVG โลโก้ · สี · ฟอนต์ · ชื่อเอกสารไทย/อังกฤษ · ประโยคบอกงาน · รหัส เวอร์ชัน วันที่ · แนวโครง (ตัวอย่าง 3 โปรเจกต์ในไฟล์คือ LiteNet ปูตาราง · Telex หน้าจอจริง · SwipeOS ตารางท่ามือ)
3. **แก้ส่วนที่ยังผูกกับ 3 โปรเจกต์ต้นแบบ** (เครื่องนี้ยังไม่อ่านทุกอย่างจาก `projects.js`):
   - `web/cover.js`: เพิ่มเส้นรูปทรงโลโก้ใน `GEO` และให้ฟังก์ชันหน้าของแนวที่เลือก (`pageTile` ปูตารางรูปทรงโลโก้ · `pageShot` หน้าจอจริงซ้อนแถบชื่อ · `pageGrid` ตารางภาพสัญลักษณ์ท่ามือ) ใช้ข้อมูลของโปรเจกต์ใหม่ · จำนวนช่องและสีต่อชนิดเอกสาร
   - `render.py`: รายการ `PROJECTS` · `DOCS` · เงื่อนไขปกพิมพ์ (`if p == "litenet"`)
   - `calibrate.py`: รายการโปรเจกต์ · `docx_build.py`: `PAGE2` (สีและเนื้อหน้า 2) · `fonts.py`: `SOURCES` และ `NEEDED`
   - `web/set.html`: ชนิดเอกสารในภาพชุด (ตอนนี้ BRD · SRS · ARCH)
   - ลบ 3 โปรเจกต์ตัวอย่างออกจาก `projects.js` (ไม่มีไฟล์ SVG มาด้วย)
4. ตั้ง `BRANDKIT_DIR` = โฟลเดอร์ `branded-document-design/scripts` ใน plugin `superuser` (ไม่ตั้ง → สคริปต์หาโฟลเดอร์ plugin `superuser` ที่อยู่ข้างกันเอง) · แนวหน้าจอจริงตั้ง `COVER_MOCKUP` = path ไฟล์ mockup (1 โปรเจกต์ต่อการรัน) · Chrome ที่ติดตั้งในเครื่อง → `COVER_CHROME` (ไม่ตั้ง = Chromium ของ Playwright)
5. `python src/build_all.py` แล้วเปิดดู `covers/*-set.png` และ `build/qa/*-80-1.png` ทุกภาพ
- ต้องมี: Python + `python-docx` `pillow` `numpy` `playwright` `fontTools` `pywin32` · Chrome · Word (สำหรับ PDF) · `pdftoppm` · อินเทอร์เน็ต (Google Fonts ตอน render · ฟอนต์จาก GitHub)
- 🚨 **`fonts.py` ติดตั้งฟอนต์ลงเครื่องผู้ใช้** (`%LOCALAPPDATA%\Microsoft\Windows\Fonts` + registry HKCU) และโหลดไฟล์จาก branch `main` ของ google/fonts โดยไม่ตรวจค่า hash — รันเฉพาะเมื่อตั้ง `COVER_INSTALL_FONTS=1` หลังผู้ใช้อนุญาต · บอกในรายงานว่าติดตั้งอะไร · **ถอด:** ลบไฟล์ `.ttf` ที่ติดตั้งใน `%LOCALAPPDATA%\Microsoft\Windows\Fonts` และค่า `<ชื่อฟอนต์> (TrueType)` ใน `HKCU\Software\Microsoft\Windows NT\CurrentVersion\Fonts`
- `docx_build.py` ตอนนี้สร้างเฉพาะปก SRS (ปก BRD และ ARCH มีภาพพื้นและตำแหน่งแล้ว แต่ยังไม่ได้ทดสอบใน Word)

## สูตร Word

1. **ภาพพื้น** 2480 × 3508 (300 dpi) ซ่อนข้อความที่ต้องแก้ได้ · **โลโก้อยู่ในภาพพื้น** (ไม่แยกเป็นรูป Word) · `anchor_picture(ย่อหน้าแรก, png, 0, 0, 21.0, 29.7, z=251658240)` → อ้างตำแหน่งกับหน้า · `behindDoc=1` · ย่อหน้านั้นระยะ 0 บรรทัด exact 1pt · ไม่ใช้ header
2. **ข้อความ** 1 กล่องใน HTML = 1 ย่อหน้า Word ในกรอบยึดหน้า (`w:framePr hAnchor=page vAnchor=page x y w`) · ระยะบรรทัด exact · ขึ้นบรรทัดด้วย `<br>` เท่านั้น · กรอบกว้างกว่ากล่องจริง 80 px ให้ Word ไม่ตัดบรรทัดเอง
3. **แปลงหน่วย (150 dpi):** twips = px × 9.6 · pt = px × 0.48 · English Metric Unit (EMU) = px × 6096 · ซม. = px ÷ 1240 × 21 · `w:line` = line-height(px) × 9.6
4. **ฟอนต์:** `style_run(font=...)` ทุก run แล้ว `thai_runs(ย่อหน้า)` โดยตั้ง `bk.FONT` เป็นฟอนต์ของกล่องนั้น (ตั้งค่าเดียวทั้งไฟล์ → ชื่อ SemiBold กลายเป็น Regular) · body และ footer เรียก `thai_runs` ด้วย
5. **หน้า 2:** หัวข้อแรกตั้ง `pageBreakBefore` ไม่ใส่ย่อหน้าตัวแบ่งหน้าเปล่า · ซ่อน footer หน้าปกด้วย `different_first_page_header_footer`
6. **ภาพไม่ถูกบีบ:** ใส่ `<w:doNotAutoCompressPictures/>` ในตำแหน่งตาม schema ของ `settings.xml` · ไฟล์ .docx เก็บภาพเต็ม แต่ PDF จาก Word ยังลดเหลือ 200 ppi (ไม่มีสวิตช์ใน COM)
7. **Word COM:** เปิด instance ของตัวเองด้วย `DispatchEx` (ไม่ยุ่งกับ Word ที่ผู้ใช้เปิดอยู่) · `EmbedTrueTypeFonts=True` `SaveSubsetFonts=False` → ไฟล์ราว 5 MB · `ExportAsFixedFormat(..., 17, OptimizeFor=0)`
8. **ปรับตำแหน่ง:** `calibrate.py` เลื่อนหมึกของแต่ละกล่องเทียบภาพ Word 150 dpi (±14 px) เก็บค่ากลางต่อสไตล์ (ฟอนต์ | น้ำหนัก | ขนาด | ระยะบรรทัด) ใน `build/calib.json` · รอบแรกเหลื่อมสูงสุด 8 px รอบ 2 เหลือ 0

## กับดักที่เจอ

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| PDF ขึ้นชื่อฟอนต์ "…SemiBold,Bold" (ตัวหนาปลอม) | ไม่ได้ติดตั้งน้ำหนัก 700 | ติดตั้งไฟล์ static ทุกน้ำหนักที่ใช้ |
| ข้อความไทยเป็น BrowalliaNew | ฟอนต์ละติน (Space Grotesk) ไม่มีตัวไทย แล้วไม่ได้เรียก `thai_runs` | footer แยกตามภาษา · เรียก `thai_runs` ทุกส่วน · ตรวจด้วย `pdffonts` |
| ฟอนต์ variable กลายเป็น Calibri ใน PDF | Word รู้จักแค่ Regular/Bold ต่อตระกูล | `fontTools.varLib.instancer` ตัดเป็นไฟล์ static แล้วตั้งชื่อตระกูลแยก |
| ภาพพื้นปกดูซีดตอนแก้ใน Word | วางภาพใน header | ยึดกับย่อหน้าแรก (ข้อ 1) |
| รหัสเอกสารยักษ์ชนช่องตาราง | ขนาดตายตัว แต่ขนาดช่องเปลี่ยน | คำนวณขนาดจากความกว้าง 3 ช่องและความสูงตัวพิมพ์ใหญ่ |

## ยังไม่ได้ตรวจ

เปิดบนเครื่องที่ไม่มีฟอนต์ (ฟอนต์ฝังแล้ว แต่ยังไม่ได้ลอง) · พิมพ์ปกพิมพ์บนเครื่องพิมพ์จริง · ลำดับการอ่านของกรอบข้อความด้วยโปรแกรมอ่านหน้าจอ
