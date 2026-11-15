# skill: web-app-design

Use when designing a web app screen or mockup

# Web App Design

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **กฎข้อเดียว:** สีทุกสีในโค้ดคอมโพเนนต์ต้องมาจาก token
> ถ้า `#hex` โผล่นอกไฟล์ token แปลว่าระบบดีไซน์เริ่มพังแล้ว และพังแบบเงียบ ๆ

## เมื่อไหร่ใช้ skill นี้

- ทำหน้าจอเว็บแอป: แดชบอร์ด, admin panel, เครื่องมือภายใน, SaaS
- ต้องการให้ทุกหน้าที่คนละคนทำออกมาหน้าตาเป็นชุดเดียวกัน
- ต้องรองรับหลายแบรนด์/หลายธีมโดยไม่แตะโค้ดคอมโพเนนต์
- ใช้ได้กับ Angular / React / Vue / Svelte / HTML เปล่า — CSS ล้วน ไม่ผูกเฟรมเวิร์ก

## เมื่อไหร่ **ไม่** ใช้

- แอปเดสก์ท็อป Windows ให้ใช้ `windows-app-design`
- เอกสาร .docx/.pptx ให้ใช้ `branded-document-design`
- เว็บไซต์การตลาด/landing page เพราะระบบนี้ออกแบบมาสำหรับ **แอป** ที่ต้องอัดข้อมูล
  ตัวหนังสือฐาน 13px จึงเล็กเกินไปสำหรับหน้าขาย

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ

> **โปรเจกต์มีหน้าจออยู่แล้ว → ลอกหน้าเดิมตาม `ui-craft` ข้อ 0 ไม่ใช้ appstrack** (ยกเว้นสั่งออกแบบใหม่ หรือหน้าเดิมยังไม่ผ่านด่านสวย) · ลำดับด้านล่างสำหรับโปรเจกต์ที่ยังไม่มีหน้าตาเลย หรือกำลังออกแบบใหม่ · appstrack ให้แค่คลาสคอมโพเนนต์และค่าสำรอง หน้าตาของงานมาจาก `theme.css` ที่ได้จากการค้น

```
0. ทิศทางภาพตาม ui-craft ข้อ 0.1 (ค้นต้นแบบตาม design-references ประเภท web หรือ dashboard แล้วถอดสี · หน้าจอพระเอก · แอปอ้างอิง · 3 แนว · เลือก 1 · โลโก้) → คัดลอก assets/theme-template.css เป็น mockup/theme.css แล้วเติมค่าทั้ง 4 กลุ่มในข้อ 2 จากแนวที่เลือก พร้อมที่มาทุกค่า
   หน้าที่มีรูป (hero · สินค้า · บริการ · ทีม) → `graphic-design:image-artist` หารูปตาม image-generation ลง public/images/ ก่อนขั้น 2 · ไม่วาดรูปทรงพื้นฐานแทนของจริงเอง
1. คัดลอก assets/mockup-template.html + assets/appstrack.css ไปไว้คู่กับ theme.css (หน้าตาค่าสำรอง: assets/mockup-template-preview.webp · ไม่ใช่เป้าหมาย)
   โครงหน้า (sidebar · แถบบน · แบ่ง 2 ฝั่ง · หน้าเดียวไม่มีเมนู) เลือกจากต้นแบบที่ค้นและจำนวนเมนูของแอป ไม่ยึดโครงในแม่แบบ
2. แก้เนื้อหาเป็นหน้าจริงที่จะทำ (ยังไม่แตะโค้ดแอป)
3. python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 1440
   python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 900
   python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 420
4. เปิดภาพดูจริงทุกความกว้าง แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นคอมโพเนนต์ — copy คลาสเดิม ไม่เขียน CSS ใหม่
6. ต่อ scripts/check-design-tokens.mjs เข้า CI ตั้งแต่วันแรก
```

**mockup ส่งมอบเป็นไฟล์เดียว** (`mockup/<รหัส>-mockup.html` ทุกหน้าจอเป็น section) → ฝังเนื้อ `appstrack.css` แล้วตามด้วย `theme.css` ลงใน `<style>` แทน `<link>` ก่อนส่ง · ตรวจ token ด้วยไฟล์ mockup เป็นไฟล์ token เอง: `node scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html`

ข้อ 6 สำคัญกว่าที่คิด เพราะระบบดีไซน์ที่ไม่มีตัวตรวจบังคับจะค่อย ๆ เพี้ยนจาก
"ขอ hardcode แค่ครั้งเดียว" ภายใน 3 สัปดาห์ และไม่มีใครรู้ตัวจนเปลี่ยนธีมแล้วพัง

---

## 2 · Design tokens

> **หน้าตามาจากการค้นของงานนี้ — ไม่หยุดถาม**
> ลำดับหาค่า: สีแบรนด์และฟอนต์ของลูกค้า (มีแล้วใช้เลย) → ต้นแบบที่ค้นสดตาม `design-references` และพาเลตที่ถอดด้วย `design-direction-lookup` ข้อ 2 → ค้นไม่ได้เลย (ไม่มีเน็ต · ผู้ใช้สั่งใช้ของเดิม) จึงใช้ค่าสำรองใน `assets/appstrack.css` เขียน `(รอยืนยัน)` แล้วทำต่อ
> ตารางเนื้องานกับโทนสีใน `colour-by-domain` (`diagram-figures` → `references/colour-by-domain.md`) เป็นจุดตั้งต้นของคำค้น ไม่ใช่คำตอบ
> **สีแบรนด์ต้องผ่าน 4.5:1 ทั้งตัวขาวบนพื้นแบรนด์ และสีแบรนด์บนพื้นหน้า** — สีลูกค้าที่สว่างเกิน ให้ทำเฉดเข้มขึ้นสำหรับ `--brand` แล้วเก็บสีเดิมไว้ที่โลโก้และกราฟ

**ค่าไหนตายตัว ค่าไหนมาจากการค้น**

| กลุ่ม | token | มาจาก | ค่าสำรอง (appstrack) |
|---|---|---|---|
| สี | `--brand` `--brand-2` `--brand-50` `--brand-100` · พื้นและข้อความเมื่อแนวที่เลือกต้องการ | แบรนด์ลูกค้า → พาเลตที่ถอดจากต้นแบบ | `#226CC6` (เฉดเข้มของ `#2A78D6`) |
| ตัวอักษร | `--font` · `--fs-xs` … `--fs-xl` | ฟอนต์แบรนด์ → คู่ฟอนต์ไทย-ละตินที่ต้นแบบในวงการใช้ · ขนาดฐานตามความแน่นของงาน (อัดข้อมูล 13 · อ่านเยอะ 14–15) | Inter + Noto Sans Thai · 11/12/13/15/22 |
| รูปทรง | `--radius` `--radius-sm` `--radius-pill` · `--shadow` `--shadow-lg` | แนวที่เลือก (เหลี่ยมเรียบ · มนนุ่ม · การ์ดลอย) | 14 · 9 · 99 · การ์ดไม่มีเงา |
| เลย์เอาต์ | `--sidebar-w` `--topbar-h` `--content-max` | จำนวนเมนู ชื่อเมนูยาวแค่ไหน งานหลักต้องการพื้นที่กว้างไหม | 232 · 56 · 1160 |
| **ตายตัวทุกงาน** | ใช้ token เท่านั้น · คอนทราสต์ ≥ 4.5:1 · สีสถานะตามความหมาย · กรอบแอปสีกลาง · ปุ่มหลัก 1 ปุ่มต่อหน้า · กฎภาษาไทยข้อ 5 | กฎของระบบ ไม่ขึ้นกับงาน | — |

ค่าของงานอยู่ใน `theme.css` ไฟล์เดียว (แม่แบบ `assets/theme-template.css`) · ทุกบรรทัดมีคอมเมนต์ที่มา · `appstrack.css` ไม่แก้ เพื่อให้คลาสคอมโพเนนต์อัปเดตตาม skill ได้

96 token อยู่ในบล็อก `:root` ของ `assets/appstrack.css` ส่วนรายละเอียดครบอยู่ใน **`references/tokens.md`**

**เปลี่ยนสีแบรนด์ทั้งแอป = แก้ 4 ค่า** (`--brand --brand-2 --brand-50 --brand-100`)
สีที่เหลือคำนวณหรืออ้างอิงจาก 4 ค่านี้ ถ้าต้องแก้สีค่าที่ 5 แปลว่ามีที่ไหน hardcode อยู่

`assets/appstrack.css` มีชุดสีตัวอย่างมาให้ 5 ชุด (ocean · emerald · sunset · plum · graphite)
สลับด้วย `body[data-theme]` และ sidebar สว่าง/เข้มด้วย `body[data-side='dark']` (เข้ม = เทาเข้มกลาง ไม่ย้อมสีแบรนด์)
**ชุดพวกนี้มีไว้ทดสอบว่าระบบเปลี่ยนสีได้จริง ไม่ใช่ตัวเลือกให้หยิบใช้** — สีของงานมาจาก `theme.css` เสมอ

**สีสถานะ (สำเร็จ · เตือน · ผิดพลาด) ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่าน เสมอ

**กรอบแอปเป็นสีกลาง** (ตามความชอบของเจ้าของ และ `ui-craft` ด่านสวย หมายเหตุแพลตฟอร์ม) — sidebar · topbar · เส้นขอบ · ไอคอนเมนู เป็นเทา-ดำ · สีแบรนด์อยู่ที่ข้อมูล ปุ่มหลัก ลิงก์ ขีดเลือกเมนู 3px และโลโก้ · ย้อมกรอบได้เฉพาะเมื่อผู้ใช้สั่ง

---

## 3 · โครงหน้าจอ

ผังข้างล่างคือโครงสำรองแบบ sidebar + แถบบน · แอปที่เมนูน้อย (≤ 5) หรือเป็นงานหน้าเดียว ให้เลือกโครงจากต้นแบบที่ค้น เช่น แถบบนอย่างเดียว หรือแบ่ง 2 ฝั่ง · ขนาดในผังเป็นค่าสำรอง ค่าจริงอยู่ใน `theme.css`

```
┌──────────┬─────────────────────────────────────────────────┐
│ 232px    │ topbar 56px · พื้นทึบ · sticky                   │
│ sidebar  ├─────────────────────────────────────────────────┤
│          │  ชื่อหน้า h1 22px          [ปุ่มรอง] [ปุ่มหลัก]   │
│ • เมนู   │  คำอธิบาย 12px สีรอง                             │
│ • เมนู   │                                                 │
│          │  ┌─ stat-grid: การ์ดตัวเลข auto-fit 190px ─────┐ │
│  ─────   │  └─────────────────────────────────────────────┘ │
│ กลุ่มที่2 │  ┌─ card ────────────────┐ ┌─ card ──────────┐  │
│ • เมนู   │  │ ตาราง / ฟอร์ม          │ │ กิจกรรม / สรุป  │  │
│          │  └───────────────────────┘ └─────────────────┘  │
│ ⚙ ตั้งค่า │             ← เนื้อหากว้างสุด 1160px จัดกลาง →     │
└──────────┴─────────────────────────────────────────────────┘
```

- **เมนูตั้งค่าอยู่ล่างสุดของ sidebar** (`.foot` มี `margin-top:auto`)
- **หน้าละ 1 h1** และมีคำอธิบายใต้ h1 เสมอ — หน้าที่ไม่บอกว่าตัวเองทำอะไร = หน้าที่ยังไม่เสร็จ
- **ปุ่มหลัก 1 ปุ่มต่อหน้า** (`.btn-primary` สีแบรนด์ทึบ ไม่มี gradient ไม่มีเงา) ที่เหลือเป็น `.btn` หรือ `.btn-ghost`
- **KPI 3–5 ใบ** ถ้าเกินนั้นตัวเลขจะเล็กจนไม่เด่น
- ตัวเลขทุกตัวที่เรียงเป็นคอลัมน์ต้องมีคลาส `.num` ไม่งั้นหลักไม่ตรง

---

## 4 · คอมโพเนนต์ที่มีให้แล้ว

