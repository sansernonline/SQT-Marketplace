---
name: dynamic-website
description: Use when a marketing, event or showcase website needs chapter-by-chapter motion (GSAP, scroll, 3D background). Not an app, not a slide deck.
---

# Dynamic Website

> **ภาษา:** ถ้อยคำทุกบรรทัดตาม `human-writing` · หน้าตาและระยะตาม `ui-craft` — skill นี้บอกวิธีทำให้เว็บ "เล่าเรื่องทีละบท" เคลื่อนไหวได้โดยไม่ทำให้คนอ่านเวียนหัว

> **กฎข้อเดียวของ skill นี้:** การเคลื่อนไหวทุกชิ้นผ่านประตูเดียว (`T()` ใน JS + kill-switch ใน CSS) และ**แต่ละบทมีทางเข้าของตัวเอง** — fade-up ซ้ำทุกจุดคือสัญญาณ AI อันดับ 1 ของเว็บแบบนี้

ต้นแบบคือเว็บ ai4ba.ai-cie.com (อ่านโค้ดสาธารณะ 2026-10-22 · ไม่มี licence ระบุ → recipe ทุกตัวเขียนใหม่ในรูปของเรา เก็บเฉพาะแนวคิดและประโยคไทยของผู้เขียนในเครื่องหมาย «…») · ตัวอย่างที่เปิดได้จริง: `assets/example-deck.html` · โค้ดพร้อมคัดลอก: `references/recipes.md`

## เมื่อไหร่ใช้

- เว็บการตลาด · หน้างานสัมมนา · หน้าเปิดตัวสินค้า · หน้า "เกี่ยวกับเรา" ที่อยากให้คนอ่านไล่เป็นบท ๆ
- หน้าเดียวที่มี 3–7 บทเต็มจอ เปลี่ยนด้วยล้อเมาส์ คีย์บอร์ด หรือปัดจอ (deck-mode) หรือหน้าเลื่อนปกติที่เนื้อหาโผล่เมื่อเลื่อนมาถึง (page-mode)
- มีพื้นหลังที่ "มีความหมาย" (เครือข่ายคน · เส้นทางกำหนดการ · แผนที่) ที่กล้องเคลื่อนตามบท

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ |
|---|---|
| แดชบอร์ด · หน้าแอดมิน · เครื่องมือภายใน · SaaS — ผู้ใช้ต้องทำงาน ไม่ใช่ดูเรื่อง | `web-app-design` + `ui-craft` (งบการเคลื่อนไหว ≤ 350 ms) |
| สไลด์นำเสนอที่คนพูดกดเปลี่ยนหน้า มีโน้ตผู้พูด | `html-slide-deck` |
| โครงเรื่องยังไม่มี — ยังไม่รู้ว่าบทไหนพูดอะไร | `presentation-design` ข้อ 1–3 ก่อน แล้วค่อยกลับมา |
| คลิปเคลื่อนไหวหรือโลโก้ขยับ ไม่ใช่หน้าเว็บ | `motion-basics` (plugin `graphic-design`) |

---

## 1 · โครง

```
hashchange → route()
   │ #view.out 180 ms → cleanup() ← cleanups[] (Observer.kill · ถอด wheel/keydown · clearInterval · ยกเลิก rAF)
   ├─ hash เป็นชื่อบท → deck-mode: body.deck-mode → goChapter(j): [ออกบทเดิม]→ซ่อน→[กล้องบิน]→โชว์→[เข้าบทใหม่]
   │                                   rail · คีย์บอร์ด · wheel · Observer (touch) · history.replaceState
   └─ อื่น ๆ ────────→ page-mode: body.page-mode → IntersectionObserver ติด .in · พื้นหลังหรี่เหลือ .22
getWorld(): รอ renderer หนักไม่เกิน 4 วินาที → WebGL ได้? → three.js (กล้องเป็น object ที่ GSAP tween) · ไม่ได้ → body.no-webgl + เครือข่าย 2D canvas
```

