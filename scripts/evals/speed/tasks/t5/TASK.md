# ชุดโมดูลหลักของระบบร้าน (ส่งมอบลูกค้าใช้จริง)

ทำ 6 โมดูลใน `src/` ให้ครบ แต่ละโมดูล**ไม่ขึ้นต่อกัน** · ESM · Node 22 · ห้ามใช้ dependency ภายนอก · ทุกโมดูลต้องมี unit test ของตัวเอง · รัน `npm test`

## 1 · `src/csv.js`
- `export function parseCsv(text)` → array ของแถว (array ของ string) ตาม RFC 4180: คั่นด้วย `,` · ช่องในเครื่องหมาย `"` มี `,` · ขึ้นบรรทัดใหม่ และ `""` (แทน `"` 1 ตัว) ได้ · บรรทัดใหม่เป็น `\n` หรือ `\r\n` · บรรทัดว่างท้ายไฟล์ไม่นับเป็นแถว · `"` ไม่ปิด → โยน `Error`
- `export function toCsv(rows)` → string · ใส่ `"` เฉพาะช่องที่มี `,` `"` หรือขึ้นบรรทัด · คั่นแถวด้วย `\r\n` · ไม่มี `\r\n` ท้ายสุด

## 2 · `src/slots.js` — หาช่วงว่างสำหรับจองคิว
`export function freeSlots({ open, close, duration, step, buffer = 0, bookings = [] })`
- เวลาเป็นนาทีนับจากเที่ยงคืน (เช่น 9:00 = 540) · คืน array ของเวลาเริ่ม (นาที) เรียงจากน้อยไปมาก
- ช่องเริ่มได้ที่ `open`, `open+step`, `open+2*step` … และต้องจบ (`start+duration`) ไม่เกิน `close`
- `bookings` = `[{ start, end }]` · ช่องที่ทับช่วง `[b.start - buffer, b.end + buffer)` ของการจองใดใช้ไม่ได้ (แตะขอบพอดีใช้ได้)
- `duration`, `step` ต้องเป็นจำนวนเต็มบวก และ `open < close` · ไม่ใช่ → โยน `Error`

## 3 · `src/cron.js` — คำนวณเวลารันถัดไปของ cron 5 ช่อง (UTC)
`export function nextRun(expr, from)` → `Date` แรกที่ **มากกว่า** `from` (ปัดลงเป็นนาที) ที่ตรงกับ `นาที ชั่วโมง วันของเดือน เดือน วันของสัปดาห์`
- แต่ละช่องรองรับ `*` · ตัวเลข · ช่วง `a-b` · รายการ `a,b` · ขั้น `*/n` และ `a-b/n` · วันของสัปดาห์ 0–6 (0 = อาทิตย์ · 7 ก็คืออาทิตย์)
- ถ้าทั้งวันของเดือนและวันของสัปดาห์ไม่ใช่ `*` → ตรงเมื่อ**อย่างใดอย่างหนึ่ง**ตรง (แบบ cron มาตรฐาน)
- รูปแบบผิด หรือค่านอกช่วง → โยน `Error`

## 4 · `src/semver.js`
- `export function compare(a, b)` → `-1 · 0 · 1` ตาม SemVer 2.0 รวม pre-release (`1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0`) · ไม่สนใจ build metadata (`+…`)
- `export function satisfies(version, range)` รองรับ: `1.2.3` (ตรงตัว) · `^1.2.3` · `~1.2.3` · `>=` `>` `<=` `<` · `1.x` / `1.2.x` / `*` · หลายเงื่อนไขคั่นด้วยเว้นวรรค = และ · `||` = หรือ · `^0.2.3` = `>=0.2.3 <0.3.0` · `^0.0.3` = `>=0.0.3 <0.0.4` · version ที่เป็น pre-release ผ่านได้เฉพาะเมื่อเงื่อนไขมี pre-release ของ `major.minor.patch` เดียวกัน

## 5 · `src/router.js`
`export function createRouter()` คืน object ที่มี
- `add(method, pattern, handler)` · pattern เช่น `/users/:id` · `/files/*` (`*` จับส่วนที่เหลือทั้งหมด ใส่ใน `params["*"]`)
- `match(method, url)` → `{ handler, params, query }` หรือ `null` · `query` แปลงจาก `?a=1&b=2` (ถอดรหัส `%xx` และ `+` = เว้นวรรค · คีย์ซ้ำ → array) · path ตัด `/` ท้ายได้ (`/users/1/` = `/users/1`) · ค่าใน params ถอดรหัส `%xx`
- ลำดับความสำคัญ: path ตรงตัว > มี `:param` > มี `*` (ไม่ขึ้นกับลำดับที่ add) · method ไม่ตรงแต่ path ตรง → คืน `{ allowed: [method ที่มี] }`

## 6 · `src/lru.js`
`export class LruCache` · `constructor({ max, ttlMs = 0, now = Date.now })`
- `get(key)` · `set(key, value)` · `has(key)` · `delete(key)` · `size` (getter)
- เกิน `max` → ทิ้งตัวที่ใช้ล่าสุดนานที่สุด (`get` และ `set` นับเป็นการใช้ · `has` ไม่นับ)
- `ttlMs > 0` → หมดอายุเมื่อ `now() - เวลาที่ set ≥ ttlMs` · ตัวที่หมดอายุ `get` ได้ `undefined` · `has` ได้ `false` · ไม่นับใน `size`
- `max` ต้องเป็นจำนวนเต็มบวก ไม่ใช่ → โยน `Error`
