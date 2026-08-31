---
name: windows-app-design
description: Use when designing or building a desktop app UI that must look like a native Windows 11 app — WinUI 3 / Windows App SDK, Avalonia, .NET MAUI, or a web-wrapped desktop shell (Electron, Tauri, WebView2). Provides the Fluent 2 design tokens measured from real Windows 11 (colors, type ramp, spacing, radii, NavigationView metrics, breakpoints), a drop-in fluent.css, WinUI and Avalonia ResourceDictionaries carrying the same values, an HTML mockup template of the Windows app shell, and a render-and-look verification loop. Use it for any window layout, navigation pane, settings page, dashboard, dialog, or Windows-style component. NOT for web sites or mobile apps.
---

# Windows App Design

> **กฎข้อเดียว:** แอปที่ทำต้องดูเหมือนของที่มากับ Windows 11 ไม่ใช่เว็บที่ถูกยัดใส่หน้าต่าง
> ผู้ใช้ Windows รู้ทันทีว่าอะไรไม่ใช่ของแท้ — มุมโค้งผิดขนาด ปุ่มสูงผิด เมนูอยู่ผิดที่

## เมื่อไหร่ใช้ skill นี้

- ทำแอปเดสก์ท็อปบน **WinUI 3 / Windows App SDK**, **Avalonia**, **.NET MAUI**
- ห่อเว็บเป็นเดสก์ท็อปด้วย **Electron / Tauri / WebView2**
- ออกแบบหน้าต่าง, แถบเมนูซ้าย, หน้าตั้งค่า, แดชบอร์ด, dialog
- ต้องรองรับธีมสว่าง/มืดตามระบบ

## เมื่อไหร่ **ไม่** ใช้

- เว็บไซต์ หรือแอปมือถือ → ใช้ agent `ux-designer` ตามปกติ
- เอกสาร .docx/.pptx → `branded-document-design`
- ไดอะแกรมในเอกสาร → `markdown-visuals`

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ

```
1. คัดลอก assets/mockup-template.html + assets/fluent.css ไปไว้คู่กัน
2. แก้เนื้อหาใน mockup ให้เป็นหน้าจริงที่จะทำ (ยังไม่แตะโค้ดแอป)
3. python scripts/screenshot.py mockup.html out/     → ได้ภาพ dark + light
4. เปิดภาพดูจริงทั้งสองโหมด แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นโค้ดจริง — ใช้ token ชุดเดียวกัน ไม่ออกแบบใหม่
```

**ทำไมต้อง mockup ก่อน:** แก้ HTML ใช้เวลาเป็นนาที แก้ XAML ที่ผูกกับ ViewModel แล้ว
ใช้เวลาเป็นชั่วโมง และการถกเรื่องหน้าตาบนโค้ดที่เขียนไปแล้วจะกลายเป็นการถกเรื่องต้นทุน

---

## 2 · Design tokens

ค่าทั้งหมดวัดจาก Windows 11 dark theme จริง อยู่ครบใน **`references/tokens.md`**
(ตารางเทียบ CSS ↔ WinUI ↔ Avalonia) และพร้อมใช้ใน:

| ไฟล์ | สำหรับ |
|---|---|
| `assets/fluent.css` | web-wrapped desktop + mockup |
| `assets/FluentTokens.xaml` | WinUI 3 / Windows App SDK |
| `assets/FluentTokens.axaml` | Avalonia 11 (แนวเดียวกันใช้กับ MAUI ได้) |

ค่าที่ต้องจำได้โดยไม่ต้องเปิดตาราง:

| | Dark | Light |
|---|---|---|
| พื้นหน้าต่าง | `#000000` | `#F3F3F3` |
| ข้อความหลัก / รอง | `#FFFFFF` / `#CCCCCC` | `#1A1A1A` / `#5D5D5D` |
| accent | `#4CC2FF` | `#005FB8` |
| ลิงก์ | `#99EBFF` | `#003E92` |
| พื้นปุ่ม | `#333333` | `#FFFFFF` |

**เปลี่ยนแบรนด์** = แก้ 3 ค่า (`accent`, `accent-text`, `on-accent`) ที่เดียวทั้งแอป

> ⚠️ **ห้ามเขียนค่าสีดิบในคอมโพเนนต์** ต้องอ้าง token เสมอ ไม่งั้นโหมดมืดจะพังเป็นจุด ๆ
> โดยที่ไม่มีใครเห็นจนกว่าลูกค้าจะเปิดใช้

