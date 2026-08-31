---
name: web-app-design
description: Use when designing or building the UI of a web application — dashboards, admin panels, internal tools, SaaS screens — in any framework (Angular, React, Vue, Svelte, or plain HTML). Provides the Apps Track design language as a working system: a token contract (colors, gradients, surfaces, type scale, layout metrics, status pills, chart colors), a drop-in appstrack.css with the full component set (app shell, cards, KPI stats, tables, forms, chips, tabs, toasts, modals), an HTML mockup template, five swappable accent themes plus light/dark sidebar, and check-design-tokens.mjs which fails CI when anyone hardcodes a color. Use it for any screen layout, dashboard, form, data table, or component styling on the web. NOT for Windows desktop apps (use windows-app-design) or documents (use branded-document-design).
---

# Web App Design

> **กฎข้อเดียว:** สีทุกสีในโค้ดคอมโพเนนต์ต้องมาจาก token
> ถ้ามี `#hex` โผล่นอกไฟล์ token แปลว่าระบบดีไซน์เริ่มพังแล้ว และมันจะพังเงียบ ๆ

## เมื่อไหร่ใช้ skill นี้

- ทำหน้าจอเว็บแอป: แดชบอร์ด, admin panel, เครื่องมือภายใน, SaaS
- ต้องการให้ทุกหน้าที่คนละคนทำออกมาหน้าตาเป็นชุดเดียวกัน
- ต้องรองรับหลายแบรนด์/หลายธีมโดยไม่แตะโค้ดคอมโพเนนต์
- ใช้ได้กับ Angular / React / Vue / Svelte / HTML เปล่า — CSS ล้วน ไม่ผูกเฟรมเวิร์ก

## เมื่อไหร่ **ไม่** ใช้

- แอปเดสก์ท็อป Windows → `windows-app-design`
- เอกสาร .docx/.pptx → `branded-document-design`
- เว็บไซต์การตลาด/landing page → ระบบนี้ออกแบบมาสำหรับ **แอป** ที่ต้องอัดข้อมูล
  ตัวหนังสือฐาน 12.5px เล็กเกินไปสำหรับหน้าขาย

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ

```
1. คัดลอก assets/mockup-template.html + assets/appstrack.css ไปไว้คู่กัน
2. แก้เนื้อหาเป็นหน้าจริงที่จะทำ (ยังไม่แตะโค้ดแอป)
3. python scripts/screenshot.py mockup.html out/ --width 1440
   python scripts/screenshot.py mockup.html out/ --width 900
   python scripts/screenshot.py mockup.html out/ --width 420
4. เปิดภาพดูจริงทุกความกว้าง แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นคอมโพเนนต์ — copy คลาสเดิม ไม่เขียน CSS ใหม่
6. ต่อ scripts/check-design-tokens.mjs เข้า CI ตั้งแต่วันแรก
```

ข้อ 6 สำคัญกว่าที่คิด — ระบบดีไซน์ที่ไม่มีเครื่องบังคับจะถูกเจือจางด้วย
"ขอ hardcode แค่ครั้งเดียว" ภายในสามสัปดาห์ และไม่มีใครรู้ตัวจนกว่าจะเปลี่ยนธีมแล้วพัง

---

## 2 · Design tokens

93 token อยู่ใน `assets/appstrack.css` บล็อก `:root` · รายละเอียดครบใน
**`references/tokens.md`** ค่าที่ต้องจำได้:

| | ค่า | |
|---|---|---|
| brand / brand-2 | `#2A78D6` / `#6A5CD6` | ไล่สี 135deg เป็น `--grad-accent` |
| พื้นหน้า / การ์ด | `#F6F7FB` / `#FFFFFF` | พื้นหน้ามี `--grad-page` ทับอีกชั้น |
| ข้อความ | `#333B4A` หัวข้อ · `#414957` เนื้อ · `#7D8492` รอง · `#A9AEB9` จาง | |
| เส้น | `#EEF0F5` ในการ์ด · `#E4E7EE` ขอบ input | |
| มุม | `14px` การ์ด · `9px` ปุ่ม/input · `99px` pill | |
| เลย์เอาต์ | sidebar `232px` · topbar `56px` · เนื้อหา `1160px` | |

**เปลี่ยนแบรนด์ทั้งแอป = แก้ 5 ค่า** (`--grad-accent --brand --brand-2 --brand-50 --brand-100`)
มีธีมสำเร็จให้แล้ว 5 ชุด: ocean (ค่าเริ่มต้น) · emerald · sunset · plum · graphite
สลับด้วย `body[data-theme]` และ sidebar สว่าง/เข้มด้วย `body[data-side='dark']`

---

## 3 · โครงหน้าจอ

