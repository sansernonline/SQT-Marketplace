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
