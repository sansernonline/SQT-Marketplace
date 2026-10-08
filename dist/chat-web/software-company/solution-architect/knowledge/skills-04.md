# skill: branded-document-design

Use when a Word, PowerPoint or PDF deliverable must look designed. Token palette, type scale, tested python-docx and python-pptx builders, Thai typography.

# Branded Document Design

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** เอกสารที่ส่งออกไปต้องดูออกว่าตั้งใจออกแบบ คือมีชุดสี ชุดขนาดตัวอักษร
> และช่องไฟที่เหมือนกันทุกหน้า ไม่ใช่เปิด Word แล้วพิมพ์เลย

## เมื่อไหร่ใช้ skill นี้

- ผลลัพธ์คือ **.docx / .pptx / .pdf** ที่ลูกค้า ผู้บริหาร หรือทีมอื่นจะเปิดดู
- เอกสารต้อง **เซ็นอนุมัติ** หรือแนบไปกับสัญญา/ข้อเสนอ
- เอกสารไทย–อังกฤษปนกัน (ถ้าตั้งฟอนต์ไม่ครบจะพังง่ายมาก)
- ต้องออกเอกสารแบบเดียวกันซ้ำ ๆ และอยากให้ทุกฉบับหน้าตาเหมือนกัน

## เมื่อไหร่ **ไม่** ใช้

- ผลลัพธ์เป็น markdown ในรีโป ให้ใช้ `polished-document-style`
- ต้องแค่ **อ่าน/แกะ** ไฟล์ Office ที่ได้รับมา ให้ใช้ `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf`
- ไดอะแกรมในเอกสาร markdown ให้ใช้ `markdown-visuals`

**ลำดับที่ถูกต้อง:** เขียนเนื้อหาเป็น markdown ก่อน (polished-document-style)
→ ค่อยใช้ skill นี้ render เป็นไฟล์ส่งมอบ และแก้เนื้อหาที่ markdown เสมอ (markdown คือต้นฉบับ)

---

## 0 · สีมาจากเนื้องาน — ถามก่อนเริ่ม

**ถ้า markdown ต้นทางมี `doc-theme` อยู่แล้ว ให้ใช้ค่านั้น อย่าถามซ้ำ อย่าตั้งใหม่**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")

ถ้ายังไม่มี **ห้ามเลือกสีเอง ห้ามใช้ค่าเริ่มต้นเงียบ ๆ** ให้ถามผู้ใช้ว่าจะใช้สีอะไร
ถ้าผู้ใช้ยังไม่ระบุ ให้เสนอจากเนื้องาน รอยืนยัน แล้ว**เขียนกลับลง `doc-theme`** ในไฟล์ markdown

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |

ถ้าลูกค้ามีแบรนด์อยู่แล้ว ให้ใช้สีแบรนด์ ตารางนี้ใช้เฉพาะตอนไม่มีอะไรให้ยึด

**สีหลักมีสีเดียว** เฉดอ่อนและเข้มทั้งหมดคำนวณจากสีนั้น ไม่เลือกเพิ่มทีละสี
สีที่ไม่ผูกกับสีหลักมีแค่สีสถานะ (สำเร็จ · เตือน · ผิดพลาด) และต้องคงความหมายเดิมเสมอ

---

## 1 · Design tokens — ห้าม hardcode สีนอกตารางนี้

ตารางนี้กำหนด**หน้าที่**ของแต่ละ token ไม่ได้กำหนดค่าสี
ค่าจริงมาจากข้อ 0 แล้วตั้งครั้งเดียวด้วย `use_brand(...)`

| Token | หน้าที่ | ได้มาจาก |
|-------|---------|----------|
| `brand` | หัวข้อ H1 · ตัวเลข KPI · ลิงก์ · แถบ accent | สีหลักที่ผู้ใช้เลือก |
| `brand_2` | accent รอง · ขีดใต้หัวข้อสไลด์ · ปลายไล่สี | เพื่อนบ้านของสีหลักบนวงล้อสี |
| `brand_deep` | หัวข้อ H2 · ตัวอักษรหัวตาราง | สีหลักผสมดำ ให้ contrast ≥ 7:1 บนพื้นขาว |
| `brand_tint` | พื้นหัวตาราง · การ์ด KPI · พื้นหน้าปก | สีหลักผสมขาวประมาณ 90% |
| `brand_tint_2` | แถวสลับ (zebra) ในตารางยาว | สีหลักผสมขาวประมาณ 96% |
| `text` | หัวข้อ H3 · ข้อความเน้น | เทาเข้มอมโทนเดียวกับสีหลัก |
| `text_body` | เนื้อความทั้งหมด | เทาเข้มอ่อนกว่า `text` 1 ขั้น **ไม่ใช่ดำสนิท เพราะดำสนิทล้าตา** |
| `text_muted` | คำบรรยายรูป · meta · footer | เทากลาง contrast ≥ 4.5:1 |
| `line` | เส้นตาราง เส้นคั่น | เทาอ่อนมาก เห็นได้แต่ไม่แย่งสายตา |

**สีสถานะ 6 ตัว** (แต่ละตัวมีคู่สีพื้นกับสีตัวอักษร): สำเร็จ · ข้อมูล · เตือน · ผิดพลาด · เน้น · เป็นกลาง
สีสถานะ**ไม่เปลี่ยนตามแบรนด์** เพราะเขียวคือผ่าน แดงคือไม่ผ่าน ในทุกเอกสาร
พื้นคือเฉดอ่อนมาก ตัวอักษรคือเฉดเข้มของสีเดียวกัน ให้ contrast ≥ 4.5:1

**ความหมายของแต่ละสี — เลือกสีตามความหมายเสมอ** (เหมือนกันทั้งเอกสารและไดอะแกรม)

| สี | หมายความว่า | ใช้กับ (callout / pill / กล่อง / เส้นในรูป) |
|---|---|---|
| 🔴 แดง | อันตราย · ห้าม · ลบทิ้ง · ผิดพลาด · เลยกำหนด | `critical` · สถานะ "ค้าง/ล้มเหลว" · ขั้นที่ทำลายข้อมูล · เส้นที่พัง |
| 🟠 เหลือง/ส้ม | ระวัง · รอดำเนินการ · ข้อแม้ · ทางที่ไม่ใช่เส้นหลัก | `warning` · สถานะ "กำลังทำ" · โซน/เส้นข้อยกเว้น (`#C77A11`) |
| 🟢 เขียว | สำเร็จ · ผ่าน · ปลอดภัย · เสร็จแล้ว | `success` · สถานะ "เสร็จ" · ผลลัพธ์ที่ยืนยันแล้ว |
| 🔵 น้ำเงิน | ข้อมูล · การกระทำหลัก · เส้นทางปกติ | `tip` · ปุ่มหลัก · กล่อง/เส้นเส้นทางหลัก (brand) |
| 🟣 ม่วง | คำถาม · ทางเลือก · หมายเหตุเสริม | `question` · ของเสริมที่ไม่บังคับ |
| ⚪ เทา | เป็นกลาง · ปิดใช้งาน · ของภายนอก | `note` · ระบบภายนอก · ส่วนที่ปิดอยู่ |

กฎเดียว: **เลือกสีตามความหมาย ไม่ใช่ตามความสวย** อย่าใช้แดงเพราะอยากให้เด่น ใช้แดงเฉพาะเมื่ออันตรายหรือผิดจริง และไดอะแกรมก็ใช้ชุดความหมายเดียวกันนี้ (ดู `software-diagrams` · `diagram-figures` ที่มี `EXCEPT_HUE` ส้มสำหรับทางที่ไม่ผ่านเส้นหลัก)

> **เกณฑ์ที่ต้องผ่านทุกชุดสี:** เนื้อความบนพื้น ≥ 4.5:1 · หัวข้อบนพื้น ≥ 7:1 ·
> พิมพ์ขาวดำแล้วยังแยกลำดับชั้นออก ถ้าไม่ผ่านให้ปรับความเข้ม ไม่เปลี่ยนสี
>
> **ตัวอย่างชุดสีที่เคยใช้จริง** (ไม่ใช่ค่ามาตรฐาน อย่าคัดลอกไปใช้โดยไม่ดูเนื้องาน) → `references/palette-examples.md`

> 💡 **เปลี่ยนแบรนด์ทั้งชุดในบรรทัดเดียว:**
> `use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")`

### สเกลตัวอักษร (pt)

| ระดับ | Word | Slide | น้ำหนัก · สี |
|-------|------|-------|--------------|
| ชื่อบนปก | 20 | 40 | bold · `brand` (Word) / `brand_deep` (สไลด์) |
| H1 | 16 | 26 | bold · `brand` |
| H2 | 12.5 | — | bold · `brand_deep` |
| H3 | 11.5 | — | bold · `text` |
| เนื้อความ | 11 | 17 | regular · `text_body` |
| ตาราง | 11 | 12.5 | regular · `text_body` |
| คำบรรยาย/footer | 8.5–9 | 10–12 | italic หรือ regular · `text_muted` |

**อย่าเพิ่มขนาดนอกสเกลนี้** เพราะทุกขนาดที่เพิ่มทำให้เอกสารดูไม่สม่ำเสมอ และคนอ่านสังเกตเห็น

---

## 2 · ฟอนต์และภาษาไทย — จุดที่พังบ่อยที่สุด

ใช้ **Tahoma** เป็นค่าเริ่มต้น: มีทุกเครื่อง Windows/Office · วรรณยุกต์ไม่ชนสระ ·
bold อ่านออกชัด · ความสูง x-height ไทยกับอังกฤษใกล้เคียงกัน

> 🚨 **กับดัก complex script:** Word ถือว่าภาษาไทยเป็น *complex script* คนละชุดกับ latin
> ถ้าตั้งแค่ `run.font.size` / `run.font.bold` ตัวอักษรไทยจะ **ไม่เปลี่ยนตาม**
> ต้องตั้ง `w:szCs`, `w:bCs`, `w:iCs` และ `w:rFonts` ให้ครบทั้ง `ascii/hAnsi/cs/eastAsia`
> ฟังก์ชัน `style_run()` ใน `brandkit.py` จัดการให้แล้ว **ห้ามตั้งฟอนต์เองด้วยมือ**

กฎอื่นสำหรับเอกสารไทย:

- ระยะบรรทัด **1.3–1.35** (อังกฤษล้วนใช้ 1.15 ได้ แต่ไทยมีวรรณยุกต์และสระบน–ล่าง ต้องเว้นที่)
- **ห้ามจัดชิดขอบ 2 ด้าน (justify)** กับย่อหน้าไทย เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดคำจนเป็นรู
- LibreOffice ตัดคำไทยไม่เหมือน Word ถ้าจะส่ง PDF ให้ export จาก Word จริง
  หรืออย่างน้อยเปิด PDF ตรวจด้วยตาก่อนส่ง
- สร้าง PDF บน Linux ที่ไม่มี Tahoma ให้ใช้ **Loma** หรือ **Sarabun** แทน
  (ReportLab จัดวรรณยุกต์ไทยผิด ให้ใช้ python-docx→LibreOffice หรือ WeasyPrint แทน)
- เวลา preview บน Linux ตัวอักษรไทยจะดู **เล็กกว่า** latin เพราะฟอนต์แทนที่มี x-height ต่ำกว่า
  ไม่ใช่บั๊กของขนาดฟอนต์ บน Windows ที่มี Tahoma จริงจะสูงเท่ากัน จึงให้ตรวจรอบสุดท้ายจาก Word

---

## 3 · โครงหน้าเอกสาร Word

```
หน้าปก        โลโก้กลาง → ชื่อเอกสาร (brand, bold) → ชื่อระบบ (text, bold)
              → บรรทัดเวอร์ชัน/วันที่ (9pt) → หมายเหตุการแก้ไข (8pt เอียง เทา)
              → ขึ้นหน้าใหม่
สารบัญ        field TOC (ผู้ใช้กด F9 อัปเดต) → ขึ้นหน้าใหม่
เนื้อหา        H1 มีเลขข้อเสมอ ("1. ภาพรวมระบบ") · H2 เป็น "1.1"
              ทุก H1/H2/H3 ตั้ง keep-with-next กันหัวข้อค้างท้ายหน้า
ท้ายเอกสาร    ตารางลงนามอนุมัติ
footer        "หน้า N" กลางหน้า สีเทา 9pt
```

