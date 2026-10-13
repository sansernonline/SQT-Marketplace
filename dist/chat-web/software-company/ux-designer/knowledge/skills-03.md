# skill: windows-app-design

Use when building a desktop app or mockup that must look native on Windows 11 (WinUI 3, MAUI). Browser-based → web-app-design.

# Windows App Design

> **กฎข้อเดียว:** แอปที่ทำต้องดูเหมือนของที่มากับ Windows 11 ไม่ใช่เว็บที่ถูกยัดใส่หน้าต่าง
> ผู้ใช้ Windows รู้ทันทีว่าอะไรไม่ใช่ของแท้ — มุมโค้งผิดขนาด ปุ่มสูงผิด เมนูอยู่ผิดที่
>
> **เนทีฟไม่ได้แปลว่าใช้ธีมตั้งต้น** — แอปเด่นบน Windows 11 (Windows Terminal · Dev Home · แอป Files) ใช้กติกาเนทีฟ (ขนาด · มุม · ปุ่ม · แถบชื่อ) แต่มีตัวตนของตัวเอง: ธีมเริ่มต้นที่เลือกเอง (มืดได้) · สี accent ของแบรนด์ · Mica/Acrylic ย้อมสี · โลโก้ในแถบชื่อ · หน้าจอพระเอก · เลือกตัวตนตาม `ui-craft` ข้อ 0.1 ก่อนเริ่ม · `fluent.css` คือพื้น ไม่ใช่หน้าตาสุดท้าย

## เมื่อไหร่ใช้ skill นี้

- ทำแอปเดสก์ท็อปบน **WinUI 3 / Windows App SDK**, **Avalonia**, **.NET MAUI**
- ห่อเว็บเป็นเดสก์ท็อปด้วย **Electron / Tauri / WebView2**
- ออกแบบหน้าต่าง, แถบเมนูซ้าย, หน้าตั้งค่า, แดชบอร์ด, dialog
- ต้องรองรับธีมสว่าง/มืดตามระบบ

## เมื่อไหร่ **ไม่** ใช้

- เว็บแอป ให้ใช้ `web-app-design` · แอปมือถือ ให้ใช้ `mobile-app-design`
- เอกสาร .docx/.pptx ให้ใช้ `branded-document-design`
- ไดอะแกรมในเอกสาร ให้ใช้ `markdown-visuals`

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ

> **โปรเจกต์มีหน้าจออยู่แล้ว → ลอกหน้าเดิมตาม `ui-craft` ข้อ 0 ไม่ใช้ template ใหม่** (ยกเว้นสั่งออกแบบใหม่ หรือหน้าเดิมยังไม่ผ่านด่านสวย) · ลำดับด้านล่างสำหรับโปรเจกต์ที่ยังไม่มีหน้าตาเลย หรือกำลังออกแบบใหม่

```
0. ทิศทางภาพตาม ui-craft ข้อ 0.1 (หน้าจอพระเอก · แอปอ้างอิง · 3 แนว · เลือก 1 · โลโก้) → ได้ token ของแบรนด์ทับ fluent.css
   (เช่น --win-accent สีแบรนด์ · ธีมเริ่มต้นมืด · พื้น Mica ย้อมสี) — เขียนเป็นบล็อก token ต่อท้าย fluent.css ไม่แก้ไฟล์ต้นฉบับ
1. เลือกโครงจากตารางข้อ 0 ใน references/patterns.md แล้วคัดลอก template ที่ตรงกับแอป + assets/fluent.css ไปไว้คู่กัน
   (mockup-template.html = ตั้งค่า/dashboard · tool-app-template.html = แอปเครื่องมือที่ข้อมูลแน่น · หน้าตาของทั้งสองแบบดูได้ที่ assets/templates-preview.webp)
2. ทำ 3 หน้าหลักก่อน (หน้าที่ผู้ใช้เปิดบ่อยที่สุด) ให้สวยจริง ยังไม่ทำหน้าที่เหลือ
3. python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --hide "<แถบควบคุมของ mockup>"  → ได้ภาพ dark + light
4. เปิดภาพดูจริงทั้งสองโหมด ตรวจตามข้อ 6 รวมถึงตาราง "ตรวจด้วยตา" ท้าย patterns.md
5. ส่งภาพให้ subagent ที่ไม่ได้ทำงานชิ้นนี้วิจารณ์ (ดูข้อ 6.1) แก้ตามแล้วถ่ายใหม่ · จำนวนรอบตามเพดานด่านสวยใน `ui-craft/references/states-and-checks.md`
6. 3 หน้าหลักผ่านและอนุมัติแล้ว จึงดึงคอมโพเนนต์ออกมาใช้กับหน้าที่เหลือ
7. อนุมัติทั้งชุดแล้วจึงแปลงเป็นโค้ดจริง — ใช้ token ชุดเดียวกัน ไม่ออกแบบใหม่
```

**ทำไมทำ 3 หน้าก่อน:** ทำทุกหน้าในรอบเดียว (เช่น 32 หน้า) แต่ละหน้าได้ความใส่ใจด้านหน้าตาน้อย
งานจะไปเน้นว่าครอบคลุม requirement ครบไหม จนได้ wireframe ที่ลงสีแล้ว ส่วนหน้าหลักที่สวยแล้วจะเป็นแบบให้หน้าที่เหลือลอก

**mockup ส่งมอบเป็นไฟล์เดียว** (`mockup/<รหัส>-mockup.html` ทุกหน้าจอเป็น section) → ฝังเนื้อ `fluent.css` ลงใน `<style>` แทน `<link>` ก่อนส่ง · ระหว่างทำวางคู่กันได้

**ทำไมต้อง mockup ก่อน:** แก้ HTML ใช้เวลาเป็นนาที แต่แก้ XAML ที่ผูกกับ ViewModel แล้ว
ใช้เวลาเป็นชั่วโมง และถ้าเขียนโค้ดไปแล้ว การคุยเรื่องหน้าตาจะกลายเป็นการคุยเรื่องต้นทุน

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
| พื้นหน้าต่าง / การ์ด | `#202020` / `#2B2B2B` | `#F3F3F3` / `#FFFFFF` |
| ข้อความหลัก / รอง | `#FFFFFF` / `#CCCCCC` | `#1A1A1A` / `#5D5D5D` |
| accent | `#4CC2FF` | `#005FB8` |
| ลิงก์ | `#99EBFF` | `#003E92` |
| พื้นปุ่ม | `#333333` | `#FFFFFF` |

> **ค่ากลาง (พื้น ข้อความ เส้น เงา) คือ Fluent 2 ที่วัดจาก Windows 11 จริง — ห้ามคิดเอง ห้ามปรับให้สวยขึ้น**
> แอปที่สีกลางไม่ตรงกับระบบปฏิบัติการ จะดูเหมือนของแปลกปลอมทันทีที่วางข้างแอปอื่น
>
> **สีที่เปลี่ยนตามงานมีแค่ accent** ให้ใช้สีแบรนด์ของลูกค้า ถ้ายังไม่มีให้ใช้ค่าเริ่มต้นของ Windows ในตารางข้างบน เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม · เสนอโทนจากเนื้องานไว้ในรายงาน
> (ตารางเลือกโทนสีตามเนื้องาน อยู่ใน [`colour-by-domain`](../diagram-figures/references/colour-by-domain.md))
> ค่า accent ในตารางข้างบนคือค่าเริ่มต้นของ Windows ซึ่งเป็นตัวเลือกที่ปลอดภัยเมื่อยังไม่มีแบรนด์
> **ไม่ใช่ค่าที่ต้องใช้** และ accent ต้องผ่าน contrast ≥ 4.5:1 ทั้งโหมดมืดและสว่าง จึงมักต้องมีคนละค่าต่อโหมด

**พื้นดำสนิท** แบบ Windows Security (`#000000`) ยังมีให้ใช้ด้วย `<html data-backdrop="black">` แต่ไม่ใช่ค่าเริ่มต้น เพราะวางข้างแอป Windows 11 อื่นแล้วดูแข็งและแปลกตา

**เปลี่ยนแบรนด์** = แก้ 3 ค่า (`accent`, `accent-text`, `on-accent`) ต่อโหมด (มืด · สว่าง) ในไฟล์ token ที่เดียวทั้งแอป

> ⚠️ **ห้ามเขียนค่าสีดิบในคอมโพเนนต์** ต้องอ้าง token เสมอ ไม่งั้นโหมดมืดจะพังเป็นจุด ๆ
> โดยที่ไม่มีใครเห็นจนกว่าลูกค้าจะเปิดใช้

---

## 3 · โครงหน้าต่าง

ภาพโครงหน้าต่างพร้อมขนาด (title bar 48px · nav 320px · Title 28/36 · ขอบซ้ายขวา 36px · ระยะระหว่าง section 40px · เนื้อหากว้างไม่เกิน 1064px) อยู่ใน [`references/frame-and-components.md`](references/frame-and-components.md)

กฎที่คนทำเว็บมักพลาด:

- **เมนูตั้งค่าอยู่ล่างสุดของ nav เสมอ** — ผู้ใช้ Windows หาที่นั่นก่อนที่อื่น
- **แถบบอกหน้าที่เลือกเป็นขีดเล็ก 3×16px ชิดซ้าย** ไม่ใช่ระบายพื้น accent ทั้งแถว
- **หน้าละ 1 Title** — ห้ามมี 2
- **เป้าคลิกเล็กสุด 32×32px** (ไม่ใช่ 48px แบบมือถือ — เดสก์ท็อปมีเมาส์)
- **ปุ่มสูง 32px กว้างต่ำสุด 120px** ปุ่มเตี้ยกว่านี้ดูเป็นเว็บทันที (ยกเว้นปุ่มไอคอน 32×32 และปุ่ม subtle ใน command bar)
- **มุม 4px สำหรับคอนโทรล / 8px สำหรับการ์ด** — ไม่มีค่าอื่น

โครงข้างบนเป็นของหน้าตั้งค่าและ dashboard · **แอปเครื่องมือที่ข้อมูลแน่น** (terminal client, file manager, admin tool)
ใช้ icon rail 48px + รายการ + แผงรายละเอียด 360px แทน ดูแบบทั้งหมดใน **`references/patterns.md`**
(ปุ่มในแถว · list-detail · command bar · หัวกลุ่ม · tab ใน title bar · status bar · หน้าเริ่มต้น · ไอคอนต้องมีที่ไหน)

---

## 4 · คอมโพเนนต์ที่มีให้แล้วใน fluent.css