| ส่วน | ทำอย่างไร |
|---|---|
| 2 โหมด | **deck-mode** บทซ้อนกัน `position:absolute; visibility:hidden` เห็นเฉพาะ `.on` · **page-mode** หน้าเลื่อนปกติ ใช้ reveal ข้อ 8 ของ recipes · เว็บหนึ่งมีได้ทั้ง 2 โหมด (บทเล่าเรื่อง = deck · ลงทะเบียน ชำระเงิน แอดมิน = page) |
| hash router | ฟังก์ชันเดียว `route()` บน `hashchange` · เปลี่ยนบทใช้ `replaceState` (ปุ่ม Back ไม่เต็มไปด้วยบท) · เปลี่ยนหน้าใช้ hash ปกติ |
| cleanup list | ทุก view ดันฟังก์ชันถอดของตัวเองลง `cleanups[]` · `route()` ล้างทั้งหมดก่อน render view ใหม่ — ไม่มี listener ค้าง ไม่มี timer รั่ว |
| มาร์กอัปประกาศทางเข้า | `<section class="ch" data-enter="blurWords">` · หัวเรื่อง `data-t` · ตัวตาม `data-f` · รูป `data-w` · เนื้อหาอยู่ใน HTML ไม่อยู่ใน JS |
| renderer หนัก | โหลด three.js เป็น module ขนาน · รอ `neural:ready` หรือ 4 วินาที · probe WebGL · ไม่ผ่าน → `body.no-webgl` + fallback 2D canvas ที่สื่อความหมายเดียวกัน · `setAnimationLoop` เฉพาะตอนที่จอต้องการ |

## 2 · 15 กฎ

1. **ประตูเดียว** — ทุก duration · delay · stagger ผ่าน `T(s) = reduced ? 0 : s` ใน JS และ kill-switch 1 บล็อกใน CSS · ไม่เช็ก reduced-motion ในแต่ละ animation
2. **ทางเข้า 4 แบบต่อเว็บ** เลือกต่อบทในมาร์กอัป ไม่ซ้ำกันติดกัน 2 บท — «ห้ามใช้ fade+slide-up ซ้ำทุกจุด»
3. **ออกสั้นกว่าเข้าและเร่งออก** (`power3.in` 0.22 วินาที) · บทใหม่เข้าเมื่อกล้องบินไปได้ราว 40%
4. **ล้าง filter หลังเข้าเสร็จ** (`clearProps:'filter'`) ตัวหนังสือต้องคม · blur ≤ 10px สั้น ๆ · ไม่ animate `backdrop-filter`
5. **animate เฉพาะ transform · opacity · clip-path** (+ filter ช่วงสั้น) · ไม่แตะ width height top
6. บทที่ปิด `visibility:hidden` + `pointer-events:none` · สลับ `aria-hidden` ใน timeline · hash ด้วย `replaceState`
7. **พื้นหลังต้องมีความหมาย** — 1 จุด = 1 คน · เส้น = กำหนดการ · «ชี้เมาส์ = กล้องบินไปดูตรงนั้นทันที» · ไม่ใช่อนุภาคลอยเล่น ๆ
8. **renderer หนักโหลดทีหลัง** ตั้งเวลารอ 4 วินาที probe WebGL มี fallback 2D และ CSS สำหรับ `body.no-webgl`
9. **รายการในบทเลื่อนก่อน** ถึงขอบแล้วบอกใบ้ หยุดเลื่อนแล้วค่อยเปลี่ยนบท — «ไม่ให้หลุดบทตอนกำลังอ่าน»
10. **`passive:false` เฉพาะ wheel/touch ใน deck-mode** และถอดเมื่อเปลี่ยน route · `scroll` `pointermove` เป็น `{passive:true}` เสมอ
11. **แผนที่คีย์บอร์ดบังคับ** ↓ PgDn Space · ↑ PgUp · Home End · ข้ามเมื่ออยู่ใน input หรือ modal · ปุ่ม rail มี `aria-current="step"`
12. **ย้ายโฟกัสหลังเปลี่ยนบท** (`section tabindex="-1"` แล้ว `.focus()`) ไม่งั้นคีย์บอร์ดยังอยู่บทเก่า
13. **reduced motion ต้องเห็นเนื้อหาครบ** (WCAG 2.3.3) — พิมพ์ข้อความจริงทันที ทุกคำ `.on` อนุภาคอยู่ที่ปลายทาง
14. **จำกัดภาระ GPU** — `devicePixelRatio` ไม่เกิน 2 (1.75 บนจอ < 900px) · clamp `dt` 50 ms · loop วิ่งเฉพาะตอนต้องใช้
15. **ฟอนต์ self-host** แยกไทย/ละตินด้วย `unicode-range` · preload แค่ 2 น้ำหนักเหนือ fold · `font-display:swap`

