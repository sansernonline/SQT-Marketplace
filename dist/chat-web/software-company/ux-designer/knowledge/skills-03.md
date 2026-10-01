# skill: mobile-app-design

Use when designing or building a phone app user interface for a progressive web app, a web-wrapped app, React Native or Flutter. Ships a token contract, a four-family typography system, a phone-frame mockup template, safe-area handling, Thai-English font switching and a render-and-look loop at real phone sizes. Not for desktop or Windows.

# Mobile App Design

> **กฎข้อเดียว:** หน้าจอมือถือมีที่ให้แสดงน้อยกว่าที่คุณคิดครึ่งหนึ่ง
> ทุกอย่างที่ไม่ใช่เนื้อหาต้องเงียบลงจนแทบมองไม่เห็น

## เมื่อไหร่ใช้ skill นี้

- ทำหน้าจอแอปมือถือ: รายการเนื้อหา, บทสนทนา/แชท, หน้าสรุปผล, ตั้งค่า, onboarding
- PWA · เว็บที่ห่อเป็นแอป (Capacitor / Cordova / WebView) · React Native · Flutter
- แอปที่มีเนื้อหาให้อ่านเยอะ — เรียนภาษา, อ่านบทความ, คอร์สออนไลน์
- ต้องรองรับไทย–อังกฤษปนกัน

## เมื่อไหร่ **ไม่** ใช้

- เว็บแอปบนเดสก์ท็อป (แดชบอร์ด/admin) → `web-app-design`
- แอปเดสก์ท็อป Windows → `windows-app-design`
- เอกสาร .docx/.pptx → `branded-document-design`

---

## 1 · ลำดับการทำงาน — mockup ก่อนเสมอ

```
1. คัดลอก assets/mockup-template.html + assets/speakgo.css ไปไว้คู่กัน
2. แก้เนื้อหาให้เป็นหน้าจริง (ยังไม่แตะโค้ดแอป)
3. python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
   python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android
   python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max
4. เปิดภาพดูจริงทุกขนาด แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นโค้ดจริง — ใช้ token ชุดเดิม ไม่ออกแบบใหม่
```

เปิด mockup บนจอคอมกว้างกว่า 560px จะเห็นเป็น **กรอบเครื่องลอยบนพื้นเข้ม**
ส่งลิงก์ให้ลูกค้าดูได้เลยโดยไม่ต้องอธิบายว่านี่คือหน้าจอมือถือ

---

## 2 · Design tokens

> **สีมาจากเนื้องาน — ถามก่อนเริ่ม**
> มีสีแบรนด์อยู่แล้วใช้สีนั้น · ยังไม่มีให้เสนอโทนจากเนื้องานแล้วรอยืนยัน
> (ตารางเนื้องาน → โทน อยู่ใน `svg-diagram-system` ข้อ 0)

อยู่ครบใน `assets/speakgo.css` · ตารางเต็มใน **`references/tokens.md`**

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| พื้นหน้าจอ / การ์ด | พื้นเป็น**เทาอ่อน ไม่ใช่ขาว** การ์ดจะได้ลอยขึ้นมาโดยไม่ต้องมีเงา | เทาอ่อนมาก / ขาว |
| ข้อความ 3 ระดับ | หลัก · รอง · จาง | เข้ม → อ่อน · หลัก contrast ≥ 4.5:1 |
| `--accent` | แท็บที่เลือก · ความคืบหน้า · ปุ่มหลัก | **สีหลักที่ผู้ใช้เลือก** |
| ไทล์ไล่สี | ปลายสองข้างของ gradient | สีหลัก → เพื่อนบ้านบนวงล้อสี |
| สีบอกสถานะของเนื้อหา | ต้องแก้ · คำใบ้ · ถูกใจ — **มีสีพื้นอ่อนคู่กันทุกตัว** | ตามความหมาย ไม่ตามแบรนด์ |

**สีที่บอกสถานะไม่เปลี่ยนตามแบรนด์** — แดงคือจุดที่ต้องแก้ ไม่ว่าแบรนด์จะเป็นสีอะไร
ถ้าสีแบรนด์ชนกับสีสถานะ ให้เลี่ยงการใช้แบรนด์ในบริบทนั้น ไม่ใช่เปลี่ยนสีสถานะ