หน้ากระดาษ A4 · ขอบ บน/ล่าง 2.2 ซม. · ซ้าย/ขวา 2.0 ซม. ได้ความกว้างเนื้อหา ≈ **9360 twips**
(ใช้ตัวเลขนี้ตั้งความกว้างคอลัมน์ตารางให้รวมกันพอดี)

---

## 4 · องค์ประกอบที่ใช้ซ้ำ

| องค์ประกอบ | หน้าตา | เมธอด |
|-----------|--------|-------|
| หน้าปก | โลโก้ + ชื่อสีแบรนด์ กลางหน้า | `cover()` |
| ตาราง | หัวพื้น `brand_tint` ตัวอักษร `brand_deep` เส้นเทาบาง หัวซ้ำทุกหน้า | `table()` |
| ตารางสถานะ | คอลัมน์สถานะย้อมสีตามค่า | `pill_table()` |
| แถบตัวเลขสรุป | การ์ดพื้นฟ้าอ่อน ตัวเลขใหญ่สีแบรนด์ + ป้ายเทาเล็ก | `kpi_row()` |
| กล่องข้อความ | พื้นสีอ่อน + แถบสีหนาด้านซ้าย + อีโมจิ 1 ตัว | `callout()` |
| รูปพร้อมคำบรรยาย | รูปกลางหน้า + "รูปที่ N — ..." เอียงเทาใต้รูป | `figure()` |
| บล็อกโค้ด | พื้นเทาอ่อน ฟอนต์ Consolas 9pt | `code()` |
| ตารางเซ็น | บทบาท / ชื่อ / ลายเซ็น / วันที่ | `signoff()` |

**สัดส่วนที่พอดี:** callout ไม่เกิน 3–5 กล่องต่อ 10 หน้า · แถบตัวเลขสรุป (KPI strip) 3–5 ช่อง (ตั้งแต่ 6 ช่อง ตัวเลขจะเล็กจนไม่เด่น) ·
ตารางเกิน 6 คอลัมน์ให้เปลี่ยนเป็นหน้าแนวนอน (`landscape_section()`)

---

## 5 · วิธีใช้ brandkit

```python
import sys; sys.path.insert(0, "scripts")     # หรือ copy brandkit.py มาไว้ข้างงาน
from brandkit import BrandDoc, use_brand, to_pdf

doc = BrandDoc()                                # A4 · Tahoma · โทน Apps Track
doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
          subtitle="ระบบ Apps Track — Project Control & Monitor",
          meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
          logo="asset/AppsTrack_Logo_Badge.png")
doc.toc()

doc.h1("1. ภาพรวมระบบ")
doc.para("eitprojects เป็นระบบบริหารและติดตามโครงการ ...")
doc.kpi_row([("19", "โครงการ"), ("115", "Work items"), ("103", "Open tasks")])
doc.table(["หัวข้อ", "รายละเอียด"],
          [["URL ระบบ", "https://project.eitaccount.cloud"]],
          widths=[2600, 6760])                  # รวม = 9360
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

สไลด์ใช้ `brandkit_pptx.py` ซึ่งกินโทเคนชุดเดียวกัน:

```python
from brandkit_pptx import BrandDeck
d = BrandDeck()                                  # 16:9
d.title_slide("Apps Track", "Project Control & Monitor", "19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน", ["...", "..."], subtitle="สรุปจาก SRS v3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items")])
d.table_slide("สถานะ Milestone", headers, rows, col_widths=[1, 4, 2, 2],
              status_col=3, palette={"เสร็จ": "green", "กำลังทำ": "amber"})
d.image_slide("สถาปัตยกรรม", "diagrams/arch.png", caption="ภาพรวมองค์ประกอบ")
d.save("deck.pptx")
```

เมธอดทั้งหมดอยู่ใน `references/api.md` ส่วนไฟล์ตัวอย่างที่รันได้จริงคือ
`scripts/example_srs.py`

---

## 6 · ตรวจงานด้วยตา — ขั้นตอนที่ห้ามข้าม

เอกสารที่ยังไม่มีใครเปิดดูหน้าจริง ถือว่ายังไม่เสร็จ เพราะอาจมีตารางล้นขอบ หัวข้อค้างท้ายหน้า
วรรณยุกต์ลอย ปัญหาเหล่านี้ดูจากโค้ดไม่เห็น

```bash
soffice --headless --convert-to pdf --outdir out SRS.docx
pdftoppm -png -r 80 out/SRS.pdf out/page      # ได้ page-01.png, page-02.png ...
```

แล้ว **เปิดภาพดูจริงทุกหน้า** (Read tool) ก่อนส่งมอบ ตรวจตามนี้:

- [ ] ไม่มีตารางล้นขอบกระดาษ คอลัมน์กว้างพอดี ไม่มีคำถูกบีบขึ้นบรรทัดใหม่แปลก ๆ
- [ ] ไม่มีหัวข้อค้างอยู่บรรทัดสุดท้ายของหน้า
- [ ] วรรณยุกต์/สระไทยไม่ชนกัน และไม่มีตัวอักษรกลายเป็นกล่องสี่เหลี่ยม
- [ ] หน้าปกไม่มีข้อความล้นหรือตกขอบ
- [ ] ช่องไฟก่อน/หลังตารางและ callout เท่ากันทั้งเอกสาร
- [ ] footer เลขหน้าครบทุกหน้า
- [ ] ไม่มี TBD / Lorem ipsum / placeholder หลงเหลือ

---

## 7 · Anti-patterns

- ❌ **ใช้ Heading style ที่มากับ Word** — จะทับสีที่ตั้งไว้ ให้ใช้ `h1()/h2()/h3()`
  ซึ่งตั้ง `outlineLvl` เอง สารบัญ (TOC) จึงยังเห็นหัวข้อ
- ❌ **เส้นตารางดำหนาแบบค่าเริ่มต้น** — เอกสารดูเก่าทันที ใช้เส้นสี `line` หนา 0.5pt
- ❌ **ตัวอักษรสีดำสนิท** — ให้ใช้ `text_body` ซึ่งเป็นเทาเข้ม เนื้อความจะนุ่มขึ้นมาก
- ❌ **หัวตารางตัวหนาแต่ไม่มีพื้นสี** — ตารางข้ามหน้าแล้วคนอ่านไม่รู้ว่าเริ่มตรงไหน
- ❌ **ปล่อยความกว้างคอลัมน์ให้ Word คิดเอง** — ต้อง `fixed_widths()` เสมอ
  ไม่งั้นคอลัมน์รหัสจะกว้างเท่าคอลัมน์รายละเอียด
- ❌ **อีโมจิเยอะเกิน** — 1 ตัวต่อ callout พอ ไม่ใส่ในหัวข้อทุกอัน
- ❌ **ส่งไฟล์โดยไม่เคย render ดู** — ดูข้อ 6
- ❌ **สร้าง .docx โดยไม่เก็บ markdown ต้นฉบับ** — รอบหน้าแก้ไม่ได้

---

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---------|-----------|
| โครงเนื้อหา/สำนวนเอกสารทางการ · **ธีมสีของเอกสาร** | `polished-document-style` |
| ไดอะแกรมที่จะเอามาแปะเป็นรูป | `markdown-visuals` → export PNG → `figure()` |
| อ่านไฟล์ Office ที่ลูกค้าส่งมา | `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` |
| สเปรดชีตส่งมอบ | `anthropic-skills:xlsx` (โทเคนสีชุดเดียวกันใช้ได้) |
| เนื้อหาและความครบถ้วนของเอกสาร SRS | `srs-writing` |
| โครงเรื่องและเลย์เอาต์ของสไลด์ | `presentation-design` |
| ไดอะแกรมที่วาดด้วย Mermaid ธีมเดียวกัน | `software-diagrams` |
| ที่มาของระบบสีและตัวอักษร · โลโก้ | `graphic-design` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: api.md

# brandkit API — อ้างอิงเมธอด

ทุกเมธอดคืนอ็อบเจกต์ที่สร้าง (paragraph / table / slide) จึงปรับแต่งต่อได้

## สารบัญ

1. [brandkit.py — Word (.docx)](#brandkitpy--word-docx)
2. [brandkit_pptx.py — สไลด์ (.pptx)](#brandkitpptxpy--สไลด์-pptx)
3. [สูตรความกว้างคอลัมน์ (Word)](#สูตรความกว้างคอลัมน์-word)

---

## brandkit.py — Word (.docx)

### สร้างเอกสาร

```python
BrandDoc(path_template=None, page="A4", margins_cm=(2.2, 2.0, 2.2, 2.0),
         footer_text="หน้า")
