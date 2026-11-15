# How to use brandkit — sample code

Read when you start writing a script that builds real files · all methods are in `api.md`

## Word document (`brandkit.py`)

```python
import sys; sys.path.insert(0, "scripts")     # หรือ copy brandkit.py มาไว้ข้างงาน
from brandkit import BrandDoc, use_brand, to_pdf

doc = BrandDoc()                                # A4 · Tahoma · สีประจำบ้าน
doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
          subtitle="ระบบตัวอย่าง (Sample System) — Project Control & Monitor",
          meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
          logo="asset/Sample_Logo_Badge.png")
doc.toc()

doc.h1("1. ภาพรวมระบบ")
doc.para("ระบบตัวอย่างเป็นระบบบริหารและติดตามโครงการ ...")
doc.kpi_row([("19", "โครงการ"), ("115", "Work items"), ("103", "Open tasks")])
doc.table(["หัวข้อ", "รายละเอียด"],
          [["URL ระบบ", "https://app.example.com"]],
          widths=[2600, 7038])                  # รวม = 9638
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

## Slides (`brandkit_pptx.py`)

Slides use `brandkit_pptx.py`, which takes the same token set:

```python
from brandkit_pptx import BrandDeck
d = BrandDeck()                                  # 16:9
d.title_slide("ระบบตัวอย่าง", "Project Control & Monitor", "19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน", ["...", "..."], subtitle="สรุปจาก SRS v3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items")])
d.table_slide("สถานะ Milestone", headers, rows, col_widths=[1, 4, 2, 2],
              status_col=3, palette={"เสร็จ": "green", "กำลังทำ": "amber"})
d.image_slide("สถาปัตยกรรม", "diagrams/arch.png", caption="ภาพรวมองค์ประกอบ")
d.save("deck.pptx")
```

All methods are in `references/api.md`. The runnable example files are
`scripts/example_srs.py` (document) · `scripts/example_deck.py` (`BrandDeck` slides)

## "Stage" deck (`brandkit_stage.py`) — the default for a deck used for speaking

`brandkit_stage.py` makes a deck with the same structure as the model deck: headings in Chakra Petch, body in IBM Plex Sans Thai, while the **background and main colors come from the project's design**, dark or light.
(The model is for deck structure only: X Fitness Chatbot Summary v1.2 · an example already run: `examples/example_stage.pptx`)

```python
from brandkit_stage import StageDeck
d = StageDeck(accent="2A78D6", bg="09090A", project="Sample Chatbot")   # ตัวอย่าง: สีหลัก · สีพื้นต้องมาจากดีไซน์ของโปรเจกต์คุณเอง
d.cover("Sample Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
        meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
         "fig-flow-dark.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
d.save("deck.pptx")
```

- **2 colors come from the project's design:** `accent` (main color) and `bg` (background color). Look in the order given in `diagram-figures` item 5 (`doc-theme` → design in code, such as `--primary` · `--background` · the Tailwind theme · the app's dark/light mode → logo and brand kit → nothing at all: use the house color `#2A78D6` with background `FFFFFF` and write `(รอยืนยัน)` (awaiting confirmation)). Never use the model deck's colors · if the work being made into a deck has its own colors, extract them first with `presentation-design/scripts/source_palette.py` · for a light-background deck, set `block=True` so the cover and chapter dividers are a solid main-color full sheet (`presentation-design` `references/deck-theme.md`)
- Every gray level is computed from `bg` (dark background mixed with white, light background mixed with black), so it carries the same tone as the project's background · `accent_hi` is the main color with lightness adjusted until readable on that background; use it for big numbers, sequence numbers and emphasis words · a project that already fixed a text color can override it, e.g. `text="1B2430"`
- Fonts of the project can be used (`head_font=` · `body_font=`); if the project has none, use Chakra Petch + IBM Plex Sans Thai
- **Diagram images must use the same background color as the deck** — render `diagram-figures` with `#accent=<main color>&bg=<background color>` (now available in `figure-flow.html`)
- **The fonts Chakra Petch and IBM Plex Sans Thai must be installed** (Google Fonts · free to use) on the machine that opens the file. If the destination machine lacks them, send a PDF along, or rebuild with `head_font="Tahoma", body_font="Tahoma"`
- For printing, build another set with `bg="FFFFFF"` instead of using a dark background that wastes ink · `BrandDeck` (color bar on top) is still usable for reports sent to be read on their own