**ชื่อ token ตั้งตามหน้าที่ ไม่ใช่ตามสี** — `--repair` ไม่ใช่ `--red`
วันที่เปลี่ยนใจว่าจุดที่ต้องแก้ควรเป็นสีส้ม แก้ค่าเดียวโดยชื่อยังถูกอยู่

`assets/speakgo.css` มาพร้อมชุดสีหนึ่งชุดเป็น**ตัวอย่างที่ประกอบครบแล้ว** ไม่ใช่ค่ามาตรฐาน
เปลี่ยนค่าใน `:root` ให้ตรงกับเนื้องานก่อนทำ mockup แรก

---

## 3 · ฟอนต์ 4 ตระกูล — หัวใจของระบบนี้

| Token | ฟอนต์ | หน้าที่ |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | ปุ่ม เมนู ป้าย ชื่อหน้า — ทุกอย่างที่เป็น "แอป" |
| `--dis` | Space Grotesk | ตัวเลขใหญ่ — คะแนน สถิติ |
| `--text` | Source Serif 4 | เนื้อหาที่ผู้ใช้ต้อง **อ่าน** — บับเบิล ประโยคตัวอย่าง |
| `--mono` | system mono | ป้ายกำกับพิมพ์ใหญ่ + `letter-spacing:.14em` — META · LEVEL · TURN 5/12 |

**อย่ายุบให้เหลือตระกูลเดียว** — การแยกฟอนต์ทำให้ผู้ใช้แยก "สิ่งที่แอปพูด"
ออกจาก "ปุ่มของแอป" ได้ทันทีโดยไม่ต้องพึ่งสี ซึ่งสำคัญมากบนจอเล็ก

`body[data-lang="en"]` สลับ `--ui` เป็น Space Grotesk เมื่อ UI เป็นอังกฤษล้วน

---

## 4 · โครงหน้าจอ

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

กฎที่คนทำเว็บมาทำมือถือมักพลาด:

- **`100dvh` ไม่ใช่ `100vh`** — `vh` ไม่หดตามแถบที่อยู่ เนื้อหาท่อนล่างจะโดนบัง
- **`env(safe-area-inset-*)`** ที่ appbar/tabbar/dock + `viewport-fit=cover` ใน meta viewport
  ไม่งั้นชนรอยบากบนและ home indicator ล่าง
- **เลื่อนที่ `.screen` ไม่ใช่ที่ `body`** — `body{overflow:hidden}` แถบบน/ล่างจะได้อยู่นิ่ง
- **ไม่มี hover บนมือถือ** — สถานะที่ผู้ใช้เห็นได้มีแค่ `:active` ทุกอย่างที่กดได้ต้องยุบ
  (`transform:scale(.98)`) และตั้ง `-webkit-tap-highlight-color:transparent`
- **เป้าแตะ ≥ 44×44px** (แนวทาง Apple) — ปุ่มไอคอน 38px ต้องมี padding รอบให้ถึง 44
- **แท็บล่าง 3–5 อัน** เกินนั้นนิ้วโป้งเอื้อมไม่ถึงและป้ายจะตัดคำ

---

## 5 · คอมโพเนนต์ที่มีให้แล้ว

| กลุ่ม | คลาสหลัก |
|---|---|
| รายการ | `.tile` (ไทล์ไล่สี) · `.card` · `.sg` (แถว + แถบความคืบหน้า) · `.heart` · `.lvl` |
| ตัวควบคุม | `.chips/.chip` · `.lvlchip` · `.cta` · `.outline` · `.seg` · `.iconbtn` |
| ตั้งค่า | `.group > .r2 / .rcol` (การ์ดเดียว แถวคั่นด้วยเส้น แบบ iOS) |
| สนทนา | `.turn.ai/.me > .bub` · `.repair` (`del`/`ins`) · `.hintbox` · `.acts/.actbtn` · `.dots` |
| แถบไมค์ | `.dock` · `#mic(.live/.busy)` · `.typerow` · `#interim` |
| สรุปผล | `.score` · `.mini` · `.bar` · `.verdict` · `.wk` · `.stat` |