```

| พารามิเตอร์ | ความหมาย |
|-------------|----------|
| `path_template` | ไฟล์ .docx/.dotx ที่ใช้เป็นแม่แบบ (มี header/logo ขององค์กรอยู่แล้ว) |
| `page` | `"A4"` หรือ `"Letter"` |
| `margins_cm` | (บน, ขวา, ล่าง, ซ้าย) |
| `footer_text` | คำนำหน้าเลขหน้า · `""` = เลขเปล่า |

### บล็อกระดับหน้า

| เมธอด | หมายเหตุ |
|-------|----------|
| `cover(title, subtitle, meta, note, logo, logo_width_cm=2.6, top_space_pt=150, page_break=True)` | โลโก้รับได้ทั้ง .png และ .emf แต่ **.svg ใช้ไม่ได้ใน python-docx** ต้องแปลงเป็น PNG ก่อน (`rsvg-convert -w 600` หรือ `cairosvg`) |
| `toc(heading="สารบัญ", levels="1-3")` | แทรก field TOC แล้วใน Word กด **Ctrl+A แล้ว F9** เพื่อให้รายการขึ้น (ตอนสร้างจะยังว่าง) |
| `page_break()` | |
| `landscape_section()` | เปิดส่วนแนวนอนสำหรับตารางกว้าง |

### หัวข้อและข้อความ

| เมธอด | ผลลัพธ์ |
|-------|---------|
| `h1(text)` `h2(text)` `h3(text)` | 16 / 12.5 / 11.5 pt · bold · brand / brand_deep / text · ตั้ง `outlineLvl` ให้ TOC เห็น |
| `para(text, size, color, bold, italic, align, space_after)` | `align` = `"center"｜"right"｜"justify"` (ไทยอย่าใช้ justify) |
| `rich([(text, opts), ...])` | หลายรูปแบบในย่อหน้าเดียว เช่น `[("สถานะ: ", {"bold": True}), ("อนุมัติ", {"color": "green"})]` |
| `bullets([...], style="List Bullet")` | `style="List Number"` สำหรับเลขลำดับ |
| `code(text)` | บล็อกโค้ดพื้นเทา |

### ตารางและข้อมูล

| เมธอด | หมายเหตุ |
|-------|----------|
| `table(headers, rows, widths=None, zebra=False, align=None, first_col_bold=False)` | `widths` หน่วย twips รวม **9360** สำหรับ A4 ขอบ 2 ซม. · `align` = list ต่อคอลัมน์ |
| `pill_table(headers, rows, status_col, palette, widths)` | `palette = {"เสร็จ": "green", "ค้าง": "red"}` · โทนที่ใช้ได้: green blue amber red violet grey |
| `kpi_row([(value, label), ...])` | 3–5 ช่องพอดี |
| `signoff([(role, name), ...])` | ตารางเซ็นอนุมัติ |

### อื่น ๆ

| เมธอด | หมายเหตุ |
|-------|----------|
| `callout(kind, title, body)` | kind = `tip｜note｜warning｜critical｜success｜question` |
| `figure(image_path, caption, width_cm=15.5, number=None)` | `number=1` จะขึ้นต้นคำบรรยายว่า "รูปที่ 1 — " |
| `save(path)` | |

### ฟังก์ชันระดับโมดูล

| ฟังก์ชัน | ใช้เมื่อ |
|----------|---------|
| `use_brand(**tokens)` | เปลี่ยนชุดสีทั้งชุด ต้องเรียก **ก่อน** สร้าง `BrandDoc` |
| `style_run(run, size, color, bold, italic, mono)` | ตั้งฟอนต์เอง (ครอบคลุม complex-script ให้แล้ว) |
| `shade(cell, token)` · `left_accent(cell, token, size)` | ระบายพื้น / แถบสีซ้ายของเซลล์ |
| `fixed_widths(table, widths)` | บังคับความกว้างคอลัมน์ |
| `set_borders(table)` · `no_borders(table)` | |
| `repeat_header(row)` · `keep_with_next(paragraph)` | |
| `add_field(paragraph, "PAGE")` | แทรก field ของ Word |
| `to_pdf(docx_path, outdir)` | เรียก LibreOffice แปลงเป็น PDF |

---

## brandkit_pptx.py — สไลด์ (.pptx)

```python
BrandDeck(template=None)      # 16:9 (13.333 × 7.5 นิ้ว)
```

| เมธอด | สไลด์ที่ได้ |
|-------|-------------|
| `title_slide(title, subtitle, meta)` | พื้นฟ้าอ่อน + เส้นแบรนด์คั่น |
| `section(title, kicker=None)` | แถบแบรนด์แนวตั้งซ้าย + ชื่อส่วน |
| `bullets_slide(title, items, subtitle=None)` | หัวข้อ + ขีดม่วงใต้หัวข้อ + bullet 17pt |
| `kpi_slide(title, items, subtitle=None)` | การ์ดตัวเลข |
| `table_slide(title, headers, rows, col_widths, subtitle, status_col, palette)` | `col_widths` เป็นสัดส่วน เช่น `[1, 4, 2, 2]` |
| `image_slide(title, image_path, caption, subtitle)` | รูปกลางสไลด์ พอดีกรอบอัตโนมัติ |
| `quote_slide(text, source)` | สไลด์คำพูด/ข้อสรุป |
| `save(path)` | |

**ข้อจำกัดที่ต้องรู้**

- สไลด์ทุกอันสร้างจาก layout ว่าง (`slide_layouts[6]`) จึงไม่มีช่อง placeholder ให้แก้ใน PowerPoint
  แบบเทมเพลตปกติ ถ้าลูกค้าต้องแก้เองเยอะ ให้ส่ง `template=` เป็นไฟล์ .pptx ขององค์กรแทน
- ตารางใน python-pptx ไม่มี API ปิดเส้นขอบตรง ๆ ถ้าอยากได้ตารางไม่มีเส้น ให้เรียงกล่องข้อความแทน
- ความสูงแถวตารางเป็นค่าต่ำสุด ข้อความยาวจะดันแถวสูงขึ้นเอง ให้เผื่อพื้นที่

---

## สูตรความกว้างคอลัมน์ (Word)

| จำนวนคอลัมน์ | ตัวอย่าง widths (รวม 9360) |
|:---:|---|
| 2 | `[2600, 6760]` — หัวข้อ/รายละเอียด |
| 3 | `[1400, 5960, 2000]` — รหัส/รายการ/ผู้รับผิดชอบ |
| 4 | `[1100, 4200, 1900, 2160]` — รหัส/รายการ/ผู้รับผิดชอบ/สถานะ |
| 5 | `[1000, 1800, 2560, 2000, 2000]` |
| 6 ขึ้นไป | ใช้ `landscape_section()` (พื้นที่ ≈ 14700 twips) |


## reference: palette-examples.md

# ตัวอย่างชุดสีที่เคยใช้จริง

> ⚠️ **นี่คือตัวอย่าง ไม่ใช่ค่ามาตรฐาน**
> เลือกสีจากเนื้องานตามข้อ 0 ของ `SKILL.md` ก่อนเสมอ
> ใช้ไฟล์นี้เพื่อดูว่าชุดที่ครบและผ่านเกณฑ์ contrast หน้าตาเป็นอย่างไร ไม่ใช่เพื่อคัดลอก

## ชุด A — น้ำเงิน–ม่วง (ซอฟต์แวร์ทั่วไป · สกัดจาก Apps Track)

โทนสว่าง โปร่ง นุ่มนวล ตัวอักษรเทาเย็น

```python
use_brand(
    brand="2A78D6", brand_2="6A5CD6", brand_deep="2A4C86",
    brand_tint="EDF1FB", brand_tint_2="F6F8FD",
    text="333B4A", text_body="414957", text_muted="7D8492", line="E4E7EE",
)
```

## ชุด B — เขียวอมฟ้า (การแพทย์ · สุขภาพ)

```python
use_brand(
    brand="0E8F86", brand_2="2F9E6E", brand_deep="0B5F5A",
    brand_tint="E6F4F2", brand_tint_2="F3FAF9",
    text="2C3A38", text_body="3A4846", text_muted="76857F", line="E1EAE8",
)
```

## ชุด C — กรมท่า (ราชการ · กฎหมาย)

```python
use_brand(
    brand="1F3C88", brand_2="5B4B8A", brand_deep="14275C",
    brand_tint="E8ECF7", brand_tint_2="F5F7FC",
    text="2B3245", text_body="3A4156", text_muted="767E93", line="E2E6F0",
)
```

## ชุด D — เหลืองอำพัน + เทาเหล็ก (อุตสาหกรรม · โรงงาน)

accent อุ่นบนโครงเทาเย็น — ใช้ accent เฉพาะจุดที่ต้องการให้สังเกต ไม่ใช่ทั้งหน้า

```python
use_brand(
    brand="B57509", brand_2="8C5A2B", brand_deep="7A4E05",
    brand_tint="FBF2E1", brand_tint_2="FDF9F1",
    text="2F3439", text_body="3E444A", text_muted="7B838B", line="E5E8EA",
)
```

## สีสถานะ — ชุดเดียวกันทุกแบรนด์

สีสถานะ**ไม่เปลี่ยนตามแบรนด์** เพราะความหมายของมันคงที่

| สถานะ | พื้น | ตัวอักษร |
|---|---|---|
| สำเร็จ | `E9F7EF` | `17794A` |
| ข้อมูล | `EAF2FD` | `2160AB` |
| เตือน | `FDF5E4` | `96660D` |
| ผิดพลาด | `FDEDEC` | `A63A34` |
| เน้น | `F1EEFC` | `52439F` |
| เป็นกลาง | `F2F4F8` | `626A7A` |

> ถ้าสีแบรนด์ชนกับสีสถานะตัวใดตัวหนึ่ง (เช่น แบรนด์เป็นเขียว) ให้เปลี่ยน**สีแบรนด์ในบริบทนั้น**
> อย่าเปลี่ยนสีสถานะ — ผู้อ่านตีความเขียวว่าผ่านไปแล้วก่อนอ่านข้อความ

## วิธีตรวจก่อนใช้

1. เนื้อความบนพื้น ≥ 4.5:1 · หัวข้อบนพื้น ≥ 7:1
2. พิมพ์ขาวดำแล้วยังแยกหัวข้อกับเนื้อความออก
3. เปิดไฟล์ที่เรนเดอร์แล้วดูด้วยตา ไม่ใช่เชื่อค่าในตาราง


---

# skill: architecture-patterns

Use when choosing system architecture (monolith, microservices, serverless), sync vs event-driven, or patterns like CQRS, Event Sourcing and Saga.

# Architecture Patterns

## When to use this skill

- Architecture decisions for a new system
- Choosing communication patterns between services
- Splitting a monolith into modules or microservices
- Designing event-driven systems
- Implementing Command Query Responsibility Segregation (CQRS), Event Sourcing or Saga
- Reviewing existing architecture
- Making decisions big enough for an Architecture Decision Record (ADR)

---

## High-Level Architecture Choice

### Decision tree

```
How many engineers? Team count? Domain complexity?
│
├─ <10 engineers, 1 team
│  └─ ✅ Monolith (modular monolith)
│
├─ 10-50 engineers, 2-5 teams
│  └─ ✅ Modular monolith OR few services
│
├─ 50+ engineers, 5+ teams
│  └─ Consider microservices (only if needed)
│
└─ Any size + spiky/event-driven workload
   └─ Add serverless for that piece
```

---

## Pattern 1: Modular Monolith

**The 2026 default for most teams.** One deployable app, split into modules with strict boundaries.

```
┌─────────────────────────────────────┐
│   Single deployable application     │
│ ┌───────┐ ┌───────┐ ┌───────────┐  │
│ │Module │ │Module │ │  Module   │  │
│ │  A    │ │  B    │ │     C     │  │
│ └───────┘ └───────┘ └───────────┘  │
│   ▲           ▲           ▲         │
│   └── Strict module boundaries ──┘  │
└─────────────────────────────────────┘
         │
         ▼
    Single DB (or per-module schemas)
```

**When to use:**
- ✅ Small/medium team (< 30 engineers)
- ✅ You need to ship changes fast
- ✅ Operations needs are simple
- ✅ All parts can deploy together

**When NOT to use:**
- ❌ Multiple teams needing independent deploys
- ❌ Features need very different scaling
- ❌ Parts need different tech stacks

**Implementation tips:**
- Enforce module boundaries (e.g., NestJS modules, Java packages, Go internal/)
- Each module exposes a public interface
- Don't let one module read another module's tables
- One DB, with a separate schema per module

---

## Pattern 2: Microservices

**When you've outgrown the monolith.**

```
┌──────┐  ┌──────┐  ┌──────┐
│ Svc A│  │ Svc B│  │ Svc C│
└──┬───┘  └──┬───┘  └──┬───┘
   │ ▲      │ ▲      │ ▲
   │ │      │ │      │ │     ← Each owns its DB
   ▼ │      ▼ │      ▼ │
  ┌──┴┐    ┌──┴┐    ┌──┴┐
  │DB │    │DB │    │DB │
  └───┘    └───┘    └───┘
```

**When to use:**
- ✅ Independent teams (Conway's Law)
- ✅ Different scaling needs per service
- ✅ Services need different languages or stacks
- ✅ Mature continuous integration and delivery (CI/CD) and monitoring already in place

**When NOT to use (most projects):**
- ❌ Small team — the extra overhead slows everyone down
- ❌ No Kubernetes (K8s) or infrastructure-as-code (IaC) skills on the team
- ❌ Can't afford distributed tracing
- ❌ Business areas don't have clear boundaries yet

**Hidden costs:**
- 💸 Much harder to operate (about 5x the ops effort)
- 💸 Network latency between services
- 💸 Transactions across services are hard
- 💸 Bugs are harder to trace
- 💸 You need a service mesh and a monitoring stack

> 🚨 **Microservices are an organizational scaling pattern**, not a tech pattern. Adopt them only when teams blocking each other is the real bottleneck.

---

## Pattern 3: Serverless / Functions

**For spiky, event-driven workloads.**

```
Event ──► Function ──► Service / DB / Queue
```

**Good fits:**
- ✅ Async background processing
- ✅ Scheduled tasks (cron)
- ✅ Glue code between services
- ✅ Spiky / unpredictable traffic
- ✅ Image/video processing pipelines

**Bad fits:**
- ❌ Long-running processes (the limit is usually 15 min)
- ❌ Processing that must keep state between calls
- ❌ Frequent calls that need a fast response (cold starts add delay)
- ❌ Heavy traffic all day (the bill climbs fast)

---

## Communication Patterns

### Synchronous (Request-Response)

```
Client ──HTTP/gRPC──► Server
       ◄──Response───
```

| Protocol | When |
|----------|------|
| REST | Public APIs, simple CRUD |
| GraphQL | Mobile clients, multiple read patterns |
| gRPC | Internal service-to-service |
| WebSocket | Real-time bidirectional |

**Pros:** Easy to reason about and debug
**Cons:** Services depend on each other directly, one failure spreads to the next, hard to scale each part on its own

### Asynchronous (Event-Driven)

```
Producer ──► Topic/Queue ──► Consumer(s)
         (publish)         (subscribe)
```

| Tech | When |
|------|------|
| Kafka | High throughput, event sourcing, replay needed |
| RabbitMQ | Traditional queuing, work distribution |
| SQS/SNS | AWS-native, simpler than Kafka |
| NATS | Lightweight, low-latency |
| Redis Pub/Sub | Simple, messages are not stored |

**Pros:** Services don't depend on each other directly, survive failures better, scale more easily
**Cons:** Data is consistent only after a delay (eventual consistency), harder to debug, message order is hard to guarantee

### When to choose which

```
Need immediate response? ─Yes─► Sync
                         └─No──► Async

Is producer impacted by consumer? ─Yes─► Sync
                                  └─No──► Async

Multiple consumers? ─Yes─► Async (pub/sub)
                   └─No──► Either
