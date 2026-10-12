# วิธีใช้ brandkit — โค้ดตัวอย่าง

อ่านเมื่อเริ่มเขียนสคริปต์สร้างไฟล์จริง · เมธอดทั้งหมดอยู่ใน `api.md`

## เอกสาร Word (`brandkit.py`)

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
          widths=[2600, 7038])                  # รวม = 9638
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

## สไลด์ (`brandkit_pptx.py`)

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
`scripts/example_srs.py` (เอกสาร) · `scripts/example_deck.py` (สไลด์ `BrandDeck`)

## เด็ค "Stage" (`brandkit_stage.py`) — ค่าเริ่มต้นของเด็คที่ใช้พูด

`brandkit_stage.py` ทำเด็คโครงเดียวกับต้นแบบ หัวเรื่อง Chakra Petch เนื้อความ IBM Plex Sans Thai ส่วน**สีพื้นและสีหลักมาจากดีไซน์ของโปรเจกต์** พื้นเข้มหรือสว่างก็ได้
(ต้นแบบ: X Fitness Chatbot Summary v1.2 · ตัวอย่างที่รันแล้ว `examples/example_stage.pptx`)

```python
from brandkit_stage import StageDeck
d = StageDeck(accent="E10613", bg="09090A", project="X Fitness Chatbot")   # สีหลัก · สีพื้นของโปรเจกต์
d.cover("X Fitness Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
        meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
         "fig-flow-dark.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
d.save("deck.pptx")
```

- **สีมาจากดีไซน์ของโปรเจกต์ 2 ค่า** คือ `accent` (สีหลัก) กับ `bg` (สีพื้น) หาตามลำดับใน `diagram-figures` ข้อ 5 (`doc-theme` → ดีไซน์ในโค้ด เช่น `--primary` · `--background` · ธีม Tailwind · โหมดมืด/สว่างของแอป → โลโก้และชุดแบรนด์ → ยังไม่มีเลยใช้สีประจำบ้าน `#2A78D6` พื้น `09090A` แล้วเขียน `(รอยืนยัน)`) ห้ามใช้สีของต้นแบบ
- เทาทุกระดับคำนวณจาก `bg` (พื้นเข้มผสมขาว พื้นสว่างผสมดำ) จึงอมโทนเดียวกับพื้นของโปรเจกต์ · `accent_hi` คือสีหลักที่ปรับความสว่างจนอ่านออกบนพื้นนั้น ใช้กับตัวเลขใหญ่ เลขลำดับ และคำเน้น · โปรเจกต์ที่กำหนดสีตัวหนังสือไว้แล้ว ส่งทับได้ เช่น `text="1B2430"`
- ฟอนต์ใช้ของโปรเจกต์ได้ (`head_font=` · `body_font=`) ถ้าโปรเจกต์ยังไม่มี ใช้ Chakra Petch + IBM Plex Sans Thai
- **รูปผังต้องใช้สีพื้นเดียวกับเด็ค** — เรนเดอร์ `diagram-figures` ด้วย `#accent=<สีหลัก>&bg=<สีพื้น>` (ตอนนี้มีใน `figure-flow.html`)
- **ต้องติดตั้งฟอนต์ Chakra Petch และ IBM Plex Sans Thai** (Google Fonts · ใช้ฟรี) ในเครื่องที่เปิดไฟล์ ถ้าเครื่องปลายทางไม่มี ให้ส่ง PDF คู่ไปด้วย หรือสร้างใหม่ด้วย `head_font="Tahoma", body_font="Tahoma"`
- ถ้าจะพิมพ์ ให้สร้างอีกชุดด้วย `bg="FFFFFF"` แทนการใช้พื้นเข้มเปลืองหมึก · `BrandDeck` (แถบสีด้านบน) ยังใช้ได้กับรายงานที่ส่งให้อ่านเอง