**บับเบิลสนทนา:** มุม 18px ทุกด้าน ยกเว้นมุมที่ชี้เข้าหาผู้พูดเหลือ **5px** —
บอกว่าใครพูดโดยไม่ต้องวาดหางบับเบิล

**กล่องแก้ไข (`.repair`):** ใช้ `<del>` ขีดฆ่า + `<ins>` ขีดเส้นใต้ —
สื่อความหมายได้แม้ผู้ใช้ตาบอดสี ห้ามใช้สีอย่างเดียว

---

## 6 · ภาษาไทยบนจอเล็ก

- **IBM Plex Sans Thai** วรรณยุกต์ไม่ชนสระที่ขนาดเล็ก และมีน้ำหนัก 400–700 ครบ
- ระยะบรรทัด **1.5–1.75** — ไทยต้องการมากกว่าอังกฤษ ยิ่งจอเล็กยิ่งต้องหายใจ
- **ห้าม `text-transform:uppercase` กับข้อความไทย** — ไม่มีผลกับตัวไทย แต่
  `letter-spacing` ที่มักมาคู่กันจะดันวรรณยุกต์เพี้ยน ป้าย mono ใช้กับอังกฤษเท่านั้น
- ปุ่มไทยกว้างกว่าอังกฤษ ~20% — อย่า fix ความกว้างปุ่ม ให้ปุ่มหลักเต็มความกว้างไปเลย
- ทดสอบด้วยข้อความไทยจริง ไม่ใช่ Lorem ipsum

---

## 7 · ตรวจงาน

```bash
# 1. หน้าตาถูกทุกขนาดจอไหม
python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android เล็ก
python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max

# 2. ระบบดีไซน์ยังสะอาดอยู่ไหม (ใช้ตัวตรวจของ web-app-design ได้เลย
#    แต่ต้องส่ง --require เป็น token ชุดของระบบนี้ ไม่ใช่ชุดของเว็บ)
node ../web-app-design/scripts/check-design-tokens.mjs src/theme.css src/app \
  --require "--bg,--surface,--ink,--soft,--faint,--line,--signal,--repair,--hint,--ui,--dis,--text,--mono,--r-tile,--r-card,--app-max,--gutter"
```

> ข้อยกเว้นเดียวที่ยอมให้มีสีดิบ: `<meta name="theme-color">` ใน `index.html` —
> เบราว์เซอร์อ่าน meta ก่อน CSS โหลด จึงใช้ `var()` ไม่ได้

เปิดภาพดูจริง ตรวจ:

- [ ] แถบบน/ล่างไม่โดนรอยบากหรือ home indicator ทับ
- [ ] เลื่อนแล้วแถบบน/ล่างอยู่นิ่ง ไม่เลื่อนตาม
- [ ] จอ 360px (Android เล็ก) ป้ายแท็บไม่ตัดคำ · ไทล์ไม่ล้น
- [ ] ปุ่มทุกอันแตะได้จริง ≥ 44×44px
- [ ] ข้อความไทยไม่ล้นปุ่ม วรรณยุกต์ไม่ชนสระ
- [ ] คอนทราสต์ ≥ 4.5:1 (`--faint` บนพื้นขาวคือจุดที่เฉียดสุด — ใช้กับข้อความประกอบเท่านั้น)
- [ ] มี empty state (`.blank`) ทุกที่ที่รายการอาจว่าง
- [ ] สลับทั้งธีมเรียบและธีมไล่สีแล้วไม่มีข้อความกลืนพื้น
- [ ] ทางเลือก "พิมพ์แทนพูด" ยังอยู่ (ผู้ใช้อาจอยู่ในที่ที่พูดไม่ได้)

---

## 8 · Anti-patterns

