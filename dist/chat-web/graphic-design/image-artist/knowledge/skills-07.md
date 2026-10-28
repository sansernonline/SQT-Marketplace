# skill: icon-design

Use when an app, website, plugin or brand needs icons (UI icon set, app icon, favicon, logo mark) or says ไอคอน, icon ไม่สวย, ทำไอคอนแอป.

# icon-design — ไอคอนที่คนออกแบบจริงทำ ไม่ใช่รูปทรงที่โค้ดวาด

อยู่ใน plugin `graphic-design` · ถ้อยคำเขียนตาม `human-writing` · ตัวเลขทุกแพลตฟอร์มอยู่ใน [`references/specs.md`](references/specs.md) · ชุดไอคอนฟรีกับใบอนุญาตอยู่ใน [`references/icon-sets.md`](references/icon-sets.md) · ชุดมีมิติ 3 มิติ และภาพประกอบที่หยิบมาปรับได้อยู่ใน [`references/asset-sets.md`](references/asset-sets.md)

> **กฎข้อเดียว:** ไอคอนทุกชนิดเริ่มจากของที่คนออกแบบไว้แล้ว (ชุดไอคอนสำเร็จรูปสำหรับหน้าจอ ตัวอย่างที่ผู้ใช้ชอบสำหรับแบรนด์) ไม่ใช่ SVG ที่ agent เขียนทีละเส้นจากศูนย์ เพราะได้แค่รูปทรงพื้นฐานที่แข็งและดูออกว่า AI ทำ (ไอคอน plugin 3 แนวที่ทำแบบนี้ถูกปฏิเสธทั้งหมด 2026-10-26)

## ใช้เมื่อ

- หน้าจอแอปหรือเว็บต้องมีไอคอนเมนู ปุ่ม สถานะ หรือมีไอคอนปนกันหลายแบบ
- ต้องทำไอคอนแอป (iOS · Android · Windows) · favicon · ไอคอน plugin · เครื่องหมายโลโก้แบบรูป
- ผู้ใช้บอกว่าไอคอนไม่สวย ดูทั่วไป หรือดูเหมือน AI ทำ
- ผู้ใช้มีไฟล์ SVG อยู่แล้ว อยากให้ตรวจ → ข้ามไปข้อ 4 ได้เลย

ไม่ใช้เมื่อ: ทำแบรนด์ทั้งชุด (สี ฟอนต์ กฎโลโก้) → `brand-kit` · ภาพประกอบหรือรูปถ่าย → `image-generation` · ตรวจหน้าจอทั้งหน้าว่าดูเหมือน AI ทำไหม → `no-ai-look`

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เหตุผล |
|---|---|---|
| เริ่มร่างไอคอนทุกครั้ง | `design-references` (plugin `superuser`) | **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `icon` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้ |
| ไอคอนอยู่ในระบบแบรนด์ | `brand-kit` | สีและกฎการใช้โลโก้มาจากที่นั่น skill นี้ทำแค่ตัวไอคอน |
| ไอคอนในหน้าจอแอป | `ui-craft` ของ software-company (ถ้าติดตั้ง) | ขนาดปุ่ม ระยะ และ token ของหน้าจออยู่ที่นั่น |
| ต้องให้คนเลือกระหว่างหลายแนว | `parallel-attempts-pick-best` ข้อ 0 | ต้องมีตัวอย่างที่ผู้ใช้ชอบก่อนแข่งทุกครั้ง |
| ตรวจไอคอนก่อนส่ง | `design-critic` agent · `design-review` | ได้สายตาใหม่ที่ไม่ได้ทำงานนี้ |

## 1 · แยกงานก่อน: ไอคอนหน้าจอ หรือไอคอนแบรนด์

| | ไอคอนหน้าจอ (UI icon) | ไอคอนแบรนด์ (ไอคอนแอป · favicon · plugin · เครื่องหมาย) |
|---|---|---|
| เป้า | อ่านเร็ว เหมือนกันทั้งชุด ไม่แย่งความสนใจ | จำได้ เป็นของตัวเอง ไม่ซ้ำคนอื่น |
| เริ่มจาก | ชุดไอคอนฟรีที่ใบอนุญาตใช้ได้ (ข้อ 2) | ตัวอย่างที่ผู้ใช้ชอบ (ข้อ 3) |
| วาดเองไหม | วาดเฉพาะตัวที่ขาด ตามกฎของชุดนั้น | วาดหรือสร้างใหม่ แต่ไม่เขียน SVG ทีละเส้นจากศูนย์ |

## 2 · ไอคอนหน้าจอ: ใช้ชุดเดียวทั้งแอป

1. เลือก 1 ชุดจาก [`icon-sets.md`](references/icon-sets.md) ตามแพลตฟอร์ม (เว็บทั่วไป Lucide หรือ Tabler · Android Material Symbols · Windows Fluent) · ห้ามผสม 2 ชุด · ผู้ใช้ไม่บอกแพลตฟอร์ม ให้ใช้ Lucide แล้วบอกว่าเลือกเพราะอะไร ไม่ต้องหยุดถาม (เปลี่ยนชุดทีหลังได้ง่าย)
2. ทำรายการไอคอนที่ต้องใช้ แล้วหาชื่อในชุด · ตั้งชื่อตามรูป ไม่ใช่ตามหน้าที่ (Fluent: "Shield, not security")
3. ตัวที่ไม่มีในชุด: คัดตัวที่ใกล้ที่สุดมาแก้ ตามกริด เส้น มุม และช่องว่างของชุดนั้น (ตัวเลขใน `specs.md`) · ถามก่อนว่าต้องมีไอคอนนี้จริงไหม เพราะป้ายข้อความอย่างเดียวอาจชัดกว่า
4. ใส่ป้ายข้อความที่มองเห็นตลอดข้างไอคอน ยกเว้น home · print · search (NN/g)
5. จดชื่อชุด รุ่น และใบอนุญาตไว้ใน README หรือ NOTICE