```

---

## Patterns 4–8: CQRS, Event Sourcing, Saga, API Gateway, Strangler Fig

Details for each are in [references/advanced-patterns.md](references/advanced-patterns.md). Load that file when the decision involves one of these:

- Pattern 4: CQRS (Command Query Responsibility Segregation)
- Pattern 5: Event Sourcing
- Pattern 6: Saga (Distributed Transactions)
- Pattern 7: API Gateway
- Pattern 8: Strangler Fig (Migration)

---

## Cross-Cutting Decisions

### Database per service vs Shared DB

| | Shared DB | DB per service |
|---|-----------|----------------|
| Coupling | 🔴 High | 🟢 Low |
| Consistency | 🟢 ACID (all-or-nothing transactions) | 🟡 Eventual |
| Schema changes | 🔴 Coordinate | 🟢 Independent |
| Performance | 🟢 Easy joins | 🔴 Network calls |
| Use when | Monolith | Microservices |

### Caching tiers

```
Browser cache ──► CDN ──► Reverse Proxy ──► App Cache (Redis) ──► DB
       1                  2                       3                4
       ▲                                                           ▲
       Closest to user (fastest)              Furthest (last resort)
```

Each tier is roughly 10x faster than the next. CDN = content delivery network.

### Idempotency

**Always design APIs so a repeated request does no extra harm:**
```
Client retries → Server detects duplicate → Same result, no side effect
```

Methods:
- Idempotency key header (Stripe pattern)
- A time window in which the server drops duplicates
- Methods that are safe to repeat by nature (PUT, unlike POST)

---

## Decision Matrix Template

When proposing architecture, compare options:

```markdown
| Factor | Weight | Option A | Option B | Option C |
|--------|:------:|:--------:|:--------:|:--------:|
| Performance | 30% | 8 | 9 | 7 |
| Cost | 20% | 9 | 6 | 8 |
| Team skill | 20% | 9 | 5 | 7 |
| Operations | 15% | 8 | 5 | 7 |
| Future-proof | 15% | 6 | 9 | 7 |
| **Total** | 100% | **7.95** | 7.10 | 7.20 |
```

---

## Anti-patterns

- ❌ **Microservices too early** — start with a monolith
- ❌ **Distributed monolith** — services that must deploy together
- ❌ **God service** — one service that does everything
- ❌ **Chatty interfaces** — one request fans out into many service calls (N+1)
- ❌ **Shared database across microservices** — all the coupling, none of the isolation
- ❌ **Synchronous calls in critical path** — cascading failures
- ❌ **No bulkheads** (no limits that isolate one service's resources) — one slow service drags everything down
- ❌ **Resume-driven architecture** — using K8s/microservices to look fancy

---

## Quick Reference: When to Use What

| Need | Pattern |
|------|---------|
| Small team, fast iteration | Modular monolith |
| Independent team deploys | Microservices |
| Spiky background jobs | Serverless |
| High write throughput, complex reads | CQRS |
| Full audit trail, view state at any past time | Event Sourcing |
| Multi-service transaction | Saga |
| Reduce service-to-service complexity | Service mesh |
| Multiple external clients | API Gateway |
| Migrate legacy system | Strangler Fig |

---

## Always Reference

When you make a decision, record it with the **adr-writer** skill. Architecture decisions are trade-offs. Future you, or whoever replaces you, needs to know why.


## reference: advanced-patterns.md

# Architecture Patterns — Advanced Pattern Catalogue

Details moved out of [SKILL.md](../SKILL.md). Load this file when the decision involves one of these patterns.

## Contents

- [Pattern 4: CQRS (Command Query Responsibility Segregation)](#pattern-4-cqrs-command-query-responsibility-segregation)
- [Pattern 5: Event Sourcing](#pattern-5-event-sourcing)
- [Pattern 6: Saga (Distributed Transactions)](#pattern-6-saga-distributed-transactions)
- [Pattern 7: API Gateway](#pattern-7-api-gateway)
- [Pattern 8: Strangler Fig (Migration)](#pattern-8-strangler-fig-migration)

---

## Pattern 4: CQRS (Command Query Responsibility Segregation)

**Use one model for writes and a separate model for reads.**

```
Commands ──► Write Model ──► Event Store
                              │
                              ▼
                          Projector
                              │
                              ▼
Queries ◄── Read Models (denormalized for query)
```

**When to use:**
- ✅ Read load and write load are very different
- ✅ Complex reporting / dashboards
- ✅ Multiple read views from same data

**When NOT to use:**
- ❌ Simple create/read/update/delete (CRUD) apps (far too much)
- ❌ Reads must always show the latest write

---

## Pattern 5: Event Sourcing

**Store every change as an event, not just the current state.**

```
Instead of:           Store:
Account                Events:
  balance: $100        ├─ AccountOpened
                       ├─ Deposit($50)
                       ├─ Deposit($75)
                       └─ Withdraw($25)

State is computed from events
```

**When to use:**
- ✅ Strong audit/compliance requirements
- ✅ Need to replay history
- ✅ Questions about the past ("balance at date X")
- ✅ Complex business logic with many state transitions

**When NOT to use:**
- ❌ Apps with simple state (too much)
- ❌ No team experience with it
- ❌ Don't need history/audit
- ❌ You must be able to delete data, e.g. under GDPR (events are hard to delete)

> ⚠️ **CQRS and Event Sourcing both add a lot of complexity. Use them only where they pay off.**

---

## Pattern 6: Saga (Distributed Transactions)

**When several services must all succeed or all roll back.**

### Orchestration (centralized)
```
Orchestrator
   │
   ├──► Service A (do step 1)
   │    [if fail → Orchestrator triggers compensations]
   ├──► Service B (do step 2)
   └──► Service C (do step 3)
```

### Choreography (decentralized)
```
Service A ──Event──► Service B ──Event──► Service C
   ▲                                            │
   └──────────── Compensation Event ────────────┘
```

| | Orchestration | Choreography |
|---|--------------|--------------|
| Visibility | 🟢 Central | 🔴 Distributed |
| Coupling | 🟡 Coupled to orchestrator | 🟢 Loosely coupled |
| Debugging | 🟢 Easier | 🔴 Hard |
| Adding services | 🟡 Update orchestrator | 🟢 Add subscriber |

**Choose orchestration** when: complex flow, need clear visibility
**Choose choreography** when: simple flow, many independent teams

---

## Pattern 7: API Gateway

```
Clients ──► API Gateway ──► Multiple Services
              │
              ├─ Routing
              ├─ Auth
              ├─ Rate limit
              ├─ Logging
              └─ Aggregation
```

**Tools:** Kong, AWS API Gateway, Envoy, Tyk, NGINX

**Use when:** external clients call many services, and you want auth, rate limits and logging in one place

---

## Pattern 8: Strangler Fig (Migration)

**Move off a monolith step by step.**

```
Phase 1:    Phase 2:           Phase 3:
[Monolith]  [Mono] [NewSvc]    [NewSvc1] [NewSvc2]
                ▲    │              ▲
                └────┘ Proxy routes  └── Old Monolith deprecated
                  selective traffic
```

**Steps:**
1. Pick one business area (bounded context) to pull out
2. Build new service for that context
3. Add a proxy or feature flag that routes part of the traffic
4. Gradually shift traffic to new service
5. Delete old code when fully migrated

> 💡 **Safer than rewriting everything at once.**


---

# skill: prior-art-review

Use when about to build something that may already exist (library, model, product, thesis approach). Compares candidates, licence, upkeep, adopt or build.

# สำรวจของที่มีอยู่แล้วก่อนลงมือทำ

> **กฎข้อเดียว:** จบที่**การตัดสินใจ** ไม่ใช่จบที่รายงาน
> ถ้าอ่านจบแล้วยังไม่รู้ว่าจะใช้ตัวไหน แปลว่ายังไม่เสร็จ

---

## ต่างจาก `reference-app-research` อย่างไร

| | `reference-app-research` | skill นี้ |
|---|---|---|
| ผลลัพธ์ | รายงาน feature · UI · UX + ข้อเสนอปรับปรุง | ตารางเทียบ + การตัดสินใจ + สิ่งที่ยอมแลก |
| คำถามตั้งต้น | "แอปนี้ดีและพังตรงไหน ของเราจะดีกว่าอย่างไร" | "ควรหยิบตัวไหนมาใช้ หรือทำเอง" |
| ใช้ร่วมกัน | แกะแอปต้นแบบที่จะสร้างแบบเดียวกัน | ตัดสินเรื่องไลบรารี เครื่องมือ หรือของที่จะนำมาใช้ แล้วบันทึก |

---

## 1 · ตั้งคำถามให้แคบก่อนค้น

คำถามกว้างจะได้รายชื่อยาวที่เทียบกันไม่ได้

```
❌ มีเครื่องมือถอดเสียงอะไรบ้าง
✅ ตัวไหนถอดเสียงไทยยาว 2 ชั่วโมงได้ แยกผู้พูดได้ รันบนเครื่องตัวเองได้
   และสัญญาอนุญาตให้ขายต่อได้