- ❌ **`100vh`** — ใช้ `100dvh`
- ❌ **ลืม `env(safe-area-inset-*)`** หรือลืม `viewport-fit=cover`
- ❌ **ยัด 6+ แท็บในแถบล่าง** — 3–5 พอ ที่เหลือไปอยู่ในหน้า "เพิ่มเติม"
- ❌ **modal เล็ก ๆ สำหรับงานที่ใช้เวลานาน** — ใช้ `.overlay` เต็มจอ
- ❌ **ยุบฟอนต์เหลือตระกูลเดียว** — เสียกลไกแยกเนื้อหาออกจาก chrome
- ❌ **ไล่สีหลังข้อความยาว** — ไล่สีอยู่บน chrome และปุ่มหลักเท่านั้น
- ❌ **พึ่งสีอย่างเดียวบอกความหมาย** — `del`/`ins` มีรูปแบบขีดของตัวเองอยู่แล้ว
- ❌ **ไม่มี `:active` feedback** — มือถือไม่มี hover ถ้ากดแล้วไม่ขยับ ผู้ใช้จะกดซ้ำ
- ❌ **ส่ง mockup โดยไม่เคยเรนเดอร์ดูที่ขนาดจริง**

---

## 9 · ข้อจำกัดที่ต้องรู้

- ค่าทั้งหมด **ตรวจแล้วบน HTML/CSS** — ตาราง React Native / Flutter ใน
  `references/tokens.md` เป็นการเทียบกลไก **ยังไม่ได้ build ทดสอบ**
  ค่าโอนได้ตรง ๆ แต่ให้ดูหน้าจอจริงบนเครื่องอีกรอบ
- ฟอนต์โหลดจาก Google Fonts ใน mockup — แอปจริงควร bundle ไฟล์ฟอนต์ไปเลย
  ไม่งั้นเปิดครั้งแรกตอนเน็ตช้าจะเห็นฟอนต์ระบบก่อนแล้วค่อยกระตุก
- ระบบนี้ออกแบบมาสำหรับ **โหมดสว่าง** ถ้าต้องมีโหมดมืดต้องเพิ่มชุด token ใหม่
  (พื้น `--bg`/`--surface` สลับลำดับ และ `--ink` ต้องไม่ใช่ขาวสนิท)

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| user flow / IA ก่อนลงสี | agent `ux-designer` |
| เว็บแอปเดสก์ท็อปของระบบเดียวกัน | `web-app-design` |
| ตัวตรวจ hardcode สีใน CI | `web-app-design` → `scripts/check-design-tokens.mjs` |
| เอกสาร spec ของหน้าจอ | `polished-document-style` + `branded-document-design` |
| App Store Optimization | `software-company-mobile` → `app-store-optimization` |
| กฎระยะห่าง ลำดับสายตา และ 5 สถานะของหน้าจอ | `ui-craft` |
| ไดอะแกรมสถาปัตยกรรม | `software-diagrams` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`


## reference: tokens.md

# Token reference — ระบบดีไซน์แอปมือถือสไตล์ Speak Go

> ⚠️ **ค่าสีในไฟล์นี้เป็นตัวอย่างที่ประกอบครบแล้ว ไม่ใช่ค่ามาตรฐาน**
> เลือกสีจากเนื้องานก่อนเสมอ (ดูข้อ "สีมาจากเนื้องาน" ใน `SKILL.md`)
> สิ่งที่ให้ยึดจากไฟล์นี้คือ **รายชื่อ token และหน้าที่ของมัน** ไม่ใช่ค่าสี
> ขนาด ระยะ มุม และ breakpoint เป็นค่าคงที่ — พวกนั้นคัดลอกไปใช้ได้เลย

นิยามทั้งหมดอยู่ใน `assets/speakgo.css` บล็อก `:root`
**ทุกอย่างใต้บรรทัด `=== base ===` ห้ามมีสีดิบ** — ใช้ตัวตรวจตัวเดียวกับ `web-app-design` ได้

## สารบัญ

1. [สี](#สี)
2. [ฟอนต์ — 4 ตระกูล 4 หน้าที่](#ฟอนต์--4-ตระกูล-4-หน้าที่)
3. [สเกลตัวอักษร](#สเกลตัวอักษร)
4. [รูปทรง](#รูปทรง)
5. [เลย์เอาต์และ safe area](#เลย์เอาต์และ-safe-area)
6. [ธีม](#ธีม)
7. [ย้ายไปสแต็กอื่น](#ย้ายไปสแต็กอื่น)
8. [คลาสที่มีให้แล้ว](#คลาสที่มีให้แล้ว)

---

## สี

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--bg` | `#F2F4F6` | พื้นหน้าจอ — เทาอ่อน ไม่ใช่ขาว การ์ดจะได้ลอยขึ้นมา |
| `--surface` | `#FFF` | การ์ด · แถบล่าง · ช่องกรอก |
| `--ink` | `#131A21` | ข้อความหลัก · พื้นปุ่มหลัก · บับเบิลของผู้ใช้ |
| `--soft` | `#66727E` | ข้อความรอง · คำอธิบาย |
| `--faint` | `#98A3AD` | ป้ายกำกับ · meta · ไอคอนที่ไม่ active |
| `--line` | `#E2E7EB` | เส้นขอบ · รางแถบความคืบหน้า |
| `--signal` | `#0E7C86` | แท็บที่เลือก · ความคืบหน้า · ไมค์ตอนอัด |
| `--signal-soft` | `#E3F1F2` | พื้นป้ายระดับ |
| `--repair` / `-bg` | `#C0392B` / `#FBEDEB` | จุดที่ต้องแก้ |
| `--hint` / `-bg` | `#8A6D1F` / `#FBF4E3` | คำใบ้ |
| `--fav` | `#D9455F` | หัวใจ / ถูกใจ |
| `--tile1` → `--tile2` | `#0B7076` → `#4338A8` | ไล่สีบนไทล์หมวดหมู่ |