## 3 · ไอคอนแบรนด์: ค้นหมวด แล้วขอตัวอย่าง แล้วค่อยร่าง

1. **ค้นหมวดเองก่อนถามผู้ใช้ แบบที่นักออกแบบทำ** ตาม [`category-research.md`](references/category-research.md) แล้วสรุปเป็น 3–4 แนว แนวละ 2 ตัวอย่างจริงพร้อมลิงก์ · ไม่ค้นแล้วเสนอแนวจากความรู้สึก = เดารสนิยมแทนผู้ใช้
   - ไอคอนจะไปอยู่ร้านไหน และเพื่อนบ้านในร้านหน้าตาอย่างไร · หน้าร้านที่ต้องรัน JavaScript ให้จับภาพด้วย Playwright ถ้ามี ไม่มีให้บอกว่ายังไม่ได้เห็นรูปจริง
   - กฎทางการของปลายทาง และตระกูลไอคอนที่มีหลายตัวแต่ดูเป็นชุดผูกกันด้วยวิธีไหน
   - แนวที่ใช้จนเฝือในหมวดนั้น · แนวที่แยกตัวที่ 16 px ด้วยสีหรือตัวอักษรอย่างเดียวเสนอได้ แต่เขียนคำเตือนกำกับ
2. **ขอตัวอย่าง 2–3 ชิ้นที่ผู้ใช้ชอบ** (ไอคอนแอปหรือโลโก้ของใครก็ได้) และถามว่าชอบตรงไหน · ถ้าผู้ใช้เลือกแนวจากข้อ 1 แล้ว หรือเอ่ยชื่องานจริงที่ชอบ เช่น "แบบไอคอน Microsoft ใหม่ ๆ" ถือว่าได้ตัวอย่างแล้ว ไม่ต้องขอซ้ำ · ไม่มีตัวอย่าง ให้เลือกจาก 3–4 แนวที่ค้นมาในข้อ 1 โดยส่งเป็นชื่อแอปกับลิงก์หน้าร้านแอปหรือเว็บ ไม่คัดลอกรูปของแบรนด์อื่นมาใส่งาน · ถามรวมครั้งเดียวด้วย `AskUserQuestion` (agent ที่ไม่มีเครื่องมือนี้ เขียนเป็นข้อให้ตอบเป็นเลข)
   - รอบแรกนี้ส่ง metaphor ที่คิดไว้เป็นคำ 2–3 อย่างต่อไอคอนไปด้วย ผู้ใช้จะเห็นทิศทางก่อนตอบ
   - ในข้อความเดียวกันบอกขนาดไฟล์และ safe zone ของปลายทางที่ขอด้วย (เช่น iOS 1024 · Android 108dp เนื้อหาใน 66dp ตาม `specs.md`) ผู้ใช้จะได้รู้ว่าต้องได้ไฟล์อะไรบ้าง
   - **ผู้ใช้สั่ง "ทำมาเลย" ไม่อยากตอบ:** ยังไม่วาดอยู่ดี ถามคำถามเดียวแบบเลือกตอบว่าชอบแนวไหนจากแนวที่ค้นมาในข้อ 1 แล้วจบรอบนั้น · ส่งได้แค่ทางเลือกเป็นคำกับ metaphor ที่คิดไว้ (ข้อ 3) ติด `(รอยืนยัน)` ว่ายังไม่มีตัวอย่างจากผู้ใช้ ไม่ส่ง SVG
3. **หา metaphor 10 อย่างขึ้นไปเป็นคำ ยังไม่วาด** เริ่มจากสิ่งที่ผู้ใช้ทำกับผลิตภัณฑ์ · ผสมสิ่งที่คนคุ้น อย่าใช้สิ่งที่คุ้นในความหมายใหม่ · เลี่ยงภาพจำนักท่องเที่ยว · ตัดเหลือ 3 ที่สื่อได้โดยไม่ต้องอธิบาย (ทดสอบ: คนนอกเดาได้ใน 5 วินาทีไหม)
4. **เลือกเครื่องมือตามของที่มีในเครื่อง** (ตรวจก่อน ไม่สมมุติ):

   | มี | ทำอย่างไร |
   |---|---|
   | ตัวสร้างภาพ AI ที่ใช้ได้ | สร้างจาก brief ที่มีตัวอย่างของผู้ใช้และแนวที่ค้นมาแนบ ตาม `image-generation` แล้วให้คนหรือโปรแกรมเวกเตอร์แปลงเป็นเส้น |
   | โปรแกรมเวกเตอร์ (Inkscape · Figma ผ่าน MCP) | ร่างบนกริด 24 หรือ 64 ใช้ keyline shapes และรวมรูปด้วย boolean จริง |
   | มีแค่โค้ด SVG และตัวอย่างของผู้ใช้เป็นแนวแบนเรียบ (ตัวอักษร · รูปทรงเรขาคณิต · ทึบสีเดียว) | ใช้เป็นจุดเริ่มสัดส่วนจากชุดไอคอนที่ใบอนุญาตให้ดัดแปลง (ไม่ใช่ Remix หรือ SF Symbols) แล้วดัดแปลงจนเป็นของตัวเอง · บอกผู้ใช้ตรง ๆ ว่างานแบรนด์ระดับดีควรให้นักออกแบบเกลาต่อ |
   | มีแค่โค้ด SVG แต่อยากได้แนวมีมิติ หลายสี 3 มิติ หรือภาพประกอบ | ห้ามเอาเส้นแบนมาใส่เงาหรือไล่สีแทน (ลองแล้ว 2026-10-27 ได้หน้าตาพลาสติก ผู้ใช้ไม่ชอบ) · หยิบชุดที่นักออกแบบทำแนวนั้นไว้จาก [`asset-sets.md`](references/asset-sets.md) แล้วปรับเป็นของแบรนด์ตามขั้นตอนในไฟล์นั้น (เปลี่ยนสีด้วย `scripts/recolor_icon.py`) · ไม่มีชุดที่เข้ากัน ให้บอกตั้งแต่แรกว่าต้องใช้ตัวสร้างภาพหรือนักออกแบบ ไม่ลองวาดหลายรอบ · ไอคอนไม่บังคับต้องมีเสมอไป (เช่น plugin ของ Claude Code) |
