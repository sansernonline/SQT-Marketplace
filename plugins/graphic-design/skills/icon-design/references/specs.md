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