## 3 · Recipe

โค้ดทุกตัวใน `references/recipes.md` (บล็อกละ ≤ 15 บรรทัด พร้อมที่มา)

| Recipe | ใช้ทำอะไร | ใช้ / ไม่ใช้ | reduced-motion |
|---|---|---|---|
| T gate + kill-switch | ประตูเดียวของทุกการเคลื่อนไหว | ทุกไฟล์ · ไม่เช็กซ้ำรายชิ้น | ตัวมันเอง |
| splitWords | แตกข้อความเป็น `.wd` ตามช่องว่าง | ก่อนทางเข้ารายคำ · ไทย = เว้นวรรคตามจังหวะที่อยากให้เข้า | ไม่กระทบ |
| blurWords | ทางเข้าค่าเริ่มต้น คำเบลอ → คม | หัวเรื่องไทย/ละติน ≤ 12 คำ | duration 0 · ล้าง blur |
| inkWords | คำเข้มขึ้นจาก .14 | ประโยคปิดยาว · อ่านออกตั้งแต่เฟรมแรก | เหมือนกัน |
| blurLine | ทั้งบล็อกเบลอเข้า stagger 0.08 | ตัวตาม `data-f` · ย่อหน้า · ฟอร์ม | เหมือนกัน |
| wipe | `clip-path` ล่าง → บน | รูปหรือ figure 1 ชิ้นต่อบท | เหมือนกัน |
| decodeWords | อักษรสุ่มวิ่งจนติด | หัวเรื่องละตินเท่านั้น · **ไม่ใช้กับไทย** (สระลอยแตก) | พิมพ์ข้อความจริงทันที |
| exit | ออกสั้น เร่งออก | คู่กับทุกทางเข้า | 0 |
| goChapter | timeline เดียว ออก → ซ่อน → กล้อง → โชว์ → เข้า | deck-mode | ทันที |
| iris | วงสีแบรนด์โตจากจุดคลิก สลับหน้าหลังวง | เปลี่ยน route จากการคลิก "ของ" บนจอ · ไม่ใช่ทุกการนำทาง | ข้าม ตั้ง hash ตรง ๆ |
| count-up | ตัวเลขไหลถึงค่า | สถิติ 1 ตัวที่อยากให้จำ · ไม่ทุกการ์ด | พิมพ์ค่าสุดท้าย |
| scroll reveal + .lines | CSS ทำท่า IO ติด `.in` | page-mode | kill-switch |
| scrubWords | คำสว่างตามตำแหน่งเลื่อน | ประโยคยาว 1 ประโยคต่อหน้า · ไม่ใช่เนื้อความ | ทุกคำ `.on` |
| wheel + ล็อกรายการใน | ล้อเมาส์เปลี่ยนบท รายการเลื่อนก่อน | deck-mode เท่านั้น · `passive:false` | T=0 ทำให้ทันที |
| Observer swipe | ปัดจอเปลี่ยนบท `tolerance:24` | มือถือ deck-mode · ข้าม `.scrollable` | เหมือนกัน |
| keyboard map | ↓ PgDn Space · ↑ PgUp · Home End | ทุกเว็บแบบบท (บังคับ) | เหมือนกัน |
| rail | รายการเลข 01–05 ขวาจอ · แถบล่างบนมือถือ | 3–7 บท | CSS อย่างเดียว |

## 4 · Token และสเกลตัวอักษร

**สีมาจากเนื้องาน** — มีสีแบรนด์ใช้สีนั้น · ไม่มี → ค่าประจำบ้าน `#2A78D6` (เฉดเข้ม `#226CC6` สำหรับตัวหนังสือบนพื้นสว่าง) เขียน `(รอยืนยัน)` แล้วทำต่อ · ค่าในตารางคือของเว็บต้นแบบ ให้ยึด**รายชื่อ token และหน้าที่** ไม่ใช่ค่าสี · ชื่อ token ตรงกับ `web-app-design` → `references/tokens.md` เพื่อให้หน้า page-mode (ฟอร์ม · แอดมิน) ใช้ชุดเดียวกันได้