โครง `.app-shell/.app-sidebar/.app-topbar/.app-main` · การ์ด `.card/.card-head/.card-body` ·
KPI `.stat-grid > .card.stat` · สถานะ `.pill-*` 7 โทน · ปุ่ม 4 แบบ ·
ฟอร์ม `.field/.input/.select/.textarea` · ตาราง `.tb-wrap > .tb` ·
ตัวกรอง `.chips/.tabs` · `.prog` · `.ava` · `.md-html` · `.empty` · `.skeleton` · `.spinner` ·
`.toasts/.toast` · `.backdrop + .modal` · ยูทิลิตี `.row/.col/.grow/.ellipsis/.num`

รายการเต็มพร้อมคำอธิบายอยู่ท้าย `references/tokens.md`

**ไอคอน:** inline SVG stroke 2 ขนาด 15px ใน sidebar / 14px ในปุ่ม / 11px ใน pill
ใช้ `stroke="currentColor"` เสมอ แล้วไอคอนจะเปลี่ยนสีตาม state ให้เอง

---

## 5 · ภาษาไทย

- `--font` ต้องมีฟอนต์ที่มีอักษรไทยในชุดเสมอ (ค่าสำรอง `Inter` ไม่มีไทย จึงต่อ `Noto Sans Thai`) · ฟอนต์ที่เลือกจากการค้นต้องเปิดดูกับข้อความไทยจริงก่อนใช้
- ระยะบรรทัด 1.6 (เนื้อความ) / 1.85 (`.md-html`) — ไทยต้องการมากกว่าอังกฤษ
- **ห้าม justify** · **ห้าม `text-transform: uppercase` กับข้อความไทย** (ไม่มีผล แต่
  `letter-spacing` ที่มากับมันจะดันวรรณยุกต์เพี้ยน) — หัวตารางที่เป็นไทยให้เอา uppercase ออก
- ปุ่มไทยกว้างกว่าอังกฤษ ~20% อย่า fix ความกว้างปุ่ม
- ทดสอบด้วยข้อความไทยจริง ไม่ใช่ Lorem ipsum

---

## 6 · ตรวจงาน

```bash
# 1. ระบบดีไซน์ยังสะอาดอยู่ไหม
node scripts/check-design-tokens.mjs src/styles.css src/app

# 2. หน้าตายังถูกทุกความกว้างไหม
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 1440
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 900
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 420
```

แล้วเปิดภาพดูจริง ตรวจ:

- [ ] ไม่มีสี hardcode (ตัวตรวจต้องขึ้น ✓)
- [ ] ที่ 1024px sidebar หดเหลือไอคอน ส่วนที่ 720px กลายเป็น drawer และมีปุ่มเปิด
- [ ] ตารางกว้างเกินจอเลื่อนเฉพาะในกรอบ **ไม่ใช่ทั้งหน้า** (ลากดูแนวนอนแล้ว sidebar ต้องไม่ขยับ)
- [ ] ธีมของงาน (`theme.css`) + sidebar สว่าง/เข้ม ไม่มีข้อความกลืนพื้น · ทุกค่าใน `theme.css` มีคอมเมนต์ที่มา
- [ ] ข้อความไทยไม่ล้นปุ่ม · วรรณยุกต์ไม่ชนสระ
- [ ] คอนทราสต์ ≥ 4.5:1 ทุกคู่ข้อความกับพื้น รวมตัวขาวบน `--brand` (`--text-faint` บน `--bg` คือจุดที่เฉียดที่สุด 4.65 — ห้ามทำให้จางกว่านี้ · สีแบรนด์ใหม่ต้องวัดก่อนใช้)
- [ ] เดินด้วย Tab ได้ครบและเห็นวงแหวนโฟกัสทุกจุด
- [ ] มี empty state ทุกที่ที่รายการอาจว่าง (`.empty`) และ loading ทุกที่ที่ต้องรอ: เนื้อหาใช้โครงร่าง `.skeleton` ในรูปทรงของจริง · `.spinner` ใช้เฉพาะรอสั้น ๆ ในปุ่มหรือข้างข้อความ ไม่วางกลางจอ

---

## 7 · Anti-patterns

- **`#hex` ในไฟล์คอมโพเนนต์** — ต้นเหตุอันดับ 1 ของธีมพัง ให้ตัวตรวจจับไว้
- **gradient บนปุ่ม chip หรือกราฟ · topbar กระจกฝ้า** — สัญญาณ AI ใน `no-ai-look` และค่าสีบนกราฟต้องคงที่ ใช้ `--brand` และ `--c-*` ทึบ
- **ย้อมสีแบรนด์ที่ sidebar topbar หรือเส้นขอบ** — กรอบแอปเป็นสีกลาง (ข้อ 2)
- **เงาใต้การ์ด** — การ์ดนิ่งไม่ได้ลอย แยกด้วยเส้นและพื้นต่างเฉด · `--shadow` สำหรับ dropdown/tooltip · `--shadow-lg` สำหรับ modal/toast เท่านั้น
- **ปุ่มหลักหลายปุ่มในหน้าเดียว** — ผู้ใช้ไม่รู้ว่าต้องกดอะไร
- **`overflow-x` ที่ `<body>`** เพื่อแก้ตารางล้น — ต้องแก้ที่ `.tb-wrap`
- **`alert()` / `confirm()`** — ใช้ `.toast` และ `.modal`
- **สร้างขนาดตัวอักษรใหม่** นอก `--fs-*` ของงาน (`ui-craft` ข้อ 2 · เล็กสุด 11 · ≤ 5 ขนาดต่อหน้าจอ)
- **ส่ง mockup หน้าตาค่าสำรองโดยไม่ได้ค้น** — ทุกงานหน้าตาเหมือน Apps Track · ใช้ค่าสำรองได้เฉพาะเมื่อค้นไม่ได้ และต้องเขียน `(รอยืนยัน)`
- **`.modal` ที่ไม่ตั้ง `position`** — จะจมอยู่ใต้ `.backdrop` แล้วคลิกอะไรไม่ได้เลย
  (มีคอมเมนต์อธิบายไว้ใน CSS แล้ว อย่าลบ)
- **ส่ง mockup โดยไม่เคยเรนเดอร์ดู**

---

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / IA ก่อนลงสี | agent `ux-designer` |
| แอปเดสก์ท็อป Windows โทนเดียวกัน | `windows-app-design` |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| ไดอะแกรมประกอบ spec | `markdown-visuals` |
| กฎระยะห่าง ลำดับสายตา และ 5 สถานะของหน้าจอ | `ui-craft` |
| ไดอะแกรมสถาปัตยกรรม | `software-diagrams` |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: tokens.md

# Token reference — Apps Track-style web app design system

> Warning: **the color values in this file are a finished example, not a standard.**
> Always pick colors from the work itself first (see the item "colors come from the work" in `SKILL.md`).
> What to take from this file is **the list of tokens and their roles**, not the values.
> Colors, fonts, type sizes, radii, shadows and layout widths are fallbacks. The project's values live in `theme.css` (`SKILL.md` item 2) · spacing and breakpoints follow this file.

All definitions are in `assets/appstrack.css`, in the `:root` block.
**Nothing below the `=== base ===` line may contain a raw color**, because the checker uses that line as the boundary.

## Contents