> ชื่อ token ตั้งตาม **หน้าที่** ไม่ใช่ตามสี — `--repair` ไม่ใช่ `--red`
> พอเปลี่ยนใจว่า "จุดที่ต้องแก้" ควรเป็นสีส้ม ก็แก้ที่เดียวโดยชื่อยังถูกอยู่

## ฟอนต์ — 4 ตระกูล 4 หน้าที่

นี่คือสิ่งที่ทำให้ระบบนี้ต่างจากแอปทั่วไป **อย่ายุบให้เหลือตระกูลเดียว**

| Token | ฟอนต์ | ใช้กับ |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | ส่วนควบคุมทั้งหมด — ปุ่ม เมนู ป้าย ชื่อหน้า |
| `--dis` | Space Grotesk | ตัวเลขใหญ่ — คะแนน สถิติ (`.score b`, `.mini b`, `.stat b`) |
| `--text` | Source Serif 4 | เนื้อหาที่ผู้ใช้ต้อง **อ่าน** — บับเบิล ประโยคตัวอย่าง |
| `--mono` | system mono | ป้ายกำกับตัวพิมพ์ใหญ่ + `letter-spacing:.14em` — META, LEVEL, TURN 5/12 |

`body[data-lang="en"]` สลับ `--ui` เป็น Space Grotesk
(IBM Plex Sans Thai มีอักษรละตินแต่หน้าตาไม่คมเท่าเมื่อไม่มีไทยปน)

**ทำไม serif กับบับเบิล:** เนื้อหาที่ต้องอ่านยาวและอ่านซ้ำ serif ช่วยแยกตัวอักษรได้ดีกว่า
และแยก "สิ่งที่แอปพูด" ออกจาก "ปุ่มของแอป" ได้ทันทีโดยไม่ต้องใช้สี

## สเกลตัวอักษร

| ขนาด | ตระกูล | ใช้กับ |
|---|---|---|
| 60 / 44 | dis | คะแนนใหญ่ · verdict |
| 24 | ui 700 | ชื่อหน้าใน appbar |
| 19–24 | dis 700 | ตัวเลขสถิติ |
| 17 | text | บับเบิลสนทนา |
| 15.5–16 | text | ประโยคตัวอย่าง · กล่องแก้ไข |
| 16 | ui 600 | ชื่อรายการในการ์ด |
| 15 | ui | ช่องกรอก · ปุ่มหลัก |
| 13–14 | ui | เนื้อความ · ปุ่มรอง |
| 11–12 | ui | คำอธิบาย · ป้ายกำกับ |
| 9–10 | mono uppercase | meta · LEVEL · ชื่อผู้พูด |