---

## 3 · โครงหน้าต่าง

```
┌──────────────────────────────────────────────── 48px title bar ─┐
│ ชื่อแอป (12px)                              ─  □  ✕  (46×48)    │
├──────────────┬──────────────────────────────────────────────────┤
│ ☰            │  ชื่อหน้า            Title 28/36                  │
│ 320px        │  คำอธิบายหนึ่งบรรทัด  Body 14/20 สีรอง             │
│              │                                                  │
│ ▍เมนูที่เลือก │  หัวข้อกลุ่ม         Subtitle 20/28    ┌─ rail ─┐ │
│  เมนูอื่น     │  เนื้อหา…                              │ ลิงก์   │ │
│              │  ← กว้างไม่เกิน 1064px →                │ ช่วยเหลือ│ │
│              │                                        └────────┘ │
│ ⚙ ตั้งค่า     │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
   ↑ ล่างสุดเสมอ        ↑ ขอบซ้าย/ขวา 36px · ระยะระหว่าง section 40px
```

กฎที่คนทำเว็บมักพลาด:

- **เมนูตั้งค่าอยู่ล่างสุดของ nav เสมอ** — ผู้ใช้ Windows หาที่นั่นก่อนที่อื่น
- **แถบบอกหน้าที่เลือกเป็นขีดเล็ก 3×16px ชิดซ้าย** ไม่ใช่ระบายพื้น accent ทั้งแถว
- **หน้าละหนึ่ง Title** — ไม่มีสอง
- **เป้าคลิกเล็กสุด 32×32px** (ไม่ใช่ 48px แบบมือถือ — เดสก์ท็อปมีเมาส์)
- **ปุ่มสูง 32px กว้างต่ำสุด 120px** ปุ่มเตี้ยกว่านี้ดูเป็นเว็บทันที
- **มุม 4px สำหรับคอนโทรล / 8px สำหรับการ์ด** — ไม่มีค่าอื่น

---

## 4 · คอมโพเนนต์ที่มีให้แล้วใน fluent.css

| องค์ประกอบ | คลาส | หมายเหตุ |
|---|---|---|
| Title bar + ปุ่มหน้าต่าง | `.win-titlebar` | Electron: มี `-webkit-app-region: drag` ให้แล้ว |
| NavigationView | `.win-nav` / `.nav-item.selected` | ย่อเป็นไอคอนอัตโนมัติเมื่อ < 1008px |
| การ์ด | `.win-card` | |
| แถวตั้งค่าแบบ Windows | `.win-setting` | ไอคอน + ชื่อ + คำอธิบาย + คอนโทรลขวา |
| InfoBar | `.win-infobar.success/caution/critical` | **ใช้แทน `alert()` เสมอ** |
| Status pill | `.win-pill.success/caution/critical` | |
| KPI | `.win-kpis .kpi` | 3–5 ช่อง เกินนั้นตัวเลขเล็กจนไม่มีพลัง |
| Toggle switch | `.win-toggle` | |
| ตาราง | `.win-table` | |
| ลิงก์ | `.win-link` | สี accent-text ไม่ใช่ accent |

ไอคอนใช้ **Segoe Fluent Icons** (มากับ Windows 11) — 16px ใน nav, 20px หัวข้อ section,
24px หัวหน้า ห้ามผสมชุดไอคอนอื่น รหัสที่ใช้บ่อยอยู่ท้าย `references/tokens.md`

---

## 5 · ภาษาไทยบนแอป Windows

- **Segoe UI Variable ไม่มีอักษรไทย** — Windows จะ fallback ไป **Leelawadee UI** ให้เอง
  แต่บน web-wrapped / Avalonia ต้องเขียน fallback เอง (`fluent.css` ใส่ไว้แล้ว)
- ระยะบรรทัด 20px ที่ 14px พอสำหรับไทย แต่ถ้าเป็นย่อหน้ายาวให้เพิ่มเป็น 22px
- **ห้าม justify** — ไทยไม่มีช่องว่างระหว่างคำ จะยืดจนเป็นรู
- ปุ่มที่มีข้อความไทยกว้างกว่าอังกฤษ ~20% → อย่า fix ความกว้างปุ่มตายตัว
- ทดสอบด้วยข้อความไทยจริงเสมอ ไม่ใช่ Lorem ipsum

---

## 6 · ตรวจงาน — ห้ามข้าม