| Token | ค่าต้นแบบ | บทบาทตัวอักษร | ค่า |
|---|---|---|---|
| `--bg` · `--surface` | `#F7F6F2` · `#FFF` | เนื้อความ | 400 16px/1.6 "IBM Plex Sans Thai", system-ui |
| `--ink` · `--ink-2` · `--muted` | `#0F0F0E` · `#3A3934` · `#6B6A63` | hero display | `clamp(52px, 8.4vw, 132px)` · lh 1.04 · ls -.035em · 700 |
| `--line` · `--line-2` | `#E4E1D8` · `#CFCBBF` | หัวบท (deck) | `clamp(42px, 5.7vw, 94px)` · lh 1.02 · ls -.04em |
| `--accent` · `--accent-ink` · `--accent-soft` | สีแบรนด์ · เฉดเข้ม · เฉดอ่อน 95% | kicker h2 | `clamp(40px, 5.2vw, 76px)` · lh 1.05 · ls -.035em |
| `--ok` `--warn` `--bad` (+ `-soft`) | เขียว · อำพัน · แดง — ไม่เปลี่ยนตามแบรนด์ | ประโยคปิด | `clamp(34px, 4.2vw, 66px)` · lh 1.16 · 600 · max-width 12.5em |
| `--ease` | `cubic-bezier(.16,1,.3,1)` (expo-out) | lead / hero-sub | 18px หรือ `clamp(17px,1.6vw,20px)` · max-width 34–36em |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | เลขใหญ่โปร่ง | `clamp(100px,9vw,170px)` · `-webkit-text-stroke` 1.5px ink 13% |
| `--r` · `--pad` · `--max` · `--top` | 8px · 24px→16px · 1200px · 64px→56px | eyebrow / เล็ก | 12–13px · ls .04–.28em (ละตินเท่านั้น) · `tabular-nums` |

- หัวใหญ่ไทยที่ `letter-spacing` ติดลบต้องดูจริงทุกน้ำหนัก — วรรณยุกต์ชนสระเมื่อไหร่ถอยเป็น -.01em · `uppercase` + ls กว้างใช้กับ eyebrow ละตินเท่านั้น (`web-app-design` ข้อ 5)
- พื้นหลัง 3D อยู่ที่ z-index 0 ใต้ `main` (z 1) · deck opacity 1 · page-mode .22 · มี scrim ไล่สี `.deck::before` «ให้ตัวหนังสืออ่านง่ายเหนือเครือข่าย»

## 5 · เลือกเครื่องมือ

| ความต้องการ | GSAP 3 (+ Observer · ScrollTrigger · SplitText) | CSS scroll-driven (`animation-timeline`) | View Transitions (same-document) | CSS scroll-snap |
|---|---|---|---|---|
| สถานะ 2026-10 | 3.15.0 บน cdnjs · ฟรีทุก plugin ตั้งแต่ 3.13 (2025-04) | MDN "Limited availability" · Chrome/Edge 115+ · Safari 26+ · Firefox หลัง flag (Interop 2026) | Baseline Newly available · Firefox 144 · Chrome 111 · Safari 18 | รองรับ 97% · Chrome 69 · Safari 11 · Firefox 68 |
| เลือกเมื่อ | บทที่ซ้อนเวลากัน · กล้อง/3D rig · จับ wheel และปัดจอ · แตกคำ | แถบความคืบหน้า · parallax · reveal ในหน้าเลื่อนปกติ — ต้องดูดีแม้ไม่ทำงาน | สลับ route หรือ state ที่ DOM เก่าและใหม่มีพร้อมกัน (รายการ → รายละเอียด · ธีม · สลับบทไม่มี 3D) | เว็บแบบบทที่ไม่มี JS · ต้องการให้เบราว์เซอร์จัดการเลื่อนเอง |
| ไม่ใช้กับ | reveal ง่าย ๆ ที่ CSS + IO ทำได้แล้ว | ของที่ต้องทำงานบน Firefox วันนี้โดยไม่มี fallback · scroll-jacking (ทำไม่ได้) | เอฟเฟกต์ต่อเนื่องตามการเลื่อน · กล้อง 3D | บทที่มีรายการเลื่อนข้างใน (snap จะแย่งกัน) · timeline ออก/เข้าซ้อนกัน |
| reduced motion | `T()` + `gsap.matchMedia()` | kill-switch `@media (prefers-reduced-motion)` | `::view-transition-group(*){animation:none}` | ปิด `scroll-behavior:smooth` |