## รูปทรง

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--r-tile` | 16px | ไทล์ · การ์ดสถิติ · ปุ่ม CTA |
| `--r-card` | 18px | การ์ดรายการ · บับเบิล · กล่องใหญ่ |
| `--r-field` | 13px | ช่องกรอก · ปุ่ม outline |
| `--r-pill` | 22px | ชิป · ช่องค้นหา |
| — | 50% | ปุ่มไอคอน · หัวใจ · ไมค์ |

**บับเบิลสนทนา** ใช้ 18px ทุกมุม **ยกเว้น** มุมที่ชี้เข้าหาผู้พูดเหลือ **5px**
(`border-bottom-left-radius` ฝั่ง AI · `border-bottom-right-radius` ฝั่งผู้ใช้)
เป็นสัญญาณว่าใครพูดโดยไม่ต้องวาดหางบับเบิล

## เลย์เอาต์และ safe area

| ค่า | ตัวเลข |
|---|---|
| ความกว้างแอปสูงสุด | 430px (iPhone Pro Max) |
| ขอบซ้าย/ขวา | 16px (`--gutter`) · หน้าสรุปผลใช้ 18px |
| ปุ่มไมค์ | 66px |
| ปุ่มไอคอน | 38px |
| ไทล์ | สูงต่ำสุด 118px · 2 คอลัมน์ gap 9px |
| แถบแท็บ | ไอคอน 22px + ป้าย 10px |

**safe area — ห้ามลืม** ไม่งั้นชนรอยบากบน / home indicator ล่าง:

```css
.appbar  { padding-top:    calc(14px + env(safe-area-inset-top)); }
.tabbar  { padding-bottom: calc(8px  + env(safe-area-inset-bottom)); }
.dock    { padding-bottom: calc(14px + env(safe-area-inset-bottom)); }
```
และต้องมี `<meta name="viewport" content="…,viewport-fit=cover">` ไม่งั้น `env()` เป็น 0

ใช้ **`100dvh`** ไม่ใช่ `100vh` — `vh` ไม่หดตามแถบที่อยู่ของเบราว์เซอร์บนมือถือ
เนื้อหาท่อนล่างจะโดนบัง

## ธีม

| ธีม | เปิดด้วย | ต่างกันตรงไหน |
|---|---|---|
| เรียบ (ค่าเริ่มต้น) | — | chrome ขาว/เทา accent เขียวน้ำทะเล |
| ไล่สี | `body[data-theme="grad"]` | appbar/ovbar/CTA/ไมค์/บับเบิลผู้ใช้เป็นไล่สี · `--signal` เปลี่ยนเป็นม่วง · คะแนนเป็นตัวอักษรไล่สี |

**กฎของธีมไล่สี:** ไล่สีอยู่บน **chrome และปุ่มหลัก** เท่านั้น พื้นที่เนื้อหายังเรียบเสมอ
ถ้าไล่สีไปอยู่หลังข้อความยาว จะอ่านยากและคอนทราสต์ควบคุมไม่ได้

## ย้ายไปสแต็กอื่น

CSS คือต้นฉบับ ค่าเดียวกันใช้ได้ทุกที่ — ที่ต้องระวังคือกลไก ไม่ใช่ตัวเลข

| เรื่อง | React Native | Flutter |
|---|---|---|
| token | ไฟล์ `tokens.ts` เป็น object แล้ว import (ไม่มี CSS variable) | `ThemeExtension` หรือ class `AppTokens` ค่าคงที่ |
| safe area | `react-native-safe-area-context` → `useSafeAreaInsets()` | `SafeArea` / `MediaQuery.padding` |
| ฟอนต์ | ต้อง link ไฟล์ฟอนต์เข้าโปรเจกต์ ไม่มี fallback อัตโนมัติ | `pubspec.yaml` → `fontFamily` |
| ไล่สี | `expo-linear-gradient` | `BoxDecoration(gradient: LinearGradient(...))` |
| เงา | `shadowColor/Offset/Opacity/Radius` (iOS) + `elevation` (Android) | `BoxShadow` |
| มุมไม่เท่ากัน | `borderBottomLeftRadius` ฯลฯ | `BorderRadius.only(...)` |
| กดแล้วยุบ | `Pressable` + `Animated.spring` scale .98 | `InkWell` / `AnimatedScale` |
| ตัวเลขเรียงหลัก | `fontVariant: ['tabular-nums']` | `FontFeature.tabularFigures()` |

> **ข้อจำกัดที่ต้องรู้:** ตัวเลขในตารางนี้ตรวจแล้วบน HTML/CSS เท่านั้น
> ส่วน RN/Flutter เป็นการเทียบกลไก **ยังไม่ได้ build ทดสอบ** — ค่าโอนได้ แต่ให้ตรวจหน้าตาจริงบนเครื่องอีกรอบ

## คลาสที่มีให้แล้ว

| กลุ่ม | คลาส |
|---|---|
| โครง | `#app` `.appbar` `.screen(.on)` `.tabbar > .tab(.on)` `.overlay(.on)` `.ovbar` |
| รายการ | `.tiles > .tile` `.card` `.sg` `.heart(.on)` `.lvl` `.grouphead` `.welcome` `.blank` |
| ตัวควบคุม | `.chips > .chip(.on)` `.lvlchip(.on)` `#search` `.iconbtn` `.cta(.alt)` `.outline(.danger)` `.seg > button(.on)` |
| ตั้งค่า | `.sect` `.group > .r2 / .rcol` |
| สนทนา | `#thread` `.turn(.ai/.me)` `.who` `.bub(.masked)` `.repair` `del` `ins` `.note` `.tag` `.clean` `.hintbox` `.acts > .actbtn(.hintb)` `.sys` `.dots` |
| แถบไมค์ | `.dock` `#interim` `.dockrow` `#mic(.live/.busy)` `.typerow(.on)` `.txtbtn` |
| สรุปผล | `.report` `.score` `.mini` `.bar` `.verdict` `.wk` `.stat` `.g4` `.drillrow` `.fixrow` `.dnote` |