```bash
python scripts/screenshot.py mockup.html out/                 # 1440px = Large
python scripts/screenshot.py mockup.html out/ --width 900     # Medium
python scripts/screenshot.py mockup.html out/ --width 600     # Small
```

แล้วเปิดภาพดูจริง ตรวจตามนี้:

- [ ] **โหมดมืดและสว่างถูกทั้งคู่** — ไม่มีข้อความจมพื้น ไม่มีกล่องขาวโผล่ในธีมมืด
- [ ] หน้าต่างแคบแล้ว nav ย่อเป็นไอคอน · คอลัมน์ขวาตกลงมาล่าง · ไม่มีอะไรล้นออกนอกจอ
- [ ] เนื้อหาไม่กว้างเกิน 1064px บนจอใหญ่
- [ ] ข้อความไทยไม่ล้นปุ่ม วรรณยุกต์ไม่ชนสระ
- [ ] เป้าคลิกทุกอันไม่เล็กกว่า 32×32px
- [ ] คอนทราสต์ข้อความ ≥ 4.5:1 (ข้อความรองบนพื้นการ์ดคือจุดที่พลาดบ่อยที่สุด)
- [ ] เดินด้วย Tab ได้ครบทุกปุ่ม และ **เห็น focus ring** ทุกจุด
- [ ] ไม่มีสีดิบหลงเหลือ: `grep -nE "#[0-9a-fA-F]{3,6}" app.css | grep -v "^fluent.css"`

---

## 7 · Anti-patterns

- ❌ **ระบายพื้น accent ทั้งแถวเมนูที่เลือก** — Windows ใช้ขีดเล็กชิดซ้าย
- ❌ **มุมโค้ง 12–16px** — นั่นคือหน้าตาเว็บ/มือถือ Windows ใช้ 4 กับ 8
- ❌ **เงาใต้การ์ด** — Windows 11 ใช้เส้นขอบบาง ๆ เงาสงวนไว้ให้ flyout/dialog เท่านั้น
- ❌ **`alert()` / `confirm()`** ในแอปที่ห่อเว็บ — ใช้ InfoBar หรือ ContentDialog
- ❌ **ทำเฉพาะโหมดมืดเพราะภาพต้นแบบเป็นมืด** — ผู้ใช้ Windows ส่วนใหญ่ใช้สว่าง
- ❌ **ฮาร์ดโค้ดสี accent เป็นน้ำเงิน** — ถ้าอยากตามสีที่ผู้ใช้ตั้งไว้ ต้องอ่านจากระบบ
  (WinUI: อย่า override `AccentFillColorDefaultBrush` · web: `AccentColor` ของ CSS)
- ❌ **แถบเมนูกว้างตามใจ** — 320px เปิด / 48px ย่อ เท่านั้น
- ❌ **ส่ง mockup โดยไม่เคยเรนเดอร์ดู** — ดูข้อ 6

---

## 8 · ข้อจำกัดที่ต้องรู้

- ไฟล์ `.xaml` / `.axaml` ในนี้ **ยังไม่ผ่านการคอมไพล์ทดสอบ** เป็นชุดค่าโทเคนล้วน ๆ
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) ซึ่งเป็นไวยากรณ์
  มาตรฐาน แต่ให้ build ครั้งแรกแล้วดูว่ามี key ไหนชนกับของเฟรมเวิร์กหรือไม่
- WinUI ต้องเมิร์จ `FluentTokens.xaml` **หลัง** `XamlControlsResources` ไม่งั้นค่าถูกทับ
- ชื่อ theme dictionary ต่างกัน: WinUI ใช้ `Default`/`Light`/`HighContrast`
  ส่วน Avalonia ใช้ `Default`/`Light`/`Dark`
- **โหมดคอนทราสต์สูง** ห้ามใส่สีตายตัว ต้องดึงจากสีระบบ (มีตัวอย่างในไฟล์ XAML)
- Mica / Acrylic ทำได้จริงเฉพาะ WinUI/Avalonia บน Windows — บน web-wrapped
  ให้ใช้สีทึบตาม token แทน อย่าพยายามเลียนด้วย `backdrop-filter` เพราะได้ไม่เหมือน
  และกินเครื่อง

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / wireframe ก่อนลงสี | agent `ux-designer` |
| กราฟในแดชบอร์ด | `markdown-visuals` (ออกแบบ) แล้ว render เป็น SVG |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| เลือกสถาปัตยกรรมแอป | `architecture-patterns` |