```

คำถามต้องมี **3 อย่าง** เสมอ: สิ่งที่ต้องทำได้ · ข้อจำกัดที่ยอมไม่ได้ · เงื่อนไขการนำไปใช้

**เขียนคำถามลงไฟล์ก่อนค้น** ไม่งั้นพอเจอของสวย ๆ จะเผลอเปลี่ยนคำถามให้เข้ากับของที่เจอ

---

## 2 · ดูให้ครบสี่แหล่ง

| แหล่ง | หาอะไร | สัญญาณที่ต้องเก็บ |
|---|---|---|
| โค้ดโอเพนซอร์ส | ของที่หยิบมาใช้ได้ทันที | สัญญาอนุญาต · commit ล่าสุด · จำนวนผู้ดูแล |
| ผลิตภัณฑ์ที่ขายอยู่ | ตลาดยอมจ่ายเท่าไหร่ ของเขาขาดอะไร | ราคา · สิ่งที่เขาไม่ทำ · คำบ่นของผู้ใช้ |
| งานวิจัย | วิธีที่ดีกว่าที่ยังไม่มีใครทำเป็นผลิตภัณฑ์ | ปีที่ตีพิมพ์ · มีโค้ดให้ไหม · ทำซ้ำได้ไหม |
| มาตรฐานและข้อกำหนด | สิ่งที่ห้ามคิดเอง | หมายเลขมาตรฐาน · ฉบับล่าสุด |

**แหล่งที่คนลืมบ่อยที่สุดคือมาตรฐาน** ถ้าเขียนรูปแบบไฟล์เองทั้งที่มีมาตรฐานอยู่แล้ว
ก็เท่ากับสร้างงานให้ตัวเองและปิดทางเชื่อมกับระบบอื่น

---

## 3 · ตารางเทียบ — หกคอลัมน์นี้ต้องมีเสมอ

| ตัวเลือก | ทำสิ่งที่เราต้องได้ไหม | สัญญาอนุญาต | โครงการยังมีชีวิตไหม | ต้องยอมแลกอะไร | ต้นทุนจริง |
|---|---|---|---|---|---|

- **คอลัมน์ "ทำสิ่งที่เราต้องได้ไหม" ไม่ใช่รายการความสามารถ** ให้ตอบเฉพาะข้อที่เราถามในข้อ 1
- **ต้นทุนจริง** รวมค่าเรียนรู้ ค่าดูแล และค่าย้ายออกถ้าวันหนึ่งต้องเลิกใช้ ไม่ใช่แค่ค่าลิขสิทธิ์
- เรียงแถวตามความเหมาะสม ให้ตัวที่แนะนำอยู่บนสุด
- **ปิดท้ายด้วยข้อสรุป 1 บรรทัดเสมอ**

---

## 4 · สัญญาอนุญาต — ตรวจก่อน อย่าตรวจทีหลัง

**เรื่องนี้ถ้ารู้ช้าจะเจ็บที่สุด** เพราะถ้ามารู้ตอนใกล้ส่งมอบ ก็ต้องรื้อ

| กลุ่ม | ตัวอย่าง | ใช้ในของที่ขายได้ไหม |
|---|---|---|
| ปล่อยเสรี | MIT · Apache-2.0 · BSD | ได้ แต่ Apache-2.0 มีเงื่อนไขเรื่องสิทธิบัตรเพิ่ม |
| ต้องเปิดโค้ดต่อ | GPL-3.0 · AGPL-3.0 | ได้แต่**ต้องเปิดโค้ดของเรา** และ AGPL นับรวมการให้บริการผ่านเครือข่ายด้วย |
| ห้ามเชิงพาณิชย์ | CC BY-NC · โมเดลที่เขียนว่า research only | **ขายไม่ได้** แต่ใช้ทดลองและเทียบผลได้ |
| เฉพาะราย | ต้องอ่านสัญญาจริง | ขึ้นกับข้อสัญญา |

**กฎ 2 ข้อที่พลาดกันบ่อย**

1. **โมเดลปัญญาประดิษฐ์มีสัญญาแยกจากโค้ด** — โค้ดอาจเป็น MIT แต่น้ำหนักโมเดลเป็น non-commercial ก็ได้
2. **สัญญาตกทอดไปถึงโมเดลที่ต่อยอด** — เช่น โมเดลที่ fine-tune มาจากโมเดล non-commercial ก็ยัง non-commercial

ทุกตัวที่จะใช้จริง ต้อง**เขียนชื่อสัญญาอนุญาตลงไฟล์** ไม่ใช่จำไว้

---

## 5 · โครงการยังมีชีวิตไหม

| สัญญาณ | ตีความ |
|---|---|
| commit ล่าสุดเกิน 12 เดือน | ตายแล้ว เว้นแต่เป็นของที่นิ่งจริง เช่นไลบรารีคณิตศาสตร์เล็ก ๆ |
| ผู้ดูแลคนเดียว | ความเสี่ยงสูง ถ้าคนนั้นหายไปก็จบ |
| issue ค้างเป็นร้อยไม่มีใครตอบ | ไม่มีใครดูแลจริง |
| ไม่มีการออกรุ่นเลยในปีที่ผ่านมา | เหมือนข้อแรก |
| เอกสารตรงกับโค้ดรุ่นเก่า | จะเสียเวลาเดามาก |
| ไม่มี test ในโครงการ | ยกรุ่นทีไรพังทุกที |

**ของที่ตายแล้วยังใช้ได้** ถ้ายอมรับว่าจะต้องดูแลเอง แต่ต้องรู้ตัวตั้งแต่ต้น ไม่ใช่มารู้ตอนติดปัญหา

---

## 6 · จบด้วยหนึ่งในสี่ทาง

| ทาง | เมื่อไหร่ | สิ่งที่ต้องบันทึก |
|---|---|---|
| **ใช้เลย** | ตรงความต้องการ ≥80% สัญญาอนุญาตผ่าน และยังมีชีวิต | รุ่นที่ล็อกไว้ · สิ่งที่มันทำไม่ได้ |
| **แยกไปแก้เอง** | ใกล้เคียงมากแต่ขาดบางอย่าง และสัญญาอนุญาตให้แก้ได้ | แก้อะไรบ้าง · จะตามรุ่นต้นทางอย่างไร |
| **ทำเอง** | ไม่มีตัวไหนผ่านข้อจำกัดที่ยอมไม่ได้ | ตัวที่ใกล้ที่สุดคือตัวไหน และขาดอะไร |
| **ไม่ทำ** | มีของที่ดีกว่าอยู่แล้วในราคาที่ถูกกว่าทำเอง | เหตุผล และเงื่อนไขที่จะกลับมาคิดใหม่ |

**"ทำเอง" ต้องมีเหตุผลที่เขียนออกมาได้** ส่วน "อยากคุมเอง" ไม่ใช่เหตุผล
ต้องบอกได้ว่าคุมเองแล้วได้อะไรที่หยิบของเขามาใช้แล้วไม่ได้

---

## 7 · บันทึกสิ่งที่ยอมแลก

ทุกทางเลือกต้องแลกบางอย่างไป **ถ้าไม่บันทึกวันนี้ อีก 6 เดือนจะไม่มีใครจำได้**
ให้บันทึกเป็น Architecture Decision Record ด้วย `adr-writer` อย่างน้อย 3 บรรทัด

```
เลือก: <ตัวเลือก>  เพราะ <เหตุผลหลักข้อเดียว>
ยอมแลก: <สิ่งที่เสียไป>
จะกลับมาคิดใหม่เมื่อ: <เงื่อนไขที่วัดได้>
```

---

## 8 · ฉบับงานวิจัย

ผลลัพธ์ไม่ใช่ "ใช้ตัวไหน" แต่คือ **"ช่องว่างอยู่ตรงไหน"**

- เปลี่ยนคอลัมน์ของตารางเทียบเป็น: งาน · ปี · วิธีที่ใช้ · ชุดข้อมูล · ผลที่รายงาน · ข้อจำกัดที่เขาบอกเอง
- **คอลัมน์ "ข้อจำกัดที่เขาบอกเอง" คือที่มาของช่องว่าง** เพราะส่วนใหญ่ผู้เขียนบอกไว้เองในหัวข้อสุดท้าย
- ช่องว่างที่ใช้ได้ต้องเป็นอย่างใดอย่างหนึ่ง: ยังไม่มีใครทดสอบกับบริบทนี้ · วิธีเดิมใช้ไม่ได้เมื่อเงื่อนไขเปลี่ยน · ผลที่รายงานทำซ้ำไม่ได้
- **ห้ามอ้างงานที่ยังไม่ได้อ่านตัวเต็ม** เพราะการอ่านแค่บทคัดย่อแล้วอ้าง คือความผิดพลาดที่กรรมการจับได้เร็วที่สุด
- งานที่หาโค้ดหรือชุดข้อมูลไม่ได้ ให้ระบุไว้ว่าทำซ้ำไม่ได้ อย่าเงียบไว้

---

## 9 · Anti-patterns

- ❌ **ค้นจนได้รายชื่อ 20 ตัวแล้วไม่ตัดสินใจ** — รายชื่อไม่ใช่ผลงาน
- ❌ **เทียบด้วยรายการความสามารถ** — ทุกตัวจะดูดีหมด เพราะทุกคนเขียนหน้าแรกเก่ง
- ❌ **ตรวจสัญญาอนุญาตหลังเขียนโค้ดไปแล้ว**
- ❌ **เชื่อหน้าแรกของโครงการ** — ต้องดู commit และ issue จริง
- ❌ **"ทำเองเร็วกว่า" โดยไม่เคยลองของที่มี**
- ❌ **ไม่บันทึกสิ่งที่ยอมแลก** — ทีมจะถกเรื่องเดิมซ้ำทุก 6 เดือน
- ❌ **ลืมมาตรฐานที่มีอยู่แล้ว** แล้วประดิษฐ์รูปแบบข้อมูลเอง

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| แกะแอปต้นแบบที่จะทำแบบเดียวกัน — feature · UI · UX · ข้อเสนอปรับปรุง | `reference-app-research` |
| บันทึกการตัดสินใจ | `adr-writer` |
| เทียบรูปแบบสถาปัตยกรรม ไม่ใช่เทียบเครื่องมือ | `architecture-patterns` |
| รูปทรงของตารางเทียบในคำตอบ | `answer-shape` |
| ตัดข้อเสนอให้เหลือเท่าที่จำเป็น | `simplicity-first` |
| ไฟล์ที่ดาวน์โหลดหรือแปลงระหว่างสำรวจ | `temp-file-discipline` |

---

## ตัวย่อ

- **MIT** — Massachusetts Institute of Technology License (สัญญาอนุญาตแบบปล่อยเสรี)
- **GPL** — General Public License (ใช้ได้แต่ต้องเปิดโค้ดที่ต่อยอด)
- **AGPL** — Affero General Public License (เหมือน GPL และนับรวมการให้บริการผ่านเครือข่าย)
- **BSD** — Berkeley Software Distribution License
- **CC BY-NC** — Creative Commons Attribution-NonCommercial (ห้ามใช้เชิงพาณิชย์)
- **ADR** — Architecture Decision Record (บันทึกการตัดสินใจเชิงสถาปัตยกรรม)


---

# skill: diagram-figures

Use when an architecture or concept figure must look designed for a proposal, slide, print or sign-off. Hand-laid HTML or SVG figures, official icon sets.

> **สีเริ่มต้น = ชุดสีประจำบ้าน** · ถ้า `doc-theme` ไม่ได้กำหนดสีเน้น (accent) เฉพาะงาน ให้ใช้ชุดใน `polished-document-style` ("ค่าตั้งต้นประจำบ้าน") ซึ่งเป็นสีแบรนด์ `#2A78D6` ชุดเดียวกับสไลด์และเอกสาร

# Diagram Figures

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

skill นี้คือ house style เดียวของรูปที่ต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" มี 2 engine ซึ่งใช้สี ไอคอน และกติกาชุดเดียวกัน

## เลือกทาง

| ต้องการ | ไปที่ |
|---|---|
| รูปที่ต้องดูออกแบบมา สำหรับข้อเสนอลูกค้า · สไลด์ · งานพิมพ์ · เอกสารเซ็นรับ รวมถึงผังคลาวด์ที่ต้องมีโลโก้จริง | **skill นี้ — HTML layout engine** (ค่าเริ่มต้น · ข้อ 2) |
| รูปแบบเดียวกัน แต่ต้อง generate จากข้อมูลหรือโค้ด เช่น ออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือต้องคุมพิกัดบนกริดเอง | **skill นี้ — SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| ไดอะแกรมที่อยู่ในเอกสาร markdown · README · Pull Request · เอกสารในทีม | [`software-diagrams`](../software-diagrams/SKILL.md) (Mermaid ธีมประจำบ้าน · ถ้าเป็นผังคลาวด์ใน repo ที่ต้องมีโลโก้ ใช้ไลบรารี `diagrams` ใน skill เดียวกัน) |
| ตัดสินใจว่าจะฝังรูปในไฟล์ markdown แบบไหน (inline SVG · ไฟล์ภาพ · ASCII · Mermaid) | [`markdown-visuals`](../markdown-visuals/SKILL.md) |

ต้นทุนของ skill นี้คือ **เวลา** เพราะ 1 รูปต้องแก้หลายรอบ
ดังนั้นให้ใช้กับรูปที่คนนอกทีมจะเห็น และเห็นซ้ำหลายครั้งเท่านั้น

## 1 · ตอบสามข้อก่อนเปิดไฟล์

1. **รูปนี้ไปอยู่ที่ไหน** — สไลด์ 16:9 · หน้า A4 · หน้าจอ
   แล้วกำหนด `.sheet{width:...}` ตามนั้น: สไลด์ 1600px · A4 แนวตั้ง 1240px · A4 แนวนอน 1750px
2. **ผู้อ่านคือใคร** — ถ้าเป็นลูกค้าที่ไม่ใช่ช่าง ให้เขียนชื่อกล่องเป็นภาษาไทย ส่วนทีมเทคนิคอ่านชื่อจริงของ service
3. **คำถามเดียวที่รูปนี้ตอบคืออะไร** — กฎข้อเดียวของ `software-diagrams` ยังใช้อยู่

## 2 · เลือกโครง

มี 3 โครงในโฟลเดอร์ `assets/` ให้**คัดลอกไปแก้ อย่าเริ่มเขียนเอง** ส่วนรายละเอียดของแต่ละโครงอยู่ในไฟล์ที่ลิงก์ไว้

| คำถามที่รูปตอบ | โครง | รายละเอียด |
|---|---|---|
| "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" — C4 ระดับ 1 | [`figure-context.html`](assets/figure-context.html) | [layout-context.md](references/layout-context.md) |
| "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" — deployment · container | [`figure-template.html`](assets/figure-template.html) | [layout-deployment.md](references/layout-deployment.md) |
| "ใช้บริการอะไรของคลาวด์บ้าง" — ต้องมีโลโก้ AWS · Azure · Google Cloud ของจริง | [`figure-cloud.html`](assets/figure-cloud.html) | [layout-cloud.md](references/layout-cloud.md) |

ทุกโครงใช้สี ขนาด ฟอนต์ และสคริปต์ลากเส้นชุดเดียวกัน ต่างกันแค่การจัดวาง

## 3 · หัวรูปต้องมีครบห้าอย่าง

ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ

เหตุผลไม่ใช่ความสวย แต่เป็นเพราะรูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมล ในสไลด์ ในเอกสารสัญญา
แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ:

