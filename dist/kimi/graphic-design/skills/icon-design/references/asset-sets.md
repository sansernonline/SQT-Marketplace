# ชุดงานที่นักออกแบบทำไว้ หยิบมาปรับแทนการวาดเอง

ใช้เมื่อผู้ใช้อยากได้แนวที่โค้ดวาดเองไม่ถึง (มีมิติ · หลายสี · 3 มิติ · ภาพประกอบ) และไม่มีตัวสร้างภาพหรือนักออกแบบ · ทุกแถวอ่านจากไฟล์ LICENSE หรือหน้าใบอนุญาตจริงเมื่อ 2026-10-27 · ใบอนุญาตเปลี่ยนได้ ก่อนใช้งานจริงให้เปิดลิงก์ตรวจซ้ำ · จำนวนจาก `info.json` ของแพ็กเกจ `@iconify-json/<ชุด>`

## 1 · เลือกตามแนวที่ผู้ใช้อยากได้

| แนว | ชุด | ใบอนุญาต | ไฟล์ · ติดตั้ง | หมายเหตุ |
|---|---|---|---|---|
| สีมีมิติ (ชิ้นซ้อน ไล่แสง) | Fluent UI System Icons แบบ color | MIT | SVG แก้สีได้ · `@fluentui/svg-icons` (ไฟล์ `*_color.svg`) หรือ `@iconify-json/fluent-color` | 890 ตัว · สีเดิมหลายตัวเป็นม่วงชมพูแบบ Copilot ให้เปลี่ยนสีก่อนใช้ · บางตัวมีแค่ขนาด 16–24 |
| สีมีมิติ | IconPark ธีม multi-color · two-tone | Apache 2.0 | SVG | 2,658 ตัว |
| สีแบน | Icons8 Flat Color | MIT | SVG | 329 ตัว |
| 3 มิติ | Fluent Emoji 3D | MIT | PNG 256 แก้สีไม่ได้ · ตัวเดียวกันมีแบบ Color และ Flat เป็น SVG | แบบ Color 3,126 ตัว |
| 3 มิติ | 3dicons.co | CC0 | (ยังไม่ได้ตรวจรูปแบบไฟล์) | |
| เส้นสองน้ำหนัก (duotone) | Phosphor | MIT | SVG · `@phosphor-icons/core` | 9,072 ตัวรวม 6 น้ำหนัก |
| เส้น | Lucide · Tabler · Iconoir · Material Symbols | ISC · MIT · MIT · Apache 2.0 | SVG | ไอคอนหน้าจอ ดู [`icon-sets.md`](icon-sets.md) |
| ภาพประกอบ | Open Peeps · Humaaans · Open Doodles | CC0 | SVG · PNG | |
| ภาพประกอบ | unDraw | ใบอนุญาตของ unDraw | SVG เปลี่ยนสีได้บนเว็บ | ไม่ต้องให้เครดิต แต่ห้ามรวมเป็นแพ็กแจกต่อ ห้ามทำบริการเลียนแบบ ห้ามใช้ฝึกโมเดล AI |
| อีโมจิ | Noto Emoji | ภาพ Apache 2.0 · ฟอนต์ OFL 1.1 | SVG · PNG | 3,729 ตัว |

**ต้องใส่เครดิต:** Twemoji (ภาพ CC BY 4.0) · Streamline ชุดฟรี (CC BY 4.0)

**ไม่เหมาะทำไอคอนแอปหรือโลโก้:** Remix Icon (ใบอนุญาต v1.0 ม.ค. 2026 ข้อ 3.3 ห้ามแม้เปลี่ยนสีหรือหมุน) · OpenMoji (CC BY-SA 4.0 งานดัดแปลงต้องปล่อยใบอนุญาตเดียวกัน) · SF Symbols

**ข้อควรรู้:** MIT · Apache · CC0 · CC BY ไม่ให้สิทธิ์ผูกขาด คนอื่นใช้ภาพเดียวกันได้ ถ้าจะจดเครื่องหมายการค้า ไม่ควรใช้ภาพจากชุดตรง ๆ (ความเห็นทั่วไป ยังไม่ได้ตรวจกับแหล่งกฎหมาย)

## 2 · ขั้นตอนหยิบมาปรับ

1. ค้นในชุดที่ตรงแนว เลือกตัวที่ใกล้ metaphor ที่สุด 2–3 ตัวต่อไอคอน · แพ็กเกจ `@iconify-json/<ชุด>` ให้ SVG ทั้งชุดใน `icons.json` และชื่อใบอนุญาตใน `info.json`
2. ดาวน์โหลดลง `_to_delete/` แล้ววางในกรอบจริง เทียบทั้งพื้นสว่างและพื้นมืดที่ 16 · 48 · 128 px
3. ปรับเป็นของแบรนด์: เปลี่ยนสีด้วย `scripts/recolor_icon.py --hex "<สีแบรนด์>"` ซึ่งคงความสว่างและแสงเงาของนักออกแบบไว้ หมุนแค่เฉดสี · ชุดที่แต่ละตัวต้องสีต่างกัน รันทีละตัวด้วย `--hex` ของตัวนั้น · ในชุดไม่มีตัวที่ตรง metaphor ให้ลองชุดถัดไปในแถวเดียวกัน ไม่วาดเติมเอง · วางในกรอบเดียวกันทั้งชุด · ไม่ตัด บาก หรือดัดรูปทรงกรอบ
4. รัน `icon_check.py` แล้วเปิดภาพดูเอง · ส่ง `design-critic` ตัวใหม่ดู
5. จดชื่อชุด รุ่น ใบอนุญาต และสิ่งที่ดัดแปลงไว้ใน NOTICE หรือ README

## แหล่ง (เปิดอ่าน 2026-10-27)

- Fluent UI System Icons — https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE
- Fluent Emoji — https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE
- IconPark — https://github.com/bytedance/IconPark/blob/master/LICENSE
- Icons8 Flat Color — https://github.com/icons8/flat-color-icons/blob/master/LICENSE.md
- Phosphor — https://github.com/phosphor-icons/core/blob/main/LICENSE
- Tabler — https://github.com/tabler/tabler-icons/blob/main/LICENSE
- Iconoir — https://github.com/iconoir-icons/iconoir/blob/main/LICENSE
- Lucide — https://github.com/lucide-icons/lucide/blob/main/LICENSE
- Material Design Icons — https://github.com/google/material-design-icons/blob/master/LICENSE
- 3dicons — https://3dicons.co/
- Open Peeps — https://www.openpeeps.com/ · Humaaans — https://www.humaaans.com/ · Open Doodles — https://www.opendoodles.com/
- unDraw — https://undraw.co/license
- Noto Emoji — https://github.com/googlefonts/noto-emoji/blob/main/LICENSE
- Twemoji — https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS
- Streamline — https://github.com/webalys-hq/streamline-vectors/blob/main/README.md
- Remix Icon — https://github.com/Remix-Design/RemixIcon/blob/master/License
- OpenMoji — https://github.com/hfg-gmuend/openmoji/blob/master/LICENSE.txt · https://openmoji.org/faq/