```
┌──────────┬─────────────────────────────────────────────────┐
│ 232px    │ topbar 56px · โปร่ง · sticky                     │
│ sidebar  ├─────────────────────────────────────────────────┤
│          │  ชื่อหน้า h1 19px          [ปุ่มรอง] [ปุ่มหลัก]   │
│ • เมนู   │  คำอธิบาย 11.5px สีรอง                           │
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
- **หน้าละหนึ่ง h1** และมีคำอธิบายใต้มันเสมอ — หน้าที่ไม่บอกว่าตัวเองทำอะไรคือหน้าที่ยังไม่เสร็จ
- **ปุ่มหลักหนึ่งปุ่มต่อหน้า** (`.btn-primary` มี gradient + เงาแบรนด์) ที่เหลือเป็น `.btn` หรือ `.btn-ghost`
- **KPI 3–5 ใบ** เกินนั้นตัวเลขเล็กจนไม่มีพลัง
- ตัวเลขทุกตัวที่เรียงเป็นคอลัมน์ต้องมีคลาส `.num` ไม่งั้นหลักไม่ตรง

---

## 4 · คอมโพเนนต์ที่มีให้แล้ว

โครง `.app-shell/.app-sidebar/.app-topbar/.app-main` · การ์ด `.card/.card-head/.card-body` ·
KPI `.stat-grid > .card.stat` · สถานะ `.pill-*` 7 โทน · ปุ่ม 4 แบบ ·
ฟอร์ม `.field/.input/.select/.textarea` · ตาราง `.tb-wrap > .tb` ·
ตัวกรอง `.chips/.tabs` · `.prog` · `.ava` · `.md-html` · `.empty` · `.spinner` ·
`.toasts/.toast` · `.backdrop + .modal` · ยูทิลิตี `.row/.col/.grow/.ellipsis/.num`

รายการเต็มพร้อมคำอธิบายอยู่ท้าย `references/tokens.md`

**ไอคอน:** inline SVG stroke 2 ขนาด 15px ใน sidebar / 14px ในปุ่ม / 11px ใน pill
ใช้ `stroke="currentColor"` เสมอ ไอคอนจะเปลี่ยนสีตาม state ให้เอง

---

## 5 · ภาษาไทย

- `Inter` ไม่มีอักษรไทย — ต้องมี `Noto Sans Thai` ต่อท้ายใน `--font` เสมอ
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
python scripts/screenshot.py mockup.html out/ --width 1440
python scripts/screenshot.py mockup.html out/ --width 900
python scripts/screenshot.py mockup.html out/ --width 420
```

แล้วเปิดภาพดูจริง ตรวจ:

- [ ] ไม่มีสี hardcode (ตัวตรวจต้องขึ้น ✓)
- [ ] 1024px → sidebar หดเหลือไอคอน · 720px → เป็น drawer และมีปุ่มเปิด
- [ ] ตารางกว้างเกินจอเลื่อนเฉพาะในกรอบ **ไม่ใช่ทั้งหน้า** (ลากดูแนวนอนแล้ว sidebar ต้องไม่ขยับ)
- [ ] สลับครบทั้ง 5 ธีม + sidebar สว่าง/เข้ม แล้วไม่มีข้อความกลืนพื้น
- [ ] ข้อความไทยไม่ล้นปุ่ม · วรรณยุกต์ไม่ชนสระ
- [ ] คอนทราสต์ ≥ 4.5:1 (`--text-faint` บนพื้นขาวคือจุดที่เฉียดที่สุด — ใช้กับข้อความ
      ประกอบเท่านั้น ห้ามใช้กับข้อมูลที่ต้องอ่าน)
- [ ] เดินด้วย Tab ได้ครบและเห็นวงแหวนโฟกัสทุกจุด
- [ ] มี empty state ทุกที่ที่รายการอาจว่าง (`.empty`) และ loading ทุกที่ที่ต้องรอ (`.spinner`)

---

## 7 · Anti-patterns

- ❌ **`#hex` ในไฟล์คอมโพเนนต์** — ต้นเหตุอันดับหนึ่งของธีมพัง ให้ตัวตรวจจับไว้
- ❌ **gradient บนกราฟ** — ค่าสีต้องคงที่ ไม่งั้นตาอ่านค่าผิด ใช้ `--c-*` ทึบ
- ❌ **เงาหนา ๆ ใต้ทุกอย่าง** — ระบบนี้ใช้เงาบางมากสองชั้น เงาลึก (`--shadow-lg`)
  สงวนไว้ให้ modal/toast/เมนูลอยเท่านั้น
- ❌ **ปุ่มหลักหลายปุ่มในหน้าเดียว** — ผู้ใช้ไม่รู้ว่าต้องกดอะไร
- ❌ **`overflow-x` ที่ `<body>`** เพื่อแก้ตารางล้น — ต้องแก้ที่ `.tb-wrap`
- ❌ **`alert()` / `confirm()`** — ใช้ `.toast` และ `.modal`
- ❌ **สร้างขนาดตัวอักษรใหม่** นอกสเกล 10.5/11/12/12.5/13/15/19/22
- ❌ **`.modal` ที่ไม่ตั้ง `position`** — จะจมอยู่ใต้ `.backdrop` แล้วคลิกอะไรไม่ได้เลย
  (มีคอมเมนต์อธิบายไว้ใน CSS แล้ว อย่าลบ)
- ❌ **ส่ง mockup โดยไม่เคยเรนเดอร์ดู**

---

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / IA ก่อนลงสี | agent `ux-designer` |
| แอปเดสก์ท็อป Windows โทนเดียวกัน | `windows-app-design` |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| ไดอะแกรมประกอบ spec | `markdown-visuals` |
