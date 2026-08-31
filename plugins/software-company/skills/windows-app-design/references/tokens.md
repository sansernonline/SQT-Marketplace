# Token map — ค่าเดียวกัน สามสแต็ก

ค่าทั้งหมดวัดจาก Windows 11 dark theme จริง (สุ่มพิกเซลจากหน้า Windows Security)
แก้ที่ `assets/fluent.css` แล้วแก้ให้ตรงกันในไฟล์ XAML/AXAML ด้วยเสมอ

## สี — dark / light

| ความหมาย | Dark | Light | CSS | WinUI 3 | Avalonia |
|---|---|---|---|---|---|
| พื้นหน้าต่าง | `#000000` | `#F3F3F3` | `--win-bg` | `AppBackgroundBrush` | `AppBackgroundBrush` |
| พื้น nav / เนื้อหา | `#000000` | `#F9F9F9` | `--win-layer` | `AppLayerBrush` | `AppLayerBrush` |
| การ์ด | `#0F0F0F` | `#FFFFFF` | `--win-card` | `AppCardBrush` | `AppCardBrush` |
| ข้อความหลัก | `#FFFFFF` | `#1A1A1A` | `--win-text` | `TextFillColorPrimaryBrush` ✱ | `AppTextBrush` |
| ข้อความรอง | `#CCCCCC` | `#5D5D5D` | `--win-text-secondary` | `TextFillColorSecondaryBrush` ✱ | `AppTextSecondaryBrush` |
| ข้อความจาง | `#8B8B8B` | `#8B8B8B` | `--win-text-tertiary` | `TextFillColorTertiaryBrush` ✱ | `AppTextTertiaryBrush` |
| accent (พื้นปุ่ม, แถบเลือก) | `#4CC2FF` | `#005FB8` | `--win-accent` | `AccentFillColorDefaultBrush` ✱ | `SystemAccentColor` ✱ |
| accent (ตัวหนังสือ/ลิงก์) | `#99EBFF` | `#003E92` | `--win-accent-text` | `AccentTextFillColorPrimaryBrush` ✱ | `AppAccentTextBrush` |
| ตัวอักษรบนพื้น accent | `#000000` | `#FFFFFF` | `--win-on-accent` | `TextOnAccentFillColorPrimaryBrush` ✱ | `AppOnAccentBrush` |
| พื้นปุ่มปกติ | `#333333` | `#FFFFFF` | `--win-control` | `ControlFillColorDefaultBrush` ✱ | `AppControlBrush` |
| แถวที่เลือกใน nav | `#0F0F0F` | `#00000010` | `--win-subtle-selected` | `SubtleFillColorSecondaryBrush` ✱ | `AppSubtleSelectedBrush` |
| เส้นคั่น | `#2D2D2D` | `#E5E5E5` | `--win-divider` | `AppDividerBrush` | `AppDividerBrush` |

✱ = key มาตรฐานของเฟรมเวิร์ก — override แล้วคอนโทรลสำเร็จรูปเปลี่ยนตามทั้งแอป
ส่วน key ที่ขึ้นต้น `App*` เป็นของเราเอง ต้องอ้างเองใน XAML

## สถานะ

| สถานะ | Dark fg / bg | Light fg / bg | CSS |
|---|---|---|---|
| สำเร็จ | `#6CCB5F` / `#393D1B` | `#0F7B0F` / `#DFF6DD` | `--win-success` / `-bg` |
| เตือน | `#FCE100` / `#433519` | `#9D5D00` / `#FFF4CE` | `--win-caution` / `-bg` |
| ผิดพลาด | `#FF99A4` / `#442726` | `#C42B1C` / `#FDE7E9` | `--win-critical` / `-bg` |
| ข้อมูล | `#60CDFF` / `#2E2E2E` | `#005FB8` / `#F4F9FF` | `--win-info` / `-bg` |

> พื้นของ InfoBar ในโหมดมืดเป็นโทน **กลาง** ไม่ใช่สีอิ่มตัว — ถ้าใช้สีจัดเป็นพื้น
> แถบเดียวจะแย่งสายตาจากทั้งหน้า

## Type ramp (Fluent 2) — ห้ามคิดขนาดใหม่นอกชุดนี้