---

# skill: windows-app-design

Use when designing or building a desktop app that must look like a native Windows 11 app — WinUI 3, Avalonia, .NET MAUI or a web-wrapped shell. Ships the Fluent 2 tokens measured from real Windows 11, a drop-in stylesheet, matching resource dictionaries and a render-and-look loop. Not for web sites or mobile apps.

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
3. python scripts/screenshot.py mockup.html _to_delete/screenshots/     → ได้ภาพ dark + light
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

> **ค่ากลาง (พื้น ข้อความ เส้น เงา) คือ Fluent 2 ที่วัดจาก Windows 11 จริง — ห้ามคิดเอง ห้ามปรับให้สวยขึ้น**
> แอปที่สีกลางไม่ตรงกับระบบปฏิบัติการ จะดูเหมือนของแปลกปลอมทันทีที่วางข้างแอปอื่น
>
> **สีที่เปลี่ยนตามงานมีแค่ accent** — ใช้สีแบรนด์ของลูกค้า หรือเสนอโทนจากเนื้องานแล้วรอยืนยัน
> (ตารางเนื้องาน → โทน อยู่ใน `svg-diagram-system` ข้อ 0)
> ค่า accent ในตารางข้างบนคือค่าเริ่มต้นของ Windows ซึ่งเป็นตัวเลือกที่ปลอดภัยเมื่อยังไม่มีแบรนด์
> **ไม่ใช่ค่าที่ต้องใช้** · accent ต้องผ่าน contrast ≥ 4.5:1 ทั้งโหมดมืดและสว่าง จึงมักต้องมีคนละค่าต่อโหมด

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
python scripts/screenshot.py mockup.html _to_delete/screenshots/                 # 1440px = Large
python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 900     # Medium
python scripts/screenshot.py mockup.html _to_delete/screenshots/ --width 600     # Small
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
| กฎระยะห่าง ลำดับสายตา และ 5 สถานะของหน้าจอ | `ui-craft` |
| ไดอะแกรมสถาปัตยกรรม | `software-diagrams` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`


## reference: tokens.md

# Token map — ค่าเดียวกัน สามสแต็ก

> **ค่ากลาง (พื้น ข้อความ เส้น เงา ขนาด ระยะ) คือ Fluent 2 ที่วัดจาก Windows 11 จริง — คัดลอกไปใช้ได้เลย ห้ามปรับเอง**
> **`accent` เป็นสีเดียวที่เปลี่ยนตามงาน** — ใช้สีแบรนด์ของลูกค้า หรือเสนอโทนจากเนื้องานแล้วรอยืนยัน
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