```
❌ ภาพรวมระบบ Dr Screening
✅ เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## 4 · ระบบขนาด

**ขนาด ระยะ และมุม อยู่ใน `:root` ของ `assets/figure-template.html` แล้ว อย่าตั้งค่าใหม่เอง**
ตัวเลขพวกนี้ปรับจนรูปดูตั้งใจแล้ว ถ้าขยับเมื่อไหร่ รูปในเอกสารเดียวกันจะดูไม่เท่ากัน

| อย่าง | ค่า |
|---|---|
| ตัวอักษร | ชื่อรูป 30 · ชื่อกล่อง 16 · คำอธิบาย 13.5 · ป้ายกลุ่ม 12 ตัวใหญ่ |
| ไอคอน | กรอบ 66px · มุม 18px · ไอคอน 29px · เส้น 1.6px |
| กล่อง | มุม 20px · ขอบ 1px เทาอ่อน · กล่องซ้อนใน มุม 16px พื้นเทาอ่อนมาก |
| กล่อง `.focus` | ขอบ 2px สี `--accent` เฉดเข้ม · มุม 22px |
| ระยะ | 12 · 20 · 26 · 34 · 48 · ช่องว่างระหว่างคอลัมน์ 130 |

> **กรอบไอคอนต้องใหญ่** — 66px คือจุดที่รูปเริ่มดูตั้งใจ ไม่ใช่ผังที่ generate มา
> ถ้าต่ำกว่า 56px ไอคอนจะกลายเป็นจุดเล็ก ๆ ในกล่องใหญ่ และรูปจะดูโหวง

## 5 · ระบบสี

**สีมาจากเนื้องาน** ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้น (ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")
ถ้ามีสีแบรนด์อยู่แล้วให้ใช้สีนั้น ส่วนถ้ายังไม่มี ให้เสนอโทนจาก [references/colour-by-domain.md](references/colour-by-domain.md) แล้วรอยืนยัน

ในโครง HTML ให้แก้ที่ `--accent` ใน `:root` ที่เดียว แล้วเฉดอ่อนและเข้มจะคำนวณจากค่านั้น (ส่วน SVG/Python engine แก้ที่ `ACCENT` ใน `theme.py`)

ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์:

- **สีโลโก้ผู้ให้บริการ** — AWS ส้ม Azure ฟ้า ต้องเป็นสีจริงของเขา ไม่ใช่สีแบรนด์เรา
- **เทาโครงสร้าง** — เส้นขอบและพื้นกล่องต้องจางพอที่จะไม่แย่งสายตากับเนื้อหา

**สีไอคอนมี 7 กลุ่ม และแต่ละกลุ่มต้องมีความหมาย**

| คลาส | ใช้กับ |
|---|---|
| `t-neutral` | คน อุปกรณ์ ของนอกระบบ ที่เก็บไฟล์ธรรมดา |
| `t-edge` | ทางเข้า-ออก · gateway · API |
| `t-app` | เครื่องมือที่ผู้ใช้ทำงานด้วย |
| `t-view` | ส่วนที่ผู้ใช้ใช้ดูหรืออ่านผล |
| `t-data` | ฐานข้อมูล · สำรองข้อมูล |
| `t-alert` | คิว งานที่ค้างได้ ของที่พังแล้วเจ็บ |
| `t-warn` | ของที่มีเงื่อนไข — สัญญาอนุญาต ข้อจำกัดทางกฎหมาย |

ทุกกรอบมี**พื้นอ่อนกับขอบในโทนเดียวกัน** ไม่ใช่พื้นสีทึบ เพราะสีทึบจะดึงสายตาไปจากเนื้อหา
ถ้าอยากได้สีที่ 8 แปลว่ากำลังใช้สีเพื่อความสวย ไม่ใช่เพื่อสื่อความหมาย

## 6 · ไอคอน — ใช้ของทางการจากคลัง และวาดเองเฉพาะเมื่อไม่มี

**มีไอคอนทางการของบริการนั้นหรือไม่** เป็นตัวตัดสิน

- **ถ้ามี** (AWS · Azure · Google Cloud · Kubernetes · เครื่องมือโอเพนซอร์สส่วนใหญ่) ให้ใช้ของทางการจาก `assets/`
  คือ 205 ตัวที่คัดไว้ใน `assets/icons/` หรือคลังเต็มผ่าน `python assets/find-icon.py <ชื่อ>` ชุดเหล่านี้เผยแพร่มาเพื่อวาดผังสถาปัตยกรรมโดยเฉพาะ ส่วนรายการกลุ่ม คำสั่ง และสัญญาอนุญาตอยู่ใน [references/icons.md](references/icons.md)
- **ถ้าไม่มี** หรือเป็นของที่เราสร้างเอง ให้วาดไอคอนเส้นเอง แล้วเขียนที่เชิงอรรถว่า
  ไอคอนไม่ใช่โลโก้ทางการ (โครง `figure-template.html` มีบรรทัดนี้ให้แล้ว)
- **ห้ามปนกัน**ในรูปเดียว เพราะโลโก้สีจัดข้าง ๆ ไอคอนเส้นบางทำให้รูปดูไม่เสร็จ

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน
รูปทรงต้องอ่านออกที่ขนาด 24px เพราะลายละเอียดเกิน 3 เส้นจะกลายเป็นก้อนดำ

## 7 · สายเชื่อม

**ในคอลัมน์เดียวกัน** ให้ใช้ลูกศรลง `.down` ระหว่างกล่อง โดยไม่ต้องเขียนอะไรเพิ่ม

**ข้ามคอลัมน์** ให้ใช้รายการ `WIRES` ท้ายไฟล์ แล้วสคริปต์จะลากเส้นให้หลังจัดหน้าเสร็จ:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^id ต้นทาง   ^ด้านออก  ^id ปลายทาง  ^ด้านเข้า ^ตำแหน่งบนขอบ 0=บน 1=ล่าง
```

ที่ต้องคำนวณหลังจัดหน้า เพราะตำแหน่งกล่องขึ้นกับความยาวข้อความไทย
ถ้าเขียนพิกัดตายตัวไว้ พอแก้ข้อความทีเดียวเส้นจะหลุดทั้งรูป

**กติกา:**

- **ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์** ไม่อย่างนั้นป้ายจะทับกล่องหรือบังเส้นจนหาย ถ้าป้ายยาวขึ้น ต้องเพิ่ม `gap` ของ `.stage` ตามไปด้วย
- เลื่อนป้ายไปตามเส้นได้ด้วย `lp` (0 = ต้นทาง · 1 = ปลายทาง · ไม่ใส่ = กลางเส้น)
- เส้นที่ยังไม่ได้เชื่อมจริง ให้ใช้ `planned:true` เพื่อได้เส้นประ แล้ว**เขียนความหมายไว้ที่เชิงอรรถ**
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป เพราะเกินนี้รูปจะกลายเป็นใยแมงมุม
- ต่อเข้า**กล่องเล็กที่สุดที่ถูกต้อง** ไม่ใช่กล่องใหญ่ที่ครอบอยู่ ถ้ากล่องสูงมาก ให้ใส่ `tp` เพื่อเลี่ยงไม่ให้เส้นจ่อกลางกล่อง
- ป้ายบนเส้นบอกว่า**อะไรไหลผ่าน** เช่น `HTTPS 443` ไม่ใช่ `เชื่อมต่อ` ส่วนเส้นที่ไม่มีอะไรจะบอก ไม่ต้องใส่ป้ายเลยดีกว่าใส่คำว่า "ใช้"

## 8 · ภาษาไทย

- **`line-height` ต่ำกว่า 1.5 ไม่ได้** เพราะสระบนกับวรรณยุกต์ซ้อนกัน 2 ชั้นจะโดนตัด ด้วยเหตุผลเดียวกันจึง **ห้ามกำหนดความสูงตายตัวให้กล่องข้อความ**
- ฟอนต์เรียงตามนี้ `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` ซึ่งตั้งไว้ในโครงแล้ว
  ถ้าเครื่องไม่มีสักตัว จะตกไปใช้ฟอนต์ที่วางสระผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**
- **ไทยไม่เว้นวรรคระหว่างคำ** เบราว์เซอร์จึงตัดบรรทัดกลางคำ ถ้าข้อความยาวให้ใส่ `<br>` เอง
- ตัวอักษรไทยดูเล็กกว่าอังกฤษที่ขนาดเท่ากัน ดังนั้นคำอธิบายอย่าต่ำกว่า 12px

## 9 · เรนเดอร์แล้วเปิดดู — ห้ามข้าม

```bash
pip install playwright && playwright install chromium
python assets/render-figure.py figure.html figure.png 2
```

ใช้ตัวคูณ **2** เสมอ เพราะตัวคูณ 1 ได้ภาพเบลอเมื่อเอาไปขยายในสไลด์ จากนั้นเปิดไฟล์ภาพดูด้วยตา แล้วไล่ตามนี้:

- [ ] สายข้ามคอลัมน์มีหัวลูกศรครบทุกเส้นไหม · เส้นพาดทับกล่องหรือทับตัวหนังสือไหม
- [ ] ป้ายบนเส้นอ่านออกไหม และไม่ทับกันเองไหม
- [ ] ข้อความไทยครบไหม สระหรือวรรณยุกต์หายไหม มีคำไหนถูกตัดกลางคำไหม
- [ ] กล่อง `.focus` มีกล่องเดียวจริงไหม · หัวรูปมีครบ 5 อย่างไหม
- [ ] ย่อรูปลงเหลือความกว้าง 25% แล้วยังแยกออกไหมว่าอะไรอยู่ตรงไหน
- [ ] คนที่ไม่เคยเห็นระบบนี้ ตอบคำถามต้นทางได้ไหม

## 10 · กับดักที่เจอจริง

ถ้ารูปออกมาผิด เช่น หัวลูกศรหาย เส้นลากผิดกล่อง สระไทยหาย หรือป้ายทับกล่อง ให้เปิดตารางอาการ → สาเหตุ → ทางแก้ใน [references/pitfalls.md](references/pitfalls.md) ก่อนแก้เอง

## 11 · Anti-patterns

- ❌ **ใช้ skill นี้กับรูปในทีม** — เสียเวลา 10 เท่าเพื่อความสวยที่ไม่มีใครต้องการ
- ❌ **ใช้โลโก้ทางการในลักษณะที่ดูเหมือนผู้ให้บริการรับรอง** — ข้อ 6 และ [icons.md](references/icons.md)
- ❌ **กล่อง `.focus` 2 กล่อง** — แปลว่ารูปตอบ 2 คำถาม
- ❌ **ส่งไฟล์ HTML ให้ลูกค้า** — ให้ส่ง PNG ส่วนไฟล์ HTML คือแหล่งที่มา เก็บไว้ใน repo
- ❌ **ไม่เก็บไฟล์ HTML** — ปีหน้าต้องแก้รูป แล้วต้องวาดใหม่ทั้งใบ
- ❌ **รูปไม่มีวันที่และเจ้าของ**
- ❌ **ไอคอนต่างสไตล์ปนกัน** — เส้นบางปนเส้นหนา ปนไอคอนทึบ

## 12 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ไดอะแกรมในเอกสาร markdown | `software-diagrams` |
| เลือกวิธีฝังรูปในไฟล์ markdown | `markdown-visuals` |
| เอารูปไปวางในสไลด์ | `presentation-design` |
| เอารูปไปวางในไฟล์ Word / PDF | `branded-document-design` |
| รูปในเอกสาร SRS | `srs-writing` |
| สีและระยะห่างของหน้าจอแอป (คนละระบบกับรูปนี้) | `ui-craft` |

## ตัวย่อ

HTML — HyperText Markup Language · PNG — Portable Network Graphics · SVG — Scalable Vector Graphics · CSS — Cascading Style Sheets


## reference: colour-by-domain.md

# ตารางเนื้องาน → โทนสี

ใช้เมื่อเอกสารยังไม่มี `doc-theme` และยังไม่มีสีแบรนด์ ให้เสนอโทนจากตารางนี้แล้วรอผู้ใช้ยืนยัน ห้ามเลือกสีเองเงียบ ๆ ตารางนี้ใช้ร่วมกันทั้ง 2 engine ของ `diagram-figures` และทุก skill ที่วาดรูป

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |


## reference: engine-svg-python.md

# SVG/Python engine — รูปที่ generate จากข้อมูลหรือโค้ด

ทางที่ 2 ของ `diagram-figures` ใช้แทนโครง HTML เมื่อรูปต้องสร้างจากข้อมูลหรือโค้ด เช่น รูปหลายใบที่ต้องออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือรูปที่ต้องคุมตำแหน่งทุกจุดเองบนกริดด้วยเส้นตั้งฉากมุมโค้ง
Python เขียน SVG ลงกริดแล้วเรนเดอร์เป็น PNG ส่วนไอคอนและโลโก้มาจากคลังเดียวกับโครง HTML ([icons.md](icons.md))