1. [Brand — solid color](#brand--solid-color)
2. [Surfaces · lines · shadows](#surfaces--lines--shadows)
3. [Typography](#typography)
4. [Data colors (charts) — always solid](#data-colors-charts--always-solid)
5. [Pill (status) — three values as a set](#pill-status--three-values-as-a-set)
6. [Layout](#layout)
7. [Switching theme / brand](#switching-theme--brand)
8. [Ready-made component classes](#ready-made-component-classes)

---

## Brand — solid color

| Token | Value | Used for |
|---|---|---|
| `--brand` | `#226cc6` (a darker shade of the house default `#2A78D6`) | primary button · selected chip · progress bar · link · selected tab · menu selection bar · border on focus · logo |
| `--brand-2` | `#6a5cd6` | 2nd data color paired with `--brand` (charts) |
| `--brand-50` | `#eef4fd` | avatar · mention background · focus ring |
| `--brand-100` | `#dde9fb` | spinner track |

> **No gradient** — buttons, chips, progress and charts use solid `--brand` (`no-ai-look`: purple-blue gradient → 1 solid brand color)
> **`--brand` must pass 4.5:1** for white text on a brand background (`#226cc6` = 5.21) · brand on `--bg` (4.87) · brand on `--brand-50` (4.71) — checked 22 Oct 2026

## Surfaces · lines · shadows

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#f6f7fb` | page background |
| `--surface` | `#ffffff` | cards · inputs · normal buttons |
| `--line` | `#eef0f5` | lines inside cards · table lines |
| `--line-strong` | `#e4e7ee` | input border · button border |
| `--skeleton` | `#e4e7ee` | loading placeholder (`.skeleton`) |
| `--shadow` | thin 2-layer shadow | dropdown · tooltip (small floating things) |
| `--shadow-lg` | deep 2-layer shadow | modal · toast · floating menu |
| `--radius` / `--radius-sm` / `--radius-pill` | `14px` / `9px` / `99px` | card / button·input / pill·chip |
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | things that appear (dropdown · toast · modal) — shoots fast then settles (expo-out) |
| `--ease-io` | `cubic-bezier(.65, 0, .35, 1)` | things that move (sliding a panel · switching tabs) · durations follow `ui-craft` item 7 |

> **Cards have no shadow** — a still card does not float; it is separated from the page by the `--line` border + `--surface` fill on `--bg` (`ui-craft` item 4) · the topbar is a solid `--surface` fill, no frosted glass

**2-part shadow from one color:** `--shadow` and `--shadow-lg` above are already 2-layer shadows in the color `rgba(20, 30, 55)` · for a project whose background is not blue-gray (cream, green, dark theme) or that needs 3 levels, add this set to the project's `:root` (not yet in `appstrack.css`).

| Token | Value | Used for |
|---|---|---|
| `--shadow-color` | `223 47% 15%` (the HSL channels of `rgba(20, 30, 55)`) | the color of every shadow layer · change the hue to match the background; do not use translucent black |
| `--elev-1` | `0 1px 2px hsl(var(--shadow-color) / .12), 0 2px 6px hsl(var(--shadow-color) / .06)` | small raised pieces: a table header that sticks to the top while scrolling · a switch knob |
| `--elev-2` | `0 1px 3px hsl(var(--shadow-color) / .14), 0 8px 20px hsl(var(--shadow-color) / .08)` | dropdown · tooltip (replaces `--shadow`) |
| `--elev-3` | `0 2px 4px hsl(var(--shadow-color) / .12), 0 18px 40px hsl(var(--shadow-color) / .12)` | modal · toast (replaces `--shadow-lg`) |

The first layer is narrow and darker (under the piece, where light cannot reach); the second is wide and faint (ambient light) · at higher levels the wide layer is offset further down in the same direction · a still card still has no shadow · for layered shadows, translucent edges and other depth language → `ui-craft` → `references/depth-and-flourish.md`

**Nested corners:** inner radius = outer radius − the distance from the outer edge to the inner item (padding), so the 2 curves are parallel, e.g. a `--radius` 14 card with an image 6 from the edge → the image radius is 8 · if the result is 0 or negative (padding ≥ outer radius) → use `--radius-sm`, because the 2 corners are so far apart the eye no longer compares them · source: vercel-labs/web-interface-guidelines, section nested radii (MIT · checked 2026-10-23)

## Typography

| Token | Value | Used for |
|---|---|---|
| `--text` | `#333b4a` | headings · main metric numbers (Key Performance Indicator · KPI) |
| `--text-body` | `#414957` | body text (the default for body) |
| `--text-muted` | `#5f6673` | labels · descriptions · table headers · empty state · inactive menu |
| `--text-faint` | `#69707d` | timestamps · menu group headings · supporting text |

Contrast (Web Content Accessibility Guidelines (WCAG) 2.2 level AA needs ≥ 4.5:1 · checked 22 Oct 2026): `--text-muted` on white 5.78 · on `--bg` 5.40 · `--text-faint` on white 4.98 · on `--bg` 4.65 ← the lowest in the system; never make it fainter

A 5-size scale, matching `ui-craft` item 2 (lg 22 · md 15 · base 13 · sm 12 · xs 11 · smallest 11):

| Level | Size | |
|---|---|---|
| h1 · KPI number | 22px / 500 · KPI 600 | page title · KPI uses `letter-spacing:-.4px` + `tabular-nums` |
| h2 | 15px / 500 | card heading · app name in the sidebar |
| body · h3 | 13px / 1.6 · h3 bold 500 | body text · input · tab · menu · sub-heading |
| button · description under h1 | 12px | |
| label · pill · table header · faint | 11px | table headers are uppercase with letter-spacing .4px (English only) |

The default font is `Inter` + `Noto Sans Thai` — Inter is chosen because it reads easily at 11–13px in dense data screens (`graphic-design` item 6 says to give a reason when using a widely used font) · a project with a brand font uses the project's · **Inter has no Thai letters**; if you forget to add Noto Sans Thai
the browser uses a system font as fallback, whose height does not match, and Thai looks smaller and shorter than English.

Every number laid out in a column must use `.num` (`tabular-nums`), otherwise the digits will not line up.

## Data colors (charts) — always solid

`--c-blue #4a8ee0` · `--c-teal #2bbd8a` · `--c-amber #f0ad2e` · `--c-green #1f9d3f` ·
`--c-violet #6a5cc9` · `--c-red #e87f7c` · `--c-grey #c8ced9`
Plan/actual pair: `--c-plan #e0eaf8` vs `--c-actual #5a97e0` · overdue is defined as `--c-late #e58079`

## Pill (status) — three values as a set

| Tone | Background | Text | Line | Used for |
|---|---|---|---|---|
| green | `#e9f7ef` | `#17794a` | `#d6efe1` | done · normal |
| blue | `#eaf2fd` | `#2160ab` | `#d8e7fb` | review · in progress |
| amber | `#fdf5e4` | `#96660d` | `#f7e9c9` | waiting · warning |
| orange | `#fdefe6` | `#a2541b` | `#f8ddcb` | nearly overdue |
| red | `#fdedec` | `#a63a34` | `#f8d9d7` | stuck · error |
| violet | `#f1eefc` | `#52439f` | `#e3ddf8` | special type |
| grey | `#f2f4f8` | `#626a7a` | `#e7eaf1` | closed · not started |

## Layout

| Token | Value |
|---|---|
| `--sidebar-w` | `232px` (≤1024px shrinks to 64px · ≤720px becomes a 240px drawer) |
| `--topbar-h` | `56px` |
| `--content-max` | `1160px` |

Breakpoints: **1024px** the sidebar shrinks to icons · **720px** the sidebar becomes a drawer (`body.nav-open`)
If a table is wider than the screen, scroll horizontally **only inside `.tb-wrap`**; never let the whole page scroll.

## Switching theme / brand

**Switch the accent across the whole app** — `body[data-theme]`: empty (ocean `#226cc6`) · `emerald #097a54` · `sunset #b8501a` · `plum #7a4ee8` · `graphite #0a7a90`
Each theme changes only 4 tokens (`--brand --brand-2 --brand-50 --brand-100`) · every `--brand` passes 4.5:1 with white text · `--bg` · the theme's own `--brand-50`

**Light/dark sidebar** — `body[data-side='dark']` changes 9 sidebar tokens · the dark background is `--sidebar-dark-bg #1f2329`, a neutral gray, not tinted with the brand color
Active menu: light mode = a gray fill `--sidebar-active-bg` + a 3px brand-colored bar (`--sidebar-active-bar`) · dark mode = a translucent overlay `--on-brand-veil` + a white bar
The app frame is neutral — the brand color inside the frame appears only in the selection bar and the logo.

**For a new customer brand**, copy a `body[data-theme='…']` block and put in the customer's 4 values (if the customer's color is too bright → use a darker shade that passes 4.5:1 as `--brand`, and keep the original color for the logo and charts)
You do not touch a single line of any component.

## Ready-made component classes

| Group | Classes |
|---|---|
| Structure | `.app-shell` `.app-sidebar` `.nav-link(.on)` `.app-topbar` `.app-main > .inner` `.page-head` |
| Card | `.card` `.card-head` `.card-body` |
| KPI | `.stat-grid` `.card.stat` (`.label` `.value` `.foot`) |
| Status | `.pill.pill-green/blue/amber/orange/red/violet/grey` |
| Button | `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` |
| Form | `.field > label` `.input` `.select` `.textarea` `.err` |
| Table | `.tb-wrap > .tb` (`.right`) |
| Filter | `.chips > .chip(.on)` · `.tabs > .tab(.on)` |
| Other | `.prog > i` `.ava(.ava-lg)` `.md-html` `.empty` `.skeleton(.lg)` (loading content) `.spinner` (a short wait inside a button) `.toasts > .toast(.ok/.err)` `.backdrop + .modal` |
| Utility | `.row` `.row-between` `.col` `.grow` `.ellipsis` `.wrap` `.mt-*` `.mb-*` `.gap-*` `.num` `.muted` `.faint` |


---

# skill: mobile-app-design

Use when designing a phone app screen or mockup

# Mobile App Design

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **กฎข้อเดียว:** หน้าจอมือถือมีที่ให้แสดงน้อยกว่าที่คุณคิดครึ่งหนึ่ง
> ทุกอย่างที่ไม่ใช่เนื้อหาต้องเงียบลงจนแทบมองไม่เห็น

## เมื่อไหร่ใช้ skill นี้

- ทำหน้าจอแอปมือถือ: รายการเนื้อหา, บทสนทนา/แชท, หน้าสรุปผล, ตั้งค่า, onboarding
- PWA · เว็บที่ห่อเป็นแอป (Capacitor / Cordova / WebView) · React Native · Flutter
- แอปที่มีเนื้อหาให้อ่านเยอะ — เรียนภาษา, อ่านบทความ, คอร์สออนไลน์
- ต้องรองรับไทย–อังกฤษปนกัน

## เมื่อไหร่ **ไม่** ใช้

- เว็บแอปบนเดสก์ท็อป (แดชบอร์ด/admin) ให้ใช้ `web-app-design`
- แอปเดสก์ท็อป Windows ให้ใช้ `windows-app-design`
- เอกสาร .docx/.pptx ให้ใช้ `branded-document-design`

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ (ยกเว้น Flutter / native ดูข้อ 4.1)

> **โปรเจกต์มีหน้าจออยู่แล้ว → ลอกหน้าเดิมตาม `ui-craft` ข้อ 0 ไม่ใช้ speakgo** (ยกเว้นสั่งออกแบบใหม่ หรือหน้าเดิมยังไม่ผ่านด่านสวย) · ลำดับด้านล่างสำหรับโปรเจกต์ที่ยังไม่มีหน้าตาเลย หรือกำลังออกแบบใหม่ · speakgo ให้แค่คลาสคอมโพเนนต์และค่าสำรอง หน้าตาของงานมาจาก `theme.css` ที่ได้จากการค้น

```
0. ทิศทางภาพตาม ui-craft ข้อ 0.1 (ค้นต้นแบบตาม design-references ประเภท app แล้วถอดสี · หน้าจอพระเอก · แอปอ้างอิง · 3 แนว · เลือก 1 · โลโก้) → คัดลอก assets/theme-template.css เป็น mockup/theme.css แล้วเติมค่าทั้ง 4 กลุ่มในข้อ 2 จากแนวที่เลือก พร้อมที่มาทุกค่า
1. คัดลอก assets/mockup-template.html + assets/speakgo.css ไปไว้คู่กับ theme.css (หน้าตาค่าสำรอง: assets/mockup-template-preview.webp · ไม่ใช่เป้าหมาย)
   รูปแบบนำทาง (แท็บล่าง · ลิ้นชัก · หน้าเดียว) เลือกจากต้นแบบที่ค้นและจำนวนงานหลักของแอป ไม่ยึดแม่แบบ
2. แก้เนื้อหาให้เป็นหน้าจริง (ยังไม่แตะโค้ดแอป)
3. python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
   python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android
   python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max
4. เปิดภาพดูจริงทุกขนาด แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นโค้ดจริง — ใช้ token ชุดเดิม ไม่ออกแบบใหม่
```

**mockup ส่งมอบเป็นไฟล์เดียว** (`mockup/<รหัส>-mockup.html` ทุกหน้าจอเป็น section) → ฝังเนื้อ `speakgo.css` แล้วตามด้วย `theme.css` ลงใน `<style>` แทน `<link>` ก่อนส่ง

ถ้าเป็น Flutter / Android native ให้ข้ามไปทำตาม **ข้อ 4.1** ได้เลย จะทำ mockup HTML ด้วยหรือไม่ก็ได้ แต่ภาพที่ใช้ตรวจต้องมาจากแอปจริง

เปิด mockup บนจอคอมกว้างกว่า 560px จะเห็นเป็น **กรอบเครื่องลอยบนพื้นเข้ม**
ส่งลิงก์ให้ลูกค้าดูได้เลยโดยไม่ต้องอธิบายว่านี่คือหน้าจอมือถือ

---

## 2 · Design tokens

> **หน้าตามาจากการค้นของงานนี้ — ไม่หยุดถาม**
> ลำดับหาค่า: `doc-theme` ของโปรเจกต์ หรือสีและฟอนต์แบรนด์ (มีแล้วใช้เลย) → ต้นแบบแอปที่ค้นสดตาม `design-references` (ประเภท app) และพาเลตที่ถอดด้วย `design-direction-lookup` ข้อ 2 → ค้นไม่ได้เลย (ไม่มีเน็ต · ผู้ใช้สั่งใช้ของเดิม) จึงใช้ค่าสำรองใน `assets/speakgo.css` เขียน `(รอยืนยัน)` แล้วทำต่อ
> ตารางเนื้องานกับโทนสีใน `diagram-figures` ข้อ 5 เป็นจุดตั้งต้นของคำค้น ไม่ใช่คำตอบ

**ค่าไหนตายตัว ค่าไหนมาจากการค้น**

| กลุ่ม | token | มาจาก | ค่าสำรอง (speakgo) |
|---|---|---|---|
| สี | `--signal` `--signal-soft` · `--tile1` `--tile2` · พื้นและข้อความเมื่อแนวที่เลือกต้องการ | แบรนด์ลูกค้า → พาเลตที่ถอดจากต้นแบบแอปในวงการ | เขียวน้ำทะเลของ Speak Go |
| ฟอนต์ | `--ui` `--dis` `--text` `--mono` (หน้าที่ 4 ช่องคงไว้ ฟอนต์ในแต่ละช่องเปลี่ยนได้) | ฟอนต์แบรนด์ → คู่ฟอนต์ไทย-ละตินที่ต้นแบบใช้ · แอปเครื่องมือใช้ฟอนต์ระบบได้ (ข้อ 3) | IBM Plex Sans Thai · Space Grotesk · Source Serif 4 · system mono |
| รูปทรง | `--r-tile` `--r-card` `--r-field` `--r-pill` · `--shadow-card` `--shadow-float` | แนวที่เลือก | ตามไฟล์ speakgo |
| เลย์เอาต์ | `--app-max` `--gutter` | ขนาดเครื่องเป้าหมายและความแน่นของงาน | 430 · ตามไฟล์ |
| **ตายตัวทุกงาน** | ใช้ token เท่านั้น · คอนทราสต์ ≥ 4.5:1 · สีสถานะตามความหมาย · ชื่อ token ตามหน้าที่ · กฎมือถือข้อ 4 (`100dvh` · safe area · เป้าแตะ 44/48) | กฎของระบบ ไม่ขึ้นกับงาน | — |

ค่าของงานอยู่ใน `theme.css` ไฟล์เดียว (แม่แบบ `assets/theme-template.css`) · ทุกบรรทัดมีคอมเมนต์ที่มา · `speakgo.css` ไม่แก้

token ทั้งหมดอยู่ใน `assets/speakgo.css` ส่วนตารางเต็มอยู่ใน **`references/tokens.md`**

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| พื้นหน้าจอ / การ์ด | พื้นเป็น**เทาอ่อน ไม่ใช่ขาว** การ์ดจะได้ลอยขึ้นมาโดยไม่ต้องมีเงา | เทาอ่อนมาก / ขาว |
| ข้อความ 3 ระดับ | หลัก · รอง · จาง | ไล่จากเข้มไปอ่อน ข้อความหลักต้อง contrast ≥ 4.5:1 |
| `--signal` (accent) | แท็บที่เลือก · ความคืบหน้า · ปุ่มหลัก | `doc-theme` → สีแบรนด์ → ไม่มีใช้ `#2A78D6` + `(รอยืนยัน)` |
| ไทล์ไล่สี | ปลายสองข้างของ gradient | สีหลัก → สีข้างเคียงบนวงล้อสี |
| สีบอกสถานะของเนื้อหา | ต้องแก้ · คำใบ้ · ถูกใจ — **มีสีพื้นอ่อนคู่กันทุกตัว** | ตามความหมาย ไม่ตามแบรนด์ |

**สีที่บอกสถานะไม่เปลี่ยนตามแบรนด์** — แดงคือจุดที่ต้องแก้ ไม่ว่าแบรนด์จะเป็นสีอะไร
ถ้าสีแบรนด์ชนกับสีสถานะ ให้เลี่ยงการใช้แบรนด์ในบริบทนั้น ไม่ใช่เปลี่ยนสีสถานะ

**ชื่อ token ตั้งตามหน้าที่ ไม่ใช่ตามสี** — `--repair` ไม่ใช่ `--red`
วันที่เปลี่ยนใจว่าจุดที่ต้องแก้ควรเป็นสีส้ม แก้ค่าเดียวโดยชื่อยังถูกอยู่

`assets/speakgo.css` มาพร้อมชุดสีหนึ่งชุดที่**ประกอบครบแล้ว** เป็นค่าสำรองเมื่อค้นไม่ได้ ไม่ใช่ค่าเริ่มของทุกงาน

---

## 3 · ฟอนต์ 4 หน้าที่ — หัวใจของระบบนี้ (สำหรับแอปที่มีเนื้อหาให้อ่าน)

สิ่งที่ตายตัวคือ **หน้าที่ 4 ช่อง** ฟอนต์ในตารางเป็นค่าสำรอง ฟอนต์ของงานเลือกจากการค้น (ข้อ 2) แล้วใส่ใน `theme.css`

> แอปเครื่องมือที่ไม่มีเนื้อหาให้อ่านยาว ๆ (เครื่องวัด เครื่องคิดเลข ตัวจับเวลา) ใช้ฟอนต์ระบบได้
> อย่างมากเพิ่มตระกูลเดียวสำหรับตัวเลขใหญ่ — ไม่ต้อง bundle 4 ตระกูลให้ไฟล์แอปโตเปล่า ๆ

| Token | ฟอนต์สำรอง | หน้าที่ |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | ปุ่ม เมนู ป้าย ชื่อหน้า — ทุกอย่างที่เป็น "แอป" |
| `--dis` | Space Grotesk | ตัวเลขใหญ่ — คะแนน สถิติ |
| `--text` | Source Serif 4 | เนื้อหาที่ผู้ใช้ต้อง **อ่าน** — บับเบิล ประโยคตัวอย่าง |
| `--mono` | system mono | ป้ายกำกับพิมพ์ใหญ่ + `letter-spacing:.14em` — META · LEVEL · TURN 5/12 |

**แอปที่มีเนื้อหาให้อ่าน อย่ายุบให้เหลือตระกูลเดียว** — การแยกฟอนต์ทำให้ผู้ใช้แยก "สิ่งที่แอปพูด"
ออกจาก "ปุ่มของแอป" ได้ทันทีโดยไม่ต้องพึ่งสี ซึ่งสำคัญมากบนจอเล็ก

`body[data-lang="en"]` สลับ `--ui` เป็น Space Grotesk เมื่อ UI เป็นอังกฤษล้วน

---

## 4 · โครงหน้าจอ

ภาพโครงหน้าจอ (`#app` กว้างไม่เกิน 430px · `100dvh` · appbar · `.screen` เลื่อนได้ · tabbar 3–5 แท็บ · `.overlay` เต็มจอแทน modal สำหรับงานที่ใช้เวลานาน) อยู่ใน [`references/screen-and-components.md`](references/screen-and-components.md)

กฎที่คนทำเว็บมาทำมือถือมักพลาด:

- **`100dvh` ไม่ใช่ `100vh`** — `vh` ไม่หดตามแถบที่อยู่ของเบราว์เซอร์ เนื้อหาท่อนล่างจะโดนบัง
- **`env(safe-area-inset-*)`** ที่ appbar/tabbar/dock + `viewport-fit=cover` ใน meta viewport
  ไม่งั้นชนรอยบากบนและ home indicator ล่าง
- **เลื่อนที่ `.screen` ไม่ใช่ที่ `body`** — ตั้ง `body{overflow:hidden}` แถบบน/ล่างจะได้อยู่นิ่ง
- **ไม่มี hover บนมือถือ** — สถานะที่ผู้ใช้เห็นได้มีแค่ `:active` ทุกอย่างที่กดได้ต้องยุบ
  (`transform:scale(.98)`) และตั้ง `-webkit-tap-highlight-color:transparent`
- **เป้าแตะ ≥ 44×44 pt บน iOS (แนวทาง Apple) · ≥ 48×48 dp บน Android (Material)** — ปุ่มไอคอน 38px ต้องมี padding รอบให้ถึง ส่วนแอปที่ลงทั้งสองระบบให้ใช้ 48
- **แท็บล่าง 3–5 อัน** เกินนั้นนิ้วโป้งเอื้อมไม่ถึงและป้ายจะตัดคำ

### 4.1 · Flutter / Android native

ตาราง 10 เรื่องอยู่ใน [`references/screen-and-components.md`](references/screen-and-components.md): token ใน `ColorScheme` + `ThemeExtension` · ตรวจสีดิบด้วย grep · โหมดมืดชุดที่สอง · ภาพจากแอปจริงด้วย `adb` · edge-to-edge + `SafeArea` · ปัดย้อนกลับ หมุนจอ ตัวอักษร 200 % · ขอสิทธิ์ · hardware ไม่มี · SnackBar ใน Scaffold ซ้อน · `SegmentedButton`

---

## 5 · คอมโพเนนต์ที่มีให้แล้ว

ตารางคลาสใน `speakgo.css` (รายการ · ตัวควบคุม · ตั้งค่า · สนทนา · แถบไมค์ · สรุปผล) อยู่ใน [`references/screen-and-components.md`](references/screen-and-components.md)

**บับเบิลสนทนา:** มุม 18px ทุกด้าน ยกเว้นมุมที่ชี้เข้าหาผู้พูดเหลือ **5px** —
บอกว่าใครพูดโดยไม่ต้องวาดหางบับเบิล

**กล่องแก้ไข (`.repair`):** ใช้ `<del>` ขีดฆ่า + `<ins>` ขีดเส้นใต้ —
สื่อความหมายได้แม้ผู้ใช้ตาบอดสี ห้ามใช้สีอย่างเดียว

---

## 6 · ภาษาไทยบนจอเล็ก

- **IBM Plex Sans Thai** วรรณยุกต์ไม่ชนสระที่ขนาดเล็ก และมีน้ำหนัก 400–700 ครบ
- ระยะบรรทัด **1.5–1.75** — ไทยต้องการมากกว่าอังกฤษ ยิ่งจอเล็กยิ่งต้องเว้นที่ให้มาก
- **ห้าม `text-transform:uppercase` กับข้อความไทย** — ไม่มีผลกับตัวไทย แต่
  `letter-spacing` ที่มักมาคู่กันจะดันวรรณยุกต์เพี้ยน ป้าย mono ใช้กับอังกฤษเท่านั้น
- ปุ่มไทยกว้างกว่าอังกฤษ ~20% — อย่า fix ความกว้างปุ่ม ให้ปุ่มหลักเต็มความกว้างไปเลย
- ทดสอบด้วยข้อความไทยจริง ไม่ใช่ Lorem ipsum

---

## 7 · ตรวจงาน

ถ่ายภาพ 3 ขนาด (390×844 · 360×800 · 430×932) และรันตัวตรวจ token ของ `web-app-design` ด้วย `--require` ชุดของระบบนี้ (คำสั่งและเช็กลิสต์ 10 ข้ออยู่ใน [`references/review.md`](references/review.md)) แล้วเปิดภาพดูจริง · สีดิบที่ยอมได้มีแค่ `<meta name="theme-color">`

---

## 8 · Anti-patterns

ข้อห้าม 9 ข้อ (`100vh` · ลืม safe-area · แท็บ 6+ · modal เล็กสำหรับงานยาว · ยุบฟอนต์ · ไล่สีหลังข้อความยาว · สีอย่างเดียว · ไม่มี `:active` · ไม่เรนเดอร์ดู) อยู่ใน [`references/review.md`](references/review.md)

---

## 9 · ข้อจำกัดที่ต้องรู้

ข้อจำกัด 3 ข้ออยู่ใน [`references/review.md`](references/review.md) — ตาราง React Native ยังไม่ได้ build ทดสอบ · แอปจริงต้อง bundle ฟอนต์ · `speakgo.css` มีแค่โหมดสว่าง

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / IA ก่อนลงสี | agent `ux-designer` |
| เว็บแอปเดสก์ท็อปของระบบเดียวกัน | `web-app-design` |
| ตัวตรวจ hardcode สีใน CI | `web-app-design` → `scripts/check-design-tokens.mjs` |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| App Store Optimization | `mobile-engineering` |
| กฎระยะห่าง ลำดับสายตา และ 5 สถานะของหน้าจอ | `ui-craft` |
| ไดอะแกรมสถาปัตยกรรม | `software-diagrams` |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: review.md

# Review, anti-patterns and limits — extension of `mobile-app-design`

Open this when doing items 7 · 8 · 9 of `SKILL.md`.

## Review commands and checklist (item 7)

```bash
# 1. หน้าตาถูกทุกขนาดจอไหม
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android เล็ก
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max

# 2. ระบบดีไซน์ยังสะอาดอยู่ไหม (ใช้ตัวตรวจของ web-app-design ได้เลย
#    แต่ต้องส่ง --require เป็น token ชุดของระบบนี้ ไม่ใช่ชุดของเว็บ)
# คัดลอก check-design-tokens.mjs จาก plugin software-development (skills/web-app-design/scripts/) ไปไว้ที่ tools/ ในโปรเจกต์ก่อน แล้วรัน:
node tools/check-design-tokens.mjs src/theme.css src/app \
  --require "--bg,--surface,--ink,--soft,--faint,--line,--signal,--repair,--hint,--ui,--dis,--text,--mono,--r-tile,--r-card,--app-max,--gutter"
```

> The only exception where a raw color is allowed: `<meta name="theme-color">` in `index.html` —
> the browser reads meta before CSS loads, so `var()` cannot be used.

Open the screenshots and check by eye:

- [ ] Top/bottom bars are not covered by the notch or home indicator
- [ ] When scrolling, top/bottom bars stay fixed and do not scroll with the content
- [ ] At 360px (small Android) tab labels do not break mid-word and tiles do not overflow
- [ ] Every button is really tappable: ≥ 44×44 pt (iOS) · 48×48 dp (Android)
- [ ] Thai text does not overflow buttons, and tone marks do not collide with vowels
- [ ] Contrast ≥ 4.5:1 (`--faint` on white is the closest call — use it for supporting text only)
- [ ] An empty state (`.blank`) exists wherever a list can be empty
- [ ] Switch every theme the app has (e.g. light/dark · plain/gradient) and no text blends into the background
- [ ] Every input channel that depends on hardware has a fallback (e.g. a speaking app has a "พิมพ์แทนพูด" ("type instead of speaking") path; an app that uses a sensor lets the user use the camera or enter data by hand)
- [ ] A denied permission and missing hardware each have a screen that says so and offers a way forward

## Anti-patterns (item 8)

- **`100vh`** — use `100dvh`
- **Forgetting `env(safe-area-inset-*)`** or forgetting `viewport-fit=cover`
- **Cramming 6+ tabs into the bottom bar** — 3–5 is enough; put the rest on a "เพิ่มเติม" ("More") page
- **A small modal for a long task** — use the full-screen `.overlay`
- **Collapsing to one font family in an app that has content to read** — users can no longer tell content from chrome (the app's bars, buttons, menus)
- **A gradient behind long text** — gradients go on chrome and primary buttons only
- **Relying on color alone to carry meaning** — `del`/`ins` already have their own strike/underline styles
- **No `:active` feedback** — mobile has no hover; if nothing moves on press, users press again
- **Handing over a mockup that was never rendered at real size**

## Limits to know (item 9)

- All values were **verified on HTML/CSS** — the React Native table in `references/tokens.md`
  **has not been built and tested**. Flutter has been used with the item 4.1 approach on 1 real app (Lumio).
  The values transfer directly, but check the real screen on a device once more.
- Fonts load from Google Fonts in the mockup — a real app should bundle the font files.
  Otherwise on first launch with a slow network the user sees the system font first, then a visible jump.
- `assets/speakgo.css` has **light mode only** — dark mode needs a complete new set of every token
  (the `--bg`/`--surface` backgrounds swap order and `--ink` must not be pure white), then check AA contrast on every pair.


## reference: screen-and-components.md

# โครงหน้าจอ Flutter และคอมโพเนนต์ — ส่วนขยายของ `mobile-app-design`

เปิดตอนวางโครงหน้าจอ (ข้อ 4) ทำ Flutter / Android native (ข้อ 4.1) หรือหาคลาสใน `speakgo.css` (ข้อ 5)

## โครงหน้าจอ (ข้อ 4)

```
┌─────────────────────────┐  #app  max-width 430px · 100dvh
│ .appbar                 │  padding-top + safe-area-inset-top
│   h1 24/700             │
│   .sub  mono 10 UPPER   │
├─────────────────────────┤
│ .screen.on  (เลื่อนได้)  │  ← มีหลาย .screen สลับด้วยคลาส .on
│   .chips  (เลื่อนขวาได้) │
│   .tiles  2 คอลัมน์      │
│   .card / .sg           │
│   .cta                  │
├─────────────────────────┤
│ .tabbar  3–5 แท็บ        │  padding-bottom + safe-area-inset-bottom
└─────────────────────────┘

.overlay.on = หน้าจอทับเต็ม สำหรับงานที่ใช้เวลานาน (บทสนทนา, แบบทดสอบ)
              ใช้แทน modal เพราะงานพวกนี้ไม่ได้จบใน 3 วินาที
```

## Flutter / Android native (ข้อ 4.1)

| เรื่อง | ทำอย่างนี้ |
|---|---|
| token | เก็บสีหลักใน `ColorScheme` (`ColorScheme.fromSeed` แล้ว `copyWith`) สีตามความหมายที่ Material ไม่มีให้เก็บใน `ThemeExtension` ของเราเอง ส่วนระยะห่างเป็นค่าคงที่ในไฟล์ theme ไฟล์เดียว — ตัวอย่างจริง: `lib/core/theme.dart` ของแอป Lumio |
| ตรวจสีดิบ | ตัวตรวจของ `web-app-design` ไม่จับ Dart — ใช้ `grep -rn -e "Color(0x" -e "Colors\.[a-z]" lib --include=*.dart` แล้วต้องเจอเฉพาะในไฟล์ theme |
| โหมดมืด | ทำชุด token ที่สองให้ครบทุกตัว (ไม่ใช่กลับสีอัตโนมัติ) แล้วตรวจคอนทราสต์ทุกคู่ข้อความ/พื้นให้ผ่าน AA (≥ 4.5:1) ทั้งสองชุด ค่าเริ่มใช้ `ThemeMode.system` |
| ภาพหน้าจอ | ถ่ายภาพจากแอปจริงด้วย `adb exec-out screencap -p > _to_delete/screenshots/<ชื่อ>.png` ทั้งโหมดสว่างและมืด โดยจอ 360×800 dp เป็นจอเล็กสุดที่ต้องดู |
| ขอบจอ | edge-to-edge (Android 15 ขึ้นไปบังคับ) ให้ห่อเนื้อหาด้วย `SafeArea` และตั้งสีไอคอนแถบสถานะกับแถบนำทางตามธีม (`SystemUiOverlayStyle`) |
| ระบบ | ปัดย้อนกลับของระบบต้องไปหน้าก่อนหน้า ไม่ปิดแอปกลางงาน (`PopScope`) หมุนจอแล้วต้องไม่พัง หรือจะล็อกแนวตั้งโดยตั้งใจก็ได้ และเมื่อตั้งขนาดตัวอักษรระบบ 200 % (`textScaler`) ข้อความต้องไม่ล้นและไม่ตัดตัวเลขสำคัญ |
| สิทธิ์ | อธิบายในหน้าก่อน (การ์ด 1 ใบ ปุ่มเดียว) → ขอสิทธิ์เมื่อผู้ใช้กดเท่านั้น → แยก "ปฏิเสธ" (ขอใหม่ได้) กับ "ถูกบล็อก" (ปุ่มเปิดหน้าตั้งค่าแอป) → ตรวจใหม่เมื่อกลับเข้าแอป |
| hardware ไม่มี | เครื่องไม่มี sensor หรือกล้องใช้ไม่ได้ ต้องมีหน้าจอบอกและทางเลือกอื่น ไม่ใช่จอว่างหรือ 0 |
| SnackBar | Scaffold ซ้อนกัน (แท็บอยู่ใน Scaffold หลัก) SnackBar จะขึ้นที่ Scaffold ราก แล้วบังปุ่มล่างของหน้าแท็บ วิธีแก้คือให้แต่ละแท็บมี `ScaffoldMessenger` ของตัวเอง หรือย้ายปุ่มไปไว้ `bottomNavigationBar` ของหน้านั้น |
| ตัวเลือกแบบแบ่งช่อง | ถ้าใช้ Material 3 `SegmentedButton` ใส่ป้ายไทย 3 ช่องบนจอ 360 dp ต้องใช้ `showSelectedIcon: false` และป้ายสั้น |

## คอมโพเนนต์ที่มีให้แล้ว (ข้อ 5)

| กลุ่ม | คลาสหลัก |
|---|---|
| รายการ | `.tile` (ไทล์ไล่สี) · `.card` · `.sg` (แถว + แถบความคืบหน้า) · `.heart` · `.lvl` |
| ตัวควบคุม | `.chips/.chip` · `.lvlchip` · `.cta` · `.outline` · `.seg` · `.iconbtn` |
| ตั้งค่า | `.group > .r2 / .rcol` (การ์ดเดียว แถวคั่นด้วยเส้น แบบ iOS) |
| สนทนา | `.turn.ai/.me > .bub` · `.repair` (`del`/`ins`) · `.hintbox` · `.acts/.actbtn` · `.dots` |
| แถบไมค์ | `.dock` · `#mic(.live/.busy)` · `.typerow` · `#interim` |
| สรุปผล | `.score` · `.mini` · `.bar` · `.verdict` · `.wk` · `.stat` |


## reference: tokens.md

# Token reference — Speak Go-style mobile app design system

> Warning: **the color values in this file are a finished example, not a standard.**
> Always pick colors from the work itself first (see `SKILL.md` item 2 · Design tokens).
> What to take from this file is **the list of tokens and their roles**, not the values.
> Colors, fonts, radii, shadows and widths are fallbacks. The project's values live in `theme.css` (`SKILL.md` item 2) · spacing, type sizes and breakpoints follow this file.

All definitions are in `assets/speakgo.css`, in the `:root` block.
**Nothing below the `=== base ===` line may contain a raw color** — the same checker as `web-app-design` works here.

## Contents

1. [Colors](#colors)
2. [Fonts — 4 families, 4 roles](#fonts--4-families-4-roles)
3. [Type scale](#type-scale)
4. [Shapes](#shapes)
5. [Layout and safe area](#layout-and-safe-area)
6. [Themes](#themes)
7. [Moving to another stack](#moving-to-another-stack)
8. [Ready-made classes](#ready-made-classes)

---

## Colors

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#F2F4F6` | Screen background — light gray, not white, so cards stand out |
| `--surface` | `#FFF` | Cards · bottom bar · input fields |
| `--ink` | `#131A21` | Main text · primary button background · user bubble |
| `--soft` | `#66727E` | Secondary text · descriptions |
| `--faint` | `#98A3AD` | Labels · meta · inactive icons |
| `--line` | `#E2E7EB` | Borders · progress bar track |
| `--signal` | `#2A78D6` (house default, used when there is no brand color) | Selected tab · progress · mic while recording · for a button background with white text use `--signal-strong` instead (white on `#2A78D6` gives only 4.42:1, below 4.5:1) |
| `--signal-strong` | `#226CC6` | Button background with white text (white on this color is 5.21:1) — if there is a brand color, use a brand color dark enough for white text to reach ≥ 4.5:1 |
| `--signal-soft` | `#E8F1FB` | Level badge background |
| `--repair` / `-bg` | `#C0392B` / `#FBEDEB` | Spots that need fixing |
| `--hint` / `-bg` | `#8A6D1F` / `#FBF4E3` | Hints |
| `--fav` | `#D9455F` | Heart / like |
| `--tile1` → `--tile2` | `#0B7076` → `#4338A8` | Gradient on category tiles |

> Token names follow the **role**, not the color — `--repair`, not `--red`.
> If you later decide "spots that need fixing" should be orange, you change it in one place and the name is still correct.

## Fonts — 4 families, 4 roles

This is what sets this system apart from ordinary apps. **Do not collapse it to one family.**

| Token | Font | Used for |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | All controls — buttons, menus, labels, page titles |
| `--dis` | Space Grotesk | Large numbers — scores, stats (`.score b`, `.mini b`, `.stat b`) |
| `--text` | Source Serif 4 | Content the user must **read** — bubbles, example sentences |
| `--mono` | system mono | Uppercase labels + `letter-spacing:.14em` — META, LEVEL, TURN 5/12 |

`body[data-lang="en"]` switches `--ui` to Space Grotesk
(IBM Plex Sans Thai has Latin letters, but they look less crisp when no Thai is mixed in).

**Why serif for bubbles:** for content read at length and re-read, serif separates letters better,
and it tells "what the app says" apart from "the app buttons" at once, without using color.

## Type scale

| Size | Family | Used for |
|---|---|---|
| 60 / 44 | dis | Big score · verdict |
| 24 | ui 700 | Page title in appbar |
| 19–24 | dis 700 | Stat numbers |
| 17 | text | Conversation bubble |
| 15.5–16 | text | Example sentences · edit box |
| 16 | ui 600 | Item title in a card |
| 15 | ui | Input fields · primary button |
| 13–14 | ui | Body text · secondary button |
| 11–12 | ui | Descriptions · labels |
| 9–10 | mono uppercase | meta · LEVEL · speaker name |

## Shapes

| Token | Value | Used for |
|---|---|---|
| `--r-tile` | 16px | Tiles · stat cards · CTA buttons |
| `--r-card` | 18px | List cards · bubbles · large boxes |
| `--r-field` | 13px | Input fields · outline buttons |
| `--r-pill` | 22px | Chips · search field |
| — | 50% | Icon buttons · heart · mic |

**Conversation bubbles** use 18px on every corner **except** the corner pointing at the speaker, which is **5px**
(`border-bottom-left-radius` on the AI side · `border-bottom-right-radius` on the user side).
This shows who is speaking without drawing a bubble tail.

## Layout and safe area

| Item | Number |
|---|---|
| Max app width | 430px (iPhone Pro Max) |
| Left/right margin | 16px (`--gutter`) on every page |
| Mic button | 66px |
| Icon button | 38px |
| Tile | min height 118px · 2 columns, gap 8px |
| Tab bar | icon 22px + label 10px |

> 9–10 type is allowed only for English mono labels in the mockup, because in a real app the smallest is 11.

**Safe area — never forget it**, or content will hit the notch at the top or the home indicator at the bottom:

```css
.appbar  { padding-top:    calc(12px + env(safe-area-inset-top)); }
.tabbar  { padding-bottom: calc(8px  + env(safe-area-inset-bottom)); }
.dock    { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
```
The page also needs `<meta name="viewport" content="…,viewport-fit=cover">`, otherwise `env()` is 0.

Use **`100dvh`**, not `100vh` — `vh` does not shrink for the browser address bar on mobile,
so the bottom part of the content gets covered.

## Themes

| Theme | Enabled by | What differs |
|---|---|---|
| Plain (default) | — | chrome (the app bars and buttons) white/gray · blue accent (`--signal` = `#2A78D6`) |
| Gradient | `body[data-theme="grad"]` | appbar/ovbar/CTA/mic/user bubble are gradients · `--signal` changes to purple · score is gradient text |

**Rule of the gradient theme:** gradients go on **chrome and primary buttons** only. The content area stays plain.
If a gradient sits behind long text, it is hard to read and the contrast cannot be controlled.

## Moving to another stack

CSS is the source. The same values work everywhere — what needs care is the mechanism, not the numbers.

| Topic | React Native | Flutter |
|---|---|---|
| token | a `tokens.ts` file as an object, then import it (no CSS variables) | `ThemeExtension` or an `AppTokens` class of constants |
| safe area | `react-native-safe-area-context` → `useSafeAreaInsets()` | `SafeArea` / `MediaQuery.padding` |
| fonts | link the font files into the project; there is no automatic fallback | `pubspec.yaml` → `fontFamily` |
| gradient | `expo-linear-gradient` | `BoxDecoration(gradient: LinearGradient(...))` |
| shadow | `shadowColor/Offset/Opacity/Radius` (iOS) + `elevation` (Android) | `BoxShadow` |
| uneven corners | `borderBottomLeftRadius` etc. | `BorderRadius.only(...)` |
| shrink on press | `Pressable` + `Animated.spring` scale .98 | `InkWell` / `AnimatedScale` |
| tabular numbers | `fontVariant: ['tabular-nums']` | `FontFeature.tabularFigures()` |

> **Limit to know:** the numbers in this table were verified on HTML/CSS only.
> The RN/Flutter column is a mechanism comparison that **has not been built and tested** — the values transfer, but check the real look on a device once more.

## Ready-made classes

| Group | Classes |
|---|---|
| Structure | `#app` `.appbar` `.screen(.on)` `.tabbar > .tab(.on)` `.overlay(.on)` `.ovbar` |
| Lists | `.tiles > .tile` `.card` `.sg` `.heart(.on)` `.lvl` `.grouphead` `.welcome` `.blank` |
| Controls | `.chips > .chip(.on)` `.lvlchip(.on)` `#search` `.iconbtn` `.cta(.alt)` `.outline(.danger)` `.seg > button(.on)` |
| Settings | `.sect` `.group > .r2 / .rcol` |
| Conversation | `#thread` `.turn(.ai/.me)` `.who` `.bub(.masked)` `.repair` `del` `ins` `.note` `.tag` `.clean` `.hintbox` `.acts > .actbtn(.hintb)` `.sys` `.dots` |
| Mic bar | `.dock` `#interim` `.dockrow` `#mic(.live/.busy)` `.typerow(.on)` `.txtbtn` |
| Result summary | `.report` `.score` `.mini` `.bar` `.verdict` `.wk` `.stat` `.g4` `.drillrow` `.fixrow` `.dnote` |


---

# skill: windows-app-design

Use when building a native-looking Windows 11 app

# Windows App Design

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **กฎข้อเดียว:** แอปที่ทำต้องดูเหมือนของที่มากับ Windows 11 ไม่ใช่เว็บที่ถูกยัดใส่หน้าต่าง
> ผู้ใช้ Windows รู้ทันทีว่าอะไรไม่ใช่ของแท้ — มุมโค้งผิดขนาด ปุ่มสูงผิด เมนูอยู่ผิดที่
>
> **เนทีฟไม่ได้แปลว่าใช้ธีมตั้งต้น** — แอปเด่นบน Windows 11 (Windows Terminal · Dev Home · แอป Files) ใช้กติกาเนทีฟ (ขนาด · มุม · ปุ่ม · แถบชื่อ) แต่มีตัวตนของตัวเอง: ธีมเริ่มต้นที่เลือกเอง (มืดได้) · สี accent ของแบรนด์ที่ข้อมูลและปุ่มหลัก · โลโก้ในแถบชื่อ · หน้าจอพระเอก
> **กรอบหน้าต่างเป็นสีกลาง** — แถบชื่อ · nav · rail · command bar · status bar · เส้นขอบ ใช้ Mica/Acrylic ไม่ย้อมสี และเส้นกับไอคอนเทา-ดำตามธีม Windows · accent มีได้แค่ขีดเลือก 3×16px ปุ่มหลัก ข้อมูล (ตัวเลข KPI · กราฟ) และลิงก์ · ย้อมกรอบได้เฉพาะเมื่อผู้ใช้สั่ง · เลือกตัวตนตาม `ui-craft` ข้อ 0.1 ก่อนเริ่ม · `fluent.css` คือพื้น ไม่ใช่หน้าตาสุดท้าย

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
0. ทิศทางภาพตาม ui-craft ข้อ 0.1 (ค้นต้นแบบตาม design-references ประเภท app แล้วถอดสี · หน้าจอพระเอก · แอปอ้างอิง · 3 แนว · เลือก 1 · โลโก้) → ได้ token ของแบรนด์ทับ fluent.css
   (เช่น --win-accent สีแบรนด์ · ธีมเริ่มต้นมืด · พื้นกรอบเป็นสีกลางตาม fluent.css ไม่ย้อมสี) — เขียนเป็นบล็อก token ต่อท้าย fluent.css ไม่แก้ไฟล์ต้นฉบับ
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

**ทำไมต้อง mockup ก่อน:** แก้ HTML ใช้เวลาเป็นนาที แต่แก้ Extensible Application Markup Language (XAML) ที่ผูกกับ ViewModel แล้ว
ใช้เวลาเป็นชั่วโมง และถ้าเขียนโค้ดไปแล้ว การคุยเรื่องหน้าตาจะกลายเป็นการคุยเรื่องต้นทุน

---

## 2 · Design tokens

ค่าทั้งหมดวัดจาก Windows 11 dark theme จริง อยู่ครบใน **`references/tokens.md`**
(ตารางเทียบ CSS ↔ WinUI ↔ Avalonia) และพร้อมใช้ใน:

| ไฟล์ | สำหรับ |
|---|---|
| `assets/fluent.css` | web-wrapped desktop + mockup |
| `assets/FluentTokens.xaml` | WinUI 3 / Windows App SDK |
| `assets/FluentTokens.axaml` | Avalonia 11 |

**.NET MAUI ไม่มีไฟล์สำเร็จรูป** — คัดลอกค่าจาก `references/tokens.md` ลง `ResourceDictionary` ของ MAUI (`Resources/Styles/Colors.xaml`) เอง · ชื่อ key ตามคอลัมน์ Avalonia

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
> (ตารางเลือกโทนสีตามเนื้องาน อยู่ใน `colour-by-domain` (`diagram-figures` → `references/colour-by-domain.md`))
> ค่า accent ในตารางข้างบนคือค่าเริ่มต้นของ Windows ซึ่งเป็นตัวเลือกที่ปลอดภัยเมื่อยังไม่มีแบรนด์
> **ไม่ใช่ค่าที่ต้องใช้** และ accent ต้องผ่าน contrast ≥ 4.5:1 ทั้งโหมดมืดและสว่าง จึงมักต้องมีคนละค่าต่อโหมด

**พื้นดำสนิท** แบบ Windows Security (`#000000`) ยังมีให้ใช้ด้วย `<html data-backdrop="black">` แต่ไม่ใช่ค่าเริ่มต้น เพราะวางข้างแอป Windows 11 อื่นแล้วดูแข็งและแปลกตา

**เปลี่ยนแบรนด์** = แก้ 3 ค่า (`accent`, `accent-text`, `on-accent`) ต่อโหมด (มืด · สว่าง) ในไฟล์ token ที่เดียวทั้งแอป

> ระวัง: **ห้ามเขียนค่าสีดิบในคอมโพเนนต์** ต้องอ้าง token เสมอ ไม่งั้นโหมดมืดจะพังเป็นจุด ๆ
> โดยที่ไม่มีใครเห็นจนกว่าลูกค้าจะเปิดใช้

---

## 3 · โครงหน้าต่าง

ภาพโครงหน้าต่างพร้อมขนาด (title bar 48px · nav 320px · Title 28/36 · ขอบซ้ายขวา 36px · ระยะระหว่าง section 40px · เนื้อหากว้างไม่เกิน 1064px — 36 กับ 40 อยู่ในรายการยกเว้นสเกลระยะของ `ui-craft` `references/scales.md` ระยะอื่นใช้สเกล 4/8/12/16/24/32/48/64) อยู่ใน [`references/frame-and-components.md`](references/frame-and-components.md)

กฎที่คนทำเว็บมักพลาด:

- **เมนูตั้งค่าอยู่ล่างสุดของ nav เสมอ** — ผู้ใช้ Windows หาที่นั่นก่อนที่อื่น
- **แถบบอกหน้าที่เลือกเป็นขีดเล็ก 3×16px ชิดซ้าย** ไม่ใช่ระบายพื้น accent ทั้งแถว · ไอคอนของแถวที่เลือกยังเป็นสีข้อความปกติ ไม่เปลี่ยนเป็น accent
- **หน้าละ 1 Title** — ห้ามมี 2
- **เป้าคลิกเล็กสุด 32×32px** (ไม่ใช่ 48px แบบมือถือ — เดสก์ท็อปมีเมาส์)
- **ปุ่มสูง 32px กว้างต่ำสุด 120px** ปุ่มเตี้ยกว่านี้ดูเป็นเว็บทันที (ยกเว้นปุ่มไอคอน 32×32 และปุ่ม subtle ใน command bar)
- **มุม 4px สำหรับคอนโทรล / 8px สำหรับการ์ด** — ไม่มีค่าอื่น

โครงข้างบนเป็นของหน้าตั้งค่าและ dashboard · **แอปเครื่องมือที่ข้อมูลแน่น** (terminal client, file manager, admin tool)
ใช้ icon rail 48px + รายการ + แผงรายละเอียด 360px แทน ดูแบบทั้งหมดใน **`references/patterns.md`**
(ปุ่มในแถว · list-detail · command bar · หัวกลุ่ม · tab ใน title bar · status bar · หน้าเริ่มต้น · ไอคอนต้องมีที่ไหน)
ข้อ 0.1 ของไฟล์นั้นมีตารางเทียบกับแอปจริงบน Windows 11 · ตารางแปลงความต้องการเป็นคอนโทรล WinUI 3 · และรูบริกขนาดหน้าต่างเริ่มต้น — ใช้ตอนเลือกโครงและตอนส่งต่อให้คนเขียน XAML

---

## 4 · คอมโพเนนต์ที่มีให้แล้วใน fluent.css

ตารางคลาสพร้อมหมายเหตุอยู่ใน [`references/frame-and-components.md`](references/frame-and-components.md): title bar · nav · การ์ด · แถวตั้งค่า · InfoBar · pill · ตัวชี้วัดหลัก (Key Performance Indicator · KPI) · toggle · ตาราง · ลิงก์ — **InfoBar ใช้แทน `alert()` เสมอ** · KPI 3–5 ช่อง · ลิงก์ใช้สี accent-text ไม่ใช่ accent

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

**เช็กลิสต์ข้างบนวัดแค่ความถูกต้อง ผ่านครบแล้วหน้าจอยังอาจไม่สวย** ตรวจต่อด้วยตาราง "ตรวจด้วยตา" ท้าย `references/patterns.md` (ปุ่มทึบ · ไอคอน · พื้นที่ว่าง · ความสูงแถว · จำนวนกล่อง) แล้วจบด้วย**ด่านสวย** 7 แกนของ `ui-craft` (`references/states-and-checks.md` ชุดที่ 3) — ทุกแกน ≥ 4 จึงส่งให้คนอนุมัติ

### 6.1 · ให้คนอื่นวิจารณ์

คนที่ทำเองจะเห็นว่างานตัวเองดีกว่าความจริง ให้ส่งภาพให้ subagent ที่ไม่ได้ทำชิ้นนี้ (เรียง: `graphic-design:design-critic` ถ้าติดตั้ง → `graphic-designer` → `general-purpose` ที่สั่งให้วิจารณ์อย่างเดียว · ลำดับเดียวกับ `ui-craft`) พร้อมบอกเป้าหมาย:

ข้อความสั่งงานผู้วิจารณ์ (เป้า · 2–3 ปัญหาต่อหน้า · วิธีแก้ระดับ CSS · ไม่ชม · ≤ 250 คำ) อยู่ใน [`references/review.md`](references/review.md)

แก้ตามข้อที่เห็นด้วย (ข้อที่วิจารณ์ผิดเพราะอ่านภาพผิด ไม่ต้องแก้ แต่จดไว้) แล้วถ่ายใหม่ · จำนวนรอบตามเพดานด่านสวยใน `ui-craft/references/states-and-checks.md` (เกินเพดาน = กลับไปเลือกทิศทางภาพใหม่ ไม่แก้ไปมา)

---

## 7 · Anti-patterns

ข้อห้าม 16 ข้อ (ระบายพื้น accent ทั้งแถวเมนู · ย้อมสีกรอบหน้าต่าง · มุม 12–16px · เงาใต้การ์ด · `alert()` · ทำแค่โหมดมืด · ปุ่มทึบทุกแถว · ปุ่มไม่มีไอคอน ฯลฯ) อยู่ใน [`references/review.md`](references/review.md)

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

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: frame-and-components.md

# Window frame and components in fluent.css: extension of `windows-app-design`

Open when laying out a settings page/dashboard (item 3) or looking for ready-made classes (item 4) · for data-dense tool apps see `patterns.md`

## Window frame, settings page and dashboard (item 3)

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

## Components already in fluent.css (item 4)

| Element | Class | Note |
|---|---|---|
| Title bar + window buttons | `.win-titlebar` | Electron: `-webkit-app-region: drag` is already included |
| NavigationView | `.win-nav` / `.nav-item.selected` | Collapses to icons automatically below 1008px |
| Card | `.win-card` | |
| Windows-style settings row | `.win-setting` | Icon + name + description + control on the right |
| InfoBar | `.win-infobar.success/caution/critical` | **Always use it instead of `alert()`** |
| Status pill | `.win-pill.success/caution/critical` | |
| KPI | `.win-kpis .kpi` | 3–5 slots · more than that and the numbers get too small to stand out |
| Toggle switch | `.win-toggle` | |
| Table | `.win-table` | |
| Link | `.win-link` | accent-text colour, not accent |


## reference: patterns.md

# Common screen patterns: Windows apps

> Tokens and size rules are in `tokens.md` · this file answers the question **how to lay out a screen so it looks like a real app**
> Every pattern has a clickable example in `assets/tool-app-template.html` (tool apps) or `assets/mockup-template.html` (settings page/dashboard)

Background: screens that pass every item of the checklist (tokens right, sizes right, contrast passes) but still look like a wireframe
usually repeat the same 6 mistakes: solid buttons on every row · no icons · the bottom half of the screen empty · tiny uppercase group headings · web-style coloured badges · bordered boxes over the whole page.
The patterns in this file fix all 6.

**Contents**

- [0 · Choose the structure before drawing](#0--choose-the-structure-before-drawing)
- [1 · Lists with buttons in each row](#1--lists-with-buttons-in-each-row)
- [2 · List + detail panel (list-detail)](#2--list--detail-panel-list-detail)
- [3 · Command bar](#3--command-bar)
- [4 · Group headings in a list](#4--group-headings-in-a-list)
- [5 · Tabs in the title bar (Windows Terminal style)](#5--tabs-in-the-title-bar-windows-terminal-style)
- [6 · Icon rail](#6--icon-rail)
- [7 · Status bar](#7--status-bar)
- [8 · Start page (welcome / start)](#8--start-page-welcome--start)
- [9 · Icons: where they are required](#9--icons-where-they-are-required)
- [Check by eye: countable, no gut feeling](#check-by-eye-countable-no-gut-feeling)

---

## 0 · Choose the structure before drawing

| What kind of app | Structure | template |
|---|---|---|
| Settings · dashboard · an app opened only now and then | NavigationView 320px + content no wider than 1064px | `mockup-template.html` |
| Data-dense tool (terminal client · file manager · admin tool) | icon rail 48px + list + detail panel 360px | `tool-app-template.html` |
| Several documents open at once (editor · terminal · browser) | Tabs in the title bar, Windows Terminal style | `tool-app-template.html`, title bar part |

**Never use the settings-page template to make a tool app.** You get a screen where the content floats in the top half and the right side is empty

### 0.1 · Compare with real apps on Windows 11 and WinUI 3 controls

Adapted from microsoft/winappCli `winui-design` (MIT · LICENSE checked in the repo copy on 23 Oct 2026). Use it when choosing the structure, and when handing a mockup to the person writing XAML so they need not guess control names

**Choose a real-app model before laying out.** Whichever row is closest to the app you will make, follow that structure

| What kind of app | Main controls (WinUI 3) | Real app to look at as an example |
|---|---|---|
| Settings · config | `NavigationView` on the left + `SettingsCard` / `SettingsExpander` | Windows Settings |
| Editing documents or sessions | `TabView` + content filling the window, minimal chrome | Windows Terminal · Notepad · VS Code |
| Browsing a layered structure | `TreeView` + `ListView` + `BreadcrumbBar` | File Explorer · Outlook |
| Developer tools · dashboard | `NavigationView` + cards | Dev Home · GitHub Desktop |
| Single-purpose tool | Mode switcher + dense button grid | Calculator · Snipping Tool |
| Media · canvas · large images | `Grid` with a hero surface + floating buttons, **no** `NavigationView` | Photos · Clipchamp |

**Turn requirements into controls.** This guards against web instincts (`<select>` · `<input type=date>` · WPF's DataGrid)

| Need | Use |
|---|---|
| Navigate 2–7 categories | `NavigationView` · document tabs → `TabView` · path → `BreadcrumbBar` · 2–3 modes → `SelectorBar` |
| Vertical list · tile grid · tree | `ListView` · `GridView` or `ItemsRepeater` + `UniformGridLayout` · `TreeView` |
| Data table | `ListView` whose `ItemTemplate` is a `Grid`, + the table header as another `Grid`. WinUI 3 has no `DataGrid`, and the CommunityToolkit one cannot use `x:Bind` in columns |
| List + detail | `ListView` + a `Grid` on the detail side |
| Enter text · numbers · search · dates · on/off | `TextBox` · `NumberBox` · `AutoSuggestBox` · `CalendarDatePicker` · `ToggleSwitch` |
| Choose 1 of 2–3 · choose 1 of 4 or more | `RadioButtons` · `ComboBox` |
| Must decide before continuing · context menu · first-time tip | `ContentDialog` · `Flyout` / `MenuFlyout` · `TeachingTip` |
| In-page status · in progress | `InfoBar` (matches the rule InfoBar instead of `alert()` in item 4 of SKILL.md) · system notification → `AppNotification` |

**Initial window size.** WinUI 3 has no `SizeToContent`. If not set, you get about 1024×768, which is too big for most tools. Compute it in the `MainWindow` constructor

| Value | How to work it out |
|---|---|
| Width | The widest row + 48 (margins), then round up to a multiple of 20 |
| Height | 32 (title bar) + the height of every row + every gap + 48 (margins), then round up to a multiple of 20 |
| Which way to round | Always up: clipped content is worse than a slightly wide window |
| Ranges you usually get | Single-purpose tool 440–560 wide · single-page form 600–800 × 640–800 · nav + content 1100–1300 × 720–840 · media or document editor 1280+ wide |
| Trap | `AppWindow.Resize` takes **real pixels**, not DIPs; multiply by the screen's DPI scale (`GetDpiForWindow(hwnd) / 96.0`) · never set `Width`/`Height` on the root `Grid`, because that clips content and does not shrink the window |

So our HTML mockup should set `width`/`height` of `.window` per this rubric, not always fill the viewport

---

## 1 · Lists with buttons in each row

```
ผิด: ทุกแถวมี [Connect] สีทึบ + [Edit]       → ปุ่มทึบ 8 ปุ่มแย่งกันเด่น
ถูก: ชื่อ · ข้อมูล · เวลา         ▷ ✎ ⋯       → ไอคอนโผล่เมื่อชี้หรือเลือกแถว
   ปุ่มหลัก (สีทึบ) อยู่ที่แผงรายละเอียดของแถวที่เลือก · ดับเบิลคลิก = ทำงานหลัก
```

- Buttons in a row: `btn subtle icon` 32×32 · hide with `visibility: hidden` (not `display: none`, otherwise columns shift)
- The button column has a fixed width (about 112px for 3 buttons), otherwise the "Latest" column will not line up with the buttons
- Selected row: `--win-subtle-selected` fill + a 3px accent bar flush left

## 2 · List + detail panel (list-detail)

Use when the window is ≥ 1100px wide and the list has more data than a single row can show

- The right panel is 360px wide, `--win-card` fill · 24px padding · 24px gap between parts
- Top to bottom: 48px icon + 20px name → primary button (stretched full row) + secondary button → name/value pairs (label 112px) → history (32px rows with dividers) → notes
- When the window is narrower than 1100px, hide the panel and open it as a new page instead

**A screen more than half empty is the signal to use this pattern,** not a signal to stretch the table

## 3 · Command bar

```
[+ สร้างใหม่] [📁 กลุ่มใหม่] │ [⇥ นำเข้า] [↦ ส่งออก]          [ทั้งหมด|SSH|RDP]  [🔍 กรอง…]
```

- Every button is subtle + 16px icon + text · separate groups with a 1×20px vertical line
- No solid button in the command bar if the page has a detail panel (the primary button lives in the panel)
- The search box is flush right, 240–320px wide · has a magnifier icon in front

## 4 · Group headings in a list

```
ผิด: PRODUCTION · 3      (11px ตัวพิมพ์ใหญ่ สีจาง — แบบเว็บ)
ถูก: ⌄ Production  3     (14px semibold · ตัวเลขสีรอง · แถว 32–40px · กดพับได้)
```

## 5 · Tabs in the title bar (Windows Terminal style)

- Tabs are 32px tall, flush with the bottom of a 40px title bar · 8px top corners
- The selected tab = the same fill as the content below (so they look like one sheet) · other tabs have a transparent fill
- Status is shown with an 8px dot + text/tooltip, **never a coloured line on the tab** (it looks like an error)
- At the end of the tabs there are `+` and `⌄` (tab list)

## 6 · Icon rail

- 48px wide · 40×40 buttons · 18px icons · 4px apart
- Selected: `--win-subtle-selected` fill + a 3×16px accent bar flush left
- Settings always at the very bottom · every button has a `title` (tooltip) because there is no text

## 7 · Status bar

- 24px tall · 12px text in secondary colour · 16px apart
- Status uses a 6–8px dot + text, **never a solid-colour badge** (that is a web style) · the "colour power" axis of the `ui-craft` beauty gate already exempts this item for Windows (colour comes through the selection bar · the hero screen · the main Key Performance Indicator (KPI) numbers · the primary button)

## 8 · Start page (welcome / start)

> This item applies to the start page inside the app. The first page of a mockup (`#s-start`), which reviewers open as a table of contents, may use cards with thumbnails; see `ui-craft` → `references/mockup-start-page.md`

- Content no wider than 1064px, centred · at the top is a single search box that does both search and connect (do not split into 2 boxes)
- Shortcuts are 40px-tall button rows (icon + text + hotkey), **not 4 big cards**
- At most 2 bordered boxes (for example Recent · Favourites) · news is a 40px neutral-fill strip, not in the brand colour

## 9 · Icons: where they are required

| Where | Required | Size |
|---|---|---|
| Buttons in nav / rail | ✓ | 16 / 18px |
| Buttons in the command bar | ✓ together with text | 16px |
| Buttons in a row | ✓ icon only + tooltip | 16px |
| Item type (SSH · file · RDP) | ✓ in a 24px box with 4px corners | 14px |
| Detail panel header | ✓ 48px box with 8px corners | 24px |
| Primary button in a dialog | Not required | — |

Commonly used codes (Segoe Fluent Icons): add `E710` · search `E721` · settings `E713` · edit `E70F` · more `E712` · play/open `E768`
· folder `E8B7` · new group `E8F4` · import `E8B5` · export `EDE1` · terminal `E756` · screen `E7F4` · link `E71B` · key `E8D7`
· clipboard `E77F` · globe `E774` · history `E81C` · star `E734` / `E735` · home `E80F` · down arrow `E70D` · right arrow `E76C` · close `E8BB`

---

## Check by eye: countable, no gut feeling

| Item | Passes when |
|---|---|
| Solid accent-colour buttons | ≤ 1 per screen (`grep -c "btn primary"` per section) |
| Icons | Present everywhere in the table of item 9 |
| Empty space | Content uses ≥ 60% of the window height at 1440×900, or has a reason (a deliberately empty page) |
| Row height | Rows of the same kind have equal height on every card in the page |
| Bordered boxes | ≤ 3 boxes per page · no box inside a box |
| Mockup controls | Not in the image (`screenshot.py --hide`) |


## reference: review.md

# Review, critique, prohibitions and limits: extension of `windows-app-design`

Open when doing items 6 · 7 · 8 of `SKILL.md`

## Token checker command (item 6)

```bash
# ไฟล์ token แยก (web-wrapped · mockup ที่ยังวางคู่ fluent.css)
node ../web-app-design/scripts/check-design-tokens.mjs src/fluent.css src --ext html,css,ts,tsx \
  --marker "Type ramp" \
  --require "--win-bg,--win-layer,--win-card,--win-text,--win-text-secondary,--win-accent,--win-on-accent,--win-divider,--win-control-stroke,--win-radius,--win-radius-card,--win-font,--win-nav-w,--win-titlebar-h,--win-gutter"
# mockup ไฟล์เดียว: ใช้ไฟล์ mockup เป็นไฟล์ token เอง (token ฝังอยู่ใน <style>) · --require ชุดเดิม
node ../web-app-design/scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html --marker "Type ramp" --require "…"
```

  If the app adds its own tokens (for example `--telex-…`) → append them to `--require` too · name the sections in the mockup page starting with `s-` (`#s-login`) so names like `#add` `#feed` are not read as colours

## Reviewer instruction message (item 6.1)

```
ดูภาพ <path dark/light> ของแอป Windows 11 (<ชนิดแอป>) เป้าคือดูเหมือน Windows Terminal / Settings / File Explorer
บอกปัญหาที่สำคัญที่สุด 2–3 ข้อต่อหน้า (ลำดับสายตา ระยะ แนว contrast ความหนาแน่น อะไรที่ดูเป็นเว็บ)
แต่ละข้อมีวิธีแก้ระดับ CSS (ขนาด px · องค์ประกอบไหน) · ไม่ต้องชม · ไม่เกิน 250 คำ
```

## Anti-patterns (item 7)

- **Filling the whole selected menu row with the accent colour.** Windows uses a small bar flush left
- **Tinting the window frame with the brand colour** (title bar · nav · rail · command bar · Mica/Acrylic · borders · menu icons). The frame is grey-black following the Windows theme · the accent lives in the selection bar, the primary button and the data · tint only when the user orders it
- **12–16px rounded corners.** That is the look of web/mobile; Windows uses 4px and 8px
- **Shadows under cards.** Windows 11 uses thin borders; shadows are reserved for flyouts/dialogs only
- **`alert()` / `confirm()`** in a web-wrapped app: use InfoBar or ContentDialog
- **Doing only dark mode because the reference image is dark.** Windows 11 defaults to light mode and users can choose either, so both must pass
- **Hard-coding the accent colour as blue.** To follow the colour the user has set, read it from the system
  (WinUI: do not override `AccentFillColorDefaultBrush` · web: CSS `AccentColor`)
- **A menu bar of arbitrary width.** Only 320px open / 48px collapsed
- **Sending a mockup that was never rendered and looked at.** See item 6
- **Solid accent-colour buttons on every table row.** Buttons in a row are icons that appear on hover; the primary button lives in the detail panel (patterns.md item 1)
- **Buttons and menus that are text only, with no icons.** They look like a wireframe
- **Content in the top half and the bottom half empty · a table stretched across the screen until columns are 400px apart.** Use list-detail (patterns.md item 2)
- **11px uppercase group headings · solid-colour badges in the status bar · coloured lines on tabs.** These are web styles
- **Several big cards in a row on the app's start page.** It looks like a SaaS dashboard; use a row of shortcut buttons instead (the first page of a mockup does not count, see `ui-craft`)
- **The mockup's control bar (Functional Requirement (FR) code · state switcher) left in the image sent for review.** Use `screenshot.py --hide`
- **Doing every page in one round with no main page as the model.** See item 1

## Limits to know (item 8)

- The `.xaml` / `.axaml` files here **have not been compile-tested.** The files hold only token values
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) using standard syntax.
  On the first build, check whether any key collides with the framework's own
- WinUI must merge `FluentTokens.xaml` **after** `XamlControlsResources`, otherwise the values are overwritten
- Theme dictionary names differ: WinUI uses `Default`/`Light`/`HighContrast`
  while Avalonia uses `Default`/`Light`/`Dark`
- **High-contrast mode:** never put fixed colours; pull them from system colours (there is an example in the XAML files)
- Mica / Acrylic really work only in WinUI/Avalonia on Windows. For web-wrapped apps,
  use solid colours per the tokens instead. Do not imitate them with `backdrop-filter`, because the result is not the same
  and it is heavy on the machine


## reference: tokens.md

# Token map: the same values across three stacks

> **The shared values (background, text, lines, shadows, sizes, spacing) are Fluent 2 as measured from a real Windows 11. Copy them as they are; never adjust them yourself.**
> Spacing: the content margin 36 and the section gap 40 are in the exception list of `ui-craft` (`references/scales.md`) · any other padding · margin · gap not in this table uses the 4/8/12/16/24/32/48/64 scale of `ui-craft`
> **The window frame is a neutral colour.** Mica/Acrylic are not tinted · accent is used only for the selection bar, the primary button, data and links
> **`accent` is the only colour that changes per job.** Use the customer's brand colour; if there is none yet, use the Windows default in this file, write `(รอยืนยัน)` (to be confirmed), and carry on without stopping to ask
> The accent values in this file are the Windows defaults, usable when there is no brand yet; they are not mandatory

All values were measured from a real Windows 11 dark theme (pixels sampled from the Windows Security page)
Edit `assets/fluent.css`, then always edit the XAML/AXAML files to match.

## Contents

1. [Colour: dark / light](#colour--dark--light)
2. [Status](#status)
3. [Type ramp (Fluent 2): never invent sizes outside this set](#type-ramp-fluent-2-never-invent-sizes-outside-this-set)
4. [Shape · spacing · layout](#shape--spacing--layout)
5. [Window breakpoints (Fluent breakpoints)](#window-breakpoints-fluent-breakpoints)
6. [Icons](#icons)

---

## Colour: dark / light

| Meaning | Dark | Light | CSS | WinUI 3 | Avalonia |
|---|---|---|---|---|---|
| Window background | `#202020` | `#F3F3F3` | `--win-bg` | `AppBackgroundBrush` | `AppBackgroundBrush` |
| nav / content background | `#272727` | `#F9F9F9` | `--win-layer` | `AppLayerBrush` | `AppLayerBrush` |
| Card | `#2B2B2B` | `#FFFFFF` | `--win-card` | `AppCardBrush` | `AppCardBrush` |
| Primary text | `#FFFFFF` | `#1A1A1A` | `--win-text` | `TextFillColorPrimaryBrush` ✱ | `AppTextBrush` |
| Secondary text | `#CCCCCC` | `#5D5D5D` | `--win-text-secondary` | `TextFillColorSecondaryBrush` ✱ | `AppTextSecondaryBrush` |
| Faint text | `#9D9D9D` | `#8B8B8B` | `--win-text-tertiary` | `TextFillColorTertiaryBrush` ✱ | `AppTextTertiaryBrush` |
| accent (button fill, selection bar) | `#4CC2FF` | `#005FB8` | `--win-accent` | `AccentFillColorDefaultBrush` ✱ | `SystemAccentColor` ✱ |
| accent (text/link) | `#99EBFF` | `#003E92` | `--win-accent-text` | `AccentTextFillColorPrimaryBrush` ✱ | `AppAccentTextBrush` |
| Text on accent fill | `#000000` | `#FFFFFF` | `--win-on-accent` | `TextOnAccentFillColorPrimaryBrush` ✱ | `AppOnAccentBrush` |
| Normal button fill | `#333333` | `#FFFFFF` | `--win-control` | `ControlFillColorDefaultBrush` ✱ | `AppControlBrush` |
| Selected row in nav | `#FFFFFF15` | `#00000010` | `--win-subtle-selected` | `SubtleFillColorSecondaryBrush` ✱ | `AppSubtleSelectedBrush` |
| Divider | `#3A3A3A` | `#E5E5E5` | `--win-divider` | `AppDividerBrush` | `AppDividerBrush` |

The Dark values are normal Windows 11 (Mica) · the pure-black style of Windows Security (`#000000` · card `#0F0F0F` · divider `#2D2D2D`) is turned on with `data-backdrop="black"` in `fluent.css`

✱ = a standard framework key; if overridden, ready-made controls change across the whole app
Keys starting with `App*` are our own and must be referenced by hand in XAML

## Status

| Status | Dark fg / bg | Light fg / bg | CSS |
|---|---|---|---|
| Success | `#6CCB5F` / `#393D1B` | `#0F7B0F` / `#DFF6DD` | `--win-success` / `-bg` |
| Warning | `#FCE100` / `#433519` | `#9D5D00` / `#FFF4CE` | `--win-caution` / `-bg` |
| Error | `#FF99A4` / `#442726` | `#C42B1C` / `#FDE7E9` | `--win-critical` / `-bg` |
| Info | `#60CDFF` / `#2E2E2E` | `#005FB8` / `#F4F9FF` | `--win-info` / `-bg` |

> The InfoBar background in dark mode is a **neutral** tone, not a saturated colour. If a vivid colour is used as the fill,
> a single bar competes for attention with the whole page

## Type ramp (Fluent 2): never invent sizes outside this set

| Level | Size/line | Weight | CSS class | WinUI style | Use for |
|---|---|---|---|---|---|
| Caption | 12 / 16 | 400 | `.win-caption` | `CaptionTextBlockStyle` | Labels, descriptions in settings rows |
| Body | 14 / 20 | 400 | `.win-body` | `BodyTextBlockStyle` | All body text |
| Body Strong | 14 / 20 | 600 | `.win-body-strong` | `BodyStrongTextBlockStyle` | Sub-headings in cards |
| Body Large | 18 / 24 | 400 | `.win-body-large` | `BodyLargeTextBlockStyle` | Lead text |
| Subtitle | 20 / 28 | 600 | `.win-subtitle` | `SubtitleTextBlockStyle` | Group headings in a page |
| Title | 28 / 36 | 600 | `.win-title` | `TitleTextBlockStyle` | Page title (1 per page) |
| Title Large | 40 / 52 | 600 | `.win-title-large` | `TitleLargeTextBlockStyle` | Hero pages only |

Font: **Segoe UI Variable** (Text for ≤18px, Display for ≥20px)
Segoe UI Variable **has no Thai letters**, but Windows falls back to **Leelawadee UI** by itself
On web-wrapped apps you must write the fallback yourself in `font-family`

## Shape · spacing · layout

| Value | Number | Use for |
|---|---|---|
| Control corner | 4px | Button, textbox, checkbox, combo |
| Card corner | 8px | card, expander, flyout, dialog |
| Title bar | 48px | Windows 11 style (32px = classic style) |
| Window buttons | 46 × 48px | Minimise/maximise/close; never change the size |
| NavigationView open | 320px | Standard value |
| NavigationView collapsed | 48px | Icons only |
| nav menu row | 40px tall | 16px icon · 16px gap between icon and text |
| Selected-page indicator bar | 3 × 16px, 2px rounded corners | Flush left, accent colour |
| Maximum content width | 1064px | Wider than this and the eye struggles to track long lines |
| Content left/right margin | 36px | 16px when the window is ≤ 640px · an exception to the spacing scale of `ui-craft` |
| Gap between sections | 40px | An exception to the spacing scale of `ui-craft` |
| Button | 32px tall · minimum width 120px | |
| Smallest button/click target | 32 × 32px | Desktop (not the 48px of mobile) |

## Window breakpoints (Fluent breakpoints)

| Range | Name | Behaviour |
|---|---|---|
| ≤ 640px | Small | nav is an overlay · 16px margin · single column |
| 641–1007px | Medium | nav collapses to icons · the right column drops below |
| ≥ 1008px | Large | nav fully open · 2 columns |

## Icons

Use **Segoe Fluent Icons** (ships with Windows 11) at 16px in the nav, 20px in section headings,
24px in page headers, and never mix in other icon sets within the same app

| Use | Code | | Use | Code |
|---|---|---|---|---|
| Home | `E80F` | | Settings | `E713` |
| Hamburger | `E700` | | Back | `E72B` |
| Minimise / maximise / close | `E921` `E922` `E8BB` | | Refresh | `E72C` |
| Shield (security) | `EA18` | | Warning | `E7BA` |
| User | `E77B` | | History | `E81C` |
| Network | `EC05` | | Update | `E895` |

For the full list: Microsoft Learn → "Segoe Fluent Icons font"
Non-Windows machines do not have this font, so icons turn into squares; therefore a mockup meant to be
viewed on Mac/Linux must switch to inline SVG instead