ตารางคลาสพร้อมหมายเหตุอยู่ใน [`references/frame-and-components.md`](references/frame-and-components.md): title bar · nav · การ์ด · แถวตั้งค่า · InfoBar · pill · KPI · toggle · ตาราง · ลิงก์ — **InfoBar ใช้แทน `alert()` เสมอ** · KPI 3–5 ช่อง · ลิงก์ใช้สี accent-text ไม่ใช่ accent

ไอคอนใช้ **Segoe Fluent Icons** (มากับ Windows 11) ขนาด 16px ใน nav, 20px หัวข้อ section,
24px หัวหน้า ห้ามผสมชุดไอคอนอื่น ส่วนรหัสที่ใช้บ่อยอยู่ท้าย `references/tokens.md` และ `references/patterns.md`
**ไอคอนไม่ใช่ของตกแต่ง** — หน้าจอที่ปุ่มและเมนูเป็นข้อความล้วนจะดูเหมือน wireframe ทันที ดูตาราง "ต้องมีที่ไหน" ใน patterns.md ข้อ 9

---

## 5 · ภาษาไทยบนแอป Windows

- **Segoe UI Variable ไม่มีอักษรไทย** — Windows จะ fallback ไป **Leelawadee UI** ให้เอง
  แต่บน web-wrapped / Avalonia ต้องเขียน fallback เอง (`fluent.css` ใส่ไว้แล้ว)
- ระยะบรรทัด 20px ที่ 14px พอสำหรับไทย แต่ถ้าเป็นย่อหน้ายาวให้เพิ่มเป็น 22px
- **ห้าม justify** เพราะไทยไม่มีช่องว่างระหว่างคำ ข้อความจะถูกยืดจนเป็นช่องโหว่
- ปุ่มที่มีข้อความไทยกว้างกว่าอังกฤษ ~20% จึงอย่า fix ความกว้างปุ่มตายตัว
- ทดสอบด้วยข้อความไทยจริงเสมอ ไม่ใช่ Lorem ipsum

---

## 6 · ตรวจงาน — ห้ามข้าม

```bash
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/                 # 1440px = Large
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 900     # Medium
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 600     # Small
```

แล้วเปิดภาพดูจริง ตรวจตามนี้:

- [ ] **โหมดมืดและสว่างถูกทั้งคู่** — ไม่มีข้อความจมพื้น ไม่มีกล่องขาวโผล่ในธีมมืด
- [ ] พอหน้าต่างแคบแล้ว nav ย่อเป็นไอคอน คอลัมน์ขวาตกลงมาล่าง และไม่มีอะไรล้นออกนอกจอ
- [ ] เนื้อหาไม่กว้างเกิน 1064px บนจอใหญ่
- [ ] ข้อความไทยไม่ล้นปุ่ม วรรณยุกต์ไม่ชนสระ
- [ ] เป้าคลิกทุกอันไม่เล็กกว่า 32×32px
- [ ] คอนทราสต์ข้อความ ≥ 4.5:1 (ข้อความรองบนพื้นการ์ดคือจุดที่พลาดบ่อยที่สุด)
- [ ] เดินด้วย Tab ได้ครบทุกปุ่ม และ **เห็น focus ring** ทุกจุด
- [ ] ไม่มีสีดิบหลงเหลือ และทุก `var(--win-…)` มีนิยามจริง — รันตัวตรวจของ `web-app-design` (ต้องส่ง `--require` เป็น token ชุด Fluent เพราะค่าเริ่มต้นเป็นชื่อของเว็บ และ `--marker "Type ramp"` เพราะ `fluent.css` ไม่มีเส้น `base`):

  คำสั่งทั้ง 2 แบบ (ไฟล์ token แยก · mockup ไฟล์เดียว) อยู่ใน [`references/review.md`](references/review.md) · แอปเพิ่ม token ของตัวเอง → ต่อท้าย `--require` · ตั้งชื่อ section ในหน้า mockup ขึ้นต้น `s-`

**เช็กลิสต์ข้างบนวัดแค่ความถูกต้อง ผ่านครบแล้วหน้าจอยังอาจไม่สวย** ตรวจต่อด้วยตาราง "ตรวจด้วยตา" ท้าย `references/patterns.md` (ปุ่มทึบ · ไอคอน · พื้นที่ว่าง · ความสูงแถว · จำนวนกล่อง) แล้วจบด้วย**ด่านสวย** 6 แกนของ `ui-craft` (`references/states-and-checks.md` ชุดที่ 3) — ทุกแกน ≥ 4 จึงส่งให้คนอนุมัติ

### 6.1 · ให้คนอื่นวิจารณ์

คนที่ทำเองจะเห็นว่างานตัวเองดีกว่าความจริง ให้ส่งภาพให้ subagent ที่ไม่ได้ทำชิ้นนี้ (ถ้าติดตั้ง plugin `graphic-design` ใช้ `graphic-design:design-critic` ไม่มีก็ใช้ general-purpose ที่สั่งให้วิจารณ์อย่างเดียว) พร้อมบอกเป้าหมาย:

ข้อความสั่งงานผู้วิจารณ์ (เป้า · 2–3 ปัญหาต่อหน้า · วิธีแก้ระดับ CSS · ไม่ชม · ≤ 250 คำ) อยู่ใน [`references/review.md`](references/review.md)

แก้ตามข้อที่เห็นด้วย (ข้อที่วิจารณ์ผิดเพราะอ่านภาพผิด ไม่ต้องแก้ แต่จดไว้) แล้วถ่ายใหม่ · จำนวนรอบตามเพดานด่านสวยใน `ui-craft/references/states-and-checks.md` (เกินเพดาน = กลับไปเลือกทิศทางภาพใหม่ ไม่แก้ไปมา)

---

## 7 · Anti-patterns

ข้อห้าม 16 ข้อ (ระบายพื้น accent ทั้งแถวเมนู · มุม 12–16px · เงาใต้การ์ด · `alert()` · ทำแค่โหมดมืด · ปุ่มทึบทุกแถว · ปุ่มไม่มีไอคอน ฯลฯ) อยู่ใน [`references/review.md`](references/review.md)

---

## 8 · ข้อจำกัดที่ต้องรู้

ข้อจำกัด 5 ข้ออยู่ใน [`references/review.md`](references/review.md) — สำคัญสุด: `.xaml`/`.axaml` ยังไม่ผ่านการคอมไพล์ทดสอบ และ WinUI ต้องเมิร์จ `FluentTokens.xaml` **หลัง** `XamlControlsResources`

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / wireframe ก่อนลงสี | agent `ux-designer` |
| กราฟในแดชบอร์ด | `web-app-design` → `references/tokens.md` หัวข้อ "สีข้อมูล (กราฟ)" |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| เลือกสถาปัตยกรรมแอป | `architecture-patterns` |
| กฎระยะห่าง ลำดับสายตา และ 5 สถานะของหน้าจอ | `ui-craft` |
| ไดอะแกรมสถาปัตยกรรม | `software-diagrams` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: frame-and-components.md

# โครงหน้าต่างและคอมโพเนนต์ใน fluent.css — ส่วนขยายของ `windows-app-design`

เปิดตอนวางหน้าตั้งค่า/dashboard (ข้อ 3) หรือหาคลาสที่มีให้แล้ว (ข้อ 4) · แอปเครื่องมือที่ข้อมูลแน่นดู `patterns.md`

## โครงหน้าต่าง หน้าตั้งค่าและ dashboard (ข้อ 3)

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

## คอมโพเนนต์ที่มีให้แล้วใน fluent.css (ข้อ 4)

| องค์ประกอบ | คลาส | หมายเหตุ |
|---|---|---|
| Title bar + ปุ่มหน้าต่าง | `.win-titlebar` | Electron: มี `-webkit-app-region: drag` ให้แล้ว |
| NavigationView | `.win-nav` / `.nav-item.selected` | ย่อเป็นไอคอนอัตโนมัติเมื่อ < 1008px |
| การ์ด | `.win-card` | |
| แถวตั้งค่าแบบ Windows | `.win-setting` | ไอคอน + ชื่อ + คำอธิบาย + คอนโทรลขวา |
| InfoBar | `.win-infobar.success/caution/critical` | **ใช้แทน `alert()` เสมอ** |
| Status pill | `.win-pill.success/caution/critical` | |
| KPI | `.win-kpis .kpi` | 3–5 ช่อง · เกินนั้นตัวเลขเล็กจนไม่เด่น |
| Toggle switch | `.win-toggle` | |
| ตาราง | `.win-table` | |
| ลิงก์ | `.win-link` | สี accent-text ไม่ใช่ accent |


## reference: patterns.md

# แบบหน้าจอที่ใช้บ่อย — แอป Windows

> token และกฎขนาดอยู่ใน `tokens.md` · ไฟล์นี้ตอบคำถามว่า **จัดหน้าจอยังไงให้ดูเป็นแอปจริง**
> ทุกแบบมีตัวอย่างที่กดได้ใน `assets/tool-app-template.html` (แอปเครื่องมือ) หรือ `assets/mockup-template.html` (หน้าตั้งค่า/dashboard)

ที่มา: หน้าจอที่ผ่านเช็กลิสต์ครบทุกข้อ (token ถูก ขนาดถูก contrast ผ่าน) แต่ยังดูเหมือน wireframe
มักพลาดซ้ำ 6 อย่าง ได้แก่ ปุ่มทึบทุกแถว · ไม่มีไอคอน · จอว่างครึ่งล่าง · หัวกลุ่มตัวพิมพ์ใหญ่เล็กจิ๋ว · ป้ายสีแบบเว็บ · กล่องมีกรอบเต็มหน้า
แบบในไฟล์นี้แก้ทั้ง 6 อย่าง

**สารบัญ**