5. ร่าง 3 metaphor · แต่ละแบบต้องผ่าน: อ่านออกที่ 16 px · ไม่ตัด บาก หรือดัดรูปทรงกรอบไอคอน (ร้านและระบบตัดรูปทรงให้เอง ตัดแล้วดูแหว่ง ผู้ใช้ปฏิเสธ 2026-10-27) ความเป็นชุดให้มาจากสี สัญลักษณ์ และน้ำหนักเส้น · กฎนี้ใช้กับกรอบเท่านั้น รอยบากในตัวสัญลักษณ์ทำได้ · ผู้ใช้คนปัจจุบันยืนยันจะบากกรอบหลังได้ฟังเหตุผล 1 ครั้ง ให้ทำตามผู้ใช้ · ไม่มีข้อความในไอคอนแอป (Apple) · ไม่ใส่เงา bevel glow เองในไอคอนแอป · เนื้อหาอยู่ใน safe zone ของปลายทาง
6. ให้ผู้ใช้เลือก 1 แบบจากหน้าเทียบ แล้วค่อยทำไฟล์ทุกขนาดตาม `specs.md`
   - ข้อเสนอจากผู้ตรวจ (`design-critic`) ที่เปลี่ยนหน้าตาและไม่มีตัวอย่างงานจริงรองรับ ให้ถามผู้ใช้ก่อนใส่ ไม่รับมาเองแล้วแนะนำต่อ

## ตัวอย่างจริง (รอบแดง · ก่อนมี skill นี้)

**โจทย์ 2026-10-26:** ไอคอนประจำ plugin 6 ตัว ให้ผู้ใช้เลือก 3 แนว · **ทำ:** agent 3 ตัวเขียน SVG ทีละเส้นเองแนวละตัว (เรขาคณิต · ของใช้ไทย · ตัวอักษรย่อ) โดยไม่มีตัวอย่างจากผู้ใช้ · ทุกตัวผ่าน `slop_scan` และ `icon_check` · **ผล:** ผู้ใช้ปฏิเสธทั้ง 3 แนว "ไม่สวยเลย" · **บทเรียน:** ขาดตัวอย่างที่ผู้ใช้ชอบ และใช้เครื่องมือที่วาดได้แค่รูปทรงพื้นฐาน ตัวตรวจอัตโนมัติจับได้แค่ความผิดทางเทคนิค

## 4 · ตรวจก่อนส่ง

```bash
python scripts/icon_check.py <ไฟล์.svg ...> --out _to_delete/icon-check --brand "#สีแบรนด์"
```

สคริปต์ตรวจ viewBox จัตุรัส · ไม่มีตัวอักษรหรือรูปบิตแมปในไฟล์ · stroke-width เท่ากันทั้งชุด · พิกัดชิดกริด แล้วทำหน้าเทียบทุกขนาด (16 · 24 · 32 · 48 · 128) บนพื้นขาว มืด และสีแบรนด์ พร้อมภาพเบลอ (blur test ของ Lucide: ตัวไหนเป็นก้อนเข้มแน่นกว่าเพื่อน แปลว่ารายละเอียดมากไป) · **ตรวจผ่านไม่ได้แปลว่าสวย** ไอคอนที่ผู้ใช้ปฏิเสธวันที่ 2026-10-26 ก็ตรวจผ่าน · ต้องเปิดภาพดูเองและส่ง `design-critic` ตัวใหม่ดูทุกครั้ง

- [ ] ไอคอนหน้าจอมาจากชุดเดียว บันทึกใบอนุญาตแล้ว · ไอคอนแบรนด์มีผลค้นหมวดพร้อมลิงก์ และตัวอย่างจากผู้ใช้กำกับ
- [ ] ไม่มีแนวที่ดูออกว่า AI ทำ (gradient ม่วง · sparkle · หกเหลี่ยมหมุน · หุ่นยนต์ · `category-research.md` ข้อ 4) · ทุกตัวในชุดแยกออกที่ 16 px ด้วยรูปทรง
- [ ] ดูภาพจริงที่ 16 px บน 3 พื้นแล้ว · ภาพเบลอไม่มีตัวไหนหนักกว่าเพื่อนชัดเจน
- [ ] ความชัดมาก่อนสมดุล สมดุลมาก่อนความเหมือนกันทั้งชุด (Lucide)
- [ ] ไฟล์ปลายทางครบขนาดและ safe zone ตาม `specs.md` (iOS 1024 ไม่ตัดมุม · Android 108dp เนื้อหาใน 66 · เว็บ ICO 32 + SVG + 180 + 192 + 512)
- [ ] ไม่ใช้ Remix Icon หรือ SF Symbols ทำโลโก้ · ไม่ใช้โลโก้ของแบรนด์อื่น
- [ ] กรอบไอคอนเต็ม ไม่มีรอยตัดหรือบาก (ยกเว้นผู้ใช้ยืนยันหลังได้ฟังเหตุผล) · ชุดที่หยิบมาปรับมีชื่อชุด รุ่น และใบอนุญาตใน NOTICE