- `@starting-style` (Baseline 2024-08) สำหรับ transition ตอนโผล่จาก `display:none` · Lenis 1.3.x (MIT) ถ้าต้องการเลื่อนนุ่ม — ขับด้วย `gsap.ticker` ให้มี rAF loop เดียว และ `respectReducedMotion:true` (ค่าเริ่มต้น)
- GSAP โหลดจาก cdnjs ตอน mockup · ส่งมอบจริงให้ self-host ไฟล์ไว้ใน `vendor/` (เว็บต้องเปิดได้โดยไม่พึ่ง CDN ที่ล่ม)
- ต้องการ API ของ GSAP ลึกกว่าที่หน้านี้บอก (pin และ scrub ของ ScrollTrigger · timeline ซ้อน · Flip · MorphSVG) → เปิด skill ทางการของผู้ผลิตที่ github.com/greensock/gsap-skills (MIT) แล้วอ่านเฉพาะไฟล์ของ plugin ที่ใช้ ไม่โหลดทั้งชุดเข้า context · กฎในหน้านี้ (reduced motion · passive · budget) ยังอยู่เหนือคำแนะนำของเขา

## 6 · ฟอนต์ไทยสำหรับหัวใหญ่

| ฟอนต์ | licence | เหมาะกับ | หมายเหตุ |
|---|---|---|---|
| IBM Plex Sans Thai | OFL 1.1 | เนื้อความ + หัวบท (เว็บต้นแบบใช้) | ละตินคือ Plex Sans · ไม่มีหัว (ตัวมีหัวแยกชื่อ IBM Plex Sans Thai Looped · ตรวจ 2026-10-23) อ่านง่ายขนาดเล็ก |
| Anuphan | OFL 1.1 | หัวใหญ่ไม่มีหัว ทันสมัย | ดัดแปลงจาก Plex Thai แบบไม่มีหัว · ls ติดลบได้ |
| Bai Jamjuree | OFL 1.1 | หัวใหญ่ทรงเหลี่ยม | ผู้ทำระบุ "เหมาะกับหัวเรื่อง" |
| Kanit | OFL 1.1 | หัวใหญ่หนา | ปลายตัด ls แคบได้ · น้ำหนักเยอะ |
| Noto Sans Thai | OFL 1.1 | fallback ปลอดภัยทุกงาน | คู่กับ Noto Sans ละติน |
| LINE Seed Sans TH | OFL 1.1 (github.com/line/seed) | หัวใหญ่กลมเป็นมิตร | บน Google Fonts (ยังไม่ได้ตรวจ) |
| Sarabun | OFL | เนื้อความราชการ | ไม่ใช่ฟอนต์หัวใหญ่ |
| Chakra Petch | (ยังไม่ได้ตรวจ) | หัวเทคโนโลยี — `html-slide-deck` ใช้ | ตรวจ licence ก่อน self-host |

**คู่กับละติน:** ไทยมีหัวคู่ละติน serif · ไทยไม่มีหัวคู่ละติน sans เป็นธรรมเนียมตั้งต้น ไม่ใช่กฎตายตัว ไทยมีหัวหลายตัวเข้ากับ sans ได้ แต่ serif คู่ไทยไม่มีหัวมักดูแปลก · ชุดที่ออกแบบคู่กันมาแล้ว: Trirong · Taviraj (ไทยมีหัว + serif · OFL) · IBM Plex Sans Thai (ไม่มีหัว + sans) · ที่มา: Anuthin Wongsunkakon หน้า Linotype Neue Frutiger Thai บน myfonts.com · Smich Smanloh "Thai Type Pairing" ATypI 2020 · คำอธิบาย Trirong และ Taviraj ใน google/fonts · Wikipedia IBM Plex (ตรวจทั้งหมด 2026-10-23)

ทั้งหมดดาวน์โหลดเป็น woff2 มา self-host (กฎ 15) · ไม่ `<link>` Google Fonts ในไฟล์ส่งมอบ

## 7 · ตรวจก่อนส่ง