- [0 · เลือกโครงก่อนวาด](#0--เลือกโครงก่อนวาด)
- [1 · รายการที่มีปุ่มในแต่ละแถว](#1--รายการที่มีปุ่มในแต่ละแถว)
- [2 · รายการ + แผงรายละเอียด](#2--รายการ--แผงรายละเอียด-list-detail)
- [3 · Command bar](#3--command-bar)
- [4 · หัวกลุ่มในรายการ](#4--หัวกลุ่มในรายการ)
- [5 · Tab ใน title bar](#5--tab-ใน-title-bar-แบบ-windows-terminal)
- [6 · Icon rail](#6--icon-rail)
- [7 · Status bar](#7--status-bar)
- [8 · หน้าเริ่มต้น](#8--หน้าเริ่มต้น-welcome--start)
- [9 · ไอคอน — ต้องมีที่ไหน](#9--ไอคอน--ต้องมีที่ไหน)
- [ตรวจด้วยตา](#ตรวจด้วยตา--นับได้-ไม่ต้องใช้ความรู้สึก)

---

## 0 · เลือกโครงก่อนวาด

| แอปเป็นแบบไหน | โครง | template |
|---|---|---|
| ตั้งค่า · dashboard · แอปที่เปิดนาน ๆ ที | NavigationView 320px + เนื้อหากว้างไม่เกิน 1064px | `mockup-template.html` |
| เครื่องมือที่ข้อมูลแน่น (terminal client · file manager · admin tool) | icon rail 48px + รายการ + แผงรายละเอียด 360px | `tool-app-template.html` |
| เอกสารหลายชิ้นเปิดพร้อมกัน (editor · terminal · browser) | tab ใน title bar แบบ Windows Terminal | `tool-app-template.html` ส่วน title bar |

**ห้ามเอา template หน้าตั้งค่าไปทำแอปเครื่องมือ** — ได้หน้าจอที่เนื้อหาลอยอยู่ครึ่งบน และพื้นที่ขวาว่าง

---

## 1 · รายการที่มีปุ่มในแต่ละแถว

```
❌ ทุกแถวมี [Connect] สีทึบ + [Edit]       → ปุ่มทึบ 8 ปุ่มแย่งกันเด่น
✅ ชื่อ · ข้อมูล · เวลา         ▷ ✎ ⋯       → ไอคอนโผล่เมื่อชี้หรือเลือกแถว
   ปุ่มหลัก (สีทึบ) อยู่ที่แผงรายละเอียดของแถวที่เลือก · ดับเบิลคลิก = ทำงานหลัก
```

- ปุ่มในแถว: `btn subtle icon` 32×32 · ซ่อนด้วย `visibility: hidden` (ไม่ใช่ `display: none` ไม่งั้นคอลัมน์จะขยับ)
- คอลัมน์ปุ่มกว้างตายตัว (ราว 112px ต่อ 3 ปุ่ม) ไม่งั้นคอลัมน์ "ล่าสุด" จะไม่ตรงกับปุ่ม
- แถวที่เลือก: พื้น `--win-subtle-selected` + ขีด accent 3px ชิดซ้าย

## 2 · รายการ + แผงรายละเอียด (list-detail)

ใช้เมื่อหน้าต่างกว้าง ≥ 1100px และรายการมีข้อมูลมากกว่าที่แถวเดียวแสดงได้

- แผงขวากว้าง 360px พื้น `--win-card` · padding 24px · ระยะระหว่างส่วน 24px
- บนลงล่าง: ไอคอน 48px + ชื่อ 20px → ปุ่มหลัก (ยืดเต็มแถว) + ปุ่มรอง → คู่ ชื่อ/ค่า (label 112px) → ประวัติ (แถว 32px มีเส้นคั่น) → หมายเหตุ
- หน้าต่างแคบกว่า 1100px ให้ซ่อนแผง แล้วเปิดเป็นหน้าใหม่แทน

**จอว่างเกินครึ่งคือสัญญาณว่าควรใช้แบบนี้** ไม่ใช่สัญญาณให้ยืดตาราง

## 3 · Command bar

```
[+ สร้างใหม่] [📁 กลุ่มใหม่] │ [⇥ นำเข้า] [↦ ส่งออก]          [ทั้งหมด|SSH|RDP]  [🔍 กรอง…]
```

- ปุ่มทุกปุ่มเป็น subtle + ไอคอน 16px + ข้อความ · คั่นกลุ่มด้วยเส้นตั้ง 1×20px
- ไม่มีปุ่มทึบใน command bar ถ้าหน้านั้นมีแผงรายละเอียด (ปุ่มหลักอยู่ในแผง)
- ช่องค้นหาชิดขวา กว้าง 240–320px · มีไอคอนแว่นขยายนำหน้า

## 4 · หัวกลุ่มในรายการ

```
❌ PRODUCTION · 3      (11px ตัวพิมพ์ใหญ่ สีจาง — แบบเว็บ)
✅ ⌄ Production  3     (14px semibold · ตัวเลขสีรอง · แถว 32–40px · กดพับได้)
```

## 5 · Tab ใน title bar (แบบ Windows Terminal)

- tab สูง 32px ชิดล่างของ title bar 40px · มุมบน 8px
- tab ที่เลือก = พื้นเดียวกับเนื้อหาด้านล่าง (ดูต่อกันเป็นแผ่นเดียว) · tab อื่นพื้นใส
- สถานะบอกด้วยจุด 8px + ข้อความ/tooltip **ไม่ใช้เส้นสีบน tab** (ดูเหมือน error)
- ท้าย tab มี `+` และ `⌄` (รายการ tab)

## 6 · Icon rail

- กว้าง 48px · ปุ่ม 40×40 · ไอคอน 18px · ห่างกัน 4px
- ที่เลือก: พื้น `--win-subtle-selected` + ขีด accent 3×16px ชิดซ้าย
- ตั้งค่าอยู่ล่างสุดเสมอ · ทุกปุ่มมี `title` (tooltip) เพราะไม่มีข้อความ

## 7 · Status bar

- สูง 24px · ข้อความ 12px สีรอง · ห่างกัน 16px
- สถานะใช้จุด 6–8px + ข้อความ **ไม่ใช้ป้ายพื้นสีทึบ** (เป็นแบบเว็บ)

## 8 · หน้าเริ่มต้น (welcome / start)

> ข้อนี้ใช้กับหน้าเริ่มต้นในแอป ส่วนหน้าแรกของ mockup (`#s-start`) ที่คนรีวิวเปิดดูเป็นสารบัญ ใช้การ์ดพร้อมภาพย่อได้ ดู `ui-craft` → `references/mockup-start-page.md`

- เนื้อหากว้างไม่เกิน 1064px อยู่กลาง · บนสุดคือช่องค้นหาช่องเดียวที่ทำได้ทั้งค้นหาและเชื่อมต่อ (ไม่แยก 2 ช่อง)
- ทางลัดเป็นแถวปุ่มสูง 40px (ไอคอน + ข้อความ + ปุ่มลัด) **ไม่ใช่การ์ดใหญ่ 4 ใบ**
- กล่องมีกรอบได้ไม่เกิน 2 กล่อง (เช่น ล่าสุด · รายการโปรด) · ข่าวสารเป็นแถบ 40px พื้นกลาง ไม่ใช้สีแบรนด์

## 9 · ไอคอน — ต้องมีที่ไหน

| ที่ | ต้องมี | ขนาด |
|---|---|---|
| ปุ่มใน nav / rail | ✅ | 16 / 18px |
| ปุ่มใน command bar | ✅ คู่ข้อความ | 16px |
| ปุ่มในแถว | ✅ ไอคอนอย่างเดียว + tooltip | 16px |
| ชนิดของรายการ (SSH · ไฟล์ · RDP) | ✅ ในกล่อง 24px มุม 4px | 14px |
| หัวแผงรายละเอียด | ✅ กล่อง 48px มุม 8px | 24px |
| ปุ่มหลักใน dialog | ไม่จำเป็น | — |

รหัสที่ใช้บ่อย (Segoe Fluent Icons): เพิ่ม `E710` · ค้นหา `E721` · ตั้งค่า `E713` · แก้ไข `E70F` · อื่น ๆ `E712` · เล่น/เปิด `E768`
· โฟลเดอร์ `E8B7` · กลุ่มใหม่ `E8F4` · นำเข้า `E8B5` · ส่งออก `EDE1` · terminal `E756` · จอ `E7F4` · ลิงก์ `E71B` · กุญแจ `E8D7`
· clipboard `E77F` · ลูกโลก `E774` · ประวัติ `E81C` · ดาว `E734` / `E735` · บ้าน `E80F` · ลูกศรลง `E70D` · ลูกศรขวา `E76C` · ปิด `E8BB`

---

## ตรวจด้วยตา — นับได้ ไม่ต้องใช้ความรู้สึก

| ข้อ | ผ่านเมื่อ |
|---|---|
| ปุ่มทึบสี accent | ≤ 1 ต่อหน้าจอ (`grep -c "btn primary"` ต่อ section) |
| ไอคอน | ครบทุกที่ในตารางข้อ 9 |
| พื้นที่ว่าง | เนื้อหาใช้พื้นที่ ≥ 60% ของความสูงหน้าต่างที่ 1440×900 หรือมีเหตุผล (หน้าว่างที่ตั้งใจ) |
| ความสูงแถว | แถวชนิดเดียวกันสูงเท่ากันทุกการ์ดในหน้า |
| กล่องมีกรอบ | ≤ 3 กล่องต่อหน้า · ไม่มีกล่องซ้อนกล่อง |
| ส่วนควบคุมของ mockup | ไม่ติดในภาพ (`screenshot.py --hide`) |


## reference: review.md

# ตรวจงาน วิจารณ์ ข้อห้าม และข้อจำกัด — ส่วนขยายของ `windows-app-design`

เปิดตอนทำข้อ 6 · 7 · 8 ของ `SKILL.md`

## คำสั่งตัวตรวจ token (ข้อ 6)

```bash
# ไฟล์ token แยก (web-wrapped · mockup ที่ยังวางคู่ fluent.css)
node ../web-app-design/scripts/check-design-tokens.mjs src/fluent.css src --ext html,css,ts,tsx \
  --marker "Type ramp" \
  --require "--win-bg,--win-layer,--win-card,--win-text,--win-text-secondary,--win-accent,--win-on-accent,--win-divider,--win-control-stroke,--win-radius,--win-radius-card,--win-font,--win-nav-w,--win-titlebar-h,--win-gutter"
# mockup ไฟล์เดียว: ใช้ไฟล์ mockup เป็นไฟล์ token เอง (token ฝังอยู่ใน <style>) · --require ชุดเดิม
node ../web-app-design/scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html --marker "Type ramp" --require "…"
```

  แอปเพิ่ม token ของตัวเอง (เช่น `--telex-…`) → ต่อท้าย `--require` ด้วย · ตั้งชื่อ section ในหน้า mockup ขึ้นต้น `s-` (`#s-login`) ไม่ให้ชื่ออย่าง `#add` `#feed` ถูกอ่านเป็นสี

## ข้อความสั่งงานผู้วิจารณ์ (ข้อ 6.1)

```
ดูภาพ <path dark/light> ของแอป Windows 11 (<ชนิดแอป>) เป้าคือดูเหมือน Windows Terminal / Settings / File Explorer
บอกปัญหาที่สำคัญที่สุด 2–3 ข้อต่อหน้า (ลำดับสายตา ระยะ แนว contrast ความหนาแน่น อะไรที่ดูเป็นเว็บ)
แต่ละข้อมีวิธีแก้ระดับ CSS (ขนาด px · องค์ประกอบไหน) · ไม่ต้องชม · ไม่เกิน 250 คำ
```

## Anti-patterns (ข้อ 7)

- ❌ **ระบายพื้น accent ทั้งแถวเมนูที่เลือก** — Windows ใช้ขีดเล็กชิดซ้าย
- ❌ **มุมโค้ง 12–16px** — นั่นคือหน้าตาเว็บ/มือถือ ส่วน Windows ใช้ 4px กับ 8px
- ❌ **เงาใต้การ์ด** — Windows 11 ใช้เส้นขอบบาง ๆ เงาสงวนไว้ให้ flyout/dialog เท่านั้น
- ❌ **`alert()` / `confirm()`** ในแอปที่ห่อเว็บ — ใช้ InfoBar หรือ ContentDialog
- ❌ **ทำเฉพาะโหมดมืดเพราะภาพต้นแบบเป็นมืด** — ผู้ใช้ Windows ส่วนใหญ่ใช้สว่าง
- ❌ **ฮาร์ดโค้ดสี accent เป็นน้ำเงิน** — ถ้าอยากตามสีที่ผู้ใช้ตั้งไว้ ต้องอ่านจากระบบ
  (WinUI: อย่า override `AccentFillColorDefaultBrush` · web: `AccentColor` ของ CSS)
- ❌ **แถบเมนูกว้างตามใจ** — 320px เปิด / 48px ย่อ เท่านั้น
- ❌ **ส่ง mockup โดยไม่เคยเรนเดอร์ดู** — ดูข้อ 6
- ❌ **ปุ่มทึบสี accent ทุกแถวของตาราง** — ปุ่มในแถวเป็นไอคอนที่โผล่เมื่อชี้ ปุ่มหลักอยู่ในแผงรายละเอียด (patterns.md ข้อ 1)
- ❌ **ปุ่มและเมนูเป็นข้อความล้วน ไม่มีไอคอน** — ดูเป็น wireframe
- ❌ **เนื้อหาอยู่ครึ่งบน ครึ่งล่างว่าง · ตารางยืดเต็มจอจนคอลัมน์ห่างกัน 400px** — ใช้ list-detail (patterns.md ข้อ 2)
- ❌ **หัวกลุ่ม 11px ตัวพิมพ์ใหญ่ · ป้ายพื้นสีทึบใน status bar · เส้นสีบน tab** — เป็นแบบเว็บ
- ❌ **การ์ดใหญ่หลายใบเรียงกันในหน้าเริ่มต้นของแอป** — ดูเป็น dashboard ของ SaaS ใช้แถวปุ่มทางลัดแทน (หน้าแรกของ mockup ไม่นับ ดู `ui-craft`)
- ❌ **แถบควบคุมของ mockup (รหัส FR · ตัวสลับสถานะ) ติดในภาพที่ส่งรีวิว** — ใช้ `screenshot.py --hide`
- ❌ **ทำทุกหน้าในรอบเดียวโดยไม่มีหน้าหลักเป็นแบบ** — ดูข้อ 1

## ข้อจำกัดที่ต้องรู้ (ข้อ 8)

- ไฟล์ `.xaml` / `.axaml` ในนี้ **ยังไม่ผ่านการคอมไพล์ทดสอบ** ในไฟล์มีแต่ค่า token
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) ที่ใช้ไวยากรณ์
  มาตรฐาน ตอน build ครั้งแรกให้ดูว่ามี key ไหนชนกับของเฟรมเวิร์กหรือไม่
- WinUI ต้องเมิร์จ `FluentTokens.xaml` **หลัง** `XamlControlsResources` ไม่งั้นค่าถูกทับ
- ชื่อ theme dictionary ต่างกัน: WinUI ใช้ `Default`/`Light`/`HighContrast`
  ส่วน Avalonia ใช้ `Default`/`Light`/`Dark`
- **โหมดคอนทราสต์สูง** ห้ามใส่สีตายตัว ต้องดึงจากสีระบบ (มีตัวอย่างในไฟล์ XAML)
- Mica / Acrylic ทำได้จริงเฉพาะ WinUI/Avalonia บน Windows ส่วนบน web-wrapped
  ให้ใช้สีทึบตาม token แทน อย่าเลียนแบบด้วย `backdrop-filter` เพราะได้ไม่เหมือน
  และกินเครื่อง


## reference: tokens.md

# Token map — ค่าเดียวกัน สามสแต็ก

> **ค่ากลาง (พื้น ข้อความ เส้น เงา ขนาด ระยะ) คือ Fluent 2 ที่วัดจาก Windows 11 จริง — คัดลอกไปใช้ได้เลย ห้ามปรับเอง**
> **`accent` เป็นสีเดียวที่เปลี่ยนตามงาน** ให้ใช้สีแบรนด์ของลูกค้า ถ้ายังไม่มีให้ใช้ค่าเริ่มต้นของ Windows ในไฟล์นี้ เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม
> ค่า accent ที่อยู่ในไฟล์นี้คือค่าเริ่มต้นของ Windows ใช้ได้เมื่อยังไม่มีแบรนด์ ไม่ใช่ค่าบังคับ

ค่าทั้งหมดวัดจาก Windows 11 dark theme จริง (สุ่มพิกเซลจากหน้า Windows Security)
แก้ที่ `assets/fluent.css` แล้วแก้ให้ตรงกันในไฟล์ XAML/AXAML ด้วยเสมอ

## สารบัญ

1. [สี — dark / light](#สี--dark--light)
2. [สถานะ](#สถานะ)
3. [Type ramp (Fluent 2) — ห้ามคิดขนาดใหม่นอกชุดนี้](#type-ramp-fluent-2--ห้ามคิดขนาดใหม่นอกชุดนี้)
4. [รูปทรง · ระยะ · เลย์เอาต์](#รูปทรง--ระยะ--เลย์เอาต์)
5. [จุดตัดขนาดหน้าต่าง (Fluent breakpoints)](#จุดตัดขนาดหน้าต่าง-fluent-breakpoints)
6. [ไอคอน](#ไอคอน)

---

## สี — dark / light

| ความหมาย | Dark | Light | CSS | WinUI 3 | Avalonia |
|---|---|---|---|---|---|
| พื้นหน้าต่าง | `#202020` | `#F3F3F3` | `--win-bg` | `AppBackgroundBrush` | `AppBackgroundBrush` |
| พื้น nav / เนื้อหา | `#272727` | `#F9F9F9` | `--win-layer` | `AppLayerBrush` | `AppLayerBrush` |
| การ์ด | `#2B2B2B` | `#FFFFFF` | `--win-card` | `AppCardBrush` | `AppCardBrush` |
| ข้อความหลัก | `#FFFFFF` | `#1A1A1A` | `--win-text` | `TextFillColorPrimaryBrush` ✱ | `AppTextBrush` |
| ข้อความรอง | `#CCCCCC` | `#5D5D5D` | `--win-text-secondary` | `TextFillColorSecondaryBrush` ✱ | `AppTextSecondaryBrush` |
| ข้อความจาง | `#9D9D9D` | `#8B8B8B` | `--win-text-tertiary` | `TextFillColorTertiaryBrush` ✱ | `AppTextTertiaryBrush` |
| accent (พื้นปุ่ม, แถบเลือก) | `#4CC2FF` | `#005FB8` | `--win-accent` | `AccentFillColorDefaultBrush` ✱ | `SystemAccentColor` ✱ |
| accent (ตัวหนังสือ/ลิงก์) | `#99EBFF` | `#003E92` | `--win-accent-text` | `AccentTextFillColorPrimaryBrush` ✱ | `AppAccentTextBrush` |
| ตัวอักษรบนพื้น accent | `#000000` | `#FFFFFF` | `--win-on-accent` | `TextOnAccentFillColorPrimaryBrush` ✱ | `AppOnAccentBrush` |
| พื้นปุ่มปกติ | `#333333` | `#FFFFFF` | `--win-control` | `ControlFillColorDefaultBrush` ✱ | `AppControlBrush` |
| แถวที่เลือกใน nav | `#FFFFFF15` | `#00000010` | `--win-subtle-selected` | `SubtleFillColorSecondaryBrush` ✱ | `AppSubtleSelectedBrush` |
| เส้นคั่น | `#3A3A3A` | `#E5E5E5` | `--win-divider` | `AppDividerBrush` | `AppDividerBrush` |

ค่า Dark คือ Windows 11 ปกติ (Mica) · แบบพื้นดำสนิทของ Windows Security (`#000000` · การ์ด `#0F0F0F` · เส้นคั่น `#2D2D2D`) เปิดด้วย `data-backdrop="black"` ใน `fluent.css`

✱ = key มาตรฐานของเฟรมเวิร์ก ถ้า override แล้วคอนโทรลสำเร็จรูปจะเปลี่ยนตามทั้งแอป
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
| Title | 28 / 36 | 600 | `.win-title` | `TitleTextBlockStyle` | ชื่อหน้า (หน้าละ 1 อัน) |
| Title Large | 40 / 52 | 600 | `.win-title-large` | `TitleLargeTextBlockStyle` | หน้า hero เท่านั้น |

ฟอนต์: **Segoe UI Variable** (Text สำหรับ ≤18px, Display สำหรับ ≥20px)
Segoe UI Variable **ไม่มีอักษรไทย** แต่ Windows จะ fallback ไป **Leelawadee UI** ให้เอง
ส่วนบน web-wrapped ต้องเขียน fallback เองใน `font-family`

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
| ความกว้างเนื้อหาสูงสุด | 1064px | กว้างกว่านี้ตาไล่บรรทัดยาก |
| ขอบเนื้อหาซ้าย/ขวา | 36px | 16px เมื่อหน้าต่างแคบกว่า 640px |
| ระยะระหว่าง section | 40px | |
| ปุ่ม | สูง 32px · กว้างต่ำสุด 120px | |
| ปุ่ม/เป้าคลิกเล็กสุด | 32 × 32px | เดสก์ท็อป (ไม่ใช่ 48px แบบมือถือ) |

## จุดตัดขนาดหน้าต่าง (Fluent breakpoints)

| ช่วง | ชื่อ | พฤติกรรม |
|---|---|---|
| < 640px | Small | nav เป็น overlay · ขอบ 16px · คอลัมน์เดียว |
| 641–1007px | Medium | nav ย่อเหลือไอคอน · คอลัมน์ขวาตกลงมาล่าง |
| ≥ 1008px | Large | nav เปิดเต็ม · 2 คอลัมน์ |

## ไอคอน

ใช้ **Segoe Fluent Icons** (มากับ Windows 11) ขนาด 16px ใน nav, 20px ในหัวข้อ section,
24px ในหัวหน้า และห้ามผสมชุดไอคอนอื่นในแอปเดียวกัน

| ใช้ | โค้ด | | ใช้ | โค้ด |
|---|---|---|---|---|
| หน้าแรก | `E80F` | | ตั้งค่า | `E713` |
| แฮมเบอร์เกอร์ | `E700` | | ย้อนกลับ | `E72B` |
| ย่อ / ขยาย / ปิด | `E921` `E922` `E8BB` | | รีเฟรช | `E72C` |
| โล่ (ความปลอดภัย) | `EA18` | | เตือน | `E7BA` |
| ผู้ใช้ | `E77B` | | ประวัติ | `E81C` |
| เครือข่าย | `EC05` | | อัปเดต | `E895` |

ดูรายการเต็ม: Microsoft Learn → "Segoe Fluent Icons font"
เครื่องที่ไม่ใช่ Windows ไม่มีฟอนต์นี้ ไอคอนจึงกลายเป็นสี่เหลี่ยม ดังนั้น mockup ที่จะให้
คนดูบน Mac/Linux ต้องสลับไปใช้ inline SVG แทน


---

# skill: markdown-visuals

Use when a markdown doc needs a picture (UI state, flow, architecture) that renders everywhere. Mermaid content → software-diagrams.

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — wireframe sketch or UI state in a spec, FSD, ADR or README
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (software-diagrams)
├─ Architecture / ER / class                →  Mermaid (software-diagrams)
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Follow the tree above**; when two branches fit, pick inline SVG over an image file. Inline SVG renders everywhere and versions cleanly in git. It adds no binary files to the repo, and the user can read and edit the markup.

## 1 · Inline SVG (primary technique)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — without this, GitHub may not render
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax so GitHub renders it
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Tell the user to preview it in GitHub or Notion.

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[diagram-figures]] — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

Pattern from `DockXI/docs/12-design-mockup.md`:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากเนื้องานไว้ในรายงาน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีแบรนด์** (ไม่มี → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states.


---

# skill: diagram-figures

Use when an architecture or concept figure must look designed for a proposal, slide, print or sign-off.

> **สีหลักของรูป = สีหลักของโปรเจกต์** · หาตามลำดับในข้อ 5 ถ้าหาไม่เจอเลยจึงใช้ชุดสีประจำบ้าน `#2A78D6` ใน `polished-document-style` ("ค่าตั้งต้นประจำบ้าน")

# Diagram Figures

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

skill นี้คือ house style เดียวของรูปที่ต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" มี 3 engine ซึ่งใช้สี ไอคอน และกติกาชุดเดียวกัน

## เลือกทาง

| ต้องการ | ไปที่ |
|---|---|
| รูปที่ต้องดูออกแบบมา สำหรับข้อเสนอลูกค้า · สไลด์ · งานพิมพ์ · เอกสารเซ็นรับ รวมถึงผังคลาวด์ที่ต้องมีโลโก้จริง | **skill นี้ — HTML layout engine** (ค่าเริ่มต้น · ข้อ 2) |
| รูปแบบเดียวกัน แต่ต้อง generate จากข้อมูลหรือโค้ด เช่น ออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือต้องคุมพิกัดบนกริดเอง | **skill นี้ — SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| บล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) ที่ต้องส่งในไฟล์ Word หรือ PDF ให้หน้าตาเหมือนรูปวาดมือ | **skill นี้ — Mermaid engine** ([references/engine-mermaid.md](references/engine-mermaid.md)) |
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

มี 4 โครงในโฟลเดอร์ `assets/` ให้**คัดลอกไปแก้ อย่าเริ่มเขียนเอง** ส่วนรายละเอียดของแต่ละโครงอยู่ในไฟล์ที่ลิงก์ไว้

| คำถามที่รูปตอบ | โครง | รายละเอียด |
|---|---|---|
| "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" — C4 ระดับ 1 | [`figure-context.html`](assets/figure-context.html) | [layout-context.md](references/layout-context.md) |
| "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" — deployment · container | [`figure-template.html`](assets/figure-template.html) | [layout-deployment.md](references/layout-deployment.md) |
| "ใช้บริการอะไรของคลาวด์บ้าง" — ต้องมีโลโก้ AWS · Azure · Google Cloud ของจริง | [`figure-cloud.html`](assets/figure-cloud.html) | [layout-cloud.md](references/layout-cloud.md) |
| "ข้อความ 1 ชิ้นวิ่งผ่านอะไรบ้าง ตามลำดับไหน" — ผังสถาปัตยกรรมแบบมีเลขลำดับ ①–⑥ · ผู้ใช้ → ช่องทาง → ชั้นในระบบ → บริการภายนอกและข้อมูล | [`figure-flow.html`](assets/figure-flow.html) · [ตัวอย่าง](assets/figure-flow-example.png) | [layout-flow.md](references/layout-flow.md) |

ทุกโครงใช้สี ขนาด ฟอนต์ และสคริปต์ลากเส้นชุดเดียวกัน ต่างกันแค่การจัดวาง

## 3 · หัวรูปต้องมีครบหกอย่าง

โลโก้โปรเจกต์ · ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ

โลโก้อยู่หน้าชื่อรูป (`<img class="logo">` ชี้ไป `assets/logo/` ของโปรเจกต์ · ไม่มีโลโก้ให้จดไว้ในรายงานว่าขาด) · คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ · **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

เหตุผลเต็มกับตัวอย่าง ❌/✅ ของคำขยาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "หัวรูป" 

## 4 · ระบบขนาด

**ขนาด ระยะ และมุม อยู่ใน `:root` ของ `assets/figure-template.html` แล้ว อย่าตั้งค่าใหม่เอง**
ตัวเลขพวกนี้ปรับจนรูปดูตั้งใจแล้ว ถ้าขยับเมื่อไหร่ รูปในเอกสารเดียวกันจะดูไม่เท่ากัน

**ขนาด ระยะ และมุม อยู่ใน `:root` ของ `assets/figure-template.html` แล้ว อย่าตั้งค่าใหม่เอง** · กรอบไอคอน 66px ขึ้นไป (ต่ำกว่า 56px รูปจะโหวง) · เส้นเชื่อมตั้งหรือนอนเท่านั้น หักมุมโค้ง ห้ามเส้นเฉียง

ตารางค่าเต็ม (ตัวอักษร · ไอคอน · กล่อง · `.focus` · เส้น · ระยะ) → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบขนาด" — เปิดเมื่อต้องปรับโครงหรือเขียนโครงใหม่

> **ขนาดตัวอักษรขึ้นกับที่ที่รูปจะไปวาง ไม่ใช่ผ้าใบ** — ตารางข้างบนเหมาะกับสไลด์และจอ · รูปที่จะวางในเอกสาร A4 ต้องคิดย้อนจากขนาดที่วาง: ตัวอักษรเล็กสุดหลังวาง ≥ 7pt → `px ขั้นต่ำ = 0.247 × ความกว้างผ้าใบ(px) ÷ ความกว้างที่วาง(ซม.)` · ผ้าใบ 2000px บนหน้าแนวตั้ง 17 ซม. = 29px · บนหน้าแนวนอน 25.7 ซม. = 20px · ขยายฟอนต์แล้วกล่องต้องกว้างพอให้ชื่อไทยไม่ตัดกลางคำ
> **2 ฉบับจากไฟล์ต้นทางเดียว:** ฉบับเต็ม (มีหัวรูป 5 อย่าง · ใช้เปิดเดี่ยว/สไลด์) และฉบับวางในเอกสาร (`?embed=1` ซ่อนหัวรูป เพราะคำบรรยายของเอกสารบอกแล้ว — หัวซ้ำทำให้รูปเล็กลงและดูรก) · สัดส่วนรูปให้กว้างพอวางเต็มหน้าแนวนอน (กว้าง ÷ สูง ≥ 1.46)
> **รูปทั้งชุดใช้ CSS ไฟล์เดียว** (`figure-theme.css` ข้างไฟล์ต้นทาง) ที่ดึงสี ฟอนต์ และโลโก้จากตัวตนของโปรเจกต์ (`assets/logo/` · token ของ mockup) — แก้ที่เดียว รูปทุกใบเปลี่ยนตาม
> **ด่านสวยของรูป** ไปพร้อมด่านสวยของเอกสาร (`branded-document-design` ข้อ 0.1) — เส้นทางหลักเส้นทึบสีเด่น · เส้นรองเทา · มีคำอธิบายสัญลักษณ์ · ลำดับการไหลมีเลขเมื่อมีมากกว่า 3 ขั้น

## 5 · ระบบสี

**สีหลักของรูปคือสีหลักของโปรเจกต์** ห้ามใช้สีจากตัวอย่างหรือจากรูปอ้างอิง หาตามลำดับนี้ เจอที่ไหนหยุดที่นั่น:

1. `doc-theme` ในเอกสารของโปรเจกต์ (ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")
2. สีแบรนด์ที่โปรเจกต์ใช้จริง — ตัวแปรสีหลักในโค้ด (`--primary` · `--brand` · `--accent` ใน CSS · `primary` ใน Tailwind / ธีม UI · `colorPrimary` ในแอปมือถือ) · ชุดแบรนด์ (brand kit) · สีหลักในโลโก้
   ดูสีพื้นจากที่เดียวกันด้วย (`--background` · `--bg` · `background` ใน Tailwind · โหมดมืดหรือสว่างที่แอปใช้เป็นหลัก) เพราะรูปและเด็คใช้สีพื้นตามดีไซน์ของโปรเจกต์
3. ยังไม่มีเลย → ใช้ชุดสีประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · เสนอโทนจาก [references/colour-by-domain.md](references/colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

เจอสีจากข้อ 2 แล้วแต่ยังไม่มี `doc-theme` ให้ประกาศ `doc-theme` ด้วยค่านั้น เพื่อให้รูป เอกสาร และสไลด์ของโปรเจกต์ใช้สีเดียวกัน

ในโครง HTML แก้ที่ `--accent` ใน `:root` ที่เดียว (SVG/Python engine แก้ `ACCENT` ใน `theme.py`) · สีพื้นตามดีไซน์ของโปรเจกต์ → ต่อท้ายชื่อไฟล์ `#accent=<สีหลัก>&bg=<สีพื้น>` · ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์ (สีโลโก้ผู้ให้บริการ · เทาโครงสร้าง) และ**สีไอคอน 7 กลุ่ม** (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) พร้อมความหมาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบสี" — สีที่ 8 แปลว่าใช้สีเพื่อความสวย

**จำกัดจำนวนสี ไม่ได้จำกัดน้ำหนักของสี** — ในรูปที่ต้องดูออกแบบมา สีหลักต้องเห็นได้ทั่วทั้งรูป ไม่ได้อยู่แค่แถบหัว: ป้ายที่ต้องหาให้เจอเร็ว (เลขขั้น · ผู้รับผิดชอบ · สถานะ) ใช้พื้นทึบ · การ์ดมีแถบสีหนาที่ขอบ · กล่องสรุปใช้พื้นสีเข้ม · สีพาสเทลใช้ได้แค่เป็นพื้นที่มีตัวหนังสือหรือขอบสีเข้มคู่กัน · ตรวจด้วยแกน "พลังของสี" ในด่านสวยของ `ui-craft` (`references/states-and-checks.md`)

### 5.1 · รูปต้องมีจุดเด่น ไม่จืด

รูปที่อ่านออกแต่จืด = การ์ดขาวหน้าตาเท่ากันทุกใบ · เส้นบางเท่ากันทุกเส้น · ไม่มีอะไรดึงสายตา ผู้ใช้จะบอกว่า "ดีขึ้นแต่ไม่ว้าว" ทางที่ผ่านด่านสวยแล้ว:

| ชิ้น | ทำอย่างไร |
|---|---|
| ผ้าใบ | ใช้พื้นเดียวกับตัวตนของแอป — แอปพื้นมืดก็ใช้รูปพื้นมืดทั้งใบ (ไม่ใช่กรอบขาวล้อมภาพมืด) · ลายจุดตารางจาง ๆ ทึบไม่เกิน 8% ให้มีมิติ |
| เส้นทางหลัก | หนา 6px สีแบรนด์ + เรืองแสง (`filter: drop-shadow(0 0 8px <สีแบรนด์ 75%>)`) · เส้นรองบาง สีเทา ไม่เรือง — ต่างกันชัดจนไม่ต้องอ่านคำอธิบายสัญลักษณ์ |
| จุดเด่น | การ์ด `.focus` 1 ใบต่อรูป: ขอบสีแบรนด์ 3px + แสงรอบ + ไอคอนพื้นสีแบรนด์ · การ์ดอื่นพื้นกลืนกับผ้าใบ |
| ป้ายลำดับ | พื้นสีแบรนด์ ตัวอักษรสีพื้นผ้าใบ + แสงรอบเบา ๆ |
| คอนทราสต์ | ข้อความรองบนพื้นมืด ≥ 7:1 (เทาอ่อน ไม่ใช่เทากลาง) |
| ธีม | ทุกสีเป็นตัวแปรใน css ไฟล์เดียว · หัวลูกศรอ่านสีจากตัวแปร (`getComputedStyle`) ไม่ฝังค่าใน JS · สีความหมาย (`t-app` `t-alert` `t-warn`) มีคู่สีของพื้นมืด · ห้ามใส่สีใน `style=""` ของไฟล์รูป |

**วิธีเลือกแนว:** เขียน 3 แนวเป็น css ทับ (override) ฉีดเข้ารูปจริง 2 รูปตอนเรนเดอร์ (`add_init_script` ก่อนสคริปต์วาดเส้นทำงาน) → วางเทียบกับรูปเดิม → ให้ผู้ตรวจที่ไม่ได้ทำให้คะแนน → แก้ theme css ไฟล์เดียวแล้วเรนเดอร์ทั้งชุด · รูปมืดในเอกสารหน้าขาวต้องเป็นการตัดสินใจที่จดไว้ (เช่น หน้าเปิดบทและปกก็มืด) ไม่ใช่เผลอ

## 6 · ไอคอน — ใช้ของทางการจากคลัง และวาดเองเฉพาะเมื่อไม่มี

**มีไอคอนทางการของบริการนั้นหรือไม่** เป็นตัวตัดสิน

- **ถ้ามี** (AWS · Azure · Google Cloud · Kubernetes · เครื่องมือโอเพนซอร์สส่วนใหญ่) ให้ใช้ของทางการจาก `assets/`
  คือ 205 ตัวที่คัดไว้ใน `assets/icons/` หรือคลังเต็มผ่าน `python assets/find-icon.py <ชื่อ>` ชุดเหล่านี้เผยแพร่มาเพื่อวาดผังสถาปัตยกรรมโดยเฉพาะ ส่วนรายการกลุ่ม คำสั่ง และสัญญาอนุญาตอยู่ใน [references/icons.md](references/icons.md)
- **ถ้าไม่มี** หรือเป็นของที่เราสร้างเอง ให้วาดไอคอนเส้นเอง แล้วเขียนที่เชิงอรรถว่า
  ไอคอนไม่ใช่โลโก้ทางการ (โครง `figure-template.html` มีบรรทัดนี้ให้แล้ว)
- **ห้ามปนกัน**ในรูปเดียว เพราะโลโก้สีจัดข้าง ๆ ไอคอนเส้นบางทำให้รูปดูไม่เสร็จ

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน · ต้องอ่านออกที่ 24px (รายละเอียดเกิน 3 เส้นกลายเป็นก้อนดำ)

## 7 · สายเชื่อม

**ในคอลัมน์เดียวกัน** ใช้ลูกศรลง `.down` · **ข้ามคอลัมน์** ใช้รายการ `WIRES` ท้ายไฟล์ (`{from, fs, to, ts, tp, label}`) ให้สคริปต์ลากหลังจัดหน้า — ห้ามเขียนพิกัดตายตัว

**กติกาที่ห้ามพลาด:**

- เส้นตั้งหรือนอนเท่านั้น หักมุมโค้งด้วย `elbow()` (ใช้ `mx` เมื่อหลายเส้นใช้ช่องเดียวกัน) · ห้ามเส้นเฉียง
- ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์ (ป้ายยาวขึ้น → เพิ่ม `gap` ของ `.stage`)
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป · ต่อเข้ากล่องเล็กที่สุดที่ถูกต้อง
- ป้ายบอกว่า**อะไรไหลผ่าน** (`HTTPS 443`) ไม่ใช่ `เชื่อมต่อ` · ไม่มีอะไรจะบอกไม่ต้องใส่ป้าย · เส้นที่ยังไม่ต่อจริงใช้ `planned:true` พร้อมเชิงอรรถ

ตัวอย่างโค้ด `WIRES` · ที่มาของแต่ละกติกา · `lp` · `tp` → [`references/wires.md`](references/wires.md) — เปิดเมื่อเขียน `WIRES`

## 8 · ภาษาไทย

- **`line-height` ต่ำกว่า 1.5 ไม่ได้** เพราะสระบนกับวรรณยุกต์ซ้อนกัน 2 ชั้นจะโดนตัด ด้วยเหตุผลเดียวกันจึง **ห้ามกำหนดความสูงตายตัวให้กล่องข้อความ**
- ฟอนต์เรียงตามนี้ `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` ซึ่งตั้งไว้ในโครงแล้ว
รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก · เอกสาร Word ใช้ Tahoma (`branded-document-design` ข้อ 2) รูปในนั้นต่างฟอนต์ได้ · ถ้าเครื่องไม่มีฟอนต์ไทยสักตัว สระจะผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**
- **ไทยไม่เว้นวรรคระหว่างคำ** เบราว์เซอร์จึงตัดบรรทัดกลางคำ ถ้าข้อความยาวให้ใส่ `<br>` เอง
- ตัวอักษรไทยดูเล็กกว่าอังกฤษที่ขนาดเท่ากัน ดังนั้นคำอธิบายอย่าต่ำกว่า 12px

## 9 · เรนเดอร์แล้วเปิดดู — ห้ามข้าม

```bash
pip install playwright && playwright install chromium
cp <skill>/assets/render-figure.py docs/figures/render.py     # ครั้งแรกของโปรเจกต์
python docs/figures/render.py                  # ทุกรูปใน docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
python docs/figures/render.py arch-01 --min-px 20             # เฉพาะรูปที่ระบุ · ตัวอักษรขั้นต่ำตามขนาดที่วาง (ข้อ 4)
python assets/render-figure.py figure.html figure.png 2       # ไฟล์เดียว (สไลด์ · ลองแนว)
```

- **script render อยู่ที่ `docs/figures/render.py` ข้างโฟลเดอร์ `src/`** — เป็นเครื่องมือของโปรเจกต์ที่ต้องใช้ทุกครั้งที่แก้รูป ห้ามเก็บไว้ใน `_to_delete/` หรือ scratchpad (ล้างโฟลเดอร์ชั่วคราวแล้วจะเหลือต้นฉบับที่ render ไม่ได้) · ห้ามลบ `docs/figures/src/` เพราะ .png เป็นแค่ผลลัพธ์
- แบบโฟลเดอร์ได้ 2 ฉบับต่อรูป (ฉบับเต็ม + ฉบับวางในเอกสาร `?embed=1` ตามข้อ 4) และตรวจข้อความให้: ตัวอักษรเล็กกว่า `--min-px` · ชื่อหรือป้ายตกบรรทัด · ข้อความล้นกล่องหรือผ้าใบ · ป้ายทับกัน → `problems: 0` และ exit 0 จึงผ่าน

ใช้ตัวคูณ **2** เสมอ เพราะตัวคูณ 1 ได้ภาพเบลอเมื่อเอาไปขยายในสไลด์

แล้วรันตัวตรวจเรขาคณิต ซึ่งจับเส้นเฉียง มุมที่ไม่ใช่มุมโค้ง ป้ายทับกัน และเส้นพาดผ่านตัวหนังสือ:

```bash
python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = ผ่าน
python scripts/check-figure-source.py docs/figures/src       # ทุกรูปเริ่มจากโครงของ skill นี้
```

จากนั้นเปิดไฟล์ภาพดูด้วยตา แล้วไล่ตามนี้:

- [ ] สายข้ามคอลัมน์มีหัวลูกศรครบทุกเส้นไหม · เส้นพาดทับกล่องหรือทับตัวหนังสือไหม
- [ ] ป้ายบนเส้นอ่านออกไหม และไม่ทับกันเองไหม
- [ ] ข้อความไทยครบไหม สระหรือวรรณยุกต์หายไหม มีคำไหนถูกตัดกลางคำไหม
- [ ] กล่อง `.focus` มีกล่องเดียวจริงไหม · หัวรูปมีครบ 6 อย่างไหม · โลโก้ขึ้นจริงไหม
- [ ] ย่อรูปลงเหลือความกว้าง 25% แล้วยังแยกออกไหมว่าอะไรอยู่ตรงไหน
- [ ] วัดตัวอักษรเล็กสุดใน HTML แล้วคิดเป็น pt ตามขนาดที่จะวางจริง (ข้อ 4) ได้ ≥ 7pt
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
- ❌ **เส้นเฉียงหรือมุมแหลม** — เส้นต้องตั้งหรือนอน หักด้วยมุมโค้ง (ข้อ 4 และ 7)
- ❌ **ไอคอนต่างสไตล์ปนกัน** — เส้นบางปนเส้นหนา ปนไอคอนทึบ
- ❌ **รูปจืด: การ์ดขาวเท่ากันทุกใบ เส้นบางเท่ากันทุกเส้น** — อ่านออกแต่ไม่มีจุดเด่น ทำตามข้อ 5.1

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

ใช้เมื่อเอกสารยังไม่มี `doc-theme` และยังไม่มีสีแบรนด์ ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากตารางนี้ไว้ในรายงานให้ผู้ใช้เลือกทีหลัง (ลำดับเต็มอยู่ใน `diagram-figures` ข้อ 5) ตารางนี้ใช้ร่วมกันทั้ง 2 engine ของ `diagram-figures` และทุก skill ที่วาดรูป

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |


## reference: design-system.md

# ระบบออกแบบของรูป — รายละเอียด

สารบัญ: หัวรูป → ระบบขนาด → ระบบสี → ไอคอนเส้นที่วาดเอง · ย้ายมาจาก `SKILL.md` ข้อ 3–6 (ไม่แก้ถ้อยคำ) · กฎสั้นอยู่ใน `SKILL.md`

## หัวรูป (จากข้อ 3)

โลโก้อยู่หน้าชื่อรูป โครงทุกตัวมีช่อง `<img class="logo">` ชี้ไปที่ `assets/logo/` ของโปรเจกต์อยู่แล้ว ให้แก้แค่ชื่อไฟล์ ถ้าโปรเจกต์ยังไม่มีโลโก้ ช่องนี้จะหายไปเอง แต่ต้องจดไว้ในรายงานว่ายังขาดโลโก้ เพราะรูปที่ไม่มีโลโก้ถูกถามเสมอว่า "โลโก้อยู่ไหน"

เหตุผลไม่ใช่ความสวย แต่เป็นเพราะรูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมล ในสไลด์ ในเอกสารสัญญา
แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ:

```
❌ ภาพรวมระบบ Dr Screening
✅ เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## ระบบขนาด (จากข้อ 4)

| อย่าง | ค่า |
|---|---|
| ตัวอักษร | ชื่อรูป 30 · ชื่อกล่อง 16 · คำอธิบาย 13.5 · ป้ายกลุ่ม 12 ตัวใหญ่ |
| ไอคอน | กรอบ 66px · มุม 18px · ไอคอน 29px · เส้น 1.6px |
| กล่อง | มุม 20px · ขอบ 1px เทาอ่อน · กล่องซ้อนใน มุม 16px พื้นเทาอ่อนมาก |
| กล่อง `.focus` | ขอบ 2px สี `--accent` เฉดเข้ม · มุม 22px |
| เส้นเชื่อม | แนวตั้งหรือแนวนอนเท่านั้น · หักมุมฉากด้วยมุมโค้งรัศมี 10px (SVG/Python engine ใช้ 12–14) · ห้ามเส้นเฉียง ห้ามเส้นโค้งอิสระ ห้ามมุมแหลม |
| ระยะ | 12 · 20 · 26 · 34 · 48 · ช่องว่างระหว่างคอลัมน์ 130 |

> **กรอบไอคอนต้องใหญ่** — 66px คือจุดที่รูปเริ่มดูตั้งใจ ไม่ใช่ผังที่ generate มา
> ถ้าต่ำกว่า 56px ไอคอนจะกลายเป็นจุดเล็ก ๆ ในกล่องใหญ่ และรูปจะดูโหวง

## ระบบสี (จากข้อ 5)

ในโครง HTML ให้แก้ที่ `--accent` ใน `:root` ที่เดียว แล้วเฉดอ่อนและเข้มจะคำนวณจากค่านั้น (ส่วน SVG/Python engine แก้ที่ `ACCENT` ใน `theme.py`)

**สีพื้นของรูปตามดีไซน์ของโปรเจกต์** — ต่อท้ายชื่อไฟล์ด้วย `#accent=<สีหลัก>&bg=<สีพื้น>` ให้ตรงกับเด็คหรือแอป พื้นเข้มหรือสว่างก็ได้ เทาทุกระดับคำนวณจากสีพื้น (ตอนนี้มีใน `figure-flow.html`) ถ้าไม่ใส่ `bg` ได้พื้นขาว

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

## ไอคอนเส้นที่วาดเอง (จากข้อ 6)

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน
รูปทรงต้องอ่านออกที่ขนาด 24px เพราะลายละเอียดเกิน 3 เส้นจะกลายเป็นก้อนดำ

## ฟอนต์ในรูปที่ฝังเด็ค (จากข้อ 8)

  รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก รูปจะได้ฟอนต์เดียวกับเนื้อความของเด็ค · เอกสาร Word ใช้ Tahoma ตาม `branded-document-design` ข้อ 2 รูปในนั้นต่างฟอนต์ได้
  ถ้าเครื่องไม่มีสักตัว จะตกไปใช้ฟอนต์ที่วางสระผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**


## reference: engine-mermaid.md

# Mermaid → รูปเส้นตั้งฉากมุมโค้ง

ทางที่ 3 ของ `diagram-figures` ใช้เมื่อเอกสารมีบล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) แล้วต้องส่งเป็นไฟล์ Word หรือ PDF ที่ดูออกแบบมา
ถ้าใช้ภาพที่ Mermaid วาดเอง เส้นจะโค้งอิสระและเฉียง สีจะไม่ตรงกับรูปที่วาดด้วยมือ ตัวนี้จึงอ่านบล็อกเดิมแล้ววาดใหม่ด้วยกติกาเดียวกับโครง HTML

## ได้อะไร

- เส้นตั้งหรือนอนเท่านั้น หักมุมด้วยมุมโค้ง (รัศมีอยู่ใน `theme.py`: `WIRE_R` 12 · กล่อง `BOX_R` 10)
- ป้ายบนเส้นเป็นป้ายขาวขอบอ่อน และมีตัวตรวจว่าป้ายไม่ทับกล่องหรือเส้น
- กล่องหลักกล่องเดียวเป็นการ์ดเข้มขอบไล่สี ตรงกับกล่อง `.focus`
- จัดวางด้วย ELK (`elkjs` แบบ layered + orthogonal) จึงไม่ต้องวางพิกัดเอง

## ใช้

1. คัดลอกโฟลเดอร์ `assets/mermaid-engine/` ไปไว้ที่ `docs/figures/src/gen/`
2. แก้ `figures.json`:
   - `prefix` คือรหัสโปรเจกต์ (`document-naming`)
   - `drafts` คือโฟลเดอร์ไฟล์ `.md` ที่มีบล็อก Mermaid
   - `skip` คือบล็อกที่มีรูปวาดมือแล้ว
   - `captions` ใช้แทนคำบรรยายที่สร้างจากหัวข้อ
3. แก้ `theme.py`: ให้ `ACCENT` และ `SECOND` ตรงกับ `doc-theme` ของโปรเจกต์ ส่วน `MEASURE_FONTS` ต้องชี้ไฟล์ฟอนต์จริงในเครื่อง
4. รัน `python build.py` จะได้ `docs/figures/<prefix>-<ไฟล์>-m<N>.png` และ `map.md` ที่บอกว่าบล็อกไหนกลายเป็นไฟล์ไหน
   - ถ้ายังไม่มี `elkjs` ตัว `elk.py` จะติดตั้งรุ่น 0.9.3 ลงโฟลเดอร์ `node_modules` ที่ตั้งไว้ให้เอง
5. ต้องดู output ทุกครั้ง:
   - บรรทัด `PROBLEM` คือเส้นเฉียง ป้ายทับ หรือบล็อกที่อ่านไม่ออก ห้ามส่งงานถ้ายังมีบรรทัดนี้
   - เปิดดูด้วยตาอย่างน้อย 1 รูปต่อชนิด

## ข้อจำกัด

- ใช้ได้ 4 ชนิด: `sequenceDiagram` · `stateDiagram-v2` · `erDiagram` · `gantt` ส่วน flowchart ให้วาดเป็นโครง HTML (ข้อ 2 ของ SKILL.md) เพราะ flowchart คือรูปที่คนอ่านมากที่สุด
- รูปกว้าง 1240px ตามหน้า A4 แนวตั้ง ถ้ารูปมีคนเกี่ยวข้องเกิน 7 คน ตัวหนังสือจะเล็ก ให้แยกรูป หรือวางรูปนั้นในหน้าแนวนอน


## reference: engine-svg-python.md

# SVG/Python engine — รูปที่ generate จากข้อมูลหรือโค้ด

ทางที่ 2 ของ `diagram-figures` ใช้แทนโครง HTML เมื่อรูปต้องสร้างจากข้อมูลหรือโค้ด เช่น รูปหลายใบที่ต้องออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือรูปที่ต้องคุมตำแหน่งทุกจุดเองบนกริดด้วยเส้นตั้งฉากมุมโค้ง
Python เขียน SVG ลงกริดแล้วเรนเดอร์เป็น PNG ส่วนไอคอนและโลโก้มาจากคลังเดียวกับโครง HTML ([icons.md](icons.md))

ข้อเสียคือใช้เวลา เพราะ 1 รูปต้องแก้หลายรอบ ดังนั้นให้ใช้เฉพาะรูปที่คนนอกทีมจะเห็นและเห็นซ้ำ

> **สีเริ่มต้น = ชุดประจำบ้าน** · ถ้า `doc-theme` ไม่ได้กำหนดสีเน้น (accent) เฉพาะงาน ให้ใช้ชุดใน `polished-document-style` ("ค่าตั้งต้นประจำบ้าน") ซึ่งเป็น brand `#2A78D6` ชุดเดียวกับสไลด์และเอกสาร

---

**สารบัญ**
- [0 · สีมาจากเนื้องาน — ไม่หยุดถาม](#0--สีมาจากเนื้องาน--ไม่หยุดถาม)
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

## 0 · สีมาจากเนื้องาน — ไม่หยุดถาม

**ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้นและอย่าถามซ้ำ**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร") ถ้ายังไม่มี ให้ทำตามข้างล่างนี้แล้วเขียนกลับลง `doc-theme`

**ไม่มีสีแบรนด์ → ทำตามลำดับใน `diagram-figures` ข้อ 5:** ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม
เสนอโทนจากเนื้องานตามตารางใน [colour-by-domain.md](colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

ใส่**สีหลักสีเดียว**ที่ `ACCENT` ใน `assets/svg-engine/theme.py` แล้วเฉดอ่อนและเข้มทั้งหมด
จะคำนวณจากสีนั้นด้วย `tint()` โค้ดวาดรูปจึงไม่มีสีอื่นฝังอยู่

สีเดียวที่ไม่ผูกกับ `ACCENT` คือ `EXCEPT_HUE` สำหรับป้าย "ข้อยกเว้น" ซึ่งต้องต่างจากสีหลักเสมอ
ถ้าสีหลักเป็นส้มอยู่แล้ว ให้เปลี่ยน `EXCEPT_HUE` เป็นสีอื่นที่ตัดกัน

---

## 1 · ลำดับการทำงาน

1. อ่านไดอะแกรมที่มีอยู่ทั้งหมดก่อน แล้วถามว่า**รูปนี้ตอบคำถามอะไร** — 1 รูปตอบ 1 คำถาม
2. เลือกสีตามข้อ 0 (ไม่มีสี → ค่าประจำบ้าน + `(รอยืนยัน)`)
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


## reference: layout-flow.md

# โครง `figure-flow.html` — ข้อมูลไหลผ่านอะไร ตามลำดับไหน

ตอบคำถาม "ข้อความ 1 ชิ้น (คำขอ · งาน · เอกสาร) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" ไฟล์โครงอยู่ที่ [`assets/figure-flow.html`](../assets/figure-flow.html) · ตัวอย่างที่เรนเดอร์แล้ว [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ หัวรูป ──────────────────────────────────── ①–⑥ ความหมายเลขลำดับ ┐
│ ┌ผู้ใช้┐   ┌ช่องทาง┐    ┌ เครื่องที่รัน (เทา) ─────────┐   ┌ บริการภายนอก ┐ │
│ │ คน  │①→│ เว็บ   │②→ │ ┌ ระบบ .focus (สีหลัก) ┐ │③→ │ AI · API     │ │
│ │ คน  │①→│ LINE  │②→ │ │ ชั้น · หน้าที่         │ │   └─────────────┘ │
│ │ คน  │ →│ หลังบ้าน│ → │ │ ชั้น · หน้าที่         │ │④→ ┌ ข้อมูล ──────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ ไฟล์ · DB    │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ เชิงอรรถ: ความหมายพื้นสีอ่อน · เส้นประ · ตัวย่อทั้งหมด ───────────────┤
```

## สี — มาจากสีหลักของโปรเจกต์ตัวเดียว

- แก้ `--accent` ใน `:root` ที่เดียว แล้วเฉดเข้ม พื้นอ่อน และสีตัวหนังสือบนพื้นสีหลักคำนวณให้เอง (สีสว่างเช่นเหลือง สคริปต์จะสลับตัวหนังสือเป็นสีเข้มให้อ่านออก)
- หาสีหลักตามลำดับใน SKILL.md ข้อ 5 · ลองสีอื่นโดยไม่แก้ไฟล์: เปิด `figure-flow.html#accent=0F8B8D`
- **สีหลักใช้กับ 4 อย่างเท่านั้น:** ขอบกล่อง `.focus` · ป้ายชื่อระบบ · เส้นทางข้อมูลกับเลขลำดับ · ชื่อโปรเจกต์ในหัวรูป
- โครงที่เหลือเป็นเทากลาง — กลุ่มเส้นประ กล่องเครื่องที่รัน การ์ด ส่วนไอคอนใช้ 7 สีความหมายเดิม (ข้อ 5)

## กติกา

- **ทิศเดียว ซ้าย → ขวา**: ผู้ใช้ → ช่องทาง → ระบบ → ของที่ระบบเรียกใช้ ถ้ามีเส้นย้อนกลับ ให้บอกในคำอธิบายชั้น (เช่น "push คำตอบกลับ LINE") แทนการลากเส้นย้อน
- **เลขลำดับ = เส้นทางของ 1 ข้อความ** ไม่ใช่เลขเส้น เส้นที่เกิดพร้อมกันใช้เลขเดียวกัน (สองช่องทางเข้า = ② ทั้งคู่) · เส้นทางแยกที่ไม่ได้เกิดทุกครั้ง (เช่นอ่านภาพ) ไม่ต้องมีเลข
- **ชั้นในกล่องระบบ 5–9 ชั้น** เรียงตามลำดับที่ข้อความผ่าน · ชื่อชั้นสั้น หน้าที่ 1–2 บรรทัด ถ้าเกิน 9 ชั้น แยกเป็นรูปข้างในระบบอีกรูป
- **ชั้นเน้น `.guard` ไม่เกิน 2 ชั้น** และเขียนความหมายไว้ที่เชิงอรรถ
- **เส้นต่อเข้าชั้นที่ทำงานนั้นจริง** ไม่ใช่ขอบกล่องใหญ่ — เส้นวาดอยู่บนกล่อง หัวลูกศรจึงถึงชั้นข้างใน
- **เส้นที่ใช้ช่องว่างเดียวกันต้องไม่ตัดกัน** — เลื่อนช่วงหักด้วย `mx` (เส้นที่ปลายอยู่สูงกว่าให้ `mx` น้อยกว่า) แล้วเรนเดอร์ดูทุกครั้ง
- ป้ายบนเส้นเป็นคำสั้น 1–3 คำบอกว่าอะไรไหลผ่าน (`HTTPS` · `webhook` · `ถาม LLM`) · ต้นเส้นมีเลขลำดับ ให้ใช้ `lp:"start"` เมื่อช่วงท้ายสั้นเกิน


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
| เส้นหักมุมใน `figure-flow.html` ตัดกันเอง | หลายเส้นใช้ช่องว่างเดียวกัน — ตั้ง `mx` ให้เส้นที่ปลายอยู่สูงกว่ามีค่าน้อยกว่า แล้วเรนเดอร์ดูใหม่ |
| ลูกศรหายเข้าไปใต้กล่องระบบ | ชั้น `.wires` ไม่มี `z-index` — โครง flow ตั้งไว้แล้ว ถ้าก๊อปไปใช้โครงอื่นต้องตั้งตาม |
| รูปออกมาเป็นสีของรูปตัวอย่าง | ลืมแก้ `--accent` — หาสีหลักของโปรเจกต์ตาม SKILL.md ข้อ 5 ก่อนเรนเดอร์ |
| เส้นพาดทะแยงทับทั้งรูป | ต่อเส้นจากกล่องข้างในกล่องขอบเขต — ต่อจากขอบของกล่องขอบเขตแทน |


## reference: wires.md

# สายเชื่อม — รายละเอียด

ย้ายมาจาก `SKILL.md` ข้อ 7 (ไม่แก้ถ้อยคำ) · เปิดเมื่อเขียน `WIRES` หรือแก้เส้นที่ลากผิด

**ในคอลัมน์เดียวกัน** ให้ใช้ลูกศรลง `.down` ระหว่างกล่อง โดยไม่ต้องเขียนอะไรเพิ่ม

**ข้ามคอลัมน์** ให้ใช้รายการ `WIRES` ท้ายไฟล์ แล้วสคริปต์จะลากเส้นให้หลังจัดหน้าเสร็จ:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^id ต้นทาง   ^ด้านออก  ^id ปลายทาง  ^ด้านเข้า ^ตำแหน่งบนขอบ 0=บน 1=ล่าง
```

ที่ต้องคำนวณหลังจัดหน้า เพราะตำแหน่งกล่องขึ้นกับความยาวข้อความไทย
ถ้าเขียนพิกัดตายตัวไว้ พอแก้ข้อความทีเดียวเส้นจะหลุดทั้งรูป

**กติกา:**

- **เส้นวิ่งแนวตั้งหรือแนวนอนเท่านั้น และหักมุมด้วยมุมโค้ง** — ฟังก์ชัน `elbow()` ในโครงทำให้เอง (นอน → ตั้ง → นอน) ใช้ `mx` เลื่อนช่วงหักเมื่อหลายเส้นใช้ช่องเดียวกัน อย่าเขียน `path` เป็นเส้นตรงจากจุดถึงจุด เพราะกล่องสองข้างสูงไม่เท่ากันแล้วเส้นจะเฉียง
- **ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์** ไม่อย่างนั้นป้ายจะทับกล่องหรือบังเส้นจนหาย ถ้าป้ายยาวขึ้น ต้องเพิ่ม `gap` ของ `.stage` ตามไปด้วย
- เลื่อนป้ายไปตามเส้นได้ด้วย `lp` (0 = ต้นทาง · 1 = ปลายทาง · ไม่ใส่ = กลางเส้น)
- เส้นที่ยังไม่ได้เชื่อมจริง ให้ใช้ `planned:true` เพื่อได้เส้นประ แล้ว**เขียนความหมายไว้ที่เชิงอรรถ**
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป เพราะเกินนี้รูปจะกลายเป็นใยแมงมุม
- ต่อเข้า**กล่องเล็กที่สุดที่ถูกต้อง** ไม่ใช่กล่องใหญ่ที่ครอบอยู่ ถ้ากล่องสูงมาก ให้ใส่ `tp` เพื่อเลี่ยงไม่ให้เส้นจ่อกลางกล่อง
- ป้ายบนเส้นบอกว่า**อะไรไหลผ่าน** เช่น `HTTPS 443` ไม่ใช่ `เชื่อมต่อ` ส่วนเส้นที่ไม่มีอะไรจะบอก ไม่ต้องใส่ป้ายเลยดีกว่าใส่คำว่า "ใช้"
