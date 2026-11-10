# ข้อมูลจาก ui-ux-pro-max-skill

คัดลอกไม่แก้จาก [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) commit `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03` เมื่อ 2026-10-29 · ใบอนุญาต MIT · Copyright (c) 2024 Next Level Builder · ข้อความเต็มใน [`LICENSE`](LICENSE)

| ไฟล์ | ต้นทาง | ค้นด้วย `design_search.py --domain` |
|---|---|---|
| `styles.csv` | `cli/assets/data/` (88 สไตล์ · ตัวค้นข้ามแถว `Status` = deprecated) | `style` |
| `ui-reasoning.csv` | `cli/assets/data/` (192 ประเภทสินค้า · สิ่งที่ห้ามทำ) | `product` |
| `products.csv` | `cli/assets/data/` | ยังไม่ได้ต่อ (ใช้อ่านประกอบ) |
| `motion.csv` | `cli/assets/data/` (17 แบบ · โค้ด GSAP) | `motion` |
| `slide-layouts.csv` · `slide-strategies.csv` · `slide-copy.csv` | `cli/assets/skills/design-system/data/` | `slide` · `slide-strategy` · `slide-copy` |
| `slide-backgrounds.csv` · `slide-charts.csv` · `slide-color-logic.csv` · `slide-layout-logic.csv` · `slide-typography.csv` | ที่เดียวกัน | ยังไม่ได้ต่อ (ใช้อ่านประกอบ) |

- ข้อมูลเป็นภาษาอังกฤษ ค้นด้วยคำอังกฤษได้ผลดีกว่า · คำไทยที่อยู่ในกลุ่มคำพ้องของตัวค้นใช้ได้ (เช่น สไลด์ · แบนเนอร์ · นักลงทุน)
- **สีในไฟล์เหล่านี้ไม่ผ่าน `check_data.py`** (ไม่ได้ตรวจ contrast และสีตั้งต้นของ framework) · ใช้เป็นแนวทาง สีจริงมาจาก `design-references` หรือ `palettes.csv`
- อัปเดต: ดาวน์โหลดไฟล์เดิมจาก commit ใหม่ทับ แล้วแก้ commit และวันที่ในหน้านี้ · รัน `design_search.py --self-test` และ `--eval references/relevance-cases.json`
