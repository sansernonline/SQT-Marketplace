---
name: mobile-app-design
description: Use when designing or building a phone app UI — screens, bottom tab bars, conversation and chat interfaces, lesson or content lists, result and report screens, settings, onboarding — for a PWA, a web-wrapped app (Capacitor, Cordova, WebView), React Native, or Flutter. Provides the Speak Go design language as a working system: a function-named token contract, a four-family typography system where UI chrome, big numbers, readable content and meta labels each get their own font, a phone-frame HTML mockup template with tab bar and full-screen task overlay, safe-area and 100dvh handling, a plain and a gradient theme, Thai-English bilingual font switching, and a render-and-look verification loop at real phone sizes. NOT for desktop web apps (use web-app-design) or Windows apps (use windows-app-design).
---

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
3. python scripts/screenshot.py mockup.html out/ --width 390 --height 844   # iPhone
   python scripts/screenshot.py mockup.html out/ --width 360 --height 800   # Android
   python scripts/screenshot.py mockup.html out/ --width 430 --height 932   # Pro Max
4. เปิดภาพดูจริงทุกขนาด แก้จนพอใจ แล้วค่อยให้คนอื่นรีวิว
5. อนุมัติแล้วจึงแปลงเป็นโค้ดจริง — ใช้ token ชุดเดิม ไม่ออกแบบใหม่
```

เปิด mockup บนจอคอมกว้างกว่า 560px จะเห็นเป็น **กรอบเครื่องลอยบนพื้นเข้ม**
ส่งลิงก์ให้ลูกค้าดูได้เลยโดยไม่ต้องอธิบายว่านี่คือหน้าจอมือถือ

---

## 2 · Design tokens

อยู่ครบใน `assets/speakgo.css` · ตารางเต็มใน **`references/tokens.md`**

| | ค่า | |
|---|---|---|
| พื้นหน้าจอ / การ์ด | `#F2F4F6` / `#FFF` | พื้นเป็นเทาอ่อน ไม่ใช่ขาว การ์ดจะได้ลอย |
| ข้อความ | `#131A21` หลัก · `#66727E` รอง · `#98A3AD` จาง | |
| accent | `#0E7C86` | แท็บที่เลือก · ความคืบหน้า · ไมค์ตอนอัด |
| ต้องแก้ / คำใบ้ / ถูกใจ | `#C0392B` / `#8A6D1F` / `#D9455F` | มีสีพื้นอ่อนคู่กันทุกตัว |
| ไทล์ | ไล่ `#0B7076` → `#4338A8` | |

**ชื่อ token ตั้งตามหน้าที่ ไม่ใช่ตามสี** — `--repair` ไม่ใช่ `--red`
วันที่เปลี่ยนใจว่าจุดที่ต้องแก้ควรเป็นสีส้ม แก้ค่าเดียวโดยชื่อยังถูกอยู่

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
python scripts/screenshot.py mockup.html out/ --width 390 --height 844   # iPhone
python scripts/screenshot.py mockup.html out/ --width 360 --height 800   # Android เล็ก
python scripts/screenshot.py mockup.html out/ --width 430 --height 932   # Pro Max

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
