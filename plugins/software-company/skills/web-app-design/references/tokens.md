# Token reference — ระบบดีไซน์เว็บแอปสไตล์ Apps Track

นิยามทั้งหมดอยู่ใน `assets/appstrack.css` บล็อก `:root`
**ทุกอย่างใต้บรรทัด `=== base ===` ห้ามมีสีดิบ** — ตัวตรวจใช้บรรทัดนั้นเป็นเส้นแบ่ง

## แบรนด์ / gradient

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--brand` | `#2a78d6` | ลิงก์ · แท็บที่เลือก · ไอคอน active · เส้นขอบตอนโฟกัส |
| `--brand-2` | `#6a5cd6` | ปลายไล่สี · accent รอง |
| `--brand-50` | `#eef4fd` | พื้นเมนู active · พื้น avatar · วงแหวนโฟกัส |
| `--brand-100` | `#dde9fb` | รางของ spinner |
| `--grad-accent` | `135deg #2a78d6 → #6a5cd6` | ปุ่มหลัก · chip ที่เลือก · แถบ progress |
| `--grad-primary` | `#14264a → #25498c → #4b63c9` | sidebar โหมดเข้ม |
| `--grad-page` | `160deg #f3f6fc → #f8f9fc → #f6f3fb` | พื้นหลังหน้า (fixed) |

> gradient ใช้กับ **ปุ่ม/chip/progress** เท่านั้น — **ห้ามใช้บนกราฟ** เพราะค่าสีจะสื่อความหมายผิด

## พื้นผิว · เส้น · เงา

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--bg` | `#f6f7fb` | พื้นหน้า |
| `--surface` | `#ffffff` | การ์ด · input · ปุ่มปกติ |
| `--surface-glass` | `rgba(255,255,255,.82)` | topbar โปร่ง (คู่กับ backdrop-filter) |
| `--line` | `#eef0f5` | เส้นในการ์ด · เส้นตาราง |
| `--line-strong` | `#e4e7ee` | ขอบ input · ขอบปุ่ม |
| `--shadow` | เงาสองชั้นบางมาก | การ์ดปกติ |
| `--shadow-lg` | เงาสองชั้นลึก | modal · toast · เมนูลอย |
| `--shadow-brand` | เงาโทนน้ำเงิน | ปุ่มหลักเท่านั้น |
| `--radius` / `--radius-sm` / `--radius-pill` | `14px` / `9px` / `99px` | การ์ด / ปุ่ม·input / pill·chip |

## ตัวอักษร

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--text` | `#333b4a` | หัวข้อ · ตัวเลข KPI |
| `--text-body` | `#414957` | เนื้อความ (ค่าเริ่มต้นของ body) |
| `--text-muted` | `#7d8492` | label · คำอธิบาย · เมนูที่ไม่ active |
| `--text-faint` | `#a9aeb9` | หัวตาราง · timestamp · empty state |

สเกล (เล็กกว่าเว็บทั่วไปโดยตั้งใจ — เป็นแอปที่ต้องอัดข้อมูล):

| ระดับ | ขนาด | |
|---|---|---|
| h1 | 19px / 500 | ชื่อหน้า |
| h2 | 15px / 500 | หัวการ์ด |
| h3 | 13px / 500 | หัวข้อย่อย |
| body | 12.5px / 1.6 | เนื้อความ · input · tab |
| ปุ่ม · pill row | 12px | |
| label · muted | 11px | |
| faint · หัวตาราง | 10.5px | หัวตารางเป็นตัวพิมพ์ใหญ่ letter-spacing .4px |
| ตัวเลข KPI | 22px / 600 | `letter-spacing:-.4px` + `tabular-nums` |

ฟอนต์ `Inter` + `Noto Sans Thai` — **Inter ไม่มีอักษรไทย** ถ้าลืมใส่ Noto Sans Thai
เบราว์เซอร์จะ fallback ไปฟอนต์ระบบที่ความสูงไม่เข้ากัน ตัวไทยจะดูเล็กและเตี้ยกว่าอังกฤษ

ตัวเลขทุกที่ที่เรียงเป็นคอลัมน์ต้องใส่ `.num` (`tabular-nums`) ไม่งั้นหลักจะไม่ตรงกัน