ข้อเสียคือใช้เวลา เพราะ 1 รูปต้องแก้หลายรอบ ดังนั้นให้ใช้เฉพาะรูปที่คนนอกทีมจะเห็นและเห็นซ้ำ

> **สีเริ่มต้น = ชุดประจำบ้าน** · ถ้า `doc-theme` ไม่ได้กำหนดสีเน้น (accent) เฉพาะงาน ให้ใช้ชุดใน `polished-document-style` ("ค่าตั้งต้นประจำบ้าน") ซึ่งเป็น brand `#2A78D6` ชุดเดียวกับสไลด์และเอกสาร

---

**สารบัญ**
- [0 · สีมาจากเนื้องาน — ถามก่อนวาด](#0--สีมาจากเนื้องาน--ถามก่อนวาด)
- [1 · ลำดับการทำงาน](#1--ลำดับการทำงาน)
- [2 · โครงไฟล์](#2--โครงไฟล์)
- [3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง](#3--กฎข้อที่หนึ่ง--กริดก่อน-เส้นทีหลัง)
- [4 · เส้นเชื่อม](#4--เส้นเชื่อม)
- [5 · ป้ายบนเส้น — สองบทบาทเท่านั้น](#5--ป้ายบนเส้น--สองบทบาทเท่านั้น)
- [6 · โซน](#6--โซน)
- [7 · ไอคอนและโลโก้](#7--ไอคอนและโลโก้)
- [8 · เรนเดอร์](#8--เรนเดอร์)
- [9 · วงจรตรวจงาน — ห้ามข้าม](#9--วงจรตรวจงาน--ห้ามข้าม)
- [10 · ค่าคงที่ที่ใช้ได้จริง](#10--ค่าคงที่ที่ใช้ได้จริง)
- [11 · แถบสัญลักษณ์](#11--แถบสัญลักษณ์)
- [ตัวย่อ](#ตัวย่อ)

## 0 · สีมาจากเนื้องาน — ถามก่อนวาด

**ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้นและอย่าถามซ้ำ**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร") ถ้ายังไม่มี ให้ทำตามข้างล่างนี้แล้วเขียนกลับลง `doc-theme`

**ห้ามเลือกสีเอง และห้ามใช้ค่าเริ่มต้นเงียบ ๆ** ให้ถามผู้ใช้ว่าจะใช้สีอะไร
ถ้าผู้ใช้ยังไม่ระบุ ให้เสนอโทนจากเนื้องานตามตารางใน [colour-by-domain.md](colour-by-domain.md) แล้วรอยืนยัน

ใส่**สีหลักสีเดียว**ที่ `ACCENT` ใน `assets/svg-engine/theme.py` แล้วเฉดอ่อนและเข้มทั้งหมด
จะคำนวณจากสีนั้นด้วย `tint()` โค้ดวาดรูปจึงไม่มีสีอื่นฝังอยู่

สีเดียวที่ไม่ผูกกับ `ACCENT` คือ `EXCEPT_HUE` สำหรับป้าย "ข้อยกเว้น" ซึ่งต้องต่างจากสีหลักเสมอ
ถ้าสีหลักเป็นส้มอยู่แล้ว ให้เปลี่ยน `EXCEPT_HUE` เป็นสีอื่นที่ตัดกัน

---

## 1 · ลำดับการทำงาน

1. อ่านไดอะแกรมที่มีอยู่ทั้งหมดก่อน แล้วถามว่า**รูปนี้ตอบคำถามอะไร** — 1 รูปตอบ 1 คำถาม
2. ถามสีตามข้อ 0
3. **วางตำแหน่งทุกกล่องลงกริดก่อนลากเส้น** — ข้อนี้สำคัญที่สุด ดูข้อ 3
4. แก้ `theme.py` และ `ref.py` ให้เสร็จก่อน แล้วค่อยเขียนไฟล์รูป
5. **เรนเดอร์แล้วเปิดไฟล์ภาพดูจริง** ไม่ใช่แค่เช็กว่าสคริปต์รันผ่าน
6. เมื่อได้รูปที่สะอาดแล้ว จึงเขียนลงโฟลเดอร์ปลายทาง ส่วนรูปเก่าให้ย้ายไป `_to_delete/`

---

## 2 · โครงไฟล์

```
architecture/
  01-system-context.png      ← ผลลัพธ์ เลขนำหน้าเรียงตามลำดับการอ่าน
  _src/
    theme.py                 ← สีทั้งหมด — แก้ที่นี่ที่เดียว
    ref.py                   ← ภาษาภาพ: โซน หน่วย เส้น ป้าย แถบสัญลักษณ์
    render.py                ← SVG → PNG ด้วย Playwright ที่ 2 เท่า
    d01.py … dNN.py          ← หนึ่งไฟล์ต่อหนึ่งรูป มีแต่การจัดวาง
    logos/                   ← โลโก้ผลิตภัณฑ์ + colors.json
```

ให้คัดลอกทั้งโฟลเดอร์ [`assets/svg-engine/`](../assets/svg-engine/) ไปเป็น `_src/` แล้วเริ่มงาน — [`d01.py`](../assets/svg-engine/d01.py) เป็นรูปตัวอย่างที่เรนเดอร์ได้จริง

---

## 3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง

เส้นเฉียงทำให้อ่านยาก แต่การดัดเส้นทีหลังไม่ช่วย **ต้องแก้ที่ตำแหน่ง**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # คอลัมน์
R1,R2,R3          = 288,458,624                  # แถว ห่างกัน ~170
```

ทุกกล่องอยู่บนจุดตัดของคอลัมน์กับแถว และไม่มีตัวไหนหลุดกริด
เมื่อทุกจุดอยู่บนเส้นเดียวกัน เส้นเชื่อมก็ตั้งฉากได้เองโดยไม่ต้องดัด

### กฎจุดกึ่งกลาง

ตัวที่รับหลายทางต้องอยู่**กึ่งกลางของทางเหล่านั้น** ไม่ใช่เกาะแถวใดแถวหนึ่ง
และถ้าส่งต่อหลายทาง ก็ต้องอยู่กึ่งกลางของทางที่ส่งออกด้วย

ให้ใช้**จุดรวมเดียวและจุดแยกเดียว** เพื่อให้เส้นสมมาตร

```python
RM = (R1+R2)//2      # Nginx อยู่กึ่งกลางของสองแถวที่รับเข้ามา
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # เข้าจากบน
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # เข้าจากล่าง
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # ออกขึ้นบน
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # ออกลงล่าง
```

### ช่องเดินสาย

เส้นที่ต้องข้ามกริด **ห้ามวิ่งทับแถวที่มีกล่อง** ให้จองช่องว่างไว้เฉพาะ

```python
TB = 238        # ช่องบน — ห่างจากขอบโซนอย่างน้อย 36
MB = R3-48      # ช่องกลาง — ระหว่างแถว
```

---

## 4 · เส้นเชื่อม

เส้นตั้งฉากทั้งหมดและมุมโค้งรัศมี 14 — จุดนี้ทำให้ดูประณีตขึ้นมากโดยไม่เสียความชัดเจน
`ref.flow(pts, dashed=False, arrow=True)` คำนวณมุมโค้งให้เอง

**หัวลูกศรต้องจบที่ขอบไอคอน ไม่ใช่ที่ป้ายชื่อ** — เช่น `CD-30` เมื่อไอคอนกว้าง 46

---

## 5 · ป้ายบนเส้น — สองบทบาทเท่านั้น

| บทบาท | สี | ใช้กับ |
|---|---|---|
| ปกติ | เฉดอ่อนของ `ACCENT` | สิ่งที่ไหลผ่านเส้นตามปกติ |
| ข้อยกเว้น | `EXCEPT_HUE` | ทางที่ไม่ผ่านประตูหน้า · กรณีพิเศษ |

**ข้อยกเว้นมีได้ป้ายเดียวต่อรูป** ถ้ามีตั้งแต่ 2 ป้าย แปลว่าไม่มีป้ายไหนเด่นจริง

ป้ายบอกว่า**อะไรไหลผ่าน** เช่น `SQL` `/api/` `DICOM 11112` ไม่ใช่ `เชื่อมต่อ`

---

## 6 · โซน

โซนเป็นกรอบพื้นสีอ่อนมาก ส่วนป้ายชื่อเป็นแคปซูลพื้นขาวคร่อมเส้นขอบและมีจุดสีนำหน้า

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| ชนิด | เส้น | ความหมาย |
|---|---|---|
| `physical` | ทึบ | ขอบเขตของจริงทางกายภาพ — ห้อง อาคาร เครื่อง |
| `logical` | ประ | ขอบเขตเชิงตรรกะ — Docker Compose · namespace · VPC |
| `outside` | ประ | นอกระบบที่เราดูแล |

ผู้อ่านจะเห็นทันทีว่าอันไหนมีอยู่จริง และซ้อนโซนได้ไม่เกิน 3 ชั้น

---

## 7 · ไอคอนและโลโก้

ไอคอน**ลอยบนพื้น ไม่มีกรอบ ไม่มีไทล์** ส่วนชื่อและคำอธิบายอยู่ใต้ภาพ

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  มี logos/<slug>.svg → ใช้โลโก้จริง เติมสีจาก colors.json
#  ไม่มี              → ใช้สัญลักษณ์เส้นที่ออกแบบเอง
```

ค่าที่ใช้ได้จริง: ไอคอน 46 · ชื่อ 11.5 ตัวหนา ห่างจากกึ่งกลาง `size/2+20` · คำอธิบาย 10 ห่าง `size/2+35`

โลโก้เอามาจากคลังไอคอนของ skill นี้ ([icons.md](icons.md)) ให้รัน `python assets/find-icon.py --group brands <ชื่อ>` จากโฟลเดอร์ `diagram-figures/` แล้ว `--copy` ไปไว้ใน `_src/logos/`
Simple Icons ให้ SVG สีเดียว `viewBox 0 0 24 24` และมาพร้อม `colors.json` ที่เก็บรหัสสีทางการของแต่ละแบรนด์

### เรื่องเครื่องหมายการค้า — ห้ามข้าม

- โลโก้เป็นของเจ้าของ ใช้เพื่ออ้างถึงตัวผลิตภัณฑ์ในผังได้
  แต่**ห้ามดัดแปลงรูปทรง ห้ามยืดบีบ และห้ามทำให้ดูเหมือนเจ้าของมารับรอง**
- ถ้าตัวไหนไม่มีไฟล์โลโก้ ให้ใช้สัญลักษณ์แทน แล้ว**ระบุชื่อตัวนั้นไว้ในหมายเหตุท้ายรูป**
- อย่าไปดาวน์โหลดโลโก้ใหม่มาเอง ให้ใช้จากชุดที่มีอยู่ หรือให้ผู้ใช้หาจากหน้า brand ของโครงการนั้น

---

## 8 · เรนเดอร์

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

เรนเดอร์ที่ 2 เท่าเสมอ เพราะ 1 เท่าได้ภาพเบลอเมื่อขยายในสไลด์

ภาษาไทยต้องมีฟอนต์ไทยในเครื่องที่เรนเดอร์ แล้วประกาศไว้ใน `font-family` ของ `<svg>`
**อย่าใช้ Python Imaging Library (PIL) วาดข้อความไทยปนอังกฤษ** เพราะจะได้กล่องสี่เหลี่ยมแทนตัวอักษร

---

## 9 · วงจรตรวจงาน — ห้ามข้าม

เรนเดอร์ → เปิดไฟล์ภาพดูจริง → แก้ → เรนเดอร์ใหม่ จนกว่าจะสะอาด
**6 ข้อนี้เจอซ้ำทุกครั้ง ให้ตรวจทุกรอบ:**

1. **ป้ายบนเส้นทับไอคอนหรือชื่อ** — ย้ายไปกึ่งกลางช่วงที่ยาวที่สุด หรือย้ายไปบนขาตั้ง
2. **เส้นที่ออกจากไอคอนตัดคำอธิบายของตัวเอง** — เริ่มเส้นที่ `cy+58` ไม่ใช่ `cy+32`
3. **ขอบโซนตัดคำอธิบายแถวล่างสุด** — ขอบล่างโซนต้อง ≥ `R_ล่างสุด + 58 + 24`
4. **ข้อความกำกับโซนนั่งทับเส้นขอบ** — รวมกับชื่อในแคปซูลเดียว
5. **หัวลูกศรไปจบที่ป้ายชื่อ ไม่ใช่ที่ไอคอน** — ให้จบที่ขอบไอคอน
6. **ข้อความล้นกรอบ** — ไทย 11.5px ≈ 6.0 px/ตัว · หัวเรื่อง 15px ≈ 7.5 px/ตัว
   ถ้าที่ไม่พอ ให้ตัดคำ **อย่าลดขนาดตัวอักษร**

---

## 10 · ค่าคงที่ที่ใช้ได้จริง

```
ความกว้าง 1400 · ขอบ 56
หัวเรื่องกลางหน้า 22 · คำอธิบายใต้หัว 12.5
ชื่อหน่วย 11.5 ตัวหนา · คำอธิบาย 10 · ป้ายบนเส้น 10.5
เส้นเชื่อม 1.6 · ขอบโซน 1.4 · รัศมีมุมโค้ง 14 · ป้ายสูง 21
```

---

## 11 · แถบสัญลักษณ์

ทุกรูปปิดท้ายด้วยแถบเดียวที่บอกว่ากรอบแต่ละแบบคืออะไร และป้าย 2 สีต่างกันตรงไหน
แล้วต่อด้วยหมายเหตุ 2–4 บรรทัด ซึ่งรวมบรรทัดเรื่องเครื่องหมายการค้า และการอ้างถึงรูปอื่นที่เกี่ยวข้อง

---

## ตัวย่อ

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: icons.md

# คลังไอคอน — ใช้ร่วมกันทั้งโครง HTML และ SVG/Python engine

**ไอคอนมีให้แล้ว 205 ตัวใน `assets/icons/`** ไม่ต้องติดตั้งอะไรเพิ่ม —
เป็น PNG พื้นโปร่ง 160×160 ซึ่งเป็นไอคอนทางการของผู้ให้บริการและเครื่องมือ แบ่งเป็น 9 กลุ่ม

| โฟลเดอร์ | มีอะไร |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 18 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · ผู้ใช้ … |

รายชื่อทั้งหมดอยู่ใน [`assets/icons/INDEX.md`](../assets/icons/INDEX.md) และเปิด [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) เพื่อดูรูปทั้งหมดในหน้าเดียว

**ถ้าต้องการตัวที่ไม่มีใน 205 ตัวนี้** ให้ค้นในคลังเต็ม `assets/tech-icons.zip` (8,602 ไอคอน · 5 กลุ่ม) ด้วย [`find-icon.py`](../assets/find-icon.py) ซึ่งไม่ต้องติดตั้งอะไรและไม่ต้องแตกทั้งก้อน

| กลุ่ม | มีอะไร |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · ฐานข้อมูล · คิว · CI/CD · เฝ้าระวัง · Kubernetes · ภาษาโปรแกรม · GIS |
| `brands/` | 3,461 SVG สีเดียว · โลโก้แบรนด์ + รหัสสีทางการใน `colors.json` |
| `devtools/` | 572 SVG มีสี · โลโก้เครื่องมือนักพัฒนา |
| `ui/` | 2,112 SVG ไอคอนเส้นทั่วไป (Lucide) ไม่ใช่โลโก้ |

```bash
python assets/find-icon.py kafka redis                       # ค้นชื่อ
python assets/find-icon.py --group ui user                    # ค้นเฉพาะกลุ่ม
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # สีทางการของโลโก้
```

ให้ดึงมาเฉพาะตัวที่ใช้แล้ววางไว้ข้างไฟล์รูป ห้ามแตกทั้งคลังลงโปรเจกต์ สัญญาอนุญาตของคลังคือ MIT · CC0 · ISC (ดู `--groups`) แต่โลโก้ยังเป็นเครื่องหมายการค้าของเจ้าของ

> **เรื่องสัญญาอนุญาต** — ชุดไอคอนสถาปัตยกรรมของ AWS · Azure · Google Cloud
> เผยแพร่มาเพื่อใช้วาดผังสถาปัตยกรรมโดยเฉพาะ จึงใช้ในเอกสารข้อเสนอได้
> สิ่งที่ทำไม่ได้คือใช้โลโก้ในลักษณะที่ทำให้เข้าใจว่าผู้ให้บริการรับรองหรือร่วมงานด้วย
> และใช้เป็นส่วนหนึ่งของแบรนด์ตัวเอง ส่วนถ้าไม่มีไอคอนทางการของเครื่องมือนั้น ให้วาดไอคอนเส้นเองตาม [SKILL.md](../SKILL.md) ข้อ 6


## reference: layout-cloud.md

# โครง `figure-cloud.html` — ผังคลาวด์พร้อมโลโก้ผู้ให้บริการ

โครงนี้ตอบคำถาม "ใช้บริการอะไรของคลาวด์บ้าง" ไฟล์โครงอยู่ที่ [`assets/figure-cloud.html`](../assets/figure-cloud.html)

ใช้เมื่อผู้อ่านคาดหวังจะเห็นไอคอน Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes ของจริง แบบผังอ้างอิงที่ผู้ให้บริการเผยแพร่ ไอคอนหาได้จากคลังตาม [icons.md](icons.md)

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**กติกาเฉพาะโครงนี้:**

- **สายที่ข้ามขอบเขต ให้ออกจากขอบของกล่องขอบเขต** (`n-region`) ไม่ใช่จากกล่องข้างใน
  — เพราะถ้าต่อจากกล่องข้างใน เส้นจะพาดทะแยงทับทุกอย่างที่ขวางทาง
- **เส้นประ = ขอบเขตที่ผู้ให้บริการจัดการให้** ส่วนเส้นทึบสีส้ม = เครื่องที่เราดูแลเอง
  และให้ใส่ความหมายไว้ในคำอธิบายสัญลักษณ์เสมอ
- ไอคอนแสดงเปล่า ๆ ไม่ต้องมีกรอบ เพราะโลโก้มีสีและรูปทรงของตัวเองอยู่แล้ว
- ชื่อบริการใช้ชื่อทางการ (`Amazon RDS`) ส่วนคำอธิบายใต้ชื่อเป็นภาษาไทยได้


## reference: layout-context.md

# โครง `figure-context.html` — ระบบกับโลกภายนอก

ตอบคำถาม "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" (C4 ระดับ 1) ไฟล์โครงอยู่ที่ [`assets/figure-context.html`](../assets/figure-context.html)

```
┌─ หัวรูป ────────────────────────────────────────────────────────┐
│  ผู้ใช้งาน (แถบนอน)   →   ระบบที่อธิบาย (การ์ดใหญ่)   ←   ระบบภายนอก  │
│  ─ เจ้าหน้าที่           ─ ชื่อ + คำขยาย                ─ external system │
│  ─ แพทย์                ─ หน้าที่ 3-6 ข้อ               ─ ชื่อ + สถานะ    │
│  ─ ผู้ดูแล               ─ ป้ายข้อจำกัด                                │
├─ คำอธิบายสัญลักษณ์ ─────────────────────────────────────────────┤
│  เชิงอรรถ — ความหมายเส้นประ · ตัวย่อทั้งหมด · รูปถัดไป              │
└────────────────────────────────────────────────────────────────┘
```

- **ผู้ใช้งานอยู่ซ้าย ส่วนระบบภายนอกอยู่ขวา** และไม่ปนกัน เพราะคนกับเครื่องเป็นคนละชนิด
- **หน้าที่ในการ์ดกลางมี 3 ถึง 6 ข้อ** ถ้าเกินนี้ แปลว่ากำลังเขียน SRS ไม่ใช่วาดรูป
- **ระบบภายนอกที่ยังไม่ได้เชื่อม** ให้ใช้เส้นประ (`planned:true`) แล้วเขียนไว้ในการ์ดว่าอยู่ในแผนเวอร์ชันไหน
  — เพราะรูปที่วาดเฉพาะของที่มีแล้วจะถูกถามซ้ำทุกรอบว่า "แล้วเชื่อม HIS หรือยัง"
- **มีคำอธิบายสัญลักษณ์เสมอ** เมื่อรูปทรงหรือเส้นสื่อความหมาย
- **ตัวย่อเขียนเต็มที่เชิงอรรถ** เพราะผู้อ่านฝั่งลูกค้าไม่รู้ว่า SEG คืออะไร


## reference: layout-deployment.md

# โครง `figure-template.html` — deployment · ข้างในเครื่อง

ตอบคำถาม "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" ไฟล์โครงอยู่ที่ [`assets/figure-template.html`](../assets/figure-template.html)

โครงนี้มี 3 คอลัมน์ เรียงซ้ายไปขวาตามทิศที่ข้อมูลไหล:

```
┌─ หัวรูป ───────────────────────────────────────────────┐
│  ชื่อ + คำขยาย                    เลขรูป · เวอร์ชัน · เจ้าของ  │
├────────────┬──────────────────────────┬────────────────┤
│ นอกระบบ    │  ⬅ กล่อง .focus           │ ปลายทาง        │
│ คน อุปกรณ์  │  สิ่งที่เอกสารนี้อธิบาย       │ ข้อบังคับ       │
│ ระบบอื่น    │  ซ้อนได้อีก 1 ชั้น          │ ของที่ไหลออก    │
├────────────┴──────────────────────────┴────────────────┤
│ เชิงอรรถ — รูปอื่นที่เกี่ยวข้อง · ที่มาของไอคอน              │
└────────────────────────────────────────────────────────┘
```

**ซ้อนกล่องได้ไม่เกิน 3 ชั้น** คือ คอลัมน์ → กล่องใหญ่ → กล่องย่อย
ถ้ามีชั้นที่ 4 แปลว่ารูปนี้ตอบ 2 คำถาม ให้แยกเป็น 2 รูป

**กล่อง `.focus` มีได้กล่องเดียวต่อรูป** ถ้ามี 2 กล่อง แปลว่ายังไม่ได้ตัดสินใจว่ารูปนี้เรื่องอะไร


## reference: pitfalls.md

# กับดักที่เจอจริง — โครง HTML

อาการที่เจอซ้ำเมื่อทำรูปด้วยโครงใน `assets/` พร้อมสาเหตุและทางแก้ ส่วนกับดักของ SVG/Python engine อยู่ใน [engine-svg-python.md](engine-svg-python.md) ข้อ 9

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| หัวลูกศรหายทั้งรูป | สคริปต์ลบ `path` ทุกตัวก่อนวาดใหม่ รวมถึงสามเหลี่ยมหัวลูกศรที่อยู่ใน `<defs>` — ลบเฉพาะ `path.wire` (โครงแก้ไว้แล้ว) |
| เส้นลากไปผิดกล่อง | `id` ไปติดกล่องอื่นที่หน้าตาเหมือนกัน — เปิด console ดู `wire: ไม่พบ id` และตรวจว่า `id` ไม่ซ้ำ |
| เส้นจ่อกลางกล่องสูง แล้วพาดทับของข้างใน | ใส่ `tp` / `fp` ให้เส้นเข้าใกล้ขอบบน |
| สระไทยหาย | เครื่องไม่มีฟอนต์ไทยในรายการ — ติดตั้ง Noto Sans Thai หรือเพิ่มฟอนต์ที่มีเข้าไปในรายการ |
| ภาพเบลอในสไลด์ | เรนเดอร์ด้วยตัวคูณ 1 |
| รูปมีขอบขาวเยอะ | ถ่ายทั้งหน้าแทนที่จะถ่ายเฉพาะ `.sheet` |
| แก้ข้อความแล้วเส้นหลุด | เขียนพิกัดเส้นตายตัวแทนที่จะใช้ `WIRES` |
| ป้ายบนเส้นทับกล่อง หรือบังเส้นจนมองไม่เห็น | ป้ายกว้างกว่าช่องว่างระหว่างคอลัมน์ — เพิ่ม `gap` หรือตัดคำในป้ายให้สั้นลง |
| ชื่อกล่องภาษาไทยตกบรรทัดสอง | คอลัมน์แคบไป — เพิ่มความกว้างคอลัมน์นั้น อย่าลดขนาดตัวอักษร |
| ใช้ไอคอนเป็นไฟล์ภาพแล้วเส้นลากผิดตำแหน่งทั้งรูป | สคริปต์คำนวณก่อนรูปโหลดเสร็จ — เรียก `draw()` ใน `window.onload` ไม่ใช่ตอนอ่านสคริปต์ (`figure-cloud.html` ทำไว้แล้ว) |
| เส้นพาดทะแยงทับทั้งรูป | ต่อเส้นจากกล่องข้างในกล่องขอบเขต — ต่อจากขอบของกล่องขอบเขตแทน |
