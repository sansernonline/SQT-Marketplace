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