| ระดับ | ขนาด/บรรทัด | น้ำหนัก | CSS class | WinUI style | ใช้กับ |
|---|---|---|---|---|---|
| Caption | 12 / 16 | 400 | `.win-caption` | `CaptionTextBlockStyle` | ป้ายกำกับ, คำอธิบายในแถวตั้งค่า |
| Body | 14 / 20 | 400 | `.win-body` | `BodyTextBlockStyle` | เนื้อความทั้งหมด |
| Body Strong | 14 / 20 | 600 | `.win-body-strong` | `BodyStrongTextBlockStyle` | หัวข้อย่อยในการ์ด |
| Body Large | 18 / 24 | 400 | `.win-body-large` | `BodyLargeTextBlockStyle` | ข้อความนำ |
| Subtitle | 20 / 28 | 600 | `.win-subtitle` | `SubtitleTextBlockStyle` | หัวข้อกลุ่มในหน้า |
| Title | 28 / 36 | 600 | `.win-title` | `TitleTextBlockStyle` | ชื่อหน้า (หน้าละหนึ่ง) |
| Title Large | 40 / 52 | 600 | `.win-title-large` | `TitleLargeTextBlockStyle` | หน้า hero เท่านั้น |

ฟอนต์: **Segoe UI Variable** (Text สำหรับ ≤18px, Display สำหรับ ≥20px)
Segoe UI Variable **ไม่มีอักษรไทย** → Windows fallback ไป **Leelawadee UI** ให้เอง
บน web-wrapped ต้องเขียน fallback เองใน `font-family`

## รูปทรง · ระยะ · เลย์เอาต์

| ค่า | ตัวเลข | ใช้กับ |
|---|---|---|
| มุมคอนโทรล | 4px | ปุ่ม, textbox, checkbox, combo |
| มุมการ์ด | 8px | card, expander, flyout, dialog |
| Title bar | 48px | แบบ Windows 11 (32px = แบบคลาสสิก) |
| ปุ่มหน้าต่าง | 46 × 48px | ย่อ/ขยาย/ปิด — ห้ามเปลี่ยนขนาด |
| NavigationView เปิด | 320px | ค่ามาตรฐาน |
| NavigationView ย่อ | 48px | เหลือไอคอน |
| แถวเมนู nav | สูง 40px | ไอคอน 16px · ช่องไฟไอคอน–ข้อความ 16px |
| แถบบอกหน้าที่เลือก | 3 × 16px มุมมน 2px | ชิดซ้ายสุด สี accent |
| ความกว้างเนื้อหาสูงสุด | 1064px | เกินนี้ตาไล่บรรทัดไม่ไหว |
| ขอบเนื้อหาซ้าย/ขวา | 36px | 16px เมื่อหน้าต่างแคบกว่า 640px |
| ระยะระหว่าง section | 40px | |
| ปุ่ม | สูง 32px · กว้างต่ำสุด 120px | |
| ปุ่ม/เป้าคลิกเล็กสุด | 32 × 32px | เดสก์ท็อป (ไม่ใช่ 48px แบบมือถือ) |

## จุดตัดขนาดหน้าต่าง (Fluent breakpoints)

| ช่วง | ชื่อ | พฤติกรรม |
|---|---|---|
| < 640px | Small | nav เป็น overlay · ขอบ 16px · คอลัมน์เดียว |
| 641–1007px | Medium | nav ย่อเหลือไอคอน · คอลัมน์ขวาตกลงมาล่าง |
| ≥ 1008px | Large | nav เปิดเต็ม · สองคอลัมน์ |

## ไอคอน

ใช้ **Segoe Fluent Icons** (มากับ Windows 11) ขนาด 16px ใน nav, 20px ในหัวข้อ section,
24px ในหัวหน้า — ห้ามผสมชุดไอคอนอื่นในแอปเดียวกัน

| ใช้ | โค้ด | | ใช้ | โค้ด |
|---|---|---|---|---|
| หน้าแรก | `E80F` | | ตั้งค่า | `E713` |
| แฮมเบอร์เกอร์ | `E700` | | ย้อนกลับ | `E72B` |
| ย่อ / ขยาย / ปิด | `E921` `E922` `E8BB` | | รีเฟรช | `E72C` |
| โล่ (ความปลอดภัย) | `EA18` | | เตือน | `E7BA` |
| ผู้ใช้ | `E77B` | | ประวัติ | `E81C` |
| เครือข่าย | `EC05` | | อัปเดต | `E895` |

ดูรายการเต็ม: Microsoft Learn → "Segoe Fluent Icons font"
บนเครื่องที่ไม่ใช่ Windows ฟอนต์นี้ไม่มี ไอคอนจะกลายเป็นสี่เหลี่ยม — mockup ที่จะให้
คนดูบน Mac/Linux ต้องสลับไปใช้ inline SVG แทน