## ที่มา

- ตัวเลขและกฎทั้งหมด: Material Design 1 · Lucide design principles · Atlassian · Fluent 2 · Apple HIG · Android Developers · Microsoft Learn · Evil Martians · Google Search Central · NN/g — ลิงก์อยู่ใน [`references/specs.md`](references/specs.md) · เปิดอ่าน 2026-10-26
- วิธีทำงานของนักออกแบบ: Adobe Design "How to design effective icons" (หา metaphor · เก็บทุกรอบ) · Sketch "How we redesigned the Sketch icon for Big Sur" (ร่างราว 50 แบบ เหลือ 2) — เปิดอ่าน 2026-10-26
- ใบอนุญาตชุดไอคอน: README และไฟล์ LICENSE ใน repo ทางการ · [`references/icon-sets.md`](references/icon-sets.md)
- ไม่พบบทความของนักออกแบบที่ระบุชื่อว่าด้วยไอคอนที่ดูเหมือน AI ทำ · กฎในหัวข้อ 3 มาจากรอบที่ล้มจริงวันนี้ (ยังไม่ได้ตรวจกับงานวิจัย)


## reference: asset-sets.md

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


## reference: category-research.md

# ค้นหมวดก่อนออกแบบไอคอนแบรนด์

นักออกแบบไม่เริ่มจากกระดาษเปล่า แต่เริ่มจากดูว่าของในหมวดเดียวกันหน้าตาเป็นอย่างไร ใช้กฎอะไร และอะไรที่ใช้กันจนเฝือ · ไฟล์นี้คือผลค้นรอบแรก (เปิดอ่าน 2026-10-26) ใช้เป็นจุดเริ่ม แต่ละงานต้องค้นหมวดของตัวเองเพิ่ม

## 1 · ค้นอะไรบ้าง (ทำทุกงาน ใช้เวลาไม่นาน)

| ค้น | ตัวอย่างคำค้นหรือที่ดู | ได้อะไร |
|---|---|---|
| ร้านหรือหน้ารายการที่ไอคอนจะไปอยู่ | Raycast Store · VS Code Marketplace · JetBrains Marketplace · Chrome Web Store · App Store หมวดเดียวกัน | ขนาด กรอบ พื้นมืดหรือสว่าง และหน้าตาของเพื่อนบ้านที่จะวางข้างกัน |
| กฎทางการของปลายทาง | หน้า guideline ของร้านนั้น (ตารางข้อ 3) | ข้อห้ามที่ทำให้ถูกปฏิเสธ |
| ตระกูลไอคอนที่มีหลายตัวแต่ดูเป็นชุด | ชุดแอปของ Microsoft · Adobe · Atlassian · JetBrains · Google | วิธีผูกให้เป็นชุด (ข้อ 2) |
| บทความ redesign ที่นักออกแบบระบุชื่อ | "behind the design" + ชื่อแบรนด์ · "new icons" + ปี | วิธีคิดและบทเรียน ไม่ใช่แค่รูป |
| แนวที่ใช้กันจนเฝือในหมวดนั้น | "AI logo trend" · "<หมวด> icon cliché" | สิ่งที่ต้องเลี่ยง (ข้อ 4) |

ผลส่งผู้ใช้เป็นลิงก์ให้กดดูเอง ไม่คัดลอกรูปแบรนด์อื่นมาเก็บหรือใส่งาน · อ่านแค่ข้อความยังไม่พอ ถ้ามีเครื่องมือจับภาพหน้าจอ ให้เปิดดูหน้าตาจริงก่อนสรุปแนว

## 2 · วิธีผูกไอคอนหลายตัวให้เป็นชุด

| วิธี | ตัวอย่าง | ระวัง |
|---|---|---|
| รูปทรงและผิวเหมือนกัน ต่างที่สี | Microsoft 365 ชุด 2025 (ต้นแบบคือไอคอน Copilot · Jon Friedman 2025-10-01) | สีอย่างเดียวแยกตัวไม่พอสำหรับคนตาบอดสี |
| กรอบเดียวกัน ใส่อักษรย่อ | Adobe Creative Cloud · JetBrains IDE | ผู้ใช้บ่นว่าแยกตัวไม่ออกเมื่อมีหลายตัว (Adobe 2020 · ฟอรัม JetBrains) |
| สีชุดเดียวกันทุกตัว | Google Workspace 2020 | ถูกวิจารณ์ว่าแยกไม่ออก ปี 2026 ทำใหม่และเลิกบังคับ 4 สี |
| สัญลักษณ์เล่าเรื่องของแต่ละตัว บนโครงเดียวกัน | Atlassian 2017 · ระบบไอคอน Atlassian 2025 | ต้องคุมน้ำหนักเส้นและกริดให้เท่ากัน |

บทเรียนร่วม: ทุกตัวในชุดต้องแยกออกที่ 16 px ด้วยรูปทรง ไม่ใช่ด้วยสีหรือตัวอักษรอย่างเดียว

## 3 · กฎของปลายทางที่ไอคอน plugin มักไปอยู่