- [ ] คีย์บอร์ดครบ: ↓ PgDn Space · ↑ PgUp · Home End เปลี่ยนบทได้ · Tab ไล่ rail แล้วเห็นวงแหวนโฟกัส · โฟกัสย้ายตามบท
- [ ] เปิด reduced-motion (DevTools → Rendering → Emulate prefers-reduced-motion) แล้วเห็น**เนื้อหาครบทุกบท** ตัวเลขเป็นค่าสุดท้าย ไม่มีคำจาง
- [ ] ไม่มี fade-up ซ้ำทุกจุด — ไล่ `data-enter` ทุกบท ไม่ซ้ำกันติดกัน
- [ ] Lighthouse Best Practices ไม่ฟ้อง passive listeners · `wheel`/`touch` แบบ `passive:false` มีเฉพาะ deck-mode และถอดเมื่อออกจากโหมด
- [ ] ฟอนต์ self-host · preload 2 น้ำหนัก · ถอดเน็ตแล้วตัวอักษรยังเป็นฟอนต์ที่ตั้งใจ
- [ ] ตัด WebGL (DevTools → Rendering → Disable WebGL หรือ `body.no-webgl`) แล้ว fallback 2D ขึ้นและอ่านได้
- [ ] trackpad ปัดแรง 1 ครั้ง = เปลี่ยน 1 บท · รายการในบทเลื่อนจนสุดก่อนแล้วค่อยเปลี่ยนบท
- [ ] ไม่มีสี hardcode นอกบล็อก token (`web-app-design` → `scripts/check-design-tokens.mjs`)
- [ ] ถ่ายภาพ 1440 · 900 · 420 ทุกบท (`web-app-design` → `scripts/screenshot.py`) แล้วเปิดดูจริง · rail ที่ < 900px เป็นแถบล่างและไม่ทับเนื้อหา
- [ ] ไล่รายการ a11y และ motion ของ vercel-labs/web-interface-guidelines (สำเนาในเครื่อง ไม่ fetch ตอนรัน) เฉพาะหมวด focus · motion · touch target · contrast กับทุกบท — ใช้เป็นรายการตรวจ ไม่คัดลอกข้อความ (MIT · ตรวจ 2026-10-23)

## 8 · Anti-patterns

- **fade + slide-up ทุกชิ้น** — สัญญาณ AI (`no-ai-look` catalog ข้อ fade-up) · แก้ด้วยทางเข้า 4 แบบ (กฎ 2)
- **blur ค้างบนตัวหนังสือ** หลังเข้าเสร็จ — ต้อง `clearProps`
- **ล็อก `busy` ยาว** จนเครื่องช้าค้าง — ปลดเองใน 2.4 วินาที
- **แรงเฉื่อย trackpad ข้าม 2 บท** — ทิ้ง delta < 6 และภายใน 1 วินาทีหลังเปลี่ยนบท
- **หลุดบทตอนกำลังอ่านรายการ** เพราะล้อเมาส์เปลี่ยนบทด้วย — รายการเลื่อนก่อน (กฎ 9)
- **toast ผิดพลาดที่หายไปเอง** — ข้อความแนบจุดที่ผิดพร้อมปุ่มลองใหม่
- **ป้าย 3D ทับตัวหนังสือ** · แผนที่โผล่หลังหัวข้อของบทอื่น — ใช้ occluder และซ่อนตามบท
- **`pushState` ทุกบท** — ปุ่ม Back ต้องกด 5 ครั้งถึงออก · ใช้ `replaceState`
- **อนุภาคลอยไร้ความหมาย · glow วนไม่หยุด · gradient ไล่สีบนปุ่ม** — `no-ai-look` ทั้งชุด
- **ส่งงานโดยไม่เคยเปิดแบบ reduced-motion และไม่เคยถอด WebGL**

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| token สี · ฟอร์ม · ตาราง สำหรับหน้า page-mode (ลงทะเบียน · แอดมิน) | `web-app-design` → `references/tokens.md` |
| งบการเคลื่อนไหวของคอมโพเนนต์ทั่วไป (hover · modal ≤ 350 ms) | `ui-craft` ข้อ 7 |
| หลัก motion 12 ข้อ · easing · จังหวะข้อความบนจอ | `motion-basics` (plugin `graphic-design`) |
| ไล่สัญญาณ AI ก่อนส่ง (fade-up ทุกชิ้น · glow · เลขยักษ์) | `no-ai-look` (plugin `superuser`) |
| สไลด์นำเสนอแทนเว็บ · shell กดเปลี่ยนหน้า · โน้ตผู้พูด | `html-slide-deck` |
| โครงเรื่อง หัวบทเป็นข้อสรุป งบข้อความต่อบท | `presentation-design` |
| ถ้อยคำบนหน้า | `human-writing` |
| ตรวจ SEO ของหน้าที่ render ด้วย JS | `seo-audit-checklist` |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## แหล่งที่มา (ตรวจ 2026-10-22)

