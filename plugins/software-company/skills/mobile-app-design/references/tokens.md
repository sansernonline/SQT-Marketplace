# Token reference — ระบบดีไซน์แอปมือถือสไตล์ Speak Go

นิยามทั้งหมดอยู่ใน `assets/speakgo.css` บล็อก `:root`
**ทุกอย่างใต้บรรทัด `=== base ===` ห้ามมีสีดิบ** — ใช้ตัวตรวจตัวเดียวกับ `web-app-design` ได้

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