## สีข้อมูล (กราฟ) — ทึบเสมอ

`--c-blue #4a8ee0` · `--c-teal #2bbd8a` · `--c-amber #f0ad2e` · `--c-green #1f9d3f` ·
`--c-violet #6a5cc9` · `--c-red #e87f7c` · `--c-grey #c8ced9`
คู่แผน/จริง: `--c-plan #e0eaf8` vs `--c-actual #5a97e0` · เลยกำหนด `--c-late #e58079`

## Pill (สถานะ) — สามค่าเป็นชุด

| โทน | พื้น | ตัวอักษร | เส้น | ใช้กับ |
|---|---|---|---|---|
| green | `#e9f7ef` | `#17794a` | `#d6efe1` | เสร็จ · ปกติ |
| blue | `#eaf2fd` | `#2160ab` | `#d8e7fb` | รีวิว · กำลังดำเนินการ |
| amber | `#fdf5e4` | `#96660d` | `#f7e9c9` | รอ · เตือน |
| orange | `#fdefe6` | `#a2541b` | `#f8ddcb` | ใกล้เกินกำหนด |
| red | `#fdedec` | `#a63a34` | `#f8d9d7` | ค้าง · ผิดพลาด |
| violet | `#f1eefc` | `#52439f` | `#e3ddf8` | ประเภทพิเศษ |
| grey | `#f2f4f8` | `#626a7a` | `#e7eaf1` | ปิด · ยังไม่เริ่ม |

## เลย์เอาต์

| Token | ค่า |
|---|---|
| `--sidebar-w` | `232px` (≤1024px หด 64px · ≤720px เป็น drawer 240px) |
| `--topbar-h` | `56px` |
| `--content-max` | `1160px` |

จุดตัด: **1024px** sidebar หดเหลือไอคอน · **720px** sidebar เป็น drawer (`body.nav-open`)
ตารางกว้างเกินจอ → เลื่อนแนวนอน **เฉพาะใน `.tb-wrap`** ห้ามให้ทั้งหน้าเลื่อน

## เปลี่ยนธีม / เปลี่ยนแบรนด์

**สลับ accent ทั้งแอป** — `body[data-theme]`: ว่าง (ocean) · `emerald` · `sunset` · `plum` · `graphite`
แต่ละธีมแก้แค่ 5 token (`--grad-accent --brand --brand-2 --brand-50 --brand-100`)

**sidebar สว่าง/เข้ม** — `body[data-side='dark']` เปลี่ยน 8 token ของ sidebar
เมนู active ในโหมดเข้มใช้แผ่นทับโปร่ง `--on-brand-veil` **ไม่ใช่** `--brand-50`
เพราะสีอ่อนบนพื้นเข้มจะกลืนหายไปเลย

**แบรนด์ลูกค้าใหม่** — คัดลอกบล็อก `body[data-theme='…']` แล้วใส่ 5 ค่าของลูกค้า
ไม่ต้องแตะคอมโพเนนต์แม้แต่บรรทัดเดียว

## คลาสคอมโพเนนต์ที่มีให้แล้ว

| กลุ่ม | คลาส |
|---|---|
| โครง | `.app-shell` `.app-sidebar` `.nav-link(.on)` `.app-topbar` `.app-main > .inner` `.page-head` |
| การ์ด | `.card` `.card-head` `.card-body` |
| KPI | `.stat-grid` `.card.stat` (`.label` `.value` `.foot`) |
| สถานะ | `.pill.pill-green/blue/amber/orange/red/violet/grey` |
| ปุ่ม | `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` |
| ฟอร์ม | `.field > label` `.input` `.select` `.textarea` `.err` |
| ตาราง | `.tb-wrap > .tb` (`.right`) |
| ตัวกรอง | `.chips > .chip(.on)` · `.tabs > .tab(.on)` |
| อื่น | `.prog > i` `.ava(.ava-lg)` `.md-html` `.empty` `.spinner` `.toasts > .toast(.ok/.err)` `.backdrop + .modal` |
| ยูทิลิตี | `.row` `.row-between` `.col` `.grow` `.ellipsis` `.wrap` `.mt-*` `.mb-*` `.gap-*` `.num` `.muted` `.faint` |