| เรื่อง | ที่มา |
|---|---|
| โครง · recipe · กฎ · anti-pattern | เว็บ ai4ba.ai-cie.com (index.html · css/styles.css · js/app.js · js/fx.js · js/neural.js · js/net3d.js) อ่านโค้ดสาธารณะ · ไม่มี licence ระบุ · vendor/ ที่เว็บใช้ไม่ได้ดาวน์โหลด (ยังไม่ได้ตรวจ) |
| GSAP ฟรี | README gsap@3.15.0 บน cdn.jsdelivr.net และ gsap.com/pricing "Now Free!" — ฟรีรวมทุก plugin ใช้เชิงพาณิชย์ได้ · ฟรีตั้งแต่ 3.13.0 (npm 2025-04-30) · licence ฉบับเต็ม (Standard "No Charge" GSAP License · มีผล 2025-04-30 · แก้ล่าสุด 2025-05-30) อ่านจากสำเนา web.archive.org/web/20261017164627/https://gsap.com/standard-license เพราะ gsap.com ตอบหน้าปิดปรับปรุงบางหน้า · ตัวบทห้ามเฉพาะ "Prohibited Uses" คือใช้ในเครื่องมือสร้างแอนิเมชันภาพแบบไม่เขียนโค้ดที่แข่งกับ Webflow · คำอธิบายสั้นบนหน้าเดียวกันยังเขียนว่าห้ามเก็บเงินผู้ใช้ปลายทาง ซึ่งขัดกับตัวบทและหน้า pricing จึงยึดตัวบท · ตรวจ 2026-10-26 · npm gsap@3.15.0 ระบุ license ชี้ gsap.com/standard-license และไม่มีไฟล์ LICENSE ในแพ็กเกจ |
| GSAP CDN | cdnjs.com/libraries/gsap 3.15.0 (2026-04-13) · `gsap.min.js` · plugin โฟลเดอร์เดียวกัน (`Observer.min.js` `ScrollTrigger.min.js` `SplitText.min.js` — ตรวจ 2026-10-26: ทั้ง 4 ไฟล์ตอบ HTTP 200 ที่ `cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/<ชื่อ>.min.js` · api.cdnjs.com/libraries/gsap ระบุ version 3.15.0 และ licence "Standard 'No Charge' GreenSock License") |
| CSS scroll-driven | developer.mozilla.org animation-timeline · drweb.de |
| View Transitions | web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available (2025-10-16) |
| `@starting-style` · scroll-snap | developer.mozilla.org/@starting-style · caniuse.com/css-snappoints |
| Lenis | github.com/darkroomengineering/lenis (MIT · 1.3.x) |
| Observer · SplitText | gsap.com/docs/v3/Plugins/Observer · Codrops "7 Must-Know GSAP Animation Tips" (2025-09-03) · Osmo masked text reveal |
| การเข้าถึง | WCAG 2.3.3 w3.org/WAI/WCAG21/Understanding/animation-from-interactions · Heilmann 2019 (โฟกัสหลังเลื่อน) · developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners |
| ประสิทธิภาพ | web.dev/articles/animations-guide (transform/opacity · will-change ประหยัด) · ต้นทุน blur และ backdrop-filter: blog.openreplay.com · f22labs.com (บทความชุมชน ไม่ใช่ benchmark) · ผลของ scroll-jacking ต่อ INP (ยังไม่ได้ตรวจ) |
| ฟอนต์ไทย | fontsource.org · fonts.google.com · github.com/line/seed |
| skill ภายนอกที่อ้างถึง | github.com/greensock/gsap-skills (MIT · ตามรายงานเทียบ 2026-10-22 · เนื้อหาไฟล์ยังไม่ได้ตรวจ) · github.com/vercel-labs/web-interface-guidelines (MIT · ตรวจ 2026-10-23) |