| ปลายทาง | ไฟล์ | กฎสำคัญ |
|---|---|---|
| Claude Code (ช่อง `icon` ใน `plugin.json`) | path รูปใน plugin · ด่าน directory รับ PNG JPEG GIF WebP SVG | ไม่กำหนดขนาดหรือรูปทรง · Claude Code ไม่อ่าน ใช้แค่หน้า directory |
| Raycast | PNG 512 | ต้องดูดีทั้งธีมมืดและสว่าง (มี `icon@dark.png` แยกได้) · ใช้ไอคอนตั้งต้นจะถูกปฏิเสธ |
| JetBrains | SVG 40 · ภาพอยู่ใน 36 | ห้ามโลโก้ที่เป็นตัวอักษรล้วน · ห้ามคล้ายแบรนด์อื่น · ต้องชัดทั้ง 2 พื้น |
| VS Code | PNG อย่างน้อย 128 (256 สำหรับจอ Retina) | ห้าม SVG |
| Chrome | PNG 128 ภาพจริง 96 เว้นขอบด้านละ 16 | ห้ามขอบ · เลี่ยงเงาตกใหญ่ · หันหน้าตรง |

กฎที่หลายแหล่งตรงกัน: อ่านออกทั้ง 2 พื้น · ไม่ใส่ข้อความ · ไม่มีขอบและเงาใหญ่ · เว้นขอบโปร่งใส · น้ำหนักภาพเท่ากันทั้งชุด · ไม่คล้ายแบรนด์อื่น · ไฟล์ต้นแบบหนึ่งชุดส่งออกได้ทุกปลายทาง (PNG 512 · PNG 128 · SVG 40)

## 4 · แนวที่ดูออกว่า AI ทำ (เลี่ยง)

| แนว | แหล่งที่วิจารณ์ |
|---|---|
| gradient ม่วงน้ำเงิน · starburst · แสงเรือง | Allen · UX Collective (2024-06) |
| ประกาย sparkle ✦ ที่กลายเป็นป้าย "beta" | Josh Clark · Big Medium (2024-09) · Fast Company (2024) |
| หกเหลี่ยมหรือเกลียวหมุน · หุ่นยนต์ตาโต | Fast Company (2023) |
| วงกลม gradient มีรูกลาง | Radek Sienkiewicz (2025-04) |

โลโก้ Claude ตั้งใจหนีแนวเหล่านี้ (DesignRush) · "สมอง" ยังไม่พบแหล่งที่ระบุชื่อ (ยังไม่ได้ตรวจ)

## แหล่ง (เปิดอ่าน 2026-10-26)

- Microsoft Design · Fluid forms, vibrant colors — https://microsoft.design/articles/fluid-forms-vibrant-colors/
- Adobe Design · Behind the design: Adobe's updated app icons — https://adobe.design/ideas/behind-the-design-adobe-s-updated-app-icons
- Creative Bloq · Adobe icon update 2020 — https://www.creativebloq.com/news/adobe-icon-update-2020
- Atlassian · Our bold new brand — https://www.atlassian.com/blog/announcements/our-bold-new-brand
- Atlassian Design · Building Atlassian's new icon system — https://atlassian.design/whats-new/building-atlassians-new-icon-system
- JetBrains · New icons in IntelliJ Platform 2018.2 — https://blog.jetbrains.com/blog/2018/06/26/new-icons-in-intellij-platform-2018-2/
- Google Workspace Updates · Fresh visual identity for app icons (2026-05) — https://workspaceupdates.googleblog.com/2026/05/introducing-fresh-visual-identity-for-Google-Workspace-app-icons.html
- 9to5Google · New Gmail icon (2020) — https://9to5google.com/2020/10/06/new-gmail-icon/
- UX Collective · The way we design AI looks like nostalgia already — https://uxdesign.cc/the-way-we-design-ai-looks-like-nostalgia-already-aa5dfc01d4c7
- Big Medium · Your sparkles are fizzling — https://bigmedium.com/ideas/your-sparkles-are-fizzling.html
- Fast Company · AI boom logo trend — https://www.fastcompany.com/90869029/ai-boom-logo-trend-swirling-hexagon
- Fast Company · How the sparkle emoji took over AI — https://www.fastcompany.com/91030156/how-the-sparkle-emoji-took-over-ai
- VelvetShark (Radek Sienkiewicz) — https://velvetshark.com/ai-company-logos-that-look-like-buttholes
- DesignRush · Claude logo design — https://www.designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference · Claude · Submit a plugin — https://claude.com/docs/plugins/submit
- Raycast · Prepare an extension for the Store — https://developers.raycast.com/basics/prepare-an-extension-for-store
- JetBrains · Plugin icon file — https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html
- JetBrains Marketplace · Best practices for listing (ห้ามโลโก้ที่เป็นแค่ชื่อ · ห้ามคล้ายแบรนด์อื่น) — https://plugins.jetbrains.com/docs/marketplace/best-practices-for-listing.html
- VS Code · Extension manifest — https://code.visualstudio.com/api/references/extension-manifest
- VS Code · Publishing extensions (ไอคอนใน package.json ห้ามเป็น SVG) — https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Chrome Web Store · Images — https://developer.chrome.com/docs/webstore/images


## reference: icon-sets.md

# ชุดไอคอนฟรีที่ใช้ทำงานจริงได้

อ่านจาก README และไฟล์ใบอนุญาตใน repo ทางการเมื่อ 2026-10-26 · ใบอนุญาตเปลี่ยนได้ ก่อนส่งงานลูกค้าให้เปิดไฟล์ LICENSE ของรุ่นที่ใช้จริงอีกครั้ง

| ชุด | ใบอนุญาต | จำนวน | กริด · เส้น | ใช้ในแอป | ใช้ทำโลโก้ |
|---|---|---|---|---|---|
| [Lucide](https://github.com/lucide-icons/lucide) | ISC | 1,600+ | 24 · เส้น 2 · มีกฎออกแบบละเอียดที่สุด ใช้วาดตัวที่ขาดได้ | ได้ คงข้อความลิขสิทธิ์ | ได้ตามใบอนุญาต แต่คนอื่นใช้ไอคอนเดียวกันได้ จึงไม่เป็นเอกลักษณ์ |
| [Tabler](https://github.com/tabler/tabler-icons) | MIT | 6,238 (เส้น 5,184 · ทึบ 1,054) | 24 · เส้น 2 | ได้ | เหมือน Lucide |
| [Phosphor](https://github.com/phosphor-icons/core) | MIT | ราว 1,248 | 6 น้ำหนัก thin ถึง duotone · ออกแบบที่ 16 (ยังไม่ได้ยืนยันกับเว็บหลัก) | ได้ เหมาะเมื่ออยากได้น้ำหนักให้เลือก | เหมือน Lucide |
| [Material Symbols](https://github.com/google/material-design-icons) | Apache 2.0 | 2,500–3,800+ (เอกสารให้ตัวเลขขัดกัน) | 24 · variable font ปรับ fill · weight · grade · optical size | ได้ ไม่บังคับเครดิต | ได้ ยกเว้นโลโก้บุคคลที่สามที่อยู่ในชุด |
| [Heroicons](https://github.com/tailwindlabs/heroicons) | MIT | 316 | 24 เส้น · 24 · 20 · 16 ทึบ | ได้ ชุดเล็ก | เหมือน Lucide |
| [Iconoir](https://github.com/iconoir-icons/iconoir) | MIT | 1,383 | 24 | ได้ | เหมือน Lucide |
| [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons) | MIT | ไม่ระบุใน repo | regular · filled | ได้ เข้ากับแอป Windows | เหมือน Lucide |
| [Remix Icon](https://github.com/Remix-Design/RemixIcon) | Remix Icon License v1.0 (ไม่ใช่ MIT · แก้ ม.ค. 2026) | 3,200+ | 24 | ได้ ปรับสี ขนาด เส้น | **ห้าม** แม้แก้เล็กน้อย · ห้ามแจกหรือขายเป็นชุด |
| SF Symbols | ข้อตกลงของ Apple | — | — | เฉพาะแอปบนแพลตฟอร์ม Apple | **ห้าม** ใช้ในไอคอนแอปหรือโลโก้ตาม HIG |

## เลือกชุดอย่างไร

1. **1 แอป 1 ชุด** · ไอคอนที่ขาดให้วาดตามกฎของชุดนั้น (กริด เส้น มุม) โดยเริ่มจากไอคอนในชุดที่ใกล้ที่สุด ไม่ผสม 2 ชุด
2. เว็บหรือแอปทั่วไปเริ่มที่ Lucide หรือ Tabler · อยากได้หลายน้ำหนักใช้ Phosphor · แอป Android หรือเว็บแนว Material ใช้ Material Symbols · แอป Windows ใช้ Fluent
3. โลโก้หรือไอคอนแอปที่ต้องเป็นของแบรนด์เอง ไม่ใช้ไอคอนจากชุดตรง ๆ เพราะคนอื่นใช้รูปเดียวกันได้ ใช้เป็นจุดตั้งต้นของสัดส่วนได้ แต่ต้องดัดแปลงจนเป็นของตัวเอง
4. จดชื่อชุด รุ่น และใบอนุญาตไว้ใน README หรือ NOTICE ของโปรเจกต์


## reference: specs.md

# ตัวเลขและขนาดไอคอนตามแพลตฟอร์ม

ทุกแถวเปิดแหล่งอ่านเมื่อ 2026-10-26 · ตัวเลขเปลี่ยนตามรุ่นของแพลตฟอร์ม ก่อนส่งงานจริงให้เปิดลิงก์ตรวจซ้ำ

## ไอคอนในหน้าจอ (UI icon)

| เรื่อง | ค่า | แหล่ง |
|---|---|---|
| ขนาดแสดงผล | 24 · หนาแน่น 20 · Atlassian ใช้ 16 | Material 1 · Atlassian |
| พื้นที่วาด (live area) | 20×20 ใน 24 (เว้นขอบ 2 ด้านละ) · Lucide เว้นอย่างน้อย 1 | Material 1 · Lucide |
| keyline shapes บนกริด 24 | วงกลม 20 · จัตุรัส 18 · แนวตั้ง 16×20 · แนวนอน 20×16 · วงกลมใหญ่กว่าจัตุรัสเพราะตาเห็นวงกลมเล็กกว่าจริง | Material 1 |
| น้ำหนักเส้น | 2 ทั้งชุด · ชิ้นซับซ้อนลดเป็น 1.5 ได้ · Atlassian ใช้ 1.5 บนกริด 16 | Material 1 · Lucide · Atlassian |
| มุม | มุมนอกโค้ง radius 2 (รูปเล็กกว่า 8 ใช้ 1) · มุมในแหลม · จุดที่เส้นมาชนกันเกิน 2 เส้นคงมุมแหลม | Lucide · Material 1 · Atlassian |
| ช่องว่าง | ระหว่างชิ้นอย่างน้อย 2 · ช่องในรูปต้องใส่วงกว้าง 2 ได้ | Lucide |
| พิกัด | ชิดพิกเซล (กริด 24 ลงที่ .0 หรือ .5 เมื่อเส้นหนา 2 จัดกึ่งกลางเส้น) แต่ห้ามแลกกับการจดจำหรือสมดุล | Lucide · Material 1 |
| ลำดับความสำคัญ | ความชัด → สมดุลภาพ → ความสม่ำเสมอกับชุด | Lucide |
| พื้นที่กด | ไอคอน 24 → เป้ากด 48 · 20 → 40 | Material 1 |
| ป้ายข้อความ | ใส่ป้ายข้อความที่มองเห็นตลอดข้างไอคอน แม้ไอคอนมาตรฐาน · ไอคอนที่คนทั่วโลกเข้าใจตรงกันมีแค่ home · print · search | NN/g (2014-07-27) |
| metaphor | ตั้งชื่อตามรูป ไม่ใช่ตามหน้าที่ ("Shield, not security") · ตัวเสริม (modifier) อยู่มุมขวาล่าง · ตรวจความหมายทางวัฒนธรรม | Fluent 2 |
| Apple | น้ำหนัก 9 ระดับและ scale 3 ระดับเทียบตัวอักษรข้าง ๆ · custom symbol เริ่มจาก template ของ symbol ใกล้เคียง · ห้ามใช้ SF Symbols ในไอคอนแอปหรือโลโก้ | HIG SF Symbols |

## ไอคอนแอป โลโก้ favicon

| ปลายทาง | ไฟล์และขนาด | ข้อห้าม | แหล่ง |
|---|---|---|---|
| iOS · iPadOS · macOS | 1024×1024 จัตุรัส ไม่ตัดมุมเอง ระบบใส่ mask ให้ · พื้นทึบเต็มขอบ · variant default · dark · clear · tinted | ห้ามใส่เงา bevel glow เอง · เลี่ยงข้อความ เส้นบาง มุมแหลม | HIG App icons (แก้ล่าสุด 2026-06-08) |
| watchOS · visionOS | 1088 · 1024 · ระบบใส่ mask วงกลม | watchOS เลี่ยงพื้นดำล้วน | เหมือนข้างบน |
| Android adaptive | เลเยอร์ละ 108×108dp · เนื้อหาหลักอยู่ใน 66×66dp กลาง (ขั้นต่ำ 48) · ต้องมีเลเยอร์ monochrome สำหรับ themed icon | ห้ามใส่ mask หรือเงาในไฟล์ OEM เป็นคนตัด | Android Developers |
| Windows | อย่างน้อย 16 · 24 · 32 · 48 · 256 · ไฟล์ `targetsize-N` แบบ unplated ทั้งธีมมืดและสว่าง ไม่งั้นระบบใส่แผ่นรอง | — | Microsoft Learn (แก้ 2026-08-05) |
| เว็บ | `favicon.ico` 32 (เพิ่ม 16 ถ้า 32 ย่อแล้วเบลอ) · `icon.svg` รองรับธีมมืดด้วย media query · `apple-touch-icon.png` 180 มี padding และสีพื้น · `icon-192.png` · `icon-512.png` · maskable 512 ลายอยู่ใน 409 กลาง | Google Search ไม่รับ SVG อย่างเดียว ต้องมี PNG หรือ ICO · ขั้นต่ำ 8×8 แนะนำเกิน 48 | Evil Martians (Andrey Sitnik · 2026-01-21) · Google Search Central |
| plugin ของ Claude Code | ช่อง `icon` ใน `plugin.json` ชี้ไฟล์รูปใน plugin เช่น `./logo.png` · ใช้แค่หน้ารายการตอน `claude.ai/directory/manage` Claude Code ไม่อ่าน | เอกสารไม่กำหนดขนาด รูปทรง หรือธีม (ตรวจ 2026-10-26) · ด่าน directory รับ PNG JPEG GIF WebP SVG · ทำต้นแบบ SVG แล้วส่งออก PNG 512 ไว้ก่อน ใช้กับ Raycast ได้ด้วย | code.claude.com plugins-reference · publish |

## แหล่ง

- Material Design 1 · Icons — https://m1.material.io/style/icons.html (M3 เปิดอ่านไม่ได้เพราะหน้าต้องรัน JavaScript ตัวเลขจึงมาจาก M1)
- Lucide · Design principles — https://lucide.dev/contribute/icons/design-principles
- Atlassian · Iconography — https://atlassian.design/foundations/iconography/
- Microsoft Fluent 2 · Iconography — https://fluent2.microsoft.design/iconography
- Apple HIG · SF Symbols — https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- Apple HIG · App icons — https://developer.apple.com/design/human-interface-guidelines/app-icons
- Android · Adaptive icons — https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- Microsoft Learn · Construct your Windows app's icon — https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction
- Evil Martians · How to favicon — https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- Google Search Central · Favicon — https://developers.google.com/search/docs/appearance/favicon-in-search
- NN/g · Icon usability — https://www.nngroup.com/articles/icon-usability/
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference


---

# skill: simplify

Use when a deliverable has steps, layers or options nobody needs yet, or a newcomer must follow it. Not Claude Code /simplify.

# simplify — ทำให้ง่าย คนอ่านครั้งแรกก็ตามได้

ใช้กับทุกงานที่ส่งให้คน ทั้งโค้ด เอกสาร แผน ดีไซน์ สไลด์ ตาราง และคำตอบ · `human-writing` คุมว่า**เขียนอย่างไร** ส่วน skill นี้คุมว่า**ตัวงานมีอะไรบ้าง** · อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies`

## 1 · หลักใหญ่

- **บททดสอบ:** คนที่ไม่ได้อยู่ในงานนี้ เปิดดูอีก 6 เดือนข้างหน้า ต้องเข้าใจและแก้ต่อได้โดยไม่ต้องถามใคร
- ทำเท่าที่โจทย์ต้องการ ไม่เผื่ออนาคตที่ยังไม่มีใครขอ
- ตัดก่อนเพิ่ม · ถ้าตัดส่วนไหนออกแล้วความหมายหรือการทำงานไม่เสีย ให้ตัด
- ของธรรมดาที่คนรู้จักดีกว่าของฉลาดที่ต้องถอดรหัส
- **ง่ายไม่ใช่มักง่าย** — ห้ามตัดความถูกต้อง ความปลอดภัย การตรวจข้อมูลที่รับจากภายนอก การจัดการ error ที่กันข้อมูลหาย และสิ่งที่ผู้ใช้ขอไว้ชัด ๆ
- **ง่ายไม่ใช่กองรวม** — ลดจำนวนของ แต่ยังแยกหน้าที่ชัด 1 ส่วนทำ 1 เรื่อง เหมือนงานของมืออาชีพ

## 2 · บันไดก่อนลงมือ — หยุดที่ขั้นแรกที่ใช้ได้

1. ต้องมีสิ่งนี้จริงไหม · ไม่จำเป็น → ไม่ทำ แล้วบอก 1 บรรทัดว่าข้ามอะไร
2. มีของเดิมที่ใช้ได้แล้วไหม (ไฟล์ แม่แบบ ฟังก์ชัน เครื่องมือ ฟีเจอร์ที่ติดมากับระบบ) · มี → ใช้ของเดิม
3. ทำแบบสั้นที่สุดที่ยังครบและถูก

## 3 · ตามชนิดงาน

| งาน | ทำ | เลี่ยง |
|---|---|---|
| **โค้ด** | ชื่อบอกว่าคืออะไรและมีหน่วย · 1 ฟังก์ชันทำ 1 เรื่อง · คืนค่าออกเร็วแทนการซ้อน `if` · เยื้องไม่เกิน 3 ชั้น · คอมเมนต์บอก "ทำไม" · ตามสไตล์ของโปรเจกต์ | abstraction ที่มีตัวใช้ตัวเดียว · ทางลัดที่ฉลาดแต่อ่านยาก · ไฟล์ก้อนเดียวทำทุกอย่าง · โฟลเดอร์ `utils/` กองรวม · dependency ใหม่เพื่องานไม่กี่บรรทัด |
| **เอกสาร · รายงาน** | ข้อสรุปขึ้นก่อน · 1 ย่อหน้า 1 เรื่อง · ตัวอย่างประกอบข้อที่เป็นนามธรรม · ตารางสำหรับข้อมูลที่เทียบกัน | ทวนสิ่งที่พูดไปแล้ว · หัวข้อที่ไม่มีเนื้อ · ศัพท์ที่คนอ่านไม่รู้ |
| **แผน · ขั้นตอน** | 3–5 ข้อสำคัญ · ทุกข้อมีเจ้าของและวัดได้ว่าเสร็จ · ขั้นน้อยที่สุดที่ได้ผล | รายการ 20 ข้อที่ไม่มีลำดับความสำคัญ · ขั้นที่มีไว้ "เผื่อ" |
| **ดีไซน์ · สไลด์ · รูป** | 1 หน้า 1 ใจความ · ทางสั้นสุดไปถึงเป้าของผู้ใช้ · ใช้แบบที่คนคุ้นเคย | อัดข้อมูลจนต้องเพ่ง · ของตกแต่งที่ไม่ช่วยให้เข้าใจ |
| **ตาราง · ข้อมูล** | คอลัมน์เท่าที่ใช้ตัดสินใจ · สูตรสั้นที่ตามได้ | คอลัมน์ซ้ำความหมาย · สูตรซ้อนยาวบรรทัดเดียว |
| **คำตอบ** | ตอบก่อน · ยาวเท่าที่คำถามต้องการ | อธิบายยาวกว่าตัวงาน |

plugin `software-company` มีรายละเอียดของโค้ดและสถาปัตยกรรมเพิ่ม: `lazy-coding` (เขียนให้น้อย) · `readable-code` (ชื่อ รูปร่างฟังก์ชัน โครงไฟล์) · `simplicity-first` (เอกสาร แผน สถาปัตยกรรม) · ถ้าติดตั้งอยู่ให้เปิดคู่กัน

## 4 · บอกว่าตั้งใจทำให้ง่าย

ทางลัดที่ตั้งใจ ให้เขียนไว้ว่าใช้ได้ถึงแค่ไหนและเปลี่ยนเมื่อไร จะได้ไม่ดูเหมือนลืม เช่น `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` · ในรายงานใส่ 1 บรรทัด `ข้าม: X — เพิ่มเมื่อ Y`

## 5 · ตรวจก่อนส่ง 5 ข้อ

1. คนนอกเปิดดูครั้งแรกแล้วเข้าใจภายใน 30 วินาทีไหม
2. มีส่วนไหน ขั้นไหน หรือชั้นไหนตัดออกได้โดยไม่เสียอะไรไหม ถ้ามีให้ตัด
3. ทุกส่วนที่เพิ่มมา มีเหตุผลว่าต้องใช้ตอนนี้ ไม่ใช่ "เผื่อ" ใช่ไหม
4. ยังครบเรื่องความถูกต้อง ความปลอดภัย และสิ่งที่ผู้ใช้ขอไหม
5. ยังแยกหน้าที่ชัด ไม่ได้ยุบหลายเรื่องไว้ที่เดียวเพื่อให้ดูสั้นใช่ไหม
